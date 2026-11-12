'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  GraduationCap,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Clock,
  ArrowRight,
  Video,
  TrendingUp,
  Star,
  Award,
  ChevronRight,
  Sparkles,
  Play,
  Pause,
  Sliders,
  Volume2,
  Check,
  Users,
  Compass,
  FileCheck2,
  RotateCcw,
  Zap
} from 'lucide-react'
import { DesignLabSwitcher } from '../DesignLabSwitcher'

// Gerçek Supabase Eğitmen Veritabanı
const REAL_INSTRUCTORS = [
  {
    id: 'gokce-lale',
    name: 'Gökçe Lale',
    title: 'Fizik Zümre Başkanı',
    exp: '19 Yıl Deneyim',
    school: 'Gazi Üniversitesi Fizik Eğitimi',
    avatar: 'https://nkqifjcyudvwfaehgtgp.supabase.co/storage/v1/object/public/avatars/9397685d-4845-4557-aefe-652b86827117/avatar.jpg',
    rating: '5.0',
    reviewCount: '420+',
    examType: ['yks-sayisal', 'ara-sinif'],
    quote: 'Fizik ezberletilmez; soru kökünü modelleriz. Öğrenci formül aramaz, olayın mantığını kavrar.',
    audioSnippet: '0:34 dk • "AYT Fizik 14’te 14 Taktikleri"',
    tags: ['AYT Fizik', '11-12. Sınıf', 'ÖSYM Modelleme'],
    hourlyFee: '1.200 ₺ / saat'
  },
  {
    id: 'selva-sahin',
    name: 'Selva Şahin',
    title: 'Türk Dili & Edebiyatı / YKS Derece Koçu',
    exp: '12 Yıl Deneyim',
    school: 'Boğaziçi Mezunu Zümre Öğretmeni',
    avatar: 'https://nkqifjcyudvwfaehgtgp.supabase.co/storage/v1/object/public/avatars/d96a9da2-0057-4c2e-9d74-91c07a5ea9ee/avatar.jpeg',
    rating: '4.98',
    reviewCount: '380+',
    examType: ['yks-sayisal', 'yks-ea'],
    quote: 'Paragrafta 40 soruyu 32 dakikada hatasız bitirme tekniğiyle öğrencinin deneme süresini cebine koyuyoruz.',
    audioSnippet: '0:28 dk • "Paragrafta Çeldiricileri Eleme Yöntemi"',
    tags: ['TYT Türkçe', 'AYT Edebiyat', 'Derece Koçluğu'],
    hourlyFee: '1.100 ₺ / saat'
  },
  {
    id: 'nurcan-karaagac',
    name: 'Nurcan Karaağaç',
    title: 'LGS Türkçe & Mantık Muhakeme Uzmanı',
    exp: '10 Yıl Deneyim',
    school: 'Marmara Üniversitesi Türkçe Eğitimi',
    avatar: 'https://nkqifjcyudvwfaehgtgp.supabase.co/storage/v1/object/public/avatars/14082db7-203e-48a2-9911-986f3059aff1/avatar.jpeg',
    rating: '5.0',
    reviewCount: '310+',
    examType: ['lgs'],
    quote: 'LGS yeni nesil grafik ve tablo okuma sorularında panikleyen öğrenciye sistematik analiz şablonu veriyoruz.',
    audioSnippet: '0:41 dk • "LGS 2024 Türkçe Mantık Çözüm Analizi"',
    tags: ['LGS Türkçe', 'Mantık-Muhakeme', 'Sınav Psikolojisi'],
    hourlyFee: '950 ₺ / saat'
  },
  {
    id: 'gamze-budak',
    name: 'Gamze Budak',
    title: 'Sosyal Bilimler & Coğrafya Zümresi',
    exp: '9 Yıl Deneyim',
    school: 'İstanbul Üniversitesi Tarih & Coğrafya',
    avatar: 'https://nkqifjcyudvwfaehgtgp.supabase.co/storage/v1/object/public/avatars/5e24812e-7a53-430d-b79d-93136b185229/avatar.png',
    rating: '4.95',
    reviewCount: '240+',
    examType: ['yks-ea', 'yks-sayisal', 'lgs'],
    quote: 'Harita okuma ve kronolojik hafıza kodlamasıyla TYT ve LGS Sosyalde firesiz 5/5 neti hedefliyoruz.',
    audioSnippet: '0:25 dk • "TYT Coğrafya İklim ve Harita Kodları"',
    tags: ['TYT Sosyal', 'AYT Tarih', 'LGS İnkılap'],
    hourlyFee: '900 ₺ / saat'
  }
]

