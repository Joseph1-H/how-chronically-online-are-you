import { forwardRef } from 'react';
import type { QuizResult } from '../types/quiz';
import { SITE_NAME } from '../config/constants';
import StatBar from './StatBar';

interface PassportCardProps {
  result: QuizResult;
  quizName: string;
}

/**
 * "Your Internet Passport" — the screenshot-optimized card. Fixed, compact
 * layout with high contrast so it reads well as an image in a group chat.
 */
const PassportCard = forwardRef<HTMLDivElement, PassportCardProps>(function PassportCard(
  { result, quizName },
  ref,
) {
  const { tier, score, traits } = result;
  // Show up to 3 stats on the card to keep it clean.
  const cardStats = traits.slice(0, 3);

  return (
    <div
      ref={ref}
      className={`relative overflow-hidden rounded-3xl bg-gradient-to-br ${tier.gradient} p-[2px] shadow-2xl`}
    >
      <div className="relative rounded-[22px] bg-ink/95 p-6 backdrop-blur">
        {/* Header row */}
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-400">
            Internet Passport
          </span>
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-400">
            {SITE_NAME}
          </span>
        </div>

        {/* Identity */}
        <div className="mt-5 flex items-center gap-4">
          <div
            className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl text-4xl"
            style={{ backgroundColor: `${tier.accent}22` }}
            aria-hidden="true"
          >
            {tier.emoji}
          </div>
          <div className="min-w-0">
            <div
              className="truncate text-2xl font-bold leading-tight"
              style={{ color: tier.accent }}
            >
              {tier.title}
            </div>
            <div className="mt-0.5 text-sm text-zinc-400">{quizName}</div>
          </div>
          <div className="ml-auto text-right">
            <div
              className="font-mono text-4xl font-bold leading-none tabular-nums"
              style={{ color: tier.accent }}
            >
              {score}
              <span className="text-xl">%</span>
            </div>
          </div>
        </div>

        {/* Description */}
        <p className="mt-4 text-sm leading-relaxed text-zinc-200">{tier.description}</p>

        {/* Stats */}
        <div className="mt-5 space-y-3">
          {cardStats.map((t) => (
            <StatBar key={t.id} label={t.label} value={t.value} accent={tier.accent} blocks />
          ))}
        </div>

        {/* Footer */}
        <div className="mt-6 flex items-center justify-between border-t border-white/10 pt-3 text-xs text-zinc-500">
          <span>How Chronically Online Are You?</span>
          <span className="font-mono">{SITE_NAME.toLowerCase()}</span>
        </div>
      </div>
    </div>
  );
});

export default PassportCard;
