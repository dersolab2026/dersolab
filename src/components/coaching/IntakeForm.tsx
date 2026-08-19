'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, ClipboardCheck, Info } from 'lucide-react'
import { saveIntakeForm, saveSelfAssessment, type IntakeInput } from '@/actions/intake'
import { useToast } from '@/components/ui/Toast'
import { SelfAssessmentRadar } from '@/components/coaching/SelfAssessmentRadar'
import {
  MADDELER, OLCEK_ETIKETLERI, boyutSkorlari, type BoyutSkoru,
} from '@/lib/coaching/self-assessment'
import { PIXEL_CARD, PIXEL_BUTTON_PRIMARY, PIXEL_INPUT } from '@/lib/theme'

/**
 * Öğrencinin doldurduğu tanışma formu ve öz-değerlendirme ölçeği.
 *
 * Ölçek DersoLab'ın kendi madde seti; doğrulanmış bir psikometrik test
 * değil ve arayüzde de öyle sunuluyor. Amaç tanı koymak değil, koçun ilk
 * görüşmede neyi konuşacağını bulması.
 */

const KIM_SECENEK: { deger: 'kendim' | 'ailem' | 'ikimiz'; etiket: string }[] = [
  { deger: 'kendim', etiket: 'Ben istedim' },
  { deger: 'ailem', etiket: 'Ailem istedi' },
  { deger: 'ikimiz', etiket: 'İkimiz de' },
]

interface Props {
  mevcut: IntakeInput | null
  gecmisOlcumler: { id: string; takenOn: string; skorlar: BoyutSkoru[] }[]
}

