'use client'

import React, { useEffect, useMemo, useRef, useState } from 'react'
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
  X,
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

type ContainerStyle = 'amber_ghs' | 'wide_bottle' | 'dropper' | 'solid_jar' | 'matchbox'

interface BenchEntity {
  id: string
  kind:
    | 'cylinder'
    | 'erlen'
    | 'beher'
    | 'reagent'
    | 'tube_rack'
    | 'burette'
    | 'electro'
    | 'flame'
    | 'funnel'
    | 'balance'
    | 'bench_thermometer'
  label: string
  formula?: string
  subLabel?: string
  x: number
  colorHex: string
  capColor?: string
  containerStyle?: ContainerStyle
  isSolid?: boolean
  hasSpillTray?: boolean
  vesselRole?: 'primary' | 'secondary' | 'aux1'
}

interface PerVesselState {
  vol: number
  liquidColor: string
  hasDye: boolean
  hasH2O2: boolean
  hasDetergent: boolean
  hasKI: boolean
  foamLevel: number
  precipitateColor: string | null
  gasMl: number
  temp: number
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

const DROPPER_ITEM_IDS = new Set(['fenolftalein', 'metil_oranj', 'bromtimol', 'boya'])
const AMBER_GHS_IDS = new Set(['h2o2', 'derisik_hcl', 'agno3', 'iyot'])
const SOLID_ITEM_IDS = new Set([
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
  'limon_tuzu',
  'al_folyo',
  'kno3',
  'seker',
  'buz',
])

function getReagentVisual(item: ChemLabItem): {
  title: string
  sub: string
  capColor: string
  liquidTint: string
  style: ContainerStyle
  isSolid: boolean
} {
  if (item.id === 'h2o2')
    return {
      title: 'H₂O₂',
      sub: '%30',
      capColor: '#e2e8f0',
      liquidTint: 'rgba(120,74,38,0.85)',
      style: 'amber_ghs',
      isSolid: false,
    }
  if (item.id === 'deterjan')
    return {
      title: 'DETERJAN',
      sub: '%10 çözelti',
      capColor: '#10b981',
      liquidTint: 'rgba(52,211,153,0.45)',
      style: 'wide_bottle',
      isSolid: false,
    }
  if (item.id === 'ki')
    return {
      title: 'KI',
      sub: '1 mol/L',
      capColor: '#64748b',
      liquidTint: 'rgba(203,213,225,0.4)',
      style: 'wide_bottle',
      isSolid: false,
    }
  if (item.id === 'boya')
    return {
      title: 'BOYA',
      sub: 'gıda boyası',
      capColor: '#e11d48',
      liquidTint: 'rgba(244,63,94,0.85)',
      style: 'dropper',
      isSolid: false,
    }
  if (item.id === 'pbno3')
    return {
      title: 'Pb(NO₃)₂',
      sub: 'zehirli',
      capColor: '#475569',
      liquidTint: '#e2e8f0',
      style: 'solid_jar',
      isSolid: true,
    }
  if (item.id === 'hcl' || item.id === 'hcl_1m' || item.id === 'derisik_hcl')
    return {
      title: 'HCl',
      sub: item.id === 'derisik_hcl' ? '%37 derişik' : '1 M çözelti',
      capColor: item.id === 'derisik_hcl' ? '#e2e8f0' : '#f43f5e',
      liquidTint: item.id === 'derisik_hcl' ? 'rgba(120,74,38,0.85)' : 'rgba(251,113,133,0.4)',
      style: item.id === 'derisik_hcl' ? 'amber_ghs' : 'wide_bottle',
      isSolid: false,
    }
  if (item.id === 'naoh' || item.id === 'naoh_1m')
    return {
      title: 'NaOH',
      sub: '1 M baz',
      capColor: '#a855f7',
      liquidTint: 'rgba(192,132,252,0.38)',
      style: 'wide_bottle',
      isSolid: false,
    }
  if (DROPPER_ITEM_IDS.has(item.id))
    return {
      title: item.id === 'fenolftalein' ? 'FENOL.' : item.id === 'metil_oranj' ? 'METİL O.' : 'İNDİK.',
      sub: 'indikatör',
      capColor: item.colorHex,
      liquidTint: item.colorHex,
      style: 'dropper',
      isSolid: false,
    }
  if (AMBER_GHS_IDS.has(item.id))
    return {
      title: item.formula || item.name.slice(0, 6).toUpperCase(),
      sub: 'reaktif',
      capColor: '#e2e8f0',
      liquidTint: 'rgba(120,74,38,0.85)',
      style: 'amber_ghs',
      isSolid: false,
    }
  if (SOLID_ITEM_IDS.has(item.id))
    return {
      title: item.formula || item.name.split(' ')[0].slice(0, 8),
      sub: 'katı',
      capColor: '#475569',
      liquidTint: item.colorHex,
      style: 'solid_jar',
      isSolid: true,
    }
  return {
    title: item.formula || item.name.split(' ')[0].toUpperCase().slice(0, 8),
    sub: item.id === 'saf_su' ? 'saf su' : item.id === 'sirke' ? '%5 sirke' : 'çözelti',
    capColor: item.colorHex,
    liquidTint: item.colorHex,
    style: 'wide_bottle',
    isSolid: false,
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
  const isElephantToothpaste = !isSandbox && experiment.id === 'fil-dis-macunu'
  const isBalloonExperiment =
    !isSandbox && (preset === 'gas' || experiment.materials.includes('balon'))
  const svgRef = useRef<SVGSVGElement>(null)

  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [selectedDose, setSelectedDose] = useState<number>(10)
  const [panX, setPanX] = useState(0)
  const [dragState, setDragState] = useState<DragState | null>(null)
  const [hoverVesselId, setHoverVesselId] = useState<string | null>(null)
  const [pourAnim, setPourAnim] = useState<PourAnimationState | null>(null)
  const [thermometerTargetId, setThermometerTargetId] = useState<string | null>(null)
  const [vesselStates, setVesselStates] = useState<Record<string, PerVesselState>>({})

  const pulseDuration = fastForward ? '0.45s' : '1.4s'

  // Reset per-vessel overrides whenever experiment or reset happens (step=0 && vol===initialVol)
  useEffect(() => {
    if (currentStepIndex === 0 && sim.vol === experiment.initialVol && sim.foamLevel === 0 && !sim.burnerOn) {
      setVesselStates({})
      setThermometerTargetId(null)
      setSelectedId(null)
    }
  }, [experiment.id, experiment.initialVol, currentStepIndex, sim.vol, sim.foamLevel, sim.burnerOn])

  // If guided step placed thermometer or finished reaction, auto-dock thermometer cleanly into primary vessel
  const effectiveThermometerVesselId = useMemo(() => {
    if (thermometerTargetId) return thermometerTargetId
    if (!isSandbox && sim.temp !== experiment.initialTemp) return 'vessel-1'
    if (
      !isSandbox &&
      experiment.materials.includes('termometre') &&
      currentStepIndex >= 3
    ) {
      return 'vessel-1'
    }
    return null
  }, [thermometerTargetId, isSandbox, sim.temp, experiment.initialTemp, experiment.materials, currentStepIndex])

  // Reagents belonging to this experiment
  const reagentItems = useMemo(() => {
    const baseIds = isSandbox
      ? ['saf_su', 'hcl', 'naoh', 'fenolftalein', 'h2o2', 'deterjan', 'ki', 'pbno3']
      : experiment.materials
    const items = baseIds
      .map((id) => CHEM_LAB_ITEMS.find((it) => it.id === id))
      .filter((it): it is ChemLabItem => Boolean(it && it.category === 'maddeler'))
      .slice(0, 5)
    return items
  }, [experiment.materials, isSandbox])

  // Build authentic layout per experiment
  const layout = useMemo(() => {
    const entities: BenchEntity[] = []
    const isSpecializedCenter =
      preset === 'titration' ||
      preset === 'electro' ||
      preset === 'flame' ||
      preset === 'rainbow' ||
      preset === 'funnel' ||
      preset === 'nanoscale'

    let cursorX = 122

    if (isElephantToothpaste) {
      // Authentic 2 × 500 mL Graduated Cylinders (Cylinder 1 inside Spill Tray)
      entities.push({
        id: 'vessel-1',
        kind: 'cylinder',
        label: 'Uzun mezür 1',
        x: 118,
        colorHex: '#f43f5e',
        hasSpillTray: true,
        vesselRole: 'primary',
      })
      entities.push({
        id: 'vessel-2',
        kind: 'cylinder',
        label: 'Uzun mezür 2',
        x: 422,
        colorHex: '#38bdf8',
        vesselRole: 'secondary',
      })
      cursorX = 524
    } else if (isSpecializedCenter) {
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
        x: preset === 'rainbow' ? 270 : 210,
        colorHex: '#38bdf8',
        vesselRole: 'primary',
      })
      cursorX = preset === 'rainbow' ? 515 : 405
      entities.push({
        id: 'vessel-2',
        kind: 'beher',
        label: 'Beher 1',
        x: cursorX,
        colorHex: '#38bdf8',
        vesselRole: 'aux1',
      })
      cursorX += 118
    } else if (isBalloonExperiment) {
      entities.push({
        id: 'vessel-1',
        kind: 'erlen',
        label: 'Erlen 1',
        x: 122,
        colorHex: '#38bdf8',
        hasSpillTray: true,
        vesselRole: 'primary',
      })
      entities.push({
        id: 'vessel-2',
        kind: 'erlen',
        label: 'Erlen 2',
        x: 274,
        colorHex: '#0ea5e9',
        vesselRole: 'secondary',
      })
      cursorX = 408
    } else {
      const primaryKind: 'erlen' | 'beher' =
        isSandbox && sim.sandboxVessel === 'erlen'
          ? 'erlen'
          : isSandbox && sim.sandboxVessel === 'beher'
          ? 'beher'
          : experiment.materials.includes('erlen') || preset === 'show_dramatic'
          ? 'erlen'
          : 'beher'

      entities.push({
        id: 'vessel-1',
        kind: primaryKind,
        label: primaryKind === 'erlen' ? 'Erlen 1' : 'Beher 1',
        x: 130,
        colorHex: '#38bdf8',
        hasSpillTray: true,
        vesselRole: 'primary',
      })
      entities.push({
        id: 'vessel-2',
        kind: 'beher',
        label: primaryKind === 'erlen' ? 'Beher 1' : 'Beher 2',
        x: 295,
        colorHex: '#94a3b8',
        vesselRole: 'secondary',
      })
      cursorX = 425
    }

    // Add authentic reagent containers on the right side
    let rx = cursorX
    reagentItems.forEach((item) => {
      const v = getReagentVisual(item)
      entities.push({
        id: item.id,
        kind: 'reagent',
        label: v.title,
        formula: item.formula,
        subLabel: v.sub,
        x: rx,
        colorHex: v.liquidTint,
        capColor: v.capColor,
        containerStyle: v.style,
        isSolid: v.isSolid,
      })
      rx += v.style === 'dropper' ? 58 : 78

      // Insert BOYA dropper cleanly right after DETERJAN in Fil Diş Macunu!
      if (isElephantToothpaste && item.id === 'deterjan') {
        entities.push({
          id: 'boya',
          kind: 'reagent',
          label: 'BOYA',
          subLabel: 'gıda boyası',
          x: rx - 8,
          colorHex: 'rgba(244,63,94,0.88)',
          capColor: '#e11d48',
          containerStyle: 'dropper',
          isSolid: false,
        })
        rx += 54
      }
    })

    // Add Matchbox at far right for Elephant Toothpaste or combustion/flame experiments
    if (isElephantToothpaste || experiment.materials.includes('kibrit') || experiment.materials.includes('bek')) {
      entities.push({
        id: 'kibrit',
        kind: 'reagent',
        label: 'KİBRİT',
        subLabel: 'ateşleyici',
        x: rx + 6,
        colorHex: '#facc15',
        capColor: '#dc2626',
        containerStyle: 'matchbox',
        isSolid: true,
      })
      rx += 76
    }

    const totalWidth = Math.max(920, rx + 36)
    return { entities, totalWidth }
  }, [experiment.materials, experiment.title, isBalloonExperiment, isElephantToothpaste, isSandbox, preset, reagentItems, sim.sandboxVessel])

