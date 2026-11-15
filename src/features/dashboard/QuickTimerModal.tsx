import React, { useId, useRef, useState } from 'react';
import { Play, X } from 'lucide-react';
import type { SupportedLocale, WorkoutPlan } from '../../types';
import { useLightDismissDialog } from '../../utils/dialog';
import { UI_STRINGS } from '../../utils/i18n';

interface QuickTimerModalProps {
  open: boolean;
  locale: SupportedLocale;
  onClose: () => void;
  onStartQuickWorkout: (workout: WorkoutPlan) => void;
}

const QUICK_PRESETS = [
  { label: '20/10 ×8', work: 20, rest: 10, rounds: 8 },
  { label: '35/15 ×6', work: 35, rest: 15, rounds: 6 },
  { label: '40/20 ×5', work: 40, rest: 20, rounds: 5 },
  { label: '45/15 ×4', work: 45, rest: 15, rounds: 4 },
] as const;

export const QuickTimerModal: React.FC<QuickTimerModalProps> = ({
  open,
  locale,
  onClose,
  onStartQuickWorkout,
}) => {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const workInputId = useId();
  const restInputId = useId();
  const roundsInputId = useId();
  const prepInputId = useId();

  const [workSeconds, setWorkSeconds] = useState(35);
  const [restSeconds, setRestSeconds] = useState(15);
  const [rounds, setRounds] = useState(6);
  const [prepareSeconds, setPrepareSeconds] = useState(5);

  const t = UI_STRINGS[locale].quickTimer;

  useLightDismissDialog(dialogRef, open);

  const launchWith = (w: number, r: number, rnd: number, prep: number) => {
    const safeWork = Math.max(5, Math.min(600, w));
    const safeRest = Math.max(0, Math.min(600, r));
    const safeRounds = Math.max(1, Math.min(50, rnd));
    const safePrep = Math.max(0, Math.min(60, prep));

    const quickWorkout: WorkoutPlan = {
      id: `quick-hiit-${Date.now()}`,
      name: `${safeRounds}× ${safeWork}s/${safeRest}s`,
      prepareSeconds: safePrep,
      warmupSeconds: 0,
      rounds: safeRounds,
      restBetweenRounds: safeRest,
      cooldownSeconds: 0,
      exercises: [
        {
          exerciseId: 'jumping-jacks',
          workSeconds: safeWork,
          restSeconds: 0,
        },
      ],
    };

    onClose();
    onStartQuickWorkout(quickWorkout);
  };

  const handleLaunch = (e: React.FormEvent) => {
    e.preventDefault();
    launchWith(workSeconds, restSeconds, rounds, prepareSeconds);
  };

  return (
    <dialog
      ref={dialogRef}
      {...({ closedby: 'any' } as Record<string, unknown>)}
      aria-labelledby={titleId}
      onClose={onClose}
      className="surface-card rounded-xl p-5 max-w-sm w-[calc(100%-2rem)] m-auto shadow-2xl"
    >
      <div className="flex items-center justify-between gap-3 mb-3">
        <h2 id={titleId} className="text-base font-extrabold m-0">
          {t.title}
        </h2>
        <button
          type="button"
          onClick={onClose}
          aria-label={t.cancel}
          className="surface-elevated p-1.5 rounded-lg cursor-pointer"
        >
          <X className="w-4 h-4" aria-hidden="true" />
        </button>
      </div>

      {/* 1-Tap Quick Presets */}
      <div className="grid grid-cols-4 gap-1.5 mb-4">
        {QUICK_PRESETS.map((p) => (
          <button
            key={p.label}
            type="button"
            onClick={() => {
              setWorkSeconds(p.work);
              setRestSeconds(p.rest);
              setRounds(p.rounds);
            }}
            className={`py-1.5 px-1 rounded-lg text-[11px] font-bold mono-readout cursor-pointer border transition-colors ${
              workSeconds === p.work && restSeconds === p.rest && rounds === p.rounds
                ? 'border-[var(--brand-accent)] text-[var(--brand-accent)] surface-elevated'
                : 'surface-elevated text-muted-token hover:text-[var(--text-primary)]'
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>

      <form onSubmit={handleLaunch} className="space-y-3.5">
        <div className="grid grid-cols-2 gap-2.5">
          <div>
            <label htmlFor={workInputId} className="block text-xs font-semibold text-muted-token mb-1">
              {t.workSeconds}
            </label>
            <input
              id={workInputId}
              type="number"
              min={5}
              max={600}
              value={workSeconds}
              onChange={(e) => setWorkSeconds(Number(e.target.value))}
              className="surface-elevated w-full px-3 py-2 rounded-lg font-bold mono-readout text-sm"
              required
            />
          </div>
          <div>
            <label htmlFor={restInputId} className="block text-xs font-semibold text-muted-token mb-1">
              {t.restSeconds}
            </label>
            <input
              id={restInputId}
              type="number"
              min={0}
              max={600}
              value={restSeconds}
              onChange={(e) => setRestSeconds(Number(e.target.value))}
              className="surface-elevated w-full px-3 py-2 rounded-lg font-bold mono-readout text-sm"
              required
            />
          </div>
          <div>
            <label htmlFor={roundsInputId} className="block text-xs font-semibold text-muted-token mb-1">
              {t.rounds}
            </label>
            <input
              id={roundsInputId}
              type="number"
              min={1}
              max={50}
              value={rounds}
              onChange={(e) => setRounds(Number(e.target.value))}
              className="surface-elevated w-full px-3 py-2 rounded-lg font-bold mono-readout text-sm"
              required
            />
          </div>
          <div>
            <label htmlFor={prepInputId} className="block text-xs font-semibold text-muted-token mb-1">
              {t.prepareSeconds}
            </label>
            <input
              id={prepInputId}
              type="number"
              min={0}
              max={60}
              value={prepareSeconds}
              onChange={(e) => setPrepareSeconds(Number(e.target.value))}
              className="surface-elevated w-full px-3 py-2 rounded-lg font-bold mono-readout text-sm"
              required
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 pt-1">
          <button
            type="button"
            onClick={onClose}
            className="surface-elevated px-3.5 py-2 rounded-lg text-xs font-semibold cursor-pointer"
          >
            {t.cancel}
          </button>
          <button
            type="submit"
            className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold px-4 py-2 rounded-lg text-xs inline-flex items-center gap-1.5 cursor-pointer transition-colors"
          >
            <Play className="w-3.5 h-3.5 fill-current" aria-hidden="true" />
            <span>{t.launch}</span>
          </button>
        </div>
      </form>
    </dialog>
  );
};
