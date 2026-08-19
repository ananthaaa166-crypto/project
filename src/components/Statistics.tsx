import { Clock, Layers, Zap, Turtle, BarChart3 } from 'lucide-react';
import type { LapStats } from '@/utils/statistics';
import { formatLapDuration, formatTime } from '@/utils/timeUtils';

interface StatisticsProps {
  stats: LapStats;
  showMilliseconds: boolean;
}

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  accent: string;
  delay?: number;
}

function StatCard({ icon, label, value, accent, delay = 0 }: StatCardProps) {
  return (
    <div
      className="glass p-4 sm:p-5 flex flex-col gap-2 animate-slide-up"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-center gap-2">
        <span className={`flex h-8 w-8 items-center justify-center rounded-lg ${accent}`}>
          {icon}
        </span>
        <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">{label}</span>
      </div>
      <span className="font-mono text-lg sm:text-xl font-semibold tabular-nums text-slate-100">
        {value}
      </span>
    </div>
  );
}

export function Statistics({ stats, showMilliseconds }: StatisticsProps) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
      <StatCard
        icon={<Clock className="h-4 w-4 text-cyan-300" />}
        label="Total Time"
        value={formatTime(stats.total, showMilliseconds)}
        accent="bg-cyan-500/15"
        delay={0}
      />
      <StatCard
        icon={<Layers className="h-4 w-4 text-violet-300" />}
        label="Total Laps"
        value={String(stats.count)}
        accent="bg-violet-500/15"
        delay={60}
      />
      <StatCard
        icon={<Zap className="h-4 w-4 text-emerald-300" />}
        label="Fastest Lap"
        value={stats.fastest ? formatLapDuration(stats.fastest.duration, showMilliseconds) : '—'}
        accent="bg-emerald-500/15"
        delay={120}
      />
      <StatCard
        icon={<Turtle className="h-4 w-4 text-rose-300" />}
        label="Slowest Lap"
        value={stats.slowest ? formatLapDuration(stats.slowest.duration, showMilliseconds) : '—'}
        accent="bg-rose-500/15"
        delay={180}
      />
      <StatCard
        icon={<BarChart3 className="h-4 w-4 text-blue-300" />}
        label="Average Lap"
        value={stats.count > 0 ? formatLapDuration(stats.average, showMilliseconds) : '—'}
        accent="bg-blue-500/15"
        delay={240}
      />
    </div>
  );
}

export default Statistics;
