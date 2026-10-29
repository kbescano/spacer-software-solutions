import type { Metadata, Viewport } from "next";
import { Archivo_Black, Geist, Geist_Mono } from "next/font/google";
import { MetaPixel } from "@/components/MetaPixel";
import { Providers } from "@/components/Providers";
import { SITE_URL, faq, site } from "@/data/site";
import { GROUND, paletteCssVars } from "@/lib/palette";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// single-weight display face so text-stroke outlines render cleanly
const display = Archivo_Black({
  variable: "--font-display",
  weight: "400",
  subsets: ["latin"],
});

const title = site.metaTitle;

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
  themeColor: GROUND,
  colorScheme: "dark",
};

// Organization schema for rich results
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

// FAQPage schema — mirrors the FAQ section (FAQ.tsx)
const faqStructuredData = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faq.map((f) => ({
    "@type": "Question",
    name: f.question,
    acceptedAnswer: { "@type": "Answer", text: f.answer },
  })),
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${display.variable} antialiased`}
      style={paletteCssVars}
    >
      <body>
        <noscript>
          <style>{`[data-preloader]{display:none!important}`}</style>
        </noscript>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqStructuredData) }}
        />
        <MetaPixel />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
