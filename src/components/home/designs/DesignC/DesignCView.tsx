'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  Search,
  Star,
  ShieldCheck,
  Clock,
  Zap,
  Users,
  BookOpen,
  Calculator,
  Atom,
  FlaskConical,
  Globe,
  Music,
  Code,
  ChevronRight,
  CheckCircle2,
  TrendingUp,
  Award,
} from 'lucide-react'

const SUBJECTS = [
  { icon: Calculator, label: 'Matematik', color: 'from-blue-600 to-blue-700', students: '3.2K' },
  { icon: Atom, label: 'Fizik', color: 'from-purple-600 to-purple-700', students: '1.8K' },
  { icon: FlaskConical, label: 'Kimya', color: 'from-emerald-600 to-emerald-700', students: '1.4K' },
  { icon: Globe, label: 'İngilizce', color: 'from-sky-600 to-sky-700', students: '2.9K' },
  { icon: BookOpen, label: 'Edebiyat', color: 'from-rose-600 to-rose-700', students: '0.9K' },
  { icon: Code, label: 'Programlama', color: 'from-orange-600 to-orange-700', students: '1.1K' },
  { icon: Music, label: 'Müzik', color: 'from-pink-600 to-pink-700', students: '0.6K' },
  { icon: TrendingUp, label: 'YKS / LGS', color: 'from-amber-600 to-amber-700', students: '4.1K' },
]

const TEACHERS = [
  {
    name: 'Selin Karadağ',
    branch: 'Matematik · YKS',
    uni: 'Boğaziçi Üniversitesi',
    rating: 4.9,
    reviews: 187,
    price: 320,
    tag: 'Çok Tercih Edilen',
    tagColor: 'bg-amber-400 text-slate-900',
    avatar: '👩‍🏫',
    bg: 'from-blue-950 to-slate-900',
    border: 'border-blue-500/30',
  },
  {
    name: 'Emre Yılmaz',
    branch: 'Fizik · Kimya',
    uni: 'ODTÜ Fizik',
    rating: 4.8,
    reviews: 134,
    price: 280,
    tag: 'Hızlı Yanıt',
    tagColor: 'bg-emerald-400 text-slate-900',
    avatar: '👨‍🔬',
    bg: 'from-purple-950 to-slate-900',
    border: 'border-purple-500/30',
  },
  {
    name: 'Ayşe Demir',
    branch: 'İngilizce · IELTS',
    uni: 'İTÜ İngiliz Dili',
    rating: 5.0,
    reviews: 212,
    price: 260,
    tag: 'En Yüksek Puan',
    tagColor: 'bg-sky-400 text-slate-900',
    avatar: '👩‍💻',
    bg: 'from-sky-950 to-slate-900',
    border: 'border-sky-500/30',
  },
]

const STEPS = [
  {
    num: '01',
    icon: Search,
    title: 'Branş ve Öğretmen Seçin',
    desc: 'Hedef sınavınıza, bütçenize ve müsaitliğinize göre onaylı öğretmenler arasından seçim yapın.',
    color: 'text-amber-400',
  },
  {
    num: '02',
    icon: Clock,
    title: 'Ücretsiz Tanışma Dersini Ayarlayın',
    desc: 'Öğretmenin takviminden size uygun saati seçin. Kart bilgisi gerekmez, ödeme yok.',
    color: 'text-emerald-400',
  },
  {
    num: '03',
    icon: Zap,
    title: 'Google Meet ile Derse Başlayın',
    desc: 'Ders linki otomatik oluşur, takviminize düşer. Her seans sonrası öğretmen raporu gelir.',
    color: 'text-sky-400',
  },
]

const TRUST = [
  { icon: ShieldCheck, label: 'Diploma Doğrulamalı', sub: 'Her öğretmen tescilli', color: 'text-emerald-400' },
  { icon: Award, label: 'Yanmayan Kredi', sub: 'Hiçbir zaman expire olmaz', color: 'text-amber-400' },
  { icon: Users, label: '12.400+ Öğrenci', sub: '%98 memnuniyet oranı', color: 'text-sky-400' },
  { icon: CheckCircle2, label: 'Para İade Garantisi', sub: 'İlk ders beğenmezseniz', color: 'text-rose-400' },
]

