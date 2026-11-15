import { beforeEach, describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { db } from '../../src/services/storage/db';
import {
  exportBackupAsJsonString,
  importBackupFromJsonString,
} from '../../src/services/storage/backup-service';
import { useWorkoutStore } from '../../src/stores/workout-store';
import { useSettingsStore } from '../../src/stores/settings-store';
import App from '../../src/app/App';

describe('IndexedDB Persistence & JSON Backup Service', () => {
  beforeEach(async () => {
    await db.customWorkouts.clear();
    await db.history.clear();
    await db.settings.clear();
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
    await useSettingsStore.getState().setLocale('en');
    window.location.hash = '#/';
  });

  it('renders the Dashboard, switches between English and Turkish, and navigates to the Workout Player', async () => {
    const user = userEvent.setup();
    render(<App />);

    expect(
      await screen.findByRole('heading', { name: /Train Smarter with Guided HIIT Intervals/i })
    ).toBeInTheDocument();

    // Switch to Turkish
    const langBtn = screen.getByRole('button', { name: /Arayüz dilini Türkçeye çevir/i });
    await user.click(langBtn);

    expect(
      await screen.findByRole('heading', {
        name: /Sesli ve Görsel Rehberli Akıllı HIIT Antrenmanı/i,
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
