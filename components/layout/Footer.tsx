import { Reveal } from "@/components/ui/Reveal";
import Link from "next/link";
import { navigation, site } from "@/content/site";
import { TextLink } from "@/components/ui/Primitives";
import { sectionCopy as copy } from "@/content/sections";
export function ContactCTA() {
  return (
    <section className="bg-ink text-paper">
      <Reveal className="shell section-space grid md:grid-cols-[1fr_auto] gap-12 items-end">
        <div>
          <p className="eyebrow text-concrete mb-7">{copy.cta.label}</p>
          <h2 className="heading whitespace-pre-line">{copy.cta.title}</h2>
        </div>
        <TextLink href="/contact" className="w-fit">
          {copy.cta.link}
        </TextLink>
      </Reveal>
    </section>
  );
}
export function Footer() {
  return (
    <footer className="bg-ink text-paper border-t border-white/20">
      <div className="shell py-14">
        <div className="grid md:grid-cols-2 gap-10">
          <div>
            <Link href="/" className="text-3xl tracking-[-.05em] font-medium">
              {site.name}
              <span className="text-rust" aria-hidden>
                .
              </span>
            </Link>
            <p className="mt-4 text-sm text-concrete max-w-xs whitespace-pre-line">
              {site.tagline}
            </p>
          </div>
          <nav
            aria-label="Footer navigation"
            className="grid grid-cols-2 gap-x-10 gap-y-1 text-sm"
          >
            {navigation.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                className="py-2 hover:text-white hover:underline"
              >
                {n.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="mt-16 pt-6 border-t border-white/20 flex flex-col md:flex-row justify-between gap-4 text-[10px] text-concrete">
          <p>{site.copyright}</p>
          <p>{site.demoNote}</p>
          <Link href="/privacy" className="underline underline-offset-4">
            Privacy & demo terms
          </Link>
        </div>
      </div>
    </footer>
  );
}
