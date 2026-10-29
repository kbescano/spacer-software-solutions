"use client";

import { useState } from "react";
import { faq } from "@/data/site";
import { Drift, FadeUp, Ghost, Line, Scroll3D, SectionLabel, Shine, Split, useFlickerReplay } from "./Reveal";

function FAQItem({
  question,
  answer,
  index,
  open,
  onToggle,
}: {
  question: string;
  answer: string;
  index: number;
  open: boolean;
  onToggle: () => void;
}) {
  return (
    <FadeUp delay={index * 0.05}>
      <div className="border-b border-line py-6">
        <button
          type="button"
          onClick={onToggle}
          aria-expanded={open}
          className="group flex w-full items-start justify-between gap-6 text-left"
        >
          <span className="ease-expo flex items-start gap-3 text-lg font-semibold tracking-tight transition-transform duration-500 group-hover:translate-x-2 md:text-xl">
            <span
              aria-hidden
              className={`ease-expo mt-[0.2em] inline-block text-[0.8em] text-accent-bright transition-[transform,opacity] duration-500 ${
                open ? "rotate-180 opacity-100" : "-rotate-90 opacity-40 group-hover:rotate-0 group-hover:opacity-100"
              }`}
            >
              ✦
            </span>
            {question}
          </span>
          <span
            aria-hidden
            className={`ease-expo mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-line-strong text-lg transition-[transform,background-color,color] duration-500 group-hover:bg-accent-bright group-hover:text-on-bright ${
              open ? "rotate-45" : "group-hover:rotate-90"
            }`}
          >
            +
          </span>
        </button>
        <div
          className={`ease-expo grid transition-[grid-template-rows] duration-500 ${
            open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
          }`}
        >
          <div className="overflow-hidden">
            <p
              className={`ease-expo mt-4 max-w-2xl pl-7 leading-relaxed text-muted transition-[transform,opacity] duration-700 ${
                open ? "translate-y-0 opacity-100" : "-translate-y-3 opacity-0"
              }`}
            >
              {answer}
            </p>
          </div>
        </div>
      </div>
    </FadeUp>
  );
}

export function FAQ() {
  const { ref: flickerRef, cycle: flickerCycle } = useFlickerReplay<HTMLSpanElement>();
  // first answer open by default
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="relative isolate overflow-x-clip bg-bg px-6 py-28 md:px-10 md:py-44">
      <Ghost className="-top-8 -right-[5vw] text-[46vw] md:-top-20">05</Ghost>
      <SectionLabel index="05">FAQ</SectionLabel>
      <h2 className="display mt-8 text-[clamp(min(3.2rem,14.5vw),11vw,11rem)] uppercase">
        <Drift x={80}>
          <Split as="span">Common</Split>
        </Drift>
        <br />
        <Drift x={-60}>
          <span ref={flickerRef} className="text-outline relative inline-block">
            <span key={flickerCycle} className="inline-block animate-[neon-flicker_7s_ease-in-out_infinite]">
              <Split as="span" delay={0.15}>
                Questions
              </Split>
              <Shine delay={0.6}>Questions</Shine>
            </span>
          </span>
        </Drift>
      </h2>

      <Scroll3D depth={0.3} className="mt-16 md:mt-24">
        <Line />
        {faq.map((item, i) => (
          <FAQItem
            key={item.question}
            index={i}
            question={item.question}
            answer={item.answer}
            open={openIndex === i}
            onToggle={() => setOpenIndex(openIndex === i ? null : i)}
          />
        ))}
      </Scroll3D>
    </section>
  );
}
