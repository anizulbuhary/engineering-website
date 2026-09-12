import { Reveal } from "@/components/ui/Reveal";
import Image from "next/image";
import { EditorialHero } from "@/components/engineering/EditorialHero";
import { home, process } from "@/content/pages";
import { projects } from "@/content/projects";
import { samples } from "@/content/samples";
import { TextLink } from "@/components/ui/Primitives";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { sectionCopy as copy } from "@/content/sections";
export function Hero() {
  return <EditorialHero />;
}
export function Positioning() {
  return (
    <section
      id="positioning"
      className="shell section-space grid md:grid-cols-[1fr_2fr] gap-10"
    >
      <Reveal>
        <p className="eyebrow text-accent">{copy.positioning.label}</p>
      </Reveal>
      <div>
        <Reveal rule className="border-t border-line pt-6">
          <h2 className="heading max-w-3xl">{home.positioning}</h2>
        </Reveal>
        <Reveal stagger delay={70} className="grid lg:grid-cols-2 gap-8 mt-9">
          <p className="text-lg leading-relaxed max-w-lg">
            {home.positioningBody}
          </p>
          <div>
            <p className="text-sm text-muted leading-relaxed">
              {home.positioningFoot}
            </p>
            <TextLink href="/about" className="mt-5">
              {copy.positioning.link}
            </TextLink>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
export function SelectedProjects() {
  return (
    <section className="shell section-space border-t border-line">
      <Reveal
        stagger
        className="flex flex-wrap gap-8 justify-between items-end mb-14"
      >
        <div>
          <p className="eyebrow text-accent mb-6">{copy.projects.label}</p>
          <h2 className="heading">{copy.projects.title}</h2>
        </div>
        <TextLink href="/projects">{copy.projects.link}</TextLink>
      </Reveal>
      <div className="grid md:grid-cols-2 gap-10 md:gap-8">
        {projects
          .filter((p) => p.featured)
          .map((p, i) => (
            <div key={p.slug} className={i === 1 ? "md:pt-24" : ""}>
              <ProjectCard project={p} index={i} />
            </div>
          ))}
      </div>
      <p className="eyebrow text-muted mt-8">{copy.projects.note}</p>
    </section>
  );
}
export function ProcessSection() {
  return (
    <section className="bg-concrete">
      <div className="shell section-space">
        <Reveal stagger className="grid md:grid-cols-2 gap-10 mb-16">
          <p className="eyebrow text-accent">{copy.process.label}</p>
          <h2 className="heading whitespace-pre-line">{copy.process.title}</h2>
        </Reveal>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
          {process.map((p, i) => (
            <Reveal
              key={p.title}
              rule
              delay={i * 70}
              className="process-step border-t border-ink/30 pt-6"
            >
              <span className="eyebrow">0{i + 1}</span>
              <h3 className="text-2xl tracking-tight mt-10 mb-4">{p.title}</h3>
              <p className="text-sm leading-relaxed text-muted">{p.text}</p>
            </Reveal>
          ))}
        </div>
        <div className="mt-12 flex justify-end">
          <TextLink href="/why-us">{copy.process.link}</TextLink>
        </div>
      </div>
    </section>
  );
}
export function SamplesPreview() {
  return (
    <section className="shell section-space grid md:grid-cols-2 gap-12 lg:gap-24 items-center">
      <Reveal variant="image" className="bg-concrete p-5 md:p-10">
        <Image
          src={samples[0].image}
          width={900}
          height={640}
          alt="Illustrative slab drawing with grid references"
          className="w-full h-auto"
        />
      </Reveal>
      <Reveal stagger delay={70}>
        <p className="eyebrow text-accent mb-7">{copy.samples.label}</p>
        <h2 className="heading whitespace-pre-line">{copy.samples.title}</h2>
        <p className="text-muted text-sm leading-relaxed max-w-md mt-7">
          {copy.samples.description}
        </p>
        <TextLink href="/samples" className="mt-7">
          {copy.samples.link}
        </TextLink>
      </Reveal>
    </section>
  );
}
