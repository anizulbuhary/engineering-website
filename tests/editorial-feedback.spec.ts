import { test, expect } from "@playwright/test";

for (const width of [375, 768, 1440]) {
  test(`article progress follows reading and clears on navigation at ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/insights/coordination-before-detail");
    await page.evaluate(() => document.fonts.ready);
    const line = page.locator(".reading-progress");
    const progress = () =>
      line.evaluate((el) => new DOMMatrix(getComputedStyle(el).transform).a);
    await expect.poll(progress).toBe(0);
    await page.evaluate(() => {
      const article = document.querySelector("main article")!;
      const rect = article.getBoundingClientRect();
      const header = parseFloat(
        getComputedStyle(document.documentElement).getPropertyValue(
          "--site-header-height",
        ),
      );
      scrollTo({
        top:
          rect.top +
          scrollY -
          header +
          (rect.height - innerHeight + header) / 2,
        behavior: "instant",
      });
    });
    await expect.poll(progress).toBeCloseTo(0.5, 2);
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.evaluate(() =>
      scrollTo({
        top: document.documentElement.scrollHeight,
        behavior: "instant",
      }),
    );
    await expect.poll(progress).toBe(1);
    await page.getByRole("link", { name: "Back to field notes" }).click();
    await expect(page).toHaveURL(/\/insights$/);
    await expect(line).toHaveCount(0);
  });
}

test("gallery count follows keyboard changes without moving controls", async ({
  page,
}) => {
  await page.goto("/samples");
  await page.locator(".sample-preview").first().click();
  await page.getByRole("dialog").evaluate(async (dialog) => {
    await Promise.all(
      dialog.getAnimations().map((animation) => animation.finished),
    );
  });
  const count = page.locator(".gallery-position");
  const next = page.getByRole("button", { name: "Next sample" });
  const initialBox = await next.boundingBox();
  await expect(count).toContainText("01 /");
  await page.keyboard.press("ArrowRight");
  await expect(count.locator(".gallery-position-current")).toContainText(
    "02 /",
  );
  await expect(next).toHaveJSProperty("disabled", false);
  expect(await next.boundingBox()).toEqual(initialBox);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.keyboard.press("ArrowLeft");
  await expect(count.locator(".gallery-position-current")).toContainText(
    "01 /",
  );
  await expect(count.locator(".gallery-position-current")).toHaveCSS(
    "animation-name",
    "none",
  );
});
