"use client";

import { motion } from "motion/react";
import { services } from "@/data/site";
import { EASE, SectionLabel, Split } from "./Reveal";

export function Services() {
  return (
    <section id="services" className="relative px-6 py-28 md:px-10 md:py-44">
      <SectionLabel index="02">Services</SectionLabel>
      <h2 className="display mt-8 text-[clamp(3.5rem,11vw,11rem)] uppercase">
        <Split as="span">What we</Split>
        <br />
        <span className="text-outline">
          <Split as="span" delay={0.15}>
            Build
          </Split>
        </span>
      </h2>

      <div className="mt-16 grid gap-px overflow-hidden rounded-3xl border border-line bg-line md:mt-24 md:grid-cols-3">
        {services.map((item, i) => (
          <motion.article
            key={item.title}
            className="group relative flex min-h-[24rem] flex-col justify-between overflow-hidden bg-bg p-8 md:min-h-[32rem] md:p-10"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "0px 0px -10% 0px" }}
            transition={{ duration: 1, ease: EASE, delay: i * 0.12 }}
          >
            {/* colour sweep on hover */}
            <span
              aria-hidden
              className="ease-expo absolute inset-0 origin-bottom scale-y-0 bg-accent transition-transform duration-700 group-hover:scale-y-100"
            />

            <div className="relative flex items-start justify-between">
              <span className="label text-muted transition-colors duration-500 group-hover:text-white/70">
                0{i + 1}
              </span>
              <span className="ease-expo flex h-10 w-10 items-center justify-center rounded-full border border-line text-lg transition-all duration-700 group-hover:rotate-[135deg] group-hover:border-white/50">
                +
              </span>
            </div>

            <div className="relative">
              <h3 className="display text-[clamp(2rem,3.4vw,3.4rem)] leading-[0.95]">
                {item.title}
              </h3>
              <p className="mt-5 max-w-xs text-muted transition-colors duration-500 group-hover:text-white/85">
                {item.blurb}
              </p>
              <ul className="mt-6 space-y-2 text-sm text-muted transition-colors duration-500 group-hover:text-white/85">
                {item.items.map((li) => (
                  <li key={li} className="flex items-center gap-3">
                    <span className="h-px w-4 bg-current opacity-60" />
                    {li}
                  </li>
                ))}
              </ul>
            </div>
          </motion.article>
        ))}
      </div>
    </section>
  );
}
