import { test, expect } from "@playwright/test";
import { approachStory, headerHeight } from "./story-helpers";
import AxeBuilder from "@axe-core/playwright";

for (const colorScheme of ["light", "dark"] as const) {
  test.describe(`${colorScheme} engineering experience`, () => {
    test.use({ colorScheme });
    test("3D story loads on approach, follows chapters in both directions, and can be paused", async ({
      page,
    }) => {
      await page.setViewportSize({ width: 1440, height: 1000 });
      const models: string[] = [];
      const errors: string[] = [];
      page.on("request", (req) => {
        if (req.url().endsWith(".glb")) models.push(req.url());
      });
      page.on("pageerror", (e) => errors.push(e.message));
      await page.goto("/");
      await expect(page.locator(".is-immersive")).toBeVisible();
      expect(models).toHaveLength(0);
      await approachStory(page);
      await expect
        .poll(async () =>
          page
            .locator(".engineering-stage")
            .evaluate((el) => Math.round(el.getBoundingClientRect().top)),
        )
        .toBe(await headerHeight(page));
      await expect(
        page.locator(".engineering-canvas.is-ready canvas"),
      ).toBeVisible({ timeout: 30000 });
      expect(models).toHaveLength(1);
      for (const chapter of [3, 5, 1, 0]) {
        const button = page.getByRole("button", {
          name: new RegExp(`Chapter ${chapter + 1}:`),
        });
        await button.click();
        await expect(button).toHaveAttribute("aria-current", "step");
      }
      const axe = await new AxeBuilder({ page })
        .include("#engineering-story")
        .analyze();
      expect(axe.violations).toEqual([]);
      await page.getByRole("button", { name: "Pause motion" }).click();
      await expect(page.locator("#engineering-story canvas")).toHaveCount(0);
      await expect(page.locator(".story-paused-image img")).toBeVisible();
      await expect(page.locator("#engineering-story")).toHaveClass(/is-paused/);
      await page.getByRole("button", { name: "Resume motion" }).click();
      await expect(
        page.locator(".engineering-canvas.is-ready canvas"),
      ).toBeVisible();
      expect(errors).toEqual([]);
    });

    for (const mode of ["reduced motion"] as const) {
      test(`${mode} preserves all six chapters without downloading 3D`, async ({
        page,
      }) => {
        await page.setViewportSize({
          width: 390,
          height: 900,
        });
        if (mode === "reduced motion")
          await page.emulateMedia({ reducedMotion: "reduce" });
        const models: string[] = [];
        page.on("request", (req) => {
          if (req.url().endsWith(".glb")) models.push(req.url());
        });
        await page.goto("/");
        await approachStory(page);
        await expect(
          page.locator(".story-static-chapters article"),
        ).toHaveCount(6);
        await expect(page.locator("#engineering-story canvas")).toHaveCount(0);
        expect(models).toHaveLength(0);
        expect(
          await page.evaluate(
            () => document.documentElement.scrollWidth <= innerWidth,
          ),
        ).toBe(true);
      });
    }

    test("failed model download falls back to the complete illustrated narrative", async ({
      page,
    }) => {
      await page.setViewportSize({ width: 1440, height: 1000 });
      await page.route("**/models/formwork-pavilion.glb", (route) =>
        route.abort(),
      );
      await page.goto("/");
      await approachStory(page);
      await expect(page.locator(".story-static-chapters article")).toHaveCount(
        6,
      );
      await expect(page.locator("#engineering-story canvas")).toHaveCount(0);
    });

    test("loss of graphics context recovers to a usable static story", async ({
      page,
    }) => {
      await page.setViewportSize({ width: 1440, height: 1000 });
      await page.goto("/");
      await approachStory(page);
      await expect(
        page.locator(".engineering-canvas.is-ready canvas"),
      ).toBeVisible();
      await page.locator(".engineering-canvas canvas").evaluate((canvas) => {
        const gl = (canvas as HTMLCanvasElement).getContext("webgl2");
        gl?.getExtension("WEBGL_lose_context")?.loseContext();
      });
      await expect(page.locator(".story-static-chapters article")).toHaveCount(
        6,
      );
    });
  });
}
