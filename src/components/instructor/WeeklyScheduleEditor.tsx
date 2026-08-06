'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, X, Loader2 } from 'lucide-react'
import { addAvailabilityRule, removeAvailabilityRule } from '@/actions/availability'
import type { AvailabilityRule } from '@/types'
import { PIXEL_CARD, PIXEL_BADGE, PIXEL_BUTTON_PRIMARY, PIXEL_BUTTON_SECONDARY, PIXEL_INPUT } from '@/lib/theme'

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
      {error && <p className="text-sm font-semibold text-red-600">{error}</p>}

      {DISPLAY_ORDER.map((day) => (
        <div key={day} className={`${PIXEL_CARD} p-4 space-y-3`}>
          <div className="flex items-center justify-between">
            <p className="font-bold text-[#1B2430]">{DAY_NAMES[day]}</p>
            <button
              type="button"
              onClick={() => setOpenDayForm(openDayForm === day ? null : day)}
              className={`${PIXEL_BUTTON_SECONDARY} gap-1 px-3 py-1 text-xs`}
            >
              <Plus className="h-3.5 w-3.5" />
              Saat Ekle
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {rulesByDay[day].length === 0 && openDayForm !== day && (
              <p className="text-sm font-semibold text-[#1B2430]/60">Bu gün için tanımlı saat yok</p>
            )}

            {rulesByDay[day].map((rule) => (
              <span key={rule.id} className={`${PIXEL_BADGE} gap-2 py-1.5 flex items-center`}>
                {rule.startTime} - {rule.endTime}
                <button
                  onClick={() => handleRemove(rule.id)}
                  disabled={isPending}
                  aria-label="Bu saat aralığını kaldır"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
          </div>

          {openDayForm === day && (
            <div className="flex flex-wrap items-center gap-2">
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className={`${PIXEL_INPUT} w-32 py-1.5`}
              />
              <span className="font-bold text-[#1B2430]">-</span>
              <input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className={`${PIXEL_INPUT} w-32 py-1.5`}
              />
              <button
                type="button"
                onClick={() => handleAdd(day)}
                disabled={isPending}
                className={`${PIXEL_BUTTON_PRIMARY} px-3 py-1.5 text-sm`}
              >
                {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Kaydet'}
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
