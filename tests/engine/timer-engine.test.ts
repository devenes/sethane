import { afterEach, describe, expect, it, vi } from 'vitest';
import { calculateWorkoutSummary, resolveWorkoutTimeline } from '../../src/engine/phase-resolver';
import { WorkoutTimerEngine } from '../../src/engine/timer-engine';
import type { EngineEvent, WorkoutPlanInput } from '../../src/engine/types';
import { EXERCISES_CATALOG } from '../../src/data/exercises/catalog';
import { PRESET_WORKOUTS } from '../../src/data/workouts/presets';
import {
  formatExerciseNameForSpeech,
  normalizeTurkishSpeechText,
  speechService,
} from '../../src/services/speech/speech-service';

const SAMPLE_WORKOUT: WorkoutPlanInput = {
  id: 'sample-2-round',
  name: 'Sample 2-Round HIIT',
  prepareSeconds: 5,
  warmupSeconds: 10,
  rounds: 2,
  restBetweenRounds: 20,
  cooldownSeconds: 15,
  exercises: [
    { exerciseId: 'push-ups', workSeconds: 30, restSeconds: 10 },
    { exerciseId: 'air-squats', workSeconds: 40, restSeconds: 15 },
  ],
};

describe('Phase Resolver & Timeline Invariants', () => {
  it('omits trailing exercise rest on the last exercise of every round and inserts round-rest only between rounds', () => {
    const steps = resolveWorkoutTimeline(SAMPLE_WORKOUT);
    const phases = steps.map((s) => `${s.phase}:${s.durationSeconds}`);

    expect(phases).toEqual([
      'prepare:5',
      'warmup:10',
      // Round 1
      'work:30',
      'rest:10',
      'work:40', // Notice: air-squats has restSeconds:15, but it is last in round 1 -> omitted!
      'round-rest:20',
      // Round 2
      'work:30',
      'rest:10',
      'work:40', // Last exercise in final round -> no rest and no round-rest!
      'cooldown:15',
    ]);
  });

  it('handles zero-duration warmup, rest, round-rest, and cooldown without emitting 0s steps', () => {
    const zeroRestWorkout: WorkoutPlanInput = {
      id: 'zero-rest',
      name: 'Zero Rest EMOM',
      prepareSeconds: 0,
      warmupSeconds: 0,
      rounds: 2,
      restBetweenRounds: 0,
      cooldownSeconds: 0,
      exercises: [
        { exerciseId: 'burpees', workSeconds: 25, restSeconds: 0 },
        { exerciseId: 'mountain-climbers', workSeconds: 35, restSeconds: 0 },
      ],
    };

    const steps = resolveWorkoutTimeline(zeroRestWorkout);
    expect(steps.map((s) => `${s.phase}:${s.exerciseId}:${s.round}`)).toEqual([
      'work:burpees:1',
      'work:mountain-climbers:1',
      'work:burpees:2',
      'work:mountain-climbers:2',
    ]);
    expect(steps.every((s) => s.durationSeconds > 0)).toBe(true);
  });

  it('computes exact duration summary for the 10-Minute Full Body HIIT preset', () => {
    const preset10 = PRESET_WORKOUTS.find((w) => w.id === 'full-body-hiit-10')!;
    const summary = calculateWorkoutSummary(preset10);

    // 2 rounds * (6 * 35s work + 5 * 15s rest) + 30s round rest = 2 * 285 + 30 = 600s (10:00 exact!)
    expect(summary.coreHiitSeconds).toBe(600);
    expect(summary.warmupSeconds).toBe(300);
    expect(summary.cooldownSeconds).toBe(180);
  });
});

