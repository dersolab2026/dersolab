import type { ReactNode } from 'react'
import { SayfaDeseni } from '@/components/layout/SayfaDeseni'
import { KitleDekoru } from '@/components/home/KitleDekoru'

interface DashboardPageShellProps {
  title: string
  description?: string
  headerExtra?: ReactNode
  children: ReactNode
}

export function DashboardPageShell({ title, description, headerExtra, children }: DashboardPageShellProps) {
  return (
    <div className="min-h-[calc(100vh-57px)] md:min-h-screen w-full bg-[var(--zemin)] relative">
      <SayfaDeseni />

      <div className="relative z-10 mx-auto max-w-3xl space-y-6 p-5 py-10">
        <div className="relative overflow-hidden bg-[var(--yuzey)] rounded-2xl p-6 sm:p-8 border-4 border-[var(--cizgi)] shadow-[0_8px_0_var(--golge)] flex flex-wrap items-center justify-between gap-4">
          {/* Ana sayfadaki kitle motifi panel basliginda da: veli
              baloncuklari, egitmen takvim izgarasi. Ogrencininki zaten
              sayfa zemininde akiyor. */}
          <KitleDekoru />
          <div className="relative">
            <h1 className="dl-sayfa-basligi font-sans text-2xl sm:text-3xl font-black text-[var(--yazi)] leading-snug">
              {title}
            </h1>
            {description && <p className="mt-2 font-sans font-semibold text-[var(--yazi)]">{description}</p>}
          </div>
          {headerExtra}
        </div>

        {children}
      </div>
    </div>
  )
}
