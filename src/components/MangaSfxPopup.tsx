import React, { useEffect, useState } from 'react';

export interface MangaSfxItem {
  id: string;
  jp: string;
  romaji: string;
  meaning: string;
  color: string;
  bg: string;
  rotation: string;
  scale: string;
  top: string;
  left: string;
}

const MANGA_SFX_PRESETS: Omit<MangaSfxItem, 'id'>[] = [
  { jp: 'ドーン!', romaji: 'DON!', meaning: 'Dentuman / Selesai Sempurna!', color: 'text-white', bg: 'bg-[#881337]', rotation: '-rotate-6', scale: 'scale-110', top: 'top-1/3', left: 'left-1/2' },
  { jp: 'ドキドキ', romaji: 'DOKI DOKI', meaning: 'Hati Berdebar Semangat!', color: 'text-amber-950', bg: 'bg-amber-300', rotation: 'rotate-3', scale: 'scale-125', top: 'top-1/4', left: 'left-1/3' },
  { jp: 'バーン!', romaji: 'BAAN!', meaning: 'Tugas Sukses Terkirim!', color: 'text-white', bg: 'bg-rose-600', rotation: 'rotate-6', scale: 'scale-105', top: 'top-2/3', left: 'left-2/3' },
  { jp: 'ズキューーン!', romaji: 'ZUKYUUN!', meaning: 'Tepat Sasaran (Target Tercapai)!', color: 'text-white', bg: 'bg-emerald-700', rotation: '-rotate-3', scale: 'scale-120', top: 'top-1/2', left: 'left-1/4' },
  { jp: 'やったー!', romaji: 'YATTAA!', meaning: 'Hore, Berhasil Selesai!', color: 'text-stone-900', bg: 'bg-yellow-300', rotation: 'rotate-2', scale: 'scale-115', top: 'top-1/5', left: 'left-2/3' },
  { jp: 'ゴゴゴゴ', romaji: 'GOGOGO...', meaning: 'Aura Konsentrasi Master!', color: 'text-white', bg: 'bg-stone-900', rotation: '-rotate-4', scale: 'scale-100', top: 'top-3/4', left: 'left-1/3' },
  { jp: 'キラッ!', romaji: 'KIRA!', meaning: 'Sempurna & Berkilau!', color: 'text-amber-950', bg: 'bg-yellow-200', rotation: 'rotate-4', scale: 'scale-110', top: 'top-1/3', left: 'left-3/4' },
];

interface MangaSfxPopupProps {
  onComplete?: () => void;
}

export const MangaSfxPopup: React.FC<MangaSfxPopupProps> = ({ onComplete }) => {
  const [items, setItems] = useState<MangaSfxItem[]>([]);

  useEffect(() => {
    // Pilih 2 hingga 3 efek suara manga secara acak yang muncul di layar dengan posisi berbeda
    const shuffled = [...MANGA_SFX_PRESETS].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, 3).map((item, idx) => ({
      ...item,
      id: `${Date.now()}_${idx}`,
      // Beri variasi posisi acak sedikit agar dinamis
      top: `${20 + Math.floor(Math.random() * 55)}%`,
      left: `${15 + Math.floor(Math.random() * 65)}%`,
      rotation: `rotate-${(idx % 2 === 0 ? -1 : 1) * (3 + Math.floor(Math.random() * 8))}`,
    }));

    setItems(selected);

    const timer = window.setTimeout(() => {
      setItems([]);
      if (onComplete) onComplete();
    }, 3200);

    return () => clearTimeout(timer);
  }, [onComplete]);

  if (items.length === 0) return null;

  return (
    <div className="fixed inset-0 z-[9999] pointer-events-none select-none flex items-center justify-center overflow-hidden">
      {/* Background radial manga impact flash */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-2xs animate-in fade-in duration-200" />

      {/* Speed lines background effect */}
      <div className="absolute inset-0 opacity-25 pointer-events-none">
        <svg className="w-full h-full" viewBox="0 0 1000 1000" preserveAspectRatio="none">
          <g stroke="#ffffff" strokeWidth="2.5">
            <line x1="500" y1="500" x2="0" y2="0" />
            <line x1="500" y1="500" x2="250" y2="0" />
            <line x1="500" y1="500" x2="500" y2="0" />
            <line x1="500" y1="500" x2="750" y2="0" />
            <line x1="500" y1="500" x2="1000" y2="0" />
            <line x1="500" y1="500" x2="0" y2="250" />
            <line x1="500" y1="500" x2="1000" y2="250" />
            <line x1="500" y1="500" x2="0" y2="500" />
            <line x1="500" y1="500" x2="1000" y2="500" />
            <line x1="500" y1="500" x2="0" y2="750" />
            <line x1="500" y1="500" x2="1000" y2="750" />
            <line x1="500" y1="500" x2="0" y2="1000" />
            <line x1="500" y1="500" x2="250" y2="1000" />
            <line x1="500" y1="500" x2="500" y2="1000" />
            <line x1="500" y1="500" x2="750" y2="1000" />
            <line x1="500" y1="500" x2="1000" y2="1000" />
          </g>
        </svg>
      </div>

      {items.map((item, idx) => (
        <div
          key={item.id}
          style={{ top: item.top, left: item.left, animationDelay: `${idx * 120}ms` }}
          className={`absolute transform -translate-x-1/2 -translate-y-1/2 z-50 transition-all duration-500 animate-in zoom-in-50 slide-in-from-bottom-6 ${item.rotation} ${item.scale}`}
        >
          <div className={`relative px-6 py-4 rounded-2xl border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] ${item.bg} ${item.color} text-center flex flex-col items-center justify-center`}>
            {/* Manga panel corner ticks */}
            <span className="absolute top-1 left-1 w-2 h-2 border-t-2 border-l-2 border-black" />
            <span className="absolute top-1 right-1 w-2 h-2 border-t-2 border-r-2 border-black" />
            <span className="absolute bottom-1 left-1 w-2 h-2 border-b-2 border-l-2 border-black" />
            <span className="absolute bottom-1 right-1 w-2 h-2 border-b-2 border-r-2 border-black" />

            <span className="font-japanese font-black text-3xl sm:text-5xl tracking-wider drop-shadow-[2px_2px_0px_rgba(0,0,0,0.8)]">
              {item.jp}
            </span>
            <span className="font-mono font-extrabold text-xs sm:text-sm tracking-widest mt-1 opacity-90 uppercase">
              {item.romaji}
            </span>
            <span className="text-[11px] sm:text-xs font-bold mt-1 px-3 py-0.5 rounded-full bg-black/20 text-white border border-white/30">
              {item.meaning}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};
