import { test, expect } from "@playwright/test";

for (const width of [390, 1440]) {
  test(`editorial reveals, image drift and contact link at ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.addInitScript(() => {
      const original = Element.prototype.animate;
      Element.prototype.animate = function (keyframes, options) {
        this.setAttribute(
          "data-animation-runs",
          String(Number(this.getAttribute("data-animation-runs") ?? 0) + 1),
        );
        this.setAttribute(
          "data-animation-delay",
          String(typeof options === "object" ? (options.delay ?? 0) : 0),
        );
        return original.call(this, keyframes, options);
      };
    });
    await page.goto("/");
    await expect(page.locator(".site-header")).toHaveCSS(
      "height",
      width < 768 ? "64px" : "72px",
    );
    const action = page
      .locator(".editorial-hero")
      .getByRole("link", { name: "Contact", exact: true });
    await expect(action).toHaveAttribute("href", "/contact");
    await action.click();
    await expect(page).toHaveURL(/\/contact$/);
    const hero = page.locator("main [data-stagger]").first();
    await expect(hero).toHaveAttribute("data-revealed", "true");
    expect(
      await hero
        .locator(":scope > *")
        .evaluateAll((nodes) =>
          nodes.map((n) => n.getAttribute("data-animation-delay")),
        ),
    ).toEqual(["0", "70", "140"]);
    // Focusing any field cancels its entrance and does not move it during typing.
    const firstInput = page.locator("input").first();
    await firstInput.focus();
    await firstInput.fill("Motion review");
    expect(
      await firstInput.evaluate(
        (el) => el.closest("[data-motion]")!.getAnimations().length,
      ),
    ).toBe(0);
    await page.goto("/about");
    const photo = page.locator(".scroll-image");
    await photo.scrollIntoViewIfNeeded();
    const drift = () =>
      photo
        .locator(".scroll-image-inner")
        .evaluate((el) =>
          parseFloat(getComputedStyle(el).getPropertyValue("--image-drift")),
        );
    await expect.poll(drift).not.toBeNaN();
    const first = await drift();
    await page.evaluate(() => scrollBy({ top: 160, behavior: "instant" }));
    await expect.poll(drift).not.toBe(first);
    expect(Math.abs(await drift())).toBeLessThanOrEqual(width < 768 ? 4 : 12);
    const principle = page.locator("[data-motion].motion-rule").first();
    await principle.scrollIntoViewIfNeeded();
    await expect(principle).toHaveAttribute("data-revealed", "true");
    const runs = await principle
      .locator(":scope > h3")
      .getAttribute("data-animation-runs");
    expect(runs).toBe("1");
    await page.evaluate(() => scrollTo({ top: 0, behavior: "instant" }));
    await principle.scrollIntoViewIfNeeded();
    expect(
      await principle
        .locator(":scope > h3")
        .getAttribute("data-animation-runs"),
    ).toBe(runs);
    await page.emulateMedia({ reducedMotion: "reduce" });
    await expect(photo.locator(".scroll-image-inner")).toHaveCSS(
      "transform",
      "none",
    );
    expect(
      await principle.evaluate(
        (el) => el.getAnimations({ subtree: true }).length,
      ),
    ).toBe(0);
  });
}

test("sample filter transitions preserve controls and previews", async ({
  page,
}) => {
  await page.goto("/samples");
  await page
    .getByRole("button", { name: "Reinforcement", exact: true })
    .click();
  const cards = page.locator("article[data-motion]");
  await expect(cards.first()).toHaveAttribute("data-motion", "fade");
  await page
    .getByRole("button", { name: /Preview/ })
    .first()
    .click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.getByRole("button", { name: "Close preview" }).click();
  await expect(
    page.getByRole("button", { name: /Preview/ }).first(),
  ).toBeFocused();
});

test("reduced motion and missing animation support retain complete pages", async ({
  page,
  browser,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/insights/coordination-before-detail");
  await page.locator(".scroll-image").scrollIntoViewIfNeeded();
  await expect(page.locator(".scroll-image-inner")).toHaveCSS(
    "transform",
    "none",
  );
  expect(
    await page
      .locator("main")
      .evaluate((el) => el.getAnimations({ subtree: true }).length),
  ).toBe(0);
  const context = await browser.newContext();
  const fallback = await context.newPage();
  await fallback.addInitScript(() => {
    Object.defineProperty(Element.prototype, "animate", { value: undefined });
  });
  await fallback.goto("http://localhost:3000/capabilities");
  await expect(fallback.locator("h1")).toBeVisible();
  await expect(fallback.locator(".capability-row").first()).toBeVisible();
  await context.close();
});
