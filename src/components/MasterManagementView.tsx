import React, { useState, useEffect } from 'react';
import { User, ActiveQuizRecord, QuizControlState } from '../types';
import { storageService } from '../services/storageService';
import { Users, Award, Trash2, RefreshCw, Play, Square, AlertTriangle, CheckCircle, Search, Filter, Shield, UserX, Clock, Calendar, ChevronRight, Activity } from 'lucide-react';
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
  const [quizControl, setQuizControl] = useState<QuizControlState>({ isActive: false });
  
  // Search & Filter
  const [searchQuery, setSearchQuery] = useState('');
  const [filterLevel, setFilterLevel] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'in_progress' | 'completed'>('all');
  
  // Student Deletion Modal
  const [studentToDelete, setStudentToDelete] = useState<User | null>(null);
  const [recordToDelete, setRecordToDelete] = useState<ActiveQuizRecord | null>(null);
  const [notificationMsg, setNotificationMsg] = useState<string | null>(null);

  // Load all data
  const loadData = () => {
    setActiveRecords(storageService.getActiveQuizRecords());
    setStudentsList(storageService.getAllStudents());
    setQuizControl(storageService.getQuizControlState());
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

    window.addEventListener('active_quiz_updated', handleActiveQuizUpdate);
    window.addEventListener('student_data_updated', handleStudentDataUpdate);
    window.addEventListener('quiz_control_changed', handleQuizControlChange);
    window.addEventListener('storage', loadData);

    return () => {
      clearInterval(intervalId);
      window.removeEventListener('active_quiz_updated', handleActiveQuizUpdate);
      window.removeEventListener('student_data_updated', handleStudentDataUpdate);
      window.removeEventListener('quiz_control_changed', handleQuizControlChange);
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

  // Filtered students
  const filteredStudents = studentsList.filter(stu => {
    const q = searchQuery.toLowerCase().trim();
    return !q || 
      (stu.fullName && stu.fullName.toLowerCase().includes(q)) || 
      (stu.nickname && stu.nickname.toLowerCase().includes(q)) || 
      stu.email.toLowerCase().includes(q);
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

        {/* Navigation Sub-Tabs: 1. Nilai Murid (Live) | 2. Daftar Murid */}
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
            <span>1. Nilai Murid (Rekaman & Nilai Kuis Live)</span>
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
          </button>

          <button
            onClick={loadData}
            title="Muat ulang data live"
            className="ml-auto p-2.5 bg-white text-[#735338] hover:text-[#881337] border border-[#ebdccb] rounded-xl hover:bg-[#fff7ee] transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* =========================================================================
          SUB-HALAMAN 1: "NILAI MURID" (LIVE ACTIVITY & SCORE MONITORING)
          ========================================================================= */}
      {subTab === 'live_scores' && (
        <div className="space-y-4">
          {/* Filter Bar */}
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

            {/* Filters */}
            <div className="flex items-center gap-2 w-full sm:w-auto">
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
            </div>
          </div>

          {/* Live Activity Table */}
          <div className="bg-[#fffdfa] border border-[#ebdccb] rounded-2xl overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead>
                  <tr className="bg-[#fbf3e8] text-[#881337] border-b border-[#ebdccb] font-bold">
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
                      <td colSpan={7} className="py-8 text-center text-[#8c6b4b]">
                        <div className="text-2xl mb-1">🌸</div>
                        <p className="font-semibold">Belum ada rekaman aktivitas kuis murid.</p>
                        <p className="text-xs text-[#a88a70] mt-0.5">
                          Saat murid mulai mengerjakan kuis, rekaman akan otomatis muncul secara live di tabel ini.
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
          {/* Header Info & Search */}
          <div className="bg-[#fffdfa] border border-[#ebdccb] p-4 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3 shadow-2xs">
            <div>
              <div className="text-base font-bold text-[#881337]">
                Daftar Akun Semua Murid Terdaftar ({studentsList.length} Murid)
              </div>
              <p className="text-xs text-[#735338]">
                Kelola akun murid atau hapus akun murid yang telah menyelesaikan program kelas Sensei Sari.
              </p>
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
                    <th className="py-3 px-4">Alamat Email</th>
                    <th className="py-3 px-3">Tanggal Mendaftar</th>
                    <th className="py-3 px-3 text-center">Total Kuis</th>
                    <th className="py-3 px-4 text-center">Tindakan / Hapus Akun</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f2e6d6]">
                  {filteredStudents.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-[#8c6b4b]">
                        <div className="text-2xl mb-1">🌸</div>
                        <p className="font-semibold">Tidak ada data murid yang cocok.</p>
                      </td>
                    </tr>
                  ) : (
                    filteredStudents.map((student, idx) => {
                      const studentQuizzes = activeRecords.filter(r => r.userEmail.toLowerCase() === student.email.toLowerCase() && r.status === 'completed');
                      return (
                        <tr key={student.email} className="hover:bg-[#fcf8f2] transition-colors">
                          <td className="py-3 px-4 font-bold text-[#881337]">
                            {idx + 1}
                          </td>
                          <td className="py-3 px-4 font-bold text-[#3d2a1b]">
                            {student.fullName || student.name || 'Murid'}
                          </td>
                          <td className="py-3 px-3 font-semibold text-[#881337]">
                            {student.nickname || '-'}
                          </td>
                          <td className="py-3 px-4 text-[#6e533d] font-mono text-xs">
                            {student.email}
                          </td>
                          <td className="py-3 px-3 text-[#735338] whitespace-nowrap">
                            {student.registeredAt || '2026-09-01'}
                          </td>
                          <td className="py-3 px-3 text-center font-bold text-[#881337]">
                            {studentQuizzes.length} kali
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
    </div>
  );
};
