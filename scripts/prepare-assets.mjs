import { mkdir, writeFile } from "node:fs/promises";
import sharp from "sharp";
import { prepareDrawingSheets } from "./drawing-sheets.mjs";
import path from "node:path";
const root = process.cwd();
for (const dir of [
  "public/images/projects",
  "public/graphics/samples",
  "public/documents/samples",
  "public/brand",
])
  await mkdir(path.join(root, dir), { recursive: true });
const source = process.argv[2];
if (source) {
  const files = {
    frame: "exec-d870ee09-5497-4cbf-9bd7-875ebbd3e054.png",
    courtyard: "exec-96b978fa-a3a8-4822-bf20-33ad3e469215.png",
    civic: "exec-32a9092a-9c2c-4431-b3f2-c7f630e7163e.png",
    campus: "exec-6fdd87eb-a267-447d-aa4f-1d30325ac354.png",
  };
  for (const [name, file] of Object.entries(files))
    await sharp(path.join(source, file))
      .resize({ width: 1600, withoutEnlargement: true })
      .webp({ quality: 84 })
      .toFile(`public/images/projects/${name}.webp`);
  const overlay = Buffer.from(
    '<svg width="1200" height="630"><rect width="1200" height="630" fill="#171918" opacity=".55"/><text x="65" y="95" fill="#f4f2ed" font-family="Arial" font-size="25">FORMWORK / ENGINEERING</text><text x="60" y="355" fill="#f4f2ed" font-family="Arial" font-size="90">Detailed for</text><text x="60" y="455" fill="#f4f2ed" font-family="Arial" font-size="90">construction.</text><text x="65" y="575" fill="#f4f2ed" font-family="Arial" font-size="16">CONCEPT STUDIO / STRUCTURAL BIM &amp; TECHNICAL DELIVERY</text></svg>',
  );
  await sharp("public/images/projects/frame.webp")
    .resize(1200, 630, { fit: "cover" })
    .composite([{ input: overlay }])
    .jpeg({ quality: 85 })
    .toFile("public/images/social-preview.jpg");
}
await writeFile(
  "public/brand/favicon.svg",
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" fill="#171918"/><path d="M17 49V15h31v8H26v8h18v8H26v10Z" fill="#f4f2ed"/></svg>',
);
await prepareDrawingSheets();
console.log("Prepared project assets and coordinated drawing sheets.");
