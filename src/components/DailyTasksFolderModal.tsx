import React, { useState, useEffect } from 'react';
import {
  DailyTask,
  DailyTaskCategory,
  JLPTLevel,
  User,
} from '../types';
import { storageService } from '../services/storageService';
import {
  FolderOpen,
  Plus,
  CheckCircle2,
  Clock,
  RefreshCw,
  Trash2,
  Edit3,
  BookOpen,
  Layers,
  FileQuestion,
  Sparkles,
  CheckSquare,
  Users,
  X,
  Calendar,
  AlertCircle,
  Send,
  ChevronRight,
  Archive,
} from 'lucide-react';

interface DailyTasksFolderModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser?: User | null;
  activeLevel: JLPTLevel;
  onNavigateToFeature: (tab: string, targetLevel?: JLPTLevel) => void;
}

export const DailyTasksFolderModal: React.FC<DailyTasksFolderModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  activeLevel,
  onNavigateToFeature,
}) => {
  const isMasterUser = storageService.isMaster(currentUser);

  const [tasks, setTasks] = useState<DailyTask[]>(() => storageService.getDailyTasks());
  const [allStudents, setAllStudents] = useState<User[]>(() => storageService.getAllStudents());
  const [filterLevel, setFilterLevel] = useState<JLPTLevel | 'ALL'>('ALL');
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'completed'>('all');
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncFeedback, setSyncFeedback] = useState<string | null>(null);

  // Master Form State
  const [showMasterForm, setShowMasterForm] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [taskLevel, setTaskLevel] = useState<JLPTLevel | 'ALL'>('ALL');
  const [category, setCategory] = useState<DailyTaskCategory>('vocab');
  const [dueDate, setDueDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [dueTime, setDueTime] = useState('21:00');
  const [formError, setFormError] = useState<string | null>(null);

  // Student Completion Note State per Task
  const [studentNotes, setStudentNotes] = useState<Record<string, string>>({});
  const [expandedTaskStudents, setExpandedTaskStudents] = useState<Record<string, boolean>>({});

  const refreshFolderData = () => {
    setTasks(storageService.getDailyTasks());
    setAllStudents(storageService.getAllStudents());
  };

  useEffect(() => {
    if (!isOpen) return;
    refreshFolderData();
    storageService.syncWithServer().then(refreshFolderData);

    // Report student activity to Master monitor when opening Daily Tasks Folder
    if (currentUser && !isMasterUser) {
      storageService.heartbeatPresence(currentUser, {
        currentTab: 'home',
        currentActivity: `📁 Membuka Folder Tugas Harian Sensei`,
        activeLevel,
      });
    }

    const interval = window.setInterval(() => {
      storageService.syncWithServer().then(refreshFolderData);
    }, 2000);

    window.addEventListener('daily_tasks_updated', refreshFolderData);
    window.addEventListener('student_data_updated', refreshFolderData);
    window.addEventListener('storage', refreshFolderData);

    return () => {
      clearInterval(interval);
      window.removeEventListener('daily_tasks_updated', refreshFolderData);
      window.removeEventListener('student_data_updated', refreshFolderData);
      window.removeEventListener('storage', refreshFolderData);
    };
  }, [isOpen, currentUser, isMasterUser, activeLevel]);

  if (!isOpen) return null;

  const handleManualSync = async () => {
    setIsSyncing(true);
    setSyncFeedback(null);
    await storageService.syncWithServer();
    refreshFolderData();
    setIsSyncing(false);
    const activeCount = storageService.getActiveDailyTasks().length;
    setSyncFeedback(
      activeCount > 0
        ? `✅ Berhasil diperbarui! Saat ini ada ${activeCount} tugas harian aktif dari Master Sensei.`
        : '🌸 Berhasil diperbarui! Saat ini belum ada tugas harian baru dari Master Sensei.'
    );
    setTimeout(() => setSyncFeedback(null), 4000);
  };

  const resetMasterForm = () => {
    setEditingTaskId(null);
    setTitle('');
    setDescription('');
    setTaskLevel('ALL');
    setCategory('vocab');
    setDueDate(new Date().toISOString().split('T')[0]);
    setDueTime('21:00');
    setFormError(null);
  };

  const handleOpenEdit = (task: DailyTask) => {
    setEditingTaskId(task.id);
    setTitle(task.title);
    setDescription(task.description);
    setTaskLevel(task.level);
    setCategory(task.category);
    setDueDate(task.dueDate || new Date().toISOString().split('T')[0]);
    setDueTime(task.dueTime || '21:00');
    setFormError(null);
    setShowMasterForm(true);
  };

  const handleApplyQuickTemplate = (tpl: 'vocab' | 'kanji' | 'materi' | 'kuis') => {
    const targetLvl = taskLevel === 'ALL' ? activeLevel : taskLevel;
    if (tpl === 'vocab') {
      setCategory('vocab');
      setTitle(`Hafalan 25 Kosakata Harian JLPT ${targetLvl}`);
      setDescription(
        `Silakan buka menu Kartu Hafalan Kosakata level ${targetLvl}, pelajari dan hafalkan minimal 25 kosakata beserta cara baca Hiragana dan artinya. Setelah selesai, tandai tugas ini selesai dan tulis kosakata favoritmu di kolom catatan!`
      );
    } else if (tpl === 'kanji') {
      setCategory('kanji');
      setTitle(`Hafalan 10 Huruf Kanji Resmi JLPT ${targetLvl}`);
      setDescription(
        `Buka menu Kartu Hafalan Kanji level ${targetLvl}, hafalkan 10 huruf Kanji baru beserta bacaan Onyomi, Kunyomi, dan contoh katanya. Tandai selesai jika sudah menguasainya.`
      );
    } else if (tpl === 'materi') {
      setCategory('materi');
      setTitle(`Pelajari Materi Tata Bahasa (Bunpou) JLPT ${targetLvl}`);
      setDescription(
        `Buka menu Materi level ${targetLvl}, baca dan catat rumus pola kalimat tata bahasa hari ini beserta contoh kalimatnya. Tuliskan 1 contoh kalimat buatanmu di kolom catatan penyelesaian tugas!`
      );
    } else if (tpl === 'kuis') {
      setCategory('kuis');
      setTitle(`Latihan Evaluasi Kuis Simulasi JLPT ${targetLvl}`);
      setDescription(
        `Persiapkan diri dan kerjakan latihan soal kuis simulasi JLPT ${targetLvl}. Pastikan mencapai nilai terbaik dan catat hasil skormu pada laporan tugas harian ini.`
      );
    }
  };

  const handleSaveTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setFormError('Judul tugas harian wajib diisi.');
      return;
    }
    if (!description.trim()) {
      setFormError('Instruksi atau deskripsi tugas harian wajib diisi.');
      return;
    }

    if (editingTaskId) {
      storageService.updateDailyTask(editingTaskId, {
        title: title.trim(),
        description: description.trim(),
        level: taskLevel,
        category,
        dueDate,
        dueTime,
      });
    } else {
      storageService.createDailyTask(
        {
          title: title.trim(),
          description: description.trim(),
          level: taskLevel,
          category,
          dueDate,
          dueTime,
        },
        currentUser
      );
    }

    refreshFolderData();
    resetMasterForm();
    setShowMasterForm(false);
  };

  const handleToggleTaskActive = (task: DailyTask) => {
    storageService.updateDailyTask(task.id, { isActive: !task.isActive });
    refreshFolderData();
  };

  const handleDeleteTask = (taskId: string) => {
    storageService.deleteDailyTask(taskId);
    refreshFolderData();
  };

  const handleStudentToggleComplete = (task: DailyTask, forceNoteUpdate = false) => {
    if (!currentUser) return;
    const noteVal = studentNotes[task.id];
    storageService.toggleDailyTaskCompletion(
      task.id,
      currentUser,
      forceNoteUpdate ? (noteVal ?? '') : noteVal
    );
    refreshFolderData();
  };

  const getCategoryMeta = (cat: DailyTaskCategory) => {
    switch (cat) {
      case 'materi':
        return {
          label: '📖 Materi & Tata Bahasa',
          actionLabel: 'Buka Materi',
          tab: 'materi',
          color: 'bg-rose-50 text-[#881337] border-rose-200',
        };
      case 'vocab':
        return {
          label: '🃏 Hafalan Kosakata',
          actionLabel: 'Buka Kartu Kosakata',
          tab: 'vocab',
          color: 'bg-amber-50 text-amber-900 border-amber-200',
        };
      case 'kanji':
        return {
          label: '漢字 Hafalan Kanji',
          actionLabel: 'Buka Kartu Kanji',
          tab: 'kanji',
          color: 'bg-orange-50 text-orange-900 border-orange-200',
        };
      case 'kuis':
        return {
          label: '📝 Latihan Kuis',
          actionLabel: 'Buka Menu Kuis',
          tab: 'kuis',
          color: 'bg-emerald-50 text-emerald-900 border-emerald-200',
        };
      default:
        return {
          label: '📌 Tugas Umum Sensei',
          actionLabel: null,
          tab: null,
          color: 'bg-stone-100 text-stone-800 border-stone-300',
        };
    }
  };

  const activeTasks = tasks.filter(t => t.isActive);
  const myEmail = (currentUser?.email || '').toLowerCase();

  const isCompletedByMe = (task: DailyTask): boolean => {
    if (!myEmail) return false;
    return (task.completions || []).some(c => c.studentEmail.toLowerCase() === myEmail);
  };

  const getMyCompletion = (task: DailyTask) => {
    if (!myEmail) return null;
    return (task.completions || []).find(c => c.studentEmail.toLowerCase() === myEmail) || null;
  };

  // Tasks visible in list (Master sees all tasks including archived; students see active tasks + any tasks they completed)
  const visibleTasks = tasks.filter(task => {
    if (!isMasterUser && !task.isActive && !isCompletedByMe(task)) {
      return false;
    }
    if (filterLevel !== 'ALL' && task.level !== 'ALL' && task.level !== filterLevel) {
      return false;
    }
    if (!isMasterUser) {
      const done = isCompletedByMe(task);
      if (filterStatus === 'pending' && done) return false;
      if (filterStatus === 'completed' && !done) return false;
    }
    return true;
  });

  const myPendingActiveTasksCount = activeTasks.filter(t => !isCompletedByMe(t)).length;
  const myCompletedActiveTasksCount = activeTasks.filter(t => isCompletedByMe(t)).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-[#fffdfa] border-2 border-[#d9c3b0] rounded-3xl shadow-2xl w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden">
        {/* Top Folder Tab Header */}
        <div className="bg-gradient-to-r from-[#881337] via-[#9f1239] to-[#701a32] text-white px-5 py-4 sm:px-6 sm:py-5 flex items-center justify-between border-b border-[#fbcfe8]/30">
          <div className="flex items-center gap-3.5">
            <div className="p-2.5 bg-amber-400/20 border border-amber-300/40 rounded-2xl text-amber-300 shadow-inner">
              <FolderOpen className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-lg sm:text-xl font-extrabold tracking-tight font-japanese">
                  📁 FOLDER TUGAS HARIAN SENSEI
                </h2>
                <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-white/15 text-amber-200 border border-white/20">
                  Buka Setiap Saat (24 Jam)
                </span>
              </div>
              <p className="text-xs text-rose-100/90 mt-0.5">
                {isMasterUser
                  ? 'Panel Master: Kelola tugas harian untuk murid & pantau siapa saja yang sudah menyelesaikan tugas.'
                  : 'Pantau apakah ada tugas harian dari Master Sensei dan tandai tugas yang sudah kamu kerjakan.'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
            title="Tutup Folder"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Live Status Banner Inside Folder */}
        <div className="px-5 py-3.5 bg-[#f7efe3] border-b border-[#e5d3c0] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span
              className={`w-3.5 h-3.5 rounded-full shrink-0 ring-4 ${
                activeTasks.length > 0
                  ? 'bg-emerald-500 ring-emerald-200 animate-pulse'
                  : 'bg-stone-400 ring-stone-200'
              }`}
            />
            <div>
              <div className="text-xs sm:text-sm font-extrabold text-[#463325]">
                {activeTasks.length > 0 ? (
                  <span className="text-emerald-800">
                    🟢 ADA {activeTasks.length} TUGAS HARIAN AKTIF DARI MASTER SENSEI
                  </span>
                ) : (
                  <span className="text-[#735338]">
                    ⚪ BELUM ADA TUGAS HARIAN DARI MASTER SAAT INI
                  </span>
                )}
              </div>
              <div className="text-[11px] text-[#6e533d]">
                {isMasterUser ? (
                  <span>
                    Total {tasks.length} tugas di dalam folder ({activeTasks.length} aktif · {allStudents.length} murid terdaftar)
                  </span>
                ) : activeTasks.length > 0 ? (
                  <span>
                    Progres kamu: <strong className="text-emerald-700">{myCompletedActiveTasksCount} selesai</strong> ·{' '}
                    <strong className={myPendingActiveTasksCount > 0 ? 'text-rose-700' : 'text-emerald-700'}>
                      {myPendingActiveTasksCount} belum dikerjakan
                    </strong>
                  </span>
                ) : (
                  <span>
                    Kamu bisa membuka folder ini kapan saja untuk memantau tugas baru dari Master Sensei.
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            <button
              onClick={handleManualSync}
              disabled={isSyncing}
              className="px-3 py-1.5 rounded-xl bg-white hover:bg-[#fff9f3] text-[#881337] border border-[#dec7b0] text-xs font-bold flex items-center gap-1.5 shadow-2xs transition-all cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
              <span>{isSyncing ? 'Memeriksa...' : 'Cek Tugas Baru'}</span>
            </button>

            {isMasterUser && (
              <button
                onClick={() => {
                  if (showMasterForm) {
                    setShowMasterForm(false);
                    resetMasterForm();
                  } else {
                    resetMasterForm();
                    setShowMasterForm(true);
                  }
                }}
                className="px-3.5 py-1.5 rounded-xl bg-[#881337] hover:bg-[#9f1239] text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>{showMasterForm ? 'Tutup Form' : 'Buat Tugas Harian'}</span>
              </button>
            )}
          </div>
        </div>

        {/* Manual Sync Feedback Toast inside Folder */}
        {syncFeedback && (
          <div className="px-5 py-2.5 bg-emerald-50 border-b border-emerald-200 text-emerald-900 text-xs font-semibold flex items-center justify-between">
            <span>{syncFeedback}</span>
            <button onClick={() => setSyncFeedback(null)} className="text-emerald-700 hover:underline text-[11px]">
              Tutup
            </button>
          </div>
        )}

        {/* Scrollable Folder Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
          {/* MASTER CREATE / EDIT TASK FORM */}
          {isMasterUser && showMasterForm && (
            <form
              onSubmit={handleSaveTask}
              className="bg-[#fdf8f0] border-2 border-amber-300 rounded-2xl p-4 sm:p-5 shadow-sm space-y-4"
            >
              <div className="flex items-center justify-between border-b border-amber-200 pb-3">
                <div>
                  <h3 className="text-sm sm:text-base font-extrabold text-[#881337] flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-600" />
                    <span>
                      {editingTaskId ? '✏️ Edit Tugas Harian Sensei' : '➕ Tambah Tugas Harian Baru untuk Murid'}
                    </span>
                  </h3>
                  <p className="text-xs text-[#6e533d] mt-0.5">
                    Tugas yang disimpan akan langsung tampil secara real-time di Folder Tugas Harian seluruh akun murid.
                  </p>
                </div>
              </div>

              {/* Quick Templates for Master */}
              <div>
                <div className="text-[11px] font-bold text-[#735338] mb-1.5">
                  ⚡ Isi Cepat dengan Template Tugas Sensei:
                </div>
                <div className="flex flex-wrap gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleApplyQuickTemplate('vocab')}
                    className="px-2.5 py-1 rounded-lg bg-white hover:bg-amber-50 border border-[#dec7b0] text-[11px] font-semibold text-[#553b26] transition-colors cursor-pointer"
                  >
                    🃏 Template Hafalan 25 Kosakata
                  </button>
                  <button
                    type="button"
                    onClick={() => handleApplyQuickTemplate('kanji')}
                    className="px-2.5 py-1 rounded-lg bg-white hover:bg-amber-50 border border-[#dec7b0] text-[11px] font-semibold text-[#553b26] transition-colors cursor-pointer"
                  >
                    漢字 Template Hafalan 10 Kanji
                  </button>
                  <button
                    type="button"
                    onClick={() => handleApplyQuickTemplate('materi')}
                    className="px-2.5 py-1 rounded-lg bg-white hover:bg-amber-50 border border-[#dec7b0] text-[11px] font-semibold text-[#553b26] transition-colors cursor-pointer"
                  >
                    📖 Template Catatan Tata Bahasa
                  </button>
                  <button
                    type="button"
                    onClick={() => handleApplyQuickTemplate('kuis')}
                    className="px-2.5 py-1 rounded-lg bg-white hover:bg-amber-50 border border-[#dec7b0] text-[11px] font-semibold text-[#553b26] transition-colors cursor-pointer"
                  >
                    📝 Template Latihan Kuis Simulasi
                  </button>
                </div>
              </div>

              {formError && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-[#463325] mb-1">
                    Judul Tugas Harian *
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    placeholder="Contoh: Hafalkan 25 Kosakata Bab 1 & Catat 10 Kanji N5"
                    className="w-full px-3.5 py-2 rounded-xl border border-[#d6c0aa] bg-white text-sm text-[#2b1d19] focus:outline-none focus:border-[#881337]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#463325] mb-1">
                    Target Tingkatan JLPT
                  </label>
                  <select
                    value={taskLevel}
                    onChange={e => setTaskLevel(e.target.value as JLPTLevel | 'ALL')}
                    className="w-full px-3 py-2 rounded-xl border border-[#d6c0aa] bg-white text-sm font-semibold text-[#2b1d19] focus:outline-none focus:border-[#881337]"
                  >
                    <option value="ALL">Semua Level (N5 - N2)</option>
                    <option value="N5">Khusus JLPT N5</option>
                    <option value="N4">Khusus JLPT N4</option>
                    <option value="N3">Khusus JLPT N3</option>
                    <option value="N2">Khusus JLPT N2</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#463325] mb-1">
                    Kategori Materi Tugas
                  </label>
                  <select
                    value={category}
                    onChange={e => setCategory(e.target.value as DailyTaskCategory)}
                    className="w-full px-3 py-2 rounded-xl border border-[#d6c0aa] bg-white text-sm font-semibold text-[#2b1d19] focus:outline-none focus:border-[#881337]"
                  >
                    <option value="vocab">🃏 Kartu Hafalan Kosakata</option>
                    <option value="kanji">漢字 Kartu Hafalan Kanji</option>
                    <option value="materi">📖 Materi & Tata Bahasa</option>
                    <option value="kuis">📝 Evaluasi Kuis</option>
                    <option value="umum">📌 Tugas Catatan / Umum</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#463325] mb-1">
                    Tanggal Tugas / Tenggat
                  </label>
                  <input
                    type="date"
                    value={dueDate}
                    onChange={e => setDueDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#d6c0aa] bg-white text-sm text-[#2b1d19] focus:outline-none focus:border-[#881337]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#463325] mb-1">
                    Batas Jam Pengumpulan
                  </label>
                  <input
                    type="time"
                    value={dueTime}
                    onChange={e => setDueTime(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#d6c0aa] bg-white text-sm text-[#2b1d19] focus:outline-none focus:border-[#881337]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#463325] mb-1">
                  Instruksi / Detail Tugas dari Master Sensei *
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="Tuliskan rincian tugas harian yang harus dikerjakan oleh murid hari ini..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#d6c0aa] bg-white text-sm text-[#2b1d19] focus:outline-none focus:border-[#881337]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowMasterForm(false);
                    resetMasterForm();
                  }}
                  className="px-4 py-2 rounded-xl border border-[#d6c0aa] bg-white text-xs font-bold text-[#5e4735] hover:bg-stone-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#881337] hover:bg-[#9f1239] text-white text-xs font-bold flex items-center gap-1.5 shadow-sm cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{editingTaskId ? 'Simpan Perubahan Tugas' : 'Terbitkan Tugas Harian ke Murid'}</span>
                </button>
              </div>
            </form>
          )}

          {/* Filter Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-[#ebdccb]">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-xs font-bold text-[#735338] mr-1">Filter Level:</span>
              {(['ALL', 'N5', 'N4', 'N3', 'N2'] as const).map(lvl => (
                <button
                  key={lvl}
                  onClick={() => setFilterLevel(lvl)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                    filterLevel === lvl
                      ? 'bg-[#881337] text-white'
                      : 'bg-[#f5ede1] text-[#5e4735] hover:bg-[#eadbc8]'
                  }`}
                >
                  {lvl === 'ALL' ? 'Semua Level' : lvl}
                </button>
              ))}
            </div>

            {!isMasterUser && (
              <div className="flex items-center gap-1 bg-[#f5ede1] p-1 rounded-xl">
                <button
                  onClick={() => setFilterStatus('all')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                    filterStatus === 'all' ? 'bg-white text-[#881337] shadow-2xs' : 'text-[#6e533d]'
                  }`}
                >
                  Semua ({activeTasks.length})
                </button>
                <button
                  onClick={() => setFilterStatus('pending')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                    filterStatus === 'pending' ? 'bg-white text-[#881337] shadow-2xs' : 'text-[#6e533d]'
                  }`}
                >
                  Belum Selesai ({myPendingActiveTasksCount})
                </button>
                <button
                  onClick={() => setFilterStatus('completed')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                    filterStatus === 'completed' ? 'bg-white text-[#881337] shadow-2xs' : 'text-[#6e533d]'
                  }`}
                >
                  Sudah Selesai ({myCompletedActiveTasksCount})
                </button>
              </div>
            )}
          </div>

          {/* Tasks List or Empty State */}
          {visibleTasks.length === 0 ? (
            <div className="text-center py-12 px-4 bg-[#fdfaf5] border border-dashed border-[#dec7b0] rounded-2xl">
              <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-[#fae8eb] text-[#881337] flex items-center justify-center">
                <FolderOpen className="w-7 h-7" />
              </div>
              <h3 className="text-base sm:text-lg font-extrabold text-[#881337] font-japanese">
                {activeTasks.length === 0
                  ? 'Belum Ada Tugas Harian dari Master Sensei'
                  : 'Tidak Ada Tugas pada Filter Ini'}
              </h3>
              <p className="text-xs sm:text-sm text-[#6e533d] max-w-md mx-auto mt-1.5 leading-relaxed">
                {isMasterUser
                  ? 'Folder Tugas Harian masih kosong. Klik tombol "Buat Tugas Harian" di atas untuk memberikan tugas baru yang langsung dapat dipantau oleh seluruh murid.'
                  : activeTasks.length === 0
                  ? 'Saat ini Master Sensei belum menambahkan tugas harian baru. Kamu tetap bisa berlatih mandiri di menu Materi, Kosakata, atau Kanji, dan membuka folder ini setiap saat!'
                  : 'Coba ubah filter level atau status di atas untuk melihat daftar tugas harian lainnya.'}
              </p>
              {isMasterUser && !showMasterForm && (
                <button
                  onClick={() => {
                    resetMasterForm();
                    setShowMasterForm(true);
                  }}
                  className="mt-4 px-4 py-2 rounded-xl bg-[#881337] hover:bg-[#9f1239] text-white text-xs font-bold inline-flex items-center gap-1.5 shadow-xs cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Buat Tugas Harian Pertama</span>
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {visibleTasks.map(task => {
                const catMeta = getCategoryMeta(task.category);
                const myComp = getMyCompletion(task);
                const completedCount = (task.completions || []).length;
                const isExpandedStudents = !!expandedTaskStudents[task.id];

                return (
                  <div
                    key={task.id}
                    className={`rounded-2xl border p-4 sm:p-5 transition-all ${
                      !task.isActive
                        ? 'bg-stone-100/80 border-stone-300 opacity-80'
                        : myComp
                        ? 'bg-emerald-50/40 border-emerald-300 shadow-xs'
                        : 'bg-white border-[#e5d3c0] shadow-xs hover:border-[#881337]/50'
                    }`}
                  >
                    {/* Top Metadata Row */}
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-2.5">
                      <div className="flex flex-wrap items-center gap-2 text-xs">
                        <span className={`px-2.5 py-0.5 rounded-lg font-bold border ${catMeta.color}`}>
                          {catMeta.label}
                        </span>
                        <span className="px-2.5 py-0.5 rounded-lg font-extrabold bg-[#881337] text-white">
                          {task.level === 'ALL' ? 'Semua Level (N5-N2)' : `JLPT ${task.level}`}
                        </span>
                        {!task.isActive && (
                          <span className="px-2 py-0.5 rounded-lg font-bold bg-stone-300 text-stone-800">
                            Diarsipkan / Ditutup
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2 text-[11px] text-[#735338]">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-[#881337]" />
                          <span>Tenggat: {task.dueDate}</span>
                          {task.dueTime && <span>· {task.dueTime} WIB</span>}
                        </span>
                      </div>
                    </div>

                    {/* Task Title & Description */}
                    <div className="mb-3">
                      <h4 className="text-base sm:text-lg font-extrabold text-[#2b1d19] flex items-center gap-2">
                        <span>{task.title}</span>
                        {myComp && !isMasterUser && (
                          <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Sudah Dikerjakan</span>
                          </span>
                        )}
                      </h4>
                      <p className="text-xs sm:text-sm text-[#463325] mt-1.5 whitespace-pre-line leading-relaxed bg-[#fdfaf5] p-3 rounded-xl border border-[#f0e4d4]">
                        {task.description}
                      </p>
                      <div className="mt-2 flex flex-wrap items-center justify-between gap-2 text-[11px] text-[#755943]">
                        <span>
                          Diterbitkan oleh <strong className="text-[#881337]">{task.createdBy}</strong> pada {task.createdAt}
                        </span>
                        <span>
                          ✅ Diselesaikan oleh <strong>{completedCount}</strong> murid
                        </span>
                      </div>
                    </div>

                    {/* Action Row for Students */}
                    {!isMasterUser && (
                      <div className="pt-3 border-t border-[#ebdccb] space-y-3">
                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                          <input
                            type="text"
                            value={
                              studentNotes[task.id] !== undefined
                                ? studentNotes[task.id]
                                : myComp?.note || ''
                            }
                            onChange={e =>
                              setStudentNotes(prev => ({
                                ...prev,
                                [task.id]: e.target.value,
                              }))
                            }
                            placeholder="Tulis catatan laporan untuk Master Sensei (opsional, misal: Sudah hafal 25 kata Sensei!)"
                            className="flex-1 px-3 py-2 rounded-xl border border-[#d6c0aa] bg-white text-xs text-[#2b1d19] focus:outline-none focus:border-[#881337]"
                          />

                          <div className="flex items-center gap-2">
                            {catMeta.tab && (
                              <button
                                type="button"
                                onClick={() => {
                                  const targetLvl = task.level !== 'ALL' ? task.level : undefined;
                                  onNavigateToFeature(catMeta.tab!, targetLvl);
                                  onClose();
                                }}
                                className="px-3 py-2 rounded-xl bg-[#fae8eb] hover:bg-[#f8d5db] text-[#881337] text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer shrink-0"
                              >
                                <span>{catMeta.actionLabel}</span>
                                <ChevronRight className="w-3.5 h-3.5" />
                              </button>
                            )}

                            {myComp && studentNotes[task.id] !== undefined && studentNotes[task.id] !== (myComp.note || '') && (
                              <button
                                type="button"
                                onClick={() => handleStudentToggleComplete(task, true)}
                                className="px-3 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition-colors cursor-pointer shrink-0"
                              >
                                Simpan Catatan
                              </button>
                            )}

                            <button
                              type="button"
                              onClick={() => handleStudentToggleComplete(task, false)}
                              className={`px-4 py-2 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition-all cursor-pointer shrink-0 ${
                                myComp
                                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs'
                                  : 'bg-[#881337] hover:bg-[#9f1239] text-white shadow-xs'
                              }`}
                            >
                              <CheckSquare className="w-4 h-4" />
                              <span>{myComp ? 'Sudah Selesai (Klik untuk Batal)' : 'Tandai Sudah Selesai'}</span>
                            </button>
                          </div>
                        </div>

                        {myComp && (
                          <div className="text-[11px] text-emerald-800 bg-emerald-100/70 px-3 py-1.5 rounded-lg flex items-center justify-between">
                            <span>
                              🌸 Kamu telah menyelesaikan tugas ini pada <strong>{myComp.completedAt}</strong>
                              {myComp.note ? ` · Catatan: "${myComp.note}"` : ''}
                            </span>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Action & Monitoring Row for Master */}
                    {isMasterUser && (
                      <div className="pt-3 border-t border-[#ebdccb] space-y-3">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <button
                            type="button"
                            onClick={() =>
                              setExpandedTaskStudents(prev => ({
                                ...prev,
                                [task.id]: !prev[task.id],
                              }))
                            }
                            className="px-3 py-1.5 rounded-xl bg-[#f5ede1] hover:bg-[#eadbc8] text-[#553b26] text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                          >
                            <Users className="w-3.5 h-3.5 text-[#881337]" />
                            <span>
                              {isExpandedStudents
                                ? 'Sembunyikan Daftar Pantauan Murid'
                                : `Lihat Pantauan Murid (${completedCount}/${allStudents.length} Selesai)`}
                            </span>
                          </button>

                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => handleToggleTaskActive(task)}
                              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer border ${
                                task.isActive
                                  ? 'bg-amber-50 text-amber-900 border-amber-300 hover:bg-amber-100'
                                  : 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100'
                              }`}
                            >
                              <Archive className="w-3.5 h-3.5" />
                              <span>{task.isActive ? 'Tutup / Arsipkan' : 'Aktifkan Kembali'}</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => handleOpenEdit(task)}
                              className="px-3 py-1.5 rounded-xl bg-white hover:bg-stone-50 text-[#553b26] border border-[#d6c0aa] text-xs font-bold flex items-center gap-1 cursor-pointer"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                              <span>Edit</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => handleDeleteTask(task.id)}
                              className="px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold flex items-center gap-1 cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>Hapus</span>
                            </button>
                          </div>
                        </div>

                        {/* Master Student Completion Monitor Table */}
                        {isExpandedStudents && (
                          <div className="bg-[#fdfaf5] border border-[#e5d3c0] rounded-xl p-3 space-y-2.5">
                            <div className="text-xs font-extrabold text-[#881337] flex items-center justify-between">
                              <span>📋 Status Pengerjaan Murid Terdaftar ({allStudents.length} Murid)</span>
                              <span className="text-[11px] font-semibold text-[#6e533d]">
                                Selesai: {completedCount} · Belum: {Math.max(0, allStudents.length - completedCount)}
                              </span>
                            </div>

                            {allStudents.length === 0 ? (
                              <p className="text-xs text-[#735338]">Belum ada murid terdaftar.</p>
                            ) : (
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                {allStudents.map(stu => {
                                  const comp = (task.completions || []).find(
                                    c => c.studentEmail.toLowerCase() === stu.email.toLowerCase()
                                  );
                                  return (
                                    <div
                                      key={stu.email}
                                      className={`p-2.5 rounded-xl border text-xs flex flex-col justify-between ${
                                        comp
                                          ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950'
                                          : 'bg-white border-stone-200 text-stone-700'
                                      }`}
                                    >
                                      <div className="flex items-center justify-between gap-2">
                                        <div className="font-bold truncate">
                                          {stu.fullName} ({stu.nickname})
                                        </div>
                                        <span
                                          className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full shrink-0 ${
                                            comp
                                              ? 'bg-emerald-200 text-emerald-900'
                                              : 'bg-amber-100 text-amber-900'
                                          }`}
                                        >
                                          {comp ? '✅ Selesai' : '⏳ Belum'}
                                        </span>
                                      </div>
                                      {comp && (
                                        <div className="mt-1 text-[11px] text-emerald-800">
                                          <div>Waktu: {comp.completedAt}</div>
                                          {comp.note && (
                                            <div className="italic mt-0.5 text-emerald-900">
                                              Catatan: "{comp.note}"
                                            </div>
                                          )}
                                        </div>
                                      )}
                                    </div>
                                  );
                                })}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 bg-[#f7efe3] border-t border-[#e5d3c0] flex items-center justify-between text-xs text-[#6e533d]">
          <span>🌸 Folder Tugas Harian Sensei dapat dibuka setiap saat oleh Master & Murid</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-[#881337] hover:bg-[#9f1239] text-white font-bold text-xs cursor-pointer"
          >
            Tutup Folder
          </button>
        </div>
      </div>
    </div>
  );
};
