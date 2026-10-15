import React from 'react';
import { Flame, Wind, Sparkles } from 'lucide-react';
import { BlackBullsEmblem, GoldenDawnEmblem, CloverGrimoiresPairImg } from './BlackCloverAssets';

const MANA_MOTES = [
  { id: 1, left: '6%', size: 14, duration: '9.2s', delay: '0s', midX: '28px', endX: '-16px', color: '#ef4444', type: 'clover5' },
  { id: 2, left: '16%', size: 10, duration: '11.5s', delay: '1.2s', midX: '-20px', endX: '24px', color: '#f59e0b', type: 'spark' },
  { id: 3, left: '26%', size: 16, duration: '10.0s', delay: '2.5s', midX: '32px', endX: '-22px', color: '#10b981', type: 'clover4' },
  { id: 4, left: '36%', size: 8, duration: '12.8s', delay: '0.5s', midX: '-18px', endX: '15px', color: '#fbbf24', type: 'spark' },
  { id: 5, left: '46%', size: 15, duration: '8.8s', delay: '3.1s', midX: '22px', endX: '-26px', color: '#ef4444', type: 'clover5' },
  { id: 6, left: '56%', size: 11, duration: '10.6s', delay: '1.8s', midX: '-26px', endX: '20px', color: '#f59e0b', type: 'spark' },
  { id: 7, left: '66%', size: 16, duration: '9.5s', delay: '0.8s', midX: '24px', endX: '-18px', color: '#10b981', type: 'clover4' },
  { id: 8, left: '76%', size: 9, duration: '11.8s', delay: '2.9s', midX: '-22px', endX: '25px', color: '#fbbf24', type: 'spark' },
  { id: 9, left: '86%', size: 14, duration: '9.1s', delay: '3.8s', midX: '20px', endX: '-20px', color: '#ef4444', type: 'clover5' },
  { id: 10, left: '94%', size: 15, duration: '10.4s', delay: '1.5s', midX: '-30px', endX: '16px', color: '#10b981', type: 'clover4' },
];

/**
 * Ornamen Clover 4-Daun (Yuno / Golden Dawn)
 */
const CloverFourLeafSVG: React.FC<{ size?: number; color?: string }> = ({ size = 16, color = '#10b981' }) => (
  <svg width={size} height={size} viewBox="-15 -15 30 30" fill="none">
    {[0, 90, 180, 270].map(angle => (
      <path
        key={angle}
        d="M0 0 C-4 -6 -8 -12 -2 -14 C2 -16 6 -12 0 0 Z"
        fill={color}
        fillOpacity="0.85"
        stroke="#34d399"
        strokeWidth="0.8"
        transform={`rotate(${angle})`}
      />
    ))}
    <circle cx="0" cy="0" r="2.2" fill="#fde047" />
  </svg>
);

/**
 * Ornamen Clover 5-Daun (Asta / Five-Leaf Anti-Magic Grimoire)
 */
const CloverFiveLeafSVG: React.FC<{ size?: number; color?: string }> = ({ size = 16, color = '#dc2626' }) => (
  <svg width={size} height={size} viewBox="-16 -16 32 32" fill="none">
    {[0, 72, 144, 216, 288].map(angle => (
      <path
        key={angle}
        d="M0 0 C-4 -6 -7 -13 -1 -15 C3 -16 6 -12 0 0 Z"
        fill={color}
        fillOpacity="0.88"
        stroke="#f87171"
        strokeWidth="0.8"
        transform={`rotate(${angle})`}
      />
    ))}
    <circle cx="0" cy="0" r="2.4" fill="#000000" stroke="#ef4444" strokeWidth="0.8" />
  </svg>
);

/**
 * Lingkaran Sihir Raksasa Kerajaan Clover (Grimoire Mahojin 魔法陣)
 */
