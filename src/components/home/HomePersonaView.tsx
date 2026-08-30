'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { PersonaSwitcher, type PersonaType } from './PersonaSwitcher'
import { PersonaHero } from './PersonaHero'
import { PersonaFeatures } from './PersonaFeatures'
import { PersonaSpotlight } from './PersonaSpotlight'
import { PersonaHowItWorks } from './PersonaHowItWorks'

interface HomePersonaViewProps {
  initialPersona?: PersonaType
}

const FINAL_CTA_DATA: Record<
  PersonaType,
  {
    text: string
    buttonText: string
    href: string
    subtext: string
  }
> = {
  student: {
    text: 'Ücretsiz hesabınızı açın, alanınıza en uygun eğitmenle ilk tanışma dersinizi hemen planlayın.',
    buttonText: '🎁 Ücretsiz Kaydolun & Başlayın',
    href: '/register?role=student',
    subtext: 'Kart bilgisi gerekmez · 20 dakika ücretsiz hoş geldin paketi',
  },
  parent: {
    text: 'Çocuğunuzun geleceğine sağlam bir adım atın, doğrulanmış öğretmenlerle eğitimini güvenle izleyin.',
    buttonText: '👨‍👩‍👧 Veli Hesabı Açın',
    href: '/register?role=parent',
    subtext: 'Doğrulanmış öğretmenler · Yanmayan kredi güvencesi',
  },
  instructor: {
    text: 'Bilginizi kazanca dönüştürün, Türkiye genelinde binlerce öğrenciye kendi şartlarınızda ulaşın.',
    buttonText: '🚀 Eğitmen Başvurusu Yapın',
    href: '/register?role=instructor',
    subtext: 'Hızlı onay süreci · Otomatik Google Meet entegrasyonu',
  },
}

export function HomePersonaView({ initialPersona = 'student' }: HomePersonaViewProps) {
  const [activePersona, setActivePersona] = useState<PersonaType>(initialPersona)

  useEffect(() => {
    // Read query parameter if present on client
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search)
      const roleParam = params.get('role') as PersonaType | null
      if (roleParam && ['student', 'parent', 'instructor'].includes(roleParam)) {
        setActivePersona(roleParam)
      }
    }
  }, [])

  function handlePersonaChange(newPersona: PersonaType) {
    setActivePersona(newPersona)
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href)
      url.searchParams.set('role', newPersona)
      window.history.replaceState({}, '', url.toString())
    }
  }

  const finalCta = FINAL_CTA_DATA[activePersona]

  return (
    <div className="space-y-7">
      {/* Persona Switcher Tabs */}
      <PersonaSwitcher activePersona={activePersona} onChange={handlePersonaChange} />

      {/* Role-Specific Hero Section */}
      <PersonaHero persona={activePersona} />

      {/* Role-Specific Features Section */}
      <PersonaFeatures persona={activePersona} />

      {/* Role-Specific Interactive Spotlight / Proof */}
      <PersonaSpotlight persona={activePersona} />

      {/* Role-Specific How It Works Guide */}
      <PersonaHowItWorks persona={activePersona} />

      {/* Dynamic Final CTA */}
      <div className="bg-[#F4F1E8] rounded-2xl p-7 sm:p-10 border-4 border-[#1B2430] shadow-[0_8px_0_#1B2430] text-center">
        <p className="font-sans text-xl sm:text-2xl font-black text-[#1B2430] mb-3 max-w-2xl mx-auto">
          {finalCta.text}
        </p>
        <p className="text-sm font-bold text-[#1B2430]/70 mb-6">{finalCta.subtext}</p>
        <Link
          href={finalCta.href}
          className="inline-block py-3.5 px-9 text-lg bg-[#DD7B3A] text-[#F4F1E8] font-black rounded-xl border-4 border-[#1B2430] shadow-[0_5px_0_#1B2430] hover:translate-y-[-2px] active:translate-y-1 active:shadow-none transition-all"
        >
          {finalCta.buttonText}
        </Link>
      </div>
    </div>
  )
}
