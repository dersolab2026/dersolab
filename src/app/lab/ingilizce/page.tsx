import type { Metadata } from 'next'
import { IngilizceLabView } from '@/components/lab/ingilizce/IngilizceLabView'

export const metadata: Metadata = {
  title: 'İngilizceLab — İnteraktif Konuşma & Dil Atölyesi | DersoLab',
  description:
    'DersoLab İngilizce Laboratuvarı: Durumsal konuşma senaryoları, yaşayan sokak jargonu ve deyimler, fonetik telaffuz antrenörü ve görsel sahne nesne sözlüğü.',
}

export default function IngilizceLabPage() {
  return <IngilizceLabView />
}
