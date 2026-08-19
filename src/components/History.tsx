import { History as HistoryIcon, Trash2, Eye, X } from 'lucide-react';
import { useState } from 'react';
import type { Session } from '@/utils/storage';
import { computeStats } from '@/utils/statistics';
import { formatDate, formatLapDuration, formatTime } from '@/utils/timeUtils';
import { LapList } from './LapList';

interface HistoryProps {
  sessions: Session[];
  showMilliseconds: boolean;
  onDelete: (id: string) => void;
  onClearAll: () => void;
}

export function History({ sessions, showMilliseconds, onDelete, onClearAll }: HistoryProps) {
  const [openId, setOpenId] = useState<string | null>(null);
  const openSession = sessions.find((s) => s.id === openId) ?? null;

  if (sessions.length === 0) {
    return (
      <div className="glass p-8 flex flex-col items-center justify-center text-center min-h-[260px]">
        <div className="h-14 w-14 rounded-full bg-violet-500/10 flex items-center justify-center mb-4">
          <HistoryIcon className="h-7 w-7 text-violet-400/60" />
        </div>
        <p className="text-sm text-slate-400">No saved sessions yet</p>
        <p className="text-xs text-slate-500 mt-1">
          Run the stopwatch, record laps, and save a session to see it here.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">
          Saved Sessions
        </h3>
        <button
          type="button"
          onClick={onClearAll}
          className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-rose-300 bg-rose-500/10 border border-rose-500/20 hover:bg-rose-500/20 transition-all active:scale-95"
        >
          <Trash2 className="h-3.5 w-3.5" />
          Clear all
        </button>
      </div>

      <ul className="space-y-2.5">
        {sessions
          .slice()
          .sort((a, b) => b.date - a.date)
          .map((session) => {
            const stats = computeStats(session.laps);
            return (
              <li
                key={session.id}
                className="glass p-4 flex flex-col sm:flex-row sm:items-center gap-3 animate-fade-in"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-semibold text-slate-100">
                      {formatDate(session.date)}
                    </span>
                    <span className="text-xs text-slate-500">·</span>
                    <span className="text-xs text-slate-400">{session.laps.length} laps</span>
                  </div>
                  <div className="mt-1.5 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-400">
                    <span>
                      Total: <span className="text-cyan-300 tabular-nums">{formatTime(session.totalTime, showMilliseconds)}</span>
                    </span>
                    <span>
                      Fastest: <span className="text-emerald-300 tabular-nums">{stats.fastest ? formatLapDuration(stats.fastest.duration, showMilliseconds) : '—'}</span>
                    </span>
                    <span>
                      Avg: <span className="text-blue-300 tabular-nums">{stats.count > 0 ? formatLapDuration(stats.average, showMilliseconds) : '—'}</span>
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setOpenId(session.id)}
                    aria-label="Open session"
                    className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-cyan-200 bg-cyan-500/10 border border-cyan-500/20 hover:bg-cyan-500/20 transition-all active:scale-95"
                  >
                    <Eye className="h-3.5 w-3.5" />
                    Open
                  </button>
                  <button
                    type="button"
                    onClick={() => onDelete(session.id)}
                    aria-label="Delete session"
                    className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-rose-300 bg-rose-500/10 border border-rose-500/20 hover:bg-rose-500/20 transition-all active:scale-95"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </li>
            );
          })}
      </ul>

      {/* Session detail modal */}
      {openSession && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm animate-fade-in"
          onClick={() => setOpenId(null)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="glass-strong w-full sm:max-w-lg max-h-[85vh] overflow-y-auto rounded-t-3xl sm:rounded-2xl p-5 animate-slide-up"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-semibold text-slate-100">Session Detail</h3>
                <p className="text-xs text-slate-500">{formatDate(openSession.date)}</p>
              </div>
              <button
                type="button"
                onClick={() => setOpenId(null)}
                aria-label="Close"
                className="h-9 w-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-slate-300 hover:text-white hover:bg-white/10 transition-all"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="glass p-3">
                <p className="text-xs text-slate-500">Total Time</p>
                <p className="font-mono text-sm text-cyan-300 tabular-nums">
                  {formatTime(openSession.totalTime, showMilliseconds)}
                </p>
              </div>
              <div className="glass p-3">
                <p className="text-xs text-slate-500">Laps</p>
                <p className="font-mono text-sm text-violet-300 tabular-nums">
                  {openSession.laps.length}
                </p>
              </div>
            </div>
            <LapList laps={openSession.laps} showMilliseconds={showMilliseconds} />
          </div>
        </div>
      )}
    </div>
  );
}

export default History;
