"use client";

import { useRef, type ReactNode } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";

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
                    hidden: { y: "118%", rotate: 4 },
                    show: {
                      y: "0%",
                      rotate: 0,
                      transition: {
                        duration: 1,
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
