export type GradeLevelKey = '5' | '6' | '7' | '8' | '9' | '10' | '11' | '12'

export type SubjectSceneType =
  | 'phys_spring_dynamo'
  | 'phys_buoyancy_overflow'
  | 'phys_torricelli_pressure'
  | 'phys_circuit_ohm'
  | 'phys_optics_bench'
  | 'phys_dynamics_ramp'
  | 'bio_reagent_tubes'
  | 'bio_microscope_slide'
  | 'bio_blood_typing'
  | 'bio_elodea_photosynthesis'
  | 'bio_osmosis_utube'
  | 'math_coord_plotter'
  | 'math_equation_balance'
  | 'math_geometry_proof'
  | 'math_unit_circle_prob'
  | 'turk_sentence_syntax'
  | 'turk_poetry_prosody'
  | 'sos_geo_climate_map'
  | 'sos_history_strategy'
  | 'eng_dialogue_grammar'

export interface WorkbenchToolDef {
  id: string
  label: string
  subLabel: string
  colorHex: string
  kind?: 'bottle' | 'weight' | 'lens' | 'card' | 'tile' | 'slider'
  doseOptions?: number[]
  doseUnit?: string
}

export interface WorkbenchMetric {
  label: string
  value: string
  color: 'rose' | 'emerald' | 'sky' | 'amber' | 'violet'
}

export interface WorkbenchStepDef {
  id: string
  instruction: string
  actionLabel: string
  toolId?: string
  primaryValue: number
  secondaryValue?: number
  tertiaryValue?: number
  statusLabel: string
  badgeColor?: string
  logType: 'BILGI' | 'NEDEN' | 'BASARILI'
  logTitle: string
  logExplanation: string
}

export interface SubjectSimulation {
  id: string
  number: number
  title: string
  subtitle: string
  grade: GradeLevelKey
  mebCode: string
  maarifUnit: string
  scene: SubjectSceneType
  targetLabels: [string, string]
  tools: WorkbenchToolDef[]
  initialPrimary: number
  initialSecondary?: number
  initialTertiary?: number
  initialStatus: string
  metricPrimaryLabel: string
  metricPrimaryUnit: string
  metricSecondaryLabel: string
  metricSecondaryUnit: string
  metricTertiaryLabel?: string
  metricTertiaryUnit?: string
  /** Extra scene payload (e.g. sentence words, poem couplet, map focus, English dialogue line, equation tokens) */
  scenePayload?: {
    displayTitle?: string
    tokens?: { text: string; role: string; color: string }[]
    lineA?: string
    lineB?: string
    highlight?: string
  }
  steps: WorkbenchStepDef[]
  chartTitle: string
  chartUnit: string
  chartColor: string
  chartPoints: [number, number][]
  formulaBadge: string
  microTitle: string
  microItems: { badge: string; color: string; desc: string }[]
  microExplanation: string
  whyItHappens: string
  notes: string[]
  inquiryQuestion: {
    question: string
    options: string[]
    correctIndex: number
    explanation: string
  }
}

export interface SubjectWorkbenchConfig {
  branchKey: 'fizik' | 'biyoloji' | 'matematik' | 'turkce' | 'sosyal' | 'ingilizce'
  codePrefix: string
  title: string
  subtitle: string
  accentTextClass: string
  accentBgClass: string
  accentBorderClass: string
  gradeLabels?: Partial<Record<GradeLevelKey, string>>
  simulations: SubjectSimulation[]
}

export function defineSim(input: Omit<SubjectSimulation, 'steps'> & {
  steps: {
    instruction: string
    actionLabel: string
    toolId?: string
    primaryValue: number
    secondaryValue?: number
    tertiaryValue?: number
    statusLabel: string
    badgeColor?: string
    logType?: 'BILGI' | 'NEDEN' | 'BASARILI'
    logTitle: string
    logExplanation: string
  }[]
}): SubjectSimulation {
  return {
    ...input,
    steps: input.steps.map((s, idx) => ({
      id: `${input.id}-s${idx + 1}`,
      instruction: s.instruction,
      actionLabel: s.actionLabel,
      toolId: s.toolId,
      primaryValue: s.primaryValue,
      secondaryValue: s.secondaryValue,
      tertiaryValue: s.tertiaryValue,
      statusLabel: s.statusLabel,
      badgeColor: s.badgeColor,
      logType: s.logType || (idx === input.steps.length - 1 ? 'BASARILI' : idx % 2 === 1 ? 'NEDEN' : 'BILGI'),
      logTitle: s.logTitle,
      logExplanation: s.logExplanation,
    })),
  }
}

export const GRADE_KEYS: GradeLevelKey[] = ['5', '6', '7', '8', '9', '10', '11', '12']
