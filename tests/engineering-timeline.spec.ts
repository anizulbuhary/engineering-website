import { test, expect } from "@playwright/test";
import { sampleEngineeringTimeline as sample } from "../lib/engineering-timeline";
import { readFileSync } from "node:fs";
import model from "../content/engineering-model.json";

test("a small opening scroll keeps the building assembled while the camera moves", () => {
  for (const progress of [0, 0.01, 0.03, 0.06]) {
    expect(sample(progress)).toMatchObject({ facade: 1, solid: 1, spread: 0 });
  }
  expect(sample(0.03).angle).toBeGreaterThan(sample(0).angle);
  expect(sample(0.1).facade).toBeGreaterThan(0.85);
  expect(sample(0.2)).toMatchObject({ facade: 0, solid: 1, spread: 0.28 });
});

test("the completed building returns before the end and the camera settles gently", () => {
  for (const progress of [0.94, 0.96, 0.98, 1]) {
    const state = sample(progress);
    expect(state.facade).toBeCloseTo(1, 10);
    expect(state.solid).toBeCloseTo(1, 10);
    expect(state.spread).toBeCloseTo(0, 10);
    expect(state.drawing).toBeCloseTo(0, 10);
  }
  expect(sample(1).angle - sample(0.98).angle).toBeLessThan(0.04);
  // Visibility remains continuous when the scroll direction changes.
  for (const boundary of [0.06, 0.2, 0.4, 0.6, 0.8, 0.94]) {
    const before = sample(boundary - 0.00001);
    const after = sample(boundary + 0.00001);
    for (const key of Object.keys(before) as (keyof typeof before)[]) {
      expect(Math.abs(after[key] - before[key])).toBeLessThan(0.005);
    }
  }
});

test("the actual model keeps architectural frame parts separate from glazing on every floor", () => {
  const glb = readFileSync(`public${model.model}`);
  const jsonLength = glb.readUInt32LE(12);
  const gltf = JSON.parse(glb.subarray(20, 20 + jsonLength).toString("utf8"));
  const frames = gltf.nodes.filter(
    (node: { extras?: { animationRole?: string } }) =>
      node.extras?.animationRole === "frame",
  );
  expect(
    frames
      .map((node: { extras: { level: number } }) => node.extras.level)
      .sort(),
  ).toEqual([0, 1, 2, 3, 4, 5]);
  for (const node of frames) {
    expect(node.extras.system).toBe("facade");
    for (const primitive of gltf.meshes[node.mesh].primitives) {
      expect(gltf.materials[primitive.material].alphaMode ?? "OPAQUE").toBe(
        "OPAQUE",
      );
    }
  }
});
