import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CheckCircle2,
  ChevronRight,
  Maximize2,
  Minimize2,
  Pause,
  Play,
  RotateCcw,
  SkipBack,
  SkipForward,
  Smartphone,
  Square,
  Volume2,
  VolumeX,
  MessageSquare,
  MessageSquareOff,
} from 'lucide-react';
import { WorkoutTimerEngine } from '../../engine/timer-engine';
import type { EngineEvent, SessionMachineState, WorkoutPhase } from '../../engine/types';
import { getExerciseById } from '../../data/exercises/catalog';
import { soundService } from '../../services/audio/sound-service';
import { speechService } from '../../services/speech/speech-service';
import { wakeLockService } from '../../services/wake-lock/wake-lock-service';
import { useSettingsStore } from '../../stores/settings-store';
import { useWorkoutStore } from '../../stores/workout-store';
import { resolveAssetUrl } from '../../utils/assets';
import { formatClock, formatHumanDuration } from '../../utils/format';
import { getPhaseDisplayLabel, UI_STRINGS } from '../../utils/i18n';

function getPhaseColorClasses(phase: WorkoutPhase): {
  bannerBg: string;
  accentText: string;
  ringColor: string;
  progressBar: string;
} {
  switch (phase) {
    case 'work':
      return {
        bannerBg: 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400',
        accentText: 'text-emerald-400',
        ringColor: 'border-emerald-500/50',
        progressBar: 'bg-emerald-500',
      };
    case 'rest':
    case 'round-rest':
      return {
        bannerBg: 'bg-cyan-500/20 border-cyan-500/40 text-cyan-300',
        accentText: 'text-cyan-400',
        ringColor: 'border-cyan-500/50',
        progressBar: 'bg-cyan-400',
      };
    case 'prepare':
    case 'warmup':
      return {
        bannerBg: 'bg-amber-500/20 border-amber-500/40 text-amber-300',
        accentText: 'text-amber-400',
        ringColor: 'border-amber-500/50',
        progressBar: 'bg-amber-400',
      };
    case 'cooldown':
      return {
        bannerBg: 'bg-indigo-500/20 border-indigo-500/40 text-indigo-300',
        accentText: 'text-indigo-400',
        ringColor: 'border-indigo-500/50',
        progressBar: 'bg-indigo-400',
      };
    case 'completed':
      return {
        bannerBg: 'bg-emerald-500/25 border-emerald-400/50 text-emerald-300',
        accentText: 'text-emerald-400',
        ringColor: 'border-emerald-400/60',
        progressBar: 'bg-emerald-400',
      };
    case 'idle':
      return {
        bannerBg: 'bg-slate-800 border-slate-700 text-slate-300',
        accentText: 'text-slate-200',
        ringColor: 'border-slate-700',
        progressBar: 'bg-slate-500',
      };
  }
}

