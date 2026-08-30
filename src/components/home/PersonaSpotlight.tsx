'use client'

import Link from 'next/link'
import { CheckCircle2, TrendingUp, Calendar, ShieldCheck, Sparkles, BookOpen, Clock, Award } from 'lucide-react'
import type { PersonaType } from './PersonaSwitcher'

interface PersonaSpotlightProps {
  persona: PersonaType
}

export function PersonaSpotlight({ persona }: PersonaSpotlightProps) {
  if (persona === 'student') {
    return (
      <div className="bg-[#F4F1E8] rounded-2xl p-6 sm:p-9 border-4 border-[#1B2430] shadow-[0_8px_0_#1B2430]">
        <div className="grid gap-6 md:grid-cols-2 items-center">
          <div>
            <span className="inline-block px-3 py-1 rounded-lg border-2 border-[#1B2430] bg-[#D5EAE3] text-[#1B2430] text-xs font-black mb-3">
              📊 ÖĞRENCİ GELİŞİM ARAÇLARI
            </span>
            <h3 className="font-sans text-xl sm:text-2xl font-black text-[#1B2430] mb-3">
              Yalnızca Ders Değil, Hedefe Giden Tüm Yol Haritası
            </h3>
            <p className="font-semibold text-sm sm:text-base text-[#1B2430]/80 mb-5 leading-relaxed">
              DersoLab'da aldığın her dersin notu paneline kaydedilir. Deneme sınavı netlerini sisteme girip YÖK Atlas
              verileriyle hedef sıralamanı kıyaslayabilir, haftalık koçluk formuyla eksiklerini kapatabilirsin.
            </p>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-bold text-[#1B2430]">
                <CheckCircle2 className="w-4 h-4 text-[#6FA89E]" />
                <span>YKS & LGS Deneme Sınavı Net Grafikleri</span>
              </div>
              <div className="flex items-center gap-2 text-sm font-bold text-[#1B2430]">
                <CheckCircle2 className="w-4 h-4 text-[#6FA89E]" />
                <span>YÖK Atlas 2026 Taban Sıralaması Kıyaslama</span>
              </div>
              <div className="flex items-center gap-2 text-sm font-bold text-[#1B2430]">
                <CheckCircle2 className="w-4 h-4 text-[#6FA89E]" />
                <span>Haftalık Çalışma Raporu ve Ödev Takibi</span>
              </div>
            </div>
          </div>

          {/* Interactive Mock Card */}
          <div className="rounded-xl border-4 border-[#1B2430] bg-white p-4 sm:p-5 shadow-[0_5px_0_#1B2430]">
            <div className="flex items-center justify-between pb-3 border-b-2 border-[#1B2430]/15 mb-3">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-[#DD7B3A]" />
                <span className="font-black text-sm text-[#1B2430]">Hedef Takip & Net Durumu</span>
              </div>
              <span className="text-xs font-bold px-2 py-0.5 bg-[#D5EAE3] text-[#1B2430] rounded border border-[#1B2430]">
                Canlı Demo
              </span>
            </div>
            <div className="space-y-2.5 text-xs sm:text-sm">
              <div className="flex justify-between items-center p-2.5 bg-[#F4F1E8] rounded-lg border-2 border-[#1B2430]">
                <span className="font-bold text-[#1B2430]">Son TYT Denemesi</span>
                <span className="font-black text-[#DD7B3A]">94.75 Net (+8.5 Net ↗)</span>
              </div>
              <div className="flex justify-between items-center p-2.5 bg-[#F4F1E8] rounded-lg border-2 border-[#1B2430]">
                <span className="font-bold text-[#1B2430]">Hedef Bölüm</span>
                <span className="font-bold text-[#1B2430]">İTÜ Bilgisayar Mühendisliği</span>
              </div>
              <div className="p-2.5 bg-[#D5EAE3]/60 rounded-lg border-2 border-[#1B2430]">
                <span className="block font-bold text-[#1B2430] mb-1">Koçluk Notu (Bu Hafta):</span>
                <p className="text-xs font-semibold text-[#1B2430]/80">
                  "Matematik-2 Geometri eksikleri tamamlandı. Haftalık 150 soru hedefi aşıldı."
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (persona === 'parent') {
    return (
      <div className="bg-[#F4F1E8] rounded-2xl p-6 sm:p-9 border-4 border-[#1B2430] shadow-[0_8px_0_#1B2430]">
        <div className="grid gap-6 md:grid-cols-2 items-center">
          <div>
            <span className="inline-block px-3 py-1 rounded-lg border-2 border-[#1B2430] bg-[#D5EAE3] text-[#1B2430] text-xs font-black mb-3">
              🛡️ VELİ BİLGİLENDİRME & GÜVENLİK
            </span>
            <h3 className="font-sans text-xl sm:text-2xl font-black text-[#1B2430] mb-3">
              Eğitimde Sıfır Belirsizlik, Tam Şeffaflık
            </h3>
            <p className="font-semibold text-sm sm:text-base text-[#1B2430]/80 mb-5 leading-relaxed">
              Özel ders sürecinde velilerin en büyük endişesi derslerin kalitesi ve sürekliliğidir. DersoLab Veli
              Paneli sayesinde çocuğunuzun hangi gün ders aldığını, öğretmenin derse katılım notunu ve ödev durumunu tek
              bakışta görürsünüz.
            </p>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-bold text-[#1B2430]">
                <CheckCircle2 className="w-4 h-4 text-[#6FA89E]" />
                <span>Tek Tıkla Veli Hesabına Öğrenci Bağlama</span>
              </div>
              <div className="flex items-center gap-2 text-sm font-bold text-[#1B2430]">
                <CheckCircle2 className="w-4 h-4 text-[#6FA89E]" />
                <span>Öğretmenden Yazılı Ders Sonu Değerlendirmeleri</span>
              </div>
              <div className="flex items-center gap-2 text-sm font-bold text-[#1B2430]">
                <CheckCircle2 className="w-4 h-4 text-[#6FA89E]" />
                <span>Süresi Asla Dolmayan ve Yanmayan Ders Kredileri</span>
              </div>
            </div>
          </div>

          {/* Interactive Mock Card */}
          <div className="rounded-xl border-4 border-[#1B2430] bg-white p-4 sm:p-5 shadow-[0_5px_0_#1B2430]">
            <div className="flex items-center justify-between pb-3 border-b-2 border-[#1B2430]/15 mb-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-[#6FA89E]" />
                <span className="font-black text-sm text-[#1B2430]">Veli İzleme Özeti</span>
              </div>
              <span className="text-xs font-bold px-2 py-0.5 bg-[#D5EAE3] text-[#1B2430] rounded border border-[#1B2430]">
                Örnek Görünüm
              </span>
            </div>
            <div className="space-y-2.5 text-xs sm:text-sm">
              <div className="flex justify-between items-center p-2.5 bg-[#F4F1E8] rounded-lg border-2 border-[#1B2430]">
                <span className="font-bold text-[#1B2430]">Öğrenci / Sınıf</span>
                <span className="font-black text-[#1B2430]">Ali Yılmaz (12. Sınıf - Sayısal)</span>
              </div>
              <div className="flex justify-between items-center p-2.5 bg-[#F4F1E8] rounded-lg border-2 border-[#1B2430]">
                <span className="font-bold text-[#1B2430]">Kalan Ders Bakiyesi</span>
                <span className="font-black text-[#6FA89E]">8 Kredi (Aktif & Güvende)</span>
              </div>
              <div className="p-2.5 bg-[#D5EAE3]/60 rounded-lg border-2 border-[#1B2430]">
                <span className="block font-bold text-[#1B2430] mb-1">Fizik Öğretmeni Geri Bildirimi:</span>
                <p className="text-xs font-semibold text-[#1B2430]/80">
                  "Kuvvet ve Hareket konusundaki soru çözüm performansı mükemmeldi. Haftaya elektrik konusuna geçiyoruz."
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Instructor
  return (
    <div className="bg-[#F4F1E8] rounded-2xl p-6 sm:p-9 border-4 border-[#1B2430] shadow-[0_8px_0_#1B2430]">
      <div className="grid gap-6 md:grid-cols-2 items-center">
        <div>
          <span className="inline-block px-3 py-1 rounded-lg border-2 border-[#1B2430] bg-[#D5EAE3] text-[#1B2430] text-xs font-black mb-3">
            🗓️ AKILLI TAKVİM & ÖDEME SİSTEMİ
          </span>
          <h3 className="font-sans text-xl sm:text-2xl font-black text-[#1B2430] mb-3">
            Sadece Dersinize Odaklanın, Operasyonu Bize Bırakın
          </h3>
          <p className="font-semibold text-sm sm:text-base text-[#1B2430]/80 mb-5 leading-relaxed">
            Ders linki paylaşma, takvim çakışmaları ve ödeme peşinde koşma devri bitti. Google Takvim entegrasyonuyla
            tüm dersleriniz otomatik planlanır, Meet bağlantıları öğrencilere anında iletilir.
          </p>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-bold text-[#1B2430]">
              <CheckCircle2 className="w-4 h-4 text-[#6FA89E]" />
              <span>Google Takvim & Meet Otomatik Senkronizasyon</span>
            </div>
            <div className="flex items-center gap-2 text-sm font-bold text-[#1B2430]">
              <CheckCircle2 className="w-4 h-4 text-[#6FA89E]" />
              <span>Aylık Düzenli ve Güvenli IBAN Hakedişleri</span>
            </div>
            <div className="flex items-center gap-2 text-sm font-bold text-[#1B2430]">
              <CheckCircle2 className="w-4 h-4 text-[#6FA89E]" />
              <span>Dilediğin Zaman Profili Dondurma ve Saat Güncelleme</span>
            </div>
          </div>
        </div>

        {/* Interactive Mock Card */}
        <div className="rounded-xl border-4 border-[#1B2430] bg-white p-4 sm:p-5 shadow-[0_5px_0_#1B2430]">
          <div className="flex items-center justify-between pb-3 border-b-2 border-[#1B2430]/15 mb-3">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-[#DD7B3A]" />
              <span className="font-black text-sm text-[#1B2430]">Eğitmen Ajandası</span>
            </div>
            <span className="text-xs font-bold px-2 py-0.5 bg-[#D5EAE3] text-[#1B2430] rounded border border-[#1B2430]">
              Google Bağlı ✓
            </span>
          </div>
          <div className="space-y-2.5 text-xs sm:text-sm">
            <div className="flex justify-between items-center p-2.5 bg-[#F4F1E8] rounded-lg border-2 border-[#1B2430]">
              <span className="font-bold text-[#1B2430]">Bugünkü Ders</span>
              <span className="font-black text-[#DD7B3A]">18:00 - Matematik (YKS)</span>
            </div>
            <div className="flex justify-between items-center p-2.5 bg-[#F4F1E8] rounded-lg border-2 border-[#1B2430]">
              <span className="font-bold text-[#1B2430]">Google Meet</span>
              <span className="font-bold text-[#6FA89E] underline">meet.google.com/abc-defg-hij</span>
            </div>
            <div className="p-2.5 bg-[#D5EAE3]/60 rounded-lg border-2 border-[#1B2430]">
              <span className="block font-bold text-[#1B2430] mb-1">Bu Ayki Hakediş Durumu:</span>
              <p className="text-xs font-semibold text-[#1B2430]/80">
                14 Ders Tamamlandı · Gelecek Ayın İlk Haftası IBAN Hesabınıza Otomatik Aktarılacak
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
