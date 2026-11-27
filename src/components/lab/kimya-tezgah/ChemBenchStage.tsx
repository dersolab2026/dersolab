'use client'

import React, { useMemo, useRef, useState } from 'react'
import {
  Thermometer,
  Droplet,
  Zap,
  Play,
  AlertTriangle,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  FlaskConical,
  Flame,
  Atom,
  Hand,
} from 'lucide-react'
import {
  CHEM_LAB_ITEMS,
  type ChemExperiment,
  type ChemExperimentStep,
  type ChemLabItem,
  type VisualPreset,
} from './chemExperimentsData'

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
  onSelectBenchMaterial?: (itemId: string) => void
  onSelectSandboxVessel?: (v: 'beher' | 'erlen' | 'balon_joje' | 'deney_tupu') => void
  onResetBench?: () => void
}

interface BenchEntity {
  id: string
  kind: 'erlen' | 'beher' | 'bottle' | 'jar' | 'tube_rack' | 'burette' | 'electro' | 'flame' | 'funnel' | 'balance'
  label: string
  formula?: string
  subLabel?: string
  x: number
  colorHex: string
  capColor?: string
  isSolid?: boolean
  vesselRole?: 'primary' | 'secondary' | 'aux1' | 'aux2'
}

interface DragState {
  entityId: string
  itemId: string
  startX: number
  startY: number
  currentX: number
  currentY: number
  moved: boolean
}

interface PourAnimationState {
  itemId: string
  targetX: number
  color: string
  isSolid: boolean
}

const SVG_FONT = "var(--font-sans), 'Inter', system-ui, -apple-system, sans-serif"

function formatTrDecimal(value: number, digits = 1): string {
  return value.toFixed(digits).replace('.', ',')
}

const SOLID_ITEM_IDS = new Set([
  'ki',
  'pbno3',
  'karbonat',
  'tuz',
  'kum',
  'naoh_kati',
  'mg_serit',
  'licl',
  'kcl',
  'cacl2',
  'cucl2',
  'srcl2',
  'nh4no3',
  'na2so4',
  'iyot',
  'limon_tuzu',
  'agno3',
  'al_folyo',
  'kno3',
  'seker',
  'buz',
])

