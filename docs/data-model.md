# Data Model & Local Persistence (`docs/data-model.md`)

## 1. Static Bundled Catalogs (`src/data/`)

Static data is version-controlled in TypeScript so updates ship automatically with application releases:
- **Exercises (`src/data/exercises/catalog.ts`):** 40 exercises conforming to `Exercise` (`id`, bilingual `name`, `category`, `muscleGroups`, `equipment`, `difficulty`, bilingual `instructions`, `commonMistakes`, `easierVariation`, and animated GIF + poster `media`).
- **Preset Workouts (`src/data/workouts/presets.ts`):** 9 ready-made programs conforming to `WorkoutPlan` (`isPreset: true`).
- **Weekly Program (`src/data/workouts/weekly-program.ts`):** 7 daily splits (`monday`–`sunday`, 7 moves per day) covering every muscle group evenly across the week.

## 2. IndexedDB Schema (`SetHaneDB` via Dexie.js)

User data is stored locally in the browser's `IndexedDB` database `SetHaneDB` (version `2`):
- **`customWorkouts`** (`id, name, updatedAt`): Stores user-created and customized `WorkoutPlan` records.
- **`weeklySchedule`** (`dayKey, updatedAt`): Stores per-day user customizations for the 7-Day Weekly Program Mode.
- **`history`** (`id, workoutId, completedAt`): Stores completed workout sessions (`WorkoutHistoryEntry`).
- **`settings`** (`id`): Stores the singleton `'default'` `UserSettings` record (`locale`, `theme`, `soundEnabled`, `speechEnabled`, `countdownBeepsEnabled`, `wakeLockEnabled`, `preferredVoiceURI`, `speechRate`, `soundVolume`, `defaultPrepareSeconds`).

## 3. Portable JSON Backup Format (`BackupPayloadV1`)

Users can export and import their entire local database as a JSON file validated by **Zod** (`src/services/storage/backup-service.ts`):

```json
{
  "schemaVersion": 1,
  "exportedAt": "2026-11-15T12:00:00.000Z",
  "app": "SetHane",
  "customWorkouts": [],
  "history": [],
  "settings": {
    "locale": "tr",
    "theme": "system",
    "soundEnabled": true,
    "speechEnabled": true,
    "countdownBeepsEnabled": true,
    "wakeLockEnabled": true,
    "preferredVoiceURI": null,
    "speechRate": 1,
    "soundVolume": 0.85,
    "defaultPrepareSeconds": 5
  }
}
```
