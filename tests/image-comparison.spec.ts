import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test("dragging and keyboard controls reveal both views and keep their crops aligned", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/");
  const control = page.getByRole("slider", { name: /Compare the concept/ });
  const image = page.locator(".image-comparison");
  await expect(control).toBeEnabled();
  await expect(control).toHaveValue("58");
  const box = (await control.boundingBox())!;
  await page.mouse.move(box.x + box.width * 0.58, box.y + box.height / 2);
  await page.mouse.down();
  await page.mouse.move(box.x + box.width * 0.25, box.y + box.height / 2, {
    steps: 12,
  });
  await page.mouse.up();
  await expect
    .poll(async () => Number(await control.inputValue()))
    .toBeLessThan(30);
  await expect(image).toHaveCSS(
    "--comparison",
    `${await control.inputValue()}%`,
  );
  await control.focus();
  await page.keyboard.press("End");
  await expect(control).toHaveValue("100");
  await expect(control).toHaveAttribute("aria-valuetext", "100% concept image");
  await expect(image).toHaveCSS("--comparison", "100%");
  await page.keyboard.press("Home");
  await expect(control).toHaveValue("0");
  await expect(image).toHaveCSS("--comparison", "0%");
  await expect(image).toHaveCSS("outline-style", "solid");
  for (const width of [375, 768, 1440]) {
    await page.setViewportSize({ width, height: 1000 });
    for (const key of ["Home", "End"]) {
      await control.focus();
      await page.keyboard.press(key);
      const frame = (await image.boundingBox())!;
      const handle = (await page
        .locator(".comparison-divider > span")
        .boundingBox())!;
      const edge = key === "Home" ? frame.x : frame.x + frame.width;
      expect(handle.x + handle.width / 2).toBeCloseTo(edge, 1);
    }
    await page.evaluate(() => scrollTo(0, 140));
    const geometry = await image.locator("img").evaluateAll((nodes) =>
      nodes.map((node) => {
        const rect = node.getBoundingClientRect(),
          style = getComputedStyle(node);
        return [
          rect.x,
          rect.y,
          rect.width,
          rect.height,
          style.objectFit,
          style.objectPosition,
          style.transform,
        ];
      }),
    );
    expect(geometry[0]).toEqual(geometry[1]);
    const sources = await image
      .locator("img")
      .evaluateAll((nodes) =>
        nodes.map((node) => (node as HTMLImageElement).currentSrc),
      );
    const format = width < 768 ? "portrait" : "landscape";
    expect(sources[0]).toContain(`construction-${format}-image.webp`);
    expect(sources[1]).toContain(`construction-${format}-drawing.svg`);
  }
  expect(
    (await new AxeBuilder({ page }).include(".editorial-hero").analyze())
      .violations,
  ).toEqual([]);
});

test("phone gestures compare horizontally and scroll vertically", async ({
  browser,
}) => {
  const context = await browser.newContext({
    viewport: { width: 375, height: 900 },
    isMobile: true,
    hasTouch: true,
  });
  const page = await context.newPage();
  await page.goto("http://localhost:3000");
  const input = page.locator(".comparison-input");
  await expect(input).toBeEnabled();
  const rect = (await input.boundingBox())!;
  const client = await context.newCDPSession(page);
  const gesture = async (
    from: { x: number; y: number },
    to: { x: number; y: number },
  ) => {
    await client.send("Input.dispatchTouchEvent", {
      type: "touchStart",
      touchPoints: [from],
    });
    for (let i = 1; i <= 10; i++) {
      await client.send("Input.dispatchTouchEvent", {
        type: "touchMove",
        touchPoints: [
          {
            x: from.x + ((to.x - from.x) * i) / 10,
            y: from.y + ((to.y - from.y) * i) / 10,
          },
        ],
      });
      await page.evaluate(
        () =>
          new Promise<void>((resolve) =>
            requestAnimationFrame(() => requestAnimationFrame(() => resolve())),
          ),
      );
    }
    await client.send("Input.dispatchTouchEvent", {
      type: "touchEnd",
      touchPoints: [],
    });
  };
  await gesture(
    { x: rect.x + rect.width * 0.58, y: rect.y + 160 },
    { x: rect.x + rect.width * 0.8, y: rect.y + 160 },
  );
  await expect
    .poll(async () => Number(await input.inputValue()))
    .toBeGreaterThan(70);
  const y = rect.y + 160;
  const checkEdge = async (value: "0" | "100") => {
    await expect(input).toHaveValue(value);
    const frame = (await page.locator(".image-comparison").boundingBox())!;
    const handle = (await page
      .locator(".comparison-divider > span")
      .boundingBox())!;
    const edge = value === "0" ? frame.x : frame.x + frame.width;
    expect(handle.x + handle.width / 2).toBeCloseTo(edge, 1);
    const visible =
      Math.min(handle.x + handle.width, frame.x + frame.width) -
      Math.max(handle.x, frame.x);
    expect(visible).toBeCloseTo(handle.width / 2, 1);
    await expect(page.locator(".image-comparison")).toHaveCSS(
      "overflow",
      "hidden",
    );
  };
  await gesture(
    { x: rect.x + rect.width * 0.8, y },
    { x: rect.x + rect.width - 1, y },
  );
  await checkEdge("100");
  // The visible half remains usable for dragging back into the image.
  await gesture(
    { x: rect.x + rect.width - 4, y },
    { x: rect.x + rect.width * 0.2, y },
  );
  await expect
    .poll(async () => Number(await input.inputValue()))
    .toBeLessThan(30);
  await gesture({ x: rect.x + rect.width * 0.2, y }, { x: rect.x + 1, y });
  await checkEdge("0");
  await gesture({ x: rect.x + 4, y }, { x: rect.x + rect.width * 0.6, y });
  await expect
    .poll(async () => Number(await input.inputValue()))
    .toBeGreaterThan(50);
  await gesture({ x: 100, y: rect.y + 180 }, { x: 100, y: rect.y + 40 });
  await expect.poll(() => page.evaluate(() => scrollY)).toBeGreaterThan(50);
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  await context.close();
});

test("reduced motion still allows deliberate comparison and navigation resets it", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  const input = page.locator(".comparison-input");
  await expect(input).toBeEnabled();
  await input.focus();
  await page.keyboard.press("Home");
  await expect(page.locator(".image-comparison")).toHaveCSS(
    "--comparison",
    "0%",
  );
  await page.locator(".editorial-explore").click();
  await expect(page).toHaveURL(/\/contact$/);
  await page.goBack();
  await expect(input).toHaveValue("58");
});

test("a missing sketch leaves the concept image and Contact usable", async ({
  page,
}) => {
  await page.route("**/construction-*-drawing.svg", (route) => route.abort());
  await page.goto("/");
  await expect(page.locator(".comparison-input")).toHaveCount(0);
  await expect(page.locator(".comparison-image")).toBeVisible();
  await expect(page.locator(".editorial-explore")).toHaveAttribute(
    "href",
    "/contact",
  );
});

test("JavaScript-free rendering keeps the comparison visible without a dead control", async ({
  browser,
}) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto("http://localhost:3000");
  await expect(page.locator(".image-comparison img")).toHaveCount(2);
  await expect(page.locator(".comparison-drawing")).toBeVisible();
  await expect(page.locator(".comparison-input")).toBeHidden();
  await expect(page.locator(".comparison-divider > span")).toBeHidden();
  await context.close();
});
