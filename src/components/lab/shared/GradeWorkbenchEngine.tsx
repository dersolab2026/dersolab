'use client'

import React, { useEffect, useMemo, useRef, useState } from 'react'
import {
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
  BookOpen,
  Sparkles,
  Award,
  KeyRound,
  Copy,
  FlaskConical,
  Hand,
  X,
} from 'lucide-react'
import {
  GRADE_KEYS,
  type GradeLevelKey,
  type SubjectSimulation,
  type SubjectWorkbenchConfig,
  type WorkbenchToolDef,
} from './gradeWorkbenchTypes'
import { SubjectStageRenderer, fmtTr } from './SubjectStageRenderer'
import {
  playClickSound,
  playChemicalReaction,
  playGlassClink,
  playSuccessFanfare,
  playErrorBuzz,
  isSoundMuted,
  setSoundMuted,
} from '@/lib/soundFx'

interface LogEntry {
  id: string
  type: 'BILGI' | 'NEDEN' | 'BASARILI'
  title: string
  explanation: string
}

interface Snapshot {
  stepIndex: number
  isCompleted: boolean
  primaryVal: number
  secondaryVal: number
  tertiaryVal: number
  statusLabel: string
  logs: LogEntry[]
}

interface ProgressRecord {
  stepsDone: number
  totalSteps: number
  completed: boolean
  usedAutoplay: boolean
}

export interface GradeWorkbenchEngineProps {
  config: SubjectWorkbenchConfig
}

