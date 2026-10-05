import React, { useState, useEffect, useMemo } from 'react';
import { JLPTLevel, VocabCard } from '../types';
import { VOCAB_MAZII_DICTIONARY } from '../data/vocabData';
import { storageService } from '../services/storageService';
import { 
  ChevronLeft, 
  ChevronRight, 
  Shuffle, 
  Volume2, 
  RotateCcw, 
  BookOpen, 
  Search, 
  X, 
  Target,
  CheckCircle2
} from 'lucide-react';

interface VocabCardsViewProps {
  activeLevel?: string;
  setActiveLevel?: (lvl: any) => void;
}

export const VocabCardsView: React.FC<VocabCardsViewProps> = ({ activeLevel, setActiveLevel }) => {
  const [selectedLevelFilter, setSelectedLevelFilter] = useState<string>(activeLevel || 'all');
  const [deck, setDeck] = useState<VocabCard[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [notificationMsg, setNotificationMsg] = useState<string | null>(null);
  const [memorizedIds, setMemorizedIds] = useState<number[]>(() => storageService.getMemorizedVocab());

  useEffect(() => {
    if (activeLevel) {
      setSelectedLevelFilter(activeLevel);
    }
  }, [activeLevel]);

  useEffect(() => {
    const refreshLearned = () => {
      setMemorizedIds(storageService.getMemorizedVocab());
    };
    window.addEventListener('study_progress_updated', refreshLearned);
    window.addEventListener('storage', refreshLearned);
    return () => {
      window.removeEventListener('study_progress_updated', refreshLearned);
      window.removeEventListener('storage', refreshLearned);
    };
  }, []);

  // Source pool: 4.845 Kosakata Resmi JLPT (N5: 669, N4: 582, N3: 1.802, N2: 1.792)
  const sourcePool: VocabCard[] = VOCAB_MAZII_DICTIONARY;

  // Target count per level
  const targetInfo = useMemo(() => {
    switch (selectedLevelFilter) {
      case 'N5':
        return {
          targetCount: 669,
          label: 'Level N5: 669 Kosakata Resmi jepang.org',
          hours: '~150 jam belajar'
        };
      case 'N4':
        return {
          targetCount: 582,
          label: 'Level N4: 582 Kosakata Resmi jepang.org',
          hours: '~300 jam belajar'
        };
      case 'N3':
        return {
          targetCount: 1802,
          label: 'Level N3: 1.802 Kosakata Resmi jepang.org',
          hours: '~700 jam belajar'
        };
      case 'N2':
        return {
          targetCount: 1792,
          label: 'Level N2: 1.792 Kosakata Resmi jepang.org',
          hours: '~1.000 jam belajar'
        };
      default:
        return {
          targetCount: 4845,
          label: 'Semua Level Terpadu (N5 – N2)',
          hours: '4.845 Kosakata Lengkap Resmi Tanpa Duplikat'
        };
    }
  }, [selectedLevelFilter]);

  // Filter deck based on level and search query
  const filterCards = (lvlFilter: string, query: string, pool: VocabCard[]) => {
    let list = [...pool];

    if (lvlFilter !== 'all') {
      list = list.filter(card => card.level === lvlFilter);
    }
    
    const q = query.trim().toLowerCase();
    if (q) {
      list = list.filter(card => {
        const matchIndo = card.indonesian?.toLowerCase().includes(q);
        const matchJp = card.japanese?.toLowerCase().includes(q);
        const matchKana = card.kana?.toLowerCase().includes(q);
        const matchRomaji = (card.romaji || card.reading)?.toLowerCase().includes(q);
        return matchIndo || matchJp || matchKana || matchRomaji;
      });
    }

    return list;
  };

  // Re-filter whenever level, search query, or pool changes
  useEffect(() => {
    const list = filterCards(selectedLevelFilter, searchQuery, sourcePool);
    setDeck(list);
    setCurrentIndex(0);
    setIsFlipped(false);
  }, [selectedLevelFilter, searchQuery, sourcePool]);

  // Level filter change
  const handleLevelFilterChange = (lvl: string) => {
    setSelectedLevelFilter(lvl);
    if (lvl !== 'all' && setActiveLevel) {
      setActiveLevel(lvl as JLPTLevel);
    }
    setCurrentIndex(0);
    setIsFlipped(false);
  };

  // Shuffle deck
  const handleShuffle = () => {
    const list = [...deck];
    for (let i = list.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [list[i], list[j]] = [list[j], list[i]];
    }
    setDeck(list);
    setCurrentIndex(0);
    setIsFlipped(false);
    showToast('Urutan kartu berhasil diacak! 🔀');
  };

  // Reset order
  const handleResetOrder = () => {
    const list = filterCards(selectedLevelFilter, searchQuery, sourcePool);
    setDeck(list);
    setCurrentIndex(0);
    setIsFlipped(false);
    showToast('Urutan kartu dikembalikan semula! 🔄');
  };

  const showToast = (msg: string) => {
    setNotificationMsg(msg);
    setTimeout(() => {
      setNotificationMsg(null);
    }, 2000);
  };

  // Card navigation
  const handleNext = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (currentIndex < deck.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setIsFlipped(false);
    } else {
      setCurrentIndex(0);
      setIsFlipped(false);
    }
  };

  const handlePrev = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setIsFlipped(false);
    } else {
      setCurrentIndex(deck.length - 1);
      setIsFlipped(false);
    }
  };

  // Pronunciation
  const speakText = (text: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!('speechSynthesis' in window)) return;

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'ja-JP';
    utterance.rate = 0.85;

    const voices = window.speechSynthesis.getVoices();
    const jaVoice = voices.find(v => v.lang.startsWith('ja'));
    if (jaVoice) utterance.voice = jaVoice;

    setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  const currentCard = deck[currentIndex];
  const memorizedSet = useMemo(() => new Set(memorizedIds), [memorizedIds]);
  const learnedInCurrentDeck = useMemo(
    () => deck.filter((c) => memorizedSet.has(c.id)).length,
    [deck, memorizedSet]
  );
  const deckProgressPercent =
    deck.length > 0 ? Math.min(100, Math.round((learnedInCurrentDeck / deck.length) * 100)) : 0;
  const isCurrentCardLearned = currentCard ? memorizedSet.has(currentCard.id) : false;

  const handleFlipCard = () => {
    const nextFlipped = !isFlipped;
    setIsFlipped(nextFlipped);
    if (nextFlipped && currentCard) {
      storageService.markVocabLearned(currentCard.id);
      setMemorizedIds(storageService.getMemorizedVocab());
    }
  };

  const handleToggleLearned = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!currentCard) return;
    const nowLearned = storageService.toggleMemorizedVocab(currentCard.id);
    setMemorizedIds(storageService.getMemorizedVocab());
    showToast(
      nowLearned
        ? `Kosakata 【${currentCard.kana || currentCard.japanese}】 ditandai sudah dipelajari! ✅`
        : `Status dipelajari dibatalkan untuk 【${currentCard.kana || currentCard.japanese}】.`
    );
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 sm:py-8">
      {/* Toast Notification */}
      {notificationMsg && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 px-5 py-3 bg-[#881337] text-white font-bold text-xs sm:text-sm rounded-2xl shadow-2xl border border-[#fbcfe8] animate-in fade-in slide-in-from-top-4 duration-300 flex items-center gap-2">
          <span>🌸</span>
          <span>{notificationMsg}</span>
        </div>
      )}

      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
        <div>
          <div className="flex items-center gap-1.5 text-xs font-semibold text-[#881337] mb-1">
            <BookOpen className="w-3.5 h-3.5" />
            <span>KARTU HAFALAN KOSAKATA · 4.845 KOSAKATA RESMI JLPT (N5–N2)</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#881337] font-japanese flex items-center gap-2">
            <span>Kartu Kosakata</span>
            <span className="text-xs font-normal font-sans px-2.5 py-0.5 bg-[#fae8eb] text-[#881337] rounded-full border border-[#fbcfe8] font-bold">
              {deck.length} Kosakata
            </span>
          </h2>
        </div>

        {/* Quick actions: Reset order & Shuffle */}
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={handleResetOrder}
            title="Urutkan semula"
            className="flex items-center gap-1 px-3 py-1.5 bg-white hover:bg-[#fff7ee] border border-[#ebdccb] rounded-xl text-[#624734] font-semibold text-xs transition-colors shadow-xs"
          >
            <RotateCcw className="w-3.5 h-3.5 text-[#881337]" />
            <span>Urutkan Semula</span>
          </button>

          <button
            onClick={handleShuffle}
            title="Acak urutan kartu hafalan"
            className="flex items-center gap-1 px-3 py-1.5 bg-white hover:bg-[#fff7ee] border border-[#ebdccb] rounded-xl text-[#881337] font-semibold text-xs transition-colors shadow-xs"
          >
            <Shuffle className="w-3.5 h-3.5" />
            <span>Acak</span>
          </button>
        </div>
      </div>

      {/* Target & Level Filter Bar */}
      <div className="bg-[#fffdfa] border border-[#ebdccb] rounded-2xl p-3 mb-4 shadow-xs">
        <div className="flex items-center justify-between gap-2 mb-2 pb-2 border-b border-[#f5ede1]">
          <div className="flex items-center gap-1.5 text-xs text-[#735338]">
            <Target className="w-3.5 h-3.5 text-[#881337]" />
            <span className="font-bold text-[#881337]">{targetInfo.label}</span>
          </div>
          <span className="text-[11px] font-bold text-[#881337]">
            {deck.length} Kartu Tersedia
          </span>
        </div>

        {/* Level Switcher Buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
          {[
            { id: 'all', label: 'Semua Level (4.845)' },
            { id: 'N5', label: 'Level N5 (669)' },
            { id: 'N4', label: 'Level N4 (582)' },
            { id: 'N3', label: 'Level N3 (1.802)' },
            { id: 'N2', label: 'Level N2 (1.792)' },
          ].map((lvl) => (
            <button
              key={lvl.id}
              onClick={() => handleLevelFilterChange(lvl.id)}
              className={`px-3.5 py-1.5 text-xs font-bold rounded-xl shrink-0 transition-all ${
                selectedLevelFilter === lvl.id
                  ? 'bg-[#881337] text-white shadow-xs scale-105'
                  : 'bg-white border border-[#ebdccb] text-[#735338] hover:border-[#881337]'
              }`}
            >
              {lvl.label}
            </button>
          ))}
        </div>

        {/* Live Progress Bar for Selected Vocab Deck */}
        <div className="mt-3 pt-2.5 border-t border-[#f5ede1]">
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="font-semibold text-[#5e4735]">
              Kemajuan Kosakata ({selectedLevelFilter === 'all' ? 'Semua Level' : `Level ${selectedLevelFilter}`}):
            </span>
            <span className="font-mono tabular-nums font-bold text-[#881337]">
              {learnedInCurrentDeck.toLocaleString('id-ID')} / {deck.length.toLocaleString('id-ID')} Dipelajari ({deckProgressPercent}%)
            </span>
          </div>
          <div className="w-full h-2 bg-[#f3e8da] rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#881337] to-[#be123c] rounded-full transition-all duration-300"
              style={{ width: `${Math.max(learnedInCurrentDeck > 0 ? 2 : 0, deckProgressPercent)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Kolom Pencarian Kata */}
      <div className="mb-4">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#a88a70]">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari: Indonesia / Kana / Kanji / Ejaan..."
            className="w-full pl-9 pr-8 py-2.5 bg-white border border-[#dec7b0] focus:border-[#881337] focus:ring-1 focus:ring-[#881337] rounded-xl text-xs sm:text-sm text-[#3d2a1b] placeholder:text-[#a88a70] outline-hidden shadow-2xs"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-[#a88a70] hover:text-[#881337]"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
        {searchQuery && (
          <div className="flex items-center justify-between text-[11px] text-[#735338] mt-1.5 px-1">
            <span>
              Hasil pencarian "{searchQuery}": <strong className="text-[#881337]">{deck.length} kosakata</strong> ditemukan
            </span>
            <button
              onClick={() => setSearchQuery('')}
              className="text-[#881337] hover:underline font-semibold"
            >
              Hapus pencarian
            </button>
          </div>
        )}
      </div>

      {/* Card Info & Counter */}
      <div className="flex items-center justify-between text-xs text-[#735338] mb-3 px-1">
        <span className="font-semibold">
          {deck.length > 0 ? `Kartu ${currentIndex + 1} dari ${deck.length}` : '0 Kartu Ditemukan'}
        </span>
        <span className="text-[11px] bg-[#fae8eb] text-[#881337] px-2.5 py-0.5 rounded-full font-bold">
          {isFlipped ? '🔍 Sisi Belakang (Arti, Ejaan & Kanji)' : '✨ Sisi Depan (Huruf Kana & Kanji)'}
        </span>
      </div>

      {/* Flashcard Component */}
      {currentCard ? (
        <div
          onClick={handleFlipCard}
          className={`relative w-full min-h-[320px] sm:min-h-[360px] bg-[#fffdfa] border-2 rounded-3xl p-6 sm:p-8 flex flex-col justify-between shadow-md cursor-pointer select-none transition-all duration-300 transform hover:-translate-y-1 ${
            isFlipped
              ? 'border-[#881337] bg-gradient-to-b from-[#fffaf8] to-[#fff5f0]'
              : 'border-[#ecd9c6] hover:border-[#881337]'
          }`}
        >
          {/* Top Bar: Level Badge & Flip Prompt */}
          <div className="flex items-center justify-between w-full">
            <span className="px-2.5 py-1 bg-[#881337] text-white rounded-lg text-xs font-bold">
              JLPT {currentCard.level}
            </span>
            <span className="text-xs text-[#a88a70] italic">Klik kartu untuk membalik 🔄</span>
          </div>

          {/* SISI DEPAN: KANA DITONJOLKAN PALING DEPAN & TEGAS */}
          {!isFlipped ? (
            <div className="text-center my-auto py-6 space-y-3">
              <div className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-[#881337] font-japanese tracking-wide leading-tight">
                【{currentCard.kana || currentCard.japanese}】
              </div>
              {currentCard.japanese && currentCard.japanese !== currentCard.kana && (
                <div className="text-xl sm:text-2xl font-bold text-[#5c3e29] font-japanese">
                  Kanji: {currentCard.japanese}
                </div>
              )}
            </div>
          ) : (
            /* SISI BELAKANG: FORMAT 【KANA】 → KANJI → EJAAN → ARTI */
            <div className="text-center my-auto py-4 space-y-3.5 animate-in fade-in duration-200">
              <div>
                <div className="text-3xl sm:text-4xl font-extrabold text-[#881337] font-japanese">
                  【{currentCard.kana || currentCard.japanese}】
                </div>
                {currentCard.japanese && currentCard.japanese !== currentCard.kana && (
                  <div className="text-lg font-bold text-[#5c3e29] font-japanese mt-1">
                    Kanji: {currentCard.japanese}
                  </div>
                )}
                <div className="text-xs sm:text-sm font-mono text-[#8c6b4b] mt-1">
                  Ejaan: {currentCard.romaji || currentCard.reading}
                </div>
              </div>

              {/* Arti Bahasa Indonesia */}
              <div className="p-3.5 bg-white/95 rounded-2xl border border-[#eeddc8] shadow-2xs">
                <div className="text-[10px] font-bold text-[#881337] uppercase tracking-wider mb-0.5">
                  Arti Bahasa Indonesia
                </div>
                <div className="text-base sm:text-lg font-bold text-[#3d2a1b]">
                  {currentCard.indonesian}
                </div>
              </div>
            </div>
          )}

          {/* Bottom Bar: Action buttons */}
          <div className="flex items-center justify-between w-full pt-4 border-t border-[#f5ede1]/80 gap-2">
            <button
              onClick={(e) => speakText(currentCard.kana || currentCard.japanese, e)}
              className={`p-2.5 rounded-full transition-all ${
                isSpeaking
                  ? 'bg-[#881337] text-white animate-pulse'
                  : 'bg-[#faebd7] hover:bg-[#881337] text-[#881337] hover:text-white'
              }`}
              title="Dengarkan pengucapan audio"
            >
              <Volume2 className="w-5 h-5" />
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

            <span className="text-xs text-[#a88a70]">
              Kosakata #{currentCard.id}
            </span>
          </div>
        </div>
      ) : (
        <div className="text-center py-16 bg-white border border-[#ebdccb] rounded-3xl p-8">
          <p className="text-base text-[#735338] mb-3">Tidak ada kartu yang cocok dengan pencarian.</p>
          <button
            onClick={() => setSearchQuery('')}
            className="px-4 py-2 bg-[#881337] text-white rounded-xl text-xs font-bold"
          >
            Hapus Pencarian
          </button>
        </div>
      )}

      {/* Navigation Controls */}
      <div className="flex items-center justify-between mt-6 gap-3">
        <button
          onClick={handlePrev}
          disabled={deck.length <= 1}
          className="flex-1 flex items-center justify-center gap-2 py-3.5 bg-white hover:bg-[#fff7ee] border border-[#ebdccb] active:border-[#881337] rounded-2xl font-bold text-xs sm:text-sm text-[#735338] transition-all shadow-xs disabled:opacity-50"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Sebelumnya</span>
        </button>

        <button
          onClick={handleNext}
          disabled={deck.length <= 1}
          className="flex-1 flex items-center justify-center gap-2 py-3.5 bg-[#881337] hover:bg-[#70102d] text-white rounded-2xl font-bold text-xs sm:text-sm transition-all shadow-md active:scale-95 disabled:opacity-50"
        >
          <span>Berikutnya</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
