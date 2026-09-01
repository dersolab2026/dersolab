'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Sparkles, CheckCircle2, ChevronRight, Lock, Camera, Zap, BookOpen, Gift } from 'lucide-react'

interface SampleSolution {
  id: string
  examBadge: string
  subject: string
  topic: string
  question: string
  steps: {
    title: string
    formula?: string
    explanation: string
  }[]
  result: string
  keyInsight: string
}

const SAMPLE_SOLUTIONS: SampleSolution[] = [
  {
    id: 'tyt-mat',
    examBadge: 'YKS · TYT',
    subject: 'TYT Matematik',
    topic: 'Logaritma ve Üslü İfadeler',
    question: 'log₂(x + 3) + log₂(x - 1) = 5 denklemini sağlayan pozitif x değeri kaçtır?',
    steps: [
      {
        title: '1. Toplam Kuralını Uygula',
        formula: 'log_a(m) + log_a(n) = log_a(m · n)',
        explanation: 'Aynı tabandaki logaritmaların toplamı içlerin çarpımıdır: log₂[(x + 3)(x - 1)] = 5',
      },
      {
        title: '2. Üslü Formata Çevir',
        formula: '(x + 3)(x - 1) = 2⁵ = 32',
        explanation: 'Parantezleri aç: x² + 2x - 3 = 32 ⟹ x² + 2x - 35 = 0',
      },
      {
        title: '3. Çarpanlarına Ayır',
        formula: '(x + 7)(x - 5) = 0',
        explanation: 'Kökler x = -7 ve x = 5. Logaritma içi pozitif olmalı (x > 1), bu yüzden x = 5 alınır.',
      },
    ],
    result: 'x = 5',
    keyInsight: 'Logaritmada kök bulduktan sonra tanım aralığını (içinin > 0 olma kuralını) mutlaka kontrol et!',
  },
  {
    id: 'ayt-fizik',
    examBadge: 'YKS · AYT',
    subject: 'AYT Fizik',
    topic: 'Dinamik & Newton Hareket Yasaları',
    question: 'Sürtünmesiz yatay düzlemde 4 kg kütleli cisme yatayla 37° açı yapan 50 N kuvvet uygulanıyor. Cismin ivmesi kaç m/s² olur? (cos37°=0.8, sin37°=0.6)',
    steps: [
      {
        title: '1. Yatay Kuvvet Bileşenini Bul',
        formula: 'F_yatay = F · cos(37°) = 50 · 0.8 = 40 N',
        explanation: 'Yatayda hareketi sağlayan tek net kuvvet 40 N’dur.',
      },
      {
        title: '2. Newton’un 2. Yasasını Uygula',
        formula: 'F_net = m · a ⟹ 40 = 4 · a',
        explanation: 'Cismin ivmesi a = 10 m/s² olarak hesaplanır.',
      },
    ],
    result: 'a = 10 m/s²',
    keyInsight: 'Sürtünmesiz yatay düzlemde ivmeyi sadece yatay net kuvvet belirler.',
  },
  {
    id: 'lgs-fen',
    examBadge: 'LGS 8. Sınıf',
    subject: 'LGS Fen Bilimleri',
    topic: 'DNA ve Genetik Kod',
    question: '1200 nükleotitten oluşan bir DNA molekülünde 200 Adenin bulunmaktadır. Bu DNA’daki Guanin sayısı kaçtır?',
    steps: [
      {
        title: '1. Adenin ve Timin Eşleşmesi',
        formula: 'Adenin (A) = Timin (T) = 200',
        explanation: 'A + T = 200 + 200 = 400 nükleotit.',
      },
      {
        title: '2. Guanin ve Sitozin Sayısını Hesapla',
        formula: 'G + S = 1200 - 400 = 800',
        explanation: 'Guanin = Sitozin olduğu için 2G = 800 ⟹ G = 400 bulunur.',
      },
    ],
    result: 'Guanin Sayısı = 400',
    keyInsight: 'Çift zincirli DNA’da her zaman Toplam Nükleotit = 2(A + G) eşitliği geçerlidir.',
  },
]

