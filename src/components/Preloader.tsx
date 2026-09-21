"use client";

import { useEffect, useState } from "react";
import {
  AnimatePresence,
  animate,
  motion,
  useMotionValue,
  useReducedMotion,
  useTransform,
} from "motion/react";
import { site } from "@/data/site";
import { useLoading } from "./Providers";

export function Preloader() {
  const { setLoaded } = useLoading();
  const reduce = useReducedMotion();
  const [visible, setVisible] = useState(true);

  const progress = useMotionValue(0);
  const count = useTransform(progress, (v) => Math.round(v).toString());
  const bar = useTransform(progress, (v) => v / 100);

  useEffect(() => {
    if (reduce) {
      setLoaded(true);
      return;
    }
    const controls = animate(progress, 100, {
      duration: 1.7,
      ease: [0.65, 0, 0.35, 1],
      onComplete: () => {
        // Flip both at once so the hero reveals while the curtain lifts
        setLoaded(true);
        setVisible(false);
      },
    });
    return () => controls.stop();
  }, [reduce, progress, setLoaded]);

  if (reduce) return null;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          data-preloader
          className="fixed inset-0 z-[110] flex flex-col justify-between overflow-hidden bg-bg p-6 md:p-10"
          exit={{ y: "-100%" }}
          transition={{ duration: 1, ease: [0.76, 0, 0.24, 1] }}
        >
          {/* rising blue fill */}
          <motion.div
            aria-hidden
            className="absolute inset-x-0 bottom-0 h-full origin-bottom bg-accent/15"
            style={{ scaleY: bar }}
          />

          <div className="label relative flex items-center justify-between text-muted">
            <span>{site.name}</span>
            <span>
              {site.short} · {site.year}
            </span>
          </div>

          <div className="relative flex items-end justify-between">
            <div className="label max-w-[12rem] text-muted">
              Loading experience
              <span className="ml-1 inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-accent-bright" />
            </div>
            <div className="display text-[clamp(7rem,28vw,26rem)] tabular-nums">
              <motion.span>{count}</motion.span>
            </div>
          </div>

          <motion.div
            aria-hidden
            className="absolute inset-x-0 bottom-0 h-[3px] origin-left bg-accent-bright"
            style={{ scaleX: bar }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
