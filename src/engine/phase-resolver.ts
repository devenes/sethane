import type { TimelineStep, WorkoutDurationSummary, WorkoutPlanInput } from './types';

export const DEFAULT_PREPARE_SECONDS = 5;

/**
 * Compiles a workout configuration into a flat, deterministic list of timeline steps.
 *
 * Key invariants enforced:
 * 1. Zero-duration phases (warmup=0, rest=0, round-rest=0, cooldown=0) are never emitted.
 * 2. The last exercise of a round NEVER emits an exercise 'rest' step.
 * 3. Between round r and round r+1, a 'round-rest' step is emitted only if restBetweenRounds > 0.
 * 4. After the final exercise of the final round, execution flows directly to 'cooldown' (if > 0) or 'completed'.
 */
export function resolveWorkoutTimeline(workout: WorkoutPlanInput): TimelineStep[] {
  const validExercises = workout.exercises.filter((ex) => ex.workSeconds > 0);
  const totalRounds = Math.max(0, Math.floor(workout.rounds));

  if (validExercises.length === 0 || totalRounds === 0) {
    return [];
  }

  const steps: TimelineStep[] = [];
  const firstExerciseId = validExercises[0]?.exerciseId;
  const prepareSeconds =
    workout.prepareSeconds !== undefined
      ? Math.max(0, Math.floor(workout.prepareSeconds))
      : DEFAULT_PREPARE_SECONDS;
  const warmupSeconds = Math.max(0, Math.floor(workout.warmupSeconds));
  const restBetweenRounds = Math.max(0, Math.floor(workout.restBetweenRounds));
  const cooldownSeconds = Math.max(0, Math.floor(workout.cooldownSeconds));

  if (prepareSeconds > 0) {
    steps.push({
      index: steps.length,
      phase: 'prepare',
      durationSeconds: prepareSeconds,
      durationMs: prepareSeconds * 1000,
      round: 1,
      totalRounds,
      nextExerciseId: firstExerciseId,
    });
  }

  if (warmupSeconds > 0) {
    steps.push({
      index: steps.length,
      phase: 'warmup',
      durationSeconds: warmupSeconds,
      durationMs: warmupSeconds * 1000,
      round: 1,
      totalRounds,
      nextExerciseId: firstExerciseId,
    });
  }

  for (let round = 1; round <= totalRounds; round++) {
    const isLastRound = round === totalRounds;

    for (let exIdx = 0; exIdx < validExercises.length; exIdx++) {
      const currentEx = validExercises[exIdx]!;
      const isLastExerciseInRound = exIdx === validExercises.length - 1;
      const workSeconds = Math.max(1, Math.floor(currentEx.workSeconds));
      const restSeconds = Math.max(0, Math.floor(currentEx.restSeconds));

      const nextWorkExerciseId = !isLastExerciseInRound
        ? validExercises[exIdx + 1]?.exerciseId
        : !isLastRound
          ? firstExerciseId
          : undefined;

      steps.push({
        index: steps.length,
        phase: 'work',
        durationSeconds: workSeconds,
        durationMs: workSeconds * 1000,
        exerciseId: currentEx.exerciseId,
        exerciseIndex: exIdx + 1,
        totalExercisesInRound: validExercises.length,
        round,
        totalRounds,
        nextExerciseId: nextWorkExerciseId,
      });

      if (!isLastExerciseInRound) {
        if (restSeconds > 0) {
          steps.push({
            index: steps.length,
            phase: 'rest',
            durationSeconds: restSeconds,
            durationMs: restSeconds * 1000,
            exerciseId: currentEx.exerciseId,
            exerciseIndex: exIdx + 1,
            totalExercisesInRound: validExercises.length,
            round,
            totalRounds,
            nextExerciseId: validExercises[exIdx + 1]?.exerciseId,
          });
        }
      } else if (!isLastRound && restBetweenRounds > 0) {
        steps.push({
          index: steps.length,
          phase: 'round-rest',
          durationSeconds: restBetweenRounds,
          durationMs: restBetweenRounds * 1000,
          round,
          totalRounds,
          nextExerciseId: firstExerciseId,
        });
      }
    }
  }

  if (cooldownSeconds > 0) {
    steps.push({
      index: steps.length,
      phase: 'cooldown',
      durationSeconds: cooldownSeconds,
      durationMs: cooldownSeconds * 1000,
      round: totalRounds,
      totalRounds,
    });
  }

  return steps;
}

export function calculateWorkoutSummary(workout: WorkoutPlanInput): WorkoutDurationSummary {
  const steps = resolveWorkoutTimeline(workout);

  let prepareSeconds = 0;
  let warmupSeconds = 0;
  let workSecondsTotal = 0;
  let restSecondsTotal = 0;
  let cooldownSeconds = 0;

  for (const step of steps) {
    switch (step.phase) {
      case 'prepare':
        prepareSeconds += step.durationSeconds;
        break;
      case 'warmup':
        warmupSeconds += step.durationSeconds;
        break;
      case 'work':
        workSecondsTotal += step.durationSeconds;
        break;
      case 'rest':
      case 'round-rest':
        restSecondsTotal += step.durationSeconds;
        break;
      case 'cooldown':
        cooldownSeconds += step.durationSeconds;
        break;
    }
  }

  const coreHiitSeconds = workSecondsTotal + restSecondsTotal;
  const totalSeconds = prepareSeconds + warmupSeconds + coreHiitSeconds + cooldownSeconds;

  return {
    prepareSeconds,
    warmupSeconds,
    coreHiitSeconds,
    workSecondsTotal,
    restSecondsTotal,
    cooldownSeconds,
    totalSeconds,
    totalSteps: steps.length,
  };
}
