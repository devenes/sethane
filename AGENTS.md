# AGENTS.md — SetHane agent onboarding

SetHane is a **100% static, local-first, offline-capable PWA** for HIIT/workout training (React 19 + TypeScript strict + Vite 6 + Tailwind 4, Zustand, Dexie/IndexedDB, Zod). Deployed to GitHub Pages at `/sethane/`. Bilingual: **Turkish (`tr`, default) and English (`en`)**.

Read this file first, then the matching skill in [`.agents/skills/`](./.agents/skills) before changing anything. Deeper docs: [`docs/architecture.md`](./docs/architecture.md), [`docs/timer-engine.md`](./docs/timer-engine.md), [`docs/data-model.md`](./docs/data-model.md), [`docs/development.md`](./docs/development.md), [`CONTRIBUTING.md`](./CONTRIBUTING.md).

## Non-negotiable constraints

1. **No backend, no auth, no paid/external runtime APIs, no tracking.** Everything ships in the repo and is precached by the service worker.
2. **Local-first.** User data lives only in IndexedDB (Dexie) with portable JSON export/import.
3. **Timer logic stays in `src/engine/`**: pure TypeScript, no React imports, deterministic, unit-tested.
4. **Every user-facing string and exercise entry needs both `en` and `tr`.**
5. **Accessibility:** native `<dialog>`, `<button>`, `<label for>`; keyboard alternatives to drag-and-drop; respect `prefers-reduced-motion`.
6. **Subpath-safe:** the app runs under `/sethane/`. Resolve static assets with `resolveAssetUrl()` (`src/utils/assets.ts`); never hardcode `/assets/...`. Routing is `HashRouter`.

## Commands

```bash
npm ci
npm run dev            # Vite dev server
npm run lint           # ESLint (CI-enforced)
npm run typecheck      # tsc --noEmit (CI-enforced)
npm run test           # Vitest: tests/engine + tests/integration (CI-enforced)
npm run build          # tsc -b && vite build (CI sets VITE_BASE_PATH=/<repo>/)
npm run test:e2e       # Playwright against `vite preview` on :4173 (NOT run in CI)
```

**Definition of done:** `lint`, `typecheck`, `test`, `build` all pass. Run `test:e2e` when you touch the exercise catalog, routing, or player UI.

## Code map

| Path | Role |
|---|---|
| `src/types/index.ts` | Domain types: `Exercise`, `WorkoutPlan`, `WorkoutHistoryEntry`, `UserSettings`, `BackupPayloadV1`, `LocalizedText` |
| `src/engine/` | `phase-resolver.ts` (plan → flat `TimelineStep[]`), `session-machine.ts` (pure state transitions), `timer-engine.ts` (`WorkoutTimerEngine`, deadline-based clock + events), `types.ts` |
| `src/services/` | Browser adapters: `audio/` (Web Audio synth), `speech/` (speechSynthesis), `wake-lock/`, `storage/db.ts` (Dexie `SetHaneDB` v1), `storage/backup-service.ts` (Zod import/export) |
| `src/stores/` | Zustand: `settings-store.ts` (locale/theme/audio/motion), `workout-store.ts` (presets, custom workouts, history) |
| `src/data/exercises/catalog.ts` | `EXERCISES_CATALOG` (40 exercises) |
| `src/data/workouts/presets.ts` | `PRESET_WORKOUTS` (9 programs, `isPreset: true`) |
| `src/data/workouts/weekly-program.ts` | `WEEKLY_PROGRAM_DEFINITIONS` (7-day balanced weekly split) |
| `src/features/<name>/` | Route screens: dashboard, weekly (`WeeklyProgramPage`), timer (`WorkoutPlayerPage`), exercises, workouts, builder, settings |
| `src/components/` | `layout/AppLayout.tsx`, `common/` shared components |
| `src/utils/` | `i18n.ts` (`UI_STRINGS` + label helpers), `format.ts`, `assets.ts`, `dialog.ts` |
| `src/app/router.tsx` | `HashRouter` routes inside `AppLayout` |
| `public/assets/exercises/` | `<id>.gif` + `<id>-poster.png` per exercise |
| `tests/` | `engine/` and `integration/` (Vitest, jsdom, fake-indexeddb), `e2e/` (Playwright) |

