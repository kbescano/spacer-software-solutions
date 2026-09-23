// All copy lives here. Edit this file and the whole site updates.

// No domain yet — this is a reserved, non-resolving placeholder (RFC 2606) so
// metadata never points at a real address we don't own. Once you buy the
// domain, set NEXT_PUBLIC_SITE_URL (no trailing slash) and every URL below —
// canonical, Open Graph, the sitemap, robots.txt — updates automatically.
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://spacer-software-solutions.example"
).replace(/\/$/, "");

export const site = {
  name: "Spacer Software Solutions",
  short: "S3",
  role: "Websites & portals for growing businesses",
  tagline: "Websites & portals that run your business.",
  intro:
    "We build the public website your customers see — and the private portal your team runs on. Quotes, orders, appointments, reports: one team, one system.",
  // Written for the <meta name="description"> / Open Graph tag, not the page —
  // shorter and more concrete than `intro`, and kept near Google's ~155-char cutoff.
  // Update this whenever the case studies in `projects` change.
  metaDescription:
    "S3 builds fast websites and the private portals behind them — for suppliers, clinics, weddings and more. See live projects, plus a free PDF tool.",
  keywords: [
    "custom website development",
    "client portal development",
    "business web application",
    "Next.js developer",
    "Payload CMS developer",
    "booking and appointment website",
  ],
  // TODO: replace with the real business email
  email: "inquiry@spacersoftwaresolutions.com",
  year: new Date().getFullYear(),
  // Add the Facebook page here once it exists, e.g.
  // { label: "Facebook", href: "https://facebook.com/your-page" }
  socials: [] as { label: string; href: string }[],
};

/** Subject line used when a visitor asks for a demo. */
export const demoRequestHref = `mailto:${site.email}?subject=${encodeURIComponent(
  "Demo request",
)}`;

export const nav = [
  { label: "Work", href: "#work" },
  { label: "Services", href: "#services" },
  { label: "Process", href: "#process" },
];

export const marquee = {
  top: [
    "Websites",
    "Portals",
    "Quotations",
    "Orders",
    "Bookings",
    "Appointments",
    "Reports",
    "Dashboards",
  ],
  bottom: [
    "Custom Software",
    "Business Portals",
    "Company Websites",
    "Dashboards & Reports",
    "Role-Based Access",
  ],
};

/* ------------------------------------------------------------------ */
/* Work — each project can have a public website and a private portal  */
/* ------------------------------------------------------------------ */

export type Facet = {
  kind: "website" | "portal";
  label: string;
  status: "live" | "private" | "demo";
  statusLabel: string;
  headline: string;
  description: string;
  features: string[];
  cta: { label: string; href: string | null };
  note?: string;
  /** Small line under the illustration. */
  caption: string;
};

export type Project = {
  slug: string;
  title: string;
  client: string;
  industry: string;
  summary: string;
  tags: string[];
  website?: Facet;
  portal?: Facet;
};

