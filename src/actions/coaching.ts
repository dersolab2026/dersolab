'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

type ActionResult = { success: true } | { success: false; error: string }

/**
 * Koçluk ilişkisi ve oturum formu.
 *
 * Bu iki nesne birlikte duruyor çünkü oturum formu ilişkiye asılıyor:
 * "geçen hafta ne dedik" sorusunun cevabı ancak ilişki kalıcı bir kayıt
 * olduğunda haftalar boyunca taşınabiliyor.
 */

/** Koçun davet kodu; yoksa üretilip kaydediliyor. */
export async function getOrCreateCoachInviteCode(): Promise<
  { success: true; code: string } | { success: false; error: string }
> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'Giriş yapmalısın' }

  const admin = createAdminClient()
  const { data: mevcut } = await admin
    .from('instructors').select('coach_invite_code').eq('user_id', user.id).maybeSingle()

  if (mevcut?.coach_invite_code) return { success: true, code: mevcut.coach_invite_code }

  // Karisabilecek harfler (I, O, 0, 1) disarida birakildi: kod elle
  // yaziliyor, okunakli olmasi gerekiyor.
  const ALFABE = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  for (let deneme = 0; deneme < 8; deneme++) {
    let kod = 'KOC-'
    for (let i = 0; i < 5; i++) kod += ALFABE[Math.floor(Math.random() * ALFABE.length)]

    const { error } = await admin
      .from('instructors').update({ coach_invite_code: kod }).eq('user_id', user.id)
    if (!error) return { success: true, code: kod }
    // unique ihlali disinda bir hata varsa tekrar denemenin anlami yok
    if (!error.message.includes('duplicate') && !error.message.includes('unique')) {
      return { success: false, error: error.message }
    }
  }
  return { success: false, error: 'Kod üretilemedi, tekrar dener misin?' }
}

/** Öğrenci koçun kodunu girip ilişkiyi başlatır. */
export async function joinCoachByCode(code: string): Promise<ActionResult> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'Giriş yapmalısın' }

  const temiz = code.trim().toUpperCase()
  if (!temiz) return { success: false, error: 'Kod boş olamaz' }

  const admin = createAdminClient()
  const { data: koc } = await admin
    .from('instructors').select('user_id').eq('coach_invite_code', temiz).maybeSingle()
  if (!koc) return { success: false, error: 'Böyle bir koç kodu bulunamadı' }

  const { data: zaten } = await admin
    .from('coaching_relationships')
    .select('id')
    .eq('student_id', user.id).eq('coach_id', koc.user_id).eq('status', 'active')
    .maybeSingle()
  if (zaten) return { success: false, error: 'Bu koçla zaten aktif bir koçluk ilişkin var' }

  const { error } = await admin.from('coaching_relationships').insert({
    student_id: user.id, coach_id: koc.user_id,
  })
  if (error) return { success: false, error: error.message }

  revalidatePath('/dashboard/student/settings')
  return { success: true }
}

/** Koç, öğrencisiyle ilişkiyi kendisi başlatır (ders verdiği öğrenci için). */
export async function startCoaching(studentId: string, rhythm?: string): Promise<ActionResult> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'Giriş yapmalısın' }

  const { error } = await supabase.from('coaching_relationships').insert({
    student_id: studentId, coach_id: user.id, weekly_rhythm: rhythm || null,
  })
  if (error) {
    if (error.message.includes('duplicate') || error.message.includes('unique')) {
      return { success: false, error: 'Bu öğrenciyle zaten aktif bir koçluk ilişkin var' }
    }
    if (error.message.includes('row-level security')) {
      return { success: false, error: 'Koçluk başlatmak için branşlarında Koçluk olmalı' }
    }
    return { success: false, error: error.message }
  }

  revalidatePath(`/dashboard/instructor/ogrencilerim/${studentId}`)
  return { success: true }
}

export async function endCoaching(relationshipId: string): Promise<ActionResult> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'Giriş yapmalısın' }

  const { error } = await supabase
    .from('coaching_relationships')
    .update({ status: 'ended', ended_on: new Date().toISOString().slice(0, 10) })
    .eq('id', relationshipId)

  if (error) return { success: false, error: error.message }
  revalidatePath('/dashboard/instructor/ogrencilerim')
  return { success: true }
}

export interface SessionNoteInput {
  studentId: string
  sessionDate: string
  planFollowed: 'evet' | 'kismen' | 'hayir' | null
  obstacle: string
  studentCommitment: string
  coachDecisions: string
  confidence: number | null
}

export async function saveSessionNote(input: SessionNoteInput): Promise<ActionResult> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'Giriş yapmalısın' }

  if (input.confidence !== null && (input.confidence < 1 || input.confidence > 10)) {
    return { success: false, error: 'Özgüven puanı 1 ile 10 arasında olmalı' }
  }

  // Aktif iliski varsa nota bagliyoruz; yoksa not yine tutulabiliyor
  // (tanisma gorusmesi de bir oturum).
  const { data: iliski } = await supabase
    .from('coaching_relationships')
    .select('id')
    .eq('student_id', input.studentId).eq('coach_id', user.id).eq('status', 'active')
    .maybeSingle()

  const { error } = await supabase.from('coaching_session_notes').insert({
    student_id: input.studentId,
    coach_id: user.id,
    relationship_id: iliski?.id ?? null,
    session_date: input.sessionDate,
    plan_followed: input.planFollowed,
    obstacle: input.obstacle.trim() || null,
    student_commitment: input.studentCommitment.trim() || null,
    coach_decisions: input.coachDecisions.trim() || null,
    confidence: input.confidence,
  })

  if (error) {
    if (error.message.includes('row-level security')) {
      return { success: false, error: 'Bu öğrenci için not ekleme yetkin yok' }
    }
    return { success: false, error: error.message }
  }

  revalidatePath(`/dashboard/instructor/ogrencilerim/${input.studentId}`)
  return { success: true }
}

export async function deleteSessionNote(noteId: string, studentId: string): Promise<ActionResult> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'Giriş yapmalısın' }

  const { error } = await supabase.from('coaching_session_notes').delete().eq('id', noteId)
  if (error) return { success: false, error: error.message }

  revalidatePath(`/dashboard/instructor/ogrencilerim/${studentId}`)
  return { success: true }
}