// Doğrulanmış Öğrenci & Okul Başarı Bandı (Magic UI Marquee Data)
const MARQUEE_ACHIEVEMENTS = [
  { student: 'Ece B.', school: 'Kabataş Erkek Lisesi', metric: 'LGS %0.08', subject: 'Matematik & Türkçe Birebir', net: '+17.5 Net' },
  { student: 'Mert K.', school: 'Boğaziçi Bilgisayar Müh.', metric: 'YKS Sayısal 184.', subject: 'Fizik & Geometri', net: '+22.5 Net' },
  { student: 'Zeynep S.', school: 'Galatasaray Lisesi', metric: 'LGS %0.04', subject: 'LGS Bütüncül Paket', net: '500 Tam Puan' },
  { student: 'Kaan Ş.', school: 'ODTÜ Elektrik-Elektronik', metric: 'YKS Sayısal 412.', subject: 'AYT Fizik & Kimya', net: '+19.0 Net' },
  { student: 'İrem Y.', school: 'Koç Üniversitesi Hukuk', metric: 'YKS EA 320.', subject: 'Matematik & Edebiyat', net: '+26.0 Net' },
  { student: 'Defne T.', school: 'İstanbul Erkek Lisesi', metric: 'LGS %0.12', subject: 'LGS Fen & Matematik', net: '+15.0 Net' },
  { student: 'Alperen D.', school: 'İTÜ Yapay Zeka Müh.', metric: 'YKS Sayısal 650.', subject: 'AYT Matematik & Fizik', net: '+21.5 Net' }
]

