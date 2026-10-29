// The whole site's color set — six colors, and the ONLY place a hex value
// lives. Names say what a color is FOR, not what hue it is today, so you can
// swap any hex below without the rest of the code lying about it.
//
// Change a color here and the whole site follows: layout.tsx publishes these
// as CSS variables on <html> (--paper, --ground, --panel, --light, --headline,
// --sign and their -rgb channels, see paletteCssVars), and the OG image, logo
// mark, favicon, Framer tweens and <meta theme-color> import them directly.
// Every lighter, darker or softer shade elsewhere is one of these at partial
// opacity — nothing outside them is allowed.

export const PAPER = "#FFFFF0"; // the hero's background, and nothing else
export const GROUND = "#0A2342"; // section backgrounds; ink on the hero paper
export const PANEL = "#0F3C65"; // cards, buttons, panes, glows
export const LIGHT = "#FAF1CA"; // text and accents on the dark sections
export const HEADLINE = "#1b9aaa"; // the big outlined headline words, and the hero's S3 neon sign
export const SIGN = "#EA638C"; // the hero's SPACER neon sign, and nothing else

export function alpha(hex: string, a: number) {
  const n = parseInt(hex.slice(1), 16);
  return `rgba(${n >> 16}, ${(n >> 8) & 255}, ${n & 255}, ${a})`;
}

/** "r g b" channels, for CSS like rgb(var(--panel-rgb) / 0.4). */
function channels(hex: string) {
  const n = parseInt(hex.slice(1), 16);
  return `${n >> 16} ${(n >> 8) & 255} ${n & 255}`;
}

const PALETTE = {
  paper: PAPER,
  ground: GROUND,
  panel: PANEL,
  light: LIGHT,
  headline: HEADLINE,
  sign: SIGN,
};

/** --paper / --paper-rgb … for every color above, ready for <html style>. */
export const paletteCssVars = Object.fromEntries(
  Object.entries(PALETTE).flatMap(([name, hex]) => [
    [`--${name}`, hex],
    [`--${name}-rgb`, channels(hex)],
  ]),
);
