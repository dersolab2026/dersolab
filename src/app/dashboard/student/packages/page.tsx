import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getActivePackages } from '@/lib/marketplace/get-packages'
import { getStudentCreditSummary } from '@/lib/students/get-credit-summary'
import { PurchasePackageButton } from '@/components/marketplace/PurchasePackageButton'
import { DashboardPageShell } from '@/components/layout/DashboardPageShell'
import { PIXEL_CARD } from '@/lib/theme'

interface StudentPackagesPageProps {
  searchParams: Promise<{ success?: string; canceled?: string }>
}

export default async function StudentPackagesPage({ searchParams }: StudentPackagesPageProps) {
  const { success, canceled } = await searchParams
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const [packages, creditSummary] = await Promise.all([
    getActivePackages(),
    getStudentCreditSummary(user.id),
  ])

  const lessonPackages = packages.filter((p) => p.packageType === 'lesson')
  const questionPackages = packages.filter((p) => p.packageType === 'question')

  return (
    <DashboardPageShell
      title="Paketler"
      description="Kredi satın alıp dilediğin eğitmenle ders planla ya da soru sor."
    >
      {success && <p className="font-semibold text-[#6FA89E]">Ödeme alındı, krediler hesabına eklendi.</p>}
      {canceled && <p className="font-semibold text-[#1B2430]/70">Ödeme tamamlanmadı.</p>}

      <div className={`${PIXEL_CARD} p-5 space-y-3`}>
        <div>
          <p className="text-sm font-semibold text-[#1B2430]/70">Kalan Ders Kredin</p>
          <p className="text-3xl font-bold text-[#1B2430]">{creditSummary.remaining}</p>
        </div>
        <div className="grid grid-cols-2 gap-3 pt-2 border-t-2 border-[#1B2430]/10">
          <div>
            <p className="text-xs font-semibold text-[#1B2430]/60">Ders</p>
            <p className="font-bold text-[#1B2430]">{creditSummary.lessonCount} ders · {creditSummary.lessonCreditsUsed} kredi</p>
          </div>
          <div>
            <p className="text-xs font-semibold text-[#1B2430]/60">Rehberlik Seansı</p>
            <p className="font-bold text-[#1B2430]">{creditSummary.guidanceCount} seans · {creditSummary.guidanceCreditsUsed} kredi</p>
          </div>
        </div>
        <p className="text-xs font-semibold text-[#1B2430]/60">1 ders kredisi, 40 dakikalık bir derse karşılık gelir.</p>

        <div className="pt-2 border-t-2 border-[#1B2430]/10">
          <p className="text-xs font-semibold text-[#1B2430]/60">Kalan Soru Kredin</p>
          <p className="text-2xl font-bold text-[#1B2430]">{creditSummary.questionCreditsRemaining}</p>
          <p className="text-xs font-semibold text-[#1B2430]/60">Toplam {creditSummary.questionsAsked} soru sordun.</p>
        </div>
      </div>

      <div className="space-y-3">
        <h2 className="font-bold text-[#1B2430]">Ders Paketleri</h2>
        {lessonPackages.length === 0 ? (
          <p className="text-sm font-semibold text-[#1B2430]/60">Şu anda satışta ders paketi yok.</p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {lessonPackages.map((pkg) => (
              <div key={pkg.id} className={`${PIXEL_CARD} p-5 space-y-2`}>
                <p className="font-bold text-[#1B2430]">{pkg.title}</p>
                <p className="text-2xl font-bold text-[#1B2430]">{pkg.price.toLocaleString('tr-TR')} ₺</p>
                <p className="text-sm font-semibold text-[#6FA89E]">{pkg.creditAmount} ders kredisi</p>
                {pkg.description && <p className="text-sm font-semibold text-[#1B2430]/70">{pkg.description}</p>}
                <PurchasePackageButton shopierProductUrl={pkg.shopierProductUrl} />
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="space-y-3">
        <h2 className="font-bold text-[#1B2430]">Soru Paketleri</h2>
        {questionPackages.length === 0 ? (
          <p className="text-sm font-semibold text-[#1B2430]/60">Şu anda satışta soru paketi yok.</p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {questionPackages.map((pkg) => (
              <div key={pkg.id} className={`${PIXEL_CARD} p-5 space-y-2`}>
                <p className="font-bold text-[#1B2430]">{pkg.title}</p>
                <p className="text-2xl font-bold text-[#1B2430]">{pkg.price.toLocaleString('tr-TR')} ₺</p>
                <p className="text-sm font-semibold text-[#6FA89E]">{pkg.creditAmount} soru hakkı</p>
                {pkg.description && <p className="text-sm font-semibold text-[#1B2430]/70">{pkg.description}</p>}
                <PurchasePackageButton shopierProductUrl={pkg.shopierProductUrl} />
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardPageShell>
  )
}
