'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { hesapTuruBelirle, type SecilebilirRol } from '@/lib/auth/account-type'

type ActionResult = { success: true } | { success: false; error: string }

/**
 * Google ile gelen kullanicinin hesap turunu secmesi.
 *
 * Bu ekran artik YEDEK yol: kayit formundan gelenlerin secimi zaten
 * OAuth notuyla tasiniyor ve callback'te uygulaniyor. Buraya yalnizca
 * not kaybolduysa ya da kullanici dogrudan giris sayfasindan Google ile
 * geldiyse dusuluyor.
 *
 * Yetki mantigi bilerek burada degil: hesapTuruBelirle tek yerde duruyor,
 * iki cagirani (bu aksiyon ve callback) ayni kapilardan geciyor.
 */
export async function hesapTuruSec(rol: SecilebilirRol): Promise<ActionResult> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'Giriş yapmalısın' }

  const sonuc = await hesapTuruBelirle(user.id, rol)
  if (!sonuc.success) return sonuc

  revalidatePath('/dashboard')
  return { success: true }
}

export type { SecilebilirRol }
