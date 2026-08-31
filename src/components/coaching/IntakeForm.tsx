'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, ClipboardCheck, Info, X } from 'lucide-react'
import { saveIntakeForm, saveSelfAssessment, type IntakeInput } from '@/actions/intake'
import { useToast } from '@/components/ui/Toast'
import { SelfAssessmentRadar } from '@/components/coaching/SelfAssessmentRadar'
import {
  MADDELER, OLCEK_ETIKETLERI, boyutSkorlari, type BoyutSkoru,
} from '@/lib/coaching/self-assessment'
import {
  HEDEF_SECENEKLERI, RUTIN_SECENEKLERI, YONTEM_SECENEKLERI, ORTAM_SECENEKLERI,
  ZORLANDIGI_DERSLER_LGS, ZORLANDIGI_DERSLER_YKS, type IntakeSecenek,
} from '@/lib/coaching/intake-options'
import { PIXEL_CARD, PIXEL_BUTTON_PRIMARY, PIXEL_INPUT } from '@/lib/theme'

/**
 * Öğrencinin doldurduğu tanışma formu ve öz-değerlendirme ölçeği.
 *
 * Form tamamen seçmeli: eskiden serbest metindi ve boş kalıyordu, kimse
 * paragraf yazmak istemiyor. Tek serbest alan en sondaki "eklemek
 * istediğin bir şey" — o da isteğe bağlı.
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

const BOS_FORM: IntakeInput = {
  goal: [], hardSubjects: [], dailyRoutine: [], triedMethods: [],
  studyEnvironment: [], whoWanted: null, notes: '',
}

interface Props {
  mevcut: IntakeInput | null
  gecmisOlcumler: { id: string; takenOn: string; skorlar: BoyutSkoru[] }[]
  /** Zorlandığı dersler listesi buna göre değişiyor. */
  gradeTrack: 'lgs' | 'yks'
}

