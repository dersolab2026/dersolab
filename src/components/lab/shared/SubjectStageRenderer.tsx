'use client'

import React from 'react'
import type { SubjectSimulation, WorkbenchToolDef } from './gradeWorkbenchTypes'

export const SVG_FONT = "var(--font-sans), 'Inter', system-ui, -apple-system, sans-serif"

export function fmtTr(n: number, digits = 1): string {
  return n.toFixed(digits).replace('.', ',')
}

function splitTwoLines(text: string, maxLen: number): [string, string | null] {
  if (text.length <= maxLen) return [text, null]
  const dotIdx = text.lastIndexOf(' · ', maxLen)
  const spIdx = text.lastIndexOf(' ', maxLen)
  const nextSp = text.indexOf(' ', maxLen)
  const cut =
    dotIdx > 4
      ? dotIdx
      : spIdx > 4
        ? spIdx
        : nextSp > 0
          ? nextSp
          : -1
  if (cut < 0) return [text, null]
  const first = text.slice(0, cut).trim()
  const rest = text
    .slice(cut)
    .replace(/^\s*·\s*/, '')
    .trim()
  return rest ? [first, rest] : [first, null]
}

interface SubjectStageRendererProps {
  sim: SubjectSimulation
  primaryVal: number
  secondaryVal: number
  tertiaryVal: number
  statusLabel: string
  selectedToolId: string | null
  showTargetHighlight: boolean
  fastForward: boolean
  onSelectTool: (tool: WorkbenchToolDef) => void
  onTargetClick: (targetIdx: number) => void
  onClearSelection: () => void
}

