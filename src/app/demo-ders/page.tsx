import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getGuardianStudents } from '@/lib/marketplace/get-guardian-students'
import { getDemoLessonStatus } from '@/lib/demo-lessons/get-demo-lesson-status'
import { DemoLessonRequestCard } from '@/components/demo-lessons/DemoLessonRequestCard'
import { DemoLessonStudentSelector } from '@/components/demo-lessons/DemoLessonStudentSelector'

export default async function DemoLessonPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/register')

  const { data: userRecord } = await supabase.from('users').select('role').eq('id', user.id).single()

  return (
    <div className="min-h-screen w-full bg-[#D5EAE3] relative overflow-hidden">
      <div
        className="absolute inset-0 z-0 opacity-40 pointer-events-none"
        style={{
          backgroundImage: 'linear-gradient(45deg, #6FA89E 25%, transparent 25%), linear-gradient(-45deg, #6FA89E 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #6FA89E 75%), linear-gradient(-45deg, transparent 75%, #6FA89E 75%)',
          backgroundSize: '40px 40px', backgroundPosition: '0 0, 0 20px, 20px -20px, -20px 0px'
        }}
      />

      <div className="relative z-10 mx-auto max-w-2xl space-y-6 p-5 py-10">
        <div className="bg-[#F4F1E8] rounded-2xl p-6 sm:p-8 border-4 border-[#1B2430] shadow-[0_8px_0_#1B2430]">
          <h1 className="font-sans text-2xl sm:text-3xl font-black text-[#1B2430] leading-snug">
            Ücretsiz Tanışma Dersi
          </h1>
          <p className="mt-2 font-sans font-semibold text-[#1B2430]">
            Her öğrenci, platformda bir kere ücretsiz tanışma dersi alabilir.
          </p>
        </div>

        {userRecord?.role === 'parent' ? (
          <DemoLessonStudentSelector
            students={await Promise.all(
              (await getGuardianStudents(user.id)).map(async (s) => {
                const status = await getDemoLessonStatus(s.studentId)
                return { ...s, requestStatus: status.requestStatus }
              })
            )}
          />
        ) : (
          <DemoLessonRequestCard studentId={user.id} initialStatus={await getDemoLessonStatus(user.id)} />
        )}
      </div>
    </div>
  )
}
