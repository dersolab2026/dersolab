import type { Metadata } from 'next'
import { NetSimulatorClient } from '@/components/calculator/NetSimulatorClient'

export const metadata: Metadata = {
  title: 'YKS & LGS Hedef Net ve Puan Simülatörü | DersoLab',
  description:
    'Hedeflediğin üniversite veya lise için kaç net gerekiyor? TYT, AYT ve LGS netlerini gir, hedef farkını ve sana özel L.A.B. simülasyon reçetesini anında gör.',
}

export default function HesaplamaPage() {
  return <NetSimulatorClient />
}
