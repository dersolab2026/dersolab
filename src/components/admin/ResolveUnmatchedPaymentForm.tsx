'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { resolveUnmatchedShopierPayment, dismissUnmatchedShopierPayment } from '@/actions/admin'
import type { StudentOption } from '@/lib/admin/get-unmatched-shopier-payments'

export function ResolveUnmatchedPaymentForm({
  paymentId,
  students,
  hasPackage,
}: {
  paymentId: string
  students: StudentOption[]
  hasPackage: boolean
}) {
  const router = useRouter()
  const [studentId, setStudentId] = useState<string>('')
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  function handleResolve() {
    if (!studentId) { setError('Bir öğrenci seç'); return }
    setError(null)
    startTransition(async () => {
      const result = await resolveUnmatchedShopierPayment(paymentId, studentId)
      if (!result.success) { setError(result.error); return }
      router.refresh()
    })
  }

  function handleDismiss() {
    setError(null)
    startTransition(async () => {
      const result = await dismissUnmatchedShopierPayment(paymentId)
      if (!result.success) { setError(result.error); return }
      router.refresh()
    })
  }

  return (
    <div className="space-y-2 pt-2 border-t">
      {hasPackage && (
        <>
          <Select value={studentId} onValueChange={setStudentId}>
            <SelectTrigger><SelectValue placeholder="Öğrenci seç" /></SelectTrigger>
            <SelectContent>
              {students.map((s) => (
                <SelectItem key={s.id} value={s.id}>{s.name} ({s.email})</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button size="sm" onClick={handleResolve} disabled={isPending} className="w-full gap-2">
            {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Öğrenciye Kredi Tanımla'}
          </Button>
        </>
      )}
      <Button size="sm" variant="ghost" onClick={handleDismiss} disabled={isPending} className="w-full">
        Yoksay
      </Button>
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  )
}
