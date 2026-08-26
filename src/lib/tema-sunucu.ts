import { cache } from 'react'
import { cookies } from 'next/headers'
import type { UserRole } from '@/types'
import { createClient } from '@/lib/supabase/server'
import { ROL_TEMASI } from '@/lib/tema'

const GECERLI_TEMALAR = ['ogrenci', 'veli', 'egitmen'] as const

/**
 * Giris yapmis kullanicinin ROLUNDEN gelen tema. Oturum yoksa undefined.
 *
 * `oturumTemasi`den ayri duruyor cunku bazi yerlerin "bu tema secimle mi
 * geldi yoksa rolden mi" ayrimina ihtiyaci var: vitrin sekmeleri
 * ziyaretcinin secimini kok ogeye yaziyor, ama giris yapmis birinin
 * paletini sekmeye tiklamakla degistirmemeli.
 *
 * Iki maliyet onlemi:
 *  1. Oturum cerezi yoksa Supabase'e hic gidilmiyor. Anonim ziyaretci —
 *     ki vitrini gorenlerin cogu oyle — fazladan tek bir istek bile
 *     yapmiyor.
 *  2. cache(): ayni istek icinde birden fazla yerden cagrilsa da sorgu
 *     bir kez calisiyor.
 *
 * Rol `public.users` tablosundan okunuyor, JWT'deki user_metadata'dan
 * degil: kullanici metadata'yi kendisi degistirebiliyor ve hesap turu
 * secildikten sonra ikisi ayrisabiliyor.
 */
export const oturumRolTemasi = cache(async (): Promise<string | undefined> => {
  const cerezler = await cookies()

  const oturumVar = cerezler.getAll().some((c) => c.name.startsWith('sb-') && c.name.includes('auth-token'))
  if (!oturumVar) return undefined

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return undefined

  const { data } = await supabase.from('users').select('role').eq('id', user.id).single()
  return data?.role ? ROL_TEMASI[data.role as UserRole] : undefined
})

/** Ziyaretcinin vitrinde sectigi kitle. Dogrulanmamis deger yok sayiliyor. */
export const secilenTema = cache(async (): Promise<string | undefined> => {
  const secim = (await cookies()).get('dersolab-kitle')?.value
  return (GECERLI_TEMALAR as readonly string[]).includes(secim ?? '') ? secim : undefined
})

/**
 * Sayfanin tasarim dili.
 *
 * Kok duzende cagriliyor, yani SITENIN TAMAMI icin gecerli: giris yapmis
 * bir ogrenci "Hakkimizda"ya da "Gizlilik"e de kendi paletinde bakiyor.
 * Eskiden tema yalnizca panel ve pazar yeri duzenlerindeydi, o yuzden
 * aradaki sayfalarda marka paletine dusuyordu.
 *
 * Oncelik rolde: oturum acikken vitrin sekmesine tiklamak kullanicinin
 * kendi paletini kalici olarak degistirmiyor.
 *
 * Neden cerez: tema bilgisini baglantiya parametre olarak eklemek
 * yetmiyordu. Ziyaretci hos geldin paketine gidip oradan girise
 * tikladiginda ya da giristen "sifremi unuttum"a gectiginde parametre
 * kayboluyor ve palet marka rengine dusuyordu. Her ic baglantiya
 * parametre eklemek surdurulebilir degil; cerez bir kez yaziliyor,
 * sunucu her sayfada okuyor.
 *
 * Bu bir GORUNUM tercihi, yetki degil: icerigi yalnizca hangi paletin
 * gosterilecegini soyluyor ve degeri beyaz listeye karsi dogrulaniyor.
 * Rol denetimleri her zaman sunucu tarafinda, oturumdan yapiliyor.
 */
export const oturumTemasi = cache(async (): Promise<string | undefined> => {
  return (await oturumRolTemasi()) ?? (await secilenTema())
})
