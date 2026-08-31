'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import { updateSectionErrorTypes, type ExamResultEntry } from '@/actions/exam-results'
import { ERROR_TYPE_LABELS, type ErrorTypeCounts } from '@/lib/exams/error-types'
import { useToast } from '@/components/ui/Toast'
import { PIXEL_BUTTON_PRIMARY } from '@/lib/theme'

/**
 * Kaydedilmis bir denemenin yanlislarini tiplere bolme ekrani.
 *
 * Kayit formunda degil, kayittan sonra aciliyor: 7 derse 4'er kutu koymak
 * giris formunu 28 alanlik bir ise cevirirdi. Ogrenci denemeyi hizlica
 * kaydediyor, hata analizini deneme kagidi elindeyken sonradan yapiyor.
 * Tamamen istege bagli — bos birakilirsa hicbir sey degismiyor.
 */

const TIPLER: (keyof ErrorTypeCounts)[] = ['knowledge', 'careless', 'misread', 'timeout']

export function ErrorTypeEditor({ entry }: { entry: ExamResultEntry }) {
  const router = useRouter()
  const { showToast } = useToast()
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  const [degerler, setDegerler] = useState<Record<string, Record<string, string>>>(() => {
    const baslangic: Record<string, Record<string, string>> = {}
    for (const s of entry.sections) {
      baslangic[s.name] = {
        knowledge: s.errorTypes?.knowledge ? String(s.errorTypes.knowledge) : '',
        careless: s.errorTypes?.careless ? String(s.errorTypes.careless) : '',
        misread: s.errorTypes?.misread ? String(s.errorTypes.misread) : '',
        timeout: s.errorTypes?.timeout ? String(s.errorTypes.timeout) : '',
      }
    }
    return baslangic
  })

  const yanlisiOlanlar = entry.sections.filter((s) => s.wrongCount > 0)

  function setDeger(ders: string, tip: string, deger: string) {
    setDegerler((p) => ({ ...p, [ders]: { ...p[ders], [tip]: deger } }))
  }

  function kaydet() {
    setError(null)
    startTransition(async () => {
      const sonuc = await updateSectionErrorTypes(
        entry.id,
        yanlisiOlanlar.map((s) => ({
          name: s.name,
          errorTypes: {
            knowledge: Number(degerler[s.name]?.knowledge) || 0,
            careless: Number(degerler[s.name]?.careless) || 0,
            misread: Number(degerler[s.name]?.misread) || 0,
            timeout: Number(degerler[s.name]?.timeout) || 0,
          },
        })),
      )
      if (!sonuc.success) { setError(sonuc.error); return }
      showToast('Hata tipleri kaydedildi.')
      router.refresh()
    })
  }

  if (yanlisiOlanlar.length === 0) {
    return (
      <p className="text-sm font-semibold text-[#1B2430]/70">
        Bu denemede yanlışın yok, girilecek hata tipi de yok.
      </p>
    )
  }

  return (
    <div className="space-y-3">
      <p className="text-sm font-semibold text-[#1B2430]/70">
        Yanlışlarını tiplere böl — hangi dersten kaç net kaybettiğin değil,
        <strong> neden</strong> kaybettiğin önemli. İstersen boş bırakabilirsin.
      </p>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[520px] text-sm">
          <thead>
            <tr className="border-b-2 border-[#1B2430]">
              <th className="py-1.5 pr-2 text-left font-bold text-[#1B2430]">Ders</th>
              <th className="py-1.5 px-1 text-center font-bold text-[#1B2430]/70">Yanlış</th>
              {TIPLER.map((t) => (
                <th key={t} className="py-1.5 px-1 text-center text-xs font-bold text-[#1B2430]">
                  {ERROR_TYPE_LABELS[t]}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {yanlisiOlanlar.map((s) => {
              const girilen = TIPLER.reduce((t, tip) => t + (Number(degerler[s.name]?.[tip]) || 0), 0)
              const asim = girilen > s.wrongCount
              return (
                <tr key={s.name} className="border-b border-[#1B2430]/15">
                  <td className="py-1.5 pr-2 font-bold text-[#1B2430]">{s.name}</td>
                  <td className={`py-1.5 px-1 text-center font-bold tabular-nums ${asim ? 'text-red-600' : 'text-[#1B2430]/70'}`}>
                    {girilen}/{s.wrongCount}
                  </td>
                  {TIPLER.map((t) => (
                    <td key={t} className="py-1.5 px-1">
                      <input
                        type="number" min={0} max={s.wrongCount}
                        value={degerler[s.name]?.[t] ?? ''}
                        onChange={(e) => setDeger(s.name, t, e.target.value)}
                        aria-label={`${s.name} — ${ERROR_TYPE_LABELS[t]}`}
                        className="w-full min-w-[52px] rounded-lg border-2 border-[#1B2430] bg-white px-1.5 py-1 text-center font-bold text-[#1B2430]"
                      />
                    </td>
                  ))}
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {error && <p className="text-sm font-semibold text-red-600">{error}</p>}

      <button type="button" onClick={kaydet} disabled={isPending} className={`${PIXEL_BUTTON_PRIMARY} px-4 py-2 text-sm`}>
        {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Hata Tiplerini Kaydet'}
      </button>
    </div>
  )
}