export function IntakeForm({ mevcut, gecmisOlcumler }: Props) {
  const router = useRouter()
  const { showToast } = useToast()
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  const [form, setForm] = useState<IntakeInput>(mevcut ?? {
    goal: '', hardSubjects: '', dailyRoutine: '', triedMethods: '',
    studyEnvironment: '', whoWanted: null, notes: '',
  })

  const [olcekAcik, setOlcekAcik] = useState(false)
  const [cevaplar, setCevaplar] = useState<Record<string, number>>({})

  const cevaplanan = Object.keys(cevaplar).length
  const sonOlcum = gecmisOlcumler[0] ?? null
  const ilkOlcum = gecmisOlcumler.length > 1 ? gecmisOlcumler[gecmisOlcumler.length - 1] : null

  function alan<K extends keyof IntakeInput>(k: K, v: IntakeInput[K]) {
    setForm((p) => ({ ...p, [k]: v }))
  }

  function formuKaydet() {
    setError(null)
    startTransition(async () => {
      const s = await saveIntakeForm(form)
      if (!s.success) { setError(s.error); return }
      showToast('Form kaydedildi.')
      router.refresh()
    })
  }

  function olcegiKaydet() {
    setError(null)
    startTransition(async () => {
      const s = await saveSelfAssessment(cevaplar)
      if (!s.success) { setError(s.error); return }
      showToast('Değerlendirmen kaydedildi.')
      setOlcekAcik(false); setCevaplar({})
      router.refresh()
    })
  }

  return (
    <div className="space-y-5">
      {/* Tanisma formu */}
      <div className={`${PIXEL_CARD} space-y-3 p-5`}>
        <div className="flex items-center gap-2">
          <ClipboardCheck className="h-5 w-5 text-[#1B2430]" />
          <p className="font-bold text-[#1B2430]">Tanışma Formu</p>
        </div>
        <p className="text-sm font-semibold text-[#1B2430]/70">
          Koçun seni tanımadan ilk görüşmeye başlamasın diye. Hepsini doldurmak zorunda değilsin.
        </p>

        <div className="space-y-3">
          <Alan etiket="Hedefin ne?" deger={form.goal} onChange={(v) => alan('goal', v)}
            ipucu="Hangi bölüm, hangi üniversite ya da hangi puan?" />
          <Alan etiket="En çok hangi derslerde zorlanıyorsun?" deger={form.hardSubjects}
            onChange={(v) => alan('hardSubjects', v)} />
          <Alan etiket="Şu anki günlük rutinin nasıl?" deger={form.dailyRoutine}
            onChange={(v) => alan('dailyRoutine', v)}
            ipucu="Okuldan sonra ne yapıyorsun, günde kaç saat çalışıyorsun?" />
          <Alan etiket="Daha önce hangi yöntemleri denedin?" deger={form.triedMethods}
            onChange={(v) => alan('triedMethods', v)}
            ipucu="İşe yarayan ya da yaramayan ne oldu?" />
          <Alan etiket="Nerede ve nasıl çalışıyorsun?" deger={form.studyEnvironment}
            onChange={(v) => alan('studyEnvironment', v)}
            ipucu="Ortam, uyku düzenin, dikkatini dağıtan şeyler." />

          <div>
            <label className="mb-1 block text-sm font-bold text-[#1B2430]">
              Koçluk almak kimin fikriydi?
            </label>
            <div className="flex flex-wrap gap-2">
              {KIM_SECENEK.map((s) => (
                <button key={s.deger} type="button"
                  onClick={() => alan('whoWanted', form.whoWanted === s.deger ? null : s.deger)}
                  aria-pressed={form.whoWanted === s.deger}
                  className={`rounded-lg border-4 border-[#1B2430] px-3 py-1.5 text-sm font-bold transition-all ${
                    form.whoWanted === s.deger ? 'bg-[#DD7B3A] text-[#F4F1E8]' : 'bg-white text-[#1B2430]'
                  }`}>
                  {s.etiket}
                </button>
              ))}
            </div>
          </div>

          <Alan etiket="Koçunun bilmesini istediğin başka bir şey?" deger={form.notes}
            onChange={(v) => alan('notes', v)} />
        </div>

        {error && <p className="text-sm font-semibold text-red-600">{error}</p>}

        <button type="button" onClick={formuKaydet} disabled={isPending}
          className={`${PIXEL_BUTTON_PRIMARY} px-4 py-2 text-sm`}>
          {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Formu Kaydet'}
        </button>
      </div>

      {/* Olcek */}
      <div className={`${PIXEL_CARD} space-y-3 p-5`}>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="font-bold text-[#1B2430]">Çalışma Alışkanlıkların</p>
          {!olcekAcik && (
            <button type="button" onClick={() => setOlcekAcik(true)}
              className={`${PIXEL_BUTTON_PRIMARY} px-4 py-2 text-sm`}>
              {sonOlcum ? 'Tekrar Ölç' : 'Değerlendirmeyi Başlat'}
            </button>
          )}
        </div>

        <div className="flex items-start gap-2 rounded-xl border-2 border-[#1B2430] bg-[#F4F1E8] px-3 py-2">
          <Info className="mt-0.5 h-4 w-4 shrink-0 text-[#1B2430]/70" />
          <p className="text-xs font-semibold text-[#1B2430]/80">
            Bu bilimsel bir test değil, doğru ya da yanlış cevabı yok. Amacı koçunla
            ilk görüşmede nereden başlayacağınızı bulmak. Birkaç hafta sonra tekrar
            ölçüp değişimi görebilirsin.
          </p>
        </div>

        {olcekAcik ? (
          <div className="space-y-4">
            <p className="text-sm font-bold text-[#1B2430]/70">
              {cevaplanan}/{MADDELER.length} cevaplandı
            </p>
            {MADDELER.map((m, i) => (
              <div key={m.id} className="rounded-xl border-2 border-[#1B2430] bg-white p-3">
                <p className="mb-2 text-sm font-bold text-[#1B2430]">
                  <span className="mr-1.5 text-[#1B2430]/50">{i + 1}.</span>{m.metin}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {OLCEK_ETIKETLERI.map((etiket, idx) => {
                    const deger = idx + 1
                    const secili = cevaplar[m.id] === deger
                    return (
                      <button key={deger} type="button"
                        onClick={() => setCevaplar((p) => ({ ...p, [m.id]: deger }))}
                        aria-pressed={secili}
                        title={etiket}
                        className={`min-w-[38px] rounded-lg border-2 border-[#1B2430] px-2 py-1 text-xs font-bold transition-all ${
                          secili ? 'bg-[#6FA89E] text-[#F4F1E8]' : 'bg-white text-[#1B2430]'
                        }`}>
                        {deger}
                      </button>
                    )
                  })}
                  <span className="self-center pl-1 text-xs font-semibold text-[#1B2430]/50">
                    1 = hiç katılmıyorum · 5 = tamamen katılıyorum
                  </span>
                </div>
              </div>
            ))}

            {error && <p className="text-sm font-semibold text-red-600">{error}</p>}

            <div className="flex gap-2">
              <button type="button" onClick={olcegiKaydet} disabled={isPending || cevaplanan === 0}
                className={`${PIXEL_BUTTON_PRIMARY} px-4 py-2 text-sm`}>
                {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Kaydet'}
              </button>
              <button type="button" onClick={() => { setOlcekAcik(false); setCevaplar({}) }}
                className="rounded-xl border-4 border-[#1B2430] bg-white px-4 py-2 text-sm font-bold text-[#1B2430]">
                Vazgeç
              </button>
            </div>
          </div>
        ) : sonOlcum ? (
          <SelfAssessmentRadar
            guncel={sonOlcum.skorlar}
            ilk={ilkOlcum?.skorlar ?? null}
            ilkTarih={ilkOlcum?.takenOn ?? null}
            guncelTarih={sonOlcum.takenOn}
          />
        ) : (
          <p className="text-sm font-semibold text-[#1B2430]/60">
            Henüz değerlendirme yapmadın. 20 kısa soru, birkaç dakika sürüyor.
          </p>
        )}
      </div>
    </div>
  )
}

function Alan({ etiket, deger, onChange, ipucu }: {
  etiket: string; deger: string; onChange: (v: string) => void; ipucu?: string
}) {
  return (
    <div>
      <label className="mb-1 block text-sm font-bold text-[#1B2430]">{etiket}</label>
      {ipucu && <p className="mb-1 text-xs font-semibold text-[#1B2430]/50">{ipucu}</p>}
      <textarea value={deger} onChange={(e) => onChange(e.target.value)} rows={2}
        className={`${PIXEL_INPUT} resize-y`} />
    </div>
  )
}

export { boyutSkorlari }
