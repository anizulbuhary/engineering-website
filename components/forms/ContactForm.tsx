"use client";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { ArrowUpRight, Check, RotateCcw } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import { contact } from "@/content/pages";
import { services } from "@/content/services";
const subscribeToHydration = () => () => {};
export function ContactForm() {
  const [complete, setComplete] = useState(false);
  const ready = useSyncExternalStore(
    subscribeToHydration,
    () => true,
    () => false,
  );
  const form = useRef<HTMLFormElement>(null);
  const confirmation = useRef<HTMLHeadingElement>(null);
  const changed = useRef(false);
  useEffect(() => {
    if (!changed.current) return;
    const target = complete
      ? confirmation.current
      : form.current?.querySelector<HTMLInputElement>("#name");
    target?.focus({ preventScroll: true });
    const scrollTarget = complete ? target?.closest("section") : target;
    const rect = scrollTarget?.getBoundingClientRect();
    if (rect && (rect.top < 100 || rect.bottom > innerHeight - 40))
      scrollTarget?.scrollIntoView({
        behavior: matchMedia("(prefers-reduced-motion: reduce)").matches
          ? "instant"
          : "smooth",
        block: "center",
      });
  }, [complete]);
  if (complete)
    return (
      <section
        className="enquiry-confirmation border-t border-accent bg-concrete/35 px-6 py-10 md:p-12"
        aria-labelledby="enquiry-complete"
      >
        <span
          className="enquiry-check mb-9 grid size-12 place-items-center border border-accent text-accent"
          aria-hidden="true"
        >
          <Check size={24} strokeWidth={1.5} />
        </span>
        <p className="eyebrow text-accent mb-5">{contact.confirmation.label}</p>
        <h2
          ref={confirmation}
          tabIndex={-1}
          id="enquiry-complete"
          aria-describedby="enquiry-complete-description"
          className="max-w-xl text-3xl md:text-4xl tracking-tight leading-tight outline-none"
        >
          {contact.confirmation.title}
        </h2>
        <p
          id="enquiry-complete-description"
          className="text-muted leading-relaxed mt-6 max-w-lg"
        >
          {contact.confirmation.text}
        </p>
        <button
          type="button"
          className="enquiry-restart text-link mt-10"
          onClick={() => setComplete(false)}
        >
          {contact.confirmation.again}
          <RotateCcw size={16} aria-hidden="true" />
        </button>
      </section>
    );
  return (
    <form
      ref={form}
      aria-label="Project enquiry preview"
      aria-describedby="form-notice"
      onSubmit={(e) => {
        e.preventDefault();
        if (!ready || !e.currentTarget.reportValidity()) return;
        e.currentTarget.reset();
        changed.current = true;
        setComplete(true);
      }}
    >
      <noscript>
        <p className="text-sm mb-6">{contact.noScript}</p>
      </noscript>
      <fieldset disabled={!ready} className="min-w-0 space-y-10">
        <Reveal>
          <p
            id="form-notice"
            className="border-l-2 border-accent bg-concrete/45 px-5 py-4 text-sm leading-relaxed"
          >
            {contact.notice}
          </p>
        </Reveal>
        <div className="grid sm:grid-cols-2 gap-x-8 gap-y-8">
          {contact.fields.map((f, i) => (
            <Reveal key={f.name} delay={(i % 2) * 70}>
              <label htmlFor={f.name} className="eyebrow block mb-3">
                {f.label}
              </label>
              <input
                id={f.name}
                name={f.name}
                type={f.type}
                autoComplete={f.autoComplete}
                required={f.required}
                maxLength={200}
                className="w-full border-b border-control bg-transparent py-3 rounded-none outline-offset-4"
              />
            </Reveal>
          ))}
        </div>
        <Reveal>
          <fieldset aria-describedby="services-hint">
            <legend className="eyebrow mb-3">{contact.servicesLabel}</legend>
            <p id="services-hint" className="text-sm text-muted mb-5">
              {contact.servicesHint}
            </p>
            <div className="grid sm:grid-cols-2 gap-3">
              {services.map((s) => (
                <label
                  key={s.id}
                  className="flex items-center gap-3 min-h-11 text-sm"
                >
                  <input
                    type="checkbox"
                    name="services"
                    value={s.id}
                    className="size-4 accent-accent"
                  />
                  {s.title}
                </label>
              ))}
            </div>
          </fieldset>
        </Reveal>
        <Reveal>
          <label className="eyebrow block mb-4" htmlFor="message">
            {contact.messageLabel}
          </label>
          <p
            id="message-hint"
            className="text-sm text-muted leading-relaxed mb-4"
          >
            {contact.messageHint}
          </p>
          <textarea
            id="message"
            name="message"
            aria-describedby="message-hint"
            rows={5}
            required
            maxLength={5000}
            className="w-full border border-control bg-transparent p-4 resize-y"
          />
        </Reveal>
        <button
          type="submit"
          className="press-feedback inline-flex min-h-11 items-center gap-8 bg-ink text-paper px-6 py-4 text-sm disabled:opacity-65"
        >
          {contact.button}
          <ArrowUpRight size={18} aria-hidden="true" />
        </button>
      </fieldset>
    </form>
  );
}
