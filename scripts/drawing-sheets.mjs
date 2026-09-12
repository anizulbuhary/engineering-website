import { readFile, mkdir, writeFile } from "node:fs/promises";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

const sheets = JSON.parse(
  await readFile(
    new URL("../content/drawing-sheets.json", import.meta.url),
    "utf8",
  ),
);
const W = 1260,
  H = 896;
const C = {
  paper: "#f4f2ed",
  ink: "#343b32",
  line: "#63685f",
  faint: "#a5a99f",
  accent: "#a64b27",
  wash: "#e3e1d8",
};
const escape = (s) =>
  String(s)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll('"', "&quot;");
const color = (hex) =>
  rgb(...[1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255));

// Every primitive writes both formats, preserving vector lines and searchable PDF text.
async function sheet(meta, draw, { svgPath, pdfPath } = {}) {
  const pdf = await PDFDocument.create();
  const page = pdf.addPage([W, H]);
  const fonts = {
    sans: await pdf.embedFont(StandardFonts.Helvetica),
    mono: await pdf.embedFont(StandardFonts.Courier),
  };
  const svg = [];
  const pen = {
    line(x1, y1, x2, y2, ink = C.line, weight = 1, dashed = false) {
      svg.push(
        `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${ink}" stroke-width="${weight}"${dashed ? ' stroke-dasharray="7 5"' : ""}/>`,
      );
      page.drawLine({
        start: { x: x1, y: H - y1 },
        end: { x: x2, y: H - y2 },
        color: color(ink),
        thickness: weight,
        ...(dashed ? { dashArray: [7, 5] } : {}),
      });
    },
    rect(x, y, w, h, ink = C.line, weight = 1, fill) {
      svg.push(
        `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${fill ?? "none"}" stroke="${ink}" stroke-width="${weight}"/>`,
      );
      page.drawRectangle({
        x,
        y: H - y - h,
        width: w,
        height: h,
        borderColor: color(ink),
        borderWidth: weight,
        ...(fill ? { color: color(fill) } : {}),
      });
    },
    circle(x, y, r, ink = C.line, weight = 1, fill = C.paper) {
      svg.push(
        `<circle cx="${x}" cy="${y}" r="${r}" fill="${fill}" stroke="${ink}" stroke-width="${weight}"/>`,
      );
      page.drawCircle({
        x,
        y: H - y,
        size: r,
        borderColor: color(ink),
        borderWidth: weight,
        color: color(fill),
      });
    },
    text(x, y, value, size = 12, ink = C.ink, font = "mono", align = "start") {
      const width = fonts[font].widthOfTextAtSize(value, size);
      const left =
        align === "middle" ? x - width / 2 : align === "end" ? x - width : x;
      if (left < 0 || left + width > W || y > H)
        throw new Error(`Text outside sheet: ${value}`);
      svg.push(
        `<text x="${x}" y="${y}" font-family="${font === "mono" ? "Courier New,monospace" : "Helvetica,Arial,sans-serif"}" font-size="${size}" text-anchor="${align}" fill="${ink}">${escape(value)}</text>`,
      );
      page.drawText(value, {
        x: left,
        y: H - y,
        size,
        font: fonts[font],
        color: color(ink),
      });
    },
    poly(points, ink = C.line, weight = 1, close = false) {
      const pts = close ? [...points, points[0]] : points;
      for (let i = 1; i < pts.length; i++)
        pen.line(...pts[i - 1], ...pts[i], ink, weight);
    },
    dim(x1, x2, y, label, witnessY) {
      pen.line(x1, y, x2, y, C.faint, 0.7);
      for (const x of [x1, x2]) {
        pen.line(x, witnessY, x, y + (y > witnessY ? 7 : -7), C.faint, 0.6);
        pen.line(x - 4, y + 4, x + 4, y - 4, C.ink, 1);
      }
      pen.text((x1 + x2) / 2, y - 7, label, 11, C.ink, "mono", "middle");
    },
    tag(x, y, label, ink = C.accent) {
      pen.circle(x, y, 13, ink, 1.3);
      pen.text(x, y + 4, label, 11, ink, "mono", "middle");
    },
    hatch(x, y, w, h, step = 9) {
      for (let d = -h; d < w; d += step) {
        const a = Math.max(0, d),
          b = Math.min(w, d + h);
        pen.line(x + a, y + h - (a - d), x + b, y + h - (b - d), C.faint, 0.5);
      }
    },
    panel(y, title) {
      pen.line(902, y, 1216, y, C.line, 0.8);
      pen.text(902, y + 23, title, 12, C.accent);
    },
    note(y, lines) {
      lines.forEach((value, i) =>
        pen.text(902, y + i * 20, value, 11, C.ink, "sans"),
      );
    },
  };
  pen.rect(0, 0, W, H, C.paper, 0, C.paper);
  pen.rect(28, 28, W - 56, H - 56, C.line, 0.8);
  pen.text(52, 62, "FORMWORK / ENGINEERING", 19, C.ink, "sans");
  pen.text(
    52,
    83,
    "CONCEPT PAVILION / TECHNICAL COMMUNICATION STUDIES",
    10,
    C.line,
  );
  pen.text(1208, 60, meta.reference, 19, C.accent, "mono", "end");
  pen.text(
    1208,
    81,
    "ILLUSTRATIVE / NOT FOR CONSTRUCTION",
    10,
    C.accent,
    "mono",
    "end",
  );
  pen.line(28, 104, 1232, 104);
  pen.line(874, 104, 874, 790, C.faint, 0.7);
  draw(pen);
  pen.panel(665, "DRAWING NOTES");
  pen.note(710, meta.notes);
  pen.line(28, 790, 1232, 790);
  pen.text(52, 820, meta.title.toUpperCase(), 20, C.ink, "sans");
  pen.text(
    52,
    848,
    `${meta.category.toUpperCase()} / SCHEMATIC / NOT TO SCALE`,
    10,
    C.line,
  );
  pen.line(840, 790, 840, 868);
  pen.line(1010, 790, 1010, 868);
  pen.text(860, 811, "PURPOSE", 9, C.line);
  pen.text(860, 835, "COMMUNICATION", 11);
  pen.text(860, 852, "STUDY ONLY", 11);
  pen.text(1030, 811, "SHEET / REVISION", 9, C.line);
  pen.text(1030, 838, `${meta.reference} / 01`, 16);
  pdf.setTitle(`${meta.title} - Illustrative study`);
  pdf.setAuthor("FORMWORK concept studio");
  // Stable metadata makes regenerated assets reproducible.
  pdf.setCreationDate(new Date("2026-01-01T00:00:00Z"));
  pdf.setModificationDate(new Date("2026-01-01T00:00:00Z"));
  await writeFile(
    svgPath ?? `public/graphics/samples/${meta.id}.svg`,
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" role="img"><title>${escape(meta.title)}</title><desc>${escape(meta.description)}</desc>\n${svg.join("\n")}\n</svg>\n`,
  );
  if (pdfPath !== false)
    await writeFile(
      pdfPath ?? `public/documents/samples/${meta.id}.pdf`,
      await pdf.save(),
    );
}

