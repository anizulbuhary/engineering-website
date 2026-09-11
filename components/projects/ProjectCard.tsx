import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Project } from "@/types/content";
export function ProjectCard({
  project,
  index = 0,
  headingLevel = "h3",
}: {
  project: Project;
  index?: number;
  headingLevel?: "h2" | "h3";
}) {
  const Heading = headingLevel;
  return (
    <article>
      <Link href={`/projects/${project.slug}`} className="group block">
        <div className="relative aspect-[4/3] overflow-hidden bg-concrete">
          <Image
            src={project.image}
            alt={project.alt}
            fill
            sizes="(max-width: 767px) 100vw, 50vw"
            className="object-cover transition-transform duration-700 group-hover:scale-[1.025]"
          />
          <span className="absolute left-4 top-4 bg-paper px-3 py-1.5 eyebrow">
            CONCEPT STUDY / 0{index + 1}
          </span>
          <span className="absolute bottom-5 right-5 grid h-11 w-11 place-items-center bg-paper text-ink">
            <ArrowUpRight size={20} aria-hidden />
          </span>
        </div>
        <div className="flex justify-between gap-4 mt-5">
          <Heading className="text-2xl md:text-3xl tracking-[-.04em] group-hover:text-accent">
            {project.title}
          </Heading>
          <span className="eyebrow pt-2 text-muted">{project.sector}</span>
        </div>
        <p className="text-xs text-muted mt-2">{project.scope}</p>
      </Link>
    </article>
  );
}
