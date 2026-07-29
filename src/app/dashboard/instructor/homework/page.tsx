import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getHomeworkForInstructor } from '@/lib/homework/get-homework-list'
import { HomeworkReviewCard } from '@/components/instructor/HomeworkReviewCard'

export default async function InstructorHomeworkPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const homeworkList = await getHomeworkForInstructor(user.id)

  return (
    <div className="mx-auto max-w-2xl space-y-6 py-8">
      <div>
        <h1 className="text-2xl font-semibold">Verdiğim Ödevler</h1>
        <p className="text-muted-foreground">Öğrencilerin gönderdiği ödevleri incele ve onayla.</p>
      </div>

      {homeworkList.length === 0 ? (
        <p className="text-muted-foreground">Henüz ödev vermedin.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {homeworkList.map((hw) => (
            <HomeworkReviewCard
              key={hw.id}
              homeworkId={hw.id}
              title={`${hw.title} — ${hw.studentName}`}
              status={hw.status}
              submissions={hw.submissions.map((s) => ({ id: s.id, homeworkId: hw.id, filePath: s.filePath, fileType: s.fileType, uploadedAt: '' }))}
            />
          ))}
        </div>
      )}
    </div>
  )
}
