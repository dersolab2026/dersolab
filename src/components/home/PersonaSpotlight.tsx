'use client'

import { TrendingUp, ShieldCheck, Calendar, CheckCircle2, ArrowUpRight, Sparkles } from 'lucide-react'
import type { PersonaType } from './PersonaSwitcher'

export function PersonaSpotlight({ persona }: { persona: PersonaType }) {
  if (persona === 'student') {
    return (
      <div className="relative overflow-hidden rounded-3xl bg-slate-900 text-white p-6 sm:p-12 shadow-2xl shadow-slate-950/20">
        {/* Glow ambient background */}
        <div className="pointer-events-none absolute -top-20 -right-20 w-80 h-80 bg-emerald-500/15 rounded-full blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 -left-20 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl" />

        <div className="relative z-10 grid gap-8 lg:grid-cols-12 items-center">
          <div className="lg:col-span-6 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Gelişmiş Öğrenci & Hedef Takip Sistemi</span>
            </div>
            <h3 className="text-2xl sm:text-4xl font-bold tracking-tight text-white leading-tight">
              Her Dersin Verisi, Net Analizleri ve YÖK Atlas Kıyaslaması
            </h3>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              DersoLab paneli üzerinden girdiğin her deneme sınavının netleri yapay zekâ ve YÖK Atlas taban sıralamalarıyla
              eşleşir. Koçunla birlikte haftalık hedeflerine ne kadar yaklaştığını net olarak görürsün.
            </p>
            <div className="space-y-2.5 pt-2">
              <div className="flex items-center gap-2.5 text-sm font-medium text-slate-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>YKS & LGS Deneme Sınavı Net Değişim Grafikleri</span>
              </div>
              <div className="flex items-center gap-2.5 text-sm font-medium text-slate-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>2026 YÖK Atlas Hedef Bölüm Sıralama Kıyaslaması</span>
              </div>
              <div className="flex items-center gap-2.5 text-sm font-medium text-slate-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Haftalık Çalışma Raporu ve Eksik Konu Analizi</span>
              </div>
            </div>
          </div>

          {/* Interactive Live Dashboard Preview Card */}
          <div className="lg:col-span-6">
            <div className="rounded-2xl bg-slate-800/90 backdrop-blur-xl border border-slate-700/80 p-5 sm:p-6 shadow-2xl">
              <div className="flex items-center justify-between pb-4 border-b border-slate-700/60 mb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                    <TrendingUp className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-white">Hedef & Net İlerlemesi</h4>
                    <p className="text-[11px] text-slate-400">İTÜ Bilgisayar Mühendisliği</p>
                  </div>
                </div>
                <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Hedefte ↗
                </span>
              </div>

              <div className="space-y-3 text-xs">
                <div className="p-3 rounded-xl bg-slate-900/70 border border-slate-700/50 flex items-center justify-between">
                  <div>
                    <span className="text-slate-400 block text-[11px]">Son TYT Denemesi</span>
                    <span className="text-white font-bold text-sm">96.25 Net</span>
                  </div>
                  <span className="text-emerald-400 font-semibold flex items-center gap-0.5">
                    +8.75 Net <ArrowUpRight className="w-3.5 h-3.5" />
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-slate-900/70 border border-slate-700/50">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-slate-300 font-medium">Haftalık Soru Hedefi</span>
                    <span className="text-emerald-400 font-bold">180 / 150 Soru (%120)</span>
                  </div>
                  <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-emerald-400 h-full w-[100%] rounded-full" />
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-800/40">
                  <span className="text-[11px] font-semibold text-emerald-400 block mb-1">Koçluk Notu (Bu Hafta):</span>
                  <p className="text-slate-300 text-[11px] leading-relaxed">
                    "Matematik-2 Geometri eksikleri tamamlandı. TYT Türkçe süresi 40 dakikaya indirildi."
                  </p>
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
      <div className="relative overflow-hidden rounded-3xl bg-slate-900 text-white p-6 sm:p-12 shadow-2xl shadow-slate-950/20">
        <div className="pointer-events-none absolute -top-20 -right-20 w-80 h-80 bg-sky-500/15 rounded-full blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 -left-20 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl" />

        <div className="relative z-10 grid gap-8 lg:grid-cols-12 items-center">
          <div className="lg:col-span-6 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-400 text-xs font-semibold">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Veli Bilgilendirme ve İzleme Portalı</span>
            </div>
            <h3 className="text-2xl sm:text-4xl font-bold tracking-tight text-white leading-tight">
              Eğitimde Sıfır Belirsizlik, %100 Güven
            </h3>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Özel ders sürecinde velilerin en büyük ihtiyacı şeffaflıktır. DersoLab Veli Paneli sayesinde çocuğunuzun
              hangi gün ders aldığını, öğretmenin derse katılım notunu ve ödev durumunu tek bakışta görürsünüz.
            </p>
            <div className="space-y-2.5 pt-2">
              <div className="flex items-center gap-2.5 text-sm font-medium text-slate-200">
                <CheckCircle2 className="w-4 h-4 text-sky-400 shrink-0" />
                <span>Tek Tıkla Veli Hesabına Öğrenci Bağlama</span>
              </div>
              <div className="flex items-center gap-2.5 text-sm font-medium text-slate-200">
                <CheckCircle2 className="w-4 h-4 text-sky-400 shrink-0" />
                <span>Öğretmenden Yazılı Ders Sonu Değerlendirmeleri</span>
              </div>
              <div className="flex items-center gap-2.5 text-sm font-medium text-slate-200">
                <CheckCircle2 className="w-4 h-4 text-sky-400 shrink-0" />
                <span>Süresi Asla Dolmayan ve Yanmayan Ders Kredileri</span>
              </div>
            </div>
          </div>

          {/* Veli Preview Card */}
          <div className="lg:col-span-6">
            <div className="rounded-2xl bg-slate-800/90 backdrop-blur-xl border border-slate-700/80 p-5 sm:p-6 shadow-2xl">
              <div className="flex items-center justify-between pb-4 border-b border-slate-700/60 mb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-sky-500/20 text-sky-400 flex items-center justify-center">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-white">Veli İzleme Özeti</h4>
                    <p className="text-[11px] text-slate-400">Ali Yılmaz · 12. Sınıf Sayısal</p>
                  </div>
                </div>
                <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-sky-500/20 text-sky-300 border border-sky-500/30">
                  Güvende ✓
                </span>
              </div>

              <div className="space-y-3 text-xs">
                <div className="p-3 rounded-xl bg-slate-900/70 border border-slate-700/50 flex items-center justify-between">
                  <div>
                    <span className="text-slate-400 block text-[11px]">Kalan Ders Bakiyesi</span>
                    <span className="text-white font-bold text-sm">8 Kredi (Aktif & Güvende)</span>
                  </div>
                  <span className="text-sky-400 font-semibold">Süresiz Geçerli</span>
                </div>

                <div className="p-3 rounded-xl bg-sky-950/40 border border-sky-800/40">
                  <span className="text-[11px] font-semibold text-sky-400 block mb-1">
                    Fizik Öğretmeni Geri Bildirimi:
                  </span>
                  <p className="text-slate-300 text-[11px] leading-relaxed">
                    "Kuvvet ve Hareket konusundaki soru çözüm performansı mükemmeldi. Haftaya elektrik konusuna geçiyoruz."
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Instructor
  return (
    <div className="relative overflow-hidden rounded-3xl bg-slate-900 text-white p-6 sm:p-12 shadow-2xl shadow-slate-950/20">
      <div className="pointer-events-none absolute -top-20 -right-20 w-80 h-80 bg-amber-500/15 rounded-full blur-3xl" />
      <div className="pointer-events-none absolute -bottom-20 -left-20 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl" />

      <div className="relative z-10 grid gap-8 lg:grid-cols-12 items-center">
        <div className="lg:col-span-6 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold">
            <Calendar className="w-3.5 h-3.5" />
            <span>Akıllı Takvim ve Meet Entegrasyonu</span>
          </div>
          <h3 className="text-2xl sm:text-4xl font-bold tracking-tight text-white leading-tight">
            Tüm Operasyon Otomatik, Kazancınız Güvencede
          </h3>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Ders linki paylaşma, takvim çakışmaları ve ödeme peşinde koşma devri bitti. Google Takvim entegrasyonuyla
            tüm dersleriniz otomatik planlanır, Meet bağlantıları öğrencilere anında iletilir.
          </p>
          <div className="space-y-2.5 pt-2">
            <div className="flex items-center gap-2.5 text-sm font-medium text-slate-200">
              <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Google Takvim & Meet Otomatik Senkronizasyon</span>
            </div>
            <div className="flex items-center gap-2.5 text-sm font-medium text-slate-200">
              <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Aylık Düzenli ve Güvenli IBAN Hakedişleri</span>
            </div>
            <div className="flex items-center gap-2.5 text-sm font-medium text-slate-200">
              <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Dilediğin Zaman Profili Dondurma ve Saat Güncelleme</span>
            </div>
          </div>
        </div>

        {/* Instructor Preview Card */}
        <div className="lg:col-span-6">
          <div className="rounded-2xl bg-slate-800/90 backdrop-blur-xl border border-slate-700/80 p-5 sm:p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-slate-700/60 mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center">
                  <Calendar className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-white">Eğitmen Ajandası</h4>
                  <p className="text-[11px] text-slate-400">Google Takvim Entegre</p>
                </div>
              </div>
              <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Google Bağlı ✓
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-900/70 border border-slate-700/50 flex items-center justify-between">
                <div>
                  <span className="text-slate-400 block text-[11px]">Bugünkü Ders</span>
                  <span className="text-white font-bold text-sm">18:00 - Matematik (YKS)</span>
                </div>
                <span className="text-emerald-400 font-semibold underline">meet.google.com/abc-xyz</span>
              </div>

              <div className="p-3 rounded-xl bg-amber-950/40 border border-amber-800/40">
                <span className="text-[11px] font-semibold text-amber-400 block mb-1">Bu Ayki Hakediş Durumu:</span>
                <p className="text-slate-300 text-[11px] leading-relaxed">
                  14 Ders Tamamlandı · Gelecek Ayın İlk Haftası IBAN Hesabınıza Otomatik Aktarılacak
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
