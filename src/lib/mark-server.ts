import "server-only";
import { Resvg } from "@resvg/resvg-js";
import { s3MarkSvgMarkup } from "@/lib/mark";

/** The mark pre-rasterised to a PNG data: URI, for embedding inside
 * next/og's ImageResponse (see the doc comment on s3MarkDataUri in
 * "@/lib/mark" for why a raster hand-off is needed there instead of SVG).
 * `sizePx` is the rendered resolution — request higher than the display
 * size for a crisp result. Runs through @resvg/resvg-js, a native addon,
 * so this file is server-only; never import it from a client component. */
export function s3MarkPngDataUri(sizePx: number, gradientId = "s3mark"): string {
  const svg = s3MarkSvgMarkup(gradientId);
  const resvg = new Resvg(svg, { fitTo: { mode: "width", value: sizePx } });
  const png = resvg.render().asPng();
  return `data:image/png;base64,${Buffer.from(png).toString("base64")}`;
}
