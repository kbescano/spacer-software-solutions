"use client";

import type { ReactNode } from "react";
import { motion, useReducedMotion } from "motion/react";

/* Illustrated stand-ins for the real products. Original artwork — no client
   imagery or data. Swap for real screenshots once the client approves them. */

function Frame({
  url,
  badge,
  children,
}: {
  url: string;
  badge?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="@container relative overflow-hidden rounded-2xl border border-line bg-elevated shadow-[0_40px_120px_-40px_rgba(47,91,255,0.55)]">
      <div className="flex items-center gap-3 border-b border-line bg-bg/60 px-4 py-3">
        <div className="flex gap-1.5" aria-hidden>
          <i className="h-2.5 w-2.5 rounded-full bg-fg/15" />
          <i className="h-2.5 w-2.5 rounded-full bg-fg/15" />
          <i className="h-2.5 w-2.5 rounded-full bg-fg/15" />
        </div>
        <div className="mx-auto flex h-6 w-full max-w-[17rem] items-center justify-center truncate rounded-full bg-surface px-3 text-[10px] text-muted">
          {url}
        </div>
        <div className="flex min-w-[3.5rem] justify-end">{badge}</div>
      </div>
      <div className="relative aspect-[6/5] @md:aspect-[4/3] @lg:aspect-[16/11]">{children}</div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Public website                                                      */
/* ------------------------------------------------------------------ */

const products = ["Steel & Rebar", "Cement", "Pipes & Fittings", "Safety & PPE"];

function PrimegenWebsite() {
  const reduce = useReducedMotion();

  return (
    <Frame url="primegentradingcorporation.com">
      <div className="flex h-full flex-col gap-3 p-4 @lg:gap-4 @lg:p-6">
        {/* nav */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="h-4 w-4 rounded bg-accent" />
            <span className="h-1.5 w-12 rounded bg-fg/30" />
          </div>
          <div className="hidden items-center gap-4 @md:flex">
            {["Products", "Deliveries", "Calculator", "About"].map((l) => (
              <span key={l} className="text-[9px] text-muted">
                {l}
              </span>
            ))}
            <span className="rounded-full bg-accent px-2.5 py-1 text-[9px] font-semibold text-white">
              Request a quote
            </span>
          </div>
        </div>

        {/* hero */}
        <div className="grid flex-1 grid-cols-5 gap-4">
          <div className="col-span-3 flex flex-col justify-center gap-3">
            <motion.h4
              className="display text-[clamp(1.5rem,4.6vw,3rem)] uppercase"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.7 }}
            >
              Built on
              <br />
              <span className="text-outline [-webkit-text-stroke-width:1px]">trust</span>
            </motion.h4>
            <motion.p
              className="max-w-[16rem] text-[9px] leading-relaxed text-muted @lg:text-[11px]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.35, duration: 0.7 }}
            >
              Steel and construction materials for large-scale projects —
              scheduled deliveries, direct supplier pricing.
            </motion.p>
            <motion.span
              className="w-fit rounded-full bg-accent px-3 py-1.5 text-[9px] font-semibold text-white @lg:text-[10px]"
              animate={
                reduce
                  ? undefined
                  : { boxShadow: ["0 0 0 0 rgba(111,149,255,0.6)", "0 0 0 10px rgba(111,149,255,0)"] }
              }
              transition={{ duration: 1.8, repeat: Infinity }}
            >
              Request a quote →
            </motion.span>
          </div>

          <div
            className="relative col-span-2 overflow-hidden rounded-xl border border-line"
            style={{
              backgroundImage:
                "repeating-linear-gradient(115deg, rgba(111,149,255,0.5) 0 6px, transparent 6px 22px), linear-gradient(160deg, #0b1a52, #2450ff)",
            }}
          >
            <div className="absolute -right-6 -bottom-6 h-24 w-24 rounded-full bg-cyan/40 blur-2xl" />
          </div>
        </div>

        {/* products */}
        <div className="grid grid-cols-4 gap-2 @lg:gap-3">
          {products.map((p, i) => (
            <motion.div
              key={p}
              className="rounded-lg border border-line bg-surface/70 px-2 py-2 @lg:px-3 @lg:py-3"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + i * 0.08, duration: 0.5 }}
            >
              <div className="mb-2 h-1 w-6 rounded bg-accent-bright/70" />
              <span className="text-[8px] leading-tight text-fg/80 @lg:text-[10px]">{p}</span>
            </motion.div>
          ))}
        </div>
      </div>

      {/* pointer that "clicks" the CTA */}
      {!reduce && (
        <motion.svg
          aria-hidden
          viewBox="0 0 24 24"
          className="pointer-events-none absolute h-5 w-5 fill-white stroke-bg"
          initial={{ left: "88%", top: "82%" }}
          animate={{
            left: ["88%", "24%", "24%", "24%", "88%"],
            top: ["82%", "62%", "62%", "62%", "82%"],
            scale: [1, 1, 0.8, 1, 1],
          }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", times: [0, 0.35, 0.42, 0.5, 1] }}
        >
          <path d="M5 3l14 7-6 2-2 6z" strokeWidth="1.2" strokeLinejoin="round" />
        </motion.svg>
      )}
    </Frame>
  );
}

