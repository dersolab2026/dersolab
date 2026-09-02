'use client'

import { Check, X, Sparkles } from 'lucide-react'

export function AdComparisonGrid() {
  const rows = [
    {
      feature: 'Ders Formatı',
      traditional: '20-30 kişilik kalabalık sınıflar',
      dersolab: '1:1 Canlı ve Tamamen Size Özel',
    },
    {
      feature: 'Ders Kredileri & Bütçe',
      traditional: 'Kullanılmayan ay yanan bakiye',
      dersolab: 'Süresiz, Asla Yanmayan Krediler',
    },
    {
      feature: 'Öğretmen Seçimi',
      traditional: 'Kurumun atadığı rastgele hoca',
      dersolab: 'Özgeçmişini İnceleyip Bizzat Seçtiğiniz Kadro',
    },
    {
      feature: 'Gelişim & Veli Takibi',
      traditional: 'Yılda 1-2 veli toplantısı',
      dersolab: 'Her Seans Sonu Anlık Yazılı Rapor',
    },
    {
      feature: 'Başlangıç Güvencesi',
      traditional: 'Yıllık senet ve zorunlu sözleşme',
      dersolab: '20 Dk Ücretsiz Tanışma · Sıfır Taahhüt',
    },
  ]

  return (
    <div className="py-12 sm:py-16 border-t border-white/10 space-y-8 font-serif">
      <div className="text-center max-w-xl mx-auto space-y-2">
        <span className="text-xs font-bold tracking-widest uppercase text-amber-400 font-mono">
          ✦ ŞEFFAF KARŞILAŞTIRMA ✦
        </span>
        <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
          Neden Geleneksel Kurslar Değil, DersoLab?
        </h2>
      </div>

      <div className="rounded-3xl bg-slate-900/80 border-2 border-white/15 overflow-hidden backdrop-blur-2xl shadow-2xl font-sans">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px] text-left text-sm">
            <thead>
              <tr className="border-b border-white/10 bg-white/[0.04]">
                <th className="py-4 px-6 text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Kriter
                </th>
                <th className="py-4 px-6 text-xs font-bold text-rose-400 uppercase tracking-wider">
                  Geleneksel Kurslar
                </th>
                <th className="py-4 px-6 text-xs font-bold text-amber-300 uppercase tracking-wider bg-amber-500/10">
                  <div className="flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <span>DersoLab 1:1 Canlı</span>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10 text-xs sm:text-sm">
              {rows.map((r, idx) => (
                <tr key={idx} className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-4 px-6 font-semibold text-white">{r.feature}</td>
                  <td className="py-4 px-6 text-slate-400 flex items-center gap-2">
                    <X className="w-4 h-4 text-rose-500 shrink-0" />
                    <span>{r.traditional}</span>
                  </td>
                  <td className="py-4 px-6 font-bold text-emerald-300 bg-amber-500/[0.06]">
                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>{r.dersolab}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
