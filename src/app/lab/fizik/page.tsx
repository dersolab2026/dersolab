import type { Metadata } from 'next'
import { FizikLabView } from '@/components/lab/fizik/FizikLabView'

export const metadata: Metadata = {
  title: 'FizikLab — Maarif Modeli, LGS & YKS Fizik Simülasyonları | DersoLab',
  description:
    'DersoLab Fizik Laboratuvarı: Maarif Modeli ve MEB müfredatına uygun interaktif mercek optiği ve ışın izleme, balistik eğik atış simülatörü, Ohm yasası ve elektrik devreleri.',
}

export default function FizikLabPage() {
  return <FizikLabView />
}
