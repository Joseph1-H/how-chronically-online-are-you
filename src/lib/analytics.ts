/**
 * Analytics abstraction.
 *
 * These are intentionally no-ops for the MVP: no tracking is installed, no
 * cookies are set, and nothing leaves the device. To connect a provider later
 * (Plausible, PostHog, GA, etc.), implement the body of `trackEvent` — every
 * call site already passes a clean event name and optional properties.
 */

export type AnalyticsEvent =
  | 'quiz_started'
  | 'question_answered'
  | 'quiz_completed'
  | 'result_shared'
  | 'result_copied'
  | 'support_clicked'
  | 'quiz_retaken';

export function trackEvent(
  event: AnalyticsEvent,
  props?: Record<string, string | number | boolean>,
): void {
  // No-op by default. Example wiring for later:
  //   window.plausible?.(event, { props });
  //   posthog?.capture(event, props);
  if (import.meta.env.DEV) {
    // Helpful during development; stripped mentally in prod (and harmless).
    // eslint-disable-next-line no-console
    console.debug('[analytics]', event, props ?? {});
  }
}
