# SetHane — Architecture Decision Record & System Design

## 1. Architectural Vision

**SetHane** is designed as a **100% static, local-first, offline-first Progressive Web App** hosted on **GitHub Pages** (`https://devenes.github.io/sethane/`).

### Non-Negotiable Constraints
- **Zero Backend:** No API servers, cloud functions, or managed databases.
- **Zero Authentication:** Users start training immediately without sign-ups.
- **Zero External Runtime Dependencies:** All exercise metadata, SVG illustrations, and preset workouts are version-controlled in the repository and precached by the service worker.

## 2. Layered Module Architecture

- **`src/engine/` (UI-Independent Workout Engine)**
  - Pure TypeScript modules (`phase-resolver.ts`, `session-machine.ts`, `timer-engine.ts`) with zero React imports.
  - Compiles a `WorkoutPlanInput` into a flat `TimelineStep[]` array and advances state deterministically via clock deadlines (`phaseDeadlineMs`).
- **`src/services/` (Browser Capability Adapters)**
  - `audio/sound-service.ts`: Synthesizes crisp work, rest, countdown, and completion tones using the native `AudioContext` API (no external MP3 files required).
  - `speech/speech-service.ts`: Wraps `window.speechSynthesis` with bilingual (`tr-TR` and `en-US`) phase announcements and graceful fallback when voices are unavailable.
  - `wake-lock/wake-lock-service.ts`: Feature-detected `navigator.wakeLock` wrapper that automatically re-acquires screen wake lock when returning to the foreground.
  - `storage/db.ts` & `storage/backup-service.ts`: Dexie.js (`IndexedDB`) persistence and Zod-validated JSON import/export (`BackupPayloadV1`).
- **`src/stores/` (Zustand State Management)**
  - `settings-store.ts`: Manages localization (`tr`/`en`), color scheme (`system`/`light`/`dark`), and audio/speech toggles.
  - `workout-store.ts`: Coordinates bundled presets, user-created custom workouts, and workout completion history.
- **`src/features/` (Feature Screens)**
  - `dashboard/`: Quick launch for the 10-Minute Full Body HIIT program, Quick HIIT Timer modal, stats summary, and recent history.
  - `weekly/`: 7-Day Balanced Weekly Program Mode auto-selecting today's workout with per-day sequence editing and live muscle-coverage tracking.
  - `timer/`: High-contrast, distance-readable Workout Player with fullscreen support.
  - `exercises/`: Visual catalog of 32 animated GIF + poster exercises with filters and coaching modal.
  - `builder/`: Drag-and-drop (`@dnd-kit`) and keyboard-accessible workout builder.
  - `workouts/`: Preset and custom workout management.
  - `settings/`: Language, theme, voice selection, and JSON backup/restore.

## 3. GitHub Pages Subpath Strategy (`/sethane/`)

1. **Configurable Base Path:** `vite.config.ts` reads `VITE_BASE_PATH` (defaulting to `/sethane/`) and sets `base`, PWA `manifest.start_url`, and `manifest.scope` to `/sethane/`.
2. **Client-Side Routing:** Uses `HashRouter` (`#/`, `#/player`, `#/exercises`, `#/builder`, `#/workouts`, `#/settings`) so refreshing any URL on GitHub Pages never triggers a server-side 404.
3. **Asset Path Resolution:** All exercise illustrations are resolved via `resolveAssetUrl()` using `import.meta.env.BASE_URL`.
