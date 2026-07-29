import Link from 'next/link'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { PlayCircle } from 'lucide-react'
import { StarRating } from '@/components/reviews/StarRating'
import type { InstructorProfile } from '@/types'

interface InstructorCardProps {
  instructor: InstructorProfile
}

export function InstructorCard({ instructor }: InstructorCardProps) {
  const initials = instructor.name.split(' ').map((p) => p[0]).slice(0, 2).join('').toUpperCase()

  return (
    <Link href={`/instructors/${instructor.userId}`}>
      <Card className="h-full transition-shadow hover:shadow-md">
        <CardHeader className="flex flex-row items-center gap-3">
          <Avatar className="h-12 w-12">
            <AvatarImage src={instructor.avatarUrl ?? undefined} alt={instructor.name} />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-semibold">{instructor.name}</p>
            <p className="text-sm text-muted-foreground">{instructor.lessonPrice} ₺ / ders</p>
          </div>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex flex-wrap gap-1">
            {instructor.subjects.map((subject) => <Badge key={subject} variant="secondary">{subject}</Badge>)}
          </div>
          {instructor.bio && <p className="line-clamp-2 text-sm text-muted-foreground">{instructor.bio}</p>}
          {instructor.reviewCount > 0 && (
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <StarRating rating={instructor.averageRating} size={14} />
              <span>{instructor.averageRating.toFixed(1)} ({instructor.reviewCount})</span>
            </div>
          )}
          {instructor.introVideoUrl && (
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <PlayCircle className="h-3.5 w-3.5" />
              Tanıtım videosu var
            </span>
          )}
        </CardContent>
        {!instructor.isCalendarConnected && (
          <CardFooter>
            <Badge variant="outline" className="text-xs">Yakında müsait</Badge>
          </CardFooter>
        )}
      </Card>
    </Link>
  )
}
