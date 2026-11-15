import React, { useSyncExternalStore } from 'react';
import { Pause, Play } from 'lucide-react';
import { useSettingsStore } from '../../stores/settings-store';
import type { ExerciseMedia, SupportedLocale } from '../../types';
import { resolveAssetUrl } from '../../utils/assets';
import { UI_STRINGS } from '../../utils/i18n';

function subscribeReducedMotion(callback: () => void): () => void {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
    return () => {};
  }
  const mql = window.matchMedia('(prefers-reduced-motion: reduce)');
  mql.addEventListener('change', callback);
  return () => mql.removeEventListener('change', callback);
}

function getReducedMotionSnapshot(): boolean {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
    return false;
  }
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function useEffectiveMotionPlaying(): {
  isPlaying: boolean;
  toggleMotion: () => void;
} {
  const motionPreference = useSettingsStore((s) => s.motionPreference);
  const setMotionPreference = useSettingsStore((s) => s.setMotionPreference);
  const prefersReducedMotion = useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotionSnapshot,
    () => false
  );

  const isPlaying =
    motionPreference === 'auto' ? !prefersReducedMotion : motionPreference === 'play';

  const toggleMotion = () => {
    setMotionPreference(isPlaying ? 'pause' : 'play');
  };

  return { isPlaying, toggleMotion };
}

interface ExerciseVisualProps {
  media: ExerciseMedia;
  locale: SupportedLocale;
  className?: string;
  loading?: 'lazy' | 'eager';
  staticOnly?: boolean;
}

export const ExerciseVisual: React.FC<ExerciseVisualProps> = ({
  media,
  locale,
  className = 'w-full h-44 object-contain mx-auto',
  loading,
  staticOnly = false,
}) => {
  const motionPreference = useSettingsStore((s) => s.motionPreference);
  const animatedUrl = resolveAssetUrl(media.src);
  const posterUrl = resolveAssetUrl(media.posterSrc ?? media.src);

  if (staticOnly || motionPreference === 'pause') {
    return (
      <img
        src={posterUrl}
        alt={media.alt[locale]}
        width={480}
        height={336}
        loading={loading}
        className={className}
      />
    );
  }

  if (motionPreference === 'play') {
    return (
      <img
        src={animatedUrl}
        alt={media.alt[locale]}
        width={480}
        height={336}
        loading={loading}
        className={className}
      />
    );
  }

  // Default ('auto'): Opt in to animated GIF via media="(prefers-reduced-motion: no-preference)"
  return (
    <picture className="block w-full">
      <source srcSet={animatedUrl} media="(prefers-reduced-motion: no-preference)" />
      <img
        src={posterUrl}
        alt={media.alt[locale]}
        width={480}
        height={336}
        loading={loading}
        className={className}
      />
    </picture>
  );
};

interface MotionToggleButtonProps {
  locale: SupportedLocale;
  variant?: 'surface' | 'dark';
}

export const MotionToggleButton: React.FC<MotionToggleButtonProps> = ({
  locale,
  variant = 'surface',
}) => {
  const { isPlaying, toggleMotion } = useEffectiveMotionPlaying();
  const t = UI_STRINGS[locale].exercises;

  const baseStyles =
    variant === 'dark'
      ? 'px-3 py-2 rounded-xl text-xs font-bold inline-flex items-center gap-1.5 border bg-slate-900 border-slate-800 text-slate-300 hover:border-emerald-500/50 cursor-pointer transition-colors'
      : 'surface-elevated hover:border-emerald-500/50 px-3 py-1.5 rounded-xl text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer transition-colors';

  // Per modern-web-guidance `motion`: label changes between "Pause" and "Play", so omit `aria-pressed`.
  return (
    <button
      type="button"
      onClick={toggleMotion}
      data-testid="toggle-exercise-animations"
      className={baseStyles}
    >
      {isPlaying ? (
        <Pause className="w-3.5 h-3.5 text-amber-400" aria-hidden="true" />
      ) : (
        <Play className="w-3.5 h-3.5 text-emerald-500" aria-hidden="true" />
      )}
      <span>{isPlaying ? t.pauseAnimations : t.playAnimations}</span>
    </button>
  );
};
