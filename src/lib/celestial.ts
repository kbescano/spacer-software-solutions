import { GROUND, LIGHT, PANEL } from "@/lib/palette";

// A seamless celestial pattern for the hero's background: overlapping scallops
// (seigaiha) each holding a small sky — a night of stars, a crescent moon,
// concentric rings, a planet, a cream mosaic. Drawn here instead of loading an
// image, so it is crisp at any size, weighs a few kilobytes, and uses only the
// palette: the colors below are the palette's own constants.

const R = 80; // radius of one scallop
const COLS = 3;
const ROWS = 6;
const SIZE = 2 * R * COLS; // the tile is 480 x 480 and repeats without a seam

const f = (n: number) => +n.toFixed(1);

function star(x: number, y: number, s: number) {
  const a = s * 0.28;
  return `<path d='M${f(x)} ${f(y - s)}L${f(x + a)} ${f(y - a)}L${f(x + s)} ${f(y)}L${f(x + a)} ${f(y + a)}L${f(x)} ${f(y + s)}L${f(x - a)} ${f(y + a)}L${f(x - s)} ${f(y)}L${f(x - a)} ${f(y - a)}Z' fill='${LIGHT}'/>`;
}

// fixed offsets inside a scallop, so every tile draws the same sky
const SKY: [number, number, number][] = [
  [-34, -30, 5],
  [10, -44, 7],
  [40, -18, 4],
  [-8, -12, 3],
  [26, 10, 4],
  [-44, 6, 3.5],
  [-20, 28, 4],
  [8, 32, 3],
];

function scallop(kind: number, cx: number, cy: number) {
  const ring = (r: number, opacity: number, stroke: string, w = 1.2) =>
    `<circle cx='${cx}' cy='${cy}' r='${f(r)}' fill='none' stroke='${stroke}' stroke-opacity='${opacity}' stroke-width='${w}'/>`;
  let body = "";
  switch (kind) {
    case 0: // a night of stars
      body =
        `<circle cx='${cx}' cy='${cy}' r='${R}' fill='${GROUND}'/>` +
        SKY.map(([dx, dy, s]) => star(cx + dx, cy + dy, s)).join("");
      break;
    case 1: // rings on deep water
      body =
        `<circle cx='${cx}' cy='${cy}' r='${R}' fill='${PANEL}'/>` +
        [0.88, 0.74, 0.6, 0.46, 0.32, 0.18].map((t) => ring(R * t, 0.8, LIGHT)).join("");
      break;
    case 2: // a crescent moon
      body =
        `<circle cx='${cx}' cy='${cy}' r='${R}' fill='${GROUND}'/>` +
        `<path d='M${cx + 4} ${cy - 30}A30 30 0 1 0 ${cx + 4} ${cy + 30}A22 22 0 1 1 ${cx + 4} ${cy - 30}Z' fill='${LIGHT}'/>` +
        SKY.slice(0, 4).map(([dx, dy, s]) => star(cx + dx - 14, cy + dy - 6, s * 0.7)).join("");
      break;
    case 3: // cream, with small waves
      body =
        `<circle cx='${cx}' cy='${cy}' r='${R}' fill='${LIGHT}'/>` +
        [0.86, 0.72, 0.58, 0.44, 0.3, 0.16].map((t) => ring(R * t, 0.55, PANEL)).join("");
      break;
    case 4: // a cream mosaic fan
      body =
        `<circle cx='${cx}' cy='${cy}' r='${R}' fill='${LIGHT}'/>` +
        Array.from({ length: 12 }, (_, k) => {
          const a = (k * Math.PI) / 6;
          return `<line x1='${cx}' y1='${cy}' x2='${f(cx + R * Math.cos(a))}' y2='${f(cy + R * Math.sin(a))}' stroke='${GROUND}' stroke-opacity='0.35' stroke-width='1'/>`;
        }).join("") +
        ring(R * 0.55, 0.35, GROUND, 1) +
        ring(R * 0.8, 0.35, GROUND, 1);
      break;
    default: // a planet in the dark
      body =
        `<circle cx='${cx}' cy='${cy}' r='${R}' fill='${PANEL}'/>` +
        `<circle cx='${cx}' cy='${cy}' r='${f(R * 0.3)}' fill='${GROUND}' stroke='${LIGHT}' stroke-width='1.4'/>` +
        SKY.slice(2, 7).map(([dx, dy, s]) => star(cx + dx * 1.1, cy + dy * 1.1, s * 0.8)).join("");
  }
  // every scallop gets a fine edge
  return body + ring(R - 1.2, 0.75, LIGHT, 1.6);
}

function tile() {
  const parts: string[] = [`<rect width='${SIZE}' height='${SIZE}' fill='${GROUND}'/>`];
  // rows run top to bottom, so each covers the lower half of the one above;
  // the extra rows and columns past the edges are what make the tile seamless
  for (let j = -2; j <= ROWS + 1; j++) {
    for (let i = -2; i <= COLS + 1; i++) {
      const shift = ((j % 2) + 2) % 2 ? R : 0;
      const ci = ((i % COLS) + COLS) % COLS;
      const cj = ((j % ROWS) + ROWS) % ROWS;
      parts.push(scallop((ci * 5 + cj * 7 + (cj % 2) * 3) % 6, i * 2 * R + shift, j * R));
    }
  }
  return `<svg xmlns='http://www.w3.org/2000/svg' width='${SIZE}' height='${SIZE}' viewBox='0 0 ${SIZE} ${SIZE}'>${parts.join("")}</svg>`;
}

export const CELESTIAL_PATTERN = `url("data:image/svg+xml,${encodeURIComponent(tile())}")`;
