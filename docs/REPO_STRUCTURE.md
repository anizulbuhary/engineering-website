# Frontend Architecture & Repository Structure Guide

## Project Type

Premium construction / engineering company website.

### Initial stack

```text
Next.js
TypeScript
Tailwind CSS
Motion
Lucide Icons
Vercel
Google Apps Script
Google Sheets
```

### Initial architecture

```text
Browser
  ↓
Next.js website on Vercel
  ↓
Contact / enquiry form
  ↓
Google Apps Script
  ├── saves enquiry to Google Sheets
  └── sends notification email
```

There is **no application backend or database in V1**.

The repository should still be structured so that Supabase, a CMS, authentication, or server-side APIs can be added later without rebuilding the frontend.

---

# 1. Main Architecture Principle

The website must be:

- content-driven
- component-based
- easy to extend
- easy to remove sections from
- easy to reorder
- easy to maintain
- easy to redesign
- ready for a future CMS/backend
- free from duplicated page content

Do not hard-code large amounts of content directly inside visual components.

Use this separation:

```text
CONTENT
   ↓
DATA / CONFIG
   ↓
COMPONENTS
   ↓
PAGES
```

Example:

```text
content/projects.ts
        ↓
components/projects/ProjectCard.tsx
        ↓
components/projects/ProjectGrid.tsx
        ↓
app/projects/page.tsx
```

This means changing a project should usually require editing **one content file**, not several components.

---

# 2. Recommended Repository Structure

```text
/
├── app/
│   ├── (marketing)/
│   │   ├── about/
│   │   │   └── page.tsx
│   │   │
│   │   ├── capabilities/
│   │   │   └── page.tsx
│   │   │
│   │   ├── projects/
│   │   │   ├── page.tsx
│   │   │   └── [slug]/
│   │   │       └── page.tsx
│   │   │
│   │   ├── samples/
│   │   │   └── page.tsx
│   │   │
│   │   ├── insights/
│   │   │   ├── page.tsx
│   │   │   └── [slug]/
│   │   │       └── page.tsx
│   │   │
│   │   ├── contact/
│   │   │   └── page.tsx
│   │   │
│   │   └── page.tsx
│   │
│   ├── layout.tsx
│   ├── globals.css
│   ├── not-found.tsx
│   ├── sitemap.ts
│   └── robots.ts
│
├── components/
│   ├── layout/
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   ├── MobileNav.tsx
│   │   └── PageShell.tsx
│   │
│   ├── sections/
│   │   ├── Hero.tsx
│   │   ├── AboutPreview.tsx
│   │   ├── CapabilitiesPreview.tsx
│   │   ├── SelectedProjects.tsx
│   │   ├── WhyUs.tsx
│   │   ├── ProcessSection.tsx
│   │   ├── ClientsSection.tsx
│   │   ├── SamplesPreview.tsx
│   │   └── ContactCTA.tsx
│   │
│   ├── projects/
│   │   ├── ProjectCard.tsx
│   │   ├── ProjectGrid.tsx
│   │   ├── ProjectHero.tsx
│   │   ├── ProjectMetadata.tsx
│   │   └── ProjectGallery.tsx
│   │
│   ├── capabilities/
│   │   ├── CapabilityRow.tsx
│   │   └── CapabilityList.tsx
│   │
│   ├── samples/
│   │   ├── SampleCard.tsx
│   │   └── SampleGallery.tsx
│   │
│   ├── forms/
│   │   └── ContactForm.tsx
│   │
│   ├── ui/
│   │   ├── Button.tsx
│   │   ├── Container.tsx
│   │   ├── SectionHeading.tsx
│   │   ├── SectionIndex.tsx
│   │   ├── TechnicalLabel.tsx
│   │   ├── ImageReveal.tsx
│   │   └── AnimatedLine.tsx
│   │
│   └── seo/
│       └── JsonLd.tsx
│
├── content/
│   ├── site.ts
│   ├── navigation.ts
│   ├── homepage.ts
│   ├── about.ts
│   ├── capabilities.ts
│   ├── projects.ts
│   ├── samples.ts
│   ├── insights.ts
│   ├── process.ts
│   ├── clients.ts
│   └── contact.ts
│
├── config/
│   ├── site.ts
│   ├── routes.ts
│   └── animations.ts
│
├── lib/
│   ├── utils.ts
│   ├── seo.ts
│   ├── forms.ts
│   └── image.ts
│
├── types/
│   ├── project.ts
│   ├── capability.ts
│   ├── sample.ts
│   ├── insight.ts
│   └── contact.ts
│
├── public/
│   ├── brand/
│   │   ├── logo.svg
│   │   ├── logo-mark.svg
│   │   └── favicon.svg
│   │
│   ├── images/
│   │   ├── hero/
│   │   ├── about/
│   │   ├── capabilities/
│   │   ├── projects/
│   │   ├── samples/
│   │   ├── insights/
│   │   └── cta/
│   │
│   ├── graphics/
│   │   ├── grids/
│   │   ├── technical/
│   │   └── textures/
│   │
│   └── documents/
│       └── samples/
│
├── scripts/
│   └── validate-content.ts
│
├── docs/
│   ├── FRONTEND_DESIGN_GUIDE.md
│   ├── CONTENT_GUIDE.md
│   └── REPO_STRUCTURE.md
│
├── .env.example
├── .gitignore
├── next.config.ts
├── package.json
├── tsconfig.json
├── postcss.config.mjs
└── README.md
```

