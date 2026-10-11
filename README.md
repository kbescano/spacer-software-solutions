# Spacer Software Solutions (S3) — company website

Dark-blue, minimalist-but-bold business profile built with **Next.js (App Router)**, **Tailwind CSS v4**, **Motion** and **Lenis**.

```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # production build
```

## Edit the content

Everything on the page lives in [`src/data/site.ts`](src/data/site.ts).

- **Business email / Facebook page** — `site.email` and `site.socials`. The email is still a placeholder.
- **Case studies** — the `projects` array (Primegen, Clinic, Wedding and PDF Forms today). Each project has an optional `website` and an optional `portal` "facet", which powers the Website / Portal switcher. Facet status is `live`, `private` (confidential) or `demo`. To add another project, append an object to `projects`, then add its artwork to the registry at the bottom of [`Mockups.tsx`](src/components/Mockups.tsx), keyed by the same `slug`.
- **Services / process** — the `services` and `steps` arrays.
- **Demo links** — the clinic website demo is linked publicly. Portal demos (ConstructX, the clinic portal, the wedding dashboard) are request-only on purpose: their `cta.href` is `null`, so the button opens an email request and the links are sent by hand.
- **Illustrations** — [`Mockups.tsx`](src/components/Mockups.tsx). These are original artwork, not client screenshots or data.
- **Colours** — CSS variables at the top of [`src/app/globals.css`](src/app/globals.css).

## SEO & going live

The site ships with a full metadata pass: a distinct `<meta name="description">`
tuned for search (separate from the longer on-page `site.intro`), Open Graph
and Twitter cards, a generated 1200×630 share image
([`src/lib/og.tsx`](src/lib/og.tsx), rendered by
`src/app/opengraph-image.tsx` / `twitter-image.tsx`), `robots.txt`
([`src/app/robots.ts`](src/app/robots.ts)), `sitemap.xml`
([`src/app/sitemap.ts`](src/app/sitemap.ts)) and Organization structured data
(the `<script type="application/ld+json">` in
[`layout.tsx`](src/app/layout.tsx)).

`SITE_URL` in [`site.ts`](src/data/site.ts) defaults to the real domain,
**https://spacersoftwaresolutions.com**, so canonical, Open Graph, the
sitemap and robots.txt all point there already. `NEXT_PUBLIC_SITE_URL` can
still override it — set that env var on a staging deploy (or any other
environment that shouldn't use the production domain) and it takes over with
no code changes.

- **Meta description** — `site.metaDescription`, kept near Google's ~155-char
  display limit and written to mention the actual range of work (websites,
  portals, bookings, a free tool). Update it if the case studies change
  meaningfully.
- **Keywords** — `site.keywords`, a short, honest list matching the real
  stack and services. Low-impact for ranking but harmless to keep current.

## Confidentiality

The production Primegen portal holds live client data and is not shown or linked. The site shows only an illustration and describes ConstructX, a separate demo with sample data. The Clinic and Wedding case studies are product demos built on sample data only; the wedding illustration uses no real names.
