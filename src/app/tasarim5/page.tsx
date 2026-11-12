import type { Metadata } from 'next'
import { ModernAcademyView } from '@/components/home/designs/ModernAcademy/ModernAcademyView'

export const metadata: Metadata = {
  title: 'DersoLab — Modern Academy & Bento Edition (21st.dev + Aceternity UI)',
  description: 'Türkiye’nin seçkin zümre hocalarından 1-e-1 canlı özel ders ve derece koçluğu platformu. Akıllı Eşleşme Sihirbazı, Sesli Tanıtım Kartı, Yanmayan Kredi Cüzdanı.',
}

export default function Tasarim5Page() {
  return <ModernAcademyView />
}