export function DesignCView() {
  const [activeSubject, setActiveSubject] = useState<number | null>(null)
  const [searchVal, setSearchVal] = useState('')

  return (
    <div className="min-h-screen bg-[#09090f] text-white font-sans selection:bg-amber-400/30">
      {/* NAV */}
      <nav className="sticky top-0 z-50 border-b border-white/[0.06] bg-[#09090f]/90 backdrop-blur-2xl">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xl font-black text-amber-400 tracking-tight">dersolab</span>
            <span className="text-[10px] font-mono bg-amber-400/15 text-amber-300 px-2 py-0.5 rounded border border-amber-400/20">BETA</span>
          </div>

          <div className="hidden sm:flex items-center gap-6 text-sm text-slate-400">
            {['Öğretmenler', 'Branşlar', 'Fiyatlar', 'Veli Paneli'].map(label => (
              <button key={label} type="button" className="hover:text-white transition-colors cursor-pointer">{label}</button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <Link href="/login" className="px-4 py-2 text-sm text-slate-300 hover:text-white transition-colors">Giriş</Link>
            <Link
              href="/register"
              className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-900 text-sm font-bold transition-all shadow-[0_0_20px_rgba(251,191,36,0.25)]"
            >
              Ücretsiz Başla
            </Link>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="relative max-w-6xl mx-auto px-4 pt-20 pb-16 text-center">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full bg-amber-500/8 blur-[120px]" />
        </div>

        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.06] border border-white/[0.1] text-xs text-slate-300 mb-8 backdrop-blur-xl">
          <span className="flex gap-0.5">
            {[0,1,2,3,4].map(i => <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />)}
          </span>
          <span className="font-semibold text-white">4.9/5</span>
          <span className="text-slate-500">·</span>
          <span>12.400+ öğrenci güveniyor</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-black leading-[1.1] tracking-tight mb-6 max-w-4xl mx-auto">
          {"Türkiye'nin En İyi "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-400">
            Onaylı Özel Ders
          </span>
          {" Platformu"}
        </h1>

        <p className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
          Diploma doğrulamalı öğretmenler, yanmayan kredi ve ilk ders ücretsiz.
          LGS ve YKS için uzman kadroyla hazırlanın.
        </p>

        {/* Search bar */}
        <div className="relative max-w-xl mx-auto mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
          <input
            type="text"
            id="designc-search"
            value={searchVal}
            onChange={e => setSearchVal(e.target.value)}
            placeholder="Branş veya öğretmen arayın... (Matematik, Fizik...)"
            className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white/[0.07] border border-white/[0.12] text-white placeholder:text-slate-500 text-sm focus:outline-none focus:border-amber-400/50 focus:bg-white/[0.1] transition-all"
          />
          <button type="button" className="absolute right-2 top-1/2 -translate-y-1/2 px-5 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-900 text-sm font-bold transition-all cursor-pointer">
            Ara
          </button>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 text-sm text-slate-500">
          <span>Popüler:</span>
          {['YKS Matematik', 'LGS Fen', 'YKS Fizik', 'İngilizce'].map(s => (
            <button key={s} type="button" className="px-3 py-1 rounded-lg bg-white/[0.05] border border-white/[0.08] text-slate-400 hover:text-white hover:bg-white/[0.1] transition-all text-xs cursor-pointer">
              {s}
            </button>
          ))}
        </div>
      </section>

      {/* SOCIAL PROOF TICKER */}
      <div className="border-y border-white/[0.06] bg-white/[0.02] py-5">
        <div className="max-w-6xl mx-auto px-4 flex flex-wrap items-center justify-center sm:justify-between gap-6">
          {[
            { val: '850+', label: 'Onaylı Eğitmen' },
            { val: '12.400+', label: 'Mutlu Öğrenci' },
            { val: '98%', label: 'Memnuniyet Oranı' },
            { val: '47', label: 'Ders Branşı' },
            { val: '0₺', label: 'İlk Ders' },
          ].map(({ val, label }) => (
            <div key={label} className="text-center">
              <div className="text-2xl font-black text-amber-400">{val}</div>
              <div className="text-xs text-slate-500 mt-0.5">{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* SUBJECTS */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <h2 className="text-2xl sm:text-3xl font-black text-center mb-3">Hangi branşta ders almak istiyorsunuz?</h2>
        <p className="text-slate-400 text-center mb-10 text-sm">Her branşta diploma doğrulamalı öğretmen bulunmaktadır.</p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {SUBJECTS.map((subj, i) => {
            const Icon = subj.icon
            const isActive = activeSubject === i
            return (
              <button
                key={subj.label}
                type="button"
                onClick={() => setActiveSubject(isActive ? null : i)}
                className={`relative p-5 rounded-2xl border text-left transition-all cursor-pointer overflow-hidden ${
                  isActive
                    ? 'border-amber-400/60 bg-amber-400/10 shadow-[0_0_30px_rgba(251,191,36,0.15)]'
                    : 'border-white/[0.08] bg-white/[0.03] hover:border-white/20 hover:bg-white/[0.06]'
                }`}
              >
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${subj.color} flex items-center justify-center mb-3 shadow-lg`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <p className="font-bold text-white text-sm">{subj.label}</p>
                <p className="text-xs text-slate-500 mt-0.5">{subj.students} öğrenci</p>
                {isActive && (
                  <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-amber-400 flex items-center justify-center">
                    <CheckCircle2 className="w-3 h-3 text-slate-900" />
                  </div>
                )}
              </button>
            )
          })}
        </div>

        {activeSubject !== null && (
          <div className="mt-6 flex justify-center">
            <Link
              href="/register"
              className="flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-900 font-bold transition-all shadow-[0_0_30px_rgba(251,191,36,0.3)]"
            >
              {SUBJECTS[activeSubject].label} öğretmeni bul
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        )}
      </section>

      {/* HOW IT WORKS */}
      <section className="border-y border-white/[0.06] bg-white/[0.02] py-16">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-2xl sm:text-3xl font-black text-center mb-3">3 adımda derse başlayın</h2>
          <p className="text-slate-400 text-center mb-12 text-sm">Kayıt olmak ücretsiz, kredi kartı gerekmez.</p>

          <div className="grid sm:grid-cols-3 gap-6">
            {STEPS.map(step => {
              const Icon = step.icon
              return (
                <div key={step.num} className="relative p-6 rounded-2xl bg-white/[0.04] border border-white/[0.08] hover:border-white/20 transition-all">
                  <div className={`text-6xl font-black ${step.color} opacity-20 absolute top-4 right-5 font-mono leading-none select-none`}>
                    {step.num}
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-white/[0.06] border border-white/[0.1] flex items-center justify-center mb-4">
                    <Icon className={`w-6 h-6 ${step.color}`} />
                  </div>
                  <h3 className="font-bold text-white mb-2">{step.title}</h3>
                  <p className="text-sm text-slate-400 leading-relaxed">{step.desc}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* FEATURED TEACHERS */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black mb-1">Öne Çıkan Eğitmenler</h2>
            <p className="text-slate-400 text-sm">Tüm eğitmenlerimizin diplomaları tek tek doğrulanmıştır.</p>
          </div>
          <Link href="/register" className="hidden sm:flex items-center gap-1 text-sm text-amber-400 hover:text-amber-300 transition-colors">
            Tümünü gör <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid sm:grid-cols-3 gap-4">
          {TEACHERS.map(t => (
            <div
              key={t.name}
              className={`relative rounded-2xl border ${t.border} bg-gradient-to-b ${t.bg} p-6 hover:scale-[1.02] transition-all cursor-pointer`}
            >
              <span className={`absolute top-4 right-4 text-[10px] font-black px-2.5 py-1 rounded-full ${t.tagColor}`}>
                {t.tag}
              </span>

              <div className="w-16 h-16 rounded-2xl bg-white/[0.08] border border-white/[0.1] flex items-center justify-center text-3xl mb-4">
                {t.avatar}
              </div>

              <h3 className="font-bold text-white text-lg mb-0.5">{t.name}</h3>
              <p className="text-xs text-slate-400 mb-1">{t.branch}</p>
              <p className="text-xs text-slate-500 mb-3 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-emerald-400" />
                {t.uni}
              </p>

              <div className="flex items-center gap-2 mb-4">
                <div className="flex gap-0.5">
                  {[0,1,2,3,4].map(i => (
                    <Star key={i} className={`w-3.5 h-3.5 ${i < Math.floor(t.rating) ? 'fill-amber-400 text-amber-400' : 'text-slate-600'}`} />
                  ))}
                </div>
                <span className="text-sm font-bold text-amber-400">{t.rating}</span>
                <span className="text-xs text-slate-500">({t.reviews} yorum)</span>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xl font-black text-white">{t.price}₺</span>
                  <span className="text-xs text-slate-500">/saat</span>
                </div>
                <Link
                  href="/register"
                  className="px-4 py-2 rounded-xl bg-amber-400/15 hover:bg-amber-400 text-amber-300 hover:text-slate-900 text-xs font-bold border border-amber-400/30 hover:border-amber-400 transition-all"
                >
                  Tanışma Dersi →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* TRUST BADGES */}
      <section className="border-y border-white/[0.06] bg-white/[0.02] py-12">
        <div className="max-w-5xl mx-auto px-4 grid grid-cols-2 sm:grid-cols-4 gap-6">
          {TRUST.map(t => {
            const Icon = t.icon
            return (
              <div key={t.label} className="text-center">
                <div className="w-12 h-12 rounded-2xl bg-white/[0.06] border border-white/[0.08] flex items-center justify-center mx-auto mb-3">
                  <Icon className={`w-6 h-6 ${t.color}`} />
                </div>
                <p className="font-bold text-white text-sm">{t.label}</p>
                <p className="text-xs text-slate-500 mt-0.5">{t.sub}</p>
              </div>
            )
          })}
        </div>
      </section>

      {/* BOTTOM CTA */}
      <section className="max-w-4xl mx-auto px-4 py-20 text-center">
        <div className="relative p-10 sm:p-16 rounded-3xl bg-gradient-to-b from-amber-500/10 to-transparent border border-amber-500/20 overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 rounded-full bg-amber-500/10 blur-[80px]" />
          </div>
          <h2 className="text-3xl sm:text-4xl font-black mb-4 relative">
            {"İlk Dersiniz "}
            <span className="text-amber-400">Bizden</span>
          </h2>
          <p className="text-slate-400 mb-8 relative max-w-lg mx-auto">
            Kart bilgisi gerekmez. Beğenmezseniz hiçbir ücret ödemezsiniz. 850+ onaylı öğretmen arasından seçin.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center relative">
            <Link
              href="/register"
              className="px-10 py-4 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-900 font-black text-lg transition-all shadow-[0_0_40px_rgba(251,191,36,0.35)] hover:shadow-[0_0_60px_rgba(251,191,36,0.5)]"
            >
              {"Ücretsiz Kaydolun →"}
            </Link>
            <Link
              href="/login"
              className="px-10 py-4 rounded-2xl bg-white/[0.06] hover:bg-white/[0.1] border border-white/[0.1] text-white font-bold text-lg transition-all"
            >
              Giriş Yapın
            </Link>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/[0.06] py-8">
        <div className="max-w-6xl mx-auto px-4 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-600">
          <span className="font-black text-slate-400">dersolab</span>
          <div className="flex gap-6">
            <Link href="/privacy" className="hover:text-slate-400 transition-colors">Gizlilik</Link>
            <Link href="/terms" className="hover:text-slate-400 transition-colors">Kullanım Şartları</Link>
            <Link href="/hakkimizda" className="hover:text-slate-400 transition-colors">Hakkımızda</Link>
          </div>
          <span>© 2025 DersoLab</span>
        </div>
      </footer>
    </div>
  )
}
