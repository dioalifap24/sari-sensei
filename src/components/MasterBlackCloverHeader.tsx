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
 * Logo di bagian atas telah dihapus bersih sesuai permintaan,
 * langsung menampilkan judul Portal Master Sari Sensei yang anggun dan menyatu.
 */
export const MasterBlackCloverHeader: React.FC<MasterBlackCloverHeaderProps> = ({
  quizIsActive,
  masterName = 'skywalker',
}) => {
  return (
    <header className="relative w-full pt-1 pb-4 sm:pb-6 text-center select-none overflow-hidden">
      {/* 1. Lapisan Aura Sihir & Mahojin Latar */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none -z-10" aria-hidden="true">
        <div className="w-[320px] sm:w-[540px] md:w-[720px] h-[220px] sm:h-[340px] md:h-[420px] rounded-full bg-gradient-to-r from-red-600/35 via-amber-500/25 to-emerald-600/25 blur-3xl opacity-75 animate-pulse" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[280px] sm:w-[420px] md:w-[520px] h-[280px] sm:h-[420px] md:h-[520px] opacity-30 animate-mana-rotate pointer-events-none">
          <svg viewBox="0 0 400 400" className="w-full h-full">
            <circle cx="200" cy="200" r="180" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="12 8" fill="none" />
            <circle cx="200" cy="200" r="150" stroke="#ef4444" strokeWidth="1" strokeDasharray="6 6" fill="none" />
            <polygon points="200,40 310,90 355,200 310,310 200,360 90,310 45,200 90,90" stroke="#fbbf24" strokeWidth="1.2" fill="none" opacity="0.6" />
            <polygon points="200,55 340,200 200,345 60,200" stroke="#10b981" strokeWidth="1" fill="none" opacity="0.5" />
            <circle cx="200" cy="200" r="85" stroke="#f59e0b" strokeWidth="1.5" fill="none" />

            {/* Lambang Semanggi 5 Daun (Asta Anti-Magic Grimoire Crest) di Pusat Lingkaran Sihir */}
            <g transform="translate(200, 200)">
              {/* 5 Daun Semanggi */}
              {[0, 72, 144, 216, 288].map(angle => (
                <path
                  key={angle}
                  d="M0 0 C-10 -22 -18 -45 -4 -52 C8 -58 18 -42 0 0 Z"
                  fill="#ef4444"
                  fillOpacity="0.88"
                  stroke="#f87171"
                  strokeWidth="2"
                  transform={`rotate(${angle})`}
                />
              ))}
              {/* Inti Emas Berpendar */}
              <circle cx="0" cy="0" r="10" fill="#000000" stroke="#f59e0b" strokeWidth="2.5" />
              <circle cx="0" cy="0" r="4" fill="#fbbf24" />
            </g>
          </svg>
        </div>
      </div>

      {/* 2. Pita Arsitektural Atas */}
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

      {/* 3. Judul Master Sanctum (Logo Hitam Atas Telah Dihapus Bersih) */}
      <div className="relative mt-2 sm:mt-3 max-w-2xl mx-auto px-4 z-10">
        <div className="inline-flex flex-col items-center justify-center">
          <div className="text-[10px] sm:text-xs font-japanese font-bold text-amber-300 tracking-wider mb-1.5 flex items-center justify-center gap-2 opacity-90">
            <span className="w-5 sm:w-8 h-px bg-gradient-to-r from-transparent to-amber-400/60" />
            <span>サリ先生 · クローバー王国 最高魔導士統理</span>
            <span className="w-5 sm:w-8 h-px bg-gradient-to-l from-transparent to-amber-400/60" />
          </div>

          <h1 className="font-black tracking-tight font-japanese bg-gradient-to-r from-amber-200 via-yellow-100 to-amber-300 bg-clip-text text-transparent drop-shadow-[0_2px_12px_rgba(245,158,11,0.6)]">
            {/* Mobile: Portal Master di atas, spasi, di bawahnya Sari Sensei */}
            <div className="flex flex-col sm:hidden items-center justify-center gap-1.5 py-1">
              <span className="text-2xl font-extrabold tracking-wide text-amber-100">
                Portal Master
              </span>
              <span className="text-3xl font-black tracking-wider text-amber-300 drop-shadow-[0_0_12px_rgba(245,158,11,0.7)]">
                Sari Sensei
              </span>
            </div>

            {/* Desktop / Tablet: Sejajar */}
            <div className="hidden sm:inline-flex items-center gap-2.5 text-3xl md:text-4xl leading-normal">
              <span>PORTAL MASTER</span>
              <span className="text-amber-400/80">·</span>
              <span className="text-amber-300">SARI SENSEI</span>
            </div>
          </h1>

          <div className="flex flex-wrap items-center justify-center gap-2 mt-2 text-xs text-amber-200/80 font-medium">
            <span>🍀 Clover Kingdom</span>
            <span className="text-amber-500/60">•</span>
            <span>Nihongo Master Sanctum</span>
            <span className="text-amber-500/60">•</span>
            <span className="text-amber-300 font-mono">Sensei {masterName}</span>
            <span className="hidden sm:inline text-amber-500/60">•</span>
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-950/40 border border-emerald-500/30 text-[10px] text-emerald-300 font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_#34d399]" />
              <span>Mana Zone · 魔力領域</span>
            </span>
          </div>
        </div>

        <div className="flex items-center justify-center gap-3 mt-4 opacity-60">
          <div className="h-px flex-1 max-w-[140px] bg-gradient-to-r from-transparent via-amber-500/50 to-amber-500" />
          <span className="text-[10px] font-japanese text-amber-400 tracking-widest">✦ 監理パネル ✦</span>
          <div className="h-px flex-1 max-w-[140px] bg-gradient-to-l from-transparent via-amber-500/50 to-amber-500" />
        </div>
      </div>
    </header>
  );
};
