"use client";

import { useEffect, useRef, type ReactNode } from "react";

type RevealProps = {
  children: ReactNode;
  className?: string;
  id?: string;
  as?: "div" | "article" | "section" | "aside" | "figure" | "li";
  variant?: "rise" | "image" | "fade";
  delay?: number;
  stagger?: boolean;
  rule?: boolean;
};

/** Content is always readable without JavaScript or animation support. */
export function Reveal({
  children,
  className = "",
  id,
  as: Tag = "div",
  variant = "rise",
  delay = 0,
  stagger = false,
  rule = false,
}: RevealProps) {
  const element = useRef<HTMLElement | null>(null);
  useEffect(() => {
    const node = element.current;
    if (!node || !node.animate || !("IntersectionObserver" in window)) return;
    const preference = matchMedia("(prefers-reduced-motion: reduce)");
    const phone = matchMedia("(max-width: 767px)").matches;
    const initiallyVisible =
      node.getBoundingClientRect().top < innerHeight &&
      node.getBoundingClientRect().bottom > 0;
    const animations: Animation[] = [];
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        node.dataset.revealed = "true";
        if (preference.matches || node.contains(document.activeElement)) return;
        const targets = stagger
          ? Array.from(node.children).filter(
              (child) => !child.hasAttribute("data-reveal-rule"),
            )
          : [node];
        targets.forEach((target, index) => {
          const opacity =
            initiallyVisible && variant !== "fade"
              ? 1
              : variant === "image"
                ? 0.8
                : 0.35;
          const frames =
            variant === "fade"
              ? [{ opacity: 0.4 }, { opacity: 1 }]
              : variant === "image"
                ? [
                    { clipPath: "inset(0 0 6% 0)", opacity },
                    { clipPath: "inset(0)", opacity: 1 },
                  ]
                : [
                    { transform: `translateY(${phone ? 12 : 18}px)`, opacity },
                    { transform: "translateY(0)", opacity: 1 },
                  ];
          const animation = target.animate(frames, {
            duration:
              variant === "fade"
                ? 220
                : variant === "image"
                  ? 800
                  : phone
                    ? 520
                    : 640,
            delay: Math.min(210, Math.max(0, delay + index * 70)),
            easing: "cubic-bezier(.2,.65,.25,1)",
            fill: "backwards",
          });
          animation.id = "editorial-reveal";
          animations.push(animation);
        });
        const line = node.querySelector(":scope > [data-reveal-rule]");
        if (line)
          animations.push(
            line.animate(
              [{ transform: "scaleX(0)" }, { transform: "scaleX(1)" }],
              {
                duration: 600,
                delay: Math.min(210, Math.max(0, delay)),
                easing: "cubic-bezier(.2,.65,.25,1)",
                fill: "backwards",
              },
            ),
          );
      },
      { threshold: 0.08 },
    );
    observer.observe(node);
    const finish = () => {
      observer.disconnect();
      node.dataset.revealed = "true";
      animations.forEach((animation) => animation.cancel());
    };
    const preferenceChanged = () => {
      if (preference.matches) finish();
    };
    preference.addEventListener("change", preferenceChanged);
    node.addEventListener("focusin", finish);
    return () => {
      observer.disconnect();
      animations.forEach((animation) => animation.cancel());
      preference.removeEventListener("change", preferenceChanged);
      node.removeEventListener("focusin", finish);
    };
  }, [variant, delay, stagger, rule]);
  return (
    <Tag
      ref={(node: HTMLElement | null) => {
        element.current = node;
      }}
      id={id}
      className={`${className}${rule ? " motion-rule" : ""}`}
      data-motion={variant}
      data-stagger={stagger || undefined}
    >
      {rule && <span data-reveal-rule aria-hidden="true" />}
      {children}
    </Tag>
  );
}
