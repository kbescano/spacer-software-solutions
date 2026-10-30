"use client";

import type { MouseEvent } from "react";
import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useReducedMotion, useTransform } from "motion/react";
import { FadeUp, Magnetic, RollText, Shine, Split, useFlickerReplay } from "./Reveal";
import { Logo } from "./Logo";
import { HeroPortal3D } from "./HeroPortal3D";
import { CELESTIAL_PATTERN } from "@/lib/celestial";
import { nav, site } from "@/data/site";
import { useLoading, useMenu, useScrollControls } from "./Providers";

// Signage — the two brand marks, sliding in then drifting gently
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
        background: boxed ? "rgb(var(--bg-rgb)/0.45)" : undefined,
      }}
    >
      {children}
    </span>
  );
}

// The two neon signs, as on the live site: they slide in from the right,
// hold, drift, and slide away again on an 11-second loop.
function Signage({ loaded, small, className }: { loaded: boolean; small?: boolean; className: string }) {
  const from = small ? 200 : 260;
  return (
    <motion.div
      aria-hidden
      className={`pointer-events-none ${className}`}
      initial={{ x: from, opacity: 0 }}
      animate={loaded ? { x: [from, 0, 0, from], opacity: [0, 1, 1, 0] } : { x: from, opacity: 0 }}
      transition={
        loaded
          ? { duration: 11, times: [0, 0.42, 0.58, 1], delay: 1.6, repeat: Infinity, ease: "easeInOut" }
          : undefined
      }
    >
      <div
        className={`relative flex animate-[signage-drift_12s_ease-in-out_infinite] flex-col items-end ${small ? "gap-2" : "gap-3"}`}
      >
        <GlowText color="var(--headline)" boxed flicker className={`-rotate-2 ${small ? "text-sm" : "text-lg"}`}>
          S3
        </GlowText>
        <GlowText color="var(--sign)" boxed className={`rotate-1 ${small ? "text-xs" : "text-sm"}`}>
          SPACER
        </GlowText>
      </div>
    </motion.div>
  );
}

// Rotating circular badge
function Badge({ small }: { small?: boolean }) {
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
        className={`group relative flex items-center justify-center rounded-full border border-line-strong bg-bg/40 shadow-[0_20px_60px_-24px_rgb(var(--shadow-rgb)/0.45)] backdrop-blur-sm transition-[color,background-color,box-shadow] duration-500 hover:bg-accent hover:text-light ${
          small ? "h-24 w-24 md:h-28 md:w-28" : "h-32 w-32 md:h-40 md:w-40"
        }`}
        aria-label="Taking new projects — get in touch"
      >
        <svg viewBox="0 0 200 200" className="absolute inset-0 animate-[spin_16s_linear_infinite]" aria-hidden>
          <defs>
            <path id="badge-circle" d="M100,100 m-78,0 a78,78 0 1,1 156,0 a78,78 0 1,1 -156,0" />
          </defs>
          <text
            className="fill-fg text-[15px] tracking-[0.22em] transition-[fill] duration-500 group-hover:fill-light"
            style={{ fontFamily: "var(--font-geist-mono)" }}
          >
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

// The celestial pattern, quiet, behind everything — and fading away behind the
// portal, so the ring's fine detail isn't fighting the scallops.
function PatternLayer() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 -z-20 opacity-[0.06] [background-size:340px_340px] [mask-image:radial-gradient(ellipse_34%_40%_at_58%_24%,transparent_35%,black_100%)] md:[background-size:480px_480px] lg:[mask-image:radial-gradient(ellipse_28%_44%_at_65%_38%,transparent_30%,black_100%)]"
      style={{ backgroundImage: CELESTIAL_PATTERN }}
    />
  );
}

// Two lines, morphing into a cross when the menu opens (the nav draws the close)
function Burger({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Open menu"
      className="group -mr-2 flex h-10 w-10 flex-col items-end justify-center gap-[6px] md:hidden"
    >
      <span className="ease-expo h-px w-6 bg-fg transition-[width] duration-500 group-hover:w-4" />
      <span className="ease-expo h-px w-4 bg-fg transition-[width] duration-500 group-hover:w-6" />
    </button>
  );
}

