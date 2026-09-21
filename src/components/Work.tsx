"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { demoRequestHref, projects, type Facet, type Project } from "@/data/site";
import { ProjectMock } from "./Mockups";
import { EASE, FadeUp, Line, Magnetic, RollText, SectionLabel, Split } from "./Reveal";

function StatusChip({ facet }: { facet: Facet }) {
  if (facet.status === "live") {
    return (
      <span className="label inline-flex items-center gap-2 rounded-full bg-cyan/10 px-3 py-1.5 text-[0.65rem] text-cyan">
        <span className="relative flex h-1.5 w-1.5">
          <span className="absolute inset-0 animate-[ping-soft_2s_cubic-bezier(0,0,0.2,1)_infinite] rounded-full bg-cyan/70" />
          <span className="relative h-1.5 w-1.5 rounded-full bg-cyan" />
        </span>
        {facet.statusLabel}
      </span>
    );
  }
  if (facet.status === "demo") {
    return (
      <span className="label inline-flex items-center gap-2 rounded-full bg-fg/10 px-3 py-1.5 text-[0.65rem] text-fg/80">
        <svg viewBox="0 0 24 24" className="h-3 w-3" fill="currentColor" aria-hidden>
          <path d="M8 5v14l11-7z" />
        </svg>
        {facet.statusLabel}
      </span>
    );
  }
  return (
    <span className="label inline-flex items-center gap-2 rounded-full bg-accent/15 px-3 py-1.5 text-[0.65rem] text-accent-bright">
      <svg viewBox="0 0 24 24" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
        <rect x="5" y="11" width="14" height="9" rx="2" />
        <path d="M8 11V8a4 4 0 018 0v3" />
      </svg>
      {facet.statusLabel}
    </span>
  );
}

