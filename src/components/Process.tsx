"use client";

import { motion } from "motion/react";
import { steps } from "@/data/site";
import { Drift, EASE, Ghost, Scroll3D, SectionLabel, Shine, Split, useFlickerReplay } from "./Reveal";

export function Process() {
  const { ref: flickerRef, cycle: flickerCycle } = useFlickerReplay<HTMLSpanElement>();
  return (
    <section id="process" className="relative isolate overflow-x-clip bg-bg px-6 py-28 md:px-10 md:py-44">
      <Ghost className="-top-6 -left-[4vw] text-[46vw] md:-top-16">04</Ghost>
      <div className="grid gap-16 md:grid-cols-12">
        {/* the heading holds still while the steps go by */}
        <div className="md:sticky md:top-32 md:col-span-5 md:self-start">
          <SectionLabel index="04">Process</SectionLabel>
          <h2 className="display mt-8 text-[clamp(3.5rem,8vw,8rem)] uppercase">
            <Drift x={-40}>
              <Split as="span">How</Split>
            </Drift>
            <br />
            <Drift x={60}>
              <Split as="span" delay={0.12}>
                we
              </Split>
            </Drift>
            <br />
            <Drift x={-80}>
              <span ref={flickerRef} className="text-outline relative inline-block">
                <span key={flickerCycle} className="inline-block animate-[neon-flicker_7s_ease-in-out_infinite]">
                  <Split as="span" delay={0.24}>
                    Work
                  </Split>
                  <Shine delay={0.7}>Work</Shine>
                </span>
              </span>
            </Drift>
          </h2>
        </div>

        {/* grid of cards */}
        <ol className="grid gap-4 sm:grid-cols-2 md:col-span-7 md:gap-5">
          {steps.map((step, i) => (
            <li key={step.title} className={i % 2 ? "sm:translate-y-16" : ""}>
              <Scroll3D dir={i % 2 ? -1 : 1} depth={0.55} className="h-full">
                {/* each step swings in like a door, then fills its progress rule */}
                <motion.div
                  className="group relative isolate flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-surface/40 p-7 transition-[border-color,box-shadow] duration-500 hover:border-accent-bright/40 hover:shadow-[0_24px_70px_-32px_rgb(var(--shadow-rgb)/0.5)] md:p-8"
                  initial={{ opacity: 0, rotateY: i % 2 ? 34 : -34, x: i % 2 ? 60 : -60 }}
                  whileInView={{ opacity: 1, rotateY: 0, x: 0 }}
                  viewport={{ once: true, margin: "0px 0px -12% 0px" }}
                  transition={{ duration: 1.2, ease: EASE, delay: i * 0.12 }}
                  style={{ transformPerspective: 1000 }}
                >
                  <span className="display text-[clamp(2.25rem,3.4vw,3.25rem)] text-accent-bright">
                    <Split as="span" by="char" delay={0.2 + i * 0.12}>
                      {`0${i + 1}`}
                    </Split>
                  </span>
                  <h3 className="mt-4 text-xl font-semibold tracking-tight md:text-2xl">{step.title}</h3>
                  <p className="mt-2 leading-relaxed text-muted">{step.text}</p>
                  <span aria-hidden className="mt-auto block pt-7">
                    <motion.span
                      className="block h-px origin-left bg-accent-bright"
                      initial={{ scaleX: 0 }}
                      whileInView={{ scaleX: (i + 1) / steps.length }}
                      viewport={{ once: true }}
                      transition={{ duration: 1.4, ease: EASE, delay: 0.5 + i * 0.15 }}
                    />
                  </span>
                  {/* the step number, huge, sliding past behind the card on hover */}
                  <span
                    aria-hidden
                    className="display ease-expo text-ghost pointer-events-none absolute -right-4 -bottom-10 -z-10 text-[10rem] leading-none transition-transform duration-700 select-none group-hover:-translate-x-6"
                  >
                    0{i + 1}
                  </span>
                </motion.div>
              </Scroll3D>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
