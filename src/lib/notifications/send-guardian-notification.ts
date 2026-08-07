import { Resend } from 'resend'
import { createAdminClient } from '@/lib/supabase/admin'

const resend = new Resend(process.env.RESEND_API_KEY)

async function resolveGuardianOrSelfRecipients(studentId: string) {
  const admin = createAdminClient()
  const { data: guardianLinks } = await admin
    .from('guardian_links').select('guardian_id').eq('student_id', studentId)

  const recipientIds =
    guardianLinks && guardianLinks.length > 0 ? guardianLinks.map((g) => g.guardian_id) : [studentId]

  const { data: recipients } = await admin.from('users').select('id, name, email').in('id', recipientIds)
  return recipients ?? []
}

interface BookingNotificationParams {
  studentId: string
  bookingId: string
  instructorName: string
  startTime: string
  meetLink: string
}

export async function notifyBookingCreated(params: BookingNotificationParams) {
  const admin = createAdminClient()
  const recipients = await resolveGuardianOrSelfRecipients(params.studentId)

  const formattedDate = new Date(params.startTime).toLocaleString('tr-TR', {
    dateStyle: 'full',
    timeStyle: 'short',
  })

  for (const recipient of recipients) {
    await admin.from('notifications').insert({
      recipient_id: recipient.id,
      type: 'booking_created',
      channel: 'email',
      title: 'Ders planlandı',
      body: `${params.instructorName} ile ${formattedDate} tarihinde bir ders planlandı.`,
      related_booking_id: params.bookingId,
    })

    try {
      await resend.emails.send({
        from: 'DersoLab <bildirim@dersolab.com>',
        to: recipient.email,
        subject: 'Ders planlandı - DersoLab',
        html: `<p>Merhaba ${recipient.name},</p>
          <p><strong>${params.instructorName}</strong> ile <strong>${formattedDate}</strong> tarihinde bir ders planlandı.</p>
          <p>Ders linki: <a href="${params.meetLink}">${params.meetLink}</a></p>`,
      })
    } catch (err) {
      console.error('Bildirim e-postasi gonderilemedi:', err)
    }
  }
}

export async function notifyBookingCancelled(params: {
  studentId: string
  bookingId: string
  instructorName: string
  startTime: string
  creditRefunded: boolean
}) {
  const recipients = await resolveGuardianOrSelfRecipients(params.studentId)
  const admin = createAdminClient()

  const formattedDate = new Date(params.startTime).toLocaleString('tr-TR', {
    dateStyle: 'full',
    timeStyle: 'short',
  })

  const refundNote = params.creditRefunded
    ? 'Kredin iade edildi.'
    : 'Ders saatine 24 saatten az kaldığı için kredi iade edilmedi.'

  for (const recipient of recipients) {
    await admin.from('notifications').insert({
      recipient_id: recipient.id,
      type: 'booking_cancelled',
      channel: 'email',
      title: 'Ders iptal edildi',
      body: `${params.instructorName} ile ${formattedDate} tarihindeki ders iptal edildi. ${refundNote}`,
      related_booking_id: params.bookingId,
    })

    try {
      await resend.emails.send({
        from: 'DersoLab <bildirim@dersolab.com>',
        to: recipient.email,
        subject: 'Ders iptal edildi - DersoLab',
        html: `<p>Merhaba ${recipient.name},</p>
          <p><strong>${params.instructorName}</strong> ile <strong>${formattedDate}</strong> tarihindeki ders iptal edildi.</p>
          <p>${refundNote}</p>`,
      })
    } catch (err) {
      console.error('Iptal bildirimi e-postasi gonderilemedi:', err)
    }
  }
}

export async function notifyLessonCompleted(params: {
  studentId: string; bookingId: string; instructorName: string; startTime: string
}) {
  const admin = createAdminClient()
  const recipients = await resolveGuardianOrSelfRecipients(params.studentId)
  const formattedDate = new Date(params.startTime).toLocaleString('tr-TR', { dateStyle: 'full', timeStyle: 'short' })

  for (const recipient of recipients) {
    await admin.from('notifications').insert({
      recipient_id: recipient.id, type: 'lesson_completed', channel: 'email',
      title: 'Ders tamamlandı',
      body: `${params.instructorName} ile ${formattedDate} tarihindeki ders tamamlandı.`,
      related_booking_id: params.bookingId,
    })
    try {
      await resend.emails.send({
        from: 'DersoLab <bildirim@dersolab.com>', to: recipient.email,
        subject: 'Ders tamamlandı - DersoLab',
        html: `<p>Merhaba ${recipient.name},</p><p><strong>${params.instructorName}</strong> ile <strong>${formattedDate}</strong> tarihindeki ders tamamlandı.</p>`,
      })
    } catch (err) { console.error('Ders tamamlandi bildirimi gonderilemedi:', err) }
  }
}

