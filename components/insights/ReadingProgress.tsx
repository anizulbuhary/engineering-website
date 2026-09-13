"use client";

import { useEffect, useRef } from "react";
import { headerHeight } from "@/lib/header-height";

/** Decorative reading feedback; the article remains entirely server-rendered. */
export function ReadingProgress() {
  const line = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const target = line.current;
    const article = target?.closest("article");
    if (!target || !article) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      const rect = article.getBoundingClientRect();
      const distance = rect.height - (innerHeight - headerHeight());
      const progress =
        distance > 0
          ? Math.max(0, Math.min(1, (headerHeight() - rect.top) / distance))
          : rect.top <= headerHeight()
            ? 1
            : 0;
      target.style.transform = `scaleX(${progress})`;
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    addEventListener("scroll", schedule, { passive: true });
    addEventListener("resize", schedule);
    const observer = new ResizeObserver(schedule);
    observer.observe(article);
    schedule();
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      removeEventListener("scroll", schedule);
      removeEventListener("resize", schedule);
    };
  }, []);
  return <div ref={line} className="reading-progress" aria-hidden="true" />;
}
