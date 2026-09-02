import { PersonaDedicatedView } from '@/components/home/designs/PersonaDedicated/PersonaDedicatedView'

export default function HomePage() {
  return (
    <div className="min-h-screen w-full bg-[#080B11] text-slate-100 relative overflow-hidden selection:bg-emerald-500 selection:text-slate-950 font-sans">
      <PersonaDedicatedView initialPersona="student" />
    </div>
  )
}
