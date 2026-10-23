import type { Metadata } from 'next'
import Link from 'next/link'
import { Mail, Clock, ShieldCheck, ArrowLeft, MessageCircle } from 'lucide-react'

export const metadata: Metadata = {
  title: 'İletişim & Destek — DersoLab',
  description: 'DersoLab öğrenci, veli ve eğitmen destek kanalları. Bize e-posta veya destek hattımızdan ulaşın.',
  alternates: {
    canonical: '/contact',
  },
}

export default function ContactPage() {
  return (
    <div className="min-h-screen w-full bg-[#07090E] text-slate-100 flex flex-col justify-center items-center px-4 py-16 relative overflow-hidden">
      {/* Background Glow */}
      <div className="fixed top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-cyan-500/10 blur-[130px] pointer-events-none" />

      <div className="max-w-xl w-full bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-3xl p-8 sm:p-10 shadow-2xl relative z-10 space-y-8">
        <div>
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-white transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" /> Ana Sayfaya Dön
          </Link>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-bold mb-3">
            <ShieldCheck className="w-3.5 h-3.5" /> 7/24 Kesintisiz Destek
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            DersoLab Destek Merkezi
          </h1>
          <p className="text-sm text-slate-400 mt-2">
            Canlı dersler, rezervasyonlar, eğitmen başvuruları veya teknik konularla ilgili sorularınızda buradayız.
          </p>
        </div>

        <div className="space-y-4">
          {/* E-posta Kartı */}
          <a
            href="mailto:destek@dersolab.com"
            className="flex items-start gap-4 p-5 rounded-2xl bg-white/[0.03] border border-white/[0.08] hover:bg-white/[0.06] hover:border-cyan-500/30 transition-all group"
          >
            <div className="p-3 rounded-xl bg-cyan-500/10 text-cyan-400 group-hover:scale-110 transition-transform">
              <Mail className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">E-Posta Destek</div>
              <div className="text-base font-bold text-white mt-0.5">destek@dersolab.com</div>
              <div className="text-xs text-slate-400 mt-1">Ortalama yanıt süresi: &lt; 2 saat</div>
            </div>
          </a>

          {/* Çalışma Saatleri */}
          <div className="flex items-start gap-4 p-5 rounded-2xl bg-white/[0.03] border border-white/[0.08]">
            <div className="p-3 rounded-xl bg-amber-500/10 text-amber-400">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Çalışma Saatleri</div>
              <div className="text-base font-bold text-white mt-0.5">Haftanın 7 Günü: 09:00 — 23:00</div>
              <div className="text-xs text-slate-400 mt-1">Canlı ders saatlerinde nöbetçi teknik ekip aktiftir.</div>
            </div>
          </div>

          {/* WhatsApp / Canlı İletişim */}
          <a
            href="https://wa.me/905000000000?text=Merhaba,%20DersoLab%20hakkında%20bilgi%20almak%20istiyorum."
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-start gap-4 p-5 rounded-2xl bg-white/[0.03] border border-white/[0.08] hover:bg-white/[0.06] hover:border-emerald-500/30 transition-all group"
          >
            <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400 group-hover:scale-110 transition-transform">
              <MessageCircle className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Hızlı İletişim</div>
              <div className="text-base font-bold text-white mt-0.5">WhatsApp Danışma Hattı</div>
              <div className="text-xs text-slate-400 mt-1">Ön kayıt, veli bilgilendirme ve koçluk desteği</div>
            </div>
          </a>
        </div>

        <div className="pt-4 border-t border-white/[0.08] flex items-center justify-between text-xs text-slate-400">
          <Link href="/hakkimizda" className="hover:text-cyan-400 transition-colors">
            Hakkımızda
          </Link>
          <Link href="/terms" className="hover:text-cyan-400 transition-colors">
            Kullanım Şartları
          </Link>
          <Link href="/privacy" className="hover:text-cyan-400 transition-colors">
            Gizlilik Politikası
          </Link>
        </div>
      </div>
    </div>
  )
}
