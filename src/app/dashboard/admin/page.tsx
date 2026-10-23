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
        <Card className="border-pink-500/30 bg-gradient-to-br from-pink-500/[0.07] via-purple-500/[0.04] to-cyan-500/[0.07] relative overflow-hidden">
          <div className="absolute top-2 right-2 flex items-center gap-1">
            <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-pink-500/20 text-pink-300 border border-pink-500/30">
              ⚡ Tek Tuşla Çift Yayın
            </span>
          </div>
          <CardHeader>
            <CardTitle className="text-sm font-semibold text-pink-300 flex items-center gap-1.5">
              <span>✨ Sosyal Medya Stüdyosu</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-1.5">
            <p className="text-xs text-muted-foreground">
              Instagram & TikTok için tek tuşla Story ve Gönderi yayını, AI senaryo ve görsel üretimi.
            </p>
            <div className="flex items-center gap-2 pt-1">
              <Link href="/social" className="inline-flex items-center gap-1.5 text-xs font-bold text-pink-400 hover:text-pink-300 hover:underline">
                <span>Stüdyoyu Aç (Tek Tuşla Paylaş)</span>
                <span>→</span>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
