import type { Metadata } from 'next'
import { LabHubView } from '@/components/lab/LabHubView'

export const metadata: Metadata = {
  title: 'DersoLab L.A.B. — Maarif Modeli Uyumlu Ortaokul & Lise Laboratuvarı',
  description:
    'DersoLab L.A.B. (Laboratuvar Destekli Akademik Başarı): Türkiye Yüzyılı Maarif Modeli ve MEB müfredatına tam uyumlu; ortaokul ve lise (5-12. sınıf) için 60 FPS simülasyonlar, 3D modeller ve beceri temelli interaktif atölyeler.',
  alternates: {
    canonical: '/lab',
  },
  openGraph: {
    title: 'DersoLab L.A.B. — Maarif Modeli Uyumlu Ortaokul & Lise Laboratuvarı',
    description:
      'Türkiye Yüzyılı Maarif Modeli ve MEB müfredatına uygun Fen, Matematik, Türkçe ve Sosyal Bilimler sanal deneyleri, 3D modeller ve interaktif atölyeler.',
    images: ['/opengraph-image.png'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'DersoLab L.A.B. — Maarif Modeli Uyumlu Ortaokul & Lise Laboratuvarı',
    description:
      'Türkiye Yüzyılı Maarif Modeli ve MEB müfredatına uygun Fen, Matematik, Türkçe ve Sosyal Bilimler sanal deneyleri, 3D modeller ve interaktif atölyeler.',
    images: ['/opengraph-image.png'],
  },
}

export default function LabPage() {
  return <LabHubView />
}
