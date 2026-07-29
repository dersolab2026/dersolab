import { notFound, redirect } from 'next/navigation'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { createClient } from '@/lib/supabase/server'
import { getInstructorById, getInstructorEducation } from '@/lib/marketplace/get-instructors'
import { getInstructorReviews } from '@/lib/marketplace/get-instructor-reviews'
import { getGuardianStudents } from '@/lib/marketplace/get-guardian-students'
import { InstructorBookingSection } from '@/components/booking/InstructorBookingSection'
import { StudentSelector } from '@/components/booking/StudentSelector'
import { EducationList } from '@/components/marketplace/EducationList'
import { IntroVideoPlayer } from '@/components/marketplace/IntroVideoPlayer'
import { ReviewsList } from '@/components/marketplace/ReviewsList'

interface InstructorDetailPageProps {
  params: Promise<{ id: string }>
}

export default async function InstructorDetailPage({ params }: InstructorDetailPageProps) {
  const { id } = await params
  const instructor = await getInstructorById(id)
  if (!instructor) notFound()

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: userRecord } = await supabase.from('users').select('role').eq('id', user.id).single()

  const education = await getInstructorEducation(instructor.userId)
  const reviews = await getInstructorReviews(instructor.userId)

  const initials = instructor.name.split(' ').map((p) => p[0]).slice(0, 2).join('').toUpperCase()

  return (
    <div className="mx-auto max-w-3xl space-y-6 py-8">
      <div className="flex items-center gap-4">
        <Avatar className="h-16 w-16">
          <AvatarImage src={instructor.avatarUrl ?? undefined} alt={instructor.name} />
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
        <div>
          <h1 className="text-2xl font-semibold">{instructor.name}</h1>
          <p className="text-muted-foreground">{instructor.lessonPrice} ₺ / 40 dakikalık ders</p>
          <div className="mt-1 flex flex-wrap gap-1">
            {instructor.subjects.map((s) => <Badge key={s} variant="secondary">{s}</Badge>)}
          </div>
        </div>
      </div>

      {instructor.bio && <p className="text-muted-foreground">{instructor.bio}</p>}

      <IntroVideoPlayer videoUrl={instructor.introVideoUrl} />
      <EducationList entries={education} />

      {instructor.isCalendarConnected ? (
        userRecord?.role === 'parent' ? (
          <StudentSelector instructorId={instructor.userId} students={await getGuardianStudents(user.id)} />
        ) : (
          <InstructorBookingSection instructorId={instructor.userId} studentId={user.id} />
        )
      ) : (
        <p className="rounded-md border border-dashed p-4 text-sm text-muted-foreground">
          Bu eğitmen henüz takvimini bağlamadı, rezervasyon şu anda açık değil.
        </p>
      )}

      <ReviewsList reviews={reviews} averageRating={instructor.averageRating} reviewCount={instructor.reviewCount} />
    </div>
  )
}
