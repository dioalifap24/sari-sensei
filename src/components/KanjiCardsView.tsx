import React, { useState, useEffect, useMemo } from 'react';
import { JLPTLevel } from '../types';
import { KANJI_SENSEI_SARI, SenseiSariKanji } from '../data/kanjiSenseiSari';
import { storageService } from '../services/storageService';
import { 
  ChevronLeft, 
  ChevronRight, 
  Volume2, 
  RotateCw,
  Flame,
  Zap,
  Sparkles,
  CheckCircle2
} from 'lucide-react';

interface KanjiCardsViewProps {
  activeLevel: JLPTLevel;
  setActiveLevel: (lvl: JLPTLevel) => void;
}

// Kata-kata Penggugah Semangat Membara (Japanese Fighting Spirit)
const SPIRIT_QUOTES = [
  { kanji: '情熱を燃やせ！', romaji: 'Netsui o Moyase!', arti: 'Kobarkan Semangat Belajarmu!' },
  { kanji: '七転び八起き', romaji: 'Nanakorobi Yaoki', arti: 'Jatuh 7 Kali, Bangkit 8 Kali!' },
  { kanji: '不撓不屈の闘志', romaji: 'Futou Fukutsu no Toushi', arti: 'Tekad Baja Pantang Mundur!' },
  { kanji: '一歩一歩前進', romaji: 'Ippo Ippo Zenshin', arti: 'Setiap Kanji Membawamu Lolos JLPT!' },
  { kanji: '百錬成鋼', romaji: 'Hyakuren Seikou', arti: 'Latihan Keras Menempa Dirimu Menjadi Juara!' }
];

