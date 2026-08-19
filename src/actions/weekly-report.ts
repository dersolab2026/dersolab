'use server'

import { Resend } from 'resend'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { getStudentInsight } from '@/lib/students/get-student-insight'
import { raporOlustur, raporHtml, type HaftalikRapor } from '@/lib/coaching/build-weekly-report'

const resend = new Resend(process.env.RESEND_API_KEY)

type ActionResult = { success: true } | { success: false; error: string }

/** Onizleme: e-posta gondermeden raporun icerigini uretir. */
export async function haftalikRaporOnizle(
  studentId: string, hafta: string, kocYorumu: string,
): Promise<{ success: true; rapor: HaftalikRapor } | { success: false; error: string }> {
  const insight = await getStudentInsight(studentId)
  if (!insight) return { success: false, error: 'Bu öğrenciyi görme yetkin yok' }

  return {
    success: true,
    rapor: raporOlustur({
      insight,
      planItems: insight.planItems,
      planWeeks: insight.planWeeks,
      hafta,
      kocYorumu,
    }),
  }
}

/**
 * Raporu ogrenciye e-postayla gonder.
 *
 * Veliye DOGRUDAN gonderim yok: 0064 veli rolunu urun karariyla kaldirdi.
 * Rapor ogrenciye gidiyor, dilerse iletiyor. Veliye ayri hesap acmak o
 * karari geri almak olurdu.
 */
export async function haftalikRaporGonder(
  studentId: string, hafta: string, kocYorumu: string,
): Promise<ActionResult> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'Giriş yapmalısın' }

  const onizleme = await haftalikRaporOnizle(studentId, hafta, kocYorumu)
  if (!onizleme.success) return onizleme

  const admin = createAdminClient()
  const { data: kisi } = await admin
    .from('users').select('email, name').eq('id', studentId).is('deleted_at', null).maybeSingle()
  if (!kisi?.email) return { success: false, error: 'Öğrencinin e-posta adresi bulunamadı' }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'https://dersolab.com'

  try {
    await resend.emails.send({
      from: 'DersoLab <bildirim@dersolab.com>',
      to: kisi.email,
      subject: `Haftalık Özetin - DersoLab`,
      html: raporHtml(onizleme.rapor, appUrl),
    })
  } catch (err) {
    console.error('Haftalik rapor gonderilemedi:', err)
    return { success: false, error: 'E-posta gönderilemedi, tekrar dener misin?' }
  }

  return { success: true }
}
