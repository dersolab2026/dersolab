import type { Metadata } from 'next'
import { KimyaLabView } from '@/components/lab/KimyaLabView'

export const metadata: Metadata = {
  title: 'KimyaLab — İnteraktif YKS Kimya Simülasyonları & 3D Periyodik Tablo | DersoLab',
  description:
    'DersoLab Kimya Laboratuvarı: 3D atom orbital görselleştirici, sanal asit-baz titrasyon deneyi, YKS ÖSYM hap bilgileri ve Kimya-Le mini oyunu.',
}

export default function KimyaLabPage() {
  return <KimyaLabView />
}