function floor(p, frame = false) {
  const xs = [150, 300, 450, 600, 750],
    ys = [240, 360, 480, 600];
  p.text(60, 136, "01 / STRUCTURAL FLOOR PLAN", 14);
  p.dim(150, 750, 170, "24 000", 222);
  for (let i = 0; i < 4; i++) p.dim(xs[i], xs[i + 1], 195, "6 000", 222);
  xs.forEach((x, i) => {
    p.line(x, 216, x, 668, C.faint, 0.7, true);
    p.tag(x, 688, String(i + 1), C.line);
  });
  ys.forEach((y, i) => {
    p.line(96, y, 815, y, C.faint, 0.7, true);
    p.tag(82, y, "ABCD"[i], C.line);
  });
  p.rect(135, 225, 630, 390, C.ink, 2);
  p.rect(141, 231, 618, 378, C.line, 0.8);
  xs.slice(1, -1).forEach((x) => p.rect(x - 5, 231, 10, 378, C.line, 0.8));
  ys.slice(1, -1).forEach((y) => p.rect(141, y - 5, 618, 10, C.line, 0.8));
  for (const [i, x] of xs.entries())
    for (const [j, y] of ys.entries()) {
      if (i === 2 && (j === 1 || j === 2)) continue;
      p.rect(x - 8, y - 8, 16, 16, C.ink, 1, C.wash);
      p.hatch(x - 7, y - 7, 14, 14, 5);
    }
  for (let i = 0; i < 4; i++)
    for (let j = 0; j < 3; j++) {
      if ((i === 1 || i === 2) && j === 1) continue;
      p.text(
        xs[i] + (i === 3 && j === 0 ? 105 : 75),
        ys[j] + 52,
        `S${j + 1}${i + 1}`,
        13,
        C.line,
        "mono",
        "middle",
      );
      p.line(xs[i] + 52, ys[j] + 77, xs[i] + 98, ys[j] + 77, C.faint, 0.8);
      p.poly(
        [
          [xs[i] + 57, ys[j] + 73],
          [xs[i] + 52, ys[j] + 77],
          [xs[i] + 57, ys[j] + 81],
        ],
        C.faint,
      );
      p.poly(
        [
          [xs[i] + 93, ys[j] + 73],
          [xs[i] + 98, ys[j] + 77],
          [xs[i] + 93, ys[j] + 81],
        ],
        C.faint,
      );
      p.text(
        xs[i] + 75,
        ys[j] - 15,
        `B${j * 4 + i + 1}`.padEnd(3),
        9,
        C.line,
        "mono",
        "middle",
      );
    }
  p.rect(402, 336, 96, 168, C.ink, 2, C.paper);
  p.rect(411, 345, 78, 150, C.line, 1.4);
  p.rect(418, 352, 64, 42);
  p.text(450, 378, "LIFT", 10, C.line, "mono", "middle");
  for (let i = 0; i < 9; i++)
    p.line(418, 411 + i * 9, 449, 411 + i * 9, C.line, 0.7);
  p.rect(454, 410, 28, 77, C.faint);
  p.line(434, 483, 434, 415, C.accent);
  p.poly(
    [
      [430, 422],
      [434, 415],
      [438, 422],
    ],
    C.accent,
  );
  p.text(366, 423, "CORE", 10, C.ink, "mono", "end");
  p.line(375, 419, 402, 419);
  p.rect(628, 267, 42, 36, C.accent, 1);
  p.line(628, 267, 670, 303, C.accent, 0.7);
  p.line(670, 267, 628, 303, C.accent, 0.7);
  p.poly(
    [
      [670, 267],
      [693, 248],
      [724, 248],
    ],
    C.accent,
  );
  p.text(678, 238, "OP-01", 9, C.accent);
  p.hatch(731, 365, 27, 108, 8);
  p.rect(731, 365, 27, 108, C.accent, 1.2);
  p.line(706, 425, 810, 425, C.accent, 1.6);
  p.tag(706, 407, "A");
  p.tag(810, 407, "A");
  p.text(806, 458, frame ? "FW-01" : "EDGE 02", 10, C.accent, "mono", "end");
  p.dim(150, 450, 644, "12 000", 615);
  p.dim(450, 750, 644, "12 000", 615);
  p.text(
    60,
    750,
    "ALL DIMENSIONS IN mm / ILLUSTRATIVE VALUES ONLY",
    10,
    C.line,
  );
  p.panel(122, "KEY PLAN / SECTION LOCATION");
  for (let i = 0; i < 5; i++)
    p.line(930 + i * 54, 180, 930 + i * 54, 276, C.faint, 0.8);
  for (let i = 0; i < 4; i++)
    p.line(930, 180 + i * 32, 1146, 180 + i * 32, C.faint, 0.8);
  p.rect(930, 180, 216, 96, C.ink);
  p.rect(1128, 212, 18, 32, C.accent, 1, C.wash);
  p.text(
    930,
    301,
    frame ? "A-A / SLAB EDGE -> FW-01" : "A-A / EAST EDGE -> DETAIL 02",
    11,
    C.accent,
  );
  p.panel(326, "DRAWING KEY");
  [
    "Sxx   Slab zone reference",
    "Bxx   Beam reference",
    "OP-01 Service opening study",
    "A-A   Section location",
  ].forEach((v, i) => p.text(902, 371 + i * 23, v, 11));
  p.panel(475, "02 / EDGE SECTION A-A");
  p.poly(
    [
      [925, 530],
      [1178, 530],
      [1178, 552],
      [1075, 552],
      [1075, 615],
      [1033, 615],
      [1033, 552],
      [925, 552],
    ],
    C.ink,
    1.6,
  );
  p.poly(
    [
      [941, 538],
      [1167, 538],
      [1167, 545],
      [941, 545],
    ],
    C.accent,
    1.5,
  );
  p.line(1042, 541, 1042, 608, C.accent);
  p.line(1066, 541, 1066, 608, C.accent);
  for (let y = 568; y < 608; y += 12) p.line(1040, y, 1068, y, C.line, 0.7);
  p.text(925, 644, "SLAB / SUPPORT RELATIONSHIP", 10, C.line);
}

