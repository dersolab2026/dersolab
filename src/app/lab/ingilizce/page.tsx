import type { Metadata } from 'next'
import { IngilizceLabView } from '@/components/lab/ingilizce/IngilizceLabView'

export const metadata: Metadata = {
  title: 'İngilizceLab — İnteraktif Konuşma & Dil Atölyesi',
  description:
    'DersoLab İngilizce Laboratuvarı: Durumsal konuşma senaryoları, yaşayan sokak jargonu ve deyimler, fonetik telaffuz antrenörü ve görsel sahne nesne sözlüğü.',
  alternates: {
    canonical: '/lab/ingilizce',
  },
}

export default function IngilizceLabPage() {
  return <IngilizceLabView />
}
