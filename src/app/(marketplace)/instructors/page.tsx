import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { InstructorCard } from '@/components/marketplace/InstructorCard'
import { getInstructors } from '@/lib/marketplace/get-instructors'
import { LESSON_SUBJECTS } from '@/lib/constants'

interface InstructorsPageProps {
  searchParams: Promise<{ subject?: string }>
}

export default async function InstructorsPage({ searchParams }: InstructorsPageProps) {
  const { subject } = await searchParams
  const instructors = await getInstructors({ subject })

  return (
    <div className="mx-auto max-w-5xl space-y-6 py-8">
      <div>
        <h1 className="text-2xl font-semibold">Eğitmenler</h1>
        <p className="text-muted-foreground">LGS ve YKS için branşına göre eğitmen bul.</p>
      </div>

      <div className="flex flex-wrap gap-2">
        <Link href="/instructors">
          <Badge variant={!subject ? 'default' : 'outline'}>Tümü</Badge>
        </Link>
        {LESSON_SUBJECTS.map((s) => (
          <Link key={s} href={`/instructors?subject=${encodeURIComponent(s)}`}>
            <Badge variant={subject === s ? 'default' : 'outline'}>{s}</Badge>
          </Link>
        ))}
      </div>

      {instructors.length === 0 ? (
        <p className="text-muted-foreground">Bu branşta henüz eğitmen bulunmuyor.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {instructors.map((instructor) => <InstructorCard key={instructor.userId} instructor={instructor} />)}
        </div>
      )}
    </div>
  )
}
