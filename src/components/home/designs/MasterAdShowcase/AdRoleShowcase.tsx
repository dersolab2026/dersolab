'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  GraduationCap,
  Users,
  BookOpen,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Video,
  Clock,
  Award,
  Wallet,
  CheckCircle2,
  Calendar,
} from 'lucide-react'
import type { PersonaType } from '../../PersonaSwitcher'

export function AdRoleShowcase({
  activePersona,
  onPersonaChange,
}: {
  activePersona: PersonaType
  onPersonaChange: (persona: PersonaType) => void
}) {
  const roles = [
    {
      id: 'student' as PersonaType,
      label: 'Öğrenci Reklam Vitrini',
      kicker: 'LGS & YKS DERECE HEDEFİ',
      title: 'Takıldığın her soruyu uzmanla bire bir çöz.',
      desc: 'Kalabalık etüt merkezlerinde sıra beklemeyin. Google Meet ile dilediğiniz gün 1:1 canlı seansa bağlanın, süresi bitmeyen kredilerle netlerinizi hızla artırın.',
      ctaText: '20 Dk Ücretsiz Tanışma Seansını Al',
      ctaHref: '/demo-ders',
      cards: [
        {
          icon: Video,
          title: 'Google Meet Canlı 1:1',
          desc: 'Öğretmeniniz tüm odağını sadece size verir, anlamadığınız her formülü adım adım çözer.',
          badge: 'Yüksek Verim',
        },
        {
          icon: Clock,
          title: 'Süresiz Yanmayan Kredi',
          desc: 'Satın aldığınız dersler ay sonunda silinmez. Sınav haftasına kadar hesabınızda güvendedir.',
          badge: 'Sıfır Kayıp',
        },
        {
          icon: Sparkles,
          title: 'Haftalık Koçluk Takibi',
          desc: 'Deneme netleriniz grafiklerle izlenir, zayıf olduğunuz konulara özel ödevler verilir.',
          badge: 'Net Garantisi',
        },
      ],
    },
    {
      id: 'parent' as PersonaType,
      label: 'Veli Güvence Vitrini',
      kicker: 'MUTLAK ŞEFFAFLIK & GÜVEN',
      title: 'Çocuğunuzun gelişimini net ve güvenle izleyin.',
      desc: 'Eğitimde soru işaretlerine yer yok. Belgeleri onaylı öğretmenlerle çalışın; her dersin ardından yazılı gelişim raporu alın ve yanmayan krediyle bütçenizi koruyun.',
      ctaText: 'Veli Hesabı Aç & Güvenceyi İncele',
      ctaHref: '/register?role=parent',
      cards: [
        {
          icon: ShieldCheck,
          title: '%100 Onaylı Eğitmenler',
          desc: 'Platformdaki her öğretmenin diploma ve akademik geçmişi yöneticilerimizce tescillenir.',
          badge: 'Resmi Tescil',
        },
        {
          icon: Award,
          title: 'Yazılı Seans Raporu',
          desc: 'Her dersin ardından öğretmenin bıraktığı katılım ve kavrama değerlendirmesini anlık okuyun.',
          badge: 'Tam Şeffaflık',
        },
        {
          icon: Clock,
          title: 'Bütçe Koruma Kalkanı',
          desc: 'Kurslardaki gibi "kullanmadığın ay yanan aidat" sistemi yok; her kuruşunuz korunur.',
          badge: 'Güvenli Ödeme',
        },
      ],
    },
    {
      id: 'instructor' as PersonaType,
      label: 'Eğitmen Prestij Vitrini',
      kicker: 'BAĞIMSIZ EĞİTMEN SAHNESİ',
      title: 'Kendi programını belirle, öğrencilerinle buluş.',
      desc: 'Link hazırlama, ödeme peşinde koşma veya karmaşık operasyonlarla vakit kaybetmeyin. Takviminizdeki saatleri seçin; gerisini DersoLab otomatik halletsin.',
      ctaText: 'Eğitmen Başvurusunu Tamamla',
      ctaHref: '/register?role=instructor',
      cards: [
        {
          icon: Calendar,
          title: 'Otomatik Google Meet',
          desc: 'Öğrenci rezervasyon yaptığında takvim davetiyesi ve canlı ders linki kendiliğinden oluşur.',
          badge: 'Sıfır Operasyon',
        },
        {
          icon: Wallet,
          title: 'Aylık Düzenli IBAN Aktarımı',
          desc: 'Verdiğiniz tüm derslerin hakedişi her ay şeffaf ve eksiksiz biçimde banka hesabınıza yatar.',
          badge: 'Zamanında Ödeme',
        },
        {
          icon: Sparkles,
          title: 'Özgür Çalışma Takvimi',
          desc: 'İster haftada 4 saat ister 25 saat ders verin; kendi fiyat ve takviminizin patronu olun.',
          badge: 'Tam Bağımsızlık',
        },
      ],
    },
  ]

  const activeRoleData = roles.find((r) => r.id === activePersona) || roles[0]

  return (
    <div className="py-12 sm:py-16 border-t border-white/10 space-y-10">
      {/* 3-Role Advertising Tab Switcher */}
      <div className="flex flex-wrap items-center justify-center gap-2 p-1.5 rounded-2xl bg-white/[0.05] border border-white/10 max-w-2xl mx-auto backdrop-blur-xl">
        {roles.map((r) => {
          const isActive = activePersona === r.id
          return (
            <button
              key={r.id}
              type="button"
              onClick={() => onPersonaChange(r.id)}
              className={`flex-1 min-w-[140px] py-3 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                isActive
                  ? 'bg-gradient-to-r from-amber-500 via-amber-600 to-rose-600 text-slate-950 shadow-[0_0_25px_rgba(245,158,11,0.5)] scale-[1.02]'
                  : 'text-slate-400 hover:text-white hover:bg-white/[0.05]'
              }`}
            >
              {r.label}
            </button>
          )
        })}
      </div>

      {/* Main Role Advertising Banner */}
      <div className="rounded-3xl bg-gradient-to-b from-slate-900/90 via-black to-slate-950 border-2 border-white/15 p-8 sm:p-12 backdrop-blur-3xl shadow-[0_0_60px_rgba(0,0,0,0.8)] space-y-8 text-center lg:text-left">
        <div className="grid lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-8 space-y-4">
            <span className="text-xs font-bold tracking-widest uppercase text-amber-400 font-mono">
              ✦ {activeRoleData.kicker} ✦
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight font-serif">
              {activeRoleData.title}
            </h2>
            <p className="text-sm sm:text-base text-slate-300 font-light leading-relaxed max-w-2xl">
              {activeRoleData.desc}
            </p>
          </div>

          <div className="lg:col-span-4 flex justify-center lg:justify-end">
            <Link
              href={activeRoleData.ctaHref}
              className="inline-flex items-center gap-2.5 px-8 py-4 rounded-2xl bg-white hover:bg-slate-100 text-slate-950 font-bold text-sm shadow-xl hover:scale-105 transition-all cursor-pointer"
            >
              <span>{activeRoleData.ctaText}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* 3 Spectacular Benefit Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-4 border-t border-white/10">
          {activeRoleData.cards.map((c, idx) => {
            const Icon = c.icon
            return (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-white/[0.04] border border-white/10 hover:border-amber-500/40 hover:bg-white/[0.08] transition-all space-y-3 text-left group"
              >
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500/20 to-rose-500/20 border border-amber-500/30 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Icon className="w-6 h-6 text-amber-400" />
                  </div>
                  <span className="text-[10px] font-bold font-mono px-2.5 py-1 rounded-full bg-white/[0.06] text-amber-300 border border-white/10">
                    {c.badge}
                  </span>
                </div>

                <h3 className="text-base font-bold text-white tracking-wide">{c.title}</h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-light">{c.desc}</p>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
