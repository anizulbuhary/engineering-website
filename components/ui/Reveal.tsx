"use client";

import { useEffect, useRef, type ReactNode } from "react";

/** Progressive enhancement: content stays visible before JS and on failure. */
export function Reveal({
  children,
  className,
  id,
  as: Tag = "div",
  variant = "rise",
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  id?: string;
  as?: "div" | "article";
  variant?: "rise" | "image";
  delay?: number;
}) {
  const element = useRef<HTMLElement | null>(null);
  useEffect(() => {
    const node = element.current;
    if (!node || !node.animate || !("IntersectionObserver" in window)) return;
    const preference = matchMedia("(prefers-reduced-motion: reduce)");
    let animation: Animation | undefined;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        node.dataset.revealed = "true";
        if (preference.matches || node.contains(document.activeElement)) return;
        animation = node.animate(
          variant === "image"
            ? [
                { clipPath: "inset(0 0 7% 0)", opacity: 0.8 },
                { clipPath: "inset(0)", opacity: 1 },
              ]
            : [
                { transform: "translateY(16px)" },
                { transform: "translateY(0)" },
              ],
          {
            duration: variant === "image" ? 800 : 620,
            delay: Math.min(180, Math.max(0, delay)),
            easing: "cubic-bezier(.2,.65,.25,1)",
            fill: "backwards",
          },
        );
      },
      { threshold: 0.08 },
    );
    observer.observe(node);
    const finish = () => animation?.cancel();
    const preferenceChanged = () => {
      if (preference.matches) finish();
    };
    preference.addEventListener("change", preferenceChanged);
    node.addEventListener("focusin", finish);
    return () => {
      observer.disconnect();
      finish();
      preference.removeEventListener("change", preferenceChanged);
      node.removeEventListener("focusin", finish);
    };
  }, [variant, delay]);

  return (
    <Tag
      ref={(node) => {
        element.current = node;
      }}
      id={id}
      className={className}
      data-motion={variant}
    >
      {children}
    </Tag>
  );
}
