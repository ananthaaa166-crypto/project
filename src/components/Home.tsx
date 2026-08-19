import { Zap, BarChart3, Bot, History, Download, Keyboard } from 'lucide-react';
import type { ViewId } from './Navigation';

interface HomeProps {
  onNavigate: (view: ViewId) => void;
  lapCount: number;
  sessionCount: number;
}

export function Home({ onNavigate, lapCount, sessionCount }: HomeProps) {
  const features = [
    {
      icon: <Zap className="h-5 w-5 text-cyan-300" />,
      title: 'Precise Timing',
      desc: 'Timestamp-based engine with millisecond accuracy and zero drift.',
      view: 'stopwatch' as ViewId,
    },
    {
      icon: <BarChart3 className="h-5 w-5 text-violet-300" />,
      title: 'Live Statistics',
      desc: 'Fastest, slowest, and average lap updates in real time.',
      view: 'statistics' as ViewId,
    },
    {
      icon: <Bot className="h-5 w-5 text-emerald-300" />,
      title: 'Chrono AI',
      desc: 'Local analysis of your pacing, consistency, and trends.',
      view: 'ai' as ViewId,
    },
    {
      icon: <History className="h-5 w-5 text-blue-300" />,
      title: 'Session History',
      desc: 'Sessions saved on your device, ready to revisit anytime.',
      view: 'history' as ViewId,
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Hero */}
      <div className="glass-strong p-8 sm:p-12 text-center relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-30 pointer-events-none"
          style={{
            background:
              'radial-gradient(circle at 50% 0%, rgba(34,211,238,0.25), transparent 60%)',
          }}
        />
        <div className="relative">
          <div className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium text-cyan-200 bg-cyan-500/10 border border-cyan-500/20 mb-5">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            AI Ready
          </div>
          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight">
            <span className="text-gradient">Chrono AI</span>
          </h1>
          <p className="mt-3 text-sm sm:text-base text-slate-400 max-w-md mx-auto">
            A futuristic stopwatch with lap tracking, live statistics, and intelligent session
            analysis — built for desktop and mobile.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => onNavigate('stopwatch')}
              className="btn-primary"
            >
              <Zap className="h-4 w-4" fill="currentColor" />
              Start Stopwatch
            </button>
            <button
              type="button"
              onClick={() => onNavigate('ai')}
              className="btn-secondary"
            >
              <Bot className="h-4 w-4" />
              Explore AI
            </button>
          </div>

          {/* quick stats */}
          <div className="mt-8 grid grid-cols-2 gap-3 max-w-sm mx-auto">
            <div className="glass p-3">
              <p className="text-xs text-slate-500">Current Laps</p>
              <p className="font-mono text-lg text-cyan-300 tabular-nums">{lapCount}</p>
            </div>
            <div className="glass p-3">
              <p className="text-xs text-slate-500">Saved Sessions</p>
              <p className="font-mono text-lg text-violet-300 tabular-nums">{sessionCount}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Feature cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {features.map((f) => (
          <button
            key={f.title}
            type="button"
            onClick={() => onNavigate(f.view)}
            className="glass p-5 text-left hover:border-white/20 transition-all group"
          >
            <div className="flex items-center gap-3 mb-2">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 border border-white/10 group-hover:scale-110 transition-transform">
                {f.icon}
              </span>
              <h3 className="text-sm font-semibold text-slate-100">{f.title}</h3>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">{f.desc}</p>
          </button>
        ))}
      </div>

      {/* Keyboard shortcuts hint */}
      <div className="glass p-4 flex items-center gap-3">
        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/5 border border-white/10 text-slate-300">
          <Keyboard className="h-4 w-4" />
        </span>
        <div className="text-xs text-slate-400">
          <span className="text-slate-200 font-medium">Shortcuts:</span>{' '}
          <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-slate-200">Space</kbd> start/pause ·{' '}
          <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-slate-200">L</kbd> lap ·{' '}
          <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-slate-200">R</kbd> reset
        </div>
      </div>
    </div>
  );
}

export default Home;
