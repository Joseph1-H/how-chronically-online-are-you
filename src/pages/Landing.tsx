import { Link } from 'react-router-dom';
import { getFeaturedQuiz } from '../data/quizzes';
import { SITE_NAME, SUPPORT_URL } from '../config/constants';
import { trackEvent } from '../lib/analytics';
import { useDocumentMeta } from '../hooks/useDocumentMeta';

/** Small circular progress ring for the static example-result card. */
function MiniRing({ value }: { value: number }) {
  const r = 26;
  const c = 2 * Math.PI * r;
  const offset = c - (value / 100) * c;
  return (
    <svg viewBox="0 0 64 64" className="h-16 w-16 -rotate-90" aria-hidden="true">
      <circle cx="32" cy="32" r={r} fill="none" stroke="#c9d0ea" strokeWidth="6" />
      <circle
        cx="32"
        cy="32"
        r={r}
        fill="none"
        stroke="#2a3356"
        strokeWidth="6"
        strokeLinecap="round"
        strokeDasharray={c}
        strokeDashoffset={offset}
      />
    </svg>
  );
}

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
        <a href="#top" className="flex items-center gap-2 font-bold tracking-tight text-ink">
          <span className="flex h-7 w-7 items-center justify-center rounded-md bg-forest text-sm text-cream">
            ◆
          </span>
          <span className="text-lg">
            quiz<span className="text-brick">lab</span>
          </span>
        </a>

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
        <section className="grid items-center gap-10 py-10 sm:py-16 lg:grid-cols-2 lg:gap-16">
          {/* Left: copy */}
          <div className="animate-fade-up">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brick">
              — Internet discovery
            </p>
            <h1 className="mt-5 text-5xl font-bold leading-[1.02] tracking-tight text-ink sm:text-6xl">
              How chronically <span className="text-brick">online</span> are you?
            </h1>
            <p className="mt-6 max-w-md text-lg leading-relaxed text-muted">
              There&rsquo;s normal online… and then there&rsquo;s you. In two minutes, find your
              internet archetype, your worst habit, and just how deep the algorithm has you.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                to={takeHref}
                className="inline-flex items-center gap-2 rounded-full bg-forest px-7 py-3.5 text-base font-semibold text-cream transition-colors hover:bg-forest-dark"
              >
                Take the test <span aria-hidden="true">→</span>
              </Link>
              <button
                type="button"
                onClick={() => scrollToId('archetypes')}
                className="inline-flex items-center gap-2 rounded-full border border-ink/15 px-7 py-3.5 text-base font-semibold text-ink transition-colors hover:border-ink/40"
              >
                See the archetypes
              </button>
            </div>

            <ul className="mt-7 flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted">
              {['Free', 'No sign-up', '2 minutes', 'Instant result'].map((f) => (
                <li key={f} className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-brick" aria-hidden="true" />
                  {f}
                </li>
              ))}
            </ul>
          </div>

          {/* Right: example result card */}
          <div className="animate-fade-up lg:justify-self-end" style={{ animationDelay: '120ms' }}>
            <div className="w-full max-w-md rounded-3xl border border-edge bg-white p-2 shadow-[0_24px_60px_-28px_rgba(27,26,22,0.3)]">
              <p className="px-4 pt-3 text-xs font-semibold uppercase tracking-[0.18em] text-muted">
                ● Example result
              </p>

              <div className="mt-2 rounded-2xl bg-lav p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <span className="inline-block rounded-full bg-lav-ink px-3 py-1 text-xs font-semibold text-white">
                      High score
                    </span>
                    <h2 className="mt-3 text-3xl font-bold leading-tight text-lav-ink">
                      Chronically Online
                    </h2>
                  </div>
                  <div className="relative shrink-0">
                    <MiniRing value={87} />
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-base font-bold leading-none text-lav-ink">87%</span>
                      <span className="text-[9px] font-semibold uppercase tracking-wide text-lav-ink/70">
                        online
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-2 p-2">
                {[
                  { tag: 'Signature move', value: 'Doomscrolling', emoji: '📰' },
                  { tag: 'Spirit platform', value: 'TikTok', emoji: '🎵' },
                ].map((row) => (
                  <div
                    key={row.tag}
                    className="flex items-center gap-3 rounded-2xl border border-edge bg-white p-3"
                  >
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-cream text-xl">
                      {row.emoji}
                    </div>
                    <div>
                      <div className="text-xs font-medium uppercase tracking-wide text-muted">
                        {row.tag}
                      </div>
                      <div className="text-base font-semibold text-ink">{row.value}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* How it works */}
        <section id="how" className="scroll-mt-20 border-t border-edge py-16">
          <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-brick">
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
              <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-brick">
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
          <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-brick">FAQ</h2>
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
              This quiz is free, with no ads and no tracking. If it made you laugh, a small tip
              helps keep it online and pays for building new quizzes.
            </p>
            {SUPPORT_URL ? (
              <a
                href={SUPPORT_URL}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() =>
                  trackEvent('support_clicked', { quiz: quiz.slug, from: 'landing-section' })
                }
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-forest px-7 py-3.5 text-base font-semibold text-cream transition-colors hover:bg-forest-dark"
              >
                <span aria-hidden="true">❤️</span> Support the project
              </a>
            ) : (
              <p className="mt-6 text-sm text-lav-ink/60">A support link is coming soon.</p>
            )}
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
          {SUPPORT_URL && (
            <a
              href={SUPPORT_URL}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackEvent('support_clicked', { quiz: quiz.slug, from: 'landing' })}
              className="inline-flex items-center gap-2 rounded-full border border-ink/15 px-4 py-2 font-medium text-ink transition-colors hover:border-ink/40"
            >
              <span aria-hidden="true">❤️</span> Support the project
            </a>
          )}
        </div>
      </footer>
    </div>
  );
}
