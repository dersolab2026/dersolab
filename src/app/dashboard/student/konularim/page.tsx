import { redirect } from 'next/navigation'
import { Info } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { listTopics, getTopicStatuses } from '@/actions/topics'
import { getExamResults } from '@/actions/exam-results'
import { TopicTracker } from '@/components/student/TopicTracker'
import { DashboardPageShell } from '@/components/layout/DashboardPageShell'
import type { ExamType } from '@/lib/exams/scoring'

export default async function KonularimPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // Hangi sinav turunu gosterecegimizi ogrencinin denemelerinden anliyoruz;
  // ayrica bir secim yaptirmak gereksiz bir adim olurdu.
  const denemeler = await getExamResults()
  const sayac = new Map<string, number>()
  for (const d of denemeler) sayac.set(d.examType, (sayac.get(d.examType) ?? 0) + 1)
  const tur = ([...sayac.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] ?? 'tyt') as ExamType

  const [konular, durumlar] = await Promise.all([
    listTopics(tur),
    getTopicStatuses(),
  ])

  return (
    <DashboardPageShell
      title="Konularım"
      description="Hangi konuyu işledin, hangisine soru çözdün, hangisini tekrar ettin."
    >
      <div className="flex items-start gap-2 rounded-xl border-4 border-[#1B2430] bg-[#F4F1E8] px-4 py-3">
        <Info className="mt-0.5 h-4 w-4 shrink-0 text-[#1B2430]/70" />
        <p className="text-sm font-semibold text-[#1B2430]/80">
          Bu çizelgeyi koçun da görebilir.
        </p>
      </div>

      <TopicTracker examType={tur} konular={konular} durumlar={durumlar} />
    </DashboardPageShell>
  )
}
