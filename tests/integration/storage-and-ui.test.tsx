import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { db } from '../../src/services/storage/db';
import {
  exportBackupAsJsonString,
  importBackupFromJsonString,
} from '../../src/services/storage/backup-service';
import { EXERCISES_CATALOG, getExerciseById } from '../../src/data/exercises/catalog';
import {
  computeWeeklyMuscleSets,
  createDefaultWeeklySchedule,
  getTodayDayKey,
  TRACKED_WEEKLY_MUSCLES,
  WEEKLY_DAY_ORDER,
  WEEKLY_PROGRAM_DEFINITIONS,
} from '../../src/data/workouts/weekly-program';
import { useWorkoutStore } from '../../src/stores/workout-store';
import { useSettingsStore } from '../../src/stores/settings-store';
import App from '../../src/app/App';

describe('IndexedDB Persistence & JSON Backup Service', () => {
  beforeEach(async () => {
    await db.customWorkouts.clear();
    await db.history.clear();
    await db.settings.clear();
    await db.weeklySchedule.clear();
    await useWorkoutStore.getState().hydrate();
    window.location.hash = '#/';
  });

  it('saves custom workouts to IndexedDB and exports/imports valid JSON backups', async () => {
    const store = useWorkoutStore.getState();
    await store.saveCustomWorkout({
      id: 'custom-kettlebell-1',
      name: 'Morning HIIT Blast',
      prepareSeconds: 5,
      warmupSeconds: 60,
      rounds: 3,
      restBetweenRounds: 30,
      cooldownSeconds: 60,
      exercises: [
        { exerciseId: 'dumbbell-thruster', workSeconds: 40, restSeconds: 20 },
        { exerciseId: 'burpees', workSeconds: 30, restSeconds: 0 },
      ],
    });

    await store.recordCompletedSession({
      workoutId: 'custom-kettlebell-1',
      workoutName: 'Morning HIIT Blast',
      durationSeconds: 540,
      roundsCompleted: 3,
      exercisesCount: 2,
    });

    const jsonBackup = await exportBackupAsJsonString();
    const parsed = JSON.parse(jsonBackup);
    expect(parsed.app).toBe('SetHane');
    expect(parsed.schemaVersion).toBe(1);
    expect(parsed.customWorkouts).toHaveLength(1);
    expect(parsed.history).toHaveLength(1);

    // Clear database and restore from JSON backup
    await db.customWorkouts.clear();
    await db.history.clear();
    expect(await db.customWorkouts.count()).toBe(0);

    const importResult = await importBackupFromJsonString(jsonBackup, 'replace');
    expect(importResult.success).toBe(true);
    expect(importResult.workoutsImported).toBe(1);
    expect(importResult.historyImported).toBe(1);

    const restored = await db.customWorkouts.get('custom-kettlebell-1');
    expect(restored?.name).toBe('Morning HIIT Blast');
  });

  it('rejects malformed or schema-invalid JSON imports gracefully', async () => {
    const syntaxErr = await importBackupFromJsonString('{bad json');
    expect(syntaxErr.success).toBe(false);
    expect(syntaxErr.error).toContain('Invalid JSON');

    const schemaErr = await importBackupFromJsonString(
      JSON.stringify({ schemaVersion: 999, app: 'OtherApp' })
    );
    expect(schemaErr.success).toBe(false);
    expect(schemaErr.error).toContain('Schema validation failed');
  });
});

describe('UI Integration — Dashboard, Localization & Exercise Catalog', () => {
  beforeEach(async () => {
    await db.customWorkouts.clear();
    await db.history.clear();
    await db.settings.clear();
    await db.weeklySchedule.clear();
    await useWorkoutStore.getState().hydrate();
    await useSettingsStore.getState().setLocale('en');
    window.location.hash = '#/';
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders the Dashboard, switches between English and Turkish, and navigates to the Workout Player', async () => {
    const user = userEvent.setup();
    render(<App />);

    expect(
      await screen.findByRole('heading', { name: /Ready to Train/i })
    ).toBeInTheDocument();

    // Switch to Turkish
    const langBtn = screen.getByRole('button', { name: /Arayüz dilini Türkçeye çevir/i });
    await user.click(langBtn);

    expect(
      await screen.findByRole('heading', {
        name: /Antrenman Seç/i,
      })
    ).toBeInTheDocument();

    // Start the signature 10-minute HIIT workout
    const startSignatureBtn = screen.getByRole('button', {
      name: /10 Dk Tam Vücut HIIT Başlat/i,
    });
    await user.click(startSignatureBtn);

    expect(await screen.findByTestId('workout-player')).toBeInTheDocument();
    expect(screen.getByTestId('btn-start')).toBeInTheDocument();
  });
});

