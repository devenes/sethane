import type { WorkoutExerciseItem } from '../types';

export type WorkoutPhase =
  | 'idle'
  | 'prepare'
  | 'warmup'
  | 'work'
  | 'rest'
  | 'round-rest'
  | 'cooldown'
  | 'completed';

export type ActivePhase = Exclude<WorkoutPhase, 'idle' | 'completed'>;

export type SessionStatus = 'idle' | 'running' | 'paused' | 'completed';

export interface TimelineStep {
  index: number;
  phase: ActivePhase;
  durationSeconds: number;
  durationMs: number;
  exerciseId?: string;
  exerciseIndex?: number;
  totalExercisesInRound?: number;
  round?: number;
  totalRounds?: number;
  nextExerciseId?: string;
}

export interface WorkoutPlanInput {
  id: string;
  name: string;
  prepareSeconds?: number;
  warmupSeconds: number;
  rounds: number;
  restBetweenRounds: number;
  cooldownSeconds: number;
  exercises: WorkoutExerciseItem[];
}

export interface WorkoutDurationSummary {
  prepareSeconds: number;
  warmupSeconds: number;
  coreHiitSeconds: number;
  workSecondsTotal: number;
  restSecondsTotal: number;
  cooldownSeconds: number;
  totalSeconds: number;
  totalSteps: number;
}

export interface SessionMachineState {
  workoutId: string;
  workoutName: string;
  status: SessionStatus;
  steps: TimelineStep[];
  currentStepIndex: number;
  phase: WorkoutPhase;
  remainingMs: number;
  remainingSeconds: number;
  stepDurationMs: number;
  stepElapsedMs: number;
  totalDurationMs: number;
  totalElapsedMs: number;
  progressRatio: number;
  phaseDeadlineMs: number | null;
  lastAnnouncedCountdownSecond: number | null;
  completedStepIndices: number[];
}

export type EngineEvent =
  | {
      type: 'PHASE_CHANGED';
      step: TimelineStep;
      previousPhase: WorkoutPhase;
      skippedIntermediatePhases: number;
    }
  | {
      type: 'COUNTDOWN_TICK';
      secondsLeft: 1 | 2 | 3;
      step: TimelineStep;
    }
  | {
      type: 'WORKOUT_COMPLETED';
      workoutId: string;
      totalDurationMs: number;
    };
