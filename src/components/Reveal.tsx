"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react";

export const EASE = [0.22, 1, 0.36, 1] as const;

// Replays the Split/Shine/flicker entrance on scroll-into-view or tab focus.
export function useFlickerReplay<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [cycle, setCycle] = useState(0);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (reduce) return;
    const el = ref.current;
    if (!el) return;

    const replay = () => setCycle((c) => c + 1);

    const io = new IntersectionObserver(
      ([entry]) => entry.isIntersecting && replay(),
      { threshold: 0.4 },
    );
    io.observe(el);

    const onVisibility = () => document.visibilityState === "visible" && replay();
    const onFocus = () => replay();
    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("focus", onFocus);

    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("focus", onFocus);
    };
  }, [reduce]);

  return { ref, cycle };
}

// Split — masked text reveal, by word or by character
type SplitProps = {
  children: string;
  as?: "h1" | "h2" | "h3" | "p" | "span" | "div";
  by?: "word" | "char";
  className?: string;
  delay?: number;
  stagger?: number;
  /** Controlled mode. Omit to reveal on scroll. */
  active?: boolean;
};

// Shared with Shine so both split the same string the same way
function splitWords(text: string, by: "word" | "char") {
  return text.split(" ").map((word) => (by === "char" ? word.split("") : [word]));
}

const SPLIT_UNIT_WRAP_CLASS =
  "-mx-[0.04em] -my-[0.12em] inline-block overflow-hidden px-[0.04em] py-[0.12em] align-top";

export function Split({
  children,
  as = "span",
  by = "word",
  className,
  delay = 0,
  stagger,
  active,
}: SplitProps) {
  const Tag = motion[as] as typeof motion.span;
  const step = stagger ?? (by === "char" ? 0.045 : 0.07);
  const wordList = splitWords(children, by);

  // stagger continues across words
  let index = 0;
  const trigger =
    active === undefined
      ? {
          initial: "hidden",
          whileInView: "show",
          viewport: { once: true, margin: "0px 0px -12% 0px" },
        }
      : { initial: "hidden", animate: active ? "show" : "hidden" };

  return (
    <Tag className={className} aria-label={children} {...trigger}>
      {wordList.map((units, wi) => (
        <span key={wi} aria-hidden>
          <span className={SPLIT_UNIT_WRAP_CLASS}>
            {units.map((unit, ui) => (
              <motion.span
                key={ui}
                className="inline-block will-change-transform"
                variants={{
                  hidden: { y: "118%", rotate: 6, filter: "blur(14px)" },
                  show: {
                    y: "0%",
                    rotate: 0,
                    filter: "blur(0px)",
                    transition: {
                      duration: 1.1,
                      ease: EASE,
                      delay: delay + index++ * step,
                    },
                  },
                }}
              >
                {unit}
              </motion.span>
            ))}
          </span>
          {wi < wordList.length - 1 && " "}
        </span>
      ))}
    </Tag>
  );
}

// Shine — diagonal light sweep clipped to text, replays on an interval
// while on screen. Plain CSS animation restarted via the Web Animations API.
const SHINE_INTERVAL_MS = 5000;

export function Shine({
  children,
  delay = 0,
  by = "word",
}: {
  children: string;
  delay?: number;
  /** Must match the Split rendering the same text underneath. */
  by?: "word" | "char";
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const wordList = splitWords(children, by);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const isOnScreen = () => {
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight || document.documentElement.clientHeight;
      const vw = window.innerWidth || document.documentElement.clientWidth;
      return r.bottom > 0 && r.top < vh && r.right > 0 && r.left < vw;
    };

    let replayTimer: ReturnType<typeof setInterval> | null = null;
    let hasActivated = false;
    const replay = () => {
      el.getAnimations().forEach((a) => {
        a.cancel();
        a.play();
      });
    };

    const sync = () => {
      const shouldRun = document.visibilityState === "visible" && isOnScreen();
      if (shouldRun && !replayTimer) {
        if (hasActivated) replay();
        hasActivated = true;
        replayTimer = setInterval(replay, SHINE_INTERVAL_MS);
      } else if (!shouldRun && replayTimer) {
        clearInterval(replayTimer);
        replayTimer = null;
      }
    };

    sync();
    const pollTimer = setInterval(sync, 1000);
    document.addEventListener("visibilitychange", sync);
    window.addEventListener("focus", sync);
    window.addEventListener("blur", sync);
    window.addEventListener("scroll", sync, { passive: true });
    window.addEventListener("resize", sync);

    return () => {
      if (replayTimer) clearInterval(replayTimer);
      clearInterval(pollTimer);
      document.removeEventListener("visibilitychange", sync);
      window.removeEventListener("focus", sync);
      window.removeEventListener("blur", sync);
      window.removeEventListener("scroll", sync);
      window.removeEventListener("resize", sync);
    };
  }, []);

  return (
    <span
      ref={ref}
      aria-hidden
      className="shine-el pointer-events-none absolute inset-0 bg-clip-text text-transparent select-none"
      style={{
        backgroundImage:
          "linear-gradient(100deg, transparent 42%, rgba(108,207,212,0.9) 47%, rgba(255,255,255,1) 50%, rgba(108,207,212,0.9) 53%, transparent 58%)",
        backgroundSize: "300% 100%",
        backgroundPositionX: "150%",
        animation: `shine-sweep 1.3s ${delay}s cubic-bezier(0.76,0,0.24,1) 1 forwards`,
      }}
    >
      {wordList.map((units, wi) => (
        <span key={wi}>
          <span className={SPLIT_UNIT_WRAP_CLASS}>
            {units.map((unit, ui) => (
              <span key={ui} className="inline-block">
                {unit}
              </span>
            ))}
          </span>
          {wi < wordList.length - 1 && " "}
        </span>
      ))}
    </span>
  );
}