export const KanjiCardsView: React.FC<KanjiCardsViewProps> = ({ activeLevel, setActiveLevel }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [fireMode, setFireMode] = useState(true);
  const [memorizedIds, setMemorizedIds] = useState<number[]>(() => storageService.getMemorizedKanji());

  useEffect(() => {
    const refreshLearned = () => {
      setMemorizedIds(storageService.getMemorizedKanji());
    };
    window.addEventListener('study_progress_updated', refreshLearned);
    window.addEventListener('storage', refreshLearned);
    return () => {
      window.removeEventListener('study_progress_updated', refreshLearned);
      window.removeEventListener('storage', refreshLearned);
    };
  }, []);

  // Sesuai aturan:
  // Pilih N5 → tampil nomor 1–100 saja (Total: 100 Kanji)
  // Pilih N4 → nomor 101–250 (Total: 150 Kanji)
  // Pilih N3 → nomor 251–550 (Total: 300 Kanji)
  // Pilih N2 → nomor 551–900 (Total: 350 Kanji)
  const levelDeck: SenseiSariKanji[] = useMemo(() => {
    return KANJI_SENSEI_SARI.filter(k => k.level === activeLevel);
  }, [activeLevel]);

  // Deck terfilter pencarian
  const deck: SenseiSariKanji[] = useMemo(() => {
    if (!searchQuery.trim()) return levelDeck;
    const q = searchQuery.toLowerCase().trim();
    return levelDeck.filter(k => 
      k.kanji.toLowerCase().includes(q) ||
      k.bacaanOn.toLowerCase().includes(q) ||
      k.bacaanKun.toLowerCase().includes(q) ||
      k.ejaan.toLowerCase().includes(q) ||
      k.arti.toLowerCase().includes(q) ||
      k.contoh.toLowerCase().includes(q) ||
      k.id.toString() === q
    );
  }, [levelDeck, searchQuery]);

  // Otomatis reset ke kartu pertama jika level berganti
  useEffect(() => {
    setCurrentIndex(0);
    setIsFlipped(false);
    setSearchQuery('');
  }, [activeLevel]);

  const currentCard = deck[currentIndex];
  const memorizedSet = useMemo(() => new Set(memorizedIds), [memorizedIds]);
  const learnedInLevelCount = useMemo(
    () => levelDeck.filter((k) => memorizedSet.has(k.id)).length,
    [levelDeck, memorizedSet]
  );
  const levelProgressPercent =
    levelDeck.length > 0 ? Math.min(100, Math.round((learnedInLevelCount / levelDeck.length) * 100)) : 0;
  const isCurrentCardLearned = currentCard ? memorizedSet.has(currentCard.id) : false;

  const handleFlipCard = () => {
    const nextFlipped = !isFlipped;
    setIsFlipped(nextFlipped);
    if (nextFlipped && currentCard) {
      storageService.markKanjiLearned(currentCard.id);
      setMemorizedIds(storageService.getMemorizedKanji());
    }
  };

  const handleToggleLearned = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!currentCard) return;
    storageService.toggleMemorizedKanji(currentCard.id);
    setMemorizedIds(storageService.getMemorizedKanji());
  };

  // Motivasi dinamis berganti setiap beberapa kartu
  const currentQuote = useMemo(() => {
    return SPIRIT_QUOTES[currentIndex % SPIRIT_QUOTES.length];
  }, [currentIndex]);

  const handleNext = () => {
    if (deck.length === 0) return;
    if (currentIndex < deck.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      setCurrentIndex(0);
    }
    setIsFlipped(false);
  };

  const handlePrev = () => {
    if (deck.length === 0) return;
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    } else {
      setCurrentIndex(deck.length - 1);
    }
    setIsFlipped(false);
  };

  // Pelafalan Audio
  const speakJapanese = (text: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!('speechSynthesis' in window)) return;

    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'ja-JP';
      utterance.rate = 0.85;

      const voices = window.speechSynthesis.getVoices();
      const jaVoice = voices.find(v => v.lang.startsWith('ja'));
      if (jaVoice) utterance.voice = jaVoice;

      setSpeaking(true);
      utterance.onend = () => setSpeaking(false);
      utterance.onerror = () => setSpeaking(false);

      window.speechSynthesis.speak(utterance);
    } catch (err) {
      console.error(err);
      setSpeaking(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 sm:py-8 space-y-5">
      {/* 🎨 JUDUL ATAS DENGAN ANIMASI API MEMBARA */}
      <div className="text-center space-y-2">
        {/* Lencana Berapi-api •900 KANJI RESMI JLPT• */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-black shadow-lg tracking-wider text-white bg-gradient-to-r from-red-600 via-orange-500 to-amber-500 border border-orange-300">
          <Flame className="w-4 h-4 fire-flame-icon text-yellow-200 fill-yellow-400" />
          <span className="drop-shadow-xs">•900 KANJI RESMI JLPT•</span>
          <Flame className="w-4 h-4 fire-flame-icon text-yellow-200 fill-yellow-400" />
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#881337] font-japanese tracking-wide flex items-center justify-center gap-2">
          <span>漢字</span>
          <span>KARTU HAFALAN KANJI</span>
        </h1>

        {/* 🌟 BANNER PENGGUGAH SEMANGAT BER-API-API */}
        <div className="relative overflow-hidden bg-gradient-to-r from-amber-50 via-orange-50 to-red-50 border border-orange-200 rounded-2xl p-2.5 shadow-xs max-w-lg mx-auto">
          {/* Efek percikan api kecil melayang */}
          <div className="flex items-center justify-center gap-2 text-xs font-bold text-red-700">
            <span className="text-base animate-pulse">🔥</span>
            <span className="font-japanese text-sm text-red-800">{currentQuote.kanji}</span>
            <span className="text-[#8c6b4b] hidden sm:inline">({currentQuote.romaji})</span>
            <span className="text-xs text-orange-600 font-semibold">— {currentQuote.arti}</span>
            <span className="text-base animate-pulse">🔥</span>
          </div>
        </div>
      </div>

      {/* 🎨 PILIHAN LEVEL DI ATAS: ⦿ N5 ∘ N4 ∘ N3 ∘ N2 */}
      <div className="bg-[#fffdfa] border-2 border-[#fbcfe8] rounded-2xl p-2.5 shadow-xs">
        <div className="flex items-center justify-center gap-2 sm:gap-3">
          {(['N5', 'N4', 'N3', 'N2'] as JLPTLevel[]).map((lvl) => {
            const isSelected = activeLevel === lvl;
            const ranges: Record<JLPTLevel, string> = {
              N5: '1–100',
              N4: '101–250',
              N3: '251–550',
              N2: '551–900'
            };
            return (
              <button
                key={lvl}
                onClick={() => setActiveLevel(lvl)}
                className={`flex-1 py-2 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-1.5 shadow-2xs ${
                  isSelected
                    ? 'bg-[#881337] text-white shadow-md scale-105 ring-2 ring-orange-400'
                    : 'bg-white text-[#624734] border border-[#ebdccb] hover:border-[#881337] hover:bg-[#fff9f3]'
                }`}
              >
                <span>{isSelected ? '⦿' : '∘'}</span>
                <span>{lvl}</span>
                <span className="text-[10px] opacity-80 hidden sm:inline">
                  (No. {ranges[lvl]})
                </span>
              </button>
            );
          })}
        </div>

        {/* Live Progress Bar for Selected Kanji Level */}
        <div className="mt-3 pt-2.5 border-t border-[#f5d0dc]">
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="font-semibold text-[#5e4735]">
              Kemajuan Kanji Level {activeLevel}:
            </span>
            <span className="font-mono tabular-nums font-bold text-[#881337]">
              {learnedInLevelCount} / {levelDeck.length} Dipelajari ({levelProgressPercent}%)
            </span>
          </div>
          <div className="w-full h-2 bg-[#f3e8da] rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#881337] to-amber-600 rounded-full transition-all duration-300"
              style={{ width: `${Math.max(learnedInLevelCount > 0 ? 2 : 0, levelProgressPercent)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Kontrol Tambahan: Kotak Pencarian & Sakelar Mode Semangat Api */}
      <div className="flex flex-col sm:flex-row items-center gap-2">
        <div className="relative flex-1 w-full">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentIndex(0);
              setIsFlipped(false);
            }}
            placeholder={`Cari kanji di Level ${activeLevel} (contoh: 一, ichi, satu, 1)...`}
            className="w-full px-4 py-2 bg-white border border-[#dec7b0] focus:border-[#881337] rounded-xl text-xs sm:text-sm text-[#3d2a1b] placeholder:text-[#a88a70] outline-hidden shadow-2xs"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#a88a70] hover:text-[#881337]"
            >
              Hapus
            </button>
          )}
        </div>

        {/* Tombol Kobarkan Api Semangat */}
        <button
          onClick={() => setFireMode(!fireMode)}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
            fireMode
              ? 'bg-gradient-to-r from-red-600 to-orange-500 text-white shadow-md'
              : 'bg-white text-[#8c6b4b] border border-[#ebdccb]'
          }`}
          title="Nyalakan/matikan aura api semangat"
        >
          <Flame className={`w-3.5 h-3.5 ${fireMode ? 'fire-flame-icon text-yellow-300 fill-yellow-400' : ''}`} />
          <span>{fireMode ? 'Aura Api: Aktif' : 'Aura Api: Mati'}</span>
        </button>
      </div>

      {/* 🎨 1 KARTU BESAR DI TENGAH LAYAR */}
      {/* Latar krem: #fffdfa, Pinggir merah muda: #fbcfe8, Sudut membulat: rounded-3xl + Aura Api */}
      {currentCard ? (
        <div
          onClick={handleFlipCard}
          className={`relative w-full min-h-[380px] sm:min-h-[420px] bg-[#fffdfa] border-4 rounded-3xl p-6 sm:p-8 flex flex-col justify-between shadow-lg cursor-pointer select-none transition-all duration-300 transform hover:-translate-y-1 ${
            fireMode ? 'fire-card-glow' : 'border-[#fbcfe8] hover:border-[#881337]'
          } ${
            isFlipped
              ? 'bg-gradient-to-b from-[#fffcf9] to-[#fff6f8]'
              : 'hover:shadow-2xl'
          }`}
        >
          {/* Percikan Api Bergerak (Animated Flame Embers di pojok kartu) */}
          {fireMode && (
            <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-3xl">
              <span 
                className="absolute bottom-3 left-6 text-sm opacity-80"
                style={{ animation: 'emberFloat 2.4s infinite ease-out', ['--ember-tx' as any]: '-12px' }}
              >
                🔥
              </span>
              <span 
                className="absolute bottom-5 right-8 text-xs opacity-75"
                style={{ animation: 'emberFloat 1.9s infinite 0.7s ease-out', ['--ember-tx' as any]: '18px' }}
              >
                ✨
              </span>
              <span 
                className="absolute bottom-8 left-1/3 text-xs opacity-70"
                style={{ animation: 'emberFloat 2.1s infinite 1.2s ease-out', ['--ember-tx' as any]: '-8px' }}
              >
                ⚡
              </span>
              <span 
                className="absolute bottom-4 right-1/4 text-sm opacity-80"
                style={{ animation: 'emberFloat 2.5s infinite 0.3s ease-out', ['--ember-tx' as any]: '14px' }}
              >
                🔥
              </span>
            </div>
          )}

          {/* Header Kartu: Level Badge & Indikator */}
          <div className="flex items-center justify-between w-full relative z-10">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-gradient-to-r from-[#881337] to-[#b91c1c] text-white rounded-xl text-xs font-bold shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
              <span>JLPT {currentCard.level} · No. {currentCard.id}</span>
            </span>
            <div className="flex items-center gap-1.5 text-xs text-[#8c6b4b] font-semibold bg-white/90 px-2.5 py-1 rounded-full border border-[#f5d0dc]">
              <RotateCw className="w-3.5 h-3.5 text-[#881337]" />
              <span>{isFlipped ? 'Sisi Balik' : 'Sisi Depan'}</span>
            </div>
          </div>

          {/* ━━━━━━━━ DEPAN: KANJI BESAR BER-API ━━━━━━━━ */}
          {!isFlipped ? (
            <div className="text-center my-auto py-10 space-y-4 relative z-10">
              <div 
                className={`text-7xl sm:text-8xl md:text-9xl font-extrabold text-[#881337] font-japanese tracking-wide leading-none transition-transform duration-300 ${
                  fireMode ? 'drop-shadow-[0_6px_18px_rgba(234,88,12,0.45)] scale-102' : 'drop-shadow-xs'
                }`}
              >
                {currentCard.kanji}
              </div>
              <p className="text-xs text-[#a88a70] italic flex items-center justify-center gap-1.5">
                <span>Klik untuk membalik</span>
                <span className="text-orange-500 font-bold">🔄</span>
              </p>
            </div>
          ) : (
            /* ━━━━━━━━ BALIK: FORMAT SENSEI SARI ━━━━━━━━ */
            <div className="my-auto py-4 space-y-3 animate-in fade-in duration-200 text-left relative z-10">
              {/* Kanji Utama Kecil & Ejaan */}
              <div className="flex items-center justify-between pb-2 border-b border-[#f5d0dc]">
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-extrabold text-[#881337] font-japanese">
                    {currentCard.kanji}
                  </span>
                  <span className="text-xs text-[#8c6b4b] font-mono">
                    #{currentCard.id}
                  </span>
                </div>
                <button
                  onClick={(e) => speakJapanese(currentCard.kanji, e)}
                  className={`p-2 rounded-full transition-all ${
                    speaking
                      ? 'bg-[#881337] text-white animate-pulse'
                      : 'bg-[#faebd7] hover:bg-[#881337] text-[#881337] hover:text-white'
                  }`}
                  title="Dengarkan pengucapan kanji"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
              </div>

              {/* Rincian Sesuai Format Wajib Sensei Sari */}
              <div className="space-y-2 text-xs sm:text-sm text-[#4a3424]">
                <div className="p-2.5 bg-white/95 rounded-xl border border-[#f5d0dc] flex items-start gap-2 shadow-2xs">
                  <span className="font-bold text-[#881337] shrink-0">✏️ Bacaan On:</span>
                  <span className="font-japanese font-bold text-[#3d2a1b] text-sm">
                    {currentCard.bacaanOn}
                  </span>
                </div>

                <div className="p-2.5 bg-white/95 rounded-xl border border-[#f5d0dc] flex items-start gap-2 shadow-2xs">
                  <span className="font-bold text-[#881337] shrink-0">✏️ Bacaan Kun:</span>
                  <span className="font-japanese font-bold text-[#3d2a1b] text-sm">
                    {currentCard.bacaanKun}
                  </span>
                </div>

                <div className="p-2.5 bg-white/95 rounded-xl border border-[#f5d0dc] flex items-start gap-2 shadow-2xs">
                  <span className="font-bold text-[#881337] shrink-0">📝 Ejaan/Romaji:</span>
                  <span className="font-mono text-[#624734] font-semibold">
                    {currentCard.ejaan}
                  </span>
                </div>

                <div className="p-2.5 bg-white/95 rounded-xl border border-[#f5d0dc] flex items-start gap-2 shadow-2xs">
                  <span className="font-bold text-[#881337] shrink-0">🇮🇩 Arti Indonesia:</span>
                  <span className="font-bold text-[#20150e]">
                    {currentCard.arti}
                  </span>
                </div>

                <div className="p-2.5 bg-[#fff8f0] rounded-xl border border-[#ebdccb] flex items-start gap-2">
                  <span className="font-bold text-[#881337] shrink-0">📖 Contoh Kata:</span>
                  <span className="font-medium text-[#4a3424]">
                    {currentCard.contoh}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Footer Kartu: Audio & Semangat */}
          <div className="flex items-center justify-between w-full pt-3 border-t border-[#f5d0dc]/60 relative z-10 gap-2">
            <button
              onClick={(e) => speakJapanese(currentCard.kanji, e)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#faebd7] hover:bg-[#881337] text-[#881337] hover:text-white rounded-xl text-xs font-bold transition-colors"
              title="Dengarkan audio"
            >
              <Volume2 className="w-3.5 h-3.5" />
              <span>Dengar Suara</span>
            </button>

            <button
              onClick={handleToggleLearned}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                isCurrentCardLearned
                  ? 'bg-emerald-600 text-white shadow-2xs'
                  : 'bg-[#f5ede1] hover:bg-[#eadbc8] text-[#5e4735]'
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{isCurrentCardLearned ? 'Sudah Dipelajari' : 'Tandai Dipelajari'}</span>
            </button>

            <span className="text-[11px] text-[#8c6b4b] font-medium hidden sm:flex items-center gap-1">
              <Zap className="w-3 h-3 text-orange-500 fill-orange-500" />
              <span>Klik untuk membalik</span>
            </span>
          </div>
        </div>
      ) : (
        <div className="text-center py-16 bg-white border-2 border-[#fbcfe8] rounded-3xl p-8 shadow-xs">
          <p className="text-sm text-[#735338] mb-3">Tidak ada kanji yang cocok dengan pencarian "{searchQuery}".</p>
          <button
            onClick={() => setSearchQuery('')}
            className="px-4 py-2 bg-[#881337] text-white rounded-xl text-xs font-bold shadow-xs"
          >
            Hapus Pencarian
          </button>
        </div>
      )}

      {/* 🎨 DI BAWAH KARTU: NOMOR URUT / TOTAL, TOMBOL ← SEBELUMNYA | BERIKUTNYA → */}
      <div className="space-y-3">
        <div className="text-center">
          <span className="px-4 py-1.5 bg-[#fffdfa] border border-[#fbcfe8] rounded-full text-xs font-bold text-[#881337] shadow-2xs inline-flex items-center gap-1.5">
            <Flame className="w-3.5 h-3.5 text-orange-500 fill-orange-500" />
            <span>
              {deck.length > 0 
                ? `Kartu ${currentIndex + 1} dari ${deck.length} di Level ${activeLevel}`
                : `0 Kartu di Level ${activeLevel}`}
            </span>
          </span>
        </div>

        {/* Tombol ← Sebelumnya | Berikutnya → (Hanya aktif jika ada kartu) */}
        <div className="flex items-center justify-between gap-3">
          <button
            onClick={handlePrev}
            disabled={deck.length <= 1}
            className="flex-1 flex items-center justify-center gap-2 py-3.5 bg-white hover:bg-[#fff9f3] active:bg-[#faebd7] border-2 border-[#fbcfe8] hover:border-[#881337] rounded-2xl font-bold text-xs sm:text-sm text-[#881337] transition-all shadow-xs disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>← Sebelumnya</span>
          </button>

          <button
            onClick={handleNext}
            disabled={deck.length <= 1}
            className="flex-1 flex items-center justify-center gap-2 py-3.5 bg-gradient-to-r from-[#881337] to-[#b91c1c] hover:from-[#70102d] hover:to-[#991b1b] active:scale-98 text-white rounded-2xl font-bold text-xs sm:text-sm transition-all shadow-md disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <span>Berikutnya →</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
