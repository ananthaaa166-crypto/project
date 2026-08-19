import {
  Moon,
  Sun,
  Volume2,
  VolumeX,
  Vibrate,
  Smartphone,
  Eye,
  EyeOff,
  Trash2,
  Info,
} from 'lucide-react';
import type { Settings } from '@/utils/storage';

interface SettingsProps {
  settings: Settings;
  onChange: (patch: Partial<Settings>) => void;
  onClearHistory: () => void;
}

interface ToggleRowProps {
  icon: React.ReactNode;
  label: string;
  description: string;
  value: boolean;
  onToggle: () => void;
}

function ToggleRow({ icon, label, description, value, onToggle }: ToggleRowProps) {
  return (
    <div className="glass p-4 flex items-center justify-between gap-4">
      <div className="flex items-center gap-3 min-w-0">
        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/5 border border-white/10 text-cyan-300 shrink-0">
          {icon}
        </span>
        <div className="min-w-0">
          <p className="text-sm font-medium text-slate-100 truncate">{label}</p>
          <p className="text-xs text-slate-500 truncate">{description}</p>
        </div>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={value}
        aria-label={label}
        onClick={onToggle}
        className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${
          value ? 'bg-gradient-to-r from-cyan-500 to-violet-500' : 'bg-slate-600/60'
        }`}
      >
        <span
          className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
            value ? 'translate-x-5' : 'translate-x-0.5'
          }`}
        />
      </button>
    </div>
  );
}

export function Settings({ settings, onChange, onClearHistory }: SettingsProps) {
  return (
    <div className="space-y-3 max-w-2xl mx-auto">
      {/* Theme */}
      <div className="glass p-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/5 border border-white/10 text-cyan-300">
              {settings.theme === 'dark' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
            </span>
            <div>
              <p className="text-sm font-medium text-slate-100">Theme</p>
              <p className="text-xs text-slate-500">Switch between dark and light appearance</p>
            </div>
          </div>
          <div className="flex rounded-lg overflow-hidden border border-white/10">
            <button
              type="button"
              onClick={() => onChange({ theme: 'dark' })}
              className={`px-3 py-1.5 text-xs font-medium transition-colors ${
                settings.theme === 'dark'
                  ? 'bg-cyan-500/30 text-cyan-100'
                  : 'bg-white/5 text-slate-400 hover:text-white'
              }`}
            >
              Dark
            </button>
            <button
              type="button"
              onClick={() => onChange({ theme: 'light' })}
              className={`px-3 py-1.5 text-xs font-medium transition-colors ${
                settings.theme === 'light'
                  ? 'bg-cyan-500/30 text-cyan-100'
                  : 'bg-white/5 text-slate-400 hover:text-white'
              }`}
            >
              Light
            </button>
          </div>
        </div>
      </div>

      <ToggleRow
        icon={settings.sound ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
        label="Sound"
        description="Play a tone on start, lap, and reset"
        value={settings.sound}
        onToggle={() => onChange({ sound: !settings.sound })}
      />
      <ToggleRow
        icon={<Vibrate className="h-4 w-4" />}
        label="Haptic feedback"
        description="Vibrate on supported mobile devices"
        value={settings.haptic}
        onToggle={() => onChange({ haptic: !settings.haptic })}
      />
      <ToggleRow
        icon={<Smartphone className="h-4 w-4" />}
        label="Keep screen awake"
        description="Prevent the screen from sleeping while running"
        value={settings.keepAwake}
        onToggle={() => onChange({ keepAwake: !settings.keepAwake })}
      />
      <ToggleRow
        icon={settings.showMilliseconds ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
        label="Show milliseconds"
        description="Display the millisecond portion of the timer"
        value={settings.showMilliseconds}
        onToggle={() => onChange({ showMilliseconds: !settings.showMilliseconds })}
      />

      {/* Clear history */}
      <div className="glass p-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-300">
            <Trash2 className="h-4 w-4" />
          </span>
          <div>
            <p className="text-sm font-medium text-slate-100">Clear history</p>
            <p className="text-xs text-slate-500">Remove all saved stopwatch sessions</p>
          </div>
        </div>
        <button
          type="button"
          onClick={onClearHistory}
          className="rounded-lg px-4 py-2 text-xs font-medium text-rose-200 bg-rose-500/10 border border-rose-500/30 hover:bg-rose-500/20 transition-all active:scale-95"
        >
          Clear
        </button>
      </div>

      {/* About */}
      <div className="glass p-4">
        <div className="flex items-center gap-3 mb-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-violet-500/10 border border-violet-500/20 text-violet-300">
            <Info className="h-4 w-4" />
          </span>
          <p className="text-sm font-medium text-slate-100">About Chrono AI</p>
        </div>
        <p className="text-xs text-slate-400 leading-relaxed">
          Chrono AI is a futuristic stopwatch with lap tracking, live statistics, session history,
          and local AI analysis. All data is stored on your device. Designed to work seamlessly on
          desktop and mobile.
        </p>
      </div>
    </div>
  );
}

export default Settings;
