import React, { useId, useRef } from 'react';
import { Play, X } from 'lucide-react';
import type { Exercise, SupportedLocale } from '../../types';
import { useLightDismissDialog } from '../../utils/dialog';
import {
  getCategoryLabel,
  getDifficultyLabel,
  getEquipmentLabel,
  getMuscleLabel,
  UI_STRINGS,
} from '../../utils/i18n';
import { ExerciseVisual, MotionToggleButton } from './ExerciseVisual';

interface ExerciseDetailModalProps {
  exercise: Exercise | null;
  locale: SupportedLocale;
  onClose: () => void;
  onTrainSingle?: (exercise: Exercise) => void;
}

export const ExerciseDetailModal: React.FC<ExerciseDetailModalProps> = ({
  exercise,
  locale,
  onClose,
  onTrainSingle,
}) => {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const dialogTitleId = useId();
  const t = UI_STRINGS[locale].exercises;

  useLightDismissDialog(dialogRef, Boolean(exercise));

  return (
    <dialog
      ref={dialogRef}
      {...({ closedby: 'any' } as Record<string, unknown>)}
      aria-labelledby={dialogTitleId}
      onClose={onClose}
      data-testid="exercise-detail-modal"
      className="surface-card rounded-2xl p-4 sm:p-6 max-w-2xl w-[calc(100%-1.5rem)] max-h-[90dvh] overflow-y-auto m-auto shadow-2xl"
    >
      {exercise && (
        <div className="space-y-4 text-left">
          {/* Header */}
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="text-xs font-bold text-[var(--brand-accent)]">
                {getCategoryLabel(exercise.category, locale)} ·{' '}
                {getDifficultyLabel(exercise.difficulty, locale)} ·{' '}
                <span className="mono-readout">
                  {exercise.defaultWorkSeconds}s / {exercise.defaultRestSeconds}s
                </span>
              </div>
              <h2
                id={dialogTitleId}
                data-testid="exercise-detail-title"
                className="text-xl sm:text-2xl font-black m-0 mt-0.5 text-[var(--text-primary)]"
              >
                {exercise.name[locale]}
              </h2>
            </div>
            <button
              type="button"
              onClick={onClose}
              data-testid="exercise-detail-close"
              aria-label={t.closeDialog}
              className="surface-elevated p-2 rounded-xl cursor-pointer shrink-0 hover:border-[var(--brand-accent)] transition-colors"
            >
              <X className="w-4 h-4" aria-hidden="true" />
            </button>
          </div>

          {/* Large SVG / Animated Visual Stage */}
          <div className="rounded-2xl overflow-hidden bg-[#070b14] border border-slate-800 p-3 sm:p-4 space-y-3">
            <ExerciseVisual
              media={exercise.media}
              locale={locale}
              className="w-full h-72 sm:h-96 max-h-[48vh] object-contain mx-auto rounded-xl"
            />
            <div className="flex flex-wrap items-center justify-between gap-2 px-1 pb-0.5">
              <div className="flex flex-wrap gap-1.5">
                {exercise.muscleGroups.map((m) => (
                  <span
                    key={m}
                    className="px-2.5 py-0.5 rounded-md bg-slate-900 border border-slate-800 text-slate-200 text-xs font-semibold"
                  >
                    {getMuscleLabel(m, locale)}
                  </span>
                ))}
              </div>
              <MotionToggleButton locale={locale} variant="dark" />
            </div>
          </div>

          {/* Structured Exercise Details */}
          <div
            data-testid="exercise-detail-specs"
            className="grid grid-cols-2 sm:grid-cols-4 gap-2"
          >
            <div className="surface-elevated rounded-xl px-3 py-2">
              <div className="text-[11px] font-semibold text-muted-token">{t.categoryLabel}</div>
              <div className="text-xs sm:text-sm font-extrabold text-[var(--brand-accent)] mt-0.5">
                {getCategoryLabel(exercise.category, locale)}
              </div>
            </div>
            <div className="surface-elevated rounded-xl px-3 py-2">
              <div className="text-[11px] font-semibold text-muted-token">{t.difficultyLabel}</div>
              <div className="text-xs sm:text-sm font-extrabold mt-0.5">
                {getDifficultyLabel(exercise.difficulty, locale)}
              </div>
            </div>
            <div className="surface-elevated rounded-xl px-3 py-2">
              <div className="text-[11px] font-semibold text-muted-token">{t.equipmentLabel}</div>
              <div className="text-xs sm:text-sm font-extrabold mt-0.5">
                {exercise.equipment.map((eq) => getEquipmentLabel(eq, locale)).join(', ')}
              </div>
            </div>
            <div className="surface-elevated rounded-xl px-3 py-2">
              <div className="text-[11px] font-semibold text-muted-token">{t.defaultTiming}</div>
              <div className="text-xs sm:text-sm font-extrabold mono-readout mt-0.5">
                {exercise.defaultWorkSeconds}s / {exercise.defaultRestSeconds}s
              </div>
            </div>
          </div>

          {/* Description & Step-by-Step Execution Below */}
          <div
            data-testid="exercise-detail-description"
            className="surface-elevated rounded-xl p-3.5 sm:p-4 space-y-2.5"
          >
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-[var(--brand-accent)] m-0">
              {t.descriptionTitle}
            </h3>
            <p className="text-xs sm:text-sm font-semibold text-muted-token m-0">
              {exercise.media.alt[locale]}
            </p>
            <ol className="text-sm space-y-1.5 pl-5 m-0 text-[var(--text-primary)]">
              {exercise.instructions[locale].map((inst, idx) => (
                <li key={idx}>{inst}</li>
              ))}
            </ol>
          </div>

          {/* Common Mistakes & Low-Impact Alternative (Visible Directly Below) */}
          <div className="surface-elevated rounded-xl p-3.5 sm:p-4 space-y-2.5 text-xs sm:text-sm">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-amber-500 m-0">
              {t.mistakesTitle}
            </h3>
            <ul className="space-y-1 pl-5 m-0 text-[var(--text-primary)]">
              {exercise.commonMistakes[locale].map((mistake, idx) => (
                <li key={idx}>{mistake}</li>
              ))}
            </ul>
            {exercise.easierVariation && (
              <p className="m-0 pt-2.5 border-t border-[var(--border-subtle)] text-[var(--text-primary)]">
                <strong className="text-[var(--brand-accent)]">{t.easierTitle}:</strong>{' '}
                {exercise.easierVariation[locale]}
              </p>
            )}
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="surface-elevated px-4 py-2 rounded-lg text-xs font-bold cursor-pointer"
            >
              {t.closeDialog}
            </button>
            {onTrainSingle && (
              <button
                type="button"
                onClick={() => onTrainSingle(exercise)}
                data-testid="exercise-detail-train-single"
                className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold px-4 py-2 rounded-lg text-xs inline-flex items-center gap-1.5 cursor-pointer transition-colors"
              >
                <Play className="w-3.5 h-3.5 fill-current" aria-hidden="true" />
                <span>{t.trainSingle}</span>
              </button>
            )}
          </div>
        </div>
      )}
    </dialog>
  );
};
