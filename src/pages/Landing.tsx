import { Link } from 'react-router-dom';
import { getFeaturedQuiz } from '../data/quizzes';
import { SITE_NAME } from '../config/constants';
import { useDocumentMeta } from '../hooks/useDocumentMeta';
import CryptoDonate from '../components/CryptoDonate';
import { Logo } from '../components/Logo';

const NAV = [
  { label: 'How it works', id: 'how' },
  { label: 'Archetypes', id: 'archetypes' },
  { label: 'FAQ', id: 'faq' },
  { label: 'Support', id: 'support' },
];

/** Smooth-scroll to an on-page section (hash anchors would clash with the router). */
function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
}

const STEPS = [
  { n: '01', title: 'Answer 20 questions', body: 'Quick multiple-choice. Memes, slang, screen time, the lot.' },
  { n: '02', title: 'Get your score', body: 'A 0–100 rating and one of six brutally honest internet archetypes.' },
  { n: '03', title: 'Share the damage', body: 'A screenshot-ready card and a link to challenge your group chat.' },
];

const FAQ = [
  {
    q: 'Is this a real psychological test?',
    a: 'Absolutely not. It is a just-for-fun internet culture quiz, not a psychological assessment. Enjoy it, do not frame it.',
  },
  {
    q: 'Do you collect my data?',
    a: 'No login, no email, no tracking. Everything runs in your browser and your answers never leave your device.',
  },
  {
    q: 'How long does it take?',
    a: 'About two minutes. Twenty questions, four choices each, instant result.',
  },
];

