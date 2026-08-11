import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getStudentInstructors } from '@/lib/questions/get-student-instructors'
import { getQuestionsForStudent } from '@/lib/questions/get-questions-list'
import { AskQuestionForm } from '@/components/questions/AskQuestionForm'
import { QuestionCard } from '@/components/questions/QuestionCard'
import { DashboardPageShell } from '@/components/layout/DashboardPageShell'

export default async function StudentQuestionsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const [instructors, questions] = await Promise.all([
    getStudentInstructors(user.id),
    getQuestionsForStudent(user.id),
  ])

  return (
    <DashboardPageShell title="Soru Sor" description="Ders aldığın eğitmenlere soru sorabilirsin.">
      <AskQuestionForm instructors={instructors} />

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
