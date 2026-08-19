'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, Target, Search, X } from 'lucide-react'
import { searchPrograms, setTargetProgram, setTargetNets, type ProgramOzet } from '@/actions/targets'
import { useToast } from '@/components/ui/Toast'
import type { MyTargets } from '@/lib/students/get-my-targets'
import { EXAM_TYPE_LABELS, type ExamType } from '@/lib/exams/scoring'
import { getExamSections, requiresTrack, TRACK_LABELS, type ExamTrack } from '@/lib/exams/structure'
import { toplamHedefNet } from '@/lib/exams/targets'
import { PIXEL_CARD, PIXEL_BUTTON_PRIMARY, PIXEL_INPUT } from '@/lib/theme'

/**
 * Hedef paneli: hedef program, hedef sinav tarihi ve ders bazli hedef netler.
 *
 * Hedef netleri toplami, deneme grafigindeki hedef cizgisini belirliyor.
 * Program secimi ise ayri bir karsilastirma: tahmini yerlestirme puani ile
 * programin taban puani yan yana gosteriliyor. Sira <-> net donusumu
 * YAPILMIYOR; o donusum ÖSYM'nin dagilimina bagli ve disaridan
 * hesaplanamaz, uydurmak yerine iki sayiyi yan yana koyuyoruz.
 */

interface Props {
  targets: MyTargets
  /** Ogrencinin en cok kullandigi sinav turu; hedef netler bunun uzerinden. */
  examType: ExamType
  track: ExamTrack | null
  /** Salt okunur mod: kocun ogrenci detayinda gordugu hal. */
  readOnly?: boolean
}

