'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

type ActionResult = { success: true } | { success: false; error: string }

export type SecilebilirRol = 'student' | 'instructor' | 'parent'

const SECILEBILIR: SecilebilirRol[] = ['student', 'instructor', 'parent']

/**
 * Google ile kaydolan kullanicinin hesap turunu bir kez secmesi.
 *
 * KENDI YETKI KONTROLUNU YAPIYOR. Admin istemcisi kullaniyor cunku
 * prevent_role_change (0048) kullanicinin kendi rolunu degistirmesini
 * engelliyor ve o koruma bilerek yerinde birakildi. Dolayisiyla buradaki
 * kontroller tek savunma hatti:
 *
 *   1. Giris yapmis olmali
 *   2. role_confirmed FALSE olmali — tek kullanimlik. Bir kez secildikten
 *      sonra bu aksiyon hicbir sey yapmiyor, yani ogrenci sonradan kendini
 *      egitmene yukseltemiyor.
 *   3. Istenen rol beyaz listede olmali — 'admin' asla secilemez.
 *
 * Rol degisince role ozgu satirlar da tasiniyor: OAuth kaydinda trigger
 * herkese bir students satiri aciyor (varsayilan rol student oldugu icin);
 * egitmen ya da veli secilirse o satir siliniyor. Hesap yeni oldugu icin
 * bagli veri yok.
 */
export async function hesapTuruSec(rol: SecilebilirRol): Promise<ActionResult> {
  if (!SECILEBILIR.includes(rol)) {
    return { success: false, error: 'Geçersiz hesap türü' }
  }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'Giriş yapmalısın' }

  const admin = createAdminClient()

  const { data: satir } = await admin
    .from('users')
    .select('role, role_confirmed')
    .eq('id', user.id)
    .maybeSingle()

  if (!satir) return { success: false, error: 'Hesap bulunamadı' }
  if (satir.role_confirmed) {
    return { success: false, error: 'Hesap türün zaten belirlenmiş' }
  }

  if (rol === 'instructor') {
    await admin.from('students').delete().eq('user_id', user.id)
    const { error } = await admin
      .from('instructors')
      .upsert({ user_id: user.id }, { onConflict: 'user_id' })
    if (error) return { success: false, error: 'Hesap türü ayarlanamadı, lütfen tekrar dene' }
  } else if (rol === 'parent') {
    await admin.from('students').delete().eq('user_id', user.id)
  } else {
    // Ogrenci: trigger zaten students satirini acmisti, dokunmuyoruz.
    await admin
      .from('students')
      .upsert({ user_id: user.id, grade_track: 'yks' }, { onConflict: 'user_id', ignoreDuplicates: true })
  }

  const { error: rolHatasi } = await admin
    .from('users')
    .update({ role: rol, role_confirmed: true })
    .eq('id', user.id)

  if (rolHatasi) return { success: false, error: 'Hesap türü ayarlanamadı, lütfen tekrar dene' }

  revalidatePath('/dashboard')
  return { success: true }
}
