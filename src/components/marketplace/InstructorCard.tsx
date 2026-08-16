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

function formatNextSlot(slot: Date): string {
  const bugun = new Date()
  const gunFarki = Math.floor(
    (new Date(slot.getFullYear(), slot.getMonth(), slot.getDate()).getTime() -
      new Date(bugun.getFullYear(), bugun.getMonth(), bugun.getDate()).getTime()) / 86400000,
  )
  const saat = slot.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })
  if (gunFarki === 0) return `Bugün ${saat}`
  if (gunFarki === 1) return `Yarın ${saat}`
  return `${slot.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long' })} ${saat}`
}

export function InstructorCard({ instructor, sessionTypeHint, nextSlot }: InstructorCardProps) {
  const initials = instructor.name.split(' ').map((p) => p[0]).slice(0, 2).join('').toUpperCase()
  const href = sessionTypeHint
    ? `/instructors/${instructor.userId}?tur=${sessionTypeHint}`
    : `/instructors/${instructor.userId}`

  return (
    <Link href={href}>
      <div className="h-full flex flex-col bg-[#F4F1E8] rounded-2xl p-5 border-4 border-[#1B2430] shadow-[0_6px_0_#1B2430] transition-all hover:-translate-y-0.5">
        <div className="flex items-center gap-3">
          <Avatar className="h-12 w-12 border-2 border-[#1B2430]">
            <AvatarImage src={instructor.avatarUrl ?? undefined} alt={instructor.name} />
            <AvatarFallback className="bg-white text-[#1B2430] font-bold">{initials}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-bold text-[#1B2430]">{instructor.name}</p>
            {instructor.completedLessonCount > 0 && (
              <span className="flex items-center gap-1 text-xs font-bold text-[#6FA89E]">
                <GraduationCap className="h-3.5 w-3.5" />
                {instructor.completedLessonCount} ders tamamladı
              </span>
            )}
          </div>
        </div>

        <div className="mt-3 space-y-2 flex-1">
          <div className="flex flex-wrap gap-1">
            {instructor.subjects.map((subject) => (
              <span key={subject} className="px-2 py-0.5 rounded-lg border-2 border-[#1B2430] bg-white text-[#1B2430] text-xs font-bold">
                {subject}
              </span>
            ))}
          </div>
          {instructor.bio && <p className="line-clamp-2 text-sm font-semibold text-[#1B2430]/70">{instructor.bio}</p>}
          {instructor.introVideoUrl && (
            <span className="flex items-center gap-1 text-xs font-bold text-[#1B2430]/70">
              <PlayCircle className="h-3.5 w-3.5" />
              Tanıtım videosu var
            </span>
          )}
        </div>

        {/* Takvimi bağlı olup ajanda saati girmemiş eğitmen de rezervasyon
            alamıyor; ilk müsait saat çıkmıyorsa "Yakında müsait" gösteriyoruz. */}
        {nextSlot ? (
          <span className="mt-3 inline-flex w-fit items-center gap-1.5 px-2 py-1 rounded-lg border-2 border-[#1B2430] bg-[#6FA89E] text-[#F4F1E8] text-xs font-bold">
            <CalendarClock className="h-3.5 w-3.5" />
            İlk müsait: {formatNextSlot(nextSlot)}
          </span>
        ) : (
          <span className="mt-3 inline-block w-fit px-2 py-0.5 rounded-lg border-2 border-[#1B2430] bg-white text-[#1B2430] text-xs font-bold">
            Yakında müsait
          </span>
        )}
      </div>
    </Link>
  )
}
