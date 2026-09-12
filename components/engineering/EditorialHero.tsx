"use client";

import Image from "next/image";
import Link from "@/components/ui/SiteLink";
import { Reveal } from "@/components/ui/Reveal";
import { TextLink } from "@/components/ui/Primitives";
import { useEffect, useRef } from "react";
import { ArrowUpRight } from "lucide-react";
import { home } from "@/content/pages";
import { editorialHero as copy } from "@/content/engineering-story";
import { ImageComparison } from "./ImageComparison";

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
          <Reveal>
            <h1>
              <span className="editorial-title-line">{copy.title[0]} </span>
              <span className="editorial-title-line">
                {copy.title[1]} <em>{copy.title[2]}</em>
              </span>
            </h1>
          </Reveal>
          <div className="editorial-summary">
            <Reveal delay={70}>
              <p>{home.intro}</p>
            </Reveal>
            <Reveal delay={140}>
              <Link className="editorial-explore" href={copy.actionHref}>
                {copy.action}
                <ArrowUpRight size={20} />
              </Link>
            </Reveal>
          </div>
        </div>
      </div>
      <figure className="editorial-figure">
        <ImageComparison />
        <figcaption className="hero-companion shell">
          <Reveal rule className="hero-companion-inner">
            <div className="hero-companion-caption">
              <p className="eyebrow text-accent">{copy.caption}</p>
              <p className="hero-companion-title">{copy.companion.title}</p>
              <p className="text-sm text-muted leading-relaxed max-w-md">
                {copy.companion.description}
              </p>
            </div>
            <div className="hero-companion-detail">
              <div className="hero-detail-crop">
                <Image
                  src={copy.image}
                  alt={copy.companion.imageAlt}
                  fill
                  sizes="(max-width: 767px) 400px, 600px"
                />
              </div>
              <div>
                <p className="eyebrow text-muted">{copy.companion.label}</p>
                <TextLink href={copy.companion.href}>
                  {copy.companion.link}
                </TextLink>
              </div>
            </div>
          </Reveal>
        </figcaption>
      </figure>
    </section>
  );
}
