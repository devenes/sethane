---
name: add-exercise
description: Add or edit an exercise in the SetHane catalog (bilingual metadata, GIF + poster assets, tests and docs that hard-code the count). Use when asked to add a new exercise/movement.
---

# Add an exercise

Files: `src/data/exercises/catalog.ts`, `public/assets/exercises/`, `src/types/index.ts`.

1. **Pick a stable kebab-case `id`** (e.g. `jump-squats`). It is referenced by presets, users' saved workouts and backups — never rename it later.
2. **Assets:** add `public/assets/exercises/<id>.gif` and `<id>-poster.png` (static peak-form frame). Must be original/MIT-compatible; add a note to `ASSETS-LICENSE.md`. If you cannot produce a GIF, ask the user — do not hotlink external media (offline PWA, no external runtime deps).
3. **Catalog entry** — append to `EXERCISES_CATALOG`, copying an existing entry's shape (`Exercise` type):
   - `name`, `instructions` (3–5 steps), `commonMistakes` (2+), `easierVariation`, `media.alt` — **all with both `en` and `tr`**; `instructions`/`commonMistakes` arrays should be the same length conceptually in both languages.
   - `category`: `bodyweight | dumbbell | core | cardio | low-impact`; `muscleGroups`, `equipment` (`none | dumbbells | mat`), `difficulty` from the unions in `src/types/index.ts`. If you need a new union value, also add its label in `getCategoryLabel`/`getMuscleLabel`/`getEquipmentLabel`/`getDifficultyLabel` in `src/utils/i18n.ts` (both locales).
   - `defaultWorkSeconds` (≥5) / `defaultRestSeconds` (≥0).
   - `media: { type: 'gif', src: 'assets/exercises/<id>.gif', posterSrc: 'assets/exercises/<id>-poster.png', alt }` — paths are **relative, no leading slash**; the UI calls `resolveAssetUrl`.
4. **Update hard-coded counts:** `tests/e2e/sethane.spec.ts` (`toHaveCount(32)`), `README.md` ("32 …"), `docs/architecture.md`, `docs/data-model.md`, `src/utils/i18n.ts`.
5. Optionally reference it from a preset (see `add-workout-preset`).
6. Run the `verify-changes` skill (include `npm run test:e2e`; the service worker precaches `assets/exercises/*.gif|png`).

Pitfall: `CONTRIBUTING.md` mentions SVG art; the real catalog uses GIF + PNG poster.
