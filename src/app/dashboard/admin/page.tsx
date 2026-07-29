import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { getAdminStats } from '@/lib/admin/get-admin-stats'

export default async function AdminOverviewPage() {
  const stats = await getAdminStats()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Yönetim Paneli</h1>
        <p className="text-muted-foreground">Genel durum özeti</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader><CardTitle className="text-sm font-normal text-muted-foreground">Toplam Öğrenci</CardTitle></CardHeader>
          <CardContent><p className="text-2xl font-semibold">{stats.totalStudents}</p></CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="text-sm font-normal text-muted-foreground">Toplam Eğitmen</CardTitle></CardHeader>
          <CardContent><p className="text-2xl font-semibold">{stats.totalInstructors}</p></CardContent>
        </Card>
        <Card className={stats.pendingInstructors > 0 ? 'border-amber-400' : ''}>
          <CardHeader><CardTitle className="text-sm font-normal text-muted-foreground">Onay Bekleyen</CardTitle></CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold">{stats.pendingInstructors}</p>
            {stats.pendingInstructors > 0 && (
              <Link href="/dashboard/admin/instructors" className="text-sm text-primary underline">İncele →</Link>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="text-sm font-normal text-muted-foreground">Bu Ay Rezervasyon</CardTitle></CardHeader>
          <CardContent><p className="text-2xl font-semibold">{stats.bookingsThisMonth}</p></CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="text-sm font-normal text-muted-foreground">Bu Ay Ciro</CardTitle></CardHeader>
          <CardContent><p className="text-2xl font-semibold">{stats.revenueThisMonth.toLocaleString('tr-TR')} ₺</p></CardContent>
        </Card>
      </div>
    </div>
  )
}
