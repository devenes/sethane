# Timer Engine Specification (`src/engine/`)

## 1. Why a Flat Timeline + Deadline State Machine?

Naive interval timers that run `remainingSeconds--` inside a `setInterval(..., 1000)` suffer from two critical flaws:
1. **Cumulative Drift & Throttling:** Mobile browsers and backgrounded tabs throttle `setInterval` callbacks to once per second or pause them entirely.
2. **Complex Nested Edge Cases:** Tracking nested `round`, `exerciseIndex`, and `isRest` flags makes `Skip`, `Previous`, zero-duration rests, and omitting the final rest of a round brittle.

SetHane solves both problems by separating **Timeline Resolution** (`phase-resolver.ts`) from **Deadline Execution** (`session-machine.ts`).

## 2. Timeline Resolution Rules (`resolveWorkoutTimeline`)

Given a `WorkoutPlanInput`:
1. **`prepare` phase:** Emitted at index `0` if `prepareSeconds > 0`.
2. **`warmup` phase:** Emitted if `warmupSeconds > 0`.
3. **For each round `1..R` and each exercise `1..E`:**
   - Emit a **`work`** step (`durationMs = workSeconds * 1000`).
   - If the exercise is **not** the last exercise in the round (`exIdx < E - 1`) and `restSeconds > 0`, emit a **`rest`** step.
   - If the exercise **is** the last exercise in the round (`exIdx === E - 1`):
     - **Never** emit an exercise `rest` step (preventing redundant double rests).
     - If `round < R` and `restBetweenRounds > 0`, emit a **`round-rest`** step.
4. **`cooldown` phase:** Emitted after the final round if `cooldownSeconds > 0`.

## 3. Deadline Timing & Background Tab Resync (`advanceByTime`)

- When a step starts at `nowMs`, its deadline is recorded as `phaseDeadlineMs = nowMs + step.durationMs`.
- On every tick (`100ms` interval or `visibilitychange` event), `remainingMs = Math.max(0, phaseDeadlineMs - nowMs)`.
- If `nowMs >= phaseDeadlineMs`, the machine advances through as many steps as have elapsed (`while (nowMs >= cursorDeadlineMs)`), carrying over any millisecond overflow (`overflowMs = nowMs - cursorDeadlineMs`) into the next step's deadline.
- **Anti-Spam Guarantee:** If a user backgrounds the tab for 45 seconds and multiple steps pass while hidden, `advanceByTime` jumps directly to the currently active step and emits a **single** `PHASE_CHANGED` event (with `skippedIntermediatePhases` count) rather than playing stale audio cues for already-finished phases.
- **Pause/Resume Accuracy:** Pausing first synchronizes `remainingMs` at `nowMs` and clears `phaseDeadlineMs = null`. Resuming sets `phaseDeadlineMs = resumeNowMs + remainingMs`, preserving exact sub-second accuracy.
