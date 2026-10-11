import { NextResponse } from "next/server";
import { SITE_URL, projects, services, site, steps } from "@/data/site";

// llms.txt (llmstxt.org) — built from the same site data as the page.
export const dynamic = "force-static";

function section(title: string, lines: string[]): string {
  return [`## ${title}`, ...lines].join("\n");
}

export async function GET() {
  const workLines = projects.map((p) => {
    const liveUrl = p.website?.cta.href ?? p.portal?.cta.href ?? undefined;
    const suffix = liveUrl ? ` — ${liveUrl}` : "";
    return `- [${p.title}](${SITE_URL}/#work): ${p.summary}${suffix}`;
  });

  const serviceLines = services.map(
    (s) => `- [${s.title}](${SITE_URL}/#services): ${s.blurb} (${s.items.join(", ")})`,
  );

  const stepLines = steps.map((s, i) => `${i + 1}. **${s.title}** — ${s.text}`);

  const body = [
    `# ${site.name} (${site.short})`,
    "",
    `> ${site.intro}`,
    "",
    section("Services", serviceLines),
    "",
    section("Work", workLines),
    "",
    section("Process", stepLines),
    "",
    section("Contact", [`- Email: ${site.email}`, `- Site: ${SITE_URL}`]),
    "",
  ].join("\n");

  return new NextResponse(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
