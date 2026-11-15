# SetHane — Open-Source Workout & HIIT Platform

[![CI](https://github.com/devenes/sethane/actions/workflows/ci.yml/badge.svg)](https://github.com/devenes/sethane/actions/workflows/ci.yml)
[![Deploy to GitHub Pages](https://github.com/devenes/sethane/actions/workflows/deploy.yml/badge.svg)](https://github.com/devenes/sethane/actions/workflows/deploy.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-10b981.svg)](./LICENSE)

**Live App:** **[https://devenes.github.io/sethane/](https://devenes.github.io/sethane/)**

**SetHane** is a 100% free, local-first, offline-capable Progressive Web App (PWA) for high-intensity interval training (HIIT), visual exercise coaching, and custom workout building. It runs entirely in your browser on GitHub Pages with **no backend, no database server, no account requirement, no ads, and no tracking**.

---

## Key Features

1. **Smart Deadline-Based HIIT Timer Engine (`src/engine/`)**
   - Deterministic flat timeline compiler (`phase-resolver.ts`) and pure state machine (`session-machine.ts`).
   - Uses hardware clock deadlines (`Date.now()`) rather than naive per-second decrement counters, ensuring zero drift and automatic phase resynchronization when returning from a backgrounded mobile tab.
   - Prevents unnecessary trailing rest intervals after the final exercise of a round.
   - Web Audio API synthesized sound cues (Work, Rest, 3-2-1 Countdown, Completion fanfare) and Web Speech API spoken coaching in **Turkish (`tr`)** and **English (`en`)**.
   - Screen Wake Lock API integration to keep your display awake while training.

2. **Visual Exercise Library (24 Original SVG Illustrations)**
   - 24 curated exercises across **Bodyweight**, **Dumbbell**, **Core**, **Cardio**, and **Low-Impact** categories.
   - Step-by-step execution instructions, common mistakes to avoid, and easier/low-impact variations in both English and Turkish.
   - 100% original MIT-licensed vector SVG illustrations (`public/assets/exercises/*.svg`).

3. **Drag-and-Drop Workout Builder & 5 Ready-Made Programs**
   - Includes **10-Minute Full Body HIIT**, **15-Minute Dumbbell Workout**, **Bodyweight HIIT**, **Beginner Low-Impact HIIT**, and **Tabata Workout**.
   - Reorder exercises via `@dnd-kit` drag-and-drop or accessible keyboard controls (`Move Up` / `Move Down`).
   - Customize individual exercise work/rest durations, warm-up, cooldown, rounds, and rest between rounds with live duration calculation.

4. **Local-First Persistence & Portable JSON Backups**
   - Powered by **Dexie.js (`IndexedDB`)** for custom workouts, completion history, and user settings.
   - Full **JSON Export & Import** validated with **Zod** schemas (`schemaVersion: 1`).

5. **Installable Offline-First PWA**
   - Configured via `vite-plugin-pwa` and Workbox with full support for the `/sethane/` GitHub Pages subpath.

---

## Tech Stack

- **Frontend:** React 19 + TypeScript (Strict Mode) + Vite 6 + Tailwind CSS 4
- **State & Storage:** Zustand + Dexie.js (`IndexedDB`) + Zod
- **Drag & Drop:** `@dnd-kit/core` + `@dnd-kit/sortable`
- **Browser APIs:** Web Audio API, Web Speech API (`speechSynthesis`), Screen Wake Lock API
- **PWA:** `vite-plugin-pwa` + Workbox
- **Testing:** Vitest + React Testing Library + Fake-IndexedDB + Playwright E2E

---

## Quick Start

```bash
# Install dependencies
npm ci

# Start development server
npm run dev

# Run ESLint, TypeScript check, and unit/integration tests
npm run lint
npm run typecheck
npm run test

# Build production bundle (uses /sethane/ base path by default)
npm run build

# Preview production build at http://localhost:4173/sethane/
npm run preview

# Run Playwright E2E tests against production preview
npm run test:e2e
```

---

## Documentation

- [Architecture Overview](./docs/architecture.md)
- [Timer Engine Specification](./docs/timer-engine.md)
- [Data Model & Backup Schema](./docs/data-model.md)
- [Development & Deployment Guide](./docs/development.md)
- [Assets & Content License](./ASSETS-LICENSE.md)

---

## License

Application source code is licensed under the [MIT License](./LICENSE). Original SVG exercise illustrations are documented in [ASSETS-LICENSE.md](./ASSETS-LICENSE.md).
