import './globals.css'
import type { ReactNode } from 'react'
import { Inter, Chivo_Mono } from 'next/font/google'
import { WhatsAppButton } from '@/components/layout/WhatsAppButton'
import { NativeAuthBridge } from '@/components/native/NativeAuthBridge'
import { ToastProvider } from '@/components/ui/Toast'
import { TEMA_ACIK } from '@/lib/tema'
import { oturumTemasi } from '@/lib/tema-sunucu'

const inter = Inter({ subsets: ['latin', 'latin-ext'], variable: '--font-sans' })

/**
 * Arcade kimliği renkten önce TİPOGRAFİ.
 *
 * Öğrenci teması bu yazı tipi olmadan yalnızca "yeşile boyanmış site"
 * oluyordu.
 *
 * FONT SEÇİMİ ÖLÇÜMLE YAPILDI — değiştirmeden önce oku.
 *
 * Önce pixel fontlar denendi (vitrinde Press Start 2P vardı). Türkçe
 * aksanlı harfler yüzünden hiçbiri tutmadı. Taban çizgisine göre ölçüm,
 * 100px punto, aksanlı BÜYÜK harflerin satır hizasını bozma miktarı:
 *
 *   Press Start 2P    +0 / +13   ama Ö, Ü, İ GÖVDESİ KIRPIK (O=70 iken Ö=50)
 *   Share Tech Mono   +17 / +20
 *   Pixelify Sans     +18 / +19
 *   Jersey 10         +21 / +22
 *   VT323             +24 / +16
 *   Silkscreen        +26 / +25    -> ekranda "ş kocaman, ğ büyük"
 *   Micro 5           +27 / +27
 *
 * Press Start 2P'de aksan harfin İÇİNE sığdırılıyor: "Öğrenci" yazınca
 * baştaki Ö küçük harf gibi duruyordu. Büyük harfe çevirmek de,
 * çevirmemek de bunu çözmedi — sorun glifin kendisinde.
 *
 * Çözüm: gerçek bir monospace. Terminal kimliği zaten monospace'ten
 * geliyor, 8-bit'ten değil. Sekiz aday ölçüldü, hepsinde gövde tam boy.
 * Chivo Mono seçildi:
 *   - mürekkep yoğunluğu %30.1, Press Start 2P'ye (%31) en yakın —
 *     o tombul blok his korunuyor
 *   - aksan taşması en düşük: +19 / +20
 *   - vitrinin gövde fontu Chivo'ydu, aynı aile
 *
 * Etiket ve menü Inter kullanıyor; monospace o boyutta çok geniş.
 *
 * Google Fonts'a <link> ile gidilemiyor: uygulamanın CSP başlığı
 * `style-src 'self'` diyor ve harici stil dosyasını engelliyor.
 * next/font/google fontu derleme anında indirip sitenin kendi alan
 * adından servis ediyor, yani CSP'ye dokunmaya gerek kalmıyor.
 */
const ekran = Chivo_Mono({ subsets: ['latin', 'latin-ext'], weight: ['400', '700'], variable: '--font-ekran', display: 'swap' })

export const metadata = {
  title: 'DersoLab',
  description: 'Öğrenciler için online özel ders ve koçluk platformu',
}

export default async function RootLayout({ children }: { children: ReactNode }) {
  // Tema tek yerden: giris yapmis kullanici siteyi bastan sona kendi
  // dilinde goruyor, panel disindaki sayfalar dahil.
  //
  // TEMA_ACIK kapaliyken hic sorgu atilmiyor ve nitelik hic konmuyor;
  // gerekcesi src/lib/tema.ts icinde.
  const tema = TEMA_ACIK ? await oturumTemasi() : undefined

  return (
    <html lang="tr" className={`${inter.variable} ${ekran.variable}`} data-tema={tema}>
      <body>
        <ToastProvider>
          {children}
          <WhatsAppButton />
          <NativeAuthBridge />
        </ToastProvider>
      </body>
    </html>
  )
}
