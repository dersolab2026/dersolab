import type { NextConfig } from 'next'

const SUPABASE_ORIGIN = 'https://nkqifjcyudvwfaehgtgp.supabase.co'

const isDev = process.env.NODE_ENV === 'development'

const CSP = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline' https://meet.jit.si https://8x8.vc${isDev ? " 'unsafe-eval' https://esm.sh" : ''}`,
  "style-src 'self' 'unsafe-inline'",
  `img-src 'self' data: blob: ${SUPABASE_ORIGIN} https://img.youtube.com https://i.ytimg.com https://*.googleusercontent.com https://lh3.googleusercontent.com https://meet.jit.si https://8x8.vc https://*.mzstatic.com https://upload.wikimedia.org https://covers.openlibrary.org https://*.tiktokcdn.com https://*.tiktokcdn-eu.com https://*.tiktokcdn-us.com`,
  `media-src 'self' ${SUPABASE_ORIGIN} blob:`,
  "font-src 'self' data:",
  `connect-src 'self' ${SUPABASE_ORIGIN} wss://nkqifjcyudvwfaehgtgp.supabase.co https://meet.jit.si https://*.jitsi.net wss://*.jitsi.net https://8x8.vc wss://8x8.vc${isDev ? ' ws://localhost:* wss://localhost:*' : ''}`,
  "frame-src 'self' https://www.youtube.com https://player.vimeo.com https://meet.jit.si https://8x8.vc",
  "frame-ancestors 'self'",
  "form-action 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  'upgrade-insecure-requests',
].join('; ')

const nextConfig: NextConfig = {
  poweredByHeader: false,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'nkqifjcyudvwfaehgtgp.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'img.youtube.com',
      },
    ],
  },
  async redirects() {
    return [
      { source: '/about', destination: '/hakkimizda', permanent: true },
      { source: '/rehberlik', destination: '/kocluk', permanent: true },
      { source: '/ucretsiz-kocluk', destination: '/demo-ders', permanent: true },
      { source: '/demo-lessons', destination: '/demo-ders', permanent: true },
      { source: '/marketplace', destination: '/instructors', permanent: true },
      { source: '/giris', destination: '/login', permanent: true },
      { source: '/auth/giris', destination: '/login', permanent: true },
      { source: '/kayit', destination: '/register', permanent: true },
    ]
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          {
            key: 'Permissions-Policy',
            value:
              'camera=(self "https://meet.jit.si" "https://8x8.vc"), microphone=(self "https://meet.jit.si" "https://8x8.vc"), display-capture=(self "https://meet.jit.si" "https://8x8.vc"), geolocation=()',
          },
          { key: 'Cross-Origin-Opener-Policy', value: 'same-origin-allow-popups' },
          { key: 'Cross-Origin-Resource-Policy', value: 'same-site' },
          { key: 'X-DNS-Prefetch-Control', value: 'off' },
          { key: 'Origin-Agent-Cluster', value: '?1' },
          { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
          { key: 'X-Permitted-Cross-Domain-Policies', value: 'none' },
          { key: 'Content-Security-Policy', value: CSP },
        ],
      },
      {
        // E-posta istemcileri, Shopier ve WhatsApp/Telegram önizlemeleri marka/OG görsellerini çapraz kökenden çekebilsin
        source: '/:path*.(png|jpg|jpeg|gif|webp|svg|ico)',
        headers: [{ key: 'Cross-Origin-Resource-Policy', value: 'cross-origin' }],
      },
    ]
  },
}

export default nextConfig
