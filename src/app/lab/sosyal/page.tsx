import type { Metadata } from 'next'
import { SosyalLabView } from '@/components/lab/sosyal/SosyalLabView'

export const metadata: Metadata = {
  title: 'SosyalLab — İnteraktif YKS Coğrafya Atlası & Tarih Çizelgesi | DersoLab',
  description:
    'DersoLab Sosyal Bilimler Laboratuvarı: İnteraktif Türkiye iklim & fay hatları haritası, KAYIP SAKAL rüzgârları ve kronolojik tarih zaman çizelgesi.',
}

export default function SosyalLabPage() {
  return <SosyalLabView />
}
