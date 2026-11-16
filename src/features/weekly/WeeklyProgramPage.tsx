import React, { useEffect, useId, useMemo, useRef, useState } from 'react';
import { NavLink, useNavigate, useSearchParams } from 'react-router-dom';
import {
  DndContext,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS as DndCSS } from '@dnd-kit/utilities';
import {
  CalendarDays,
  CheckCircle2,
  GripVertical,
  Play,
  Plus,
  RotateCcw,
  Search,
  Sparkles,
  Trash2,
  X,
} from 'lucide-react';
import { ExerciseVisual, MotionToggleButton } from '../../components/common/ExerciseVisual';
import { EXERCISES_CATALOG, getExerciseById } from '../../data/exercises/catalog';
import {
  computeWeeklyMuscleSets,
  getTodayDayKey,
  TRACKED_WEEKLY_MUSCLES,
  WEEKLY_DAY_ORDER,
  WEEKLY_DEFINITIONS_BY_DAY,
  WEEKLY_PROGRAM_DEFINITIONS,
  type TrackedMuscleGroup,
} from '../../data/workouts/weekly-program';
import { calculateWorkoutSummary } from '../../engine/phase-resolver';
import { soundService } from '../../services/audio/sound-service';
import { useSettingsStore } from '../../stores/settings-store';
import { useWorkoutStore } from '../../stores/workout-store';
import type {
  DayOfWeekKey,
  Exercise,
  SupportedLocale,
  WorkoutExerciseItem,
  WorkoutPlan,
} from '../../types';
import { useLightDismissDialog } from '../../utils/dialog';
import { formatHumanDuration } from '../../utils/format';
import {
  getCategoryLabel,
  getDifficultyLabel,
  getMuscleLabel,
  UI_STRINGS,
} from '../../utils/i18n';

function isValidDayKey(value: string | null): value is DayOfWeekKey {
  return Boolean(value && (WEEKLY_DAY_ORDER as readonly string[]).includes(value));
}

interface WeeklySortableRowProps {
  item: WorkoutExerciseItem & { uid: string };
  index: number;
  totalCount: number;
  locale: SupportedLocale;
  reducedMotion: boolean;
  onInspect: (exercise: Exercise) => void;
  onUpdate: (index: number, patch: Partial<WorkoutExerciseItem>) => void;
  onRemove: (index: number) => void;
}

const WeeklySortableRow: React.FC<WeeklySortableRowProps> = ({
  item,
  index,
  totalCount,
  locale,
  reducedMotion,
  onInspect,
  onUpdate,
  onRemove,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.uid });

  const workInputId = useId();
  const restInputId = useId();
  const tw = UI_STRINGS[locale].weekly;
  const tb = UI_STRINGS[locale].builder;
  const exercise = getExerciseById(item.exerciseId);
  const exerciseTitle = exercise ? exercise.name[locale] : item.exerciseId;
  const isLast = index === totalCount - 1;

  const constrainedTransform = transform
    ? {
        ...transform,
        x: 0,
        scaleX: isDragging && !reducedMotion ? 1.015 : 1,
        scaleY: isDragging && !reducedMotion ? 1.015 : 1,
      }
    : null;

  const style: React.CSSProperties = {
    transform: DndCSS.Transform.toString(constrainedTransform),
    transition: reducedMotion ? undefined : transition,
    position: 'relative',
    zIndex: isDragging ? 20 : undefined,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      data-testid={`weekly-exercise-row-${index}`}
      data-dragging={isDragging ? 'true' : 'false'}
      className={`sortable-item surface-elevated rounded-xl overflow-hidden flex items-stretch transition-shadow ${
        isDragging
          ? 'shadow-2xl border-[var(--brand-accent)] ring-2 ring-[var(--brand-accent)]/40'
          : 'hover:border-[var(--brand-accent)]/50'
      }`}
    >
      {/* Drag Handle */}
      <div
        ref={setActivatorNodeRef}
        {...attributes}
        {...listeners}
        data-testid={`weekly-drag-handle-${index}`}
        aria-label={`${index + 1}. ${exerciseTitle} — ${tb.dragHandleAction}`}
        className="builder-drag-zone shrink-0 flex items-stretch cursor-grab active:cursor-grabbing"
      >
        <div className="builder-drag-handle w-9 sm:w-10 shrink-0 border-r border-[var(--border-subtle)] bg-black/15 hover:bg-emerald-500/10 text-muted-token hover:text-[var(--brand-accent)] flex flex-col items-center justify-center gap-1 transition-colors">
          <span className="text-xs font-black mono-readout text-[var(--text-primary)]">
            {index + 1}
          </span>
          <GripVertical className="w-4 h-4" aria-hidden="true" />
        </div>
      </div>

      {/* Clickable Visual Preview -> Opens Form Guide */}
      {exercise && (
        <div className="p-2 flex items-center shrink-0">
          <button
            type="button"
            onClick={() => onInspect(exercise)}
            aria-label={`${exerciseTitle} — ${UI_STRINGS[locale].exercises.viewDetails}`}
            className="w-24 sm:w-36 aspect-[10/7] rounded-xl overflow-hidden bg-[#070b14] border border-slate-800 p-1 cursor-pointer hover:border-[var(--brand-accent)] transition-colors"
          >
            <ExerciseVisual
              media={exercise.media}
              locale={locale}
              loading="lazy"
              className="w-full h-full object-contain rounded-lg"
            />
          </button>
        </div>
      )}

      {/* Details + Work/Rest + Remove */}
      <div className="flex-1 min-w-0 py-2.5 pr-3 pl-1 flex flex-col justify-between gap-2">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 space-y-0.5">
            <div className="flex flex-wrap items-center gap-1.5">
              <div className="font-extrabold text-sm sm:text-base leading-snug">{exerciseTitle}</div>
              {isLast && totalCount >= 3 && (
                <span className="px-1.5 py-0.5 rounded bg-amber-500/15 text-amber-400 text-[10px] font-extrabold uppercase tracking-wide">
                  {tw.finisherBadge}
                </span>
              )}
            </div>
            {exercise && (
              <div className="flex flex-wrap items-center gap-1 text-[11px] text-muted-token">
                <span className="font-semibold text-[var(--brand-accent)]">
                  {getCategoryLabel(exercise.category, locale)}
                </span>
                {exercise.muscleGroups
                  .filter((m) => m !== 'full-body')
                  .slice(0, 3)
                  .map((m) => (
                    <span key={m}>· {getMuscleLabel(m, locale)}</span>
                  ))}
              </div>
            )}
            <div
              aria-hidden="true"
              className="drag-key-hint text-[11px] font-semibold text-[var(--brand-accent)]"
            >
              {isDragging ? tb.keyHintGrabbed : tb.keyHintIdle}
            </div>
          </div>

          <button
            type="button"
            onClick={() => onRemove(index)}
            data-testid={`weekly-remove-exercise-${index}`}
            aria-label={`${tw.removeMove}: ${exerciseTitle}`}
            className="surface-card p-1.5 rounded-lg text-rose-500 hover:border-rose-500/60 cursor-pointer transition-colors shrink-0"
          >
            <Trash2 className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>

        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1.5">
              <label
                htmlFor={workInputId}
                className="text-xs font-semibold text-muted-token whitespace-nowrap"
              >
                {tw.workSec}
              </label>
              <input
                id={workInputId}
                type="number"
                min={5}
                max={600}
                value={item.workSeconds}
                onChange={(e) =>
                  onUpdate(index, { workSeconds: Math.max(5, Number(e.target.value) || 5) })
                }
                className="surface-card w-16 px-2 py-1 rounded-lg text-xs font-bold mono-readout text-center"
              />
            </div>

            <div className="flex items-center gap-1.5">
              <label
                htmlFor={restInputId}
                className="text-xs font-semibold text-muted-token whitespace-nowrap"
              >
                {tw.restSec}
              </label>
              <input
                id={restInputId}
                type="number"
                min={0}
                max={600}
                value={isLast ? 0 : item.restSeconds}
                disabled={isLast}
                onChange={(e) =>
                  onUpdate(index, { restSeconds: Math.max(0, Number(e.target.value) || 0) })
                }
                className="surface-card w-16 px-2 py-1 rounded-lg text-xs font-bold mono-readout text-center disabled:opacity-45"
              />
            </div>
          </div>

          {isLast && (
            <div className="text-[11px] text-amber-500 font-semibold">{tw.lastMoveNote}</div>
          )}
        </div>
      </div>
    </div>
  );
};

