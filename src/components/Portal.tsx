"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { site } from "@/data/site";
import { screenshots } from "@/data/screenshots";
import { ProjectMock, RealShot } from "./Mockups";
import { Drift, FadeUp, Ghost, SectionLabel, Shine, Split, useFlickerReplay } from "./Reveal";

// The reveal — a public website opening up, mid-scroll, to show the private
// portal already running underneath it. The page's one engineered peak:
// the moment that explains S3's whole business without a word of copy.

function QuoteChip() {
  return (
    <div
      id="quote-origin"
      className="absolute flex h-3 w-3 -translate-x-1/2 -translate-y-1/2"
      style={{ left: "82%", top: "6%" }}
    >
      <span className="absolute inset-0 animate-[ping-soft_2s_cubic-bezier(0,0,0.2,1)_infinite] rounded-full bg-accent-bright/70" />
      <span className="relative h-3 w-3 rounded-full border border-accent-bright bg-accent-bright/80 shadow-[0_0_20px_-2px_rgb(var(--glow-rgb)/0.9)]" />
    </div>
  );
}

function StaticReveal({ primegen }: { primegen: NonNullable<(typeof screenshots)["primegen"]>["website"] }) {
  return (
    <div className="mt-16 grid gap-10 md:mt-24 md:grid-cols-2">
      <div>
        <div className="relative w-full">
          {primegen && <RealShot shot={primegen} />}
          <QuoteChip />
        </div>
        <p className="label mt-4 text-center text-[0.65rem] text-muted">
          Primegen&rsquo;s real public website
        </p>
      </div>
      <div>
        <div className="relative w-full">
          <ProjectMock slug="primegen" kind="portal" />
        </div>
        <p className="label mt-4 text-center text-[0.65rem] text-muted">
          …which already runs on this, behind the scenes
        </p>
      </div>
    </div>
  );
}

function ScrollReveal({ primegen }: { primegen: NonNullable<(typeof screenshots)["primegen"]>["website"] }) {
  const pinRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: pinRef,
    offset: ["start start", "end start"],
  });

  const siteY = useTransform(scrollYProgress, [0, 0.15, 0.6], ["0%", "0%", "-85%"]);
  const siteOpacity = useTransform(scrollYProgress, [0, 0.15, 0.35, 0.55], [1, 1, 0.2, 0]);
  const siteRotateX = useTransform(scrollYProgress, [0, 0.15, 0.6], [0, 0, -24]);
  const siteScale = useTransform(scrollYProgress, [0, 0.15, 0.6], [1, 1, 0.93]);

  const portalOpacity = useTransform(scrollYProgress, [0, 0.2, 0.45], [0.35, 0.35, 1]);
  const portalScale = useTransform(scrollYProgress, [0, 0.2, 0.6], [0.96, 0.96, 1]);
  const glowOpacity = useTransform(scrollYProgress, [0.15, 0.4, 0.7], [0, 0.9, 0.5]);

  return (
    <div ref={pinRef} className="relative mt-20 h-[260vh] md:mt-28">
      <div className="sticky top-[14vh] md:top-[16vh]">
        <div className="relative mx-auto aspect-[16/11] w-full max-w-5xl md:aspect-[16/9]">
          {/* portal layer — underneath, already there, waiting */}
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            style={{ opacity: portalOpacity, scale: portalScale }}
          >
            <motion.div
              aria-hidden
              className="pointer-events-none absolute -inset-x-4 -inset-y-10 -z-10 rounded-[3rem] blur-3xl"
              style={{
                opacity: glowOpacity,
                background:
                  "radial-gradient(ellipse 60% 60% at 50% 50%, rgb(var(--glow-rgb)), transparent 70%)",
              }}
            />
            <div className="w-full">
              <ProjectMock slug="primegen" kind="portal" />
            </div>
          </motion.div>

          {/* website layer — lifts up and away, like a hatch opening, to
              reveal the portal that was running underneath it the whole time */}
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            style={{ opacity: siteOpacity }}
          >
            <motion.div
              className="w-full"
              style={{
                y: siteY,
                rotateX: siteRotateX,
                scale: siteScale,
                transformPerspective: 1400,
              }}
            >
              <div className="relative w-full">
                {primegen && <RealShot shot={primegen} />}
                <QuoteChip />
              </div>
            </motion.div>
          </motion.div>
        </div>

        <p className="label mt-6 text-center text-[0.65rem] text-muted">
          Primegen&rsquo;s real public website — and the portal it already runs on
        </p>
      </div>
    </div>
  );
}

export function Portal() {
  const { ref: flickerRef, cycle: flickerCycle } = useFlickerReplay<HTMLSpanElement>();
  const reduce = useReducedMotion();
  const primegen = screenshots.primegen?.website;

  return (
    <section id="reveal" className="relative isolate overflow-x-clip bg-bg px-6 py-28 md:px-10 md:py-44">
      <Ghost className="-top-8 -right-[6vw] text-[46vw] md:-top-20">01</Ghost>
      <SectionLabel index="01">The reveal</SectionLabel>
      <h2 className="display mt-8 text-[clamp(min(3.5rem,14.5vw),11vw,11rem)] uppercase">
        <Drift x={-70}>
          <Split as="span">One visit.</Split>
        </Drift>
        <br />
        <Drift x={90}>
          <span ref={flickerRef} className="text-outline relative inline-block">
            <span key={flickerCycle} className="inline-block animate-[neon-flicker_7s_ease-in-out_infinite]">
              <Split as="span" delay={0.15}>
                Two systems.
              </Split>
              <Shine delay={0.6}>Two systems.</Shine>
            </span>
          </span>
        </Drift>
      </h2>
      <FadeUp delay={0.2} className="mt-8 max-w-xl text-lg leading-relaxed text-muted">
        {site.intro}
      </FadeUp>

      {reduce ? <StaticReveal primegen={primegen} /> : <ScrollReveal primegen={primegen} />}
    </section>
  );
}
