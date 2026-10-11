"use client";

import { useRef } from "react";
import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from "motion/react";
import { marquee } from "@/data/site";

// Keeps the value inside (-50, 0] so a doubled track loops seamlessly
const wrap = (v: number) => -(((v % 50) + 50) % 50);

function Row({
  items,
  baseVelocity,
  outline = false,
}: {
  items: string[];
  baseVelocity: number;
  outline?: boolean;
}) {
  const reduce = useReducedMotion();
  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smooth = useSpring(scrollVelocity, { damping: 50, stiffness: 400 });
  const boost = useTransform(smooth, [0, 1000], [0, 5], { clamp: false });
  const x = useTransform(baseX, (v) => `${wrap(v)}%`);
  const direction = useRef(baseVelocity < 0 ? -1 : 1);

  useAnimationFrame((_, delta) => {
    if (reduce) return;
    const speed = Math.abs(baseVelocity);
    const b = boost.get();
    // Scrolling flips the marquee to follow the scroll direction
    if (b < -0.05) direction.current = baseVelocity < 0 ? 1 : -1;
    else if (b > 0.05) direction.current = baseVelocity < 0 ? -1 : 1;

    const step = direction.current * speed * (delta / 1000);
    baseX.set(baseX.get() + step + step * Math.abs(b));
  });

  // Two identical halves → translating by -50% loops seamlessly
  const half = (
    <div className="flex shrink-0 items-center" aria-hidden>
      {[...items, ...items].map((item, i) => (
        <span
          key={i}
          className="group/word ease-expo flex items-center transition-transform duration-500 hover:scale-105"
        >
          <span
            className={`display px-6 text-[clamp(3rem,8vw,8rem)] whitespace-nowrap uppercase transition-colors duration-500 md:px-10 ${
              outline ? "text-outline" : "group-hover/word:text-accent-bright"
            }`}
          >
            {item}
          </span>
          <span className="ease-expo text-[clamp(1.5rem,3vw,3rem)] text-accent-bright transition-transform duration-700 group-hover/word:rotate-180">
            ✦
          </span>
        </span>
      ))}
    </div>
  );

  return (
    <div className="overflow-hidden py-2">
      <motion.div className="flex w-max will-change-transform" style={{ x }}>
        {half}
        {half}
      </motion.div>
    </div>
  );
}

export function Marquee() {
  return (
    <section
      aria-label="Skills"
      className="relative border-y border-line bg-elevated/60 py-6 md:py-10"
    >
      <Row items={marquee.top} baseVelocity={-2.2} />
      <Row items={marquee.bottom} baseVelocity={2.2} outline />
    </section>
  );
}
