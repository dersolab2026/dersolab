'use client'

import { useState, useTransition } from 'react'
import { Loader2, Mail, Eye } from 'lucide-react'
import { haftalikRaporOnizle, haftalikRaporGonder } from '@/actions/weekly-report'
import type { HaftalikRapor } from '@/lib/coaching/build-weekly-report'
import { useToast } from '@/components/ui/Toast'
import { haftaninPazartesi, haftaninGunleri } from '@/lib/coaching/plan-progress'
import { PIXEL_CARD, PIXEL_BUTTON_PRIMARY, PIXEL_INPUT } from '@/lib/theme'

/**
 * Kocun tek dugmeyle haftalik ozet uretip ogrenciye gonderdigi panel.
 *
 * Once ONIZLEME, sonra gonderim: koc ne gonderdigini gormeden gondermemeli.
 * Rapor ogrenciye gidiyor, veliye degil — veli rolu urun karariyla
 * kaldirilmisti (0064).
 */

function tarihKisa(iso: string): string {
  const d = new Date(iso + 'T00:00:00Z')
  return `${d.getUTCDate()}.${d.getUTCMonth() + 1}`
}

export function WeeklyReportPanel({ studentId }: { studentId: string }) {
  const { showToast } = useToast()
  const [isPending, startTransition] = useTransition()
  const [hafta, setHafta] = useState(() => haftaninPazartesi(new Date()))
  const [yorum, setYorum] = useState('')
  const [rapor, setRapor] = useState<HaftalikRapor | null>(null)
  const [error, setError] = useState<string | null>(null)

  const gunler = haftaninGunleri(hafta)

  function haftaKaydir(yon: 1 | -1) {
    const d = new Date(hafta + 'T00:00:00Z')
    d.setUTCDate(d.getUTCDate() + 7 * yon)
    setHafta(d.toISOString().slice(0, 10))
    setRapor(null)
  }

  function onizle() {
    setError(null)
    startTransition(async () => {
      const s = await haftalikRaporOnizle(studentId, hafta, yorum)
      if (!s.success) { setError(s.error); return }
      setRapor(s.rapor)
    })
  }

  function gonder() {
    setError(null)
    startTransition(async () => {
      const s = await haftalikRaporGonder(studentId, hafta, yorum)
      if (!s.success) { setError(s.error); return }
      showToast('Rapor öğrenciye gönderildi.')
    })
  }

  return (
    <div className={`${PIXEL_CARD} space-y-3 p-5`}>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Mail className="h-5 w-5 text-[#1B2430]" />
          <p className="font-bold text-[#1B2430]">Haftalık Özet Raporu</p>
        </div>
        <div className="flex items-center gap-2">
          <button type="button" onClick={() => haftaKaydir(-1)} aria-label="Önceki hafta"
            className="rounded-lg border-2 border-[#1B2430] bg-white px-2 py-1 text-sm font-bold">‹</button>
          <span className="text-sm font-bold tabular-nums text-[#1B2430]">
            {tarihKisa(gunler[0])} – {tarihKisa(gunler[6])}
          </span>
          <button type="button" onClick={() => haftaKaydir(1)} aria-label="Sonraki hafta"
            className="rounded-lg border-2 border-[#1B2430] bg-white px-2 py-1 text-sm font-bold">›</button>
        </div>
      </div>

      <div>
        <label className="mb-1 block text-sm font-bold text-[#1B2430]">Kendi notun (isteğe bağlı)</label>
        <textarea value={yorum} onChange={(e) => { setYorum(e.target.value); setRapor(null) }} rows={3}
          placeholder="Bu hafta öğrenciye söylemek istediğin şey"
          className={`${PIXEL_INPUT} resize-y`} />
      </div>

      {error && <p className="text-sm font-semibold text-red-600">{error}</p>}

      <div className="flex flex-wrap gap-2">
        <button type="button" onClick={onizle} disabled={isPending}
          className="flex items-center gap-1.5 rounded-xl border-4 border-[#1B2430] bg-white px-4 py-2 text-sm font-bold text-[#1B2430]">
          {isPending && !rapor ? <Loader2 className="h-4 w-4 animate-spin" /> : <Eye className="h-4 w-4" />}
          Önizle
        </button>
        {rapor && (
          <button type="button" onClick={gonder} disabled={isPending} className={`${PIXEL_BUTTON_PRIMARY} px-4 py-2 text-sm`}>
            {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Öğrenciye Gönder'}
          </button>
        )}
      </div>

      {rapor && (
        <div className="space-y-2 rounded-xl border-4 border-[#1B2430] bg-white p-4">
          <p className="text-xs font-bold uppercase tracking-wide text-[#1B2430]/70">Önizleme</p>

          <div className="grid gap-2 sm:grid-cols-2">
            <Satir etiket="Plan tutturma" deger={
              rapor.planTutturmaYuzde !== null
                ? `%${rapor.planTutturmaYuzde} (${rapor.planSatirSayisi} satır)`
                : 'Plan girilmemiş'
            } />
            <Satir etiket="Çalışma" deger={`${Math.floor(rapor.toplamDakika / 60)} sa ${rapor.toplamDakika % 60} dk`} />
            <Satir etiket="Çözülen soru" deger={String(rapor.toplamSoru)} />
            <Satir etiket="Çalışılan gün" deger={`${rapor.calisilanGunSayisi}/7`} />
            <Satir etiket="Ödev" deger={
              `${rapor.odev.tamamlanan}/${rapor.odev.toplam}${rapor.odev.gecikmis > 0 ? ` · ${rapor.odev.gecikmis} gecikmiş` : ''}`
            } />
            <Satir etiket="Deneme" deger={
              rapor.denemeler.length > 0
                ? rapor.denemeler.map((d) => `${d.ad} ${d.net.toFixed(2)} net`).join(', ')
                : 'Yok'
            } />
          </div>

          <p className="text-xs font-semibold text-[#1B2430]/70">
            Rapor öğrencinin e-posta adresine gider. Veliye doğrudan gönderim yok;
            öğrenci dilerse iletir.
          </p>
        </div>
      )}
    </div>
  )
}

function Satir({ etiket, deger }: { etiket: string; deger: string }) {
  return (
    <div className="rounded-lg border-2 border-[#1B2430] bg-[#F4F1E8] px-3 py-1.5">
      <p className="text-xs font-bold uppercase tracking-wide text-[#1B2430]/70">{etiket}</p>
      <p className="text-sm font-bold text-[#1B2430]">{deger}</p>
    </div>
  )
}
