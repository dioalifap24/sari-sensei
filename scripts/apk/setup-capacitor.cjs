#!/usr/bin/env node
/**
 * Script Otomatisasi Setup Android APK (Capacitor) — Sari Sensei JLPT
 * Lokasi: scripts/apk/setup-capacitor.cjs
 *
 * Fungsi:
 * 1. Memastikan ikon APK & PWA tersedia di folder public/
 * 2. Menyiapkan capacitor.config.json di root proyek
 * 3. Menginstal @capacitor/core, @capacitor/cli, dan @capacitor/android (jika belum ada)
 * 4. Mem-build aplikasi web (npm run build -> dist/)
 * 5. Membuat/menyinkronkan folder proyek Android native (android/)
 * 6. Mengonfigurasi AndroidManifest.xml agar mendukung koneksi internet & sinkronisasi real-time
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ROOT_DIR = path.resolve(__dirname, '../..');

function run(cmd) {
  console.log(`\n▶ Menjalankan: ${cmd}`);
  execSync(cmd, { cwd: ROOT_DIR, stdio: 'inherit' });
}

function main() {
  console.log('==========================================================');
  console.log('🌸 SARI SENSEI JLPT — SETUP OTOMATIS PROYEK ANDROID APK 🌸');
  console.log('==========================================================\n');

  // 1. Generate ikon terlebih dahulu
  const iconScript = path.join(__dirname, 'generate-apk-icons.cjs');
  if (fs.existsSync(iconScript)) {
    run('node scripts/apk/generate-apk-icons.cjs');
  }

  // 2. Pastikan capacitor.config.json ada di root
  const rootCapConfig = path.join(ROOT_DIR, 'capacitor.config.json');
  const scriptCapConfig = path.join(__dirname, 'capacitor.config.json');
  if (!fs.existsSync(rootCapConfig) && fs.existsSync(scriptCapConfig)) {
    fs.copyFileSync(scriptCapConfig, rootCapConfig);
    console.log('[OK] Menyalin capacitor.config.json ke root proyek.');
  }

  // 3. Cek apakah paket @capacitor/android sudah terinstal
  const pkgJsonPath = path.join(ROOT_DIR, 'package.json');
  const pkgJson = JSON.parse(fs.readFileSync(pkgJsonPath, 'utf8'));
  const allDeps = {
    ...(pkgJson.dependencies || {}),
    ...(pkgJson.devDependencies || {}),
  };

  if (!allDeps['@capacitor/core'] || !allDeps['@capacitor/android'] || !allDeps['@capacitor/cli']) {
    console.log('[INFO] Menginstal paket Capacitor Android (@capacitor/core, @capacitor/cli, @capacitor/android)...');
    run('npm install @capacitor/core@^6.2.0 @capacitor/android@^6.2.0 && npm install -D @capacitor/cli@^6.2.0');
  }

  // 4. Build aplikasi web ke folder dist/
  console.log('[INFO] Mem-build aset web produksi (dist/)...');
  run('npm run build');

  // 5. Tambahkan platform android jika folder android/ belum ada
  const androidDir = path.join(ROOT_DIR, 'android');
  if (!fs.existsSync(androidDir)) {
    console.log('[INFO] Membuat folder proyek Android native (npx cap add android)...');
    run('npx cap add android');
  } else {
    console.log('[INFO] Menyinkronkan aset terbaru ke proyek Android (npx cap sync android)...');
    run('npx cap sync android');
  }

  // 5b. Pasang ikon peluncur Sari Sensei ke dalam folder android/app/src/main/res/mipmap-*
  if (fs.existsSync(iconScript)) {
    run('node scripts/apk/generate-apk-icons.cjs');
  }

  // 6. Patch AndroidManifest.xml untuk izin internet & cleartext traffic (sinkronisasi real-time)
  const manifestPath = path.join(
    androidDir,
    'app',
    'src',
    'main',
    'AndroidManifest.xml'
  );

  if (fs.existsSync(manifestPath)) {
    let manifestXml = fs.readFileSync(manifestPath, 'utf8');

    if (!manifestXml.includes('android:usesCleartextTraffic="true"')) {
      manifestXml = manifestXml.replace(
        '<application',
        '<application\n        android:usesCleartextTraffic="true"'
      );
    }

    if (!manifestXml.includes('android.permission.ACCESS_NETWORK_STATE')) {
      manifestXml = manifestXml.replace(
        '</manifest>',
        '    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />\n</manifest>'
      );
    }

    fs.writeFileSync(manifestPath, manifestXml, 'utf8');
    console.log('[OK] AndroidManifest.xml berhasil dikonfigurasi untuk sinkronisasi real-time.');
  }

  console.log('\n==========================================================');
  console.log('✅ PROYEK ANDROID SIAP DI FOLDER: ./android');
  console.log('----------------------------------------------------------');
  console.log('Untuk langsung membuat file .APK (jika Android SDK/Java terpasang):');
  console.log('  Linux/macOS : bash scripts/apk/build-capacitor-apk.sh');
  console.log('  Windows     : scripts\\apk\\build-capacitor-apk.bat');
  console.log('Atau buka di Android Studio dengan perintah:');
  console.log('  npx cap open android');
  console.log('==========================================================\n');
}

main();
