# Courtyard House engineering experience

The signature section is a custom Blender model rendered through Three.js. It uses ordinary scrolling and retains six reversible chapters: architectural form, structure, reinforcement, coordinated services, documentation and the assembled building.

## Design and source files

The selected courtyard concept replaces the former terraced pavilion. Its defining elements are a six-storey left wing, five-storey rear wing, four-storey right wing and a two-storey entrance hall beneath an elevated garden. The refined exterior uses continuous pale limestone floor edges, slim dark anodised bronze mullions, larger smoked-glass panels and glass terrace guards. Planted terraces, olive trees, restrained furniture and an enclosed roof core retain the original courtyard identity. The entrance has grounded steps and an adjoining side ramp.

- `assets/blender/courtyard-reference.png`: the selected generated design reference, not a website render.
- `assets/blender/formwork-courtyard.blend`: editable source, including inspection lights and camera.
- `content/engineering-model.json`: shared wing dimensions, floor height, model name and asset configuration.
- `scripts/create-engineering-model.py`: deterministic geometry, materials, packed limestone grain and GLB export.
- `public/models/formwork-courtyard.glb`: approximately 1.44 MB, with embedded texture and Meshopt compression.
- `public/models/courtyard-finished-studio.webp`: approximately 220 KB, transparent lossless capture of the actual live opening.
- `lib/engineering-scene.ts`: lazy renderer, camera timeline, system fades, shadow updates and resource disposal.
- `lib/engineering-timeline.ts`: deterministic camera and assembly interpolation with gentler opening and completion.
- `components/engineering/StructureDrawing.tsx`: static SVG studies using the same wing dimensions as Blender.

The former pavilion model, Blender file and poster are removed; their previous versions remain in Git history. No package dependency, backend or public API was added. Meshopt decoding uses the small decoder already shipped with Three.js, loaded with the deferred scene module.

## Model and animation contracts

All meshes retain `system` and `level` metadata. Floor plates, supports and core sections belong to `structure`; the architectural skin, glazing, roof finishes, planters and vegetation belong to `facade` at their supporting level. Reinforcement and services occupy their corresponding wing floors. The entrance's tall piers span two storeys; no intermediate slab crosses the double-height entrance. The central courtyard has no floor plates above level 2.

The generator checks 98 columns against their supporting plates at both ends. It checks geometry against the ground datum and exports 20 structural plates. These checks supplement visual review; this is an architectural communication illustration, not construction documentation or a certified structural design.

The camera retains the previous angular sequence and damping. Its vertical target is adjusted to the shorter courtyard massing. Deliberate floor separation remains inside explanatory chapters; the opening, final state and paused view are fully assembled. Glazing retains its source transparency as the facade fades. Vegetation and planters fade and travel together rather than remaining suspended above the stripped structure.

The fixed warm key light, subdued fill and studio reflection environment are independent of the theme. Alpha-hashed shadow depth uses material opacity and a cubic fade so ghosted floors and glazing do not leave opaque shadows behind. Shadow maps update for geometry/opacity changes and are reused during camera-only movement. Materials, shared textures, custom shadow materials and the reflection environment are disposed on teardown.

## Seamless loading and motion controls

The theme-aware studio remains CSS behind a transparent canvas. The loading poster comes from the same live model, materials, camera and lighting. Its distinct asset path avoids serving a cached pavilion image. Pause visibly rewinds, captures the exact opening and replaces the scroll track with a static section retaining all six steps. Resume aligns the section before rebuilding the live scene. Both states use the shared 72 px desktop/tablet and 64 px phone header definition.

Reduced motion, disabled JavaScript, failed downloads and graphics-context loss retain the new poster and all six readable chapter descriptions. Static drawings describe the courtyard model. The scene's visibility recovery and interrupted rewind/resume behavior remain in place. The 3D canvas never contains essential copy or form controls.

## Regeneration

```powershell
& 'C:/Program Files/Blender Foundation/Blender 5.2/blender.exe' --background --python scripts/create-engineering-model.py -- --no-render
npm run build
npm run start
# With the server running, in another terminal:
node scripts/capture-engineering-poster.mjs
```

The capture script also accepts a preview URL. When replacing a published poster, use a new filename in the content configuration to avoid stale optimized-image caches. Regenerate the poster after any change to geometry, materials, opening framing or lighting. The optional Blender render is an inspection image, not the web fallback.

