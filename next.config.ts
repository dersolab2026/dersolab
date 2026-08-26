import type { NextConfig } from "next";

const SUPABASE_ORIGIN = "https://nkqifjcyudvwfaehgtgp.supabase.co";

const isDev = process.env.NODE_ENV === 'development';

const CSP = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval' https://esm.sh" : ''}`,
  "style-src 'self' 'unsafe-inline'",
  `img-src 'self' data: blob: ${SUPABASE_ORIGIN} https://img.youtube.com`,
  `media-src 'self' ${SUPABASE_ORIGIN}`,
  "font-src 'self' data:",
  `connect-src 'self' ${SUPABASE_ORIGIN}${isDev ? ' ws://localhost:* wss://localhost:*' : ''}`,
  "frame-src https://www.youtube.com https://player.vimeo.com",
  "frame-ancestors 'none'",
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
      // Rehberlik sayfasi Kocluk olarak yeniden adlandirildi; eski baglantilar kirilmasin.
      { source: '/rehberlik', destination: '/kocluk', permanent: true },
      // 1 haftalik ucretsiz kocluk urun karariyla kaldirildi
      // (20260824213000_remove_free_coaching_and_referral.sql), sayfasi da
      // birlikte gitti. Eski baglantilar Hos Geldin Paketine dusuyor.
      //
      // Burada, app/ agacinda redirect() yapan bir page.tsx olarak degil:
      // o yol gecici (307) yonlendirme uretiyordu ve kalici olarak kaldirilmis
      // bir adres icin dogru sinyal kalici (308) olan. Ayrica rota agacinda
      // durdugu surece "ayri bir sayfa var" izlenimi veriyordu.
      { source: '/ucretsiz-kocluk', destination: '/demo-ders', permanent: true },
    ];
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
          { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },
          { key: 'Cross-Origin-Resource-Policy', value: 'same-origin' },
          { key: 'X-DNS-Prefetch-Control', value: 'off' },
          { key: 'Origin-Agent-Cluster', value: '?1' },
          { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
          { key: 'Content-Security-Policy', value: CSP },
        ],
      },
    ];
  },
};

export default nextConfig;
