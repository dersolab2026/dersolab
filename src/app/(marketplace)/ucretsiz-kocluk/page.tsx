import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { getFreeCoachingStatus } from '@/actions/free-coaching'
import { FreeCoachingRequestCard } from '@/components/demo-lessons/FreeCoachingRequestCard'
import { PIXEL_CARD } from '@/lib/theme'

export default async function FreeCoachingPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: userRecord } = user
    ? await supabase.from('users').select('role').eq('id', user.id).single()
    : { data: null }

  return (
    <div className="min-h-screen w-full bg-[#D5EAE3] relative overflow-hidden">
      <div
        className="absolute inset-0 z-0 opacity-40 pointer-events-none"
        style={{
          backgroundImage: 'linear-gradient(45deg, #6FA89E 25%, transparent 25%), linear-gradient(-45deg, #6FA89E 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #6FA89E 75%), linear-gradient(-45deg, transparent 75%, #6FA89E 75%)',
          backgroundSize: '40px 40px', backgroundPosition: '0 0, 0 20px, 20px -20px, -20px 0px',
        }}
      />

      <div className="relative z-10 mx-auto max-w-2xl space-y-6 p-5 py-10">
        <div className={`${PIXEL_CARD} p-6 sm:p-8`}>
          <h1 className="font-sans text-2xl sm:text-3xl font-black text-[#1B2430] leading-snug">
            1 Hafta Ücretsiz Koçluk
          </h1>
          <p className="mt-2 font-sans font-semibold text-[#1B2430]">
            Her öğrenci bir kere, bir hafta boyunca ücretsiz koçluk desteği alabilir.
          </p>
        </div>

        <div className={`${PIXEL_CARD} p-6`}>
          <h2 className="font-bold text-[#1B2430] mb-2">Bu hafta ne oluyor?</h2>
          <ul className="space-y-1.5 text-sm font-semibold text-[#1B2430]/80 list-disc pl-5">
            <li>Koçun seninle tanışır, hedefini ve sınavını konuşursunuz.</li>
            <li>Haftalık çalışma programını birlikte kurarsınız.</li>
            <li>Hafta boyunca nerede zorlandığını takip eder, yönlendirir.</li>
            <li>Kredi harcamazsın; hafta sonunda devam etmek sana kalmış.</li>
          </ul>
        </div>

        {!user ? (
          <div className={`${PIXEL_CARD} p-6 text-center space-y-3`}>
            <p className="font-semibold text-[#1B2430]">
              Talep oluşturmak için önce ücretsiz bir hesap açman gerekiyor.
            </p>
            <div className="flex flex-col sm:flex-row gap-2 justify-center">
              <Link href="/register" className="py-3 px-6 bg-[#DD7B3A] text-[#F4F1E8] font-bold rounded-xl border-4 border-[#1B2430] shadow-[0_4px_0_#1B2430] active:translate-y-1 active:shadow-none transition-all">
                Kaydol
              </Link>
              <Link href="/login" className="py-3 px-6 bg-white text-[#1B2430] font-bold rounded-xl border-4 border-[#1B2430] shadow-[0_4px_0_#1B2430] active:translate-y-1 active:shadow-none transition-all">
                Giriş Yap
              </Link>
            </div>
          </div>
        ) : userRecord?.role === 'student' ? (
          <FreeCoachingRequestCard initialStatus={await getFreeCoachingStatus(user.id)} />
        ) : (
          <div className={`${PIXEL_CARD} p-6`}>
            <p className="font-sans font-semibold text-[#1B2430]">
              Ücretsiz koçluk sadece öğrenci hesapları için geçerli.
            </p>
          </div>
        )}

        <p className="text-center text-sm font-semibold text-[#1B2430]">
          Bir de{' '}
          <Link href="/demo-ders" className="text-[#DD7B3A] font-bold underline">ücretsiz tanışma dersi</Link>
          {' '}hakkın var — ikisi ayrı.
        </p>
      </div>
    </div>
  )
}
