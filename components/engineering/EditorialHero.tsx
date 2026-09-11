"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { home } from "@/content/pages";
import { editorialHero as copy } from "@/content/engineering-story";

export function EditorialHero() {
  const section = useRef<HTMLElement>(null);
  useEffect(() => {
    const media = matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    const update = () => {
      frame = 0;
      const element = section.current;
      if (!element) return;
      const progress = media.matches
        ? 0
        : Math.min(
            1,
            Math.max(
              0,
              -element.getBoundingClientRect().top / (innerHeight * 0.65),
            ),
          );
      element.style.setProperty("--hero-reveal", String(progress));
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    addEventListener("scroll", schedule, { passive: true });
    addEventListener("resize", schedule);
    media.addEventListener("change", schedule);
    schedule();
    return () => {
      cancelAnimationFrame(frame);
      removeEventListener("scroll", schedule);
      removeEventListener("resize", schedule);
      media.removeEventListener("change", schedule);
    };
  }, []);

  return (
    <section ref={section} className="editorial-hero" aria-label={copy.label}>
      <div className="editorial-heading shell">
        <div className="editorial-topline eyebrow">
          <span>{home.eyebrow}</span>
          <span>{copy.label}</span>
        </div>
        <div className="editorial-intro">
          <h1>
            {copy.title[0]} <br />
            {copy.title[1]} <em>{copy.title[2]}</em>
          </h1>
          <div className="editorial-summary">
            <p>{home.intro}</p>
            <a className="editorial-explore" href="#engineering-story">
              {copy.action}
              <ArrowUpRight size={20} />
            </a>
          </div>
        </div>
      </div>
      <figure className="editorial-figure">
        <div className="editorial-image">
          <Image
            src={copy.image}
            alt={copy.imageAlt}
            fill
            sizes="100vw"
            priority
          />
          <div className="editorial-image-mark" aria-hidden="true">
            <ArrowDown size={26} />
          </div>
        </div>
        <figcaption className="editorial-caption shell eyebrow">
          <span>{copy.caption}</span>
          <span>
            {copy.scroll}
            <ArrowDown size={12} />
          </span>
        </figcaption>
      </figure>
    </section>
  );
}
