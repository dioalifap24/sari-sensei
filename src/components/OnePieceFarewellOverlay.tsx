import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';

// Import high-detail manga cross-hatch colored character portraits matching the reference design
import zoroPortraitImg from '../assets/images/zoro_anime_portrait_1791269741307.jpg';
import luffyPortraitImg from '../assets/images/luffy_anime_portrait_1791269755289.jpg';
import shanksPortraitImg from '../assets/images/shanks_anime_portrait_1791269776882.jpg';
import acePortraitImg from '../assets/images/ace_anime_portrait_1791269788642.jpg';
import sanjiPortraitImg from '../assets/images/sanji_anime_portrait_1791269801695.jpg';
import rogerPortraitImg from '../assets/images/roger_anime_portrait_1791269814605.jpg';

export const ONE_PIECE_POSTER_DURATION_SECONDS = 30;
export const ONE_PIECE_POSTER_DURATION_MS = ONE_PIECE_POSTER_DURATION_SECONDS * 1000;

export interface OnePieceFarewellQuote {
  id: string;
  authorTag: string; // e.g., "by.roronoa zoro"
  characterName: string;
  quoteText: string; // Ditampilkan persis di atas kepala karakter seperti contoh
  portraitSrc: string;
}

export const ONE_PIECE_FAREWELL_QUOTES: OnePieceFarewellQuote[] = [
  {
    id: 'zoro-1',
    authorTag: 'by.roronoa zoro',
    characterName: 'Roronoa Zoro',
    quoteText:
      '"aku rela menjadi orang yg terburuk dalam cerita siapapun. tapi setelah itu jangan pernah ganggu aku lagi."',
    portraitSrc: zoroPortraitImg,
  },
  {
    id: 'luffy-1',
    authorTag: 'by.monkey d. luffy',
    characterName: 'Monkey D. Luffy',
    quoteText:
      '"jika kau tidak berani mengambil risiko dalam hidupmu, maka kau tidak akan pernah bisa menciptakan masa depan."',
    portraitSrc: luffyPortraitImg,
  },
  {
    id: 'shanks-1',
    authorTag: 'by.akagami no shanks',
    characterName: 'Akagami no Shanks',
    quoteText:
      '"dengan mengenal kemenangan dan kekalahan, melarikan diri dan meneteskan air mata, barulah seseorang menjadi pria sejati."',
    portraitSrc: shanksPortraitImg,
  },
  {
    id: 'ace-1',
    authorTag: 'by.portgas d. ace',
    characterName: 'Portgas D. Ace',
    quoteText:
      '"kita harus menjalani hidup tanpa ada penyesalan sedikitpun. terima kasih karena telah menyayangiku sampai hari ini."',
    portraitSrc: acePortraitImg,
  },
  {
    id: 'sanji-1',
    authorTag: 'by.vinsmoke sanji',
    characterName: 'Vinsmoke Sanji',
    quoteText:
      '"setiap orang memiliki hal yg bisa dan tidak bisa ia lakukan. aku akan melakukan bagian yg tidak bisa kau lakukan."',
    portraitSrc: sanjiPortraitImg,
  },
  {
    id: 'roger-1',
    authorTag: 'by.gol d. roger',
    characterName: 'Gol D. Roger',
    quoteText:
      '"warisan tekad, impian manusia, dan perputaran zaman. selama manusia masih mencari arti kebebasan, semua itu tidak akan pernah berhenti."',
    portraitSrc: rogerPortraitImg,
  },
  {
    id: 'zoro-2',
    authorTag: 'by.roronoa zoro',
    characterName: 'Roronoa Zoro',
    quoteText:
      '"luka di punggung adalah aib terbesar bagi seorang pendekar pedang. aku tidak akan pernah kalah lagi sampai menjadi yg terkuat."',
    portraitSrc: zoroPortraitImg,
  },
  {
    id: 'luffy-2',
    authorTag: 'by.monkey d. luffy',
    characterName: 'Monkey D. Luffy',
    quoteText:
      '"aku tidak peduli meskipun harus mati saat memperjuangkan mimpiku, setidaknya aku sudah berjuang sekuat tenaga."',
    portraitSrc: luffyPortraitImg,
  },
  {
    id: 'shanks-2',
    authorTag: 'by.akagami no shanks',
    characterName: 'Akagami no Shanks',
    quoteText:
      '"kau boleh menumpahkan minuman atau meludahiku dan aku hanya akan tertawa. tapi jika kau menyakiti sahabatku, aku tidak akan memaafkanmu."',
    portraitSrc: shanksPortraitImg,
  },
  {
    id: 'ace-2',
    authorTag: 'by.portgas d. ace',
    characterName: 'Portgas D. Ace',
    quoteText:
      '"aku tidak akan pernah lari dari pertarungan, karena di belakangku ada orang-orang yg sangat ingin kulindungi."',
    portraitSrc: acePortraitImg,
  },
  {
    id: 'sanji-2',
    authorTag: 'by.vinsmoke sanji',
    characterName: 'Vinsmoke Sanji',
    quoteText:
      '"jangan pernah memulai pertarungan jika kau tidak sanggup menyelesaikannya. terima kasih banyak atas segala bimbinganmu selama ini."',
    portraitSrc: sanjiPortraitImg,
  },
  {
    id: 'roger-2',
    authorTag: 'by.gol d. roger',
    characterName: 'Gol D. Roger',
    quoteText:
      '"harta karunku? jika kalian menginginkannya, ambillah. carilah! aku telah meninggalkan segalanya di lautan itu."',
    portraitSrc: rogerPortraitImg,
  },
];

