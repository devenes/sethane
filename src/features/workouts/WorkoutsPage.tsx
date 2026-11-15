import React, { useId, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, CalendarDays, Plus } from 'lucide-react';
import { WorkoutCard } from '../../components/common/WorkoutCard';
import { soundService } from '../../services/audio/sound-service';
import { useSettingsStore } from '../../stores/settings-store';
import { useWorkoutStore } from '../../stores/workout-store';
import type { WorkoutPlan } from '../../types';
import { useLightDismissDialog } from '../../utils/dialog';
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

  useLightDismissDialog(confirmDialogRef, Boolean(pendingDelete));

  const handleStart = (workout: WorkoutPlan) => {
    soundService.unlock();
    selectWorkoutForPlayer(workout);
    navigate('/player');
  };

  const handleConfirmDelete = async () => {
    if (!pendingDelete) return;
    await deleteCustomWorkout(pendingDelete.id);
    setPendingDelete(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-xl sm:text-2xl font-black m-0">{t.title}</h1>
        <button
          type="button"
          onClick={() => {
            setEditingWorkout(null);
            navigate('/builder');
          }}
          className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold px-4 py-2 rounded-lg text-xs inline-flex items-center gap-1.5 cursor-pointer transition-colors"
        >
          <Plus className="w-3.5 h-3.5" aria-hidden="true" />
          <span>{td.createCustomBtn}</span>
        </button>
      </div>

      {/* 7-Day Weekly Program Mode Spotlight */}
      <section className="surface-card rounded-xl p-4 flex flex-wrap items-center justify-between gap-3 border-[var(--brand-accent)]/50">
        <div className="space-y-1 max-w-2xl">
          <div className="text-xs font-extrabold text-[var(--brand-accent)] inline-flex items-center gap-1.5">
            <CalendarDays className="w-3.5 h-3.5" aria-hidden="true" />
            <span>{t.weeklyCardTitle}</span>
          </div>
          <p className="text-xs text-muted-token m-0">{t.weeklyCardBody}</p>
        </div>
        <Link
          to="/weekly"
          className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold px-4 py-2 rounded-lg text-xs no-underline inline-flex items-center gap-1.5 transition-colors"
        >
          <span>{t.weeklyCardCta}</span>
          <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
        </Link>
      </section>

      {/* Custom Workouts Section */}
      {customWorkouts.length > 0 && (
        <section className="space-y-2.5">
          <h2 className="text-xs font-extrabold uppercase tracking-wider text-muted-token m-0">
            {t.customHeading}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {customWorkouts.map((workout) => (
              <WorkoutCard
                key={workout.id}
                testId={`custom-workout-card-${workout.id}`}
                workout={workout}
                locale={locale}
                onStart={handleStart}
                onDuplicate={(w) => void duplicateWorkout(w)}
                onDelete={(w) => setPendingDelete(w)}
              />
            ))}
          </div>
        </section>
      )}

      {/* Preset Workouts Section */}
      <section className="space-y-2.5">
        <h2 className="text-xs font-extrabold uppercase tracking-wider text-muted-token m-0">
          {t.presetsHeading}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {presets.map((workout) => (
            <WorkoutCard
              key={workout.id}
              workout={workout}
              locale={locale}
              onStart={handleStart}
            />
          ))}
        </div>
      </section>

      {/* Light-Dismissable Native Confirm Delete Dialog */}
      <dialog
        ref={confirmDialogRef}
        {...({ closedby: 'any' } as Record<string, unknown>)}
        aria-labelledby={confirmTitleId}
        onClose={() => setPendingDelete(null)}
        className="surface-card rounded-xl p-5 max-w-sm w-[calc(100%-2rem)] m-auto shadow-2xl"
      >
        <div className="space-y-3.5">
          <h2 id={confirmTitleId} className="text-base font-extrabold m-0">
            {t.confirmDeleteTitle}
          </h2>
          <p className="text-xs text-muted-token m-0">
            {t.confirmDeleteBody} ({pendingDelete?.name})
          </p>
          <div className="flex justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={() => setPendingDelete(null)}
              autoFocus
              className="surface-elevated px-3.5 py-2 rounded-lg text-xs font-bold cursor-pointer"
            >
              {t.cancelBtn}
            </button>
            <button
              type="button"
              onClick={() => void handleConfirmDelete()}
              className="bg-rose-500 hover:bg-rose-400 text-white font-bold px-3.5 py-2 rounded-lg text-xs cursor-pointer"
            >
              {t.confirmDeleteBtn}
            </button>
          </div>
        </div>
      </dialog>
    </div>
  );
};
