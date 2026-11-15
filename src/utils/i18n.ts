import type {
  DifficultyLevel,
  EquipmentType,
  ExerciseCategory,
  MuscleGroup,
  SupportedLocale,
} from '../types';
import type { WorkoutPhase } from '../engine/types';

export const UI_STRINGS = {
  en: {
    nav: {
      dashboard: 'Dashboard',
      workouts: 'Workouts',
      exercises: 'Exercises',
      builder: 'Builder',
      settings: 'Settings',
      skipToMain: 'Skip to main content',
    },
    dashboard: {
      heroBadge: '100% Free · Offline-First · Local Storage',
      heroTitle: 'Train Smarter with Guided HIIT Intervals',
      heroSubtitle:
        'Visual exercise coaching, precision deadline timer, and custom workout builder—all running privately in your browser.',
      startSignature: 'Start 10-Min Full Body HIIT',
      quickTimerBtn: 'Quick HIIT Timer',
      createCustomBtn: 'Create Workout',
      browseExercisesBtn: 'Exercise Library',
      featuredTitle: 'Featured Workout Programs',
      myWorkoutsTitle: 'My Custom Workouts',
      recentTitle: 'Recent Sessions',
      noCustomWorkouts: 'You have not created any custom workouts yet.',
      noRecentHistory: 'Complete your first workout session to track history locally.',
      statsWorkoutsDone: 'Completed Sessions',
      statsTotalMinutes: 'Total Active Minutes',
      statsCustomCount: 'Custom Programs',
      coreHiitLabel: 'Core HIIT',
      totalTimeLabel: 'Total w/ Warm-up',
      roundsLabel: 'Rounds',
      exercisesLabel: 'Exercises',
      startNow: 'Start Workout',
      skipWarmupStart: 'Start (No Warm-up)',
      customizeCopy: 'Customize',
    },
    quickTimer: {
      title: 'Quick HIIT Interval Timer',
      subtitle: 'Launch an instant interval timer without creating a full exercise list.',
      workSeconds: 'Work Interval (sec)',
      restSeconds: 'Rest Interval (sec)',
      rounds: 'Rounds',
      prepareSeconds: 'Prepare Countdown (sec)',
      launch: 'Launch Quick Timer',
      cancel: 'Cancel',
    },
    player: {
      phasePrepare: 'GET READY',
      phaseWarmup: 'WARM-UP',
      phaseWork: 'WORK',
      phaseRest: 'REST',
      phaseRoundRest: 'ROUND RECOVERY',
      phaseCooldown: 'COOLDOWN',
      phaseCompleted: 'COMPLETED',
      phaseIdle: 'READY',
      roundCounter: 'Round',
      exerciseCounter: 'Exercise',
      upNext: 'Up Next',
      finalInterval: 'Final Stretch',
      start: 'Start',
      pause: 'Pause',
      resume: 'Resume',
      restart: 'Restart',
      skip: 'Skip Phase',
      previous: 'Previous',
      stop: 'Exit Workout',
      fullscreen: 'Fullscreen',
      exitFullscreen: 'Exit Fullscreen',
      soundOn: 'Sound On',
      soundOff: 'Muted',
      voiceOn: 'Voice On',
      voiceOff: 'Voice Off',
      wakeLockActive: 'Screen Awake',
      completedHeadline: 'Workout Completed!',
      completedSub: 'Session saved to your local browser history.',
      playAgain: 'Run Again',
      backToDashboard: 'Back to Dashboard',
      formTips: 'Form Coaching',
      iosBackgroundNote:
        'Note: Keep SetHane in the foreground for uninterrupted voice cues on mobile browsers. If backgrounded, the timer automatically resynchronizes via hardware timestamps upon return.',
    },
    exercises: {
      title: 'Visual Exercise Library',
      subtitle:
        'Explore 24 animated movement guides with step-by-step form coaching, common mistakes, and low-impact regressions.',
      searchPlaceholder: 'Search exercise name or muscle group...',
      allCategories: 'All Categories',
      allEquipment: 'All Equipment',
      allDifficulty: 'All Levels',
      viewDetails: 'Form Guide',
      instructionsTitle: 'Step-by-Step Execution',
      mistakesTitle: 'Common Mistakes to Avoid',
      easierTitle: 'Easier / Low-Impact Variation',
      defaultTiming: 'Recommended Interval',
      closeDialog: 'Close',
      resultsCount: 'exercises shown',
      pauseAnimations: 'Pause Animations',
      playAnimations: 'Play Animations',
    },
    builder: {
      title: 'Workout Builder',
      subtitle:
        'Design custom HIIT circuits, reorder exercises via drag-and-drop or keyboard, and save directly to IndexedDB.',
      workoutNameLabel: 'Workout Name',
      workoutNamePlaceholder: 'e.g. Morning Kettlebell & Core Blast',
      roundsLabel: 'Rounds',
      restBetweenRoundsLabel: 'Rest Between Rounds (sec)',
      warmupLabel: 'Warm-up Duration (sec)',
      cooldownLabel: 'Cooldown Duration (sec)',
      prepareLabel: 'Prepare Countdown (sec)',
      addExercisesHeading: 'Add Exercises from Catalog',
      selectedExercisesHeading: 'Workout Sequence',
      workSec: 'Work (s)',
      restSec: 'Rest (s)',
      lastExerciseNoRestNote: 'Final exercise in round (transitions directly to Round Rest / Cooldown)',
      moveUp: 'Move exercise up',
      moveDown: 'Move exercise down',
      removeExercise: 'Remove exercise',
      saveWorkout: 'Save Workout',
      saveAndStart: 'Save & Start Now',
      resetForm: 'Reset',
      summaryCoreHiit: 'Active HIIT Time',
      summaryTotalTime: 'Total Session Time',
      summaryTotalSteps: 'Total Timeline Phases',
      loadPresetLabel: 'Load from Preset Template',
      savedSuccess: 'Workout saved locally!',
      emptySequenceWarning: 'Add at least one exercise to save your workout.',
    },
    workoutsPage: {
      title: 'Workout Programs',
      subtitle: 'Start a ready-made HIIT template or manage your custom local programs.',
      presetsHeading: 'Bundled Preset Programs',
      customHeading: 'My Local Workouts',
      editBtn: 'Edit',
      duplicateBtn: 'Duplicate',
      deleteBtn: 'Delete',
      confirmDeleteTitle: 'Delete Custom Workout?',
      confirmDeleteBody: 'This workout will be permanently removed from your browser storage.',
      cancelBtn: 'Cancel',
      confirmDeleteBtn: 'Delete Workout',
    },
    settings: {
      title: 'Settings & Local Data Backup',
      subtitle:
        'Configure language, theme, audio/speech preferences, and export or import your local IndexedDB data as JSON.',
      appearanceHeading: 'Language & Appearance',
      languageLabel: 'Interface Language',
      themeLabel: 'Color Scheme',
      themeSystem: 'System Default',
      themeLight: 'Light Mode',
      themeDark: 'Dark Mode',
      audioHeading: 'Audio & Voice Coaching',
      soundToggle: 'Interval Beep Effects (Web Audio API)',
      countdownToggle: '3-2-1 Countdown Ticks',
      speechToggle: 'Spoken Exercise & Phase Announcements (Web Speech API)',
      wakeLockToggle: 'Keep Screen Awake During Workouts (Wake Lock API)',
      voiceSelectLabel: 'System Speech Voice',
      voiceAuto: 'Automatic (Match Language)',
      testAudioBtn: 'Test Sound & Voice',
      backupHeading: 'Local Data Backup (JSON Export / Import)',
      backupDescription:
        'All your custom workouts, settings, and completion history remain 100% on your device. Export a JSON snapshot anytime to back up or transfer between devices.',
      exportBtn: 'Export JSON Backup',
      importMergeBtn: 'Import & Merge JSON',
      importReplaceBtn: 'Import & Replace All',
      clearHistoryBtn: 'Clear Workout History',
      importSuccess: 'Backup imported successfully!',
      historyCleared: 'Workout history cleared.',
    },
  },
  tr: {
    nav: {
      dashboard: 'Panel',
      workouts: 'Programlar',
      exercises: 'Hareketler',
      builder: 'Oluşturucu',
      settings: 'Ayarlar',
      skipToMain: 'Ana içeriğe atla',
    },
    dashboard: {
      heroBadge: '%100 Ücretsiz · Çevrimdışı PWA · Tarayıcı İçi Kayıt',
      heroTitle: 'Sesli ve Görsel Rehberli Akıllı HIIT Antrenmanı',
      heroSubtitle:
        'Görsel hareket kütüphanesi, milisaniye hassasiyetli interval zamanlayıcı ve antrenman oluşturucu — tamamen cihazınızda çalışır.',
      startSignature: '10 Dk Tam Vücut HIIT Başlat',
      quickTimerBtn: 'Hızlı HIIT Sayaç',
      createCustomBtn: 'Kendi Programını Oluştur',
      browseExercisesBtn: 'Hareket Kütüphanesi',
      featuredTitle: 'Hazır Antrenman Programları',
      myWorkoutsTitle: 'Kendi Antrenmanlarım',
      recentTitle: 'Son Tamamlanan Antrenmanlar',
      noCustomWorkouts: 'Henüz özel bir antrenman programı oluşturmadınız.',
      noRecentHistory: 'Geçmişinizi burada görmek için ilk antrenmanınızı tamamlayın.',
      statsWorkoutsDone: 'Tamamlanan Antrenman',
      statsTotalMinutes: 'Toplam Aktif Dakika',
      statsCustomCount: 'Özel Program',
      coreHiitLabel: 'Net HIIT',
      totalTimeLabel: 'Isınma Dahil Toplam',
      roundsLabel: 'Tur',
      exercisesLabel: 'Hareket',
      startNow: 'Antrenmanı Başlat',
      skipWarmupStart: 'Isınmasız Başlat',
      customizeCopy: 'Özelleştir',
    },
    quickTimer: {
      title: 'Hızlı HIIT Zamanlayıcı',
      subtitle: 'Hareket listesi seçmeden anında özel sürelerle interval sayacını başlatın.',
      workSeconds: 'Çalışma Süresi (sn)',
      restSeconds: 'Dinlenme Süresi (sn)',
      rounds: 'Tur Sayısı',
      prepareSeconds: 'Hazırlık Geri Sayımı (sn)',
      launch: 'Sayacı Başlat',
      cancel: 'İptal',
    },
    player: {
      phasePrepare: 'HAZIRLAN',
      phaseWarmup: 'ISINMA',
      phaseWork: 'ÇALIŞ',
      phaseRest: 'DİNLEN',
      phaseRoundRest: 'TUR ARASI MOLA',
      phaseCooldown: 'SOĞUMA',
      phaseCompleted: 'TAMAMLANDI',
      phaseIdle: 'HAZIR',
      roundCounter: 'Tur',
      exerciseCounter: 'Hareket',
      upNext: 'Sıradaki Hareket',
      finalInterval: 'Son Bölüm',
      start: 'Başlat',
      pause: 'Duraklat',
      resume: 'Devam Et',
      restart: 'Baştan Başlat',
      skip: 'Fazı Atla',
      previous: 'Önceki',
      stop: 'Antrenmandan Çık',
      fullscreen: 'Tam Ekran',
      exitFullscreen: 'Tam Ekrandan Çık',
      soundOn: 'Ses Açık',
      soundOff: 'Ses Kapalı',
      voiceOn: 'Anons Açık',
      voiceOff: 'Anons Kapalı',
      wakeLockActive: 'Ekran Açık Kalır',
      completedHeadline: 'Antrenman Tamamlandı!',
      completedSub: 'Antrenman kaydı tarayıcı geçmişinize eklendi.',
      playAgain: 'Tekrar Çalıştır',
      backToDashboard: 'Panele Dön',
      formTips: 'Hareket İpuçları',
      iosBackgroundNote:
        'Not: Mobil tarayıcılarda kesintisiz sesli anons için ekranı açık tutun. Sekme arka plana geçip döndüğünde sayaç gerçek zaman damgasıyla otomatik senkronize olur.',
    },
    exercises: {
      title: 'Görsel Hareket Kütüphanesi',
      subtitle:
        'Adım adım uygulanış, sık yapılan hatalar ve düşük etkili alternatifleriyle 24 hareketli GIF animasyonlu egzersiz.',
      searchPlaceholder: 'Hareket adı veya kas grubu ara...',
      allCategories: 'Tüm Kategoriler',
      allEquipment: 'Tüm Ekipmanlar',
      allDifficulty: 'Tüm Seviyeler',
      viewDetails: 'Hareket Rehberi',
      instructionsTitle: 'Adım Adım Uygulanış',
      mistakesTitle: 'Sık Yapılan Hatalar',
      easierTitle: 'Daha Kolay / Düşük Etkili Varyasyon',
      defaultTiming: 'Önerilen Süre',
      closeDialog: 'Kapat',
      resultsCount: 'hareket listeleniyor',
      pauseAnimations: 'Animasyonları Duraklat',
      playAnimations: 'Animasyonları Oynat',
    },
    builder: {
      title: 'Antrenman Oluşturucu',
      subtitle:
        'Kendi HIIT programınızı tasarlayın, sürükle-bırak veya klavye ile sıralayın ve tarayıcınıza (IndexedDB) kaydedin.',
      workoutNameLabel: 'Program Adı',
      workoutNamePlaceholder: 'Örn: Sabah Tam Vücut & Core Serisi',
      roundsLabel: 'Tur Sayısı',
      restBetweenRoundsLabel: 'Turlar Arası Dinlenme (sn)',
      warmupLabel: 'Isınma Süresi (sn)',
      cooldownLabel: 'Soğuma Süresi (sn)',
      prepareLabel: 'Hazırlık Süresi (sn)',
      addExercisesHeading: 'Katalogdan Hareket Ekle',
      selectedExercisesHeading: 'Antrenman Akışı',
      workSec: 'Çalışma (sn)',
      restSec: 'Dinlenme (sn)',
      lastExerciseNoRestNote: 'Turun son hareketi (gereksiz dinlenme olmadan doğrudan tur molasına/soğumaya geçer)',
      moveUp: 'Hareketi yukarı taşı',
      moveDown: 'Hareketi aşağı taşı',
      removeExercise: 'Hareketi kaldır',
      saveWorkout: 'Programı Kaydet',
      saveAndStart: 'Kaydet ve Başlat',
      resetForm: 'Sıfırla',
      summaryCoreHiit: 'Net HIIT Süresi',
      summaryTotalTime: 'Toplam Oturum Süresi',
      summaryTotalSteps: 'Toplam Faz Adımı',
      loadPresetLabel: 'Hazır Şablondan Yükle',
      savedSuccess: 'Program yerel olarak kaydedildi!',
      emptySequenceWarning: 'Kaydetmek için en az bir hareket ekleyin.',
    },
    workoutsPage: {
      title: 'Antrenman Programları',
      subtitle: 'Hazır HIIT şablonlarını başlatın veya kendi oluşturduğunuz programları yönetin.',
      presetsHeading: 'Hazır Antrenman Şablonları',
      customHeading: 'Kendi Oluşturduğum Programlar',
      editBtn: 'Düzenle',
      duplicateBtn: 'Kopyala',
      deleteBtn: 'Sil',
      confirmDeleteTitle: 'Program Silinsin mi?',
      confirmDeleteBody: 'Bu antrenman tarayıcı hafızanızdan kalıcı olarak silinecek.',
      cancelBtn: 'Vazgeç',
      confirmDeleteBtn: 'Evet, Sil',
    },
    settings: {
      title: 'Ayarlar ve Veri Yedekleme',
      subtitle:
        'Dil, tema, ses/konuşma tercihlerini yapılandırın ve yerel IndexedDB verilerinizi JSON olarak yedekleyin veya geri yükleyin.',
      appearanceHeading: 'Dil ve Görünüm',
      languageLabel: 'Arayüz Dili',
      themeLabel: 'Renk Teması',
      themeSystem: 'Sistem Varsayılanı',
      themeLight: 'Aydınlık Tema',
      themeDark: 'Karanlık Tema',
      audioHeading: 'Ses ve Konuşma Yönlendirmesi',
      soundToggle: 'Faz Geçiş Bip Sesleri (Web Audio API)',
      countdownToggle: '3-2-1 Geri Sayım Uyarıları',
      speechToggle: 'Sesli Hareket ve Faz Anonsları (Web Speech API)',
      wakeLockToggle: 'Antrenman Sırasında Ekranı Açık Tut (Wake Lock API)',
      voiceSelectLabel: 'Sistem Konuşma Sesi',
      voiceAuto: 'Otomatik (Dile Göre Seç)',
      testAudioBtn: 'Ses ve Anonsu Test Et',
      backupHeading: 'Yerel Veri Yedekleme (JSON Dışa / İçe Aktar)',
      backupDescription:
        'Tüm özel antrenmanlarınız, ayarlarınız ve geçmişiniz %100 kendi tarayıcınızda saklanır. İstediğiniz zaman JSON yedeği alabilir veya başka bir cihaza aktarabilirsiniz.',
      exportBtn: 'JSON Yedeği İndir',
      importMergeBtn: 'JSON İçe Aktar (Birleştir)',
      importReplaceBtn: 'JSON İçe Aktar (Üzerine Yaz)',
      clearHistoryBtn: 'Antrenman Geçmişini Temizle',
      importSuccess: 'Yedek başarıyla içe aktarıldı!',
      historyCleared: 'Antrenman geçmişi temizlendi.',
    },
  },
} as const;

