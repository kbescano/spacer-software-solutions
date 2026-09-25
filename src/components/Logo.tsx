"use client";

import { useId } from "react";
import {
  S3_MARK_BACKING,
  S3_MARK_GRADIENT_COORDS,
  S3_MARK_GRADIENT_STOPS,
  S3_MARK_PATH,
  S3_MARK_TRANSFORM,
  S3_MARK_VIEWBOX,
} from "@/lib/mark";

/** The S3 mark on its cream backing — the mark's dark-navy end disappears
 * against the site's navy, so it always ships on its own light chip. */
export function Logo({ className = "" }: { className?: string }) {
  const gradId = `s3g-${useId()}`;
  const { x1, y1, x2, y2 } = S3_MARK_GRADIENT_COORDS;

  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center rounded-full p-1 ${className}`}
      style={{ background: S3_MARK_BACKING }}
    >
      <svg viewBox={S3_MARK_VIEWBOX} className="h-full w-full" aria-hidden>
        <defs>
          <linearGradient id={gradId} x1={x1} y1={y1} x2={x2} y2={y2}>
            {S3_MARK_GRADIENT_STOPS.map((s) => (
              <stop key={s.offset} offset={s.offset} stopColor={s.color} />
            ))}
          </linearGradient>
        </defs>
        <g transform={S3_MARK_TRANSFORM}>
          <path d={S3_MARK_PATH} fill={`url(#${gradId})`} />
        </g>
      </svg>
    </span>
  );
}
