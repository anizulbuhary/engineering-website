import { useId } from "react";
import model from "@/content/engineering-model.json";

type Point = [number, number, number];
const project = ([x, y, z]: Point) =>
  `${320 + 22 * x + 14 * y},${470 + 9 * x - 12 * y - 31 * z}`;
const path = (points: Point[], closed = false) =>
  `M${points.map(project).join("L")}${closed ? "Z" : ""}`;
const rect = (
  x0: number,
  x1: number,
  y0: number,
  y1: number,
  z: number,
): Point[] => [
  [x0, y0, z],
  [x1, y0, z],
  [x1, y1, z],
  [x0, y1, z],
];

/** The fallback shares its massing data with Blender, so it describes the same
 * courtyard and stepped wings when WebGL or motion is unavailable. */
export function StructureDrawing({ stage = 0 }: { stage?: number }) {
  const gridId = useId();
  const assembled = stage === 0 || stage === 5;
  const spread = assembled ? 0 : 0.2;
  const h = model.floorHeight;
  const ink = "var(--text-secondary)";
  const accent = "var(--text-accent)";
  const plates = model.wings
    .flatMap(([x0, x1, y0, y1, floors]) =>
      Array.from({ length: floors + 1 }, (_, floor) => ({
        x0,
        x1,
        y0,
        y1,
        floor,
        floors,
      })),
    )
    .concat(
      [0, 2].map((floor) => ({
        x0: model.entrance[0],
        x1: model.entrance[1],
        y0: model.entrance[2],
        y1: model.entrance[3],
        floor,
        floors: 2,
      })),
    )
    .sort((a, b) => a.floor - b.floor || b.y0 - a.y0 || a.x0 - b.x0);
  return (
    <svg
      viewBox="0 0 640 620"
      fill="none"
      className="w-full h-auto"
      role="img"
      aria-label={`${model.name}: ${["architectural massing", "structural frame", "reinforcement zones", "coordinated systems", "drawing study", "assembled building"][stage]} illustration`}
    >
      <defs>
        <pattern
          id={gridId}
          width="40"
          height="40"
          patternUnits="userSpaceOnUse"
        >
          <path d="M40 0H0V40" stroke={ink} strokeWidth=".5" opacity=".18" />
        </pattern>
      </defs>
      <rect width="640" height="620" fill={`url(#${gridId})`} />
      <g stroke={ink} strokeWidth=".8" opacity=".6">
        <path
          d="M70 510V122M62 510H78M62 122H78M110 536 333 587 578 491"
          strokeDasharray="4 5"
        />
        <path d={path(rect(-5.4, 5.4, -4.4, 4.2, -0.7), true)} />
      </g>
      <g stroke={ink} strokeLinejoin="round" strokeWidth="1.1">
        {plates.map(({ x0, x1, y0, y1, floor, floors }, i) => {
          const z = floor * (h + spread);
          const roof = floor === floors;
          const storeyHeight = floors === 2 ? 2 * h : h;
          return (
            <g key={i}>
              <path
                d={path(rect(x0, x1, y0, y1, z), true)}
                fill={
                  assembled
                    ? "var(--surface-section)"
                    : "var(--surface-drawing)"
                }
                fillOpacity={
                  stage === 2 || stage === 3 || stage === 4 ? 0.32 : 0.9
                }
              />
              {!roof && (
                <g>
                  {[x0 + 0.26, x1 - 0.26].flatMap((x) =>
                    [y0 + 0.26, y1 - 0.26].map((y) => (
                      <path
                        key={`${x}/${y}`}
                        d={path([
                          [x, y, z + 0.1],
                          [x, y, z + storeyHeight - 0.1],
                        ])}
                        strokeWidth={assembled ? "4" : "2"}
                      />
                    )),
                  )}
                  {assembled && (
                    <>
                      <path
                        d={path(
                          [
                            [x0, y0, z],
                            [x1, y0, z],
                            [x1, y0, z + storeyHeight],
                            [x0, y0, z + storeyHeight],
                          ],
                          true,
                        )}
                        fill="var(--surface-section)"
                        fillOpacity=".78"
                      />
                      <path
                        d={path(
                          [
                            [x1, y0, z],
                            [x1, y1, z],
                            [x1, y1, z + storeyHeight],
                            [x1, y0, z + storeyHeight],
                          ],
                          true,
                        )}
                        fill="var(--surface-section)"
                        fillOpacity=".60"
                      />
                      {[0.22, 0.5, 0.78].map((t) => (
                        <g key={t} strokeWidth="2.5">
                          <path
                            d={path([
                              [x0 + (x1 - x0) * t, y0, z + 0.16],
                              [x0 + (x1 - x0) * t, y0, z + storeyHeight - 0.16],
                            ])}
                          />
                          <path
                            d={path([
                              [x1, y0 + (y1 - y0) * t, z + 0.16],
                              [x1, y0 + (y1 - y0) * t, z + storeyHeight - 0.16],
                            ])}
                          />
                        </g>
                      ))}
                    </>
                  )}
                </g>
              )}
              {roof && assembled && (
                <path
                  d={path(
                    rect(x0 + 0.14, x1 - 0.14, y0 + 0.14, y1 - 0.14, z + 0.28),
                    true,
                  )}
                  strokeWidth="2"
                />
              )}
            </g>
          );
        })}
      </g>
      {stage === 2 && (
        <g stroke={accent} strokeWidth="1.4">
          {[1, 2, 3, 4].map((f) => (
            <g key={f}>
              {Array.from({ length: 9 }, (_, i) => (
                <path
                  key={i}
                  d={path([
                    [-4.25, -3.25 + i * 0.16, f * (h + spread) + 0.03],
                    [-1.95, -3.25 + i * 0.16, f * (h + spread) + 0.03],
                  ])}
                />
              ))}
              <path
                d={path([
                  [-1.96, -3.34, f * (h + spread) + 0.1],
                  [-1.96, -3.34, f * (h + spread) + h - 0.1],
                ])}
                strokeWidth="4"
              />
            </g>
          ))}
        </g>
      )}
      {stage === 3 && (
        <g stroke={accent} strokeWidth="4" strokeLinejoin="miter">
          {[1, 3, 4].map((f) => (
            <g key={f}>
              <path
                d={path([
                  [-3.1, -3.1, f * (h + spread) + h - 0.35],
                  [-3.1, 2.35, f * (h + spread) + h - 0.35],
                  [3.35, 2.35, f * (h + spread) + h - 0.35],
                ])}
              />
              {f < 4 && (
                <path
                  d={path([
                    [3.35, 2.35, f * (h + spread) + h - 0.35],
                    [3.35, -2.8, f * (h + spread) + h - 0.35],
                  ])}
                />
              )}
            </g>
          ))}
        </g>
      )}
      {stage === 4 && (
        <g stroke={accent} strokeWidth="1">
          <path d="M112 555H540M112 548v14M540 548v14M90 110V515M83 110H97M83 515H97" />
          {[2, 4, 5, 6].map((f) => (
            <path
              key={f}
              d={`M${project([-4.7, -3.6, f * (h + spread)])}h-38`}
            />
          ))}
        </g>
      )}
      <g fill={ink} fontFamily="monospace" fontSize="10" letterSpacing="1">
        <text x="32" y="40">
          FW / COURTYARD HOUSE
        </text>
        <text x="32" y="590">
          ILLUSTRATIVE · NOT TO SCALE
        </text>
        <text x="500" y="40">
          0{stage + 1} / 06
        </text>
      </g>
    </svg>
  );
}
