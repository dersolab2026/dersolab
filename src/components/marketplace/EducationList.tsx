import { GraduationCap } from 'lucide-react'
import type { EducationEntry } from '@/types'

interface EducationListProps {
  entries: EducationEntry[]
}

export function EducationList({ entries }: EducationListProps) {
  if (entries.length === 0) return null

  return (
    <div className="space-y-2">
      <h2 className="flex items-center gap-2 font-bold text-[var(--yazi)]">
        <GraduationCap className="h-4 w-4" />
        Eğitim
      </h2>
      <ul className="space-y-1">
        {entries.map((entry) => (
          <li key={entry.id} className="text-sm font-semibold text-[var(--yazi)]/70">
            <span className="text-[var(--yazi)]">{entry.institution}</span>
            {[entry.degree, entry.fieldOfStudy].filter(Boolean).length > 0 &&
              ` — ${[entry.degree, entry.fieldOfStudy].filter(Boolean).join(', ')}`}
            {entry.startYear && ` (${entry.startYear}${entry.endYear ? `–${entry.endYear}` : ''})`}
          </li>
        ))}
      </ul>
    </div>
  )
}
