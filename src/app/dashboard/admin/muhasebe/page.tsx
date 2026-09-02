import { Badge } from '@/components/ui/badge'
import { kisaTarihSaat } from '@/lib/format/datetime'
import { getAllStudentsAndInstructors } from '@/lib/admin/get-all-users'
import { CopyIbanButton } from '@/components/admin/CopyIbanButton'

function formatIban(iban: string) {
  return iban.replace(/(.{4})/g, '$1 ').trim()
}

function formatDate(value: string) {
  return kisaTarihSaat(value)
}

export default async function AdminMuhasebePage() {
  const { instructors } = await getAllStudentsAndInstructors()
  const withIban = instructors.filter((i) => i.payoutIban)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Muhasebe</h1>
        <p className="text-muted-foreground">
          Eğitmenlerin ödeme (IBAN) bilgileri — {withIban.length} / {instructors.length} eğitmen bilgilerini girdi.
        </p>
      </div>

      {instructors.length === 0 ? (
        <p className="text-sm text-muted-foreground">Kayıtlı eğitmen yok.</p>
      ) : (
        <div className="overflow-x-auto rounded-md border border-white/10">
          <table className="w-full min-w-[700px] text-sm">
            <thead className="border-b border-white/10 bg-white/5">
              <tr>
                <th className="px-3 py-2 text-left font-medium">Eğitmen</th>
                <th className="px-3 py-2 text-left font-medium">E-posta</th>
                <th className="px-3 py-2 text-left font-medium">Ödeme Adı</th>
                <th className="px-3 py-2 text-left font-medium">IBAN</th>
                <th className="px-3 py-2 text-left font-medium">Son Güncelleme</th>
              </tr>
            </thead>
            <tbody>
              {instructors.map((u) => (
                <tr key={u.id} className="border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition-colors">
                  <td className="px-3 py-2">{u.name || '—'}</td>
                  <td className="px-3 py-2 text-muted-foreground">{u.email}</td>
                  <td className="px-3 py-2">{u.payoutName || <span className="text-muted-foreground">Girilmemiş</span>}</td>
                  <td className="px-3 py-2">
                    {u.payoutIban ? (
                      <div className="flex items-center gap-2">
                        <span className="font-mono">{formatIban(u.payoutIban)}</span>
                        <CopyIbanButton iban={u.payoutIban} />
                      </div>
                    ) : (
                      <Badge variant="outline">Girilmemiş</Badge>
                    )}
                  </td>
                  <td className="px-3 py-2 text-muted-foreground">
                    {u.payoutUpdatedAt ? formatDate(u.payoutUpdatedAt) : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
