@echo off
REM ==============================================================================
REM Script Pembuat File Android APK (.apk) untuk Windows — Sari Sensei JLPT N5-N2
REM Lokasi: scripts\apk\build-capacitor-apk.bat
REM Penggunaan: Klik 2x file ini atau jalankan: scripts\apk\build-capacitor-apk.bat
REM ==============================================================================

cd /d "%~dp0\..\.."

echo ================================================================
echo SARI SENSEI JLPT - PEMBUATAN FILE ANDROID APK (.APK)
echo ================================================================

REM 1. Jalankan setup Capacitor & build web (dist/)
call node scripts\apk\setup-capacitor.cjs
if %ERRORLEVEL% NEQ 0 (
  echo [ERROR] Gagal menjalankan setup-capacitor.cjs
  pause
  exit /b %ERRORLEVEL%
)

REM 2. Masuk ke folder android dan jalankan gradlew assembleDebug
if not exist "android\gradlew.bat" (
  echo [ERROR] Folder android belum terbentuk dengan lengkap.
  pause
  exit /b 1
)

echo.
echo [INFO] Mengompilasi file APK menggunakan Gradle...
cd android
call gradlew.bat assembleDebug
if %ERRORLEVEL% NEQ 0 (
  echo.
  echo [INFO] Jika Android SDK / JDK belum terkonfigurasi di Command Prompt,
  echo silakan buka proyek di Android Studio dengan perintah: npx cap open android
  echo lalu pilih menu: Build ^> Build Bundle(s) / APK(s) ^> Build APK(s)
  cd ..
  pause
  exit /b %ERRORLEVEL%
)

cd ..
if not exist "output_apk" mkdir output_apk

if exist "android\app\build\outputs\apk\debug\app-debug.apk" (
  copy /Y "android\app\build\outputs\apk\debug\app-debug.apk" "output_apk\Sari-Sensei-JLPT.apk" >nul
  echo.
  echo ================================================================
  echo BERHASIL! File APK Anda telah siap di:
  echo   output_apk\Sari-Sensei-JLPT.apk
  echo ================================================================
)

pause
