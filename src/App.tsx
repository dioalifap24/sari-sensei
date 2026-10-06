import React, { useState, useEffect } from 'react';
import { JLPTLevel, User, QuizControlState } from './types';
import { storageService } from './services/storageService';
import { Navbar } from './components/Navbar';
import { HomeView } from './components/HomeView';
import { MateriView } from './components/MateriView';
import { VocabCardsView } from './components/VocabCardsView';
import { KanjiCardsView } from './components/KanjiCardsView';
import { QuizView } from './components/QuizView';
import { PersonalReportView } from './components/PersonalReportView';
import { MasterManagementView } from './components/MasterManagementView';
import { AuthPage } from './components/AuthPage';
import { SakuraEffect } from './components/SakuraEffect';
import { RocketTakeoffEffect } from './components/RocketTakeoffEffect';

export function App() {
  // Initialize storage seeds
  useEffect(() => {
    storageService.init();
  }, []);

  const [currentUser, setCurrentUser] = useState<User | null>(() => storageService.getCurrentUser());
  const [activeTab, setActiveTab] = useState<string>('home');
  const [activeLevel, setActiveLevelState] = useState<JLPTLevel>(() => storageService.getActiveLevel());
  const [quizControl, setQuizControl] = useState<QuizControlState>(() => storageService.getQuizControlState());
  const [isStudentQuizRunning, setIsStudentQuizRunning] = useState<boolean>(false);

  // Sakura Interactive Particle Triggers
  const [triggerSakuraRain, setTriggerSakuraRain] = useState(false);
  const [triggerSakuraCelebration, setTriggerSakuraCelebration] = useState(false);
  const [triggerRocketTakeoff, setTriggerRocketTakeoff] = useState(false);
  const [rocketMode, setRocketMode] = useState<'takeoff' | 'landing'>('takeoff');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Synchronize quiz control state & show live notification to students when Master starts quiz session
  useEffect(() => {
    let prevActive = storageService.getQuizControlState().isActive;
    const handleQuizControlChange = () => {
      const latest = storageService.getQuizControlState();
      setQuizControl(latest);
      if (!prevActive && latest.isActive && currentUser && !storageService.isMaster(currentUser)) {
        setToastMessage('🟢 Sesi Kuis Resmi Telah DIBUKA oleh Sensei Sari! Silakan buka menu Kuis untuk mulai mengerjakan.');
        setTimeout(() => setToastMessage(null), 6000);
      }
      prevActive = latest.isActive;
    };
    window.addEventListener('quiz_control_changed', handleQuizControlChange);
    window.addEventListener('storage', handleQuizControlChange);
    return () => {
      window.removeEventListener('quiz_control_changed', handleQuizControlChange);
      window.removeEventListener('storage', handleQuizControlChange);
    };
  }, [currentUser]);

  // Show live notification to students when Master publishes a new daily task
  useEffect(() => {
    const handleDailyTaskUpdate = (ev: Event) => {
      const customEv = ev as CustomEvent<{ newActiveTaskTitle?: string | null }>;
      const newTitle = customEv.detail?.newActiveTaskTitle;
      if (newTitle && currentUser && !storageService.isMaster(currentUser)) {
        setToastMessage(`📁 Tugas Harian Baru dari Master: "${newTitle}"! Buka Folder Tugas Harian di Beranda.`);
        setTimeout(() => setToastMessage(null), 6000);
      }
    };
    window.addEventListener('daily_tasks_updated', handleDailyTaskUpdate);
    return () => {
      window.removeEventListener('daily_tasks_updated', handleDailyTaskUpdate);
    };
  }, [currentUser]);

  // Helper deskripsi aktivitas murid secara real-time untuk dipantau di Halaman Master
  const getStudentActivityDescription = (tab: string, lvl: JLPTLevel, inQuiz: boolean): string => {
    if (inQuiz) {
      return `📝 Sedang Mengerjakan Kuis JLPT ${lvl}`;
    }
    switch (tab) {
      case 'home':
        return `🏠 Membuka Beranda (Target JLPT ${lvl})`;
      case 'materi':
        return `📖 Mempelajari Materi JLPT ${lvl}`;
      case 'vocab':
        return `🃏 Menghafal Kartu Kosakata (${lvl})`;
      case 'kanji':
        return `漢字 Menghafal Kartu Kanji JLPT ${lvl}`;
      case 'kuis':
        return `📝 Di Halaman Persiapan Kuis JLPT ${lvl}`;
      case 'laporan':
        return `📊 Melihat Rapor & Riwayat Nilai Pribadi`;
      default:
        return `🌸 Aktif Belajar (JLPT ${lvl})`;
    }
  };

  // Laporkan perpindahan halaman / level murid secara instan ke Akun Master
  useEffect(() => {
    if (!currentUser || storageService.isMaster(currentUser)) return;
    if (isStudentQuizRunning) return; // Saat kuis berjalan, QuizView melaporkan progres nomor soal secara spesifik
    storageService.heartbeatPresence(currentUser, {
      currentTab: activeTab,
      currentActivity: getStudentActivityDescription(activeTab, activeLevel, isStudentQuizRunning),
      activeLevel,
    });
  }, [currentUser, activeTab, activeLevel, isStudentQuizRunning]);

  // Activity tracking and 30-minute inactivity auto-logout for regular students
  useEffect(() => {
    if (!currentUser) return;

    let lastRecorded = 0;
    const recordActivity = () => {
      const now = Date.now();
      if (now - lastRecorded > 8000) {
        lastRecorded = now;
        storageService.updateLastActive();
        if (currentUser && !storageService.isMaster(currentUser) && !isStudentQuizRunning) {
          storageService.heartbeatPresence(currentUser, {
            currentTab: activeTab,
            currentActivity: getStudentActivityDescription(activeTab, activeLevel, isStudentQuizRunning),
            activeLevel,
          });
        }
      }
    };

    // Initial heartbeat if logged in
    if (currentUser && !storageService.isMaster(currentUser) && !isStudentQuizRunning) {
      storageService.heartbeatPresence(currentUser, {
        currentTab: activeTab,
        currentActivity: getStudentActivityDescription(activeTab, activeLevel, isStudentQuizRunning),
        activeLevel,
      });
    }

    const activityEvents = ['mousemove', 'mousedown', 'keydown', 'touchstart', 'scroll', 'click'];
    activityEvents.forEach((ev) => window.addEventListener(ev, recordActivity, { passive: true }));

    const handleBeforeUnload = () => {
      if (currentUser && !storageService.isMaster(currentUser)) {
        storageService.setPresenceOffline(currentUser.email);
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        storageService.updateLastActive();
      } else if (document.visibilityState === 'visible') {
        storageService.syncWithServer();
        if (!storageService.isMaster(currentUser)) {
          const session = storageService.checkSessionExpired(currentUser);
          if (session.expired) {
            storageService.logout();
            setCurrentUser(null);
            setToastMessage('Sesi belajar otomatis berakhir setelah 30 menit tidak aktif. 🌸');
            setTimeout(() => setToastMessage(null), 5000);
          } else {
            storageService.updateLastActive();
            if (!isStudentQuizRunning) {
              storageService.heartbeatPresence(currentUser, {
                currentTab: activeTab,
                currentActivity: getStudentActivityDescription(activeTab, activeLevel, isStudentQuizRunning),
                activeLevel,
              });
            }
          }
        }
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    const intervalId = window.setInterval(() => {
      if (currentUser && !storageService.isMaster(currentUser) && !isStudentQuizRunning) {
        storageService.heartbeatPresence(currentUser, {
          currentTab: activeTab,
          currentActivity: getStudentActivityDescription(activeTab, activeLevel, isStudentQuizRunning),
          activeLevel,
        });
      }
      if (!storageService.isMaster(currentUser)) {
        const session = storageService.checkSessionExpired(currentUser);
        if (session.expired) {
          storageService.logout();
          setCurrentUser(null);
          setToastMessage('Sesi otomatis berakhir setelah 30 menit tidak aktif. Silakan masuk kembali. 🌸');
          setTimeout(() => setToastMessage(null), 5000);
        }
      }
    }, 10000);

    return () => {
      activityEvents.forEach((ev) => window.removeEventListener(ev, recordActivity));
      window.removeEventListener('beforeunload', handleBeforeUnload);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      clearInterval(intervalId);
    };
  }, [currentUser, activeTab, activeLevel, isStudentQuizRunning]);

  // Restrict Master Management Tab to Master Only
  useEffect(() => {
    if (activeTab === 'master_management' && !storageService.isMaster(currentUser)) {
      setActiveTab('home');
    }
  }, [activeTab, currentUser]);

  const handleSetActiveLevel = (lvl: JLPTLevel) => {
    setActiveLevelState(lvl);
    storageService.setActiveLevel(lvl);
  };

  const handleAuthSuccess = (user: User, isNewRegistration: boolean) => {
    const isMaster = storageService.isMaster(user);

    if (isMaster) {
      // 🚀 KHUSUS AKUN MASTER (Durasi 2.5 detik sesuai permintaan 2–3 detik):
      // 1. Matikan animasi sakura
      // 2. Luncurkan animasi roket takeoff dan penuhi halaman login dengan kepulan asap
      // 3. Ucapan: "rocket sudah siap untuk di terbangkan capten"
      setTriggerSakuraRain(false);
      setRocketMode('takeoff');
      setTriggerRocketTakeoff(true);
      setToastMessage('rocket sudah siap untuk di terbangkan capten');

      // Tahan di halaman login selama take-off berlangsung (2.5 detik)
      setTimeout(() => {
        setCurrentUser(user);
        setActiveTab('home');
      }, 2500);

      setTimeout(() => {
        setToastMessage(null);
      }, 3500);
    } else {
      // Akun Murid biasa:
      setCurrentUser(user);
      setActiveTab('home');
      setTriggerSakuraRain(true);
      setToastMessage(`Selamat datang, ${user.nickname || user.fullName}! 🌸`);
      setTimeout(() => setToastMessage(null), 4500);
    }
  };

  const handleLogout = () => {
    const isMaster = storageService.isMaster(currentUser);

    if (isMaster) {
      // 🛬 KHUSUS AKUN MASTER SAAT LOGOUT (Durasi 6.0 detik sesuai permintaan 5–7 detik):
      // 1. Ganti kata sampai jumpa dengan: "happy landing capten, selamat meninggalkan jalur lepas landas"
      // 2. Tampilkan animasi pendaratan roket & kepulan asap pendaratan selama 6 detik
      storageService.logout();
      setCurrentUser(null);
      setRocketMode('landing');
      setTriggerRocketTakeoff(true);
      setToastMessage('happy landing capten, selamat meninggalkan jalur lepas landas');

      setTimeout(() => {
        setTriggerRocketTakeoff(false);
        setToastMessage(null);
      }, 6000);
    } else {
      // Akun murid biasa:
      storageService.logout();
      setCurrentUser(null);
      setToastMessage('Sampai jumpa lagi! 🌸');
      setTimeout(() => setToastMessage(null), 3000);
    }
  };

  const handleScoreCelebration = () => {
    setTriggerSakuraCelebration(true);
    setToastMessage('Luar biasa! 🎉🌸 Nilai di atas 90!');
    setTimeout(() => setToastMessage(null), 6000);
  };

  const isMasterUser = storageService.isMaster(currentUser);

  // Helper untuk rendering Toast Message
  const renderToast = () => {
    if (!toastMessage) return null;
    const isRocketToast = toastMessage.includes('rocket') || 
                          toastMessage.includes('roket') || 
                          toastMessage.includes('capten') || 
                          toastMessage.includes('landing');

    if (isRocketToast) {
      const isLandingToast = toastMessage.includes('landing');
      return (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 px-6 py-3.5 bg-black/90 text-white font-extrabold text-xs sm:text-sm rounded-2xl shadow-[0_0_35px_rgba(249,115,22,0.85)] border-2 border-orange-500 animate-in fade-in zoom-in slide-in-from-top-4 duration-300 flex items-center gap-2.5 backdrop-blur-md max-w-[94vw] text-center">
          <span className="text-xl shrink-0 animate-bounce">{isLandingToast ? '🛬' : '🚀'}</span>
          <span className="tracking-wide drop-shadow-md text-amber-200 uppercase font-mono font-black">
            {toastMessage}
          </span>
          <span className="text-xl shrink-0 animate-pulse">{isLandingToast ? '✨' : '🔥'}</span>
        </div>
      );
    }

    return (
      <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 px-5 py-3 bg-[#881337] text-white font-semibold text-sm rounded-2xl shadow-xl border border-[#fbcfe8]/40 animate-in fade-in slide-in-from-top-4 duration-300 flex items-center gap-2">
        <span>🌸</span>
        <span>{toastMessage}</span>
        <span>🌸</span>
      </div>
    );
  };

  // ================= SCENARIO 1: DEDICATED LOGIN / REGISTER PAGE =================
  if (!currentUser) {
    return (
      <>
        {/* Efek Bunga Sakura untuk Murid */}
        <SakuraEffect
          triggerRain={triggerSakuraRain}
          triggerCelebration={triggerSakuraCelebration}
          onRainComplete={() => setTriggerSakuraRain(false)}
          onCelebrationComplete={() => setTriggerSakuraCelebration(false)}
        />

        {/* 🚀 Efek Roket Take-Off / Landing & Kepulan Asap Tebal Khusus Akun Master */}
        <RocketTakeoffEffect
          active={triggerRocketTakeoff}
          mode={rocketMode}
          onComplete={() => setTriggerRocketTakeoff(false)}
        />

        {renderToast()}

        <AuthPage onSuccess={handleAuthSuccess} />
      </>
    );
  }

  // ================= SCENARIO 2: MAIN DASHBOARD APPLICATION =================
  return (
    <div className="min-h-screen bg-[#fdfbf7] bg-japanese-pattern text-[#2b1d19] flex flex-col relative selection:bg-[#fbcfe8] selection:text-[#881337]">
      <SakuraEffect
        triggerRain={triggerSakuraRain}
        triggerCelebration={triggerSakuraCelebration}
        onRainComplete={() => setTriggerSakuraRain(false)}
        onCelebrationComplete={() => setTriggerSakuraCelebration(false)}
      />

      {/* 🚀 Efek Roket Take-Off / Landing jika masih berlanjut ke transisi dashboard */}
      <RocketTakeoffEffect
        active={triggerRocketTakeoff}
        mode={rocketMode}
        onComplete={() => setTriggerRocketTakeoff(false)}
      />

      {renderToast()}

      {/* Top Navbar */}
      <Navbar
        currentUser={currentUser}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenAuth={() => setCurrentUser(null)}
        onLogout={handleLogout}
        activeLevel={activeLevel}
        setActiveLevel={handleSetActiveLevel}
        isStudentQuizRunning={isStudentQuizRunning}
        onBlockedNavigation={() => {
          setToastMessage('⚠️ Mode Ujian Terkunci! Anda sedang mengerjakan kuis. Selesaikan atau kumpulkan kuis terlebih dahulu sebelum berpindah menu.');
          setTimeout(() => setToastMessage(null), 4000);
        }}
      />

      {/* Main Content Area */}
      <main className="flex-1 pb-16">
        {activeTab === 'home' && (
          <HomeView
            activeLevel={activeLevel}
            setActiveLevel={handleSetActiveLevel}
            onNavigate={setActiveTab}
            onOpenAllScores={() => setActiveTab('master_management')}
            currentUser={currentUser}
          />
        )}

        {activeTab === 'materi' && (
          <MateriView
            activeLevel={activeLevel}
            setActiveLevel={handleSetActiveLevel}
          />
        )}

        {activeTab === 'vocab' && (
          <VocabCardsView
            activeLevel={activeLevel}
            setActiveLevel={handleSetActiveLevel}
          />
        )}

        {activeTab === 'kanji' && (
          <KanjiCardsView
            activeLevel={activeLevel}
            setActiveLevel={handleSetActiveLevel}
          />
        )}

        {activeTab === 'kuis' && (
          <QuizView
            activeLevel={activeLevel}
            setActiveLevel={handleSetActiveLevel}
            currentUser={currentUser}
            onOpenAuth={() => setCurrentUser(null)}
            onScoreCelebration={handleScoreCelebration}
            onNavigateHome={() => setActiveTab('home')}
            onQuizRunningChange={setIsStudentQuizRunning}
          />
        )}

        {activeTab === 'laporan' && (
          <PersonalReportView
            currentUser={currentUser}
            onOpenAuth={() => setCurrentUser(null)}
            onStartQuiz={() => setActiveTab('kuis')}
            activeLevel={activeLevel}
            onSelectLevelAndNavigate={(lvl, tab) => {
              handleSetActiveLevel(lvl);
              setActiveTab(tab);
            }}
          />
        )}

        {/* Master Management View: Only accessible to Master */}
        {activeTab === 'master_management' && isMasterUser && (
          <MasterManagementView
            currentUser={currentUser}
            onNavigateHome={() => setActiveTab('home')}
          />
        )}
      </main>

      {/* Mobile Bottom Navigation Bar */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#fffdfa]/95 backdrop-blur-md border-t border-[#ebdccb] py-1.5 px-2 flex justify-around items-center">
        <button
          onClick={() => {
            if (isStudentQuizRunning && !isMasterUser) {
              setToastMessage('⚠️ Mode Ujian Terkunci! Selesaikan kuis terlebih dahulu sebelum berpindah menu.');
              setTimeout(() => setToastMessage(null), 4000);
              return;
            }
            setActiveTab('home');
          }}
          className={`flex flex-col items-center py-1 px-2 rounded-lg text-[10px] font-semibold transition-colors ${
            activeTab === 'home' ? 'text-[#881337]' : 'text-[#735338]'
          }`}
        >
          <span className="text-base">🏠</span>
          <span>Beranda</span>
        </button>

        <button
          onClick={() => {
            if (isStudentQuizRunning && !isMasterUser) {
              setToastMessage('⚠️ Mode Ujian Terkunci! Selesaikan kuis terlebih dahulu sebelum berpindah menu.');
              setTimeout(() => setToastMessage(null), 4000);
              return;
            }
            setActiveTab('materi');
          }}
          className={`flex flex-col items-center py-1 px-2 rounded-lg text-[10px] font-semibold transition-colors ${
            activeTab === 'materi' ? 'text-[#881337]' : 'text-[#735338]'
          }`}
        >
          <span className="text-base">📖</span>
          <span>Materi</span>
        </button>

        <button
          onClick={() => setActiveTab('kuis')}
          className={`flex flex-col items-center py-1 px-2 rounded-lg text-[10px] font-semibold transition-colors relative ${
            activeTab === 'kuis' ? 'text-[#881337]' : 'text-[#735338]'
          }`}
        >
          <span className="text-base relative">
            📝
            <span 
              className={`w-2 h-2 rounded-full absolute -top-0.5 -right-1 ring-1 ${
                quizControl.isActive ? 'bg-emerald-500 ring-emerald-300' : 'bg-rose-500 ring-rose-300'
              }`} 
            />
          </span>
          <span className="flex items-center gap-0.5">
            <span>Kuis</span>
          </span>
        </button>

        <button
          onClick={() => {
            if (isStudentQuizRunning && !isMasterUser) {
              setToastMessage('⚠️ Mode Ujian Terkunci! Selesaikan kuis terlebih dahulu sebelum berpindah menu.');
              setTimeout(() => setToastMessage(null), 4000);
              return;
            }
            setActiveTab('vocab');
          }}
          className={`flex flex-col items-center py-1 px-2 rounded-lg text-[10px] font-semibold transition-colors ${
            activeTab === 'vocab' ? 'text-[#881337]' : 'text-[#735338]'
          }`}
        >
          <span className="text-base">🃏</span>
          <span>Hafalan</span>
        </button>

        <button
          onClick={() => {
            if (isStudentQuizRunning && !isMasterUser) {
              setToastMessage('⚠️ Mode Ujian Terkunci! Selesaikan kuis terlebih dahulu sebelum berpindah menu.');
              setTimeout(() => setToastMessage(null), 4000);
              return;
            }
            setActiveTab('kanji');
          }}
          className={`flex flex-col items-center py-1 px-2 rounded-lg text-[10px] font-semibold transition-colors ${
            activeTab === 'kanji' ? 'text-[#881337]' : 'text-[#735338]'
          }`}
        >
          <span className="text-base font-bold font-japanese">漢字</span>
          <span>Kanji</span>
        </button>

        {isMasterUser ? (
          <button
            onClick={() => setActiveTab('master_management')}
            className={`flex flex-col items-center py-1 px-2 rounded-lg text-[10px] font-bold transition-colors ${
              activeTab === 'master_management' ? 'text-[#881337]' : 'text-amber-800'
            }`}
          >
            <span className="text-base">👑</span>
            <span>Master</span>
          </button>
        ) : (
          <button
            onClick={() => {
              if (isStudentQuizRunning && !isMasterUser) {
                setToastMessage('⚠️ Mode Ujian Terkunci! Selesaikan kuis terlebih dahulu sebelum berpindah menu.');
                setTimeout(() => setToastMessage(null), 4000);
                return;
              }
              setActiveTab('laporan');
            }}
            className={`flex flex-col items-center py-1 px-2 rounded-lg text-[10px] font-semibold transition-colors ${
              activeTab === 'laporan' ? 'text-[#881337]' : 'text-[#735338]'
            }`}
          >
            <span className="text-base">📊</span>
            <span>Rapor</span>
          </button>
        )}
      </nav>

      {/* Footer */}
      <footer className="py-6 border-t border-[#ebdccb] text-center text-xs text-[#8c6b4b] bg-[#fbf5ed]/60">
        <div className="max-w-4xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 font-japanese font-bold text-[#881337]">
            <span>🌸</span>
            <span>Sari Sensei · Belajar Hangat, Maju Terukur</span>
            <span>🌸</span>
          </div>
          <p className="text-[11px] text-[#735338]">
            Kurikulum resmi JLPT N5, N4, N3, N2 & Kamus Mazii. Dirancang khusus untuk pembelajaran bahasa Jepang interaktif.
          </p>
        </div>
      </footer>
    </div>
  );
}
export default App;
