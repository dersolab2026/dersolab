'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import {
  GraduationCap,
  ShieldCheck,
  Briefcase,
  CheckCircle2,
  Calendar,
  Clock,
  ArrowRight,
  Video,
  TrendingUp,
  CreditCard,
  MessageCircle,
  Star,
  Award,
  ChevronRight,
  Sparkles,
  Play,
  Sliders,
  Check
} from 'lucide-react'
import { DesignLabSwitcher } from '../DesignLabSwitcher'

// Gerçek DersoLab eğitmenleri (Supabase veritabanından)
const ALL_STAR_INSTRUCTORS = [
  {
    name: 'Gökçe Lale',
    title: 'Fizik Öğretmeni (19 Yıllık Deneyim)',
    badge: '19 Yıl Deneyim • Zümre Bşk.',
    avatar: 'https://nkqifjcyudvwfaehgtgp.supabase.co/storage/v1/object/public/avatars/9397685d-4845-4557-aefe-652b86827117/avatar.jpg',
    tags: ['YKS Fizik', '11-12. Sınıf', 'AYT Sayısal'],
    quote: 'Fizik ezberlenmez, modellenir. Soru kökünü okurken formülü kafanda canlandırmayı öğretiyorum.',
    rating: '5.0',
    lessons: '420+ Ders'
  },
  {
    name: 'Selva Şahin',
    title: 'Türk Dili ve Edebiyatı & YKS Koçu',
    badge: 'Derece Koçu • 12 Yıl',
    avatar: 'https://nkqifjcyudvwfaehgtgp.supabase.co/storage/v1/object/public/avatars/d96a9da2-0057-4c2e-9d74-91c07a5ea9ee/avatar.jpeg',
    tags: ['TYT Paragraf', 'AYT Edebiyat', 'Birebir Koçluk'],
    quote: 'Paragrafta 40 soruyu 32 dakikada hatasız bitirme taktiğiyle öğrencinin deneme süresini cebine koyuyoruz.',
    rating: '4.98',
    lessons: '380+ Ders'
  },
  {
    name: 'Nurcan Karaağaç',
    title: 'Lise & Ortaokul Türkçe / Koçluk',
    badge: 'LGS Uzmanı • 10 Yıl',
    avatar: 'https://nkqifjcyudvwfaehgtgp.supabase.co/storage/v1/object/public/avatars/14082db7-203e-48a2-9911-986f3059aff1/avatar.jpeg',
    tags: ['LGS Türkçe', 'Yeni Nesil Sorular', 'Öğrenci Koçluğu'],
    quote: 'LGS Türkçe mantık-muhakeme sorularında öğrencinin paniklemesini engelleyen şema yöntemi uyguluyoruz.',
    rating: '5.0',
    lessons: '310+ Ders'
  },
  {
    name: 'Gamze Budak',
    title: 'Tarih, Coğrafya & Sosyal Bilimler',
    badge: 'Sosyal Zümresi • 9 Yıl',
    avatar: 'https://nkqifjcyudvwfaehgtgp.supabase.co/storage/v1/object/public/avatars/5e24812e-7a53-430d-b79d-93136b185229/avatar.png',
    tags: ['TYT Sosyal', 'AYT Tarih', 'LGS İnkılap'],
    quote: 'Kronolojik hafıza teknikleriyle TYT Tarih ve Coğrafyada 5’te 5 yapmayı garantiye alıyoruz.',
    rating: '4.95',
    lessons: '240+ Ders'
  }
]

