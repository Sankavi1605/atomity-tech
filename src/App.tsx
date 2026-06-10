import React, { useState, useEffect, useRef } from 'react';

// ============================================================================
// PREMIUM GLASSMORPHISM THEME & STYLES
// ============================================================================
const glassPanel =
  "bg-white/20 backdrop-blur-[40px] border border-white/50 " +
  "shadow-[0_8px_32px_rgba(0,0,0,0.06),inset_0_1px_0_rgba(255,255,255,0.6)]";

// ============================================================================
// MAIN APPLICATION — 8 FULL-SCREEN SECTIONS
// ============================================================================
export default function App() {
  const [activeSection, setActiveSection] = useState(0);
  const totalSections = 8;
  const isTransitioning = useRef(false);
  const touchStartY = useRef(0);

  // Section 5 — Savings sliders
  const [cpuReq, setCpuReq] = useState(700);
  const [ramReq, setRamReq] = useState(5.0);

  // Section 6 — Terminal logs
  const [logs, setLogs] = useState([
    { time: "18:41:03", src: "AWS", msg: "Polling healthy Kubernetes nodes..." },
    { time: "18:41:12", src: "AZURE", msg: "Telemetry handshake verified" },
  ]);

  // ── Navigation ───────────────────────────────────────────────────
  const goTo = (i: number) => {
    if (i >= 0 && i < totalSections) setActiveSection(i);
  };

  useEffect(() => {
    const lock = (fn: () => void) => {
      if (isTransitioning.current) return;
      isTransitioning.current = true;
      fn();
      setTimeout(() => (isTransitioning.current = false), 900);
    };

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      if (Math.abs(e.deltaY) < 30) return;
      lock(() => {
        if (e.deltaY > 0) goTo(activeSection + 1);
        else goTo(activeSection - 1);
      });
    };

    const onTouchStart = (e: TouchEvent) => {
      touchStartY.current = e.touches[0].clientY;
    };
    const onTouchMove = (e: TouchEvent) => {
      const dy = touchStartY.current - e.touches[0].clientY;
      if (Math.abs(dy) < 40) return;
      lock(() => {
        if (dy > 0) goTo(activeSection + 1);
        else goTo(activeSection - 1);
      });
    };

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown") lock(() => goTo(activeSection + 1));
      else if (e.key === "ArrowUp") lock(() => goTo(activeSection - 1));
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("keydown", onKey);
    };
  }, [activeSection]);

  // ── Helpers ──────────────────────────────────────────────────────
  const savings = () => {
    const diff = (700 * 0.12 + 5.0 * 24.5) - (cpuReq * 0.12 + ramReq * 24.5);
    return Math.max(0, 237.4 + diff).toFixed(2);
  };

  const anim = (slide: number, delay = "") =>
    `transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] ${
      activeSection === slide ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
    } ${delay}`;

  const nav = ["Brand", "Vision", "Control", "Topology", "Savings", "Console", "Metrics", "Launch"];

  // ── Render ───────────────────────────────────────────────────────
  return (
    <div className="relative h-screen w-screen text-slate-900 font-sans overflow-hidden bg-transparent selection:bg-indigo-500/30 selection:text-indigo-900">
      {/* ── DECORATIVE GRADIENT ORBS ─────────────────────────── */}
      <div className="glass-orbs" />

      {/* ── HEADER ──────────────────────────────────────────────── */}
      <header className="fixed top-0 left-0 right-0 z-50 px-8 py-5 flex items-center justify-between border-b border-white/40 bg-white/20 backdrop-blur-[40px] shadow-[0_4px_30px_rgba(0,0,0,0.04),inset_0_1px_0_rgba(255,255,255,0.5)]">
        <div className="flex items-center space-x-12">
          <div className="text-xl font-extrabold tracking-tighter cursor-pointer" onClick={() => goTo(0)}>
            ATOMITY
          </div>
          <nav className="hidden md:flex space-x-6 text-[10px] font-semibold uppercase tracking-widest text-slate-500">
            {nav.map((label, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                className={`transition-colors duration-300 hover:text-slate-900 ${activeSection === i ? "text-slate-900" : ""}`}
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

      {/* ── SCROLL TRACK ────────────────────────────────────────── */}
      <div
        className="relative w-full h-full will-change-transform"
        style={{
          transform: `translateY(-${activeSection * 100}vh)`,
          transition: "transform 1000ms cubic-bezier(0.25,1,0.2,1)",
        }}
      >

        {/* ── 1 · BRAND ──────────────────────────────────────── */}
        <section className="w-full h-screen flex flex-col justify-center items-center px-8">
          <div className={`${glassPanel} p-12 sm:p-16 rounded-[3rem] text-center space-y-4 max-w-lg`}>
            <div className={`${anim(0, "delay-100")} text-6xl sm:text-8xl font-extrabold tracking-tighter`}>
              ATOMITY
            </div>
            <p className={`${anim(0, "delay-300")} text-sm tracking-[0.3em] uppercase text-slate-500 font-semibold`}>
              Cloud Infrastructure Intelligence
            </p>
          </div>
        </section>

        {/* ── 2 · VISION ─────────────────────────────────────── */}
        <section className="w-full h-screen flex flex-col justify-center items-start px-8 sm:px-16 lg:px-24">
          <div className={`${glassPanel} p-10 sm:p-14 rounded-[2.5rem] max-w-2xl space-y-6`}>
            <h2 className={`${anim(1, "delay-100")} text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.05]`}>
              One pane of glass<br />for every cloud.
            </h2>
            <p className={`${anim(1, "delay-200")} text-base sm:text-lg text-slate-600 font-medium leading-relaxed`}>
              See everything. Control everything. From a single screen.
            </p>
          </div>
        </section>

        {/* ── 3 · CONTROL PLANE ──────────────────────────────── */}
        <section className="w-full h-screen flex flex-col justify-center items-end px-8 sm:px-16 lg:px-24">
          <div className={`${glassPanel} p-10 sm:p-12 rounded-[2.5rem] max-w-lg space-y-4`}>
            <span className={`${anim(2)} inline-flex px-3 py-1 rounded-full bg-white/15 backdrop-blur-[20px] border border-white/40 text-[10px] font-bold tracking-widest uppercase text-slate-500 shadow-[inset_0_1px_0_rgba(255,255,255,0.3)]`}>
              Control Plane
            </span>
            <h2 className={`${anim(2, "delay-100")} text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight`}>
              Unified orchestration.
            </h2>
            <p className={`${anim(2, "delay-200")} text-sm text-slate-600 font-medium leading-relaxed`}>
              Manage AWS, Azure, and GCP from one dashboard — no context switching.
            </p>
          </div>
        </section>

        {/* ── 4 · TOPOLOGY ───────────────────────────────────── */}
        <section className="w-full h-screen flex flex-col justify-center items-start px-8 sm:px-16 lg:px-24">
          <div className={`${glassPanel} p-10 sm:p-12 rounded-[2.5rem] max-w-lg space-y-4`}>
            <span className={`${anim(3)} inline-flex px-3 py-1 rounded-full bg-white/15 backdrop-blur-[20px] border border-white/40 text-[10px] font-bold tracking-widest uppercase text-slate-500 shadow-[inset_0_1px_0_rgba(255,255,255,0.3)]`}>
              Topology
            </span>
            <h2 className={`${anim(3, "delay-100")} text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight`}>
              Live workload map.
            </h2>
            <p className={`${anim(3, "delay-200")} text-sm text-slate-600 font-medium leading-relaxed`}>
              Visualize traffic flow, latency, and failover paths across regions in real time.
            </p>
          </div>
        </section>

        {/* ── 5 · SAVINGS ────────────────────────────────────── */}
        <section className="w-full h-screen flex flex-col justify-center items-center px-8">
          <div className={`${anim(4)} ${glassPanel} p-10 sm:p-12 rounded-[2.5rem] max-w-sm w-full space-y-6`}>
            <h2 className="text-3xl font-extrabold tracking-tight text-center">
              Optimize. Save.
            </h2>

            <div className="space-y-4">
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
                <span className="text-xl font-bold text-emerald-600 font-mono">${savings()}/mo</span>
              </div>
            </div>
          </div>
        </section>

        {/* ── 6 · CONSOLE ────────────────────────────────────── */}
        <section className="w-full h-screen flex flex-col justify-center items-center px-8">
          <div className={`${anim(5)} w-full max-w-2xl space-y-6`}>
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

        {/* ── 7 · METRICS ────────────────────────────────────── */}
        <section className="w-full h-screen flex flex-col justify-center items-start px-8 sm:px-16 lg:px-24">
          <div className={`${glassPanel} p-10 sm:p-14 rounded-[2.5rem] max-w-2xl`}>
            <h2 className={`${anim(6, "delay-100")} text-3xl sm:text-4xl font-extrabold tracking-tight mb-10`}>
              By the numbers.
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-8">
              {[
                { val: "99.99%", label: "Uptime" },
                { val: "<40ms", label: "Latency" },
                { val: "3", label: "Cloud Providers" },
                { val: "37%", label: "Avg. Savings" },
              ].map((m, i) => (
                <div key={i} className={`${anim(6, `delay-${(i + 2) * 100}`)} text-center`}>
                  <div className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">{m.val}</div>
                  <div className="text-[11px] font-semibold uppercase tracking-widest text-slate-500 mt-1">{m.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── 8 · LAUNCH CTA ─────────────────────────────────── */}
        <section className="w-full h-screen flex flex-col justify-center items-center px-8">
          <div className={`${glassPanel} p-12 sm:p-16 rounded-[3rem] text-center space-y-6 max-w-lg`}>
            <h2 className={`${anim(7, "delay-100")} text-4xl sm:text-5xl font-extrabold tracking-tight`}>
              Ready to launch?
            </h2>
            <p className={`${anim(7, "delay-200")} text-base text-slate-600 font-medium`}>
              Start your free trial. No credit card required.
            </p>
            <button className={`${anim(7, "delay-300")} px-8 py-4 bg-slate-900 text-white rounded-2xl font-bold text-sm shadow-xl hover:scale-105 transition-transform`}>
              Get Started
            </button>
          </div>
        </section>

      </div>
    </div>
  );
}