export const WorkoutPlayerPage: React.FC = () => {
  const navigate = useNavigate();
  const activeWorkout = useWorkoutStore((s) => s.activeWorkout);
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

  const containerRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<WorkoutTimerEngine | null>(null);
  const completionRecordedRef = useRef(false);

  const [sessionState, setSessionState] = useState<SessionMachineState>(() =>
    new WorkoutTimerEngine(activeWorkout).getState()
  );
  const [liveAnnouncement, setLiveAnnouncement] = useState('');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [wakeLockActive, setWakeLockActive] = useState(false);

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

  // Synchronize Wake Lock and tab visibility resync
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

  const handleStart = () => {
    soundService.unlock();
    completionRecordedRef.current = false;
    engineRef.current?.start();
  };

  const handlePause = () => {
    speechService.cancel();
    engineRef.current?.pause();
  };

  const handleResume = () => {
    soundService.unlock();
    engineRef.current?.resume();
  };

  const handleSkip = () => {
    soundService.unlock();
    engineRef.current?.skip();
  };

  const handlePrevious = () => {
    soundService.unlock();
    engineRef.current?.previous();
  };

  const handleRestart = () => {
    soundService.unlock();
    completionRecordedRef.current = false;
    engineRef.current?.restart();
  };

  const handleExit = () => {
    speechService.cancel();
    engineRef.current?.stop();
    navigate('/');
  };

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

  const phaseStyle = getPhaseColorClasses(sessionState.phase);
  const stepProgressPct =
    sessionState.stepDurationMs > 0
      ? Math.min(
          100,
          Math.max(0, ((sessionState.stepDurationMs - sessionState.remainingMs) / sessionState.stepDurationMs) * 100)
        )
      : 0;
  const totalProgressPct = Math.round(sessionState.progressRatio * 100);

  return (
    <div
      ref={containerRef}
      data-testid="workout-player"
      className="rounded-3xl bg-slate-950 text-white border border-slate-800 p-4 sm:p-6 md:p-8 shadow-2xl space-y-6"
    >
      {/* Centralized Screen Reader Live Region */}
      <div className="visually-hidden" aria-live="polite" aria-atomic="true">
        {liveAnnouncement}
      </div>

      {/* Top Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-lg sm:text-xl font-extrabold m-0 text-white">{activeWorkout.name}</h1>
          <div className="text-xs text-slate-400 flex items-center gap-3 mt-0.5">
            {currentStep?.round && currentStep?.totalRounds && (
              <span data-testid="player-round-indicator">
                {t.roundCounter} {currentStep.round} / {currentStep.totalRounds}
              </span>
            )}
            {currentStep?.exerciseIndex && currentStep?.totalExercisesInRound && (
              <span data-testid="player-exercise-indicator">
                {t.exerciseCounter} {currentStep.exerciseIndex} /{' '}
                {currentStep.totalExercisesInRound}
              </span>
            )}
            <span>{totalProgressPct}%</span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => void updateSettings({ soundEnabled: !soundEnabled })}
            aria-pressed={soundEnabled}
            className={`px-3 py-2 rounded-xl text-xs font-bold inline-flex items-center gap-1.5 border cursor-pointer transition-colors ${
              soundEnabled
                ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300'
                : 'bg-slate-900 border-slate-800 text-slate-400'
            }`}
          >
            {soundEnabled ? (
              <Volume2 className="w-4 h-4" aria-hidden="true" />
            ) : (
              <VolumeX className="w-4 h-4" aria-hidden="true" />
            )}
            <span>{soundEnabled ? t.soundOn : t.soundOff}</span>
          </button>

          <button
            type="button"
            onClick={() => void updateSettings({ speechEnabled: !speechEnabled })}
            aria-pressed={speechEnabled}
            className={`px-3 py-2 rounded-xl text-xs font-bold inline-flex items-center gap-1.5 border cursor-pointer transition-colors ${
              speechEnabled
                ? 'bg-cyan-500/15 border-cyan-500/40 text-cyan-300'
                : 'bg-slate-900 border-slate-800 text-slate-400'
            }`}
          >
            {speechEnabled ? (
              <MessageSquare className="w-4 h-4" aria-hidden="true" />
            ) : (
              <MessageSquareOff className="w-4 h-4" aria-hidden="true" />
            )}
            <span>{speechEnabled ? t.voiceOn : t.voiceOff}</span>
          </button>

          {wakeLockActive && (
            <span className="px-2.5 py-2 rounded-xl text-xs font-semibold bg-amber-500/15 border border-amber-500/30 text-amber-300 inline-flex items-center gap-1">
              <Smartphone className="w-3.5 h-3.5" aria-hidden="true" />
              <span className="hidden sm:inline">{t.wakeLockActive}</span>
            </span>
          )}

          <button
            type="button"
            onClick={() => void toggleFullscreen()}
            aria-label={isFullscreen ? t.exitFullscreen : t.fullscreen}
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:border-slate-600 cursor-pointer"
          >
            {isFullscreen ? (
              <Minimize2 className="w-4 h-4" aria-hidden="true" />
            ) : (
              <Maximize2 className="w-4 h-4" aria-hidden="true" />
            )}
          </button>

          <button
            type="button"
            onClick={handleExit}
            className="px-3 py-2 rounded-xl text-xs font-bold bg-rose-500/15 border border-rose-500/30 text-rose-300 hover:bg-rose-500/25 inline-flex items-center gap-1.5 cursor-pointer"
          >
            <Square className="w-3.5 h-3.5 fill-current" aria-hidden="true" />
            <span>{t.stop}</span>
          </button>
        </div>
      </div>

      {/* Overall Session Progress Bar */}
      <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-emerald-500 to-cyan-400 transition-all duration-150"
          style={{ width: `${totalProgressPct}%` }}
        />
      </div>

      {sessionState.status === 'completed' ? (
        /* Completed Celebration Screen */
        <div
          data-testid="workout-completed-view"
          className="py-10 px-4 text-center space-y-6 max-w-xl mx-auto"
        >
          <div className="w-20 h-20 rounded-3xl bg-emerald-500/20 border border-emerald-400/40 text-emerald-400 inline-flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-12 h-12" aria-hidden="true" />
          </div>
          <div className="space-y-2">
            <div className="inline-block px-4 py-1 rounded-full text-xs font-black tracking-widest uppercase bg-emerald-500/20 text-emerald-300">
              {t.phaseCompleted}
            </div>
            <h2 className="text-3xl sm:text-4xl font-black m-0">{t.completedHeadline}</h2>
            <p className="text-slate-400 text-sm sm:text-base m-0">{t.completedSub}</p>
          </div>

          <div className="grid grid-cols-2 gap-3 max-w-sm mx-auto">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
              <div className="text-xs text-slate-400 font-semibold">{t.roundCounter}</div>
              <div className="text-2xl font-black text-emerald-400">{activeWorkout.rounds}</div>
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
              <div className="text-xs text-slate-400 font-semibold">Total</div>
              <div className="text-2xl font-black text-cyan-400">
                {formatHumanDuration(Math.round(sessionState.totalDurationMs / 1000), locale)}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={handleRestart}
              className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold px-6 py-3.5 rounded-2xl text-sm inline-flex items-center gap-2 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" aria-hidden="true" />
              <span>{t.playAgain}</span>
            </button>
            <button
              type="button"
              onClick={() => navigate('/')}
              className="bg-slate-800 hover:bg-slate-700 text-white font-bold px-6 py-3.5 rounded-2xl text-sm cursor-pointer"
            >
              {t.backToDashboard}
            </button>
          </div>
        </div>
      ) : (
        /* Active / Paused / Idle Player Layout */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* Left Column: Giant Timer & Phase State */}
          <div className="lg:col-span-7 flex flex-col items-center justify-center text-center p-6 sm:p-8 rounded-3xl bg-slate-900/90 border-2 border-slate-800 space-y-5">
            <div
              data-testid="player-phase-badge"
              className={`px-5 py-1.5 rounded-full border text-sm sm:text-base font-black tracking-widest uppercase ${phaseStyle.bannerBg}`}
            >
              {getPhaseDisplayLabel(sessionState.phase, locale)}
            </div>

            <div
              data-testid="player-countdown"
              className={`text-7xl sm:text-8xl md:text-9xl font-black tracking-tight tabular-nums leading-none ${phaseStyle.accentText}`}
            >
              {formatClock(sessionState.remainingSeconds)}
            </div>

            <div className="w-full max-w-md h-3 bg-slate-800 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-100 ${phaseStyle.progressBar}`}
                style={{ width: `${stepProgressPct}%` }}
              />
            </div>

            <div className="space-y-1">
              <h2
                data-testid="player-current-exercise"
                className="text-2xl sm:text-3xl font-extrabold m-0 text-white"
              >
                {sessionState.phase === 'warmup'
                  ? t.phaseWarmup
                  : sessionState.phase === 'cooldown'
                    ? t.phaseCooldown
                    : sessionState.phase === 'rest' || sessionState.phase === 'round-rest'
                      ? `${getPhaseDisplayLabel(sessionState.phase, locale)}`
                      : currentExercise
                        ? currentExercise.name[locale]
                        : activeWorkout.name}
              </h2>
              {nextExercise && (
                <div
                  data-testid="player-next-exercise"
                  className="text-sm font-semibold text-slate-300 inline-flex items-center gap-1.5 pt-1"
                >
                  <span className="text-slate-400">{t.upNext}:</span>
                  <span className="text-cyan-400 font-bold">{nextExercise.name[locale]}</span>
                  <ChevronRight className="w-4 h-4 text-cyan-400" aria-hidden="true" />
                </div>
              )}
            </div>

            {/* Primary Transport Controls */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-4 w-full">
              <button
                type="button"
                onClick={handlePrevious}
                disabled={sessionState.status === 'idle'}
                aria-label={t.previous}
                data-testid="btn-previous"
                className="p-4 rounded-2xl bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-white cursor-pointer transition-colors"
              >
                <SkipBack className="w-6 h-6" aria-hidden="true" />
              </button>

              {sessionState.status === 'idle' && (
                <button
                  type="button"
                  onClick={handleStart}
                  data-testid="btn-start"
                  className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black px-8 py-4 rounded-2xl text-lg inline-flex items-center gap-2.5 cursor-pointer shadow-lg shadow-emerald-500/25 transition-colors"
                >
                  <Play className="w-6 h-6 fill-current" aria-hidden="true" />
                  <span>{t.start}</span>
                </button>
              )}

              {sessionState.status === 'running' && (
                <button
                  type="button"
                  onClick={handlePause}
                  data-testid="btn-pause"
                  className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-black px-8 py-4 rounded-2xl text-lg inline-flex items-center gap-2.5 cursor-pointer shadow-lg shadow-amber-400/20 transition-colors"
                >
                  <Pause className="w-6 h-6 fill-current" aria-hidden="true" />
                  <span>{t.pause}</span>
                </button>
              )}

              {sessionState.status === 'paused' && (
                <button
                  type="button"
                  onClick={handleResume}
                  data-testid="btn-resume"
                  className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black px-8 py-4 rounded-2xl text-lg inline-flex items-center gap-2.5 cursor-pointer shadow-lg shadow-emerald-500/25 transition-colors"
                >
                  <Play className="w-6 h-6 fill-current" aria-hidden="true" />
                  <span>{t.resume}</span>
                </button>
              )}

              <button
                type="button"
                onClick={handleSkip}
                disabled={sessionState.status === 'idle'}
                aria-label={t.skip}
                data-testid="btn-skip"
                className="p-4 rounded-2xl bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-white cursor-pointer transition-colors"
              >
                <SkipForward className="w-6 h-6" aria-hidden="true" />
              </button>

              <button
                type="button"
                onClick={handleRestart}
                aria-label={t.restart}
                data-testid="btn-restart"
                className="p-4 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 cursor-pointer transition-colors"
              >
                <RotateCcw className="w-5 h-5" aria-hidden="true" />
              </button>
            </div>
          </div>

          {/* Right Column: Visual Exercise Illustration & Form Cues */}
          <div className="lg:col-span-5 bg-slate-900/80 border border-slate-800 rounded-3xl p-5 space-y-4">
            {(sessionState.phase === 'rest' || sessionState.phase === 'round-rest') &&
            nextExercise ? (
              <>
                <div className="text-xs font-bold uppercase tracking-wider text-cyan-400">
                  {t.upNext}: {nextExercise.name[locale]}
                </div>
                <div className="rounded-2xl overflow-hidden border border-slate-800 bg-slate-950">
                  <img
                    src={resolveAssetUrl(nextExercise.media.src)}
                    alt={nextExercise.media.alt[locale]}
                    className="w-full h-48 sm:h-56 object-contain mx-auto"
                  />
                </div>
                <div className="space-y-1.5">
                  <div className="text-xs font-bold text-slate-400 uppercase">{t.formTips}</div>
                  <ol className="text-xs text-slate-300 space-y-1 pl-4 m-0">
                    {nextExercise.instructions[locale].slice(0, 3).map((step, i) => (
                      <li key={i}>{step}</li>
                    ))}
                  </ol>
                </div>
              </>
            ) : currentExercise ? (
              <>
                <div className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                  {currentExercise.name[locale]}
                </div>
                <div className="rounded-2xl overflow-hidden border border-slate-800 bg-slate-950">
                  <img
                    src={resolveAssetUrl(currentExercise.media.src)}
                    alt={currentExercise.media.alt[locale]}
                    className="w-full h-48 sm:h-56 object-contain mx-auto"
                  />
                </div>
                <div className="space-y-1.5">
                  <div className="text-xs font-bold text-slate-400 uppercase">{t.formTips}</div>
                  <ol className="text-xs text-slate-300 space-y-1 pl-4 m-0">
                    {currentExercise.instructions[locale].map((step, i) => (
                      <li key={i}>{step}</li>
                    ))}
                  </ol>
                </div>
              </>
            ) : null}
          </div>
        </div>
      )}

      <p className="text-[11px] text-slate-400 text-center m-0 pt-2">{t.iosBackgroundNote}</p>
    </div>
  );
};
