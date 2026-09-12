/** Derive a portrait viewport from the editable landscape SVG without rasterizing it. */
import { readFile, writeFile } from "node:fs/promises";
const source = await readFile(
  "public/graphics/studies/construction-landscape-drawing.svg",
  "utf8",
);
const cropWidth = (768 * 1024) / 845;
const portrait = source.replace(
  'width="1536" height="1024" viewBox="0 0 1536 1024"',
  `width="768" height="845" viewBox="${(1536 - cropWidth) / 2} 0 ${cropWidth} 1024"`,
);
if (portrait === source)
  throw new Error(
    "Unexpected source canvas; preserve the shared 1536 x 1024 coordinates.",
  );
await writeFile(
  "public/graphics/studies/construction-portrait-drawing.svg",
  portrait,
);
console.log("Generated portrait SVG from the same vector geometry.");
