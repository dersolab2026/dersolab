import { Info } from 'lucide-react'
import { getExamResults } from '@/actions/exam-results'
import { getMyTargets } from '@/lib/students/get-my-targets'
import { TargetPanel } from '@/components/student/TargetPanel'
import { requiresTrack } from '@/lib/exams/structure'
import { ExamResultsSection } from '@/components/student/ExamResultsSection'
import { ExamAnalysis } from '@/components/student/ExamAnalysis'
import { DashboardPageShell } from '@/components/layout/DashboardPageShell'

export default async function NetlerimPage() {
  const [entries, targets] = await Promise.all([getExamResults(), getMyTargets()])

  // Hedef netler tek bir tur uzerinden giriliyor: ogrencinin en cok deneme
  // kaydettigi tur. Hic denemesi yoksa TYT varsayiliyor.
  const enSik = entries.length > 0
    ? [...entries.reduce((m, e) => m.set(e.examType, (m.get(e.examType) ?? 0) + 1), new Map<string, number>())]
        .sort((a, b) => b[1] - a[1])[0][0]
    : 'tyt'
  const enSikTur = enSik as typeof entries[number]['examType']
  const enSikTrack = requiresTrack(enSikTur)
    ? (entries.find((e) => e.examType === enSikTur)?.track ?? 'sayisal')
    : null

  return (
    <DashboardPageShell
      title="Netlerim"
      description="Girdiğin denemeleri kaydet, netlerinin nasıl değiştiğini takip et."
    >
      {/* Denemeler artik egitmene de gorunuyor (0083); ogrenci bunu bilsin. */}
      <div className="flex items-start gap-2 rounded-xl border-4 border-[#1B2430] bg-[#F4F1E8] px-4 py-3">
        <Info className="mt-0.5 h-4 w-4 shrink-0 text-[#1B2430]/70" />
        <p className="text-sm font-semibold text-[#1B2430]/80">
          Ders aldığın eğitmenler ve koçun deneme sonuçlarını görebilir.
        </p>
      </div>

      <TargetPanel targets={targets} examType={enSikTur} track={enSikTrack} />

      <ExamAnalysis entries={entries} targetNets={targets.nets} />

      <ExamResultsSection entries={entries} />

      <p className="text-xs font-semibold text-[#1B2430]/70">
        Net hesabı kesindir (LGS&apos;de 3, diğer sınavlarda 4 yanlış bir doğruyu götürür).
        Puan ve yerleştirme değerleri <strong>tahminidir</strong>: ÖSYM&apos;nin gerçek puanı
        adayların standart sapmasına göre hesaplandığı için dışarıdan birebir hesaplanamaz.
      </p>
    </DashboardPageShell>
  )
}
