import Link from 'next/link'
import { Check, ArrowRight, Sparkles } from 'lucide-react'
import { PIXEL_CARD } from '@/lib/theme'

export interface OnboardingStep {
  label: string
  href: string
  done: boolean
  tip?: string
}

interface OnboardingChecklistProps {
  steps: OnboardingStep[]
}

export function OnboardingChecklist({ steps }: OnboardingChecklistProps) {
  const doneCount = steps.filter((s) => s.done).length
  const percent = Math.round((doneCount / steps.length) * 100)

  if (percent === 100) return null

  return (
    <div className={`${PIXEL_CARD} p-5 space-y-4`}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b-2 border-[#1B2430]/10">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-lg">🎯</span>
            <h2 className="font-black text-base text-[#1B2430]">Profil Doluluğu ve İlk Adımlar</h2>
          </div>
          <p className="text-xs font-semibold text-[#1B2430]/70 mt-0.5">
            Dolu profiller öğrenciler tarafından çok daha fazla tercih edilir ve hızlı ders rezervasyonu alır.
          </p>
        </div>
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <span className="text-2xl font-black text-[#DD7B3A]">%{percent}</span>
          <span className="text-xs font-bold text-[#1B2430]/60">tamamlandı</span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="h-3.5 w-full overflow-hidden rounded-full border-2 border-[#1B2430] bg-white">
        <div
          className="h-full bg-[#DD7B3A] transition-[width] duration-500 ease-out"
          style={{ width: `${percent}%` }}
        />
      </div>

      {/* Steps List */}
      <div className="grid gap-2 sm:grid-cols-2">
        {steps.map((step) => (
          <Link
            key={step.label}
            href={step.href}
            className={`group flex items-center justify-between gap-3 rounded-xl border-2 border-[#1B2430] p-3 transition-all ${
              step.done
                ? 'bg-[#6FA89E]/20 opacity-75'
                : 'bg-white hover:-translate-y-0.5 hover:shadow-[0_3px_0_#1B2430]'
            }`}
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <span
                className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md border-2 border-[#1B2430] ${
                  step.done ? 'bg-[#6FA89E]' : 'bg-white'
                }`}
              >
                {step.done && <Check className="h-3.5 w-3.5 text-white" strokeWidth={3} />}
              </span>
              <div className="truncate">
                <span className={`text-xs font-bold text-[#1B2430] block truncate ${step.done ? 'line-through opacity-70' : ''}`}>
                  {step.label}
                </span>
                {step.tip && !step.done && (
                  <span className="text-[10px] font-semibold text-[#1B2430]/60 block truncate">{step.tip}</span>
                )}
              </div>
            </div>
            {!step.done && (
              <ArrowRight className="h-3.5 w-3.5 text-[#1B2430]/40 group-hover:text-[#DD7B3A] group-hover:translate-x-0.5 transition-all shrink-0" />
            )}
          </Link>
        ))}
      </div>
    </div>
  )
}
