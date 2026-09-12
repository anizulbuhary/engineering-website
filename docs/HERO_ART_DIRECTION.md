# Concrete-frame hero art direction

The hero photo is an AI-generated unfinished concrete structure, created with the built-in image-generation tool. Its original is preserved in ignored `artifacts/hero-concept/construction-image.png`.

Published photo assets:
- `public/images/hero/construction-landscape-image.webp`
- `public/images/hero/construction-portrait-image.webp`

The drawing is authored directly as editable SVG, not generated as a bitmap or traced automatically from a filter:
- `public/graphics/studies/construction-landscape-drawing.svg` (editable master)
- `public/graphics/studies/construction-portrait-drawing.svg` (derived viewport)

The same 1536 × 1024 coordinate system locates the three portal frames, inner returns and floor contacts. Pencil retraces, restrained hatching and copper callouts interpret the visible construction. This is an illustrative concept comparison, not a measured construction drawing or the same building as the interactive model below.

Run `node scripts/optimize-hero-comparison.mjs` for the WebP photo assets and `node scripts/create-hero-sketch.mjs` after editing the SVG master to derive its portrait view. The hero contains no tree or landscaping elements. Rejected courtyard artwork remains only in ignored review artifacts.

## Image-generation prompt

Use case: photorealistic-natural.
Asset type: architectural engineering website hero, ONE landscape 3:2 photograph, no text or mockup.
Primary request: an aesthetically exceptional unfinished concrete building, with simple, legible construction geometry that can be faithfully drawn as an architectural vector sketch. NO trees, plants, landscaping, furniture, people, vehicles, machinery, scaffolding, glass, curtains or clutter.
Scene: stand inside a beautifully proportioned unfinished reinforced-concrete pavilion, looking through a sequence of THREE rectangular structural portal frames toward a pale sunlit opening. The frame is the architecture: chunky perfectly connected square columns, supported deep horizontal beams, continuous concrete slab overhead and a continuous floor at ground level. Open side bays admit warm late afternoon daylight. Restrained rough board-formed concrete texture, small tie holes and believable joints. Clear, complete beam-to-column intersections, ordinary buildable structure. Grounded columns. Nothing floating. No stairs or complicated intersecting wings.
Camera/composition: centered eye-level architectural photography, straight vertical lines, one-point perspective. Near portal columns at approximately 18% and 82% image width, lintel across the upper quarter; two further portal frames recede toward the center. Full concrete floor foreground. Building fills the frame, no miniature model, no aerial view. Center 50% remains beautiful when cropped vertically for phones. Clean strong edges, generous negative space within the openings, calm disciplined rhythm.
Light/mood: editorial fine-art construction photograph, quiet monumental atmosphere, beautiful warm side light and long geometrically coherent shadows across the concrete floor, restrained contrast. Warm gray concrete, ivory sunlight, charcoal shade, faint warm copper undertones only from light. Natural textured material, not orange grading, not glossy CGI, not HDR. Premium architectural magazine composition.
No text, dimensions, letters, diagrams, border, watermark or logo.

