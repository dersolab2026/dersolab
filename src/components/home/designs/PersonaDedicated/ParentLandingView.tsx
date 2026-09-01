'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  ShieldCheck,
  Lock,
  KeyRound,
  FileCheck2,
  Clock,
  Award,
  Users,
  CheckCircle2,
  TrendingUp,
  HeartHandshake,
  ArrowRight,
  Sparkles,
  PhoneCall,
  ChevronRight,
  Eye,
  CalendarCheck,
  Target,
} from 'lucide-react'

interface ParentLandingViewProps {
  examFilter: 'all' | 'lgs' | 'yks'
  onExamFilterChange: (filter: 'all' | 'lgs' | 'yks') => void
}

export function ParentLandingView({ examFilter, onExamFilterChange }: ParentLandingViewProps) {
  const [demoOtp, setDemoOtp] = useState('7K2M9X4A')
  const [isCopied, setIsCopied] = useState(false)

  function handleCopyOtp() {
    setIsCopied(true)
    setTimeout(() => setIsCopied(false), 2000)
  }

  return (
    <div className="space-y-16 py-6">
      {/* ── EXAM TOGGLE PILL ── */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
        <span className="text-xs font-mono text-emerald-400 uppercase tracking-widest flex items-center gap-1.5">
          <Target className="w-3.5 h-3.5" /> Çocuğunuzun Hazırlandığı Sınav:
        </span>
        <div className="inline-flex p-1 rounded-2xl bg-white/[0.04] border border-white/[0.1] backdrop-blur-xl">
          <button
            type="button"
            onClick={() => onExamFilterChange('all')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              examFilter === 'all'
                ? 'bg-emerald-400 text-slate-950 shadow-[0_0_20px_rgba(52,211,153,0.35)]'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Tüm Kademeler
          </button>
          <button
            type="button"
            onClick={() => onExamFilterChange('lgs')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              examFilter === 'lgs'
                ? 'bg-gradient-to-r from-emerald-400 to-teal-500 text-slate-950 shadow-[0_0_20px_rgba(52,211,153,0.35)]'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <span>📘 LGS Velisi</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-black/20 font-mono">8. Sınıf</span>
          </button>
          <button
            type="button"
            onClick={() => onExamFilterChange('yks')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              examFilter === 'yks'
                ? 'bg-gradient-to-r from-amber-400 to-orange-500 text-slate-950 shadow-[0_0_20px_rgba(251,191,36,0.35)]'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <span>🎓 YKS Velisi</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-black/20 font-mono">TYT · AYT</span>
          </button>
        </div>
      </div>

      {/* ── HERO SECTION ── */}
      <section className="relative text-center max-w-5xl mx-auto px-4">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-300 text-xs font-medium mb-6 backdrop-blur-md">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Şeffaf & Güvenli Veli Takip Altyapısı</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight leading-[1.1] mb-6">
          {examFilter === 'lgs' ? (
            <>
              Çocuğunuzun LGS Yolculuğunda{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">
                Gözünüz Asla Arkada Kalmasın
              </span>
            </>
          ) : examFilter === 'yks' ? (
            <>
              YKS Üniversite Maratonunda{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-amber-300 to-orange-400">
                Her Adımı ve İlerlemeyi Görün
              </span>
            </>
          ) : (
            <>
              Özel Ders Sürecinde{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-amber-400">
                Tam Şeffaflık ve Güven
              </span>
            </>
          )}
        </h1>

        <p className="text-lg sm:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed mb-8">
          Rastgele öğretmen aramaya, belirsiz ücretlere ve verimsiz derslere son.
          DersoLab Veli Paneli ile çocuğunuzun katıldığı seansları, bekleyen ödevlerini, deneme netlerini ve eğitmen notlarını tek ekranda izleyin.
        </p>

        {/* CTA BUTTONS */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/register"
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-emerald-400 to-teal-500 hover:from-emerald-300 hover:to-teal-400 text-slate-950 font-black text-base transition-all shadow-[0_0_30px_rgba(52,211,153,0.35)] hover:scale-105 flex items-center justify-center gap-2"
          >
            <span>Veli Hesabı Oluşturun</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/login"
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 text-white font-bold text-base transition-all flex items-center justify-center gap-2"
          >
            <span>Veli Girişi</span>
          </Link>
        </div>
      </section>

      {/* ── 4 BÜYÜK VELİ GÜVENCESİ ── */}
      <section className="max-w-5xl mx-auto px-4">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-6 rounded-3xl bg-[#11161d] border border-emerald-500/20 shadow-xl space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-400/10 border border-emerald-400/20 flex items-center justify-center text-emerald-400">
              <Award className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-white text-base">Yanmayan Kredi Garantisi</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Satın aldığınız ders kredilerinin süresi asla dolmaz. Çocuğunuz dilediği ay ve dönemde kullanabilir; paranız boşa gitmez.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-[#11161d] border border-emerald-500/20 shadow-xl space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-400/10 border border-emerald-400/20 flex items-center justify-center text-emerald-400">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-white text-base">Seçkin & Teyitli Kadro</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              DersoLab'ta herkes ders veremez. Tüm öğretmenler referanslı, diplomaları onaylı ve pedagojik yaklaşımı doğrulanmış uzmanlardır.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-[#11161d] border border-emerald-500/20 shadow-xl space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-400/10 border border-emerald-400/20 flex items-center justify-center text-emerald-400">
              <Eye className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-white text-base">Haftalık Rapor Şeffaflığı</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Eğitmen her hafta öğrencinin çalışma performansını, çözülen soru adedini ve deneme netlerini veli paneline raporlar.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-[#11161d] border border-emerald-500/20 shadow-xl space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-400/10 border border-emerald-400/20 flex items-center justify-center text-emerald-400">
              <HeartHandshake className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-white text-base">İlk Ders Memnuniyet Güvencesi</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              İlk seans tanışma amaçlıdır. Eğitmenle uyum sağlanamazsa hiçbir ücret kesilmeden başka bir eğitmenle seans planlanır.
            </p>
          </div>
        </div>
      </section>

      {/* ── INTERACTIVE FEATURE: 7 GÜNLÜK GÜVENLİ EŞLEŞME SİMÜLATÖRÜ ── */}
      <section className="max-w-5xl mx-auto px-4">
        <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-b from-[#131b24] to-[#0c1117] border border-emerald-500/20 shadow-2xl">
          <div className="grid sm:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-mono">
                <Lock className="w-3.5 h-3.5" /> KVKK & Gizlilik Uyumlu
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white leading-tight">
                Tek Kullanımlık Kod ile <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">
                  Güvenli Öğrenci Bağlama
                </span>
              </h2>
              <p className="text-sm text-slate-300 leading-relaxed">
                Çocuğunuz kendi hesabından <span className="font-mono text-emerald-400 bg-emerald-400/10 px-1.5 py-0.5 rounded">Ayarlar &gt; Veli Bağlantısı</span> menüsünden 7 gün geçerli tek kullanımlık bir kod üretir.
                Bu kodu veli panelinize girdiğiniz an çocuğunuzun hesabı onayınızla bağlanır.
              </p>
              <ul className="space-y-2 text-xs text-slate-300">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Şifre paylaşmaya gerek kalmaz</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>İstediğiniz an tek tıkla bağlantıyı kaldırabilirsiniz</span>
                </li>
              </ul>
            </div>

            {/* OTP Simulator UI */}
            <div className="p-6 rounded-2xl bg-black/60 border border-emerald-500/30 space-y-4 text-center">
              <span className="text-xs text-slate-400 font-mono">ÖĞRENCİDEN ALINAN KODU GİRİN:</span>
              <div className="flex items-center justify-center gap-2">
                <div className="px-6 py-3 rounded-xl bg-white/[0.08] border border-emerald-400/40 text-emerald-300 text-2xl font-mono font-black tracking-widest">
                  {demoOtp}
                </div>
                <button
                  type="button"
                  onClick={handleCopyOtp}
                  className="px-4 py-3 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-slate-950 text-xs font-bold transition-all cursor-pointer"
                >
                  {isCopied ? 'Kopyalandı ✓' : 'Bağla'}
                </button>
              </div>
              <p className="text-[11px] text-slate-500">
                ✓ Kod tek kullanımlıktır ve 7 gün geçerlidir.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── CANLI VELİ PANELİ ÖNİZLEMESİ ── */}
      <section className="max-w-5xl mx-auto px-4">
        <div className="p-6 sm:p-8 rounded-3xl bg-[#10141d] border border-white/[0.08] shadow-2xl space-y-6">
          <div className="flex items-center justify-between flex-wrap gap-4 pb-4 border-b border-white/[0.08]">
            <div>
              <span className="text-xs font-mono text-emerald-400 font-bold uppercase">Veli Paneli Görünümü</span>
              <h3 className="text-xl font-bold text-white mt-0.5">Egemen Dere (Öğrenci Takip Ekranı)</h3>
            </div>
            <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-bold border border-emerald-500/20">
              Aktif Bağlantı
            </span>
          </div>

          {/* 4 KPI Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.05]">
              <span className="text-xs text-slate-400">Kalan Kredi</span>
              <p className="text-2xl font-black text-amber-400 mt-1">4 Ders</p>
            </div>
            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.05]">
              <span className="text-xs text-slate-400">Bu Ay Yapılan Ders</span>
              <p className="text-2xl font-black text-emerald-400 mt-1">6 Ders</p>
            </div>
            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.05]">
              <span className="text-xs text-slate-400">Ders Katılımı</span>
              <p className="text-2xl font-black text-white mt-1">%100</p>
            </div>
            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.05]">
              <span className="text-xs text-slate-400">Bekleyen Ödev</span>
              <p className="text-2xl font-black text-sky-400 mt-1">1 Adet</p>
            </div>
          </div>

          {/* Teacher Weekly Note Preview */}
          <div className="p-4 rounded-2xl bg-emerald-950/20 border border-emerald-500/20 flex items-start gap-3">
            <CalendarCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <div className="text-xs">
              <p className="font-bold text-white mb-0.5">Eğitmen Haftalık Değerlendirmesi:</p>
              <p className="text-slate-300 leading-relaxed">
                "Egemen bu hafta Geometri üçgenlerde eşlik konusunu eksiksiz tamamladı. Çözdüğü 240 soru analiz edildi. Haftaya analitik geometriye geçiyoruz."
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
