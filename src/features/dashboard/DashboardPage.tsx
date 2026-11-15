import React, { useMemo, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { ArrowRight, CalendarDays, Play, Plus, Timer } from 'lucide-react';
import { ExerciseVisual } from '../../components/common/ExerciseVisual';
import { WorkoutCard } from '../../components/common/WorkoutCard';
import { getExerciseById } from '../../data/exercises/catalog';
import {
  getTodayDayKey,
  WEEKLY_DEFINITIONS_BY_DAY,
} from '../../data/workouts/weekly-program';
import { soundService } from '../../services/audio/sound-service';
import { useSettingsStore } from '../../stores/settings-store';
import { useWorkoutStore } from '../../stores/workout-store';
import type { Exercise, WorkoutPlan } from '../../types';
import { formatHumanDuration } from '../../utils/format';
import { UI_STRINGS } from '../../utils/i18n';
import { QuickTimerModal } from './QuickTimerModal';

const QUICK_MOVE_IDS = [
  'dumbbell-thruster',
  'push-ups',
  'air-squats',
  'mountain-climbers',
  'burpees',
  'bicycle-crunches',
] as const;

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const locale = useSettingsStore((s) => s.locale);
  const presets = useWorkoutStore((s) => s.presets);
  const customWorkouts = useWorkoutStore((s) => s.customWorkouts);
  const weeklySchedule = useWorkoutStore((s) => s.weeklySchedule);
  const history = useWorkoutStore((s) => s.history);
  const selectWorkoutForPlayer = useWorkoutStore((s) => s.selectWorkoutForPlayer);
  const setEditingWorkout = useWorkoutStore((s) => s.setEditingWorkout);

  const [quickTimerOpen, setQuickTimerOpen] = useState(false);

  const t = UI_STRINGS[locale].dashboard;
  const tn = UI_STRINGS[locale].nav;
  const todayKey = useMemo(() => getTodayDayKey(), []);
  const todayDef = WEEKLY_DEFINITIONS_BY_DAY[todayKey];
  const todayWeeklyPlan = weeklySchedule[todayKey] ?? todayDef.defaultWorkout;
  const signatureWorkout = presets[0]!;
  const otherPresets = presets.slice(1);

  const launchWorkout = (workout: WorkoutPlan, skipWarmup = false) => {
    soundService.unlock();
    const target = skipWarmup
      ? { ...workout, warmupSeconds: 0, cooldownSeconds: 0 }
      : workout;
    selectWorkoutForPlayer(target);
    navigate('/player');
  };

  const launchSingleMove = (exercise: Exercise) => {
    soundService.unlock();
    selectWorkoutForPlayer({
      id: `single-${exercise.id}-${Date.now()}`,
      name: `${exercise.name[locale]} (3×)`,
      prepareSeconds: 5,
      warmupSeconds: 0,
      rounds: 3,
      restBetweenRounds: exercise.defaultRestSeconds,
      cooldownSeconds: 0,
      exercises: [
        {
          exerciseId: exercise.id,
          workSeconds: exercise.defaultWorkSeconds,
          restSeconds: 0,
        },
      ],
    });
    navigate('/player');
  };

  const handleCustomizeCopy = (workout: WorkoutPlan) => {
    setEditingWorkout({
      ...workout,
      id: workout.isPreset ? `custom-${Date.now()}` : workout.id,
      name: workout.isPreset
        ? `${workout.localizedName?.[locale] ?? workout.name} (Copy)`
        : workout.name,
      localizedName: undefined,
      isPreset: false,
    });
    navigate('/builder');
  };

  const totalCompletedMinutes = Math.round(
    history.reduce((sum, entry) => sum + entry.durationSeconds, 0) / 60
  );

  const quickMoves = QUICK_MOVE_IDS.map((id) => getExerciseById(id)).filter(
    (ex): ex is Exercise => Boolean(ex)
  );

  return (
    <div className="space-y-6">
      {/* Mode Switcher + Compact Command Row */}
      <div className="space-y-3">
        <nav
          aria-label="Training mode"
          className="inline-flex items-center p-1 rounded-xl surface-card gap-1"
        >
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `px-3 py-1 rounded-lg text-xs font-bold no-underline transition-colors ${
                isActive
                  ? 'bg-emerald-500 text-slate-950'
                  : 'text-muted-token hover:text-[var(--text-primary)]'
              }`
            }
          >
            {tn.modeStandard}
          </NavLink>
          <NavLink
            to="/weekly"
            data-testid="dashboard-weekly-mode-link"
            className={({ isActive }) =>
              `px-3 py-1 rounded-lg text-xs font-bold no-underline inline-flex items-center gap-1.5 transition-colors ${
                isActive
                  ? 'bg-emerald-500 text-slate-950'
                  : 'text-muted-token hover:text-[var(--text-primary)]'
              }`
            }
          >
            <CalendarDays className="w-3.5 h-3.5" aria-hidden="true" />
            <span>{tn.modeWeekly}</span>
          </NavLink>
        </nav>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-baseline gap-3">
            <h1 className="text-xl sm:text-2xl font-black m-0">{t.pageTitle}</h1>
            {history.length > 0 && (
              <span className="text-xs mono-readout text-muted-token">
                {history.length} {t.statsSessionsShort} · {totalCompletedMinutes}{' '}
                {t.statsMinutesShort}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setQuickTimerOpen(true)}
              className="surface-card hover:border-[var(--brand-accent)] font-bold px-3 py-2 rounded-lg text-xs inline-flex items-center gap-1.5 cursor-pointer transition-colors"
            >
              <Timer className="w-3.5 h-3.5 text-[var(--brand-accent)]" aria-hidden="true" />
              <span>{t.quickTimerBtn}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setEditingWorkout(null);
                navigate('/builder');
              }}
              className="surface-card hover:border-[var(--brand-accent)] font-bold px-3 py-2 rounded-lg text-xs inline-flex items-center gap-1.5 cursor-pointer transition-colors"
            >
              <Plus className="w-3.5 h-3.5 text-[var(--brand-accent)]" aria-hidden="true" />
              <span>{t.createCustomBtn}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Today's Weekly Split Quick Banner */}
      <section className="surface-card rounded-xl p-3.5 sm:p-4 flex flex-wrap items-center justify-between gap-3 border-[var(--brand-accent)]/40">
        <div className="space-y-0.5 min-w-0">
          <div className="text-[11px] font-extrabold uppercase tracking-wider text-[var(--brand-accent)] inline-flex items-center gap-1.5">
            <CalendarDays className="w-3.5 h-3.5" aria-hidden="true" />
            <span>
              {t.weeklyBannerEyebrow} · {todayDef.dayLabel[locale]}
            </span>
          </div>
          <div className="text-sm sm:text-base font-black truncate">
            {todayWeeklyPlan.localizedName?.[locale] ?? todayWeeklyPlan.name}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            disabled={todayWeeklyPlan.exercises.length === 0}
            onClick={() =>
              launchWorkout({
                ...todayWeeklyPlan,
                name: todayWeeklyPlan.localizedName?.[locale] ?? todayWeeklyPlan.name,
              })
            }
            className="bg-emerald-500 hover:bg-emerald-400 disabled:opacity-40 text-slate-950 font-extrabold px-3.5 py-2 rounded-lg text-xs inline-flex items-center gap-1.5 cursor-pointer transition-colors"
          >
            <Play className="w-3.5 h-3.5 fill-current" aria-hidden="true" />
            <span>
              {t.weeklyBannerStartToday} ({todayDef.dayShortLabel[locale]})
            </span>
          </button>
          <Link
            to="/weekly"
            className="surface-elevated hover:border-[var(--brand-accent)] px-3 py-2 rounded-lg text-xs font-bold no-underline inline-flex items-center gap-1.5 transition-colors"
          >
            <span>{t.weeklyBannerOpenBtn}</span>
            <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
          </Link>
        </div>
      </section>

      {/* Signature Spotlight Program with 6-Move Visual Strip */}
      <WorkoutCard
        workout={signatureWorkout}
        locale={locale}
        featured
        startLabelOverride={t.startSignature}
        onStart={launchWorkout}
        onCustomize={handleCustomizeCopy}
      />

      {/* Saved Custom Workouts (shown immediately when user has created any) */}
      {customWorkouts.length > 0 && (
        <section className="space-y-2.5">
          <h2 className="text-sm font-extrabold uppercase tracking-wider text-muted-token m-0">
            {t.myWorkoutsTitle}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
            {customWorkouts.slice(0, 4).map((workout) => (
              <WorkoutCard
                key={workout.id}
                workout={workout}
                locale={locale}
                onStart={launchWorkout}
                onEdit={(w) => {
                  setEditingWorkout(w);
                  navigate('/builder');
                }}
              />
            ))}
          </div>
        </section>
      )}

      {/* Remaining Built-In Programs — Visual Filmstrips */}
      <section className="space-y-2.5">
        <h2 className="text-sm font-extrabold uppercase tracking-wider text-muted-token m-0">
          {t.featuredTitle}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {otherPresets.map((workout) => (
            <WorkoutCard
              key={workout.id}
              workout={workout}
              locale={locale}
              onStart={launchWorkout}
              onCustomize={handleCustomizeCopy}
            />
          ))}
        </div>
      </section>

      {/* Direct Single-Move Sets — Tap Any Move to Train Immediately */}
      <section className="space-y-2.5">
        <div className="flex items-center justify-between gap-2">
          <h2 className="text-sm font-extrabold uppercase tracking-wider text-muted-token m-0">
            {t.quickMovesTitle}
          </h2>
          <Link
            to="/exercises"
            className="text-xs font-bold text-[var(--brand-accent)] no-underline hover:underline inline-flex items-center gap-1"
          >
            <span>{t.browseExercisesBtn}</span>
            <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {quickMoves.map((exercise) => (
            <article
              key={exercise.id}
              className="adaptive-card surface-card rounded-xl overflow-hidden flex flex-col justify-between hover:border-[var(--brand-accent)] transition-colors"
            >
              <div className="bg-[#070b14] border-b border-[var(--border-subtle)] p-1">
                <ExerciseVisual
                  media={exercise.media}
                  locale={locale}
                  staticOnly
                  loading="lazy"
                  className="w-full aspect-[10/7] object-contain mx-auto rounded-lg"
                />
              </div>
              <div className="p-2.5 flex items-center justify-between gap-1.5">
                <div className="min-w-0">
                  <div className="text-xs font-bold truncate">{exercise.name[locale]}</div>
                  <div className="text-[10px] mono-readout text-muted-token">
                    3× {exercise.defaultWorkSeconds}s
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => launchSingleMove(exercise)}
                  aria-label={`${t.trainMoveNow}: ${exercise.name[locale]}`}
                  className="shrink-0 bg-emerald-500 hover:bg-emerald-400 text-slate-950 p-1.5 rounded-lg inline-flex items-center justify-center cursor-pointer transition-colors"
                >
                  <Play className="w-3.5 h-3.5 fill-current" aria-hidden="true" />
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Compact Session Log — Only Rendered When Non-Empty */}
      {history.length > 0 && (
        <section className="surface-card rounded-xl p-4 space-y-2.5">
          <h2 className="text-xs font-extrabold uppercase tracking-wider text-muted-token m-0">
            {t.recentTitle}
          </h2>
          <div className="divide-y divide-[var(--border-subtle)]">
            {history.slice(0, 5).map((entry) => (
              <div
                key={entry.id}
                className="py-2 first:pt-0 last:pb-0 flex items-center justify-between gap-3 text-xs"
              >
                <div className="font-bold truncate">{entry.workoutName}</div>
                <div className="flex items-center gap-3 shrink-0 mono-readout text-muted-token">
                  <span>
                    {new Date(entry.completedAt).toLocaleDateString(
                      locale === 'tr' ? 'tr-TR' : 'en-US',
                      { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }
                    )}
                  </span>
                  <span className="text-[var(--brand-accent)] font-bold">
                    {formatHumanDuration(entry.durationSeconds, locale)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      <QuickTimerModal
        open={quickTimerOpen}
        locale={locale}
        onClose={() => setQuickTimerOpen(false)}
        onStartQuickWorkout={(quickWorkout) => launchWorkout(quickWorkout, false)}
      />
    </div>
  );
};
