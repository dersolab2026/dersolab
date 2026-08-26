import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { DashboardPageShell } from '@/components/layout/DashboardPageShell'
import { PIXEL_CARD } from '@/lib/theme'

const ITEMS: { question: string; answer: string }[] = [
  {
    question: 'Kayıt olduktan sonra ne oluyor?',
    answer:
      'Profilin admin onayına gider. Onaylanana kadar pazar yerinde görünmez, rezervasyon alamazsın. Onaylandığında (ya da bir düzenleme istenirse) bildirim alırsın.',
  },
  {
    question: 'Neden Google Takvimimi bağlamam gerekiyor?',
    answer:
      'Öğrenciler ancak takvimin bağlıysa müsait saatlerini görüp rezervasyon yapabilir. Bağlantıyı "Ayarlar" sayfasından yapabilirsin; her ders otomatik olarak takvimine işlenir ve bir Google Meet linki oluşur.',
  },
  {
    question: 'Bir öğrenci ders aldığında ne olur?',
    answer:
      'Öğrenci müsait bir saat seçip rezervasyon yaptığında hem sen hem öğrenci bildirim alırsınız, ders otomatik takvimine eklenir. Ders saatinde Google Meet linkinden derse katılırsın.',
  },
  {
    question: 'Bir dersi iptal edersem ne olur?',
    answer:
      'Sen iptal edersen öğrencinin kredisi her zaman iade edilir. Öğrenci ders saatine 24 saatten az kala iptal ederse kredisi iade edilmez, 24 saatten fazla varsa iade edilir.',
  },
  {
    question: 'Hoş Geldin Paketi talepleri nasıl çalışır?',
    answer:
      'Öğrenci Hoş Geldin Paketini talep ettiğinde tek bir tanışma dersi talebi açılır ve havuza düşer. Admin senin için "ücretsiz ders" yetkisini açtıysa bu talepleri "Hoş Geldin Talepleri" sayfasında görürsün. İlk üstlenen alır; tanışma dersi kredisizdir.',
  },
  {
    question: 'Ödev akışı nasıl işliyor?',
    answer:
      '"Ödevler" sayfasından öğrencilerine ödev verip teslimlerini inceleyip onaylayabilirsin.',
  },
  {
    question: 'Profilimi geçici olarak kapatabilir miyim?',
    answer:
      '"Ayarlar" sayfasından profilini dondurabilirsin — pazar yerinden geçici olarak kalkar, yeni rezervasyon alamazsın, dilediğinde tekrar aktifleştirebilirsin. Hesabını tamamen silmek istersen aynı sayfadan yapabilirsin.',
  },
]

export default async function InstructorHowItWorksPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  return (
    <DashboardPageShell title="Nasıl Çalışır?" description="DersoLab'ı eğitmen olarak nasıl kullanırsın, sık sorulan sorular.">
      <div className="space-y-4">
        {ITEMS.map((item) => (
          <div key={item.question} className={`${PIXEL_CARD} p-5 space-y-1.5`}>
            <p className="font-bold text-[var(--yazi)]">{item.question}</p>
            <p className="text-sm font-semibold text-[var(--yazi)]/70">{item.answer}</p>
          </div>
        ))}
      </div>
    </DashboardPageShell>
  )
}
