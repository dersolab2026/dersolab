'use client'

import { useState, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, useMotionTemplate, useMotionValue } from 'framer-motion'
import {
  Wallet,
  CalendarDays,
  Users,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  ArrowUpRight,
  Laptop
} from 'lucide-react'

// Holographic Card Component with Mouse Tracking
function HolographicCard({ title, desc, icon: Icon, color }: { title: string, desc: string, icon: any, color: string }) {
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  function handleMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
    const { left, top } = currentTarget.getBoundingClientRect()
    mouseX.set(clientX - left)
    mouseY.set(clientY - top)
  }

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="group relative p-10 rounded-[2rem] bg-[#0c0c0c] border border-white/5 overflow-hidden shadow-2xl transition-transform hover:-translate-y-2"
    >
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-[2rem] opacity-0 transition duration-300 group-hover:opacity-100"
        style={{
          background: useMotionTemplate`
            radial-gradient(
              650px circle at ${mouseX}px ${mouseY}px,
              ${color},
              transparent 80%
            )
          `,
        }}
      />
      <div className="absolute inset-0 bg-[#0c0c0c]/90 rounded-[2rem] m-[1px]" />
      
      <div className="relative z-10">
        <div className="w-14 h-14 rounded-2xl bg-white/[0.05] border border-white/10 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500 shadow-xl">
          <Icon className="w-6 h-6 text-white" />
        </div>
        <h3 className="text-2xl font-bold text-white mb-4 tracking-tight">{title}</h3>
        <p className="text-slate-400 font-light leading-relaxed">{desc}</p>
      </div>
    </motion.div>
  )
}

interface InstructorLandingViewProps {
  examFilter: 'all' | 'lgs' | 'yks'
  onExamFilterChange: (filter: 'all' | 'lgs' | 'yks') => void
}

export function InstructorLandingView({ examFilter, onExamFilterChange }: InstructorLandingViewProps) {

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
    <div className="py-12 px-4 sm:px-6 bg-[#000000] min-h-screen text-slate-100 font-sans selection:bg-blue-500/30 overflow-hidden">
      
      {/* ── 1. CREATOR ECONOMY HERO ── */}
      <section className="relative max-w-[90rem] mx-auto min-h-[85vh] flex flex-col justify-center rounded-[3rem] overflow-hidden border border-white/[0.05] bg-[#030303] mt-12">
        
        {/* Deep space glow */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,#1e3a8a22,transparent_50%)]" />
        <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-blue-600/20 rounded-full blur-[120px] mix-blend-screen" />
        <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[100px] mix-blend-screen" />

        <div className="relative z-10 flex flex-col items-center text-center w-full px-4 mb-12 sm:mb-16">
          {/* Premium Logo for Instructor Theme - Centered at top */}
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
              Derso<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">Lab</span>
            </span>
          </motion.div>
        </div>

        <div className="flex flex-col items-center z-10 text-center max-w-4xl mx-auto px-8 sm:px-12 lg:px-20 pb-16">
          
          {/* Creator Copy */}
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="flex flex-col items-center space-y-10"
          >
            <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold tracking-widest uppercase backdrop-blur-md shadow-[0_0_20px_rgba(59,130,246,0.15)]">
              <Sparkles className="w-4 h-4 animate-pulse" />
              Eğitmen Ağına Katılın
            </motion.div>

            <motion.h1 variants={fadeInUp} className="text-6xl sm:text-7xl lg:text-[5.5rem] font-black text-white tracking-tighter leading-[1.05]">
              Sadece <br />
              <span className="relative inline-block mt-2">
                <span className="absolute -inset-2 blur-2xl bg-blue-500/20 mix-blend-screen"></span>
                <span className="relative text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-cyan-300">
                  Öğretmeye
                </span>
              </span> <br />Odaklanın
            </motion.h1>

            <motion.p variants={fadeInUp} className="text-xl sm:text-2xl text-slate-400 max-w-2xl mx-auto font-light leading-relaxed">
              Öğrenci bulma, tahsilat yapma ve pazarlama dertlerini bize bırakın. DersoLab ile kendi takviminizin patronu olun.
            </motion.p>

            <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row items-center gap-4 justify-center mt-4">
              <Link
                href="/register"
                className="group relative px-8 py-5 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-lg transition-all flex items-center justify-center gap-2 shadow-[0_0_30px_rgba(37,99,235,0.3)] hover:shadow-[0_0_40px_rgba(37,99,235,0.5)] active:scale-95 w-full sm:w-auto"
              >
                Hemen Başvur
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/login"
                className="group px-8 py-5 rounded-2xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/10 text-white font-semibold text-lg transition-all flex items-center justify-center gap-2 active:scale-95 w-full sm:w-auto"
              >
                Giriş Yap
              </Link>
            </motion.div>
          </motion.div>
          
        </div>
      </section>

      {/* ── 2. HOLOGRAPHIC FEATURE CARDS ── */}
      <section className="max-w-[90rem] mx-auto py-32">
        <div className="grid md:grid-cols-3 gap-6 sm:gap-8">
          <HolographicCard 
            title="Akıllı Takvim"
            desc="Müsait olduğunuz saatleri belirleyin, Google Meet entegrasyonuyla otomatik rezervasyonlar alın. Yoklama derdi olmadan derslere odaklanın."
            icon={CalendarDays}
            color="rgba(59, 130, 246, 0.15)"
          />
          <HolographicCard 
            title="Esnek Çalışma"
            desc="İstediğiniz yerde, istediğiniz vakit dersinizi yapın. Sınır veya zorunlu ofis saatleri yok."
            icon={Laptop}
            color="rgba(16, 185, 129, 0.15)"
          />
          <HolographicCard 
            title="Öğrenci Akışı"
            desc="Pazarlama veya reklam masrafı yok. Türkiye'nin dört bir yanından gelen geniş öğrenci ağımız, doğrudan profilinize yönlendirilir."
            icon={Users}
            color="rgba(168, 85, 247, 0.15)"
          />
        </div>
      </section>



    </div>
  )
}
