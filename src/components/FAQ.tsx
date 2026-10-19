"use client";

import { useState } from "react";
import { faq } from "@/data/site";
import { FadeUp, Line, SectionLabel, Shine, Split, useFlickerReplay } from "./Reveal";

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
          className="flex w-full items-start justify-between gap-6 text-left"
        >
          <span className="text-lg font-semibold tracking-tight md:text-xl">{question}</span>
          <span
            aria-hidden
            className={`ease-expo mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-line text-lg transition-transform duration-500 ${
              open ? "rotate-45" : ""
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
            <p className="mt-4 max-w-2xl leading-relaxed text-muted">{answer}</p>
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
    <section id="faq" className="relative px-6 py-28 md:px-10 md:py-44">
      <SectionLabel index="05">FAQ</SectionLabel>
      <h2 className="display mt-8 text-[clamp(min(3.2rem,14.5vw),11vw,11rem)] uppercase">
        <Split as="span">Common</Split>
        <br />
        <span ref={flickerRef} className="text-outline relative inline-block">
          <span key={flickerCycle} className="inline-block animate-[neon-flicker_7s_ease-in-out_infinite]">
            <Split as="span" delay={0.15}>
              Questions
            </Split>
            <Shine delay={0.6}>Questions</Shine>
          </span>
        </span>
      </h2>

      <div className="mt-16 md:mt-24">
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
      </div>
    </section>
  );
}
