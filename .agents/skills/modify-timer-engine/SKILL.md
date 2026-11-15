---
name: modify-timer-engine
description: Change HIIT timer behavior in src/engine (phases, timeline compilation, pause/skip/resume, events) or the audio/speech cues tied to them. Use for anything affecting workout timing or phase transitions.
---

# Modify the timer engine

Read `docs/timer-engine.md` first. Architecture:

- `phase-resolver.ts` — `resolveWorkoutTimeline(plan)` compiles a `WorkoutPlanInput` into a flat `TimelineStep[]` (`prepare → warmup → [work, rest]… → round-rest … → cooldown`). `calculateWorkoutSummary(plan)` derives durations from the same data.
- `session-machine.ts` — **pure** functions (`startSession`, `pauseSession`, `resumeSession`, `skipStep`, `previousStep`, `restartSession`, `stopSession`, `advanceByTime`) over `SessionMachineState`. Time is passed in as `nowMs`; no timers or `Date.now()` inside.
- `timer-engine.ts` — `WorkoutTimerEngine` wraps the machine, owns the ticking loop, and emits `EngineEvent`s (`PHASE_CHANGED` incl. `skippedIntermediatePhases`, `COUNTDOWN_TICK` 3/2/1, `WORKOUT_COMPLETED`).
- `types.ts` — `WorkoutPhase`, `TimelineStep`, `SessionMachineState`, `EngineEvent`.

Invariants (tests assert these):
- **Deadline-based, not decrement-based.** Remaining time derives from `phaseDeadlineMs - nowMs`; returning from a backgrounded tab must resync and may skip several steps in one tick (reported via `skippedIntermediatePhases`).
- No trailing `rest` after the last exercise of a round; `round-rest` only *between* rounds.
- Exactly one `WORKOUT_COMPLETED` event.
- **No React/DOM imports in `src/engine/`.**

Workflow:
1. Write/extend a failing test in `tests/engine/timer-engine.test.ts` first (it imports presets, `resolveWorkoutTimeline`, `WorkoutTimerEngine`, and drives time with explicit `nowMs`).
2. Implement in the engine. If you add a phase: update `WorkoutPhase` in `engine/types.ts`, `getPhaseDisplayLabel` + `phase*` strings in `src/utils/i18n.ts` (**en and tr**), the speech/audio mapping in `src/services/speech` and `src/services/audio`, and the player UI `src/features/timer/WorkoutPlayerPage.tsx`.
3. Keep `WorkoutPlanInput` compatible with `WorkoutPlan` (the builder/store pass plans straight in). New plan fields also trigger `change-persisted-data`.
4. Update `docs/timer-engine.md`.
5. Run `verify-changes`, including `npm run test:e2e` for player flows.
