'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import {
  Sparkles,
  Target,
  Brain,
  Video,
  ArrowRight,
  CheckCircle2,
  Calculator,
  ChevronDown,
  FlaskConical,
  GraduationCap
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface StudentLandingViewProps {
  examFilter: 'all' | 'lgs' | 'yks'
  onExamFilterChange: (filter: 'all' | 'lgs' | 'yks') => void
}

// Supabase veritabanındaki gerçek eğitmen ve üniversite bilgileri
const FEATURED_INSTRUCTORS = [
  {
    id: '9397685d-4845-4557-aefe-652b86827117',
    name: 'Gökçe Lale',
    subject: 'Fizik',
    education: 'Atatürk Üniversitesi · Fizik Bölümü',
    avatar: 'https://nkqifjcyudvwfaehgtgp.supabase.co/storage/v1/object/public/avatars/9397685d-4845-4557-aefe-652b86827117/avatar.jpg',
    badge: '19 Yıl Deneyim',
    note: '9, 10, 11. sınıflarla okula destek; 12. sınıf ve mezun öğrencilerle YKS hazırlıkta soru çözüm püf noktaları ve disiplinli takip.'
  },
  {
    id: 'd96a9da2-0057-4c2e-9d74-91c07a5ea9ee',
    name: 'Selva Şahin',
    subject: 'Türk Dili ve Edebiyatı · Türkçe · Koçluk',
    education: 'Marmara Üniversitesi · Türk Dili ve Edebiyatı',
    avatar: 'https://nkqifjcyudvwfaehgtgp.supabase.co/storage/v1/object/public/avatars/d96a9da2-0057-4c2e-9d74-91c07a5ea9ee/avatar.jpeg',
    badge: 'Türkçe & Koçluk',
    note: 'LGS ve YKS Türkçe, paragraf stratejileri, Türk Dili ve Edebiyatı destek dersleri ve bire bir sınav koçluğu.'
  },
  {
    id: '437c3905-8dc0-4172-b21c-6f3182f5a4d4',
    name: 'Egemen Işık',
    subject: 'Kimya · Fen Bilimleri · Koçluk',
    education: 'İstanbul Üniversitesi · Kimya',
    avatar: 'https://nkqifjcyudvwfaehgtgp.supabase.co/storage/v1/object/public/avatars/437c3905-8dc0-4172-b21c-6f3182f5a4d4/avatar.jpg',
    badge: 'Kimya & Fen',
    note: 'TYT-AYT Kimya, LGS Fen Bilimleri ve sınav koçluğunda kavram temelli, ezberden uzak bire bir canlı dersler.'
  },
  {
    id: '585a1432-8599-4ed0-bb27-e91ff59429ab',
    name: 'Beyza Eralp',
    subject: 'Lise & Ortaokul Matematik · Geometri',
    education: 'Medipol Üniversitesi · Matematik Öğretmenliği',
    avatar: 'https://nkqifjcyudvwfaehgtgp.supabase.co/storage/v1/object/public/avatars/585a1432-8599-4ed0-bb27-e91ff59429ab/avatar.jpeg',
    badge: 'Matematik & Geometri',
    note: 'Ortaokul LGS ve Lise YKS Matematik-Geometri konularında temel eksikleri kapatan adım adım soru çözüm seansları.'
  }
]