// Canlı İnteraktif Soru Çözüm Tahtası (Gerçek ders içi deneyim)
const LESSON_SIMULATOR = {
  matematik: {
    subject: 'TYT-AYT Matematik',
    topic: 'Parabolün Tepe Noktası ve Fonksiyon Grafikleri',
    teacher: 'Selva Hoca',
    teacherRole: 'Matematik & YKS Koçu',
    teacherImg: 'https://nkqifjcyudvwfaehgtgp.supabase.co/storage/v1/object/public/avatars/d96a9da2-0057-4c2e-9d74-91c07a5ea9ee/avatar.jpeg',
    question: 'Soru: f(x) = 2x² - 8x + k parabolünün tepe noktası y = 3 doğrusu üzerinde olduğuna göre k kaçtır?',
    steps: [
      { step: '1. Tepe Noktası Apsisi (r)', detail: 'r = -b / (2a) = -(-8) / (2×2) = 2' },
      { step: '2. Ordinat Denklemi (k)', detail: 'y = 3 doğrusu üzerinde ise f(2) = 3 olmalıdır.' },
      { step: '3. Denklemde Yerine Koyma', detail: 'f(2) = 2(2)² - 8(2) + k = 8 - 16 + k = 3  ⇒  k = 11' }
    ],
    verifiedTag: 'ÖSYM 2024 Benzeri Soru Kökü'
  },
  fizik: {
    subject: 'AYT Fizik',
    topic: 'Çizgisel Momentum ve İç Patlama Analizi',
    teacher: 'Gökçe Lale',
    teacherRole: '19 Yıllık Fizik Zümre Bşk.',
    teacherImg: 'https://nkqifjcyudvwfaehgtgp.supabase.co/storage/v1/object/public/avatars/9397685d-4845-4557-aefe-652b86827117/avatar.jpg',
    question: 'Soru: Sürtünmesiz yatay düzlemde 3m kütleli cisim v hızıyla giderken bir iç patlamayla iki parçaya ayrılıyor...',
    steps: [
      { step: '1. Net Dış Kuvvet Sıfırdır', detail: 'Dış kuvvet etki etmediği için çizgisel momentum daima korunur: P_ilk = P_son' },
      { step: '2. Vektörel Ayrıştırma', detail: 'Patlama parçalarının hız vektörlerini x ve y koordinatlarına ayrı ayrı eşitleriz.' },
      { step: '3. Enerji İlişkisi', detail: 'Patlamada mekanik enerji korunmaz, kimyasal potansiyel enerji kinetiğe dönüşür.' }
    ],
    verifiedTag: 'ÖSYM Çıkmış Tipoloji'
  },
  turkce: {
    subject: 'LGS / TYT Türkçe',
    topic: 'Yeni Nesil Paragrafta Hız & Eleme Taktikleri',
    teacher: 'Nurcan Hoca',
    teacherRole: 'LGS / TYT Sınav Koçu',
    teacherImg: 'https://nkqifjcyudvwfaehgtgp.supabase.co/storage/v1/object/public/avatars/14082db7-203e-48a2-9911-986f3059aff1/avatar.jpeg',
    question: 'Taktik: Soru kökünde "çıkarılamaz / değinilmemiştir" ifadesi varsa izlenecek en hızlı çözüm yolu nedir?',
    steps: [
      { step: '1. Önce Şıkları Tara', detail: 'Şıklardaki anahtar kavramların (tarih, isim, duygu) altını 5 saniyede çiz.' },
      { step: '2. Metni Eşleyerek Oku', detail: 'Paragrafı okurken şıklarla örtüşen yargıları satır satır ele.' },
      { step: '3. Zamandan Tasarruf', detail: 'Metni iki kez baştan sona okumak yerine ilk okumada doğru cevaba ulaş.' }
    ],
    verifiedTag: '30 Saniye Kazandıran Metot'
  }
}

// Hedef Okullar Listesi
const TARGET_SCHOOLS = [
  { name: 'Galatasaray Lisesi (LGS)', targetNet: 88.5, baseNet: 75, type: 'lgs' },
  { name: 'Kabataş Erkek Lisesi (LGS)', targetNet: 86.0, baseNet: 70, type: 'lgs' },
  { name: 'Boğaziçi Bilgisayar (YKS Sayısal)', targetNet: 108.0, baseNet: 85, type: 'yks' },
  { name: 'ODTÜ İktisat (YKS Eşit Ağırlık)', targetNet: 94.0, baseNet: 72, type: 'yks' },
  { name: 'Cerrahpaşa Tıp (YKS Sayısal)', targetNet: 104.5, baseNet: 82, type: 'yks' }
]

