# Contributing to SetHane

Thank you for your interest in contributing to **SetHane** — the open-source, 100% static, local-first workout and HIIT training PWA!

## Core Architectural Principles

Before proposing changes, please keep our non-negotiable architectural constraints in mind:
1. **100% Static & Free:** SetHane runs entirely on GitHub Pages with zero backend servers, zero databases, zero paid APIs, and zero authentication walls.
2. **Local-First & Offline-First:** All user workouts, preferences, and completion histories live in the user's browser (`IndexedDB` via Dexie.js) with portable JSON export/import.
3. **UI-Independent Timer Engine:** All interval timing, deadline calculation, and round transitions belong in `src/engine/` with deterministic unit tests.
4. **Bilingual Support:** Every user-facing string and exercise entry must include both **English (`en`)** and **Turkish (`tr`)** translations.
5. **Accessibility First:** Use native HTML primitives (`<dialog>`, `<button>`, `<label for>`), keyboard reordering alternatives alongside drag-and-drop, and high-contrast work/rest indicators.

## Development Workflow

```bash
# 1. Install dependencies
npm ci

# 2. Start local dev server
npm run dev

# 3. Run quality checks before opening a PR
npm run lint
npm run typecheck
npm run test
npm run build
```

## Adding a New Exercise

1. Create an original SVG illustration in `public/assets/exercises/<exercise-id>.svg`.
2. Add the exercise metadata (with `en` and `tr` names, instructions, common mistakes, and easier variations) in `src/data/exercises/catalog.ts`.
3. Document any licensing notes in `ASSETS-LICENSE.md`.
4. Run `npm test` and `npm run build` to verify asset bundling.
