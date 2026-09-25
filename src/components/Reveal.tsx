"use client";

import { useRef, type ReactNode } from "react";
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

/* ------------------------------------------------------------------ */
/* Split — masked text reveal, by word or by character                 */
/* ------------------------------------------------------------------ */

type SplitProps = {
  children: string;
  as?: "h1" | "h2" | "h3" | "p" | "span" | "div";
  by?: "word" | "char";
  className?: string;
  delay?: number;
  stagger?: number;
  /** Controlled mode (e.g. wait for the preloader). Omit to reveal on scroll. */
  active?: boolean;
};

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
  const words = children.split(" ");

  // Running index so the stagger continues across word boundaries
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
      {words.map((word, wi) => {
        const units = by === "char" ? word.split("") : [word];
        return (
          <span key={wi} aria-hidden>
            <span className="-mx-[0.04em] -my-[0.12em] inline-block overflow-hidden px-[0.04em] py-[0.12em] align-top">
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
            {wi < words.length - 1 && " "}
          </span>
        );
      })}
    </Tag>
  );
}

/* ------------------------------------------------------------------ */
/* FadeUp                                                              */
/* ------------------------------------------------------------------ */

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

/* ------------------------------------------------------------------ */
/* Line — hairline that draws itself in                                */
/* ------------------------------------------------------------------ */

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

/* ------------------------------------------------------------------ */
/* Magnetic — pulls its child toward the cursor                        */
/* ------------------------------------------------------------------ */

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

/* ------------------------------------------------------------------ */
/* Parallax — gentle scroll-linked drift, independent of Motion's       */
/* whileInView reveals (this runs continuously as the element passes    */
/* through the viewport, not just once)                                 */
/* ------------------------------------------------------------------ */

export function Parallax({
  children,
  className,
  strength = 60,
}: {
  children: ReactNode;
  className?: string;
  /** Max travel in px, applied both up and down across the viewport pass. */
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

/* ------------------------------------------------------------------ */
/* Tilt — 3D pointer-tilt with a cursor-tracking glare sheen            */
/* ------------------------------------------------------------------ */

export function Tilt({
  children,
  className = "",
  max = 8,
  glareClassName = "rounded-2xl",
}: {
  children: ReactNode;
  className?: string;
  /** Max rotation in degrees at the edge of the element. */
  max?: number;
  /** Border radius class for the glare layer — match the wrapped card's. */
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

/* ------------------------------------------------------------------ */
/* RollText — label that rolls up on hover (pure CSS)                  */
/* ------------------------------------------------------------------ */

export function RollText({
  children,
  revealClassName = "text-accent-bright",
}: {
  children: string;
  /** Color class for the incoming (hover) copy. Default `text-accent-bright`
   * works on a background that stays fixed. On a button whose own background
   * animates *to* accent-bright on hover (e.g. `hover:bg-accent-bright`),
   * pass `"text-white"` (or similar) instead — otherwise the reveal text is
   * the same color as the background it lands on and disappears. */
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

/* ------------------------------------------------------------------ */
/* SectionLabel                                                        */
/* ------------------------------------------------------------------ */

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
