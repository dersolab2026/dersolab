import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { DashboardPageShell } from '@/components/layout/DashboardPageShell'
import { PIXEL_CARD } from '@/lib/theme'

const ITEMS: { question: string; answer: string }[] = [
  {
    question: 'Ders kredisi nedir, nasıl kazanılır?',
    answer:
      '1 ders kredisi, 40 dakikalık bir derse karşılık gelir. "Paketler" sayfasından bir kredi paketi satın alarak kredi kazanırsın; ödeme Shopier üzerinden alınır.',
  },
  {
    question: 'Hoş geldin paketi nedir?',
    answer:
      'Her öğrenci platformda bir kere ücretsiz hoş geldin paketi alır: kredi harcamayan bir tanışma dersi ve bir hafta boyunca koçluk desteği. "Hoş Geldin Paketi" sayfasından tek seferde talep edersin; uygun bir eğitmen dersini planlar, bir koç da haftalık programını kurmak için seninle iletişime geçer.',
  },
  {
    question: 'Bir eğitmenden nasıl ders alırım?',
    answer:
      '"Eğitmenler" sayfasından bir eğitmen seçip profiline girersin. Eğitmen takvimini bağladıysa müsait saatlerini görüp bir saat seçersin, rezervasyon anında 1 kredi düşer ve otomatik bir Google Meet linki oluşur.',
  },
  {
    question: 'Dersimi iptal edersem kredim geri gelir mi?',
    answer:
      'Ders saatine 24 saatten fazla varken iptal edersen kredin iade edilir. 24 saatten az kala iptal edersen kredi iade edilmez. Eğitmen dersi iptal ederse kredin her zaman iade edilir.',
  },
  {
    question: 'Ödevlerimi nereden görüp teslim ederim?',
    answer:
      '"Ödevlerim" sayfasında eğitmeninin sana verdiği ödevleri görürsün. Görsel ya da video olarak teslim edebilir, eğitmenin onayladıktan sonra durumunu takip edebilirsin.',
  },
]

export default async function StudentHowItWorksPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  return (
    <DashboardPageShell title="Nasıl Çalışır?" description="DersoLab'ı öğrenci olarak nasıl kullanırsın, sık sorulan sorular.">
      <div className="space-y-4">
        {ITEMS.map((item) => (
          <div key={item.question} className={`${PIXEL_CARD} p-5 space-y-1.5`}>
            <p className="font-bold text-[#1B2430]">{item.question}</p>
            <p className="text-sm font-semibold text-[#1B2430]/70">{item.answer}</p>
          </div>
        ))}
      </div>
    </DashboardPageShell>
  )
}
