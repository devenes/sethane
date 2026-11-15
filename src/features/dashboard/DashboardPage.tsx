import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CheckCircle2,
  Clock,
  Dumbbell,
  Flame,
  Layers,
  Play,
  Plus,
  Sparkles,
  Timer,
  Zap,
} from 'lucide-react';
import { calculateWorkoutSummary } from '../../engine/phase-resolver';
import { getExerciseById } from '../../data/exercises/catalog';
import { soundService } from '../../services/audio/sound-service';
import { useSettingsStore } from '../../stores/settings-store';
import { useWorkoutStore } from '../../stores/workout-store';
import type { WorkoutPlan } from '../../types';
import { formatHumanDuration } from '../../utils/format';
import { UI_STRINGS } from '../../utils/i18n';
import { QuickTimerModal } from './QuickTimerModal';

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const locale = useSettingsStore((s) => s.locale);
  const presets = useWorkoutStore((s) => s.presets);
  const customWorkouts = useWorkoutStore((s) => s.customWorkouts);
  const history = useWorkoutStore((s) => s.history);
  const selectWorkoutForPlayer = useWorkoutStore((s) => s.selectWorkoutForPlayer);
  const setEditingWorkout = useWorkoutStore((s) => s.setEditingWorkout);

  const [quickTimerOpen, setQuickTimerOpen] = useState(false);

  const t = UI_STRINGS[locale].dashboard;
  const signatureWorkout = presets[0]!;

  const launchWorkout = (workout: WorkoutPlan, skipWarmup = false) => {
    soundService.unlock();
    const target = skipWarmup
      ? { ...workout, warmupSeconds: 0, cooldownSeconds: 0 }
      : workout;
    selectWorkoutForPlayer(target);
    navigate('/player');
  };

  const handleCustomizeCopy = (workout: WorkoutPlan) => {
    setEditingWorkout({
      ...workout,
      id: workout.isPreset ? `custom-${Date.now()}` : workout.id,
      name: workout.isPreset ? `${workout.name} (Custom)` : workout.name,
      isPreset: false,
    });
    navigate('/builder');
  };

  const totalCompletedMinutes = Math.round(
    history.reduce((sum, entry) => sum + entry.durationSeconds, 0) / 60
  );

  return (
    <div className="space-y-8">
      {/* Hero Banner */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-950 text-white p-6 sm:p-8 md:p-10 border border-emerald-500/25 shadow-xl">
        <div className="max-w-3xl space-y-5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-400/30 text-emerald-300 text-xs font-bold tracking-wide">
            <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
            <span>{t.heroBadge}</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight m-0">
            {t.heroTitle}
          </h1>

          <p className="text-slate-300 text-base sm:text-lg max-w-2xl m-0 leading-relaxed">
            {t.heroSubtitle}
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => launchWorkout(signatureWorkout, false)}
              className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold px-6 py-3.5 rounded-2xl text-sm sm:text-base inline-flex items-center gap-2.5 cursor-pointer transition-colors shadow-lg shadow-emerald-500/20"
            >
              <Play className="w-5 h-5 fill-current" aria-hidden="true" />
              <span>{t.startSignature}</span>
            </button>

            <button
              type="button"
              onClick={() => setQuickTimerOpen(true)}
              className="bg-slate-800/90 hover:bg-slate-700 text-white border border-slate-700 font-bold px-5 py-3.5 rounded-2xl text-sm sm:text-base inline-flex items-center gap-2 cursor-pointer transition-colors"
            >
              <Timer className="w-5 h-5 text-cyan-400" aria-hidden="true" />
              <span>{t.quickTimerBtn}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setEditingWorkout(null);
                navigate('/builder');
              }}
              className="bg-slate-800/70 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold px-4 py-3.5 rounded-2xl text-sm inline-flex items-center gap-2 cursor-pointer transition-colors"
            >
              <Plus className="w-4 h-4 text-emerald-400" aria-hidden="true" />
              <span>{t.createCustomBtn}</span>
            </button>

            <button
              type="button"
              onClick={() => navigate('/exercises')}
              className="bg-slate-800/70 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold px-4 py-3.5 rounded-2xl text-sm inline-flex items-center gap-2 cursor-pointer transition-colors"
            >
              <Dumbbell className="w-4 h-4 text-amber-400" aria-hidden="true" />
              <span>{t.browseExercisesBtn}</span>
            </button>
          </div>
        </div>
      </section>

      {/* Compact Stats Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="surface-card rounded-2xl p-4 flex items-center gap-4">
          <div className="p-3 rounded-xl bg-emerald-500/15 text-emerald-500">
            <CheckCircle2 className="w-6 h-6" aria-hidden="true" />
          </div>
          <div>
            <div className="text-2xl font-black tabular-nums">{history.length}</div>
            <div className="text-xs font-semibold text-muted-token">{t.statsWorkoutsDone}</div>
          </div>
        </div>

        <div className="surface-card rounded-2xl p-4 flex items-center gap-4">
          <div className="p-3 rounded-xl bg-cyan-500/15 text-cyan-500">
            <Clock className="w-6 h-6" aria-hidden="true" />
          </div>
          <div>
            <div className="text-2xl font-black tabular-nums">{totalCompletedMinutes}</div>
            <div className="text-xs font-semibold text-muted-token">{t.statsTotalMinutes}</div>
          </div>
        </div>

        <div className="surface-card rounded-2xl p-4 flex items-center gap-4">
          <div className="p-3 rounded-xl bg-amber-500/15 text-amber-500">
            <Layers className="w-6 h-6" aria-hidden="true" />
          </div>
          <div>
            <div className="text-2xl font-black tabular-nums">{customWorkouts.length}</div>
            <div className="text-xs font-semibold text-muted-token">{t.statsCustomCount}</div>
          </div>
        </div>
      </div>

      {/* Featured Preset Workouts */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl sm:text-2xl font-extrabold m-0 flex items-center gap-2">
            <Flame className="w-6 h-6 text-emerald-500" aria-hidden="true" />
            <span>{t.featuredTitle}</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {presets.map((workout) => {
            const summary = calculateWorkoutSummary(workout);
            return (
              <article
                key={workout.id}
                className="surface-card rounded-2xl p-5 flex flex-col justify-between gap-4 hover:border-emerald-500/40 transition-colors"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-lg font-extrabold m-0">{workout.name}</h3>
                    <span className="shrink-0 px-2.5 py-1 rounded-lg bg-emerald-500/15 text-emerald-500 text-xs font-bold">
                      {workout.rounds} {t.roundsLabel}
                    </span>
                  </div>

                  {workout.description && (
                    <p className="text-xs text-muted-token m-0 leading-relaxed">
                      {workout.description[locale]}
                    </p>
                  )}

                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <div className="surface-elevated rounded-xl px-3 py-2">
                      <div className="text-[11px] text-muted-token font-semibold">
                        {t.coreHiitLabel}
                      </div>
                      <div className="text-sm font-extrabold text-emerald-500">
                        {formatHumanDuration(summary.coreHiitSeconds, locale)}
                      </div>
                    </div>
                    <div className="surface-elevated rounded-xl px-3 py-2">
                      <div className="text-[11px] text-muted-token font-semibold">
                        {t.totalTimeLabel}
                      </div>
                      <div className="text-sm font-extrabold">
                        {formatHumanDuration(summary.totalSeconds, locale)}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {workout.exercises.map((item, idx) => {
                      const ex = getExerciseById(item.exerciseId);
                      return (
                        <span
                          key={`${workout.id}-${item.exerciseId}-${idx}`}
                          className="surface-elevated px-2.5 py-1 rounded-lg text-[11px] font-semibold"
                        >
                          {ex ? ex.name[locale] : item.exerciseId} ({item.workSeconds}s)
                        </span>
                      );
                    })}
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-[var(--border-subtle)]">
                  <button
                    type="button"
                    onClick={() => launchWorkout(workout, false)}
                    className="flex-1 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-3.5 py-2.5 rounded-xl text-xs inline-flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                  >
                    <Play className="w-4 h-4 fill-current" aria-hidden="true" />
                    <span>{t.startNow}</span>
                  </button>

                  {workout.warmupSeconds > 0 && (
                    <button
                      type="button"
                      onClick={() => launchWorkout(workout, true)}
                      className="surface-elevated hover:border-emerald-500/50 px-3 py-2.5 rounded-xl text-xs font-semibold inline-flex items-center gap-1 cursor-pointer transition-colors"
                    >
                      <Zap className="w-3.5 h-3.5 text-amber-400" aria-hidden="true" />
                      <span>{t.skipWarmupStart}</span>
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => handleCustomizeCopy(workout)}
                    className="surface-elevated hover:border-emerald-500/50 px-3 py-2.5 rounded-xl text-xs font-semibold cursor-pointer transition-colors"
                  >
                    {t.customizeCopy}
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* My Custom Workouts & Recent Sessions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <section className="surface-card rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-extrabold m-0">{t.myWorkoutsTitle}</h2>
            <button
              type="button"
              onClick={() => {
                setEditingWorkout(null);
                navigate('/builder');
              }}
              className="text-xs font-bold text-emerald-500 hover:underline cursor-pointer"
            >
              + {t.createCustomBtn}
            </button>
          </div>

          {customWorkouts.length === 0 ? (
            <p className="text-sm text-muted-token m-0 py-4">{t.noCustomWorkouts}</p>
          ) : (
            <div className="space-y-2.5">
              {customWorkouts.slice(0, 5).map((workout) => {
                const summary = calculateWorkoutSummary(workout);
                return (
                  <div
                    key={workout.id}
                    className="surface-elevated rounded-xl p-3.5 flex items-center justify-between gap-3"
                  >
                    <div>
                      <div className="font-bold text-sm">{workout.name}</div>
                      <div className="text-xs text-muted-token">
                        {workout.rounds} {t.roundsLabel} · {workout.exercises.length}{' '}
                        {t.exercisesLabel} · {formatHumanDuration(summary.totalSeconds, locale)}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => launchWorkout(workout, false)}
                      aria-label={`${t.startNow}: ${workout.name}`}
                      className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-3.5 py-2 rounded-xl text-xs inline-flex items-center gap-1.5 cursor-pointer"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" aria-hidden="true" />
                      <span>{t.startNow}</span>
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        <section className="surface-card rounded-2xl p-5 space-y-4">
          <h2 className="text-lg font-extrabold m-0">{t.recentTitle}</h2>
          {history.length === 0 ? (
            <p className="text-sm text-muted-token m-0 py-4">{t.noRecentHistory}</p>
          ) : (
            <div className="space-y-2.5">
              {history.slice(0, 5).map((entry) => (
                <div
                  key={entry.id}
                  className="surface-elevated rounded-xl p-3.5 flex items-center justify-between gap-3"
                >
                  <div>
                    <div className="font-bold text-sm">{entry.workoutName}</div>
                    <div className="text-xs text-muted-token">
                      {new Date(entry.completedAt).toLocaleDateString(
                        locale === 'tr' ? 'tr-TR' : 'en-US',
                        { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }
                      )}
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-lg bg-emerald-500/15 text-emerald-500 text-xs font-bold">
                    {formatHumanDuration(entry.durationSeconds, locale)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      <QuickTimerModal
        open={quickTimerOpen}
        locale={locale}
        onClose={() => setQuickTimerOpen(false)}
        onStartQuickWorkout={(quickWorkout) => launchWorkout(quickWorkout, false)}
      />
    </div>
  );
};
