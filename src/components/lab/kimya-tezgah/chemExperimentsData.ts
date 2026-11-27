import { CHEM_EXPERIMENTS_PART_1 } from './chemDataPart1'
import { CHEM_EXPERIMENTS_PART_2 } from './chemDataPart2'
import {
  CHEM_CATEGORY_LABELS,
  CHEM_LAB_ITEMS,
  type ChemExperiment,
  type ChemExperimentStep,
  type ChemGradeKey,
  type ChemItemCategory,
  type ChemLabItem,
  type VisualPreset,
} from './chemTypesAndItems'

export type {
  ChemExperiment,
  ChemExperimentStep,
  ChemGradeKey,
  ChemItemCategory,
  ChemLabItem,
  VisualPreset,
}

export { CHEM_CATEGORY_LABELS, CHEM_LAB_ITEMS }

export const CHEM_EXPERIMENTS: ChemExperiment[] = [
  ...CHEM_EXPERIMENTS_PART_1,
  ...CHEM_EXPERIMENTS_PART_2,
]

export const CHEM_GRADE_FILTERS: {
  key: 'all' | ChemGradeKey | 'sandbox'
  label: string
  countLabel: string
}[] = [
  { key: 'all', label: 'Tümü', countLabel: '59' },
  { key: 'gosteriler', label: '🔥 Yeni: Gösteriler', countLabel: '8' },
  { key: '9', label: '9. Sınıf (Maarif)', countLabel: '15' },
  { key: '10', label: '10. Sınıf (Maarif)', countLabel: '12' },
  { key: '11', label: '11. Sınıf (Maarif)', countLabel: '14' },
  { key: '12', label: '12. Sınıf (Maarif)', countLabel: '10' },
  { key: 'sandbox', label: '🧪 Serbest Çalışma', countLabel: '∞' },
]

export function encodeAssignmentCode(expNumber: number): string {
  const safeNum = Math.min(Math.max(expNumber, 1), 99)
  return `D${String(safeNum).padStart(2, '0')}KLP`
}

export function decodeAssignmentCode(rawCode: string): ChemExperiment | null {
  const cleaned = rawCode.trim().toUpperCase().replace(/[^A-Z0-9]/g, '')
  const match = cleaned.match(/^[DF](\d{2})/)
  if (match) {
    const num = Number(match[1])
    return CHEM_EXPERIMENTS.find((e) => e.number === num) || null
  }
  const bySlug = CHEM_EXPERIMENTS.find((e) => e.id.toUpperCase().startsWith(cleaned))
  return bySlug || null
}
