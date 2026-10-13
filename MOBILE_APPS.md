# 📱 Panduan Instalasi Aplikasi Sari Sensei (Android APK & iOS iPhone)

Aplikasi **Sari Sensei** (Belajar JLPT N5–N2) kini mendukung penuh perangkat **Android** dan **iPhone / iOS** dengan pembaruan fitur terbaru:
- **Catatan Pinggir (Post-it Memo)** pada setiap halaman materi.
- **Efek Suara Manga (SFX)** animasi interaktif saat murid menyelesaikan tugas harian.
- **Terjemahan Langsung Google** yang akurat untuk Master & Murid.
- **Ejaan Huruf Jepang (Kana & Kanji)** yang disesuaikan secara presisi.

---

## 🤖 1. Pengguna Android (Install APK)
Murid atau Master pengguna Android dapat langsung mengunduh dan memasang aplikasi melalui file **`Sari-Sensei-JLPT.apk`**:

1. Buka halaman **Releases** repository GitHub proyek ini.
2. Unduh file terbaru **`Sari-Sensei-JLPT.apk`** pada bagian **Assets**.
3. Buka file APK tersebut di HP Android Anda. Jika muncul peringatan keamanan (Unknown Sources), pilih **Install Anyway / Izinkan dari Sumber Ini**.
4. Aplikasi siap digunakan dengan sinkronisasi nilai dan kuis secara *real-time*!

*Catatan Otomatis GitHub Actions:* Setiap kali perubahan kode didorong (*push*) ke branch `main`, GitHub Actions secara otomatis menyusun ulang kode dan memperbarui APK di menu **Releases**.

---

## 🍏 2. Pengguna iPhone / iOS (Install Web App / PWA)
Sistem iOS (Apple) tidak mengizinkan instalasi file `.apk`. Sebagai gantinya, iPhone dan iPad mendukung **Progressive Web App (PWA)** yang dapat terpasang di Layar Utama (*Home Screen*) iPhone Anda dengan pengalaman setara aplikasi native App Store (layar penuh tanpa bilah browser, mode offline, dan ikon di layar utama):

1. Buka link aplikasi Sari Sensei menggunakan browser **Safari** di iPhone / iPad Anda.
2. Ketuk tombol **Bagikan (Share)** di bagian bawah layar Safari (ikon kotak dengan panah ke atas).
3. Gulir ke bawah pada menu pop-up, lalu pilih **"Tambahkan ke Layar Utama" (Add to Home Screen)**.
4. Beri nama **Sari Sensei**, lalu ketuk **Tambah (Add)** di pojok kanan atas.
5. Selesai! Ikon aplikasi **Sari Sensei** kini muncul di layar utama iPhone Anda dan dapat dibuka kapan saja layaknya aplikasi iOS biasa.

---

## 🌐 3. Apakah Aplikasi di iPhone Terkoneksi Online atau Offline?
Aplikasi **Sari Sensei** di iPhone / iOS bersifat **Online sekaligus Offline (Hybrid PWA)**:
- **Koneksi Langsung Online:** Saat perangkat terhubung ke internet (Wi-Fi / Seluler), aplikasi terhubung secara *real-time* ke server dan layanan eksternal (seperti Google Terjemahan, pembaruan materi terbaru, dan sinkronisasi tugas Master).
- **Dukungan Mode Offline:** Berkat teknologi PWA (*Progressive Web App*), materi pelajaran dan kuis yang sudah pernah dimuat tetap dapat diakses meskipun iPhone Anda sedang tidak ada sinyal internet.
- **Penyimpanan Lokal (Local Storage):** Catatan pinggir (*Post-it Memo*) dan kemajuan belajar disimpan secara lokal di perangkat iPhone Anda sehingga aman dan tetap bisa dibaca kapanpun. Saat kembali terhubung ke internet, aplikasi akan langsung aktif dan tersinkronisasi kembali secara otomatis.

---

## 🛠️ 4. Panduan Build & Packaging Native (Capacitor for Android & iOS)
Bagi pengembang atau Master yang ingin mengemas aplikasi ini menjadi aplikasi *native* App Store / Play Store menggunakan **Capacitor** (lengkap dengan ikon dan *splash screen* kustom):
- Lihat panduan lengkap di file **[`CAPACITOR_BUILD_GUIDE.md`](./CAPACITOR_BUILD_GUIDE.md)**.
- Aset ikon (`icon.svg`) dan *splash screen* (`splash.svg`) tersedia di folder `/resources`.

