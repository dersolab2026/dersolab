'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import { Loader2, Search, Send } from 'lucide-react'
import { searchPrograms, sendTercihListesi, sendTercihListesiToEmail, getTercihGonderilebilecekKisiler, type TercihGonderilebilecekKisi } from '@/actions/yok-atlas'
import type { YokAtlasProgramRow } from '@/lib/yok-atlas/search-programs'
import { PIXEL_CARD, PIXEL_BUTTON_PRIMARY, PIXEL_INPUT, PIXEL_BADGE } from '@/lib/theme'

const PUAN_TURLERI = ['SAY', 'EA', 'SÖZ', 'DİL', 'TYT'] as const

interface TercihRobotuFormProps {
  illar: string[]
  isLoggedIn: boolean
  currentUserRole: 'student' | 'parent' | 'instructor' | 'admin' | null
}

export function TercihRobotuForm({ illar, isLoggedIn, currentUserRole }: TercihRobotuFormProps) {
  const [puanTuru, setPuanTuru] = useState<string>('SAY')
  const [basariSirasi, setBasariSirasi] = useState('')
  const [ilAdi, setIlAdi] = useState('')
  const [universiteTuru, setUniversiteTuru] = useState('')
  const [aramaMetni, setAramaMetni] = useState('')
  const [sadeceGirebilecekleri, setSadeceGirebilecekleri] = useState(true)
  const [results, setResults] = useState<YokAtlasProgramRow[] | null>(null)
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [kisiler, setKisiler] = useState<TercihGonderilebilecekKisi[] | null>(null)
  const [recipientId, setRecipientId] = useState('')
  const [email, setEmail] = useState('')
  const [isSending, startSending] = useTransition()
  const [sendMessage, setSendMessage] = useState<string | null>(null)
  const [sendError, setSendError] = useState<string | null>(null)

  const isInstructorOrAdmin = currentUserRole === 'instructor' || currentUserRole === 'admin'

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

  function toggleSelected(id: string) {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  function handleOpenSend() {
    setSendMessage(null)
    setSendError(null)
    if (isInstructorOrAdmin && kisiler === null) {
      startSending(async () => {
        const data = await getTercihGonderilebilecekKisiler()
        setKisiler(data)
      })
    }
  }

  function handleSend() {
    setSendError(null)

    if (!isLoggedIn) {
      if (!email.trim()) {
        setSendError('E-posta adresini girmelisin')
        return
      }
      startSending(async () => {
        const result = await sendTercihListesiToEmail([...selected], email)
        if (!result.success) {
          setSendError(result.error)
          return
        }
        setSendMessage('Liste PDF olarak hazırlanıp e-postana gönderildi.')
        setSelected(new Set())
        setEmail('')
      })
      return
    }

    if (isInstructorOrAdmin && !recipientId) {
      setSendError('Bir kişi seçmelisin')
      return
    }
    startSending(async () => {
      const result = await sendTercihListesi([...selected], isInstructorOrAdmin ? recipientId : undefined)
      if (!result.success) {
        setSendError(result.error)
        return
      }
      setSendMessage('Liste PDF olarak hazırlanıp gönderildi.')
      setSelected(new Set())
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
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-sm font-semibold text-[#1B2430]/70">{results.length} sonuç bulundu.</p>
            {selected.size > 0 && (
              <p className="text-sm font-bold text-[#DD7B3A]">{selected.size} bölüm seçili</p>
            )}
          </div>

          {results.length === 0 ? (
            <p className={`${PIXEL_CARD} p-5 text-sm font-semibold text-[#1B2430]`}>Kriterlere uyan bölüm bulunamadı.</p>
          ) : (
            <div className="space-y-3">
              {results.map((r) => (
                <div key={r.id} className={`${PIXEL_CARD} p-4 flex flex-wrap items-center gap-3`}>
                  <input
                    type="checkbox"
                    checked={selected.has(r.id)}
                    onChange={() => toggleSelected(r.id)}
                    className="h-5 w-5 shrink-0"
                    aria-label={`${r.birimAdi} seç`}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-[#1B2430]">{r.birimAdi}</p>
                    <p className="text-sm font-semibold text-[#1B2430]/70">
                      {r.universiteAdi} {r.ilAdi ? `— ${r.ilAdi}` : ''}
                    </p>
                    <p className="text-xs font-semibold text-[#1B2430]/60">
                      {r.fakulteAdi} · {r.ogrenimTuruAdi} · {r.ogrenimDiliAdi}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className={PIXEL_BADGE}>{r.universiteTuru}</span>
                    <p className="text-sm font-bold text-[#1B2430]">Sıralama: {r.basariSirasi?.toLocaleString('tr-TR')}</p>
                    <p className="text-xs font-semibold text-[#1B2430]/60">Taban Puan: {r.minPuan?.toFixed(2)}</p>
                    {r.kontenjan != null && <p className="text-xs font-semibold text-[#1B2430]/60">Kontenjan: {r.kontenjan}</p>}
                  </div>
                </div>
              ))}
            </div>
          )}

          {selected.size > 0 && (
            <div className={`${PIXEL_CARD} p-4 space-y-3`}>
              {!isLoggedIn ? (
                <>
                  <p className="font-bold text-[#1B2430]">{selected.size} bölümü PDF olarak e-postana gönder</p>
                  <div>
                    <label className="block text-sm font-bold text-[#1B2430] mb-1">E-posta adresin</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="ornek@mail.com"
                      className={PIXEL_INPUT}
                    />
                  </div>
                  {sendError && <p className="text-sm font-bold text-red-600">{sendError}</p>}
                  {sendMessage && <p className="text-sm font-bold text-[#6FA89E]">{sendMessage}</p>}
                  <button type="button" onClick={handleSend} disabled={isSending} className={`${PIXEL_BUTTON_PRIMARY} gap-2 px-5 py-2.5`}>
                    {isSending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                    Gönder
                  </button>
                  <p className="text-xs font-semibold text-[#1B2430]/60">
                    Hesabın yoksa sorun değil — istersen sonra{' '}
                    <Link href="/register" className="underline text-[#DD7B3A] font-bold">kaydolabilirsin</Link>.
                  </p>
                </>
              ) : (
                <>
                  <p className="font-bold text-[#1B2430]">{selected.size} bölümü PDF olarak kaydet ve gönder</p>
                  {isInstructorOrAdmin && (
                    <div>
                      <label className="block text-sm font-bold text-[#1B2430] mb-1">Kime</label>
                      <select
                        value={recipientId}
                        onChange={(e) => setRecipientId(e.target.value)}
                        onFocus={handleOpenSend}
                        className={PIXEL_INPUT}
                      >
                        <option value="">Seç...</option>
                        {kisiler === null ? (
                          <option disabled>Yükleniyor...</option>
                        ) : (
                          kisiler.map((k) => (
                            <option key={k.id} value={k.id}>
                              {k.name} ({k.role === 'student' ? 'Öğrenci' : 'Veli'}) — {k.email}
                            </option>
                          ))
                        )}
                      </select>
                    </div>
                  )}
                  {sendError && <p className="text-sm font-bold text-red-600">{sendError}</p>}
                  {sendMessage && <p className="text-sm font-bold text-[#6FA89E]">{sendMessage}</p>}
                  <button type="button" onClick={handleSend} disabled={isSending} className={`${PIXEL_BUTTON_PRIMARY} gap-2 px-5 py-2.5`}>
                    {isSending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                    {isInstructorOrAdmin ? 'Gönder' : 'Kaydet ve Kendime Gönder'}
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
