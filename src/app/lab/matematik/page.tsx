import type { Metadata } from 'next'
import { MatematikLabView } from '@/components/lab/matematik/MatematikLabView'

export const metadata: Metadata = {
  title: 'MatematikLab — Maarif Modeli, Ortaokul & Lise Matematik Simülasyonları | DersoLab',
  description:
    'DersoLab Matematik Laboratuvarı: Maarif Modeli ve MEB uyumlu 360° interaktif trigonometrik birim çember, canlı sinüs dalgası ve türev teğet eğimi simülatörü.',
}

export default function MatematikLabPage() {
  return <MatematikLabView />
}
