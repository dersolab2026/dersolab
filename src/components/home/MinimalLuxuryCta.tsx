'use client'

import Link from 'next/link'
import { ArrowRight, Sparkles } from 'lucide-react'
import type { PersonaType } from './PersonaSwitcher'

const CTA_CONTENT: Record<
  PersonaType,
  {
    kicker: string
    title: string
    desc: string
    btn: string
    href: string
    sub: string
  }
> = {
  student: {
    kicker: 'Hemen Deneyin',
    title: 'İlk Adımı Atın, Bire Bir Derse Başlayın',
    desc: 'Ücretsiz hesabınızı açın, 20 dakikalık tanışma paketiyle sistemi hemen test edin.',
    btn: '20 Dk Ücretsiz Tanışma Paketi Al',
    href: '/demo-ders',
    sub: 'Kredi kartı bilgisi gerekmez · Google Meet ile anında erişim',
  },
  parent: {
    kicker: 'Veli Portalı',
    title: 'Çocuğunuzun Eğitimini Güvenle Planlayın',
    desc: 'Onaylı kadro ve yanmayan ders kredileriyle soru işaretlerini geride bırakın.',
    btn: 'Veli Hesabı Oluştur',
    href: '/register?role=parent',
    sub: 'Doğrulanmış kadro · Şeffaf ders raporları',
  },
  instructor: {
    kicker: 'Eğitmen Ağı',
    title: 'DersoLab Eğitmen Kadrosuna Katılın',
    desc: 'Kendi takviminizi açın, otomatik bağlantı ve zamanında IBAN hakedişiyle ders verin.',
    btn: 'Eğitmen Başvurusu Yap',
    href: '/register?role=instructor',
    sub: 'Hızlı başvuru süreci · Komisyonsuz başlangıç',
  },
}

export function MinimalLuxuryCta({ persona }: { persona: PersonaType }) {
  const data = CTA_CONTENT[persona]

  return (
    <div className="relative rounded-3xl bg-gradient-to-b from-slate-900/80 via-slate-900/60 to-slate-950/90 border border-white/10 p-8 sm:p-14 text-center overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.4)]">
      <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-96 h-32 bg-emerald-500/15 rounded-full blur-3xl" />

      <div className="relative z-10 max-w-xl mx-auto space-y-4">
        <span className="text-xs font-mono font-bold uppercase tracking-widest text-emerald-400">
          {data.kicker}
        </span>
        <h3 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
          {data.title}
        </h3>
        <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
          {data.desc}
        </p>
        <div className="pt-3">
          <Link
            href={data.href}
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-white text-slate-950 font-bold text-sm sm:text-base shadow-xl hover:bg-slate-100 hover:scale-[1.01] active:scale-[0.99] transition-all cursor-pointer"
          >
            <span>{data.btn}</span>
            <ArrowRight className="w-4 h-4 text-emerald-700" />
          </Link>
        </div>
        <p className="text-xs text-slate-500 font-medium pt-2">{data.sub}</p>
      </div>
    </div>
  )
}
