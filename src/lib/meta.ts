// Meta Pixel + Conversions API — shared config and event names.
// No secrets here; the CAPI token lives only in the route handler.

export const META_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID ?? "";
export const META_PIXEL_ENABLED = META_PIXEL_ID.length > 0;

// Fire the same event_name + event_id on both Pixel and CAPI so Meta dedupes.
export const META_EVENTS = {
  /** mailto link or "Request a demo" */
  lead: "Lead",
  /** lighter signal, e.g. copying the email */
  contact: "Contact",
} as const;

export type MetaEventName = (typeof META_EVENTS)[keyof typeof META_EVENTS];
