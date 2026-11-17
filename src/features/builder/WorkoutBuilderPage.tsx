import React, { useEffect, useId, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
import { CSS } from '@dnd-kit/utilities';
import {
  CheckCircle2,
  GripVertical,
  Play,
  Plus,
  RotateCcw,
  Save,
  Search,
  Trash2,
} from 'lucide-react';
import { ExerciseDetailModal } from '../../components/common/ExerciseDetailModal';
import { calculateWorkoutSummary } from '../../engine/phase-resolver';
import { EXERCISES_CATALOG, getExerciseById } from '../../data/exercises/catalog';
import { soundService } from '../../services/audio/sound-service';
import { useSettingsStore } from '../../stores/settings-store';
import { useWorkoutStore } from '../../stores/workout-store';
import type { Exercise, SupportedLocale, WorkoutExerciseItem, WorkoutPlan } from '../../types';
import { resolveAssetUrl } from '../../utils/assets';
import { formatHumanDuration } from '../../utils/format';
import { getCategoryLabel, UI_STRINGS } from '../../utils/i18n';

interface BuilderItem extends WorkoutExerciseItem {
  uid: string;
}

interface SortableBuilderRowProps {
  item: BuilderItem;
  index: number;
  totalCount: number;
  locale: SupportedLocale;
  reducedMotion: boolean;
  onInspect: (exercise: Exercise) => void;
  onUpdate: (uid: string, patch: Partial<WorkoutExerciseItem>) => void;
  onRemove: (uid: string) => void;
}

const SortableBuilderRow: React.FC<SortableBuilderRowProps> = ({
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
  } = useSortable({
    id: item.uid,
  });
  const workInputId = useId();
  const restInputId = useId();
  const t = UI_STRINGS[locale].builder;
  const exercise = getExerciseById(item.exerciseId);
  const exerciseTitle = exercise ? exercise.name[locale] : item.exerciseId;
  const isLast = index === totalCount - 1;

  // Lock movement strictly along the vertical axis without rotation (drag-and-drop guide)
  const constrainedTransform = transform
    ? {
        ...transform,
        x: 0,
        scaleX: isDragging && !reducedMotion ? 1.015 : 1,
        scaleY: isDragging && !reducedMotion ? 1.015 : 1,
      }
    : null;

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(constrainedTransform),
    transition: reducedMotion ? undefined : transition,
    position: 'relative',
    zIndex: isDragging ? 20 : undefined,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      data-testid={`builder-item-${index}`}
      data-dragging={isDragging ? 'true' : 'false'}
      className={`sortable-item surface-elevated rounded-xl overflow-hidden flex items-stretch transition-shadow ${
        isDragging
          ? 'shadow-2xl border-[var(--brand-accent)] ring-2 ring-[var(--brand-accent)]/40'
          : 'hover:border-[var(--brand-accent)]/50'
      }`}
    >
      {/* Draggable Grip */}
      <div
        ref={setActivatorNodeRef}
        {...attributes}
        {...listeners}
        data-testid={`builder-drag-handle-${index}`}
        aria-label={`${index + 1}. ${exerciseTitle} — ${t.dragHandleAction}`}
        className="builder-drag-zone shrink-0 flex items-stretch cursor-grab active:cursor-grabbing"
      >
        <div className="builder-drag-handle w-11 sm:w-12 shrink-0 border-r border-[var(--border-subtle)] bg-black/15 hover:bg-emerald-500/10 text-muted-token hover:text-[var(--brand-accent)] flex flex-col items-center justify-center gap-1 transition-colors">
          <span className="text-xs font-black mono-readout text-[var(--text-primary)]">
            {index + 1}
          </span>
          <GripVertical className="w-4 h-4" aria-hidden="true" />
        </div>
      </div>

      {/* Clickable Live GIF Viewport -> Opens Exercise Detail Modal */}
      {exercise && (
        <div className="p-2 sm:p-2.5 flex items-center shrink-0">
          <button
            type="button"
            onClick={() => onInspect(exercise)}
            data-testid={`builder-inspect-item-${index}`}
            aria-label={`${exerciseTitle} — ${UI_STRINGS[locale].exercises.viewDetails}`}
            className="w-28 sm:w-44 aspect-[10/7] rounded-xl overflow-hidden bg-[#070b14] border border-slate-800 hover:border-[var(--brand-accent)] p-1 cursor-pointer transition-colors"
          >
            <img
              src={resolveAssetUrl(exercise.media.src)}
              alt={exercise.media.alt[locale]}
              width={480}
              height={336}
              draggable={false}
              className="w-full h-full object-contain rounded-lg pointer-events-none"
            />
          </button>
        </div>
      )}

      {/* Right Column: Full-Width Title on Top + Work/Rest Inputs Below */}
      <div className="flex-1 min-w-0 py-2.5 pr-3 pl-1 flex flex-col justify-between gap-2.5">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 space-y-0.5">
            {exercise ? (
              <button
                type="button"
                onClick={() => onInspect(exercise)}
                className="font-extrabold text-sm sm:text-base leading-snug text-left hover:text-[var(--brand-accent)] transition-colors cursor-pointer bg-transparent border-0 p-0 text-inherit"
              >
                {exerciseTitle}
              </button>
            ) : (
              <div className="font-extrabold text-sm sm:text-base leading-snug">
                {exerciseTitle}
              </div>
            )}
            {exercise && (
              <div className="text-xs text-muted-token font-semibold">
                {getCategoryLabel(exercise.category, locale)}
              </div>
            )}
            <div
              aria-hidden="true"
              className="drag-key-hint text-[11px] font-semibold text-[var(--brand-accent)]"
            >
              {isDragging ? t.keyHintGrabbed : t.keyHintIdle}
            </div>
          </div>

          <button
            type="button"
            onClick={() => onRemove(item.uid)}
            aria-label={t.removeExercise}
            className="surface-card p-1.5 rounded-lg text-rose-500 hover:border-rose-500/60 cursor-pointer transition-colors shrink-0"
          >
            <Trash2 className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>

        <div className="space-y-1.5">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1.5">
              <label htmlFor={workInputId} className="text-xs font-semibold text-muted-token whitespace-nowrap">
                {t.workSec}
              </label>
              <input
                id={workInputId}
                type="number"
                min={5}
                max={600}
                value={item.workSeconds}
                onChange={(e) =>
                  onUpdate(item.uid, { workSeconds: Math.max(5, Number(e.target.value) || 5) })
                }
                className="surface-card w-16 px-2 py-1 rounded-lg text-xs font-bold mono-readout text-center"
              />
            </div>

            <div className="flex items-center gap-1.5">
              <label htmlFor={restInputId} className="text-xs font-semibold text-muted-token whitespace-nowrap">
                {t.restSec}
              </label>
              <input
                id={restInputId}
                type="number"
                min={0}
                max={600}
                value={isLast ? 0 : item.restSeconds}
                disabled={isLast}
                onChange={(e) =>
                  onUpdate(item.uid, { restSeconds: Math.max(0, Number(e.target.value) || 0) })
                }
                className="surface-card w-16 px-2 py-1 rounded-lg text-xs font-bold mono-readout text-center disabled:opacity-45"
              />
            </div>
          </div>

          {isLast && (
            <div className="text-[11px] text-amber-500 font-semibold">
              {t.lastExerciseNoRestNote}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

function toBuilderItems(items: WorkoutExerciseItem[]): BuilderItem[] {
  return items.map((item, idx) => ({
    ...item,
    uid: item.id ?? `row-${Date.now()}-${idx}-${Math.random().toString(36).slice(2, 6)}`,
  }));
}

export const WorkoutBuilderPage: React.FC = () => {
  const navigate = useNavigate();
  const locale = useSettingsStore((s) => s.locale);
  const presets = useWorkoutStore((s) => s.presets);
  const editingWorkout = useWorkoutStore((s) => s.editingWorkout);
  const saveCustomWorkout = useWorkoutStore((s) => s.saveCustomWorkout);
  const selectWorkoutForPlayer = useWorkoutStore((s) => s.selectWorkoutForPlayer);

  const t = UI_STRINGS[locale].builder;
  const isEditingExisting = Boolean(editingWorkout && !editingWorkout.isPreset);

  const nameInputId = useId();
  const roundsInputId = useId();
  const restBetweenRoundsInputId = useId();
  const warmupInputId = useId();
  const cooldownInputId = useId();
  const prepareInputId = useId();
  const presetSelectId = useId();
  const catalogFilterId = useId();

  const initialSource = editingWorkout ?? presets[0]!;

  const [workoutId, setWorkoutId] = useState<string>(
    isEditingExisting ? editingWorkout!.id : `custom-${Date.now()}`
  );
  const [name, setName] = useState<string>(
    editingWorkout
      ? editingWorkout.localizedName?.[locale] ?? editingWorkout.name
      : locale === 'tr'
        ? 'Özel HIIT Programım'
        : 'Custom HIIT'
  );
  const [rounds, setRounds] = useState<number>(initialSource.rounds);
  const [restBetweenRounds, setRestBetweenRounds] = useState<number>(
    initialSource.restBetweenRounds
  );
  const [warmupSeconds, setWarmupSeconds] = useState<number>(initialSource.warmupSeconds);
  const [cooldownSeconds, setCooldownSeconds] = useState<number>(initialSource.cooldownSeconds);
  const [prepareSeconds, setPrepareSeconds] = useState<number>(initialSource.prepareSeconds ?? 5);
  const [items, setItems] = useState<BuilderItem[]>(() => toBuilderItems(initialSource.exercises));
  const [catalogQuery, setCatalogQuery] = useState('');
  const [savedBanner, setSavedBanner] = useState(false);
  const [reorderStatus, setReorderStatus] = useState('');
  const [inspectedExercise, setInspectedExercise] = useState<Exercise | null>(null);

  const reducedMotion =
    typeof window !== 'undefined' &&
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  useEffect(() => {
    return () => {
      document.documentElement.classList.remove('is-reordering');
    };
  }, []);

  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: { distance: 4 },
    }),
    useSensor(TouchSensor, {
      activationConstraint: { delay: 120, tolerance: 6 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const draftWorkout: WorkoutPlan = useMemo(
    () => ({
      id: workoutId,
      name: name.trim() || 'Custom Workout',
      prepareSeconds,
      warmupSeconds,
      rounds,
      restBetweenRounds,
      cooldownSeconds,
      exercises: items.map((item, idx) => ({
        id: item.uid,
        exerciseId: item.exerciseId,
        workSeconds: item.workSeconds,
        restSeconds: idx === items.length - 1 ? 0 : item.restSeconds,
      })),
    }),
    [
      cooldownSeconds,
      items,
      name,
      prepareSeconds,
      restBetweenRounds,
      rounds,
      warmupSeconds,
      workoutId,
    ]
  );

  const summary = useMemo(() => calculateWorkoutSummary(draftWorkout), [draftWorkout]);

  const filteredCatalog = useMemo(() => {
    const q = catalogQuery.trim().toLowerCase();
    if (!q) return EXERCISES_CATALOG;
    return EXERCISES_CATALOG.filter(
      (ex) => ex.name.en.toLowerCase().includes(q) || ex.name.tr.toLowerCase().includes(q)
    );
  }, [catalogQuery]);

  const handleDragStart = (_event: DragStartEvent) => {
    document.documentElement.classList.add('is-reordering');
  };

  const handleDragCancel = () => {
    document.documentElement.classList.remove('is-reordering');
  };

  const handleDragEnd = (event: DragEndEvent) => {
    document.documentElement.classList.remove('is-reordering');
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setItems((prev) => {
        const oldIdx = prev.findIndex((i) => i.uid === active.id);
        const newIdx = prev.findIndex((i) => i.uid === over.id);
        if (oldIdx < 0 || newIdx < 0) return prev;
        const next = arrayMove(prev, oldIdx, newIdx);
        const movedEx = getExerciseById(prev[oldIdx]!.exerciseId);
        const movedName = movedEx ? movedEx.name[locale] : prev[oldIdx]!.exerciseId;
        setReorderStatus(`${movedName} — ${t.reorderedAnnouncement} ${newIdx + 1}/${next.length}`);
        return next;
      });
    }
  };

  const handleAddExercise = (exerciseId: string) => {
    const ex = getExerciseById(exerciseId);
    setItems((prev) => [
      ...prev.map((item) => ({
        ...item,
        restSeconds: item.restSeconds === 0 ? 15 : item.restSeconds,
      })),
      {
        uid: `row-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        exerciseId,
        workSeconds: ex?.defaultWorkSeconds ?? 35,
        restSeconds: ex?.defaultRestSeconds ?? 15,
      },
    ]);
  };

  const handleUpdateItem = (uid: string, patch: Partial<WorkoutExerciseItem>) => {
    setItems((prev) => prev.map((it) => (it.uid === uid ? { ...it, ...patch } : it)));
  };

  const handleRemoveItem = (uid: string) => {
    setItems((prev) => prev.filter((it) => it.uid !== uid));
  };

  const handleLoadPreset = (presetId: string) => {
    const found = presets.find((p) => p.id === presetId);
    if (!found) return;
    const baseTitle = found.localizedName?.[locale] ?? found.name;
    setWorkoutId(`custom-${Date.now()}`);
    setName(`${baseTitle} (Copy)`);
    setRounds(found.rounds);
    setRestBetweenRounds(found.restBetweenRounds);
    setWarmupSeconds(found.warmupSeconds);
    setCooldownSeconds(found.cooldownSeconds);
    setPrepareSeconds(found.prepareSeconds ?? 5);
    setItems(toBuilderItems(found.exercises));
  };

  const handleSave = async (startImmediately: boolean) => {
    if (items.length === 0) return;
    const saved = await saveCustomWorkout(draftWorkout);
    setSavedBanner(true);
    setTimeout(() => setSavedBanner(false), 2500);
    if (startImmediately) {
      soundService.unlock();
      selectWorkoutForPlayer(saved);
      navigate('/player');
    }
  };

  return (
    <div className="space-y-4">
      {/* Single polite live status region for reorder announcements (dynamic-sort guide) */}
      <p role="status" className="visually-hidden">
        {reorderStatus}
      </p>

      {/* Compact Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <h1 className="text-xl sm:text-2xl font-black m-0">
            {isEditingExisting ? t.editTitle : t.title}
          </h1>
          {savedBanner && (
            <span
              role="status"
              data-testid="builder-saved-toast"
              className="px-2.5 py-1 rounded-lg bg-emerald-500/15 border border-emerald-500/40 text-[var(--brand-accent)] text-xs font-bold inline-flex items-center gap-1"
            >
              <CheckCircle2 className="w-3.5 h-3.5" aria-hidden="true" />
              <span>{t.savedSuccess}</span>
            </span>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <label htmlFor={presetSelectId} className="visually-hidden">
            {t.loadPresetLabel}
          </label>
          <select
            id={presetSelectId}
            defaultValue=""
            onChange={(e) => {
              if (e.target.value) handleLoadPreset(e.target.value);
            }}
            className="surface-card px-2.5 py-1.5 rounded-lg text-xs font-bold"
          >
            <option value="" disabled>
              {t.loadPresetLabel}...
            </option>
            {presets.map((p) => (
              <option key={p.id} value={p.id}>
                {p.localizedName?.[locale] ?? p.name}
              </option>
            ))}
          </select>

          <button
            type="button"
            disabled={items.length === 0}
            onClick={() => void handleSave(false)}
            data-testid="builder-save-btn"
            className="surface-card hover:border-[var(--brand-accent)] disabled:opacity-40 font-bold px-3 py-1.5 rounded-lg text-xs inline-flex items-center gap-1.5 cursor-pointer"
          >
            <Save className="w-3.5 h-3.5 text-[var(--brand-accent)]" aria-hidden="true" />
            <span>{t.saveWorkout}</span>
          </button>

          <button
            type="button"
            disabled={items.length === 0}
            onClick={() => void handleSave(true)}
            data-testid="builder-save-start-btn"
            className="bg-emerald-500 hover:bg-emerald-400 disabled:opacity-40 text-slate-950 font-extrabold px-3.5 py-1.5 rounded-lg text-xs inline-flex items-center gap-1.5 cursor-pointer"
          >
            <Play className="w-3.5 h-3.5 fill-current" aria-hidden="true" />
            <span>{t.saveAndStart}</span>
          </button>
        </div>
      </div>

      {/* Compact Timing & Summary Strip */}
      <div className="surface-card rounded-xl p-3.5">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 items-end">
          <div className="lg:col-span-4">
            <label
              htmlFor={nameInputId}
              className="block text-[11px] font-bold text-muted-token mb-1"
            >
              {t.workoutNameLabel}
            </label>
            <input
              id={nameInputId}
              data-testid="builder-workout-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t.workoutNamePlaceholder}
              className="surface-elevated w-full px-3 py-1.5 rounded-lg font-bold text-sm"
              required
            />
          </div>

          <div className="lg:col-span-5 grid grid-cols-5 gap-2">
            <div>
              <label
                htmlFor={roundsInputId}
                className="block text-[11px] font-semibold text-muted-token mb-1 truncate"
              >
                {t.roundsLabel}
              </label>
              <input
                id={roundsInputId}
                data-testid="builder-rounds-input"
                type="number"
                min={1}
                max={30}
                value={rounds}
                onChange={(e) => setRounds(Math.max(1, Number(e.target.value) || 1))}
                className="surface-elevated w-full px-2 py-1.5 rounded-lg font-bold mono-readout text-xs text-center"
              />
            </div>

            <div>
              <label
                htmlFor={restBetweenRoundsInputId}
                className="block text-[11px] font-semibold text-muted-token mb-1 truncate"
              >
                {t.restBetweenRoundsLabel}
              </label>
              <input
                id={restBetweenRoundsInputId}
                type="number"
                min={0}
                max={600}
                value={restBetweenRounds}
                onChange={(e) => setRestBetweenRounds(Math.max(0, Number(e.target.value) || 0))}
                className="surface-elevated w-full px-2 py-1.5 rounded-lg font-bold mono-readout text-xs text-center"
              />
            </div>

            <div>
              <label
                htmlFor={warmupInputId}
                className="block text-[11px] font-semibold text-muted-token mb-1 truncate"
              >
                {t.warmupLabel}
              </label>
              <input
                id={warmupInputId}
                type="number"
                min={0}
                max={1800}
                value={warmupSeconds}
                onChange={(e) => setWarmupSeconds(Math.max(0, Number(e.target.value) || 0))}
                className="surface-elevated w-full px-2 py-1.5 rounded-lg font-bold mono-readout text-xs text-center"
              />
            </div>

            <div>
              <label
                htmlFor={cooldownInputId}
                className="block text-[11px] font-semibold text-muted-token mb-1 truncate"
              >
                {t.cooldownLabel}
              </label>
              <input
                id={cooldownInputId}
                type="number"
                min={0}
                max={1800}
                value={cooldownSeconds}
                onChange={(e) => setCooldownSeconds(Math.max(0, Number(e.target.value) || 0))}
                className="surface-elevated w-full px-2 py-1.5 rounded-lg font-bold mono-readout text-xs text-center"
              />
            </div>

            <div>
              <label
                htmlFor={prepareInputId}
                className="block text-[11px] font-semibold text-muted-token mb-1 truncate"
              >
                {t.prepareLabel}
              </label>
              <input
                id={prepareInputId}
                type="number"
                min={0}
                max={60}
                value={prepareSeconds}
                onChange={(e) => setPrepareSeconds(Math.max(0, Number(e.target.value) || 0))}
                className="surface-elevated w-full px-2 py-1.5 rounded-lg font-bold mono-readout text-xs text-center"
              />
            </div>
          </div>

          <div className="lg:col-span-3 flex flex-wrap items-center justify-between gap-2 surface-elevated rounded-lg px-3 py-1.5 text-xs mono-readout">
            <div className="whitespace-nowrap">
              <span className="text-muted-token">{t.summaryCoreHiit}: </span>
              <strong data-testid="builder-summary-core" className="text-[var(--brand-accent)]">
                {formatHumanDuration(summary.coreHiitSeconds, locale)}
              </strong>
            </div>
            <div className="whitespace-nowrap">
              <span className="text-muted-token">{t.summaryTotalTime}: </span>
              <strong data-testid="builder-summary-total">
                {formatHumanDuration(summary.totalSeconds, locale)}
              </strong>
            </div>
          </div>
        </div>
      </div>

      {/* Sequence & Visual Animated Catalog Split View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        {/* Left: Drag-and-Drop Sequence with Large Live GIFs */}
        <section className="lg:col-span-7 surface-card rounded-xl p-4 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-baseline gap-2.5">
              <h2 className="text-sm font-extrabold uppercase tracking-wider text-muted-token m-0">
                {t.selectedExercisesHeading} ({items.length})
              </h2>
              {items.length > 1 && (
                <span className="text-xs text-muted-token">· {t.dragHint}</span>
              )}
            </div>
            <button
              type="button"
              onClick={() => setItems([])}
              className="text-xs font-semibold text-muted-token hover:text-rose-500 inline-flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" aria-hidden="true" />
              <span>{t.resetForm}</span>
            </button>
          </div>

          {items.length === 0 ? (
            <p className="text-xs text-muted-token font-semibold py-8 text-center m-0">
              {t.emptySequenceWarning}
            </p>
          ) : (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragStart={handleDragStart}
              onDragCancel={handleDragCancel}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={items.map((i) => i.uid)}
                strategy={verticalListSortingStrategy}
              >
                <div className="space-y-2.5 p-0.5">
                  {items.map((item, idx) => (
                    <SortableBuilderRow
                      key={item.uid}
                      item={item}
                      index={idx}
                      totalCount={items.length}
                      locale={locale}
                      reducedMotion={reducedMotion}
                      onInspect={(ex) => setInspectedExercise(ex)}
                      onUpdate={handleUpdateItem}
                      onRemove={handleRemoveItem}
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          )}
        </section>

        {/* Right: Visual Catalog Picker with Large Live GIFs */}
        <section className="lg:col-span-5 surface-card rounded-xl p-4 space-y-3">
          <h2 className="text-sm font-extrabold uppercase tracking-wider text-muted-token m-0">
            {t.addExercisesHeading}
          </h2>

          <div className="relative">
            <label htmlFor={catalogFilterId} className="visually-hidden">
              {t.searchCatalogPlaceholder}
            </label>
            <Search
              className="w-3.5 h-3.5 text-muted-token absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
              aria-hidden="true"
            />
            <input
              id={catalogFilterId}
              type="search"
              value={catalogQuery}
              onChange={(e) => setCatalogQuery(e.target.value)}
              placeholder={t.searchCatalogPlaceholder}
              className="surface-elevated w-full pl-8.5 pr-3 py-1.5 rounded-lg text-xs"
            />
          </div>

          <div className="space-y-2.5 max-h-[720px] overflow-y-auto pr-1">
            {filteredCatalog.map((ex) => (
              <div
                key={ex.id}
                className="surface-elevated rounded-xl p-2.5 flex items-center justify-between gap-3 hover:border-[var(--brand-accent)]/50 transition-colors"
              >
                <button
                  type="button"
                  onClick={() => setInspectedExercise(ex)}
                  data-testid={`builder-catalog-inspect-${ex.id}`}
                  aria-label={`${ex.name[locale]} — ${UI_STRINGS[locale].exercises.viewDetails}`}
                  className="flex items-center gap-3 min-w-0 flex-1 text-left cursor-pointer bg-transparent border-0 p-0 text-inherit group"
                >
                  <div className="w-28 sm:w-32 aspect-[10/7] rounded-xl overflow-hidden bg-[#070b14] border border-slate-800 group-hover:border-[var(--brand-accent)] shrink-0 p-1 transition-colors">
                    <img
                      src={resolveAssetUrl(ex.media.src)}
                      alt={ex.media.alt[locale]}
                      width={480}
                      height={336}
                      loading="lazy"
                      draggable={false}
                      className="w-full h-full object-contain rounded-lg"
                    />
                  </div>
                  <div className="min-w-0 space-y-0.5">
                    <div className="text-xs sm:text-sm font-extrabold leading-snug group-hover:text-[var(--brand-accent)] transition-colors">
                      {ex.name[locale]}
                    </div>
                    <div className="text-[11px] mono-readout text-muted-token">
                      {getCategoryLabel(ex.category, locale)} · {ex.defaultWorkSeconds}s/
                      {ex.defaultRestSeconds}s
                    </div>
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => handleAddExercise(ex.id)}
                  data-testid={`add-exercise-${ex.id}`}
                  aria-label={`Add ${ex.name[locale]}`}
                  className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold p-2.5 rounded-xl text-xs inline-flex items-center justify-center cursor-pointer transition-colors shrink-0"
                >
                  <Plus className="w-4 h-4" aria-hidden="true" />
                </button>
              </div>
            ))}
          </div>
        </section>
      </div>

      <ExerciseDetailModal
        exercise={inspectedExercise}
        locale={locale}
        onClose={() => setInspectedExercise(null)}
        onTrainSingle={(ex) => {
          soundService.unlock();
          setInspectedExercise(null);
          selectWorkoutForPlayer({
            id: `single-${ex.id}-${Date.now()}`,
            name: `${ex.name[locale]} (3×)`,
            prepareSeconds: 5,
            warmupSeconds: 0,
            rounds: 3,
            restBetweenRounds: ex.defaultRestSeconds,
            cooldownSeconds: 0,
            exercises: [
              {
                exerciseId: ex.id,
                workSeconds: ex.defaultWorkSeconds,
                restSeconds: 0,
              },
            ],
          });
          navigate('/player');
        }}
      />
    </div>
  );
};
