import Link from 'next/link'
import { Check } from 'lucide-react'
import { PIXEL_CARD } from '@/lib/theme'

interface OnboardingStep {
  label: string
  href: string
  done: boolean
}

interface OnboardingChecklistProps {
  steps: OnboardingStep[]
}

export function OnboardingChecklist({ steps }: OnboardingChecklistProps) {
  if (steps.every((s) => s.done)) return null

  return (
    <div className={`${PIXEL_CARD} p-5 space-y-3`}>
      <h2 className="font-bold text-[#1B2430]">İlk Adımlar</h2>
      <p className="text-sm font-semibold text-[#1B2430]/70">
        Öğrenciler seni bulup ders alabilsin diye şu adımları tamamla.
      </p>
      <div className="space-y-2">
        {steps.map((step) => (
          <Link
            key={step.href}
            href={step.href}
            className={`flex items-center gap-3 rounded-xl border-2 border-[#1B2430] p-3 transition-all ${
              step.done ? 'bg-[#6FA89E]/20' : 'bg-white hover:-translate-y-0.5'
            }`}
          >
            <span
              className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md border-2 border-[#1B2430] ${
                step.done ? 'bg-[#6FA89E]' : 'bg-white'
              }`}
            >
              {step.done && <Check className="h-4 w-4 text-white" strokeWidth={3} />}
            </span>
            <span className={`text-sm font-bold text-[#1B2430] ${step.done ? 'line-through opacity-60' : ''}`}>
              {step.label}
            </span>
          </Link>
        ))}
      </div>
    </div>
  )
}
