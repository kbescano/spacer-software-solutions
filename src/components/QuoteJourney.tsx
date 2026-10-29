"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useReducedMotion, useSpring } from "motion/react";

// The signature move: a quote request travels from the public website
// (#quote-origin in Portal.tsx) to the portal's pipeline (#quote-destination
// in Work.tsx, the Primegen "Portal" tab) as you scroll, without being
// re-entered. Rides a fixed band under the nav rather than the anchors'
// literal coordinates — a straight line between them would cross body copy
// on a narrow viewport.
//
// Stays mounted the whole time and hides via opacity only. Unmounting it
// instead caused the springs to seize up right as the source values jumped.

type Stage = "quote" | "order" | "delivered";

const STAGE_LABEL: Record<Stage, string> = {
  quote: "Quote requested",
  order: "Order confirmed",
  delivered: "Delivered",
};

export function QuoteJourney() {
  const reduce = useReducedMotion();
  const [stage, setStage] = useState<Stage>("quote");

  const x = useMotionValue(0);
  const y = useMotionValue(92);
  const sx = useSpring(x, { stiffness: 260, damping: 32, mass: 0.6 });
  const sy = useSpring(y, { stiffness: 260, damping: 32, mass: 0.6 });
  const opacity = useMotionValue(0);
  const sOpacity = useSpring(opacity, { stiffness: 220, damping: 30 });

  useEffect(() => {
    if (reduce) return;

    let frame = 0;
    const tick = () => {
      frame = 0;
      const origin = document.getElementById("quote-origin");
      const destination = document.getElementById("quote-destination");
      if (!origin || !destination) {
        opacity.set(0);
        return;
      }

      const originRect = origin.getBoundingClientRect();
      const destRect = destination.getBoundingClientRect();
      const scrollY = window.scrollY;
      const originPageY = originRect.top + scrollY;
      const destPageY = destRect.top + scrollY;
      const span = destPageY - originPageY;
      if (span <= 0) {
        opacity.set(0);
        return;
      }

      const reference = scrollY + window.innerHeight * 0.5;
      const progress = (reference - originPageY) / span;

      if (progress < -0.18 || progress > 1.18) {
        opacity.set(0);
        return;
      }

      const t = Math.min(1, Math.max(0, progress));
      const margin = 84;
      const cx = margin + (window.innerWidth - margin * 2) * t;
      x.set(Math.min(Math.max(cx, margin), window.innerWidth - margin));
      opacity.set(progress < 0 ? 1 + progress / 0.18 : progress > 1 ? 1 - (progress - 1) / 0.18 : 1);

      setStage(progress < 0.32 ? "quote" : progress < 0.68 ? "order" : "delivered");
    };

    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(tick);
    };

    tick();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [reduce, x, y, opacity]);

  if (reduce) return null;

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed top-0 left-0 z-40 -translate-x-1/2 -translate-y-1/2"
      style={{ x: sx, y: sy, opacity: sOpacity }}
    >
      <span className="label flex items-center gap-2 rounded-full border border-accent-bright/60 bg-bg/90 px-3 py-1.5 text-[9px] whitespace-nowrap text-accent-bright shadow-[0_0_30px_-6px_rgb(var(--glow-rgb)/0.8)] backdrop-blur-sm">
        <span className="relative flex h-1.5 w-1.5 shrink-0">
          <span className="absolute inset-0 animate-[ping-soft_2s_cubic-bezier(0,0,0.2,1)_infinite] rounded-full bg-accent-bright/70" />
          <span className="relative h-1.5 w-1.5 rounded-full bg-accent-bright" />
        </span>
        {STAGE_LABEL[stage]}
      </span>
    </motion.div>
  );
}
