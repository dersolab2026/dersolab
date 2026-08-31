import { CheckCircle2, Clock, AlertTriangle } from 'lucide-react'
import type { StudentHomework } from '@/lib/students/get-student-insight'
import { PIXEL_CARD } from '@/lib/theme'

/**
 * Ogrencinin odev durumu. Amac tek bakista "hangisini yapti, hangisini
 * yapmadi" sorusunu cevaplamak; bu yuzden durum hem ikonla hem renkle
 * kodlaniyor, yalnizca metinle degil.
 */

const DURUM: Record<string, { etiket: string; renk: string; arka: string }> = {
  completed: { etiket: 'Tamamlandı', renk: 'text-[#F4F1E8]', arka: 'bg-[#6FA89E]' },
  submitted: { etiket: 'Teslim edildi', renk: 'text-[#1B2430]', arka: 'bg-[#E8C468]' },
  assigned: { etiket: 'Bekliyor', renk: 'text-[#1B2430]', arka: 'bg-white' },
}

function gecikmisMi(h: StudentHomework): boolean {
  if (!h.dueDate || h.status === 'completed') return false
  return h.dueDate < new Date().toISOString().slice(0, 10)
}

export function StudentHomeworkSummary({ items }: { items: StudentHomework[] }) {
  if (items.length === 0) {
    return (
      <div className={`${PIXEL_CARD} p-5`}>
        <p className="font-bold text-[#1B2430]">Ödevler</p>
        <p className="text-sm font-semibold text-[#1B2430]/70">
          Bu öğrenciye henüz ödev verilmemiş.
        </p>
      </div>
    )
  }

  const tamamlanan = items.filter((h) => h.status === 'completed').length
  const gecikmis = items.filter(gecikmisMi).length

  return (
    <div className={`${PIXEL_CARD} space-y-3 p-5`}>
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <p className="font-bold text-[#1B2430]">Ödevler</p>
        <p className="text-sm font-bold text-[#1B2430]/70">
          {tamamlanan}/{items.length} tamamlandı
          {gecikmis > 0 && (
            <span className="ml-2 text-[#C2410C]">· {gecikmis} gecikmiş</span>
          )}
        </p>
      </div>

      <div className="space-y-2">
        {items.map((h) => {
          const d = DURUM[h.status] ?? DURUM.assigned
          const gecikti = gecikmisMi(h)
          return (
            <div
              key={h.id}
              className="flex flex-wrap items-center justify-between gap-2 rounded-xl border-2 border-[#1B2430] bg-white px-3 py-2"
            >
              <div className="flex min-w-0 items-center gap-2">
                {h.status === 'completed' ? (
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-[#3F6E66]" />
                ) : gecikti ? (
                  <AlertTriangle className="h-4 w-4 shrink-0 text-[#C2410C]" />
                ) : (
                  <Clock className="h-4 w-4 shrink-0 text-[#1B2430]/70" />
                )}
                <span className="truncate text-sm font-bold text-[#1B2430]">{h.title}</span>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                {h.dueDate && (
                  <span className={`text-xs font-semibold ${gecikti ? 'text-[#C2410C]' : 'text-[#1B2430]/70'}`}>
                    {new Date(h.dueDate).toLocaleDateString('tr-TR')}
                  </span>
                )}
                {h.teslimSayisi > 0 && (
                  <span className="text-xs font-semibold text-[#1B2430]/70">
                    {h.teslimSayisi} dosya
                  </span>
                )}
                <span
                  className={`rounded-lg border-2 border-[#1B2430] px-2 py-0.5 text-xs font-bold ${d.arka} ${d.renk}`}
                >
                  {d.etiket}
                </span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
