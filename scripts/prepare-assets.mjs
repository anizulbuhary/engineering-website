import { mkdir, writeFile } from "node:fs/promises";
import sharp from "sharp";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
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
const sheets = [
  ["slab-plan", "Typical slab arrangement", "Shop drawings"],
  ["beam-detail", "Beam reinforcement study", "Reinforcement"],
  ["bar-schedule", "Bar schedule layout", "Schedules"],
  ["coordination-view", "Structural interface view", "Model views"],
  ["column-section", "Column section study", "Reinforcement"],
  ["handover-index", "Handover package index", "Schedules"],
];
for (const [index, [id, title, category]] of sheets.entries()) {
  const pdf = await PDFDocument.create();
  const page = pdf.addPage([900, 640]);
  const font = await pdf.embedFont(StandardFonts.Helvetica);
  let svg = "";
  const line = (x1, y1, x2, y2, color = "#63685f", width = 1) => {
    svg += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${color}" stroke-width="${width}"/>`;
    page.drawLine({
      start: { x: x1, y: 640 - y1 },
      end: { x: x2, y: 640 - y2 },
      thickness: width,
      color:
        color === "#b84f24" ? rgb(0.72, 0.31, 0.14) : rgb(0.39, 0.41, 0.37),
    });
  };
  const text = (x, y, value, size = 11) => {
    svg += `<text x="${x}" y="${y}" font-family="monospace" font-size="${size}" fill="#343b32">${value.replaceAll("&", "&amp;")}</text>`;
    page.drawText(value, {
      x,
      y: 640 - y,
      size,
      font,
      color: rgb(0.2, 0.23, 0.19),
    });
  };
  const rect = (x, y, w, h) => {
    line(x, y, x + w, y);
    line(x + w, y, x + w, y + h);
    line(x + w, y + h, x, y + h);
    line(x, y + h, x, y);
  };
  text(42, 47, "FORMWORK / ENGINEERING", 14);
  text(42, 73, "ILLUSTRATIVE SAMPLE - NOT FOR CONSTRUCTION", 10);
  line(40, 90, 860, 90);
  text(42, 585, title.toUpperCase(), 17);
  text(42, 613, `${category.toUpperCase()} / SCHEMATIC / NOT TO SCALE`, 10);
  text(717, 613, `FW-S0${index + 1} / REV 00`, 10);
  line(40, 560, 860, 560);
  if (id === "slab-plan") {
    for (let i = 0; i < 5; i++) {
      line(140 + i * 150, 135, 140 + i * 150, 510, "#a2a69d", 0.5);
      text(137 + i * 150, 123, String.fromCharCode(65 + i));
    }
    for (let j = 0; j < 4; j++) {
      line(95, 170 + j * 95, 795, 170 + j * 95, "#a2a69d", 0.5);
      text(78, 174 + j * 95, String(j + 1));
    }
    rect(140, 170, 600, 285);
    rect(145, 175, 590, 275);
    for (let i = 0; i < 5; i++)
      for (let j = 0; j < 4; j++) rect(134 + i * 150, 164 + j * 95, 12, 12);
    rect(425, 255, 100, 110);
    text(443, 305, "CORE");
    line(140, 490, 740, 490);
    text(350, 508, "TYPICAL STRUCTURAL BAYS");
    line(570, 350, 680, 275, "#b84f24");
    text(650, 255, "EDGE STUDY");
  } else if (id === "beam-detail") {
    rect(110, 210, 660, 120);
    line(125, 227, 755, 227, "#b84f24", 2);
    line(125, 312, 755, 312, "#b84f24", 2);
    for (let i = 0; i < 22; i++) rect(135 + i * 28, 220, 7, 101);
    line(130, 355, 750, 355);
    text(310, 378, "SCHEMATIC BEAM ELEVATION");
    rect(340, 420, 130, 85);
    rect(353, 432, 104, 60);
    text(495, 461, "SECTION A-A");
  } else if (id === "column-section") {
    rect(280, 150, 310, 310);
    rect(305, 175, 260, 260);
    rect(317, 187, 236, 236);
    for (let i = 0; i < 4; i++)
      for (let j = 0; j < 4; j++)
        if (i === 0 || i === 3 || j === 0 || j === 3)
          rect(321 + i * 70, 191 + j * 70, 10, 10);
    line(180, 305, 675, 305, "#b84f24");
    text(170, 290, "A");
    text(680, 290, "A");
    text(321, 503, "SCHEMATIC SECTION");
  } else if (id === "coordination-view") {
    for (let f = 0; f < 4; f++) {
      const y = 430 - f * 75;
      line(215, y, 445, y + 60);
      line(445, y + 60, 675, y - 35);
      line(675, y - 35, 445, y - 95);
      line(445, y - 95, 215, y);
      if (f < 3) {
        line(215, y, 215, y - 75);
        line(445, y + 60, 445, y - 15);
        line(675, y - 35, 675, y - 110);
      }
    }
    line(165, 315, 445, 390, "#b84f24", 3);
    line(445, 390, 720, 275, "#b84f24", 3);
    text(560, 205, "INTERFACE REVIEW");
    line(600, 215, 580, 331, "#b84f24");
  } else {
    const headers =
      id === "bar-schedule"
        ? ["MARK", "SHAPE", "REFERENCE", "STATUS"]
        : ["DOCUMENT", "DESCRIPTION", "REVISION", "STATUS"];
    const xs = [95, 250, 530, 685];
    rect(85, 140, 730, 350);
    for (let i = 0; i < 8; i++) line(85, 185 + i * 43, 815, 185 + i * 43);
    [235, 515, 670].forEach((x) => line(x, 140, x, 490));
    headers.forEach((h, i) => text(xs[i], 168, h));
    for (let i = 0; i < 7; i++) {
      text(95, 212 + i * 43, `${id === "bar-schedule" ? "B" : "FW"}-0${i + 1}`);
      text(
        250,
        212 + i * 43,
        id === "bar-schedule"
          ? ["L-BAR STUDY", "STRAIGHT BAR", "LINK STUDY"][i % 3]
          : ["MODEL RECORD", "DRAWING SET", "PACKAGE INDEX"][i % 3],
      );
      text(530, 212 + i * 43, "S-0" + (i + 1));
      text(685, 212 + i * 43, "CONCEPT");
    }
  }
  await writeFile(
    `public/graphics/samples/${id}.svg`,
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 640"><rect width="900" height="640" fill="#f4f2ed"/>${svg}</svg>`,
  );
  pdf.setTitle(title + " - Illustrative sample");
  pdf.setAuthor("FORMWORK concept studio");
  await writeFile(`public/documents/samples/${id}.pdf`, await pdf.save());
}
console.log(
  "Prepared local project images, social preview, brand mark, six SVG samples and six matching PDFs.",
);
