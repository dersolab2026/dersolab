'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Sparkles, Layers, ShieldCheck, Eye, ArrowUpRight } from 'lucide-react'

export function DesignLabSwitcher() {
  const pathname = usePathname()

  const designs = [
    {
      id: '/tasarim4',
      name: 'Tasarım 4: MasterClass Studio',
      badge: 'Obsidian & All-Star',
      desc: 'Canlı Soru Çözüm Tahtası + Net Simülatörü',
      mcp: 'Taste-Skill + Impeccable'
    },
    {
      id: '/tasarim5',
      name: 'Tasarım 5: Modern Academy',
      badge: '21st.dev & Aceternity Bento',
      desc: 'İnteraktif Eşleşme Sihirbazı + Sesli Tanıtım + Kredi Cüzdanı',
      mcp: 'Aceternity + Magic UI + 21st'
    },
    {
      id: '/tasarim3',
      name: 'Tasarım 3: All-Star Hero',
      badge: 'Birebir Odaklı',
      desc: 'Seçkin Öğretmen Kadrosu',
      mcp: 'All-Star Grid'
    },
    {
      id: '/',
      name: 'Mevcut Canlı Sürüm',
      badge: 'Yayındaki Ana Sayfa',
      desc: 'Orijinal DersoLab Ana Sayfası',
      mcp: 'Production'
    }
  ]

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-4xl">
      <div className="bg-[#0A0E1A]/95 backdrop-blur-xl border border-white/[0.15] rounded-2xl shadow-2xl p-2.5 sm:p-3 text-white flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Sol: Bilgi & Güvence Rozeti */}
        <div className="flex items-center gap-2.5 px-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-left">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-white tracking-wide">DersoLab Design Lab</span>
              <span className="text-xs font-mono px-2.5 py-1 rounded bg-amber-400/10 text-amber-300 border border-amber-400/20">
                LOCAL ONLY • NO GIT PUSH
              </span>
            </div>
            <p className="text-xs text-slate-300 hidden sm:block">
              Bağlanan MCP ve kütüphanelerle üretilen alternatif tasarımlar
            </p>
          </div>
        </div>

        {/* Sağ: Tasarım Butonları */}
        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {designs.map((d) => {
            const isActive = pathname === d.id
            return (
              <Link
                key={d.id}
                href={d.id}
                className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap flex items-center gap-1.5 shrink-0 ${
                  isActive
                    ? 'bg-amber-400 text-slate-950 font-bold shadow-md'
                    : 'bg-white/[0.05] hover:bg-white/[0.1] text-slate-200 hover:text-white border border-white/[0.08]'
                }`}
              >
                <span>{d.badge}</span>
                {isActive && <span className="w-1.5 h-1.5 rounded-full bg-slate-950" />}
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}