describe('WorkoutTimerEngine State Machine', () => {
  it('supports start, pause, and resume without losing remaining millisecond precision', () => {
    let clockMs = 1_000_000;
    const engine = new WorkoutTimerEngine(SAMPLE_WORKOUT, {
      now: () => clockMs,
    });

    expect(engine.getState().status).toBe('idle');

    engine.start();
    expect(engine.getState().status).toBe('running');
    expect(engine.getState().phase).toBe('prepare');
    expect(engine.getState().remainingMs).toBe(5000);

    // Advance 2,350ms into 5,000ms prepare phase
    clockMs += 2350;
    engine.tick();
    expect(engine.getState().remainingMs).toBe(2650);
    expect(engine.getState().remainingSeconds).toBe(3);

    // Pause and let 60 seconds pass while paused
    engine.pause();
    expect(engine.getState().status).toBe('paused');
    expect(engine.getState().remainingMs).toBe(2650);

    clockMs += 60_000;
    engine.tick();
    expect(engine.getState().remainingMs).toBe(2650);

    // Resume and advance remaining 2,650ms to transition to warmup
    engine.resume();
    expect(engine.getState().status).toBe('running');
    clockMs += 2650;
    engine.tick();
    expect(engine.getState().phase).toBe('warmup');
    expect(engine.getState().remainingMs).toBe(10_000);

    engine.destroy();
  });

  it('supports skip and previous across phases and rounds', () => {
    const clockMs = 50_000;
    const engine = new WorkoutTimerEngine(SAMPLE_WORKOUT, {
      now: () => clockMs,
    });

    engine.start();
    expect(engine.getState().phase).toBe('prepare');

    engine.skip();
    expect(engine.getState().phase).toBe('warmup');

    engine.skip();
    expect(engine.getState().phase).toBe('work');
    expect(engine.getState().steps[engine.getState().currentStepIndex]?.exerciseId).toBe(
      'push-ups'
    );

    engine.previous();
    expect(engine.getState().phase).toBe('warmup');

    engine.destroy();
  });

  it('emits 3-2-1 countdown ticks once per threshold and transitions cleanly through rounds to completion', () => {
    let clockMs = 0;
    const events: EngineEvent[] = [];

    const miniWorkout: WorkoutPlanInput = {
      id: 'mini',
      name: 'Mini Test',
      prepareSeconds: 0,
      warmupSeconds: 0,
      rounds: 2,
      restBetweenRounds: 5,
      cooldownSeconds: 0,
      exercises: [{ exerciseId: 'push-ups', workSeconds: 5, restSeconds: 5 }],
    };

    const engine = new WorkoutTimerEngine(miniWorkout, {
      now: () => clockMs,
      callbacks: {
        onEvent: (ev) => events.push(ev),
      },
    });

    engine.start(); // Round 1 Work (5s: 0 -> 5000)
    expect(engine.getState().phase).toBe('work');

    // Step in 500ms increments through the 5s work phase
    for (let t = 500; t <= 4500; t += 500) {
      clockMs = t;
      engine.tick();
    }

    const countdownTicks = events.filter((e) => e.type === 'COUNTDOWN_TICK');
    expect(countdownTicks.map((e) => e.type === 'COUNTDOWN_TICK' && e.secondsLeft)).toEqual([
      3, 2, 1,
    ]);

    // Cross boundary at 5000ms -> Round 1 ends, transitions to round-rest (5s)
    clockMs = 5000;
    engine.tick();
    expect(engine.getState().phase).toBe('round-rest');

    // Cross boundary at 10000ms -> Round 2 Work (5s)
    clockMs = 10_000;
    engine.tick();
    expect(engine.getState().phase).toBe('work');
    expect(engine.getState().steps[engine.getState().currentStepIndex]?.round).toBe(2);

    // Cross boundary at 15000ms -> Workout Completed!
    clockMs = 15_000;
    engine.tick();
    expect(engine.getState().status).toBe('completed');
    expect(engine.getState().phase).toBe('completed');

    // Extra ticks after completion must NOT emit duplicate WORKOUT_COMPLETED events
    clockMs = 20_000;
    engine.tick();
    const completionEvents = events.filter((e) => e.type === 'WORKOUT_COMPLETED');
    expect(completionEvents).toHaveLength(1);

    engine.destroy();
  });

  it('resynchronizes accurately when returning from a backgrounded tab after multiple phases elapsed', () => {
    let clockMs = 0;
    const events: EngineEvent[] = [];

    const engine = new WorkoutTimerEngine(SAMPLE_WORKOUT, {
      now: () => clockMs,
      callbacks: {
        onEvent: (ev) => events.push(ev),
      },
    });

    engine.start(); // prepare (5s) + warmup (10s) + R1 Ex1 work (30s) + R1 Ex1 rest (10s) = 55s
    events.length = 0; // Clear initial start event

    // Simulate background tab for 62 seconds: lands 7s into Round 1 Exercise 2 ('air-squats', 40s)
    clockMs = 62_000;
    engine.tick();

    const state = engine.getState();
    expect(state.phase).toBe('work');
    expect(state.steps[state.currentStepIndex]?.exerciseId).toBe('air-squats');
    expect(state.remainingMs).toBe(33_000);
    expect(state.remainingSeconds).toBe(33);

    // Only ONE phase change event should fire for the newly active phase (not 4 stale ones)
    const phaseEvents = events.filter((e) => e.type === 'PHASE_CHANGED');
    expect(phaseEvents).toHaveLength(1);
    if (phaseEvents[0]?.type === 'PHASE_CHANGED') {
      expect(phaseEvents[0].skippedIntermediatePhases).toBe(3);
    }

    engine.destroy();
  });
});

