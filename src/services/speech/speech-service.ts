import type { TimelineStep } from '../../engine/types';
import type { SupportedLocale } from '../../types';

export interface SpeechOptions {
  locale: SupportedLocale;
  voiceURI?: string | null;
  rate?: number;
  volume?: number;
}

/**
 * Maps catalog display names (`Exercise.name.tr`) to natural, fluent Turkish
 * spoken phrases so Turkish TTS engines (macOS/iOS Yelda, Google Türkçe,
 * Microsoft Emel/Ahmet, Android TTS) pronounce every movement clearly without
 * spelling out English loanwords in broken phonetics or switching to an
 * English synthesizer mid-sentence.
 */
const TURKISH_SPOKEN_EXERCISE_NAMES: Record<string, string> = {
  'Dambıl Thruster (Squat + Pres)': 'Dambıl Skuat ve Omuz Pres',
  'Dağ Tırmanışı': 'Dağ Tırmanışı',
  'Rumen Deadlift ve Sırt Çekiş': 'Rumen Dedlift ve Sırt Çekiş',
  'Patenci Sıçrayışı': 'Patenci Sıçrayışı',
  'Geriye Hamle ve Diz Çekiş': 'Geriye Hamle ve Diz Çekiş',
  Burpee: 'Börpi',
  'Şınav (Push-Up)': 'Şınav',
  'Vücut Ağırlığı Squat': 'Vücut Ağırlığı Skuat',
  'Ön Kol Plank Duruşu': 'Ön Kol Plank Duruşu',
  'Jumping Jack (Yıldız Sıçrayışı)': 'Yıldız Sıçrayışı',
  'Dambıl Goblet Squat': 'Dambıl Goblet Skuat',
  'Bisiklet Mekik': 'Bisiklet Mekik',
  'Kalça Köprüsü (Glute Bridge)': 'Kalça Köprüsü',
  'Yüksek Diz Koşusu (High Knees)': 'Yüksek Diz Koşusu',
  'Plank Pozisyonunda Dambıl Çekiş': 'Plank Pozisyonunda Dambıl Çekiş',
  'Rus Dönüşü (Russian Twist)': 'Rus Dönüşü',
  'Hızlı Gölge Boksu': 'Hızlı Gölge Boksu',
  'Solucan Yürüyüşü (Inchworm)': 'Solucan Yürüyüşü',
  'Dambıl Omuz Pres': 'Dambıl Omuz Pres',
  'Makas Tekme (Flutter Kicks)': 'Makas Tekme',
  'Sıçramasız Step Jack': 'Sıçramasız Yıldız Adımı',
  'Plank Omuz Dokunuşu': 'Plank Omuz Dokunuşu',
  'Sumo Squat Yaylanma (Pulse)': 'Sumo Skuat Yaylanma',
  'Dambıl Biceps Curl ve Omuz Pres': 'Dambıl Pazu Bükme ve Omuz Pres',
  'Yerde Dambıl Göğüs Pres': 'Yerde Dambıl Göğüs Pres',
  'Elmas Şınav (Triceps & İç Göğüs)': 'Elmas Şınav',
  'Eğilerek Dambıl Sırt Çekiş': 'Eğilerek Dambıl Sırt Çekiş',
  'Yüzüstü Superman Sırt Çekiş': 'Yüzüstü Süpermen Sırt Çekiş',
  'Dambıl Yana Açış (Yan Omuz)': 'Dambıl Yana Açış',
  'Baş Üstü Dambıl Triceps Ekstansiyon': 'Baş Üstü Dambıl Arka Kol Açış',
  'Alternatif Yan Lunge (Yan Hamle)': 'Alternatif Yan Hamle',
  'Dead Bug (Derin Core Stabilizasyon)': 'Derin Karın Stabilizasyon',
};