function FacetPanel({ facet, slug }: { facet: Facet; slug: string }) {
  const external = facet.cta.href !== null;
  const href = facet.cta.href ?? demoRequestHref;

  return (
    <motion.div
      role="tabpanel"
      className="mt-8 grid gap-10 lg:grid-cols-12 lg:gap-14"
      initial={{ opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -18 }}
      transition={{ duration: 0.55, ease: EASE }}
    >
      <div className="lg:col-span-5">
        <h4 className="text-[clamp(1.75rem,3vw,2.75rem)] leading-[1.05] font-semibold tracking-[-0.03em] text-balance">
          {facet.headline}
        </h4>
        <p className="mt-5 text-lg leading-relaxed text-muted">{facet.description}</p>

        <ul className="mt-8 space-y-3">
          {facet.features.map((f, i) => (
            <motion.li
              key={f}
              className="flex items-start gap-3 text-fg/90"
              initial={{ opacity: 0, x: -14 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.25 + i * 0.06, duration: 0.5, ease: EASE }}
            >
              <span className="mt-[0.7em] h-px w-4 shrink-0 bg-accent-bright" />
              {f}
            </motion.li>
          ))}
        </ul>

        {facet.note && (
          <p className="mt-8 rounded-2xl border border-line bg-surface/50 p-5 text-sm leading-relaxed text-muted">
            {facet.note}
          </p>
        )}

        <div className="mt-10">
          <Magnetic className="inline-block">
            <a
              href={href}
              {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
              className="group label inline-flex items-center gap-3 rounded-full bg-accent px-7 py-4 text-white transition-colors duration-300 hover:bg-accent-bright"
            >
              <RollText>{facet.cta.label}</RollText>
              <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                ↗
              </span>
            </a>
          </Magnetic>
        </div>
      </div>

      <div className="lg:col-span-7">
        <ProjectMock slug={slug} kind={facet.kind} />
        <p className="label mt-4 text-center text-[0.65rem] text-muted">{facet.caption}</p>
      </div>
    </motion.div>
  );
}

function CaseStudy({ project, index }: { project: Project; index: number }) {
  const facets = [project.website, project.portal].filter(
    (f): f is Facet => Boolean(f),
  );
  const [active, setActive] = useState(0);
  const facet = facets[active];

  const deliverables = facets.map((f) => (f.kind === "website" ? "Website" : "Portal")).join(" + ");

  return (
    <article aria-labelledby={`${project.slug}-title`}>
      <Line />

      <div className="py-10 md:py-14">
        <span className="label text-muted">
          <span className="text-accent-bright">0{index + 1}</span> — Case study
        </span>
        <h3
          id={`${project.slug}-title`}
          className="display mt-5 text-[clamp(3.25rem,13vw,13rem)] uppercase"
        >
          <Split as="span">{project.title}</Split>
        </h3>

        <FadeUp delay={0.15} className="mt-8 grid gap-8 md:mt-12 md:grid-cols-12 md:gap-10">
          <p className="text-lg leading-relaxed text-muted md:col-span-7 md:max-w-xl">
            {project.summary}
          </p>
          <dl className="grid grid-cols-2 gap-x-6 gap-y-5 md:col-span-5">
            {[
              ["Client", project.client],
              ["Industry", project.industry],
              ["Delivered", deliverables],
              ["Stack", project.tags.join(" · ")],
            ].map(([k, v]) => (
              <div key={k}>
                <dt className="label text-[0.65rem] text-muted">{k}</dt>
                <dd className="mt-1.5 text-sm text-fg">{v}</dd>
              </div>
            ))}
          </dl>
        </FadeUp>
      </div>

      {/* Website / Portal switcher */}
      {facets.length > 1 && (
        <div role="tablist" aria-label={`${project.title} deliverables`} className="grid grid-cols-2 gap-3">
          {facets.map((f, i) => {
            const selected = i === active;
            return (
              <button
                key={f.kind}
                type="button"
                role="tab"
                aria-selected={selected}
                onClick={() => setActive(i)}
                className={`relative rounded-2xl border px-4 py-4 text-left transition-colors duration-300 md:px-7 md:py-6 ${
                  selected ? "border-accent-bright/60" : "border-line hover:border-accent-bright/40"
                }`}
              >
                {selected && (
                  <motion.span
                    layoutId={`${project.slug}-tab`}
                    className="absolute inset-0 rounded-2xl bg-accent/15"
                    transition={{ type: "spring", stiffness: 380, damping: 34 }}
                  />
                )}
                <span className="relative flex items-center justify-between gap-3">
                  <span>
                    <span className="label block text-[0.65rem] text-muted">0{i + 1}</span>
                    <span
                      className={`display mt-1 block text-[clamp(1.5rem,3.4vw,3rem)] transition-colors ${
                        selected ? "text-fg" : "text-muted"
                      }`}
                    >
                      {f.label}
                    </span>
                  </span>
                  <span className="hidden sm:block">
                    <StatusChip facet={f} />
                  </span>
                </span>
                <span className="relative mt-3 block sm:hidden">
                  <StatusChip facet={f} />
                </span>
              </button>
            );
          })}
        </div>
      )}

      <AnimatePresence mode="wait" initial={false}>
        <FacetPanel key={facet.kind} facet={facet} slug={project.slug} />
      </AnimatePresence>
    </article>
  );
}

export function Work() {
  return (
    <section id="work" className="relative px-6 py-28 md:px-10 md:py-44">
      <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
        <div>
          <SectionLabel index="01">Selected work</SectionLabel>
          <h2 className="display mt-8 text-[clamp(3.5rem,11vw,11rem)] uppercase">
            <Split as="span">Our</Split>
            <span className="text-outline ml-[0.15em]">
              <Split as="span" delay={0.12}>
                Work
              </Split>
            </span>
          </h2>
        </div>
        <FadeUp delay={0.2} className="max-w-xs text-muted">
          Every project ships as two products: the website your customers see,
          and the portal your team runs on.
        </FadeUp>
      </div>

      <div className="mt-16 space-y-24 md:mt-24 md:space-y-32">
        {projects.map((p, i) => (
          <CaseStudy key={p.slug} project={p} index={i} />
        ))}
      </div>

      <FadeUp className="mt-24 md:mt-32">
        <Line />
        <div className="label flex items-center justify-between py-8 text-muted">
          <span className="flex items-center gap-3">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-accent-bright" />
            Next case study
          </span>
          <span>Coming soon</span>
        </div>
        <Line />
      </FadeUp>
    </section>
  );
}
