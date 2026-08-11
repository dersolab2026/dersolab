import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getHomeworkForStudent } from '@/lib/homework/get-homework-list'
import { HomeworkSubmissionUploader } from '@/components/homework/HomeworkSubmissionUploader'
import { DashboardPageShell } from '@/components/layout/DashboardPageShell'
import { PIXEL_CARD, PIXEL_BADGE, PIXEL_BADGE_ACTIVE } from '@/lib/theme'

export default async function StudentHomeworkPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const homeworkList = await getHomeworkForStudent([user.id])

  return (
    <DashboardPageShell title="Ödevlerim" description="Eğitmenlerin verdiği ödevler ve teslim durumları.">
      {homeworkList.length === 0 ? (
        <p className="font-semibold text-[#1B2430]">Henüz ödev verilmedi.</p>
      ) : (
        <div className="space-y-4">
          {homeworkList.map((hw) => (
            <div key={hw.id} className={`${PIXEL_CARD} p-5 space-y-2`}>
              <div className="flex items-center justify-between gap-3">
                <p className="font-bold text-[#1B2430]">{hw.title}</p>
                <span className={hw.status === 'completed' ? PIXEL_BADGE_ACTIVE : PIXEL_BADGE}>
                  {hw.status === 'completed' ? 'Onaylandı' : hw.status === 'submitted' ? 'Teslim Edildi' : 'Bekliyor'}
                </span>
              </div>
              <p className="text-sm font-semibold text-[#1B2430]/70">{hw.instructorName}</p>
              {hw.description && <p className="text-sm font-semibold text-[#1B2430]">{hw.description}</p>}
              {hw.dueDate && (
                <p className="text-xs font-semibold text-[#1B2430]/60">
                  Son tarih: {new Date(hw.dueDate).toLocaleDateString('tr-TR', { dateStyle: 'long' })}
                </p>
              )}
              {hw.status !== 'completed' && <HomeworkSubmissionUploader homeworkId={hw.id} />}
            </div>
          ))}
        </div>
      )}
    </DashboardPageShell>
  )
}
