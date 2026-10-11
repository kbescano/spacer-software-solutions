"use client";

import { META_PIXEL_ENABLED, type MetaEventName } from "./meta";

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}

/** Fires a Meta event via both the browser Pixel and our CAPI relay route,
 * sharing one event_id so Meta dedupes them into a single conversion. */
export function trackMetaEvent(
  eventName: MetaEventName,
  customData?: Record<string, unknown>,
) {
  if (!META_PIXEL_ENABLED) return;

  const eventId =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(36).slice(2)}`;

  window.fbq?.("track", eventName, customData ?? {}, { eventID: eventId });

  fetch("/api/meta-conversions", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    keepalive: true,
    body: JSON.stringify({
      eventName,
      eventId,
      customData: customData ?? {},
      sourceUrl: window.location.href,
    }),
  }).catch(() => {
    // best-effort
  });
}