// FadeUp
export function FadeUp({
  children,
  delay = 0,
  y = 28,
  className,
  active,
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  active?: boolean;
}) {
  const transition = { duration: 1, ease: EASE, delay };
  const hidden = { opacity: 0, y };
  const shown = { opacity: 1, y: 0 };

  if (active !== undefined) {
    return (
      <motion.div
        className={className}
        initial={hidden}
        animate={active ? shown : hidden}
        transition={transition}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <motion.div
      className={className}
      initial={hidden}
      whileInView={shown}
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      transition={transition}
    >
      {children}
    </motion.div>
  );
}

// Line — hairline that draws itself in
export function Line({
  delay = 0,
  className = "",
}: {
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      aria-hidden
      className={`h-px w-full origin-left bg-line ${className}`}
      initial={{ scaleX: 0 }}
      whileInView={{ scaleX: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 1.4, ease: EASE, delay }}
    />
  );
}

// Magnetic — pulls its child toward the cursor
export function Magnetic({
  children,
  strength = 0.35,
  className,
}: {
  children: ReactNode;
  strength?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 220, damping: 16, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 220, damping: 16, mass: 0.4 });

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{ x: sx, y: sy }}
      onPointerMove={(e) => {
        if (e.pointerType !== "mouse" || !ref.current) return;
        const r = ref.current.getBoundingClientRect();
        x.set((e.clientX - (r.left + r.width / 2)) * strength);
        y.set((e.clientY - (r.top + r.height / 2)) * strength);
      }}
      onPointerLeave={() => {
        x.set(0);
        y.set(0);
      }}
    >
      {children}
    </motion.div>
  );
}

// Parallax — scroll-linked drift
export function Parallax({
  children,
  className,
  strength = 60,
}: {
  children: ReactNode;
  className?: string;
  /** Max travel in px. */
  strength?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [strength, -strength]);
  const sy = useSpring(y, { stiffness: 100, damping: 30, mass: 0.5 });

  return (
    <motion.div ref={ref} className={className} style={{ y: reduce ? 0 : sy }}>
      {children}
    </motion.div>
  );
}

// Tilt — 3D pointer-tilt with a glare sheen
export function Tilt({
  children,
  className = "",
  max = 8,
  glareClassName = "rounded-2xl",
}: {
  children: ReactNode;
  className?: string;
  max?: number;
  glareClassName?: string;
}) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);

  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const sc = useMotionValue(1);
  const gx = useMotionValue(50);
  const gy = useMotionValue(50);
  const glow = useMotionValue(0);

  const spring = { stiffness: 260, damping: 22, mass: 0.6 };
  const srx = useSpring(rx, spring);
  const sry = useSpring(ry, spring);
  const ssc = useSpring(sc, spring);
  const sglow = useSpring(glow, { stiffness: 200, damping: 30 });
  const glareBg = useMotionTemplate`radial-gradient(circle at ${gx}% ${gy}%, rgba(255,255,240,0.18), transparent 60%)`;

  const track = (e: React.PointerEvent) => {
    if (reduce || e.pointerType !== "mouse" || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const nx = (e.clientX - r.left) / r.width;
    const ny = (e.clientY - r.top) / r.height;
    rx.set((0.5 - ny) * max);
    ry.set((nx - 0.5) * max);
    gx.set(nx * 100);
    gy.set(ny * 100);
  };
  const enter = (e: React.PointerEvent) => {
    if (reduce || e.pointerType !== "mouse") return;
    sc.set(1.015);
    glow.set(1);
  };
  const leave = () => {
    rx.set(0);
    ry.set(0);
    sc.set(1);
    glow.set(0);
  };

  return (
    <motion.div
      ref={ref}
      className={`relative ${className}`}
      style={{ rotateX: srx, rotateY: sry, scale: ssc, transformPerspective: 1200 }}
      onPointerMove={track}
      onPointerEnter={enter}
      onPointerLeave={leave}
    >
      {children}
      <motion.div
        aria-hidden
        className={`pointer-events-none absolute inset-0 ${glareClassName}`}
        style={{ background: glareBg, opacity: sglow }}
      />
    </motion.div>
  );
}

// RollText — label that rolls up on hover
export function RollText({
  children,
  revealClassName = "text-accent-bright",
}: {
  children: string;
  /** Reveal text color — use text-white on buttons that turn accent-bright on hover. */
  revealClassName?: string;
}) {
  return (
    <span className="relative inline-block overflow-hidden align-bottom">
      <span className="ease-expo block transition-transform duration-500 group-hover:-translate-y-full">
        {children}
      </span>
      <span
        aria-hidden
        className={`ease-expo absolute top-0 left-0 block translate-y-full transition-transform duration-500 group-hover:translate-y-0 ${revealClassName}`}
      >
        {children}
      </span>
    </span>
  );
}

// LockIcon — private/confidential glyph
export function LockIcon({ className = "h-3 w-3" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <rect x="5" y="11" width="14" height="9" rx="2" />
      <path d="M8 11V8a4 4 0 018 0v3" />
    </svg>
  );
}

// SectionLabel
export function SectionLabel({
  index,
  children,
}: {
  index: string;
  children: string;
}) {
  return (
    <FadeUp className="label flex items-center gap-3 text-muted" y={12}>
      <span className="text-accent-bright">({index})</span>
      <span className="h-px w-8 bg-line" />
      <span>{children}</span>
    </FadeUp>
  );
}
