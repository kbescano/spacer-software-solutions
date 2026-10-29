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

export function MarqueeRow({
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
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  // the tapes swing through as the strip scrolls past: crossed steeply on the
  // way in, nearly level in the middle, crossing the other way on the way out
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const topTilt = useTransform(scrollYProgress, [0, 0.5, 1], [-7, -2, 3]);
  const bottomTilt = useTransform(scrollYProgress, [0, 0.5, 1], [6, 1.5, -4]);
  const topLift = useTransform(scrollYProgress, [0, 1], [40, -40]);
  const bottomLift = useTransform(scrollYProgress, [0, 1], [-30, 30]);

  return (
    <section ref={ref} aria-label="Skills" className="relative isolate overflow-x-clip bg-bg py-20 md:py-32">
      {/* two tapes crossing at an angle, one filled, one ruled */}
      <motion.div
        className="relative z-10 -mx-[8vw] border-y border-line-strong bg-panel py-2 shadow-[0_30px_80px_-30px_rgb(var(--shadow-rgb)/0.9)] md:py-4"
        style={reduce ? { rotate: -2.5 } : { rotate: topTilt, y: topLift }}
      >
        <MarqueeRow items={marquee.top} baseVelocity={-2.2} />
      </motion.div>
      <motion.div
        className="relative -mx-[8vw] -mt-6 border-y border-line bg-bg py-1 md:-mt-10 md:py-3"
        style={reduce ? { rotate: 1.75 } : { rotate: bottomTilt, y: bottomLift }}
      >
        <MarqueeRow items={marquee.bottom} baseVelocity={2.2} outline />
      </motion.div>
    </section>
  );
}
