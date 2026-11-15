import Dexie, { type Table } from 'dexie';
import type {
  DayOfWeekKey,
  UserSettings,
  WeeklyDayScheduleRecord,
  WorkoutHistoryEntry,
  WorkoutPlan,
} from '../../types';

export const DEFAULT_USER_SETTINGS: UserSettings = {
  id: 'default',
  locale: 'tr',
  theme: 'system',
  soundEnabled: true,
  speechEnabled: true,
  countdownBeepsEnabled: true,
  wakeLockEnabled: true,
  preferredVoiceURI: null,
  speechRate: 1.0,
  soundVolume: 0.85,
  defaultPrepareSeconds: 5,
};

export class SetHaneDatabase extends Dexie {
  customWorkouts!: Table<WorkoutPlan, string>;
  history!: Table<WorkoutHistoryEntry, string>;
  settings!: Table<UserSettings, string>;
  weeklySchedule!: Table<WeeklyDayScheduleRecord, DayOfWeekKey>;

  constructor() {
    super('SetHaneDB');
    this.version(1).stores({
      customWorkouts: 'id, name, updatedAt',
      history: 'id, workoutId, completedAt',
      settings: 'id',
    });
    this.version(2).stores({
      customWorkouts: 'id, name, updatedAt',
      history: 'id, workoutId, completedAt',
      settings: 'id',
      weeklySchedule: 'dayKey, updatedAt',
    });
  }
}

export const db = new SetHaneDatabase();
