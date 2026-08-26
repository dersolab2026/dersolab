'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import { deleteMyAccount } from '@/actions/account'
import { PIXEL_BUTTON_DANGER } from '@/lib/theme'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'

export function DeleteAccountButton() {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  function handleConfirm(e: React.MouseEvent) {
    e.preventDefault()
    setError(null)
    startTransition(async () => {
      const result = await deleteMyAccount()
      if (!result.success) { setError(result.error); return }
      router.push('/')
      router.refresh()
    })
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <button type="button" className={`${PIXEL_BUTTON_DANGER} px-4 py-2`}>Profilimi Sil</button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Profilini silmek istediğine emin misin?</AlertDialogTitle>
          <AlertDialogDescription>
            Ad, e-posta, telefon, adres gibi kişisel bilgilerin kalıcı olarak anonimleştirilir ve hesabın girişe
            kapatılır. Geçmiş ders/ödeme kayıtların (muhasebe ve diğer tarafların erişimi için) korunur. Bu işlem
            geri alınamaz.
          </AlertDialogDescription>
        </AlertDialogHeader>
        {error && <p className="text-sm text-destructive">{error}</p>}
        <AlertDialogFooter>
          <AlertDialogCancel>Vazgeç</AlertDialogCancel>
          <AlertDialogAction onClick={handleConfirm} disabled={isPending} className="bg-destructive text-[var(--yazi-ters)] hover:bg-destructive/90">
            {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Profilimi Sil'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
