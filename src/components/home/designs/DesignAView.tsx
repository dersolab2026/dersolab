'use client'

import { useState, useEffect } from 'react'
import { PersonaSwitcher, type PersonaType } from '../PersonaSwitcher'
import { AbstractHero } from '../AbstractHero'
import { AbstractMotionShowcase } from '../AbstractMotionShowcase'
import { MinimalPillars } from '../MinimalPillars'
import { MinimalLuxuryCta } from '../MinimalLuxuryCta'

interface DesignAViewProps {
  initialPersona?: PersonaType
}

export function DesignAView({ initialPersona = 'student' }: DesignAViewProps) {
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
    <div className="space-y-12 sm:space-y-16">
      {/* Minimal Floating Persona Switcher */}
      <PersonaSwitcher activePersona={activePersona} onChange={handlePersonaChange} />

      {/* Minimal Grand Hero with 3D Mascot */}
      <AbstractHero persona={activePersona} />

      {/* Abstract Motion Showcase */}
      <AbstractMotionShowcase persona={activePersona} />

      {/* 3 Core Abstract Pillars */}
      <MinimalPillars persona={activePersona} />

      {/* Minimal Luxury Final CTA */}
      <MinimalLuxuryCta persona={activePersona} />
    </div>
  )
}
