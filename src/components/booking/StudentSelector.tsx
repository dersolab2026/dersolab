'use client'

import { useState } from 'react'
import { InstructorBookingSection } from '@/components/booking/InstructorBookingSection'
import type { GuardianStudent } from '@/lib/marketplace/get-guardian-students'
import { PIXEL_CARD, PIXEL_BUTTON_SECONDARY } from '@/lib/theme'

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
      <div className={`${PIXEL_CARD} p-4`}>
        <p className="font-semibold text-[#1B2430]">Rezervasyon yapabilmen için önce bir öğrenci profili eklemen gerekiyor.</p>
      </div>
    )
  }

  if (!selectedStudentId) {
    return (
      <div className="space-y-3">
        <p className="font-bold text-[#1B2430]">Hangi öğrenci için rezervasyon yapıyorsun?</p>
        <div className="flex flex-wrap gap-2">
          {students.map((student) => (
            <button
              key={student.studentId}
              type="button"
              onClick={() => setSelectedStudentId(student.studentId)}
              className={`${PIXEL_BUTTON_SECONDARY} px-4 py-2 text-sm`}
            >
              {student.name}
            </button>
          ))}
        </div>
      </div>
    )
  }

  const selectedStudent = students.find((s) => s.studentId === selectedStudentId)

  return (
    <div className="space-y-3">
      {students.length > 1 && (
        <p className="font-semibold text-[#1B2430]">
          <strong>{selectedStudent?.name}</strong> için rezervasyon yapılıyor —{' '}
          <button onClick={() => setSelectedStudentId(null)} className="underline text-[#DD7B3A] font-bold">değiştir</button>
        </p>
      )}
      <InstructorBookingSection
        instructorId={instructorId}
        studentId={selectedStudentId}
        trialEligible={!(selectedStudent?.freeTrialUsed ?? true)}
      />
    </div>
  )
}
