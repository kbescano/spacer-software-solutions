// The S3 monogram from the brand's logo artwork, vectorised once with
// potrace so it stays crisp at every size (favicon, nav badge, share
// images, Facebook assets) instead of being re-approximated per surface.
// Palette locked in by the user (Sep 2026): dark #031d44, bright #6ccfd4,
// backing #fffff0. Don't re-derive these from the source photo again —
// they're the confirmed final values. The gradient direction was fit
// empirically against the source (see project notes) — near-horizontal,
// brightening toward the right and biased upward, since the "3" reads
// bright across its whole upper stroke in the source, not just one corner.

export const S3_MARK_VIEWBOX = "0 0 1024 1024";

// The traced mark only fills ~49% of S3_MARK_VIEWBOX's width and ~36% of its
// height (measured via the rendered <path>'s getBBox(), mapped through
// S3_MARK_TRANSFORM: local bbox x[2619,7620] y[3429.84,7150] -> final-space
// x[261.9,762.0] y[309.0,681.0]) — the rest is dead ivory space baked into
// the source trace. For contexts where the mark is the whole graphic (the
// circular nav/Facebook badge), crop to this tighter box instead so it reads
// at full size; the path/transform are untouched, this only changes which
// slice of the same 1024x1024 canvas is shown. ~82% width fill, ~61% height.
export const S3_MARK_BADGE_VIEWBOX = "207 190 610 610";

// Applies potrace's internal decipoint coordinate system to plain SVG
// user-space units. Keep this paired with S3_MARK_PATH — don't transform
// the path data itself, transform the group it's drawn in.
export const S3_MARK_TRANSFORM = "translate(0,1024) scale(0.1,-0.1)";

// Three subpaths — potrace decomposed the ribbon into three closed contours
// (visually seamless, but topologically separate where the "S" meets the
// "3"). All three are required for a complete mark; keeping only the first
// (an earlier version of this file did) renders just the tail of the "S".
export const S3_MARK_PATH =
  "M3625 7143 c-52 -7 -184 -43 -238 -64 -370 -145 -634 -469 -703 -864 " +
  "-22 -123 -14 -359 15 -465 124 -454 510 -793 956 -840 49 -5 293 -10 541 -10 " +
  "510 0 508 0 592 -75 96 -86 131 -228 88 -355 -14 -41 -35 -71 -81 -117 -99 " +
  "-98 -45 -93 -924 -93 l-756 0 -71 -83 c-38 -45 -150 -176 -247 -290 l-178 " +
  "-208 3 -122 3 -122 975 -3 c1013 -3 1096 0 1246 39 339 89 651 362 779 681 " +
  "150 377 94 811 -146 1128 -171 225 -425 380 -703 429 -37 7 -245 11 -536 11 " +
  "-528 0 -555 3 -638 63 -24 18 -60 59 -80 91 -32 51 -37 69 -40 132 -6 104 16 " +
  "161 87 233 90 92 81 91 581 91 l427 0 12 52 c6 29 27 91 46 139 19 47 35 90 " +
  "35 93 0 4 -226 6 -502 4 l-503 -3 -74 -27 c-179 -65 -302 -192 -368 -380 -22 " +
  "-61 -26 -91 -27 -178 0 -118 10 -163 61 -269 26 -54 55 -94 107 -145 79 -80 " +
  "131 -113 226 -148 64 -23 72 -23 600 -28 l535 -6 88 -27 c149 -46 237 -98 351 " +
  "-206 113 -109 190 -241 238 -407 18 -65 22 -103 21 -214 0 -116 -4 -147 -27 " +
  "-223 -90 -300 -302 -511 -611 -609 -70 -22 -74 -23 -912 -26 -464 -1 -843 0 " +
  "-843 3 0 4 45 60 101 126 l101 119 667 0 c408 0 699 4 751 11 318 40 548 323 " +
  "527 649 -17 251 -177 458 -417 536 -49 16 -112 19 -600 24 l-545 5 -84 29 " +
  "c-368 128 -600 473 -578 859 13 222 101 405 274 566 70 66 108 93 188 131 179 " +
  "87 141 83 824 87 l603 4 55 60 c49 53 140 131 228 196 l30 22 -750 -1 c-412 0 " +
  "-763 -3 -780 -5z " +
  "M5645 7134 c-151 -27 -295 -86 -426 -175 -85 -57 -232 -207 -292 " +
  "-297 -121 -182 -197 -421 -197 -623 l0 -59 139 0 138 0 6 88 c17 236 123 451 " +
  "295 598 126 108 263 173 409 194 39 5 362 10 756 10 585 0 688 -2 685 -14 -2 " +
  "-8 -48 -64 -102 -125 l-99 -111 -591 0 c-485 0 -602 -3 -653 -15 -249 -59 " +
  "-434 -280 -458 -547 l-7 -78 140 0 140 0 6 31 c3 17 6 44 6 59 0 44 57 146 " +
  "106 189 81 71 82 71 586 71 308 0 448 -3 448 -11 0 -10 -43 -61 -285 -334 -77 " +
  "-87 -180 -205 -230 -261 -49 -56 -136 -154 -192 -217 l-103 -115 0 -171 0 " +
  "-171 298 0 c329 0 365 -5 454 -62 63 -40 105 -89 142 -168 28 -59 31 -74 31 " +
  "-165 0 -97 -2 -104 -38 -177 -43 -88 -102 -146 -187 -187 l-55 -26 -329 -5 " +
  "-329 -5 -19 -68 c-10 -37 -32 -97 -48 -134 -17 -36 -30 -70 -30 -76 0 -6 137 " +
  "-8 383 -4 314 4 392 7 441 21 182 51 346 187 428 356 56 114 71 183 71 315 0 " +
  "117 -19 197 -70 299 -69 137 -167 236 -297 300 -111 55 -170 66 -343 66 -91 0 " +
  "-154 4 -158 10 -3 6 25 45 63 88 291 323 473 527 632 707 234 264 505 569 593 " +
  "667 l67 75 0 137 0 136 -922 -1 c-753 -1 -938 -3 -1003 -15z " +
  "M6752 5675 c-51 -57 -92 -108 -92 -113 0 -4 24 -16 53 -27 216 -76 " +
  "413 -247 512 -445 73 -147 105 -278 105 -438 0 -289 -112 -529 -335 -719 -102 " +
  "-86 -209 -142 -360 -186 -65 -19 -102 -21 -565 -25 l-495 -4 -30 -36 c-38 -48 " +
  "-168 -165 -225 -203 -25 -17 -46 -34 -48 -40 -5 -13 1143 -12 1264 2 419 46 " +
  "774 300 961 685 76 157 123 363 123 534 0 135 -44 341 -100 473 -95 219 -248 " +
  "406 -440 535 -60 40 -201 112 -221 112 -8 0 -57 -47 -107 -105z";

