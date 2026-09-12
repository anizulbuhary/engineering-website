import { test, expect } from "@playwright/test";
import { approachStory } from "./story-helpers";

test("restoring motion shows the poster until the replacement scene is ready", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  await approachStory(page);
  await expect(page.locator(".engineering-canvas.is-ready canvas")).toBeVisible(
    { timeout: 30000 },
  );
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(page.locator("#engineering-story canvas")).toHaveCount(0);
  let release!: () => void;
  const gate = new Promise<void>((resolve) => {
    release = resolve;
  });
  await page.route("**/models/formwork-courtyard.glb", async (route) => {
    await gate;
    await route.continue();
  });
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await approachStory(page);
  await expect(page.locator(".story-poster")).toBeVisible();
  await expect(page.locator(".engineering-canvas")).not.toHaveClass(/is-ready/);
  release();
  await expect(page.locator(".engineering-canvas.is-ready canvas")).toBeVisible(
    { timeout: 30000 },
  );
});

test("cold loading begins before entry and swaps a complete frame at the latest scroll position", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  let release!: () => void;
  const gate = new Promise<void>((resolve) => {
    release = resolve;
  });
  await page.route("**/models/formwork-courtyard.glb", async (route) => {
    await gate;
    await route.continue();
  });
  const requested = page.waitForRequest("**/models/formwork-courtyard.glb");
  await page.goto("/");
  await page.locator("#engineering-story").evaluate((el) => {
    scrollTo({
      top: el.getBoundingClientRect().top + scrollY - innerHeight - 500,
      behavior: "instant",
    });
  });
  await requested;
  expect(
    await page
      .locator("#engineering-story")
      .evaluate((el) => el.getBoundingClientRect().top),
  ).toBeGreaterThan(900);
  await approachStory(page);
  await page.locator("#engineering-story").evaluate((el) => {
    scrollBy({
      top:
        (el.clientHeight -
          el.querySelector(".engineering-stage")!.clientHeight) *
        0.5,
      behavior: "instant",
    });
  });
  await expect(page.getByRole("status")).toHaveText("PREPARING MODEL…");
  await expect(page.locator(".story-poster")).toBeVisible();
  await page.evaluate(() => {
    const host = document.querySelector(".engineering-canvas")!;
    const observer = new MutationObserver(() => {
      if (!host.classList.contains("is-ready")) return;
      // Inspect the very first style update, before any CSS fade could finish.
      document.documentElement.dataset.firstCanvasOpacity =
        getComputedStyle(host).opacity;
      document.documentElement.dataset.firstCanvasProgress =
        host.querySelector("canvas")!.dataset.progress;
      observer.disconnect();
    });
    observer.observe(host, { attributes: true, attributeFilter: ["class"] });
  });
  release();
  await expect(page.locator(".engineering-canvas.is-ready canvas")).toBeVisible(
    { timeout: 30000 },
  );
  await expect(page.locator("html")).toHaveAttribute(
    "data-first-canvas-opacity",
    "1",
  );
  expect(
    Number(
      await page.locator("html").getAttribute("data-first-canvas-progress"),
    ),
  ).toBeCloseTo(0.5, 2);
  await expect(page.getByRole("status")).toHaveText("SCROLL TO REVEAL");
});

test("viewport changes repaint the live drawing buffer before the resize callback returns", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 900 });
  await page.addInitScript(() => {
    const NativeObserver = window.ResizeObserver;
    window.ResizeObserver = class extends NativeObserver {
      constructor(callback: ResizeObserverCallback) {
        super((entries, observer) => {
          callback(entries, observer);
          for (const entry of entries) {
            if (!entry.target.matches(".engineering-canvas.is-ready")) continue;
            const canvas = entry.target.querySelector("canvas")!;
            const gl = canvas.getContext("webgl2")!;
            const pixels = new Uint8Array(
              gl.drawingBufferWidth * gl.drawingBufferHeight * 4,
            );
            gl.readPixels(
              0,
              0,
              gl.drawingBufferWidth,
              gl.drawingBufferHeight,
              gl.RGBA,
              gl.UNSIGNED_BYTE,
              pixels,
            );
            let painted = 0;
            for (let i = 3; i < pixels.length; i += 4)
              if (pixels[i] > 0) painted++;
            document.documentElement.dataset.resizePaintedPixels =
              String(painted);
          }
        });
      }
    };
  });
  await page.goto("/");
  await approachStory(page);
  await expect(page.locator(".engineering-canvas.is-ready canvas")).toBeVisible(
    { timeout: 30000 },
  );
  for (const height of [820, 940, 860]) {
    await page
      .locator("html")
      .evaluate((el) => delete el.dataset.resizePaintedPixels);
    await page.setViewportSize({ width: 390, height });
    await expect
      .poll(async () =>
        Number(
          await page.locator("html").getAttribute("data-resize-painted-pixels"),
        ),
      )
      .toBeGreaterThan(100);
  }
});
