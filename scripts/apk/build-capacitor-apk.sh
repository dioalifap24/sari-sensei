#!/usr/bin/env bash
# ==============================================================================
# Script Pembuat File Android APK (.apk) — Sari Sensei JLPT N5-N2
# Lokasi: scripts/apk/build-capacitor-apk.sh
# Penggunaan: bash scripts/apk/build-capacitor-apk.sh
# ==============================================================================

set -e

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$ROOT_DIR"

echo "================================================================"
echo "🌸 MEMULAI PROSES PEMBUATAN APK ANDROID — SARI SENSEI JLPT 🌸"
echo "================================================================"

# 1. Jalankan script setup Capacitor & build web (dist/)
node scripts/apk/setup-capacitor.cjs

# 2. Cek apakah folder android/ sudah terbentuk
if [ ! -d "$ROOT_DIR/android" ]; then
  echo "❌ Folder android/ belum ditemukan. Pastikan setup-capacitor.cjs berjalan lancar."
  exit 1
fi

# 3. Kompilasi APK menggunakan Gradle Wrapper
echo "▶ Menyusun paket APK Android menggunakan Gradle..."
cd "$ROOT_DIR/android"
chmod +x ./gradlew
./gradlew assembleDebug

# 4. Salin hasil APK ke folder output_apk/ di root proyek agar mudah diambil
APK_SOURCE="$ROOT_DIR/android/app/build/outputs/apk/debug/app-debug.apk"
OUTPUT_DIR="$ROOT_DIR/output_apk"
mkdir -p "$OUTPUT_DIR"

if [ -f "$APK_SOURCE" ]; then
  cp "$APK_SOURCE" "$OUTPUT_DIR/Sari-Sensei-JLPT.apk"
  echo ""
  echo "================================================================"
  echo "✅ BERHASIL! FILE APK TELAH SIAP:"
  echo "📂 Lokasi 1: output_apk/Sari-Sensei-JLPT.apk"
  echo "📂 Lokasi 2: android/app/build/outputs/apk/debug/app-debug.apk"
  echo "================================================================"
else
  echo "⚠️ Proses Gradle selesai, silakan cek folder android/app/build/outputs/apk/"
fi
