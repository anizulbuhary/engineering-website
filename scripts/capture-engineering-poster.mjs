import { chromium, expect } from "@playwright/test";
import sharp from "sharp";
import { readFileSync } from "node:fs";

const model = JSON.parse(
  readFileSync(
    new URL("../content/engineering-model.json", import.meta.url),
    "utf8",
  ),
);

// Run against the current build: node scripts/capture-engineering-poster.mjs
// This derives the transparent loading/fallback poster from the actual scene.
const browser = await chromium.launch();
try {
  const page = await browser.newPage({
    viewport: { width: 1440, height: 900 },
    colorScheme: "light",
  });
  await page.goto(process.argv[2] ?? "http://localhost:3000");
  await page.locator("#engineering-story").evaluate((el) => {
    const header = document
      .querySelector(".site-header")
      .getBoundingClientRect().height;
    scrollTo({
      top: Math.ceil(el.getBoundingClientRect().top + scrollY - header),
      behavior: "instant",
    });
  });
  await expect(
    page.locator(".engineering-canvas.is-ready canvas"),
  ).toHaveAttribute("data-progress", "0.0000", { timeout: 30000 });
  await page.getByRole("button", { name: "Pause motion" }).click();
  const still = page.locator(".story-paused-image img");
  await expect(still).toBeVisible();
  const source = await still.getAttribute("src");
  if (!source?.startsWith("data:image/png;base64,"))
    throw new Error("No opening capture available");
  const result = await sharp(Buffer.from(source.split(",")[1], "base64"))
    .webp({ lossless: true })
    .toFile(`public${model.poster}`);
  console.log(
    `Transparent opening: ${result.width} × ${result.height}, ${result.size} bytes`,
  );
} finally {
  await browser.close();
}
