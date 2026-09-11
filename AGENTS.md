# AGENTS.md

## Project

Premium construction / engineering marketing website built with Next.js, TypeScript, Tailwind CSS, Motion, and Vercel.

V1 is frontend-only. Contact forms use Google Apps Script / Google Sheets. Do not add a database, CMS, authentication, or backend unless explicitly requested.

## Before Coding

Read:

- `docs/frontend-design-guide.md`
- `docs/content.md`
- `docs/REPO_STRUCTURE.md`
- `docs/SPLINE_PLAN.md`

## Core Rules

- Keep content separate from presentation.
- Store company, project, service, and navigation data in `content/`.
- Keep page files small and compositional.
- Use reusable, typed components.
- Prefer Server Components; use client components only when interaction requires them.
- Use dynamic routes for project and insight detail pages.
- Keep assets organized under `public/`.
- Do not add dependencies unless they provide clear value.

## Design Rules

Target:

**premium engineering × architecture studio × industrial editorial**

Avoid generic SaaS layouts, excessive rounded cards, blue/purple gradients, glassmorphism, blobs, floating objects, excessive shadows, icon grids, and repetitive card layouts.

Prioritize typography, whitespace, large project imagery, technical drawings, disciplined grids, restrained motion, and purposeful 3D.

## 3D

Spline is only for the signature engineering storytelling section.

- lazy-load it
- provide static/mobile fallbacks
- keep important text in HTML
- do not use scroll-jacking
- optimize performance

## Before Finishing

- test desktop, tablet, and mobile
- verify accessibility
- run lint
- run production build
- remove unused code/assets
- confirm the result follows the project docs