/* ------------------------------------------------------------------ */
/* Private portal                                                      */
/* ------------------------------------------------------------------ */

const sidebar = ["Dashboard", "Quotations", "Orders", "Supplier POs", "Deliveries", "Reports"];
const columns = ["Inquiry", "Quoted", "Ordered", "Delivered"];
const cardCounts = [4, 3, 3, 2];
const stats = [
  { label: "Inquiries", value: "24" },
  { label: "Quotes sent", value: "18" },
  { label: "Orders", value: "9" },
];

function PrimegenPortal() {
  const reduce = useReducedMotion();

  return (
    <Frame
      url="portal · demo environment"
      badge={
        <span className="flex items-center gap-1 text-[9px] text-accent-bright">
          <svg viewBox="0 0 24 24" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
            <rect x="5" y="11" width="14" height="9" rx="2" />
            <path d="M8 11V8a4 4 0 018 0v3" />
          </svg>
          Private
        </span>
      }
    >
      <div className="grid h-full grid-cols-1 @md:grid-cols-[6rem_1fr] @lg:grid-cols-[7rem_1fr]">
        {/* sidebar */}
        <div className="hidden flex-col gap-1 border-r border-line bg-bg/40 p-2 @md:flex @lg:p-3">
          <div className="mb-2 flex items-center gap-1.5">
            <span className="h-3.5 w-3.5 rounded bg-accent" />
            <span className="text-[9px] font-semibold @lg:text-[10px]">ConstructX</span>
          </div>
          {sidebar.map((s, i) => (
            <span
              key={s}
              className={`truncate rounded-md px-1.5 py-1 text-[8px] @lg:text-[10px] ${
                i === 1 ? "bg-accent/25 text-fg" : "text-muted"
              }`}
            >
              {s}
            </span>
          ))}
        </div>

        {/* main */}
        <div className="flex min-w-0 flex-col gap-2.5 p-3 @lg:gap-3.5 @lg:p-4">
          <div className="flex items-center justify-between gap-2">
            <span className="truncate text-[10px] font-semibold @lg:text-xs">Quotation pipeline</span>
            <div className="flex shrink-0 gap-1.5">
              <span className="rounded-full border border-line px-2 py-0.5 text-[8px] text-muted @lg:text-[9px]">Admin</span>
              <span className="rounded-full bg-cyan/15 px-2 py-0.5 text-[8px] text-cyan @lg:text-[9px]">Sample data</span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {stats.map((s, i) => (
              <motion.div
                key={s.label}
                className="rounded-lg border border-line bg-surface/70 p-2 @lg:p-2.5"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 + i * 0.08 }}
              >
                <div className="display text-base @lg:text-xl">{s.value}</div>
                <div className="mt-1 truncate text-[8px] text-muted @lg:text-[9px]">{s.label}</div>
              </motion.div>
            ))}
          </div>

          {/* pipeline */}
          <div className="relative grid flex-1 grid-cols-4 gap-2">
            {columns.map((c, ci) => (
              <div key={c} className="flex flex-col gap-1.5 rounded-lg border border-line/70 bg-bg/40 p-1.5 @lg:p-2">
                <span className="truncate text-[8px] tracking-tight text-muted uppercase @lg:tracking-wide @lg:text-[9px]">{c}</span>
                {Array.from({ length: cardCounts[ci] }, (_, k) => k).map((k) => (
                  <motion.div
                    key={k}
                    className="rounded-md bg-surface p-1.5"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 + ci * 0.1 + k * 0.08 }}
                  >
                    <div className="h-1 w-4/5 rounded bg-fg/25" />
                    <div className="mt-1.5 h-1 w-1/2 rounded bg-fg/12" />
                  </motion.div>
                ))}
              </div>
            ))}

            {/* a quote travelling through the pipeline */}
            {!reduce && (
              <motion.div
                aria-hidden
                className="pointer-events-none absolute top-[1.6rem] w-[calc(25%-0.4rem)] rounded-md border border-accent-bright bg-accent/80 p-1.5 shadow-[0_0_24px_rgba(111,149,255,0.6)] @lg:top-[1.9rem]"
                initial={{ left: "0%", opacity: 0 }}
                animate={{
                  left: ["0%", "25%", "50%", "75%", "75%"],
                  opacity: [0, 1, 1, 1, 0],
                }}
                transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", times: [0, 0.25, 0.5, 0.75, 1] }}
              >
                <div className="h-1 w-4/5 rounded bg-white/90" />
                <div className="mt-1.5 h-1 w-1/2 rounded bg-white/50" />
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </Frame>
  );
}