  const viewWidth = mobileZoom ? 640 : 920
  const maxPan = Math.max(0, layout.totalWidth - viewWidth)
  const clampedPan = Math.min(maxPan, Math.max(0, panX))

  // Auto-select current step's reagent on load and step advance so Miktar popover + target glows show across all 59 experiments
  useEffect(() => {
    if (isCompleted) {
      setSelectedId(null)
      return
    }
    const reagents = layout.entities.filter((e) => e.kind === 'reagent')
    if (reagents.length === 0) return
    const stepMatIds = activeStep?.materialIds || []
    if (stepMatIds.includes('termometre')) {
      setSelectedId('bench_thermometer')
      return
    }
    const matched =
      reagents.find((r) => stepMatIds.includes(r.id)) ||
      reagents[0]
    if (matched) {
      setSelectedId(matched.id)
      if (matched.containerStyle === 'dropper') setSelectedDose(2)
      else if (matched.isSolid) setSelectedDose(1)
      else setSelectedDose(10)
    }
  }, [experiment.id, currentStepIndex, isCompleted, isSandbox, activeStep, layout.entities])

  const vesselTargets = useMemo(
    () =>
      layout.entities.filter(
        (e) =>
          e.kind === 'cylinder' ||
          e.kind === 'erlen' ||
          e.kind === 'beher' ||
          e.kind === 'burette' ||
          e.kind === 'electro' ||
          e.kind === 'funnel' ||
          e.kind === 'balance'
      ),
    [layout.entities]
  )

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

  // Merge guided step state + per-vessel interactive additions
  const getVesselVisualState = (vessel: BenchEntity): PerVesselState => {
    const custom = vesselStates[vessel.id]
    if (custom) return custom
    if (vessel.vesselRole === 'primary') {
      return {
        vol: sim.vol,
        liquidColor: sim.liquidColor,
        hasDye: false,
        hasH2O2: sim.vol > 0 && isElephantToothpaste,
        hasDetergent: sim.vol >= 55 && isElephantToothpaste,
        hasKI: sim.foamLevel > 0,
        foamLevel: sim.foamLevel,
        precipitateColor: sim.precipitateColor,
        gasMl: sim.gasMl,
        temp: sim.temp,
      }
    }
    return {
      vol: 0,
      liquidColor: 'rgba(148,163,184,0.12)',
      hasDye: false,
      hasH2O2: false,
      hasDetergent: false,
      hasKI: false,
      foamLevel: 0,
      precipitateColor: null,
      gasMl: 0,
      temp: 22,
    }
  }

  const applyMaterialToVessel = (itemId: string, targetVessel: BenchEntity) => {
    const entity = layout.entities.find((x) => x.id === itemId)
    const color = entity?.colorHex || '#38bdf8'
    const isSolid = Boolean(entity?.isSolid)

    // Pour animation above target vessel mouth
    setPourAnim({ itemId, targetX: targetVessel.x, color, isSolid })
    setTimeout(() => setPourAnim(null), 650)

    if (itemId === 'bench_thermometer' || itemId === 'termometre') {
      setThermometerTargetId(targetVessel.id)
      if (!isSandbox && activeStep?.materialIds.includes('termometre')) {
        onSelectBenchMaterial?.('termometre')
      }
      return
    }

    // Update target vessel independent physics
    setVesselStates((prev) => {
      const cur = prev[targetVessel.id] || getVesselVisualState(targetVessel)
      const next: PerVesselState = { ...cur }
      if (itemId === 'boya') {
        next.hasDye = true
        next.vol = Math.min(500, Math.max(cur.vol, 25) + 5)
        next.liquidColor = 'rgba(244,63,94,0.82)'
      } else if (itemId === 'h2o2') {
        next.hasH2O2 = true
        next.vol = Math.min(500, cur.vol + selectedDose)
        next.liquidColor = cur.hasDye ? 'rgba(244,63,94,0.82)' : 'rgba(224,242,254,0.52)'
      } else if (itemId === 'deterjan') {
        next.hasDetergent = true
        next.vol = Math.min(500, cur.vol + selectedDose)
        next.liquidColor = cur.hasDye ? 'rgba(244,63,94,0.82)' : 'rgba(52,211,153,0.48)'
      } else if (itemId === 'ki') {
        next.hasKI = true
        next.vol = Math.min(500, Math.max(cur.vol, 25) + 10)
        if (cur.hasH2O2 || isElephantToothpaste) {
          next.foamLevel = 100
          next.temp = 98
          next.liquidColor = cur.hasDye ? 'rgba(244,63,94,0.85)' : 'rgba(250,204,21,0.82)'
        } else {
          next.liquidColor = 'rgba(226,232,240,0.45)'
        }
      } else if (itemId === 'pbno3') {
        next.vol = Math.min(250, cur.vol + selectedDose)
        next.precipitateColor = '#facc15'
        next.liquidColor = 'rgba(250,204,21,0.72)'
      } else if (itemId === 'kibrit') {
        next.temp = Math.min(100, cur.temp + 28)
      } else {
        next.vol = Math.min(250, cur.vol + (isSolid ? 5 : selectedDose))
        next.liquidColor = color
      }
      return { ...prev, [targetVessel.id]: next }
    })

    // Sync with parent guided/sandbox state when matching or primary
    if (itemId !== 'boya' && onSelectBenchMaterial) {
      if (isSandbox || activeStep?.materialIds.includes(itemId) || targetVessel.vesselRole === 'primary') {
        onSelectBenchMaterial(itemId)
      }
    }
  }

