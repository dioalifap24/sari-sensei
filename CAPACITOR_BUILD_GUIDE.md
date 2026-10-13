# 📱 Capacitor Native Build Configuration & Packaging Guide

Panduan lengkap ini merinci cara mengemas aplikasi **Sari Sensei** (Belajar JLPT N5–N2) sebagai aplikasi *native* lintas platform (Android & iOS) menggunakan **Capacitor**, lengkap dengan konfigurasi aset ikon dan *splash screen* resmi.

---

## 📂 Struktur Aset Native (`/resources`)
Aset desain grafis resmi aplikasi untuk Android & iOS telah disiapkan di folder `/resources`:
- **`icon.svg`**: Ikon utama aplikasi beresolusi tinggi (1024x1024px) dengan estetika manga Jepang dan Kanji `先生` (Sensei).
- **`splash.svg`**: Gambar *splash screen* beresolusi tinggi (2732x2732px) dengan latar belakang gradasi malam Jepang, lingkaran Zen, dan logo resmi *Sari Sensei JLPT*.

---

## 🛠️ Langkah 1: Instalasi Dependensi Capacitor
Jika Anda ingin membangun aplikasi *native* secara lokal di komputer Anda, jalankan perintah berikut di terminal:

```bash
# 1. Instal Capacitor Core, CLI, dan plugin Android/iOS
npm install @capacitor/core @capacitor/cli @capacitor/android @capacitor/ios

# 2. Instal @capacitor/assets untuk otomatisasi pembuatan ikon dan splash screen
npm install -D @capacitor/assets
```

---

## ⚙️ Langkah 2: Konfigurasi `capacitor.config.json`
Konfigurasi Capacitor untuk **Sari Sensei** sudah diatur di file `capacitor.config.json` pada root proyek:

```json
{
  "appId": "com.sarisensei.jlpt",
  "appName": "Sari Sensei JLPT",
  "webDir": "dist",
  "bundledWebRuntime": false,
  "server": {
    "androidScheme": "https",
    "cleartext": true,
    "allowNavigation": [
      "*.run.app",
      "ntfy.sh",
      "*.ntfy.sh"
    ]
  },
  "android": {
    "allowMixedContent": true,
    "captureInput": true,
    "webContentsDebuggingEnabled": true,
    "backgroundColor": "#fcf9f2"
  }
}
```

---

## 🎨 Langkah 3: Generate Otomatis Ikon & Splash Screen
Gunakan `@capacitor/assets` untuk menghasilkan ukuran ikon dan *splash screen* yang spesifik untuk setiap platform (Android & iOS) dari file SVG di folder `/resources`:

```bash
# Jalankan generator aset Capacitor
npx @capacitor-assets/cli generate --icon resources/icon.svg --splash resources/splash.svg
```
Perintah ini otomatis mengisi folder `android/` dan `ios/` dengan resolusi ikon dan *splash screen* yang diperlukan App Store dan Google Play Store.

---

## 🤖 Langkah 4: Build & Packaging untuk Android (APK / AAB)

1. **Build Web App:**
   ```bash
   npm run build
   ```

2. **Tambahkan Platform Android (jika belum ada):**
   ```bash
   npx cap add android
   ```

3. **Sinkronkan File Web ke Android:**
   ```bash
   npx cap sync android
   ```

4. **Buka Android Studio:**
   ```bash
   npx cap open android
   ```
   * Di Android Studio, Anda dapat menguji aplikasi di Emulator atau langsung mengekspor APK debug / Release Bundle (.aab) melalui menu **Build > Build Bundle(s) / APK(s) > Build APK(s)**.

---

## 🍏 Langkah 5: Build & Packaging untuk iOS (iPhone / iPad)

*Catatan: Pembuatan dan kompilasi aplikasi iOS memerlukan komputer **macOS** dengan **Xcode** terinstal.*

1. **Build Web App:**
   ```bash
   npm run build
   ```

2. **Tambahkan Platform iOS (jika belum ada):**
   ```bash
   npx cap add ios
   ```

3. **Sinkronkan File Web ke iOS:**
   ```bash
   npx cap sync ios
   ```

4. **Buka Xcode:**
   ```bash
   npx cap open ios
   ```
   * Di Xcode, pilih target perangkat iPhone Anda atau Simulator, sesuaikan **Signing & Capabilities** dengan akun Apple Developer Anda, lalu klik tombol **Play (Run)** untuk menginstal dan menjalankan aplikasi langsung di iPhone Anda.

---

## 🔄 Integrasi Otomatis GitHub Actions (Android APK)
Untuk pengguna yang tidak ingin repot melakukan build lokal, repository ini telah dilengkapi dengan GitHub Actions yang otomatis menyusun file `Sari-Sensei-JLPT.apk` setiap kali ada pembaruan kode yang di-push ke branch `main`. Murid dan Master dapat langsung mengunduhnya melalui tab **Releases** di repository GitHub proyek.
