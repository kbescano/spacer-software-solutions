"use client";

import { useEffect, useRef } from "react";
import {
  motion,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react";
import { site } from "@/data/site";
import { useLoading, useScrollControls } from "./Providers";
import { FadeUp, Magnetic, RollText, Split } from "./Reveal";

/* ------------------------------------------------------------------ */
/* Background: panning grid, drifting orbs, cursor glow, orbit rings   */
/* ------------------------------------------------------------------ */

function HeroBackground() {
  const ref = useRef<HTMLDivElement>(null);
  const gx = useMotionValue(0);
  const gy = useMotionValue(0);
  const sx = useSpring(gx, { stiffness: 60, damping: 20 });
  const sy = useSpring(gy, { stiffness: 60, damping: 20 });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    gx.set(r.width * 0.5);
    gy.set(r.height * 0.4);

    const move = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      const box = el.getBoundingClientRect();
      gx.set(e.clientX - box.left);
      gy.set(e.clientY - box.top);
    };
    window.addEventListener("pointermove", move);
    return () => window.removeEventListener("pointermove", move);
  }, [gx, gy]);

  return (
    <div ref={ref} aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* grid */}
      <div
        className="absolute inset-0 animate-[grid-pan_6s_linear_infinite] opacity-70"
        style={{
          backgroundImage:
            "linear-gradient(var(--line) 1px, transparent 1px), linear-gradient(90deg, var(--line) 1px, transparent 1px)",
          backgroundSize: "72px 72px",
          maskImage:
            "radial-gradient(ellipse 70% 60% at 50% 45%, #000 20%, transparent 75%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 70% 60% at 50% 45%, #000 20%, transparent 75%)",
        }}
      />

      {/* drifting orbs */}
      <div className="absolute -top-[15%] -left-[10%] h-[60vw] max-h-[720px] w-[60vw] max-w-[720px] animate-[drift-a_18s_ease-in-out_infinite] rounded-full bg-accent/40 blur-[140px]" />
      <div className="absolute -right-[10%] bottom-[-10%] h-[50vw] max-h-[620px] w-[50vw] max-w-[620px] animate-[drift-b_22s_ease-in-out_infinite] rounded-full bg-cyan/20 blur-[140px]" />

      {/* cursor glow */}
      <motion.div
        className="absolute top-0 left-0 h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          x: sx,
          y: sy,
          background:
            "radial-gradient(circle, rgba(111,149,255,0.32) 0%, rgba(47,91,255,0.12) 40%, transparent 70%)",
        }}
      />

      {/* orbit rings */}
      <svg
        viewBox="0 0 1000 1000"
        className="absolute top-1/2 left-1/2 hidden h-[130vh] max-h-[1100px] -translate-x-1/2 -translate-y-1/2 md:block"
      >
        <circle
          cx="500"
          cy="500"
          r="490"
          fill="none"
          stroke="var(--accent-bright)"
          strokeOpacity="0.18"
          strokeDasharray="2 10"
          className="origin-center animate-[spin_120s_linear_infinite]"
        />
        <circle
          cx="500"
          cy="500"
          r="360"
          fill="none"
          stroke="var(--accent-bright)"
          strokeOpacity="0.14"
          className="origin-center"
        />
        <g className="origin-center animate-[spin_40s_linear_infinite]">
          <circle cx="500" cy="10" r="5" fill="var(--cyan)" />
        </g>
        <g className="origin-center animate-[spin_70s_linear_infinite_reverse]">
          <circle cx="140" cy="500" r="4" fill="var(--accent-bright)" />
        </g>
      </svg>

      {/* bottom fade into next section */}
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-bg to-transparent" />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Rotating circular badge                                             */
/* ------------------------------------------------------------------ */

function Badge() {
  const { scrollTo } = useScrollControls();
  const text = "TAKING NEW PROJECTS • LET’S TALK • ";
  return (
    <Magnetic strength={0.25}>
      <a
        href="#contact"
        onClick={(e) => {
          e.preventDefault();
          scrollTo("#contact");
        }}
        className="group relative flex h-32 w-32 items-center justify-center rounded-full border border-line bg-bg/40 backdrop-blur-sm transition-colors duration-500 hover:bg-accent md:h-40 md:w-40"
        aria-label="Taking new projects — get in touch"
      >
        <svg
          viewBox="0 0 200 200"
          className="absolute inset-0 animate-[spin_16s_linear_infinite]"
          aria-hidden
        >
          <defs>
            <path id="badge-circle" d="M100,100 m-78,0 a78,78 0 1,1 156,0 a78,78 0 1,1 -156,0" />
          </defs>
          <text className="fill-fg text-[15px] tracking-[0.22em]" style={{ fontFamily: "var(--font-geist-mono)" }}>
            <textPath href="#badge-circle">{text}</textPath>
          </text>
        </svg>
        <svg
          viewBox="0 0 24 24"
          className="h-7 w-7 -rotate-45 transition-transform duration-500 group-hover:rotate-0"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
        >
          <path d="M5 12h14M13 6l6 6-6 6" />
        </svg>
      </a>
    </Magnetic>
  );
}

