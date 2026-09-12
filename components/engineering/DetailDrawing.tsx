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
            1100 + Math.min(index * 30, 180),
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
        {/* Material cut lines and dimension witnesses retain their drafting hierarchy. */}
        {Array.from({ length: 24 }, (_, i) => 212 + i * 13).map((x) => (
          <path
            key={x}
            d={`M${x} 159l-7 8${x < 296 || x > 379 ? `M${x} 225l7-8` : ""}`}
            strokeWidth=".6"
          />
        ))}
        <path
          d="M543 158h34M543 226h34M565 154v76M561 162l8-8M561 230l8-8M303 385v25M379 385v25M299 401h84M299 405l8-8M375 405l8-8"
          strokeWidth=".7"
        />
        <path
          d="M85 304h120v86H85ZM90 309h110v76H90Z"
          fill="var(--color-paper)"
        />
        <path
          d="M75 347h140M145 293v108"
          strokeDasharray="5 5"
          strokeWidth=".6"
        />
        <path d="M203 116h100l18 42M432 209l25-86h36" strokeWidth=".7" />
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
        {[239, 260, 281, 405, 426, 447, 468, 489].map((x) => (
          <path key={x} d={`M${x} 181v23`} strokeWidth="1.5" />
        ))}
        {[231, 247, 263, 286, 309, 332].map((y) => (
          <path key={y} d={`M316 ${y + 4}v-4h52v4`} strokeWidth="1.5" />
        ))}
        <path
          d="M334 347V198h-12M350 347V198h12M219 193h83m78 0h120"
          strokeWidth="1.6"
        />
        <path
          d="M99 318h92v58H99Z M130 318v58M160 318v58M99 337h92M99 357h92"
          strokeWidth="1.2"
        />
        {[104, 130, 160, 186].flatMap((x) =>
          [323, 371].map((y) => (
            <circle
              key={`${x}-${y}`}
              cx={x}
              cy={y}
              r="2.3"
              fill="currentColor"
              stroke="none"
            />
          )),
        )}
        {[341, 354].flatMap((y) =>
          [104, 186].map((x) => (
            <circle
              key={`${x}-${y}`}
              cx={x}
              cy={y}
              r="2.3"
              fill="currentColor"
              stroke="none"
            />
          )),
        )}
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
          d="M610 70h101v61H610ZM657 71v59M610 84h101M610 116h101M644 90h26v23h-26Z"
          strokeWidth=".7"
        />
        {[636, 682].flatMap((x) =>
          [84, 116].map((y) => (
            <path
              key={`${x}-${y}`}
              d={`M${x - 2} ${y - 2}h4v4h-4Z`}
              fill="currentColor"
              stroke="none"
            />
          )),
        )}
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
        <text x="85" y="287" fontSize="9">
          {copy.labels.cageSection}
        </text>
        <text x="203" y="106" fontSize="9">
          {copy.labels.supportBars}
        </text>
        <text x="457" y="114" fontSize="9">
          {copy.labels.edgeReturn}
        </text>
        <text x="578" y="197" fontSize="9">
          {copy.labels.slabDepth}
        </text>
        <text x="341" y="395" fontSize="9" textAnchor="middle">
          {copy.labels.supportWidth}
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
