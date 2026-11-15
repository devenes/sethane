---
name: verify-changes
description: Run SetHane's full quality gate (lint, typecheck, unit/integration tests, build, optional e2e) and a bilingual/accessibility checklist before declaring a task done.
---

# Verify changes

Run in order and fix failures at the root cause (do not weaken tests or lint rules):

```bash
npm run lint
npm run typecheck
npm run test
npm run build
npm run test:e2e   # after `npm run build` (it serves dist/); when catalog, routes, player UI, or PWA config changed. Needs Google Chrome locally, or `npx playwright install chromium` in CI-like envs
```

CI (`.github/workflows/ci.yml`) runs lint → typecheck → test → build with `VITE_BASE_PATH=/<repo>/`. E2E is not in CI, so run it yourself when relevant. Deploy (`deploy.yml`) publishes to GitHub Pages.

Checklist:
- [ ] Every new user-facing string exists in both `en` and `tr`.
- [ ] No hardcoded `/assets/...` paths; assets resolved via `resolveAssetUrl`.
- [ ] No new backend/external runtime dependency; no React imports in `src/engine/`.
- [ ] Persisted-shape changes follow `change-persisted-data` (old data/backups still load).
- [ ] Counts/lists in tests, `README.md`, and `docs/` updated (exercise count, preset count).
- [ ] New interactive UI is keyboard-operable and has `data-testid`s.
- [ ] Docs under `docs/` updated if architecture, engine behavior, or data model changed.
- [ ] Only source changes committed — not `dist/`, `test-results/`, `*.tsbuildinfo`.
