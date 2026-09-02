import Link from 'next/link'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { PlayCircle, GraduationCap, CalendarClock } from 'lucide-react'
import type { InstructorProfile } from '@/types'

interface InstructorCardProps {
  instructor: InstructorProfile
  /** Koçluk sayfasından gelindiğinde rezervasyonda koçluk türü ön seçili gelsin. */
  sessionTypeHint?: 'kocluk'
  /** Ajandaya göre ilk müsait ders saati; "Yakında müsait" yerine bunu gösteriyoruz. */
  nextSlot?: Date
}

const ISTANBUL = 'Europe/Istanbul'

/**
 * Bir anin Istanbul takvimindeki gunu (YYYY-MM-DD).
 *
 * en-CA yerel ayari tam bu bicimi veriyor, elle parcalamaya gerek yok.
 */
function istanbulGunu(an: Date): string {
  return an.toLocaleDateString('en-CA', { timeZone: ISTANBUL })
}

/**
 * Ilk musait saati kart uzerinde gosterir.
 *
 * SAAT DILIMI ACIKCA VERILMELI: bu bir sunucu bileseni ve uretimde sunucu
 * UTC'de calisiyor. timeZone verilmezse Istanbul'daki 09:00 kartta 06:00
 * gorunuyor; ayni sebeple "Bugun/Yarin" hesabi da gece yarisi civarinda
 * yanlis gune kayiyor. Hem saat hem gun karsilastirmasi Istanbul takvimi
 * uzerinden yapiliyor.
 */
function formatNextSlot(slot: Date): string {
  const saat = slot.toLocaleTimeString('tr-TR', {
    timeZone: ISTANBUL, hour: '2-digit', minute: '2-digit',
  })

  const gunFarki = Math.round(
    (Date.parse(`${istanbulGunu(slot)}T00:00:00Z`) -
      Date.parse(`${istanbulGunu(new Date())}T00:00:00Z`)) / 86_400_000,
  )

  if (gunFarki === 0) return `Bugün ${saat}`
  if (gunFarki === 1) return `Yarın ${saat}`
  return `${slot.toLocaleDateString('tr-TR', {
    timeZone: ISTANBUL, day: 'numeric', month: 'long',
  })} ${saat}`
}

export function InstructorCard({ instructor, sessionTypeHint, nextSlot }: InstructorCardProps) {
  const initials = instructor.name.split(' ').map((p) => p[0]).slice(0, 2).join('').toUpperCase()
  const href = sessionTypeHint
    ? `/instructors/${instructor.userId}?tur=${sessionTypeHint}`
    : `/instructors/${instructor.userId}`

  return (
    <Link href={href}>
      <div className="h-full flex flex-col bg-white/[0.02] rounded-2xl p-5 border border-white/10 shadow-[0_0_20px_rgba(0,0,0,0.5)] transition-all hover:-translate-y-0.5">
        <div className="flex items-center gap-3">
          <Avatar className="h-12 w-12 border border-white/5">
            <AvatarImage src={instructor.avatarUrl ?? undefined} alt={instructor.name} />
            <AvatarFallback className="bg-white/5 text-slate-200 font-bold">{initials}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-bold text-slate-200">{instructor.name}</p>
            {instructor.completedLessonCount > 0 && (
              <span className="flex items-center gap-1 text-xs font-bold text-[#3F6E66]">
                <GraduationCap className="h-3.5 w-3.5" />
                {instructor.completedLessonCount} ders tamamladı
              </span>
            )}
          </div>
        </div>

        <div className="mt-3 space-y-2 flex-1">
          <div className="flex flex-wrap gap-1">
            {instructor.subjects.map((subject) => (
              <span key={subject} className="px-2 py-0.5 rounded-lg border border-white/5 bg-white/5 text-slate-200 text-xs font-bold">
                {subject}
              </span>
            ))}
          </div>
          {instructor.bio && <p className="line-clamp-2 text-sm font-semibold text-slate-400">{instructor.bio}</p>}
          {instructor.introVideoUrl && (
            <span className="flex items-center gap-1 text-xs font-bold text-slate-400">
              <PlayCircle className="h-3.5 w-3.5" />
              Tanıtım videosu var
            </span>
          )}
        </div>

        {/* Alt bilgi ve buton */}
        <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between gap-2">
          {nextSlot ? (
            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg border border-white/5 bg-[#6FA89E] text-[#F4F1E8] text-[11px] font-bold shrink-0">
              <CalendarClock className="h-3 w-3 shrink-0" />
              <span>{formatNextSlot(nextSlot)}</span>
            </span>
          ) : (
            <span className="inline-block px-2 py-0.5 rounded-lg border border-white/5 bg-white/5 text-slate-200 text-[11px] font-bold shrink-0">
              Yakında müsait
            </span>
          )}
          <span className="text-xs font-black text-[#DD7B3A] group-hover:underline">
            Profili İncele →
          </span>
        </div>
      </div>
    </Link>
  )
}