  const handlePointerDownEntity = (e: React.PointerEvent, entity: BenchEntity) => {
    if (entity.kind !== 'reagent' && entity.kind !== 'bench_thermometer') {
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
    if (entity.containerStyle === 'dropper') setSelectedDose(2)
    else if (entity.isSolid) setSelectedDose(1)
    else if (selectedDose < 5) setSelectedDose(10)
  }

  const handlePointerMoveSvg = (e: React.PointerEvent) => {
    if (!dragState) return
    const pt = toSvgCoords(e.clientX, e.clientY)
    const dist = Math.hypot(pt.x - dragState.startX, pt.y - dragState.startY)
    setDragState((prev) => (prev ? { ...prev, currentX: pt.x, currentY: pt.y, moved: prev.moved || dist > 8 } : null))
    const hovered = vesselTargets.find((v) => Math.abs(pt.x - v.x) < 76 && pt.y > 70 && pt.y < 365)
    setHoverVesselId(hovered ? hovered.id : null)
  }

  const handlePointerUpSvg = (e: React.PointerEvent) => {
    if (!dragState) return
    const pt = toSvgCoords(e.clientX, e.clientY)
    const droppedOn = vesselTargets.find((v) => Math.abs(pt.x - v.x) < 82 && pt.y > 70 && pt.y < 370)
    if (dragState.moved && droppedOn) {
      applyMaterialToVessel(dragState.itemId, droppedOn)
    }
    setDragState(null)
    setHoverVesselId(null)
  }

  const selectedEntity =
    selectedId === 'bench_thermometer'
      ? {
          id: 'bench_thermometer',
          kind: 'bench_thermometer' as const,
          label: 'Dijital Termometre',
          x: 340,
          colorHex: '#f43f5e',
        }
      : layout.entities.find((e) => e.id === selectedId) || null

  const showPopoverForSelected =
    selectedEntity &&
    (selectedEntity.kind === 'reagent' || selectedEntity.kind === 'bench_thermometer')

  const doseOptions =
    selectedEntity?.kind === 'reagent' && selectedEntity.containerStyle === 'dropper'
      ? [2, 5]
      : selectedEntity?.kind === 'reagent' && selectedEntity.isSolid
      ? [1, 2]
      : [5, 10]

  const doseUnit =
    selectedEntity?.kind === 'reagent' && selectedEntity.containerStyle === 'dropper'
      ? 'damla'
      : selectedEntity?.kind === 'reagent' && selectedEntity.isSolid
      ? 'g'
      : 'mL'

  // Live thermometer temperature for display
  const primaryVessel = vesselTargets[0]
  const activeTemp =
    effectiveThermometerVesselId && vesselStates[effectiveThermometerVesselId]
      ? vesselStates[effectiveThermometerVesselId].temp
      : sim.temp

  const showBalloonOnSecondary = isBalloonExperiment && (sim.gasMl > 0 || isCompleted)

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
              <span>Serbest Tezgâh — Şişelere tıkla veya sürükle</span>
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

        {/* Live Sensor Pill Strip */}
        <div
          className="flex flex-wrap items-center gap-1.5 text-[11px] font-semibold"
          style={{ fontVariantNumeric: 'tabular-nums' }}
        >
          <span className="px-2.5 py-0.5 rounded-full bg-slate-900 border border-rose-500/35 text-rose-300 inline-flex items-center gap-1">
            <Thermometer className="w-3 h-3" />
            {formatTrDecimal(activeTemp, 1)} °C
          </span>
          <span className="px-2.5 py-0.5 rounded-full bg-slate-900 border border-emerald-500/35 text-emerald-300 inline-flex items-center gap-1">
            pH {formatTrDecimal(sim.ph, 2)}
          </span>
          <span className="px-2.5 py-0.5 rounded-full bg-slate-900 border border-sky-500/35 text-sky-300 inline-flex items-center gap-1">
            <Droplet className="w-3 h-3" />
            {sim.vol} mL
          </span>
          {sim.gasMl > 0 && isBalloonExperiment && (
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

      {/* Main Studio Lab Bench Canvas */}
      <div className="relative w-full select-none">
        {/* TOP-LEFT FLOATING POPOVER (Miktar: 5 mL | 10 mL + Crimson Vessel Target Buttons) */}
        {showPopoverForSelected && (
          <div className="absolute top-3 left-3 z-20 w-[268px] max-w-[calc(100%-24px)] rounded-2xl bg-[#090d16]/95 backdrop-blur-md border border-slate-700/80 p-3 shadow-2xl space-y-2.5">
            <div className="flex items-center justify-between gap-2">
              {selectedEntity.kind === 'bench_thermometer' ? (
                <span className="text-xs font-bold text-rose-300">Dijital Termometre</span>
              ) : (
                <div className="flex items-center gap-1.5 text-xs">
                  <span className="text-slate-400 font-semibold">Miktar:</span>
                  {doseOptions.map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => setSelectedDose(amt)}
                      className={`px-2.5 py-0.5 rounded-full font-bold text-[11px] border cursor-pointer transition-all ${
                        selectedDose === amt
                          ? 'bg-rose-500/20 border-rose-400 text-rose-200'
                          : 'bg-slate-900 border-slate-700 text-slate-300 hover:border-slate-500'
                      }`}
                    >
                      {amt} {doseUnit}
                    </button>
                  ))}
                </div>
              )}
              <button
                type="button"
                onClick={() => setSelectedId(null)}
                aria-label="Menüyü kapat"
                className="p-0.5 rounded-md text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-1.5">
              {vesselTargets.map((target) => (
                <button
                  key={target.id}
                  type="button"
                  onClick={() => applyMaterialToVessel(selectedEntity.id, target)}
                  className="w-full px-3.5 py-2 rounded-xl bg-[#dc2626] hover:bg-[#ef4444] text-white text-xs font-extrabold text-left shadow-md cursor-pointer transition-all flex items-center justify-between"
                >
                  <span>
                    {selectedEntity.kind === 'bench_thermometer'
                      ? `Yerleştir → ${target.label}`
                      : selectedEntity.containerStyle === 'matchbox'
                      ? `Ateşle → ${target.label}`
                      : `${selectedDose} ${doseUnit} · Ekle → ${target.label}`}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        <svg
          ref={svgRef}
          viewBox={`${clampedPan} 0 ${viewWidth} 430`}
          onPointerMove={handlePointerMoveSvg}
          onPointerUp={handlePointerUpSvg}
          onPointerCancel={handlePointerUpSvg}
          onClick={(e) => {
            if (e.target === svgRef.current) setSelectedId(null)
          }}
          className="w-full h-auto max-h-[430px] touch-pan-y cursor-default"
          role="img"
          aria-label={`${experiment.title} İnteraktif Laboratuvar Tezgâhı`}
        >
          <defs>
            <linearGradient id="benchSurfaceGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#263142" />
              <stop offset="30%" stopColor="#1b2432" />
              <stop offset="100%" stopColor="#0f1520" />
            </linearGradient>

            <linearGradient id="glassBodyGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="rgba(255,255,255,0.22)" />
              <stop offset="20%" stopColor="rgba(255,255,255,0.06)" />
              <stop offset="65%" stopColor="rgba(255,255,255,0.02)" />
              <stop offset="100%" stopColor="rgba(255,255,255,0.22)" />
            </linearGradient>

            <linearGradient id="amberBottleGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#7c4f2b" />
              <stop offset="30%" stopColor="#653f21" />
              <stop offset="75%" stopColor="#523219" />
              <stop offset="100%" stopColor="#7c4f2b" />
            </linearGradient>

            <radialGradient id="burnerFlameGlow" cx="50%" cy="60%" r="55%">
              <stop offset="0%" stopColor={sim.flameColor || '#38bdf8'} stopOpacity="0.9" />
              <stop offset="65%" stopColor={sim.flameColor || '#0284c7'} stopOpacity="0.35" />
              <stop offset="100%" stopColor={sim.flameColor || '#0284c7'} stopOpacity="0" />
            </radialGradient>

            <pattern id="labBenchGrid" width="46" height="46" patternUnits="userSpaceOnUse">
              <path d="M 46 0 L 0 0 0 46" fill="none" stroke="rgba(148,163,184,0.075)" strokeWidth="1" />
            </pattern>

            <clipPath id="cylinderInteriorClip">
              <rect x="-24" y="96" width="48" height="226" rx="2" />
            </clipPath>

            <clipPath id="erlenInteriorClip">
              <path d="M -18 172 L -18 204 L -62 315 Q -63 324 -51 324 L 51 324 Q 63 324 62 315 L 18 204 L 18 172 Z" />
            </clipPath>

            <clipPath id="beakerInteriorClip">
              <rect x="-52" y="192" width="104" height="133" rx="9" />
            </clipPath>

            <clipPath id="wideBottleClip">
              <rect x="-28" y="232" width="56" height="90" rx="7" />
            </clipPath>
          </defs>

          {/* Background Grid + Slate Benchtop */}
          <rect x="0" y="0" width={layout.totalWidth} height="335" fill="#101826" onClick={() => setSelectedId(null)} />
          <rect x="0" y="0" width={layout.totalWidth} height="335" fill="url(#labBenchGrid)" pointerEvents="none" />
          <rect x="0" y="330" width={layout.totalWidth} height="100" fill="url(#benchSurfaceGrad)" onClick={() => setSelectedId(null)} />
          <line x1="0" y1="330" x2={layout.totalWidth} y2="330" stroke="rgba(148,163,184,0.22)" strokeWidth="1.5" />

          {/* ── RENDER AUTHENTIC BENCH ENTITIES ── */}
          {layout.entities.map((entity) => {
            const isSelected = selectedId === entity.id
            const isHoverTarget = hoverVesselId === entity.id
            const isTargetHighlight = Boolean(showPopoverForSelected) && entity.kind !== 'reagent' && entity.kind !== 'bench_thermometer'

            /* ── 500 mL TALL GRADUATED CYLINDER (UZUN MEZÜR) ── */
            if (entity.kind === 'cylinder') {
              const vs = getVesselVisualState(entity)
              const hasFoam = vs.foamLevel > 0 || (entity.vesselRole === 'primary' && sim.foamLevel > 0)
              const effectiveVol = Math.max(vs.vol, hasFoam ? 95 : 0)
              const liqHeight = Math.min(210, Math.round((effectiveVol / 500) * 205))
              const liqTopY = 322 - liqHeight
              const foamTint = vs.hasDye ? 'rgba(244,182,196,0.92)' : 'rgba(253,230,158,0.9)'
              const liquidBaseTint = vs.hasDye ? '#db2777' : vs.liquidColor || 'rgba(234,179,8,0.85)'
              const hasThermometerHere = effectiveThermometerVesselId === entity.id

              return (
                <g
                  key={entity.id}
                  transform={`translate(${entity.x}, 0)`}
                  onClick={(e) => {
                    e.stopPropagation()
                    if (showPopoverForSelected && selectedEntity) {
                      applyMaterialToVessel(selectedEntity.id, entity)
                    } else {
                      setSelectedId(entity.id)
                    }
                  }}
                  className="cursor-pointer"
                >
                  {/* White Ceramic/Plastic Spill Tray (Küvet) under Uzun mezür 1 */}
                  {entity.hasSpillTray && (
                    <g>
                      <rect x="-46" y="322" width="168" height="11" rx="4" fill="#cbd5e1" stroke="#94a3b8" strokeWidth="1" />
                      <rect x="-42" y="324" width="160" height="5" rx="2" fill="#f1f5f9" />
                      {hasFoam && (
                        <ellipse cx="32" cy="324" rx="44" ry="3.5" fill={foamTint} />
                      )}
                      {showPopoverForSelected && (
                        <rect
                          x="-52"
                          y="314"
                          width="180"
                          height="26"
                          rx="8"
                          fill="none"
                          stroke="rgba(234,179,8,0.65)"
                          strokeWidth="1.8"
                        />
                      )}
                    </g>
                  )}

                  {/* Amber/Gold Target Outline when user selected a reagent */}
                  {(isTargetHighlight || isHoverTarget) && (
                    <rect
                      x="-40"
                      y="78"
                      width="80"
                      height="262"
                      rx="12"
                      fill={isHoverTarget ? 'rgba(56,189,248,0.08)' : 'none'}
                      stroke={isHoverTarget ? '#38bdf8' : 'rgba(234,179,8,0.72)'}
                      strokeWidth="2"
                    />
                  )}

                  {/* Clipped Interior Liquid + Full-Column Bubbly Foam */}
                  <g clipPath="url(#cylinderInteriorClip)">
                    {hasFoam ? (
                      <g>
                        {/* Dense Foam Filling Entire 500 mL Cylinder Column */}
                        <rect x="-24" y="102" width="48" height="220" fill={foamTint} />
                        {/* Concentrated Darker Liquid Phase at Bottom (0..90 mL) */}
                        <rect x="-24" y="286" width="48" height="36" fill={liquidBaseTint} opacity="0.92" />
                        {/* Scattered Air & Oxygen Foam Bubbles */}
                        {[
                          { cx: -12, cy: 118, r: 2.2 },
                          { cx: 8, cy: 132, r: 3.1 },
                          { cx: -6, cy: 152, r: 2.4 },
                          { cx: 11, cy: 168, r: 2.8 },
                          { cx: -10, cy: 188, r: 3.4 },
                          { cx: 6, cy: 206, r: 2.2 },
                          { cx: -13, cy: 226, r: 2.6 },
                          { cx: 9, cy: 244, r: 3.3 },
                          { cx: -7, cy: 266, r: 2.8 },
                          { cx: 12, cy: 278, r: 2.1 },
                          { cx: -11, cy: 298, r: 2.6 },
                          { cx: 5, cy: 308, r: 2.9 },
                        ].map((b, bi) => (
                          <circle
                            key={bi}
                            cx={b.cx}
                            cy={b.cy}
                            r={b.r}
                            fill="rgba(255,255,255,0.52)"
                          />
                        ))}
                      </g>
                    ) : (
                      effectiveVol > 0 && (
                        <g>
                          <rect x="-24" y={liqTopY} width="48" height={322 - liqTopY} fill={liquidBaseTint} />
                          <ellipse cx="0" cy={liqTopY} rx="24" ry="2.5" fill={liquidBaseTint} stroke="rgba(255,255,255,0.4)" strokeWidth="0.8" />
                        </g>
                      )
                    )}

                    {/* Thermometer Dipped Inside Cylinder if placed */}
                    {hasThermometerHere && (
                      <g transform="translate(8, 0)">
                        <rect x="-2.5" y="102" width="5" height="214" rx="2.5" fill="rgba(241,245,249,0.75)" stroke="rgba(148,163,184,0.6)" strokeWidth="0.7" />
                        <rect
                          x="-1"
                          y={Math.max(115, 304 - (vs.temp / 100) * 165)}
                          width="2"
                          height={Math.min(185, 16 + (vs.temp / 100) * 165)}
                          fill="#f43f5e"
                        />
                        <circle cx="0" cy="312" r="4" fill="#e11d48" />
                      </g>
                    )}
                  </g>

                  {/* Overflowing Foam Crown at Top Lip */}
                  {hasFoam && (
                    <path
                      d="M -25 99 C -20 90, 20 90, 25 99 L 25 104 L -25 104 Z"
                      fill={foamTint}
                    />
                  )}

                  {/* Cylinder Glass Outline + Flared Pouring Lip */}
                  <rect
                    x="-24"
                    y="96"
                    width="48"
                    height="226"
                    fill="url(#glassBodyGrad)"
                    stroke="rgba(203,213,225,0.72)"
                    strokeWidth="2"
                  />
                  <path
                    d="M -28 92 L -24 96 M 24 96 L 31 91 M -28 92 L 31 91"
                    stroke="rgba(226,232,240,0.8)"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                  />

                  {/* Blue Hexagonal Plastic Foot Base (matching studio cylinder) */}
                  <polygon
                    points="-33,332 -28,322 28,322 33,332"
                    fill="#1d4ed8"
                    stroke="#3b82f6"
                    strokeWidth="1.2"
                  />

                  {/* Left-Center "mL" + Blue-Grey Graduations (100..500) */}
                  <text
                    x="-19"
                    y="108"
                    fill="#93c5fd"
                    fontSize="8.5"
                    fontWeight="700"
                    fontFamily={SVG_FONT}
                  >
                    mL
                  </text>
                  {Array.from({ length: 19 }).map((_, idx) => {
                    const y = 122 + idx * 9.5
                    const isMajor = idx % 4 === 0 && idx <= 16
                    const val = 500 - (idx / 4) * 100
                    return (
                      <g key={idx} pointerEvents="none">
                        <line
                          x1="-22"
                          y1={y}
                          x2={isMajor ? '-6' : '-13'}
                          y2={y}
                          stroke={hasFoam ? 'rgba(30,41,59,0.55)' : 'rgba(147,197,253,0.65)'}
                          strokeWidth={isMajor ? '1.2' : '0.8'}
                        />
                        {isMajor && (
                          <text
                            x="-3"
                            y={y + 3}
                            fill={hasFoam ? '#1e293b' : '#93c5fd'}
                            fontSize="8.5"
                            fontWeight="700"
                            fontFamily={SVG_FONT}
                            style={{ fontVariantNumeric: 'tabular-nums' }}
                          >
                            {val}
                          </text>
                        )}
                      </g>
                    )
                  })}

                  {/* Floating Dark Temperature Pill Badge when Thermometer is Placed */}
                  {hasThermometerHere && (
                    <g transform="translate(28, 124)">
                      <rect
                        x="0"
                        y="0"
                        width="68"
                        height="26"
                        rx="8"
                        fill="#090D16"
                        stroke="rgba(244,63,94,0.65)"
                        strokeWidth="1.4"
                      />
                      <text
                        x="34"
                        y="17"
                        textAnchor="middle"
                        fill="#ffffff"
                        fontSize="11.5"
                        fontWeight="700"
                        fontFamily={SVG_FONT}
                        style={{ fontVariantNumeric: 'tabular-nums' }}
                      >
                        {formatTrDecimal(vs.temp, 1)} °C
                      </text>
                    </g>
                  )}

                  {/* Cylinder Name Label */}
                  <text
                    x="0"
                    y="354"
                    textAnchor="middle"
                    fill={isSelected ? '#38bdf8' : 'rgba(148,163,184,0.75)'}
                    fontSize="10"
                    fontWeight="600"
                    fontFamily={SVG_FONT}
                  >
                    {entity.label}
                  </text>
                </g>
              )
            }

            /* ── CONICAL ERLENMEYER FLASK (250 mL) ── */
            if (entity.kind === 'erlen') {
              const vs = getVesselVisualState(entity)
              const role = entity.vesselRole || 'primary'
              const liqTopY = 324 - Math.round(Math.min(0.88, Math.max(0, vs.vol / 250)) * 108)
              const hasFoam = vs.foamLevel > 0 || (role === 'primary' && sim.foamLevel > 0)
              const hasThermometerHere = effectiveThermometerVesselId === entity.id
              const showBalloon = role === 'secondary' && showBalloonOnSecondary

              return (
                <g
                  key={entity.id}
                  transform={`translate(${entity.x}, 0)`}
                  onClick={(e) => {
                    e.stopPropagation()
                    if (showPopoverForSelected && selectedEntity) {
                      applyMaterialToVessel(selectedEntity.id, entity)
                    } else {
                      setSelectedId(entity.id)
                      if (!isSandbox && !isCompleted && role === 'primary') onTriggerStep()
                    }
                  }}
                  className="cursor-pointer"
                >
                  {/* Spill Tray under primary Erlenmeyer */}
                  {entity.hasSpillTray && (
                    <g>
                      <rect x="-78" y="324" width="156" height="10" rx="4" fill="#cbd5e1" stroke="#94a3b8" strokeWidth="1" />
                      <rect x="-74" y="326" width="148" height="4" rx="2" fill="#f1f5f9" />
                      {showPopoverForSelected && (
                        <rect x="-84" y="317" width="168" height="22" rx="7" fill="none" stroke="rgba(234,179,8,0.65)" strokeWidth="1.8" />
                      )}
                    </g>
                  )}
                  {(isTargetHighlight || isHoverTarget) && (
                    <rect
                      x="-72"
                      y="156"
                      width="144"
                      height="182"
                      rx="14"
                      fill={isHoverTarget ? 'rgba(56,189,248,0.08)' : 'none'}
                      stroke={isHoverTarget ? '#38bdf8' : 'rgba(234,179,8,0.72)'}
                      strokeWidth="2"
                    />
                  )}

                  {/* Bunsen Burner under heated Erlen */}
                  {role === 'primary' && (sim.burnerOn || experiment.materials.includes('bek')) && (
                    <g opacity={sim.burnerOn ? 1 : 0.55}>
                      <rect x="-24" y="325" width="48" height="6" rx="3" fill="#475569" />
                      {sim.burnerOn && (
                        <g>
                          <ellipse cx="0" cy="316" rx="22" ry="12" fill="url(#burnerFlameGlow)" />
                          <path d="M 0 326 Q -10 314 0 302 Q 10 314 0 326 Z" fill={sim.flameColor || '#38bdf8'}>
                            <animate attributeName="opacity" values="0.78;1;0.82" dur={pulseDuration} repeatCount="indefinite" />
                          </path>
                        </g>
                      )}
                    </g>
                  )}

                  {/* Balloon if Gas Experiment */}
                  {showBalloon && (
                    <g>
                      {(() => {
                        const boost = Math.min(1, sim.gasMl / 260)
                        const rx = 20 + boost * 22
                        const ry = 24 + boost * 28
                        const cy = 166 - ry
                        return (
                          <g>
                            <ellipse cx="0" cy={cy} rx={rx} ry={ry} fill="#f43f5e" />
                            <rect x="-21" y="162" width="42" height="10" rx="3" fill="#e11d48" />
                            <g transform={`translate(22, ${cy - ry - 6})`}>
                              <rect x="0" y="0" width="74" height="26" rx="8" fill="#090D16" stroke="rgba(16,185,129,0.55)" strokeWidth="1.4" />
                              <text
                                x="37"
                                y="17"
                                textAnchor="middle"
                                fill="#ffffff"
                                fontSize="11.5"
                                fontWeight="700"
                                fontFamily={SVG_FONT}
                                style={{ fontVariantNumeric: 'tabular-nums' }}
                              >
                                {sim.gasMl} mL
                              </text>
                            </g>
                          </g>
                        )
                      })()}
                    </g>
                  )}

                  <g clipPath="url(#erlenInteriorClip)">
                    {vs.vol > 0 && (
                      <g>
                        <rect x="-70" y={liqTopY} width="140" height={330 - liqTopY} fill={vs.liquidColor} />
                        <ellipse cx="0" cy={liqTopY} rx="62" ry="4" fill={vs.liquidColor} stroke="rgba(255,255,255,0.42)" strokeWidth="1" />
                      </g>
                    )}
                    {hasFoam && (
                      <rect x="-70" y="185" width="140" height="110" fill="rgba(253,230,158,0.86)" />
                    )}
                    {vs.precipitateColor && !hasFoam && (
                      <path d="M -60 314 Q 0 306 60 314 L 60 326 L -60 326 Z" fill={vs.precipitateColor} opacity="0.94" />
                    )}
                    {hasThermometerHere && (
                      <g transform="rotate(6, 0, 310)">
                        <rect x="-2.5" y="138" width="5" height="176" rx="2.5" fill="rgba(241,245,249,0.72)" stroke="rgba(148,163,184,0.6)" strokeWidth="0.8" />
                        <rect
                          x="-1"
                          y={Math.max(150, 306 - Math.min(130, (vs.temp / 100) * 125))}
                          width="2"
                          height={Math.min(156, 12 + (vs.temp / 100) * 125)}
                          fill="#f43f5e"
                        />
                        <circle cx="0" cy="312" r="4.5" fill="#e11d48" />
                      </g>
                    )}
                  </g>

                  <path
                    d="M -20 171 L -20 204 L -64 316 Q -66 326 -54 326 L 54 326 Q 66 326 64 316 L 20 204 L 20 171 Z"
                    fill="url(#glassBodyGrad)"
                    stroke="rgba(203,213,225,0.68)"
                    strokeWidth="2"
                  />
                  <rect x="-23" y="167" width="46" height="5" rx="2.5" fill="rgba(226,232,240,0.45)" stroke="rgba(226,232,240,0.75)" strokeWidth="1" />
                  <path d="M -16 175 L -16 205 L -56 312 L -49 312 L -11 205 L -11 175 Z" fill="rgba(255,255,255,0.13)" pointerEvents="none" />

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
                      </g>
                    )
                  })}

                  {hasThermometerHere && (
                    <g transform="translate(24, 156)">
                      <rect x="0" y="0" width="70" height="26" rx="8" fill="#090D16" stroke="rgba(244,63,94,0.65)" strokeWidth="1.4" />
                      <text
                        x="35"
                        y="17"
                        textAnchor="middle"
                        fill="#ffffff"
                        fontSize="11.5"
                        fontWeight="700"
                        fontFamily={SVG_FONT}
                        style={{ fontVariantNumeric: 'tabular-nums' }}
                      >
                        {formatTrDecimal(vs.temp, 1)} °C
                      </text>
                    </g>
                  )}

                  <text x="0" y="354" textAnchor="middle" fill="rgba(148,163,184,0.75)" fontSize="10" fontWeight="600" fontFamily={SVG_FONT}>
                    {entity.label}
                  </text>
                </g>
              )
            }

            /* ── 250 mL LABORATORY BEAKER (BEHER) ── */
            if (entity.kind === 'beher') {
              const vs = getVesselVisualState(entity)
              const liqTopY = 324 - Math.round(Math.min(0.88, Math.max(0, vs.vol / 250)) * 108)
              const hasThermometerHere = effectiveThermometerVesselId === entity.id

              return (
                <g
                  key={entity.id}
                  transform={`translate(${entity.x}, 0)`}
                  onClick={(e) => {
                    e.stopPropagation()
                    if (showPopoverForSelected && selectedEntity) {
                      applyMaterialToVessel(selectedEntity.id, entity)
                    } else {
                      setSelectedId(entity.id)
                      if (!isSandbox && !isCompleted && entity.vesselRole === 'primary') onTriggerStep()
                    }
                  }}
                  className="cursor-pointer"
                >
                  {/* Spill Tray under primary Beaker */}
                  {entity.hasSpillTray && (
                    <g>
                      <rect x="-70" y="324" width="140" height="10" rx="4" fill="#cbd5e1" stroke="#94a3b8" strokeWidth="1" />
                      <rect x="-66" y="326" width="132" height="4" rx="2" fill="#f1f5f9" />
                      {showPopoverForSelected && (
                        <rect x="-76" y="317" width="152" height="22" rx="7" fill="none" stroke="rgba(234,179,8,0.65)" strokeWidth="1.8" />
                      )}
                    </g>
                  )}
                  {(isTargetHighlight || isHoverTarget) && (
                    <rect
                      x="-64"
                      y="180"
                      width="128"
                      height="156"
                      rx="14"
                      fill={isHoverTarget ? 'rgba(56,189,248,0.08)' : 'none'}
                      stroke={isHoverTarget ? '#38bdf8' : 'rgba(234,179,8,0.72)'}
                      strokeWidth="2"
                    />
                  )}

                  <g clipPath="url(#beakerInteriorClip)">
                    {vs.vol > 0 && (
                      <g>
                        <rect x="-56" y={liqTopY} width="112" height={330 - liqTopY} fill={vs.liquidColor} />
                        <ellipse cx="0" cy={liqTopY} rx="52" ry="3.5" fill={vs.liquidColor} stroke="rgba(255,255,255,0.42)" strokeWidth="1" />
                      </g>
                    )}
                    {vs.precipitateColor && (
                      <path d="M -52 315 Q 0 308 52 315 L 52 325 L -52 325 Z" fill={vs.precipitateColor} opacity="0.92" />
                    )}
                    {hasThermometerHere && (
                      <g transform="rotate(6, 0, 310)">
                        <rect x="-2.5" y="156" width="5" height="162" rx="2.5" fill="rgba(241,245,249,0.72)" stroke="rgba(148,163,184,0.6)" strokeWidth="0.8" />
                        <circle cx="0" cy="312" r="4.5" fill="#e11d48" />
                      </g>
                    )}
                  </g>

                  <path
                    d="M -58 190 L -53 195 L -53 316 Q -53 326 -43 326 L 43 326 Q 53 326 53 316 L 53 195 L 58 189"
                    fill="url(#glassBodyGrad)"
                    stroke="rgba(203,213,225,0.68)"
                    strokeWidth="2"
                    strokeLinejoin="round"
                  />
                  <line x1="-58" y1="190" x2="58" y2="189" stroke="rgba(226,232,240,0.7)" strokeWidth="2.5" strokeLinecap="round" />
                  <rect x="-47" y="198" width="8" height="118" rx="4" fill="rgba(255,255,255,0.13)" pointerEvents="none" />

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
                      </g>
                    )
                  })}

                  {hasThermometerHere && (
                    <g transform="translate(26, 166)">
                      <rect x="0" y="0" width="70" height="26" rx="8" fill="#090D16" stroke="rgba(244,63,94,0.65)" strokeWidth="1.4" />
                      <text
                        x="35"
                        y="17"
                        textAnchor="middle"
                        fill="#ffffff"
                        fontSize="11.5"
                        fontWeight="700"
                        fontFamily={SVG_FONT}
                        style={{ fontVariantNumeric: 'tabular-nums' }}
                      >
                        {formatTrDecimal(vs.temp, 1)} °C
                      </text>
                    </g>
                  )}

                  <text x="0" y="354" textAnchor="middle" fill="rgba(148,163,184,0.75)" fontSize="10" fontWeight="600" fontFamily={SVG_FONT}>
                    {entity.label}
                  </text>
                </g>
              )
            }

