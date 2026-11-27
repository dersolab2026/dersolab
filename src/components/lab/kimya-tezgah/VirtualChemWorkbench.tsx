'use client'

import React, { useState, useEffect, useMemo, useRef } from 'react'
import {
  FlaskConical,
  Search,
  Play,
  Pause,
  RotateCcw,
  Undo2,
  FastForward,
  Maximize2,
  Minimize2,
  Share2,
  Volume2,
  VolumeX,
  Atom,
  ClipboardList,
  CheckCircle2,
  ChevronRight,
  ChevronDown,
  ShieldAlert,
  HelpCircle,
  BookOpen,
  Sparkles,
  Award,
  KeyRound,
  Copy,
  Flame,
  Wrench,
  Smartphone,
} from 'lucide-react'
import {
  CHEM_EXPERIMENTS,
  CHEM_GRADE_FILTERS,
  CHEM_LAB_ITEMS,
  CHEM_CATEGORY_LABELS,
  encodeAssignmentCode,
  decodeAssignmentCode,
  type ChemExperiment,
  type ChemGradeKey,
  type ChemItemCategory,
} from './chemExperimentsData'
import { ChemBenchStage, type BenchSimState } from './ChemBenchStage'
import {
  playClickSound,
  playChemicalReaction,
  playLiquidPour,
  playBurnerIgnite,
  playGlassClink,
  playShowExplosion,
  playSuccessFanfare,
  playErrorBuzz,
  isSoundMuted,
  setSoundMuted,
} from '@/lib/soundFx'

interface LogEntry {
  id: string
  type: 'NEDEN' | 'BASARILI' | 'BILGI'
  title: string
  explanation: string
}

interface Snapshot {
  stepIndex: number
  isCompleted: boolean
  sim: BenchSimState
  logs: LogEntry[]
}

interface ProgressRecord {
  stepsDone: number
  totalSteps: number
  completed: boolean
  usedAutoplay: boolean
}

export interface WorkbenchLiveSnapshot {
  experimentTitle: string
  gradeLabel: string
  stepProgress: string
  temperature: string
  ph: string
  volume: string
  lastObservation: string
  relatedTab: ChemExperiment['relatedModuleTab']
  measurements: { parameter: string; value: string; unit: string; description: string }[]
}

interface VirtualChemWorkbenchProps {
  onStateChange?: (snapshot: WorkbenchLiveSnapshot) => void
  onSwitchTab?: (tab: ChemExperiment['relatedModuleTab']) => void
}

const PROGRESS_STORAGE_KEY = 'dersolab_kimya_progress_v2'

/** Official MEB Türkiye Yüzyılı Maarif Modeli outcome reference mapper (from 2024/2026 MEB Kimya PDF). */
function getMebOutcomeCode(exp: ChemExperiment): string {
  const unit = exp.maarifUnit.toLowerCase()
  if (exp.grade === '9') {
    if (unit.includes('atom') || unit.includes('orbital') || unit.includes('periyodik')) return 'KİM.9.1.3 · KİM.9.1.8'
    if (unit.includes('buhar') || unit.includes('kaynama') || unit.includes('viskozite') || unit.includes('yüzey')) return 'KİM.9.2.9 – KİM.9.2.13'
    if (unit.includes('nanoparçacık') || unit.includes('sürdürülebilir')) return 'KİM.9.3.1'
    return 'KİM.9.2.2 – KİM.9.2.7'
  }
  if (exp.grade === '10') {
    if (unit.includes('gaz') || unit.includes('difüzyon') || unit.includes('boyle')) return 'KİM.10.1.8 – KİM.10.1.11'
    if (unit.includes('çözün') || unit.includes('koligatif') || unit.includes('molar')) return 'KİM.10.2.1 – KİM.10.2.8'
    return 'KİM.10.1.1 – KİM.10.1.7'
  }
  if (exp.grade === '11') {
    if (unit.includes('entalpi') || unit.includes('kalorimetre') || unit.includes('enerji')) return 'KİM.11.1.1 – KİM.11.1.4'
    if (unit.includes('hız')) return 'KİM.11.1.6 – KİM.11.1.8'
    if (unit.includes('titrasyon') || unit.includes('asit') || unit.includes('ph')) return 'KİM.11.2.8 – KİM.11.2.11'
    return 'KİM.11.2.1 – KİM.11.2.5'
  }
  if (exp.grade === '12') {
    if (unit.includes('elektroliz') || unit.includes('kaplama') || unit.includes('korozyon')) return 'KİM.12.1.6 – KİM.12.1.9'
    if (unit.includes('redoks') || unit.includes('galvanik') || unit.includes('pil')) return 'KİM.12.1.1 – KİM.12.1.5'
    return 'KİM.12.3.1 – KİM.12.3.2'
  }
  return 'KİM.10.1.1 · KİM.11.1.7 (Gösteri)'
}

