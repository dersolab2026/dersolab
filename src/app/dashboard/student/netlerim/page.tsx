import { Info } from 'lucide-react'
import { getExamResults } from '@/actions/exam-results'
import { ExamResultsSection } from '@/components/student/ExamResultsSection'
import { ExamAnalysis } from '@/components/student/ExamAnalysis'
import { DashboardPageShell } from '@/components/layout/DashboardPageShell'

export default async function NetlerimPage() {
  const entries = await getExamResults()

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

      <ExamAnalysis entries={entries} />

      <ExamResultsSection entries={entries} />

      <p className="text-xs font-semibold text-[#1B2430]/60">
        Net hesabı kesindir (LGS&apos;de 3, diğer sınavlarda 4 yanlış bir doğruyu götürür).
        Puan ve yerleştirme değerleri <strong>tahminidir</strong>: ÖSYM&apos;nin gerçek puanı
        adayların standart sapmasına göre hesaplandığı için dışarıdan birebir hesaplanamaz.
      </p>
    </DashboardPageShell>
  )
}