export function IntakeForm({ mevcut, gecmisOlcumler, gradeTrack }: Props) {
  const router = useRouter()
  const { showToast } = useToast()
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  const [form, setForm] = useState<IntakeInput>(mevcut ?? BOS_FORM)

  const [olcekAcik, setOlcekAcik] = useState(false)
  const [cevaplar, setCevaplar] = useState<Record<string, number>>({})

  const cevaplanan = Object.keys(cevaplar).length
  const sonOlcum = gecmisOlcumler[0] ?? null
  const ilkOlcum = gecmisOlcumler.length > 1 ? gecmisOlcumler[gecmisOlcumler.length - 1] : null

  const dersSecenekleri = gradeTrack === 'lgs' ? ZORLANDIGI_DERSLER_LGS : ZORLANDIGI_DERSLER_YKS

  type DiziAlan = 'goal' | 'hardSubjects' | 'dailyRoutine' | 'triedMethods' | 'studyEnvironment'

  function sec(alan: DiziAlan, key: string) {
    setForm((p) => {
      const mevcutSecim = p[alan]
      return {
        ...p,
        [alan]: mevcutSecim.includes(key)
          ? mevcutSecim.filter((k) => k !== key)
          : [...mevcutSecim, key],
      }
    })
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
      <div className={`${PIXEL_CARD} space-y-4 p-5`}>
        <div className="flex items-center gap-2">
          <ClipboardCheck className="h-5 w-5 text-[#1B2430]" />
          <p className="font-bold text-[#1B2430]">Tanışma Formu</p>
        </div>
        <p className="text-sm font-semibold text-[#1B2430]/70">
          Koçun seni tanımadan ilk görüşmeye başlamasın diye. Sadece sana uyanlara tıkla —
          birden fazla seçebilirsin, hepsini doldurmak zorunda değilsin.
        </p>

        <div className="space-y-5">
          <SecimGrubu
            etiket="Hedefin ne?"
            secenekler={HEDEF_SECENEKLERI}
            secili={form.goal}
            onSec={(k) => sec('goal', k)}
          />

          <SecimGrubu
            etiket="En çok hangi derslerde zorlanıyorsun?"
            secenekler={dersSecenekleri}
            secili={form.hardSubjects}
            onSec={(k) => sec('hardSubjects', k)}
          />

          <SecimGrubu
            etiket="Şu anki çalışma düzenin nasıl?"
            secenekler={RUTIN_SECENEKLERI}
            secili={form.dailyRoutine}
            onSec={(k) => sec('dailyRoutine', k)}
          />

          <SecimGrubu
            etiket="Daha önce hangi yöntemleri denedin?"
            secenekler={YONTEM_SECENEKLERI}
            secili={form.triedMethods}
            onSec={(k) => sec('triedMethods', k)}
          />

          <SecimGrubu
            etiket="Nerede ve nasıl çalışıyorsun?"
            secenekler={ORTAM_SECENEKLERI}
            secili={form.studyEnvironment}
            onSec={(k) => sec('studyEnvironment', k)}
          />

          <div>
            <label className="mb-2 block text-sm font-bold text-[#1B2430]">
              Koçluk almak kimin fikriydi?
            </label>
            <div className="flex flex-wrap gap-2">
              {KIM_SECENEK.map((s) => (
                <button key={s.deger} type="button"
                  onClick={() => setForm((p) => ({
                    ...p, whoWanted: p.whoWanted === s.deger ? null : s.deger,
                  }))}
                  aria-pressed={form.whoWanted === s.deger}
                  className={`rounded-lg border-4 border-[#1B2430] px-3 py-1.5 text-sm font-bold transition-all ${
                    form.whoWanted === s.deger ? 'bg-[#DD7B3A] text-[#F4F1E8]' : 'bg-white text-[#1B2430]'
                  }`}>
                  {s.etiket}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm font-bold text-[#1B2430]">
              Koçunun bilmesini istediğin başka bir şey?
            </label>
            <p className="mb-1 text-xs font-semibold text-[#1B2430]/70">
              İsteğe bağlı — boş bırakabilirsin.
            </p>
            <textarea
              value={form.notes}
              onChange={(e) => setForm((p) => ({ ...p, notes: e.target.value }))}
              rows={2}
              maxLength={1000}
              className={`${PIXEL_INPUT} resize-y`}
            />
          </div>
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
                  <span className="mr-1.5 text-[#1B2430]/70">{i + 1}.</span>{m.metin}
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
                  <span className="self-center pl-1 text-xs font-semibold text-[#1B2430]/70">
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
          <p className="text-sm font-semibold text-[#1B2430]/70">
            Henüz değerlendirme yapmadın. 20 kısa soru, birkaç dakika sürüyor.
          </p>
        )}
      </div>
    </div>
  )
}

/**
 * Tek soruluk çoklu seçim.
 *
 * Katalogda olmayan seçili değerler ayrıca gösteriliyor: form eskiden
 * serbest metindi, o cevaplar tek elemanlı dizi olarak taşındı. Öğrenci
 * eski cevabını görüp silebilsin diye sessizce yok sayılmıyor.
 */
function SecimGrubu({ etiket, secenekler, secili, onSec }: {
  etiket: string
  secenekler: IntakeSecenek[]
  secili: string[]
  onSec: (key: string) => void
}) {
  const katalogAnahtarlari = new Set(secenekler.map((s) => s.key))
  const eskiCevaplar = secili.filter((s) => !katalogAnahtarlari.has(s))

  const gruplu = secenekler.some((s) => s.grup)
  const gruplar = gruplu
    ? [...new Set(secenekler.map((s) => s.grup ?? ''))]
    : ['']

  return (
    <div>
      <p className="mb-2 text-sm font-bold text-[#1B2430]">{etiket}</p>

      <div className="space-y-2">
        {gruplar.map((g) => (
          <div key={g}>
            {g && (
              <p className="mb-1 text-xs font-bold uppercase tracking-wide text-[#1B2430]/70">{g}</p>
            )}
            <div className="flex flex-wrap gap-1.5">
              {secenekler.filter((s) => (s.grup ?? '') === g).map((s) => {
                const isaretli = secili.includes(s.key)
                return (
                  <button key={s.key} type="button" onClick={() => onSec(s.key)}
                    aria-pressed={isaretli}
                    className={`rounded-lg border-2 border-[#1B2430] px-2.5 py-1 text-sm font-bold transition-all ${
                      isaretli ? 'bg-[#6FA89E] text-[#F4F1E8]' : 'bg-white text-[#1B2430]'
                    }`}>
                    {s.label}
                  </button>
                )
              })}
            </div>
          </div>
        ))}
      </div>

      {eskiCevaplar.length > 0 && (
        <div className="mt-2 space-y-1">
          <p className="text-xs font-semibold text-[#1B2430]/70">Daha önce yazdığın cevap:</p>
          {eskiCevaplar.map((c) => (
            <span key={c}
              className="mr-1.5 inline-flex items-center gap-1.5 rounded-lg border-2 border-dashed border-[#1B2430]/40 bg-[#F4F1E8] px-2 py-1 text-sm font-semibold text-[#1B2430]">
              {c}
              <button type="button" onClick={() => onSec(c)} aria-label={`"${c}" cevabını kaldır`}
                className="text-[#1B2430]/70 hover:text-red-600">
                <X className="h-3.5 w-3.5" />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  )
}

export { boyutSkorlari }
