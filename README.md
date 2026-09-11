# FORMWORK Engineering

A complete editorial marketing frontend for a **fictional engineering studio**. Built with Next.js App Router, React, strict TypeScript, Tailwind CSS and Motion. Project data and copy live in `content/`; all imagery, drawing previews and PDFs are served locally.

## Run locally

Requires Node.js 22+ and npm. The verified development environment uses Node 22.19.0.

```sh
npm ci
npm run dev
```

Open http://localhost:3000. For the production version:

```sh
npm run build
npm run start
```

No credentials or external services are needed. Next.js downloads the Geist fonts at build time and serves them locally thereafter, so the first build requires network access.

## Included

- Home, About, Capabilities, Projects, Samples, Why Us, Insights and Contact.
- Four statically generated concept case studies and three full editorial articles using dynamic routes.
- Six original SVG sample sheets with matching real PDF downloads.
- Responsive project/sample filters, native modal previews and mobile navigation with focus containment and restoration.
- A six-stage engineering illustration story: sticky on desktop, stacked on mobile, ordinary browser scrolling and reduced-motion support.
- A contact form preview that prevents submission and has no persistence, requests, uploads or simulated success state.
- Page metadata, a social preview image, favicon, custom 404 and demo privacy/terms page.

## Content and structure

| Location | Responsibility |
| --- | --- |
| `app/` | Small compositional routes, root layout, metadata routes |
| `components/` | Typed layouts, sections, galleries and interactions |
| `content/site.ts` | Demo identity, navigation and footer content |
| `content/pages.ts`, `content/sections.ts` | Page and section copy |
| `content/projects.ts` | Case studies; `featured` selects homepage entries |
| `content/insights.ts` | Articles with typed section and paragraph content |
| `content/services.ts`, `content/samples.ts` | Capabilities and sample library |
| `content/engineering-story.ts` | Engineering narrative stages |
| `types/`, `lib/` | Content contracts and small shared utilities |
| `public/` | Local images, brand mark, SVG sheets and PDFs |
| `tests/`, `scripts/` | Browser verification, asset preparation and audits |

Add a project or insight to its content array with a unique slug; its detail route is generated automatically. Array order determines display order. There is no CMS, database, authentication, business API or global state library.

## Verification

```sh
npm run lint
npm run typecheck
npm run build
npx playwright install chromium
npm run test:e2e
```

The browser suite starts the production server automatically when port 3000 is free. If a server is already running, ensure it serves the latest production build. Tests cover all 16 content routes at 375, 430, 768, 1024, 1440 and 1920 px, accessibility, navigation, filters, dialog keyboard behavior, valid PDF responses, 404s, and the non-submitting form. Screenshots and traces are local ignored artifacts.

For Lighthouse, keep `npm run start` running in another terminal, then run:

```sh
node scripts/audit.mjs
```

Reports are written to `artifacts/`. See [validation notes](docs/VALIDATION.md) for recorded results and limits.

## Production configuration

The frontend is ready for Vercel's Next.js preset: install with `npm ci`, build with `npm run build`, and use a supported Node 22+ runtime. No custom output directory is required. Public deployment has not been performed.

Set `SITE_URL` to the verified HTTPS origin before building to generate real sitemap URLs and canonical social image URLs. If absent, the sitemap is intentionally empty; social metadata uses the Vercel preview host when available or localhost for local development. See `.env.example`.

All pages deliberately remain **noindex, nofollow**, even when a domain is configured. `robots.txt` permits crawling so crawlers can read those directives. Replace/confirm company identity, project claims, contact information and legal copy before changing the root metadata's indexing policy. No client logos, testimonials or invented delivery metrics are included.

## Deferred work

- **Enquiries:** no Google Apps Script, Sheets connection, API route, server action, upload or submission handler. The user explicitly deferred this. Add real contact details and separately implement/validate submission before enabling the button.
- **Live Spline:** the agreed illustrated alternative is complete. Replace only the visual renderer when a suitable scene is supplied; preserve HTML narrative, normal scrolling and static/mobile/reduced-motion fallbacks.
- **Deployment:** configuration is ready, but no public site or connected account was created.

## Assets and design sources

See [asset provenance and generation prompts](docs/ASSET_PROVENANCE.md). The four generated concept images are optimized WebP files in `public/images/projects/`; the original generated PNGs are not required to run or build the site. `node scripts/prepare-assets.mjs` regenerates the SVG/PDF sheets and favicon. Passing the original source directory additionally regenerates the image derivatives.

Project guidance: [design](docs/frontend-design-guide.md), [content](docs/content.md), [architecture](docs/REPO_STRUCTURE.md), [Spline plan](docs/SPLINE_PLAN.md). The user's approved plan supersedes live Spline and enquiry submission for this version. Small accent text uses a darker burnt-orange variant to meet contrast requirements.
