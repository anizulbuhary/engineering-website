# Architectural experience

The homepage uses an editorial hero with a Contact link: oversized HTML typography, a structural concept image and a subtle scroll-linked image reveal. It has no Blender scene, image sequence, canvas or extra dependencies. Reduced motion and disabled JavaScript preserve a complete static composition.

## Building assets and reproduction

- `assets/blender/formwork-pavilion.blend`: editable building with enclosed roof core, parapets, covered setbacks, connected facade rails, entrance doors and grounded podium/steps.
- `public/models/`: the building GLB (approximately 1.5 MB) and optimized static poster.

After `npm ci`, regenerate the building:

```powershell
& 'C:\Program Files\Blender Foundation\Blender 5.2\blender.exe' --background --python scripts/create-engineering-model.py
```

The building script includes geometry contact checks before mesh merging. Run `scripts/review-engineering-model.py` with Blender to regenerate front, rear, side, roof, ground and underside inspection renders without modifying the source model. Blender is not needed to run or deploy the site. The previous colonnade source and frame assets are archived locally under ignored `artifacts/retired-colonnade/` and are no longer part of the deployed site.

All geometry is original and fictional. Reinforcement and services are schematic illustrations, not certified construction documentation.

## Runtime

The engineering story lazy-loads its GLB within 100 px of the viewport. Seven occupied storeys terminate at a supported roof; parapets and the roof enclosure travel with their slab. Each floor's facade, reinforcement and services share its vertical offset. Exploded states expand upward from the grounded first floor, with camera framing following the building centre. Facade components fade together without stretching.

Desktop and phones both run the live model. Portrait phones use a vertical layout: heading, model, current chapter and six touch-friendly chapter buttons. A compact layout covers short landscape screens. Ordinary scrolling moves through all six chapters in either direction; chapter buttons navigate the same timeline. Desktop travel remains 650 viewport heights; phone travel is 480.

Mobile or short-screen initialization caps rendering at device pixel ratio 1 and uses a 512 px shadow map. Desktop uses a maximum ratio of 1.5 and a 1024 px shadow map. Framing responds to the canvas aspect ratio. Rendering stops after the camera settles, while offscreen and when the tab is hidden.

Reduced motion, disabled JavaScript, model download failure and graphics context loss show the complete illustrated story. Disabling motion visibly rewinds both the camera/model timeline and page position to the opening, targeting 650 ms. Per-frame time is capped so slower GPUs still show intermediate frames. Wheel, touch, pointer or scrolling-key input can interrupt the return.

At the opening, the renderer captures a transparent PNG directly from its current canvas. That image replaces the live canvas in exactly the same layout: camera, materials, lighting, background, scale and position all match. The image is generated locally in memory, with no upload or extra asset download. The renderer is then disposed. The six chapter labels remain visible as a static ordered list with the opening highlighted. Paused mode has no sticky positioning, long scroll track or interactive chapter navigation; its one-viewport composition scrolls normally with the page. Resume retains the captured opening while the live model loads, then switches back in place and waits for scrolling. The static image is replaced on the next pause, keeping just one capture in memory. Both toggles align the section below the header before paint. The hero remains independent of model loading and graphics support.

## Verification

The engineering suites exercise desktop and touch-emulated phone chapter navigation, forward/reverse scrolling, actual canvas image changes, pause/resume, portrait/landscape resizing, reduced motion and graphics/download failure. The hero suite covers reversible image reveal, reduced motion and absence of retired sequence requests. The frontend suite covers routes at 375, 430, 768, 1024, 1440 and 1920 px, accessibility and JavaScript-free content.

Visual review is separate from browser assertions. Current browser coverage is Chromium on Windows, including phone viewport/touch emulation. Physical phones and Safari have not been tested; phone GPU performance cannot be inferred from desktop emulation.

The pause suite records intermediate rewind frames from a later chapter and compares the static image pixels with the live opening. It also checks the six static chapter labels, removal of the canvas and scroll controls, a loaded image, a compact section height, ordinary scrolling and resuming at the opening chapter.

