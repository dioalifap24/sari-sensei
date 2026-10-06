import React, { useState, useEffect } from 'react';
import { JLPTLevel, User, QuizControlState, DailyTask } from '../types';
import { storageService } from '../services/storageService';
import { BookOpen, FileQuestion, Layers, Award, Users, ChevronRight, Shield, Crown, FolderOpen, CheckCircle2, Clock, Plus } from 'lucide-react';
import { senseiSariMascot, sakuraBranchCorner, japaneseCloudsOrnament } from '../assets';
import { DailyTasksFolderModal } from './DailyTasksFolderModal';

interface HomeViewProps {
  activeLevel: JLPTLevel;
  setActiveLevel: (lvl: JLPTLevel) => void;
  onNavigate: (tab: string) => void;
  onOpenAllScores: () => void;
  currentUser?: User | null;
}

export const HomeView: React.FC<HomeViewProps> = ({
  activeLevel,
  setActiveLevel,
  onNavigate,
  onOpenAllScores,
  currentUser,
}) => {
  const [quizControl, setQuizControl] = useState<QuizControlState>({ isActive: false });
  const [dailyTasks, setDailyTasks] = useState<DailyTask[]>(() => storageService.getDailyTasks());
  const [isDailyTasksFolderOpen, setIsDailyTasksFolderOpen] = useState<boolean>(false);
  const [nowMs, setNowMs] = useState<number>(() => Date.now());

  useEffect(() => {
    const refreshHomeData = () => {
      setQuizControl(storageService.getQuizControlState());
      setDailyTasks(storageService.getDailyTasks());
    };
    refreshHomeData();
    storageService.syncWithServer().then(refreshHomeData);

    const clockInterval = window.setInterval(() => {
      setNowMs(Date.now());
    }, 1000);

    window.addEventListener('quiz_control_changed', refreshHomeData);
    window.addEventListener('daily_tasks_updated', refreshHomeData);
    window.addEventListener('storage', refreshHomeData);

    return () => {
      clearInterval(clockInterval);
      window.removeEventListener('quiz_control_changed', refreshHomeData);
      window.removeEventListener('daily_tasks_updated', refreshHomeData);
      window.removeEventListener('storage', refreshHomeData);
    };
  }, []);

  const isMasterUser = storageService.isMaster(currentUser);
  const activeDailyTasks = dailyTasks.filter(t => t.isActive);
  const myEmail = (currentUser?.email || '').toLowerCase();
  const myCompletedCount = activeDailyTasks.filter(t => {
    const comp = (t.completions || []).find(c => c.studentEmail.toLowerCase() === myEmail);
    if (!comp) return false;
    if (t.worksheetQuestions && t.worksheetQuestions.length > 0) {
      return comp.isCompleted === true;
    }
    return comp.isCompleted !== false;
  }).length;
  const myPendingCount = Math.max(0, activeDailyTasks.length - myCompletedCount);
  const latestActiveTask = activeDailyTasks[0] || null;
  const latestDeadlineInfo = latestActiveTask
    ? storageService.getTaskDeadlineInfo(latestActiveTask, nowMs)
    : null;

  // Hitung jumlah murid yang tertandai mencoba screenshot / terjemahan otomatis untuk akun Master
  const flaggedDailyTaskStudentsCount = (() => {
    if (!isMasterUser) return 0;
    const presenceMap = storageService.getOnlinePresenceMap();
    const flaggedEmails = new Set<string>();
    for (const [em, pres] of Object.entries(presenceMap)) {
      if ((pres?.screenshotAttempts || 0) > 0 || (pres?.aiTranslateAttempts || 0) > 0) {
        flaggedEmails.add(em.toLowerCase());
      }
    }
    for (const t of dailyTasks) {
      for (const c of t.completions || []) {
        if ((c?.screenshotAttempts || 0) > 0 || (c?.aiTranslateAttempts || 0) > 0) {
          flaggedEmails.add(c.studentEmail.toLowerCase());
        }
      }
    }
    return flaggedEmails.size;
  })();

  useEffect(() => {
    if (!currentUser || isMasterUser) return;
    const autoSubmitted = storageService.autoSubmitExpiredTasksForStudent(currentUser, nowMs);
    if (autoSubmitted.length > 0) {
      setDailyTasks(storageService.getDailyTasks());
    }
  }, [nowMs, currentUser, isMasterUser]);

  const levels: { id: JLPTLevel; label: string; desc: string }[] = [
    { id: 'N5', label: 'N5', desc: 'Pemula Dasar (Hiragana, Katakana & 100 Kanji)' },
    { id: 'N4', label: 'N4', desc: 'Tingkat Dasar Lanjutan (Percakapan & 150 Kanji Tambahan)' },
    { id: 'N3', label: 'N3', desc: 'Tingkat Menengah (Pola Kalimat Sehari-hari & 300 Kanji)' },
    { id: 'N2', label: 'N2', desc: 'Tingkat Mahir / Bisnis (Bacaan Berita, Keigo & 350 Kanji)' },
  ];

  return (
    <div className="relative overflow-hidden py-4 sm:py-8">
      {/* Background Decorative Cloud & Sakura Corner Branch */}
      <div 
        className="absolute top-0 right-0 w-44 sm:w-64 md:w-80 h-44 sm:h-64 md:h-80 pointer-events-none opacity-25 -mr-8 -mt-8 select-none z-0"
        aria-hidden="true"
      >
        <img 
          src={sakuraBranchCorner} 
          alt="Sakura Branch"
          className="w-full h-full object-contain drop-shadow-sm mix-blend-multiply"
          loading="eager"
          onError={(e) => {
            const el = e.currentTarget;
            if (el.src !== '/assets/images/sakura_branch_corner_1790796313743.jpg') {
              el.src = '/assets/images/sakura_branch_corner_1790796313743.jpg';
            }
          }}
        />
      </div>

      <div 
        className="absolute bottom-0 left-0 w-48 sm:w-72 h-32 sm:h-44 pointer-events-none opacity-15 -ml-8 -mb-4 select-none z-0"
        aria-hidden="true"
      >
        <img 
          src={japaneseCloudsOrnament} 
          alt="Japanese Cloud Ornament"
          className="w-full h-full object-cover mix-blend-multiply"
          loading="eager"
          onError={(e) => {
            const el = e.currentTarget;
            if (el.src !== '/assets/images/japanese_clouds_ornament_1790796324830.jpg') {
              el.src = '/assets/images/japanese_clouds_ornament_1790796324830.jpg';
            }
          }}
        />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4">
        {/* Hero Section */}
        <div className="text-center pt-2 pb-6 sm:pb-8">
          {/* Sari Sensei Portrait Avatar */}
          <div className="flex justify-center mb-4">
            <div className="relative p-1 bg-gradient-to-tr from-[#d4af37] via-[#fbcfe8] to-[#881337] rounded-full shadow-md">
              <img 
                src={senseiSariMascot} 
                alt="Sari Sensei Avatar"
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover border-2 border-[#fffdfa]"
                loading="eager"
                onError={(e) => {
                  const el = e.currentTarget;
                  if (el.src !== '/assets/images/sensei_sari_mascot_1790796337196.jpg') {
                    el.src = '/assets/images/sensei_sari_mascot_1790796337196.jpg';
                  }
                }}
              />
              <span className="absolute bottom-0 right-0 bg-[#881337] text-white p-1 rounded-full text-xs shadow-xs" title="Sari Sensei">
                🌸
              </span>
            </div>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#faebd7]/70 border border-[#e3ceba] rounded-full text-xs font-semibold text-[#881337] mb-3">
            <span>🌸</span>
            <span>Panduan Belajar Bahasa Jepang Hangat</span>
            <span>🌸</span>
          </div>

          {/* Big Header */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#881337] tracking-tight font-japanese text-balance mb-4">
            PORTAL KELAS SARI SENSEI
          </h1>

          {/* Encouragement Text */}
          <div className="max-w-xl mx-auto bg-[#fffdfa]/85 border border-[#ebdccb] rounded-2xl p-4 sm:p-5 shadow-xs mb-6">
            <p className="text-sm sm:text-base text-[#463325] leading-relaxed">
              Pilih cara belajarmu! Setiap langkah yang kamu ambil adalah kemajuan berharga. Semangat terus, kamu pasti bisa! ✨🌸
            </p>
          </div>

          {/* Level Selector */}
          <div className="bg-[#f7efe3] border border-[#e5d3c0] rounded-2xl p-3 sm:p-4 max-w-xl mx-auto shadow-xs mb-8">
            <div className="text-xs font-bold text-[#881337] uppercase tracking-wider mb-2.5 flex items-center justify-center gap-1.5">
              <span>PILIH TINGKATAN JLPT</span>
              <span className="text-[11px] font-normal text-[#755943]">(Disimpan untuk semua fitur)</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {levels.map((lvl) => {
                const isSelected = activeLevel === lvl.id;
                return (
                  <button
                    key={lvl.id}
                    onClick={() => setActiveLevel(lvl.id)}
                    className={`py-2.5 px-3 rounded-xl font-bold text-sm sm:text-base transition-all flex items-center justify-center gap-2 border ${
                      isSelected
                        ? 'bg-[#881337] text-white border-[#881337] shadow-sm ring-2 ring-[#881337]/20 scale-[1.02]'
                        : 'bg-white hover:bg-[#fff9f3] text-[#553b26] border-[#dec7b0] hover:border-[#881337]/40'
                    }`}
                  >
                    <span className="text-sm" aria-hidden="true">
                      {isSelected ? '⦿' : '∘'}
                    </span>
                    <span>{lvl.label}</span>
                  </button>
                );
              })}
            </div>

            <div className="mt-2.5 text-center text-xs text-[#6e533d]">
              Target aktif: <span className="font-bold text-[#881337]">{levels.find(l => l.id === activeLevel)?.desc}</span>
            </div>
          </div>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4 mb-10">
          {/* 0. Folder Tugas Harian Sensei Card */}
          <button
            onClick={() => setIsDailyTasksFolderOpen(true)}
            className="group p-5 bg-[#fffdfa] hover:bg-[#fbf4eb] border-2 border-[#dfc7aa] hover:border-[#881337] rounded-2xl text-left shadow-xs hover:shadow-md transition-all flex flex-col justify-between cursor-pointer"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="p-3 bg-amber-100 text-[#881337] rounded-xl group-hover:scale-105 transition-transform">
                <FolderOpen className="w-6 h-6" />
              </div>
              <div className="flex items-center gap-1.5">
                <span
                  className={`w-2.5 h-2.5 rounded-full ring-2 ${
                    activeDailyTasks.length > 0
                      ? 'bg-emerald-500 ring-emerald-300 animate-pulse'
                      : 'bg-stone-400 ring-stone-200'
                  }`}
                />
                <span
                  className={`text-[11px] font-bold px-2 py-0.5 rounded-md ${
                    activeDailyTasks.length > 0
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-stone-100 text-stone-700'
                  }`}
                >
                  {activeDailyTasks.length > 0
                    ? `${activeDailyTasks.length} Tugas Aktif`
                    : '0 Tugas Aktif'}
                </span>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-bold text-[#881337] font-japanese flex items-center gap-1.5">
                📁 Tugas Harian Sensei
              </h3>
              <p className="text-xs text-[#5e4735] mt-1 leading-relaxed">
                {activeDailyTasks.length > 0
                  ? isMasterUser
                    ? `Ada ${activeDailyTasks.length} tugas harian aktif. Klik untuk memantau pengumpulan murid atau menambah tugas.`
                    : `Ada ${activeDailyTasks.length} tugas harian dari Master Sensei! (${myCompletedCount} selesai, ${myPendingCount} belum).`
                  : 'Buka setiap saat untuk memantau apakah ada tugas harian dari Master Sensei atau belum.'}
              </p>
              {latestDeadlineInfo && (
                <div
                  className={`mt-2.5 px-2.5 py-1.5 rounded-xl border text-[11px] font-bold flex items-center justify-between gap-2 ${
                    latestDeadlineInfo.isTimerFinished
                      ? 'bg-rose-50 text-rose-800 border-rose-200'
                      : latestDeadlineInfo.isTimerRunning
                      ? latestDeadlineInfo.isUrgent
                        ? 'bg-amber-50 text-amber-900 border-amber-300'
                        : 'bg-emerald-50 text-emerald-900 border-emerald-300'
                      : 'bg-[#fdf8f0] text-[#881337] border-[#e5d3c0]'
                  }`}
                >
                  <span className="flex items-center gap-1 truncate">
                    <Clock className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">
                      {latestDeadlineInfo.isTimerRunning
                        ? `🟢 Hitung Mundur (${latestDeadlineInfo.durationLabel})`
                        : latestDeadlineInfo.isTimerFinished
                        ? `⏰ Waktu Selesai (${latestDeadlineInfo.durationLabel})`
                        : `⏱️ Durasi: ${latestDeadlineInfo.durationLabel}`}
                    </span>
                  </span>
                  <span className="font-mono tabular-nums font-extrabold shrink-0">
                    {latestDeadlineInfo.isTimerFinished
                      ? 'Otomatis Kumpul'
                      : `⏳ ${latestDeadlineInfo.formattedCountdown}`}
                  </span>
                </div>
              )}
              {isMasterUser && flaggedDailyTaskStudentsCount > 0 && (
                <div className="mt-2 px-2.5 py-1.5 rounded-xl bg-rose-600 text-white text-[11px] font-extrabold flex items-center justify-between gap-2 shadow-2xs">
                  <span>🚨 {flaggedDailyTaskStudentsCount} Murid Tertandai (Screenshot / AI)</span>
                  <span className="underline">Periksa</span>
                </div>
              )}
            </div>
            <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-[#881337] group-hover:translate-x-1 transition-transform">
              <span>Buka Folder Tugas Harian</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </div>
          </button>

          {/* 1. Materi */}
          <button
            onClick={() => onNavigate('materi')}
            className="group p-5 bg-[#fffdfa] hover:bg-[#fbf4eb] border border-[#ebdccb] hover:border-[#881337] rounded-2xl text-left shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="p-3 bg-[#fae8eb] text-[#881337] rounded-xl group-hover:scale-105 transition-transform">
                <BookOpen className="w-6 h-6" />
              </div>
              <span className="text-xs font-semibold px-2 py-0.5 bg-[#f5ede1] text-[#735338] rounded-md">
                {activeLevel}
              </span>
            </div>
            <div>
              <h3 className="text-lg font-bold text-[#881337] font-japanese flex items-center gap-1.5">
                📖 Materi
              </h3>
              <p className="text-xs text-[#5e4735] mt-1 leading-relaxed">
                Huruf Hiragana & Katakana, Kanji dasar, rumus tata bahasa berpenjelasan, dan kosakata tematik.
              </p>
            </div>
            <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-[#881337] group-hover:translate-x-1 transition-transform">
              <span>Buka Materi</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </div>
          </button>

          {/* 2. Kuis (Disertai status bulat Hijau/Merah) */}
          <button
            onClick={() => onNavigate('kuis')}
            className="group p-5 bg-[#fffdfa] hover:bg-[#fbf4eb] border border-[#ebdccb] hover:border-[#881337] rounded-2xl text-left shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="p-3 bg-[#fae8eb] text-[#881337] rounded-xl group-hover:scale-105 transition-transform">
                <FileQuestion className="w-6 h-6" />
              </div>
              <div className="flex items-center gap-1.5">
                {/* Status Dot */}
                <span 
                  className={`w-2.5 h-2.5 rounded-full ring-2 ${
                    quizControl.isActive 
                      ? 'bg-emerald-500 ring-emerald-300 animate-pulse' 
                      : 'bg-rose-500 ring-rose-300'
                  }`} 
                />
                <span className={`text-[11px] font-bold px-2 py-0.5 rounded-md ${
                  quizControl.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                }`}>
                  {quizControl.isActive ? 'Sesi Dibuka' : 'Sesi Ditutup'}
                </span>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-bold text-[#881337] font-japanese flex items-center gap-2">
                <span>📝 Kuis</span>
                <span 
                  className={`w-2.5 h-2.5 rounded-full inline-block ${
                    quizControl.isActive ? 'bg-emerald-500' : 'bg-rose-500'
                  }`} 
                />
              </h3>
              <p className="text-xs text-[#5e4735] mt-1 leading-relaxed">
                {quizControl.isActive 
                  ? 'Sesi kuis sedang dibuka oleh Sensei Sari! Kerjakan 50 soal simulasi resmi.'
                  : 'Sesi kuis sedang ditutup. Tunggu instruksi pembukaan sesi dari Sensei Sari.'}
              </p>
            </div>
            <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-[#881337] group-hover:translate-x-1 transition-transform">
              <span>{quizControl.isActive ? 'Mulai Kuis' : 'Lihat Status Kuis'}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </div>
          </button>

          {/* 3. Kartu Hafalan Kosakata (Mazii Dictionary 3.000+ Kosakata) */}
          <button
            onClick={() => onNavigate('vocab')}
            className="group p-5 bg-[#fffdfa] hover:bg-[#fbf4eb] border border-[#ebdccb] hover:border-[#881337] rounded-2xl text-left shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="p-3 bg-[#fae8eb] text-[#881337] rounded-xl group-hover:scale-105 transition-transform">
                <Layers className="w-6 h-6" />
              </div>
              <span className="text-xs font-semibold px-2 py-0.5 bg-[#fae8eb] text-[#881337] rounded-md font-bold border border-[#fbcfe8]">
                4.845 Kosakata
              </span>
            </div>
            <div>
              <h3 className="text-lg font-bold text-[#881337] font-japanese flex items-center gap-1.5">
                🃏 Kartu Hafalan Kosakata
              </h3>
              <p className="text-xs text-[#5e4735] mt-1 leading-relaxed">
                Hafalan 4.845 kosakata resmi bebas duplikat antar level (N5: 669, N4: 582, N3: 1.802, N2: 1.792). Sisi depan murni huruf Jepang.
              </p>
            </div>
            <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-[#881337] group-hover:translate-x-1 transition-transform">
              <span>Latih Kosakata</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </div>
          </button>

          {/* 4. Kartu Kanji */}
          <button
            onClick={() => onNavigate('kanji')}
            className="group p-5 bg-[#fffdfa] hover:bg-[#fbf4eb] border border-[#ebdccb] hover:border-[#881337] rounded-2xl text-left shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="p-3 bg-[#fae8eb] text-[#881337] rounded-xl group-hover:scale-105 transition-transform font-bold text-lg font-japanese">
                漢字
              </div>
              <span className="text-xs font-semibold px-2 py-0.5 bg-[#fae8eb] text-[#881337] rounded-md font-bold border border-[#fbcfe8]">
                900 Kanji
              </span>
            </div>
            <div>
              <h3 className="text-lg font-bold text-[#881337] font-japanese flex items-center gap-1.5">
                漢字 Kartu Hafalan Kanji
              </h3>
              <p className="text-xs text-[#5e4735] mt-1 leading-relaxed">
                Kartu hafalan 900 kanji resmi Sensei Sari (N5: 1–100, N4: 101–250, N3: 251–550, N2: 551–900) dengan bacaan On, Kun, Ejaan, Arti, dan Contoh Kata.
              </p>
            </div>
            <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-[#881337] group-hover:translate-x-1 transition-transform">
              <span>Hafal Kanji</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </div>
          </button>

          {/* 5. Laporan Pribadi */}
          <button
            onClick={() => onNavigate('laporan')}
            className="group p-5 bg-[#fffdfa] hover:bg-[#fbf4eb] border border-[#ebdccb] hover:border-[#881337] rounded-2xl text-left shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="p-3 bg-[#e8f3fa] text-[#0369a1] rounded-xl group-hover:scale-105 transition-transform">
                <Award className="w-6 h-6" />
              </div>
              <span className="text-xs font-semibold px-2 py-0.5 bg-[#f5ede1] text-[#735338] rounded-md">
                Riwayat Murid
              </span>
            </div>
            <div>
              <h3 className="text-lg font-bold text-[#881337] font-japanese flex items-center gap-1.5">
                📊 Laporan Pribadi
              </h3>
              <p className="text-xs text-[#5e4735] mt-1 leading-relaxed">
                Lihat grafik perkembangan nilai, tanggal pengerjaan kuis, dan durasi belajar diri sendiri.
              </p>
            </div>
            <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-[#881337] group-hover:translate-x-1 transition-transform">
              <span>Buka Riwayat</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </div>
          </button>

          {/* 6. DAFTAR NILAI SEMUA MURID: HANYA MUNCUL KETIKA MASUK MENGGUNAKAN AKUN MASTER */}
          {isMasterUser && (
            <button
              onClick={() => onNavigate('master_management')}
              className="group p-5 bg-gradient-to-br from-[#fffdfa] to-[#fef3c7] hover:to-[#fde68a] border-2 border-amber-300 hover:border-amber-500 rounded-2xl text-left shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="p-3 bg-amber-100 text-amber-900 rounded-xl group-hover:scale-105 transition-transform">
                  <Shield className="w-6 h-6 text-amber-700" />
                </div>
                <span className="text-xs font-extrabold px-2.5 py-0.5 bg-amber-200 text-amber-950 rounded-md border border-amber-300">
                  Khusus Master
                </span>
              </div>
              <div>
                <h3 className="text-lg font-bold text-[#881337] font-japanese flex items-center gap-1.5">
                  📋 Nilai Semua Murid
                </h3>
                <p className="text-xs text-[#5e4735] mt-1 leading-relaxed">
                  Pantau pengerjaan kuis murid secara live, buka/kunci sesi kuis, dan kelola nilai di Halaman Master.
                </p>
              </div>
              <div className="mt-4 flex items-center gap-1 text-xs font-extrabold text-amber-900 group-hover:translate-x-1 transition-transform">
                <span>Buka Panel Master</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </div>
            </button>
          )}
        </div>
      </div>

      {/* Modal Folder Tugas Harian Sensei */}
      <DailyTasksFolderModal
        isOpen={isDailyTasksFolderOpen}
        onClose={() => setIsDailyTasksFolderOpen(false)}
        currentUser={currentUser}
        activeLevel={activeLevel}
        onNavigateToFeature={(tab, targetLevel) => {
          if (targetLevel) {
            setActiveLevel(targetLevel);
          }
          onNavigate(tab);
        }}
      />
    </div>
  );
};