/* ------------------------------------------------------------------ */
/* Clinic — public booking website (light, editorial)                  */
/* ------------------------------------------------------------------ */

const slots = ["9:00 AM", "10:30 AM", "1:00 PM", "3:30 PM"];
const NEUTRAL = { bg: "#faf8f5", fg: "#1f1a17" };
const PICKED = { bg: "#1f1a17", fg: "#fffff0" };

/** Keyframe times for "selected between a and b" over one loop. */
const window_ = (a: number, b: number) => [0, a, a + 0.02, b, b + 0.02, 1];
const pulse = (on: string, off: string) => [off, off, on, on, off, off];

function ClinicWebsite() {
  const reduce = useReducedMotion();

  return (
    <Frame url="clinic-x-app.netlify.app">
      <div className="absolute inset-0 flex flex-col bg-[#f6f3ee] text-[#1f1a17]">
        {/* nav */}
        <div className="flex items-center justify-between px-4 py-3 @lg:px-6">
          <span className="font-serif text-[10px] tracking-[0.28em] uppercase @lg:text-xs">Premium Clinic</span>
          <div className="hidden gap-4 text-[9px] text-[#6b6259] @md:flex">
            <span>Services</span>
            <span>Specialists</span>
            <span>Contact</span>
          </div>
          <span className="rounded-full bg-[#1f1a17] px-3 py-1 text-[8px] text-white @lg:text-[9px]">Book now</span>
        </div>

        {/* hero + booking card */}
        <div className="grid flex-1 grid-cols-5 gap-3 px-4 pb-3 @lg:gap-4 @lg:px-6">
          <div className="col-span-3 flex flex-col justify-center gap-2.5">
            <motion.h4
              className="font-serif text-[clamp(1.25rem,3.8vw,2.5rem)] leading-[1.05] font-light tracking-tight"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.7 }}
            >
              The Art of
              <br />
              <em className="text-[#6b6259]">Rejuvenation.</em>
            </motion.h4>
            <motion.p
              className="max-w-[15rem] text-[8px] leading-relaxed text-[#6b6259] @lg:text-[10px]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.35, duration: 0.7 }}
            >
              Clinical treatments and advanced dermal care — pick a time and you’re booked, with reminders by email.
            </motion.p>
            <div className="flex gap-2">
              <span className="rounded-full bg-[#1f1a17] px-2.5 py-1.5 text-[8px] text-white @lg:text-[9px]">Book an appointment</span>
              <span className="rounded-full border border-[#d9d1c5] px-2.5 py-1.5 text-[8px] @lg:text-[9px]">Our services</span>
            </div>
          </div>

          <div className="relative col-span-2 self-center rounded-xl border border-[#e4ddd3] bg-white p-2.5 shadow-sm @lg:p-3">
            <div className="text-[7px] tracking-[0.2em] text-[#6b6259] uppercase @lg:text-[8px]">Choose a time</div>
            <div className="mt-2 grid grid-cols-2 gap-1.5">
              {slots.map((slot, i) => {
                const anim =
                  reduce || i > 1
                    ? undefined
                    : {
                        backgroundColor: pulse(PICKED.bg, NEUTRAL.bg),
                        color: pulse(PICKED.fg, NEUTRAL.fg),
                      };
                const times = i === 0 ? window_(0.1, 0.25) : window_(0.3, 0.85);
                const staticPick = reduce && i === 1;
                return (
                  <motion.span
                    key={slot}
                    className="rounded-md border border-[#e4ddd3] py-1.5 text-center text-[8px] @lg:text-[9px]"
                    style={{
                      backgroundColor: staticPick ? PICKED.bg : NEUTRAL.bg,
                      color: staticPick ? PICKED.fg : NEUTRAL.fg,
                    }}
                    animate={anim}
                    transition={{ duration: 8, repeat: Infinity, ease: "linear", times }}
                  >
                    {slot}
                  </motion.span>
                );
              })}
            </div>
            <motion.div
              className="mt-2 flex items-center justify-center gap-1 rounded-md bg-[#e8f1ea] py-1.5 text-[8px] font-medium text-[#2f6b45] @lg:text-[9px]"
              style={reduce ? { opacity: 1 } : undefined}
              initial={{ opacity: 0 }}
              animate={reduce ? undefined : { opacity: [0, 0, 1, 1, 0, 0], y: [4, 4, 0, 0, 0, 4] }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear", times: [0, 0.4, 0.46, 0.85, 0.9, 1] }}
            >
              ✓ Appointment confirmed
            </motion.div>
          </div>
        </div>

        {/* services */}
        <div className="grid grid-cols-3 gap-2 border-t border-[#e4ddd3] px-4 py-2.5 @lg:px-6 @lg:py-3">
          {[
            ["Clinical treatments", "Book online"],
            ["Advanced dermal", "Book online"],
            ["Skin consultation", "Book online"],
          ].map(([name, mins]) => (
            <div key={name} className="min-w-0">
              <div className="truncate font-serif text-[9px] @lg:text-[11px]">{name}</div>
              <div className="text-[7px] text-[#6b6259] @lg:text-[9px]">{mins}</div>
            </div>
          ))}
        </div>
      </div>
    </Frame>
  );
}

