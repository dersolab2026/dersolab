import { veliyeBagliOgrenciler } from '@/actions/guardian'
import { getActivePackages } from '@/lib/marketplace/get-packages'
import { GuardianPurchasePanel } from '@/components/guardian/GuardianPurchasePanel'
import { DashboardPageShell } from '@/components/layout/DashboardPageShell'

export default async function ParentPackagesPage() {
  const [ogrenciler, paketler] = await Promise.all([
    veliyeBagliOgrenciler(),
    getActivePackages(),
  ])

  return (
    <DashboardPageShell
      title="Ders Paketleri"
      description="Öğrencinizi seçin, krediyi onun hesabına yükleyin."
    >
      <GuardianPurchasePanel ogrenciler={ogrenciler} paketler={paketler} />
    </DashboardPageShell>
  )
}