            /* ── SPECIALIZED APPARATUS (Burette, Electro, Flame, Tube Rack, Funnel, Balance) ── */
            if (entity.kind === 'burette') {
              return (
                <g key={entity.id} transform={`translate(${entity.x}, 0)`} onClick={onTriggerStep} className="cursor-pointer">
                  <rect x="-95" y="324" width="190" height="8" rx="3" fill="#475569" />
                  <rect x="-78" y="42" width="9" height="284" rx="3" fill="#64748b" />
                  <rect x="-70" y="88" width="76" height="6" rx="2.5" fill="#94a3b8" />
                  <rect x="-11" y="54" width="22" height="148" rx="4" fill="url(#glassBodyGrad)" stroke="#cbd5e1" strokeWidth="1.8" />
                  <rect x="-9" y="72" width="18" height="122" fill="rgba(192,132,252,0.45)" />
                  <rect x="-16" y="202" width="32" height="7" rx="3" fill="#38bdf8" />
                  <circle cx="0" cy="222" r="4" fill="#ec4899">
                    <animate attributeName="cy" values="214;286" dur={pulseDuration} repeatCount="indefinite" />
                  </circle>
                  <g clipPath="url(#erlenInteriorClip)" transform="translate(0, 0) scale(0.86) translate(0, 52)">
                    <rect x="-66" y="254" width="132" height="74" fill={sim.liquidColor} />
                  </g>
                  <path
                    d="M -16 218 L -16 244 L -54 316 Q -54 324 -44 324 L 44 324 Q 54 324 54 316 L 16 244 L 16 218 Z"
                    fill="url(#glassBodyGrad)"
                    stroke="#cbd5e1"
                    strokeWidth="2"
                  />
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
                  <rect x="-165" y="232" width="90" height="92" fill="rgba(148,163,184,0.22)" />
                  <path d="M -166 198 L -166 326 L -74 326 L -74 198" fill="url(#glassBodyGrad)" stroke="#cbd5e1" strokeWidth="2" />
                  <rect x="-128" y="182" width="16" height="122" rx="3" fill="#94a3b8" />
                  <rect x="75" y="232" width="90" height="92" fill={sim.liquidColor || 'rgba(14,165,233,0.48)'} />
                  <path d="M 74 198 L 74 326 L 166 326 L 166 198" fill="url(#glassBodyGrad)" stroke="#cbd5e1" strokeWidth="2" />
                  <rect x="112" y="182" width="16" height="122" rx="3" fill="#d97706" />
                  <path d="M -92 252 L -92 158 Q 0 128 92 158 L 92 252" fill="none" stroke="#a7f3d0" strokeWidth="14" strokeLinecap="round" opacity="0.72" />
                </g>
              )
            }

