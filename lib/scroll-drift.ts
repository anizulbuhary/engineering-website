// One scroll listener and one scheduled frame for all visible editorial photos.
const items = new Map<HTMLElement, HTMLElement>();
let frame = 0;
let listening = false;
function update() {
  frame = 0;
  const limit = matchMedia("(max-width: 767px)").matches ? 4 : 12;
  for (const [frameElement, image] of items) {
    const rect = frameElement.getBoundingClientRect();
    const progress = Math.max(
      0,
      Math.min(1, (innerHeight - rect.top) / (innerHeight + rect.height)),
    );
    image.style.setProperty(
      "--image-drift",
      `${((progress * 2 - 1) * limit).toFixed(2)}px`,
    );
  }
}
function schedule() {
  if (!document.hidden && !frame && items.size)
    frame = requestAnimationFrame(update);
}
export function observeDrift(frameElement: HTMLElement, image: HTMLElement) {
  items.set(frameElement, image);
  if (!listening) {
    addEventListener("scroll", schedule, { passive: true });
    addEventListener("resize", schedule);
    document.addEventListener("visibilitychange", schedule);
    listening = true;
  }
  schedule();
  return () => {
    items.delete(frameElement);
    if (!items.size) {
      cancelAnimationFrame(frame);
      frame = 0;
      removeEventListener("scroll", schedule);
      removeEventListener("resize", schedule);
      document.removeEventListener("visibilitychange", schedule);
      listening = false;
    }
  };
}
