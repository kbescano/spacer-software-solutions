import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { site } from "@/data/site";

// The image a link preview shows: a real screenshot of the hero at
// 1200 x 630, kept in public/og/share.jpg. It is served through the
// opengraph-image / twitter-image routes rather than as static files next to
// them because the static form's .alt.txt is ignored by Turbopack, and a share
// image should carry alt text. Retake the screenshot when the hero changes.

export const shareAlt = `${site.name} (${site.short}) — “Websites & Portals” beside a glowing 3D portal on a navy sky`;
export const shareSize = { width: 1200, height: 630 };
export const shareContentType = "image/jpeg";

export async function shareImage() {
  const jpg = await readFile(join(process.cwd(), "public/og/share.jpg"));
  return new Response(new Uint8Array(jpg), { headers: { "Content-Type": shareContentType } });
}
