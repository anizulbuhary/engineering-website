"use client";

import {
  useEffect,
  useId,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import { SunMoon } from "lucide-react";
import { appearance as copy } from "@/content/appearance";
import {
  getServerTheme,
  getTheme,
  setTheme,
  subscribeTheme,
} from "@/lib/theme-store";

export function AppearanceControl() {
  const preference = useSyncExternalStore(
    subscribeTheme,
    getTheme,
    getServerTheme,
  );
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const id = useId();

  useEffect(() => {
    if (!open) return;
    root.current
      ?.querySelector<HTMLInputElement>("input:checked")
      ?.focus({ preventScroll: true });
    const outside = (event: PointerEvent) => {
      if (
        event.target instanceof Node &&
        !root.current?.contains(event.target)
      ) {
        if (root.current?.contains(document.activeElement))
          trigger.current?.focus({ preventScroll: true });
        setOpen(false);
      }
    };
    const escape = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      event.preventDefault();
      setOpen(false);
      trigger.current?.focus({ preventScroll: true });
    };
    document.addEventListener("pointerdown", outside);
    document.addEventListener("keydown", escape);
    return () => {
      document.removeEventListener("pointerdown", outside);
      document.removeEventListener("keydown", escape);
    };
  }, [open]);

  return (
    <div
      className="appearance-control"
      ref={root}
      onBlur={(event) => {
        // Label activation briefly blurs the radio before forwarding the click
        // and focus. Outside pointer clicks are handled separately above.
        if (
          event.relatedTarget &&
          !event.currentTarget.contains(event.relatedTarget as Node)
        )
          setOpen(false);
      }}
    >
      <button
        ref={trigger}
        type="button"
        className="appearance-trigger"
        aria-label={copy.label}
        aria-expanded={open}
        aria-controls={id}
        disabled={preference === null}
        style={{ visibility: preference === null ? "hidden" : undefined }}
        onClick={() => setOpen((value) => !value)}
      >
        <SunMoon size={20} aria-hidden />
      </button>
      {open && (
        <div id={id} className="appearance-panel">
          <fieldset>
            <legend className="eyebrow text-accent">{copy.label}</legend>
            <p className="appearance-description">{copy.description}</p>
            {copy.options.map((option) => (
              <label key={option.value} className="appearance-option">
                <input
                  type="radio"
                  name={`${id}-theme`}
                  value={option.value}
                  checked={preference === option.value}
                  onChange={() => setTheme(option.value)}
                />
                <span>{option.label}</span>
              </label>
            ))}
          </fieldset>
        </div>
      )}
    </div>
  );
}