```powershell
& 'C:/Program Files/Blender Foundation/Blender 5.2/blender.exe' --background --python scripts/review-engineering-model.py
```

Inspection renders and browser screenshots are stored locally under ignored `artifacts/courtyard-review/`. Review front, rear, sides, roof, underside, courtyard, facade joints and entrance separately from browser checks. Browser review also covers the six chapters and intermediate transitions in both scroll directions, both themes and phone/tablet/desktop layouts.

## Original courtyard integration coverage

Lint, TypeScript and the production build pass. The full existing 75-test suite ran with one worker and a 120-second overall test budget: 70 passed initially, and five scene-loading/motion waits passed on isolated reruns with their original assertions unchanged. Two additional courtyard tests pass: the published WebP matches the actual opening capture, and an unreadable GLB retains the new poster and all six chapters. This gives 77 covered scenarios across the full run and focused reruns; it was not a single all-green suite run.

Visual review covers both themes at 375, 430, 768, 1024, 1440 and 1920 px, every chapter and intermediate forward/reverse transitions, plus the six updated fallback studies. The wider model revealed a tablet caption overlap; its note now sits above the model. The final stylesheet was rebuilt and the caption position reviewed again at all six sizes. Strict live/paused pixel checks pass on phones and desktop in both themes, including a theme switch while paused. Those original assets were 2,048,880 bytes and 232,676 bytes respectively, before the exterior refinement below.

Local automated coverage uses Chromium on Windows with SwiftShader software graphics. Timing failures in the full run mean this is not a device-performance certification. Safari and physical-device frame rates require separate testing.

## Modern exterior refinement

The courtyard massing, 98 columns, 20 plates, camera path and scroll controls remain unchanged. Masonry course marks, intermediate stone piers, repeated facade screens and dense terrace balusters are replaced by larger glass openings, continuous floor bands and sparse glass-guard posts. The palette is pearl limestone, warm grey concrete and dark anodised bronze. Window and guard glass use separate transparency values, preserved by the existing renderer and shadow fade.

The regenerated GLB is 1,473,680 bytes; its lossless opening poster is 219,590 bytes. The poster has a new URL to avoid stale optimized-image caches. The editable Blender source contains the same updated facade. Blender inspection covers all four elevations, roof, underside, courtyard, entrance, facade joints and ground contact. Browser screenshots use the `modern-` prefix in `artifacts/courtyard-review/`.

Validation for this refinement: lint, TypeScript and production build pass. All 34 selected browser tests pass in one run (courtyard model/poster, engineering chapters, mobile motion, strict paused-image comparisons and themes). This includes reduced motion, JavaScript-free theme rendering, graphics failures, both touch viewports, live theme switching and accessibility checks. The entire 77-test suite was not repeated for this asset-only refinement. Chromium/SwiftShader on Windows was used; Safari and physical devices remain untested.

Final visual review passed at 375, 430, 768, 1024, 1440 and 1920 px in both themes, with no horizontal overflow. Seventeen sampled states per theme cover all six chapters and intermediate forward/reverse transitions. Separate desktop accessibility scans of the engineering section report no violations in either theme. No unintended connection defects or clipping were observed in these reviewed views.

## Website palette accents

A restrained brushed-copper material now accents the two inner entrance columns, terrace handrails and rooftop screen, echoing the website accent palette. Primary window metalwork uses warm charcoal and the smoked glazing has a more neutral green tint. Pale limestone remains the dominant finish. Geometry, lighting, animation and material transparency are unchanged. Both themes use the same architectural materials, including during live theme switches. The regenerated GLB is 1,479,936 bytes and the matching lossless poster is 219,712 bytes. Its new `courtyard-copper-studio.webp` URL replaces the previous modern-exterior poster.

Palette validation: lint, TypeScript and production build pass. Reviewed the opening in both themes at all six documented widths; no overflow was detected. Nine relevant browser scenarios were exercised: eight passed in the first run, and the light-desktop pause test exceeded its 10-second rewind assertion. That test passed in isolation with unchanged assertions. Poster matching, unreadable-model fallback, both touch viewports, all four strict pause-image comparisons and live theme switching are covered. Chromium software graphics remain a timing limitation; Safari and physical devices were not tested.

