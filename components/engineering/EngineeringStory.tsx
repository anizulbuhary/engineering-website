"use client";

import Image from "next/image";
import { headerHeight } from "@/lib/header-height";
import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import { ArrowDown, Pause, Play } from "lucide-react";
import { engineeringStages, immersiveStory } from "@/content/engineering-story";
import { StructureDrawing } from "./StructureDrawing";
import type { mountEngineeringScene } from "@/lib/engineering-scene";

const preference = "(prefers-reduced-motion: no-preference)";
function subscribe(callback: () => void) {
  const media = matchMedia(preference);
  media.addEventListener("change", callback);
  return () => media.removeEventListener("change", callback);
}

export function EngineeringStory() {
  const capable = useSyncExternalStore(
    subscribe,
    () => matchMedia(preference).matches,
    () => false,
  );
  const [paused, setPaused] = useState(false);
  const [failed, setFailed] = useState(false);
  const [ready, setReady] = useState(false);
  const [active, setActive] = useState(0);
  const [openingImage, setOpeningImage] = useState<string | null>(null);
  const [returning, setReturning] = useState(false);
  const section = useRef<HTMLElement>(null);
  const host = useRef<HTMLDivElement>(null);
  const meter = useRef<HTMLDivElement>(null);
  const scene = useRef<ReturnType<typeof mountEngineeringScene> | null>(null);
  const progress = useRef(0);
  const alignAfterToggle = useRef(false);
  const cancelReturn = useRef<(() => void) | null>(null);
  const immersive = capable && !failed && !paused;
  const modelView = capable && !failed;
  const ChapterList = paused ? "ol" : "nav";
  const Chapter = paused ? "li" : "button";

  useEffect(() => () => cancelReturn.current?.(), []);

  useLayoutEffect(() => {
    if (!alignAfterToggle.current || !section.current) return;
    alignAfterToggle.current = false;
    window.scrollTo({
      // Round towards the pinned boundary on resume. Rounding down leaves the
      // canvas fractionally below its captured opening and softens the handoff.
      top: Math.ceil(
        section.current.getBoundingClientRect().top + scrollY - headerHeight(),
      ),
      behavior: "instant",
    });
    // Scrolling rounds to whole pixels; preserve the sticky frame's exact
    // position when its replacement enters normal document flow.
    section.current.style.setProperty(
      "--story-alignment",
      `${paused ? headerHeight() - section.current.getBoundingClientRect().top : 0}px`,
    );
  }, [paused]);

  useEffect(() => {
    if (!immersive || !section.current || !host.current) return;
    let cancelled = false;
    const element = host.current;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        import("@/lib/engineering-scene")
          .then(({ mountEngineeringScene }) => {
            if (cancelled) return;
            scene.current = mountEngineeringScene(
              element,
              () => setReady(true),
              () => setFailed(true),
            );
            scene.current.setProgress(progress.current);
          })
          .catch(() => {
            if (!cancelled) setFailed(true);
          });
      },
      { rootMargin: "100px" },
    );
    observer.observe(section.current);
    return () => {
      cancelled = true;
      observer.disconnect();
      scene.current?.dispose();
      scene.current = null;
    };
  }, [immersive]);

  useEffect(() => {
    if (!immersive) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      if (!section.current || cancelReturn.current) return;
      const rect = section.current.getBoundingClientRect();
      const stage = section.current.querySelector(
        ".engineering-stage",
      ) as HTMLElement;
      const travel = Math.max(
        1,
        section.current.offsetHeight - stage.offsetHeight,
      );
      // Browser scroll positions round to pixels; keep the opening exact.
      const offset = headerHeight() - rect.top;
      const value = offset <= 1 ? 0 : Math.max(0, Math.min(1, offset / travel));
      progress.current = value;
      scene.current?.setProgress(value);
      meter.current?.style.setProperty("transform", `scaleX(${value})`);
      setActive(Math.min(5, Math.round(value * 5)));
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    addEventListener("scroll", schedule, { passive: true });
    addEventListener("resize", schedule);
    addEventListener("pageshow", schedule);
    document.addEventListener("visibilitychange", schedule);
    schedule();
    return () => {
      cancelAnimationFrame(frame);
      removeEventListener("scroll", schedule);
      removeEventListener("resize", schedule);
      removeEventListener("pageshow", schedule);
      document.removeEventListener("visibilitychange", schedule);
    };
  }, [immersive]);

  const goTo = (index: number) => {
    if (!section.current) return;
    const top =
      section.current.getBoundingClientRect().top + scrollY - headerHeight();
    const stage = section.current.querySelector(
      ".engineering-stage",
    ) as HTMLElement;
    const travel = Math.max(
      1,
      section.current.offsetHeight - stage.offsetHeight,
    );
    window.scrollTo({ top: top + (travel * index) / 5, behavior: "smooth" });
  };
  const toggle = () => {
    if (cancelReturn.current) return;
    const activate = () => {
      alignAfterToggle.current = true;
      progress.current = 0;
      setActive(0);
      if (!paused) {
        try {
          setOpeningImage(scene.current?.captureOpening() ?? null);
        } catch {
          setFailed(true);
        }
      }
      setReturning(false);
      setReady(false);
      setPaused(!paused);
    };
    if (paused || !section.current) {
      activate();
      return;
    }

    // Rewind the visible model and page together, then capture that exact
    // opening in the same layout before removing the live renderer.
    const from = scrollY;
    const fromProgress = scene.current?.getProgress() ?? progress.current;
    const destination = Math.max(
      0,
      section.current.getBoundingClientRect().top + from - headerHeight(),
    );
    const motion = matchMedia("(prefers-reduced-motion: reduce)");
    if (
      motion.matches ||
      (Math.abs(destination - from) < 2 && fromProgress < 0.001)
    ) {
      window.scrollTo({ top: destination, behavior: "instant" });
      activate();
      return;
    }
    let frame = 0;
    let previousTime = performance.now();
    let elapsed = 0;
    const cancel = () => {
      cancelAnimationFrame(frame);
      cancelReturn.current = null;
      setReturning(false);
      removeEventListener("wheel", cancel);
      removeEventListener("touchstart", cancel);
      removeEventListener("pointerdown", cancel);
      removeEventListener("keydown", onKey);
      motion.removeEventListener("change", cancel);
    };
    const onKey = (event: KeyboardEvent) => {
      if (
        [
          "Escape",
          "ArrowUp",
          "ArrowDown",
          "PageUp",
          "PageDown",
          "Home",
          "End",
          " ",
        ].includes(event.key)
      )
        cancel();
    };
    const step = (time: number) => {
      // Preserve visible steps on slower GPUs instead of skipping the rewind.
      elapsed += Math.min(65, Math.max(0, time - previousTime));
      previousTime = time;
      const fraction = Math.min(1, elapsed / 650);
      const eased = fraction * fraction * (3 - 2 * fraction);
      const value = fromProgress * (1 - eased);
      progress.current = value;
      scene.current?.setProgress(value, true);
      setActive(Math.min(5, Math.round(value * 5)));
      meter.current?.style.setProperty("transform", `scaleX(${value})`);
      window.scrollTo({
        top: from + (destination - from) * eased,
        behavior: "instant",
      });
      if (fraction < 1) frame = requestAnimationFrame(step);
      else {
        cancel();
        activate();
      }
    };
    cancelReturn.current = cancel;
    setReturning(true);
    addEventListener("wheel", cancel, { passive: true });
    addEventListener("touchstart", cancel, { passive: true });
    addEventListener("pointerdown", cancel, { passive: true });
    addEventListener("keydown", onKey);
    motion.addEventListener("change", cancel);
    window.scrollTo({ top: from, behavior: "instant" });
    frame = requestAnimationFrame(step);
  };

  return (
    <section
      id="engineering-story"
      ref={section}
      data-returning={returning || undefined}
      className={`engineering-experience ${modelView ? "has-model-view" : ""} ${immersive ? "is-immersive" : "is-static"} ${paused && capable && !failed ? "is-paused" : ""}`}
      aria-label="Anatomy of a building"
    >
      <div className="engineering-stage">
        <div className="engineering-topline">
          <p className="eyebrow">
            <span className="story-dot" />{" "}
            {paused && capable && !failed
              ? immersiveStory.pausedLabel
              : immersiveStory.label}
          </p>
          {capable && !failed && (
            <button
              className="story-motion eyebrow"
              onClick={toggle}
              aria-pressed={paused}
              disabled={returning || (!ready && !paused)}
            >
              {paused ? <Play size={12} /> : <Pause size={12} />}{" "}
              {paused ? immersiveStory.resume : immersiveStory.pause}
            </button>
          )}
        </div>
        {modelView ? (
          <>
            <div className="engineering-backword" aria-hidden="true">
              {immersiveStory.words[active]}
            </div>
            <div className="engineering-visual" aria-hidden="true">
              {openingImage && (
                <div
                  className={`story-paused-image ${immersive && ready ? "is-hidden" : ""}`}
                >
                  <Image
                    src={openingImage}
                    alt={immersiveStory.posterAlt}
                    fill
                    unoptimized
                  />
                </div>
              )}
              {!openingImage && (
                <Image
                  src={immersiveStory.poster}
                  alt=""
                  fill
                  sizes="(max-width: 767px) 900px, (min-width: 1024px) 75vw, 100vw"
                  className={`story-poster ${ready ? "is-loaded" : ""}`}
                />
              )}
              {immersive && (
                <div
                  ref={host}
                  className={`engineering-canvas ${ready ? "is-ready" : ""} ${openingImage ? "has-opening" : ""}`}
                />
              )}
            </div>
            <div className="engineering-narrative">
              <p className="eyebrow story-kicker">{immersiveStory.kicker}</p>
              <h2 className="story-heading">
                {immersiveStory.title[0]}
                <br />
                <span>{immersiveStory.title[1]}</span>
              </h2>
              <div className="story-chapter" key={active}>
                <p className="eyebrow story-chapter-label">
                  0{active + 1} / {engineeringStages[active].label}
                </p>
                <h3>{engineeringStages[active].title}</h3>
                <p className="story-description">
                  {engineeringStages[active].description}
                </p>
              </div>
            </div>
            <div className="story-model-note eyebrow" aria-hidden="true">
              <span>FW—01 / CONCEPT PAVILION</span>
              <span>{immersiveStory.views[active]}</span>
            </div>
            <div className="story-bottom">
              <ChapterList
                className="story-chapters"
                aria-label="Building story chapters"
              >
                {engineeringStages.map((stage, i) => (
                  <Chapter
                    key={stage.id}
                    className="story-step"
                    onClick={paused ? undefined : () => goTo(i)}
                    aria-current={active === i ? "step" : undefined}
                    aria-label={`Chapter ${i + 1}: ${stage.label}`}
                  >
                    <span className="eyebrow">0{i + 1}</span>
                    <span>{immersiveStory.nav[i]}</span>
                  </Chapter>
                ))}
              </ChapterList>
              {immersive && (
                <div className="story-scroll eyebrow">
                  <ArrowDown size={14} /> {immersiveStory.scroll}
                </div>
              )}
            </div>
            {immersive && (
              <div className="story-progress" aria-hidden="true">
                <div ref={meter} />
              </div>
            )}
          </>
        ) : (
          <div className="story-static-content">
            <p className="eyebrow story-kicker">{immersiveStory.kicker}</p>
            <h2 className="story-heading">{immersiveStory.title.join(" ")}</h2>
            <div className="story-static-poster">
              <Image
                src={immersiveStory.poster}
                alt="Blender-created architectural model of a terraced pavilion with bronze facade fins and pale concrete floors"
                fill
                sizes="(max-width: 767px) 700px, 70vw"
              />
            </div>
            <div className="story-static-chapters">
              {engineeringStages.map((stage, i) => (
                <article key={stage.id}>
                  <div className="story-static-drawing">
                    <StructureDrawing stage={i} />
                  </div>
                  <div>
                    <p className="eyebrow story-chapter-label">
                      0{i + 1} / {stage.label}
                    </p>
                    <h3>{stage.title}</h3>
                    <p className="story-description">{stage.description}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
