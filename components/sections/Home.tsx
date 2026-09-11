import Image from "next/image";
import { ArrowDown } from "lucide-react";
import { home, process } from "@/content/pages";
import { projects } from "@/content/projects";
import { samples } from "@/content/samples";
import { TextLink } from "@/components/ui/Primitives";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { sectionCopy as copy } from "@/content/sections";
export function Hero() {
  return (
    <section className="shell pt-10 md:pt-14">
      <div className="flex justify-between gap-6">
        <p className="eyebrow">{home.eyebrow}</p>
        <p className="eyebrow text-muted hidden sm:block">{copy.hero.rhythm}</p>
      </div>
      <div className="grid md:grid-cols-[1.5fr_1fr] gap-8 items-end mt-8 mb-10">
        <h1 className="display">
          {home.heading[0]}
          <br />
          <span className="text-rust">{home.heading[1]}</span>
        </h1>
        <div className="md:max-w-xs md:ml-auto md:pb-2">
          <p className="text-sm leading-relaxed text-muted">{home.intro}</p>
          <TextLink href="/projects" className="mt-5 w-full">
            {copy.hero.link}
          </TextLink>
        </div>
      </div>
      <div className="relative h-[380px] md:h-[520px] lg:h-[570px] bg-concrete overflow-hidden">
        <Image
          src="/images/projects/frame.webp"
          alt="Illustrative exposed concrete structure seen from below, with repeating slabs and columns"
          fill
          preload
          sizes="100vw"
          className="object-cover object-[center_58%]"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/35 via-transparent to-transparent" />
        <div className="absolute inset-x-5 md:inset-x-8 bottom-6 flex justify-between items-end text-white">
          <p className="eyebrow">
            {copy.hero.imageTitle}
            <br />
            <span className="opacity-80">{copy.hero.imageNote}</span>
          </p>
          <a
            href="#positioning"
            className="h-11 w-11 border border-white/60 grid place-items-center"
            aria-label="Explore the studio"
          >
            <ArrowDown size={18} />
          </a>
        </div>
        <div
          aria-hidden
          className="absolute top-7 left-7 w-5 h-5 border-t border-l border-white/75"
        />
        <div
          aria-hidden
          className="absolute top-7 right-7 w-5 h-5 border-t border-r border-white/75"
        />
      </div>
      <div className="flex flex-wrap justify-between gap-3 py-5 eyebrow text-muted border-b border-line">
        <span>{copy.hero.journey}</span>
        <span>{copy.hero.disciplines}</span>
      </div>
    </section>
  );
}
export function Positioning() {
  return (
    <section
      id="positioning"
      className="shell section-space grid md:grid-cols-[1fr_2fr] gap-10"
    >
      <p className="eyebrow text-accent">{copy.positioning.label}</p>
      <div>
        <h2 className="heading max-w-3xl">{home.positioning}</h2>
        <div className="grid lg:grid-cols-2 gap-8 mt-9">
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
        </div>
      </div>
    </section>
  );
}
export function SelectedProjects() {
  return (
    <section className="shell section-space border-t border-line">
      <div className="flex flex-wrap gap-8 justify-between items-end mb-14">
        <div>
          <p className="eyebrow text-accent mb-6">{copy.projects.label}</p>
          <h2 className="heading">{copy.projects.title}</h2>
        </div>
        <TextLink href="/projects">{copy.projects.link}</TextLink>
      </div>
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
        <div className="grid md:grid-cols-2 gap-10 mb-16">
          <p className="eyebrow text-accent">{copy.process.label}</p>
          <h2 className="heading whitespace-pre-line">{copy.process.title}</h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
          {process.map((p, i) => (
            <div key={p.title} className="border-t border-ink/30 pt-6">
              <span className="eyebrow">0{i + 1}</span>
              <h3 className="text-2xl tracking-tight mt-10 mb-4">{p.title}</h3>
              <p className="text-sm leading-relaxed text-muted">{p.text}</p>
            </div>
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
      <div className="bg-concrete p-5 md:p-10">
        <Image
          src={samples[0].image}
          width={900}
          height={640}
          alt="Illustrative slab drawing with grid references"
          className="w-full h-auto"
        />
      </div>
      <div>
        <p className="eyebrow text-accent mb-7">{copy.samples.label}</p>
        <h2 className="heading whitespace-pre-line">{copy.samples.title}</h2>
        <p className="text-muted text-sm leading-relaxed max-w-md mt-7">
          {copy.samples.description}
        </p>
        <TextLink href="/samples" className="mt-7">
          {copy.samples.link}
        </TextLink>
      </div>
    </section>
  );
}
