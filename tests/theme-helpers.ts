import { expect, type Page } from "@playwright/test";
import type { ThemePreference } from "../lib/theme-preference";

export async function chooseTheme(page: Page, theme: ThemePreference) {
  const trigger = page.getByRole("button", { name: "Appearance", exact: true });
  await expect(trigger).toBeVisible();
  await expect(trigger).toBeEnabled();
  const bounds = await trigger.boundingBox();
  if (!bounds) throw new Error("Missing appearance control");
  // The sticky control is already on screen. Use a real pointer click so
  // Playwright's scrollIntoView does not reposition the document before clicking.
  await page.mouse.click(
    bounds.x + bounds.width / 2,
    bounds.y + bounds.height / 2,
  );
  await page
    .getByRole("radio", {
      name: theme[0].toUpperCase() + theme.slice(1),
      exact: true,
    })
    .check();
  await page.keyboard.press("Escape");
  await expect(page.locator("html")).toHaveAttribute("data-theme", theme);
}
