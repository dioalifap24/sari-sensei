import React, { useState, useEffect } from 'react';
import { User, ActiveQuizRecord, QuizControlState, QuizResult, StudentPresenceInfo } from '../types';
import { storageService } from '../services/storageService';
import { Users, Trash2, RefreshCw, Play, Square, AlertTriangle, CheckCircle, Search, Shield, ShieldAlert, UserX, Clock, Calendar, Activity, RotateCcw, Trophy, KeyRound, Eye, EyeOff, Mail, UserPlus, Radio, BookOpen, ChevronLeft, ChevronRight } from 'lucide-react';
import { UchihaClanLogo } from './UchihaClanLogo';

interface MasterManagementViewProps {
  currentUser: User | null;
  onNavigateHome: () => void;
}

/**
 * Ornamen Latar Garis Kecepatan Manga (Shūchūsen / Speed Lines)
 * Murni garis tinta manga Jepang tanpa karakter apapun.
 */
const MangaSpeedLinesBg: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg
    viewBox="0 0 800 220"
    preserveAspectRatio="none"
    className={`pointer-events-none select-none absolute inset-0 w-full h-full opacity-[0.07] ${className}`}
    aria-hidden="true"
  >
    <g stroke="#111827" strokeWidth="1.5">
      <line x1="0" y1="0" x2="360" y2="110" />
      <line x1="0" y1="35" x2="340" y2="110" />
      <line x1="0" y1="75" x2="320" y2="110" />
      <line x1="0" y1="110" x2="310" y2="110" />
      <line x1="0" y1="145" x2="320" y2="110" />
      <line x1="0" y1="185" x2="340" y2="110" />
      <line x1="0" y1="220" x2="360" y2="110" />
      <line x1="800" y1="0" x2="440" y2="110" />
      <line x1="800" y1="35" x2="460" y2="110" />
      <line x1="800" y1="75" x2="480" y2="110" />
      <line x1="800" y1="110" x2="490" y2="110" />
      <line x1="800" y1="145" x2="480" y2="110" />
      <line x1="800" y1="185" x2="460" y2="110" />
      <line x1="800" y1="220" x2="440" y2="110" />
      <line x1="180" y1="0" x2="380" y2="95" />
      <line x1="620" y1="0" x2="420" y2="95" />
      <line x1="180" y1="220" x2="380" y2="125" />
      <line x1="620" y1="220" x2="420" y2="125" />
    </g>
  </svg>
);

/**
 * Tanda Sudut Tinta Panel Komik (Manga Koma Ink Corner Ticks)
 */
const MangaCornerTicks: React.FC = () => (
  <>
    <span className="pointer-events-none select-none absolute top-1 left-1 w-2.5 h-2.5 border-t-2 border-l-2 border-black z-20" aria-hidden="true" />
    <span className="pointer-events-none select-none absolute top-1 right-1 w-2.5 h-2.5 border-t-2 border-r-2 border-black z-20" aria-hidden="true" />
    <span className="pointer-events-none select-none absolute bottom-1 left-1 w-2.5 h-2.5 border-b-2 border-l-2 border-black z-20" aria-hidden="true" />
    <span className="pointer-events-none select-none absolute bottom-1 right-1 w-2.5 h-2.5 border-b-2 border-r-2 border-black z-20" aria-hidden="true" />
  </>
);

/**
 * Jalur Pemisah Antar Panel Komik ("Gutter" / コマ間ガター)
 * Memisahkan setiap bagian data agar terstruktur seperti panel komik terpisah.
 */
const MangaGutterSeparator: React.FC<{ label: string; jpLabel: string }> = ({ label, jpLabel }) => (
  <div className="manga-gutter-channel my-6 py-1.5 px-3 flex items-center justify-between gap-2 select-none" aria-hidden="true">
    <div className="flex items-center gap-2">
      <span className="inline-block w-3 h-1.5 bg-black" />
      <span className="font-mono font-black text-[10px] tracking-widest uppercase text-black bg-[#f1ebe0] px-2 py-0.5 border-2 border-black">
        {label}
      </span>
    </div>
    <div className="flex-1 border-t-2 border-dashed border-black/40 mx-2" />
    <div className="flex items-center gap-2">
      <span className="font-japanese font-black text-[10px] tracking-widest text-[#881337] bg-white px-2 py-0.5 border-2 border-black">
        {jpLabel}
      </span>
      <span className="inline-block w-3 h-1.5 bg-black" />
    </div>
  </div>
);

