import { test, expect } from "@playwright/test";

for (const width of [375, 430]) {
  test(`phone sample controls stay anchored through every sheet at ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/samples");
    await page.locator(".sample-preview").first().click();
    await page
      .getByRole("dialog")
      .evaluate(async (el) =>
        Promise.all(el.getAnimations().map((a) => a.finished)),
      );
    const next = page.getByRole("button", { name: "Next sample" });
    const initial = await next.boundingBox();
    for (let i = 0; i < 6; i++) {
      await next.click();
      expect(await next.boundingBox()).toEqual(initial);
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      ).toBe(true);
    }
    await page.screenshot({ path: `artifacts/stable-sample-${width}.png` });
  });
}

for (const theme of ["light", "dark"]) {
  test(`hover and keyboard feedback match in ${theme}`, async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.addInitScript(
      (theme) => localStorage.setItem("formwork-theme", theme),
      theme,
    );
    await page.goto("/samples");
    for (const [controlSelector, paintedSelector] of [
      [".site-header .navigation-link", ".site-header .navigation-link"],
      [".site-header .press-feedback", ".site-header .press-feedback"],
      [".appearance-trigger", ".appearance-trigger"],
      [".sample-preview", ".sample-preview > span"],
    ]) {
      const control = page.locator(controlSelector).first();
      const painted = page.locator(paintedSelector).first();
      const colors = () =>
        painted.evaluate((el) => {
          const style = getComputedStyle(el);
          return [style.color, style.backgroundColor];
        });
      await control.hover();
      await painted.evaluate(async (el) =>
        Promise.all(el.getAnimations().map((a) => a.finished)),
      );
      const hover = await colors();
      await page.mouse.move(0, 0);
      await page.keyboard.press("Tab");
      await control.focus();
      await expect(control).toBeFocused();
      await expect(control).toHaveCSS("outline-style", "solid");
      await expect.poll(colors).toEqual(hover);
    }
  });
}
