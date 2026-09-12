import { test, expect } from "@playwright/test";

for (const width of [375, 768, 1024, 1440]) {
  test(`clear navigation and a keyboard-accessible story bypass at ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    const navigation = page.getByRole("navigation", {
      name: width < 1024 ? "Mobile navigation" : "Main navigation",
      exact: true,
    });
    if (width < 1024)
      await page.getByRole("button", { name: "Open navigation" }).click();
    for (const [label, href] of [
      ["Services", "/capabilities"],
      ["Projects", "/projects"],
      ["Drawing samples", "/samples"],
      ["About", "/about"],
    ]) {
      await expect(
        navigation.getByRole("link", { name: label, exact: true }),
      ).toHaveAttribute("href", href);
    }
    if (width < 1024) await page.keyboard.press("Escape");
    const skip = page.getByRole("link", {
      name: "Skip to services",
      exact: true,
    });
    await skip.focus();
    await page.keyboard.press("Enter");
    const services = page.getByRole("region", {
      name: "Services",
      exact: true,
    });
    await expect(services).toBeFocused();
    await expect
      .poll(() => services.evaluate((el) => el.getBoundingClientRect().top))
      .toBeGreaterThanOrEqual(width < 768 ? 64 : 72);
    expect(
      await services.evaluate((el) => el.getBoundingClientRect().top),
    ).toBeLessThan(150);
    await page.keyboard.press("Tab");
    expect(
      await services.evaluate((el) => el.contains(document.activeElement)),
    ).toBe(true);
    await expect(
      page.locator("#engineering-story .story-chapters"),
    ).toBeAttached();
  });
}

test("services explain outputs and connect examples to contact", async ({
  page,
}) => {
  await page.goto("/capabilities");
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "Engineering services",
  );
  const service = page.locator("#reinforcement");
  await expect(service).toContainText("What you receive");
  await service.locator("summary").click();
  await expect(service.locator(".capability-example-body img")).toBeVisible();
  await service.getByRole("link", { name: /Discuss this service/ }).click();
  await expect(page).toHaveURL("/contact");
  await expect(page.getByText("Example email — not monitored")).toBeVisible();
  await expect(page.getByText("hello@formwork.example")).toBeVisible();
  await expect(page.locator("form input:not([type=checkbox])")).toHaveCount(4);
  await expect(
    page.getByText(
      "Choose any that apply. Leave this blank if you are not sure.",
    ),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Submissions opening soon" }),
  ).toBeDisabled();
});

test("story bypass and service examples also work without JavaScript", async ({
  browser,
}) => {
  const context = await browser.newContext({
    javaScriptEnabled: false,
    viewport: { width: 375, height: 900 },
  });
  const page = await context.newPage();
  await page.goto("/");
  await page
    .getByRole("link", { name: "Skip to services", exact: true })
    .click();
  await expect(page).toHaveURL(/#services$/);
  await expect(
    page.getByRole("region", { name: "Services", exact: true }),
  ).toBeInViewport();
  await page.locator("#coordination summary").click();
  await expect(
    page.locator("#coordination .capability-example-body img"),
  ).toBeVisible();
  await context.close();
});
