'use client'

import type { PersonaType } from './PersonaSwitcher'

interface StepItem {
  step: string
  title: string
  body: string
}

const STEPS_BY_PERSONA: Record<PersonaType, { heading: string; steps: StepItem[] }> = {
  student: {
    heading: 'Öğrenci İçin Süreç Nasıl İşler?',
    steps: [
      {
        step: '1',
        title: 'Ücretsiz Kaydolun',
        body: 'Birkaç saniyede ücretsiz öğrenci hesabınızı oluşturun ve alanınızı (LGS / YKS / Okul) seçin.',
      },
      {
        step: '2',
        title: 'Hoş Geldin Paketini Alın veya Eğitmen Seçin',
        body: 'İsterseniz önce 20 dakikalık ücretsiz tanışma dersiyle deneyin, ya da doğrudan onaylı eğitmenleri filtreleyin.',
      },
      {
        step: '3',
        title: 'Google Meet ile Derse Başlayın',
        body: 'Uygun saati seçip rezervasyon yapın; Google Meet bağlantısı anında takviminize ve e-posta adresinize gelsin.',
      },
    ],
  },
  parent: {
    heading: 'Veli İçin Süreç Nasıl İşler?',
    steps: [
      {
        step: '1',
        title: 'Veli Hesabı Açın & Çocuğunuzu Bağlayın',
        body: 'Veli olarak kaydolun; çocuğunuzun öğrenci hesabını tek tıkla veli panelinize bağlayın.',
      },
      {
        step: '2',
        title: 'Güvenilir Eğitmen ve Kredi Paketi Seçin',
        body: 'Doğrulanmış öğretmen profillerini inceleyin; yanmayan esnek ders kredisi tanımlayın.',
      },
      {
        step: '3',
        title: 'Gelişimi ve Geri Bildirimleri Takip Edin',
        body: 'Çocuğunuzun ders katılımlarını, öğretmen değerlendirmelerini ve sınav netlerini panelden izleyin.',
      },
    ],
  },
  instructor: {
    heading: 'Eğitmen İçin Süreç Nasıl İşler?',
    steps: [
      {
        step: '1',
        title: 'Eğitmen Başvurusu Yapın',
        body: 'Branşlarınızı, eğitiminizi ve biyografinizi belirten başvuru formunu doldurun.',
      },
      {
        step: '2',
        title: 'Onaylanın ve Takviminizi Açın',
        body: 'Ekibimizin onayından sonra haftalık müsait olduğunuz ders saatlerini ajandanızda işaretleyin.',
      },
      {
        step: '3',
        title: 'Ders Verin & Düzenli Hakediş Alın',
        body: 'Öğrencilerle Google Meet üzerinden dersinizi yapın; ödemeleriniz her ay doğrudan banka hesabınıza yatsın.',
      },
    ],
  },
}

export function PersonaHowItWorks({ persona }: { persona: PersonaType }) {
  const data = STEPS_BY_PERSONA[persona]

  return (
    <div className="bg-[#F4F1E8] rounded-2xl p-6 sm:p-10 border-4 border-[#1B2430] shadow-[0_8px_0_#1B2430]">
      <h2 className="font-sans text-2xl sm:text-3xl font-black text-[#1B2430] mb-8 text-center">{data.heading}</h2>
      <div className="grid gap-5 sm:grid-cols-3">
        {data.steps.map((s) => (
          <div
            key={s.step}
            className="group relative rounded-xl border-4 border-[#1B2430] bg-white p-5 sm:p-6 text-center transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_6px_0_#1B2430] shadow-[0_3px_0_#1B2430]"
          >
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#DD7B3A] text-[#F4F1E8] text-lg font-black border-4 border-[#1B2430] shadow-[0_3px_0_#1B2430] group-hover:scale-105 transition-transform">
              {s.step}
            </div>
            <p className="font-bold text-lg text-[#1B2430] mb-2">{s.title}</p>
            <p className="text-sm sm:text-base font-semibold text-[#1B2430]/75 leading-relaxed">{s.body}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
