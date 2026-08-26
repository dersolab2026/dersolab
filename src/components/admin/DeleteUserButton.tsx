'use client'

import { useState, useTransition } from 'react'
import { Loader2, Trash2 } from 'lucide-react'
import { deleteUserAccount } from '@/actions/admin'
import { Button } from '@/components/ui/button'
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

export function DeleteUserButton({ userId, userName }: { userId: string; userName: string }) {
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [open, setOpen] = useState(false)

  function handleConfirm(e: React.MouseEvent) {
    e.preventDefault()
    setError(null)
    startTransition(async () => {
      const result = await deleteUserAccount(userId)
      if (!result.success) {
        setError(result.error)
        return
      }
      setOpen(false)
    })
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="ghost" size="icon" aria-label={`${userName} hesabını sil`}>
          <Trash2 className="h-4 w-4 text-destructive" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{userName} hesabını sil</AlertDialogTitle>
          <AlertDialogDescription>
            Ad, e-posta, telefon, adres gibi kişisel bilgileri kalıcı olarak anonimleştirilir ve hesap girişe
            kapatılır. Geçmiş ders/ödeme kayıtları (muhasebe ve diğer tarafların erişimi için) korunur. Bu işlem
            geri alınamaz.
          </AlertDialogDescription>
        </AlertDialogHeader>
        {error && <p className="text-sm text-destructive">{error}</p>}
        <AlertDialogFooter>
          <AlertDialogCancel>Vazgeç</AlertDialogCancel>
          <AlertDialogAction onClick={handleConfirm} disabled={isPending} className="bg-destructive text-[var(--yazi-ters)] hover:bg-destructive/90">
            {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Hesabı Sil'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
