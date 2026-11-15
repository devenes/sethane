import type { TimelineStep } from '../../engine/types';
import type { SupportedLocale } from '../../types';

export interface SpeechOptions {
  locale: SupportedLocale;
  voiceURI?: string | null;
  rate?: number;
  volume?: number;
}

class SpeechService {
  public isSupported(): boolean {
    return (
      typeof window !== 'undefined' &&
      'speechSynthesis' in window &&
      typeof window.SpeechSynthesisUtterance !== 'undefined'
    );
  }

  public getVoices(): SpeechSynthesisVoice[] {
    if (!this.isSupported()) {
      return [];
    }
    try {
      return window.speechSynthesis.getVoices();
    } catch {
      return [];
    }
  }

  public getVoicesForLocale(locale: SupportedLocale): SpeechSynthesisVoice[] {
    const allVoices = this.getVoices();
    const prefix = locale === 'tr' ? 'tr' : 'en';
    const matching = allVoices.filter((v) => v.lang.toLowerCase().startsWith(prefix));
    return matching.length > 0 ? matching : allVoices;
  }

  public cancel(): void {
    if (!this.isSupported()) {
      return;
    }
    try {
      window.speechSynthesis.cancel();
    } catch {
      // Ignore cancellation errors
    }
  }

  public speak(text: string, options: SpeechOptions): boolean {
    if (!this.isSupported() || !text.trim()) {
      return false;
    }
    try {
      window.speechSynthesis.cancel();
      const utterance = new window.SpeechSynthesisUtterance(text);
      utterance.lang = options.locale === 'tr' ? 'tr-TR' : 'en-US';
      utterance.rate = Math.max(0.7, Math.min(1.4, options.rate ?? 1.0));
      utterance.volume = Math.max(0, Math.min(1, options.volume ?? 1.0));

      const voices = this.getVoices();
      if (options.voiceURI) {
        const chosen = voices.find((v) => v.voiceURI === options.voiceURI);
        if (chosen) {
          utterance.voice = chosen;
        }
      } else {
        const prefix = options.locale === 'tr' ? 'tr' : 'en';
        const fallbackVoice = voices.find((v) => v.lang.toLowerCase().startsWith(prefix));
        if (fallbackVoice) {
          utterance.voice = fallbackVoice;
        }
      }

      window.speechSynthesis.speak(utterance);
      return true;
    } catch {
      return false;
    }
  }

  public buildPhaseAnnouncement(
    step: TimelineStep,
    locale: SupportedLocale,
    exerciseName?: string,
    nextExerciseName?: string
  ): string {
    if (locale === 'tr') {
      switch (step.phase) {
        case 'prepare':
          return nextExerciseName
            ? `Hazırlan. İlk hareket: ${nextExerciseName}`
            : 'Antrenman başlıyor, hazırlan.';
        case 'warmup':
          return 'Isınma zamanı. Vücudunu harekete hazırla.';
        case 'work':
          return exerciseName ? `Başla! ${exerciseName}` : 'Başla!';
        case 'rest':
          return nextExerciseName ? `Dinlen. Sıradaki: ${nextExerciseName}` : 'Dinlenme.';
        case 'round-rest':
          return nextExerciseName
            ? `Tur tamamlandı, dinlen. Yeni turda ilk hareket: ${nextExerciseName}`
            : 'Tur arası dinlenme.';
        case 'cooldown':
          return 'Soğuma ve esneme zamanı. Nefesini düzenle.';
      }
    }

    switch (step.phase) {
      case 'prepare':
        return nextExerciseName
          ? `Get ready. First up: ${nextExerciseName}`
          : 'Get ready to start.';
      case 'warmup':
        return 'Warm-up phase. Mobilize your joints.';
      case 'work':
        return exerciseName ? `Work! ${exerciseName}` : 'Work!';
      case 'rest':
        return nextExerciseName ? `Rest. Next up: ${nextExerciseName}` : 'Rest.';
      case 'round-rest':
        return nextExerciseName
          ? `Round complete. Rest. Next round starts with ${nextExerciseName}`
          : 'Round rest.';
      case 'cooldown':
        return 'Cooldown phase. Slow your breathing and stretch.';
    }
  }

  public buildCompletionAnnouncement(locale: SupportedLocale): string {
    return locale === 'tr'
      ? 'Antrenman tamamlandı! Harika iş çıkardın.'
      : 'Workout complete! Great job.';
  }
}

export const speechService = new SpeechService();