export function GradeWorkbenchEngine({ config }: GradeWorkbenchEngineProps) {
  const storageKey = `dersolab_${config.branchKey}_progress_v1`

  const [gradeFilter, setGradeFilter] = useState<'all' | GradeLevelKey>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedSimId, setSelectedSimId] = useState<string>(config.simulations[0].id)

  // Simulation runtime state
  const [currentStepIndex, setCurrentStepIndex] = useState(0)
  const [isCompleted, setIsCompleted] = useState(false)
  const [usedAutoplay, setUsedAutoplay] = useState(false)
  const [primaryVal, setPrimaryVal] = useState<number>(config.simulations[0].initialPrimary)
  const [secondaryVal, setSecondaryVal] = useState<number>(config.simulations[0].initialSecondary ?? 0)
  const [tertiaryVal, setTertiaryVal] = useState<number>(config.simulations[0].initialTertiary ?? 0)
  const [statusLabel, setStatusLabel] = useState<string>(config.simulations[0].initialStatus)
  const [logs, setLogs] = useState<LogEntry[]>([])
  const [undoStack, setUndoStack] = useState<Snapshot[]>([])

  // Interactive Popover & Tool Selection
  const [selectedTool, setSelectedTool] = useState<WorkbenchToolDef | null>(
    () => config.simulations[0].tools[0] || null
  )
  const [selectedDose, setSelectedDose] = useState<number>(5)
  const [actionAnim, setActionAnim] = useState<{ toolId: string; colorHex: string } | null>(null)

  // Controls & Toggles
  const [isAutoPlaying, setIsAutoPlaying] = useState(false)
  const [fastForward, setFastForward] = useState(false)
  const [microMode, setMicroMode] = useState(false)
  const [muted, setMuted] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [copiedBanner, setCopiedBanner] = useState<string | null>(null)
  const [showHintStep, setShowHintStep] = useState<number | null>(null)
  const [inquiryChoice, setInquiryChoice] = useState<number | null>(null)
  const [progressMap, setProgressMap] = useState<Record<string, ProgressRecord>>({})

  // Assignment ("Ödev Kodu") state
  const [homeworkOpen, setHomeworkOpen] = useState(false)
  const [homeworkTab, setHomeworkTab] = useState<'student' | 'teacher'>('student')
  const [homeworkInput, setHomeworkInput] = useState('')
  const [activeAssignmentId, setActiveAssignmentId] = useState<string | null>(null)
  const [studentName, setStudentName] = useState('')
  const [teacherPickId, setTeacherPickId] = useState(config.simulations[0].id)
  const [verifyTokenInput, setVerifyTokenInput] = useState('')

  const rootRef = useRef<HTMLDivElement>(null)

  const currentSim = useMemo(
    () => config.simulations.find((s) => s.id === selectedSimId) || config.simulations[0],
    [config.simulations, selectedSimId]
  )

  const encodeCode = (num: number) => `${config.codePrefix}${String(Math.min(99, Math.max(1, num))).padStart(2, '0')}LAB`

  const decodeCode = (raw: string): SubjectSimulation | null => {
    const cleaned = raw.trim().toUpperCase().replace(/[^A-Z0-9]/g, '')
    const re = new RegExp(`^${config.codePrefix}(\\d{2})`)
    const m = cleaned.match(re)
    if (m) {
      const n = Number(m[1])
      return config.simulations.find((s) => s.number === n) || null
    }
    return null
  }

  useEffect(() => {
    setMuted(isSoundMuted())
    try {
      const saved = localStorage.getItem(storageKey)
      if (saved) setProgressMap(JSON.parse(saved))
    } catch {}
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search)
      const simParam = params.get('deney')
      const odevParam = params.get('odev')
      if (odevParam) {
        const matched = decodeCode(odevParam)
        if (matched) {
          loadSim(matched)
          setActiveAssignmentId(matched.id)
          setHomeworkInput(odevParam.toUpperCase())
          setHomeworkOpen(true)
        }
      } else if (simParam) {
        const matched = config.simulations.find((s) => s.id === simParam)
        if (matched) loadSim(matched)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function loadSim(sim: SubjectSimulation) {
    setIsAutoPlaying(false)
    setSelectedSimId(sim.id)
    setCurrentStepIndex(0)
    setIsCompleted(false)
    setUsedAutoplay(false)
    setUndoStack([])
    setShowHintStep(null)
    setInquiryChoice(null)
    setSelectedTool(null)
    setPrimaryVal(sim.initialPrimary)
    setSecondaryVal(sim.initialSecondary ?? 0)
    setTertiaryVal(sim.initialTertiary ?? 0)
    setStatusLabel(sim.initialStatus)
    setLogs([
      {
        id: `init-${Date.now()}`,
        type: 'BILGI',
        title: `#${sim.number} · ${sim.title}`,
        explanation: sim.subtitle,
      },
    ])
  }

  const saveProgress = (sim: SubjectSimulation, doneSteps: number, completed: boolean, auto: boolean) => {
    setProgressMap((prev) => {
      const ex = prev[sim.id]
      const updated: Record<string, ProgressRecord> = {
        ...prev,
        [sim.id]: {
          stepsDone: Math.max(ex?.stepsDone || 0, doneSteps),
          totalSteps: sim.steps.length,
          completed: Boolean(ex?.completed || completed),
          usedAutoplay: ex?.completed ? ex.usedAutoplay : auto,
        },
      }
      try {
        localStorage.setItem(storageKey, JSON.stringify(updated))
      } catch {}
      return updated
    })
  }

  const executeStep = (fromAutoplay = false) => {
    if (isCompleted) return
    const step = currentSim.steps[currentStepIndex]
    if (!step) return

    setUndoStack((prev) => [
      ...prev.slice(-12),
      {
        stepIndex: currentStepIndex,
        isCompleted,
        primaryVal,
        secondaryVal,
        tertiaryVal,
        statusLabel,
        logs: [...logs],
      },
    ])

    if (fromAutoplay) setUsedAutoplay(true)
    playChemicalReaction()

    setPrimaryVal(step.primaryValue)
    if (step.secondaryValue !== undefined) setSecondaryVal(step.secondaryValue)
    if (step.tertiaryValue !== undefined) setTertiaryVal(step.tertiaryValue)
    setStatusLabel(step.statusLabel)

    setLogs((prev) => [
      {
        id: `${step.id}-${Date.now()}`,
        type: step.logType,
        title: step.logTitle,
        explanation: step.logExplanation,
      },
      ...prev,
    ])

    const nextIdx = currentStepIndex + 1
    const doneNow = nextIdx >= currentSim.steps.length
    setCurrentStepIndex(nextIdx)
    if (doneNow) {
      setIsCompleted(true)
      setIsAutoPlaying(false)
      setSelectedTool(null)
      playSuccessFanfare()
    }
    saveProgress(currentSim, nextIdx, doneNow, fromAutoplay || usedAutoplay)
  }

  useEffect(() => {
    if (!isAutoPlaying || isCompleted || activeAssignmentId === currentSim.id) return
    const timer = setTimeout(() => executeStep(true), fastForward ? 750 : 2400)
    return () => clearTimeout(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAutoPlaying, currentStepIndex, isCompleted, fastForward, activeAssignmentId])

  // Auto-select the active step's tool on load and step advance so studio popover + target glows show across all 144 simulations
  useEffect(() => {
    if (isCompleted) {
      setSelectedTool(null)
      return
    }
    const stepToolId = currentSim.steps[currentStepIndex]?.toolId
    const matched = currentSim.tools.find((t) => t.id === stepToolId) || currentSim.tools[0] || null
    setSelectedTool(matched)
    if (matched?.doseOptions && matched.doseOptions.length > 0) setSelectedDose(matched.doseOptions[0])
    else if (matched?.kind === 'weight') setSelectedDose(100)
    else if (matched?.kind === 'bottle') setSelectedDose(5)
    else setSelectedDose(1)
  }, [currentSim.id, currentSim.steps, currentSim.tools, currentStepIndex, isCompleted])

  const handleUndo = () => {
    if (undoStack.length === 0) return
    playGlassClink()
    setIsAutoPlaying(false)
    const last = undoStack[undoStack.length - 1]
    setUndoStack((p) => p.slice(0, -1))
    setCurrentStepIndex(last.stepIndex)
    setIsCompleted(last.isCompleted)
    setPrimaryVal(last.primaryVal)
    setSecondaryVal(last.secondaryVal)
    setTertiaryVal(last.tertiaryVal)
    setStatusLabel(last.statusLabel)
    setLogs(last.logs)
  }

  const handleSelectTool = (tool: WorkbenchToolDef) => {
    playClickSound()
    setSelectedTool(tool)
    if (tool.doseOptions && tool.doseOptions.length > 0) setSelectedDose(tool.doseOptions[0])
    else setSelectedDose(1)
  }

  const handleApplyToolToTarget = () => {
    if (!selectedTool) return
    setActionAnim({ toolId: selectedTool.id, colorHex: selectedTool.colorHex })
    setTimeout(() => setActionAnim(null), 650)
    executeStep(false)
  }

  const handleShare = (copyText?: string) => {
    playClickSound()
    const url =
      typeof window !== 'undefined'
        ? `${window.location.origin}/lab/${config.branchKey}?deney=${currentSim.id}`
        : `https://dersolab.com/lab/${config.branchKey}?deney=${currentSim.id}`
    navigator?.clipboard?.writeText(copyText || url)
    setCopiedBanner(copyText ? 'Sonuç / Ödev teslim kodu kopyalandı!' : 'Simülasyon bağlantısı kopyalandı!')
    setTimeout(() => setCopiedBanner(null), 2600)
  }

  const handleFullscreen = () => {
    playClickSound()
    const el = rootRef.current
    if (!el) return
    if (!document.fullscreenElement) {
      el.requestFullscreen?.().then(() => setIsFullscreen(true)).catch(() => setIsFullscreen((p) => !p))
    } else {
      document.exitFullscreen?.().then(() => setIsFullscreen(false)).catch(() => setIsFullscreen(false))
    }
  }

  const filteredSims = useMemo(() => {
    const q = searchQuery.trim().toLowerCase()
    return config.simulations.filter((s) => {
      if (gradeFilter !== 'all' && s.grade !== gradeFilter) return false
      if (!q) return true
      return (
        s.title.toLowerCase().includes(q) ||
        s.subtitle.toLowerCase().includes(q) ||
        s.maarifUnit.toLowerCase().includes(q) ||
        s.mebCode.toLowerCase().includes(q)
      )
    })
  }, [config.simulations, gradeFilter, searchQuery])

  const activeStep = !isCompleted ? currentSim.steps[currentStepIndex] || null : null
  const completedCount = Object.values(progressMap).filter((p) => p.completed).length
  const nextSim = config.simulations.find((s) => s.number === currentSim.number + 1) || config.simulations[0]

  // Dynamic Chart
  const chartPts = currentSim.chartPoints
  const chartMaxY = Math.max(...chartPts.map((p) => p[1]), 1)
  const chartMinY = Math.min(...chartPts.map((p) => p[1]), 0)
  const chartMaxX = Math.max(...chartPts.map((p) => p[0]), 1)
  const chartMinX = Math.min(...chartPts.map((p) => p[0]), 0)
  const visCount = isCompleted
    ? chartPts.length
    : Math.max(1, Math.ceil(((currentStepIndex + 0.5) / Math.max(currentSim.steps.length, 1)) * chartPts.length))
  const activePts = chartPts.slice(0, visCount)
  const toX = (x: number) => 38 + ((x - chartMinX) / Math.max(chartMaxX - chartMinX, 0.001)) * 240
  const toY = (y: number) => 122 - ((y - chartMinY) / Math.max(chartMaxY - chartMinY, 0.001)) * 96

  const submissionToken = useMemo(() => {
    if (!isCompleted) return ''
    const code = encodeCode(currentSim.number)
    const who = (studentName.trim() || 'Ogrenci').replace(/\s+/g, '_')
    const mode = usedAutoplay ? 'AUTO' : 'MANUEL'
    return `${code}-${who}-${currentSim.steps.length}/${currentSim.steps.length}-${mode}`
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isCompleted, currentSim, studentName, usedAutoplay])

  return (
    <div ref={rootRef} className="space-y-6">
      {/* ── TOP GRADE FILTER + SEARCH + HOMEWORK RIBBON ── */}
      <div className="rounded-3xl bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900/95 border border-slate-800 p-5 sm:p-6 shadow-2xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className={`px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider border ${config.accentBgClass} ${config.accentTextClass} ${config.accentBorderClass}`}>
                {config.simulations.length} Simülasyon · 5–12. Sınıf MEB Maarif Modeli
              </span>
              <span className="px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-[11px] font-bold inline-flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5" />
                İlerleme Rozeti: {completedCount}/{config.simulations.length} Tamamlandı
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">{config.title}</h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-3xl">{config.subtitle}</p>
          </div>

          <button
            type="button"
            onClick={() => {
              playClickSound()
              setHomeworkOpen((p) => !p)
            }}
            className="px-4 py-2.5 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-cyan-500/35 text-cyan-300 text-xs font-black inline-flex items-center gap-2 self-start lg:self-auto cursor-pointer transition-all"
          >
            <KeyRound className="w-4 h-4 text-cyan-400" />
            <span>Ödev kodun mu var? / Öğretmen Paneli</span>
            <ChevronDown className={`w-4 h-4 transition-transform ${homeworkOpen ? 'rotate-180' : ''}`} />
          </button>
        </div>

        {homeworkOpen && (
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
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={homeworkInput}
                    onChange={(e) => setHomeworkInput(e.target.value.toUpperCase())}
                    placeholder={`Örn: ${encodeCode(1)}`}
                    maxLength={10}
                    className="flex-1 px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const matched = decodeCode(homeworkInput)
                      if (!matched) {
                        playErrorBuzz()
                        setCopiedBanner(`Geçersiz kod! Örnek: ${encodeCode(1)} .. ${encodeCode(config.simulations.length)}`)
                        setTimeout(() => setCopiedBanner(null), 2600)
                        return
                      }
                      playSuccessFanfare()
                      loadSim(matched)
                      setActiveAssignmentId(matched.id)
                      setGradeFilter(matched.grade)
                    }}
                    className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-black cursor-pointer"
                  >
                    Ödevi Aç
                  </button>
                </div>
              ) : (
                <div className="flex flex-wrap items-center gap-2">
                  <select
                    value={teacherPickId}
                    onChange={(e) => setTeacherPickId(e.target.value)}
                    className="flex-1 px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white"
                  >
                    {config.simulations.map((s) => (
                      <option key={s.id} value={s.id}>
                        #{s.number} · {s.title} ({s.grade}. Sınıf)
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={() => {
                      const s = config.simulations.find((x) => x.id === teacherPickId) || config.simulations[0]
                      const code = encodeCode(s.number)
                      handleShare(`DersoLab Ödevi: #${s.number} ${s.title}\nKod: ${code}\nLink: ${window.location.origin}/lab/${config.branchKey}?odev=${code}`)
                    }}
                    className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black inline-flex items-center gap-1.5 cursor-pointer"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>Kodu Kopyala</span>
                  </button>
                </div>
              )}
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2">
              <div className="text-xs font-black text-slate-200">Öğretmen Sonuç Doğrulama</div>
              <input
                type="text"
                value={verifyTokenInput}
                onChange={(e) => setVerifyTokenInput(e.target.value)}
                placeholder={`${encodeCode(1)}-Ahmet_Yilmaz-3/3-MANUEL`}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs"
              />
              {verifyTokenInput.trim() && (
                <div className="text-xs text-emerald-300 font-bold">
                  {verifyTokenInput.includes('AUTO')
                    ? '⚠️ İşaretli Gönderi: Otomatik oynatma ile tamamlandı.'
                    : verifyTokenInput.includes('MANUEL')
                    ? `✓ Doğrulanmış Manuel Gönderi (${verifyTokenInput})`
                    : 'Teslim kodu formatı: KOD-İsim-Adım-MANUEL/AUTO'}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Grade Pills (Tümü + 5..12. Sınıf) + Search */}
        <div className="mt-5 pt-4 border-t border-slate-800/80 flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-1.5">
            <button
              type="button"
              onClick={() => {
                playClickSound()
                setGradeFilter('all')
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer transition-all ${
                gradeFilter === 'all'
                  ? 'bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/20'
                  : 'bg-slate-900 text-slate-300 border border-slate-800 hover:border-slate-700'
              }`}
            >
              Tümü ({config.simulations.length})
            </button>
            {GRADE_KEYS.map((gk) => {
              const count = config.simulations.filter((s) => s.grade === gk).length
              const active = gradeFilter === gk
              return (
                <button
                  key={gk}
                  type="button"
                  onClick={() => {
                    playClickSound()
                    setGradeFilter(gk)
                    const first = config.simulations.find((s) => s.grade === gk)
                    if (first && currentSim.grade !== gk) loadSim(first)
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer transition-all ${
                    active
                      ? 'bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/20'
                      : 'bg-slate-900 text-slate-300 border border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <span>{config.gradeLabels?.[gk] || `${gk}. Sınıf`}</span>
                  <span className={`px-1.5 rounded-full text-[10px] ${active ? 'bg-black/25' : 'bg-slate-800 text-slate-400'}`}>
                    {count}
                  </span>
                </button>
              )
            })}
          </div>

          <div className="relative w-full lg:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Deney veya kazanım ara..."
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-500"
            />
          </div>
        </div>

        {/* Scrollable Experiment Ribbon */}
        <div className="mt-3 flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
          {filteredSims.map((sim) => {
            const active = sim.id === currentSim.id
            const prog = progressMap[sim.id]
            return (
              <button
                key={sim.id}
                type="button"
                onClick={() => {
                  playClickSound()
                  loadSim(sim)
                }}
                className={`shrink-0 px-3 py-1.5 rounded-xl text-xs font-bold inline-flex items-center gap-1.5 border cursor-pointer transition-all ${
                  active
                    ? 'bg-cyan-950/70 border-cyan-400 text-white shadow-[0_0_12px_rgba(34,211,238,0.28)]'
                    : 'bg-slate-900/80 border-slate-800 text-slate-300 hover:border-slate-700 hover:text-white'
                }`}
              >
                <span className="text-[10px] font-bold text-slate-400">#{sim.number} · {sim.grade}.Snf</span>
                <span>{sim.title}</span>
                {prog?.completed && (
                  <span className="px-1.5 rounded-full bg-emerald-500/25 text-emerald-300 text-[10px] font-black">✓</span>
                )}
              </button>
            )
          })}
        </div>
      </div>

      {copiedBanner && (
        <div className="px-4 py-2.5 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-200 text-xs font-bold text-center">
          {copiedBanner}
        </div>
      )}

      {/* ── TOOLBAR ── */}
      <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-3 flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => {
              playClickSound()
              if (isAutoPlaying) {
                setIsAutoPlaying(false)
                return
              }
              if (isCompleted) loadSim(currentSim)
              setUsedAutoplay(true)
              setIsAutoPlaying(true)
            }}
            disabled={activeAssignmentId === currentSim.id}
            className={`px-3.5 py-2 rounded-xl text-xs font-black inline-flex items-center gap-1.5 cursor-pointer transition-all disabled:opacity-40 ${
              isAutoPlaying ? 'bg-rose-500 text-white' : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950'
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
              fastForward ? 'bg-amber-500/25 border-amber-400 text-amber-200' : 'bg-slate-950 border-slate-800 text-slate-300'
            }`}
          >
            <FastForward className="w-3.5 h-3.5" />
            <span>4× Hız</span>
          </button>

          <button
            type="button"
            onClick={handleUndo}
            disabled={undoStack.length === 0}
            className="px-3 py-2 rounded-xl text-xs font-bold inline-flex items-center gap-1.5 bg-slate-950 border border-slate-800 text-slate-200 disabled:opacity-35 cursor-pointer"
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
              microMode ? 'bg-cyan-500 text-slate-950 border-cyan-400' : 'bg-cyan-500/15 border-cyan-500/35 text-cyan-300'
            }`}
          >
            <Atom className="w-3.5 h-3.5" />
            <span>Model / Mikro Görünüm</span>
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => {
              const n = !muted
              setMuted(n)
              setSoundMuted(n)
            }}
            className="p-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 hover:text-white cursor-pointer"
            title="Sesi Aç/Kapat"
          >
            {muted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
          </button>
          <button
            type="button"
            onClick={() => handleShare()}
            className="p-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 hover:text-white cursor-pointer"
            title="Paylaş"
          >
            <Share2 className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={handleFullscreen}
            className="p-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 hover:text-white cursor-pointer"
            title="Tam Ekran"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
          <button
            type="button"
            onClick={() => {
              playGlassClink()
              loadSim(currentSim)
            }}
            className="px-3 py-2 rounded-xl text-xs font-bold inline-flex items-center gap-1.5 bg-slate-950 border border-slate-800 text-slate-300 hover:text-white cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Sıfırla</span>
          </button>
        </div>
      </div>

      {/* ── MAIN WORKSPACE: LEFT 8 COLS (INTERACTIVE STAGE), RIGHT 4 COLS (STEPS + CHART + LOG) ── */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-5">
        <div className="xl:col-span-8 space-y-4">
          <div className="relative rounded-2xl bg-[#070C16] border border-slate-800 overflow-hidden shadow-2xl">
            {/* Top Instruction Bar */}
            <div className="px-4 py-2.5 bg-slate-950/90 border-b border-slate-800/80 flex flex-wrap items-center justify-between gap-2 text-xs">
              <div className="min-w-0">
                {isCompleted ? (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-bold">
                    ✓ Tamamlandı ({currentSim.steps.length}/{currentSim.steps.length})
                  </span>
                ) : (
                  <span className="text-slate-200 font-medium">
                    <span className="text-amber-400 font-extrabold mr-1.5">
                      Adım {currentStepIndex + 1}/{currentSim.steps.length}:
                    </span>
                    {activeStep?.instruction}
                  </span>
                )}
              </div>

              {/* Live Sensor Readouts */}
              <div className="flex flex-wrap items-center gap-1.5 text-[11px] font-bold" style={{ fontVariantNumeric: 'tabular-nums' }}>
                <span className="px-2.5 py-0.5 rounded-full bg-slate-900 border border-rose-500/35 text-rose-300">
                  {currentSim.metricPrimaryLabel}: {fmtTr(primaryVal, 1)} {currentSim.metricPrimaryUnit}
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-slate-900 border border-sky-500/35 text-sky-300">
                  {currentSim.metricSecondaryLabel}: {fmtTr(secondaryVal, 1)} {currentSim.metricSecondaryUnit}
                </span>
              </div>
            </div>

            {/* Interactive Vector Stage with Top-Left Floating Popover */}
            <div className="relative w-full">
              {selectedTool && (() => {
                const effDoseOptions =
                  selectedTool.doseOptions && selectedTool.doseOptions.length > 0
                    ? selectedTool.doseOptions
                    : selectedTool.kind === 'bottle'
                    ? [5, 10]
                    : selectedTool.kind === 'weight'
                    ? [100, 200]
                    : [1, 2]
                const effDoseUnit =
                  selectedTool.doseUnit ||
                  (selectedTool.kind === 'bottle' ? 'mL' : selectedTool.kind === 'weight' ? 'g' : '×')
                const doseHeading = selectedTool.kind === 'bottle' ? 'Miktar:' : 'Kademe:'
                return (
                  <div className="absolute top-3 left-3 z-20 w-[268px] max-w-[calc(100%-24px)] rounded-2xl bg-[#090d16]/95 backdrop-blur-md border border-slate-700/80 p-3 shadow-2xl space-y-2.5">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5 text-xs flex-wrap">
                        <span className="text-slate-400 font-semibold">{doseHeading}</span>
                        {effDoseOptions.map((d) => (
                          <button
                            key={d}
                            type="button"
                            onClick={() => setSelectedDose(d)}
                            className={`px-2 py-0.5 rounded-full font-bold text-[11px] border cursor-pointer transition-all ${
                              selectedDose === d
                                ? 'bg-rose-500/20 border-rose-400 text-rose-200'
                                : 'bg-slate-900 border-slate-700 text-slate-300 hover:border-slate-500'
                            }`}
                          >
                            {d} {effDoseUnit}
                          </button>
                        ))}
                      </div>
                      <button
                        type="button"
                        onClick={() => setSelectedTool(null)}
                        aria-label="Kapat"
                        className="p-0.5 rounded-md text-slate-400 hover:text-white cursor-pointer"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <div className="space-y-1.5">
                      {currentSim.targetLabels.map((tgt) => (
                        <button
                          key={tgt}
                          type="button"
                          onClick={handleApplyToolToTarget}
                          className="w-full px-3.5 py-2 rounded-xl bg-[#dc2626] hover:bg-[#ef4444] text-white text-xs font-extrabold text-left shadow-md cursor-pointer transition-all"
                        >
                          {`${selectedDose} ${effDoseUnit} · Uygula → ${tgt}`}
                        </button>
                      ))}
                    </div>
                  </div>
                )
              })()}

              <SubjectStageRenderer
                sim={currentSim}
                primaryVal={primaryVal}
                secondaryVal={secondaryVal}
                tertiaryVal={tertiaryVal}
                statusLabel={statusLabel}
                selectedToolId={selectedTool?.id || null}
                showTargetHighlight={Boolean(selectedTool)}
                fastForward={fastForward}
                actionAnim={actionAnim}
                onSelectTool={handleSelectTool}
                onTargetClick={() => (selectedTool ? handleApplyToolToTarget() : executeStep(false))}
                onClearSelection={() => setSelectedTool(null)}
              />

              {/* Micro / Concept Model Overlay */}
              {microMode && (
                <div className="absolute inset-0 bg-slate-950/94 backdrop-blur-md p-4 sm:p-6 flex flex-col justify-between z-30 border-2 border-cyan-500/40 rounded-2xl">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/20 border border-cyan-400/40 text-cyan-300 text-xs font-black">
                      <Atom className="w-4 h-4 animate-spin" style={{ animationDuration: '6s' }} />
                      {currentSim.microTitle}
                    </span>
                    <span className="text-xs font-bold text-amber-300 bg-slate-900 px-3 py-1 rounded-lg border border-slate-700">
                      {currentSim.formulaBadge}
                    </span>
                  </div>
                  <div className="my-3 grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {currentSim.microItems.map((it, idx) => (
                      <div key={it.badge} className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 flex items-center gap-3">
                        <div
                          className="w-11 h-11 rounded-full flex items-center justify-center text-xs font-black text-slate-950 shrink-0 shadow-lg animate-bounce"
                          style={{ backgroundColor: it.color, animationDuration: `${1.8 + idx * 0.4}s` }}
                        >
                          {it.badge.slice(0, 6)}
                        </div>
                        <div className="min-w-0">
                          <div className="text-xs font-black text-white truncate">{it.badge}</div>
                          <div className="text-[11px] text-slate-400 leading-snug">{it.desc}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="p-3 rounded-xl bg-cyan-950/40 border border-cyan-500/30 text-xs text-cyan-100 leading-relaxed">
                    <strong className="text-cyan-300">Derin Kavram Analizi:</strong> {currentSim.microExplanation}
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Contextual Bar */}
            <div className="px-4 py-3 bg-[#090E18] border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2.5">
              {selectedTool ? (
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 font-bold">
                    <FlaskConical className="w-3.5 h-3.5" />
                    {selectedTool.label} ({selectedTool.subLabel})
                  </span>
                  <button
                    type="button"
                    onClick={handleApplyToolToTarget}
                    className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-black cursor-pointer"
                  >
                    Uygula → {currentSim.targetLabels[0]}
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <Hand className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>Sağdaki malzemelere/araçlara dokunarak düzeneklere uygulayabilir ya da doğrudan adımı çalıştırabilirsin.</span>
                </div>
              )}

              {!isCompleted && (
                <button
                  type="button"
                  onClick={() => executeStep(false)}
                  className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 text-xs font-black shadow-lg shadow-amber-500/20 cursor-pointer shrink-0"
                >
                  {activeStep?.actionLabel || 'Adımı Uygula'} →
                </button>
              )}
            </div>
          </div>

          {/* Why It Happens & Exam Notes */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-4 space-y-2.5">
              <div className="flex items-center gap-2 text-xs font-black text-cyan-300 uppercase tracking-wider">
                <BookOpen className="w-4 h-4" />
                <span>Neden Böyle Olur?</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">{currentSim.whyItHappens}</p>
              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-[11px] font-bold text-emerald-300">
                {currentSim.formulaBadge}
              </div>
            </div>
            <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-4 space-y-2">
              <div className="text-xs font-black text-amber-300 uppercase tracking-wider">MEB & Sınav İpuçları</div>
              <ul className="space-y-1.5 text-xs text-slate-300">
                {currentSim.notes.map((n) => (
                  <li key={n} className="flex items-start gap-1.5">
                    <span className="text-amber-400 font-bold">•</span>
                    <span>{n}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* RIGHT 4 COLS: STEPS + CHART + LOG */}
        <div className="xl:col-span-4 space-y-4">
          <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-4 space-y-3">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 text-xs font-black text-white uppercase tracking-wider">
                <ClipboardList className="w-4 h-4 text-cyan-400" />
                <span>Uygulama Adımları</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="px-2 py-0.5 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-[10px] font-bold text-cyan-300">
                  {currentSim.mebCode}
                </span>
                <span className="px-2 py-0.5 rounded-full bg-slate-950 border border-slate-700 text-xs text-cyan-300 font-bold" style={{ fontVariantNumeric: 'tabular-nums' }}>
                  {currentStepIndex}/{currentSim.steps.length}
                </span>
              </div>
            </div>

            <div className="space-y-2">
              {currentSim.steps.map((s, idx) => {
                const done = idx < currentStepIndex
                const cur = idx === currentStepIndex && !isCompleted
                return (
                  <div
                    key={s.id}
                    className={`p-2.5 rounded-xl border text-xs ${
                      done
                        ? 'bg-emerald-950/30 border-emerald-500/35 text-emerald-200'
                        : cur
                        ? 'bg-amber-950/30 border-amber-400/60 text-white'
                        : 'bg-slate-950/60 border-slate-800/80 text-slate-400'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-start gap-2">
                        <span className="mt-0.5 font-bold">{done ? '✓' : `${idx + 1}.`}</span>
                        <span className="leading-snug">{s.instruction}</span>
                      </div>
                      {cur && (
                        <button
                          type="button"
                          onClick={() => setShowHintStep(showHintStep === idx ? null : idx)}
                          className="shrink-0 text-[10px] font-bold text-amber-300 underline cursor-pointer"
                        >
                          İpucu
                        </button>
                      )}
                    </div>
                    {cur && showHintStep === idx && (
                      <div className="mt-1.5 pl-4 text-[11px] text-amber-200/90">
                        Hedef: {currentSim.targetLabels[0]} — “{s.actionLabel}” butonuna tıkla.
                      </div>
                    )}
                  </div>
                )
              })}
            </div>

            {isCompleted && (
              <div className="p-3.5 rounded-2xl bg-gradient-to-br from-emerald-950/70 to-cyan-950/50 border border-emerald-500/45 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-emerald-300 inline-flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" />
                    Simülasyon Tamamlandı!
                  </span>
                </div>
                {activeAssignmentId === currentSim.id && (
                  <div className="p-2.5 rounded-xl bg-slate-950/80 border border-cyan-500/30 space-y-2">
                    <input
                      type="text"
                      value={studentName}
                      onChange={(e) => setStudentName(e.target.value)}
                      placeholder="Adın Soyadın"
                      className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white"
                    />
                    <button
                      type="button"
                      onClick={() => handleShare(submissionToken)}
                      className="w-full py-1.5 rounded-lg bg-cyan-500 text-slate-950 text-xs font-black cursor-pointer"
                    >
                      Öğretmene Gönder ({submissionToken})
                    </button>
                  </div>
                )}

                <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
                  <div className="text-[11px] font-black text-amber-300">Maarif Çıkarım Kontrolü</div>
                  <p className="text-[11px] text-slate-200">{currentSim.inquiryQuestion.question}</p>
                  <div className="space-y-1">
                    {currentSim.inquiryQuestion.options.map((opt, idx) => {
                      const picked = inquiryChoice === idx
                      const right = idx === currentSim.inquiryQuestion.correctIndex
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
                      {currentSim.inquiryQuestion.explanation}
                    </div>
                  )}
                </div>

                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => loadSim(nextSim)}
                    className="flex-1 py-2 px-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-black cursor-pointer"
                  >
                    Sıradaki ({nextSim.grade}. Sınıf) →
                  </button>
                  <button
                    type="button"
                    onClick={() => loadSim(currentSim)}
                    className="py-2 px-3 rounded-xl bg-slate-900 border border-slate-700 text-xs font-bold text-slate-200 cursor-pointer"
                  >
                    Baştan Dene
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Live Dynamic Chart */}
          <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-4 space-y-2">
            <div className="flex items-center justify-between gap-2">
              <div className="text-xs font-black text-white uppercase tracking-wider">{currentSim.chartTitle}</div>
              <span className="text-[10px] font-semibold text-slate-400">Birim: {currentSim.chartUnit}</span>
            </div>
            <svg viewBox="0 0 300 140" className="w-full h-32 bg-slate-950/70 rounded-xl border border-slate-800/80">
              <line x1="38" y1="26" x2="278" y2="26" stroke="rgba(148,163,184,0.12)" strokeDasharray="3 3" />
              <line x1="38" y1="74" x2="278" y2="74" stroke="rgba(148,163,184,0.12)" strokeDasharray="3 3" />
              <line x1="38" y1="20" x2="38" y2="122" stroke="#334155" strokeWidth="1.5" />
              <line x1="38" y1="122" x2="278" y2="122" stroke="#334155" strokeWidth="1.5" />
              <text x="32" y="28" textAnchor="end" fill="#94a3b8" fontSize="9.5" fontWeight="600" style={{ fontVariantNumeric: 'tabular-nums' }}>
                {chartMaxY}
              </text>
              <text x="32" y="122" textAnchor="end" fill="#94a3b8" fontSize="9.5" fontWeight="600" style={{ fontVariantNumeric: 'tabular-nums' }}>
                {chartMinY}
              </text>
              {activePts.length > 1 && (
                <polyline
                  fill="none"
                  stroke={currentSim.chartColor}
                  strokeWidth="2.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  points={activePts.map(([x, y]) => `${toX(x)},${toY(y)}`).join(' ')}
                />
              )}
              {activePts.map(([x, y], idx) => (
                <circle key={idx} cx={toX(x)} cy={toY(y)} r="4" fill={currentSim.chartColor} stroke="#020617" strokeWidth="1.5" />
              ))}
            </svg>
          </div>

          {/* Gözlem Defteri */}
          <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-4 space-y-2.5">
            <div className="text-xs font-black text-white uppercase tracking-wider inline-flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Gözlem Defteri</span>
            </div>
            <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
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

      {/* ── FULL GRADE-BY-GRADE CATALOG GRID ── */}
      <div className="rounded-3xl bg-slate-900/70 border border-slate-800 p-5 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h3 className="text-lg font-black text-white">
              Sınıf Sınıf Müfredat Kataloğu ({filteredSims.length} Simülasyon)
            </h3>
            <p className="text-xs text-slate-400">
              5. sınıftan 12. sınıfa MEB Türkiye Yüzyılı Maarif Modeli kazanımlarına göre düzenlenmiş interaktif deneyler.
            </p>
          </div>
          <span className="text-xs font-bold text-emerald-300">
            Tamamlanan: {completedCount}/{config.simulations.length}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {filteredSims.map((sim) => {
            const prog = progressMap[sim.id]
            const active = currentSim.id === sim.id
            return (
              <button
                key={sim.id}
                type="button"
                onClick={() => {
                  playClickSound()
                  loadSim(sim)
                  rootRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
                }}
                className={`p-3.5 rounded-2xl text-left border transition-all cursor-pointer flex flex-col justify-between gap-2 ${
                  active
                    ? 'bg-cyan-950/40 border-cyan-400 ring-1 ring-cyan-400/30'
                    : 'bg-slate-950/75 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="space-y-1">
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-[10px] font-black px-2 py-0.5 rounded-full uppercase bg-cyan-500/15 text-cyan-300 border border-cyan-500/25">
                      #{sim.number} · {sim.grade}. Sınıf
                    </span>
                    <span className="text-[10px] font-bold text-slate-400">{sim.mebCode}</span>
                  </div>
                  <div className="text-sm font-black text-white leading-tight">{sim.title}</div>
                  <p className="text-[11px] text-slate-400 line-clamp-2">{sim.subtitle}</p>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-cyan-400 inline-flex items-center gap-1">
                    Tezgâhta Aç <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                  {prog?.completed && (
                    <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300">
                      ✓ Bitti
                    </span>
                  )}
                </div>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
