import { Play, Pause, Flag, RotateCcw } from 'lucide-react';

interface ControlButtonsProps {
  isRunning: boolean;
  hasElapsed: boolean;
  onStartPause: () => void;
  onLap: () => void;
  onReset: () => void;
}

export function ControlButtons({
  isRunning,
  hasElapsed,
  onStartPause,
  onLap,
  onReset,
}: ControlButtonsProps) {
  return (
    <div className="flex items-center justify-center gap-3 sm:gap-4">
      {/* Reset */}
      <button
        type="button"
        onClick={onReset}
        disabled={!hasElapsed}
        aria-label="Reset stopwatch"
        className="btn-ghost h-14 w-14 sm:h-16 sm:w-16 !p-0 disabled:opacity-30 disabled:cursor-not-allowed group"
      >
        <RotateCcw className="h-5 w-5 sm:h-6 sm:w-6 transition-transform group-hover:rotate-[-60deg]" />
      </button>

      {/* Start / Pause - primary */}
      <button
        type="button"
        onClick={onStartPause}
        aria-label={isRunning ? 'Pause stopwatch' : 'Start stopwatch'}
        className={`btn-primary h-16 sm:h-20 px-8 sm:px-12 text-base sm:text-lg ${
          isRunning ? 'animate-pulse-glow' : ''
        }`}
      >
        {isRunning ? (
          <>
            <Pause className="h-5 w-5 sm:h-6 sm:w-6" fill="currentColor" />
            <span>PAUSE</span>
          </>
        ) : (
          <>
            <Play className="h-5 w-5 sm:h-6 sm:w-6" fill="currentColor" />
            <span>START</span>
          </>
        )}
      </button>

      {/* Lap */}
      <button
        type="button"
        onClick={onLap}
        disabled={!isRunning}
        aria-label="Record lap"
        className="btn-secondary h-14 w-14 sm:h-16 sm:w-16 !p-0 disabled:opacity-30 disabled:cursor-not-allowed group"
      >
        <Flag className="h-5 w-5 sm:h-6 sm:w-6 transition-transform group-hover:scale-110" />
      </button>
    </div>
  );
}

export default ControlButtons;
