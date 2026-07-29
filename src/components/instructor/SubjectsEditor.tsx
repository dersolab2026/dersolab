'use client'

import { useState, useTransition } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'
import { updateInstructorSubjects } from '@/actions/instructor-profile'
import { LESSON_SUBJECTS } from '@/lib/constants'

interface SubjectsEditorProps {
  initialSubjects: string[]
}

export function SubjectsEditor({ initialSubjects }: SubjectsEditorProps) {
  const [selected, setSelected] = useState<string[]>(initialSubjects)
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  function toggle(subject: string) {
    setSelected((prev) => (prev.includes(subject) ? prev.filter((s) => s !== subject) : [...prev, subject]))
  }

  function handleSave() {
    setError(null)
    startTransition(async () => {
      const result = await updateInstructorSubjects(selected)
      if (!result.success) setError(result.error)
    })
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        {LESSON_SUBJECTS.map((subject) => (
          <Badge
            key={subject}
            variant={selected.includes(subject) ? 'default' : 'outline'}
            className="cursor-pointer"
            onClick={() => toggle(subject)}
          >
            {subject}
          </Badge>
        ))}
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}
      <Button size="sm" onClick={handleSave} disabled={isPending}>
        {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Kaydet'}
      </Button>
    </div>
  )
}
