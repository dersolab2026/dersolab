import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getQuestionsForStudent } from '@/lib/questions/get-questions-list'
import { getStudentCreditSummary } from '@/lib/students/get-credit-summary'
import { AskQuestionForm } from '@/components/questions/AskQuestionForm'
import { QuestionCard } from '@/components/questions/QuestionCard'
import { DashboardPageShell } from '@/components/layout/DashboardPageShell'

export default async function StudentQuestionsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const [questions, creditSummary] = await Promise.all([
    getQuestionsForStudent(user.id),
    getStudentCreditSummary(user.id),
  ])

  return (
    <DashboardPageShell title="Soru Sor" description="Branşını seç, o branşı bilen bir eğitmen sorunu cevaplasın.">
      <AskQuestionForm questionCreditsRemaining={creditSummary.questionCreditsRemaining} />

      {questions.length === 0 ? (
        <p className="font-semibold text-[#1B2430]">Henüz soru sormadın.</p>
      ) : (
        <div className="space-y-4">
          {questions.map((q) => <QuestionCard key={q.id} question={q} />)}
        </div>
      )}
    </DashboardPageShell>
  )
}
