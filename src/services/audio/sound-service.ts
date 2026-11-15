type AudioContextConstructor = typeof AudioContext;

function getAudioContextConstructor(): AudioContextConstructor | null {
  if (typeof window === 'undefined') {
    return null;
  }
  const win = window as unknown as {
    AudioContext?: AudioContextConstructor;
    webkitAudioContext?: AudioContextConstructor;
  };
  return win.AudioContext ?? win.webkitAudioContext ?? null;
}

class SoundService {
  private ctx: AudioContext | null = null;

  public isSupported(): boolean {
    return getAudioContextConstructor() !== null;
  }

  private getOrCreateContext(): AudioContext | null {
    if (this.ctx) {
      return this.ctx;
    }
    const Ctor = getAudioContextConstructor();
    if (!Ctor) {
      return null;
    }
    try {
      this.ctx = new Ctor();
      return this.ctx;
    } catch {
      return null;
    }
  }

  /**
   * Unlocks Web Audio API on user gesture (required by iOS Safari and mobile browsers).
   */
  public unlock(): void {
    const ctx = this.getOrCreateContext();
    if (!ctx) {
      return;
    }
    try {
      if (ctx.state === 'suspended') {
        void ctx.resume();
      }
      const buffer = ctx.createBuffer(1, 1, 22050);
      const source = ctx.createBufferSource();
      source.buffer = buffer;
      source.connect(ctx.destination);
      source.start(0);
    } catch {
      // Ignore audio unlock errors in restricted environments
    }
  }

  private playTone(
    frequency: number,
    durationSec: number,
    startOffsetSec = 0,
    volume = 0.7,
    type: OscillatorType = 'sine'
  ): void {
    const ctx = this.getOrCreateContext();
    if (!ctx) {
      return;
    }
    try {
      if (ctx.state === 'suspended') {
        void ctx.resume();
      }
      const startTime = ctx.currentTime + startOffsetSec;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(frequency, startTime);

      const safeVol = Math.max(0.01, Math.min(1, volume)) * 0.35;
      gain.gain.setValueAtTime(0.001, startTime);
      gain.gain.exponentialRampToValueAtTime(safeVol, startTime + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.0001, startTime + durationSec);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + durationSec + 0.02);
    } catch {
      // Fail gracefully if audio hardware is unavailable
    }
  }

  public playCountdownTick(volume = 0.8): void {
    this.playTone(660, 0.11, 0, volume, 'triangle');
  }

  public playWorkStart(volume = 0.8): void {
    this.playTone(880, 0.14, 0, volume, 'triangle');
    this.playTone(1174.66, 0.26, 0.15, volume, 'triangle');
  }

  public playRestStart(volume = 0.8): void {
    this.playTone(587.33, 0.16, 0, volume, 'sine');
    this.playTone(440, 0.24, 0.16, volume, 'sine');
  }

  public playWorkoutComplete(volume = 0.85): void {
    this.playTone(523.25, 0.14, 0, volume, 'triangle');
    this.playTone(659.25, 0.14, 0.15, volume, 'triangle');
    this.playTone(783.99, 0.14, 0.3, volume, 'triangle');
    this.playTone(1046.5, 0.38, 0.45, volume, 'triangle');
  }
}

export const soundService = new SoundService();
