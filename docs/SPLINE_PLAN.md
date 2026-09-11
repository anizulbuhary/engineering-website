# Spline 3D Experience Plan

## Project Context

This document defines the plan for a premium interactive 3D building experience for a construction / engineering company website.

The goal is **not** to add decorative 3D.

The goal is to create one signature homepage interaction that communicates:

> **From design intent to coordinated, construction-ready engineering delivery.**

The experience should feel:

- premium
- technical
- architectural
- controlled
- high-end
- engineering-led
- visually memorable

The 3D section should support the website's brand rather than dominate the entire site.

---

# 1. Recommended Role of Spline

Use Spline for:

- one major interactive homepage scene
- one optional lightweight interactive object on a project page
- controlled camera motion
- object visibility changes
- model state transitions
- hover / pointer interactions
- scroll-linked storytelling

Do not use Spline for:

- every section of the website
- generic floating 3D shapes
- random abstract objects
- entire-page navigation
- decorative spinning objects
- large, photorealistic scenes that hurt performance

---

# 2. Signature Concept

## Concept Name

**From Model to Execution**

The 3D building evolves as the visitor scrolls.

The experience should show the transformation from:

```text
Concept
↓
Structure
↓
Reinforcement
↓
Coordination
↓
Construction Documentation
↓
Final Delivery
```

This mirrors how an engineering / BIM detailing company works.

---

# 3. Main Visual Story

The section should occupy roughly:

```text
150–300vh
```

depending on final motion timing.

The page scroll drives multiple states of one 3D scene.

---

## State 01 — Initial Building Form

Show:

- simplified architectural massing
- neutral grey / concrete materials
- clean background
- no excessive detail

Text:

```text
FROM MODEL
TO EXECUTION
```

Supporting copy:

```text
Transforming design information into coordinated,
construction-ready structural deliverables.
```

Camera:

- three-quarter perspective
- slightly elevated
- calm and static initially

---

## State 02 — Structural Frame Reveal

As the user scrolls:

- facade / shell fades or slides away
- columns become visible
- slabs become visible
- core becomes visible
- main structural system becomes the focus

Text:

```text
01
STRUCTURAL COORDINATION
```

Supporting line:

```text
Resolve geometry, interfaces and constructability
before issues reach the site.
```

Optional technical labels:

```text
GRID B4
LEVEL 08
CORE
SLAB
COLUMN
```

---

## State 03 — Reinforcement Detailing

Next scroll stage:

- selected slab / column / wall reinforcement appears
- key rebar systems become visible
- unnecessary layers dim
- camera moves closer to one structural area

Text:

```text
02
REINFORCEMENT DETAILING
```

Supporting line:

```text
Model reinforcement with the clarity required for
shop drawings, scheduling and site execution.
```

Interaction:

- subtle hover highlight on selected reinforcement zones
- do not make every bar interactive

---

## State 04 — Coordination / BIM Layer

Next scroll stage:

- structural model remains
- additional coordination layer appears
- selected interfaces / penetration zones / zones of interest highlight
- technical annotation lines appear

Text:

```text
03
BIM COORDINATION
```

Supporting line:

```text
Coordinate critical interfaces and identify conflicts
before they become costly rework.
```

Optional visual devices:

- transparent secondary systems
- warning / coordination markers
- small technical callouts
- section box effect

---

## State 05 — Shop Drawing / Documentation Transition

Transition from 3D model toward drawing-oriented output.

Possible sequence:

```text
3D model
↓
orthographic view
↓
line overlay
↓
technical drawing composition
```

Text:

```text
04
SHOP DRAWINGS & BBS
```

Supporting line:

```text
Convert coordinated models into clear,
execution-ready documentation.
```

This is one of the strongest brand moments.

---

## State 06 — Final Delivery

Return to complete building or coordinated structural model.

Text:

```text
05
READY FOR CONSTRUCTION
```

Supporting line:

```text
Quality-controlled deliverables prepared
for submission, fabrication and site use.
```

CTA:

```text
VIEW OUR CAPABILITIES →
```

or:

```text
EXPLORE PROJECTS →
```

---

# 4. Recommended Scene Composition