describe('7-Day Weekly Program Mode — Auto-Day Selection, Full Muscle Coverage & Customization', () => {
  beforeEach(async () => {
    await db.customWorkouts.clear();
    await db.history.clear();
    await db.settings.clear();
    await db.weeklySchedule.clear();
    await useWorkoutStore.getState().hydrate();
    await useSettingsStore.getState().setLocale('tr');
    window.location.hash = '#/';
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('covers all 8 muscle/conditioning groups thoroughly across 7 distinct daily movement patterns using the 32-move catalog', () => {
    expect(EXERCISES_CATALOG.length).toBe(32);
    expect(WEEKLY_PROGRAM_DEFINITIONS).toHaveLength(7);

    const sequenceSignatures = new Set<string>();
    for (const def of WEEKLY_PROGRAM_DEFINITIONS) {
      expect(def.defaultWorkout.exercises.length).toBeGreaterThanOrEqual(5);
      const sig = def.defaultWorkout.exercises.map((e) => e.exerciseId).join(',');
      sequenceSignatures.add(sig);
      for (const item of def.defaultWorkout.exercises) {
        expect(getExerciseById(item.exerciseId)).toBeDefined();
      }
    }
    // Every single day has a distinct exercise arrangement
    expect(sequenceSignatures.size).toBe(7);

    const schedule = createDefaultWeeklySchedule();
    const coverage = computeWeeklyMuscleSets(schedule);
    for (const muscle of TRACKED_WEEKLY_MUSCLES) {
      expect(coverage[muscle]).toBeGreaterThanOrEqual(12);
    }

    // Verify local day mapping including Sunday (Pazar) and Monday (Pazartesi)
    expect(getTodayDayKey(new Date(2026, 10, 15, 14, 0, 0))).toBe('sunday');
    expect(getTodayDayKey(new Date(2026, 10, 16, 9, 0, 0))).toBe('monday');
    expect(WEEKLY_DAY_ORDER).toHaveLength(7);
  });

  it('auto-selects Sunday (Pazar) when opened on Sunday, lets user switch days, add/remove moves, and persists edits in IndexedDB', async () => {
    vi.setSystemTime(new Date(2026, 10, 15, 16, 30, 0)); // Sunday, Nov 15, 2026
    const user = userEvent.setup();
    render(<App />);

    // Enter Weekly Program Mode from the Dashboard mode bar
    const weeklyModeLink = await screen.findByTestId('dashboard-weekly-mode-link');
    await user.click(weeklyModeLink);

    expect(await screen.findByTestId('weekly-program-page')).toBeInTheDocument();

    // Sunday tab is automatically selected with "Bugün" badge
    const sundayTab = screen.getByTestId('weekly-day-tab-sunday');
    expect(sundayTab).toHaveAttribute('aria-selected', 'true');
    expect(within(sundayTab).getByText(/Bugün/i)).toBeInTheDocument();
    expect(screen.getByTestId('weekly-active-day-heading')).toHaveTextContent(/Pazar/i);

    // Switch to Monday (Pazartesi)
    const mondayTab = screen.getByTestId('weekly-day-tab-monday');
    await user.click(mondayTab);
    expect(mondayTab).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByTestId('weekly-active-day-heading')).toHaveTextContent(/Pazartesi/i);

    // Remove the first exercise from Monday (starts with 6 -> becomes 5)
    expect(screen.getAllByTestId(/^weekly-exercise-row-/)).toHaveLength(6);
    await user.click(screen.getByTestId('weekly-remove-exercise-0'));
    expect(screen.getAllByTestId(/^weekly-exercise-row-/)).toHaveLength(5);

    // Open Add Move picker and add Burpees to Monday (5 -> 6)
    await user.click(screen.getByTestId('weekly-open-picker-btn'));
    await user.click(screen.getByTestId('weekly-picker-add-burpees'));
    expect(screen.getAllByTestId(/^weekly-exercise-row-/)).toHaveLength(6);

    // Verify persisted in IndexedDB & JSON backup
    const storedMonday = await db.weeklySchedule.get('monday');
    expect(storedMonday).toBeDefined();
    expect(storedMonday?.workout.exercises.at(-1)?.exerciseId).toBe('burpees');

    const exported = JSON.parse(await exportBackupAsJsonString());
    expect(exported.weeklySchedule?.monday?.exercises?.at(-1)?.exerciseId).toBe('burpees');

    // Reset Monday back to default
    await user.click(screen.getByTestId('weekly-reset-day-btn'));
    expect(await db.weeklySchedule.get('monday')).toBeUndefined();
  });
});
