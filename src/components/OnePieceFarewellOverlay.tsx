import React, { useEffect } from 'react';
import { Sparkles, Heart } from 'lucide-react';

export interface OnePieceFarewellQuote {
  id: string;
  authorTag: string;
  characterName: string;
  quoteText: string;
  portraitSrc: string;
}

export const ONE_PIECE_POSTER_DURATION_MS = 5000; // 5 detik secukupnya

export function preloadOnePieceFarewellAssets() {
  // No-op to avoid loading heavy external character poster images and heavy network traffic
}

export function pickNextUniqueOnePieceQuote(): OnePieceFarewellQuote {
  return {
    id: 'sensei-farewell-1',
    authorTag: 'by.sensei sari',
    characterName: 'Sari Sensei',
    quoteText: '"Terima kasih telah belajar dengan penuh semangat hari ini. Istirahatlah yang cukup, dan sampai jumpa di sesi belajar berikutnya! 🌸"',
    portraitSrc: '',
  };
}

interface OnePieceFarewellOverlayProps {
  quote: OnePieceFarewellQuote;
  onDismiss: () => void;
}

export const OnePieceFarewellOverlay: React.FC<OnePieceFarewellOverlayProps> = ({
  onDismiss,
}) => {
  useEffect(() => {
    const timer = window.setTimeout(() => {
      onDismiss();
    }, ONE_PIECE_POSTER_DURATION_MS);
    return () => window.clearTimeout(timer);
  }, [onDismiss]);

  return (
    <div className="fixed inset-0 z-50 bg-[#0f0a0d] flex items-center justify-center p-4 bg-japanese-pattern animate-in fade-in duration-300">
      <div className="max-w-md w-full bg-[#1c1216] border-2 border-[#881337] rounded-3xl p-6 text-center shadow-[0_0_40px_rgba(136,19,55,0.4)] relative overflow-hidden">
        {/* Dekorasi Sakura / Bunga */}
        <div className="absolute -top-10 -right-10 w-28 h-28 bg-[#881337]/25 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-28 h-28 bg-amber-500/20 rounded-full blur-2xl pointer-events-none" />

        <div className="text-3xl mb-3 animate-bounce">🌸</div>
        <h2 className="text-xl font-black text-amber-200 font-japanese tracking-wide mb-1">
          さようなら · SAMPAI JUMPA LAGI
        </h2>
        <p className="text-xs text-rose-300 font-mono tracking-wider uppercase mb-4">
          Sari Sensei · JLPT Study Portal
        </p>

        <div className="bg-black/60 border border-[#881337]/60 rounded-2xl p-4 my-3 text-stone-200 text-sm italic leading-relaxed">
          "Terima kasih telah belajar dengan penuh semangat hari ini. Istirahatlah yang cukup, dan sampai jumpa di sesi belajar berikutnya! 🌸"
        </div>

        <button
          type="button"
          onClick={onDismiss}
          className="mt-4 px-6 py-2.5 bg-gradient-to-r from-[#881337] to-[#9f1239] hover:from-[#9f1239] hover:to-[#be123c] text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-[0_0_15px_rgba(136,19,55,0.6)] transition-all cursor-pointer"
        >
          Masuk Kembali ke Beranda 🌸
        </button>
      </div>
    </div>
  );
};
