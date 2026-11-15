import React, { useEffect, useRef } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import {
  CalendarDays,
  Dumbbell,
  Layers,
  Moon,
  Play,
  Plus,
  Settings,
  Sun,
} from 'lucide-react';
import { useSettingsStore } from '../../stores/settings-store';
import { useWorkoutStore } from '../../stores/workout-store';
import { UI_STRINGS } from '../../utils/i18n';

export const AppLayout: React.FC = () => {
  const locale = useSettingsStore((s) => s.locale);
  const theme = useSettingsStore((s) => s.theme);
  const setLocale = useSettingsStore((s) => s.setLocale);
  const toggleHeaderColorScheme = useSettingsStore((s) => s.toggleHeaderColorScheme);
  const hydrateSettings = useSettingsStore((s) => s.hydrate);
  const hydrateWorkouts = useWorkoutStore((s) => s.hydrate);
  const location = useLocation();

  const headerRef = useRef<HTMLElement>(null);
  const bottomNavRef = useRef<HTMLElement>(null);

  const t = UI_STRINGS[locale];

  useEffect(() => {
    void hydrateSettings();
    void hydrateWorkouts();
  }, [hydrateSettings, hydrateWorkouts]);

  useEffect(() => {
    const pageMap: Record<string, string> = {
      '/': `${t.nav.dashboard} · SetHane`,
      '/weekly': `${t.nav.weekly} · SetHane`,
      '/workouts': `${t.nav.workouts} · SetHane`,
      '/exercises': `${t.nav.exercises} · SetHane`,
      '/builder': `${t.nav.builder} · SetHane`,
      '/settings': `${t.nav.settings} · SetHane`,
      '/player': `Timer · SetHane`,
    };
    document.title = pageMap[location.pathname] ?? 'SetHane';
  }, [location.pathname, t]);

  // Fallback for browsers without CSS scroll-state container queries (content-first-noise-reduction)
  useEffect(() => {
    if (
      typeof CSS !== 'undefined' &&
      typeof CSS.supports === 'function' &&
      CSS.supports('container-type', 'scroll-state')
    ) {
      return;
    }
    let lastY = window.scrollY;
    const onScroll = () => {
      const maxScroll = Math.max(
        0,
        document.documentElement.scrollHeight - window.innerHeight
      );
      const y = Math.max(0, Math.min(window.scrollY, maxScroll));
      if (y === lastY) return;
      const topBar = headerRef.current;
      const bottomBar = bottomNavRef.current;
      const hide = y > lastY && y > (topBar?.offsetHeight ?? 52);
      topBar?.classList.toggle('is-hidden', hide);
      bottomBar?.classList.toggle('is-hidden', hide);
      lastY = y;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const navItems = [
    { to: '/', label: t.nav.dashboard, icon: Play },
    { to: '/weekly', label: t.nav.weekly, icon: CalendarDays },
    { to: '/exercises', label: t.nav.exercises, icon: Dumbbell },
    { to: '/workouts', label: t.nav.workouts, icon: Layers },
    { to: '/builder', label: t.nav.builder, icon: Plus },
    { to: '/settings', label: t.nav.settings, icon: Settings },
  ];

  return (
    <div className="min-h-dvh flex flex-col">
      <a href="#main-content" className="skip-link visually-hidden">
        {t.nav.skipToMain}
      </a>

      <header ref={headerRef} className="top-bar surface-card border-b">
        <div className="max-w-6xl mx-auto px-4 h-13 flex items-center justify-between gap-3">
          <NavLink
            to="/"
            className="flex items-center gap-2 font-black text-base tracking-tight no-underline"
          >
            <span
              className="w-2.5 h-2.5 rounded-xs bg-[var(--brand-accent)] inline-block"
              aria-hidden="true"
            />
            <span className="uppercase tracking-wider">SetHane</span>
          </NavLink>

          <nav aria-label="Primary" className="hidden md:flex items-center gap-0.5">
            {navItems.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/'}
                className={({ isActive }) =>
                  `inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors no-underline ${
                    isActive
                      ? 'surface-elevated text-[var(--brand-accent)]'
                      : 'text-muted-token hover:text-[var(--text-primary)]'
                  }`
                }
              >
                <Icon className="w-3.5 h-3.5" aria-hidden="true" />
                <span>{label}</span>
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => void setLocale(locale === 'tr' ? 'en' : 'tr')}
              className="surface-elevated px-2.5 py-1 rounded-lg text-[11px] font-bold mono-readout uppercase cursor-pointer hover:border-[var(--brand-accent)] transition-colors"
              aria-label={
                locale === 'tr' ? 'Switch interface to English' : 'Arayüz dilini Türkçeye çevir'
              }
            >
              {locale.toUpperCase()}
            </button>

            <button
              type="button"
              onClick={() => void toggleHeaderColorScheme()}
              className="surface-elevated p-1.5 rounded-lg cursor-pointer hover:border-[var(--brand-accent)] transition-colors inline-flex items-center justify-center"
              aria-label={
                theme === 'light'
                  ? locale === 'tr'
                    ? 'Karanlık temaya geç'
                    : 'Switch to dark theme'
                  : locale === 'tr'
                    ? 'Aydınlık temaya geç'
                    : 'Switch to light theme'
              }
            >
              {theme === 'light' ? (
                <Moon className="w-4 h-4" aria-hidden="true" />
              ) : (
                <Sun className="w-4 h-4" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </header>

      <main
        id="main-content"
        tabIndex={-1}
        className="flex-1 max-w-6xl w-full mx-auto px-4 py-5 pb-20 md:pb-10 focus:outline-none"
      >
        <Outlet />
      </main>

      <nav
        ref={bottomNavRef}
        aria-label="Mobile"
        className="bottom-bar md:hidden surface-card border-t bottom-nav-safe"
      >
        <div className="grid grid-cols-6 gap-0.5 pt-1">
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center py-1 px-1 rounded-lg text-[10px] font-bold no-underline ${
                  isActive ? 'text-[var(--brand-accent)]' : 'text-muted-token'
                }`
              }
            >
              <Icon className="w-4 h-4 mb-0.5" aria-hidden="true" />
              <span className="truncate max-w-full">{label}</span>
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  );
};
