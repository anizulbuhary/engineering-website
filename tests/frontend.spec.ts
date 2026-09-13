import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { projects } from "../content/projects";
import { articles } from "../content/insights";
import { samples } from "../content/samples";
const routes = [
  "/",
  "/about",
  "/capabilities",
  "/projects",
  "/samples",
  "/why-us",
  "/insights",
  "/contact",
  "/privacy",
  ...projects.map((p) => `/projects/${p.slug}`),
  ...articles.map((a) => `/insights/${a.slug}`),
];
for (const width of [375, 430, 768, 1024, 1440, 1920])
  test(`Responsive routes at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 1000 });
    const errors: string[] = [];
    page.on("pageerror", (e) => errors.push(e.message));
    for (const route of routes) {
      const response = await page.goto(route);
      expect(response?.status(), route).toBe(200);
      await expect(page.locator("h1")).toHaveCount(1);
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
        `${route} overflow at ${width}`,
      ).toBe(true);
      await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
        "content",
        /noindex/,
      );
      await page.locator("footer").scrollIntoViewIfNeeded();
      const broken = await page
        .locator("img")
        .evaluateAll((imgs) =>
          imgs
            .filter(
              (i): i is HTMLImageElement =>
                i instanceof HTMLImageElement &&
                i.complete &&
                i.naturalWidth === 0,
            )
            .map((i) => i.src),
        );
      expect(broken, route).toEqual([]);
    }
    await page.goto("/");
    await page.screenshot({
      path: `artifacts/home-${width}.png`,
      fullPage: true,
    });
    expect(errors).toEqual([]);
  });
test("Project filtering and case study navigation", async ({ page }) => {
  await page.goto("/projects");
  await expect(page.locator("main article")).toHaveCount(4);
  await page.getByRole("button", { name: "Residential", exact: true }).click();
  await expect(page.locator("main article")).toHaveCount(1);
  await expect(page.getByRole("status")).toHaveText("1 concept projects shown");
  await page.getByRole("link", { name: /Courtyard House/ }).click();
  await expect(page).toHaveURL(/courtyard-house/);
  await expect(
    page.getByRole("heading", { name: "Courtyard House", exact: true }),
  ).toBeVisible();
  await page
    .getByRole("navigation", { name: "Breadcrumb" })
    .getByRole("link", { name: "Projects" })
    .click();
  await expect(page.locator("main article")).toHaveCount(4);
});
test("Sample preview supports keyboard, focus restoration and real PDFs", async ({
  page,
  request,
}) => {
  await page.goto("/samples");
  await page
    .getByRole("button", { name: "Reinforcement", exact: true })
    .click();
  await expect(page.locator("main article")).toHaveCount(2);
  const opener = page.getByRole("button", {
    name: "Preview Beam reinforcement study",
  });
  await opener.click();
  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();
  await expect(dialog.getByRole("heading")).toHaveText(
    "Beam reinforcement study",
  );
  const fullSize = dialog.getByRole("link", { name: /Open full-size drawing/ });
  await expect(fullSize).toHaveAttribute(
    "href",
    "/graphics/samples/beam-detail.svg",
  );
  await expect(fullSize).toHaveAttribute("target", "_blank");
  await page.keyboard.press("ArrowRight");
  await expect(dialog.getByRole("heading")).toHaveText("Bar schedule layout");
  await expect(fullSize).toHaveAttribute(
    "href",
    "/graphics/samples/bar-schedule.svg",
  );
  await page.keyboard.press("ArrowLeft");
  await expect(dialog.getByRole("heading")).toHaveText(
    "Beam reinforcement study",
  );
  await page.keyboard.press("Escape");
  await expect(dialog).not.toBeVisible();
  await expect(opener).toBeFocused();
  for (const sample of samples) {
    const response = await request.get(sample.pdf);
    expect(response.status()).toBe(200);
    expect((await response.body()).subarray(0, 5).toString()).toBe("%PDF-");
  }
});
test("Mobile navigation traps focus, closes and restores focus", async ({
  page,
}) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto("/");
  const trigger = page.getByRole("button", { name: "Open navigation" });
  await trigger.click();
  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();
  for (let i = 0; i < 12; i++) {
    await page.keyboard.press("Tab");
    expect(
      await dialog.evaluate((el) => el.contains(document.activeElement)),
    ).toBe(true);
  }
  await page.keyboard.press("Escape");
  await expect(trigger).toBeFocused();
  await trigger.click();
  await dialog
    .getByRole("link", { name: "Drawing samples", exact: true })
    .click();
  await expect(page).toHaveURL("/samples");
  await expect(dialog).not.toBeVisible();
});
test("Contact preview sends and stores nothing", async ({ page }) => {
  await page.addInitScript(() =>
    localStorage.setItem("formwork-theme", "dark"),
  );
  await page.goto("/contact");
  await page.waitForLoadState("networkidle");
  const requests: string[] = [];
  page.on("request", (r) => {
    const url = new URL(r.url());
    // Native Next link prefetches can arrive as footer links enter view while
    // the form is filled. Permit only its body-free, same-origin page requests.
    const pagePrefetch =
      r.method() === "GET" &&
      !r.postData() &&
      url.origin === new URL(page.url()).origin &&
      routes.includes(url.pathname) &&
      r.headers()["next-router-prefetch"] === "1" &&
      r.headers().rsc === "1" &&
      url.searchParams.has("_rsc") &&
      [...url.searchParams.keys()].every((key) => key === "_rsc");
    if (pagePrefetch) return;
    if (
      r.isNavigationRequest() ||
      ["fetch", "xhr"].includes(r.resourceType()) ||
      r.method() !== "GET"
    )
      requests.push(r.url());
  });
  await page.getByLabel("Full name", { exact: true }).fill("Demo visitor");
  await page.getByLabel("Email address").fill("visitor@example.com");
  await page.getByLabel("Email address").press("Enter");
  await page
    .getByLabel("Tell us about your project")
    .fill("A demonstration project brief.");
  await expect(
    page.getByRole("button", { name: "Submit enquiry" }),
  ).toBeEnabled();
  await page.getByRole("button", { name: "Submit enquiry" }).click();
  await expect(
    page.getByRole("heading", {
      name: "A good project starts with a conversation.",
    }),
  ).toBeFocused();
  await expect(page.locator("#enquiry-complete-description")).toContainText(
    "not been sent or saved",
  );
  await expect(page.locator("form")).toHaveCount(0);
  await expect(page).toHaveURL("/contact");
  expect(requests).toEqual([]);
  expect(
    await page.evaluate(() => ({
      local: Object.fromEntries(
        Object.keys(localStorage).map((key) => [
          key,
          localStorage.getItem(key),
        ]),
      ),
      session: sessionStorage.length,
    })),
  ).toEqual({ local: { "formwork-theme": "dark" }, session: 0 });
  await page.screenshot({
    path: "artifacts/contact-desktop.png",
    fullPage: true,
  });
  await page.getByRole("button", { name: "Start another enquiry" }).click();
  await expect(page.getByLabel("Full name", { exact: true })).toBeFocused();
  await expect(page.getByLabel("Full name", { exact: true })).toHaveValue("");
  await expect(page.getByLabel("Email address")).toHaveValue("");
  await expect(page.getByLabel("Tell us about your project")).toHaveValue("");
});
test("Unknown detail routes return 404", async ({ page }) => {
  for (const route of [
    "/not-a-page",
    "/projects/missing",
    "/insights/missing",
  ]) {
    const response = await page.goto(route);
    expect(response?.status()).toBe(404);
    await expect(page.getByRole("heading", { name: /isn’t/ })).toBeVisible();
  }
});
test("WCAG accessibility on representative routes and dialogs", async ({
  page,
}) => {
  for (const route of [
    "/",
    "/about",
    "/capabilities",
    "/projects",
    "/samples",
    "/why-us",
    "/insights",
    "/contact",
    "/privacy",
    "/projects/the-frame",
    "/insights/coordination-before-detail",
  ]) {
    await page.goto(route);
    const result = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "best-practice"])
      .analyze();
    expect(result.violations, route).toEqual([]);
  }
  await page.goto("/samples");
  await page
    .getByRole("button", { name: "Preview Typical slab arrangement" })
    .click();
  expect(
    (
      await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "best-practice"])
        .analyze()
    ).violations,
  ).toEqual([]);
  await page.keyboard.press("Escape");
  await page.setViewportSize({ width: 375, height: 812 });
  await page.getByRole("button", { name: "Open navigation" }).click();
  expect(
    (
      await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "best-practice"])
        .analyze()
    ).violations,
  ).toEqual([]);
});
test("Reduced motion and JavaScript-free content remain usable", async ({
  browser,
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  expect(
    await page.evaluate(
      () => getComputedStyle(document.documentElement).scrollBehavior,
    ),
  ).toBe("auto");
  await expect(
    page.getByRole("heading", { name: "Bring the package together" }),
  ).toBeAttached();
  const context = await browser.newContext({ javaScriptEnabled: false });
  const staticPage = await context.newPage();
  await staticPage.goto("/");
  await expect(staticPage.getByRole("heading", { level: 1 })).toBeVisible();
  await expect(
    staticPage
      .locator(".editorial-hero")
      .getByRole("link", { name: "Contact", exact: true }),
  ).toBeVisible();
  await staticPage.goto("/contact");
  await expect(
    staticPage.getByRole("button", { name: "Submit enquiry" }),
  ).toBeDisabled();
  await context.close();
});
