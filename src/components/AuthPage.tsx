import React, { useState } from 'react';
import { Eye, EyeOff, Mail, Lock, User as UserIcon, Smile, KeyRound, CheckCircle } from 'lucide-react';
import { storageService } from '../services/storageService';
import { User } from '../types';
import { senseiSariMascot, sakuraBranchCorner, japaneseCloudsOrnament } from '../assets';

interface AuthPageProps {
  onSuccess: (user: User, isNewRegistration: boolean) => void;
}

export const AuthPage: React.FC<AuthPageProps> = ({ onSuccess }) => {
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  
  // Registration fields
  const [fullName, setFullName] = useState('');
  const [nickname, setNickname] = useState('');
  
  // Common fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Forgot password modal state
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotNewPass, setForgotNewPass] = useState('');
  const [forgotMsg, setForgotMsg] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const handleRecoverPassword = () => {
    if (!forgotEmail || !forgotNewPass) {
      setForgotMsg({ text: 'Mohon isi email dan kata sandi baru.', type: 'error' });
      return;
    }
    const res = storageService.updateStudentPassword(forgotEmail, forgotNewPass);
    if (res.success) {
      setForgotMsg({ text: 'Kata sandi berhasil diperbarui! Silakan tutup jendela ini dan masuk.', type: 'success' });
      setPassword(forgotNewPass);
      setEmail(forgotEmail);
      setTimeout(() => {
        setShowForgotModal(false);
        setForgotMsg(null);
      }, 2500);
    } else {
      setForgotMsg({ text: res.message, type: 'error' });
    }
  };

  // Handle Login action
  const handleLogin = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorMsg('');
    const res = storageService.login(email, password);
    if (res.success && res.user) {
      onSuccess(res.user, false);
    } else {
      setErrorMsg(res.message);
    }
  };

  // Handle Register action
  const handleRegister = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorMsg('');

    // If currently on login tab, switch to registration tab so student can fill names
    if (authMode === 'login') {
      setAuthMode('register');
      setErrorMsg('Silakan lengkapi Nama Lengkap & Nama Panggilan untuk mendaftar akun baru.');
      return;
    }

    if (!fullName.trim() || fullName.trim().length < 2) {
      setErrorMsg('Nama lengkap murid wajib diisi untuk pendataan & ranking.');
      return;
    }

    if (!nickname.trim() || nickname.trim().length < 2) {
      setErrorMsg('Nama panggilan murid wajib diisi.');
      return;
    }

    const res = storageService.register(email, password, fullName, nickname);
    if (res.success && res.user) {
      onSuccess(res.user, true);
    } else {
      setErrorMsg(res.message);
    }
  };

  return (
    <div className="min-h-screen bg-[#fdfbf7] bg-japanese-pattern text-[#2b1d19] flex flex-col justify-between relative overflow-hidden selection:bg-[#fbcfe8] selection:text-[#881337]">
      {/* Decorative Corner Sakura Branches */}
      <div 
        className="absolute top-0 right-0 w-52 sm:w-80 md:w-96 h-52 sm:h-80 md:h-96 pointer-events-none opacity-30 -mr-10 -mt-10 select-none z-0"
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
        className="absolute bottom-0 left-0 w-64 sm:w-96 h-40 sm:h-60 pointer-events-none opacity-20 -ml-12 -mb-8 select-none z-0"
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

      {/* Top Header Bar for Sari Sensei */}
      <header className="relative z-10 py-5 px-4 text-center border-b border-[#ebdccb]/60 bg-[#fffdfa]/80 backdrop-blur-xs">
        <div className="flex items-center justify-center gap-2.5">
          <span className="text-2xl sm:text-3xl" aria-hidden="true">🌸</span>
          <div className="flex flex-col items-center">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#881337] tracking-tight font-japanese">
              Sari Sensei
            </h1>
            <span className="text-[11px] sm:text-xs text-[#8c6b4b] font-medium tracking-widest mt-0.5 uppercase">
              Aplikasi Belajar JLPT N5–N2
            </span>
          </div>
          <span className="text-2xl sm:text-3xl" aria-hidden="true">🌸</span>
        </div>
      </header>

      {/* Main Authentication Card */}
      <main className="relative z-10 flex-1 flex items-center justify-center p-4 sm:p-6 my-auto">
        <div className="w-full max-w-md bg-[#fffdfa] border-2 border-[#ebdccb] rounded-3xl shadow-xl overflow-hidden animate-in fade-in zoom-in duration-300">
          {/* Card Top Title Banner */}
          <div className="relative bg-gradient-to-r from-[#fae8eb] via-[#fdf2f4] to-[#fbf0df] px-6 py-5 border-b border-[#eedac5] text-center">
            <div className="inline-block p-1 bg-gradient-to-tr from-[#d4af37] via-[#fbcfe8] to-[#881337] rounded-full shadow-xs mb-2">
              <img 
                src={senseiSariMascot} 
                alt="Sari Sensei"
                className="w-14 h-14 rounded-full object-cover border-2 border-white"
                loading="eager"
                onError={(e) => {
                  const el = e.currentTarget;
                  if (el.src !== '/assets/images/sensei_sari_mascot_1790796337196.jpg') {
                    el.src = '/assets/images/sensei_sari_mascot_1790796337196.jpg';
                  }
                }}
              />
            </div>
            <h2 className="text-xl font-bold text-[#881337] font-japanese">
              {authMode === 'login' ? 'Masuk Akun Murid' : 'Pendaftaran Murid Baru'}
            </h2>
            <p className="text-xs text-[#6e533d] mt-1 max-w-xs mx-auto leading-relaxed">
              Masuk atau daftar sebagai murid untuk menyimpan setiap riwayat kuis.
            </p>

            {/* Mode Switcher Tabs */}
            <div className="mt-4 flex items-center justify-center gap-1.5 p-1 bg-[#f5ede1] rounded-xl max-w-xs mx-auto">
              <button
                type="button"
                onClick={() => {
                  setAuthMode('login');
                  setErrorMsg('');
                }}
                className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold transition-all ${
                  authMode === 'login'
                    ? 'bg-[#881337] text-white shadow-xs'
                    : 'text-[#624734] hover:text-[#881337]'
                }`}
              >
                Sudah Ada Akun (Masuk)
              </button>
              <button
                type="button"
                onClick={() => {
                  setAuthMode('register');
                  setErrorMsg('');
                }}
                className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold transition-all ${
                  authMode === 'register'
                    ? 'bg-[#881337] text-white shadow-xs'
                    : 'text-[#624734] hover:text-[#881337]'
                }`}
              >
                Daftar Akun Baru
              </button>
            </div>
          </div>

          {/* Form Content */}
          <div className="p-6 sm:p-7">
            {errorMsg && (
              <div className="mb-4 p-3 bg-[#fff1f2] border border-[#fecdd3] rounded-xl text-xs text-[#9f1239] flex items-center gap-2">
                <span className="font-bold text-sm">⚠️</span>
                <span>{errorMsg}</span>
              </div>
            )}

            <form
              onSubmit={(e) => {
                if (authMode === 'login') {
                  handleLogin(e);
                } else {
                  handleRegister(e);
                }
              }}
              className="space-y-3.5"
            >
              {/* Kolom Nama Lengkap & Nama Panggilan (Wajib Saat Pendaftaran) */}
              {authMode === 'register' && (
                <>
                  <div>
                    <label className="block text-xs font-semibold text-[#5a4230] mb-1">
                      Nama Lengkap Murid <span className="text-red-500 font-bold">*</span>
                    </label>
                    <div className="relative">
                      <UserIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#a88a70]" />
                      <input
                        type="text"
                        required
                        placeholder="contoh: Budi Pratama Santoso"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="w-full pl-10 pr-3.5 py-2.5 bg-white border border-[#ddcaa8] rounded-xl text-sm text-[#2b1d19] placeholder:text-[#a88a70]/70 focus:outline-hidden focus:border-[#881337] focus:ring-1 focus:ring-[#881337] transition-all"
                      />
                    </div>
                    <span className="text-[10px] text-[#735338] mt-0.5 block">
                      Wajib diisi untuk rekap nilai & ranking kemajuan murid.
                    </span>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#5a4230] mb-1">
                      Nama Panggilan <span className="text-red-500 font-bold">*</span>
                    </label>
                    <div className="relative">
                      <Smile className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#a88a70]" />
                      <input
                        type="text"
                        required
                        placeholder="contoh: Budi"
                        value={nickname}
                        onChange={(e) => setNickname(e.target.value)}
                        className="w-full pl-10 pr-3.5 py-2.5 bg-white border border-[#ddcaa8] rounded-xl text-sm text-[#2b1d19] placeholder:text-[#a88a70]/70 focus:outline-hidden focus:border-[#881337] focus:ring-1 focus:ring-[#881337] transition-all"
                      />
                    </div>
                    <span className="text-[10px] text-[#735338] mt-0.5 block">
                      Nama yang akan disapa hangat oleh Sensei Sari.
                    </span>
                  </div>
                </>
              )}

              {/* Kolom Email */}
              <div>
                <label className="block text-xs font-semibold text-[#5a4230] mb-1">
                  Alamat Email Murid <span className="text-red-500 font-bold">*</span>
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#a88a70]" />
                  <input
                    type="email"
                    required
                    placeholder="nama.anda@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-3.5 py-2.5 bg-white border border-[#ddcaa8] rounded-xl text-sm text-[#2b1d19] placeholder:text-[#a88a70]/70 focus:outline-hidden focus:border-[#881337] focus:ring-1 focus:ring-[#881337] transition-all"
                  />
                </div>
              </div>

              {/* Kolom Kata Sandi dengan Ikon Mata */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-semibold text-[#5a4230]">
                    Kata Sandi <span className="text-red-500 font-bold">*</span>
                  </label>
                  {authMode === 'login' && (
                    <button
                      type="button"
                      onClick={() => {
                        setForgotEmail(email);
                        setForgotNewPass('');
                        setForgotMsg(null);
                        setShowForgotModal(true);
                      }}
                      className="text-[11px] font-bold text-[#881337] hover:text-[#70102d] hover:underline transition-colors flex items-center gap-1"
                    >
                      <KeyRound className="w-3 h-3 text-[#881337]" />
                      <span>Lupa kata sandi?</span>
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#a88a70]" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="Minimal 4 karakter"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-11 py-2.5 bg-white border border-[#ddcaa8] rounded-xl text-sm text-[#2b1d19] placeholder:text-[#a88a70]/70 focus:outline-hidden focus:border-[#881337] focus:ring-1 focus:ring-[#881337] transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#a88a70] hover:text-[#5a4230] transition-colors p-1"
                    title={showPassword ? 'Sembunyikan kata sandi' : 'Lihat kata sandi'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Action Buttons as specified:
                  Tombol "Masuk" (latar merah tua, teks putih) | "Daftar" (latar merah muda pudar) */}
              <div className="pt-2 flex flex-col sm:flex-row gap-2.5">
                <button
                  type="button"
                  onClick={() => {
                    if (authMode !== 'login') {
                      setAuthMode('login');
                      setErrorMsg('');
                    } else {
                      handleLogin();
                    }
                  }}
                  className="flex-1 py-3 px-4 bg-[#881337] hover:bg-[#70102d] text-white font-bold text-sm rounded-xl shadow-xs transition-all flex items-center justify-center gap-1.5 active:scale-[0.99]"
                >
                  <span>Masuk</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleRegister()}
                  className="flex-1 py-3 px-4 bg-[#fce7f3] hover:bg-[#fbcfe8] text-[#881337] border border-[#f9a8d4] font-bold text-sm rounded-xl transition-all flex items-center justify-center gap-1.5 active:scale-[0.99]"
                >
                  <span>Daftar</span>
                </button>
              </div>
            </form>

            <div className="mt-5 text-center border-t border-[#f2e6d6] pt-4">
              <p className="text-[11px] text-[#82664e] leading-relaxed">
                🌸 Setiap murid terdaftar secara mandiri. Riwayat kuis, nama lengkap, serta peringkat kemajuan tersimpan aman dan permanen.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 py-4 text-center text-xs text-[#8c6b4b] border-t border-[#ebdccb]/60 bg-[#fffdfa]/80">
        <p className="font-japanese font-bold text-[#881337]">
          🌸 Sensei Sari · Belajar Hangat, Maju Terukur 🌸
        </p>
        <p className="text-[10px] text-[#735338] mt-0.5">
          Aplikasi Belajar Mandiri JLPT N5, N4, N3, N2
        </p>
      </footer>

      {/* Modal Lupa Kata Sandi Murid */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-[#fffdfa] border-2 border-amber-400 rounded-3xl p-6 sm:p-7 shadow-2xl">
            <div className="flex items-center gap-3.5 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 border border-amber-300 flex items-center justify-center text-amber-700 text-xl shrink-0 shadow-2xs">
                <KeyRound className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-[#881337] font-japanese">
                  Perbaiki / Reset Kata Sandi
                </h3>
                <p className="text-xs text-[#735338]">
                  Masukkan email terdaftar dan kata sandi baru Anda
                </p>
              </div>
            </div>

            {forgotMsg && (
              <div className={`p-3 rounded-xl text-xs mb-4 font-semibold ${
                forgotMsg.type === 'success' 
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-300' 
                  : 'bg-red-50 text-red-800 border border-red-300'
              }`}>
                {forgotMsg.text}
              </div>
            )}

            <div className="space-y-3.5 mb-5">
              <div>
                <label className="block text-xs font-bold text-[#5a4230] mb-1">
                  Email Terdaftar Murid <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#a88a70]" />
                  <input
                    type="email"
                    placeholder="nama.anda@gmail.com"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    className="w-full pl-10 pr-3.5 py-2.5 bg-white border border-[#ddcaa8] focus:border-[#881337] rounded-xl text-sm text-[#2b1d19] outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#5a4230] mb-1">
                  Kata Sandi Baru <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#a88a70]" />
                  <input
                    type="text"
                    placeholder="Minimal 4 karakter"
                    value={forgotNewPass}
                    onChange={(e) => setForgotNewPass(e.target.value)}
                    className="w-full pl-10 pr-3.5 py-2.5 bg-white border border-[#ddcaa8] focus:border-[#881337] rounded-xl text-sm font-mono text-[#2b1d19] outline-hidden"
                  />
                </div>
              </div>

              <div className="p-2.5 bg-amber-50/70 border border-amber-200/80 rounded-xl text-[11px] text-[#735338] leading-relaxed">
                💡 <strong>Catatan:</strong> Sensei Sari (Master) juga dapat melihat dan memperbaiki kata sandi Anda langsung dari halaman manajemen guru.
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={() => setShowForgotModal(false)}
                className="flex-1 py-2.5 px-4 bg-stone-100 hover:bg-stone-200 text-[#553b26] font-bold text-xs rounded-xl transition-colors"
              >
                Tutup
              </button>
              <button
                type="button"
                onClick={handleRecoverPassword}
                className="flex-1 py-2.5 px-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold text-xs rounded-xl shadow-md transition-all active:scale-95 flex items-center justify-center gap-1.5"
              >
                <CheckCircle className="w-3.5 h-3.5" />
                <span>Simpan Sandi Baru</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
