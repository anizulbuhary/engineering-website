import { test, expect } from "@playwright/test";
import sharp from "sharp";
import model from "../content/engineering-model.json";
import { approachStory } from "./story-helpers";

test("published courtyard poster matches the actual opening model", async ({
  page,
  request,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  await approachStory(page);
  const canvas = page.locator(".engineering-canvas.is-ready canvas");
  await expect(canvas).toBeVisible({ timeout: 30000 });
  await expect(canvas).toHaveAttribute("data-progress", "0.0000");
  await page.getByRole("button", { name: "Pause motion" }).click();
  const still = page.locator(".story-paused-image img");
  await expect(still).toBeVisible();
  const source = await still.getAttribute("src");
  expect(source).toMatch(/^data:image\/png;base64,/);
  const poster = await request.get(model.poster);
  expect(poster.ok()).toBe(true);
  const normalize = (input: Buffer) =>
    sharp(input)
      .flatten({ background: "#191b19" })
      .raw()
      .toBuffer({ resolveWithObject: true });
  const actual = await normalize(Buffer.from(source!.split(",")[1], "base64"));
  const expected = await normalize(await poster.body());
  expect(actual.info.width).toBe(expected.info.width);
  expect(actual.info.height).toBe(expected.info.height);
  expect(actual.data.length).toBe(expected.data.length);
  const difference =
    actual.data.reduce(
      (sum, value, index) => sum + Math.abs(value - expected.data[index]),
      0,
    ) / actual.data.length;
  expect(difference).toBeLessThan(1);
});

test("an unreadable model preserves the courtyard poster and all six chapters", async ({
  page,
}) => {
  await page.route(`**${model.model}`, (route) =>
    route.fulfill({
      status: 200,
      contentType: "model/gltf-binary",
      body: Buffer.from("unreadable model"),
    }),
  );
  await page.goto("/");
  await approachStory(page);
  await expect(page.locator(".story-static-chapters article")).toHaveCount(6);
  await expect(page.locator("#engineering-story canvas")).toHaveCount(0);
  await expect(page.locator(".story-static-poster img")).toHaveAttribute(
    "alt",
    /Courtyard House/,
  );
  await expect(page.locator(".story-static-poster img")).toBeVisible();
});
