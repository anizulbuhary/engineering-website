import { useId } from "react";
export function StructureDrawing({ stage = 0 }: { stage?: number }) {
  const gridId = useId();
  const floors = [0, 1, 2, 3, 4, 5];
  return (
    <svg
      viewBox="0 0 640 620"
      fill="none"
      className="w-full h-auto"
      role="img"
      aria-label={
        [
          "Architectural massing illustration",
          "Structural frame illustration",
          "Reinforcement zones illustration",
          "Coordinated systems illustration",
          "Drawing package illustration",
          "Final indexed package illustration",
        ][stage]
      }
    >
      <defs>
        <pattern
          id={gridId}
          width="40"
          height="40"
          patternUnits="userSpaceOnUse"
        >
          <path
            d="M40 0H0V40"
            stroke="#a7aca5"
            strokeWidth=".5"
            opacity=".25"
          />
        </pattern>
      </defs>
      <rect width="640" height="620" fill={`url(#${gridId})`} />
      <g stroke="var(--text-secondary)" strokeWidth="1">
        <path d="M65 460 325 595 595 445M325 595V565" strokeDasharray="4 5" />
        <path d="M78 445V135M68 445h20M68 135h20" />
        <path d="M110 490 310 590M110 480v20M310 580v20" />
      </g>
      <g strokeLinejoin="round">
        {floors.map((f) => {
          const y = 420 - f * 54;
          return (
            <g key={f}>
              <path
                d={`M150 ${y}L340 ${y + 87}L530 ${y - 17}L340 ${y - 105}Z`}
                fill={
                  stage === 0 ? "#babdb0" : stage === 5 ? "#d9d5cc" : "#50584d"
                }
                stroke="#c3c7b8"
                strokeWidth="1.5"
              />
              <path
                d={`M150 ${y}v10l190 87 190-104v-10L340 ${y + 87}Z`}
                fill="#343d33"
                stroke="#a8b09f"
              />
              {f < 5 &&
                [0, 1, 2, 3].map((c) => (
                  <g key={c} stroke="#b6bdac" strokeWidth="5">
                    <path
                      d={`M${150 + c * 63.3} ${y + c * 29}v-44M${340 + c * 63.3} ${y + 87 - c * 34.7}v-44`}
                    />
                  </g>
                ))}
              {stage === 2 && (
                <g stroke="#d17c4c" strokeWidth="1">
                  {[0, 1, 2, 3, 4, 5, 6].map((k) => (
                    <path
                      key={k}
                      d={`M${160 + k * 25} ${y - 3 + k * 11.5}l180-98M${160 + k * 25} ${y - 3 + k * 11.5}v-44`}
                    />
                  ))}
                </g>
              )}
            </g>
          );
        })}
        {stage === 0 && (
          <path
            d="M150 150 340 237 530 133V403L340 507 150 420Z"
            fill="#c8c9ba"
            opacity=".28"
            stroke="#e0e1d5"
          />
        )}
        {stage === 3 && (
          <g stroke="#d17c4c" strokeWidth="5">
            <path d="M110 310 340 415 566 291M205 338V178M425 371V186" />
            <circle cx="340" cy="415" r="15" fill="#263024" strokeWidth="2" />
          </g>
        )}
        {stage >= 4 && (
          <g transform="translate(335 352)">
            <path
              d="M0 25 180 0 220 147 40 174Z"
              fill="#d9d5cc"
              stroke="#21291f"
            />
            <path
              d="M-12 13 168-12 208 135 28 162Z"
              fill="#f4f2ed"
              stroke="#21291f"
            />
            <g stroke="#52604c">
              <path d="M12 40 155 20 179 106 37 127Z M18 62 161 42M25 83 166 64M31 104 172 85M54 34 79 121M105 26 130 113" />
              <path d="M42 140 145 126" />
            </g>
            {stage === 5 && (
              <g>
                <circle cx="174" cy="132" r="24" fill="#b84f24" />
                <path d="m161 132 9 9 17-20" stroke="#fff" strokeWidth="3" />
              </g>
            )}
          </g>
        )}
      </g>
      <g
        fill="var(--text-secondary)"
        fontFamily="monospace"
        fontSize="10"
        letterSpacing="1"
      >
        <text x="32" y="40">
          FW / STRUCTURAL STUDY
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
