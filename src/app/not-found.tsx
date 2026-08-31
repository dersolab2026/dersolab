import Link from 'next/link'
import { PIXEL_BUTTON_PRIMARY, PIXEL_BUTTON_SECONDARY, PIXEL_CARD } from '@/lib/theme'

export const metadata = {
  title: 'Sayfa bulunamadı — DersoLab',
}

/**
 * 404.
 *
 * Onceden Next.js'in kutudan cikan ekrani geliyordu: siyah-beyaz,
 * markasiz, sistem fontuyla ve "This page could not be found." diyerek —
 * bastan sona Turkce bir sitede, ustelik sayfanin kendisi lang="tr" derken.
 *
 * Cikmaz sokakta birakmiyoruz: en olasi uc yol veriliyor. Kirik bir
 * baglantidan gelen ziyaretcinin cogu ya ana sayfayi ya da giris
 * ekranini ariyor; ucuncusu de kaydolmadan denenebilen tek sey.
 */
export default function NotFound() {
  return (
    <div className="min-h-screen w-full bg-[#D5EAE3] flex items-center justify-center p-5">
      <div className={`${PIXEL_CARD} w-full max-w-lg p-8 text-center`}>
        <p className="font-mono text-5xl font-bold text-[#9C4A0C]">404</p>

        <h1 className="mt-4 text-2xl font-black text-[#1B2430]">Sayfa bulunamadı</h1>

        <p className="mt-3 font-semibold text-[#1B2430]/70">
          Aradığın sayfa taşınmış ya da hiç var olmamış olabilir. Adres doğruysa
          bağlantı eskimiş demektir.
        </p>

        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <Link href="/" className={`${PIXEL_BUTTON_PRIMARY} px-5 py-3`}>
            Ana Sayfa
          </Link>
          <Link href="/login" className={`${PIXEL_BUTTON_SECONDARY} px-5 py-3`}>
            Giriş Yap
          </Link>
          <Link href="/demo-ders" className={`${PIXEL_BUTTON_SECONDARY} px-5 py-3`}>
            Hoş Geldin Paketi
          </Link>
        </div>
      </div>
    </div>
  )
}
