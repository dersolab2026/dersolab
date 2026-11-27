import type { Metadata } from 'next'
import { KimyaLabView } from '@/components/lab/KimyaLabView'

export const metadata: Metadata = {
  title: 'KimyaLab — 59 Deney & 8 Gösteri, 3D Bohr Atom, Titrasyon & Maarif Tezgâhı',
  description:
    'DersoLab Kimya Laboratuvarı: MEB Türkiye Yüzyılı Maarif Modeli uyumlu 59 etkileşimli deney ve 8 gösteri içeren Sanal Kimya Tezgâhı, 3D Bohr atom modeli, gaz yasaları, titrasyon ve Kimya-Le.',
  alternates: {
    canonical: '/lab/kimya',
  },
}

export default function KimyaLabPage() {
  return <KimyaLabView />
}
