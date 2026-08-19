import { useMemo, useState } from 'react';
import { Bot, Sparkles, Zap, BarChart3, Activity, GitCompare, FileText } from 'lucide-react';
import type { Lap } from '@/utils/statistics';
import { computeStats, consistencyScore, consistencyLabel } from '@/utils/statistics';
import { formatLapDuration } from '@/utils/timeUtils';

interface AIAnalysisProps {
  laps: Lap[];
  totalTime: number;
  showMilliseconds: boolean;
}

type QuestionId = 'fastest' | 'average' | 'consistency' | 'compare' | 'summarize';

const QUESTIONS: { id: QuestionId; label: string; icon: React.ReactNode }[] = [
  { id: 'fastest', label: 'What was my fastest lap?', icon: <Zap className="h-4 w-4" /> },
  { id: 'average', label: 'What was my average?', icon: <BarChart3 className="h-4 w-4" /> },
  { id: 'consistency', label: 'How consistent was I?', icon: <Activity className="h-4 w-4" /> },
  { id: 'compare', label: 'Compare my laps', icon: <GitCompare className="h-4 w-4" /> },
  { id: 'summarize', label: 'Summarize this session', icon: <FileText className="h-4 w-4" /> },
];

export function AIAnalysis({ laps, totalTime, showMilliseconds }: AIAnalysisProps) {
  const [active, setActive] = useState<QuestionId | null>(null);

  const analysis = useMemo(() => {
    const stats = computeStats(laps);
    const score = consistencyScore(laps);
    const label = consistencyLabel(score);
    return { stats, score, label };
  }, [laps]);

  const fmt = (ms: number) => formatLapDuration(ms, showMilliseconds);

  const answer = useMemo(() => {
    if (laps.length === 0) {
      return 'No lap data yet. Start the stopwatch and record a few laps to unlock AI insights.';
    }
    const { stats, score, label } = analysis;

    switch (active) {
      case 'fastest':
        return stats.fastest
          ? `Your fastest lap was Lap ${stats.fastest.number} at ${fmt(stats.fastest.duration)}. ${
              stats.slowest
                ? `That's ${fmt(stats.slowest.duration - stats.fastest.duration)} quicker than your slowest.`
                : ''
            }`
          : 'No laps recorded.';
      case 'average':
        return `Your average lap time was ${fmt(stats.average)} across ${stats.count} lap${
          stats.count === 1 ? '' : 's'
        }. ${
          stats.fastest && stats.slowest
            ? `Lap times ranged from ${fmt(stats.fastest.duration)} to ${fmt(stats.slowest.duration)}.`
            : ''
        }`;
      case 'consistency':
        return `Your timing consistency is ${label} (score: ${score}/100). ${
          score >= 70
            ? 'Your lap-to-lap variation is low, which suggests a steady, repeatable pace.'
            : score >= 50
            ? 'There is moderate variation between laps — try to find a rhythm to tighten your times.'
            : 'Your lap times vary quite a bit. Focus on a consistent pace to improve repeatability.'
        }`;
      case 'compare': {
        const lines = laps.map((l) => {
          const diff = l.duration - stats.average;
          const sign = diff > 0 ? '+' : '';
          const bar = diff <= 0 ? 'faster' : 'slower';
          return `Lap ${l.number}: ${fmt(l.duration)} (${sign}${fmt(Math.abs(diff))} ${bar} than avg)`;
        });
        return `Compared to your average of ${fmt(stats.average)}:\n\n${lines.join('\n')}`;
      }
      case 'summarize': {
        const fastestLine = stats.fastest
          ? `fastest lap ${fmt(stats.fastest.duration)} (Lap ${stats.fastest.number})`
          : 'no laps';
        return `You recorded ${stats.count} lap${stats.count === 1 ? '' : 's'} with a total time of ${fmt(
          totalTime
        )}. Your ${fastestLine}, average ${fmt(stats.average)}, and consistency is ${label} (${score}/100).`;
      }
      default:
        return '';
    }
  }, [active, laps, analysis, totalTime, fmt]);

  const hasLaps = laps.length > 0;

  return (
    <div className="glass-strong p-5 sm:p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500/30 to-cyan-500/30 border border-white/10">
          <Bot className="h-5 w-5 text-cyan-300" />
        </div>
        <div>
          <h3 className="text-base font-semibold text-slate-100 flex items-center gap-2">
            Chrono AI
            <Sparkles className="h-3.5 w-3.5 text-violet-400" />
          </h3>
          <p className="text-xs text-slate-500">Local analysis · no API required</p>
        </div>
      </div>

      {/* Default insight */}
      {!active && (
        <div className="rounded-xl bg-white/[0.03] border border-white/5 p-4 text-sm text-slate-300 leading-relaxed animate-fade-in">
          {hasLaps ? (
            <p>
              You recorded <span className="text-cyan-300 font-semibold">{laps.length}</span> lap
              {laps.length === 1 ? '' : 's'}. Your fastest lap was{' '}
              <span className="text-emerald-300 font-semibold">
                {fmt(analysis.stats.fastest!.duration)}
              </span>
              , your average was{' '}
              <span className="text-blue-300 font-semibold">{fmt(analysis.stats.average)}</span>, and
              your timing consistency is{' '}
              <span className="text-violet-300 font-semibold">{analysis.label}</span>.
            </p>
          ) : (
            <p>Record some laps and I'll analyze your pacing, consistency, and trends.</p>
          )}
        </div>
      )}

      {/* Answer */}
      {active && (
        <div className="rounded-xl bg-white/[0.03] border border-white/5 p-4 text-sm text-slate-300 leading-relaxed animate-fade-in whitespace-pre-line">
          {answer}
        </div>
      )}

      {/* Question buttons */}
      <div className="mt-4 flex flex-wrap gap-2">
        {QUESTIONS.map((q) => (
          <button
            key={q.id}
            type="button"
            onClick={() => setActive((prev) => (prev === q.id ? null : q.id))}
            className={`inline-flex items-center gap-2 rounded-lg px-3 py-2 text-xs sm:text-sm font-medium transition-all active:scale-95 ${
              active === q.id
                ? 'bg-gradient-to-r from-cyan-500/30 to-violet-500/30 border border-cyan-400/40 text-cyan-100'
                : 'bg-white/[0.03] border border-white/10 text-slate-300 hover:border-white/20 hover:text-white'
            }`}
          >
            {q.icon}
            {q.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export default AIAnalysis;
