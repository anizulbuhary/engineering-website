import Image from "next/image";
import type { Project } from "@/types/content";
import { projects } from "@/content/projects";
import { Breadcrumbs } from "@/components/ui/Primitives";
import { ProjectCard } from "./ProjectCard";
export function ProjectDetail({ project: p }: { project: Project }) {
  return (
    <>
      <div className="shell">
        <Breadcrumbs parent="Projects" href="/projects" title={p.title} />
        <div className="py-12 md:py-20">
          <p className="eyebrow text-accent mb-7">CONCEPT STUDY / {p.sector}</p>
          <h1 className="display">{p.title}</h1>
          <p className="max-w-xl text-muted leading-relaxed mt-8">
            {p.description}
          </p>
        </div>
        <div className="relative aspect-[4/3] md:aspect-[2/1]">
          <Image
            src={p.image}
            alt={p.alt}
            fill
            preload
            sizes="100vw"
            className="object-cover"
          />
        </div>
        <p className="eyebrow text-muted mt-4">
          ILLUSTRATIVE RENDERING / NOT A COMPLETED CLIENT PROJECT
        </p>
      </div>
      <section className="shell section-space grid md:grid-cols-[1fr_2fr] gap-14">
        <dl className="text-sm">
          <dt className="eyebrow text-accent mb-3">SECTOR</dt>
          <dd className="mb-8">{p.sector}</dd>
          <dt className="eyebrow text-accent mb-3">STUDY SCOPE</dt>
          <dd className="mb-8">{p.scope}</dd>
          <dt className="eyebrow text-accent mb-3">STATUS</dt>
          <dd>Independent concept demonstration</dd>
        </dl>
        <div className="space-y-12">
          <div>
            <h2 className="text-3xl tracking-tight">The question</h2>
            <p className="mt-5 leading-relaxed text-muted">{p.challenge}</p>
          </div>
          <div>
            <h2 className="text-3xl tracking-tight">A considered approach</h2>
            <p className="mt-5 leading-relaxed text-muted">{p.approach}</p>
          </div>
          <div>
            <h2 className="text-3xl tracking-tight mb-5">Study outputs</h2>
            <ul>
              {p.deliverables.map((d, i) => (
                <li key={d} className="border-t border-line py-4 flex gap-6">
                  <span className="eyebrow text-accent">0{i + 1}</span>
                  {d}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
      <section className="shell pb-24">
        <div className="grid md:grid-cols-2 gap-8">
          <figure>
            <Image
              src="/graphics/samples/slab-plan.svg"
              width={900}
              height={640}
              alt="Illustrative structural bay plan"
              className="w-full bg-concrete p-6"
            />
            <figcaption className="eyebrow text-muted mt-4">
              SUPPORTING SCHEMATIC / NOT FOR CONSTRUCTION
            </figcaption>
          </figure>
          <figure>
            <Image
              src="/graphics/samples/coordination-view.svg"
              width={900}
              height={640}
              alt="Illustrative structural interface diagram"
              className="w-full bg-concrete p-6"
            />
            <figcaption className="eyebrow text-muted mt-4">
              INTERFACE STUDY / NOT TO SCALE
            </figcaption>
          </figure>
        </div>
      </section>
      <section className="shell section-space border-t border-line">
        <p className="eyebrow text-accent mb-7">CONTINUE EXPLORING</p>
        <h2 className="heading mb-12">Related studies.</h2>
        <div className="grid md:grid-cols-2 gap-8">
          {projects
            .filter((x) => x.slug !== p.slug)
            .slice(0, 2)
            .map((x) => (
              <ProjectCard
                key={x.slug}
                project={x}
                index={projects.indexOf(x)}
              />
            ))}
        </div>
      </section>
    </>
  );
}