## Glazing visibility correction

Opaque architecture now writes depth in the opaque render pass when assembled; it only enters transparency blending during explanatory fades. Glass composites after the architectural solids, including while fading, because shared floor origins cannot reliably sort glass against interior walls by distance. Technical reinforcement/services overlays keep their later render order. This prevents opaque interior surfaces overwriting the window tint. Source window alpha is increased from 0.64 to 0.78; clear terrace guards retain 0.24. Shapes, copper accents, lighting and camera choreography are unchanged.

The Blender source and GLB are regenerated. The corrected transparent opening poster is 217,398 bytes, published at a fresh `courtyard-glazed-studio.webp` path. The glazing regression renders a shared-origin wall and glass fixture in both mesh export orders, compares their pixels and verifies a visible tint against a no-glass control.

Glazing validation: lint, TypeScript and production build pass. Ten targeted browser scenarios cover the new export-order regression, published-poster matching, malformed-model fallback, both mobile viewports, four strict pause-image comparisons and live theme switching. Eight passed initially; two rewind waits exceeded their existing 10-second assertions and passed in an isolated rerun without assertion changes. The intermittent software-renderer rewind timing limitation remains; this change does not claim to resolve it. Safari and physical devices remain untested.

Visual glazing review covers both themes at 430, 768 and 1440 px, plus seventeen sampled states per theme spanning all six chapters and forward/reverse transitions. No new layering or clipping defects were observed. Desktop accessibility scans report zero violations in both themes; mobile accessibility is covered by the touch-viewport tests. Review images have a `glazed-` prefix in `artifacts/courtyard-review/`.

## Closed facade corners

Adjoining facade strips previously stopped at their wall boundaries, leaving a notched outer quadrant at perpendicular corners. Each corner now uses one closed stone return, including inward-facing courtyard corners. Straight facade junctions share one continuous pier. The 34 perpendicular corners and 49 total returns retain their original floor metadata, so explanatory separation remains level-local. Massing, glazing, lighting and camera motion are unchanged.

The generator checks closed edge connectivity, filled corner outlines and diagonal ray intersections against all 34 finished, bevelled corners. These checks pass. The regenerated editable Blender source and GLB use the same geometry; the GLB is 1,444,336 bytes. Its matching lossless poster is 216,460 bytes at a fresh `courtyard-closed-studio.webp` URL.

Corner validation: lint, TypeScript and production build pass. All nine targeted browser scenarios pass in a single run: published-poster matching, unreadable-model fallback, both touch viewports, four strict pause/rewind opening comparisons and live theme switching. The full browser suite was not repeated for this geometry change. Blender review includes all elevations, roof, underside, courtyard, entrance, facade joints and ground contact. Chromium on Windows uses software graphics; Safari and physical devices remain untested.

### Continuous terrace curbs

The follow-up terrace-corner correction replaces individual parapet strips with four closed, mitred mesh runs. This fills the exposed corner quadrants and removes overlapping internal faces. Shared railing posts are emitted once at each junction. All eight turns are checked from both sides against the bevelled geometry (16 passing ray probes), alongside the 34 passing facade-corner probes and existing support checks. An explicit terrace-corner inspection view is included in the review script.

Final assets: 1,437,368-byte GLB and 215,948-byte matching lossless poster, now using `courtyard-finished-studio.webp` to avoid cached interim images. The editable source includes both corner corrections.

Final visual review covers both themes at 430, 768 and 1440 px, all six chapter states and sampled reverse transitions. No open corner seams, new clipping or horizontal overflow were observed in the reviewed views. Both desktop engineering-section accessibility scans report zero violations. Fresh review images use the `finished-` prefix; `terrace-corner.png` shows the joined curb in detail.

After the terrace update, lint, TypeScript and production build pass again. Four focused browser checks pass in one run: final-poster matching, model-load fallback, 430 px touch interaction/accessibility and strict dark-desktop pause/rewind matching. The nine-case run above predates the final curb update; the full suite was not rerun. Safari and physical-device coverage remain outstanding.

## Gentler opening and completion

