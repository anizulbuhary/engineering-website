import { mkdir, writeFile } from "node:fs/promises";
import { chromium } from "@playwright/test";
import lighthouse from "lighthouse";
await mkdir("artifacts", { recursive: true });
const browser = await chromium.launch({
  headless: true,
  args: ["--remote-debugging-port=9222"],
});
const scores = [];
try {
  for (const [name, route, desktop] of [
    ["home-mobile", "/", false],
    ["home-desktop", "/", true],
    ["projects-mobile", "/projects", false],
    ["samples-mobile", "/samples", false],
    ["contact-mobile", "/contact", false],
  ]) {
    const result = await lighthouse(`http://localhost:3000${route}`, {
      port: 9222,
      output: ["html", "json"],
      logLevel: "error",
      onlyCategories: ["performance", "accessibility", "best-practices", "seo"],
      ...(desktop
        ? {
            formFactor: "desktop",
            screenEmulation: {
              mobile: false,
              width: 1440,
              height: 1000,
              deviceScaleFactor: 1,
              disabled: false,
            },
            throttling: {
              rttMs: 40,
              throughputKbps: 10240,
              cpuSlowdownMultiplier: 1,
              requestLatencyMs: 0,
              downloadThroughputKbps: 0,
              uploadThroughputKbps: 0,
            },
          }
        : {}),
    });
    await writeFile(`artifacts/lighthouse-${name}.html`, result.report[0]);
    await writeFile(`artifacts/lighthouse-${name}.json`, result.report[1]);
    const summary = {
      page: name,
      ...Object.fromEntries(
        Object.entries(result.lhr.categories).map(([key, value]) => [
          key,
          Math.round(value.score * 100),
        ]),
      ),
      lcp: result.lhr.audits["largest-contentful-paint"].displayValue,
      cls: result.lhr.audits["cumulative-layout-shift"].displayValue,
    };
    scores.push(summary);
    console.log(JSON.stringify(summary));
  }
  await writeFile(
    "artifacts/lighthouse-summary.json",
    JSON.stringify(scores, null, 2),
  );
} finally {
  await browser.close();
}
