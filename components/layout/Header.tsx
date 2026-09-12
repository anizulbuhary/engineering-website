"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { containDialogFocus } from "@/lib/dialog";
import { ArrowUpRight, Menu, X } from "lucide-react";
import {
  mobileNavigation,
  navigation,
  navigationCopy,
  primaryNavigation,
  site,
} from "@/content/site";
import { AppearanceControl } from "./AppearanceControl";
export function Brand() {
  return (
    <span className="inline-flex items-center gap-3">
      <svg width="31" height="34" viewBox="0 0 31 34" fill="none" aria-hidden>
        <path
          d="M2 32V2h27v7H10v7h16v7H10v9H2Z"
          stroke="currentColor"
          strokeWidth="2"
        />
        <path d="M15 9v7M21 2v7M15 23v9" stroke="currentColor" />
      </svg>
      <span>
        <span className="block text-xl font-semibold tracking-[-.045em] leading-none">
          {site.name}
        </span>
        <span className="block text-[8px] tracking-[.34em] mt-1.5">
          {site.descriptor}
        </span>
      </span>
    </span>
  );
}
export function Header() {
  const path = usePathname();
  const isCurrent = (href: string) =>
    path === href || (href !== "/" && path.startsWith(`${href}/`));
  const dialog = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    const media = matchMedia("(min-width: 1024px)");
    const close = () => {
      if (media.matches) dialog.current?.close();
    };
    media.addEventListener("change", close);
    return () => media.removeEventListener("change", close);
  }, []);
  return (
    <header className="site-header sticky top-0 z-40 border-b border-line bg-paper/95 backdrop-blur-sm">
      <div className="shell h-full flex items-center justify-between gap-3 lg:gap-8">
        <Link href="/" className="inline-flex min-h-11 items-center">
          <Brand />
          <span className="sr-only"> home</span>
        </Link>
        <nav
          aria-label="Main navigation"
          className="hidden lg:flex gap-6 xl:gap-9 text-xs"
        >
          {navigation
            .filter((n) => primaryNavigation.includes(n.label))
            .sort(
              (a, b) =>
                primaryNavigation.indexOf(a.label) -
                primaryNavigation.indexOf(b.label),
            )
            .map((n) => (
              <Link
                key={n.href}
                href={n.href}
                aria-current={isCurrent(n.href) ? "page" : undefined}
                className="navigation-link inline-flex min-h-11 items-center py-3 hover:text-accent aria-[current=page]:text-accent"
              >
                {n.label}
              </Link>
            ))}
        </nav>
        <div className="flex items-center gap-1 lg:gap-4">
          <Link
            href="/contact"
            aria-current={isCurrent("/contact") ? "page" : undefined}
            className="hidden lg:inline-flex min-h-11 items-center gap-8 border border-ink px-5 py-3 text-xs hover:bg-ink hover:text-paper aria-[current=page]:border-accent transition-colors"
          >
            {navigationCopy.contact} <ArrowUpRight size={15} aria-hidden />
          </Link>
          <AppearanceControl />
          <button
            ref={trigger}
            onClick={() => dialog.current?.showModal()}
            className="lg:hidden min-h-11 min-w-11 grid place-items-center"
            aria-label="Open navigation"
          >
            <Menu size={25} />
          </button>
        </div>
      </div>
      <dialog
        aria-label="Site navigation"
        onKeyDown={containDialogFocus}
        ref={dialog}
        onClose={() => trigger.current?.focus()}
        className="navigation-dialog fixed inset-0 m-0 ml-auto h-dvh max-h-none w-full max-w-md bg-raised p-7 text-ink"
      >
        <div className="flex justify-between items-center mb-12">
          <Brand />
          <button
            autoFocus
            onClick={() => dialog.current?.close()}
            aria-label="Close navigation"
            className="p-3"
          >
            <X />
          </button>
        </div>
        <nav aria-label="Mobile navigation" className="flex flex-col">
          {navigation
            .filter((n) => mobileNavigation.includes(n.label))
            .sort(
              (a, b) =>
                mobileNavigation.indexOf(a.label) -
                mobileNavigation.indexOf(b.label),
            )
            .map((n) => (
              <Link
                onClick={() => dialog.current?.close()}
                key={n.href}
                href={n.href}
                aria-current={isCurrent(n.href) ? "page" : undefined}
                className="flex items-center gap-6 border-b border-line py-3 text-2xl aria-[current=page]:text-accent"
              >
                {n.label}
              </Link>
            ))}
        </nav>
        <p className="eyebrow text-muted mt-10">
          STRUCTURE. CLARITY. PRECISION.
        </p>
      </dialog>
    </header>
  );
}
