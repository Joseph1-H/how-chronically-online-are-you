import { useEffect, useState } from 'react';

interface StatBarProps {
  label: string;
  /** 0–100. */
  value: number;
  accent: string;
  /** Delay (ms) before the fill animates in, for a staggered reveal. */
  delay?: number;
  /** Render the blocky █████░░ style used on the shareable card. */
  blocks?: boolean;
}

const BLOCK_COUNT = 10;

export default function StatBar({ label, value, accent, delay = 0, blocks = false }: StatBarProps) {
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setShown(true), delay);
    return () => clearTimeout(t);
  }, [delay]);

  const filled = Math.round((value / 100) * BLOCK_COUNT);

  return (
    <div>
      <div className="mb-1 flex items-baseline justify-between gap-2">
        <span className="text-sm font-medium text-zinc-200">{label}</span>
        <span className="font-mono text-sm tabular-nums text-zinc-100">{value}%</span>
      </div>

      {blocks ? (
        <div
          className="font-mono text-lg leading-none tracking-tight"
          aria-hidden="true"
          style={{ color: accent }}
        >
          <span>{'█'.repeat(filled)}</span>
          <span className="text-white/15">{'░'.repeat(BLOCK_COUNT - filled)}</span>
        </div>
      ) : (
        <div className="h-2.5 w-full overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full rounded-full transition-[width] duration-[900ms] ease-out"
            style={{
              width: shown ? `${value}%` : '0%',
              backgroundColor: accent,
              boxShadow: `0 0 12px ${accent}66`,
            }}
          />
        </div>
      )}
    </div>
  );
}