The Spline scene should be organized into logical object groups.

Example:

```text
Scene
├── Building
│   ├── ArchitecturalShell
│   ├── StructuralCore
│   ├── Columns
│   ├── Beams
│   ├── Slabs
│   ├── Foundations
│   └── Roof
│
├── Reinforcement
│   ├── SlabRebar
│   ├── ColumnRebar
│   ├── WallRebar
│   └── BeamRebar
│
├── Coordination
│   ├── MEPPlaceholder
│   ├── Openings
│   └── ClashMarkers
│
├── Technical
│   ├── GridLines
│   ├── SectionMarks
│   ├── LevelLabels
│   └── Dimensions
│
├── Lighting
│   ├── Key
│   ├── Fill
│   └── Rim
│
└── CameraStates
```

Do not leave hundreds of unnamed objects such as:

```text
Cube
Cube.001
Cube.002
Object_47
Mesh_092
```

The scene must stay maintainable.

---

# 5. Model Strategy

## Best V1 approach

Use a **stylized simplified building model**, not a huge real BIM file.

Reasons:

- faster loading
- easier to animate
- easier to art-direct
- easier to control
- cleaner mobile experience
- lower GPU requirements

The model should visually suggest:

- reinforced concrete
- structural engineering
- BIM coordination
- construction detail

It does not need to represent a real client project.

---

# 6. Building Type Recommendation

Use one of these:

### Preferred
**Modern reinforced concrete mixed-use tower**

Why:

- instantly reads as construction / structural engineering
- allows slab / column / core reveals
- visually works in exploded states
- feels premium
- suits GCC / MENA construction context

### Alternatives

- medium-rise commercial structure
- large podium + tower system
- hospital / institutional building
- complex concrete frame
- structural atrium / long-span frame

Avoid:

- futuristic impossible architecture
- sci-fi skyscrapers
- overly organic forms
- ultra-luxury villas
- generic glass office cube

---

# 7. Visual Style

## Materials

Use restrained materials:

```text
Concrete
Warm grey
Steel grey
Charcoal
Off-white
Accent copper / burnt orange
```

Do not use:

- neon
- glossy chrome
- glowing purple
- rainbow materials
- holographic surfaces

---

## Suggested palette

```text
Graphite      #171918
Off White     #F4F2ED
Concrete      #D9D5CC
Steel Grey    #777B7A
Accent        #C86432
```

The accent should only highlight:

- active system
- current section
- key technical object
- selected annotation

---

# 8. Lighting

Lighting should feel like architectural visualization.

Recommended:

- soft key light
- subtle ambient fill
- restrained rim light
- controlled shadows
- no dramatic nightclub lighting

The building must remain readable on both:

- light page backgrounds
- dark page backgrounds

Recommended section background:

```text
#F4F2ED
```

or:

```text
#171918
```

Do not mix multiple strong background colors inside the same 3D scene.

---

# 9. Camera Direction

Camera motion should be slow and deliberate.

Use:

- small orbit shifts
- subtle dolly movement
- controlled zoom
- occasional orthographic-like framing

Avoid:

- fast spins
- dramatic fly-throughs
- constant movement
- camera shake
- cinematic transitions that make navigation difficult

The visitor should always understand what they are looking at.

---

# 10. Scroll Choreography

Recommended page architecture:

```text
<section class="relative">
  <div class="sticky top-0 h-screen">
    [Spline Scene]
  </div>

  [Scrollable narrative content]
</section>
```

The Spline scene remains sticky while text sections progress.

Conceptual timeline:

```text
0–15%
Initial building

15–30%
Reveal structure

30–50%
Reveal reinforcement

50–68%
Coordination layer

68–85%
Drawing transition

85–100%
Final building + CTA
```

These percentages are starting points only.

Refine them after visual testing.

---

# 11. Interaction Model

Primary interaction:

```text
SCROLL
```

Secondary interaction:

```text
POINTER / HOVER
```

Optional:

```text
DRAG TO ROTATE
```

But do not make drag mandatory.

The website must still communicate the story if the visitor never touches the model.

---

# 12. Recommended Hover Behaviors

