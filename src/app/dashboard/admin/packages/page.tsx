import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { getAllPackagesForAdmin } from '@/lib/marketplace/get-packages'
import { PackageFormDialog } from '@/components/admin/PackageFormDialog'

export default async function AdminPackagesPage() {
  const packages = await getAllPackagesForAdmin()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Paket Yönetimi</h1>
          <p className="text-muted-foreground">Öğrencilerin satın alabileceği kredi paketleri.</p>
        </div>
        <PackageFormDialog />
      </div>

      {packages.length === 0 ? (
        <p className="text-muted-foreground">Henüz paket eklenmedi.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {packages.map((pkg) => (
            <Card key={pkg.id}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between text-base">
                  {pkg.title}
                  <Badge variant={pkg.isActive ? 'default' : 'outline'}>{pkg.isActive ? 'Satışta' : 'Pasif'}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground">{pkg.creditAmount} kredi — {pkg.price.toLocaleString('tr-TR')} ₺</p>
                {pkg.description && <p className="text-sm text-muted-foreground">{pkg.description}</p>}
                <PackageFormDialog
                  packageId={pkg.id}
                  initialTitle={pkg.title}
                  initialDescription={pkg.description ?? ''}
                  initialCreditAmount={pkg.creditAmount}
                  initialPrice={pkg.price}
                  initialIsActive={pkg.isActive}
                />
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
