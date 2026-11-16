import type { Metadata } from 'next'
import { TurkceLabView } from '@/components/lab/turkce/TurkceLabView'

export const metadata: Metadata = {
  title: 'TürkçeLab — Biyonik Hızlı Okuma, TDK & Edebiyat Atölyesi',
  description:
    'DersoLab Türkçe & Edebiyat Laboratuvarı: Maarif Modeli uyumlu Biyonik paragraf hız antrenörü, MEB yazar-eser eşleştirme oyunu, canlı TDK günün kelimesi ve ses olayları dedektifi.',
  alternates: {
    canonical: '/lab/turkce',
  },
}

export default function TurkceLabPage() {
  return <TurkceLabView />
}
