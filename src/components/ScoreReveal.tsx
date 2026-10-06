import { useEffect, useState } from 'react';

interface ScoreRevealProps {
  /** Final score 0–100. */
  score: number;
  accent: string;
}

const RADIUS = 86;
const CIRC = 2 * Math.PI * RADIUS;

function prefersReducedMotion(): boolean {
  return (
    typeof window !== 'undefined' &&
    window.matchMedia?.('(prefers-reduced-motion: reduce)').matches === true
  );
}

/**
 * Satisfying result reveal: a circular progress ring that fills while the
 * number counts up from 0 to the final score.
 */
export default function ScoreReveal({ score, accent }: ScoreRevealProps) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (prefersReducedMotion()) {
      setDisplay(score);
      return;
    }

    let raf = 0;
    const duration = 1400;
    const start = performance.now();

    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      // easeOutCubic
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplay(Math.round(eased * score));
      if (t < 1) raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [score]);

  const offset = CIRC - (display / 100) * CIRC;

  return (
    <div className="relative mx-auto h-56 w-56 animate-pop-in sm:h-64 sm:w-64">
      <svg viewBox="0 0 200 200" className="h-full w-full -rotate-90">
        <circle
          cx="100"
          cy="100"
          r={RADIUS}
          fill="none"
          stroke="rgba(27,26,22,0.1)"
          strokeWidth="14"
        />
        <circle
          cx="100"
          cy="100"
          r={RADIUS}
          fill="none"
          stroke={accent}
          strokeWidth="14"
          strokeLinecap="round"
          strokeDasharray={CIRC}
          strokeDashoffset={offset}
          style={{ filter: `drop-shadow(0 0 10px ${accent}aa)` }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">
          Your score
        </span>
        <span
          className="font-mono text-6xl font-bold tabular-nums sm:text-7xl"
          style={{ color: accent }}
          aria-label={`${score} percent`}
        >
          {display}
          <span className="text-3xl sm:text-4xl">%</span>
        </span>
      </div>
    </div>
  );
}
