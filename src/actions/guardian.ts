'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

type ActionResult = { success: true } | { success: false; error: string }

export interface GuardianLinkRow {
  id: string
  personId: string
  personName: string
  personEmail: string
  createdAt: string
}

export interface StudentGuardianCode {
  code: string
  expiresAt: string
}

/**
 * Ogrenci, velisine verecegi baglanti kodunu uretir.
 *
 * Kod TEK KULLANIMLIK ve 7 gunde doluyor. Sebebi: bagi yalnizca veli
 * koparabiliyor (urun karari), dolayisiyla yanlis kisiye gitmis bir kodla
 * kurulan bagda ogrenci mahsur kalir. Kodun kisa omurlu ve tek kullanimlik
 * olmasi bu riski pratikte kapatiyor; kalan durumlar icin admin her bagi
 * koparabiliyor.
 *
 * Onceki kullanilmamis kodlar siliniyor: ogrencinin elinde ayni anda tek
 * gecerli kod olsun, eskisi ortalikta kalmasin.
 */
export async function veliKoduUret(): Promise<
  { success: true; code: string; expiresAt: string } | { success: false; error: string }
> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'Giriş yapmalısın' }

  await supabase
    .from('guardian_link_codes')
    .delete()
    .eq('student_id', user.id)
    .is('used_at', null)

  const { data, error } = await supabase
    .from('guardian_link_codes')
    .insert({ student_id: user.id })
    .select('code, expires_at')
    .single()

  if (error || !data) return { success: false, error: 'Kod oluşturulamadı, lütfen tekrar dene' }

  revalidatePath('/dashboard/student/settings')
  return { success: true, code: data.code, expiresAt: data.expires_at }
}

/** Ogrencinin duran (kullanilmamis, suresi gecmemis) kodu. */
export async function aktifVeliKodu(studentId: string): Promise<StudentGuardianCode | null> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('guardian_link_codes')
    .select('code, expires_at')
    .eq('student_id', studentId)
    .is('used_at', null)
    .gt('expires_at', new Date().toISOString())
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  return data ? { code: data.code, expiresAt: data.expires_at } : null
}

/**
 * Veli, ogrencinin verdigi kodu kullanarak bagi kurar.
 *
 * Butun dogrulama ve bag kurma veritabanindaki redeem_guardian_code()
 * icinde, tek islemde yapiliyor: kod satiri kilitleniyor, boylece ayni kod
 * es zamanli iki kez kullanilamiyor.
 */
export async function veliKoduKullan(kod: string): Promise<ActionResult> {
  const temiz = kod.trim().toUpperCase()
  if (temiz.length !== 8) return { success: false, error: 'Kod 8 karakter olmalı' }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'Giriş yapmalısın' }

  const { error } = await supabase.rpc('redeem_guardian_code', { p_code: temiz })

  if (error) {
    const ham = error.message
    if (ham.includes('gecersiz ya da suresi dolmus')) {
      return { success: false, error: 'Kod geçersiz ya da süresi dolmuş. Öğrencinden yeni bir kod iste.' }
    }
    if (ham.includes('yalnizca veli hesaplari')) {
      return { success: false, error: 'Bu işlem yalnızca veli hesapları için geçerli' }
    }
    if (ham.includes('Kendi hesabini')) {
      return { success: false, error: 'Kendi hesabını kendine bağlayamazsın' }
    }
    return { success: false, error: 'Bağlantı kurulamadı, lütfen tekrar dene' }
  }

  revalidatePath('/dashboard/parent')
  return { success: true }
}

/**
 * Veli bagi koparir. Ogrenci koparamaz — bu bilincli bir urun karari:
 * odeyen taraf veli, ogrenci kotu giden bir donemi tek tarafli
 * gizleyememeli. RLS de ayni siniri koyuyor (guardian_links_delete_guardian).
 */
export async function veliBaginiKopar(studentId: string): Promise<ActionResult> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'Giriş yapmalısın' }

  const { error } = await supabase
    .from('guardian_links')
    .delete()
    .eq('guardian_id', user.id)
    .eq('student_id', studentId)

  if (error) return { success: false, error: 'Bağlantı kaldırılamadı, lütfen tekrar dene' }

  revalidatePath('/dashboard/parent')
  return { success: true }
}

/** Velinin bagli oldugu ogrenciler. */
export async function veliyeBagliOgrenciler(): Promise<GuardianLinkRow[]> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  const { data: links } = await supabase
    .from('guardian_links')
    .select('id, student_id, created_at')
    .eq('guardian_id', user.id)
    .order('created_at', { ascending: true })

  if (!links || links.length === 0) return []

  const admin = createAdminClient()
  const { data: users } = await admin
    .from('users')
    .select('id, name, email')
    .in('id', links.map((l) => l.student_id))

  const byId = new Map((users ?? []).map((u) => [u.id, u]))

  return links.map((l) => ({
    id: l.id,
    personId: l.student_id,
    personName: byId.get(l.student_id)?.name ?? 'Öğrenci',
    personEmail: byId.get(l.student_id)?.email ?? '',
    createdAt: l.created_at,
  }))
}

/** Ogrenciye bagli veliler — ogrenci gorur ama kaldiramaz. */
export async function ogrenciyeBagliVeliler(studentId: string): Promise<GuardianLinkRow[]> {
  const supabase = await createClient()

  const { data: links } = await supabase
    .from('guardian_links')
    .select('id, guardian_id, created_at')
    .eq('student_id', studentId)
    .order('created_at', { ascending: true })

  if (!links || links.length === 0) return []

  const admin = createAdminClient()
  const { data: users } = await admin
    .from('users')
    .select('id, name, email')
    .in('id', links.map((l) => l.guardian_id))

  const byId = new Map((users ?? []).map((u) => [u.id, u]))

  return links.map((l) => ({
    id: l.id,
    personId: l.guardian_id,
    personName: byId.get(l.guardian_id)?.name ?? 'Veli',
    personEmail: byId.get(l.guardian_id)?.email ?? '',
    createdAt: l.created_at,
  }))
}
