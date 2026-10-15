import React, { useState, useEffect } from 'react';
import { User, ActiveQuizRecord, QuizControlState, QuizResult, StudentPresenceInfo } from '../types';
import { storageService } from '../services/storageService';
import { Users, Trash2, RefreshCw, Play, Square, AlertTriangle, CheckCircle, Search, Shield, ShieldAlert, UserX, Clock, Calendar, Activity, RotateCcw, Trophy, KeyRound, Eye, EyeOff, Mail, UserPlus, Radio, BookOpen, ChevronLeft, ChevronRight, Sparkles, Flame, Wind } from 'lucide-react';
import { BlackBullsLogo } from './BlackBullsLogo';
import { BlackCloverLogoBanner } from './BlackCloverAssets';
import { BlackCloverBackgroundScene } from './BlackCloverBackgroundScene';
import { MasterBlackCloverHeader } from './MasterBlackCloverHeader';
import { GoogleMeetRoom } from './GoogleMeetRoom';

interface MasterManagementViewProps {
  currentUser: User | null;
  onNavigateHome: () => void;
}

/**
 * Ornamen Sudut Grimoire Kuno Kerajaan Clover
 * Logam tembaga-emas dengan aksen magis.
 */
const GrimoireCornerClasp: React.FC<{ variant?: 'gold' | 'red' | 'green' }> = ({ variant = 'gold' }) => {
  const borderColor = variant === 'red' ? 'border-red-500/80' : variant === 'green' ? 'border-emerald-400/80' : 'border-amber-500/80';
  const dotColor = variant === 'red' ? 'bg-red-400' : variant === 'green' ? 'bg-emerald-300' : 'bg-amber-300';

  return (
    <>
      <span className={`pointer-events-none select-none absolute top-1.5 left-1.5 w-3.5 h-3.5 border-t-2 border-l-2 ${borderColor} z-20`} aria-hidden="true">
        <span className={`block w-1 h-1 ${dotColor} absolute -top-0.5 -left-0.5`} />
      </span>
      <span className={`pointer-events-none select-none absolute top-1.5 right-1.5 w-3.5 h-3.5 border-t-2 border-r-2 ${borderColor} z-20`} aria-hidden="true">
        <span className={`block w-1 h-1 ${dotColor} absolute -top-0.5 -right-0.5`} />
      </span>
      <span className={`pointer-events-none select-none absolute bottom-1.5 left-1.5 w-3.5 h-3.5 border-b-2 border-l-2 ${borderColor} z-20`} aria-hidden="true">
        <span className={`block w-1 h-1 ${dotColor} absolute -bottom-0.5 -left-0.5`} />
      </span>
      <span className={`pointer-events-none select-none absolute bottom-1.5 right-1.5 w-3.5 h-3.5 border-b-2 border-r-2 ${borderColor} z-20`} aria-hidden="true">
        <span className={`block w-1 h-1 ${dotColor} absolute -bottom-0.5 -right-0.5`} />
      </span>
    </>
  );
};

/**
 * Garis Pemisah Mantra Grimoire Berkilau (Grimoire Arcane Divider)
 */
const GrimoireRunicDivider: React.FC<{ label: string; jpLabel: string; variant?: 'gold' | 'red' | 'green' }> = ({ label, jpLabel, variant = 'gold' }) => {
  const lineGlow = variant === 'red' 
    ? 'via-red-500/60 to-red-600/90' 
    : variant === 'green' 
    ? 'via-emerald-400/60 to-emerald-500/90' 
    : 'via-amber-400/60 to-amber-500/90';
  const badgeBorder = variant === 'red'
    ? 'border-red-600 bg-stone-950 text-red-300 shadow-[0_0_15px_rgba(239,68,68,0.3)]'
    : variant === 'green'
    ? 'border-emerald-600 bg-stone-950 text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.3)]'
    : 'border-amber-600 bg-stone-950 text-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.3)]';

  return (
    <div className="my-6 py-2 flex items-center justify-between gap-3 select-none" aria-hidden="true">
      <div className={`flex-1 h-[2px] bg-gradient-to-r from-transparent ${lineGlow}`} />
      <div className={`flex items-center gap-2 px-3.5 py-1 border-2 font-mono text-[10px] uppercase tracking-widest ${badgeBorder}`}>
        <span className="text-amber-400 text-xs">☘️</span>
        <span className="font-black">{label}</span>
        <span className="text-stone-500 font-bold">·</span>
        <span className="font-japanese font-black text-[11px] text-amber-300">{jpLabel}</span>
        <span className="text-amber-400 text-xs">☘️</span>
      </div>
      <div className={`flex-1 h-[2px] bg-gradient-to-l from-transparent ${lineGlow}`} />
    </div>
  );
};

