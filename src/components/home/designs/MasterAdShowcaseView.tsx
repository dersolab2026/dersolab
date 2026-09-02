'use client'

import { useState, useEffect } from 'react'
import type { PersonaType } from '../PersonaSwitcher'
import { AdHero } from './MasterAdShowcase/AdHero'
import { AdRoleShowcase } from './MasterAdShowcase/AdRoleShowcase'
import { AdComparisonGrid } from './MasterAdShowcase/AdComparisonGrid'
import { AdFinalGrandCta } from './MasterAdShowcase/AdFinalGrandCta'

interface MasterAdShowcaseViewProps {
  initialPersona?: PersonaType
}

export function MasterAdShowcaseView({ initialPersona = 'student' }: MasterAdShowcaseViewProps) {
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
    <div className="min-h-screen bg-[#07090E] text-slate-100 selection:bg-amber-500 selection:text-slate-950 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Grand Advertising Hero Billboard */}
        <AdHero />

        {/* 3-Role Advertising Stage (Öğrenci, Veli, Eğitmen) */}
        <AdRoleShowcase activePersona={activePersona} onPersonaChange={handlePersonaChange} />

        {/* High-Converting Comparison Table */}
        <AdComparisonGrid />

        {/* Final Grand Conversion Billboard */}
        <AdFinalGrandCta />
      </div>
    </div>
  )
}
