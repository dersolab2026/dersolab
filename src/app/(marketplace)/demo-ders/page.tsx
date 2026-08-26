import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { getDemoLessonStatus } from '@/lib/demo-lessons/get-demo-lesson-status'
import { DemoLessonRequestCard } from '@/components/demo-lessons/DemoLessonRequestCard'
import { DemoLessonEmailForm } from '@/components/demo-lessons/DemoLessonEmailForm'
import { SayfaDeseni } from '@/components/layout/SayfaDeseni'
import { oturumTemasi } from '@/lib/tema-sunucu'
import { TEMA_ACIK } from '@/lib/tema'

export default async function DemoLessonPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: userRecord } = user
    ? await supabase.from('users').select('role').eq('id', user.id).single()
    : { data: null }

  // Hoş geldin paketi öğrenciye ait bir sayfa; içeriği de bunu söylüyor
  // ("sadece öğrenci hesapları için geçerli"). Kök düzen temayı zaten
  // oturumdan ya da ziyaretçinin vitrindeki seçiminden koyuyor; burada
  // yalnızca hiçbiri yoksa öğrenciye düşüyoruz. Koşulsuz yazınca kök ile
  // bu sayfa ayrı temalarda kalıyor ve biri diğerinin jetonlarını miras
  // alıyordu.
  const kokTema = await oturumTemasi()
  const tema = TEMA_ACIK && !kokTema ? 'ogrenci' : undefined

  return (
    <div className="min-h-screen w-full bg-[var(--zemin)] relative overflow-hidden" data-tema={tema}>
      <SayfaDeseni />

      <div className="relative z-10 mx-auto max-w-2xl space-y-6 p-5 py-10">
        <div className="bg-[var(--yuzey)] rounded-2xl p-6 sm:p-8 border-4 border-[var(--cizgi)] shadow-[0_8px_0_var(--golge)]">
          <h1 className="font-sans text-2xl sm:text-3xl font-black text-[var(--yazi)] leading-snug">
            Hoş Geldin Paketi
          </h1>
          <p className="mt-2 font-sans font-semibold text-[var(--yazi)]">
            Ücretsiz tanışma dersi. Her öğrenciye bir kere, tamamen ücretsiz.
          </p>
        </div>

        {!user ? (
          <>
            <DemoLessonEmailForm />
            <p className="text-center text-sm font-semibold text-[var(--yazi)]">
              Zaten hesabın var mı?{' '}
              <Link href={`/login?kitle=${kokTema ?? 'ogrenci'}`} className="text-[var(--vurgu-yazi)] font-bold underline">Giriş Yap</Link>
            </p>
          </>
        ) : userRecord?.role === 'student' ? (
          <DemoLessonRequestCard studentId={user.id} initialStatus={await getDemoLessonStatus(user.id)} />
        ) : (
          <div className="bg-[var(--yuzey)] rounded-2xl p-6 sm:p-8 border-4 border-[var(--cizgi)] shadow-[0_8px_0_var(--golge)]">
            <p className="font-sans font-semibold text-[var(--yazi)]">
              Hoş Geldin Paketi sadece öğrenci hesapları için geçerli.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
