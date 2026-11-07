'use client'

import { useState, useTransition, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Loader2, CheckCircle2, Mic, MicOff, Sparkles } from 'lucide-react'
import { markBookingCompleted, markBookingNoShow } from '@/actions/bookings'
import { INSTRUCTOR_BUTTON_PRIMARY } from '@/lib/theme'

interface MarkCompleteDialogProps {
  bookingId: string
}

const QUICK_TAGS = [
  '✅ Konu anlatımı tamamlandı',
  '🎯 ÖSYM/MEB tipi soru çözümü yapıldı',
  '🔬 L.A.B. simülasyonu ile pekiştirildi',
  '📚 Ödev kontrolü yapıldı',
  '⚠️ Eksik kazanım tekrarı önerildi',
]

export function MarkCompleteDialog({ bookingId }: MarkCompleteDialogProps) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [notes, setNotes] = useState('')
  const [isRecording, setIsRecording] = useState(false)
  const [isPending, startTransition] = useTransition()
  const [isNoShowPending, startNoShowTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const recognitionRef = useRef<any>(null)

  function toggleTag(tag: string) {
    setNotes((prev) => {
      if (prev.includes(tag)) return prev
      return prev.trim() ? `${prev.trim()}\n• ${tag}` : `• ${tag}`
    })
  }

  function toggleVoiceDictation() {
    if (isRecording) {
      recognitionRef.current?.stop()
      setIsRecording(false)
      return
    }

    const SpeechRecognition =
      typeof window !== 'undefined'
        ? (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
        : null

    if (!SpeechRecognition) {
      setError('Tarayıcınız sesli dikte özelliğini desteklemiyor (Chrome/Edge önerilir).')
      return
    }

    try {
      const recognition = new SpeechRecognition()
      recognition.lang = 'tr-TR'
      recognition.continuous = false
      recognition.interimResults = false

      recognition.onstart = () => setIsRecording(true)
      recognition.onend = () => setIsRecording(false)
      recognition.onerror = () => setIsRecording(false)
      recognition.onresult = (event: any) => {
        const transcript = event.results?.[0]?.[0]?.transcript
        if (transcript) {
          setNotes((prev) => (prev.trim() ? `${prev.trim()} ${transcript}` : transcript))
        }
      }

      recognitionRef.current = recognition
      recognition.start()
    } catch {
      setIsRecording(false)
    }
  }

  function formatStructuredSummary() {
    const raw = notes.trim()
    if (!raw) {
      setNotes(
        `📌 Ders Özeti:\n• İşlenen Konu & Kazanım: Müfredat konusu ve örnek soru tipleri incelendi.\n• Öğrenci Katılımı: Derse odaklanması ve soru yaklaşımı olumluydu.\n• Öneri & Ödev: Konunun kalıcı olması için L.A.B. simülasyonu tekrarı ve 30 soru çözümü önerildi.`,
      )
      return
    }
    if (raw.startsWith('📌 Ders Özeti:')) return
    setNotes(
      `📌 Ders Özeti:\n${raw}\n\n💡 Sonraki Adım: İşlenen kazanımların DersoLab L.A.B. atölyesinde tekrar edilmesi ve verilen soru hedefinin tamamlanması önerilir.`,
    )
  }

  function handleSubmit() {
    setError(null)
    startTransition(async () => {
      const result = await markBookingCompleted(bookingId, notes.trim() || undefined)
      if (!result.success) { setError(result.error); return }
      setOpen(false)
      router.refresh()
    })
  }

  function handleNoShow() {
    setError(null)
    startNoShowTransition(async () => {
      const result = await markBookingNoShow(bookingId)
      if (!result.success) { setError(result.error); return }
      setOpen(false)
      router.refresh()
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button type="button" className={`${INSTRUCTOR_BUTTON_PRIMARY} gap-2 px-3 py-1.5 text-sm`}>
          <CheckCircle2 className="h-4 w-4" />
          Tamamlandı Olarak İşaretle
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Dersi tamamlandı olarak işaretle & Ders Özeti</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <div className="space-y-1.5">
            <span className="text-xs font-bold text-slate-400 block">
              Hızlı Pedagojik Etiketler (Tıkla Ekle):
            </span>
            <div className="flex flex-wrap gap-1.5">
              {QUICK_TAGS.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => toggleTag(tag)}
                  className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-slate-200 transition-colors"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between gap-2 pt-1">
            <button
              type="button"
              onClick={toggleVoiceDictation}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${
                isRecording
                  ? 'bg-red-500/20 border-red-500/40 text-red-300 animate-pulse'
                  : 'bg-white/5 hover:bg-white/10 border-white/10 text-slate-200'
              }`}
            >
              {isRecording ? <MicOff className="h-3.5 w-3.5" /> : <Mic className="h-3.5 w-3.5" />}
              <span>{isRecording ? 'Dinleniyor... (Bitirmek için tıkla)' : 'Sesli Not Ekle'}</span>
            </button>

            <button
              type="button"
              onClick={formatStructuredSummary}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-violet-500/15 hover:bg-violet-500/25 border border-violet-500/30 text-violet-200 text-xs font-bold transition-all"
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span>Veli Karnesi Formatına Dönüştür</span>
            </button>
          </div>

          <Textarea
            rows={5}
            placeholder="Ders notu (opsiyonel) — işlenen konu, öğrencinin durumu ve ödev yönlendirmesi (öğrenci ve veli görebilir)"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
          {error && <p className="text-sm text-destructive">{error}</p>}
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={() => setOpen(false)} disabled={isPending || isNoShowPending}>Vazgeç</Button>
          <Button variant="outline" onClick={handleNoShow} disabled={isPending || isNoShowPending}>
            {isNoShowPending ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Öğrenci Gelmedi'}
          </Button>
          <Button onClick={handleSubmit} disabled={isPending || isNoShowPending}>
            {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Onayla'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
