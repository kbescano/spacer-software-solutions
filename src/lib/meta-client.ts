"use client";

import { META_PIXEL_ENABLED, type MetaEventName } from "./meta";

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}

/**
 * Fires a Meta event on both channels for one user action:
 *  - the browser Pixel (window.fbq) — the usual client-side ads signal
 *  - our own /api/meta-conversions route, which relays the same event to
 *    the Conversions API server-side (survives ad blockers and Safari/ITP
 *    dropping the browser cookie, and doesn't depend on fbevents.js having
 *    finished loading)
 * Both calls share one event_id so Meta's dedupe collapses them into a
 * single counted event instead of double-counting the conversion.
 */
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
    // Best-effort — a dropped CAPI call still leaves the browser Pixel event.
  });
}
