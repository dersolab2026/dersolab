'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import { veliBaginiKopar } from '@/actions/guardian'
import { useToast } from '@/components/ui/Toast'

/**
 * Bagi yalnizca veli koparabiliyor (urun karari); bu yuzden buton veli
 * tarafinda. Islem geri alinabilir: ogrenci yeni bir kod uretip tekrar
 * baglayabilir, o yuzden ekstra onay diyalogu yerine tek tiklama yeterli
 * ama yine de yanlislikla basilmasin diye iki adimli.
 */
export function UnlinkStudentButton({ studentId, studentName }: { studentId: string; studentName: string }) {
  const router = useRouter()
  const { showToast } = useToast()
  const [onay, setOnay] = useState(false)
  const [isPending, startTransition] = useTransition()

  function kopar() {
    startTransition(async () => {
      const sonuc = await veliBaginiKopar(studentId)
      if (!sonuc.success) { showToast(sonuc.error); return }
      showToast(`${studentName} bağlantısı kaldırıldı.`)
      setOnay(false)
      router.refresh()
    })
  }

  if (!onay) {
    return (
      <button
        type="button"
        onClick={() => setOnay(true)}
        className="text-xs font-bold text-[#1B2430]/70 hover:text-red-600"
      >
        Bağlantıyı kaldır
      </button>
    )
  }

  return (
    <span className="flex items-center gap-2 text-xs font-bold">
      <span className="text-[#1B2430]/70">Emin misiniz?</span>
      <button type="button" onClick={kopar} disabled={isPending} className="text-red-600 hover:underline">
        {isPending ? <Loader2 className="h-3 w-3 animate-spin" /> : 'Evet, kaldır'}
      </button>
      <button type="button" onClick={() => setOnay(false)} className="text-[#1B2430]/70 hover:underline">
        Vazgeç
      </button>
    </span>
  )
}