`lib/engineering-timeline.ts` separates camera interpolation from assembly fades. The first 6% of the ordinary scroll track keeps the building fully assembled while the camera begins its orbit. The first reveal then eases into the structural chapter. On completion, the exterior is fully assembled by 94% of the track; a quintic camera curve settles more gently into the final view. Chapter positions, scroll distance and rewind progress remain unchanged, and the same deterministic timeline works in either direction.

The limestone floor bands and corner returns, plus the entrance frame finishes, now carry an internal `animationRole: frame`. They retain `system: facade` and their original floor levels: these are architectural finishes, not newly classified structural members. Their visibility follows the structural frame, so removing glass no longer removes the building's front outline. They fade with the structure for the reinforcement, services and drawing studies. Terraces, interiors and glazing retain their facade fade. Connected frame components retain their existing floor transforms.

The source and GLB are regenerated (1,443,660 bytes). The opening appearance is unchanged and the existing published poster passes the strict opening comparison, so no replacement poster URL is needed. All 34 facade and 16 parapet ray probes, closed-mesh checks and support checks pass.

Pacing validation: lint, TypeScript and production build pass. Thirteen targeted scenarios cover the new opening/ending timing contracts, actual exported frame roles, poster matching, malformed-model fallback, glazing order, mobile interactions and all four strict pause/rewind comparisons. Eleven passed initially; the two light-theme pause cases exceeded the existing 10-second initial scene-ready wait, before pause began. Both passed in an isolated rerun with assertions unchanged. This was not a single all-green run or a full-suite rerun. Chromium/SwiftShader loading time remains a coverage limitation; Safari and physical devices were not tested.

Visual pacing review covers both themes at 430, 768 and 1440 px, with twelve sampled opening, structural and completion states per theme in both scroll directions. The assembled opening remains readable through the small-scroll samples and the perimeter frame remains visible after glazing clears. No new clipping, open corners or horizontal overflow was observed in these views. Desktop engineering-section accessibility scans report zero violations in both themes. Review assets use the `pacing-` prefix under ignored `artifacts/courtyard-review/`.

## First-entry readiness and resize continuity

The live scene now starts preparing within 900 px of the story, while the first page view still avoids requesting the model. The existing poster remains visible during loading and the status reads “Preparing model…”. Opaque and fading material/shadow variants are compiled and rendered behind the poster before the scene is marked ready. The final first frame uses the latest scroll progress, including scroll changes made while downloading or compiling. No geometry, lighting, timeline or published poster asset changes are required.

The previous handoff hid the poster immediately but faded the canvas in for 800 ms, exposing a nearly empty frame. The complete canvas now replaces the poster in the same style update. Readiness resets when the scene is disposed, including live reduced-motion changes, and stale callbacks are ignored.

Renderer size changes previously cleared the WebGL buffer inside ResizeObserver and delayed drawing until a later animation frame. Size changes now repaint synchronously before that callback returns, and unchanged dimensions do not resize the buffer.

A separate phone layout bug made the hero's height depend on its animated side margins. Its expansion moved the engineering story during scroll and after fast returns to the top. The hero retains a viewport-based fixed height while its side margins reveal, keeping downstream section coordinates stable. This reproduced as incorrect recovered progress and failed phone opening/paused-image comparisons; their existing assertions were preserved.

Regression coverage includes a delayed model response requested before section entry, first-ready opacity and progress, synchronous WebGL pixel reads after phone-height changes, restoring motion after a live preference change, and stable story document coordinates through the hero reveal. Existing recovery, six-chapter, malformed-model, context-loss, reduced-motion, touch and strict pause/rewind checks are retained.

Validation: lint, TypeScript and production build pass. The first 21-case run passed 18 cases and exposed the three phone layout failures described above. After fixing hero height, all nine selected loading, phone recovery, touch, layout-stability and strict pause-image cases pass with the existing comparison tolerances unchanged. Across those runs, 25 distinct targeted scenarios have passing coverage; this was not a full-site suite run.

Visual review covers the opening at 375, 430, 768, 1024, 1440 and 1920 px in both themes, plus structural, detail, systems, drawing, final and reverse-return samples on desktop. No new framing or connection defects were observed. Artifacts are in ignored `artifacts/loading-review/`. Chromium/SwiftShader on Windows and emulated touch were tested; Safari and physical devices were not. These fixes address reproduced readiness, resizing and scroll-layout defects, not a guarantee against every device-specific GPU stall.
