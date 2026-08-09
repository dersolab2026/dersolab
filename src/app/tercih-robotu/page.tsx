import { createClient } from '@/lib/supabase/server'
import { getYokAtlasIlListesi } from '@/lib/yok-atlas/search-programs'
import { TercihRobotuForm } from '@/components/tercih-robotu/TercihRobotuForm'

export default async function TercihRobotuPage() {
  const illar = await getYokAtlasIlListesi()

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  let currentUserRole: 'student' | 'parent' | 'instructor' | 'admin' | null = null
  if (user) {
    const { data: userRow } = await supabase.from('users').select('role').eq('id', user.id).single()
    currentUserRole = (userRow?.role as typeof currentUserRole) ?? null
  }

  return (
    <div className="min-h-screen w-full bg-[#D5EAE3] relative overflow-hidden">
      <div className="relative z-10 mx-auto max-w-3xl space-y-6 p-5 py-10">
        <div className="bg-[#F4F1E8] rounded-2xl p-6 sm:p-8 border-4 border-[#1B2430] shadow-[0_8px_0_#1B2430]">
          <h1 className="font-sans text-2xl sm:text-3xl font-black text-[#1B2430] leading-snug">Tercih Robotu</h1>
          <p className="mt-2 font-sans font-semibold text-[#1B2430]/70">
            Başarı sıralamana göre girebileceğin bölümleri gör. Veriler YÖK Atlas&apos;ın resmi verilerinden alınmıştır.
          </p>
        </div>
        <TercihRobotuForm illar={illar} isLoggedIn={!!user} currentUserRole={currentUserRole} />
      </div>
    </div>
  )
}