export function VirtualChemWorkbench({ onStateChange, onSwitchTab }: VirtualChemWorkbenchProps) {
  // Navigation & Filters
  const [gradeFilter, setGradeFilter] = useState<'all' | ChemGradeKey | 'sandbox'>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedExpId, setSelectedExpId] = useState<string>(CHEM_EXPERIMENTS[0].id)
  const [isSandbox, setIsSandbox] = useState(false)

  // Experiment Step & Undo History
  const [currentStepIndex, setCurrentStepIndex] = useState(0)
  const [isCompleted, setIsCompleted] = useState(false)
  const [usedAutoplay, setUsedAutoplay] = useState(false)
  const [undoStack, setUndoStack] = useState<Snapshot[]>([])
  const [logs, setLogs] = useState<LogEntry[]>([])

  // Live Bench Physics/Chemistry State
  const [sim, setSim] = useState<BenchSimState>(() => ({
    temp: CHEM_EXPERIMENTS[0].initialTemp,
    ph: CHEM_EXPERIMENTS[0].initialPh,
    vol: CHEM_EXPERIMENTS[0].initialVol,
    gasMl: 0,
    voltage: 0,
    liquidColor: CHEM_EXPERIMENTS[0].initialLiquidColor || 'rgba(56,189,248,0.28)',
    precipitateColor: null,
    flameColor: null,
    foamLevel: 0,
    burnerOn: false,
    sandboxVessel: 'beher',
    safetyWarning: null,
  }))

  // Controls & Toggles
  const [isAutoPlaying, setIsAutoPlaying] = useState(false)
  const [fastForward, setFastForward] = useState(false)
  const [microMode, setMicroMode] = useState(false)
  const [mobileZoom, setMobileZoom] = useState(false)
  const [isTrayOpen, setIsTrayOpen] = useState(false)
  const [trayCategory, setTrayCategory] = useState<'bu_deney' | 'tumu' | ChemItemCategory>('bu_deney')
  const [selectedAmount, setSelectedAmount] = useState<number>(25)
  const [muted, setMuted] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [copiedBanner, setCopiedBanner] = useState<string | null>(null)
  const [showHintStep, setShowHintStep] = useState<number | null>(null)
  const [inquiryChoice, setInquiryChoice] = useState<number | null>(null)

  // Progress Badges
  const [progressMap, setProgressMap] = useState<Record<string, ProgressRecord>>({})

  // Homework / Assignment Code ("Ödev Kodu") State
  const [homeworkAccordionOpen, setHomeworkAccordionOpen] = useState(false)
  const [homeworkTab, setHomeworkTab] = useState<'student' | 'teacher'>('student')
  const [homeworkInput, setHomeworkInput] = useState('')
  const [activeAssignmentExpId, setActiveAssignmentExpId] = useState<string | null>(null)
  const [studentNameInput, setStudentNameInput] = useState('')
  const [teacherPickId, setTeacherPickId] = useState<string>(CHEM_EXPERIMENTS[0].id)
  const [verifyTokenInput, setVerifyTokenInput] = useState('')

  const workbenchRootRef = useRef<HTMLDivElement>(null)

  const currentExp = useMemo(
    () => CHEM_EXPERIMENTS.find((e) => e.id === selectedExpId) || CHEM_EXPERIMENTS[0],
    [selectedExpId]
  )

  // Hydrate persisted progress + URL deep link / ?odev=CODE
  useEffect(() => {
    setMuted(isSoundMuted())
    try {
      const saved = localStorage.getItem(PROGRESS_STORAGE_KEY)
      if (saved) setProgressMap(JSON.parse(saved))
    } catch {}
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search)
      const expParam = params.get('deney')
      const odevParam = params.get('odev')
      if (odevParam) {
        const matched = decodeAssignmentCode(odevParam)
        if (matched) {
          loadExperiment(matched, false)
          setActiveAssignmentExpId(matched.id)
          setHomeworkInput(odevParam.toUpperCase())
          setHomeworkAccordionOpen(true)
        }
      } else if (expParam) {
        const matched = CHEM_EXPERIMENTS.find((e) => e.id === expParam)
        if (matched) loadExperiment(matched, false)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Notify parent KimyaLabView for PDF Report & DersoAI Live Context
  useEffect(() => {
    if (!onStateChange) return
    const gradeLabel =
      currentExp.grade === 'gosteriler' ? 'Gösteriler' : `${currentExp.grade}. Sınıf Maarif`
    onStateChange({
      experimentTitle: isSandbox ? 'Serbest Kimya Tezgâhı' : currentExp.title,
      gradeLabel,
      stepProgress: isSandbox ? 'Serbest Mod' : `${currentStepIndex}/${currentExp.steps.length}`,
      temperature: `${sim.temp.toFixed(1)} °C`,
      ph: `${sim.ph.toFixed(2)}`,
      volume: `${sim.vol} mL`,
      lastObservation: logs[0]?.title || 'Deney başlatılmayı bekliyor',
      relatedTab: currentExp.relatedModuleTab,
      measurements: [
        { parameter: 'Sıcaklık (T)', value: sim.temp.toFixed(1), unit: '°C', description: 'Dijital termometre okuması' },
        { parameter: 'pH Değeri', value: sim.ph.toFixed(2), unit: 'pH', description: 'Çözelti asit-baz göstergesi' },
        { parameter: 'Sıvı Hacmi (V)', value: String(sim.vol), unit: 'mL', description: 'Kaptaki toplam hacim' },
        { parameter: 'Gaz / Voltaj', value: sim.voltage > 0 ? sim.voltage.toFixed(2) : String(sim.gasMl), unit: sim.voltage > 0 ? 'V' : 'mL', description: 'Açığa çıkan gaz veya pil gerilimi' },
      ],
    })
  }, [currentExp, isSandbox, currentStepIndex, sim, logs, onStateChange])

  const saveProgress = (exp: ChemExperiment, stepsDone: number, completed: boolean, auto: boolean) => {
    setProgressMap((prev) => {
      const existing = prev[exp.id]
      const updated: Record<string, ProgressRecord> = {
        ...prev,
        [exp.id]: {
          stepsDone: Math.max(existing?.stepsDone || 0, stepsDone),
          totalSteps: exp.steps.length,
          completed: Boolean(existing?.completed || completed),
          usedAutoplay: existing?.completed ? existing.usedAutoplay : auto,
        },
      }
      try {
        localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(updated))
      } catch {}
      return updated
    })
  }

  function loadExperiment(exp: ChemExperiment, sandbox = false) {
    setIsAutoPlaying(false)
    setSelectedExpId(exp.id)
    setIsSandbox(sandbox)
    setCurrentStepIndex(0)
    setIsCompleted(false)
    setUsedAutoplay(false)
    setUndoStack([])
    setShowHintStep(null)
    setInquiryChoice(null)
    setTrayCategory('bu_deney')
    setLogs([
      {
        id: `init-${Date.now()}`,
        type: 'BILGI',
        title: sandbox ? 'Serbest Çalışma Masası Hazır' : `#${exp.number} ${exp.title}`,
        explanation: sandbox
          ? 'Malzeme tepsisinden beher, ısıtıcı ve istediğin kimyasalları özgürce deneyebilirsin.'
          : exp.subtitle,
      },
    ])
    setSim({
      temp: exp.initialTemp,
      ph: exp.initialPh,
      vol: exp.initialVol,
      gasMl: 0,
      voltage: 0,
      liquidColor: exp.initialLiquidColor || 'rgba(56,189,248,0.28)',
      precipitateColor: null,
      flameColor: null,
      foamLevel: 0,
      burnerOn: false,
      sandboxVessel: 'beher',
      safetyWarning: null,
    })
  }

  const playStepSfx = (sfx?: string) => {
    if (sfx === 'pour') playLiquidPour()
    else if (sfx === 'ignite') playBurnerIgnite()
    else if (sfx === 'explosion') playShowExplosion()
    else if (sfx === 'clink') playGlassClink()
    else playChemicalReaction()
  }

  const executeGuidedStep = (fromAutoplay = false) => {
    if (isSandbox || isCompleted) return
    const step = currentExp.steps[currentStepIndex]
    if (!step) return

    // Push snapshot to Undo stack
    setUndoStack((prev) => [
      ...prev.slice(-15),
      { stepIndex: currentStepIndex, isCompleted, sim: { ...sim }, logs: [...logs] },
    ])

    if (fromAutoplay) setUsedAutoplay(true)
    playStepSfx(step.sfx)

    const nextSim: BenchSimState = {
      ...sim,
      temp: Number((sim.temp + (step.deltaTemp ?? 0)).toFixed(1)),
      ph: step.setPh !== undefined ? step.setPh : sim.ph,
      vol: Math.max(0, sim.vol + (step.deltaVol ?? 0)),
      gasMl: Math.max(0, sim.gasMl + (step.deltaGasMl ?? 0)),
      voltage: step.setVoltage !== undefined ? step.setVoltage : sim.voltage,
      liquidColor: step.liquidColorAfter || sim.liquidColor,
      precipitateColor: step.precipitateColor !== undefined ? step.precipitateColor : sim.precipitateColor,
      flameColor: step.flameColor !== undefined ? step.flameColor : sim.flameColor,
      foamLevel: step.foamLevel !== undefined ? step.foamLevel : sim.foamLevel,
      burnerOn: step.burnerOn !== undefined ? step.burnerOn : sim.burnerOn,
      safetyWarning: null,
    }
    setSim(nextSim)

    const entry: LogEntry = {
      id: `${step.id}-${Date.now()}`,
      type: step.logType,
      title: step.logTitle,
      explanation: step.logExplanation,
    }
    setLogs((prev) => [entry, ...prev])

    const nextIdx = currentStepIndex + 1
    const doneNow = nextIdx >= currentExp.steps.length
    setCurrentStepIndex(nextIdx)
    if (doneNow) {
      setIsCompleted(true)
      setIsAutoPlaying(false)
      playSuccessFanfare()
    }
    saveProgress(currentExp, nextIdx, doneNow, fromAutoplay || usedAutoplay)
  }

  // Autoplay Step Timer (respects Pause/Resume + FastForward 4×)
  useEffect(() => {
    if (!isAutoPlaying || isCompleted || isSandbox || activeAssignmentExpId === currentExp.id) {
      return
    }
    const delayMs = fastForward ? 750 : 2500
    const timer = setTimeout(() => {
      executeGuidedStep(true)
    }, delayMs)
    return () => clearTimeout(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAutoPlaying, currentStepIndex, isCompleted, fastForward, isSandbox, activeAssignmentExpId])

  const handleUndo = () => {
    if (undoStack.length === 0) return
    playGlassClink()
    setIsAutoPlaying(false)
    const last = undoStack[undoStack.length - 1]
    setUndoStack((prev) => prev.slice(0, -1))
    setCurrentStepIndex(last.stepIndex)
    setIsCompleted(last.isCompleted)
    setSim(last.sim)
    setLogs(last.logs)
  }

  const handleToggleAutoplay = () => {
    if (isSandbox) return
    if (activeAssignmentExpId === currentExp.id) {
      playErrorBuzz()
      return
    }
    playClickSound()
    if (isAutoPlaying) {
      setIsAutoPlaying(false) // Pause and continue manually from this exact step!
      return
    }
    if (currentStepIndex > 0 && !isCompleted) {
      const ok = window.confirm('Otomatik oynatma tezgâhı sıfırlayıp deneyi baştan adım adım gösterecektir. Devam edilsin mi?')
      if (!ok) return
      loadExperiment(currentExp, false)
    } else if (isCompleted) {
      loadExperiment(currentExp, false)
    }
    setUsedAutoplay(true)
    setIsAutoPlaying(true)
  }

  // Handle clicking any material item in the Tray
  const handleTrayItemClick = (itemId: string) => {
    if (isSandbox) {
      setUndoStack((prev) => [...prev.slice(-15), { stepIndex: 0, isCompleted: false, sim: { ...sim }, logs: [...logs] }])
      let next = { ...sim, safetyWarning: null as string | null }
      let note = ''

      if (itemId === 'bek' || itemId === 'isitici' || itemId === 'kibrit') {
        playBurnerIgnite()
        next.burnerOn = !next.burnerOn
        next.temp = next.burnerOn ? Math.min(100, next.temp + 35) : 24
        note = next.burnerOn ? `Isıtıcı açıldı (${next.temp} °C)` : 'Isıtıcı kapatıldı'
      } else if (itemId === 'saf_su') {
        playLiquidPour()
        if (next.ph <= 1.2 && next.vol > 0) {
          next.safetyWarning = '⚠️ Laboratuvar Uyarısı: Derişik asit üzerine doğrudan su dökülmez (sıçrama riski)! Önce su koyup üstüne asit eklenir.'
        }
        next.vol = Math.min(200, next.vol + selectedAmount)
        next.ph = Number(((next.ph + 7) / 2).toFixed(2))
        note = `${selectedAmount} mL Saf su eklendi.`
      } else if (itemId === 'hcl' || itemId === 'hcl_1m' || itemId === 'derisik_hcl') {
        playLiquidPour()
        next.vol = Math.min(200, next.vol + selectedAmount)
        next.ph = Math.max(0.8, Number((next.ph - 3.5).toFixed(2)))
        next.temp = Number((next.temp + 4).toFixed(1))
        next.liquidColor = 'rgba(251,113,133,0.45)'
        note = `${selectedAmount} mL HCl asit eklendi (pH ${next.ph}).`
      } else if (itemId === 'naoh' || itemId === 'naoh_1m' || itemId === 'naoh_kati') {
        playLiquidPour()
        next.vol = Math.min(200, next.vol + (itemId === 'naoh_kati' ? 5 : selectedAmount))
        next.ph = Math.min(13.5, Number((next.ph + 4.2).toFixed(2)))
        next.temp = Number((next.temp + 6).toFixed(1))
        next.liquidColor = next.ph > 8.2 ? 'rgba(236,72,153,0.68)' : 'rgba(192,132,252,0.45)'
        note = `Bazik NaOH eklendi (ekzotermik, pH ${next.ph}).`
      } else if (itemId === 'fenolftalein') {
        playLiquidPour()
        next.liquidColor = next.ph > 8.2 ? 'rgba(236,72,153,0.85)' : 'rgba(226,232,240,0.35)'
        note = `Fenolftalein damlatıldı (${next.ph > 8.2 ? 'Pembe — Bazik' : 'Renksiz — Asit/Nötr'}).`
      } else if (itemId === 'h2o2' || itemId === 'ki' || itemId === 'deterjan') {
        playShowExplosion()
        next.vol = Math.min(200, next.vol + 25)
        next.foamLevel = itemId === 'ki' ? 95 : 40
        next.temp = Math.min(98, next.temp + 26)
        next.gasMl += 180
        next.liquidColor = 'rgba(253,224,71,0.78)'
        note = 'H₂O₂ + KI/Deterjan ekzotermik köpük reaksiyonu tetiklendi!'
      } else if (itemId === 'pbno3') {
        playChemicalReaction()
        next.vol = Math.min(200, next.vol + 25)
        next.precipitateColor = '#facc15'
        next.liquidColor = 'rgba(250,204,21,0.75)'
        note = 'Pb²⁺ çözeltisi sarı çökelti oluşturdu!'
      } else if (itemId === 'mg_serit' || itemId === 'karbonat') {
        playChemicalReaction()
        next.gasMl += 120
        next.foamLevel = 35
        note = `${itemId === 'mg_serit' ? 'Mg + asit H₂↑' : 'Karbonat CO₂↑'} gaz çıkışı gözlendi.`
      } else {
        playGlassClink()
        note = `${CHEM_LAB_ITEMS.find((i) => i.id === itemId)?.name || itemId} tezgâhta hazırlandı.`
      }

      setSim(next)
      setLogs((prev) => [{ id: `sb-${Date.now()}`, type: 'BASARILI', title: 'Serbest İşlem', explanation: note }, ...prev])
      return
    }

    // Guided Experiment Mode
    if (isCompleted) return
    const activeStep = currentExp.steps[currentStepIndex]
    if (!activeStep) return
    if (activeStep.materialIds.includes(itemId)) {
      executeGuidedStep(false)
    } else {
      playErrorBuzz()
      const neededNames = activeStep.materialIds
        .map((id) => CHEM_LAB_ITEMS.find((i) => i.id === id)?.name || id)
        .join(', ')
      setLogs((prev) => [
        {
          id: `warn-${Date.now()}`,
          type: 'NEDEN',
          title: 'Bu adımda farklı malzeme gerekiyor',
          explanation: `Şu anki adım için gerekenler: ${neededNames}`,
        },
        ...prev,
      ])
    }
  }

  const handleToggleFullscreen = () => {
    playClickSound()
    const el = workbenchRootRef.current
    if (!el) return
    if (!document.fullscreenElement) {
      el.requestFullscreen?.().then(() => setIsFullscreen(true)).catch(() => setIsFullscreen((p) => !p))
    } else {
      document.exitFullscreen?.().then(() => setIsFullscreen(false)).catch(() => setIsFullscreen(false))
    }
  }

  const handleShareUrl = (textToCopy?: string) => {
    playClickSound()
    const url =
      typeof window !== 'undefined'
        ? `${window.location.origin}/lab/kimya?deney=${currentExp.id}`
        : `https://dersolab.com/lab/kimya?deney=${currentExp.id}`
    navigator?.clipboard?.writeText(textToCopy || url)
    setCopiedBanner(textToCopy ? 'Sonuç / Teslim kodu kopyalandı!' : 'Deney bağlantısı kopyalandı!')
    setTimeout(() => setCopiedBanner(null), 2600)
  }

  // Filtered Experiments List
  const filteredExperiments = useMemo(() => {
    if (gradeFilter === 'sandbox') return []
    const q = searchQuery.trim().toLowerCase()
    return CHEM_EXPERIMENTS.filter((e) => {
      if (gradeFilter !== 'all' && e.grade !== gradeFilter) return false
      if (!q) return true
      const matNames = e.materials
        .map((id) => CHEM_LAB_ITEMS.find((i) => i.id === id)?.name.toLowerCase() || id)
        .join(' ')
      return (
        e.title.toLowerCase().includes(q) ||
        e.subtitle.toLowerCase().includes(q) ||
        e.maarifUnit.toLowerCase().includes(q) ||
        matNames.includes(q)
      )
    })
  }, [gradeFilter, searchQuery])

  // Filtered Materials Tray
  const visibleItems = useMemo(() => {
    const q = searchQuery.trim().toLowerCase()
    return CHEM_LAB_ITEMS.filter((it) => {
      if (trayCategory === 'bu_deney') {
        if (!isSandbox && !currentExp.materials.includes(it.id)) return false
      } else if (trayCategory !== 'tumu') {
        if (it.category !== trayCategory) return false
      }
      if (!q) return true
      return it.name.toLowerCase().includes(q) || (it.formula || '').toLowerCase().includes(q)
    })
  }, [trayCategory, currentExp, isSandbox, searchQuery])

  const activeStep = !isSandbox && !isCompleted ? currentExp.steps[currentStepIndex] || null : null
  const completedCount = Object.values(progressMap).filter((p) => p.completed).length
  const nextExperiment = CHEM_EXPERIMENTS.find((e) => e.number === currentExp.number + 1) || CHEM_EXPERIMENTS[0]

  // Dynamic Chart polyline points
  const chartPts = currentExp.chartConfig.points
  const chartMaxX = Math.max(...chartPts.map((p) => p.x), 1)
  const chartMinX = Math.min(...chartPts.map((p) => p.x), 0)
  const chartMaxY = Math.max(...chartPts.map((p) => p.y), 1)
  const chartMinY = Math.min(...chartPts.map((p) => p.y), 0)
  const visibleChartCount = isCompleted
    ? chartPts.length
    : Math.max(1, Math.ceil(((currentStepIndex + 0.5) / Math.max(currentExp.steps.length, 1)) * chartPts.length))
  const activeChartPts = chartPts.slice(0, visibleChartCount)
  const toSvgX = (x: number) => 36 + ((x - chartMinX) / Math.max(chartMaxX - chartMinX, 0.001)) * 244
  const toSvgY = (y: number) => 122 - ((y - chartMinY) / Math.max(chartMaxY - chartMinY, 0.001)) * 98

  const submissionToken = useMemo(() => {
    if (!isCompleted) return ''
    const code = encodeAssignmentCode(currentExp.number)
    const who = (studentNameInput.trim() || 'Ogrenci').replace(/\s+/g, '_')
    const mode = usedAutoplay ? 'AUTO' : 'MANUEL'
    return `${code}-${who}-${currentExp.steps.length}/${currentExp.steps.length}-${mode}`
  }, [isCompleted, currentExp, studentNameInput, usedAutoplay])

  return (
    <div ref={workbenchRootRef} className="space-y-6">
      {/* ── HERO & TEACHER ASSIGNMENT ACCORDION ── */}
      <div className="rounded-3xl bg-gradient-to-br from-slate-900 via-slate-950 to-cyan-950/30 border border-slate-800 p-5 sm:p-6 shadow-2xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 text-[11px] font-black uppercase tracking-wider inline-flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5" />
                59 Deney & 8 Yeni Gösteri · 9–12. Sınıf Maarif Modeli
              </span>
              <span className="px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-[11px] font-bold inline-flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5" />
                İlerleme Rozeti: {completedCount}/59 Tamamlandı
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Sanal Kimya Laboratuvarı Tezgâhı
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-3xl">
              Ücretsiz, üyeliksiz, telefonda tam uyumlu. Tehlikeli gösterileri güvenle dene; dilersen{' '}
              <strong className="text-cyan-300">Tanecik (Mikro) Modu</strong>,{' '}
              <strong className="text-amber-300">Otomatik Oynat (4×)</strong> ve{' '}
              <strong className="text-emerald-300">Geri Al</strong> ile adım adım öğren.
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              playClickSound()
              setHomeworkAccordionOpen((p) => !p)
            }}
            className="px-4 py-2.5 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-cyan-500/35 text-cyan-300 text-xs font-black inline-flex items-center gap-2 self-start lg:self-auto cursor-pointer transition-all"
          >
            <KeyRound className="w-4 h-4 text-cyan-400" />
            <span>Ödev kodun mu var? / Öğretmen Paneli</span>
            <ChevronDown className={`w-4 h-4 transition-transform ${homeworkAccordionOpen ? 'rotate-180' : ''}`} />
          </button>
        </div>

        {/* Assignment / Teacher Code Accordion */}
        {homeworkAccordionOpen && (
          <div className="mt-4 pt-4 border-t border-slate-800 grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setHomeworkTab('student')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold cursor-pointer ${
                    homeworkTab === 'student' ? 'bg-cyan-500 text-slate-950' : 'bg-slate-800 text-slate-300'
                  }`}
                >
                  Öğrenci: Kodu Gir
                </button>
                <button
                  type="button"
                  onClick={() => setHomeworkTab('teacher')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold cursor-pointer ${
                    homeworkTab === 'teacher' ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-slate-300'
                  }`}
                >
                  Öğretmen: Ödev Oluştur & Kontrol
                </button>
              </div>

              {homeworkTab === 'student' ? (
                <div className="space-y-2.5">
                  <p className="text-xs text-slate-400">
                    Öğretmeninin paylaştığı 6 haneli kodu gir (örn. <code className="text-cyan-300">D01KLP</code>).
                    <strong className="text-rose-300"> Ödev açıkken otomatik oynatma kapalıdır.</strong>
                  </p>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={homeworkInput}
                      onChange={(e) => setHomeworkInput(e.target.value.toUpperCase())}
                      placeholder="Örn: D48KLP"
                      maxLength={8}
                      className="flex-1 px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono text-xs focus:outline-none focus:border-cyan-400"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const exp = decodeAssignmentCode(homeworkInput)
                        if (!exp) {
                          playErrorBuzz()
                          setCopiedBanner('Geçersiz ödev kodu! Örnek: D01KLP .. D59KLP')
                          setTimeout(() => setCopiedBanner(null), 2600)
                          return
                        }
                        playSuccessFanfare()
                        loadExperiment(exp, false)
                        setActiveAssignmentExpId(exp.id)
                        setGradeFilter(exp.grade)
                      }}
                      className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-black cursor-pointer"
                    >
                      Ödevi Aç
                    </button>
                  </div>
                  {activeAssignmentExpId && (
                    <div className="p-2.5 rounded-xl bg-emerald-950/50 border border-emerald-500/40 text-xs text-emerald-200 flex items-center justify-between gap-2">
                      <span>✓ Ödev Modu Aktif (Otomatik Oynat Kilitli)</span>
                      <button
                        type="button"
                        onClick={() => setActiveAssignmentExpId(null)}
                        className="text-[11px] underline text-emerald-300 cursor-pointer"
                      >
                        Kapat
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-2.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <select
                      value={teacherPickId}
                      onChange={(e) => setTeacherPickId(e.target.value)}
                      className="flex-1 px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white"
                    >
                      {CHEM_EXPERIMENTS.map((e) => (
                        <option key={e.id} value={e.id}>
                          #{e.number} · {e.title} ({e.grade === 'gosteriler' ? 'Gösteri' : `${e.grade}. Sınıf`})
                        </option>
                      ))}
                    </select>
                    <button
                      type="button"
                      onClick={() => {
                        const exp = CHEM_EXPERIMENTS.find((e) => e.id === teacherPickId) || CHEM_EXPERIMENTS[0]
                        const code = encodeAssignmentCode(exp.number)
                        handleShareUrl(`DersoLab Kimya Ödevi: #${exp.number} ${exp.title}\nKod: ${code}\nLink: ${window.location.origin}/lab/kimya?odev=${code}`)
                      }}
                      className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black inline-flex items-center gap-1.5 cursor-pointer"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      <span>Kodu Kopyala ({encodeAssignmentCode(CHEM_EXPERIMENTS.find((e) => e.id === teacherPickId)?.number || 1)})</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Teacher Result Verification Box */}
            <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2">
              <div className="text-xs font-black text-slate-200">Öğretmen Sonuç Doğrulama</div>
              <p className="text-[11px] text-slate-400">
                Öğrencinin gönderdiği teslim kodunu yapıştırarak deneyi manuel mi yoksa otomatik oynatmayla mı bitirdiğini gör:
              </p>
              <input
                type="text"
                value={verifyTokenInput}
                onChange={(e) => setVerifyTokenInput(e.target.value)}
                placeholder="Örn: D48KLP-Ahmet_Yilmaz-4/4-MANUEL"
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono text-xs"
              />
              {verifyTokenInput.trim() && (
                <div className="text-xs p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200">
                  {verifyTokenInput.includes('AUTO') ? (
                    <span className="text-amber-300 font-bold">
                      ⚠️ İşaretli Gönderi: Öğrenci bu deneyi OTOMATİK OYNATMA kullanarak tamamladı.
                    </span>
                  ) : verifyTokenInput.includes('MANUEL') ? (
                    <span className="text-emerald-300 font-bold">
                      ✓ Doğrulanmış Gönderi: Tüm adımlar öğrenci tarafından manuel tamamlandı ({verifyTokenInput}).
                    </span>
                  ) : (
                    <span className="text-slate-400">Teslim kodu formatı: KOD-İsim-Adım-MANUEL/AUTO</span>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Grade Filters + Search */}
        <div className="mt-5 pt-4 border-t border-slate-800/80 flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-1.5">
            {CHEM_GRADE_FILTERS.map((gf) => {
              const active = gradeFilter === gf.key
              return (
                <button
                  key={gf.key}
                  type="button"
                  onClick={() => {
                    playClickSound()
                    setGradeFilter(gf.key)
                    if (gf.key === 'sandbox') {
                      loadExperiment(currentExp, true)
                    } else {
                      if (isSandbox) setIsSandbox(false)
                      if (gf.key !== 'all' && currentExp.grade !== gf.key) {
                        const firstOfGrade = CHEM_EXPERIMENTS.find((e) => e.grade === gf.key)
                        if (firstOfGrade) loadExperiment(firstOfGrade, false)
                      }
                    }
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer transition-all ${
                    active
                      ? gf.key === 'gosteriler'
                        ? 'bg-gradient-to-r from-amber-500 to-rose-500 text-white shadow-lg shadow-rose-500/20'
                        : 'bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/25'
                      : 'bg-slate-900 text-slate-300 border border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <span>{gf.label}</span>
                  <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${active ? 'bg-black/25' : 'bg-slate-800 text-slate-400'}`}>
                    {gf.countLabel}
                  </span>
                </button>
              )
            })}
          </div>

          <div className="relative w-full lg:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Deney veya malzeme ara (termit, büret...)"
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-500"
            />
          </div>
        </div>

        {/* Scrollable Quick Experiment Selector Ribbon */}
        {gradeFilter !== 'sandbox' && (
          <div className="mt-3 flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
            {filteredExperiments.map((exp) => {
              const active = !isSandbox && exp.id === currentExp.id
              const prog = progressMap[exp.id]
              return (
                <button
                  key={exp.id}
                  type="button"
                  onClick={() => {
                    playClickSound()
                    loadExperiment(exp, false)
                  }}
                  className={`shrink-0 px-3 py-1.5 rounded-xl text-xs font-bold inline-flex items-center gap-1.5 border cursor-pointer transition-all ${
                    active
                      ? 'bg-cyan-950/70 border-cyan-400 text-white shadow-[0_0_12px_rgba(34,211,238,0.28)]'
                      : 'bg-slate-900/80 border-slate-800 text-slate-300 hover:border-slate-700 hover:text-white'
                  }`}
                >
                  <span className="text-[10px] font-mono text-slate-400">#{exp.number}</span>
                  <span>{exp.title}</span>
                  {prog?.completed ? (
                    <span className="px-1.5 rounded-full bg-emerald-500/25 text-emerald-300 text-[10px] font-black">✓</span>
                  ) : prog && prog.stepsDone > 0 ? (
                    <span className="px-1.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px]">
                      {prog.stepsDone}/{prog.totalSteps}
                    </span>
                  ) : null}
                </button>
              )
            })}
          </div>
        )}
      </div>

      {/* Toast Banner */}
      {copiedBanner && (
        <div className="px-4 py-2.5 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-200 text-xs font-bold text-center">
          {copiedBanner}
        </div>
      )}

      {/* ── WORKBENCH TOOLBAR ── */}
      <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-3 flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={handleToggleAutoplay}
            disabled={isSandbox || activeAssignmentExpId === currentExp.id}
            className={`px-3.5 py-2 rounded-xl text-xs font-black inline-flex items-center gap-1.5 cursor-pointer transition-all disabled:opacity-40 disabled:cursor-not-allowed ${
              isAutoPlaying
                ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/25'
                : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950'
            }`}
          >
            {isAutoPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current" />}
            <span>{isAutoPlaying ? 'Durdur (Devam Et)' : 'Otomatik Oynat'}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              playClickSound()
              setFastForward((p) => !p)
            }}
            className={`px-3 py-2 rounded-xl text-xs font-bold inline-flex items-center gap-1.5 border cursor-pointer ${
              fastForward
                ? 'bg-amber-500/25 border-amber-400 text-amber-200'
                : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
            }`}
          >
            <FastForward className="w-3.5 h-3.5" />
            <span>4× Hız</span>
          </button>

          <button
            type="button"
            onClick={handleUndo}
            disabled={undoStack.length === 0}
            className="px-3 py-2 rounded-xl text-xs font-bold inline-flex items-center gap-1.5 bg-slate-950 border border-slate-800 text-slate-200 hover:border-slate-700 disabled:opacity-35 cursor-pointer"
          >
            <Undo2 className="w-3.5 h-3.5" />
            <span>Geri Al</span>
          </button>

          <button
            type="button"
            onClick={() => {
              playClickSound()
              setMicroMode((p) => !p)
            }}
            className={`px-3 py-2 rounded-xl text-xs font-black inline-flex items-center gap-1.5 border cursor-pointer ${
              microMode
                ? 'bg-cyan-500 text-slate-950 border-cyan-400 shadow-lg shadow-cyan-500/25'
                : 'bg-cyan-500/15 border-cyan-500/35 text-cyan-300 hover:bg-cyan-500/25'
            }`}
          >
            <Atom className="w-3.5 h-3.5" />
            <span>Tanecik (Mikro)</span>
          </button>

          <button
            type="button"
            onClick={() => {
              playClickSound()
              setMobileZoom((p) => !p)
            }}
            title="Telefonda aktif işleme odaklan"
            className={`px-3 py-2 rounded-xl text-xs font-bold inline-flex items-center gap-1.5 border cursor-pointer ${
              mobileZoom
                ? 'bg-indigo-500/25 border-indigo-400 text-indigo-200'
                : 'bg-slate-950 border-slate-800 text-slate-300'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Odak</span>
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setIsTrayOpen((p) => !p)}
            className="px-3 py-2 rounded-xl text-xs font-bold bg-slate-950 border border-slate-800 text-slate-300 hover:text-white cursor-pointer"
          >
            {isTrayOpen ? 'Dolabı Gizle' : 'Malzeme Dolabı (84)'}
          </button>

          <button
            type="button"
            onClick={() => {
              const next = !muted
              setMuted(next)
              setSoundMuted(next)
            }}
            className="p-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 hover:text-white cursor-pointer"
            title={muted ? 'Sesi Aç' : 'Sesi Kapat'}
          >
            {muted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
          </button>

          <button
            type="button"
            onClick={() => handleShareUrl()}
            className="p-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 hover:text-white cursor-pointer"
            title="Deneyi Paylaş"
          >
            <Share2 className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={handleToggleFullscreen}
            className="p-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 hover:text-white cursor-pointer"
            title="Tam Ekran"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>

          <button
            type="button"
            onClick={() => {
              playGlassClink()
              loadExperiment(currentExp, isSandbox)
            }}
            className="px-3 py-2 rounded-xl text-xs font-bold inline-flex items-center gap-1.5 bg-slate-950 border border-slate-800 text-slate-300 hover:text-white cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Sıfırla</span>
          </button>
        </div>
      </div>

      {/* ── MAIN WORKSPACE: LEFT (TRAY + BENCH), RIGHT (STEPS + CHART + LOG) ── */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-5">
        {/* LEFT 8 COLS: Material Tray + SVG Bench + Bottom Pedagogy */}
        <div className="xl:col-span-8 space-y-4">
          {isTrayOpen && (
            <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-4 space-y-3">
              {/* 8 Tray Categories + Amount Selector */}
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex flex-wrap gap-1.5">
                  {(Object.keys(CHEM_CATEGORY_LABELS) as ('bu_deney' | 'tumu' | ChemItemCategory)[]).map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => {
                        playClickSound()
                        setTrayCategory(cat)
                      }}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-bold cursor-pointer transition-all ${
                        trayCategory === cat
                          ? 'bg-cyan-500 text-slate-950'
                          : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-white'
                      }`}
                    >
                      {CHEM_CATEGORY_LABELS[cat]}
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-1 font-mono text-[11px]">
                  <span className="text-slate-500 mr-1">Miktar:</span>
                  {[1, 10, 25, 50, 100].map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => setSelectedAmount(amt)}
                      className={`px-2 py-0.5 rounded-md font-bold cursor-pointer ${
                        selectedAmount === amt ? 'bg-amber-500 text-slate-950' : 'bg-slate-950 text-slate-400 border border-slate-800'
                      }`}
                    >
                      {amt} mL
                    </button>
                  ))}
                </div>
              </div>

              {/* "Bu Adımda Lazım" Quick Amber Pills */}
              {activeStep && (
                <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/35 flex flex-wrap items-center gap-2">
                  <span className="text-[11px] font-black text-amber-300 uppercase tracking-wider">
                    Bu adımda lazım:
                  </span>
                  {activeStep.materialIds.map((mId) => {
                    const it = CHEM_LAB_ITEMS.find((x) => x.id === mId)
                    return (
                      <button
                        key={mId}
                        type="button"
                        onClick={() => handleTrayItemClick(mId)}
                        className="px-2.5 py-1 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black cursor-pointer shadow-sm"
                      >
                        + {it?.name || mId}
                      </button>
                    )
                  })}
                </div>
              )}

              {/* Material Cards Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 max-h-44 overflow-y-auto pr-1">
                {visibleItems.map((it) => {
                  const neededNow = activeStep?.materialIds.includes(it.id)
                  return (
                    <button
                      key={it.id}
                      type="button"
                      onClick={() => handleTrayItemClick(it.id)}
                      title={it.hint}
                      className={`p-2 rounded-xl text-left border transition-all cursor-pointer flex items-center gap-2 ${
                        neededNow
                          ? 'bg-amber-950/30 border-amber-400/70 ring-1 ring-amber-400/40 text-white'
                          : 'bg-slate-950/80 border-slate-800 text-slate-300 hover:border-cyan-500/40'
                      }`}
                    >
                      <span
                        className="w-3 h-3 rounded-full shrink-0"
                        style={{ backgroundColor: it.colorHex }}
                      />
                      <div className="min-w-0">
                        <div className="text-[11px] font-bold truncate">{it.name}</div>
                        {it.formula && (
                          <div className="text-[10px] font-mono text-slate-400">{it.formula}</div>
                        )}
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>
          )}

          {/* 2D SVG Workbench Stage + Particle Mode */}
          <ChemBenchStage
            experiment={currentExp}
            isSandbox={isSandbox}
            currentStepIndex={currentStepIndex}
            isCompleted={isCompleted}
            activeStep={activeStep}
            sim={sim}
            isAutoPlaying={isAutoPlaying}
            fastForward={fastForward}
            microMode={microMode}
            mobileZoom={mobileZoom}
            onTriggerStep={() => executeGuidedStep(false)}
            onSelectBenchMaterial={(itemId) => handleTrayItemClick(itemId)}
            onSelectSandboxVessel={(v) => setSim((p) => ({ ...p, sandboxVessel: v }))}
            onResetBench={() => {
              playGlassClink()
              loadExperiment(currentExp, isSandbox)
            }}
          />

          {/* "Her Deney Sayfasında" 4 Pedagogical Cards */}
          {!isSandbox && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              {/* 1. Why it Happens + Related Topic */}
              <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-4 space-y-2.5">
                <div className="flex items-center gap-2 text-xs font-black text-cyan-300 uppercase tracking-wider">
                  <BookOpen className="w-4 h-4" />
                  <span>Neden Böyle Olur?</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">{currentExp.whyItHappens}</p>
                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 font-mono text-[11px] text-emerald-300">
                  {currentExp.summaryFormula}
                </div>
                {onSwitchTab && (
                  <button
                    type="button"
                    onClick={() => {
                      playClickSound()
                      onSwitchTab(currentExp.relatedModuleTab)
                    }}
                    className="text-xs font-bold text-cyan-400 hover:text-cyan-300 inline-flex items-center gap-1 cursor-pointer"
                  >
                    <span>İlgili Konu: {currentExp.relatedTopicLabel}</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* 2. Safety Rules + FAQs */}
              <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-4 space-y-3">
                <div className="flex items-center gap-2 text-xs font-black text-rose-300 uppercase tracking-wider">
                  <ShieldAlert className="w-4 h-4" />
                  <span>Gerçek Laboratuvar Güvenlik Kuralları</span>
                </div>
                <ul className="space-y-1 text-xs text-slate-300">
                  {currentExp.safetyRules.map((rule) => (
                    <li key={rule} className="flex items-start gap-1.5">
                      <span className="text-rose-400 font-bold">•</span>
                      <span>{rule}</span>
                    </li>
                  ))}
                </ul>

                <div className="pt-2 border-t border-slate-800 space-y-2">
                  <div className="flex items-center gap-1.5 text-xs font-black text-amber-300 uppercase">
                    <HelpCircle className="w-3.5 h-3.5" />
                    <span>Sık Sorulan Sorular</span>
                  </div>
                  {currentExp.faqs.map((faq) => (
                    <div key={faq.q} className="text-xs space-y-0.5">
                      <div className="font-bold text-white">{faq.q}</div>
                      <div className="text-slate-400">{faq.a}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* RIGHT 4 COLS: Step Checklist + Live Chart + Gözlem Defteri */}
        <div className="xl:col-span-4 space-y-4">
          {/* Step Checklist Card */}
          <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-4 space-y-3">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 text-xs font-black text-white uppercase tracking-wider">
                <ClipboardList className="w-4 h-4 text-cyan-400" />
                <span>{isSandbox ? 'Serbest Çalışma' : 'Deney Adımları'}</span>
              </div>
              {!isSandbox && (
                <div className="flex items-center gap-1.5">
                  <span
                    className="px-2 py-0.5 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-[10px] font-bold text-cyan-300"
                    title={currentExp.maarifUnit}
                  >
                    {getMebOutcomeCode(currentExp)}
                  </span>
                  <span
                    className="px-2 py-0.5 rounded-full bg-slate-950 border border-slate-700 text-xs text-cyan-300 font-bold"
                    style={{ fontVariantNumeric: 'tabular-nums' }}
                  >
                    {currentStepIndex}/{currentExp.steps.length}
                  </span>
                </div>
              )}
            </div>

            {!isSandbox ? (
              <div className="space-y-2">
                {currentExp.steps.map((s, idx) => {
                  const done = idx < currentStepIndex
                  const current = idx === currentStepIndex && !isCompleted
                  return (
                    <div
                      key={s.id}
                      className={`p-2.5 rounded-xl border text-xs transition-all ${
                        done
                          ? 'bg-emerald-950/30 border-emerald-500/35 text-emerald-200'
                          : current
                          ? 'bg-amber-950/30 border-amber-400/60 text-white'
                          : 'bg-slate-950/60 border-slate-800/80 text-slate-400'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-start gap-2">
                          <span className="mt-0.5 font-mono font-bold">
                            {done ? '✓' : `${idx + 1}.`}
                          </span>
                          <span className="leading-snug">{s.instruction}</span>
                        </div>
                        {current && (
                          <button
                            type="button"
                            onClick={() => setShowHintStep(showHintStep === idx ? null : idx)}
                            className="shrink-0 text-[10px] font-bold text-amber-300 underline cursor-pointer"
                          >
                            İpucu
                          </button>
                        )}
                      </div>
                      {current && showHintStep === idx && (
                        <div className="mt-1.5 pl-5 text-[11px] text-amber-200/90">
                          Gerekli malzemeler: {s.materialIds.map((id) => CHEM_LAB_ITEMS.find((x) => x.id === id)?.name || id).join(', ')}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            ) : (
              <p className="text-xs text-slate-400 leading-relaxed">
                Beher veya erlenmayer seç; üzerine su, HCl, NaOH, fenolftalein, H₂O₂ + KI veya Pb(NO₃)₂ ekleyip tepkimeleri özgürce test et.
              </p>
            )}

            {/* Completion Summary Card */}
            {isCompleted && !isSandbox && (
              <div className="p-3.5 rounded-2xl bg-gradient-to-br from-emerald-950/70 to-cyan-950/50 border border-emerald-500/45 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-emerald-300 inline-flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" />
                    Deney Tamamlandı!
                  </span>
                  {usedAutoplay && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-bold">
                      Otomatik Oynat ile
                    </span>
                  )}
                </div>
                <div className="text-xs text-slate-100 font-mono bg-slate-950/70 p-2 rounded-lg border border-emerald-500/20">
                  {currentExp.summaryFormula}
                </div>

                {/* Homework Submission Card if Assignment Mode */}
                {activeAssignmentExpId === currentExp.id && (
                  <div className="p-2.5 rounded-xl bg-slate-950/80 border border-cyan-500/30 space-y-2">
                    <div className="text-[11px] font-bold text-cyan-300">Ödev Teslim Kodu</div>
                    <input
                      type="text"
                      value={studentNameInput}
                      onChange={(e) => setStudentNameInput(e.target.value)}
                      placeholder="Adın Soyadın"
                      className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white"
                    />
                    <button
                      type="button"
                      onClick={() => handleShareUrl(submissionToken)}
                      className="w-full py-1.5 rounded-lg bg-cyan-500 text-slate-950 text-xs font-black cursor-pointer"
                    >
                      Öğretmene Gönder ({submissionToken})
                    </button>
                  </div>
                )}

                {/* Embedded Maarif Inquiry Mini Check */}
                <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
                  <div className="text-[11px] font-black text-amber-300">Maarif Çıkarım Kontrolü</div>
                  <p className="text-[11px] text-slate-200">{currentExp.inquiryQuestion.question}</p>
                  <div className="space-y-1">
                    {currentExp.inquiryQuestion.options.map((opt, idx) => {
                      const picked = inquiryChoice === idx
                      const right = idx === currentExp.inquiryQuestion.correctIndex
                      return (
                        <button
                          key={opt}
                          type="button"
                          onClick={() => {
                            setInquiryChoice(idx)
                            if (right) playSuccessFanfare()
                            else playErrorBuzz()
                          }}
                          className={`w-full text-left px-2.5 py-1.5 rounded-lg text-[11px] border cursor-pointer ${
                            picked
                              ? right
                                ? 'bg-emerald-500/25 border-emerald-400 text-emerald-200 font-bold'
                                : 'bg-rose-500/25 border-rose-400 text-rose-200'
                              : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                          }`}
                        >
                          {opt}
                        </button>
                      )
                    })}
                  </div>
                  {inquiryChoice !== null && (
                    <div className="text-[11px] text-cyan-200 leading-snug pt-1">
                      {currentExp.inquiryQuestion.explanation}
                    </div>
                  )}
                </div>

                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => loadExperiment(nextExperiment, false)}
                    className="flex-1 py-2 px-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-black cursor-pointer"
                  >
                    Sıradaki Deney →
                  </button>
                  <button
                    type="button"
                    onClick={() => loadExperiment(currentExp, false)}
                    className="py-2 px-3 rounded-xl bg-slate-900 border border-slate-700 text-xs font-bold text-slate-200 cursor-pointer"
                  >
                    Baştan Dene
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      handleShareUrl(
                        `DersoLab Kimya: "${currentExp.title}" deneyini ${usedAutoplay ? 'Otomatik Oynat ile' : 'bizzat manuel'} tamamladım! (${currentExp.summaryFormula})`
                      )
                    }
                    className="py-2 px-3 rounded-xl bg-slate-900 border border-slate-700 text-xs font-bold text-cyan-300 cursor-pointer"
                  >
                    Sonucu Paylaş
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Live Dynamic Chart Card */}
          <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-4 space-y-2">
            <div className="flex items-center justify-between gap-2">
              <div className="text-xs font-black text-white uppercase tracking-wider">
                {currentExp.chartConfig.title}
              </div>
              <span className="text-[10px] font-semibold text-slate-400">
                Birim: {currentExp.chartConfig.unit}
              </span>
            </div>
            <svg viewBox="0 0 300 140" className="w-full h-32 bg-slate-950/70 rounded-xl border border-slate-800/80">
              <line x1="36" y1="24" x2="284" y2="24" stroke="rgba(148,163,184,0.12)" strokeDasharray="3 3" />
              <line x1="36" y1="73" x2="284" y2="73" stroke="rgba(148,163,184,0.12)" strokeDasharray="3 3" />
              <line x1="36" y1="20" x2="36" y2="122" stroke="#334155" strokeWidth="1.5" />
              <line x1="36" y1="122" x2="284" y2="122" stroke="#334155" strokeWidth="1.5" />
              <text
                x="30"
                y="27"
                textAnchor="end"
                fill="#94a3b8"
                fontSize="9.5"
                fontWeight="600"
                style={{ fontVariantNumeric: 'tabular-nums' }}
              >
                {chartMaxY}
              </text>
              <text
                x="30"
                y="122"
                textAnchor="end"
                fill="#94a3b8"
                fontSize="9.5"
                fontWeight="600"
                style={{ fontVariantNumeric: 'tabular-nums' }}
              >
                {chartMinY}
              </text>
              {activeChartPts.length > 1 && (
                <polyline
                  fill="none"
                  stroke={currentExp.chartConfig.color}
                  strokeWidth="2.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  points={activeChartPts.map((p) => `${toSvgX(p.x)},${toSvgY(p.y)}`).join(' ')}
                />
              )}
              {activeChartPts.map((p, idx) => (
                <circle
                  key={idx}
                  cx={toSvgX(p.x)}
                  cy={toSvgY(p.y)}
                  r="4"
                  fill={currentExp.chartConfig.color}
                  stroke="#020617"
                  strokeWidth="1.5"
                />
              ))}
            </svg>
          </div>

          {/* Gözlem Defteri */}
          <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-4 space-y-2.5">
            <div className="text-xs font-black text-white uppercase tracking-wider inline-flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Gözlem Defteri</span>
            </div>
            <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
              {logs.map((entry) => (
                <div key={entry.id} className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800/90 text-xs space-y-1">
                  <div className="flex items-center gap-1.5">
                    <span
                      className={`px-1.5 py-0.5 rounded text-[9px] font-black uppercase ${
                        entry.type === 'BASARILI'
                          ? 'bg-emerald-500/20 text-emerald-300'
                          : entry.type === 'NEDEN'
                          ? 'bg-violet-500/20 text-violet-300'
                          : 'bg-cyan-500/20 text-cyan-300'
                      }`}
                    >
                      {entry.type === 'BASARILI' ? 'BAŞARILI' : entry.type === 'NEDEN' ? 'NEDEN?' : 'BİLGİ'}
                    </span>
                    <span className="font-bold text-white">{entry.title}</span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-snug">{entry.explanation}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── ALL 59 EXPERIMENTS CATALOG GRID WITH PROGRESS BADGES ── */}
      <div className="rounded-3xl bg-slate-900/70 border border-slate-800 p-5 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h3 className="text-lg font-black text-white">
              Deney & Gösteri Kataloğu ({filteredExperiments.length || 59} Deney)
            </h3>
            <p className="text-xs text-slate-400">
              Türkiye Yüzyılı Maarif Modeli (9–12. Sınıf) + 8 yeni sınıf gösterisi. Bir karta tıkla ve hemen tezgâhta dene.
            </p>
          </div>
          <span className="text-xs font-mono text-emerald-300 font-bold">
            Tamamlanan: {completedCount}/59
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {(gradeFilter === 'sandbox' ? CHEM_EXPERIMENTS : filteredExperiments).map((exp) => {
            const prog = progressMap[exp.id]
            const active = !isSandbox && currentExp.id === exp.id
            return (
              <button
                key={exp.id}
                type="button"
                onClick={() => {
                  playClickSound()
                  loadExperiment(exp, false)
                  workbenchRootRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
                }}
                className={`p-3.5 rounded-2xl text-left border transition-all cursor-pointer flex flex-col justify-between gap-2 ${
                  active
                    ? 'bg-cyan-950/40 border-cyan-400 ring-1 ring-cyan-400/30'
                    : 'bg-slate-950/75 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="space-y-1">
                  <div className="flex items-center justify-between gap-1">
                    <span
                      className={`text-[10px] font-black px-2 py-0.5 rounded-full uppercase ${
                        exp.grade === 'gosteriler'
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                          : 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/25'
                      }`}
                    >
                      #{exp.number} · {exp.grade === 'gosteriler' ? 'Gösteri' : `${exp.grade}. Sınıf`}
                    </span>
                    {prog?.completed ? (
                      <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300">
                        ✓ Bitti
                      </span>
                    ) : prog && prog.stepsDone > 0 ? (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300">
                        {prog.stepsDone}/{prog.totalSteps}
                      </span>
                    ) : null}
                  </div>
                  <div className="text-sm font-black text-white leading-tight">{exp.title}</div>
                  <p className="text-[11px] text-slate-400 line-clamp-2">{exp.subtitle}</p>
                </div>

                <div className="text-[11px] font-bold text-cyan-400 inline-flex items-center gap-1">
                  <span>Tezgâhta Aç</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </div>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
