import type { Metadata } from 'next'
import { SosyalLabView } from '@/components/lab/sosyal/SosyalLabView'

export const metadata: Metadata = {
  title: 'SosyalLab — Maarif Modeli, Ortaokul & Lise Sosyal Bilimler Laboratuvarı | DersoLab',
  description:
    'DersoLab Sosyal Bilimler Laboratuvarı: Maarif Modeli ve MEB uyumlu interaktif 81 il Türkiye fiziki & iklim atlası, KAYIP SAKAL rüzgârları ve kronolojik tarih zaman çizelgesi.',
}

export default function SosyalLabPage() {
  return <SosyalLabView />
}
