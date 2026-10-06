import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { getQuiz } from '../data/quizzes';
import type { AnswerMap } from '../lib/scoring';
import { encodeAnswers } from '../lib/scoring';
import { trackEvent } from '../lib/analytics';
import { useDocumentMeta } from '../hooks/useDocumentMeta';
import ProgressBar from '../components/ProgressBar';

const LETTERS = ['A', 'B', 'C', 'D', 'E', 'F'];
const ADVANCE_DELAY = 260; // ms — brief pause so the selection registers visually

export default function Quiz() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const quiz = slug ? getQuiz(slug) : undefined;

  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<AnswerMap>({});
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [leaving, setLeaving] = useState(false);

  useDocumentMeta({
    title: quiz ? `${quiz.title} | ${quiz.name}` : 'Quiz',
    description: quiz?.tagline,
  });

  // Fire quiz_started once.
  useEffect(() => {
    if (quiz) trackEvent('quiz_started', { quiz: quiz.slug });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [quiz?.slug]);

  const question = quiz?.questions[index];
  const total = quiz?.questions.length ?? 0;

  const goToResult = useCallback(
    (finalAnswers: AnswerMap) => {
      if (!quiz) return;
      trackEvent('quiz_completed', { quiz: quiz.slug });
      const code = encodeAnswers(quiz, finalAnswers);
      navigate(`/quiz/${quiz.slug}/result?a=${code}`);
    },
    [quiz, navigate],
  );

  const handleSelect = useCallback(
    (optionId: string) => {
      if (!quiz || !question || pendingId) return;
      setPendingId(optionId);

      const next = { ...answers, [question.id]: optionId };
      setAnswers(next);
      trackEvent('question_answered', {
        quiz: quiz.slug,
        question: question.id,
        option: optionId,
      });

      setLeaving(true);
      window.setTimeout(() => {
        if (index + 1 >= total) {
          goToResult(next);
        } else {
          setIndex((i) => i + 1);
          setPendingId(null);
          setLeaving(false);
        }
      }, ADVANCE_DELAY);
    },
    [quiz, question, answers, index, total, pendingId, goToResult],
  );

  const goBack = useCallback(() => {
    if (index === 0 || pendingId) return;
    setIndex((i) => i - 1);
  }, [index, pendingId]);

  // Keyboard navigation: 1–4 / A–D to answer, Backspace/← to go back.
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (!question) return;
      const key = e.key.toLowerCase();

      if ((key === 'backspace' || key === 'arrowleft') && index > 0) {
        e.preventDefault();
        goBack();
        return;
      }

      const numIdx = Number.parseInt(key, 10) - 1;
      const letterIdx = LETTERS.findIndex((l) => l.toLowerCase() === key);
      const idx = !Number.isNaN(numIdx) && numIdx >= 0 ? numIdx : letterIdx;

      if (idx >= 0 && idx < question.options.length) {
        e.preventDefault();
        handleSelect(question.options[idx].id);
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [question, index, handleSelect, goBack]);

  const headerKey = useMemo(() => `q-${index}`, [index]);

  if (!quiz) {
    return (
      <main className="mx-auto flex min-h-[100dvh] max-w-xl flex-col items-center justify-center gap-4 px-6 text-center">
        <h1 className="text-2xl font-bold">Quiz not found</h1>
        <Link to="/" className="text-fuchsia-400 underline">
          ← Back home
        </Link>
      </main>
    );
  }

  if (!question) return null;

  return (
    <main className="mx-auto flex min-h-[100dvh] max-w-xl flex-col px-5 pb-10 pt-6">
      {/* Top bar */}
      <div className="mb-6 flex items-center justify-between gap-4">
        <Link
          to="/"
          className="text-sm font-medium text-zinc-400 transition-colors hover:text-zinc-100"
          aria-label="Exit quiz and return home"
        >
          ← Exit
        </Link>
        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">
          {quiz.name}
        </span>
      </div>

      <ProgressBar current={index + 1} total={total} />

      {/* Question */}
      <section
        key={headerKey}
        className={`mt-8 flex flex-1 flex-col transition-all duration-200 ${
          leaving ? 'translate-y-1 opacity-0' : 'animate-fade-up'
        }`}
      >
        <h1 className="text-pretty text-2xl font-bold leading-snug sm:text-3xl">
          {question.prompt}
        </h1>

        <fieldset className="mt-6 flex flex-col gap-3" aria-label={question.prompt}>
          {question.options.map((opt, i) => {
            const selected = pendingId === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => handleSelect(opt.id)}
                aria-pressed={selected}
                className={`group flex w-full items-center gap-4 rounded-2xl border p-4 text-left transition-all duration-150 active:scale-[0.99] ${
                  selected
                    ? 'border-fuchsia-400 bg-fuchsia-500/15'
                    : 'border-white/10 bg-white/[0.03] hover:border-white/25 hover:bg-white/[0.06]'
                }`}
              >
                <span
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border text-sm font-bold transition-colors ${
                    selected
                      ? 'border-fuchsia-400 bg-fuchsia-500 text-white'
                      : 'border-white/15 bg-white/5 text-zinc-300 group-hover:text-white'
                  }`}
                  aria-hidden="true"
                >
                  {LETTERS[i]}
                </span>
                <span className="text-base font-medium text-zinc-100 sm:text-lg">{opt.label}</span>
              </button>
            );
          })}
        </fieldset>
      </section>

      {/* Bottom controls */}
      <div className="mt-6 flex items-center justify-between">
        <button
          type="button"
          onClick={goBack}
          disabled={index === 0}
          className="rounded-lg px-3 py-2 text-sm font-medium text-zinc-400 transition-colors hover:text-zinc-100 disabled:cursor-not-allowed disabled:opacity-0"
        >
          ← Back
        </button>
        <p className="text-xs text-zinc-600">Tip: press 1–4 or A–D</p>
      </div>
    </main>
  );
}
