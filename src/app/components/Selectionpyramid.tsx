"use client";

import { Box } from "@mui/material";

/*
  One triangle split into 5 tiers, each tier nested inside the one below it.
  Labels sit inside the tiers (top → bottom):
  Final Selection, Interview Selection, Mains selection, Prelims appeared, Applied
*/

const CX = 260; // apex x
const TOP = 10; // apex y
const BOTTOM = 330; // base y
const HALF_BASE = 250; // half-width of the base
const TIERS = 5;
const TIER_H = (BOTTOM - TOP) / TIERS;

const stages = [
  // lines: the top tier is narrow, so its label wraps onto two lines
  { lines: ["Final", "Selection"], fill: "#14532d", text: "#ffffff" },
  { lines: ["Interview Selection"], fill: "#15803d", text: "#ffffff" },
  { lines: ["Mains selection"], fill: "#4ade80", text: "#052e16" },
  { lines: ["Prelims appeared"], fill: "#86efac", text: "#052e16" },
  { lines: ["Applied"], fill: "#bbf7d0", text: "#052e16" },
];

const halfWidthAt = (y: number) => (HALF_BASE * (y - TOP)) / (BOTTOM - TOP);

export default function SelectionPyramid() {
  return (
    <Box
      sx={{ width: "100%", maxWidth: 520, mt: 3 }}
      role="img"
      aria-label="UPSC selection funnel: Applied, Prelims appeared, Mains selection, Interview selection, Final selection"
    >
      <svg viewBox="0 0 520 340" width="100%" style={{ display: "block" }}>
        {stages.map((s, i) => {
          const y0 = TOP + i * TIER_H;
          const y1 = y0 + TIER_H;
          const w0 = halfWidthAt(y0);
          const w1 = halfWidthAt(y1);
          const points = [
            `${CX - w0},${y0}`,
            `${CX + w0},${y0}`,
            `${CX + w1},${y1}`,
            `${CX - w1},${y1}`,
          ].join(" ");

          const lineH = 16;
          // first baseline: push text toward the wider (lower) part of the tier
          const firstY =
            y0 + TIER_H * (s.lines.length > 1 ? 0.62 : 0.6) - ((s.lines.length - 1) * lineH) / 2 + (s.lines.length > 1 ? 4 : 0);

          return (
            <g key={s.lines.join(" ")}>
              <polygon
                points={points}
                fill={s.fill}
                stroke="#fff"
                strokeWidth="3"
                strokeLinejoin="round"
              />
              <text
                textAnchor="middle"
                fontSize="14"
                fontWeight={700}
                fill={s.text}
              >
                {s.lines.map((line, li) => (
                  <tspan key={line} x={CX} y={firstY + li * lineH}>
                    {line}
                  </tspan>
                ))}
              </text>
            </g>
          );
        })}
      </svg>
    </Box>
  );
}