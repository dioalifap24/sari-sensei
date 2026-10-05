import React, { useState, useEffect } from 'react';
import { User, ActiveQuizRecord, QuizControlState, QuizResult, StudentPresenceInfo } from '../types';
import { storageService } from '../services/storageService';
import { Users, Trash2, RefreshCw, Play, Square, AlertTriangle, CheckCircle, Search, Shield, ShieldAlert, UserX, Clock, Calendar, Activity, RotateCcw, Trophy, KeyRound, Eye, EyeOff, Mail, UserPlus, Radio } from 'lucide-react';
import { UchihaClanLogo } from './UchihaClanLogo';

interface MasterManagementViewProps {
  currentUser: User | null;
  onNavigateHome: () => void;
}

export const MasterManagementView: React.FC<MasterManagementViewProps> = ({ currentUser }) => {
  const [subTab, setSubTab] = useState<'all' | 'student_list' | 'live_scores'>('all');
  const [showRegisteredStudentsTable, setShowRegisteredStudentsTable] = useState<boolean>(true);
  
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
      storageService.syncWithServer().then(() => loadData());
    }, 1500);

    // Event listeners for immediate storage updates
    const handleUpdate = () => loadData();

    window.addEventListener('active_quiz_updated', handleUpdate);
    window.addEventListener('student_data_updated', handleUpdate);
    window.addEventListener('quiz_control_changed', handleUpdate);
    window.addEventListener('scores_updated', handleUpdate);
    window.addEventListener('presence_updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);

    return () => {
      clearInterval(intervalId);
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

  // Helper untuk mendapatkan aktivitas live murid saat ini (menggabungkan data presence & kuis aktif)
  const getLiveStudentActivity = (student: User) => {
    const emailLower = student.email.toLowerCase();
    const liveQuiz = activeRecords.find(
      r => r.userEmail.toLowerCase() === emailLower && r.status === 'in_progress'
    );
    const pres = presenceMap[emailLower];

    if (liveQuiz) {
      const qNum = liveQuiz.currentQuestion || 1;
      const ansCount = liveQuiz.answeredCount || 0;
      const tot = liveQuiz.totalQuestions || 50;
      return {
        badgeText: `📝 Sedang Kuis JLPT ${liveQuiz.level} (Soal ${qNum}/${tot} · ${ansCount} dijawab)`,
        subText: `Mulai pukul ${liveQuiz.startedAtTime}${liveQuiz.tabViolationsCount ? ` · ⚠️ ${liveQuiz.tabViolationsCount}x Pindah Tab` : ''}`,
        isTakingQuiz: true,
        violations: liveQuiz.tabViolationsCount || 0,
      };
    }

    if (pres && pres.currentActivity) {
      return {
        badgeText: pres.currentActivity,
        subText: pres.lastActionAt ? `Update terakhir: ${pres.lastActionAt}` : `Level aktif: ${pres.activeLevel || 'N5'}`,
        isTakingQuiz: false,
        violations: 0,
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
      };
    }

    return {
      badgeText: storageService.isStudentOnline(student.email)
        ? '🏠 Membuka Beranda Portal Kelas'
        : '⚪ Belum ada aktivitas sesi ini',
      subText: `Terdaftar: ${student.registeredAt || '-'}`,
      isTakingQuiz: false,
      violations: 0,
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
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 border border-amber-200 text-amber-800 rounded-lg text-xs font-bold animate-pulse">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
            Sedang Dikerjakan
          </span>
          <span className="text-[11px] font-bold text-[#881337]">
            Soal {currentQuestion || 1}/{totalQuestions || 50} ({answeredCount || 0} terjawab)
          </span>
        </div>
      );
    }

    let colorClasses = 'text-black bg-stone-100 border-stone-300';
    let gradeLabel = 'Perlu Belajar';

    if (score >= 71) {
      colorClasses = 'text-emerald-700 bg-emerald-50 border-emerald-300';
      gradeLabel = 'Lulus Sangat Baik';
    } else if (score >= 51) {
      colorClasses = 'text-red-600 bg-red-50 border-red-300';
      gradeLabel = 'Cukup / Remedial';
    } else {
      colorClasses = 'text-black bg-stone-100 border-stone-400 font-black';
      gradeLabel = 'Belum Lulus';
    }

    return (
      <div className="inline-flex flex-col items-center">
        <span className={`px-3 py-1 text-base font-black rounded-lg border shadow-2xs ${colorClasses}`}>
          {score}
        </span>
        <span className="text-[10px] text-[#735338] font-medium mt-0.5">
          {gradeLabel}
        </span>
      </div>
    );
  };

  // Render Badge Ranking / Juara Sesi Ini
  const renderRankBadge = (rank?: number, status?: string) => {
    if (status === 'in_progress' || rank === undefined) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-50 text-amber-800 border border-amber-200 rounded-lg text-xs font-semibold">
          <Clock className="w-3 h-3 text-amber-600 animate-spin" />
          <span>Sedang Kuis</span>
        </span>
      );
    }

    if (rank === 1) {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-gradient-to-r from-amber-100 via-yellow-100 to-amber-200 text-amber-950 border border-amber-400 rounded-xl text-xs font-black shadow-2xs">
          <span className="text-sm">🥇</span>
          <span>Juara 1</span>
        </span>
      );
    }
    if (rank === 2) {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-gradient-to-r from-slate-100 via-gray-100 to-slate-200 text-slate-800 border border-slate-300 rounded-xl text-xs font-black shadow-2xs">
          <span className="text-sm">🥈</span>
          <span>Juara 2</span>
        </span>
      );
    }
    if (rank === 3) {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-gradient-to-r from-amber-50 to-orange-100 text-orange-950 border border-orange-300 rounded-xl text-xs font-black shadow-2xs">
          <span className="text-sm">🥉</span>
          <span>Juara 3</span>
        </span>
      );
    }

    return (
      <span className="inline-flex items-center px-2.5 py-1 bg-[#fbf3e8] text-[#881337] border border-[#ecdac6] rounded-lg text-xs font-bold font-mono">
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
    <div className="max-w-6xl mx-auto px-4 py-6 sm:py-8 space-y-6">
      {/* Toast Notification */}
      {notificationMsg && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 px-5 py-3 bg-[#881337] text-white font-bold text-xs sm:text-sm rounded-2xl shadow-2xl border border-[#fbcfe8] animate-in fade-in slide-in-from-top-4 duration-300 flex items-center gap-2">
          <span>🌸</span>
          <span>{notificationMsg}</span>
        </div>
      )}

      {/* Top Banner: Master Identity & Sesi Kuis Control */}
      <div className="bg-gradient-to-r from-[#fae8eb] via-[#fffdfa] to-[#fbf0df] border-2 border-[#eedac5] rounded-3xl p-5 sm:p-7 shadow-sm">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="flex-1">
            {/* Badges Bar: Dashboard Title & Master Identity */}
            <div className="flex flex-wrap items-center gap-2.5 mb-2.5">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#881337]/10 border border-[#881337]/20 rounded-full text-xs font-black text-[#881337] tracking-wider uppercase shadow-2xs">
                <Shield className="w-3.5 h-3.5 text-[#881337]" />
                <span>DASHBOARD MANAJEMEN SENSEI SARI</span>
              </div>

              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-gradient-to-r from-amber-100 to-amber-200 border border-amber-300 rounded-full text-amber-950 font-black text-xs shadow-2xs">
                <UchihaClanLogo className="w-4 h-4" />
                <span>Akun Master: <span className="font-extrabold text-[#881337]">{currentUser?.nickname || 'skywalker'}</span></span>
              </div>

              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 border border-emerald-300 rounded-full text-emerald-800 font-bold text-xs">
                <Radio className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
                <span>Sinkronisasi Cloud Real-Time Aktif</span>
              </div>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#881337] font-japanese tracking-tight">
              Daftar Murid, Pantauan Aktivitas & Nilai Kuis Live
            </h1>
            <p className="text-xs sm:text-sm text-[#735338] mt-1.5 leading-relaxed max-w-2xl">
              Pantau seluruh murid yang berhasil mendaftar, aktivitas halaman yang sedang dibuka murid secara <strong className="text-[#881337]">live & otomatis</strong>, serta kendalikan sesi kuis dari satu halaman terpusat.
            </p>
          </div>

          {/* Sesi Kuis Control Button (Only visible for Master) */}
          <div className="bg-white/95 border-2 border-[#ebdccb] p-4 rounded-2xl shadow-xs flex flex-col sm:flex-row items-center gap-3.5 shrink-0 w-full lg:w-auto">
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <span 
                className={`w-4 h-4 rounded-full ring-4 transition-all shrink-0 ${
                  quizControl.isActive 
                    ? 'bg-emerald-500 ring-emerald-200 animate-pulse' 
                    : 'bg-rose-500 ring-rose-200'
                }`} 
                aria-hidden="true"
              />
              <div className="text-left">
                <div className="text-xs font-bold text-[#3d2a1b]">
                  Status Sesi Kuis Murid:
                </div>
                <div className={`text-xs font-extrabold ${quizControl.isActive ? 'text-emerald-700' : 'text-rose-600'}`}>
                  {quizControl.isActive ? '🟢 SESI DIMULAI (Murid Bisa Kuis)' : '🔴 DITUTUP (Terkunci)'}
                </div>
              </div>
            </div>

            <button
              onClick={handleToggleQuizSession}
              className={`w-full sm:w-auto px-5 py-2.5 rounded-xl font-extrabold text-xs sm:text-sm transition-all shadow-xs flex items-center justify-center gap-2 text-white active:scale-95 ${
                quizControl.isActive
                  ? 'bg-rose-600 hover:bg-rose-700 ring-2 ring-rose-300'
                  : 'bg-emerald-600 hover:bg-emerald-700 ring-2 ring-emerald-300'
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

        {/* Navigation Sub-Tabs */}
        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-[#eedac5] pt-4">
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setSubTab('all')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                subTab === 'all'
                  ? 'bg-[#881337] text-white shadow-md'
                  : 'bg-white text-[#735338] border border-[#ebdccb] hover:border-[#881337] hover:text-[#881337]'
              }`}
            >
              <Radio className="w-4 h-4" />
              <span>Semua Pantauan (Murid + Aktivitas + Kuis)</span>
            </button>

            <button
              onClick={() => {
                setSubTab('student_list');
                setShowRegisteredStudentsTable(true);
              }}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                subTab === 'student_list'
                  ? 'bg-[#881337] text-white shadow-md'
                  : 'bg-white text-[#735338] border border-[#ebdccb] hover:border-[#881337] hover:text-[#881337]'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Daftar Murid Terdaftar</span>
              <span className={`px-2 py-0.5 rounded-md text-[11px] font-black ${
                subTab === 'student_list' ? 'bg-white/20 text-white' : 'bg-[#fae8eb] text-[#881337]'
              }`}>
                {studentsList.length} Murid
              </span>
            </button>

            <button
              onClick={() => setSubTab('live_scores')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                subTab === 'live_scores'
                  ? 'bg-[#881337] text-white shadow-md'
                  : 'bg-white text-[#735338] border border-[#ebdccb] hover:border-[#881337] hover:text-[#881337]'
              }`}
            >
              <Activity className="w-4 h-4" />
              <span>Nilai & Perankingan Kuis Live</span>
              <span className={`px-2 py-0.5 rounded-md text-[11px] font-black ${
                subTab === 'live_scores' ? 'bg-white/20 text-white' : 'bg-[#fae8eb] text-[#881337]'
              }`}>
                {activeRecords.length} Sesi
              </span>
            </button>
          </div>

          {/* Quick Action: Tambah Murid & Sinkronisasi */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => {
                setAddStudentError('');
                setShowAddStudentModal(true);
              }}
              className="flex items-center gap-1.5 px-3.5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs transition-all shadow-xs active:scale-95"
              title="Daftarkan akun murid baru secara langsung oleh Master"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>+ Tambah Murid Baru</span>
            </button>

            <button
              onClick={handleManualSyncAndReload}
              title="Sinkronkan & muat ulang daftar murid terbaru"
              className="flex items-center gap-1.5 px-3 py-2.5 bg-white text-[#735338] hover:text-[#881337] border border-[#ebdccb] rounded-xl hover:bg-[#fff7ee] text-xs font-bold transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Sinkronkan Data</span>
            </button>
          </div>
        </div>
      </div>

      {/* Ringkasan Statistik Murid & Aktivitas Kelas */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
        {/* Card Total Akun Murid */}
        <div 
          onClick={() => setFilterPresence('all')}
          className={`p-4 sm:p-5 rounded-2xl border-2 transition-all cursor-pointer shadow-xs flex items-center justify-between ${
            filterPresence === 'all'
              ? 'bg-[#fff5f7] border-[#881337] ring-2 ring-[#fbcfe8]'
              : 'bg-[#fffdfa] border-[#ebdccb] hover:border-[#881337]/50'
          }`}
          title="Klik untuk melihat seluruh murid terdaftar"
        >
          <div>
            <div className="text-[11px] font-black uppercase tracking-wider text-[#881337] mb-1 flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5" />
              <span>Total Murid Terdaftar</span>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-[#881337] font-japanese">
              {studentsList.length} Murid
            </div>
            <p className="text-[11px] text-[#735338] mt-0.5">
              Seluruh akun murid yang berhasil mendaftar
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-[#fae8eb] border border-[#fbcfe8] flex items-center justify-center text-[#881337] shrink-0">
            <Users className="w-6 h-6" />
          </div>
        </div>

        {/* Card Murid Online */}
        <div 
          onClick={() => setFilterPresence(filterPresence === 'online' ? 'all' : 'online')}
          className={`p-4 sm:p-5 rounded-2xl border-2 transition-all cursor-pointer shadow-xs flex items-center justify-between ${
            filterPresence === 'online'
              ? 'bg-emerald-50 border-emerald-600 ring-2 ring-emerald-200'
              : 'bg-[#fffdfa] border-[#ebdccb] hover:border-emerald-400'
          }`}
          title="Klik untuk memfilter murid yang sedang online"
        >
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
              <span className="text-[11px] font-black uppercase tracking-wider text-emerald-800">
                Sedang Online & Aktif
              </span>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-emerald-900 font-japanese">
              {onlineStudentsCount} Murid
            </div>
            <p className="text-[11px] text-emerald-700 mt-0.5">
              Sedang aktif membuka aplikasi saat ini
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700 text-xl shrink-0">
            🟢
          </div>
        </div>

        {/* Card Murid Offline */}
        <div 
          onClick={() => setFilterPresence(filterPresence === 'offline' ? 'all' : 'offline')}
          className={`p-4 sm:p-5 rounded-2xl border-2 transition-all cursor-pointer shadow-xs flex items-center justify-between ${
            filterPresence === 'offline'
              ? 'bg-stone-100 border-stone-500 ring-2 ring-stone-200'
              : 'bg-[#fffdfa] border-[#ebdccb] hover:border-stone-400'
          }`}
          title="Klik untuk memfilter murid yang sedang offline"
        >
          <div>
            <div className="flex items-center gap-1.5 mb-1">
              <span className="w-2.5 h-2.5 rounded-full bg-stone-400"></span>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#735338]">
                Sedang Offline
              </span>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-[#3d2a1b] font-japanese">
              {offlineStudentsCount} Murid
            </div>
            <p className="text-[11px] text-[#8c6b4b] mt-0.5">
              Tidak sedang membuka aplikasi
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-stone-100 border border-stone-200 flex items-center justify-center text-stone-500 text-xl shrink-0">
            ⚪
          </div>
        </div>
      </div>

      {/* =========================================================================
          BAGIAN 1: DAFTAR SEMUA MURID YANG BERHASIL MENDAFTAR & PANTAUAN AKTIVITAS LIVE
          ========================================================================= */}
      {(subTab === 'all' || subTab === 'student_list') && (
        <div className="bg-[#fffdfa] border-2 border-[#ebdccb] rounded-3xl overflow-hidden shadow-xs">
          {/* Header Bar Daftar Murid dengan Tombol Sembunyikan / Tampilkan */}
          <div className="bg-[#fbf3e8] border-b border-[#ebdccb] px-5 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#881337] text-white flex items-center justify-center shrink-0">
                {showRegisteredStudentsTable ? <Users className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
              </div>
              <div>
                <h2 className="text-sm sm:text-base font-extrabold text-[#881337] font-japanese flex items-center gap-2 flex-wrap">
                  <span>Daftar Semua Murid yang Berhasil Mendaftar & Pantauan Aktivitas Live</span>
                  <span className="px-2.5 py-0.5 bg-[#fae8eb] text-[#881337] border border-[#f9a8d4] rounded-full text-[11px] font-black">
                    {studentsList.length} Murid Terdaftar
                  </span>
                </h2>
                <p className="text-[11px] text-[#735338]">
                  Menampilkan seluruh akun murid yang berhasil mendaftar beserta pantauan halaman & aktivitas live mereka. (Halaman ini hanya dapat dilihat oleh Akun Master).
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowRegisteredStudentsTable((prev) => !prev)}
              className={`px-3.5 py-2 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-1.5 shrink-0 shadow-2xs active:scale-95 ${
                showRegisteredStudentsTable
                  ? 'bg-white hover:bg-[#fff7ee] text-[#881337] border border-[#dec7b0]'
                  : 'bg-[#881337] hover:bg-[#70102d] text-white'
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
            <div className="p-8 sm:p-10 text-center bg-gradient-to-b from-[#fffdfa] to-[#fdf8f2]">
              <div className="w-12 h-12 rounded-2xl bg-[#fae8eb] border border-[#fbcfe8] text-[#881337] flex items-center justify-center mx-auto mb-3">
                <EyeOff className="w-6 h-6" />
              </div>
              <h3 className="text-sm sm:text-base font-extrabold text-[#881337] font-japanese">
                Tabel Daftar Murid Sedang Disembunyikan Sementara
              </h3>
              <p className="text-xs text-[#735338] max-w-md mx-auto mt-1 mb-4 leading-relaxed">
                Klik tombol di bawah untuk menampilkan kembali seluruh daftar murid yang berhasil mendaftar beserta aktivitas live mereka.
              </p>
              <button
                type="button"
                onClick={() => setShowRegisteredStudentsTable(true)}
                className="px-5 py-2.5 bg-[#881337] hover:bg-[#70102d] text-white font-bold text-xs rounded-xl shadow-xs inline-flex items-center gap-2"
              >
                <Eye className="w-4 h-4" />
                <span>Tampilkan Semua Daftar Murid Sekarang</span>
              </button>
            </div>
          ) : (
            <div className="divide-y divide-[#ebdccb]">
              {/* Filter & Pencarian Murid Terdaftar */}
              <div className="bg-[#fffdfa] p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="flex items-center gap-2 flex-wrap w-full sm:w-auto">
                  <span className="text-xs font-bold text-[#881337]">Filter Kehadiran:</span>
                  <div className="flex items-center gap-1 bg-[#f5ede1] p-1 rounded-xl text-xs">
                    <button
                      onClick={() => setFilterPresence('all')}
                      className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                        filterPresence === 'all'
                          ? 'bg-[#881337] text-white shadow-2xs'
                          : 'text-[#735338] hover:text-[#881337]'
                      }`}
                    >
                      Semua ({studentsList.length})
                    </button>
                    <button
                      onClick={() => setFilterPresence('online')}
                      className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 ${
                        filterPresence === 'online'
                          ? 'bg-emerald-600 text-white shadow-2xs'
                          : 'text-emerald-800 hover:text-emerald-950'
                      }`}
                    >
                      <span className="w-2 h-2 rounded-full bg-emerald-400" />
                      <span>Online ({onlineStudentsCount})</span>
                    </button>
                    <button
                      onClick={() => setFilterPresence('offline')}
                      className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 ${
                        filterPresence === 'offline'
                          ? 'bg-stone-600 text-white shadow-2xs'
                          : 'text-stone-600 hover:text-stone-900'
                      }`}
                    >
                      <span className="w-2 h-2 rounded-full bg-stone-400" />
                      <span>Offline ({offlineStudentsCount})</span>
                    </button>
                  </div>
                </div>

                {/* Search Input */}
                <div className="relative w-full sm:w-80">
                  <Search className="w-4 h-4 text-[#a88a70] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Cari nama murid, panggilan, atau email..."
                    className="w-full pl-10 pr-3.5 py-2 bg-white border border-[#dec7b0] focus:border-[#881337] rounded-xl text-xs sm:text-sm text-[#3d2a1b] outline-hidden"
                  />
                </div>
              </div>

              {filteredStudents.length === 0 ? (
                <div className="p-10 text-center text-[#8c6b4b]">
                  <div className="text-3xl mb-2">🌸</div>
                  <p className="font-bold text-sm text-[#3d2a1b]">Belum ada data murid yang cocok dengan filter pencarian.</p>
                  <p className="text-xs text-[#8c6b4b] mt-1">Klik tombol "Semua" atau "+ Tambah Murid Baru" untuk menambahkan murid.</p>
                </div>
              ) : (
                <>
                  {/* TAMPILAN TABEL DESKTOP (md ke atas) */}
                  <div className="hidden md:block overflow-x-auto">
                    <table className="w-full text-left text-xs sm:text-sm">
                      <thead>
                        <tr className="bg-[#fdf8f2] text-[#881337] border-b border-[#ebdccb] font-bold text-xs uppercase tracking-wider">
                          <th className="py-3.5 px-3 text-center w-12">No</th>
                          <th className="py-3.5 px-4">Identitas Murid Terdaftar</th>
                          <th className="py-3.5 px-3 text-center">Status & Aktivitas Live Murid</th>
                          <th className="py-3.5 px-4">Email & Kata Sandi Akun</th>
                          <th className="py-3.5 px-4 text-center">Riwayat & Nilai Kuis</th>
                          <th className="py-3.5 px-4 text-center">Aksi Master</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#f2e6d6]">
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
                          const activityInfo = getLiveStudentActivity(student);
                          const displayFullName = student.fullName || student.name || student.nickname || 'Murid Terdaftar';
                          const displayNickname = student.nickname || displayFullName.split(/\s+/)[0] || '-';
                          const avatarInitial = displayFullName.charAt(0).toUpperCase();

                          let avgScoreColor = 'text-black bg-stone-100 border-stone-300';
                          if (avgScore !== null) {
                            if (avgScore >= 71) {
                              avgScoreColor = 'text-emerald-700 bg-emerald-50 border-emerald-300';
                            } else if (avgScore >= 51) {
                              avgScoreColor = 'text-red-600 bg-red-50 border-red-300';
                            }
                          }

                          return (
                            <tr
                              key={student.email}
                              className={`transition-colors ${
                                activityInfo.isTakingQuiz
                                  ? 'bg-amber-50/60 hover:bg-amber-50'
                                  : 'hover:bg-[#fcf8f2]'
                              }`}
                            >
                              {/* Kolom 1: Nomor Urut */}
                              <td className="py-4 px-3 text-center font-mono font-bold text-[#881337]">
                                #{idx + 1}
                              </td>

                              {/* Kolom 2: Identitas Murid Terdaftar */}
                              <td className="py-4 px-4">
                                <div className="flex items-center gap-3">
                                  <div className="relative shrink-0">
                                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#881337] to-[#9f1239] text-white flex items-center justify-center font-japanese font-black text-base shadow-2xs">
                                      {avatarInitial}
                                    </div>
                                    <span
                                      className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white ${
                                        isOnline ? 'bg-emerald-500' : 'bg-stone-400'
                                      }`}
                                    />
                                  </div>
                                  <div className="min-w-0">
                                    <div className="flex items-center gap-2 flex-wrap">
                                      <span className="font-extrabold text-[#2b1d19] text-sm">
                                        {displayFullName}
                                      </span>
                                    </div>
                                    <div className="text-xs text-[#735338] mt-0.5 flex items-center gap-2 flex-wrap">
                                      <span>Panggilan: <strong className="text-[#881337]">{displayNickname}</strong></span>
                                      <span aria-hidden="true">·</span>
                                      <span className="text-[11px] text-[#8c6b4b]">
                                        Terdaftar: {student.registeredAt || '2026-10-01'}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </td>

                              {/* Kolom 3: Status Kehadiran & Aktivitas Live */}
                              <td className="py-4 px-3">
                                <div className="flex flex-col items-start gap-1">
                                  <div className="flex items-center gap-1.5 flex-wrap">
                                    {isOnline ? (
                                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-300 rounded-lg text-[11px] font-extrabold">
                                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                                        <span>Online</span>
                                      </span>
                                    ) : (
                                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-stone-100 text-stone-600 border border-stone-200 rounded-lg text-[11px] font-semibold">
                                        <span className="w-2 h-2 rounded-full bg-stone-400" />
                                        <span>Offline</span>
                                      </span>
                                    )}

                                    {activityInfo.violations > 0 && (
                                      <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-rose-100 text-rose-800 border border-rose-300 rounded-md text-[10px] font-black">
                                        <ShieldAlert className="w-3 h-3 text-rose-600" />
                                        <span>{activityInfo.violations}x Pindah Tab</span>
                                      </span>
                                    )}
                                  </div>

                                  <div className={`text-xs font-bold px-2.5 py-1 rounded-lg border ${
                                    activityInfo.isTakingQuiz
                                      ? 'bg-amber-100/90 text-amber-950 border-amber-300'
                                      : isOnline
                                      ? 'bg-[#fff8ef] text-[#881337] border-[#ebdccb]'
                                      : 'bg-stone-50 text-stone-600 border-stone-200'
                                  }`}>
                                    {activityInfo.badgeText}
                                  </div>
                                  <span className="text-[10px] text-[#8c6b4b]">
                                    {activityInfo.subText}
                                  </span>
                                </div>
                              </td>

                              {/* Kolom 4: Email & Kata Sandi */}
                              <td className="py-4 px-4">
                                <div className="space-y-1.5">
                                  <div className="flex items-center gap-1.5 text-xs">
                                    <Mail className="w-3.5 h-3.5 text-[#881337] shrink-0" />
                                    <span className="font-mono font-bold text-[#2b1d19] break-all">
                                      {student.email}
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-2 text-xs">
                                    <KeyRound className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                                    <span className="text-[#735338]">Sandi:</span>
                                    <span className="font-mono font-black text-[#881337] bg-[#fbf6ef] px-2 py-0.5 rounded-md border border-[#e4ccb5]">
                                      {visiblePasswords[student.email] ? studentPassword : '••••••••'}
                                    </span>
                                    <button
                                      type="button"
                                      onClick={() => togglePasswordVisibility(student.email)}
                                      className="px-2 py-0.5 bg-white hover:bg-[#fff7ee] text-[#735338] hover:text-[#881337] border border-[#dec7b0] rounded-md text-[11px] font-bold transition-colors inline-flex items-center gap-1"
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

                              {/* Kolom 5: Riwayat & Nilai Kuis */}
                              <td className="py-4 px-4 text-center whitespace-nowrap">
                                {totalQuizzes > 0 ? (
                                  <div className="inline-flex flex-col items-center gap-1">
                                    <div className="flex items-center gap-1.5">
                                      <span className="text-xs font-extrabold text-[#3d2a1b]">
                                        {totalQuizzes}x Kuis
                                      </span>
                                      <span aria-hidden="true" className="text-[#dec7b0]">·</span>
                                      <span className={`px-2 py-0.5 rounded-md border text-xs font-black ${avgScoreColor}`} title="Rata-rata nilai">
                                        Rata-rata: {avgScore}
                                      </span>
                                    </div>
                                    <div className="flex items-center gap-2 text-[11px] text-[#735338]">
                                      <span>Tertinggi: <strong className="text-[#881337]">{bestScore}</strong></span>
                                      <button
                                        type="button"
                                        onClick={() => setStudentDetailModal(student)}
                                        className="text-[#881337] underline hover:text-[#70102d] font-bold"
                                      >
                                        Lihat Rincian
                                      </button>
                                    </div>
                                  </div>
                                ) : (
                                  <span className="text-xs text-[#a88a70] italic">
                                    Belum ada nilai kuis
                                  </span>
                                )}
                              </td>

                              {/* Kolom 6: Aksi Master */}
                              <td className="py-4 px-4 text-center whitespace-nowrap">
                                <div className="inline-flex items-center justify-center gap-1.5">
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setStudentToResetPassword({ user: student, currentPassword: studentPassword });
                                      setNewPasswordInput('');
                                    }}
                                    className="py-1.5 px-2.5 bg-amber-50 hover:bg-amber-600 text-amber-900 hover:text-white border border-amber-300 font-bold rounded-xl text-xs transition-all inline-flex items-center gap-1 active:scale-95"
                                    title="Ubah kata sandi murid ini"
                                  >
                                    <KeyRound className="w-3.5 h-3.5" />
                                    <span>Ubah Sandi</span>
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => setStudentToDelete(student)}
                                    className="py-1.5 px-2.5 bg-red-50 hover:bg-red-600 text-red-600 hover:text-white border border-red-200 font-bold rounded-xl text-xs transition-all inline-flex items-center gap-1 active:scale-95"
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

                  {/* TAMPILAN KARTU RESPONSIF (Layar HP / Mobile < md) */}
                  <div className="md:hidden divide-y divide-[#ebdccb]">
                    {filteredStudents.map((student, idx) => {
                      const studentScores = allScores.filter(s => s.userEmail.toLowerCase() === student.email.toLowerCase());
                      const totalQuizzes = studentScores.length;
                      const avgScore = totalQuizzes > 0
                        ? Math.round(studentScores.reduce((acc, s) => acc + s.score, 0) / totalQuizzes)
                        : null;

                      const cred = studentsCredentials.find(c => c.user.email.toLowerCase() === student.email.toLowerCase());
                      const studentPassword = cred ? cred.password : '••••••••';
                      const isOnline = storageService.isStudentOnline(student.email);
                      const activityInfo = getLiveStudentActivity(student);
                      const displayFullName = student.fullName || student.name || student.nickname || 'Murid Terdaftar';
                      const displayNickname = student.nickname || displayFullName.split(/\s+/)[0] || '-';
                      const avatarInitial = displayFullName.charAt(0).toUpperCase();

                      let avgScoreColor = 'text-black bg-stone-100 border-stone-300';
                      if (avgScore !== null) {
                        if (avgScore >= 71) {
                          avgScoreColor = 'text-emerald-700 bg-emerald-50 border-emerald-300';
                        } else if (avgScore >= 51) {
                          avgScoreColor = 'text-red-600 bg-red-50 border-red-300';
                        }
                      }

                      return (
                        <div key={student.email} className="p-4 space-y-3">
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-xl bg-[#881337] text-white flex items-center justify-center font-japanese font-black text-base shrink-0">
                                {avatarInitial}
                              </div>
                              <div>
                                <div className="flex items-center gap-1.5 flex-wrap">
                                  <span className="text-xs font-mono font-bold text-[#881337]">#{idx + 1}</span>
                                  <h3 className="text-sm font-extrabold text-[#2b1d19]">{displayFullName}</h3>
                                </div>
                                <p className="text-xs text-[#735338] mt-0.5">
                                  Panggilan: <strong className="text-[#881337]">{displayNickname}</strong> · {student.registeredAt || '2026-10-01'}
                                </p>
                              </div>
                            </div>

                            {isOnline ? (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-300 rounded-lg text-[11px] font-extrabold shrink-0">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                                <span>Online</span>
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-stone-100 text-stone-600 border border-stone-200 rounded-lg text-[11px] font-semibold shrink-0">
                                <span className="w-1.5 h-1.5 rounded-full bg-stone-400" />
                                <span>Offline</span>
                              </span>
                            )}
                          </div>

                          {/* Aktivitas Live di Mobile */}
                          <div className="p-2.5 bg-[#fff8ef] border border-[#ebdccb] rounded-xl text-xs">
                            <div className="font-bold text-[#881337]">{activityInfo.badgeText}</div>
                            <div className="text-[10px] text-[#735338] mt-0.5">{activityInfo.subText}</div>
                          </div>

                          <div className="bg-[#fbf6ef] border border-[#ebdccb] rounded-xl p-3 space-y-1.5 text-xs">
                            <div className="flex items-center gap-1.5">
                              <Mail className="w-3.5 h-3.5 text-[#881337] shrink-0" />
                              <span className="font-mono font-bold text-[#2b1d19] break-all">{student.email}</span>
                            </div>
                            <div className="flex items-center justify-between gap-2 pt-1 border-t border-[#ebdccb]/70">
                              <div className="flex items-center gap-1.5">
                                <KeyRound className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                                <span className="text-[#735338]">Sandi:</span>
                                <span className="font-mono font-black text-[#881337]">
                                  {visiblePasswords[student.email] ? studentPassword : '••••••••'}
                                </span>
                              </div>
                              <button
                                type="button"
                                onClick={() => togglePasswordVisibility(student.email)}
                                className="px-2 py-0.5 bg-white border border-[#dec7b0] rounded-md text-[11px] font-bold text-[#881337]"
                              >
                                {visiblePasswords[student.email] ? 'Tutup' : 'Lihat'}
                              </button>
                            </div>
                          </div>

                          <div className="flex items-center justify-between text-xs bg-white border border-[#f2e6d6] rounded-xl px-3 py-2">
                            <span className="font-bold text-[#3d2a1b]">Riwayat: {totalQuizzes}x Kuis</span>
                            {avgScore !== null ? (
                              <div className="flex items-center gap-2">
                                <span className={`px-2 py-0.5 rounded-md border font-black ${avgScoreColor}`}>
                                  Rata-rata: {avgScore}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => setStudentDetailModal(student)}
                                  className="text-[#881337] underline font-bold"
                                >
                                  Rincian
                                </button>
                              </div>
                            ) : (
                              <span className="text-[#a88a70] italic">Belum ada nilai</span>
                            )}
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => {
                                setStudentToResetPassword({ user: student, currentPassword: studentPassword });
                                setNewPasswordInput('');
                              }}
                              className="flex-1 py-2 px-3 bg-amber-50 text-amber-900 border border-amber-300 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5"
                            >
                              <KeyRound className="w-3.5 h-3.5" />
                              <span>Ubah Sandi</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => setStudentToDelete(student)}
                              className="flex-1 py-2 px-3 bg-red-50 text-red-600 border border-red-200 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5"
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
      )}

      {/* =========================================================================
          BAGIAN 2: "NILAI MURID" (LIVE QUIZ PROGRESS, RANKING & SCORE MONITORING)
          ========================================================================= */}
      {(subTab === 'all' || subTab === 'live_scores') && (
        <div className="space-y-4">
          {/* Papan Peringkat Sesi Kuis (Top 3 Juara Sesi Ini) */}
          {sortedCompletedRecords.length > 0 && (
            <div className="bg-gradient-to-r from-amber-50/80 via-[#fffdfa] to-orange-50/80 border border-amber-200 rounded-3xl p-4 sm:p-5 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3.5">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-amber-100 border border-amber-300 flex items-center justify-center text-amber-700">
                    <Trophy className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm sm:text-base font-extrabold text-[#881337] font-japanese">
                      Papan Perankingan Sesi Kuis Saat Ini (Top 3)
                    </h3>
                    <p className="text-[11px] text-[#735338]">
                      Urutan juara pada sesi kuis ini berdasarkan perolehan skor tertinggi & waktu pengerjaan.
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setShowResetRankingModal(true)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300 rounded-xl text-xs font-bold transition-colors w-fit active:scale-95 shadow-2xs"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset Ranking Sesi Kuis</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {sortedCompletedRecords.slice(0, 3).map((rec, idx) => {
                  const medalIcon = idx === 0 ? '🥇' : idx === 1 ? '🥈' : '🥉';
                  const medalTitle = idx === 0 ? 'Juara 1 (Emas)' : idx === 1 ? 'Juara 2 (Perak)' : 'Juara 3 (Perunggu)';
                  const cardBg = idx === 0 
                    ? 'border-amber-400 bg-amber-50/70 ring-2 ring-amber-300/60' 
                    : idx === 1 
                    ? 'border-slate-300 bg-slate-50/70' 
                    : 'border-orange-300 bg-orange-50/70';

                  return (
                    <div key={rec.id} className={`p-3.5 rounded-2xl border ${cardBg} flex items-center gap-3 relative shadow-2xs`}>
                      <div className="text-3xl shrink-0 drop-shadow-xs">{medalIcon}</div>
                      <div className="flex-1 min-w-0">
                        <div className="text-[10px] font-black uppercase tracking-wider text-amber-900">
                          {medalTitle}
                        </div>
                        <div className="font-extrabold text-[#3d2a1b] text-sm truncate">
                          {rec.studentName}
                        </div>
                        <div className="text-[11px] text-[#735338] flex items-center gap-2 mt-0.5">
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

          {/* Filter Bar & Tombol Reset Ranking */}
          <div className="bg-[#fffdfa] border border-[#ebdccb] p-4 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3 shadow-2xs">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-[#881337]" />
              <span className="text-xs sm:text-sm font-extrabold text-[#881337] font-japanese">
                Tabel Pantauan Sesi Kuis & Peringkat Live ({filteredRecords.length} Sesi)
              </span>
            </div>

            {/* Filters & Reset Ranking Button */}
            <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto justify-end">
              <div className="flex items-center gap-1 bg-[#f5ede1] p-1 rounded-xl text-xs">
                {(['all', 'in_progress', 'completed'] as const).map((st) => (
                  <button
                    key={st}
                    onClick={() => setFilterStatus(st)}
                    className={`px-3 py-1 rounded-lg font-bold transition-all ${
                      filterStatus === st
                        ? 'bg-[#881337] text-white shadow-2xs'
                        : 'text-[#735338] hover:text-[#881337]'
                    }`}
                  >
                    {st === 'all' ? 'Semua' : st === 'in_progress' ? 'Sedang Kuis' : 'Selesai'}
                  </button>
                ))}
              </div>

              <select
                value={filterLevel}
                onChange={(e) => setFilterLevel(e.target.value)}
                className="px-3 py-1.5 bg-white border border-[#dec7b0] rounded-xl text-xs font-semibold text-[#735338] outline-hidden"
              >
                <option value="all">Semua Level</option>
                <option value="N5">Level N5</option>
                <option value="N4">Level N4</option>
                <option value="N3">Level N3</option>
                <option value="N2">Level N2</option>
              </select>

              <button
                onClick={() => setShowResetRankingModal(true)}
                className="px-3.5 py-1.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white rounded-xl text-xs font-extrabold shadow-2xs transition-all flex items-center gap-1.5 shrink-0 active:scale-95"
                title="Reset papan perankingan untuk sesi kuis baru (tidak menghapus total kuis atau rapor murid)"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Ranking Sesi</span>
              </button>
            </div>
          </div>

          {/* Live Activity & Ranking Table */}
          <div className="bg-[#fffdfa] border border-[#ebdccb] rounded-2xl overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead>
                  <tr className="bg-[#fbf3e8] text-[#881337] border-b border-[#ebdccb] font-bold">
                    <th className="py-3 px-3 text-center">Peringkat</th>
                    <th className="py-3 px-4">Nama Murid</th>
                    <th className="py-3 px-3">Level Kuis</th>
                    <th className="py-3 px-3">Tanggal</th>
                    <th className="py-3 px-3">Jam Mulai</th>
                    <th className="py-3 px-3">Jam Selesai</th>
                    <th className="py-3 px-4 text-center">Progres / Nilai Murid</th>
                    <th className="py-3 px-3 text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f2e6d6]">
                  {filteredRecords.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-8 text-center text-[#8c6b4b]">
                        <div className="text-2xl mb-1">🌸</div>
                        <p className="font-semibold">Papan perankingan sesi ini belum memiliki rekaman kuis.</p>
                        <p className="text-xs text-[#a88a70] mt-0.5">
                          Saat murid mulai mengerjakan kuis, nomor soal yang sedang dikerjakan dan perolehan nilai akan otomatis muncul secara live di tabel ini.
                        </p>
                      </td>
                    </tr>
                  ) : (
                    filteredRecords.map((rec) => (
                      <tr 
                        key={rec.id} 
                        className={`transition-colors ${
                          rec.status === 'in_progress' ? 'bg-[#fff9f0] hover:bg-[#fef3e3]' : 'hover:bg-[#fcf8f2]'
                        }`}
                      >
                        <td className="py-3 px-3 text-center whitespace-nowrap">
                          {renderRankBadge(rankMap.get(rec.id), rec.status)}
                        </td>

                        <td className="py-3 px-4">
                          <div className="flex flex-wrap items-center gap-1.5">
                            <span className="font-bold text-[#3d2a1b]">
                              {rec.studentName}
                            </span>
                            {rec.tabViolationsCount && rec.tabViolationsCount > 0 ? (
                              <span 
                                className="inline-flex items-center gap-1 px-2 py-0.5 bg-rose-100 text-rose-800 border border-rose-300 rounded-md text-[10px] font-black shrink-0"
                                title={`Peringatan: Murid terdeteksi berpindah tab / keluar jendela sebanyak ${rec.tabViolationsCount} kali`}
                              >
                                <ShieldAlert className="w-3 h-3 text-rose-600 shrink-0" />
                                <span>{rec.tabViolationsCount}x Pindah Tab</span>
                              </span>
                            ) : null}
                          </div>
                          <div className="text-[11px] text-[#8c6b4b] flex items-center gap-1 mt-0.5">
                            <span className="font-medium text-[#881337]">Panggilan: {rec.studentNickname}</span>
                          </div>
                        </td>

                        <td className="py-3 px-3">
                          <span className="px-2.5 py-1 bg-[#881337] text-white font-bold rounded-lg text-xs">
                            JLPT {rec.level}
                          </span>
                        </td>

                        <td className="py-3 px-3 font-medium text-[#5a4332] whitespace-nowrap">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5 text-[#881337]" />
                            <span>{rec.date}</span>
                          </div>
                        </td>

                        <td className="py-3 px-3 font-mono font-semibold text-[#6e533d] whitespace-nowrap">
                          <div className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5 text-[#a88a70]" />
                            <span>{rec.startedAtTime}</span>
                          </div>
                        </td>

                        <td className="py-3 px-3 whitespace-nowrap">
                          {rec.status === 'in_progress' || !rec.completedAtTime ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-100 text-amber-900 border border-amber-300 rounded-lg text-xs font-extrabold animate-pulse">
                              <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
                              sedang dikerjakan
                            </span>
                          ) : (
                            <div className="flex items-center gap-1 font-mono font-bold text-emerald-800">
                              <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                              <span>{rec.completedAtTime}</span>
                            </div>
                          )}
                        </td>

                        <td className="py-3 px-4 text-center whitespace-nowrap">
                          {renderScoreBadge(rec)}
                        </td>

                        <td className="py-3 px-3 text-center whitespace-nowrap">
                          <button
                            onClick={() => setRecordToDelete(rec)}
                            className="p-1.5 text-[#a88a70] hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
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

          {/* Keterangan Skema Warna Nilai */}
          <div className="p-4 bg-[#fffdfa] border border-[#ebdccb] rounded-2xl flex flex-wrap items-center justify-between gap-3 text-xs text-[#735338]">
            <span className="font-bold text-[#881337]">
              🎨 Aturan Pewarnaan Nilai Murid:
            </span>
            <div className="flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-1">
                <span className="w-3 h-3 rounded-full bg-black" />
                <span><strong>0 – 50:</strong> Berwarna Hitam</span>
              </span>
              <span className="inline-flex items-center gap-1">
                <span className="w-3 h-3 rounded-full bg-red-600" />
                <span><strong>51 – 70:</strong> Berwarna Merah</span>
              </span>
              <span className="inline-flex items-center gap-1">
                <span className="w-3 h-3 rounded-full bg-emerald-600" />
                <span><strong>71 – 100:</strong> Berwarna Hijau</span>
              </span>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL RINCIAN RIWAYAT KUIS MURID TERDAFTAR
          ========================================================================= */}
      {studentDetailModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="w-full max-w-lg bg-[#fffdfa] border-2 border-[#ebdccb] rounded-3xl p-6 shadow-2xl max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between gap-3 pb-4 border-b border-[#ebdccb]">
              <div>
                <h3 className="text-lg font-bold text-[#881337] font-japanese">
                  Rincian Nilai Kuis: {studentDetailModal.fullName || studentDetailModal.nickname}
                </h3>
                <p className="text-xs text-[#735338] font-mono">
                  {studentDetailModal.email}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setStudentDetailModal(null)}
                className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-[#553b26] font-bold text-xs rounded-xl"
              >
                Tutup
              </button>
            </div>

            <div className="overflow-y-auto my-4 flex-1">
              {(() => {
                const stuScores = allScores.filter(
                  s => s.userEmail.toLowerCase() === studentDetailModal.email.toLowerCase()
                );
                if (stuScores.length === 0) {
                  return (
                    <p className="text-center text-xs text-[#8c6b4b] py-8">
                      Murid ini belum memiliki riwayat pengerjaan kuis.
                    </p>
                  );
                }
                return (
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="bg-[#fbf3e8] text-[#881337] border-b border-[#ebdccb] font-bold">
                        <th className="py-2.5 px-3">Tanggal</th>
                        <th className="py-2.5 px-3">Level</th>
                        <th className="py-2.5 px-3 text-center">Benar</th>
                        <th className="py-2.5 px-3 text-center">Nilai</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#f2e6d6]">
                      {stuScores.map((sc) => (
                        <tr key={sc.id}>
                          <td className="py-2.5 px-3 font-mono text-[#553b26]">{sc.completedAt}</td>
                          <td className="py-2.5 px-3 font-bold text-[#881337]">JLPT {sc.level}</td>
                          <td className="py-2.5 px-3 text-center text-[#735338]">
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-[#fffdfa] border-2 border-red-300 rounded-3xl p-6 shadow-2xl">
            <div className="w-12 h-12 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <h3 className="text-lg font-bold text-red-900 text-center font-japanese mb-2">
              Konfirmasi Hapus Akun Murid
            </h3>

            <p className="text-xs text-[#6e533d] text-center leading-relaxed mb-4">
              Apakah Sensei yakin ingin menghapus akun murid:
              <br />
              <strong className="text-base text-[#881337] block mt-1">
                {studentToDelete.fullName || studentToDelete.nickname} ({studentToDelete.email})
              </strong>
            </p>

            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-[11px] text-red-800 mb-5 leading-relaxed">
              ⚠️ <strong>Peringatan:</strong> Seluruh riwayat hasil kuis, rekaman sesi aktif, dan data profil murid ini akan <strong>otomatis terhapus bersih dan permanen</strong> dari sistem Sensei Sari.
            </div>

            <div className="flex items-center gap-2.5">
              <button
                onClick={() => setStudentToDelete(null)}
                className="flex-1 py-2.5 px-4 bg-stone-100 hover:bg-stone-200 text-[#553b26] font-bold text-xs rounded-xl transition-colors"
              >
                Batal
              </button>
              <button
                onClick={handleConfirmDeleteStudent}
                className="flex-1 py-2.5 px-4 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl shadow-md transition-all active:scale-95"
              >
                Ya, Hapus Semua Data Murid
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL KONFIRMASI HAPUS SINGLE REKAMAN KUIS */}
      {recordToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="w-full max-w-sm bg-white border border-[#ebdccb] rounded-3xl p-5 shadow-xl text-center">
            <h4 className="text-sm font-bold text-[#881337] mb-2">Hapus Rekaman Kuis Ini?</h4>
            <p className="text-xs text-[#735338] mb-4">
              Rekaman kuis {recordToDelete.studentName} ({recordToDelete.level}) pada {recordToDelete.date} akan dihapus.
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setRecordToDelete(null)}
                className="flex-1 py-2 bg-stone-100 text-[#553b26] font-semibold text-xs rounded-xl"
              >
                Batal
              </button>
              <button
                onClick={handleConfirmDeleteRecord}
                className="flex-1 py-2 bg-red-600 text-white font-bold text-xs rounded-xl"
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
          <div className="w-full max-w-md bg-[#fffdfa] border-2 border-amber-400 rounded-3xl p-6 sm:p-7 shadow-2xl">
            <div className="flex items-center gap-3.5 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 border border-amber-300 flex items-center justify-center text-amber-700 text-2xl shrink-0 shadow-2xs">
                🏆
              </div>
              <div>
                <h3 className="text-lg font-bold text-[#881337] font-japanese">
                  Reset Ranking Sesi Kuis?
                </h3>
                <p className="text-xs text-[#735338]">
                  Menyesuaikan & memulai papan peringkat untuk sesi kuis baru
                </p>
              </div>
            </div>

            <div className="p-4 bg-amber-50/80 border border-amber-200/90 rounded-2xl text-xs space-y-2.5 mb-5">
              <p className="font-bold text-amber-950">
                Papan perankingan sesi ini akan dikosongkan agar siap digunakan untuk sesi pengerjaan kuis yang baru.
              </p>
              <div className="pt-2 border-t border-amber-200/70 space-y-1.5 text-[#5e412b]">
                <div className="flex items-center gap-2">
                  <span className="text-emerald-600 font-black text-sm">✓</span>
                  <span><strong>Total Kuis Murid</strong> di Daftar Murid tetap aman & tidak berkurang.</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-emerald-600 font-black text-sm">✓</span>
                  <span><strong>Laporan Pribadi (Rapor)</strong> di akun master & akun murid tetap tersimpan 100%.</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-emerald-600 font-black text-sm">✓</span>
                  <span>Hanya rekaman live sesi ini yang diatur ulang ke posisi awal.</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <button
                onClick={() => setShowResetRankingModal(false)}
                className="flex-1 py-2.5 px-4 bg-stone-100 hover:bg-stone-200 text-[#553b26] font-bold text-xs rounded-xl transition-colors"
              >
                Batal
              </button>
              <button
                onClick={handleConfirmResetRanking}
                className="flex-1 py-2.5 px-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold text-xs rounded-xl shadow-md transition-all active:scale-95 flex items-center justify-center gap-2"
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
          <div className="w-full max-w-md bg-[#fffdfa] border-2 border-amber-400 rounded-3xl p-6 sm:p-7 shadow-2xl">
            <div className="flex items-center gap-3.5 mb-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 border border-amber-300 flex items-center justify-center text-amber-700 text-xl shrink-0 shadow-2xs">
                <KeyRound className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-[#881337] font-japanese">
                  Perbaiki Kata Sandi Murid
                </h3>
                <p className="text-xs text-[#735338]">
                  Khusus Akun Master: Langsung ubah kata sandi tanpa verifikasi email
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 border border-emerald-300 rounded-full text-[11px] font-bold text-emerald-900 w-fit mb-3 shadow-2xs">
              <Shield className="w-3.5 h-3.5 text-emerald-700" />
              <span>Hak Akses Master: Perubahan kata sandi langsung tanpa verifikasi email</span>
            </div>

            <div className="p-3.5 bg-amber-50/80 border border-amber-200/90 rounded-2xl text-xs space-y-1.5 mb-4">
              <div><strong>Nama Murid:</strong> {studentToResetPassword.user.fullName || studentToResetPassword.user.nickname}</div>
              <div><strong>Alamat Email:</strong> <span className="font-mono text-[#553b26]">{studentToResetPassword.user.email}</span></div>
              <div className="flex items-center gap-1.5 pt-0.5">
                <strong>Kata Sandi Saat Ini:</strong> 
                <span className="font-mono font-bold text-[#881337] bg-white px-2 py-0.5 rounded-md border border-amber-300">
                  {studentToResetPassword.currentPassword}
                </span>
              </div>
            </div>

            <div className="mb-5">
              <label className="block text-xs font-bold text-[#5a4230] mb-1.5">
                Masukkan Kata Sandi Baru Murid <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Contoh: 1234 atau murid2026"
                  value={newPasswordInput}
                  onChange={(e) => setNewPasswordInput(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white border border-[#ddcaa8] focus:border-[#881337] rounded-xl text-sm font-mono text-[#2b1d19] outline-hidden"
                  autoFocus
                />
              </div>
              <span className="text-[10px] text-[#735338] mt-1 block">
                Minimal 2 karakter. Murid dapat langsung masuk dengan kata sandi baru ini.
              </span>
            </div>

            <div className="flex items-center gap-2.5">
              <button
                onClick={() => setStudentToResetPassword(null)}
                className="flex-1 py-2.5 px-4 bg-stone-100 hover:bg-stone-200 text-[#553b26] font-bold text-xs rounded-xl transition-colors"
              >
                Batal
              </button>
              <button
                onClick={handleSaveNewStudentPassword}
                className="flex-1 py-2.5 px-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold text-xs rounded-xl shadow-md transition-all active:scale-95 flex items-center justify-center gap-1.5"
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
          <div className="w-full max-w-md bg-[#fffdfa] border-2 border-[#ebdccb] rounded-3xl p-6 sm:p-7 shadow-2xl">
            <div className="flex items-center gap-3.5 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-[#fae8eb] border border-[#fbcfe8] flex items-center justify-center text-[#881337] text-xl shrink-0 shadow-2xs">
                <UserPlus className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-[#881337] font-japanese">
                  Daftarkan Murid Baru
                </h3>
                <p className="text-xs text-[#735338]">
                  Tambahkan akun murid baru langsung ke Daftar Murid Sensei Sari
                </p>
              </div>
            </div>

            {addStudentError && (
              <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 font-semibold">
                ⚠️ {addStudentError}
              </div>
            )}

            <form onSubmit={handleAddStudentByMaster} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-[#5a4230] mb-1">
                  Nama Lengkap Murid <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Kenji Pratama"
                  value={newStuFullName}
                  onChange={(e) => setNewStuFullName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white border border-[#ddcaa8] focus:border-[#881337] rounded-xl text-sm text-[#2b1d19] outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#5a4230] mb-1">
                  Nama Panggilan <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Kenji"
                  value={newStuNickname}
                  onChange={(e) => setNewStuNickname(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white border border-[#ddcaa8] focus:border-[#881337] rounded-xl text-sm text-[#2b1d19] outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#5a4230] mb-1">
                  Alamat Email Murid <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  required
                  placeholder="nama.murid@gmail.com"
                  value={newStuEmail}
                  onChange={(e) => setNewStuEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white border border-[#ddcaa8] focus:border-[#881337] rounded-xl text-sm text-[#2b1d19] outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#5a4230] mb-1">
                  Kata Sandi Murid <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Minimal 2 karakter (contoh: 1234 / murid2026)"
                  value={newStuPassword}
                  onChange={(e) => setNewStuPassword(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white border border-[#ddcaa8] focus:border-[#881337] rounded-xl text-sm font-mono text-[#2b1d19] outline-hidden"
                />
              </div>

              <div className="flex items-center gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddStudentModal(false)}
                  className="flex-1 py-2.5 px-4 bg-stone-100 hover:bg-stone-200 text-[#553b26] font-bold text-xs rounded-xl transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 px-4 bg-[#881337] hover:bg-[#70102d] text-white font-bold text-xs rounded-xl shadow-md transition-all active:scale-95 flex items-center justify-center gap-1.5"
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
