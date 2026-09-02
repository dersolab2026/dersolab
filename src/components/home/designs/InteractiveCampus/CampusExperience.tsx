'use client'

import { useState } from 'react'
import { ThreeDBuildingCanvas } from './ThreeDBuildingCanvas'
import { ReceptionSceneEnhanced } from './ReceptionSceneEnhanced'
import { Realistic3DCorridor } from './Realistic3DCorridor'
import { LabSceneEnhanced } from './LabSceneEnhanced'
import type { LabType } from './CampusCorridorScene'
import { Building2, MessageSquare, Compass, BookOpen } from 'lucide-react'

export type CampusScene = 'building' | 'reception' | 'corridor' | 'laboratory'

export function CampusExperience() {
  const [scene, setScene] = useState<CampusScene>('building')
  const [selectedLab, setSelectedLab] = useState<LabType>('matematik')

  const steps = [
    { id: 'building' as CampusScene, label: '1. Gerçek 3D Bina (WebGL)', icon: Building2 },
    { id: 'reception' as CampusScene, label: '2. Danışma & Maskot', icon: MessageSquare },
    { id: 'corridor' as CampusScene, label: '3. 3D Laboratuvar Kapıları', icon: Compass },
    { id: 'laboratory' as CampusScene, label: '4. Canlı Ders & Kara Tahta', icon: BookOpen },
  ]

  return (
    <div className="space-y-6">
      {/* Interactive Floor / Minimap Teleport Navigation */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-2.5 rounded-2xl bg-slate-950/90 border-2 border-amber-500/40 backdrop-blur-2xl shadow-2xl">
        <div className="flex items-center gap-2 px-3 text-xs font-mono font-bold text-amber-300">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
          <span>3 BOYUTLU SANAL KAMPÜS:</span>
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          {steps.map((step) => {
            const isActive = scene === step.id
            const Icon = step.icon

            return (
              <button
                key={step.id}
                type="button"
                onClick={() => setScene(step.id)}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 shadow-[0_0_20px_rgba(245,158,11,0.7)] scale-105'
                    : 'text-slate-400 hover:text-white hover:bg-white/[0.08]'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{step.label}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Render Active Scene */}
      {scene === 'building' && (
        <ThreeDBuildingCanvas onEnter={() => setScene('reception')} />
      )}

      {scene === 'reception' && (
        <ReceptionSceneEnhanced
          onBack={() => setScene('building')}
          onGoToCorridor={() => setScene('corridor')}
        />
      )}

      {scene === 'corridor' && (
        <Realistic3DCorridor
          onBack={() => setScene('reception')}
          onSelectLab={(lab) => {
            setSelectedLab(lab)
            setScene('laboratory')
          }}
        />
      )}

      {scene === 'laboratory' && (
        <LabSceneEnhanced
          labType={selectedLab}
          onBack={() => setScene('corridor')}
        />
      )}
    </div>
  )
}