The loading and fallback poster uses `pavilion-studio.webp`, a transparent lossless WebP captured from the runtime opening. After regenerating the model, build and start the website, then run `node scripts/capture-engineering-poster.mjs` (optionally supply the preview URL). This keeps the poster's model and lighting consistent with the live scene. The Blender script retains its inspection render under `artifacts/blender/`; it no longer publishes an opaque poster. The loading poster hides immediately once the live canvas is ready.
Verified for the matching still/rewind behavior: build, lint and TypeScript passed; both pause tests and all 22 remaining browser tests passed. The pause tests verify multiple intermediate rewind frames and compare opening/still pixels at 390 and 1440 px. Static compositions were visually reviewed at 390, 768 and 1440 px. Physical devices and Safari remain untested.
After removing the capabilities link from the experience, lint, TypeScript and the production build passed. The nine engineering browser checks passed, with the 375 px chapter-navigation timeout passing on an isolated rerun. Desktop, tablet and phone still views were visually checked again.
After retaining the six step labels while paused, build, lint, TypeScript and all six engineering/pause browser checks passed. The static list was visually reviewed on phone, tablet and desktop layouts.

The shared header is now 72 px on tablet/desktop and 64 px on phones. Scene scrolling, sticky sizing, rewind and still alignment read the shared header height; the engineering interaction otherwise retains its existing behavior.

## Theme-aware studio background

The backdrop is now warm limestone in light mode and neutral charcoal in dark mode. Its colors and the surrounding text/control colors use CSS tokens. A subdivided ground grid fades through vertex alpha before its perimeter; its neutral tone and the existing shadow composite over either theme. The paused PNG therefore remains valid when the visitor switches themes.

The technical edge overlay uses dark ink in light mode and pale ink in dark mode. A narrowly scoped appearance observer updates only that overlay, without remounting the scene or changing timeline progress. The model geometry, material colors, lighting, camera shots, floor separation, chapter navigation and rewind behavior are unchanged. Fallback illustration labels inherit the theme text colors.

Local visual captures are in `artifacts/backdrop-review/`. Review the six chapter states and intermediate transitions, particularly the fine lines against limestone, independently of the automated accessibility and pause-image comparisons. Safari and physical devices remain outside local coverage.

Both themes were reviewed at 375, 430, 768, 1024, 1440 and 1920 px; all six stages and five intermediate transitions were captured at desktop width. Reduced-motion and JavaScript-free fallback compositions were checked separately on phone, tablet and desktop. The transparent poster is approximately 220 KB; phone image sizing accounts for its cropped transparent margins to avoid a soft preview.

The visible stage now rounds towards the sticky boundary on resume, removing a fractional-pixel offset between the captured still and live canvas. The animation timeline and rewind duration are unchanged. Tests measure the visible stage's alignment rather than the outer scroll track. The expanded 55-test browser suite passed, including strict image matching within each theme and across a theme switch while paused. Lint, TypeScript and production build passed.

Scroll recovery now checks the canvas's current bounds when progress changes or the viewport resizes, so a stale visibility notification cannot keep a visible model asleep. Visibility callbacks also read current bounds, and returning to a tab or restored page restarts scheduling and refreshes the scroll position. Rendering still stops off-screen and when the page is hidden; the camera timeline and damping are unchanged.

`tests/engineering-recovery.spec.ts` deliberately suppresses renderer visibility notifications to verify this recovery on phone, tablet and desktop. That controlled fault reproduced a frozen opening before the fix; it does not establish which browser condition caused the original intermittent report. The suite also checks loading mid-story and continuing to scroll after cancelling a rewind.

All 19 recovery, engineering, touch-emulation and pause tests passed after this change, including strict opening-image comparisons in both themes. Lint and production build (including TypeScript) passed. Coverage remains Chromium on Windows; Safari and physical devices were not tested.