---

# 3. Why Use `(marketing)`?

Next.js route groups allow related pages to be grouped without changing the URL.

Example:

```text
app/(marketing)/about/page.tsx
```

still produces:

```text
/about
```

This keeps public marketing pages organized.

Later, if an admin dashboard is added:

```text
app/
├── (marketing)/
└── (admin)/
```

The repository remains clean.

---

# 4. Content Must Live Outside Components

Bad:

```tsx
export function ProjectCard() {
  return (
    <div>
      <h3>Marina Tower</h3>
      <p>Abu Dhabi</p>
    </div>
  )
}
```

This mixes content with presentation.

Better:

```ts
// content/projects.ts

export const projects = [
  {
    slug: "marina-tower",
    title: "Marina Tower",
    location: "Abu Dhabi, UAE",
    category: "Structural Engineering",
  },
]
```

Then:

```tsx
<ProjectCard project={project} />
```

Benefits:

- easy content editing
- easy future CMS migration
- less duplicated code
- simpler testing
- easier page redesign
- easier addition/removal of projects

---

# 5. Strong TypeScript Types

Create reusable content types.

Example:

```ts
// types/project.ts

export type Project = {
  slug: string
  title: string
  location: string
  category: string
  year?: string
  status?: string
  description: string
  image: string
  featured?: boolean
  services?: string[]
  gallery?: string[]
}
```

Then:

```ts
// content/projects.ts

import type { Project } from "@/types/project"

export const projects: Project[] = [
  {
    slug: "project-one",
    title: "Project One",
    location: "Abu Dhabi, UAE",
    category: "Structural Engineering",
    description: "Representative project description.",
    image: "/images/projects/project-one/cover.webp",
    featured: true,
  },
]
```

TypeScript will immediately catch missing or incorrectly structured content.

---

# 6. Organizing Projects Properly

Each project should use a predictable media folder.

```text
public/images/projects/
├── project-one/
│   ├── cover.webp
│   ├── hero.webp
│   ├── detail-01.webp
│   ├── detail-02.webp
│   └── drawing-01.webp
│
├── project-two/
│   ├── cover.webp
│   └── hero.webp
│
└── project-three/
    └── cover.webp
```

Content:

```ts
{
  slug: "project-one",
  title: "Project One",
  image: "/images/projects/project-one/cover.webp",
  gallery: [
    "/images/projects/project-one/detail-01.webp",
    "/images/projects/project-one/detail-02.webp",
  ]
}
```

To remove a project:

1. remove its object from `content/projects.ts`
2. optionally remove its image folder

No component changes should be necessary.

---

# 7. Homepage Sections Should Be Modular

The homepage should primarily compose existing sections.

Example:

```tsx
export default function HomePage() {
  return (
    <>
      <Hero />
      <AboutPreview />
      <CapabilitiesPreview />
      <SelectedProjects />
      <WhyUs />
      <ProcessSection />
      <SamplesPreview />
      <ContactCTA />
    </>
  )
}
```

This is intentional.

If later you want to remove `WhyUs`:

```tsx
<WhyUs />
```

is removed from one place.

No other homepage code needs to change.

---

# 8. Optional Section Configuration

If sections will often be enabled or disabled, use configuration.

```ts
// config/site.ts

export const homeSections = {
  about: true,
  capabilities: true,
  projects: true,
  clients: false,
  process: true,
  samples: true,
  contact: true,
}
```

Then:

```tsx
{homeSections.projects && <SelectedProjects />}
```