export const MasterManagementView: React.FC<MasterManagementViewProps> = ({ currentUser }) => {
  const [subTab, setSubTab] = useState<'all' | 'student_list' | 'live_scores' | 'meet_sync'>('all');
  const [showRegisteredStudentsTable, setShowRegisteredStudentsTable] = useState<boolean>(true);
  const [pageTurnDirection, setPageTurnDirection] = useState<'next' | 'prev'>('next');
  const [pageTurnKey, setPageTurnKey] = useState<number>(0);
  const [komaFlipKey, setKomaFlipKey] = useState<number>(0);
  const [isTurningPage, setIsTurningPage] = useState<boolean>(false);

  const MANGA_TAB_ORDER: ('all' | 'student_list' | 'live_scores' | 'meet_sync')[] = ['all', 'student_list', 'live_scores', 'meet_sync'];

  const handleMangaPageChange = (
    targetTab: 'all' | 'student_list' | 'live_scores' | 'meet_sync',
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

  const currentGrimoireMeta =
    subTab === 'all'
      ? {
          folio: 'GRIMOIRE TOME · ALL REALMS OVERVIEW',
          jpChapter: '【魔導書総覧】師範統括・全域監視',
          affinity: 'ANTI-MAGIC & SPIRIT WIND',
          sfx: '✨ MANA SYNC',
        }
      : subTab === 'student_list'
      ? {
          folio: 'GRIMOIRE TOME · SQUAD ROSTER',
          jpChapter: '【生徒魔導名簿】最終学習時刻録',
          affinity: 'BLACK BULLS ARCHIVES',
          sfx: '📖 ROSTER OPEN',
        }
      : subTab === 'live_scores'
      ? {
          folio: 'GRIMOIRE TOME · TRIAL ARENA',
          jpChapter: '【昇格魔導試験】順位決定戦・即時記録',
          affinity: 'GOLDEN DAWN TRIALS',
          sfx: '⚔️ ARENA ENGAGED',
        }
      : {
          folio: 'GRIMOIRE TOME · SPATIAL MEET SANCTUM',
          jpChapter: '【空間通信の陣】リアルタイム会議',
          affinity: 'SPATIAL TELEPATHY',
          sfx: '🔮 REALM CONNECTED',
        };

  const currentMangaPageMeta = currentGrimoireMeta;
  
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
  const knownStudentEmailsRef = React.useRef<Set<string> | null>(null);

  // Add New Student Modal State (Master Direct Registration)
  const [showAddStudentModal, setShowAddStudentModal] = useState(false);
  const [newStuFullName, setNewStuFullName] = useState('');
  const [newStuNickname, setNewStuNickname] = useState('');
  const [newStuEmail, setNewStuEmail] = useState('');
  const [newStuPassword, setNewStuPassword] = useState('');
  const [addStudentError, setAddStudentError] = useState('');
  const [meetSyncData, setMeetSyncData] = useState(() => storageService.getMeetSyncRecord());

  const handlePerformMeetSync = () => {
    const res = storageService.syncMeetAttendanceAndDuration();
    setMeetSyncData(storageService.getMeetSyncRecord());
    setNotificationMsg(`Berhasil menyinkronkan ${res.syncedStudentsCount} murid dari ${res.totalSessions} sesi Google Meet ke Laporan Murid! 🌸`);
    setTimeout(() => setNotificationMsg(null), 4500);
  };

  // Load all data from storageService
  const loadData = () => {
    setActiveRecords(storageService.getActiveQuizRecords());
    const creds = storageService.getAllStudentsWithCredentials();
    setStudentsCredentials(creds);
    const loadedUsers = creds.map(c => c.user);
    setStudentsList(loadedUsers);

    // Deteksi otomatis murid baru yang baru saja mendaftar secara real-time
    const currentEmailSet = new Set(loadedUsers.map(u => u.email.toLowerCase()));
    if (knownStudentEmailsRef.current !== null) {
      const newlyRegistered = loadedUsers.filter(
        u => !knownStudentEmailsRef.current!.has(u.email.toLowerCase())
      );
      if (newlyRegistered.length > 0) {
        const latestNew = newlyRegistered[0];
        const displayName = latestNew.fullName || latestNew.nickname || latestNew.email;
        setNotificationMsg(
          `Murid baru "${displayName}" (${latestNew.email}) otomatis tersinkronisasi secara real-time ke Daftar Murid Master! 🌸`
        );
        setTimeout(() => setNotificationMsg(null), 5000);
      }
    }
    knownStudentEmailsRef.current = currentEmailSet;

    setPresenceMap(storageService.getOnlinePresenceMap());
    setQuizControl(storageService.getQuizControlState());
    setAllScores(storageService.getAllScores());
    setMeetSyncData(storageService.getMeetSyncRecord());
  };

  const handleManualSyncAndReload = async () => {
    await storageService.syncWithServer(true);
    loadData();
    setNotificationMsg('Data daftar murid, aktivitas live, & nilai kuis berhasil disinkronkan secara real-time! 🔄');
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
    loadData();
    storageService.syncWithServer(true).then(() => loadData());

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
    <div className="relative overflow-hidden py-4 sm:py-8 min-h-screen text-stone-100">
      {/* Ornamen Latar Black Clover (Asta, Yuno, Lambang Squad, Grimoire, Mahojin & Hujan Mana) Seperti di Beranda */}
      <BlackCloverBackgroundScene />

      {/* Container Utama: Responsif Lebar Penuh & Proporsional di Layar Tablet Landscape (1024px - 1280px+) */}
      <div className="relative z-10 w-full max-w-5xl md:max-w-6xl lg:max-w-7xl xl:max-w-[90rem] mx-auto px-3 sm:px-5 md:px-6 lg:px-8">
        {/* Toast Notification Gaya Balon Dialog Manga */}
        {notificationMsg && (
          <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 px-5 py-3 bg-stone-950 text-white font-black text-xs sm:text-sm rounded-none border-[3px] border-[#881337] shadow-[6px_6px_0px_#881337] animate-in fade-in slide-in-from-top-4 duration-300 flex items-center gap-2.5">
            <span className="px-2 py-0.5 bg-[#881337] text-amber-300 font-japanese text-xs">報せ!</span>
            <span>{notificationMsg}</span>
          </div>
        )}

        {/* =========================================================================
            HEADER RESMI BLACK CLOVER SANCTUM (LOGO BESAR & MENYATU DENGAN HALAMAN)
            ========================================================================= */}
        <MasterBlackCloverHeader
          quizIsActive={quizControl.isActive}
          masterName={currentUser?.nickname || 'skywalker'}
        />

        {/* =========================================================================
            TATA ULANG KOLOM PANEL UTAMA: GRID 2 KOLOM (KENDALI KUIS & NAVIGASI)
            - Dioptimalkan proporsional untuk Tablet Landscape (iPad / Android Tablet):
              * Kedua kartu memiliki tinggi seimbang (h-full flex flex-col justify-between)
              * Kolom 1 (Kiri): Kendali Sesi Kuis Master & Aksi Cepat
              * Kolom 2 (Kanan): Navigasi Pantauan & Quick Telemetry Resonansi Sanctum
            ========================================================================= */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 mb-6 items-stretch">
          {/* KOLOM KIRI: PUSAT KENDALI KUIS MASTER (AKSEN AMBER / CRIMSON BANTENG HITAM) */}
          <div className="grimoire-card relative h-full p-4 sm:p-5 rounded-2xl border-2 border-amber-500/50 hover:border-amber-400/80 bg-stone-950/25 backdrop-blur-[2px] shadow-lg flex flex-col justify-between transition-all">
            <GrimoireCornerClasp variant="gold" />

            <div>
              {/* UCAPAN SELAMAT DATANG (DITARUH DI BAGIAN ATAS PANEL STATUS SESI KUIS) */}
              <div className="bg-stone-950/40 backdrop-blur-xs border border-amber-500/40 rounded-xl p-3 sm:p-3.5 mb-3.5 relative overflow-hidden shadow-sm">
                <div className="h-0.5 bg-gradient-to-r from-amber-400 via-rose-400 to-amber-300 absolute top-0 inset-x-0" />
                <div className="flex items-start gap-2.5">
                  <span className="text-base sm:text-lg select-none">🧙‍♀️</span>
                  <div className="min-w-0">
                    <h3 className="text-xs sm:text-sm font-bold text-amber-200">
                      Selamat Datang di Ruang Kendali Sensei Sari
                    </h3>
                    <p className="text-[11px] sm:text-xs text-stone-200 leading-relaxed font-medium mt-0.5">
                      Pantau kehadiran, kendalikan sesi ujian kuis secara live, dan kelola sinkronisasi kelas Kerajaan Clover secara real-time! ✨🍀
                    </p>
                  </div>
                </div>
              </div>

              {/* BARIS STATUS SESI KUIS */}
              <div className="flex items-center justify-between gap-2 border-b border-amber-500/30 pb-3 mb-3.5">
                <div className="flex items-center gap-2">
                  <span className="relative flex h-3 w-3">
                    {quizControl.isActive ? (
                      <>
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-400"></span>
                      </>
                    ) : (
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                    )}
                  </span>
                  <span className="text-xs font-black uppercase tracking-wider text-amber-200 font-mono">
                    STATUS SESI KUIS:
                  </span>
                  <span className={`text-xs font-black ${quizControl.isActive ? 'text-emerald-400' : 'text-red-400'}`}>
                    {quizControl.isActive ? '🟢 DIBUKA (Aktif)' : '🔴 DIKUNCI (Tutup)'}
                  </span>
                </div>
                <span className="text-[11px] font-mono text-amber-300/80 hidden sm:inline-block">
                  Master: {currentUser?.nickname || 'skywalker'}
                </span>
              </div>

              {/* Tombol Utama Buka / Kunci Kuis */}
              <button
                onClick={handleToggleQuizSession}
                className={`w-full py-3 px-4 rounded-xl font-black text-xs sm:text-sm transition-all flex items-center justify-center gap-2 text-white cursor-pointer transform hover:scale-[1.01] active:scale-[0.99] border-2 shadow-md ${
                  quizControl.isActive
                    ? 'bg-red-900/75 hover:bg-red-800/85 border-red-500 shadow-[0_0_20px_rgba(220,38,38,0.35)]'
                    : 'bg-emerald-900/75 hover:bg-emerald-800/85 border-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.35)]'
                }`}
              >
                {quizControl.isActive ? (
                  <>
                    <Square className="w-4 h-4 fill-white text-white" />
                    <span>Kunci / Tutup Sesi Ujian Kuis Sekarang</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 fill-white text-white" />
                    <span>Buka Sesi Ujian Kuis Sekarang (Murid Bisa Mengerjakan)</span>
                  </>
                )}
              </button>
            </div>

            {/* Tombol Aksi Cepat: Tambah Murid & Sinkronkan Data */}
            <div className="grid grid-cols-2 gap-2.5 mt-3 pt-3 border-t border-amber-500/20">
              <button
                onClick={() => {
                  setAddStudentError('');
                  setShowAddStudentModal(true);
                }}
                className="py-2.5 px-3 bg-emerald-950/60 hover:bg-emerald-900/80 text-emerald-200 font-bold border border-emerald-500/60 rounded-xl text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer backdrop-blur-xs"
              >
                <UserPlus className="w-3.5 h-3.5 text-emerald-400" />
                <span>+ Tambah Murid</span>
              </button>
              <button
                onClick={handleManualSyncAndReload}
                className="py-2.5 px-3 bg-stone-950/60 hover:bg-stone-900/80 text-amber-300 font-bold border border-amber-500/50 rounded-xl text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer backdrop-blur-xs"
              >
                <RefreshCw className="w-3.5 h-3.5 text-amber-400" />
                <span>Sinkronkan Data</span>
              </button>
            </div>
          </div>

          {/* KOLOM KANAN: NAVIGASI PANTAUAN & PESAN MASTER (AKSEN EMERALD / GOLD FAJAR EMAS) */}
          <div className="grimoire-card relative h-full p-4 sm:p-5 rounded-2xl border-2 border-emerald-500/50 hover:border-emerald-400/80 bg-stone-950/25 backdrop-blur-[2px] shadow-lg flex flex-col justify-between transition-all">
            <GrimoireCornerClasp variant="green" />

            <div>
              {/* HEADER PANEL PANTAUAN */}
              <div className="bg-stone-950/30 backdrop-blur-xs border border-emerald-500/30 rounded-xl p-3 sm:p-3.5 mb-3.5 relative overflow-hidden">
                <div className="h-0.5 bg-gradient-to-r from-emerald-400 via-amber-300 to-teal-400 absolute top-0 inset-x-0" />
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-base select-none">📊</span>
                    <div>
                      <h3 className="text-xs sm:text-sm font-bold text-emerald-200">
                        Pantauan Aktivitas Murid Kerajaan Clover
                      </h3>
                      <p className="text-[11px] text-stone-300">
                        Total {studentsList.length} Murid Terdaftar • {activeRecords.length} Data Kuis Aktif
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* SELECTOR TAB NAVIGASI 4 TOMBOL (GRID 2x2 YANG RAMPING) */}
              <div>
                <div className="text-[11px] font-bold text-emerald-300 uppercase tracking-wider mb-2 flex items-center justify-between">
                  <span className="flex items-center gap-1">
                    <span>🍀</span>
                    <span>NAVIGASI PANTAUAN</span>
                  </span>
                  <span className="text-[10px] font-mono text-emerald-400/80">Pilih Tampilan:</span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => handleMangaPageChange('all')}
                    className={`py-2 px-2.5 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-1.5 border cursor-pointer ${
                      subTab === 'all'
                        ? 'bg-amber-500 text-stone-950 border-amber-300 shadow-sm ring-2 ring-amber-400/40 scale-[1.02]'
                        : 'bg-stone-900/45 hover:bg-stone-850/70 text-stone-300 border-stone-800 hover:border-emerald-500/50 backdrop-blur-xs'
                    }`}
                  >
                    <Radio className="w-3.5 h-3.5" />
                    <span>Semua Panel</span>
                  </button>

                  <button
                    onClick={() => handleMangaPageChange('student_list')}
                    className={`py-2 px-2.5 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-1.5 border cursor-pointer ${
                      subTab === 'student_list'
                        ? 'bg-amber-500 text-stone-950 border-amber-300 shadow-sm ring-2 ring-amber-400/40 scale-[1.02]'
                        : 'bg-stone-900/45 hover:bg-stone-850/70 text-stone-300 border-stone-800 hover:border-emerald-500/50 backdrop-blur-xs'
                    }`}
                  >
                    <Users className="w-3.5 h-3.5" />
                    <span>Daftar Murid</span>
                    <span className="text-[10px] px-1 py-0.2 bg-black/40 rounded-full font-mono">
                      {studentsList.length}
                    </span>
                  </button>

                  <button
                    onClick={() => handleMangaPageChange('live_scores')}
                    className={`py-2 px-2.5 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-1.5 border cursor-pointer ${
                      subTab === 'live_scores'
                        ? 'bg-amber-500 text-stone-950 border-amber-300 shadow-sm ring-2 ring-amber-400/40 scale-[1.02]'
                        : 'bg-stone-900/45 hover:bg-stone-850/70 text-stone-300 border-stone-800 hover:border-emerald-500/50 backdrop-blur-xs'
                    }`}
                  >
                    <Activity className="w-3.5 h-3.5" />
                    <span>Kuis Live</span>
                    <span className="text-[10px] px-1 py-0.2 bg-black/40 rounded-full font-mono">
                      {activeRecords.length}
                    </span>
                  </button>

                  <button
                    onClick={() => handleMangaPageChange('meet_sync')}
                    className={`py-2 px-2.5 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-1.5 border cursor-pointer ${
                      subTab === 'meet_sync'
                        ? 'bg-amber-500 text-stone-950 border-amber-300 shadow-sm ring-2 ring-amber-400/40 scale-[1.02]'
                        : 'bg-stone-900/45 hover:bg-stone-850/70 text-stone-300 border-stone-800 hover:border-emerald-500/50 backdrop-blur-xs'
                    }`}
                  >
                    <Clock className="w-3.5 h-3.5" />
                    <span>Ruang Meet</span>
                  </button>
                </div>
              </div>
            </div>

            {/* RINGKASAN RESONANSI SANCTUM (PENYEIMBANG PROPORSI TABLET LANDSCAPE & DESKTOP) */}
            <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-emerald-500/20">
              <div className="p-2 sm:p-2.5 bg-stone-950/40 border border-emerald-500/30 rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-emerald-300">
                  <Radio className="w-3.5 h-3.5 animate-pulse text-emerald-400" />
                  <span className="font-bold text-[11px]">Murid Online</span>
                </div>
                <span className="font-black text-emerald-200 font-mono text-xs">{onlineStudentsCount}</span>
              </div>
              <div className="p-2 sm:p-2.5 bg-stone-950/40 border border-emerald-500/30 rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-amber-300">
                  <Flame className="w-3.5 h-3.5 text-amber-400" />
                  <span className="font-bold text-[11px]">Kuis Aktif</span>
                </div>
                <span className="font-black text-amber-200 font-mono text-xs">{activeRecords.length}</span>
              </div>
            </div>
          </div>
        </div>

        {/* PEMISAH STATISTIK BERGAYA RUNIC ARKANUM */}
        <GrimoireRunicDivider label="STATISTIK REALM CLOVER" jpLabel="魔導統計" variant="gold" />

        {/* AREA PANEL DENGAN ANIMASI GRIMOIRE */}
        <div key={pageTurnKey} className="relative">

        {/* =========================================================================
            KARTU STATISTIK 3 KOLOM INTERAKTIF (TRANSPARAN DENGAN WARNA PEMBEDA)
            - Dioptimalkan proporsional untuk Tablet Landscape (sm:grid-cols-3):
              * Kolom 1 (Total Murid): Amber / Gold (Kerajaan Clover)
              * Kolom 2 (Sedang Online): Emerald / Green (Sihir Angin Roh Sylph)
              * Kolom 3 (Sedang Offline): Slate / Charcoal (Obsidian Anti-Sihir)
            ========================================================================= */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 sm:gap-4 mb-6 items-stretch">
          {/* KARTU KOLOM 01: TOTAL MURID TERDAFTAR (WARNA AMBER / GOLD) */}
          <div 
            onClick={() => {
              setFilterPresence('all');
              setKomaFlipKey((prev) => prev + 1);
            }}
            className={`h-full min-w-0 p-3.5 sm:p-4 lg:p-5 rounded-2xl transition-all cursor-pointer flex items-center justify-between gap-3 border-2 backdrop-blur-[2px] ${
              filterPresence === 'all'
                ? 'border-amber-400 bg-amber-950/40 shadow-[0_0_25px_rgba(245,158,11,0.3)] ring-2 ring-amber-500/50'
                : 'border-amber-500/40 bg-amber-950/20 hover:border-amber-400 hover:bg-amber-950/35 shadow-sm'
            }`}
          >
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-black uppercase tracking-wider text-amber-300 bg-amber-900/50 px-2 py-0.5 rounded-full border border-amber-500/50 backdrop-blur-xs">
                  Total Murid
                </span>
              </div>
              <div className="text-xl sm:text-2xl lg:text-3xl font-black text-amber-100 font-japanese truncate">
                {studentsList.length} <span className="text-xs sm:text-sm font-normal text-amber-300/80">Murid</span>
              </div>
              <p className="text-[11px] text-amber-300/70 mt-1 truncate">
                Seluruh akun murid terdaftar
              </p>
            </div>
            <div className="w-10 h-10 sm:w-11 sm:h-11 lg:w-12 lg:h-12 bg-amber-950/50 border-2 border-amber-500/70 rounded-xl flex items-center justify-center text-amber-400 shrink-0 shadow-[0_0_12px_rgba(245,158,11,0.25)] backdrop-blur-xs">
              <Users className="w-5 h-5 sm:w-6 sm:h-6 text-amber-400" />
            </div>
          </div>

          {/* KARTU KOLOM 02: SEDANG ONLINE & AKTIF (WARNA EMERALD / HIJAU) */}
          <div 
            onClick={() => {
              setFilterPresence(filterPresence === 'online' ? 'all' : 'online');
              setKomaFlipKey((prev) => prev + 1);
            }}
            className={`h-full min-w-0 p-3.5 sm:p-4 lg:p-5 rounded-2xl transition-all cursor-pointer flex items-center justify-between gap-3 border-2 backdrop-blur-[2px] ${
              filterPresence === 'online'
                ? 'border-emerald-400 bg-emerald-950/40 shadow-[0_0_25px_rgba(16,185,129,0.3)] ring-2 ring-emerald-500/50'
                : 'border-emerald-500/40 bg-emerald-950/20 hover:border-emerald-400 hover:bg-emerald-950/35 shadow-sm'
            }`}
            title="Klik untuk memfilter murid yang sedang online"
          >
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="relative flex h-2 w-2 shrink-0">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
                </span>
                <span className="text-[10px] font-black uppercase tracking-wider text-emerald-300 bg-emerald-900/50 px-2 py-0.5 rounded-full border border-emerald-500/50 backdrop-blur-xs truncate">
                  Sedang Online
                </span>
              </div>
              <div className="text-xl sm:text-2xl lg:text-3xl font-black text-emerald-100 font-japanese truncate">
                {onlineStudentsCount} <span className="text-xs sm:text-sm font-normal text-emerald-300/80">Murid</span>
              </div>
              <p className="text-[11px] text-emerald-400/80 mt-1 truncate">
                Aktif membuka aplikasi saat ini
              </p>
            </div>
            <div className="w-10 h-10 sm:w-11 sm:h-11 lg:w-12 lg:h-12 bg-emerald-950/50 border-2 border-emerald-500/70 rounded-xl flex items-center justify-center text-emerald-300 shrink-0 shadow-[0_0_12px_rgba(16,185,129,0.25)] backdrop-blur-xs">
              <Radio className="w-5 h-5 sm:w-6 sm:h-6 animate-pulse text-emerald-400" />
            </div>
          </div>

          {/* KARTU KOLOM 03: SEDANG OFFLINE (WARNA SLATE / CHARCOAL) */}
          <div 
            onClick={() => {
              setFilterPresence(filterPresence === 'offline' ? 'all' : 'offline');
              setKomaFlipKey((prev) => prev + 1);
            }}
            className={`h-full min-w-0 p-3.5 sm:p-4 lg:p-5 rounded-2xl transition-all cursor-pointer flex items-center justify-between gap-3 border-2 backdrop-blur-[2px] ${
              filterPresence === 'offline'
                ? 'border-slate-400 bg-slate-900/45 shadow-[0_0_25px_rgba(148,163,184,0.25)] ring-2 ring-slate-400/50'
                : 'border-slate-600/40 bg-slate-900/20 hover:border-slate-400 hover:bg-slate-900/35 shadow-sm'
            }`}
            title="Klik untuk memfilter murid yang sedang offline"
          >
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="w-2 h-2 rounded-full bg-slate-400 shrink-0"></span>
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-300 bg-slate-800/60 px-2 py-0.5 rounded-full border border-slate-600 truncate">
                  Sedang Offline
                </span>
              </div>
              <div className="text-xl sm:text-2xl lg:text-3xl font-black text-slate-100 font-japanese truncate">
                {offlineStudentsCount} <span className="text-xs sm:text-sm font-normal text-slate-400">Murid</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1 truncate">
                Tidak sedang membuka aplikasi
              </p>
            </div>
            <div className="w-10 h-10 sm:w-11 sm:h-11 lg:w-12 lg:h-12 bg-slate-900/70 border-2 border-slate-600 rounded-xl flex items-center justify-center text-slate-300 shrink-0 shadow-sm">
              <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-slate-400" />
            </div>
          </div>
        </div>

        {/* =========================================================================
            GRIMOIRE STUDENT ROSTER: DAFTAR SEMUA MURID & PEMANTAUAN AKTIVITAS LIVE
            ========================================================================= */}
        {(subTab === 'all' || subTab === 'student_list') && (
          <>
            <GrimoireRunicDivider label="CLOVER SQUAD STUDENT ROSTER" jpLabel="魔法騎士団名簿" variant="gold" />
            <div key={`roster_${komaFlipKey}`} className="grimoire-card relative overflow-hidden rounded-2xl border-2 border-amber-500/40 shadow-lg bg-stone-950/25 backdrop-blur-[2px]">
              <GrimoireCornerClasp variant="gold" />
              
              {/* Header Bar Daftar Murid Gaya Bab Grimoire (Transparan Emas/Amber) */}
              <div className="bg-amber-950/30 backdrop-blur-xs text-stone-100 border-b border-amber-600/40 px-4 sm:px-5 py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-amber-950/80 border-2 border-amber-500 text-amber-300 flex items-center justify-center shrink-0 font-japanese font-black text-lg shadow-[0_0_12px_rgba(245,158,11,0.3)] rounded-md">
                    名
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="px-2 py-0.5 bg-amber-950/80 text-amber-300 font-mono text-[10px] font-black uppercase border border-amber-600 rounded-xs">
                        ARSIP ROSTER · TOME 02
                      </span>
                      <span className="font-japanese text-xs text-amber-400 font-black">
                        【生徒魔導名簿・最終学習時刻】
                      </span>
                    </div>
                    <h2 className="text-sm sm:text-base font-black text-stone-100 font-japanese flex items-center gap-2 flex-wrap mt-0.5">
                      <span>Daftar Seluruh Murid Terdaftar & Pantauan Resonansi Live</span>
                      <span className="px-2.5 py-0.5 bg-red-950/80 text-red-200 border border-red-600 text-[11px] font-black rounded-xs">
                        {studentsList.length} Murid
                      </span>
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-emerald-950/80 text-emerald-300 border border-emerald-500 text-[10px] font-black rounded-xs">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                        <span>AUTO-SYNC REAL-TIME AKTIF</span>
                      </span>
                    </h2>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setShowRegisteredStudentsTable((prev) => !prev)}
                  className={`px-3.5 py-2 border font-black text-xs transition-all flex items-center justify-center gap-1.5 shrink-0 rounded-xs cursor-pointer ${
                    showRegisteredStudentsTable
                      ? 'bg-stone-900/70 hover:bg-stone-850 text-stone-200 border-stone-700'
                      : 'bg-amber-600 hover:bg-amber-500 text-stone-950 border-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.4)]'
                  }`}
                >
                  {showRegisteredStudentsTable ? (
                    <>
                      <EyeOff className="w-3.5 h-3.5 text-stone-400" />
                      <span>Sembunyikan Tabel</span>
                    </>
                  ) : (
                    <>
                      <Eye className="w-3.5 h-3.5 text-stone-950" />
                      <span>Buka Tabel Murid</span>
                    </>
                  )}
                </button>
              </div>

              {!showRegisteredStudentsTable ? (
                <div className="p-8 sm:p-10 text-center bg-stone-950/40 backdrop-blur-sm">
                  <div className="w-12 h-12 bg-stone-900/80 border-2 border-amber-600 shadow-[0_0_15px_rgba(245,158,11,0.2)] text-amber-400 flex items-center justify-center mx-auto mb-3 rounded-md">
                    <EyeOff className="w-6 h-6" />
                  </div>
                  <h3 className="text-sm sm:text-base font-black text-stone-100 font-japanese">
                    Tabel Murid Ditutup Sementara
                  </h3>
                  <p className="text-xs text-stone-400 max-w-md mx-auto mt-1 mb-4 leading-relaxed">
                    Klik tombol di bawah untuk membuka kembali arsip daftar seluruh murid beserta catatan jam terakhir belajar & aktivitas live mereka.
                  </p>
                  <button
                    type="button"
                    onClick={() => setShowRegisteredStudentsTable(true)}
                    className="px-5 py-2.5 bg-amber-600 hover:bg-amber-500 text-stone-950 font-black text-xs border border-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.4)] inline-flex items-center gap-2 cursor-pointer rounded-xs"
                  >
                    <Eye className="w-4 h-4" />
                    <span>Buka Arsip Tabel Murid</span>
                  </button>
                </div>
              ) : (
                <div>
                  {/* Sub-Panel Filter & Pencarian Murid */}
                  <div className="bg-stone-900/50 backdrop-blur-sm border-b border-stone-800 p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
                    <div className="flex items-center gap-2 flex-wrap w-full sm:w-auto">
                      <span className="px-2 py-1 bg-stone-950 text-amber-300 text-[11px] font-black uppercase tracking-wider font-mono border border-stone-800 rounded-xs">
                        FILTER SQUAD:
                      </span>
                      <div className="flex items-center gap-1.5 bg-stone-950 p-1 border border-stone-800 text-xs rounded-xs">
                        <button
                          onClick={() => setFilterPresence('all')}
                          className={`px-3 py-1 font-black transition-all cursor-pointer rounded-xs ${
                            filterPresence === 'all'
                              ? 'bg-amber-600 text-stone-950 shadow-[0_0_10px_rgba(245,158,11,0.3)]'
                              : 'text-stone-400 hover:text-stone-200'
                          }`}
                        >
                          Semua ({studentsList.length})
                        </button>
                        <button
                          onClick={() => setFilterPresence('online')}
                          className={`px-3 py-1 font-black transition-all flex items-center gap-1.5 cursor-pointer rounded-xs ${
                            filterPresence === 'online'
                              ? 'bg-emerald-600 text-white shadow-[0_0_10px_rgba(16,185,129,0.3)]'
                              : 'text-emerald-400/80 hover:text-emerald-300'
                          }`}
                        >
                          <span className="w-2 h-2 rounded-full bg-emerald-400" />
                          <span>Online ({onlineStudentsCount})</span>
                        </button>
                        <button
                          onClick={() => setFilterPresence('offline')}
                          className={`px-3 py-1 font-black transition-all flex items-center gap-1.5 cursor-pointer rounded-xs ${
                            filterPresence === 'offline'
                              ? 'bg-stone-800 text-stone-200'
                              : 'text-stone-500 hover:text-stone-300'
                          }`}
                        >
                          <span className="w-2 h-2 rounded-full bg-stone-500" />
                          <span>Offline ({offlineStudentsCount})</span>
                        </button>
                      </div>
                    </div>

                    {/* Search Input Gaya Grimoire */}
                    <div className="relative w-full sm:w-80">
                      <Search className="w-4 h-4 text-amber-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Cari nama murid, panggilan, atau email..."
                        className="w-full pl-10 pr-3.5 py-2 bg-stone-950 border border-amber-600/60 focus:border-amber-400 text-xs sm:text-sm font-bold text-stone-100 placeholder:text-stone-500 outline-hidden rounded-xs"
                      />
                    </div>
                  </div>

                  {filteredStudents.length === 0 ? (
                    <div className="p-10 text-center text-stone-400 bg-stone-950/80">
                      <div className="font-japanese font-black text-2xl text-stone-600 mb-2">「データなし」</div>
                      <p className="font-black text-sm text-stone-300">Belum ada murid yang cocok dengan filter pencarian.</p>
                      <p className="text-xs text-stone-500 mt-1">Klik tombol "Semua" atau "+ Tambah Murid" untuk menambahkan murid baru ke Grimoire.</p>
                    </div>
                  ) : (
                    <>
                      {/* TAMPILAN TABEL DESKTOP & TABLET LANDSCAPE (md ke atas) — Gaya Arsip Grimoire Transparan Kaca */}
                      <div className="hidden md:block overflow-x-auto bg-stone-950/15 backdrop-blur-[2px] p-2.5 sm:p-3 lg:p-4">
                        <table className="w-full text-left text-xs sm:text-sm bg-stone-950/25 backdrop-blur-[2px] border border-stone-800/60 rounded-md overflow-hidden table-auto">
                          <thead>
                            <tr className="bg-amber-950/40 backdrop-blur-xs text-amber-300 border-b border-amber-600/50 font-black text-xs uppercase tracking-wider">
                              <th className="py-3 px-2 sm:px-3 text-center w-10 sm:w-12 border-r border-stone-800/60 shrink-0">No</th>
                              <th className="py-3 px-3 sm:px-4 border-r border-stone-800/60 min-w-[170px] lg:min-w-[190px]">Identitas Murid Terdaftar</th>
                              <th className="py-3 px-2.5 sm:px-3 border-r border-stone-800/60 min-w-[150px] lg:min-w-[175px]">Terakhir Online (Waktu Belajar)</th>
                              <th className="py-3 px-2.5 sm:px-3 text-center border-r border-stone-800/60 min-w-[150px] lg:min-w-[175px]">Status & Resonansi Live</th>
                              <th className="py-3 px-3 sm:px-4 border-r border-stone-800/60 min-w-[150px] lg:min-w-[175px]">Email & Kata Sandi Akun</th>
                              <th className="py-3 px-2.5 sm:px-4 text-center border-r border-stone-800/60 min-w-[110px] lg:min-w-[130px]">Riwayat & Skor Ujian</th>
                              <th className="py-3 px-2.5 sm:px-4 text-center min-w-[125px] lg:min-w-[145px]">Aksi Master</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-stone-800/40">
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

                            let avgScoreColor = 'text-stone-300 bg-stone-950/50 border-stone-800';
                            if (avgScore !== null) {
                              if (avgScore >= 71) {
                                avgScoreColor = 'text-emerald-300 bg-emerald-950/50 border-emerald-600';
                              } else if (avgScore >= 51) {
                                avgScoreColor = 'text-red-300 bg-red-950/50 border-red-600';
                              }
                            }

                            return (
                              <tr
                                key={student.email}
                                className={`transition-colors ${
                                  activityInfo.isTakingQuiz
                                    ? 'bg-amber-950/25 hover:bg-amber-950/40'
                                    : 'hover:bg-amber-950/30 bg-stone-950/20'
                                }`}
                              >
                                {/* Kolom 1: Nomor Urut */}
                                <td className="py-3.5 px-3 text-center font-mono font-black text-amber-400 border-r border-stone-800/60 bg-stone-950/35">
                                  #{idx + 1}
                                </td>

                                {/* Kolom 2: Identitas Murid Terdaftar */}
                                <td className="py-4 px-4 border-r border-stone-800">
                                  <div className="flex items-center gap-3">
                                    <div className="relative shrink-0">
                                      <div className="w-10 h-10 bg-red-950 border border-red-500 text-red-200 flex items-center justify-center font-japanese font-black text-base shadow-[0_0_10px_rgba(239,68,68,0.3)] rounded-md">
                                        {avatarInitial}
                                      </div>
                                      <span
                                        className={`absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full border-2 border-stone-950 ${
                                          isOnline ? 'bg-emerald-400 ring-2 ring-emerald-500/50 animate-pulse' : 'bg-stone-600'
                                        }`}
                                      />
                                    </div>
                                    <div className="min-w-0">
                                      <div className="flex items-center gap-2 flex-wrap">
                                        <span className="font-black text-stone-100 text-sm">
                                          {displayFullName}
                                        </span>
                                      </div>
                                      <div className="text-xs text-stone-400 mt-0.5 flex items-center gap-2 flex-wrap">
                                        <span>Panggilan: <strong className="text-amber-300 font-black">{displayNickname}</strong></span>
                                        <span aria-hidden="true" className="text-stone-600">·</span>
                                        <span className="text-[11px] text-stone-500">
                                          Terdaftar: {student.registeredAt || '2026-10-01'}
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                </td>

                                {/* Kolom 3: Jam & Tanggal Terakhir Murid Online / Belajar */}
                                <td className="py-4 px-3 border-r border-stone-800">
                                  <div
                                    className={`p-2.5 border rounded-sm space-y-1 min-w-[150px] lg:min-w-[170px] ${
                                      isOnline
                                        ? 'bg-emerald-950/40 border-emerald-600/70 text-emerald-200'
                                        : 'bg-stone-950 border-stone-800 text-stone-300'
                                    }`}
                                  >
                                    <div className="flex items-center gap-1.5 text-xs font-black text-stone-200">
                                      <Calendar className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                                      <span>{lastOnlineInfo.formattedDayDate}</span>
                                    </div>
                                    <div className="flex items-center gap-1.5 text-xs font-mono font-black text-amber-300">
                                      <Clock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                                      <span>Pukul {lastOnlineInfo.formattedTime}</span>
                                    </div>
                                    <div
                                      className={`text-[10px] font-black inline-flex items-center gap-1 px-2 py-0.5 border rounded-xs ${
                                        isOnline
                                          ? 'bg-emerald-950 border-emerald-500 text-emerald-300'
                                          : 'bg-stone-900 border-stone-700 text-stone-400'
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

                                {/* Kolom 4: Status Kehadiran & Resonansi Live */}
                                <td className="py-4 px-3 border-r border-stone-800">
                                  <div className="flex flex-col items-start gap-1.5">
                                    <div className="flex items-center gap-1.5 flex-wrap">
                                      {isOnline ? (
                                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-emerald-950 text-emerald-300 border border-emerald-500 text-[11px] font-black rounded-xs">
                                          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                                          <span>Online</span>
                                        </span>
                                      ) : (
                                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-stone-950 text-stone-400 border border-stone-800 text-[11px] font-bold rounded-xs">
                                          <span className="w-2 h-2 rounded-full bg-stone-500" />
                                          <span>Offline</span>
                                        </span>
                                      )}

                                      {activityInfo.violations > 0 && (
                                        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-red-950 text-red-300 border border-red-600 text-[10px] font-black rounded-xs">
                                          <ShieldAlert className="w-3 h-3 text-red-400" />
                                          <span>{activityInfo.violations}x Pindah Tab</span>
                                        </span>
                                      )}

                                      {activityInfo.screenshotAttempts > 0 && (
                                        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-red-900 text-red-100 border border-red-500 text-[10px] font-black rounded-xs">
                                          <span>📸 Screenshot: {activityInfo.screenshotAttempts}x</span>
                                        </span>
                                      )}

                                      {activityInfo.aiTranslateAttempts > 0 && (
                                        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-amber-950 text-amber-200 border border-amber-600 text-[10px] font-black rounded-xs">
                                          <span>🤖 Auto-Translate: {activityInfo.aiTranslateAttempts}x</span>
                                        </span>
                                      )}
                                    </div>

                                    <div className={`text-xs font-black px-2.5 py-1 border rounded-xs ${
                                      activityInfo.isTakingQuiz
                                        ? 'bg-amber-950 border-amber-500 text-amber-300 animate-pulse'
                                        : isOnline
                                        ? 'bg-stone-950 border-stone-700 text-emerald-300'
                                        : 'bg-stone-950 border-stone-800 text-stone-400'
                                    }`}>
                                      {activityInfo.badgeText}
                                    </div>
                                    <span className="text-[10px] text-stone-400 font-medium">
                                      {activityInfo.subText}
                                    </span>
                                  </div>
                                </td>

                                {/* Kolom 5: Email & Kata Sandi */}
                                <td className="py-4 px-4 border-r border-stone-800">
                                  <div className="space-y-1.5">
                                    <div className="flex items-center gap-1.5 text-xs">
                                      <Mail className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                                      <span className="font-mono font-bold text-stone-200 break-all">
                                        {student.email}
                                      </span>
                                    </div>
                                    <div className="flex items-center gap-2 text-xs">
                                      <KeyRound className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                                      <span className="text-stone-400 font-bold">Sandi:</span>
                                      <span className="font-mono font-black text-amber-300 bg-stone-950 px-2 py-0.5 border border-stone-800 rounded-xs">
                                        {visiblePasswords[student.email] ? studentPassword : '••••••••'}
                                      </span>
                                      <button
                                        type="button"
                                        onClick={() => togglePasswordVisibility(student.email)}
                                        className="px-2 py-0.5 bg-stone-950 hover:bg-stone-800 text-amber-200 border border-stone-700 text-[11px] font-black transition-colors inline-flex items-center gap-1 rounded-xs cursor-pointer"
                                      >
                                        {visiblePasswords[student.email] ? (
                                          <>
                                            <EyeOff className="w-3 h-3 text-stone-400" />
                                            <span>Tutup</span>
                                          </>
                                        ) : (
                                          <>
                                            <Eye className="w-3 h-3 text-amber-400" />
                                            <span>Lihat</span>
                                          </>
                                        )}
                                      </button>
                                    </div>
                                  </div>
                                </td>

                                {/* Kolom 6: Riwayat & Skor Kuis */}
                                <td className="py-4 px-4 text-center whitespace-nowrap border-r border-stone-800">
                                  {totalQuizzes > 0 ? (
                                    <div className="inline-flex flex-col items-center gap-1">
                                      <div className="flex items-center gap-1.5">
                                        <span className="text-xs font-black text-stone-200">
                                          {totalQuizzes}x Ujian
                                        </span>
                                        <span aria-hidden="true" className="text-stone-600">·</span>
                                        <span className={`px-2 py-0.5 border text-xs font-black rounded-xs ${avgScoreColor}`} title="Rata-rata skor">
                                          Rata-rata: {avgScore}
                                        </span>
                                      </div>
                                      <div className="flex items-center gap-2 text-[11px] text-stone-400">
                                        <span>Tertinggi: <strong className="text-amber-300 font-black">{bestScore}</strong></span>
                                        <button
                                          type="button"
                                          onClick={() => setStudentDetailModal(student)}
                                          className="text-amber-400 underline hover:text-amber-300 font-black cursor-pointer"
                                        >
                                          Rincian
                                        </button>
                                      </div>
                                    </div>
                                  ) : (
                                    <span className="text-xs text-stone-500 italic">
                                      Belum ada skor kuis
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
                                      className="py-1.5 px-2.5 bg-amber-950/80 hover:bg-amber-900 text-amber-200 border border-amber-600/80 font-black text-xs transition-all inline-flex items-center gap-1 rounded-xs cursor-pointer shadow-[0_0_8px_rgba(245,158,11,0.2)]"
                                      title="Ubah kata sandi murid ini"
                                    >
                                      <KeyRound className="w-3.5 h-3.5 text-amber-400" />
                                      <span>Ubah Sandi</span>
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => setStudentToDelete(student)}
                                      className="py-1.5 px-2.5 bg-red-950/80 hover:bg-red-900 text-red-200 border border-red-600/80 font-black text-xs transition-all inline-flex items-center gap-1 rounded-xs cursor-pointer shadow-[0_0_8px_rgba(239,68,68,0.2)]"
                                      title="Hapus akun murid ini"
                                    >
                                      <UserX className="w-3.5 h-3.5 text-red-400" />
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

                    {/* TAMPILAN KARTU RESPONSIF (Layar HP / Mobile < md) — Gaya Kartu Grimoire Transparan */}
                    <div className="md:hidden bg-stone-950/35 backdrop-blur-sm p-3.5 space-y-4">
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

                        let avgScoreColor = 'text-stone-300 bg-stone-950/60 border-stone-800';
                        if (avgScore !== null) {
                          if (avgScore >= 71) {
                            avgScoreColor = 'text-emerald-300 bg-emerald-950/80 border-emerald-600';
                          } else if (avgScore >= 51) {
                            avgScoreColor = 'text-red-300 bg-red-950/80 border-red-600';
                          }
                        }

                        return (
                          <div key={student.email} className="grimoire-card p-4 space-y-3 rounded-lg border border-amber-600/50 relative bg-stone-950/40 backdrop-blur-md">
                            <GrimoireCornerClasp variant="gold" />
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-red-950 border border-red-500 text-red-200 flex items-center justify-center font-japanese font-black text-base shrink-0 rounded-md">
                                  {avatarInitial}
                                </div>
                                <div>
                                  <div className="flex items-center gap-1.5 flex-wrap">
                                    <span className="text-xs font-mono font-black text-amber-400">#{idx + 1}</span>
                                    <h3 className="text-sm font-black text-stone-100">{displayFullName}</h3>
                                  </div>
                                  <p className="text-xs text-stone-400 mt-0.5">
                                    Panggilan: <strong className="text-amber-300 font-black">{displayNickname}</strong> · {student.registeredAt || '2026-10-01'}
                                  </p>
                                </div>
                              </div>

                              {isOnline ? (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-950 text-emerald-300 border border-emerald-500 text-[11px] font-black shrink-0 rounded-xs">
                                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                                  <span>Online</span>
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-stone-950 text-stone-400 border border-stone-800 text-[11px] font-bold shrink-0 rounded-xs">
                                  <span className="w-1.5 h-1.5 rounded-full bg-stone-500" />
                                  <span>Offline</span>
                                </span>
                              )}
                            </div>

                            {/* Jam & Tanggal Terakhir Murid Online / Belajar di Mobile */}
                            <div
                              className={`p-3 border rounded-sm text-xs space-y-1.5 ${
                                isOnline
                                  ? 'bg-emerald-950/40 border-emerald-600/60'
                                  : 'bg-stone-950 border-stone-800'
                              }`}
                            >
                              <div className="flex items-center justify-between gap-2">
                                <span className="text-[10px] font-black uppercase tracking-wider text-amber-400">
                                  🕒 Terakhir Online / Belajar:
                                </span>
                                <span
                                  className={`text-[10px] font-black px-2 py-0.5 border rounded-xs ${
                                    isOnline
                                      ? 'bg-emerald-950 border-emerald-500 text-emerald-300'
                                      : 'bg-stone-900 border-stone-700 text-stone-400'
                                  }`}
                                >
                                  {lastOnlineInfo.relativeTimeLabel}
                                </span>
                              </div>
                              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 pt-0.5">
                                <span className="inline-flex items-center gap-1 font-black text-stone-200">
                                  <Calendar className="w-3.5 h-3.5 text-amber-400" />
                                  <span>{lastOnlineInfo.formattedDayDate}</span>
                                </span>
                                <span className="inline-flex items-center gap-1 font-mono font-black text-amber-300">
                                  <Clock className="w-3.5 h-3.5 text-amber-400" />
                                  <span>Pukul {lastOnlineInfo.formattedTime}</span>
                                </span>
                              </div>
                            </div>

                            {/* Aktivitas Live di Mobile */}
                            <div className="p-2.5 bg-stone-950 border border-stone-800 rounded-sm text-xs space-y-1.5">
                              <div className="font-black text-amber-300">{activityInfo.badgeText}</div>
                              {(activityInfo.screenshotAttempts > 0 || activityInfo.aiTranslateAttempts > 0) && (
                                <div className="flex flex-wrap gap-1.5">
                                  {activityInfo.screenshotAttempts > 0 && (
                                    <span className="px-2 py-0.5 bg-red-900 text-red-100 border border-red-500 text-[10px] font-black rounded-xs">
                                      📸 Screenshot: {activityInfo.screenshotAttempts}x
                                    </span>
                                  )}
                                  {activityInfo.aiTranslateAttempts > 0 && (
                                    <span className="px-2 py-0.5 bg-amber-950 text-amber-200 border border-amber-600 text-[10px] font-black rounded-xs">
                                      🤖 Terjemahan: {activityInfo.aiTranslateAttempts}x
                                    </span>
                                  )}
                                </div>
                              )}
                              <div className="text-[10px] text-stone-400 mt-0.5">{activityInfo.subText}</div>
                            </div>

                            <div className="bg-stone-950 border border-stone-800 rounded-sm p-3 space-y-1.5 text-xs">
                              <div className="flex items-center gap-1.5">
                                <Mail className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                                <span className="font-mono font-bold text-stone-200 break-all">{student.email}</span>
                              </div>
                              <div className="flex items-center justify-between gap-2 pt-1 border-t border-stone-800">
                                <div className="flex items-center gap-1.5">
                                  <KeyRound className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                                  <span className="text-stone-400 font-bold">Sandi:</span>
                                  <span className="font-mono font-black text-amber-300">
                                    {visiblePasswords[student.email] ? studentPassword : '••••••••'}
                                  </span>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => togglePasswordVisibility(student.email)}
                                  className="px-2 py-0.5 bg-stone-900 border border-stone-700 text-[11px] font-black text-amber-300 rounded-xs"
                                >
                                  {visiblePasswords[student.email] ? 'Tutup' : 'Lihat'}
                                </button>
                              </div>
                            </div>

                            <div className="flex items-center justify-between text-xs bg-stone-950 border border-stone-800 rounded-sm px-3 py-2">
                              <span className="font-black text-stone-200">Riwayat: {totalQuizzes}x Ujian</span>
                              {avgScore !== null ? (
                                <div className="flex items-center gap-2">
                                  <span className={`px-2 py-0.5 border font-black rounded-xs ${avgScoreColor}`}>
                                    Rata-rata: {avgScore}
                                  </span>
                                  <button
                                    type="button"
                                    onClick={() => setStudentDetailModal(student)}
                                    className="text-amber-400 underline font-black"
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
                                className="flex-1 py-2 px-3 bg-amber-950/80 hover:bg-amber-900 text-amber-200 border border-amber-600/80 font-black text-xs flex items-center justify-center gap-1.5 rounded-xs"
                              >
                                <KeyRound className="w-3.5 h-3.5 text-amber-400" />
                                <span>Ubah Sandi</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => setStudentToDelete(student)}
                                className="flex-1 py-2 px-3 bg-red-950/80 hover:bg-red-900 text-red-200 border border-red-600/80 font-black text-xs flex items-center justify-center gap-1.5 rounded-xs"
                              >
                                <UserX className="w-3.5 h-3.5 text-red-400" />
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
            GRIMOIRE TRIAL ARENA: NILAI & PERANKINGAN KUIS LIVE (BLACK CLOVER THEME)
            ========================================================================= */}
        {(subTab === 'all' || subTab === 'live_scores') && (
          <>
            <GrimoireRunicDivider label="TRIAL OF MAGIC RANKINGS" jpLabel="昇格魔導試験" variant="red" />
            <div className="space-y-6">
              {/* Papan Peringkat Sesi Kuis (Top 3 Juara Sesi Ini) Gaya Podium Clover Transparan */}
              {sortedCompletedRecords.length > 0 && (
                <div className="grimoire-card relative p-4 sm:p-5 overflow-hidden rounded-2xl border-2 border-red-600/40 shadow-lg backdrop-blur-[2px] bg-red-950/15">
                  <GrimoireCornerClasp variant="gold" />
                  <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 border-b border-red-600/40 pb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-amber-950/80 border-2 border-amber-500 flex items-center justify-center text-amber-300 shadow-[0_0_12px_rgba(245,158,11,0.3)] rounded-md">
                        <Trophy className="w-5 h-5 text-amber-400" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 bg-amber-950/80 text-amber-300 font-mono text-[10px] font-black border border-amber-600 rounded-xs">
                            表彰台 · TOP 3 PODIUM
                          </span>
                          <span className="font-japanese font-black text-xs text-amber-400">
                            魔導試験優秀者
                          </span>
                        </div>
                        <h3 className="text-sm sm:text-base font-black text-stone-100 font-japanese mt-0.5">
                          Papan Perankingan Sesi Kuis Saat Ini (Top 3 Magic Knights)
                        </h3>
                      </div>
                    </div>

                    <button
                      onClick={() => setShowResetRankingModal(true)}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-stone-950/80 hover:bg-stone-900 text-amber-300 border border-amber-600 text-xs font-black transition-all w-fit shadow-[0_0_10px_rgba(245,158,11,0.2)] active:translate-x-[1px] active:translate-y-[1px] cursor-pointer rounded-xs backdrop-blur-xs"
                    >
                      <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
                      <span>Reset Ranking Sesi Kuis</span>
                    </button>
                  </div>

                  {/* 3 Panel Juara Grimoire (Transparan dengan Warna Emas, Perak, Perunggu) */}
                  <div className="relative z-10 grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-3.5 p-3 bg-stone-950/25 backdrop-blur-xs border border-stone-800/60 rounded-md items-stretch">
                    {sortedCompletedRecords.slice(0, 3).map((rec, idx) => {
                      const medalIcon = idx === 0 ? '🥇' : idx === 1 ? '🥈' : '🥉';
                      const medalTitle = idx === 0 ? '第1位 · JUARA 1 (EMAS)' : idx === 1 ? '第2位 · JUARA 2 (PERAK)' : '第3位 · JUARA 3 (PERUNGGU)';
                      const cardBg = idx === 0 
                        ? 'bg-amber-950/40 backdrop-blur-xs border-2 border-amber-400 shadow-[0_0_18px_rgba(245,158,11,0.25)]' 
                        : idx === 1 
                        ? 'bg-slate-900/40 backdrop-blur-xs border-2 border-slate-300 shadow-[0_0_18px_rgba(203,213,225,0.2)]' 
                        : 'bg-orange-950/40 backdrop-blur-xs border-2 border-amber-700 shadow-[0_0_18px_rgba(180,83,9,0.2)]';

                      return (
                        <div key={rec.id} className={`h-full min-w-0 p-3 sm:p-3.5 rounded-md ${cardBg} flex items-center gap-2.5 sm:gap-3 relative`}>
                          <div className="text-2xl sm:text-3xl shrink-0">{medalIcon}</div>
                          <div className="flex-1 min-w-0">
                            <div className="text-[10px] font-black uppercase tracking-wider text-amber-300 font-mono">
                              {medalTitle}
                            </div>
                            <div className="font-black text-stone-100 text-sm truncate mt-0.5">
                              {rec.studentName}
                            </div>
                            <div className="text-xs text-stone-300 flex items-center gap-2 mt-0.5 font-bold">
                              <span>JLPT {rec.level}</span>
                              <span>•</span>
                              <span>Nilai: <strong className="text-amber-300 font-black">{rec.score}</strong></span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Filter Bar & Tabel Pantauan Sesi Kuis Live Gaya Grimoire (Transparan Merah Anti-Sihir) */}
              <div className="grimoire-card relative overflow-hidden rounded-2xl border-2 border-red-600/40 shadow-lg backdrop-blur-[2px] bg-red-950/15">
                <GrimoireCornerClasp variant="red" />
                <div className="bg-red-950/30 backdrop-blur-xs border-b border-red-800/50 p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <span className="px-2 py-0.5 bg-red-950/90 text-red-300 font-mono text-[10px] font-black border border-red-600 rounded-xs">
                      ARENA · LIVE LOG
                    </span>
                    <Activity className="w-4 h-4 text-amber-400" />
                    <span className="text-xs sm:text-sm font-black text-stone-100 font-japanese">
                      Tabel Pantauan Sesi Kuis & Peringkat Live ({filteredRecords.length} Sesi)
                    </span>
                  </div>

                  {/* Filters & Reset Ranking Button */}
                  <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto justify-end">
                    <div className="flex items-center gap-1 bg-stone-950/80 p-1 border border-stone-800 text-xs rounded-xs backdrop-blur-xs">
                      {(['all', 'in_progress', 'completed'] as const).map((st) => (
                        <button
                          key={st}
                          onClick={() => setFilterStatus(st)}
                          className={`px-3 py-1 font-black transition-all cursor-pointer rounded-xs ${
                            filterStatus === st
                              ? 'bg-amber-600 text-stone-950 shadow-[0_0_10px_rgba(245,158,11,0.3)]'
                              : 'text-stone-400 hover:text-stone-200'
                          }`}
                        >
                          {st === 'all' ? 'Semua' : st === 'in_progress' ? 'Sedang Kuis' : 'Selesai'}
                        </button>
                      ))}
                    </div>

                    <select
                      value={filterLevel}
                      onChange={(e) => setFilterLevel(e.target.value)}
                      className="px-3 py-1.5 bg-stone-950/80 border border-stone-800 text-xs font-black text-amber-300 outline-hidden rounded-xs backdrop-blur-xs"
                    >
                      <option value="all">Semua Level</option>
                      <option value="N5">Level N5</option>
                      <option value="N4">Level N4</option>
                      <option value="N3">Level N3</option>
                      <option value="N2">Level N2</option>
                    </select>

                    <button
                      onClick={() => setShowResetRankingModal(true)}
                      className="px-3.5 py-1.5 bg-stone-950/80 hover:bg-stone-900 text-amber-300 border border-amber-600 text-xs font-black shadow-[0_0_8px_rgba(245,158,11,0.2)] transition-all flex items-center gap-1.5 shrink-0 active:translate-x-[1px] active:translate-y-[1px] cursor-pointer rounded-xs backdrop-blur-xs"
                      title="Reset papan perankingan untuk sesi kuis baru (tidak menghapus total kuis atau rapor murid)"
                    >
                      <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
                      <span>Reset Ranking</span>
                    </button>
                  </div>
                </div>

                <div className="overflow-x-auto bg-stone-950/35 backdrop-blur-sm p-2.5 sm:p-3.5">
                  <table className="w-full text-left text-xs sm:text-sm bg-stone-950/40 backdrop-blur-sm border border-stone-800/80 rounded-md overflow-hidden table-auto">
                    <thead>
                      <tr className="bg-red-950/60 backdrop-blur-sm text-red-200 border-b-2 border-red-600/70 font-black">
                        <th className="py-3 px-2 sm:px-3 text-center border-r border-stone-800 w-16 sm:w-20">Peringkat</th>
                        <th className="py-3 px-3 sm:px-4 border-r border-stone-800 min-w-[140px] sm:min-w-[160px]">Nama Murid</th>
                        <th className="py-3 px-2 sm:px-3 text-center border-r border-stone-800 w-20 sm:w-24">Level Kuis</th>
                        <th className="py-3 px-2 sm:px-3 border-r border-stone-800 min-w-[90px] sm:min-w-[100px]">Tanggal</th>
                        <th className="py-3 px-2 sm:px-3 border-r border-stone-800 min-w-[80px] sm:min-w-[90px]">Jam Mulai</th>
                        <th className="py-3 px-2 sm:px-3 border-r border-stone-800 min-w-[80px] sm:min-w-[90px]">Jam Selesai</th>
                        <th className="py-3 px-3 sm:px-4 text-center border-r border-stone-800 min-w-[120px] sm:min-w-[140px]">Progres / Skor Murid</th>
                        <th className="py-3 px-2 sm:px-3 text-center min-w-[80px] sm:min-w-[90px]">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-800/60">
                      {filteredRecords.length === 0 ? (
                        <tr>
                          <td colSpan={8} className="py-10 text-center text-stone-400 bg-stone-950/40 backdrop-blur-sm">
                            <div className="font-japanese font-black text-2xl text-stone-600 mb-1.5">「試験待機中...」</div>
                            <p className="font-black text-stone-300">
                              Papan perankingan sesi ini belum memiliki rekaman kuis.
                            </p>
                            <p className="text-xs text-stone-500 mt-0.5">
                              Saat murid mulai mengerjakan kuis, nomor soal yang sedang dikerjakan dan skor akan otomatis muncul secara live di tabel ini.
                            </p>
                          </td>
                        </tr>
                      ) : (
                        filteredRecords.map((rec) => (
                          <tr 
                            key={rec.id} 
                            className={`transition-colors ${
                              rec.status === 'in_progress' ? 'bg-amber-950/30 hover:bg-amber-950/45' : 'hover:bg-red-950/30 bg-stone-950/35'
                            }`}
                          >
                            <td className="py-3 px-3 text-center whitespace-nowrap border-r border-stone-800 bg-stone-950/60">
                              {renderRankBadge(rankMap.get(rec.id), rec.status)}
                            </td>

                            <td className="py-3 px-4 border-r border-stone-800">
                              <div className="flex flex-wrap items-center gap-1.5">
                                <span className="font-black text-stone-100">
                                  {rec.studentName}
                                </span>
                                {rec.tabViolationsCount && rec.tabViolationsCount > 0 ? (
                                  <span 
                                    className="inline-flex items-center gap-1 px-2 py-0.5 bg-red-950 text-red-300 border border-red-600 text-[10px] font-black shrink-0 rounded-xs"
                                    title={`Peringatan: Murid terdeteksi berpindah tab sebanyak ${rec.tabViolationsCount} kali`}
                                  >
                                    <ShieldAlert className="w-3 h-3 text-red-400 shrink-0" />
                                    <span>{rec.tabViolationsCount}x Pindah Tab</span>
                                  </span>
                                ) : null}
                              </div>
                              <div className="text-[11px] text-stone-400 flex items-center gap-1 mt-0.5">
                                <span className="font-bold text-amber-400">Panggilan: {rec.studentNickname}</span>
                              </div>
                            </td>

                            <td className="py-3 px-3 border-r border-stone-800">
                              <span className="px-2.5 py-1 bg-stone-950 text-amber-300 border border-stone-800 font-black text-xs rounded-xs">
                                JLPT {rec.level}
                              </span>
                            </td>

                            <td className="py-3 px-3 font-bold text-stone-300 whitespace-nowrap border-r border-stone-800">
                              <div className="flex items-center gap-1">
                                <Calendar className="w-3.5 h-3.5 text-amber-400" />
                                <span>{rec.date}</span>
                              </div>
                            </td>

                            <td className="py-3 px-3 font-mono font-bold text-stone-300 whitespace-nowrap border-r border-stone-800">
                              <div className="flex items-center gap-1">
                                <Clock className="w-3.5 h-3.5 text-stone-500" />
                                <span>{rec.startedAtTime}</span>
                              </div>
                            </td>

                            <td className="py-3 px-3 whitespace-nowrap border-r border-stone-800">
                              {rec.status === 'in_progress' || !rec.completedAtTime ? (
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-950 text-amber-300 border border-amber-600 text-xs font-black animate-pulse rounded-xs">
                                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                                  sedang dikerjakan
                                </span>
                              ) : (
                                <div className="flex items-center gap-1 font-mono font-black text-emerald-300">
                                  <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                                  <span>{rec.completedAtTime}</span>
                                </div>
                              )}
                            </td>

                            <td className="py-3 px-4 text-center whitespace-nowrap border-r border-stone-800">
                              {renderScoreBadge(rec)}
                            </td>

                            <td className="py-3 px-3 text-center whitespace-nowrap">
                              <button
                                onClick={() => setRecordToDelete(rec)}
                                className="p-1.5 text-stone-400 hover:text-red-400 hover:bg-red-950/40 rounded-xs transition-colors cursor-pointer"
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

              {/* Keterangan Skema Warna Nilai Gaya Grimoire */}
              <div className="grimoire-card relative p-4 flex flex-wrap items-center justify-between gap-2 text-xs text-stone-300 rounded-lg border border-red-600/30 bg-stone-950/40 backdrop-blur-md">
                <span className="font-black text-amber-300">🎨 【注釈】 Aturan Pewarnaan Skor Ujian Sihir:</span>
                <div className="flex flex-wrap items-center gap-4">
                  <span className="inline-flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-stone-800 border border-stone-600" />
                    <span><strong>0 – 50:</strong> Berwarna Gelap</span>
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-red-600 border border-red-400" />
                    <span><strong>51 – 70:</strong> Berwarna Merah Anti-Sihir</span>
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-emerald-500 border border-emerald-300" />
                    <span><strong>71 – 100:</strong> Berwarna Hijau Roh Angin</span>
                  </span>
                </div>
              </div>
            </div>
          </>
        )}

        {/* =========================================================================
            GRIMOIRE SPATIAL MEET: GOOGLE MEET ATTENDANCE & DURATION SYNC
            ========================================================================= */}
        {(subTab === 'all' || subTab === 'meet_sync') && (
          <>
            <GrimoireRunicDivider label="SPATIAL TELEPATHY & MEET SYNC" jpLabel="空間通信出席録" variant="green" />
            <div className="space-y-6 animate-in fade-in duration-300">
              {/* Kontrol Sesi Tatap Muka Google Meet Master & Chat Reaksi */}
              <div className="mb-4">
                <GoogleMeetRoom isMasterUser={true} currentUser={currentUser} />
              </div>

              <div className="grimoire-card relative p-5 sm:p-7 overflow-hidden rounded-2xl border-2 border-emerald-600/40 shadow-lg backdrop-blur-[2px] bg-emerald-950/15">
                <GrimoireCornerClasp variant="green" />
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-emerald-600/30">
                  <div>
                    <span className="px-2.5 py-1 bg-emerald-950/80 text-emerald-300 font-mono text-[10px] font-black uppercase tracking-wider border border-emerald-500 rounded-xs">
                      SANCTUM 04 · MEET DURATION SYNC
                    </span>
                    <h3 className="text-xl font-black text-stone-100 font-japanese mt-1">
                      Sinkronisasi Kehadiran & Durasi Partisipasi Google Meet
                    </h3>
                    <p className="text-xs text-stone-300 mt-0.5">
                      Sinkronkan daftar kehadiran murid secara otomatis ke rapor mereka berdasarkan durasi kehadiran dalam sesi Google Meet yang diselenggarakan Master.
                    </p>
                  </div>

                  <button
                    onClick={handlePerformMeetSync}
                    className="px-5 py-3 bg-gradient-to-r from-emerald-700 to-teal-700 hover:from-emerald-600 hover:to-teal-600 text-white font-black text-xs border border-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.3)] flex items-center gap-2 cursor-pointer transition-all transform hover:scale-105 rounded-xs"
                  >
                    <RefreshCw className="w-4 h-4 animate-spin text-emerald-300" />
                    <span>🔄 Sinkronkan Kehadiran & Durasi ke Rapor Murid</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 sm:gap-4 mb-6 items-stretch">
                  <div className="h-full p-3.5 sm:p-4 bg-amber-950/30 backdrop-blur-xs border border-amber-500/40 rounded-md flex flex-col justify-between">
                    <div className="text-xs font-black text-amber-300 uppercase tracking-wider mb-1">Total Sesi Meet Berlangsung</div>
                    <div className="text-xl sm:text-2xl font-black text-amber-100 font-mono">{storageService.getVirtualSessions().length} Sesi</div>
                  </div>
                  <div className="h-full p-3.5 sm:p-4 bg-emerald-950/30 backdrop-blur-xs border border-emerald-500/40 rounded-md flex flex-col justify-between">
                    <div className="text-xs font-black text-emerald-300 uppercase tracking-wider mb-1">Murid Tersinkronisasi</div>
                    <div className="text-xl sm:text-2xl font-black text-emerald-200 font-mono">{Object.keys(meetSyncData.students || {}).length} Murid</div>
                  </div>
                  <div className="h-full p-3.5 sm:p-4 bg-teal-950/30 backdrop-blur-xs border border-teal-500/40 rounded-md flex flex-col justify-between">
                    <div className="text-xs font-black text-teal-300 uppercase tracking-wider mb-1">Terakhir Disinkronkan</div>
                    <div className="text-xs font-mono font-bold text-teal-200 mt-1">{meetSyncData.updatedAt || 'Belum pernah'}</div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-sm font-black text-stone-100 uppercase tracking-wider font-japanese border-l-4 border-emerald-500 pl-2.5">
                    Rincian Partisipasi Durasi Murid (*Estimasi 30 Menit / Sesi)
                  </h4>

                  {studentsList.length === 0 ? (
                    <p className="text-xs text-stone-500 italic">Belum ada murid terdaftar.</p>
                  ) : (
                    <div className="overflow-x-auto border border-emerald-800/60 rounded-md bg-stone-950/30 backdrop-blur-sm">
                      <table className="w-full text-left text-xs bg-emerald-950/15 backdrop-blur-sm table-auto">
                        <thead className="bg-emerald-950/70 backdrop-blur-sm font-black uppercase text-[11px] text-emerald-300 border-b border-emerald-800/80">
                          <tr>
                            <th className="py-3 px-3 sm:px-4 border-r border-emerald-800/50 min-w-[150px]">Nama Murid</th>
                            <th className="py-3 px-3 sm:px-4 border-r border-emerald-800/50 min-w-[150px]">Email</th>
                            <th className="py-3 px-3 sm:px-4 border-r border-emerald-800/50 text-center min-w-[100px]">Sesi Diikuti</th>
                            <th className="py-3 px-3 sm:px-4 border-r border-emerald-800/50 text-center min-w-[130px]">Total Durasi Partisipasi</th>
                            <th className="py-3 px-3 sm:px-4 text-center min-w-[120px]">Status Sinkronisasi</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-emerald-900/40">
                          {studentsList.map((stu) => {
                            const emailL = stu.email.toLowerCase();
                            const syncInfo = meetSyncData.students[emailL];
                            const attendedCount = syncInfo?.attendanceCount || 0;
                            const totalMins = syncInfo?.totalMinutes || 0;
                            return (
                              <tr key={stu.email} className="hover:bg-emerald-950/35 transition-colors">
                                <td className="py-3 px-4 font-black text-stone-100 flex items-center gap-2 border-r border-emerald-900/40">
                                  <span className="w-6 h-6 rounded-full bg-red-950 border border-red-500 text-red-200 flex items-center justify-center text-[10px] font-bold">
                                    {(stu.nickname || stu.fullName || 'M').charAt(0).toUpperCase()}
                                  </span>
                                  <span>{stu.fullName || stu.nickname || stu.email}</span>
                                </td>
                                <td className="py-3 px-4 font-mono text-stone-400 border-r border-emerald-900/40">{stu.email}</td>
                                <td className="py-3 px-4 font-bold text-amber-300 border-r border-emerald-900/40">
                                  {attendedCount} Sesi Meet
                                </td>
                                <td className="py-3 px-4 font-mono font-extrabold text-emerald-400 border-r border-emerald-900/40">
                                  {totalMins} Menit ({Math.floor(totalMins / 60)} Jam {totalMins % 60} Menit)
                                </td>
                                <td className="py-3 px-4">
                                  {attendedCount > 0 ? (
                                    <span className="px-2 py-1 bg-emerald-950 text-emerald-300 border border-emerald-500 font-black text-[10px] rounded-xs">
                                      🟢 Aktif & Tersinkron
                                    </span>
                                  ) : (
                                    <span className="px-2 py-1 bg-stone-950 text-stone-500 border border-stone-800 font-bold text-[10px] rounded-xs">
                                      ⚪ Belum Hadir
                                    </span>
                                  )}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </>
        )}
        </div>

        {/* FOOTER PENUTUP GRIMOIRE DENGAN NAVIGASI BAB */}
        <div className="mt-8 grimoire-card relative p-4 flex flex-wrap items-center justify-between gap-3 text-xs font-mono font-black text-amber-200 border border-amber-600/60 rounded-2xl shadow-md backdrop-blur-md bg-stone-950/40">
          <GrimoireCornerClasp variant="gold" />
          <button
            type="button"
            onClick={() => handleStepMangaPage(-1)}
            className="px-3.5 py-1.5 bg-stone-950 hover:bg-stone-900 text-amber-300 border border-amber-600 inline-flex items-center gap-1.5 transition-all cursor-pointer rounded-xs"
          >
            <ChevronLeft className="w-4 h-4 text-amber-400" />
            <span>前の巻 (Bab Sebelumnya)</span>
          </button>

          <span className="text-center font-black text-amber-300 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
            <span>CLOVER KINGDOM MASTER SANCTUM · BLACK CLOVER GRIMOIRE ARCHIVES</span>
          </span>

          <button
            type="button"
            onClick={() => handleStepMangaPage(1)}
            className="px-4 py-1.5 bg-amber-600 hover:bg-amber-500 text-stone-950 border border-amber-400 font-japanese inline-flex items-center gap-1.5 transition-all cursor-pointer rounded-xs shadow-[0_0_12px_rgba(245,158,11,0.3)]"
          >
            <span>次の巻へ (Bab Berikutnya)</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* =========================================================================
          MODAL RINCIAN RIWAYAT KUIS MURID TERDAFTAR (GRIMOIRE ARCHIVES)
          ========================================================================= */}
      {studentDetailModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-lg bg-[#12141c] border-2 border-amber-500/60 p-6 shadow-[0_0_30px_rgba(0,0,0,0.9)] max-h-[85vh] flex flex-col rounded-lg relative">
            <GrimoireCornerClasp />
            <div className="flex items-center justify-between gap-3 pb-4 border-b border-stone-800">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-amber-400 text-xs">🍀</span>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-amber-400 font-bold">Arcane Student Record</span>
                </div>
                <h3 className="text-lg font-black text-amber-200 font-japanese">
                  Rincian Nilai Kuis: {studentDetailModal.fullName || studentDetailModal.nickname}
                </h3>
                <p className="text-xs text-stone-400 font-mono">
                  {studentDetailModal.email}
                </p>
                {(() => {
                  const detailLastOnline = storageService.getStudentLastOnlineDetails(studentDetailModal, nowMs);
                  return (
                    <div className="mt-2.5 inline-flex flex-wrap items-center gap-2 px-3 py-1.5 bg-stone-900/90 border border-amber-500/30 rounded text-[11px] text-stone-300">
                      <span className="font-bold text-amber-400">🕒 Terakhir Online:</span>
                      <span className="font-extrabold text-stone-200">{detailLastOnline.formattedDayDate}</span>
                      <span className="text-stone-600">·</span>
                      <span className="font-mono font-bold text-amber-300">Pukul {detailLastOnline.formattedTime}</span>
                      <span className="text-stone-400">({detailLastOnline.relativeTimeLabel})</span>
                    </div>
                  );
                })()}
              </div>
              <button
                type="button"
                onClick={() => setStudentDetailModal(null)}
                className="px-3 py-1.5 bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-600 font-bold text-xs rounded transition-all cursor-pointer"
              >
                Tutup
              </button>
            </div>

            <div className="overflow-y-auto my-4 flex-1 bg-stone-950/80 border border-stone-800 rounded">
              {(() => {
                const stuScores = allScores.filter(
                  s => s.userEmail.toLowerCase() === studentDetailModal.email.toLowerCase()
                );
                if (stuScores.length === 0) {
                  return (
                    <p className="text-center text-xs text-stone-500 py-8 font-bold">
                      Murid ini belum memiliki riwayat pengerjaan kuis di grimoire.
                    </p>
                  );
                }
                return (
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="bg-stone-900 text-amber-300 border-b border-stone-800 font-bold">
                        <th className="py-2.5 px-3">Tanggal</th>
                        <th className="py-2.5 px-3">Level</th>
                        <th className="py-2.5 px-3 text-center">Benar</th>
                        <th className="py-2.5 px-3 text-center">Nilai</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-800/80">
                      {stuScores.map((sc) => (
                        <tr key={sc.id} className="hover:bg-stone-900/50">
                          <td className="py-2.5 px-3 font-mono text-stone-300">{sc.completedAt}</td>
                          <td className="py-2.5 px-3 font-black text-rose-400">JLPT {sc.level}</td>
                          <td className="py-2.5 px-3 text-center font-bold text-stone-300">
                            {sc.correctCount} / {sc.totalQuestions}
                          </td>
                          <td className="py-2.5 px-3 text-center font-black text-sm">
                            <span
                              className={
                                sc.score >= 71
                                  ? 'text-emerald-400 drop-shadow-[0_0_6px_rgba(52,211,153,0.5)]'
                                  : sc.score >= 51
                                  ? 'text-amber-400'
                                  : 'text-rose-400'
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-[#12141c] border-2 border-red-600/70 p-6 shadow-[0_0_30px_rgba(220,38,38,0.3)] rounded-lg relative">
            <GrimoireCornerClasp />
            <div className="w-12 h-12 bg-red-950/80 border border-red-500/60 text-red-400 flex items-center justify-center mx-auto mb-4 rounded shadow-[0_0_15px_rgba(239,68,68,0.3)]">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <h3 className="text-lg font-black text-red-300 text-center font-japanese mb-2">
              Konfirmasi Hapus Akun Murid
            </h3>

            <p className="text-xs text-stone-300 text-center leading-relaxed mb-4">
              Apakah Sensei yakin ingin menghapus akun murid:
              <br />
              <strong className="text-base text-amber-300 font-black block mt-1">
                {studentToDelete.fullName || studentToDelete.nickname} ({studentToDelete.email})
              </strong>
            </p>

            <div className="p-3 bg-red-950/60 border border-red-500/40 text-[11px] text-red-200 mb-5 leading-relaxed font-semibold rounded">
              ⚠️ <strong>Peringatan:</strong> Seluruh riwayat hasil kuis, rekaman sesi aktif, dan data profil murid ini akan <strong>otomatis terhapus bersih dan permanen</strong> dari arsip Grimoire.
            </div>

            <div className="flex items-center gap-2.5">
              <button
                onClick={() => setStudentToDelete(null)}
                className="flex-1 py-2.5 px-4 bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-600 font-bold text-xs rounded transition-all cursor-pointer"
              >
                Batal
              </button>
              <button
                onClick={handleConfirmDeleteStudent}
                className="flex-1 py-2.5 px-4 bg-red-600 hover:bg-red-500 text-white border border-red-400 font-bold text-xs rounded shadow-[0_0_15px_rgba(220,38,38,0.5)] transition-all cursor-pointer"
              >
                Ya, Hapus Semua Data Murid
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL KONFIRMASI HAPUS SINGLE REKAMAN KUIS */}
      {recordToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-sm bg-[#12141c] border-2 border-amber-600/60 p-5 shadow-[0_0_25px_rgba(0,0,0,0.8)] text-center rounded-lg relative">
            <GrimoireCornerClasp />
            <h4 className="text-sm font-black text-amber-300 mb-2 font-japanese">Hapus Rekaman Kuis Ini?</h4>
            <p className="text-xs text-stone-300 mb-4">
              Rekaman kuis <strong className="text-white">{recordToDelete.studentName}</strong> ({recordToDelete.level}) pada {recordToDelete.date} akan dihapus dari arsip.
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setRecordToDelete(null)}
                className="flex-1 py-2 bg-stone-800 text-stone-300 border border-stone-600 font-bold text-xs rounded hover:bg-stone-700 transition-all cursor-pointer"
              >
                Batal
              </button>
              <button
                onClick={handleConfirmDeleteRecord}
                className="flex-1 py-2 bg-red-600 text-white border border-red-400 font-bold text-xs rounded hover:bg-red-500 shadow-[0_0_12px_rgba(220,38,38,0.4)] transition-all cursor-pointer"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-[#12141c] border-2 border-amber-500/60 p-6 sm:p-7 shadow-[0_0_30px_rgba(245,158,11,0.25)] rounded-lg relative">
            <GrimoireCornerClasp />
            <div className="flex items-center gap-3.5 mb-4">
              <div className="w-12 h-12 bg-amber-500/20 border border-amber-400/60 flex items-center justify-center text-amber-300 text-2xl shrink-0 rounded shadow-[0_0_12px_rgba(245,158,11,0.3)]">
                🏆
              </div>
              <div>
                <h3 className="text-lg font-black text-amber-200 font-japanese">
                  Reset Ranking Sesi Kuis?
                </h3>
                <p className="text-xs text-stone-400 font-medium">
                  Menyesuaikan & memulai papan peringkat untuk sesi kuis baru
                </p>
              </div>
            </div>

            <div className="p-4 bg-stone-900/90 border border-stone-800 text-xs space-y-2.5 mb-5 rounded">
              <p className="font-bold text-stone-200">
                Papan perankingan sesi ini akan dikosongkan agar siap digunakan untuk sesi pengerjaan kuis yang baru.
              </p>
              <div className="pt-2 border-t border-stone-800 space-y-1.5 text-stone-300">
                <div className="flex items-center gap-2">
                  <span className="text-emerald-400 font-black text-sm">✓</span>
                  <span><strong>Total Kuis Murid</strong> di Daftar Murid tetap aman & tidak berkurang.</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-emerald-400 font-black text-sm">✓</span>
                  <span><strong>Laporan Pribadi (Rapor)</strong> di akun master & akun murid tetap tersimpan 100%.</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-emerald-400 font-black text-sm">✓</span>
                  <span>Hanya rekaman live sesi ini yang diatur ulang ke posisi awal.</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <button
                onClick={() => setShowResetRankingModal(false)}
                className="flex-1 py-2.5 px-4 bg-stone-800 hover:bg-stone-700 text-stone-300 border border-stone-600 font-bold text-xs rounded transition-all cursor-pointer"
              >
                Batal
              </button>
              <button
                onClick={handleConfirmResetRanking}
                className="flex-1 py-2.5 px-4 bg-amber-500 hover:bg-amber-400 text-stone-950 border border-amber-300 font-bold text-xs rounded shadow-[0_0_15px_rgba(245,158,11,0.4)] flex items-center justify-center gap-2 transition-all cursor-pointer"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-[#12141c] border-2 border-amber-500/60 p-6 sm:p-7 shadow-[0_0_30px_rgba(0,0,0,0.9)] rounded-lg relative">
            <GrimoireCornerClasp />
            <div className="flex items-center gap-3.5 mb-3">
              <div className="w-12 h-12 bg-amber-500/20 border border-amber-400/60 flex items-center justify-center text-amber-300 text-xl shrink-0 rounded shadow-[0_0_12px_rgba(245,158,11,0.3)]">
                <KeyRound className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-black text-amber-200 font-japanese">
                  Perbaiki Kata Sandi Murid
                </h3>
                <p className="text-xs text-stone-400 font-medium">
                  Khusus Akun Master: Langsung ubah kata sandi tanpa verifikasi email
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-950/70 border border-emerald-500/40 text-[11px] font-bold text-emerald-300 w-fit mb-3 rounded">
              <Shield className="w-3.5 h-3.5 text-emerald-400" />
              <span>Hak Akses Master: Perubahan kata sandi langsung tanpa verifikasi email</span>
            </div>

            <div className="p-3.5 bg-stone-900/90 border border-stone-800 text-xs space-y-1.5 mb-4 rounded text-stone-300">
              <div><strong>Nama Murid:</strong> <span className="text-white">{studentToResetPassword.user.fullName || studentToResetPassword.user.nickname}</span></div>
              <div><strong>Alamat Email:</strong> <span className="font-mono text-amber-300">{studentToResetPassword.user.email}</span></div>
              <div className="flex items-center gap-1.5 pt-0.5">
                <strong>Kata Sandi Saat Ini:</strong> 
                <span className="font-mono font-bold text-amber-200 bg-stone-950 px-2 py-0.5 border border-amber-500/40 rounded">
                  {studentToResetPassword.currentPassword}
                </span>
              </div>
            </div>

            <div className="mb-5">
              <label className="block text-xs font-bold text-stone-300 mb-1.5">
                Masukkan Kata Sandi Baru Murid <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Contoh: 1234 atau murid2026"
                  value={newPasswordInput}
                  onChange={(e) => setNewPasswordInput(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-stone-950 border border-amber-500/50 text-sm font-mono font-bold text-white rounded outline-none focus:border-amber-400 shadow-[0_0_10px_rgba(245,158,11,0.15)]"
                  autoFocus
                />
              </div>
              <span className="text-[10px] text-stone-400 font-medium mt-1.5 block">
                Minimal 2 karakter. Murid dapat langsung masuk dengan kata sandi baru ini.
              </span>
            </div>

            <div className="flex items-center gap-2.5">
              <button
                onClick={() => setStudentToResetPassword(null)}
                className="flex-1 py-2.5 px-4 bg-stone-800 hover:bg-stone-700 text-stone-300 border border-stone-600 font-bold text-xs rounded transition-all cursor-pointer"
              >
                Batal
              </button>
              <button
                onClick={handleSaveNewStudentPassword}
                className="flex-1 py-2.5 px-4 bg-amber-500 hover:bg-amber-400 text-stone-950 border border-amber-300 font-bold text-xs rounded shadow-[0_0_15px_rgba(245,158,11,0.3)] flex items-center justify-center gap-1.5 transition-all cursor-pointer"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-[#12141c] border-2 border-amber-500/60 p-6 sm:p-7 shadow-[0_0_30px_rgba(0,0,0,0.9)] rounded-lg relative">
            <GrimoireCornerClasp />
            <div className="flex items-center gap-3.5 mb-4">
              <div className="w-12 h-12 bg-amber-500/20 border border-amber-400/60 flex items-center justify-center text-amber-400 text-xl shrink-0 rounded shadow-[0_0_12px_rgba(245,158,11,0.3)]">
                <UserPlus className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-black text-amber-200 font-japanese">
                  Daftarkan Murid Baru
                </h3>
                <p className="text-xs text-stone-400 font-medium">
                  Tambahkan akun murid baru langsung ke Daftar Murid Grimoire
                </p>
              </div>
            </div>

            {addStudentError && (
              <div className="mb-4 p-3 bg-red-950/80 border border-red-500/60 text-xs text-red-200 font-bold rounded">
                ⚠️ {addStudentError}
              </div>
            )}

            <form onSubmit={handleAddStudentByMaster} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-stone-300 mb-1">
                  Nama Lengkap Murid <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Kenji Pratama"
                  value={newStuFullName}
                  onChange={(e) => setNewStuFullName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-stone-950 border border-stone-700 focus:border-amber-400 text-sm font-bold text-white rounded outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-300 mb-1">
                  Nama Panggilan <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Kenji"
                  value={newStuNickname}
                  onChange={(e) => setNewStuNickname(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-stone-950 border border-stone-700 focus:border-amber-400 text-sm font-bold text-white rounded outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-300 mb-1">
                  Alamat Email Murid <span className="text-red-400">*</span>
                </label>
                <input
                  type="email"
                  required
                  placeholder="nama.murid@gmail.com"
                  value={newStuEmail}
                  onChange={(e) => setNewStuEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-stone-950 border border-stone-700 focus:border-amber-400 text-sm font-bold text-white rounded outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-300 mb-1">
                  Kata Sandi Murid <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Minimal 2 karakter (contoh: 1234 / murid2026)"
                  value={newStuPassword}
                  onChange={(e) => setNewStuPassword(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-stone-950 border border-stone-700 focus:border-amber-400 text-sm font-mono font-bold text-white rounded outline-none"
                />
              </div>

              <div className="flex items-center gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddStudentModal(false)}
                  className="flex-1 py-2.5 px-4 bg-stone-800 hover:bg-stone-700 text-stone-300 border border-stone-600 font-bold text-xs rounded transition-all cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 px-4 bg-amber-500 hover:bg-amber-400 text-stone-950 border border-amber-300 font-bold text-xs rounded shadow-[0_0_15px_rgba(245,158,11,0.3)] flex items-center justify-center gap-1.5 transition-all cursor-pointer"
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
