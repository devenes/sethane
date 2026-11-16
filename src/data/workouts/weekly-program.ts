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
      en: 'Push & Metabolic Core · Chest, Shoulders, Triceps',
      tr: 'İtiş & Metabolik Core · Göğüs, Omuz ve Triceps',
    },
    focusMuscles: ['chest', 'shoulders', 'arms', 'core', 'cardio'],
    defaultWorkout: {
      id: 'weekly-monday',
      name: 'Monday — Upper Push, Delts & Metabolic Finisher',
      localizedName: {
        en: 'Monday · Upper Push, Delts & Metabolic Finisher',
        tr: 'Pazartesi · İtiş: Göğüs, Omuz, Triceps ve Metabolik Bitiş',
      },
      description: {
        en: 'Horizontal and vertical pressing paired with pike shoulder presses, medial deltoid isolation, triceps lockout, and a high-tempo plank-jack finisher to ignite week-opening calorie burn.',
        tr: 'Yerde göğüs pres, dikey omuz pres, pike şınav, yan omuz ve triceps hareketlerini her turun sonunda nabzı yükselten plank sıçrayışı (finisher) ile birleştiren kuvvet + yağ yakım serisi.',
      },
      prepareSeconds: 5,
      warmupSeconds: 120,
      rounds: 3,
      restBetweenRounds: 35,
      cooldownSeconds: 120,
      isPreset: true,
      exercises: [
        { id: 'mon-1', exerciseId: 'dumbbell-floor-press', workSeconds: 40, restSeconds: 15 },
        { id: 'mon-2', exerciseId: 'dumbbell-overhead-press', workSeconds: 40, restSeconds: 15 },
        { id: 'mon-3', exerciseId: 'pike-push-ups', workSeconds: 35, restSeconds: 15 },
        { id: 'mon-4', exerciseId: 'push-ups', workSeconds: 35, restSeconds: 15 },
        { id: 'mon-5', exerciseId: 'dumbbell-lateral-raise', workSeconds: 35, restSeconds: 15 },
        { id: 'mon-6', exerciseId: 'dumbbell-tricep-extension', workSeconds: 35, restSeconds: 15 },
        { id: 'mon-7', exerciseId: 'plank-jacks', workSeconds: 35, restSeconds: 0 },
      ],
    },
  },
  {
    dayKey: 'tuesday',
    dayLabel: { en: 'Tuesday', tr: 'Salı' },
    dayShortLabel: { en: 'Tue', tr: 'Sal' },
    focusBadge: {
      en: 'Lower Body & Plyo Burn · Quads, Glutes & Hips',
      tr: 'Alt Vücut & Pliometrik Yakım · Bacak ve Kalça',
    },
    focusMuscles: ['legs', 'glutes', 'core', 'cardio'],
    defaultWorkout: {
      id: 'weekly-tuesday',
      name: 'Tuesday — Lower Body Strength, Hip Swing & Plyo Burn',
      localizedName: {
        en: 'Tuesday · Lower Body Strength, Hip Swing & Plyo Burn',
        tr: 'Salı · Alt Vücut Kuvvet, Kalça Swing ve Patlayıcı Squat',
      },
      description: {
        en: 'Recruits the body’s largest muscle groups with goblet squats, unilateral lunges, ballistic dumbbell swings, lateral hip work, and explosive jump squats for maximum lower-body EPOC.',
        tr: 'Vücudun en büyük kas gruplarını goblet squat, tek bacak hamle, patlayıcı dambıl swing ve sıçramalı squat bitiricisiyle çalıştırarak en yüksek kalori ve hormon yanıtını üreten bacak günü.',
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
        { id: 'tue-3', exerciseId: 'dumbbell-swing', workSeconds: 40, restSeconds: 15 },
        { id: 'tue-4', exerciseId: 'lateral-lunges', workSeconds: 40, restSeconds: 15 },
        { id: 'tue-5', exerciseId: 'sumo-squat-pulse', workSeconds: 35, restSeconds: 15 },
        { id: 'tue-6', exerciseId: 'glute-bridges', workSeconds: 40, restSeconds: 15 },
        { id: 'tue-7', exerciseId: 'jump-squats', workSeconds: 35, restSeconds: 0 },
      ],
    },
  },
  {
    dayKey: 'wednesday',
    dayLabel: { en: 'Wednesday', tr: 'Çarşamba' },
    dayShortLabel: { en: 'Wed', tr: 'Çar' },
    focusBadge: {
      en: 'Pull & Posterior Chain · Back, Hamstrings, Biceps',
      tr: 'Çekiş & Arka Zincir · Sırt, Arka Bacak ve Biceps',
    },
    focusMuscles: ['back', 'arms', 'glutes', 'core', 'cardio'],
    defaultWorkout: {
      id: 'weekly-wednesday',
      name: 'Wednesday — Back, Posterior Chain, Biceps & V-Up Core',
      localizedName: {
        en: 'Wednesday · Back, Posterior Chain, Biceps & V-Up Core',
        tr: 'Çarşamba · Çekiş: Sırt, Arka Zincir, Biceps ve Çakı Mekik',
      },
      description: {
        en: 'Builds lats, rhomboids, hamstrings, and biceps through bent-over rows, RDL rows, sumo high pulls, and renegade rows, finishing each round with alternating V-up core compression.',
        tr: 'Eğilerek sırt çekiş, RDL çekiş, patlayıcı sumo high pull ve pazu hareketleriyle tüm arka zinciri güçlendirip her turu alternatif çakı mekik (V-Up) ile tamamlayan program.',
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
        { id: 'wed-3', exerciseId: 'dumbbell-high-pull', workSeconds: 35, restSeconds: 15 },
        { id: 'wed-4', exerciseId: 'dumbbell-bicep-curl-press', workSeconds: 40, restSeconds: 15 },
        { id: 'wed-5', exerciseId: 'dumbbell-renegade-row', workSeconds: 35, restSeconds: 15 },
        { id: 'wed-6', exerciseId: 'superman-back-extension', workSeconds: 35, restSeconds: 15 },
        { id: 'wed-7', exerciseId: 'v-up-crunches', workSeconds: 35, restSeconds: 0 },
      ],
    },
  },
  {
    dayKey: 'thursday',
    dayLabel: { en: 'Thursday', tr: 'Perşembe' },
    dayShortLabel: { en: 'Thu', tr: 'Per' },
    focusBadge: {
      en: 'Fat-Burn Engine · Athletic Cardio & Core Shred',
      tr: 'Maksimum Yağ Yakım · Atletik Kardiyo ve Core',
    },
    focusMuscles: ['cardio', 'core', 'legs', 'shoulders'],
    defaultWorkout: {
      id: 'weekly-thursday',
      name: 'Thursday — Athletic Fat-Burn Conditioning & Core Shred',
      localizedName: {
        en: 'Thursday · Athletic Fat-Burn Conditioning & Core Shred',
        tr: 'Perşembe · Maksimum Yağ Yakıcı Kardiyo ve Core Definisyon',
      },
      description: {
        en: 'High-cadence sprints, lateral skater bounds, plank jacks, and multi-angle abdominal intervals engineered to spike VO2 max and oxidize fat while sparing heavy lifting joints.',
        tr: 'Ağırlık günlerinin ortasında VO2 kapasitesini ve yağ oksidasyonunu zirveye taşıyan; yüksek diz koşusu, patenci sıçrayışı, boks ve karın sıkıştırma odaklı atletik kondisyon günü.',
      },
      prepareSeconds: 5,
      warmupSeconds: 120,
      rounds: 3,
      restBetweenRounds: 30,
      cooldownSeconds: 120,
      isPreset: true,
      exercises: [
        { id: 'thu-1', exerciseId: 'high-knees', workSeconds: 35, restSeconds: 15 },
        { id: 'thu-2', exerciseId: 'mountain-climbers', workSeconds: 35, restSeconds: 15 },
        { id: 'thu-3', exerciseId: 'skater-jumps', workSeconds: 35, restSeconds: 15 },
        { id: 'thu-4', exerciseId: 'bicycle-crunches', workSeconds: 35, restSeconds: 15 },
        { id: 'thu-5', exerciseId: 'shadow-boxing-punches', workSeconds: 35, restSeconds: 15 },
        { id: 'thu-6', exerciseId: 'flutter-kicks', workSeconds: 35, restSeconds: 15 },
        { id: 'thu-7', exerciseId: 'russian-twists', workSeconds: 35, restSeconds: 0 },
      ],
    },
  },
  {
    dayKey: 'friday',
    dayLabel: { en: 'Friday', tr: 'Cuma' },
    dayShortLabel: { en: 'Fri', tr: 'Cum' },
    focusBadge: {
      en: 'Upper Supersets & Power · Chest, Back, Arms',
      tr: 'Üst Vücut Süperset & Güç · Göğüs, Sırt ve Kol',
    },
    focusMuscles: ['arms', 'chest', 'back', 'shoulders', 'core', 'cardio'],
    defaultWorkout: {
      id: 'weekly-friday',
      name: 'Friday — Upper Body Antagonist Supersets & Power Snatch',
      localizedName: {
        en: 'Friday · Upper Body Antagonist Supersets & Power Snatch',
        tr: 'Cuma · Üst Vücut Süperset, Kol Hipertrofi ve Dambıl Snatch',
      },
      description: {
        en: 'Pairs close-grip diamond push-ups, rows, commando plank transitions, lateral delts, and arm supersets with an explosive alternating dumbbell snatch finisher.',
        tr: 'Elmas şınav, sırt çekiş, komando plank, yan omuz ve biceps-triceps süpersetlerini tur sonunda patlayıcı dambıl koparma (snatch) ile birleştiren yüksek metabolik üst vücut günü.',
      },
      prepareSeconds: 5,
      warmupSeconds: 120,
      rounds: 3,
      restBetweenRounds: 35,
      cooldownSeconds: 120,
      isPreset: true,
      exercises: [
        { id: 'fri-1', exerciseId: 'diamond-push-ups', workSeconds: 35, restSeconds: 15 },
        { id: 'fri-2', exerciseId: 'dumbbell-bent-over-row', workSeconds: 40, restSeconds: 15 },
        { id: 'fri-3', exerciseId: 'plank-up-downs', workSeconds: 35, restSeconds: 15 },
        { id: 'fri-4', exerciseId: 'dumbbell-lateral-raise', workSeconds: 35, restSeconds: 15 },
        { id: 'fri-5', exerciseId: 'dumbbell-bicep-curl-press', workSeconds: 40, restSeconds: 15 },
        { id: 'fri-6', exerciseId: 'plank-shoulder-taps', workSeconds: 35, restSeconds: 15 },
        { id: 'fri-7', exerciseId: 'dumbbell-snatch', workSeconds: 35, restSeconds: 0 },
      ],
    },
  },
  {
    dayKey: 'saturday',
    dayLabel: { en: 'Saturday', tr: 'Cumartesi' },
    dayShortLabel: { en: 'Sat', tr: 'Cmt' },
    focusBadge: {
      en: 'Peak Afterburn HIIT · Full-Body Power & EPOC',
      tr: 'Tam Vücut Zirve HIIT · Maksimum Kalori ve EPOC',
    },
    focusMuscles: ['full-body', 'legs', 'glutes', 'chest', 'back', 'shoulders', 'cardio'],
    defaultWorkout: {
      id: 'weekly-saturday',
      name: 'Saturday — Full-Body Power Complexes & Peak Afterburn HIIT',
      localizedName: {
        en: 'Saturday · Full-Body Power Complexes & Peak Afterburn HIIT',
        tr: 'Cumartesi · Tam Vücut Güç Kompleksleri ve Zirve Yağ Yakım HIIT',
      },
      description: {
        en: 'The week’s highest-calorie session uniting thrusters, power snatches, jump squats, ballistic swings, push-ups, mountain climbers, and burpees for full-body synergy.',
        tr: 'Thruster, dambıl snatch, sıçramalı squat, kalça swing, şınav, dağ tırmanışı ve burpee ile haftanın en yüksek kalori ve yağ yakımına ulaşan tam vücut zirve antrenmanı.',
      },
      prepareSeconds: 5,
      warmupSeconds: 120,
      rounds: 3,
      restBetweenRounds: 35,
      cooldownSeconds: 120,
      isPreset: true,
      exercises: [
        { id: 'sat-1', exerciseId: 'dumbbell-thruster', workSeconds: 35, restSeconds: 15 },
        { id: 'sat-2', exerciseId: 'dumbbell-snatch', workSeconds: 35, restSeconds: 15 },
        { id: 'sat-3', exerciseId: 'jump-squats', workSeconds: 35, restSeconds: 15 },
        { id: 'sat-4', exerciseId: 'dumbbell-swing', workSeconds: 35, restSeconds: 15 },
        { id: 'sat-5', exerciseId: 'push-ups', workSeconds: 35, restSeconds: 15 },
        { id: 'sat-6', exerciseId: 'mountain-climbers', workSeconds: 35, restSeconds: 15 },
        { id: 'sat-7', exerciseId: 'burpees', workSeconds: 30, restSeconds: 0 },
      ],
    },
  },
  {
    dayKey: 'sunday',
    dayLabel: { en: 'Sunday', tr: 'Pazar' },
    dayShortLabel: { en: 'Sun', tr: 'Paz' },
    focusBadge: {
      en: 'Active Recovery · Mobility, Posture & Deep Core',
      tr: 'Aktif Toparlanma · Mobilite, Postür ve Derin Core',
    },
    focusMuscles: ['core', 'back', 'glutes', 'legs', 'shoulders'],
    defaultWorkout: {
      id: 'weekly-sunday',
      name: 'Sunday — Active Recovery, Joint Mobility & Deep Core Stability',
      localizedName: {
        en: 'Sunday · Active Recovery, Joint Mobility & Deep Core Stability',
        tr: 'Pazar · Aktif Toparlanma, Eklem Mobilitesi ve Derin Core',
      },
      description: {
        en: 'Zero-impact restorative flow that flushes soreness, opens tight hips and thoracic posture, activates glutes, and reinforces anti-extension deep abdominal stability for the new week.',
        tr: 'Sıçrama içermeyen akıcı temposuyla kas ağrılarını dağıtan, kalça ve omurga mobilitesini açan, derin karın (transversus abdominis) stabilizasyonunu güçlendiren pazar akışı.',
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
        { id: 'sun-6', exerciseId: 'dead-bug', workSeconds: 40, restSeconds: 15 },
        { id: 'sun-7', exerciseId: 'plank-hold', workSeconds: 40, restSeconds: 0 },
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
