import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { projects } from "../content/projects";
import { articles } from "../content/insights";
import { chooseTheme } from "./theme-helpers";
import { approachStory } from "./story-helpers";
import sharp from "sharp";

const backgrounds = { light: "rgb(244, 242, 237)", dark: "rgb(25, 27, 25)" };
const routes = [
  "/",
  "/about",
  "/why-us",
  "/capabilities",
  "/projects",
  "/samples",
  "/insights",
  "/contact",
  "/privacy",
  "/missing-theme-page",
  ...projects.map((p) => `/projects/${p.slug}`),
  ...articles.map((a) => `/insights/${a.slug}`),
];

for (const width of [375, 430, 768, 1024, 1440, 1920]) {
  test(`dark layouts and page surfaces at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 1000 });
    await page.emulateMedia({ colorScheme: "dark" });
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    for (const route of routes) {
      await page.goto(route);
      await expect(page.locator("body")).toHaveCSS(
        "background-color",
        backgrounds.dark,
      );
      await expect(page.locator("body")).toHaveCSS(
        "color",
        "rgb(240, 237, 230)",
      );
      await expect(page.locator("h1")).toHaveCount(1);
      await expect(page.locator(".site-header")).toHaveCSS(
        "height",
        width < 768 ? "64px" : "72px",
      );
      await page.locator("footer").scrollIntoViewIfNeeded();
      await expect(page.locator("footer")).toHaveCSS(
        "background-color",
        "rgb(23, 25, 24)",
      );
      await expect(page.locator("footer")).toHaveCSS(
        "color",
        backgrounds.light,
      );
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
        route,
      ).toBe(true);
    }
    expect(errors).toEqual([]);
  });
}

test("dark default, saved choices, navigation and cross-tab changes", async ({
  page,
  context,
}) => {
  await page.emulateMedia({ colorScheme: "light" });
  await page.goto("/");
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await expect(page.locator("body")).toHaveCSS(
    "background-color",
    backgrounds.dark,
  );
  expect(await page.evaluate(() => localStorage.length)).toBe(0);
  await chooseTheme(page, "light");
  await expect(page.locator("body")).toHaveCSS(
    "background-color",
    backgrounds.light,
  );
  await page.reload();
  await expect(page.locator("body")).toHaveCSS(
    "background-color",
    backgrounds.light,
  );
  await page.locator(".editorial-explore").click();
  await expect(page).toHaveURL(/\/contact$/);
  await expect(page.locator("body")).toHaveCSS(
    "background-color",
    backgrounds.light,
  );
  const second = await context.newPage();
  await second.emulateMedia({ colorScheme: "dark" });
  await second.goto("/about");
  await chooseTheme(second, "dark");
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await chooseTheme(second, "system");
  await second.reload();
  await expect(second.locator("html")).toHaveAttribute("data-theme", "system");
  await expect(page.locator("html")).toHaveAttribute("data-theme", "system");
  await page.emulateMedia({ colorScheme: "light" });
  await expect(page.locator("body")).toHaveCSS(
    "background-color",
    backgrounds.light,
  );
  await page.emulateMedia({ colorScheme: "dark" });
  await expect(page.locator("body")).toHaveCSS(
    "background-color",
    backgrounds.dark,
  );
  await second.evaluate(() => localStorage.clear());
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await second.close();
});

test("appearance panel has keyboard selection, dismissal and stable geometry", async ({
  page,
}) => {
  await page.setViewportSize({ width: 375, height: 900 });
  await page.goto("/");
  const button = page.getByRole("button", { name: "Appearance", exact: true });
  const initial = await page.locator(".site-header").boundingBox();
  await button.click();
  await expect(
    page.getByRole("radio", { name: "Dark", exact: true }),
  ).toBeFocused();
  expect(
    (await new AxeBuilder({ page }).include(".site-header").analyze())
      .violations,
  ).toEqual([]);
  await page.keyboard.press("ArrowUp");
  await expect(
    page.getByRole("radio", { name: "Light", exact: true }),
  ).toBeChecked();
  await expect(page.locator("body")).toHaveCSS(
    "background-color",
    backgrounds.light,
  );
  await page.keyboard.press("ArrowDown");
  await expect(
    page.getByRole("radio", { name: "Dark", exact: true }),
  ).toBeChecked();
  await expect(page.locator("body")).toHaveCSS(
    "background-color",
    backgrounds.dark,
  );
  expect(
    (await new AxeBuilder({ page }).include(".site-header").analyze())
      .violations,
  ).toEqual([]);
  await page.keyboard.press("Escape");
  await expect(button).toBeFocused();
  await expect(page.locator(".appearance-panel")).toHaveCount(0);
  await button.click();
  // Click the uncovered margin, away from the anchored panel over the headline.
  await page.mouse.click(12, 400);
  await expect(page.locator(".appearance-panel")).toHaveCount(0);
  await button.click();
  await page.keyboard.press("Tab");
  await expect(page.locator(".appearance-panel")).toHaveCount(0);
  expect(await page.locator(".site-header").boundingBox()).toEqual(initial);
  await page.getByRole("button", { name: "Open navigation" }).click();
  await expect(page.getByRole("dialog")).toHaveCSS(
    "background-color",
    "rgb(45, 50, 45)",
  );
  await page.keyboard.press("Escape");
  await expect(
    page.getByRole("button", { name: "Open navigation" }),
  ).toBeFocused();
});

test("appearance rows select from their text and blank space", async ({
  browser,
}) => {
  for (const width of [375, 768, 1440]) {
    const context = await browser.newContext({
      viewport: { width, height: 900 },
      hasTouch: true,
    });
    const page = await context.newPage();
    await page.goto("/");
    await page.getByRole("button", { name: "Appearance", exact: true }).click();
    await page
      .locator(".appearance-option span")
      .getByText("Light", { exact: true })
      .click();
    await expect(
      page.getByRole("radio", { name: "Light", exact: true }),
    ).toBeChecked();
    const dark = await page
      .locator(".appearance-option")
      .filter({ hasText: "Dark" })
      .boundingBox();
    if (!dark) throw new Error("Missing Dark row");
    await page.mouse.click(dark.x + dark.width - 8, dark.y + dark.height / 2);
    await expect(
      page.getByRole("radio", { name: "Dark", exact: true }),
    ).toBeChecked();
    const system = await page
      .locator(".appearance-option")
      .filter({ hasText: "System" })
      .boundingBox();
    if (!system) throw new Error("Missing System row");
    await page.touchscreen.tap(
      system.x + system.width - 8,
      system.y + system.height / 2,
    );
    await expect(
      page.getByRole("radio", { name: "System", exact: true }),
    ).toBeChecked();
    await expect(page.locator(".appearance-panel")).toBeVisible();
    await page.keyboard.press("ArrowUp");
    await expect(
      page.getByRole("radio", { name: "Dark", exact: true }),
    ).toBeChecked();
    await page.keyboard.press("Escape");
    await expect(
      page.getByRole("button", { name: "Appearance", exact: true }),
    ).toBeFocused();
    await context.close();
  }
});

test("blocked storage and invalid saved values fall back safely", async ({
  browser,
}) => {
  for (const blocked of [false, true]) {
    const context = await browser.newContext({ colorScheme: "light" });
    const page = await context.newPage();
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.addInitScript((blocked) => {
      if (blocked) {
        for (const name of ["getItem", "setItem"])
          Object.defineProperty(Storage.prototype, name, {
            value() {
              throw new Error("Storage disabled");
            },
          });
      } else localStorage.setItem("formwork-theme", "invalid");
    }, blocked);
    await page.goto("/");
    await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
    await expect(page.locator("body")).toHaveCSS(
      "background-color",
      backgrounds.dark,
    );
    await chooseTheme(page, "light");
    await expect(page.locator("body")).toHaveCSS(
      "background-color",
      backgrounds.light,
    );
    await page.locator(".editorial-explore").click();
    await expect(page.locator("body")).toHaveCSS(
      "background-color",
      backgrounds.light,
    );
    expect(errors).toEqual([]);
    await context.close();
  }
});

for (const theme of ["light", "dark"] as const) {
  test(`${theme} saved preference applies before hydration`, async ({
    page,
  }) => {
    await page.emulateMedia({
      colorScheme: theme === "dark" ? "light" : "dark",
    });
    await page.addInitScript(
      (theme) => localStorage.setItem("formwork-theme", theme),
      theme,
    );
    await page.route("**/_next/static/**/*.js", (route) => route.abort());
    await page.goto("/");
    await expect(page.locator("body")).toHaveCSS(
      "background-color",
      backgrounds[theme],
    );
    await expect(page.locator("html")).toHaveAttribute("data-theme", theme);
    await expect(page.locator("h1")).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Appearance", exact: true }),
    ).not.toBeVisible();
  });

  test(`dark default works without JavaScript on a ${theme} device`, async ({
    browser,
  }) => {
    const context = await browser.newContext({
      javaScriptEnabled: false,
      colorScheme: theme,
    });
    const page = await context.newPage();
    await page.goto("/projects/the-frame");
    await expect(page.locator("body")).toHaveCSS(
      "background-color",
      backgrounds.dark,
    );
    await expect(page.locator("html")).toHaveCSS("color-scheme", "dark");
    await page.locator(".detail-selector").nth(1).click();
    await expect(page.locator(".explanation-reinforcement")).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Appearance", exact: true }),
    ).not.toBeVisible();
    await context.close();
  });
}

test("dark contrast, drawing emphasis and sample dialog accessibility", async ({
  page,
}) => {
  await page.emulateMedia({ colorScheme: "dark", reducedMotion: "reduce" });
  for (const route of [
    "/",
    "/about",
    "/why-us",
    "/capabilities",
    "/projects",
    "/projects/the-frame",
    "/samples",
    "/insights",
    "/insights/coordination-before-detail",
    "/contact",
    "/privacy",
    "/missing-theme-page",
  ]) {
    await page.goto(route);
    expect(
      (
        await new AxeBuilder({ page })
          .withTags([
            "wcag2a",
            "wcag2aa",
            "wcag21a",
            "wcag21aa",
            "best-practice",
          ])
          .analyze()
      ).violations,
      route,
    ).toEqual([]);
  }
  await page.goto("/samples");
  await page
    .getByRole("button", { name: "Preview Typical slab arrangement" })
    .click();
  expect(
    (await new AxeBuilder({ page }).include(".sample-dialog").analyze())
      .violations,
  ).toEqual([]);
  await page.keyboard.press("Escape");
  await page.locator(".detail-selector").nth(1).click();
  await expect(page.locator(".detail-reinforcement")).toHaveCSS(
    "color",
    "rgb(219, 160, 120)",
  );
  await expect(page.locator(".detail-reinforcement")).toHaveCSS("opacity", "1");
});

test("theme changes preserve the live scene, paused image, scroll and reading state", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  await chooseTheme(page, "light");
  await page.locator(".detail-selector").nth(2).click();
  await approachStory(page);
  const canvas = page.locator(".engineering-canvas.is-ready canvas");
  await expect(canvas).toBeVisible({ timeout: 30000 });
  await expect(canvas).toHaveAttribute("data-progress", "0.0000");
  await page.locator("#engineering-story").evaluate((el) => {
    const stage = el.querySelector(".engineering-stage") as HTMLElement;
    const header = document
      .querySelector(".site-header")!
      .getBoundingClientRect().height;
    scrollTo({
      top:
        Math.ceil(el.getBoundingClientRect().top + scrollY - header) +
        (el.clientHeight - stage.clientHeight) * 0.4,
      behavior: "instant",
    });
  });
  await expect
    .poll(async () => Number(await canvas.getAttribute("data-progress")))
    .toBeCloseTo(0.4, 2);
  // The meter reaches the scroll target immediately; the camera eases towards it.
  const progress = await page
    .locator(".story-progress > div")
    .evaluate((el) =>
      Number((el as HTMLElement).style.transform.slice(7, -1)).toFixed(4),
    );
  await expect(canvas).toHaveAttribute("data-progress", progress);
  const original = await canvas.elementHandle();
  const scroll = await page.evaluate(() => scrollY);
  await chooseTheme(page, "dark");
  await expect(page.locator(".engineering-stage")).toHaveCSS(
    "color",
    "rgb(240, 237, 230)",
  );
  expect(
    await canvas.evaluate((el, original) => el === original, original),
  ).toBe(true);
  expect(await page.evaluate(() => scrollY)).toBe(scroll);
  await expect(canvas).toHaveAttribute("data-progress", progress!);
  await expect(
    page.locator('.detail-explorer input[value="reference"]'),
  ).toBeChecked();
  await page.getByRole("button", { name: "Pause motion" }).click();
  const image = page.locator(".story-paused-image img");
  await expect(image).toBeVisible();
  const src = await image.getAttribute("src");
  await chooseTheme(page, "light");
  await expect(image).toHaveAttribute("src", src!);
  await expect(page.locator(".engineering-stage")).toHaveCSS(
    "color",
    "rgb(23, 25, 24)",
  );
  await expect(page.locator(".story-chapters li")).toHaveCount(6);
  // A captured dark-mode opening must still match a live light-mode opening:
  // the backdrop is CSS, while the transparent grid and shadow are theme-neutral.
  const bounds = await page.locator(".engineering-visual").boundingBox();
  if (!bounds) throw new Error("Missing model viewport");
  // Compare the same integer-aligned screen region: element screenshots can
  // auto-scroll or round the fractional paused/canvas bounds differently.
  const clip = {
    x: Math.ceil(Math.max(720, bounds.x)),
    y: Math.ceil(Math.max(180, bounds.y)),
    width: 0,
    height: 0,
  };
  clip.width = Math.floor(Math.min(1418, bounds.x + bounds.width) - clip.x);
  clip.height = Math.floor(Math.min(750, bounds.y + bounds.height) - clip.y);
  const beforeResume = await page.screenshot({
    clip,
    path: "artifacts/backdrop-review/cross-theme-paused.png",
  });
  await page.getByRole("button", { name: "Resume motion" }).click();
  await expect(canvas).toHaveAttribute("data-progress", "0.0000");
  await expect(page.locator(".engineering-canvas")).toHaveCSS("opacity", "1");
  const afterResume = await page.screenshot({
    clip,
    path: "artifacts/backdrop-review/cross-theme-resumed.png",
  });
  const before = await sharp(beforeResume).removeAlpha().raw().toBuffer();
  const after = await sharp(afterResume).removeAlpha().raw().toBuffer();
  expect(after.length).toBe(before.length);
  expect(
    after.reduce((sum, value, i) => sum + Math.abs(value - before[i]), 0) /
      after.length,
  ).toBeLessThan(1);
});

test("studio fallback poster has transparent margins and no baked backdrop", async ({
  request,
}) => {
  const response = await request.get("/models/pavilion-studio-refined.webp");
  expect(response.ok()).toBe(true);
  const { data, info } = await sharp(await response.body())
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  expect(info.channels).toBe(4);
  // All four corners should reveal the current CSS background.
  for (const pixel of [
    0,
    info.width - 1,
    info.width * (info.height - 1),
    info.width * info.height - 1,
  ]) {
    expect(data[pixel * 4 + 3]).toBe(0);
  }
});
