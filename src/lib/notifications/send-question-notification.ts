import { Resend } from 'resend'
import { createAdminClient } from '@/lib/supabase/admin'

const resend = new Resend(process.env.RESEND_API_KEY)

// Soru artik belirli bir egitmene degil acik havuza dusuyor (bkz. 0067),
// bu yuzden soru sorulunca tek bir alici yok — tum uygun egitmenlere toplu
// bildirim atmak yerine egitmenler "Sorularim" sayfasindaki havuzu kontrol ediyor.

export async function notifyQuestionAnswered(params: {
  studentId: string
  instructorName: string
  questionText: string
  answerText: string
}) {
  const admin = createAdminClient()
  const { data: recipient } = await admin.from('users').select('id, name, email').eq('id', params.studentId).single()
  if (!recipient) return

  await admin.from('notifications').insert({
    recipient_id: recipient.id,
    type: 'question_answered',
    channel: 'email',
    title: 'Sorun cevaplandı',
    body: `${params.instructorName} sorunu cevapladı: "${params.answerText}"`,
  })

  try {
    await resend.emails.send({
      from: 'DersoLab <bildirim@dersolab.com>',
      to: recipient.email,
      subject: 'Sorun cevaplandı - DersoLab',
      html: `<p>Merhaba ${recipient.name},</p>
        <p><strong>${params.instructorName}</strong> sorduğun soruyu cevapladı:</p>
        <p><em>"${params.questionText}"</em></p>
        <p>${params.answerText}</p>`,
    })
  } catch (err) {
    console.error('Cevap bildirimi gonderilemedi:', err)
  }
}
