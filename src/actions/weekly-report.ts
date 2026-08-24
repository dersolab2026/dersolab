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
 * Raporu ogrenciye ve varsa bagli velilerine e-postayla gonder.
 *
 * Veli rolu geri geldiginde (guardian_accounts migration'i) rapor velinin
 * gorebildigi alanlarin ozeti oldugu icin dogal alicisi oldu: veli
 * gelisimi zaten panelde goruyor, rapor ayni bilgiyi haftalik olarak
 * getiriyor. Rapor ogrencinin gunlugunu ya da kocluk formu cevaplarini
 * ICERMIYOR — o alanlar veliye kapali.
 *
 * Veli adresleri "bcc" ile degil ayri "to" ile gonderiliyor; veliler
 * birbirinin adresini gormesin diye her alici icin ayri e-posta.
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
  const govde = raporHtml(onizleme.rapor, appUrl)

  try {
    await resend.emails.send({
      from: 'DersoLab <bildirim@dersolab.com>',
      to: kisi.email,
      subject: `Haftalık Özetin - DersoLab`,
      html: govde,
    })
  } catch (err) {
    console.error('Haftalik rapor gonderilemedi:', err)
    return { success: false, error: 'E-posta gönderilemedi, tekrar dener misin?' }
  }

  // Veli gonderimi ogrenciden AYRI ve hatasi sessiz: veliye ulasmamasi
  // ogrenciye giden raporu basarisiz saymamali.
  const { data: baglar } = await admin
    .from('guardian_links').select('guardian_id').eq('student_id', studentId)

  if (baglar && baglar.length > 0) {
    const { data: veliler } = await admin
      .from('users').select('email, name')
      .in('id', baglar.map((b) => b.guardian_id))
      .is('deleted_at', null)

    for (const veli of veliler ?? []) {
      if (!veli.email) continue
      try {
        await resend.emails.send({
          from: 'DersoLab <bildirim@dersolab.com>',
          to: veli.email,
          subject: `${kisi.name} — Haftalık Özet - DersoLab`,
          html: govde,
        })
      } catch (err) {
        console.error('Veli haftalik raporu gonderilemedi:', err)
      }
    }
  }

  return { success: true }
}
