/** Shares the CSS header height, including its border, with scroll calculations. */
export function headerHeight() {
  return parseFloat(
    getComputedStyle(document.documentElement).getPropertyValue(
      "--site-header-height",
    ),
  );
}
