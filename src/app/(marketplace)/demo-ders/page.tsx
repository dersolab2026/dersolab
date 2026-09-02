import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { getDemoLessonStatus } from '@/lib/demo-lessons/get-demo-lesson-status'
import { DemoLessonRequestCard } from '@/components/demo-lessons/DemoLessonRequestCard'
import { DemoLessonEmailForm } from '@/components/demo-lessons/DemoLessonEmailForm'

export default async function DemoLessonPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: userRecord } = user
    ? await supabase.from('users').select('role').eq('id', user.id).single()
    : { data: null }

  return (
    <div className="min-h-screen w-full bg-[#050505] relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-blue-500/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="relative z-10 mx-auto max-w-2xl space-y-6 p-5 py-10">
        <div className="bg-[#0a0a0a] rounded-[2rem] p-8 sm:p-10 border border-white/5 shadow-2xl text-center">
          <h1 className="text-2xl sm:text-3xl font-black text-white leading-snug tracking-tight">
            Hoş Geldin Paketi
          </h1>
          <p className="mt-4 font-semibold text-slate-400">
            Ücretsiz tanışma dersi. Her öğrenciye bir kere, tamamen ücretsiz.
          </p>
        </div>

        {!user ? (
          <>
            <DemoLessonEmailForm />
            <p className="text-center text-sm font-semibold text-slate-400">
              Zaten hesabın var mı?{' '}
              <Link href="/login" className="text-blue-400 font-bold hover:text-blue-300 transition-colors underline">Giriş Yap</Link>
            </p>
          </>
        ) : userRecord?.role === 'student' ? (
          <DemoLessonRequestCard studentId={user.id} initialStatus={await getDemoLessonStatus(user.id)} />
        ) : (
          <div className="bg-[#0a0a0a] rounded-[2rem] p-8 sm:p-10 border border-white/5 shadow-2xl text-center">
            <p className="font-semibold text-slate-400">
              Hoş Geldin Paketi sadece öğrenci hesapları için geçerli.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
