"use client";
import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import {
  engineeringStages,
  engineeringStory,
} from "@/content/engineering-story";
import { StructureDrawing } from "./StructureDrawing";
export function EngineeringStory() {
  const [active, setActive] = useState(0);
  const sections = useRef<(HTMLDivElement | null)[]>([]);
  const reduced = useReducedMotion();
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const e of entries)
          if (e.isIntersecting)
            setActive(Number(e.target.getAttribute("data-stage")));
      },
      { rootMargin: "-25% 0px -45% 0px", threshold: 0 },
    );
    sections.current.forEach((el) => {
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);
  return (
    <section className="bg-[#263024] text-paper">
      <div className="shell section-space">
        <div className="grid md:grid-cols-2 gap-10 mb-14">
          <p className="eyebrow text-[#d5b396]">{engineeringStory.label}</p>
          <div>
            <h2 className="heading whitespace-pre-line">
              {engineeringStory.title}
            </h2>
            <p className="mt-6 text-sm leading-relaxed text-concrete max-w-md">
              {engineeringStory.intro}
            </p>
          </div>
        </div>
        <div className="grid md:grid-cols-2 gap-10 lg:gap-20">
          <div className="hidden md:block">
            <div className="sticky top-30">
              <motion.div
                key={active}
                animate={{ opacity: 1 }}
                initial={reduced ? false : { opacity: 0.65 }}
                transition={{ duration: reduced ? 0 : 0.35 }}
              >
                <StructureDrawing stage={active} />
              </motion.div>
              <div className="flex justify-between border-t border-white/25 pt-5 eyebrow text-concrete">
                <span>ANATOMY OF A DELIVERY</span>
                <span>{engineeringStages[active].label}</span>
              </div>
            </div>
          </div>
          <div>
            {engineeringStages.map((s, i) => (
              <div
                key={s.id}
                data-stage={i}
                ref={(el) => {
                  sections.current[i] = el;
                }}
                className="py-9 md:min-h-[260px] md:flex md:flex-col md:justify-center border-t border-white/20"
              >
                <div className="md:hidden mb-6">
                  <StructureDrawing stage={i} />
                </div>
                <p className="eyebrow text-[#d5b396] mb-5">
                  0{i + 1} / {s.label}
                </p>
                <h3 className="text-2xl md:text-3xl tracking-[-.035em]">
                  {s.title}
                </h3>
                <p className="text-sm leading-relaxed text-concrete max-w-sm mt-4">
                  {s.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
