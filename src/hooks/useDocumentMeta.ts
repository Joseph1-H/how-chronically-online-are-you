import { useEffect } from 'react';

interface Meta {
  title?: string;
  description?: string;
}

function setMetaTag(attr: 'name' | 'property', key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

/**
 * Update <title> and key meta tags per route. Pure client-side (SPA) — good
 * for in-app/SEO crawlers that run JS. Static crawlers still get the sensible
 * defaults baked into index.html.
 */
export function useDocumentMeta({ title, description }: Meta): void {
  useEffect(() => {
    if (title) {
      document.title = title;
      setMetaTag('property', 'og:title', title);
      setMetaTag('name', 'twitter:title', title);
    }
    if (description) {
      setMetaTag('name', 'description', description);
      setMetaTag('property', 'og:description', description);
      setMetaTag('name', 'twitter:description', description);
    }
  }, [title, description]);
}
