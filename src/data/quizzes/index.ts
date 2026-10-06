import type { Quiz } from '../../types/quiz';
import { chronicallyOnline } from './chronically-online';

/**
 * Quiz registry.
 *
 * To add a new quiz later:
 *   1. Create `./my-quiz.ts` exporting a `Quiz` object.
 *   2. Import it and add it to the `quizzes` array below.
 * Routing, scoring, and all pages pick it up automatically from its `slug`.
 */
export const quizzes: Quiz[] = [chronicallyOnline];

export function getQuiz(slug: string): Quiz | undefined {
  return quizzes.find((q) => q.slug === slug);
}

/** The quiz used for the root `/` landing page. */
export const FEATURED_QUIZ_SLUG = 'chronically-online';

export function getFeaturedQuiz(): Quiz {
  return getQuiz(FEATURED_QUIZ_SLUG) ?? quizzes[0];
}
