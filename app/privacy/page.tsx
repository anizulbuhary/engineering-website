import { Reveal } from "@/components/ui/Reveal";
import { PageHero } from "@/components/ui/Primitives";
import { legal } from "@/content/legal";
export const metadata = { title: "Privacy & demo terms" };
export default function Page() {
  return (
    <>
      <PageHero {...legal} />
      <div className="legal-sections shell pb-24">
        <div className="border-b border-line">
          {legal.sections.map((s, index) => (
            <Reveal
              as="section"
              key={s.title}
              rule
              className="grid gap-6 border-t border-line py-8 md:grid-cols-[1fr_1.35fr] md:gap-12 md:py-12 lg:gap-20"
            >
              <div className="flex items-baseline gap-5 lg:gap-8">
                <span
                  className="eyebrow shrink-0 text-accent"
                  aria-hidden="true"
                >
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h2 className="text-2xl lg:text-3xl tracking-tight leading-tight">
                  {s.title}
                </h2>
              </div>
              <p className="max-w-[65ch] text-muted leading-relaxed md:text-lg">
                {s.text}
              </p>
            </Reveal>
          ))}
        </div>
      </div>
    </>
  );
}
