import { useMemo, useRef, useState } from 'react';
import { Link, Navigate, useParams, useSearchParams } from 'react-router-dom';
import { getQuiz } from '../data/quizzes';
import { computeResult, decodeAnswers, hasEnoughAnswers } from '../lib/scoring';
import { buildShare, copyText, shareResult } from '../lib/share';
import { trackEvent } from '../lib/analytics';
import { CRYPTO_WALLETS, SITE_NAME, SUPPORT_URL } from '../config/constants';
import CryptoDonate from '../components/CryptoDonate';
import { useDocumentMeta } from '../hooks/useDocumentMeta';
import ScoreReveal from '../components/ScoreReveal';
import StatBar from '../components/StatBar';
import PassportCard from '../components/PassportCard';

type Toast = { msg: string } | null;

/** Fixed data color for the score ring + stat bars (clean on the light theme). */
const DATA_COLOR = '#2a3356';

export default function Result() {
  const { slug } = useParams();
  const [params] = useSearchParams();
  const quiz = slug ? getQuiz(slug) : undefined;

  const cardRef = useRef<HTMLDivElement>(null);
  const [toast, setToast] = useState<Toast>(null);

  const code = params.get('a') ?? '';
  const answers = useMemo(() => (quiz ? decodeAnswers(quiz, code) : {}), [quiz, code]);
  const valid = quiz ? hasEnoughAnswers(quiz, answers) : false;
  const result = useMemo(
    () => (quiz && valid ? computeResult(quiz, answers) : null),
    [quiz, valid, answers],
  );

  useDocumentMeta({
    title: result
      ? `I'm ${result.score}% ${result.tier.title} | ${quiz?.name}`
      : 'Your result',
    description: result ? result.tier.description : quiz?.tagline,
  });

  if (!quiz) return <Navigate to="/" replace />;
  // No/invalid answers → send them to take the quiz.
  if (!result) return <Navigate to={`/quiz/${quiz.slug}`} replace />;

  const { tier } = result;
  // Base = everything before the hash, so links are correct whether we're on a
  // real domain or opened straight from disk (file://…/dist/index.html).
  const base = `${window.location.origin}${window.location.pathname}`;
  const resultUrl = `${base}#/quiz/${quiz.slug}/result?a=${code}`;
  const quizStartUrl = `${base}#/quiz/${quiz.slug}`;

  function flash(msg: string) {
    setToast({ msg });
    window.setTimeout(() => setToast(null), 2200);
  }

  async function onShare() {
    const payload = buildShare(quiz!, result!, resultUrl);
    const outcome = await shareResult(payload);
    if (outcome === 'shared') {
      trackEvent('result_shared', { quiz: quiz!.slug, score: result!.score });
    } else if (outcome === 'copied') {
      trackEvent('result_shared', { quiz: quiz!.slug, score: result!.score, via: 'clipboard' });
      flash('Result copied — paste it anywhere!');
    } else if (outcome === 'failed') {
      flash('Could not share. Try Copy Link.');
    }
  }

  async function onCopyLink() {
    const ok = await copyText(resultUrl);
    trackEvent('result_copied', { quiz: quiz!.slug });
    flash(ok ? 'Link copied!' : 'Could not copy link.');
  }

  return (
    <main className="mx-auto flex min-h-[100dvh] max-w-xl flex-col px-5 pb-16 pt-8">
      {/* Score reveal */}
      <ScoreReveal score={result.score} accent={DATA_COLOR} />

      {/* Archetype */}
      <div
        className="mt-6 text-center animate-fade-up"
        style={{ animationDelay: '400ms' }}
      >
        <div
          className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl text-4xl"
          style={{ backgroundColor: `${tier.accent}22` }}
          aria-hidden="true"
        >
          {tier.emoji}
        </div>
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-ink sm:text-4xl">
          {tier.title}
        </h1>
        <p className="mx-auto mt-3 max-w-md text-pretty text-base text-muted">
          {tier.description}
        </p>
      </div>

      {/* Signature move + spirit platform */}
      <section
        className="mt-8 grid animate-fade-up gap-3 sm:grid-cols-2"
        style={{ animationDelay: '460ms' }}
        aria-label="Your internet profile"
      >
        {[
          { tag: 'Signature move', value: result.signature.label, emoji: result.signature.emoji },
          { tag: 'Spirit platform', value: result.platform.label, emoji: result.platform.emoji },
        ].map((row) => (
          <div
            key={row.tag}
            className="flex items-center gap-3 rounded-2xl border border-edge bg-white p-3"
          >
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-cream text-xl">
              {row.emoji}
            </div>
            <div className="min-w-0">
              <div className="text-xs font-medium uppercase tracking-wide text-muted">{row.tag}</div>
              <div className="truncate text-base font-semibold text-ink">{row.value}</div>
            </div>
          </div>
        ))}
      </section>

      {/* Full stat breakdown */}
      <section
        className="mt-8 animate-fade-up rounded-2xl border border-edge bg-white p-5"
        style={{ animationDelay: '500ms' }}
        aria-label="Your internet stats"
      >
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-[0.15em] text-muted">
          Your internet stats
        </h2>
        <div className="space-y-4">
          {result.traits.map((t, i) => (
            <StatBar
              key={t.id}
              label={t.label}
              value={t.value}
              accent={DATA_COLOR}
              delay={600 + i * 120}
            />
          ))}
        </div>
      </section>

      {/* Internet Passport (screenshot card) */}
      <section className="mt-8 animate-fade-up" style={{ animationDelay: '560ms' }}>
        <h2 className="mb-3 text-center text-sm font-semibold uppercase tracking-[0.15em] text-muted">
          Your Internet Passport
        </h2>
        <PassportCard ref={cardRef} result={result} quizName={quiz.name} />
        <p className="mt-2 text-center text-xs text-muted">📸 Screenshot this to share it</p>
      </section>

      {/* Share actions */}
      <section className="mt-8 flex flex-col gap-3 animate-fade-up" style={{ animationDelay: '620ms' }}>
        <button
          type="button"
          onClick={onShare}
          className="inline-flex items-center justify-center gap-2 rounded-full bg-forest px-6 py-4 text-lg font-semibold text-cream transition-colors duration-150 hover:bg-forest-dark active:scale-[0.99]"
        >
          Share result
        </button>
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={onCopyLink}
            className="rounded-full border border-ink/15 bg-white px-6 py-3.5 font-semibold text-ink transition-colors hover:border-ink/40"
          >
            Copy link
          </button>
          <Link
            to={`/quiz/${quiz.slug}`}
            onClick={() => trackEvent('quiz_retaken', { quiz: quiz.slug })}
            className="flex items-center justify-center rounded-full border border-ink/15 bg-white px-6 py-3.5 font-semibold text-ink transition-colors hover:border-ink/40"
          >
            Retake
          </Link>
        </div>
      </section>

      {/* Viral loop */}
      <section
        className="mt-10 animate-fade-up rounded-2xl border border-edge bg-lav p-6 text-center"
        style={{ animationDelay: '680ms' }}
      >
        <h2 className="text-xl font-bold text-lav-ink">Think you&rsquo;re more online than me?</h2>
        <a
          href={quizStartUrl}
          className="mt-4 inline-flex items-center gap-2 rounded-full bg-lav-ink px-6 py-3 font-semibold text-white transition-transform duration-150 hover:scale-[1.03] active:scale-95"
        >
          Challenge a friend →
        </a>
        <p className="mt-4 text-sm text-lav-ink/70">
          Send this to the most chronically online person you know.
        </p>
      </section>

      {/* Support / monetization placeholder */}
      {(CRYPTO_WALLETS.length > 0 || SUPPORT_URL) && (
        <section className="mt-8 text-center animate-fade-up" style={{ animationDelay: '720ms' }}>
          <p className="text-sm text-ink">❤️ Enjoyed the quiz?</p>
          <p className="mx-auto mt-1 max-w-sm text-xs text-muted">
            A crypto tip keeps it online, ad-free, and funds new quizzes.
          </p>
          <div className="mt-4">
            <CryptoDonate from="result" quizSlug={quiz.slug} />
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="mt-12 text-center text-xs text-muted">
        <p>
          {SITE_NAME} · Just-for-fun — not a psychological assessment. Your answers never leave your
          device.
        </p>
      </footer>

      {/* Toast */}
      {toast && (
        <div
          role="status"
          aria-live="polite"
          className="pointer-events-none fixed inset-x-0 bottom-6 z-50 flex justify-center px-4"
        >
          <div className="rounded-full border border-edge bg-ink px-5 py-2.5 text-sm font-medium text-cream shadow-xl animate-pop-in">
            {toast.msg}
          </div>
        </div>
      )}
    </main>
  );
}
