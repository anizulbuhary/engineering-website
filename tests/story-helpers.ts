import type { Page } from "@playwright/test";
export async function headerHeight(page: Page) {
  return page
    .locator(".site-header")
    .evaluate((el) => el.getBoundingClientRect().height);
}
export async function approachStory(page: Page) {
  await page.locator("#engineering-story").evaluate((el) => {
    const height = document
      .querySelector(".site-header")!
      .getBoundingClientRect().height;
    scrollTo({
      // Fractional preceding layouts can round down and leave the stage just
      // short of its sticky boundary. Compare frames at the fully pinned start.
      top: Math.ceil(el.getBoundingClientRect().top + scrollY - height),
      behavior: "instant",
    });
  });
}
