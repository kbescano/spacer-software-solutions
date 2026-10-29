// Shared OG/Twitter share image markup, rendered via next/og's ImageResponse.

import { site } from "@/data/site";
import { S3_MARK_BACKING } from "@/lib/mark";
import { s3MarkPngDataUri } from "@/lib/mark-server";
import { alpha, GROUND, HEADLINE, LIGHT, PANEL } from "@/lib/palette";

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
        background: `radial-gradient(circle at 78% 22%, ${alpha(PANEL, 0.95)} 0%, ${alpha(PANEL, 0)} 62%), radial-gradient(circle at 10% 100%, ${alpha(PANEL, 0.8)} 0%, ${alpha(PANEL, 0)} 45%), ${GROUND}`,
        color: LIGHT,
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
          {/* pre-rasterised — Satori needs a raster image, not SVG */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={s3MarkPngDataUri(208)}
            width={52}
            height={52}
            alt=""
            style={{ width: 52, height: 52 }}
          />
        </div>
        <div style={{ fontSize: 26, color: alpha(LIGHT, 0.72), letterSpacing: 2 }}>
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
          <span style={{ color: HEADLINE, marginLeft: 20 }}>Portals</span>
        </div>
        <div style={{ fontSize: 30, color: alpha(LIGHT, 0.72), maxWidth: 820 }}>
          {site.role}
        </div>
      </div>
    </div>
  );
}