export async function notifyHomeworkAssigned(params: {
  studentId: string; homeworkId: string; title: string; dueDate: string | null
}) {
  const admin = createAdminClient()
  const recipients = await resolveGuardianOrSelfRecipients(params.studentId)
  const dueDateText = params.dueDate
    ? new Date(params.dueDate).toLocaleDateString('tr-TR', { dateStyle: 'long' }) : 'belirtilmedi'

  for (const recipient of recipients) {
    await admin.from('notifications').insert({
      recipient_id: recipient.id, type: 'homework_assigned', channel: 'email',
      title: 'Yeni ödev verildi',
      body: `"${params.title}" ödevi verildi. Son tarih: ${dueDateText}.`,
      related_homework_id: params.homeworkId,
    })
    try {
      await resend.emails.send({
        from: 'DersoLab <bildirim@dersolab.com>', to: recipient.email,
        subject: 'Yeni ödev verildi - DersoLab',
        html: `<p>Merhaba ${recipient.name},</p><p><strong>${params.title}</strong> ödevi verildi. Son tarih: ${dueDateText}.</p>`,
      })
    } catch (err) { console.error('Odev atama bildirimi gonderilemedi:', err) }
  }
}

export async function notifyHomeworkCompleted(params: { studentId: string; homeworkId: string; title: string }) {
  const admin = createAdminClient()
  const recipients = await resolveGuardianOrSelfRecipients(params.studentId)

  for (const recipient of recipients) {
    await admin.from('notifications').insert({
      recipient_id: recipient.id, type: 'homework_completed', channel: 'email',
      title: 'Ödev onaylandı',
      body: `"${params.title}" ödevi eğitmen tarafından incelendi ve onaylandı.`,
      related_homework_id: params.homeworkId,
    })
    try {
      await resend.emails.send({
        from: 'DersoLab <bildirim@dersolab.com>', to: recipient.email,
        subject: 'Ödev onaylandı - DersoLab',
        html: `<p>Merhaba ${recipient.name},</p><p><strong>${params.title}</strong> ödevi eğitmen tarafından incelendi ve onaylandı.</p>`,
      })
    } catch (err) { console.error('Odev onay bildirimi gonderilemedi:', err) }
  }
}

export async function notifyHomeworkSubmitted(params: { homeworkId: string; instructorId: string; title: string }) {
  const admin = createAdminClient()
  const { data: instructor } = await admin.from('users').select('name, email').eq('id', params.instructorId).single()
  if (!instructor) return

  await admin.from('notifications').insert({
    recipient_id: params.instructorId, type: 'homework_submitted', channel: 'email',
    title: 'Ödev incelemeni bekliyor',
    body: `"${params.title}" ödevi için öğrencin bir gönderim yaptı.`,
    related_homework_id: params.homeworkId,
  })

  try {
    await resend.emails.send({
      from: 'DersoLab <bildirim@dersolab.com>', to: instructor.email,
      subject: 'Ödev incelemeni bekliyor - DersoLab',
      html: `<p>Merhaba ${instructor.name},</p><p><strong>${params.title}</strong> ödevi için öğrencin bir gönderim yaptı.</p>`,
    })
  } catch (err) { console.error('Odev gonderim bildirimi gonderilemedi:', err) }
}

export async function notifyInstructorApprovalStatus(params: {
  instructorId: string
  approved: boolean
  note?: string
}) {
  const admin = createAdminClient()
  const { data: instructor } = await admin.from('users').select('name, email').eq('id', params.instructorId).single()
  if (!instructor) return

  const subject = params.approved ? 'Profilin onaylandı - DersoLab' : 'Profilin hakkında güncelleme - DersoLab'
  const body = params.approved
    ? `Merhaba ${instructor.name}, profilin incelendi ve onaylandı. Artık öğrenciler seni marketplace'te görebilir ve rezervasyon yapabilir.`
    : `Merhaba ${instructor.name}, profilin incelendi. ${params.note ?? 'Bazı düzenlemeler gerekiyor, lütfen bizimle iletişime geç.'}`

  try {
    await resend.emails.send({ from: 'DersoLab <bildirim@dersolab.com>', to: instructor.email, subject, html: `<p>${body}</p>` })
  } catch (err) { console.error('Onay bildirimi gonderilemedi:', err) }
}
