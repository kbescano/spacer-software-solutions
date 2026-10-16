// Real screenshots of the live, public-facing parts of each project.
// Captured directly from the real URLs in `site.ts`. Portals that are
// confidential or demo-on-request (no public URL) are not here — those
// stay illustrated in Mockups.tsx, which is the honest shape of what each
// client actually allows to be shown.

export type Screenshot = { src: string; alt: string; url: string };

export const screenshots: Partial<
  Record<string, Partial<Record<"website" | "portal", Screenshot>>>
> = {
  primegen: {
    website: {
      src: "/screenshots/primegen-website.jpg",
      alt: "Primegen Trading Corporation's real, live public website",
      url: "primegentradingcorporation.com",
    },
  },
  clinic: {
    website: {
      src: "/screenshots/clinic-website.jpg",
      alt: "The real, live Clinic demo website",
      url: "clinic-x-app.netlify.app",
    },
  },
  wedding: {
    website: {
      src: "/screenshots/wedding-website.jpg",
      alt: "The real, live Wedding demo website",
      url: "wedding-x-app.netlify.app",
    },
  },
  "sari-sari-store": {
    portal: {
      src: "/screenshots/sari-sari-portal.jpg",
      alt: "The real, live Sari-Sari Store point-of-sale portal, Owner demo view",
      url: "sari-sari-storeph.vercel.app",
    },
  },
  "pdf-form-filler": {
    website: {
      src: "/screenshots/pdf-forms-tool.jpg",
      alt: "The real, live PDF Form Filler tool",
      url: "pdf-forms-filler.netlify.app",
    },
  },
};
