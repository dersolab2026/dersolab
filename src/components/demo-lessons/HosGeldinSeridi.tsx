'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, Gift } from 'lucide-react'
import { requestDemoLesson } from '@/actions/demo-lessons'
import { useToast } from '@/components/ui/Toast'
import type { DemoLessonStatus } from '@/lib/demo-lessons/get-demo-lesson-status'
import { PIXEL_BUTTON_PRIMARY } from '@/lib/theme'

/**
 * Hoş geldin paketi şeridi — öğrencinin ana sayfasının en üstünde.
 *
 * Ayrı bir sayfaya (/demo-ders) gitmeden hakkını buradan alabiliyor.
 * Talep mantığı `/demo-ders`'teki kartla AYNI sunucu eylemini çağırıyor;
 * kopyalanmadı, yoksa biri değişince diğeri geride kalırdı.
 *
 * NE ZAMAN GÖRÜNÜR:
 *   hak duruyor  -> panel + buton
 *   talep beklemede -> tek satır durum, buton yok
 *   ders atandı / hak kullanıldı -> hiç görünmez
 * Kullanılmış bir hakkı ana sayfada sürekli hatırlatmak yer israfı;
 * ders zaten aşağıdaki listede çıkıyor.
 *
 * Görsel dili ana sayfanın hero'suyla aynı: dolgulu ikincil zemin ve
 * kitle motifi. Böylece "duyuru" olduğu ilk bakışta anlaşılıyor,
 * normal içerik kartlarıyla karışmıyor.
 */
export function HosGeldinSeridi({ studentId, durum }: { studentId: string; durum: DemoLessonStatus }) {
  const router = useRouter()
  const { showToast } = useToast()
  const [isPending, startTransition] = useTransition()
  const [hata, setHata] = useState<string | null>(null)

  if (durum.freeTrialUsed || durum.requestStatus === 'assigned') return null

  const bekliyor = durum.requestStatus === 'pending'

  function talepEt() {
    setHata(null)
    startTransition(async () => {
      const sonuc = await requestDemoLesson(studentId)
      if (!sonuc.success) { setHata(sonuc.error); return }
      showToast('Talebin alındı, en kısa sürede dönüş yapılacak.')
      router.refresh()
    })
  }

  return (
    <div className="rounded-2xl border-4 border-[var(--cizgi)] bg-[var(--ikincil-zemin)] p-5 shadow-[0_6px_0_var(--golge)] sm:p-6">
      {/* Dar ekranda alt alta: yan yana kalirsa buton (238px) metne yer
          birakmiyor, metin blogu 33px'e cokup aciklama 8 satira boluniyordu. */}
      <div className="flex flex-col items-stretch gap-4 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
        <div className="min-w-0 sm:flex-1">
          <p className="flex items-center gap-2 font-bold text-[var(--yazi-ters)]">
            <Gift className="h-4 w-4 shrink-0" aria-hidden />
            Hoş Geldin Paketin
          </p>
          <p className="mt-1 text-sm font-semibold text-[var(--yazi-ters)]/85">
            {bekliyor
              ? 'Talebin alındı, uygun bir eğitmen bekleniyor.'
              : 'Ücretsiz tanışma dersi. Kredi harcamıyorsun, kart bilgisi istemiyoruz.'}
          </p>
          {hata && <p className="mt-2 text-sm font-semibold text-[var(--tehlike)]">{hata}</p>}
        </div>

        {!bekliyor && (
          <button
            type="button"
            onClick={talepEt}
            disabled={isPending}
            className={`${PIXEL_BUTTON_PRIMARY} w-full shrink-0 gap-2 px-5 py-2.5 sm:w-auto`}
          >
            {isPending ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : null}
            Hoş Geldin Paketini Al
          </button>
        )}
      </div>
    </div>
  )
}
