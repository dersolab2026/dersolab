import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function notifyInstructorCalendarReminder(params: { name: string; email: string }) {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL
  try {
    await resend.emails.send({
      from: 'DersoLab <bildirim@dersolab.com>',
      to: params.email,
      subject: 'Takvimini Bağlamayı Unutma - DersoLab',
      html: `<p>Merhaba ${params.name},</p>
        <p>Öğrencilerin senden ders alabilmesi için Google Takvimini bağlaman gerekiyor. Takvimin bağlı olmadığı sürece pazar yerinde müsaitlik gösteremez, rezervasyon alamazsın.</p>
        <p><a href="${appUrl}/dashboard/instructor/settings">Ayarlar sayfasından</a> birkaç saniyede bağlayabilirsin.</p>`,
    })
  } catch (err) {
    console.error('Takvim hatirlatma e-postasi gonderilemedi:', err)
  }
}

export async function notifyStudentDemoLessonReminder(params: { name: string; email: string }) {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL
  try {
    await resend.emails.send({
      from: 'DersoLab <bildirim@dersolab.com>',
      to: params.email,
      subject: 'Hoş Geldin Paketini Kaçırma - DersoLab',
      html: `<p>Merhaba ${params.name},</p>
        <p>DersoLab'da henüz kullanmadığın bir hoş geldin paketin var: ücretsiz bir tanışma dersi ve bir hafta boyunca koçluk desteği.</p>
        <p><a href="${appUrl}/demo-ders">Hemen talep et</a>, uygun bir eğitmen ve koç seninle iletişime geçsin.</p>`,
    })
  } catch (err) {
    console.error('Hos geldin paketi hatirlatma e-postasi gonderilemedi:', err)
  }
}
