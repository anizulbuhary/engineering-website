// The camera and building systems share one reversible scroll timeline.
const shots = [
  {
    angle: 0.68,
    height: 0.43,
    distance: 28,
    spread: 0,
    facade: 1,
    solid: 1,
    rebar: 0,
    services: 0,
    drawing: 0,
  },
  {
    angle: 1.2,
    height: 0.36,
    distance: 30,
    spread: 0.28,
    facade: 0,
    solid: 1,
    rebar: 0,
    services: 0,
    drawing: 0,
  },
  {
    angle: 1.95,
    height: 0.28,
    distance: 30,
    spread: 0.55,
    facade: 0,
    solid: 0.055,
    rebar: 1,
    services: 0,
    drawing: 0.22,
  },
  {
    angle: 2.65,
    height: 0.53,
    distance: 32,
    spread: 0.65,
    facade: 0,
    solid: 0.065,
    rebar: 0,
    services: 1,
    drawing: 0.25,
  },
  {
    angle: Math.PI,
    height: 0.025,
    distance: 31,
    spread: 0.22,
    facade: 0,
    solid: 0.025,
    rebar: 0,
    services: 0,
    drawing: 1,
  },
  {
    angle: Math.PI * 2 + 0.68,
    height: 0.43,
    distance: 28,
    spread: 0,
    facade: 1,
    solid: 1,
    rebar: 0,
    services: 0,
    drawing: 0,
  },
];

const clamp = (value: number) => Math.max(0, Math.min(1, value));
const ease = (value: number) => {
  const t = clamp(value);
  return t * t * (3 - 2 * t);
};
const gentle = (value: number) => {
  const t = clamp(value);
  return t * t * t * (t * (t * 6 - 15) + 10);
};

/** Scroll stays linear for navigation; the scene gets quiet assembled bookends. */
export function sampleEngineeringTimeline(progress: number) {
  const p = clamp(progress) * (shots.length - 1);
  const index = Math.min(Math.floor(p), shots.length - 2);
  const local = p - index;
  const a = shots[index],
    b = shots[index + 1];
  const cameraBlend = index === shots.length - 2 ? gentle(local) : ease(local);
  const assemblyBlend =
    index === 0
      ? gentle((local - 0.3) / 0.7)
      : index === shots.length - 2
        ? gentle(local / 0.7)
        : ease(local);
  const interpolate = (key: keyof typeof a, blend: number) =>
    a[key] + (b[key] - a[key]) * blend;
  return {
    angle: interpolate("angle", cameraBlend),
    height: interpolate("height", cameraBlend),
    distance: interpolate("distance", cameraBlend),
    spread: interpolate("spread", assemblyBlend),
    facade: interpolate("facade", assemblyBlend),
    solid: interpolate("solid", assemblyBlend),
    rebar: interpolate("rebar", assemblyBlend),
    services: interpolate("services", assemblyBlend),
    drawing: interpolate("drawing", assemblyBlend),
  };
}