describe('SpeechService — Turkish & English Voice Selection and Pronunciation', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  function makeMockVoice(partial: {
    name: string;
    lang: string;
    voiceURI?: string;
    default?: boolean;
    localService?: boolean;
  }): SpeechSynthesisVoice {
    return {
      name: partial.name,
      lang: partial.lang,
      voiceURI: partial.voiceURI ?? partial.name,
      default: partial.default ?? false,
      localService: partial.localService ?? true,
    };
  }

  it('always selects a Turkish voice for tr locale even when an English voice is default or saved in preferredVoiceURI', () => {
    const samantha = makeMockVoice({ name: 'Samantha', lang: 'en-US', default: true });
    const albert = makeMockVoice({ name: 'Albert', lang: 'en-US' });
    const yelda = makeMockVoice({ name: 'Yelda', lang: 'tr_TR', voiceURI: 'Yelda' });
    const spokenUtterances: SpeechSynthesisUtterance[] = [];

    class MockUtterance {
      public text: string;
      public lang = '';
      public voice: SpeechSynthesisVoice | null = null;
      public rate = 1;
      public volume = 1;
      public onend: (() => void) | null = null;
      public onerror: (() => void) | null = null;
      constructor(text: string) {
        this.text = text;
      }
    }

    vi.stubGlobal('SpeechSynthesisUtterance', MockUtterance);
    Object.defineProperty(window, 'speechSynthesis', {
      configurable: true,
      writable: true,
      value: {
        speaking: false,
        pending: false,
        paused: false,
        getVoices: () => [samantha, albert, yelda],
        cancel: vi.fn(),
        speak: vi.fn((u: SpeechSynthesisUtterance) => {
          spokenUtterances.push(u);
        }),
        addEventListener: vi.fn(),
      },
    });

    // Turkish locale with an English preferredVoiceURI ('Samantha') must ignore Samantha and pick Yelda
    const trVoices = speechService.getVoicesForLocale('tr');
    expect(trVoices).toHaveLength(1);
    expect(trVoices[0]?.name).toBe('Yelda');

    speechService.speak('Hazırlan. İlk hareket: Dambıl Thruster (Squat + Pres)', {
      locale: 'tr',
      voiceURI: 'Samantha',
    });

    expect(spokenUtterances).toHaveLength(1);
    expect(spokenUtterances[0]?.voice?.name).toBe('Yelda');
    expect(spokenUtterances[0]?.lang).toBe('tr-TR');
    expect(spokenUtterances[0]?.text).toBe(
      'Hazırlan. İlk hareket: Dambıl Skuat ve Omuz Pres'
    );

    // English locale prefers natural voice (Samantha) over novelty voice (Albert) and keeps English text intact
    speechService.speak('Work! Dumbbell Thruster', {
      locale: 'en',
    });

    expect(spokenUtterances).toHaveLength(2);
    expect(spokenUtterances[1]?.voice?.name).toBe('Samantha');
    expect(spokenUtterances[1]?.lang).toBe('en-US');
    expect(spokenUtterances[1]?.text).toBe('Work! Dumbbell Thruster');
  });

  it('normalizes all 32 Turkish catalog exercise names for fluent Turkish TTS without parenthetical English duplicates', () => {
    for (const ex of EXERCISES_CATALOG) {
      const spokenTr = formatExerciseNameForSpeech(ex.name.tr, 'tr');
      expect(spokenTr).toBeDefined();
      expect(spokenTr).not.toMatch(/[()&+]/);
      expect(spokenTr).not.toMatch(
        /\b(Thruster|Squat|Deadlift|Burpee|Push-Up|Jumping Jack|Glute Bridge|High Knees|Russian Twist|Inchworm|Flutter Kicks|Step Jack|Biceps Curl|Triceps|Lunge|Dead Bug)\b/i
      );

      const spokenEn = formatExerciseNameForSpeech(ex.name.en, 'en');
      expect(spokenEn).toBe(ex.name.en);
    }

    expect(normalizeTurkishSpeechText('Başla! Şınav (Push-Up)')).toBe('Başla! Şınav');
    expect(
      normalizeTurkishSpeechText('Dinlen. Sıradaki: Jumping Jack (Yıldız Sıçrayışı)')
    ).toBe('Dinlen. Sıradaki: Yıldız Sıçrayışı');
  });
});

