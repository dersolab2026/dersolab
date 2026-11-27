'use client'

import React from 'react'
import { Atom, Flame, Sparkles, Thermometer, Droplet, Zap, Play, AlertTriangle } from 'lucide-react'
import type { ChemExperiment, ChemExperimentStep, VisualPreset } from './chemExperimentsData'

export interface BenchSimState {
  temp: number
  ph: number
  vol: number
  gasMl: number
  voltage: number
  liquidColor: string
  precipitateColor: string | null
  flameColor: string | null
  foamLevel: number
  burnerOn: boolean
  sandboxVessel: 'beher' | 'erlen' | 'balon_joje' | 'deney_tupu'
  safetyWarning: string | null
}

interface ChemBenchStageProps {
  experiment: ChemExperiment
  isSandbox: boolean
  currentStepIndex: number
  isCompleted: boolean
  activeStep: ChemExperimentStep | null
  sim: BenchSimState
  isAutoPlaying: boolean
  fastForward: boolean
  microMode: boolean
  mobileZoom: boolean
  onTriggerStep: () => void
  onSelectSandboxVessel?: (v: 'beher' | 'erlen' | 'balon_joje' | 'deney_tupu') => void
}

export function ChemBenchStage({
  experiment,
  isSandbox,
  currentStepIndex,
  isCompleted,
  activeStep,
  sim,
  isAutoPlaying,
  fastForward,
  microMode,
  mobileZoom,
  onTriggerStep,
  onSelectSandboxVessel,
}: ChemBenchStageProps) {
  const preset: VisualPreset = isSandbox ? 'beaker_heat' : experiment.visualPreset
  const liquidFillPct = Math.min(92, Math.max(12, Math.round((sim.vol / 180) * 100)))
  const liquidHeight = Math.round((liquidFillPct / 100) * 136)
  const liquidY = 318 - liquidHeight
  const pulseDuration = fastForward ? '0.45s' : '1.4s'

  return (
    <div className="relative rounded-2xl bg-[#060B14] border border-slate-800 overflow-hidden shadow-inner">
      {/* Top Bench Floating Bar (Autoplay Narration + Fast Badge) */}
      <div className="px-3.5 py-2.5 bg-slate-950/90 border-b border-slate-800/80 flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-2 min-w-0">
          {isAutoPlaying ? (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 font-bold animate-pulse">
              <Play className="w-3 h-3 fill-current" />
              <span>Otomatik Oynatılıyor ({fastForward ? '4×' : '1×'})</span>
            </span>
          ) : isSandbox ? (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Serbest Tezgâh Modu — Malzeme tepsisinden istediğini ekle!</span>
            </span>
          ) : isCompleted ? (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-bold">
              ✓ Deney Tamamlandı ({experiment.steps.length}/{experiment.steps.length})
            </span>
          ) : (
            <span className="text-slate-200 font-semibold truncate">
              <span className="text-amber-400 font-black mr-1.5">
                Adım {currentStepIndex + 1}/{experiment.steps.length}:
              </span>
              {activeStep?.instruction}
            </span>
          )}
        </div>

        {/* Live Sensor Readouts */}
        <div className="flex flex-wrap items-center gap-1.5 font-mono text-[11px]">
          <span className="px-2 py-0.5 rounded-lg bg-slate-900 border border-rose-500/30 text-rose-300 inline-flex items-center gap-1">
            <Thermometer className="w-3 h-3" />
            {sim.temp.toFixed(1)} °C
          </span>
          <span className="px-2 py-0.5 rounded-lg bg-slate-900 border border-emerald-500/30 text-emerald-300 inline-flex items-center gap-1">
            pH {sim.ph.toFixed(2)}
          </span>
          <span className="px-2 py-0.5 rounded-lg bg-slate-900 border border-sky-500/30 text-sky-300 inline-flex items-center gap-1">
            <Droplet className="w-3 h-3" />
            {sim.vol} mL
          </span>
          {sim.gasMl > 0 && (
            <span className="px-2 py-0.5 rounded-lg bg-slate-900 border border-violet-500/30 text-violet-300">
              Gaz: {sim.gasMl} mL
            </span>
          )}
          {sim.voltage > 0 && (
            <span className="px-2 py-0.5 rounded-lg bg-slate-900 border border-amber-500/30 text-amber-300 inline-flex items-center gap-1">
              <Zap className="w-3 h-3" />
              {sim.voltage.toFixed(2)} V
            </span>
          )}
        </div>
      </div>

      {/* Safety Alert Banner (Sandbox or high hazard) */}
      {sim.safetyWarning && (
        <div className="px-4 py-2 bg-rose-950/80 border-b border-rose-500/40 text-rose-200 text-xs font-bold flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
          <span>{sim.safetyWarning}</span>
        </div>
      )}

      {/* Responsive SVG Workbench (Zero Horizontal Overflow!) */}
      <div className="relative w-full">
        <svg
          viewBox={mobileZoom ? '180 40 560 360' : '0 0 920 430'}
          className="w-full h-auto max-h-[430px] select-none transition-all duration-500"
          role="img"
          aria-label={experiment.title}
        >
          <defs>
            <linearGradient id="benchGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#1e293b" />
              <stop offset="100%" stopColor="#0f172a" />
            </linearGradient>
            <linearGradient id="glassShine" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="rgba(255,255,255,0.22)" />
              <stop offset="30%" stopColor="rgba(255,255,255,0.03)" />
              <stop offset="85%" stopColor="rgba(255,255,255,0.06)" />
              <stop offset="100%" stopColor="rgba(255,255,255,0.2)" />
            </linearGradient>
            <radialGradient id="flameGlow" cx="50%" cy="65%" r="55%">
              <stop offset="0%" stopColor={sim.flameColor || '#38bdf8'} stopOpacity="0.95" />
              <stop offset="65%" stopColor={sim.flameColor || '#0284c7'} stopOpacity="0.45" />
              <stop offset="100%" stopColor={sim.flameColor || '#0284c7'} stopOpacity="0" />
            </radialGradient>
            <pattern id="labGrid" width="28" height="28" patternUnits="userSpaceOnUse">
              <path d="M 28 0 L 0 0 0 28" fill="none" stroke="rgba(148,163,184,0.08)" strokeWidth="1" />
            </pattern>
          </defs>

          {/* Background grid + lab table */}
          <rect x="0" y="0" width="920" height="430" fill="#070C17" />
          <rect x="0" y="0" width="920" height="350" fill="url(#labGrid)" />
          <rect x="0" y="346" width="920" height="84" fill="url(#benchGrad)" />
          <line x1="0" y1="346" x2="920" y2="346" stroke="#334155" strokeWidth="2.5" />

          {/* Ambient glow under active apparatus */}
          <ellipse cx="460" cy="352" rx="220" ry="12" fill="rgba(6,182,212,0.12)" />

          {/* ── PRESET 1: BEAKER HEAT / SHOW DRAMATIC / STANDARD REACTION ── */}
          {(preset === 'beaker_heat' || preset === 'show_dramatic') && (
            <g
              onClick={onTriggerStep}
              className="cursor-pointer"
            >
              {/* Tripod & Wire Gauze when burner active or heating experiment */}
              {(sim.burnerOn || experiment.materials.includes('sacayagi')) && (
                <g>
                  <line x1="382" y1="346" x2="405" y2="296" stroke="#64748b" strokeWidth="5" strokeLinecap="round" />
                  <line x1="538" y1="346" x2="515" y2="296" stroke="#64748b" strokeWidth="5" strokeLinecap="round" />
                  <rect x="392" y="292" width="136" height="6" rx="3" fill="#475569" />
                </g>
              )}

              {/* Bunsen Burner */}
              {(sim.burnerOn || experiment.materials.includes('bek') || isSandbox) && (
                <g transform="translate(460, 346)">
                  <rect x="-26" y="-8" width="52" height="8" rx="3" fill="#475569" />
                  <rect x="-8" y="-36" width="16" height="28" fill="#64748b" />
                  {sim.burnerOn && (
                    <g>
                      <ellipse cx="0" cy="-58" rx="22" ry="28" fill="url(#flameGlow)" />
                      <path
                        d="M 0 -36 Q -14 -54 0 -76 Q 14 -54 0 -36 Z"
                        fill={sim.flameColor || '#38bdf8'}
                        opacity="0.9"
                      >
                        <animate attributeName="opacity" values="0.78;1;0.82" dur={pulseDuration} repeatCount="indefinite" />
                      </path>
                    </g>
                  )}
                </g>
              )}

              {/* Active Glassware Vessel (translated up if on tripod) */}
              <g transform={`translate(460, ${sim.burnerOn || experiment.materials.includes('sacayagi') ? -24 : 0})`}>
                {/* Foam eruption tower for Elephant Toothpaste / Sugar Carbon / Thermite */}
                {sim.foamLevel > 0 && (
                  <g>
                    <path
                      d={`M -48 ${318 - liquidHeight} C -65 ${260 - sim.foamLevel * 1.4}, -25 ${175 - sim.foamLevel * 1.1}, 0 ${145 - sim.foamLevel * 0.9} C 35 ${175 - sim.foamLevel * 1.1}, 65 ${260 - sim.foamLevel * 1.4}, 48 ${318 - liquidHeight} Z`}
                      fill={sim.precipitateColor || sim.liquidColor || '#fde047'}
                      opacity="0.92"
                    >
                      <animate attributeName="opacity" values="0.86;1;0.88" dur={pulseDuration} repeatCount="indefinite" />
                    </path>
                    {experiment.id === 'termit-tepkimesi' && (
                      <g>
                        <circle cx="-25" cy="140" r="4" fill="#fef08a" />
                        <circle cx="28" cy="122" r="5" fill="#fb923c" />
                        <circle cx="0" cy="108" r="4.5" fill="#fde047" />
                      </g>
                    )}
                  </g>
                )}

                {/* Liquid Body inside Beaker/Flask */}
                {sim.vol > 0 && (
                  <g>
                    <rect
                      x="-68"
                      y={liquidY}
                      width="136"
                      height={liquidHeight}
                      rx="6"
                      fill={sim.liquidColor}
                    />
                    <ellipse
                      cx="0"
                      cy={liquidY}
                      rx="68"
                      ry="6"
                      fill={sim.liquidColor}
                      stroke="rgba(255,255,255,0.4)"
                      strokeWidth="1"
                    />
                  </g>
                )}

                {/* Precipitate settled layer */}
                {sim.precipitateColor && sim.foamLevel === 0 && (
                  <path
                    d="M -66 306 Q 0 296 66 306 L 66 320 L -66 320 Z"
                    fill={sim.precipitateColor}
                    opacity="0.92"
                  />
                )}

                {/* Rising gas / boiling bubbles */}
                {(sim.burnerOn || sim.gasMl > 0 || sim.foamLevel > 0) && (
                  <g fill="rgba(255,255,255,0.72)">
                    <circle cx="-24" cy={liquidY + 38} r="4">
                      <animate attributeName="cy" values={`${308};${liquidY + 4}`} dur={pulseDuration} repeatCount="indefinite" />
                    </circle>
                    <circle cx="12" cy={liquidY + 55} r="5">
                      <animate attributeName="cy" values={`${310};${liquidY + 6}`} dur="1.1s" repeatCount="indefinite" />
                    </circle>
                    <circle cx="34" cy={liquidY + 25} r="3.5">
                      <animate attributeName="cy" values={`${302};${liquidY + 3}`} dur="0.9s" repeatCount="indefinite" />
                    </circle>
                  </g>
                )}

                {/* Glass Vessel Outline */}
                {sim.sandboxVessel === 'erlen' || experiment.materials.includes('erlen') ? (
                  <path
                    d="M -30 156 L -30 205 L -74 316 Q -74 324 -64 324 L 64 324 Q 74 324 74 316 L 30 205 L 30 156 Z"
                    fill="url(#glassShine)"
                    stroke="#94a3b8"
                    strokeWidth="2.5"
                  />
                ) : (
                  <path
                    d="M -72 162 L -72 316 Q -72 324 -64 324 L 64 324 Q 72 324 72 316 L 72 162"
                    fill="url(#glassShine)"
                    stroke="#94a3b8"
                    strokeWidth="2.5"
                  />
                )}
                {/* Graduations */}
                {[200, 240, 280].map((gy, idx) => (
                  <g key={gy}>
                    <line x1="-68" y1={gy} x2="-48" y2={gy} stroke="rgba(226,232,240,0.45)" strokeWidth="1.5" />
                    <text x="-43" y={gy + 4} fill="#94a3b8" fontSize="11" fontFamily="monospace">
                      {150 - idx * 50}
                    </text>
                  </g>
                ))}

                {/* Interactive Amber Highlight Ring if pending step */}
                {!isCompleted && !isSandbox && (
                  <rect
                    x="-82"
                    y="150"
                    width="164"
                    height="182"
                    rx="18"
                    fill="none"
                    stroke="#f59e0b"
                    strokeWidth="2"
                    strokeDasharray="6 4"
                    opacity="0.7"
                  >
                    <animate attributeName="opacity" values="0.35;0.95;0.35" dur="1.8s" repeatCount="indefinite" />
                  </rect>
                )}
              </g>

              {/* Side Thermometer Badge */}
              <g transform="translate(610, 145)">
                <rect x="0" y="0" width="128" height="44" rx="12" fill="#0f172a" stroke="#f43f5e" strokeWidth="1.8" />
                <text x="14" y="18" fill="#fda4af" fontSize="10" fontWeight="bold">TERMOMETRE</text>
                <text x="14" y="36" fill="#ffffff" fontSize="16" fontFamily="monospace" fontWeight="bold">
                  {sim.temp.toFixed(1)} °C
                </text>
              </g>
            </g>
          )}

          {/* ── PRESET 2: TITRATION (STAND + BURETTE + ERLENMEYER + PH) ── */}
          {preset === 'titration' && (
            <g onClick={onTriggerStep} className="cursor-pointer">
              {/* Retort Stand */}
              <rect x="335" y="336" width="190" height="10" rx="4" fill="#475569" />
              <rect x="352" y="42" width="10" height="296" rx="3" fill="#64748b" />
              <rect x="358" y="88" width="96" height="7" rx="3" fill="#94a3b8" />
              {/* Burette */}
              <rect x="444" y="54" width="22" height="156" rx="4" fill="url(#glassShine)" stroke="#cbd5e1" strokeWidth="2" />
              <rect x="446" y="72" width="18" height="128" fill="rgba(192,132,252,0.45)" />
              <rect x="438" y="210" width="34" height="8" rx="3" fill="#38bdf8" />
              {/* Falling drop */}
              <circle cx="455" cy="232" r="4.5" fill="#ec4899">
                <animate attributeName="cy" values="222;290" dur={pulseDuration} repeatCount="indefinite" />
              </circle>
              {/* Erlenmeyer below */}
              <g transform="translate(455, 16)">
                <path
                  d="M -22 252 L -60 318 L 60 318 L 22 252 Z"
                  fill={sim.liquidColor}
                />
                <path
                  d="M -18 220 L -18 248 L -62 318 Q -62 326 -54 326 L 54 326 Q 62 326 62 318 L 18 248 L 18 220 Z"
                  fill="url(#glassShine)"
                  stroke="#cbd5e1"
                  strokeWidth="2.2"
                />
              </g>
              {/* Live pH Card */}
              <g transform="translate(570, 140)">
                <rect x="0" y="0" width="150" height="62" rx="14" fill="#0f172a" stroke="#ec4899" strokeWidth="2" />
                <text x="16" y="22" fill="#f9a8d4" fontSize="11" fontWeight="bold">CANLI pH METRE</text>
                <text x="16" y="48" fill="#ffffff" fontSize="22" fontFamily="monospace" fontWeight="bold">
                  pH {sim.ph.toFixed(2)}
                </text>
              </g>
            </g>
          )}

          {/* ── PRESET 3: FLAME TEST / BURNER ── */}
          {preset === 'flame' && (
            <g onClick={onTriggerStep} className="cursor-pointer">
              {/* Bunsen Burner */}
              <rect x="405" y="330" width="110" height="16" rx="4" fill="#475569" />
              <rect x="448" y="210" width="24" height="120" fill="#64748b" />
              {/* Flame Glow */}
              <ellipse cx="460" cy="155" rx="70" ry="75" fill="url(#flameGlow)" />
              <path
                d="M 460 210 C 425 180, 425 110, 460 66 C 495 110, 495 180, 460 210 Z"
                fill={sim.flameColor || '#38bdf8'}
                opacity="0.92"
              >
                <animate attributeName="opacity" values="0.82;1;0.85" dur={pulseDuration} repeatCount="indefinite" />
              </path>
              <path
                d="M 460 210 C 446 190, 446 146, 460 122 C 474 146, 474 190, 460 210 Z"
                fill="#e0f2fe"
                opacity="0.88"
              />
              {/* Nichrome wire / Metal holder */}
              <line x1="650" y1="150" x2="462" y2="150" stroke="#cbd5e1" strokeWidth="3.5" />
              <rect x="650" y="142" width="70" height="16" rx="6" fill="#334155" />
              <circle cx="462" cy="150" r="6" fill={sim.flameColor || '#facc15'} />
            </g>
          )}

          {/* ── PRESET 4: ELECTROCHEMISTRY (DANIELL / ELECTROLYSIS / CORROSION / SOLAR) ── */}
          {preset === 'electro' && (
            <g onClick={onTriggerStep} className="cursor-pointer">
              {/* Voltmeter / DC Supply box */}
              <rect x="375" y="48" width="170" height="68" rx="14" fill="#0f172a" stroke="#eab308" strokeWidth="2.5" />
              <text x="460" y="72" textAnchor="middle" fill="#fde047" fontSize="11" fontWeight="bold">
                DİJİTAL VOLTMETRE / DC
              </text>
              <text x="460" y="102" textAnchor="middle" fill="#ffffff" fontSize="24" fontFamily="monospace" fontWeight="bold">
                {sim.voltage.toFixed(2)} V
              </text>
              {/* Wires */}
              <path d="M 375 82 L 300 82 L 300 220" fill="none" stroke="#94a3b8" strokeWidth="3.5" />
              <path d="M 545 82 L 620 82 L 620 220" fill="none" stroke="#f97316" strokeWidth="3.5" />
              {/* Left Beaker (Anode) */}
              <rect x="242" y="230" width="116" height="106" fill="rgba(148,163,184,0.22)" />
              <path d="M 240 202 L 240 338 L 360 338 L 360 202" fill="url(#glassShine)" stroke="#94a3b8" strokeWidth="2.5" />
              <rect x="290" y="185" width="20" height="130" rx="3" fill="#94a3b8" />
              {/* Right Beaker (Cathode) */}
              <rect x="562" y="230" width="116" height="106" fill={sim.liquidColor || 'rgba(14,165,233,0.48)'} />
              <path d="M 560 202 L 560 338 L 680 338 L 680 202" fill="url(#glassShine)" stroke="#94a3b8" strokeWidth="2.5" />
              <rect x="610" y="185" width="20" height="130" rx="3" fill="#d97706" />
              {/* Salt Bridge (U-tube) */}
              <path
                d="M 332 260 L 332 162 Q 460 132 588 162 L 588 260"
                fill="none"
                stroke="#a7f3d0"
                strokeWidth="16"
                strokeLinecap="round"
                opacity="0.72"
              />
              {/* Electron flow pulse dots */}
              {sim.voltage > 0.1 && (
                <circle cx="340" cy="82" r="5" fill="#fde047">
                  <animate attributeName="cx" values="300;620" dur={pulseDuration} repeatCount="indefinite" />
                </circle>
              )}
            </g>
          )}

          {/* ── PRESET 5: RAINBOW / MULTI-TUBE RACK ── */}
          {preset === 'rainbow' && (
            <g onClick={onTriggerStep} className="cursor-pointer">
              {/* Rack Base & Top Bar */}
              <rect x="195" y="328" width="530" height="18" rx="6" fill="#334155" />
              <rect x="205" y="175" width="510" height="10" rx="4" fill="#475569" />
              {/* 7 Colorful Tubes */}
              {[
                { x: 245, col: '#f43f5e', lbl: 'pH 2' },
                { x: 315, col: '#fb923c', lbl: 'pH 4' },
                { x: 385, col: '#8b5cf6', lbl: 'pH 7' },
                { x: 455, col: '#0ea5e9', lbl: 'pH 9' },
                { x: 525, col: '#10b981', lbl: 'pH 11' },
                { x: 595, col: '#eab308', lbl: 'pH 13' },
                { x: 665, col: sim.liquidColor || '#38bdf8', lbl: 'Test' },
              ].map((tube, idx) => (
                <g key={tube.x}>
                  <rect
                    x={tube.x - 16}
                    y={165 + (idx % 2) * 8}
                    width="32"
                    height="150"
                    rx="14"
                    fill={currentStepIndex === 0 && idx !== 2 && idx !== 6 ? 'rgba(139,92,246,0.45)' : tube.col}
                    opacity="0.84"
                  />
                  <rect
                    x={tube.x - 17}
                    y="120"
                    width="34"
                    height="198"
                    rx="15"
                    fill="url(#glassShine)"
                    stroke="#cbd5e1"
                    strokeWidth="2"
                  />
                  <text x={tube.x} y="366" textAnchor="middle" fill="#cbd5e1" fontSize="12" fontFamily="monospace">
                    {tube.lbl}
                  </text>
                </g>
              ))}
            </g>
          )}

          {/* ── PRESET 6: GAS / PISTON / BALLOON / DIFFUSION ── */}
          {preset === 'gas' && (
            <g onClick={onTriggerStep} className="cursor-pointer">
              {/* Flask + Inflating Balloon + Gas Syringe Gauge */}
              <g transform="translate(380, 0)">
                {/* Balloon expanding proportional to sim.gasMl */}
                <ellipse
                  cx="0"
                  cy={142 - Math.min(50, sim.gasMl / 6)}
                  rx={26 + Math.min(48, sim.gasMl / 5)}
                  ry={32 + Math.min(55, sim.gasMl / 4.5)}
                  fill="#fb7185"
                  opacity="0.9"
                />
                <path
                  d="M -22 204 L -22 232 L -68 326 Q -68 334 -58 334 L 58 334 Q 68 334 68 326 L 22 232 L 22 204 Z"
                  fill={sim.liquidColor || 'rgba(56,189,248,0.35)'}
                  stroke="#cbd5e1"
                  strokeWidth="2.5"
                />
              </g>
              {/* Horizontal Gas Collection Syringe */}
              <g transform="translate(520, 175)">
                <rect x="0" y="0" width="220" height="48" rx="8" fill="url(#glassShine)" stroke="#94a3b8" strokeWidth="2.5" />
                <rect
                  x={24 + Math.min(140, sim.gasMl / 2.2)}
                  y="6"
                  width="18"
                  height="36"
                  rx="4"
                  fill="#38bdf8"
                />
                <rect
                  x={42 + Math.min(140, sim.gasMl / 2.2)}
                  y="20"
                  width="95"
                  height="8"
                  fill="#cbd5e1"
                />
                <text x="110" y="72" textAnchor="middle" fill="#bae6fd" fontSize="13" fontFamily="monospace" fontWeight="bold">
                  Gaz Hacmi: {sim.gasMl} mL
                </text>
              </g>
            </g>
          )}

          {/* ── PRESET 7: FUNNEL / SEPARATORY / FILTRATION ── */}
          {preset === 'funnel' && (
            <g onClick={onTriggerStep} className="cursor-pointer">
              <rect x="345" y="336" width="190" height="10" rx="4" fill="#475569" />
              <rect x="358" y="52" width="10" height="286" rx="3" fill="#64748b" />
              <line x1="368" y1="138" x2="430" y2="138" stroke="#94a3b8" strokeWidth="6" />
              {/* Upper Funnel */}
              <polygon points="415,92 505,92 468,186 452,186" fill={sim.liquidColor || 'rgba(234,179,8,0.6)'} stroke="#cbd5e1" strokeWidth="2.5" />
              <rect x="456" y="186" width="8" height="44" fill="#cbd5e1" />
              {/* Lower Collecting Beaker */}
              <rect x="415" y={340 - Math.min(95, liquidHeight)} width="90" height={Math.min(95, liquidHeight)} fill="rgba(56,189,248,0.45)" />
              <path d="M 412 246 L 412 340 L 508 340 L 508 246" fill="url(#glassShine)" stroke="#94a3b8" strokeWidth="2.5" />
            </g>
          )}

          {/* ── PRESET 8: NANOSCALE / BALANCE / RUTHERFORD / BROMINE ── */}
          {preset === 'nanoscale' && (
            <g onClick={onTriggerStep} className="cursor-pointer">
              {/* Digital Analytical Balance */}
              <rect x="330" y="294" width="260" height="48" rx="12" fill="#1e293b" stroke="#475569" strokeWidth="2" />
              <rect x="385" y="306" width="150" height="24" rx="6" fill="#020617" />
              <text x="460" y="323" textAnchor="middle" fill="#34d399" fontSize="14" fontFamily="monospace" fontWeight="bold">
                {(145.4 + sim.vol * 0.7).toFixed(2)} g
              </text>
              {/* Glass Weighing Dish / Beaker on top */}
              <rect x="370" y="284" width="180" height="10" rx="4" fill="#94a3b8" />
              <rect x="405" y={284 - Math.min(115, liquidHeight)} width="110" height={Math.min(115, liquidHeight)} fill={sim.liquidColor} />
              <path d="M 402 156 L 402 284 L 518 284 L 518 156" fill="url(#glassShine)" stroke="#cbd5e1" strokeWidth="2.5" />
              {sim.precipitateColor && (
                <path d="M 406 270 Q 460 258 514 270 L 514 282 L 406 282 Z" fill={sim.precipitateColor} />
              )}
            </g>
          )}
        </svg>

        {/* ── DERSOLAB EXCLUSIVE: TANECİK (MİKROSKOPİK) GÖRÜNÜMÜ OVERLAY ── */}
        {microMode && (
          <div className="absolute inset-0 bg-slate-950/92 backdrop-blur-md p-4 sm:p-6 flex flex-col justify-between z-20 border-2 border-cyan-500/40 rounded-2xl">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/20 border border-cyan-400/40 text-cyan-300 text-xs font-black">
                <Atom className="w-4 h-4 animate-spin" style={{ animationDuration: '6s' }} />
                <span>MİKROSKOBİK TANECİK BOYUTU (MAARİF MAKRO → MİKRO → SEMBOLİK)</span>
              </div>
              <span className="text-xs font-mono font-bold text-amber-300 bg-slate-900 px-3 py-1 rounded-lg border border-slate-700">
                {experiment.particleInfo.reactionEquation}
              </span>
            </div>

            {/* Animated Ion/Molecule Chambers */}
            <div className="my-3 grid grid-cols-1 sm:grid-cols-3 gap-3">
              {experiment.particleInfo.ions.map((ion, idx) => (
                <div
                  key={ion.formula}
                  className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 flex items-center gap-3"
                >
                  <div
                    className="w-11 h-11 rounded-full flex items-center justify-center font-mono text-xs font-black text-slate-950 shrink-0 shadow-lg animate-bounce"
                    style={{
                      backgroundColor: ion.color,
                      animationDuration: `${1.8 + idx * 0.4}s`,
                    }}
                  >
                    {ion.formula.slice(0, 5)}
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-black text-white truncate">{ion.formula}</div>
                    <div className="text-[11px] text-slate-400 leading-snug">{ion.role}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-3 rounded-xl bg-cyan-950/40 border border-cyan-500/30 text-xs text-cyan-100 leading-relaxed">
              <strong className="text-cyan-300">Tanecik Düzeyinde Açıklama:</strong>{' '}
              {experiment.particleInfo.microExplanation}
            </div>
          </div>
        )}
      </div>

      {/* Sandbox vessel selector + Quick CTA footer inside bench */}
      <div className="px-3.5 py-2.5 bg-slate-950/85 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2">
        {isSandbox && onSelectSandboxVessel ? (
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-slate-400 font-bold mr-1">Kap Seç:</span>
            {(['beher', 'erlen', 'deney_tupu'] as const).map((v) => (
              <button
                key={v}
                type="button"
                onClick={() => onSelectSandboxVessel(v)}
                className={`px-2.5 py-1 rounded-lg font-bold capitalize cursor-pointer transition-all ${
                  sim.sandboxVessel === v
                    ? 'bg-emerald-500 text-slate-950'
                    : 'bg-slate-900 text-slate-300 border border-slate-800 hover:border-slate-700'
                }`}
              >
                {v === 'beher' ? 'Beher' : v === 'erlen' ? 'Erlen' : 'Tüp'}
              </button>
            ))}
          </div>
        ) : (
          <span className="text-[11px] text-slate-400">
            İpucu: Tezgâhtaki düzeneğe veya sarı çerçeveli malzemelere tıklayarak adımı uygulayabilirsin.
          </span>
        )}

        {!isSandbox && !isCompleted && (
          <button
            type="button"
            onClick={onTriggerStep}
            className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 text-xs font-black shadow-lg shadow-amber-500/20 cursor-pointer transition-all"
          >
            {activeStep?.actionLabel || 'Adımı Uygula'} →
          </button>
        )}
      </div>
    </div>
  )
}
