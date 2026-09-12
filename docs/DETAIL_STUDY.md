# Engineering detail and project dossier

The homepage now pairs its structural photograph with a closer crop of the same image, precise service copy and a link to The Frame study. The existing Contact action, headline and scroll reveal remain. The companion image is requested at enough resolution for its enlarged crop.

## Interactive drawing

`DetailExplorer` is a server-rendered fieldset with native radio controls. CSS selects the emphasis in `DetailDrawing` and the corresponding explanation. It is used on the homepage, The Frame project page and Samples. Arrow keys, Space and touch selection work without JavaScript. Each selected control describes its explanation, and focus remains visible on the whole label.

The interface, indicative reinforcement and section-reference layers share one SVG. Selection changes color and opacity over 220 ms. Explanations share a grid cell sized by the longest explanation, keeping the controls and content below stationary when selection changes. Reduced motion removes the transition. Browsers without CSS `:has()` retain all explanations in normal flow.

The detail is a communication illustration, not a structural or reinforcement design. It includes no design dimensions, quantities or approval claims. Essential explanations are in readable HTML; small labels within the schematic are supplementary.

## Project and service connections

The Frame opts into its dossier through the typed `study` content field. Its page retains the concept-project introduction and adds scope/status, a plan location, the interactive section, a package index and an explicit review of the study's limits. Other project pages retain their existing composition.

The new plan is an original SVG under `public/graphics/studies/`. Its A–A marker passes through the support at the slab edge, and the section and index carry the same FW–01 reference. The plan is a schematic supporting the narrative, not a traced or certified survey of the concept photograph.

Capability rows use native `details` disclosures to show existing sample drawings and contextual explanations. Supported browsers keep one example open through their shared `name`; browsers without exclusive-details support can keep multiple examples open. The previews remain usable without JavaScript. Samples retains its existing filtering, dialog controls and PDFs, with an additional drawing-reading section beneath the gallery.

All new narrative content and asset mappings live in `content/detail-study.ts`; hero content remains in `content/engineering-story.ts` and `content/pages.ts`. There are no new dependencies, client components, backend routes or submission behavior. The building renderer, model, rewind sequence, matching still and six paused steps are unchanged.

## Review and regression coverage

Visual captures are in the ignored `artifacts/detail-review/` directory. Hero, companion detail, drawing layout, dossier, plan and package views were captured at 375, 430, 768, 1024, 1440 and 1920 px. Representative views across those sizes were visually inspected, with final checks of the sharper companion crop, corrected plan marker and drawing-reference state. Rapid scrolling in both directions preserved the selected drawing state.

`tests/detail-study.spec.ts` covers native keyboard selection, visible selected explanations, stable layout, reduced motion, accessibility, route/anchor navigation, exclusive service previews and JavaScript-free operation. The existing browser suite covers all responsive routes, sample dialogs, forms, graphics failure and the building sequence.

The longer homepage exposed fractional scroll rounding in the building test setup: the initial stage could sit at 72.265625 px rather than its pinned 72 px position. `approachStory` now rounds its scroll destination upward to reach the sticky boundary before comparison. The strict mean pixel-difference threshold remains unchanged; the renderer and pause implementation were not modified.

Coverage uses Chromium on Windows, with phone viewport emulation. Physical phones and Safari have not been tested. Browser accessibility scans and keyboard checks do not constitute a complete accessibility certification. No production field-performance measurements are claimed.

Verified on 12 September 2026: lint, TypeScript, production build and the full 33-test browser suite passed. The final browser run completed in 2.1 minutes, including both strict paused-image comparisons. No pixel-comparison tolerance was relaxed.
