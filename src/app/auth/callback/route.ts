import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { createClient } from '@/lib/supabase/server'
import { OAUTH_NOT_CEREZI, notuOku, notuUygula } from '@/lib/auth/oauth-hint'

/**
 * Google (OAuth) donus adresi.
 *
 * Onceki surum hatayi tamamen yutuyordu: kullanici sessizce login'e
 * donuyordu ve sebebi hicbir yerde gorunmuyordu. Artik her basarisizlik
 * sunucu loguna sebebiyle yaziliyor (Vercel > Logs). Kullaniciya giden
 * URL'de yine ayrinti yok — sebep sadece bize lazim.
 *
 * Yonlendirme tabani icin once NEXT_PUBLIC_APP_URL kullaniliyor:
 * request.nextUrl.origin vekil (proxy) arkasinda ic adresi verebiliyor ve
 * o durumda oturum cerezi tasinmiyor.
 */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = request.nextUrl
  const taban = origin
  const next = searchParams.get('next') ?? '/dashboard'

  // Google kendi tarafinda reddettiyse kod hic gelmiyor, hata parametreleri geliyor.
  const saglayiciHatasi = searchParams.get('error')
  if (saglayiciHatasi) {
    console.error('OAuth callback: saglayici reddetti', {
      error: saglayiciHatasi,
      description: searchParams.get('error_description'),
    })
    return NextResponse.redirect(`${taban}/login?error=auth_callback_failed`)
  }

  const code = searchParams.get('code')
  if (!code) {
    console.error('OAuth callback: kod yok', { url: request.nextUrl.pathname + request.nextUrl.search })
    return NextResponse.redirect(`${taban}/login?error=auth_callback_failed`)
  }

  const supabase = await createClient()
  const { data, error } = await supabase.auth.exchangeCodeForSession(code)

  if (error) {
    // En sik sebep: PKCE dogrulayici cerezi yok/eskimis, donus adresi
    // Supabase'in izin listesinde degil, ya da hesap banli (silinmis).
    console.error('OAuth callback: kod takasi basarisiz', {
      message: error.message,
      status: error.status,
      code: error.code,
    })
    return NextResponse.redirect(`${taban}/login?error=auth_callback_failed`)
  }

  // Kayit formundaki secimi uygula: hesap turu + KVKK onayi. Boylece
  // kullanici ayni iki soruyla ikinci kez karsilasmiyor.
  const cerezler = await cookies()
  const not = notuOku(cerezler.get(OAUTH_NOT_CEREZI)?.value)
  if (not && data.user) {
    try {
      await notuUygula(data.user.id, not)
    } catch (e) {
      // Not uygulanamazsa giris yine de tamamlanir; kullanici
      // /hesap-turu ve /terms/accept ekranlarina duser.
      console.error('OAuth callback: not uygulanamadi', e)
    }
  }

  const yanit = NextResponse.redirect(`${taban}${next}`)
  if (not) yanit.cookies.delete(OAUTH_NOT_CEREZI)
  return yanit
}