Only use hover for meaningful elements.

Examples:

### Structural Frame

Hover:

```text
COLUMN
```

could:

- slightly brighten
- show a small label
- expose related reinforcement

### Core

Hover:

- highlight core
- show `STRUCTURAL CORE`

### Slab

Hover:

- highlight one slab
- show `LEVEL 08 / SLAB`

Do not add hotspots to every object.

---

# 13. Technical Overlay Layer

Technical labels should feel authentic.

Examples:

```text
GRID B4
LEVEL +24.750
SECTION 04
CORE C1
SLAB S08
1:100
```

They can appear using:

- HTML overlays
- Spline text
- SVG overlays

Preferred approach:

Use HTML/CSS for most text labels because:

- sharper typography
- better accessibility
- easier responsiveness
- easier translation
- easier editing

Spline should primarily handle the 3D visual.

---

# 14. HTML + Spline Composition

Recommended architecture:

```text
Next.js Section
├── HTML Narrative
│   ├── Section number
│   ├── Heading
│   ├── Description
│   └── CTA
│
└── Spline Canvas
    └── Interactive building
```

Do not put all typography inside Spline.

Keep important text in the DOM.

---

# 15. Component Structure

Recommended files:

```text
components/
└── 3d/
    ├── EngineeringScene.tsx
    ├── EngineeringStory.tsx
    ├── EngineeringStage.tsx
    ├── SceneFallback.tsx
    └── SceneLoader.tsx
```

Optional:

```text
config/
└── engineering-scene.ts
```

---

# 16. Content Configuration

Keep stage content out of the component.

Example:

```ts
export const engineeringStages = [
  {
    id: "coordination",
    index: "01",
    title: "Structural Coordination",
    description:
      "Resolve geometry, interfaces and constructability before issues reach the site.",
  },
  {
    id: "reinforcement",
    index: "02",
    title: "Reinforcement Detailing",
    description:
      "Model reinforcement with the clarity required for execution.",
  },
]
```

This makes copy easy to change without editing animation logic.

---

# 17. Spline Scene State Naming

Use explicit state names.

Example:

```text
STATE_DEFAULT
STATE_STRUCTURE
STATE_REBAR
STATE_COORDINATION
STATE_DRAWING
STATE_FINAL
```

Do not use:

```text
State 1
State 2
New State
Copy 4
```

The scene must be understandable to another developer.

---

# 18. Performance Budget

The 3D scene must not destroy the site.

Recommended targets:

```text
Initial 3D payload:
as small as reasonably possible

Model:
prefer low-to-medium polygon count

Textures:
1024px–2048px where needed

Avoid:
4K textures unless absolutely necessary
```

Use:

- compressed textures
- simplified geometry
- instancing where possible
- low material count
- minimal lighting complexity

---

# 19. Load Strategy

The homepage should not feel broken while Spline loads.

Recommended:

```text
Initial page
↓
Hero loads immediately
↓
3D scene lazy-loads before user reaches section
```

Use:

- dynamic import
- lazy loading
- loading poster / image
- skeleton or still model preview

Do not block the entire homepage on Spline.

---

# 20. Fallback Strategy

Every 3D scene needs a static fallback.

Use:

```text
/public/images/3d/
├── engineering-scene-poster.webp
└── engineering-scene-mobile.webp
```

Fallback applies when:

- WebGL fails
- low-power device
- scene load fails
- JavaScript disabled
- reduced-data mode
- mobile performance is poor

The section must still make sense.

---

# 21. Mobile Strategy

Do not force the desktop interaction onto mobile unchanged.

Recommended mobile behavior:

### Option A — Preferred

Use a simplified Spline scene:

- fewer objects
- fewer layers
- fewer transitions
- fixed camera
- no hover
- scroll-driven state changes only

### Option B

Use a high-quality static image / short optimized loop if mobile performance is insufficient.

The mobile page should remain premium even without full 3D.

---

# 22. Reduced Motion

Respect:

```text
prefers-reduced-motion
```

If enabled:

- disable automatic rotations
- disable large camera transitions
- keep object state changes subtle
- preserve content clarity

Do not completely hide important information.

---

# 23. Accessibility

