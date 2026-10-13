import React, { useState, useEffect, useRef } from 'react';
import { Languages, Volume2, Copy, Check, ArrowRight, Sparkles, X, RefreshCw, BookOpen, ArrowLeftRight, Globe } from 'lucide-react';
import { translatorService, TranslationResult } from '../services/translatorService';

interface IndoJapaneseTranslatorCardProps {
  className?: string;
  id?: string;
  initialDirection?: 'id-to-ja' | 'ja-to-id';
}

const PRESET_PHRASES_ID_TO_JA = [
  'Selamat pagi',
  'Terima kasih banyak',
  'Apa kabar?',
  'Saya sedang belajar bahasa Jepang',
  'Berapa harganya ini?',
  'Di mana toilet?',
  'Enak sekali',
  'Tolong bantu saya',
  'Semangat!',
  'Senang bertemu denganmu',
];

const PRESET_PHRASES_JA_TO_ID = [
  'おはようございます',
  'ありがとうございます',
  'お元気ですか',
  '日本語を勉強しています',
  'いくらですか',
  'トイレはどこですか',
  '美味しいです',
  '助けてください',
  'こんにちは',
  'はじめまして',
];

export const IndoJapaneseTranslatorCard: React.FC<IndoJapaneseTranslatorCardProps> = ({
  className = '',
  id = 'translator-section',
  initialDirection = 'id-to-ja',
}) => {
  const [direction, setDirection] = useState<'id-to-ja' | 'ja-to-id'>(initialDirection);
  const [inputText, setInputText] = useState<string>(
    initialDirection === 'id-to-ja' ? 'Selamat pagi' : 'おはようございます'
  );
  const [result, setResult] = useState<TranslationResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Terjemahkan otomatis saat pertama kali dibuka langsung tersambung ke Google Terjemahan
  useEffect(() => {
    handleTranslate(inputText, direction);
  }, []);

  const handleTranslate = async (
    textToTranslate?: string,
    dirOverride?: 'id-to-ja' | 'ja-to-id'
  ) => {
    const activeDir = dirOverride || direction;
    const query = (textToTranslate !== undefined ? textToTranslate : inputText).trim();
    if (!query) return;

    setIsLoading(true);
    try {
      const res = await translatorService.translate(query, activeDir);
      setResult(res);
    } catch (err) {
      console.warn('Translation notice:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSwitchDirection = (newDir: 'id-to-ja' | 'ja-to-id') => {
    if (newDir === direction) return;
    setDirection(newDir);
    const newDefaultText = newDir === 'id-to-ja' ? 'Selamat pagi' : 'おはようございます';
    // Jika ada hasil sebelumnya, gunakan hasil sebelumnya sebagai input baru jika relevan
    let nextInput = newDefaultText;
    if (result) {
      if (newDir === 'ja-to-id' && result.japanese) {
        nextInput = result.japanese;
      } else if (newDir === 'id-to-ja' && result.indonesian) {
        nextInput = result.indonesian;
      }
    }
    setInputText(nextInput);
    handleTranslate(nextInput, newDir);
  };

  const handleToggleDirection = () => {
    const nextDir = direction === 'id-to-ja' ? 'ja-to-id' : 'id-to-ja';
    handleSwitchDirection(nextDir);
  };

  const handleSelectPreset = (phrase: string) => {
    setInputText(phrase);
    handleTranslate(phrase, direction);
  };

  const handleCopy = () => {
    if (!result) return;
    const textToCopy =
      direction === 'id-to-ja'
        ? `Huruf Jepang: ${result.japanese}\nEjaan (Romaji): ${result.romaji}\nArti: ${result.indonesian}`
        : `Arti Indonesia: ${result.indonesian}\nHuruf Jepang: ${result.japanese}\nEjaan (Romaji): ${result.romaji}`;

    navigator.clipboard.writeText(textToCopy).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    });
  };

  const handleSpeakJapanese = () => {
    const jpText = result?.japanese || (direction === 'ja-to-id' ? inputText : '');
    if (!jpText) return;
    setIsPlayingAudio(true);

    // 1. Coba Web Speech Synthesis bawaan browser
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(jpText);
        utterance.lang = 'ja-JP';
        utterance.rate = 0.9;
        utterance.onend = () => setIsPlayingAudio(false);
        utterance.onerror = () => fallbackAudioTTS(jpText);
        window.speechSynthesis.speak(utterance);
        return;
      } catch {
        fallbackAudioTTS(jpText);
        return;
      }
    }

    fallbackAudioTTS(jpText);
  };

  const fallbackAudioTTS = (jpText: string) => {
    try {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      const audio = new Audio(`/api/onepiece-voice?text=${encodeURIComponent(jpText)}&lang=ja`);
      audioRef.current = audio;
      audio.onended = () => setIsPlayingAudio(false);
      audio.onerror = () => setIsPlayingAudio(false);
      audio.play().catch(() => setIsPlayingAudio(false));
    } catch {
      setIsPlayingAudio(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleTranslate();
    }
  };

  const isJaToId = direction === 'ja-to-id';
  const currentPresets = isJaToId ? PRESET_PHRASES_JA_TO_ID : PRESET_PHRASES_ID_TO_JA;

  return (
    <div
      id={id}
      className={`scroll-mt-20 bg-[#fffdfa] border-2 border-[#dfc7aa] hover:border-[#881337]/70 rounded-2xl p-4 sm:p-6 shadow-sm transition-all relative overflow-hidden ${className}`}
    >
      {/* Decorative Top Accent Bar */}
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#881337] via-[#f59e0b] to-[#be123c]" />

      {/* Header with Title and Direction Tabs */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4 pt-1">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-[#fae8eb] text-[#881337] rounded-xl border border-[#fbcfe8] shadow-2xs">
            <Languages className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg sm:text-xl font-extrabold text-[#881337] font-japanese tracking-tight">
                🈳 TERJEMAHAN ID — JP / JP — ID
              </h3>
              <span className="text-xs px-2 py-0.5 bg-amber-100 text-amber-900 border border-amber-300 font-bold rounded-md">
                Huruf & Ejaan
              </span>
            </div>
            <p className="text-xs text-[#5e4735] mt-0.5">
              Tersambung langsung ke <strong>Google Terjemahan</strong>: Terjemahan instan <strong>Indonesia ➔ Jepang</strong> atau <strong>Jepang ➔ Indonesia</strong> dengan <strong>Huruf Kanji/Kana</strong> serta <strong>Ejaan Latin Romaji</strong>.
            </p>
          </div>
        </div>

        {/* Direction Selector Tabs & Swap Button */}
        <div className="flex items-center gap-1.5 bg-[#f5ede1] p-1.5 rounded-xl border border-[#dec7b0] self-start md:self-auto shrink-0">
          <button
            type="button"
            onClick={() => handleSwitchDirection('id-to-ja')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              !isJaToId
                ? 'bg-[#881337] text-white shadow-2xs'
                : 'text-[#735338] hover:text-[#881337] hover:bg-white/60'
            }`}
          >
            <span>🇮🇩 ID</span>
            <ArrowRight className="w-3 h-3" />
            <span>🇯🇵 JP</span>
          </button>

          <button
            type="button"
            onClick={handleToggleDirection}
            className="p-1.5 text-[#881337] hover:bg-white/80 rounded-lg transition-colors cursor-pointer"
            title="Tukar arah terjemahan"
          >
            <ArrowLeftRight className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={() => handleSwitchDirection('ja-to-id')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              isJaToId
                ? 'bg-[#881337] text-white shadow-2xs'
                : 'text-[#735338] hover:text-[#881337] hover:bg-white/60'
            }`}
          >
            <span>🇯🇵 JP</span>
            <ArrowRight className="w-3 h-3" />
            <span>🇮🇩 ID</span>
          </button>
        </div>
      </div>

      {/* Input Section */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-1.5">
          <label className="text-xs font-bold text-[#881337] uppercase tracking-wider flex items-center gap-1.5">
            <span>{isJaToId ? '🇯🇵 Ketik Teks Bahasa Jepang (Kanji, Kana, atau Romaji)' : '🇮🇩 Ketik Teks Bahasa Indonesia'}</span>
          </label>
          <span className="text-[11px] font-semibold text-[#8c6b4b] flex items-center gap-1">
            <Globe className="w-3 h-3 text-blue-600" />
            <span>Google Terjemahan ({isJaToId ? 'JP ➔ ID' : 'ID ➔ JP'})</span>
          </span>
        </div>

        <div className="relative">
          <textarea
            ref={inputRef}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={
              isJaToId
                ? 'Tulis kata atau kalimat dalam huruf Jepang (Kanji / Hiragana / Katakana) atau ejaan Romaji (contoh: おはようございます, arigatou gozaimasu, 日本語を勉強しています)...'
                : 'Tulis kata, kalimat, atau pertanyaan dalam Bahasa Indonesia (contoh: Selamat pagi, Saya mau makan ramen, Di mana stasiun kereta?)...'
            }
            rows={3}
            className="w-full p-3.5 pr-10 text-sm sm:text-base text-[#2c1d11] bg-[#fffdfa] border-2 border-[#dfc7aa] rounded-xl focus:outline-none focus:border-[#881337] focus:ring-2 focus:ring-[#881337]/20 transition-all resize-none placeholder:text-stone-400 font-sans"
          />
          {inputText && (
            <button
              type="button"
              onClick={() => {
                setInputText('');
                inputRef.current?.focus();
              }}
              className="absolute top-3 right-3 p-1 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-100 transition-colors"
              title="Hapus teks"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Quick Phrase Samples */}
        <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
          <span className="text-[11px] font-bold text-[#881337] mr-1 flex items-center gap-1">
            <Sparkles className="w-3 h-3" />
            Contoh Cepat:
          </span>
          {currentPresets.map((phrase) => (
            <button
              key={phrase}
              type="button"
              onClick={() => handleSelectPreset(phrase)}
              className="text-[11px] px-2.5 py-1 bg-[#fdf8f0] hover:bg-[#fae8eb] text-[#553b26] hover:text-[#881337] border border-[#e5d3c0] hover:border-[#881337] rounded-lg font-medium transition-colors cursor-pointer font-japanese"
            >
              {phrase}
            </button>
          ))}
        </div>
      </div>

      {/* Action Button & Shortcuts */}
      <div className="flex items-center justify-between gap-3 mb-6">
        <span className="text-[11px] text-stone-500 hidden sm:inline">
          Tekan <kbd className="px-1.5 py-0.5 bg-stone-100 border border-stone-300 rounded text-[10px] font-mono">Enter</kbd> untuk langsung menerjemahkan
        </span>
        <button
          type="button"
          onClick={() => handleTranslate()}
          disabled={isLoading || !inputText.trim()}
          className="w-full sm:w-auto ml-auto px-5 py-2.5 bg-[#881337] hover:bg-[#9f1239] active:scale-98 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-sm rounded-xl shadow-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
        >
          {isLoading ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>Menerjemahkan...</span>
            </>
          ) : (
            <>
              <Languages className="w-4 h-4" />
              <span>
                {isJaToId ? 'Terjemahkan ke Bahasa Indonesia' : 'Terjemahkan ke Bahasa Jepang'}
              </span>
            </>
          )}
        </button>
      </div>

      {/* Translation Result Panel */}
      {result && (result.japanese || result.indonesian) && (
        <div className="bg-gradient-to-br from-[#fdfbf7] to-[#fbf4eb] border-2 border-[#881337]/30 rounded-2xl p-4 sm:p-5 shadow-xs">
          {/* Result Header & Actions */}
          <div className="flex flex-wrap items-center justify-between gap-2 pb-3 mb-3 border-b border-[#ebdccb]">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold px-2 py-0.5 bg-[#881337] text-white rounded-md">
                Hasil Terjemahan ({isJaToId ? 'JP ➔ ID' : 'ID ➔ JP'})
              </span>

              {/* Status Sumber: Google Terjemahan */}
              <span className="text-xs font-bold px-2.5 py-0.5 bg-blue-100 text-blue-900 border border-blue-300 rounded-md flex items-center gap-1 shadow-2xs">
                <Globe className="w-3.5 h-3.5 text-blue-600" />
                <span>Google Terjemahan</span>
              </span>

              {result.politeness && (
                <span className="text-xs font-semibold px-2 py-0.5 bg-[#fae8eb] text-[#881337] border border-[#fbcfe8] rounded-md">
                  {result.politeness}
                </span>
              )}
            </div>

            <div className="flex items-center gap-1.5">
              {/* Audio Pronunciation Button (Plays Japanese text) */}
              <button
                type="button"
                onClick={handleSpeakJapanese}
                disabled={isPlayingAudio || !result.japanese}
                className="px-2.5 py-1.5 bg-white hover:bg-amber-50 text-[#881337] border border-[#e2c29d] hover:border-[#881337] rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all shadow-2xs cursor-pointer"
                title="Dengarkan pelafalan bahasa Jepang"
              >
                <Volume2 className={`w-4 h-4 ${isPlayingAudio ? 'animate-bounce text-amber-600' : ''}`} />
                <span>{isPlayingAudio ? 'Memutar Suara...' : 'Dengar Suara JP'}</span>
              </button>

              {/* Copy Button */}
              <button
                type="button"
                onClick={handleCopy}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all shadow-2xs border cursor-pointer ${
                  isCopied
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                    : 'bg-white hover:bg-stone-50 text-[#553b26] border-[#dec7b0]'
                }`}
                title="Salin hasil huruf Jepang & ejaan"
              >
                {isCopied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Tersalin!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-stone-600" />
                    <span>Salin</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Conditional Ordering depending on direction */}
          {isJaToId ? (
            <>
              {/* 1. Hasil Utama: Arti Bahasa Indonesia */}
              <div className="mb-4">
                <span className="block text-[11px] font-bold text-[#735338] uppercase tracking-wider mb-1">
                  Arti Terjemahan Bahasa Indonesia
                </span>
                <div className="p-3.5 bg-white border-2 border-emerald-200/80 rounded-xl shadow-2xs">
                  <p className="text-base sm:text-xl font-bold text-[#14532d] leading-relaxed select-all">
                    {result.indonesian}
                  </p>
                </div>
              </div>

              {/* 2. Huruf Jepang: Fokus Huruf Kana di Atas & Kanji di Bawah */}
              <div className="mb-4">
                <span className="block text-[11px] font-bold text-[#735338] uppercase tracking-wider mb-1">
                  Huruf Jepang (Fokus Kana Utama & Kanji di Bawah)
                </span>
                <div className="p-3.5 bg-white border border-[#ebdccb] rounded-xl shadow-2xs">
                  <p className="text-2xl sm:text-3xl font-extrabold text-[#881337] font-japanese leading-relaxed select-all">
                    {result.furigana || result.japanese}
                  </p>
                  {result.japanese && result.japanese !== (result.furigana || result.japanese) && (
                    <p className="text-sm font-japanese text-[#5c3e29] mt-1.5 font-bold">
                      Kanji: <span className="text-[#881337]">{result.japanese}</span>
                    </p>
                  )}
                </div>
              </div>

              {/* 3. Ejaan Bahasa Jepang (Romaji) */}
              <div className="mb-4">
                <span className="block text-[11px] font-bold text-[#735338] uppercase tracking-wider mb-1">
                  Ejaan Pelafalan Latin (Romaji)
                </span>
                <div className="p-3 bg-amber-50/80 border-2 border-amber-300/80 rounded-xl">
                  <div className="flex items-center gap-2">
                    <span className="text-xs px-2 py-0.5 bg-amber-200 text-amber-950 font-extrabold rounded-md uppercase">
                      Ejaan
                    </span>
                    <p className="text-base sm:text-lg font-mono font-bold text-amber-950 select-all">
                      {result.romaji}
                    </p>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <>
              {/* 1. Huruf Jepang: Fokus Huruf Kana di Atas & Kanji di Bawah */}
              <div className="mb-4">
                <span className="block text-[11px] font-bold text-[#735338] uppercase tracking-wider mb-1">
                  Huruf Jepang (Fokus Kana Utama & Kanji di Bawah)
                </span>
                <div className="p-3.5 bg-white border border-[#ebdccb] rounded-xl shadow-2xs">
                  <p className="text-2xl sm:text-3xl font-extrabold text-[#881337] font-japanese leading-relaxed select-all">
                    {result.furigana || result.japanese}
                  </p>
                  {result.japanese && result.japanese !== (result.furigana || result.japanese) && (
                    <p className="text-sm font-japanese text-[#5c3e29] mt-1.5 font-bold">
                      Kanji: <span className="text-[#881337]">{result.japanese}</span>
                    </p>
                  )}
                </div>
              </div>

              {/* 2. Ejaan Bahasa Jepang (Romaji) */}
              <div className="mb-4">
                <span className="block text-[11px] font-bold text-[#735338] uppercase tracking-wider mb-1">
                  Ejaan Bahasa Jepang (Romaji / Pelafalan Latin)
                </span>
                <div className="p-3 bg-amber-50/80 border-2 border-amber-300/80 rounded-xl">
                  <div className="flex items-center gap-2">
                    <span className="text-xs px-2 py-0.5 bg-amber-200 text-amber-950 font-extrabold rounded-md uppercase">
                      Ejaan
                    </span>
                    <p className="text-base sm:text-lg font-mono font-bold text-amber-950 select-all">
                      {result.romaji}
                    </p>
                  </div>
                </div>
              </div>

              {/* 3. Arti Bahasa Indonesia */}
              <div className="mb-3">
                <span className="block text-[11px] font-bold text-[#735338] uppercase tracking-wider mb-1">
                  Arti Bahasa Indonesia
                </span>
                <p className="text-sm sm:text-base font-semibold text-[#3b2718] bg-white/80 p-2.5 rounded-lg border border-[#ebdccb]">
                  {result.indonesian}
                </p>
              </div>
            </>
          )}

          {/* 4. Rincian Kosakata (Breakdown Kata) */}
          {result.breakdown && result.breakdown.length > 0 && (
            <div className="mt-4 pt-3 border-t border-[#ebdccb]">
              <span className="block text-[11px] font-bold text-[#735338] uppercase tracking-wider mb-2 flex items-center gap-1">
                <BookOpen className="w-3.5 h-3.5 text-[#881337]" />
                Rincian Kosakata Kata per Kata
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                {result.breakdown.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 bg-white border border-[#ebdccb] rounded-xl text-xs shadow-2xs"
                  >
                    <div className="flex items-baseline justify-between gap-1 mb-0.5">
                      <span className="font-japanese font-bold text-sm text-[#881337]">
                        {item.word}
                      </span>
                      <span className="font-mono text-[11px] text-amber-900 font-semibold">
                        {item.reading}
                      </span>
                    </div>
                    <p className="text-[11px] text-stone-600 truncate">
                      {item.meaning}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 5. Catatan / Tips Tambahan */}
          {result.tips && (
            <div className="mt-3 p-2.5 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-900">
              💡 <strong>Tips Sensei:</strong> {result.tips}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