Use this only if section visibility genuinely changes frequently.

Otherwise, normal component composition is simpler.

---

# 9. Navigation Must Be Data-Driven

Use:

```ts
// content/navigation.ts

export const navigation = [
  { label: "About", href: "/about" },
  { label: "Capabilities", href: "/capabilities" },
  { label: "Projects", href: "/projects" },
  { label: "Samples", href: "/samples" },
  { label: "Insights", href: "/insights" },
  { label: "Contact", href: "/contact" },
]
```

Both desktop and mobile navigation should read from this same file.

Do not maintain two separate navigation lists.

---

# 10. Site-Wide Company Information

Store global company information in one file.

```ts
// content/site.ts

export const siteContent = {
  companyName: "[Company Name]",
  shortName: "[Short Name]",
  description:
    "Structural BIM, detailing and construction documentation partner.",
  email: "hello@example.com",
  phone: "+971 XX XXX XXXX",
  location: "United Arab Emirates",
  linkedin: "",
}
```

This avoids repeating contact information across:

- Header
- Footer
- Contact page
- SEO metadata
- CTA sections

---

# 11. Images

For V1, keep optimized assets inside `/public`.

Recommended:

```text
public/images/
├── hero/
├── about/
├── capabilities/
├── projects/
├── samples/
├── insights/
└── cta/
```

Use descriptive filenames.

Good:

```text
reinforcement-bim-model.webp
structural-coordination.webp
project-residential-tower.webp
```

Bad:

```text
IMG_4499.webp
final2.webp
abc.webp
```

---

# 12. AI-Generated Images

AI-generated images should be treated like normal production assets.

Recommended workflow:

```text
Generate source image
        ↓
Select final image
        ↓
Crop to correct aspect ratio
        ↓
Remove obvious AI artifacts
        ↓
Convert to WebP / AVIF
        ↓
Compress
        ↓
Place in /public/images/
```

Do not load large raw PNG generations directly on the website.

Recommended targets:

```text
Hero:
1920 × 1080 or larger source
optimized output normally < 400 KB where practical

Project previews:
1600 × 1000 source

Cards / thumbnails:
1200 × 800 source

Mobile:
use responsive Next.js image sizing
```

---

# 13. Image Metadata

For larger projects, image definitions may be stored in content.

Example:

```ts
hero: {
  src: "/images/projects/project-one/hero.webp",
  alt: "Structural concrete tower project",
}
```

Do not use:

```ts
alt: "image"
```

Alt text should describe the meaningful visual.

Decorative technical textures can use empty alt text.

---

# 14. Reusable Section Heading

Do not manually recreate labels and titles in every section.

Example API:

```tsx
<SectionHeading
  index="02"
  eyebrow="Capabilities"
  title="From Coordination to Construction"
/>
```

This preserves visual consistency while allowing sections to remain compositionally different.

---

# 15. UI Components vs Section Components

Keep these separate.

## `components/ui`

Small reusable primitives:

```text
Button
Container
SectionHeading
TechnicalLabel
AnimatedLine
ImageReveal
```

## `components/sections`

Large website-specific compositions:

```text
Hero
AboutPreview
SelectedProjects
ProcessSection
ContactCTA
```

Do not put full homepage sections inside `/ui`.

---

# 16. Avoid One Giant Components Folder

Bad:

```text
components/
├── Header.tsx
├── Footer.tsx
├── ProjectCard.tsx
├── ContactForm.tsx
├── Hero.tsx
├── ...
```

This becomes difficult to navigate.

Prefer categorized folders.

---

# 17. Contact Form Architecture

V1:

```text
ContactForm.tsx
      ↓
Google Apps Script endpoint
      ↓
Google Sheets
      +
Email notification
```

### Frontend

`components/forms/ContactForm.tsx`

Responsibilities:

- input fields
- client-side validation
- submission state
- success state
- error state
- accessibility

It should **not** contain company-wide form configuration.

### Form helper

Use:

```text
lib/forms.ts
```

for:

- request formatting
- endpoint interaction
- response normalization

---

# 18. Environment Variables

Never hard-code external endpoints.

Example:

```env
NEXT_PUBLIC_CONTACT_FORM_ENDPOINT=
```

Provide:

```text
.env.example
```

but never commit:

```text
.env.local
```

Example `.env.example`:

```env
NEXT_PUBLIC_CONTACT_FORM_ENDPOINT=https://script.google.com/macros/s/REPLACE_ME/exec
```

---

