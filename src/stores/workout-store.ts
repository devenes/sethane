import { create } from 'zustand';
import { PRESET_WORKOUTS } from '../data/workouts/presets';
import { db } from '../services/storage/db';
import type { WorkoutHistoryEntry, WorkoutPlan } from '../types';

interface WorkoutStoreState {
  presets: WorkoutPlan[];
  customWorkouts: WorkoutPlan[];
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
  recordCompletedSession: (entry: Omit<WorkoutHistoryEntry, 'id' | 'completedAt'>) => Promise<void>;
  clearHistory: () => Promise<void>;
}

export const useWorkoutStore = create<WorkoutStoreState>((set, get) => ({
  presets: PRESET_WORKOUTS,
  customWorkouts: [],
  history: [],
  activeWorkout: PRESET_WORKOUTS[0]!,
  editingWorkout: null,
  hydrated: false,

  hydrate: async () => {
    try {
      const [customWorkouts, history] = await Promise.all([
        db.customWorkouts.orderBy('updatedAt').reverse().toArray(),
        db.history.orderBy('completedAt').reverse().toArray(),
      ]);
      set({
        customWorkouts,
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
