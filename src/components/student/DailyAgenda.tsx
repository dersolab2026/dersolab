'use client'

import { useState } from 'react'
import Link from 'next/link'
import { PIXEL_CARD, PIXEL_BUTTON_SECONDARY } from '@/lib/theme'
import type { StudentBookingItem } from '@/lib/bookings/get-student-bookings'
import type { StudyLogEntry } from '@/actions/study-log'
import { StudyLogSection } from '@/components/student/StudyLogSection'

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

function toDateKey(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function DailyAgenda({ bookings, studyLogs }: { bookings: StudentBookingItem[]; studyLogs: StudyLogEntry[] }) {
  const today = new Date()
  const [weekOffset, setWeekOffset] = useState(0)
  const [selectedDay, setSelectedDay] = useState(today)

  const weekStart = addDays(startOfWeek(today), weekOffset * 7)
  const days = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i))

  const scheduled = bookings.filter((b) => b.status === 'scheduled')
  const dayBookings = scheduled
    .filter((b) => isSameDay(new Date(b.startTime), selectedDay))
    .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())

  const selectedDayKey = toDateKey(selectedDay)
  const dayStudyLogs = studyLogs.filter((entry) => entry.logDate === selectedDayKey)

  const rangeLabel = `${weekStart.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long' })} - ${addDays(weekStart, 6).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long' })}`

  function goToWeek(offset: number) {
    setWeekOffset(offset)
    setSelectedDay(addDays(startOfWeek(today), offset * 7))
  }

  return (
    <div className={`${PIXEL_CARD} p-5 space-y-4`}>
      <div className="flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={() => goToWeek(weekOffset - 1)}
          className={`${PIXEL_BUTTON_SECONDARY} px-3 py-1.5 text-sm`}
          aria-label="Önceki hafta"
        >
          ←
        </button>
        <p className="font-bold text-slate-200 text-center">{rangeLabel}</p>
        <button
          type="button"
          onClick={() => goToWeek(weekOffset + 1)}
          className={`${PIXEL_BUTTON_SECONDARY} px-3 py-1.5 text-sm`}
          aria-label="Sonraki hafta"
        >
          →
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
        {days.map((day, i) => {
          const isSelected = isSameDay(day, selectedDay)
          const isToday = isSameDay(day, today)
          const hasLesson = scheduled.some((b) => isSameDay(new Date(b.startTime), day))
          const hasStudyLog = studyLogs.some((entry) => entry.logDate === toDateKey(day))

          return (
            <button
              key={i}
              type="button"
              onClick={() => setSelectedDay(day)}
              className={`relative text-center rounded-lg border border-white/5 py-2 transition-all ${
                isSelected ? 'bg-[#DD7B3A] text-[#F4F1E8]' : isToday ? 'bg-[#6FA89E]/20 text-slate-200' : 'bg-white/5 text-slate-200'
              }`}
            >
              <p className="text-[10px] sm:text-xs font-bold">{DAY_LABELS[i]}</p>
              <p className="text-xs sm:text-sm font-black">{day.getDate()}</p>
              {(hasLesson || hasStudyLog) && (
                <span className="absolute bottom-1 left-1/2 -translate-x-1/2 flex gap-0.5">
                  {hasLesson && <span className={`h-1.5 w-1.5 rounded-full ${isSelected ? 'bg-white/[0.02]' : 'bg-[#DD7B3A]'}`} />}
                  {hasStudyLog && <span className={`h-1.5 w-1.5 rounded-full ${isSelected ? 'bg-white/[0.02]' : 'bg-[#6FA89E]'}`} />}
                </span>
              )}
            </button>
          )
        })}
      </div>

      <div className="pt-2 border-t border-white/10 space-y-2">
        <p className="font-bold text-slate-200">
          {selectedDay.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', weekday: 'long' })}
        </p>
        {dayBookings.length === 0 ? (
          <p className="text-sm font-semibold text-slate-400">Bu tarihte ders bulunamadı.</p>
        ) : (
          <div className="space-y-2">
            {dayBookings.map((b) => (
              <Link
                key={b.id}
                href="/dashboard/student/bookings"
                className="flex items-center justify-between rounded-lg bg-[#6FA89E]/20 border-2 border-[#6FA89E] px-3 py-2"
              >
                <span className="font-bold text-slate-200 text-sm">{b.instructorName}</span>
                <span className="font-bold text-slate-200 text-sm">
                  {new Date(b.startTime).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>

      <StudyLogSection logDate={selectedDayKey} entries={dayStudyLogs} />
    </div>
  )
}
