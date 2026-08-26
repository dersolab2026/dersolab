import Link from 'next/link'
import { Check } from 'lucide-react'
import { PIXEL_CARD } from '@/lib/theme'

export interface CompletenessItem {
  label: string
  done: boolean
  href?: string
}

interface ProfileCompletenessProps {
  items: CompletenessItem[]
}

export function ProfileCompleteness({ items }: ProfileCompletenessProps) {
  const doneCount = items.filter((i) => i.done).length
  const percent = Math.round((doneCount / items.length) * 100)
  const eksikler = items.filter((i) => !i.done)

  return (
    <div className={`${PIXEL_CARD} p-5 space-y-3`}>
      <div className="flex items-end justify-between gap-3">
        <div>
          <p className="font-bold text-[var(--yazi)]">Profil Doluluğu</p>
          <p className="text-sm font-semibold text-[var(--yazi)]/70">
            {percent === 100
              ? 'Profilin eksiksiz — öğrenciler seni tam olarak görüyor.'
              : 'Dolu profiller belirgin şekilde daha çok tercih ediliyor.'}
          </p>
        </div>
        <span className="shrink-0 text-2xl font-black text-[var(--yazi)]">%{percent}</span>
      </div>

      <div className="h-4 w-full overflow-hidden rounded-full border-2 border-[var(--cizgi)] bg-[var(--yuzey-ic)]">
        <div
          className="h-full bg-[var(--ikincil-zemin)] transition-[width] duration-500 ease-out"
          style={{ width: `${percent}%` }}
        />
      </div>

      <ul className="flex flex-wrap gap-2">
        {items.map((item) => {
          const icerik = (
            <span
              className={`flex items-center gap-1.5 rounded-lg border-2 border-[var(--cizgi)] px-2 py-1 text-xs font-bold ${
                item.done ? 'bg-[var(--ikincil-zemin)]/25 text-[var(--yazi)]' : 'bg-[var(--yuzey-ic)] text-[var(--yazi)]/60'
              }`}
            >
              {item.done && <Check className="h-3 w-3" strokeWidth={3} />}
              {item.label}
            </span>
          )
          return (
            <li key={item.label}>
              {!item.done && item.href ? <Link href={item.href}>{icerik}</Link> : icerik}
            </li>
          )
        })}
      </ul>

      {eksikler.length > 0 && (
        <p className="text-xs font-semibold text-[var(--yazi)]/60">
          Eksik olanların üstüne tıklayarak tamamlayabilirsin.
        </p>
      )}
    </div>
  )
}
