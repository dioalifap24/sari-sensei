import React from 'react';

const FALLING_PETALS = [
  { id: 1, left: '6%', size: 16, duration: '8.5s', delay: '0s', midX: '32px', endX: '-18px' },
  { id: 2, left: '14%', size: 13, duration: '10.2s', delay: '1.4s', midX: '-24px', endX: '22px' },
  { id: 3, left: '22%', size: 18, duration: '9.1s', delay: '2.8s', midX: '38px', endX: '-12px' },
  { id: 4, left: '31%', size: 12, duration: '11.4s', delay: '0.7s', midX: '-28px', endX: '18px' },
  { id: 5, left: '44%', size: 15, duration: '9.8s', delay: '3.5s', midX: '25px', endX: '-25px' },
  { id: 6, left: '57%', size: 14, duration: '10.6s', delay: '1.9s', midX: '-30px', endX: '20px' },
  { id: 7, left: '68%', size: 17, duration: '8.8s', delay: '0.4s', midX: '34px', endX: '-16px' },
  { id: 8, left: '77%', size: 13, duration: '11.0s', delay: '2.2s', midX: '-22px', endX: '28px' },
  { id: 9, left: '86%', size: 19, duration: '9.4s', delay: '3.1s', midX: '28px', endX: '-24px' },
  { id: 10, left: '93%', size: 14, duration: '10.0s', delay: '1.1s', midX: '-35px', endX: '15px' },
  { id: 11, left: '11%', size: 15, duration: '9.6s', delay: '4.3s', midX: '22px', endX: '-28px' },
  { id: 12, left: '89%', size: 16, duration: '8.9s', delay: '4.8s', midX: '-26px', endX: '24px' },
];

/**
 * Bunga Sakura 5-Kelopak Menggemaskan (SVG)
 */
const CuteSakuraFlowerSVG: React.FC<{
  x: number;
  y: number;
  scale?: number;
  delay?: string;
}> = ({ x, y, scale = 1, delay = '0s' }) => (
  <g transform={`translate(${x}, ${y}) scale(${scale})`}>
    <g className="animate-sakura-blossom" style={{ animationDelay: delay }}>
      {[0, 72, 144, 216, 288].map(angle => (
        <path
          key={angle}
          d="M0,0 C-6,-10 -9,-20 -3,-25 C0,-22 0,-20 0,-20 C0,-20 0,-22 3,-25 C9,-20 6,-10 0,0 Z"
          fill="#ffe4e6"
          stroke="#f472b6"
          strokeWidth="1.2"
          transform={`rotate(${angle})`}
        />
      ))}
      <circle cx="0" cy="0" r="4.2" fill="#fbbf24" />
      <circle cx="-1.5" cy="-1.2" r="1" fill="#fffbeb" />
    </g>
  </g>
);

/**
 * Ornamen Lentera Kertas Kuil Jepang (Chouchin 提灯)
 */
const ShrineChouchinLantern: React.FC<{
  kanji: string;
  subLabel: string;
  delay?: string;
  className?: string;
}> = ({ kanji, subLabel, delay = '0s', className = '' }) => (
  <div
    className={`animate-shrine-lantern select-none pointer-events-none ${className}`}
    style={{ animationDelay: delay }}
    aria-hidden="true"
  >
    <svg width="68" height="132" viewBox="0 0 68 132" fill="none">
      {/* Tali Gantungan Kuil */}
      <line x1="34" y1="0" x2="34" y2="18" stroke="#78350f" strokeWidth="2.5" />
      <circle cx="34" cy="14" r="3.5" fill="#d97706" />

      {/* Tutup Atas Lentera Kayu Hitam & Emas */}
      <rect x="19" y="17" width="30" height="7" rx="3" fill="#292524" stroke="#f59e0b" strokeWidth="1.5" />
      <rect x="23" y="23" width="22" height="4" rx="1.5" fill="#b45309" />

      {/* Aura Cahaya Hangat Lentera */}
      <ellipse cx="34" cy="56" rx="31" ry="34" fill="#fef08a" fillOpacity="0.28" />

      {/* Badan Lentera Merah Vermilion Kuil */}
      <ellipse
        cx="34"
        cy="56"
        rx="24"
        ry="30"
        fill="url(#lanternRedGrad)"
        stroke="#991b1b"
        strokeWidth="2"
      />

      {/* Garis Tulang Bambu Lentera */}
      <path d="M12 46 Q34 41 56 46" stroke="#7f1d1d" strokeWidth="1.1" strokeOpacity="0.55" fill="none" />
      <path d="M10 56 Q34 52 58 56" stroke="#7f1d1d" strokeWidth="1.1" strokeOpacity="0.55" fill="none" />
      <path d="M12 66 Q34 71 56 66" stroke="#7f1d1d" strokeWidth="1.1" strokeOpacity="0.55" fill="none" />

      {/* Lingkaran Kertas Putih & Huruf Kanji */}
      <circle cx="34" cy="56" r="14.5" fill="#fffbeb" fillOpacity="0.92" stroke="#f59e0b" strokeWidth="1.4" />
      <text
        x="34"
        y="61"
        textAnchor="middle"
        fill="#881337"
        fontSize="16"
        fontWeight="900"
        fontFamily="serif"
      >
        {kanji}
      </text>

      {/* Tutup Bawah Lentera */}
      <rect x="23" y="84" width="22" height="4" rx="1.5" fill="#b45309" />
      <rect x="20" y="87" width="28" height="6" rx="2.5" fill="#292524" stroke="#f59e0b" strokeWidth="1.4" />

      {/* Rumbai Emas Kuil (Fusa) */}
      <line x1="34" y1="93" x2="34" y2="104" stroke="#d97706" strokeWidth="2.2" />
      <circle cx="34" cy="103" r="3.5" fill="#f59e0b" />
      <path d="M31 106 L28 126 M34 106 L34 128 M37 106 L40 126" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" />

      <defs>
        <radialGradient id="lanternRedGrad" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(34 54) rotate(90) scale(30 24)">
          <stop offset="0%" stopColor="#fb7185" />
          <stop offset="55%" stopColor="#e11d48" />
          <stop offset="100%" stopColor="#881337" />
        </radialGradient>
      </defs>
    </svg>
    <div className="-mt-1 text-center">
      <span className="text-[10px] font-bold text-[#881337]/80 tracking-wider">{subLabel}</span>
    </div>
  </div>
);