const COUNTER_STORAGE_KEY = 'sensei_sari_onepiece_quote_counter';
const LAST_QUOTE_ID_KEY = 'sensei_sari_onepiece_last_quote_id';

// Cache gambar di memori agar begitu tombol Logout ditekan, gambar ilustrasi muncul 0ms seketika
const preloadedImagesCache: HTMLImageElement[] = [];
let assetsPreloaded = false;

export function preloadOnePieceFarewellAssets() {
  if (typeof window === 'undefined' || assetsPreloaded) return;
  assetsPreloaded = true;
  const uniqueSrcs = [
    zoroPortraitImg,
    luffyPortraitImg,
    shanksPortraitImg,
    acePortraitImg,
    sanjiPortraitImg,
    rogerPortraitImg,
  ];
  uniqueSrcs.forEach(src => {
    try {
      const img = new Image();
      img.src = src;
      if (typeof img.decode === 'function') {
        img.decode().catch(() => {});
      }
      preloadedImagesCache.push(img);
    } catch {}
  });
}

/**
 * Mengambil kutipan One Piece berikutnya yang DIJAMIN selalu berbeda setiap kali logout,
 * baik untuk akun Master maupun Murid, serta tersinkronisasi lintas perangkat.
 */
export function pickNextUniqueOnePieceQuote(): OnePieceFarewellQuote {
  const total = ONE_PIECE_FAREWELL_QUOTES.length;
  let currentCounter = -1;
  let lastQuoteId = '';

  try {
    const raw = localStorage.getItem(COUNTER_STORAGE_KEY);
    if (raw !== null) {
      currentCounter = parseInt(raw, 10);
      if (Number.isNaN(currentCounter) || currentCounter < 0) currentCounter = -1;
    }
    lastQuoteId = localStorage.getItem(LAST_QUOTE_ID_KEY) || '';
  } catch {
    currentCounter = -1;
  }

  let nextCounter = currentCounter + 1;
  let candidate = ONE_PIECE_FAREWELL_QUOTES[nextCounter % total];

  // Pastikan tidak pernah sama dengan kutipan sebelumnya
  if (candidate.id === lastQuoteId) {
    nextCounter += 1;
    candidate = ONE_PIECE_FAREWELL_QUOTES[nextCounter % total];
  }

  try {
    localStorage.setItem(COUNTER_STORAGE_KEY, String(nextCounter));
    localStorage.setItem(LAST_QUOTE_ID_KEY, candidate.id);
  } catch {}

  // Sinkronkan ke server agar murid berikutnya yang logout mendapat kutipan berbeda
  fetch('/api/onepiece-quote-counter', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ counter: nextCounter }),
  })
    .then(r => (r.ok ? r.json() : null))
    .then(data => {
      if (data && typeof data.counter === 'number' && data.counter > nextCounter) {
        try {
          localStorage.setItem(COUNTER_STORAGE_KEY, String(data.counter));
        } catch {}
      }
    })
    .catch(() => {});

  return candidate;
}

interface OnePieceFarewellOverlayProps {
  quote: OnePieceFarewellQuote | null;
  onDismiss: () => void;
}

