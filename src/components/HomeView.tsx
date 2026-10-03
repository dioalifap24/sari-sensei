import React, { useState, useEffect } from 'react';
import { JLPTLevel, User, QuizControlState } from '../types';
import { storageService } from '../services/storageService';
import { BookOpen, FileQuestion, Layers, Award, Users, ChevronRight, Shield, Crown } from 'lucide-react';
import { senseiSariMascot, sakuraBranchCorner, japaneseCloudsOrnament } from '../assets';

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
  const [studentsCreds, setStudentsCreds] = useState<{ user: User; password: string }[]>([]);

  useEffect(() => {
    const refreshHomeData = () => {
      setQuizControl(storageService.getQuizControlState());
      setStudentsCreds(storageService.getAllStudentsWithCredentials());
    };
    refreshHomeData();
    storageService.syncWithServer().then(refreshHomeData);

    window.addEventListener('quiz_control_changed', refreshHomeData);
    window.addEventListener('student_data_updated', refreshHomeData);
    window.addEventListener('presence_updated', refreshHomeData);
    window.addEventListener('storage', refreshHomeData);

    return () => {
      window.removeEventListener('quiz_control_changed', refreshHomeData);
      window.removeEventListener('student_data_updated', refreshHomeData);
      window.removeEventListener('presence_updated', refreshHomeData);
      window.removeEventListener('storage', refreshHomeData);
    };
  }, []);

  const isMasterUser = storageService.isMaster(currentUser);
  const SAMPLE_EMAILS = ['budi.santoso@gmail.com', 'anisa.dewi@gmail.com', 'rizky.pratama@gmail.com', 'putri.ayu@gmail.com'];

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

        {/* Feature Cards Grid (5 Cards for Students, 6 Cards for Master) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4 mb-10">
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
                  Panel Master ({studentsCreds.length} Murid)
                </span>
              </div>
              <div>
                <h3 className="text-lg font-bold text-[#881337] font-japanese flex items-center gap-1.5">
                  📋 Daftar Murid & Nilai
                </h3>
                <p className="text-xs text-[#5e4735] mt-1 leading-relaxed">
                  Kelola akun murid yang sudah mendaftar ({studentsCreds.length} murid terdaftar), pantau pengerjaan kuis live, dan rekap nilai.
                </p>
              </div>
              <div className="mt-4 flex items-center gap-1 text-xs font-extrabold text-amber-900 group-hover:translate-x-1 transition-transform">
                <span>Buka Halaman Master & Daftar Murid</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </div>
            </button>
          )}
        </div>

        {/* PANEL LANGSUNG DAFTAR MURID TERDAFTAR DI BERANDA MASTER */}
        {isMasterUser && (
          <div className="bg-[#fffdfa] border-2 border-[#ebdccb] rounded-3xl overflow-hidden shadow-sm mb-8">
            <div className="bg-gradient-to-r from-[#fae8eb] via-[#fffdfa] to-[#fef3c7] border-b border-[#ebdccb] px-5 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#881337] text-white flex items-center justify-center shrink-0">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-extrabold text-[#881337] font-japanese flex items-center gap-2 flex-wrap">
                    <span>Daftar Akun Murid yang Sudah Mendaftar</span>
                    <span className="px-2.5 py-0.5 bg-[#881337] text-white rounded-full text-xs font-black">
                      {studentsCreds.length} Murid Terdaftar
                    </span>
                  </h2>
                  <p className="text-xs text-[#735338]">
                    Seluruh akun murid baru & murid aktif yang terdaftar di Portal Kelas Sensei Sari
                  </p>
                </div>
              </div>

              <button
                onClick={() => onNavigate('master_management')}
                className="px-4 py-2.5 bg-[#881337] hover:bg-[#70102d] text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-1.5 shrink-0"
              >
                <span>Kelola Lengkap di Halaman Master</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead>
                  <tr className="bg-[#fdf8f2] text-[#881337] border-b border-[#ebdccb] font-bold text-xs uppercase tracking-wider">
                    <th className="py-3 px-4 text-center w-12">No</th>
                    <th className="py-3 px-4">Nama Murid & Panggilan</th>
                    <th className="py-3 px-4">Alamat Email</th>
                    <th className="py-3 px-4">Kata Sandi</th>
                    <th className="py-3 px-4">Waktu Daftar</th>
                    <th className="py-3 px-4 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f2e6d6]">
                  {studentsCreds.map((item, idx) => {
                    const stu = item.user;
                    const isNewReg = !SAMPLE_EMAILS.includes(stu.email.toLowerCase());
                    const dispName = stu.fullName || stu.name || stu.nickname || 'Murid Terdaftar';
                    const dispNick = stu.nickname || dispName.split(/\s+/)[0] || '-';
                    const isOnline = storageService.isStudentOnline(stu.email);
                    return (
                      <tr
                        key={stu.email}
                        className={isNewReg ? 'bg-[#fff9fb] hover:bg-[#fef2f6]' : 'hover:bg-[#fcf8f2]'}
                      >
                        <td className="py-3.5 px-4 text-center font-mono font-bold text-[#881337]">
                          #{idx + 1}
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-extrabold text-[#2b1d19]">{dispName}</span>
                            {isNewReg && (
                              <span className="px-2 py-0.5 bg-[#881337] text-white rounded-md text-[10px] font-bold">
                                Murid Baru
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-[#735338]">
                            Panggilan: <strong className="text-[#881337]">{dispNick}</strong>
                          </div>
                        </td>
                        <td className="py-3.5 px-4 font-mono font-bold text-[#2b1d19]">
                          {stu.email}
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="font-mono font-black text-[#881337] bg-[#fbf6ef] px-2 py-0.5 rounded-md border border-[#e4ccb5]">
                            {item.password}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 font-mono text-xs text-[#735338]">
                          {stu.registeredAt || '2026-10-01'}
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          {isOnline ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-300 rounded-lg text-xs font-extrabold">
                              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                              <span>Online</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-stone-100 text-stone-600 border border-stone-200 rounded-lg text-xs font-semibold">
                              <span className="w-2 h-2 rounded-full bg-stone-400" />
                              <span>Terdaftar</span>
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