export function Hero() {
  const { loaded, setVideoReady } = useLoading();
  const { scrollTo } = useScrollControls();
  const { setMenuOpen } = useMenu();
  const reduce = useReducedMotion();
  const { ref: flickerRef, cycle: flickerCycle } = useFlickerReplay<HTMLSpanElement>();
  const trackRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);

  // nothing to wait for, so the preloader runs on its own clock
  useEffect(() => {
    setVideoReady(true);
  }, [setVideoReady]);

  // A stage taller than the screen (a short phone) pins once its bottom
  // reaches the bottom of the screen, so nothing in it is ever cut off.
  const [stickTop, setStickTop] = useState(0);
  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const fit = () => setStickTop(Math.min(0, window.innerHeight - el.offsetHeight));
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(el);
    window.addEventListener("resize", fit);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", fit);
    };
  }, []);

  // The flight: as the track scrolls, the type falls away toward you and the
  // portal takes the whole screen. Progress is measured here exactly as
  // HeroPortal3D measures it, so the type and the camera stay in step.
  const scrollYProgress = useMotionValue(0);
  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    const measure = () => {
      const span = el.offsetHeight - window.innerHeight;
      scrollYProgress.set(span > 0 ? Math.min(1, Math.max(0, -el.getBoundingClientRect().top / span)) : 0);
    };
    measure();
    window.addEventListener("scroll", measure, { passive: true });
    window.addEventListener("resize", measure);
    return () => {
      window.removeEventListener("scroll", measure);
      window.removeEventListener("resize", measure);
    };
  }, [scrollYProgress]);
  const gone = (v: number, end: number) => Math.min(1, Math.max(0, v / end));
  const typeOpacity = useTransform(scrollYProgress, (v) => 1 - gone(v, 0.16));
  const typeY = useTransform(scrollYProgress, (v) => -140 * gone(v, 0.2));
  const typeScale = useTransform(scrollYProgress, (v) => 1 + 0.12 * gone(v, 0.2));
  const typeBlur = useTransform(scrollYProgress, (v) => `blur(${12 * gone(v, 0.16)}px)`);
  const typeEvents = useTransform(scrollYProgress, (v) => (v > 0.12 ? "none" : "auto"));
  const skyOpacity = useTransform(scrollYProgress, (v) => 1 - gone(v, 0.32));

  const go = (href: string) => (e: MouseEvent) => {
    e.preventDefault();
    scrollTo(href);
  };

  return (
    // the track: one screen of hero, then a long run of scroll for the flight
    <section ref={trackRef} id="top" className="relative h-[330svh] motion-reduce:h-auto">
      <div
        ref={stageRef}
        style={{ top: stickTop }}
        className="sticky isolate flex min-h-svh flex-col overflow-hidden bg-bg px-6 pt-6 pb-8 [--hero-fs:calc((100vw-3rem)/5.6)] motion-reduce:static md:px-10 md:pb-10 md:[--hero-fs:calc((100vw-5rem)/5.6)] lg:[--hero-fs:min(calc((100vw-5rem)*0.62/5.5),calc((100vw-29rem)/5.6),18rem)]"
      >
        <motion.div aria-hidden className="pointer-events-none absolute inset-0 -z-10" style={reduce ? undefined : { opacity: skyOpacity }}>
          <PatternLayer />
          {/* a light source in the dark interior, and a cooler pool of it low on the left */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse 46% 58% at 76% 30%, rgb(var(--light-rgb)/0.09), transparent 72%), radial-gradient(ellipse 62% 50% at 6% 100%, rgb(var(--panel-rgb)/0.6), transparent 70%)",
            }}
          />
        </motion.div>
        {/* the portal: big in the sky at rest, then the whole screen */}
        <HeroPortal3D stage={stageRef} track={trackRef} loaded={loaded} />

        <motion.div
          className="relative z-10 flex flex-1 flex-col"
          style={
            reduce
              ? undefined
              : { opacity: typeOpacity, y: typeY, scale: typeScale, filter: typeBlur, pointerEvents: typeEvents }
          }
        >
          <Signage loaded={loaded} className="absolute top-32 right-0 hidden lg:block xl:right-2" />

          {/* the top bar, ruled: the maker on the left, the way around on the right */}
          <div data-hero-bar>
            <FadeUp
              active={loaded}
              delay={0.1}
              y={12}
              className="flex items-center justify-between gap-4 border-b border-line-strong pb-4"
            >
              <span className="flex items-center gap-3">
                <Logo className="h-8 w-8" />
                <span className="label hidden text-muted sm:inline">{site.name}</span>
              </span>
              <nav aria-label="Sections" className="label hidden gap-9 text-muted md:flex">
                {nav.map((item) => (
                  <a key={item.href} href={item.href} onClick={go(item.href)} className="group py-1">
                    <RollText>{item.label}</RollText>
                  </a>
                ))}
              </nav>
              <Burger onClick={() => setMenuOpen(true)} />
            </FadeUp>
          </div>

          {/* the wordmark, bottom-left; the small print, bottom-right */}
          <div
            data-hero-content
            // on phones, keep a minimum of room for the portal above the
            // wordmark, but little enough that the intro is on the first screen
            className="mt-auto grid items-end gap-6 pt-[calc(44vw+1.5rem)] md:gap-10 md:pt-20 lg:grid-cols-[minmax(0,1fr)_minmax(0,21rem)] lg:gap-12"
          >
            <div className="relative">
              {/* on desktop the badge rides above the wordmark, off the portal */}
              <FadeUp active={loaded} delay={0.7} className="absolute bottom-full left-0 mb-8 hidden lg:block">
                <Badge small />
              </FadeUp>
              <h1 className="display -ml-[0.04em] text-[length:var(--hero-fs)] leading-[0.9] uppercase">
                <span className="block text-fg">
                  <Split as="span" by="char" active={loaded} delay={0.1}>
                    Websites
                  </Split>
                </span>
                <span ref={flickerRef} className="text-outline relative block text-[length:calc(var(--hero-fs)*0.885)]">
                  <span
                    aria-hidden
                    className="pointer-events-none absolute inset-0 -z-10 animate-[glow-pulse_7s_ease-in-out_infinite] blur-3xl"
                    style={{
                      background: "radial-gradient(ellipse 60% 70% at 30% 50%, rgb(var(--outline-rgb)/0.3), transparent 70%)",
                    }}
                  />
                  <span key={flickerCycle} className="inline-block animate-[neon-flicker_7s_ease-in-out_infinite]">
                    <Split as="span" by="char" active={loaded} delay={0.3}>
                      & Portals
                    </Split>
                    <Shine delay={0.8} by="char">& Portals</Shine>
                  </span>
                </span>
              </h1>
            </div>

            <div className="flex flex-col gap-5 lg:pb-1">
              <FadeUp active={loaded} delay={0.5}>
                <p className="text-[0.85rem] leading-relaxed text-muted">{site.intro}</p>
              </FadeUp>
              <FadeUp active={loaded} delay={0.6} className="flex flex-wrap gap-3">
                <Magnetic>
                  <a
                    href="#work"
                    onClick={go("#work")}
                    className="group label inline-flex rounded-full border border-accent-bright bg-accent px-6 py-3.5 font-bold text-light shadow-[0_14px_40px_-14px_rgb(var(--shadow-rgb)/0.55)] transition-[color,background-color,box-shadow,border-color] duration-300 hover:border-accent-bright hover:bg-accent-bright hover:shadow-[0_18px_50px_-14px_rgb(var(--shadow-rgb)/0.75)]"
                  >
                    <RollText revealClassName="text-on-bright">See our work</RollText>
                  </a>
                </Magnetic>
                <Magnetic>
                  <a
                    href="#contact"
                    onClick={go("#contact")}
                    className="group label inline-flex rounded-full border border-line-strong px-6 py-3.5 transition-[color,border-color,box-shadow] duration-300 hover:border-accent-bright"
                  >
                    <RollText>Get in touch</RollText>
                  </a>
                </Magnetic>
              </FadeUp>
              {/* phones and tablets: the badge and signs come after the buttons, so the
                  intro follows the wordmark straight away */}
              <div className="flex items-center justify-between gap-4 lg:hidden">
                <FadeUp active={loaded} delay={0.7} className="pointer-events-auto">
                  <Badge small />
                </FadeUp>
                {/* the signs sit here, beside the badge, clear of the portal */}
                <Signage loaded={loaded} small className="mr-1" />
              </div>
              <FadeUp active={loaded} delay={0.8} y={10} className="label flex items-center gap-3 text-muted">
                <span className="relative block h-7 w-px overflow-hidden bg-line">
                  <span className="absolute inset-x-0 top-0 h-full animate-[scroll-cue_1.8s_cubic-bezier(0.76,0,0.24,1)_infinite] bg-accent-bright" />
                </span>
                Scroll into the portal
              </FadeUp>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
