import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { getUnmatchedShopierPayments, getStudentOptions, unmatchedReasonLabel } from '@/lib/admin/get-unmatched-shopier-payments'
import { ResolveUnmatchedPaymentForm } from '@/components/admin/ResolveUnmatchedPaymentForm'

export default async function AdminUnmatchedPaymentsPage() {
  const [payments, students] = await Promise.all([getUnmatchedShopierPayments(), getStudentOptions()])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Eşleşmeyen Ödemeler</h1>
        <p className="text-muted-foreground">
          Shopier&apos;den gelen ama otomatik olarak bir öğrenciye bağlanamayan ödemeler. Elle bir öğrenciye bağla ya da yoksay.
        </p>
      </div>

      {payments.length === 0 ? (
        <p className="text-muted-foreground">Bekleyen eşleşmeyen ödeme yok.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {payments.map((p) => (
            <Card key={p.id}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between text-base">
                  {p.packageTitle ?? 'Bilinmeyen paket'}
                  <Badge variant="outline">{unmatchedReasonLabel(p.reason)}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <p><span className="text-muted-foreground">Sipariş:</span> {p.shopierOrderId}</p>
                {p.buyerName && <p><span className="text-muted-foreground">Alıcı:</span> {p.buyerName}</p>}
                {p.buyerEmail && <p><span className="text-muted-foreground">E-posta:</span> {p.buyerEmail}</p>}
                {p.amount != null && <p><span className="text-muted-foreground">Tutar:</span> {Number(p.amount).toLocaleString('tr-TR')} ₺</p>}
                {p.note && <p><span className="text-muted-foreground">Not:</span> {p.note}</p>}
                <p className="text-xs text-muted-foreground">{new Date(p.createdAt).toLocaleString('tr-TR')}</p>
                <ResolveUnmatchedPaymentForm paymentId={p.id} students={students} hasPackage={!!p.packageTitle} />
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
