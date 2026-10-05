import React, { useState, useEffect } from 'react';
import { JLPTLevel, LevelStudyProgress, User } from '../types';
import { storageService } from '../services/storageService';
import { Layers, ChevronRight, CheckCircle2, RotateCcw } from 'lucide-react';

interface JLPTStudyProgressSectionProps {
  currentUser?: User | null;
  activeLevel?: JLPTLevel;
  onSelectLevelAndNavigate?: (level: JLPTLevel, tab: 'vocab' | 'kanji') => void;
}

export const JLPTStudyProgressSection: React.FC<JLPTStudyProgressSectionProps> = ({
  currentUser,
  activeLevel,
  onSelectLevelAndNavigate,
}) => {
  const userEmail = currentUser?.email;
  const [progressList, setProgressList] = useState<LevelStudyProgress[]>(() =>
    storageService.getJLPTLevelStudyProgress(userEmail)
  );

  useEffect(() => {
    const refreshProgress = () => {
      setProgressList(storageService.getJLPTLevelStudyProgress(userEmail));
    };
    refreshProgress();

    window.addEventListener('study_progress_updated', refreshProgress);
    window.addEventListener('storage', refreshProgress);
    return () => {
      window.removeEventListener('study_progress_updated', refreshProgress);
      window.removeEventListener('storage', refreshProgress);
    };
  }, [userEmail]);

  const totalVocabLearned = progressList.reduce((acc, p) => acc + p.vocabLearned, 0);
  const totalVocabAll = progressList.reduce((acc, p) => acc + p.vocabTotal, 0);
  const totalKanjiLearned = progressList.reduce((acc, p) => acc + p.kanjiLearned, 0);
  const totalKanjiAll = progressList.reduce((acc, p) => acc + p.kanjiTotal, 0);
  const grandTotalLearned = totalVocabLearned + totalKanjiLearned;
  const grandTotalItems = totalVocabAll + totalKanjiAll;
  const grandTotalPercent =
    grandTotalItems > 0 ? Math.min(100, Math.round((grandTotalLearned / grandTotalItems) * 100)) : 0;

  const levelDescriptions: Record<JLPTLevel, string> = {
    N5: 'Tingkat Dasar Pemula',
    N4: 'Tingkat Dasar Lanjutan',
    N3: 'Tingkat Menengah',
    N2: 'Tingkat Mahir / Bisnis',
  };

  return (
    <section className="bg-[#fffdfa] border border-[#ebdccb] rounded-3xl p-5 sm:p-6 shadow-xs mb-8">
      {/* Top Header & Overall Progress Summary */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 mb-5 border-b border-[#f0e4d6]">
        <div>
          <h2 className="text-lg sm:text-xl font-extrabold text-[#881337] font-japanese flex items-center gap-2">
            <span>📊 Kemajuan Penguasaan Kosakata & Kanji (N5 – N2)</span>
          </h2>
          <p className="text-xs text-[#6e533d] mt-0.5">
            Progres dihitung otomatis saat kamu membalik atau menandai selesai kartu Kosakata dan Kanji di setiap level.
          </p>
        </div>

        <div className="bg-[#f7efe3] border border-[#e5d3c0] rounded-2xl px-4 py-2.5 shrink-0 flex items-center gap-4">
          <div>
            <div className="text-[11px] font-semibold text-[#735338]">Total Seluruh Level</div>
            <div className="text-xs sm:text-sm font-extrabold text-[#881337] font-mono tabular-nums">
              {grandTotalLearned.toLocaleString('id-ID')} / {grandTotalItems.toLocaleString('id-ID')} Item ({grandTotalPercent}%)
            </div>
          </div>
          <div className="text-[11px] text-[#5e4735] border-l border-[#dec7b0] pl-3 space-y-0.5 font-mono tabular-nums">
            <div>Kosakata: {totalVocabLearned.toLocaleString('id-ID')}/{totalVocabAll.toLocaleString('id-ID')}</div>
            <div>Kanji: {totalKanjiLearned.toLocaleString('id-ID')}/{totalKanjiAll.toLocaleString('id-ID')}</div>
          </div>
        </div>
      </div>

      {/* 4 Level Progress Cards (N5, N4, N3, N2) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {progressList.map((item) => {
          const isTargetActive = activeLevel === item.level;

          return (
            <div
              key={item.level}
              className={`rounded-2xl p-4 sm:p-5 border transition-all flex flex-col justify-between ${
                isTargetActive
                  ? 'bg-[#fffaf4] border-2 border-[#881337] shadow-xs'
                  : 'bg-[#fdfbf7] border-[#e5d3c0] hover:border-[#881337]/50'
              }`}
            >
              <div>
                {/* Card Header: Level Name + Overall Level % */}
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-base sm:text-lg font-extrabold text-[#881337] font-japanese">
                        Level JLPT {item.level}
                      </span>
                      {isTargetActive && (
                        <span className="text-[11px] font-semibold text-[#881337]">
                          · Target Aktif
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-[#6e533d]">{levelDescriptions[item.level]}</p>
                  </div>

                  <div className="text-right font-mono tabular-nums">
                    <div className="text-lg sm:text-xl font-extrabold text-[#881337]">
                      {item.totalPercent}%
                    </div>
                    <div className="text-[11px] text-[#735338]">
                      {item.totalLearned.toLocaleString('id-ID')} / {item.totalItems.toLocaleString('id-ID')} item
                    </div>
                  </div>
                </div>

                {/* Combined Level Progress Bar */}
                <div className="w-full h-2.5 bg-[#eadbc8] rounded-full overflow-hidden mb-4">
                  <div
                    className="h-full bg-gradient-to-r from-[#881337] to-[#be123c] rounded-full transition-all duration-300"
                    style={{ width: `${Math.max(item.totalLearned > 0 ? 2 : 0, item.totalPercent)}%` }}
                  />
                </div>

                {/* Sub-bars: 1. Kosakata & 2. Kanji */}
                <div className="space-y-3 bg-white/90 border border-[#efe2d3] rounded-xl p-3">
                  {/* Kosakata Progress Bar */}
                  <div>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="font-semibold text-[#463325] flex items-center gap-1.5">
                        <Layers className="w-3.5 h-3.5 text-[#881337]" />
                        <span>Kosakata {item.level}</span>
                      </span>
                      <span className="font-mono tabular-nums font-bold text-[#881337]">
                        {item.vocabLearned.toLocaleString('id-ID')} / {item.vocabTotal.toLocaleString('id-ID')} ({item.vocabPercent}%)
                      </span>
                    </div>
                    <div className="w-full h-2 bg-[#f3e8da] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#9f1239] rounded-full transition-all duration-300"
                        style={{ width: `${Math.max(item.vocabLearned > 0 ? 2 : 0, item.vocabPercent)}%` }}
                      />
                    </div>
                  </div>

                  {/* Kanji Progress Bar */}
                  <div>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="font-semibold text-[#463325] flex items-center gap-1.5">
                        <span className="font-japanese font-bold text-[#b45309]">漢字</span>
                        <span>Kanji {item.level}</span>
                      </span>
                      <span className="font-mono tabular-nums font-bold text-[#b45309]">
                        {item.kanjiLearned.toLocaleString('id-ID')} / {item.kanjiTotal.toLocaleString('id-ID')} ({item.kanjiPercent}%)
                      </span>
                    </div>
                    <div className="w-full h-2 bg-[#f3e8da] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-amber-600 rounded-full transition-all duration-300"
                        style={{ width: `${Math.max(item.kanjiLearned > 0 ? 2 : 0, item.kanjiPercent)}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Study Links for this JLPT Level */}
              {onSelectLevelAndNavigate && (
                <div className="mt-3.5 pt-3 border-t border-[#efe2d3] flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => onSelectLevelAndNavigate(item.level, 'vocab')}
                    className="flex-1 py-1.5 px-2.5 rounded-xl bg-[#fae8eb] hover:bg-[#f6d5dc] text-[#881337] text-xs font-bold flex items-center justify-center gap-1 transition-colors cursor-pointer"
                  >
                    <span>Kosakata {item.level}</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => onSelectLevelAndNavigate(item.level, 'kanji')}
                    className="flex-1 py-1.5 px-2.5 rounded-xl bg-amber-100/80 hover:bg-amber-200/80 text-amber-950 text-xs font-bold flex items-center justify-center gap-1 transition-colors cursor-pointer"
                  >
                    <span>Kanji {item.level}</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};
