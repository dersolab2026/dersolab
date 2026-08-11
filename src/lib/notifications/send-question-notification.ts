import { Resend } from 'resend'
import { createAdminClient } from '@/lib/supabase/admin'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function notifyQuestionAsked(params: {
  instructorId: string
  studentName: string
  questionText: string
}) {
  const admin = createAdminClient()
  const { data: instructor } = await admin.from('users').select('name, email').eq('id', params.instructorId).single()
  if (!instructor) return

  await admin.from('notifications').insert({
    recipient_id: params.instructorId,
    type: 'question_asked',
    channel: 'email',
    title: 'Yeni bir sorun var',
    body: `${params.studentName} sana bir soru sordu: "${params.questionText}"`,
  })

  try {
    await resend.emails.send({
      from: 'DersoLab <bildirim@dersolab.com>',
      to: instructor.email,
      subject: 'Yeni bir sorun var - DersoLab',
      html: `<p>Merhaba ${instructor.name},</p>
        <p><strong>${params.studentName}</strong> sana bir soru sordu:</p>
        <p>"${params.questionText}"</p>
        <p>Panelden cevaplayabilirsin.</p>`,
    })
  } catch (err) {
    console.error('Soru bildirimi gonderilemedi:', err)
  }
}

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
