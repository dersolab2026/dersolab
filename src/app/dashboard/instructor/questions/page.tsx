import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getQuestionsForInstructor } from '@/lib/questions/get-questions-list'
import { AnswerQuestionCard } from '@/components/questions/AnswerQuestionCard'
import { DashboardPageShell } from '@/components/layout/DashboardPageShell'

export default async function InstructorQuestionsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const questions = await getQuestionsForInstructor(user.id)

  return (
    <DashboardPageShell title="Sorularım" description="Öğrencilerinin sorduğu soruları cevapla.">
      {questions.length === 0 ? (
        <p className="font-semibold text-[#1B2430]">Henüz sana sorulmuş bir soru yok.</p>
      ) : (
        <div className="space-y-4">
          {questions.map((q) => <AnswerQuestionCard key={q.id} question={q} />)}
        </div>
      )}
    </DashboardPageShell>
  )
}
