import { test, expect } from "@playwright/test";

test("editorial hero reveals on scroll without loading a Blender image sequence", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  const retiredRequests: string[] = [];
  page.on("request", (r) => {
    if (r.url().includes("colonnade")) retiredRequests.push(r.url());
  });
  await page.goto("/");
  await expect(page.locator(".editorial-hero h1")).toHaveText(
    "Engineering what endures.",
  );
  await expect(page.locator(".comparison-image")).toBeVisible();
  const inset = () =>
    page
      .locator(".editorial-image")
      .evaluate((el) => el.getBoundingClientRect().left);
  const start = await inset();
  await page.evaluate(() => window.scrollTo({ top: 500, behavior: "instant" }));
  await expect.poll(inset).toBeLessThan(start - 20);
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
  await expect.poll(inset).toBeCloseTo(start, 0);
  expect(retiredRequests).toEqual([]);
});

test("reduced motion keeps the hero image still", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await page.evaluate(() => window.scrollTo({ top: 450, behavior: "instant" }));
  await expect(page.locator(".editorial-hero")).toHaveCSS("--hero-reveal", "0");
  await expect(page.locator(".comparison-image")).toBeVisible();
});
