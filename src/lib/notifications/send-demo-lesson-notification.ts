import { Resend } from 'resend'
import { createAdminClient } from '@/lib/supabase/admin'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function notifyDemoLessonRequested(studentName: string) {
  const admin = createAdminClient()

  const { data: eligibleInstructors } = await admin
    .from('instructors')
    .select('user_id')
    .eq('offers_free_trial', true)

  if (!eligibleInstructors || eligibleInstructors.length === 0) return

  const ids = eligibleInstructors.map((i) => i.user_id)
  const { data: users } = await admin.from('users').select('id, name, email').in('id', ids)

  for (const u of users ?? []) {
    await admin.from('notifications').insert({
      recipient_id: u.id,
      type: 'demo_lesson_requested',
      channel: 'email',
      title: 'Yeni ücretsiz tanışma dersi talebi',
      body: `${studentName} için ücretsiz tanışma dersi talebi var. Uygunsan kabul edebilirsin.`,
    })

    try {
      await resend.emails.send({
        from: 'DersoLab <bildirim@dersolab.com>',
        to: u.email,
        subject: 'Yeni ücretsiz tanışma dersi talebi - DersoLab',
        html: `<p>Merhaba ${u.name},</p>
          <p><strong>${studentName}</strong> için ücretsiz tanışma dersi talebi var.</p>
          <p>Uygunsan panelden kabul edip bir saat seçebilirsin. İlk kabul eden eğitmen dersi alır.</p>`,
      })
    } catch (err) {
      console.error('Demo ders talebi bildirimi gonderilemedi:', err)
    }
  }
}
