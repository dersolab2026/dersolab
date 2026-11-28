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
  actionAnim?: { toolId: string; colorHex: string } | null
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
  actionAnim,
  onSelectTool,
  onTargetClick,
  onClearSelection,
}: SubjectStageRendererProps) {
  const pulseDur = fastForward ? '0.5s' : '1.5s'
  const tools = sim.tools.slice(0, 4)
  const isBiology = sim.scene.startsWith('bio_')
  const isPhysics = sim.scene.startsWith('phys_')

  const targetGlowBox = (x: number, y: number, w: number, h: number, idx: number, rx = 12) =>
    showTargetHighlight ? (
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        rx={rx}
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

  const renderSpillTray = (x: number, y: number, w: number, targetIdx = 0) => (
    <g>
      <rect x={x} y={y} width={w} height="10" rx="4" fill="#cbd5e1" stroke="#94a3b8" strokeWidth="1" />
      <rect x={x + 4} y={y + 2} width={w - 8} height="4" rx="2" fill="#f1f5f9" />
      {targetGlowBox(x - 6, y - 6, w + 12, 22, targetIdx, 7)}
    </g>
  )

  const renderRightTools = (startX = 556) => (
    <g>
      {tools.map((tool, idx) => {
        const tx = startX + idx * 90
        const isSel = selectedToolId === tool.id
        const isBottle = tool.kind === 'bottle'
        const isWeight = tool.kind === 'weight'
        const isAmberGhs = isBottle && idx === 0
        const [sub1, sub2] = splitTwoLines(tool.subLabel, 15)

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
                x="-41"
                y="204"
                width="82"
                height="130"
                rx="10"
                fill="rgba(56,189,248,0.06)"
                stroke="rgba(248,250,252,0.88)"
                strokeWidth="1.6"
                strokeDasharray="5 4"
              />
            )}
            <ellipse cx="0" cy="332" rx="30" ry="4.5" fill="rgba(0,0,0,0.45)" />

            {isBottle && isAmberGhs ? (
              /* Studio Amber GHS Reagent Bottle */
              <g>
                <rect x="-13" y="210" width="26" height="14" rx="3" fill="#e2e8f0" />
                {Array.from({ length: 6 }).map((_, ri) => (
                  <line key={ri} x1={-10 + ri * 4} y1="211" x2={-10 + ri * 4} y2="223" stroke="#94a3b8" strokeWidth="1" />
                ))}
                <path
                  d="M -11 224 L -11 230 Q -28 238 -28 250 L -28 320 Q -28 328 -22 328 L 22 328 Q 28 328 28 320 L 28 250 Q 28 238 11 230 L 11 224 Z"
                  fill="url(#sharedAmberGrad)"
                  stroke="rgba(255,255,255,0.22)"
                  strokeWidth="1.5"
                />
                <rect x="-23" y="250" width="46" height="62" rx="3" fill="#f8fafc" />
                <text x="0" y="268" textAnchor="middle" fill="#0f172a" fontSize={tool.label.length > 8 ? '7.6' : '9.8'} fontWeight="800" fontFamily={SVG_FONT}>
                  {tool.label}
                </text>
                <text x="0" y="280" textAnchor="middle" fill="#475569" fontSize="6.4" fontWeight="600" fontFamily={SVG_FONT}>
                  {sub1}
                </text>
                <g transform="translate(0, 297) rotate(45)">
                  <rect x="-8" y="-8" width="16" height="16" fill="#ffffff" stroke="#dc2626" strokeWidth="2.1" />
                </g>
                <circle cx="0" cy="300" r="2.6" fill="none" stroke="#0f172a" strokeWidth="1.3" />
                <path d="M 0 292.5 Q 2.8 295.5 0 298 Q -2.8 295.5 0 292.5 Z" fill="#0f172a" />
              </g>
            ) : isBottle ? (
              /* Studio Wide Shouldered Glass Solution Bottle */
              <g>
                <rect x="-13" y="210" width="26" height="15" rx="3" fill={tool.colorHex} />
                <g clipPath="url(#sharedWideBottleClip)">
                  <rect x="-26" y="246" width="52" height="80" fill={tool.colorHex} opacity="0.48" />
                </g>
                <path
                  d="M -11 225 L -11 231 Q -28 239 -28 251 L -28 321 Q -28 328 -22 328 L 22 328 Q 28 328 28 321 L 28 251 Q 28 239 11 231 L 11 225 Z"
                  fill="url(#sharedGlassGrad)"
                  stroke="rgba(203,213,225,0.68)"
                  strokeWidth="1.6"
                />
                <rect x="-24" y="256" width="48" height="46" rx="3" fill="#f8fafc" />
                <rect x="-24" y="256" width="48" height="4.5" rx="1.5" fill={tool.colorHex} />
                <text
                  x="0"
                  y="275"
                  textAnchor="middle"
                  fill="#0f172a"
                  fontSize={tool.label.length > 7 ? '7.5' : '9.8'}
                  fontWeight="800"
                  fontFamily={SVG_FONT}
                >
                  {tool.label}
                </text>
                <text x="0" y="289" textAnchor="middle" fill="#475569" fontSize="6.4" fontWeight="600" fontFamily={SVG_FONT}>
                  {sub1}
                </text>
                {sub2 && (
                  <text x="0" y="298" textAnchor="middle" fill="#475569" fontSize="6.0" fontWeight="600" fontFamily={SVG_FONT}>
                    {sub2}
                  </text>
                )}
              </g>
            ) : isWeight ? (
              /* Slotted Calibration Brass / Steel Weight */
              <g>
                <circle cx="0" cy="249" r="5.5" fill="none" stroke="#94a3b8" strokeWidth="2.5" />
                <rect x="-23" y="259" width="46" height="69" rx="6" fill="#334155" stroke="#64748b" strokeWidth="1.6" />
                <rect x="-19" y="263" width="38" height="8" rx="2" fill={tool.colorHex} opacity="0.88" />
                <text x="0" y="291" textAnchor="middle" fill="#ffffff" fontSize="11" fontWeight="800" fontFamily={SVG_FONT} style={{ fontVariantNumeric: 'tabular-nums' }}>
                  {tool.label}
                </text>
                <text x="0" y="307" textAnchor="middle" fill="#cbd5e1" fontSize="6.8" fontWeight="600" fontFamily={SVG_FONT}>
                  {sub1}
                </text>
                {sub2 && (
                  <text x="0" y="317" textAnchor="middle" fill="#94a3b8" fontSize="6.3" fontWeight="600" fontFamily={SVG_FONT}>
                    {sub2}
                  </text>
                )}
              </g>
            ) : (
              /* Precision Studio Instrument / Interactive Module Card */
              <g>
                <rect
                  x="-37"
                  y="234"
                  width="74"
                  height="95"
                  rx="9"
                  fill="#0f172a"
                  stroke={isSel ? tool.colorHex : '#334155'}
                  strokeWidth="1.8"
                />
                <rect x="-37" y="234" width="74" height="10" rx="4" fill={tool.colorHex} opacity="0.88" />
                <text
                  x="0"
                  y="268"
                  textAnchor="middle"
                  fill="#ffffff"
                  fontSize={tool.label.length > 10 ? '7.8' : tool.label.length > 7 ? '8.8' : '10.2'}
                  fontWeight="800"
                  fontFamily={SVG_FONT}
                >
                  {tool.label}
                </text>
                <text x="0" y={sub2 ? '283' : '289'} textAnchor="middle" fill="#94a3b8" fontSize={sub1.length > 14 ? '6.4' : '7.1'} fontWeight="600" fontFamily={SVG_FONT}>
                  {sub1}
                </text>
                {sub2 && (
                  <text x="0" y="293" textAnchor="middle" fill="#94a3b8" fontSize={sub2.length > 14 ? '6.4' : '6.9'} fontWeight="600" fontFamily={SVG_FONT}>
                    {sub2}
                  </text>
                )}
                <rect x="-20" y="308" width="40" height="12" rx="4" fill="rgba(56,189,248,0.14)" stroke="rgba(56,189,248,0.35)" strokeWidth="0.8" />
                <text x="0" y="317" textAnchor="middle" fill="#7dd3fc" fontSize="7" fontWeight="700" fontFamily={SVG_FONT}>
                  SEÇ
                </text>
              </g>
            )}
          </g>
        )
      })}
    </g>
  )

  return (
    <svg
      viewBox="0 0 920 430"
      className="w-full h-auto max-h-[430px] select-none cursor-default"
      role="img"
      aria-label={`${sim.title} İnteraktif Simülasyon Sahnesi`}
    >
      <defs>
        <linearGradient id="sharedBenchGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#263142" />
          <stop offset="32%" stopColor="#1b2432" />
          <stop offset="100%" stopColor="#0f1520" />
        </linearGradient>
        <linearGradient id="sharedGlassGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="rgba(255,255,255,0.22)" />
          <stop offset="20%" stopColor="rgba(255,255,255,0.06)" />
          <stop offset="65%" stopColor="rgba(255,255,255,0.02)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0.22)" />
        </linearGradient>
        <linearGradient id="sharedAmberGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#7c4f2b" />
          <stop offset="30%" stopColor="#653f21" />
          <stop offset="75%" stopColor="#523219" />
          <stop offset="100%" stopColor="#7c4f2b" />
        </linearGradient>
        <pattern id="sharedLabGrid" width="46" height="46" patternUnits="userSpaceOnUse">
          <path d="M 46 0 L 0 0 0 46" fill="none" stroke="rgba(148,163,184,0.075)" strokeWidth="1" />
        </pattern>
        <clipPath id="sharedWideBottleClip">
          <rect x="-26" y="232" width="52" height="90" rx="7" />
        </clipPath>
      </defs>

      {/* Blueprint Grid Background + Slate Benchtop */}
      <rect x="0" y="0" width="920" height="335" fill="#101826" onClick={onClearSelection} />
      <rect x="0" y="0" width="920" height="335" fill="url(#sharedLabGrid)" pointerEvents="none" />
      <rect x="0" y="330" width="920" height="100" fill="url(#sharedBenchGrad)" onClick={onClearSelection} />
      <line x1="0" y1="330" x2="920" y2="330" stroke="rgba(148,163,184,0.22)" strokeWidth="1.5" />

      {/* ══════════════ PHYSICS SCENES ══════════════ */}
      {sim.scene === 'phys_spring_dynamo' && (
        <g>
          {/* Stand + Reference Spill Tray */}
          <rect x="92" y="322" width="170" height="8" rx="3" fill="#475569" />
          <rect x="114" y="54" width="10" height="270" rx="3" fill="#64748b" />
          <rect x="120" y="64" width="140" height="7" rx="3" fill="#94a3b8" />
          {/* Calibrated Vertical Ruler */}
          <rect x="305" y="76" width="26" height="240" rx="4" fill="#1e293b" stroke="#475569" strokeWidth="1.4" />
          {[0, 2, 4, 6, 8, 10, 12].map((cm, idx) => (
            <g key={cm}>
              <line x1="305" y1={96 + idx * 32} x2="316" y2={96 + idx * 32} stroke="#94a3b8" strokeWidth="1.2" />
              <text x="321" y={100 + idx * 32} fill="#cbd5e1" fontSize="8" fontWeight="600" fontFamily={SVG_FONT} style={{ fontVariantNumeric: 'tabular-nums' }}>
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
          {/* Digital Force Pill + Secondary Reference Block */}
          <g transform="translate(358, 108)">
            <rect x="0" y="0" width="146" height="58" rx="12" fill="#090D16" stroke="rgba(56,189,248,0.5)" strokeWidth="1.5" />
            <text x="73" y="21" textAnchor="middle" fill="#7dd3fc" fontSize="9.5" fontWeight="700" fontFamily={SVG_FONT}>
              DİNAMOMETRE OKUMASI
            </text>
            <text x="73" y="45" textAnchor="middle" fill="#ffffff" fontSize="18" fontWeight="800" fontFamily={SVG_FONT} style={{ fontVariantNumeric: 'tabular-nums' }}>
              {fmtTr(primaryVal, 1)} N · {fmtTr(secondaryVal, 1)} cm
            </text>
          </g>
          {targetGlowBox(176, 56, 114, 276, 0)}
          {targetGlowBox(300, 72, 36, 250, 1, 8)}
          {renderRightTools(556)}
        </g>
      )}

      {sim.scene === 'phys_buoyancy_overflow' && (
        <g>
          {renderSpillTray(82, 322, 186, 0)}
          <rect x="96" y="138" width="150" height="184" fill="rgba(56,189,248,0.34)" />
          <path d="M 94 106 L 94 322 L 248 322 L 248 156 L 278 164" fill="url(#sharedGlassGrad)" stroke="#cbd5e1" strokeWidth="2.2" />
          {(() => {
            const sinkY = primaryVal > 1 ? 244 : primaryVal > 0.7 ? 166 : 120
            return (
              <g transform={`translate(170, ${sinkY})`}>
                <line x1="0" y1="-82" x2="0" y2="0" stroke="#94a3b8" strokeWidth="2" />
                <rect x="-26" y="0" width="52" height="52" rx="6" fill="#f59e0b" stroke="#fde68a" strokeWidth="1.5" />
                <text x="0" y="30" textAnchor="middle" fill="#0f172a" fontSize="11" fontWeight="800" fontFamily={SVG_FONT} style={{ fontVariantNumeric: 'tabular-nums' }}>
                  d={fmtTr(primaryVal, 1)}
                </text>
              </g>
            )
          })()}
          <g transform="translate(342, 0)">
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
          </g>
          {targetGlowBox(84, 96, 200, 240, 0)}
          {targetGlowBox(304, 124, 76, 214, 1)}
          {renderRightTools(556)}
        </g>
      )}

      {sim.scene === 'phys_torricelli_pressure' && (
        <g>
          {renderSpillTray(110, 322, 240, 0)}
          <rect x="120" y="266" width="220" height="56" rx="6" fill="url(#sharedGlassGrad)" stroke="#cbd5e1" strokeWidth="2" />
          <rect x="124" y="284" width="212" height="36" rx="4" fill="#94a3b8" />
          <rect x="216" y="72" width="28" height="230" rx="8" fill="url(#sharedGlassGrad)" stroke="#cbd5e1" strokeWidth="2" />
          {(() => {
            const hPx = Math.min(185, Math.max(30, primaryVal * 2.2))
            return <rect x="219" y={286 - hPx} width="22" height={hPx} fill="#cbd5e1" />
          })()}
          <g transform="translate(278, 118)">
            <rect x="0" y="0" width="150" height="58" rx="12" fill="#090D16" stroke="rgba(16,185,129,0.5)" strokeWidth="1.5" />
            <text x="75" y="21" textAnchor="middle" fill="#6ee7b7" fontSize="9.5" fontWeight="700" fontFamily={SVG_FONT}>
              BAROMETRE / BASINÇ
            </text>
            <text x="75" y="45" textAnchor="middle" fill="#ffffff" fontSize="18" fontWeight="800" fontFamily={SVG_FONT} style={{ fontVariantNumeric: 'tabular-nums' }}>
              {fmtTr(primaryVal, 1)} {sim.metricPrimaryUnit}
            </text>
          </g>
          {targetGlowBox(112, 64, 240, 272, 0)}
          {targetGlowBox(272, 112, 162, 70, 1)}
          {renderRightTools(556)}
        </g>
      )}

      {sim.scene === 'phys_circuit_ohm' && (
        <g>
          <rect x="76" y="180" width="110" height="148" rx="10" fill="#1e293b" stroke="#475569" strokeWidth="2" />
          <text x="131" y="205" textAnchor="middle" fill="#fde047" fontSize="10" fontWeight="800" fontFamily={SVG_FONT}>
            GÜÇ KAYNAĞI
          </text>
          <rect x="92" y="220" width="78" height="36" rx="6" fill="#090D16" stroke="#eab308" strokeWidth="1.3" />
          <text x="131" y="244" textAnchor="middle" fill="#ffffff" fontSize="16" fontWeight="800" fontFamily={SVG_FONT} style={{ fontVariantNumeric: 'tabular-nums' }}>
            {fmtTr(primaryVal, 1)} V
          </text>
          <path d="M 186 210 L 420 210 L 420 294 L 186 294" fill="none" stroke="#f59e0b" strokeWidth="4" />
          <g transform="translate(310, 210)">
            <circle cx="0" cy="-22" r={18 + Math.min(28, primaryVal * 1.5)} fill="#fde047" opacity={Math.min(0.45, primaryVal / 24)} />
            <circle cx="0" cy="-22" r="20" fill={primaryVal > 0 ? 'rgba(253,224,71,0.55)' : 'rgba(148,163,184,0.18)'} stroke="#cbd5e1" strokeWidth="2" />
            <rect x="-10" y="-4" width="20" height="12" rx="2" fill="#64748b" />
          </g>
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
          {targetGlowBox(68, 170, 128, 166, 0)}
          {targetGlowBox(256, 152, 232, 178, 1)}
          {renderRightTools(556)}
        </g>
      )}

      {sim.scene === 'phys_optics_bench' && (
        <g>
          <rect x="66" y="294" width="440" height="14" rx="4" fill="#334155" stroke="#475569" strokeWidth="1.4" />
          <line x1="80" y1="196" x2="490" y2="196" stroke="rgba(148,163,184,0.35)" strokeDasharray="6 4" strokeWidth="1.2" />
          <rect x="74" y="176" width="56" height="40" rx="6" fill="#1e293b" stroke="#f43f5e" strokeWidth="1.8" />
          <circle cx="130" cy="196" r="4" fill="#fb7185" />
          <ellipse cx="275" cy="196" rx="13" ry="74" fill="rgba(56,189,248,0.28)" stroke="#7dd3fc" strokeWidth="2.2" />
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
          {targetGlowBox(62, 114, 240, 200, 0)}
          {targetGlowBox(314, 114, 182, 200, 1)}
          {renderRightTools(556)}
        </g>
      )}

      {sim.scene === 'phys_dynamics_ramp' && (
        <g>
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
          {targetGlowBox(74, 138, 376, 196, 0)}
          {renderRightTools(556)}
        </g>
      )}

      {/* ══════════════ BIOLOGY SCENES ══════════════ */}
      {(sim.scene === 'bio_reagent_tubes' || sim.scene === 'bio_blood_typing' || sim.scene === 'bio_elodea_photosynthesis' || sim.scene === 'bio_osmosis_utube') && (
        <g>
          {sim.scene === 'bio_reagent_tubes' && (
            <g>
              {renderSpillTray(82, 322, 396, 0)}
              <rect x="90" y="310" width="380" height="12" rx="5" fill="#334155" />
              <rect x="98" y="176" width="364" height="8" rx="4" fill="#475569" />
              {['Tüp 1', 'Tüp 2', 'Tüp 3', 'Kontrol'].map((lbl, i) => {
                const x = 148 + i * 88
                const active = i === 0 || primaryVal > i * 25
                const fillC = i === 0 ? '#6366f1' : i === 1 ? '#f97316' : i === 2 ? '#a855f7' : '#38bdf8'
                return (
                  <g key={lbl} transform={`translate(${x}, 0)`}>
                    <rect x="-15" y="202" width="30" height="104" rx="14" fill={active ? fillC : 'rgba(148,163,184,0.2)'} opacity="0.86" />
                    <rect x="-16" y="132" width="32" height="176" rx="15" fill="url(#sharedGlassGrad)" stroke="#cbd5e1" strokeWidth="1.8" />
                    <text x="0" y="346" textAnchor="middle" fill="#cbd5e1" fontSize="9.5" fontWeight="600" fontFamily={SVG_FONT}>
                      {lbl}
                    </text>
                  </g>
                )
              })}
              {targetGlowBox(80, 120, 290, 212, 0)}
              {targetGlowBox(378, 120, 96, 212, 1)}
            </g>
          )}

          {sim.scene === 'bio_blood_typing' && (
            <g>
              {renderSpillTray(88, 318, 404, 0)}
              <rect x="95" y="186" width="390" height="128" rx="22" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="2.5" />
              {[
                { lbl: 'Anti-A', x: 170, clump: primaryVal >= 1 },
                { lbl: 'Anti-B', x: 290, clump: secondaryVal >= 1 },
                { lbl: 'Anti-D (Rh)', x: 410, clump: tertiaryVal >= 1 },
              ].map((w) => (
                <g key={w.lbl} transform={`translate(${w.x}, 250)`}>
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
              {targetGlowBox(84, 174, 412, 152, 0)}
            </g>
          )}

          {sim.scene === 'bio_elodea_photosynthesis' && (
            <g>
              {renderSpillTray(118, 322, 184, 0)}
              <rect x="130" y="168" width="160" height="154" fill="rgba(56,189,248,0.28)" />
              <path d="M 128 148 L 128 322 L 292 322 L 292 148" fill="url(#sharedGlassGrad)" stroke="#cbd5e1" strokeWidth="2" />
              <path d="M 210 314 C 196 286, 224 260, 206 232" fill="none" stroke="#10b981" strokeWidth="6" strokeLinecap="round" />
              <polygon points="168,286 252,286 218,214 202,214" fill="rgba(226,232,240,0.22)" stroke="#94a3b8" strokeWidth="1.5" />
              <rect x="196" y="88" width="28" height="126" rx="12" fill="url(#sharedGlassGrad)" stroke="#cbd5e1" strokeWidth="1.8" />
              <rect x="198" y="90" width="24" height={Math.min(72, 14 + primaryVal * 1.2)} rx="8" fill="rgba(224,242,254,0.55)" />
              {primaryVal > 0 && (
                <circle cx="210" cy="210" r="4" fill="#e0f2fe">
                  <animate attributeName="cy" values="236;125" dur={pulseDur} repeatCount="indefinite" />
                </circle>
              )}
              <g transform="translate(362, 170)">
                <rect x="0" y="0" width="96" height="62" rx="10" fill="#090D16" stroke="#10b981" strokeWidth="1.6" />
                <text x="48" y="22" textAnchor="middle" fill="#6ee7b7" fontSize="9.5" fontWeight="700" fontFamily={SVG_FONT}>
                  O₂ HIZI
                </text>
                <text x="48" y="47" textAnchor="middle" fill="#ffffff" fontSize="18" fontWeight="800" fontFamily={SVG_FONT} style={{ fontVariantNumeric: 'tabular-nums' }}>
                  {fmtTr(primaryVal, 0)} {sim.metricPrimaryUnit}
                </text>
              </g>
              {targetGlowBox(118, 80, 186, 250, 0)}
              {targetGlowBox(354, 162, 112, 78, 1)}
            </g>
          )}

          {sim.scene === 'bio_osmosis_utube' && (
            <g>
              {renderSpillTray(144, 322, 232, 0)}
              <path d="M 180 120 L 180 280 Q 260 332 340 280 L 340 120" fill="none" stroke="rgba(203,213,225,0.68)" strokeWidth="42" strokeLinecap="round" />
              <path d={`M 180 ${230 - Math.min(75, secondaryVal * 2)} L 180 280 Q 260 330 340 280 L 340 ${230 - Math.min(85, primaryVal * 2)}`} fill="none" stroke="rgba(56,189,248,0.55)" strokeWidth="34" />
              <line x1="260" y1="282" x2="260" y2="328" stroke="#f59e0b" strokeDasharray="4 4" strokeWidth="4" />
              <text x="260" y="348" textAnchor="middle" fill="#fbbf24" fontSize="9.5" fontWeight="700" fontFamily={SVG_FONT}>
                Yarı Geçirgen Zar
              </text>
              {targetGlowBox(140, 108, 120, 224, 0)}
              {targetGlowBox(262, 108, 118, 224, 1)}
            </g>
          )}
          {renderRightTools(556)}
        </g>
      )}

      {sim.scene === 'bio_microscope_slide' && (
        <g>
          <rect x="86" y="314" width="126" height="16" rx="5" fill="#334155" />
          <path d="M 122 314 L 122 184 Q 122 140 165 140" fill="none" stroke="#64748b" strokeWidth="16" strokeLinecap="round" />
          <rect x="112" y="226" width="98" height="10" rx="3" fill="#475569" />
          <rect x="150" y="102" width="30" height="72" rx="6" fill="#94a3b8" transform="rotate(-14, 165, 138)" />
          <circle cx="364" cy="190" r="108" fill="#09111f" stroke="#10b981" strokeWidth="3.5" />
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
          {targetGlowBox(76, 132, 152, 200, 0)}
          {targetGlowBox(246, 74, 236, 256, 1)}
          {renderRightTools(556)}
        </g>
      )}

      {/* ══════════════ MATHEMATICS SCENES ══════════════ */}
      {(sim.scene === 'math_coord_plotter' || sim.scene === 'math_equation_balance' || sim.scene === 'math_geometry_proof' || sim.scene === 'math_unit_circle_prob') && (
        <g>
          {sim.scene === 'math_coord_plotter' && (
            <g>
              <rect x="44" y="166" width="448" height="164" rx="14" fill="#090f1d" stroke="#334155" strokeWidth="1.8" />
              <line x1="268" y1="174" x2="268" y2="322" stroke="#64748b" strokeWidth="1.5" />
              <line x1="58" y1="248" x2="478" y2="248" stroke="#64748b" strokeWidth="1.5" />
              <path
                d={`M 74 ${302 - Math.min(110, Math.abs(primaryVal) * 5)} Q 268 ${248 - secondaryVal * 4} 462 ${186 - Math.min(18, primaryVal * 1.5)}`}
                fill="none"
                stroke="#a78bfa"
                strokeWidth="3.2"
                strokeLinecap="round"
              />
              <circle cx="268" cy={248 - secondaryVal * 2.5} r="5.5" fill="#f43f5e" stroke="#ffffff" strokeWidth="1.5" />
              <text x="268" y="345" textAnchor="middle" fill="#cbd5e1" fontSize="10" fontWeight="700" fontFamily={SVG_FONT}>
                {statusLabel}
              </text>
              {targetGlowBox(38, 160, 460, 176, 0)}
            </g>
          )}

          {sim.scene === 'math_equation_balance' && (
            <g>
              <polygon points="260,324 290,324 275,188" fill="#475569" />
              <rect x="115" y="182" width="320" height="8" rx="4" fill="#94a3b8" />
              <rect x="112" y="218" width="98" height="12" rx="4" fill="#64748b" />
              <rect x="340" y="218" width="98" height="12" rx="4" fill="#64748b" />
              <rect x="128" y="164" width="66" height="48" rx="8" fill="#7c3aed" />
              <text x="161" y="193" textAnchor="middle" fill="#ffffff" fontSize="12.5" fontWeight="800" fontFamily={SVG_FONT} style={{ fontVariantNumeric: 'tabular-nums' }}>
                {sim.metricPrimaryLabel}: {fmtTr(primaryVal, 0)}
              </text>
              <rect x="356" y="164" width="66" height="48" rx="8" fill="#0ea5e9" />
              <text x="389" y="193" textAnchor="middle" fill="#ffffff" fontSize="12.5" fontWeight="800" fontFamily={SVG_FONT} style={{ fontVariantNumeric: 'tabular-nums' }}>
                Sağ: {fmtTr(secondaryVal, 0)}
              </text>
              {targetGlowBox(102, 152, 118, 174, 0)}
              {targetGlowBox(330, 152, 118, 174, 1)}
            </g>
          )}

          {sim.scene === 'math_geometry_proof' && (
            <g>
              <rect x="44" y="166" width="448" height="164" rx="14" fill="#090f1d" stroke="#334155" strokeWidth="1.8" />
              <polygon points="150,304 150,194 385,304" fill="rgba(56,189,248,0.16)" stroke="#38bdf8" strokeWidth="3" />
              <rect x="150" y="286" width="18" height="18" fill="none" stroke="#fbbf24" strokeWidth="2" />
              <text x="132" y="252" textAnchor="end" fill="#fbbf24" fontSize="12.5" fontWeight="800" fontFamily={SVG_FONT} style={{ fontVariantNumeric: 'tabular-nums' }}>
                {fmtTr(primaryVal, 1)}
              </text>
              <text x="268" y="322" textAnchor="middle" fill="#34d399" fontSize="12.5" fontWeight="800" fontFamily={SVG_FONT} style={{ fontVariantNumeric: 'tabular-nums' }}>
                {fmtTr(secondaryVal, 1)}
              </text>
              <text x="285" y="240" fill="#f472b6" fontSize="12.5" fontWeight="800" fontFamily={SVG_FONT}>
                {statusLabel}
              </text>
              {targetGlowBox(38, 160, 460, 176, 0)}
            </g>
          )}

          {sim.scene === 'math_unit_circle_prob' && (
            <g>
              <circle cx="292" cy="212" r="96" fill="rgba(139,92,246,0.1)" stroke="#475569" strokeWidth="2" />
              <line x1="176" y1="212" x2="408" y2="212" stroke="#64748b" strokeWidth="1.4" />
              <line x1="292" y1="96" x2="292" y2="328" stroke="#64748b" strokeWidth="1.4" />
              {(() => {
                const rad = ((primaryVal % 360) * Math.PI) / 180
                const px = 292 + Math.cos(rad) * 96
                const py = 212 - Math.sin(rad) * 96
                return (
                  <g>
                    <line x1="292" y1="212" x2={px} y2={py} stroke="#f59e0b" strokeWidth="3" />
                    <line x1={px} y1={py} x2={px} y2="212" stroke="#10b981" strokeWidth="2.5" strokeDasharray="4 3" />
                    <circle cx={px} cy={py} r="6" fill="#fb7185" />
                  </g>
                )
              })()}
              {targetGlowBox(182, 102, 220, 224, 0)}
            </g>
          )}
          {renderRightTools(556)}
        </g>
      )}

      {/* ══════════════ TURKISH, SOCIAL & ENGLISH INTERACTIVE BOARDS ══════════════ */}
      {(sim.scene === 'turk_sentence_syntax' ||
        sim.scene === 'turk_poetry_prosody' ||
        sim.scene === 'sos_geo_climate_map' ||
        sim.scene === 'sos_history_strategy' ||
        sim.scene === 'eng_dialogue_grammar') && (
        <g>
          {/* Main Interactive Analysis Slate positioned completely below the top-left Popover */}
          <rect x="40" y="166" width="456" height="164" rx="14" fill="#090f1d" stroke="#334155" strokeWidth="2" />
          <rect x="40" y="166" width="456" height="24" rx="12" fill="#131e33" />
          <text x="58" y="182" fill="#38bdf8" fontSize="10.4" fontWeight="800" fontFamily={SVG_FONT}>
            {sim.scenePayload?.displayTitle || sim.title}
          </text>
          {sim.scene === 'sos_history_strategy' && (
            <g transform="translate(362, 170)">
              <rect x="0" y="0" width="122" height="16" rx="6" fill="rgba(245,158,11,0.16)" stroke="rgba(245,158,11,0.5)" strokeWidth="0.9" />
              <circle cx="9" cy="8" r="2.6" fill="#fbbf24" />
              <text x="16" y="11" fill="#fde047" fontSize="7.4" fontWeight="800" fontFamily={SVG_FONT}>
                Taktik Harita Modu Aktif
              </text>
            </g>
          )}

          {sim.scenePayload?.tokens && (
            <g transform="translate(58, 196)">
              {sim.scenePayload.tokens.slice(0, 4).map((tk, ti) => {
                const bx = (ti % 2) * 212
                const by = Math.floor(ti / 2) * 45
                const isLit = primaryVal >= (ti + 1) * 20 || ti === 0
                return (
                  <g key={tk.text} transform={`translate(${bx}, ${by})`}>
                    <rect
                      x="0"
                      y="0"
                      width="202"
                      height="39"
                      rx="8"
                      fill={isLit ? 'rgba(15,23,42,0.95)' : '#0d1526'}
                      stroke={isLit ? tk.color : '#334155'}
                      strokeWidth={isLit ? '1.8' : '1.1'}
                    />
                    <text x="101" y="16.5" textAnchor="middle" fill="#ffffff" fontSize={tk.text.length > 25 ? '9.6' : '10.6'} fontWeight="800" fontFamily={SVG_FONT}>
                      {tk.text}
                    </text>
                    <text x="101" y="31.5" textAnchor="middle" fill={isLit ? tk.color : '#64748b'} fontSize={tk.role.length > 26 ? '8.2' : '9.0'} fontWeight="700" fontFamily={SVG_FONT}>
                      {isLit ? tk.role : 'İnceleniyor...'}
                    </text>
                  </g>
                )
              })}
            </g>
          )}

          {sim.scenePayload?.lineA && (() => {
            const [lA1, lA2] = splitTwoLines(sim.scenePayload.lineA, 58)
            return (
              <g transform="translate(58, 299)">
                <text x="0" y="0" fill="#fde68a" fontSize="9.8" fontWeight="700" fontFamily={SVG_FONT}>
                  {lA1}
                </text>
                {lA2 && (
                  <text x="0" y="12.5" fill="#fde68a" fontSize="9.8" fontWeight="700" fontFamily={SVG_FONT}>
                    {lA2}
                  </text>
                )}
                {sim.scenePayload.lineB && (
                  <text x="0" y={lA2 ? '24' : '14'} fill="#cbd5e1" fontSize="9.5" fontWeight="500" fontFamily={SVG_FONT}>
                    {sim.scenePayload.lineB}
                  </text>
                )}
              </g>
            )
          })()}

          {targetGlowBox(32, 160, 472, 176, 0)}
          {renderRightTools(556)}
        </g>
      )}

      {/* ══════════════ FOREGROUND BENCH PRECISION INSTRUMENT + STIRRING ROD (MATCHING CHEMBENCHSTAGE) ══════════════ */}
      <g transform="translate(292, 378)">
        {showTargetHighlight && (
          <rect x="-86" y="-12" width="172" height="24" rx="7" fill="none" stroke="rgba(234,179,8,0.68)" strokeWidth="1.8" />
        )}
        <rect x="-78" y="-4.5" width="156" height="9" rx="4.5" fill="rgba(226,232,240,0.22)" stroke="#94a3b8" strokeWidth="1.1" />
        <circle cx="-71" cy="0" r="5.5" fill={isPhysics ? '#38bdf8' : isBiology ? '#10b981' : '#ef4444'} />
        <rect
          x="-65"
          y="-1.6"
          width={Math.min(110, Math.max(26, 26 + (Math.abs(primaryVal) % 85)))}
          height="3.2"
          rx="1.4"
          fill={isPhysics ? '#38bdf8' : isBiology ? '#10b981' : '#ef4444'}
        />
        {Array.from({ length: 13 }).map((_, ti) => (
          <line key={ti} x1={-46 + ti * 9} y1="-4" x2={-46 + ti * 9} y2={ti % 4 === 0 ? '2' : '-1'} stroke="#cbd5e1" strokeWidth="0.85" />
        ))}
      </g>

      <g transform="translate(565, 378)">
        <rect x="-64" y="-2.2" width="128" height="4.4" rx="2.2" fill="#c29b61" stroke="rgba(255,255,255,0.2)" strokeWidth="0.6" />
      </g>

      {/* ══════════════ ACTIVE STEP / DOSE ANIMATION STREAM ══════════════ */}
      {actionAnim && (
        <g transform="translate(245, 58)">
          <g transform="rotate(-48)">
            <rect x="-14" y="-34" width="28" height="60" rx="5" fill="url(#sharedGlassGrad)" stroke="#cbd5e1" strokeWidth="1.5" />
            <rect x="-7" y="-44" width="14" height="10" rx="2" fill={actionAnim.colorHex} />
          </g>
          <line
            x1="-28"
            y1="14"
            x2="-34"
            y2="132"
            stroke={actionAnim.colorHex}
            strokeWidth="5"
            strokeLinecap="round"
          >
            <animate attributeName="opacity" values="0.95;0.15" dur="0.65s" repeatCount="1" />
          </line>
        </g>
      )}
    </svg>
  )
}