function section(p, x, y, label) {
  p.text(x, y - 22, label, 12, C.accent);
  p.poly(
    [
      [x, y],
      [x + 174, y],
      [x + 174, y + 28],
      [x + 128, y + 28],
      [x + 128, y + 174],
      [x + 46, y + 174],
      [x + 46, y + 28],
      [x, y + 28],
    ],
    C.ink,
    1.6,
    true,
  );
  p.hatch(x, y, 174, 10, 9);
  p.rect(x + 56, y + 13, 62, 149, C.accent, 1.4);
  for (const yy of [y + 23, y + 151])
    for (const xx of [x + 64, x + 87, x + 110])
      p.circle(xx, yy, 3, C.accent, 1, C.accent);
  p.line(x + 34, y + 88, x + 142, y + 88, C.faint, 0.6, true);
  p.dim(x + 46, x + 128, y + 201, "300", y + 177);
}
function beam(p) {
  p.text(60, 136, "01 / TWO-SPAN BEAM ELEVATION", 14);
  const supports = [124, 444, 784];
  supports.forEach((x, i) => {
    p.line(x, 178, x, 425, C.faint, 0.7, true);
    p.tag(x, 182, String(i + 1), C.line);
    p.rect(x - 16, 252, 32, 177, C.line, 1.2, C.wash);
    p.hatch(x - 15, 377, 30, 50);
  });
  p.rect(108, 252, 692, 120, C.ink, 1.8, C.paper);
  for (const y of [271, 278, 347, 354])
    p.poly(
      [
        [118, y + (y < 300 ? 14 : -14)],
        [118, y],
        [790, y],
        [790, y + (y < 300 ? 14 : -14)],
      ],
      C.accent,
      1.6,
    );
  for (
    let x = 132;
    x < 790;
    x += x < 220 || (x > 380 && x < 510) || x > 710 ? 12 : 25
  )
    p.rect(x, 265, 4, 94, C.line, 0.65);
  p.poly(
    [
      [376, 283],
      [376, 265],
      [512, 265],
      [512, 283],
    ],
    C.accent,
    2,
  );
  p.text(250, 240, "R01 / TOP CONTINUOUS", 10, C.accent);
  p.text(338, 397, "R02 / BOTTOM CONTINUOUS", 10, C.accent);
  p.text(563, 316, "B02", 12, C.line);
  p.text(271, 316, "B01", 12, C.line);
  p.dim(124, 444, 217, "6 400", 246);
  p.dim(444, 784, 217, "6 800", 246);
  p.dim(124, 220, 440, "ZONE 1", 374);
  p.dim(220, 380, 440, "ZONE 2", 374);
  p.dim(380, 512, 440, "ZONE 1", 374);
  for (const [x, label] of [
    [275, "A"],
    [445, "B"],
  ]) {
    p.line(x, 242, x, 382, C.accent, 0.9, true);
    p.tag(x, 462, label);
  }
  section(p, 100, 536, "02 / SECTION A-A");
  section(p, 350, 536, "03 / SECTION B-B");
  p.text(606, 514, "04 / SUPPORT ZONE", 12, C.accent);
  p.rect(630, 552, 120, 156, C.line, 1.4);
  p.rect(606, 552, 170, 40, C.line, 1.4, C.paper);
  p.poly(
    [
      [616, 562],
      [739, 562],
      [739, 687],
    ],
    C.accent,
    2,
  );
  p.poly(
    [
      [616, 580],
      [654, 580],
      [654, 696],
    ],
    C.accent,
    2,
  );
  for (let y = 605; y < 690; y += 12) p.rect(646, y, 97, 3, C.line, 0.6);
  p.text(606, 743, "ANCHORAGE STUDY / NTS", 10, C.line);
  p.panel(122, "REINFORCEMENT REFERENCES");
  [
    "R01  Continuous top bars",
    "R02  Continuous bottom bars",
    "R03  Support-zone bars",
    "R04  Closed links",
    "R05  Local anchorage study",
  ].forEach((v, i) => p.text(902, 170 + i * 29, v, 11));
  p.panel(338, "BAR ARRANGEMENT / KEY");
  for (const [i, label] of [
    "Longitudinal reinforcement",
    "Transverse links",
    "Concrete outline",
  ].entries()) {
    p.line(
      904,
      384 + i * 35,
      950,
      384 + i * 35,
      i ? C.line : C.accent,
      i === 0 ? 2 : 1,
    );
    p.text(966, 388 + i * 35, label, 11, C.ink, "sans");
  }
  p.panel(500, "RELATED SHEETS");
  p.note(546, [
    "FW-S01 / Plan and grid location",
    "FW-S03 / Bar schedule layout",
    "FW-S05 / Column section study",
    "Section references belong to this sheet.",
  ]);
}

