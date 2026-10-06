import { useMemo, useRef, useState } from 'react';
import { Link, Navigate, useParams, useSearchParams } from 'react-router-dom';
import { getQuiz } from '../data/quizzes';
import { computeResult, decodeAnswers, isComplete } from '../lib/scoring';
import { buildShare, copyText, shareResult } from '../lib/share';
import { trackEvent } from '../lib/analytics';
import { SITE_NAME, SUPPORT_URL } from '../config/constants';
import { useDocumentMeta } from '../hooks/useDocumentMeta';
import ScoreReveal from '../components/ScoreReveal';
import StatBar from '../components/StatBar';
import PassportCard from '../components/PassportCard';

type Toast = { msg: string } | null;

export default function Result() {
  const { slug } = useParams();
  const [params] = useSearchParams();
  const quiz = slug ? getQuiz(slug) : undefined;

  const cardRef = useRef<HTMLDivElement>(null);
  const [toast, setToast] = useState<Toast>(null);

  const code = params.get('a') ?? '';
  const answers = useMemo(() => (quiz ? decodeAnswers(quiz, code) : {}), [quiz, code]);
  const complete = quiz ? isComplete(quiz, answers) : false;
  const result = useMemo(
    () => (quiz && complete ? computeResult(quiz, answers) : null),
    [quiz, complete, answers],
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

  function onSupport() {
    trackEvent('support_clicked', { quiz: quiz!.slug });
  }

  return (
    <main className="mx-auto flex min-h-[100dvh] max-w-xl flex-col px-5 pb-16 pt-8">
      {/* Score reveal */}
      <ScoreReveal score={result.score} accent={tier.accent} />

      {/* Archetype */}
      <div
        className="mt-6 text-center animate-fade-up"
        style={{ animationDelay: '400ms' }}
      >
        <div className="text-5xl" aria-hidden="true">
          {tier.emoji}
        </div>
        <h1
          className={`mt-2 bg-gradient-to-r ${tier.gradient} bg-clip-text text-3xl font-bold tracking-tight text-transparent sm:text-4xl`}
        >
          {tier.title}
        </h1>
        <p className="mx-auto mt-3 max-w-md text-pretty text-base text-zinc-300">
          {tier.description}
        </p>
      </div>

      {/* Full stat breakdown */}
      <section
        className="mt-8 animate-fade-up rounded-2xl border border-white/10 bg-white/[0.03] p-5"
        style={{ animationDelay: '500ms' }}
        aria-label="Your internet stats"
      >
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-[0.15em] text-zinc-400">
          Your internet stats
        </h2>
        <div className="space-y-4">
          {result.traits.map((t, i) => (
            <StatBar
              key={t.id}
              label={t.label}
              value={t.value}
              accent={tier.accent}
              delay={600 + i * 120}
            />
          ))}
        </div>
      </section>

      {/* Internet Passport (screenshot card) */}
      <section className="mt-8 animate-fade-up" style={{ animationDelay: '560ms' }}>
        <h2 className="mb-3 text-center text-sm font-semibold uppercase tracking-[0.15em] text-zinc-400">
          Your Internet Passport
        </h2>
        <PassportCard ref={cardRef} result={result} quizName={quiz.name} />
        <p className="mt-2 text-center text-xs text-zinc-500">📸 Screenshot this to share it</p>
      </section>

      {/* Share actions */}
      <section className="mt-8 flex flex-col gap-3 animate-fade-up" style={{ animationDelay: '620ms' }}>
        <button
          type="button"
          onClick={onShare}
          className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-fuchsia-500 via-pink-500 to-violet-500 px-6 py-4 text-lg font-bold text-white shadow-lg shadow-fuchsia-500/25 transition-transform duration-150 hover:scale-[1.02] active:scale-95"
        >
          SHARE RESULT
        </button>
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={onCopyLink}
            className="rounded-2xl border border-white/15 bg-white/5 px-6 py-3.5 font-semibold text-zinc-100 transition-colors hover:bg-white/10"
          >
            COPY LINK
          </button>
          <Link
            to={`/quiz/${quiz.slug}`}
            onClick={() => trackEvent('quiz_retaken', { quiz: quiz.slug })}
            className="flex items-center justify-center rounded-2xl border border-white/15 bg-white/5 px-6 py-3.5 font-semibold text-zinc-100 transition-colors hover:bg-white/10"
          >
            RETAKE
          </Link>
        </div>
      </section>

      {/* Viral loop */}
      <section
        className="mt-10 animate-fade-up rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.06] to-transparent p-6 text-center"
        style={{ animationDelay: '680ms' }}
      >
        <h2 className="text-xl font-bold">Think you're more online than me?</h2>
        <a
          href={quizStartUrl}
          className="mt-4 inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 font-bold text-ink transition-transform duration-150 hover:scale-[1.03] active:scale-95"
        >
          CHALLENGE A FRIEND →
        </a>
        <p className="mt-4 text-sm text-zinc-400">
          Send this to the most chronically online person you know.
        </p>
      </section>

      {/* Support / monetization placeholder */}
      {SUPPORT_URL && (
        <section className="mt-8 text-center animate-fade-up" style={{ animationDelay: '720ms' }}>
          <p className="text-sm text-zinc-300">❤️ Enjoyed the quiz?</p>
          <p className="mx-auto mt-1 max-w-sm text-xs text-zinc-500">
            If this made you laugh, you can support the project.
          </p>
          <a
            href={SUPPORT_URL}
            target="_blank"
            rel="noopener noreferrer"
            onClick={onSupport}
            className="mt-3 inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-5 py-2.5 text-sm font-semibold text-zinc-100 transition-colors hover:bg-white/10"
          >
            SUPPORT THE PROJECT
          </a>
        </section>
      )}

      {/* Footer */}
      <footer className="mt-12 text-center text-xs text-zinc-600">
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
          <div className="rounded-full border border-white/15 bg-zinc-900/95 px-5 py-2.5 text-sm font-medium text-zinc-100 shadow-xl backdrop-blur animate-pop-in">
            {toast.msg}
          </div>
        </div>
      )}
    </main>
  );
}
