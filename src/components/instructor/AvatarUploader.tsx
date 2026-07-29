'use client'

import { useRef, useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Loader2, Camera } from 'lucide-react'
import { uploadAvatar } from '@/lib/storage/upload-avatar'

interface AvatarUploaderProps {
  userId: string
  currentAvatarUrl: string | null
  name: string
}

export function AvatarUploader({ userId, currentAvatarUrl, name }: AvatarUploaderProps) {
  const router = useRouter()
  const inputRef = useRef<HTMLInputElement>(null)
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentAvatarUrl)

  const initials = name.split(' ').map((p) => p[0]).slice(0, 2).join('').toUpperCase()

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    setError(null)
    startTransition(async () => {
      const result = await uploadAvatar(userId, file)
      if (!result.success) {
        setError(result.error ?? 'Yükleme başarısız oldu')
        return
      }
      setPreviewUrl(result.publicUrl ?? null)
      router.refresh()
    })
  }

  return (
    <div className="flex items-center gap-4">
      <Avatar className="h-20 w-20">
        <AvatarImage src={previewUrl ?? undefined} alt={name} />
        <AvatarFallback>{initials}</AvatarFallback>
      </Avatar>
      <div className="space-y-1">
        <input ref={inputRef} type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={handleFileChange} />
        <Button variant="outline" size="sm" onClick={() => inputRef.current?.click()} disabled={isPending} className="gap-2">
          {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Camera className="h-4 w-4" />}
          Fotoğraf Değiştir
        </Button>
        {error && <p className="text-xs text-destructive">{error}</p>}
      </div>
    </div>
  )
}
