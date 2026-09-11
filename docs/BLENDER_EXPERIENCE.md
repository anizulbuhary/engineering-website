# Architectural experience

The homepage uses an editorial hero: oversized HTML typography, a structural concept image and a subtle scroll-linked image reveal. It has no Blender scene, image sequence, canvas or extra dependencies. Reduced motion and disabled JavaScript preserve a complete static composition.

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

At the opening, the renderer captures a transparent PNG directly from its current canvas. That image replaces the live canvas in exactly the same layout: camera, materials, lighting, background, scale and position all match. The image is generated locally in memory, with no upload or extra asset download. The renderer is then disposed. Paused mode has no sticky positioning, long scroll track or chapter navigation; its one-viewport composition scrolls normally with the page. Resume retains the captured opening while the live model loads, then switches back in place and waits for scrolling. The static image is replaced on the next pause, keeping just one capture in memory. Both toggles align the section below the header before paint. The hero remains independent of model loading and graphics support.

## Verification

The engineering suites exercise desktop and touch-emulated phone chapter navigation, forward/reverse scrolling, actual canvas image changes, pause/resume, portrait/landscape resizing, reduced motion and graphics/download failure. The hero suite covers reversible image reveal, reduced motion and absence of retired sequence requests. The frontend suite covers routes at 375, 430, 768, 1024, 1440 and 1920 px, accessibility and JavaScript-free content.

Visual review is separate from browser assertions. Current browser coverage is Chromium on Windows, including phone viewport/touch emulation. Physical phones and Safari have not been tested; phone GPU performance cannot be inferred from desktop emulation.

The pause suite records intermediate rewind frames from a later chapter and compares the static image pixels with the live opening. It also checks removal of the canvas and scroll controls, a loaded image, a compact section height, ordinary scrolling and resuming at the opening chapter.

The loading poster uses `pavilion-roofline.webp` so optimized-image caches cannot reuse the retired rooftop view. The poster hides immediately once the live canvas is ready, preventing two differently framed models from overlapping during the handoff.
Verified for the matching still/rewind behavior: build, lint and TypeScript passed; both pause tests and all 22 remaining browser tests passed. The pause tests verify multiple intermediate rewind frames and compare opening/still pixels at 390 and 1440 px. Static compositions were visually reviewed at 390, 768 and 1440 px. Physical devices and Safari remain untested.
After removing the capabilities link from the experience, lint, TypeScript and the production build passed. The nine engineering browser checks passed, with the 375 px chapter-navigation timeout passing on an isolated rerun. Desktop, tablet and phone still views were visually checked again.
