/**
 * Core quiz type system.
 *
 * Everything the app renders is driven by these data structures, so adding a
 * new quiz means dropping a new `Quiz` object into `src/data/quizzes/` and
 * registering it — no component changes required.
 */

/** A single trait/stat bar shown on the result card (e.g. "Meme Knowledge"). */
export interface TraitDef {
  /** Stable key referenced by answer option `traits` maps. */
  id: string;
  /** Display name, e.g. "Meme Knowledge". */
  label: string;
  /**
   * If true, the trait is *inverted*: options that score high on the main
   * scale contribute LOW values here. Used for "Touching Grass".
   */
  invert?: boolean;
}

/** One selectable answer. */
export interface AnswerOption {
  id: string;
  label: string;
  /** Contribution to the main 0..max score for this question. */
  points: number;
  /**
   * Optional per-trait contributions (0..some max). Values are summed per
   * trait across answered questions and normalized to 0–100 at the end.
   */
  traits?: Record<string, number>;
}

/** One quiz question. */
export interface Question {
  id: string;
  /** Loose topic tag, useful for analytics/future filtering. */
  topic?: string;
  prompt: string;
  options: AnswerOption[];
}

/** A scored outcome band. */
export interface ResultTier {
  /** Inclusive lower bound (0–100). */
  min: number;
  /** Inclusive upper bound (0–100). */
  max: number;
  title: string;
  description: string;
  emoji: string;
  /** Tailwind gradient classes applied to the result hero + card. */
  gradient: string;
  /** Accent color (hex) used for the score ring + highlights. */
  accent: string;
}

/** A complete quiz definition. */
export interface Quiz {
  /** URL slug: /quiz/<slug> */
  slug: string;
  /** Short name for cards/registry. */
  name: string;
  /** Big hero title. */
  title: string;
  /** Hero subtitle. */
  subtitle: string;
  /** One-line meta description / card blurb. */
  tagline: string;
  /** Emoji shown on the landing hero + quiz cards. */
  emoji: string;
  /** Short "how it works" line, e.g. "20 questions. 2 minutes. Zero judgment." */
  blurb: string;
  questions: Question[];
  traits: TraitDef[];
  tiers: ResultTier[];
  /** Whether this quiz is live in the registry UI. */
  published: boolean;
}

/** Computed result after scoring. */
export interface QuizResult {
  /** Normalized main score, 0–100. */
  score: number;
  tier: ResultTier;
  /** Normalized trait values, 0–100, in the order quiz.traits defines them. */
  traits: Array<{ id: string; label: string; value: number }>;
}
