import { ClipboardCheck, AlertTriangle } from 'lucide-react'
import { SelfAssessmentRadar } from '@/components/coaching/SelfAssessmentRadar'
import { zayifBoyutlar } from '@/lib/coaching/self-assessment'
import type { IntakeData } from '@/lib/coaching/get-intake'
import { PIXEL_CARD } from '@/lib/theme'

/**
 * Kocun gordugu tanisma formu ozeti.
 *
 * "Kocluk almak kimin fikriydi" cevabi ayri vurgulaniyor: veli getirmis ve
 * ogrenci istemiyorsa kocluk bambaska bir sekilde baslamali, bunu ilk
 * gorusmede bilmek gerekiyor.
 */

const KIM_ETIKET: Record<string, string> = {
  kendim: 'Öğrenci kendisi istedi',
  ailem: 'Ailesi istedi',
  ikimiz: 'Öğrenci ve ailesi birlikte',
}

export function StudentIntakeSummary({ veri }: { veri: IntakeData }) {
  const { form, olcumler } = veri
  if (!form && olcumler.length === 0) return null

  const son = olcumler[0] ?? null
  const ilk = olcumler.length > 1 ? olcumler[olcumler.length - 1] : null
  const zayif = son ? zayifBoyutlar(son.skorlar) : []

  const satirlar: { etiket: string; deger: string | null }[] = form
    ? [
        { etiket: 'Hedefi', deger: form.goal || null },
        { etiket: 'Zorlandığı dersler', deger: form.hardSubjects || null },
        { etiket: 'Günlük rutini', deger: form.dailyRoutine || null },
        { etiket: 'Denediği yöntemler', deger: form.triedMethods || null },
        { etiket: 'Çalışma ortamı', deger: form.studyEnvironment || null },
        { etiket: 'Eklemek istediği', deger: form.notes || null },
      ].filter((s) => s.deger)
    : []

  return (
    <div className={`${PIXEL_CARD} space-y-4 p-5`}>
      <div className="flex items-center gap-2">
        <ClipboardCheck className="h-5 w-5 text-[#1B2430]" />
        <p className="font-bold text-[#1B2430]">Tanışma Formu</p>
      </div>

      {form?.whoWanted && (
        <div className={`flex items-center gap-2 rounded-xl border-4 border-[#1B2430] px-3 py-2 ${
          form.whoWanted === 'ailem' ? 'bg-[#F6EAD2]' : 'bg-white'
        }`}>
          {form.whoWanted === 'ailem' && <AlertTriangle className="h-4 w-4 shrink-0 text-[#8A5A00]" />}
          <p className="text-sm font-bold text-[#1B2430]">{KIM_ETIKET[form.whoWanted]}</p>
        </div>
      )}

      {satirlar.length > 0 && (
        <div className="space-y-2">
          {satirlar.map((s) => (
            <div key={s.etiket} className="rounded-xl border-2 border-[#1B2430] bg-white p-3">
              <p className="text-xs font-bold uppercase tracking-wide text-[#1B2430]/60">{s.etiket}</p>
              <p className="text-sm font-semibold text-[#1B2430] whitespace-pre-wrap">{s.deger}</p>
            </div>
          ))}
        </div>
      )}

      {son && (
        <div className="space-y-3 border-t-2 border-[#1B2430]/10 pt-3">
          <p className="text-sm font-bold text-[#1B2430]/70">
            Çalışma alışkanlıkları profili
            {olcumler.length > 1 && ` · ${olcumler.length} ölçüm`}
          </p>

          {zayif.length > 0 && (
            <p className="text-sm font-bold text-[#1B2430]">
              En zayıf iki alan: <span className="text-[#DD7B3A]">{zayif.map((z) => z.ad).join(' ve ')}</span>
            </p>
          )}

          <SelfAssessmentRadar
            guncel={son.skorlar}
            ilk={ilk?.skorlar ?? null}
            ilkTarih={ilk?.takenOn ?? null}
            guncelTarih={son.takenOn}
          />

          <p className="text-xs font-semibold text-[#1B2430]/60">
            Bu ölçek doğrulanmış bir psikometrik test değil; öğrencinin kendi
            beyanı. Tanı aracı olarak değil, görüşmede nereden başlanacağını
            belirlemek için kullanın.
          </p>
        </div>
      )}
    </div>
  )
}