// Supabase veritabanındaki gerçek aktif kredi paketleri
const REAL_PACKAGES = [
  {
    title: 'Tanışma Dersi',
    badge: '🎁 İlk Adım',
    price: '0 ₺',
    sub: 'Kredi kartı gerekmez',
    credits: '1 Tanışma Seansı',
    desc: 'Eğitmenle tanışın, eksik konularınızı belirleyin ve kişisel çalışma planınızı oluşturun.',
    href: '/demo-ders',
    cta: 'Ücretsiz Dersi Başlat →',
    highlight: 'emerald'
  },
  {
    title: 'Tek Ders Paketi',
    badge: 'Esnek Başlangıç',
    price: '1.000 ₺',
    sub: '1 ders kredisi (40 dk)',
    credits: '1 Ders Kredisi',
    desc: 'İhtiyaç duyduğunuz tek bir konu veya sınav öncesi soru çözümü için taahhütsüz tekil ders.',
    href: '/register?role=student&redirect=%2Fdashboard%2Fstudent%2Fpackages',
    cta: 'Paketi Seç →',
    highlight: 'slate'
  },
  {
    title: '5+1 Ders Paketi',
    badge: '⭐ En Çok Tercih Edilen',
    price: '5.000 ₺',
    sub: '5 al 1 hediye · Ders başı ~833 ₺',
    credits: 'Toplam 6 Ders Kredisi',
    desc: '5 ders kredisi alana 1 ders kredisi hediye. Tüm branşlarda ve koçlukta dönem boyu geçerli.',
    href: '/register?role=student&redirect=%2Fdashboard%2Fstudent%2Fpackages',
    cta: '5+1 Paketi Seç →',
    highlight: 'amber'
  },
  {
    title: '10+2 Ders Paketi',
    badge: '🚀 Avantajlı Paket',
    price: '10.000 ₺',
    sub: '10 al 2 hediye · Toplam 12 ders',
    credits: 'Toplam 12 Ders Kredisi',
    desc: '10 ders kredisi alana 2 ders kredisi hediye. Düzenli konu takibi ve çoklu branş çalışması için ideal.',
    href: '/register?role=student&redirect=%2Fdashboard%2Fstudent%2Fpackages',
    cta: '10+2 Paketi Seç →',
    highlight: 'indigo'
  }
]

const FAQ_ITEMS = [
  {
    q: 'Ücretsiz tanışma dersi gerçekten tamamen ücretsiz mi?',
    a: 'Evet. Kayıt olduktan sonra hiçbir kredi kartı bilgisi girmeden ücretsiz tanışma dersi talep edebilirsiniz. Bu seansta eğitmenimizle tanışır, eksik konularınızı belirler ve çalışma planınızı oluşturursunuz.'
  },
  {
    q: 'Satın aldığım ders kredileri ay sonunda yanar mı? Aylık abonelik var mı?',
    a: 'Hayır, DersoLab’da kartınızdan her ay otomatik çekilen zorunlu abonelik yoktur. Satın aldığınız ders kredileri ay sonunda silinmez; eğitim dönemi boyunca (en az 12 ay) hesabınızda kalır ve dilediğiniz zaman kullanabilirsiniz.'
  },
  {
    q: 'Aldığım kredileri farklı branşlarda veya farklı eğitmenlerde kullanabilir miyim?',
    a: 'Kesinlikle. Kredileriniz tek bir öğretmene veya derse kilitli değildir. Örneğin 5+1 paketindeki 6 kredinin bir kısmını Matematik, bir kısmını Fizik veya Koçluk seansı için kullanabilirsiniz.'
  },
  {
    q: 'Planlanan bir dersi iptal etmem gerekirse kredim yanar mı?',
    a: 'Dersin başlangıç saatine en az 24 saat kala yapılan tüm iptallerde krediniz kesintisiz ve otomatik olarak hesabınıza iade edilir. Dilediğiniz başka bir gün için yeniden ders planlayabilirsiniz.'
  },
  {
    q: 'Kullanılmamış kredi paketini iade edebilir miyim?',
    a: 'Evet. Mesafeli satış mevzuatı kapsamında, satın alma tarihinden itibaren 14 gün içinde kullanılmamış kredi paketleriniz için koşulsuz cayma ve tam iade hakkınız mevcuttur.'
  }
]

