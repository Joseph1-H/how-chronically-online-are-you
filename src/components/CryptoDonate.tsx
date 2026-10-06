import { useState } from 'react';
import { CRYPTO_WALLETS, SUPPORT_URL } from '../config/constants';
import { copyText } from '../lib/share';
import { trackEvent } from '../lib/analytics';

interface CryptoDonateProps {
  /** Where this instance lives, for analytics (e.g. 'landing', 'result'). */
  from: string;
  quizSlug: string;
}

/**
 * Renders the configured crypto wallets as copy-to-clipboard rows, plus an
 * optional hosted-link button. Shows a "coming soon" note if nothing is set.
 */
export default function CryptoDonate({ from, quizSlug }: CryptoDonateProps) {
  const [copied, setCopied] = useState<string | null>(null);
  const hasWallets = CRYPTO_WALLETS.length > 0;

  async function onCopy(coin: string, address: string) {
    const ok = await copyText(address);
    if (!ok) return;
    setCopied(coin);
    trackEvent('support_clicked', { quiz: quizSlug, from, coin });
    window.setTimeout(() => setCopied((c) => (c === coin ? null : c)), 1800);
  }

  if (!hasWallets && !SUPPORT_URL) {
    return <p className="text-sm text-lav-ink/60">Crypto donation details coming soon.</p>;
  }

  return (
    <div className="mx-auto max-w-md space-y-3 text-left">
      {CRYPTO_WALLETS.map((w) => (
        <div
          key={w.coin}
          className="flex items-center gap-3 rounded-2xl border border-edge bg-white p-3"
        >
          <div className="flex h-10 w-12 shrink-0 items-center justify-center rounded-lg bg-cream font-mono text-sm font-bold text-ink">
            {w.coin}
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-xs font-medium text-muted">{w.label}</div>
            <div className="break-all font-mono text-xs text-ink">{w.address}</div>
          </div>
          <button
            type="button"
            onClick={() => onCopy(w.coin, w.address)}
            aria-label={`Copy ${w.coin} address`}
            className="shrink-0 rounded-full bg-forest px-4 py-2 text-xs font-semibold text-cream transition-colors hover:bg-forest-dark"
          >
            {copied === w.coin ? 'Copied!' : 'Copy'}
          </button>
        </div>
      ))}

      {SUPPORT_URL && (
        <a
          href={SUPPORT_URL}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => trackEvent('support_clicked', { quiz: quizSlug, from })}
          className="inline-flex items-center gap-2 rounded-full border border-ink/15 bg-white px-5 py-2.5 text-sm font-semibold text-ink transition-colors hover:border-ink/40"
        >
          Other ways to support
        </a>
      )}
    </div>
  );
}
