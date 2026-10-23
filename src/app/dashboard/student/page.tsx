import { redirect } from 'next/navigation'

export default function StudentDashboardRootPage() {
  redirect('/dashboard/student/bookings')
}
