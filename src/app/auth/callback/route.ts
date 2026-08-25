import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

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
  const taban = process.env.NEXT_PUBLIC_APP_URL || origin
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
  const { error } = await supabase.auth.exchangeCodeForSession(code)

  if (error) {
    // En sik sebep: PKCE dogrulayici cerezi yok/eskimis, ya da donus
    // adresi Supabase'in izin listesinde degil.
    console.error('OAuth callback: kod takasi basarisiz', {
      message: error.message,
      status: error.status,
      code: error.code,
    })
    return NextResponse.redirect(`${taban}/login?error=auth_callback_failed`)
  }

  return NextResponse.redirect(`${taban}${next}`)
}
