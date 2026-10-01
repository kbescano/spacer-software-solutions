// Meta (Facebook) Pixel + Conversions API — shared config and event names.
// Isomorphic: imported by both the client-side tracker (src/lib/meta-client.ts)
// and the server-side CAPI route handler (src/app/api/meta-conversions/route.ts),
// so this file must stay free of secrets and free of "use client"/DOM code.
// The CAPI access token is read straight from process.env inside the route
// handler only — it never passes through this module or reaches the client.

// NEXT_PUBLIC_* vars are inlined at build time and safe to expose — a Pixel
// ID isn't a secret, Meta's own base code ships it in plain JS on every page
// that has it installed.
export const META_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID ?? "";
export const META_PIXEL_ENABLED = META_PIXEL_ID.length > 0;

// Standard Meta events used on this site (https://developers.facebook.com/docs/meta-pixel/reference).
// Fire the same event_name + event_id on both the browser Pixel and the
// server CAPI call for one user action — Meta dedupes matching pairs into a
// single event instead of double-counting the conversion.
export const META_EVENTS = {
  /** A real contact-intent action: the mailto link or "Request a demo". */
  lead: "Lead",
  /** A lighter engagement signal short of a full lead (e.g. copying the email). */
  contact: "Contact",
} as const;

export type MetaEventName = (typeof META_EVENTS)[keyof typeof META_EVENTS];
