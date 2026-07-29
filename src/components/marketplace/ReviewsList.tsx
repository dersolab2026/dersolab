import { StarRating } from '@/components/reviews/StarRating'
import type { InstructorReview } from '@/lib/marketplace/get-instructor-reviews'

interface ReviewsListProps {
  reviews: InstructorReview[]
  averageRating: number
  reviewCount: number
}

export function ReviewsList({ reviews, averageRating, reviewCount }: ReviewsListProps) {
  if (reviewCount === 0) return <p className="text-sm text-muted-foreground">Henüz değerlendirme yok.</p>

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <StarRating rating={averageRating} size={20} />
        <span className="font-medium">{averageRating.toFixed(1)}</span>
        <span className="text-sm text-muted-foreground">({reviewCount} değerlendirme)</span>
      </div>
      <div className="space-y-3">
        {reviews.map((review) => (
          <div key={review.id} className="border-b pb-3 last:border-0">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">{review.studentName}</span>
              <StarRating rating={review.rating} size={14} />
            </div>
            {review.comment && <p className="mt-1 text-sm text-muted-foreground">{review.comment}</p>}
            <p className="mt-1 text-xs text-muted-foreground">
              {new Date(review.createdAt).toLocaleDateString('tr-TR', { dateStyle: 'medium' })}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
