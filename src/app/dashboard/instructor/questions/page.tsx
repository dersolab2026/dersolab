import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getOpenQuestionPool, getAnsweredQuestionsForInstructor } from '@/lib/questions/get-questions-list'
import { AnswerQuestionCard } from '@/components/questions/AnswerQuestionCard'
import { DashboardPageShell } from '@/components/layout/DashboardPageShell'

export default async function InstructorQuestionsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const [openPool, answered] = await Promise.all([
    getOpenQuestionPool(),
    getAnsweredQuestionsForInstructor(user.id),
  ])

  return (
    <DashboardPageShell title="Sorularım" description="Branşına uyan açık sorular ve daha önce cevapladıkların.">
      <div className="space-y-3">
        <h2 className="font-bold text-[#1B2430]">Açık Havuz</h2>
        {openPool.length === 0 ? (
          <p className="font-semibold text-[#1B2430]">Şu anda branşına uyan bekleyen soru yok.</p>
        ) : (
          <div className="space-y-4">
            {openPool.map((q) => <AnswerQuestionCard key={q.id} question={q} />)}
          </div>
        )}
      </div>

      <div className="space-y-3">
        <h2 className="font-bold text-[#1B2430]">Cevapladıklarım</h2>
        {answered.length === 0 ? (
          <p className="font-semibold text-[#1B2430]">Henüz cevapladığın bir soru yok.</p>
        ) : (
          <div className="space-y-4">
            {answered.map((q) => <AnswerQuestionCard key={q.id} question={q} />)}
          </div>
        )}
      </div>
    </DashboardPageShell>
  )
}
