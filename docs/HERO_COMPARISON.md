# Hero image comparison

The hero pairs an AI-generated unfinished concrete structure with an editable SVG construction sketch. Three portal frames, beam soffits, column returns and ground contacts are traced in the same 1536 x 1024 coordinate system. The SVG uses deliberate line weights, light pencil retraces, hatch patterns and a few copper callouts. No trees, landscaping, photographic textures or embedded raster images appear in the drawing. This is an illustrative interpretation, not a measured construction document or the interactive building below.

## Assets

The image-generation prompt, editable source and reproduction commands are recorded in `docs/HERO_ART_DIRECTION.md`. The landscape SVG is the drawing master; `scripts/create-hero-sketch.mjs` derives the portrait viewport without rasterizing or moving any geometry. `scripts/optimize-hero-comparison.mjs` compresses the photo and derives its central phone crop. Combined asset sizes are approximately 178 KB desktop and 79 KB phone, before transfer compression.

## Interaction

`ImageComparison.tsx` uses a native range input and CSS clipping. Responsive `picture` sources switch both layers below 768 px, with matching fitting, cropping and scroll transforms. The slider handle is the only overlay control; the black view labels and drag hint have been removed. A quiet “Concrete frame — concept study” caption sits below the image. Paths, accessible labels and descriptions live in `content/engineering-story.ts`.

Mouse/touch dragging, arrow keys and Home/End reveal either view. The visible handle stays inside the frame. Vertical gestures retain ordinary scrolling. Reduced motion leaves manual comparison available while disabling the existing scroll scale. Without JavaScript, the static split stays visible with controls hidden. A sketch download failure preserves the concept image and Contact action.

The companion crop comes from the same image; its link leads into the engineering experience. The existing engineering model, animation and paused poster are unchanged.

## Validation

Browser checks cover displayed crops, responsive sources, pointer and keyboard controls, native touch scrolling, reduced motion, navigation, failed sketch downloads and JavaScript-free rendering. Visual review separately covers light/dark themes at 375, 430, 768, 1024, 1440 and 1920 px, including complete photo/sketch states.

Lint, TypeScript and production build pass. All 13 targeted hero, comparison and navigation tests pass, including the hero accessibility scan. Both themes were visually reviewed at all six widths; no horizontal overflow was observed. The main traced portal edges meet coherently at the divider. The drawing deliberately interprets fine concrete texture and shadows rather than duplicating them.

Review artifacts are in ignored `artifacts/comparison-review/`. Coverage uses Chromium on Windows and emulated touch; Safari and physical devices remain untested. The full site suite is not repeated for this hero artwork change.
