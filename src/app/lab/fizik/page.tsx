import type { Metadata } from 'next'
import { FizikLabView } from '@/components/lab/fizik/FizikLabView'

export const metadata: Metadata = {
  title: 'FizikLab — İnteraktif YKS & LGS Fizik Simülasyonları | DersoLab',
  description:
    'DersoLab Fizik Laboratuvarı: Mercek optiği ve ışın izleme, balistik eğik atış simülatörü, Ohm yasası ve sanal elektrik devreleri.',
}

export default function FizikLabPage() {
  return <FizikLabView />
}
