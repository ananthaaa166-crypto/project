import { useCallback, useEffect, useMemo, useState } from 'react';
import { Zap } from 'lucide-react';
import { Navigation, type ViewId } from '@/components/Navigation';
import { Home } from '@/components/Home';
import { Stopwatch } from '@/components/Stopwatch';
import { Statistics } from '@/components/Statistics';
import { AIAnalysis } from '@/components/AIAnalysis';
import { History } from '@/components/History';
import { Settings } from '@/components/Settings';
import { useStopwatch } from '@/hooks/useStopwatch';
import { computeStats } from '@/utils/statistics';
import {
  loadSessions,
  saveSessions,
  loadSettings,
  saveSettings,
  type Session,
  type Settings as SettingsType,
} from '@/utils/storage';
import { requestWakeLock, playStart, playLap, playReset, vibrate } from '@/utils/feedback';

export default function App() {
  const [view, setView] = useState<ViewId>('home');
  const [settings, setSettings] = useState<SettingsType>(() => loadSettings());
  const [sessions, setSessions] = useState<Session[]>(() => loadSessions());

  // Stopwatch state lifted to App so Statistics/AI/History share live data
  const { elapsed, isRunning, laps, startPause, lap, reset } = useStopwatch();
  const stats = useMemo(() => computeStats(laps), [laps]);

  const feedback = useCallback(
    (soundFn: () => void) => {
      if (settings.sound) soundFn();
      if (settings.haptic) vibrate(15);
    },
    [settings.sound, settings.haptic]
  );

  const handleStartPause = useCallback(() => {
    feedback(playStart);
    startPause();
  }, [feedback, startPause]);

  const handleLap = useCallback(() => {
    feedback(playLap);
    lap();
  }, [feedback, lap]);

  const handleReset = useCallback(() => {
    feedback(playReset);
    reset();
  }, [feedback, reset]);

  // Persist settings + sessions
  useEffect(() => {
    saveSettings(settings);
  }, [settings]);

  useEffect(() => {
    saveSessions(sessions);
  }, [sessions]);

  // Apply theme class to root
  useEffect(() => {
    const root = document.documentElement;
    if (settings.theme === 'light') {
      root.classList.remove('dark');
      root.classList.add('light');
    } else {
      root.classList.remove('light');
      root.classList.add('dark');
    }
  }, [settings.theme]);

  // Wake lock follows running state + setting
  useEffect(() => {
    void requestWakeLock(settings.keepAwake && isRunning);
  }, [settings.keepAwake, isRunning]);

  // Re-acquire wake lock when tab becomes visible again
  useEffect(() => {
    const onVisible = () => {
      if (document.visibilityState === 'visible' && settings.keepAwake && isRunning) {
        void requestWakeLock(true);
      }
    };
    document.addEventListener('visibilitychange', onVisible);
    return () => document.removeEventListener('visibilitychange', onVisible);
  }, [settings.keepAwake, isRunning]);

  // Keyboard shortcuts
  useEffect(() => {
    const isTypingTarget = (el: EventTarget | null) => {
      if (!(el instanceof HTMLElement)) return false;
      const tag = el.tagName.toLowerCase();
      return tag === 'input' || tag === 'textarea' || el.isContentEditable;
    };
    const onKey = (e: KeyboardEvent) => {
      if (isTypingTarget(e.target)) return;
      if (e.code === 'Space') {
        e.preventDefault();
        startPause();
      } else if (e.key === 'l' || e.key === 'L') {
        e.preventDefault();
        if (isRunning) handleLap();
      } else if (e.key === 'r' || e.key === 'R') {
        e.preventDefault();
        handleReset();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isRunning, startPause, handleLap, handleReset]);

  const updateSettings = useCallback((patch: Partial<SettingsType>) => {
    setSettings((prev) => ({ ...prev, ...patch }));
  }, []);

  const handleSaveSession = useCallback((session: Session) => {
    setSessions((prev) => [session, ...prev]);
  }, []);

  const handleDeleteSession = useCallback((id: string) => {
    setSessions((prev) => prev.filter((s) => s.id !== id));
  }, []);

  const handleClearAll = useCallback(() => {
    setSessions([]);
  }, []);

  const handleClearHistory = useCallback(() => {
    setSessions([]);
    reset();
  }, [reset]);

  return (
    <div className="min-h-screen flex flex-col">
      <div className="ambient-bg" />
      <div className="grid-overlay" />

      {/* Header */}
      <header className="sticky top-0 z-30 glass-strong border-b border-white/10">
        <div className="mx-auto max-w-[1200px] px-4 sm:px-6 h-14 sm:h-16 flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={() => setView('home')}
            className="flex items-center gap-2 shrink-0"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-500/30 to-violet-500/30 border border-white/10">
              <Zap className="h-4 w-4 text-cyan-300" fill="currentColor" />
            </span>
            <span className="text-base sm:text-lg font-bold tracking-tight">
              <span className="text-gradient">Chrono AI</span>
            </span>
          </button>

          <div className="flex items-center gap-3">
            <Navigation current={view} onNavigate={setView} />
            <span className="hidden sm:inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium text-emerald-300 bg-emerald-500/10 border border-emerald-500/20">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              AI Ready
            </span>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 mx-auto w-full max-w-[1200px] px-4 sm:px-6 py-5 sm:py-8 pb-28 md:pb-12">
        {view === 'home' && (
          <Home
            onNavigate={setView}
            lapCount={laps.length}
            sessionCount={sessions.length}
          />
        )}
        {view === 'stopwatch' && (
          <Stopwatch
            elapsed={elapsed}
            isRunning={isRunning}
            laps={laps}
            stats={stats}
            settings={settings}
            onStartPause={handleStartPause}
            onLap={handleLap}
            onReset={handleReset}
            onSaveSession={handleSaveSession}
          />
        )}
        {view === 'statistics' && (
          <div className="space-y-4 animate-fade-in">
            <div>
              <h2 className="text-xl font-semibold text-slate-100 mb-1">Statistics</h2>
              <p className="text-sm text-slate-500 mb-4">
                Live metrics from your current stopwatch session.
              </p>
            </div>
            <Statistics stats={stats} showMilliseconds={settings.showMilliseconds} />
          </div>
        )}
        {view === 'ai' && (
          <div className="space-y-4 animate-fade-in">
            <div>
              <h2 className="text-xl font-semibold text-slate-100 mb-1">Chrono AI</h2>
              <p className="text-sm text-slate-500 mb-4">
                Intelligent analysis of your current lap data.
              </p>
            </div>
            <AIAnalysis
              laps={laps}
              totalTime={elapsed}
              showMilliseconds={settings.showMilliseconds}
            />
          </div>
        )}
        {view === 'history' && (
          <div className="space-y-4 animate-fade-in">
            <div>
              <h2 className="text-xl font-semibold text-slate-100 mb-1">History</h2>
              <p className="text-sm text-slate-500 mb-4">
                Saved stopwatch sessions, stored on this device.
              </p>
            </div>
            <History
              sessions={sessions}
              showMilliseconds={settings.showMilliseconds}
              onDelete={handleDeleteSession}
              onClearAll={handleClearAll}
            />
          </div>
        )}
        {view === 'settings' && (
          <div className="space-y-4 animate-fade-in">
            <div>
              <h2 className="text-xl font-semibold text-slate-100 mb-1">Settings</h2>
              <p className="text-sm text-slate-500 mb-4">
                Customize Chrono AI to your preferences.
              </p>
            </div>
            <Settings
              settings={settings}
              onChange={updateSettings}
              onClearHistory={handleClearHistory}
            />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="pv-groups-footer hidden md:block">
        Made by PV Groups
      </footer>
    </div>
  );
}
