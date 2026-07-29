'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { PurchasePackageButton } from '@/components/marketplace/PurchasePackageButton'
import type { PackageItem } from '@/lib/marketplace/get-packages'
import type { GuardianStudent } from '@/lib/marketplace/get-guardian-students'

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
      <p className="rounded-md border border-dashed p-4 text-sm text-muted-foreground">
        Paket satın alabilmen için önce "Öğrenci Ekle" ile bir öğrenci profili oluşturman gerekiyor.
      </p>
    )
  }

  if (!selectedStudentId) {
    return (
      <div className="space-y-3">
        <p className="text-sm font-medium">Hangi öğrenci için paket alıyorsun?</p>
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
    <div className="space-y-4">
      {students.length > 1 && (
        <p className="text-sm text-muted-foreground">
          <strong>{selectedStudent?.name}</strong> için paket alınıyor —{' '}
          <button onClick={() => setSelectedStudentId(null)} className="underline">değiştir</button>
        </p>
      )}
      <div className="grid gap-4 sm:grid-cols-2">
        {packages.map((pkg) => (
          <Card key={pkg.id}>
            <CardHeader>
              <CardTitle>{pkg.title}</CardTitle>
              <p className="text-2xl font-semibold">{pkg.price.toLocaleString('tr-TR')} ₺</p>
              <p className="text-sm text-muted-foreground">{pkg.creditAmount} ders kredisi</p>
            </CardHeader>
            <CardContent className="space-y-3">
              {pkg.description && <p className="text-sm text-muted-foreground">{pkg.description}</p>}
              <PurchasePackageButton packageId={pkg.id} studentId={selectedStudentId} />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}