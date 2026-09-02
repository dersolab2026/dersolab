import { Badge } from '@/components/ui/badge'
import { getAllStudentsAndInstructors } from '@/lib/admin/get-all-users'
import { DeleteUserButton } from '@/components/admin/DeleteUserButton'
import { ToggleFreeTrialButton } from '@/components/admin/ToggleFreeTrialButton'
import { KatlanirBolum } from '@/components/admin/KatlanirBolum'

const APPROVAL_LABELS: Record<string, string> = {
  pending: 'Onay bekliyor',
  approved: 'Onaylı',
  rejected: 'Reddedildi',
}

function formatDate(value: string) {
  return new Date(value).toLocaleDateString('tr-TR', { dateStyle: 'medium' })
}

export default async function AdminUsersPage() {
  const { students, instructors, parents } = await getAllStudentsAndInstructors()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Kullanıcılar</h1>
        <p className="text-muted-foreground">
          {students.length} öğrenci · {instructors.length} eğitmen · {parents.length} veli
        </p>
      </div>

      <div className="space-y-3">
        <KatlanirBolum
          baslik="Eğitmenler"
          adet={instructors.length}
          ozet={`${instructors.filter((i) => i.calendarConnected).length} / ${instructors.length} eğitmenin takvimi bağlı`}
          bosMesaj="Kayıtlı eğitmen yok."
        >
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-white/10 bg-white/5">
                <tr>
                  <th className="px-3 py-2 text-left font-medium">Ad Soyad</th>
                  <th className="px-3 py-2 text-left font-medium">E-posta</th>
                  <th className="px-3 py-2 text-left font-medium">Onay Durumu</th>
                  <th className="px-3 py-2 text-left font-medium">Takvim</th>
                  <th className="px-3 py-2 text-left font-medium">Ücretsiz Ders</th>
                  <th className="px-3 py-2 text-left font-medium">Kayıt Tarihi</th>
                  <th className="px-3 py-2 text-right font-medium">İşlemler</th>
                </tr>
              </thead>
              <tbody>
                {instructors.map((u) => (
                  <tr key={u.id} className="border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition-colors">
                    <td className="px-3 py-2">{u.name || '—'}</td>
                    <td className="px-3 py-2 text-muted-foreground">{u.email}</td>
                    <td className="px-3 py-2">
                      {u.approvalStatus && (
                        <Badge variant={u.approvalStatus === 'approved' ? 'default' : u.approvalStatus === 'rejected' ? 'destructive' : 'outline'}>
                          {APPROVAL_LABELS[u.approvalStatus] ?? u.approvalStatus}
                        </Badge>
                      )}
                    </td>
                    <td className="px-3 py-2 text-muted-foreground">{u.calendarConnected ? 'Bağlı' : 'Bağlı değil'}</td>
                    <td className="px-3 py-2">
                      <ToggleFreeTrialButton instructorId={u.id} offersFreeTrial={u.offersFreeTrial} />
                    </td>
                    <td className="px-3 py-2 text-muted-foreground">{formatDate(u.createdAt)}</td>
                    <td className="px-3 py-2 text-right">
                      <DeleteUserButton userId={u.id} userName={u.name || u.email} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </KatlanirBolum>

        <KatlanirBolum
          baslik="Öğrenciler"
          adet={students.length}
          ozet={`${students.filter((s) => s.freeTrialUsed).length} / ${students.length} öğrenci tanışma dersini kullandı`}
          bosMesaj="Kayıtlı öğrenci yok."
        >
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-white/10 bg-white/5">
                <tr>
                  <th className="px-3 py-2 text-left font-medium">Ad Soyad</th>
                  <th className="px-3 py-2 text-left font-medium">E-posta</th>
                  <th className="px-3 py-2 text-left font-medium">Sınav Türü</th>
                  <th className="px-3 py-2 text-left font-medium">Kredi Bakiyesi</th>
                  <th className="px-3 py-2 text-left font-medium">Tanışma Dersi</th>
                  <th className="px-3 py-2 text-left font-medium">Kayıt Tarihi</th>
                  <th className="px-3 py-2 text-right font-medium">İşlemler</th>
                </tr>
              </thead>
              <tbody>
                {students.map((u) => (
                  <tr key={u.id} className="border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition-colors">
                    <td className="px-3 py-2">{u.name || '—'}</td>
                    <td className="px-3 py-2 text-muted-foreground">{u.email}</td>
                    <td className="px-3 py-2 text-muted-foreground">{u.gradeTrack ? u.gradeTrack.toUpperCase() : '—'}</td>
                    <td className="px-3 py-2 text-muted-foreground">{u.creditBalance}</td>
                    <td className="px-3 py-2">
                      <Badge variant={u.freeTrialUsed ? 'default' : 'outline'}>
                        {u.freeTrialUsed ? 'Yaptı' : 'Yapmadı'}
                      </Badge>
                    </td>
                    <td className="px-3 py-2 text-muted-foreground">{formatDate(u.createdAt)}</td>
                    <td className="px-3 py-2 text-right">
                      <DeleteUserButton userId={u.id} userName={u.name || u.email} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </KatlanirBolum>

        <KatlanirBolum
          baslik="Veliler"
          adet={parents.length}
          ozet={`${parents.filter((p) => p.linkedStudents.length > 0).length} / ${parents.length} velinin bağlı öğrencisi var`}
          bosMesaj="Kayıtlı veli yok."
        >
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-white/10 bg-white/5">
                <tr>
                  <th className="px-3 py-2 text-left font-medium">Ad Soyad</th>
                  <th className="px-3 py-2 text-left font-medium">E-posta</th>
                  <th className="px-3 py-2 text-left font-medium">İzlediği Öğrenciler</th>
                  <th className="px-3 py-2 text-left font-medium">Kayıt Tarihi</th>
                  <th className="px-3 py-2 text-right font-medium">İşlemler</th>
                </tr>
              </thead>
              <tbody>
                {parents.map((u) => (
                  <tr key={u.id} className="border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition-colors">
                    <td className="px-3 py-2">{u.name || '—'}</td>
                    <td className="px-3 py-2 text-muted-foreground">{u.email}</td>
                    <td className="px-3 py-2">
                      {u.linkedStudents.length === 0 ? (
                        // Veli hesabi acip kodu henuz girmemis olabilir; bu
                        // normal bir ara durum, hata degil.
                        <span className="text-muted-foreground">Bağlı öğrenci yok</span>
                      ) : (
                        u.linkedStudents.join(', ')
                      )}
                    </td>
                    <td className="px-3 py-2 text-muted-foreground">{formatDate(u.createdAt)}</td>
                    <td className="px-3 py-2 text-right">
                      <DeleteUserButton userId={u.id} userName={u.name || u.email} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </KatlanirBolum>
      </div>
    </div>
  )
}