/* ------------------------------------------------------------------ */
/* Clinic — staff portal                                               */
/* ------------------------------------------------------------------ */

const clinicNav = ["Schedule", "Patients", "Analytics", "Reports", "Import"];
const clinicStats = [
  { label: "Booked", value: "12" },
  { label: "Completed", value: "7" },
  { label: "Completion", value: "58%" },
];
const appointments = [
  { time: "09:00", who: "Patient A", what: "Consultation", status: "Completed" },
  { time: "10:30", who: "Patient B", what: "Facial treatment", status: "Completed" },
  { time: "13:00", who: "Patient C", what: "Skin analysis", status: "Confirmed", cycle: true },
  { time: "15:30", who: "Patient D", what: "Follow-up", status: "Confirmed" },
];

const chipTone: Record<string, string> = {
  Completed: "bg-cyan/15 text-cyan",
  Confirmed: "bg-accent/30 text-accent-bright",
  Pending: "bg-fg/10 text-muted",
};

function Chip({ status }: { status: string }) {
  return (
    <span className={`rounded-full px-2 py-0.5 text-[7px] @lg:text-[9px] ${chipTone[status]}`}>{status}</span>
  );
}

function ClinicPortal() {
  const reduce = useReducedMotion();

  return (
    <Frame
      url="portal · demo environment"
      badge={<span className="text-[9px] text-accent-bright">Staff</span>}
    >
      <div className="grid h-full grid-cols-1 @md:grid-cols-[6rem_1fr] @lg:grid-cols-[7rem_1fr]">
        <div className="hidden flex-col gap-1 border-r border-line bg-bg/40 p-2 @md:flex @lg:p-3">
          <div className="mb-2 flex items-center gap-1.5">
            <span className="h-3.5 w-3.5 rounded-full bg-cyan/70" />
            <span className="truncate text-[9px] font-semibold @lg:text-[10px]">Premium Clinic</span>
          </div>
          {clinicNav.map((n, i) => (
            <span
              key={n}
              className={`truncate rounded-md px-1.5 py-1 text-[8px] @lg:text-[10px] ${
                i === 0 ? "bg-accent/25 text-fg" : "text-muted"
              }`}
            >
              {n}
            </span>
          ))}
        </div>

        <div className="flex min-w-0 flex-col gap-2.5 p-3 @lg:gap-3.5 @lg:p-4">
          <div className="flex items-center justify-between gap-2">
            <span className="truncate text-[10px] font-semibold @lg:text-xs">Clinical schedule</span>
            <div className="flex shrink-0 rounded-full border border-line p-0.5 text-[8px] @lg:text-[9px]">
              <span className="rounded-full bg-accent/30 px-2 py-0.5">Today</span>
              <span className="px-2 py-0.5 text-muted">Next 7 days</span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {clinicStats.map((st, i) => (
              <motion.div
                key={st.label}
                className="rounded-lg border border-line bg-surface/70 p-2 @lg:p-2.5"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 + i * 0.08 }}
              >
                <div className="display text-base @lg:text-xl">{st.value}</div>
                <div className="mt-1 truncate text-[8px] text-muted @lg:text-[9px]">{st.label}</div>
              </motion.div>
            ))}
          </div>

          <div className="flex flex-1 flex-col gap-1.5">
            {appointments.map((a, i) => (
              <motion.div
                key={a.time}
                className="grid grid-cols-[2.6rem_1fr_auto] items-center gap-2 rounded-md border border-line/70 bg-surface/50 px-2 py-1.5 @lg:grid-cols-[3.2rem_1fr_1fr_auto]"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.09 }}
              >
                <span className="text-[8px] text-muted tabular-nums @lg:text-[10px]">{a.time}</span>
                <span className="truncate text-[8px] @lg:text-[10px]">{a.who}</span>
                <span className="hidden truncate text-[10px] text-muted @lg:block">{a.what}</span>
                {a.cycle && !reduce ? (
                  <span className="grid">
                    <motion.span
                      className="col-start-1 row-start-1 justify-self-end"
                      animate={{ opacity: [1, 1, 0, 0, 1] }}
                      transition={{ duration: 6, repeat: Infinity, times: [0, 0.4, 0.45, 0.95, 1] }}
                    >
                      <Chip status="Pending" />
                    </motion.span>
                    <motion.span
                      className="col-start-1 row-start-1 justify-self-end"
                      animate={{ opacity: [0, 0, 1, 1, 0] }}
                      transition={{ duration: 6, repeat: Infinity, times: [0, 0.4, 0.45, 0.95, 1] }}
                    >
                      <Chip status="Confirmed" />
                    </motion.span>
                  </span>
                ) : (
                  <Chip status={a.cycle ? "Confirmed" : a.status} />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </Frame>
  );
}


/* ------------------------------------------------------------------ */
/* Wedding — guest website (ivory, forest, brass)                      */
/* ------------------------------------------------------------------ */

const IVORY = "#f6f0e4";
const PAPER = "#fbf7ee";
const FOREST = "#1e3b2e";
const BRASS = "#b98a3e";
const wTabs = ["Home", "Memories", "Messages", "Quiz", "RSVP"];

function WeddingWebsite() {
  const reduce = useReducedMotion();
  const loop = { duration: 9, repeat: Infinity, ease: "linear" as const };
  // sealed -> code entered -> unlocked -> sealed again
  const times = [0, 0.3, 0.42, 0.85, 0.93, 1];

  return (
    <Frame url="demo · wedding website">
      <div className="absolute inset-0 flex flex-col" style={{ background: IVORY, color: "#17241d" }}>
        {/* top bar */}
        <div className="flex items-center justify-between px-4 py-2.5 @lg:px-6 @lg:py-3">
          <span className="font-serif text-[10px] tracking-[0.3em] uppercase @lg:text-xs" style={{ color: FOREST }}>
            N <span style={{ color: BRASS }}>&amp;</span> N
          </span>
          <div className="hidden gap-4 text-[9px] @md:flex" style={{ color: "#5b685f" }}>
            {wTabs.map((t) => (
              <span key={t}>{t}</span>
            ))}
          </div>
        </div>

        {/* invitation card */}
        <div className="relative mx-4 flex flex-1 items-center justify-center @lg:mx-8">
          <div
            className="relative w-full max-w-[19rem] overflow-hidden rounded-lg border px-4 py-4 text-center shadow-sm @lg:max-w-md @lg:py-10"
            style={{ background: PAPER, borderColor: "rgba(185,138,62,0.45)" }}
          >
            <motion.div
              style={reduce ? undefined : { filter: "blur(6px)" }}
              animate={
                reduce
                  ? undefined
                  : { filter: ["blur(6px)", "blur(6px)", "blur(0px)", "blur(0px)", "blur(6px)", "blur(6px)"] }
              }
              transition={{ ...loop, times }}
            >
              <div className="text-[7px] tracking-[0.3em] uppercase @lg:text-[10px]" style={{ color: BRASS }}>
                You’re invited
              </div>
              <div className="mt-1.5 font-serif text-xl leading-tight @lg:mt-2 @lg:text-4xl" style={{ color: FOREST }}>
                Name <span style={{ color: BRASS }}>&amp;</span> Name
              </div>
              <div className="mx-auto mt-2 h-px w-10" style={{ background: BRASS }} />
              <div className="mt-2 text-[8px] @lg:mt-3 @lg:text-xs" style={{ color: "#5b685f" }}>
                Saturday · Venue · 4:00 PM
              </div>
            </motion.div>

            {/* wax seal + code, fades away when "unlocked" */}
            <motion.div
              className="absolute inset-0 flex flex-col items-center justify-center gap-2"
              style={reduce ? { opacity: 0 } : undefined}
              animate={reduce ? undefined : { opacity: [1, 1, 0, 0, 1, 1] }}
              transition={{ ...loop, times }}
            >
              <span
                className="flex h-8 w-8 items-center justify-center rounded-full font-serif text-[10px] text-white shadow-md @lg:h-14 @lg:w-14 @lg:text-sm"
                style={{ background: `radial-gradient(circle at 35% 30%, #c99a4d, ${BRASS} 60%, #8f6528)` }}
              >
                N&amp;N
              </span>
              <span
                className="rounded-full border px-3 py-1 text-[8px] tracking-[0.25em] @lg:px-4 @lg:py-1.5 @lg:text-[11px]"
                style={{ borderColor: "rgba(30,59,46,0.3)", color: FOREST, background: "rgba(255,255,255,0.7)" }}
              >
                ••••-••••
              </span>
            </motion.div>
          </div>
        </div>

        {/* bottom tab bar, as on phones */}
        <div className="grid grid-cols-5 border-t px-2 py-1.5 text-center text-[7px] @lg:text-[9px]" style={{ borderColor: "rgba(30,59,46,0.15)", color: "#5b685f" }}>
          {wTabs.map((t, i) => (
            <span key={t} style={i === 0 ? { color: FOREST, fontWeight: 600 } : undefined}>
              {t}
            </span>
          ))}
        </div>
      </div>
    </Frame>
  );
}

/* ------------------------------------------------------------------ */
/* Wedding — couple dashboard                                          */
/* ------------------------------------------------------------------ */

const wNav = ["Wedding", "Guests", "Photos", "Messages", "Quiz", "Seating"];
const guests = [
  { name: "Guest A", table: "Table 1", rsvp: "Attending" },
  { name: "Guest B", table: "Table 2", rsvp: "Attending" },
  { name: "Guest C", table: "Table 2", rsvp: "Pending", cycle: true },
  { name: "Guest D", table: "Table 4", rsvp: "Declined" },
];
const rsvpTone: Record<string, string> = {
  Attending: "bg-[#3f7a55]/25 text-[#8fd3a8]",
  Pending: "bg-fg/10 text-muted",
  Declined: "bg-[#9b3b2e]/25 text-[#e8a397]",
};

function Toggle({ on, animate }: { on: boolean; animate?: boolean }) {
  const reduce = useReducedMotion();
  const cycling = animate && !reduce;
  return (
    <span className="relative inline-block h-3 w-6 shrink-0 rounded-full" style={{ background: on ? BRASS : "rgba(255,255,255,0.15)" }}>
      <motion.span
        className="absolute top-0.5 left-0.5 h-2 w-2 rounded-full bg-white"
        style={{ x: on ? 12 : 0 }}
        animate={cycling ? { x: [0, 0, 12, 12, 0] } : undefined}
        transition={{ duration: 7, repeat: Infinity, times: [0, 0.35, 0.4, 0.9, 1] }}
      />
    </span>
  );
}

function WeddingPortal() {
  const reduce = useReducedMotion();

  return (
    <Frame url="demo · couple dashboard" badge={<span className="text-[9px] text-accent-bright">Couple</span>}>
      <div className="grid h-full grid-cols-1 @md:grid-cols-[6rem_1fr] @lg:grid-cols-[7rem_1fr]">
        <div className="hidden flex-col gap-1 border-r border-line bg-bg/40 p-2 @md:flex @lg:p-3">
          <div className="mb-2 flex items-center gap-1.5">
            <span className="h-3.5 w-3.5 rounded-full" style={{ background: BRASS }} />
            <span className="truncate text-[9px] font-semibold @lg:text-[10px]">Wedding</span>
          </div>
          {wNav.slice(1).map((n, i) => (
            <span key={n} className={`truncate rounded-md px-1.5 py-1 text-[8px] @lg:text-[10px] ${i === 0 ? "bg-accent/25 text-fg" : "text-muted"}`}>
              {n}
            </span>
          ))}
        </div>

        <div className="flex min-w-0 flex-col gap-2 p-3 @lg:gap-3 @lg:p-4">
          <div className="flex items-center justify-between gap-2">
            <span className="truncate text-[10px] font-semibold @lg:text-xs">Guests & access</span>
            <span className="shrink-0 rounded-full bg-cyan/15 px-2 py-0.5 text-[8px] text-cyan @lg:text-[9px]">Sample data</span>
          </div>

          {/* switches */}
          <div className="grid gap-1.5 rounded-lg border border-line bg-surface/60 p-2 @lg:p-2.5">
            {[
              { label: "Open access", on: true, cycle: false },
              { label: "Quiz live", on: false, cycle: true },
              { label: "Publish seating plan", on: true, cycle: false },
            ].map((t) => (
              <div key={t.label} className="flex items-center justify-between gap-2 text-[8px] @lg:text-[10px]">
                <span className="truncate">{t.label}</span>
                <Toggle on={t.on} animate={t.cycle} />
              </div>
            ))}
          </div>

          {/* guests */}
          <div className="flex flex-1 flex-col gap-1.5">
            {guests.map((g, i) => (
              <motion.div
                key={g.name}
                className="grid grid-cols-[1fr_auto] items-center gap-2 rounded-md border border-line/70 bg-surface/50 px-2 py-1.5 @lg:grid-cols-[1fr_1fr_auto_auto]"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.25 + i * 0.09 }}
              >
                <span className="truncate text-[8px] @lg:text-[10px]">{g.name}</span>
                <span className="hidden truncate text-[10px] text-muted @lg:block">{g.table}</span>
                {/* QR hint */}
                <span className="hidden grid-cols-3 gap-px @lg:grid" aria-hidden>
                  {[1, 0, 1, 0, 1, 0, 1, 1, 0].map((b, k) => (
                    <i key={k} className={`h-[3px] w-[3px] ${b ? "bg-fg/70" : "bg-transparent"}`} />
                  ))}
                </span>
                {g.cycle && !reduce ? (
                  <span className="grid">
                    <motion.span
                      className="col-start-1 row-start-1 justify-self-end"
                      animate={{ opacity: [1, 1, 0, 0, 1] }}
                      transition={{ duration: 6, repeat: Infinity, times: [0, 0.4, 0.45, 0.95, 1] }}
                    >
                      <span className={`rounded-full px-2 py-0.5 text-[7px] @lg:text-[9px] ${rsvpTone.Pending}`}>Pending</span>
                    </motion.span>
                    <motion.span
                      className="col-start-1 row-start-1 justify-self-end"
                      animate={{ opacity: [0, 0, 1, 1, 0] }}
                      transition={{ duration: 6, repeat: Infinity, times: [0, 0.4, 0.45, 0.95, 1] }}
                    >
                      <span className={`rounded-full px-2 py-0.5 text-[7px] @lg:text-[9px] ${rsvpTone.Attending}`}>Attending</span>
                    </motion.span>
                  </span>
                ) : (
                  <span className={`rounded-full px-2 py-0.5 text-[7px] @lg:text-[9px] ${rsvpTone[g.cycle ? "Attending" : g.rsvp]}`}>
                    {g.cycle ? "Attending" : g.rsvp}
                  </span>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </Frame>
  );
}


/* ------------------------------------------------------------------ */
/* PDF Form Filler — client-side tool                                  */
/* ------------------------------------------------------------------ */

const pdfFields = [
  { label: "Full name", kind: "text" as const },
  { label: "Date", kind: "text" as const },
  { label: "I agree to the terms", kind: "check" as const },
  { label: "Signature", kind: "text" as const },
];

function FieldRow({ label, kind, delay }: { label: string; kind: "text" | "check"; delay: number }) {
  const reduce = useReducedMotion();
  const cycle = [0, 0.15, 0.2, 0.9, 1];

  return (
    <div className="flex items-center gap-2 rounded-md border border-line bg-surface/60 px-2 py-1.5">
      <span className="w-16 shrink-0 truncate text-[8px] text-muted @lg:w-24 @lg:text-[10px]">{label}</span>
      {kind === "check" ? (
        <motion.span
          className="flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-[3px] border border-accent-bright/60 text-[8px] text-cyan"
          initial={{ opacity: 0 }}
          animate={reduce ? { opacity: 1 } : { opacity: [0, 0, 1, 1, 0] }}
          transition={{ duration: 8, repeat: Infinity, delay, times: cycle }}
        >
          ✓
        </motion.span>
      ) : (
        <span className="relative h-3.5 flex-1 overflow-hidden rounded-[3px] bg-bg/60">
          <motion.span
            className="absolute inset-y-0 left-0 rounded-[3px] bg-accent-bright/70"
            initial={{ width: "0%" }}
            animate={reduce ? { width: "70%" } : { width: ["0%", "0%", "70%", "70%", "0%"] }}
            transition={{ duration: 8, repeat: Infinity, delay, times: cycle }}
          />
        </span>
      )}
    </div>
  );
}

function PdfFormFillerWebsite() {
  const reduce = useReducedMotion();

  return (
    <Frame url="pdf-forms-filler.netlify.app">
      <div className="grid h-full grid-cols-5 gap-3 p-4 @lg:gap-4 @lg:p-6">
        {/* the "PDF" */}
        <div className="col-span-2 flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-line bg-surface/40 p-3 text-center">
          <svg viewBox="0 0 24 24" className="h-7 w-7 text-accent-bright @lg:h-9 @lg:w-9" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
            <path d="M7 3h7l5 5v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Z" />
            <path d="M14 3v5h5" />
          </svg>
          <span className="text-[8px] text-fg @lg:text-[10px]">form.pdf</span>
          <span className="text-[7px] text-muted @lg:text-[9px]">4 fields detected</span>
        </div>

        {/* detected fields, filling in */}
        <div className="col-span-3 flex flex-col gap-1.5 @lg:gap-2">
          <span className="text-[8px] tracking-wide text-muted uppercase @lg:text-[10px]">Fill in the fields</span>
          {pdfFields.map((f, i) => (
            <FieldRow key={f.label} label={f.label} kind={f.kind} delay={i * 0.35} />
          ))}
          <motion.span
            className="mt-1.5 w-fit rounded-full bg-accent px-2.5 py-1.5 text-[8px] font-semibold text-white @lg:text-[9px]"
            animate={
              reduce
                ? undefined
                : { boxShadow: ["0 0 0 0 rgba(111,149,255,0.6)", "0 0 0 8px rgba(111,149,255,0)"] }
            }
            transition={{ duration: 1.8, repeat: Infinity }}
          >
            Save &amp; generate PDF
          </motion.span>
          <span className="text-[7px] text-muted @lg:text-[9px]">Runs in your browser — nothing is uploaded</span>
        </div>
      </div>
    </Frame>
  );
}

/* ------------------------------------------------------------------ */
/* Registry — each project picks its own artwork by slug               */
/* ------------------------------------------------------------------ */

const mocks: Record<string, { website: () => ReactNode; portal: () => ReactNode }> = {
  primegen: { website: () => <PrimegenWebsite />, portal: () => <PrimegenPortal /> },
  clinic: { website: () => <ClinicWebsite />, portal: () => <ClinicPortal /> },
  wedding: { website: () => <WeddingWebsite />, portal: () => <WeddingPortal /> },
  "pdf-form-filler": { website: () => <PdfFormFillerWebsite />, portal: () => null },
};

export function ProjectMock({ slug, kind }: { slug: string; kind: "website" | "portal" }) {
  const entry = mocks[slug];
  return entry ? <>{entry[kind]()}</> : null;
}
