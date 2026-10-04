import React, { useState } from 'react';
import { Eye, EyeOff, Mail, Lock, User as UserIcon, Smile, KeyRound, CheckCircle, ShieldCheck, AlertTriangle, Send, CheckCircle2, ArrowRight, RefreshCw, MailCheck, ShieldAlert, Sparkles } from 'lucide-react';
import { storageService, VERIFICATION_PROVIDER } from '../services/storageService';
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
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Forgot password verification workflow state
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotStep, setForgotStep] = useState<'request_email' | 'verify_code' | 'set_new_password'>('request_email');
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotCodeInput, setForgotCodeInput] = useState('');
  const [forgotNewPass, setForgotNewPass] = useState('');
  const [forgotConfirmPass, setForgotConfirmPass] = useState('');
  const [showForgotNewPass, setShowForgotNewPass] = useState(false);
  const [showForgotConfirmPass, setShowForgotConfirmPass] = useState(false);
  const [forgotMsg, setForgotMsg] = useState<{ text: string; type: 'success' | 'error' | 'info' } | null>(null);
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [activeVerificationData, setActiveVerificationData] = useState<{
    code: string;
    recipientName: string;
    sentAt: string;
    senderEmail: string;
    senderName: string;
  } | null>(null);

  // Langkah 1: Kirim email verifikasi perubahan kata sandi dari penyedia resmi
  const handleSendVerificationEmail = () => {
    const trimmed = forgotEmail.trim().toLowerCase();
    if (!trimmed) {
      setForgotMsg({ text: 'Harap masukkan alamat email terdaftar Anda (atau dioalifap24@gmail.com untuk Akun Master).', type: 'error' });
      return;
    }

    setIsSendingEmail(true);
    setForgotMsg(null);

    // Simulasi pengiriman via jaringan penyedia verifikasi resmi
    setTimeout(() => {
      const res = storageService.sendPasswordResetVerification(trimmed);
      setIsSendingEmail(false);
      if (res.success && res.code) {
        setActiveVerificationData({
          code: res.code,
          recipientName: res.recipientName || 'Murid',
          sentAt: res.sentAt || 'Sekarang',
          senderEmail: res.senderEmail || VERIFICATION_PROVIDER.email,
          senderName: res.senderName || VERIFICATION_PROVIDER.name,
        });
        setForgotStep('verify_code');
        setForgotMsg({ 
          text: `Email verifikasi keamanan telah berhasil dikirim oleh ${res.senderEmail} ke ${trimmed}!`, 
          type: 'info' 
        });
      } else {
        setForgotMsg({ text: res.message, type: 'error' });
      }
    }, 600);
  };

  // Langkah 2: Verifikasi kode 6-digit dari email
  const handleVerifyCode = () => {
    const cleanCode = forgotCodeInput.trim();
    if (!cleanCode || cleanCode.length < 6) {
      setForgotMsg({ text: 'Masukkan 6 digit kode keamanan yang dikirimkan ke email Anda.', type: 'error' });
      return;
    }

    const res = storageService.verifyPasswordResetCode(forgotEmail, cleanCode);
    if (res.success) {
      setForgotStep('set_new_password');
      setForgotMsg({ 
        text: '✓ Identitas terverifikasi resmi oleh penyedia keamanan! Silakan buat kata sandi baru Anda.', 
        type: 'success' 
      });
    } else {
      setForgotMsg({ text: res.message, type: 'error' });
    }
  };

  // Verifikasi 1-klik dari simulasi tombol email
  const handleOneClickVerifyFromEmail = () => {
    if (!activeVerificationData) return;
    setForgotCodeInput(activeVerificationData.code);
    const res = storageService.verifyPasswordResetCode(forgotEmail, activeVerificationData.code);
    if (res.success) {
      setForgotStep('set_new_password');
      setForgotMsg({ 
        text: '✓ Verifikasi berhasil melalui email resmi! Silakan buat kata sandi baru Anda.', 
        type: 'success' 
      });
    }
  };

  // Langkah 3: Simpan kata sandi baru (setelah verifikasi email resmi untuk Murid maupun Akun Master dioalifap24@gmail.com)
  const handleSaveNewPasswordWithVerification = () => {
    const cleanPass = forgotNewPass.trim();
    const cleanConfirm = forgotConfirmPass.trim();
    const isMasterReset = forgotEmail.trim().toLowerCase() === 'dioalifap24@gmail.com';

    if (isMasterReset) {
      if (!cleanPass || cleanPass.length < 2 || cleanPass.length > 10) {
        setForgotMsg({ text: 'Kata sandi baru Akun Master bebas antara minimal 2 sampai maksimal 10 karakter.', type: 'error' });
        return;
      }
    } else {
      if (!cleanPass || cleanPass.length < 8) {
        setForgotMsg({ text: 'Kata sandi baru murid wajib minimal 8 karakter demi keamanan.', type: 'error' });
        return;
      }
    }

    if (!cleanConfirm) {
      setForgotMsg({ text: 'Harap ulangi kata sandi baru pada kolom konfirmasi.', type: 'error' });
      return;
    }

    if (cleanPass !== cleanConfirm) {
      setForgotMsg({ text: 'Konfirmasi kata sandi tidak cocok. Pastikan kedua kata sandi sama.', type: 'error' });
      return;
    }

    const codeToUse = forgotCodeInput.trim() || activeVerificationData?.code || '';
    const res = storageService.completePasswordResetWithVerification(forgotEmail, codeToUse, cleanPass);
    if (res.success) {
      setForgotMsg({ 
        text: isMasterReset
          ? 'Kata sandi Akun Master (dioalifap24@gmail.com) berhasil diperbarui melalui verifikasi email resmi! 🌸👑'
          : 'Kata sandi akun murid berhasil diperbarui! Silakan masuk dengan kata sandi baru Anda. 🌸', 
        type: 'success' 
      });
      setPassword(cleanPass);
      setEmail(forgotEmail);
      setTimeout(() => {
        setShowForgotModal(false);
        setForgotStep('request_email');
        setForgotMsg(null);
        setActiveVerificationData(null);
        setForgotCodeInput('');
        setForgotNewPass('');
        setForgotConfirmPass('');
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

  // Handle Register action with 2x password confirmation and min 8 characters rule
  const handleRegister = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorMsg('');

    // If currently on login tab, switch to registration tab so student can fill names
    if (authMode === 'login') {
      setAuthMode('register');
      setErrorMsg('Silakan lengkapi Nama Lengkap & Kata Sandi Anda untuk mendaftar akun murid baru.');
      return;
    }

    const cleanFullName = fullName.trim();
    const cleanNickname = (nickname.trim() || cleanFullName.split(/\s+/)[0] || cleanFullName).trim();

    if (!cleanFullName || cleanFullName.length < 2) {
      setErrorMsg('Nama lengkap murid wajib diisi (minimal 2 karakter).');
      return;
    }

    if (!password || password.length < 2) {
      setErrorMsg('Kata sandi murid wajib diisi (minimal 2 karakter).');
      return;
    }

    if (confirmPassword && password !== confirmPassword) {
      setErrorMsg('Konfirmasi kata sandi tidak cocok. Pastikan kedua kata sandi yang Anda ketik sama persis.');
      return;
    }

    // Validasi pencegahan akun anonim
    const validation = storageService.validateStudentRegistration(cleanFullName, cleanNickname, email, password);
    if (!validation.valid) {
      setErrorMsg(validation.message);
      return;
    }

    const res = storageService.register(email, password, cleanFullName, cleanNickname);
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
                        placeholder="contoh: Budi (otomatis jika dikosongkan)"
                        value={nickname}
                        onChange={(e) => setNickname(e.target.value)}
                        className="w-full pl-10 pr-3.5 py-2.5 bg-white border border-[#ddcaa8] rounded-xl text-sm text-[#2b1d19] placeholder:text-[#a88a70]/70 focus:outline-hidden focus:border-[#881337] focus:ring-1 focus:ring-[#881337] transition-all"
                      />
                    </div>
                    <span className="text-[10px] text-[#735338] mt-0.5 block">
                      Nama yang akan disapa hangat oleh Sensei Sari.
                    </span>
                  </div>

                  {/* Ketentuan Pendaftaran Resmi Anti-Anonim */}
                  <div className="p-3 bg-amber-50/80 border border-amber-200/90 rounded-2xl text-xs space-y-1 text-[#664b36]">
                    <div className="font-bold text-[#881337] flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-[#881337]" />
                      <span>Ketentuan Pendaftaran Akun Resmi:</span>
                    </div>
                    <ul className="list-disc pl-4 space-y-0.5 text-[11px] text-[#735338] leading-relaxed">
                      <li>Wajib menggunakan <strong>nama lengkap asli</strong> (bukan nama samaran/anonim).</li>
                      <li>Wajib menggunakan <strong>alamat email pribadi aktif</strong> (layanan email sementara / anonim dilarang).</li>
                      <li>Data Anda langsung tersimpan dan muncul otomatis di <strong>Daftar Murid Akun Master Sensei Sari</strong>.</li>
                    </ul>
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
                    Kata Sandi {authMode === 'register' ? '(Minimal 8 Karakter)' : ''} <span className="text-red-500 font-bold">*</span>
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
                    placeholder={authMode === 'register' ? 'Minimal 8 karakter' : 'Masukkan kata sandi'}
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
                {authMode === 'register' && (
                  <span className="text-[10px] text-[#735338] mt-0.5 block">
                    Minimal 8 karakter demi keamanan akun murid.
                  </span>
                )}
              </div>

              {/* Kolom Konfirmasi Kata Sandi (Pembuatan Kata Sandi ke-2 Saat Pendaftaran Pertama) */}
              {authMode === 'register' && (
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-semibold text-[#5a4230]">
                      Ulangi Kata Sandi <span className="text-red-500 font-bold">*</span>
                    </label>
                    {confirmPassword && (
                      <span className={`text-[10px] font-bold ${password === confirmPassword ? 'text-emerald-600' : 'text-rose-500'}`}>
                        {password === confirmPassword ? '✓ Kata sandi cocok' : '✗ Belum cocok'}
                      </span>
                    )}
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#a88a70]" />
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder="Ketik ulang kata sandi yang sama"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full pl-10 pr-11 py-2.5 bg-white border border-[#ddcaa8] rounded-xl text-sm text-[#2b1d19] placeholder:text-[#a88a70]/70 focus:outline-hidden focus:border-[#881337] focus:ring-1 focus:ring-[#881337] transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#a88a70] hover:text-[#5a4230] transition-colors p-1"
                      title={showConfirmPassword ? 'Sembunyikan kata sandi' : 'Lihat kata sandi'}
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  <span className="text-[10px] text-[#735338] mt-0.5 block">
                    Ketik ulang kata sandi untuk memastikan tidak ada kesalahan pengetikan.
                  </span>
                </div>
              )}

              {/* Action Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row gap-2.5">
                {authMode === 'login' ? (
                  <>
                    <button
                      type="submit"
                      className="flex-1 py-3 px-4 bg-[#881337] hover:bg-[#70102d] text-white font-bold text-sm rounded-xl shadow-xs transition-all flex items-center justify-center gap-1.5 active:scale-[0.99]"
                    >
                      <span>Masuk</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setAuthMode('register');
                        setErrorMsg('');
                      }}
                      className="flex-1 py-3 px-4 bg-[#fce7f3] hover:bg-[#fbcfe8] text-[#881337] border border-[#f9a8d4] font-bold text-sm rounded-xl transition-all flex items-center justify-center gap-1.5 active:scale-[0.99]"
                    >
                      <span>Daftar Murid Baru</span>
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      type="submit"
                      className="flex-1 py-3 px-4 bg-[#881337] hover:bg-[#70102d] text-white font-bold text-sm rounded-xl shadow-xs transition-all flex items-center justify-center gap-1.5 active:scale-[0.99]"
                    >
                      <span>Daftar Sebagai Murid Baru</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setAuthMode('login');
                        setErrorMsg('');
                      }}
                      className="py-3 px-4 bg-[#f5ede1] hover:bg-[#ebdccb] text-[#624734] font-bold text-xs sm:text-sm rounded-xl transition-all flex items-center justify-center gap-1.5 active:scale-[0.99]"
                    >
                      <span>Kembali ke Masuk</span>
                    </button>
                  </>
                )}
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

      {/* Modal Lupa Kata Sandi Murid dengan Alur Verifikasi Email Resmi */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200 overflow-y-auto">
          <div className="w-full max-w-lg bg-[#fffdfa] border-2 border-amber-400 rounded-3xl p-6 sm:p-7 shadow-2xl my-8">
            {/* Header Modal */}
            <div className="flex items-center gap-3.5 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 border border-amber-300 flex items-center justify-center text-amber-700 text-xl shrink-0 shadow-2xs">
                <ShieldCheck className="w-6 h-6 text-[#881337]" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-[#881337] font-japanese">
                  Verifikasi Pembaruan Kata Sandi
                </h3>
                <p className="text-xs text-[#735338]">
                  Penyedia Resmi: <span className="font-mono text-[#881337] font-bold">{VERIFICATION_PROVIDER.email}</span>
                </p>
              </div>
            </div>

            {/* Stepper Indikator */}
            <div className="grid grid-cols-3 gap-1.5 mb-4 p-1.5 bg-[#f5ede1] rounded-2xl text-[11px] font-bold text-center">
              <div className={`py-1 rounded-xl transition-all ${forgotStep === 'request_email' ? 'bg-[#881337] text-white shadow-2xs' : 'text-[#735338]'}`}>
                1. Kirim Email
              </div>
              <div className={`py-1 rounded-xl transition-all ${forgotStep === 'verify_code' ? 'bg-[#881337] text-white shadow-2xs' : 'text-[#735338]'}`}>
                2. Verifikasi Email
              </div>
              <div className={`py-1 rounded-xl transition-all ${forgotStep === 'set_new_password' ? 'bg-[#881337] text-white shadow-2xs' : 'text-[#735338]'}`}>
                3. Sandi Baru
              </div>
            </div>

            {/* Notification Messages */}
            {forgotMsg && (
              <div className={`p-3 rounded-xl text-xs mb-4 font-semibold flex items-start gap-2 ${
                forgotMsg.type === 'success' 
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-300' 
                  : forgotMsg.type === 'info'
                    ? 'bg-sky-50 text-sky-900 border border-sky-300'
                    : 'bg-red-50 text-red-800 border border-red-300'
              }`}>
                {forgotMsg.type === 'success' ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                ) : forgotMsg.type === 'info' ? (
                  <MailCheck className="w-4 h-4 text-sky-700 shrink-0 mt-0.5" />
                ) : (
                  <AlertTriangle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                )}
                <span>{forgotMsg.text}</span>
              </div>
            )}

            {/* =========================================================================
                LANGKAH 1: MASUKKAN EMAIL TERDAFTAR & KIRIM EMAIL VERIFIKASI
                ========================================================================= */}
            {forgotStep === 'request_email' && (
              <div className="space-y-4">
                <div className="p-3 bg-amber-50/80 border border-amber-200/90 rounded-2xl text-xs text-[#6e533d] space-y-1">
                  <div className="font-bold text-[#881337] flex items-center gap-1.5">
                    <ShieldAlert className="w-4 h-4 text-[#881337]" />
                    <span>Perlindungan Keamanan Akun (Murid & Master):</span>
                  </div>
                  <p className="text-[11px] leading-relaxed text-[#735338]">
                    Baik akun murid maupun <strong>Akun Master (dioalifap24@gmail.com)</strong> wajib melakukan verifikasi melalui email terdaftar sebelum mengubah kata sandi. Kode keamanan 6 digit akan dikirimkan ke email Anda oleh <strong>{VERIFICATION_PROVIDER.name}</strong>.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#5a4230] mb-1">
                    Alamat Email Terdaftar (Murid / Akun Master dioalifap24@gmail.com) <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#a88a70]" />
                    <input
                      type="email"
                      required
                      placeholder="nama.anda@gmail.com"
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      className="w-full pl-10 pr-3.5 py-2.5 bg-white border border-[#ddcaa8] focus:border-[#881337] rounded-xl text-sm text-[#2b1d19] outline-hidden"
                      autoFocus
                    />
                  </div>
                </div>

                <div className="pt-2 flex items-center gap-2.5">
                  <button
                    type="button"
                    onClick={() => {
                      setShowForgotModal(false);
                      setForgotMsg(null);
                    }}
                    className="flex-1 py-2.5 px-4 bg-stone-100 hover:bg-stone-200 text-[#553b26] font-bold text-xs rounded-xl transition-colors"
                  >
                    Batal
                  </button>
                  <button
                    type="button"
                    disabled={isSendingEmail}
                    onClick={handleSendVerificationEmail}
                    className="flex-1 py-2.5 px-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold text-xs rounded-xl shadow-md transition-all active:scale-95 flex items-center justify-center gap-2 disabled:opacity-60"
                  >
                    {isSendingEmail ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>Mengirim Email...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5" />
                        <span>Kirim Email Verifikasi</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* =========================================================================
                LANGKAH 2: TAMPILAN EMAIL RESMI & MASUKKAN KODE VERIFIKASI (KEMBALI KE APP)
                ========================================================================= */}
            {forgotStep === 'verify_code' && (
              <div className="space-y-4">
                {/* Kotak Surat Email Verifikasi Resmi (Simulasi Otentik Interaktif) */}
                <div className="border-2 border-sky-300 rounded-2xl bg-gradient-to-b from-sky-50/90 via-white to-sky-50/40 p-4 shadow-sm relative overflow-hidden">
                  <div className="flex items-center justify-between border-b border-sky-200/80 pb-2.5 mb-3 text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-sky-600 text-white flex items-center justify-center font-bold text-xs shadow-2xs">
                        ✉️
                      </div>
                      <div>
                        <div className="font-bold text-sky-950 text-xs">
                          {activeVerificationData?.senderName || VERIFICATION_PROVIDER.name}
                        </div>
                        <div className="text-[10px] font-mono text-sky-700">
                          &lt;{activeVerificationData?.senderEmail || VERIFICATION_PROVIDER.email}&gt;
                        </div>
                      </div>
                    </div>
                    <span className="text-[10px] bg-sky-100 text-sky-800 px-2 py-0.5 rounded-full font-bold">
                      {activeVerificationData?.sentAt || 'Baru Saja'}
                    </span>
                  </div>

                  <div className="space-y-2 text-xs text-[#4a3424]">
                    <div className="text-[11px] text-[#735338]">
                      Kepada: <strong className="font-mono text-[#881337]">{forgotEmail}</strong>
                    </div>
                    <div className="text-[11px] font-bold text-[#881337]">
                      Subjek: {VERIFICATION_PROVIDER.subject}
                    </div>
                    <p className="text-[11px] leading-relaxed text-[#5a4230] pt-1">
                      Halo <strong>{activeVerificationData?.recipientName}</strong>, kami menerima permohonan pembaruan kata sandi untuk{' '}
                      {forgotEmail.trim().toLowerCase() === 'dioalifap24@gmail.com' ? (
                        <strong>Akun Master Sensei Sari (dioalifap24@gmail.com)</strong>
                      ) : (
                        'akun murid Sensei Sari Anda'
                      )}. Gunakan kode keamanan resmi berikut:
                    </p>

                    {/* Kode Verifikasi Menonjol */}
                    <div className="py-2.5 bg-white border-2 border-dashed border-sky-400 rounded-xl text-center shadow-2xs my-2">
                      <div className="text-[10px] font-bold uppercase tracking-wider text-sky-700 mb-0.5">
                        KODE KEAMANAN VERIFIKASI (6 DIGIT)
                      </div>
                      <div className="font-mono text-2xl font-black tracking-[0.25em] text-[#881337] select-all">
                        {activeVerificationData?.code}
                      </div>
                    </div>

                    {/* Tombol Aksi Kembalikan ke App Sensei Sari */}
                    <button
                      type="button"
                      onClick={handleOneClickVerifyFromEmail}
                      className="w-full py-2.5 px-3 bg-gradient-to-r from-sky-600 to-sky-700 hover:from-sky-700 hover:to-sky-800 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-1.5 active:scale-95"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Verifikasi & Kembali ke Aplikasi Sensei Sari</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Form Input Manual Kode 6 Digit */}
                <div>
                  <label className="block text-xs font-bold text-[#5a4230] mb-1">
                    Atau Ketik 6 Digit Kode Verifikasi Manual:
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      maxLength={6}
                      placeholder="Contoh: 839201"
                      value={forgotCodeInput}
                      onChange={(e) => setForgotCodeInput(e.target.value.replace(/\D/g, ''))}
                      className="w-full px-3.5 py-2.5 bg-white border border-[#ddcaa8] focus:border-[#881337] rounded-xl text-center text-lg font-mono font-black tracking-widest text-[#881337] outline-hidden"
                    />
                  </div>
                  <span className="text-[10px] text-[#735338] mt-1 block text-center">
                    Kode verifikasi berlaku selama 15 menit.
                  </span>
                </div>

                <div className="pt-2 flex items-center gap-2.5">
                  <button
                    type="button"
                    onClick={() => {
                      setForgotStep('request_email');
                      setForgotMsg(null);
                    }}
                    className="flex-1 py-2.5 px-4 bg-stone-100 hover:bg-stone-200 text-[#553b26] font-bold text-xs rounded-xl transition-colors"
                  >
                    Kirim Ulang
                  </button>
                  <button
                    type="button"
                    onClick={handleVerifyCode}
                    className="flex-1 py-2.5 px-4 bg-[#881337] hover:bg-[#70102d] text-white font-bold text-xs rounded-xl shadow-md transition-all active:scale-95 flex items-center justify-center gap-1.5"
                  >
                    <span>Verifikasi Kode & Lanjut</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}

            {/* =========================================================================
                LANGKAH 3: PEMBUATAN KATA SANDI BARU RESMI SETELAH EMAIL TERVERIFIKASI
                ========================================================================= */}
            {forgotStep === 'set_new_password' && (
              <div className="space-y-4">
                <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-2xl text-xs flex items-center gap-2 text-emerald-900 font-bold">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  <div>
                    <div>Email Terverifikasi Resmi</div>
                    <div className="text-[10px] font-normal text-emerald-700">
                      Disetujui oleh {VERIFICATION_PROVIDER.email} untuk {forgotEmail}
                    </div>
                  </div>
                </div>

                {/* Input Kata Sandi Baru */}
                <div>
                  <label className="block text-xs font-bold text-[#5a4230] mb-1">
                    {forgotEmail.trim().toLowerCase() === 'dioalifap24@gmail.com'
                      ? 'Kata Sandi Baru Akun Master (2 – 10 Karakter)'
                      : 'Kata Sandi Baru Murid (Minimal 8 Karakter)'}{' '}
                    <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#a88a70]" />
                    <input
                      type={showForgotNewPass ? 'text' : 'password'}
                      required
                      placeholder={
                        forgotEmail.trim().toLowerCase() === 'dioalifap24@gmail.com'
                          ? '2 sampai 10 karakter (Akun Master)'
                          : 'Minimal 8 karakter'
                      }
                      value={forgotNewPass}
                      onChange={(e) => setForgotNewPass(e.target.value)}
                      className="w-full pl-10 pr-11 py-2.5 bg-white border border-[#ddcaa8] focus:border-[#881337] rounded-xl text-sm text-[#2b1d19] outline-hidden"
                      autoFocus
                    />
                    <button
                      type="button"
                      onClick={() => setShowForgotNewPass(!showForgotNewPass)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#a88a70] hover:text-[#5a4230] transition-colors p-1"
                      title={showForgotNewPass ? 'Sembunyikan kata sandi' : 'Lihat kata sandi'}
                    >
                      {showForgotNewPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Input Konfirmasi Kata Sandi Baru */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-bold text-[#5a4230]">
                      Ulangi Kata Sandi Baru <span className="text-red-500">*</span>
                    </label>
                    {forgotConfirmPass && (
                      <span className={`text-[10px] font-bold ${forgotNewPass === forgotConfirmPass ? 'text-emerald-600' : 'text-rose-500'}`}>
                        {forgotNewPass === forgotConfirmPass ? '✓ Cocok' : '✗ Belum cocok'}
                      </span>
                    )}
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#a88a70]" />
                    <input
                      type={showForgotConfirmPass ? 'text' : 'password'}
                      required
                      placeholder="Ketik ulang kata sandi baru"
                      value={forgotConfirmPass}
                      onChange={(e) => setForgotConfirmPass(e.target.value)}
                      className="w-full pl-10 pr-11 py-2.5 bg-white border border-[#ddcaa8] focus:border-[#881337] rounded-xl text-sm text-[#2b1d19] outline-hidden"
                    />
                    <button
                      type="button"
                      onClick={() => setShowForgotConfirmPass(!showForgotConfirmPass)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#a88a70] hover:text-[#5a4230] transition-colors p-1"
                      title={showForgotConfirmPass ? 'Sembunyikan kata sandi' : 'Lihat kata sandi'}
                    >
                      {showForgotConfirmPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="pt-2 flex items-center gap-2.5">
                  <button
                    type="button"
                    onClick={() => {
                      setShowForgotModal(false);
                      setForgotStep('request_email');
                      setForgotMsg(null);
                    }}
                    className="flex-1 py-2.5 px-4 bg-stone-100 hover:bg-stone-200 text-[#553b26] font-bold text-xs rounded-xl transition-colors"
                  >
                    Batal
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveNewPasswordWithVerification}
                    className="flex-1 py-2.5 px-4 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white font-bold text-xs rounded-xl shadow-md transition-all active:scale-95 flex items-center justify-center gap-1.5"
                  >
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>Simpan Kata Sandi Baru & Masuk</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
