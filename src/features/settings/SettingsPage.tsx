import React, { useEffect, useId, useRef, useState } from 'react';
import {
  AlertCircle,
  CheckCircle2,
  Download,
  Globe,
  Trash2,
  Upload,
  Volume2,
} from 'lucide-react';
import { soundService } from '../../services/audio/sound-service';
import { speechService } from '../../services/speech/speech-service';
import {
  exportBackupAsJsonString,
  importBackupFromJsonString,
} from '../../services/storage/backup-service';
import { useSettingsStore } from '../../stores/settings-store';
import { useWorkoutStore } from '../../stores/workout-store';
import type { SupportedLocale, ThemeMode } from '../../types';
import { UI_STRINGS } from '../../utils/i18n';

export const SettingsPage: React.FC = () => {
  const locale = useSettingsStore((s) => s.locale);
  const theme = useSettingsStore((s) => s.theme);
  const soundEnabled = useSettingsStore((s) => s.soundEnabled);
  const speechEnabled = useSettingsStore((s) => s.speechEnabled);
  const countdownBeepsEnabled = useSettingsStore((s) => s.countdownBeepsEnabled);
  const wakeLockEnabled = useSettingsStore((s) => s.wakeLockEnabled);
  const preferredVoiceURI = useSettingsStore((s) => s.preferredVoiceURI);
  const soundVolume = useSettingsStore((s) => s.soundVolume);
  const setLocale = useSettingsStore((s) => s.setLocale);
  const setTheme = useSettingsStore((s) => s.setTheme);
  const updateSettings = useSettingsStore((s) => s.updateSettings);
  const hydrateSettings = useSettingsStore((s) => s.hydrate);
  const hydrateWorkouts = useWorkoutStore((s) => s.hydrate);
  const clearHistory = useWorkoutStore((s) => s.clearHistory);

  const t = UI_STRINGS[locale].settings;

  const langSelectId = useId();
  const themeSelectId = useId();
  const voiceSelectId = useId();
  const mergeFileInputRef = useRef<HTMLInputElement>(null);
  const replaceFileInputRef = useRef<HTMLInputElement>(null);

  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [statusMessage, setStatusMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  useEffect(() => {
    const loadVoices = () => {
      setVoices(speechService.getVoicesForLocale(locale));
    };
    loadVoices();
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
  }, [locale]);

  const handleTestAudio = () => {
    soundService.unlock();
    soundService.playWorkStart(soundVolume);
    speechService.speak(
      locale === 'tr'
        ? 'SetHane ses ve konuşma testi başarılı!'
        : 'SetHane audio and speech test successful!',
      { locale, voiceURI: preferredVoiceURI, volume: soundVolume }
    );
  };

  const handleExportBackup = async () => {
    const jsonString = await exportBackupAsJsonString();
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sethane-backup-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImportFile = async (
    event: React.ChangeEvent<HTMLInputElement>,
    mode: 'merge' | 'replace'
  ) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;

    const rawText = await file.text();
    const result = await importBackupFromJsonString(rawText, mode);
    if (result.success) {
      await hydrateSettings();
      await hydrateWorkouts();
      setStatusMessage({
        type: 'success',
        text: `${t.importSuccess} (${result.workoutsImported} workouts, ${result.historyImported} history items)`,
      });
    } else {
      setStatusMessage({
        type: 'error',
        text: result.error ?? 'Import failed.',
      });
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-black m-0">{t.title}</h1>
        <p className="text-sm sm:text-base text-muted-token m-0">{t.subtitle}</p>
      </div>

      {statusMessage && (
        <div
          role={statusMessage.type === 'error' ? 'alert' : 'status'}
          data-testid="settings-status-banner"
          className={`rounded-2xl px-4 py-3 text-sm font-bold flex items-center gap-2 border ${
            statusMessage.type === 'success'
              ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-400'
              : 'bg-rose-500/15 border-rose-500/40 text-rose-400'
          }`}
        >
          {statusMessage.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 shrink-0" aria-hidden="true" />
          ) : (
            <AlertCircle className="w-4 h-4 shrink-0" aria-hidden="true" />
          )}
          <span>{statusMessage.text}</span>
        </div>
      )}

      {/* Appearance & Localization */}
      <section className="surface-card rounded-2xl p-5 space-y-4">
        <h2 className="text-lg font-extrabold m-0 flex items-center gap-2">
          <Globe className="w-5 h-5 text-emerald-500" aria-hidden="true" />
          <span>{t.appearanceHeading}</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor={langSelectId} className="block text-xs font-bold mb-1.5">
              {t.languageLabel}
            </label>
            <select
              id={langSelectId}
              data-testid="settings-locale-select"
              value={locale}
              onChange={(e) => void setLocale(e.target.value as SupportedLocale)}
              className="surface-elevated w-full px-3.5 py-2.5 rounded-xl text-sm font-semibold"
            >
              <option value="tr">Türkçe (TR)</option>
              <option value="en">English (EN)</option>
            </select>
          </div>

          <div>
            <label htmlFor={themeSelectId} className="block text-xs font-bold mb-1.5">
              {t.themeLabel}
            </label>
            <select
              id={themeSelectId}
              data-testid="settings-theme-select"
              value={theme}
              onChange={(e) => void setTheme(e.target.value as ThemeMode)}
              className="surface-elevated w-full px-3.5 py-2.5 rounded-xl text-sm font-semibold"
            >
              <option value="system">{t.themeSystem}</option>
              <option value="light">{t.themeLight}</option>
              <option value="dark">{t.themeDark}</option>
            </select>
          </div>
        </div>
      </section>

      {/* Audio & Voice Settings */}
      <section className="surface-card rounded-2xl p-5 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-lg font-extrabold m-0 flex items-center gap-2">
            <Volume2 className="w-5 h-5 text-cyan-500" aria-hidden="true" />
            <span>{t.audioHeading}</span>
          </h2>

          <button
            type="button"
            onClick={handleTestAudio}
            className="surface-elevated hover:border-emerald-500/50 px-3.5 py-2 rounded-xl text-xs font-bold cursor-pointer"
          >
            {t.testAudioBtn}
          </button>
        </div>

        <div className="space-y-3">
          <label className="surface-elevated rounded-xl p-3.5 flex items-center justify-between gap-3 cursor-pointer">
            <span className="text-sm font-semibold">{t.soundToggle}</span>
            <input
              type="checkbox"
              checked={soundEnabled}
              onChange={(e) => void updateSettings({ soundEnabled: e.target.checked })}
              className="w-5 h-5"
            />
          </label>

          <label className="surface-elevated rounded-xl p-3.5 flex items-center justify-between gap-3 cursor-pointer">
            <span className="text-sm font-semibold">{t.countdownToggle}</span>
            <input
              type="checkbox"
              checked={countdownBeepsEnabled}
              onChange={(e) => void updateSettings({ countdownBeepsEnabled: e.target.checked })}
              className="w-5 h-5"
            />
          </label>

          <label className="surface-elevated rounded-xl p-3.5 flex items-center justify-between gap-3 cursor-pointer">
            <span className="text-sm font-semibold">{t.speechToggle}</span>
            <input
              type="checkbox"
              checked={speechEnabled}
              onChange={(e) => void updateSettings({ speechEnabled: e.target.checked })}
              className="w-5 h-5"
            />
          </label>

          <label className="surface-elevated rounded-xl p-3.5 flex items-center justify-between gap-3 cursor-pointer">
            <span className="text-sm font-semibold">{t.wakeLockToggle}</span>
            <input
              type="checkbox"
              checked={wakeLockEnabled}
              onChange={(e) => void updateSettings({ wakeLockEnabled: e.target.checked })}
              className="w-5 h-5"
            />
          </label>

          <div>
            <label htmlFor={voiceSelectId} className="block text-xs font-bold mb-1.5">
              {t.voiceSelectLabel}
            </label>
            <select
              id={voiceSelectId}
              value={preferredVoiceURI ?? ''}
              onChange={(e) =>
                void updateSettings({ preferredVoiceURI: e.target.value || null })
              }
              className="surface-elevated w-full px-3.5 py-2.5 rounded-xl text-sm font-semibold"
            >
              <option value="">{t.voiceAuto}</option>
              {voices.map((v) => (
                <option key={v.voiceURI} value={v.voiceURI}>
                  {v.name} ({v.lang})
                </option>
              ))}
            </select>
          </div>
        </div>
      </section>

      {/* Local Data Backup (Export / Import JSON) */}
      <section className="surface-card rounded-2xl p-5 space-y-4">
        <h2 className="text-lg font-extrabold m-0">{t.backupHeading}</h2>
        <p className="text-sm text-muted-token m-0 leading-relaxed">{t.backupDescription}</p>

        <div className="flex flex-wrap items-center gap-3 pt-1">
          <button
            type="button"
            onClick={() => void handleExportBackup()}
            data-testid="btn-export-json"
            className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold px-4 py-2.5 rounded-xl text-xs inline-flex items-center gap-2 cursor-pointer"
          >
            <Download className="w-4 h-4" aria-hidden="true" />
            <span>{t.exportBtn}</span>
          </button>

          <input
            ref={mergeFileInputRef}
            type="file"
            accept="application/json,.json"
            onChange={(e) => void handleImportFile(e, 'merge')}
            className="hidden"
          />
          <button
            type="button"
            onClick={() => mergeFileInputRef.current?.click()}
            data-testid="btn-import-merge"
            className="surface-elevated hover:border-emerald-500/50 font-bold px-4 py-2.5 rounded-xl text-xs inline-flex items-center gap-2 cursor-pointer"
          >
            <Upload className="w-4 h-4 text-cyan-500" aria-hidden="true" />
            <span>{t.importMergeBtn}</span>
          </button>

          <input
            ref={replaceFileInputRef}
            type="file"
            accept="application/json,.json"
            onChange={(e) => void handleImportFile(e, 'replace')}
            className="hidden"
          />
          <button
            type="button"
            onClick={() => replaceFileInputRef.current?.click()}
            className="surface-elevated hover:border-amber-500/50 font-bold px-4 py-2.5 rounded-xl text-xs inline-flex items-center gap-2 cursor-pointer"
          >
            <Upload className="w-4 h-4 text-amber-500" aria-hidden="true" />
            <span>{t.importReplaceBtn}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              void clearHistory();
              setStatusMessage({ type: 'success', text: t.historyCleared });
            }}
            className="surface-elevated hover:border-rose-500/50 text-rose-500 font-bold px-4 py-2.5 rounded-xl text-xs inline-flex items-center gap-2 cursor-pointer"
          >
            <Trash2 className="w-4 h-4" aria-hidden="true" />
            <span>{t.clearHistoryBtn}</span>
          </button>
        </div>
      </section>
    </div>
  );
};
