import React from 'react';
import { ArrowLeft, Languages, BookOpen, Layers, Sparkles } from 'lucide-react';
import { IndoJapaneseTranslatorCard } from './IndoJapaneseTranslatorCard';
import { JapaneseShrineSakuraScene } from './JapaneseShrineSakuraScene';
import { JLPTLevel } from '../types';

interface TranslationViewProps {
  onNavigateHome: () => void;
  onNavigateTab?: (tab: string) => void;
  activeLevel?: JLPTLevel;
}

export const TranslationView: React.FC<TranslationViewProps> = ({
  onNavigateHome,
  onNavigateTab,
  activeLevel = 'N5',
}) => {
  return (
    <div className="relative overflow-hidden py-4 sm:py-8">
      {/* Ornamen Latar Kuil Jepang & Animasi Sakura */}
      <JapaneseShrineSakuraScene />

      <div className="relative z-10 max-w-4xl mx-auto px-4">
        {/* Top Navigation Bar: Back to Home Button & Breadcrumbs */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <button
            type="button"
            onClick={onNavigateHome}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white/95 hover:bg-[#fff9f3] text-[#881337] hover:text-[#9f1239] border border-[#e2c29d] hover:border-[#881337] rounded-xl text-xs sm:text-sm font-bold shadow-2xs hover:shadow-xs transition-all cursor-pointer group"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            <span>Kembali ke Beranda</span>
          </button>

          <div className="flex items-center gap-2 text-xs font-semibold text-[#735338] bg-white/80 px-3 py-1.5 rounded-xl border border-[#ebdccb]">
            <span
              onClick={onNavigateHome}
              className="hover:text-[#881337] cursor-pointer"
            >
              Beranda
            </span>
            <span>/</span>
            <span className="text-[#881337] font-bold">Terjemahan ID ⇄ JP</span>
          </div>
        </div>

        {/* Page Title & Banner */}
        <div className="text-center mb-6 sm:mb-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-[#fffdfa]/90 border border-[#e2c29d] rounded-full text-xs font-bold text-[#881337] mb-3 shadow-2xs">
            <span>⛩️</span>
            <span>Nihongo Honyaku — Terjemahan Dua Arah ID ⇄ JP</span>
            <span>🌸</span>
          </div>

          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#881337] tracking-tight font-japanese text-balance mb-2">
            🈳 TERJEMAHAN ID — JP / JP — ID
          </h1>
          <p className="max-w-xl mx-auto text-xs sm:text-sm text-[#5e4735] leading-relaxed">
            Pilihan terjemahan dua arah: <strong>Indonesia ke Jepang (ID ➔ JP)</strong> atau <strong>Jepang ke Indonesia (JP ➔ ID)</strong>. Lengkap dengan <strong>Huruf Jepang (Kanji & Kana)</strong>, <strong>Ejaan Latin (Romaji)</strong>, dan pelafalan audio penutur asli.
          </p>
        </div>

        {/* Full Interactive Translator Card */}
        <IndoJapaneseTranslatorCard id="main-translator" className="mb-8" />

        {/* Quick Study Navigation Footer */}
        <div className="bg-[#fffdfa]/95 border-2 border-[#dfc7aa] rounded-2xl p-4 sm:p-5 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-left">
            <div className="p-3 bg-amber-100 text-[#881337] rounded-xl shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-[#881337]">
                Ingin menghafal kosakata JLPT {activeLevel} secara terstruktur?
              </h4>
              <p className="text-xs text-[#5e4735]">
                Buka kartu hafalan kosakata dan kartu kanji resmi Sensei Sari.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto">
            {onNavigateTab && (
              <>
                <button
                  type="button"
                  onClick={() => onNavigateTab('vocab')}
                  className="flex-1 sm:flex-none px-3.5 py-2 bg-[#fae8eb] hover:bg-[#fbcfe8] text-[#881337] font-bold text-xs rounded-xl border border-[#fbcfe8] flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>Kartu Kosakata</span>
                </button>
                <button
                  type="button"
                  onClick={() => onNavigateTab('materi')}
                  className="flex-1 sm:flex-none px-3.5 py-2 bg-[#881337] hover:bg-[#9f1239] text-white font-bold text-xs rounded-xl shadow-2xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Buka Materi</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
