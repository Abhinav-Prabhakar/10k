"use client"

import { useState } from "react"
import DraggableGrid, { GridItem } from "@/components/DraggableGrid"
import { Sparkles, Compass, Clock, ShieldCheck, ArrowRight, X, Calendar, Zap, Layers, Flame, BookOpen } from "lucide-react"

export default function Home() {
  const [selectedSkill, setSelectedSkill] = useState<GridItem | null>(null)
  const [cadenceMinutes, setCadenceMinutes] = useState<number>(60)
  const [priorHours, setPriorHours] = useState<number>(0)

  // Calculate completion date based on daily practice minutes and prior hours
  const remainingHours = Math.max(0, 10000 - priorHours)
  const daysRequired = Math.ceil(remainingHours / (cadenceMinutes / 60))
  const targetDate = new Date()
  targetDate.setDate(targetDate.getDate() + daysRequired)
  const formattedDate = targetDate.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  })

  return (
    <div className="relative min-h-screen bg-[#070709] text-zinc-100 overflow-hidden selection:bg-amber-500/30 selection:text-amber-200">
      {/* Top Floating Glass Navigation */}
      <header className="fixed top-0 left-0 right-0 z-40 px-6 py-4 flex items-center justify-between pointer-events-none">
        <div className="flex items-center gap-3 bg-zinc-900/80 backdrop-blur-xl border border-zinc-800/80 rounded-full px-4 py-2 pointer-events-auto shadow-2xl">
          <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-amber-500 to-orange-400 flex items-center justify-center font-bold text-xs text-black tracking-tighter shadow-inner">
            10k
          </div>
          <span className="font-semibold text-sm tracking-tight text-zinc-100">
            10,000 Hours
          </span>
          <span className="hidden sm:inline-block text-xs text-zinc-400 border-l border-zinc-700/60 pl-3">
            One Currency: <strong className="text-zinc-200 font-medium">Deliberate Time</strong>
          </span>
        </div>

        <div className="flex items-center gap-2 pointer-events-auto">
          <div className="hidden md:flex items-center gap-2 bg-zinc-900/80 backdrop-blur-xl border border-zinc-800/80 rounded-full px-3 py-1.5 text-xs text-zinc-400">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Bank Never Decays</span>
          </div>
          <a
            href="#skills"
            className="flex items-center gap-1.5 text-xs font-medium bg-zinc-100 text-zinc-950 hover:bg-white px-4 py-2 rounded-full transition shadow-lg active:scale-95"
          >
            <span>Explore Skills</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </a>
        </div>
      </header>

      {/* Hero Overlay Section */}
      <main className="relative z-10 flex flex-col items-center pt-24 pb-6 px-4 text-center max-w-4xl mx-auto pointer-events-none">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900/90 border border-zinc-800 text-xs text-zinc-300 backdrop-blur-md mb-4 pointer-events-auto shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Deliberate Practice Ledger & Ultralearning Pedagogy</span>
        </div>

        <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white mb-4 pointer-events-auto leading-[1.08]">
          Control the input. <br className="hidden sm:inline" />
          <span className="bg-gradient-to-r from-amber-200 via-orange-300 to-amber-500 bg-clip-text text-transparent">
            Trust the output.
          </span>
        </h1>

        <p className="text-sm sm:text-base md:text-lg text-zinc-400 max-w-2xl mx-auto leading-relaxed mb-6 pointer-events-auto">
          Every goal app measures outcomes that lag for months. 10k measures the only honest input you control: <strong className="text-zinc-200 font-medium">accumulated hours</strong>. Drag the canvas below to explore masteries.
        </p>

        {/* Floating Quick Feature Badges */}
        <div className="flex flex-wrap justify-center gap-2 pointer-events-auto mb-3">
          <span className="px-3 py-1 rounded-md bg-zinc-900/80 border border-zinc-800 text-xs text-zinc-400 flex items-center gap-1.5">
            <Clock className="w-3 h-3 text-amber-400" /> 10-Minute Floor
          </span>
          <span className="px-3 py-1 rounded-md bg-zinc-900/80 border border-zinc-800 text-xs text-zinc-400 flex items-center gap-1.5">
            <ShieldCheck className="w-3 h-3 text-emerald-400" /> No Guilt Gaps
          </span>
          <span className="px-3 py-1 rounded-md bg-zinc-900/80 border border-zinc-800 text-xs text-zinc-400 flex items-center gap-1.5">
            <Layers className="w-3 h-3 text-sky-400" /> 11 Milestone Cards
          </span>
          <span className="px-3 py-1 rounded-md bg-zinc-900/80 border border-zinc-800 text-xs text-zinc-400 flex items-center gap-1.5">
            <Compass className="w-3 h-3 text-purple-400" /> Scott Young Roadmap
          </span>
        </div>
      </main>

      {/* Interactive Draggable Grid Container */}
      <section id="skills" className="relative w-full h-[64vh] min-h-[500px] border-y border-zinc-800/80 bg-zinc-950">
        <div className="absolute top-4 left-6 z-20 pointer-events-none flex items-center gap-2 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 text-xs text-zinc-300">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
          <span>Interactive Canvas — Drag or Scroll horizontally/vertically</span>
        </div>

        <DraggableGrid
          columns={12}
          imageWidth={260}
          imageHeight={340}
          gap={4}
          rounded={6}
          enableWheel={true}
          onItemClick={(item) => setSelectedSkill(item)}
        />
      </section>

      {/* Bottom Philosophy Bar */}
      <footer className="relative z-20 max-w-6xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
        <div className="p-6 rounded-2xl bg-zinc-900/40 border border-zinc-800/60 backdrop-blur-sm">
          <div className="w-9 h-9 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mb-4 text-amber-400">
            <Clock className="w-5 h-5" />
          </div>
          <h3 className="text-base font-semibold text-zinc-100 mb-2">The Bank Never Decays</h3>
          <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
            Hours don’t expire. Gaps are forgiven by design. Comebacks carry no guilt — your hours never reset to zero.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-zinc-900/40 border border-zinc-800/60 backdrop-blur-sm">
          <div className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-4 text-emerald-400">
            <Calendar className="w-5 h-5" />
          </div>
          <h3 className="text-base font-semibold text-zinc-100 mb-2">Pace & The Known Date</h3>
          <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
            The headline number is the finish date. Every session moves that date closer on your calendar. Pure arithmetic reinforcement.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-zinc-900/40 border border-zinc-800/60 backdrop-blur-sm">
          <div className="w-9 h-9 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center mb-4 text-purple-400">
            <BookOpen className="w-5 h-5" />
          </div>
          <h3 className="text-base font-semibold text-zinc-100 mb-2">Real Ultralearning Pedagogy</h3>
          <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
            Generated against Scott Young’s 9 principles: directness, drill, retrieval, metalearning, and post-session weakest-link refinement.
          </p>
        </div>
      </footer>

      {/* Selected Skill Roadmap Modal / Drawer */}
      {selectedSkill && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-xl bg-zinc-900 border border-zinc-700/80 rounded-3xl p-6 sm:p-8 shadow-2xl overflow-hidden">
            {/* Close Button */}
            <button
              onClick={() => setSelectedSkill(null)}
              className="absolute top-5 right-5 p-2 rounded-full bg-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-700 transition"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Header */}
            <div className="flex items-center gap-3 mb-4">
              <span className="px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-amber-500/10 border border-amber-500/30 text-amber-300">
                {selectedSkill.category || "Mastery Path"}
              </span>
              <span className="text-xs text-zinc-400">10,000 Hour Goal</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">
              {selectedSkill.title}
            </h2>

            <p className="text-sm text-zinc-300 mb-6 italic">
              &ldquo;{selectedSkill.milestonePreview}&rdquo;
            </p>

            {/* Cadence & Date Simulator */}
            <div className="bg-zinc-950/80 rounded-2xl p-4 sm:p-5 border border-zinc-800 mb-6">
              <div className="flex justify-between items-center mb-3">
                <span className="text-xs font-medium text-zinc-400 uppercase tracking-wider">
                  Daily Cadence
                </span>
                <span className="text-xs font-semibold text-amber-400">
                  {cadenceMinutes} min / day
                </span>
              </div>

              <div className="grid grid-cols-4 gap-2 mb-4">
                {[15, 30, 45, 60, 90, 120, 180].slice(0, 4).map((mins) => (
                  <button
                    key={mins}
                    onClick={() => setCadenceMinutes(mins)}
                    className={`py-2 text-xs rounded-lg font-medium transition border ${
                      cadenceMinutes === mins
                        ? "bg-amber-500 text-black border-amber-400 font-semibold"
                        : "bg-zinc-900 border-zinc-800 text-zinc-300 hover:border-zinc-700"
                    }`}
                  >
                    {mins}m
                  </button>
                ))}
              </div>

              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-medium text-zinc-400 uppercase tracking-wider">
                  Prior Experience (Honest Start)
                </span>
                <span className="text-xs font-semibold text-zinc-300">
                  {priorHours} hours banked
                </span>
              </div>

              <input
                type="range"
                min="0"
                max="2000"
                step="25"
                value={priorHours}
                onChange={(e) => setPriorHours(Number(e.target.value))}
                className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-amber-500 mb-4"
              />

              <div className="flex items-center justify-between pt-3 border-t border-zinc-800/80">
                <div className="text-left">
                  <span className="block text-[11px] text-zinc-500 uppercase tracking-wider">
                    Calculated 10,000h Date
                  </span>
                  <span className="text-lg font-bold text-emerald-400">
                    {formattedDate}
                  </span>
                </div>
                <div className="text-right">
                  <span className="block text-[11px] text-zinc-500 uppercase tracking-wider">
                    Remaining
                  </span>
                  <span className="text-sm font-semibold text-zinc-200">
                    {remainingHours.toLocaleString()} hours
                  </span>
                </div>
              </div>
            </div>

            {/* Key Milestones Teaser */}
            <div className="mb-6">
              <h4 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2.5">
                Milestone Sequence
              </h4>
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
                {["10h", "50h", "100h", "250h", "500h", "1k", "2.5k", "5k", "10k"].map((m, idx) => (
                  <div
                    key={m}
                    className={`px-2.5 py-1 rounded-md border text-[11px] font-mono whitespace-nowrap ${
                      idx === 0
                        ? "bg-amber-500/20 border-amber-500/40 text-amber-300"
                        : "bg-zinc-950 border-zinc-800/80 text-zinc-400"
                    }`}
                  >
                    {m}
                  </div>
                ))}
              </div>
            </div>

            {/* Action */}
            <div className="flex gap-3">
              <button
                onClick={() => {
                  alert(`Starting practice journey for ${selectedSkill.title}! Goal completion: ${formattedDate}`)
                  setSelectedSkill(null)
                }}
                className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-black font-semibold text-sm transition shadow-lg flex items-center justify-center gap-2 active:scale-98"
              >
                <span>Commit to {selectedSkill.title}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
