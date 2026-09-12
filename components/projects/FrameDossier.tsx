import Image from "next/image";
import { Reveal } from "@/components/ui/Reveal";
import { TextLink } from "@/components/ui/Primitives";
import { DetailExplorer } from "@/components/engineering/DetailExplorer";
import { frameDossier as copy } from "@/content/detail-study";

export function FrameDossier({ scope }: { scope: string }) {
  return (
    <div className="frame-dossier" id="study">
      <section className="shell section-space">
        <dl className="grid md:grid-cols-2 gap-6 mb-14 border-b border-line pb-8 text-sm">
          <div>
            <dt className="eyebrow text-accent mb-3">{copy.metadata.scope}</dt>
            <dd>{scope}</dd>
          </div>
          <div>
            <dt className="eyebrow text-accent mb-3">{copy.metadata.status}</dt>
            <dd>{copy.metadata.statusValue}</dd>
          </div>
        </dl>
        <Reveal stagger className="dossier-introduction">
          <p className="eyebrow text-accent">{copy.label}</p>
          <h2 className="heading whitespace-pre-line">{copy.title}</h2>
          <p className="text-muted leading-relaxed max-w-xl">{copy.intro}</p>
        </Reveal>
        <ol className="dossier-index" aria-label={copy.label}>
          {copy.index.map((label, i) => (
            <li key={label}>
              <span className="eyebrow text-accent">0{i + 1}</span>
              {label}
            </li>
          ))}
        </ol>
        <div className="dossier-location">
          <Reveal stagger>
            <p className="eyebrow text-accent mb-6">{copy.constraint.label}</p>
            <h3 className="text-3xl md:text-4xl tracking-tight mb-6">
              {copy.constraint.title}
            </h3>
            <p className="text-sm text-muted leading-relaxed max-w-md">
              {copy.constraint.text}
            </p>
          </Reveal>
          <Reveal as="figure" variant="image">
            <Image
              src="/graphics/studies/frame-plan.svg"
              alt={copy.constraint.alt}
              width={900}
              height={640}
              className="w-full"
            />
            <figcaption className="eyebrow text-muted mt-4">
              {copy.constraint.caption}
            </figcaption>
          </Reveal>
        </div>
      </section>
      <section className="shell pb-20 md:pb-32">
        <Reveal stagger className="dossier-section-heading">
          <p className="eyebrow text-accent">{copy.decision.label}</p>
          <h3 className="heading">{copy.decision.title}</h3>
          <p className="text-sm text-muted leading-relaxed max-w-xl">
            {copy.decision.text}
          </p>
        </Reveal>
        <DetailExplorer id="frame-detail" />
      </section>
      <section className="dossier-package">
        <div className="shell section-space">
          <Reveal stagger className="grid md:grid-cols-2 gap-8 md:gap-16 mb-12">
            <div>
              <p className="eyebrow mb-6">{copy.package.label}</p>
              <h3 className="heading whitespace-pre-line">
                {copy.package.title}
              </h3>
            </div>
            <p className="text-sm leading-relaxed max-w-md md:self-end">
              {copy.package.intro}
            </p>
          </Reveal>
          <div className="dossier-table">
            <table>
              <caption className="sr-only">{copy.package.title}</caption>
              <thead>
                <tr>
                  {copy.package.columns.map((label) => (
                    <th key={label} scope="col">
                      {label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {copy.package.rows.map((row) => (
                  <tr key={row.ref}>
                    <th scope="row">{row.ref}</th>
                    <td>{row.title}</td>
                    <td>{row.connection}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
      <section className="shell section-space grid md:grid-cols-[1fr_2fr] gap-10">
        <Reveal>
          <p className="eyebrow text-accent">{copy.review.label}</p>
        </Reveal>
        <Reveal stagger>
          <h3 className="heading mb-8">{copy.review.title}</h3>
          <p className="text-muted leading-relaxed max-w-2xl">
            {copy.review.text}
          </p>
          <ul className="mt-8">
            {copy.review.checks.map((check, i) => (
              <li className="border-t border-line py-4 flex gap-6" key={check}>
                <span className="eyebrow text-accent">0{i + 1}</span>
                {check}
              </li>
            ))}
          </ul>
        </Reveal>
      </section>
      <section className="shell pb-20 md:pb-32">
        <Reveal rule className="border-t border-line pt-8">
          <p className="eyebrow text-accent mb-6">{copy.next.label}</p>
          <div className="flex flex-wrap justify-between gap-8">
            <h3 className="text-3xl tracking-tight">{copy.next.title}</h3>
            <div className="flex flex-col items-start gap-3">
              {copy.next.links.map((link) => (
                <TextLink key={link.href} href={link.href}>
                  {link.label}
                </TextLink>
              ))}
            </div>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
