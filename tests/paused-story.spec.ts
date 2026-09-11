import { test, expect } from "@playwright/test";
import sharp from "sharp";
import AxeBuilder from "@axe-core/playwright";

for (const width of [390, 1440]) {
  test(`pause visibly rewinds into the matching static opening at ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    await page.getByRole("link", { name: "Enter the experience" }).click();
    const section = page.locator("#engineering-story");
    const canvas = section.locator("canvas");
    await expect(
      page.locator(".engineering-canvas.is-ready canvas"),
    ).toBeVisible();
    await expect(canvas).toHaveAttribute("data-progress", "0.0000");
    await expect(section.locator(".engineering-canvas")).toHaveCSS(
      "opacity",
      "1",
    );
    const visualBounds = await section
      .locator(".engineering-visual")
      .boundingBox();
    if (!visualBounds) throw new Error("Missing model viewport");
    const clip = {
      x: Math.ceil(Math.max(width < 600 ? 22 : width * 0.5, visualBounds.x)),
      y: Math.ceil(Math.max(180, visualBounds.y)),
      width: 0,
      height: 0,
    };
    clip.width = Math.floor(
      Math.min(width - 22, visualBounds.x + visualBounds.width) - clip.x,
    );
    clip.height = Math.floor(
      Math.min(750, visualBounds.y + visualBounds.height) - clip.y,
    );
    const opening = await page.screenshot({
      clip,
      path: `artifacts/opening-pixels-${width}.png`,
    });
    await section.evaluate((el) => {
      const stage = el.querySelector(".engineering-stage") as HTMLElement;
      scrollTo({
        top:
          el.getBoundingClientRect().top +
          scrollY -
          88 +
          (el.clientHeight - stage.clientHeight) * 0.8,
        behavior: "instant",
      });
    });
    await expect(
      page.getByRole("button", { name: "Chapter 5: DOCUMENTATION" }),
    ).toHaveAttribute("aria-current", "step");
    await expect
      .poll(async () => Number(await canvas.getAttribute("data-progress")))
      .toBeGreaterThan(0.7);
    await canvas.evaluate((el) => {
      const samples: number[] = [];
      const observer = new MutationObserver(() => {
        samples.push(Number(el.getAttribute("data-progress")));
        document.documentElement.dataset.returnSamples =
          JSON.stringify(samples);
      });
      observer.observe(el, {
        attributes: true,
        attributeFilter: ["data-progress"],
      });
    });
    await page.getByRole("button", { name: "Pause motion" }).click();
    await expect(section).toHaveClass(/is-paused/);
    await expect(canvas).toHaveCount(0);
    const samples: number[] = JSON.parse(
      (await page.locator("html").getAttribute("data-return-samples")) ?? "[]",
    );
    // A visible rewind has multiple intermediate frames, not a snap to zero.
    expect(
      new Set(samples.filter((value) => value > 0.02 && value < 0.65)).size,
    ).toBeGreaterThan(3);
    const before = await sharp(opening).removeAlpha().raw().toBuffer();
    await expect(section.locator(".story-paused-image img")).toHaveAttribute(
      "src",
      /^data:image\/png;base64,/,
    );
    await section
      .locator(".story-paused-image img")
      .evaluate((el) => (el as HTMLImageElement).decode());
    const after = await sharp(
      await page.screenshot({
        clip,
        path: `artifacts/paused-pixels-${width}.png`,
      }),
    )
      .removeAlpha()
      .raw()
      .toBuffer();
    expect(after.length).toBe(before.length);
    const difference =
      after.reduce(
        (sum, value, index) => sum + Math.abs(value - before[index]),
        0,
      ) / after.length;
    // Allow subpixel rasterization, while rejecting changed lighting, pose or framing.
    expect(difference).toBeLessThan(1);
    await expect(
      section.locator(
        ".story-chapters button, .story-progress, .story-static-chapters",
      ),
    ).toHaveCount(0);
    await expect(section.locator(".story-chapters li")).toHaveCount(6);
    await expect(section.locator(".story-chapters li").first()).toHaveAttribute(
      "aria-current",
      "step",
    );
    const poster = section.locator(".story-paused-image img");
    await expect(poster).toBeVisible();
    await expect
      .poll(() =>
        poster.evaluate((el) => (el as HTMLImageElement).naturalWidth),
      )
      .toBeGreaterThan(0);
    await expect(section.locator(".engineering-stage")).toHaveCSS(
      "position",
      "relative",
    );
    expect(await section.evaluate((el) => el.clientHeight)).toBeLessThan(1100);
    await expect
      .poll(() =>
        section.evaluate((el) => Math.round(el.getBoundingClientRect().top)),
      )
      .toBe(88);
    await page.screenshot({ path: `artifacts/static-pause-${width}.png` });
    const top = await section.evaluate((el) => el.getBoundingClientRect().top);
    await page.evaluate(() => scrollBy({ top: 300, behavior: "instant" }));
    await expect
      .poll(() => section.evaluate((el) => el.getBoundingClientRect().top))
      .toBeCloseTo(top - 300, 0);
    expect(
      (await new AxeBuilder({ page }).include("#engineering-story").analyze())
        .violations,
    ).toEqual([]);
    await page.getByRole("button", { name: "Resume motion" }).click();
    await expect(section).toHaveClass(/is-immersive/);
    await expect(
      page.locator(".engineering-canvas.is-ready canvas"),
    ).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Chapter 1: INITIAL FORM" }),
    ).toHaveAttribute("aria-current", "step");
    await expect
      .poll(() =>
        section.evaluate((el) => Math.round(el.getBoundingClientRect().top)),
      )
      .toBe(88);
    await expect(canvas).toHaveAttribute("data-progress", "0.0000");
    await page.waitForTimeout(500);
    await expect(canvas).toHaveAttribute("data-progress", "0.0000");
    await page.evaluate(() => scrollBy({ top: 400, behavior: "instant" }));
    await expect
      .poll(async () => Number(await canvas.getAttribute("data-progress")))
      .toBeGreaterThan(0.05);
  });
}