export function StudentLandingView({
  examFilter,
  onExamFilterChange,
}: StudentLandingViewProps) {
  const [email, setEmail] = useState('')
  const [openFaq, setOpenFaq] = useState<number | null>(0)

  return (
    <div className="space-y-20 sm:space-y-28 py-2 sm:py-8 px-2 sm:px-6 bg-black min-h-screen selection:bg-indigo-500/30 font-sans overflow-hidden">
      
      {/* ── 1. PREMIUM SPOTLIGHT HERO ── */}
      <section className="relative w-full max-w-[90rem] mx-auto min-h-0 sm:min-h-[82vh] flex flex-col items-center justify-center rounded-[2rem] sm:rounded-[4rem] overflow-hidden border border-white/[0.06] bg-[#030712] shadow-2xl px-4 py-7 sm:py-16">
        
        {/* Animated Background Mesh & Orbs */}
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff08_1px,transparent_1px)] [background-size:16px_16px] opacity-40 mix-blend-overlay" />
        <div className="absolute top-0 left-1/4 w-[40vw] h-[40vw] max-w-[600px] max-h-[600px] bg-indigo-600/30 rounded-full blur-[120px] mix-blend-screen animate-pulse" style={{ animationDuration: '8s' }} />
        <div className="absolute bottom-0 right-1/4 w-[30vw] h-[30vw] max-w-[500px] max-h-[500px] bg-rose-600/20 rounded-full blur-[100px] mix-blend-screen animate-pulse" style={{ animationDuration: '10s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[20vw] h-[20vw] max-w-[400px] max-h-[400px] bg-amber-500/10 rounded-full blur-[120px] mix-blend-screen" />
        
        {/* Ambient Grid overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_70%,transparent_100%)]" />

        <div className="relative z-10 flex flex-col items-center text-center w-full max-w-5xl mx-auto">
          
          {/* Premium Logo */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="mb-3 sm:mb-6 flex items-center justify-center gap-2.5 sm:gap-3"
          >
            <Image 
              src="/dersolab-mark.svg" 
              alt="DersoLab" 
              width={36}
              height={36}
              priority
              unoptimized
              className="object-contain drop-shadow-md w-8 h-8 sm:w-10 sm:h-10" 
            />
            <span className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Derso<span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-rose-400">Lab</span>
            </span>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-3.5 sm:px-5 py-1.5 sm:py-2 rounded-full bg-white/[0.03] border border-white/[0.08] backdrop-blur-md mb-4 sm:mb-8 shadow-[0_0_20px_rgba(255,255,255,0.02)]"
          >
            <span className="relative flex h-2 w-2 sm:h-2.5 sm:w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 sm:h-2.5 sm:w-2.5 bg-amber-500"></span>
            </span>
            <span className="text-slate-300 text-[11px] sm:text-xs font-semibold uppercase tracking-[0.14em] sm:tracking-[0.18em]">
              LGS &amp; YKS Bire Bir Online Özel Ders ve Koçluk
            </span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-4xl sm:text-7xl lg:text-8xl font-black text-white tracking-tighter leading-[1.06] mb-3.5 sm:mb-6"
          >
            Sınava Hazırlıkta <br />
            <span className="relative inline-block mt-1 sm:mt-2">
              <span className="absolute -inset-2 blur-2xl bg-gradient-to-r from-indigo-500 via-purple-500 to-rose-500 opacity-30 mix-blend-screen"></span>
              <span className="relative text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-slate-400">
                Sınırları Kaldır
              </span>
            </span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.25 }}
            className="text-sm sm:text-xl text-slate-300 max-w-2xl font-light mb-5 sm:mb-8 leading-relaxed"
          >
            Zorunlu aylık abonelik yok, yanmayan ders kredisi var. Onaylı uzman eğitmenlerle bire bir canlı ders al, ilk tanışma dersin tamamen ücretsiz.
          </motion.p>

          {/* Above-the-fold Primary Action Buttons (Instagram / TikTok Mobile First!) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.45, delay: 0.2 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full max-w-xl mb-5 sm:mb-8 z-20"
          >
            <Link
              href="/demo-ders"
              className="w-full sm:w-auto flex-1 px-6 py-4 rounded-2xl bg-gradient-to-r from-amber-400 via-orange-400 to-orange-500 hover:from-amber-300 hover:to-orange-400 text-slate-950 font-black text-sm sm:text-base shadow-[0_0_30px_rgba(251,146,60,0.45)] transition-all flex items-center justify-center gap-2"
            >
              <span>Ücretsiz Tanışma Dersi Al</span>
              <ArrowRight className="w-4 h-4 shrink-0" />
            </Link>
            <Link
              href="/instructors"
              className="w-full sm:w-auto px-6 py-4 rounded-2xl bg-white/[0.06] hover:bg-white/[0.12] border border-white/15 text-white font-bold text-sm sm:text-base transition-all flex items-center justify-center gap-2"
            >
              <span>Eğitmenleri Gör</span>
            </Link>
          </motion.div>

          {/* 3 Net Vaat Rozeti */}
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-6 sm:mb-8 text-[11px] sm:text-sm font-semibold text-slate-300">
            <span className="px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-300 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-400" /> İlk Tanışma Dersi Ücretsiz
            </span>
            <span className="px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full bg-amber-500/10 border border-amber-500/25 text-amber-300 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400" /> Aylık Abonelik Yok · Krediler Yanmaz
            </span>
            <span className="px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/25 text-indigo-300 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-indigo-400" /> %100 Eğitmen Değişim Garantisi
            </span>
          </div>

          {/* Marketing CTA - Quick Account Creation */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.35 }}
            className="w-full max-w-2xl relative group z-20"
          >
            <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-amber-500 rounded-3xl blur-md opacity-20 group-hover:opacity-60 transition duration-1000 group-hover:duration-500" />
            <div className="relative flex flex-col sm:flex-row items-center bg-[#0a0a0a]/85 backdrop-blur-2xl border border-white/10 hover:border-white/20 rounded-3xl p-2 sm:p-3 shadow-2xl transition-all duration-500">
              <input 
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="E-posta adresin..."
                className="w-full bg-transparent border-none outline-none text-white text-base sm:text-xl px-4 py-3 placeholder-slate-500 font-light"
              />
              <Link 
                href={email.trim() ? `/register?email=${encodeURIComponent(email.trim())}&role=student` : '/register?role=student'} 
                className="w-full sm:w-auto shrink-0 group/btn relative overflow-hidden rounded-2xl bg-white text-black px-7 py-3.5 font-bold text-sm sm:text-base tracking-wide transition-transform hover:scale-[0.98] active:scale-95 flex justify-center items-center"
              >
                <span className="relative z-10 flex items-center gap-2">
                  Ücretsiz Hesap Aç <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                </span>
              </Link>
            </div>
            <p className="text-slate-400 text-xs sm:text-sm mt-3 text-center">
              Kart bilgisi gerekmez · Hesap açmadan da <Link href="/demo-ders" className="text-amber-400 font-semibold hover:underline">tanışma dersi talep edebilirsin</Link>.
            </p>
          </motion.div>

          {/* Hızlı Erişim Butonları */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="flex flex-wrap items-center justify-center gap-3 mt-8"
          >
            <Link
              href="/hesaplama"
              className="px-6 py-3.5 rounded-2xl bg-cyan-500/10 border border-cyan-500/25 hover:bg-cyan-500/20 text-sm text-cyan-300 font-bold transition-all flex items-center gap-2"
            >
              <Calculator className="w-4 h-4" />
              <span>LGS &amp; YKS Net Simülatörü (Ücretsiz)</span>
            </Link>
            <Link
              href="/lab"
              className="px-6 py-3.5 rounded-2xl bg-indigo-500/10 border border-indigo-500/25 hover:bg-indigo-500/20 text-sm text-indigo-300 font-bold transition-all flex items-center gap-2"
            >
              <FlaskConical className="w-4 h-4" />
              <span>DersoLab L.A.B. Atölyeleri</span>
            </Link>
            <Link
              href="/login"
              className="px-6 py-3.5 rounded-2xl bg-white/[0.03] border border-white/[0.1] hover:bg-white/[0.08] text-sm text-white font-semibold transition-all"
            >
              Giriş Yap
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ── 2. PREMIUM BENTO GRID (4 Temel Araç — Doğru ve Şeffaf İfadelerle) ── */}
      <section className="max-w-[90rem] mx-auto">
        <div className="flex flex-col items-center mb-14 text-center">
          <h2 className="text-4xl sm:text-5xl font-black text-white tracking-tight mb-4">
            Senin İçin <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">Tasarlanmış</span> Araçlar
          </h2>
          <p className="text-slate-400 max-w-2xl font-light text-base sm:text-lg">
            Tek yönlü hazır videolarda kaybolma. Bire bir canlı dersler, sınav koçluğu, hedef simülatörü ve yapay zekâ destekli soru analiziyle eksiklerini nokta atışı kapat.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 auto-rows-[minmax(300px,auto)]">
          
          {/* Card 1: 1:1 Canlı Ders */}
          <div className="p-8 sm:p-10 rounded-[2.5rem] bg-[#0c0c0c] border border-white/[0.08] hover:border-indigo-500/30 transition-colors duration-500 relative overflow-hidden group flex flex-col justify-between">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            <div className="absolute -right-20 -bottom-20 w-[400px] h-[400px] bg-indigo-500/10 rounded-full blur-[80px] group-hover:bg-indigo-500/20 transition-all duration-700" />
            
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-8">
                <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20 group-hover:scale-110 transition-all duration-500">
                  <Video className="w-6 h-6 text-indigo-400" />
                </div>
                <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.05] border border-white/[0.1]">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest hidden sm:inline">Canlı Ders Altyapısı</span>
                  <span className="text-xs font-semibold text-white">Google Meet ile</span>
                </div>
              </div>
              
              <h3 className="text-2xl font-bold text-white mb-3 tracking-tight leading-tight">
                Bire Bir Canlı Özel Dersler
              </h3>
              <p className="text-slate-400 font-light leading-relaxed mb-6">
                Onaylı eğitmenlerin müsaitlik takvimini gör, Google Meet entegrasyonuyla ekstra program kurmadan 40 dakikalık bire bir derse tek tıkla bağlan.
              </p>
            </div>

            <div className="relative z-10 pt-2">
              <Link
                href="/demo-ders"
                className="inline-flex items-center gap-2 text-sm font-bold text-indigo-400 hover:text-indigo-300 transition-colors"
              >
                <span>Ücretsiz Tanışma Dersini Planla</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Card 2: Koçluk */}
          <div className="p-8 sm:p-10 rounded-[2.5rem] bg-[#0c0c0c] border border-white/[0.08] hover:border-emerald-500/30 transition-colors duration-500 relative overflow-hidden group flex flex-col justify-between">
            <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-8">
                <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 group-hover:-translate-y-1 transition-transform duration-500">
                  <Brain className="w-6 h-6 text-emerald-400" />
                </div>
                <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs font-semibold text-emerald-300">
                  Haftalık Plan &amp; Takip
                </span>
              </div>
              <h3 className="text-2xl font-bold text-white mb-3 tracking-tight leading-tight">
                Hedef Odaklı Kişisel Koçluk
              </h3>
              <p className="text-slate-400 font-light leading-relaxed mb-6">
                Çalışma alışkanlıklarını analiz et, haftalık ders çalışma programını koçunla birlikte oluştur ve deneme netlerindeki gelişimi adım adım takip et.
              </p>
            </div>

            <div className="relative z-10 pt-2">
              <Link
                href="/register?role=student"
                className="inline-flex items-center gap-2 text-sm font-bold text-emerald-400 hover:text-emerald-300 transition-colors"
              >
                <span>Koçluk Desteğine Başla</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Card 3: Simülatör (Herkese Açık!) */}
          <div className="p-8 sm:p-10 rounded-[2.5rem] bg-[#0c0c0c] border border-white/[0.08] hover:border-rose-500/30 transition-colors duration-500 relative overflow-hidden group flex flex-col justify-between">
            <div className="absolute inset-0 bg-gradient-to-tr from-rose-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-8">
                <div className="w-14 h-14 rounded-2xl bg-rose-500/10 flex items-center justify-center border border-rose-500/20 group-hover:scale-110 transition-transform duration-500">
                  <Target className="w-6 h-6 text-rose-400" />
                </div>
                <span className="px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-xs font-semibold text-rose-300">
                  Üyeliksiz &amp; Ücretsiz Araç
                </span>
              </div>
              <h3 className="text-2xl font-bold text-white mb-3 leading-tight">
                Hedef Lise ve Üniversite Simülatörü
              </h3>
              <p className="text-slate-400 font-light leading-relaxed mb-6">
                Hayalindeki fen lisesine veya üniversite bölümüne girmek için hangi dersten kaç net yapman gerektiğini giriş yapmadan hemen hesapla.
              </p>
            </div>

            <div className="relative z-10 pt-2">
              <Link
                href="/hesaplama"
                className="inline-flex items-center gap-2 text-sm font-bold text-rose-400 hover:text-rose-300 transition-colors"
              >
                <span>Simülatörü Şimdi Aç (Kayıt Gerekmez)</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Card 4: AI Asistan (Düzeltilmiş Gemini İfadesi) */}
          <div className="p-8 sm:p-10 rounded-[2.5rem] bg-[#0c0c0c] border border-white/[0.08] hover:border-[#4285F4]/30 transition-colors duration-500 relative overflow-hidden group flex flex-col justify-between">
            <div className="absolute inset-0 bg-gradient-to-br from-[#4285F4]/10 via-[#9b72cb]/5 to-[#d96570]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-8">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#4285F4]/20 to-[#9b72cb]/20 flex items-center justify-center border border-white/10 group-hover:rotate-6 transition-transform duration-500">
                  <Sparkles className="w-6 h-6 text-[#9b72cb]" />
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/[0.05] border border-white/10 backdrop-blur-md">
                  <span className="text-xs font-bold text-slate-200">Gemini Destekli</span>
                </div>
              </div>
              
              <h3 className="text-2xl font-bold text-white mb-3 tracking-tight leading-tight">
                Yapay Zekâ Destekli Soru Çözüm Asistanı ve L.A.B.
              </h3>
              <p className="text-slate-400 font-light leading-relaxed mb-6">
                Ders dışında takıldığın soruların fotoğrafını yükle; Gemini destekli çalışma asistanımız çözüm adımlarını açıklasın, 3D L.A.B. simülasyonlarıyla konuyu somutlaştır.
              </p>
            </div>

            <div className="relative z-10 pt-2">
              <Link
                href="/lab"
                className="inline-flex items-center gap-2 text-sm font-bold text-sky-400 hover:text-sky-300 transition-colors"
              >
                <FlaskConical className="w-4 h-4" />
                <span>İnteraktif DersoLab L.A.B. Atölyesini Keşfet</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
          
        </div>
      </section>

      {/* ── 3. NASIL ÇALIŞIR? (3 Net Adım) ── */}
      <section className="max-w-[90rem] mx-auto">
        <div className="flex flex-col items-center mb-14 text-center">
          <span className="px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-bold uppercase tracking-widest mb-4">
            3 Adımda Kolay Başlangıç
          </span>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight mb-4">
            DersoLab Nasıl Çalışır?
          </h2>
          <p className="text-slate-400 max-w-2xl font-light text-base sm:text-lg">
            Karmaşık sözleşmeler veya taahhütler olmadan dakikalar içinde ilk dersini planla.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-8 rounded-[2rem] bg-[#0c0c0c] border border-white/[0.08] relative overflow-hidden">
            <div className="text-5xl font-black text-white/[0.07] font-mono mb-4">01</div>
            <h3 className="text-xl font-bold text-white mb-3">Ücretsiz Tanışma Dersini Al</h3>
            <p className="text-slate-400 font-light text-sm sm:text-base leading-relaxed">
              Kredi kartı bilgisi girmeden hesabını aç, branşına uygun eğitmeni seç ve ücretsiz tanışma seansında seviyeni analiz et.
            </p>
          </div>

          <div className="p-8 rounded-[2rem] bg-[#0c0c0c] border border-white/[0.08] relative overflow-hidden">
            <div className="text-5xl font-black text-amber-500/20 font-mono mb-4">02</div>
            <h3 className="text-xl font-bold text-white mb-3">Yanmayan Kredi Paketini Seç</h3>
            <p className="text-slate-400 font-light text-sm sm:text-base leading-relaxed">
              Aylık otomatik çekilen abonelik yok. İhtiyacın kadar ders kredisi al; kredilerin dönem sonuna kadar silinmesin ve tüm branşlarda geçerli olsun.
            </p>
          </div>

          <div className="p-8 rounded-[2rem] bg-[#0c0c0c] border border-white/[0.08] relative overflow-hidden">
            <div className="text-5xl font-black text-emerald-500/20 font-mono mb-4">03</div>
            <h3 className="text-xl font-bold text-white mb-3">Canlı Derse Katıl &amp; Netlerini Artır</h3>
            <p className="text-slate-400 font-light text-sm sm:text-base leading-relaxed">
              Google Meet üzerinden bire bir dersine katıl, ödevlerini tamamla. Deneme analizleri ve koçluk takibiyle hedefine adım adım ilerle.
            </p>
          </div>
        </div>
      </section>

      {/* ── 4. ONAYLI EĞİTMEN VİTRİNİ (Gerçek Eğitmen ve Üniversite Bilgileriyle) ── */}
      <section className="max-w-[90rem] mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <span className="px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold uppercase tracking-widest inline-block mb-4">
              Onaylı Akademik Kadro
            </span>
            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
              Uzman Eğitmenlerimizle Tanışın
            </h2>
            <p className="text-slate-400 max-w-2xl font-light mt-3 text-base sm:text-lg">
              Platformumuzdaki her eğitmen diploma, branş hakimiyeti ve pedagojik iletişim onayıyla seçilir.
            </p>
          </div>
          <Link
            href="/instructors"
            className="shrink-0 inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-white text-black font-bold text-sm hover:bg-slate-200 transition-colors"
          >
            <span>Tüm Eğitmenleri Gör</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {FEATURED_INSTRUCTORS.map((inst) => (
            <div
              key={inst.id}
              className="p-6 rounded-[2rem] bg-[#0c0c0c] border border-white/[0.08] hover:border-white/20 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-4 mb-4">
                  <img
                    src={inst.avatar}
                    alt={inst.name}
                    className="w-16 h-16 rounded-2xl object-cover border border-white/10 shrink-0"
                  />
                  <div className="min-w-0">
                    <span className="inline-block px-2.5 py-0.5 rounded-full bg-indigo-500/15 text-indigo-300 text-[10px] font-bold uppercase tracking-wider mb-1">
                      {inst.badge}
                    </span>
                    <h3 className="text-lg font-bold text-white leading-snug truncate">{inst.name}</h3>
                    <p className="text-xs text-amber-400 font-semibold truncate">{inst.subject}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-slate-300 font-medium mb-3 bg-white/[0.03] px-3 py-1.5 rounded-xl border border-white/[0.06]">
                  <GraduationCap className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                  <span className="truncate">{inst.education}</span>
                </div>
                <p className="text-sm text-slate-400 font-light leading-relaxed mb-6">
                  {inst.note}
                </p>
              </div>

              <Link
                href={`/demo-ders?subject=${encodeURIComponent(inst.subject)}`}
                className="w-full py-3 rounded-xl bg-white/[0.04] hover:bg-white/[0.09] border border-white/[0.08] text-center text-xs font-bold text-white transition-colors"
              >
                Ücretsiz Tanışma Dersi Al →
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* ── 5. ŞEFFAF KREDİ PAKETLERİ VE FİYATLAR (Kayıt Öncesi Tam Görünürlük) ── */}
      <section className="max-w-[90rem] mx-auto">
        <div className="flex flex-col items-center text-center mb-12">
          <span className="px-4 py-1.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-bold uppercase tracking-widest mb-4">
            Şeffaf Paketler &amp; Yanmayan Kredi
          </span>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight mb-4">
            Zorunlu Abonelik Yok. Kredilerin Yanmaz.
          </h2>
          <p className="text-slate-400 max-w-2xl font-light text-base sm:text-lg">
            1 ders kredisi 40 dakikalık bire bir canlı derse karşılık gelir. Aldığın kredileri tüm branşlarda ve koçluk seanslarında dönem sonuna kadar kullanabilirsin.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {REAL_PACKAGES.map((pkg) => {
            const isAmber = pkg.highlight === 'amber'
            const isEmerald = pkg.highlight === 'emerald'
            return (
              <div
                key={pkg.title}
                className={`p-7 rounded-[2rem] bg-[#0c0c0c] border flex flex-col justify-between transition-all ${
                  isAmber
                    ? 'border-amber-500/40 shadow-[0_0_30px_rgba(245,158,11,0.1)]'
                    : isEmerald
                    ? 'border-emerald-500/30'
                    : 'border-white/[0.08]'
                }`}
              >
                <div>
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
                      isAmber
                        ? 'bg-amber-500/15 text-amber-300'
                        : isEmerald
                        ? 'bg-emerald-500/15 text-emerald-300'
                        : 'bg-white/[0.06] text-slate-300'
                    }`}
                  >
                    {pkg.badge}
                  </span>
                  <h3 className="text-2xl font-black text-white mt-4">{pkg.title}</h3>
                  <div className="mt-3 flex items-baseline gap-2">
                    <span className="text-3xl sm:text-4xl font-black text-white whitespace-nowrap shrink-0">
                      {pkg.price}
                    </span>
                  </div>
                  <p className="text-xs font-semibold text-amber-400 mt-1">{pkg.sub}</p>
                  <div className="mt-4 pt-4 border-t border-white/[0.06]">
                    <p className="text-xs font-bold text-emerald-400 mb-2">✓ {pkg.credits}</p>
                    <p className="text-sm text-slate-400 font-light leading-relaxed">{pkg.desc}</p>
                  </div>
                </div>

                <Link
                  href={pkg.href}
                  className={`mt-6 w-full py-3.5 rounded-xl font-bold text-sm text-center transition-colors ${
                    isAmber
                      ? 'bg-amber-400 hover:bg-amber-300 text-slate-950'
                      : isEmerald
                      ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950'
                      : 'bg-white hover:bg-slate-200 text-slate-950'
                  }`}
                >
                  {pkg.cta}
                </Link>
              </div>
            )
          })}
        </div>
      </section>

      {/* ── 6. SIKÇA SORULAN SORULAR (SSS) ── */}
      <section className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <span className="px-4 py-1.5 rounded-full bg-white/[0.05] border border-white/10 text-slate-300 text-xs font-bold uppercase tracking-widest inline-block mb-4">
            Aklınıza Takılanlar
          </span>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Sıkça Sorulan Sorular
          </h2>
        </div>

        <div className="space-y-3">
          {FAQ_ITEMS.map((item, idx) => {
            const isOpen = openFaq === idx
            return (
              <div
                key={idx}
                className="rounded-2xl bg-[#0c0c0c] border border-white/[0.08] overflow-hidden"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full p-6 text-left flex items-center justify-between gap-4 hover:bg-white/[0.02] transition-colors cursor-pointer"
                >
                  <span className="font-bold text-white text-base sm:text-lg">{item.q}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-slate-400 shrink-0 transition-transform duration-300 ${
                      isOpen ? 'rotate-180 text-amber-400' : ''
                    }`}
                  />
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                    >
                      <div className="px-6 pb-6 text-sm sm:text-base text-slate-300 font-light leading-relaxed border-t border-white/[0.05] pt-4">
                        {item.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )
          })}
        </div>
      </section>

    </div>
  )
}