export default function Landing() {
  const quiz = getFeaturedQuiz();
  const takeHref = `/quiz/${quiz.slug}`;

  useDocumentMeta({
    title: 'How Chronically Online Are You? | Take the Quiz',
    description:
      'Take the 2-minute internet culture quiz and find out how chronically online you really are.',
  });

  return (
    <div className="mx-auto max-w-6xl px-5">
      {/* Nav */}
      <header className="flex items-center justify-between py-5">
        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          aria-label="QuizLab — back to top"
        >
          <Logo />
        </button>

        <nav className="hidden items-center gap-8 md:flex" aria-label="Primary">
          {NAV.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => scrollToId(item.id)}
              className="text-sm font-medium text-muted transition-colors hover:text-ink"
            >
              {item.label}
            </button>
          ))}
        </nav>

        <Link
          to={takeHref}
          className="inline-flex items-center gap-1.5 rounded-full bg-forest px-5 py-2.5 text-sm font-semibold text-cream transition-colors hover:bg-forest-dark"
        >
          Start <span aria-hidden="true">→</span>
        </Link>
      </header>

      {/* Hero */}
      <main id="top">
        <section className="pt-10 pb-40 text-center sm:pt-16 sm:pb-56">
          <div className="mx-auto max-w-3xl animate-fade-up">
            <span className="inline-flex items-center gap-2 rounded-full border border-edge bg-white px-3.5 py-1.5 text-xs font-semibold uppercase tracking-[0.15em] text-muted">
              <span className="h-1.5 w-1.5 rounded-full bg-brick" aria-hidden="true" />
              Internet culture quiz
            </span>

            <h1 className="mt-6 text-5xl font-extrabold leading-[1.0] tracking-tight text-ink sm:text-7xl">
              How chronically <span className="text-brick">online</span> are you?
            </h1>

            <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-muted">
              There&rsquo;s normal online… and then there&rsquo;s you. 20 questions, two minutes, and
              one brutally honest internet archetype.
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link
                to={takeHref}
                className="inline-flex items-center gap-2 rounded-full bg-forest px-8 py-4 text-base font-semibold text-cream shadow-lg shadow-forest/25 transition-transform duration-150 hover:scale-[1.03] active:scale-95"
              >
                Take the test <span aria-hidden="true">→</span>
              </Link>
              <button
                type="button"
                onClick={() => scrollToId('archetypes')}
                className="inline-flex items-center gap-2 rounded-full border border-ink/15 bg-white px-8 py-4 text-base font-semibold text-ink transition-colors hover:border-ink/40"
              >
                See the 20 archetypes
              </button>
            </div>

            <ul className="mt-7 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-muted">
              {['Free', 'No sign-up', '2 minutes', 'Instant result'].map((f) => (
                <li key={f} className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-brick" aria-hidden="true" />
                  {f}
                </li>
              ))}
            </ul>
          </div>

          {/* The online-o-meter */}
          <div
            className="mx-auto mt-16 max-w-2xl animate-fade-up"
            style={{ animationDelay: '140ms' }}
          >
            <div className="mb-3 flex items-center justify-between text-sm font-semibold text-ink">
              <span>🌱 Touch grass</span>
              <span>Terminally online 👁️</span>
            </div>
            <div className="relative">
              <div
                className="h-5 rounded-full"
                style={{
                  background: 'linear-gradient(90deg,#34d399,#fbbf24,#ff4d6d,#5b3df5)',
                }}
              />
              <div
                className="absolute -top-2.5 animate-float"
                style={{ left: '74%', transform: 'translateX(-50%)' }}
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-ink bg-white text-lg shadow-md">
                  📍
                </div>
              </div>
            </div>
            <p className="mt-6 text-sm text-muted">
              Everyone lands somewhere on the spectrum.{' '}
              <span className="font-semibold text-ink">Where do you?</span>
            </p>
          </div>
        </section>

        {/* How it works */}
        <section id="how" className="scroll-mt-20 border-t border-edge py-16">
          <h2 className="inline-block rounded-full bg-brick/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.15em] text-brick">
            How it works
          </h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-3">
            {STEPS.map((s) => (
              <div key={s.n} className="rounded-2xl border border-edge bg-white p-6">
                <div className="font-mono text-sm font-semibold text-brick">{s.n}</div>
                <h3 className="mt-3 text-xl font-bold text-ink">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{s.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Archetypes */}
        <section id="archetypes" className="scroll-mt-20 border-t border-edge py-16">
          <div className="flex items-end justify-between gap-4">
            <div>
              <h2 className="inline-block rounded-full bg-brick/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.15em] text-brick">
                The archetypes
              </h2>
              <p className="mt-2 max-w-lg text-muted">
                Six outcomes, from touching grass to becoming the feed. Which one are you?
              </p>
            </div>
          </div>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {quiz.tiers.map((tier) => (
              <div
                key={tier.title}
                className="rounded-2xl border border-edge bg-white p-5 transition-transform duration-200 hover:-translate-y-1"
              >
                <div className="flex items-center justify-between">
                  <span className="text-2xl" aria-hidden="true">
                    {tier.emoji}
                  </span>
                  <span className="font-mono text-xs text-muted">
                    {tier.min}–{tier.max}%
                  </span>
                </div>
                <h3 className="mt-3 text-lg font-bold text-ink">{tier.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted">{tier.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="scroll-mt-20 border-t border-edge py-16">
          <h2 className="inline-block rounded-full bg-brick/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.15em] text-brick">FAQ</h2>
          <div className="mt-8 max-w-2xl divide-y divide-edge">
            {FAQ.map((item) => (
              <div key={item.q} className="py-5">
                <h3 className="text-lg font-semibold text-ink">{item.q}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{item.a}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Support / donate */}
        <section id="support" className="scroll-mt-20 border-t border-edge py-16">
          <div className="mx-auto max-w-2xl rounded-3xl border border-edge bg-lav p-8 text-center">
            <div className="text-4xl" aria-hidden="true">
              ❤️
            </div>
            <h2 className="mt-3 text-2xl font-bold text-lav-ink sm:text-3xl">Enjoyed the quiz?</h2>
            <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-lav-ink/80">
              This quiz is free, with no ads and no tracking. If it made you laugh, a crypto tip
              helps keep it online and pays for building new quizzes.
            </p>
            <div className="mt-6">
              <CryptoDonate from="landing-section" quizSlug={quiz.slug} />
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="border-t border-edge py-16 text-center">
          <h2 className="mx-auto max-w-xl text-3xl font-bold tracking-tight text-ink sm:text-4xl">
            Ready to find out?
          </h2>
          <p className="mt-3 text-muted">{quiz.blurb}</p>
          <Link
            to={takeHref}
            className="mt-7 inline-flex items-center gap-2 rounded-full bg-forest px-8 py-4 text-lg font-semibold text-cream transition-colors hover:bg-forest-dark"
          >
            Take the test <span aria-hidden="true">→</span>
          </Link>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-edge py-8 text-sm text-muted">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <p>
            {SITE_NAME} · Just-for-fun — not a psychological assessment. No login, no tracking.
          </p>
          <button
            type="button"
            onClick={() => scrollToId('support')}
            className="inline-flex items-center gap-2 rounded-full border border-ink/15 px-4 py-2 font-medium text-ink transition-colors hover:border-ink/40"
          >
            <span aria-hidden="true">❤️</span> Support the project
          </button>
        </div>
      </footer>
    </div>
  );
}