export function getPhaseDisplayLabel(phase: WorkoutPhase, locale: SupportedLocale): string {
  const t = UI_STRINGS[locale].player;
  switch (phase) {
    case 'prepare':
      return t.phasePrepare;
    case 'warmup':
      return t.phaseWarmup;
    case 'work':
      return t.phaseWork;
    case 'rest':
      return t.phaseRest;
    case 'round-rest':
      return t.phaseRoundRest;
    case 'cooldown':
      return t.phaseCooldown;
    case 'completed':
      return t.phaseCompleted;
    case 'idle':
      return t.phaseIdle;
  }
}

export function getCategoryLabel(cat: ExerciseCategory, locale: SupportedLocale): string {
  const map: Record<ExerciseCategory, { en: string; tr: string }> = {
    bodyweight: { en: 'Bodyweight', tr: 'Vücut Ağırlığı' },
    dumbbell: { en: 'Dumbbell', tr: 'Dambıl' },
    core: { en: 'Core & Abs', tr: 'Core & Karın' },
    cardio: { en: 'Cardio HIIT', tr: 'Kardiyo HIIT' },
    'low-impact': { en: 'Low-Impact', tr: 'Düşük Etkili (Sıçramasız)' },
  };
  return map[cat][locale];
}

export function getMuscleLabel(muscle: MuscleGroup, locale: SupportedLocale): string {
  const map: Record<MuscleGroup, { en: string; tr: string }> = {
    'full-body': { en: 'Full Body', tr: 'Tam Vücut' },
    chest: { en: 'Chest', tr: 'Göğüs' },
    back: { en: 'Back', tr: 'Sırt' },
    shoulders: { en: 'Shoulders', tr: 'Omuz' },
    arms: { en: 'Arms', tr: 'Kol' },
    core: { en: 'Core', tr: 'Merkez (Core)' },
    legs: { en: 'Legs', tr: 'Bacak' },
    glutes: { en: 'Glutes', tr: 'Kalça' },
    cardio: { en: 'Cardio', tr: 'Kardiyo' },
  };
  return map[muscle][locale];
}

export function getEquipmentLabel(eq: EquipmentType, locale: SupportedLocale): string {
  const map: Record<EquipmentType, { en: string; tr: string }> = {
    none: { en: 'No Equipment', tr: 'Ekipmansız' },
    dumbbells: { en: 'Dumbbells', tr: 'Dambıl' },
    mat: { en: 'Exercise Mat', tr: 'Egzersiz Matı' },
  };
  return map[eq][locale];
}

export function getDifficultyLabel(diff: DifficultyLevel, locale: SupportedLocale): string {
  const map: Record<DifficultyLevel, { en: string; tr: string }> = {
    beginner: { en: 'Beginner', tr: 'Başlangıç' },
    intermediate: { en: 'Intermediate', tr: 'Orta Seviye' },
    advanced: { en: 'Advanced', tr: 'İleri Seviye' },
  };
  return map[diff][locale];
}
