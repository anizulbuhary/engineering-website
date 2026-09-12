import { test, expect } from "@playwright/test";

for (const width of [375, 768, 1440]) {
  test(`new pages start at the top and Back restores reading at ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/samples");
    const contact = page.locator('footer a[href="/contact"]').first();
    await contact.scrollIntoViewIfNeeded();
    // Record the actual departure, after Playwright has finished positioning
    // the link and any entrance/layout work has settled.
    await contact.evaluate((link) => {
      link.addEventListener(
        "click",
        () => {
          document.documentElement.dataset.departureScroll = String(scrollY);
        },
        { capture: true, once: true },
      );
    });
    await contact.click();
    await expect(page).toHaveURL("/contact");
    const before = Number(
      await page.locator("html").getAttribute("data-departure-scroll"),
    );
    expect(before).toBeGreaterThan(500);
    await expect.poll(() => page.evaluate(() => scrollY)).toBe(0);
    await expect(page.getByRole("main")).toBeFocused();
    await page.goBack();
    await expect(page).toHaveURL("/samples");
    await expect
      .poll(() => page.evaluate(() => scrollY))
      .toBeCloseTo(before, 0);
    await page.goForward();
    await expect(page).toHaveURL("/contact");
    await expect.poll(() => page.evaluate(() => scrollY)).toBe(0);
  });
}

test("same-page links return to the top and section links retain their destination", async ({
  page,
}) => {
  await page.goto("/projects/the-frame");
  await page.locator("footer").scrollIntoViewIfNeeded();
  await page.locator('footer a[href="/projects"]').first().click();
  await expect(page).toHaveURL("/projects");
  await expect.poll(() => page.evaluate(() => scrollY)).toBe(0);
  await page.locator("footer").scrollIntoViewIfNeeded();
  await page.locator('footer a[href="/projects"]').first().click();
  await expect.poll(() => page.evaluate(() => scrollY)).toBe(0);
  await page.goto("/");
  await page
    .getByRole("link", { name: "See the engineering", exact: true })
    .click();
  await expect(page).toHaveURL("/#engineering-story");
  await expect
    .poll(() =>
      page
        .locator("#engineering-story")
        .evaluate((el) => el.getBoundingClientRect().top),
    )
    .toBeLessThan(130);
  expect(
    await page
      .locator("#engineering-story")
      .evaluate((el) => Math.round(el.getBoundingClientRect().top)),
  ).toBeGreaterThanOrEqual(72);
  await expect(page.locator("#engineering-story")).toBeFocused();
});

test("mobile navigation lands on the new heading without late focus jumps", async ({
  page,
}) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto("/samples");
  await page.locator("footer").scrollIntoViewIfNeeded();
  await page.getByRole("button", { name: "Open navigation" }).click();
  await page
    .getByRole("navigation", { name: "Mobile navigation" })
    .getByRole("link", { name: "About", exact: true })
    .click();
  await expect(page).toHaveURL("/about");
  await expect(
    page.getByRole("dialog", { name: "Site navigation" }),
  ).not.toBeVisible();
  await expect(page.getByRole("main")).toBeFocused();
  await expect.poll(() => page.evaluate(() => scrollY)).toBe(0);
});

test("reduced motion makes same-page navigation immediate", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/about");
  await page.locator('footer a[href="/about"]').click();
  await expect.poll(() => page.evaluate(() => scrollY)).toBe(0);
  await page.locator("footer").scrollIntoViewIfNeeded();
  await page.evaluate(() => {
    const positions: number[] = [];
    const record = () => {
      positions.push(scrollY);
      document.documentElement.dataset.scrollSamples =
        JSON.stringify(positions);
      if (positions.length < 8) requestAnimationFrame(record);
    };
    document
      .querySelector('footer a[href="/about"]')!
      .addEventListener("click", () => requestAnimationFrame(record), {
        once: true,
      });
  });
  await page.locator('footer a[href="/about"]').click();
  await expect.poll(() => page.evaluate(() => scrollY)).toBe(0);
  await expect
    .poll(
      async () =>
        JSON.parse(
          (await page.locator("html").getAttribute("data-scroll-samples")) ??
            "[]",
        ).length,
    )
    .toBe(8);
  const samples: number[] = JSON.parse(
    (await page.locator("html").getAttribute("data-scroll-samples")) ?? "[]",
  );
  expect(samples.slice(1)).toEqual(Array(7).fill(0));
});
