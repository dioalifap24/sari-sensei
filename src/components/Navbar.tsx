import React, { useState, useEffect } from 'react';
import { User, JLPTLevel, QuizControlState } from '../types';
import { storageService } from '../services/storageService';
import { LogOut, User as UserIcon, BookOpen, FileQuestion, Layers, Award, Users, Crown, Play, Square, Shield, ShieldAlert } from 'lucide-react';
import { UchihaClanLogo } from './UchihaClanLogo';

interface NavbarProps {
  currentUser: User | null;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenAuth: () => void;
  onLogout: () => void;
  activeLevel: JLPTLevel;
  setActiveLevel: (lvl: JLPTLevel) => void;
  isStudentQuizRunning?: boolean;
  onBlockedNavigation?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  activeTab,
  setActiveTab,
  onOpenAuth,
  onLogout,
  activeLevel,
  setActiveLevel,
  isStudentQuizRunning = false,
  onBlockedNavigation,
}) => {
  const [quizControl, setQuizControl] = useState<QuizControlState>({ isActive: false });

  // Load and listen to live quiz control status
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

  const isMasterUser = storageService.isMaster(currentUser);

  const handleTabClick = (tab: string) => {
    if (isStudentQuizRunning && !isMasterUser && tab !== 'kuis') {
      onBlockedNavigation?.();
      return;
    }
    setActiveTab(tab);
  };

  // Toggle Sesi Kuis for Master
  const handleToggleQuizControl = (e: React.MouseEvent) => {
    e.stopPropagation();
    const newState = !quizControl.isActive;
    storageService.setQuizControlState(newState, currentUser || undefined);
    setQuizControl(storageService.getQuizControlState());
  };

  return (
    <header className="sticky top-0 z-40 bg-[#fdfbf7]/95 backdrop-blur-md border-b border-[#ebdccb] shadow-xs">
      <div className="max-w-6xl mx-auto px-3 sm:px-4 py-2.5 flex items-center justify-between gap-3">
        {/* Brand Zone - Title with Sakura Icons */}
        <div 
          onClick={() => handleTabClick('home')}
          className="cursor-pointer flex items-center gap-1.5 sm:gap-2 group select-none shrink-0"
        >
          <span className="text-xl md:text-2xl transition-transform group-hover:scale-110 duration-200" aria-hidden="true">🌸</span>
          <div className="flex flex-col items-center">
            <span className="text-xl md:text-2xl font-bold tracking-tight text-[#881337] font-japanese hover:text-[#9f1239] transition-colors">
              Sari Sensei
            </span>
            <span className="text-[10px] text-[#8c6b4b] -mt-1 font-medium tracking-wider hidden sm:block">
              さり せんせい · JLPT N5–N2
            </span>
          </div>
          <span className="text-xl md:text-2xl transition-transform group-hover:scale-110 duration-200" aria-hidden="true">🌸</span>
        </div>

        {/* Status Ujian Terkunci (Hanya Murid Biasa saat Kuis Berlangsung) */}
        {isStudentQuizRunning && !isMasterUser && (
          <div className="flex items-center gap-1.5 px-3 py-1 bg-rose-100 text-rose-900 border border-rose-300 rounded-full text-xs font-black animate-pulse shadow-xs">
            <ShieldAlert className="w-3.5 h-3.5 text-rose-600 shrink-0" />
            <span className="hidden sm:inline">MODE UJIAN TERKUNCI (ANTI-KECURANGAN)</span>
            <span className="sm:hidden">TERKUNCI</span>
          </div>
        )}

        {/* Desktop Quick Navigation */}
        <nav className="hidden lg:flex items-center gap-1 text-sm font-medium text-[#654d38]">
          <button
            onClick={() => handleTabClick('home')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              activeTab === 'home'
                ? 'bg-[#f8ede0] text-[#881337] font-semibold'
                : 'hover:text-[#881337] hover:bg-[#fcf3e8]'
            } ${isStudentQuizRunning && !isMasterUser && activeTab !== 'home' ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            Beranda
          </button>

          <button
            onClick={() => handleTabClick('materi')}
            className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
              activeTab === 'materi'
                ? 'bg-[#f8ede0] text-[#881337] font-semibold'
                : 'hover:text-[#881337] hover:bg-[#fcf3e8]'
            } ${isStudentQuizRunning && !isMasterUser && activeTab !== 'materi' ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <BookOpen className="w-4 h-4 text-[#881337]" />
            <span>Materi</span>
          </button>

          {/* KUIS BUTTON WITH REAL-TIME STATUS DOT & MASTER START/END BUTTON */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => handleTabClick('kuis')}
              className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
                activeTab === 'kuis'
                  ? 'bg-[#f8ede0] text-[#881337] font-semibold'
                  : 'hover:text-[#881337] hover:bg-[#fcf3e8]'
              }`}
            >
              <FileQuestion className="w-4 h-4 text-[#881337]" />
              <span>Kuis</span>
              {/* Logo Bulat Warna (Hijau jika sesi dibuka, Merah jika belum dibuka) */}
              <span 
                className={`w-2.5 h-2.5 rounded-full inline-block ring-2 transition-all ${
                  quizControl.isActive 
                    ? 'bg-emerald-500 ring-emerald-300 animate-pulse' 
                    : 'bg-rose-500 ring-rose-300'
                }`} 
                title={quizControl.isActive ? 'Sesi Kuis Sedang Dibuka (Hijau)' : 'Sesi Kuis Belum Dibuka (Merah)'}
              />
            </button>

            {/* Master Only: Tombol Mulai / Akhiri Kuis di sebelah Kuis */}
            {isMasterUser && (
              <button
                type="button"
                onClick={handleToggleQuizControl}
                title={quizControl.isActive ? 'Akhiri Sesi Kuis Murid' : 'Mulai Sesi Kuis untuk Murid'}
                className={`px-2 py-1 rounded-md text-[11px] font-extrabold transition-all flex items-center gap-1 text-white shadow-xs active:scale-95 ${
                  quizControl.isActive 
                    ? 'bg-rose-600 hover:bg-rose-700 ring-1 ring-rose-300' 
                    : 'bg-emerald-600 hover:bg-emerald-700 ring-1 ring-emerald-300'
                }`}
              >
                {quizControl.isActive ? (
                  <>
                    <Square className="w-3 h-3 fill-white" />
                    <span>Akhiri</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3 h-3 fill-white" />
                    <span>Mulai Kuis</span>
                  </>
                )}
              </button>
            )}
          </div>

          <button
            onClick={() => handleTabClick('vocab')}
            className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
              activeTab === 'vocab'
                ? 'bg-[#f8ede0] text-[#881337] font-semibold'
                : 'hover:text-[#881337] hover:bg-[#fcf3e8]'
            } ${isStudentQuizRunning && !isMasterUser && activeTab !== 'vocab' ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <Layers className="w-4 h-4 text-[#881337]" />
            <span>Kartu Hafalan</span>
          </button>

          <button
            onClick={() => handleTabClick('kanji')}
            className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
              activeTab === 'kanji'
                ? 'bg-[#f8ede0] text-[#881337] font-semibold'
                : 'hover:text-[#881337] hover:bg-[#fcf3e8]'
            } ${isStudentQuizRunning && !isMasterUser && activeTab !== 'kanji' ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <span className="font-bold text-xs text-[#881337]">漢字</span>
            <span>Kartu Kanji</span>
          </button>

          <button
            onClick={() => handleTabClick('laporan')}
            className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
              activeTab === 'laporan'
                ? 'bg-[#f8ede0] text-[#881337] font-semibold'
                : 'hover:text-[#881337] hover:bg-[#fcf3e8]'
            } ${isStudentQuizRunning && !isMasterUser && activeTab !== 'laporan' ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <Award className="w-4 h-4 text-[#881337]" />
            <span>Laporan</span>
          </button>

          {/* TAB NILAI SEMUA MURID: HANYA MUNCUL KETIKA MASUK MENGGUNAKAN AKUN MASTER */}
          {isMasterUser && (
            <button
              onClick={() => handleTabClick('master_management')}
              className={`px-3.5 py-1.5 rounded-lg transition-all flex items-center gap-1.5 font-bold shadow-xs ${
                activeTab === 'master_management'
                  ? 'bg-[#881337] text-white ring-2 ring-[#fbcfe8]'
                  : 'bg-gradient-to-r from-amber-100 to-amber-200 text-amber-950 border border-amber-300 hover:from-amber-200 hover:to-amber-300'
              }`}
            >
              <Shield className="w-4 h-4 text-amber-700" />
              <span>Nilai Semua Murid</span>
            </button>
          )}
        </nav>

        {/* Right Action Zone: User Profile & Logout */}
        <div className="flex items-center gap-2">
          {/* Level Tag */}
          <div className="hidden sm:flex items-center gap-1 px-2.5 py-1 bg-[#fff6ee] border border-[#e8d2ba] rounded-full text-xs font-semibold text-[#881337]">
            <span className="text-[10px] text-[#99653a]">LEVEL</span>
            <span>{activeLevel}</span>
          </div>

          {currentUser ? (
            <div className="flex items-center gap-2">
              {isMasterUser && (
                <div 
                  onClick={() => setActiveTab('master_management')}
                  className="cursor-pointer hidden sm:flex items-center gap-1 px-2.5 py-1 bg-gradient-to-r from-amber-100 to-amber-200 border border-amber-300 rounded-lg text-amber-900 text-xs font-black shadow-xs hover:ring-2 hover:ring-amber-400 transition-all"
                  title="Akun Master: GLOSTER GLADIATOR (skywalker)"
                >
                  <Crown className="w-3.5 h-3.5 text-amber-700" />
                  <span>skywalker (Master)</span>
                </div>
              )}

              <div 
                onClick={() => {
                  if (isStudentQuizRunning && !isMasterUser) {
                    onBlockedNavigation?.();
                    return;
                  }
                  setActiveTab(isMasterUser ? 'master_management' : 'laporan');
                }}
                className="cursor-pointer flex items-center gap-1.5 px-3 py-1.5 bg-[#fbf0e6] border border-[#e4ccb5] rounded-lg text-xs font-medium text-[#463222] hover:bg-[#f6e5d5] transition-colors"
                title={isMasterUser ? `${currentUser.fullName || 'GLOSTER GLADIATOR'} (${currentUser.nickname || 'skywalker'}) - Akun Master` : `${currentUser.fullName || currentUser.name || ''} (${currentUser.email})`}
              >
                {isMasterUser ? (
                  <UchihaClanLogo className="w-5 h-5 hover:scale-110 transition-transform" />
                ) : (
                  <div className="w-5 h-5 rounded-full bg-[#881337] text-white flex items-center justify-center text-[10px] font-bold">
                    {(currentUser.nickname || currentUser.fullName || 'S').charAt(0).toUpperCase()}
                  </div>
                )}
                <div className="flex items-center gap-1 max-w-[120px] sm:max-w-[170px] truncate">
                  <span className="font-bold text-[#881337] truncate">
                    {currentUser.nickname || currentUser.fullName || (isMasterUser ? 'skywalker' : currentUser.email.split('@')[0])}
                  </span>
                </div>
              </div>

              <button
                onClick={() => {
                  if (isStudentQuizRunning && !isMasterUser) {
                    onBlockedNavigation?.();
                    return;
                  }
                  onLogout();
                }}
                className="flex items-center gap-1 px-3 py-1.5 bg-[#fff0f3] hover:bg-[#ffe2e7] text-[#9f1239] border border-[#fecdd3] text-xs font-medium rounded-lg transition-colors whitespace-nowrap"
                title={isMasterUser ? "Keluar dari akun master" : "Keluar dari akun murid"}
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Keluar</span>
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="flex items-center gap-1.5 px-4 py-1.5 bg-[#881337] hover:bg-[#70102d] text-white text-xs font-semibold rounded-lg shadow-xs transition-all whitespace-nowrap"
            >
              <UserIcon className="w-3.5 h-3.5" />
              <span>Masuk / Daftar</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
