import { Reveal } from "@/components/ui/Reveal";
import Image from "next/image";
import { ScrollImage } from "@/components/ui/ScrollImage";
import { principles, contact } from "@/content/pages";
import { ContactForm } from "@/components/forms/ContactForm";
import { sectionCopy as copy } from "@/content/sections";
export function StudioImage() {
  return (
    <figure className="shell">
      <Reveal
        variant="image"
        className="relative aspect-[4/3] md:aspect-[2.4/1]"
      >
        <ScrollImage>
          <Image
            src="/images/projects/courtyard.webp"
            alt="Illustrative concrete courtyard and colonnade"
            fill
            sizes="100vw"
            className="object-cover"
          />
        </ScrollImage>
      </Reveal>
      <figcaption className="eyebrow text-muted mt-4">
        {copy.studio.imageCaption}
      </figcaption>
    </figure>
  );
}
export function Principles({ about = false }: { about?: boolean }) {
  return (
    <section className="shell section-space grid md:grid-cols-[1fr_2fr] gap-12">
      <Reveal stagger>
        <p className="eyebrow text-accent">
          {about ? copy.studio.aboutLabel : copy.studio.whyLabel}
        </p>
        <h2 className="text-3xl tracking-tight mt-7">
          {about ? copy.studio.aboutTitle : copy.studio.whyTitle}
        </h2>
      </Reveal>
      <div>
        {principles.map((p, i) => (
          <Reveal
            as="article"
            rule
            stagger
            key={p.title}
            className="border-t border-line pt-7 pb-10"
          >
            <span className="eyebrow text-accent">0{i + 1}</span>
            <h3 className="text-2xl md:text-3xl tracking-tight mt-4">
              {p.title}
            </h3>
            <p className="text-muted leading-relaxed mt-5 max-w-xl">{p.text}</p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
export function ContactSection() {
  return (
    <section className="shell pb-24 grid lg:grid-cols-[1fr_2fr] gap-14 lg:gap-24">
      <Reveal as="aside" rule stagger className="border-t border-line pt-7">
        <p className="eyebrow text-accent">PROJECT ENQUIRIES</p>
        <h2 className="text-2xl tracking-tight mt-6">{contact.asideTitle}</h2>
        <p className="text-muted text-sm leading-relaxed mt-5 max-w-xs">
          {contact.asideText}
        </p>
        <ul className="list-disc pl-4 mt-5 space-y-3 text-sm text-muted leading-relaxed">
          {contact.checklist.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        <div className="mt-8">
          <p className="eyebrow text-accent">{contact.sampleEmailLabel}</p>
          <p className="text-sm mt-2 break-all">{contact.sampleEmail}</p>
        </div>
        <p className="text-xs text-muted leading-relaxed mt-10 max-w-xs">
          {contact.identityNote}
        </p>
      </Reveal>
      <ContactForm />
    </section>
  );
}
