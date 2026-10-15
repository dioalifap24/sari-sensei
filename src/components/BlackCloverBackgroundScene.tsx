import React, { useEffect } from 'react';
import { Sparkles } from 'lucide-react';
import { CloverGrimoiresPairImg } from './BlackCloverAssets';

/**
 * Komponen Latar Belakang Tenang Tema Black Clover (Zero-Animation Static Background)
 * Dioptimalkan 100% tanpa partikel berterbangan atau loop animasi CPU untuk performa maksimal di halaman Master.
 */
export const BlackCloverBackgroundScene: React.FC = () => {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none select-none overflow-hidden" aria-hidden="true">
      {/* 1. Wallpaper Anime Latar Belakang Statis */}
      <div className="absolute inset-0 z-0">
        <img
          src="/src/assets/images/clover_full_wallpaper_1792055444045.jpg"
          alt="Black Clover Background"
          className="w-full h-full object-cover object-center filter brightness-[0.88] contrast-105"
        />
        {/* Vignette Gelap Elegan */}
        <div className="absolute inset-0 bg-stone-950/75" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#090b14]/90 via-[#090b14]/70 to-[#090b14]/95" />
      </div>

      {/* 2. Glow Aura Lembut */}
      <div className="absolute top-0 left-0 w-[350px] h-[350px] bg-red-600/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute top-0 right-0 w-[350px] h-[350px] bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none" />
    </div>
  );
};
