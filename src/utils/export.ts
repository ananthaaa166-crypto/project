import type { Lap } from './statistics';
import type { Session } from './storage';
import { formatLapDuration, formatTime } from './timeUtils';

function download(filename: string, content: string, type: string): void {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function exportCSV(laps: Lap[], showMilliseconds = true): void {
  const header = 'Lap,Lap Duration,Total Elapsed\n';
  const rows = laps
    .map(
      (l) =>
        `${l.number},${formatLapDuration(l.duration, showMilliseconds)},${formatTime(
          l.total,
          showMilliseconds
        )}`
    )
    .join('\n');
  download('chrono-ai-laps.csv', header + rows + '\n', 'text/csv;charset=utf-8;');
}

export function exportJSON(session: Session, showMilliseconds = true): void {
  const payload = {
    id: session.id,
    date: new Date(session.date).toISOString(),
    totalTime: formatTime(session.totalTime, showMilliseconds),
    laps: session.laps.map((l) => ({
      number: l.number,
      duration: formatLapDuration(l.duration, showMilliseconds),
      total: formatTime(l.total, showMilliseconds),
    })),
  };
  download(
    'chrono-ai-session.json',
    JSON.stringify(payload, null, 2),
    'application/json;charset=utf-8;'
  );
}
