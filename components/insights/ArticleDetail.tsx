import { Reveal } from "@/components/ui/Reveal";
import Image from "next/image";
import type { Article } from "@/types/content";
import { Breadcrumbs, TextLink } from "@/components/ui/Primitives";
export function ArticleDetail({ article: a }: { article: Article }) {
  return (
    <article className="shell pb-24">
      <Breadcrumbs parent="Insights" href="/insights" title={a.category} />
      <header className="max-w-4xl mx-auto py-14 md:py-20">
        <p className="eyebrow text-accent mb-7">FIELD NOTES / {a.category}</p>
        <h1 className="heading md:text-7xl">{a.title}</h1>
        <p className="text-xl text-muted leading-relaxed mt-8">{a.summary}</p>
        <p className="eyebrow mt-8">FORMWORK EDITORIAL / INTRODUCTORY NOTE</p>
      </header>
      <figure>
        <Reveal
          variant="image"
          className="relative aspect-[4/3] md:aspect-[2.4/1]"
        >
          <Image
            src={a.image}
            alt="Illustrative architectural structure accompanying this editorial note"
            fill
            preload
            sizes="100vw"
            className="object-cover"
          />
        </Reveal>
        <figcaption className="eyebrow text-muted mt-4">
          CONCEPT VISUAL
        </figcaption>
      </figure>
      <div className="max-w-2xl mx-auto mt-16 md:mt-24 space-y-12">
        {a.sections.map((s) => (
          <section key={s.title}>
            <h2 className="text-3xl tracking-tight mb-6">{s.title}</h2>
            {s.paragraphs.map((p) => (
              <p
                key={p.slice(0, 40)}
                className="text-muted text-base md:text-lg leading-[1.85] mb-6"
              >
                {p}
              </p>
            ))}
          </section>
        ))}
        <TextLink href="/insights">Back to field notes</TextLink>
      </div>
    </article>
  );
}
