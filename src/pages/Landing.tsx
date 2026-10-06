import { Link } from 'react-router-dom';
import { getFeaturedQuiz } from '../data/quizzes';
import { SITE_NAME, SUPPORT_URL } from '../config/constants';
import { trackEvent } from '../lib/analytics';
import { useDocumentMeta } from '../hooks/useDocumentMeta';

export default function Landing() {
  const quiz = getFeaturedQuiz();

  useDocumentMeta({
    title: 'How Chronically Online Are You? | Take the Quiz',
    description:
      'Take the 2-minute internet culture quiz and find out how chronically online you really are.',
  });

  return (
    <main className="mx-auto flex min-h-[100dvh] max-w-2xl flex-col px-5 pb-16 pt-8 sm:pt-16">
      {/* Brand */}
      <div className="flex items-center justify-center">
        <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-zinc-400">
          {SITE_NAME}
        </span>
      </div>

      {/* Hero */}
      <div className="flex flex-1 flex-col items-center justify-center text-center">
        <div className="mb-6 animate-float text-6xl sm:text-7xl" aria-hidden="true">
          {quiz.emoji}
        </div>

        <h1 className="animate-fade-up text-balance text-4xl font-bold leading-[1.05] tracking-tight sm:text-6xl">
          <span className="bg-gradient-to-r from-fuchsia-400 via-pink-400 to-violet-400 bg-[length:200%_auto] bg-clip-text text-transparent">
            HOW CHRONICALLY ONLINE ARE YOU?
          </span>
        </h1>

        <p
          className="mt-5 animate-fade-up text-lg text-zinc-300 sm:text-xl"
          style={{ animationDelay: '80ms' }}
        >
          {quiz.subtitle}
        </p>

        <Link
          to={`/quiz/${quiz.slug}`}
          className="group mt-9 inline-flex animate-fade-up items-center gap-2 rounded-2xl bg-gradient-to-r from-fuchsia-500 via-pink-500 to-violet-500 px-8 py-4 text-lg font-bold text-white shadow-lg shadow-fuchsia-500/25 transition-transform duration-200 hover:scale-[1.03] focus-visible:scale-[1.03] active:scale-95"
          style={{ animationDelay: '160ms' }}
        >
          TAKE THE TEST
          <span className="transition-transform duration-200 group-hover:translate-x-1">→</span>
        </Link>

        <p
          className="mt-5 animate-fade-up text-sm font-medium text-zinc-400"
          style={{ animationDelay: '220ms' }}
        >
          {quiz.blurb}
        </p>

        {/* Social proof-ish strip (static, honest flavor text) */}
        <div
          className="mt-8 flex animate-fade-up flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs text-zinc-500"
          style={{ animationDelay: '280ms' }}
        >
          <span>🧠 6 internet archetypes</span>
          <span>📊 Personalized stats</span>
          <span>📸 Shareable result card</span>
        </div>
      </div>

      {/* Disclaimer */}
      <p className="mx-auto mt-10 max-w-md text-center text-xs leading-relaxed text-zinc-500">
        This is a just-for-fun internet culture quiz, not a psychological assessment. No login, no
        email, no tracking — everything runs in your browser.
      </p>

      {/* Donate button (shows once SUPPORT_URL is set in src/config/constants.ts) */}
      {SUPPORT_URL && (
        <div className="mt-6 flex justify-center">
          <a
            href={SUPPORT_URL}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackEvent('support_clicked', { quiz: quiz.slug, from: 'landing' })}
            className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm font-medium text-zinc-300 transition-colors hover:bg-white/10 hover:text-white"
          >
            <span aria-hidden="true">❤️</span>
            Support the project
          </a>
        </div>
      )}
    </main>
  );
}
