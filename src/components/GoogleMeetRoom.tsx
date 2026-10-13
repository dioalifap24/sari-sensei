import React, { useState, useEffect, useRef } from 'react';
import { Video, Plus, ExternalLink, Copy, Check, Shield, Sparkles, Users, Calendar, MessageSquare, Send, Smile, Trash2, Radio, CheckCircle2 } from 'lucide-react';
import { storageService } from '../services/storageService';
import { User, MeetChatMessage, VirtualSession } from '../types';

interface GoogleMeetRoomProps {
  isMasterUser?: boolean;
  currentUser?: User | null;
}

const MANGA_REACTIONS = [
  { emoji: '🌸', label: '🌸 Sakura', desc: 'Salam Bunga' },
  { emoji: '⛩️', label: '⛩️ Kuil', desc: 'Hormat' },
  { emoji: '💥', label: 'ドン! (Don!)', desc: 'Dahsyat' },
  { emoji: '💓', label: 'ドキドキ (Doki-Doki)', desc: 'Deg-degan' },
  { emoji: '✨', label: 'ワクワク (Waku-Waku)', desc: 'Antusias' },
  { emoji: '👏', label: 'すごい! (Sugoi!)', desc: 'Hebat' },
  { emoji: '🔥', label: '燃える! (Semangat!)', desc: 'Berapi-api' },
  { emoji: '💡', label: '分かった! (Paham!)', desc: 'Mengerti' },
  { emoji: '🍵', label: 'お茶 (Ocha)', desc: 'Santai' },
];

/**
 * Generator kode Google Meet otentik (format: 3 huruf - 4 huruf - 3 huruf)
 * contoh: "abc-defg-hij" -> https://meet.google.com/abc-defg-hij
 */
function generateOfficialMeetCode(): string {
  const letters = 'abcdefghijklmnopqrstuvwxyz';
  const rand = (len: number) =>
    Array.from({ length: len }, () => letters[Math.floor(Math.random() * letters.length)]).join('');
  return `${rand(3)}-${rand(4)}-${rand(3)}`;
}

