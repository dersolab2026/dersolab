import type { CapacitorConfig } from '@capacitor/cli';

// DersoLab tamamen sunucu tarafında render edilen bir Next.js uygulaması
// (Server Actions, middleware, cookie tabanlı auth) olduğu için statik bir
// `next export` build'i Capacitor'a gömülemez. Bunun yerine "remote URL"
// modu kullanılıyor: native WebView, canlı https://dersolab.com adresini
// doğrudan ağ üzerinden yüklüyor.
const config: CapacitorConfig = {
  appId: 'com.dersolab.app',
  appName: 'DersoLab',
  webDir: 'www',
  backgroundColor: '#080B11',
  android: {
    allowMixedContent: false,
    captureInput: true,
    webContentsDebuggingEnabled: false,
  },
  server: {
    url: 'https://dersolab.com',
    androidScheme: 'https',
    errorPath: 'offline.html',
    allowNavigation: [
      'dersolab.com',
      '*.dersolab.com',
      // Supabase OAuth & Storage
      '*.supabase.co',
      // Shopier ödeme akışı
      'shopier.com',
      '*.shopier.com',
      // Google OAuth (Giriş & Takvim bağlama)
      'accounts.google.com',
      '*.google.com',
      // Canlı Ders Odası (Jitsi / 8x8 WebRTC)
      'meet.jit.si',
      '*.jitsi.net',
      '8x8.vc',
      '*.8x8.vc',
    ],
  },
};

export default config;
