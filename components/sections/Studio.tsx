import Image from "next/image";
import { principles, contact } from "@/content/pages";
import { ContactForm } from "@/components/forms/ContactForm";
import { sectionCopy as copy } from "@/content/sections";
export function StudioImage() {
  return (
    <figure className="shell">
      <div className="relative aspect-[4/3] md:aspect-[2.4/1]">
        <Image
          src="/images/projects/courtyard.webp"
          alt="Illustrative concrete courtyard and colonnade"
          fill
          sizes="100vw"
          className="object-cover"
        />
      </div>
      <figcaption className="eyebrow text-muted mt-4">
        {copy.studio.imageCaption}
      </figcaption>
    </figure>
  );
}
export function Principles({ about = false }: { about?: boolean }) {
  return (
    <section className="shell section-space grid md:grid-cols-[1fr_2fr] gap-12">
      <div>
        <p className="eyebrow text-accent">
          {about ? copy.studio.aboutLabel : copy.studio.whyLabel}
        </p>
        <h2 className="text-3xl tracking-tight mt-7">
          {about ? copy.studio.aboutTitle : copy.studio.whyTitle}
        </h2>
      </div>
      <div>
        {principles.map((p, i) => (
          <article key={p.title} className="border-t border-line pt-7 pb-10">
            <span className="eyebrow text-accent">0{i + 1}</span>
            <h3 className="text-2xl md:text-3xl tracking-tight mt-4">
              {p.title}
            </h3>
            <p className="text-muted leading-relaxed mt-5 max-w-xl">{p.text}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
export function ContactSection() {
  return (
    <section className="shell pb-24 grid lg:grid-cols-[1fr_2fr] gap-14 lg:gap-24">
      <aside className="border-t border-line pt-7">
        <p className="eyebrow text-accent">PROJECT ENQUIRIES</p>
        <h2 className="text-2xl tracking-tight mt-6">{contact.asideTitle}</h2>
        <p className="text-muted text-sm leading-relaxed mt-5 max-w-xs">
          {contact.asideText}
        </p>
        <p className="text-xs text-muted leading-relaxed mt-10 max-w-xs">
          {contact.identityNote}
        </p>
      </aside>
      <ContactForm />
    </section>
  );
}
