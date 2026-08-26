import { Suspense } from 'react'
import { RegisterForm } from '@/components/auth/RegisterForm'

/**
 * RegisterForm `useSearchParams()` kullaniyor (?kitle= ile rolu onden
 * seciyor) ve Next bunu statik prerender sirasinda Suspense sinirinda
 * gormek istiyor; yoksa build "useSearchParams() should be wrapped in a
 * suspense boundary" diye kiriliyor.
 *
 * Bu eksiklik yeni degil, YENI GORUNUR OLDU: kok duzen tema icin
 * cookies() cagirdigi surece butun sayfalar dinamik render'a dusuyordu ve
 * statik prerender hic calismiyordu. Tema kapatilinca sayfalar statik
 * uretilebilir hale geldi ve eksik sinir ortaya cikti. Yan fayda: /register
 * artik gercekten statik uretiliyor.
 *
 * Yedek icerik forma degil KABUGA benziyor; boylece parametre cozulurken
 * ekran bos bir alan olarak degil, yuklenen bir sayfa olarak goruluyor.
 */
export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="min-h-screen w-full bg-[var(--zemin)]" />}>
      <RegisterForm />
    </Suspense>
  )
}
