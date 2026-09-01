'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  Sparkles,
  Zap,
  Camera,
  BrainCircuit,
  Gift,
  CheckCircle2,
  ChevronRight,
  ArrowRight,
  ShieldCheck,
  GraduationCap,
  Lock,
} from 'lucide-react'

interface ShowcaseDemo {
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

const SHOWCASE_DEMOS: ShowcaseDemo[] = [
  {
    id: 'tyt-mat',
    examBadge: 'YKS · TYT',
    subject: 'TYT Matematik',
    topic: 'Logaritma ve Üslü İfadeler',
    question: 'log₂(x + 3) + log₂(x - 1) = 5 denklemini sağlayan pozitif x değeri kaçtır?',
    steps: [
      {
        title: 'Logaritma Toplam Kuralını Uygula',
        formula: 'log_a(m) + log_a(n) = log_a(m · n)',
        explanation: 'Aynı tabandaki logaritmaların toplamı, içlerinin çarpımına eşittir: log₂[(x + 3)(x - 1)] = 5',
      },
      {
        title: 'Üslü Formata Dönüştür',
        formula: 'log_a(B) = C ⟹ B = a^C',
        explanation: '(x + 3)(x - 1) = 2⁵ ⟹ (x + 3)(x - 1) = 32',
      },
      {
        title: 'İkinci Dereceden Denklemi Çöz',
        formula: 'x² + 2x - 3 = 32 ⟹ x² + 2x - 35 = 0 ⟹ (x + 7)(x - 5) = 0',
        explanation: 'Kökler x = -7 ve x = 5 gelir. Logaritma içi pozitif olmalı (x > 1), bu yüzden x = 5 alınır.',
      },
    ],
    result: 'x = 5',
    keyInsight: 'Logaritma sorularında denklemi çözdükten sonra köklerin tanım kümesini (içinin > 0 olma kuralını) mutlaka kontrol et!',
  },
  {
    id: 'ayt-fizik',
    examBadge: 'YKS · AYT',
    subject: 'AYT Fizik',
    topic: 'Dinamik & Newton Hareket Yasaları',
    question: 'Sürtünmesiz yatay düzlemde 4 kg kütleli cisme yatayla 37° açı yapan 50 N kuvvet uygulanıyor. Cismin ivmesi kaç m/s² olur? (cos37°=0.8, sin37°=0.6)',
    steps: [
      {
        title: 'Kuvveti Yatay ve Düşey Bileşenlerine Ayır',
        formula: 'F_yatay = F · cos(37°) = 50 · 0.8 = 40 N',
        explanation: 'Cismin yatayda hareket etmesini sağlayan tek net kuvvet yatay bileşendir (F_yatay = 40 N).',
      },
      {
        title: 'Newton’un 2. Hareket Yasasını Uygula',
        formula: 'F_net = m · a',
        explanation: '40 = 4 · a ⟹ a = 10 m/s²',
      },
    ],
    result: 'a = 10 m/s²',
    keyInsight: 'Sürtünmesiz yatay düzlemde cismin ivmesini sadece yatay eksendeki net kuvvet belirler; düşey kuvvet normal kuvveti etkiler.',
  },
  {
    id: 'lgs-fen',
    examBadge: 'LGS 8. Sınıf',
    subject: 'LGS Fen Bilimleri',
    topic: 'DNA ve Genetik Kod',
    question: '1200 nükleotitten oluşan bir DNA molekülünde 200 Adenin bulunmaktadır. Bu DNA’daki Guanin nükleotit sayısı kaçtır?',
    steps: [
      {
        title: 'Eşleşme Kuralı & Adenin/Timin Eşitliği',
        formula: 'Adenin (A) = Timin (T) = 200',
        explanation: 'A + T = 200 + 200 = 400 nükleotit Adenin ve Timin çiftinden oluşur.',
      },
      {
        title: 'Guanin ve Sitozin Toplamını Bul',
        formula: 'G + S = Toplam - (A + T) = 1200 - 400 = 800',
        explanation: 'Guanin (G) = Sitozin (S) olduğundan: 2G = 800 ⟹ G = 400 nükleotit bulunur.',
      },
    ],
    result: 'Guanin Sayısı = 400',
    keyInsight: 'Çift zincirli DNA’da her zaman Toplam Nükleotit = 2(A + G) formülünü hızlı kontrol için kullanabilirsin.',
  },
  {
    id: 'lgs-mat',
    examBadge: 'LGS 8. Sınıf',
    subject: 'LGS Matematik',
    topic: 'Çarpanlar ve Katlar (EBOB - EKOK)',
    question: 'Kenar uzunlukları 48 metre ve 60 metre olan dikdörtgen şeklindeki bir bahçenin etrafına eşit aralıklarla ağaç dikilecektir. Köşelere de gelmek şartıyla en az kaç ağaç gerekir?',
    steps: [
      {
        title: 'En Büyük Ortak Bölen (EBOB) Hesapla',
        formula: 'EBOB(48, 60) = 12 metre',
        explanation: 'En az ağaç sayısı için ardışık iki ağaç arası mesafe maksimum olmalı, yani 48 ve 60’ın EBOB’u olan 12m seçilir.',
      },
      {
        title: 'Çevre Uzunluğunu Aralık Mesafesine Böl',
        formula: 'Ağaç Sayısı = Çevre / EBOB = 2 · (48 + 60) / 12 = 216 / 12 = 18',
        explanation: 'Bahçenin toplam çevresi 216 metre olduğundan 12’şer metre aralıkla tam 18 ağaç dikilir.',
      },
    ],
    result: 'En az 18 ağaç gerekir',
    keyInsight: 'Ağaç dikme ve parselleme gibi bölme sorularında EBOB; tren kalkış veya nöbet gibi birleşme sorularında EKOK kullanılır.',
  },
]

export function AIShowcaseSection() {
  const [selectedDemoId, setSelectedDemoId] = useState<string>('tyt-mat')
  const activeDemo = SHOWCASE_DEMOS.find((d) => d.id === selectedDemoId) ?? SHOWCASE_DEMOS[0]

  return (
    <section className="max-w-6xl mx-auto px-4 py-8">
      {/* ── MASTER CONTAINER WITH GLASSMORPHIC GLOW ── */}
      <div className="relative rounded-3xl bg-gradient-to-b from-[#0e131f] via-[#0b0e17] to-[#07090e] border border-white/[0.1] shadow-[0_20px_60px_rgba(0,0,0,0.8)] overflow-hidden p-6 sm:p-10">
        
        {/* Ambient Google Accent Mesh */}
        <div className="pointer-events-none absolute -top-24 left-1/4 w-96 h-96 bg-blue-600/15 rounded-full blur-[100px]" />
        <div className="pointer-events-none absolute top-1/2 -right-24 w-96 h-96 bg-amber-500/10 rounded-full blur-[100px]" />
        <div className="pointer-events-none absolute -bottom-24 left-1/3 w-96 h-96 bg-emerald-500/10 rounded-full blur-[100px]" />

        {/* ── 1. HEADER & PARTNERSHIP BADGE ── */}
        <div className="relative text-center max-w-3xl mx-auto space-y-4 mb-10">
          {/* Partnership Ribbon */}
          <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/[0.05] border border-white/10 backdrop-blur-xl shadow-lg">
            {/* Google G Multi-Color Icon */}
            <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            <span className="text-xs font-bold tracking-wide text-white">Google AI</span>
            <span className="text-slate-600 text-xs font-mono">×</span>
            <span className="text-xs font-black tracking-wide bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">
              DERSOLAB
            </span>
            <span className="hidden sm:inline text-slate-500 font-mono text-xs">|</span>
            <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-bold text-amber-300">
              <Sparkles className="w-3 h-3 text-amber-400" />
              Eğitimde Yapay Zeka Seferberliği
            </span>
          </div>

          {/* Title */}
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-[1.15]">
            Google ile Eğitim Seferberliği:{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-teal-300 to-amber-300">
              7/24 AI Soru Asistanı
            </span>
          </h2>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            Eğitimde fırsat eşitliği için Türkiye’de bir ilk: DersoLab’a kayıtlı tüm öğrencilerimize her gün{' '}
            <strong className="text-amber-400 font-bold">ücretsiz 15 soru</strong> Google Gemini AI destekli adım adım pedagojik çözüm ve sınav rehberliği hediye!
          </p>
        </div>

        {/* ── 2. INTERACTIVE LIVE SOLUTION EXPLORER ── */}
        <div className="relative rounded-2xl bg-black/40 border border-white/[0.08] p-4 sm:p-6 mb-10 backdrop-blur-md">
          {/* Explorer Header & Subject Pills */}
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 pb-4 border-b border-white/[0.08]">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
              <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider">
                CANLI ASİSTAN ÖNİZLEMESİ — BRANŞ SEÇİN:
              </span>
            </div>

            {/* Subject Selector Tabs */}
            <div className="flex flex-wrap gap-2 w-full lg:w-auto">
              {SHOWCASE_DEMOS.map((demo) => (
                <button
                  key={demo.id}
                  type="button"
                  onClick={() => setSelectedDemoId(demo.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    selectedDemoId === demo.id
                      ? 'bg-gradient-to-r from-amber-400 to-orange-500 text-slate-950 font-black shadow-[0_0_15px_rgba(251,191,36,0.4)] scale-105'
                      : 'bg-white/[0.04] text-slate-400 hover:text-white hover:bg-white/[0.08] border border-white/[0.06]'
                  }`}
                >
                  <span>{demo.subject}</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-black/20 font-mono">
                    {demo.examBadge}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Solution Canvas Grid */}
          <div className="grid lg:grid-cols-12 gap-6 pt-6">
            {/* Left: Question Card */}
            <div className="lg:col-span-5 space-y-4">
              <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.08] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                    <GraduationCap className="w-4 h-4" />
                    {activeDemo.topic}
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-300">
                    {activeDemo.examBadge}
                  </span>
                </div>
                <div className="text-sm font-medium text-slate-200 leading-relaxed bg-black/30 p-3.5 rounded-xl border border-white/[0.04]">
                  &ldquo;{activeDemo.question}&rdquo;
                </div>
                <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
                  <span className="flex items-center gap-1">
                    <Camera className="w-3.5 h-3.5 text-slate-400" /> Fotoğraf / Metin
                  </span>
                  <span className="font-mono text-emerald-400">Çözüm Süresi: ~1.2 sn</span>
                </div>
              </div>

              {/* Exclusive Student Notice Banner */}
              <div className="p-4 rounded-2xl bg-amber-400/5 border border-amber-400/20 text-xs text-slate-300 space-y-2">
                <div className="flex items-center gap-2 font-bold text-amber-400">
                  <Lock className="w-3.5 h-3.5" />
                  <span>Kayıtlı Öğrencilerimize 7/24 Aktif</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Öğrenci panelinizde dilediğiniz soruyu yazarak veya fotoğrafını yükleyerek anında çözdürebilir, takıldığınız yeri tekrar sorabilirsiniz.
                </p>
                <Link
                  href="/register"
                  className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-400 hover:text-amber-300 pt-1"
                >
                  Ücretsiz Kayıt Ol & Asistanı Hemen Aç <ChevronRight className="w-3 h-3" />
                </Link>
              </div>
            </div>

            {/* Right: Step-by-Step AI Solution Card */}
            <div className="lg:col-span-7 rounded-2xl bg-gradient-to-b from-[#131926] to-[#0d121c] border border-white/[0.1] p-5 space-y-4 shadow-xl">
              <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-xs">
                    🤖
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">Google Gemini AI Çözüm Analizi</h4>
                    <p className="text-[10px] text-slate-400 font-mono">Pedagojik Adım Adım Anlatım</p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-bold text-emerald-400">
                  <CheckCircle2 className="w-3 h-3" /> Doğrulandı
                </div>
              </div>

              {/* Numbered Steps */}
              <div className="space-y-3">
                {activeDemo.steps.map((step, idx) => (
                  <div key={idx} className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-400 text-[11px] font-black flex items-center justify-center shrink-0">
                        {idx + 1}
                      </span>
                      <span className="text-xs font-bold text-slate-200">{step.title}</span>
                    </div>
                    {step.formula && (
                      <div className="ml-7 px-3 py-1.5 rounded-lg bg-black/60 border border-white/[0.08] text-amber-300 font-mono text-[11px]">
                        → {step.formula}
                      </div>
                    )}
                    <p className="ml-7 text-xs text-slate-400 leading-relaxed">{step.explanation}</p>
                  </div>
                ))}
              </div>

              {/* Result Box */}
              <div className="mt-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-300">✅ Sonuç:</span>
                <span className="text-xs font-black font-mono text-emerald-400 bg-emerald-950/60 px-3 py-1 rounded-lg border border-emerald-500/30">
                  {activeDemo.result}
                </span>
              </div>

              {/* Key Insight */}
              <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-start gap-2.5 text-xs text-blue-200">
                <span className="text-sm shrink-0">💡</span>
                <div>
                  <strong className="font-bold text-blue-300">Anahtar Fikir: </strong>
                  <span className="text-slate-300">{activeDemo.keyInsight}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── 3. FOUR CAMPAIGN PILLARS GRID ── */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {/* Pillar 1 */}
          <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/[0.08] hover:border-blue-500/30 transition-all space-y-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
              <Zap className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-white">Google Gemini Altyapısı</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Google’ın en yeni yapay zeka modelleriyle saniyeler içinde hatasız ve pedagojik yanıtlar.
            </p>
          </div>

          {/* Pillar 2 */}
          <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/[0.08] hover:border-amber-500/30 transition-all space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <BrainCircuit className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-white">Ezberletmez, Öğretir</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Sadece şıkkı söylemez; formülü, yöntemi ve sınavda 10 saniyede çözme mantığını kavratır.
            </p>
          </div>

          {/* Pillar 3 */}
          <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/[0.08] hover:border-emerald-500/30 transition-all space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Camera className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-white">Fotoğraflı Soru Gönderimi</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Kitaptaki veya denemedeki sorunun fotoğrafını çekip panelden anında çözüme ulaştırın.
            </p>
          </div>

          {/* Pillar 4 */}
          <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/[0.08] hover:border-rose-500/30 transition-all space-y-3">
            <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
              <Gift className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-white">Öğrencilere Her Gün Ücretsiz</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Eğitim seferberliği kapsamında DersoLab kayıtlı tüm öğrencilerine günlük 15 soru hediye!
            </p>
          </div>
        </div>

        {/* ── 4. CONVERSION CTA BANNER ── */}
        <div className="relative rounded-2xl bg-gradient-to-r from-amber-500/15 via-orange-500/15 to-rose-500/15 border border-amber-400/30 p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
          <div className="space-y-1.5 max-w-xl">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-400">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Hemen Ücretsiz Katılın</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-white">
              Google Destekli AI Soru Asistanı ile Netlerini Katla!
            </h3>
            <p className="text-xs sm:text-sm text-slate-300">
              1 dakikada ücretsiz hesabını oluştur, öğrenci panelinden AI Asistanı hemen kullanmaya başla.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
            <Link
              href="/register"
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 hover:from-amber-300 hover:to-orange-400 text-slate-950 font-black text-sm transition-all shadow-[0_0_25px_rgba(251,191,36,0.4)] flex items-center justify-center gap-2 group cursor-pointer"
            >
              <span>Ücretsiz Kayıt Ol & Kullan</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              href="/login"
              className="w-full sm:w-auto px-5 py-3.5 rounded-xl bg-white/[0.08] hover:bg-white/[0.12] border border-white/10 text-white font-bold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>Giriş Yap</span>
            </Link>
          </div>
        </div>

      </div>
    </section>
  )
}
