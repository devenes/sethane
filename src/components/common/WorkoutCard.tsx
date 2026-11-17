import React from 'react';
import { Link } from 'react-router-dom';
import { Copy, Play, Trash2 } from 'lucide-react';
import { calculateWorkoutSummary } from '../../engine/phase-resolver';
import { getExerciseById } from '../../data/exercises/catalog';
import type { Exercise, SupportedLocale, WorkoutPlan } from '../../types';
import { resolveAssetUrl } from '../../utils/assets';
import { formatHumanDuration } from '../../utils/format';
import { UI_STRINGS } from '../../utils/i18n';

interface WorkoutCardProps {
  workout: WorkoutPlan;
  locale: SupportedLocale;
  featured?: boolean;
  startLabelOverride?: string;
  testId?: string;
  onStart: (workout: WorkoutPlan) => void;
  onDuplicate?: (workout: WorkoutPlan) => void;
  onDelete?: (workout: WorkoutPlan) => void;
  onInspectExercise?: (exercise: Exercise) => void;
}

export const WorkoutCard: React.FC<WorkoutCardProps> = ({
  workout,
  locale,
  featured = false,
  startLabelOverride,
  testId,
  onStart,
  onDuplicate,
  onDelete,
  onInspectExercise,
}) => {
  const td = UI_STRINGS[locale].dashboard;
  const tw = UI_STRINGS[locale].workoutsPage;
  const summary = calculateWorkoutSummary(workout);
  const displayName = workout.localizedName?.[locale] ?? workout.name;
  const visibleExercises = workout.exercises.slice(0, 6);
  const extraCount = Math.max(0, workout.exercises.length - 6);

  return (
    <article
      data-testid={testId ?? `workout-card-${workout.id}`}
      className={`adaptive-card surface-card rounded-xl overflow-hidden flex flex-col justify-between transition-colors ${
        featured ? 'border-[var(--brand-accent)]/60' : ''
      }`}
    >
      {/* Media Region: Visual Exercise Filmstrip */}
      <div className="media bg-[#070b14] border-b border-[var(--border-subtle)] p-2">
        <div
          className={
            featured
              ? 'grid grid-cols-3 sm:grid-cols-6 gap-1.5'
              : 'grid grid-cols-3 gap-1.5'
          }
        >
          {(featured ? visibleExercises : visibleExercises.slice(0, 3)).map((item, idx) => {
            const ex = getExerciseById(item.exerciseId);
            const thumbSrc = ex
              ? resolveAssetUrl(ex.media.posterSrc ?? ex.media.src)
              : undefined;
            const innerContent = (
              <>
                {thumbSrc && (
                  <img
                    src={thumbSrc}
                    alt={ex ? ex.name[locale] : ''}
                    width={480}
                    height={336}
                    loading={featured ? 'eager' : 'lazy'}
                    className="w-full aspect-[10/7] object-contain"
                  />
                )}
                <span className="absolute top-1 right-1 px-1 py-0.5 rounded bg-black/75 text-[10px] font-bold mono-readout text-slate-200 leading-none">
                  {item.workSeconds}s
                </span>
                {featured && ex && (
                  <div className="px-1.5 pb-1 text-[10px] font-semibold text-slate-300 truncate">
                    {ex.name[locale]}
                  </div>
                )}
                {!featured && idx === 2 && workout.exercises.length > 3 && (
                  <span className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded bg-emerald-500 text-slate-950 text-[10px] font-black mono-readout leading-none">
                    +{workout.exercises.length - 3}
                  </span>
                )}
              </>
            );

            if (onInspectExercise && ex) {
              return (
                <button
                  key={`${workout.id}-${item.exerciseId}-${idx}`}
                  type="button"
                  onClick={() => onInspectExercise(ex)}
                  data-testid={`workout-card-inspect-${workout.id}-${idx}`}
                  aria-label={`${ex.name[locale]} — ${UI_STRINGS[locale].exercises.viewDetails}`}
                  className="relative rounded-lg bg-[#0d1322] border border-slate-800/80 hover:border-[var(--brand-accent)] overflow-hidden p-0 text-left cursor-pointer transition-colors"
                >
                  {innerContent}
                </button>
              );
            }

            return (
              <div
                key={`${workout.id}-${item.exerciseId}-${idx}`}
                className="relative rounded-lg bg-[#0d1322] border border-slate-800/80 overflow-hidden"
              >
                {innerContent}
              </div>
            );
          })}
        </div>
        {featured && extraCount > 0 && (
          <div className="text-[11px] text-slate-400 mono-readout px-1 pt-1">+{extraCount}</div>
        )}
      </div>

      {/* Header Region: Stretched Primary Link */}
      <header className="px-3.5 pt-3.5 flex items-start justify-between gap-2">
        <h3 className={featured ? 'text-lg sm:text-xl font-black m-0' : 'text-base font-extrabold m-0'}>
          <Link
            to="/player"
            data-testid={`workout-card-open-${workout.id}`}
            onClick={() => onStart(workout)}
            className="card-link no-underline text-inherit"
          >
            {displayName}
          </Link>
        </h3>
        <span className="shrink-0 surface-elevated px-2 py-0.5 rounded text-[11px] font-bold mono-readout">
          {workout.rounds}×{workout.exercises.length}
        </span>
      </header>

      {/* Content Region: Concise Specs & Optional Clickable Exercise Chips */}
      <div className="px-3.5 pt-2 pb-3.5 flex-1 flex flex-col justify-end gap-2">
        {onInspectExercise && workout.exercises.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {workout.exercises.map((item, idx) => {
              const ex = getExerciseById(item.exerciseId);
              if (!ex) return null;
              return (
                <button
                  key={`${workout.id}-chip-${item.exerciseId}-${idx}`}
                  type="button"
                  onClick={() => onInspectExercise(ex)}
                  data-testid={`workout-card-move-chip-${workout.id}-${idx}`}
                  className="surface-elevated hover:border-[var(--brand-accent)] hover:text-[var(--brand-accent)] px-2 py-0.5 rounded-md text-[11px] font-semibold cursor-pointer transition-colors"
                >
                  {ex.name[locale]}
                </button>
              );
            })}
          </div>
        )}
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs mono-readout text-muted-token">
          <span>
            <strong className="text-[var(--brand-accent)] font-bold">
              {formatHumanDuration(summary.coreHiitSeconds, locale)}
            </strong>{' '}
            {td.coreHiitLabel}
          </span>
          {workout.warmupSeconds > 0 && (
            <span>
              · {formatHumanDuration(summary.totalSeconds, locale)} {td.totalTimeLabel.toLowerCase()}
            </span>
          )}
        </div>
      </div>

      {/* Footer Actions: Clean Single Primary Action */}
      <footer className="px-3.5 pb-3.5 pt-2.5 border-t border-[var(--border-subtle)] flex flex-wrap items-center gap-1.5">
        <button
          type="button"
          onClick={() => onStart(workout)}
          className={`bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold rounded-lg text-xs inline-flex items-center justify-center gap-1.5 cursor-pointer transition-colors ${
            featured ? 'px-4 py-2.5 text-sm' : 'flex-1 px-3 py-2'
          }`}
        >
          <Play className="w-3.5 h-3.5 fill-current" aria-hidden="true" />
          <span>{startLabelOverride ?? td.startNow}</span>
        </button>

        {onDuplicate && (
          <button
            type="button"
            onClick={() => onDuplicate(workout)}
            aria-label={`${tw.duplicateBtn} ${workout.name}`}
            className="surface-elevated hover:border-[var(--brand-accent)] p-2 rounded-lg text-xs font-semibold inline-flex items-center justify-center cursor-pointer"
          >
            <Copy className="w-3.5 h-3.5" aria-hidden="true" />
          </button>
        )}

        {onDelete && (
          <button
            type="button"
            onClick={() => onDelete(workout)}
            aria-label={`${tw.deleteBtn} ${workout.name}`}
            className="surface-elevated hover:border-rose-500 text-rose-500 p-2 rounded-lg text-xs font-semibold inline-flex items-center justify-center cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
          </button>
        )}
      </footer>
    </article>
  );
};
