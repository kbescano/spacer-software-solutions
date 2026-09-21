"use client";

import { useEffect, useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
} from "motion/react";
import { nav, site } from "@/data/site";
import { useLoading, useScrollControls } from "./Providers";
import { EASE, RollText } from "./Reveal";

const sectionIds = [...nav.map((n) => n.href.slice(1)), "contact"];

export function Nav() {
  const { loaded } = useLoading();
  const { scrollTo, lock, unlock } = useScrollControls();
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<string | null>(null);

  // Hide on scroll down, reveal on scroll up
  useMotionValueEvent(scrollY, "change", (y) => {
    const prev = scrollY.getPrevious() ?? 0;
    setScrolled(y > 40);
    setHidden(y > prev && y > 240);
  });

  // Highlight the section in view
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id);
        }
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    for (const id of sectionIds) {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, []);

  // Lock scroll + Escape while the mobile menu is open
  useEffect(() => {
    if (!open) return;
    lock();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      unlock();
      window.removeEventListener("keydown", onKey);
    };
  }, [open, lock, unlock]);

  const go = (href: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    setOpen(false);
    // Wait a beat so the scroll unlocks before Lenis animates
    setTimeout(() => scrollTo(href === "#top" ? 0 : href), open ? 350 : 0);
  };

  return (
    <>
      <motion.header
        className={`fixed inset-x-0 top-0 z-50 transition-colors duration-500 ${
          scrolled
            ? "border-b border-line bg-bg/70 backdrop-blur-xl"
            : "border-b border-transparent"
        }`}
        initial={{ y: "-100%" }}
        animate={{ y: loaded && (!hidden || open) ? "0%" : "-100%" }}
        transition={{ duration: 0.7, ease: EASE, delay: loaded && !scrolled ? 0.6 : 0 }}
      >
        <div className="flex items-center justify-between px-6 py-5 md:px-10">
          <a
            href="#top"
            onClick={go("#top")}
            className="group relative z-[60] flex items-center gap-3 font-bold tracking-tight"
            aria-label={`${site.name} — back to top`}
          >
            <span className="display flex h-9 w-9 items-center justify-center rounded-xl bg-accent text-sm tracking-tight text-white transition-colors duration-300 group-hover:bg-accent-bright">
              {site.short}
            </span>
            <span className="hidden min-[430px]:inline">
              <RollText>{site.name}</RollText>
            </span>
          </a>

          <nav className="hidden items-center gap-9 md:flex" aria-label="Primary">
            {nav.map((item) => {
              const isActive = active === item.href.slice(1);
              return (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={go(item.href)}
                  className={`group label relative py-1 transition-colors ${
                    isActive ? "text-fg" : "text-muted hover:text-fg"
                  }`}
                >
                  <RollText>{item.label}</RollText>
                  <span
                    className={`absolute -bottom-0.5 left-0 h-px bg-accent-bright transition-all duration-500 ${
                      isActive ? "w-full" : "w-0"
                    }`}
                  />
                </a>
              );
            })}
            <a
              href="#contact"
              onClick={go("#contact")}
              className="group label rounded-full border border-accent-bright/50 bg-accent/10 px-5 py-2.5 transition-colors duration-300 hover:bg-accent hover:text-white"
            >
              <RollText>Let’s talk</RollText>
            </a>
          </nav>

          <button
            type="button"
            className="relative z-[60] -mr-2 flex h-10 w-10 flex-col items-center justify-center gap-[6px] md:hidden"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            <span
              className={`h-px w-6 bg-fg transition-transform duration-500 ease-expo ${
                open ? "translate-y-[3.5px] rotate-45" : ""
              }`}
            />
            <span
              className={`h-px w-6 bg-fg transition-transform duration-500 ease-expo ${
                open ? "-translate-y-[3.5px] -rotate-45" : ""
              }`}
            />
          </button>
        </div>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-40 flex h-dvh flex-col justify-between overscroll-contain bg-bg px-6 pt-28 pb-10 md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.28, ease: "easeOut" }}
          >
            <nav className="flex flex-col gap-2" aria-label="Mobile">
              {[...nav, { label: "Contact", href: "#contact" }].map(
                (item, i) => (
                  <div key={item.href} className="overflow-hidden">
                    <motion.a
                      href={item.href}
                      onClick={go(item.href)}
                      className="display block py-1 text-[clamp(3rem,15vw,5rem)]"
                      initial={{ y: "110%" }}
                      animate={{
                        y: "0%",
                        transition: { delay: 0.25 + i * 0.07, duration: 0.8, ease: EASE },
                      }}
                      exit={{ y: "110%", transition: { duration: 0.3 } }}
                    >
                      {item.label}
                    </motion.a>
                  </div>
                ),
              )}
            </nav>
            <div className="label flex justify-between text-muted">
              <span>{site.email}</span>
              <span>{site.short}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
