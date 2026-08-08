'use client'

import { useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import { declineDemoLessonRequest } from '@/actions/demo-lessons'
import { PIXEL_BUTTON_SECONDARY } from '@/lib/theme'

interface DeclineDemoRequestButtonProps {
  requestId: string
}

export function DeclineDemoRequestButton({ requestId }: DeclineDemoRequestButtonProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  function handleClick() {
    startTransition(async () => {
      await declineDemoLessonRequest(requestId)
      router.refresh()
    })
  }

  return (
    <button type="button" onClick={handleClick} disabled={isPending} className={`${PIXEL_BUTTON_SECONDARY} px-3 py-1.5 text-sm`}>
      {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Reddet'}
    </button>
  )
}
