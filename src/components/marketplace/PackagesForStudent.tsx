'use client'

import { useState } from 'react'
import { PurchasePackageButton } from '@/components/marketplace/PurchasePackageButton'
import type { PackageItem } from '@/lib/marketplace/get-packages'
import type { GuardianStudent } from '@/lib/marketplace/get-guardian-students'
import { PIXEL_CARD, PIXEL_BUTTON_SECONDARY } from '@/lib/theme'

interface PackagesForStudentProps {
  packages: PackageItem[]
  students: GuardianStudent[]
}

export function PackagesForStudent({ packages, students }: PackagesForStudentProps) {
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(
    students.length === 1 ? students[0].studentId : null
  )

  if (students.length === 0) {
    return (
      <div className={`${PIXEL_CARD} p-4`}>
        <p className="font-semibold text-[#1B2430]">
          Paket satın alabilmen için önce &quot;Öğrenci Ekle&quot; ile bir öğrenci profili oluşturman gerekiyor.
        </p>
      </div>
    )
  }

  if (!selectedStudentId) {
    return (
      <div className="space-y-3">
        <p className="font-bold text-[#1B2430]">Hangi öğrenci için paket alıyorsun?</p>
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
    <div className="space-y-4">
      {students.length > 1 && (
        <p className="font-semibold text-[#1B2430]">
          <strong>{selectedStudent?.name}</strong> için paket alınıyor —{' '}
          <button onClick={() => setSelectedStudentId(null)} className="underline text-[#DD7B3A] font-bold">değiştir</button>
        </p>
      )}
      <div className="grid gap-4 sm:grid-cols-2">
        {packages.map((pkg) => (
          <div key={pkg.id} className={`${PIXEL_CARD} p-5 space-y-2`}>
            <p className="font-bold text-[#1B2430]">{pkg.title}</p>
            <p className="text-2xl font-bold text-[#1B2430]">{pkg.price.toLocaleString('tr-TR')} ₺</p>
            <p className="text-sm font-semibold text-[#6FA89E]">{pkg.creditAmount} ders kredisi</p>
            {pkg.description && <p className="text-sm font-semibold text-[#1B2430]/70">{pkg.description}</p>}
            <PurchasePackageButton packageId={pkg.id} studentId={selectedStudentId} />
          </div>
        ))}
      </div>
    </div>
  )
}