export function TargetPanel({ targets, examType, track, readOnly = false }: Props) {
  const router = useRouter()
  const { showToast } = useToast()
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  const [aramaAcik, setAramaAcik] = useState(false)
  const [sorgu, setSorgu] = useState('')
  const [sonuclar, setSonuclar] = useState<ProgramOzet[]>([])
  const [araniyor, setAraniyor] = useState(false)

  const [sinavTarihi, setSinavTarihi] = useState(targets.targetExamDate ?? '')
  const [netAcik, setNetAcik] = useState(false)

  const dersler = getExamSections(examType, track)
  const mevcutHedefler = targets.nets.filter(
    (n) => n.examType === examType && (n.track ?? null) === track,
  )
  const [hedefNetler, setHedefNetler] = useState<Record<string, string>>(() =>
    Object.fromEntries(dersler.map((d) => {
      const v = mevcutHedefler.find((h) => h.sectionName === d.name)
      return [d.name, v ? String(v.targetNet) : '']
    })),
  )

  const toplam = toplamHedefNet(
    dersler.map((d) => ({ targetNet: Number(hedefNetler[d.name]) || 0 })).filter((x) => x.targetNet > 0),
  )

  function ara() {
    setAraniyor(true)
    startTransition(async () => {
      const r = await searchPrograms(sorgu)
      setSonuclar(r)
      setAraniyor(false)
    })
  }

  function programSec(kod: number | null) {
    startTransition(async () => {
      const s = await setTargetProgram(kod, targets.targetRank, sinavTarihi || null)
      if (!s.success) { setError(s.error); return }
      setAramaAcik(false); setSorgu(''); setSonuclar([])
      showToast(kod ? 'Hedef program kaydedildi.' : 'Hedef program kaldırıldı.')
      router.refresh()
    })
  }

  function tarihKaydet() {
    startTransition(async () => {
      const s = await setTargetProgram(targets.targetProgramCode, targets.targetRank, sinavTarihi || null)
      if (!s.success) { setError(s.error); return }
      showToast('Sınav tarihi kaydedildi.')
      router.refresh()
    })
  }

  function netleriKaydet() {
    setError(null)
    startTransition(async () => {
      const s = await setTargetNets({
        examType, track,
        sections: dersler.map((d) => ({ name: d.name, targetNet: Number(hedefNetler[d.name]) || 0 })),
      })
      if (!s.success) { setError(s.error); return }
      showToast('Hedef netler kaydedildi.')
      setNetAcik(false)
      router.refresh()
    })
  }

  return (
    <div className={`${PIXEL_CARD} space-y-4 p-5`}>
      <div className="flex items-center gap-2">
        <Target className="h-5 w-5 text-[#1B2430]" />
        <p className="font-bold text-[#1B2430]">Hedefin</p>
      </div>

      {/* Hedef program */}
      {targets.program ? (
        <div className="rounded-xl border-4 border-[#1B2430] bg-white p-4">
          <p className="font-bold text-[#1B2430]">{targets.program.birimAdi}</p>
          <p className="text-sm font-semibold text-[#1B2430]/70">
            {targets.program.universiteAdi}
            {targets.program.ilAdi ? ` · ${targets.program.ilAdi}` : ''}
            {targets.program.ogrenimTuruAdi ? ` · ${targets.program.ogrenimTuruAdi}` : ''}
          </p>
          <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm font-bold tabular-nums text-[#1B2430]">
            {targets.program.puanTuru && <span>Puan türü: {targets.program.puanTuru}</span>}
            {targets.program.minPuan !== null && <span>Taban puan: {targets.program.minPuan.toFixed(2)}</span>}
            {targets.program.basariSirasi !== null && (
              <span>Başarı sırası: {targets.program.basariSirasi.toLocaleString('tr-TR')}</span>
            )}
          </div>
          {!readOnly && (
            <button type="button" onClick={() => programSec(null)} disabled={isPending}
              className="mt-2 text-xs font-bold text-[#1B2430]/50 hover:text-red-600">
              Hedefi kaldır
            </button>
          )}
        </div>
      ) : targets.targetProgramCode ? (
        <p className="text-sm font-semibold text-[#DD7B3A]">
          Seçtiğin program güncel kılavuzda bulunamadı — yeniden seçmen gerekiyor.
        </p>
      ) : (
        !readOnly && (
          <button type="button" onClick={() => setAramaAcik(true)}
            className={`${PIXEL_BUTTON_PRIMARY} px-4 py-2 text-sm`}>
            Hedef Program Seç
          </button>
        )
      )}

      {aramaAcik && !readOnly && (
        <div className="space-y-2 rounded-xl border-4 border-[#1B2430] bg-white p-4">
          <div className="flex gap-2">
            <input
              value={sorgu}
              onChange={(e) => setSorgu(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); ara() } }}
              placeholder="Bölüm ya da üniversite adı (en az 3 harf)"
              className={PIXEL_INPUT}
            />
            <button type="button" onClick={ara} disabled={isPending || sorgu.trim().length < 3}
              aria-label="Ara"
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border-4 border-[#1B2430] bg-[#DD7B3A] text-[#F4F1E8]">
              {araniyor ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
            </button>
            <button type="button" onClick={() => { setAramaAcik(false); setSonuclar([]) }} aria-label="Kapat"
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border-4 border-[#1B2430] bg-white">
              <X className="h-4 w-4" />
            </button>
          </div>

          {sonuclar.length > 0 && (
            <div className="max-h-72 space-y-1.5 overflow-y-auto pr-1">
              {sonuclar.map((p) => (
                <button key={p.kilavuzKodu} type="button" onClick={() => programSec(p.kilavuzKodu)}
                  className="w-full rounded-lg border-2 border-[#1B2430] bg-white p-2 text-left transition-colors hover:bg-[#F4F1E8]">
                  <p className="text-sm font-bold text-[#1B2430]">{p.birimAdi}</p>
                  <p className="text-xs font-semibold text-[#1B2430]/70">
                    {p.universiteAdi}{p.ilAdi ? ` · ${p.ilAdi}` : ''}
                    {p.puanTuru ? ` · ${p.puanTuru}` : ''}
                    {p.basariSirasi !== null ? ` · sıra ${p.basariSirasi.toLocaleString('tr-TR')}` : ''}
                  </p>
                </button>
              ))}
            </div>
          )}
          {!araniyor && sorgu.trim().length >= 3 && sonuclar.length === 0 && (
            <p className="text-sm font-semibold text-[#1B2430]/60">Sonuç yok.</p>
          )}
        </div>
      )}

      {/* Sinav tarihi */}
      {!readOnly && (
        <div className="flex flex-wrap items-end gap-2">
          <div>
            <label className="mb-1 block text-sm font-bold text-[#1B2430]">Hedef sınav tarihi</label>
            <input type="date" value={sinavTarihi} onChange={(e) => setSinavTarihi(e.target.value)}
              className={`${PIXEL_INPUT} max-w-[200px]`} />
          </div>
          <button type="button" onClick={tarihKaydet} disabled={isPending}
            className="rounded-xl border-4 border-[#1B2430] bg-white px-4 py-2.5 text-sm font-bold text-[#1B2430]">
            Kaydet
          </button>
        </div>
      )}

      {/* Ders bazli hedef netler */}
      <div className="space-y-2">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-sm font-bold text-[#1B2430]/70">
            {EXAM_TYPE_LABELS[examType]}
            {track ? ` · ${TRACK_LABELS[track]}` : ''} hedef netlerin
            {toplam !== null && <span className="ml-2 text-[#6FA89E]">toplam {toplam}</span>}
          </p>
          {!readOnly && !netAcik && (
            <button type="button" onClick={() => setNetAcik(true)}
              className="text-sm font-bold text-[#DD7B3A] hover:underline">
              {mevcutHedefler.length > 0 ? 'Düzenle' : 'Hedef Net Gir'}
            </button>
          )}
        </div>

        {netAcik && !readOnly ? (
          <div className="space-y-2 rounded-xl border-4 border-[#1B2430] bg-white p-4">
            {dersler.map((d) => (
              <div key={d.name} className="flex items-center gap-3">
                <span className="flex-1 truncate text-sm font-bold text-[#1B2430]">{d.name}</span>
                <input
                  type="number" min={0} max={d.questionCount} step="0.25"
                  value={hedefNetler[d.name] ?? ''}
                  onChange={(e) => setHedefNetler((p) => ({ ...p, [d.name]: e.target.value }))}
                  aria-label={`${d.name} hedef net`}
                  className="w-24 rounded-lg border-2 border-[#1B2430] bg-white px-2 py-1 text-center font-bold text-[#1B2430]"
                />
                <span className="w-12 shrink-0 text-sm font-semibold text-[#1B2430]/50">/{d.questionCount}</span>
              </div>
            ))}
            {error && <p className="text-sm font-semibold text-red-600">{error}</p>}
            <div className="flex gap-2 pt-1">
              <button type="button" onClick={netleriKaydet} disabled={isPending} className={`${PIXEL_BUTTON_PRIMARY} px-4 py-2 text-sm`}>
                {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Kaydet'}
              </button>
              <button type="button" onClick={() => setNetAcik(false)}
                className="rounded-xl border-4 border-[#1B2430] bg-white px-4 py-2 text-sm font-bold text-[#1B2430]">
                Vazgeç
              </button>
            </div>
          </div>
        ) : mevcutHedefler.length === 0 ? (
          <p className="text-sm font-semibold text-[#1B2430]/60">
            Ders bazında hedef net girersen deneme grafiğinde hedef çizgin görünür.
          </p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {mevcutHedefler.map((h) => (
              <span key={h.sectionName}
                className="rounded-lg border-2 border-[#1B2430] bg-white px-2.5 py-1 text-xs font-bold text-[#1B2430]">
                {h.sectionName}: {h.targetNet}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
