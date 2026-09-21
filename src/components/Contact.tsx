"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { demoRequestHref, site } from "@/data/site";
import { useScrollControls } from "./Providers";
import { EASE, FadeUp, Line, Magnetic, RollText, SectionLabel, Split } from "./Reveal";

function CopyEmail() {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(site.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // Clipboard can be blocked; the mailto link still works.
    }
  };

  return (
    <button
      type="button"
      onClick={copy}
      className="label relative inline-flex h-10 items-center overflow-hidden rounded-full border border-line px-5 text-muted transition-colors hover:border-accent-bright hover:text-fg"
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={copied ? "copied" : "copy"}
          initial={{ y: 14, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -14, opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          {copied ? "Copied ✓" : "Copy email"}
        </motion.span>
      </AnimatePresence>
    </button>
  );
}

export function Contact() {
  return (
    <section
      id="contact"
      className="relative overflow-hidden px-6 pt-28 pb-10 md:px-10 md:pt-44"
    >
      {/* rising glow */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[80%]"
        initial={{ opacity: 0, y: "35%" }}
        whileInView={{ opacity: 1, y: "0%" }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{ duration: 2.2, ease: EASE }}
        style={{
          background:
            "radial-gradient(ellipse 60% 70% at 50% 100%, rgba(47,91,255,0.55), rgba(47,91,255,0.12) 50%, transparent 75%)",
        }}
      />

      <div className="relative">
        <SectionLabel index="04">Contact</SectionLabel>

        <div className="mt-8 flex flex-col gap-12 md:flex-row md:items-end md:justify-between">
          <h2 className="display text-[clamp(3.25rem,11vw,11rem)] uppercase">
            <Split as="span">Ready to</Split>
            <br />
            <Split as="span" delay={0.12}>
              build your
            </Split>
            <br />
            <span className="text-outline">
              <Split as="span" delay={0.24}>
                system?
              </Split>
            </span>
          </h2>

          <Magnetic strength={0.3} className="self-start md:mb-6 md:self-end">
            <a
              href={`mailto:${site.email}?subject=${encodeURIComponent("Project inquiry")}`}
              className="group relative flex h-36 w-36 items-center justify-center rounded-full bg-accent text-center text-white transition-colors duration-500 hover:bg-accent-bright md:h-52 md:w-52"
            >
              <span className="label text-[0.8rem] leading-tight">
                <RollText>Get in touch</RollText>
                <span className="mt-1 block text-xl">↗</span>
              </span>
            </a>
          </Magnetic>
        </div>

        <div className="mt-20 md:mt-28">
          <Line />
          <div className="flex flex-col gap-6 py-8 md:flex-row md:items-center md:justify-between">
            <a
              href={`mailto:${site.email}`}
              className="group relative w-fit text-[clamp(1.5rem,4.4vw,4.5rem)] font-semibold tracking-[-0.04em]"
            >
              {site.email}
              <span className="ease-expo absolute -bottom-1 left-0 h-[3px] w-full origin-right scale-x-0 bg-accent-bright transition-transform duration-700 group-hover:origin-left group-hover:scale-x-100" />
            </a>
            <CopyEmail />
          </div>
          <Line />
        </div>

        <FadeUp className="mt-10 flex flex-wrap items-center gap-x-10 gap-y-4">
          <a
            href={demoRequestHref}
            className="group label inline-flex items-center gap-2 text-muted transition-colors hover:text-fg"
          >
            <RollText>Request a demo</RollText>
            <span className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5">
              ↗
            </span>
          </a>
          {site.socials.map((s) => (
            <a
              key={s.label}
              href={s.href}
              target="_blank"
              rel="noreferrer"
              className="group label inline-flex items-center gap-2 text-muted transition-colors hover:text-fg"
            >
              <RollText>{s.label}</RollText>
              <span className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5">
                ↗
              </span>
            </a>
          ))}
        </FadeUp>
      </div>

      <Footer />
    </section>
  );
}

function Footer() {
  const { scrollTo } = useScrollControls();

  return (
    <footer className="label relative mt-28 flex flex-col gap-4 border-t border-line pt-6 text-muted sm:flex-row sm:items-center sm:justify-between md:mt-40">
      <span>
        © {site.year} {site.name} ({site.short})
      </span>
      <span className="hidden md:block">Websites · Portals · Custom software</span>
      <button
        type="button"
        onClick={() => scrollTo(0)}
        className="group inline-flex w-fit items-center gap-2 transition-colors hover:text-fg"
      >
        <RollText>Back to top</RollText>
        <span className="transition-transform duration-300 group-hover:-translate-y-1">
          ↑
        </span>
      </button>
    </footer>
  );
}
