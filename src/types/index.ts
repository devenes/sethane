export type SupportedLocale = 'en' | 'tr';

export type ThemeMode = 'system' | 'light' | 'dark';

export type ExerciseCategory = 'bodyweight' | 'dumbbell' | 'core' | 'cardio' | 'low-impact';

export type MuscleGroup =
  | 'full-body'
  | 'chest'
  | 'back'
  | 'shoulders'
  | 'arms'
  | 'core'
  | 'legs'
  | 'glutes'
  | 'cardio';

export type EquipmentType = 'none' | 'dumbbells' | 'mat';

export type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced';

export interface LocalizedText {
  en: string;
  tr: string;
}

export interface LocalizedStringList {
  en: string[];
  tr: string[];
}

export interface ExerciseMedia {
  type: 'svg' | 'image';
  src: string;
  alt: LocalizedText;
}

export interface Exercise {
  id: string;
  name: LocalizedText;
  category: ExerciseCategory;
  muscleGroups: MuscleGroup[];
  equipment: EquipmentType[];
  difficulty: DifficultyLevel;
  instructions: LocalizedStringList;
  commonMistakes: LocalizedStringList;
  easierVariation?: LocalizedText;
  defaultWorkSeconds: number;
  defaultRestSeconds: number;
  media: ExerciseMedia;
}

export interface WorkoutExerciseItem {
  id?: string;
  exerciseId: string;
  workSeconds: number;
  restSeconds: number;
}

export interface WorkoutPlan {
  id: string;
  name: string;
  description?: LocalizedText;
  prepareSeconds?: number;
  warmupSeconds: number;
  rounds: number;
  restBetweenRounds: number;
  cooldownSeconds: number;
  exercises: WorkoutExerciseItem[];
  isPreset?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface WorkoutHistoryEntry {
  id: string;
  workoutId: string;
  workoutName: string;
  completedAt: string;
  durationSeconds: number;
  roundsCompleted: number;
  exercisesCount: number;
}

export interface UserSettings {
  id: 'default';
  locale: SupportedLocale;
  theme: ThemeMode;
  soundEnabled: boolean;
  speechEnabled: boolean;
  countdownBeepsEnabled: boolean;
  wakeLockEnabled: boolean;
  preferredVoiceURI: string | null;
  speechRate: number;
  soundVolume: number;
  defaultPrepareSeconds: number;
}

export interface BackupPayloadV1 {
  schemaVersion: 1;
  exportedAt: string;
  app: 'SetHane';
  customWorkouts: WorkoutPlan[];
  history: WorkoutHistoryEntry[];
  settings: Omit<UserSettings, 'id'>;
}