export function SubjectStageRenderer({
  sim,
  primaryVal,
  secondaryVal,
  tertiaryVal,
  statusLabel,
  selectedToolId,
  showTargetHighlight,
  fastForward,
  onSelectTool,
  onTargetClick,
  onClearSelection,
}: SubjectStageRendererProps) {
  const pulseDur = fastForward ? '0.5s' : '1.5s'
  const tools = sim.tools.slice(0, 4)

  const renderRightTools = (startX = 556) => (
    <g>
      {tools.map((tool, idx) => {
        const tx = startX + idx * 90
        const isSel = selectedToolId === tool.id
        const isBottle = tool.kind === 'bottle'
        const isWeight = tool.kind === 'weight'
        const [sub1, sub2] = splitTwoLines(tool.subLabel, 16)

        return (
          <g
            key={tool.id}
            transform={`translate(${tx}, 0)`}
            onClick={(e) => {
              e.stopPropagation()
              onSelectTool(tool)
            }}
            className="cursor-pointer"
          >
            {isSel && (
              <rect
                x="-42"
                y="210"
                width="84"
                height="126"
                rx="10"
                fill="rgba(56,189,248,0.06)"
                stroke="rgba(248,250,252,0.88)"
                strokeWidth="1.6"
                strokeDasharray="5 4"
              />
            )}
            <ellipse cx="0" cy="333" rx="30" ry="4.5" fill="rgba(0,0,0,0.45)" />

            {isBottle ? (
              <g>
                <rect x="-12" y="216" width="24" height="14" rx="3" fill={tool.colorHex} />
                <path
                  d="M -10 230 L -10 236 Q -26 244 -26 254 L -26 322 Q -26 328 -20 328 L 20 328 Q 26 328 26 322 L 26 254 Q 26 244 10 236 L 10 230 Z"
                  fill="url(#sharedGlassGrad)"
                  stroke="rgba(203,213,225,0.68)"
                  strokeWidth="1.6"
                />
                <rect x="-22" y="260" width="44" height="44" rx="3" fill="#f8fafc" />
                <rect x="-22" y="260" width="44" height="5" rx="1.5" fill={tool.colorHex} />
                <text
                  x="0"
                  y="279"
                  textAnchor="middle"
                  fill="#0f172a"
                  fontSize={tool.label.length > 7 ? '7.5' : '9.5'}
                  fontWeight="800"
                  fontFamily={SVG_FONT}
                >
                  {tool.label}
                </text>
                <text x="0" y="293" textAnchor="middle" fill="#475569" fontSize={tool.subLabel.length > 14 ? '5.7' : '6.4'} fontWeight="600" fontFamily={SVG_FONT}>
                  {tool.subLabel}
                </text>
              </g>
            ) : isWeight ? (
              <g>
                {/* Brass / Steel Slotted Calibration Mass */}
                <circle cx="0" cy="252" r="5.5" fill="none" stroke="#94a3b8" strokeWidth="2.5" />
                <rect x="-22" y="262" width="44" height="66" rx="6" fill="#334155" stroke="#64748b" strokeWidth="1.6" />
                <rect x="-18" y="266" width="36" height="8" rx="2" fill={tool.colorHex} opacity="0.85" />
                <text x="0" y="294" textAnchor="middle" fill="#ffffff" fontSize="11" fontWeight="800" fontFamily={SVG_FONT} style={{ fontVariantNumeric: 'tabular-nums' }}>
                  {tool.label}
                </text>
                <text x="0" y="310" textAnchor="middle" fill="#cbd5e1" fontSize={tool.subLabel.length > 14 ? '6.2' : '7.2'} fontWeight="600" fontFamily={SVG_FONT}>
                  {tool.subLabel}
                </text>
              </g>
            ) : (
              /* Precision Interactive Instrument / Module Block */
              <g>
                <rect
                  x="-38"
                  y="236"
                  width="76"
                  height="94"
                  rx="9"
                  fill="#0f172a"
                  stroke={isSel ? tool.colorHex : '#334155'}
                  strokeWidth="1.8"
                />
                <rect x="-38" y="236" width="76" height="10" rx="4" fill={tool.colorHex} opacity="0.85" />
                <text
                  x="0"
                  y="269"
                  textAnchor="middle"
                  fill="#ffffff"
                  fontSize={tool.label.length > 10 ? '7.8' : tool.label.length > 7 ? '8.8' : '10.2'}
                  fontWeight="800"
                  fontFamily={SVG_FONT}
                >
                  {tool.label}
                </text>
                <text x="0" y={sub2 ? '284' : '290'} textAnchor="middle" fill="#94a3b8" fontSize={sub1.length > 15 ? '6.4' : '7.1'} fontWeight="600" fontFamily={SVG_FONT}>
                  {sub1}
                </text>
                {sub2 && (
                  <text x="0" y="294" textAnchor="middle" fill="#94a3b8" fontSize={sub2.length > 15 ? '6.4' : '6.9'} fontWeight="600" fontFamily={SVG_FONT}>
                    {sub2}
                  </text>
                )}
                <rect x="-20" y="309" width="40" height="12" rx="4" fill="rgba(56,189,248,0.14)" stroke="rgba(56,189,248,0.35)" strokeWidth="0.8" />
                <text x="0" y="318" textAnchor="middle" fill="#7dd3fc" fontSize="7" fontWeight="700" fontFamily={SVG_FONT}>
                  SEÇ
                </text>
              </g>
            )}
          </g>
        )
      })}
    </g>
  )

  const targetGlowBox = (x: number, y: number, w: number, h: number, idx: number) =>
    showTargetHighlight ? (
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        rx="12"
        fill="none"
        stroke="rgba(234,179,8,0.72)"
        strokeWidth="2"
        onClick={(e) => {
          e.stopPropagation()
          onTargetClick(idx)
        }}
        className="cursor-pointer"
      />
    ) : null

  return (
    <svg
      viewBox="0 0 920 410"
      className="w-full h-auto max-h-[410px] select-none cursor-default"
      role="img"
      aria-label={`${sim.title} İnteraktif Simülasyon Sahnesi`}
    >
      <defs>
        <linearGradient id="sharedBenchGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#263142" />
          <stop offset="32%" stopColor="#1b2432" />
          <stop offset="100%" stopColor="#0e1420" />
        </linearGradient>
        <linearGradient id="sharedGlassGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="rgba(255,255,255,0.22)" />
          <stop offset="25%" stopColor="rgba(255,255,255,0.05)" />
          <stop offset="80%" stopColor="rgba(255,255,255,0.08)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0.22)" />
        </linearGradient>
        <pattern id="sharedLabGrid" width="44" height="44" patternUnits="userSpaceOnUse">
          <path d="M 44 0 L 0 0 0 44" fill="none" stroke="rgba(148,163,184,0.075)" strokeWidth="1" />
        </pattern>
      </defs>

      {/* Blueprint Grid Background + Lab Bench */}
      <rect x="0" y="0" width="920" height="334" fill="#101826" onClick={onClearSelection} />
      <rect x="0" y="0" width="920" height="334" fill="url(#sharedLabGrid)" pointerEvents="none" />
      <rect x="0" y="330" width="920" height="80" fill="url(#sharedBenchGrad)" onClick={onClearSelection} />
      <line x1="0" y1="330" x2="920" y2="330" stroke="rgba(148,163,184,0.22)" strokeWidth="1.5" />

      {/* ══════════════ PHYSICS SCENES ══════════════ */}
      {sim.scene === 'phys_spring_dynamo' && (
        <g>
          {/* Stand */}
          <rect x="92" y="322" width="170" height="8" rx="3" fill="#475569" />
          <rect x="114" y="54" width="10" height="270" rx="3" fill="#64748b" />
          <rect x="120" y="64" width="140" height="7" rx="3" fill="#94a3b8" />
          {/* Calibrated Vertical Ruler */}
          <rect x="305" y="76" width="24" height="240" rx="4" fill="#1e293b" stroke="#475569" strokeWidth="1.4" />
          {[0, 2, 4, 6, 8, 10, 12].map((cm, idx) => (
            <g key={cm}>
              <line x1="305" y1={96 + idx * 32} x2="316" y2={96 + idx * 32} stroke="#94a3b8" strokeWidth="1.2" />
              <text x="320" y={100 + idx * 32} fill="#cbd5e1" fontSize="8" fontWeight="600" fontFamily={SVG_FONT} style={{ fontVariantNumeric: 'tabular-nums' }}>
                {cm}
              </text>
            </g>
          ))}
          {/* Helical Spring */}
          {(() => {
            const extPx = Math.min(115, Math.max(20, secondaryVal * 8))
            const coils = 8
            const topY = 71
            const stepY = extPx / coils
            let d = `M 230 ${topY}`
            for (let i = 0; i < coils; i++) {
              const yMid = topY + i * stepY + stepY / 2
              const yEnd = topY + (i + 1) * stepY
              d += ` L ${i % 2 === 0 ? 246 : 214} ${yMid} L 230 ${yEnd}`
            }
            const bottomY = topY + extPx
            return (
              <g>
                <path d={d} fill="none" stroke="#38bdf8" strokeWidth="3" strokeLinejoin="round" />
                <line x1="230" y1={bottomY} x2="230" y2={bottomY + 18} stroke="#cbd5e1" strokeWidth="2.5" />
                <rect x="196" y={bottomY + 18} width="68" height="46" rx="7" fill="#334155" stroke="#94a3b8" strokeWidth="1.6" />
                <text x="230" y={bottomY + 46} textAnchor="middle" fill="#ffffff" fontSize="13" fontWeight="800" fontFamily={SVG_FONT} style={{ fontVariantNumeric: 'tabular-nums' }}>
                  {fmtTr(primaryVal, 1)} N
                </text>
              </g>
            )
          })()}
          {/* Digital Force Pill */}
          <g transform="translate(362, 110)">
            <rect x="0" y="0" width="136" height="58" rx="12" fill="#090D16" stroke="rgba(56,189,248,0.5)" strokeWidth="1.5" />
            <text x="68" y="21" textAnchor="middle" fill="#7dd3fc" fontSize="9.5" fontWeight="700" fontFamily={SVG_FONT}>
              DİNAMOMETRE OKUMASI
            </text>
            <text x="68" y="45" textAnchor="middle" fill="#ffffff" fontSize="19" fontWeight="800" fontFamily={SVG_FONT} style={{ fontVariantNumeric: 'tabular-nums' }}>
              {fmtTr(primaryVal, 1)} N · {fmtTr(secondaryVal, 1)} cm
            </text>
          </g>
          {targetGlowBox(176, 62, 110, 265, 0)}
          {renderRightTools(560)}
        </g>
      )}

      {sim.scene === 'phys_buoyancy_overflow' && (
        <g>
          {/* Overflow Tank (Taşırma Kabı) */}
          <rect x="96" y="138" width="150" height="190" fill="rgba(56,189,248,0.34)" />
          <path d="M 94 106 L 94 328 L 248 328 L 248 156 L 278 164" fill="url(#sharedGlassGrad)" stroke="#cbd5e1" strokeWidth="2.2" />
          {/* Submerged Block */}
          {(() => {
            const sinkY = primaryVal > 1 ? 250 : primaryVal > 0.7 ? 170 : 122
            return (
              <g transform={`translate(170, ${sinkY})`}>
                <line x1="0" y1="-85" x2="0" y2="0" stroke="#94a3b8" strokeWidth="2" />
                <rect x="-26" y="0" width="52" height="52" rx="6" fill="#f59e0b" stroke="#fde68a" strokeWidth="1.5" />
                <text x="0" y="30" textAnchor="middle" fill="#0f172a" fontSize="11" fontWeight="800" fontFamily={SVG_FONT} style={{ fontVariantNumeric: 'tabular-nums' }}>
                  d={fmtTr(primaryVal, 1)}
                </text>
              </g>
            )
          })()}
          {/* Catching Graduated Cylinder (500 mL) */}
          <g transform="translate(338, 0)">
            <rect x="-22" y={322 - Math.min(180, secondaryVal * 1.4)} width="44" height={Math.min(180, secondaryVal * 1.4)} fill="rgba(56,189,248,0.55)" />
            <rect x="-24" y="134" width="48" height="188" fill="url(#sharedGlassGrad)" stroke="#cbd5e1" strokeWidth="2" />
            <polygon points="-32,332 -26,322 26,322 32,332" fill="#1d4ed8" />
            {[100, 200, 300, 400].map((v, idx) => (
              <g key={v}>
                <line x1="-22" y1={286 - idx * 36} x2="-8" y2={286 - idx * 36} stroke="#93c5fd" strokeWidth="1.1" />
                <text x="-4" y={289 - idx * 36} fill="#93c5fd" fontSize="8" fontWeight="700" fontFamily={SVG_FONT} style={{ fontVariantNumeric: 'tabular-nums' }}>
                  {v}
                </text>
              </g>
            ))}
            <text x="0" y="352" textAnchor="middle" fill="#94a3b8" fontSize="10" fontWeight="600" fontFamily={SVG_FONT}>
              Taşan: {fmtTr(secondaryVal, 0)} mL
            </text>
          </g>
          {targetGlowBox(84, 96, 200, 240, 0)}
          {renderRightTools(530)}
        </g>
      )}

      {sim.scene === 'phys_torricelli_pressure' && (
        <g>
          {/* Mercury Basin */}
          <rect x="120" y="272" width="220" height="56" rx="6" fill="url(#sharedGlassGrad)" stroke="#cbd5e1" strokeWidth="2" />
          <rect x="124" y="290" width="212" height="36" rx="4" fill="#94a3b8" />
          {/* Inverted 100 cm Glass Barometer Tube */}
          <rect x="216" y="72" width="28" height="236" rx="8" fill="url(#sharedGlassGrad)" stroke="#cbd5e1" strokeWidth="2" />
          {(() => {
            const hPx = Math.min(185, Math.max(30, primaryVal * 2.2))
            return <rect x="219" y={292 - hPx} width="22" height={hPx} fill="#cbd5e1" />
          })()}
          <g transform="translate(274, 118)">
            <rect x="0" y="0" width="144" height="58" rx="12" fill="#090D16" stroke="rgba(16,185,129,0.5)" strokeWidth="1.5" />
            <text x="72" y="21" textAnchor="middle" fill="#6ee7b7" fontSize="9.5" fontWeight="700" fontFamily={SVG_FONT}>
              BAROMETRE / BASINÇ
            </text>
            <text x="72" y="45" textAnchor="middle" fill="#ffffff" fontSize="18" fontWeight="800" fontFamily={SVG_FONT} style={{ fontVariantNumeric: 'tabular-nums' }}>
              {fmtTr(primaryVal, 1)} {sim.metricPrimaryUnit}
            </text>
          </g>
          {targetGlowBox(112, 64, 240, 272, 0)}
          {renderRightTools(530)}
        </g>
      )}

      {sim.scene === 'phys_circuit_ohm' && (
        <g>
          {/* DC Power Supply */}
          <rect x="76" y="180" width="110" height="148" rx="10" fill="#1e293b" stroke="#475569" strokeWidth="2" />
          <text x="131" y="205" textAnchor="middle" fill="#fde047" fontSize="10" fontWeight="800" fontFamily={SVG_FONT}>
            GÜÇ KAYNAĞI
          </text>
          <rect x="92" y="220" width="78" height="36" rx="6" fill="#090D16" stroke="#eab308" strokeWidth="1.3" />
          <text x="131" y="244" textAnchor="middle" fill="#ffffff" fontSize="16" fontWeight="800" fontFamily={SVG_FONT} style={{ fontVariantNumeric: 'tabular-nums' }}>
            {fmtTr(primaryVal, 1)} V
          </text>
          {/* Copper Circuit Loop */}
          <path d="M 186 210 L 420 210 L 420 294 L 186 294" fill="none" stroke="#f59e0b" strokeWidth="4" />
          {/* Incandescent Bulb */}
          <g transform="translate(310, 210)">
            <circle cx="0" cy="-22" r={18 + Math.min(28, primaryVal * 1.5)} fill="#fde047" opacity={Math.min(0.45, primaryVal / 24)} />
            <circle cx="0" cy="-22" r="20" fill={primaryVal > 0 ? 'rgba(253,224,71,0.55)' : 'rgba(148,163,184,0.18)'} stroke="#cbd5e1" strokeWidth="2" />
            <rect x="-10" y="-4" width="20" height="12" rx="2" fill="#64748b" />
          </g>
          {/* Digital Ammeter */}
          <g transform="translate(360, 268)">
            <rect x="0" y="0" width="120" height="52" rx="10" fill="#090D16" stroke="#38bdf8" strokeWidth="1.6" />
            <text x="60" y="19" textAnchor="middle" fill="#7dd3fc" fontSize="9" fontWeight="700" fontFamily={SVG_FONT}>
              AMPERMETRE
            </text>
            <text x="60" y="40" textAnchor="middle" fill="#ffffff" fontSize="16" fontWeight="800" fontFamily={SVG_FONT} style={{ fontVariantNumeric: 'tabular-nums' }}>
              {fmtTr(secondaryVal, 2)} A
            </text>
          </g>
          {primaryVal > 0 && (
            <circle cx="240" cy="210" r="4.5" fill="#fef08a">
              <animate attributeName="cx" values="195;415" dur={pulseDur} repeatCount="indefinite" />
            </circle>
          )}
          {targetGlowBox(68, 152, 425, 180, 0)}
          {renderRightTools(535)}
        </g>
      )}

      {sim.scene === 'phys_optics_bench' && (
        <g>
          {/* Optical Rail */}
          <rect x="66" y="294" width="440" height="14" rx="4" fill="#334155" stroke="#475569" strokeWidth="1.4" />
          <line x1="80" y1="196" x2="490" y2="196" stroke="rgba(148,163,184,0.35)" strokeDasharray="6 4" strokeWidth="1.2" />
          {/* Laser Emitter */}
          <rect x="74" y="176" width="56" height="40" rx="6" fill="#1e293b" stroke="#f43f5e" strokeWidth="1.8" />
          <circle cx="130" cy="196" r="4" fill="#fb7185" />
          {/* Converging / Diverging Lens */}
          <ellipse cx="275" cy="196" rx="13" ry="74" fill="rgba(56,189,248,0.28)" stroke="#7dd3fc" strokeWidth="2.2" />
          {/* Refracted Light Rays */}
          {(() => {
            const focalX = Math.min(475, Math.max(325, 275 + primaryVal * 6))
            return (
              <g stroke="#fb7185" strokeWidth="2.4" opacity="0.9">
                <line x1="132" y1="158" x2="275" y2="158" />
                <line x1="275" y1="158" x2={focalX} y2="196" />
                <line x1="132" y1="234" x2="275" y2="234" />
                <line x1="275" y1="234" x2={focalX} y2="196" />
                <circle cx={focalX} cy="196" r="5" fill="#fde047" />
              </g>
            )
          })()}
          <rect x="466" y="128" width="12" height="166" rx="3" fill="#e2e8f0" />
          {targetGlowBox(62, 114, 434, 198, 0)}
          {renderRightTools(535)}
        </g>
      )}

      {sim.scene === 'phys_dynamics_ramp' && (
        <g>
          {/* Adjustable Inclined Ramp */}
          {(() => {
            const angle = Math.min(42, Math.max(0, secondaryVal))
            const rad = (angle * Math.PI) / 180
            const topY = 296 - Math.sin(rad) * 320
            return (
              <g>
                <polygon points={`90,${topY} 90,322 430,322`} fill="#1e293b" stroke="#475569" strokeWidth="2" />
                <line x1="90" y1={topY} x2="430" y2="322" stroke="#38bdf8" strokeWidth="3.5" />
                <g transform={`translate(${180 + Math.min(120, primaryVal * 10)}, ${topY + (322 - topY) * 0.38}) rotate(${angle})`}>
                  <rect x="-26" y="-32" width="52" height="30" rx="5" fill="#f59e0b" stroke="#fde68a" strokeWidth="1.5" />
                  <text x="0" y="-12" textAnchor="middle" fill="#0f172a" fontSize="10" fontWeight="800" fontFamily={SVG_FONT} style={{ fontVariantNumeric: 'tabular-nums' }}>
                    {fmtTr(primaryVal, 1)} {sim.metricPrimaryUnit}
                  </text>
                </g>
              </g>
            )
          })()}
          {targetGlowBox(74, 110, 380, 224, 0)}
          {renderRightTools(530)}
        </g>
      )}

      {/* ══════════════ BIOLOGY SCENES ══════════════ */}
      {(sim.scene === 'bio_reagent_tubes' || sim.scene === 'bio_blood_typing' || sim.scene === 'bio_elodea_photosynthesis' || sim.scene === 'bio_osmosis_utube') && (
        <g>
          {sim.scene === 'bio_reagent_tubes' && (
            <g>
              <rect x="90" y="314" width="380" height="16" rx="5" fill="#334155" />
              <rect x="98" y="176" width="364" height="8" rx="4" fill="#475569" />
              {['Tüp 1', 'Tüp 2', 'Tüp 3', 'Kontrol'].map((lbl, i) => {
                const x = 148 + i * 88
                const active = i === 0 || primaryVal > i * 25
                const fillC = i === 0 ? '#6366f1' : i === 1 ? '#f97316' : i === 2 ? '#a855f7' : '#38bdf8'
                return (
                  <g key={lbl} transform={`translate(${x}, 0)`}>
                    <rect x="-15" y="202" width="30" height="106" rx="14" fill={active ? fillC : 'rgba(148,163,184,0.2)'} opacity="0.86" />
                    <rect x="-16" y="132" width="32" height="178" rx="15" fill="url(#sharedGlassGrad)" stroke="#cbd5e1" strokeWidth="1.8" />
                    <text x="0" y="352" textAnchor="middle" fill="#cbd5e1" fontSize="10" fontWeight="600" fontFamily={SVG_FONT}>
                      {lbl}
                    </text>
                  </g>
                )
              })}
              {targetGlowBox(80, 118, 400, 222, 0)}
            </g>
          )}

          {sim.scene === 'bio_blood_typing' && (
            <g>
              {/* 3-Well Agglutination Porcelain Plate */}
              <rect x="95" y="190" width="390" height="128" rx="22" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="2.5" />
              {[
                { lbl: 'Anti-A', x: 170, clump: primaryVal >= 1 },
                { lbl: 'Anti-B', x: 290, clump: secondaryVal >= 1 },
                { lbl: 'Anti-D (Rh)', x: 410, clump: tertiaryVal >= 1 },
              ].map((w) => (
                <g key={w.lbl} transform={`translate(${w.x}, 254)`}>
                  <circle cx="0" cy="0" r="40" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="2" />
                  <circle cx="0" cy="0" r="32" fill={w.clump ? '#b91c1c' : '#ef4444'} opacity="0.88" />
                  {w.clump && (
                    <g fill="#7f1d1d">
                      <circle cx="-12" cy="-8" r="5" />
                      <circle cx="10" cy="-4" r="6" />
                      <circle cx="-4" cy="12" r="5.5" />
                      <circle cx="12" cy="10" r="4" />
                    </g>
                  )}
                  <text x="0" y="-48" textAnchor="middle" fill="#0f172a" fontSize="11" fontWeight="800" fontFamily={SVG_FONT}>
                    {w.lbl}
                  </text>
                </g>
              ))}
              {targetGlowBox(84, 178, 412, 152, 0)}
            </g>
          )}

          {sim.scene === 'bio_elodea_photosynthesis' && (
            <g>
              {/* Beaker with Elodea + Funnel + Inverted Test Tube */}
              <rect x="130" y="168" width="160" height="156" fill="rgba(56,189,248,0.28)" />
              <path d="M 128 148 L 128 326 L 292 326 L 292 148" fill="url(#sharedGlassGrad)" stroke="#cbd5e1" strokeWidth="2" />
              {/* Elodea sprig */}
              <path d="M 210 318 C 196 286, 224 260, 206 232" fill="none" stroke="#10b981" strokeWidth="6" strokeLinecap="round" />
              <polygon points="168,286 252,286 218,214 202,214" fill="rgba(226,232,240,0.22)" stroke="#94a3b8" strokeWidth="1.5" />
              <rect x="196" y="88" width="28" height="126" rx="12" fill="url(#sharedGlassGrad)" stroke="#cbd5e1" strokeWidth="1.8" />
              {/* O2 Gas Pocket + Rising Bubbles */}
              <rect x="198" y="90" width="24" height={Math.min(72, 14 + primaryVal * 1.2)} rx="8" fill="rgba(224,242,254,0.55)" />
              {primaryVal > 0 && (
                <circle cx="210" cy="210" r="4" fill="#e0f2fe">
                  <animate attributeName="cy" values="236;125" dur={pulseDur} repeatCount="indefinite" />
                </circle>
              )}
              {/* Spectral LED Lamp */}
              <g transform="translate(362, 170)">
                <rect x="0" y="0" width="90" height="62" rx="10" fill="#090D16" stroke="#10b981" strokeWidth="1.6" />
                <text x="45" y="22" textAnchor="middle" fill="#6ee7b7" fontSize="9.5" fontWeight="700" fontFamily={SVG_FONT}>
                  O₂ HIZI
                </text>
                <text x="45" y="47" textAnchor="middle" fill="#ffffff" fontSize="18" fontWeight="800" fontFamily={SVG_FONT} style={{ fontVariantNumeric: 'tabular-nums' }}>
                  {fmtTr(primaryVal, 0)} {sim.metricPrimaryUnit}
                </text>
              </g>
              {targetGlowBox(118, 80, 186, 254, 0)}
            </g>
          )}

          {sim.scene === 'bio_osmosis_utube' && (
            <g>
              {/* U-Tube Osmometer with Semi-permeable Membrane */}
              <path d="M 180 120 L 180 284 Q 260 338 340 284 L 340 120" fill="none" stroke="rgba(203,213,225,0.68)" strokeWidth="42" strokeLinecap="round" />
              <path d={`M 180 ${230 - Math.min(75, secondaryVal * 2)} L 180 284 Q 260 336 340 284 L 340 ${230 - Math.min(85, primaryVal * 2)}`} fill="none" stroke="rgba(56,189,248,0.55)" strokeWidth="34" />
              <line x1="260" y1="286" x2="260" y2="334" stroke="#f59e0b" strokeDasharray="4 4" strokeWidth="4" />
              <text x="260" y="352" textAnchor="middle" fill="#fbbf24" fontSize="10" fontWeight="700" fontFamily={SVG_FONT}>
                Yarı Geçirgen Zar
              </text>
              {targetGlowBox(140, 108, 240, 232, 0)}
            </g>
          )}
          {renderRightTools(530)}
        </g>
      )}

      {sim.scene === 'bio_microscope_slide' && (
        <g>
          {/* Binocular Compound Microscope */}
          <rect x="86" y="314" width="126" height="16" rx="5" fill="#334155" />
          <path d="M 122 314 L 122 184 Q 122 140 165 140" fill="none" stroke="#64748b" strokeWidth="16" strokeLinecap="round" />
          <rect x="112" y="226" width="98" height="10" rx="3" fill="#475569" />
          <rect x="150" y="102" width="30" height="72" rx="6" fill="#94a3b8" transform="rotate(-14, 165, 138)" />
          {/* Live Circular Ocular Viewport */}
          <circle cx="364" cy="190" r="108" fill="#09111f" stroke="#10b981" strokeWidth="3.5" />
          <g clipPath="url(#sharedLabGrid)" />
          {/* Render Cellular Structures Inside Ocular View */}
          <circle cx="332" cy="170" r="34" fill="rgba(16,185,129,0.22)" stroke="#34d399" strokeWidth="2" />
          <circle cx="332" cy="170" r="11" fill="#8b5cf6" opacity="0.85" />
          <circle cx="394" cy="208" r="32" fill="rgba(16,185,129,0.22)" stroke="#34d399" strokeWidth="2" />
          <circle cx="394" cy="208" r="10" fill="#8b5cf6" opacity="0.85" />
          <g transform="translate(304, 294)">
            <rect x="0" y="0" width="120" height="28" rx="8" fill="#090D16" stroke="rgba(16,185,129,0.55)" strokeWidth="1.2" />
            <text x="60" y="18" textAnchor="middle" fill="#6ee7b7" fontSize="11" fontWeight="800" fontFamily={SVG_FONT} style={{ fontVariantNumeric: 'tabular-nums' }}>
              {fmtTr(primaryVal, 0)}× Büyütme
            </text>
          </g>
          {targetGlowBox(76, 86, 405, 246, 0)}
          {renderRightTools(530)}
        </g>
      )}

      {/* ══════════════ MATHEMATICS SCENES ══════════════ */}
      {(sim.scene === 'math_coord_plotter' || sim.scene === 'math_equation_balance' || sim.scene === 'math_geometry_proof' || sim.scene === 'math_unit_circle_prob') && (
        <g>
          {sim.scene === 'math_coord_plotter' && (
            <g>
              {/* High-Precision Cartesian Coordinate Plane */}
              <rect x="64" y="44" width="420" height="278" rx="14" fill="#090f1d" stroke="#334155" strokeWidth="1.8" />
              <line x1="274" y1="54" x2="274" y2="312" stroke="#64748b" strokeWidth="1.6" />
              <line x1="76" y1="183" x2="472" y2="183" stroke="#64748b" strokeWidth="1.6" />
              {/* Dynamic Curve Plot */}
              <path
                d={`M 90 ${260 - Math.min(180, Math.abs(primaryVal) * 8)} Q 274 ${183 - secondaryVal * 8} 458 ${95 - Math.min(60, primaryVal * 4)}`}
                fill="none"
                stroke="#a78bfa"
                strokeWidth="3.2"
                strokeLinecap="round"
              />
              <circle cx="274" cy={183 - secondaryVal * 4} r="5.5" fill="#f43f5e" stroke="#ffffff" strokeWidth="1.5" />
              <text x="274" y="346" textAnchor="middle" fill="#cbd5e1" fontSize="11" fontWeight="700" fontFamily={SVG_FONT}>
                {statusLabel}
              </text>
              {targetGlowBox(58, 38, 432, 290, 0)}
            </g>
          )}

          {sim.scene === 'math_equation_balance' && (
            <g>
              {/* Dual-Pan Precision Algebraic Scale */}
              <polygon points="260,324 290,324 275,188" fill="#475569" />
              <rect x="115" y="182" width="320" height="8" rx="4" fill="#94a3b8" />
              {/* Left & Right Pans */}
              <rect x="112" y="218" width="98" height="12" rx="4" fill="#64748b" />
              <rect x="340" y="218" width="98" height="12" rx="4" fill="#64748b" />
              <rect x="128" y="164" width="66" height="48" rx="8" fill="#7c3aed" />
              <text x="161" y="193" textAnchor="middle" fill="#ffffff" fontSize="13" fontWeight="800" fontFamily={SVG_FONT} style={{ fontVariantNumeric: 'tabular-nums' }}>
                {sim.metricPrimaryLabel}: {fmtTr(primaryVal, 0)}
              </text>
              <rect x="356" y="164" width="66" height="48" rx="8" fill="#0ea5e9" />
              <text x="389" y="193" textAnchor="middle" fill="#ffffff" fontSize="13" fontWeight="800" fontFamily={SVG_FONT} style={{ fontVariantNumeric: 'tabular-nums' }}>
                Sağ: {fmtTr(secondaryVal, 0)}
              </text>
              {targetGlowBox(94, 146, 364, 182, 0)}
            </g>
          )}

          {sim.scene === 'math_geometry_proof' && (
            <g>
              <rect x="64" y="44" width="420" height="278" rx="14" fill="#090f1d" stroke="#334155" strokeWidth="1.8" />
              <polygon points="150,276 150,126 385,276" fill="rgba(56,189,248,0.16)" stroke="#38bdf8" strokeWidth="3" />
              <rect x="150" y="258" width="18" height="18" fill="none" stroke="#fbbf24" strokeWidth="2" />
              <text x="132" y="204" textAnchor="end" fill="#fbbf24" fontSize="13" fontWeight="800" fontFamily={SVG_FONT} style={{ fontVariantNumeric: 'tabular-nums' }}>
                {fmtTr(primaryVal, 1)}
              </text>
              <text x="268" y="298" textAnchor="middle" fill="#34d399" fontSize="13" fontWeight="800" fontFamily={SVG_FONT} style={{ fontVariantNumeric: 'tabular-nums' }}>
                {fmtTr(secondaryVal, 1)}
              </text>
              <text x="285" y="186" fill="#f472b6" fontSize="13" fontWeight="800" fontFamily={SVG_FONT}>
                {statusLabel}
              </text>
              {targetGlowBox(58, 38, 432, 290, 0)}
            </g>
          )}

          {sim.scene === 'math_unit_circle_prob' && (
            <g>
              <circle cx="274" cy="184" r="108" fill="rgba(139,92,246,0.1)" stroke="#475569" strokeWidth="2" />
              <line x1="150" y1="184" x2="398" y2="184" stroke="#64748b" strokeWidth="1.4" />
              <line x1="274" y1="60" x2="274" y2="308" stroke="#64748b" strokeWidth="1.4" />
              {(() => {
                const rad = ((primaryVal % 360) * Math.PI) / 180
                const px = 274 + Math.cos(rad) * 108
                const py = 184 - Math.sin(rad) * 108
                return (
                  <g>
                    <line x1="274" y1="184" x2={px} y2={py} stroke="#f59e0b" strokeWidth="3" />
                    <line x1={px} y1={py} x2={px} y2="184" stroke="#10b981" strokeWidth="2.5" strokeDasharray="4 3" />
                    <circle cx={px} cy={py} r="6" fill="#fb7185" />
                  </g>
                )
              })()}
              {targetGlowBox(152, 62, 244, 244, 0)}
            </g>
          )}
          {renderRightTools(535)}
        </g>
      )}

      {/* ══════════════ TURKISH, SOCIAL & ENGLISH INTERACTIVE BOARDS ══════════════ */}
      {(sim.scene === 'turk_sentence_syntax' ||
        sim.scene === 'turk_poetry_prosody' ||
        sim.scene === 'sos_geo_climate_map' ||
        sim.scene === 'sos_history_strategy' ||
        sim.scene === 'eng_dialogue_grammar') && (
        <g>
          {/* Main Interactive Analysis Slate (Left & Center) */}
          <rect x="40" y="46" width="456" height="282" rx="16" fill="#090f1d" stroke="#334155" strokeWidth="2" />
          <rect x="40" y="46" width="456" height="36" rx="14" fill="#131e33" />
          <text x="60" y="69" fill="#38bdf8" fontSize="11.5" fontWeight="800" fontFamily={SVG_FONT}>
            {sim.scenePayload?.displayTitle || sim.title}
          </text>

          {/* Word / Geographic / Grammar Token Chips inside Stage */}
          {sim.scenePayload?.tokens && (
            <g transform="translate(60, 102)">
              {sim.scenePayload.tokens.slice(0, 4).map((tk, ti) => {
                const bx = (ti % 2) * 212
                const by = Math.floor(ti / 2) * 74
                const isLit = primaryVal >= (ti + 1) * 20 || ti === 0
                return (
                  <g key={tk.text} transform={`translate(${bx}, ${by})`}>
                    <rect
                      x="0"
                      y="0"
                      width="198"
                      height="60"
                      rx="10"
                      fill={isLit ? 'rgba(15,23,42,0.95)' : '#0d1526'}
                      stroke={isLit ? tk.color : '#334155'}
                      strokeWidth={isLit ? '2' : '1.2'}
                    />
                    <text x="99" y="25" textAnchor="middle" fill="#ffffff" fontSize={tk.text.length > 26 ? '10.8' : '12'} fontWeight="800" fontFamily={SVG_FONT}>
                      {tk.text}
                    </text>
                    <text x="99" y="46" textAnchor="middle" fill={isLit ? tk.color : '#64748b'} fontSize={tk.role.length > 28 ? '9' : '10'} fontWeight="700" fontFamily={SVG_FONT}>
                      {isLit ? tk.role : 'İnceleniyor...'}
                    </text>
                  </g>
                )
              })}
            </g>
          )}

          {/* Two-Line Couplet / Example / Geographical Telemetry */}
          {sim.scenePayload?.lineA && (() => {
            const [lA1, lA2] = splitTwoLines(sim.scenePayload.lineA, 54)
            return (
              <g transform="translate(60, 268)">
                <text x="0" y="0" fill="#fde68a" fontSize="10.8" fontWeight="700" fontFamily={SVG_FONT}>
                  {lA1}
                </text>
                {lA2 && (
                  <text x="0" y="16" fill="#fde68a" fontSize="10.8" fontWeight="700" fontFamily={SVG_FONT}>
                    {lA2}
                  </text>
                )}
                {sim.scenePayload.lineB && (
                  <text x="0" y={lA2 ? '33' : '18'} fill="#cbd5e1" fontSize="10.5" fontWeight="500" fontFamily={SVG_FONT}>
                    {sim.scenePayload.lineB}
                  </text>
                )}
              </g>
            )
          })()}

          {targetGlowBox(32, 38, 472, 298, 0)}
          {renderRightTools(556)}
        </g>
      )}
    </svg>
  )
}
