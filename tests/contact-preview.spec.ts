import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

for (const width of [375, 768, 1440]) {
  for (const theme of ["light", "dark"]) {
    test(`enquiry validation, confirmation and restart at ${width}px in ${theme}`, async ({
      page,
    }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.addInitScript(
        (theme) => localStorage.setItem("formwork-theme", theme),
        theme,
      );
      await page.emulateMedia({ reducedMotion: "reduce" });
      await page.goto("/contact");
      const submit = page.getByRole("button", { name: "Submit enquiry" });
      await submit.click();
      await expect(page.getByLabel("Full name", { exact: true })).toBeFocused();
      await expect(page.locator(".enquiry-confirmation")).toHaveCount(0);
      await page.getByLabel("Full name", { exact: true }).fill("Demo visitor");
      await page.getByLabel("Email address").fill("invalid");
      await page
        .getByLabel("Tell us about your project")
        .fill("An illustrative project enquiry.");
      await submit.click();
      await expect(page.getByLabel("Email address")).toBeFocused();
      await page.getByLabel("Email address").fill("visitor@example.com");
      await page.getByLabel("Email address").press("Enter");
      await expect(page.locator("#enquiry-complete")).toBeFocused();
      await expect(page.locator(".enquiry-confirmation")).toBeVisible();
      await expect(page.locator(".enquiry-confirmation")).toHaveCSS(
        "animation-name",
        "none",
      );
      expect(
        (await new AxeBuilder({ page }).include("main").analyze()).violations,
      ).toEqual([]);
      await page.screenshot({
        path: `artifacts/enquiry-${theme}-${width}.png`,
      });
      await page.getByRole("button", { name: "Start another enquiry" }).click();
      await expect(page.getByLabel("Full name", { exact: true })).toHaveValue(
        "",
      );
      await expect(page.getByLabel("Full name", { exact: true })).toBeFocused();
      await expect(submit).toBeEnabled();
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      ).toBe(true);
    });
  }
}
