import React, { useEffect, useId, useRef, useState } from 'react';
import { AlertCircle, CheckCircle2, Download, Trash2, Upload, Volume2 } from 'lucide-react';
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
    return speechService.subscribeVoicesChanged(loadVoices);
  }, [locale]);

  const handleTestAudio = () => {
    soundService.unlock();
    soundService.playWorkStart(soundVolume);
    speechService.speak(
      locale === 'tr' ? 'Ses testi hazır.' : 'Audio check ready.',
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
        text: `${t.importSuccess} (${result.workoutsImported})`,
      });
    } else {
      setStatusMessage({
        type: 'error',
        text: result.error ?? 'Import failed.',
      });
    }
  };

  return (
    <div className="space-y-4 max-w-2xl">
      <h1 className="text-xl sm:text-2xl font-black m-0">{t.title}</h1>

      {statusMessage && (
        <div
          role={statusMessage.type === 'error' ? 'alert' : 'status'}
          data-testid="settings-status-banner"
          className={`rounded-xl px-3.5 py-2.5 text-xs font-bold flex items-center gap-2 border ${
            statusMessage.type === 'success'
              ? 'bg-emerald-500/15 border-emerald-500/40 text-[var(--brand-accent)]'
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
      <section className="surface-card rounded-xl p-4 space-y-3">
        <h2 className="text-xs font-extrabold uppercase tracking-wider text-muted-token m-0">
          {t.appearanceHeading}
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label htmlFor={langSelectId} className="block text-xs font-bold mb-1">
              {t.languageLabel}
            </label>
            <select
              id={langSelectId}
              data-testid="settings-locale-select"
              value={locale}
              onChange={(e) => void setLocale(e.target.value as SupportedLocale)}
              className="surface-elevated w-full px-3 py-2 rounded-lg text-xs font-semibold"
            >
              <option value="tr">Türkçe</option>
              <option value="en">English</option>
            </select>
          </div>

          <div>
            <label htmlFor={themeSelectId} className="block text-xs font-bold mb-1">
              {t.themeLabel}
            </label>
            <select
              id={themeSelectId}
              data-testid="settings-theme-select"
              value={theme}
              onChange={(e) => void setTheme(e.target.value as ThemeMode)}
              className="surface-elevated w-full px-3 py-2 rounded-lg text-xs font-semibold"
            >
              <option value="system">{t.themeSystem}</option>
              <option value="light">{t.themeLight}</option>
              <option value="dark">{t.themeDark}</option>
            </select>
          </div>
        </div>
      </section>

      {/* Audio & Voice Settings */}
      <section className="surface-card rounded-xl p-4 space-y-3">
        <div className="flex items-center justify-between gap-2">
          <h2 className="text-xs font-extrabold uppercase tracking-wider text-muted-token m-0">
            {t.audioHeading}
          </h2>
          <button
            type="button"
            onClick={handleTestAudio}
            className="surface-elevated hover:border-[var(--brand-accent)] px-2.5 py-1.5 rounded-lg text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer"
          >
            <Volume2 className="w-3.5 h-3.5 text-[var(--brand-accent)]" aria-hidden="true" />
            <span>{t.testAudioBtn}</span>
          </button>
        </div>

        <div className="space-y-2">
          <label className="surface-elevated rounded-lg px-3 py-2.5 flex items-center justify-between gap-3 cursor-pointer">
            <span className="text-xs font-semibold">{t.soundToggle}</span>
            <input
              type="checkbox"
              checked={soundEnabled}
              onChange={(e) => void updateSettings({ soundEnabled: e.target.checked })}
              className="w-4 h-4"
            />
          </label>

          <label className="surface-elevated rounded-lg px-3 py-2.5 flex items-center justify-between gap-3 cursor-pointer">
            <span className="text-xs font-semibold">{t.countdownToggle}</span>
            <input
              type="checkbox"
              checked={countdownBeepsEnabled}
              onChange={(e) => void updateSettings({ countdownBeepsEnabled: e.target.checked })}
              className="w-4 h-4"
            />
          </label>

          <label className="surface-elevated rounded-lg px-3 py-2.5 flex items-center justify-between gap-3 cursor-pointer">
            <span className="text-xs font-semibold">{t.speechToggle}</span>
            <input
              type="checkbox"
              checked={speechEnabled}
              onChange={(e) => void updateSettings({ speechEnabled: e.target.checked })}
              className="w-4 h-4"
            />
          </label>

          <label className="surface-elevated rounded-lg px-3 py-2.5 flex items-center justify-between gap-3 cursor-pointer">
            <span className="text-xs font-semibold">{t.wakeLockToggle}</span>
            <input
              type="checkbox"
              checked={wakeLockEnabled}
              onChange={(e) => void updateSettings({ wakeLockEnabled: e.target.checked })}
              className="w-4 h-4"
            />
          </label>

          <div className="pt-1">
            <label htmlFor={voiceSelectId} className="block text-xs font-bold mb-1">
              {t.voiceSelectLabel}
            </label>
            <select
              id={voiceSelectId}
              value={
                preferredVoiceURI && voices.some((v) => v.voiceURI === preferredVoiceURI)
                  ? preferredVoiceURI
                  : ''
              }
              onChange={(e) =>
                void updateSettings({ preferredVoiceURI: e.target.value || null })
              }
              className="surface-elevated w-full px-3 py-2 rounded-lg text-xs font-semibold"
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
      <section className="surface-card rounded-xl p-4 space-y-3">
        <h2 className="text-xs font-extrabold uppercase tracking-wider text-muted-token m-0">
          {t.backupHeading}
        </h2>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => void handleExportBackup()}
            data-testid="btn-export-json"
            className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold px-3.5 py-2 rounded-lg text-xs inline-flex items-center gap-1.5 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" aria-hidden="true" />
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
            className="surface-elevated hover:border-[var(--brand-accent)] font-bold px-3 py-2 rounded-lg text-xs inline-flex items-center gap-1.5 cursor-pointer"
          >
            <Upload className="w-3.5 h-3.5" aria-hidden="true" />
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
            className="surface-elevated hover:border-[var(--brand-accent)] font-bold px-3 py-2 rounded-lg text-xs inline-flex items-center gap-1.5 cursor-pointer"
          >
            <Upload className="w-3.5 h-3.5" aria-hidden="true" />
            <span>{t.importReplaceBtn}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              void clearHistory();
              setStatusMessage({ type: 'success', text: t.historyCleared });
            }}
            className="surface-elevated hover:border-rose-500/50 text-rose-500 font-bold px-3 py-2 rounded-lg text-xs inline-flex items-center gap-1.5 cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
            <span>{t.clearHistoryBtn}</span>
          </button>
        </div>

        <details className="text-xs text-muted-token">
          <summary className="cursor-pointer font-semibold select-none">
            {t.backupDetailsSummary}
          </summary>
          <p className="m-0 pt-1.5 leading-relaxed">{t.backupDescription}</p>
        </details>
      </section>
    </div>
  );
};