/* ------------------------------------------------------------------ */
/* Hero                                                                */
/* ------------------------------------------------------------------ */

export function Hero() {
  const { loaded } = useLoading();
  const { scrollTo } = useScrollControls();
  const ref = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "28%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.75], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.9]);

  return (
    <section
      id="top"
      ref={ref}
      className="relative flex min-h-svh flex-col justify-between overflow-hidden px-6 pt-24 pb-6 md:px-10"
    >
      <HeroBackground />

      {/* top meta */}
      <FadeUp
        active={loaded}
        delay={0.9}
        y={14}
        className="label relative z-10 flex items-start justify-between text-muted"
      >
        <span className="flex items-center gap-3">
          <span className="relative flex h-2 w-2">
            <span className="absolute inset-0 animate-[ping-soft_2s_cubic-bezier(0,0,0.2,1)_infinite] rounded-full bg-cyan/70" />
            <span className="relative h-2 w-2 rounded-full bg-cyan" />
          </span>
          Taking on new projects
        </span>
        <span className="hidden text-right md:block">
          {site.name} ({site.short})
          <br />
          {site.role}
        </span>
      </FadeUp>

      {/* name */}
      <motion.div className="relative z-10 my-6" style={{ y, opacity, scale }}>
        <h1 className="display text-[clamp(3rem,14vw,16rem)] uppercase">
          <span className="block">
            <Split as="span" by="char" active={loaded} delay={0.15}>
              Websites
            </Split>
          </span>
          <span className="text-outline block">
            <Split as="span" by="char" active={loaded} delay={0.3}>
              & Portals
            </Split>
          </span>
        </h1>
      </motion.div>

      {/* intro + CTAs */}
      <div className="relative z-10 flex flex-col gap-10 md:flex-row md:items-end md:justify-between">
        <div className="max-w-lg">
          <FadeUp active={loaded} delay={1.1}>
            <p className="text-lg leading-snug text-muted md:text-xl">
              <span className="text-fg">{site.name}.</span> {site.intro}
            </p>
          </FadeUp>
          <FadeUp active={loaded} delay={1.25} className="mt-8 flex flex-wrap gap-3">
            <Magnetic>
              <a
                href="#work"
                onClick={(e) => {
                  e.preventDefault();
                  scrollTo("#work");
                }}
                className="group label inline-flex rounded-full bg-accent px-7 py-4 font-bold text-white transition-colors duration-300 hover:bg-accent-bright"
              >
                <RollText revealClassName="text-white">See our work</RollText>
              </a>
            </Magnetic>
            <Magnetic>
              <a
                href="#contact"
                onClick={(e) => {
                  e.preventDefault();
                  scrollTo("#contact");
                }}
                className="group label inline-flex rounded-full border border-line px-7 py-4 transition-colors duration-300 hover:border-accent-bright"
              >
                <RollText>Get in touch</RollText>
              </a>
            </Magnetic>
          </FadeUp>
        </div>

        <FadeUp active={loaded} delay={1.4} className="hidden md:block">
          <Badge />
        </FadeUp>
      </div>

      {/* bottom bar */}
      <FadeUp
        active={loaded}
        delay={1.5}
        y={10}
        className="label relative z-10 mt-8 flex items-center justify-between border-t border-line pt-5 text-muted"
      >
        <span className="flex items-center gap-3">
          <span className="relative block h-8 w-px overflow-hidden bg-line">
            <span className="absolute inset-x-0 top-0 h-full animate-[scroll-cue_1.8s_cubic-bezier(0.76,0,0.24,1)_infinite] bg-accent-bright" />
          </span>
          Scroll
        </span>
        <span className="hidden text-center sm:block">Websites · Portals · Custom software</span>
        <span className="hidden sm:block">©{site.year}</span>
      </FadeUp>
    </section>
  );
}
