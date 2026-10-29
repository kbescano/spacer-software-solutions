"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { demoRequestHref, site } from "@/data/site";
import { META_EVENTS } from "@/lib/meta";
import { trackMetaEvent } from "@/lib/meta-client";
import { MarqueeRow } from "./Marquee";
import { useScrollControls } from "./Providers";
import { Drift, EASE, FadeUp, Ghost, Line, Magnetic, RollText, SectionLabel, Shine, Split, useFlickerReplay } from "./Reveal";

function CopyEmail() {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(site.email);
      setCopied(true);
      trackMetaEvent(META_EVENTS.contact, { content_name: "copy_email" });
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // Clipboard can be blocked; the mailto link still works.
    }
  };

  return (
    <button
      type="button"
      onClick={copy}
      className="label relative inline-flex h-10 shrink-0 items-center self-start overflow-hidden rounded-full border border-line-strong px-5 whitespace-nowrap text-muted transition-colors hover:border-accent-bright hover:text-fg lg:self-auto"
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
  const { ref: flickerRef, cycle: flickerCycle } = useFlickerReplay<HTMLSpanElement>();
  return (
    <section
      id="contact"
      className="relative isolate overflow-hidden bg-bg px-6 pt-28 pb-10 md:px-10 md:pt-44"
    >
      <Ghost className="-top-6 -left-[4vw] text-[46vw] md:-top-16">06</Ghost>
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
            "radial-gradient(ellipse 60% 70% at 50% 100%, rgb(var(--glow-rgb)/0.4), rgb(var(--glow-rgb)/0.1) 50%, transparent 75%)",
        }}
      />

      <div className="relative">
        <SectionLabel index="06">Contact</SectionLabel>

        <div className="mt-8 flex flex-col gap-12 lg:flex-row lg:items-end lg:justify-between">
          <h2 className="display text-[clamp(min(3.25rem,14.5vw),11vw,11rem)] uppercase">
            <Drift x={-50}>
              <Split as="span">Ready to</Split>
            </Drift>
            <br />
            <Drift x={70}>
              <Split as="span" delay={0.12}>
                build your
              </Split>
            </Drift>
            <br />
            <Drift x={-90}>
              <span ref={flickerRef} className="text-outline relative inline-block">
                <span key={flickerCycle} className="inline-block animate-[neon-flicker_7s_ease-in-out_infinite]">
                  <Split as="span" delay={0.24}>
                    system?
                  </Split>
                  <Shine delay={0.7}>system?</Shine>
                </span>
              </span>
            </Drift>
          </h2>

          <Magnetic strength={0.3} className="m-8 self-start md:m-10 lg:mb-14 lg:self-end">
            <a
              href={`mailto:${site.email}?subject=${encodeURIComponent("Project inquiry")}`}
              onClick={() =>
                trackMetaEvent(META_EVENTS.lead, { content_name: "get_in_touch_circle" })
              }
              className="group relative flex h-36 w-36 items-center justify-center rounded-full border border-accent-bright bg-accent text-center text-light shadow-[0_18px_50px_-18px_rgb(var(--shadow-rgb)/0.5)] transition-[background-color,box-shadow,border-color] duration-500 hover:border-accent-bright hover:bg-accent-bright hover:shadow-[0_22px_60px_-18px_rgb(var(--shadow-rgb)/0.7)] md:h-52 md:w-52"
            >
              {/* a ring of words turning round the button */}
              <svg
                viewBox="0 0 200 200"
                className="pointer-events-none absolute -inset-7 animate-[spin_22s_linear_infinite] md:-inset-9"
                aria-hidden
              >
                <defs>
                  <path id="cta-ring" d="M100,100 m-88,0 a88,88 0 1,1 176,0 a88,88 0 1,1 -176,0" />
                </defs>
                <text className="fill-fg text-[10.5px] tracking-[0.32em]" style={{ fontFamily: "var(--font-geist-mono)" }}>
                  <textPath href="#cta-ring">LET’S BUILD YOUR SYSTEM ✦ WEBSITES ✦ PORTALS ✦ </textPath>
                </text>
              </svg>
              <span className="label text-[0.8rem] leading-tight">
                <RollText revealClassName="text-on-bright">Get in touch</RollText>
                <span className="mt-1 block text-xl transition-colors duration-500 group-hover:text-on-bright">↗</span>
              </span>
            </a>
          </Magnetic>
        </div>

        <div className="mt-20 md:mt-28">
          <Line />
          <div className="flex flex-col gap-6 py-8 lg:flex-row lg:items-center lg:justify-between">
            <a
              href={`mailto:${site.email}`}
              onClick={() =>
                trackMetaEvent(META_EVENTS.lead, { content_name: "email_text_link" })
              }
              className="group relative w-fit max-w-full min-w-0 text-[clamp(1.25rem,4.4vw,4.5rem)] font-semibold tracking-[-0.04em] [overflow-wrap:anywhere]"
            >
              {site.email.split("@")[0]}@<wbr />{site.email.split("@")[1]}
              <span className="ease-expo absolute -bottom-1 left-0 h-[3px] w-full origin-right scale-x-0 bg-accent-bright transition-transform duration-700 group-hover:origin-left group-hover:scale-x-100" />
            </a>
            <CopyEmail />
          </div>
          <Line />
        </div>

        <FadeUp className="mt-10 flex flex-wrap items-center gap-x-10 gap-y-4">
          <a
            href={demoRequestHref}
            onClick={() =>
              trackMetaEvent(META_EVENTS.lead, { content_name: "request_a_demo" })
            }
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

      {/* the last thing on the page keeps moving */}
      <div aria-hidden className="relative -mx-6 mt-24 md:-mx-10 md:mt-36">
        <MarqueeRow items={["Let’s build", "Your system", "Websites", "Portals"]} baseVelocity={-1.4} outline />
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
      <a href="/llms.txt" className="transition-colors hover:text-fg">
        llms.txt
      </a>
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