            if (entity.kind === 'flame') {
              return (
                <g key={entity.id} transform={`translate(${entity.x}, 0)`} onClick={onTriggerStep} className="cursor-pointer">
                  <rect x="-48" y="316" width="96" height="14" rx="4" fill="#475569" />
                  <rect x="-11" y="205" width="22" height="111" fill="#64748b" />
                  <ellipse cx="0" cy="148" rx="64" ry="70" fill="url(#burnerFlameGlow)" />
                  <path d="M 0 205 C -32 175, -32 108, 0 64 C 32 108, 32 175, 0 205 Z" fill={sim.flameColor || '#38bdf8'} opacity="0.92">
                    <animate attributeName="opacity" values="0.82;1;0.85" dur={pulseDuration} repeatCount="indefinite" />
                  </path>
                  <line x1="120" y1="144" x2="2" y2="144" stroke="#cbd5e1" strokeWidth="3.5" />
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
                      <rect x={tube.ox - 14} y="118" width="28" height="188" rx="13" fill="url(#glassBodyGrad)" stroke="#cbd5e1" strokeWidth="1.8" />
                      <text x={tube.ox} y="354" textAnchor="middle" fill="#cbd5e1" fontSize="10" fontWeight="600" fontFamily={SVG_FONT}>
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
                  <path d="M -50 156 L -50 274 L 50 274 L 50 156" fill="url(#glassBodyGrad)" stroke="#cbd5e1" strokeWidth="2" />
                </g>
              )
            }