# 19. Google Apps Script Security Note

Do not expose:

- Gmail passwords
- API secrets
- private Google credentials
- service-account keys

The browser should only know the public Apps Script web-app endpoint.

Validate and sanitize submissions in the Apps Script as well.

Consider:

- honeypot field
- simple rate limiting
- CAPTCHA / Turnstile later if spam appears

---

# 20. SEO Structure

Each page should have unique metadata.

Example:

```tsx
export const metadata = {
  title: "Structural BIM Services | [Company]",
  description:
    "Structural BIM coordination, reinforcement detailing and shop drawings.",
}
```

Use:

```text
lib/seo.ts
```

for shared metadata helpers.

Also maintain:

```text
app/sitemap.ts
app/robots.ts
```

---

# 21. Project Slugs

Use stable clean slugs.

Good:

```text
/projects/al-maryah-tower
/projects/riyadh-mixed-use-development
```

Bad:

```text
/projects/project1
/projects/p-37-final
```

Do not change slugs casually after launch because they become public URLs.

---

# 22. Dynamic Project Pages

One page template should generate all projects.

```text
app/(marketing)/projects/[slug]/page.tsx
```

Do not create:

```text
projects/
├── project-one/page.tsx
├── project-two/page.tsx
├── project-three/page.tsx
```

The dynamic route reads from:

```text
content/projects.ts
```

This is critical for maintainability.

---

# 23. Insights / Blog

Use the same pattern.

```text
content/insights.ts
```

and:

```text
app/(marketing)/insights/[slug]/page.tsx
```

For a small site, TypeScript or Markdown content is enough.

Do not add a CMS simply because a blog exists.

Move to a CMS only when non-developers need to publish content frequently.

---

# 24. Samples

Keep sample metadata separate from project metadata.

Example:

```ts
export type Sample = {
  id: string
  title: string
  category: string
  preview: string
  file?: string
}
```

Then:

```text
public/documents/samples/
```

can contain downloadable PDFs.

---

# 25. Animation Architecture

Do not scatter animation numbers throughout components.

Use common values where appropriate.

```ts
// config/animations.ts

export const animation = {
  duration: {
    fast: 0.25,
    normal: 0.5,
    slow: 0.8,
  },
}
```

Not every animation must use global config, but common timing behavior should remain consistent.

---

# 26. Do Not Over-Abstract

A reusable component should exist because it is reused or represents a clear design primitive.

Do not create:

```text
UniversalSectionComponent
UniversalContentRenderer
UniversalEverythingCard
```

just to reduce file count.

Readable duplication is sometimes better than complicated abstraction.

---

# 27. Naming Conventions

## React components

```text
PascalCase.tsx
```

Examples:

```text
ProjectCard.tsx
SectionHeading.tsx
ContactForm.tsx
```

## Utilities / content

```text
camelCase.ts
```

Examples:

```text
projects.ts
site.ts
seo.ts
```

## URLs / slugs

```text
kebab-case
```

Examples:

```text
structural-engineering
reinforcement-detailing
```

## Images

```text
kebab-case.webp
```

Examples:

```text
hero-structural-tower.webp
rebar-detailing-model.webp
```

---

# 28. Import Alias

Use:

```text
@/
```

Example:

```ts
import { projects } from "@/content/projects"
import { ProjectGrid } from "@/components/projects/ProjectGrid"
```

Avoid:

```ts
../../../../content/projects
```

---

# 29. Page Files Should Stay Small

A page should mostly compose content and sections.

Good:

```tsx
export default function ProjectsPage() {
  return (
    <>
      <ProjectsHero />
      <ProjectGrid projects={projects} />
      <ContactCTA />
    </>
  )
}
```

Bad:

A `page.tsx` containing 800 lines of:

- content
- styles
- forms
- data
- animations
- metadata
- rendering logic

---

# 30. Component Responsibilities

Each component should have one clear responsibility.

Example:

```text
ProjectCard
```

renders a single project.

```text
ProjectGrid
```

controls layout for many projects.

```text
SelectedProjects
```

decides which projects appear on the homepage.

This keeps changes localized.

---

# 31. Featured Content

Use flags in the data.

```ts
featured: true
```

Then:

```ts
const featuredProjects = projects.filter(
  (project) => project.featured
)
```

Do not maintain a duplicate `featuredProjects` content list.

---

# 32. Ordering

If manual ordering is important:

```ts
order: 1
```

Then sort content using the field.

Otherwise array order can be treated as display order.

