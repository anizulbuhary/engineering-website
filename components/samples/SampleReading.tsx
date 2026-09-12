import { Reveal } from "@/components/ui/Reveal";
import { TextLink } from "@/components/ui/Primitives";
import { DetailExplorer } from "@/components/engineering/DetailExplorer";
import { sampleReading as copy, detailStudy } from "@/content/detail-study";

export function SampleReading() {
  return (
    <section className="shell section-space border-t border-line">
      <Reveal stagger className="dossier-section-heading">
        <p className="eyebrow text-accent">{copy.label}</p>
        <h2 className="heading whitespace-pre-line">{copy.title}</h2>
        <p className="text-muted leading-relaxed max-w-xl">{copy.intro}</p>
      </Reveal>
      <DetailExplorer id="samples-detail" />
      <div className="flex justify-end mt-5">
        <TextLink href={detailStudy.link.href}>
          {detailStudy.link.label}
        </TextLink>
      </div>
    </section>
  );
}
