# 📱 Panduan Membuat & Mengunduh File APK Sari Sensei Lewat GitHub

Proyek ini sudah dilengkapi **GitHub Actions Workflow Otomatis** (`.github/workflows/build-apk.yml`) sehingga Anda **tidak perlu menginstal Android Studio atau Java SDK** di komputer/HP Anda. Server cloud GitHub yang akan mem-build file **`Sari-Sensei-JLPT.apk`** secara otomatis untuk Anda.

---

## 🚀 Langkah-Langkah Buat APK Lewat GitHub (Otomatis 100% di Cloud)

### Langkah 1: Simpan / Export Proyek ke GitHub
1. Di halaman Google AI Studio ini, klik ikon **GitHub** (atau menu **Export to GitHub** / **Save to GitHub**) di bagian atas layar.
2. Buat repositori baru (misalnya: `sari-sensei-jlpt`) dan *push* kode ke branch `main` atau `master`.

### Langkah 2: Proses Build APK Berjalan Otomatis di GitHub
Begitu kode masuk ke GitHub:
1. Buka repositori GitHub Anda di browser (HP atau Laptop).
2. Klik tab **Actions** di bagian atas repositori.
3. Anda akan melihat workflow **"Build APK Sari Sensei JLPT"** sedang berjalan otomatis (membutuhkan waktu sekitar **2–3 menit**).
   - *Catatan:* Anda juga bisa menjalankannya kapan saja secara manual dengan mengeklik **Build APK Sari Sensei JLPT** -> klik tombol **Run workflow**.

### Langkah 3: Download File `Sari-Sensei-JLPT.apk`
Setelah workflow berstatus centang hijau (**✅ Success**), Anda bisa mengunduh file `.apk` dari **2 tempat**:

1. **Lewat Menu Releases (Paling Mudah — Langsung File `.apk`):**
   - Buka halaman utama repositori GitHub Anda, lalu klik menu **Releases** di sebelah kanan (atau buka tab `Releases`).
   - Pada rilis terbaru (**`🌸 Sari Sensei JLPT Android APK`**), buka bagian **Assets** lalu klik **`Sari-Sensei-JLPT.apk`** untuk langsung mengunduh dan menginstalnya di HP Android!

2. **Lewat Menu Actions Artifacts:**
   - Klik hasil run workflow yang sudah selesai di tab **Actions**.
   - Gulir ke bagian paling bawah (**Artifacts**), lalu klik **`Sari-Sensei-JLPT-APK`** untuk mengunduh paket APK-nya.

---

## 📂 Daftar File Script APK di Proyek Ini

- **`.github/workflows/build-apk.yml`** *(dan salinannya di `scripts/apk/github-workflow-build-apk.yml`)*
  Workflow GitHub Actions otomatis untuk mengompilasi `Sari-Sensei-JLPT.apk` di server GitHub dan mengunggahnya ke *Artifacts* serta *GitHub Releases*.
- **`scripts/apk/setup-capacitor.cjs`**
  Script otomatis pembungkus aplikasi web ke proyek Android Native (`android/`), pengatur izin sinkronisasi *real-time* di `AndroidManifest.xml`, serta pemasang ikon peluncur Android (`mipmap-mdpi` s/d `mipmap-xxxhdpi`).
- **`scripts/apk/generate-apk-icons.cjs`**
  Generator ikon aplikasi Sari Sensei untuk PWA dan Android Native.
- **`scripts/apk/build-capacitor-apk.sh` & `build-capacitor-apk.bat`**
  Script build lokal jika ingin mem-build secara offline di komputer sendiri.
