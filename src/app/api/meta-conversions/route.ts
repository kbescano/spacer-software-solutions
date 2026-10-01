import { NextRequest, NextResponse } from "next/server";

// Relays a browser-fired event to Meta's Conversions API, server-side.
// META_CAPI_ACCESS_TOKEN never reaches the client — it's read straight from
// the environment right here. Paired with src/lib/meta-client.ts, which
// fires the same event_name + event_id through the browser Pixel; Meta
// dedupes the two into one counted event.
//
// Setup (Events Manager -> your Pixel):
//   NEXT_PUBLIC_META_PIXEL_ID   Settings tab -> Pixel ID
//   META_CAPI_ACCESS_TOKEN      Settings tab -> Conversions API -> "Generate access token"
//   META_TEST_EVENT_CODE        Test Events tab, while verifying — remove for real traffic
const GRAPH_VERSION = "v21.0";

type Body = {
  eventName?: string;
  eventId?: string;
  customData?: Record<string, unknown>;
  sourceUrl?: string;
};

export async function POST(req: NextRequest) {
  const pixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID;
  const accessToken = process.env.META_CAPI_ACCESS_TOKEN;

  // Not configured yet (e.g. local dev, or before ad credentials exist) —
  // no-op instead of erroring, so callers don't need to guard every call.
  if (!pixelId || !accessToken) {
    return NextResponse.json({ skipped: "not_configured" });
  }

  let body: Body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  const { eventName, eventId, customData, sourceUrl } = body;
  if (!eventName || !eventId) {
    return NextResponse.json({ error: "missing_fields" }, { status: 400 });
  }

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  const userAgent = req.headers.get("user-agent") ?? undefined;
  const fbp = req.cookies.get("_fbp")?.value;
  const fbc = req.cookies.get("_fbc")?.value;

  const payload = {
    data: [
      {
        event_name: eventName,
        event_time: Math.floor(Date.now() / 1000),
        event_id: eventId,
        event_source_url: sourceUrl,
        action_source: "website",
        user_data: {
          ...(ip && { client_ip_address: ip }),
          ...(userAgent && { client_user_agent: userAgent }),
          ...(fbp && { fbp }),
          ...(fbc && { fbc }),
        },
        custom_data: customData ?? {},
      },
    ],
    ...(process.env.META_TEST_EVENT_CODE && {
      test_event_code: process.env.META_TEST_EVENT_CODE,
    }),
  };

  try {
    const res = await fetch(
      `https://graph.facebook.com/${GRAPH_VERSION}/${pixelId}/events?access_token=${accessToken}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      },
    );
    const json = await res.json();
    if (!res.ok) {
      console.error("Meta CAPI rejected event:", json);
      return NextResponse.json({ error: "capi_rejected", detail: json }, { status: 502 });
    }
    return NextResponse.json({ ok: true, result: json });
  } catch (err) {
    console.error("Meta CAPI request failed:", err);
    return NextResponse.json({ error: "capi_unreachable" }, { status: 502 });
  }
}
