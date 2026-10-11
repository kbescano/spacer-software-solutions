import "server-only";
import { Resvg } from "@resvg/resvg-js";
import { s3MarkSvgMarkup } from "@/lib/mark";

/** The mark rasterised to a PNG data: URI, for next/og's ImageResponse.
 * `sizePx` is the render resolution. Server-only (uses @resvg/resvg-js). */
export function s3MarkPngDataUri(sizePx: number, gradientId = "s3mark"): string {
  const svg = s3MarkSvgMarkup(gradientId);
  const resvg = new Resvg(svg, { fitTo: { mode: "width", value: sizePx } });
  const png = resvg.render().asPng();
  return `data:image/png;base64,${Buffer.from(png).toString("base64")}`;
}
