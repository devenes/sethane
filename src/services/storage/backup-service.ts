import { z } from 'zod';
import type { BackupPayloadV1, UserSettings, WorkoutHistoryEntry, WorkoutPlan } from '../../types';
import { db, DEFAULT_USER_SETTINGS } from './db';

export const WorkoutExerciseItemSchema = z.object({
  id: z.string().optional(),
  exerciseId: z.string().min(1),
  workSeconds: z.number().int().min(5).max(3600),
  restSeconds: z.number().int().min(0).max(3600),
});

export const WorkoutPlanSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1).max(120),
  localizedName: z
    .object({
      en: z.string(),
      tr: z.string(),
    })
    .optional(),
  description: z
    .object({
      en: z.string(),
      tr: z.string(),
    })
    .optional(),
  prepareSeconds: z.number().int().min(0).max(120).optional(),
  warmupSeconds: z.number().int().min(0).max(3600),
  rounds: z.number().int().min(1).max(50),
  restBetweenRounds: z.number().int().min(0).max(3600),
  cooldownSeconds: z.number().int().min(0).max(3600),
  exercises: z.array(WorkoutExerciseItemSchema).min(1),
  isPreset: z.boolean().optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});

export const WorkoutHistoryEntrySchema = z.object({
  id: z.string().min(1),
  workoutId: z.string().min(1),
  workoutName: z.string().min(1),
  completedAt: z.string().min(1),
  durationSeconds: z.number().int().min(1),
  roundsCompleted: z.number().int().min(1),
  exercisesCount: z.number().int().min(1),
});

export const UserSettingsPayloadSchema = z.object({
  locale: z.enum(['en', 'tr']),
  theme: z.enum(['system', 'light', 'dark']),
  soundEnabled: z.boolean(),
  speechEnabled: z.boolean(),
  countdownBeepsEnabled: z.boolean(),
  wakeLockEnabled: z.boolean(),
  preferredVoiceURI: z.string().nullable(),
  speechRate: z.number().min(0.5).max(2),
  soundVolume: z.number().min(0).max(1),
  defaultPrepareSeconds: z.number().int().min(0).max(60),
});

export const BackupPayloadV1Schema = z.object({
  schemaVersion: z.literal(1),
  exportedAt: z.string(),
  app: z.literal('SetHane'),
  customWorkouts: z.array(WorkoutPlanSchema),
  history: z.array(WorkoutHistoryEntrySchema),
  settings: UserSettingsPayloadSchema,
});

export async function createBackupPayload(): Promise<BackupPayloadV1> {
  const [customWorkouts, history, storedSettings] = await Promise.all([
    db.customWorkouts.toArray(),
    db.history.toArray(),
    db.settings.get('default'),
  ]);

  const mergedSettings: UserSettings = {
    ...DEFAULT_USER_SETTINGS,
    ...storedSettings,
    id: 'default',
  };

  const { id: _ignored, ...settingsWithoutId } = mergedSettings;

  return {
    schemaVersion: 1,
    exportedAt: new Date().toISOString(),
    app: 'SetHane',
    customWorkouts,
    history,
    settings: settingsWithoutId,
  };
}

export async function exportBackupAsJsonString(): Promise<string> {
  const payload = await createBackupPayload();
  return JSON.stringify(payload, null, 2);
}

export interface ImportBackupResult {
  success: boolean;
  workoutsImported: number;
  historyImported: number;
  error?: string;
}

export async function importBackupFromJsonString(
  rawJson: string,
  mode: 'merge' | 'replace' = 'merge'
): Promise<ImportBackupResult> {
  let parsedJson: unknown;
  try {
    parsedJson = JSON.parse(rawJson);
  } catch {
    return {
      success: false,
      workoutsImported: 0,
      historyImported: 0,
      error: 'Invalid JSON syntax.',
    };
  }

  const validation = BackupPayloadV1Schema.safeParse(parsedJson);
  if (!validation.success) {
    const firstIssue = validation.error.issues[0];
    const pathStr = firstIssue ? firstIssue.path.join('.') : 'root';
    return {
      success: false,
      workoutsImported: 0,
      historyImported: 0,
      error: `Schema validation failed at "${pathStr}": ${firstIssue?.message ?? 'Invalid format'}`,
    };
  }

  const data = validation.data;
  const sanitizedWorkouts: WorkoutPlan[] = data.customWorkouts.map((w) => ({
    ...w,
    isPreset: false,
  }));
  const sanitizedHistory: WorkoutHistoryEntry[] = data.history;

  await db.transaction('rw', db.customWorkouts, db.history, db.settings, async () => {
    if (mode === 'replace') {
      await db.customWorkouts.clear();
      await db.history.clear();
    }
    if (sanitizedWorkouts.length > 0) {
      await db.customWorkouts.bulkPut(sanitizedWorkouts);
    }
    if (sanitizedHistory.length > 0) {
      await db.history.bulkPut(sanitizedHistory);
    }
    await db.settings.put({
      id: 'default',
      ...data.settings,
    });
  });

  return {
    success: true,
    workoutsImported: sanitizedWorkouts.length,
    historyImported: sanitizedHistory.length,
  };
}
