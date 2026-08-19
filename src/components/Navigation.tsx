import { Home, Timer, BarChart3, History, Bot, Settings as SettingsIcon } from 'lucide-react';

export type ViewId = 'home' | 'stopwatch' | 'statistics' | 'history' | 'ai' | 'settings';

interface NavigationProps {
  current: ViewId;
  onNavigate: (view: ViewId) => void;
}

const ITEMS: { id: ViewId; label: string; icon: React.ReactNode }[] = [
  { id: 'home', label: 'Home', icon: <Home className="h-4 w-4" /> },
  { id: 'stopwatch', label: 'Stopwatch', icon: <Timer className="h-4 w-4" /> },
  { id: 'statistics', label: 'Statistics', icon: <BarChart3 className="h-4 w-4" /> },
  { id: 'history', label: 'History', icon: <History className="h-4 w-4" /> },
  { id: 'ai', label: 'Chrono AI', icon: <Bot className="h-4 w-4" /> },
  { id: 'settings', label: 'Settings', icon: <SettingsIcon className="h-4 w-4" /> },
];

export function Navigation({ current, onNavigate }: NavigationProps) {
  return (
    <>
      {/* Desktop top nav */}
      <nav className="hidden md:flex items-center gap-1">
        {ITEMS.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => onNavigate(item.id)}
            className={`inline-flex items-center gap-2 rounded-lg px-3.5 py-2 text-sm font-medium transition-all ${
              current === item.id
                ? 'text-cyan-100 bg-white/[0.06] border border-white/10'
                : 'text-slate-400 hover:text-white hover:bg-white/[0.03]'
            }`}
          >
            {item.icon}
            {item.label}
          </button>
        ))}
      </nav>

      {/* Mobile bottom nav */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 z-40 glass-strong rounded-t-2xl border-t border-white/10 px-1.5 pt-1.5 pb-[max(0.5rem,env(safe-area-inset-bottom))]">
        <div className="flex items-center justify-around">
          {ITEMS.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => onNavigate(item.id)}
              className={`flex flex-col items-center gap-0.5 rounded-lg px-2 py-1.5 min-w-0 transition-all ${
                current === item.id ? 'text-cyan-300' : 'text-slate-500'
              }`}
            >
              <span
                className={`flex h-7 w-7 items-center justify-center rounded-lg transition-all ${
                  current === item.id ? 'bg-cyan-500/20 scale-110' : ''
                }`}
              >
                {item.icon}
              </span>
              <span className="text-[10px] font-medium leading-none truncate max-w-[52px]">
                {item.label}
              </span>
            </button>
          ))}
        </div>
      </nav>
    </>
  );
}

export default Navigation;
