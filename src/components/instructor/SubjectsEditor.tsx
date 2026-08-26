'use client'

import { useState, useTransition } from 'react'
import { Loader2 } from 'lucide-react'
import { updateInstructorSubjects } from '@/actions/instructor-profile'
import { useToast } from '@/components/ui/Toast'
import { INSTRUCTOR_SUBJECT_OPTIONS } from '@/lib/constants'
import { PIXEL_BADGE, PIXEL_BADGE_ACTIVE, PIXEL_BUTTON_PRIMARY } from '@/lib/theme'

interface SubjectsEditorProps {
  initialSubjects: string[]
}

export function SubjectsEditor({ initialSubjects }: SubjectsEditorProps) {
  const [selected, setSelected] = useState<string[]>(initialSubjects)
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const { showToast } = useToast()

  function toggle(subject: string) {
    setSelected((prev) => (prev.includes(subject) ? prev.filter((s) => s !== subject) : [...prev, subject]))
  }

  function handleSave() {
    setError(null)
    startTransition(async () => {
      const result = await updateInstructorSubjects(selected)
      if (!result.success) { setError(result.error); return }
      showToast('Branşların kaydedildi.')
    })
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        {INSTRUCTOR_SUBJECT_OPTIONS.map((subject) => (
          <button
            key={subject}
            type="button"
            onClick={() => toggle(subject)}
            className={`${selected.includes(subject) ? PIXEL_BADGE_ACTIVE : PIXEL_BADGE} cursor-pointer px-3 py-1`}
          >
            {subject}
          </button>
        ))}
      </div>
      {error && <p className="text-sm font-semibold text-[var(--tehlike)]">{error}</p>}
      <button type="button" onClick={handleSave} disabled={isPending} className={`${PIXEL_BUTTON_PRIMARY} px-4 py-1.5 text-sm`}>
        {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Kaydet'}
      </button>
    </div>
  )
}
