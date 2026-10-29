"use client";

import { useEffect } from "react";
import { useReducedMotion } from "motion/react";
import { useLoading, useScrollControls } from "./Providers";

// When the visitor goes quiet, the page carries on down by itself — at twice
// an easy reading pace, easing up to speed rather than starting with a jolt.
// The first touch of the wheel, a finger, a key or a click hands the page back
// at once; it waits for the visitor to be idle again before it moves on. It
// only runs while this browser tab is the one in front and focused, and never
// fights a form being typed into, an open menu, or the reduced-motion
// preference. It stops at the bottom.

const SPEED = 200; // px per second: 2x a 100 px/s reading pace
const IDLE = 4500; // ms of no input before the page starts moving on its own
const EASE_IN = 350; // ms time-constant of the ramp up to full speed
const STRAY = 48; // px the page may move on its own account before we call it the visitor's doing

export function AutoScroll() {
  const { loaded } = useLoading();
  const { scrollTo } = useScrollControls();
  const reduce = useReducedMotion();

  useEffect(() => {
    if (!loaded || reduce) return;

    const root = document.documentElement;
    const r = { pos: 0, setY: 0, v: 0, last: performance.now(), input: performance.now() };
    let down = false;

    const touch = () => {
      r.input = performance.now();
      r.v = 0;
    };
    const press = () => {
      down = true;
      touch();
    };
    const release = () => {
      down = false;
      touch();
    };
    const typing = () => {
      const a = document.activeElement;
      return a instanceof HTMLElement && a.matches("input, textarea, select, [contenteditable='true']");
    };

    const opts = { passive: true } as const;
    window.addEventListener("wheel", touch, opts);
    window.addEventListener("touchmove", touch, opts);
    window.addEventListener("keydown", touch);
    window.addEventListener("pointerdown", press);
    window.addEventListener("pointerup", release);
    window.addEventListener("pointercancel", release);
    // coming back to the tab restarts the wait, so it never lurches on return
    window.addEventListener("focus", touch);
    window.addEventListener("blur", touch);
    document.addEventListener("visibilitychange", touch);

    let frame = requestAnimationFrame(function tick(now) {
      frame = requestAnimationFrame(tick);
      const dt = Math.min(now - r.last, 64);
      r.last = now;
      const y = window.scrollY;

      // the visitor is here, the tab is in the background, or the page is locked
      // (menu open): just keep our place
      if (
        down ||
        now - r.input < IDLE ||
        document.hidden ||
        !document.hasFocus() ||
        root.classList.contains("lenis-stopped") ||
        typing()
      ) {
        r.v = 0;
        r.pos = r.setY = y;
        return;
      }
      // something other than us moved the page — an anchor link, the scrollbar
      if (Math.abs(y - r.setY) > STRAY) {
        touch();
        return;
      }
      const max = root.scrollHeight - window.innerHeight;
      if (y >= max - 1) {
        r.v = 0;
        r.pos = r.setY = y;
        return;
      }
      r.v += (SPEED - r.v) * (1 - Math.exp(-dt / EASE_IN));
      r.pos = r.setY = Math.min(max, r.pos + (r.v * dt) / 1000);
      scrollTo(r.pos, true);
    });

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("wheel", touch);
      window.removeEventListener("touchmove", touch);
      window.removeEventListener("keydown", touch);
      window.removeEventListener("pointerdown", press);
      window.removeEventListener("pointerup", release);
      window.removeEventListener("pointercancel", release);
      window.removeEventListener("focus", touch);
      window.removeEventListener("blur", touch);
      document.removeEventListener("visibilitychange", touch);
    };
  }, [loaded, reduce, scrollTo]);

  return null;
}
