'use client'

import { Video, ShieldCheck, Clock, CheckCircle } from 'lucide-react'
import type { PersonaType } from '../../PersonaSwitcher'

export function HumanValuePillars({ persona }: { persona: PersonaType }) {
  const pillars = [
    {
      icon: Clock,
      title: '20 Dakika Ücretsiz Tanışma',
      desc: 'İlk seansınız tamamen ücretsizdir. Kredi kartı gerekmez; öğretmeninizle tanışır, ders uyumunu test edersiniz.',
      tag: 'Sıfır Risk',
    },
    {
      icon: ShieldCheck,
      title: 'Kredileriniz Asla Yanmaz',
      desc: 'Geleneksel kurslardaki ay sonunda silinen bakiye sistemi yok. Aldığınız her ders kredisi süresiz geçerlidir.',
      tag: 'Bütçe Güvencesi',
    },
    {
      icon: Video,
      title: 'Google Meet ile Kolay Erişim',
      desc: 'Ekstra program indirmeye gerek kalmadan, tek tıkla doğrudan Google Meet üzerinden 1:1 canlı derse bağlanırsınız.',
      tag: 'Zahmetsiz Bağlantı',
    },
  ]

  return (
    <div className="py-12 border-t border-slate-200/80">
      <div className="text-center max-w-xl mx-auto mb-10 space-y-2">
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-950 tracking-tight">
          Neden DersoLab ile Özel Ders?
        </h2>
        <p className="text-sm text-slate-600">
          Öğrenci, veli ve öğretmen için karmaşadan uzak, net ve şeffaf bir eğitim deneyimi.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {pillars.map((p, idx) => {
          const Icon = p.icon

          return (
            <div
              key={idx}
              className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow space-y-3"
            >
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-md">
                  {p.tag}
                </span>
              </div>

              <h3 className="text-base font-bold text-slate-900">{p.title}</h3>

              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                {p.desc}
              </p>
            </div>
          )
        })}
      </div>
    </div>
  )
}
