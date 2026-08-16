import { getExamResults } from '@/actions/exam-results'
import { ExamResultsSection } from '@/components/student/ExamResultsSection'
import { DashboardPageShell } from '@/components/layout/DashboardPageShell'

export default async function NetlerimPage() {
  const entries = await getExamResults()

  return (
    <DashboardPageShell
      title="Netlerim"
      description="Girdiğin denemeleri kaydet, netlerinin nasıl değiştiğini takip et."
    >
      <ExamResultsSection entries={entries} />

      <p className="text-xs font-semibold text-[#1B2430]/60">
        Net hesabı kesindir (LGS&apos;de 3, diğer sınavlarda 4 yanlış bir doğruyu götürür).
        Puan ve yerleştirme değerleri <strong>tahminidir</strong>: ÖSYM&apos;nin gerçek puanı
        adayların standart sapmasına göre hesaplandığı için dışarıdan birebir hesaplanamaz.
      </p>
    </DashboardPageShell>
  )
}
