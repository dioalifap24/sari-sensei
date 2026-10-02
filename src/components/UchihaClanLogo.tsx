import React from 'react';

interface UchihaClanLogoProps {
  className?: string;
}

/**
 * 🎴 LOGO KLAN UCHIWA / UCHIHA (Authentic Fan Crest)
 * Bagian atas merah menyala, bagian bawah putih dengan gagang kipas putih berbingkai merah pekat.
 */
export const UchihaClanLogo: React.FC<UchihaClanLogoProps> = ({ className = "w-5 h-5" }) => {
  return (
    <svg 
      viewBox="0 0 100 115" 
      className={`${className} shrink-0 drop-shadow-xs`}
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Logo Klan Uchiha"
    >
      {/* Gagang Kipas Putih di bagian bawah */}
      <rect 
        x="44" 
        y="82" 
        width="12" 
        height="30" 
        rx="3" 
        fill="#ffffff" 
        stroke="#7f1d1d" 
        strokeWidth="3.5" 
      />
      {/* Bagian Bawah Kipas: Putih */}
      <path 
        d="M 50 10 A 42 42 0 0 1 92 52 A 42 42 0 0 1 50 94 A 42 42 0 0 1 8 52 A 42 42 0 0 1 50 10 Z" 
        fill="#ffffff" 
        stroke="#7f1d1d" 
        strokeWidth="3.5"
      />
      {/* Bagian Atas Kipas: Merah Uchiha */}
      <path 
        d="M 8 52 A 42 42 0 0 1 92 52 L 8 52 Z" 
        fill="#dc2626" 
        stroke="#7f1d1d" 
        strokeWidth="3.5"
      />
      {/* Garis Horizontal Pemisah Tengah */}
      <line 
        x1="8" 
        y1="52" 
        x2="92" 
        y2="52" 
        stroke="#7f1d1d" 
        strokeWidth="3.5" 
      />
    </svg>
  );
};