Spline is visual enhancement.

Critical website content must remain available in normal HTML.

Do not rely on users selecting a 3D object to learn:

- service names
- company capabilities
- contact information
- core process information

Important narrative remains accessible outside the 3D canvas.

---

# 24. Section Location

Recommended homepage order:

```text
Hero
↓
Short Company Positioning
↓
3D "From Model to Execution" Experience
↓
Capabilities
↓
Selected Projects
↓
Why Us
↓
Process
↓
Samples
↓
Contact CTA
```

The 3D section appears early enough to establish technical credibility.

Do not place it as the first thing before visitors understand the company.

---

# 25. Hero vs 3D Section

Do not make the hero and engineering scene fight for attention.

Recommended:

### Hero
Use:

- exceptional architectural image
- strong typography
- short CTA

### Next signature section
Use:

- interactive 3D building

This gives the visitor two different visual moments.

---

# 26. Optional Advanced Concept

## Blueprint → Building

This can become the signature transition.

Sequence:

```text
Technical line drawing
↓
wireframe structure
↓
solid structural model
↓
reinforcement
↓
complete building
```

If Spline alone is insufficient for the line-drawing transition, combine:

```text
HTML/SVG overlays
+
Spline
+
Motion / GSAP
```

Do not overcomplicate V1.

---

# 27. Optional Exploded Structure

A second strong state can separate:

```text
Roof
↑
Upper slabs
↑
Core
↑
Podium
↑
Foundation
```

Use only slight spacing.

It should look like an engineering exploded diagram, not a toy animation.

---

# 28. Optional Section Cut Effect

A powerful BIM-style interaction:

```text
Full building
↓
vertical cut plane moves through model
↓
interior structure becomes visible
```

Useful for:

- showing slab systems
- showing cores
- showing reinforcement
- demonstrating technical depth

If technically expensive, keep it for V2.

---

# 29. Optional Service Interaction

The user can switch between:

```text
STRUCTURE
REINFORCEMENT
COORDINATION
DOCUMENTATION
```

This may appear below or beside the model.

Click behavior:

```text
selected tab
↓
Spline state changes
↓
camera / visibility changes
```

This is useful on desktop.

On mobile, use scroll stages rather than tabs.

---

# 30. Spline Asset Preparation

Recommended model pipeline:

```text
Blender / source model
↓
clean geometry
↓
remove unnecessary objects
↓
simplify
↓
optimize materials
↓
export GLB
↓
import to Spline
↓
organize groups
↓
create states / interactions
```

Do not import a giant architectural model directly and hope it performs well.

---

# 31. Possible Model Sources

Use:

- custom Blender model
- licensed generic architectural model
- internally created conceptual model
- de-identified company BIM-derived model
- AI-assisted 3D concept converted and cleaned manually

Avoid:

- copyrighted project models without permission
- recognizable client projects without approval
- unlicensed marketplace assets
- real confidential BIM models

---

# 32. AI-Generated Supporting Assets

The Spline scene may need supporting visuals.

Generate:

### Poster image
A premium still render of the building in its initial state.

### Mobile fallback
Simpler crop with strong composition.

### Background technical texture
Subtle structural grid / drawing lines.

### Documentation overlay
Shop drawing-inspired composition.

### Project transition visual
Optional static image to bridge 3D into the Projects section.

---

# 33. Suggested AI Image Prompt for Poster

```text
Create a premium architectural visualization for a structural engineering and BIM company website. Show a modern reinforced-concrete mixed-use tower in a clean three-quarter perspective, with visible structural logic, restrained warm-grey and graphite materials, realistic soft architectural lighting, minimal background, editorial presentation, high-end engineering aesthetic, no futuristic sci-fi styling, no people, no logos, no text.
```

---

# 34. Web Integration Stack

Recommended:

```text
Next.js
TypeScript
Tailwind CSS
Motion
Spline
```

Optional:

```text
GSAP
```

Use GSAP only if scroll synchronization requires more precise control than Motion provides.

Do not install GSAP merely because it is popular.

---

# 35. Recommended Next.js File Structure

