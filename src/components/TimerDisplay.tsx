import { formatTime } from '@/utils/timeUtils';
import type { Milliseconds } from '@/utils/timeUtils';

interface TimerDisplayProps {
  elapsed: Milliseconds;
  isRunning: boolean;
  showMilliseconds: boolean;
}

export function TimerDisplay({ elapsed, isRunning, showMilliseconds }: TimerDisplayProps) {
  const totalMs = Math.max(0, Math.floor(elapsed));
  const hours = Math.floor(totalMs / 3_600_000);
  const minutes = Math.floor((totalMs % 3_600_000) / 60_000);
  const seconds = Math.floor((totalMs % 60_000) / 1000);
  const milliseconds = totalMs % 1000;

  const pad = (n: number, len: number) => String(n).padStart(len, '0');

  return (
    <div className="relative flex flex-col items-center justify-center w-full">
      {/* glow ring */}
      <div
        className={`absolute -inset-6 rounded-full blur-2xl transition-opacity duration-500 ${
          isRunning ? 'opacity-60' : 'opacity-25'
        }`}
        style={{
          background:
            'radial-gradient(circle, rgba(34,211,238,0.35) 0%, rgba(139,92,246,0.2) 50%, transparent 70%)',
        }}
      />

      <div
        className={`relative font-mono font-bold tracking-tight text-center select-none transition-all duration-300 ${
          isRunning ? 'text-cyan-50' : 'text-slate-100'
        }`}
      >
        <div className="flex items-end justify-center gap-1 sm:gap-2">
          <span className="text-5xl sm:text-7xl md:text-8xl tabular-nums">{pad(hours, 2)}</span>
          <span className="text-5xl sm:text-7xl md:text-8xl text-cyan-400/70">:</span>
          <span className="text-5xl sm:text-7xl md:text-8xl tabular-nums">{pad(minutes, 2)}</span>
          <span className="text-5xl sm:text-7xl md:text-8xl text-cyan-400/70">:</span>
          <span className="text-5xl sm:text-7xl md:text-8xl tabular-nums">{pad(seconds, 2)}</span>
        </div>
        {showMilliseconds && (
          <div className="mt-1 sm:mt-2 text-2xl sm:text-4xl md:text-5xl tabular-nums text-cyan-300/80">
            .{pad(milliseconds, 3)}
          </div>
        )}
      </div>

      {/* status indicator */}
      <div className="mt-4 flex items-center gap-2 text-xs sm:text-sm font-medium uppercase tracking-widest">
        <span
          className={`inline-block h-2 w-2 rounded-full transition-all ${
            isRunning ? 'bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)]' : 'bg-slate-500'
          }`}
        />
        <span className={isRunning ? 'text-emerald-300' : 'text-slate-400'}>
          {isRunning ? 'Running' : 'Ready'}
        </span>
        <span className="text-slate-600 mx-1">·</span>
        <span className="text-slate-500 tabular-nums">{formatTime(elapsed, false)}</span>
      </div>
    </div>
  );
}

export default TimerDisplay;