const bars = [
  ["R01", "Straight", 20, 8, 6400, 0, "B01 / TOP"],
  ["R02", "L-bar", 20, 8, 6100, 420, "B01 / BOT"],
  ["R03", "U-bar", 16, 12, 1800, 360, "B01 / SUP"],
  ["R04", "Link", 10, 48, 250, 500, "B01 / A-A"],
  ["R05", "L-bar", 16, 16, 1200, 480, "B01 / END"],
  ["R06", "Straight", 20, 8, 6800, 0, "B02 / TOP"],
  ["R07", "L-bar", 20, 8, 6500, 420, "B02 / BOT"],
  ["R08", "Link", 10, 52, 250, 500, "B02 / B-B"],
  ["R09", "Straight", 25, 16, 3200, 0, "C01 / VERT"],
  ["R10", "Link", 10, 32, 520, 520, "C01 / A-A"],
  ["R11", "U-bar", 12, 24, 900, 260, "EDGE / A-A"],
  ["R12", "L-bar", 12, 24, 1200, 300, "EDGE / A-A"],
];
function shape(p, type, x, y, scale = 1) {
  const paths = {
    Straight: [
      [0, 9],
      [74, 9],
    ],
    "L-bar": [
      [0, -7],
      [0, 11],
      [74, 11],
    ],
    "U-bar": [
      [0, -8],
      [0, 11],
      [74, 11],
      [74, -8],
    ],
    Link: [
      [0, -10],
      [0, 13],
      [70, 13],
      [70, -10],
      [0, -10],
      [8, -2],
    ],
  };
  p.poly(
    paths[type].map(([a, b]) => [x + a * scale, y + b * scale]),
    C.accent,
    1.5,
  );
}
function schedule(p) {
  p.text(60, 136, "01 / REINFORCEMENT SCHEDULE", 14);
  const cols = [60, 125, 271, 342, 405, 502, 599, 732, 842];
  p.rect(60, 168, 782, 510, C.line, 0.8);
  cols.slice(1, -1).forEach((x) => p.line(x, 168, x, 678, C.faint, 0.7));
  [
    "MARK",
    "SHAPE",
    "DIA.",
    "QTY",
    "A / mm",
    "B / mm",
    "REFERENCE",
    "REV",
  ].forEach((v, i) => p.text(cols[i] + 8, 194, v, 10));
  bars.forEach(([mark, type, dia, qty, a, b, ref], i) => {
    const y = 210 + i * 39;
    p.line(60, y, 842, y, C.faint, 0.7);
    p.text(68, y + 25, mark, 12);
    shape(p, type, 153, y + 20);
    [dia, qty, a, b || "-", ref, "01"].forEach((v, j) =>
      p.text(cols[j + 2] + 8, y + 25, String(v), 10),
    );
  });
  p.text(
    60,
    712,
    "EXAMPLE QUANTITIES / DIMENSIONS BEFORE BENDING ADJUSTMENTS",
    10,
    C.accent,
  );
  p.text(
    60,
    739,
    "Refer to beam and column studies for drawing-reference context.",
    12,
    C.line,
    "sans",
  );
  p.panel(122, "SHAPE DIMENSION CONVENTION");
  shape(p, "L-bar", 950, 225, 2);
  p.dim(950, 1098, 274, "A", 253);
  p.text(925, 232, "B", 12, C.accent);
  shape(p, "Link", 950, 363, 2);
  p.dim(950, 1090, 419, "A", 389);
  p.text(925, 371, "B", 12, C.accent);
  p.panel(463, "READ THE SCHEDULE");
  p.note(508, [
    "MARK links the bar to a drawing.",
    "DIA. is the example bar diameter in mm.",
    "QTY is an illustrative count.",
    "A and B describe the sketch dimensions.",
    "REV identifies the example revision.",
  ]);
}