```text
components/
├── 3d/
│   ├── EngineeringScene.tsx
│   ├── EngineeringStory.tsx
│   ├── EngineeringStage.tsx
│   ├── SceneLoader.tsx
│   └── SceneFallback.tsx
│
content/
└── engineering-story.ts

config/
└── engineering-scene.ts

public/
└── images/
    └── 3d/
        ├── engineering-scene-poster.webp
        └── engineering-scene-mobile.webp
```

---

# 36. Component Responsibilities

## `EngineeringScene.tsx`

Responsible for:

- Spline embed
- scene loading
- communicating state changes
- canvas-level interaction

Do not put marketing copy here.

---

## `EngineeringStory.tsx`

Responsible for:

- overall scroll section
- active stage
- sticky layout
- connection between scroll and scene state

---

## `EngineeringStage.tsx`

Responsible for:

- one narrative stage
- section number
- heading
- description

---

## `SceneLoader.tsx`

Responsible for:

- loading state
- progress / poster
- transition into interactive scene

---

## `SceneFallback.tsx`

Responsible for:

- static fallback
- error state
- unsupported device state

---

# 37. Scroll State Logic

Concept:

```text
stage 0
→ initial model

stage 1
→ structural frame

stage 2
→ reinforcement

stage 3
→ coordination

stage 4
→ documentation

stage 5
→ final delivery
```

Scene transitions should be deterministic.

Do not base important transitions on random hover behavior.

---

# 38. Avoid Scroll-Jacking

The site should use normal browser scrolling.

Do not:

- lock the wheel
- force snap scrolling everywhere
- hijack scroll velocity
- trap users inside the 3D section

The section can be sticky without making scrolling unnatural.

---

# 39. Text Placement

Desktop concept:

```text
┌───────────────────────────────────────────────┐
│                                               │
│  02                                           │
│  REINFORCEMENT           [ 3D MODEL ]         │
│  DETAILING                                     │
│                                               │
│  Short supporting copy                        │
│                                               │
└───────────────────────────────────────────────┘
```

Alternative:

```text
[ large 3D model ]

             03 / BIM COORDINATION
             Short supporting copy
```

Avoid centered text over the most important model details.

---

# 40. Desktop Art Direction

Recommended:

- 55–70% of section width for 3D
- 30–45% for narrative content
- large whitespace
- very few UI controls
- technical index numbers
- thin structural dividers

---

# 41. Mobile Art Direction

Recommended:

```text
[ 3D / static visual ]

02
REINFORCEMENT DETAILING

Short copy
```

Avoid:

- tiny side-by-side columns
- microscopic labels
- hover-only controls

---

# 42. Scene Controls

Preferred controls:

```text
Drag to explore
```

Optional:

```text
Reset View
```

Avoid large viewer toolbars.

The section should feel part of the brand website, not like embedded CAD software.

---

# 43. Cursor Interaction

If useful:

- cursor changes subtly over draggable area
- drag hint appears once
- no custom animated cursor required

Do not add a large follower cursor just to look fashionable.

---

# 44. Sound

Do not use sound.

Engineering interaction should feel premium through:

- motion
- lighting
- hierarchy
- visual precision

Autoplay audio would harm the experience.

---

# 45. Content Tone

Keep text concise.

Good:

```text
STRUCTURAL
COORDINATION

Resolve critical interfaces
before construction begins.
```

Bad:

```text
Our industry-leading innovative BIM coordination solutions
help our valued clients achieve exceptional outcomes...
```

---

# 46. Loading Copy

If needed:

```text
LOADING MODEL
```

or:

```text
PREPARING STRUCTURAL MODEL
```

Keep it minimal.

Do not use game-like loading screens.

---

# 47. Performance Acceptance Criteria

Before release:

- homepage content renders without waiting for Spline
- interaction is smooth on modern desktop hardware
- mobile does not overheat or stutter excessively
- fallback appears reliably
- scene does not cause layout shift
- page remains usable if Spline fails
- no huge blank canvas while loading
- images below are lazy-loaded correctly

---

# 48. Visual Acceptance Criteria

The section should feel:

- like an architecture / engineering studio
- not like a gaming website
- not like a crypto site
- not like a SaaS template
- not like a generic Spline showcase

