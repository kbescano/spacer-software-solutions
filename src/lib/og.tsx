// Shared markup for the generated Open Graph / Twitter share image.
// Both src/app/opengraph-image.tsx and src/app/twitter-image.tsx render this
// through next/og's ImageResponse — kept here once so the two stay in sync.

import { site } from "@/data/site";
import { S3_MARK_BACKING } from "@/lib/mark";
import { s3MarkPngDataUri } from "@/lib/mark-server";

export const ogSize = { width: 1200, height: 630 };
export const ogContentType = "image/png";

export function OgArt() {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "72px",
        background:
          "radial-gradient(circle at 78% 22%, #142253 0%, #040816 55%), #040816",
        color: "#fffff0",
        fontFamily: "sans-serif",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 64,
            height: 64,
            borderRadius: "50%",
            background: S3_MARK_BACKING,
            padding: 6,
          }}
        >
          {/* Pre-rasterised (see mark-server.ts) — Satori doesn't scale
              nested <svg> or SVG data URIs correctly, only plain raster. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={s3MarkPngDataUri(208)}
            width={52}
            height={52}
            alt=""
            style={{ width: 52, height: 52 }}
          />
        </div>
        <div style={{ fontSize: 26, color: "#7f8db8", letterSpacing: 2 }}>
          {site.name.toUpperCase()}
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        <div
          style={{
            fontSize: 76,
            fontWeight: 800,
            lineHeight: 1.05,
            letterSpacing: -2,
            display: "flex",
            flexWrap: "wrap",
            maxWidth: 980,
          }}
        >
          Websites &amp;{" "}
          <span style={{ color: "#6ccfd4", marginLeft: 20 }}>Portals</span>
        </div>
        <div style={{ fontSize: 30, color: "#7f8db8", maxWidth: 820 }}>
          {site.role}
        </div>
      </div>
    </div>
  );
}
