import type { Metadata } from 'next'
import { MatematikLabView } from '@/components/lab/matematik/MatematikLabView'

export const metadata: Metadata = {
  title: 'MatematikLab — İnteraktif YKS & AYT Matematik Simülasyonları | DersoLab',
  description:
    'DersoLab Matematik Laboratuvarı: 360° interaktif trigonometrik birim çember, canlı sinüs dalgası ve türev teğet eğimi simülatörü.',
}

export default function MatematikLabPage() {
  return <MatematikLabView />
}
