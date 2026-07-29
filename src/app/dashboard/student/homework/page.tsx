import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getHomeworkForStudent } from '@/lib/homework/get-homework-list'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { HomeworkSubmissionUploader } from '@/components/homework/HomeworkSubmissionUploader'

export default async function StudentHomeworkPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: userRow } = await supabase.from('users').select('role').eq('id', user.id).single()
  let studentIds = [user.id]
  if (userRow?.role === 'parent') {
    const { data: links } = await supabase.from('guardian_links').select('student_id').eq('guardian_id', user.id)
    studentIds = (links ?? []).map((l) => l.student_id)
  }

  const homeworkList = await getHomeworkForStudent(studentIds)

  return (
    <div className="mx-auto max-w-2xl space-y-6 py-8">
      <div>
        <h1 className="text-2xl font-semibold">Ödevlerim</h1>
        <p className="text-muted-foreground">Eğitmenlerin verdiği ödevler ve teslim durumları.</p>
      </div>

      {homeworkList.length === 0 ? (
        <p className="text-muted-foreground">Henüz ödev verilmedi.</p>
      ) : (
        homeworkList.map((hw) => (
          <Card key={hw.id}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between text-base">
                {hw.title}
                <Badge variant={hw.status === 'completed' ? 'secondary' : hw.status === 'submitted' ? 'default' : 'outline'}>
                  {hw.status === 'completed' ? 'Onaylandı' : hw.status === 'submitted' ? 'Teslim Edildi' : 'Bekliyor'}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground">{hw.instructorName}</p>
              {hw.description && <p className="text-sm">{hw.description}</p>}
              {hw.dueDate && <p className="text-xs text-muted-foreground">Son tarih: {new Date(hw.dueDate).toLocaleDateString('tr-TR', { dateStyle: 'long' })}</p>}
              {hw.status !== 'completed' && <HomeworkSubmissionUploader homeworkId={hw.id} />}
            </CardContent>
          </Card>
        ))
      )}
    </div>
  )
}
