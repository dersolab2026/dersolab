import { redirect } from 'next/navigation'
import { ODEV_TIPI_ETIKET, odevTipi } from '@/lib/homework/types'
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
        <p className="font-semibold text-[var(--yazi)]">Henüz ödev verilmedi.</p>
      ) : (
        <div className="space-y-4">
          {homeworkList.map((hw) => (
            <div key={hw.id} className={`${PIXEL_CARD} p-5 space-y-2`}>
              <div className="flex items-center justify-between gap-3">
                <p className="font-bold text-[var(--yazi)]">{hw.title}</p>
                <span className={hw.status === 'completed' ? PIXEL_BADGE_ACTIVE : PIXEL_BADGE}>
                  {hw.status === 'completed' ? 'Onaylandı' : hw.status === 'submitted' ? 'Teslim Edildi' : 'Bekliyor'}
                </span>
              </div>
              <p className="text-sm font-semibold text-[var(--yazi)]/70">
                {hw.instructorName}
                {hw.homeworkType !== 'serbest' && (
                  <span className="ml-2 inline-block rounded border-2 border-[var(--cizgi)] bg-[var(--yuzey-ic)] px-1.5 text-xs font-bold text-[var(--yazi)]">
                    {ODEV_TIPI_ETIKET[hw.homeworkType]}
                  </span>
                )}
              </p>

              {(hw.resourceLabel || hw.resourceRange) && (
                <p className="text-sm font-bold text-[var(--yazi)]">
                  {hw.resourceLabel}
                  {hw.resourceLabel && hw.resourceRange ? ' · ' : ''}
                  {hw.resourceRange}
                </p>
              )}

              {hw.description && <p className="text-sm font-semibold text-[var(--yazi)]">{hw.description}</p>}

              {/* Tipin asil isi burada: ogrenci ne yapacagini biliyor. */}
              {hw.homeworkType !== 'serbest' && hw.status !== 'completed' && (
                <p className="rounded-lg border-2 border-[var(--cizgi)] bg-[var(--yuzey)] px-3 py-2 text-sm font-semibold text-[var(--yazi)]">
                  {odevTipi(hw.homeworkType).ogrenciYonergesi}
                </p>
              )}

              {hw.instructorFeedback && (
                <div className="rounded-lg border-2 border-[var(--cizgi)] bg-[var(--yuzey-ic)] px-3 py-2">
                  <p className="text-xs font-bold uppercase tracking-wide text-[var(--yazi)]/60">
                    Eğitmenin geri bildirimi
                  </p>
                  <p className="text-sm font-semibold text-[var(--yazi)]">{hw.instructorFeedback}</p>
                </div>
              )}
              {hw.dueDate && (
                <p className="text-xs font-semibold text-[var(--yazi)]/60">
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
