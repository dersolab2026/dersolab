# DersoLab Android Uygulaması (Capacitor)

Bu proje, `dersolab.com`'u native bir Android sarmalayıcı (Capacitor) içinde
gösterir. Uygulama ayrı bir kod tabanı değildir — WebView doğrudan canlı
siteyi yükler (`capacitor.config.ts` → `server.url`), yani sitede olan her
şey uygulamada da otomatik olarak vardır. Yeni bir Vercel deploy'u yaptığında
uygulamayı yeniden build etmene bile gerek yok, WebView her açılışta canlı
siteyi çeker.

## Gereken kurulum (senin bilgisayarında)

Bu geliştirme ortamında Java/Android SDK kurulu değil, bu yüzden native APK'yı
buradan derleyemiyorum. Yapman gerekenler:

1. [Android Studio](https://developer.android.com/studio) indir ve kur
   (JDK + Android SDK + emülatörü otomatik kurar).
2. Bu repoyu kendi bilgisayarına çek / güncelle.
3. `npm install` çalıştır (Capacitor paketleri `package.json`'da zaten mevcut).

## Projeyi açma ve çalıştırma

```bash
npx cap open android
```

Bu, Android Studio'yu `android/` klasörüyle açar. İlk açılışta Gradle
senkronizasyonu biraz sürebilir. Sonra:

- Üstteki **Run ▶** butonuna basarak bir emülatörde veya USB ile bağlı
  gerçek bir telefonda çalıştırabilirsin.
- Telefonda test etmek için telefonunda "Geliştirici Seçenekleri" →
  "USB hata ayıklama" açık olmalı.

## Config/kod değiştiğinde

`capacitor.config.ts`, ikon/splash görselleri veya native plugin (örn.
`@capacitor/browser`) eklenince şunu çalıştır:

```bash
npx cap sync android
```

Sadece sitenin kendi kodu (React/Next.js sayfaları) değiştiğinde **hiçbir
şey yapmana gerek yok** — WebView zaten canlı `dersolab.com`'u yüklüyor,
Vercel'e deploy ettiğin an uygulamada da görünür.

## İkon/Splash'i değiştirmek istersen

Kaynak görseller `resources/icon.png` (1024×1024) ve `resources/splash.png`
(2732×2732) — fox mascot logosu, krem (#F4F1E8) arka plan üzerinde. Değiştirmek
istersen bu iki dosyayı güncelleyip şunu çalıştır:

```bash
npx @capacitor/assets generate --android
npx cap sync android
```

## Bilinen riskler / dikkat edilmesi gerekenler

- **Google Takvim bağlama (OAuth)**: Google, embedded WebView içinde OAuth
  ekranı açılmasını engelliyor ("disallowed_useragent" hatası). Bunun için
  `ConnectGoogleCalendarButton` bileşeni native ortamda linke tıklanınca
  akışı sistem tarayıcısında (`@capacitor/browser` ile Chrome Custom Tabs)
  açacak şekilde güncellendi. **Bu, gerçek bir Android cihaz/emülatörde
  henüz test edilmedi** — Android Studio kurulunca ilk test edilmesi
  gereken akış bu olmalı (Ayarlar → Google Takvimini Bağla).
- **Shopier ödeme akışı**: checkout dış domain'e (`shopier.com`)
  yönlendiriyor, bu `capacitor.config.ts` → `server.allowNavigation`
  listesine eklendi, WebView içinde doğrudan açılabilmeli. Bu da gerçek
  cihazda bir kez test edilmeli.
- **Play Store yayını**: Google Play, bir "remote URL" WebView sarmalayıcısını
  yayınlamak için imzalı bir `.aab` (Android App Bundle) ister. Android
  Studio'dan **Build → Generate Signed Bundle / APK** ile üretilir; imzalama
  anahtarını (keystore) güvenli bir yerde sakla, kaybedersen uygulamayı
  güncelleyemezsin.
