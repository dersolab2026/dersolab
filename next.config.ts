import type { NextConfig } from "next";

const SUPABASE_ORIGIN = "https://nkqifjcyudvwfaehgtgp.supabase.co";

const isDev = process.env.NODE_ENV === 'development';

const CSP = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline' https://meet.jit.si https://8x8.vc${isDev ? " 'unsafe-eval' https://esm.sh" : ''}`,
  "style-src 'self' 'unsafe-inline'",
  `img-src 'self' data: blob: ${SUPABASE_ORIGIN} https://img.youtube.com https://*.googleusercontent.com https://lh3.googleusercontent.com https://meet.jit.si https://8x8.vc`,
  `media-src 'self' ${SUPABASE_ORIGIN} blob:`,
  "font-src 'self' data:",
  `connect-src 'self' ${SUPABASE_ORIGIN} wss://nkqifjcyudvwfaehgtgp.supabase.co https://meet.jit.si https://*.jitsi.net wss://*.jitsi.net https://8x8.vc wss://8x8.vc${isDev ? ' ws://localhost:* wss://localhost:*' : ''}`,
  "frame-src 'self' https://www.youtube.com https://player.vimeo.com https://meet.jit.si https://8x8.vc",
  "frame-ancestors 'self'",
  "form-action 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  'upgrade-insecure-requests',
  'block-all-mixed-content',
].join('; ');

const nextConfig: NextConfig = {
  poweredByHeader: false,
  async redirects() {
    return [
      // Eski /about baglantisi /hakkimizda sayfasina yonlendirilsin
      { source: '/about', destination: '/hakkimizda', permanent: true },
      // Rehberlik sayfasi Kocluk olarak yeniden adlandirildi; eski baglantilar kirilmasin.
      { source: '/rehberlik', destination: '/kocluk', permanent: true },
      // 1 haftalik ucretsiz kocluk urun karariyla kaldirildi
      // (20260824213000_remove_free_coaching_and_referral.sql), sayfasi da
      // birlikte gitti. Eski baglantilar Hos Geldin Paketine dusuyor.
      { source: '/ucretsiz-kocluk', destination: '/demo-ders', permanent: true },
    ];
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(self "https://meet.jit.si" "https://8x8.vc"), microphone=(self "https://meet.jit.si" "https://8x8.vc"), display-capture=(self "https://meet.jit.si" "https://8x8.vc"), geolocation=()' },
          { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },
          { key: 'Cross-Origin-Resource-Policy', value: 'same-origin' },
          { key: 'X-DNS-Prefetch-Control', value: 'off' },
          { key: 'Origin-Agent-Cluster', value: '?1' },
          { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
          { key: 'X-Permitted-Cross-Domain-Policies', value: 'none' },
          { key: 'Content-Security-Policy', value: CSP },
        ],
      },
    ];
  },
};

export default nextConfig;
