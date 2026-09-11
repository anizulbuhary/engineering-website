"use client";
import { useState } from "react";
import type { Project } from "@/types/content";
import { ProjectCard } from "./ProjectCard";
export function ProjectFilter({ projects }: { projects: Project[] }) {
  const [active, setActive] = useState("All");
  const filtered = projects.filter(
    (p) => active === "All" || p.sector === active,
  );
  return (
    <section className="shell pb-24">
      <div
        aria-label="Filter projects by sector"
        className="flex gap-x-7 gap-y-2 flex-wrap border-y border-line py-4 mb-12"
      >
        {["All", ...new Set(projects.map((p) => p.sector))].map((v) => (
          <button
            key={v}
            aria-pressed={active === v}
            onClick={() => setActive(v)}
            className="text-xs py-3 border-b border-transparent aria-pressed:border-accent aria-pressed:text-accent"
          >
            {v}
            {v === "All" && (
              <span className="ml-2 text-[10px]">
                ({projects.length.toString().padStart(2, "0")})
              </span>
            )}
          </button>
        ))}
      </div>
      <p role="status" className="sr-only">
        {filtered.length} concept projects shown
      </p>
      <div className="grid md:grid-cols-2 gap-x-8 gap-y-14">
        {filtered.map((p) => (
          <ProjectCard
            key={p.slug}
            project={p}
            index={projects.indexOf(p)}
            headingLevel="h2"
          />
        ))}
      </div>
    </section>
  );
}
