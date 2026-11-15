import React from 'react';
import { Copy, Edit3, Play, Trash2 } from 'lucide-react';
import { calculateWorkoutSummary } from '../../engine/phase-resolver';
import { getExerciseById } from '../../data/exercises/catalog';
import type { SupportedLocale, WorkoutPlan } from '../../types';
import { resolveAssetUrl } from '../../utils/assets';
import { formatHumanDuration } from '../../utils/format';
import { UI_STRINGS } from '../../utils/i18n';

interface WorkoutCardProps {
  workout: WorkoutPlan;
  locale: SupportedLocale;
  featured?: boolean;
  startLabelOverride?: string;
  testId?: string;
  onStart: (workout: WorkoutPlan, skipWarmup?: boolean) => void;
  onCustomize?: (workout: WorkoutPlan) => void;
  onEdit?: (workout: WorkoutPlan) => void;
  onDuplicate?: (workout: WorkoutPlan) => void;
  onDelete?: (workout: WorkoutPlan) => void;
}

export const WorkoutCard: React.FC<WorkoutCardProps> = ({
  workout,
  locale,
  featured = false,
  startLabelOverride,
  testId,
  onStart,
  onCustomize,
  onEdit,
  onDuplicate,
  onDelete,
}) => {
  const td = UI_STRINGS[locale].dashboard;
  const tw = UI_STRINGS[locale].workoutsPage;
  const summary = calculateWorkoutSummary(workout);
  const displayName = workout.localizedName?.[locale] ?? workout.name;
  const visibleExercises = workout.exercises.slice(0, 6);
  const extraCount = Math.max(0, workout.exercises.length - 6);

  return (
    <article
      data-testid={testId}
      className={`adaptive-card surface-card rounded-xl overflow-hidden flex flex-col justify-between transition-colors hover:border-[var(--brand-accent)] ${
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
            return (
              <div
                key={`${workout.id}-${item.exerciseId}-${idx}`}
                className="relative rounded-lg bg-[#0d1322] border border-slate-800/80 overflow-hidden"
              >
                {thumbSrc && (
                  <img
                    src={thumbSrc}
                    alt={ex ? ex.name[locale] : ''}
                    width={480}
                    height={336}
                    loading={featured ? 'eager' : 'lazy'}
                    className={
                      featured
                        ? 'w-full aspect-[10/7] object-contain'
                        : 'w-full aspect-[10/7] object-contain'
                    }
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
              </div>
            );
          })}
        </div>
        {featured && extraCount > 0 && (
          <div className="text-[11px] text-slate-400 mono-readout px-1 pt-1">+{extraCount}</div>
        )}
      </div>

      {/* Header + Concise Specs */}
      <div className="p-3.5 space-y-2 flex-1 flex flex-col justify-between">
        <header className="flex items-start justify-between gap-2">
          <h3 className={featured ? 'text-lg sm:text-xl font-black m-0' : 'text-base font-extrabold m-0'}>
            {displayName}
          </h3>
          <span className="shrink-0 surface-elevated px-2 py-0.5 rounded text-[11px] font-bold mono-readout">
            {workout.rounds}×{workout.exercises.length}
          </span>
        </header>

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

      {/* Footer Actions */}
      <footer className="px-3.5 pb-3.5 pt-2.5 border-t border-[var(--border-subtle)] flex flex-wrap items-center gap-1.5">
        <button
          type="button"
          onClick={() => onStart(workout, false)}
          className={`bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold rounded-lg text-xs inline-flex items-center justify-center gap-1.5 cursor-pointer transition-colors ${
            featured ? 'px-4 py-2.5 text-sm' : 'flex-1 px-3 py-2'
          }`}
        >
          <Play className="w-3.5 h-3.5 fill-current" aria-hidden="true" />
          <span>{startLabelOverride ?? td.startNow}</span>
        </button>

        {workout.warmupSeconds > 0 && (
          <button
            type="button"
            onClick={() => onStart(workout, true)}
            className="surface-elevated hover:border-[var(--brand-accent)] px-2.5 py-2 rounded-lg text-xs font-semibold cursor-pointer transition-colors"
          >
            {td.skipWarmupStart}
          </button>
        )}

        {onCustomize && (
          <button
            type="button"
            onClick={() => onCustomize(workout)}
            className="surface-elevated hover:border-[var(--brand-accent)] px-2.5 py-2 rounded-lg text-xs font-semibold cursor-pointer transition-colors"
          >
            {td.customizeCopy}
          </button>
        )}

        {onEdit && (
          <button
            type="button"
            onClick={() => onEdit(workout)}
            aria-label={`${tw.editBtn} ${workout.name}`}
            className="surface-elevated hover:border-[var(--brand-accent)] p-2 rounded-lg text-xs font-semibold inline-flex items-center justify-center cursor-pointer"
          >
            <Edit3 className="w-3.5 h-3.5" aria-hidden="true" />
          </button>
        )}

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
