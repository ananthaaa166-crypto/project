import { Save, FileJson, FileSpreadsheet } from 'lucide-react';
import { TimerDisplay } from './TimerDisplay';
import { ControlButtons } from './ControlButtons';
import { LapList } from './LapList';
import { Statistics } from './Statistics';
import type { LapStats } from '@/utils/statistics';
import type { Settings, Session } from '@/utils/storage';
import type { Milliseconds } from '@/utils/timeUtils';

interface StopwatchProps {
  elapsed: Milliseconds;
  isRunning: boolean;
  laps: import('@/utils/statistics').Lap[];
  stats: LapStats;
  settings: Settings;
  onStartPause: () => void;
  onLap: () => void;
  onReset: () => void;
  onSaveSession: (session: Session) => void;
}

export function Stopwatch({
  elapsed,
  isRunning,
  laps,
  stats,
  settings,
  onStartPause,
  onLap,
  onReset,
  onSaveSession,
}: StopwatchProps) {
  const hasElapsed = elapsed > 0 || laps.length > 0;

  const handleSave = () => {
    if (!hasElapsed) return;
    const session: Session = {
      id: `s-${Date.now()}`,
      date: Date.now(),
      totalTime: elapsed,
      laps,
    };
    onSaveSession(session);
  };

  return (
    <div className="space-y-5">
      {/* Timer card */}
      <div className="glass-strong p-6 sm:p-10 flex flex-col items-center gap-6 sm:gap-8">
        <TimerDisplay
          elapsed={elapsed}
          isRunning={isRunning}
          showMilliseconds={settings.showMilliseconds}
        />
        <ControlButtons
          isRunning={isRunning}
          hasElapsed={hasElapsed}
          onStartPause={onStartPause}
          onLap={onLap}
          onReset={onReset}
        />

        {/* Action row */}
        <div className="flex flex-wrap items-center justify-center gap-2 w-full">
          <button
            type="button"
            onClick={handleSave}
            disabled={!hasElapsed}
            className="btn-secondary text-sm disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <Save className="h-4 w-4" />
            Save Session
          </button>
          <button
            type="button"
            onClick={() => import('@/utils/export').then((m) => m.exportCSV(laps, settings.showMilliseconds))}
            disabled={laps.length === 0}
            className="btn-ghost text-sm disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <FileSpreadsheet className="h-4 w-4" />
            CSV
          </button>
          <button
            type="button"
            onClick={() => {
              const session: Session = {
                id: `s-${Date.now()}`,
                date: Date.now(),
                totalTime: elapsed,
                laps,
              };
              import('@/utils/export').then((m) => m.exportJSON(session, settings.showMilliseconds));
            }}
            disabled={!hasElapsed}
            className="btn-ghost text-sm disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <FileJson className="h-4 w-4" />
            JSON
          </button>
        </div>
      </div>

      {/* Stats + Laps two-column on desktop */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <Statistics stats={stats} showMilliseconds={settings.showMilliseconds} />
        <LapList laps={laps} showMilliseconds={settings.showMilliseconds} />
      </div>
    </div>
  );
}

export default Stopwatch;
