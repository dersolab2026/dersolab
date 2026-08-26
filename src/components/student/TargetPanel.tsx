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
 * Hedef paneli: hedef program ve ders bazli hedef netler.
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
      const s = await setTargetProgram(kod, targets.targetRank, null)
      if (!s.success) { setError(s.error); return }
      setAramaAcik(false); setSorgu(''); setSonuclar([])
      showToast(kod ? 'Hedef program kaydedildi.' : 'Hedef program kaldırıldı.')
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
        <Target className="h-5 w-5 text-[var(--yazi)]" />
        <p className="font-bold text-[var(--yazi)]">Hedefin</p>
      </div>

      {/* Hedef program */}
      {targets.program ? (
        <div className="rounded-xl border-4 border-[var(--cizgi)] bg-[var(--yuzey-ic)] p-4">
          <p className="font-bold text-[var(--yazi)]">{targets.program.birimAdi}</p>
          <p className="text-sm font-semibold text-[var(--yazi)]/70">
            {targets.program.universiteAdi}
            {targets.program.ilAdi ? ` · ${targets.program.ilAdi}` : ''}
            {targets.program.ogrenimTuruAdi ? ` · ${targets.program.ogrenimTuruAdi}` : ''}
          </p>
          <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm font-bold tabular-nums text-[var(--yazi)]">
            {targets.program.puanTuru && <span>Puan türü: {targets.program.puanTuru}</span>}
            {targets.program.minPuan !== null && <span>Taban puan: {targets.program.minPuan.toFixed(2)}</span>}
            {targets.program.basariSirasi !== null && (
              <span>Başarı sırası: {targets.program.basariSirasi.toLocaleString('tr-TR')}</span>
            )}
          </div>
          {!readOnly && (
            <button type="button" onClick={() => programSec(null)} disabled={isPending}
              className="mt-2 text-xs font-bold text-[var(--yazi)]/50 hover:text-[var(--tehlike)]">
              Hedefi kaldır
            </button>
          )}
        </div>
      ) : targets.targetProgramCode ? (
        <p className="text-sm font-semibold text-[var(--vurgu-yazi)]">
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
        <div className="space-y-2 rounded-xl border-4 border-[var(--cizgi)] bg-[var(--yuzey-ic)] p-4">
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
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border-4 border-[var(--cizgi)] bg-[var(--vurgu)] text-[var(--yazi-ters)]">
              {araniyor ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
            </button>
            <button type="button" onClick={() => { setAramaAcik(false); setSonuclar([]) }} aria-label="Kapat"
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border-4 border-[var(--cizgi)] bg-[var(--yuzey-ic)]">
              <X className="h-4 w-4" />
            </button>
          </div>

          {sonuclar.length > 0 && (
            <div className="max-h-72 space-y-1.5 overflow-y-auto pr-1">
              {sonuclar.map((p) => (
                <button key={p.kilavuzKodu} type="button" onClick={() => programSec(p.kilavuzKodu)}
                  className="w-full rounded-lg border-2 border-[var(--cizgi)] bg-[var(--yuzey-ic)] p-2 text-left transition-colors hover:bg-[var(--yuzey)]">
                  <p className="text-sm font-bold text-[var(--yazi)]">{p.birimAdi}</p>
                  <p className="text-xs font-semibold text-[var(--yazi)]/70">
                    {p.universiteAdi}{p.ilAdi ? ` · ${p.ilAdi}` : ''}
                    {p.puanTuru ? ` · ${p.puanTuru}` : ''}
                    {p.basariSirasi !== null ? ` · sıra ${p.basariSirasi.toLocaleString('tr-TR')}` : ''}
                  </p>
                </button>
              ))}
            </div>
          )}
          {!araniyor && sorgu.trim().length >= 3 && sonuclar.length === 0 && (
            <p className="text-sm font-semibold text-[var(--yazi)]/60">Sonuç yok.</p>
          )}
        </div>
      )}

      {/* Ders bazli hedef netler */}
      <div className="space-y-2">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-sm font-bold text-[var(--yazi)]/70">
            {EXAM_TYPE_LABELS[examType]}
            {track ? ` · ${TRACK_LABELS[track]}` : ''} hedef netlerin
            {toplam !== null && <span className="ml-2 text-[var(--ikincil-yazi)]">toplam {toplam}</span>}
          </p>
          {!readOnly && !netAcik && (
            <button type="button" onClick={() => setNetAcik(true)}
              className="text-sm font-bold text-[var(--vurgu-yazi)] hover:underline">
              {mevcutHedefler.length > 0 ? 'Düzenle' : 'Hedef Net Gir'}
            </button>
          )}
        </div>

        {netAcik && !readOnly ? (
          <div className="space-y-2 rounded-xl border-4 border-[var(--cizgi)] bg-[var(--yuzey-ic)] p-4">
            {dersler.map((d) => (
              <div key={d.name} className="flex items-center gap-3">
                <span className="flex-1 truncate text-sm font-bold text-[var(--yazi)]">{d.name}</span>
                <input
                  type="number" min={0} max={d.questionCount} step="0.25"
                  value={hedefNetler[d.name] ?? ''}
                  onChange={(e) => setHedefNetler((p) => ({ ...p, [d.name]: e.target.value }))}
                  aria-label={`${d.name} hedef net`}
                  className="w-24 rounded-lg border-2 border-[var(--cizgi)] bg-[var(--yuzey-ic)] px-2 py-1 text-center font-bold text-[var(--yazi)]"
                />
                <span className="w-12 shrink-0 text-sm font-semibold text-[var(--yazi)]/50">/{d.questionCount}</span>
              </div>
            ))}
            {error && <p className="text-sm font-semibold text-[var(--tehlike)]">{error}</p>}
            <div className="flex gap-2 pt-1">
              <button type="button" onClick={netleriKaydet} disabled={isPending} className={`${PIXEL_BUTTON_PRIMARY} px-4 py-2 text-sm`}>
                {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Kaydet'}
              </button>
              <button type="button" onClick={() => setNetAcik(false)}
                className="rounded-xl border-4 border-[var(--cizgi)] bg-[var(--yuzey-ic)] px-4 py-2 text-sm font-bold text-[var(--yazi)]">
                Vazgeç
              </button>
            </div>
          </div>
        ) : mevcutHedefler.length === 0 ? (
          <p className="text-sm font-semibold text-[var(--yazi)]/60">
            Ders bazında hedef net girersen deneme grafiğinde hedef çizgin görünür.
          </p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {mevcutHedefler.map((h) => (
              <span key={h.sectionName}
                className="rounded-lg border-2 border-[var(--cizgi)] bg-[var(--yuzey-ic)] px-2.5 py-1 text-xs font-bold text-[var(--yazi)]">
                {h.sectionName}: {h.targetNet}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
