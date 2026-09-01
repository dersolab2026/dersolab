'use client'

import { useState, useEffect } from 'react'
import type { PersonaType } from './PersonaSwitcher'
import { DesignVersionSwitcher, type DesignVersion } from './DesignVersionSwitcher'
import { InteractiveCampusView } from './designs/InteractiveCampusView'
import { MasterAdShowcaseView } from './designs/MasterAdShowcaseView'
import { MasterHumanDesignView } from './designs/MasterHumanDesignView'
import { DesignAView } from './designs/DesignAView'
import { DesignCView } from './designs/DesignC/DesignCView'
import { PersonaDedicatedView } from './designs/PersonaDedicated/PersonaDedicatedView'

interface HomePersonaViewProps {
  initialPersona?: PersonaType
}

export function HomePersonaView({ initialPersona = 'student' }: HomePersonaViewProps) {
  const [currentVersion, setCurrentVersion] = useState<DesignVersion>('campus')

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search)
      const v = params.get('v')
      if (v === 'persona' || v === 'hedef' || v === 'p') setCurrentVersion('persona-dedicated')
      else if (v === 'campus' || v === 'bina' || v === 'akademi') setCurrentVersion('campus')
      else if (v === 'ad' || v === 'reklam') setCurrentVersion('master-ad')
      else if (v === 'clean') setCurrentVersion('clean-human')
      else if (v === 'a') setCurrentVersion('design-a')
      else if (v === 'c' || v === 'platform') setCurrentVersion('design-c')
    }
  }, [])

  function handleVersionChange(v: DesignVersion) {
    setCurrentVersion(v)
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href)
      if (v === 'persona-dedicated') url.searchParams.set('v', 'persona')
      else if (v === 'campus') url.searchParams.set('v', 'campus')
      else if (v === 'master-ad') url.searchParams.set('v', 'ad')
      else if (v === 'clean-human') url.searchParams.set('v', 'clean')
      else if (v === 'design-a') url.searchParams.set('v', 'a')
      else if (v === 'design-c') url.searchParams.set('v', 'c')
      window.history.replaceState({}, '', url.toString())
    }
  }

  return (
    <div className="relative">
      {/* Floating Switcher for Local Prototyping */}
      <DesignVersionSwitcher currentVersion={currentVersion} onVersionChange={handleVersionChange} />

      {/* Render Active Design */}
      {currentVersion === 'persona-dedicated' && <PersonaDedicatedView initialPersona={initialPersona} />}
      {currentVersion === 'campus' && <InteractiveCampusView />}
      {currentVersion === 'master-ad' && <MasterAdShowcaseView initialPersona={initialPersona} />}
      {currentVersion === 'clean-human' && <MasterHumanDesignView initialPersona={initialPersona} />}
      {currentVersion === 'design-a' && <DesignAView initialPersona={initialPersona} />}
      {currentVersion === 'design-c' && <DesignCView />}
    </div>
  )
}