            /* ── AUTHENTIC REAGENT CONTAINERS (Amber GHS, Wide Lab Bottle, Dropper, Solid Jar, Matchbox) ── */
            const isDragging = dragState?.entityId === entity.id && dragState.moved
            const tx = isDragging ? dragState.currentX : entity.x
            const ty = isDragging ? dragState.currentY - 265 : 0
            const style = entity.containerStyle || 'wide_bottle'

            if (style === 'matchbox') {
              return (
                <g
                  key={entity.id}
                  transform={`translate(${tx}, ${ty})`}
                  onPointerDown={(e) => handlePointerDownEntity(e, entity)}
                  className="cursor-grab active:cursor-grabbing"
                >
                  {isSelected && !isDragging && (
                    <rect x="-34" y="292" width="68" height="44" rx="8" fill="none" stroke="rgba(248,250,252,0.85)" strokeWidth="1.6" strokeDasharray="5 4" />
                  )}
                  <rect x="-26" y="302" width="52" height="26" rx="3" fill="#991b1b" />
                  <rect x="-24" y="305" width="48" height="16" rx="2" fill="#facc15" />
                  <text x="0" y="317" textAnchor="middle" fill="#991b1b" fontSize="9.5" fontWeight="900" fontFamily={SVG_FONT}>
                    KİBRİT
                  </text>
                  <rect x="-26" y="324" width="52" height="6" rx="1.5" fill="#78350f" />
                </g>
              )
            }

