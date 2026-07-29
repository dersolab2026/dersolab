'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Plus, X, Loader2 } from 'lucide-react'
import { addAvailabilityRule, removeAvailabilityRule } from '@/actions/availability'
import type { AvailabilityRule } from '@/types'

const DAY_NAMES: Record<number, string> = {
  0: 'Pazar', 1: 'Pazartesi', 2: 'Salı', 3: 'Çarşamba', 4: 'Perşembe', 5: 'Cuma', 6: 'Cumartesi',
}

const DISPLAY_ORDER = [1, 2, 3, 4, 5, 6, 0]

interface WeeklyScheduleEditorProps {
  initialRules: AvailabilityRule[]
}

export function WeeklyScheduleEditor({ initialRules }: WeeklyScheduleEditorProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [openDayForm, setOpenDayForm] = useState<number | null>(null)
  const [startTime, setStartTime] = useState('09:00')
  const [endTime, setEndTime] = useState('10:00')

  const rulesByDay = DISPLAY_ORDER.reduce<Record<number, AvailabilityRule[]>>((acc, day) => {
    acc[day] = initialRules.filter((rule) => rule.dayOfWeek === day)
    return acc
  }, {})

  function handleAdd(dayOfWeek: number) {
    setError(null)
    startTransition(async () => {
      const result = await addAvailabilityRule({ dayOfWeek, startTime, endTime })
      if (!result.success) {
        setError(result.error)
        return
      }
      setOpenDayForm(null)
      router.refresh()
    })
  }

  function handleRemove(ruleId: string) {
    setError(null)
    startTransition(async () => {
      const result = await removeAvailabilityRule(ruleId)
      if (!result.success) {
        setError(result.error)
        return
      }
      router.refresh()
    })
  }

  return (
    <div className="space-y-4">
      {error && <p className="text-sm text-destructive">{error}</p>}

      {DISPLAY_ORDER.map((day) => (
        <Card key={day}>
          <CardHeader className="flex flex-row items-center justify-between py-3">
            <CardTitle className="text-base">{DAY_NAMES[day]}</CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setOpenDayForm(openDayForm === day ? null : day)}
            >
              <Plus className="mr-1 h-4 w-4" />
              Saat Ekle
            </Button>
          </CardHeader>
          <CardContent className="flex flex-wrap items-center gap-2">
            {rulesByDay[day].length === 0 && openDayForm !== day && (
              <p className="text-sm text-muted-foreground">Bu gün için tanımlı saat yok</p>
            )}

            {rulesByDay[day].map((rule) => (
              <Badge key={rule.id} variant="secondary" className="gap-2 py-1.5">
                {rule.startTime} - {rule.endTime}
                <button
                  onClick={() => handleRemove(rule.id)}
                  disabled={isPending}
                  aria-label="Bu saat aralığını kaldır"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}

            {openDayForm === day && (
              <div className="flex items-center gap-2">
                <Input
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="w-28"
                />
                <span className="text-muted-foreground">-</span>
                <Input
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="w-28"
                />
                <Button size="sm" onClick={() => handleAdd(day)} disabled={isPending}>
                  {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Kaydet'}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
