import type { CapacitorConfig } from '@capacitor/cli';

// DersoLab tamamen sunucu tarafında render edilen bir Next.js uygulaması
// (Server Actions, middleware, cookie tabanlı auth) olduğu için statik bir
// `next export` build'i Capacitor'a gömülemez. Bunun yerine "remote URL"
// modu kullanılıyor: native WebView, canlı https://dersolab.com adresini
// doğrudan ağ üzerinden yüklüyor. `webDir` altındaki içerik sadece
// Capacitor CLI'nin gerektirdiği bir yer tutucu, gerçekte kullanılmıyor.
const config: CapacitorConfig = {
  appId: 'com.dersolab.app',
  appName: 'DersoLab',
  webDir: 'www',
  server: {
    url: 'https://dersolab.com',
    androidScheme: 'https',
    allowNavigation: [
      'dersolab.com',
      '*.dersolab.com',
      // Shopier ödeme akışı (satın alma checkout'u dış domain'e yönlendiriyor)
      'shopier.com',
      '*.shopier.com',
      // Google OAuth (Takvim bağlama) rıza ekranı
      'accounts.google.com',
      '*.google.com',
    ],
  },
};

export default config;
