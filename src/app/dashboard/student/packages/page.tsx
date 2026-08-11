import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getActivePackages } from '@/lib/marketplace/get-packages'
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

  const packages = await getActivePackages()

  return (
    <DashboardPageShell
      title="Ders Paketleri"
      description="Kredi satın alıp dilediğin eğitmenle ders planla."
    >
      {success && <p className="font-semibold text-[#6FA89E]">Ödeme alındı, krediler hesabına eklendi.</p>}
      {canceled && <p className="font-semibold text-[#1B2430]/70">Ödeme tamamlanmadı.</p>}

      <div className={`${PIXEL_CARD} p-4`}>
        <p className="text-sm font-semibold text-[#1B2430]/70">1 ders kredisi, 40 dakikalık bir derse karşılık gelir.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {packages.map((pkg) => (
          <div key={pkg.id} className={`${PIXEL_CARD} p-5 space-y-2`}>
            <p className="font-bold text-[#1B2430]">{pkg.title}</p>
            <p className="text-2xl font-bold text-[#1B2430]">{pkg.price.toLocaleString('tr-TR')} ₺</p>
            <p className="text-sm font-semibold text-[#6FA89E]">{pkg.creditAmount} ders kredisi</p>
            {pkg.description && <p className="text-sm font-semibold text-[#1B2430]/70">{pkg.description}</p>}
            <PurchasePackageButton shopierProductUrl={pkg.shopierProductUrl} />
          </div>
        ))}
      </div>
    </DashboardPageShell>
  )
}
