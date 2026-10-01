"use client";

import Script from "next/script";
import { META_PIXEL_ENABLED, META_PIXEL_ID } from "@/lib/meta";

/** Meta's standard base Pixel snippet (from Events Manager), loaded via
 * next/script instead of a raw <script> tag. Fires PageView automatically;
 * everything else is tracked per-action through trackMetaEvent() (see
 * src/lib/meta-client.ts) alongside the matching server-side CAPI call.
 * Renders nothing until NEXT_PUBLIC_META_PIXEL_ID is set, so the site works
 * before ad credentials are wired up. */
export function MetaPixel() {
  if (!META_PIXEL_ENABLED) return null;

  return (
    <>
      <Script id="meta-pixel-base" strategy="afterInteractive">
        {`
          !function(f,b,e,v,n,t,s)
          {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
          n.callMethod.apply(n,arguments):n.queue.push(arguments)};
          if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
          n.queue=[];t=b.createElement(e);t.async=!0;
          t.src=v;s=b.getElementsByTagName(e)[0];
          s.parentNode.insertBefore(t,s)}(window, document,'script',
          'https://connect.facebook.net/en_US/fbevents.js');
          fbq('init', '${META_PIXEL_ID}');
          fbq('track', 'PageView');
        `}
      </Script>
      <noscript>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          height="1"
          width="1"
          alt=""
          style={{ display: "none" }}
          src={`https://www.facebook.com/tr?id=${META_PIXEL_ID}&ev=PageView&noscript=1`}
        />
      </noscript>
    </>
  );
}
