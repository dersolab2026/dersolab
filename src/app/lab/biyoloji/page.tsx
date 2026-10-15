import type { Metadata } from 'next'
import { BiyolojiLabView } from '@/components/lab/biyoloji/BiyolojiLabView'

export const metadata: Metadata = {
  title: 'BiyolojiLab — İnteraktif YKS & TYT/AYT Biyoloji Simülasyonları | DersoLab',
  description:
    'DersoLab Biyoloji Laboratuvarı: Mendel Punnett karesi kalıtım simülatörü, kan grubu çaprazlamaları ve DNA protein sentezi kodon atölyesi.',
}

export default function BiyolojiLabPage() {
  return <BiyolojiLabView />
}