/**
 * Komponen Dekorasi Latar Kuil Jepang (Torii, Shimenawa, Lentera Batu Tourou, Papan Ema)
 * & Sepasang Pohon Sakura Menggemaskan dengan Burung Shima Enaga
 */
export const JapaneseShrineSakuraScene: React.FC = () => {
  return (
    <div className="pointer-events-none select-none" aria-hidden="true">
      {/* 1. KELOPAK & KUNTUM BUNGA SAKURA BERGUGURAN MENGGEMASKAN (SAKURA FUBUKI) */}
      <div className="fixed inset-0 overflow-hidden z-10 pointer-events-none">
        {FALLING_PETALS.map(p => (
          <div
            key={p.id}
            className="absolute -top-6 sakura-falling-petal"
            style={
              {
                left: p.left,
                '--petal-duration': p.duration,
                '--petal-delay': p.delay,
                '--petal-mid-x': p.midX,
                '--petal-end-x': p.endX,
              } as React.CSSProperties
            }
          >
            {p.id % 3 === 0 ? (
              <svg width={p.size + 4} height={p.size + 4} viewBox="-30 -30 60 60">
                <CuteSakuraFlowerSVG x={0} y={0} scale={0.75} />
              </svg>
            ) : (
              <svg width={p.size} height={p.size} viewBox="0 0 24 24" fill="none">
                <path
                  d="M12 2C7.5 6 5 11.5 7.5 16.5C9.5 20.5 14.5 20.5 16.5 16.5C19 11.5 16.5 6 12 2ZM12 2C12 5.5 10.5 7 9.5 6C10.5 4.5 12 2 12 2Z"
                  fill="#fbcfe8"
                  stroke="#f472b6"
                  strokeWidth="1.2"
                />
              </svg>
            )}
          </div>
        ))}
      </div>

      {/* 2. LENTERA KUIL JEPANG MENGGANTUNG DI KIRI & KANAN ATAS (BACKGROUND) */}
      <div className="fixed top-14 left-2 sm:left-6 lg:left-12 z-0 hidden sm:block opacity-85 pointer-events-none">
        <ShrineChouchinLantern kanji="桜" subLabel="Sakura" delay="0s" />
      </div>
      <div className="fixed top-14 right-2 sm:right-6 lg:right-12 z-0 hidden sm:block opacity-85 pointer-events-none">
        <ShrineChouchinLantern kanji="道" subLabel="Semangat" delay="1.2s" />
      </div>

      {/* 3. BACKGROUND PANORAMA KUIL-KUIL JEPANG YANG MEGAH (PAGODA 5 TINGKAT, KUIL UTAMA HONDEN, DERETAN TORII & JEMBATAN MERAH) */}
      <div className="fixed inset-x-0 top-10 sm:top-12 z-0 flex justify-center pointer-events-none overflow-hidden opacity-40 sm:opacity-45">
        <svg
          viewBox="0 0 1200 310"
          className="w-full max-w-6xl h-52 sm:h-64 md:h-72 overflow-visible"
          fill="none"
        >
          {/* Matahari Musim Semi & Awan Emas di Latar Belakang */}
          <circle cx="600" cy="145" r="105" fill="url(#bgHeroSunGrad)" />
          <g fill="#fde68a" fillOpacity="0.45">
            <rect x="190" y="48" width="120" height="12" rx="6" />
            <rect x="220" y="58" width="95" height="10" rx="5" />
            <rect x="880" y="44" width="125" height="12" rx="6" />
            <rect x="855" y="54" width="100" height="10" rx="5" />
          </g>

          {/* Gunung Fuji di Kejauhan */}
          <path
            d="M380 275 Q525 180 568 88 L632 88 Q675 180 820 275 Z"
            fill="#fbcfe8"
            fillOpacity="0.5"
          />
          <path
            d="M568 88 L632 88 L648 124 L626 114 L612 128 L600 112 L588 128 L574 114 L552 124 Z"
            fill="#fffdfa"
            fillOpacity="0.85"
          />

          {/* Pagoda Kuil 5 Tingkat Megah (Goju-no-to 五重塔) di Latar Kiri */}
          <g transform="translate(215, 42)">
            <line x1="55" y1="0" x2="55" y2="24" stroke="#d97706" strokeWidth="3" />
            <circle cx="55" cy="8" r="3.5" fill="#fbbf24" />
            <circle cx="55" cy="15" r="3" fill="#fbbf24" />
            {[
              { y: 22, w: 54 },
              { y: 48, w: 64 },
              { y: 76, w: 74 },
              { y: 106, w: 86 },
              { y: 138, w: 98 },
            ].map((tier, idx) => {
              const x0 = 55 - tier.w / 2;
              const x1 = 55 + tier.w / 2;
              return (
                <g key={idx}>
                  <rect
                    x={55 - (tier.w - 22) / 2}
                    y={tier.y + 9}
                    width={tier.w - 22}
                    height="20"
                    fill="#be123c"
                    stroke="#881337"
                    strokeWidth="1.3"
                  />
                  <line x1={55} y1={tier.y + 11} x2={55} y2={tier.y + 27} stroke="#fbbf24" strokeWidth="1.5" />
                  <path
                    d={`M${x0 - 8} ${tier.y + 11} Q55 ${tier.y - 4} ${x1 + 8} ${tier.y + 11} L${x1} ${tier.y + 15} Q55 ${tier.y + 4} ${x0} ${tier.y + 15} Z`}
                    fill="#292524"
                    stroke="#f59e0b"
                    strokeWidth="1.1"
                  />
                </g>
              );
            })}
            <rect x="14" y="168" width="82" height="22" rx="3" fill="#e7e5e4" stroke="#78716c" strokeWidth="1.5" />
          </g>

          {/* Kuil Utama Agung (Honden / Shinden 本殿) di Latar Tengah */}
          <g transform="translate(480, 68)">
            <line x1="36" y1="26" x2="20" y2="4" stroke="#f59e0b" strokeWidth="3.5" strokeLinecap="round" />
            <line x1="204" y1="26" x2="220" y2="4" stroke="#f59e0b" strokeWidth="3.5" strokeLinecap="round" />
            {[65, 95, 120, 145, 175].map(kx => (
              <rect key={kx} x={kx - 5} y="14" width="10" height="5" rx="2.5" fill="#fbbf24" stroke="#92400e" strokeWidth="1" />
            ))}
            <path d="M8 58 Q120 8 232 58 L216 68 Q120 26 24 68 Z" fill="#292524" stroke="#fbbf24" strokeWidth="1.8" />
            <path d="M-6 78 Q120 40 246 78 L234 90 Q120 56 6 90 Z" fill="#3f3f46" stroke="#f59e0b" strokeWidth="1.6" />
            <polygon points="120,38 82,78 158,78" fill="#881337" stroke="#fbbf24" strokeWidth="2" />
            <circle cx="120" cy="62" r="7" fill="#fbbf24" />
            <rect x="26" y="84" width="188" height="76" fill="#fffbeb" stroke="#be123c" strokeWidth="2.5" />
            {[38, 74, 110, 130, 166, 202].map(px => (
              <rect key={px} x={px - 4} y="84" width="8" height="76" fill="#be123c" />
            ))}
            <rect x="86" y="102" width="68" height="58" fill="#881337" stroke="#fbbf24" strokeWidth="1.8" />
            <rect x="88" y="74" width="64" height="19" rx="3" fill="#292524" stroke="#fbbf24" strokeWidth="1.8" />
            <text x="120" y="87" textAnchor="middle" fill="#fde68a" fontSize="10" fontWeight="900" fontFamily="serif">
              日本語神殿
            </text>
            <path d="M46 96 Q120 112 194 96" stroke="#d97706" strokeWidth="5.5" strokeLinecap="round" fill="none" />
            <circle cx="120" cy="109" r="8.5" fill="#fbbf24" stroke="#92400e" strokeWidth="1.5" />
            <rect x="16" y="160" width="208" height="12" rx="2" fill="#d6d3d1" stroke="#78716c" strokeWidth="1.4" />
          </g>

          {/* Deretan Gerbang Torii (Senbon Torii) & Jembatan Lengkung Merah di Latar Kanan */}
          <g transform="translate(835, 92)">
            <g transform="translate(52, 8) scale(0.78)" opacity="0.8">
              <rect x="18" y="28" width="10" height="95" fill="#be123c" />
              <rect x="76" y="28" width="10" height="95" fill="#be123c" />
              <rect x="6" y="44" width="92" height="8" fill="#e11d48" />
              <path d="M-2 20 Q52 32 106 20 L100 30 Q52 38 4 30 Z" fill="#292524" />
            </g>
            <g transform="translate(12, 22)">
              <rect x="20" y="30" width="11" height="102" rx="2" fill="#be123c" stroke="#881337" strokeWidth="1.4" />
              <rect x="83" y="30" width="11" height="102" rx="2" fill="#be123c" stroke="#881337" strokeWidth="1.4" />
              <rect x="17" y="120" width="17" height="12" rx="2" fill="#292524" />
              <rect x="80" y="120" width="17" height="12" rx="2" fill="#292524" />
              <rect x="8" y="48" width="98" height="9" rx="2" fill="#e11d48" stroke="#881337" strokeWidth="1.4" />
              <rect x="47" y="32" width="20" height="22" rx="2" fill="#292524" stroke="#fbbf24" strokeWidth="1.5" />
              <text x="57" y="47" textAnchor="middle" fill="#fbbf24" fontSize="8.5" fontWeight="900" fontFamily="serif">
                桜宮
              </text>
              <path d="M0 24 Q57 36 114 24 L108 34 Q57 42 6 34 Z" fill="#be123c" stroke="#881337" strokeWidth="1.4" />
              <path d="M-4 18 Q57 30 118 18 L114 26 Q57 36 0 26 Z" fill="#292524" />
            </g>
            <g transform="translate(105, 108)">
              <path d="M0 36 Q48 -6 96 36" stroke="#be123c" strokeWidth="10" strokeLinecap="round" fill="none" />
              <path d="M4 24 Q48 -18 92 24" stroke="#fbbf24" strokeWidth="3" strokeLinecap="round" fill="none" />
            </g>
          </g>

          <defs>
            <radialGradient id="bgHeroSunGrad" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(600 145) rotate(90) scale(105)">
              <stop offset="0%" stopColor="#fda4af" stopOpacity="0.55" />
              <stop offset="70%" stopColor="#fde68a" stopOpacity="0.22" />
              <stop offset="100%" stopColor="#fffdfa" stopOpacity="0" />
            </radialGradient>
          </defs>
        </svg>
      </div>

      {/* 4. SILUET GUNUNG FUJI, AWAN EMAS (KASUMI) & PAGODA DI BAWAH LATAR */}
      <div className="fixed inset-x-0 bottom-0 z-0 flex justify-center items-end opacity-35 pointer-events-none overflow-hidden">
        <svg
          className="w-full max-w-6xl h-64 sm:h-80"
          viewBox="0 0 1200 320"
          preserveAspectRatio="xMidYBottom slice"
          fill="none"
        >
          {/* Matahari Terbit Merah Muda Hangat */}
          <circle cx="600" cy="210" r="125" fill="url(#shrineSunGrad)" />

          {/* Gunung Fuji Bersalju di Kejauhan */}
          <path
            d="M330 320 Q495 230 555 125 L645 125 Q705 230 870 320 Z"
            fill="#e2cbd3"
            fillOpacity="0.65"
          />
          <path
            d="M555 125 L645 125 L666 168 L638 156 L618 175 L600 154 L582 175 L562 156 L534 168 Z"
            fill="#fffdfa"
            fillOpacity="0.9"
          />

          {/* Siluet Pagoda Kuil Lima Tingkat (Goju-no-to) di Sisi Kiri Jauh */}
          <g transform="translate(270, 145)" fill="#9f1239" fillOpacity="0.22">
            <rect x="28" y="0" width="4" height="22" />
            <polygon points="10,28 50,28 38,20 22,20" />
            <rect x="20" y="28" width="20" height="12" />
            <polygon points="6,46 54,46 42,38 18,38" />
            <rect x="18" y="46" width="24" height="14" />
            <polygon points="2,66 58,66 44,58 16,58" />
            <rect x="16" y="66" width="28" height="16" />
            <polygon points="-2,88 62,88 46,78 14,78" />
            <rect x="14" y="88" width="32" height="87" />
          </g>

          {/* Awan Tradisional Jepang (Wagara Kasumi) */}
          <g fill="#f5d0fe" fillOpacity="0.35">
            <rect x="120" y="190" width="160" height="18" rx="9" />
            <rect x="160" y="202" width="140" height="16" rx="8" />
            <rect x="890" y="180" width="170" height="18" rx="9" />
            <rect x="850" y="194" width="140" height="16" rx="8" />
          </g>

          <defs>
            <radialGradient id="shrineSunGrad" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(600 210) rotate(90) scale(125)">
              <stop offset="0%" stopColor="#fda4af" stopOpacity="0.65" />
              <stop offset="70%" stopColor="#fecdd3" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#fffdfa" stopOpacity="0" />
            </radialGradient>
          </defs>
        </svg>
      </div>

      {/* 5. POHON SAKURA MENGGEMASKAN DI SISI KIRI (BACKGROUND DENGAN GERBANG KUIL TORII, LENTERA BATU & BURUNG SHIMA ENAGA) */}
      <div className="fixed bottom-0 -left-10 sm:left-0 z-0 w-64 sm:w-80 md:w-96 lg:w-[430px] opacity-90 pointer-events-none">
        <svg viewBox="0 0 420 520" className="w-full h-auto overflow-visible animate-sakura-tree-left">
          {/* Bukit Rumput Taman Kuil */}
          <path
            d="M-30 520 Q120 455 295 520 Z"
            fill="#fce7f3"
            stroke="#f9a8d4"
            strokeWidth="2"
          />
          <path
            d="M-30 520 Q95 470 250 520 Z"
            fill="#fbcfe8"
            fillOpacity="0.65"
          />

          {/* Gerbang Kuil Jepang Vermilion (Torii 鳥居) di Bawah Pohon Sakura Kiri */}
          <g transform="translate(155, 362)">
            {/* Bayangan Dasar */}
            <ellipse cx="56" cy="145" rx="52" ry="7" fill="#881337" fillOpacity="0.12" />
            {/* Tiang Kiri & Kanan (Hashira) */}
            <rect x="20" y="34" width="11" height="110" rx="2" fill="#be123c" stroke="#881337" strokeWidth="1.5" />
            <rect x="81" y="34" width="11" height="110" rx="2" fill="#be123c" stroke="#881337" strokeWidth="1.5" />
            {/* Sepatu Dasar Tiang Hitam (Kamebara) */}
            <rect x="17" y="132" width="17" height="14" rx="2" fill="#292524" />
            <rect x="78" y="132" width="17" height="14" rx="2" fill="#292524" />
            {/* Palang Kedua (Nuki) */}
            <rect x="8" y="54" width="96" height="9" rx="2" fill="#e11d48" stroke="#881337" strokeWidth="1.5" />
            {/* Plakat Emas Kuil (Gakuzuka) */}
            <rect x="46" y="36" width="20" height="24" rx="2" fill="#292524" stroke="#f59e0b" strokeWidth="1.8" />
            <text x="56" y="52" textAnchor="middle" fill="#fbbf24" fontSize="9" fontWeight="900" fontFamily="serif">
              神社
            </text>
            {/* Atap Melengkung Atas (Kasagi & Shimaki) */}
            <path
              d="M0 26 Q56 38 112 26 L106 37 Q56 45 6 37 Z"
              fill="#be123c"
              stroke="#881337"
              strokeWidth="1.5"
            />
            <path
              d="M-4 20 Q56 33 116 20 L112 28 Q56 38 0 28 Z"
              fill="#292524"
            />
            {/* Tali Suci Shimenawa Kecil & Pita Kertas Shide di Gerbang Torii */}
            <path d="M28 65 Q56 73 84 65" stroke="#d97706" strokeWidth="3" strokeLinecap="round" fill="none" />
            <polygon points="40,68 37,76 42,76 39,84 44,75 40,75" fill="#fffdfa" stroke="#d6d3d1" strokeWidth="0.6" />
            <polygon points="56,70 53,78 58,78 55,86 60,77 56,77" fill="#fffdfa" stroke="#d6d3d1" strokeWidth="0.6" />
            <polygon points="72,68 69,76 74,76 71,84 76,75 72,75" fill="#fffdfa" stroke="#d6d3d1" strokeWidth="0.6" />
          </g>

          {/* Lentera Batu Taman Kuil (Ishi-dourou 石灯籠) Berpendar Hangat */}
          <g transform="translate(105, 418)">
            <ellipse cx="22" cy="88" rx="20" ry="5" fill="#881337" fillOpacity="0.14" />
            <rect x="8" y="78" width="28" height="9" rx="3" fill="#a8a29e" stroke="#78716c" strokeWidth="1.4" />
            <rect x="15" y="46" width="14" height="33" rx="2" fill="#d6d3d1" stroke="#78716c" strokeWidth="1.4" />
            <rect x="10" y="41" width="24" height="6" rx="2" fill="#a8a29e" stroke="#78716c" strokeWidth="1.4" />
            {/* Ruang Api Lentera */}
            <rect x="13" y="25" width="18" height="16" rx="2" fill="#fef3c7" stroke="#78716c" strokeWidth="1.4" />
            <circle cx="22" cy="33" r="5.5" fill="#f59e0b" className="animate-pulse" />
            {/* Atap Payung Batu (Kasa) */}
            <path d="M2 26 Q22 10 42 26 Z" fill="#78716c" stroke="#57534e" strokeWidth="1.4" />
            <circle cx="22" cy="14" r="3.5" fill="#a8a29e" stroke="#57534e" strokeWidth="1.2" />
          </g>

          {/* Batang & Dahan Pohon Sakura Menggemaskan */}
          <path
            d="M28 515 C38 430 48 360 44 275 C40 215 18 175 -5 140 M44 310 C82 275 135 245 190 225 M42 255 C75 205 118 165 168 145 M36 225 C18 180 5 135 -10 95"
            stroke="#6d4c41"
            strokeWidth="22"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d="M32 515 C42 430 50 360 46 275 M46 308 C84 275 132 248 185 228"
            stroke="#8d6e63"
            strokeWidth="8"
            strokeLinecap="round"
            fill="none"
          />

          {/* Papan Kayu Harapan Kuil (Ema 絵馬) Menggantung di Dahan Sakura */}
          <g transform="translate(142, 232)">
            <g className="animate-shrine-shide">
              <line x1="20" y1="0" x2="20" y2="16" stroke="#e11d48" strokeWidth="2" />
              <polygon
                points="20,12 38,22 35,48 5,48 2,22"
                fill="#fde68a"
                stroke="#b45309"
                strokeWidth="1.6"
              />
              <path d="M2 22 L20 12 L38 22" stroke="#78350f" strokeWidth="2.5" fill="none" />
              <text x="20" y="34" textAnchor="middle" fill="#881337" fontSize="8" fontWeight="900">
                合格
              </text>
              <text x="20" y="43" textAnchor="middle" fill="#92400e" fontSize="6.5" fontWeight="800">
                JLPT
              </text>
            </g>
          </g>

          {/* Tajuk Awan Bunga Sakura Rimbun Menggemaskan (Kiri) */}
          <g className="animate-sakura-canopy">
            <circle cx="35" cy="165" r="78" fill="#fbcfe8" />
            <circle cx="115" cy="185" r="72" fill="#f9a8d4" fillOpacity="0.88" />
            <circle cx="175" cy="215" r="56" fill="#fce7f3" stroke="#f9a8d4" strokeWidth="2" />
            <circle cx="88" cy="122" r="68" fill="#ffe4e6" stroke="#fbcfe8" strokeWidth="2" />
            <circle cx="152" cy="148" r="58" fill="#fbcfe8" />
            <circle cx="25" cy="98" r="62" fill="#fce7f3" />
            <circle cx="72" cy="195" r="55" fill="#ffe4e6" />

            {/* Kuntum-Kuntum Bunga Sakura Mekar Berdenyut */}
            <CuteSakuraFlowerSVG x={42} y={135} scale={0.95} delay="0s" />
            <CuteSakuraFlowerSVG x={102} y={108} scale={0.8} delay="0.6s" />
            <CuteSakuraFlowerSVG x={148} y={152} scale={1.05} delay="1.2s" />
            <CuteSakuraFlowerSVG x={82} y={182} scale={0.85} delay="1.8s" />
            <CuteSakuraFlowerSVG x={182} y={208} scale={0.9} delay="0.4s" />
            <CuteSakuraFlowerSVG x={28} y={198} scale={0.75} delay="1.5s" />
            <CuteSakuraFlowerSVG x={126} y={212} scale={0.7} delay="2.1s" />

            {/* Wajah Pohon Sakura Kawaii Halus di Kubah Bunga */}
            <g transform="translate(88, 152)">
              <circle cx="-14" cy="0" r="3.2" fill="#881337" />
              <circle cx="14" cy="0" r="3.2" fill="#881337" />
              <circle cx="-15" cy="-1" r="1.1" fill="#ffffff" />
              <circle cx="13" cy="-1" r="1.1" fill="#ffffff" />
              <ellipse cx="-22" cy="5" rx="5.5" ry="3" fill="#fb7185" fillOpacity="0.55" />
              <ellipse cx="22" cy="5" rx="5.5" ry="3" fill="#fb7185" fillOpacity="0.55" />
              <path d="M-5 5 Q0 10 5 5" stroke="#881337" strokeWidth="2" strokeLinecap="round" fill="none" />
            </g>
          </g>

          {/* Burung Pipit Salju Jepang Menggemaskan (Shima Enaga シマエナガ) di Dahan */}
          <g transform="translate(115, 240)">
            <g className="animate-cute-bird">
              {/* Ekor Kecil */}
              <path d="M-12 -6 L-24 -16 L-19 -4 Z" fill="#57534e" />
              {/* Badan Bulat Putih Menggemaskan */}
              <ellipse cx="0" cy="-10" rx="14" ry="12.5" fill="#fffdfa" stroke="#e7e5e4" strokeWidth="1.5" />
              {/* Sayap Kecil */}
              <ellipse cx="-5" cy="-9" rx="6" ry="4" fill="#78716c" transform="rotate(-15 -5 -9)" />
              {/* Mata & Pipi Merah Muda */}
              <circle cx="-4" cy="-13" r="1.8" fill="#1c1917" />
              <circle cx="5" cy="-13" r="1.8" fill="#1c1917" />
              <ellipse cx="-7" cy="-10" rx="2.8" ry="1.6" fill="#fda4af" />
              <ellipse cx="8" cy="-10" rx="2.8" ry="1.6" fill="#fda4af" />
              {/* Paruh Kecil */}
              <polygon points="-1,-11 3,-11 1,-8" fill="#f59e0b" />
              {/* Bunga Sakura Kecil di Atas Kepala Burung */}
              <CuteSakuraFlowerSVG x={1} y={-24} scale={0.32} delay="0.3s" />
            </g>
          </g>
        </svg>
      </div>

      {/* 6. POHON SAKURA MENGGEMASKAN DI SISI KANAN (BACKGROUND DENGAN LENTERA KUIL & KELINCI SAKURA IMUT) */}
      <div className="fixed bottom-0 -right-10 sm:right-0 z-0 w-64 sm:w-80 md:w-96 lg:w-[430px] opacity-90 pointer-events-none">
        <svg viewBox="0 0 420 520" className="w-full h-auto overflow-visible animate-sakura-tree-right">
          {/* Bukit Rumput Taman Kuil Kanan */}
          <path
            d="M450 520 Q300 455 125 520 Z"
            fill="#fce7f3"
            stroke="#f9a8d4"
            strokeWidth="2"
          />
          <path
            d="M450 520 Q325 470 170 520 Z"
            fill="#fbcfe8"
            fillOpacity="0.65"
          />

          {/* Pagar Bambu Kuil Merah & Emas (Tamagaki) */}
          <g transform="translate(185, 442)">
            <rect x="0" y="20" width="125" height="7" rx="3" fill="#be123c" />
            <rect x="0" y="44" width="125" height="7" rx="3" fill="#be123c" />
            {[8, 36, 64, 92, 116].map(px => (
              <g key={px}>
                <rect x={px} y="6" width="9" height="62" rx="2" fill="#e11d48" stroke="#881337" strokeWidth="1.2" />
                <rect x={px - 1} y="3" width="11" height="5" rx="1.5" fill="#fbbf24" />
              </g>
            ))}
          </g>

          {/* Batang & Dahan Pohon Sakura Kanan */}
          <path
            d="M392 515 C382 430 372 360 376 275 C380 215 402 175 425 140 M376 310 C338 275 285 245 230 225 M378 255 C345 205 302 165 252 145 M384 225 C402 180 415 135 430 95"
            stroke="#6d4c41"
            strokeWidth="22"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d="M388 515 C378 430 370 360 374 275 M374 308 C336 275 288 248 235 228"
            stroke="#8d6e63"
            strokeWidth="8"
            strokeLinecap="round"
            fill="none"
          />

          {/* Omamori (Jimat Keberuntungan Belajar Kuil Jepang お守り) Menggantung di Dahan Kanan */}
          <g transform="translate(244, 232)">
            <g className="animate-shrine-shide" style={{ animationDelay: '0.9s' }}>
              <line x1="16" y1="0" x2="16" y2="14" stroke="#f59e0b" strokeWidth="2" />
              <polygon
                points="16,12 29,20 29,50 3,50 3,20"
                fill="#be123c"
                stroke="#fbbf24"
                strokeWidth="1.8"
              />
              <rect x="8" y="23" width="16" height="22" rx="1.5" fill="#fffbeb" stroke="#f59e0b" strokeWidth="1" />
              <text x="16" y="33" textAnchor="middle" fill="#881337" fontSize="7.5" fontWeight="900">
                必勝
              </text>
              <text x="16" y="42" textAnchor="middle" fill="#b45309" fontSize="6" fontWeight="800">
                お守り
              </text>
            </g>
          </g>

          {/* Tajuk Awan Bunga Sakura Rimbun Menggemaskan (Kanan) */}
          <g className="animate-sakura-canopy" style={{ animationDelay: '1.2s' }}>
            <circle cx="385" cy="165" r="78" fill="#fbcfe8" />
            <circle cx="305" cy="185" r="72" fill="#f9a8d4" fillOpacity="0.88" />
            <circle cx="245" cy="215" r="56" fill="#fce7f3" stroke="#f9a8d4" strokeWidth="2" />
            <circle cx="332" cy="122" r="68" fill="#ffe4e6" stroke="#fbcfe8" strokeWidth="2" />
            <circle cx="268" cy="148" r="58" fill="#fbcfe8" />
            <circle cx="395" cy="98" r="62" fill="#fce7f3" />
            <circle cx="348" cy="195" r="55" fill="#ffe4e6" />

            {/* Kuntum-Kuntum Bunga Sakura Mekar Berdenyut */}
            <CuteSakuraFlowerSVG x={378} y={135} scale={0.95} delay="0.3s" />
            <CuteSakuraFlowerSVG x={318} y={108} scale={0.8} delay="0.9s" />
            <CuteSakuraFlowerSVG x={272} y={152} scale={1.05} delay="1.6s" />
            <CuteSakuraFlowerSVG x={338} y={182} scale={0.85} delay="0.2s" />
            <CuteSakuraFlowerSVG x={238} y={208} scale={0.9} delay="1.1s" />
            <CuteSakuraFlowerSVG x={392} y={198} scale={0.75} delay="1.9s" />
            <CuteSakuraFlowerSVG x={294} y={212} scale={0.7} delay="0.7s" />

            {/* Wajah Pohon Sakura Kawaii di Kubah Bunga Kanan */}
            <g transform="translate(332, 152)">
              <path d="M-18 0 Q-14 -5 -10 0" stroke="#881337" strokeWidth="2.2" strokeLinecap="round" fill="none" />
              <path d="M10 0 Q14 -5 18 0" stroke="#881337" strokeWidth="2.2" strokeLinecap="round" fill="none" />
              <ellipse cx="-22" cy="5" rx="5.5" ry="3" fill="#fb7185" fillOpacity="0.55" />
              <ellipse cx="22" cy="5" rx="5.5" ry="3" fill="#fb7185" fillOpacity="0.55" />
              <path d="M-5 5 Q0 10 5 5" stroke="#881337" strokeWidth="2" strokeLinecap="round" fill="none" />
            </g>
          </g>

          {/* Kelinci Putih Kuil (Usagi うさぎ) Menggemaskan di Bawah Pohon Sakura Kanan */}
          <g transform="translate(275, 488)">
            <g className="animate-cute-bird" style={{ animationDelay: '1.5s' }}>
              <ellipse cx="0" cy="4" rx="18" ry="4" fill="#881337" fillOpacity="0.12" />
              {/* Telinga Kelinci */}
              <ellipse cx="-6" cy="-26" rx="4" ry="11" fill="#fffdfa" stroke="#f9a8d4" strokeWidth="1.4" transform="rotate(-12 -6 -26)" />
              <ellipse cx="-6" cy="-26" rx="2" ry="7" fill="#fbcfe8" transform="rotate(-12 -6 -26)" />
              <ellipse cx="6" cy="-26" rx="4" ry="11" fill="#fffdfa" stroke="#f9a8d4" strokeWidth="1.4" transform="rotate(12 6 -26)" />
              <ellipse cx="6" cy="-26" rx="2" ry="7" fill="#fbcfe8" transform="rotate(12 6 -26)" />
              {/* Badan & Kepala Bulat */}
              <ellipse cx="0" cy="-10" rx="15" ry="13" fill="#fffdfa" stroke="#f9a8d4" strokeWidth="1.5" />
              {/* Mata & Pipi */}
              <circle cx="-5" cy="-12" r="1.8" fill="#881337" />
              <circle cx="5" cy="-12" r="1.8" fill="#881337" />
              <ellipse cx="-8" cy="-9" rx="2.8" ry="1.5" fill="#fda4af" />
              <ellipse cx="8" cy="-9" rx="2.8" ry="1.5" fill="#fda4af" />
              <path d="M-2 -8 Q0 -6 2 -8" stroke="#e11d48" strokeWidth="1.4" strokeLinecap="round" fill="none" />
              {/* Bunga Sakura di Telinga */}
              <CuteSakuraFlowerSVG x={9} y={-20} scale={0.35} delay="0.8s" />
            </g>
          </g>
        </svg>
      </div>
    </div>
  );
};

