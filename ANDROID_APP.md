# DersoLab Android Uygulaması (Capacitor 8.5 + Native WebRTC)

Bu proje, `https://dersolab.com` platformunu (Öğrenci, Veli, Eğitmen, Admin, 3D L.A.B., Canlı Ders Odası ve AI Soru Asistanı) native Android uygulamasında (`com.dersolab.app`) çalıştırır ve Google Play Store yayınına hazır imzalı `.aab` ile `.apk` paketleri üretir.

---

## 🛠️ Bağlı Araçlar ve Ortam Yapılandırması

Bu çalışma ortamında tüm mobil derleme ve yayın araçları kurulmuş ve birbirine bağlanmıştır:

- **Android CLI (`android.exe`):** `v1.1.16717390` (`C:\Users\egeme\AppData\AndroidCLI\android.exe`)
- **Android SDK (`local.properties`):** `C:\Users\egeme\AppData\Local\Android\Sdk` (API 36 & 37, Build-Tools 36.0.0)
- **Java JDK 21 (`gradle.properties`):** `C:/Program Files/Microsoft/jdk-21.0.12.101-hotspot`
- **Üretim İmza Anahtarı (Keystore):** `android/app/dersolab-release-key.jks` (`alias: dersolab`, 2048-bit RSA, 10.000 gün geçerli — güvenlik için `.gitignore` kapsamındadır)
- **İzinler (`AndroidManifest.xml`):**
  - `INTERNET`, `ACCESS_NETWORK_STATE` (Canlı platform ve çevrimdışı durum tespiti)
  - `CAMERA`, `RECORD_AUDIO`, `MODIFY_AUDIO_SETTINGS` (Canlı Ders Odası WebRTC kamera/mikrofon ve AI Soru Çözümü fotoğraf çekimi)

---

## 🚀 Tek Komutla Derleme ve Paketleme (`package.json`)

Proje kök dizininde aşağıdaki komutları doğrudan çalıştırabilirsin:

```bash
# 1. Web/Capacitor ayarlarını Android projesine senkronize et
npm run mobile:sync

# 2. Google Play Console'a yüklenecek İmzalı Release Bundle (.aab) üret
npm run mobile:aab

# 3. Doğrudan telefona kurulabilir İmzalı Release APK (.apk) üret
npm run mobile:release-apk

# 4. Hızlı test için Debug APK (.apk) üret
npm run mobile:apk
```

---

## 📦 Üretilen Çıktı Dosyaları (Play Store & Kurulum)

Derleme tamamlandığında dosyalar şu konumlarda hazır olur:

1. **Google Play Store Paketi (`.aab`):**
   - `android/app/build/outputs/bundle/release/app-release.aab`
   - Google Play Console → **Üretim (Production) / Kapalı Test** → **Yeni sürüm oluştur** ekranına doğrudan bu `.aab` dosyasını yükleyebilirsin.

2. **Doğrudan Kurulabilir Üretim Paketi (`.apk`):**
   - `android/app/build/outputs/apk/release/app-release.apk`
   - Android telefonlara doğrudan gönderip kurmak veya `adb install` ile yüklemek için kullanılır.

---

## 🎨 İkon ve Splash Görsellerini Güncelleme

Kaynak görseller `resources/icon.png` (1024×1024) ve `resources/splash.png` (2732×2732) içindedir. Güncellemek istersen:

```bash
npx @capacitor/assets generate --android
npm run mobile:sync
```