export const projects: Project[] = [
  {
    slug: "primegen",
    title: "Primegen",
    client: "Primegen Trading Corporation",
    industry: "Steel & construction materials supply",
    summary:
      "We built Primegen’s public website and the internal portal behind it: a site that turns project inquiries into quote requests, and a system that carries every quote through orders, supplier POs and delivery.",
    tags: ["Next.js", "Payload CMS", "PostgreSQL"],
    website: {
      kind: "website",
      label: "Website",
      status: "live",
      statusLabel: "Live",
      headline: "The storefront for large-scale projects.",
      description:
        "A fast, credible public site for a steel and construction-materials supplier — designed to turn project inquiries into quote requests.",
      features: [
        "Product catalog — steel, rebar, cement, pipes, electrical, PPE and more",
        "Delivery scheduling information",
        "Materials calculator",
        "Request-a-quote flow",
        "Clear contact and sales lines",
      ],
      cta: {
        label: "Visit the live website",
        href: "https://www.primegentradingcorporation.com/",
      },
      caption: "Illustration of the public website",
    },
    portal: {
      kind: "portal",
      label: "Portal",
      status: "private",
      statusLabel: "Confidential",
      headline: "The system the team runs on.",
      description:
        "An internal portal that carries every quote from first inquiry to delivered order. It holds live client data, so the production portal stays private.",
      features: [
        "Quotation inbox and client quotations",
        "Orders, supplier POs and deliveries",
        "Role-based views: Sales, Admin, Marketing & Logistics",
        "Sales and operations reports",
        "Inquiry tracking with staff performance",
        "Product, client and supplier records in a CMS",
        "Facebook post import for inquiries",
      ],
      cta: { label: "Request the live demo", href: null },
      note: "To show what we built without exposing anything private, we made ConstructX — a demo with the same workflows and sample data only.",
      caption: "Illustration only — production portal is confidential",
    },
  },
  {
    slug: "clinic",
    title: "Clinic",
    client: "S3 product demo",
    industry: "Aesthetic clinics & appointment-based services",
    summary:
      "A booking website for patients and a staff portal for the clinic, built as a demo of what S3 delivers for appointment-based businesses: patients book online, and staff run the whole day from one schedule.",
    tags: ["Next.js", "Payload CMS", "PostgreSQL"],
    website: {
      kind: "website",
      label: "Website",
      status: "live",
      statusLabel: "Live",
      headline: "Booking that feels effortless.",
      description:
        "A calm, fast website where patients browse treatments and specialists, then book in a couple of taps.",
      features: [
        "Treatment catalog with pricing, duration and photos",
        "Specialist profiles",
        "Online booking — several services in one request, no sign-up needed",
        "Booking confirmation and status lookup",
        "Automatic email confirmation and reminders",
        "Contact details and office hours managed from the CMS",
      ],
      cta: { label: "Visit the live website", href: "https://clinic-x-app.netlify.app/" },
      caption: "Illustration of the public website",
    },
    portal: {
      kind: "portal",
      label: "Portal",
      status: "demo",
      statusLabel: "Demo",
      headline: "The clinic’s day, in one view.",
      description:
        "A private portal for clinic staff: today’s schedule, appointment statuses, patient history and reports in one place.",
      features: [
        "Secure staff login with password reset",
        "Clinical schedule: today and the next 7 days",
        "Appointment workflow: pending, confirmed, completed, cancelled",
        "Revenue and completion-rate metrics",
        "Searchable patient history",
        "Analytics and downloadable PDF reports",
        "Bulk appointment import from CSV or JSON",
        "Services and specialists managed in a CMS",
      ],
      cta: { label: "Request the live demo", href: null },
      note: "This is a demo build for prospects — everything shown uses sample data, never real patient information.",
      caption: "Illustration — demo portal with sample data",
    },
  },
  {
    slug: "wedding",
    title: "Wedding",
    client: "S3 product demo",
    industry: "Events & weddings",
    summary:
      "A guest-only wedding site and the couple’s control panel behind it: guests open a sealed invitation with a personal code, then share memories, leave messages, play a live quiz, RSVP and find their seat, while the couple run everything from one dashboard.",
    tags: ["Next.js", "Payload CMS", "SQLite"],
    website: {
      kind: "website",
      label: "Website",
      status: "live",
      statusLabel: "Live",
      headline: "An invitation worth opening.",
      description:
        "A private, phone-first website for wedding guests. It stays sealed until a personal invitation code is used, and the couple can switch on open access to let anyone with the link look around.",
      features: [
        "Sealed invitation — real details are never sent to the browser until a valid code is used",
        "Personal invitation codes and links, with no email or password",
        "Photo memories wall and messages to the couple",
        "Live quiz with a leaderboard, answers checked on the server",
        "RSVP form and a seating finder",
        "Open-access switch: anyone with the link can look around",
        "Built for phones, with a bottom tab bar, and scales up to desktop",
      ],
      cta: { label: "Visit the live website", href: "https://wedding-x-app.netlify.app/" },
      caption: "Illustration of the guest website",
    },
    portal: {
      kind: "portal",
      label: "Portal",
      status: "demo",
      statusLabel: "Demo",
      headline: "The couple’s control room.",
      description:
        "One dashboard where the couple manage the guest list, invitations, RSVPs, photos, messages, the quiz and the seating plan.",
      features: [
        "Wedding details in one place: names, date, venue, dress code, schedule",
        "Guest list with personal links, QR codes and ready-made WhatsApp, email or text invitations",
        "RSVP answers, table assignments and quiz tagging per guest",
        "Moderate the photo and message walls",
        "Write and run the live quiz",
        "Publish the seating plan when it’s ready",
        "Couple-only access, enforced on the server",
      ],
      cta: { label: "Request the live demo", href: null },
      note: "The dashboard is couple-only by design, so it isn’t public. A demo with sample data is available on request.",
      caption: "Illustration — couple dashboard with sample data",
    },
  },
  {
    slug: "pdf-form-filler",
    title: "PDF Forms",
    client: "S3 product",
    industry: "Productivity & document tools",
    summary:
      "A free, browser-only tool that fills out PDF forms: upload any fillable PDF — or a plain print-and-fill one — and it detects the fields, lets you type into them, and hands back a completed copy. Nothing is uploaded to a server.",
    tags: ["Next.js", "pdf-lib", "pdf.js"],
    website: {
      kind: "website",
      label: "Website",
      status: "live",
      statusLabel: "Live",
      headline: "Any PDF, filled in seconds.",
      description:
        "A single tool, not a demo: real fillable PDFs go in, completed ones come out, entirely in the browser.",
      features: [
        "Upload any fillable PDF, or a plain print-and-fill one",
        "Existing form fields are read automatically",
        "Auto-detects fields on PDFs that don’t have any — checkboxes, blanks, labels",
        "Review and correct detected fields before confirming",
        "Fill everything in and save a completed copy",
        "Optional flatten — bake values in as static, uneditable content",
        "Runs entirely client-side: the PDF never leaves the browser",
      ],
      cta: { label: "Try the live tool", href: "https://pdf-forms-filler.netlify.app/" },
      caption: "Illustration of the live tool",
    },
  },
];

export const services = [
  {
    title: "Company Websites",
    blurb: "The public face of your business, built to turn visitors into inquiries.",
    items: ["Product & service pages", "Quote and contact flows", "Speed & SEO", "Easy content updates"],
  },
  {
    title: "Business Portals",
    blurb: "A private system your team logs into every day.",
    items: ["Quotes, orders & bookings", "Role-based access", "Dashboards & reports", "Client & supplier records"],
  },
  {
    title: "Custom Software",
    blurb: "Tools shaped around how your team actually works.",
    items: ["Workflow tools", "Integrations & imports", "Data migration", "Ongoing support"],
  },
];

export const steps = [
  {
    title: "Discover",
    text: "We sit down with your team and map how work actually moves today — from first inquiry to delivered service.",
  },
  {
    title: "Design",
    text: "Clean, fast interfaces for your customers and your staff — agreed before we write a line of code.",
  },
  {
    title: "Build",
    text: "Built in stages you can see and click through, with sample data — no big-bang reveal.",
  },
  {
    title: "Launch & support",
    text: "We take it live, train your team, and stay on for fixes and new features.",
  },
];