const TURKISH_PHONETIC_WORD_RULES: ReadonlyArray< readonly [RegExp, string] > = [
  [/\bpush[-\s]?ups?\b/gi, 'şınav'],
  [/\bglute\s+bridges?\b/gi, 'kalça köprüsü'],
  [/\bhigh\s+knees\b/gi, 'yüksek diz koşusu'],
  [/\brussian\s+twists?\b/gi, 'rus dönüşü'],
  [/\binchworms?\b/gi, 'solucan yürüyüşü'],
  [/\bflutter\s+kicks?\b/gi, 'makas tekme'],
  [/\bjumping\s+jacks?\b/gi, 'yıldız sıçrayışı'],
  [/\bstep\s+jacks?\b/gi, 'yıldız adımı'],
  [/\bdead\s+bugs?\b/gi, 'ters böcek'],
  [/\bbiceps?\s+curls?\b/gi, 'pazu bükme'],
  [/\btriceps?\b/gi, 'arka kol'],
  [/\bdeadlifts?\b/gi, 'dedlift'],
  [/\bburpees?\b/gi, 'börpi'],
  [/\bsquats?\b/gi, 'skuat'],
  [/\bthrusters?\b/gi, 'trastır'],
  [/\blunges?\b/gi, 'hamle'],
  [/\bpulses?\b/gi, 'yaylanma'],
  [/\bsuperman\b/gi, 'süpermen'],
  [/\bdumbbells?\b/gi, 'dambıl'],
  [/\bcore\b/gi, 'karın'],
  [/\bhiit\b/gi, 'hit'],
];

const NOVELTY_ENGLISH_VOICE_NAMES = new Set([
  'albert',
  'bad news',
  'bahh',
  'bells',
  'boing',
  'bubbles',
  'cellos',
  'good news',
  'jester',
  'organ',
  'superstar',
  'trinoids',
  'whisper',
  'wobble',
  'zarvox',
]);

export function formatExerciseNameForSpeech(
  name: string | undefined,
  locale: SupportedLocale
): string | undefined {
  if (!name) {
    return undefined;
  }
  const trimmed = name.trim();
  if (!trimmed || locale !== 'tr') {
    return trimmed || undefined;
  }

  const mapped = TURKISH_SPOKEN_EXERCISE_NAMES[trimmed];
  if (mapped) {
    return mapped;
  }

  return normalizeTurkishSpeechText(trimmed);
}

export function normalizeTurkishSpeechText(text: string): string {
  let result = text;

  for (const [catalogName, spokenName] of Object.entries(TURKISH_SPOKEN_EXERCISE_NAMES)) {
    if (result.includes(catalogName)) {
      result = result.split(catalogName).join(spokenName);
    }
  }

  // Strip parenthetical English/auxiliary notes if the main phrase before parentheses exists
  result = result.replace(/\s*\([^)]*\)/g, '');
  result = result.replace(/\s*[+&]\s*/g, ' ve ');

  for (const [pattern, replacement] of TURKISH_PHONETIC_WORD_RULES) {
    result = result.replace(pattern, replacement);
  }

  return result.replace(/\s{2,}/g, ' ').trim();
}

class SpeechService {
  private cachedVoices: SpeechSynthesisVoice[] = [];
  private listeners = new Set<() => void>();
  private voicesListenerAttached = false;
  private activeUtterance: SpeechSynthesisUtterance | null = null;
  private lastSpokenRequest: {
    text: string;
    options: SpeechOptions;
    hadMatchingVoice: boolean;
  } | null = null;

  constructor() {
    this.warmup();
  }

  public isSupported(): boolean {
    return (
      typeof window !== 'undefined' &&
      'speechSynthesis' in window &&
      typeof window.SpeechSynthesisUtterance !== 'undefined'
    );
  }

  public warmup(): void {
    if (!this.isSupported()) {
      return;
    }
    try {
      const initial = window.speechSynthesis.getVoices();
      if (initial.length > 0) {
        this.cachedVoices = initial;
      }
      this.ensureVoicesChangedListener();
    } catch {
      // Ignore browser speech synthesis initialization errors
    }
  }

  private ensureVoicesChangedListener(): void {
    if (this.voicesListenerAttached || !this.isSupported()) {
      return;
    }
    this.voicesListenerAttached = true;

    const handleVoicesChanged = () => {
      try {
        const latest = window.speechSynthesis.getVoices();
        if (latest.length > 0) {
          this.cachedVoices = latest;
        }
        for (const listener of this.listeners) {
          listener();
        }

        // If an utterance was started before voices finished loading (and therefore
        // fell back to the browser's default English voice), re-speak with the proper
        // locale voice as soon as voices become available.
        if (
          this.lastSpokenRequest &&
          !this.lastSpokenRequest.hadMatchingVoice &&
          (window.speechSynthesis.speaking || window.speechSynthesis.pending)
        ) {
          const matching = this.pickBestVoiceForLocale(
            this.lastSpokenRequest.options.locale,
            latest,
            this.lastSpokenRequest.options.voiceURI
          );
          if (matching) {
            const { text, options } = this.lastSpokenRequest;
            this.lastSpokenRequest = null;
            this.speak(text, options);
          }
        }
      } catch {
        // Ignore callback errors
      }
    };

    try {
      if (typeof window.speechSynthesis.addEventListener === 'function') {
        window.speechSynthesis.addEventListener('voiceschanged', handleVoicesChanged);
      } else {
        window.speechSynthesis.onvoiceschanged = handleVoicesChanged;
      }
    } catch {
      // Ignore listener attachment errors
    }
  }

