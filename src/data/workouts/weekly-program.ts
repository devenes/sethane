import type {
  DayOfWeekKey,
  MuscleGroup,
  WeeklyDayDefinition,
  WorkoutPlan,
} from '../../types';
import { getExerciseById } from '../exercises/catalog';

export const WEEKLY_DAY_ORDER: readonly DayOfWeekKey[] = [
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
  'sunday',
] as const;

const JS_DAY_INDEX_TO_KEY: readonly DayOfWeekKey[] = [
  'sunday',
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
] as const;

/**
 * Returns the user's current local day of week (`monday` .. `sunday`).
 * For example, when `now.getDay() === 0` (Sunday / Pazar), returns `'sunday'`.
 */
export function getTodayDayKey(now: Date = new Date()): DayOfWeekKey {
  return JS_DAY_INDEX_TO_KEY[now.getDay()] ?? 'monday';
}

export const WEEKLY_PROGRAM_DEFINITIONS: readonly WeeklyDayDefinition[] = [
  {
    dayKey: 'monday',
    dayLabel: { en: 'Monday', tr: 'Pazartesi' },
    dayShortLabel: { en: 'Mon', tr: 'Pzt' },
    focusBadge: {
      en: 'Push · Chest, Shoulders & Triceps',
      tr: 'İtiş · Göğüs, Omuz ve Triceps',
    },
    focusMuscles: ['chest', 'shoulders', 'arms', 'core'],
    defaultWorkout: {
      id: 'weekly-monday',
      name: 'Monday — Upper Push & Triceps',
      localizedName: {
        en: 'Monday · Upper Push & Triceps',
        tr: 'Pazartesi · İtiş: Göğüs, Omuz ve Triceps',
      },
      description: {
        en: 'Pressing mechanics across horizontal and vertical planes to build chest thickness, medial deltoids, and triceps lockout.',
        tr: 'Göğüs, omuz başları ve arka kol (triceps) kuvvetini dengeli geliştiren yatay ve dikey itiş serisi.',
      },
      prepareSeconds: 5,
      warmupSeconds: 120,
      rounds: 3,
      restBetweenRounds: 40,
      cooldownSeconds: 120,
      isPreset: true,
      exercises: [
        { id: 'mon-1', exerciseId: 'dumbbell-floor-press', workSeconds: 40, restSeconds: 15 },
        { id: 'mon-2', exerciseId: 'push-ups', workSeconds: 35, restSeconds: 15 },
        { id: 'mon-3', exerciseId: 'dumbbell-overhead-press', workSeconds: 40, restSeconds: 15 },
        { id: 'mon-4', exerciseId: 'dumbbell-lateral-raise', workSeconds: 35, restSeconds: 15 },
        { id: 'mon-5', exerciseId: 'dumbbell-tricep-extension', workSeconds: 35, restSeconds: 15 },
        { id: 'mon-6', exerciseId: 'plank-shoulder-taps', workSeconds: 35, restSeconds: 0 },
      ],
    },
  },
  {
    dayKey: 'tuesday',
    dayLabel: { en: 'Tuesday', tr: 'Salı' },
    dayShortLabel: { en: 'Tue', tr: 'Sal' },
    focusBadge: {
      en: 'Lower Body · Quads, Glutes & Hips',
      tr: 'Alt Vücut · Bacak ve Kalça Kuvvet',
    },
    focusMuscles: ['legs', 'glutes', 'core'],
    defaultWorkout: {
      id: 'weekly-tuesday',
      name: 'Tuesday — Lower Body Strength & Glutes',
      localizedName: {
        en: 'Tuesday · Lower Body Strength & Glutes',
        tr: 'Salı · Alt Vücut: Bacak ve Kalça Kuvvet',
      },
      description: {
        en: 'Multi-planar squats, unilateral reverse lunges, lateral hip work, and isometric core bracing for complete leg development.',
        tr: 'Derin squat, tek bacak hamle, yan kalça açış ve izometrik core ile tüm bacak ve kalça kaslarını çalıştıran gün.',
      },
      prepareSeconds: 5,
      warmupSeconds: 120,
      rounds: 3,
      restBetweenRounds: 40,
      cooldownSeconds: 120,
      isPreset: true,
      exercises: [
        { id: 'tue-1', exerciseId: 'dumbbell-goblet-squat', workSeconds: 40, restSeconds: 15 },
        { id: 'tue-2', exerciseId: 'reverse-lunge-knee-drive', workSeconds: 40, restSeconds: 15 },
        { id: 'tue-3', exerciseId: 'lateral-lunges', workSeconds: 40, restSeconds: 15 },
        { id: 'tue-4', exerciseId: 'sumo-squat-pulse', workSeconds: 35, restSeconds: 15 },
        { id: 'tue-5', exerciseId: 'glute-bridges', workSeconds: 40, restSeconds: 15 },
        { id: 'tue-6', exerciseId: 'plank-hold', workSeconds: 40, restSeconds: 0 },
      ],
    },
  },
  {
    dayKey: 'wednesday',
    dayLabel: { en: 'Wednesday', tr: 'Çarşamba' },
    dayShortLabel: { en: 'Wed', tr: 'Çar' },
    focusBadge: {
      en: 'Pull · Back, Hamstrings & Biceps',
      tr: 'Çekiş · Sırt, Arka Zincir ve Biceps',
    },
    focusMuscles: ['back', 'arms', 'glutes', 'core'],
    defaultWorkout: {
      id: 'weekly-wednesday',
      name: 'Wednesday — Back, Posterior Chain & Biceps',
      localizedName: {
        en: 'Wednesday · Back, Posterior Chain & Biceps',
        tr: 'Çarşamba · Çekiş: Sırt, Arka Zincir ve Biceps',
      },
      description: {
        en: 'Rows, hip-hinge deadlift pulls, biceps curls, and prone back extensions to build posture, lats, and posterior strength.',
        tr: 'Kanat (lat), kürek kemiği çevresi, arka bacak ve ön kol (biceps) kaslarını güçlendiren çekiş ve menteşe odaklı program.',
      },
      prepareSeconds: 5,
      warmupSeconds: 120,
      rounds: 3,
      restBetweenRounds: 40,
      cooldownSeconds: 120,
      isPreset: true,
      exercises: [
        { id: 'wed-1', exerciseId: 'dumbbell-bent-over-row', workSeconds: 40, restSeconds: 15 },
        { id: 'wed-2', exerciseId: 'romanian-deadlift-row', workSeconds: 40, restSeconds: 15 },
        { id: 'wed-3', exerciseId: 'dumbbell-bicep-curl-press', workSeconds: 40, restSeconds: 15 },
        { id: 'wed-4', exerciseId: 'dumbbell-renegade-row', workSeconds: 35, restSeconds: 15 },
        { id: 'wed-5', exerciseId: 'superman-back-extension', workSeconds: 35, restSeconds: 15 },
        { id: 'wed-6', exerciseId: 'bicycle-crunches', workSeconds: 35, restSeconds: 0 },
      ],
    },
  },
  {
    dayKey: 'thursday',
    dayLabel: { en: 'Thursday', tr: 'Perşembe' },
    dayShortLabel: { en: 'Thu', tr: 'Per' },
    focusBadge: {
      en: 'Conditioning · Cardio & Core Engine',
      tr: 'Kondisyon · Atletik Kardiyo ve Core',
    },
    focusMuscles: ['cardio', 'core', 'legs', 'shoulders'],
    defaultWorkout: {
      id: 'weekly-thursday',
      name: 'Thursday — Athletic Cardio & Core Shred',
      localizedName: {
        en: 'Thursday · Athletic Cardio & Core Shred',
        tr: 'Perşembe · Atletik Kardiyo ve Core Kondisyon',
      },
      description: {
        en: 'High-tempo aerobic and rotational core intervals that elevate VO2 capacity while letting heavy joints recover from lifting.',
        tr: 'Ağırlık günlerinin ortasında kalp-damar kapasitesini yükselten, oblik ve alt karın kaslarını yoğun çalıştıran seri.',
      },
      prepareSeconds: 5,
      warmupSeconds: 120,
      rounds: 3,
      restBetweenRounds: 30,
      cooldownSeconds: 120,
      isPreset: true,
      exercises: [
        { id: 'thu-1', exerciseId: 'jumping-jacks', workSeconds: 35, restSeconds: 15 },
        { id: 'thu-2', exerciseId: 'mountain-climbers', workSeconds: 35, restSeconds: 15 },
        { id: 'thu-3', exerciseId: 'skater-jumps', workSeconds: 35, restSeconds: 15 },
        { id: 'thu-4', exerciseId: 'shadow-boxing-punches', workSeconds: 35, restSeconds: 15 },
        { id: 'thu-5', exerciseId: 'flutter-kicks', workSeconds: 35, restSeconds: 15 },
        { id: 'thu-6', exerciseId: 'russian-twists', workSeconds: 35, restSeconds: 0 },
      ],
    },
  },
  {
    dayKey: 'friday',
    dayLabel: { en: 'Friday', tr: 'Cuma' },
    dayShortLabel: { en: 'Fri', tr: 'Cum' },
    focusBadge: {
      en: 'Hypertrophy · Upper Body & Arms',
      tr: 'Hipertrofi · Üst Vücut ve Kol Odaklı',
    },
    focusMuscles: ['arms', 'chest', 'back', 'shoulders'],
    defaultWorkout: {
      id: 'weekly-friday',
      name: 'Friday — Upper Body & Arms Hypertrophy',
      localizedName: {
        en: 'Friday · Upper Body & Arms Hypertrophy',
        tr: 'Cuma · Üst Vücut ve Kol Hipertrofi Karma',
      },
      description: {
        en: 'Antagonist push-pull supersets paired with dedicated biceps, triceps, and lateral shoulder volume.',
        tr: 'İtiş-çekiş süpersetleriyle göğüs ve sırtı ikinci kez uyarırken biceps, triceps ve yan omuz hacmini tamamlayan gün.',
      },
      prepareSeconds: 5,
      warmupSeconds: 120,
      rounds: 3,
      restBetweenRounds: 40,
      cooldownSeconds: 120,
      isPreset: true,
      exercises: [
        { id: 'fri-1', exerciseId: 'diamond-push-ups', workSeconds: 35, restSeconds: 15 },
        { id: 'fri-2', exerciseId: 'dumbbell-bent-over-row', workSeconds: 40, restSeconds: 15 },
        { id: 'fri-3', exerciseId: 'dumbbell-lateral-raise', workSeconds: 35, restSeconds: 15 },
        { id: 'fri-4', exerciseId: 'dumbbell-floor-press', workSeconds: 40, restSeconds: 15 },
        { id: 'fri-5', exerciseId: 'dumbbell-bicep-curl-press', workSeconds: 35, restSeconds: 15 },
        { id: 'fri-6', exerciseId: 'dumbbell-tricep-extension', workSeconds: 35, restSeconds: 0 },
      ],
    },
  },
  {
    dayKey: 'saturday',
    dayLabel: { en: 'Saturday', tr: 'Cumartesi' },
    dayShortLabel: { en: 'Sat', tr: 'Cmt' },
    focusBadge: {
      en: 'Power HIIT · Full-Body Synergy',
      tr: 'Tam Vücut · Güç ve Patlayıcı HIIT',
    },
    focusMuscles: ['full-body', 'legs', 'glutes', 'chest', 'cardio'],
    defaultWorkout: {
      id: 'weekly-saturday',
      name: 'Saturday — Full-Body Power & HIIT',
      localizedName: {
        en: 'Saturday · Full-Body Power & HIIT',
        tr: 'Cumartesi · Tam Vücut Güç ve HIIT Sinerjisi',
      },
      description: {
        en: 'Compound thrusters, hinge-rows, sprints, squats, push-ups, and burpees uniting lower and upper chains under metabolic load.',
        tr: 'Thruster, RDL çekiş, squat, şınav ve burpee ile alt ve üst vücudu yüksek metabolik tempoda birleştiren zirve antrenmanı.',
      },
      prepareSeconds: 5,
      warmupSeconds: 120,
      rounds: 3,
      restBetweenRounds: 35,
      cooldownSeconds: 120,
      isPreset: true,
      exercises: [
        { id: 'sat-1', exerciseId: 'dumbbell-thruster', workSeconds: 35, restSeconds: 15 },
        { id: 'sat-2', exerciseId: 'romanian-deadlift-row', workSeconds: 35, restSeconds: 15 },
        { id: 'sat-3', exerciseId: 'high-knees', workSeconds: 30, restSeconds: 15 },
        { id: 'sat-4', exerciseId: 'air-squats', workSeconds: 40, restSeconds: 15 },
        { id: 'sat-5', exerciseId: 'push-ups', workSeconds: 35, restSeconds: 15 },
        { id: 'sat-6', exerciseId: 'burpees', workSeconds: 30, restSeconds: 0 },
      ],
    },
  },
  {
    dayKey: 'sunday',
    dayLabel: { en: 'Sunday', tr: 'Pazar' },
    dayShortLabel: { en: 'Sun', tr: 'Paz' },
    focusBadge: {
      en: 'Active Recovery · Mobility & Deep Core',
      tr: 'Aktif Toparlanma · Mobilite ve Derin Core',
    },
    focusMuscles: ['core', 'back', 'glutes', 'legs', 'shoulders'],
    defaultWorkout: {
      id: 'weekly-sunday',
      name: 'Sunday — Active Recovery, Mobility & Deep Core',
      localizedName: {
        en: 'Sunday · Active Recovery, Mobility & Deep Core',
        tr: 'Pazar · Aktif Toparlanma, Mobilite ve Derin Core',
      },
      description: {
        en: 'Zero-jumping joint-friendly flow opening hips, hamstrings, thoracic posture, glutes, and anti-extension deep abs.',
        tr: 'Sıçrama içermeyen, eklemleri dinlendirirken kalça açıklığı, omurga duruşu ve derin karın stabilizasyonunu güçlendiren pazar akışı.',
      },
      prepareSeconds: 5,
      warmupSeconds: 120,
      rounds: 2,
      restBetweenRounds: 30,
      cooldownSeconds: 150,
      isPreset: true,
      exercises: [
        { id: 'sun-1', exerciseId: 'step-jack-low-impact', workSeconds: 40, restSeconds: 15 },
        { id: 'sun-2', exerciseId: 'inchworm-walkout', workSeconds: 40, restSeconds: 15 },
        { id: 'sun-3', exerciseId: 'lateral-lunges', workSeconds: 40, restSeconds: 15 },
        { id: 'sun-4', exerciseId: 'glute-bridges', workSeconds: 40, restSeconds: 15 },
        { id: 'sun-5', exerciseId: 'superman-back-extension', workSeconds: 35, restSeconds: 15 },
        { id: 'sun-6', exerciseId: 'dead-bug', workSeconds: 40, restSeconds: 0 },
      ],
    },
  },
];

