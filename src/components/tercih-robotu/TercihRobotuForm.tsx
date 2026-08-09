'use client'

import { useState, useTransition } from 'react'
import { Loader2, Search } from 'lucide-react'
import { searchPrograms } from '@/actions/yok-atlas'
import type { YokAtlasProgramRow } from '@/lib/yok-atlas/search-programs'
import { PIXEL_CARD, PIXEL_BUTTON_PRIMARY, PIXEL_INPUT, PIXEL_BADGE } from '@/lib/theme'

const PUAN_TURLERI = ['SAY', 'EA', 'SÖZ', 'DİL', 'TYT'] as const

export function TercihRobotuForm({ illar }: { illar: string[] }) {
  const [puanTuru, setPuanTuru] = useState<string>('SAY')
  const [basariSirasi, setBasariSirasi] = useState('')
  const [ilAdi, setIlAdi] = useState('')
  const [universiteTuru, setUniversiteTuru] = useState('')
  const [aramaMetni, setAramaMetni] = useState('')
  const [sadeceGirebilecekleri, setSadeceGirebilecekleri] = useState(true)
  const [results, setResults] = useState<YokAtlasProgramRow[] | null>(null)
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    const sirasi = parseInt(basariSirasi, 10)
    if (!Number.isFinite(sirasi) || sirasi <= 0) {
      setError('Geçerli bir başarı sıralaması gir')
      return
    }
    startTransition(async () => {
      const data = await searchPrograms({
        puanTuru,
        basariSirasi: sirasi,
        ilAdi: ilAdi || undefined,
        universiteTuru: (universiteTuru as 'DEVLET' | 'VAKIF') || undefined,
        aramaMetni: aramaMetni || undefined,
        sadeceGirebilecekleri,
      })
      setResults(data)
    })
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className={`${PIXEL_CARD} p-5 space-y-4`}>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-bold text-[#1B2430] mb-1">Puan Türü</label>
            <select value={puanTuru} onChange={(e) => setPuanTuru(e.target.value)} className={PIXEL_INPUT}>
              {PUAN_TURLERI.map((p) => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-bold text-[#1B2430] mb-1">Başarı Sıralaman</label>
            <input
              type="number"
              inputMode="numeric"
              required
              value={basariSirasi}
              onChange={(e) => setBasariSirasi(e.target.value)}
              placeholder="ör. 150000"
              className={PIXEL_INPUT}
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-[#1B2430] mb-1">İl (opsiyonel)</label>
            <select value={ilAdi} onChange={(e) => setIlAdi(e.target.value)} className={PIXEL_INPUT}>
              <option value="">Tümü</option>
              {illar.map((il) => <option key={il} value={il}>{il}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-bold text-[#1B2430] mb-1">Üniversite Türü (opsiyonel)</label>
            <select value={universiteTuru} onChange={(e) => setUniversiteTuru(e.target.value)} className={PIXEL_INPUT}>
              <option value="">Tümü</option>
              <option value="DEVLET">Devlet</option>
              <option value="VAKIF">Vakıf</option>
            </select>
          </div>
          <div className="sm:col-span-2">
            <label className="block text-sm font-bold text-[#1B2430] mb-1">Bölüm/Üniversite Ara (opsiyonel)</label>
            <input
              type="text"
              value={aramaMetni}
              onChange={(e) => setAramaMetni(e.target.value)}
              placeholder="ör. Bilgisayar Mühendisliği"
              className={PIXEL_INPUT}
            />
          </div>
        </div>

        <label className="flex items-center gap-2 text-sm font-semibold text-[#1B2430]">
          <input type="checkbox" checked={sadeceGirebilecekleri} onChange={(e) => setSadeceGirebilecekleri(e.target.checked)} />
          Sadece girebileceğim bölümleri göster
        </label>

        {error && <p className="text-sm font-bold text-red-600">{error}</p>}

        <button type="submit" disabled={isPending} className={`${PIXEL_BUTTON_PRIMARY} gap-2 px-5 py-2.5`}>
          {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
          Ara
        </button>
      </form>

      {results && (
        <div className="space-y-3">
          <p className="text-sm font-semibold text-[#1B2430]/70">{results.length} sonuç bulundu.</p>
          {results.length === 0 ? (
            <p className={`${PIXEL_CARD} p-5 text-sm font-semibold text-[#1B2430]`}>Kriterlere uyan bölüm bulunamadı.</p>
          ) : (
            <div className="space-y-3">
              {results.map((r) => (
                <div key={r.id} className={`${PIXEL_CARD} p-4 flex flex-wrap items-center justify-between gap-3`}>
                  <div>
                    <p className="font-bold text-[#1B2430]">{r.birimAdi}</p>
                    <p className="text-sm font-semibold text-[#1B2430]/70">
                      {r.universiteAdi} {r.ilAdi ? `— ${r.ilAdi}` : ''}
                    </p>
                    <p className="text-xs font-semibold text-[#1B2430]/60">
                      {r.fakulteAdi} · {r.ogrenimTuruAdi} · {r.ogrenimDiliAdi}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className={r.universiteTuru === 'DEVLET' ? PIXEL_BADGE : PIXEL_BADGE}>{r.universiteTuru}</span>
                    <p className="text-sm font-bold text-[#1B2430]">Sıralama: {r.basariSirasi?.toLocaleString('tr-TR')}</p>
                    <p className="text-xs font-semibold text-[#1B2430]/60">Taban Puan: {r.minPuan?.toFixed(2)}</p>
                    {r.kontenjan != null && <p className="text-xs font-semibold text-[#1B2430]/60">Kontenjan: {r.kontenjan}</p>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