Choose one method and use it consistently.

---

# 33. Status / Draft Content

For content prepared but not yet published:

```ts
published: false
```

Filter it from production pages.

Example:

```ts
projects.filter((project) => project.published)
```

This is useful before a CMS exists.

---

# 34. Future Backend Migration

The V1 architecture should allow:

```text
content/projects.ts
```

to later become:

```text
Supabase projects table
```

without rewriting:

```text
ProjectCard
ProjectGrid
ProjectHero
ProjectMetadata
```

The frontend should receive the same `Project` shape regardless of the source.

Future:

```text
Supabase
   ↓
data access layer
   ↓
Project[]
   ↓
existing components
```

---

# 35. Optional Future Data Layer

When a backend is introduced, create:

```text
data/
├── projects.ts
├── capabilities.ts
└── insights.ts
```

Then components never communicate directly with Supabase.

Example:

```ts
getProjects()
getProjectBySlug()
getFeaturedProjects()
```

This makes changing database providers much easier.

Do not add this abstraction in V1 unless needed.

---

# 36. Styling Rules

Use Tailwind for most styling.

Global CSS should contain only things such as:

- CSS variables
- resets
- root typography
- selection styles
- global background
- shared custom utilities when genuinely needed

Do not place page-specific CSS in `globals.css`.

---

# 37. Design Tokens

Use CSS variables for brand-level values.

Example:

```css
:root {
  --background: #f4f2ed;
  --foreground: #171918;
  --muted: #777b7a;
  --concrete: #d9d5cc;
  --accent: #c86432;
}
```

This makes future rebranding easier.

---

# 38. No Hard-Coded Repeated Colors

Avoid:

```tsx
className="text-[#171918]"
```

throughout dozens of files.

Prefer semantic Tailwind tokens / CSS variables.

Example concept:

```text
bg-background
text-foreground
text-muted
text-accent
border-subtle
```

---

# 39. Icons

Use Lucide only when an icon improves understanding.

Do not create icon-heavy sections.

The public website should rely primarily on:

- typography
- imagery
- layout
- engineering graphics

---

# 40. Loading Strategy

For a mostly static company website:

- use Server Components by default
- use static generation wherever possible
- add `"use client"` only where interaction requires it

Likely client components:

```text
MobileNav
ContactForm
animated interactive sections
certain galleries
```

Do not mark the entire site `"use client"`.

---

# 41. Performance Rules

Use:

```text
next/image
next/font
```

Avoid:

- huge PNG files
- full-resolution source images
- autoplay 4K videos
- unnecessary animation libraries
- large JavaScript dependencies
- client-side rendering for static content

---

# 42. Accessibility Rules

Every interactive component must support:

- keyboard operation
- visible focus state
- semantic HTML
- proper labels
- sufficient contrast
- reduced-motion preferences

Use:

```css
@media (prefers-reduced-motion: reduce)
```

where relevant.

---

# 43. Repository Documentation

Keep these documents:

```text
docs/
├── FRONTEND_DESIGN_GUIDE.md
├── CONTENT_GUIDE.md
└── REPO_STRUCTURE.md
```

### `FRONTEND_DESIGN_GUIDE.md`

Defines:

- visual identity
- typography
- colors
- grid
- anti-slop rules
- motion principles

### `CONTENT_GUIDE.md`

Defines:

- page content
- sections
- copy requirements
- image requirements
- AI image guidance

### `REPO_STRUCTURE.md`

Defines:

- architecture
- directories
- component ownership
- code organization
- content organization

Developers and AI coding agents should read these before major implementation work.

---

# 44. README Structure

The project `README.md` should contain:

```text
Project summary
Tech stack
Local development
Environment variables
Repository architecture
Content editing
Adding a project
Adding an insight
Contact-form configuration
Deployment
Design/documentation links
```

Do not use the README as the full design specification.

Keep detailed rules inside `/docs`.

---

# 45. How to Add a Project

Normal workflow:

```text
1. Add optimized images
   public/images/projects/new-project/

2. Add one Project object
   content/projects.ts

3. Set:
   slug
   title
   location
   description
   image
   gallery
   featured
   published

4. Commit
```

The project should automatically appear:

- on `/projects`
- on its `/projects/[slug]` page
- on the homepage if `featured: true`

No new React page should need to be manually created.

---

# 46. How to Remove a Project

```text
1. Remove the project from content/projects.ts
2. Remove its media folder if no longer required
3. Check no external links point to the old URL
```

No component code should need to change.

