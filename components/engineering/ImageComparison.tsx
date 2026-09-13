"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { MoveHorizontal } from "lucide-react";
import { editorialHero as copy } from "@/content/engineering-story";

export function ImageComparison() {
  const root = useRef<HTMLDivElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    if (!input.current || !root.current) return;
    input.current.disabled = false;
    input.current.hidden = false;
    root.current.dataset.interactive = "true";
  }, []);
  return (
    <div className="hero-comparison">
      <div
        ref={root}
        className="editorial-image image-comparison"
        style={
          { "--comparison": `${copy.comparison.initial}%` } as CSSProperties
        }
      >
        <picture>
          <source media="(max-width: 767px)" srcSet={copy.imagePortrait} />
          <Image
            className="comparison-image"
            src={copy.image}
            alt={copy.imageAlt}
            fill
            unoptimized
            loading="eager"
            fetchPriority="high"
          />
        </picture>
        {!failed && (
          <>
            <div className="comparison-drawing" aria-hidden="true">
              <picture>
                <source
                  media="(max-width: 767px)"
                  srcSet={copy.comparison.drawingPortrait}
                />
                <Image
                  src={copy.comparison.drawing}
                  alt=""
                  fill
                  unoptimized
                  loading="eager"
                  onError={() => setFailed(true)}
                />
              </picture>
            </div>
            <div className="comparison-divider" aria-hidden="true">
              <span>
                <MoveHorizontal size={18} />
              </span>
            </div>
            <input
              ref={input}
              type="range"
              min="0"
              max="100"
              step="1"
              defaultValue={copy.comparison.initial}
              hidden
              disabled
              className="comparison-input"
              aria-label={copy.comparison.label}
              aria-valuetext={copy.comparison.valueLabel.replace(
                "{value}",
                String(copy.comparison.initial),
              )}
              aria-describedby="comparison-description"
              onInput={(event) => {
                root.current?.style.setProperty(
                  "--comparison",
                  `${event.currentTarget.value}%`,
                );
                event.currentTarget.setAttribute(
                  "aria-valuetext",
                  copy.comparison.valueLabel.replace(
                    "{value}",
                    event.currentTarget.value,
                  ),
                );
              }}
            />
          </>
        )}
      </div>
      <p className="sr-only" id="comparison-description">
        {copy.comparison.description}
      </p>
    </div>
  );
}