The model should communicate engineering logic.

---

# 49. V1 Scope

Build only:

```text
1 building
5–6 narrative states
1 sticky scroll section
1 fallback image
desktop interaction
simplified mobile behavior
```

Do not build:

- multi-model selector
- model upload system
- full BIM viewer
- measurements
- user accounts
- database integration
- project-specific 3D CMS

Those belong to later versions if needed.

---

# 50. V2 Possibilities

Later:

- real Speckle project viewer
- real BIM model case studies
- floor selection
- structural system filters
- project-specific model states
- before / after coordination comparisons
- technical hotspot annotations

Spline remains the marketing experience.

Speckle can become the technical viewer.

---

# 51. Recommended Hybrid Strategy

## Homepage

```text
Spline
```

Purpose:

- premium storytelling
- visual identity
- memorable interaction

## Project / Technical Page

Future:

```text
Speckle
```

Purpose:

- real BIM data
- authentic engineering model inspection

This separation is recommended.

---

# 52. Build Sequence

## Phase 1 — Scene Concept

Define:

- building type
- camera angle
- model states
- art direction
- color palette

---

## Phase 2 — Model Creation

Create / acquire:

- simplified building
- structural layers
- rebar layer
- coordination elements

---

## Phase 3 — Spline Build

Create:

- scene hierarchy
- materials
- lighting
- states
- interactions
- camera changes

---

## Phase 4 — Website Integration

Implement:

- sticky layout
- scroll stages
- stage copy
- lazy loading
- fallback

---

## Phase 5 — Optimization

Reduce:

- geometry
- textures
- scene complexity
- unnecessary objects

---

## Phase 6 — QA

Test:

```text
375px
430px
768px
1024px
1440px
1920px
```

Also test:

- reduced motion
- slow connection
- low-power laptop
- touch input
- keyboard navigation

---

# 53. Codex Implementation Instruction

Use this instruction when asking Codex to implement the Spline section:

```text
Implement a premium interactive engineering storytelling section
using Next.js, TypeScript, Tailwind CSS, Motion, and Spline.

Read:
docs/FRONTEND_DESIGN_GUIDE.md
docs/CONTENT_GUIDE.md
docs/REPO_STRUCTURE.md
docs/SPLINE_PLAN.md

before implementation.

The Spline experience is a visual enhancement, not a replacement
for semantic HTML content.

Create a sticky scroll-driven section titled "From Model to Execution".

Use the following stages:

1. Initial building
2. Structural coordination
3. Reinforcement detailing
4. BIM coordination
5. Shop drawings / documentation
6. Final construction-ready state

Keep stage copy outside the Spline scene in normal accessible HTML.

Structure the implementation into:
components/3d/EngineeringScene.tsx
components/3d/EngineeringStory.tsx
components/3d/EngineeringStage.tsx
components/3d/SceneLoader.tsx
components/3d/SceneFallback.tsx

Store narrative content separately in:
content/engineering-story.ts

Do not place long marketing copy or content directly inside
the Spline component.

Use normal page scrolling.
Do not implement scroll-jacking.

Lazy-load the Spline scene.
The homepage must render immediately without waiting for 3D.

Provide:
- poster fallback
- mobile fallback
- loading state
- graceful error state
- reduced-motion behavior

Keep the model visually restrained:
graphite, warm concrete, off-white, steel grey and restrained
burnt-orange accent.

Avoid:
- neon lighting
- sci-fi effects
- floating decorative objects
- fast rotation
- game-like controls
- excessive hotspots
- generic Spline-template aesthetics

The final interaction should feel like premium engineering
storytelling rather than a 3D demo.

Test desktop, tablet and mobile.
Verify the production build.
Optimize scene loading and animation before completion.
```

---

# 54. Final Art Direction

The target feeling is:

> **A visitor is watching an engineered structure reveal how the company works.**

Not:

> **A visitor is looking at a cool 3D object.**

The 3D experience succeeds only when the visual behavior reinforces:

- structure
- coordination
- detailing
- documentation
- execution

The building is therefore not decoration.

It is the visual explanation of the company.
