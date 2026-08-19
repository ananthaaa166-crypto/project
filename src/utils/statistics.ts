import type { Milliseconds } from './timeUtils';

export interface Lap {
  number: number;
  duration: Milliseconds;
  total: Milliseconds;
}

export interface LapStats {
  fastest: Lap | null;
  slowest: Lap | null;
  average: Milliseconds;
  total: Milliseconds;
  count: number;
}

export function computeStats(laps: Lap[]): LapStats {
  if (laps.length === 0) {
    return { fastest: null, slowest: null, average: 0, total: 0, count: 0 };
  }

  let fastest = laps[0];
  let slowest = laps[0];
  let sum = 0;

  for (const lap of laps) {
    if (lap.duration < fastest.duration) fastest = lap;
    if (lap.duration > slowest.duration) slowest = lap;
    sum += lap.duration;
  }

  return {
    fastest,
    slowest,
    average: Math.round(sum / laps.length),
    total: laps[laps.length - 1].total,
    count: laps.length,
  };
}

export function consistencyScore(laps: Lap[]): number {
  if (laps.length < 2) return 100;
  const durations = laps.map((l) => l.duration);
  const mean = durations.reduce((a, b) => a + b, 0) / durations.length;
  if (mean === 0) return 100;
  const variance =
    durations.reduce((acc, d) => acc + (d - mean) ** 2, 0) / durations.length;
  const stdDev = Math.sqrt(variance);
  const cv = stdDev / mean; // coefficient of variation
  const score = Math.max(0, Math.min(100, Math.round((1 - cv) * 100)));
  return score;
}

export function consistencyLabel(score: number): string {
  if (score >= 85) return 'excellent';
  if (score >= 70) return 'good';
  if (score >= 50) return 'moderate';
  return 'inconsistent';
}