export function AIEducationShowcase() {
  const [activeId, setActiveId] = useState('tyt-mat')
  const active = SAMPLE_SOLUTIONS.find((s) => s.id === activeId) ?? SAMPLE_SOLUTIONS[0]

  return (
    <div className="bg-[#F4F1E8] rounded-2xl p-6 sm:p-9 border-4 border-[#1B2430] shadow-[0_8px_0_#1B2430] space-y-6">
      
      {/* Header Banner */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl border-2 border-[#1B2430] bg-[#D5EAE3] text-[#1B2430] text-xs font-black">
          <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          <span>Google AI × DersoLab | Yapay Zeka Çağında Yeni Nesil Eğitim</span>
        </div>

        <h2 className="font-sans text-2xl sm:text-3xl font-black text-[#1B2430]">
          Yapay Zeka Çağını Yakalayın: 7/24 Sınırsız AI Soru Çözüm Asistanı
        </h2>

        <p className="text-base font-semibold text-[#1B2430]/75 max-w-2xl mx-auto">
          DersoLab’a kayıtlı tüm öğrencilerimiz için 7/24 sınırsız, adım adım ve mantığını kavratan Google Gemini AI soru çözüm desteği!
        </p>
      </div>

      {/* 4 Feature Highlights */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
        <div className="rounded-xl border-2 border-[#1B2430] bg-white p-3.5 text-center">
          <div className="w-8 h-8 rounded-lg bg-[#D5EAE3] border-2 border-[#1B2430] flex items-center justify-center mx-auto mb-1.5 text-[#1B2430]">
            <Zap className="w-4 h-4" />
          </div>
          <p className="font-bold text-xs text-[#1B2430]">Google Gemini 3.6</p>
          <p className="text-[11px] text-[#1B2430]/70 font-semibold mt-0.5">Saniyeler içinde çözüm</p>
        </div>

        <div className="rounded-xl border-2 border-[#1B2430] bg-white p-3.5 text-center">
          <div className="w-8 h-8 rounded-lg bg-[#D5EAE3] border-2 border-[#1B2430] flex items-center justify-center mx-auto mb-1.5 text-[#1B2430]">
            <BookOpen className="w-4 h-4" />
          </div>
          <p className="font-bold text-xs text-[#1B2430]">Mantığını Öğretir</p>
          <p className="text-[11px] text-[#1B2430]/70 font-semibold mt-0.5">Adım adım detaylı anlatım</p>
        </div>

        <div className="rounded-xl border-2 border-[#1B2430] bg-white p-3.5 text-center">
          <div className="w-8 h-8 rounded-lg bg-[#D5EAE3] border-2 border-[#1B2430] flex items-center justify-center mx-auto mb-1.5 text-[#1B2430]">
            <Camera className="w-4 h-4" />
          </div>
          <p className="font-bold text-xs text-[#1B2430]">Fotoğraf & Metin</p>
          <p className="text-[11px] text-[#1B2430]/70 font-semibold mt-0.5">Kitaptan çek, sor</p>
        </div>

        <div className="rounded-xl border-2 border-[#1B2430] bg-white p-3.5 text-center">
          <div className="w-8 h-8 rounded-lg bg-[#D5EAE3] border-2 border-[#1B2430] flex items-center justify-center mx-auto mb-1.5 text-[#1B2430]">
            <Gift className="w-4 h-4" />
          </div>
          <p className="font-bold text-xs text-[#1B2430]">Sınırsız Soru Desteği</p>
          <p className="text-[11px] text-[#1B2430]/70 font-semibold mt-0.5">Kayıtlı öğrencilere özel</p>
        </div>
      </div>

      {/* Interactive Live Preview Box */}
      <div className="rounded-xl border-4 border-[#1B2430] bg-white p-4 sm:p-6 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b-2 border-[#1B2430]/10 pb-3">
          <span className="text-xs font-black uppercase text-[#1B2430] flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-[#DD7B3A]" />
            Örnek Çözüm Simülasyonu (Ders Seçin):
          </span>
          <div className="flex flex-wrap gap-2">
            {SAMPLE_SOLUTIONS.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => setActiveId(s.id)}
                className={`px-3 py-1 rounded-lg text-xs font-bold border-2 border-[#1B2430] transition-all cursor-pointer ${
                  activeId === s.id
                    ? 'bg-[#DD7B3A] text-[#F4F1E8] shadow-[0_2px_0_#1B2430] translate-y-[-1px]'
                    : 'bg-[#F4F1E8] text-[#1B2430] hover:bg-[#D5EAE3]'
                }`}
              >
                {s.subject}
              </button>
            ))}
          </div>
        </div>

        {/* Question & Solution Container */}
        <div className="grid md:grid-cols-12 gap-4 pt-1">
          {/* Question */}
          <div className="md:col-span-5 rounded-lg border-2 border-[#1B2430] bg-[#F4F1E8] p-4 space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-[#1B2430]">
              <span>{active.topic}</span>
              <span className="px-2 py-0.5 rounded bg-white border border-[#1B2430] text-[10px]">
                {active.examBadge}
              </span>
            </div>
            <p className="text-sm font-semibold text-[#1B2430] bg-white p-3 rounded-lg border border-[#1B2430]/20">
              &ldquo;{active.question}&rdquo;
            </p>
            <div className="flex items-center gap-1 text-[11px] text-[#1B2430]/60 font-semibold pt-1">
              <Lock className="w-3 h-3 text-[#DD7B3A]" />
              <span>Giriş yapan öğrenciler panelden 7/24 sınırsız soru sorabilir.</span>
            </div>
          </div>

          {/* AI Solution */}
          <div className="md:col-span-7 rounded-lg border-2 border-[#1B2430] bg-[#1B2430] text-[#F4F1E8] p-4 space-y-3">
            <div className="flex items-center justify-between text-xs font-bold border-b border-white/10 pb-2">
              <span className="flex items-center gap-1.5 text-emerald-400">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Google Gemini AI Adım Adım Çözüm
              </span>
              <span className="text-[10px] text-[#D5EAE3] font-mono">DersoLab Çözüm Formatı</span>
            </div>

            <div className="space-y-2 text-xs">
              {active.steps.map((st, i) => (
                <div key={i} className="space-y-0.5">
                  <p className="font-bold text-amber-300">{st.title}</p>
                  {st.formula && (
                    <div className="px-2.5 py-1 rounded bg-black/40 text-emerald-300 font-mono text-[11px]">
                      → {st.formula}
                    </div>
                  )}
                  <p className="text-slate-300 text-[11px] pl-1">{st.explanation}</p>
                </div>
              ))}
            </div>

            <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs font-bold">
              <span className="text-emerald-400">✅ Sonuç:</span>
              <span className="px-2.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono">
                {active.result}
              </span>
            </div>

            <div className="p-2 rounded bg-white/5 border border-white/10 text-[11px] text-amber-200">
              💡 <strong>Anahtar Fikir:</strong> {active.keyInsight}
            </div>
          </div>
        </div>
      </div>

      {/* Call to action */}
      <div className="text-center pt-2">
        <Link
          href="/register"
          className="inline-flex items-center gap-2 py-3.5 px-8 text-base sm:text-lg bg-[#DD7B3A] text-[#F4F1E8] font-black rounded-xl border-4 border-[#1B2430] shadow-[0_4px_0_#1B2430] active:translate-y-1 active:shadow-none transition-all hover:bg-[#c96a2d]"
        >
          <span>Ücretsiz Kaydolun & AI Asistanı Kullanın</span>
          <ChevronRight className="w-5 h-5" />
        </Link>
      </div>

    </div>
  )
}
