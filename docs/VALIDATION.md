# Frontend validation

Validated on **11 September 2026** against the local production build, using Node.js 22.19.0, Next.js 16.3.4, Chromium 153 through Playwright, axe-core and Lighthouse 13.4.1.

## Required checks

| Check | Result |
| --- | --- |
| `npm run lint` | Passed without warnings or errors |
| `npm run typecheck` | Passed |
| `npm run build` | Passed; all supplied content routes prerendered |
| `npm run test:e2e` | 13 tests passed, final run 32.5 seconds |

The responsive matrix covers **16 content routes at six widths**: 375, 430, 768, 1024, 1440 and 1920 px. Each route returned HTTP 200, had a single H1, preserved `noindex`, produced no page JavaScript errors and had no horizontal overflow or detected broken loaded image.

Interaction checks passed for project filters and case-study navigation; sample filters, keyboard previous/next, Escape and focus restoration; mobile navigation focus containment and closing; all six real PDF responses; and three unknown routes returning HTTP 404. The contact test enters data, presses Enter and invokes the browser's form submit mechanism: no navigation, fetch/XHR or submission occurs, and local/session storage remain empty.

Accessibility scans cover the home, about, capabilities, projects, samples, why-us, insights, contact and privacy pages, representative project/article details, and both open dialogs. **No violations were reported** for WCAG 2 A/AA, WCAG 2.1 A/AA and axe best-practice checks. Reduced-motion and JavaScript-disabled content checks also pass. Manual visual review covered the desktop and mobile homepage, desktop engineering story and case study, and tablet sample library.

## Lighthouse results

Production server on localhost; default simulated mobile throttling, plus an explicit desktop profile. These are lab measurements, not field Core Web Vitals.

| Page / profile | Performance | Accessibility | Best practices | SEO | LCP | CLS |
| --- | ---: | ---: | ---: | ---: | --- | --- |
| Home / mobile | 97 | 100 | 100 | 66 | 2.6 s | 0 |
| Home / desktop | 100 | 100 | 100 | 66 | 0.6 s | 0 |
| Projects / mobile | 96 | 100 | 100 | 66 | 2.8 s | 0 |
| Samples / mobile | 97 | 100 | 100 | 66 | 2.5 s | 0 |
| Contact / mobile | 97 | 100 | 100 | 63 | 2.4 s | 0 |

The SEO target is intentionally not met because every page contains the approved **`noindex, nofollow`** directive. Lighthouse reports indexing blocked as the failing scored SEO audit. No indexing restriction was removed to improve the score. Social metadata and the local preview image are included; a real sitemap requires `SITE_URL` at build time.

The performance and accessibility targets are met. Mobile LCP of 2.6–2.8 seconds on two audited pages is slightly above the 2.5-second good Core Web Vitals threshold despite the high overall performance scores. Reassess on the actual deployed host with real traffic and network conditions.

## Artifacts and limits

- `artifacts/home-{width}.png`: full-page screenshots at each requested width.
- `artifacts/contact-desktop.png`: contact page screenshot.
- `artifacts/lighthouse-*.html` and `.json`: complete Lighthouse reports.
- `artifacts/lighthouse-summary.json`: machine-readable final scores.
- `playwright-report/index.html`: browser test report.

Generated QA artifacts are ignored by Git. Reproduce them with the commands in the README. All four WebP assets are used and total approximately 750 KB before Next.js responsive image optimization; no unused source PNGs or external image dependencies are shipped.

Testing uses Chromium viewport emulation on Windows, not physical phones, Safari/VoiceOver or NVDA. Automated accessibility results do not replace assistive-technology testing. There is no live Spline scene, enquiry integration, public deployment or real-company launch verification in this version, as agreed.
