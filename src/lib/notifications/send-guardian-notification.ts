import { Resend } from 'resend'
import { tamTarihSaat } from '@/lib/format/datetime'
import { createAdminClient } from '@/lib/supabase/admin'

const resend = new Resend(process.env.RESEND_API_KEY)

async function getStudentRecipient(studentId: string) {
  const admin = createAdminClient()
  const { data } = await admin.from('users').select('id, name, email').eq('id', studentId).single()
  return data
}

interface BookingNotificationParams {
  studentId: string
  instructorId: string
  bookingId: string
  instructorName: string
  studentName: string
  startTime: string
  meetLink: string
}

export async function notifyBookingCreated(params: BookingNotificationParams) {
  const admin = createAdminClient()
  const recipient = await getStudentRecipient(params.studentId)

  const formattedDate = tamTarihSaat(params.startTime)

  if (recipient) {
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

  const { data: instructor } = await admin.from('users').select('name, email').eq('id', params.instructorId).single()
  if (instructor) {
    await admin.from('notifications').insert({
      recipient_id: params.instructorId,
      type: 'booking_created',
      channel: 'email',
      title: 'Yeni ders rezervasyonu',
      body: `${params.studentName} seninle ${formattedDate} tarihinde bir ders planladı.`,
      related_booking_id: params.bookingId,
    })

    try {
      await resend.emails.send({
        from: 'DersoLab <bildirim@dersolab.com>',
        to: instructor.email,
        subject: 'Yeni ders rezervasyonu - DersoLab',
        html: `<p>Merhaba ${instructor.name},</p>
          <p><strong>${params.studentName}</strong> seninle <strong>${formattedDate}</strong> tarihinde bir ders planladı.</p>
          <p>Ders linki: <a href="${params.meetLink}">${params.meetLink}</a></p>`,
      })
    } catch (err) {
      console.error('Bildirim e-postasi gonderilemedi:', err)
    }
  }
}

export async function notifyBookingCancelled(params: {
  studentId: string
  instructorId: string
  bookingId: string
  instructorName: string
  studentName: string
  startTime: string
  creditRefunded: boolean
  cancelledBy: 'student' | 'instructor'
}) {
  const recipient = await getStudentRecipient(params.studentId)
  const admin = createAdminClient()

  const formattedDate = tamTarihSaat(params.startTime)

  const refundNote = params.creditRefunded
    ? 'Kredin iade edildi.'
    : 'Ders saatine 24 saatten az kaldığı için kredi iade edilmedi.'

  if (recipient) {
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

  if (params.cancelledBy === 'student') {
    const { data: instructor } = await admin.from('users').select('name, email').eq('id', params.instructorId).single()
    if (instructor) {
      await admin.from('notifications').insert({
        recipient_id: params.instructorId,
        type: 'booking_cancelled',
        channel: 'email',
        title: 'Ders iptal edildi',
        body: `${params.studentName} ile ${formattedDate} tarihindeki ders iptal edildi.`,
        related_booking_id: params.bookingId,
      })

      try {
        await resend.emails.send({
          from: 'DersoLab <bildirim@dersolab.com>',
          to: instructor.email,
          subject: 'Ders iptal edildi - DersoLab',
          html: `<p>Merhaba ${instructor.name},</p>
            <p><strong>${params.studentName}</strong> ile <strong>${formattedDate}</strong> tarihindeki ders iptal edildi.</p>`,
        })
      } catch (err) {
        console.error('Iptal bildirimi e-postasi gonderilemedi:', err)
      }
    }
  }
}

export async function notifyLessonCompleted(params: {
  studentId: string; bookingId: string; instructorName: string; startTime: string
}) {
  const admin = createAdminClient()
  const recipient = await getStudentRecipient(params.studentId)
  const formattedDate = tamTarihSaat(params.startTime)

  if (recipient) {
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

export async function notifyLessonMissed(params: {
  studentId: string; bookingId: string; instructorName: string; startTime: string
}) {
  const admin = createAdminClient()
  const recipient = await getStudentRecipient(params.studentId)
  const formattedDate = tamTarihSaat(params.startTime)

  if (recipient) {
    await admin.from('notifications').insert({
      recipient_id: recipient.id, type: 'lesson_missed', channel: 'email',
      title: 'Derse katılım sağlanmadı',
      body: `${params.instructorName} ile ${formattedDate} tarihindeki derse katılım sağlanmadı.`,
      related_booking_id: params.bookingId,
    })
    try {
      await resend.emails.send({
        from: 'DersoLab <bildirim@dersolab.com>', to: recipient.email,
        subject: 'Derse katılım sağlanmadı - DersoLab',
        html: `<p>Merhaba ${recipient.name},</p><p><strong>${params.instructorName}</strong> ile <strong>${formattedDate}</strong> tarihindeki derse katılım sağlanmadı.</p>`,
      })
    } catch (err) { console.error('Ders kacirildi bildirimi gonderilemedi:', err) }
  }
}

export async function notifyBookingReminder(params: {
  studentId: string
  instructorId: string
  bookingId: string
  instructorName: string
  studentName: string
  startTime: string
  meetLink: string
}) {
  const admin = createAdminClient()
  const recipient = await getStudentRecipient(params.studentId)
  const formattedTime = tamTarihSaat(params.startTime)

  if (recipient) {
    await admin.from('notifications').insert({
      recipient_id: recipient.id, type: 'booking_reminder', channel: 'email',
      title: 'Dersin yaklaşıyor',
      body: `${params.instructorName} ile ${formattedTime} tarihindeki dersin yaklaşıyor.`,
      related_booking_id: params.bookingId,
    })
    try {
      await resend.emails.send({
        from: 'DersoLab <bildirim@dersolab.com>', to: recipient.email,
        subject: 'Dersin yaklaşıyor - DersoLab',
        html: `<p>Merhaba ${recipient.name},</p>
          <p><strong>${params.instructorName}</strong> ile <strong>${formattedTime}</strong> tarihindeki dersin yaklaşıyor.</p>
          <p>Ders linki: <a href="${params.meetLink}">${params.meetLink}</a></p>`,
      })
    } catch (err) { console.error('Ders hatirlatma bildirimi gonderilemedi:', err) }
  }

  const { data: instructor } = await admin.from('users').select('name, email').eq('id', params.instructorId).single()
  if (instructor) {
    await admin.from('notifications').insert({
      recipient_id: params.instructorId, type: 'booking_reminder', channel: 'email',
      title: 'Dersin yaklaşıyor',
      body: `${params.studentName} ile ${formattedTime} tarihindeki dersin yaklaşıyor.`,
      related_booking_id: params.bookingId,
    })
    try {
      await resend.emails.send({
        from: 'DersoLab <bildirim@dersolab.com>', to: instructor.email,
        subject: 'Dersin yaklaşıyor - DersoLab',
        html: `<p>Merhaba ${instructor.name},</p>
          <p><strong>${params.studentName}</strong> ile <strong>${formattedTime}</strong> tarihindeki dersin yaklaşıyor.</p>
          <p>Ders linki: <a href="${params.meetLink}">${params.meetLink}</a></p>`,
      })
    } catch (err) { console.error('Ders hatirlatma bildirimi gonderilemedi:', err) }
  }
}

export async function notifyHomeworkAssigned(params: {
  studentId: string; homeworkId: string; title: string; dueDate: string | null
}) {
  const admin = createAdminClient()
  const recipient = await getStudentRecipient(params.studentId)
  const dueDateText = params.dueDate
    ? new Date(params.dueDate).toLocaleDateString('tr-TR', { dateStyle: 'long' }) : 'belirtilmedi'

  if (recipient) {
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
  const recipient = await getStudentRecipient(params.studentId)

  if (recipient) {
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
