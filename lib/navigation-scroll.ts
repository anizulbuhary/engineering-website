export const NAVIGATION_SCROLL = "formwork:navigation-scroll";

/** Only explicit link navigation requests a new reading position. */
export function requestNavigationScroll(href: string) {
  window.dispatchEvent(
    new CustomEvent(NAVIGATION_SCROLL, {
      detail: new URL(href, location.href).href,
    }),
  );
}
