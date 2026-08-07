import { Badge } from '@/components/ui/badge'
import { getAllStudentsAndInstructors } from '@/lib/admin/get-all-users'

const ROLE_LABELS: Record<string, string> = {
  student: 'Öğrenci',
  parent: 'Veli',
  instructor: 'Eğitmen',
}

const APPROVAL_LABELS: Record<string, string> = {
  pending: 'Onay bekliyor',
  approved: 'Onaylı',
  rejected: 'Reddedildi',
}

export default async function AdminUsersPage() {
  const users = await getAllStudentsAndInstructors()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Kullanıcılar</h1>
        <p className="text-muted-foreground">Kayıtlı öğrenci, veli ve eğitmenler ({users.length}).</p>
      </div>

      <div className="overflow-x-auto rounded-md border">
        <table className="w-full text-sm">
          <thead className="border-b bg-muted/50">
            <tr>
              <th className="px-3 py-2 text-left font-medium">Ad Soyad</th>
              <th className="px-3 py-2 text-left font-medium">E-posta</th>
              <th className="px-3 py-2 text-left font-medium">Rol</th>
              <th className="px-3 py-2 text-left font-medium">Durum</th>
              <th className="px-3 py-2 text-left font-medium">Kayıt Tarihi</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-b last:border-0">
                <td className="px-3 py-2">{u.name || '—'}</td>
                <td className="px-3 py-2 text-muted-foreground">{u.email}</td>
                <td className="px-3 py-2">
                  <Badge variant="outline">{ROLE_LABELS[u.role] ?? u.role}</Badge>
                </td>
                <td className="px-3 py-2">
                  {u.role === 'student' && u.gradeTrack && (
                    <span className="text-muted-foreground">{u.gradeTrack.toUpperCase()}</span>
                  )}
                  {u.role === 'instructor' && u.approvalStatus && (
                    <Badge variant={u.approvalStatus === 'approved' ? 'default' : u.approvalStatus === 'rejected' ? 'destructive' : 'outline'}>
                      {APPROVAL_LABELS[u.approvalStatus] ?? u.approvalStatus}
                    </Badge>
                  )}
                  {u.role === 'instructor' && (
                    <span className="ml-2 text-xs text-muted-foreground">
                      {u.calendarConnected ? 'Takvim bağlı' : 'Takvim bağlı değil'}
                    </span>
                  )}
                </td>
                <td className="px-3 py-2 text-muted-foreground">
                  {new Date(u.createdAt).toLocaleDateString('tr-TR', { dateStyle: 'medium' })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
