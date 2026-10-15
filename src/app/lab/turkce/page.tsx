import type { Metadata } from 'next'
import { TurkceLabView } from '@/components/lab/turkce/TurkceLabView'

export const metadata: Metadata = {
  title: 'TürkçeLab — Bionic Hızlı Paragraf Okuma & AYT Edebiyat Oyunu',
  description:
    'DersoLab Türkçe & Edebiyat Laboratuvarı: Bionic paragraf hız antrenörü, AYT Edebiyat yazar-eser eşleştirme oyunu ve ses olayları dedektifi.',
}

export default function TurkceLabPage() {
  return <TurkceLabView />
}
