"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { containDialogFocus } from "@/lib/dialog";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { navigation, primaryNavigation, site } from "@/content/site";
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
    <header className="sticky top-0 z-40 border-b border-line bg-paper/95 backdrop-blur-sm">
      <div className="shell h-22 flex items-center justify-between gap-8">
        <Link href="/">
          <Brand />
          <span className="sr-only"> home</span>
        </Link>
        <nav
          aria-label="Main navigation"
          className="hidden lg:flex gap-9 text-xs"
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
                aria-current={path.startsWith(n.href) ? "page" : undefined}
                className="py-3 hover:text-accent aria-[current=page]:text-accent"
              >
                {n.label}
              </Link>
            ))}
        </nav>
        <Link
          href="/contact"
          className="hidden lg:inline-flex items-center gap-8 border border-ink px-5 py-3 text-xs hover:bg-ink hover:text-paper transition-colors"
        >
          Start a project <ArrowUpRight size={15} aria-hidden />
        </Link>
        <button
          ref={trigger}
          onClick={() => dialog.current?.showModal()}
          className="lg:hidden min-h-11 min-w-11 grid place-items-center"
          aria-label="Open navigation"
        >
          <Menu size={25} />
        </button>
      </div>
      <dialog
        aria-label="Site navigation"
        onKeyDown={containDialogFocus}
        ref={dialog}
        onClose={() => trigger.current?.focus()}
        className="fixed inset-0 m-0 ml-auto h-dvh max-h-none w-full max-w-md bg-paper p-7 text-ink"
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
          {navigation.map((n, i) => (
            <Link
              onClick={() => dialog.current?.close()}
              key={n.href}
              href={n.href}
              aria-current={path === n.href ? "page" : undefined}
              className="flex items-center gap-6 border-b border-line py-3 text-2xl aria-[current=page]:text-accent"
            >
              <span className="eyebrow text-muted">0{i + 1}</span>
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
