import { createAdminClient } from '@/lib/supabase/admin'
import { SyncYokAtlasButton } from '@/components/admin/SyncYokAtlasButton'

export default async function AdminTercihRobotuPage() {
  const admin = createAdminClient()
  const { count } = await admin.from('yok_atlas_programs').select('*', { count: 'exact', head: true })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Tercih Robotu Verisi</h1>
        <p className="text-muted-foreground">
          YÖK Atlas&apos;ın resmi API&apos;sinden taban puan/başarı sıralaması verisini çeker. Yılda bir, YKS
          sonuçları açıklandıktan sonra yeniden çalıştırılmalı.
        </p>
      </div>
      <p className="text-sm text-muted-foreground">Şu anda kayıtlı program sayısı: {count ?? 0}</p>
      <SyncYokAtlasButton />
    </div>
  )
}
