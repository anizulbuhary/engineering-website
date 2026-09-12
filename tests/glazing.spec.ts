import { test, expect } from "@playwright/test";
import sharp from "sharp";
import model from "../content/engineering-model.json";
import { approachStory } from "./story-helpers";

// Like the exported building, both meshes have world-space vertices and share
// an origin. A wall behind glass must not erase it when export order changes.
function glazingFixture(glassFirst: boolean, includeGlass = true) {
  const positions = (z: number) => [
    -2,
    3,
    z,
    2,
    3,
    z,
    2,
    7,
    z,
    -2,
    3,
    z,
    2,
    7,
    z,
    -2,
    7,
    z,
  ];
  const data = Buffer.from(
    new Float32Array([
      ...positions(0),
      ...positions(0.2),
      ...Array.from({ length: 12 }, () => [0, 0, 1]).flat(),
    ]).buffer,
  );
  const order = includeGlass ? (glassFirst ? [1, 0] : [0, 1]) : [0];
  return {
    asset: { version: "2.0" },
    scene: 0,
    scenes: [{ nodes: order.map((_, i) => i) }],
    nodes: order.map((mesh) => ({
      mesh,
      extras: { system: "facade", level: 0 },
    })),
    buffers: [
      {
        byteLength: data.length,
        uri: `data:application/octet-stream;base64,${data.toString("base64")}`,
      },
    ],
    bufferViews: [0, 72, 144].map((byteOffset, i) => ({
      buffer: 0,
      byteOffset,
      byteLength: i === 2 ? 144 : 72,
    })),
    accessors: [0, 1]
      .map((bufferView) => ({
        bufferView,
        componentType: 5126,
        count: 6,
        type: "VEC3",
        min: [-2, 3, bufferView * 0.2],
        max: [2, 7, bufferView * 0.2],
      }))
      .concat([
        {
          bufferView: 2,
          componentType: 5126,
          count: 6,
          type: "VEC3",
          min: [0, 0, 1],
          max: [0, 0, 1],
        },
      ]),
    materials: [
      {
        pbrMetallicRoughness: {
          baseColorFactor: [0.8, 0.6, 0.4, 1],
          metallicFactor: 0,
          roughnessFactor: 0.8,
        },
      },
      {
        alphaMode: "BLEND",
        pbrMetallicRoughness: {
          baseColorFactor: [0.085, 0.105, 0.095, 0.78],
          metallicFactor: 0.25,
          roughnessFactor: 0.14,
        },
      },
    ],
    meshes: [0, 1].map((material) => ({
      primitives: [{ attributes: { POSITION: material, NORMAL: 2 }, material }],
    })),
  };
}

test("glazing stays visible regardless of interior mesh export order", async ({
  browser,
}) => {
  const captures: Buffer[] = [];
  for (const [glassFirst, includeGlass] of [
    [true, true],
    [false, true],
    [false, false],
  ]) {
    const context = await browser.newContext({
      viewport: { width: 1440, height: 900 },
    });
    try {
      const page = await context.newPage();
      await page.route(`**${model.model}`, (route) =>
        route.fulfill({
          contentType: "model/gltf+json",
          body: JSON.stringify(glazingFixture(glassFirst, includeGlass)),
        }),
      );
      await page.goto("/");
      await approachStory(page);
      await expect(
        page.locator(".engineering-canvas.is-ready canvas"),
      ).toHaveAttribute("data-progress", "0.0000", { timeout: 30000 });
      await page.getByRole("button", { name: "Pause motion" }).click();
      const still = page.locator(".story-paused-image img");
      await expect(still).toBeVisible();
      const source = await still.getAttribute("src");
      expect(source).toMatch(/^data:image\/png;base64,/);
      const input = Buffer.from(source!.split(",")[1], "base64");
      const { width, height } = await sharp(input).metadata();
      captures.push(
        await sharp(input)
          .flatten({ background: "#191b19" })
          .extract({
            left: Math.floor(width! * 0.46),
            top: Math.floor(height! * 0.46),
            width: Math.floor(width! * 0.08),
            height: Math.floor(height! * 0.08),
          })
          .raw()
          .toBuffer(),
      );
    } finally {
      await context.close();
    }
  }
  const difference = (a: Buffer, b: Buffer) =>
    a.reduce((sum, v, i) => sum + Math.abs(v - b[i]), 0) / a.length;
  expect(difference(captures[0], captures[1])).toBeLessThan(0.1);
  // Matching two absent panes would be a false positive: the glass must tint
  // the visible interior, compared with the same fixture with no glass.
  expect(difference(captures[0], captures[2])).toBeGreaterThan(8);
});
