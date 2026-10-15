import React, { useState } from 'react';
import { Sparkles, Flame, Wind } from 'lucide-react';

export const BlackCloverLogoBanner: React.FC<{ className?: string }> = ({ 
  className = "w-full max-w-xl h-auto" 
}) => (
  <div className="relative inline-flex items-center justify-center group">
    {/* Atmospheric Magic Aura Glow */}
    <div className="absolute -inset-4 bg-gradient-to-r from-red-600/30 via-amber-500/25 to-red-600/30 rounded-full blur-2xl opacity-75 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
    <img 
      src="/src/assets/images/clover_logo_transparent.png" 
      className={`relative object-contain drop-shadow-[0_0_25px_rgba(239,68,68,0.6)] select-none filter contrast-110 brightness-105 ${className}`} 
      alt="Official Black Clover Anime Logo (ブラッククローバー)" 
      referrerPolicy="no-referrer" 
    />
  </div>
);

export const BlackBullsEmblem: React.FC<{ className?: string }> = ({ 
  className = "w-7 h-7 sm:w-8 sm:h-8" 
}) => (
  <img 
    src="/src/assets/images/black_bulls_emblem_1791986514214.jpg" 
    className={`object-cover rounded-full border border-red-500/80 shadow-[0_0_10px_rgba(239,68,68,0.5)] ${className}`} 
    alt="Black Bulls Squad Emblem" 
    referrerPolicy="no-referrer" 
  />
);

export const GoldenDawnEmblem: React.FC<{ className?: string }> = ({ 
  className = "w-7 h-7 sm:w-8 sm:h-8" 
}) => (
  <img 
    src="/src/assets/images/golden_dawn_emblem_1792002727908.jpg" 
    className={`object-cover rounded-full border border-amber-400/80 shadow-[0_0_10px_rgba(245,158,11,0.5)] ${className}`} 
    alt="Golden Dawn Squad Emblem" 
    referrerPolicy="no-referrer" 
  />
);

export const CloverGrimoiresPairImg: React.FC<{ className?: string }> = ({ 
  className = "w-8 h-8 sm:w-10 sm:h-10" 
}) => (
  <img 
    src="/src/assets/images/clover_grimoires_pair_1792002747422.jpg" 
    className={`object-cover rounded-md border border-amber-500/50 ${className}`} 
    alt="Grimoires of Black Clover" 
    referrerPolicy="no-referrer" 
  />
);

/**
 * Asta Figure Companion:
 * Displays Asta (the person), Black Bulls team badge, and his 5-Leaf Grimoire.
 * Compact, interactive, and NO bulky rectangular cards!
 */
export const AstaFigureBadge: React.FC<{
  onInteract?: () => void;
}> = ({ onInteract }) => {
  const [showQuote, setShowQuote] = useState(false);

  const handleClick = () => {
    setShowQuote(prev => !prev);
    if (onInteract) onInteract();
  };

  return (
    <div className="relative inline-flex items-center">
      {/* Interactive Speech Bubble */}
      {showQuote && (
        <div className="absolute -top-16 left-1/2 -translate-x-1/2 z-30 w-52 sm:w-60 p-2 bg-stone-950/95 border-2 border-red-500 rounded-xl shadow-[0_0_20px_rgba(239,68,68,0.6)] text-center animate-in fade-in zoom-in-95 duration-200">
          <div className="text-[10px] font-black text-red-400 font-mono uppercase tracking-wider flex items-center justify-center gap-1">
            <Flame className="w-3 h-3 text-red-500 animate-pulse" />
            <span>Asta · Anti-Magic</span>
          </div>
          <p className="text-[11px] font-bold text-amber-200 font-japanese mt-0.5 leading-tight">
            「諦めないのがオレの魔法だ!!」
          </p>
          <p className="text-[10px] text-stone-300 mt-0.5">
            "Pantang menyerah adalah sihirku!"
          </p>
          <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-stone-950 border-r-2 border-b-2 border-red-500 rotate-45" />
        </div>
      )}

      {/* Main Avatar & Crest Cluster */}
      <button
        type="button"
        onClick={handleClick}
        className="group relative flex items-center gap-2 p-1.5 sm:p-2 bg-stone-900/90 hover:bg-stone-850 border-2 border-red-600/70 hover:border-red-400 rounded-2xl shadow-[0_0_15px_rgba(220,38,38,0.3)] transition-all cursor-pointer transform hover:scale-105 active:scale-95"
        title="Klik Asta untuk mendengarkan tekad Anti-Sihir!"
      >
        {/* Karakter Orangnya: Asta */}
        <div className="relative">
          <img
            src="/src/assets/images/asta_anime_fullcolor_1792000879458.jpg"
            alt="Asta"
            className="w-12 h-12 sm:w-14 sm:h-14 rounded-full object-cover border-2 border-red-500 shadow-[0_0_12px_rgba(239,68,68,0.6)]"
          />
          {/* Lambang Team: Black Bulls Crest */}
          <div className="absolute -top-1.5 -left-1.5 rounded-full ring-2 ring-stone-950 bg-stone-950" title="Squad: Banteng Hitam (Black Bulls)">
            <BlackBullsEmblem className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          {/* Grimoire: 5-Leaf Clover Badge */}
          <div 
            className="absolute -bottom-1.5 -right-1.5 px-1.5 py-0.5 bg-black/90 border border-red-500 text-[10px] font-black text-red-300 rounded-full shadow-[0_0_8px_rgba(239,68,68,0.8)] flex items-center gap-0.5" 
            title="Grimoire Semanggi 5 Daun (Anti-Sihir)"
          >
            <span>☘️</span>
            <span className="text-[9px] font-mono font-black text-amber-300">5</span>
          </div>
        </div>

        {/* Minimal Label (Bukan kartu bulky) */}
        <div className="text-left hidden sm:block pr-1">
          <div className="flex items-center gap-1 text-[10px] font-black text-red-400 font-mono tracking-tight">
            <span>BLACK BULLS</span>
          </div>
          <div className="text-xs font-black text-white font-japanese flex items-center gap-1">
            <span>ASTA</span>
            <span className="text-[10px] text-amber-400 font-normal">アスタ</span>
          </div>
          <div className="text-[10px] font-bold text-stone-300">
            5-Leaf Grimoire
          </div>
        </div>
      </button>
    </div>
  );
};

