import React from 'react';
import { Sparkles, Shield, Flame, Wind } from 'lucide-react';
import { BlackBullsEmblem, GoldenDawnEmblem } from './BlackCloverAssets';

interface MasterBlackCloverHeaderProps {
  quizIsActive: boolean;
  masterName?: string;
}

/**
 * MasterBlackCloverHeader:
 * Header Utama Resmi Kerajaan Clover untuk Halaman Master.
 * 
 * Desain:
 * - Logo anime Black Clover berukuran BESAR, megah, dan proporsional.
 * - Menyatu 100% dengan latar belakang (seamless blending via mix-blend-screen + radial feathered mask),
 *   sehingga tidak terlihat seperti stiker/kotak tempelan.
 * - Dilengkapi Mahojin (lingkaran sihir berputar) di belakang lambang semanggi 5-daun berapi.
 * - Memiliki pilar ornamen Kerajaan Clover, judul berukir emas "PORTAL MASTER SARI SENSEI",
 *   dan indikator status Sanctum yang terintegrasi secara arsitektural.
 */
export const MasterBlackCloverHeader: React.FC<MasterBlackCloverHeaderProps> = ({
  quizIsActive,
  masterName = 'skywalker',
}) => {
  return (
    <header className="relative w-full pt-1 pb-4 sm:pb-6 text-center select-none overflow-hidden">
      {/* =========================================================================
          1. LAPISAN AURA SIHIR & MAHOJIN LATAR (MENYATU DENGAN ATMOSFER SANCTUM)
          ========================================================================= */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none -z-10" aria-hidden="true">
        {/* Glow Radial Anti-Sihir & Emas Kerajaan */}
        <div className="w-[320px] sm:w-[540px] md:w-[720px] h-[220px] sm:h-[340px] md:h-[420px] rounded-full bg-gradient-to-r from-red-600/35 via-amber-500/25 to-emerald-600/25 blur-3xl opacity-75 animate-pulse" />

        {/* Mahojin / Lingkaran Segel Sihir Berputar Lembut Tepat di Belakang Logo */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[280px] sm:w-[420px] md:w-[520px] h-[280px] sm:h-[420px] md:h-[520px] opacity-30 animate-mana-rotate pointer-events-none">
          <svg viewBox="0 0 400 400" className="w-full h-full">
            <circle cx="200" cy="200" r="180" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="12 8" fill="none" />
            <circle cx="200" cy="200" r="150" stroke="#ef4444" strokeWidth="1" strokeDasharray="6 6" fill="none" />
            <polygon points="200,40 310,90 355,200 310,310 200,360 90,310 45,200 90,90" stroke="#fbbf24" strokeWidth="1.2" fill="none" opacity="0.6" />
            <polygon points="200,55 340,200 200,345 60,200" stroke="#10b981" strokeWidth="1" fill="none" opacity="0.5" />
            <circle cx="200" cy="200" r="85" stroke="#f59e0b" strokeWidth="1.5" fill="none" />
          </svg>
        </div>
      </div>

      {/* =========================================================================
          2. PITA ARSITEKTURAL ATAS: CLOVER KINGDOM HERALD
          ========================================================================= */}
      <div className="inline-flex items-center justify-center gap-2 sm:gap-3 px-4 py-1 mb-1 sm:mb-2 text-[10px] sm:text-xs font-mono font-bold tracking-widest text-amber-300/90 uppercase">
        <span className="w-8 sm:w-16 h-px bg-gradient-to-r from-transparent via-amber-500/60 to-amber-500" />
        <span className="flex items-center gap-1.5 text-amber-200">
          <Sparkles className="w-3 h-3 text-amber-400 animate-spin" style={{ animationDuration: '6s' }} />
          <span>クローバー王国 · 最高魔導統理府</span>
          <span className="hidden sm:inline text-amber-400/60">|</span>
          <span className="hidden sm:inline text-amber-300 font-sans tracking-normal">CLOVER SANCTUM</span>
          <Sparkles className="w-3 h-3 text-amber-400 animate-spin" style={{ animationDuration: '6s' }} />
        </span>
        <span className="w-8 sm:w-16 h-px bg-gradient-to-l from-transparent via-amber-500/60 to-amber-500" />
      </div>

      {/* =========================================================================
          3. LOGO UTAMA RESMI BLACK CLOVER (TRANSPAREN, BESAR & MENYATU ALAMI)
          - Menggunakan PNG transparan murni tanpa background hitam
          - Bebas dari border kotak, clipping, atau efek tempelan
          - Drop shadow mengikuti lekuk huruf anime & lidah api secara organik
          ========================================================================= */}
      <div className="relative mx-auto max-w-2xl sm:max-w-3xl md:max-w-4xl px-2 flex flex-col items-center justify-center group">
        <div className="relative w-full flex items-center justify-center py-1 sm:py-2 transition-transform duration-500 hover:scale-[1.015]">
          <img
            src="/src/assets/images/clover_logo_transparent.png"
            alt="Black Clover Anime Official Logo (ブラッククローバー)"
            className="w-full max-h-[175px] sm:max-h-[250px] md:max-h-[320px] lg:max-h-[370px] object-contain drop-shadow-[0_0_24px_rgba(239,68,68,0.55)] filter brightness-105 contrast-110 pointer-events-none select-none"
            referrerPolicy="no-referrer"
          />

          {/* Kilau Pendar Api Anti-Sihir & Mana di Belakang Logo */}
          <div className="absolute inset-x-12 sm:inset-x-24 top-4 sm:top-8 h-1/2 bg-red-600/15 blur-3xl rounded-full pointer-events-none -z-10 animate-anti-magic-breath" />
        </div>
      </div>

      {/* =========================================================================
          4. JUDUL MASTER SANCTUM (TERBUKA, AESTHETIC, TANPA BORDER KOTAK TEMPELAN)
          - Mobile: "Portal Master" di baris atas, diberi spasi, di bawahnya "Sari Sensei"
          - Desktop: Berdampingan elegan dalam satu baris megah
          ========================================================================= */}
      <div className="relative mt-1 sm:mt-2 max-w-2xl mx-auto px-4 z-10">
        <div className="inline-flex flex-col items-center justify-center">
          {/* Sub-judul Jepang Mini */}
          <div className="text-[10px] sm:text-xs font-japanese font-bold text-amber-300 tracking-wider mb-1 flex items-center justify-center gap-2 opacity-90">
            <span className="w-5 sm:w-8 h-px bg-gradient-to-r from-transparent to-amber-400/60" />
            <span>サリ先生 · クローバー王国 最高魔導士統理</span>
            <span className="w-5 sm:w-8 h-px bg-gradient-to-l from-transparent to-amber-400/60" />
          </div>

          {/* Judul Utama Megah: Khusus Mobile dipecah 'Portal Master' lalu di bawahnya 'Sari Sensei' */}
          <h1 className="font-black tracking-tight font-japanese bg-gradient-to-r from-amber-200 via-yellow-100 to-amber-300 bg-clip-text text-transparent drop-shadow-[0_2px_12px_rgba(245,158,11,0.6)]">
            {/* Tampilan Mobile (< sm): Portal Master di baris atas, spasi, di bawahnya Sari Sensei */}
            <div className="flex flex-col sm:hidden items-center justify-center gap-1 py-1">
              <span className="text-xl font-extrabold tracking-wide text-amber-100">
                Portal Master
              </span>
              <span className="text-2xl font-black tracking-wider text-amber-300 drop-shadow-[0_0_12px_rgba(245,158,11,0.7)]">
                Sari Sensei
              </span>
            </div>

            {/* Tampilan Desktop / Tablet (>= sm): Satu Garis Berpendar Emas */}
            <div className="hidden sm:inline-flex items-center gap-2.5 text-2xl md:text-3xl leading-normal">
              <span>PORTAL MASTER</span>
              <span className="text-amber-400/80">·</span>
              <span className="text-amber-300">SARI SENSEI</span>
            </div>
          </h1>

          {/* Sub-keterangan Sanctum Halus Tanpa Border Kotak */}
          <div className="flex items-center justify-center gap-2 mt-1.5 text-xs text-amber-200/80 font-medium">
            <span>🍀 Clover Kingdom</span>
            <span className="text-amber-500/60">•</span>
            <span>Nihongo Master Sanctum</span>
            <span className="text-amber-500/60">•</span>
            <span className="text-amber-300 font-mono">Sensei {masterName}</span>
          </div>
        </div>

        {/* Garis Pembagi Runic Mengalir Menuju Kolom Panel */}
        <div className="flex items-center justify-center gap-3 mt-3.5 opacity-60">
          <div className="h-px flex-1 max-w-[140px] bg-gradient-to-r from-transparent via-amber-500/50 to-amber-500" />
          <span className="text-[10px] font-japanese text-amber-400 tracking-widest">✦ 監理パネル ✦</span>
          <div className="h-px flex-1 max-w-[140px] bg-gradient-to-l from-transparent via-amber-500/50 to-amber-500" />
        </div>
      </div>
    </header>
  );
};
