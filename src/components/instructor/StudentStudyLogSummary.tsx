import { BookOpen } from 'lucide-react'
import type { StudentStudyLog } from '@/lib/students/get-student-insight'
import { PIXEL_CARD } from '@/lib/theme'

/**
 * Ogrencinin gunlugu: once ders bazinda toplam (koc "neye ne kadar vakit
 * ayirmis" sorusuna bir bakista cevap alsin), sonra son kayitlarin dokumu.
 *
 * Bar genislikleri en cok calisilan derse gore oranlaniyor; mutlak bir tavan
 * (ornegin 10 saat) koymak az calisan ogrencide tum barlari gorunmez yapardi.
 */

interface Props {
  logs: StudentStudyLog[]
  dersToplamlari: { subject: string; saat: number; soru: number }[]
}

export function StudentStudyLogSummary({ logs, dersToplamlari }: Props) {
  if (logs.length === 0) {
    return (
      <div className={`${PIXEL_CARD} p-5`}>
        <p className="font-bold text-[var(--yazi)]">Çalışma Günlüğü</p>
        <p className="text-sm font-semibold text-[var(--yazi)]/70">
          Öğrenci henüz günlüğüne kayıt girmemiş.
        </p>
      </div>
    )
  }

  const enYuksek = Math.max(...dersToplamlari.map((d) => d.saat), 1)

  return (
    <div className={`${PIXEL_CARD} space-y-4 p-5`}>
      <div className="flex items-center gap-2">
        <BookOpen className="h-5 w-5 text-[var(--yazi)]" />
        <p className="font-bold text-[var(--yazi)]">Çalışma Günlüğü</p>
      </div>

      <div className="space-y-2">
        <p className="text-sm font-bold text-[var(--yazi)]/70">Derse göre toplam</p>
        {dersToplamlari.map((d) => (
          <div key={d.subject} className="flex items-center gap-3">
            <span className="w-36 shrink-0 truncate text-sm font-bold text-[var(--yazi)]" title={d.subject}>
              {d.subject}
            </span>
            <div className="h-5 flex-1 overflow-hidden rounded-md border-2 border-[var(--cizgi)] bg-[var(--yuzey-ic)]">
              <div
                className="h-full bg-[var(--ikincil-zemin)]"
                style={{ width: `${Math.max(4, Math.round((d.saat / enYuksek) * 100))}%` }}
              />
            </div>
            <span className="w-28 shrink-0 text-right text-sm font-bold tabular-nums text-[var(--yazi)]">
              {d.saat} sa
              {d.soru > 0 && <span className="text-[var(--yazi)]/60"> · {d.soru} soru</span>}
            </span>
          </div>
        ))}
      </div>

      <div className="space-y-1.5">
        <p className="text-sm font-bold text-[var(--yazi)]/70">Son kayıtlar</p>
        <div className="max-h-72 space-y-1.5 overflow-y-auto pr-1">
          {logs.slice(0, 40).map((l) => (
            <div
              key={l.id}
              className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5 rounded-lg border-2 border-[var(--cizgi)] bg-[var(--yuzey-ic)] px-3 py-1.5 text-sm"
            >
              <span className="font-bold tabular-nums text-[var(--yazi)]/60">
                {new Date(l.logDate).toLocaleDateString('tr-TR', { day: '2-digit', month: '2-digit' })}
              </span>
              <span className="font-bold text-[var(--yazi)]">{l.subject}</span>
              {l.topic && <span className="text-[var(--yazi)]/70">— {l.topic}</span>}
              <span className="ml-auto shrink-0 font-semibold tabular-nums text-[var(--yazi)]/70">
                {l.hours ? `${l.hours} sa` : ''}
                {l.hours && l.questionsSolved ? ' · ' : ''}
                {l.questionsSolved ? `${l.questionsSolved} soru` : ''}
              </span>
            </div>
          ))}
        </div>
        {logs.length > 40 && (
          <p className="text-xs font-semibold text-[var(--yazi)]/60">
            Son 40 kayıt gösteriliyor.
          </p>
        )}
      </div>
    </div>
  )
}