function getReagentMeta(item: ChemLabItem): { title: string; sub: string; capColor: string; isSolid: boolean } {
  const isSolid = SOLID_ITEM_IDS.has(item.id)
  if (item.id === 'h2o2') return { title: 'H₂O₂', sub: '%30', capColor: '#64748b', isSolid: false }
  if (item.id === 'deterjan') return { title: 'DETERJAN', sub: '%10 çözelti', capColor: '#10b981', isSolid: false }
  if (item.id === 'ki') return { title: 'KI', sub: 'potasyum iyodür', capColor: '#475569', isSolid: true }
  if (item.id === 'pbno3') return { title: 'Pb(NO₃)₂', sub: 'zehirli', capColor: '#475569', isSolid: true }
  if (item.id === 'hcl' || item.id === 'hcl_1m' || item.id === 'derisik_hcl')
    return { title: 'HCl', sub: item.id === 'derisik_hcl' ? '%37 derişik' : '1 M çözelti', capColor: '#f43f5e', isSolid: false }
  if (item.id === 'naoh' || item.id === 'naoh_1m')
    return { title: 'NaOH', sub: '1 M baz', capColor: '#a855f7', isSolid: false }
  if (item.id === 'fenolftalein') return { title: 'FENOL.', sub: 'indikatör', capColor: '#ec4899', isSolid: false }
  if (item.id === 'metil_oranj') return { title: 'METİL O.', sub: 'indikatör', capColor: '#f97316', isSolid: false }
  if (item.id === 'bromtimol') return { title: 'BROMTİMOL', sub: 'indikatör', capColor: '#22c55e', isSolid: false }
  if (item.id === 'saf_su') return { title: 'H₂O', sub: 'saf su', capColor: '#0ea5e9', isSolid: false }
  if (item.id === 'sirke') return { title: 'CH₃COOH', sub: '%5 sirke', capColor: '#eab308', isSolid: false }
  if (item.id === 'cuso4') return { title: 'CuSO₄', sub: '0,5 M çözelti', capColor: '#0284c7', isSolid: false }
  if (item.id === 'znso4') return { title: 'ZnSO₄', sub: '0,5 M çözelti', capColor: '#64748b', isSolid: false }
  if (item.id === 'karbonat') return { title: 'NaHCO₃', sub: 'karbonat', capColor: '#475569', isSolid: true }
  return {
    title: item.formula || item.name.split(' ')[0].toUpperCase().slice(0, 9),
    sub: isSolid ? 'katı reaktif' : 'çözelti',
    capColor: isSolid ? '#475569' : '#38bdf8',
    isSolid,
  }
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
  onSelectBenchMaterial,
  onSelectSandboxVessel,
  onResetBench,
}: ChemBenchStageProps) {
  const preset: VisualPreset = isSandbox ? 'beaker_heat' : experiment.visualPreset
  const svgRef = useRef<SVGSVGElement>(null)

  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [panX, setPanX] = useState(0)
  const [dragState, setDragState] = useState<DragState | null>(null)
  const [hoverVesselId, setHoverVesselId] = useState<string | null>(null)
  const [pourAnim, setPourAnim] = useState<PourAnimationState | null>(null)

  const pulseDuration = fastForward ? '0.45s' : '1.4s'

  // Extract reagents belonging to this experiment (or popular sandbox reagents)
  const reagentItems = useMemo(() => {
    const ids = isSandbox
      ? ['saf_su', 'hcl', 'naoh', 'fenolftalein', 'h2o2', 'deterjan', 'ki', 'pbno3']
      : experiment.materials
    const found = ids
      .map((id) => CHEM_LAB_ITEMS.find((it) => it.id === id))
      .filter((it): it is ChemLabItem => Boolean(it && it.category === 'maddeler'))
    return found.slice(0, 6)
  }, [experiment.materials, isSandbox])

  const hasThermometer =
    isSandbox ||
    experiment.materials.includes('termometre') ||
    experiment.materials.includes('kalorimetre') ||
    sim.temp !== experiment.initialTemp
  const hasBalloon =
    experiment.materials.includes('balon') ||
    experiment.materials.includes('gaz_siringasi') ||
    preset === 'gas' ||
    sim.gasMl > 0
  const hasStirRod = isSandbox || experiment.materials.includes('baget') || experiment.materials.includes('beher')

  // Compute virtual bench width & laid-out entities
  const layout = useMemo(() => {
    const entities: BenchEntity[] = []

    const isSpecializedCenter =
      preset === 'titration' ||
      preset === 'electro' ||
      preset === 'flame' ||
      preset === 'rainbow' ||
      preset === 'funnel' ||
      preset === 'nanoscale'

    let cursorX = 115

    if (isSpecializedCenter) {
      entities.push({
        id: `apparatus-${preset}`,
        kind:
          preset === 'titration'
            ? 'burette'
            : preset === 'electro'
            ? 'electro'
            : preset === 'flame'
            ? 'flame'
            : preset === 'rainbow'
            ? 'tube_rack'
            : preset === 'funnel'
            ? 'funnel'
            : 'balance',
        label: experiment.title.split(' ')[0],
        x: preset === 'rainbow' ? 280 : 210,
        colorHex: '#38bdf8',
        vesselRole: 'primary',
      })
      cursorX = preset === 'rainbow' ? 525 : 415
      entities.push({
        id: 'vessel-beher-1',
        kind: 'beher',
        label: 'Beher 1',
        x: cursorX,
        colorHex: '#38bdf8',
        vesselRole: 'aux1',
      })
      cursorX += 126
    } else {
      // Multi-vessel showcase layout (Erlen 1 + Erlen 2 + Beher 1 + Beher 2)
      const primaryKind: 'erlen' | 'beher' =
        isSandbox && sim.sandboxVessel === 'beher'
          ? 'beher'
          : isSandbox && sim.sandboxVessel === 'erlen'
          ? 'erlen'
          : experiment.materials.includes('erlen') || preset === 'show_dramatic' || preset === 'gas'
          ? 'erlen'
          : 'beher'

      entities.push({
        id: 'vessel-primary',
        kind: primaryKind,
        label: primaryKind === 'erlen' ? 'Erlen 1' : 'Beher 1',
        x: cursorX,
        colorHex: '#38bdf8',
        vesselRole: 'primary',
      })
      cursorX += 148

      entities.push({
        id: 'vessel-secondary',
        kind: primaryKind === 'erlen' ? 'erlen' : 'beher',
        label: primaryKind === 'erlen' ? 'Erlen 2' : 'Beher 2',
        x: cursorX,
        colorHex: '#0ea5e9',
        vesselRole: 'secondary',
      })
      cursorX += 136

      entities.push({
        id: 'vessel-aux-1',
        kind: 'beher',
        label: 'Beher 1',
        x: cursorX,
        colorHex: '#94a3b8',
        vesselRole: 'aux1',
      })
      cursorX += 124

      entities.push({
        id: 'vessel-aux-2',
        kind: 'beher',
        label: 'Beher 2',
        x: cursorX,
        colorHex: '#94a3b8',
        vesselRole: 'aux2',
      })
      cursorX += 116
    }

    // Add reagent bottles & solid jars to the right of vessels
    reagentItems.forEach((item, idx) => {
      const meta = getReagentMeta(item)
      entities.push({
        id: item.id,
        kind: meta.isSolid ? 'jar' : 'bottle',
        label: meta.title,
        formula: item.formula,
        subLabel: meta.sub,
        x: cursorX + idx * 78,
        colorHex: item.colorHex,
        capColor: meta.capColor,
        isSolid: meta.isSolid,
      })
    })

    const totalWidth = Math.max(920, cursorX + reagentItems.length * 78 + 44)
    return { entities, totalWidth }
  }, [experiment.materials, experiment.title, isSandbox, preset, reagentItems, sim.sandboxVessel])

  const viewWidth = mobileZoom ? 640 : 920
  const maxPan = Math.max(0, layout.totalWidth - viewWidth)
  const clampedPan = Math.min(maxPan, Math.max(0, panX))

  const toSvgCoords = (clientX: number, clientY: number) => {
    const svg = svgRef.current
    if (!svg) return { x: 460, y: 240 }
    const rect = svg.getBoundingClientRect()
    const scaleX = viewWidth / Math.max(rect.width, 1)
    const scaleY = 430 / Math.max(rect.height, 1)
    return {
      x: clampedPan + (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY,
    }
  }

  const vesselTargets = useMemo(
    () =>
      layout.entities.filter(
        (e) =>
          e.kind === 'erlen' ||
          e.kind === 'beher' ||
          e.kind === 'burette' ||
          e.kind === 'electro' ||
          e.kind === 'funnel' ||
          e.kind === 'balance'
      ),
    [layout.entities]
  )

  const handlePointerDownEntity = (e: React.PointerEvent, entity: BenchEntity) => {
    if (entity.kind !== 'bottle' && entity.kind !== 'jar') {
      setSelectedId(entity.id)
      return
    }
    e.stopPropagation()
    ;(e.target as Element)?.setPointerCapture?.(e.pointerId)
    const pt = toSvgCoords(e.clientX, e.clientY)
    setDragState({
      entityId: entity.id,
      itemId: entity.id,
      startX: pt.x,
      startY: pt.y,
      currentX: pt.x,
      currentY: pt.y,
      moved: false,
    })
    setSelectedId(entity.id)
  }

  const handlePointerMoveSvg = (e: React.PointerEvent) => {
    if (!dragState) return
    const pt = toSvgCoords(e.clientX, e.clientY)
    const dist = Math.hypot(pt.x - dragState.startX, pt.y - dragState.startY)
    setDragState((prev) => (prev ? { ...prev, currentX: pt.x, currentY: pt.y, moved: prev.moved || dist > 8 } : null))

    const hovered = vesselTargets.find((v) => Math.abs(pt.x - v.x) < 76 && pt.y > 100 && pt.y < 365)
    setHoverVesselId(hovered ? hovered.id : null)
  }

  const triggerPourAnimation = (itemId: string, targetX: number, color: string, isSolid: boolean) => {
    setPourAnim({ itemId, targetX, color, isSolid })
    setTimeout(() => {
      setPourAnim(null)
    }, 680)
    if (onSelectBenchMaterial) {
      onSelectBenchMaterial(itemId)
    } else {
      onTriggerStep()
    }
  }

  const handlePointerUpSvg = (e: React.PointerEvent) => {
    if (!dragState) return
    const pt = toSvgCoords(e.clientX, e.clientY)
    const droppedOn = vesselTargets.find((v) => Math.abs(pt.x - v.x) < 82 && pt.y > 90 && pt.y < 370)
    const draggedEntity = layout.entities.find((x) => x.id === dragState.itemId)

    if (dragState.moved && droppedOn && draggedEntity) {
      triggerPourAnimation(
        draggedEntity.id,
        droppedOn.x,
        draggedEntity.colorHex,
        Boolean(draggedEntity.isSolid)
      )
    }
    setDragState(null)
    setHoverVesselId(null)
  }

  // Primary vessel fill level (0..1)
  const primaryVolMl = Math.min(250, Math.max(0, sim.vol))
  const primaryFillRatio = primaryVolMl > 0 ? Math.min(0.88, Math.max(0.12, primaryVolMl / 250)) : 0
  const secondaryGasMl = sim.gasMl
  const secondaryFillRatio = isCompleted || sim.gasMl > 0 ? 0.22 : 0.0
  const aux1FillRatio = sim.precipitateColor ? 0.24 : 0.0
  const aux1LiquidColor = sim.precipitateColor || 'rgba(148,163,184,0.12)'

  const selectedEntity = layout.entities.find((e) => e.id === selectedId) || null
  const selectedItemDef = selectedId ? CHEM_LAB_ITEMS.find((i) => i.id === selectedId) || null : null

  return (
    <div className="relative rounded-2xl bg-[#070C16] border border-slate-800 overflow-hidden shadow-2xl">
      {/* Top Bench Instruction Strip */}
      <div className="px-4 py-2.5 bg-slate-950/90 border-b border-slate-800/80 flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-2 min-w-0">
          {isAutoPlaying ? (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 font-bold">
              <Play className="w-3 h-3 fill-current" />
              <span>Otomatik Oynatılıyor ({fastForward ? '4×' : '1×'})</span>
            </span>
          ) : isSandbox ? (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Serbest Tezgâh — Şişeleri sürükleyip kapların üzerine dökebilirsin</span>
            </span>
          ) : isCompleted ? (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-bold">
              ✓ Deney Tamamlandı ({experiment.steps.length}/{experiment.steps.length})
            </span>
          ) : (
            <span className="text-slate-200 font-medium truncate">
              <span className="text-amber-400 font-extrabold mr-1.5">
                Adım {currentStepIndex + 1}/{experiment.steps.length}:
              </span>
              {activeStep?.instruction}
            </span>
          )}
        </div>

        {/* Live Telemetry Pill Strip */}
        <div
          className="flex flex-wrap items-center gap-1.5 text-[11px] font-semibold"
          style={{ fontVariantNumeric: 'tabular-nums' }}
        >
          <span className="px-2.5 py-0.5 rounded-full bg-slate-900 border border-rose-500/35 text-rose-300 inline-flex items-center gap-1">
            <Thermometer className="w-3 h-3" />
            {formatTrDecimal(sim.temp, 1)} °C
          </span>
          <span className="px-2.5 py-0.5 rounded-full bg-slate-900 border border-emerald-500/35 text-emerald-300 inline-flex items-center gap-1">
            pH {formatTrDecimal(sim.ph, 2)}
          </span>
          <span className="px-2.5 py-0.5 rounded-full bg-slate-900 border border-sky-500/35 text-sky-300 inline-flex items-center gap-1">
            <Droplet className="w-3 h-3" />
            {sim.vol} mL
          </span>
          {sim.gasMl > 0 && (
            <span className="px-2.5 py-0.5 rounded-full bg-slate-900 border border-violet-500/35 text-violet-300">
              {sim.gasMl} mL Gaz
            </span>
          )}
          {sim.voltage > 0 && (
            <span className="px-2.5 py-0.5 rounded-full bg-slate-900 border border-amber-500/35 text-amber-300 inline-flex items-center gap-1">
              <Zap className="w-3 h-3" />
              {formatTrDecimal(sim.voltage, 2)} V
            </span>
          )}
        </div>
      </div>

      {/* Safety Alert Banner */}
      {sim.safetyWarning && (
        <div className="px-4 py-2 bg-rose-950/85 border-b border-rose-500/40 text-rose-200 text-xs font-bold flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
          <span>{sim.safetyWarning}</span>
        </div>
      )}

      {/* Main Studio SVG Lab Bench */}
      <div className="relative w-full select-none">
        <svg
          ref={svgRef}
          viewBox={`${clampedPan} 0 ${viewWidth} 430`}
          onPointerMove={handlePointerMoveSvg}
          onPointerUp={handlePointerUpSvg}
          onPointerCancel={handlePointerUpSvg}
          className="w-full h-auto max-h-[430px] touch-pan-y cursor-default"
          role="img"
          aria-label={`${experiment.title} İnteraktif Laboratuvar Tezgâhı`}
        >
          <defs>
            {/* Lab Bench Table & Specular Gradients */}
            <linearGradient id="benchSurfaceGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#1c2638" />
              <stop offset="28%" stopColor="#131c2b" />
              <stop offset="100%" stopColor="#090e18" />
            </linearGradient>

            <linearGradient id="glassBodyGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="rgba(255,255,255,0.22)" />
              <stop offset="18%" stopColor="rgba(255,255,255,0.06)" />
              <stop offset="55%" stopColor="rgba(255,255,255,0.02)" />
              <stop offset="88%" stopColor="rgba(255,255,255,0.08)" />
              <stop offset="100%" stopColor="rgba(255,255,255,0.24)" />
            </linearGradient>

            <linearGradient id="bottleGlassGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="rgba(226,232,240,0.28)" />
              <stop offset="28%" stopColor="rgba(148,163,184,0.10)" />
              <stop offset="80%" stopColor="rgba(148,163,184,0.12)" />
              <stop offset="100%" stopColor="rgba(226,232,240,0.26)" />
            </linearGradient>

            <radialGradient id="burnerFlameGlow" cx="50%" cy="60%" r="55%">
              <stop offset="0%" stopColor={sim.flameColor || '#38bdf8'} stopOpacity="0.9" />
              <stop offset="65%" stopColor={sim.flameColor || '#0284c7'} stopOpacity="0.35" />
              <stop offset="100%" stopColor={sim.flameColor || '#0284c7'} stopOpacity="0" />
            </radialGradient>

            <radialGradient id="pedestalGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="rgba(56,189,248,0.34)" />
              <stop offset="100%" stopColor="rgba(56,189,248,0)" />
            </radialGradient>

            {/* Lab Blueprint Grid Pattern */}
            <pattern id="labBenchGrid" width="44" height="44" patternUnits="userSpaceOnUse">
              <path d="M 44 0 L 0 0 0 44" fill="none" stroke="rgba(148,163,184,0.075)" strokeWidth="1" />
            </pattern>

            {/* Exact Conical Interior ClipPath for Erlenmeyer (local coords centered x=0) */}
            <clipPath id="erlenInteriorClip">
              <path d="M -18 172 L -18 204 L -62 315 Q -63 324 -51 324 L 51 324 Q 63 324 62 315 L 18 204 L 18 172 Z" />
            </clipPath>

            {/* Exact Cylindrical Interior ClipPath for 250mL Beaker */}
            <clipPath id="beakerInteriorClip">
              <rect x="-52" y="192" width="104" height="133" rx="9" />
            </clipPath>

            {/* Exact Bottle Body ClipPath */}
            <clipPath id="bottleInteriorClip">
              <rect x="-25" y="232" width="50" height="92" rx="7" />
            </clipPath>
          </defs>

          {/* Background Wall + Lab Grid + Slate Benchtop */}
          <rect x="0" y="0" width={layout.totalWidth} height="340" fill="#0B1320" />
          <rect x="0" y="0" width={layout.totalWidth} height="340" fill="url(#labBenchGrid)" />
          <rect x="0" y="330" width={layout.totalWidth} height="100" fill="url(#benchSurfaceGrad)" />
          <line x1="0" y1="330" x2={layout.totalWidth} y2="330" stroke="rgba(148,163,184,0.22)" strokeWidth="1.5" />

          {/* ── RENDER MULTI-VESSELS & APPARATUS ON BENCH ── */}
          {layout.entities.map((entity) => {
            const isSelected = selectedId === entity.id
            const isHoverTarget = hoverVesselId === entity.id

            // Highlight pending step target smoothly without ugly dashed box
            const isStepTarget =
              !isCompleted &&
              !isSandbox &&
              activeStep &&
              ((entity.kind === 'bottle' || entity.kind === 'jar')
                ? activeStep.materialIds.includes(entity.id)
                : entity.vesselRole === 'primary' && activeStep.materialIds.some((m) => m === 'erlen' || m === 'beher'))

            if (entity.kind === 'erlen') {
              const role = entity.vesselRole || 'primary'
              const fillRatio = role === 'primary' ? primaryFillRatio : secondaryFillRatio
              const liqColor =
                role === 'primary'
                  ? sim.liquidColor
                  : isCompleted || sim.gasMl > 0
                  ? 'rgba(125,211,252,0.42)'
                  : 'rgba(148,163,184,0.12)'
              const liqTopY = 324 - Math.round(fillRatio * 108)
              const showFoam = role === 'primary' && sim.foamLevel > 0
              const showThermometer = role === 'primary' && hasThermometer
              const showBalloon = role === 'secondary' && hasBalloon

              return (
                <g
                  key={entity.id}
                  transform={`translate(${entity.x}, 0)`}
                  onClick={() => {
                    setSelectedId(entity.id)
                    if (!isSandbox && !isCompleted && role === 'primary') onTriggerStep()
                  }}
                  className="cursor-pointer"
                >
                  {/* Contact Shadow on Bench */}
                  <ellipse cx="0" cy="331" rx="68" ry="6" fill="rgba(0,0,0,0.52)" />
                  {(isSelected || isHoverTarget || isStepTarget) && (
                    <ellipse
                      cx="0"
                      cy="331"
                      rx="76"
                      ry="11"
                      fill="url(#pedestalGlow)"
                      opacity={isHoverTarget ? 1 : 0.72}
                    />
                  )}

                  {/* Tripod + Bunsen Burner underneath if heated */}
                  {role === 'primary' && (sim.burnerOn || experiment.materials.includes('bek')) && (
                    <g opacity={sim.burnerOn ? 1 : 0.55}>
                      <rect x="-24" y="325" width="48" height="6" rx="3" fill="#475569" />
                      {sim.burnerOn && (
                        <g>
                          <ellipse cx="0" cy="316" rx="22" ry="12" fill="url(#burnerFlameGlow)" />
                          <path
                            d="M 0 326 Q -10 314 0 302 Q 10 314 0 326 Z"
                            fill={sim.flameColor || '#38bdf8'}
                          >
                            <animate attributeName="opacity" values="0.78;1;0.82" dur={pulseDuration} repeatCount="indefinite" />
                          </path>
                        </g>
                      )}
                    </g>
                  )}

                  {/* Foam Eruption Plume (Elephant Toothpaste / CO₂) */}
                  {showFoam && (
                    <g>
                      {/* Steam tendrils */}
                      <path
                        d="M -8 106 Q -16 82 -6 60"
                        fill="none"
                        stroke="rgba(226,232,240,0.45)"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                      >
                        <animate attributeName="opacity" values="0.2;0.7;0.2" dur="2.1s" repeatCount="indefinite" />
                      </path>
                      <path
                        d="M 14 112 Q 22 86 12 64"
                        fill="none"
                        stroke="rgba(226,232,240,0.4)"
                        strokeWidth="2.2"
                        strokeLinecap="round"
                      >
                        <animate attributeName="opacity" values="0.6;0.2;0.6" dur="2.4s" repeatCount="indefinite" />
                      </path>
                      {/* Dense Sculpted Foam Plume */}
                      <path
                        d="M -18 172 C -32 146, -24 108, 0 92 C 26 108, 32 146, 18 172 Z"
                        fill="#f8fafc"
                        stroke="rgba(203,213,225,0.6)"
                        strokeWidth="1.2"
                      />
                      <circle cx="-8" cy="134" r="6" fill="rgba(226,232,240,0.85)" />
                      <circle cx="9" cy="144" r="5" fill="rgba(226,232,240,0.85)" />
                      <circle cx="0" cy="116" r="4.5" fill="rgba(226,232,240,0.9)" />
                    </g>
                  )}

                  {/* Red Elastic Balloon Attached on Erlen 2 */}
                  {showBalloon && (
                    <g>
                      {(() => {
                        const boost = Math.min(1, secondaryGasMl / 260)
                        const rx = 20 + boost * 24
                        const ry = 25 + boost * 31
                        const cy = 166 - ry
                        return (
                          <g>
                            {/* Balloon collar stretched over flask lip */}
                            <ellipse cx="0" cy={cy} rx={rx} ry={ry} fill="#f43f5e" />
                            <rect x="-21" y="162" width="42" height="10" rx="3" fill="#e11d48" />
                            <ellipse
                              cx={-rx * 0.34}
                              cy={cy - ry * 0.28}
                              rx={rx * 0.22}
                              ry={ry * 0.32}
                              fill="rgba(255,255,255,0.22)"
                            />
                            {/* Floating Dark Pill Badge: e.g. 246 mL */}
                            {secondaryGasMl > 0 && (
                              <g transform={`translate(18, ${cy - ry - 6})`}>
                                <rect
                                  x="0"
                                  y="0"
                                  width="76"
                                  height="26"
                                  rx="8"
                                  fill="#090D16"
                                  stroke="rgba(16,185,129,0.55)"
                                  strokeWidth="1.4"
                                />
                                <text
                                  x="38"
                                  y="17"
                                  textAnchor="middle"
                                  fill="#ffffff"
                                  fontSize="12"
                                  fontWeight="700"
                                  fontFamily={SVG_FONT}
                                  style={{ fontVariantNumeric: 'tabular-nums' }}
                                >
                                  {secondaryGasMl} mL
                                </text>
                              </g>
                            )}
                          </g>
                        )
                      })()}
                    </g>
                  )}

                  {/* Strictly Clipped Interior Liquid, Precipitate & Gas Bubbles */}
                  <g clipPath="url(#erlenInteriorClip)">
                    {fillRatio > 0 && (
                      <g>
                        <rect x="-70" y={liqTopY} width="140" height={330 - liqTopY} fill={liqColor} />
                        <ellipse
                          cx="0"
                          cy={liqTopY}
                          rx="62"
                          ry="4"
                          fill={liqColor}
                          stroke="rgba(255,255,255,0.42)"
                          strokeWidth="1"
                        />
                      </g>
                    )}

                    {/* Foam layer inside neck */}
                    {showFoam && (
                      <rect x="-24" y="172" width="48" height={Math.max(10, liqTopY - 172)} fill="rgba(248,250,252,0.88)" />
                    )}

                    {/* Precipitate inside primary flask */}
                    {role === 'primary' && sim.precipitateColor && !showFoam && (
                      <path
                        d="M -60 314 Q 0 306 60 314 L 60 326 L -60 326 Z"
                        fill={sim.precipitateColor}
                        opacity="0.94"
                      />
                    )}

                    {/* Effervescent micro-bubbles */}
                    {(sim.burnerOn || sim.gasMl > 0 || showFoam) && fillRatio > 0 && (
                      <g fill="rgba(255,255,255,0.78)">
                        <circle cx="-18" cy={312} r="3">
                          <animate attributeName="cy" values={`316;${Math.max(185, liqTopY + 4)}`} dur={pulseDuration} repeatCount="indefinite" />
                        </circle>
                        <circle cx="8" cy={310} r="3.8">
                          <animate attributeName="cy" values={`318;${Math.max(185, liqTopY + 5)}`} dur="1.05s" repeatCount="indefinite" />
                        </circle>
                        <circle cx="24" cy={314} r="2.5">
                          <animate attributeName="cy" values={`316;${Math.max(185, liqTopY + 4)}`} dur="0.88s" repeatCount="indefinite" />
                        </circle>
                      </g>
                    )}

                    {/* Thermometer stem inside liquid */}
                    {showThermometer && (
                      <g transform="rotate(6, 0, 310)">
                        <rect x="-2.5" y="138" width="5" height="176" rx="2.5" fill="rgba(241,245,249,0.72)" stroke="rgba(148,163,184,0.6)" strokeWidth="0.8" />
                        <rect
                          x="-1"
                          y={Math.max(150, 306 - Math.min(130, (sim.temp / 100) * 125))}
                          width="2"
                          height={Math.min(156, 12 + (sim.temp / 100) * 125)}
                          fill="#f43f5e"
                        />
                        <circle cx="0" cy="312" r="4.5" fill="#e11d48" />
                      </g>
                    )}
                  </g>

                  {/* Rolled Top Lip Rim + Conical Glass Outline */}
                  <path
                    d="M -20 171 L -20 204 L -64 316 Q -66 326 -54 326 L 54 326 Q 66 326 64 316 L 20 204 L 20 171 Z"
                    fill="url(#glassBodyGrad)"
                    stroke={isHoverTarget ? '#38bdf8' : 'rgba(203,213,225,0.68)'}
                    strokeWidth={isHoverTarget ? '2.5' : '2'}
                  />
                  <rect
                    x="-23"
                    y="167"
                    width="46"
                    height="5"
                    rx="2.5"
                    fill="rgba(226,232,240,0.45)"
                    stroke="rgba(226,232,240,0.75)"
                    strokeWidth="1"
                  />

                  {/* Specular Left Reflection */}
                  <path
                    d="M -16 175 L -16 205 L -56 312 L -49 312 L -11 205 L -11 175 Z"
                    fill="rgba(255,255,255,0.13)"
                    pointerEvents="none"
                  />

                  {/* Calibrated Right-Center Graduation Scale (100% inside conical walls!) */}
                  {[250, 200, 150, 100, 50].map((ml, idx) => {
                    const gy = 228 + idx * 20
                    return (
                      <g key={ml} pointerEvents="none">
                        <text
                          x="0"
                          y={gy + 3.5}
                          textAnchor="end"
                          fill="rgba(226,232,240,0.72)"
                          fontSize="10"
                          fontWeight="600"
                          fontFamily={SVG_FONT}
                          style={{ fontVariantNumeric: 'tabular-nums' }}
                        >
                          {ml}
                        </text>
                        <line x1="5" y1={gy} x2="18" y2={gy} stroke="rgba(226,232,240,0.5)" strokeWidth="1.3" />
                        {idx < 4 && (
                          <line x1="8" y1={gy + 10} x2="17" y2={gy + 10} stroke="rgba(226,232,240,0.28)" strokeWidth="1" />
                        )}
                      </g>
                    )
                  })}

                  {/* Floating Dark Thermometer Pill Badge (e.g. 79,9 °C) */}
                  {showThermometer && (
                    <g transform="translate(24, 156)">
                      <rect
                        x="0"
                        y="0"
                        width="72"
                        height="26"
                        rx="8"
                        fill="#090D16"
                        stroke="rgba(244,63,94,0.65)"
                        strokeWidth="1.4"
                      />
                      <text
                        x="36"
                        y="17"
                        textAnchor="middle"
                        fill="#ffffff"
                        fontSize="12"
                        fontWeight="700"
                        fontFamily={SVG_FONT}
                        style={{ fontVariantNumeric: 'tabular-nums' }}
                      >
                        {formatTrDecimal(sim.temp, 1)} °C
                      </text>
                    </g>
                  )}

                  {/* Subtle Vessel Tag below bench edge */}
                  <text
                    x="0"
                    y="352"
                    textAnchor="middle"
                    fill={isSelected ? '#38bdf8' : 'rgba(148,163,184,0.75)'}
                    fontSize="10.5"
                    fontWeight="600"
                    fontFamily={SVG_FONT}
                  >
                    {entity.label}
                  </text>
                </g>
              )
            }

            if (entity.kind === 'beher') {
              const role = entity.vesselRole || 'aux1'
              const fillRatio =
                role === 'primary'
                  ? primaryFillRatio
                  : role === 'aux1'
                  ? aux1FillRatio
                  : role === 'secondary'
                  ? 0.18
                  : 0.14
              const liqColor =
                role === 'primary'
                  ? sim.liquidColor
                  : role === 'aux1'
                  ? aux1LiquidColor
                  : 'rgba(148,163,184,0.12)'
              const liqTopY = 324 - Math.round(fillRatio * 108)

              return (
                <g
                  key={entity.id}
                  transform={`translate(${entity.x}, 0)`}
                  onClick={() => {
                    setSelectedId(entity.id)
                    if (!isSandbox && !isCompleted && role === 'primary') onTriggerStep()
                  }}
                  className="cursor-pointer"
                >
                  <ellipse cx="0" cy="331" rx="60" ry="5.5" fill="rgba(0,0,0,0.5)" />
                  {(isSelected || isHoverTarget || isStepTarget) && (
                    <ellipse
                      cx="0"
                      cy="331"
                      rx="68"
                      ry="10"
                      fill="url(#pedestalGlow)"
                      opacity={isHoverTarget ? 1 : 0.72}
                    />
                  )}

                  {/* Foam if primary */}
                  {role === 'primary' && sim.foamLevel > 0 && (
                    <path
                      d="M -38 192 C -46 155, -24 114, 0 98 C 26 114, 46 155, 38 192 Z"
                      fill="#f8fafc"
                    />
                  )}

                  {/* Clipped Interior Liquid + Precipitate */}
                  <g clipPath="url(#beakerInteriorClip)">
                    {fillRatio > 0 && (
                      <g>
                        <rect x="-56" y={liqTopY} width="112" height={330 - liqTopY} fill={liqColor} />
                        <ellipse
                          cx="0"
                          cy={liqTopY}
                          rx="52"
                          ry="3.5"
                          fill={liqColor}
                          stroke="rgba(255,255,255,0.42)"
                          strokeWidth="1"
                        />
                      </g>
                    )}

                    {sim.precipitateColor && (role === 'aux1' || role === 'primary') && (
                      <path
                        d="M -52 315 Q 0 308 52 315 L 52 325 L -52 325 Z"
                        fill={sim.precipitateColor || '#eab308'}
                        opacity="0.92"
                      />
                    )}
                  </g>

                  {/* Beaker Outer Contour with Spout + Top Rim */}
                  <path
                    d="M -58 190 L -53 195 L -53 316 Q -53 326 -43 326 L 43 326 Q 53 326 53 316 L 53 195 L 58 189"
                    fill="url(#glassBodyGrad)"
                    stroke={isHoverTarget ? '#38bdf8' : 'rgba(203,213,225,0.68)'}
                    strokeWidth={isHoverTarget ? '2.5' : '2'}
                    strokeLinejoin="round"
                  />
                  <line x1="-58" y1="190" x2="58" y2="189" stroke="rgba(226,232,240,0.7)" strokeWidth="2.5" strokeLinecap="round" />

                  {/* Specular Left Reflection */}
                  <rect x="-47" y="198" width="8" height="118" rx="4" fill="rgba(255,255,255,0.13)" pointerEvents="none" />

                  {/* Right-Hand Beaker Graduations (Inside Glass Wall) */}
                  {[250, 200, 150, 100, 50].map((ml, idx) => {
                    const gy = 216 + idx * 22
                    return (
                      <g key={ml} pointerEvents="none">
                        <text
                          x="22"
                          y={gy + 3.5}
                          textAnchor="end"
                          fill="rgba(226,232,240,0.72)"
                          fontSize="10"
                          fontWeight="600"
                          fontFamily={SVG_FONT}
                          style={{ fontVariantNumeric: 'tabular-nums' }}
                        >
                          {ml}
                        </text>
                        <line x1="27" y1={gy} x2="43" y2={gy} stroke="rgba(226,232,240,0.52)" strokeWidth="1.3" />
                        {idx < 4 && (
                          <line x1="33" y1={gy + 11} x2="43" y2={gy + 11} stroke="rgba(226,232,240,0.28)" strokeWidth="1" />
                        )}
                      </g>
                    )
                  })}

                  <text
                    x="0"
                    y="352"
                    textAnchor="middle"
                    fill={isSelected ? '#38bdf8' : 'rgba(148,163,184,0.75)'}
                    fontSize="10.5"
                    fontWeight="600"
                    fontFamily={SVG_FONT}
                  >
                    {entity.label}
                  </text>
                </g>
              )
            }

            /* ── SPECIALIZED PRESET CENTERPIECES (Titration / Electro / Flame / Rainbow / Funnel / Balance) ── */
            if (entity.kind === 'burette') {
              return (
                <g key={entity.id} transform={`translate(${entity.x}, 0)`} onClick={onTriggerStep} className="cursor-pointer">
                  <rect x="-95" y="324" width="190" height="8" rx="3" fill="#475569" />
                  <rect x="-78" y="42" width="9" height="284" rx="3" fill="#64748b" />
                  <rect x="-70" y="88" width="76" height="6" rx="2.5" fill="#94a3b8" />
                  {/* Burette */}
                  <rect x="-11" y="54" width="22" height="148" rx="4" fill="url(#glassBodyGrad)" stroke="#cbd5e1" strokeWidth="1.8" />
                  <rect x="-9" y="72" width="18" height="122" fill="rgba(192,132,252,0.45)" />
                  <rect x="-16" y="202" width="32" height="7" rx="3" fill="#38bdf8" />
                  {/* Drop */}
                  <circle cx="0" cy="222" r="4" fill="#ec4899">
                    <animate attributeName="cy" values="214;286" dur={pulseDuration} repeatCount="indefinite" />
                  </circle>
                  {/* Erlenmeyer below */}
                  <g clipPath="url(#erlenInteriorClip)" transform="translate(0, 0) scale(0.86) translate(0, 52)">
                    <rect x="-66" y="254" width="132" height="74" fill={sim.liquidColor} />
                  </g>
                  <path
                    d="M -16 218 L -16 244 L -54 316 Q -54 324 -44 324 L 44 324 Q 54 324 54 316 L 16 244 L 16 218 Z"
                    fill="url(#glassBodyGrad)"
                    stroke="#cbd5e1"
                    strokeWidth="2"
                  />
                  {/* Floating Live pH Pill */}
                  <g transform="translate(46, 132)">
                    <rect x="0" y="0" width="98" height="36" rx="10" fill="#090D16" stroke="rgba(236,72,153,0.6)" strokeWidth="1.5" />
                    <text
                      x="49"
                      y="23"
                      textAnchor="middle"
                      fill="#ffffff"
                      fontSize="14"
                      fontWeight="700"
                      fontFamily={SVG_FONT}
                      style={{ fontVariantNumeric: 'tabular-nums' }}
                    >
                      pH {formatTrDecimal(sim.ph, 2)}
                    </text>
                  </g>
                </g>
              )
            }

            if (entity.kind === 'electro') {
              return (
                <g key={entity.id} transform={`translate(${entity.x}, 0)`} onClick={onTriggerStep} className="cursor-pointer">
                  <rect x="-78" y="48" width="156" height="58" rx="12" fill="#090D16" stroke="#eab308" strokeWidth="2" />
                  <text x="0" y="69" textAnchor="middle" fill="#fde047" fontSize="10" fontWeight="700" fontFamily={SVG_FONT}>
                    DİJİTAL VOLTMETRE
                  </text>
                  <text
                    x="0"
                    y="95"
                    textAnchor="middle"
                    fill="#ffffff"
                    fontSize="20"
                    fontWeight="800"
                    fontFamily={SVG_FONT}
                    style={{ fontVariantNumeric: 'tabular-nums' }}
                  >
                    {formatTrDecimal(sim.voltage, 2)} V
                  </text>
                  <path d="M -78 78 L -120 78 L -120 212" fill="none" stroke="#94a3b8" strokeWidth="3" />
                  <path d="M 78 78 L 120 78 L 120 212" fill="none" stroke="#f97316" strokeWidth="3" />
                  {/* Anode Beaker */}
                  <rect x="-165" y="232" width="90" height="92" fill="rgba(148,163,184,0.22)" />
                  <path d="M -166 198 L -166 326 L -74 326 L -74 198" fill="url(#glassBodyGrad)" stroke="#cbd5e1" strokeWidth="2" />
                  <rect x="-128" y="182" width="16" height="122" rx="3" fill="#94a3b8" />
                  {/* Cathode Beaker */}
                  <rect x="75" y="232" width="90" height="92" fill={sim.liquidColor || 'rgba(14,165,233,0.48)'} />
                  <path d="M 74 198 L 74 326 L 166 326 L 166 198" fill="url(#glassBodyGrad)" stroke="#cbd5e1" strokeWidth="2" />
                  <rect x="112" y="182" width="16" height="122" rx="3" fill="#d97706" />
                  {/* Salt Bridge */}
                  <path d="M -92 252 L -92 158 Q 0 128 92 158 L 92 252" fill="none" stroke="#a7f3d0" strokeWidth="14" strokeLinecap="round" opacity="0.72" />
                  {sim.voltage > 0.1 && (
                    <circle cx="-110" cy="78" r="4.5" fill="#fde047">
                      <animate attributeName="cx" values="-118;118" dur={pulseDuration} repeatCount="indefinite" />
                    </circle>
                  )}
                </g>
              )
            }

            if (entity.kind === 'flame') {
              return (
                <g key={entity.id} transform={`translate(${entity.x}, 0)`} onClick={onTriggerStep} className="cursor-pointer">
                  <rect x="-48" y="316" width="96" height="14" rx="4" fill="#475569" />
                  <rect x="-11" y="205" width="22" height="111" fill="#64748b" />
                  <ellipse cx="0" cy="148" rx="64" ry="70" fill="url(#burnerFlameGlow)" />
                  <path
                    d="M 0 205 C -32 175, -32 108, 0 64 C 32 108, 32 175, 0 205 Z"
                    fill={sim.flameColor || '#38bdf8'}
                    opacity="0.92"
                  >
                    <animate attributeName="opacity" values="0.82;1;0.85" dur={pulseDuration} repeatCount="indefinite" />
                  </path>
                  <path d="M 0 205 C -13 185, -13 144, 0 120 C 13 144, 13 185, 0 205 Z" fill="#e0f2fe" opacity="0.88" />
                  <line x1="120" y1="144" x2="2" y2="144" stroke="#cbd5e1" strokeWidth="3.5" />
                  <rect x="120" y="137" width="60" height="14" rx="5" fill="#334155" />
                  <circle cx="2" cy="144" r="5.5" fill={sim.flameColor || '#facc15'} />
                </g>
              )
            }

            if (entity.kind === 'tube_rack') {
              return (
                <g key={entity.id} transform={`translate(${entity.x}, 0)`} onClick={onTriggerStep} className="cursor-pointer">
                  <rect x="-215" y="314" width="430" height="16" rx="5" fill="#334155" />
                  <rect x="-205" y="170" width="410" height="9" rx="4" fill="#475569" />
                  {[
                    { ox: -174, col: '#f43f5e', lbl: 'pH 2' },
                    { ox: -116, col: '#fb923c', lbl: 'pH 4' },
                    { ox: -58, col: '#8b5cf6', lbl: 'pH 7' },
                    { ox: 0, col: '#0ea5e9', lbl: 'pH 9' },
                    { ox: 58, col: '#10b981', lbl: 'pH 11' },
                    { ox: 116, col: '#eab308', lbl: 'pH 13' },
                    { ox: 174, col: sim.liquidColor || '#38bdf8', lbl: 'Test' },
                  ].map((tube, idx) => (
                    <g key={tube.ox}>
                      <rect
                        x={tube.ox - 13}
                        y={162 + (idx % 2) * 8}
                        width="26"
                        height="142"
                        rx="12"
                        fill={currentStepIndex === 0 && idx !== 2 && idx !== 6 ? 'rgba(139,92,246,0.45)' : tube.col}
                        opacity="0.86"
                      />
                      <rect
                        x={tube.ox - 14}
                        y="118"
                        width="28"
                        height="188"
                        rx="13"
                        fill="url(#glassBodyGrad)"
                        stroke="#cbd5e1"
                        strokeWidth="1.8"
                      />
                      <text
                        x={tube.ox}
                        y="352"
                        textAnchor="middle"
                        fill="#cbd5e1"
                        fontSize="10.5"
                        fontWeight="600"
                        fontFamily={SVG_FONT}
                      >
                        {tube.lbl}
                      </text>
                    </g>
                  ))}
                </g>
              )
            }

            if (entity.kind === 'funnel') {
              return (
                <g key={entity.id} transform={`translate(${entity.x}, 0)`} onClick={onTriggerStep} className="cursor-pointer">
                  <rect x="-85" y="324" width="170" height="8" rx="3" fill="#475569" />
                  <rect x="-74" y="54" width="9" height="272" rx="3" fill="#64748b" />
                  <line x1="-65" y1="138" x2="-15" y2="138" stroke="#94a3b8" strokeWidth="5.5" />
                  <polygon points="-42,94 42,94 8,184 -8,184" fill={sim.liquidColor || 'rgba(234,179,8,0.6)'} stroke="#cbd5e1" strokeWidth="2" />
                  <rect x="-3.5" y="184" width="7" height="40" fill="#cbd5e1" />
                  <rect x="-42" y={324 - Math.round(primaryFillRatio * 75)} width="84" height={Math.round(primaryFillRatio * 75)} fill="rgba(56,189,248,0.48)" />
                  <path d="M -44 236 L -44 324 L 44 324 L 44 236" fill="url(#glassBodyGrad)" stroke="#cbd5e1" strokeWidth="2" />
                </g>
              )
            }

            if (entity.kind === 'balance') {
              return (
                <g key={entity.id} transform={`translate(${entity.x}, 0)`} onClick={onTriggerStep} className="cursor-pointer">
                  <rect x="-112" y="284" width="224" height="46" rx="10" fill="#1e293b" stroke="#475569" strokeWidth="2" />
                  <rect x="-66" y="295" width="132" height="24" rx="6" fill="#090D16" />
                  <text
                    x="0"
                    y="312"
                    textAnchor="middle"
                    fill="#34d399"
                    fontSize="13.5"
                    fontWeight="700"
                    fontFamily={SVG_FONT}
                    style={{ fontVariantNumeric: 'tabular-nums' }}
                  >
                    {formatTrDecimal(145.4 + sim.vol * 0.7, 2)} g
                  </text>
                  <rect x="-78" y="274" width="156" height="9" rx="3" fill="#94a3b8" />
                  <rect x="-48" y={274 - Math.round(primaryFillRatio * 95)} width="96" height={Math.round(primaryFillRatio * 95)} fill={sim.liquidColor} />
                  <path d="M -50 156 L -50 274 L 50 274 L 50 156" fill="url(#glassBodyGrad)" stroke="#cbd5e1" strokeWidth="2" />
                  {sim.precipitateColor && (
                    <path d="M -46 262 Q 0 254 46 262 L 46 272 L -46 272 Z" fill={sim.precipitateColor} />
                  )}
                </g>
              )
            }

            /* ── LABELED LIQUID REAGENT BOTTLE ── */
            if (entity.kind === 'bottle') {
              const isDraggingThis = dragState?.entityId === entity.id && dragState.moved
              const tx = isDraggingThis ? dragState.currentX : entity.x
              const ty = isDraggingThis ? dragState.currentY - 260 : 0

              return (
                <g
                  key={entity.id}
                  transform={`translate(${tx}, ${ty})`}
                  onPointerDown={(e) => handlePointerDownEntity(e, entity)}
                  className="cursor-grab active:cursor-grabbing"
                >
                  <ellipse cx="0" cy="331" rx="28" ry="4.5" fill="rgba(0,0,0,0.45)" opacity={isDraggingThis ? 0.15 : 1} />
                  {(isSelected || isStepTarget) && !isDraggingThis && (
                    <ellipse cx="0" cy="331" rx="34" ry="8" fill="url(#pedestalGlow)" />
                  )}

                  {/* Colored Screw Cap */}
                  <rect x="-11" y="198" width="22" height="16" rx="3" fill={entity.capColor || '#64748b'} />
                  <line x1="-11" y1="204" x2="11" y2="204" stroke="rgba(15,23,42,0.35)" strokeWidth="1" />

                  {/* Inner Liquid Inside Bottle */}
                  <g clipPath="url(#bottleInteriorClip)">
                    <rect x="-25" y="246" width="50" height="78" fill={entity.colorHex} opacity="0.45" />
                  </g>

                  {/* Bottle Contour (Shoulders + Cylindrical Body) */}
                  <path
                    d="M -10 214 L -10 222 Q -26 232 -26 244 L -26 320 Q -26 326 -20 326 L 20 326 Q 26 326 26 320 L 26 244 Q 26 232 10 222 L 10 214 Z"
                    fill="url(#bottleGlassGrad)"
                    stroke={isSelected ? '#38bdf8' : 'rgba(203,213,225,0.62)'}
                    strokeWidth={isSelected ? '2.2' : '1.6'}
                  />

                  {/* Crisp White Lab Label */}
                  <rect x="-23" y="254" width="46" height="44" rx="3" fill="#f8fafc" />
                  <rect x="-23" y="254" width="46" height="5" rx="1.5" fill={entity.capColor || '#64748b'} opacity="0.88" />
                  <text
                    x="0"
                    y="275"
                    textAnchor="middle"
                    fill="#0f172a"
                    fontSize={entity.label.length > 6 ? '7.4' : '10'}
                    fontWeight="800"
                    fontFamily={SVG_FONT}
                  >
                    {entity.label}
                  </text>
                  <text
                    x="0"
                    y="289"
                    textAnchor="middle"
                    fill="#475569"
                    fontSize="6.4"
                    fontWeight="600"
                    fontFamily={SVG_FONT}
                  >
                    {entity.subLabel || 'çözelti'}
                  </text>
                </g>
              )
            }

            /* ── LABELED WIDE-MOUTH SOLID JAR ── */
            const isDraggingJar = dragState?.entityId === entity.id && dragState.moved
            const jx = isDraggingJar ? dragState.currentX : entity.x
            const jy = isDraggingJar ? dragState.currentY - 275 : 0

            return (
              <g
                key={entity.id}
                transform={`translate(${jx}, ${jy})`}
                onPointerDown={(e) => handlePointerDownEntity(e, entity)}
                className="cursor-grab active:cursor-grabbing"
              >
                <ellipse cx="0" cy="331" rx="26" ry="4" fill="rgba(0,0,0,0.45)" opacity={isDraggingJar ? 0.15 : 1} />
                {(isSelected || isStepTarget) && !isDraggingJar && (
                  <ellipse cx="0" cy="331" rx="32" ry="8" fill="url(#pedestalGlow)" />
                )}

                {/* Wide Dark Jar Cap */}
                <rect x="-18" y="232" width="36" height="12" rx="2.5" fill="#475569" stroke="#64748b" strokeWidth="1" />
                {/* Jar Glass Body */}
                <rect
                  x="-24"
                  y="244"
                  width="48"
                  height="82"
                  rx="6"
                  fill="url(#bottleGlassGrad)"
                  stroke={isSelected ? '#38bdf8' : 'rgba(203,213,225,0.62)'}
                  strokeWidth={isSelected ? '2.2' : '1.6'}
                />
                {/* Crystalline Powder Base */}
                <path d="M -22 308 Q 0 302 22 308 L 22 322 Q 22 324 18 324 L -18 324 Q -22 324 -22 322 Z" fill={entity.colorHex} opacity="0.72" />

                {/* Crisp White Lab Label */}
                <rect x="-22" y="258" width="44" height="44" rx="3" fill="#f8fafc" />
                <text
                  x="0"
                  y="277"
                  textAnchor="middle"
                  fill="#0f172a"
                  fontSize={entity.label.length > 6 ? '7.6' : '10.5'}
                  fontWeight="800"
                  fontFamily={SVG_FONT}
                >
                  {entity.label}
                </text>
                <text
                  x="0"
                  y="291"
                  textAnchor="middle"
                  fill="#475569"
                  fontSize={(entity.subLabel || '').length > 10 ? '5.1' : '6.2'}
                  fontWeight="600"
                  fontFamily={SVG_FONT}
                >
                  {entity.subLabel || 'katı'}
                </text>
              </g>
            )
          })}

          {/* Horizontal Glass Stirring Rod resting cleanly on the foreground bench */}
          {hasStirRod && (
            <g transform="translate(460, 332)">
              <rect x="-78" y="-2.5" width="156" height="5" rx="2.5" fill="rgba(226,232,240,0.45)" stroke="rgba(255,255,255,0.45)" strokeWidth="0.8" />
              <circle cx="-78" cy="0" r="3.2" fill="rgba(226,232,240,0.65)" />
              <circle cx="78" cy="0" r="3.2" fill="rgba(226,232,240,0.65)" />
            </g>
          )}

          {/* Animated Tilted Pouring Stream on Drop or Button Pour */}
          {pourAnim && (
            <g transform={`translate(${pourAnim.targetX + 34}, 104)`}>
              <g transform="rotate(-48)">
                <rect x="-14" y="-34" width="28" height="60" rx="5" fill="url(#bottleGlassGrad)" stroke="#cbd5e1" strokeWidth="1.5" />
                <rect x="-7" y="-44" width="14" height="10" rx="2" fill="#38bdf8" />
              </g>
              <line
                x1="-28"
                y1="12"
                x2="-34"
                y2="128"
                stroke={pourAnim.color}
                strokeWidth={pourAnim.isSolid ? '3' : '5.5'}
                strokeDasharray={pourAnim.isSolid ? '4 5' : undefined}
                strokeLinecap="round"
                opacity="0.9"
              >
                <animate attributeName="opacity" values="0.95;0.2" dur="0.65s" repeatCount="1" />
              </line>
            </g>
          )}
        </svg>

        {/* Horizontal Pan Bar (only visible if bench exceeds viewport width) */}
        {maxPan > 0 && (
          <div className="px-4 py-2 bg-slate-950/90 border-t border-slate-800/70 space-y-1.5">
            <div className="text-[11px] text-slate-400">
              Tezgâh görüntüden geniş. Oklarla veya kaydırıcıyla gezinebilir, şişeleri kapların üzerine sürükleyebilirsin.
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setPanX((p) => Math.max(0, p - 140))}
                disabled={clampedPan <= 0}
                aria-label="Tezgâhı sola kaydır"
                className="p-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white disabled:opacity-35 cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <input
                type="range"
                min={0}
                max={maxPan}
                value={clampedPan}
                onChange={(e) => setPanX(Number(e.target.value))}
                aria-label="Tezgâh yatay kaydırma"
                className="flex-1 accent-cyan-400 cursor-pointer h-1.5 bg-slate-800 rounded-full"
              />
              <button
                type="button"
                onClick={() => setPanX((p) => Math.min(maxPan, p + 140))}
                disabled={clampedPan >= maxPan}
                aria-label="Tezgâhı sağa kaydır"
                className="p-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white disabled:opacity-35 cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Microscopic Particle View Overlay */}
        {microMode && (
          <div className="absolute inset-0 bg-slate-950/94 backdrop-blur-md p-4 sm:p-6 flex flex-col justify-between z-20 border-2 border-cyan-500/40 rounded-2xl">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/20 border border-cyan-400/40 text-cyan-300 text-xs font-black">
                <Atom className="w-4 h-4 animate-spin" style={{ animationDuration: '6s' }} />
                <span>TANECİK BOYUTU (MAARİF MAKRO → MİKRO → SEMBOLİK)</span>
              </div>
              <span className="text-xs font-bold text-amber-300 bg-slate-900 px-3 py-1 rounded-lg border border-slate-700">
                {experiment.particleInfo.reactionEquation}
              </span>
            </div>

            <div className="my-3 grid grid-cols-1 sm:grid-cols-3 gap-3">
              {experiment.particleInfo.ions.map((ion, idx) => (
                <div
                  key={ion.formula}
                  className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 flex items-center gap-3"
                >
                  <div
                    className="w-11 h-11 rounded-full flex items-center justify-center text-xs font-black text-slate-950 shrink-0 shadow-lg animate-bounce"
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

      {/* Sensor Chips + Bottom Contextual Object Bar (matching studio UX) */}
      <div className="px-4 py-3 bg-[#090E18] border-t border-slate-800/80 space-y-2.5">
        <div
          className="flex flex-wrap items-center gap-2 text-[11px] font-bold"
          style={{ fontVariantNumeric: 'tabular-nums' }}
        >
          {hasBalloon && (
            <span className="px-2.5 py-1 rounded-full bg-slate-900 border border-slate-800 text-slate-200 inline-flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>{sim.gasMl} mL</span>
              <span className="text-slate-400 font-medium">Balon</span>
            </span>
          )}
          <span className="px-2.5 py-1 rounded-full bg-slate-900 border border-slate-800 text-slate-200 inline-flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-rose-400" />
            <span>{formatTrDecimal(sim.temp, 1)} °C</span>
            <span className="text-slate-400 font-medium">Erlen 1</span>
          </span>
          <span className="px-2.5 py-1 rounded-full bg-slate-900 border border-slate-800 text-slate-200 inline-flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-sky-400" />
            <span>pH {formatTrDecimal(sim.ph, 2)}</span>
            <span className="text-slate-400 font-medium">Çözelti</span>
          </span>
          <span className="px-2.5 py-1 rounded-full bg-slate-900 border border-slate-800 text-slate-200 inline-flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-400" />
            <span>{sim.vol} mL</span>
            <span className="text-slate-400 font-medium">Toplam</span>
          </span>
        </div>

        {/* Contextual Selection & Quick Action Box */}
        <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 flex flex-wrap items-center justify-between gap-2.5">
          {selectedEntity ? (
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 font-bold">
                <FlaskConical className="w-3.5 h-3.5" />
                {selectedItemDef?.name || selectedEntity.label}
              </span>
              {(selectedEntity.kind === 'bottle' || selectedEntity.kind === 'jar') ? (
                <button
                  type="button"
                  onClick={() => {
                    const primaryTarget = vesselTargets[0]?.x || 115
                    triggerPourAnimation(
                      selectedEntity.id,
                      primaryTarget,
                      selectedEntity.colorHex,
                      Boolean(selectedEntity.isSolid)
                    )
                  }}
                  className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-black cursor-pointer transition-all"
                >
                  {selectedEntity.isSolid ? '1 g Katı Dök → Kaba' : '25 mL Dök → Kaba'}
                </button>
              ) : (
                <>
                  {!isSandbox && !isCompleted && (
                    <button
                      type="button"
                      onClick={onTriggerStep}
                      className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-black cursor-pointer transition-all"
                    >
                      {activeStep?.actionLabel || 'Bu Kabı Kullan'} →
                    </button>
                  )}
                  {isSandbox && onSelectBenchMaterial && (
                    <button
                      type="button"
                      onClick={() => onSelectBenchMaterial('bek')}
                      className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-300 font-bold inline-flex items-center gap-1 cursor-pointer"
                    >
                      <Flame className="w-3.5 h-3.5" />
                      Isıtıcı Aç/Kapat
                    </button>
                  )}
                </>
              )}
              {onResetBench && (
                <button
                  type="button"
                  onClick={onResetBench}
                  className="px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-400 hover:text-white inline-flex items-center gap-1 cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3" />
                  Temizle
                </button>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <Hand className="w-4 h-4 text-cyan-400 shrink-0" />
              <span>
                Bir malzemeye dokunursan yapabileceklerin burada görünür. Şişeleri başka bir kabın üzerine sürükleyerek dökebilir ya da yerleştirebilirsin.
              </span>
            </div>
          )}

          {/* Sandbox Vessel Switcher OR Guided Next Step CTA */}
          {isSandbox && onSelectSandboxVessel ? (
            <div className="flex items-center gap-1.5 text-xs">
              <span className="text-slate-400 font-bold mr-1">Ana Kap:</span>
              {(['erlen', 'beher'] as const).map((v) => (
                <button
                  key={v}
                  type="button"
                  onClick={() => onSelectSandboxVessel(v)}
                  className={`px-2.5 py-1 rounded-lg font-bold cursor-pointer transition-all ${
                    sim.sandboxVessel === v
                      ? 'bg-emerald-500 text-slate-950'
                      : 'bg-slate-950 text-slate-300 border border-slate-800 hover:border-slate-700'
                  }`}
                >
                  {v === 'erlen' ? 'Erlen' : 'Beher'}
                </button>
              ))}
            </div>
          ) : (
            !isCompleted && (
              <button
                type="button"
                onClick={onTriggerStep}
                className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 text-xs font-black shadow-lg shadow-amber-500/20 cursor-pointer transition-all shrink-0"
              >
                {activeStep?.actionLabel || 'Adımı Uygula'} →
              </button>
            )
          )}
        </div>
      </div>
    </div>
  )
}
