import { createAdminClient } from '@/lib/supabase/admin'

export type SecilebilirRol = 'student' | 'instructor' | 'parent'

export const SECILEBILIR_ROLLER: SecilebilirRol[] = ['student', 'instructor', 'parent']

export function gecerliRolMu(deger: unknown): deger is SecilebilirRol {
  return typeof deger === 'string' && (SECILEBILIR_ROLLER as string[]).includes(deger)
}

/**
 * Hesap turunu bir kez belirler.
 *
 * GUVENLIK ACISINDAN KRITIK, O YUZDEN TEK YERDE. Iki cagirani var —
 * /hesap-turu ekranindaki sunucu aksiyonu ve Google donusundeki callback —
 * ve ikisinde ayri ayri yazilmasi kaymaya davetiye olurdu.
 *
 * Uc kapisi var:
 *   1. Kullanici var olmali
 *   2. role_confirmed FALSE olmali — TEK KULLANIMLIK. Bir kez belirlenince
 *      kapaniyor, yani ogrenci sonradan kendini egitmene yukseltemiyor.
 *   3. Rol beyaz listede olmali — 'admin' asla verilemez
 *
 * Rol degisince role ozgu satirlar da tasiniyor: OAuth kaydinda trigger
 * herkese students satiri aciyor (varsayilan rol student), egitmen/veli
 * secilirse o satir siliniyor. Hesap yeni oldugu icin bagli veri yok.
 */
export async function hesapTuruBelirle(
  userId: string,
  rol: SecilebilirRol,
): Promise<{ success: true } | { success: false; error: string }> {
  if (!gecerliRolMu(rol)) return { success: false, error: 'Geçersiz hesap türü' }

  const admin = createAdminClient()

  const { data: satir } = await admin
    .from('users')
    .select('role_confirmed')
    .eq('id', userId)
    .maybeSingle()

  if (!satir) return { success: false, error: 'Hesap bulunamadı' }
  if (satir.role_confirmed) return { success: false, error: 'Hesap türün zaten belirlenmiş' }

  if (rol === 'instructor') {
    await admin.from('students').delete().eq('user_id', userId)
    const { error } = await admin
      .from('instructors')
      .upsert({ user_id: userId }, { onConflict: 'user_id' })
    if (error) return { success: false, error: 'Hesap türü ayarlanamadı, lütfen tekrar dene' }
  } else if (rol === 'parent') {
    await admin.from('students').delete().eq('user_id', userId)
  } else {
    await admin
      .from('students')
      .upsert({ user_id: userId, grade_track: 'yks' }, { onConflict: 'user_id', ignoreDuplicates: true })
  }

  const { error } = await admin
    .from('users')
    .update({ role: rol, role_confirmed: true })
    .eq('id', userId)

  if (error) return { success: false, error: 'Hesap türü ayarlanamadı, lütfen tekrar dene' }
  return { success: true }
}
