---
name: add-feature-page
description: Add a new screen/route or UI feature to SetHane following its feature-folder, Zustand, bilingual-i18n and accessibility conventions. Use for any new page, modal, or user-facing UI.
---

# Add a feature screen / UI

1. **Folder:** `src/features/<feature>/<Feature>Page.tsx` (named export, `React.FC`). Shared widgets go in `src/components/common/`.
2. **Route:** register in `src/app/router.tsx` inside the `<Route element={<AppLayout />}>` block (it is a `HashRouter`: URLs are `#/<path>`). Add a nav link in `src/components/layout/AppLayout.tsx` if it is top-level. Keep the `*` catch-all redirect last.
3. **Strings (mandatory bilingual):** add a section to **both** `en` and `tr` in `UI_STRINGS` (`src/utils/i18n.ts`), then in the page:
   ```ts
   const locale = useSettingsStore((s) => s.locale);
   const t = UI_STRINGS[locale].myFeature;
   ```
   Never hardcode visible text. Use `formatClock` / `formatHumanDuration(seconds, locale)` from `src/utils/format.ts` for durations.
4. **State & data:**
   - Read workouts/history via `useWorkoutStore`, preferences via `useSettingsStore`. Add new actions to the store (not inline in the page) and have them persist via `db` (see `change-persisted-data` if a new table/field is needed).
   - Static content → `src/data/`. Respect "no backend / no external runtime API".
   - Browser capabilities (audio, speech, wake lock) go through `src/services/*`, feature-detected with graceful fallback.
5. **Accessibility:** native `<button>`/`<label htmlFor>`/`<dialog>` (use `useLightDismissDialog` from `src/utils/dialog.ts` for modals — see `QuickTimerModal.tsx`), visible focus, keyboard equivalents for pointer gestures, honor reduced motion (`motionPreference` in the settings store; see `ExerciseVisual.tsx`).
6. **Assets:** use `resolveAssetUrl('assets/...')`, never absolute `/assets/...`.
7. **Test ids:** add `data-testid` to key controls.
8. **Tests:** add an integration test in `tests/integration/` (Vitest + Testing Library, `fake-indexeddb` is auto-loaded in `tests/setup.ts`; see `storage-and-ui.test.tsx` for the pattern). Add/adjust a Playwright step in `tests/e2e/sethane.spec.ts` for new routes (`page.goto('/sethane/')`, nav links match `header nav a[href="#/<route>"]`).
9. Run `verify-changes`.
