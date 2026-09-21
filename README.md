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
- **Case studies** — the `projects` array (Primegen and Clinic today). Each project has an optional `website` and an optional `portal` "facet", which powers the Website / Portal switcher. Facet status is `live`, `private` (confidential) or `demo`. To add another project, append an object to `projects`, then add its artwork to the registry at the bottom of [`Mockups.tsx`](src/components/Mockups.tsx), keyed by the same `slug`.
- **Services / process** — the `services` and `steps` arrays.
- **Demo links** — the clinic website demo is linked publicly. Portal demos (ConstructX, the clinic portal) are request-only on purpose: their `cta.href` is `null`, so the button opens an email request and the links are sent by hand.
- **Illustrations** — [`Mockups.tsx`](src/components/Mockups.tsx). These are original artwork, not client screenshots or data.
- **Colours** — CSS variables at the top of [`src/app/globals.css`](src/app/globals.css).

## Confidentiality

The production Primegen portal holds live client data and is not shown or linked. The site shows only an illustration and describes ConstructX, a separate demo with sample data. The Clinic case study is a product demo built on sample data only.
