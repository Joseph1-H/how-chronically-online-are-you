import { toBlob } from 'html-to-image';

/**
 * Render a DOM node to a PNG Blob (2x for crispness). Returns null on failure
 * so callers can fall back to text sharing. Retries with fonts skipped if the
 * first pass trips on cross-origin web fonts.
 */
export async function captureNode(node: HTMLElement, backgroundColor: string): Promise<Blob | null> {
  const base = { pixelRatio: 2, backgroundColor, cacheBust: true };
  try {
    return await toBlob(node, base);
  } catch {
    try {
      return await toBlob(node, { ...base, skipFonts: true });
    } catch {
      return null;
    }
  }
}