export function ModernAcademyView() {
  const [selectedExam, setSelectedExam] = useState<'lgs' | 'yks-sayisal' | 'yks-ea' | 'ara-sinif'>('lgs')
  const [selectedGoal, setSelectedGoal] = useState<'net' | 'taktik' | 'zaman' | 'sifirdan'>('net')
  const [isPlayingAudio, setIsPlayingAudio] = useState(false)
  const [activeAudioIndex, setActiveAudioIndex] = useState(0)
  const [creditPacks, setCreditPacks] = useState<number>(5)

  const matchedInstructor = REAL_INSTRUCTORS.find((ins) =>
    ins.examType.includes(selectedExam)
  ) || REAL_INSTRUCTORS[0]

  return (
    <div className="min-h-screen w-full bg-[#060913] text-slate-100 font-sans selection:bg-amber-400 selection:text-slate-950 relative overflow-hidden pb-32">
      {/* İnce Mimari Izgara & Ambient Işık */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

      {/* ── 1. ÜST NAVİGASYON ── */}
      <header className="relative z-20 border-b border-white/[0.08] bg-[#060913]/90 backdrop-blur-md sticky top-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-18 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2.5">
              <span className="w-9 h-9 rounded-xl bg-amber-400 text-slate-950 font-black text-lg flex items-center justify-center shadow-md">
                D
              </span>
              <span className="text-xl font-bold tracking-tight text-white">
                Derso<span className="text-amber-400">Lab</span>
              </span>
            </Link>
            <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-mono font-medium bg-white/[0.05] border border-white/[0.08] text-slate-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              Doğrulanmış Eğitmen Platformu
            </span>
          </div>

          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-200">
            <a href="#nasil-calisir" className="hover:text-white transition-colors">Nasıl Çalışır?</a>
            <a href="#kadro" className="hover:text-white transition-colors">Eğitmen Kadrosu</a>
            <a href="#kredi-sistemi" className="hover:text-white transition-colors">Yanmayan Kredi</a>
            <a href="#veli-raporu" className="hover:text-white transition-colors">Veli Takip Paneli</a>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/giris"
              className="px-4 py-2 text-xs font-semibold text-slate-200 hover:text-white transition-colors"
            >
              Giriş Yap
            </Link>
            <Link
              href="/hesap-turu"
              className="px-4 py-2 rounded-xl text-xs font-bold bg-amber-400 hover:bg-amber-300 text-slate-950 transition-all shadow-md flex items-center gap-1.5"
            >
              <span>Ücretsiz Tanışma Dersi</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </header>

      {/* ── 2. HERO SECTION ── */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 pt-12 sm:pt-20 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Sol Kolon */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-400/10 border border-amber-400/25 text-amber-300 text-xs font-mono font-medium">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Abonelik Yok • Zorunlu Taahhüt Yok • Krediniz Asla Yanmaz</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-5xl font-black text-white tracking-tight leading-[1.15] [text-wrap:balance]">
              Kalabalık sınıfları unutun.{' '}
              <span className="text-amber-400">
                Türkiye’nin seçkin zümre hocalarından
              </span>{' '}
              birebir canlı ders.
            </h1>

            <p className="text-base sm:text-lg text-slate-200 max-w-2xl leading-relaxed [text-wrap:pretty]">
              LGS ve YKS’de başarıyı şansa bırakmayın. Yalnızca kapsamlı mülakat ve veli onayından geçmiş deneyimli branş öğretmenleriyle, Google Meet üzerinden 1-e-1 canlı çalışın.
            </p>

            {/* 3 Güven Rozeti */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div className="flex items-center gap-2.5 p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
                <div className="text-xs">
                  <div className="font-bold text-white">İlk 20 Dk İade</div>
                  <div className="text-slate-300 font-medium">Frekans tutmazsa sıfır risk</div>
                </div>
              </div>
              <div className="flex items-center gap-2.5 p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                <RotateCcw className="w-5 h-5 text-amber-400 shrink-0" />
                <div className="text-xs">
                  <div className="font-bold text-white">Yanmayan Kredi</div>
                  <div className="text-slate-300 font-medium">Aylık kota zorunluluğu yok</div>
                </div>
              </div>
              <div className="flex items-center gap-2.5 p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                <Users className="w-5 h-5 text-sky-400 shrink-0" />
                <div className="text-xs">
                  <div className="font-bold text-white">Seçilmiş Kadro</div>
                  <div className="text-slate-300 font-medium">10+ yıl deneyimli öğretmenler</div>
                </div>
              </div>
            </div>

            {/* Aksiyon Butonları */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
              <Link
                href="/hesap-turu"
                className="px-6 py-3.5 rounded-xl text-sm font-bold bg-amber-400 hover:bg-amber-300 text-slate-950 transition-all text-center flex items-center justify-center gap-2 shadow-lg shadow-black/40"
              >
                <span>Hemen Öğretmenini Seç ve Başla</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href="#canli-deneyim"
                className="px-6 py-3.5 rounded-xl text-sm font-semibold bg-white/[0.06] hover:bg-white/[0.1] text-white border border-white/[0.1] transition-all text-center flex items-center justify-center gap-2"
              >
                <Play className="w-4 h-4 text-amber-400 fill-amber-400" />
                <span>Ders Deneyimini İncele</span>
              </a>
            </div>
          </div>

          {/* Sağ Kolon: ETKİLEŞİMLİ EŞLEŞTİRME SİHİRBAZI */}
          <div className="lg:col-span-5 relative">
            <div className="bg-[#0B101D] border border-white/[0.12] rounded-2xl shadow-xl overflow-hidden p-5 sm:p-6 relative">
              
              <div className="flex items-center justify-between pb-4 border-b border-white/[0.08] mb-5">
                <div>
                  <div className="text-xs font-mono text-amber-300 uppercase tracking-wider font-semibold">
                    Akıllı Eşleşme Sihirbazı
                  </div>
                  <h2 className="text-base font-bold text-white mt-0.5">
                    Hedefine En Uygun Eğitmeni Bul
                  </h2>
                </div>
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
              </div>

              {/* Adım 1: Sınav Türü Seçimi */}
              <div className="space-y-2 mb-4">
                <span className="text-xs font-mono text-slate-200 block">1. Sınav Hedefinizi Seçin:</span>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'lgs', label: 'LGS (8. Sınıf)' },
                    { id: 'yks-sayisal', label: 'YKS Sayısal' },
                    { id: 'yks-ea', label: 'YKS Eşit Ağırlık' },
                    { id: 'ara-sinif', label: 'Ara Sınıf Takviye' }
                  ].map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setSelectedExam(item.id as any)}
                      className={`py-2 px-3 rounded-lg text-xs font-bold transition-all text-left flex items-center justify-between ${
                        selectedExam === item.id
                          ? 'bg-amber-400 text-slate-950 shadow-sm'
                          : 'bg-white/[0.04] text-slate-200 hover:text-white border border-white/[0.06]'
                      }`}
                    >
                      <span>{item.label}</span>
                      {selectedExam === item.id && <Check className="w-3.5 h-3.5" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Adım 2: Öncelikli Hedef */}
              <div className="space-y-2 mb-5">
                <span className="text-xs font-mono text-slate-200 block">2. Çözmek İstediğiniz Temel Sorun:</span>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'net', label: 'Hızlı Net Artışı' },
                    { id: 'taktik', label: 'Yeni Nesil Soru Taktikleri' },
                    { id: 'zaman', label: 'Süre ve Sınav Kaygısı' },
                    { id: 'sifirdan', label: 'Sıfırdan Konu Kapatma' }
                  ].map((goal) => (
                    <button
                      key={goal.id}
                      onClick={() => setSelectedGoal(goal.id as any)}
                      className={`py-2 px-3 rounded-lg text-xs font-semibold transition-all text-left flex items-center justify-between ${
                        selectedGoal === goal.id
                          ? 'bg-sky-400 text-slate-950 font-bold shadow-sm'
                          : 'bg-white/[0.04] text-slate-200 hover:text-white border border-white/[0.06]'
                      }`}
                    >
                      <span>{goal.label}</span>
                      {selectedGoal === goal.id && <Check className="w-3.5 h-3.5" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Eşleşen Eğitmen Önizleme Kartı (Flat Yapı) */}
              <div className="py-4 border-t border-white/[0.08] space-y-3">
                <div className="text-xs font-mono text-emerald-400 font-bold flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Hedefiniz İçin Önerilen Baş Öğretmen:</span>
                </div>

                <div className="flex items-center gap-3.5 py-3 border-y border-white/[0.06]">
                  <div className="relative w-14 h-14 rounded-xl overflow-hidden shrink-0 border border-amber-400/40">
                    <img
                      src={matchedInstructor.avatar}
                      alt={matchedInstructor.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-0 inset-x-0 bg-slate-900/95 text-xs text-center font-bold text-amber-300 py-1.5">
                      ★ {matchedInstructor.rating}
                    </div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <div className="text-sm font-bold text-white truncate">{matchedInstructor.name}</div>
                      <span className="text-xs font-mono font-bold text-amber-300">
                        {matchedInstructor.exp}
                      </span>
                    </div>
                    <div className="text-xs text-slate-300 truncate">{matchedInstructor.title}</div>
                    <div className="text-xs text-slate-400 mt-1 italic line-clamp-1">
                      "{matchedInstructor.quote}"
                    </div>
                  </div>
                </div>

                <Link
                  href="/hesap-turu"
                  className="w-full py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs transition-colors flex items-center justify-center gap-2 shadow-md"
                >
                  <span>{matchedInstructor.name} ile Tanışma Dersi Ayarla</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* ── 3. MAGIC UI MARQUEE: GERÇEK ÖĞRENCİ BAŞARI BANDI ── */}
      <section className="border-y border-white/[0.08] bg-[#080D1A] py-6 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-amber-300 uppercase tracking-wider">
            <Award className="w-4 h-4 text-amber-400" />
            <span>Doğrulanmış Öğrenci & Sınav Dereceleri</span>
          </div>
          <span className="text-xs text-slate-300 hidden sm:block font-medium">
            Velilerimizin ve öğrencilerimizin gerçek sınav sonuçları
          </span>
        </div>

        <div className="flex gap-4 overflow-x-auto scrollbar-none py-2 px-4 max-w-7xl mx-auto">
          {MARQUEE_ACHIEVEMENTS.map((item, idx) => (
            <div
              key={idx}
              className="shrink-0 p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.08] flex items-center gap-3 min-w-[300px]"
            >
              <div className="w-12 h-10 rounded-lg bg-amber-400/10 border border-amber-400/20 text-amber-300 font-bold text-xs flex items-center justify-center shrink-0">
                {item.net}
              </div>
              <div className="text-xs min-w-0">
                <div className="font-bold text-white truncate flex items-center gap-1.5">
                  <span>{item.student}</span>
                  <span className="text-xs font-mono px-3 py-1.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                    {item.metric}
                  </span>
                </div>
                <div className="text-slate-200 font-semibold truncate">{item.school}</div>
                <div className="text-xs text-slate-400">{item.subject}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── 4. 21ST.DEV BENTO GRID: GERÇEK ÖĞRENME MİMARİSİ ── */}
      <section id="canli-deneyim" className="max-w-7xl mx-auto px-4 sm:px-6 py-20">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-sky-500/10 border border-sky-500/25 text-sky-300 text-xs font-mono font-medium mb-3">
            <Compass className="w-3.5 h-3.5 text-sky-400" />
            <span>Eğitimde Yüksek Zanaat & Şeffaf Süreç</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight [text-wrap:balance]">
            Ezberci kalıplardan uzak, tamamen öğrenciye özel canlı süreç.
          </h2>
          <p className="text-slate-200 text-sm sm:text-base mt-3 [text-wrap:pretty]">
            DersoLab'de ne aldığınızı, öğretmeninizin kim olduğunu ve çocuğunuzun her derste hangi kazanımı edindiğini tam şeffaflıkla bilirsiniz.
          </p>
        </div>

        {/* 4'lü Bento Izgara */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* Bento Kart 1: Öğretmenin Sesini Önceden Dinle (Voice Note Widget) */}
          <div className="bg-[#0B101D] rounded-2xl border border-white/[0.1] p-6 flex flex-col justify-between hover:border-amber-400/40 transition-colors">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Volume2 className="w-5 h-5 text-amber-400 shrink-0" />
                <h3 className="text-lg font-bold text-white">
                  Öğretmenin Anlatımını Önceden Dinleyin
                </h3>
              </div>
              <p className="text-xs text-slate-200 leading-relaxed mb-4 [text-wrap:pretty]">
                Her öğretmenin ses tonu, diksiyonu ve soruya yaklaşımı farklıdır. Derse başlamadan önce hocanızın 30 saniyelik sesli tanıtımını dinleyerek doğru frekansı yakalayın.
              </p>

              {/* Ses Çalar Flat Tasarım */}
              <div className="py-3 px-3.5 border-y border-white/[0.08] space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2.5">
                    <button
                      onClick={() => setIsPlayingAudio(!isPlayingAudio)}
                      className="w-8 h-8 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center shadow-md hover:scale-105 transition-transform"
                    >
                      {isPlayingAudio ? <Pause className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current ml-0.5" />}
                    </button>
                    <div>
                      <div className="font-bold text-white text-xs">{REAL_INSTRUCTORS[activeAudioIndex].name}</div>
                      <div className="text-xs text-slate-400 font-mono">{REAL_INSTRUCTORS[activeAudioIndex].audioSnippet}</div>
                    </div>
                  </div>
                  <span className="text-xs font-mono text-emerald-400 font-semibold">Canlı Ses Kartı</span>
                </div>

                {/* Ses Dalgası */}
                <div className="flex items-center gap-1.5 h-6 px-1">
                  {[40, 70, 30, 90, 60, 100, 45, 80, 50, 95, 30, 85, 60, 40, 75, 90, 55, 35, 70, 85].map((h, i) => (
                    <span
                      key={i}
                      style={{ height: `${isPlayingAudio ? Math.max(20, Math.round(h * Math.random())) : h * 0.4}%` }}
                      className={`w-1 rounded-full transition-all duration-200 ${
                        isPlayingAudio ? 'bg-amber-400' : 'bg-white/30'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-white/[0.06] flex items-center justify-between text-xs text-slate-200">
              <span>Diğer hocaların kayıtları:</span>
              <div className="flex gap-1.5">
                {REAL_INSTRUCTORS.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => { setActiveAudioIndex(i); setIsPlayingAudio(true); }}
                    className={`w-6 h-6 rounded-md text-xs font-bold ${
                      activeAudioIndex === i ? 'bg-amber-400 text-slate-950' : 'bg-white/10 text-white'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Bento Kart 2: Çift Ekranlı Canlı Ders Tahtası */}
          <div className="bg-[#0B101D] rounded-2xl border border-white/[0.1] p-6 flex flex-col justify-between hover:border-sky-400/40 transition-colors lg:col-span-2">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-xl bg-sky-400/10 border border-sky-400/20 text-sky-300 flex items-center justify-center">
                  <Video className="w-5 h-5" />
                </div>
                <span className="text-xs font-mono font-bold px-3 py-1.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-300">
                  Google Meet Altyapısı
                </span>
              </div>

              <h3 className="text-lg font-bold text-white mb-1.5">
                Etkileşimli Canlı Çalışma Stüdyosu
              </h3>
              <p className="text-xs text-slate-200 leading-relaxed mb-4 [text-wrap:pretty]">
                Tek taraflı slayt okuma yok. Öğrenci kalemini alır, öğretmeniyle aynı dijital beyaz tahtada soru çözer, takıldığı anda sesli ve görsel müdahale alır.
              </p>

              {/* Canlı Ekran Simülasyonu Flat */}
              <div className="py-3 px-4 border-y border-white/[0.08] font-mono text-xs space-y-3">
                <div className="flex items-center justify-between border-b border-white/[0.06] pb-2 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-red-500" />
                    <span className="text-white font-bold">1-e-1 Özel Ders Bağlantısı Aktif</span>
                  </div>
                  <span className="text-slate-300">Gökçe Hoca • 11. Sınıf AYT Fizik</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="border-l-2 border-amber-400/60 pl-3 py-1">
                    <div className="text-amber-300 font-bold mb-1">Öğrencinin Çözüm Hamlesi:</div>
                    <div className="text-slate-200">F = m × a formülünde sürtünme kuvvetini (k·N) hesaba katmayı unuttu.</div>
                  </div>
                  <div className="border-l-2 border-emerald-400/60 pl-3 py-1">
                    <div className="text-emerald-300 font-bold mb-1">Öğretmenin Anlık Müdahalesi:</div>
                    <div className="text-slate-200">"Formül doğru, ancak yatay zeminde sürtünme katsayısı 0.2 verilmiş. Serbest cisim diyagramını çizelim."</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-white/[0.06] flex items-center justify-between text-xs text-slate-200">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                Öğrenci kamerası isteğe bağlıdır, tahta paylaşımı esastır
              </span>
              <Link href="/hesap-turu" className="text-amber-300 font-bold hover:underline">
                Deneme Dersi Al →
              </Link>
            </div>
          </div>

          {/* Bento Kart 3: Kredi Asla Yanmaz */}
          <div id="kredi-sistemi" className="bg-[#0B101D] rounded-2xl border border-white/[0.1] p-6 flex flex-col justify-between hover:border-emerald-400/40 transition-colors lg:col-span-2">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-xl bg-emerald-400/10 border border-emerald-400/20 text-emerald-300 flex items-center justify-center">
                  <Zap className="w-5 h-5" />
                </div>
                <span className="text-xs font-mono font-bold px-3 py-1.5 rounded bg-amber-400/10 border border-amber-400/20 text-amber-300">
                  Şeffaf Bakiye Modeli
                </span>
              </div>

              <h3 className="text-lg font-bold text-white mb-1.5">
                Abonelik Tuzağı Yok. Krediniz Asla Yanmaz.
              </h3>
              <p className="text-xs text-slate-200 leading-relaxed mb-4 [text-wrap:pretty]">
                Geleneksel kursların "ay sonunda silinen hak" modelini reddediyoruz. Aldığınız ders kredisini sene sonuna kadar dilediğiniz zaman, istediğiniz branş hocasında harcayın.
              </p>

              {/* Kredi Hesaplayıcı Flat */}
              <div className="py-4 border-y border-white/[0.08] space-y-4">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-200 font-mono">Ders Paketi Seçin:</span>
                  <div className="flex gap-2">
                    {[1, 5, 10, 20].map((pkg) => (
                      <button
                        key={pkg}
                        onClick={() => setCreditPacks(pkg)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold font-mono transition-all ${
                          creditPacks === pkg
                            ? 'bg-emerald-400 text-slate-950'
                            : 'bg-white/10 text-white hover:bg-white/20'
                        }`}
                      >
                        {pkg} Ders
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3 pt-2 text-center text-xs">
                  <div>
                    <div className="text-slate-300 text-xs">Geçerlilik</div>
                    <div className="font-bold text-white text-base mt-0.5">Süresiz</div>
                  </div>
                  <div>
                    <div className="text-slate-300 text-xs">Öğretmen Değişimi</div>
                    <div className="font-bold text-emerald-400 text-base mt-0.5">Sınırsız</div>
                  </div>
                  <div>
                    <div className="text-slate-300 text-xs">Memnuniyet Güvencesi</div>
                    <div className="font-bold text-amber-300 text-base mt-0.5">%100 İade</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-white/[0.06] text-xs text-slate-300">
              * Kredilerinizi matematik, fizik veya edebiyat fark etmeksizin tüm branşlarda ortak kullanabilirsiniz.
            </div>
          </div>

          {/* Bento Kart 4: Veli Takip Raporu */}
          <div id="veli-raporu" className="bg-[#0B101D] rounded-2xl border border-white/[0.1] p-6 flex flex-col justify-between hover:border-amber-400/40 transition-colors">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <FileCheck2 className="w-5 h-5 text-amber-400 shrink-0" />
                <h3 className="text-lg font-bold text-white">
                  Veliye Şeffaf Ders Sonu Raporu
                </h3>
              </div>
              <p className="text-xs text-slate-200 leading-relaxed mb-4 [text-wrap:pretty]">
                "Bugün ne öğrendiniz?" belirsizliğine son. Her ders bittiğinde öğretmeninizin sisteme girdiği somut kazanım karnesi veli paneline anında düşer.
              </p>

              {/* Rapor Örneği Flat */}
              <div className="py-3 px-3.5 border-y border-white/[0.08] space-y-2 text-xs">
                <div className="flex items-center justify-between text-xs font-mono text-amber-300 border-b border-white/[0.06] pb-1.5">
                  <span>Ders Raporu #1842</span>
                  <span>Bugün 17:45</span>
                </div>
                <div className="space-y-1.5 text-slate-200">
                  <div className="flex items-center gap-1.5 text-xs">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    <span>Çözülen Yeni Nesil Soru: <strong>16 adet</strong></span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    <span>Kazanım: <strong>Parabol & Tepe Noktası (%90 Başarı)</strong></span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs">
                    <span className="w-1.5 h-1.5 rounded-full bg-sky-400" />
                    <span>Ödev: <strong>ÖSYM 2023 benzeri 20 test sorusu</strong></span>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-white/[0.06] text-xs text-slate-300">
              Veli dilerse ders kaydını ve ödev takibini telefonundan 7/24 izleyebilir.
            </div>
          </div>

        </div>
      </section>

      {/* ── 5. TÜM STAR EĞİTMEN KADROSU ROSTER ── */}
      <section id="kadro" className="max-w-7xl mx-auto px-4 sm:px-6 py-16 border-t border-white/[0.08]">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12">
          <div>
            <div className="text-xs font-mono font-bold text-amber-300 uppercase tracking-wider mb-2">
              Özenle Seçilmiş Branş Uzmanları
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight [text-wrap:balance]">
              Her Başvuran Değil, Zümre Başkanı Düzeyinde Hocalardan Eğitim Alın.
            </h2>
          </div>
          <p className="text-slate-300 text-sm max-w-md mt-4 sm:mt-0 [text-wrap:pretty]">
            Öğretmenlerimizin tamamı diploma doğrulaması, adli sicil kontrolü ve canlı ders mülakatından tam not alarak DersoLab kadrosuna katılmıştır.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {REAL_INSTRUCTORS.map((teacher) => (
            <div
              key={teacher.id}
              className="bg-[#0B101D] rounded-2xl border border-white/[0.1] p-5 flex flex-col justify-between hover:border-amber-400/50 transition-colors group"
            >
              <div>
                <div className="relative w-full h-48 rounded-xl overflow-hidden mb-4 bg-slate-800">
                  <img
                    src={teacher.avatar}
                    alt={teacher.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-2.5 right-2.5 bg-slate-900/95 backdrop-blur-md px-3 py-1.5 rounded text-xs font-bold text-amber-300 border border-white/[0.15] flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <span>{teacher.rating}</span>
                  </div>
                </div>

                <div className="text-xs font-mono text-amber-400 font-bold mb-1">{teacher.exp}</div>
                <h3 className="text-lg font-bold text-white mb-0.5">{teacher.name}</h3>
                <p className="text-xs text-slate-300 mb-3">{teacher.title}</p>

                <div className="flex flex-wrap gap-1.5 mb-4">
                  {teacher.tags.map((t, ti) => (
                    <span
                      key={ti}
                      className="text-xs px-3 py-1.5 rounded bg-white/[0.05] text-slate-200 border border-white/[0.08]"
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
                <span className="text-slate-300 font-mono">{teacher.reviewCount} Ders</span>
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

      {/* ── 6. SSS & GÜVENCE BANDI (Side-by-side header) ── */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-16 border-t border-white/[0.08]">
        <div className="bg-[#0B101D] rounded-3xl border border-white/[0.15] p-8 sm:p-12 text-center space-y-6 shadow-xl">
          <div className="flex items-center justify-center gap-3">
            <ShieldCheck className="w-8 h-8 text-amber-400 shrink-0" />
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight [text-wrap:balance]">
              İlk Dersinizde %100 Memnuniyet veya Tam İade Güvencesi
            </h2>
          </div>

          <p className="text-slate-200 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed [text-wrap:pretty]">
            Öğretmeninizle ilk 20 dakika içinde kimyanızın uyuşmadığını hissederseniz, dersi anında sonlandırabilir ve harcadığınız krediyi hiçbir kesinti olmadan geri alabilirsiniz.
          </p>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/hesap-turu"
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-sm transition-all shadow-lg flex items-center justify-center gap-2"
            >
              <span>Ücretsiz Tanışma Görüşmesi Planla</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── 7. TASARIM LABORATUVARI YÜZEN ÇUBUK ── */}
      <DesignLabSwitcher />
    </div>
  )
}
