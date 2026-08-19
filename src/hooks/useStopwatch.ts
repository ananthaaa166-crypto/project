import { useCallback, useEffect, useRef, useState } from 'react';
import type { Lap } from '@/utils/statistics';
import type { Milliseconds } from '@/utils/timeUtils';

export interface StopwatchState {
  elapsed: Milliseconds;
  isRunning: boolean;
  laps: Lap[];
}

export interface StopwatchActions {
  startPause: () => void;
  lap: () => void;
  reset: () => void;
  saveSession: () => void;
}

export function useStopwatch(onLap?: () => void, onTick?: () => void) {
  const [elapsed, setElapsed] = useState<Milliseconds>(0);
  const [isRunning, setIsRunning] = useState(false);
  const [laps, setLaps] = useState<Lap[]>([]);

  const startTimeRef = useRef<number | null>(null);
  const baseRef = useRef<Milliseconds>(0);
  const rafRef = useRef<number | null>(null);

  const tick = useCallback(() => {
    if (startTimeRef.current === null) return;
    const now = performance.now();
    const current = baseRef.current + (now - startTimeRef.current);
    setElapsed(current);
    onTick?.();
    rafRef.current = requestAnimationFrame(tick);
  }, [onTick]);

  const startPause = useCallback(() => {
    if (isRunning) {
      // pause
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
      if (startTimeRef.current !== null) {
        baseRef.current += performance.now() - startTimeRef.current;
      }
      startTimeRef.current = null;
      setIsRunning(false);
    } else {
      startTimeRef.current = performance.now();
      setIsRunning(true);
      rafRef.current = requestAnimationFrame(tick);
    }
  }, [isRunning, tick]);

  const lap = useCallback(() => {
    setLaps((prev) => {
      const prevTotal = prev.length > 0 ? prev[prev.length - 1].total : 0;
      const duration = Math.max(0, elapsed - prevTotal);
      const newLap: Lap = {
        number: prev.length + 1,
        duration,
        total: elapsed,
      };
      onLap?.();
      return [...prev, newLap];
    });
  }, [elapsed, onLap]);

  const reset = useCallback(() => {
    if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    rafRef.current = null;
    startTimeRef.current = null;
    baseRef.current = 0;
    setElapsed(0);
    setIsRunning(false);
    setLaps([]);
  }, []);

  // cleanup on unmount
  useEffect(() => {
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return { elapsed, isRunning, laps, startPause, lap, reset, setLaps };
}
