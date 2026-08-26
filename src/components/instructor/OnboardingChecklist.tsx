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
      <h2 className="font-bold text-[var(--yazi)]">İlk Adımlar</h2>
      <p className="text-sm font-semibold text-[var(--yazi)]/70">
        Öğrenciler seni bulup ders alabilsin diye şu adımları tamamla.
      </p>
      <div className="space-y-2">
        {steps.map((step) => (
          <Link
            key={step.href}
            href={step.href}
            className={`flex items-center gap-3 rounded-xl border-2 border-[var(--cizgi)] p-3 transition-all ${
              step.done ? 'bg-[var(--ikincil-zemin)]/20' : 'bg-[var(--yuzey-ic)] hover:-translate-y-0.5'
            }`}
          >
            <span
              className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md border-2 border-[var(--cizgi)] ${
                step.done ? 'bg-[var(--ikincil-zemin)]' : 'bg-[var(--yuzey-ic)]'
              }`}
            >
              {step.done && <Check className="h-4 w-4 text-[var(--yazi-ters)]" strokeWidth={3} />}
            </span>
            <span className={`text-sm font-bold text-[var(--yazi)] ${step.done ? 'line-through opacity-60' : ''}`}>
              {step.label}
            </span>
          </Link>
        ))}
      </div>
    </div>
  )
}