---

# 47. How to Add a Capability

```text
1. Add capability object to content/capabilities.ts
2. Add its image to public/images/capabilities/
3. The capability list should render it automatically
```

Do not create a separate component for every service unless each service genuinely has a unique layout.

---

# 48. How to Add a Homepage Section

```text
1. Create section:
   components/sections/NewSection.tsx

2. Add content:
   content/homepage.ts
   OR a dedicated content file

3. Insert component into:
   app/(marketing)/page.tsx
```

That is all.

---

# 49. How to Remove a Homepage Section

Remove its component call from:

```text
app/(marketing)/page.tsx
```

Optionally remove:

- section component
- content data
- unused assets

No site-wide redesign should be required.

---

# 50. Git Structure

Recommended initial branches:

```text
main
```

For feature work:

```text
feature/homepage
feature/projects
feature/contact-form
feature/mobile-navigation
```

For a small project, do not create complicated branch hierarchies.

Keep commits focused.

Examples:

```text
feat: add project detail route
feat: add contact enquiry form
design: refine homepage hero
content: add structural coordination service
fix: correct mobile navigation spacing
```

---

# 51. Vercel Deployment

Recommended:

```text
GitHub repository
      ↓
Vercel project
      ↓
Production deployment
```

Use Vercel preview deployments for branches / pull requests.

Production should deploy from:

```text
main
```

---

# 52. Environment Setup

Example:

```bash
npm install
npm run dev
```

Production check:

```bash
npm run lint
npm run build
```

Do not deploy code that fails the production build.

---

# 53. Recommended V1 Dependency Philosophy

Keep dependencies intentionally small.

Core:

```text
next
react
react-dom
typescript
tailwindcss
motion
lucide-react
```

Add another package only when it provides clear value.

Avoid installing libraries simply because an AI agent suggests them.

---

# 54. What Not to Add in V1

Do not add unless there is a real requirement:

```text
Supabase
Prisma
Neon
MongoDB
NextAuth / Auth.js
Redux
Zustand
Express
NestJS
CMS
GraphQL
WebSockets
Redis
```

The public website does not currently need them.

---

# 55. Future Upgrade Path

## V1

```text
Next.js
Vercel
static content
public images
Google Apps Script form
Google Sheets
```

## V2

Possible:

```text
Supabase
├── database
├── storage
└── auth
```

Add only when staff need:

- admin login
- project management
- blog publishing
- media uploads
- enquiry management

## V3

Possible:

```text
CMS / admin portal
analytics
CRM integration
automated proposal workflow
```

The V1 component structure should survive these upgrades.

---

# 56. Final Repository Rule

Before adding a new file, ask:

> Is this content, presentation, configuration, utility logic, or a type?

Then place it accordingly.

```text
content       → words/data
components    → visual presentation
config        → app behavior/settings
lib           → reusable logic
types         → data contracts
public        → static assets
app           → routes/pages/layouts
docs          → project rules/specification
```

Do not mix these responsibilities.

---

# 57. AI / Codex Repository Instruction

Give this instruction to an AI coding agent before major work:

```text
Read docs/FRONTEND_DESIGN_GUIDE.md,
docs/CONTENT_GUIDE.md, and docs/REPO_STRUCTURE.md
before implementing or restructuring the website.

Maintain strict separation between content, components,
configuration, utilities, routes, and assets.

Do not hard-code project/service/company content inside
presentational React components.

Use reusable typed content models.

Project and insight detail pages must use dynamic routes.

The website must remain easy to extend, reorder, or simplify
without rewriting unrelated components.

Prefer Server Components by default.

Only introduce client components where interactivity requires them.

Do not introduce a database, CMS, authentication system,
state-management framework, or backend dependency unless
the project requirements explicitly require one.

Keep the public-facing design custom and editorial.
Do not convert the site into a generic component-library
or SaaS-style interface.

Before finishing a feature:
- confirm responsive behavior
- confirm accessibility
- run lint
- run production build
- check for unused code and assets
```

---

# 58. Definition of a Well-Structured Repository

The repository is successful if:

- a new project can be added by editing one data file
- a project can be removed without touching UI components
- navigation changes happen in one location
- global company information exists in one location
- page files remain small
- components have clear responsibilities
- assets have predictable locations
- content is strongly typed
- backend services can be introduced later without redesigning the frontend
- another developer can understand the repository without reverse-engineering it
- Codex can modify one feature without accidentally changing unrelated sections

That is the standard this repository should maintain.
