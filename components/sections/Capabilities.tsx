import { Reveal } from "@/components/ui/Reveal";
import { services } from "@/content/services";
import { TextLink } from "@/components/ui/Primitives";
import { sectionCopy as copy } from "@/content/sections";
import { CapabilityExample } from "./CapabilityExample";
export function Capabilities({ full = false }: { full?: boolean }) {
  const Heading = full ? "h2" : "h3";
  return (
    <section
      id="services"
      tabIndex={-1}
      aria-label="Services"
      className="shell section-space border-t border-line"
    >
      {!full && (
        <Reveal stagger className="grid md:grid-cols-2 gap-8 mb-16">
          <p className="eyebrow text-accent">{copy.capabilities.label}</p>
          <div>
            <h2 className="heading whitespace-pre-line">
              {copy.capabilities.title}
            </h2>
            <p className="text-muted leading-relaxed mt-6 max-w-md">
              {copy.capabilities.description}
            </p>
          </div>
        </Reveal>
      )}
      <div>
        {(full ? services : services.slice(0, 4)).map((s, i) => (
          <Reveal
            rule
            key={s.id}
            id={s.id}
            className="capability-row group grid grid-cols-[30px_1fr] md:grid-cols-[60px_1fr_1fr] gap-x-4 md:gap-x-8 py-8 md:py-10 border-t border-line"
          >
            <span className="eyebrow text-accent pt-2">0{i + 1}</span>
            <Heading className="text-2xl md:text-3xl tracking-[-.035em]">
              {s.title}
            </Heading>
            <div className="col-start-2 md:col-start-auto mt-4 md:mt-0">
              <p className="text-sm text-muted leading-relaxed max-w-md">
                {s.description}
              </p>
              {full && (
                <div className="mt-6">
                  <p className="eyebrow text-accent mb-3">
                    {copy.capabilities.outputsLabel}
                  </p>
                  <ul className="list-disc pl-4 space-y-2">
                    {s.outputs.map((o) => (
                      <li key={o} className="text-sm">
                        {o}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            <CapabilityExample service={s.id} />
            {full && (
              <TextLink
                href="/contact"
                className="capability-contact col-start-2 md:col-start-3 mt-5 text-sm w-fit"
              >
                {copy.capabilities.contactLink}
                <span className="sr-only">: {s.title}</span>
              </TextLink>
            )}
          </Reveal>
        ))}
      </div>
      {!full && (
        <div className="mt-6 flex justify-end">
          <TextLink href="/capabilities">{copy.capabilities.link}</TextLink>
        </div>
      )}
    </section>
  );
}
