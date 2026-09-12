import { Reveal } from "@/components/ui/Reveal";
import Link from "@/components/ui/SiteLink";
import { ArrowUpRight } from "lucide-react";
import type { ReactNode } from "react";
export function TextLink({
  href,
  children,
  className = "",
}: {
  href: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <Link href={href} className={`text-link group ${className}`}>
      {children}
      <ArrowUpRight
        size={17}
        aria-hidden
        className="transition-transform duration-200"
      />
    </Link>
  );
}
export function PageHero({
  label,
  title,
  intro,
}: {
  label: string;
  title: string;
  intro: string;
}) {
  return (
    <Reveal
      as="section"
      stagger
      key={title}
      className="shell pt-18 pb-18 md:pt-28 md:pb-24"
    >
      <p className="eyebrow text-accent mb-9">{label}</p>
      <h1 className="display whitespace-pre-line max-w-6xl">{title}</h1>
      <p className="mt-10 max-w-xl text-base md:text-lg leading-relaxed text-muted md:ml-auto">
        {intro}
      </p>
    </Reveal>
  );
}
export function Breadcrumbs({
  parent,
  href,
  title,
}: {
  parent: string;
  href: string;
  title: string;
}) {
  return (
    <nav aria-label="Breadcrumb" className="eyebrow flex flex-wrap gap-3 py-8">
      <Link className="hover:underline" href={href}>
        {parent}
      </Link>
      <span aria-hidden>/</span>
      <span aria-current="page">{title}</span>
    </nav>
  );
}
