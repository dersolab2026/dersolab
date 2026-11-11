import type { Metadata } from 'next'
import { DersoLabTasteView } from '@/components/home/designs/TasteCraft/DersoLabTasteView'

export const metadata: Metadata = {
  title: 'DersoLab — Avant-Garde Taste & Impeccable Edition (3D Three.js + GSAP)',
  description: 'AI slop ve mor degrade klişelerinden arındırılmış, 3D WebGL ve GSAP destekli yeni nesil DersoLab arayüzü.',
}

export default function Tasarim4Page() {
  return <DersoLabTasteView />
}
