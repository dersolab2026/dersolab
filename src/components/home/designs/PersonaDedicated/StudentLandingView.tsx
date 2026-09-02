'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import {
  Search,
  Sparkles,
  Target,
  Brain,
  Video,
  ChevronRight,
  TrendingUp,
  Award,
  Zap,
  BookOpen,
  ArrowRight,
  Play
} from 'lucide-react'
import { motion } from 'framer-motion'

interface StudentLandingViewProps {
  examFilter: 'all' | 'lgs' | 'yks'
  onExamFilterChange: (filter: 'all' | 'lgs' | 'yks') => void
}

export function StudentLandingView({ examFilter, onExamFilterChange }: StudentLandingViewProps) {
  const [email, setEmail] = useState('')

  return (
    <div className="space-y-32 py-12 px-4 sm:px-6 bg-black min-h-screen selection:bg-indigo-500/30 font-sans overflow-hidden">
      
      {/* ── 1. PREMIUM SPOTLIGHT HERO ── */}
      <section className="relative w-full max-w-[90rem] mx-auto min-h-[85vh] flex flex-col items-center justify-center rounded-[3rem] sm:rounded-[4rem] overflow-hidden border border-white/[0.05] bg-[#030712] shadow-2xl">
        
        {/* Animated Background Mesh & Orbs */}
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03] mix-blend-overlay" />
        <div className="absolute top-0 left-1/4 w-[40vw] h-[40vw] max-w-[600px] max-h-[600px] bg-indigo-600/30 rounded-full blur-[120px] mix-blend-screen animate-pulse" style={{ animationDuration: '8s' }} />
        <div className="absolute bottom-0 right-1/4 w-[30vw] h-[30vw] max-w-[500px] max-h-[500px] bg-rose-600/20 rounded-full blur-[100px] mix-blend-screen animate-pulse" style={{ animationDuration: '10s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[20vw] h-[20vw] max-w-[400px] max-h-[400px] bg-amber-500/10 rounded-full blur-[120px] mix-blend-screen" />
        
        {/* Ambient Grid overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_70%,transparent_100%)]" />

        <div className="relative z-10 flex flex-col items-center text-center w-full px-4 mt-16 sm:mt-0">
          
          {/* Premium Logo */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="mb-8 flex items-center justify-center gap-3"
          >
            <img 
              src="/fox-head.png" 
              alt="DersoLab Avatar" 
              className="w-10 h-10 object-contain drop-shadow-md" 
            />
            <span className="text-3xl font-black tracking-tight text-white">
              Derso<span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-rose-400">Lab</span>
            </span>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="group cursor-pointer inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.05] transition-all duration-500 backdrop-blur-md mb-12 shadow-[0_0_20px_rgba(255,255,255,0.02)] hover:shadow-[0_0_30px_rgba(255,255,255,0.05)]"
          >
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500"></span>
            </span>
            <span className="text-slate-300 text-xs font-semibold uppercase tracking-[0.2em] group-hover:text-white transition-colors">
              Geleceğin Eğitim Platformu
            </span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-5xl sm:text-7xl lg:text-8xl font-black text-white tracking-tighter leading-[1.05] mb-8 max-w-5xl"
          >
            Sınava Hazırlıkta <br />
            <span className="relative inline-block mt-2">
              <span className="absolute -inset-2 blur-2xl bg-gradient-to-r from-indigo-500 via-purple-500 to-rose-500 opacity-30 mix-blend-screen"></span>
              <span className="relative text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-slate-500">
                Sınırları Kaldır
              </span>
            </span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="text-lg sm:text-xl text-slate-400 max-w-2xl font-light mb-12"
          >
            Hedefindeki üniversiteye veya liseye ulaşmak için ihtiyacın olan her şey tek bir platformda. Yapay zeka ile hızlan, uzman eğitmenlerle fark yarat.
          </motion.p>

          {/* Marketing CTA - Email Capture instead of Search */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="w-full max-w-2xl relative group z-20"
          >
            <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-amber-500 rounded-3xl blur-md opacity-20 group-hover:opacity-60 transition duration-1000 group-hover:duration-500" />
            <div className="relative flex flex-col sm:flex-row items-center bg-[#0a0a0a]/80 backdrop-blur-2xl border border-white/10 hover:border-white/20 rounded-3xl p-2 sm:p-3 shadow-2xl transition-all duration-500">
              <input 
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="E-posta adresin..."
                className="w-full bg-transparent border-none outline-none text-white text-lg sm:text-xl px-4 py-4 placeholder-slate-600 font-light"
              />
              <Link href="/register" className="w-full sm:w-auto shrink-0 group/btn relative overflow-hidden rounded-2xl bg-white text-black px-8 py-4 sm:py-5 font-bold text-sm sm:text-base tracking-wide transition-transform hover:scale-[0.98] active:scale-95 flex justify-center items-center">
                <span className="relative z-10 flex items-center gap-2">
                  Ücretsiz Başla <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                </span>
                <div className="absolute inset-0 h-full w-full bg-gradient-to-r from-slate-200 to-slate-100 transform scale-x-0 group-hover/btn:scale-x-100 transition-transform origin-left duration-300 ease-out" />
              </Link>
            </div>
            <p className="text-slate-500 text-sm mt-4 text-center">Hesap oluştur, <span className="text-amber-400 font-semibold">ücretsiz tanışma dersini</span> hemen planla!</p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="flex items-center justify-center gap-4 mt-8 w-full max-w-2xl"
          >
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <Link href="/login" className="px-8 py-4 sm:py-5 rounded-2xl bg-white/[0.03] border border-white/[0.1] hover:bg-white/[0.08] hover:border-white/[0.2] text-sm sm:text-base text-white font-bold tracking-wide transition-all duration-300 flex items-center justify-center min-w-[160px]">
                Giriş Yap
              </Link>
              <Link href="/register" className="px-8 py-4 sm:py-5 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 hover:bg-indigo-500/20 hover:border-indigo-500/40 text-sm sm:text-base text-indigo-300 font-bold tracking-wide transition-all duration-300 shadow-[0_0_15px_rgba(99,102,241,0.1)] hover:shadow-[0_0_20px_rgba(99,102,241,0.2)] flex items-center justify-center min-w-[160px]">
                Kayıt Ol
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── 2. PREMIUM BENTO GRID (Glassmorphism & Depth) ── */}
      <section className="max-w-[90rem] mx-auto">
        <div className="flex flex-col items-center mb-16 text-center">
          <h2 className="text-4xl sm:text-5xl font-black text-white tracking-tight mb-4">Senin İçin <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">Tasarlanmış</span> Araçlar</h2>
          <p className="text-slate-400 max-w-2xl font-light">Eski usül videolara mahkum olma. Canlı dersler, yapay zeka ve hedef takibi ile kendi eğitim ekosistemini kur.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 auto-rows-[minmax(300px,auto)]">
          
          {/* Card 1: 1:1 Canlı Ders (Square) */}
          <div className="p-10 rounded-[2.5rem] bg-[#0c0c0c] border border-white/[0.08] hover:border-indigo-500/30 transition-colors duration-500 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            <div className="absolute -right-20 -bottom-20 w-[400px] h-[400px] bg-indigo-500/10 rounded-full blur-[80px] group-hover:bg-indigo-500/20 transition-all duration-700" />
            
            <div className="relative z-10 flex flex-col h-full justify-between">
              <div>
                <div className="flex justify-between items-start mb-8">
                  <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20 group-hover:scale-110 group-hover:bg-indigo-500/20 transition-all duration-500">
                    <Video className="w-6 h-6 text-indigo-400" />
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.05] border border-white/[0.1]">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest hidden sm:inline">İş Ortağı</span>
                    <span className="text-xs font-semibold text-white">Google Meet</span>
                  </div>
                </div>
                
                <h3 className="text-2xl font-bold text-white mb-4 tracking-tight leading-tight">Google Altyapısıyla Kesintisiz Eğitim</h3>
                <p className="text-slate-400 font-light">
                  Küresel Google Workspace entegrasyonu sayesinde, sıfır gecikmeli canlı yayınlara tek tıkla bağlanın.
                </p>
              </div>
            </div>
            
            {/* Fake Video UI Mockup peering in from right */}
            <div className="absolute right-0 bottom-0 translate-x-1/4 translate-y-1/4 w-[300px] h-[200px] bg-slate-900 border-t border-l border-white/10 rounded-tl-3xl shadow-2xl opacity-50 group-hover:opacity-100 group-hover:translate-x-[20%] group-hover:translate-y-[20%] transition-all duration-700 flex items-center justify-center">
               <Play className="w-12 h-12 text-white/50" />
            </div>
          </div>

          {/* Card 2: Koçluk (Square) */}
          <div className="p-10 rounded-[2.5rem] bg-[#0c0c0c] border border-white/[0.08] hover:border-emerald-500/30 transition-colors duration-500 relative overflow-hidden group">
             <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            
            <div className="relative z-10 flex flex-col h-full justify-between">
              <div>
                <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 group-hover:-translate-y-2 transition-transform duration-500 mb-8">
                  <Brain className="w-6 h-6 text-emerald-400" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4 tracking-tight leading-tight">Hedef Odaklı <br/>Kişisel Koçluk</h3>
                <p className="text-slate-400 font-light">Çalışma alışkanlıklarını analiz et, eksik konularını belirle ve netlerini adım adım artır.</p>
              </div>
            </div>
            
            {/* Subtle Graph Background */}
            <div className="absolute right-0 bottom-0 left-0 h-32 opacity-20 flex items-end justify-around px-8 pb-4 group-hover:opacity-40 transition-opacity duration-700">
               <div className="w-4 h-8 bg-emerald-500 rounded-t-sm" />
               <div className="w-4 h-12 bg-emerald-500 rounded-t-sm" />
               <div className="w-4 h-16 bg-emerald-500 rounded-t-sm" />
               <div className="w-4 h-24 bg-emerald-400 rounded-t-sm shadow-[0_0_15px_rgba(52,211,153,0.5)]" />
            </div>
          </div>

          {/* Card 3: Simülatör (Square) */}
          <div className="p-10 rounded-[2.5rem] bg-[#0c0c0c] border border-white/[0.08] hover:border-rose-500/30 transition-colors duration-500 relative overflow-hidden group flex flex-col justify-between">
             <div className="absolute inset-0 bg-gradient-to-tr from-rose-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            
             <div className="relative z-10">
                <div className="w-14 h-14 rounded-2xl bg-rose-500/10 flex items-center justify-center border border-rose-500/20 group-hover:scale-110 transition-transform duration-500 mb-8">
                  <Target className="w-6 h-6 text-rose-400" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4 leading-tight">Hedef Lise ve Üniversite Simülatörü</h3>
                <p className="text-slate-400 font-light">Hayalindeki okula girmek için daha kaç net yapman gerektiğini anlık olarak hesapla.</p>
             </div>
          </div>

          {/* Card 4: AI Asistan (Square -> Enhanced Gemini Branding) */}
          <div className="p-10 rounded-[2.5rem] bg-[#0c0c0c] border border-white/[0.08] hover:border-[#4285F4]/30 transition-colors duration-500 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-[#4285F4]/10 via-[#9b72cb]/5 to-[#d96570]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            
            {/* Ambient Gemini Glow */}
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#4285F4]/20 rounded-full blur-3xl group-hover:bg-[#4285F4]/30 transition-colors duration-500" />
            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-[#d96570]/20 rounded-full blur-3xl group-hover:bg-[#d96570]/30 transition-colors duration-500" />

            <div className="relative z-10 flex flex-col h-full justify-between">
              <div>
                <div className="flex justify-between items-start mb-8">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#4285F4]/20 to-[#9b72cb]/20 flex items-center justify-center border border-white/10 group-hover:rotate-12 transition-transform duration-500">
                    <Sparkles className="w-6 h-6 text-[#9b72cb]" />
                  </div>
                  {/* Tiny Google AI Badge */}
                  <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/[0.05] border border-white/10 backdrop-blur-md">
                    <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest hidden sm:inline">Stratejik Ortak</span>
                    <span className="text-xs font-black text-transparent bg-clip-text bg-gradient-to-r from-[#4285F4] via-[#ea4335] to-[#fbbc05]">Gemini AI</span>
                  </div>
                </div>
                
                <h3 className="text-2xl font-bold text-white mb-4 tracking-tight leading-tight">Google AI Destekli Öğrenim</h3>
                <p className="text-slate-400 font-light">DersoLab & Google işbirliği ile yapılandırılan özel yapay zeka motorumuz, fotoğrafladığın soruları anında ve kusursuz çözer.</p>
              </div>
            </div>
          </div>
          
        </div>
      </section>



    </div>
  )
}
