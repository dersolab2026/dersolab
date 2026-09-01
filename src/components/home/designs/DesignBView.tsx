'use client'

import { useState, useEffect } from 'react'
import type { PersonaType } from '../PersonaSwitcher'
import { SurrealBackground } from './DesignB/SurrealBackground'
import { SurrealPersonaDial } from './DesignB/SurrealPersonaDial'
import { SurrealHero } from './DesignB/SurrealHero'
import { SurrealInteractiveWidget } from './DesignB/SurrealInteractiveWidget'
import { SurrealPortalShowcase } from './DesignB/SurrealPortalShowcase'
import { SurrealCta } from './DesignB/SurrealCta'

interface DesignBViewProps {
  initialPersona?: PersonaType
}

export function DesignBView({ initialPersona = 'student' }: DesignBViewProps) {
  const [activePersona, setActivePersona] = useState<PersonaType>(initialPersona)

  useEffect(() => {
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

  return (
    <div className="relative space-y-12 sm:space-y-16 selection:bg-amber-500 selection:text-slate-950">
      {/* Surreal Lynchian Background with dynamic aura and embers per persona */}
      <SurrealBackground persona={activePersona} />

      {/* Surreal Persona Dial */}
      <SurrealPersonaDial activePersona={activePersona} onChange={handlePersonaChange} />

      {/* Surrealist Grand Hero with Bespoke Museum Artwork per persona */}
      <SurrealHero persona={activePersona} />

      {/* Role-Specific Interactive Surrealist Machine (Melting Clock / Veritas Mirror / Cosmic Wheel) */}
      <SurrealInteractiveWidget persona={activePersona} />

      {/* 3 Role-Specific Surreal Mystery Portals */}
      <SurrealPortalShowcase persona={activePersona} />

      {/* Golden Key Surrealist Final CTA */}
      <SurrealCta persona={activePersona} />
    </div>
  )
}
