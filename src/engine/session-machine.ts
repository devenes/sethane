import { resolveWorkoutTimeline } from './phase-resolver';
import type { EngineEvent, SessionMachineState, TimelineStep, WorkoutPlanInput } from './types';

function computePriorStepsDurationMs(steps: TimelineStep[], upToIndex: number): number {
  let sum = 0;
  for (let i = 0; i < upToIndex && i < steps.length; i++) {
    sum += steps[i]!.durationMs;
  }
  return sum;
}

function buildStepSnapshot(
  base: SessionMachineState,
  stepIndex: number,
  remainingMs: number,
  phaseDeadlineMs: number | null,
  status: SessionMachineState['status'],
  lastAnnouncedCountdownSecond: number | null
): SessionMachineState {
  const step = base.steps[stepIndex];
  if (!step) {
    return {
      ...base,
      status: 'completed',
      phase: 'completed',
      currentStepIndex: Math.max(0, base.steps.length - 1),
      remainingMs: 0,
      remainingSeconds: 0,
      stepDurationMs: 0,
      stepElapsedMs: 0,
      totalElapsedMs: base.totalDurationMs,
      progressRatio: 1,
      phaseDeadlineMs: null,
      lastAnnouncedCountdownSecond: null,
    };
  }

  const clampedRemainingMs = Math.max(0, Math.min(step.durationMs, remainingMs));
  const stepElapsedMs = step.durationMs - clampedRemainingMs;
  const priorElapsedMs = computePriorStepsDurationMs(base.steps, stepIndex);
  const totalElapsedMs = Math.min(base.totalDurationMs, priorElapsedMs + stepElapsedMs);
  const progressRatio =
    base.totalDurationMs > 0 ? Math.min(1, Math.max(0, totalElapsedMs / base.totalDurationMs)) : 0;

  return {
    ...base,
    status,
    currentStepIndex: stepIndex,
    phase: step.phase,
    remainingMs: clampedRemainingMs,
    remainingSeconds: Math.max(0, Math.ceil(clampedRemainingMs / 1000)),
    stepDurationMs: step.durationMs,
    stepElapsedMs,
    totalElapsedMs,
    progressRatio,
    phaseDeadlineMs,
    lastAnnouncedCountdownSecond,
  };
}

export function createInitialSessionState(workout: WorkoutPlanInput): SessionMachineState {
  const steps = resolveWorkoutTimeline(workout);
  const totalDurationMs = steps.reduce((acc, s) => acc + s.durationMs, 0);
  const firstStep = steps[0];

  return {
    workoutId: workout.id,
    workoutName: workout.name,
    status: 'idle',
    steps,
    currentStepIndex: 0,
    phase: 'idle',
    remainingMs: firstStep ? firstStep.durationMs : 0,
    remainingSeconds: firstStep ? firstStep.durationSeconds : 0,
    stepDurationMs: firstStep ? firstStep.durationMs : 0,
    stepElapsedMs: 0,
    totalDurationMs,
    totalElapsedMs: 0,
    progressRatio: 0,
    phaseDeadlineMs: null,
    lastAnnouncedCountdownSecond: null,
    completedStepIndices: [],
  };
}

export function startSession(
  state: SessionMachineState,
  nowMs: number
): { state: SessionMachineState; events: EngineEvent[] } {
  if (state.steps.length === 0) {
    return {
      state: {
        ...state,
        status: 'completed',
        phase: 'completed',
        remainingMs: 0,
        remainingSeconds: 0,
        progressRatio: 1,
      },
      events: [{ type: 'WORKOUT_COMPLETED', workoutId: state.workoutId, totalDurationMs: 0 }],
    };
  }

  const firstStep = state.steps[0]!;
  const nextState = buildStepSnapshot(
    { ...state, completedStepIndices: [] },
    0,
    firstStep.durationMs,
    nowMs + firstStep.durationMs,
    'running',
    null
  );

  return {
    state: nextState,
    events: [
      {
        type: 'PHASE_CHANGED',
        step: firstStep,
        previousPhase: state.phase,
        skippedIntermediatePhases: 0,
      },
    ],
  };
}

