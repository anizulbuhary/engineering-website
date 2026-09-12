import { test, expect, type Page } from "@playwright/test";
import { approachStory } from "./story-helpers";

async function scrollStory(page: Page, progress: number) {
  await page.locator("#engineering-story").evaluate((element, value) => {
    const stage = element.querySelector(".engineering-stage") as HTMLElement;
    const header = document
      .querySelector(".site-header")!
      .getBoundingClientRect().height;
    scrollTo({
      top:
        element.getBoundingClientRect().top +
        scrollY -
        header +
        (element.clientHeight - stage.clientHeight) * value,
      behavior: "instant",
    });
  }, progress);
}

for (const width of [390, 768, 1440]) {
  test(`scroll wakes the building with delayed visibility notifications at ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 900 });
    // Fault injection: suppress only the renderer's visibility callbacks.
    // Loading and ordinary page observers still use the real browser observer.
    await page.addInitScript(() => {
      const NativeObserver = window.IntersectionObserver;
      window.IntersectionObserver = class extends NativeObserver {
        constructor(
          callback: IntersectionObserverCallback,
          options?: IntersectionObserverInit,
        ) {
          super((entries, observer) => {
            const forwarded = entries.filter(
              (entry) => !entry.target.classList.contains("engineering-canvas"),
            );
            if (forwarded.length) callback(forwarded, observer);
          }, options);
        }
      };
    });
    await page.goto("/");
    await approachStory(page);
    const canvas = page.locator(".engineering-canvas.is-ready canvas");
    await expect(canvas).toBeVisible();
    for (const progress of [0.36, 0.72, 0.18]) {
      await scrollStory(page, progress);
      await expect
        .poll(async () => Number(await canvas.getAttribute("data-progress")))
        .toBeCloseTo(progress, 2);
    }
    await page.evaluate(() => scrollTo({ top: 0, behavior: "instant" }));
    await scrollStory(page, 0.5);
    await expect
      .poll(async () => Number(await canvas.getAttribute("data-progress")))
      .toBeCloseTo(0.5, 2);
  });
}

test("late model loading and interrupted rewind keep following normal scroll", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  let release!: () => void;
  const pending = new Promise<void>((resolve) => {
    release = resolve;
  });
  await page.route("**/models/formwork-courtyard.glb", async (route) => {
    await pending;
    await route.continue();
  });
  await page.goto("/");
  await approachStory(page);
  await scrollStory(page, 0.6);
  release();
  const canvas = page.locator(".engineering-canvas.is-ready canvas");
  await expect(canvas).toBeVisible();
  await expect
    .poll(async () => Number(await canvas.getAttribute("data-progress")))
    .toBeCloseTo(0.6, 2);
  await page.getByRole("button", { name: "Pause motion" }).click();
  await expect(page.locator("#engineering-story")).toHaveAttribute(
    "data-returning",
    "true",
  );
  await page.keyboard.press("Escape");
  await expect(page.locator("#engineering-story")).not.toHaveAttribute(
    "data-returning",
  );
  for (const progress of [0.85, 0.2, 0.65]) {
    await scrollStory(page, progress);
    await expect
      .poll(async () => Number(await canvas.getAttribute("data-progress")))
      .toBeCloseTo(progress, 2);
  }
});

test("an interrupted resume keeps the static view and can be retried", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  await approachStory(page);
  const section = page.locator("#engineering-story");
  await expect(
    page.locator(".engineering-canvas.is-ready canvas"),
  ).toBeVisible();
  await page.getByRole("button", { name: "Pause motion" }).click();
  await expect(section).toHaveClass(/is-paused/);
  await page.evaluate(() => scrollBy({ top: -240, behavior: "instant" }));
  await page.getByRole("button", { name: "Resume motion" }).click();
  await expect(section).toHaveAttribute("data-returning", "true");
  await page.keyboard.press("Escape");
  await expect(section).not.toHaveAttribute("data-returning");
  await expect(section).toHaveClass(/is-paused/);
  await expect(section.locator("canvas")).toHaveCount(0);
  await expect(section.locator(".story-paused-image img")).toBeVisible();
  await page.getByRole("button", { name: "Resume motion" }).click();
  await expect(section).toHaveClass(/is-immersive/);
  await expect(
    page.locator(".engineering-canvas.is-ready canvas"),
  ).toBeVisible();
  await scrollStory(page, 0.4);
  await expect
    .poll(async () =>
      Number(await section.locator("canvas").getAttribute("data-progress")),
    )
    .toBeCloseTo(0.4, 2);
});