function coordination(p) {
  p.text(60, 136, "01 / STRUCTURE + SERVICE INTERFACES", 14);
  const project = ([x, y, z]) => [
    426 + (x - y) * 67,
    526 + (x + y) * 20 - z * 72,
  ];
  const line3 = (a, b, c = C.line, w = 0.8) =>
    p.line(...project(a), ...project(b), c, w);
  const loop = (pts, c, w) => p.poly(pts.map(project), c, w, true);
  for (const z of [0, 1.4, 2.8, 4.2]) {
    loop(
      [
        [0, 0, z],
        [5, 0, z],
        [5, 3, z],
        [0, 3, z],
      ],
      C.ink,
      1.4,
    );
    loop(
      [
        [0, 0, z - 0.12],
        [5, 0, z - 0.12],
        [5, 3, z - 0.12],
        [0, 3, z - 0.12],
      ],
      C.faint,
      0.7,
    );
    for (let x = 1; x < 5; x++) line3([x, 0, z], [x, 3, z], C.faint);
    for (let y = 1; y < 3; y++) line3([0, y, z], [5, y, z], C.faint);
    for (let x = 0; x <= 5; x++)
      for (let y = 0; y <= 3; y++) {
        if (z < 4.2) {
          line3([x, y, z], [x, y, z + 1.4], C.line, 1.25);
          line3([x + 0.07, y, z], [x + 0.07, y, z + 1.4], C.faint);
        }
      }
  }
  for (let x = 0; x <= 5; x++) {
    const [px, py] = project([x, 3.35, -0.15]);
    p.tag(px, py + 13, String(x + 1), C.faint);
  }
  const routes = [
    [
      [-0.35, 0.6, 1.05],
      [5.45, 0.6, 1.05],
      [5.45, 2.3, 1.05],
    ],
    [
      [1.3, -0.4, 2.35],
      [1.3, 3.35, 2.35],
    ],
    [
      [3.4, -0.3, 2.35],
      [3.4, 3.2, 2.35],
    ],
  ];
  routes.forEach((route) => {
    p.poly(route.map(project), C.accent, 2.5);
    p.poly(
      route.map(([x, y, z]) => project([x, y, z + 0.08])),
      C.accent,
      0.8,
    );
  });
  for (const x of [0.6, 2.4, 4.2]) {
    line3([x, 0.6, 1.05], [x, 2.7, 1.05], C.accent, 1.3);
    line3([x, 2.7, 1.05], [x, 2.7, 0.7], C.accent, 1.3);
  }
  for (const [i, point] of [
    [0, [1.3, 1, 2.35]],
    [1, [3.4, 2, 2.35]],
    [2, [4.2, 0.6, 1.05]],
  ]) {
    const [x, y] = project(point);
    p.circle(x, y, 18, C.accent, 1, C.paper);
    p.tag(x, y, String(i + 1).padStart(2, "0"));
    p.poly(
      [
        [x + 18, y],
        [805, y - 26],
        [844, y - 26],
      ],
      C.accent,
      0.8,
    );
  }
  p.text(
    60,
    750,
    "AXONOMETRIC / COORDINATION STUDY / NOT TO SCALE",
    10,
    C.line,
  );
  p.panel(122, "INTERFACE REVIEW LOG");
  const issues = [
    ["01 / BEAM CROSSING", "Review route against structural depth."],
    ["02 / SERVICE RESERVATION", "Locate the opening in plan and section."],
    ["03 / BRANCH CONNECTION", "Review the local installation sequence."],
  ];
  issues.forEach(([title, desc], i) => {
    p.text(902, 177 + i * 75, title, 12, C.accent);
    p.text(902, 200 + i * 75, desc, 11, C.ink, "sans");
  });
  p.panel(393, "02 / LOCAL INTERFACE SECTION");
  p.poly(
    [
      [914, 461],
      [1193, 461],
      [1193, 479],
      [1092, 479],
      [1092, 538],
      [1042, 538],
      [1042, 479],
      [914, 479],
    ],
    C.ink,
    1.5,
  );
  p.rect(932, 552, 241, 24, C.accent, 1.5);
  p.line(958, 579, 958, 609, C.line);
  p.line(1144, 579, 1144, 609, C.line);
  p.text(924, 634, "STRUCTURE / RESERVED SERVICE ZONE", 10, C.line);
}

