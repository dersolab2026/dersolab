'use client'

import { Video, ShieldCheck, Cpu, Zap, Lock, Sparkles, Orbit } from 'lucide-react'
import type { PersonaType } from '../../PersonaSwitcher'

export function SpatialBentoGrid({ persona }: { persona: PersonaType }) {
  const modules = [
    {
      code: 'NODE // 01',
      title: 'Google Meet Doğrudan Lazer Köprüsü',
      desc: 'Rezervasyon anında sıfır gecikmeyle üretilen güvenli HD toplantı odası. İki tarafa anında senkronize Google Takvim bildirimleri.',
      icon: Video,
      accent: 'border-emerald-500/40 shadow-[0_0_30px_rgba(16,185,129,0.15)]',
      glowIcon: 'text-emerald-400',
      badge: '0.1ms Eşleşme',
    },
    {
      code: 'NODE // 02',
      title: 'Değişmez Kredi Kasası (Asla Yanmaz)',
      desc: 'Kullanılmayan hiçbir ders kredisi süreyle sınırlanmaz veya silinmez. Bakiyeniz hesabınızda şifreli ve güvende kalır.',
      icon: Lock,
      accent: 'border-cyan-500/40 shadow-[0_0_30px_rgba(6,182,212,0.15)]',
      glowIcon: 'text-cyan-400',
      badge: 'Süresiz Bakiye',
    },
    {
      code: 'NODE // 03',
      title: 'Yörünge Takibi & Koçluk Matrisi',
      desc: 'Deneme netleri, ödev teslimleri ve hedef puan analizleri tek bir dijital konsolda toplanır. Eksik konu tespitiyle hedefe kilitlenin.',
      icon: Cpu,
      accent: 'border-purple-500/40 shadow-[0_0_30px_rgba(139,92,246,0.15)]',
      glowIcon: 'text-purple-400',
      badge: 'Net Simülasyonu',
    },
  ]

  return (
    <div className="space-y-6">
      <div className="text-center max-w-2xl mx-auto mb-8 font-mono">
        <span className="text-xs font-bold uppercase tracking-widest text-cyan-400">
          SPATIAL CORE // ALTYAPI PROTOKOLÜ
        </span>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1 font-mono">
          Yüksek Hassasiyetli Kuantum Eğitim Mimarisi
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {modules.map((m) => {
          const Icon = m.icon

          return (
            <div
              key={m.code}
              className={`relative overflow-hidden rounded-3xl bg-black/60 border ${m.accent} backdrop-blur-2xl p-6 sm:p-8 transition-all duration-300 hover:-translate-y-1`}
            >
              {/* Corner Sci-Fi Bracket */}
              <div className="absolute top-3 right-3 text-[10px] font-mono text-slate-500">
                {m.code}
              </div>

              <div className="w-12 h-12 rounded-2xl bg-white/[0.04] border border-white/10 flex items-center justify-center mb-5">
                <Icon className={`w-6 h-6 ${m.glowIcon}`} />
              </div>

              <div className="inline-block text-[10px] font-mono font-semibold px-2.5 py-0.5 rounded-full bg-white/[0.05] text-slate-300 border border-white/10 mb-3">
                {m.badge}
              </div>

              <h3 className="text-lg font-bold text-white font-mono mb-2 tracking-tight">
                {m.title}
              </h3>

              <p className="text-sm text-slate-400 leading-relaxed font-sans">
                {m.desc}
              </p>
            </div>
          )
        })}
      </div>
    </div>
  )
}
