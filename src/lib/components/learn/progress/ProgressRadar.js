'use client';
import { useState } from 'react';

/*
Radar chart for the Progress page: one vertex per specification area, with the
shaded shape reaching further towards a vertex the higher the student's mastery there.

Click only (no hover): the page's cards change when a corner is clicked / tapped, or
chosen with Enter/Space. Hover previews were removed because cards changing as the
mouse moved across the chart flickered.
  pinned   index of the selected skill (owned by the page)
Hovering only recolours the corner (teal) and keyboard focus only draws a dashed ring;
neither changes the cards.
Plain SVG, no chart library. `areas` comes from computeMastery().
*/

// Drawing area in viewBox units. Wider than tall, with room either side so the labels on
// the left and right corners are never clipped (they extend sideways from their corner).
const WIDTH = 720;
const HEIGHT = 540;
const C = WIDTH / 2; // centre x
const CY = 262; // centre y
const R = 200; // radius of the outer shape
const LABEL_R = R + 30;
const LABEL_FONT = 16;
const LINE = 18; // line height for labels that wrap onto two lines
const MIN_SHOWN = 0.04; // a sliver of shape even at 0%, so the chart never looks empty

const TEAL = '#17a2b8';
const INK = '#1f3b4d';

// position of vertex i out of n at radius r (first vertex at the top, clockwise)
function point(i, n, r) {
  const angle = -Math.PI / 2 + (2 * Math.PI * i) / n;
  return [C + r * Math.cos(angle), CY + r * Math.sin(angle)];
}

// "Coordinate geometry" -> ["Coordinate", "geometry"]: long multi-word labels wrap onto two
// lines at the space closest to the middle, so they stay narrow beside the chart
function labelLines(label) {
  if (label.length <= 12 || !label.includes(' ')) return [label];
  const mid = label.length / 2;
  let split = -1;
  for (let i = 0; i < label.length; i++) {
    if (label[i] === ' ' && (split === -1 || Math.abs(i - mid) < Math.abs(split - mid))) split = i;
  }
  return [label.slice(0, split), label.slice(split + 1)];
}
const toPoints = (pts) => pts.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(' ');
const pct = (v) => `${Math.round(v * 100)}%`;

export default function ProgressRadar({ areas, pinned, onPin }) {
  const [focused, setFocused] = useState(null); // keyboard focus ring only
  const [hovered, setHovered] = useState(null); // colour cue only: shows a corner is clickable, never changes the cards
  const n = areas.length;
  const ring = (f) => toPoints(areas.map((_, i) => point(i, n, R * f)));
  const shape = toPoints(areas.map((a, i) => point(i, n, R * Math.max(a.mastery, MIN_SHOWN))));

  return (
    <div style={{ width: '100%', maxWidth: `${WIDTH}px`, margin: '0 auto' }}>
      <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} width="100%" role="group" aria-label="Progress radar chart: choose a skill to see its details">
        <defs>
          <radialGradient id="progress-radar-bg">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="100%" stopColor="#8fd3e8" />
          </radialGradient>
        </defs>

        {/* background shape, quarter rings and spokes */}
        <polygon points={ring(1)} fill="url(#progress-radar-bg)" stroke={INK} strokeWidth="3" strokeLinejoin="round" />
        {[0.25, 0.5, 0.75].map((f) => (
          <polygon key={f} points={ring(f)} fill="none" stroke="#ffffff" strokeOpacity="0.8" strokeWidth="1.5" />
        ))}
        {areas.map((_, i) => {
          const [x, y] = point(i, n, R);
          return <line key={i} x1={C} y1={CY} x2={x} y2={y} stroke="#5aa9bf" strokeOpacity="0.6" strokeWidth="1.5" />;
        })}

        {/* the student's shape */}
        <polygon points={shape} fill={TEAL} fillOpacity="0.55" stroke="#0e7c8f" strokeWidth="2.5" strokeLinejoin="round" />

        {/* vertices + labels: click / tap / Enter selects */}
        {areas.map((area, i) => {
          const [vx, vy] = point(i, n, R);
          const [lx, ly] = point(i, n, LABEL_R);
          const anchor = lx < C - 10 ? 'end' : lx > C + 10 ? 'start' : 'middle';
          const isPinned = pinned === i;
          const isHighlighted = isPinned;
          const isHovered = hovered === i && !isPinned;
          const lines = labelLines(area.short);
          // labels on the top half sit above their corner, so stack them upwards
          const firstLineY = ly < CY - 10 ? ly - (lines.length - 1) * LINE - LINE / 2 : ly;
          return (
            <g
              key={area.id}
              role="button"
              tabIndex={0}
              aria-label={`${area.name}: ${area.total ? pct(area.mastery) : 'no questions yet'}`}
              aria-pressed={isPinned}
              style={{ cursor: 'pointer', outline: 'none' }}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
              onFocus={() => setFocused(i)}
              onBlur={() => setFocused(null)}
              onClick={() => onPin(i)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onPin(i);
                }
              }}
            >
              <circle cx={vx} cy={vy} r="26" fill="transparent" />
              {/* keyboard focus ring (a clicked corner is selected anyway, so it isn't needed there) */}
              {focused === i && !isPinned && (
                <circle cx={vx} cy={vy} r="15" fill="none" stroke={TEAL} strokeWidth="2" strokeDasharray="4 3" />
              )}
              {/* selected = filled teal; hovered = light teal fill + teal outline (colour swap only, no animation) */}
              <circle
                cx={vx}
                cy={vy}
                r={isPinned ? 9 : 7}
                fill={isPinned ? TEAL : isHovered ? '#d8eff3' : '#ffffff'}
                stroke={isHovered ? TEAL : INK}
                strokeWidth="2.5"
              />
              <text
                textAnchor={anchor}
                dominantBaseline="middle"
                fontSize={LABEL_FONT}
                fontWeight={isHighlighted ? 'bold' : 'normal'}
                fill={isHighlighted ? '#0e7c8f' : isHovered ? TEAL : INK}
              >
                {lines.map((text, k) => (
                  <tspan key={k} x={lx} y={firstLineY + k * LINE}>
                    {text}
                  </tspan>
                ))}
              </text>
              <text x={lx} y={firstLineY + lines.length * LINE} textAnchor={anchor} dominantBaseline="middle" fontSize="13" fill="#6c757d">
                {area.total ? pct(area.mastery) : '–'}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

export function MasteryBar({ value }) {
  return (
    <div style={{ height: '8px', background: '#e9ecef', borderRadius: '4px', overflow: 'hidden' }}>
      <div style={{ width: pct(value), height: '100%', background: TEAL }} />
    </div>
  );
}
