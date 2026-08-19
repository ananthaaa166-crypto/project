import type { Lap } from './statistics';
import type { Milliseconds } from './timeUtils';

export interface Session {
  id: string;
  date: number;
  totalTime: Milliseconds;
  laps: Lap[];
}

export interface Settings {
  theme: 'dark' | 'light';
  sound: boolean;
  haptic: boolean;
  keepAwake: boolean;
  showMilliseconds: boolean;
}

const SESSIONS_KEY = 'chrono-ai-sessions';
const SETTINGS_KEY = 'chrono-ai-settings';

export const defaultSettings: Settings = {
  theme: 'dark',
  sound: true,
  haptic: false,
  keepAwake: false,
  showMilliseconds: true,
};

export function loadSessions(): Session[] {
  try {
    const raw = localStorage.getItem(SESSIONS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as Session[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveSessions(sessions: Session[]): void {
  try {
    localStorage.setItem(SESSIONS_KEY, JSON.stringify(sessions));
  } catch {
    // storage may be full or unavailable; ignore
  }
}

export function loadSettings(): Settings {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) return { ...defaultSettings };
    const parsed = JSON.parse(raw) as Partial<Settings>;
    return { ...defaultSettings, ...parsed };
  } catch {
    return { ...defaultSettings };
  }
}

export function saveSettings(settings: Settings): void {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch {
    // ignore
  }
}
