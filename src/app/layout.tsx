import type { Metadata, Viewport } from "next";
import { Archivo_Black, Geist, Geist_Mono } from "next/font/google";
import { Providers } from "@/components/Providers";
import { SITE_URL, site } from "@/data/site";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Static, single-weight display face: no overlapping contours, so text-stroke outlines render cleanly
const display = Archivo_Black({
  variable: "--font-display",
  weight: "400",
  subsets: ["latin"],
});

const title = `${site.name} (${site.short}) — ${site.role}`;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title,
  description: site.metaDescription,
  keywords: site.keywords,
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  openGraph: {
    title,
    description: site.metaDescription,
    url: "/",
    siteName: site.name,
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title,
    description: site.metaDescription,
  },
};

export const viewport: Viewport = {
  themeColor: "#040816",
  colorScheme: "dark",
};

// Organization schema for rich results — every field here is a fact from
// `site`, nothing invented (no address/phone, since neither is public yet).
const structuredData = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: site.name,
  alternateName: site.short,
  url: SITE_URL,
  description: site.metaDescription,
  email: site.email,
  ...(site.socials.length > 0 && { sameAs: site.socials.map((s) => s.href) }),
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${display.variable} antialiased`}
    >
      <body>
        <noscript>
          <style>{`[data-preloader]{display:none!important}`}</style>
        </noscript>
        <script
          type="application/ld+json"
          // Static, build-time JSON we control — never includes visitor input.
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
