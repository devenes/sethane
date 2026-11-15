import React, { useEffect, useId, useRef, useState } from 'react';
import { Play, Timer, X } from 'lucide-react';
import type { SupportedLocale, WorkoutPlan } from '../../types';
import { UI_STRINGS } from '../../utils/i18n';

interface QuickTimerModalProps {
  open: boolean;
  locale: SupportedLocale;
  onClose: () => void;
  onStartQuickWorkout: (workout: WorkoutPlan) => void;
}

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

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (open && !dialog.open) {
      dialog.showModal();
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  const handleLaunch = (e: React.FormEvent) => {
    e.preventDefault();
    const safeWork = Math.max(5, Math.min(600, workSeconds));
    const safeRest = Math.max(0, Math.min(600, restSeconds));
    const safeRounds = Math.max(1, Math.min(50, rounds));
    const safePrep = Math.max(0, Math.min(60, prepareSeconds));

    const quickWorkout: WorkoutPlan = {
      id: `quick-hiit-${Date.now()}`,
      name:
        locale === 'tr'
          ? `Hızlı HIIT (${safeRounds}× ${safeWork}sn/${safeRest}sn)`
          : `Quick HIIT (${safeRounds}× ${safeWork}s/${safeRest}s)`,
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

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={titleId}
      onClose={onClose}
      className="surface-card rounded-2xl p-6 max-w-md w-[calc(100%-2rem)] m-auto shadow-2xl"
    >
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="flex items-center gap-2.5">
          <span className="p-2 rounded-xl bg-emerald-500/15 text-emerald-500">
            <Timer className="w-5 h-5" aria-hidden="true" />
          </span>
          <div>
            <h2 id={titleId} className="text-lg font-bold m-0">
              {t.title}
            </h2>
            <p className="text-xs text-muted-token m-0 mt-0.5">{t.subtitle}</p>
          </div>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label={t.cancel}
          className="surface-elevated p-2 rounded-xl cursor-pointer"
        >
          <X className="w-4 h-4" aria-hidden="true" />
        </button>
      </div>

      <form onSubmit={handleLaunch} className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label htmlFor={workInputId} className="block text-xs font-semibold mb-1">
              {t.workSeconds}
            </label>
            <input
              id={workInputId}
              type="number"
              min={5}
              max={600}
              value={workSeconds}
              onChange={(e) => setWorkSeconds(Number(e.target.value))}
              className="surface-elevated w-full px-3 py-2 rounded-xl font-bold text-base"
              required
            />
          </div>
          <div>
            <label htmlFor={restInputId} className="block text-xs font-semibold mb-1">
              {t.restSeconds}
            </label>
            <input
              id={restInputId}
              type="number"
              min={0}
              max={600}
              value={restSeconds}
              onChange={(e) => setRestSeconds(Number(e.target.value))}
              className="surface-elevated w-full px-3 py-2 rounded-xl font-bold text-base"
              required
            />
          </div>
          <div>
            <label htmlFor={roundsInputId} className="block text-xs font-semibold mb-1">
              {t.rounds}
            </label>
            <input
              id={roundsInputId}
              type="number"
              min={1}
              max={50}
              value={rounds}
              onChange={(e) => setRounds(Number(e.target.value))}
              className="surface-elevated w-full px-3 py-2 rounded-xl font-bold text-base"
              required
            />
          </div>
          <div>
            <label htmlFor={prepInputId} className="block text-xs font-semibold mb-1">
              {t.prepareSeconds}
            </label>
            <input
              id={prepInputId}
              type="number"
              min={0}
              max={60}
              value={prepareSeconds}
              onChange={(e) => setPrepareSeconds(Number(e.target.value))}
              className="surface-elevated w-full px-3 py-2 rounded-xl font-bold text-base"
              required
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="surface-elevated px-4 py-2.5 rounded-xl text-sm font-semibold cursor-pointer"
          >
            {t.cancel}
          </button>
          <button
            type="submit"
            className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-5 py-2.5 rounded-xl text-sm inline-flex items-center gap-2 cursor-pointer transition-colors"
          >
            <Play className="w-4 h-4 fill-current" aria-hidden="true" />
            <span>{t.launch}</span>
          </button>
        </div>
      </form>
    </dialog>
  );
};
