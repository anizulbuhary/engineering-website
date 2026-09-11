import { Reveal } from "@/components/ui/Reveal";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Article } from "@/types/content";
export function ArticleList({ articles }: { articles: Article[] }) {
  return (
    <section className="shell pb-24">
      {articles.map((a, i) => (
        <Reveal as="article" key={a.slug} className="border-t border-line py-9">
          <Link
            href={`/insights/${a.slug}`}
            className="article-link group grid md:grid-cols-[1fr_2fr_40px] gap-7 md:gap-12"
          >
            <div className="relative aspect-[1.6/1] overflow-hidden">
              <Image
                src={a.image}
                alt="Architectural concept illustrating the article"
                fill
                sizes="(max-width: 767px) 100vw, 30vw"
                className="object-cover transition-transform duration-500 group-hover:scale-[1.025]"
              />
            </div>
            <div className="self-center">
              <p className="eyebrow text-accent mb-5">
                0{i + 1} / {a.category}
              </p>
              <h2 className="text-3xl md:text-4xl tracking-[-.04em] max-w-xl group-hover:text-accent">
                {a.title}
              </h2>
              <p className="text-muted text-sm leading-relaxed mt-5 max-w-lg">
                {a.summary}
              </p>
            </div>
            <ArrowUpRight className="hidden md:block self-center" aria-hidden />
          </Link>
        </Reveal>
      ))}
    </section>
  );
}
