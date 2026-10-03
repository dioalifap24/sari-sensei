import React, { useState, useEffect } from 'react';
import { User, ActiveQuizRecord, QuizControlState, QuizResult } from '../types';
import { storageService, MASTER_CONFIG } from '../services/storageService';
import { Users, Award, Trash2, RefreshCw, Play, Square, AlertTriangle, CheckCircle, Search, Filter, Shield, UserX, Clock, Calendar, ChevronRight, Activity, RotateCcw, Trophy, Medal, Sparkles, KeyRound, Eye, EyeOff, Mail } from 'lucide-react';
import { UchihaClanLogo } from './UchihaClanLogo';

interface MasterManagementViewProps {
  currentUser: User | null;
  onNavigateHome: () => void;
}

export const MasterManagementView: React.FC<MasterManagementViewProps> = ({ currentUser, onNavigateHome }) => {
  const [subTab, setSubTab] = useState<'live_scores' | 'student_list'>('live_scores');
  
  // Live records and students data
  const [activeRecords, setActiveRecords] = useState<ActiveQuizRecord[]>([]);
  const [studentsList, setStudentsList] = useState<User[]>([]);
  const [studentsCredentials, setStudentsCredentials] = useState<{ user: User; password: string }[]>([]);
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
  const [newPasswordInput, setNewPasswordInput] = useState('');
  
  // Master Password Management State (Bebas 2 sampai 10 karakter)
  const [showMasterPasswordModal, setShowMasterPasswordModal] = useState(false);
  const [masterCurrentPassword, setMasterCurrentPassword] = useState('');
  const [masterNewPasswordInput, setMasterNewPasswordInput] = useState('');
  const [notificationMsg, setNotificationMsg] = useState<string | null>(null);

  // Load all data
  const loadData = () => {
    setActiveRecords(storageService.getActiveQuizRecords());
    const creds = storageService.getAllStudentsWithCredentials();
    setStudentsCredentials(creds);
    setStudentsList(creds.map(c => c.user));
    setQuizControl(storageService.getQuizControlState());
    setAllScores(storageService.getAllScores());
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
    if (!cleanPass || cleanPass.length < 8) {
      setNotificationMsg('Kata sandi baru murid wajib minimal 8 karakter!');
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

  const handleSaveMasterPassword = () => {
    const cleanPass = masterNewPasswordInput.trim();
    if (cleanPass.length < 2 || cleanPass.length > 10) {
      setNotificationMsg('Kata sandi akun master bebas antara minimal 2 sampai maksimal 10 karakter!');
      setTimeout(() => setNotificationMsg(null), 3000);
      return;
    }
    const res = storageService.updateStudentPassword(MASTER_CONFIG.email, cleanPass);
    if (res.success) {
      setNotificationMsg(`Kata sandi akun Master berhasil diubah menjadi "${cleanPass}"! 🔑`);
      setShowMasterPasswordModal(false);
      setMasterNewPasswordInput('');
      loadData();
    } else {
      setNotificationMsg(res.message);
    }
    setTimeout(() => setNotificationMsg(null), 4000);
  };

  useEffect(() => {
    loadData();

    // Auto-refresh interval every 3 seconds for live tracking
    const intervalId = window.setInterval(() => {
      loadData();
    }, 3000);

    // Event listeners for immediate storage updates
    const handleActiveQuizUpdate = () => loadData();
    const handleStudentDataUpdate = () => loadData();
    const handleQuizControlChange = () => loadData();
    const handleScoresUpdate = () => loadData();

    window.addEventListener('active_quiz_updated', handleActiveQuizUpdate);
    window.addEventListener('student_data_updated', handleStudentDataUpdate);
    window.addEventListener('quiz_control_changed', handleQuizControlChange);
    window.addEventListener('scores_updated', handleScoresUpdate);
    window.addEventListener('presence_updated', loadData);
    window.addEventListener('storage', loadData);

    return () => {
      clearInterval(intervalId);
      window.removeEventListener('active_quiz_updated', handleActiveQuizUpdate);
      window.removeEventListener('student_data_updated', handleStudentDataUpdate);
      window.removeEventListener('quiz_control_changed', handleQuizControlChange);
      window.removeEventListener('scores_updated', handleScoresUpdate);
      window.removeEventListener('presence_updated', loadData);
      window.removeEventListener('storage', loadData);
    };
  }, []);

  // Toggle Sesi Kuis
  const handleToggleQuizSession = () => {
    const newState = !quizControl.isActive;
    storageService.setQuizControlState(newState, currentUser || undefined);
    setQuizControl(storageService.getQuizControlState());
    
    if (newState) {
      setNotificationMsg('Sesi Kuis Berhasil DIBUKA! 🟢 Akses kuis kini aktif untuk semua murid.');
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

  // Confirm Reset Ranking Sesi Kuis (Hanya mereset papan sesi aktif, tanpa mengubah nilai murid di daftar murid, total kuis, atau rapor)
  const handleConfirmResetRanking = () => {
    storageService.resetActiveQuizRanking();
    setShowResetRankingModal(false);
    setNotificationMsg('Papan perankingan sesi kuis berhasil direset! 🏆 Sesi kuis siap dimulai dari awal tanpa merubah nilai di rapor murid.');
    loadData();
    setTimeout(() => setNotificationMsg(null), 4500);
  };

  // Score color formatting based on user requirement:
  // 0 - 50: Hitam (text-black)
  // 51 - 70: Merah (text-red-600)
  // 71 - 100: Hijau (text-emerald-600)
  const renderScoreBadge = (score: number | null | undefined, status: string) => {
    if (status === 'in_progress' || score === null || score === undefined) {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 border border-amber-200 text-amber-800 rounded-lg text-xs font-bold animate-pulse">
          <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
          Sedang Dikerjakan
        </span>
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
      // 0 - 50 Hitam
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
  // Berdasarkan skor tertinggi, jika skor sama diurutkan berdasarkan waktu selesai
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
    <div className="max-w-6xl mx-auto px-4 py-6 sm:py-8">
      {/* Toast Notification */}
      {notificationMsg && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 px-5 py-3 bg-[#881337] text-white font-bold text-xs sm:text-sm rounded-2xl shadow-2xl border border-[#fbcfe8] animate-in fade-in slide-in-from-top-4 duration-300 flex items-center gap-2">
          <span>🌸</span>
          <span>{notificationMsg}</span>
        </div>
      )}

      {/* Top Banner: Master Identity & Sesi Kuis Control */}
      <div className="bg-gradient-to-r from-[#fae8eb] via-[#fffdfa] to-[#fbf0df] border-2 border-[#eedac5] rounded-3xl p-5 sm:p-7 mb-6 shadow-sm">
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

              {/* Tombol Ganti Kata Sandi Master (Bebas 2 sampai 10 Karakter) */}
              <button
                onClick={() => {
                  const masterCred = storageService.getUsers().find(u => storageService.isMaster(u.user));
                  setMasterCurrentPassword(masterCred?.password || MASTER_CONFIG.password);
                  setMasterNewPasswordInput('');
                  setShowMasterPasswordModal(true);
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1 bg-white hover:bg-amber-50 border border-amber-300 hover:border-amber-400 rounded-full text-amber-900 font-extrabold text-xs shadow-2xs transition-all active:scale-95"
                title="Ganti Kata Sandi Akun Master (Bebas 2 sampai 10 Karakter)"
              >
                <KeyRound className="w-3.5 h-3.5 text-amber-700" />
                <span>Ganti Sandi Master (2–10 Karakter)</span>
              </button>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#881337] font-japanese tracking-tight">
              Daftar Nilai & Manajemen Semua Murid
            </h1>
            <p className="text-xs sm:text-sm text-[#735338] mt-1.5 leading-relaxed max-w-2xl">
              Pantau pengerjaan kuis murid secara <strong className="text-[#881337]">live & otomatis</strong>, serta kelola akun murid terdaftar secara terpusat.
            </p>
          </div>

          {/* Sesi Kuis Control Button (Only visible for Master) */}
          <div className="bg-white/95 border border-[#ebdccb] p-3.5 sm:p-4 rounded-2xl shadow-xs flex flex-col sm:flex-row items-center gap-3.5 shrink-0 w-full lg:w-auto">
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <span 
                className={`w-3.5 h-3.5 rounded-full ring-4 transition-all shrink-0 ${
                  quizControl.isActive 
                    ? 'bg-emerald-500 ring-emerald-200 animate-pulse' 
                    : 'bg-rose-500 ring-rose-200'
                }`} 
                aria-hidden="true"
              />
              <div className="text-left">
                <div className="text-xs font-bold text-[#3d2a1b]">
                  Status Sesi Kuis:
                </div>
                <div className={`text-[11px] font-extrabold ${quizControl.isActive ? 'text-emerald-700' : 'text-rose-600'}`}>
                  {quizControl.isActive ? '🟢 DIBUKA (Murid Bisa Akses)' : '🔴 DITUTUP (Terkunci)'}
                </div>
              </div>
            </div>

            <button
              onClick={handleToggleQuizSession}
              className={`w-full sm:w-auto px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all shadow-xs flex items-center justify-center gap-2 text-white active:scale-95 ${
                quizControl.isActive
                  ? 'bg-rose-600 hover:bg-rose-700 ring-2 ring-rose-300'
                  : 'bg-emerald-600 hover:bg-emerald-700 ring-2 ring-emerald-300'
              }`}
            >
              {quizControl.isActive ? (
                <>
                  <Square className="w-4 h-4 fill-white" />
                  <span>Kunci / Tutup Kuis</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-white" />
                  <span>Buka Akses Kuis</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Navigation Sub-Tabs: 1. Nilai Murid (Perankingan Live) | 2. Daftar Murid */}
        <div className="mt-6 flex flex-wrap items-center gap-2 border-t border-[#eedac5] pt-4">
          <button
            onClick={() => setSubTab('live_scores')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              subTab === 'live_scores'
                ? 'bg-[#881337] text-white shadow-md'
                : 'bg-white text-[#735338] border border-[#ebdccb] hover:border-[#881337] hover:text-[#881337]'
            }`}
          >
            <Activity className="w-4 h-4" />
            <span>1. Nilai Murid (Perankingan & Rekaman Kuis Live)</span>
            <span className="px-1.5 py-0.2 bg-white/20 rounded-md text-[10px]">
              {activeRecords.length}
            </span>
          </button>

          <button
            onClick={() => setSubTab('student_list')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              subTab === 'student_list'
                ? 'bg-[#881337] text-white shadow-md'
                : 'bg-white text-[#735338] border border-[#ebdccb] hover:border-[#881337] hover:text-[#881337]'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>2. Daftar Murid (Kelola Akun Murid)</span>
            <span className="px-1.5 py-0.2 bg-white/20 rounded-md text-[10px]">
              {studentsList.length} Murid
            </span>
            {onlineStudentsCount > 0 && (
              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-emerald-500 text-white rounded-md text-[10px] font-black animate-pulse">
                <span className="w-1.5 h-1.5 rounded-full bg-white" />
                <span>{onlineStudentsCount} Online</span>
              </span>
            )}
          </button>

          {/* Quick Action: Reset Ranking Sesi & Reload */}
          <div className="ml-auto flex items-center gap-2">
            <button
              onClick={() => setShowResetRankingModal(true)}
              className="flex items-center gap-1.5 px-3 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold rounded-xl text-xs transition-all shadow-xs active:scale-95"
              title="Reset ranking kuis sesi ini untuk persiapan sesi kuis baru (tanpa menghapus riwayat nilai permanen murid)"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Ranking Sesi</span>
            </button>

            <button
              onClick={loadData}
              title="Muat ulang data live"
              className="p-2.5 bg-white text-[#735338] hover:text-[#881337] border border-[#ebdccb] rounded-xl hover:bg-[#fff7ee] transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* =========================================================================
          SUB-HALAMAN 1: "NILAI MURID" (LIVE ACTIVITY & SCORE MONITORING + PERANKINGAN)
          ========================================================================= */}
      {subTab === 'live_scores' && (
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
            {/* Search Input */}
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-[#a88a70] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari nama murid / email..."
                className="w-full pl-9 pr-3 py-2 bg-white border border-[#dec7b0] focus:border-[#881337] rounded-xl text-xs text-[#3d2a1b] outline-hidden"
              />
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
                    <th className="py-3 px-4 text-center">Nilai Murid</th>
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
                          Saat murid mulai mengerjakan kuis, perankingan dan rekaman live akan otomatis muncul di tabel ini.
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
                        {/* Peringkat / Ranking Sesi Ini */}
                        <td className="py-3 px-3 text-center whitespace-nowrap">
                          {renderRankBadge(rankMap.get(rec.id), rec.status)}
                        </td>

                        {/* Nama Murid */}
                        <td className="py-3 px-4">
                          <div className="font-bold text-[#3d2a1b]">
                            {rec.studentName}
                          </div>
                          <div className="text-[11px] text-[#8c6b4b] flex items-center gap-1 mt-0.5">
                            <span className="font-medium text-[#881337]">Panggilan: {rec.studentNickname}</span>
                            <span>•</span>
                            <span className="text-[#a88a70] truncate max-w-[150px]">
                              {rec.userEmail.toLowerCase() === 'dioalifap24@gmail.com' || rec.userEmail.toLowerCase() === 'master@senseisari.com' ? 'Akun Master' : rec.userEmail}
                            </span>
                          </div>
                        </td>

                        {/* Level Kuis */}
                        <td className="py-3 px-3">
                          <span className="px-2.5 py-1 bg-[#881337] text-white font-bold rounded-lg text-xs">
                            JLPT {rec.level}
                          </span>
                        </td>

                        {/* Tanggal Pengerjaan */}
                        <td className="py-3 px-3 font-medium text-[#5a4332] whitespace-nowrap">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5 text-[#881337]" />
                            <span>{rec.date}</span>
                          </div>
                        </td>

                        {/* Jam Mulai */}
                        <td className="py-3 px-3 font-mono font-semibold text-[#6e533d] whitespace-nowrap">
                          <div className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5 text-[#a88a70]" />
                            <span>{rec.startedAtTime}</span>
                          </div>
                        </td>

                        {/* Jam Selesai: "sedang dikerjakan" vs Jam Live */}
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

                        {/* Nilai Murid: Color Coded (0-50 Hitam, 51-70 Merah, 71-100 Hijau) */}
                        <td className="py-3 px-4 text-center whitespace-nowrap">
                          {renderScoreBadge(rec.score, rec.status)}
                        </td>

                        {/* Aksi */}
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
          SUB-HALAMAN 2: "DAFTAR MURID" (STUDENT ACCOUNT MANAGEMENT & DELETION)
          ========================================================================= */}
      {subTab === 'student_list' && (
        <div className="space-y-4">
          {/* Informasi Jumlah Murid Online & Kehadiran Realtime */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Card Murid Online */}
            <div 
              onClick={() => setFilterPresence(filterPresence === 'online' ? 'all' : 'online')}
              className={`p-4 rounded-2xl border-2 transition-all cursor-pointer shadow-xs flex items-center justify-between ${
                filterPresence === 'online'
                  ? 'bg-emerald-100/80 border-emerald-500 ring-2 ring-emerald-300'
                  : 'bg-gradient-to-br from-emerald-50 via-[#f0fdf4] to-teal-50 border-emerald-300 hover:border-emerald-400'
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
                    Sedang Mengakses Web
                  </span>
                </div>
                <div className="text-2xl font-black text-emerald-950 font-japanese">
                  {onlineStudentsCount} Murid Online
                </div>
                <p className="text-[11px] text-emerald-700 mt-0.5">
                  Aktif membuka materi atau kuis sekarang
                </p>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 border border-emerald-300 flex items-center justify-center text-emerald-700 text-2xl shrink-0 shadow-2xs">
                🟢
              </div>
            </div>

            {/* Card Murid Offline */}
            <div 
              onClick={() => setFilterPresence(filterPresence === 'offline' ? 'all' : 'offline')}
              className={`p-4 rounded-2xl border-2 transition-all cursor-pointer shadow-2xs flex items-center justify-between ${
                filterPresence === 'offline'
                  ? 'bg-stone-100 border-stone-500 ring-2 ring-stone-300'
                  : 'bg-white border-[#ebdccb] hover:border-[#dec7b0]'
              }`}
              title="Klik untuk memfilter murid yang sedang offline"
            >
              <div>
                <div className="flex items-center gap-1.5 mb-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-stone-400"></span>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#735338]">
                    Sedang Tidak Aktif
                  </span>
                </div>
                <div className="text-2xl font-black text-[#3d2a1b] font-japanese">
                  {offlineStudentsCount} Murid Offline
                </div>
                <p className="text-[11px] text-[#8c6b4b] mt-0.5">
                  Belum membuka web saat ini
                </p>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-stone-100 border border-stone-200 flex items-center justify-center text-stone-500 text-2xl shrink-0">
                ⚪
              </div>
            </div>

            {/* Card Total Akun Murid */}
            <div 
              onClick={() => setFilterPresence('all')}
              className={`p-4 rounded-2xl border-2 transition-all cursor-pointer shadow-2xs flex items-center justify-between ${
                filterPresence === 'all'
                  ? 'bg-rose-50/70 border-[#881337]/50'
                  : 'bg-[#fffdfa] border-[#ebdccb] hover:border-[#dec7b0]'
              }`}
              title="Klik untuk melihat semua murid"
            >
              <div>
                <div className="text-[11px] font-bold uppercase tracking-wider text-[#881337] mb-1 flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5" />
                  <span>Total Murid Terdaftar</span>
                </div>
                <div className="text-2xl font-black text-[#881337] font-japanese">
                  {studentsList.length} Murid
                </div>
                <p className="text-[11px] text-[#735338] mt-0.5">
                  Seluruh murid terdaftar kelas Sensei Sari
                </p>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-[#fae8eb] border border-[#fbcfe8] flex items-center justify-center text-[#881337] text-2xl shrink-0">
                👥
              </div>
            </div>
          </div>

          {/* Header Info & Search & Quick Filters */}
          <div className="bg-[#fffdfa] border border-[#ebdccb] p-4 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3 shadow-2xs">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-bold text-[#881337]">Filter Status:</span>
              <div className="flex items-center gap-1 bg-[#f5ede1] p-1 rounded-xl text-xs">
                <button
                  onClick={() => setFilterPresence('all')}
                  className={`px-3 py-1 rounded-lg font-bold transition-all ${
                    filterPresence === 'all'
                      ? 'bg-[#881337] text-white shadow-2xs'
                      : 'text-[#735338] hover:text-[#881337]'
                  }`}
                >
                  Semua ({studentsList.length})
                </button>
                <button
                  onClick={() => setFilterPresence('online')}
                  className={`px-3 py-1 rounded-lg font-bold transition-all flex items-center gap-1.5 ${
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
                  className={`px-3 py-1 rounded-lg font-bold transition-all flex items-center gap-1.5 ${
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
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-[#a88a70] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari murid..."
                className="w-full pl-9 pr-3 py-2 bg-white border border-[#dec7b0] focus:border-[#881337] rounded-xl text-xs text-[#3d2a1b] outline-hidden"
              />
            </div>
          </div>

          {/* Students List Table */}
          <div className="bg-[#fffdfa] border border-[#ebdccb] rounded-2xl overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead>
                  <tr className="bg-[#fbf3e8] text-[#881337] border-b border-[#ebdccb] font-bold">
                    <th className="py-3 px-4">No.</th>
                    <th className="py-3 px-4">Nama Lengkap Murid</th>
                    <th className="py-3 px-3">Nama Panggilan</th>
                    <th className="py-3 px-3 text-center">Status Kehadiran</th>
                    <th className="py-3 px-4">Email & Kata Sandi Murid</th>
                    <th className="py-3 px-3">Tanggal Mendaftar</th>
                    <th className="py-3 px-3 text-center">Total Kuis</th>
                    <th className="py-3 px-4 text-center">Tindakan / Hapus Akun</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f2e6d6]">
                  {filteredStudents.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-8 text-center text-[#8c6b4b]">
                        <div className="text-2xl mb-1">🌸</div>
                        <p className="font-semibold">Tidak ada data murid yang cocok.</p>
                      </td>
                    </tr>
                  ) : (
                    filteredStudents.map((student, idx) => {
                      // Total Kuis & Nilai Murid dihitung dari riwayat permanen allScores (sensei_sari_scores_v1)
                      // Tidak pernah ter-reset saat tombol reset ranking sesi kuis ditekan!
                      const studentScores = allScores.filter(s => s.userEmail.toLowerCase() === student.email.toLowerCase());
                      const totalQuizzes = studentScores.length;
                      const avgScore = totalQuizzes > 0 ? Math.round(studentScores.reduce((acc, s) => acc + s.score, 0) / totalQuizzes) : null;
                      
                      // Cari kredensial / kata sandi murid
                      const cred = studentsCredentials.find(c => c.user.email.toLowerCase() === student.email.toLowerCase());
                      const studentPassword = cred ? cred.password : '••••••••';

                      // Status Kehadiran Murid (Online / Offline)
                      const isOnline = storageService.isStudentOnline(student.email);

                      return (
                        <tr key={student.email} className="hover:bg-[#fcf8f2] transition-colors">
                          <td className="py-3 px-4 font-bold text-[#881337]">
                            {idx + 1}
                          </td>

                          {/* Nama Lengkap Murid dengan Simbol Online */}
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2">
                              {isOnline ? (
                                <span className="relative flex h-2.5 w-2.5 shrink-0" title="Murid sedang online mengakses web">
                                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                                </span>
                              ) : (
                                <span className="w-2.5 h-2.5 rounded-full bg-stone-300 shrink-0" title="Offline"></span>
                              )}
                              <span className="font-bold text-[#3d2a1b]">{student.fullName || student.name || 'Murid'}</span>
                            </div>
                          </td>

                          <td className="py-3 px-3 font-semibold text-[#881337]">
                            {student.nickname || '-'}
                          </td>

                          {/* Kolom Simbol & Badge Status Kehadiran (Online / Offline) */}
                          <td className="py-3 px-3 text-center whitespace-nowrap">
                            {isOnline ? (
                              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-800 border border-emerald-300 rounded-full text-xs font-black shadow-2xs">
                                <span className="relative flex h-2 w-2">
                                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                                </span>
                                <span>Online</span>
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-stone-100 text-stone-500 border border-stone-200 rounded-full text-xs font-semibold">
                                <span className="w-2 h-2 rounded-full bg-stone-400"></span>
                                <span>Offline</span>
                              </span>
                            )}
                          </td>

                          {/* Alamat Email & Kata Sandi Murid */}
                          <td className="py-3 px-4 text-xs">
                            <div className="text-[#3d2a1b] font-mono font-semibold flex items-center gap-1.5">
                              <Mail className="w-3.5 h-3.5 text-[#a88a70] shrink-0" />
                              <span className="truncate max-w-[200px]" title={student.email}>{student.email}</span>
                            </div>

                            {/* Tampilan Kata Sandi Murid & Tombol Lupa Kata Sandi */}
                            <div className="mt-1.5 flex flex-wrap items-center gap-1.5 bg-[#fbf3e8] border border-[#ecdac6] px-2.5 py-1.5 rounded-xl w-fit">
                              <KeyRound className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                              <span className="text-[11px] font-bold text-[#735338]">Sandi:</span>
                              <span className="font-mono font-black text-[#881337] tracking-wider text-xs">
                                {visiblePasswords[student.email] ? studentPassword : '••••••••'}
                              </span>
                              <button
                                onClick={() => togglePasswordVisibility(student.email)}
                                className="p-1 text-[#a88a70] hover:text-[#881337] transition-colors rounded-md hover:bg-white/60"
                                title={visiblePasswords[student.email] ? 'Sembunyikan kata sandi' : 'Lihat kata sandi murid'}
                              >
                                {visiblePasswords[student.email] ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                              </button>
                              <button
                                onClick={() => {
                                  setStudentToResetPassword({ user: student, currentPassword: studentPassword });
                                  setNewPasswordInput('');
                                }}
                                className="ml-1 px-2 py-0.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-extrabold text-[10px] rounded-lg transition-all shadow-2xs active:scale-95 flex items-center gap-1"
                                title="Klik jika murid lupa kata sandi untuk memperbaiki sandinya"
                              >
                                <KeyRound className="w-2.5 h-2.5" />
                                <span>Lupa Kata Sandi</span>
                              </button>
                            </div>
                          </td>

                          <td className="py-3 px-3 text-[#735338] whitespace-nowrap">
                            {student.registeredAt || '2026-09-01'}
                          </td>
                          <td className="py-3 px-3 text-center">
                            <span className="px-2.5 py-1 bg-[#fae8eb] text-[#881337] border border-[#fbcfe8] rounded-lg text-xs font-black">
                              {totalQuizzes} kali
                            </span>
                            {avgScore !== null && (
                              <div className="text-[10px] text-[#735338] font-normal mt-0.5">
                                Rata-rata: <strong className="text-[#881337] font-bold">{avgScore}</strong>
                              </div>
                            )}
                          </td>
                          <td className="py-3 px-4 text-center">
                            <button
                              onClick={() => setStudentToDelete(student)}
                              className="px-3 py-1.5 bg-red-50 hover:bg-red-600 text-red-600 hover:text-white border border-red-200 font-bold rounded-xl text-xs transition-all flex items-center gap-1.5 mx-auto active:scale-95 shadow-2xs"
                              title="Hapus akun murid ini dan seluruh riwayat nilainya"
                            >
                              <UserX className="w-3.5 h-3.5" />
                              <span>Hapus Akun Murid</span>
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
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
                  placeholder="Minimal 8 karakter (contoh: murid2026)"
                  value={newPasswordInput}
                  onChange={(e) => setNewPasswordInput(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white border border-[#ddcaa8] focus:border-[#881337] rounded-xl text-sm font-mono text-[#2b1d19] outline-hidden"
                  autoFocus
                />
              </div>
              <span className="text-[10px] text-[#735338] mt-1 block">
                Wajib minimal 8 karakter untuk akun murid. Murid dapat langsung masuk dengan kata sandi baru ini.
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
          MODAL GANTI KATA SANDI AKUN MASTER (BEBAS 2 SAMPAI 10 KARAKTER)
          ========================================================================= */}
      {showMasterPasswordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-[#fffdfa] border-2 border-amber-400 rounded-3xl p-6 sm:p-7 shadow-2xl">
            <div className="flex items-center gap-3.5 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 border border-amber-300 flex items-center justify-center text-amber-700 text-xl shrink-0 shadow-2xs">
                <KeyRound className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-[#881337] font-japanese">
                  Ganti Kata Sandi Akun Master
                </h3>
                <p className="text-xs text-[#735338]">
                  Khusus Akun Master: Bebas menggunakan 2 hingga 10 karakter
                </p>
              </div>
            </div>

            <div className="p-3.5 bg-amber-50/80 border border-amber-200/90 rounded-2xl text-xs space-y-1.5 mb-4">
              <div><strong>Akun Master:</strong> {currentUser?.fullName || 'GLOSTER GLADIATOR'} ({currentUser?.nickname || 'skywalker'})</div>
              <div><strong>Email Master:</strong> <span className="font-mono text-[#553b26]">{MASTER_CONFIG.email}</span></div>
              <div className="flex items-center gap-1.5 pt-0.5">
                <strong>Kata Sandi Saat Ini:</strong> 
                <span className="font-mono font-bold text-[#881337] bg-white px-2 py-0.5 rounded-md border border-amber-300">
                  {masterCurrentPassword || MASTER_CONFIG.password}
                </span>
              </div>
            </div>

            <div className="mb-5">
              <label className="block text-xs font-bold text-[#5a4230] mb-1.5">
                Masukkan Kata Sandi Baru Master (2 – 10 Karakter) <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="2 sampai 10 karakter (bebas)"
                  value={masterNewPasswordInput}
                  onChange={(e) => setMasterNewPasswordInput(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white border border-[#ddcaa8] focus:border-[#881337] rounded-xl text-sm font-mono text-[#2b1d19] outline-hidden"
                  autoFocus
                />
              </div>
              <span className="text-[10px] text-[#735338] mt-1 block">
                Bebas menggunakan berapapun karakter antara minimal 2 sampai maksimal 10 karakter.
              </span>
            </div>

            <div className="flex items-center gap-2.5">
              <button
                onClick={() => setShowMasterPasswordModal(false)}
                className="flex-1 py-2.5 px-4 bg-stone-100 hover:bg-stone-200 text-[#553b26] font-bold text-xs rounded-xl transition-colors"
              >
                Batal
              </button>
              <button
                onClick={handleSaveMasterPassword}
                className="flex-1 py-2.5 px-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold text-xs rounded-xl shadow-md transition-all active:scale-95 flex items-center justify-center gap-1.5"
              >
                <CheckCircle className="w-3.5 h-3.5" />
                <span>Simpan Sandi Master</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
