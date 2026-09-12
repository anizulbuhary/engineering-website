import { Reveal } from "@/components/ui/Reveal";
import Link from "next/link";
import { navigation, site } from "@/content/site";
import { TextLink } from "@/components/ui/Primitives";
import { sectionCopy as copy } from "@/content/sections";
export function ContactCTA() {
  return (
    <section className="permanent-dark">
      <Reveal
        stagger
        className="shell section-space grid md:grid-cols-[1fr_auto] gap-12 items-end"
      >
        <div>
          <p className="eyebrow text-on-dark-muted mb-7">{copy.cta.label}</p>
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
    <footer className="permanent-dark border-t border-on-dark-line">
      <div className="shell py-14">
        <Reveal stagger className="grid md:grid-cols-2 gap-10">
          <div>
            <Link href="/" className="text-3xl tracking-[-.05em] font-medium">
              {site.name}
              <span className="text-on-dark-accent" aria-hidden>
                .
              </span>
            </Link>
            <p className="mt-4 text-sm text-on-dark-muted max-w-xs whitespace-pre-line">
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
                className="navigation-link w-fit min-h-11 py-3 hover:text-white"
              >
                {n.label}
              </Link>
            ))}
          </nav>
        </Reveal>
        <Reveal
          rule
          className="footer-legal mt-16 pt-6 border-t border-on-dark-line flex flex-col md:flex-row justify-between gap-4 text-[10px] text-on-dark-muted"
        >
          <p>{site.copyright}</p>
          <p>{site.demoNote}</p>
          <Link href="/privacy" className="underline underline-offset-4">
            Privacy & demo terms
          </Link>
        </Reveal>
      </div>
    </footer>
  );
}