  public subscribeVoicesChanged(listener: () => void): () => void {
    this.listeners.add(listener);
    this.warmup();
    return () => {
      this.listeners.delete(listener);
    };
  }

  public getVoices(): SpeechSynthesisVoice[] {
    if (!this.isSupported()) {
      return [];
    }
    try {
      this.ensureVoicesChangedListener();
      const liveVoices = window.speechSynthesis.getVoices();
      if (liveVoices.length > 0) {
        this.cachedVoices = liveVoices;
        return liveVoices;
      }
      return this.cachedVoices;
    } catch {
      return this.cachedVoices;
    }
  }

  public isVoiceMatchingLocale(voice: SpeechSynthesisVoice, locale: SupportedLocale): boolean {
    const normalizedLang = (voice.lang ?? '').trim().toLowerCase().replace(/_/g, '-');
    const normalizedName = `${voice.name ?? ''} ${voice.voiceURI ?? ''}`.toLowerCase();

    if (locale === 'tr') {
      if (
        normalizedLang === 'tr' ||
        normalizedLang.startsWith('tr-') ||
        normalizedLang === 'tur' ||
        normalizedLang.startsWith('tur-')
      ) {
        return true;
      }
      return (
        normalizedName.includes('türkçe') ||
        normalizedName.includes('turkce') ||
        normalizedName.includes('turkish') ||
        normalizedName.includes('türkiye') ||
        normalizedName.includes('turkiye') ||
        normalizedName.includes('yelda') ||
        normalizedName.includes('cem') ||
        normalizedName.includes('emel') ||
        normalizedName.includes('ahmet') ||
        normalizedName.includes('filiz')
      );
    }

    return (
      normalizedLang === 'en' ||
      normalizedLang.startsWith('en-') ||
      normalizedLang === 'eng' ||
      normalizedLang.startsWith('eng-')
    );
  }

  private scoreVoiceForLocale(voice: SpeechSynthesisVoice, locale: SupportedLocale): number {
    if (!this.isVoiceMatchingLocale(voice, locale)) {
      return -1000;
    }

    const lang = (voice.lang ?? '').trim().toLowerCase().replace(/_/g, '-');
    const name = (voice.name ?? '').trim().toLowerCase();
    let score = 100;

    if (locale === 'tr') {
      if (lang === 'tr-tr') score += 40;
      else if (lang.startsWith('tr')) score += 25;

      if (name.includes('natural') || name.includes('neural')) score += 35;
      if (name.includes('enhanced') || name.includes('premium') || name.includes('siri')) {
        score += 30;
      }
      if (
        name.includes('yelda') ||
        name.includes('emel') ||
        name.includes('ahmet') ||
        name.includes('google türkçe') ||
        name.includes('google turkce') ||
        name.includes('filiz') ||
        name.includes('cem')
      ) {
        score += 25;
      }
      if (voice.localService) score += 10;
      if (voice.default) score += 5;
      return score;
    }

    // English voice scoring
    if (NOVELTY_ENGLISH_VOICE_NAMES.has(name)) {
      return 1;
    }
    if (lang === 'en-us') score += 35;
    else if (lang === 'en-gb') score += 30;
    else if (lang.startsWith('en-')) score += 20;

    if (name.includes('natural') || name.includes('neural')) score += 30;
    if (name.includes('enhanced') || name.includes('premium') || name.includes('siri')) {
      score += 25;
    }
    if (
      name.includes('samantha') ||
      name.includes('google us english') ||
      name.includes('ava') ||
      name.includes('allison') ||
      name.includes('alex') ||
      name.includes('daniel') ||
      name.includes('karen')
    ) {
      score += 20;
    }
    if (voice.default) score += 15;
    if (voice.localService) score += 10;

    return score;
  }

