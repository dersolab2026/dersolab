import type { Metadata } from 'next'
import { MatematikLabView } from '@/components/lab/matematik/MatematikLabView'

export const metadata: Metadata = {
  title: 'MatematikLab — Maarif Modeli, 5-12. Sınıf Matematik Simülasyonları | DersoLab',
  description:
    'DersoLab Matematik Laboratuvarı: Maarif Modeli 5-8. sınıf ortaokul kesirler, tam sayılar, denklem terazisi, LGS Pisagor ve 11-12. sınıf lise trigonometri ile türev simülatörleri.',
}

export default function MatematikLabPage() {
  return <MatematikLabView />
}
