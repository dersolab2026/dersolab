'use client'

import { useState } from 'react'
import { Star } from 'lucide-react'

interface StarRatingInputProps {
  value: number
  onChange: (value: number) => void
}

export function StarRatingInput({ value, onChange }: StarRatingInputProps) {
  const [hovered, setHovered] = useState<number | null>(null)

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button key={star} type="button" onClick={() => onChange(star)} onMouseEnter={() => setHovered(star)} onMouseLeave={() => setHovered(null)} aria-label={`${star} yıldız`}>
          <Star size={28} className={(hovered ?? value) >= star ? 'fill-amber-400 text-amber-400' : 'text-muted-foreground'} />
        </button>
      ))}
    </div>
  )
}
