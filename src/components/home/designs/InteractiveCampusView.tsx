'use client'

import { CampusExperience } from './InteractiveCampus/CampusExperience'

export function InteractiveCampusView() {
  return (
    <div className="min-h-screen bg-[#07090E] text-slate-100 selection:bg-amber-500 selection:text-slate-950 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-4">
      <div className="max-w-6xl mx-auto space-y-6">
        <CampusExperience />
      </div>
    </div>
  )
}
