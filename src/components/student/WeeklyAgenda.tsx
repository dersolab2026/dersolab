'use client'

import { useState } from 'react'
import Link from 'next/link'
import { PIXEL_CARD, PIXEL_BUTTON_SECONDARY } from '@/lib/theme'
import type { StudentBookingItem } from '@/lib/bookings/get-student-bookings'

const DAY_LABELS = ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz']

function startOfWeek(date: Date): Date {
  const d = new Date(date)
  const day = (d.getDay() + 6) % 7 // Pazartesi = 0
  d.setDate(d.getDate() - day)
  d.setHours(0, 0, 0, 0)
  return d
}

function addDays(date: Date, days: number): Date {
  const d = new Date(date)
  d.setDate(d.getDate() + days)
  return d
}

function isSameDay(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()
}

export function WeeklyAgenda({ bookings }: { bookings: StudentBookingItem[] }) {
  const [weekOffset, setWeekOffset] = useState(0)

  const today = new Date()
  const weekStart = addDays(startOfWeek(today), weekOffset * 7)
  const days = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i))

  const scheduled = bookings.filter((b) => b.status === 'scheduled')

  const rangeLabel = `${weekStart.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long' })} - ${addDays(weekStart, 6).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long' })}`

  return (
    <div className={`${PIXEL_CARD} p-5 space-y-4`}>
      <div className="flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={() => setWeekOffset((v) => v - 1)}
          className={`${PIXEL_BUTTON_SECONDARY} px-3 py-1.5 text-sm`}
          aria-label="Önceki hafta"
        >
          ←
        </button>
        <p className="font-bold text-[#1B2430] text-center">{rangeLabel}</p>
        <button
          type="button"
          onClick={() => setWeekOffset((v) => v + 1)}
          className={`${PIXEL_BUTTON_SECONDARY} px-3 py-1.5 text-sm`}
          aria-label="Sonraki hafta"
        >
          →
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
        {days.map((day, i) => {
          const dayBookings = scheduled
            .filter((b) => isSameDay(new Date(b.startTime), day))
            .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())
          const isToday = isSameDay(day, today)

          return (
            <div key={i} className="min-w-0">
              <div className={`text-center rounded-lg border-2 border-[#1B2430] py-1 mb-1.5 ${isToday ? 'bg-[#DD7B3A] text-[#F4F1E8]' : 'bg-white text-[#1B2430]'}`}>
                <p className="text-[10px] sm:text-xs font-bold">{DAY_LABELS[i]}</p>
                <p className="text-xs sm:text-sm font-black">{day.getDate()}</p>
              </div>
              <div className="space-y-1">
                {dayBookings.map((b) => (
                  <Link
                    key={b.id}
                    href="/dashboard/student/bookings"
                    className="block rounded-md bg-[#6FA89E]/20 border border-[#6FA89E] px-1 py-1 text-[9px] sm:text-[11px] font-bold text-[#1B2430] leading-tight"
                  >
                    {new Date(b.startTime).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}
                    <br />
                    <span className="font-semibold">{b.instructorName}</span>
                  </Link>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
