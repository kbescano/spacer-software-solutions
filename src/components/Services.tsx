"use client";

import { motion } from "motion/react";
import { services } from "@/data/site";
import { Drift, EASE, Ghost, Scroll3D, SectionLabel, Shine, Split, Tilt, useFlickerReplay } from "./Reveal";

export function Services() {
  const { ref: flickerRef, cycle: flickerCycle } = useFlickerReplay<HTMLSpanElement>();
  return (
    <section id="services" className="relative isolate overflow-x-clip bg-bg px-6 py-28 md:px-10 md:py-44">
      <Ghost className="-top-8 -right-[5vw] text-[46vw] md:-top-20">03</Ghost>
      <SectionLabel index="03">Services</SectionLabel>
      <h2 className="display mt-8 text-[clamp(min(3.5rem,14.5vw),11vw,11rem)] uppercase">
        <Drift x={-70}>
          <Split as="span">What we</Split>
        </Drift>
        <br />
        <Drift x={110}>
          <span ref={flickerRef} className="text-outline relative inline-block">
            <span key={flickerCycle} className="inline-block animate-[neon-flicker_7s_ease-in-out_infinite]">
              <Split as="span" delay={0.15}>
                Build
              </Split>
              <Shine delay={0.6}>Build</Shine>
            </span>
          </span>
        </Drift>
      </h2>

      <Scroll3D depth={0.45} className="mt-16 md:mt-24">
        <div className="grid gap-px overflow-hidden rounded-3xl border border-line bg-line lg:grid-cols-3">
          {services.map((item, i) => (
            <Tilt key={item.title} max={5} glareClassName="rounded-none" className="h-full">
            <motion.article
              className="group relative flex h-full min-h-[22rem] flex-col justify-between overflow-hidden bg-bg p-8 shadow-[inset_0_0_0_0_rgb(var(--glow-rgb)/0)] transition-shadow duration-700 hover:shadow-[inset_0_0_90px_-20px_rgb(var(--glow-rgb)/0.45)] md:p-10 lg:min-h-[32rem]"
              // each card stands up out of the floor, one after another
              initial={{ opacity: 0, y: 90, rotateX: -38 }}
              whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
              viewport={{ once: true, margin: "0px 0px -10% 0px" }}
              transition={{ duration: 1.2, ease: EASE, delay: i * 0.14 }}
              style={{ transformPerspective: 1100, transformOrigin: "50% 100%" }}
            >
              {/* colour sweep on hover */}
              <span
                aria-hidden
                className="ease-expo absolute inset-0 origin-bottom scale-y-0 bg-accent transition-transform duration-700 group-hover:scale-y-100"
              />
              {/* a big star turning slowly in the corner */}
              <span
                aria-hidden
                className="ease-expo pointer-events-none absolute -right-12 -bottom-16 animate-[spin_40s_linear_infinite] text-[16rem] leading-none text-fg/[0.06] transition-[color,scale] duration-700 select-none group-hover:scale-125 group-hover:text-light/15"
              >
                ✦
              </span>

              <div className="relative flex items-start justify-between">
                <span className="label text-muted transition-colors duration-500 group-hover:text-light/70">
                  0{i + 1}
                </span>
                <span className="ease-expo flex h-10 w-10 items-center justify-center rounded-full border border-line text-lg transition-all duration-700 group-hover:rotate-[135deg] group-hover:border-fg/50">
                  +
                </span>
              </div>

              <div className="relative">
                <h3 className="display text-[clamp(2rem,3.4vw,3.4rem)] leading-[0.95]">
                  {item.title}
                </h3>
                <p className="mt-5 max-w-xs text-muted transition-colors duration-500 group-hover:text-light/85">
                  {item.blurb}
                </p>
                <ul className="mt-6 space-y-2 text-sm text-muted transition-colors duration-500 group-hover:text-light/85">
                  {item.items.map((li) => (
                    <li key={li} className="flex items-center gap-3">
                      <span className="h-px w-4 bg-current opacity-60" />
                      {li}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.article>
            </Tilt>
          ))}
        </div>
      </Scroll3D>
    </section>
  );
}