export const WeeklyProgramPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const locale = useSettingsStore((s) => s.locale);
  const presets = useWorkoutStore((s) => s.presets);
  const weeklySchedule = useWorkoutStore((s) => s.weeklySchedule);
  const customizedWeeklyDays = useWorkoutStore((s) => s.customizedWeeklyDays);
  const history = useWorkoutStore((s) => s.history);
  const selectWorkoutForPlayer = useWorkoutStore((s) => s.selectWorkoutForPlayer);
  const updateWeeklyDayWorkout = useWorkoutStore((s) => s.updateWeeklyDayWorkout);
  const resetWeeklyDay = useWorkoutStore((s) => s.resetWeeklyDay);
  const resetAllWeeklyDays = useWorkoutStore((s) => s.resetAllWeeklyDays);

  const todayKey = useMemo(() => getTodayDayKey(), []);
  const requestedDay = searchParams.get('day');

  const [selectedDay, setSelectedDay] = useState<DayOfWeekKey>(() =>
    isValidDayKey(requestedDay) ? requestedDay : todayKey
  );
  const [pickerOpen, setPickerOpen] = useState(false);
  const [pickerQuery, setPickerQuery] = useState('');
  const [pickerMuscle, setPickerMuscle] = useState<TrackedMuscleGroup | 'all'>('all');
  const [addedExerciseToast, setAddedExerciseToast] = useState<string | null>(null);
  const [inspectedExercise, setInspectedExercise] = useState<Exercise | null>(null);
  const [liveAnnouncement, setLiveAnnouncement] = useState('');

  const tablistRef = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<Partial<Record<DayOfWeekKey, HTMLButtonElement | null>>>({});
  const panelRefs = useRef<Partial<Record<DayOfWeekKey, HTMLDivElement | null>>>({});
  const pickerDialogRef = useRef<HTMLDialogElement>(null);
  const inspectDialogRef = useRef<HTMLDialogElement>(null);

  const tabIdPrefix = useId();
  const pickerTitleId = useId();
  const pickerSearchId = useId();
  const inspectTitleId = useId();
  const roundsInputId = useId();
  const roundRestInputId = useId();
  const warmupInputId = useId();
  const cooldownInputId = useId();
  const applyPresetSelectId = useId();

  const tw = UI_STRINGS[locale].weekly;
  const tn = UI_STRINGS[locale].nav;
  const te = UI_STRINGS[locale].exercises;
  const tb = UI_STRINGS[locale].builder;

  useLightDismissDialog(pickerDialogRef, pickerOpen);
  useLightDismissDialog(inspectDialogRef, Boolean(inspectedExercise));

  const reducedMotion =
    typeof window !== 'undefined' &&
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  useEffect(() => {
    return () => {
      document.documentElement.classList.remove('is-reordering');
    };
  }, []);

  // Scroll-driven animation fallback for tablist edge fades (tabs guide)
  useEffect(() => {
    const scroller = tablistRef.current;
    if (!scroller) return;
    if (
      typeof CSS !== 'undefined' &&
      typeof CSS.supports === 'function' &&
      CSS.supports('animation-timeline', 'scroll()')
    ) {
      return;
    }
    const first = scroller.firstElementChild;
    const last = scroller.lastElementChild;
    if (!first || !last || typeof IntersectionObserver === 'undefined') return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const { target, intersectionRatio } of entries) {
          scroller.classList.toggle(
            target === first ? 'more-start' : 'more-end',
            intersectionRatio < 1
          );
        }
      },
      { root: scroller, threshold: 1, rootMargin: '1px' }
    );

    observer.observe(first);
    observer.observe(last);
    return () => observer.disconnect();
  }, []);

  // Scroll selected tab into view within the horizontal scroller on selection change (tabs guide)
  useEffect(() => {
    const activeTab = tabRefs.current[selectedDay];
    if (activeTab && typeof activeTab.scrollIntoView === 'function') {
      try {
        activeTab.scrollIntoView({
          block: 'nearest',
          inline: 'nearest',
          container: 'nearest',
        } as ScrollIntoViewOptions);
      } catch {
        activeTab.scrollIntoView({ block: 'nearest', inline: 'nearest' });
      }
    }
  }, [selectedDay]);

  // Sync tab selection on Find-in-Page `beforematch` for hidden="until-found" panels (tabs guide)
  useEffect(() => {
    const cleanups: Array<() => void> = [];
    for (const dayKey of WEEKLY_DAY_ORDER) {
      const panel = panelRefs.current[dayKey];
      if (!panel) continue;
      const onBeforeMatch = () => setSelectedDay(dayKey);
      panel.addEventListener('beforematch', onBeforeMatch);
      cleanups.push(() => panel.removeEventListener('beforematch', onBeforeMatch));
    }
    return () => cleanups.forEach((fn) => fn());
  }, []);

  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 4 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 120, tolerance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const selectedDef = WEEKLY_DEFINITIONS_BY_DAY[selectedDay];
  const selectedWorkout = weeklySchedule[selectedDay] ?? selectedDef.defaultWorkout;
  const summary = useMemo(() => calculateWorkoutSummary(selectedWorkout), [selectedWorkout]);
  const weeklyMuscleSets = useMemo(
    () => computeWeeklyMuscleSets(weeklySchedule),
    [weeklySchedule]
  );

  const weeklyTotals = useMemo(() => {
    let coreHiitSeconds = 0;
    let totalSets = 0;
    for (const dayKey of WEEKLY_DAY_ORDER) {
      const plan = weeklySchedule[dayKey] ?? WEEKLY_DEFINITIONS_BY_DAY[dayKey].defaultWorkout;
      const daySummary = calculateWorkoutSummary(plan);
      coreHiitSeconds += daySummary.coreHiitSeconds;
      totalSets += Math.max(1, plan.rounds) * plan.exercises.length;
    }
    return { coreHiitSeconds, totalSets };
  }, [weeklySchedule]);

  const activeDayMuscles = useMemo(() => {
    const set = new Set<TrackedMuscleGroup>();
    for (const item of selectedWorkout.exercises) {
      const ex = getExerciseById(item.exerciseId);
      if (!ex) continue;
      for (const m of ex.muscleGroups) {
        if (m !== 'full-body') set.add(m);
      }
    }
    return set;
  }, [selectedWorkout]);

  const completedWorkoutIdsToday = useMemo(() => {
    const todayStr = new Date().toDateString();
    const ids = new Set<string>();
    for (const entry of history) {
      if (new Date(entry.completedAt).toDateString() === todayStr) {
        ids.add(entry.workoutId);
      }
    }
    return ids;
  }, [history]);

  const anyDayCustomized = Object.keys(customizedWeeklyDays).length > 0;
  const isSelectedDayCustomized = Boolean(customizedWeeklyDays[selectedDay]);

  const sortableItems = useMemo(
    () =>
      selectedWorkout.exercises.map((item, idx) => ({
        ...item,
        uid: item.id ?? `${selectedDay}-item-${idx}`,
      })),
    [selectedDay, selectedWorkout.exercises]
  );

  const exerciseCountsInDay = useMemo(() => {
    const map: Record<string, number> = {};
    for (const ex of selectedWorkout.exercises) {
      map[ex.exerciseId] = (map[ex.exerciseId] ?? 0) + 1;
    }
    return map;
  }, [selectedWorkout.exercises]);

  const filteredCatalog = useMemo(() => {
    const q = pickerQuery.trim().toLowerCase();
    return EXERCISES_CATALOG.filter((ex) => {
      if (pickerMuscle !== 'all' && !ex.muscleGroups.includes(pickerMuscle)) {
        return false;
      }
      if (!q) return true;
      const nameMatch =
        ex.name.en.toLowerCase().includes(q) || ex.name.tr.toLowerCase().includes(q);
      const muscleMatch = ex.muscleGroups.some(
        (m) => m.toLowerCase().includes(q) || getMuscleLabel(m, locale).toLowerCase().includes(q)
      );
      return nameMatch || muscleMatch;
    });
  }, [locale, pickerMuscle, pickerQuery]);

  const selectAndFocusDay = (dayKey: DayOfWeekKey) => {
    setSelectedDay(dayKey);
    tabRefs.current[dayKey]?.focus();
  };

  const handleTabKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>, currentIdx: number) => {
    let nextIdx: number | null = null;
    if (e.key === 'ArrowRight') {
      nextIdx = (currentIdx + 1) % WEEKLY_DAY_ORDER.length;
    } else if (e.key === 'ArrowLeft') {
      nextIdx = (currentIdx - 1 + WEEKLY_DAY_ORDER.length) % WEEKLY_DAY_ORDER.length;
    } else if (e.key === 'Home') {
      nextIdx = 0;
    } else if (e.key === 'End') {
      nextIdx = WEEKLY_DAY_ORDER.length - 1;
    }
    if (nextIdx !== null) {
      e.preventDefault();
      selectAndFocusDay(WEEKLY_DAY_ORDER[nextIdx]!);
    }
  };

  const handleStartDay = (skipWarmup = false) => {
    if (selectedWorkout.exercises.length === 0) return;
    soundService.unlock();
    const localizedTitle = selectedWorkout.localizedName?.[locale] ?? selectedWorkout.name;
    const planToRun: WorkoutPlan = {
      ...selectedWorkout,
      name: localizedTitle,
      warmupSeconds: skipWarmup ? 0 : selectedWorkout.warmupSeconds,
      cooldownSeconds: skipWarmup ? 0 : selectedWorkout.cooldownSeconds,
    };
    selectWorkoutForPlayer(planToRun);
    navigate('/player');
  };

  const handleMetaPatch = (patch: Partial<WorkoutPlan>) => {
    void updateWeeklyDayWorkout(selectedDay, {
      ...selectedWorkout,
      ...patch,
    });
  };

  const handleApplyPresetToDay = (presetId: string) => {
    if (!presetId) return;
    const preset = presets.find((p) => p.id === presetId);
    if (!preset) return;
    const presetTitle = preset.localizedName?.[locale] ?? preset.name;
    const nextPlan: WorkoutPlan = {
      ...selectedWorkout,
      name: `${selectedDef.dayLabel[locale]} — ${presetTitle}`,
      localizedName: {
        en: `${selectedDef.dayLabel.en} · ${preset.localizedName?.en ?? preset.name}`,
        tr: `${selectedDef.dayLabel.tr} · ${preset.localizedName?.tr ?? preset.name}`,
      },
      description: preset.description ? { ...preset.description } : selectedWorkout.description,
      prepareSeconds: preset.prepareSeconds ?? 5,
      warmupSeconds: preset.warmupSeconds,
      rounds: preset.rounds,
      restBetweenRounds: preset.restBetweenRounds,
      cooldownSeconds: preset.cooldownSeconds,
      exercises: preset.exercises.map((ex, idx, arr) => ({
        id: `${selectedDay}-preset-${Date.now()}-${idx}`,
        exerciseId: ex.exerciseId,
        workSeconds: ex.workSeconds,
        restSeconds: idx === arr.length - 1 ? 0 : ex.restSeconds,
      })),
    };
    void updateWeeklyDayWorkout(selectedDay, nextPlan);
    setLiveAnnouncement(`${presetTitle} — ${selectedDef.dayLabel[locale]}`);
  };

  const handleUpdateExercise = (index: number, patch: Partial<WorkoutExerciseItem>) => {
    const nextExercises = selectedWorkout.exercises.map((item, idx) =>
      idx === index ? { ...item, ...patch } : item
    );
    void updateWeeklyDayWorkout(selectedDay, {
      ...selectedWorkout,
      exercises: nextExercises,
    });
  };

  const handleRemoveExercise = (index: number) => {
    const removed = selectedWorkout.exercises[index];
    const exObj = removed ? getExerciseById(removed.exerciseId) : undefined;
    const nextExercises = selectedWorkout.exercises
      .filter((_, idx) => idx !== index)
      .map((item, idx, arr) => ({
        ...item,
        restSeconds: idx === arr.length - 1 ? 0 : item.restSeconds || 15,
      }));
    void updateWeeklyDayWorkout(selectedDay, {
      ...selectedWorkout,
      exercises: nextExercises,
    });
    if (exObj) {
      setLiveAnnouncement(`${exObj.name[locale]} — ${tw.removeMove}`);
    }
  };

  const handleAddExercise = (exercise: Exercise) => {
    const restoredPrev = selectedWorkout.exercises.map((item) => ({
      ...item,
      restSeconds: item.restSeconds === 0 ? 15 : item.restSeconds,
    }));
    const nextExercises: WorkoutExerciseItem[] = [
      ...restoredPrev,
      {
        id: `${selectedDay}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        exerciseId: exercise.id,
        workSeconds: exercise.defaultWorkSeconds,
        restSeconds: 0,
      },
    ];
    void updateWeeklyDayWorkout(selectedDay, {
      ...selectedWorkout,
      exercises: nextExercises,
    });
    setAddedExerciseToast(exercise.name[locale]);
    setLiveAnnouncement(`${tw.pickerAddedToast}: ${exercise.name[locale]}`);
    setTimeout(() => {
      setAddedExerciseToast((curr) => (curr === exercise.name[locale] ? null : curr));
    }, 1800);
  };

  const handleDragStart = (_event: DragStartEvent) => {
    document.documentElement.classList.add('is-reordering');
  };

  const handleDragCancel = () => {
    document.documentElement.classList.remove('is-reordering');
  };

  const handleDragEnd = (event: DragEndEvent) => {
    document.documentElement.classList.remove('is-reordering');
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIdx = sortableItems.findIndex((i) => i.uid === active.id);
    const newIdx = sortableItems.findIndex((i) => i.uid === over.id);
    if (oldIdx < 0 || newIdx < 0) return;

    const moved = arrayMove(sortableItems, oldIdx, newIdx).map((it, idx, arr) => ({
      id: it.uid,
      exerciseId: it.exerciseId,
      workSeconds: it.workSeconds,
      restSeconds: idx === arr.length - 1 ? 0 : it.restSeconds === 0 ? 15 : it.restSeconds,
    }));

    const movedEx = getExerciseById(sortableItems[oldIdx]!.exerciseId);
    const movedTitle = movedEx ? movedEx.name[locale] : sortableItems[oldIdx]!.exerciseId;
    setLiveAnnouncement(`${movedTitle} — ${tb.reorderedAnnouncement} ${newIdx + 1}/${moved.length}`);

    void updateWeeklyDayWorkout(selectedDay, {
      ...selectedWorkout,
      exercises: moved,
    });
  };

  const maxMuscleSets = Math.max(18, ...Object.values(weeklyMuscleSets));

  return (
    <div className="space-y-5" data-testid="weekly-program-page">
      <p role="status" className="visually-hidden">
        {liveAnnouncement}
      </p>

      {/* Mode Switcher + Page Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="space-y-1">
          <nav
            aria-label="Training mode"
            className="inline-flex items-center p-1 rounded-xl surface-card gap-1"
          >
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                `px-3 py-1 rounded-lg text-xs font-bold no-underline transition-colors ${
                  isActive
                    ? 'bg-emerald-500 text-slate-950'
                    : 'text-muted-token hover:text-[var(--text-primary)]'
                }`
              }
            >
              {tn.modeStandard}
            </NavLink>
            <NavLink
              to="/weekly"
              className={({ isActive }) =>
                `px-3 py-1 rounded-lg text-xs font-bold no-underline inline-flex items-center gap-1.5 transition-colors ${
                  isActive
                    ? 'bg-emerald-500 text-slate-950'
                    : 'text-muted-token hover:text-[var(--text-primary)]'
                }`
              }
            >
              <CalendarDays className="w-3.5 h-3.5" aria-hidden="true" />
              <span>{tn.modeWeekly}</span>
            </NavLink>
          </nav>

          <div className="flex flex-wrap items-baseline gap-2.5 pt-1">
            <h1 className="text-xl sm:text-2xl font-black m-0">{tw.pageTitle}</h1>
            <span className="text-xs text-muted-token font-semibold">{tw.subtitle}</span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {selectedDay !== todayKey && (
            <button
              type="button"
              onClick={() => selectAndFocusDay(todayKey)}
              data-testid="weekly-jump-today-btn"
              className="surface-card hover:border-[var(--brand-accent)] px-3 py-1.5 rounded-lg text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer transition-colors"
            >
              <CalendarDays className="w-3.5 h-3.5 text-[var(--brand-accent)]" aria-hidden="true" />
              <span>
                {tw.jumpToToday} ({WEEKLY_DEFINITIONS_BY_DAY[todayKey].dayLabel[locale]})
              </span>
            </button>
          )}

          <MotionToggleButton locale={locale} />

          {anyDayCustomized && (
            <button
              type="button"
              onClick={() => void resetAllWeeklyDays()}
              data-testid="weekly-reset-all-btn"
              className="surface-card hover:border-rose-500/60 text-xs font-bold px-3 py-1.5 rounded-lg inline-flex items-center gap-1.5 cursor-pointer text-muted-token hover:text-rose-500 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
              <span>{tw.resetWeekBtn}</span>
            </button>
          )}
        </div>
      </div>

      {/* 7-Day Weekly Muscle Coverage Bar (Live-Calculated Across All 7 Days) */}
      <section className="surface-card rounded-xl p-3.5 space-y-2.5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-2.5">
            <h2 className="text-xs font-extrabold uppercase tracking-wider text-muted-token m-0 inline-flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[var(--brand-accent)]" aria-hidden="true" />
              <span>{tw.coverageHeading}</span>
            </h2>
            <span className="text-[11px] font-bold mono-readout text-[var(--brand-accent)]">
              {tw.weeklyTotalHiitLabel}: {formatHumanDuration(weeklyTotals.coreHiitSeconds, locale)} ·{' '}
              {weeklyTotals.totalSets} {tw.weeklyTotalSetsLabel}
            </span>
          </div>
          <span className="text-[11px] font-semibold text-muted-token mono-readout">
            {WEEKLY_DEFINITIONS_BY_DAY[selectedDay].dayLabel[locale]}:{' '}
            {Array.from(activeDayMuscles)
              .map((m) => getMuscleLabel(m, locale))
              .join(' · ')}
          </span>
        </div>

        <div
          data-testid="weekly-muscle-coverage"
          className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2"
        >
          {TRACKED_WEEKLY_MUSCLES.map((muscle) => {
            const sets = weeklyMuscleSets[muscle];
            const pct = Math.min(100, Math.round((sets / maxMuscleSets) * 100));
            const activeToday = activeDayMuscles.has(muscle);
            return (
              <div
                key={muscle}
                data-testid={`coverage-pill-${muscle}`}
                className={`surface-elevated rounded-lg px-2.5 py-2 space-y-1.5 transition-colors ${
                  activeToday ? 'border-[var(--brand-accent)]/70' : ''
                }`}
              >
                <div className="flex items-center justify-between gap-1 text-xs">
                  <span className="font-bold truncate">{getMuscleLabel(muscle, locale)}</span>
                  <span className="mono-readout text-[11px] font-bold text-[var(--brand-accent)]">
                    {sets}
                  </span>
                </div>
                <div className="h-1.5 rounded-full bg-black/25 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-emerald-500 progress-fill"
                    style={{ width: `${Math.max(10, pct)}%` }}
                  />
                </div>
                <div className="text-[10px] mono-readout text-muted-token">
                  {sets} {tw.coverageSetsUnit}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Single-Row Accessible 7-Day Tablist + Stacked Searchable Tabpanels */}
      <div className="space-y-4">
        <div
          ref={tablistRef}
          role="tablist"
          aria-label={tw.tablistLabel}
          className="weekly-tablist-scroller surface-card rounded-xl p-1 gap-1"
        >
          {WEEKLY_PROGRAM_DEFINITIONS.map((def, idx) => {
            const isSelected = selectedDay === def.dayKey;
            const isToday = todayKey === def.dayKey;
            const dayPlan = weeklySchedule[def.dayKey] ?? def.defaultWorkout;
            const isCustomized = Boolean(customizedWeeklyDays[def.dayKey]);
            const isDoneToday = completedWorkoutIdsToday.has(dayPlan.id);

            return (
              <button
                key={def.dayKey}
                ref={(el) => {
                  tabRefs.current[def.dayKey] = el;
                }}
                id={`${tabIdPrefix}-${def.dayKey}`}
                type="button"
                role="tab"
                data-testid={`weekly-day-tab-${def.dayKey}`}
                aria-selected={isSelected}
                tabIndex={isSelected ? 0 : -1}
                onClick={() => setSelectedDay(def.dayKey)}
                onKeyDown={(e) => handleTabKeyDown(e, idx)}
                className="weekly-tab rounded-lg px-3.5 py-2.5 text-left cursor-pointer hover:bg-emerald-500/5 transition-colors min-w-[118px] sm:flex-1"
              >
                <div className="flex items-center justify-between gap-1.5">
                  <span className="text-xs sm:text-sm font-black">
                    {def.dayLabel[locale]}
                  </span>
                  {isToday && (
                    <span
                      data-testid={`weekly-today-badge-${def.dayKey}`}
                      className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-[var(--brand-accent)] text-[10px] font-extrabold uppercase tracking-wide"
                    >
                      {tw.todayBadge}
                    </span>
                  )}
                  {!isToday && isDoneToday && (
                    <CheckCircle2
                      className="w-3.5 h-3.5 text-[var(--brand-accent)] shrink-0"
                      aria-hidden="true"
                    />
                  )}
                </div>
                <div className="mt-0.5 text-[11px] text-muted-token font-semibold truncate">
                  {dayPlan.exercises.length} {tw.movesShort} · {dayPlan.rounds}×
                  {isCustomized ? ' · ★' : ''}
                </div>
              </button>
            );
          })}
        </div>

        {/* All 7 Tabpanels in a Single Grid Cell (hidden="until-found" on inactive panels) */}
        <div className="weekly-tabpanels-stack">
          {WEEKLY_PROGRAM_DEFINITIONS.map((def) => {
            const isSelected = selectedDay === def.dayKey;
            const dayPlan = weeklySchedule[def.dayKey] ?? def.defaultWorkout;
            const panelTitle = dayPlan.localizedName?.[locale] ?? dayPlan.name;

            return (
              <div
                key={def.dayKey}
                ref={(el) => {
                  panelRefs.current[def.dayKey] = el;
                }}
                role="tabpanel"
                aria-labelledby={`${tabIdPrefix}-${def.dayKey}`}
                data-testid={`weekly-tabpanel-${def.dayKey}`}
                {...(!isSelected ? ({ hidden: 'until-found' } as Record<string, unknown>) : {})}
              >
                {isSelected ? (
                  <div className="space-y-4">
                    {/* Active Day Spotlight & Controls Card */}
                    <section className="surface-card rounded-xl p-4 sm:p-5 space-y-4 border-[var(--brand-accent)]/50">
                      <div className="flex flex-wrap items-start justify-between gap-4">
                        <div className="space-y-1.5 max-w-2xl">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="px-2 py-0.5 rounded-md bg-emerald-500/15 text-[var(--brand-accent)] text-xs font-extrabold">
                              {def.focusBadge[locale]}
                            </span>
                            {todayKey === def.dayKey && (
                              <span className="px-2 py-0.5 rounded-md surface-elevated text-[11px] font-bold">
                                {tw.todayBadge}
                              </span>
                            )}
                            {isSelectedDayCustomized && (
                              <span className="px-2 py-0.5 rounded-md surface-elevated text-amber-500 text-[11px] font-bold">
                                {tw.customizedBadge}
                              </span>
                            )}
                            {completedWorkoutIdsToday.has(dayPlan.id) && (
                              <span className="px-2 py-0.5 rounded-md bg-emerald-500/15 text-[var(--brand-accent)] text-[11px] font-bold inline-flex items-center gap-1">
                                <CheckCircle2 className="w-3 h-3" aria-hidden="true" />
                                <span>{tw.doneTodayBadge}</span>
                              </span>
                            )}
                          </div>

                          <h2
                            data-testid="weekly-active-day-heading"
                            className="text-lg sm:text-xl font-black m-0"
                          >
                            {panelTitle}
                          </h2>

                          {dayPlan.description && (
                            <p className="text-xs sm:text-sm text-muted-token m-0">
                              {dayPlan.description[locale]}
                            </p>
                          )}
                        </div>

                        {/* Primary Launch Buttons */}
                        <div className="flex flex-wrap items-center gap-2">
                          <button
                            type="button"
                            disabled={selectedWorkout.exercises.length === 0}
                            onClick={() => handleStartDay(false)}
                            data-testid="weekly-start-day-btn"
                            className="bg-emerald-500 hover:bg-emerald-400 disabled:opacity-40 text-slate-950 font-extrabold px-4 py-2.5 rounded-xl text-xs sm:text-sm inline-flex items-center gap-1.5 cursor-pointer transition-colors"
                          >
                            <Play className="w-4 h-4 fill-current" aria-hidden="true" />
                            <span>
                              {tw.startDayBtn} ({def.dayLabel[locale]})
                            </span>
                          </button>

                          {selectedWorkout.warmupSeconds > 0 && (
                            <button
                              type="button"
                              disabled={selectedWorkout.exercises.length === 0}
                              onClick={() => handleStartDay(true)}
                              className="surface-elevated hover:border-[var(--brand-accent)] disabled:opacity-40 px-3 py-2.5 rounded-xl text-xs font-bold cursor-pointer transition-colors"
                            >
                              {tw.startNoWarmupBtn}
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Quick Day Parameters + Live Duration Readout */}
                      <div className="pt-3 border-t border-[var(--border-subtle)] grid grid-cols-1 lg:grid-cols-12 gap-3 items-end">
                        <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-4 gap-2">
                          <div>
                            <label
                              htmlFor={roundsInputId}
                              className="block text-[11px] font-semibold text-muted-token mb-1"
                            >
                              {tw.roundsLabel}
                            </label>
                            <input
                              id={roundsInputId}
                              data-testid="weekly-rounds-input"
                              type="number"
                              min={1}
                              max={20}
                              value={selectedWorkout.rounds}
                              onChange={(e) =>
                                handleMetaPatch({
                                  rounds: Math.max(1, Number(e.target.value) || 1),
                                })
                              }
                              className="surface-elevated w-full px-2.5 py-1.5 rounded-lg font-bold mono-readout text-xs text-center"
                            />
                          </div>

                          <div>
                            <label
                              htmlFor={roundRestInputId}
                              className="block text-[11px] font-semibold text-muted-token mb-1"
                            >
                              {tw.roundRestLabel}
                            </label>
                            <input
                              id={roundRestInputId}
                              type="number"
                              min={0}
                              max={600}
                              value={selectedWorkout.restBetweenRounds}
                              onChange={(e) =>
                                handleMetaPatch({
                                  restBetweenRounds: Math.max(0, Number(e.target.value) || 0),
                                })
                              }
                              className="surface-elevated w-full px-2.5 py-1.5 rounded-lg font-bold mono-readout text-xs text-center"
                            />
                          </div>

                          <div>
                            <label
                              htmlFor={warmupInputId}
                              className="block text-[11px] font-semibold text-muted-token mb-1"
                            >
                              {tw.warmupLabel}
                            </label>
                            <input
                              id={warmupInputId}
                              type="number"
                              min={0}
                              max={1800}
                              value={selectedWorkout.warmupSeconds}
                              onChange={(e) =>
                                handleMetaPatch({
                                  warmupSeconds: Math.max(0, Number(e.target.value) || 0),
                                })
                              }
                              className="surface-elevated w-full px-2.5 py-1.5 rounded-lg font-bold mono-readout text-xs text-center"
                            />
                          </div>

                          <div>
                            <label
                              htmlFor={cooldownInputId}
                              className="block text-[11px] font-semibold text-muted-token mb-1"
                            >
                              {tw.cooldownLabel}
                            </label>
                            <input
                              id={cooldownInputId}
                              type="number"
                              min={0}
                              max={1800}
                              value={selectedWorkout.cooldownSeconds}
                              onChange={(e) =>
                                handleMetaPatch({
                                  cooldownSeconds: Math.max(0, Number(e.target.value) || 0),
                                })
                              }
                              className="surface-elevated w-full px-2.5 py-1.5 rounded-lg font-bold mono-readout text-xs text-center"
                            />
                          </div>
                        </div>

                        <div className="lg:col-span-5 flex flex-wrap items-center justify-between gap-2 surface-elevated rounded-lg px-3 py-2 text-xs mono-readout">
                          <div>
                            <span className="text-muted-token">{tb.summaryCoreHiit}: </span>
                            <strong className="text-[var(--brand-accent)]">
                              {formatHumanDuration(summary.coreHiitSeconds, locale)}
                            </strong>
                          </div>
                          <div>
                            <span className="text-muted-token">{tb.summaryTotalTime}: </span>
                            <strong>{formatHumanDuration(summary.totalSeconds, locale)}</strong>
                          </div>
                        </div>
                      </div>
                    </section>

                    {/* Day Exercise Sequence Card (Add / Remove / Reorder / Adjust Intervals) */}
                    <section className="surface-card rounded-xl p-4 space-y-3">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-baseline gap-2">
                          <h3 className="text-sm font-extrabold uppercase tracking-wider text-muted-token m-0">
                            {tw.sequenceHeading} ({sortableItems.length})
                          </h3>
                          {sortableItems.length > 1 && (
                            <span className="text-xs text-muted-token">· {tb.dragHint}</span>
                          )}
                        </div>

                        <div className="flex flex-wrap items-center gap-2">
                          <label htmlFor={applyPresetSelectId} className="visually-hidden">
                            {tw.applyPresetLabel}
                          </label>
                          <select
                            id={applyPresetSelectId}
                            data-testid="weekly-apply-preset-select"
                            value=""
                            onChange={(e) => handleApplyPresetToDay(e.target.value)}
                            className="surface-elevated hover:border-[var(--brand-accent)] px-2.5 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition-colors max-w-[210px]"
                          >
                            <option value="">{tw.applyPresetPlaceholder}</option>
                            {presets.map((p) => (
                              <option key={p.id} value={p.id}>
                                {p.localizedName?.[locale] ?? p.name}
                              </option>
                            ))}
                          </select>

                          {isSelectedDayCustomized && (
                            <button
                              type="button"
                              onClick={() => void resetWeeklyDay(selectedDay)}
                              data-testid="weekly-reset-day-btn"
                              className="surface-elevated hover:border-amber-500/60 px-3 py-1.5 rounded-lg text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer transition-colors"
                            >
                              <RotateCcw className="w-3.5 h-3.5 text-amber-500" aria-hidden="true" />
                              <span>{tw.resetDayBtn}</span>
                            </button>
                          )}

                          <button
                            type="button"
                            onClick={() => setPickerOpen(true)}
                            data-testid="weekly-open-picker-btn"
                            className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold px-3.5 py-1.5 rounded-lg text-xs inline-flex items-center gap-1.5 cursor-pointer transition-colors"
                          >
                            <Plus className="w-3.5 h-3.5" aria-hidden="true" />
                            <span>{tw.addMoveBtn}</span>
                          </button>
                        </div>
                      </div>

                      {sortableItems.length === 0 ? (
                        <div className="surface-elevated rounded-xl p-6 text-center space-y-3">
                          <p className="text-xs text-muted-token font-semibold m-0">
                            {tw.emptyDayWarning}
                          </p>
                          <div className="flex justify-center gap-2">
                            <button
                              type="button"
                              onClick={() => setPickerOpen(true)}
                              className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold px-3.5 py-2 rounded-lg text-xs inline-flex items-center gap-1.5 cursor-pointer"
                            >
                              <Plus className="w-3.5 h-3.5" aria-hidden="true" />
                              <span>{tw.addMoveBtn}</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => void resetWeeklyDay(selectedDay)}
                              className="surface-card px-3.5 py-2 rounded-lg text-xs font-bold cursor-pointer"
                            >
                              {tw.resetDayBtn}
                            </button>
                          </div>
                        </div>
                      ) : (
                        <DndContext
                          sensors={sensors}
                          collisionDetection={closestCenter}
                          onDragStart={handleDragStart}
                          onDragCancel={handleDragCancel}
                          onDragEnd={handleDragEnd}
                        >
                          <SortableContext
                            items={sortableItems.map((i) => i.uid)}
                            strategy={verticalListSortingStrategy}
                          >
                            <div className="space-y-2.5 p-0.5">
                              {sortableItems.map((item, idx) => (
                                <WeeklySortableRow
                                  key={item.uid}
                                  item={item}
                                  index={idx}
                                  totalCount={sortableItems.length}
                                  locale={locale}
                                  reducedMotion={reducedMotion}
                                  onInspect={(ex) => setInspectedExercise(ex)}
                                  onUpdate={handleUpdateExercise}
                                  onRemove={handleRemoveExercise}
                                />
                              ))}
                            </div>
                          </SortableContext>
                        </DndContext>
                      )}
                    </section>
                  </div>
                ) : (
                  /* Lightweight Find-in-Page indexable content for hidden="until-found" panels */
                  <div>
                    <h2>{panelTitle}</h2>
                    <ul>
                      {dayPlan.exercises.map((it, i) => {
                        const ex = getExerciseById(it.exerciseId);
                        return <li key={i}>{ex ? ex.name[locale] : it.exerciseId}</li>;
                      })}
                    </ul>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Add Move Native Modal Dialog */}
      <dialog
        ref={pickerDialogRef}
        {...({ closedby: 'any' } as Record<string, unknown>)}
        aria-labelledby={pickerTitleId}
        onClose={() => setPickerOpen(false)}
        className="surface-card rounded-2xl p-4 sm:p-5 max-w-2xl w-[calc(100%-1.5rem)] m-auto shadow-2xl"
      >
        <div className="space-y-3.5">
          <div className="flex items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <h2 id={pickerTitleId} className="text-base sm:text-lg font-black m-0">
                {tw.pickerTitle} {selectedDef.dayLabel[locale]}
              </h2>
              {addedExerciseToast && (
                <span className="px-2 py-0.5 rounded-md bg-emerald-500/15 text-[var(--brand-accent)] text-xs font-bold inline-flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>
                    {tw.pickerAddedToast}: {addedExerciseToast}
                  </span>
                </span>
              )}
            </div>

            <button
              type="button"
              onClick={() => setPickerOpen(false)}
              aria-label={te.closeDialog}
              className="surface-elevated p-1.5 rounded-lg cursor-pointer"
            >
              <X className="w-4 h-4" aria-hidden="true" />
            </button>
          </div>

          <div className="relative">
            <label htmlFor={pickerSearchId} className="visually-hidden">
              {tw.pickerSearchPlaceholder}
            </label>
            <Search
              className="w-3.5 h-3.5 text-muted-token absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
              aria-hidden="true"
            />
            <input
              id={pickerSearchId}
              data-testid="weekly-picker-search"
              type="search"
              autoFocus
              value={pickerQuery}
              onChange={(e) => setPickerQuery(e.target.value)}
              placeholder={tw.pickerSearchPlaceholder}
              className="surface-elevated w-full pl-8.5 pr-3 py-2 rounded-lg text-xs font-medium"
            />
          </div>

          <div className="flex flex-wrap gap-1">
            <button
              type="button"
              onClick={() => setPickerMuscle('all')}
              aria-pressed={pickerMuscle === 'all'}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold cursor-pointer transition-colors ${
                pickerMuscle === 'all'
                  ? 'bg-emerald-500 text-slate-950'
                  : 'surface-elevated text-muted-token hover:text-[var(--text-primary)]'
              }`}
            >
              {tw.pickerAllMuscles}
            </button>
            {TRACKED_WEEKLY_MUSCLES.map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setPickerMuscle(m)}
                aria-pressed={pickerMuscle === m}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold cursor-pointer transition-colors ${
                  pickerMuscle === m
                    ? 'bg-emerald-500 text-slate-950'
                    : 'surface-elevated text-muted-token hover:text-[var(--text-primary)]'
                }`}
              >
                {getMuscleLabel(m, locale)}
              </button>
            ))}
          </div>

          <div className="space-y-2 max-h-[58vh] overflow-y-auto pr-1">
            {filteredCatalog.map((ex) => {
              const countInDay = exerciseCountsInDay[ex.id] ?? 0;
              return (
                <div
                  key={ex.id}
                  className="surface-elevated rounded-xl p-2.5 flex items-center justify-between gap-3 hover:border-[var(--brand-accent)]/50 transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-24 sm:w-28 aspect-[10/7] rounded-xl overflow-hidden bg-[#070b14] border border-slate-800 shrink-0 p-1">
                      <ExerciseVisual
                        media={ex.media}
                        locale={locale}
                        staticOnly
                        loading="lazy"
                        className="w-full h-full object-contain rounded-lg"
                      />
                    </div>
                    <div className="min-w-0 space-y-0.5">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="text-xs sm:text-sm font-extrabold leading-snug">
                          {ex.name[locale]}
                        </span>
                        {countInDay > 0 && (
                          <span className="px-1.5 py-0.5 rounded bg-emerald-500/15 text-[var(--brand-accent)] text-[10px] font-bold mono-readout">
                            {tw.pickerInDayBadge} ×{countInDay}
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-muted-token">
                        <span className="font-semibold text-[var(--brand-accent)]">
                          {getCategoryLabel(ex.category, locale)}
                        </span>{' '}
                        ·{' '}
                        {ex.muscleGroups
                          .filter((m) => m !== 'full-body')
                          .map((m) => getMuscleLabel(m, locale))
                          .join(', ')}{' '}
                        ·{' '}
                        <span className="mono-readout">
                          {ex.defaultWorkSeconds}s/{ex.defaultRestSeconds}s
                        </span>
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleAddExercise(ex)}
                    data-testid={`weekly-picker-add-${ex.id}`}
                    aria-label={`${tw.addMoveBtn}: ${ex.name[locale]}`}
                    className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold p-2.5 rounded-xl text-xs inline-flex items-center justify-center cursor-pointer transition-colors shrink-0"
                  >
                    <Plus className="w-4 h-4" aria-hidden="true" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </dialog>

      {/* Form Guide Native Modal Dialog */}
      <dialog
        ref={inspectDialogRef}
        {...({ closedby: 'any' } as Record<string, unknown>)}
        aria-labelledby={inspectTitleId}
        onClose={() => setInspectedExercise(null)}
        className="surface-card rounded-2xl p-5 max-w-xl w-[calc(100%-1.5rem)] m-auto shadow-2xl"
      >
        {inspectedExercise && (
          <div className="space-y-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-xs font-bold text-[var(--brand-accent)]">
                  {getCategoryLabel(inspectedExercise.category, locale)} ·{' '}
                  {getDifficultyLabel(inspectedExercise.difficulty, locale)}
                </div>
                <h2 id={inspectTitleId} className="text-xl font-black m-0 mt-0.5">
                  {inspectedExercise.name[locale]}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setInspectedExercise(null)}
                aria-label={te.closeDialog}
                className="surface-elevated p-1.5 rounded-lg cursor-pointer"
              >
                <X className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>

            <div className="rounded-xl overflow-hidden bg-[#070b14] border border-slate-800 p-2">
              <ExerciseVisual
                media={inspectedExercise.media}
                locale={locale}
                className="w-full h-56 object-contain mx-auto rounded-lg"
              />
            </div>

            <div className="space-y-1.5">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-muted-token m-0">
                {te.instructionsTitle}
              </h3>
              <ol className="text-sm space-y-1 pl-5 m-0">
                {inspectedExercise.instructions[locale].map((inst, idx) => (
                  <li key={idx}>{inst}</li>
                ))}
              </ol>
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setInspectedExercise(null)}
                className="surface-elevated px-4 py-2 rounded-lg text-xs font-bold cursor-pointer"
              >
                {te.closeDialog}
              </button>
            </div>
          </div>
        )}
      </dialog>
    </div>
  );
};