export function pauseSession(state: SessionMachineState, nowMs: number): SessionMachineState {
  if (state.status !== 'running') {
    return state;
  }
  const synced = advanceByTime(state, nowMs).state;
  if (synced.status !== 'running') {
    return synced;
  }
  return {
    ...synced,
    status: 'paused',
    phaseDeadlineMs: null,
  };
}

export function resumeSession(state: SessionMachineState, nowMs: number): SessionMachineState {
  if (state.status !== 'paused') {
    return state;
  }
  return {
    ...state,
    status: 'running',
    phaseDeadlineMs: nowMs + state.remainingMs,
  };
}

export function skipStep(
  state: SessionMachineState,
  nowMs: number
): { state: SessionMachineState; events: EngineEvent[] } {
  if (state.status === 'idle' || state.status === 'completed') {
    return { state, events: [] };
  }

  const nextIndex = state.currentStepIndex + 1;
  if (nextIndex >= state.steps.length) {
    const completedState: SessionMachineState = {
      ...state,
      status: 'completed',
      phase: 'completed',
      remainingMs: 0,
      remainingSeconds: 0,
      stepElapsedMs: state.stepDurationMs,
      totalElapsedMs: state.totalDurationMs,
      progressRatio: 1,
      phaseDeadlineMs: null,
      lastAnnouncedCountdownSecond: null,
    };
    return {
      state: completedState,
      events: [
        {
          type: 'WORKOUT_COMPLETED',
          workoutId: state.workoutId,
          totalDurationMs: state.totalDurationMs,
        },
      ],
    };
  }

  const nextStep = state.steps[nextIndex]!;
  const isRunning = state.status === 'running';
  const nextState = buildStepSnapshot(
    state,
    nextIndex,
    nextStep.durationMs,
    isRunning ? nowMs + nextStep.durationMs : null,
    state.status,
    null
  );

  return {
    state: nextState,
    events: [
      {
        type: 'PHASE_CHANGED',
        step: nextStep,
        previousPhase: state.phase,
        skippedIntermediatePhases: 0,
      },
    ],
  };
}

export function previousStep(
  state: SessionMachineState,
  nowMs: number
): { state: SessionMachineState; events: EngineEvent[] } {
  if (state.status === 'idle') {
    return { state, events: [] };
  }

  const targetIndex =
    state.status === 'completed'
      ? Math.max(0, state.steps.length - 1)
      : Math.max(0, state.currentStepIndex - 1);

  const targetStep = state.steps[targetIndex];
  if (!targetStep) {
    return { state, events: [] };
  }

  const nextStatus = state.status === 'completed' ? 'running' : state.status;
  const isRunning = nextStatus === 'running';
  const nextState = buildStepSnapshot(
    state,
    targetIndex,
    targetStep.durationMs,
    isRunning ? nowMs + targetStep.durationMs : null,
    nextStatus,
    null
  );

  return {
    state: nextState,
    events: [
      {
        type: 'PHASE_CHANGED',
        step: targetStep,
        previousPhase: state.phase,
        skippedIntermediatePhases: 0,
      },
    ],
  };
}

export function restartSession(
  state: SessionMachineState,
  nowMs: number
): { state: SessionMachineState; events: EngineEvent[] } {
  const resetBase: SessionMachineState = {
    ...state,
    status: 'idle',
    phase: 'idle',
    currentStepIndex: 0,
    completedStepIndices: [],
    lastAnnouncedCountdownSecond: null,
  };
  return startSession(resetBase, nowMs);
}