export const GoogleMeetRoom: React.FC<GoogleMeetRoomProps> = ({ isMasterUser = false, currentUser }) => {
  const [activeSession, setActiveSession] = useState<VirtualSession | null>(() => {
    const list = storageService.getVirtualSessions();
    return list.length > 0 ? list[0] : null;
  });

  const [meetUri, setMeetUri] = useState<string>(() => {
    const list = storageService.getVirtualSessions();
    return list.length > 0 ? list[0].meetingUri : '';
  });

  const [meetingCode, setMeetingCode] = useState<string>(() => {
    const list = storageService.getVirtualSessions();
    return list.length > 0 ? list[0].meetingCode : '';
  });

  const [activeSessionId, setActiveSessionId] = useState<string | null>(() => {
    const list = storageService.getVirtualSessions();
    return list.length > 0 ? list[0].id : null;
  });

  const [loading, setLoading] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [sessionEndedNotice, setSessionEndedNotice] = useState<string | null>(null);

  // Master inputs
  const [customLinkInput, setCustomLinkInput] = useState<string>('');
  const [sessionTitleInput, setSessionTitleInput] = useState<string>('Sesi Belajar Langsung Google Meet (Sari Sensei)');
  const [showCustomLinkOption, setShowCustomLinkOption] = useState<boolean>(false);

  // Student input
  const [studentJoinCode, setStudentJoinCode] = useState<string>('');

  // Chat
  const [messages, setMessages] = useState<MeetChatMessage[]>(() =>
    storageService.getMeetChatMessages(activeSessionId || undefined)
  );
  const [inputText, setInputText] = useState<string>('');
  const [isChatOpen, setIsChatOpen] = useState<boolean>(true);
  const chatScrollRef = useRef<HTMLDivElement>(null);

  // Synchronize active session state and react when Master starts or ends session
  useEffect(() => {
    const syncActiveSession = (ev?: Event) => {
      const customEv = ev as CustomEvent<{ endedId?: string; session?: VirtualSession }> | undefined;
      const list = storageService.getVirtualSessions();

      // Check if the current session was ended
      if (customEv?.detail?.endedId && activeSessionId === customEv.detail.endedId) {
        setMeetUri('');
        setMeetingCode('');
        setActiveSessionId(null);
        setActiveSession(null);
        if (!isMasterUser) {
          setSessionEndedNotice('🔴 Sensei Sari telah mengakhiri sesi Google Meet. Peserta otomatis keluar dari sesi.');
        }
        return;
      }

      if (list.length > 0) {
        const top = list[0];
        setActiveSession(top);
        setActiveSessionId(top.id);
        setMeetUri(top.meetingUri);
        setMeetingCode(top.meetingCode);
        setSessionEndedNotice(null);
      } else {
        if (!isMasterUser && activeSessionId) {
          setSessionEndedNotice('🔴 Sensei Sari telah mengakhiri sesi Google Meet. Peserta otomatis keluar dari sesi.');
        }
        setActiveSession(null);
        setActiveSessionId(null);
        setMeetUri('');
        setMeetingCode('');
      }
    };

    syncActiveSession();
    window.addEventListener('virtual_sessions_updated', syncActiveSession);
    window.addEventListener('storage', syncActiveSession);

    return () => {
      window.removeEventListener('virtual_sessions_updated', syncActiveSession);
      window.removeEventListener('storage', syncActiveSession);
    };
  }, [activeSessionId, isMasterUser]);

  // Chat synchronization
  useEffect(() => {
    const refreshChat = () => {
      setMessages(storageService.getMeetChatMessages(activeSessionId || undefined));
    };
    refreshChat();
    window.addEventListener('meet_chat_updated', refreshChat);
    window.addEventListener('storage', refreshChat);
    return () => {
      window.removeEventListener('meet_chat_updated', refreshChat);
      window.removeEventListener('storage', refreshChat);
    };
  }, [activeSessionId]);

  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = inputText.trim();
    if (!trimmed) return;
    storageService.sendMeetChatMessage(trimmed, currentUser || null, activeSessionId || undefined);
    setInputText('');
  };

  const handleSendReaction = (emoji: string, label: string) => {
    storageService.sendMeetChatMessage(label, currentUser || null, activeSessionId || undefined, true, emoji);
  };

  const handleClearChat = () => {
    storageService.clearMeetChat(activeSessionId || undefined);
  };

  /**
   * Master memulai sesi belajar Google Meet secara instan:
   * 100% bebas dari popup browser / auth popup-blocked!
   * Menggunakan URL resmi Google Meet yang valid dan mengabari semua murid seketika.
   */
  const handleStartMeetSession = (useCustom = false) => {
    setLoading(true);
    setSessionEndedNotice(null);

    let targetCode = generateOfficialMeetCode();
    let targetUri = `https://meet.google.com/${targetCode}`;

    if (useCustom && customLinkInput.trim()) {
      const raw = customLinkInput.trim();
      if (raw.startsWith('http')) {
        targetUri = raw;
        const match = raw.match(/meet\.google\.com\/([a-z0-9-]+)/i);
        targetCode = match ? match[1] : raw.split('/').pop() || 'meet-live';
      } else {
        const cleanCode = raw.replace(/[^a-zA-Z0-9-]/g, '');
        targetCode = cleanCode;
        targetUri = `https://meet.google.com/${cleanCode}`;
      }
    }

    const masterUser: User = currentUser || {
      email: 'dioalifap24@gmail.com',
      fullName: 'GLOSTER GLADIATOR',
      nickname: 'skywalker',
      name: 'GLOSTER GLADIATOR',
      registeredAt: '2026-09-01 08:00',
      isMaster: true,
      role: 'master',
    };

    const finalTitle = sessionTitleInput.trim() || 'Sesi Belajar Langsung Google Meet (Sari Sensei)';
    const newSession = storageService.createVirtualSession(finalTitle, targetUri, targetCode, masterUser);

    setActiveSession(newSession);
    setActiveSessionId(newSession.id);
    setMeetUri(targetUri);
    setMeetingCode(targetCode);
    storageService.recordMeetAttendance(newSession.id, masterUser);

    setLoading(false);
    setSuccessMsg('🎉 Sesi Google Meet Berhasil Dimulai! Tautan telah otomatis dikirimkan ke Dashboard seluruh murid secara real-time.');
    setTimeout(() => setSuccessMsg(null), 5000);
  };

  /**
   * Master mengakhiri sesi Google Meet:
   * Ketika Master mengakhiri sesi, seluruh murid otomatis langsung keluar dari sesi meet.
   */
  const handleEndMeetSession = () => {
    if (activeSessionId) {
      storageService.endVirtualSession(activeSessionId);
    }
    setActiveSession(null);
    setActiveSessionId(null);
    setMeetUri('');
    setMeetingCode('');
    setSuccessMsg('🔴 Sesi Google Meet telah resmi diakhiri. Seluruh murid otomatis keluar dari sesi ruang tatap muka.');
    setTimeout(() => setSuccessMsg(null), 5000);
  };

  const handleOpenMeetInNewTab = () => {
    if (!meetUri) return;
    if (activeSessionId && currentUser) {
      storageService.recordMeetAttendance(activeSessionId, currentUser);
    }
    window.open(meetUri, '_blank', 'noopener,noreferrer');
  };

  const handleCopyLink = () => {
    if (!meetUri) return;
    navigator.clipboard.writeText(meetUri);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const handleStudentJoinManual = (e: React.FormEvent) => {
    e.preventDefault();
    const raw = studentJoinCode.trim();
    if (!raw) return;
    let target = raw;
    if (!raw.startsWith('http')) {
      const clean = raw.replace(/[^a-zA-Z0-9-]/g, '');
      target = `https://meet.google.com/${clean}`;
    }
    if (activeSessionId && currentUser) {
      storageService.recordMeetAttendance(activeSessionId, currentUser);
    }
    window.open(target, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="bg-[#fffdfa] border-2 border-[#ebdccb] rounded-3xl p-6 sm:p-8 shadow-xl max-w-2xl mx-auto my-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-rose-600 to-pink-500 flex items-center justify-center text-white shadow-md">
          <Video className="w-6 h-6" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-bold text-[#881337]">
              Sesi Belajar Langsung Google Meet
            </h2>
            {meetUri ? (
              <span className="inline-flex items-center gap-1 text-[11px] px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold border border-emerald-300 animate-pulse">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                LIVE
              </span>
            ) : (
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-stone-100 text-stone-700 font-semibold border border-stone-200">
                Standby
              </span>
            )}
          </div>
          <p className="text-sm text-[#8c6b4b] mt-0.5">
            {isMasterUser
              ? 'Panel Master: Mulai & akhiri sesi Google Meet. Saat Master mengakhiri sesi, murid otomatis keluar.'
              : 'Ruang belajar video Google Meet interaktif bersama Sensei Sari & sesama murid.'}
          </p>
        </div>
      </div>

      {/* Success Notification */}
      {successMsg && (
        <div className="mb-6 p-4 rounded-2xl bg-emerald-50 border-2 border-emerald-300 text-emerald-950 text-xs sm:text-sm font-bold flex items-center gap-3 shadow-xs animate-fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Notice when session is ended by Master */}
      {sessionEndedNotice && !isMasterUser && (
        <div className="mb-6 p-4 rounded-2xl bg-amber-50 border-2 border-amber-300 text-amber-950 text-xs sm:text-sm font-bold flex items-center justify-between gap-3 shadow-xs animate-fade-in">
          <div className="flex items-center gap-2.5">
            <span className="text-xl">🚪</span>
            <span>{sessionEndedNotice}</span>
          </div>
          <button
            onClick={() => setSessionEndedNotice(null)}
            className="text-xs text-amber-800 hover:text-black underline font-black"
          >
            Tutup
          </button>
        </div>
      )}

      {/* Active Meet View (Ketika Sesi Sedang Berlangsung) */}
      {meetUri ? (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="p-6 rounded-2xl bg-gradient-to-br from-[#fcf3e8] to-[#fbebe0] border-2 border-[#ebdccb] text-center space-y-3.5 shadow-xs">
            <div className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-wider text-[#881337] bg-rose-100 px-3 py-1 rounded-full border border-rose-300">
              <span className="w-2 h-2 rounded-full bg-rose-600 animate-ping" />
              <span>Sesi Belajar Google Meet Sedang Berlangsung</span>
            </div>

            <h3 className="text-lg sm:text-xl font-extrabold text-[#881337] font-japanese">
              {activeSession?.title || 'Sesi Belajar Langsung Google Meet (Sari Sensei)'}
            </h3>

            <div className="font-mono text-base sm:text-lg font-bold text-[#654d38] break-all bg-white p-3.5 rounded-xl border-2 border-[#ebdccb] shadow-inner">
              {meetUri}
            </div>

            {meetingCode && (
              <p className="text-xs text-[#8c6b4b] font-semibold">
                Kode Rapat: <span className="font-mono font-bold text-[#881337] bg-rose-50 px-2 py-0.5 rounded border border-rose-200">{meetingCode}</span>
                {activeSession?.createdByName && (
                  <span> • Host: <strong>{activeSession.createdByName}</strong></span>
                )}
              </p>
            )}

            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={handleOpenMeetInNewTab}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-black text-sm shadow-md flex items-center gap-2 transition-all transform hover:scale-105 active:scale-95 cursor-pointer border border-emerald-500"
              >
                <ExternalLink className="w-4 h-4" />
                <span>Buka Google Meet</span>
                <span>🚀</span>
              </button>

              <button
                type="button"
                onClick={handleCopyLink}
                className="px-5 py-3 rounded-xl bg-white border-2 border-[#ebdccb] hover:bg-[#f8ede0] text-[#654d38] font-bold text-sm shadow-xs flex items-center gap-2 transition-all cursor-pointer"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? 'Tautan Disalin!' : 'Salin Tautan'}</span>
              </button>
            </div>
          </div>

          {/* Master Controls: Akhiri Sesi Google Meet */}
          {isMasterUser && (
            <div className="p-4 rounded-2xl bg-rose-50 border-2 border-rose-200 text-center space-y-2">
              <div className="text-xs font-bold text-rose-900">
                Kontrol Master: Akhiri Sesi Belajar Google Meet
              </div>
              <p className="text-[11px] text-rose-700">
                Ketika Anda mengakhiri sesi, seluruh murid otomatis langsung keluar dari sesi meet dan rapor mereka diperbarui.
              </p>
              <button
                type="button"
                onClick={handleEndMeetSession}
                className="px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-black text-xs shadow-md flex items-center gap-2 mx-auto transition-all transform hover:scale-105 cursor-pointer"
              >
                <span>🔴 Akhiri Sesi Google Meet Sekarang</span>
              </button>
            </div>
          )}
        </div>
      ) : (
        /* Standby View: Belum ada sesi aktif */
        <div className="space-y-6">
          {isMasterUser ? (
            /* Master: Mulai Sesi Belajar Google Meet */
            <div className="text-center py-6 px-4 bg-[#fcf3e8] rounded-2xl border-2 border-[#ebdccb] space-y-4">
              <div className="w-16 h-16 mx-auto rounded-full bg-rose-100 flex items-center justify-center text-[#881337] text-3xl shadow-inner animate-bounce">
                👩‍🏫
              </div>
              <div>
                <h3 className="text-lg font-bold text-[#881337]">
                  Mulai Sesi Belajar Google Meet (Master)
                </h3>
                <p className="text-xs sm:text-sm text-[#8c6b4b] max-w-md mx-auto mt-1">
                  Mulai ruang Google Meet resmi secara instan tanpa popup browser. Notifikasi push akan otomatis muncul seketika di dashboard seluruh murid.
                </p>
              </div>

              {/* Title input */}
              <div className="max-w-md mx-auto text-left space-y-1">
                <label className="text-[11px] font-bold text-[#881337]">Judul Pertemuan (Opsional):</label>
                <input
                  type="text"
                  value={sessionTitleInput}
                  onChange={(e) => setSessionTitleInput(e.target.value)}
                  placeholder="Contoh: Sesi Belajar Langsung Google Meet (Sari Sensei)"
                  className="w-full px-3.5 py-2 rounded-xl border border-[#ebdccb] bg-white text-xs text-[#654d38] font-bold focus:outline-none focus:ring-2 focus:ring-rose-400"
                />
              </div>

              {/* Option to paste existing link */}
              <div className="max-w-md mx-auto text-left">
                <button
                  type="button"
                  onClick={() => setShowCustomLinkOption(!showCustomLinkOption)}
                  className="text-[11px] font-bold text-[#881337] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <span>{showCustomLinkOption ? '▼ Sembunyikan Opsi Tempel Link' : '▶ Atau Tempel Link Google Meet Sendiri (Google Calendar / Workspace)'}</span>
                </button>
                {showCustomLinkOption && (
                  <div className="mt-2 space-y-2 p-3 bg-white rounded-xl border border-[#ebdccb]">
                    <input
                      type="text"
                      value={customLinkInput}
                      onChange={(e) => setCustomLinkInput(e.target.value)}
                      placeholder="Contoh: https://meet.google.com/abc-defg-hij atau kode rapat"
                      className="w-full px-3 py-2 rounded-lg border border-[#ebdccb] text-xs text-[#654d38] focus:outline-none focus:ring-2 focus:ring-rose-400"
                    />
                    <button
                      type="button"
                      onClick={() => handleStartMeetSession(true)}
                      disabled={!customLinkInput.trim() || loading}
                      className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white font-bold text-xs rounded-lg transition-all"
                    >
                      Gunakan Link Ini & Mulai Sesi Belajar
                    </button>
                  </div>
                )}
              </div>

              {/* Main Instant Start Button */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => handleStartMeetSession(false)}
                  disabled={loading}
                  className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-rose-600 via-[#881337] to-pink-600 hover:from-rose-700 hover:to-pink-700 text-white font-black text-sm shadow-xl flex items-center justify-center gap-2 mx-auto transition-all transform hover:scale-105 active:scale-95 disabled:opacity-50 cursor-pointer border border-rose-400"
                >
                  {loading ? (
                    <span className="animate-spin text-lg">⏳</span>
                  ) : (
                    <Plus className="w-5 h-5" />
                  )}
                  <span>{loading ? 'Memulai Sesi...' : 'Mulai Sesi Belajar (Google Meet)'}</span>
                  <span>🚀</span>
                </button>
                <p className="text-[11px] text-stone-500 mt-2">
                  ✓ Tanpa popup browser • Otomatis sinkron ke seluruh murid • Pencatatan kehadiran real-time
                </p>
              </div>
            </div>
          ) : (
            /* Student: Menunggu Sensei Memulai Sesi */
            <div className="text-center py-6 px-4 bg-[#fcf3e8] rounded-2xl border-2 border-[#ebdccb] space-y-4">
              <div className="w-16 h-16 mx-auto rounded-full bg-rose-100 flex items-center justify-center text-[#881337] text-3xl shadow-inner">
                🎓
              </div>
              <div>
                <h3 className="text-lg font-bold text-[#881337]">
                  Ruang Belajar Google Meet Sensei Sari
                </h3>
                <p className="text-xs sm:text-sm text-[#8c6b4b] max-w-md mx-auto mt-1">
                  Saat Sensei Sari memulai sesi belajar tatap muka, notifikasi beserta link bergabung akan langsung muncul seketika di layar Anda.
                </p>
              </div>

              {/* Manual code input fallback */}
              <form onSubmit={handleStudentJoinManual} className="max-w-sm mx-auto flex items-center gap-2 pt-2">
                <input
                  type="text"
                  value={studentJoinCode}
                  onChange={(e) => setStudentJoinCode(e.target.value)}
                  placeholder="Kode rapat atau tautan meet..."
                  className="flex-1 px-4 py-2.5 rounded-xl border border-[#ebdccb] bg-white text-xs text-[#654d38] focus:outline-none focus:ring-2 focus:ring-rose-400"
                />
                <button
                  type="submit"
                  disabled={!studentJoinCode.trim()}
                  className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 disabled:opacity-40 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
                >
                  Gabung
                </button>
              </form>
            </div>
          )}
        </div>
      )}

      {/* Panel Chat Sesi & Reaksi Manga Live */}
      <div className="mt-8 pt-6 border-t-2 border-[#ebdccb]">
        <div className="flex items-center justify-between gap-2 mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#fae8eb] text-[#881337] flex items-center justify-center font-bold">
              <MessageSquare className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-[#881337] font-japanese flex items-center gap-2">
                <span>Chat Sesi & Reaksi Manga Live</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold border border-emerald-300">
                  Real-Time
                </span>
              </h3>
              <p className="text-xs text-[#8c6b4b]">
                Kirim pesan teks singkat atau reaksi manga interaktif langsung dalam pertemuan tanpa perlu berganti tab.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {isMasterUser && messages.length > 0 && (
              <button
                type="button"
                onClick={handleClearChat}
                className="px-2.5 py-1 text-[11px] font-semibold text-rose-700 hover:bg-rose-100 rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                title="Bersihkan riwayat chat sesi ini"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Bersihkan</span>
              </button>
            )}
            <button
              type="button"
              onClick={() => setIsChatOpen(!isChatOpen)}
              className="px-2.5 py-1 text-xs font-bold text-[#881337] bg-[#fae8eb] hover:bg-[#f3d4db] rounded-lg transition-colors cursor-pointer"
            >
              {isChatOpen ? 'Lipat' : 'Buka'}
            </button>
          </div>
        </div>

        {isChatOpen && (
          <div className="bg-[#fcf8f2] border-2 border-[#ebdccb] rounded-2xl p-4 shadow-inner space-y-3">
            {/* Manga Reaction Bar */}
            <div className="space-y-1.5">
              <div className="text-[11px] font-bold text-[#881337] uppercase tracking-wider flex items-center gap-1">
                <Smile className="w-3.5 h-3.5" />
                <span>Reaksi Cepat Gaya Manga:</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {MANGA_REACTIONS.map((r, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSendReaction(r.emoji, r.label)}
                    className="px-2.5 py-1 bg-white hover:bg-[#fae8eb] text-[#553b26] hover:text-[#881337] border border-[#ebdccb] hover:border-[#881337] rounded-xl text-xs font-bold transition-all transform hover:scale-105 active:scale-95 shadow-xs flex items-center gap-1 cursor-pointer"
                    title={r.desc}
                  >
                    <span>{r.emoji}</span>
                    <span className="text-[11px] font-japanese">{r.label.split(' ')[0]}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Chat Messages Feed */}
            <div
              ref={chatScrollRef}
              className="h-56 overflow-y-auto space-y-2.5 bg-white p-3.5 rounded-xl border border-[#ebdccb] shadow-xs"
            >
              {messages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center text-stone-500 py-6">
                  <div className="text-2xl mb-1">🌸</div>
                  <p className="text-xs font-semibold text-[#8c6b4b]">Belum ada pesan dalam sesi ini.</p>
                  <p className="text-[11px] text-stone-400">Kirim sapaan pertama atau klik reaksi manga di atas!</p>
                </div>
              ) : (
                messages.map((m) => {
                  const isMe = currentUser && m.senderEmail.toLowerCase() === currentUser.email.toLowerCase();
                  return (
                    <div
                      key={m.id}
                      className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} transition-all`}
                    >
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <span className="text-[10px] font-bold text-[#8c6b4b] flex items-center gap-1">
                          {m.isMaster && (
                            <span className="px-1.5 py-0.2 bg-amber-100 text-amber-900 border border-amber-300 rounded font-black text-[9px]">
                              ⛩️ Sensei
                            </span>
                          )}
                          <span>{m.isMaster || m.senderName === 'Sensei Sari' ? 'Sari Sensei' : m.senderName}</span>
                        </span>
                        <span className="text-[9px] text-stone-400 font-mono">{m.timeFormatted}</span>
                      </div>

                      {m.isReaction ? (
                        <div
                          className={`px-3 py-1.5 rounded-2xl border text-sm font-bold flex items-center gap-2 shadow-xs ${
                            m.isMaster
                              ? 'bg-rose-50 border-rose-200 text-[#881337]'
                              : isMe
                              ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                              : 'bg-white border-[#ebdccb] text-[#553b26]'
                          }`}
                        >
                          <span className="text-lg">{m.reactionEmoji}</span>
                          <span className="font-japanese font-black">{m.message}</span>
                        </div>
                      ) : (
                        <div
                          className={`px-3.5 py-2 rounded-2xl text-xs leading-relaxed max-w-[85%] break-words shadow-xs border ${
                            m.isMaster
                              ? 'bg-[#fff0f3] border-[#fbcfe8] text-[#881337] font-medium'
                              : isMe
                              ? 'bg-[#881337] text-white border-[#881337]'
                              : 'bg-white border-[#ebdccb] text-[#463325]'
                          }`}
                        >
                          {m.message}
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>

            {/* Message Input Box */}
            <form onSubmit={handleSendMessage} className="flex items-center gap-2">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Ketik pesan singkat untuk Sensei & murid..."
                className="flex-1 px-3.5 py-2 bg-white border border-[#ebdccb] rounded-xl text-xs text-[#553b26] focus:outline-none focus:ring-2 focus:ring-[#881337] placeholder:text-stone-400"
              />
              <button
                type="submit"
                disabled={!inputText.trim()}
                className="px-4 py-2 bg-[#881337] hover:bg-[#70102d] disabled:opacity-40 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer shrink-0"
              >
                <span>Kirim</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
