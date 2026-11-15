import {
  advanceByTime,
  createInitialSessionState,
  pauseSession,
  previousStep,
  restartSession,
  resumeSession,
  skipStep,
  startSession,
  stopSession,
} from './session-machine';
import type { EngineEvent, SessionMachineState, WorkoutPlanInput } from './types';

export interface TimerEngineCallbacks {
  onStateChange?: (state: SessionMachineState) => void;
  onEvent?: (event: EngineEvent, state: SessionMachineState) => void;
}

export interface TimerEngineOptions {
  now?: () => number;
  tickIntervalMs?: number;
  callbacks?: TimerEngineCallbacks;
}

export class WorkoutTimerEngine {
  private state: SessionMachineState;
  private readonly now: () => number;
  private readonly tickIntervalMs: number;
  private callbacks: TimerEngineCallbacks;
  private intervalId: ReturnType<typeof setInterval> | null = null;

  constructor(workout: WorkoutPlanInput, options: TimerEngineOptions = {}) {
    this.now = options.now ?? (() => Date.now());
    this.tickIntervalMs = options.tickIntervalMs ?? 100;
    this.callbacks = options.callbacks ?? {};
    this.state = createInitialSessionState(workout);
  }

  public getState(): SessionMachineState {
    return this.state;
  }

  public setCallbacks(callbacks: TimerEngineCallbacks): void {
    this.callbacks = callbacks;
  }

  public loadWorkout(workout: WorkoutPlanInput): SessionMachineState {
    this.clearTicker();
    this.state = createInitialSessionState(workout);
    this.notifyState();
    return this.state;
  }

  public start(): SessionMachineState {
    const { state, events } = startSession(this.state, this.now());
    this.state = state;
    this.notifyState();
    this.emitEvents(events);
    if (this.state.status === 'running') {
      this.startTicker();
    }
    return this.state;
  }

  public pause(): SessionMachineState {
    this.clearTicker();
    this.state = pauseSession(this.state, this.now());
    this.notifyState();
    return this.state;
  }

  public resume(): SessionMachineState {
    this.state = resumeSession(this.state, this.now());
    this.notifyState();
    if (this.state.status === 'running') {
      this.startTicker();
    }
    return this.state;
  }

  public skip(): SessionMachineState {
    const { state, events } = skipStep(this.state, this.now());
    this.state = state;
    if (this.state.status !== 'running') {
      this.clearTicker();
    }
    this.notifyState();
    this.emitEvents(events);
    return this.state;
  }

  public previous(): SessionMachineState {
    const { state, events } = previousStep(this.state, this.now());
    this.state = state;
    if (this.state.status === 'running') {
      this.startTicker();
    }
    this.notifyState();
    this.emitEvents(events);
    return this.state;
  }

  public restart(): SessionMachineState {
    const { state, events } = restartSession(this.state, this.now());
    this.state = state;
    this.notifyState();
    this.emitEvents(events);
    if (this.state.status === 'running') {
      this.startTicker();
    }
    return this.state;
  }

  public stop(): SessionMachineState {
    this.clearTicker();
    this.state = stopSession(this.state);
    this.notifyState();
    return this.state;
  }

  /**
   * Resynchronizes the timer against the current clock timestamp.
   * Safe to call on every interval tick or when a backgrounded tab becomes visible again.
   */
  public tick(): SessionMachineState {
    if (this.state.status !== 'running') {
      return this.state;
    }
    const { state, events } = advanceByTime(this.state, this.now());
    this.state = state;
    if (this.state.status !== 'running') {
      this.clearTicker();
    }
    this.notifyState();
    this.emitEvents(events);
    return this.state;
  }

  public destroy(): void {
    this.clearTicker();
  }

  private startTicker(): void {
    this.clearTicker();
    this.intervalId = setInterval(() => {
      this.tick();
    }, this.tickIntervalMs);
  }

  private clearTicker(): void {
    if (this.intervalId !== null) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  private notifyState(): void {
    this.callbacks.onStateChange?.(this.state);
  }

  private emitEvents(events: EngineEvent[]): void {
    for (const event of events) {
      this.callbacks.onEvent?.(event, this.state);
    }
  }
}