/**
 * Yuno Figure Companion:
 * Displays Yuno (the person), Golden Dawn team badge, and his 4-Leaf Grimoire.
 * Compact, interactive, and NO bulky rectangular cards!
 */
export const YunoFigureBadge: React.FC<{
  onInteract?: () => void;
}> = ({ onInteract }) => {
  const [showQuote, setShowQuote] = useState(false);

  const handleClick = () => {
    setShowQuote(prev => !prev);
    if (onInteract) onInteract();
  };

  return (
    <div className="relative inline-flex items-center">
      {/* Interactive Speech Bubble */}
      {showQuote && (
        <div className="absolute -top-16 left-1/2 -translate-x-1/2 z-30 w-52 sm:w-60 p-2 bg-stone-950/95 border-2 border-emerald-400 rounded-xl shadow-[0_0_20px_rgba(16,185,129,0.6)] text-center animate-in fade-in zoom-in-95 duration-200">
          <div className="text-[10px] font-black text-emerald-400 font-mono uppercase tracking-wider flex items-center justify-center gap-1">
            <Wind className="w-3 h-3 text-emerald-400 animate-pulse" />
            <span>Yuno · Spirit Wind</span>
          </div>
          <p className="text-[11px] font-bold text-amber-200 font-japanese mt-0.5 leading-tight">
            「オレが魔法帝になる!!」
          </p>
          <p className="text-[10px] text-stone-300 mt-0.5">
            "Aku yang akan menjadi Kaisar Sihir!"
          </p>
          <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-stone-950 border-r-2 border-b-2 border-emerald-400 rotate-45" />
        </div>
      )}

      {/* Main Avatar & Crest Cluster */}
      <button
        type="button"
        onClick={handleClick}
        className="group relative flex items-center gap-2 p-1.5 sm:p-2 bg-stone-900/90 hover:bg-stone-850 border-2 border-emerald-500/70 hover:border-emerald-300 rounded-2xl shadow-[0_0_15px_rgba(16,185,129,0.3)] transition-all cursor-pointer transform hover:scale-105 active:scale-95"
        title="Klik Yuno untuk mendengarkan tekad Sihir Angin!"
      >
        {/* Karakter Orangnya: Yuno */}
        <div className="relative">
          <img
            src="/src/assets/images/yuno_anime_fullcolor_1792000879868.jpg"
            alt="Yuno"
            className="w-12 h-12 sm:w-14 sm:h-14 rounded-full object-cover border-2 border-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.6)]"
          />
          {/* Lambang Team: Golden Dawn Crest */}
          <div className="absolute -top-1.5 -left-1.5 rounded-full ring-2 ring-stone-950 bg-stone-950" title="Squad: Fajar Emas (Golden Dawn)">
            <GoldenDawnEmblem className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          {/* Grimoire: 4-Leaf Clover Badge */}
          <div 
            className="absolute -bottom-1.5 -right-1.5 px-1.5 py-0.5 bg-black/90 border border-emerald-400 text-[10px] font-black text-emerald-300 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.8)] flex items-center gap-0.5" 
            title="Grimoire Semanggi 4 Daun (Sihir Angin)"
          >
            <span>🍀</span>
            <span className="text-[9px] font-mono font-black text-emerald-300">4</span>
          </div>
        </div>

        {/* Minimal Label (Bukan kartu bulky) */}
        <div className="text-left hidden sm:block pr-1">
          <div className="flex items-center gap-1 text-[10px] font-black text-emerald-400 font-mono tracking-tight">
            <span>GOLDEN DAWN</span>
          </div>
          <div className="text-xs font-black text-white font-japanese flex items-center gap-1">
            <span>YUNO</span>
            <span className="text-[10px] text-emerald-300 font-normal">ユノ</span>
          </div>
          <div className="text-[10px] font-bold text-stone-300">
            4-Leaf Grimoire
          </div>
        </div>
      </button>
    </div>
  );
};
