'use client'

import { useRef, useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, Upload } from 'lucide-react'
import { updateIntroVideo } from '@/actions/instructor-profile'
import { uploadIntroVideo } from '@/lib/storage/upload-intro-video'
import { parseVideoUrl } from '@/lib/video/parse-video-url'
import { useToast } from '@/components/ui/Toast'
import { INSTRUCTOR_BUTTON_PRIMARY, PIXEL_BUTTON_SECONDARY, PIXEL_INPUT } from '@/lib/theme'

interface IntroVideoEditorProps {
  initialUrl: string | null
  userId: string
}

export function IntroVideoEditor({ initialUrl, userId }: IntroVideoEditorProps) {
  const router = useRouter()
  const { showToast } = useToast()
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
      showToast(url.trim() ? 'Tanıtım videon kaydedildi.' : 'Tanıtım videon kaldırıldı.')
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
      showToast('Tanıtım videon yüklendi.')
      router.refresh()
    })
  }

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <input
          placeholder="https://youtube.com/watch?v=..."
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className={`${PIXEL_INPUT} py-2`}
        />
        <button onClick={handleSaveLink} disabled={isPending} className={`${INSTRUCTOR_BUTTON_PRIMARY} px-4 py-2 text-sm shrink-0`}>
          {isPending && !isUploading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Kaydet'}
        </button>
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-xs font-semibold text-slate-400">veya</span>
        <input ref={inputRef} type="file" accept="video/mp4,video/quicktime,video/webm" className="hidden" onChange={handleFileChange} />
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={isUploading}
          className={`${PIXEL_BUTTON_SECONDARY} gap-2 px-3 py-1.5 text-sm`}
        >
          {isUploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
          {isUploading ? 'Yükleniyor...' : 'Video Dosyası Yükle'}
        </button>
        <span className="text-xs font-semibold text-slate-400">en fazla 200 MB</span>
      </div>

      {url.trim() && !embedPreview && !isDirectFile && (
        <p className="text-sm font-semibold text-red-600">Bu link tanınmadı — YouTube/Vimeo linki ya da dosya yükle</p>
      )}

      {embedPreview && (
        <div className="aspect-video w-full max-w-md overflow-hidden rounded-xl border border-white/10">
          <iframe src={embedPreview.embedUrl} className="h-full w-full" allowFullScreen />
        </div>
      )}
      {isDirectFile && (
        <video src={url} controls className="aspect-video w-full max-w-md rounded-xl border border-white/10" />
      )}

      {error && <p className="text-sm font-semibold text-red-600">{error}</p>}
    </div>
  )
}
