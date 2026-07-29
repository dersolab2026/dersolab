'use client'

import { useRef, useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Loader2, Upload } from 'lucide-react'
import { updateIntroVideo } from '@/actions/instructor-profile'
import { uploadIntroVideo } from '@/lib/storage/upload-intro-video'
import { parseVideoUrl } from '@/lib/video/parse-video-url'

interface IntroVideoEditorProps {
  initialUrl: string | null
  userId: string
}

export function IntroVideoEditor({ initialUrl, userId }: IntroVideoEditorProps) {
  const router = useRouter()
  const inputRef = useRef<HTMLInputElement>(null)
  const [url, setUrl] = useState(initialUrl ?? '')
  const [isPending, startTransition] = useTransition()
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const embedPreview = url.trim() ? parseVideoUrl(url.trim()) : null
  const isDirectFile = url.trim() !== '' && !embedPreview && url.startsWith('http')

  function handleSaveLink() {
    setError(null)
    startTransition(async () => {
      const result = await updateIntroVideo(url)
      if (!result.success) {
        setError(result.error)
        return
      }
      router.refresh()
    })
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    setError(null)
    setIsUploading(true)

    startTransition(async () => {
      const uploadResult = await uploadIntroVideo(userId, file)
      if (!uploadResult.success || !uploadResult.publicUrl) {
        setError(uploadResult.error ?? 'Video yüklenemedi')
        setIsUploading(false)
        return
      }

      const saveResult = await updateIntroVideo(uploadResult.publicUrl)
      setIsUploading(false)
      if (!saveResult.success) {
        setError(saveResult.error)
        return
      }
      setUrl(uploadResult.publicUrl)
      router.refresh()
    })
  }

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <Input
          placeholder="https://youtube.com/watch?v=..."
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
        <Button size="sm" onClick={handleSaveLink} disabled={isPending}>
          {isPending && !isUploading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Kaydet'}
        </Button>
      </div>

      <div className="flex items-center gap-2">
        <span className="text-xs text-muted-foreground">veya</span>
        <input ref={inputRef} type="file" accept="video/mp4,video/quicktime,video/webm" className="hidden" onChange={handleFileChange} />
        <Button variant="outline" size="sm" onClick={() => inputRef.current?.click()} disabled={isUploading} className="gap-2">
          {isUploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
          {isUploading ? 'Yükleniyor...' : 'Video Dosyası Yükle'}
        </Button>
        <span className="text-xs text-muted-foreground">en fazla 200 MB</span>
      </div>

      {url.trim() && !embedPreview && !isDirectFile && (
        <p className="text-sm text-destructive">Bu link tanınmadı — YouTube/Vimeo linki ya da dosya yükle</p>
      )}

      {embedPreview && (
        <div className="aspect-video w-full max-w-md overflow-hidden rounded-md border">
          <iframe src={embedPreview.embedUrl} className="h-full w-full" allowFullScreen />
        </div>
      )}
      {isDirectFile && (
        <video src={url} controls className="aspect-video w-full max-w-md rounded-md border" />
      )}

      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  )
}
