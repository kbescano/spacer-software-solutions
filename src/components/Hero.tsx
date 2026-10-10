"use client";

import { useEffect, useRef } from "react";
import {
  motion,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react";
import { FadeUp, Magnetic, RollText, Shine, Split } from "./Reveal";
import { site } from "@/data/site";
import { useLoading, useScrollControls } from "./Providers";

/* ------------------------------------------------------------------ */
/* Signage — just the two brand marks, sliding in from the right once on */
/* load, then drifting gently. No extra shapes alongside them.           */
/* ------------------------------------------------------------------ */

function GlowText({
  children,
  color,
  boxed,
  flicker,
  className = "",
}: {
  children: string;
  color: string;
  boxed?: boolean;
  flicker?: boolean;
  className?: string;
}) {
  return (
    <span
      className={`pointer-events-none inline-block font-mono tracking-wider uppercase select-none ${
        boxed ? "rounded-sm border px-2.5 py-1.5" : ""
      } ${flicker ? "animate-[neon-flicker_7s_ease-in-out_infinite]" : ""} ${className}`}
      style={{
        color,
        borderColor: boxed ? color : undefined,
        textShadow: `0 0 6px ${color}, 0 0 20px ${color}`,
        boxShadow: boxed ? `0 0 24px -10px ${color}` : undefined,
        background: boxed ? "rgba(4,8,22,0.45)" : undefined,
      }}
    >
      {children}
    </span>
  );
}

function Signage({ loaded }: { loaded: boolean }) {
  return (
    <>
      {/* desktop — loops in from off-screen right, holds, then slides back
          out and repeats, rather than a one-shot entrance */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute top-32 right-6 z-0 hidden lg:block xl:right-12"
        initial={{ x: 260, opacity: 0 }}
        animate={
          loaded
            ? { x: [260, 0, 0, 260], opacity: [0, 1, 1, 0] }
            : { x: 260, opacity: 0 }
        }
        transition={
          loaded
            ? {
                duration: 11,
                times: [0, 0.42, 0.58, 1],
                delay: 1.6,
                repeat: Infinity,
                ease: "easeInOut",
              }
            : undefined
        }
      >
        <div className="relative flex animate-[signage-drift_12s_ease-in-out_infinite] flex-col items-end gap-3">
          <GlowText color="var(--accent-bright)" boxed flicker className="-rotate-2 text-lg">
            S3
          </GlowText>
          <GlowText color="var(--neon-pink)" boxed className="rotate-1 text-sm">
            SPACER
          </GlowText>
        </div>
      </motion.div>

      {/* mobile — same pair and loop, scaled down and moved into the open
          gap between the CTAs and the bottom bar (checked live: clears
          both with margin at 375px width) */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute right-6 bottom-28 z-0 lg:hidden"
        initial={{ x: 200, opacity: 0 }}
        animate={
          loaded
            ? { x: [200, 0, 0, 200], opacity: [0, 1, 1, 0] }
            : { x: 200, opacity: 0 }
        }
        transition={
          loaded
            ? {
                duration: 11,
                times: [0, 0.42, 0.58, 1],
                delay: 1.6,
                repeat: Infinity,
                ease: "easeInOut",
              }
            : undefined
        }
      >
        <div className="relative flex animate-[signage-drift_12s_ease-in-out_infinite] flex-col items-end gap-2">
          <GlowText color="var(--accent-bright)" boxed flicker className="-rotate-2 text-sm">
            S3
          </GlowText>
          <GlowText color="var(--neon-pink)" boxed className="rotate-1 text-xs">
            SPACER
          </GlowText>
        </div>
      </motion.div>
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Background — the original grid/orbs/cursor-glow/orbit-rings, kept    */
/* exactly as they were, now with a video underneath all of it (not      */
/* replacing it). Referenced by URL only, not downloaded/stored in the   */
/* repo — Pexels' own CDN (videos.pexels.com), royalty-free. No CSS      */
/* filter on the video right now — only the scrim below dims it — so     */
/* whatever clip HERO_VIDEO_URL points at shows its own native color.     */
/* Re-check that against the locked palette whenever this URL changes.   */
/* ------------------------------------------------------------------ */

const HERO_VIDEO_URL = "https://www.pexels.com/download/video/34732653/";

function HeroBackground({ loaded }: { loaded: boolean }) {
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
      {/* video — sits behind everything else below; the scrim just past
          it is the only thing dimming it (no filter on the element itself) */}
      <video
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        className="absolute inset-0 h-full w-full object-cover"
      >
        <source src={HERO_VIDEO_URL} type="video/mp4" />
      </video>
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(100deg, rgba(4,8,22,0.88) 0%, rgba(4,8,22,0.72) 40%, rgba(4,8,22,0.58) 70%, rgba(4,8,22,0.45) 100%), rgba(4,8,22,0.35)",
        }}
      />

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

      <Signage loaded={loaded} />

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
        className="group relative flex h-32 w-32 items-center justify-center rounded-full border border-line bg-bg/40 shadow-[0_20px_60px_-24px_rgba(108,207,212,0.45)] backdrop-blur-sm transition-[color,background-color,box-shadow] duration-500 hover:bg-accent md:h-40 md:w-40"
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
      <HeroBackground loaded={loaded} />

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
          <span className="relative block">
            <Split as="span" by="char" active={loaded} delay={0.15}>
              Websites
            </Split>
            {/* One-shot premium shine — the hero's signature motion detail.
                Now shared as Shine (Reveal.tsx) so every other section's
                outlined headline word gets the same beat — a sitewide
                signature instead of a one-off. */}
            <Shine active={loaded} delay={1.05}>
              Websites
            </Shine>
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
                className="group label inline-flex rounded-full bg-accent px-7 py-4 font-bold text-white shadow-[0_14px_40px_-14px_rgba(108,207,212,0.55)] transition-[color,background-color,box-shadow] duration-300 hover:bg-accent-bright hover:shadow-[0_18px_50px_-14px_rgba(108,207,212,0.75)]"
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
                className="group label inline-flex rounded-full border border-line px-7 py-4 shadow-[0_10px_34px_-16px_rgba(108,207,212,0.3)] transition-[color,border-color,box-shadow] duration-300 hover:border-accent-bright hover:shadow-[0_14px_40px_-16px_rgba(108,207,212,0.45)]"
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