const CloverGrimoireMahojin: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`select-none pointer-events-none ${className}`} aria-hidden="true">
    <svg viewBox="0 0 500 500" className="w-[320px] sm:w-[500px] lg:w-[680px] h-[320px] sm:h-[500px] lg:h-[680px] animate-mana-rotate opacity-35 sm:opacity-50 drop-shadow-[0_0_25px_rgba(245,158,11,0.35)]">
      <defs>
        <radialGradient id="mahojinGrad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.35" />
          <stop offset="50%" stopColor="#d97706" stopOpacity="0.18" />
          <stop offset="100%" stopColor="#78350f" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Glow Center */}
      <circle cx="250" cy="250" r="230" fill="url(#mahojinGrad)" />

      {/* Cincin Luar Berisi Simbol Rune */}
      <circle cx="250" cy="250" r="220" stroke="#f59e0b" strokeWidth="2.5" strokeDasharray="14 8" fill="none" />
      <circle cx="250" cy="250" r="200" stroke="#d97706" strokeWidth="1.5" fill="none" />
      <circle cx="250" cy="250" r="175" stroke="#fbbf24" strokeWidth="2" strokeDasharray="6 4" fill="none" />

      {/* Bintang Okultis Segi Delapan (Grimoire Seal Octagram) */}
      <polygon points="250,55 388,112 445,250 388,388 250,445 112,388 55,250 112,112" stroke="#f59e0b" strokeWidth="1.5" fill="none" />
      <polygon points="250,75 425,250 250,425 75,250" stroke="#ef4444" strokeWidth="1.2" strokeOpacity="0.7" fill="none" />
      <polygon points="374,126 374,374 126,374 126,126" stroke="#10b981" strokeWidth="1.2" strokeOpacity="0.7" fill="none" />

      {/* Cincin Tengah Simbol Clover */}
      <circle cx="250" cy="250" r="110" stroke="#fbbf24" strokeWidth="2" fill="none" />
      <circle cx="250" cy="250" r="80" stroke="#d97706" strokeWidth="1.5" strokeDasharray="8 6" fill="none" />

      {/* 4 Titik Mata Angin Simbol Sihir */}
      {[0, 90, 180, 270].map(rot => (
        <g key={rot} transform={`rotate(${rot} 250 250)`}>
          <line x1="250" y1="35" x2="250" y2="75" stroke="#f59e0b" strokeWidth="2.5" />
          <circle cx="250" cy="35" r="5" fill="#f59e0b" />
          <circle cx="250" cy="95" r="4" fill="#fbbf24" />
        </g>
      ))}

      {/* Simbol Daun Semanggi di Inti Mahojin */}
      <circle cx="250" cy="250" r="42" fill="#1c1917" stroke="#fbbf24" strokeWidth="2" />
      {[0, 72, 144, 216, 288].map(deg => (
        <path
          key={deg}
          d="M250 250 C242 238 236 220 248 216 C256 214 262 222 250 250 Z"
          fill="#f59e0b"
          transform={`rotate(${deg} 250 250)`}
        />
      ))}
      <circle cx="250" cy="250" r="7" fill="#fbbf24" />
    </svg>
  </div>
);

/**
 * Komponen Latar Belakang Lengkap Tema Black Clover (Full Anime Background Scene)
 *
 * Fitur:
 * 1. Full Panoramic Wallpaper: Menampilkan Asta (Anti-Sihir) di kiri, Yuno (Sihir Angin) di kanan,
 *    istana Kerajaan Clover, dan Mahojin Bulan Purnama mencakup seluruh layar (Full Background).
 * 2. Sosok Karakter Berskala Penuh (Full-Scale Guardians) di sisi kiri & kanan tanpa kotak sempit:
 *    - Sisi Kiri: Asta berdiri penuh dengan pedang raksasa Demon Slayer & aura api hitam-merah.
 *    - Sisi Kanan: Yuno melayang penuh dengan grimoire 4-daun & pusaran sihir angin zamrud.
 * 3. Partikel Mana melayang (Semanggi 5-daun, 4-daun, dan pendar sihir emas).
 * 4. Tembus pandang sempurna dengan konten halaman Master yang transparan (glassmorphism).
 */
