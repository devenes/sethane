---
name: add-workout-preset
description: Add a bundled preset workout program to SetHane (src/data/workouts/presets.ts) with bilingual name/description and valid exercise references. Use when asked for a new ready-made workout.
---

# Add a preset workout

File: `src/data/workouts/presets.ts` (`PRESET_WORKOUTS: WorkoutPlan[]`). Model on the existing entries.

Required shape:
```ts
{
  id: 'kebab-case-unique',
  name: 'English name',
  localizedName: { en: '…', tr: '…' },
  description: { en: '…', tr: '…' },
  prepareSeconds: 5,
  warmupSeconds: 120,
  rounds: 3,
  restBetweenRounds: 45,
  cooldownSeconds: 120,
  isPreset: true,
  exercises: [{ exerciseId: 'push-ups', workSeconds: 40, restSeconds: 20 }, …],
}
```

Rules:
- Every `exerciseId` must exist in `EXERCISES_CATALOG`. Verify with a grep before finishing.
- Ranges (enforced for backups by Zod in `backup-service.ts`): `workSeconds` 5–3600 integer, `restSeconds` 0–3600, `rounds` 1–50, `prepareSeconds` 0–120, at least 1 exercise.
- Set the **last** exercise's `restSeconds` to `0` if it should not rest (existing presets do this). The engine already omits trailing rest after the last exercise of a round and inserts `round-rest` only between rounds.
- **Do not reorder or insert before index 0**: `PRESET_WORKOUTS[0]` is the default `activeWorkout` and the dashboard's featured workout. Append new presets.
- Preset `id`s are stable; presets are never persisted, but history entries reference `workoutId`.
- Expected total duration: use `calculateWorkoutSummary` from `src/engine/phase-resolver.ts` to sanity-check; the title should match reality (e.g. "10-Minute" = 10:00 core HIIT).
- Update `README.md`/docs lists of programs ("5 ready-made programs") and any test that enumerates presets.
- Run `verify-changes`.
