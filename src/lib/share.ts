import { SITE_URL } from '../config/constants';
import type { Quiz, QuizResult } from '../types/quiz';

export interface SharePayload {
  title: string;
  text: string;
  url: string;
}

/** Build the share text + URL for a completed result. */
export function buildShare(quiz: Quiz, result: QuizResult, shareUrl: string): SharePayload {
  const text = `I'm ${result.score}% ${result.tier.title.toLowerCase()} ${result.tier.emoji}\nWhat are you?`;
  return {
    title: quiz.title,
    text,
    url: shareUrl,
  };
}

/** Canonical URL to retake / discover the quiz (the viral loop link). */
export function quizUrl(quiz: Quiz): string {
  return `${SITE_URL}/quiz/${quiz.slug}`;
}

export type ShareOutcome = 'shared' | 'copied' | 'dismissed' | 'failed';

/**
 * Share via the Web Share API when available, otherwise copy a nicely
 * formatted string to the clipboard. Returns what actually happened so the UI
 * can show the right confirmation.
 */
export async function shareResult(payload: SharePayload): Promise<ShareOutcome> {
  const nav = navigator as Navigator & {
    share?: (data: ShareData) => Promise<void>;
  };

  if (typeof nav.share === 'function') {
    try {
      await nav.share({ title: payload.title, text: payload.text, url: payload.url });
      return 'shared';
    } catch (err) {
      // AbortError = user closed the share sheet; not a real failure.
      if (err instanceof DOMException && err.name === 'AbortError') return 'dismissed';
      // Fall through to clipboard on any other failure.
    }
  }

  const copied = await copyText(`${payload.text}\n${payload.url}`);
  return copied ? 'copied' : 'failed';
}

/** Copy arbitrary text to the clipboard with a legacy fallback. */
export async function copyText(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    // fall through to legacy path
  }

  try {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.setAttribute('readonly', '');
    ta.style.position = 'absolute';
    ta.style.left = '-9999px';
    document.body.appendChild(ta);
    ta.select();
    const ok = document.execCommand('copy');
    document.body.removeChild(ta);
    return ok;
  } catch {
    return false;
  }
}