export const S3_MARK_GRADIENT_COORDS = { x1: "0%", y1: "80%", x2: "100%", y2: "20%" };

export const S3_MARK_GRADIENT_STOPS = [
  { offset: "0%", color: "#031d44" },
  { offset: "100%", color: "#6ccfd4" },
] as const;

// Backing the mark ships on in the source artwork — used wherever the mark
// sits on a dark background, since its dark-navy end disappears against
// the site's own navy.
export const S3_MARK_BACKING = "#fffff0";

/** A fully self-contained <svg> markup string for the mark alone, transparent background — for contexts (like next/og's ImageResponse) that need a data: URI rather than nested <svg>. */
export function s3MarkSvgMarkup(gradientId = "s3mark"): string {
  const stops = S3_MARK_GRADIENT_STOPS.map(
    (s) => `<stop offset="${s.offset}" stop-color="${s.color}"/>`,
  ).join("");
  const { x1, y1, x2, y2 } = S3_MARK_GRADIENT_COORDS;
  return (
    // width/height alongside viewBox: some <img>-as-data-URI renderers (Satori
    // included) size the image from the SVG root's intrinsic dimensions, not
    // just its viewBox, and otherwise crop to a tiny top-left corner.
    `<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1024" viewBox="${S3_MARK_VIEWBOX}">` +
    `<defs><linearGradient id="${gradientId}" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}">${stops}</linearGradient></defs>` +
    `<g transform="${S3_MARK_TRANSFORM}"><path d="${S3_MARK_PATH}" fill="url(#${gradientId})"/></g>` +
    `</svg>`
  );
}

/** The mark as an SVG data: URI — usable as an <img src> in the browser,
 * which handles the viewBox scaling correctly. Don't use this inside
 * next/og's ImageResponse: Satori doesn't apply an SVG's viewBox/transform
 * scaling for nested <svg> or for <img> with an SVG data URI, so the mark
 * comes out cropped to a tiny corner — confirmed by testing both. Use
 * s3MarkPngDataUri() from "@/lib/mark-server" there instead, which
 * sidesteps Satori's SVG rendering entirely by handing it a plain raster
 * image. (That function lives in its own module, not here, because it
 * needs @resvg/resvg-js — a native addon this file must stay free of,
 * since the client component Logo.tsx imports from here too.) */
export function s3MarkDataUri(gradientId = "s3mark"): string {
  const svg = s3MarkSvgMarkup(gradientId);
  return `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`;
}
