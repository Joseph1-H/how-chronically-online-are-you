import { forwardRef } from 'react';
import type { QuizResult } from '../types/quiz';
import { SITE_NAME } from '../config/constants';
import StatBar from './StatBar';

interface PassportCardProps {
  result: QuizResult;
  quizName: string;
}

/** Fixed data color so the card reads cleanly in light mode and as a screenshot. */
const DATA_COLOR = '#5b3df5';

/**
 * "Your Internet Passport" — the screenshot-optimized card. Light, editorial,
 * high contrast so it reads well as an image in a group chat.
 */
const PassportCard = forwardRef<HTMLDivElement, PassportCardProps>(function PassportCard(
  { result, quizName },
  ref,
) {
  const { tier, score, traits } = result;
  const cardStats = traits.slice(0, 3);

  return (
    <div
      ref={ref}
      className="overflow-hidden rounded-3xl border border-edge bg-white p-2 shadow-[0_24px_60px_-28px_rgba(27,26,22,0.3)]"
    >
      {/* Header label */}
      <div className="flex items-center justify-between px-4 pt-3">
        <span className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">
          Internet Passport
        </span>
        <span className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">
          {SITE_NAME}
        </span>
      </div>

      {/* Identity block (tinted with the tier accent) */}
      <div
        className="mt-2 rounded-2xl p-5"
        style={{ backgroundColor: `${tier.accent}22` }}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <span
              className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold text-white"
              style={{ backgroundColor: DATA_COLOR }}
            >
              <span aria-hidden="true">{tier.emoji}</span> {quizName}
            </span>
            <h3 className="mt-3 text-2xl font-bold leading-tight text-ink">{tier.title}</h3>
          </div>
          <div className="shrink-0 text-right">
            <div className="font-mono text-4xl font-bold leading-none tabular-nums text-ink">
              {score}
              <span className="text-xl">%</span>
            </div>
            <div className="mt-1 text-[10px] font-semibold uppercase tracking-wide text-muted">
              online
            </div>
          </div>
        </div>
        <p className="mt-3 text-sm leading-relaxed text-ink/80">{tier.description}</p>
      </div>

      {/* Signature move + spirit platform */}
      <div className="grid grid-cols-2 gap-2 p-2 pb-0">
        {[
          { tag: 'Signature move', value: result.signature.label, emoji: result.signature.emoji },
          { tag: 'Spirit platform', value: result.platform.label, emoji: result.platform.emoji },
        ].map((row) => (
          <div key={row.tag} className="rounded-2xl border border-edge bg-white p-3">
            <div className="flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-wide text-muted">
              <span>{row.emoji}</span> {row.tag}
            </div>
            <div className="mt-0.5 truncate text-sm font-semibold text-ink">{row.value}</div>
          </div>
        ))}
      </div>

      {/* Stats */}
      <div className="space-y-3 p-4">
        {cardStats.map((t) => (
          <StatBar key={t.id} label={t.label} value={t.value} accent={DATA_COLOR} blocks />
        ))}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between border-t border-edge px-4 py-3 text-xs text-muted">
        <span>How Chronically Online Are You?</span>
        <span className="font-mono">{SITE_NAME.toLowerCase()}</span>
      </div>
    </div>
  );
});

export default PassportCard;
