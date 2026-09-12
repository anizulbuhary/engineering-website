"use client";

import { useEffect, useRef } from "react";
import { detailStudy as copy } from "@/content/detail-study";

// Keep the drafting sequence coordinated, with about 2.7 seconds to read its build-up.
const DRAWING_TIME_SCALE = 1.65;

/** Original communication schematic; no design dimensions or construction claims. */
export function DetailDrawing() {
  const drawing = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const svg = drawing.current;
    if (!svg || !svg.animate || !("IntersectionObserver" in window)) return;
    const preference = matchMedia("(prefers-reduced-motion: reduce)");
    const controls = svg.closest("fieldset");
    const animations: Animation[] = [];
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        svg.dataset.drawn = "true";
        if (preference.matches || controls?.contains(document.activeElement))
          return;

        const animate = (
          target: Element,
          frames: Keyframe[],
          delay: number,
          duration: number,
        ) => {
          const animation = target.animate(frames, {
            delay: delay * DRAWING_TIME_SCALE,
            duration: duration * DRAWING_TIME_SCALE,
            easing: "cubic-bezier(.2,.65,.25,1)",
            fill: "backwards",
          });
          animation.id = "detail-draw";
          animations.push(animation);
        };
        const phases = [
          [".detail-grid", 0, 500],
          [".detail-context", 100, 700],
          [".detail-interface", 240, 900],
          [".detail-reinforcement", 550, 700],
          [".detail-reference", 800, 550],
        ] as const;
        phases.forEach(([selector, delay, duration]) => {
          svg
            .querySelectorAll<SVGGeometryElement>(
              `${selector} path, ${selector} circle`,
            )
            .forEach((path, index) => {
              const offset = delay + Math.min(index * 25, 120);
              // Preserve dashed drafting conventions and solid symbol fills.
              if (
                selector === ".detail-grid" ||
                path.hasAttribute("stroke-dasharray") ||
                path.getAttribute("stroke") === "none"
              ) {
                animate(path, [{ opacity: 0 }, { opacity: 1 }], offset, 400);
                return;
              }
              const length = path.getTotalLength();
              animate(
                path,
                [
                  {
                    strokeDasharray: `${length} ${length}`,
                    strokeDashoffset: length,
                  },
                  {
                    strokeDasharray: `${length} ${length}`,
                    strokeDashoffset: 0,
                  },
                ],
                offset,
                duration,
              );
            });
        });
        svg.querySelectorAll(".detail-type text").forEach((label, index) => {
          animate(
            label,
            [{ opacity: 0 }, { opacity: 1 }],
            1100 + index * 30,
            350,
          );
        });
      },
      { threshold: 0.15 },
    );
    const finish = () => {
      observer.disconnect();
      svg.dataset.drawn = "true";
      animations.forEach((animation) => animation.cancel());
    };
    const preferenceChanged = () => {
      if (preference.matches) finish();
    };
    if (preference.matches) finish();
    else observer.observe(svg);
    preference.addEventListener("change", preferenceChanged);
    controls?.addEventListener("focusin", finish);
    controls?.addEventListener("change", finish);
    return () => {
      observer.disconnect();
      animations.forEach((animation) => animation.cancel());
      preference.removeEventListener("change", preferenceChanged);
      controls?.removeEventListener("focusin", finish);
      controls?.removeEventListener("change", finish);
    };
  }, []);

  return (
    <svg
      ref={drawing}
      viewBox="0 0 760 480"
      role="img"
      aria-label={copy.figureAlt}
      className="detail-drawing"
    >
      <g
        className="detail-grid"
        fill="none"
        stroke="currentColor"
        strokeWidth="0.7"
      >
        {[80, 160, 240, 320, 400, 480, 560, 640, 720].map((x) => (
          <path key={x} d={`M${x} 45V425`} />
        ))}
        {[80, 160, 240, 320, 400].map((y) => (
          <path key={y} d={`M40 ${y}H720`} />
        ))}
      </g>
      <g
        className="detail-context"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.2"
      >
        <path
          d="M48 158H202M48 226H202M48 158l8 17-16 13 16 13-16 13 8 12M340 60V153M340 308V432"
          strokeDasharray="8 7"
        />
        <path
          d="M203 158H536V226H379V374H303V226H203"
          fill="var(--color-paper)"
          strokeWidth="2"
        />
        <path d="M291 374l13-8 12 16 13-16 12 16 13-16 12 16 13-8" />
        <path d="M536 158V226" strokeWidth="3" />
        <path d="M536 226l36 36h78M378 303h56l25 25h75" />
      </g>
      <g
        className="detail-layer detail-interface"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
      >
        <path d="M203 158H536V226H379V347M303 347V226H203" />
        <path
          d="M303 226H379V272H303Z"
          fill="currentColor"
          fillOpacity=".08"
          stroke="none"
        />
        <path
          d="M291 244h-30m0 0 6-5m-6 5 6 5M390 244h30m0 0-6-5m6 5-6 5"
          strokeWidth="1"
        />
      </g>
      <g
        className="detail-layer detail-reinforcement"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      >
        <path d="M219 176H510q8 0 8 8v17q0 8-8 8H219M321 347V188h42v159" />
        {[252, 282, 405, 436, 468].map((x) => (
          <path key={x} d={`M${x} 181v23`} strokeWidth="1.5" />
        ))}
        {[239, 271, 302, 333].map((y) => (
          <path key={y} d={`M316 ${y}h52`} strokeWidth="1.5" />
        ))}
      </g>
      <g
        className="detail-layer detail-reference"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      >
        <path d="M515 129V102H607V66H714V135H607V102" />
        <path d="M636 66v69M682 66v69M607 100h107" />
        <path
          d="M673 100h62M673 92v8m-5-5 5 5 5-5M735 92v8m-5-5 5 5 5-5"
          strokeWidth="2"
        />
        <circle cx="515" cy="129" r="14" fill="var(--color-paper)" />
        <path d="M503 143l12 10 12-10" fill="currentColor" stroke="none" />
      </g>
      <g fill="currentColor" className="detail-type">
        <text x="48" y="48">
          {copy.labels.section}
        </text>
        <text x="548" y="282">
          {copy.labels.slab}
        </text>
        <text x="461" y="347">
          {copy.labels.column}
        </text>
        <text x="606" y="159">
          {copy.labels.plan}
        </text>
        <text x="511" y="134" className="detail-axis">
          {copy.labels.axis}
        </text>
        <text x="48" y="440">
          {copy.sheet}
        </text>
        <text x="714" y="440" textAnchor="end">
          {copy.labels.reference}
        </text>
      </g>
    </svg>
  );
}
