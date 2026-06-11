import React, { useState, useEffect, useRef, useCallback } from "react";

// ============================================================================
// CONSTANTS & THEME
// ============================================================================
const TOTAL_FRAMES = 224;
const TOTAL_SECTIONS = 8;
const BASE_URL =
  "https://pub-2c3b960ecc384ec79f19a7516c538574.r2.dev";
const frameUrl = (n: number) =>
  `${BASE_URL}/ezgif-frame-${String(n).padStart(3, "0")}.png`;

/** Dark-on-dark frosted glass — lets background bleed through */
const glass =
  "bg-white/[0.04] backdrop-blur-xl border border-white/[0.08] " +
  "shadow-[0_8px_32px_rgba(0,0,0,0.25),inset_0_1px_0_rgba(255,255,255,0.06)]";

/** Inner card / nested glass */
const glassInner =
  "bg-white/[0.06] backdrop-blur-lg border border-white/[0.1] " +
  "shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]";

/** Header bar — dark tinted glass */
const glassHeader =
  "bg-black/50 backdrop-blur-2xl border-b border-white/[0.06]";

const NAV = [
  "Brand",
  "Vision",
  "Control",
  "Topology",
  "Savings",
  "Console",
  "Metrics",
  "Launch",
];

// ============================================================================
// SCROLL-DRIVEN REVEAL HELPERS
// ============================================================================

/**
 * Returns the per-section scroll progress (0 → 1) and a
 * normalized eased value for child stagger based on `delay`.
 */
function sectionT(sp: number, section: number, delay: number) {
  const h = 1 / TOTAL_SECTIONS;
  const raw = (sp - section * h) / h;
  const clamped = Math.max(0, Math.min(1, raw));
  const start = delay;
  const end = Math.min(delay + 0.35, 1);
  const t = clamped < start ? 0 : clamped > end ? 1 : (clamped - start) / (end - start);
  return 1 - Math.pow(1 - t, 3);
}

/** Slide-up reveal */
function rUp(sp: number, s: number, d = 0): React.CSSProperties {
  const t = sectionT(sp, s, d);
  return { opacity: t, transform: `translateY(${40 * (1 - t)}px)` };
}

/** Slide-from-left reveal */
function rLeft(sp: number, s: number, d = 0): React.CSSProperties {
  const t = sectionT(sp, s, d);
  return { opacity: t, transform: `translateX(${-50 * (1 - t)}px)` };
}

/** Slide-from-right reveal */
function rRight(sp: number, s: number, d = 0): React.CSSProperties {
  const t = sectionT(sp, s, d);
  return { opacity: t, transform: `translateX(${50 * (1 - t)}px)` };
}