export const OnePieceFarewellOverlay: React.FC<OnePieceFarewellOverlayProps> = ({
  quote,
  onDismiss,
}) => {
  const [remainingSeconds, setRemainingSeconds] = useState<number>(
    ONE_PIECE_POSTER_DURATION_SECONDS
  );

  useEffect(() => {
    if (!quote) return;
    setRemainingSeconds(ONE_PIECE_POSTER_DURATION_SECONDS);

    const countdownInterval = window.setInterval(() => {
      setRemainingSeconds(prev => (prev > 1 ? prev - 1 : 0));
    }, 1000);

    return () => {
      window.clearInterval(countdownInterval);
    };
  }, [quote]);

  if (!quote) return null;

  return (
    <div
      onClick={onDismiss}
      className="fixed inset-0 z-50 bg-[#5e7180] flex items-center justify-center overflow-hidden select-none"
    >
      {/* Container Poster Vertikal Persis Seperti Contoh Gambar (Muncul Seketika 0ms Tanpa Sound) */}
      <div
        onClick={e => e.stopPropagation()}
        className="relative w-full h-full max-w-xl mx-auto flex flex-col justify-between overflow-hidden bg-gradient-to-b from-[#6e8190] via-[#798c9b] to-[#50616f] shadow-2xl"
      >
        {/* Gambar Karakter One Piece Full-Bleed (Langsung Muncul Seketika dari Preload Cache) */}
        <img
          src={quote.portraitSrc}
          alt={quote.characterName}
          referrerPolicy="no-referrer"
          decoding="sync"
          loading="eager"
          className="absolute inset-0 w-full h-full object-cover object-bottom pointer-events-none"
        />

        {/* Gradasi Halus Langit Atas agar Teks Kutipan di Atas Kepala Karakter Terbaca Jelas Persis Contoh */}
        <div
          className="absolute inset-x-0 top-0 h-[46%] pointer-events-none"
          style={{
            background:
              'linear-gradient(180deg, rgba(110,129,144,0.92) 0%, rgba(121,140,155,0.78) 62%, rgba(121,140,155,0) 100%)',
          }}
        />

        {/* Efek Bokeh Cahaya Halus di Langit seperti Contoh */}
        <div className="absolute top-[16%] left-[12%] w-12 h-8 rounded-full bg-white/15 blur-md pointer-events-none -rotate-12" />
        <div className="absolute top-[25%] left-[6%] w-14 h-9 rounded-full bg-white/15 blur-md pointer-events-none -rotate-12" />

        {/* Tombol Tutup + Hitungan Mundur 30 Detik di Pojok Kanan Atas */}
        <div className="relative z-20 flex items-center justify-end px-4 pt-4">
          <button
            type="button"
            onClick={onDismiss}
            className="px-3.5 py-1.5 rounded-full bg-black/30 hover:bg-black/50 backdrop-blur-xs text-white text-xs font-bold flex items-center gap-1.5 border border-white/20 transition-all cursor-pointer"
          >
            <span className="font-mono text-amber-200">{remainingSeconds}d</span>
            <span>· Lewati ke Login</span>
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Bagian Teks Kutipan & Nama Karakter Persis di Atas Kepala Karakter (Sesuai Contoh) */}
        <div className="relative z-20 px-6 sm:px-10 pt-4 sm:pt-8 pb-2 text-center flex flex-col items-center">
          <p className="text-white font-bold text-lg sm:text-2xl leading-relaxed tracking-normal max-w-md drop-shadow-[0_2px_8px_rgba(0,0,0,0.45)]">
            {quote.quoteText}
          </p>
          <span className="mt-2 font-serif text-[#1c2329] text-base sm:text-xl font-medium tracking-wide drop-shadow-[0_1px_2px_rgba(255,255,255,0.25)]">
            {quote.authorTag}
          </span>
        </div>

        {/* Spacer Area Karakter */}
        <div className="relative z-20 flex-1 pointer-events-none" />

        {/* Info Hitungan Mundur 30 Detik Sebelum ke Halaman Login di Bagian Bawah */}
        <div className="relative z-20 pb-5 text-center">
          <button
            type="button"
            onClick={onDismiss}
            className="px-5 py-2 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur-xs text-white/95 text-xs font-semibold border border-white/20 transition-all cursor-pointer"
          >
            Menuju Halaman Login dalam {remainingSeconds} detik · Ketuk untuk Lanjut Sekarang
          </button>
        </div>
      </div>
    </div>
  );
};
