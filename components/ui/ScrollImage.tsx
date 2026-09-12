"use client";
import { useEffect, useRef, type ReactNode } from "react";
import { observeDrift } from "@/lib/scroll-drift";

export function ScrollImage({ children }: { children: ReactNode }) {
  const frame = useRef<HTMLDivElement>(null);
  const image = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const host = frame.current,
      target = image.current;
    if (!host || !target || !("IntersectionObserver" in window)) return;
    const motion = matchMedia("(prefers-reduced-motion: reduce)");
    let visible = false;
    let unsubscribe: (() => void) | undefined;
    const sync = () => {
      unsubscribe?.();
      unsubscribe = undefined;
      if (motion.matches) target.style.setProperty("--image-drift", "0px");
      else if (visible) unsubscribe = observeDrift(host, target);
    };
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      sync();
    });
    observer.observe(host);
    motion.addEventListener("change", sync);
    return () => {
      observer.disconnect();
      unsubscribe?.();
      motion.removeEventListener("change", sync);
    };
  }, []);
  return (
    <div ref={frame} className="scroll-image">
      <div ref={image} className="scroll-image-inner">
        {children}
      </div>
    </div>
  );
}