export const BlackCloverBackgroundScene: React.FC = () => {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none select-none overflow-hidden" aria-hidden="true">
      {/* =========================================================================
          1. WALLPAPER ANIME FULL SCREEN (FULL LATAR BELAKANG BLACK CLOVER)
          ========================================================================= */}
      <div className="absolute inset-0 z-0">
        <img
          src="/src/assets/images/clover_full_wallpaper_1792055444045.jpg"
          alt="Black Clover Epic Anime Universe Background"
          className="w-full h-full object-cover object-top sm:object-center filter brightness-[0.98] contrast-105 scale-100 transition-all duration-700"
        />

        {/* Lapisan Vignette Sangat Halus agar Latar Belakang Tetap Terlihat Nyata & Tajam */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_95%_90%_at_50%_35%,rgba(9,11,20,0.12),rgba(9,11,20,0.38)_80%,rgba(9,11,20,0.70)_100%)]" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#090b14]/30 via-transparent to-[#090b14]/60" />
        <div className="absolute inset-0 bg-gradient-to-r from-red-950/15 via-transparent to-emerald-950/15" />
      </div>

      {/* =========================================================================
          2. GLOW AURA SIHIR SISI KIRI (ANTI-SIHIR) & SISI KANAN (ANGIN SYLPH)
          ========================================================================= */}
      <div className="absolute top-0 left-0 w-[420px] lg:w-[580px] h-[550px] bg-red-600/15 rounded-full blur-[110px] pointer-events-none" />
      <div className="absolute top-0 right-0 w-[420px] lg:w-[580px] h-[550px] bg-emerald-500/15 rounded-full blur-[110px] pointer-events-none" />

      {/* =========================================================================
          3. LINGKARAN SIHIR MAHOJIN BESAR BERPUTAR DI LANGIT TENGAH ATAS
          ========================================================================= */}
      <div className="absolute inset-x-0 top-4 sm:top-10 z-0 flex justify-center pointer-events-none overflow-hidden">
        <CloverGrimoireMahojin />
      </div>

      {/* =========================================================================
          4. PARTIKEL MANA, EMBER MERAH & SEMANGGI MELAYANG KE ATAS
          ========================================================================= */}
      <div className="absolute inset-0 overflow-hidden z-0 pointer-events-none">
        {MANA_MOTES.map(m => (
          <div
            key={m.id}
            className="absolute -bottom-6 clover-mana-mote"
            style={
              {
                left: m.left,
                '--mote-duration': m.duration,
                '--mote-delay': m.delay,
                '--mote-mid-x': m.midX,
                '--mote-end-x': m.endX,
              } as React.CSSProperties
            }
          >
            {m.type === 'clover5' && <CloverFiveLeafSVG size={m.size} />}
            {m.type === 'clover4' && <CloverFourLeafSVG size={m.size} />}
            {m.type === 'spark' && (
              <div
                className="rounded-full shadow-lg"
                style={{
                  width: `${m.size}px`,
                  height: `${m.size}px`,
                  backgroundColor: m.color,
                  boxShadow: `0 0 14px ${m.color}`,
                }}
              />
            )}
          </div>
        ))}
      </div>

      {/* =========================================================================
          5. KARAKTER FULL BODY SISI KIRI: ASTA (ANTI-SIHIR & BANTENG HITAM)
             Menyatu mulus ke latar belakang, tampil gagah di sayap kiri
          ========================================================================= */}
      <div className="fixed bottom-0 left-0 xl:left-2 2xl:left-6 z-0 flex flex-col items-start pointer-events-none select-none">
        <div className="relative group animate-anti-magic-breath opacity-40 sm:opacity-65 lg:opacity-100 transition-opacity">
          {/* Aura Api Anti-Sihir Merah Menggelegak */}
          <div className="absolute -inset-8 bg-gradient-to-t from-red-600/35 via-red-900/15 to-transparent rounded-full blur-3xl pointer-events-none" />

          {/* Sosok Karakter Asta Full Height */}
          <div 
            className="relative w-[180px] sm:w-[260px] lg:w-[320px] xl:w-[410px] 2xl:w-[480px] h-[55vh] sm:h-[68vh] lg:h-[80vh] xl:h-[88vh] 2xl:h-[94vh] pointer-events-none select-none flex items-end"
            style={{
              maskImage: 'linear-gradient(to top, transparent 0%, black 15%, black 88%, transparent 100%), linear-gradient(to right, black 70%, transparent 100%)',
              WebkitMaskImage: 'linear-gradient(to top, transparent 0%, black 15%, black 88%, transparent 100%), linear-gradient(to right, black 70%, transparent 100%)',
            }}
          >
            <img
              src="/src/assets/images/asta_anime_fullcolor_1792000879458.jpg"
              alt="Asta Anti-Magic Guardian"
              className="w-full h-full object-contain object-bottom filter brightness-105 contrast-110 drop-shadow-[0_0_35px_rgba(220,38,38,0.6)]"
            />
          </div>

          {/* Badge Melayang Squad Banteng Hitam (Black Bulls) */}
          <div className="hidden sm:flex absolute top-16 left-4 xl:left-8 items-center gap-2 px-2.5 py-1.5 bg-stone-950/85 backdrop-blur-md border border-red-500/80 rounded-xl shadow-[0_0_20px_rgba(239,68,68,0.6)]">
            <BlackBullsEmblem className="w-7 h-7 sm:w-8 sm:h-8" />
            <div className="flex flex-col text-left">
              <div className="flex items-center gap-1">
                <Flame className="w-3 h-3 text-red-500 fill-red-500 animate-pulse" />
                <span className="text-[11px] font-black text-amber-300 font-japanese">アスタ</span>
              </div>
              <span className="text-[9px] font-mono font-bold text-red-400 tracking-wider uppercase">
                Black Bulls · 5-Leaf
              </span>
            </div>
          </div>

          {/* Kutipan Sumpah Asta di Bawah */}
          <div className="hidden sm:block absolute bottom-8 left-4 xl:left-8 px-3 py-1.5 bg-stone-950/90 backdrop-blur-md border border-red-600/70 rounded-xl shadow-lg max-w-[200px]">
            <p className="text-[10px] font-bold text-red-300 font-japanese leading-tight">
              「諦めないのがオレの魔法だ!!」
            </p>
            <p className="text-[9px] font-mono text-stone-400 mt-0.5">
              "Pantang menyerah adalah sihirku!"
            </p>
          </div>
        </div>
      </div>

      {/* =========================================================================
          6. KARAKTER FULL BODY SISI KANAN: YUNO (SIHIR ANGIN & FAJAR EMAS)
             Menyatu mulus ke latar belakang, tampil megah di sayap kanan
          ========================================================================= */}
      <div className="fixed bottom-0 right-0 xl:right-2 2xl:right-6 z-0 flex flex-col items-end pointer-events-none select-none">
        <div className="relative group animate-wind-spirit-breath opacity-40 sm:opacity-65 lg:opacity-100 transition-opacity">
          {/* Aura Angin Sylph Hijau Zamrud Berputar */}
          <div className="absolute -inset-8 bg-gradient-to-t from-emerald-600/35 via-emerald-900/15 to-transparent rounded-full blur-3xl pointer-events-none" />

          {/* Sosok Karakter Yuno Full Height */}
          <div 
            className="relative w-[180px] sm:w-[260px] lg:w-[320px] xl:w-[410px] 2xl:w-[480px] h-[55vh] sm:h-[68vh] lg:h-[80vh] xl:h-[88vh] 2xl:h-[94vh] pointer-events-none select-none flex items-end justify-end"
            style={{
              maskImage: 'linear-gradient(to top, transparent 0%, black 15%, black 88%, transparent 100%), linear-gradient(to left, black 70%, transparent 100%)',
              WebkitMaskImage: 'linear-gradient(to top, transparent 0%, black 15%, black 88%, transparent 100%), linear-gradient(to left, black 70%, transparent 100%)',
            }}
          >
            <img
              src="/src/assets/images/yuno_anime_fullcolor_1792000879868.jpg"
              alt="Yuno Wind Spirit Guardian"
              className="w-full h-full object-contain object-bottom filter brightness-105 contrast-110 drop-shadow-[0_0_35px_rgba(16,185,129,0.6)]"
            />
          </div>

          {/* Badge Melayang Squad Fajar Emas (Golden Dawn) */}
          <div className="hidden sm:flex absolute top-16 right-4 xl:right-8 items-center gap-2 px-2.5 py-1.5 bg-stone-950/85 backdrop-blur-md border border-emerald-500/80 rounded-xl shadow-[0_0_20px_rgba(16,185,129,0.6)]">
            <div className="flex flex-col text-right">
              <div className="flex items-center justify-end gap-1">
                <span className="text-[11px] font-black text-amber-300 font-japanese">ユノ</span>
                <Wind className="w-3 h-3 text-emerald-400 animate-pulse" />
              </div>
              <span className="text-[9px] font-mono font-bold text-emerald-400 tracking-wider uppercase">
                Golden Dawn · 4-Leaf
              </span>
            </div>
            <GoldenDawnEmblem className="w-7 h-7 sm:w-8 sm:h-8" />
          </div>

          {/* Kutipan Ambisi Yuno di Bawah */}
          <div className="hidden sm:block absolute bottom-8 right-4 xl:right-8 px-3 py-1.5 bg-stone-950/90 backdrop-blur-md border border-emerald-500/70 rounded-xl shadow-lg max-w-[200px] text-right">
            <p className="text-[10px] font-bold text-emerald-300 font-japanese leading-tight">
              「オレが魔法帝になる!!」
            </p>
            <p className="text-[9px] font-mono text-stone-400 mt-0.5">
              "Aku yang akan jadi Kaisar Sihir!"
            </p>
          </div>
        </div>
      </div>


      {/* =========================================================================
          7. ORNAMEN AMBIENT MOBILE & TABLET (< lg)
             Di HP / tablet, wallpaper full background sudah otomatis mengisi layar.
             Ditambahkan lencana squad melayang yang elegan di kiri & kanan atas.
          ========================================================================= */}
      <div className="lg:hidden absolute inset-x-0 top-3 z-0 flex items-center justify-between px-3 sm:px-6 pointer-events-none opacity-80 overflow-hidden">
        {/* Lencana Asta & Banteng Hitam */}
        <div className="flex items-center gap-1.5 px-2 py-1 bg-stone-950/80 backdrop-blur-md border border-red-500/70 rounded-full shadow-[0_0_12px_rgba(239,68,68,0.5)]">
          <BlackBullsEmblem className="w-6 h-6" />
          <span className="text-[9px] font-black text-red-300 font-mono">ASTA · 5☘️</span>
        </div>

        {/* Lencana Yuno & Fajar Emas */}
        <div className="flex items-center gap-1.5 px-2 py-1 bg-stone-950/80 backdrop-blur-md border border-emerald-500/70 rounded-full shadow-[0_0_12px_rgba(16,185,129,0.5)]">
          <span className="text-[9px] font-black text-emerald-300 font-mono">YUNO · 4🍀</span>
          <GoldenDawnEmblem className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
};
