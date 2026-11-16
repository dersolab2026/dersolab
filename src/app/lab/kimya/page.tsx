import type { Metadata } from 'next'
import { KimyaLabView } from '@/components/lab/KimyaLabView'

export const metadata: Metadata = {
  title: 'KimyaLab — 3D Bohr Atom Modeli, Periyodik Cetvel & Titrasyon',
  description:
    'DersoLab Kimya Laboratuvarı: MEB ve Maarif Modeli uyumlu 3D Bohr atom modeli ve katman elektron dağılımı, sanal asit-baz titrasyon deneyi ve Kimya-Le oyunu.',
  alternates: {
    canonical: '/lab/kimya',
  },
}

export default function KimyaLabPage() {
  return <KimyaLabView />
}
