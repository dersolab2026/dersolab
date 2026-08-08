import { getAllStudentsAndInstructors } from '@/lib/admin/get-all-users'
import { getSentAdminNotifications } from '@/actions/admin'
import { AdminNotificationForm } from '@/components/admin/AdminNotificationForm'
import { SentNotificationsList } from '@/components/admin/SentNotificationsList'

export default async function AdminNotificationsPage() {
  const { students, parents, instructors } = await getAllStudentsAndInstructors()
  const sentBatches = await getSentAdminNotifications()

  const users = [
    ...students.map((u) => ({ id: u.id, name: u.name, email: u.email, role: 'student' as const })),
    ...parents.map((u) => ({ id: u.id, name: u.name, email: u.email, role: 'parent' as const })),
    ...instructors.map((u) => ({ id: u.id, name: u.name, email: u.email, role: 'instructor' as const })),
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Bildirim Gönder</h1>
        <p className="text-muted-foreground">
          İstediğin kitleye ya da belirli bir kişiye uygulama içi bildirim gönder.
        </p>
      </div>

      <AdminNotificationForm users={users} />
      <SentNotificationsList initialBatches={sentBatches} />
    </div>
  )
}
