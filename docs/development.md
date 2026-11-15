# Development, Testing & GitHub Pages Deployment Guide

## 1. Prerequisites

- **Node.js:** v22 LTS (or compatible modern Node runtime)
- **npm:** v10+

## 2. Scripts Reference

| Script | Description |
| :--- | :--- |
| `npm run dev` | Starts the Vite development server |
| `npm run lint` | Runs ESLint across all TypeScript/React files |
| `npm run typecheck` | Runs `tsc --noEmit` in strict mode |
| `npm run test` | Runs Vitest unit & integration tests (`tests/engine/`, `tests/integration/`) |
| `npm run build` | Type-checks and builds the production static PWA bundle into `dist/` |
| `npm run preview` | Serves the production `dist/` bundle at `http://localhost:4173/sethane/` |
| `npm run test:e2e` | Runs Playwright E2E browser tests against `http://localhost:4173/sethane/` |

## 3. GitHub Pages Deployment Pipeline

Deployment is automated via `.github/workflows/deploy.yml`:
1. Triggered only on pushes to `main` (or manual `workflow_dispatch`), never on pull requests.
2. Runs `npm ci`, `npm run lint`, `npm run typecheck`, and `npm run test`.
3. Builds the production bundle with `VITE_BASE_PATH: /${{ github.event.repository.name }}/` (`/sethane/`).
4. Uploads `./dist` using `actions/upload-pages-artifact@v3` and publishes via `actions/deploy-pages@v4`.