            if (style === 'dropper') {
              return (
                <g
                  key={entity.id}
                  transform={`translate(${tx}, ${ty})`}
                  onPointerDown={(e) => handlePointerDownEntity(e, entity)}
                  className="cursor-grab active:cursor-grabbing"
                >
                  {isSelected && !isDragging && (
                    <rect x="-24" y="246" width="48" height="86" rx="8" fill="none" stroke="rgba(248,250,252,0.85)" strokeWidth="1.6" strokeDasharray="5 4" />
                  )}
                  {/* Pointed Red/Colored Dropper Nozzle */}
                  <polygon points="-4,254 4,254 8,274 -8,274" fill={entity.capColor || '#e11d48'} />
                  <rect x="-10" y="272" width="20" height="7" rx="2" fill="#be123c" />
                  {/* White Squeeze Body */}
                  <rect x="-16" y="279" width="32" height="49" rx="5" fill="#f1f5f9" stroke="#cbd5e1" strokeWidth="1.2" />
                  <rect x="-14" y="290" width="28" height="22" rx="2" fill={entity.capColor || '#e11d48'} />
                  <text x="0" y="304" textAnchor="middle" fill="#ffffff" fontSize="8" fontWeight="800" fontFamily={SVG_FONT}>
                    {entity.label}
                  </text>
                </g>
              )
            }

            if (style === 'amber_ghs') {
              return (
                <g
                  key={entity.id}
                  transform={`translate(${tx}, ${ty})`}
                  onPointerDown={(e) => handlePointerDownEntity(e, entity)}
                  className="cursor-grab active:cursor-grabbing"
                >
                  {isSelected && !isDragging && (
                    <rect x="-36" y="198" width="72" height="136" rx="10" fill="none" stroke="rgba(248,250,252,0.85)" strokeWidth="1.6" strokeDasharray="5 4" />
                  )}
                  {/* White Ribbed Cap */}
                  <rect x="-14" y="206" width="28" height="16" rx="3" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="0.8" />
                  {[-8, -3, 2, 7].map((lx) => (
                    <line key={lx} x1={lx} y1="208" x2={lx} y2="220" stroke="#94a3b8" strokeWidth="0.9" />
                  ))}
                  {/* Amber Brown Apothecary Glass */}
                  <path
                    d="M -12 222 L -12 228 Q -30 238 -30 250 L -30 322 Q -30 328 -24 328 L 24 328 Q 30 328 30 322 L 30 250 Q 30 238 12 228 L 12 222 Z"
                    fill="url(#amberBottleGrad)"
                    stroke="#a16207"
                    strokeWidth="1.5"
                  />
                  {/* White Label + GHS Hazard Diamond */}
                  <rect x="-24" y="248" width="48" height="68" rx="3" fill="#f8fafc" />
                  <text x="0" y="266" textAnchor="middle" fill="#0f172a" fontSize="11.5" fontWeight="800" fontFamily={SVG_FONT}>
                    {entity.label}
                  </text>
                  <text x="0" y="279" textAnchor="middle" fill="#475569" fontSize="8" fontWeight="700" fontFamily={SVG_FONT}>
                    {entity.subLabel}
                  </text>
                  {/* Red GHS Oxidizer/Hazard Diamond */}
                  <g transform="translate(0, 299) rotate(45)">
                    <rect x="-8.5" y="-8.5" width="17" height="17" fill="#ffffff" stroke="#dc2626" strokeWidth="2.2" />
                  </g>
                  <circle cx="0" cy="301" r="3" fill="none" stroke="#0f172a" strokeWidth="1.4" />
                  <path d="M 0 293 Q 3 296 0 299 Q -3 296 0 293 Z" fill="#0f172a" />
                </g>
              )
            }

            if (style === 'solid_jar') {
              return (
                <g
                  key={entity.id}
                  transform={`translate(${tx}, ${ty})`}
                  onPointerDown={(e) => handlePointerDownEntity(e, entity)}
                  className="cursor-grab active:cursor-grabbing"
                >
                  {isSelected && !isDragging && (
                    <rect x="-34" y="222" width="68" height="112" rx="10" fill="none" stroke="rgba(248,250,252,0.85)" strokeWidth="1.6" strokeDasharray="5 4" />
                  )}
                  <rect x="-20" y="228" width="40" height="14" rx="3" fill="#475569" />
                  <rect x="-27" y="242" width="54" height="86" rx="6" fill="url(#glassBodyGrad)" stroke="rgba(203,213,225,0.65)" strokeWidth="1.6" />
                  <path d="M -25 310 Q 0 304 25 310 L 25 324 L -25 324 Z" fill={entity.colorHex} opacity="0.72" />
                  <rect x="-23" y="258" width="46" height="44" rx="3" fill="#f8fafc" />
                  <text x="0" y="277" textAnchor="middle" fill="#0f172a" fontSize={entity.label.length > 6 ? '8' : '10.5'} fontWeight="800" fontFamily={SVG_FONT}>
                    {entity.label}
                  </text>
                  <text x="0" y="291" textAnchor="middle" fill="#475569" fontSize="6.5" fontWeight="600" fontFamily={SVG_FONT}>
                    {entity.subLabel}
                  </text>
                </g>
              )
            }

