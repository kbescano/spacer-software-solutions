// Real screenshots of the live, public-facing parts of each project, captured
// at 1440 x 960 directly from the real URLs in `site.ts`. A confidential portal
// appears here only through its public demo (Primegen's, through ConstructX);
// anything with no public URL stays illustrated in Mockups.tsx, which is the
// honest shape of what each client actually allows to be shown.
//
// The files are imported rather than served from public/, so each gets a
// content-hashed URL: replace a screenshot and every cache (browser, image
// optimizer, CDN) picks up the new one at once.

import type { StaticImageData } from "next/image";
import clinicWebsite from "@/assets/screenshots/clinic-website.jpg";
import constructxPortal from "@/assets/screenshots/constructx-portal.jpg";
import pdfFormsTool from "@/assets/screenshots/pdf-forms-tool.jpg";
import primegenWebsite from "@/assets/screenshots/primegen-website.jpg";
import sariSariPortal from "@/assets/screenshots/sari-sari-portal.jpg";
import weddingWebsite from "@/assets/screenshots/wedding-website.jpg";

export type Screenshot = {
  src: StaticImageData;
  alt: string;
  url: string;
  /** Line under the image; defaults to "Real screenshot of the live site". */
  caption?: string;
};

export const screenshots: Partial<
  Record<string, Partial<Record<"website" | "portal", Screenshot>>>
> = {
  primegen: {
    website: {
      src: primegenWebsite,
      alt: "Primegen Trading Corporation's real, live public website",
      url: "primegentradingcorporation.com",
    },
    portal: {
      src: constructxPortal,
      alt: "The live ConstructX demo of Primegen's portal: the Admin reports view, on sample data",
      url: "constructx-demo.netlify.app",
      caption: "Real screenshot of the ConstructX demo — sample data only",
    },
  },
  clinic: {
    website: {
      src: clinicWebsite,
      alt: "The real, live Clinic demo website",
      url: "clinic-x-app.netlify.app",
    },
  },
  wedding: {
    website: {
      src: weddingWebsite,
      alt: "The real, live Wedding demo website",
      url: "wedding-x-app.netlify.app",
    },
  },
  "sari-sari-store": {
    portal: {
      src: sariSariPortal,
      alt: "The real, live Sari-Sari Store point-of-sale portal, Owner demo view",
      url: "sari-sari-storeph.vercel.app",
    },
  },
  "pdf-form-filler": {
    website: {
      src: pdfFormsTool,
      alt: "The real, live PDF Form Filler tool",
      url: "pdf-forms-filler.netlify.app",
    },
  },
};
