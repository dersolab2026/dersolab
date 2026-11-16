import type { Metadata } from 'next'
import { BiyolojiLabView } from '@/components/lab/biyoloji/BiyolojiLabView'

export const metadata: Metadata = {
  title: 'BiyolojiLab — Maarif Modeli, Ortaokul & Lise Biyoloji Simülasyonları',
  description:
    'DersoLab Biyoloji Laboratuvarı: Maarif Modeli ve MEB müfredatına uygun Mendel Punnett karesi kalıtım simülatörü, kan grubu çaprazlamaları ve DNA protein sentezi kodon atölyesi.',
  alternates: {
    canonical: '/lab/biyoloji',
  },
}

export default function BiyolojiLabPage() {
  return <BiyolojiLabView />
}
