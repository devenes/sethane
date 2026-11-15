import { create } from 'zustand';
import { PRESET_WORKOUTS } from '../data/workouts/presets';
import {
  cloneWorkoutPlan,
  createDefaultWeeklySchedule,
  WEEKLY_DEFINITIONS_BY_DAY,
} from '../data/workouts/weekly-program';
import { db } from '../services/storage/db';
import type { DayOfWeekKey, WorkoutHistoryEntry, WorkoutPlan } from '../types';

interface WorkoutStoreState {
  presets: WorkoutPlan[];
  customWorkouts: WorkoutPlan[];
  weeklySchedule: Record<DayOfWeekKey, WorkoutPlan>;
  customizedWeeklyDays: Partial<Record<DayOfWeekKey, boolean>>;
  history: WorkoutHistoryEntry[];
  activeWorkout: WorkoutPlan;
  editingWorkout: WorkoutPlan | null;
  hydrated: boolean;
  hydrate: () => Promise<void>;
  selectWorkoutForPlayer: (workout: WorkoutPlan) => void;
  setEditingWorkout: (workout: WorkoutPlan | null) => void;
  saveCustomWorkout: (workout: WorkoutPlan) => Promise<WorkoutPlan>;
  deleteCustomWorkout: (id: string) => Promise<void>;
  duplicateWorkout: (workout: WorkoutPlan) => Promise<WorkoutPlan>;
  updateWeeklyDayWorkout: (dayKey: DayOfWeekKey, workout: WorkoutPlan) => Promise<void>;
  resetWeeklyDay: (dayKey: DayOfWeekKey) => Promise<void>;
  resetAllWeeklyDays: () => Promise<void>;
  recordCompletedSession: (entry: Omit<WorkoutHistoryEntry, 'id' | 'completedAt'>) => Promise<void>;
  clearHistory: () => Promise<void>;
}

export const useWorkoutStore = create<WorkoutStoreState>((set, get) => ({
  presets: PRESET_WORKOUTS,
  customWorkouts: [],
  weeklySchedule: createDefaultWeeklySchedule(),
  customizedWeeklyDays: {},
  history: [],
  activeWorkout: PRESET_WORKOUTS[0]!,
  editingWorkout: null,
  hydrated: false,

  hydrate: async () => {
    try {
      const [customWorkouts, history, weeklyRows] = await Promise.all([
        db.customWorkouts.orderBy('updatedAt').reverse().toArray(),
        db.history.orderBy('completedAt').reverse().toArray(),
        db.weeklySchedule.toArray(),
      ]);
      const weeklySchedule = createDefaultWeeklySchedule();
      const customizedWeeklyDays: Partial<Record<DayOfWeekKey, boolean>> = {};
      for (const row of weeklyRows) {
        weeklySchedule[row.dayKey] = cloneWorkoutPlan(row.workout);
        customizedWeeklyDays[row.dayKey] = true;
      }
      set({
        customWorkouts,
        weeklySchedule,
        customizedWeeklyDays,
        history,
        hydrated: true,
      });
    } catch {
      set({ hydrated: true });
    }
  },

  selectWorkoutForPlayer: (workout) => {
    set({ activeWorkout: workout });
  },

  setEditingWorkout: (workout) => {
    set({ editingWorkout: workout });
  },

  saveCustomWorkout: async (workout) => {
    const nowIso = new Date().toISOString();
    const record: WorkoutPlan = {
      ...workout,
      localizedName: undefined,
      isPreset: false,
      createdAt: workout.createdAt ?? nowIso,
      updatedAt: nowIso,
    };
    await db.customWorkouts.put(record);
    const customWorkouts = await db.customWorkouts.orderBy('updatedAt').reverse().toArray();
    set({ customWorkouts, activeWorkout: record });
    return record;
  },

  deleteCustomWorkout: async (id) => {
    await db.customWorkouts.delete(id);
    const customWorkouts = await db.customWorkouts.orderBy('updatedAt').reverse().toArray();
    const currentActive = get().activeWorkout;
    set({
      customWorkouts,
      activeWorkout: currentActive.id === id ? PRESET_WORKOUTS[0]! : currentActive,
    });
  },

  duplicateWorkout: async (workout) => {
    const nowIso = new Date().toISOString();
    const copy: WorkoutPlan = {
      ...workout,
      id: `custom-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      name: `${workout.name} (Copy)`,
      localizedName: undefined,
      isPreset: false,
      createdAt: nowIso,
      updatedAt: nowIso,
      exercises: workout.exercises.map((ex, i) => ({
        ...ex,
        id: `item-${Date.now()}-${i}`,
      })),
    };
    await db.customWorkouts.put(copy);
    const customWorkouts = await db.customWorkouts.orderBy('updatedAt').reverse().toArray();
    set({ customWorkouts });
    return copy;
  },

  updateWeeklyDayWorkout: async (dayKey, workout) => {
    const nowIso = new Date().toISOString();
    const normalized: WorkoutPlan = {
      ...cloneWorkoutPlan(workout),
      id: `weekly-${dayKey}`,
      isPreset: false,
      updatedAt: nowIso,
      exercises: workout.exercises.map((ex, idx) => ({
        ...ex,
        id: ex.id ?? `${dayKey}-${Date.now()}-${idx}`,
        restSeconds: idx === workout.exercises.length - 1 ? 0 : ex.restSeconds,
      })),
    };

    try {
      await db.weeklySchedule.put({
        dayKey,
        workout: normalized,
        updatedAt: nowIso,
      });
    } catch {
      // Fallback to in-memory state if IndexedDB is restricted
    }

    set((s) => ({
      weeklySchedule: {
        ...s.weeklySchedule,
        [dayKey]: normalized,
      },
      customizedWeeklyDays: {
        ...s.customizedWeeklyDays,
        [dayKey]: true,
      },
    }));
  },

  resetWeeklyDay: async (dayKey) => {
    const def = WEEKLY_DEFINITIONS_BY_DAY[dayKey];
    const fresh = cloneWorkoutPlan(def.defaultWorkout);
    try {
      await db.weeklySchedule.delete(dayKey);
    } catch {
      // Ignore IndexedDB error
    }
    set((s) => {
      const nextCustom = { ...s.customizedWeeklyDays };
      delete nextCustom[dayKey];
      return {
        weeklySchedule: {
          ...s.weeklySchedule,
          [dayKey]: fresh,
        },
        customizedWeeklyDays: nextCustom,
      };
    });
  },

  resetAllWeeklyDays: async () => {
    try {
      await db.weeklySchedule.clear();
    } catch {
      // Ignore IndexedDB error
    }
    set({
      weeklySchedule: createDefaultWeeklySchedule(),
      customizedWeeklyDays: {},
    });
  },

  recordCompletedSession: async (entry) => {
    const fullEntry: WorkoutHistoryEntry = {
      ...entry,
      id: `hist-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      completedAt: new Date().toISOString(),
    };
    try {
      await db.history.put(fullEntry);
      const history = await db.history.orderBy('completedAt').reverse().toArray();
      set({ history });
    } catch {
      set((s) => ({ history: [fullEntry, ...s.history] }));
    }
  },

  clearHistory: async () => {
    await db.history.clear();
    set({ history: [] });
  },
}));