## Conventions

- **Components:** `React.FC` function components, named exports, one folder per feature under `src/features/`. Heavy logic belongs in stores/engine/services, not in pages.
- **i18n:** there is no i18n library. Pages read `const locale = useSettingsStore((s) => s.locale); const t = UI_STRINGS[locale].<section>;`. Add keys to **both** `en` and `tr` blocks in `src/utils/i18n.ts` (same key set — TS won't enforce it for you, so check). Enum labels go through `getCategoryLabel` / `getMuscleLabel` / etc.
- **State:** Zustand stores call `db` directly and re-read from Dexie after writes. Persistence failures are caught and degrade to in-memory state (see `recordCompletedSession`).
- **TypeScript:** `strict`, `noUncheckedIndexedAccess` (array/index access is `T | undefined` — use `!` only where proven, as the stores do for `PRESET_WORKOUTS[0]!`), `noUnusedLocals/Parameters` (prefix intentionally unused with `_`).
- **Testability:** interactive elements carry `data-testid` (e.g. `exercise-card-<id>`, `settings-locale-select`, `toggle-exercise-animations`). Keep existing ids stable; add them to new UI.
- **Styling:** Tailwind 4 utility classes (`@tailwindcss/vite`), dark mode via document color scheme (`applyColorSchemeToDocument`). Icons from `lucide-react`.
- **IDs:** custom workouts `custom-<Date.now()>-<rand>`, history `hist-…`, workout items `item-…`.

## Gotchas

- **Adding/removing an exercise breaks the e2e test** `tests/e2e/sethane.spec.ts` (`toHaveCount(32)`), and the "32" in `README.md`/`docs/`/`src/utils/i18n.ts`. Update all of them.
- **`CONTRIBUTING.md` says exercise art is SVG; the code actually uses GIF + PNG poster** (`media.type: 'gif'`, `posterSrc`). Follow the code and existing catalog entries. Document new art in `ASSETS-LICENSE.md` (original/MIT-compatible only).
- **Exercise `id` is a stable key** referenced by presets, saved custom workouts, and backups. Never rename or remove an existing id; deleting one orphans users' saved workouts.
- **Backup schema is versioned** (`schemaVersion: z.literal(1)`) and Dexie is at `version(1)`. Any change to persisted shapes needs a Dexie `version(2).upgrade(...)`, a backup schema decision, and tests — see the `change-persisted-data` skill.
- **Zod limits in `backup-service.ts`** (e.g. `workSeconds` 5–3600, `rounds` 1–50, name ≤120) constrain what the builder may produce; keep builder inputs consistent with them.
- **Custom workouts have `localizedName: undefined`** (saved by `saveCustomWorkout`); presets use `localizedName`/`description`. Display code must fall back to `name`.
- `npm run test:e2e` starts `npm run preview`, which serves the existing `dist/` — **run `npm run build` first** or you test stale output. Locally it launches installed Google Chrome (`channel: 'chrome'`); CI uses bundled Chromium.
- Backup import has `merge | replace` modes and forces `isPreset: false` on imported workouts.
- `dist/`, `test-results/`, `*.tsbuildinfo` are gitignored build output — don't edit or commit.

## Skills (task playbooks)

| Skill | Use when |
|---|---|
| [`add-exercise`](./.agents/skills/add-exercise/SKILL.md) | Adding or editing an exercise in the catalog |
| [`add-workout-preset`](./.agents/skills/add-workout-preset/SKILL.md) | Adding a bundled workout program |
| [`add-feature-page`](./.agents/skills/add-feature-page/SKILL.md) | Adding a new screen/route or UI feature with i18n |
| [`modify-timer-engine`](./.agents/skills/modify-timer-engine/SKILL.md) | Changing phases, timing, session transitions, cues |
| [`change-persisted-data`](./.agents/skills/change-persisted-data/SKILL.md) | New settings/fields, Dexie schema or backup format changes |
| [`verify-changes`](./.agents/skills/verify-changes/SKILL.md) | Final quality gate before reporting done |
