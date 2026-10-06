import type { Question, Quiz, QuizResult, ResultTier } from '../types/quiz';

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

/** How many questions a single attempt serves. */
export function attemptLength(quiz: Quiz): number {
  return Math.min(quiz.questionsPerQuiz ?? quiz.questions.length, quiz.questions.length);
}

/** Fisher–Yates shuffle (returns a new array). */
function shuffle<T>(arr: T[]): T[] {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/**
 * Pick the questions for one attempt: a random subset of `attemptLength`, in
 * random order, each with its answer options shuffled too — so the "most
 * online" choice isn't always in the same slot. Scoring/encoding key off each
 * option's id (canonical order), so shuffling display changes nothing there.
 */
export function pickAttemptQuestions(quiz: Quiz): Question[] {
  return shuffle(quiz.questions)
    .slice(0, attemptLength(quiz))
    .map((q) => ({ ...q, options: shuffle(q.options) }));
}

/** Dominant-trait → signature move (falls back to a generic habit). */
function computeSignature(
  quiz: Quiz,
  traitValues: Array<{ id: string; value: number }>,
): QuizResult['signature'] {
  let best: { label: string; emoji: string } | null = null;
  let bestVal = -1;
  for (const def of quiz.traits) {
    if (!def.signature) continue;
    const v = traitValues.find((t) => t.id === def.id)?.value ?? 0;
    if (v > bestVal) {
      bestVal = v;
      best = def.signature;
    }
  }
  if (!best || bestVal <= 0) return { label: 'Touching grass', emoji: '🌱' };
  return best;
}

/** Tally platform affinity from answers → spirit platform. */
function computePlatform(quiz: Quiz, answers: AnswerMap): QuizResult['platform'] {
  const fallback = { label: 'The group chat', emoji: '💬' };
  if (!quiz.platforms?.length) return fallback;

  const weight: Record<string, number> = {};
  for (const q of quiz.questions) {
    const sel = answers[q.id];
    if (sel === undefined) continue;
    const opt = q.options.find((o) => o.id === sel);
    if (!opt?.platform) continue;
    weight[opt.platform] = (weight[opt.platform] ?? 0) + opt.points;
  }

  // Pick the highest-weighted platform, ties broken by catalog order.
  let winner: string | null = null;
  let max = 0;
  for (const p of quiz.platforms) {
    const w = weight[p.id] ?? 0;
    if (w > max) {
      max = w;
      winner = p.id;
    }
  }
  if (!winner) return fallback;
  const def = quiz.platforms.find((p) => p.id === winner)!;
  return { label: def.label, emoji: def.emoji };
}

/**
 * Compute a full result from an answer map.
 *
 * - Main score = chosen points / max possible points, scaled to 0–100.
 * - Each trait = chosen trait points / max possible trait points, 0–100,
 *   counting only questions that actually define that trait.
 *
 * Works on whatever subset of questions was answered (random attempts), since
 * everything normalizes against the max possible for the answered questions.
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
    if (selectedId === undefined) continue;

    const maxOptionPoints = Math.max(...q.options.map((o) => o.points));
    maxMain += maxOptionPoints;
    const chosen = q.options.find((o) => o.id === selectedId);
    gained += chosen?.points ?? 0;

    for (const t of quiz.traits) {
      const optionValues = q.options.map((o) => o.traits?.[t.id]);
      const questionHasTrait = optionValues.some((v) => v !== undefined);
      if (!questionHasTrait) continue;
      traitMax[t.id] += Math.max(...optionValues.map((v) => v ?? 0));
      traitGained[t.id] += chosen?.traits?.[t.id] ?? 0;
    }
  }

  const score = maxMain === 0 ? 0 : Math.round((gained / maxMain) * 100);

  // All traits (incl. hidden) — used for signature selection.
  const allTraits = quiz.traits.map((t) => ({
    id: t.id,
    label: t.label,
    value: traitMax[t.id] === 0 ? 0 : Math.round((traitGained[t.id] / traitMax[t.id]) * 100),
  }));

  // Hidden traits don't appear as stat bars.
  const hidden = new Set(quiz.traits.filter((t) => t.hidden).map((t) => t.id));

  return {
    score: clamp(score, 0, 100),
    tier: tierForScore(quiz, score),
    traits: allTraits.filter((t) => !hidden.has(t.id)),
    signature: computeSignature(quiz, allTraits),
    platform: computePlatform(quiz, answers),
  };
}

/** True once a given set of questions all have recorded answers. */
export function allAnswered(questions: Question[], answers: AnswerMap): boolean {
  return questions.every((q) => answers[q.id] !== undefined);
}

/** Enough answers present to show a meaningful result (shared/deep links). */
export function hasEnoughAnswers(quiz: Quiz, answers: AnswerMap): boolean {
  const min = Math.min(5, quiz.questions.length);
  return Object.keys(answers).length >= min;
}

/* ------------------------------------------------------------------ *
 * Compact URL encoding so results are linkable/shareable (no backend) *
 *                                                                     *
 * Random attempts mean the answered set varies, so we encode each     *
 * answered question explicitly as a pair of chars:                    *
 *   [question index in base36][option index 0-3]                      *
 * This is order-independent and subset-friendly. Pool must be < 36.   *
 * ------------------------------------------------------------------ */

export function encodeAnswers(quiz: Quiz, answers: AnswerMap): string {
  let out = '';
  quiz.questions.forEach((q, qi) => {
    const oi = q.options.findIndex((o) => o.id === answers[q.id]);
    if (oi === -1) return;
    out += qi.toString(36) + String(oi);
  });
  return out;
}

export function decodeAnswers(quiz: Quiz, encoded: string): AnswerMap {
  const out: AnswerMap = {};
  for (let i = 0; i + 1 < encoded.length; i += 2) {
    const qi = Number.parseInt(encoded[i], 36);
    const oi = Number.parseInt(encoded[i + 1], 10);
    const q = quiz.questions[qi];
    if (q && !Number.isNaN(oi) && oi >= 0 && oi < q.options.length) {
      out[q.id] = q.options[oi].id;
    }
  }
  return out;
}
