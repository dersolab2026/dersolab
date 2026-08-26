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

  return (
    <DashboardPageShell
      title="Ders Paketleri"
      description="Kredi satın alıp dilediğin eğitmenle ders planla."
    >
      {success && <p className="font-semibold text-[var(--ikincil-yazi)]">Ödeme alındı, krediler hesabına eklendi.</p>}
      {canceled && <p className="font-semibold text-[var(--yazi)]/70">Ödeme tamamlanmadı.</p>}

      <div className={`${PIXEL_CARD} p-5 space-y-3`}>
        <div>
          <p className="text-sm font-semibold text-[var(--yazi)]/70">Kalan Kredin</p>
          <p className="text-3xl font-bold text-[var(--yazi)]">{creditSummary.remaining}</p>
        </div>
        <div className="grid grid-cols-2 gap-3 pt-2 border-t-2 border-[var(--cizgi)]/10">
          <div>
            <p className="text-xs font-semibold text-[var(--yazi)]/60">Ders</p>
            <p className="font-bold text-[var(--yazi)]">{creditSummary.lessonCount} ders · {creditSummary.lessonCreditsUsed} kredi</p>
          </div>
          <div>
            <p className="text-xs font-semibold text-[var(--yazi)]/60">Koçluk Seansı</p>
            <p className="font-bold text-[var(--yazi)]">{creditSummary.guidanceCount} seans · {creditSummary.guidanceCreditsUsed} kredi</p>
          </div>
        </div>
        <p className="text-xs font-semibold text-[var(--yazi)]/60">1 ders kredisi, 40 dakikalık bir derse karşılık gelir.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {packages.map((pkg) => (
          <div key={pkg.id} className={`${PIXEL_CARD} p-5 space-y-2`}>
            <p className="font-bold text-[var(--yazi)]">{pkg.title}</p>
            <p className="text-2xl font-bold text-[var(--yazi)]">{pkg.price.toLocaleString('tr-TR')} ₺</p>
            <p className="text-sm font-semibold text-[var(--ikincil-yazi)]">{pkg.creditAmount} ders kredisi</p>
            {pkg.description && <p className="text-sm font-semibold text-[var(--yazi)]/70">{pkg.description}</p>}
            <PurchasePackageButton shopierProductUrl={pkg.shopierProductUrl} />
          </div>
        ))}
      </div>
    </DashboardPageShell>
  )
}
