import type { ReactNode } from 'react'

interface DashboardPageShellProps {
  title: string
  description?: string
  headerExtra?: ReactNode
  children: ReactNode
}

export function DashboardPageShell({ title, description, headerExtra, children }: DashboardPageShellProps) {
  return (
    <div className="min-h-[calc(100vh-57px)] md:min-h-screen w-full relative">

      <div className="relative z-10 mx-auto max-w-3xl space-y-6 p-5 py-10">
        <div className="bg-white/[0.02] rounded-2xl p-6 sm:p-8 border border-white/5 backdrop-blur-xl shadow-[0_0_30px_rgba(0,0,0,0.5)] flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="font-sans text-2xl sm:text-3xl font-black text-white leading-snug">
              {title}
            </h1>
            {description && <p className="mt-2 font-sans font-semibold text-slate-400">{description}</p>}
          </div>
          {headerExtra}
        </div>

        {children}
      </div>
    </div>
  )
}
