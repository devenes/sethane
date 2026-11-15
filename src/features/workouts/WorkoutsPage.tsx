import React, { useEffect, useId, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Copy, Edit3, Flame, Layers, Play, Plus, Trash2, Zap } from 'lucide-react';
import { calculateWorkoutSummary } from '../../engine/phase-resolver';
import { getExerciseById } from '../../data/exercises/catalog';
import { soundService } from '../../services/audio/sound-service';
import { useSettingsStore } from '../../stores/settings-store';
import { useWorkoutStore } from '../../stores/workout-store';
import type { WorkoutPlan } from '../../types';
import { formatHumanDuration } from '../../utils/format';
import { UI_STRINGS } from '../../utils/i18n';

export const WorkoutsPage: React.FC = () => {
  const navigate = useNavigate();
  const locale = useSettingsStore((s) => s.locale);
  const presets = useWorkoutStore((s) => s.presets);
  const customWorkouts = useWorkoutStore((s) => s.customWorkouts);
  const selectWorkoutForPlayer = useWorkoutStore((s) => s.selectWorkoutForPlayer);
  const setEditingWorkout = useWorkoutStore((s) => s.setEditingWorkout);
  const duplicateWorkout = useWorkoutStore((s) => s.duplicateWorkout);
  const deleteCustomWorkout = useWorkoutStore((s) => s.deleteCustomWorkout);

  const [pendingDelete, setPendingDelete] = useState<WorkoutPlan | null>(null);
  const confirmDialogRef = useRef<HTMLDialogElement>(null);
  const confirmTitleId = useId();

  const t = UI_STRINGS[locale].workoutsPage;
  const td = UI_STRINGS[locale].dashboard;

  useEffect(() => {
    const dialog = confirmDialogRef.current;
    if (!dialog) return;
    if (pendingDelete && !dialog.open) {
      dialog.showModal();
    } else if (!pendingDelete && dialog.open) {
      dialog.close();
    }
  }, [pendingDelete]);

  const handleStart = (workout: WorkoutPlan, skipWarmup = false) => {
    soundService.unlock();
    const target = skipWarmup
      ? { ...workout, warmupSeconds: 0, cooldownSeconds: 0 }
      : workout;
    selectWorkoutForPlayer(target);
    navigate('/player');
  };

  const handleEdit = (workout: WorkoutPlan) => {
    setEditingWorkout(workout);
    navigate('/builder');
  };

  const handleConfirmDelete = async () => {
    if (!pendingDelete) return;
    await deleteCustomWorkout(pendingDelete.id);
    setPendingDelete(null);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-black m-0">{t.title}</h1>
          <p className="text-sm sm:text-base text-muted-token m-0">{t.subtitle}</p>
        </div>
        <button
          type="button"
          onClick={() => {
            setEditingWorkout(null);
            navigate('/builder');
          }}
          className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold px-5 py-3 rounded-2xl text-sm inline-flex items-center gap-2 cursor-pointer"
        >
          <Plus className="w-4 h-4" aria-hidden="true" />
          <span>{td.createCustomBtn}</span>
        </button>
      </div>

      {/* Custom Workouts Section */}
      <section className="space-y-4">
        <h2 className="text-xl font-extrabold m-0 flex items-center gap-2">
          <Layers className="w-5 h-5 text-cyan-500" aria-hidden="true" />
          <span>{t.customHeading}</span>
        </h2>

        {customWorkouts.length === 0 ? (
          <div className="surface-card rounded-2xl p-6 text-center space-y-3">
            <p className="text-sm text-muted-token m-0">{td.noCustomWorkouts}</p>
            <button
              type="button"
              onClick={() => {
                setEditingWorkout(null);
                navigate('/builder');
              }}
              className="surface-elevated hover:border-emerald-500/50 px-4 py-2 rounded-xl text-xs font-bold cursor-pointer"
            >
              + {td.createCustomBtn}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {customWorkouts.map((workout) => {
              const summary = calculateWorkoutSummary(workout);
              return (
                <article
                  key={workout.id}
                  data-testid={`custom-workout-card-${workout.id}`}
                  className="surface-card rounded-2xl p-5 flex flex-col justify-between gap-4"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="text-lg font-extrabold m-0">{workout.name}</h3>
                      <span className="px-2.5 py-1 rounded-lg bg-cyan-500/15 text-cyan-500 text-xs font-bold">
                        {workout.rounds} {td.roundsLabel}
                      </span>
                    </div>

                    <div className="text-xs text-muted-token font-semibold">
                      {td.coreHiitLabel}: {formatHumanDuration(summary.coreHiitSeconds, locale)} ·{' '}
                      {td.totalTimeLabel}: {formatHumanDuration(summary.totalSeconds, locale)}
                    </div>

                    <div className="flex flex-wrap gap-1.5">
                      {workout.exercises.map((item, idx) => {
                        const ex = getExerciseById(item.exerciseId);
                        return (
                          <span
                            key={`${workout.id}-${idx}`}
                            className="surface-elevated px-2.5 py-1 rounded-lg text-[11px] font-semibold"
                          >
                            {ex ? ex.name[locale] : item.exerciseId} ({item.workSeconds}s/
                            {item.restSeconds}s)
                          </span>
                        );
                      })}
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-[var(--border-subtle)]">
                    <button
                      type="button"
                      onClick={() => handleStart(workout, false)}
                      className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs inline-flex items-center gap-1.5 cursor-pointer"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" aria-hidden="true" />
                      <span>{td.startNow}</span>
                    </button>

                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleEdit(workout)}
                        aria-label={`${t.editBtn} ${workout.name}`}
                        className="surface-elevated px-3 py-2 rounded-xl text-xs font-semibold inline-flex items-center gap-1 cursor-pointer"
                      >
                        <Edit3 className="w-3.5 h-3.5" aria-hidden="true" />
                        <span>{t.editBtn}</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => void duplicateWorkout(workout)}
                        aria-label={`${t.duplicateBtn} ${workout.name}`}
                        className="surface-elevated px-3 py-2 rounded-xl text-xs font-semibold inline-flex items-center gap-1 cursor-pointer"
                      >
                        <Copy className="w-3.5 h-3.5" aria-hidden="true" />
                        <span>{t.duplicateBtn}</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setPendingDelete(workout)}
                        aria-label={`${t.deleteBtn} ${workout.name}`}
                        className="surface-elevated hover:border-rose-500/50 text-rose-500 px-3 py-2 rounded-xl text-xs font-semibold inline-flex items-center gap-1 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
                        <span>{t.deleteBtn}</span>
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>

      {/* Preset Workouts Section */}
      <section className="space-y-4">
        <h2 className="text-xl font-extrabold m-0 flex items-center gap-2">
          <Flame className="w-5 h-5 text-emerald-500" aria-hidden="true" />
          <span>{t.presetsHeading}</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {presets.map((workout) => {
            const summary = calculateWorkoutSummary(workout);
            return (
              <article
                key={workout.id}
                className="surface-card rounded-2xl p-5 flex flex-col justify-between gap-4"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-lg font-extrabold m-0">{workout.name}</h3>
                    <span className="px-2.5 py-1 rounded-lg bg-emerald-500/15 text-emerald-500 text-xs font-bold">
                      {workout.rounds} {td.roundsLabel}
                    </span>
                  </div>

                  {workout.description && (
                    <p className="text-xs text-muted-token m-0">{workout.description[locale]}</p>
                  )}

                  <div className="text-xs font-semibold text-muted-token">
                    {td.coreHiitLabel}:{' '}
                    <span className="text-emerald-500 font-bold">
                      {formatHumanDuration(summary.coreHiitSeconds, locale)}
                    </span>{' '}
                    · {td.totalTimeLabel}: {formatHumanDuration(summary.totalSeconds, locale)}
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-[var(--border-subtle)]">
                  <button
                    type="button"
                    onClick={() => handleStart(workout, false)}
                    className="flex-1 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-3.5 py-2 rounded-xl text-xs inline-flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" aria-hidden="true" />
                    <span>{td.startNow}</span>
                  </button>

                  {workout.warmupSeconds > 0 && (
                    <button
                      type="button"
                      onClick={() => handleStart(workout, true)}
                      className="surface-elevated px-3 py-2 rounded-xl text-xs font-semibold inline-flex items-center gap-1 cursor-pointer"
                    >
                      <Zap className="w-3.5 h-3.5 text-amber-400" aria-hidden="true" />
                      <span>{td.skipWarmupStart}</span>
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => void duplicateWorkout(workout)}
                    aria-label={`${t.duplicateBtn} ${workout.name}`}
                    className="surface-elevated px-3 py-2 rounded-xl text-xs font-semibold inline-flex items-center gap-1 cursor-pointer"
                  >
                    <Copy className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>{t.duplicateBtn}</span>
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* Native Confirm Delete Dialog */}
      <dialog
        ref={confirmDialogRef}
        aria-labelledby={confirmTitleId}
        onClose={() => setPendingDelete(null)}
        className="surface-card rounded-2xl p-6 max-w-md w-[calc(100%-2rem)] m-auto shadow-2xl"
      >
        <div className="space-y-4">
          <h2 id={confirmTitleId} className="text-lg font-extrabold m-0">
            {t.confirmDeleteTitle}
          </h2>
          <p className="text-sm text-muted-token m-0">
            {t.confirmDeleteBody} ({pendingDelete?.name})
          </p>
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setPendingDelete(null)}
              autoFocus
              className="surface-elevated px-4 py-2 rounded-xl text-sm font-semibold cursor-pointer"
            >
              {t.cancelBtn}
            </button>
            <button
              type="button"
              onClick={() => void handleConfirmDelete()}
              className="bg-rose-500 hover:bg-rose-400 text-white font-bold px-4 py-2 rounded-xl text-sm cursor-pointer"
            >
              {t.confirmDeleteBtn}
            </button>
          </div>
        </div>
      </dialog>
    </div>
  );
};
