import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getInstructorStudents } from '@/lib/students/get-instructor-students'
import { DashboardPageShell } from '@/components/layout/DashboardPageShell'
import { PIXEL_CARD } from '@/lib/theme'

const ILISKI_ETIKET: Record<string, string> = {
  ders: 'Ders',
  tanisma: 'Tanışma Dersi',
  'ders+tanisma': 'Ders + Tanışma',
}

export default async function InstructorStudentsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const ogrenciler = await getInstructorStudents()

  return (
    <DashboardPageShell
      title="Öğrencilerim"
      description="Ders verdiğin ve koçluk yaptığın öğrenciler. Deneme sonuçlarını, ödev durumunu ve çalışma günlüğünü buradan görebilirsin."
    >
      {ogrenciler.length === 0 ? (
        <p className="font-semibold text-[var(--yazi)]">
          Henüz ders verdiğin ya da koçluk yaptığın bir öğrenci yok.
        </p>
      ) : (
        <div className="space-y-3">
          {ogrenciler.map((o) => (
            <Link
              key={o.userId}
              href={`/dashboard/instructor/ogrencilerim/${o.userId}`}
              className={`${PIXEL_CARD} flex flex-wrap items-center justify-between gap-3 p-4 transition-all hover:bg-[var(--yuzey-ic)]`}
            >
              <div>
                <p className="font-bold text-[var(--yazi)]">
                  {o.name}
                  <span className="ml-2 inline-block rounded-lg border-2 border-[var(--cizgi)] bg-[var(--ikincil-zemin)] px-2 py-0.5 text-xs text-[var(--yazi-ters)]">
                    {ILISKI_ETIKET[o.iliski]}
                  </span>
                </p>
                <p className="text-sm font-semibold text-[var(--yazi)]/70">
                  {o.dersSayisi > 0 ? `${o.dersSayisi} ders` : 'Henüz ders yok'}
                  {o.sonDers ? ` · son ders ${new Date(o.sonDers).toLocaleDateString('tr-TR')}` : ''}
                </p>
              </div>
              <span className="text-sm font-bold text-[var(--vurgu-yazi)]">Detay →</span>
            </Link>
          ))}
        </div>
      )}
    </DashboardPageShell>
  )
}
