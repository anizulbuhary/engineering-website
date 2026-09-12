"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { NAVIGATION_SCROLL } from "@/lib/navigation-scroll";

function moveToDestination(url: URL, withinPage: boolean) {
  let id = url.hash.slice(1);
  try {
    id = decodeURIComponent(id);
  } catch {
    // A malformed fragment should not break ordinary page navigation.
  }
  const target = id ? document.getElementById(id) : null;
  const behavior =
    withinPage && !matchMedia("(prefers-reduced-motion: reduce)").matches
      ? "smooth"
      : "instant";
  const focus = target ?? document.querySelector<HTMLElement>("main");
  if (focus) {
    if (!focus.hasAttribute("tabindex")) {
      focus.setAttribute("tabindex", "-1");
      focus.addEventListener("blur", () => focus.removeAttribute("tabindex"), {
        once: true,
      });
    }
    focus.focus({ preventScroll: true });
  }
  if (target) target.scrollIntoView({ block: "start", behavior });
  else window.scrollTo({ top: 0, left: 0, behavior });
}

export function NavigationScroll() {
  const pathname = usePathname();
  const pending = useRef<URL | null>(null);

  useEffect(() => {
    let frame = 0;
    const reset = () => {
      pending.current = null;
      cancelAnimationFrame(frame);
    };
    const navigate = (event: Event) => {
      reset();
      const url = new URL((event as CustomEvent<string>).detail);
      if (url.origin !== location.origin) return;
      if (
        url.pathname === location.pathname &&
        url.search === location.search
      ) {
        frame = requestAnimationFrame(() => moveToDestination(url, true));
      } else pending.current = url;
    };
    window.addEventListener(NAVIGATION_SCROLL, navigate);
    window.addEventListener("popstate", reset);
    window.addEventListener("pagehide", reset);
    return () => {
      reset();
      window.removeEventListener(NAVIGATION_SCROLL, navigate);
      window.removeEventListener("popstate", reset);
      window.removeEventListener("pagehide", reset);
    };
  }, []);

  useLayoutEffect(() => {
    const url = pending.current;
    if (!url || url.pathname !== pathname) return;
    pending.current = null;
    // Set the destination before paint; never animate through a newly opened page.
    moveToDestination(url, false);
  }, [pathname]);

  return null;
}
