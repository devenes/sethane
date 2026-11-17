import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CheckCircle2,
  ChevronRight,
  Edit3,
  Maximize2,
  MessageSquare,
  MessageSquareOff,
  Minimize2,
  Pause,
  Play,
  RotateCcw,
  SkipBack,
  SkipForward,
  Smartphone,
  Volume2,
  VolumeX,
  X,
  Zap,
} from 'lucide-react';
import { ExerciseDetailModal } from '../../components/common/ExerciseDetailModal';
import { ExerciseVisual, MotionToggleButton } from '../../components/common/ExerciseVisual';
import { WorkoutTimerEngine } from '../../engine/timer-engine';
import type { EngineEvent, SessionMachineState, WorkoutPhase } from '../../engine/types';
import { getExerciseById } from '../../data/exercises/catalog';
import { WEEKLY_DAY_ORDER } from '../../data/workouts/weekly-program';
import { soundService } from '../../services/audio/sound-service';
import { speechService } from '../../services/speech/speech-service';
import { wakeLockService } from '../../services/wake-lock/wake-lock-service';
import { useSettingsStore } from '../../stores/settings-store';
import { useWorkoutStore } from '../../stores/workout-store';
import type { Exercise } from '../../types';
import { formatClock, formatHumanDuration } from '../../utils/format';
import {
  getCategoryLabel,
  getMuscleLabel,
  getPhaseDisplayLabel,
  UI_STRINGS,
} from '../../utils/i18n';

function getPhaseColorClasses(phase: WorkoutPhase): {
  containerBg: string;
  dividerBorder: string;
  mutedText: string;
  sessionProgressTrack: string;
  sessionProgressFill: string;
  visualPanelBg: string;
  timerPanelBg: string;
  bannerBg: string;
  accentText: string;
  progressTrack: string;
  progressBar: string;
  listCardBg: string;
  listCardActiveBg: string;
  listThumbBg: string;
  summaryChipBg: string;
} {
  switch (phase) {
    case 'work':
      return {
        containerBg: 'bg-emerald-700 border-emerald-400/60',
        dividerBorder: 'border-emerald-400/35',
        mutedText: 'text-emerald-100',
        sessionProgressTrack: 'bg-emerald-950/60',
        sessionProgressFill: 'bg-white',
        visualPanelBg: 'bg-emerald-900/75 border-emerald-400/45',
        timerPanelBg: 'bg-emerald-800/85 border-emerald-400/50',
        bannerBg: 'bg-white text-emerald-950',
        accentText: 'text-white',
        progressTrack: 'bg-emerald-950/65',
        progressBar: 'bg-white',
        listCardBg: 'bg-emerald-900/65 border-emerald-400/35',
        listCardActiveBg: 'bg-emerald-950/80 border-white ring-1 ring-white/50',
        listThumbBg: 'bg-emerald-950/80 border-emerald-400/35',
        summaryChipBg: 'bg-emerald-900/75 border-emerald-400/40 text-emerald-50',
      };
    case 'rest':
    case 'round-rest':
      return {
        containerBg: 'bg-sky-700 border-sky-300/60',
        dividerBorder: 'border-sky-300/35',
        mutedText: 'text-sky-100',
        sessionProgressTrack: 'bg-sky-950/60',
        sessionProgressFill: 'bg-white',
        visualPanelBg: 'bg-sky-900/75 border-sky-300/45',
        timerPanelBg: 'bg-sky-800/85 border-sky-300/50',
        bannerBg: 'bg-white text-sky-950',
        accentText: 'text-white',
        progressTrack: 'bg-sky-950/65',
        progressBar: 'bg-white',
        listCardBg: 'bg-sky-900/65 border-sky-300/35',
        listCardActiveBg: 'bg-sky-950/80 border-white ring-1 ring-white/50',
        listThumbBg: 'bg-sky-950/80 border-sky-300/35',
        summaryChipBg: 'bg-sky-900/75 border-sky-300/40 text-sky-50',
      };
    case 'prepare':
    case 'warmup':
      return {
        containerBg: 'bg-[#090d14] border-slate-800',
        dividerBorder: 'border-slate-800/90',
        mutedText: 'text-slate-400',
        sessionProgressTrack: 'bg-slate-900',
        sessionProgressFill: 'bg-emerald-500',
        visualPanelBg: 'bg-[#070b14] border-slate-800/90',
        timerPanelBg: 'bg-slate-900/85 border-slate-800',
        bannerBg: 'bg-amber-400 text-slate-950',
        accentText: 'text-amber-400',
        progressTrack: 'bg-slate-800',
        progressBar: 'bg-amber-400',
        listCardBg: 'bg-[#0d1320] border-slate-800/90',
        listCardActiveBg: 'bg-[#0d1320] border-emerald-500 ring-1 ring-emerald-500/40',
        listThumbBg: 'bg-[#070b14] border-slate-800/80',
        summaryChipBg: 'bg-slate-900 border-slate-800 text-slate-200',
      };
    case 'cooldown':
      return {
        containerBg: 'bg-[#090d14] border-slate-800',
        dividerBorder: 'border-slate-800/90',
        mutedText: 'text-slate-400',
        sessionProgressTrack: 'bg-slate-900',
        sessionProgressFill: 'bg-emerald-500',
        visualPanelBg: 'bg-[#070b14] border-slate-800/90',
        timerPanelBg: 'bg-slate-900/85 border-slate-800',
        bannerBg: 'bg-slate-300 text-slate-950',
        accentText: 'text-slate-200',
        progressTrack: 'bg-slate-800',
        progressBar: 'bg-slate-300',
        listCardBg: 'bg-[#0d1320] border-slate-800/90',
        listCardActiveBg: 'bg-[#0d1320] border-emerald-500 ring-1 ring-emerald-500/40',
        listThumbBg: 'bg-[#070b14] border-slate-800/80',
        summaryChipBg: 'bg-slate-900 border-slate-800 text-slate-200',
      };
    case 'completed':
      return {
        containerBg: 'bg-[#090d14] border-slate-800',
        dividerBorder: 'border-slate-800/90',
        mutedText: 'text-slate-400',
        sessionProgressTrack: 'bg-slate-900',
        sessionProgressFill: 'bg-emerald-500',
        visualPanelBg: 'bg-[#070b14] border-slate-800/90',
        timerPanelBg: 'bg-slate-900/85 border-slate-800',
        bannerBg: 'bg-emerald-500 text-slate-950',
        accentText: 'text-emerald-400',
        progressTrack: 'bg-slate-800',
        progressBar: 'bg-emerald-400',
        listCardBg: 'bg-[#0d1320] border-slate-800/90',
        listCardActiveBg: 'bg-[#0d1320] border-emerald-500 ring-1 ring-emerald-500/40',
        listThumbBg: 'bg-[#070b14] border-slate-800/80',
        summaryChipBg: 'bg-slate-900 border-slate-800 text-slate-200',
      };
    case 'idle':
      return {
        containerBg: 'bg-[#090d14] border-slate-800',
        dividerBorder: 'border-slate-800/90',
        mutedText: 'text-slate-400',
        sessionProgressTrack: 'bg-slate-900',
        sessionProgressFill: 'bg-emerald-500',
        visualPanelBg: 'bg-[#070b14] border-slate-800/90',
        timerPanelBg: 'bg-slate-900/85 border-slate-800',
        bannerBg: 'bg-slate-800 text-slate-200',
        accentText: 'text-slate-100',
        progressTrack: 'bg-slate-800',
        progressBar: 'bg-slate-600',
        listCardBg: 'bg-[#0d1320] border-slate-800/90',
        listCardActiveBg: 'bg-[#0d1320] border-emerald-500 ring-1 ring-emerald-500/40',
        listThumbBg: 'bg-[#070b14] border-slate-800/80',
        summaryChipBg: 'bg-slate-900 border-slate-800 text-slate-200',
      };
  }
}

