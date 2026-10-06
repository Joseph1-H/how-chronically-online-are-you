# QuizLab — How Chronically Online Are You?

A fast, mobile-first, shareable personality quiz. Answer 20 internet-native
questions and get a 0–100 score, a funny archetype, personalized stats, and a
screenshot-ready "Internet Passport" card.

No backend. No database. No login. No tracking. Everything runs client-side,
and answers never leave the browser.

**Stack:** React 18 · Vite 5 · TypeScript · Tailwind CSS · React Router

---

## Quick start (run locally)

Requires **Node 18+** (built and tested on Node 22).

```bash
npm install
npm run dev
```

Then open the URL Vite prints (default **http://localhost:5173**).

Other scripts:

```bash
npm run build     # typecheck + production build into dist/
npm run preview   # serve the production build locally
npm run lint      # typecheck only (tsc --noEmit)
```

### Run with no server (just open the file)

```bash
npm run build
```

The build inlines all JS and CSS into a **single self-contained
`dist/index.html`**. Double-click that file (or open it in any browser) and the
whole quiz runs offline from disk — no dev server, no install needed to view.
Share the folder or the one file and it works anywhere.

> Fonts come from Google Fonts, so the first load online looks nicest; offline
> it cleanly falls back to system fonts.

---

## How it works

- **Routing** uses hash URLs so the app works everywhere with zero server
  config — opened from disk (`file://`), on any static host, and on GitHub Pages
  subpaths — all without rewrite rules.
  - `/#/` — landing page
  - `/#/quiz/chronically-online` — the quiz
  - `/#/quiz/chronically-online/result?a=<answers>` — the result (shareable, deep-linkable)

  Results are encoded entirely in the URL (`?a=` is a compact string of answer
  indices), so sharing a link reproduces the exact result with **no server**.
  Share/challenge links are built from wherever the app is actually running, so
  they're correct on your real domain automatically.

- **Scoring** lives in [`src/lib/scoring.ts`](src/lib/scoring.ts). Each answer
  carries `points` (main 0–100 score) and optional `traits` (the stat bars).
  Everything is normalized against the maximum possible, so it stays correct no
  matter how you tune the question weights.

- **Result tiers** (THE NORMIE → THE INTERNET) and all question content live in
  the quiz data file, not in components.

---

## Configuration

Edit [`src/config/constants.ts`](src/config/constants.ts):

| Constant      | What it does                                                                 |
| ------------- | ---------------------------------------------------------------------------- |
| `SITE_NAME`   | Product name shown in the UI and on the share card.                          |
| `SITE_URL`    | Your real domain. Used in share text. **Update after deploying.**            |
| `SUPPORT_URL` | Donation link (Ko-fi / Buy Me a Coffee / Stripe / GitHub Sponsors). Leave `''` to hide the support section. |

Also update the absolute URLs in [`index.html`](index.html) (`og:url`,
`og:image`, `canonical`) and [`public/robots.txt`](public/robots.txt) to your
real domain so social previews and SEO point to the right place.

---

## Adding more quizzes

The app is data-driven — you don't touch any components to add a quiz.

1. Create `src/data/quizzes/my-quiz.ts` that exports a `Quiz` object
   (copy [`chronically-online.ts`](src/data/quizzes/chronically-online.ts) as a
   template). Give it a unique `slug`, questions, `traits`, and `tiers`.
2. Register it in [`src/data/quizzes/index.ts`](src/data/quizzes/index.ts):

   ```ts
   import { myQuiz } from './my-quiz';
   export const quizzes: Quiz[] = [chronicallyOnline, myQuiz];
   ```

It's instantly live at `/quiz/<slug>` with scoring, stats, the passport card,
and sharing all working. Planned examples that fit this shape with zero code
changes: _Which City Should You Live In?_, _What Is Your Internet Archetype?_,
_How Much of a Gamer Are You?_

To change which quiz the `/` landing page features, set `FEATURED_QUIZ_SLUG` in
`src/data/quizzes/index.ts`.

---

## Analytics (opt-in later)

All tracking is a **no-op** by default — nothing is sent anywhere. Call sites
already fire clean events (`quiz_started`, `question_answered`,
`quiz_completed`, `result_shared`, `support_clicked`, …). To connect a provider
later, implement the body of `trackEvent` in
[`src/lib/analytics.ts`](src/lib/analytics.ts) — no other changes needed.

Privacy-friendly options that need no cookie banner: **Plausible** or
**Fathom**. Example (add their script tag to `index.html`, then):

```ts
export function trackEvent(event, props) {
  (window as any).plausible?.(event, { props });
}
```

---

## Deploying (free hosting)

The build output in `dist/` is fully static — a single `index.html` you can
drop on any host. Because routing is hash-based, **no SPA fallback / rewrite
config is required** (the included `_redirects` and `vercel.json` are harmless
extras, not needed). Just point the host at `dist/`.

### Netlify (drag-and-drop or Git)

- **Build command:** `npm run build`
- **Publish directory:** `dist`
- SPA fallback is handled by [`public/_redirects`](public/_redirects) (copied
  into `dist` automatically).

Or from the CLI:

```bash
npm run build
npx netlify-cli deploy --prod --dir=dist
```

### Vercel

- Import the repo; Vercel auto-detects Vite.
- **Build command:** `npm run build`, **Output:** `dist`.
- SPA rewrites are handled by [`vercel.json`](vercel.json).

```bash
npm run build
npx vercel --prod
```

### Cloudflare Pages

- **Build command:** `npm run build`, **Output directory:** `dist`.
- SPA fallback: in the Pages dashboard, no extra config is usually needed, but
  you can add a `public/_redirects` with `/* /index.html 200` (already present).

### GitHub Pages

GitHub Pages has no server-side rewrite, so add an SPA fallback:

```bash
npm run build
cp dist/index.html dist/404.html
```

Then publish `dist/` (e.g. with the `gh-pages` package). If you deploy under a
subpath like `user.github.io/repo`, set Vite's `base` in `vite.config.ts` to
`'/repo/'` and rebuild.

---

## Social preview image

A ready-to-use Open Graph image ships at
[`public/og-image.svg`](public/og-image.svg) and is referenced from
`index.html`. SVG previews render on most platforms, but a few (notably X)
prefer PNG/JPG. For best compatibility, export a **1200×630 PNG** named
`og-image.png`, drop it in `public/`, and point the `og:image` / `twitter:image`
tags at it.

---

## Accessibility & performance notes

- Semantic HTML, labeled progress bar, `aria-pressed` answer buttons, visible
  focus rings, and full keyboard play (**1–4 / A–D** to answer, **←/Backspace**
  to go back).
- Respects `prefers-reduced-motion` (animations collapse to instant).
- Stats are never color-only — every bar shows its numeric value.
- Tiny footprint: no UI framework, no analytics, ~60 KB gzipped JS.

---

## License

Do whatever you like with it. Built as an MVP you can ship today.