  public getVoicesForLocale(locale: SupportedLocale): SpeechSynthesisVoice[] {
    const allVoices = this.getVoices();
    const matching = allVoices.filter((v) => this.isVoiceMatchingLocale(v, locale));
    return [...matching].sort(
      (a, b) => this.scoreVoiceForLocale(b, locale) - this.scoreVoiceForLocale(a, locale)
    );
  }

  public pickBestVoiceForLocale(
    locale: SupportedLocale,
    voices: SpeechSynthesisVoice[] = this.getVoices(),
    preferredVoiceURI?: string | null
  ): SpeechSynthesisVoice | undefined {
    if (preferredVoiceURI) {
      const explicit = voices.find((v) => v.voiceURI === preferredVoiceURI);
      if (explicit && this.isVoiceMatchingLocale(explicit, locale)) {
        return explicit;
      }
    }

    const matching = voices
      .filter((v) => this.isVoiceMatchingLocale(v, locale))
      .sort((a, b) => this.scoreVoiceForLocale(b, locale) - this.scoreVoiceForLocale(a, locale));

    return matching[0];
  }

  private normalizeLangTag(rawLang: string | undefined, locale: SupportedLocale): string {
    const fallback = locale === 'tr' ? 'tr-TR' : 'en-US';
    if (!rawLang) {
      return fallback;
    }
    const cleaned = rawLang.trim().replace(/_/g, '-');
    if (locale === 'tr') {
      return cleaned.toLowerCase().startsWith('tr') ? 'tr-TR' : fallback;
    }
    return cleaned.toLowerCase().startsWith('en') ? cleaned : fallback;
  }

  public cancel(): void {
    this.lastSpokenRequest = null;
    this.activeUtterance = null;
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
      const spokenText =
        options.locale === 'tr' ? normalizeTurkishSpeechText(text) : text.trim();

      if (
        window.speechSynthesis.speaking === undefined ||
        window.speechSynthesis.speaking ||
        window.speechSynthesis.pending
      ) {
        window.speechSynthesis.cancel();
      }
      if (window.speechSynthesis.paused && typeof window.speechSynthesis.resume === 'function') {
        window.speechSynthesis.resume();
      }

      const utterance = new window.SpeechSynthesisUtterance(spokenText);
      utterance.rate = Math.max(0.7, Math.min(1.4, options.rate ?? 1.0));
      utterance.volume = Math.max(0, Math.min(1, options.volume ?? 1.0));

      const voices = this.getVoices();
      const selectedVoice = this.pickBestVoiceForLocale(
        options.locale,
        voices,
        options.voiceURI
      );

      if (selectedVoice) {
        utterance.voice = selectedVoice;
        utterance.lang = this.normalizeLangTag(selectedVoice.lang, options.locale);
      } else {
        utterance.lang = options.locale === 'tr' ? 'tr-TR' : 'en-US';
      }

      this.activeUtterance = utterance;
      this.lastSpokenRequest = {
        text,
        options,
        hadMatchingVoice: Boolean(selectedVoice),
      };

      utterance.onend = () => {
        if (this.activeUtterance === utterance) {
          this.activeUtterance = null;
          this.lastSpokenRequest = null;
        }
      };
      utterance.onerror = () => {
        if (this.activeUtterance === utterance) {
          this.activeUtterance = null;
        }
      };

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
      const spokenCurrent = formatExerciseNameForSpeech(exerciseName, 'tr');
      const spokenNext = formatExerciseNameForSpeech(nextExerciseName, 'tr');

      switch (step.phase) {
        case 'prepare':
          return spokenNext
            ? `Hazırlan. İlk hareket: ${spokenNext}`
            : 'Antrenman başlıyor, hazırlan.';
        case 'warmup':
          return 'Isınma zamanı. Vücudunu harekete hazırla.';
        case 'work':
          return spokenCurrent ? `Başla! ${spokenCurrent}` : 'Başla!';
        case 'rest':
          return spokenNext ? `Dinlen. Sıradaki: ${spokenNext}` : 'Dinlenme.';
        case 'round-rest':
          return spokenNext
            ? `Tur tamamlandı, dinlen. Yeni turda ilk hareket: ${spokenNext}`
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
