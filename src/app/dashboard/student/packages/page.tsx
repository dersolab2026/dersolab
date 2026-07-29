import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getActivePackages } from '@/lib/marketplace/get-packages'
import { getGuardianStudents } from '@/lib/marketplace/get-guardian-students'
import { PackagesForStudent } from '@/components/marketplace/PackagesForStudent'
import { PurchasePackageButton } from '@/components/marketplace/PurchasePackageButton'
import { AddChildDialog } from '@/components/family/AddChildDialog'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface StudentPackagesPageProps {
  searchParams: Promise<{ success?: string; canceled?: string }>
}

export default async function StudentPackagesPage({ searchParams }: StudentPackagesPageProps) {
  const { success, canceled } = await searchParams
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: userRow } = await supabase.from('users').select('role').eq('id', user.id).single()
  const packages = await getActivePackages()

  return (
    <div className="mx-auto max-w-3xl space-y-6 py-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Ders Paketleri</h1>
          <p className="text-muted-foreground">Kredi satın alıp dilediğin eğitmenle ders planla.</p>
        </div>
        {userRow?.role === 'parent' && <AddChildDialog />}
      </div>

      {success && <p className="text-sm text-green-600">Ödeme alındı, krediler hesabına eklendi.</p>}
      {canceled && <p className="text-sm text-muted-foreground">Ödeme tamamlanmadı.</p>}

      {userRow?.role === 'parent' ? (
        <PackagesForStudent packages={packages} students={await getGuardianStudents(user.id)} />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {packages.map((pkg) => (
            <Card key={pkg.id}>
              <CardHeader>
                <CardTitle>{pkg.title}</CardTitle>
                <p className="text-2xl font-semibold">{pkg.price.toLocaleString('tr-TR')} ₺</p>
                <p className="text-sm text-muted-foreground">{pkg.creditAmount} ders kredisi</p>
              </CardHeader>
              <CardContent className="space-y-3">
                {pkg.description && <p className="text-sm text-muted-foreground">{pkg.description}</p>}
                <PurchasePackageButton packageId={pkg.id} studentId={user.id} />
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}