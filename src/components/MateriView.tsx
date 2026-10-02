import React, { useState, useMemo } from 'react';
import { JLPTLevel } from '../types';
import { MATERI_N5, LevelMateri, KanjiItem, VocabItem } from '../data/officialMateriData';
import { MATERI_N4 } from '../data/officialMateriN4N3N2';
import { MATERI_N3, MATERI_N2 } from '../data/officialMateriN3N2';
import {
  JEPANG_ORG_N5_VOCAB,
  JEPANG_ORG_N4_VOCAB,
  JEPANG_ORG_N3_VOCAB,
  JEPANG_ORG_N2_VOCAB
} from '../data/jepangOrgVocab';
import { RUANGGURU_HIRAGANA, RUANGGURU_KATAKANA } from '../data/ruangguruKanaData';
import { Volume2, Search, BookOpen, Layers, Type, Sparkles } from 'lucide-react';

interface MateriViewProps {
  activeLevel: JLPTLevel;
  setActiveLevel: (lvl: JLPTLevel) => void;
}

export const MateriView: React.FC<MateriViewProps> = ({ activeLevel, setActiveLevel }) => {
  const [activeTab, setActiveTab] = useState<'semua' | 'vocab' | 'kanji' | 'bunpou' | 'huruf'>('semua');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [kanaSubTab, setKanaSubTab] = useState<'hiragana' | 'katakana'>('hiragana');
  const [vocabVisibleLimit, setVocabVisibleLimit] = useState<number>(90);

  // Text-to-speech helper
  const speakText = (text: string) => {
    try {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'ja-JP';
        utterance.rate = 0.85;
        const voices = window.speechSynthesis.getVoices();
        const jaVoice = voices.find(v => v.lang.startsWith('ja'));
        if (jaVoice) utterance.voice = jaVoice;
        window.speechSynthesis.speak(utterance);
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Get active level data dengan 100% data resmi jepang.org tanpa duplikat
  const currentMateri: LevelMateri = useMemo(() => {
    switch (activeLevel) {
      case 'N5':
        return {
          ...MATERI_N5,
          stats: { ...MATERI_N5.stats, vocab: `${JEPANG_ORG_N5_VOCAB.length} kosakata` },
          vocabList: JEPANG_ORG_N5_VOCAB
        };
      case 'N4':
        return {
          ...MATERI_N4,
          stats: { ...MATERI_N4.stats, vocab: `${JEPANG_ORG_N4_VOCAB.length} kosakata` },
          vocabList: JEPANG_ORG_N4_VOCAB
        };
      case 'N3':
        return {
          ...MATERI_N3,
          stats: { ...MATERI_N3.stats, vocab: `${JEPANG_ORG_N3_VOCAB.length} kosakata` },
          vocabList: JEPANG_ORG_N3_VOCAB
        };
      case 'N2':
        return {
          ...MATERI_N2,
          stats: { ...MATERI_N2.stats, vocab: `${JEPANG_ORG_N2_VOCAB.length} kosakata` },
          vocabList: JEPANG_ORG_N2_VOCAB
        };
      default:
        return MATERI_N5;
    }
  }, [activeLevel]);

  // Filter Kanji based on search: Indonesia / Kana / Kanji / Ejaan
  const filteredKanji = useMemo(() => {
    if (!searchQuery.trim()) return currentMateri.kanjiList;
    const q = searchQuery.toLowerCase().trim();
    return currentMateri.kanjiList.filter((k: KanjiItem) =>
      k.kanji.toLowerCase().includes(q) ||
      k.kana.toLowerCase().includes(q) ||
      k.ejaan.toLowerCase().includes(q) ||
      k.arti.toLowerCase().includes(q)
    );
  }, [currentMateri, searchQuery]);

  // Filter Vocab based on search: Indonesia / Kana / Kanji / Ejaan
  const filteredVocab = useMemo(() => {
    if (!searchQuery.trim()) return currentMateri.vocabList;
    const q = searchQuery.toLowerCase().trim();
    return currentMateri.vocabList.filter((v: VocabItem) =>
      v.kana.toLowerCase().includes(q) ||
      v.kanji.toLowerCase().includes(q) ||
      v.ejaan.toLowerCase().includes(q) ||
      v.arti.toLowerCase().includes(q)
    );
  }, [currentMateri, searchQuery]);

  const displayedVocab = useMemo(() => {
    if (searchQuery.trim()) {
      return filteredVocab;
    }
    return filteredVocab.slice(0, vocabVisibleLimit);
  }, [filteredVocab, searchQuery, vocabVisibleLimit]);

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 sm:py-8 space-y-6">
      {/* 📘 HEADER UTAMA — TINGKAT MATERI */}
      <div className="bg-[#fffdfa] border-2 border-[#ebdccb] rounded-3xl p-5 sm:p-6 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#faebd7] border border-[#e3ceba] rounded-full text-xs font-bold text-[#881337] mb-2">
            <span>📘</span>
            <span>{currentMateri.title}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#881337] font-japanese">
            Materi Belajar JLPT {activeLevel}
          </h1>
          <p className="text-xs text-[#735338] mt-1">
            {currentMateri.subtitle}
          </p>
        </div>

        {/* Level Switcher */}
        <div className="flex items-center gap-1.5 p-1.5 bg-[#f5ede1] rounded-2xl shrink-0">
          {(['N5', 'N4', 'N3', 'N2'] as JLPTLevel[]).map((lvl) => (
            <button
              key={lvl}
              onClick={() => {
                setActiveLevel(lvl);
                setSearchQuery('');
                setVocabVisibleLimit(90);
              }}
              className={`px-4 py-2 text-xs font-bold rounded-xl transition-all shadow-2xs ${
                activeLevel === lvl
                  ? 'bg-[#881337] text-white shadow-md scale-105'
                  : 'text-[#624734] hover:text-[#881337] hover:bg-[#fff9f3]'
              }`}
            >
              Level {lvl}
            </button>
          ))}
        </div>
      </div>

      {/* 📌 TENTANG LEVEL & KUOTA LENGKAP */}
      <div className="bg-white border border-[#ebdccb] rounded-2xl p-4 sm:p-5 shadow-xs space-y-3">
        <div className="flex items-center gap-2 text-sm font-bold text-[#881337]">
          <span>📌</span>
          <span>TENTANG {activeLevel}</span>
        </div>
        <p className="text-xs sm:text-sm text-[#553b26] leading-relaxed">
          {currentMateri.tentang}
        </p>
        <div className="flex flex-wrap items-center gap-3 pt-1 text-xs font-semibold text-[#8c6b4b]">
          <span className="px-2.5 py-1 bg-[#fff8ef] border border-[#ebdccb] rounded-lg">
            Kanji: {currentMateri.stats.kanji}
          </span>
          <span className="px-2.5 py-1 bg-[#fae8eb] text-[#881337] border border-[#f5c2cb] rounded-lg font-bold">
            Total Kosakata: {currentMateri.vocabList.length} Kata (Lengkap Resmi)
          </span>
          <span className="px-2.5 py-1 bg-[#fff8ef] border border-[#ebdccb] rounded-lg">
            Estimasi Belajar: {currentMateri.stats.hours}
          </span>
        </div>
      </div>

      {/* 🔍 KOTAK PENCARIAN (Indonesia / Kana / Kanji / Ejaan) */}
      <div className="bg-[#fffdfa] border border-[#ebdccb] rounded-2xl p-4 shadow-xs space-y-2">
        <div className="flex items-center justify-between text-xs font-bold text-[#881337]">
          <div className="flex items-center gap-2">
            <Search className="w-4 h-4" />
            <span>PENCARIAN KOSAKATA & KANJI</span>
          </div>
          <span className="text-[11px] text-[#8c6b4b]">
            Mencakup {currentMateri.vocabList.length} Kosakata & {currentMateri.kanjiList.length} Kanji
          </span>
        </div>
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari: Indonesia / Kana / Kanji / Ejaan (contoh: bertemu, 会う, あう, au)..."
            className="w-full px-4 py-2.5 bg-white border border-[#dec7b0] focus:border-[#881337] focus:ring-1 focus:ring-[#881337] rounded-xl text-xs sm:text-sm text-[#3d2a1b] placeholder:text-[#a88a70] outline-hidden shadow-2xs"
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
      </div>

      {/* TAB NAVIGASI MATERI */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-[#ebdccb]">
        <button
          onClick={() => setActiveTab('semua')}
          className={`px-4 py-2 text-xs sm:text-sm font-bold rounded-xl whitespace-nowrap transition-all ${
            activeTab === 'semua'
              ? 'bg-[#881337] text-white shadow-xs'
              : 'bg-[#fffdfa] text-[#553b26] border border-[#e2d0bf] hover:bg-[#fcf3e8]'
          }`}
        >
          Semua Materi
        </button>
        <button
          onClick={() => setActiveTab('vocab')}
          className={`px-4 py-2 text-xs sm:text-sm font-bold rounded-xl whitespace-nowrap transition-all flex items-center gap-1.5 ${
            activeTab === 'vocab'
              ? 'bg-[#881337] text-white shadow-xs'
              : 'bg-[#fffdfa] text-[#553b26] border border-[#e2d0bf] hover:bg-[#fcf3e8]'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Daftar Kosakata ({filteredVocab.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('kanji')}
          className={`px-4 py-2 text-xs sm:text-sm font-bold rounded-xl whitespace-nowrap transition-all flex items-center gap-1.5 ${
            activeTab === 'kanji'
              ? 'bg-[#881337] text-white shadow-xs'
              : 'bg-[#fffdfa] text-[#553b26] border border-[#e2d0bf] hover:bg-[#fcf3e8]'
          }`}
        >
          <span className="font-bold text-xs">漢字</span>
          <span>Daftar Kanji ({filteredKanji.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('bunpou')}
          className={`px-4 py-2 text-xs sm:text-sm font-bold rounded-xl whitespace-nowrap transition-all flex items-center gap-1.5 ${
            activeTab === 'bunpou'
              ? 'bg-[#881337] text-white shadow-xs'
              : 'bg-[#fffdfa] text-[#553b26] border border-[#e2d0bf] hover:bg-[#fcf3e8]'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Bunpou & Pola Kalimat</span>
        </button>
        {activeLevel === 'N5' && (
          <button
            onClick={() => setActiveTab('huruf')}
            className={`px-4 py-2 text-xs sm:text-sm font-bold rounded-xl whitespace-nowrap transition-all flex items-center gap-1.5 ${
              activeTab === 'huruf'
                ? 'bg-[#881337] text-white shadow-xs'
                : 'bg-[#fffdfa] text-[#553b26] border border-[#e2d0bf] hover:bg-[#fcf3e8]'
            }`}
          >
            <Type className="w-4 h-4" />
            <span>Huruf Dasar (Ruangguru)</span>
          </button>
        )}
      </div>

      {/* 📚 DAFTAR KOSAKATA — DENGAN EJAAN */}
      {(activeTab === 'semua' || activeTab === 'vocab') && (
        <div className="bg-white border border-[#ebdccb] rounded-2xl p-4 sm:p-5 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2 border-b border-[#f0e2d3] gap-2">
            <div className="text-sm font-bold text-[#881337] flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#881337]" />
              <span>📚 DAFTAR KOSAKATA {activeLevel} ({currentMateri.vocabList.length} Kata Resmi)</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
            {displayedVocab.map((item, idx) => (
              <div
                key={idx}
                className="p-3 bg-[#fffdfa] border border-[#f0e2d3] hover:border-[#881337] rounded-xl flex items-center justify-between gap-2 transition-all group"
              >
                <div className="space-y-0.5">
                  <div className="flex items-baseline gap-1.5">
                    {/* Kana ditonjolkan paling depan & tegas */}
                    <span className="text-base font-extrabold text-[#881337] font-japanese tracking-wide">
                      【{item.kana}】
                    </span>
                    {item.kanji && item.kanji !== '—' && (
                      <span className="text-xs font-bold text-[#4a3424] font-japanese">
                        → {item.kanji}
                      </span>
                    )}
                  </div>
                  <div className="text-[11px] font-mono text-[#8c6b4b]">
                    → {item.ejaan}
                  </div>
                  <div className="text-xs font-medium text-[#2d1f14]">
                    → <span className="font-semibold">{item.arti}</span>
                  </div>
                </div>

                <button
                  onClick={() => speakText(item.kana || item.kanji)}
                  className="p-2 text-[#a88a70] hover:text-[#881337] hover:bg-[#fae8eb] rounded-lg transition-colors shrink-0"
                  title="Dengar pelafalan"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          {filteredVocab.length === 0 && (
            <div className="text-center py-8 text-xs text-[#a88a70]">
              Tidak ada kosakata yang cocok dengan pencarian "{searchQuery}".
            </div>
          )}

          {/* Tombol Muat Lebih Banyak */}
          {!searchQuery && filteredVocab.length > vocabVisibleLimit && (
            <div className="pt-3 text-center">
              <button
                onClick={() => setVocabVisibleLimit(prev => prev + 90)}
                className="px-6 py-2.5 bg-[#881337] hover:bg-[#70102d] text-white text-xs font-bold rounded-xl shadow-xs transition-all"
              >
                Muat 90 Kosakata Berikutnya (Menampilkan {vocabVisibleLimit} dari {filteredVocab.length})
              </button>
            </div>
          )}
        </div>
      )}

      {/* 📚 DAFTAR KANJI — DENGAN EJAAN */}
      {(activeTab === 'semua' || activeTab === 'kanji') && (
        <div className="bg-white border border-[#ebdccb] rounded-2xl p-4 sm:p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-[#f0e2d3]">
            <div className="text-sm font-bold text-[#881337] flex items-center gap-2">
              <span className="font-japanese text-base">漢字</span>
              <span>📚 DAFTAR KANJI {activeLevel} — DENGAN EJAAN</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
            {filteredKanji.map((item, idx) => (
              <div
                key={idx}
                className="p-3 bg-[#fffdfa] border border-[#f0e2d3] hover:border-[#881337] rounded-xl flex items-center justify-between gap-2 transition-all group"
              >
                <div className="space-y-0.5">
                  <div className="flex items-baseline gap-2">
                    <span className="text-lg font-bold text-[#881337] font-japanese">
                      {item.kanji}
                    </span>
                    <span className="text-sm font-extrabold text-[#70102d] font-japanese">
                      — 【{item.kana}】
                    </span>
                  </div>
                  <div className="text-[11px] font-mono text-[#8c6b4b]">
                    → {item.ejaan}
                  </div>
                  <div className="text-xs font-medium text-[#2d1f14]">
                    → <span className="font-semibold">{item.arti}</span>
                  </div>
                </div>

                <button
                  onClick={() => speakText(item.kana.split('/')[0].trim())}
                  className="p-2 text-[#a88a70] hover:text-[#881337] hover:bg-[#fae8eb] rounded-lg transition-colors shrink-0"
                  title="Dengar pelafalan kanji"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          {filteredKanji.length === 0 && (
            <div className="text-center py-8 text-xs text-[#a88a70]">
              Tidak ada kanji yang cocok dengan pencarian "{searchQuery}".
            </div>
          )}
        </div>
      )}

      {/* 📌 HURUF DASAR — HIRAGANA & KATAKANA LENGKAP (RUANGGURU) */}
      {(activeTab === 'semua' || activeTab === 'huruf') && activeLevel === 'N5' && (
        <div className="bg-white border border-[#ebdccb] rounded-2xl p-4 sm:p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-[#f0e2d3]">
            <div className="text-sm font-bold text-[#881337] flex items-center gap-2">
              <Type className="w-4 h-4" />
              <span>📌 HURUF DASAR — HIRAGANA & KATAKANA</span>
            </div>
            <div className="flex items-center gap-1.5 p-1 bg-[#f5ede1] rounded-xl text-xs">
              <button
                onClick={() => setKanaSubTab('hiragana')}
                className={`px-3 py-1 font-bold rounded-lg transition-all ${
                  kanaSubTab === 'hiragana' ? 'bg-[#881337] text-white' : 'text-[#624734]'
                }`}
              >
                Hiragana Lengkap
              </button>
              <button
                onClick={() => setKanaSubTab('katakana')}
                className={`px-3 py-1 font-bold rounded-lg transition-all ${
                  kanaSubTab === 'katakana' ? 'bg-[#881337] text-white' : 'text-[#624734]'
                }`}
              >
                Katakana Lengkap
              </button>
            </div>
          </div>

          <div className="space-y-3">
            {(kanaSubTab === 'hiragana' ? RUANGGURU_HIRAGANA : RUANGGURU_KATAKANA).map((row, rIdx) => (
              <div key={rIdx} className="p-3 bg-[#fffbf4] border border-[#f0e4d6] rounded-xl space-y-2">
                <div className="text-xs font-bold text-[#881337] uppercase tracking-wider">
                  {row.group}:
                </div>
                <div className="flex flex-wrap gap-2">
                  {row.items.map((k, kIdx) => (
                    <div
                      key={kIdx}
                      className="px-3 py-1.5 bg-white border border-[#ebdccb] hover:border-[#881337] rounded-lg text-center flex items-center gap-1.5 shadow-2xs group"
                    >
                      <span className="text-base font-extrabold text-[#881337] font-japanese">
                        {k.kana}
                      </span>
                      <span className="text-xs font-mono text-[#8c6b4b]">
                        → {k.romaji}
                      </span>
                      {k.note && (
                        <span className="text-[10px] text-[#a88a70] italic">
                          ({k.note})
                        </span>
                      )}
                      <button
                        onClick={() => speakText(k.kana)}
                        className="text-[#a88a70] hover:text-[#881337] ml-1"
                        title="Dengar audio"
                      >
                        <Volume2 className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 📌 BUNPOU & POLA KALIMAT DASAR (JEPANG.ORG) */}
      {(activeTab === 'semua' || activeTab === 'bunpou') && (
        <div className="space-y-4">
          {/* Bunpou Dasar */}
          <div className="bg-white border border-[#ebdccb] rounded-2xl p-4 sm:p-5 shadow-xs space-y-4">
            <div className="text-sm font-bold text-[#881337] flex items-center gap-2 pb-2 border-b border-[#f0e2d3]">
              <BookOpen className="w-4 h-4 text-[#881337]" />
              <span>📌 BUNPOU {activeLevel} — TATA BAHASA</span>
            </div>

            <div className="space-y-3">
              {currentMateri.bunpouNotes.map((note, idx) => (
                <div key={idx} className="p-3.5 bg-[#fffdfa] border border-[#f0e2d3] rounded-xl space-y-1.5">
                  <div className="text-xs sm:text-sm font-bold text-[#881337]">
                    🔹 {note.title}
                  </div>
                  <ul className="text-xs text-[#4a3424] space-y-1 pl-3">
                    {note.content.map((c, cIdx) => (
                      <li key={cIdx} className="leading-relaxed">
                        • {c}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Pola Kalimat Dasar */}
          <div className="bg-white border border-[#ebdccb] rounded-2xl p-4 sm:p-5 shadow-xs space-y-4">
            <div className="text-sm font-bold text-[#881337] flex items-center gap-2 pb-2 border-b border-[#f0e2d3]">
              <Sparkles className="w-4 h-4 text-[#881337]" />
              <span>📌 POLA KALIMAT DASAR {activeLevel}</span>
            </div>

            <div className="space-y-2.5">
              {currentMateri.polaKalimat.map((item) => (
                <div
                  key={item.id}
                  className="p-3 bg-[#fffbf4] border border-[#f0e4d6] hover:border-[#881337] rounded-xl flex items-center justify-between gap-3 transition-all"
                >
                  <div className="space-y-1">
                    <div className="text-sm font-bold text-[#881337] font-japanese">
                      {item.id}. {item.pattern}
                    </div>
                    <div className="text-xs font-mono text-[#8c6b4b]">
                      → {item.ejaan}
                    </div>
                    <div className="text-xs font-medium text-[#3d2a1b]">
                      → {item.arti}
                    </div>
                  </div>

                  <button
                    onClick={() => speakText(item.pattern)}
                    className="p-2 text-[#a88a70] hover:text-[#881337] hover:bg-[#fae8eb] rounded-lg transition-colors shrink-0"
                    title="Dengar kalimat"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ──────────────────────────────────────────────────────────
          SUMBER DI POJOK KIRI BAWAH
         ────────────────────────────────────────────────────────── */}
      <div className="pt-4 border-t border-[#ebdccb]">
        <div className="text-left text-xs font-bold text-[#881337] bg-[#fbf5ed] inline-block px-3 py-1.5 rounded-lg border border-[#e3ceba]">
          {currentMateri.sumber}
        </div>
      </div>
    </div>
  );
};
