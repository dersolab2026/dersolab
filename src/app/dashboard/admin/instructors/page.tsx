import { getPendingInstructors } from '@/lib/admin/get-pending-instructors'
import { InstructorApprovalCard } from '@/components/admin/InstructorApprovalCard'

export default async function AdminInstructorsPage() {
  const pendingInstructors = await getPendingInstructors()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Eğitmen Onayları</h1>
        <p className="text-muted-foreground">Onaylanana kadar eğitmen marketplace'te görünmez.</p>
      </div>

      {pendingInstructors.length === 0 ? (
        <p className="text-muted-foreground">Onay bekleyen eğitmen yok.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {pendingInstructors.map((instructor) => (
            <InstructorApprovalCard key={instructor.userId} instructor={instructor} />
          ))}
        </div>
      )}
    </div>
  )
}