export const WEEKLY_DEFINITIONS_BY_DAY: Record<DayOfWeekKey, WeeklyDayDefinition> =
  Object.fromEntries(WEEKLY_PROGRAM_DEFINITIONS.map((d) => [d.dayKey, d])) as Record<
    DayOfWeekKey,
    WeeklyDayDefinition
  >;

export function cloneWorkoutPlan(plan: WorkoutPlan): WorkoutPlan {
  return {
    ...plan,
    localizedName: plan.localizedName ? { ...plan.localizedName } : undefined,
    description: plan.description ? { ...plan.description } : undefined,
    exercises: plan.exercises.map((ex, idx) => ({
      ...ex,
      id: ex.id ?? `${plan.id}-item-${idx}`,
    })),
  };
}

export function createDefaultWeeklySchedule(): Record<DayOfWeekKey, WorkoutPlan> {
  return Object.fromEntries(
    WEEKLY_PROGRAM_DEFINITIONS.map((def) => [def.dayKey, cloneWorkoutPlan(def.defaultWorkout)])
  ) as Record<DayOfWeekKey, WorkoutPlan>;
}

export type TrackedMuscleGroup = Exclude<MuscleGroup, 'full-body'>;

export const TRACKED_WEEKLY_MUSCLES: readonly TrackedMuscleGroup[] = [
  'chest',
  'back',
  'shoulders',
  'arms',
  'legs',
  'glutes',
  'core',
  'cardio',
] as const;

/**
 * Calculates total weekly working sets per muscle group across all 7 days
 * (`rounds * matching_exercises`), reflecting any user additions/removals live.
 */
export function computeWeeklyMuscleSets(
  schedule: Record<DayOfWeekKey, WorkoutPlan>
): Record<TrackedMuscleGroup, number> {
  const counts: Record<TrackedMuscleGroup, number> = {
    chest: 0,
    back: 0,
    shoulders: 0,
    arms: 0,
    legs: 0,
    glutes: 0,
    core: 0,
    cardio: 0,
  };

  for (const dayKey of WEEKLY_DAY_ORDER) {
    const plan = schedule[dayKey];
    if (!plan) continue;
    const rounds = Math.max(1, plan.rounds);
    for (const item of plan.exercises) {
      const ex = getExerciseById(item.exerciseId);
      if (!ex) continue;
      for (const m of ex.muscleGroups) {
        if (m !== 'full-body') {
          counts[m] += rounds;
        }
      }
    }
  }

  return counts;
}