export function DersoLabTasteView() {
  const [persona, setPersona] = useState<'student' | 'parent' | 'instructor'>('student')
  const [selectedSubject, setSelectedSubject] = useState<'matematik' | 'fizik' | 'turkce'>('matematik')
  const [selectedSchoolIndex, setSelectedSchoolIndex] = useState(0)

  // Net simülatörü slider state
  const currentTargetSchool = TARGET_SCHOOLS[selectedSchoolIndex]
  const [currentNet, setCurrentNet] = useState(currentTargetSchool.baseNet)
  const [weeklyHours, setWeeklyHours] = useState(3)

  const activeDemo = LESSON_SIMULATOR[selectedSubject]

  // Hedef süresi hesabı
  const netDiff = Math.max(0, currentTargetSchool.targetNet - currentNet)
  const estimatedWeeks = Math.max(4, Math.round((netDiff * 1.5) / (weeklyHours * 0.75)))

  return (
    <div className="min-h-screen bg-[#07090E] text-slate-100 font-sans antialiased selection:bg-amber-400 selection:text-slate-950 overflow-x-hidden">
      
      {/* ── 1. ÜST PRESTİJ BİLGİ BANDI ── */}
      <div className="border-b border-white/[0.08] bg-[#0A0D15] text-xs py-2 px-4">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span className="text-slate-300 font-medium">
              2026 LGS & YKS Butik Hazırlık Sezonu
            </span>
            <span className="text-slate-600 hidden sm:inline">•</span>
            <span className="text-slate-400 hidden sm:inline">
              Boğaziçi, ODTÜ ve Derece Eğitmenleriyle Birebir Canlı Ders
            </span>
          </div>

          <div className="flex items-center gap-4 text-slate-400 text-xs">
            <span className="text-amber-400 font-semibold">Aylık Paket Yok, Kredi Yanmaz</span>
            <span className="hidden md:inline">•</span>
            <a
              href="https://wa.me/905000000000"
              target="_blank"
              rel="noreferrer"
              className="text-slate-300 hover:text-white flex items-center gap-1 font-medium transition-colors"
            >
              <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
              <span>Veli Danışma Hattı</span>
            </a>
          </div>
        </div>
      </div>

      {/* ── 2. ANA NAVBAR (Kurumsal Butik Akademi Stüdyosu) ── */}
      <header className="sticky top-0 z-50 bg-[#07090E]/90 backdrop-blur-md border-b border-white/[0.08]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between">
          
          {/* Logo & Manifesto */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-slate-950 font-serif font-black text-xl shadow-lg shadow-md group-hover:scale-105 transition-transform">
              D
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-black tracking-tight text-white leading-tight">
                Derso<span className="text-amber-400">Lab</span>
              </span>
              <span className="text-xs text-slate-400 font-medium tracking-wide">
                Butik Online Akademi & Koçluk
              </span>
            </div>
          </Link>

          {/* Persona Değiştirici: Öğrenci / Veli / Eğitmen */}
          <div className="flex items-center bg-white/[0.04] p-1 rounded-xl border border-white/[0.08]">
            <button
              onClick={() => setPersona('student')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                persona === 'student'
                  ? 'bg-amber-400 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <GraduationCap className="w-3.5 h-3.5" />
              <span>Öğrenci</span>
            </button>
            <button
              onClick={() => setPersona('parent')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                persona === 'parent'
                  ? 'bg-amber-400 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Veli</span>
            </button>
            <button
              onClick={() => setPersona('instructor')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                persona === 'instructor'
                  ? 'bg-amber-400 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Briefcase className="w-3.5 h-3.5" />
              <span>Eğitmen</span>
            </button>
          </div>

          {/* CTA Butonları */}
          <div className="flex items-center gap-3">
            <Link
              href="/auth/giris"
              className="hidden sm:inline-block text-xs font-bold text-slate-300 hover:text-white px-3 py-2 transition-colors"
            >
              Giriş Yap
            </Link>
            <Link
              href="/hesap-turu"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-amber-400 hover:bg-amber-300 text-slate-950 active:scale-[0.98] transition-all shadow-md shadow-md"
            >
              <span>20 Dk Ücretsiz Tanışma Dersi</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </header>

      {/* ── 3. HERO: GÜÇLÜ İNSAN VARLIĞI & CANLI DERS STÜDYOSU ── */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 pt-10 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Sol Kolon: Tok, İkna Edici ve Saygın Editoryal Başlık */}
          <div className="lg:col-span-7 flex flex-col z-10">
            
            {/* Canlı Zümre Rozeti */}
            <div className="flex flex-wrap items-center gap-2.5 mb-5">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/10 text-amber-300 text-xs font-semibold border border-amber-400/20">
                <Award className="w-3.5 h-3.5 text-amber-400" />
                <span>Onaylı Zümre Başkanları & Sınav Koçları</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-semibold border border-emerald-500/20">
                <Video className="w-3.5 h-3.5" />
                <span>Google Meet Birebir Canlı Ders</span>
              </span>
            </div>

            {/* Büyük Başlık (Gradient text YOK, Tok ve Net) */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-[1.12] mb-6">
              {persona === 'student' && (
                <>
                  Kalabalık sınıflarda kaybolma. Derece yapmış hocalardan birebir ders al, netlerini planla.
                </>
              )}
              {persona === 'parent' && (
                <>
                  Çocuğunuzun sınav hazırlığını şansa bırakmayın. Şeffaf deneme takibi ve doğrulanmış öğretmenler.
                </>
              )}
              {persona === 'instructor' && (
                <>
                  Kendi ders takviminizi belirleyin, Türkiye’nin en nitelikli LGS ve YKS adaylarıyla çalışın.
                </>
              )}
            </h1>

            {/* Alt Başlık */}
            <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl mb-8">
              {persona === 'student' &&
                'DersoLab; ezberci videolar veya 40 kişilik online sınıflar değildir. Seviyene uygun eğitmeni seçer, yapamadığın deneme sorularını Google Meet üzerinden birebir satır satır çözersin. Kredin sınav gününe kadar yanmaz.'}
              {persona === 'parent' &&
                'Her ders sonrası eğitmenin ayrıntılı değerlendirme raporu ve deneme analiz karnesi veli panelinize düşer. Aylık taahhüt veya sözleşme dayatması yoktur; istediğiniz kadar kredi alır, verim aldıkça devam edersiniz.'}
              {persona === 'instructor' &&
                'Google Calendar ile senkronize otomatik rezervasyon, hazır Meet linkleri ve tahsilat güvencesiyle sadece dersinize odaklanın.'}
            </p>

            {/* Eğitmen Portreleri Şeridi (Gerçek İnsan Yüzleri) */}
            <div className="flex flex-wrap items-center gap-4 p-4 rounded-2xl bg-white/[0.03] border border-white/[0.08] mb-8">
              <div className="flex -space-x-3 overflow-hidden">
                {ALL_STAR_INSTRUCTORS.map((inst, i) => (
                  <div key={i} className="relative w-12 h-12 rounded-full border-2 border-slate-900 overflow-hidden shadow-md">
                    <img
                      src={inst.avatar}
                      alt={inst.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <div className="flex text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-current" />
                    ))}
                  </div>
                  <span className="text-xs font-bold text-white">4.98 / 5</span>
                  <span className="text-xs text-slate-400">(1.400+ Veli & Öğrenci Değerlendirmesi)</span>
                </div>
                <span className="text-xs text-slate-300 font-medium mt-0.5">
                  Gökçe Hoca, Selva Hoca, Nurcan Hoca ve onaylı zümre kadrosu
                </span>
              </div>
            </div>

            {/* Ana Butonlar */}
            <div className="flex flex-wrap items-center gap-4 mb-8">
              <Link
                href="/hesap-turu"
                className="inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl text-sm font-bold bg-amber-400 hover:bg-amber-300 text-slate-950 active:scale-[0.98] transition-all shadow-md"
              >
                <Calendar className="w-4 h-4 text-slate-950" />
                <span>20 Dk Ücretsiz Tanışma Dersi Al</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
              <Link
                href="#canli-ders-tahtasi"
                className="inline-flex items-center justify-center gap-2 px-5 py-4 rounded-xl text-sm font-semibold text-slate-200 bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.1] transition-colors"
              >
                <Play className="w-4 h-4 text-amber-400" />
                <span>Canlı Ders Tahtasını İncele</span>
              </Link>
            </div>

            {/* Somut Güvenceler */}
            <div className="grid grid-cols-3 gap-3 pt-6 border-t border-white/[0.08] text-xs">
              <div>
                <div className="text-xl sm:text-2xl font-black text-white">0 TL</div>
                <div className="text-slate-400 mt-0.5">Abonelik yok, kredi yanmaz</div>
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-black text-amber-400">+14.5 Net</div>
                <div className="text-slate-400 mt-0.5">Ortalama 60 günlük artış</div>
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-black text-emerald-400">%100 Birebir</div>
                <div className="text-slate-400 mt-0.5">Google Meet ile canlı</div>
              </div>
            </div>
          </div>

          {/* Sağ Kolon: ETKİLEŞİMLİ CANLI DERS TAHTASI (İnteraktif Soru Çözüm Stüdyosu) */}
          <div id="canli-ders-tahtasi" className="lg:col-span-5 relative flex flex-col">
            <div className="bg-[#0D111C] rounded-2xl border border-white/[0.12] shadow-2xl overflow-hidden">
              
              {/* Stüdyo Başlığı ve Branş Sekmeleri */}
              <div className="bg-[#121826] px-4 py-3.5 border-b border-white/[0.08]">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                    <h2 className="text-xs font-bold text-white uppercase tracking-wider">
                      Canlı Ders Odası Simülatörü
                    </h2>
                  </div>
                  <span className="text-xs font-mono text-amber-300 bg-amber-400/10 px-2.5 py-0.5 rounded border border-amber-400/20">
                    Öğretmen & Öğrenci Ekranı
                  </span>
                </div>

                {/* Sekmeler: Matematik / Fizik / Türkçe */}
                <div className="flex gap-2">
                  <button
                    onClick={() => setSelectedSubject('matematik')}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      selectedSubject === 'matematik'
                        ? 'bg-amber-400 text-slate-950 shadow-sm'
                        : 'bg-white/[0.04] text-slate-400 hover:text-white'
                    }`}
                  >
                    Matematik
                  </button>
                  <button
                    onClick={() => setSelectedSubject('fizik')}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      selectedSubject === 'fizik'
                        ? 'bg-amber-400 text-slate-950 shadow-sm'
                        : 'bg-white/[0.04] text-slate-400 hover:text-white'
                    }`}
                  >
                    Fizik
                  </button>
                  <button
                    onClick={() => setSelectedSubject('turkce')}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      selectedSubject === 'turkce'
                        ? 'bg-amber-400 text-slate-950 shadow-sm'
                        : 'bg-white/[0.04] text-slate-400 hover:text-white'
                    }`}
                  >
                    Türkçe
                  </button>
                </div>
              </div>

              {/* Canlı Eğitmen Bilgisi Barı */}
              <div className="p-4 bg-white/[0.02] border-b border-white/[0.06] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative w-11 h-11 rounded-full overflow-hidden border border-amber-400/40">
                    <img
                      src={activeDemo.teacherImg}
                      alt={activeDemo.teacher}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white flex items-center gap-1.5">
                      <span>{activeDemo.teacher}</span>
                      <span className="text-xs text-emerald-400 bg-emerald-500/10 px-1.5 py-0.2 rounded font-mono">
                        CANLI DERS
                      </span>
                    </div>
                    <div className="text-xs text-slate-400">{activeDemo.teacherRole}</div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold flex items-center gap-1.5">
                    <Video className="w-3.5 h-3.5" />
                    <span>Google Meet</span>
                  </div>
                </div>
              </div>

              {/* İnteraktif Soru ve Çözüm Adımları */}
              <div className="p-5 space-y-4">
                
                {/* Soru Kutusu - Flat Açık Tasarım */}
                <div className="py-3 px-4 border-l-2 border-amber-400/80 bg-white/[0.02]">
                  <div className="flex items-center justify-between text-xs font-mono text-amber-300 mb-1.5">
                    <span>{activeDemo.subject}</span>
                    <span className="text-slate-300">{activeDemo.verifiedTag}</span>
                  </div>
                  <h3 className="text-xs sm:text-sm font-semibold text-slate-100 leading-relaxed [text-wrap:balance]">
                    {activeDemo.question}
                  </h3>
                </div>

                {/* Eğitmenin Çözüm Adımları */}
                <div className="space-y-2.5 pt-1">
                  <div className="text-xs font-mono uppercase tracking-wider text-slate-300">
                    Birebir Canlı Çözüm Adımları:
                  </div>
                  {activeDemo.steps.map((st, idx) => (
                    <div
                      key={idx}
                      className="py-2.5 px-3 border-b border-white/[0.05] text-xs flex items-start gap-2.5 last:border-b-0"
                    >
                      <span className="w-5 h-5 rounded bg-amber-400/20 text-amber-300 font-mono font-bold text-xs flex items-center justify-center shrink-0">
                        {idx + 1}
                      </span>
                      <div>
                        <div className="font-bold text-slate-100">{st.step}</div>
                        <div className="text-slate-300 font-mono text-xs mt-0.5">{st.detail}</div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Veli Bilgilendirme Dipnotu */}
                <div className="pt-3 border-t border-white/[0.08] flex items-center justify-between text-xs text-slate-400">
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    Öğrenci takıldığı her soruyu doğrudan sorabilir
                  </span>
                  <Link
                    href="/hesap-turu"
                    className="text-amber-400 hover:underline font-bold text-xs"
                  >
                    Tanışma Dersi Al →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 4. BÖLÜM: GERÇEK EĞİTMEN KADROSU (All-Star Grid) ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16 border-t border-white/[0.08]">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight [text-wrap:balance]">
              Her Başvuran Değil, Yalnızca Doğrulanmış Branş Uzmanları.
            </h2>
          </div>
          <p className="text-slate-300 text-sm max-w-md mt-4 sm:mt-0 [text-wrap:pretty]">
            Eğitmenlerimizin tamamı mülakat, deneme dersi ve veli değerlendirmesinden geçen deneyimli zümre öğretmenleridir.
          </p>
        </div>

        {/* 4'lü Eğitmen Kartları */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {ALL_STAR_INSTRUCTORS.map((teacher, index) => (
            <div
              key={index}
              className="bg-[#0E121B] rounded-2xl border border-white/[0.1] p-5 flex flex-col justify-between hover:border-amber-400/50 transition-colors group"
            >
              <div>
                <div className="relative w-full h-44 rounded-xl overflow-hidden mb-4 bg-slate-800">
                  <img
                    src={teacher.avatar}
                    alt={teacher.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-2.5 right-2.5 bg-slate-900/95 backdrop-blur-md px-2 py-0.5 rounded text-xs font-bold text-amber-300 border border-white/[0.15] flex items-center gap-1">
                    <Star className="w-3 h-3 fill-current" />
                    <span>{teacher.rating}</span>
                  </div>
                </div>

                <div className="text-xs font-mono text-amber-400 mb-1">{teacher.badge}</div>
                <h3 className="text-lg font-bold text-white mb-1">{teacher.name}</h3>
                <p className="text-xs text-slate-300 mb-3">{teacher.title}</p>

                {/* Etiketler */}
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {teacher.tags.map((t, ti) => (
                    <span
                      key={ti}
                      className="text-xs px-2 py-0.5 rounded bg-white/[0.06] text-slate-200 border border-white/[0.08]"
                    >
                      {t}
                    </span>
                  ))}
                </div>

                <p className="text-xs text-slate-200 italic border-l-2 border-amber-400/50 pl-3 py-1 my-3 [text-wrap:pretty]">
                  "{teacher.quote}"
                </p>
              </div>

              <div className="pt-3 border-t border-white/[0.08] flex items-center justify-between text-xs">
                <span className="text-slate-300 font-medium">{teacher.lessons}</span>
                <Link
                  href="/hesap-turu"
                  className="font-bold text-amber-300 hover:text-amber-200 flex items-center gap-1"
                >
                  <span>Ders İste</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── 5. BÖLÜM: İNTERAKTİF HEDEF OKUL & NET SİMÜLATÖRÜ ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16 border-t border-white/[0.08]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          <div className="lg:col-span-5">
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight mb-4">
              Hayalindeki Okulu Seç, Haftalık Çalışma Temponu Hesapla.
            </h2>
            <p className="text-slate-300 text-sm leading-relaxed mb-6">
              Öğrenciler genellikle nereye odaklanacaklarını bilmedikleri için enerjilerini tüketirler.
              DersoLab'da hedef okulunun gerektirdiği net tablosuna göre nokta atışı eksik konu kapatırız.
            </p>

            {/* Hedef Okul Seçim Butonları */}
            <div className="space-y-2 mb-6">
              <div className="text-xs font-mono text-slate-400 uppercase tracking-wider mb-1">
                Popüler Hedef Okul Tablosu:
              </div>
              {TARGET_SCHOOLS.map((school, sIdx) => (
                <button
                  key={sIdx}
                  onClick={() => {
                    setSelectedSchoolIndex(sIdx)
                    setCurrentNet(school.baseNet)
                  }}
                  className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold flex items-center justify-between border transition-all ${
                    selectedSchoolIndex === sIdx
                      ? 'bg-amber-400/10 border-amber-400 text-amber-300'
                      : 'bg-[#0E121B] border-white/[0.08] text-slate-300 hover:text-white'
                  }`}
                >
                  <span>{school.name}</span>
                  <span className="font-mono text-xs">{school.targetNet} Net Hedefi</span>
                </button>
              ))}
            </div>
          </div>

          {/* İnteraktif Simülatör Kartı */}
          <div className="lg:col-span-7 bg-[#0E121B] rounded-2xl border border-white/[0.1] p-6 sm:p-8 shadow-2xl">
            <div className="flex items-center justify-between pb-5 border-b border-white/[0.08] mb-6">
              <div>
                <h3 className="text-lg font-bold text-white">Net & Koçluk Simülatörü</h3>
                <p className="text-xs text-slate-400">{currentTargetSchool.name} İçin Analiz</p>
              </div>
              <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono font-bold">
                +{netDiff.toFixed(1)} Net Artış Lazım
              </span>
            </div>

            <div className="space-y-6">
              {/* Şu Anki Net Slider */}
              <div>
                <div className="flex justify-between text-xs font-mono mb-2">
                  <span className="text-slate-400">Şu Anki Ortalama Netiniz:</span>
                  <span className="text-white font-bold">{currentNet} Net</span>
                </div>
                <input
                  type="range"
                  min="30"
                  max={currentTargetSchool.targetNet - 1}
                  value={currentNet}
                  onChange={(e) => setCurrentNet(Number(e.target.value))}
                  className="w-full accent-amber-400 bg-white/10 h-2 rounded-lg cursor-pointer"
                />
              </div>

              {/* Haftalık Birebir Ders Saati */}
              <div>
                <div className="flex justify-between text-xs font-mono mb-2">
                  <span className="text-slate-400">Haftalık Birebir Canlı Ders Saati:</span>
                  <span className="text-amber-400 font-bold">{weeklyHours} Saat / Hafta</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="8"
                  value={weeklyHours}
                  onChange={(e) => setWeeklyHours(Number(e.target.value))}
                  className="w-full accent-amber-400 bg-white/10 h-2 rounded-lg cursor-pointer"
                />
              </div>

              {/* Sonuç Hesap Paneli - Flat Divider Yapı */}
              <div className="grid grid-cols-3 gap-3 py-4 border-y border-white/[0.08] text-center">
                <div>
                  <div className="text-xs font-mono text-slate-300">Öngörülen Süre</div>
                  <div className="text-xl font-black text-white mt-0.5">~{estimatedWeeks} Hafta</div>
                </div>
                <div>
                  <div className="text-xs font-mono text-slate-300">Eksik Konu Havuzu</div>
                  <div className="text-xl font-black text-amber-300 mt-0.5">
                    {Math.round(netDiff * 1.6)} Konu
                  </div>
                </div>
                <div>
                  <div className="text-xs font-mono text-slate-300">Kredi Güvencesi</div>
                  <div className="text-xl font-black text-emerald-400 mt-0.5">Yanmaz</div>
                </div>
              </div>

              <Link
                href="/hesap-turu"
                className="w-full py-4 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-center text-sm transition-colors flex items-center justify-center gap-2 shadow-lg shadow-md"
              >
                <span>Bu Hedefe Yönelik Ücretsiz Tanışma Dersi Planla</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── 6. BÖLÜM: 3 ADIMLI NET ŞEFFAFLIK ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16 border-t border-white/[0.08]">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight mb-3">
            Karmaşık Paketler Yok. 3 Adımda Başlayın.
          </h2>
          <p className="text-slate-400 text-sm">
            Aylık bağlayıcı aidat veya taahhüt ödemezsiniz. İhtiyacınız kadar ders alır, verim aldıkça ilerlersiniz.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-[#0E121B] border border-white/[0.08] flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-amber-400 text-slate-950 font-black text-sm flex items-center justify-center mb-4">
                01
              </div>
              <h3 className="text-lg font-bold text-white mb-2">20 Dk Ücretsiz Tanışma Dersi</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Öğrencinin seviyesini ve eğitmenle uyumunu test etmek için ilk görüşme tamamen ücretsizdir.
              </p>
            </div>
            <div className="mt-4 pt-4 border-t border-white/[0.06] text-xs font-mono text-amber-400">
              Sıfır Risk ve Ön Ödemesiz
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-[#0E121B] border border-white/[0.08] flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-white text-slate-950 font-black text-sm flex items-center justify-center mb-4">
                02
              </div>
              <h3 className="text-lg font-bold text-white mb-2">İhtiyacın Kadar Kredi Al</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Aylık paket zorunluluğu yok. 5 veya 10 saatlik ders kredisi alıp sınav gününe kadar özgürce kullanın.
              </p>
            </div>
            <div className="mt-4 pt-4 border-t border-white/[0.06] text-xs font-mono text-slate-300">
              Kullanılmayan Saatler Asla Yanmaz
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-[#0E121B] border border-white/[0.08] flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-emerald-500 text-slate-950 font-black text-sm flex items-center justify-center mb-4">
                03
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Haftalık Deneme & Veli Raporu</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Öğrenci deneme sonuçlarını sisteme girer; koç öğretmen eksik konuları raporlar ve veliye karne iletilir.
              </p>
            </div>
            <div className="mt-4 pt-4 border-t border-white/[0.06] text-xs font-mono text-emerald-400">
              Ölçülebilir Net Gelişimi
            </div>
          </div>
        </div>
      </section>

      {/* ── 7. FOOTER ── */}
      <footer className="bg-[#05070D] text-slate-400 py-12 border-t border-white/[0.08]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-lg font-black text-white">DersoLab</span>
              <span className="text-xs text-slate-400">| Butik Online Akademi & Koçluk</span>
            </div>
            <p className="text-xs text-slate-500 max-w-md">
              LGS ve YKS adayları için onaylı zümre başkanlarıyla birebir canlı ders ve haftalık deneme koçluğu.
            </p>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="text-xs text-slate-300 hover:text-white px-3 py-2 border border-white/[0.1] rounded-lg transition-colors"
            >
              Mevcut Ana Sayfa
            </Link>
            <Link
              href="/hesap-turu"
              className="text-xs font-bold bg-amber-400 hover:bg-amber-300 text-slate-950 px-4 py-2.5 rounded-xl transition-colors shadow-lg shadow-md"
            >
              20 Dk Ücretsiz Tanışma Dersi Planla
            </Link>
          </div>
        </div>
      </footer>

      {/* Yüzen Tasarım Seçici */}
      <DesignLabSwitcher />
    </div>
  )
}
