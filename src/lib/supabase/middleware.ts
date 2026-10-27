import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          response = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const pathname = request.nextUrl.pathname

  // Korumalı İçerikler: Kayıt olmayan / giriş yapmayan kullanıcıların erişemeyeceği platform rotaları
  // Not: /demo-ders, /instructors, /kocluk ve /lab vitrin/dönüşüm sayfalarıdır; ziyaretçilere ve SEO'ya açıktır.
  const isProtectedContent =
    pathname.startsWith('/dashboard') ||
    pathname.startsWith('/admin') ||
    pathname.startsWith('/social') ||
    pathname.startsWith('/canli-ders') ||
    pathname.startsWith('/hesap-turu') ||
    pathname.startsWith('/terms/accept')

  if (!user && isProtectedContent) {
    const fullPath = pathname + request.nextUrl.search
    const redirectUrl = new URL('/login', request.url)
    redirectUrl.searchParams.set('redirect', fullPath)
    const redirectResponse = NextResponse.redirect(redirectUrl)
    response.cookies.getAll().forEach((cookie) => {
      redirectResponse.cookies.set(cookie)
    })
    return redirectResponse
  }

  // Giriş yapmış kullanıcının /login veya /register sayfalarına girmesini önle, hedef sayfaya yönlendir
  if (user && (pathname === '/login' || pathname === '/register')) {
    const redirectTarget = request.nextUrl.searchParams.get('redirect') || '/dashboard'
    const redirectResponse = NextResponse.redirect(new URL(redirectTarget, request.url))
    response.cookies.getAll().forEach((cookie) => {
      redirectResponse.cookies.set(cookie)
    })
    return redirectResponse
  }

  return response
}
