'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ShieldCheck,
  Lock,
  Clock,
  TrendingUp,
  HeartHandshake,
  ArrowRight,
  CheckCircle2,
  PieChart,
  FileText
} from 'lucide-react'

interface ParentLandingViewProps {
  examFilter: 'all' | 'lgs' | 'yks'
  onExamFilterChange: (filter: 'all' | 'lgs' | 'yks') => void
}

export function ParentLandingView({ examFilter, onExamFilterChange }: ParentLandingViewProps) {
  const [demoOtp, setDemoOtp] = useState('********')
  const [isCopied, setIsCopied] = useState(false)
  const [animatedScore, setAnimatedScore] = useState(0)

  useEffect(() => {
    // Number counting animation for the mockup
    const interval = setInterval(() => {
      setAnimatedScore(prev => {
        if (prev >= 12.5) {
          clearInterval(interval)
          return 12.5
        }
        return prev + 0.5
      })
    }, 40)
    return () => clearInterval(interval)
  }, [])

  function handleCopyOtp() {
    setIsCopied(true)
    setTimeout(() => setIsCopied(false), 2000)
  }

  // Animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] } }
  }
  
  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  }

  return (
    <div className="py-12 px-4 sm:px-6 bg-[#000000] min-h-screen font-sans selection:bg-emerald-500/30 selection:text-white overflow-hidden text-slate-100">
      
      {/* ── 1. DARK FINTECH HERO ── */}
      <section className="max-w-[90rem] mx-auto min-h-[85vh] flex flex-col justify-center relative pt-12">
        {/* Subtle grid background for premium feel */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none" />
        
        {/* Deep glows */}
        <div className="absolute top-1/4 left-0 w-[500px] h-[500px] bg-emerald-600/10 rounded-full blur-[120px] pointer-events-none mix-blend-screen" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-cyan-600/10 rounded-full blur-[100px] pointer-events-none mix-blend-screen" />

        <div className="relative z-10 flex flex-col items-center text-center w-full px-4 mb-12 sm:mb-16">
          {/* Premium Logo for Parent Theme - Centered at top */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex items-center justify-center gap-3"
          >
            <Image 
              src="/fox-head.png" 
              alt="DersoLab Avatar" 
              width={48}
              height={48}
              priority
              className="w-12 h-12 sm:w-10 sm:h-10 object-contain drop-shadow-md" 
            />
            <span className="text-3xl sm:text-4xl font-black tracking-tight text-white">
              Derso<span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">Lab</span>
            </span>
          </motion.div>
        </div>

        <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-20 z-10">
          
          {/* Left: Oversized Typography Copy */}
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="flex-1 space-y-10 text-center lg:text-left"
          >
            <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/[0.03] border border-white/[0.05] shadow-sm text-emerald-400 text-xs font-bold tracking-widest uppercase backdrop-blur-md">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              Veli Kontrol Paneli
            </motion.div>

            <motion.h1 variants={fadeInUp} className="text-6xl sm:text-7xl lg:text-[5.5rem] font-black text-white tracking-tighter leading-[1.05]">
              Başarıyı <br />
              <span className="relative inline-block mt-2">
                <span className="absolute -inset-2 blur-2xl bg-emerald-500/20 mix-blend-screen"></span>
                <span className="relative text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-300">
                  Şansa Bırakmayın
                </span>
              </span>
            </motion.h1>

            <motion.p variants={fadeInUp} className="text-xl sm:text-2xl text-slate-400 max-w-2xl mx-auto lg:mx-0 font-light leading-relaxed">
              Özel ders sürecindeki belirsizliklere son. Çocuğunuzun gelişimini, ödevlerini ve net artışını kurumsal şeffaflıkla tek ekrandan takip edin.
            </motion.p>

            <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
              <Link
                href="/register"
                className="group relative px-8 py-5 rounded-2xl bg-white text-black font-semibold text-lg transition-all overflow-hidden flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95 shadow-[0_0_30px_rgba(255,255,255,0.1)] w-full sm:w-auto"
              >
                Ücretsiz Hesap Açın
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/login"
                className="px-8 py-5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold text-lg transition-all flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95 w-full sm:w-auto"
              >
                Giriş Yap
              </Link>
            </motion.div>
          </motion.div>

          {/* Right: Premium Interactive Dashboard Mockup */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, rotateY: 5 }}
            animate={{ opacity: 1, scale: 1, rotateY: 0 }}
            transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
            className="flex-1 w-full max-w-2xl relative perspective-1000"
          >
            {/* Glow behind mockup */}
            <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/20 to-cyan-500/20 rounded-[3rem] blur-3xl opacity-50" />
            
            <motion.div 
              whileHover={{ scale: 1.02, rotateX: 2, rotateY: -2 }}
              transition={{ duration: 0.5 }}
              className="relative bg-[#0c0c0c]/80 backdrop-blur-2xl border border-white/10 rounded-[2rem] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)] p-8 overflow-hidden"
            >
              
              {/* Browser/App Header */}
              <div className="flex items-center justify-between mb-8 pb-6 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <div>
                    <h3 className="font-bold text-white text-lg tracking-tight">Öğrenci</h3>
                    <p className="text-sm text-emerald-400 font-medium">8. Sınıf LGS</p>
                  </div>
                </div>
                <div className="flex gap-2 opacity-50">
                  <div className="w-2.5 h-2.5 rounded-full bg-white/20" />
                  <div className="w-2.5 h-2.5 rounded-full bg-white/20" />
                  <div className="w-2.5 h-2.5 rounded-full bg-white/20" />
                </div>
              </div>

              {/* Animated Stats */}
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/5 hover:bg-white/[0.05] transition-colors">
                  <div className="flex items-center gap-2 text-slate-400 mb-3">
                    <TrendingUp className="w-5 h-5 text-emerald-400" />
                    <span className="text-sm font-semibold uppercase tracking-wider">Net Artışı</span>
                  </div>
                  <div className="text-4xl font-black text-white tracking-tighter">
                    +{animatedScore.toFixed(1)}
                  </div>
                  
                  {/* Miniature animated chart */}
                  <div className="mt-4 flex items-end gap-1 h-8">
                    {[30, 45, 40, 60, 55, 80, 100].map((height, i) => (
                      <motion.div 
                        initial={{ height: 0 }}
                        animate={{ height: `${height}%` }}
                        transition={{ duration: 0.8, delay: 0.5 + i * 0.1, ease: "easeOut" }}
                        key={i} 
                        className="flex-1 bg-emerald-500/40 rounded-t-sm origin-bottom" 
                      />
                    ))}
                  </div>
                </div>

                <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/5 hover:bg-white/[0.05] transition-colors">
                  <div className="flex items-center gap-2 text-slate-400 mb-3">
                    <Clock className="w-5 h-5 text-cyan-400" />
                    <span className="text-sm font-semibold uppercase tracking-wider">Derse Katılım</span>
                  </div>
                  <div className="text-4xl font-black text-white tracking-tighter">
                    %100
                  </div>
                  <div className="mt-4 w-full bg-white/10 h-2 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: "100%" }}
                      transition={{ duration: 1, delay: 0.8, ease: "easeInOut" }}
                      className="h-full bg-cyan-400 rounded-full" 
                    />
                  </div>
                  <p className="text-xs text-slate-500 mt-2 font-medium">Planlanan 12 dersin tamamına katıldı.</p>
                </div>
              </div>

              {/* Teacher Note */}
              <div className="p-6 rounded-2xl bg-emerald-950/20 border border-emerald-500/20 text-white relative overflow-hidden group/note">
                <div className="absolute right-0 top-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl transform translate-x-1/2 -translate-y-1/2" />
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <FileText className="w-5 h-5 text-emerald-400" />
                      <span className="text-sm font-bold tracking-wide uppercase">Eğitmen Notu</span>
                    </div>
                    <span className="text-xs text-emerald-500/50 font-mono">Bugün 15:30</span>
                  </div>
                  <p className="text-slate-300 leading-relaxed font-light">
                    "Çarpanlar ve katlar konusunda temel eksiklikler giderildi. Öğrenci verilen ödevlerin %90'ını başarıyla tamamladı. İlerlemesi harika."
                  </p>
                </div>
              </div>
              
            </motion.div>
          </motion.div>
          
        </div>
      </section>

      {/* ── 2. SCROLL-REVEAL FEATURES ── */}
      <section className="max-w-[90rem] mx-auto py-32 mt-12">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          
          <motion.div variants={fadeInUp} className="p-8 rounded-[2rem] bg-[#0c0c0c] border border-white/5 hover:border-indigo-500/30 shadow-xl hover:-translate-y-2 transition-all duration-500 group">
            <ShieldCheck className="w-8 h-8 text-indigo-400 mb-6 group-hover:scale-110 transition-transform" />
            <h3 className="text-xl font-bold text-white mb-3">Teyitli Eğitmenler</h3>
            <p className="text-slate-400 font-light leading-relaxed">
              Çocuğunuzu kime emanet ettiğinizi bilirsiniz.
            </p>
          </motion.div>

          <motion.div variants={fadeInUp} className="p-8 rounded-[2rem] bg-[#0c0c0c] border border-white/5 hover:border-amber-500/30 shadow-xl hover:-translate-y-2 transition-all duration-500 group">
            <Lock className="w-8 h-8 text-amber-500 mb-6 group-hover:scale-110 transition-transform" />
            <h3 className="text-xl font-bold text-white mb-3">Yanmayan Kredi</h3>
            <p className="text-slate-400 font-light leading-relaxed">
              Satın aldığınız ders saatleri yıl sonuna kadar silinmez. Kullanılmayan kredileri dilediğiniz zaman, dilediğiniz branşta kullanabilirsiniz.
            </p>
          </motion.div>
          
          <motion.div variants={fadeInUp} className="p-8 rounded-[2rem] bg-[#0c0c0c] border border-white/5 hover:border-emerald-500/30 shadow-xl hover:-translate-y-2 transition-all duration-500 group">
            <HeartHandshake className="w-8 h-8 text-emerald-400 mb-6 group-hover:scale-110 transition-transform" />
            <h3 className="text-xl font-bold text-white mb-3">İlk Ders Güvencesi</h3>
            <p className="text-slate-400 font-light leading-relaxed">
              İlk seans tanışma amaçlıdır. Hiçbir ücret talep edilmez.
            </p>
          </motion.div>
          
        </motion.div>
      </section>

      {/* ── 3. OTP CONNECT (Dark Premium Card) ── */}
      <section className="max-w-[90rem] mx-auto pb-32">
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="p-12 lg:p-20 rounded-[3rem] bg-[#050505] border border-white/[0.05] text-white relative overflow-hidden group"
        >
          {/* Subtle animated background gradient */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,#10b98122,transparent_60%)]" />
          
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
            <div className="max-w-xl">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-white text-xs font-bold uppercase tracking-widest mb-6 backdrop-blur-md">
                <Lock className="w-4 h-4" /> KVKK Uyumlu
              </div>
              <h2 className="text-4xl sm:text-5xl font-black mb-6 tracking-tight">Tek Tıkla <br/><span className="text-emerald-400">Güvenli Bağlantı.</span></h2>
              <p className="text-lg text-slate-400 font-light leading-relaxed mb-8">
                Şifre paylaşmanıza gerek yok. Çocuğunuzun oluşturduğu tek kullanımlık kodu girerek hesaplarınızı güvenle eşleştirin.
              </p>
            </div>
            
            <div className="shrink-0 bg-white/[0.03] border border-white/10 p-8 rounded-[2rem] backdrop-blur-xl shadow-2xl w-full max-w-sm hover:border-emerald-500/30 transition-colors duration-500">
              <p className="text-xs text-slate-500 uppercase tracking-widest font-semibold mb-4 text-center">Örnek Bağlantı Kodu</p>
              <div className="text-center font-mono text-4xl font-black tracking-[0.2em] text-white mb-6">
                {demoOtp}
              </div>
              <button 
                onClick={handleCopyOtp}
                className="w-full py-4 rounded-xl bg-white hover:bg-slate-200 text-black font-bold transition-colors flex items-center justify-center gap-2"
              >
                {isCopied ? (
                  <><CheckCircle2 className="w-5 h-5 text-emerald-600" /> Kopyalandı</>
                ) : (
                  'Kodu Kopyala'
                )}
              </button>
            </div>
          </div>
        </motion.div>
      </section>

    </div>
  )
}