            /* Default: Wide Shouldered Reagent Bottle (DETERJAN, KI 1 mol/L, HCl, NaOH...) */
            return (
              <g
                key={entity.id}
                transform={`translate(${tx}, ${ty})`}
                onPointerDown={(e) => handlePointerDownEntity(e, entity)}
                className="cursor-grab active:cursor-grabbing"
              >
                {isSelected && !isDragging && (
                  <rect x="-38" y="200" width="76" height="134" rx="10" fill="none" stroke="rgba(248,250,252,0.85)" strokeWidth="1.6" strokeDasharray="5 4" />
                )}
                <rect x="-14" y="208" width="28" height="16" rx="3" fill={entity.capColor || '#64748b'} />
                <g clipPath="url(#wideBottleClip)">
                  <rect x="-28" y="244" width="56" height="80" fill={entity.colorHex} opacity="0.52" />
                </g>
                <path
                  d="M -12 224 L -12 230 Q -30 238 -30 250 L -30 322 Q -30 328 -24 328 L 24 328 Q 30 328 30 322 L 30 250 Q 30 238 12 230 L 12 224 Z"
                  fill="url(#glassBodyGrad)"
                  stroke="rgba(203,213,225,0.68)"
                  strokeWidth="1.6"
                />
                <rect x="-25" y="256" width="50" height="46" rx="3" fill="#f8fafc" />
                <text
                  x="0"
                  y="276"
                  textAnchor="middle"
                  fill="#0f172a"
                  fontSize={entity.label.length > 6 ? '8.2' : '11.5'}
                  fontWeight="800"
                  fontFamily={SVG_FONT}
                >
                  {entity.label}
                </text>
                <text x="0" y="291" textAnchor="middle" fill="#475569" fontSize="6.8" fontWeight="600" fontFamily={SVG_FONT}>
                  {entity.subLabel}
                </text>
              </g>
            )
          })}

          {/* Foreground Bench Items: Horizontal Thermometer (below vessel labels, zero overlap across all 59 experiments) */}
          {!effectiveThermometerVesselId && (
            <g
              transform={
                dragState?.entityId === 'bench_thermometer' && dragState.moved
                  ? `translate(${dragState.currentX}, ${dragState.currentY - 350})`
                  : 'translate(292, 378)'
              }
              onClick={(e) => {
                e.stopPropagation()
                setSelectedId('bench_thermometer')
              }}
              onPointerDown={(e) => {
                e.stopPropagation()
                ;(e.target as Element)?.setPointerCapture?.(e.pointerId)
                const pt = toSvgCoords(e.clientX, e.clientY)
                setDragState({
                  entityId: 'bench_thermometer',
                  itemId: 'bench_thermometer',
                  startX: pt.x,
                  startY: pt.y,
                  currentX: pt.x,
                  currentY: pt.y,
                  moved: false,
                })
                setSelectedId('bench_thermometer')
              }}
              className="cursor-grab active:cursor-grabbing"
            >
              {selectedId === 'bench_thermometer' ? (
                <rect x="-86" y="-12" width="172" height="24" rx="7" fill="none" stroke="rgba(248,250,252,0.82)" strokeWidth="1.6" strokeDasharray="5 4" />
              ) : (
                showPopoverForSelected && (
                  <rect x="-86" y="-12" width="172" height="24" rx="7" fill="none" stroke="rgba(234,179,8,0.65)" strokeWidth="1.8" />
                )
              )}
              <rect x="-78" y="-4.5" width="156" height="9" rx="4.5" fill="rgba(226,232,240,0.22)" stroke="#94a3b8" strokeWidth="1.1" />
              <circle cx="-71" cy="0" r="5.5" fill="#ef4444" />
              <rect x="-65" y="-1.6" width="44" height="3.2" rx="1.4" fill="#ef4444" />
              {Array.from({ length: 13 }).map((_, ti) => (
                <line key={ti} x1={-46 + ti * 9} y1="-4" x2={-46 + ti * 9} y2={ti % 4 === 0 ? '2' : '-1'} stroke="#cbd5e1" strokeWidth="0.85" />
              ))}
            </g>
          )}

          {/* Horizontal Wooden Splint / Glass Stirring Rod on Right Foreground Bench */}
          <g transform="translate(565, 378)">
            <rect x="-64" y="-2.2" width="128" height="4.4" rx="2.2" fill="#c29b61" stroke="rgba(255,255,255,0.2)" strokeWidth="0.6" />
          </g>

          {/* Animated Pouring Stream */}
          {pourAnim && (
            <g transform={`translate(${pourAnim.targetX + 34}, 54)`}>
              <g transform="rotate(-48)">
                <rect x="-14" y="-34" width="28" height="60" rx="5" fill="url(#glassBodyGrad)" stroke="#cbd5e1" strokeWidth="1.5" />
                <rect x="-7" y="-44" width="14" height="10" rx="2" fill="#38bdf8" />
              </g>
              <line
                x1="-28"
                y1="14"
                x2="-34"
                y2="128"
                stroke={pourAnim.color}
                strokeWidth={pourAnim.isSolid ? '3' : '5.5'}
                strokeDasharray={pourAnim.isSolid ? '4 5' : undefined}
                strokeLinecap="round"
              >
                <animate attributeName="opacity" values="0.95;0.2" dur="0.65s" repeatCount="1" />
              </line>
            </g>
          )}
        </svg>

        {/* Horizontal Scroll Track when Bench Width Exceeds Viewport */}
        {maxPan > 0 && (
          <div className="px-4 py-2 bg-slate-950/90 border-t border-slate-800/70 space-y-1.5">
            <div className="text-[11px] text-slate-400">
              Tezgâh görüntüden geniş. Oklarla veya kaydırıcıyla gezinebilirsin.
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setPanX((p) => Math.max(0, p - 140))}
                disabled={clampedPan <= 0}
                aria-label="Sola kaydır"
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
                aria-label="Tezgâh kaydırma"
                className="flex-1 accent-cyan-400 cursor-pointer h-1.5 bg-slate-800 rounded-full"
              />
              <button
                type="button"
                onClick={() => setPanX((p) => Math.min(maxPan, p + 140))}
                disabled={clampedPan >= maxPan}
                aria-label="Sağa kaydır"
                className="p-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white disabled:opacity-35 cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Microscopic Particle Overlay */}
        {microMode && (
          <div className="absolute inset-0 bg-slate-950/94 backdrop-blur-md p-4 sm:p-6 flex flex-col justify-between z-30 border-2 border-cyan-500/40 rounded-2xl">
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
                <div key={ion.formula} className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 flex items-center gap-3">
                  <div
                    className="w-11 h-11 rounded-full flex items-center justify-center text-xs font-black text-slate-950 shrink-0 shadow-lg animate-bounce"
                    style={{ backgroundColor: ion.color, animationDuration: `${1.8 + idx * 0.4}s` }}
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

      {/* Live Status Chips + Contextual Interaction Footer */}
      <div className="px-4 py-3 bg-[#090E18] border-t border-slate-800/80 space-y-2.5">
        <div
          className="flex flex-wrap items-center gap-2 text-[11px] font-bold"
          style={{ fontVariantNumeric: 'tabular-nums' }}
        >
          {isBalloonExperiment && (
            <span className="px-2.5 py-1 rounded-full bg-slate-900 border border-slate-800 text-slate-200 inline-flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>{sim.gasMl} mL</span>
              <span className="text-slate-400 font-medium">Balon</span>
            </span>
          )}
          <span className="px-2.5 py-1 rounded-full bg-slate-900 border border-slate-800 text-slate-200 inline-flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-rose-400" />
            <span>{formatTrDecimal(activeTemp, 1)} °C</span>
            <span className="text-slate-400 font-medium">{primaryVessel?.label || 'Kap 1'}</span>
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

        <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 flex flex-wrap items-center justify-between gap-2.5">
          {selectedEntity ? (
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 font-bold">
                <FlaskConical className="w-3.5 h-3.5" />
                {selectedEntity.label}
              </span>
              {selectedEntity.kind === 'reagent' || selectedEntity.kind === 'bench_thermometer' ? (
                <button
                  type="button"
                  onClick={() => primaryVessel && applyMaterialToVessel(selectedEntity.id, primaryVessel)}
                  className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-black cursor-pointer transition-all"
                >
                  {selectedEntity.kind === 'bench_thermometer'
                    ? `Yerleştir → ${primaryVessel?.label || 'Kap 1'}`
                    : `${selectedDose} ${doseUnit} Ekle → ${primaryVessel?.label || 'Kap 1'}`}
                </button>
              ) : (
                isSandbox &&
                onSelectBenchMaterial && (
                  <button
                    type="button"
                    onClick={() => onSelectBenchMaterial('bek')}
                    className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-300 font-bold inline-flex items-center gap-1 cursor-pointer"
                  >
                    <Flame className="w-3.5 h-3.5" />
                    Isıtıcı Aç/Kapat
                  </button>
                )
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
                Bir malzemeye dokunursan miktar ve hedef kap seçenekleri açılır; şişeleri doğrudan bir kabın üzerine de sürükleyebilirsin.
              </span>
            </div>
          )}

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
