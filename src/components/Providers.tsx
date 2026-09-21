"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { MotionConfig, useReducedMotion } from "motion/react";
import Lenis from "lenis";
import "lenis/dist/lenis.css";

/* ------------------------------------------------------------------ */
/* Loading state — the preloader flips this so the hero can animate in */
/* ------------------------------------------------------------------ */

type LoadingCtx = { loaded: boolean; setLoaded: (v: boolean) => void };
const LoadingContext = createContext<LoadingCtx>({
  loaded: false,
  setLoaded: () => {},
});
export const useLoading = () => useContext(LoadingContext);

/* ------------------------------------------------------------------ */
/* Smooth scroll (Lenis)                                               */
/* ------------------------------------------------------------------ */

type ScrollCtx = {
  scrollTo: (target: string | number, immediate?: boolean) => void;
  lock: () => void;
  unlock: () => void;
};
const ScrollContext = createContext<ScrollCtx>({
  scrollTo: () => {},
  lock: () => {},
  unlock: () => {},
});
export const useScrollControls = () => useContext(ScrollContext);

const easeOutExpo = (t: number) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t));

function SmoothScroll({ children }: { children: ReactNode }) {
  const { loaded } = useLoading();
  const reduce = useReducedMotion();
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    if (reduce) return;
    const lenis = new Lenis({ lerp: 0.09, smoothWheel: true });
    lenisRef.current = lenis;

    let frame = requestAnimationFrame(function raf(time) {
      lenis.raf(time);
      frame = requestAnimationFrame(raf);
    });

    return () => {
      cancelAnimationFrame(frame);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, [reduce]);

  // Freeze scrolling until the preloader is done
  useEffect(() => {
    const lenis = lenisRef.current;
    if (!lenis) return;
    if (loaded) lenis.start();
    else lenis.stop();
  }, [loaded, reduce]);

  const controls = useMemo<ScrollCtx>(
    () => ({
      scrollTo: (target, immediate = false) => {
        const lenis = lenisRef.current;
        if (lenis) {
          lenis.scrollTo(target, {
            duration: 1.6,
            easing: easeOutExpo,
            immediate,
          });
          return;
        }
        const el =
          typeof target === "string" ? document.querySelector(target) : null;
        if (el) el.scrollIntoView({ behavior: "smooth" });
        else if (typeof target === "number") window.scrollTo({ top: target });
      },
      lock: () => lenisRef.current?.stop(),
      unlock: () => lenisRef.current?.start(),
    }),
    [],
  );

  return (
    <ScrollContext.Provider value={controls}>{children}</ScrollContext.Provider>
  );
}

export function Providers({ children }: { children: ReactNode }) {
  const [loaded, setLoaded] = useState(false);
  const value = useMemo(() => ({ loaded, setLoaded }), [loaded]);

  return (
    <MotionConfig reducedMotion="user">
      <LoadingContext.Provider value={value}>
        <SmoothScroll>{children}</SmoothScroll>
      </LoadingContext.Provider>
    </MotionConfig>
  );
}
