"use client";
import { useRef, useState } from "react";
import { Reveal } from "@/components/ui/Reveal";
import Image from "next/image";
import {
  ArrowDownToLine,
  ArrowLeft,
  ArrowRight,
  Expand,
  X,
} from "lucide-react";
import type { Sample } from "@/types/content";
import { sampleGalleryCopy } from "@/content/samples";
import { containDialogFocus } from "@/lib/dialog";
export function SampleGallery({ samples }: { samples: Sample[] }) {
  const [category, setCategory] = useState("All");
  const [hasFiltered, setHasFiltered] = useState(false);
  const [selected, setSelected] = useState(0);
  const dialog = useRef<HTMLDialogElement>(null);
  const opener = useRef<HTMLButtonElement | null>(null);
  const filtered = samples.filter(
    (s) => category === "All" || s.category === category,
  );
  const sample = samples[selected];
  const move = (delta: number) =>
    setSelected((i) => (i + delta + samples.length) % samples.length);
  return (
    <section className="shell pb-24">
      <div
        className="flex flex-wrap gap-x-7 gap-y-2 border-y border-line py-4 mb-12"
        aria-label="Filter documentation samples"
      >
        {["All", ...new Set(samples.map((s) => s.category))].map((c) => (
          <button
            key={c}
            aria-pressed={category === c}
            onClick={() => {
              setHasFiltered(true);
              setCategory(c);
            }}
            className="py-3 text-xs border-b border-transparent aria-pressed:border-accent aria-pressed:text-accent"
          >
            {c}
          </button>
        ))}
      </div>
      <p role="status" className="sr-only">
        {filtered.length} samples shown
      </p>
      <div className="grid md:grid-cols-2 gap-x-8 gap-y-12">
        {filtered.map((s, i) => (
          <Reveal
            as="article"
            key={`${category}-${s.id}`}
            variant={hasFiltered ? "fade" : "rise"}
            delay={(i % 2) * 70}
          >
            <button
              className="sample-preview group relative w-full bg-concrete p-5 md:p-8"
              onClick={(e) => {
                opener.current = e.currentTarget;
                setSelected(samples.indexOf(s));
                dialog.current?.showModal();
              }}
              aria-label={`Preview ${s.title}`}
            >
              <Image
                src={s.image}
                alt={s.description}
                width={900}
                height={640}
                className="w-full h-auto"
              />
              <span className="absolute right-4 bottom-4 px-3 py-3 inline-flex items-center gap-2 text-xs bg-paper group-hover:bg-ink group-hover:text-paper transition-colors">
                {sampleGalleryCopy.preview}
                <Expand size={17} aria-hidden />
              </span>
            </button>
            <p className="eyebrow text-accent mt-6">
              {s.category} / DEMONSTRATION
            </p>
            <h2 className="text-2xl tracking-tight mt-2">{s.title}</h2>
            <p className="text-muted text-sm mt-3 leading-relaxed">
              {s.description}
            </p>
            <a href={s.pdf} download className="text-link mt-3 text-xs">
              Download illustrative PDF{" "}
              <ArrowDownToLine size={15} aria-hidden />
            </a>
          </Reveal>
        ))}
      </div>
      <dialog
        ref={dialog}
        aria-labelledby="sample-title"
        onClose={() => opener.current?.focus()}
        onKeyDown={(e) => {
          containDialogFocus(e);
          if (e.key === "ArrowRight") {
            e.preventDefault();
            move(1);
          }
          if (e.key === "ArrowLeft") {
            e.preventDefault();
            move(-1);
          }
        }}
        className="sample-dialog m-auto w-[calc(100%-32px)] max-w-5xl max-h-[90dvh] bg-raised text-ink p-5 md:p-8"
      >
        <div className="flex justify-between gap-5 items-center mb-5">
          <div>
            <p className="eyebrow text-accent">
              ILLUSTRATIVE / NOT FOR CONSTRUCTION
            </p>
            <h2 id="sample-title" className="text-xl md:text-2xl mt-2">
              {sample.title}
            </h2>
          </div>
          <button
            autoFocus
            onClick={() => dialog.current?.close()}
            aria-label="Close preview"
            className="p-3"
          >
            <X />
          </button>
        </div>
        <Image
          src={sample.image}
          width={900}
          height={640}
          alt={sample.description}
          className="w-full max-h-[55dvh] object-contain bg-concrete"
        />
        <div className="flex flex-wrap justify-between items-center gap-4 mt-5">
          <div className="flex items-center gap-5">
            <button
              aria-label="Previous sample"
              onClick={() => move(-1)}
              className="p-3 border border-line"
            >
              <ArrowLeft size={18} />
            </button>
            <span className="eyebrow" aria-live="polite">
              {selected + 1} / {samples.length}
            </span>
            <button
              aria-label="Next sample"
              onClick={() => move(1)}
              className="p-3 border border-line"
            >
              <ArrowRight size={18} />
            </button>
          </div>
          <a href={sample.pdf} download className="text-link text-xs">
            Download PDF <ArrowDownToLine size={16} aria-hidden />
          </a>
        </div>
      </dialog>
    </section>
  );
}
