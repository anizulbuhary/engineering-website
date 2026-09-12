import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test("detail draws on entry once and respects live reduced motion", async ({
  page,
}) => {
  await page.goto("/");
  const drawing = page.locator(".detail-drawing");
  await expect(drawing).not.toHaveAttribute("data-drawn");
  await drawing.scrollIntoViewIfNeeded();
  await expect(drawing).toHaveAttribute("data-drawn", "true");
  const progress = await drawing.evaluate((svg) => {
    const animations = svg
      .getAnimations({ subtree: true })
      .filter((animation) => animation.id === "detail-draw");
    // Freeze at an intermediate moment to inspect the actual rendered strokes.
    animations.forEach((animation) => {
      animation.pause();
      animation.currentTime = 600;
    });
    const outline = getComputedStyle(
      svg.querySelector(".detail-interface path")!,
    );
    const annotation = getComputedStyle(
      svg.querySelector(".detail-type text")!,
    );
    return {
      count: animations.length,
      dash: parseFloat(outline.strokeDashoffset),
      labelOpacity: annotation.opacity,
    };
  });
  expect(progress.count).toBeGreaterThan(20);
  expect(progress.dash).toBeGreaterThan(0);
  expect(progress.labelOpacity).toBe("0");
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(drawing.locator(".detail-interface path").first()).toHaveCSS(
    "stroke-dashoffset",
    "0px",
  );
  await expect(drawing.locator(".detail-type text").first()).toHaveCSS(
    "opacity",
    "1",
  );
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.evaluate(() => window.scrollTo(0, 0));
  await drawing.scrollIntoViewIfNeeded();
  expect(
    await drawing.evaluate(
      (svg) => svg.getAnimations({ subtree: true }).length,
    ),
  ).toBe(0);
});

test("reduced motion starts with a complete drawing", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/samples");
  const drawing = page.locator(".detail-drawing");
  await drawing.scrollIntoViewIfNeeded();
  expect(
    await drawing.evaluate(
      (svg) => svg.getAnimations({ subtree: true }).length,
    ),
  ).toBe(0);
  await expect(drawing.locator(".detail-type text").first()).toHaveCSS(
    "opacity",
    "1",
  );
});

for (const width of [375, 768, 1440]) {
  test(`detail selection stays stable and accessible at ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 1000 });
    await page.goto("/");
    const detail = page.locator(".detail-explorer");
    await detail.scrollIntoViewIfNeeded();
    const first = detail.locator('input[value="interface"]');
    await first.focus();
    await expect(first).toBeChecked();
    const box = await detail.boundingBox();
    await first.press("ArrowRight");
    await expect(detail.locator('input[value="reinforcement"]')).toBeChecked();
    await expect(detail.locator(".explanation-reinforcement")).toBeVisible();
    await expect(detail.locator(".explanation-interface")).not.toBeVisible();
    await expect(detail.locator(".detail-reinforcement")).toHaveCSS(
      "opacity",
      "1",
    );
    await detail.locator('input[value="reinforcement"]').press("ArrowRight");
    await expect(detail.locator(".explanation-reference")).toBeVisible();
    await expect(detail.locator(".detail-reference")).toHaveCSS("opacity", "1");
    const after = await detail.boundingBox();
    expect(Math.abs(after!.height - box!.height)).toBeLessThan(1);
    expect(Math.abs(after!.y - box!.y)).toBeLessThan(1);
    await page.emulateMedia({ reducedMotion: "reduce" });
    await detail.locator(".detail-selector").first().click();
    await expect(first).toBeChecked();
    await expect(detail.locator(".detail-interface")).toHaveCSS(
      "transition-property",
      "none",
    );
    expect(
      (await new AxeBuilder({ page }).include(".detail-explorer").analyze())
        .violations,
    ).toEqual([]);
  });
}

test("the project dossier connects to services and sample outputs", async ({
  page,
}) => {
  await page.goto("/projects/the-frame#study");
  await expect(page).toHaveURL(/\/projects\/the-frame#study$/);
  await expect(page.locator("#study")).toBeVisible();
  await expect(page.locator(".dossier-table tbody tr")).toHaveCount(3);
  await expect(page.locator(".dossier-table")).toContainText("FW–01");
  await page
    .getByRole("link", { name: "Explore structural coordination" })
    .click();
  const examples = page.locator(".capability-example");
  await examples.nth(0).locator("summary").click();
  await expect(examples.nth(0)).toHaveAttribute("open", "");
  await examples.nth(1).locator("summary").click();
  await expect(examples.nth(1)).toHaveAttribute("open", "");
  await expect(examples.nth(0)).not.toHaveAttribute("open", "");
  await expect(examples.nth(1).locator("img")).toBeVisible();
  await examples.nth(1).getByRole("link").click();
  await expect(page).toHaveURL(/\/samples$/);
  await expect(page.locator(".detail-explorer")).toHaveCount(1);
});

test("drawing selection and service previews work without JavaScript", async ({
  browser,
}) => {
  const context = await browser.newContext({
    javaScriptEnabled: false,
    viewport: { width: 390, height: 844 },
  });
  const page = await context.newPage();
  await page.goto("/projects/the-frame");
  const detail = page.locator(".detail-explorer");
  await detail.locator(".detail-selector").nth(2).click();
  await expect(detail.locator('input[value="reference"]')).toBeChecked();
  await expect(detail.locator(".explanation-reference")).toBeVisible();
  await page.goto("/capabilities");
  const example = page.locator(".capability-example").first();
  await example.locator("summary").click();
  await expect(example.locator("img")).toBeVisible();
  await example.getByRole("link").click();
  await expect(page).toHaveURL(/\/samples$/);
  await context.close();
});
