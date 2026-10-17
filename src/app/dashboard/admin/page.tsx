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
        <Card className="border-orange-500/30 bg-orange-500/[0.05]">
          <CardHeader>
            <CardTitle className="text-sm font-semibold text-orange-400">✨ Sosyal Medya Ajanı</CardTitle>
          </CardHeader>
          <CardContent className="space-y-1.5">
            <p className="text-xs text-muted-foreground">Instagram için AI içerik üretimi, şablon tasarımı ve onay merkezi</p>
            <Link href="/social" className="inline-block text-xs font-bold text-orange-400 hover:underline pt-1">
              Stüdyoyu Aç →
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
