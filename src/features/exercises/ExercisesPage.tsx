import React, { useId, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, Search, X } from 'lucide-react';
import { ExerciseVisual, MotionToggleButton } from '../../components/common/ExerciseVisual';
import { EXERCISES_CATALOG } from '../../data/exercises/catalog';
import { soundService } from '../../services/audio/sound-service';
import { useSettingsStore } from '../../stores/settings-store';
import { useWorkoutStore } from '../../stores/workout-store';
import type {
  DifficultyLevel,
  EquipmentType,
  Exercise,
  ExerciseCategory,
} from '../../types';
import { useLightDismissDialog } from '../../utils/dialog';
import {
  getCategoryLabel,
  getDifficultyLabel,
  getEquipmentLabel,
  getMuscleLabel,
  UI_STRINGS,
} from '../../utils/i18n';

export const ExercisesPage: React.FC = () => {
  const navigate = useNavigate();
  const locale = useSettingsStore((s) => s.locale);
  const selectWorkoutForPlayer = useWorkoutStore((s) => s.selectWorkoutForPlayer);
  const t = UI_STRINGS[locale].exercises;

  const searchInputId = useId();
  const equipmentSelectId = useId();
  const difficultySelectId = useId();
  const dialogTitleId = useId();
  const dialogRef = useRef<HTMLDialogElement>(null);

  const [query, setQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<ExerciseCategory | 'all'>('all');
  const [equipmentFilter, setEquipmentFilter] = useState<EquipmentType | 'all'>('all');
  const [difficultyFilter, setDifficultyFilter] = useState<DifficultyLevel | 'all'>('all');
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);

  useLightDismissDialog(dialogRef, Boolean(selectedExercise));

  const launchSingleExercise = (exercise: Exercise) => {
    soundService.unlock();
    setSelectedExercise(null);
    selectWorkoutForPlayer({
      id: `single-${exercise.id}-${Date.now()}`,
      name: `${exercise.name[locale]} (3×)`,
      prepareSeconds: 5,
      warmupSeconds: 0,
      rounds: 3,
      restBetweenRounds: exercise.defaultRestSeconds,
      cooldownSeconds: 0,
      exercises: [
        {
          exerciseId: exercise.id,
          workSeconds: exercise.defaultWorkSeconds,
          restSeconds: 0,
        },
      ],
    });
    navigate('/player');
  };

  const filteredExercises = useMemo(() => {
    const q = query.trim().toLowerCase();
    return EXERCISES_CATALOG.filter((ex) => {
      if (categoryFilter !== 'all' && ex.category !== categoryFilter) return false;
      if (equipmentFilter !== 'all' && !ex.equipment.includes(equipmentFilter)) return false;
      if (difficultyFilter !== 'all' && ex.difficulty !== difficultyFilter) return false;
      if (!q) return true;
      const matchesName =
        ex.name.en.toLowerCase().includes(q) || ex.name.tr.toLowerCase().includes(q);
      const matchesMuscle = ex.muscleGroups.some(
        (m) => m.toLowerCase().includes(q) || getMuscleLabel(m, locale).toLowerCase().includes(q)
      );
      return matchesName || matchesMuscle;
    });
  }, [categoryFilter, difficultyFilter, equipmentFilter, locale, query]);

  const categories: Array<ExerciseCategory | 'all'> = [
    'all',
    'bodyweight',
    'dumbbell',
    'core',
    'cardio',
    'low-impact',
  ];

  return (
    <div className="space-y-4">
      {/* Compact Header + Motion Control */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-baseline gap-2.5">
          <h1 className="text-xl sm:text-2xl font-black m-0">{t.title}</h1>
          <span className="text-xs mono-readout text-muted-token">
            {filteredExercises.length}/{EXERCISES_CATALOG.length}
          </span>
        </div>
        <MotionToggleButton locale={locale} />
      </div>

      {/* Compact Single-Card Filter Strip */}
      <div className="surface-card rounded-xl p-3 space-y-2.5">
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
          <div className="sm:col-span-2 relative">
            <label htmlFor={searchInputId} className="visually-hidden">
              {t.searchPlaceholder}
            </label>
            <Search
              className="w-3.5 h-3.5 text-muted-token absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
              aria-hidden="true"
            />
            <input
              id={searchInputId}
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t.searchPlaceholder}
              className="surface-elevated w-full pl-8.5 pr-3 py-1.5 rounded-lg text-xs font-medium"
            />
          </div>

          <div>
            <label htmlFor={equipmentSelectId} className="visually-hidden">
              {t.allEquipment}
            </label>
            <select
              id={equipmentSelectId}
              value={equipmentFilter}
              onChange={(e) => setEquipmentFilter(e.target.value as EquipmentType | 'all')}
              className="surface-elevated w-full px-2.5 py-1.5 rounded-lg text-xs font-semibold"
            >
              <option value="all">{t.allEquipment}</option>
              <option value="none">{getEquipmentLabel('none', locale)}</option>
              <option value="dumbbells">{getEquipmentLabel('dumbbells', locale)}</option>
              <option value="mat">{getEquipmentLabel('mat', locale)}</option>
            </select>
          </div>

          <div>
            <label htmlFor={difficultySelectId} className="visually-hidden">
              {t.allDifficulty}
            </label>
            <select
              id={difficultySelectId}
              value={difficultyFilter}
              onChange={(e) => setDifficultyFilter(e.target.value as DifficultyLevel | 'all')}
              className="surface-elevated w-full px-2.5 py-1.5 rounded-lg text-xs font-semibold"
            >
              <option value="all">{t.allDifficulty}</option>
              <option value="beginner">{getDifficultyLabel('beginner', locale)}</option>
              <option value="intermediate">{getDifficultyLabel('intermediate', locale)}</option>
              <option value="advanced">{getDifficultyLabel('advanced', locale)}</option>
            </select>
          </div>
        </div>

        <div className="flex flex-wrap gap-1">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setCategoryFilter(cat)}
              aria-pressed={categoryFilter === cat}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold cursor-pointer transition-colors ${
                categoryFilter === cat
                  ? 'bg-emerald-500 text-slate-950'
                  : 'surface-elevated text-muted-token hover:text-[var(--text-primary)]'
              }`}
            >
              {cat === 'all' ? t.allCategories : getCategoryLabel(cat, locale)}
            </button>
          ))}
        </div>
      </div>

      {/* Visual-First Exercise Grid */}
      <div
        data-testid="exercise-catalog-grid"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3.5"
      >
        {filteredExercises.map((exercise) => (
          <article
            key={exercise.id}
            data-testid={`exercise-card-${exercise.id}`}
            className="adaptive-card surface-card rounded-xl overflow-hidden flex flex-col justify-between hover:border-[var(--brand-accent)] transition-colors"
          >
            {/* Clickable Visual Viewport opens Form Guide */}
            <button
              type="button"
              onClick={() => setSelectedExercise(exercise)}
              aria-label={`${exercise.name[locale]} — ${t.viewDetails}`}
              className="relative block w-full bg-[#070b14] border-b border-[var(--border-subtle)] p-1.5 text-left cursor-pointer"
            >
              <ExerciseVisual
                media={exercise.media}
                locale={locale}
                loading="lazy"
                className="w-full aspect-[10/7] object-contain mx-auto rounded-lg"
              />
              <span className="absolute bottom-2.5 right-2.5 px-1.5 py-0.5 rounded bg-black/80 border border-slate-800 text-[10px] font-bold mono-readout text-slate-200">
                {exercise.defaultWorkSeconds}s / {exercise.defaultRestSeconds}s
              </span>
            </button>

            <div className="p-3 flex-1 flex flex-col justify-between gap-2.5">
              <div className="space-y-1.5">
                <h2 className="text-sm font-extrabold m-0 leading-snug">
                  {exercise.name[locale]}
                </h2>
                <div className="flex flex-wrap items-center gap-1 text-[11px] text-muted-token">
                  <span className="font-semibold text-[var(--brand-accent)]">
                    {getCategoryLabel(exercise.category, locale)}
                  </span>
                  {exercise.muscleGroups.slice(0, 2).map((m) => (
                    <span key={m}>· {getMuscleLabel(m, locale)}</span>
                  ))}
                </div>
              </div>

              <footer className="flex items-center gap-1.5 pt-1">
                <button
                  type="button"
                  onClick={() => launchSingleExercise(exercise)}
                  className="flex-1 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold px-2.5 py-1.5 rounded-lg text-xs inline-flex items-center justify-center gap-1 cursor-pointer transition-colors"
                >
                  <Play className="w-3 h-3 fill-current" aria-hidden="true" />
                  <span>{t.trainSingle}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedExercise(exercise)}
                  className="surface-elevated hover:border-[var(--brand-accent)] px-2.5 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition-colors"
                >
                  {t.viewDetails}
                </button>
              </footer>
            </div>
          </article>
        ))}
      </div>

      {/* Light-Dismissable Native Modal Dialog */}
      <dialog
        ref={dialogRef}
        {...({ closedby: 'any' } as Record<string, unknown>)}
        aria-labelledby={dialogTitleId}
        onClose={() => setSelectedExercise(null)}
        className="surface-card rounded-2xl p-5 max-w-xl w-[calc(100%-1.5rem)] m-auto shadow-2xl"
      >
        {selectedExercise && (
          <div className="space-y-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-xs font-bold text-[var(--brand-accent)]">
                  {getCategoryLabel(selectedExercise.category, locale)} ·{' '}
                  {getDifficultyLabel(selectedExercise.difficulty, locale)} ·{' '}
                  <span className="mono-readout">
                    {selectedExercise.defaultWorkSeconds}s/{selectedExercise.defaultRestSeconds}s
                  </span>
                </div>
                <h2 id={dialogTitleId} className="text-xl font-black m-0 mt-0.5">
                  {selectedExercise.name[locale]}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setSelectedExercise(null)}
                aria-label={t.closeDialog}
                className="surface-elevated p-1.5 rounded-lg cursor-pointer"
              >
                <X className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>

            <div className="rounded-xl overflow-hidden bg-[#070b14] border border-slate-800 p-2 space-y-2">
              <ExerciseVisual
                media={selectedExercise.media}
                locale={locale}
                className="w-full h-56 sm:h-64 object-contain mx-auto rounded-lg"
              />
              <div className="flex items-center justify-between px-1 pb-0.5">
                <div className="flex flex-wrap gap-1">
                  {selectedExercise.muscleGroups.map((m) => (
                    <span
                      key={m}
                      className="px-2 py-0.5 rounded bg-slate-900 text-slate-300 text-[11px] font-semibold"
                    >
                      {getMuscleLabel(m, locale)}
                    </span>
                  ))}
                </div>
                <MotionToggleButton locale={locale} variant="dark" />
              </div>
            </div>

            <div className="space-y-1.5">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-muted-token m-0">
                {t.instructionsTitle}
              </h3>
              <ol className="text-sm space-y-1 pl-5 m-0">
                {selectedExercise.instructions[locale].map((inst, idx) => (
                  <li key={idx}>{inst}</li>
                ))}
              </ol>
            </div>

            {/* Secondary details collapsed on demand per content-first-noise-reduction */}
            <details className="surface-elevated rounded-xl px-3.5 py-2.5 text-sm">
              <summary className="font-bold text-xs cursor-pointer select-none">
                {t.mistakesTitle}
                {selectedExercise.easierVariation ? ` & ${t.easierTitle}` : ''}
              </summary>
              <div className="pt-2.5 space-y-2.5 text-xs">
                <ul className="space-y-1 pl-4 m-0">
                  {selectedExercise.commonMistakes[locale].map((mistake, idx) => (
                    <li key={idx}>{mistake}</li>
                  ))}
                </ul>
                {selectedExercise.easierVariation && (
                  <p className="m-0 pt-1.5 border-t border-[var(--border-subtle)]">
                    <strong>{t.easierTitle}:</strong> {selectedExercise.easierVariation[locale]}
                  </p>
                )}
              </div>
            </details>

            <div className="flex items-center justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setSelectedExercise(null)}
                className="surface-elevated px-4 py-2 rounded-lg text-xs font-bold cursor-pointer"
              >
                {t.closeDialog}
              </button>
              <button
                type="button"
                onClick={() => launchSingleExercise(selectedExercise)}
                className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold px-4 py-2 rounded-lg text-xs inline-flex items-center gap-1.5 cursor-pointer transition-colors"
              >
                <Play className="w-3.5 h-3.5 fill-current" aria-hidden="true" />
                <span>{t.trainSingle}</span>
              </button>
            </div>
          </div>
        )}
      </dialog>
    </div>
  );
};
