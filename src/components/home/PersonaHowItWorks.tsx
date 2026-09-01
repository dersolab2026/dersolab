'use client'

import type { PersonaType } from './PersonaSwitcher'

interface StepItem {
  step: string
  title: string
  body: string
}

const STEPS_BY_PERSONA: Record<PersonaType, { heading: string; subtitle: string; steps: StepItem[] }> = {
  student: {
    heading: '3 Basit Adımda Başlayın',
    subtitle: 'Kayıttan ilk derse kadar her adım sizin için zahmetsizce tasarlandı.',
    steps: [
      {
        step: '01',
        title: 'Ücretsiz Hesabınızı Açın',
        body: 'Saniyeler içinde kaydolun, hazırlık alanınızı (LGS / YKS / Okul) seçin.',
      },
      {
        step: '02',
        title: 'Eğitmeni Seçin veya Hoş Geldin Paketini Alın',
        body: 'Dilerseniz 20 dakikalık ücretsiz tanışma dersiyle deneyin, dilerseniz onaylı kadroyu inceleyin.',
      },
      {
        step: '03',
        title: 'Canlı Derse Başlayın',
        body: 'Uygun saati belirleyin; Google Meet bağlantısı anında takviminize ve e-postanıza gelsin.',
      },
    ],
  },
  parent: {
    heading: 'Veliler İçin Kolay Başlangıç',
    subtitle: 'Çocuğunuzun eğitimini güvenle planlayın ve izleyin.',
    steps: [
      {
        step: '01',
        title: 'Veli Hesabı Açın & Çocuğunuzu Bağlayın',
        body: 'Veli olarak kaydolun; çocuğunuzun öğrenci hesabını tek tıkla veli panelinize bağlayın.',
      },
      {
        step: '02',
        title: 'Doğrulanmış Öğretmen & Ders Kredisi Seçin',
        body: 'Belgeleri tescilli eğitmenleri inceleyin; süresiz geçerli esnek ders kredisi tanımlayın.',
      },
      {
        step: '03',
        title: 'Gelişimi ve Geri Bildirimleri Takip Edin',
        body: 'Her ders sonrası öğretmenin bıraktığı katılım notlarını ve sınav netlerini panelden izleyin.',
      },
    ],
  },
  instructor: {
    heading: 'Eğitmenler İçin Katılım Süreci',
    subtitle: 'Türkiye’nin seçkin eğitim kadrosunda yerinizi alın.',
    steps: [
      {
        step: '01',
        title: 'Eğitmen Başvurusu Yapın',
        body: 'Branşlarınızı, mezuniyetinizi ve eğitmen profilinizi belirten başvuru formunu doldurun.',
      },
      {
        step: '02',
        title: 'Onaylanın ve Müsaitlik Takviminizi Açın',
        body: 'Başvurunuz onaylandıktan sonra ders vermek istediğiniz haftalık saatleri ajandanızda işaretleyin.',
      },
      {
        step: '03',
        title: 'Ders Verin & Düzenli Hakediş Alın',
        body: 'Öğrencilerle Google Meet üzerinden dersinizi yapın; ödemeleriniz her ay IBAN hesabınıza yatsın.',
      },
    ],
  },
}

export function PersonaHowItWorks({ persona }: { persona: PersonaType }) {
  const data = STEPS_BY_PERSONA[persona]

  return (
    <div className="rounded-3xl bg-white/80 backdrop-blur-md border border-slate-200/80 p-6 sm:p-12 shadow-[0_4px_24px_-4px_rgba(15,23,42,0.04)]">
      <div className="text-center max-w-2xl mx-auto mb-10">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">{data.heading}</h2>
        <p className="text-slate-600 text-sm sm:text-base mt-2">{data.subtitle}</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3 relative">
        {data.steps.map((s, idx) => (
          <div
            key={s.step}
            className="relative rounded-2xl bg-slate-50/80 border border-slate-200/70 p-6 sm:p-7 transition-all duration-200 hover:bg-white hover:shadow-md hover:border-slate-300"
          >
            <span className="text-xs font-mono font-bold text-emerald-700 block mb-3">{s.step}</span>
            <h3 className="text-lg font-bold text-slate-900 mb-2">{s.title}</h3>
            <p className="text-slate-600 text-sm leading-relaxed">{s.body}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
