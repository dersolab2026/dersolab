'use client'

import { useState } from 'react'
import { Zap, Radio, Check, Sparkles, Video, Lock, ArrowRight } from 'lucide-react'
import Link from 'next/link'

export function SpatialBeamSimulator() {
  const [beaming, setBeaming] = useState(false)
  const [beamed, setBeamed] = useState(false)

  function triggerBeam() {
    setBeaming(true)
    setBeamed(false)
    setTimeout(() => {
      setBeaming(false)
      setBeamed(true)
    }, 1200)
  }

  return (
    <div className="relative rounded-3xl bg-black/70 border border-emerald-500/30 p-6 sm:p-10 lg:p-12 overflow-hidden shadow-[0_0_50px_rgba(16,185,129,0.15)] backdrop-blur-3xl">
      {/* Background glow beam */}
      <div className="pointer-events-none absolute -right-24 -top-24 w-96 h-96 bg-emerald-500/15 rounded-full blur-3xl animate-pulse-glow" />
      <div className="pointer-events-none absolute -left-24 -bottom-24 w-96 h-96 bg-cyan-500/15 rounded-full blur-3xl animate-pulse-glow" />

      <div className="relative z-10 grid lg:grid-cols-12 gap-8 items-center font-mono">
        <div className="lg:col-span-6 space-y-4 text-center lg:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/50 border border-emerald-500/30 text-emerald-400 text-xs">
            <Sparkles className="w-3.5 h-3.5" />
            <span>İNTERAKTİF BAĞLANTI SİMÜLATÖRÜ</span>
          </div>

          <h3 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
            Canlı Google Meet Köprüsünü Simüle Edin
          </h3>

          <p className="text-sm sm:text-base text-slate-400 font-sans leading-relaxed">
            DersoLab'ın tek tıkla otomatik oda oluşturma ve takvim eşitleme motorunu anında canlı test edin.
          </p>

          <div className="pt-2">
            <button
              type="button"
              onClick={triggerBeam}
              disabled={beaming}
              className="group relative inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl bg-gradient-to-r from-emerald-400 to-cyan-400 text-slate-950 font-bold text-sm sm:text-base shadow-[0_0_25px_rgba(16,185,129,0.4)] hover:shadow-[0_0_35px_rgba(16,185,129,0.6)] active:scale-95 transition-all cursor-pointer disabled:opacity-50"
            >
              <Zap className={`w-4 h-4 ${beaming ? 'animate-spin' : ''}`} />
              <span>{beaming ? 'KUANTUM BAĞLANTISI KURULUYOR...' : 'CANLI SEANS BAŞLAT (TEST ET)'}</span>
            </button>
          </div>
        </div>

        {/* Live Simulation Cockpit Visual */}
        <div className="lg:col-span-6">
          <div className="rounded-2xl bg-slate-950/90 border border-white/15 p-5 sm:p-6 shadow-2xl space-y-4 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2 text-emerald-400">
                <Radio className="w-4 h-4 animate-pulse" />
                <span className="font-bold">SEANS FREKANSI: 1080p 60FPS</span>
              </div>
              <span className="text-[10px] text-slate-500">256-BIT ENCRYPTION</span>
            </div>

            <div className="space-y-2.5">
              <div className="p-3 rounded-xl bg-black/60 border border-white/10 flex items-center justify-between">
                <span className="text-slate-400">Toplantı Bağlantısı:</span>
                <span className="text-cyan-400 font-bold">
                  {beamed ? 'meet.google.com/dersolab-live-hd' : 'Tıklama Bekleniyor...'}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-black/60 border border-white/10 flex items-center justify-between">
                <span className="text-slate-400">Google Takvim Senkronizasyonu:</span>
                <span className={beamed ? 'text-emerald-400 font-bold' : 'text-slate-500'}>
                  {beamed ? 'Eşitlendi ✓ (Bildirim Gönderildi)' : 'Beklemede'}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/30 flex items-center justify-between">
                <span className="text-slate-300">Ders Kredisi Güvencesi:</span>
                <span className="text-emerald-300 font-bold">Süresiz Aktif (Asla Yanmaz)</span>
              </div>
            </div>

            {beamed && (
              <div className="pt-2 text-center animate-fade-in">
                <Link
                  href="/demo-ders"
                  className="text-xs text-emerald-400 hover:text-emerald-300 font-bold underline inline-flex items-center gap-1"
                >
                  <span>Gerçek 20 Dk Hoş Geldin Paketini Almak İçin Kaydolun →</span>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
