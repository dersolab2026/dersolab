'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  Briefcase,
  Calendar,
  CreditCard,
  Video,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Layers,
  ChevronRight,
} from 'lucide-react'

export function InstructorLandingView() {
  const [activeTab, setActiveTab] = useState<'calendar' | 'crm' | 'payout'>('calendar')

  return (
    <div className="space-y-16 py-6">
      {/* ── HERO SECTION ── */}
      <section className="relative text-center max-w-5xl mx-auto px-4">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-500/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/25 text-blue-300 text-xs font-medium mb-6 backdrop-blur-md">
          <Briefcase className="w-3.5 h-3.5 text-blue-400" />
          <span>Seçkin Eğitmen & Koç Ağı</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight leading-[1.1] mb-6">
          Öğretmenliğinizi Teknolojimizle Büyütün,{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-sky-300 to-indigo-300">
            Zamanınızı Dersinize Ayırın
          </span>
        </h1>

        <p className="text-lg sm:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed mb-8">
          LGS ve YKS branşlarında uzman eğitmenler için tasarlandı.
          Google Takvim entegrasyonuyla otomatik randevu yönetimi, haftalık koçluk CRM'i ve düzenli IBAN ödemeleri ile prestijli bir çalışma ortamı.
        </p>

        {/* CTA BUTTONS */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/register"
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-400 hover:to-indigo-500 text-white font-black text-base transition-all shadow-[0_0_30px_rgba(59,130,246,0.35)] hover:scale-105 flex items-center justify-center gap-2"
          >
            <span>Eğitmen Başvurusu Yapın</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/login"
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 text-white font-bold text-base transition-all flex items-center justify-center gap-2"
          >
            <span>Eğitmen Girişi</span>
          </Link>
        </div>
      </section>

      {/* ── 3 TEMEL EĞİTMEN AVANTAJI ── */}
      <section className="max-w-5xl mx-auto px-4">
        <div className="grid sm:grid-cols-3 gap-6">
          <div className="p-8 rounded-3xl bg-[#111622] border border-blue-500/20 shadow-xl space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
              <Calendar className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-white text-lg">Google Takvim 2-Yönlü Senkron</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Müsait saatlerinizi belirleyin (örn: 09:00 - 21:00). Öğrenci randevu aldığında Google Meet linki iki tarafa da otomatik gönderilir.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-[#111622] border border-blue-500/20 shadow-xl space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
              <Layers className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-white text-lg">Gelişmiş Koçluk CRM</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Öğrencilerinizin deneme netlerini, soru sayılarını ve çalışma günlüğünü tek panelden görün. <strong>"Geçen Haftayı Kopyala"</strong> ile saniyeler içinde plan yapın.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-[#111622] border border-blue-500/20 shadow-xl space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
              <CreditCard className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-white text-lg">Şeffaf Muhasebe & Düzenli IBAN</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Seanslarınız otomatik muhasebeleştirilir. Seans ücretleriniz belirlenen periyotlarda doğrudan IBAN hesabınıza yatırılır.
            </p>
          </div>
        </div>
      </section>

      {/* ── EĞİTMEN PANELİ İNTERAKTİF ÖNİZLEMESİ ── */}
      <section className="max-w-5xl mx-auto px-4">
        <div className="p-6 sm:p-10 rounded-3xl bg-gradient-to-b from-[#131929] to-[#0c101c] border border-blue-500/20 shadow-2xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.08] pb-6">
            <div>
              <span className="text-xs font-mono text-blue-400 font-bold uppercase">Eğitmen Paneli Araçları</span>
              <h2 className="text-2xl font-black text-white mt-1">Öğretmenler İçin Tasarlanmış İş Akışı</h2>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setActiveTab('calendar')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'calendar'
                    ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/30'
                    : 'bg-white/[0.05] text-slate-400 hover:text-white'
                }`}
              >
                Müsaitlik Ajandası
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('crm')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'crm'
                    ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/30'
                    : 'bg-white/[0.05] text-slate-400 hover:text-white'
                }`}
              >
                Haftalık Planlayıcı
              </button>
            </div>
          </div>

          {activeTab === 'calendar' ? (
            <div className="p-6 rounded-2xl bg-black/40 border border-white/[0.06] space-y-4">
              <div className="flex items-center justify-between text-xs pb-3 border-b border-white/[0.06]">
                <span className="text-white font-bold">Haftalık Müsaitlik Aralıkları</span>
                <span className="text-emerald-400 font-mono">✓ Google Takvim Bağlı</span>
              </div>
              <div className="space-y-2 text-xs">
                <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.05] flex justify-between items-center">
                  <span className="font-bold text-slate-200">Çarşamba</span>
                  <span className="px-3 py-1 rounded-lg bg-blue-500/15 text-blue-300 font-mono">09:00 - 21:00</span>
                </div>
                <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.05] flex justify-between items-center">
                  <span className="font-bold text-slate-200">Perşembe</span>
                  <span className="px-3 py-1 rounded-lg bg-blue-500/15 text-blue-300 font-mono">09:00 - 21:00</span>
                </div>
                <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.05] flex justify-between items-center">
                  <span className="font-bold text-slate-200">Cumartesi</span>
                  <span className="px-3 py-1 rounded-lg bg-blue-500/15 text-blue-300 font-mono">10:00 - 20:00</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-6 rounded-2xl bg-black/40 border border-white/[0.06] space-y-4">
              <div className="flex items-center justify-between text-xs pb-3 border-b border-white/[0.06]">
                <span className="text-white font-bold">Öğrenci Haftalık Programı (Gizem B. - 13. Sınıf)</span>
                <span className="px-2.5 py-1 rounded bg-amber-400/20 text-amber-300 font-mono">Geçen Haftayı Kopyala ⚡</span>
              </div>
              <div className="space-y-2 text-xs">
                <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.05] flex justify-between items-center">
                  <div>
                    <span className="font-bold text-white">TYT Matematik · Problemler</span>
                    <p className="text-[11px] text-slate-400 mt-0.5">3D Yayınları Test 4-8 arası · 120 Soru</p>
                  </div>
                  <span className="text-emerald-400 font-mono font-bold">Tamamlandı ✓</span>
                </div>
                <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.05] flex justify-between items-center">
                  <div>
                    <span className="font-bold text-white">AYT Fizik · Vektörler & Bağıl Hareket</span>
                    <p className="text-[11px] text-slate-400 mt-0.5">DersoLab 1:1 Canlı Seans</p>
                  </div>
                  <span className="text-amber-400 font-mono font-bold">Planlandı ⏱</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
