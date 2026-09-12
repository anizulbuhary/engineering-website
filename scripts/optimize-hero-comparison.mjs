import sharp from "sharp";
import { mkdir, stat } from "node:fs/promises";
await mkdir("public/images/hero", { recursive: true });
const input = "artifacts/hero-concept/construction-image.png";
const metadata = await sharp(input).metadata();
if (metadata.width !== 1536 || metadata.height !== 1024)
  throw new Error(
    "Keep the source photograph and SVG on the same 1536 x 1024 canvas.",
  );
for (const view of ["landscape", "portrait"]) {
  const output = `public/images/hero/construction-${view}-image.webp`;
  await sharp(input)
    .resize(
      view === "portrait" ? 768 : 1536,
      view === "portrait" ? 845 : 1024,
      { fit: "cover", position: "centre" },
    )
    .webp({ quality: 86, effort: 6 })
    .toFile(output);
  console.log(output, (await stat(output)).size);
}
