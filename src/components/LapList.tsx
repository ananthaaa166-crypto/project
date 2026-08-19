import { useEffect, useRef } from 'react';
import { Trophy, Turtle } from 'lucide-react';
import type { Lap } from '@/utils/statistics';
import { formatLapDuration } from '@/utils/timeUtils';

interface LapListProps {
  laps: Lap[];
  showMilliseconds: boolean;
}

export function LapList({ laps, showMilliseconds }: LapListProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const fastest = laps.length > 1 ? Math.min(...laps.map((l) => l.duration)) : null;
  const slowest = laps.length > 1 ? Math.max(...laps.map((l) => l.duration)) : null;

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [laps.length]);

  if (laps.length === 0) {
    return (
      <div className="glass p-6 flex flex-col items-center justify-center min-h-[200px] text-center">
        <div className="h-12 w-12 rounded-full bg-cyan-500/10 flex items-center justify-center mb-3">
          <Trophy className="h-6 w-6 text-cyan-400/60" />
        </div>
        <p className="text-sm text-slate-400">No laps recorded yet</p>
        <p className="text-xs text-slate-500 mt-1">Press LAP while the timer is running</p>
      </div>
    );
  }

  return (
    <div className="glass p-4 sm:p-5">
      <div className="flex items-center justify-between mb-3 px-1">
        <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">Laps</h3>
        <span className="text-xs text-slate-500 tabular-nums">{laps.length} total</span>
      </div>
      <div ref={scrollRef} className="scroll-area max-h-[280px] sm:max-h-[340px] overflow-y-auto pr-1">
        <ul className="space-y-1.5">
          {[...laps].reverse().map((lap) => {
            const isFastest = fastest !== null && lap.duration === fastest;
            const isSlowest = slowest !== null && lap.duration === slowest;
            return (
              <li
                key={lap.number}
                className={`flex items-center justify-between rounded-lg px-3 py-2.5 text-sm transition-all animate-fade-in ${
                  isFastest
                    ? 'bg-emerald-500/10 border border-emerald-500/30'
                    : isSlowest
                    ? 'bg-rose-500/10 border border-rose-500/30'
                    : 'bg-white/[0.02] border border-white/5 hover:border-white/10'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`flex h-7 w-7 items-center justify-center rounded-md text-xs font-bold ${
                      isFastest
                        ? 'bg-emerald-500/20 text-emerald-300'
                        : isSlowest
                        ? 'bg-rose-500/20 text-rose-300'
                        : 'bg-cyan-500/10 text-cyan-300'
                    }`}
                  >
                    {lap.number}
                  </span>
                  <span className="text-slate-400 text-xs">Lap {lap.number}</span>
                  {isFastest && <Trophy className="h-3.5 w-3.5 text-emerald-400" />}
                  {isSlowest && <Turtle className="h-3.5 w-3.5 text-rose-400" />}
                </div>
                <span
                  className={`font-mono font-semibold tabular-nums ${
                    isFastest ? 'text-emerald-300' : isSlowest ? 'text-rose-300' : 'text-slate-200'
                  }`}
                >
                  {formatLapDuration(lap.duration, showMilliseconds)}
                </span>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

export default LapList;
