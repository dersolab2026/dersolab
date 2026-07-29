'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { InstructorBookingSection } from '@/components/booking/InstructorBookingSection'
import type { GuardianStudent } from '@/lib/marketplace/get-guardian-students'

interface StudentSelectorProps {
  instructorId: string
  students: GuardianStudent[]
}

export function StudentSelector({ instructorId, students }: StudentSelectorProps) {
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(
    students.length === 1 ? students[0].studentId : null
  )

  if (students.length === 0) {
    return (
      <p className="rounded-md border border-dashed p-4 text-sm text-muted-foreground">
        Rezervasyon yapabilmen için önce bir öğrenci profili eklemen gerekiyor.
      </p>
    )
  }

  if (!selectedStudentId) {
    return (
      <div className="space-y-3">
        <p className="text-sm font-medium">Hangi öğrenci için rezervasyon yapıyorsun?</p>
        <div className="flex flex-wrap gap-2">
          {students.map((student) => (
            <Button key={student.studentId} variant="outline" onClick={() => setSelectedStudentId(student.studentId)}>
              {student.name}
            </Button>
          ))}
        </div>
      </div>
    )
  }

  const selectedStudent = students.find((s) => s.studentId === selectedStudentId)

  return (
    <div className="space-y-3">
      {students.length > 1 && (
        <p className="text-sm text-muted-foreground">
          <strong>{selectedStudent?.name}</strong> için rezervasyon yapılıyor —{' '}
          <button onClick={() => setSelectedStudentId(null)} className="underline">değiştir</button>
        </p>
      )}
      <InstructorBookingSection instructorId={instructorId} studentId={selectedStudentId} />
    </div>
  )
}