/** Scale-in reveal */
function rScale(sp: number, s: number, d = 0): React.CSSProperties {
  const t = sectionT(sp, s, d);
  return { opacity: t, transform: `scale(${0.92 + 0.08 * t})` };
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================
export default function App() {
  // ── Core state ──────────────────────────────────────────────
  const [currentFrame, setCurrentFrame] = useState(1);
  const [activeSection, setActiveSection] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [scrollDir, setScrollDir] = useState<"up" | "down">("up");
  const rafRef = useRef(0);
  const prevYRef = useRef(0);
  const [isLoaded, setIsLoaded] = useState(false);

  // ── Section 4 — Savings sliders ─────────────────────────────
  const [cpuReq, setCpuReq] = useState(700);
  const [ramReq, setRamReq] = useState(5.0);

  // ── Section 5 — Console logs ────────────────────────────────
  const [logs, setLogs] = useState([
    { time: "18:41:03", src: "AWS", msg: "Polling healthy Kubernetes nodes..." },
    { time: "18:41:12", src: "AZURE", msg: "Telemetry handshake verified" },
  ]);

  // ── Preload all frames ──────────────────────────────────────
  useEffect(() => {
    for (let i = 1; i <= TOTAL_FRAMES; i++) {
      const img = new Image();
      img.src = frameUrl(i);
    }
  }, []);
  useEffect(() => {
    const t = setTimeout(() => setIsLoaded(true), 400);
    return () => clearTimeout(t);
  }, []);

  // ── Scroll handler ──────────────────────────────────────────
  const onScroll = useCallback(() => {
    cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => {
      const y = window.scrollY;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const p = max > 0 ? y / max : 0;

      setCurrentFrame(
        Math.min(Math.round(p * (TOTAL_FRAMES - 1)) + 1, TOTAL_FRAMES)
      );
      setActiveSection(
        Math.min(Math.floor(p * TOTAL_SECTIONS), TOTAL_SECTIONS - 1)
      );
      setScrollProgress(p);

      if (y > prevYRef.current + 3) setScrollDir("down");
      else if (y < prevYRef.current - 3) setScrollDir("up");
      prevYRef.current = y;
    });
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [onScroll]);

  // ── Navigation ──────────────────────────────────────────────
  const scrollToSection = (i: number) => {
    const max =
      document.documentElement.scrollHeight - window.innerHeight;
    window.scrollTo({ top: (i / TOTAL_SECTIONS) * max, behavior: "smooth" });
  };

  // ── Savings calc ────────────────────────────────────────────
  const savings = () => {
    const diff =
      700 * 0.12 + 5.0 * 24.5 - (cpuReq * 0.12 + ramReq * 24.5);
    return Math.max(0, 237.4 + diff).toFixed(2);
  };

  // Header auto-hide: show when scrolling up or near top
  const headerVisible = scrollDir === "up" || scrollProgress < 0.02;

  // Alias for brevity in JSX
  const sp = scrollProgress;

  // ── Render ──────────────────────────────────────────────────
  return (
    <div className="relative text-white font-sans selection:bg-indigo-500/30 selection:text-indigo-100">

      {/* ════════════════════════════════════════════════════════════
          FIXED BACKGROUND — scroll-driven frame sequence
         ════════════════════════════════════════════════════════════ */}
      <img
        src={frameUrl(currentFrame)}
        alt=""
        className="fixed inset-0 w-screen h-screen object-cover z-0 scale-110 blur-[2px]"
        draggable={false}
      />
      <div className="fixed inset-0 z-[1] bg-black/30 pointer-events-none" />

      {/* ════════════════════════════════════════════════════════════
          SCROLL PROGRESS BAR
         ════════════════════════════════════════════════════════════ */}
      <div className="fixed top-0 left-0 right-0 z-[60] h-[2px] bg-white/[0.03]">
        <div
          className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"
          style={{ width: `${scrollProgress * 100}%` }}
        />
      </div>

      {/* ════════════════════════════════════════════════════════════
          HEADER — dark glass, auto-hide on scroll down
         ════════════════════════════════════════════════════════════ */}
      <header
        className={`fixed top-[2px] left-0 right-0 z-50 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          headerVisible ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        <div className={`${glassHeader} px-6 lg:px-10 py-3.5 flex items-center justify-between`}>
          <div className="flex items-center gap-8">
            <button
              onClick={() => scrollToSection(0)}
              className="text-base font-black tracking-tighter text-white hover:opacity-70 transition-opacity"
            >
              ATOMITY
            </button>
            <nav className="hidden md:flex items-center gap-0.5">
              {NAV.map((label, i) => (
                <button
                  key={i}
                  onClick={() => scrollToSection(i)}
                  className={`px-3 py-1.5 rounded-lg text-[10px] font-semibold uppercase tracking-widest transition-all duration-300 ${
                    activeSection === i
                      ? "bg-white/10 text-white"
                      : "text-white/30 hover:text-white/60 hover:bg-white/[0.04]"
                  }`}
                >
                  {label}
                </button>
              ))}
            </nav>
          </div>
          <div className="hidden sm:flex items-center gap-2 text-[10px] font-mono font-bold text-emerald-400/70">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
            </span>
            ONLINE
          </div>
        </div>
      </header>

      {/* ════════════════════════════════════════════════════════════
          SIDE DOT NAVIGATION
         ════════════════════════════════════════════════════════════ */}
      <div className="fixed right-5 top-1/2 -translate-y-1/2 z-50 hidden lg:flex flex-col items-center gap-3">
        {NAV.map((_, i) => (
          <button
            key={i}
            onClick={() => scrollToSection(i)}
            aria-label={NAV[i]}
            className={`rounded-full transition-all duration-500 ${
              activeSection === i
                ? "w-2 h-2 bg-white shadow-[0_0_12px_rgba(255,255,255,0.5)]"
                : "w-1.5 h-1.5 bg-white/15 hover:bg-white/35"
            }`}
          />
        ))}
      </div>

      {/* ════════════════════════════════════════════════════════════
          SECTIONS — scroll-driven reveal
         ════════════════════════════════════════════════════════════ */}

      {/* 0 · BRAND — center, scale-in */}
      <section className="relative z-10 w-full h-screen flex flex-col justify-center items-center px-6">
        <div className={`${glass} p-14 sm:p-20 rounded-[3rem] text-center max-w-xl`}>
          <h1
            className={`text-7xl sm:text-[7rem] font-black tracking-[-0.04em] leading-none bg-gradient-to-b from-white via-white/90 to-white/50 bg-clip-text text-transparent ${
              isLoaded ? "animate-scale-in" : "opacity-0"
            }`}
          >
            ATOMITY
          </h1>
          <p
            className={`mt-6 text-xs sm:text-sm tracking-[0.35em] uppercase text-white/40 font-semibold ${
              isLoaded ? "animate-fade-in-up" : "opacity-0"
            }`}
            style={{ animationDelay: "200ms", animationFillMode: "both" }}
          >
            Cloud Infrastructure Intelligence
          </p>
        </div>
      </section>

      {/* 1 · VISION — left-aligned, slide from left */}
      <section className="relative z-10 w-full h-screen flex flex-col justify-center items-start px-8 sm:px-16 lg:px-24">
        <div className={`${glass} p-10 sm:p-14 rounded-[2.5rem] max-w-2xl space-y-6`}>
          <h2
            style={rLeft(sp, 1, 0.05)}
            className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.08]"
          >
            One pane of glass
            <br />
            for every cloud.
          </h2>
          <p
            style={rLeft(sp, 1, 0.15)}
            className="text-base sm:text-lg text-white/45 font-medium leading-relaxed"
          >
            See everything. Control everything. From a single screen.
          </p>
        </div>
      </section>

      {/* 2 · CONTROL PLANE — right-aligned, slide from right */}
      <section className="relative z-10 w-full h-screen flex flex-col justify-center items-end px-8 sm:px-16 lg:px-24">
        <div className={`${glass} p-10 sm:p-12 rounded-[2.5rem] max-w-lg space-y-5`}>
          <span
            style={rRight(sp, 2, 0.05)}
            className="inline-flex px-3.5 py-1 rounded-full bg-white/[0.06] border border-white/[0.1] text-[10px] font-bold tracking-widest uppercase text-white/50"
          >
            Control Plane
          </span>
          <h2
            style={rRight(sp, 2, 0.1)}
            className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight"
          >
            Unified orchestration.
          </h2>
          <p
            style={rRight(sp, 2, 0.18)}
            className="text-sm text-white/40 font-medium leading-relaxed"
          >
            Manage AWS, Azure, and GCP from one dashboard — no context
            switching.
          </p>
        </div>
      </section>

      {/* 3 · TOPOLOGY — left-aligned, slide from left */}
      <section className="relative z-10 w-full h-screen flex flex-col justify-center items-start px-8 sm:px-16 lg:px-24">
        <div className={`${glass} p-10 sm:p-12 rounded-[2.5rem] max-w-lg space-y-5`}>
          <span
            style={rLeft(sp, 3, 0.05)}
            className="inline-flex px-3.5 py-1 rounded-full bg-white/[0.06] border border-white/[0.1] text-[10px] font-bold tracking-widest uppercase text-white/50"
          >
            Topology
          </span>
          <h2
            style={rLeft(sp, 3, 0.1)}
            className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight"
          >
            Live workload map.
          </h2>
          <p
            style={rLeft(sp, 3, 0.18)}
            className="text-sm text-white/40 font-medium leading-relaxed"
          >
            Visualize traffic flow, latency, and failover paths across regions
            in real time.
          </p>
        </div>
      </section>

      {/* 4 · SAVINGS — center, scale-in with sliders */}
      <section className="relative z-10 w-full h-screen flex flex-col justify-center items-center px-6">
        <div className={`${glass} p-10 sm:p-12 rounded-[2.5rem] max-w-sm w-full space-y-6`}>
          <h2
            style={rScale(sp, 4, 0.02)}
            className="text-3xl font-extrabold tracking-tight text-center"
          >
            Optimize. Save.
          </h2>
          <div style={rUp(sp, 4, 0.1)} className="space-y-4">
            {/* CPU */}
            <div className={`${glassInner} p-4 rounded-2xl`}>
              <div className="flex justify-between mb-3 text-sm font-bold">
                <span className="text-white/75">CPU Request</span>
                <span className="font-mono text-white/40">{cpuReq}m</span>
              </div>
              <input
                type="range"
                min={100}
                max={1000}
                step={10}
                value={cpuReq}
                onChange={(e) => setCpuReq(Number(e.target.value))}
                className="w-full"
              />
            </div>
            {/* Memory */}
            <div className={`${glassInner} p-4 rounded-2xl`}>
              <div className="flex justify-between mb-3 text-sm font-bold">
                <span className="text-white/75">Memory</span>
                <span className="font-mono text-white/40">{ramReq} GiB</span>
              </div>
              <input
                type="range"
                min={1}
                max={10}
                step={0.1}
                value={ramReq}
                onChange={(e) => setRamReq(Number(e.target.value))}
                className="w-full"
              />
            </div>
            {/* Savings result */}
            <div className="pt-4 border-t border-white/[0.06] text-center">
              <span className="text-xl font-bold text-emerald-400 font-mono">
                ${savings()}/mo
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 5 · CONSOLE — center, no glass card, terminal aesthetic */}
      <section className="relative z-10 w-full h-screen flex flex-col justify-center items-center px-6">
        <div style={rUp(sp, 5, 0.02)} className="w-full max-w-2xl space-y-5">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-center">
            Developer Console
          </h2>
          <div className="bg-black/50 backdrop-blur-xl rounded-2xl border border-white/[0.06] overflow-hidden shadow-[0_30px_60px_rgba(0,0,0,0.5)]">
            {/* Title bar */}
            <div className="flex items-center gap-2 px-4 py-3 bg-white/[0.02] border-b border-white/[0.06]">
              <div className="w-3 h-3 rounded-full bg-rose-500/80" />
              <div className="w-3 h-3 rounded-full bg-amber-500/80" />
              <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
              <span className="ml-3 text-[10px] font-mono text-white/25">
                atomity-core.log
              </span>
            </div>
            {/* Logs */}
            <div className="p-5 space-y-2 font-mono text-xs sm:text-sm text-white/65 min-h-[260px]">
              <div className="text-emerald-400/70 mb-4">
                $ tail -f /var/log/atomity-core.log
              </div>
              {logs.map((l, i) => (
                <div key={i} className="flex gap-3">
                  <span className="text-white/20 shrink-0">[{l.time}]</span>
                  <span className="text-sky-400/80 font-bold shrink-0">
                    [{l.src}]
                  </span>
                  <span>{l.msg}</span>
                </div>
              ))}
              <div className="w-2 h-4 bg-white/25 animate-pulse mt-3" />
            </div>
          </div>
          {/* Buttons */}
          <div className="flex justify-center gap-3">
            <button
              onClick={() =>
                setLogs((p) => [
                  {
                    time: new Date().toLocaleTimeString(),
                    src: "SYS",
                    msg: "Applying config...",
                  },
                  ...p,
                ])
              }
              className="px-6 py-2.5 bg-white/10 hover:bg-white/15 border border-white/10 rounded-xl text-sm font-semibold text-white transition-all duration-300 hover:shadow-[0_0_20px_rgba(255,255,255,0.08)]"
            >
              Deploy
            </button>
            <button
              onClick={() => setLogs([])}
              className="px-6 py-2.5 bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.06] rounded-xl text-sm font-semibold text-white/55 transition-all duration-300"
            >
              Clear
            </button>
          </div>
        </div>
      </section>

      {/* 6 · METRICS — left-aligned, staggered slide from left */}
      <section className="relative z-10 w-full h-screen flex flex-col justify-center items-start px-8 sm:px-16 lg:px-24">
        <div className={`${glass} p-10 sm:p-14 rounded-[2.5rem] max-w-2xl`}>
          <h2
            style={rLeft(sp, 6, 0.02)}
            className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-10"
          >
            By the numbers.
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8">
            {[
              { val: "99.99%", label: "Uptime" },
              { val: "<40ms", label: "Latency" },
              { val: "3", label: "Providers" },
              { val: "37%", label: "Avg. Savings" },
            ].map((m, i) => (
              <div
                key={i}
                style={rLeft(sp, 6, 0.08 + i * 0.06)}
                className="text-center"
              >
                <div className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
                  {m.val}
                </div>
                <div className="text-[11px] font-semibold uppercase tracking-widest text-white/30 mt-2">
                  {m.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7 · LAUNCH CTA — center, scale-in */}
      <section className="relative z-10 w-full h-screen flex flex-col justify-center items-center px-6">
        <div className={`${glass} p-14 sm:p-20 rounded-[3rem] text-center space-y-6 max-w-lg`}>
          <h2
            style={rScale(sp, 7, 0.02)}
            className="text-4xl sm:text-5xl font-extrabold tracking-tight"
          >
            Ready to launch?
          </h2>
          <p
            style={rUp(sp, 7, 0.1)}
            className="text-base text-white/40 font-medium"
          >
            Start your free trial. No credit card required.
          </p>
          <button
            style={rUp(sp, 7, 0.18)}
            className="px-10 py-4 bg-white text-black rounded-2xl font-bold text-sm hover:bg-white/90 transition-all duration-300 hover:shadow-[0_0_40px_rgba(255,255,255,0.15)] hover:scale-105"
          >
            Get Started
          </button>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          FOOTER
         ════════════════════════════════════════════════════════════ */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-black/50 backdrop-blur-xl border-t border-white/[0.06]">
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-center">
          <span className="text-[10px] font-mono font-semibold uppercase tracking-[0.3em] text-white/20">
            Atomity · Cloud Infrastructure Intelligence
          </span>
        </div>
      </div>
    </div>
  );
}