function column(p) {
  p.text(60, 136, "01 / COLUMN SECTION A-A", 14);
  p.rect(152, 230, 320, 320, C.ink, 2, C.wash);
  p.hatch(153, 231, 318, 22);
  p.hatch(153, 527, 318, 22);
  p.hatch(153, 253, 22, 274);
  p.hatch(449, 253, 22, 274);
  p.rect(178, 256, 268, 268, C.accent, 1.6);
  p.rect(184, 262, 256, 256, C.line, 0.7);
  p.rect(237, 256, 145, 268, C.accent, 1);
  p.rect(178, 315, 268, 145, C.accent, 1);
  for (let i = 0; i < 5; i++)
    for (let j = 0; j < 5; j++)
      if (i === 0 || i === 4 || j === 0 || j === 4)
        p.circle(194 + i * 59, 272 + j * 59, 5.5, C.ink, 1, C.ink);
  p.line(110, 390, 515, 390, C.faint, 0.7, true);
  p.line(312, 206, 312, 573, C.faint, 0.7, true);
  p.dim(152, 472, 197, "600", 226);
  p.dim(152, 178, 580, "c", 551);
  p.poly(
    [
      [440, 288],
      [510, 258],
      [537, 258],
    ],
    C.accent,
  );
  p.text(492, 241, "R09", 11, C.accent);
  p.text(128, 627, "02 / LINK + CROSS-TIE FORMS", 12, C.accent);
  shape(p, "Link", 152, 681, 1.4);
  shape(p, "U-bar", 334, 681, 1.4);
  p.text(152, 728, "R10 / PERIMETER", 10);
  p.text(334, 728, "INTERNAL TIE", 10);
  p.text(606, 178, "03 / CAGE ELEVATION", 12, C.accent);
  p.rect(618, 230, 142, 450, C.line, 1.5);
  for (const x of [635, 665, 713, 743]) p.line(x, 216, x, 694, C.accent, 1.6);
  for (let y = 242; y < 675; y += y < 330 || y > 585 ? 12 : 25)
    p.rect(629, y, 119, 4, C.line, 0.8);
  p.rect(590, 423, 198, 32, C.ink, 1.5, C.paper);
  p.hatch(591, 424, 196, 8);
  p.line(586, 538, 799, 538, C.accent, 1, true);
  p.tag(589, 517, "A");
  p.tag(798, 517, "A");
  p.text(620, 730, "LINK ZONES / INDICATIVE", 10, C.line);
  p.panel(122, "REINFORCEMENT KEY");
  p.note(172, [
    "R09 / Longitudinal bars",
    "R10 / Perimeter links",
    "Internal ties shown as a separate layer.",
    "c / Cover dimension - project specific.",
  ]);
  p.panel(298, "CONNECTION AT FLOOR LEVEL");
  p.rect(1008, 365, 112, 226, C.line, 1.2);
  p.rect(921, 431, 283, 29, C.ink, 1.5, C.paper);
  p.line(1030, 351, 1030, 607, C.accent, 2);
  p.line(1098, 351, 1098, 607, C.accent, 2);
  for (let y = 372; y < 590; y += 16)
    if (y < 425 || y > 465) p.line(1022, y, 1106, y, C.line, 0.8);
  p.text(924, 635, "SECTION CONTEXT / FLOOR + COLUMN", 10, C.line);
}

