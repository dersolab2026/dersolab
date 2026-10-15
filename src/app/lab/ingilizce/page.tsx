import type { Metadata } from 'next'
import { IngilizceLabView } from '@/components/lab/ingilizce/IngilizceLabView'

export const metadata: Metadata = {
  title: 'İngilizceLab — Google Little Language Lessons İlhamlı İnteraktif Dil Atölyesi | DersoLab',
  description:
    'DersoLab İngilizce Laboratuvarı: Google LLL ilhamlı durumsal mikro dersler (Tiny Lessons), sokak jargonu & deyimler (Slang Hang), fonetik telaffuz antrenörü ve görsel sahne kelime avcısı.',
}

export default function IngilizceLabPage() {
  return <IngilizceLabView />
}
