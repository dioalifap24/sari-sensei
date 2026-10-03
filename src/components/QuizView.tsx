import React, { useState, useEffect, useRef } from 'react';
import { JLPTLevel, QuizResult, User, QuizControlState } from '../types';
import { getQuestionsForLevel, shuffleQuestionOptions } from '../data/quizQuestions';
import { storageService } from '../services/storageService';
import { 
  Clock, 
  AlertCircle, 
  CheckCircle2, 
  XCircle, 
  RotateCcw, 
  Award, 
  ChevronRight, 
  ChevronLeft,
  BookOpen,
  ArrowRight,
  Lock,
  Play,
  Square,
  Shield,
  Sparkles
} from 'lucide-react';

interface QuizViewProps {
  activeLevel: JLPTLevel;
  setActiveLevel: (lvl: JLPTLevel) => void;
  currentUser: User | null;
  onOpenAuth: () => void;
  onScoreCelebration: () => void;
  onNavigateHome: () => void;
}

interface PreparedQuestion {
  id: number;
  level: JLPTLevel;
  question: string;
  options: string[]; // Randomized A/B/C/D
  correctAnswerIndex: number;
  explanation: string;
  topic?: string;
}

export const QuizView: React.FC<QuizViewProps> = ({
  activeLevel,
  setActiveLevel,
  currentUser,
  onOpenAuth,
  onScoreCelebration,
  onNavigateHome,
}) => {
  const [quizControl, setQuizControl] = useState<QuizControlState>({ isActive: false });
  const [quizStep, setQuizStep] = useState<'setup' | 'running' | 'result'>('setup');
  const [selectedDurationMinutes, setSelectedDurationMinutes] = useState<number>(45); // 15, 30, 45, 60
  const [questions, setQuestions] = useState<PreparedQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({});
  
  // Timer state
  const [timeRemainingSeconds, setTimeRemainingSeconds] = useState<number>(45 * 60);
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);
  const timerIntervalRef = useRef<number | null>(null);

  // Active quiz session ID for live tracking
  const activeSessionIdRef = useRef<string | null>(null);

  // Result state
  const [finalResult, setFinalResult] = useState<QuizResult | null>(null);
  const [showConfirmSubmit, setShowConfirmSubmit] = useState(false);

  const isMasterUser = storageService.isMaster(currentUser);

  // Load and listen to live quiz control state
  useEffect(() => {
    setQuizControl(storageService.getQuizControlState());

    const handleQuizControlChange = () => {
      setQuizControl(storageService.getQuizControlState());
    };

    window.addEventListener('quiz_control_changed', handleQuizControlChange);
    window.addEventListener('storage', handleQuizControlChange);

    return () => {
      window.removeEventListener('quiz_control_changed', handleQuizControlChange);
      window.removeEventListener('storage', handleQuizControlChange);
    };
  }, []);

  // Master Sesi Kuis Toggle Handler
  const handleToggleMasterQuizSession = () => {
    const newState = !quizControl.isActive;
    storageService.setQuizControlState(newState, currentUser || undefined);
    setQuizControl(storageService.getQuizControlState());
  };

  // Start Quiz Handler (Starts timer and records live in "Nilai Murid")
  const handleStartQuiz = () => {
    const rawList = getQuestionsForLevel(activeLevel);
    const prepared = rawList.map((q) => {
      const { options, correctIndex } = shuffleQuestionOptions(q);
      return {
        ...q,
        options,
        correctAnswerIndex: correctIndex,
      };
    });

    setQuestions(prepared);
    setCurrentQuestionIndex(0);
    setUserAnswers({});
    const totalSecs = selectedDurationMinutes * 60;
    setTimeRemainingSeconds(totalSecs);
    setElapsedSeconds(0);

    // Hindari kuis anonim: wajib menggunakan akun murid resmi terdaftar
    if (!currentUser) {
      onOpenAuth();
      return;
    }

    // Register active quiz session live in storage
    const userToRecord: User = currentUser;
    
    const sessionId = storageService.startActiveQuiz(userToRecord, activeLevel, prepared.length);
    activeSessionIdRef.current = sessionId;

    setQuizStep('running');
  };

  // Timer effect during 'running'
  useEffect(() => {
    if (quizStep === 'running') {
      timerIntervalRef.current = window.setInterval(() => {
        setTimeRemainingSeconds((prev) => {
          if (prev <= 1) {
            // Time's up! Automatically submit
            clearInterval(timerIntervalRef.current!);
            handleCompleteQuiz(true);
            return 0;
          }
          return prev - 1;
        });
        setElapsedSeconds((prev) => prev + 1);
      }, 1000);

      return () => {
        if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
      };
    }
  }, [quizStep]);

  // Complete Quiz & Calculate Score (Records live completion in "Nilai Murid")
  const handleCompleteQuiz = (isTimeUp = false) => {
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
    }

    let correctCount = 0;
    questions.forEach((q, idx) => {
      if (userAnswers[idx] === q.correctAnswerIndex) {
        correctCount++;
      }
    });

    // Score out of 100
    const rawScore = questions.length > 0 ? (correctCount / questions.length) * 100 : 0;
    const finalScore = Math.round(rawScore);

    const now = new Date();
    const formattedDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    const timeStr = now.toLocaleTimeString('id-ID', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });

    // Finalize live session in active quiz storage
    if (activeSessionIdRef.current) {
      storageService.finishActiveQuiz(
        activeSessionIdRef.current,
        finalScore,
        correctCount,
        questions.length,
        elapsedSeconds,
        selectedDurationMinutes
      );
    } else {
      // Fallback direct score save
      const directResult: QuizResult = {
        id: 'score-' + Date.now(),
        userEmail: currentUser?.email || 'murid@gmail.com',
        studentName: currentUser?.fullName || currentUser?.nickname || 'Murid',
        studentNickname: currentUser?.nickname || 'Murid',
        level: activeLevel,
        score: finalScore,
        totalQuestions: questions.length,
        correctCount,
        durationUsedSeconds: elapsedSeconds,
        durationSelectedMinutes: selectedDurationMinutes,
        completedAt: formattedDate,
        date: now.toISOString().split('T')[0],
        completedAtTime: timeStr,
      };
      storageService.saveScore(directResult);
    }

    const res: QuizResult = {
      id: 'score-' + Date.now(),
      userEmail: currentUser?.email || 'murid@gmail.com',
      studentName: currentUser?.fullName || currentUser?.nickname || 'Murid',
      studentNickname: currentUser?.nickname || 'Murid',
      level: activeLevel,
      score: finalScore,
      totalQuestions: questions.length,
      correctCount,
      durationUsedSeconds: elapsedSeconds,
      durationSelectedMinutes: selectedDurationMinutes,
      completedAt: formattedDate,
      date: now.toISOString().split('T')[0],
      completedAtTime: timeStr,
    };

    setFinalResult(res);
    setShowConfirmSubmit(false);
    setQuizStep('result');

    // If score >= 90, trigger blooming cherry blossom storm
    if (finalScore >= 90) {
      onScoreCelebration();
    }
  };

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${String(mins).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const formatDurationUsed = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m} menit ${s} detik`;
  };

  // =========================================================================
  // SCENARIO 1: SESI KUIS DIKUNCI UNTUK MURID KETIKA BELUM DIMULAI OLEH MASTER
  // =========================================================================
  if (!isMasterUser && !quizControl.isActive) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12 text-center animate-in fade-in duration-300">
        <div className="bg-[#fffdfa] border-2 border-[#ebdccb] rounded-3xl p-8 sm:p-10 shadow-lg relative overflow-hidden">
          {/* Lock Icon & Red Status Dot */}
          <div className="relative w-20 h-20 mx-auto mb-5">
            <div className="w-20 h-20 rounded-full bg-rose-50 border-2 border-rose-200 text-rose-600 flex items-center justify-center">
              <Lock className="w-10 h-10" />
            </div>
            <span className="absolute top-0 right-0 w-6 h-6 rounded-full bg-rose-500 border-2 border-white ring-2 ring-rose-300 flex items-center justify-center text-white text-[10px] font-bold">
              🔴
            </span>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-rose-100 text-rose-800 rounded-full text-xs font-bold mb-3 border border-rose-200">
            <span className="w-2 h-2 rounded-full bg-rose-500" />
            <span>Status: Sesi Kuis Belum Dimulai</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#881337] font-japanese mb-3">
            Akses Kuis Sedang Ditutup
          </h2>

          <p className="text-xs sm:text-sm text-[#6e533d] leading-relaxed max-w-md mx-auto mb-6">
            Murid hanya dapat membuka akses dan mengerjakan kuis setelah <strong>Sensei Sari (Akun Master)</strong> menekan tombol <strong>Mulai Sesi Kuis</strong>.
            <br />
            <span className="text-[#a88a70] text-xs mt-2 block">
              Logo bulat di samping tulisan kuis akan otomatis berubah menjadi <strong>🟢 Hijau</strong> saat sesi kuis telah dibuka.
            </span>
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={onNavigateHome}
              className="w-full sm:w-auto px-6 py-3 bg-[#881337] hover:bg-[#70102d] text-white font-bold text-xs sm:text-sm rounded-xl transition-all shadow-xs"
            >
              Kembali ke Beranda
            </button>
            <button
              onClick={() => window.location.reload()}
              className="w-full sm:w-auto px-6 py-3 bg-white hover:bg-[#fff7ee] text-[#735338] border border-[#ebdccb] font-bold text-xs sm:text-sm rounded-xl transition-all shadow-2xs"
            >
              Cek Status Kuis Terbaru
            </button>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // SCENARIO 2: RESULT SCREEN (SELESAI MENGERJAKAN KUIS)
  // =========================================================================
  if (quizStep === 'result' && finalResult) {
    const isPass = finalResult.score >= 70;
    
    // Score Color Scheme based on user instruction:
    // 0 - 50: Hitam
    // 51 - 70: Merah
    // 71 - 100: Hijau
    let scoreColorClass = 'text-black';
    if (finalResult.score >= 71) {
      scoreColorClass = 'text-emerald-600';
    } else if (finalResult.score >= 51) {
      scoreColorClass = 'text-red-600';
    } else {
      scoreColorClass = 'text-black';
    }

    return (
      <div className="max-w-2xl mx-auto px-4 py-8 animate-in fade-in zoom-in duration-300">
        <div className="bg-[#fffdfa] border-2 border-[#ebdccb] rounded-3xl p-6 sm:p-8 shadow-xl text-center">
          <div className="text-4xl sm:text-5xl mb-3">
            {finalResult.score >= 90 ? '🏆🌸' : isPass ? '🎉' : '📖'}
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#881337] font-japanese mb-1">
            {finalResult.score >= 90 
              ? 'Luar Biasa Sempurna!' 
              : isPass 
              ? 'Selamat, Kamu Lulus!' 
              : 'Terus Semangat Belajar!'}
          </h2>
          <p className="text-xs text-[#735338] mb-6">
            Hasil kuis resmi JLPT {finalResult.level} telah otomatis tercatat secara live di sistem.
          </p>

          {/* Big Score Badge with requested color rules */}
          <div className="bg-[#fbf4ea] border-2 border-[#eedac5] rounded-3xl p-6 max-w-sm mx-auto mb-6 shadow-xs">
            <div className="text-xs font-bold text-[#8c6b4b] uppercase tracking-wider mb-1">
              NILAI AKHIR KAMU
            </div>
            <div className={`text-6xl sm:text-7xl font-black font-japanese tracking-tight ${scoreColorClass}`}>
              {finalResult.score}
            </div>
            <div className="text-xs font-bold text-[#735338] mt-2">
              Benar <span className="text-[#881337]">{finalResult.correctCount}</span> dari {finalResult.totalQuestions} soal ({formatDurationUsed(finalResult.durationUsedSeconds)})
            </div>
          </div>

          {/* Summary Breakdown */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 max-w-md mx-auto text-left text-xs mb-6">
            <div className="p-3 bg-white border border-[#ebdccb] rounded-xl">
              <span className="text-[#a88a70] block text-[10px]">Tingkatan</span>
              <span className="font-bold text-[#881337]">JLPT {finalResult.level}</span>
            </div>
            <div className="p-3 bg-white border border-[#ebdccb] rounded-xl">
              <span className="text-[#a88a70] block text-[10px]">Waktu Dipakai</span>
              <span className="font-bold text-[#3d2a1b]">{formatDurationUsed(finalResult.durationUsedSeconds)}</span>
            </div>
            <div className="p-3 bg-white border border-[#ebdccb] rounded-xl col-span-2 sm:col-span-1">
              <span className="text-[#a88a70] block text-[10px]">Tanggal & Jam</span>
              <span className="font-bold text-[#3d2a1b]">{finalResult.completedAtTime || finalResult.completedAt.split(' ')[1] || 'Selesai'}</span>
            </div>
          </div>

          {/* Review Questions & Answers */}
          <div className="text-left mt-8 border-t border-[#ebdccb] pt-6">
            <h3 className="text-base font-bold text-[#881337] mb-4 flex items-center gap-2 font-japanese">
              <span>📋</span>
              <span>Pembahasan Soal Kuis:</span>
            </h3>

            <div className="space-y-4 max-h-96 overflow-y-auto pr-1">
              {questions.map((q, idx) => {
                const userAns = userAnswers[idx];
                const isCorrect = userAns === q.correctAnswerIndex;
                return (
                  <div 
                    key={q.id || idx}
                    className={`p-4 rounded-2xl border text-xs leading-relaxed ${
                      isCorrect 
                        ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950' 
                        : 'bg-red-50/70 border-red-200 text-red-950'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 font-bold mb-2">
                      <span>No. {idx + 1}: {q.question}</span>
                      {isCorrect ? (
                        <span className="px-2 py-0.5 bg-emerald-200 text-emerald-900 rounded-md shrink-0 font-extrabold text-[10px]">
                          ✓ Benar
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 bg-red-200 text-red-900 rounded-md shrink-0 font-extrabold text-[10px]">
                          ✗ Salah
                        </span>
                      )}
                    </div>
                    
                    <div className="text-[11px] mb-1">
                      <strong>Jawaban Kamu:</strong> {userAns !== undefined ? q.options[userAns] : 'Tidak dijawab'}
                    </div>
                    <div className="text-[11px] mb-2 font-semibold text-emerald-800">
                      <strong>Kunci Jawaban:</strong> {q.options[q.correctAnswerIndex]}
                    </div>

                    <div className="p-2.5 bg-white/80 rounded-xl border border-[#ebdccb]/60 text-[11px] text-[#553b26]">
                      💡 <strong>Penjelasan:</strong> {q.explanation}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => {
                setQuizStep('setup');
                setFinalResult(null);
              }}
              className="w-full sm:w-auto px-6 py-3 bg-[#881337] hover:bg-[#70102d] text-white font-bold text-xs sm:text-sm rounded-xl transition-all shadow-xs flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Ulangi Kuis</span>
            </button>

            <button
              onClick={onNavigateHome}
              className="w-full sm:w-auto px-6 py-3 bg-white hover:bg-[#fff7ee] text-[#735338] border border-[#ebdccb] font-bold text-xs sm:text-sm rounded-xl transition-all shadow-2xs"
            >
              Kembali ke Beranda
            </button>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // SCENARIO 3: RUNNING QUIZ (SEDANG DIKERJAKAN SECARA LIVE)
  // =========================================================================
  if (quizStep === 'running') {
    const currentQ = questions[currentQuestionIndex];
    const isLastQuestion = currentQuestionIndex === questions.length - 1;
    const answeredCount = Object.keys(userAnswers).length;

    return (
      <div className="max-w-3xl mx-auto px-4 py-6 sm:py-8">
        {/* Top Floating Quiz Header */}
        <div className="bg-[#fffdfa] border-2 border-[#ebdccb] rounded-2xl p-4 mb-6 shadow-sm flex items-center justify-between gap-3">
          <div>
            <div className="text-[11px] font-bold text-[#881337] uppercase flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              <span>Kuis JLPT {activeLevel} (Sedang Dikerjakan)</span>
            </div>
            <div className="text-xs text-[#735338] font-medium mt-0.5">
              Soal {currentQuestionIndex + 1} dari {questions.length} ({answeredCount} terjawab)
            </div>
          </div>

          {/* Real-Time Countdown Timer */}
          <div className="flex items-center gap-2 px-3.5 py-1.5 bg-[#fae8eb] border border-[#fbcfe8] rounded-xl text-[#881337] font-mono font-bold text-sm sm:text-base shrink-0 shadow-2xs">
            <Clock className="w-4 h-4 animate-spin-slow" />
            <span>{formatTime(timeRemainingSeconds)}</span>
          </div>
        </div>

        {/* Question Card */}
        {currentQ && (
          <div className="bg-[#fffdfa] border-2 border-[#ebdccb] rounded-3xl p-6 sm:p-8 shadow-md mb-6">
            <div className="text-xs font-bold text-[#a88a70] uppercase mb-2">
              Pertanyaan #{currentQuestionIndex + 1} {currentQ.topic ? `· ${currentQ.topic}` : ''}
            </div>

            <h3 className="text-lg sm:text-xl font-bold text-[#2c1d11] font-japanese leading-relaxed mb-6">
              {currentQ.question}
            </h3>

            {/* Multiple Choice Options */}
            <div className="space-y-3">
              {currentQ.options.map((opt, optIdx) => {
                const isSelected = userAnswers[currentQuestionIndex] === optIdx;
                const optLetter = String.fromCharCode(65 + optIdx); // A, B, C, D
                return (
                  <button
                    key={optIdx}
                    onClick={() => {
                      setUserAnswers({
                        ...userAnswers,
                        [currentQuestionIndex]: optIdx,
                      });
                    }}
                    className={`w-full p-4 text-left rounded-2xl border-2 transition-all flex items-center gap-3 text-xs sm:text-sm font-medium ${
                      isSelected
                        ? 'bg-[#fae8eb] border-[#881337] text-[#881337] font-bold shadow-xs'
                        : 'bg-white border-[#ebdccb] hover:border-[#881337] text-[#3d2a1b]'
                    }`}
                  >
                    <span className={`w-7 h-7 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${
                      isSelected
                        ? 'bg-[#881337] text-white'
                        : 'bg-[#f5ede1] text-[#735338]'
                    }`}>
                      {optLetter}
                    </span>
                    <span className="flex-1 font-japanese">{opt}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Navigation Buttons: Prev, Next, Selesaikan */}
        <div className="flex items-center justify-between gap-3">
          <button
            onClick={() => setCurrentQuestionIndex(prev => Math.max(0, prev - 1))}
            disabled={currentQuestionIndex === 0}
            className={`px-4 py-3 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border ${
              currentQuestionIndex === 0
                ? 'bg-stone-100 text-stone-400 border-stone-200 cursor-not-allowed'
                : 'bg-white hover:bg-[#fff7ee] text-[#553b26] border-[#dec7b0] shadow-xs'
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Sebelumnya</span>
          </button>

          {isLastQuestion ? (
            <button
              onClick={() => setShowConfirmSubmit(true)}
              className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition-all flex items-center gap-2 active:scale-95"
            >
              <span>Selesaikan & Kumpulkan Kuis</span>
              <CheckCircle2 className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={() => setCurrentQuestionIndex(prev => Math.min(questions.length - 1, prev + 1))}
              className="px-6 py-3 bg-[#881337] hover:bg-[#70102d] text-white font-bold text-xs sm:text-sm rounded-xl shadow-xs transition-all flex items-center gap-1.5 active:scale-95"
            >
              <span>Berikutnya</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Confirmation Modal to Submit */}
        {showConfirmSubmit && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
            <div className="w-full max-w-md bg-[#fffdfa] border-2 border-[#ebdccb] rounded-3xl p-6 shadow-2xl text-center">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-3">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-[#881337] font-japanese mb-1">
                Kumpulkan Jawaban Kuis?
              </h4>
              <p className="text-xs text-[#735338] mb-4">
                Kamu telah menjawab <strong>{answeredCount}</strong> dari {questions.length} soal. Nilai akhir akan langsung dihitung dan disimpan secara live.
              </p>
              <div className="flex items-center gap-2.5">
                <button
                  onClick={() => setShowConfirmSubmit(false)}
                  className="flex-1 py-2.5 bg-stone-100 text-[#553b26] font-bold text-xs rounded-xl"
                >
                  Periksa Lagi
                </button>
                <button
                  onClick={() => handleCompleteQuiz(false)}
                  className="flex-1 py-2.5 bg-[#881337] text-white font-bold text-xs rounded-xl shadow-xs"
                >
                  Ya, Kumpulkan Sekarang
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // =========================================================================
  // SCENARIO 4: SETUP SCREEN (PERSIAPAN MEMULAI KUIS)
  // =========================================================================
  return (
    <div className="max-w-3xl mx-auto px-4 py-6 sm:py-8">
      {/* Header with Title, Status Dot & Master Session Button */}
      <div className="bg-[#fffdfa] border-2 border-[#ebdccb] rounded-3xl p-6 sm:p-8 shadow-md mb-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-5 border-b border-[#f2e6d6] pb-5">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-[#881337] mb-1">
              <span>UJIAN RESMI SIMULASI JLPT</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#881337] font-japanese flex items-center gap-2.5">
              <span>Simulasi Kuis JLPT {activeLevel}</span>
              {/* Logo Bulat Hijau / Merah Tepat di Sebelah Tulisan Kuis */}
              <span 
                className={`w-3.5 h-3.5 rounded-full inline-block ring-2 transition-all ${
                  quizControl.isActive 
                    ? 'bg-emerald-500 ring-emerald-300 animate-pulse' 
                    : 'bg-rose-500 ring-rose-300'
                }`}
                title={quizControl.isActive ? 'Sesi Kuis Sedang Dibuka (Hijau)' : 'Sesi Kuis Belum Dibuka (Merah)'}
              />
            </h2>
          </div>

          {/* Master Only: Tombol Mulai / Akhiri Kuis */}
          {isMasterUser && (
            <div className="flex items-center gap-2 bg-[#f5ede1] p-2 rounded-2xl">
              <span className="text-xs font-bold text-[#881337]">Master:</span>
              <button
                onClick={handleToggleMasterQuizSession}
                className={`px-3.5 py-1.5 rounded-xl font-bold text-xs text-white transition-all shadow-xs flex items-center gap-1.5 ${
                  quizControl.isActive 
                    ? 'bg-rose-600 hover:bg-rose-700' 
                    : 'bg-emerald-600 hover:bg-emerald-700'
                }`}
              >
                {quizControl.isActive ? (
                  <>
                    <Square className="w-3.5 h-3.5 fill-white" />
                    <span>Akhiri Sesi</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 fill-white" />
                    <span>Buka Sesi Kuis</span>
                  </>
                )}
              </button>
            </div>
          )}
        </div>

        {/* Level Switcher */}
        <div className="mb-6">
          <label className="block text-xs font-bold text-[#735338] mb-2">
            Pilih Tingkatan Level JLPT:
          </label>
          <div className="grid grid-cols-4 gap-2">
            {(['N5', 'N4', 'N3', 'N2'] as JLPTLevel[]).map((lvl) => (
              <button
                key={lvl}
                onClick={() => setActiveLevel(lvl)}
                className={`py-3 rounded-2xl font-bold text-xs sm:text-sm transition-all border ${
                  activeLevel === lvl
                    ? 'bg-[#881337] text-white border-[#881337] shadow-xs'
                    : 'bg-white hover:bg-[#fff7ee] text-[#624734] border-[#ebdccb]'
                }`}
              >
                {lvl}
              </button>
            ))}
          </div>
        </div>

        {/* Duration Selection */}
        <div className="mb-6">
          <label className="block text-xs font-bold text-[#735338] mb-2">
            Pilih Durasi Waktu Pengerjaan:
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {[15, 30, 45, 60].map((mins) => (
              <button
                key={mins}
                onClick={() => setSelectedDurationMinutes(mins)}
                className={`py-2.5 rounded-xl font-bold text-xs transition-all border ${
                  selectedDurationMinutes === mins
                    ? 'bg-[#fae8eb] text-[#881337] border-[#881337]'
                    : 'bg-white text-[#735338] border-[#ebdccb] hover:border-[#881337]'
                }`}
              >
                ⏱ {mins} Menit
              </button>
            ))}
          </div>
        </div>

        {/* Start Quiz Action */}
        <div className="text-center pt-2">
          {!currentUser ? (
            <div className="p-4 bg-amber-50/90 border border-amber-200 rounded-2xl max-w-md mx-auto mb-3 text-center">
              <p className="text-xs text-amber-950 font-bold mb-2">
                🔒 Pengerjaan kuis anonim tidak diizinkan. Silakan masuk atau daftar akun resmi Anda terlebih dahulu.
              </p>
              <button
                onClick={onOpenAuth}
                className="w-full py-3 px-6 bg-[#881337] hover:bg-[#70102d] text-white font-bold text-xs sm:text-sm rounded-xl shadow-xs transition-all flex items-center justify-center gap-2"
              >
                <span>Masuk / Daftar Akun Murid Resmi</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={handleStartQuiz}
              className="w-full sm:w-auto px-8 py-4 bg-[#881337] hover:bg-[#70102d] text-white font-extrabold text-sm sm:text-base rounded-2xl shadow-md transition-all active:scale-95 flex items-center justify-center gap-2 mx-auto"
            >
              <span>Mulai Mengerjakan Kuis Sekarang</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          )}
          <p className="text-[11px] text-[#a88a70] mt-3">
            🌸 50 soal pilihan ganda standar kurikulum resmi dengan pembahasan lengkap.
          </p>
        </div>
      </div>
    </div>
  );
};
