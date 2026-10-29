import { ImageResponse } from "next/og";
import { S3_MARK_BACKING } from "@/lib/mark";
import { s3MarkPngDataUri } from "@/lib/mark-server";

export const size = { width: 64, height: 64 };
export const contentType = "image/png";

// The S3 mark on its backing. Colors come from the palette (via lib/mark), so
// there is no second copy of them here.
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: "50%",
          background: S3_MARK_BACKING,
        }}
      >
        {/* pre-rasterised — Satori needs a raster image, not SVG */}
        <img src={s3MarkPngDataUri(160)} width={40} height={40} alt="" style={{ width: 40, height: 40 }} />
      </div>
    ),
    size,
  );
}
