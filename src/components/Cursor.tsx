"use client";

import { useEffect, useState } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useVelocity,
} from "motion/react";
import { useMediaQuery } from "@/lib/hooks";

type Mode = "default" | "link" | "label" | "none";

/**
 * Custom cursor: a precise dot plus a lagging ring that grows over links.
 * Opt in per element with data-cursor="Label" (shows text) or data-cursor="none".
 */
export function Cursor() {
  const fine = useMediaQuery("(hover: hover) and (pointer: fine)");
  const [mode, setMode] = useState<Mode>("default");
  const [label, setLabel] = useState("");
  const [visible, setVisible] = useState(false);

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const ringX = useSpring(x, { stiffness: 260, damping: 26, mass: 0.5 });
  const ringY = useSpring(y, { stiffness: 260, damping: 26, mass: 0.5 });

  // Elastic squash-and-stretch: the ring smears along whichever axis the
  // pointer is moving fastest on, then springs back to a circle at rest.
  const vx = useVelocity(x);
  const vy = useVelocity(y);
  const rawScaleX = useTransform(() => 1 + Math.min(Math.abs(vx.get()) / 1200, 0.6));
  const rawScaleY = useTransform(() => 1 + Math.min(Math.abs(vy.get()) / 1200, 0.6));
  const ringScaleX = useSpring(rawScaleX, { stiffness: 320, damping: 18 });
  const ringScaleY = useSpring(rawScaleY, { stiffness: 320, damping: 18 });

  useEffect(() => {
    if (!fine) return;
    document.documentElement.classList.add("has-custom-cursor");

    const move = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      setVisible(true);
    };
    const over = (e: PointerEvent) => {
      const el = e.target as Element | null;
      const tagged = el?.closest<HTMLElement>("[data-cursor]");
      if (tagged) {
        const v = tagged.dataset.cursor ?? "";
        if (v === "none") setMode("none");
        else {
          setMode("label");
          setLabel(v);
        }
      } else if (el?.closest("a, button, [role='button']")) {
        setMode("link");
      } else {
        setMode("default");
      }
    };
    const leave = () => setVisible(false);

    window.addEventListener("pointermove", move);
    window.addEventListener("pointerover", over);
    document.documentElement.addEventListener("pointerleave", leave);
    return () => {
      document.documentElement.classList.remove("has-custom-cursor");
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerover", over);
      document.documentElement.removeEventListener("pointerleave", leave);
    };
  }, [fine, x, y]);

  if (!fine) return null;

  const ringSize = mode === "label" ? 92 : mode === "link" ? 64 : 36;

  return (
    <>
      {/* ring */}
      <motion.div
        aria-hidden
        className="pointer-events-none fixed top-0 left-0 z-[100]"
        style={{ x: ringX, y: ringY }}
      >
        <motion.div
          className="flex items-center justify-center rounded-full border border-accent-bright/70"
          style={{ x: "-50%", y: "-50%", scaleX: ringScaleX, scaleY: ringScaleY }}
          animate={{
            width: ringSize,
            height: ringSize,
            opacity: visible && mode !== "none" ? 1 : 0,
            backgroundColor:
              mode === "label" ? "rgba(47,91,255,0.92)" : "rgba(47,91,255,0)",
            borderColor:
              mode === "label"
                ? "rgba(111,149,255,0)"
                : "rgba(111,149,255,0.7)",
          }}
          transition={{ type: "spring", stiffness: 300, damping: 26 }}
        >
          <motion.span
            className="label text-[0.65rem] text-white"
            animate={{ opacity: mode === "label" ? 1 : 0 }}
          >
            {label}
          </motion.span>
        </motion.div>
      </motion.div>

      {/* dot */}
      <motion.div
        aria-hidden
        className="pointer-events-none fixed top-0 left-0 z-[100]"
        style={{ x, y }}
      >
        <motion.div
          className="-translate-x-1/2 -translate-y-1/2 h-1.5 w-1.5 rounded-full bg-accent-bright"
          animate={{
            opacity: visible && mode !== "label" ? 1 : 0,
            scale: mode === "link" ? 0 : 1,
          }}
        />
      </motion.div>
    </>
  );
}
