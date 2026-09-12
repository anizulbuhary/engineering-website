import { test, expect } from "@playwright/test";
import { approachStory } from "./story-helpers";
import AxeBuilder from "@axe-core/playwright";

for (const viewport of [
  { width: 375, height: 667 },
  { width: 430, height: 932 },
]) {
  test(`live building works on a ${viewport.width}px touch viewport`, async ({
    browser,
  }) => {
    const context = await browser.newContext({
      viewport,
      isMobile: true,
      hasTouch: true,
      deviceScaleFactor: 3,
    });
    const page = await context.newPage();
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.goto("http://localhost:3000");
    await approachStory(page);
    const canvas = page.locator(".engineering-canvas.is-ready canvas");
    await expect(canvas).toBeVisible({ timeout: 30000 });
    await expect(page.locator(".story-poster")).toHaveCSS(
      "visibility",
      "hidden",
    );
    await expect(page.locator(".story-poster")).toHaveAttribute(
      "src",
      /pavilion-studio/,
    );
    const start = await page.screenshot();
    for (const index of [1, 2, 3, 4, 5, 3, 0]) {
      const chapter = page.getByRole("button", {
        name: new RegExp(`Chapter ${index + 1}:`),
      });
      await chapter.tap();
      await expect(chapter).toHaveAttribute("aria-current", "step");
      await expect
        .poll(async () => Number(await canvas.getAttribute("data-progress")))
        .toBeCloseTo(index / 5, 2);
      if (index === 3)
        expect((await page.screenshot()).equals(start)).toBe(false);
    }
    // Swipe-equivalent ordinary scrolling also drives the same timeline.
    await page.evaluate(() =>
      window.scrollBy({ top: 300, behavior: "instant" }),
    );
    await expect
      .poll(async () => Number(await canvas.getAttribute("data-progress")))
      .toBeGreaterThan(0.05);
    expect(
      await canvas.evaluate(
        (el) =>
          (el as HTMLCanvasElement).width <=
          el.getBoundingClientRect().width + 1,
      ),
    ).toBe(true);
    expect(
      (await new AxeBuilder({ page }).include("#engineering-story").analyze())
        .violations,
    ).toEqual([]);
    await page.getByRole("button", { name: "Pause motion" }).tap();
    await expect(canvas).toHaveCount(0);
    await expect(page.locator(".story-paused-image img")).toBeVisible();
    await expect(page.locator("#engineering-story")).toHaveClass(/is-paused/);
    await page.getByRole("button", { name: "Resume motion" }).tap();
    await expect(canvas).toBeVisible();
    await page.setViewportSize({
      width: viewport.height,
      height: viewport.width,
    });
    await expect(canvas).toBeVisible();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    expect(errors).toEqual([]);
    await context.close();
  });
}

test("mobile graphics failure keeps the six readable chapters", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.route("**/models/formwork-pavilion.glb", (route) => route.abort());
  await page.goto("/");
  await approachStory(page);
  await expect(page.locator(".story-static-chapters article")).toHaveCount(6);
  await expect(page.locator("#engineering-story canvas")).toHaveCount(0);
});
