export function getNotificationLink(type: string, role: 'student' | 'parent' | 'instructor' | 'admin'): string {
  // Admin hesapları eğitmen olarak da işlev görebiliyor (ör. Egemen), bu yuzden
  // ders/ödev bildirimlerinde onlari da egitmen tarafina yönlendiriyoruz.
  const isInstructorLike = role === 'instructor' || role === 'admin'

  switch (type) {
    case 'booking_created':
    case 'booking_cancelled':
    case 'booking_reminder':
    case 'lesson_completed':
    case 'lesson_missed':
      return isInstructorLike ? '/dashboard/instructor' : '/dashboard/student/bookings'
    case 'homework_assigned':
    case 'homework_completed':
      return isInstructorLike ? '/dashboard/instructor/homework' : '/dashboard/student/homework'
    case 'homework_submitted':
      return '/dashboard/instructor/homework'
    case 'demo_lesson_requested':
      return '/dashboard/instructor/demo-talepleri'
    case 'question_asked':
      return '/dashboard/instructor/questions'
    case 'question_answered':
      return '/dashboard/student/questions'
    default:
      return '/dashboard'
  }
}
