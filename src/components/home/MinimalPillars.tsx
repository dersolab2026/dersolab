'use client'

import { Video, Coins, Compass } from 'lucide-react'
import type { PersonaType } from './PersonaSwitcher'

export function MinimalPillars({ persona }: { persona: PersonaType }) {
  const pillars = [
    {
      index: '01',
      title: 'Bire Bir Canlı Bağlantı',
      desc: 'Google Meet altyapısıyla tek tıkla doğrudan HD ders odasına bağlanın. Ekran paylaşımı ve dijital tahta ile odaklı seanslar.',
      icon: Video,
      badge: 'Google Meet',
    },
    {
      index: '02',
      title: 'Yanmayan Kredi Mimarisi',
      desc: 'Zorunlu abonelikler veya süresi dolan paketler yok. Yalnızca aldığınız ders kadar kredi harcar, kalan bakiyeyi süresiz korursunuz.',
      icon: Coins,
      badge: 'Süresiz Bakiye',
    },
    {
      index: '03',
      title: 'Entegre Koçluk & Takip',
      desc: 'Ders notları, ödev teslimleri ve haftalık hedefler tek bir panelde birleşir. Eksik konularınızı anlık tespit edin.',
      icon: Compass,
      badge: 'Hedef Yönetimi',
    },
  ]

  return (
    <div className="space-y-6">
      <div className="text-center max-w-2xl mx-auto mb-8">
        <span className="text-xs font-mono font-bold uppercase tracking-widest text-emerald-400">
          Temel Standartlar
        </span>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1">
          Gereksiz Ayrıntılardan Arındırılmış Eğitim
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
        {pillars.map((p) => {
          const Icon = p.icon

          return (
            <div
              key={p.index}
              className="group relative rounded-3xl bg-slate-900/40 backdrop-blur-xl border border-white/10 p-6 sm:p-8 hover:border-white/20 transition-all duration-300 hover:-translate-y-1 shadow-[0_8px_30px_rgba(0,0,0,0.2)]"
            >
              <div className="flex items-center justify-between mb-6">
                <span className="text-xs font-mono font-bold text-slate-500">{p.index}</span>
                <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-white/[0.05] text-slate-300 border border-white/10">
                  {p.badge}
                </span>
              </div>

              <div className="w-12 h-12 rounded-2xl bg-white/[0.05] border border-white/10 flex items-center justify-center text-emerald-400 mb-5 group-hover:scale-105 transition-transform">
                <Icon className="w-5 h-5" />
              </div>

              <h3 className="text-lg font-bold text-white mb-2 tracking-tight">{p.title}</h3>
              <p className="text-sm text-slate-400 leading-relaxed">{p.desc}</p>
            </div>
          )
        })}
      </div>
    </div>
  )
}
