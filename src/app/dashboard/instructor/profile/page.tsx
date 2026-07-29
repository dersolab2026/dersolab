import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { AvatarUploader } from '@/components/instructor/AvatarUploader'
import { SubjectsEditor } from '@/components/instructor/SubjectsEditor'
import { EducationEditor } from '@/components/instructor/EducationEditor'
import { IntroVideoEditor } from '@/components/instructor/IntroVideoEditor'
import type { EducationEntry } from '@/types'

export default async function InstructorProfilePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: userRow } = await supabase.from('users').select('name, avatar_url').eq('id', user.id).single()
  const { data: instructorRow } = await supabase.from('instructors').select('subjects, intro_video_url').eq('user_id', user.id).single()
  const { data: educationRows } = await supabase
    .from('instructor_education')
    .select('id, institution, degree, field_of_study, start_year, end_year')
    .eq('instructor_id', user.id)
    .order('display_order', { ascending: true })

  const education: EducationEntry[] = (educationRows ?? []).map((row) => ({
    id: row.id, institution: row.institution, degree: row.degree,
    fieldOfStudy: row.field_of_study, startYear: row.start_year, endYear: row.end_year,
  }))

  return (
    <div className="mx-auto max-w-2xl space-y-8 py-8">
      <div>
        <h1 className="text-2xl font-semibold">Profilim</h1>
        <p className="text-muted-foreground">Öğrencilerin marketplace'te göreceği bilgiler.</p>
      </div>
      <AvatarUploader userId={user.id} currentAvatarUrl={userRow?.avatar_url ?? null} name={userRow?.name ?? ''} />
      <div>
        <h2 className="mb-2 font-medium">Branşlar</h2>
        <SubjectsEditor initialSubjects={instructorRow?.subjects ?? []} />
      </div>
      <div>
        <h2 className="mb-2 font-medium">Eğitim Bilgileri</h2>
        <EducationEditor initialEntries={education} />
      </div>
      <div>
        <h2 className="mb-2 font-medium">Tanıtım Videosu</h2>
        <IntroVideoEditor initialUrl={instructorRow?.intro_video_url ?? null} userId={user.id} />
      </div>
    </div>
  )
}
