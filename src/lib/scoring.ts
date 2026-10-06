import type { Quiz, QuizResult, ResultTier } from '../types/quiz';

/** Map of questionId -> selected optionId. */
export type AnswerMap = Record<string, string>;

function clamp(n: number, lo: number, hi: number): number {
  return Math.max(lo, Math.min(hi, n));
}

/** Resolve the tier a 0–100 score falls into (defensive against gaps). */
export function tierForScore(quiz: Quiz, score: number): ResultTier {
  const s = clamp(score, 0, 100);
  const hit = quiz.tiers.find((t) => s >= t.min && s <= t.max);
  return hit ?? quiz.tiers[quiz.tiers.length - 1];
}

/**
 * Compute a full result from an answer map.
 *
 * - Main score = chosen points / max possible points, scaled to 0–100.
 * - Each trait = chosen trait points / max possible trait points, 0–100,
 *   counting only questions that actually define that trait.
 *
 * Unanswered questions simply contribute 0 (and are excluded from the max),
 * so partial results stay sensible — but the UI only scores complete runs.
 */
export function computeResult(quiz: Quiz, answers: AnswerMap): QuizResult {
  let gained = 0;
  let maxMain = 0;

  const traitGained: Record<string, number> = {};
  const traitMax: Record<string, number> = {};
  for (const t of quiz.traits) {
    traitGained[t.id] = 0;
    traitMax[t.id] = 0;
  }

  for (const q of quiz.questions) {
    const selectedId = answers[q.id];
    const isAnswered = selectedId !== undefined;

    // Main score contribution.
    const maxOptionPoints = Math.max(...q.options.map((o) => o.points));
    if (isAnswered) {
      maxMain += maxOptionPoints;
      const chosen = q.options.find((o) => o.id === selectedId);
      gained += chosen?.points ?? 0;
    }

    // Per-trait contribution — only for traits this question references.
    for (const t of quiz.traits) {
      const optionValues = q.options.map((o) => o.traits?.[t.id]);
      const questionHasTrait = optionValues.some((v) => v !== undefined);
      if (!questionHasTrait || !isAnswered) continue;

      const maxTraitForQ = Math.max(...optionValues.map((v) => v ?? 0));
      traitMax[t.id] += maxTraitForQ;
      const chosen = q.options.find((o) => o.id === selectedId);
      traitGained[t.id] += chosen?.traits?.[t.id] ?? 0;
    }
  }

  const score = maxMain === 0 ? 0 : Math.round((gained / maxMain) * 100);

  const traits = quiz.traits.map((t) => ({
    id: t.id,
    label: t.label,
    value: traitMax[t.id] === 0 ? 0 : Math.round((traitGained[t.id] / traitMax[t.id]) * 100),
  }));

  return {
    score: clamp(score, 0, 100),
    tier: tierForScore(quiz, score),
    traits,
  };
}

/** True once every question has a recorded answer. */
export function isComplete(quiz: Quiz, answers: AnswerMap): boolean {
  return quiz.questions.every((q) => answers[q.id] !== undefined);
}

/* ------------------------------------------------------------------ *
 * Compact URL encoding so results are linkable/shareable (no backend) *
 * ------------------------------------------------------------------ */

/**
 * Encode answers as a string of option indices in question order, e.g.
 * "01233210…". Unanswered questions become "_".
 */
export function encodeAnswers(quiz: Quiz, answers: AnswerMap): string {
  return quiz.questions
    .map((q) => {
      const idx = q.options.findIndex((o) => o.id === answers[q.id]);
      return idx === -1 ? '_' : String(idx);
    })
    .join('');
}

/** Inverse of {@link encodeAnswers}. Ignores malformed characters safely. */
export function decodeAnswers(quiz: Quiz, encoded: string): AnswerMap {
  const out: AnswerMap = {};
  for (let i = 0; i < quiz.questions.length && i < encoded.length; i++) {
    const q = quiz.questions[i];
    const ch = encoded[i];
    const idx = Number.parseInt(ch, 10);
    if (!Number.isNaN(idx) && idx >= 0 && idx < q.options.length) {
      out[q.id] = q.options[idx].id;
    }
  }
  return out;
}
