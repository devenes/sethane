---
name: change-persisted-data
description: Add or change anything stored in IndexedDB or exported in backups in SetHane — new user settings, WorkoutPlan/history fields, Dexie tables/indexes, backup schema. Use whenever a persisted shape changes.
---

# Change persisted data safely

Users have real data in IndexedDB (`SetHaneDB`, Dexie `version(1)`: `customWorkouts`, `history`, `settings`) and in exported JSON (`BackupPayloadV1`, `schemaVersion: z.literal(1)`). Old data must keep loading.

## Adding a new user setting (most common)
1. `UserSettings` in `src/types/index.ts` — add the field.
2. `DEFAULT_USER_SETTINGS` in `src/services/storage/db.ts` — add a default (existing users' stored records lack the field, so make sure hydrate merges defaults; check `hydrate` in `src/stores/settings-store.ts`).
3. `UserSettingsPayloadSchema` in `src/services/storage/backup-service.ts` — add the field as **`.optional()` or with `.default(...)`** so older backups still import; check how `createBackupPayload`/`importBackupFromJsonString` map settings.
4. Store/UI: expose in `useSettingsStore` (`updateSettings` takes a `Partial`), add controls in `src/features/settings/SettingsPage.tsx`, strings in **both** locales of `UI_STRINGS`.
5. No Dexie version bump is needed for non-indexed fields.

## Adding a field to `WorkoutPlan` / `WorkoutHistoryEntry`
- Update the type, the matching Zod schema in `backup-service.ts` (optional/default for back-compat), the builder UI, and `saveCustomWorkout`/`duplicateWorkout` in `workout-store.ts`. Stay inside existing Zod bounds or widen them deliberately.
- Engine consumers use `WorkoutPlanInput` (`src/engine/types.ts`) — extend it only if the engine needs it.

## Changing indexes, tables, or breaking shapes
- Add `this.version(2).stores({...}).upgrade(tx => ...)` in `db.ts`; **never edit `version(1)`**.
- Introduce a new backup version only if you cannot stay backward compatible: add `BackupPayloadV2`, keep the V1 schema + a V1→V2 migration on import, bump export.
- Update `docs/data-model.md`.

## Tests
- `tests/integration/storage-and-ui.test.tsx` shows export/import round trips with `fake-indexeddb`. Add: (a) a V1 backup without the new field still imports, (b) a round trip includes it.
- Run `verify-changes`.
