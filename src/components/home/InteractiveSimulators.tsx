'use client'

import { useState } from 'react'
import { TrendingUp, ShieldCheck, Calculator, Sparkles, Check, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import type { PersonaType } from './PersonaSwitcher'

export function InteractiveSimulators({ persona }: { persona: PersonaType }) {
  // Student simulator state: target net
  const [tytNet, setTytNet] = useState(85)
  // Instructor simulator state: hours per week
  const [weeklyHours, setWeeklyHours] = useState(12)

  if (persona === 'student') {
    const estimatedPercentile = Math.max(1, Math.round(100 - (tytNet - 40) * 1.5))
    const sampleDept =
      tytNet >= 100
        ? 'Boğaziçi / İTÜ Bilgisayar Mühendisliği'
        : tytNet >= 90
        ? 'ODTÜ / İTÜ Mühendislik & Tıp Fakülteleri'
        : tytNet >= 75
        ? 'Yıldız Teknik / Hacettepe Mühendislik'
        : 'Devlet & Vakıf Üniversiteleri Lisans Programları'

    return (
      <div className="rounded-3xl bg-slate-950 text-white p-6 sm:p-10 lg:p-12 shadow-2xl shadow-slate-950/20 border border-slate-800 relative overflow-hidden">
        <div className="pointer-events-none absolute -top-24 -right-24 w-96 h-96 bg-emerald-500/15 rounded-full blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -left-24 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl" />

        <div className="relative z-10 grid lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-6 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Canlı YÖK Atlas & Net Simülatörü</span>
            </div>
            <h3 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
              Hedefindeki Neti Belirle, Yolu Birlikte Çizelim
            </h3>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              DersoLab'da her dersin net hedefi bellidir. Deneme netlerini kaydettiğinde yapay zekâ analizimiz eksik
              olduğun konuları tespit eder ve koçunla birlikte haftalık gelişim planını günceller.
            </p>
            <div className="pt-2">
              <Link
                href="/demo-ders"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-500 text-slate-950 font-bold text-sm hover:bg-emerald-400 transition-all"
              >
                <span>Ücretsiz 20 Dk Tanışma ile Başla</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Interactive Calculator Box */}
          <div className="lg:col-span-6">
            <div className="rounded-2xl bg-slate-900/90 backdrop-blur-xl border border-slate-800 p-6 shadow-2xl space-y-6">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-semibold text-slate-300">Hedeflenen TYT Neti:</span>
                  <span className="text-xl font-mono font-extrabold text-emerald-400">{tytNet} Net</span>
                </div>
                <input
                  type="range"
                  min={50}
                  max={115}
                  step={1}
                  value={tytNet}
                  onChange={(e) => setTytNet(Number(e.target.value))}
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                />
                <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-1">
                  <span>50 Net</span>
                  <span>85 Net</span>
                  <span>115 Net</span>
                </div>
              </div>

              <div className="space-y-3 text-xs">
                <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800/80 flex items-center justify-between">
                  <div>
                    <span className="text-slate-400 block text-[11px]">Tahmini Başarı Dilimi</span>
                    <span className="font-bold text-sm text-white">İlk %{estimatedPercentile} İçinde</span>
                  </div>
                  <span className="text-xs font-semibold text-emerald-400 bg-emerald-950/60 px-2.5 py-1 rounded-md border border-emerald-800/40">
                    Hedef Gerçekçi ✓
                  </span>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800/80">
                  <span className="text-slate-400 block text-[11px] mb-1">Eşleşen YÖK Atlas Örnek Bölümler</span>
                  <span className="font-bold text-xs sm:text-sm text-slate-100">{sampleDept}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (persona === 'parent') {
    return (
      <div className="rounded-3xl bg-slate-950 text-white p-6 sm:p-10 lg:p-12 shadow-2xl shadow-slate-950/20 border border-slate-800 relative overflow-hidden">
        <div className="pointer-events-none absolute -top-24 -right-24 w-96 h-96 bg-sky-500/15 rounded-full blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -left-24 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl" />

        <div className="relative z-10 grid lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-6 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-400 text-xs font-semibold">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Garantili Veli Deneyimi</span>
            </div>
            <h3 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
              Eğitimde Sıfır Risk, Tam Bütçe Kontrolü
            </h3>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Geleneksel özel derslerdeki belirsizliklerin tümünü ortadan kaldırdık. Ders kredilerinizin süresi dolmaz,
              kullanmadığınız seanslar yanmaz. Her ders sonrası öğretmen değerlendirme notu anında ekranınızda.
            </p>
            <div className="pt-2">
              <Link
                href="/register?role=parent"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-sky-400 text-slate-950 font-bold text-sm hover:bg-sky-300 transition-all"
              >
                <span>Veli Hesabınızı Açın</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="rounded-2xl bg-slate-900/90 backdrop-blur-xl border border-slate-800 p-6 shadow-2xl space-y-3 text-xs">
              <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800/80 flex items-center justify-between">
                <div>
                  <span className="text-slate-400 block text-[11px]">Kredi Geçerlilik Süresi</span>
                  <span className="font-bold text-sm text-white">Süresiz & Asla Yanmaz</span>
                </div>
                <span className="text-xs font-semibold text-sky-400 bg-sky-950/60 px-2.5 py-1 rounded-md border border-sky-800/40">
                  Garantili
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800/80 flex items-center justify-between">
                <div>
                  <span className="text-slate-400 block text-[11px]">Eğitmen Değerlendirme Notları</span>
                  <span className="font-bold text-sm text-white">Her Ders Sonu Yazılı Rapor</span>
                </div>
                <span className="text-xs font-semibold text-emerald-400 bg-emerald-950/60 px-2.5 py-1 rounded-md border border-emerald-800/40">
                  Şeffaf
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800/80 flex items-center justify-between">
                <div>
                  <span className="text-slate-400 block text-[11px]">Ödeme Güvencesi</span>
                  <span className="font-bold text-sm text-white">256-Bit SSL & Shopier Altyapısı</span>
                </div>
                <span className="text-xs font-semibold text-emerald-400 bg-emerald-950/60 px-2.5 py-1 rounded-md border border-emerald-800/40">
                  %100 Güvenli
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Instructor
  const estimatedEarnings = weeklyHours * 4 * 750 // Example realistic hourly calculation

  return (
    <div className="rounded-3xl bg-slate-950 text-white p-6 sm:p-10 lg:p-12 shadow-2xl shadow-slate-950/20 border border-slate-800 relative overflow-hidden">
      <div className="pointer-events-none absolute -top-24 -right-24 w-96 h-96 bg-amber-500/15 rounded-full blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -left-24 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl" />

      <div className="relative z-10 grid lg:grid-cols-12 gap-8 items-center">
        <div className="lg:col-span-6 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold">
            <Calculator className="w-3.5 h-3.5" />
            <span>Eğitmen Kazanç Simülatörü</span>
          </div>
          <h3 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
            Kendi Saatlerini Seç, Aylık Gelirini Hesapla
          </h3>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Haftalık kaç saat ders vermek istediğinizi belirleyin. DersoLab altyapısı Google Meet linklerinizi ve
            ajandanızı yönetsin; ödemeleriniz her ay doğrudan banka hesabınıza aktarılsın.
          </p>
          <div className="pt-2">
            <Link
              href="/register?role=instructor"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-amber-400 text-slate-950 font-bold text-sm hover:bg-amber-300 transition-all"
            >
              <span>Eğitmen Başvurusu Yapın</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        <div className="lg:col-span-6">
          <div className="rounded-2xl bg-slate-900/90 backdrop-blur-xl border border-slate-800 p-6 shadow-2xl space-y-6">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-semibold text-slate-300">Haftalık Ders Saati:</span>
                <span className="text-xl font-mono font-extrabold text-amber-400">{weeklyHours} Saat / Hafta</span>
              </div>
              <input
                type="range"
                min={4}
                max={30}
                step={2}
                value={weeklyHours}
                onChange={(e) => setWeeklyHours(Number(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-1">
                <span>4 Saat</span>
                <span>16 Saat</span>
                <span>30 Saat</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/90 border border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-slate-400 block text-xs">Tahmini Aylık Kazanç</span>
                <span className="text-xl sm:text-2xl font-mono font-extrabold text-white">
                  ~{estimatedEarnings.toLocaleString('tr-TR')} ₺
                </span>
              </div>
              <span className="text-xs font-semibold text-amber-400 bg-amber-950/60 px-3 py-1.5 rounded-lg border border-amber-800/40">
                Aylık Düzenli IBAN
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
