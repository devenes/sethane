class WakeLockService {
  private sentinel: WakeLockSentinel | null = null;

  public isSupported(): boolean {
    return (
      typeof navigator !== 'undefined' &&
      'wakeLock' in navigator &&
      typeof navigator.wakeLock?.request === 'function'
    );
  }

  public isActive(): boolean {
    return this.sentinel !== null && !this.sentinel.released;
  }

  public async request(): Promise<boolean> {
    if (!this.isSupported()) {
      return false;
    }
    if (this.isActive()) {
      return true;
    }
    try {
      this.sentinel = await navigator.wakeLock.request('screen');
      this.sentinel.addEventListener('release', () => {
        this.sentinel = null;
      });
      return true;
    } catch {
      this.sentinel = null;
      return false;
    }
  }

  public async release(): Promise<void> {
    if (!this.sentinel) {
      return;
    }
    try {
      await this.sentinel.release();
    } catch {
      // Ignore release errors
    } finally {
      this.sentinel = null;
    }
  }
}

export const wakeLockService = new WakeLockService();
