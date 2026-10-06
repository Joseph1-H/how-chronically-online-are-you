interface ProgressBarProps {
  /** 1-based current question number. */
  current: number;
  total: number;
}

export default function ProgressBar({ current, total }: ProgressBarProps) {
  const pct = Math.round((current / total) * 100);
  return (
    <div>
      <div className="mb-2 flex items-center justify-between text-xs font-medium text-muted">
        <span>
          Question <span className="text-ink">{current}</span> of {total}
        </span>
        <span className="tabular-nums">{pct}%</span>
      </div>
      <div
        className="h-2 w-full overflow-hidden rounded-full bg-black/10"
        role="progressbar"
        aria-valuenow={current}
        aria-valuemin={0}
        aria-valuemax={total}
        aria-label={`Question ${current} of ${total}`}
      >
        <div
          className="h-full rounded-full bg-forest transition-[width] duration-500 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
