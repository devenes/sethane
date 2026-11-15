import React, { useEffect } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import {
  Activity,
  Dumbbell,
  Flame,
  LayoutDashboard,
  Moon,
  PlusSquare,
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

  const t = UI_STRINGS[locale];

  useEffect(() => {
    void hydrateSettings();
    void hydrateWorkouts();
  }, [hydrateSettings, hydrateWorkouts]);

  useEffect(() => {
    const pageMap: Record<string, string> = {
      '/': `${t.nav.dashboard} | SetHane`,
      '/workouts': `${t.nav.workouts} | SetHane`,
      '/exercises': `${t.nav.exercises} | SetHane`,
      '/builder': `${t.nav.builder} | SetHane`,
      '/settings': `${t.nav.settings} | SetHane`,
      '/player': `Workout Player | SetHane`,
    };
    document.title = pageMap[location.pathname] ?? 'SetHane — Workout & HIIT Trainer';
  }, [location.pathname, t]);

  const navItems = [
    { to: '/', label: t.nav.dashboard, icon: LayoutDashboard },
    { to: '/workouts', label: t.nav.workouts, icon: Flame },
    { to: '/exercises', label: t.nav.exercises, icon: Dumbbell },
    { to: '/builder', label: t.nav.builder, icon: PlusSquare },
    { to: '/settings', label: t.nav.settings, icon: Settings },
  ];

  return (
    <div className="min-h-dvh flex flex-col">
      <a href="#main-content" className="skip-link visually-hidden">
        {t.nav.skipToMain}
      </a>

      <header className="sticky top-0 z-30 surface-card border-b backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3">
          <NavLink
            to="/"
            className="flex items-center gap-2.5 font-extrabold text-xl tracking-tight no-underline"
          >
            <span className="inline-flex items-center justify-center w-9 h-9 rounded-xl bg-emerald-500/15 text-emerald-500 border border-emerald-500/30">
              <Activity className="w-5 h-5" aria-hidden="true" />
            </span>
            <span>
              Set<span className="text-emerald-500">Hane</span>
            </span>
          </NavLink>

          <nav aria-label="Primary" className="hidden md:flex items-center gap-1">
            {navItems.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/'}
                className={({ isActive }) =>
                  `inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-semibold transition-colors no-underline ${
                    isActive
                      ? 'bg-emerald-500/15 text-emerald-500 border border-emerald-500/30'
                      : 'text-muted-token hover:text-emerald-500'
                  }`
                }
              >
                <Icon className="w-4 h-4" aria-hidden="true" />
                <span>{label}</span>
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => void setLocale(locale === 'tr' ? 'en' : 'tr')}
              className="surface-elevated px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider cursor-pointer hover:border-emerald-500/50 transition-colors"
              aria-label={
                locale === 'tr' ? 'Switch interface to English' : 'Arayüz dilini Türkçeye çevir'
              }
            >
              {locale === 'tr' ? 'TR · EN' : 'EN · TR'}
            </button>

            <button
              type="button"
              onClick={() => void toggleHeaderColorScheme()}
              className="surface-elevated p-2 rounded-xl cursor-pointer hover:border-emerald-500/50 transition-colors inline-flex items-center justify-center"
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
                <Moon className="w-4 h-4 text-slate-700" aria-hidden="true" />
              ) : (
                <Sun className="w-4 h-4 text-amber-400" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </header>

      <main
        id="main-content"
        tabIndex={-1}
        className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 pb-24 md:pb-12 focus:outline-none"
      >
        <Outlet />
      </main>

      <footer className="hidden md:block border-t border-[var(--border-subtle)] py-6 text-center text-xs text-muted-token">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <span>SetHane — Open-Source Local-First HIIT & Workout PWA (MIT License)</span>
          <span>100% Static · Offline Capable · Zero Tracking</span>
        </div>
      </footer>

      <nav
        aria-label="Mobile"
        className="md:hidden fixed bottom-0 left-0 right-0 z-30 surface-card border-t bottom-nav-safe"
      >
        <div className="grid grid-cols-5 gap-1 pt-1.5">
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center py-1.5 px-1 rounded-xl text-[11px] font-semibold no-underline ${
                  isActive ? 'text-emerald-500' : 'text-muted-token'
                }`
              }
            >
              <Icon className="w-5 h-5 mb-0.5" aria-hidden="true" />
              <span className="truncate max-w-full">{label}</span>
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  );
};
