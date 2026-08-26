'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import { updateInstructorBio } from '@/actions/instructor-profile'
import { useToast } from '@/components/ui/Toast'
import { PIXEL_BUTTON_PRIMARY } from '@/lib/theme'

const MAX_LENGTH = 400

interface BioEditorProps {
  initialBio: string | null
}

export function BioEditor({ initialBio }: BioEditorProps) {
  const router = useRouter()
  const { showToast } = useToast()
  const [bio, setBio] = useState(initialBio ?? '')
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  function handleSave() {
    setError(null)
    startTransition(async () => {
      const result = await updateInstructorBio(bio)
      if (!result.success) { setError(result.error); return }
      showToast('Tanıtım yazın kaydedildi.')
      router.refresh()
    })
  }

  return (
    <div className="space-y-2">
      <p className="text-sm font-semibold text-[var(--yazi)]/70">
        Öğrenciler seni eğitmen listesinde bu yazıyla tanıyacak. Kaç yıldır ders verdiğini,
        hangi sınava hazırladığını ve derslerinin nasıl geçtiğini birkaç cümleyle anlat.
      </p>
      <textarea
        value={bio}
        onChange={(e) => setBio(e.target.value.slice(0, MAX_LENGTH))}
        rows={4}
        placeholder="Örn: 8 yıldır lise matematik ve geometri dersleri veriyorum. Derslerimde önce konuyu örneklerle kuruyor, ardından soru çözerek pekiştiriyoruz."
        className="w-full p-3 rounded-xl border-4 border-[var(--cizgi)] bg-[var(--yuzey-ic)] text-[var(--yazi)] text-sm outline-none focus:ring-4 focus:ring-[var(--ikincil-yazi)]/50 transition-all resize-none"
      />
      <div className="flex items-center justify-between gap-3">
        <span className="text-xs font-semibold text-[var(--yazi)]/50">{bio.length} / {MAX_LENGTH}</span>
        <button type="button" onClick={handleSave} disabled={isPending} className={`${PIXEL_BUTTON_PRIMARY} px-4 py-1.5 text-sm`}>
          {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Kaydet'}
        </button>
      </div>
      {error && <p className="text-sm font-semibold text-[var(--tehlike)]">{error}</p>}
    </div>
  )
}
