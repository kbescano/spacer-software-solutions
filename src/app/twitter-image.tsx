import { ImageResponse } from "next/og";
import { site } from "@/data/site";
import { OgArt, ogContentType, ogSize } from "@/lib/og";

export const alt = `${site.name} (${site.short}) — ${site.role}`;
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return new ImageResponse(<OgArt />, size);
}
