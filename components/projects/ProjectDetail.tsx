import { Reveal } from "@/components/ui/Reveal";
import Image from "next/image";
import { ScrollImage } from "@/components/ui/ScrollImage";
import type { Project } from "@/types/content";
import { projects } from "@/content/projects";
import { Breadcrumbs } from "@/components/ui/Primitives";
import { ProjectCard } from "./ProjectCard";
import { FrameDossier } from "./FrameDossier";
export function ProjectDetail({ project: p }: { project: Project }) {
  return (
    <>
      <div className="shell">
        <Breadcrumbs parent="Projects" href="/projects" title={p.title} />
        <Reveal stagger className="py-12 md:py-20">
          <p className="eyebrow text-accent mb-7">CONCEPT STUDY / {p.sector}</p>
          <h1 className="display">{p.title}</h1>
          <p className="max-w-xl text-muted leading-relaxed mt-8">
            {p.description}
          </p>
        </Reveal>
        <Reveal
          variant="image"
          className="relative aspect-[4/3] md:aspect-[2/1]"
        >
          <ScrollImage>
            <Image
              src={p.image}
              alt={p.alt}
              fill
              preload
              sizes="100vw"
              className="object-cover"
            />
          </ScrollImage>
        </Reveal>
        <p className="eyebrow text-muted mt-4">
          ILLUSTRATIVE RENDERING / NOT A COMPLETED CLIENT PROJECT
        </p>
      </div>
      {p.study === "slab-edge" ? (
        <FrameDossier scope={p.scope} />
      ) : (
        <>
          <section className="shell section-space grid md:grid-cols-[1fr_2fr] gap-14">
            <Reveal>
              <dl className="text-sm">
                <dt className="eyebrow text-accent mb-3">SECTOR</dt>
                <dd className="mb-8">{p.sector}</dd>
                <dt className="eyebrow text-accent mb-3">STUDY SCOPE</dt>
                <dd className="mb-8">{p.scope}</dd>
                <dt className="eyebrow text-accent mb-3">STATUS</dt>
                <dd>Independent concept demonstration</dd>
              </dl>
            </Reveal>
            <div className="space-y-12">
              <Reveal stagger>
                <h2 className="text-3xl tracking-tight">The question</h2>
                <p className="mt-5 leading-relaxed text-muted">{p.challenge}</p>
              </Reveal>
              <Reveal stagger>
                <h2 className="text-3xl tracking-tight">
                  A considered approach
                </h2>
                <p className="mt-5 leading-relaxed text-muted">{p.approach}</p>
              </Reveal>
              <Reveal stagger>
                <h2 className="text-3xl tracking-tight mb-5">Study outputs</h2>
                <ul>
                  {p.deliverables.map((d, i) => (
                    <li
                      key={d}
                      className="border-t border-line py-4 flex gap-6"
                    >
                      <span className="eyebrow text-accent">0{i + 1}</span>
                      {d}
                    </li>
                  ))}
                </ul>
              </Reveal>
            </div>
          </section>
          <section className="shell pb-24">
            <div className="grid md:grid-cols-2 gap-8">
              <Reveal as="figure" variant="image">
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
              </Reveal>
              <Reveal as="figure" variant="image">
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
              </Reveal>
            </div>
          </section>
        </>
      )}
      <section className="shell section-space border-t border-line">
        <Reveal stagger>
          <p className="eyebrow text-accent mb-7">CONTINUE EXPLORING</p>
          <h2 className="heading mb-12">Related studies.</h2>
        </Reveal>
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