export const MasterManagementView: React.FC<MasterManagementViewProps> = ({ currentUser }) => {
  const [subTab, setSubTab] = useState<'all' | 'student_list' | 'live_scores'>('all');
  const [showRegisteredStudentsTable, setShowRegisteredStudentsTable] = useState<boolean>(true);
  const [pageTurnDirection, setPageTurnDirection] = useState<'next' | 'prev'>('next');
  const [pageTurnKey, setPageTurnKey] = useState<number>(0);
  const [komaFlipKey, setKomaFlipKey] = useState<number>(0);
  const [isTurningPage, setIsTurningPage] = useState<boolean>(false);

  const MANGA_TAB_ORDER: ('all' | 'student_list' | 'live_scores')[] = ['all', 'student_list', 'live_scores'];

  const handleMangaPageChange = (
    targetTab: 'all' | 'student_list' | 'live_scores',
    forcedDir?: 'next' | 'prev'
  ) => {
    if (targetTab === subTab && !forcedDir) {
      setKomaFlipKey((prev) => prev + 1);
      return;
    }
    const currIdx = MANGA_TAB_ORDER.indexOf(subTab);
    const nextIdx = MANGA_TAB_ORDER.indexOf(targetTab);
    const dir: 'next' | 'prev' =
      forcedDir || (nextIdx >= currIdx ? 'next' : 'prev');

    setPageTurnDirection(dir);
    setSubTab(targetTab);
    if (targetTab === 'student_list') {
      setShowRegisteredStudentsTable(true);
    }
    setPageTurnKey((prev) => prev + 1);
    setIsTurningPage(true);
    window.setTimeout(() => {
      setIsTurningPage(false);
    }, 520);
  };

  const handleStepMangaPage = (step: 1 | -1) => {
    const currIdx = MANGA_TAB_ORDER.indexOf(subTab);
    const nextIdx = (currIdx + step + MANGA_TAB_ORDER.length) % MANGA_TAB_ORDER.length;
    handleMangaPageChange(MANGA_TAB_ORDER[nextIdx], step > 0 ? 'next' : 'prev');
  };

  const currentMangaPageMeta =
    subTab === 'all'
      ? {
          folio: '頁 01 — 02 (FULL MANGA SPREAD)',
          jpChapter: '【第壱話】師範の管理室・全体監視',
          sfx: 'ペラッ!! (Hal. 01-02)',
        }
      : subTab === 'student_list'
      ? {
          folio: '頁 03 — 04 (CHAPTER: DAFTAR MURID)',
          jpChapter: '【第弐話】生徒名簿・最終学習時刻録',
          sfx: 'バサッ!! (Hal. 03-04)',
        }
      : {
          folio: '頁 05 — 06 (CHAPTER: KUIS & RANKING LIVE)',
          jpChapter: '【第参話】試験実況・順位決定戦',
          sfx: 'シュッ!! (Hal. 05-06)',
        };
  
  // Live records, presence map, and students data
  const [activeRecords, setActiveRecords] = useState<ActiveQuizRecord[]>([]);
  const [studentsList, setStudentsList] = useState<User[]>([]);
  const [studentsCredentials, setStudentsCredentials] = useState<{ user: User; password: string }[]>([]);
  const [presenceMap, setPresenceMap] = useState<Record<string, StudentPresenceInfo>>({});
  const [quizControl, setQuizControl] = useState<QuizControlState>({ isActive: false });
  const [allScores, setAllScores] = useState<QuizResult[]>([]);
  
  // Search & Filter
  const [searchQuery, setSearchQuery] = useState('');
  const [filterLevel, setFilterLevel] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'in_progress' | 'completed'>('all');
  const [filterPresence, setFilterPresence] = useState<'all' | 'online' | 'offline'>('all');
  
  // Student & Record Deletion / Reset Modals / Password Management
  const [studentToDelete, setStudentToDelete] = useState<User | null>(null);
  const [recordToDelete, setRecordToDelete] = useState<ActiveQuizRecord | null>(null);
  const [showResetRankingModal, setShowResetRankingModal] = useState(false);
  const [visiblePasswords, setVisiblePasswords] = useState<{ [email: string]: boolean }>({});
  const [studentToResetPassword, setStudentToResetPassword] = useState<{ user: User; currentPassword: string } | null>(null);
  const [studentDetailModal, setStudentDetailModal] = useState<User | null>(null);
  const [newPasswordInput, setNewPasswordInput] = useState('');
  const [notificationMsg, setNotificationMsg] = useState<string | null>(null);
  const [nowMs, setNowMs] = useState<number>(() => Date.now());

  // Add New Student Modal State (Master Direct Registration)
  const [showAddStudentModal, setShowAddStudentModal] = useState(false);
  const [newStuFullName, setNewStuFullName] = useState('');
  const [newStuNickname, setNewStuNickname] = useState('');
  const [newStuEmail, setNewStuEmail] = useState('');
  const [newStuPassword, setNewStuPassword] = useState('');
  const [addStudentError, setAddStudentError] = useState('');

  // Load all data from storageService
  const loadData = () => {
    setActiveRecords(storageService.getActiveQuizRecords());
    const creds = storageService.getAllStudentsWithCredentials();
    setStudentsCredentials(creds);
    setStudentsList(creds.map(c => c.user));
    setPresenceMap(storageService.getOnlinePresenceMap());
    setQuizControl(storageService.getQuizControlState());
    setAllScores(storageService.getAllScores());
  };

  const handleManualSyncAndReload = async () => {
    await storageService.syncWithServer();
    loadData();
    setNotificationMsg('Data daftar murid, aktivitas live, & nilai kuis berhasil disinkronkan! 🔄');
    setTimeout(() => setNotificationMsg(null), 3000);
  };

  const handleAddStudentByMaster = (e: React.FormEvent) => {
    e.preventDefault();
    setAddStudentError('');
    const res = storageService.register(newStuEmail, newStuPassword, newStuFullName, newStuNickname, false);
    if (res.success && res.user) {
      setShowAddStudentModal(false);
      setNewStuFullName('');
      setNewStuNickname('');
      setNewStuEmail('');
      setNewStuPassword('');
      loadData();
      setNotificationMsg(`Akun murid baru "${res.user.fullName}" (${res.user.email}) berhasil ditambahkan ke Daftar Murid! 🌸`);
      setTimeout(() => setNotificationMsg(null), 4000);
    } else {
      setAddStudentError(res.message);
    }
  };

  const togglePasswordVisibility = (email: string) => {
    setVisiblePasswords(prev => ({
      ...prev,
      [email]: !prev[email],
    }));
  };

  const handleSaveNewStudentPassword = () => {
    if (!studentToResetPassword) return;
    const cleanPass = newPasswordInput.trim();
    if (!cleanPass || cleanPass.length < 2) {
      setNotificationMsg('Kata sandi baru murid wajib minimal 2 karakter!');
      setTimeout(() => setNotificationMsg(null), 3000);
      return;
    }
    const res = storageService.updateStudentPassword(studentToResetPassword.user.email, cleanPass);
    if (res.success) {
      setNotificationMsg(`Kata sandi untuk ${studentToResetPassword.user.nickname || studentToResetPassword.user.fullName} berhasil diperbarui menjadi "${cleanPass}"! 🔑`);
      setStudentToResetPassword(null);
      setNewPasswordInput('');
      loadData();
    } else {
      setNotificationMsg(res.message);
    }
    setTimeout(() => setNotificationMsg(null), 4000);
  };

  useEffect(() => {
    storageService.syncWithServer().then(() => loadData());
    loadData();

    // Auto-refresh & server/cloud sync interval every 1.5 seconds for live tracking
    const intervalId = window.setInterval(() => {
      setNowMs(Date.now());
      storageService.syncWithServer().then(() => loadData());
    }, 1500);

    // Event listeners & SSE stream for immediate real-time storage updates
    const handleUpdate = () => {
      setNowMs(Date.now());
      loadData();
    };
    const unsubscribeSync =
      typeof storageService.subscribeSync === 'function'
        ? storageService.subscribeSync(handleUpdate)
        : () => {};

    window.addEventListener('active_quiz_updated', handleUpdate);
    window.addEventListener('student_data_updated', handleUpdate);
    window.addEventListener('quiz_control_changed', handleUpdate);
    window.addEventListener('scores_updated', handleUpdate);
    window.addEventListener('presence_updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);

    return () => {
      clearInterval(intervalId);
      unsubscribeSync();
      window.removeEventListener('active_quiz_updated', handleUpdate);
      window.removeEventListener('student_data_updated', handleUpdate);
      window.removeEventListener('quiz_control_changed', handleUpdate);
      window.removeEventListener('scores_updated', handleUpdate);
      window.removeEventListener('presence_updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  // Toggle Sesi Kuis
  const handleToggleQuizSession = () => {
    const newState = !quizControl.isActive;
    storageService.setQuizControlState(newState, currentUser || undefined);
    setQuizControl(storageService.getQuizControlState());
    
    if (newState) {
      setNotificationMsg('Sesi Kuis Berhasil DIBUKA! 🟢 Semua akun murid kini melihat "Sesi Kuis Dimulai" & dapat mengerjakan kuis.');
    } else {
      setNotificationMsg('Sesi Kuis Berhasil DITUTUP! 🔴 Akses kuis murid kini dikunci.');
    }
    setTimeout(() => setNotificationMsg(null), 4000);
  };

  // Confirm Delete Student
  const handleConfirmDeleteStudent = () => {
    if (!studentToDelete) return;
    const success = storageService.deleteStudent(studentToDelete.email);
    if (success) {
      setNotificationMsg(`Akun murid "${studentToDelete.fullName || studentToDelete.nickname}" beserta semua riwayat nilai berhasil dihapus secara permanen. 🗑️`);
      loadData();
    }
    setStudentToDelete(null);
    setTimeout(() => setNotificationMsg(null), 4000);
  };

  // Confirm Delete Single Quiz Record
  const handleConfirmDeleteRecord = () => {
    if (!recordToDelete) return;
    storageService.deleteActiveQuizRecord(recordToDelete.id);
    setNotificationMsg('Rekaman kuis berhasil dihapus.');
    setRecordToDelete(null);
    loadData();
    setTimeout(() => setNotificationMsg(null), 3000);
  };

  // Confirm Reset Ranking Sesi Kuis
  const handleConfirmResetRanking = () => {
    storageService.resetActiveQuizRanking();
    setShowResetRankingModal(false);
    setNotificationMsg('Papan perankingan sesi kuis berhasil direset! 🏆 Sesi kuis siap dimulai dari awal tanpa merubah nilai di rapor murid.');
    loadData();
    setTimeout(() => setNotificationMsg(null), 4500);
  };

  // Helper untuk mendapatkan aktivitas live murid saat ini
  const getLiveStudentActivity = (student: User) => {
    const emailLower = student.email.toLowerCase();
    const liveQuiz = activeRecords.find(
      r => r.userEmail.toLowerCase() === emailLower && r.status === 'in_progress'
    );
    const pres = presenceMap[emailLower];
    const allTasks = storageService.getDailyTasks();
    let maxScreenshot = pres?.screenshotAttempts || 0;
    let maxAiTranslate = pres?.aiTranslateAttempts || 0;
    for (const t of allTasks) {
      const comp = (t.completions || []).find(
        c => c.studentEmail.toLowerCase() === emailLower
      );
      if (comp) {
        maxScreenshot = Math.max(maxScreenshot, comp.screenshotAttempts || 0);
        maxAiTranslate = Math.max(maxAiTranslate, comp.aiTranslateAttempts || 0);
      }
    }

    if (liveQuiz) {
      const qNum = liveQuiz.currentQuestion || 1;
      const ansCount = liveQuiz.answeredCount || 0;
      const tot = liveQuiz.totalQuestions || 50;
      return {
        badgeText: `📝 Sedang Kuis JLPT ${liveQuiz.level} (Soal ${qNum}/${tot} · ${ansCount} dijawab)`,
        subText: `Mulai pukul ${liveQuiz.startedAtTime}${liveQuiz.tabViolationsCount ? ` · ⚠️ ${liveQuiz.tabViolationsCount}x Pindah Tab` : ''}`,
        isTakingQuiz: true,
        violations: liveQuiz.tabViolationsCount || 0,
        screenshotAttempts: maxScreenshot,
        aiTranslateAttempts: maxAiTranslate,
      };
    }

    if (pres && pres.currentActivity) {
      return {
        badgeText: pres.currentActivity,
        subText: pres.lastActionAt ? `Update terakhir: ${pres.lastActionAt}` : `Level aktif: ${pres.activeLevel || 'N5'}`,
        isTakingQuiz: false,
        violations: 0,
        screenshotAttempts: maxScreenshot,
        aiTranslateAttempts: maxAiTranslate,
      };
    }

    const latestCompleted = activeRecords.find(
      r => r.userEmail.toLowerCase() === emailLower && r.status === 'completed'
    );
    if (latestCompleted) {
      return {
        badgeText: `✅ Selesai Kuis JLPT ${latestCompleted.level} (Nilai: ${latestCompleted.score})`,
        subText: `Selesai pukul ${latestCompleted.completedAtTime || '-'}`,
        isTakingQuiz: false,
        violations: latestCompleted.tabViolationsCount || 0,
        screenshotAttempts: maxScreenshot,
        aiTranslateAttempts: maxAiTranslate,
      };
    }

    return {
      badgeText: storageService.isStudentOnline(student.email)
        ? '🏠 Membuka Beranda Portal Kelas'
        : '⚪ Belum ada aktivitas sesi ini',
      subText: `Terdaftar: ${student.registeredAt || '-'}`,
      isTakingQuiz: false,
      violations: 0,
      screenshotAttempts: maxScreenshot,
      aiTranslateAttempts: maxAiTranslate,
    };
  };

  // Score color formatting:
  // 0 - 50: Hitam (text-black)
  // 51 - 70: Merah (text-red-600)
  // 71 - 100: Hijau (text-emerald-600)
  const renderScoreBadge = (rec: ActiveQuizRecord) => {
    const { score, status, currentQuestion, answeredCount, totalQuestions } = rec;
    if (status === 'in_progress' || score === null || score === undefined) {
      return (
        <div className="inline-flex flex-col items-center gap-1">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-100 border-2 border-stone-900 text-stone-900 rounded-md text-xs font-black shadow-[2px_2px_0px_#1c1917] animate-pulse">
            <span className="w-2 h-2 rounded-full bg-amber-600 animate-ping" />
            Sedang Dikerjakan
          </span>
          <span className="text-[11px] font-black text-[#881337]">
            Soal {currentQuestion || 1}/{totalQuestions || 50} ({answeredCount || 0} terjawab)
          </span>
        </div>
      );
    }

    let colorClasses = 'text-black bg-stone-100 border-stone-900';
    let gradeLabel = 'Perlu Belajar';

    if (score >= 71) {
      colorClasses = 'text-emerald-800 bg-emerald-100 border-stone-900';
      gradeLabel = 'Lulus Sangat Baik';
    } else if (score >= 51) {
      colorClasses = 'text-red-600 bg-red-100 border-stone-900';
      gradeLabel = 'Cukup / Remedial';
    } else {
      colorClasses = 'text-black bg-stone-200 border-stone-900 font-black';
      gradeLabel = 'Belum Lulus';
    }

    return (
      <div className="inline-flex flex-col items-center">
        <span className={`px-3 py-1 text-base font-black rounded-md border-2 shadow-[2px_2px_0px_#1c1917] ${colorClasses}`}>
          {score}
        </span>
        <span className="text-[10px] text-stone-700 font-bold mt-1">
          {gradeLabel}
        </span>
      </div>
    );
  };

  // Render Badge Ranking / Juara Sesi Ini (Gaya Manga)
  const renderRankBadge = (rank?: number, status?: string) => {
    if (status === 'in_progress' || rank === undefined) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-100 text-stone-900 border-2 border-stone-900 rounded-md text-xs font-black shadow-[2px_2px_0px_#1c1917]">
          <Clock className="w-3 h-3 text-amber-700 animate-spin" />
          <span>Sedang Kuis</span>
        </span>
      );
    }

    if (rank === 1) {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-amber-300 text-stone-950 border-2 border-stone-900 rounded-md text-xs font-black shadow-[2px_2px_0px_#1c1917]">
          <span className="text-sm">🥇</span>
          <span>Juara 1</span>
        </span>
      );
    }
    if (rank === 2) {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-slate-200 text-stone-900 border-2 border-stone-900 rounded-md text-xs font-black shadow-[2px_2px_0px_#1c1917]">
          <span className="text-sm">🥈</span>
          <span>Juara 2</span>
        </span>
      );
    }
    if (rank === 3) {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-orange-200 text-stone-950 border-2 border-stone-900 rounded-md text-xs font-black shadow-[2px_2px_0px_#1c1917]">
          <span className="text-sm">🥉</span>
          <span>Juara 3</span>
        </span>
      );
    }

    return (
      <span className="inline-flex items-center px-2.5 py-1 bg-white text-stone-900 border-2 border-stone-900 rounded-md text-xs font-black font-mono shadow-[2px_2px_0px_#1c1917]">
        #{rank}
      </span>
    );
  };

  // Perhitungan Peringkat / Ranking Kuis Sesi Ini
  const completedRecords = activeRecords.filter(
    (r) => r.status === 'completed' && r.score !== null && r.score !== undefined
  );

  const sortedCompletedRecords = [...completedRecords].sort((a, b) => {
    if ((b.score ?? 0) !== (a.score ?? 0)) {
      return (b.score ?? 0) - (a.score ?? 0);
    }
    return (a.completedAtTimestamp ?? 0) - (b.completedAtTimestamp ?? 0);
  });

  const rankMap = new Map<string, number>();
  sortedCompletedRecords.forEach((rec, idx) => {
    rankMap.set(rec.id, idx + 1);
  });

  // Filtered live records
  const filteredRecords = activeRecords.filter(rec => {
    const q = searchQuery.toLowerCase().trim();
    const matchQuery = !q || 
      rec.studentName.toLowerCase().includes(q) || 
      rec.studentNickname.toLowerCase().includes(q) || 
      rec.userEmail.toLowerCase().includes(q) ||
      rec.level.toLowerCase().includes(q);
      
    const matchLevel = filterLevel === 'all' || rec.level === filterLevel;
    const matchStatus = filterStatus === 'all' || rec.status === filterStatus;
    
    return matchQuery && matchLevel && matchStatus;
  });

  // Hitung jumlah murid yang sedang online mengakses web
  const onlineStudentsCount = studentsList.filter(stu => storageService.isStudentOnline(stu.email)).length;
  const offlineStudentsCount = Math.max(0, studentsList.length - onlineStudentsCount);

  // Filtered students
  const filteredStudents = studentsList.filter(stu => {
    const q = searchQuery.toLowerCase().trim();
    const matchQuery = !q || 
      (stu.fullName && stu.fullName.toLowerCase().includes(q)) || 
      (stu.nickname && stu.nickname.toLowerCase().includes(q)) || 
      stu.email.toLowerCase().includes(q);

    const isOnline = storageService.isStudentOnline(stu.email);
    const matchPresence = 
      filterPresence === 'all' || 
      (filterPresence === 'online' && isOnline) || 
      (filterPresence === 'offline' && !isOnline);

    return matchQuery && matchPresence;
  });

  return (
    <div className="max-w-6xl mx-auto px-3 sm:px-5 py-6 sm:py-8">
      {/* Toast Notification Gaya Balon Dialog Manga */}
      {notificationMsg && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 px-5 py-3 bg-stone-950 text-white font-black text-xs sm:text-sm rounded-none border-[3px] border-[#881337] shadow-[6px_6px_0px_#881337] animate-in fade-in slide-in-from-top-4 duration-300 flex items-center gap-2.5">
          <span className="px-2 py-0.5 bg-[#881337] text-amber-300 font-japanese text-xs">報せ!</span>
          <span>{notificationMsg}</span>
        </div>
      )}

      {/* =========================================================================
          BINGKAI LEMBARAN BUKU MANGA JEPANG (TANKŌBON / MANGA PAGE SPREAD + GUTTER)
          ========================================================================= */}
      <div className="manga-page-gutter-canvas relative p-4 sm:p-8 overflow-hidden">
        {/* Tanda Potong Sudut Kertas Cetak Manga (Tombo / Crop Marks) */}
        <div className="pointer-events-none select-none absolute top-2.5 left-2.5 w-4 h-4 border-t-[3px] border-l-[3px] border-black" aria-hidden="true" />
        <div className="pointer-events-none select-none absolute top-2.5 right-2.5 w-4 h-4 border-t-[3px] border-r-[3px] border-black" aria-hidden="true" />
        <div className="pointer-events-none select-none absolute bottom-2.5 left-2.5 w-4 h-4 border-b-[3px] border-l-[3px] border-black" aria-hidden="true" />
        <div className="pointer-events-none select-none absolute bottom-2.5 right-2.5 w-4 h-4 border-b-[3px] border-r-[3px] border-black" aria-hidden="true" />

        {/* HEADER ATAS LEMBARAN MANGA (PANEL MASTHEAD TERPISAH DENGAN BORDER HITAM TEBAL) */}
        <div className="manga-koma-panel relative bg-white px-4 py-3.5 flex flex-wrap items-center justify-between gap-3">
          <MangaCornerTicks />
          <div className="flex items-center gap-2.5 flex-wrap">
            <span className="px-3 py-1 bg-black text-white font-japanese font-black text-xs tracking-widest uppercase border-2 border-black">
              漫画・第一巻 (VOL. 01)
            </span>
            <span className="px-2.5 py-1 bg-[#881337] text-white font-japanese font-black text-xs tracking-wider border-2 border-black">
              {currentMangaPageMeta.jpChapter}
            </span>
            <span className="text-xs font-black text-black uppercase tracking-wider flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-[#881337]" />
              <span>EDISI KHUSUS HALAMAN MASTER SENSEI SARI</span>
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono font-black text-black">
            <button
              type="button"
              onClick={() => handleStepMangaPage(-1)}
              className="px-2.5 py-1 bg-white hover:bg-amber-100 text-black border-[2.5px] border-black shadow-[2px_2px_0px_#000000] active:translate-x-[1px] active:translate-y-[1px] inline-flex items-center gap-1 transition-colors cursor-pointer"
              title="Balik ke lembaran manga sebelumnya"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span>前の頁</span>
            </button>
            <span className="px-2.5 py-1 bg-amber-200 border-[2.5px] border-black shadow-[2px_2px_0px_#000000]">
              {currentMangaPageMeta.folio}
            </span>
            <button
              type="button"
              onClick={() => handleStepMangaPage(1)}
              className="px-2.5 py-1 bg-white hover:bg-amber-100 text-black border-[2.5px] border-black shadow-[2px_2px_0px_#000000] active:translate-x-[1px] active:translate-y-[1px] inline-flex items-center gap-1 transition-colors cursor-pointer"
              title="Balik ke lembaran manga berikutnya"
            >
              <span>次の頁</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* GUTTER MANGA 01: PEMISAH ANTARA MASTHEAD & PANEL UTAMA KOMA 01 */}
        <MangaGutterSeparator label="MANGA GUTTER 01 · PEMISAH PANEL UTAMA" jpLabel="【コマ間・第壱区画】" />

        {/* =========================================================================
            KOMA 01 (PANEL PEMBUKA MANGA): TERBAGI MENJADI SUB-PANEL KOMIK DENGAN GUTTER
            ========================================================================= */}
        <div className="manga-koma-panel relative bg-white p-5 sm:p-7 overflow-hidden">
          <MangaCornerTicks />
          {/* Garis Kecepatan Manga (Speed Lines) di Latar Panel */}
          <MangaSpeedLinesBg />

          {/* Label Nomor Panel Manga & Onomatopoeia Jepang */}
          <div className="relative z-10 flex flex-wrap items-center justify-between gap-2 mb-5 border-b-[3px] border-black pb-3.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-1 bg-black text-amber-300 font-mono font-black text-[11px] uppercase tracking-wider border-2 border-black">
                コマ 01 · OPENING PANEL
              </span>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#fae8eb] border-2 border-black text-xs font-black text-[#881337] tracking-wider uppercase shadow-[2px_2px_0px_#000000]">
                <Shield className="w-3.5 h-3.5 text-[#881337]" />
                <span>DASHBOARD MANAJEMEN SENSEI SARI</span>
              </div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-200 border-2 border-black text-black font-black text-xs shadow-[2px_2px_0px_#000000]">
                <UchihaClanLogo className="w-4 h-4" />
                <span>Akun Master: <span className="font-extrabold text-[#881337]">{currentUser?.nickname || 'skywalker'}</span></span>
              </div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-100 border-2 border-black text-emerald-950 font-black text-xs shadow-[2px_2px_0px_#000000]">
                <Radio className="w-3.5 h-3.5 text-emerald-700 animate-pulse" />
                <span>Sinkronisasi Cloud Real-Time Aktif</span>
              </div>
            </div>

            <span className="font-japanese font-black text-sm sm:text-base text-[#881337] tracking-widest select-none px-2 py-0.5 bg-[#fbf9f3] border-2 border-black shadow-[2px_2px_0px_#000000]">
              ドドドド!!
            </span>
          </div>

          {/* Kisi 2 Panel Terpisah oleh Gutter Vertikal (Panel Narasi Kiri + Panel Kendali Kuis Kanan) */}
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch bg-[#f1ebe0] p-3.5 border-[3px] border-black">
            {/* Sub-Panel Koma 01-A: Judul & Balon Dialog Sensei */}
            <div className="lg:col-span-7 manga-subkoma-panel bg-white p-4 sm:p-5 flex items-start gap-3.5">
              {/* Strip Vertikal Khas Judul Manga Jepang (Tategaki) */}
              <div className="hidden sm:flex flex-col items-center justify-center px-2.5 py-2.5 bg-black text-white border-2 border-black font-japanese font-black text-xs leading-tight tracking-widest shrink-0 shadow-[3px_3px_0px_#881337]">
                <span>師</span>
                <span>範</span>
                <span>統</span>
                <span>括</span>
              </div>

              <div className="flex-1">
                <div className="inline-block px-2 py-0.5 bg-black text-white font-mono text-[10px] font-black uppercase mb-1.5">
                  SUB-PANEL 01A · NARRATION
                </div>
                <h1 className="text-xl sm:text-2xl font-black text-black font-japanese tracking-tight leading-tight">
                  Daftar Murid, Pantauan Aktivitas & Nilai Kuis Live
                </h1>
                {/* Balon Ucapan Manga (Fukidashi Speech Bubble) */}
                <div className="mt-3 relative bg-[#fbf9f3] border-[2.5px] border-black px-4 py-2.5 shadow-[4px_4px_0px_#000000]">
                  <p className="text-xs sm:text-sm text-stone-900 font-medium leading-relaxed">
                    <span className="font-black text-[#881337] font-japanese mr-1.5">「先生より」</span>
                    Pantau seluruh murid yang berhasil mendaftar, jam & tanggal terakhir murid belajar, aktivitas halaman yang sedang dibuka secara <strong className="text-[#881337] underline decoration-2">live & otomatis</strong>, serta kendalikan sesi kuis!
                  </p>
                </div>
              </div>
            </div>

            {/* Sub-Panel Koma 01-B: Kendali Sesi Kuis (Dipisahkan oleh Gutter dari Sub-Panel 01A) */}
            <div
              className="lg:col-span-5 manga-subkoma-panel bg-[#fbf9f3] p-4 sm:p-5 flex flex-col justify-between gap-4"
              style={{
                backgroundImage:
                  'radial-gradient(rgba(136, 19, 55, 0.09) 1px, transparent 1px)',
                backgroundSize: '8px 8px',
              }}
            >
              <div className="flex items-center justify-between gap-2 border-b-2 border-black pb-2">
                <span className="px-2 py-0.5 bg-black text-amber-300 font-mono text-[10px] font-black uppercase">
                  SUB-PANEL 01B · QUIZ SWITCH
                </span>
                <span className="font-japanese font-black text-xs text-[#881337]">
                  ガチャン!!
                </span>
              </div>

              <div className="flex items-center gap-3 bg-white p-3 border-2 border-black shadow-[3px_3px_0px_#000000]">
                <span 
                  className={`w-4 h-4 rounded-full border-2 border-black ring-4 transition-all shrink-0 ${
                    quizControl.isActive 
                      ? 'bg-emerald-500 ring-emerald-200 animate-pulse' 
                      : 'bg-rose-500 ring-rose-200'
                  }`} 
                  aria-hidden="true"
                />
                <div className="text-left">
                  <div className="text-[11px] font-black uppercase tracking-wider text-stone-800 font-mono">
                    [STATUS SESI KUIS MURID]
                  </div>
                  <div className={`text-xs font-black ${quizControl.isActive ? 'text-emerald-800' : 'text-rose-700'}`}>
                    {quizControl.isActive ? '🟢 SESI DIMULAI (Murid Bisa Kuis)' : '🔴 DITUTUP (Terkunci)'}
                  </div>
                </div>
              </div>

              <button
                onClick={handleToggleQuizSession}
                className={`w-full px-5 py-2.5 border-[3px] border-black font-black text-xs sm:text-sm transition-all shadow-[4px_4px_0px_#000000] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0px_#000000] flex items-center justify-center gap-2 text-white cursor-pointer ${
                  quizControl.isActive
                    ? 'bg-rose-600 hover:bg-rose-700'
                    : 'bg-emerald-600 hover:bg-emerald-700'
                }`}
              >
                {quizControl.isActive ? (
                  <>
                    <Square className="w-4 h-4 fill-white" />
                    <span>Akhiri / Kunci Sesi Kuis</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 fill-white" />
                    <span>Mulai / Buka Sesi Kuis</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Sub-Panel Navigasi Bab / Sub-Tab Manga (Dipisahkan dengan Gutter dari Panel Atas) */}
          <div className="relative z-10 mt-5 bg-[#f1ebe0] p-3.5 border-[3px] border-black flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => handleMangaPageChange('all')}
                className={`flex items-center gap-2 px-4 py-2 border-[3px] border-black text-xs sm:text-sm font-black transition-all shadow-[4px_4px_0px_#000000] active:translate-x-[1px] active:translate-y-[1px] cursor-pointer ${
                  subTab === 'all'
                    ? 'bg-[#881337] text-white'
                    : 'bg-white text-black hover:bg-[#fae8eb]'
                }`}
              >
                <Radio className="w-4 h-4" />
                <span>頁 01: Semua Pantauan (Spread Lengkap)</span>
              </button>

              <button
                onClick={() => handleMangaPageChange('student_list')}
                className={`flex items-center gap-2 px-4 py-2 border-[3px] border-black text-xs sm:text-sm font-black transition-all shadow-[4px_4px_0px_#000000] active:translate-x-[1px] active:translate-y-[1px] cursor-pointer ${
                  subTab === 'student_list'
                    ? 'bg-[#881337] text-white'
                    : 'bg-white text-black hover:bg-[#fae8eb]'
                }`}
              >
                <Users className="w-4 h-4" />
                <span>頁 03: Daftar Murid Terdaftar</span>
                <span className={`px-2 py-0.5 border-2 border-black text-[11px] font-black ${
                  subTab === 'student_list' ? 'bg-amber-300 text-black' : 'bg-[#fae8eb] text-[#881337]'
                }`}>
                  {studentsList.length} Murid
                </span>
              </button>

              <button
                onClick={() => handleMangaPageChange('live_scores')}
                className={`flex items-center gap-2 px-4 py-2 border-[3px] border-black text-xs sm:text-sm font-black transition-all shadow-[4px_4px_0px_#000000] active:translate-x-[1px] active:translate-y-[1px] cursor-pointer ${
                  subTab === 'live_scores'
                    ? 'bg-[#881337] text-white'
                    : 'bg-white text-black hover:bg-[#fae8eb]'
                }`}
              >
                <Activity className="w-4 h-4" />
                <span>頁 05: Nilai & Perankingan Kuis Live</span>
                <span className={`px-2 py-0.5 border-2 border-black text-[11px] font-black ${
                  subTab === 'live_scores' ? 'bg-amber-300 text-black' : 'bg-[#fae8eb] text-[#881337]'
                }`}>
                  {activeRecords.length} Sesi
                </span>
              </button>
            </div>

            {/* Quick Action: Tambah Murid & Sinkronisasi */}
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => {
                  setAddStudentError('');
                  setShowAddStudentModal(true);
                }}
                className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-black border-[3px] border-black text-xs transition-all shadow-[4px_4px_0px_#000000] active:translate-x-[1px] active:translate-y-[1px] cursor-pointer"
                title="Daftarkan akun murid baru secara langsung oleh Master"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>+ Tambah Murid Baru</span>
              </button>

              <button
                onClick={handleManualSyncAndReload}
                title="Sinkronkan & muat ulang daftar murid terbaru"
                className="flex items-center gap-1.5 px-3.5 py-2 bg-white hover:bg-amber-50 text-black border-[3px] border-black text-xs font-black transition-all shadow-[4px_4px_0px_#000000] active:translate-x-[1px] active:translate-y-[1px] cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Sinkronkan Data</span>
              </button>
            </div>
          </div>
        </div>

        {/* GUTTER MANGA 02: PEMISAH ANTARA PANEL HEADER & PANEL STATISTIK SAN-KOMA */}
        <MangaGutterSeparator label="MANGA GUTTER 02 · PEMISAH STRIP STATISTIK (3-KOMA)" jpLabel="【コマ間・第弐区画】" />

        {/* =========================================================================
            AREA LEMBARAN PANEL MANGA DENGAN ANIMASI 3D PAGE TURN (ページめくり)
            ========================================================================= */}
        <div
          key={pageTurnKey}
          className={`relative ${
            pageTurnKey > 0
              ? pageTurnDirection === 'next'
                ? 'manga-page-turn-next'
                : 'manga-page-turn-prev'
              : ''
          }`}
        >
          {/* Efek Sapuan Bayangan & Lipatan Kertas Saat Membalik Halaman Manga */}
          {isTurningPage && (
            <>
              <div
                className={`pointer-events-none select-none absolute inset-0 z-30 ${
                  pageTurnDirection === 'next'
                    ? 'manga-curl-sweep-next'
                    : 'manga-curl-sweep-prev'
                }`}
                aria-hidden="true"
              />
              <div
                className="pointer-events-none select-none absolute top-3 right-4 z-40 px-3 py-1 bg-black text-amber-300 border-2 border-white font-japanese font-black text-xs shadow-[4px_4px_0px_#881337] animate-bounce"
                aria-hidden="true"
              >
                📖 {currentMangaPageMeta.sfx}
              </div>
            </>
          )}

        {/* =========================================================================
            KOMA 02, 03, 04 (3 PANEL STATISTIK MANGA TERPISAH GUTTER / SAN-KOMA STRIP)
            ========================================================================= */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {/* Koma 02: Total Murid Terdaftar */}
          <div 
            onClick={() => {
              setFilterPresence('all');
              setKomaFlipKey((prev) => prev + 1);
            }}
            className={`manga-koma-panel relative p-5 transition-all cursor-pointer flex items-center justify-between ${
              filterPresence === 'all'
                ? 'bg-[#fff0f3] ring-4 ring-[#881337]'
                : 'bg-white hover:bg-[#fcf8f2]'
            }`}
            title="Klik untuk melihat seluruh murid terdaftar"
          >
            <MangaCornerTicks />
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="px-2 py-0.5 bg-black text-white font-mono text-[10px] font-black border border-black">
                  コマ 02
                </span>
                <span className="text-[11px] font-black uppercase tracking-wider text-[#881337]">
                  Total Murid Terdaftar
                </span>
              </div>
              <div className="text-2xl sm:text-3xl font-black text-black font-japanese">
                {studentsList.length} Murid
              </div>
              <p className="text-[11px] text-stone-800 font-bold mt-1 pt-1 border-t-2 border-black/20">
                Tersimpan permanen di buku induk kelas
              </p>
            </div>
            <div className="flex flex-col items-end gap-1.5 shrink-0">
              <span className="font-japanese font-black text-xs text-[#881337] select-none px-1.5 py-0.5 bg-white border-2 border-black">
                ドン!!
              </span>
              <div className="w-12 h-12 bg-[#fae8eb] border-[3px] border-black shadow-[3px_3px_0px_#000000] flex items-center justify-center text-[#881337]">
                <Users className="w-5 h-5" />
              </div>
            </div>
          </div>

          {/* Koma 03: Sedang Online & Aktif */}
          <div 
            onClick={() => {
              setFilterPresence(filterPresence === 'online' ? 'all' : 'online');
              setKomaFlipKey((prev) => prev + 1);
            }}
            className={`manga-koma-panel relative p-5 transition-all cursor-pointer flex items-center justify-between ${
              filterPresence === 'online'
                ? 'bg-emerald-50 ring-4 ring-emerald-700'
                : 'bg-white hover:bg-emerald-50/40'
            }`}
            title="Klik untuk memfilter murid yang sedang online"
          >
            <MangaCornerTicks />
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="px-2 py-0.5 bg-black text-amber-300 font-mono text-[10px] font-black border border-black">
                  コマ 03
                </span>
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-600"></span>
                </span>
                <span className="text-[11px] font-black uppercase tracking-wider text-emerald-950">
                  Sedang Online & Aktif
                </span>
              </div>
              <div className="text-2xl sm:text-3xl font-black text-emerald-950 font-japanese">
                {onlineStudentsCount} Murid
              </div>
              <p className="text-[11px] text-emerald-900 font-bold mt-1 pt-1 border-t-2 border-black/20">
                Sedang membuka web & belajar saat ini
              </p>
            </div>
            <div className="flex flex-col items-end gap-1.5 shrink-0">
              <span className="font-japanese font-black text-xs text-emerald-900 select-none px-1.5 py-0.5 bg-white border-2 border-black">
                ピーン!
              </span>
              <div className="w-12 h-12 bg-emerald-100 border-[3px] border-black shadow-[3px_3px_0px_#000000] flex items-center justify-center text-emerald-800">
                <Radio className="w-5 h-5 animate-pulse" />
              </div>
            </div>
          </div>

          {/* Koma 04: Sedang Offline */}
          <div 
            onClick={() => {
              setFilterPresence(filterPresence === 'offline' ? 'all' : 'offline');
              setKomaFlipKey((prev) => prev + 1);
            }}
            className={`manga-koma-panel relative p-5 transition-all cursor-pointer flex items-center justify-between ${
              filterPresence === 'offline'
                ? 'bg-stone-200 ring-4 ring-stone-800'
                : 'bg-white hover:bg-stone-100'
            }`}
            title="Klik untuk memfilter murid yang sedang offline"
          >
            <MangaCornerTicks />
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="px-2 py-0.5 bg-black text-stone-200 font-mono text-[10px] font-black border border-black">
                  コマ 04
                </span>
                <span className="w-2.5 h-2.5 rounded-full bg-stone-600"></span>
                <span className="text-[11px] font-black uppercase tracking-wider text-stone-800">
                  Sedang Offline
                </span>
              </div>
              <div className="text-2xl sm:text-3xl font-black text-black font-japanese">
                {offlineStudentsCount} Murid
              </div>
              <p className="text-[11px] text-stone-700 font-bold mt-1 pt-1 border-t-2 border-black/20">
                Tidak sedang membuka aplikasi
              </p>
            </div>
            <div className="flex flex-col items-end gap-1.5 shrink-0">
              <span className="font-japanese font-black text-xs text-stone-700 select-none px-1.5 py-0.5 bg-white border-2 border-black">
                シーン...
              </span>
              <div className="w-12 h-12 bg-stone-100 border-[3px] border-black shadow-[3px_3px_0px_#000000] flex items-center justify-center text-stone-800">
                <Clock className="w-5 h-5" />
              </div>
            </div>
          </div>
        </div>

        {/* =========================================================================
            KOMA 05 (PANEL UTAMA MANGA): DAFTAR SEMUA MURID & JAM TERAKHIR ONLINE
            ========================================================================= */}
        {(subTab === 'all' || subTab === 'student_list') && (
          <>
            <MangaGutterSeparator label="MANGA GUTTER 03 · PEMISAH PANEL DAFTAR MURID" jpLabel="【コマ間・生徒名簿区画】" />
            <div key={`roster_${komaFlipKey}`} className={`manga-koma-panel relative bg-white overflow-hidden ${komaFlipKey > 0 ? 'manga-koma-flip' : ''}`}>
              <MangaCornerTicks />
              {/* Header Bar Daftar Murid Gaya Bab Manga (Mode Terang) */}
              <div
                className="bg-[#fbf5ea] text-black border-b-[4px] border-black px-5 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                style={{
                  backgroundImage:
                    'radial-gradient(rgba(0, 0, 0, 0.08) 1px, transparent 1px)',
                  backgroundSize: '10px 10px',
                }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#881337] border-[2.5px] border-black text-white flex items-center justify-center shrink-0 font-japanese font-black text-lg shadow-[3px_3px_0px_#000000]">
                    名
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="px-2 py-0.5 bg-amber-300 text-black font-mono text-[10px] font-black uppercase border-2 border-black">
                        大ゴマ 05 · STUDENT ROSTER SPREAD
                      </span>
                      <span className="font-japanese text-xs text-[#881337] font-black">
                        【生徒名簿・最終学習時刻】
                      </span>
                    </div>
                    <h2 className="text-sm sm:text-base font-black text-black font-japanese flex items-center gap-2 flex-wrap mt-0.5">
                      <span>Daftar Semua Murid yang Berhasil Mendaftar & Pantauan Aktivitas Live</span>
                      <span className="px-2.5 py-0.5 bg-[#881337] text-white border-2 border-black text-[11px] font-black">
                        {studentsList.length} Murid Terdaftar
                      </span>
                    </h2>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setShowRegisteredStudentsTable((prev) => !prev)}
                  className={`px-3.5 py-2 border-2 border-black font-black text-xs transition-all flex items-center justify-center gap-1.5 shrink-0 shadow-[3px_3px_0px_#881337] active:translate-x-[1px] active:translate-y-[1px] cursor-pointer ${
                    showRegisteredStudentsTable
                      ? 'bg-white hover:bg-amber-100 text-black'
                      : 'bg-amber-300 hover:bg-amber-400 text-black'
                  }`}
                >
                  {showRegisteredStudentsTable ? (
                    <>
                      <EyeOff className="w-3.5 h-3.5" />
                      <span>Sembunyikan Tabel Sementara</span>
                    </>
                  ) : (
                    <>
                      <Eye className="w-3.5 h-3.5" />
                      <span>Tampilkan Tabel Daftar Murid</span>
                    </>
                  )}
                </button>
              </div>

              {!showRegisteredStudentsTable ? (
                <div className="p-8 sm:p-10 text-center bg-[#fbf9f3]">
                  <div className="w-12 h-12 bg-white border-[3px] border-black shadow-[3px_3px_0px_#000000] text-[#881337] flex items-center justify-center mx-auto mb-3">
                    <EyeOff className="w-6 h-6" />
                  </div>
                  <h3 className="text-sm sm:text-base font-black text-black font-japanese">
                    Panel Daftar Murid Sedang Ditutup Sementara
                  </h3>
                  <p className="text-xs text-stone-700 max-w-md mx-auto mt-1 mb-4 leading-relaxed">
                    Klik tombol di bawah untuk membuka kembali lembaran daftar seluruh murid beserta jam terakhir online & aktivitas live mereka.
                  </p>
                  <button
                    type="button"
                    onClick={() => setShowRegisteredStudentsTable(true)}
                    className="px-5 py-2.5 bg-[#881337] hover:bg-[#70102d] text-white font-black text-xs border-[3px] border-black shadow-[4px_4px_0px_#000000] inline-flex items-center gap-2 cursor-pointer"
                  >
                    <Eye className="w-4 h-4" />
                    <span>Buka Lembaran Daftar Murid</span>
                  </button>
                </div>
              ) : (
                <div>
                  {/* Sub-Panel Filter & Pencarian Murid Terdaftar (Dipisahkan Border Gutter Tebal) */}
                  <div className="bg-[#f1ebe0] border-b-[4px] border-black p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
                    <div className="flex items-center gap-2 flex-wrap w-full sm:w-auto">
                      <span className="px-2 py-1 bg-black text-white text-[11px] font-black uppercase tracking-wider font-mono">
                        FILTER PANEL:
                      </span>
                      <div className="flex items-center gap-1.5 bg-white p-1 border-[2.5px] border-black shadow-[3px_3px_0px_#000000] text-xs">
                        <button
                          onClick={() => setFilterPresence('all')}
                          className={`px-3 py-1 font-black transition-all cursor-pointer ${
                            filterPresence === 'all'
                              ? 'bg-black text-white'
                              : 'text-stone-800 hover:text-black'
                          }`}
                        >
                          Semua ({studentsList.length})
                        </button>
                        <button
                          onClick={() => setFilterPresence('online')}
                          className={`px-3 py-1 font-black transition-all flex items-center gap-1.5 cursor-pointer ${
                            filterPresence === 'online'
                              ? 'bg-emerald-600 text-white'
                              : 'text-emerald-800 hover:text-emerald-950'
                          }`}
                        >
                          <span className="w-2 h-2 rounded-full bg-emerald-400" />
                          <span>Online ({onlineStudentsCount})</span>
                        </button>
                        <button
                          onClick={() => setFilterPresence('offline')}
                          className={`px-3 py-1 font-black transition-all flex items-center gap-1.5 cursor-pointer ${
                            filterPresence === 'offline'
                              ? 'bg-stone-800 text-white'
                              : 'text-stone-700 hover:text-black'
                          }`}
                        >
                          <span className="w-2 h-2 rounded-full bg-stone-400" />
                          <span>Offline ({offlineStudentsCount})</span>
                        </button>
                      </div>
                    </div>

                    {/* Search Input Gaya Kotak Manga */}
                    <div className="relative w-full sm:w-80">
                      <Search className="w-4 h-4 text-black absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Cari nama murid, panggilan, atau email..."
                        className="w-full pl-10 pr-3.5 py-2 bg-white border-[2.5px] border-black shadow-[3px_3px_0px_#000000] focus:bg-amber-50/40 text-xs sm:text-sm font-bold text-black outline-hidden"
                      />
                    </div>
                  </div>

                  {filteredStudents.length === 0 ? (
                    <div className="p-10 text-center text-stone-700 bg-white">
                      <div className="font-japanese font-black text-2xl text-stone-400 mb-2">「データなし」</div>
                      <p className="font-black text-sm text-black">Belum ada data murid yang cocok dengan filter pencarian.</p>
                      <p className="text-xs text-stone-600 mt-1">Klik tombol "Semua" atau "+ Tambah Murid Baru" untuk menambahkan murid.</p>
                    </div>
                  ) : (
                    <>
                      {/* TAMPILAN TABEL DESKTOP (md ke atas) — Gaya Kisi Panel Komik dengan Border Hitam Tebal */}
                      <div className="hidden md:block overflow-x-auto bg-[#f1ebe0] p-3">
                        <table className="w-full text-left text-xs sm:text-sm bg-white border-[3px] border-black shadow-[4px_4px_0px_#000000]">
                          <thead>
                            <tr className="bg-[#e8dfd1] text-black border-b-[3px] border-black font-black text-xs uppercase tracking-wider">
                              <th className="py-3.5 px-3 text-center w-12 border-r-[2.5px] border-black">No</th>
                              <th className="py-3.5 px-4 border-r-[2.5px] border-black">Identitas Murid Terdaftar</th>
                              <th className="py-3.5 px-3 border-r-[2.5px] border-black">Terakhir Online (Jam & Tanggal Belajar)</th>
                              <th className="py-3.5 px-3 text-center border-r-[2.5px] border-black">Status & Aktivitas Live Murid</th>
                              <th className="py-3.5 px-4 border-r-[2.5px] border-black">Email & Kata Sandi Akun</th>
                              <th className="py-3.5 px-4 text-center border-r-[2.5px] border-black">Riwayat & Nilai Kuis</th>
                              <th className="py-3.5 px-4 text-center">Aksi Master</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y-[3px] divide-black">
                          {filteredStudents.map((student, idx) => {
                            const studentScores = allScores.filter(s => s.userEmail.toLowerCase() === student.email.toLowerCase());
                            const totalQuizzes = studentScores.length;
                            const avgScore = totalQuizzes > 0
                              ? Math.round(studentScores.reduce((acc, s) => acc + s.score, 0) / totalQuizzes)
                              : null;
                            const bestScore = totalQuizzes > 0
                              ? Math.max(...studentScores.map(s => s.score))
                              : null;

                            const cred = studentsCredentials.find(c => c.user.email.toLowerCase() === student.email.toLowerCase());
                            const studentPassword = cred ? cred.password : '••••••••';
                            const isOnline = storageService.isStudentOnline(student.email);
                            const lastOnlineInfo = storageService.getStudentLastOnlineDetails(student, nowMs);
                            const activityInfo = getLiveStudentActivity(student);
                            const displayFullName = student.fullName || student.name || student.nickname || 'Murid Terdaftar';
                            const displayNickname = student.nickname || displayFullName.split(/\s+/)[0] || '-';
                            const avatarInitial = displayFullName.charAt(0).toUpperCase();

                            let avgScoreColor = 'text-black bg-stone-100 border-stone-900';
                            if (avgScore !== null) {
                              if (avgScore >= 71) {
                                avgScoreColor = 'text-emerald-800 bg-emerald-100 border-stone-900';
                              } else if (avgScore >= 51) {
                                avgScoreColor = 'text-red-600 bg-red-100 border-stone-900';
                              }
                            }

                            return (
                              <tr
                                key={student.email}
                                className={`transition-colors ${
                                  activityInfo.isTakingQuiz
                                    ? 'bg-amber-50/80 hover:bg-amber-100/60'
                                    : 'hover:bg-[#fbf9f3]'
                                }`}
                              >
                                {/* Kolom 1: Nomor Urut */}
                                <td className="py-4 px-3 text-center font-mono font-black text-black border-r-[2.5px] border-black bg-[#fbf9f3]">
                                  #{idx + 1}
                                </td>

                                {/* Kolom 2: Identitas Murid Terdaftar */}
                                <td className="py-4 px-4 border-r-[2.5px] border-black">
                                  <div className="flex items-center gap-3">
                                    <div className="relative shrink-0">
                                      <div className="w-10 h-10 bg-[#881337] border-2 border-black text-white flex items-center justify-center font-japanese font-black text-base shadow-[2px_2px_0px_#000000]">
                                        {avatarInitial}
                                      </div>
                                      <span
                                        className={`absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full border-2 border-black ${
                                          isOnline ? 'bg-emerald-500' : 'bg-stone-400'
                                        }`}
                                      />
                                    </div>
                                    <div className="min-w-0">
                                      <div className="flex items-center gap-2 flex-wrap">
                                        <span className="font-black text-black text-sm">
                                          {displayFullName}
                                        </span>
                                      </div>
                                      <div className="text-xs text-stone-700 mt-0.5 flex items-center gap-2 flex-wrap">
                                        <span>Panggilan: <strong className="text-[#881337] font-black">{displayNickname}</strong></span>
                                        <span aria-hidden="true">·</span>
                                        <span className="text-[11px] text-stone-600">
                                          Terdaftar: {student.registeredAt || '2026-10-01'}
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                </td>

                                {/* Kolom 3: Jam & Tanggal Terakhir Murid Online / Belajar */}
                                <td className="py-4 px-3 border-r-[2.5px] border-black">
                                  <div
                                    className={`p-2.5 border-2 border-black shadow-[3px_3px_0px_#000000] space-y-1 min-w-[210px] ${
                                      isOnline
                                        ? 'bg-emerald-50'
                                        : 'bg-[#fbf9f3]'
                                    }`}
                                  >
                                    <div className="flex items-center gap-1.5 text-xs font-black text-black">
                                      <Calendar className="w-3.5 h-3.5 text-[#881337] shrink-0" />
                                      <span>{lastOnlineInfo.formattedDayDate}</span>
                                    </div>
                                    <div className="flex items-center gap-1.5 text-xs font-mono font-black text-[#881337]">
                                      <Clock className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                                      <span>Pukul {lastOnlineInfo.formattedTime}</span>
                                    </div>
                                    <div
                                      className={`text-[10px] font-black inline-flex items-center gap-1 px-2 py-0.5 border border-black ${
                                        isOnline
                                          ? 'bg-emerald-600 text-white'
                                          : 'bg-white text-stone-800'
                                      }`}
                                    >
                                      <span
                                        className={`w-1.5 h-1.5 rounded-full ${
                                          isOnline ? 'bg-white animate-ping' : 'bg-amber-600'
                                        }`}
                                      />
                                      <span>{lastOnlineInfo.relativeTimeLabel}</span>
                                    </div>
                                  </div>
                                </td>

                                {/* Kolom 4: Status Kehadiran & Aktivitas Live */}
                                <td className="py-4 px-3 border-r-[2.5px] border-black">
                                  <div className="flex flex-col items-start gap-1.5">
                                    <div className="flex items-center gap-1.5 flex-wrap">
                                      {isOnline ? (
                                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-emerald-100 text-emerald-950 border-2 border-stone-950 text-[11px] font-black shadow-[2px_2px_0px_#1c1917]">
                                          <span className="w-2 h-2 rounded-full bg-emerald-600 animate-ping" />
                                          <span>Online</span>
                                        </span>
                                      ) : (
                                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-stone-100 text-stone-700 border-2 border-stone-950 text-[11px] font-bold">
                                          <span className="w-2 h-2 rounded-full bg-stone-400" />
                                          <span>Offline</span>
                                        </span>
                                      )}

                                      {activityInfo.violations > 0 && (
                                        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-rose-100 text-rose-900 border-2 border-stone-950 text-[10px] font-black">
                                          <ShieldAlert className="w-3 h-3 text-rose-600" />
                                          <span>{activityInfo.violations}x Pindah Tab</span>
                                        </span>
                                      )}

                                      {activityInfo.screenshotAttempts > 0 && (
                                        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-rose-600 text-white border border-stone-950 text-[10px] font-black">
                                          <span>📸 Mencoba Screenshot: {activityInfo.screenshotAttempts}x</span>
                                        </span>
                                      )}

                                      {activityInfo.aiTranslateAttempts > 0 && (
                                        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-amber-600 text-white border border-stone-950 text-[10px] font-black">
                                          <span>🤖 Mencoba Terjemahan Otomatis: {activityInfo.aiTranslateAttempts}x</span>
                                        </span>
                                      )}
                                    </div>

                                    <div className={`text-xs font-black px-2.5 py-1 border-2 border-stone-950 ${
                                      activityInfo.isTakingQuiz
                                        ? 'bg-amber-200 text-stone-950'
                                        : isOnline
                                        ? 'bg-[#fbf9f3] text-[#881337]'
                                        : 'bg-stone-50 text-stone-700'
                                    }`}>
                                      {activityInfo.badgeText}
                                    </div>
                                    <span className="text-[10px] text-stone-600 font-medium">
                                      {activityInfo.subText}
                                    </span>
                                  </div>
                                </td>

                                {/* Kolom 5: Email & Kata Sandi */}
                                <td className="py-4 px-4 border-r-[2.5px] border-black">
                                  <div className="space-y-1.5">
                                    <div className="flex items-center gap-1.5 text-xs">
                                      <Mail className="w-3.5 h-3.5 text-[#881337] shrink-0" />
                                      <span className="font-mono font-bold text-black break-all">
                                        {student.email}
                                      </span>
                                    </div>
                                    <div className="flex items-center gap-2 text-xs">
                                      <KeyRound className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                                      <span className="text-stone-700 font-bold">Sandi:</span>
                                      <span className="font-mono font-black text-[#881337] bg-[#fbf9f3] px-2 py-0.5 border border-black">
                                        {visiblePasswords[student.email] ? studentPassword : '••••••••'}
                                      </span>
                                      <button
                                        type="button"
                                        onClick={() => togglePasswordVisibility(student.email)}
                                        className="px-2 py-0.5 bg-white hover:bg-amber-100 text-black border border-black text-[11px] font-black transition-colors inline-flex items-center gap-1 shadow-[1px_1px_0px_#000000] cursor-pointer"
                                      >
                                        {visiblePasswords[student.email] ? (
                                          <>
                                            <EyeOff className="w-3 h-3" />
                                            <span>Tutup</span>
                                          </>
                                        ) : (
                                          <>
                                            <Eye className="w-3 h-3" />
                                            <span>Lihat</span>
                                          </>
                                        )}
                                      </button>
                                    </div>
                                  </div>
                                </td>

                                {/* Kolom 6: Riwayat & Nilai Kuis */}
                                <td className="py-4 px-4 text-center whitespace-nowrap border-r-[2.5px] border-black">
                                  {totalQuizzes > 0 ? (
                                    <div className="inline-flex flex-col items-center gap-1">
                                      <div className="flex items-center gap-1.5">
                                        <span className="text-xs font-black text-black">
                                          {totalQuizzes}x Kuis
                                        </span>
                                        <span aria-hidden="true" className="text-stone-400">·</span>
                                        <span className={`px-2 py-0.5 border-2 text-xs font-black shadow-[2px_2px_0px_#000000] ${avgScoreColor}`} title="Rata-rata nilai">
                                          Rata-rata: {avgScore}
                                        </span>
                                      </div>
                                      <div className="flex items-center gap-2 text-[11px] text-stone-700">
                                        <span>Tertinggi: <strong className="text-[#881337] font-black">{bestScore}</strong></span>
                                        <button
                                          type="button"
                                          onClick={() => setStudentDetailModal(student)}
                                          className="text-[#881337] underline hover:text-black font-black cursor-pointer"
                                        >
                                          Lihat Rincian
                                        </button>
                                      </div>
                                    </div>
                                  ) : (
                                    <span className="text-xs text-stone-500 italic">
                                      Belum ada nilai kuis
                                    </span>
                                  )}
                                </td>

                                {/* Kolom 7: Aksi Master */}
                                <td className="py-4 px-4 text-center whitespace-nowrap">
                                  <div className="inline-flex items-center justify-center gap-1.5">
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setStudentToResetPassword({ user: student, currentPassword: studentPassword });
                                        setNewPasswordInput('');
                                      }}
                                      className="py-1.5 px-2.5 bg-amber-100 hover:bg-amber-300 text-black border-2 border-black font-black text-xs transition-all inline-flex items-center gap-1 shadow-[2px_2px_0px_#000000] active:translate-x-[1px] active:translate-y-[1px] cursor-pointer"
                                      title="Ubah kata sandi murid ini"
                                    >
                                      <KeyRound className="w-3.5 h-3.5" />
                                      <span>Ubah Sandi</span>
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => setStudentToDelete(student)}
                                      className="py-1.5 px-2.5 bg-red-100 hover:bg-red-600 text-red-900 hover:text-white border-2 border-black font-black text-xs transition-all inline-flex items-center gap-1 shadow-[2px_2px_0px_#000000] active:translate-x-[1px] active:translate-y-[1px] cursor-pointer"
                                      title="Hapus akun murid ini"
                                    >
                                      <UserX className="w-3.5 h-3.5" />
                                      <span>Hapus</span>
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>

                    {/* TAMPILAN KARTU RESPONSIF (Layar HP / Mobile < md) — Setiap Murid Jadi Panel Komik Terpisah oleh Gutter */}
                    <div className="md:hidden bg-[#f1ebe0] p-3.5 space-y-4">
                      {filteredStudents.map((student, idx) => {
                        const studentScores = allScores.filter(s => s.userEmail.toLowerCase() === student.email.toLowerCase());
                        const totalQuizzes = studentScores.length;
                        const avgScore = totalQuizzes > 0
                          ? Math.round(studentScores.reduce((acc, s) => acc + s.score, 0) / totalQuizzes)
                          : null;

                        const cred = studentsCredentials.find(c => c.user.email.toLowerCase() === student.email.toLowerCase());
                        const studentPassword = cred ? cred.password : '••••••••';
                        const isOnline = storageService.isStudentOnline(student.email);
                        const lastOnlineInfo = storageService.getStudentLastOnlineDetails(student, nowMs);
                        const activityInfo = getLiveStudentActivity(student);
                        const displayFullName = student.fullName || student.name || student.nickname || 'Murid Terdaftar';
                        const displayNickname = student.nickname || displayFullName.split(/\s+/)[0] || '-';
                        const avatarInitial = displayFullName.charAt(0).toUpperCase();

                        let avgScoreColor = 'text-black bg-stone-100 border-stone-900';
                        if (avgScore !== null) {
                          if (avgScore >= 71) {
                            avgScoreColor = 'text-emerald-800 bg-emerald-100 border-stone-900';
                          } else if (avgScore >= 51) {
                            avgScoreColor = 'text-red-600 bg-red-100 border-stone-900';
                          }
                        }

                        return (
                          <div key={student.email} className="manga-subkoma-panel p-4 space-y-3 bg-white relative">
                            <MangaCornerTicks />
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-[#881337] border-2 border-stone-950 text-white flex items-center justify-center font-japanese font-black text-base shrink-0 shadow-[2px_2px_0px_#1c1917]">
                                  {avatarInitial}
                                </div>
                                <div>
                                  <div className="flex items-center gap-1.5 flex-wrap">
                                    <span className="text-xs font-mono font-black text-[#881337]">#{idx + 1}</span>
                                    <h3 className="text-sm font-black text-stone-950">{displayFullName}</h3>
                                  </div>
                                  <p className="text-xs text-stone-700 mt-0.5">
                                    Panggilan: <strong className="text-[#881337] font-black">{displayNickname}</strong> · {student.registeredAt || '2026-10-01'}
                                  </p>
                                </div>
                              </div>

                              {isOnline ? (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-100 text-emerald-950 border-2 border-stone-950 text-[11px] font-black shrink-0">
                                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-ping" />
                                  <span>Online</span>
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-stone-100 text-stone-700 border-2 border-stone-950 text-[11px] font-bold shrink-0">
                                  <span className="w-1.5 h-1.5 rounded-full bg-stone-400" />
                                  <span>Offline</span>
                                </span>
                              )}
                            </div>

                            {/* Jam & Tanggal Terakhir Murid Online / Belajar di Mobile */}
                            <div
                              className={`p-3 border-2 border-stone-950 shadow-[2px_2px_0px_#1c1917] text-xs space-y-1.5 ${
                                isOnline
                                  ? 'bg-emerald-50'
                                  : 'bg-[#fbf9f3]'
                              }`}
                            >
                              <div className="flex items-center justify-between gap-2">
                                <span className="text-[10px] font-black uppercase tracking-wider text-[#881337]">
                                  🕒 Terakhir Online / Belajar:
                                </span>
                                <span
                                  className={`text-[10px] font-black px-2 py-0.5 border border-stone-950 ${
                                    isOnline
                                      ? 'bg-emerald-600 text-white'
                                      : 'bg-white text-stone-800'
                                  }`}
                                >
                                  {lastOnlineInfo.relativeTimeLabel}
                                </span>
                              </div>
                              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 pt-0.5">
                                <span className="inline-flex items-center gap-1 font-black text-stone-950">
                                  <Calendar className="w-3.5 h-3.5 text-[#881337]" />
                                  <span>{lastOnlineInfo.formattedDayDate}</span>
                                </span>
                                <span className="inline-flex items-center gap-1 font-mono font-black text-[#881337]">
                                  <Clock className="w-3.5 h-3.5 text-amber-700" />
                                  <span>Pukul {lastOnlineInfo.formattedTime}</span>
                                </span>
                              </div>
                            </div>

                            {/* Aktivitas Live di Mobile */}
                            <div className="p-2.5 bg-[#fbf9f3] border-2 border-stone-950 text-xs space-y-1.5">
                              <div className="font-black text-[#881337]">{activityInfo.badgeText}</div>
                              {(activityInfo.screenshotAttempts > 0 || activityInfo.aiTranslateAttempts > 0) && (
                                <div className="flex flex-wrap gap-1.5">
                                  {activityInfo.screenshotAttempts > 0 && (
                                    <span className="px-2 py-0.5 bg-rose-600 text-white text-[10px] font-black">
                                      📸 Mencoba Screenshot: {activityInfo.screenshotAttempts}x
                                    </span>
                                  )}
                                  {activityInfo.aiTranslateAttempts > 0 && (
                                    <span className="px-2 py-0.5 bg-amber-600 text-white text-[10px] font-black">
                                      🤖 Mencoba Terjemahan Otomatis: {activityInfo.aiTranslateAttempts}x
                                    </span>
                                  )}
                                </div>
                              )}
                              <div className="text-[10px] text-stone-600 mt-0.5">{activityInfo.subText}</div>
                            </div>

                            <div className="bg-[#fbf9f3] border-2 border-stone-950 p-3 space-y-1.5 text-xs">
                              <div className="flex items-center gap-1.5">
                                <Mail className="w-3.5 h-3.5 text-[#881337] shrink-0" />
                                <span className="font-mono font-bold text-stone-950 break-all">{student.email}</span>
                              </div>
                              <div className="flex items-center justify-between gap-2 pt-1 border-t border-stone-300">
                                <div className="flex items-center gap-1.5">
                                  <KeyRound className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                                  <span className="text-stone-700 font-bold">Sandi:</span>
                                  <span className="font-mono font-black text-[#881337]">
                                    {visiblePasswords[student.email] ? studentPassword : '••••••••'}
                                  </span>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => togglePasswordVisibility(student.email)}
                                  className="px-2 py-0.5 bg-white border border-stone-950 text-[11px] font-black text-[#881337]"
                                >
                                  {visiblePasswords[student.email] ? 'Tutup' : 'Lihat'}
                                </button>
                              </div>
                            </div>

                            <div className="flex items-center justify-between text-xs bg-white border-2 border-stone-950 px-3 py-2">
                              <span className="font-black text-stone-950">Riwayat: {totalQuizzes}x Kuis</span>
                              {avgScore !== null ? (
                                <div className="flex items-center gap-2">
                                  <span className={`px-2 py-0.5 border font-black ${avgScoreColor}`}>
                                    Rata-rata: {avgScore}
                                  </span>
                                  <button
                                    type="button"
                                    onClick={() => setStudentDetailModal(student)}
                                    className="text-[#881337] underline font-black"
                                  >
                                    Rincian
                                  </button>
                                </div>
                              ) : (
                                <span className="text-stone-500 italic">Belum ada nilai</span>
                              )}
                            </div>

                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => {
                                  setStudentToResetPassword({ user: student, currentPassword: studentPassword });
                                  setNewPasswordInput('');
                                }}
                                className="flex-1 py-2 px-3 bg-amber-100 text-stone-950 border-2 border-stone-950 font-black text-xs flex items-center justify-center gap-1.5 shadow-[2px_2px_0px_#1c1917]"
                              >
                                <KeyRound className="w-3.5 h-3.5" />
                                <span>Ubah Sandi</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => setStudentToDelete(student)}
                                className="flex-1 py-2 px-3 bg-red-100 text-red-900 border-2 border-stone-950 font-black text-xs flex items-center justify-center gap-1.5 shadow-[2px_2px_0px_#1c1917]"
                              >
                                <UserX className="w-3.5 h-3.5" />
                                <span>Hapus Murid</span>
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
          </>
        )}

        {/* =========================================================================
            KOMA 06 (PANEL KLIMAKS MANGA): NILAI & PERANKINGAN KUIS LIVE
            ========================================================================= */}
        {(subTab === 'all' || subTab === 'live_scores') && (
          <>
            <MangaGutterSeparator label="MANGA GUTTER 04 · PEMISAH PANEL PERANKINGAN & KUIS LIVE" jpLabel="【コマ間・試験実況区画】" />
            <div className="space-y-6">
              {/* Papan Peringkat Sesi Kuis (Top 3 Juara Sesi Ini) Gaya Panel Turnamen Manga */}
              {sortedCompletedRecords.length > 0 && (
                <div className="manga-koma-panel relative bg-white p-4 sm:p-6 overflow-hidden">
                  <MangaCornerTicks />
                  <MangaSpeedLinesBg />
                  <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 border-b-[3px] border-black pb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-amber-300 border-[2.5px] border-black flex items-center justify-center text-black shadow-[2px_2px_0px_#000000]">
                        <Trophy className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 bg-black text-amber-300 font-mono text-[10px] font-black">
                            表彰台 · TOP 3 PODIUM
                          </span>
                          <span className="font-japanese font-black text-xs text-[#881337]">
                            バァーン!!
                          </span>
                        </div>
                        <h3 className="text-sm sm:text-base font-black text-black font-japanese mt-0.5">
                          Papan Perankingan Sesi Kuis Saat Ini (Top 3)
                        </h3>
                      </div>
                    </div>

                    <button
                      onClick={() => setShowResetRankingModal(true)}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-amber-200 hover:bg-amber-300 text-black border-[2.5px] border-black text-xs font-black transition-all w-fit shadow-[3px_3px_0px_#000000] active:translate-x-[1px] active:translate-y-[1px] cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Reset Ranking Sesi Kuis</span>
                    </button>
                  </div>

                  {/* 3 Panel Juara Terpisah oleh Gutter */}
                  <div className="relative z-10 grid grid-cols-1 sm:grid-cols-3 gap-5 bg-[#f1ebe0] p-3.5 border-[3px] border-black">
                    {sortedCompletedRecords.slice(0, 3).map((rec, idx) => {
                      const medalIcon = idx === 0 ? '🥇' : idx === 1 ? '🥈' : '🥉';
                      const medalTitle = idx === 0 ? '第1位 · JUARA 1 (EMAS)' : idx === 1 ? '第2位 · JUARA 2 (PERAK)' : '第3位 · JUARA 3 (PERUNGGU)';
                      const cardBg = idx === 0 
                        ? 'bg-amber-100' 
                        : idx === 1 
                        ? 'bg-slate-100' 
                        : 'bg-orange-100';

                      return (
                        <div key={rec.id} className={`manga-subkoma-panel p-4 ${cardBg} flex items-center gap-3 relative`}>
                          <div className="text-3xl shrink-0">{medalIcon}</div>
                          <div className="flex-1 min-w-0">
                            <div className="text-[10px] font-black uppercase tracking-wider text-black font-mono">
                              {medalTitle}
                            </div>
                            <div className="font-black text-black text-sm truncate mt-0.5">
                              {rec.studentName}
                            </div>
                            <div className="text-xs text-stone-800 flex items-center gap-2 mt-0.5 font-bold">
                              <span>JLPT {rec.level}</span>
                              <span>•</span>
                              <span>Nilai: <strong className="text-[#881337] font-black">{rec.score}</strong></span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Filter Bar & Tabel Pantauan Sesi Kuis Live Gaya Panel Manga */}
              <div className="manga-koma-panel relative bg-white overflow-hidden">
                <MangaCornerTicks />
                <div className="bg-[#f1ebe0] border-b-[4px] border-black p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <span className="px-2 py-0.5 bg-black text-amber-300 font-mono text-[10px] font-black border border-black">
                      コマ 06 · LIVE EXAM LOG
                    </span>
                    <Activity className="w-4 h-4 text-[#881337]" />
                    <span className="text-xs sm:text-sm font-black text-black font-japanese">
                      Tabel Pantauan Sesi Kuis & Peringkat Live ({filteredRecords.length} Sesi)
                    </span>
                  </div>

                  {/* Filters & Reset Ranking Button */}
                  <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto justify-end">
                    <div className="flex items-center gap-1 bg-white p-1 border-[2.5px] border-black shadow-[2px_2px_0px_#000000] text-xs">
                      {(['all', 'in_progress', 'completed'] as const).map((st) => (
                        <button
                          key={st}
                          onClick={() => setFilterStatus(st)}
                          className={`px-3 py-1 font-black transition-all cursor-pointer ${
                            filterStatus === st
                              ? 'bg-black text-white'
                              : 'text-stone-800 hover:text-black'
                          }`}
                        >
                          {st === 'all' ? 'Semua' : st === 'in_progress' ? 'Sedang Kuis' : 'Selesai'}
                        </button>
                      ))}
                    </div>

                    <select
                      value={filterLevel}
                      onChange={(e) => setFilterLevel(e.target.value)}
                      className="px-3 py-1.5 bg-white border-[2.5px] border-black shadow-[2px_2px_0px_#000000] text-xs font-black text-black outline-hidden"
                    >
                      <option value="all">Semua Level</option>
                      <option value="N5">Level N5</option>
                      <option value="N4">Level N4</option>
                      <option value="N3">Level N3</option>
                      <option value="N2">Level N2</option>
                    </select>

                    <button
                      onClick={() => setShowResetRankingModal(true)}
                      className="px-3.5 py-1.5 bg-amber-300 hover:bg-amber-400 text-black border-[2.5px] border-black text-xs font-black shadow-[2px_2px_0px_#000000] transition-all flex items-center gap-1.5 shrink-0 active:translate-x-[1px] active:translate-y-[1px] cursor-pointer"
                      title="Reset papan perankingan untuk sesi kuis baru (tidak menghapus total kuis atau rapor murid)"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Reset Ranking Sesi</span>
                    </button>
                  </div>
                </div>

                <div className="overflow-x-auto bg-[#f1ebe0] p-3">
                  <table className="w-full text-left text-xs sm:text-sm bg-white border-[3px] border-black shadow-[4px_4px_0px_#000000]">
                    <thead>
                      <tr className="bg-[#e8dfd1] text-black border-b-[3px] border-black font-black">
                        <th className="py-3 px-3 text-center border-r-[2.5px] border-black">Peringkat</th>
                        <th className="py-3 px-4 border-r-[2.5px] border-black">Nama Murid</th>
                        <th className="py-3 px-3 border-r-[2.5px] border-black">Level Kuis</th>
                        <th className="py-3 px-3 border-r-[2.5px] border-black">Tanggal</th>
                        <th className="py-3 px-3 border-r-[2.5px] border-black">Jam Mulai</th>
                        <th className="py-3 px-3 border-r-[2.5px] border-black">Jam Selesai</th>
                        <th className="py-3 px-4 text-center border-r-[2.5px] border-black">Progres / Nilai Murid</th>
                        <th className="py-3 px-3 text-center">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y-[3px] divide-black">
                      {filteredRecords.length === 0 ? (
                        <tr>
                          <td colSpan={8} className="py-10 text-center text-stone-700 bg-white">
                            <div className="font-japanese font-black text-2xl text-stone-400 mb-1.5">「試験待機中...」</div>
                            <p className="font-black text-black">
                              Papan perankingan sesi ini belum memiliki rekaman kuis.
                            </p>
                            <p className="text-xs text-stone-600 mt-0.5">
                              Saat murid mulai mengerjakan kuis, nomor soal yang sedang dikerjakan dan perolehan nilai akan otomatis muncul secara live di tabel ini.
                            </p>
                          </td>
                        </tr>
                      ) : (
                        filteredRecords.map((rec) => (
                          <tr 
                            key={rec.id} 
                            className={`transition-colors ${
                              rec.status === 'in_progress' ? 'bg-amber-50/80 hover:bg-amber-100/60' : 'hover:bg-[#fbf9f3]'
                            }`}
                          >
                            <td className="py-3 px-3 text-center whitespace-nowrap border-r-[2.5px] border-black bg-[#fbf9f3]">
                              {renderRankBadge(rankMap.get(rec.id), rec.status)}
                            </td>

                            <td className="py-3 px-4 border-r-[2.5px] border-black">
                              <div className="flex flex-wrap items-center gap-1.5">
                                <span className="font-black text-black">
                                  {rec.studentName}
                                </span>
                                {rec.tabViolationsCount && rec.tabViolationsCount > 0 ? (
                                  <span 
                                    className="inline-flex items-center gap-1 px-2 py-0.5 bg-rose-100 text-rose-900 border border-black text-[10px] font-black shrink-0"
                                    title={`Peringatan: Murid terdeteksi berpindah tab / keluar jendela sebanyak ${rec.tabViolationsCount} kali`}
                                  >
                                    <ShieldAlert className="w-3 h-3 text-rose-600 shrink-0" />
                                    <span>{rec.tabViolationsCount}x Pindah Tab</span>
                                  </span>
                                ) : null}
                              </div>
                              <div className="text-[11px] text-stone-700 flex items-center gap-1 mt-0.5">
                                <span className="font-bold text-[#881337]">Panggilan: {rec.studentNickname}</span>
                              </div>
                            </td>

                            <td className="py-3 px-3 border-r-[2.5px] border-black">
                              <span className="px-2.5 py-1 bg-black text-white font-black text-xs shadow-[2px_2px_0px_#881337]">
                                JLPT {rec.level}
                              </span>
                            </td>

                            <td className="py-3 px-3 font-bold text-stone-800 whitespace-nowrap border-r-[2.5px] border-black">
                              <div className="flex items-center gap-1">
                                <Calendar className="w-3.5 h-3.5 text-[#881337]" />
                                <span>{rec.date}</span>
                              </div>
                            </td>

                            <td className="py-3 px-3 font-mono font-bold text-stone-800 whitespace-nowrap border-r-[2.5px] border-black">
                              <div className="flex items-center gap-1">
                                <Clock className="w-3.5 h-3.5 text-stone-600" />
                                <span>{rec.startedAtTime}</span>
                              </div>
                            </td>

                            <td className="py-3 px-3 whitespace-nowrap border-r-[2.5px] border-black">
                              {rec.status === 'in_progress' || !rec.completedAtTime ? (
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-200 text-black border-2 border-black text-xs font-black animate-pulse">
                                  <span className="w-2 h-2 rounded-full bg-amber-600 animate-ping" />
                                  sedang dikerjakan
                                </span>
                              ) : (
                                <div className="flex items-center gap-1 font-mono font-black text-emerald-800">
                                  <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                                  <span>{rec.completedAtTime}</span>
                                </div>
                              )}
                            </td>

                            <td className="py-3 px-4 text-center whitespace-nowrap border-r-[2.5px] border-black">
                              {renderScoreBadge(rec)}
                            </td>

                            <td className="py-3 px-3 text-center whitespace-nowrap">
                              <button
                                onClick={() => setRecordToDelete(rec)}
                                className="p-1.5 text-stone-700 hover:text-red-600 hover:bg-red-50 border-2 border-transparent hover:border-black transition-colors cursor-pointer"
                                title="Hapus rekaman ini"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Keterangan Skema Warna Nilai Gaya Panel Catatan Kaki Manga */}
              <div className="manga-koma-panel relative p-4 bg-white flex flex-wrap items-center justify-between gap-2 text-xs text-stone-800">
                <MangaCornerTicks />
                <span className="font-black text-black">🎨 【注釈コマ】 Aturan Pewarnaan Nilai Murid:</span>
                <div className="flex flex-wrap items-center gap-4">
                  <span className="inline-flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-black border border-black" />
                    <span><strong>0 – 50:</strong> Berwarna Hitam</span>
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-red-600 border border-black" />
                    <span><strong>51 – 70:</strong> Berwarna Merah</span>
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-emerald-600 border border-black" />
                    <span><strong>71 – 100:</strong> Berwarna Hijau</span>
                  </span>
                </div>
              </div>
            </div>
          </>
        )}
        </div>

        {/* GUTTER MANGA 05: PEMISAH ANTARA PANEL DATA & PANEL PENUTUP HALAMAN */}
        <MangaGutterSeparator label="MANGA GUTTER 05 · PENUTUP LEMBARAN (TSUZUKU)" jpLabel="【コマ間・頁末区画】" />

        {/* FOOTER PENUTUP LEMBARAN MANGA DENGAN TOMBOL INTERAKTIF BALIK HALAMAN */}
        <div className="manga-koma-panel relative bg-white px-4 py-3.5 flex flex-wrap items-center justify-between gap-3 text-xs font-mono font-black text-black">
          <MangaCornerTicks />
          <button
            type="button"
            onClick={() => handleStepMangaPage(-1)}
            className="px-3.5 py-1.5 bg-white hover:bg-amber-100 text-black border-[2.5px] border-black shadow-[3px_3px_0px_#000000] active:translate-x-[1px] active:translate-y-[1px] inline-flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>前の頁 (Balik ke Lembaran Sebelumnya)</span>
          </button>

          <span className="text-center font-black text-black">
            SENSEI SARI COMMAND MANGA EDITION · {currentMangaPageMeta.folio}
          </span>

          <button
            type="button"
            onClick={() => handleStepMangaPage(1)}
            className="px-4 py-1.5 bg-black hover:bg-[#881337] text-white border-[2.5px] border-black shadow-[3px_3px_0px_#881337] active:translate-x-[1px] active:translate-y-[1px] font-japanese inline-flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <span>つづく · 次の頁へ (Balik Halaman Berikutnya)</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* =========================================================================
          MODAL RINCIAN RIWAYAT KUIS MURID TERDAFTAR
          ========================================================================= */}
      {studentDetailModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="w-full max-w-lg bg-[#fbf9f3] border-[3px] border-stone-950 p-6 shadow-[8px_8px_0px_#1c1917] max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between gap-3 pb-4 border-b-2 border-stone-950">
              <div>
                <h3 className="text-lg font-black text-stone-950 font-japanese">
                  Rincian Nilai Kuis: {studentDetailModal.fullName || studentDetailModal.nickname}
                </h3>
                <p className="text-xs text-stone-700 font-mono font-bold">
                  {studentDetailModal.email}
                </p>
                {(() => {
                  const detailLastOnline = storageService.getStudentLastOnlineDetails(studentDetailModal, nowMs);
                  return (
                    <div className="mt-2 inline-flex flex-wrap items-center gap-2 px-3 py-1.5 bg-white border-2 border-stone-950 shadow-[2px_2px_0px_#1c1917] text-[11px] text-stone-900">
                      <span className="font-black text-[#881337]">🕒 Terakhir Online:</span>
                      <span className="font-extrabold">{detailLastOnline.formattedDayDate}</span>
                      <span>·</span>
                      <span className="font-mono font-black text-[#881337]">Pukul {detailLastOnline.formattedTime}</span>
                      <span className="text-stone-700">({detailLastOnline.relativeTimeLabel})</span>
                    </div>
                  );
                })()}
              </div>
              <button
                type="button"
                onClick={() => setStudentDetailModal(null)}
                className="px-3 py-1.5 bg-white hover:bg-stone-200 text-stone-950 border-2 border-stone-950 font-black text-xs shadow-[2px_2px_0px_#1c1917]"
              >
                Tutup
              </button>
            </div>

            <div className="overflow-y-auto my-4 flex-1 bg-white border-2 border-stone-950">
              {(() => {
                const stuScores = allScores.filter(
                  s => s.userEmail.toLowerCase() === studentDetailModal.email.toLowerCase()
                );
                if (stuScores.length === 0) {
                  return (
                    <p className="text-center text-xs text-stone-600 py-8 font-bold">
                      Murid ini belum memiliki riwayat pengerjaan kuis.
                    </p>
                  );
                }
                return (
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="bg-[#f3ece0] text-stone-950 border-b-2 border-stone-950 font-black">
                        <th className="py-2.5 px-3">Tanggal</th>
                        <th className="py-2.5 px-3">Level</th>
                        <th className="py-2.5 px-3 text-center">Benar</th>
                        <th className="py-2.5 px-3 text-center">Nilai</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-300">
                      {stuScores.map((sc) => (
                        <tr key={sc.id}>
                          <td className="py-2.5 px-3 font-mono font-bold text-stone-800">{sc.completedAt}</td>
                          <td className="py-2.5 px-3 font-black text-[#881337]">JLPT {sc.level}</td>
                          <td className="py-2.5 px-3 text-center font-bold text-stone-800">
                            {sc.correctCount} / {sc.totalQuestions}
                          </td>
                          <td className="py-2.5 px-3 text-center font-black text-sm">
                            <span
                              className={
                                sc.score >= 71
                                  ? 'text-emerald-700'
                                  : sc.score >= 51
                                  ? 'text-red-600'
                                  : 'text-black'
                              }
                            >
                              {sc.score}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                );
              })()}
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL KONFIRMASI HAPUS AKUN MURID
          ========================================================================= */}
      {studentToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-[#fbf9f3] border-[3px] border-stone-950 p-6 shadow-[8px_8px_0px_#1c1917]">
            <div className="w-12 h-12 bg-red-100 border-2 border-stone-950 text-red-600 flex items-center justify-center mx-auto mb-4 shadow-[3px_3px_0px_#1c1917]">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <h3 className="text-lg font-black text-stone-950 text-center font-japanese mb-2">
              Konfirmasi Hapus Akun Murid
            </h3>

            <p className="text-xs text-stone-700 text-center leading-relaxed mb-4">
              Apakah Sensei yakin ingin menghapus akun murid:
              <br />
              <strong className="text-base text-[#881337] font-black block mt-1">
                {studentToDelete.fullName || studentToDelete.nickname} ({studentToDelete.email})
              </strong>
            </p>

            <div className="p-3 bg-red-50 border-2 border-stone-950 text-[11px] text-red-900 mb-5 leading-relaxed font-semibold">
              ⚠️ <strong>Peringatan:</strong> Seluruh riwayat hasil kuis, rekaman sesi aktif, dan data profil murid ini akan <strong>otomatis terhapus bersih dan permanen</strong> dari sistem Sensei Sari.
            </div>

            <div className="flex items-center gap-2.5">
              <button
                onClick={() => setStudentToDelete(null)}
                className="flex-1 py-2.5 px-4 bg-white hover:bg-stone-200 text-stone-950 border-2 border-stone-950 font-black text-xs shadow-[3px_3px_0px_#1c1917]"
              >
                Batal
              </button>
              <button
                onClick={handleConfirmDeleteStudent}
                className="flex-1 py-2.5 px-4 bg-red-600 hover:bg-red-700 text-white border-2 border-stone-950 font-black text-xs shadow-[3px_3px_0px_#1c1917]"
              >
                Ya, Hapus Semua Data Murid
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL KONFIRMASI HAPUS SINGLE REKAMAN KUIS */}
      {recordToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-sm bg-[#fbf9f3] border-[3px] border-stone-950 p-5 shadow-[6px_6px_0px_#1c1917] text-center">
            <h4 className="text-sm font-black text-stone-950 mb-2">Hapus Rekaman Kuis Ini?</h4>
            <p className="text-xs text-stone-700 mb-4">
              Rekaman kuis {recordToDelete.studentName} ({recordToDelete.level}) pada {recordToDelete.date} akan dihapus.
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setRecordToDelete(null)}
                className="flex-1 py-2 bg-white text-stone-950 border-2 border-stone-950 font-black text-xs shadow-[2px_2px_0px_#1c1917]"
              >
                Batal
              </button>
              <button
                onClick={handleConfirmDeleteRecord}
                className="flex-1 py-2 bg-red-600 text-white border-2 border-stone-950 font-black text-xs shadow-[2px_2px_0px_#1c1917]"
              >
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL KONFIRMASI RESET RANKING SESI KUIS
          ========================================================================= */}
      {showResetRankingModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-[#fbf9f3] border-[3px] border-stone-950 p-6 sm:p-7 shadow-[8px_8px_0px_#1c1917]">
            <div className="flex items-center gap-3.5 mb-4">
              <div className="w-12 h-12 bg-amber-300 border-2 border-stone-950 flex items-center justify-center text-stone-950 text-2xl shrink-0 shadow-[3px_3px_0px_#1c1917]">
                🏆
              </div>
              <div>
                <h3 className="text-lg font-black text-stone-950 font-japanese">
                  Reset Ranking Sesi Kuis?
                </h3>
                <p className="text-xs text-stone-700 font-semibold">
                  Menyesuaikan & memulai papan peringkat untuk sesi kuis baru
                </p>
              </div>
            </div>

            <div className="p-4 bg-white border-2 border-stone-950 text-xs space-y-2.5 mb-5">
              <p className="font-black text-stone-950">
                Papan perankingan sesi ini akan dikosongkan agar siap digunakan untuk sesi pengerjaan kuis yang baru.
              </p>
              <div className="pt-2 border-t border-stone-300 space-y-1.5 text-stone-800">
                <div className="flex items-center gap-2">
                  <span className="text-emerald-700 font-black text-sm">✓</span>
                  <span><strong>Total Kuis Murid</strong> di Daftar Murid tetap aman & tidak berkurang.</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-emerald-700 font-black text-sm">✓</span>
                  <span><strong>Laporan Pribadi (Rapor)</strong> di akun master & akun murid tetap tersimpan 100%.</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-emerald-700 font-black text-sm">✓</span>
                  <span>Hanya rekaman live sesi ini yang diatur ulang ke posisi awal.</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <button
                onClick={() => setShowResetRankingModal(false)}
                className="flex-1 py-2.5 px-4 bg-white hover:bg-stone-200 text-stone-950 border-2 border-stone-950 font-black text-xs shadow-[3px_3px_0px_#1c1917]"
              >
                Batal
              </button>
              <button
                onClick={handleConfirmResetRanking}
                className="flex-1 py-2.5 px-4 bg-amber-300 hover:bg-amber-400 text-stone-950 border-2 border-stone-950 font-black text-xs shadow-[3px_3px_0px_#1c1917] flex items-center justify-center gap-2"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Ya, Reset Ranking Sesi</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL PERBAIKI KATA SANDI MURID (LUPA KATA SANDI)
          ========================================================================= */}
      {studentToResetPassword && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-[#fbf9f3] border-[3px] border-stone-950 p-6 sm:p-7 shadow-[8px_8px_0px_#1c1917]">
            <div className="flex items-center gap-3.5 mb-3">
              <div className="w-12 h-12 bg-amber-200 border-2 border-stone-950 flex items-center justify-center text-stone-950 text-xl shrink-0 shadow-[3px_3px_0px_#1c1917]">
                <KeyRound className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-black text-stone-950 font-japanese">
                  Perbaiki Kata Sandi Murid
                </h3>
                <p className="text-xs text-stone-700 font-semibold">
                  Khusus Akun Master: Langsung ubah kata sandi tanpa verifikasi email
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-100 border-2 border-stone-950 text-[11px] font-black text-emerald-950 w-fit mb-3">
              <Shield className="w-3.5 h-3.5 text-emerald-700" />
              <span>Hak Akses Master: Perubahan kata sandi langsung tanpa verifikasi email</span>
            </div>

            <div className="p-3.5 bg-white border-2 border-stone-950 text-xs space-y-1.5 mb-4">
              <div><strong>Nama Murid:</strong> {studentToResetPassword.user.fullName || studentToResetPassword.user.nickname}</div>
              <div><strong>Alamat Email:</strong> <span className="font-mono text-stone-800">{studentToResetPassword.user.email}</span></div>
              <div className="flex items-center gap-1.5 pt-0.5">
                <strong>Kata Sandi Saat Ini:</strong> 
                <span className="font-mono font-black text-[#881337] bg-amber-100 px-2 py-0.5 border border-stone-950">
                  {studentToResetPassword.currentPassword}
                </span>
              </div>
            </div>

            <div className="mb-5">
              <label className="block text-xs font-black text-stone-950 mb-1.5">
                Masukkan Kata Sandi Baru Murid <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Contoh: 1234 atau murid2026"
                  value={newPasswordInput}
                  onChange={(e) => setNewPasswordInput(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white border-2 border-stone-950 text-sm font-mono font-bold text-stone-950 outline-hidden shadow-[3px_3px_0px_#1c1917]"
                  autoFocus
                />
              </div>
              <span className="text-[10px] text-stone-700 font-semibold mt-1.5 block">
                Minimal 2 karakter. Murid dapat langsung masuk dengan kata sandi baru ini.
              </span>
            </div>

            <div className="flex items-center gap-2.5">
              <button
                onClick={() => setStudentToResetPassword(null)}
                className="flex-1 py-2.5 px-4 bg-white hover:bg-stone-200 text-stone-950 border-2 border-stone-950 font-black text-xs shadow-[3px_3px_0px_#1c1917]"
              >
                Batal
              </button>
              <button
                onClick={handleSaveNewStudentPassword}
                className="flex-1 py-2.5 px-4 bg-amber-300 hover:bg-amber-400 text-stone-950 border-2 border-stone-950 font-black text-xs shadow-[3px_3px_0px_#1c1917] flex items-center justify-center gap-1.5"
              >
                <CheckCircle className="w-3.5 h-3.5" />
                <span>Simpan & Perbaiki Sandi</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL TAMBAH / DAFTARKAN MURID BARU OLEH MASTER
          ========================================================================= */}
      {showAddStudentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-[#fbf9f3] border-[3px] border-stone-950 p-6 sm:p-7 shadow-[8px_8px_0px_#1c1917]">
            <div className="flex items-center gap-3.5 mb-4">
              <div className="w-12 h-12 bg-[#fae8eb] border-2 border-stone-950 flex items-center justify-center text-[#881337] text-xl shrink-0 shadow-[3px_3px_0px_#1c1917]">
                <UserPlus className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-black text-stone-950 font-japanese">
                  Daftarkan Murid Baru
                </h3>
                <p className="text-xs text-stone-700 font-semibold">
                  Tambahkan akun murid baru langsung ke Daftar Murid Sensei Sari
                </p>
              </div>
            </div>

            {addStudentError && (
              <div className="mb-4 p-3 bg-rose-100 border-2 border-stone-950 text-xs text-rose-950 font-black">
                ⚠️ {addStudentError}
              </div>
            )}

            <form onSubmit={handleAddStudentByMaster} className="space-y-3.5">
              <div>
                <label className="block text-xs font-black text-stone-950 mb-1">
                  Nama Lengkap Murid <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Kenji Pratama"
                  value={newStuFullName}
                  onChange={(e) => setNewStuFullName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white border-2 border-stone-950 text-sm font-bold text-stone-950 outline-hidden shadow-[2px_2px_0px_#1c1917]"
                />
              </div>

              <div>
                <label className="block text-xs font-black text-stone-950 mb-1">
                  Nama Panggilan <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Kenji"
                  value={newStuNickname}
                  onChange={(e) => setNewStuNickname(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white border-2 border-stone-950 text-sm font-bold text-stone-950 outline-hidden shadow-[2px_2px_0px_#1c1917]"
                />
              </div>

              <div>
                <label className="block text-xs font-black text-stone-950 mb-1">
                  Alamat Email Murid <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  required
                  placeholder="nama.murid@gmail.com"
                  value={newStuEmail}
                  onChange={(e) => setNewStuEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white border-2 border-stone-950 text-sm font-bold text-stone-950 outline-hidden shadow-[2px_2px_0px_#1c1917]"
                />
              </div>

              <div>
                <label className="block text-xs font-black text-stone-950 mb-1">
                  Kata Sandi Murid <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Minimal 2 karakter (contoh: 1234 / murid2026)"
                  value={newStuPassword}
                  onChange={(e) => setNewStuPassword(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white border-2 border-stone-950 text-sm font-mono font-bold text-stone-950 outline-hidden shadow-[2px_2px_0px_#1c1917]"
                />
              </div>

              <div className="flex items-center gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddStudentModal(false)}
                  className="flex-1 py-2.5 px-4 bg-white hover:bg-stone-200 text-stone-950 border-2 border-stone-950 font-black text-xs shadow-[3px_3px_0px_#1c1917]"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 px-4 bg-[#881337] hover:bg-[#70102d] text-white border-2 border-stone-950 font-black text-xs shadow-[3px_3px_0px_#1c1917] flex items-center justify-center gap-1.5"
                >
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span>Simpan Murid Baru</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