export function stopSession(state: SessionMachineState): SessionMachineState {
  const firstStep = state.steps[0];
  return {
    ...state,
    status: 'idle',
    currentStepIndex: 0,
    phase: 'idle',
    remainingMs: firstStep ? firstStep.durationMs : 0,
    remainingSeconds: firstStep ? firstStep.durationSeconds : 0,
    stepDurationMs: firstStep ? firstStep.durationMs : 0,
    stepElapsedMs: 0,
    totalElapsedMs: 0,
    progressRatio: 0,
    phaseDeadlineMs: null,
    lastAnnouncedCountdownSecond: null,
    completedStepIndices: [],
  };
}

/**
 * Advances the state machine to `nowMs` using deadline timestamps.
 *
 * Handles:
 * - Normal tick within current step (including 3-2-1 countdown threshold detection)
 * - Exact boundary transition to next step
 * - Background tab catch-up across multiple elapsed steps without emitting duplicate audio events
 *   for steps that already finished in the past
 * - Workout completion with duplicate-completion protection
 */
export function advanceByTime(
  state: SessionMachineState,
  nowMs: number
): { state: SessionMachineState; events: EngineEvent[] } {
  if (state.status !== 'running' || state.phaseDeadlineMs === null) {
    return { state, events: [] };
  }

  const events: EngineEvent[] = [];
  let cursorIndex = state.currentStepIndex;
  let cursorDeadlineMs = state.phaseDeadlineMs;
  const previousPhase = state.phase;
  const completedStepIndices = [...state.completedStepIndices];
  let transitionedCount = 0;

  while (nowMs >= cursorDeadlineMs && cursorIndex < state.steps.length) {
    if (!completedStepIndices.includes(cursorIndex)) {
      completedStepIndices.push(cursorIndex);
    }
    const overflowMs = nowMs - cursorDeadlineMs;
    cursorIndex += 1;
    transitionedCount += 1;

    if (cursorIndex >= state.steps.length) {
      const completedState: SessionMachineState = {
        ...state,
        status: 'completed',
        currentStepIndex: Math.max(0, state.steps.length - 1),
        phase: 'completed',
        remainingMs: 0,
        remainingSeconds: 0,
        stepElapsedMs: state.steps[state.steps.length - 1]?.durationMs ?? 0,
        totalElapsedMs: state.totalDurationMs,
        progressRatio: 1,
        phaseDeadlineMs: null,
        lastAnnouncedCountdownSecond: null,
        completedStepIndices,
      };
      events.push({
        type: 'WORKOUT_COMPLETED',
        workoutId: state.workoutId,
        totalDurationMs: state.totalDurationMs,
      });
      return { state: completedState, events };
    }

    const nextStep = state.steps[cursorIndex]!;
    cursorDeadlineMs = nowMs - overflowMs + nextStep.durationMs;
  }

  const activeStep = state.steps[cursorIndex]!;
  const remainingMs = Math.max(0, cursorDeadlineMs - nowMs);
  const remainingSeconds = Math.max(0, Math.ceil(remainingMs / 1000));

  let lastAnnounced = transitionedCount > 0 ? null : state.lastAnnouncedCountdownSecond;

  if (transitionedCount > 0) {
    events.push({
      type: 'PHASE_CHANGED',
      step: activeStep,
      previousPhase,
      skippedIntermediatePhases: Math.max(0, transitionedCount - 1),
    });
  }

  if (
    (remainingSeconds === 3 || remainingSeconds === 2 || remainingSeconds === 1) &&
    activeStep.durationSeconds > remainingSeconds &&
    lastAnnounced !== remainingSeconds
  ) {
    lastAnnounced = remainingSeconds;
    events.push({
      type: 'COUNTDOWN_TICK',
      secondsLeft: remainingSeconds,
      step: activeStep,
    });
  }

  const updatedState = buildStepSnapshot(
    { ...state, completedStepIndices },
    cursorIndex,
    remainingMs,
    cursorDeadlineMs,
    'running',
    lastAnnounced
  );

  return { state: updatedState, events };
}
