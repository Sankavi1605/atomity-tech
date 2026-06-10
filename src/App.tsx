import React, { useState, useEffect, useRef, useCallback } from "react";

// ============================================================================
// PREMIUM GLASSMORPHISM THEME & STYLES
// ============================================================================
const glassPanel =
  "bg-white/20 backdrop-blur-[40px] border border-white/50 " +
  "shadow-[0_8px_32px_rgba(0,0,0,0.06),inset_0_1px_0_rgba(255,255,255,0.6)]";

const TOTAL_FRAMES = 224;
const TOTAL_SECTIONS = 8;
const BASE_URL =
  "https://pub-2c3b960ecc384ec79f19a7516c538574.r2.dev";
const frameUrl = (n: number) =>
  `${BASE_URL}/ezgif-frame-${String(n).padStart(3, "0")}.png`;

// ============================================================================
// MAIN APPLICATION — SCROLLYTELLING
// ============================================================================
export default function App() {
  const [currentFrame, setCurrentFrame] = useState(1);
  const [activeSection, setActiveSection] = useState(0);
  const rafRef = useRef(0);

  // Section 5 — Savings sliders
  const [cpuReq, setCpuReq] = useState(700);
  const [ramReq, setRamReq] = useState(5.0);

  // Section 6 — Terminal logs
  const [logs, setLogs] = useState([
    { time: "18:41:03", src: "AWS", msg: "Polling healthy Kubernetes nodes..." },
    { time: "18:41:12", src: "AZURE", msg: "Telemetry handshake verified" },
  ]);

  // ── Preload all frames on mount ────────────────────────────────────
  useEffect(() => {
    for (let i = 1; i <= TOTAL_FRAMES; i++) {
      const img = new Image();
      img.src = frameUrl(i);
    }
  }, []);

  // ── Scroll-driven frame + section tracking ─────────────────────────
  const onScroll = useCallback(() => {
    cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => {
      const scrollY = window.scrollY;
      const maxScroll =
        document.documentElement.scrollHeight - window.innerHeight;
      const progress = maxScroll > 0 ? scrollY / maxScroll : 0;

      // Map scroll progress to frame (1–224)
      const frame = Math.min(
        Math.round(progress * (TOTAL_FRAMES - 1)) + 1,
        TOTAL_FRAMES
      );
      setCurrentFrame(frame);

      // Map scroll progress to section (0–7)
      const section = Math.min(
        Math.floor(progress * TOTAL_SECTIONS),
        TOTAL_SECTIONS - 1
      );
      setActiveSection(section);
    });
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll(); // initial
    return () => window.removeEventListener("scroll", onScroll);
  }, [onScroll]);

  // ── Navigation ─────────────────────────────────────────────────────
  const scrollToSection = (i: number) => {
    const maxScroll =
      document.documentElement.scrollHeight - window.innerHeight;
    const target = (i / TOTAL_SECTIONS) * maxScroll;
    window.scrollTo({ top: target, behavior: "smooth" });
  };

  // ── Helpers ────────────────────────────────────────────────────────
  const savings = () => {
    const diff =
      700 * 0.12 + 5.0 * 24.5 - (cpuReq * 0.12 + ramReq * 24.5);
    return Math.max(0, 237.4 + diff).toFixed(2);
  };

  const sectionVisible = (i: number) => activeSection === i;

  const fade = (section: number) =>
    `transition-all duration-800 ease-[cubic-bezier(0.16,1,0.3,1)] ${
      sectionVisible(section)
        ? "opacity-100 translate-y-0"
        : "opacity-0 translate-y-8 pointer-events-none"
    }`;

  const nav = [
    "Brand",
    "Vision",
    "Control",
    "Topology",
    "Savings",
    "Console",
    "Metrics",
    "Launch",
  ];

  // ── Render ─────────────────────────────────────────────────────────
  return (
    <div className="relative text-slate-900 font-sans selection:bg-indigo-500/30 selection:text-indigo-900">
      {/* ── FIXED BACKGROUND — scroll-driven frame sequence ──── */}
      <img
        src={frameUrl(currentFrame)}
        alt=""
        className="fixed inset-0 w-[100vw] h-[100vh] object-cover object-center z-0 scale-105 blur-[4px]"
        draggable={false}
      />
      {/* ── DARK OVERLAY ─────────────────────────────────────── */}
      <div className="fixed inset-0 z-[1] bg-black/20 pointer-events-none" />

      {/* ── HEADER ───────────────────────────────────────────── */}
      <header className="fixed top-0 left-0 right-0 z-50 px-8 py-5 flex items-center justify-between border-b border-white/40 bg-white/20 backdrop-blur-[40px] shadow-[0_4px_30px_rgba(0,0,0,0.04),inset_0_1px_0_rgba(255,255,255,0.5)]">
        <div className="flex items-center space-x-12">
          <div
            className="text-xl font-extrabold tracking-tighter cursor-pointer"
            onClick={() => scrollToSection(0)}
          >
            ATOMITY
          </div>
          <nav className="hidden md:flex space-x-6 text-[10px] font-semibold uppercase tracking-widest text-slate-500">
            {nav.map((label, i) => (
              <button
                key={i}
                onClick={() => scrollToSection(i)}
                className={`transition-colors duration-300 hover:text-slate-900 ${
                  activeSection === i ? "text-slate-900" : ""
                }`}
              >
                {label}
              </button>
            ))}
          </nav>
        </div>
        <div className="hidden sm:flex items-center space-x-2 text-[10px] font-mono font-bold text-slate-400">
          <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
          <span>ONLINE</span>
        </div>
      </header>

      {/* ── SCROLLABLE CONTENT SECTIONS ──────────────────────── */}

      {/* 1 · BRAND */}
      <section className="relative z-10 w-full h-screen flex flex-col justify-center items-center px-8">
        <div className={`${glassPanel} p-12 sm:p-16 rounded-[3rem] text-center space-y-4 max-w-lg`}>
          <div className={`${fade(0)} text-6xl sm:text-8xl font-extrabold tracking-tighter`}>
            ATOMITY
          </div>
          <p className={`${fade(0)} text-sm tracking-[0.3em] uppercase text-slate-500 font-semibold`}>
            Cloud Infrastructure Intelligence
          </p>
        </div>
      </section>

      {/* 2 · VISION */}
      <section className="relative z-10 w-full h-screen flex flex-col justify-center items-start px-8 sm:px-16 lg:px-24">
        <div className={`${glassPanel} p-10 sm:p-14 rounded-[2.5rem] max-w-2xl space-y-6`}>
          <h2 className={`${fade(1)} text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.05]`}>
            One pane of glass<br />for every cloud.
          </h2>
          <p className={`${fade(1)} text-base sm:text-lg text-slate-600 font-medium leading-relaxed`}>
            See everything. Control everything. From a single screen.
          </p>
        </div>
      </section>

      {/* 3 · CONTROL PLANE */}
      <section className="relative z-10 w-full h-screen flex flex-col justify-center items-end px-8 sm:px-16 lg:px-24">
        <div className={`${glassPanel} p-10 sm:p-12 rounded-[2.5rem] max-w-lg space-y-4`}>
          <span className={`${fade(2)} inline-flex px-3 py-1 rounded-full bg-white/15 backdrop-blur-[20px] border border-white/40 text-[10px] font-bold tracking-widest uppercase text-slate-500 shadow-[inset_0_1px_0_rgba(255,255,255,0.3)]`}>
            Control Plane
          </span>
          <h2 className={`${fade(2)} text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight`}>
            Unified orchestration.
          </h2>
          <p className={`${fade(2)} text-sm text-slate-600 font-medium leading-relaxed`}>
            Manage AWS, Azure, and GCP from one dashboard — no context switching.
          </p>
        </div>
      </section>

      {/* 4 · TOPOLOGY */}
      <section className="relative z-10 w-full h-screen flex flex-col justify-center items-start px-8 sm:px-16 lg:px-24">
        <div className={`${glassPanel} p-10 sm:p-12 rounded-[2.5rem] max-w-lg space-y-4`}>
          <span className={`${fade(3)} inline-flex px-3 py-1 rounded-full bg-white/15 backdrop-blur-[20px] border border-white/40 text-[10px] font-bold tracking-widest uppercase text-slate-500 shadow-[inset_0_1px_0_rgba(255,255,255,0.3)]`}>
            Topology
          </span>
          <h2 className={`${fade(3)} text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight`}>
            Live workload map.
          </h2>
          <p className={`${fade(3)} text-sm text-slate-600 font-medium leading-relaxed`}>
            Visualize traffic flow, latency, and failover paths across regions in real time.
          </p>
        </div>
      </section>

      {/* 5 · SAVINGS */}
      <section className="relative z-10 w-full h-screen flex flex-col justify-center items-center px-8">
        <div className={`${glassPanel} p-10 sm:p-12 rounded-[2.5rem] max-w-sm w-full space-y-6`}>
          <h2 className={`${fade(4)} text-3xl font-extrabold tracking-tight text-center`}>
            Optimize. Save.
          </h2>
          <div className={`${fade(4)} space-y-4`}>
            <div className="bg-white/15 backdrop-blur-[30px] border border-white/40 p-4 rounded-2xl shadow-[inset_0_1px_0_rgba(255,255,255,0.4)]">
              <div className="flex justify-between mb-2 text-sm font-bold">
                <span>CPU Request</span>
                <span className="font-mono text-slate-500">{cpuReq}m</span>
              </div>
              <input
                type="range" min={100} max={1000} step={10} value={cpuReq}
                onChange={(e) => setCpuReq(Number(e.target.value))}
                className="w-full accent-slate-800 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
              />
            </div>
            <div className="bg-white/15 backdrop-blur-[30px] border border-white/40 p-4 rounded-2xl shadow-[inset_0_1px_0_rgba(255,255,255,0.4)]">
              <div className="flex justify-between mb-2 text-sm font-bold">
                <span>Memory</span>
                <span className="font-mono text-slate-500">{ramReq} GiB</span>
              </div>
              <input
                type="range" min={1} max={10} step={0.1} value={ramReq}
                onChange={(e) => setRamReq(Number(e.target.value))}
                className="w-full accent-slate-800 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
              />
            </div>
            <div className="pt-3 border-t border-slate-300/50 text-center">
              <span className={`${fade(4)} text-xl font-bold text-emerald-600 font-mono`}>${savings()}/mo</span>
            </div>
          </div>
        </div>
      </section>

      {/* 6 · CONSOLE */}
      <section className="relative z-10 w-full h-screen flex flex-col justify-center items-center px-8">
        <div className={`${fade(5)} w-full max-w-2xl space-y-6`}>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-center">
            Developer Console
          </h2>
          <div className="bg-slate-900/90 backdrop-blur-3xl rounded-3xl p-6 shadow-[0_30px_60px_rgba(0,0,0,0.3)] border border-slate-700/50 min-h-[320px] flex flex-col">
            <div className="flex space-x-2 mb-4">
              <div className="w-3 h-3 rounded-full bg-rose-500" />
              <div className="w-3 h-3 rounded-full bg-amber-500" />
              <div className="w-3 h-3 rounded-full bg-emerald-500" />
            </div>
            <div className="flex-1 overflow-y-auto space-y-2 font-mono text-xs sm:text-sm text-slate-300">
              <div className="text-emerald-400 mb-3">$ tail -f /var/log/atomity-core.log</div>
              {logs.map((l, i) => (
                <div key={i} className="flex gap-3">
                  <span className="text-slate-500 shrink-0">[{l.time}]</span>
                  <span className="text-sky-400 font-bold shrink-0">[{l.src}]</span>
                  <span>{l.msg}</span>
                </div>
              ))}
              <div className="w-2 h-4 bg-slate-400 animate-pulse mt-3" />
            </div>
          </div>
          <div className="flex justify-center gap-3">
            <button
              onClick={() =>
                setLogs((p) => [
                  { time: new Date().toLocaleTimeString(), src: "SYS", msg: "Applying config..." },
                  ...p,
                ])
              }
              className="px-5 py-2.5 bg-slate-900 text-white rounded-xl font-bold text-sm shadow-lg hover:scale-105 transition-transform"
            >
              Deploy
            </button>
            <button
              onClick={() => setLogs([])}
              className="px-5 py-2.5 bg-white/50 backdrop-blur-xl border border-white/80 rounded-xl font-bold text-sm text-slate-800 hover:bg-white/70 transition-all"
            >
              Clear
            </button>
          </div>
        </div>
      </section>

      {/* 7 · METRICS */}
      <section className="relative z-10 w-full h-screen flex flex-col justify-center items-start px-8 sm:px-16 lg:px-24">
        <div className={`${glassPanel} p-10 sm:p-14 rounded-[2.5rem] max-w-2xl`}>
          <h2 className={`${fade(6)} text-3xl sm:text-4xl font-extrabold tracking-tight mb-10`}>
            By the numbers.
          </h2>
          <div className={`${fade(6)} grid grid-cols-2 sm:grid-cols-4 gap-8`}>
            {[
              { val: "99.99%", label: "Uptime" },
              { val: "<40ms", label: "Latency" },
              { val: "3", label: "Cloud Providers" },
              { val: "37%", label: "Avg. Savings" },
            ].map((m, i) => (
              <div key={i} className="text-center">
                <div className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
                  {m.val}
                </div>
                <div className="text-[11px] font-semibold uppercase tracking-widest text-slate-500 mt-1">
                  {m.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8 · LAUNCH CTA */}
      <section className="relative z-10 w-full h-screen flex flex-col justify-center items-center px-8">
        <div className={`${glassPanel} p-12 sm:p-16 rounded-[3rem] text-center space-y-6 max-w-lg`}>
          <h2 className={`${fade(7)} text-4xl sm:text-5xl font-extrabold tracking-tight`}>
            Ready to launch?
          </h2>
          <p className={`${fade(7)} text-base text-slate-600 font-medium`}>
            Start your free trial. No credit card required.
          </p>
          <button className={`${fade(7)} px-8 py-4 bg-slate-900 text-white rounded-2xl font-bold text-sm shadow-xl hover:scale-105 transition-transform`}>
            Get Started
          </button>
        </div>
      </section>

      {/* ── FOOTER BAR ───────────────────────────────────────── */}
      <div className="fixed bottom-0 left-0 right-0 z-50 h-8 bg-black/60 backdrop-blur-xl border-t border-white/10 flex items-center justify-center">
        <span className="text-[9px] font-mono font-semibold uppercase tracking-[0.25em] text-white/40">
          Atomity · Cloud Infrastructure Intelligence
        </span>
      </div>
    </div>
  );
}
