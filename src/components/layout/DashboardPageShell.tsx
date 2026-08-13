import type { ReactNode } from 'react'

interface DashboardPageShellProps {
  title: string
  description?: string
  headerExtra?: ReactNode
  children: ReactNode
}

export function DashboardPageShell({ title, description, headerExtra, children }: DashboardPageShellProps) {
  return (
    <div className="min-h-[calc(100vh-57px)] md:min-h-screen w-full bg-[#D5EAE3] relative">
      <div
        className="absolute inset-0 z-0 opacity-40 pointer-events-none"
        style={{
          backgroundImage: 'linear-gradient(45deg, #6FA89E 25%, transparent 25%), linear-gradient(-45deg, #6FA89E 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #6FA89E 75%), linear-gradient(-45deg, transparent 75%, #6FA89E 75%)',
          backgroundSize: '40px 40px', backgroundPosition: '0 0, 0 20px, 20px -20px, -20px 0px'
        }}
      />

      <div className="relative z-10 mx-auto max-w-3xl space-y-6 p-5 py-10">
        <div className="bg-[#F4F1E8] rounded-2xl p-6 sm:p-8 border-4 border-[#1B2430] shadow-[0_8px_0_#1B2430] flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="font-sans text-2xl sm:text-3xl font-black text-[#1B2430] leading-snug">
              {title}
            </h1>
            {description && <p className="mt-2 font-sans font-semibold text-[#1B2430]">{description}</p>}
          </div>
          {headerExtra}
        </div>

        {children}
      </div>
    </div>
  )
}
