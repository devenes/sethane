import React, { useEffect, useId, useMemo, useRef, useState } from 'react';
import { AlertTriangle, BookOpen, CheckCircle2, Search, Sparkles, X } from 'lucide-react';
import { EXERCISES_CATALOG } from '../../data/exercises/catalog';
import { useSettingsStore } from '../../stores/settings-store';
import type {
  DifficultyLevel,
  EquipmentType,
  Exercise,
  ExerciseCategory,
} from '../../types';
import { resolveAssetUrl } from '../../utils/assets';
import {
  getCategoryLabel,
  getDifficultyLabel,
  getEquipmentLabel,
  getMuscleLabel,
  UI_STRINGS,
} from '../../utils/i18n';

export const ExercisesPage: React.FC = () => {
  const locale = useSettingsStore((s) => s.locale);
  const t = UI_STRINGS[locale].exercises;

  const searchInputId = useId();
  const categorySelectId = useId();
  const equipmentSelectId = useId();
  const difficultySelectId = useId();
  const dialogTitleId = useId();
  const dialogRef = useRef<HTMLDialogElement>(null);

  const [query, setQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<ExerciseCategory | 'all'>('all');
  const [equipmentFilter, setEquipmentFilter] = useState<EquipmentType | 'all'>('all');
  const [difficultyFilter, setDifficultyFilter] = useState<DifficultyLevel | 'all'>('all');
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (selectedExercise && !dialog.open) {
      dialog.showModal();
    } else if (!selectedExercise && dialog.open) {
      dialog.close();
    }
  }, [selectedExercise]);

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
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl sm:text-3xl font-black m-0">{t.title}</h1>
        <p className="text-sm sm:text-base text-muted-token m-0 max-w-3xl">{t.subtitle}</p>
      </div>

      {/* Filter Controls */}
      <div className="surface-card rounded-2xl p-4 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="md:col-span-1">
            <label htmlFor={searchInputId} className="visually-hidden">
              {t.searchPlaceholder}
            </label>
            <div className="relative">
              <Search
                className="w-4 h-4 text-muted-token absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                aria-hidden="true"
              />
              <input
                id={searchInputId}
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t.searchPlaceholder}
                className="surface-elevated w-full pl-10 pr-4 py-2.5 rounded-xl text-sm"
              />
            </div>
          </div>

          <div>
            <label htmlFor={equipmentSelectId} className="visually-hidden">
              {t.allEquipment}
            </label>
            <select
              id={equipmentSelectId}
              value={equipmentFilter}
              onChange={(e) => setEquipmentFilter(e.target.value as EquipmentType | 'all')}
              className="surface-elevated w-full px-3.5 py-2.5 rounded-xl text-sm font-semibold"
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
              className="surface-elevated w-full px-3.5 py-2.5 rounded-xl text-sm font-semibold"
            >
              <option value="all">{t.allDifficulty}</option>
              <option value="beginner">{getDifficultyLabel('beginner', locale)}</option>
              <option value="intermediate">{getDifficultyLabel('intermediate', locale)}</option>
              <option value="advanced">{getDifficultyLabel('advanced', locale)}</option>
            </select>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
          <div id={categorySelectId} className="flex flex-wrap gap-1.5">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setCategoryFilter(cat)}
                aria-pressed={categoryFilter === cat}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer transition-colors ${
                  categoryFilter === cat
                    ? 'bg-emerald-500 text-slate-950'
                    : 'surface-elevated text-muted-token hover:text-emerald-500'
                }`}
              >
                {cat === 'all' ? t.allCategories : getCategoryLabel(cat, locale)}
              </button>
            ))}
          </div>

          <span className="text-xs font-bold text-muted-token">
            {filteredExercises.length} {t.resultsCount}
          </span>
        </div>
      </div>

      {/* Exercise Catalog Grid */}
      <div
        data-testid="exercise-catalog-grid"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
      >
        {filteredExercises.map((exercise) => (
          <article
            key={exercise.id}
            data-testid={`exercise-card-${exercise.id}`}
            className="surface-card rounded-2xl overflow-hidden flex flex-col justify-between hover:border-emerald-500/40 transition-colors"
          >
            <div>
              <div className="bg-slate-950 border-b border-[var(--border-subtle)] p-2">
                <img
                  src={resolveAssetUrl(exercise.media.src)}
                  alt={exercise.media.alt[locale]}
                  loading="lazy"
                  className="w-full h-44 object-contain mx-auto"
                />
              </div>

              <div className="p-4 space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <h2 className="text-base font-extrabold m-0">{exercise.name[locale]}</h2>
                  <span className="shrink-0 px-2 py-0.5 rounded-md bg-emerald-500/15 text-emerald-500 text-[11px] font-bold">
                    {getDifficultyLabel(exercise.difficulty, locale)}
                  </span>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  <span className="px-2 py-0.5 rounded-md bg-cyan-500/15 text-cyan-500 text-[11px] font-semibold">
                    {getCategoryLabel(exercise.category, locale)}
                  </span>
                  {exercise.muscleGroups.map((m) => (
                    <span
                      key={m}
                      className="surface-elevated px-2 py-0.5 rounded-md text-[11px] font-medium"
                    >
                      {getMuscleLabel(m, locale)}
                    </span>
                  ))}
                </div>

                <p className="text-xs text-muted-token m-0 line-clamp-2">
                  {exercise.instructions[locale][0]}
                </p>
              </div>
            </div>

            <div className="px-4 pb-4 pt-2 flex items-center justify-between border-t border-[var(--border-subtle)]">
              <span className="text-xs font-bold text-muted-token">
                {exercise.defaultWorkSeconds}s / {exercise.defaultRestSeconds}s
              </span>
              <button
                type="button"
                onClick={() => setSelectedExercise(exercise)}
                className="surface-elevated hover:border-emerald-500/50 px-3 py-1.5 rounded-xl text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer"
              >
                <BookOpen className="w-3.5 h-3.5 text-emerald-500" aria-hidden="true" />
                <span>{t.viewDetails}</span>
              </button>
            </div>
          </article>
        ))}
      </div>

      {/* Native Accessible Modal Dialog for Exercise Details */}
      <dialog
        ref={dialogRef}
        aria-labelledby={dialogTitleId}
        onClose={() => setSelectedExercise(null)}
        className="surface-card rounded-3xl p-6 max-w-2xl w-[calc(100%-2rem)] m-auto shadow-2xl"
      >
        {selectedExercise && (
          <div className="space-y-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className="px-2.5 py-1 rounded-lg bg-emerald-500/15 text-emerald-500 text-xs font-bold">
                  {getCategoryLabel(selectedExercise.category, locale)} ·{' '}
                  {getDifficultyLabel(selectedExercise.difficulty, locale)}
                </span>
                <h2 id={dialogTitleId} className="text-2xl font-black m-0 mt-2">
                  {selectedExercise.name[locale]}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setSelectedExercise(null)}
                aria-label={t.closeDialog}
                className="surface-elevated p-2 rounded-xl cursor-pointer"
              >
                <X className="w-5 h-5" aria-hidden="true" />
              </button>
            </div>

            <div className="rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 p-3">
              <img
                src={resolveAssetUrl(selectedExercise.media.src)}
                alt={selectedExercise.media.alt[locale]}
                className="w-full h-56 object-contain mx-auto"
              />
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-extrabold uppercase tracking-wider text-emerald-500 flex items-center gap-1.5 m-0">
                <CheckCircle2 className="w-4 h-4" aria-hidden="true" />
                <span>{t.instructionsTitle}</span>
              </h3>
              <ol className="text-sm space-y-1.5 pl-5 m-0">
                {selectedExercise.instructions[locale].map((inst, idx) => (
                  <li key={idx}>{inst}</li>
                ))}
              </ol>
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-extrabold uppercase tracking-wider text-amber-500 flex items-center gap-1.5 m-0">
                <AlertTriangle className="w-4 h-4" aria-hidden="true" />
                <span>{t.mistakesTitle}</span>
              </h3>
              <ul className="text-sm space-y-1.5 pl-5 m-0">
                {selectedExercise.commonMistakes[locale].map((mistake, idx) => (
                  <li key={idx}>{mistake}</li>
                ))}
              </ul>
            </div>

            {selectedExercise.easierVariation && (
              <div className="surface-elevated rounded-2xl p-4 space-y-1">
                <div className="text-xs font-extrabold uppercase tracking-wider text-cyan-500 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4" aria-hidden="true" />
                  <span>{t.easierTitle}</span>
                </div>
                <p className="text-sm m-0">{selectedExercise.easierVariation[locale]}</p>
              </div>
            )}

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setSelectedExercise(null)}
                className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-5 py-2.5 rounded-xl text-sm cursor-pointer"
              >
                {t.closeDialog}
              </button>
            </div>
          </div>
        )}
      </dialog>
    </div>
  );
};
