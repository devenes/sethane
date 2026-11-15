import React, { useId, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
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
  ArrowDown,
  ArrowUp,
  CheckCircle2,
  GripVertical,
  Play,
  Plus,
  RotateCcw,
  Save,
  Search,
  Trash2,
} from 'lucide-react';
import { calculateWorkoutSummary } from '../../engine/phase-resolver';
import { EXERCISES_CATALOG, getExerciseById } from '../../data/exercises/catalog';
import { soundService } from '../../services/audio/sound-service';
import { useSettingsStore } from '../../stores/settings-store';
import { useWorkoutStore } from '../../stores/workout-store';
import type { SupportedLocale, WorkoutExerciseItem, WorkoutPlan } from '../../types';
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
  onUpdate: (uid: string, patch: Partial<WorkoutExerciseItem>) => void;
  onMove: (index: number, direction: -1 | 1) => void;
  onRemove: (uid: string) => void;
}

const SortableBuilderRow: React.FC<SortableBuilderRowProps> = ({
  item,
  index,
  totalCount,
  locale,
  onUpdate,
  onMove,
  onRemove,
}) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: item.uid,
  });
  const workInputId = useId();
  const restInputId = useId();
  const t = UI_STRINGS[locale].builder;
  const exercise = getExerciseById(item.exerciseId);
  const isLast = index === totalCount - 1;

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      data-testid={`builder-item-${index}`}
      className="surface-elevated rounded-xl p-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5"
    >
      <div className="flex items-center gap-2.5 min-w-0">
        <button
          type="button"
          {...attributes}
          {...listeners}
          aria-label="Drag to reorder"
          className="p-1.5 rounded-lg text-muted-token hover:text-[var(--brand-accent)] cursor-grab active:cursor-grabbing shrink-0"
        >
          <GripVertical className="w-4 h-4" aria-hidden="true" />
        </button>

        {exercise && (
          <img
            src={resolveAssetUrl(exercise.media.posterSrc ?? exercise.media.src)}
            alt={exercise.media.alt[locale]}
            width={480}
            height={336}
            loading="lazy"
            className="w-14 h-10 rounded-md object-contain bg-[#070b14] border border-slate-800 shrink-0"
          />
        )}

        <div className="min-w-0">
          <div className="font-bold text-xs sm:text-sm truncate">
            <span className="mono-readout text-muted-token mr-1">{index + 1}.</span>
            {exercise ? exercise.name[locale] : item.exerciseId}
          </div>
          {isLast && (
            <div className="text-[10px] text-muted-token">{t.lastExerciseNoRestNote}</div>
          )}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 shrink-0">
        <div className="flex items-center gap-1">
          <label htmlFor={workInputId} className="text-[11px] font-semibold text-muted-token">
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
            className="surface-card w-14 px-1.5 py-1 rounded-md text-xs font-bold mono-readout text-center"
          />
        </div>

        <div className="flex items-center gap-1">
          <label htmlFor={restInputId} className="text-[11px] font-semibold text-muted-token">
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
            className="surface-card w-14 px-1.5 py-1 rounded-md text-xs font-bold mono-readout text-center disabled:opacity-45"
          />
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => onMove(index, -1)}
            disabled={index === 0}
            aria-label={t.moveUp}
            className="surface-card p-1.5 rounded-md disabled:opacity-35 cursor-pointer"
          >
            <ArrowUp className="w-3.5 h-3.5" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={() => onMove(index, 1)}
            disabled={isLast}
            aria-label={t.moveDown}
            className="surface-card p-1.5 rounded-md disabled:opacity-35 cursor-pointer"
          >
            <ArrowDown className="w-3.5 h-3.5" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={() => onRemove(item.uid)}
            aria-label={t.removeExercise}
            className="surface-card p-1.5 rounded-md text-rose-500 hover:border-rose-500/50 cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
          </button>
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
    editingWorkout && !editingWorkout.isPreset ? editingWorkout.id : `custom-${Date.now()}`
  );
  const [name, setName] = useState<string>(
    editingWorkout
      ? editingWorkout.name
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

  const sensors = useSensors(
    useSensor(PointerSensor),
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

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setItems((prev) => {
        const oldIdx = prev.findIndex((i) => i.uid === active.id);
        const newIdx = prev.findIndex((i) => i.uid === over.id);
        if (oldIdx < 0 || newIdx < 0) return prev;
        return arrayMove(prev, oldIdx, newIdx);
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

  const handleMoveItem = (index: number, direction: -1 | 1) => {
    setItems((prev) => {
      const targetIndex = index + direction;
      if (targetIndex < 0 || targetIndex >= prev.length) return prev;
      return arrayMove(prev, index, targetIndex);
    });
  };

  const handleRemoveItem = (uid: string) => {
    setItems((prev) => prev.filter((it) => it.uid !== uid));
  };

  const handleLoadPreset = (presetId: string) => {
    const found = presets.find((p) => p.id === presetId);
    if (!found) return;
    setWorkoutId(`custom-${Date.now()}`);
    setName(`${found.name} (Copy)`);
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
      {/* Compact Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <h1 className="text-xl sm:text-2xl font-black m-0">{t.title}</h1>
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
                {p.name}
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
      <div className="surface-card rounded-xl p-3.5 space-y-3">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 items-end">
          <div className="lg:col-span-4">
            <label htmlFor={nameInputId} className="block text-[11px] font-bold text-muted-token mb-1">
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
              <label htmlFor={roundsInputId} className="block text-[11px] font-semibold text-muted-token mb-1 truncate">
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
              <label htmlFor={restBetweenRoundsInputId} className="block text-[11px] font-semibold text-muted-token mb-1 truncate">
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
              <label htmlFor={warmupInputId} className="block text-[11px] font-semibold text-muted-token mb-1 truncate">
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
              <label htmlFor={cooldownInputId} className="block text-[11px] font-semibold text-muted-token mb-1 truncate">
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
              <label htmlFor={prepareInputId} className="block text-[11px] font-semibold text-muted-token mb-1 truncate">
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

          <div className="lg:col-span-3 flex items-center justify-between gap-2 surface-elevated rounded-lg px-3 py-1.5 text-xs mono-readout">
            <div>
              <span className="text-muted-token">{t.summaryCoreHiit}: </span>
              <strong data-testid="builder-summary-core" className="text-[var(--brand-accent)]">
                {formatHumanDuration(summary.coreHiitSeconds, locale)}
              </strong>
            </div>
            <div>
              <span className="text-muted-token">{t.summaryTotalTime}: </span>
              <strong data-testid="builder-summary-total">
                {formatHumanDuration(summary.totalSeconds, locale)}
              </strong>
            </div>
          </div>
        </div>
      </div>

      {/* Sequence & Visual Catalog Split View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        <section className="lg:col-span-7 surface-card rounded-xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-extrabold uppercase tracking-wider text-muted-token m-0">
              {t.selectedExercisesHeading} ({items.length})
            </h2>
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
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={items.map((i) => i.uid)}
                strategy={verticalListSortingStrategy}
              >
                <div className="space-y-2">
                  {items.map((item, idx) => (
                    <SortableBuilderRow
                      key={item.uid}
                      item={item}
                      index={idx}
                      totalCount={items.length}
                      locale={locale}
                      onUpdate={handleUpdateItem}
                      onMove={handleMoveItem}
                      onRemove={handleRemoveItem}
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          )}
        </section>

        {/* Visual Catalog Picker with Instant Search */}
        <section className="lg:col-span-5 surface-card rounded-xl p-4 space-y-3">
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-sm font-extrabold uppercase tracking-wider text-muted-token m-0">
              {t.addExercisesHeading}
            </h2>
          </div>

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

          <div className="space-y-1.5 max-h-[520px] overflow-y-auto pr-1">
            {filteredCatalog.map((ex) => (
              <div
                key={ex.id}
                className="surface-elevated rounded-lg p-2 flex items-center justify-between gap-2"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <img
                    src={resolveAssetUrl(ex.media.posterSrc ?? ex.media.src)}
                    alt={ex.media.alt[locale]}
                    width={480}
                    height={336}
                    loading="lazy"
                    className="w-14 h-10 rounded-md object-contain bg-[#070b14] border border-slate-800 shrink-0"
                  />
                  <div className="min-w-0">
                    <div className="text-xs font-bold truncate">{ex.name[locale]}</div>
                    <div className="text-[10px] mono-readout text-muted-token">
                      {getCategoryLabel(ex.category, locale)} · {ex.defaultWorkSeconds}s/
                      {ex.defaultRestSeconds}s
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleAddExercise(ex.id)}
                  data-testid={`add-exercise-${ex.id}`}
                  aria-label={`Add ${ex.name[locale]}`}
                  className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold p-2 rounded-lg text-xs inline-flex items-center justify-center cursor-pointer transition-colors shrink-0"
                >
                  <Plus className="w-3.5 h-3.5" aria-hidden="true" />
                </button>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};
