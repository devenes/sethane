import type { SupportedLocale } from '../types';

export function formatClock(totalSeconds: number): string {
  const safe = Math.max(0, Math.ceil(totalSeconds));
  const mins = Math.floor(safe / 60);
  const secs = safe % 60;
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

export function formatHumanDuration(totalSeconds: number, locale: SupportedLocale): string {
  const safe = Math.max(0, Math.round(totalSeconds));
  const mins = Math.floor(safe / 60);
  const secs = safe % 60;

  if (locale === 'tr') {
    if (mins === 0) return `${secs} sn`;
    if (secs === 0) return `${mins} dk`;
    return `${mins} dk ${secs} sn`;
  }

  if (mins === 0) return `${secs}s`;
  if (secs === 0) return `${mins}m`;
  return `${mins}m ${secs}s`;
}
