import { PageHero } from "@/components/ui/Primitives";
import { legal } from "@/content/legal";
export const metadata = { title: "Privacy & demo terms" };
export default function Page() {
  return (
    <>
      <PageHero {...legal} />
      <div className="shell pb-24">
        <div className="max-w-3xl ml-auto space-y-10">
          {legal.sections.map((s) => (
            <section key={s.title}>
              <h2 className="text-2xl tracking-tight mb-4">{s.title}</h2>
              <p className="text-muted leading-relaxed">{s.text}</p>
            </section>
          ))}
        </div>
      </div>
    </>
  );
}
