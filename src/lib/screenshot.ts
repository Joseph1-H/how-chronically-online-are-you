import html2canvas from 'html2canvas';

/**
 * Render a DOM node to a PNG Blob (2x for crispness). Uses html2canvas, which
 * paints the element's real laid-out boxes — so wrapped text stays where it is
 * (unlike foreignObject-based tools that re-flow and overlap). Returns null on
 * failure so callers can fall back to text sharing.
 */
export async function captureNode(node: HTMLElement, backgroundColor: string): Promise<Blob | null> {
  try {
    const canvas = await html2canvas(node, {
      scale: 2,
      backgroundColor,
      useCORS: true,
      logging: false,
    });
    return await new Promise<Blob | null>((resolve) =>
      canvas.toBlob((b) => resolve(b), 'image/png'),
    );
  } catch {
    return null;
  }
}
