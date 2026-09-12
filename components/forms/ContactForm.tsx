"use client";
import { Reveal } from "@/components/ui/Reveal";
import { contact } from "@/content/pages";
import { services } from "@/content/services";
export function ContactForm() {
  return (
    <form
      aria-label="Project enquiry preview"
      aria-describedby="form-notice"
      onSubmit={(e) => e.preventDefault()}
      onKeyDown={(e) => {
        if (e.key === "Enter" && e.target instanceof HTMLInputElement)
          e.preventDefault();
      }}
      className="space-y-10"
    >
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
              className="w-full border-b border-control bg-transparent py-3 rounded-none outline-offset-4"
            />
          </Reveal>
        ))}
      </div>
      <Reveal>
        <fieldset>
          <legend className="eyebrow mb-5">Services of interest</legend>
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
          Tell us about your project
        </label>
        <textarea
          id="message"
          name="message"
          rows={5}
          className="w-full border border-control bg-transparent p-4 resize-y"
        />
      </Reveal>
      <button
        type="button"
        disabled
        className="bg-ink text-paper px-6 py-4 opacity-65 text-sm"
      >
        {contact.button}
      </button>
    </form>
  );
}
