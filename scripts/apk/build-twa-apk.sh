#!/usr/bin/env bash
# ==============================================================================
# Script Pembuat APK via Bubblewrap TWA (Trusted Web Activity)
# Lokasi: scripts/apk/build-twa-apk.sh
# Penggunaan: bash scripts/apk/build-twa-apk.sh
# ==============================================================================

set -e

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
TWA_DIR="$ROOT_DIR/output_apk/twa_build"

echo "================================================================"
echo "🌸 MEMBUAT APK ANDROID RINGAN (TWA / BUBBLEWRAP) — SARI SENSEI 🌸"
echo "================================================================"

mkdir -p "$TWA_DIR"
cp "$ROOT_DIR/scripts/apk/twa-manifest.json" "$TWA_DIR/twa-manifest.json"
cd "$TWA_DIR"

echo "▶ Menjalankan @bubblewrap/cli untuk membuat proyek APK dari manifest..."
npx -y @bubblewrap/cli update --manifest="$TWA_DIR/twa-manifest.json" || npx -y @bubblewrap/cli init --manifest="https://ais-pre-3tf33r2hbiuxyzlcjj7wbn-272271852625.asia-southeast1.run.app/manifest.webmanifest"
npx -y @bubblewrap/cli build

if [ -f "$TWA_DIR/app-release-signed.apk" ]; then
  cp "$TWA_DIR/app-release-signed.apk" "$ROOT_DIR/output_apk/Sari-Sensei-TWA-Signed.apk"
  echo ""
  echo "================================================================"
  echo "✅ BERHASIL! File Signed APK siap di:"
  echo "📂 output_apk/Sari-Sensei-TWA-Signed.apk"
  echo "================================================================"
fi