function register(p) {
  p.text(60, 136, "01 / DOCUMENT REGISTER", 14);
  const rows = [
    ["FW-M01", "Structural reference model", "MODEL", "IFC", "01"],
    ...sheets.map((s) => [s.reference, s.title, "STUDY", "PDF", "01"]),
    ["FW-R01", "Coordination issue register", "REVIEW", "XLSX", "00"],
    ["FW-R02", "Drawing revision record", "REVIEW", "XLSX", "00"],
    ["FW-D01", "Drawing reference map", "INDEX", "PDF", "00"],
    ["FW-Q01", "Quantity reconciliation", "REVIEW", "XLSX", "00"],
    ["FW-I01", "Package issue record", "INDEX", "PDF", "00"],
  ];
  const xs = [60, 160, 474, 568, 644, 711, 842];
  p.rect(60, 170, 782, 476, C.line, 0.8);
  xs.slice(1, -1).forEach((x) => p.line(x, 170, x, 646, C.faint, 0.7));
  [
    "REFERENCE",
    "DOCUMENT / DRAWING",
    "GROUP",
    "FORMAT",
    "REV",
    "STATUS",
  ].forEach((v, i) => p.text(xs[i] + 8, 196, v, 10));
  rows.forEach((row, i) => {
    const y = 214 + i * 36;
    p.line(60, y, 842, y, C.faint, 0.7);
    [...row, "EXAMPLE"].forEach((v, j) =>
      p.text(
        xs[j] + 8,
        y + 23,
        v,
        j === 1 ? 11 : 10,
        C.ink,
        j === 1 ? "sans" : "mono",
      ),
    );
  });
  p.text(
    60,
    691,
    "REFERENCE CHAIN / ONE SOURCE, CONNECTED RECORDS",
    11,
    C.accent,
  );
  const chain = [
    [60, "MODEL"],
    [266, "DRAWING"],
    [472, "SCHEDULE"],
    [678, "REGISTER"],
  ];
  chain.forEach(([x, label], i) => {
    p.rect(x, 715, 164, 40, C.line);
    p.text(x + 82, 740, label, 11, C.ink, "mono", "middle");
    if (i < 3) {
      p.line(x + 164, 735, x + 206, 735, C.accent);
      p.poly(
        [
          [x + 198, 730],
          [x + 206, 735],
          [x + 198, 740],
        ],
        C.accent,
      );
    }
  });
  p.panel(122, "PACKAGE REVIEW STAGES");
  [
    "01  Collect source information",
    "02  Check drawing references",
    "03  Reconcile revisions",
    "04  Record outstanding questions",
    "05  Prepare the issue index",
  ].forEach((v, i) => p.text(902, 175 + i * 34, v, 11));
  p.panel(373, "RELATED RECORDS");
  p.note(420, [
    "FW-S01 locates the structural bays.",
    "FW-S02 identifies beam sections and bars.",
    "FW-S03 links bar marks to references.",
    "FW-S04 records coordination interfaces.",
    "FW-S05 shows column reinforcement.",
    "FW-S06 organizes the sample package.",
  ]);
  p.text(902, 592, "STATUS: EXAMPLE", 13, C.accent);
  p.text(
    902,
    617,
    "Not issued, checked or approved for use.",
    11,
    C.ink,
    "sans",
  );
}

export async function prepareDrawingSheets() {
  await Promise.all(
    [
      "public/graphics/samples",
      "public/graphics/studies",
      "public/documents/samples",
    ].map((dir) => mkdir(dir, { recursive: true })),
  );
  const draws = {
    "slab-plan": floor,
    "beam-detail": beam,
    "bar-schedule": schedule,
    "coordination-view": coordination,
    "column-section": column,
    "handover-index": register,
  };
  for (const meta of sheets) await sheet(meta, draws[meta.id]);
  await sheet(
    {
      ...sheets[0],
      title: "The Frame / plan and section location",
      reference: "FW-01",
    },
    (p) => floor(p, true),
    { svgPath: "public/graphics/studies/frame-plan.svg", pdfPath: false },
  );
}

if (process.argv[1]?.replaceAll("\\", "/").endsWith("/drawing-sheets.mjs")) {
  await prepareDrawingSheets();
  console.log("Prepared seven vector drawing sheets and six matching PDFs.");
}