export const WorkoutPlayerPage: React.FC = () => {
  const navigate = useNavigate();
  const activeWorkout = useWorkoutStore((s) => s.activeWorkout);
  const presets = useWorkoutStore((s) => s.presets);
  const customWorkouts = useWorkoutStore((s) => s.customWorkouts);
  const selectWorkoutForPlayer = useWorkoutStore((s) => s.selectWorkoutForPlayer);
  const setEditingWorkout = useWorkoutStore((s) => s.setEditingWorkout);
  const recordCompletedSession = useWorkoutStore((s) => s.recordCompletedSession);

  const locale = useSettingsStore((s) => s.locale);
  const soundEnabled = useSettingsStore((s) => s.soundEnabled);
  const speechEnabled = useSettingsStore((s) => s.speechEnabled);
  const countdownBeepsEnabled = useSettingsStore((s) => s.countdownBeepsEnabled);
  const wakeLockEnabled = useSettingsStore((s) => s.wakeLockEnabled);
  const preferredVoiceURI = useSettingsStore((s) => s.preferredVoiceURI);
  const speechRate = useSettingsStore((s) => s.speechRate);
  const soundVolume = useSettingsStore((s) => s.soundVolume);
  const updateSettings = useSettingsStore((s) => s.updateSettings);

  const t = UI_STRINGS[locale].player;
  const td = UI_STRINGS[locale].dashboard;

  const containerRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<WorkoutTimerEngine | null>(null);
  const completionRecordedRef = useRef(false);
  const autoStartRef = useRef(false);

  const [sessionState, setSessionState] = useState<SessionMachineState>(() =>
    new WorkoutTimerEngine(activeWorkout).getState()
  );
  const [liveAnnouncement, setLiveAnnouncement] = useState('');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [wakeLockActive, setWakeLockActive] = useState(false);
  const [inspectedExercise, setInspectedExercise] = useState<Exercise | null>(null);

  const handleEngineEvent = useCallback(
    (event: EngineEvent, state: SessionMachineState) => {
      if (event.type === 'COUNTDOWN_TICK') {
        if (soundEnabled && countdownBeepsEnabled) {
          soundService.playCountdownTick(soundVolume);
        }
        return;
      }

      if (event.type === 'PHASE_CHANGED') {
        const { step } = event;
        const currEx = step.exerciseId ? getExerciseById(step.exerciseId) : undefined;
        const nextEx = step.nextExerciseId ? getExerciseById(step.nextExerciseId) : undefined;

        if (soundEnabled) {
          if (step.phase === 'work') {
            soundService.playWorkStart(soundVolume);
          } else {
            soundService.playRestStart(soundVolume);
          }
        }

        const announcementText = speechService.buildPhaseAnnouncement(
          step,
          locale,
          currEx?.name[locale],
          nextEx?.name[locale]
        );
        setLiveAnnouncement(announcementText);

        if (speechEnabled) {
          speechService.speak(announcementText, {
            locale,
            voiceURI: preferredVoiceURI,
            rate: speechRate,
            volume: soundVolume,
          });
        }
        return;
      }

      if (event.type === 'WORKOUT_COMPLETED') {
        if (soundEnabled) {
          soundService.playWorkoutComplete(soundVolume);
        }
        const doneText = speechService.buildCompletionAnnouncement(locale);
        setLiveAnnouncement(doneText);
        if (speechEnabled) {
          speechService.speak(doneText, {
            locale,
            voiceURI: preferredVoiceURI,
            rate: speechRate,
            volume: soundVolume,
          });
        }
        if (!completionRecordedRef.current) {
          completionRecordedRef.current = true;
          void recordCompletedSession({
            workoutId: activeWorkout.id,
            workoutName: activeWorkout.name,
            durationSeconds: Math.max(1, Math.round(state.totalDurationMs / 1000)),
            roundsCompleted: activeWorkout.rounds,
            exercisesCount: activeWorkout.exercises.length,
          });
        }
      }
    },
    [
      activeWorkout,
      countdownBeepsEnabled,
      locale,
      preferredVoiceURI,
      recordCompletedSession,
      soundEnabled,
      soundVolume,
      speechEnabled,
      speechRate,
    ]
  );

  useEffect(() => {
    window.scrollTo(0, 0);
    speechService.warmup();
  }, []);

  useEffect(() => {
    completionRecordedRef.current = false;
    const engine = new WorkoutTimerEngine(activeWorkout, {
      tickIntervalMs: 100,
      callbacks: {
        onStateChange: (nextState) => setSessionState(nextState),
        onEvent: (ev, nextState) => handleEngineEvent(ev, nextState),
      },
    });
    engineRef.current = engine;
    setSessionState(engine.getState());
    if (autoStartRef.current) {
      autoStartRef.current = false;
      engine.start();
    }

    return () => {
      engine.destroy();
      speechService.cancel();
      void wakeLockService.release();
    };
  }, [activeWorkout]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (engineRef.current) {
      engineRef.current.setCallbacks({
        onStateChange: (nextState) => setSessionState(nextState),
        onEvent: (ev, nextState) => handleEngineEvent(ev, nextState),
      });
    }
  }, [handleEngineEvent]);

  useEffect(() => {
    if (
      sessionState.phase === 'work' ||
      sessionState.phase === 'rest' ||
      sessionState.phase === 'round-rest'
    ) {
      document.body.dataset.playerPhase = sessionState.phase;
    } else {
      delete document.body.dataset.playerPhase;
    }
    return () => {
      delete document.body.dataset.playerPhase;
    };
  }, [sessionState.phase]);

  useEffect(() => {
    const syncWakeLock = async () => {
      if (sessionState.status === 'running' && wakeLockEnabled) {
        const ok = await wakeLockService.request();
        setWakeLockActive(ok);
      } else {
        await wakeLockService.release();
        setWakeLockActive(false);
      }
    };
    void syncWakeLock();
  }, [sessionState.status, wakeLockEnabled]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        engineRef.current?.tick();
        if (engineRef.current?.getState().status === 'running' && wakeLockEnabled) {
          void wakeLockService.request().then(setWakeLockActive);
        }
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [wakeLockEnabled]);

  const handleStart = useCallback(() => {
    soundService.unlock();
    completionRecordedRef.current = false;
    engineRef.current?.start();
  }, []);

  const handleStartNoWarmup = useCallback(() => {
    soundService.unlock();
    completionRecordedRef.current = false;
    if (activeWorkout.warmupSeconds === 0 && activeWorkout.cooldownSeconds === 0) {
      engineRef.current?.start();
      return;
    }
    autoStartRef.current = true;
    selectWorkoutForPlayer({
      ...activeWorkout,
      warmupSeconds: 0,
      cooldownSeconds: 0,
    });
  }, [activeWorkout, selectWorkoutForPlayer]);

  const handleEditWorkout = useCallback(() => {
    speechService.cancel();
    engineRef.current?.stop();

    if (activeWorkout.id.startsWith('weekly-')) {
      const dayKey = activeWorkout.id.slice('weekly-'.length);
      if ((WEEKLY_DAY_ORDER as readonly string[]).includes(dayKey)) {
        navigate(`/weekly?day=${dayKey}`);
        return;
      }
    }

    const savedCustom = customWorkouts.find((w) => w.id === activeWorkout.id);
    if (savedCustom) {
      setEditingWorkout(savedCustom);
      navigate('/builder');
      return;
    }

    const sourcePreset = presets.find((p) => p.id === activeWorkout.id) ?? activeWorkout;
    const baseTitle = sourcePreset.localizedName?.[locale] ?? sourcePreset.name;
    setEditingWorkout({
      ...sourcePreset,
      id: `custom-${Date.now()}`,
      name: baseTitle,
      localizedName: undefined,
      isPreset: false,
    });
    navigate('/builder');
  }, [activeWorkout, customWorkouts, locale, navigate, presets, setEditingWorkout]);

  const handlePause = useCallback(() => {
    speechService.cancel();
    engineRef.current?.pause();
  }, []);

  const handleResume = useCallback(() => {
    soundService.unlock();
    engineRef.current?.resume();
  }, []);

  const handleSkip = useCallback(() => {
    soundService.unlock();
    engineRef.current?.skip();
  }, []);

  const handlePrevious = useCallback(() => {
    soundService.unlock();
    engineRef.current?.previous();
  }, []);

  const handleRestart = useCallback(() => {
    soundService.unlock();
    completionRecordedRef.current = false;
    engineRef.current?.restart();
  }, []);

  const handleExit = () => {
    speechService.cancel();
    engineRef.current?.stop();
    navigate('/');
  };

  // Keyboard transport shortcuts (Space = Start/Pause/Resume, Arrows = Prev/Skip, R = Restart)
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if (inspectedExercise) return;
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.closest('dialog') ||
          target.tagName === 'BUTTON' ||
          target.tagName === 'INPUT' ||
          target.tagName === 'SELECT' ||
          target.tagName === 'TEXTAREA' ||
          target.tagName === 'A')
      ) {
        return;
      }

      const st = engineRef.current?.getState();
      if (!st) return;

      if (e.code === 'Space') {
        e.preventDefault();
        if (st.status === 'idle') handleStart();
        else if (st.status === 'running') handlePause();
        else if (st.status === 'paused') handleResume();
      } else if (e.code === 'ArrowRight' && st.status !== 'idle') {
        e.preventDefault();
        handleSkip();
      } else if (e.code === 'ArrowLeft' && st.status !== 'idle') {
        e.preventDefault();
        handlePrevious();
      } else if (e.code === 'KeyR') {
        e.preventDefault();
        handleRestart();
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [handlePause, handlePrevious, handleRestart, handleResume, handleSkip, handleStart, inspectedExercise]);

  const toggleFullscreen = async () => {
    if (!document.fullscreenElement) {
      try {
        await containerRef.current?.requestFullscreen();
        setIsFullscreen(true);
      } catch {
        setIsFullscreen(false);
      }
    } else {
      try {
        await document.exitFullscreen();
        setIsFullscreen(false);
      } catch {
        // Ignore
      }
    }
  };

  const currentStep = sessionState.steps[sessionState.currentStepIndex];
  const currentExerciseId =
    currentStep?.exerciseId ??
    (currentStep?.phase === 'prepare' || currentStep?.phase === 'warmup'
      ? currentStep.nextExerciseId
      : undefined);
  const currentExercise = currentExerciseId ? getExerciseById(currentExerciseId) : undefined;
  const nextExercise = currentStep?.nextExerciseId
    ? getExerciseById(currentStep.nextExerciseId)
    : undefined;

  const isRestPreview =
    (sessionState.phase === 'rest' || sessionState.phase === 'round-rest') && Boolean(nextExercise);
  const visualExercise = isRestPreview ? nextExercise : currentExercise;

  const phaseStyle = getPhaseColorClasses(sessionState.phase);
  const stepProgressPct =
    sessionState.stepDurationMs > 0
      ? Math.min(
          100,
          Math.max(
            0,
            ((sessionState.stepDurationMs - sessionState.remainingMs) /
              sessionState.stepDurationMs) *
              100
          )
        )
      : 0;
  const totalProgressPct = Math.round(sessionState.progressRatio * 100);

  const workoutDisplayName = activeWorkout.localizedName?.[locale] ?? activeWorkout.name;

  return (
    <div
      ref={containerRef}
      data-testid="workout-player"
      data-phase={sessionState.phase}
      className={`rounded-2xl ${phaseStyle.containerBg} text-white border p-3.5 sm:p-5 space-y-3 sm:space-y-4 transition-colors duration-200`}
    >
      {/* Screen Reader Live Region */}
      <div className="visually-hidden" aria-live="polite" aria-atomic="true">
        {liveAnnouncement}
      </div>

      {/* Compact Top Instrument Bar */}
      <div
        className={`flex flex-wrap items-center justify-between gap-2 pb-2.5 border-b ${phaseStyle.dividerBorder}`}
      >
        <div className="min-w-0">
          <h1 className="text-sm sm:text-base font-extrabold m-0 text-white truncate">
            {workoutDisplayName}
          </h1>
          <div
            className={`text-xs mono-readout ${phaseStyle.mutedText} flex items-center gap-2.5 mt-0.5`}
          >
            {currentStep?.round && currentStep?.totalRounds && (
              <span data-testid="player-round-indicator">
                {t.roundCounter} {currentStep.round}/{currentStep.totalRounds}
              </span>
            )}
            {currentStep?.exerciseIndex && currentStep?.totalExercisesInRound && (
              <span data-testid="player-exercise-indicator">
                {t.exerciseCounter} {currentStep.exerciseIndex}/
                {currentStep.totalExercisesInRound}
              </span>
            )}
            <span>{totalProgressPct}%</span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          <button
            type="button"
            onClick={() => void updateSettings({ soundEnabled: !soundEnabled })}
            aria-pressed={soundEnabled}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-bold inline-flex items-center gap-1 border cursor-pointer transition-colors ${
              soundEnabled
                ? 'bg-slate-900 border-emerald-500/50 text-emerald-400'
                : 'bg-slate-900 border-slate-800 text-slate-400'
            }`}
          >
            {soundEnabled ? (
              <Volume2 className="w-3.5 h-3.5" aria-hidden="true" />
            ) : (
              <VolumeX className="w-3.5 h-3.5" aria-hidden="true" />
            )}
            <span className="hidden sm:inline">{soundEnabled ? t.soundOn : t.soundOff}</span>
          </button>

          <button
            type="button"
            onClick={() => void updateSettings({ speechEnabled: !speechEnabled })}
            aria-pressed={speechEnabled}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-bold inline-flex items-center gap-1 border cursor-pointer transition-colors ${
              speechEnabled
                ? 'bg-slate-900 border-emerald-500/50 text-emerald-400'
                : 'bg-slate-900 border-slate-800 text-slate-400'
            }`}
          >
            {speechEnabled ? (
              <MessageSquare className="w-3.5 h-3.5" aria-hidden="true" />
            ) : (
              <MessageSquareOff className="w-3.5 h-3.5" aria-hidden="true" />
            )}
            <span className="hidden sm:inline">{speechEnabled ? t.voiceOn : t.voiceOff}</span>
          </button>

          <MotionToggleButton locale={locale} variant="dark" />

          {wakeLockActive && (
            <span
              title={t.wakeLockActive}
              className="px-2 py-1.5 rounded-lg text-xs font-semibold bg-slate-900 border border-slate-800 text-slate-300 inline-flex items-center gap-1"
            >
              <Smartphone className="w-3.5 h-3.5 text-emerald-400" aria-hidden="true" />
            </span>
          )}

          <button
            type="button"
            onClick={() => void toggleFullscreen()}
            aria-label={isFullscreen ? t.exitFullscreen : t.fullscreen}
            className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:border-slate-600 cursor-pointer"
          >
            {isFullscreen ? (
              <Minimize2 className="w-3.5 h-3.5" aria-hidden="true" />
            ) : (
              <Maximize2 className="w-3.5 h-3.5" aria-hidden="true" />
            )}
          </button>

          <button
            type="button"
            onClick={handleExit}
            className="px-2.5 py-1.5 rounded-lg text-xs font-bold bg-slate-900 border border-slate-800 text-rose-400 hover:border-rose-500/50 inline-flex items-center gap-1 cursor-pointer"
          >
            <X className="w-3.5 h-3.5" aria-hidden="true" />
            <span>{t.stop}</span>
          </button>
        </div>
      </div>

      {/* Session Progress Line */}
      <div className={`w-full h-1.5 ${phaseStyle.sessionProgressTrack} rounded-full overflow-hidden`}>
        <div
          className={`h-full ${phaseStyle.sessionProgressFill} progress-fill`}
          style={{ width: `${totalProgressPct}%` }}
        />
      </div>

      {sessionState.status === 'completed' ? (
        <div
          data-testid="workout-completed-view"
          className="py-8 px-4 text-center space-y-5 max-w-md mx-auto"
        >
          <div className="w-14 h-14 rounded-2xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-400 inline-flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-8 h-8" aria-hidden="true" />
          </div>
          <div className="space-y-1">
            <h2 className="text-2xl sm:text-3xl font-black m-0">{t.completedHeadline}</h2>
            <p className="text-slate-400 text-xs sm:text-sm m-0">{t.completedSub}</p>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-3">
              <div className="text-[11px] text-slate-400 font-semibold">{t.roundCounter}</div>
              <div className="text-xl font-black mono-readout text-emerald-400">
                {activeWorkout.rounds}
              </div>
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-3">
              <div className="text-[11px] text-slate-400 font-semibold">Total</div>
              <div className="text-xl font-black mono-readout text-white">
                {formatHumanDuration(Math.round(sessionState.totalDurationMs / 1000), locale)}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2.5 pt-1">
            <button
              type="button"
              onClick={handleRestart}
              className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold px-5 py-2.5 rounded-xl text-xs inline-flex items-center gap-1.5 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
              <span>{t.playAgain}</span>
            </button>
            <button
              type="button"
              onClick={() => navigate('/')}
              className="bg-slate-800 hover:bg-slate-700 text-white font-bold px-5 py-2.5 rounded-xl text-xs cursor-pointer"
            >
              {t.backToDashboard}
            </button>
          </div>
        </div>
      ) : (
        /* Active Layout: Visual Exercise Viewport First on Mobile, Balanced Split on Desktop */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5 sm:gap-4 items-stretch">
          {/* Visual Movement Viewport */}
          {visualExercise && (
            <div
              className={`lg:col-span-6 ${phaseStyle.visualPanelBg} border rounded-xl p-2.5 sm:p-3 flex flex-col justify-between gap-2 transition-colors duration-200`}
            >
              <button
                type="button"
                onClick={() => setInspectedExercise(visualExercise)}
                data-testid="player-visual-inspect"
                aria-label={`${visualExercise.name[locale]} — ${UI_STRINGS[locale].exercises.viewDetails}`}
                className="w-full text-left cursor-pointer bg-transparent border-0 p-0 text-inherit space-y-2 group"
              >
                <div className="flex items-center justify-between gap-2 px-1">
                  <span className="text-xs font-extrabold uppercase tracking-wider text-white group-hover:underline truncate">
                    {isRestPreview
                      ? `${t.upNext}: ${visualExercise.name[locale]}`
                      : visualExercise.name[locale]}
                  </span>
                  <span className={`text-[11px] mono-readout ${phaseStyle.mutedText} shrink-0`}>
                    {visualExercise.defaultWorkSeconds}s
                  </span>
                </div>

                <ExerciseVisual
                  media={visualExercise.media}
                  locale={locale}
                  staticOnly={sessionState.status === 'paused'}
                  className="w-full h-44 sm:h-60 lg:h-72 object-contain mx-auto rounded-lg"
                />
              </button>

              {/* Desktop inline cues; Mobile compact <details> so timer stays above fold */}
              <ol
                className={`hidden lg:block text-xs text-slate-100 space-y-1 pl-4 m-0 border-t ${phaseStyle.dividerBorder} pt-2`}
              >
                {visualExercise.instructions[locale].slice(0, 2).map((step, i) => (
                  <li key={i}>{step}</li>
                ))}
              </ol>
              <details
                className={`lg:hidden border-t ${phaseStyle.dividerBorder} pt-1.5 text-xs text-slate-100`}
              >
                <summary
                  className={`cursor-pointer font-bold text-[11px] ${phaseStyle.mutedText} select-none`}
                >
                  {t.formTips}
                </summary>
                <ol className="space-y-1 pl-4 m-0 pt-1.5">
                  {visualExercise.instructions[locale].slice(0, 2).map((step, i) => (
                    <li key={i}>{step}</li>
                  ))}
                </ol>
              </details>
            </div>
          )}

          {/* Precision Countdown & Transport Panel */}
          <div
            className={`${
              visualExercise ? 'lg:col-span-6' : 'lg:col-span-12'
            } flex flex-col items-center justify-between text-center p-4 sm:p-6 rounded-xl ${phaseStyle.timerPanelBg} border space-y-3 sm:space-y-4 transition-colors duration-200`}
          >
            <div
              data-testid="player-phase-badge"
              className={`px-3.5 py-1 rounded-md text-xs font-black tracking-widest uppercase ${phaseStyle.bannerBg}`}
            >
              {getPhaseDisplayLabel(sessionState.phase, locale)}
            </div>

            <div className="w-full space-y-2.5">
              <div
                data-testid="player-countdown"
                className={`text-6xl sm:text-8xl font-black mono-readout leading-none ${phaseStyle.accentText}`}
              >
                {formatClock(sessionState.remainingSeconds)}
              </div>

              <div
                className={`w-full max-w-sm mx-auto h-2 ${phaseStyle.progressTrack} rounded-full overflow-hidden`}
              >
                <div
                  className={`h-full progress-fill ${phaseStyle.progressBar}`}
                  style={{ width: `${stepProgressPct}%` }}
                />
              </div>

              <div className="space-y-0.5">
                <h2
                  data-testid="player-current-exercise"
                  className="text-lg sm:text-2xl font-extrabold m-0 text-white"
                >
                  {sessionState.phase === 'warmup' ? (
                    t.phaseWarmup
                  ) : sessionState.phase === 'cooldown' ? (
                    t.phaseCooldown
                  ) : sessionState.phase === 'rest' || sessionState.phase === 'round-rest' ? (
                    getPhaseDisplayLabel(sessionState.phase, locale)
                  ) : currentExercise ? (
                    <button
                      type="button"
                      onClick={() => setInspectedExercise(currentExercise)}
                      className="text-white hover:underline cursor-pointer bg-transparent border-0 p-0 font-inherit text-inherit"
                    >
                      {currentExercise.name[locale]}
                    </button>
                  ) : (
                    workoutDisplayName
                  )}
                </h2>
                {nextExercise && (
                  <button
                    type="button"
                    onClick={() => setInspectedExercise(nextExercise)}
                    data-testid="player-next-exercise"
                    className={`text-xs font-semibold ${phaseStyle.mutedText} hover:underline inline-flex items-center gap-1 cursor-pointer bg-transparent border-0 p-0`}
                  >
                    <span>{t.upNext}:</span>
                    <span className="text-white font-bold">{nextExercise.name[locale]}</span>
                    <ChevronRight className="w-3.5 h-3.5" aria-hidden="true" />
                  </button>
                )}
              </div>
            </div>

            {/* Transport Controls — Primary Row + Program Actions */}
            <div className="w-full space-y-2.5">
              <div className="flex items-center justify-center gap-2 w-full">
                <button
                  type="button"
                  onClick={handlePrevious}
                  disabled={sessionState.status === 'idle'}
                  aria-label={t.previous}
                  data-testid="btn-previous"
                  className="p-3 rounded-xl bg-slate-900/90 hover:bg-slate-800 disabled:opacity-35 text-white cursor-pointer transition-colors"
                >
                  <SkipBack className="w-5 h-5" aria-hidden="true" />
                </button>

                {sessionState.status === 'idle' && (
                  <button
                    type="button"
                    onClick={handleStart}
                    data-testid="btn-start"
                    className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black px-5 sm:px-7 py-3 rounded-xl text-sm sm:text-base inline-flex items-center gap-2 cursor-pointer transition-colors"
                  >
                    <Play className="w-5 h-5 fill-current" aria-hidden="true" />
                    <span>{t.start}</span>
                  </button>
                )}

                {sessionState.status === 'running' && (
                  <button
                    type="button"
                    onClick={handlePause}
                    data-testid="btn-pause"
                    className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-black px-5 sm:px-7 py-3 rounded-xl text-sm sm:text-base inline-flex items-center gap-2 cursor-pointer transition-colors"
                  >
                    <Pause className="w-5 h-5 fill-current" aria-hidden="true" />
                    <span>{t.pause}</span>
                  </button>
                )}

                {sessionState.status === 'paused' && (
                  <button
                    type="button"
                    onClick={handleResume}
                    data-testid="btn-resume"
                    className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black px-5 sm:px-7 py-3 rounded-xl text-sm sm:text-base inline-flex items-center gap-2 cursor-pointer transition-colors"
                  >
                    <Play className="w-5 h-5 fill-current" aria-hidden="true" />
                    <span>{t.resume}</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={handleSkip}
                  disabled={sessionState.status === 'idle'}
                  aria-label={t.skip}
                  data-testid="btn-skip"
                  className="p-3 rounded-xl bg-slate-900/90 hover:bg-slate-800 disabled:opacity-35 text-white cursor-pointer transition-colors"
                >
                  <SkipForward className="w-5 h-5" aria-hidden="true" />
                </button>

                <button
                  type="button"
                  onClick={handleRestart}
                  aria-label={t.restart}
                  data-testid="btn-restart"
                  className="p-3 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-200 cursor-pointer transition-colors"
                >
                  <RotateCcw className="w-4 h-4" aria-hidden="true" />
                </button>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-2">
                {sessionState.status === 'idle' && activeWorkout.warmupSeconds > 0 && (
                  <button
                    type="button"
                    onClick={handleStartNoWarmup}
                    data-testid="btn-start-no-warmup"
                    className="px-3.5 py-2 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700 hover:border-emerald-500/60 text-slate-100 text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer transition-colors"
                  >
                    <Zap className="w-3.5 h-3.5 text-emerald-400" aria-hidden="true" />
                    <span>{t.startNoWarmup}</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={handleEditWorkout}
                  data-testid="btn-player-edit"
                  className="px-3.5 py-2 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700 hover:border-emerald-500/60 text-slate-100 text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer transition-colors"
                >
                  <Edit3 className="w-3.5 h-3.5 text-emerald-400" aria-hidden="true" />
                  <span>{t.editWorkout}</span>
                </button>
              </div>

              <div className={`hidden md:block text-[11px] mono-readout ${phaseStyle.mutedText}`}>
                {t.shortcutsHint}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Program Exercise Sequence Overview */}
      {sessionState.status !== 'completed' && activeWorkout.exercises.length > 0 && (
        <section
          data-testid="player-exercise-list"
          className={`pt-3 sm:pt-4 border-t ${phaseStyle.dividerBorder} space-y-2.5`}
        >
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-white m-0">
              {t.programMovesHeading}
            </h2>
            <div
              className={`flex flex-wrap items-center gap-1.5 text-[11px] mono-readout ${phaseStyle.mutedText}`}
            >
              <span className={`px-2 py-0.5 rounded border font-bold ${phaseStyle.summaryChipBg}`}>
                {activeWorkout.rounds} {td.roundsLabel} · {activeWorkout.exercises.length}{' '}
                {td.exercisesLabel}
              </span>
              {activeWorkout.warmupSeconds > 0 && (
                <span className={`px-2 py-0.5 rounded border ${phaseStyle.summaryChipBg}`}>
                  {formatHumanDuration(activeWorkout.warmupSeconds, locale)} {t.warmupSummaryChip}
                </span>
              )}
              {activeWorkout.cooldownSeconds > 0 && (
                <span className={`px-2 py-0.5 rounded border ${phaseStyle.summaryChipBg}`}>
                  {formatHumanDuration(activeWorkout.cooldownSeconds, locale)}{' '}
                  {t.cooldownSummaryChip}
                </span>
              )}
            </div>
          </div>

          <ol className="list-none m-0 p-0 grid grid-cols-1 md:grid-cols-2 gap-2.5">
            {activeWorkout.exercises.map((item, idx) => {
              const ex = getExerciseById(item.exerciseId);
              const isLastInRound = idx === activeWorkout.exercises.length - 1;
              const isActiveMove =
                sessionState.status !== 'idle' &&
                currentStep?.exerciseIndex === idx + 1 &&
                (sessionState.phase === 'work' || sessionState.phase === 'rest');
              const moveName = ex ? ex.name[locale] : item.exerciseId;

              return (
                <li
                  key={`${item.id ?? item.exerciseId}-${idx}`}
                  data-testid={`player-exercise-item-${idx}`}
                  className={`rounded-xl border p-2.5 flex items-center gap-3 transition-colors ${
                    isActiveMove ? phaseStyle.listCardActiveBg : phaseStyle.listCardBg
                  }`}
                >
                  {ex ? (
                    <button
                      type="button"
                      onClick={() => setInspectedExercise(ex)}
                      data-testid={`player-inspect-exercise-${idx}`}
                      aria-label={`${moveName} — ${UI_STRINGS[locale].exercises.viewDetails}`}
                      className="w-full flex items-center gap-3 text-left cursor-pointer bg-transparent border-0 p-0 text-inherit group"
                    >
                      <div
                        className={`w-24 sm:w-28 shrink-0 rounded-lg border overflow-hidden group-hover:border-white/60 transition-colors ${phaseStyle.listThumbBg}`}
                      >
                        <ExerciseVisual
                          media={ex.media}
                          locale={locale}
                          loading="lazy"
                          staticOnly={
                            sessionState.status === 'paused' ||
                            (sessionState.status === 'running' && !isActiveMove)
                          }
                          className="w-full aspect-[10/7] object-contain"
                        />
                      </div>

                      <div className="min-w-0 flex-1 space-y-1">
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-1.5 min-w-0">
                            <span
                              className={`shrink-0 w-5 h-5 rounded-md text-[11px] font-black mono-readout inline-flex items-center justify-center ${
                                isActiveMove
                                  ? 'bg-emerald-400 text-slate-950'
                                  : 'bg-slate-900/90 text-slate-200'
                              }`}
                            >
                              {idx + 1}
                            </span>
                            <span className="text-xs sm:text-sm font-extrabold text-white group-hover:underline truncate">
                              {moveName}
                            </span>
                          </div>

                          {isActiveMove && (
                            <span className="shrink-0 px-1.5 py-0.5 rounded bg-slate-950/70 border border-white/40 text-white text-[10px] font-bold uppercase tracking-wider">
                              {t.activeMoveBadge}
                            </span>
                          )}
                        </div>

                        <div className={`text-[11px] ${phaseStyle.mutedText} truncate`}>
                          {getCategoryLabel(ex.category, locale)} ·{' '}
                          {ex.muscleGroups.map((m) => getMuscleLabel(m, locale)).join(', ')}
                        </div>

                        <div className="flex flex-wrap items-center gap-1.5 pt-0.5 mono-readout text-[11px]">
                          <span className="px-2 py-0.5 rounded bg-slate-950/55 border border-emerald-400/50 text-emerald-200 font-bold">
                            {item.workSeconds}s {t.workLabelShort}
                          </span>
                          {!isLastInRound && item.restSeconds > 0 && (
                            <span className="px-2 py-0.5 rounded bg-slate-950/55 border border-sky-300/50 text-sky-200 font-semibold">
                              {item.restSeconds}s {t.restLabelShort}
                            </span>
                          )}
                          {isLastInRound &&
                            activeWorkout.rounds > 1 &&
                            activeWorkout.restBetweenRounds > 0 && (
                              <span className="px-2 py-0.5 rounded bg-slate-950/55 border border-sky-300/50 text-sky-200 font-semibold">
                                {activeWorkout.restBetweenRounds}s {t.roundRestShort}
                              </span>
                            )}
                        </div>
                      </div>
                    </button>
                  ) : (
                    <div className="min-w-0 flex-1 space-y-1">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <span className="shrink-0 w-5 h-5 rounded-md text-[11px] font-black mono-readout inline-flex items-center justify-center bg-slate-900/90 text-slate-200">
                          {idx + 1}
                        </span>
                        <span className="text-xs sm:text-sm font-extrabold text-white truncate">
                          {moveName}
                        </span>
                      </div>
                    </div>
                  )}
                </li>
              );
            })}
          </ol>
        </section>
      )}

      <ExerciseDetailModal
        exercise={inspectedExercise}
        locale={locale}
        onClose={() => setInspectedExercise(null)}
      />
    </div>
  );
};
