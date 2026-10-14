import React, { useState, useEffect, useRef } from 'react';
import { Video, ExternalLink, Copy, Check, MessageSquare, Send, Smile, Trash2, CheckCircle2, AlertCircle } from 'lucide-react';
import { storageService } from '../services/storageService';
import * as firebaseService from '../services/firebaseService';
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
 * Mendeteksi platform & membersihkan format tautan rapat (Zoom vs Google Meet)
 */
function parseMeetingInput(rawInput: string, preferredPlatform: 'google_meet' | 'zoom'): {
  platform: 'google_meet' | 'zoom';
  uri: string;
  code: string;
} {
  const trimmed = rawInput.trim();

  // 1. Zoom Detection
  const isZoomUrl = trimmed.toLowerCase().includes('zoom.us');
  // Zoom ID biasanya berupa 9-11 digit angka
  const numericOnly = trimmed.replace(/[^0-9]/g, '');
  const isNumericZoomId = numericOnly.length >= 9 && numericOnly.length <= 11 && !trimmed.includes('meet.google');

  if (isZoomUrl || isNumericZoomId || (preferredPlatform === 'zoom' && trimmed)) {
    if (trimmed.startsWith('http')) {
      return {
        platform: 'zoom',
        uri: trimmed,
        code: numericOnly || trimmed.split('/').pop() || 'Zoom Meeting',
      };
    }
    const cleanId = numericOnly || trimmed.replace(/\s+/g, '');
    return {
      platform: 'zoom',
      uri: `https://zoom.us/j/${cleanId}`,
      code: cleanId,
    };
  }

  // 2. Google Meet Detection
  if (trimmed.startsWith('http')) {
    const match = trimmed.match(/meet\.google\.com\/([a-z0-9-]+)/i);
    const code = match ? match[1] : trimmed.split('/').pop() || 'Google Meet';
    return {
      platform: 'google_meet',
      uri: trimmed,
      code,
    };
  }

  // Raw Google Meet code (misal: "abc-defg-hij")
  const cleanCode = trimmed.toLowerCase().replace(/[^a-z0-9-]/g, '');
  return {
    platform: 'google_meet',
    uri: `https://meet.google.com/${cleanCode}`,
    code: cleanCode,
  };
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

  const [copied, setCopied] = useState<boolean>(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [sessionEndedNotice, setSessionEndedNotice] = useState<string | null>(null);

  // Master platform & link inputs
  const [platformChoice, setPlatformChoice] = useState<'google_meet' | 'zoom'>('google_meet');
  const [meetingCodeOrLinkInput, setMeetingCodeOrLinkInput] = useState<string>('');
  const [sessionTitleInput, setSessionTitleInput] = useState<string>('Sesi Belajar Langsung Virtual (Sari Sensei)');

  // Student manual input
  const [studentJoinInput, setStudentJoinInput] = useState<string>('');

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

      if (customEv?.detail?.endedId && activeSessionId === customEv.detail.endedId) {
        setMeetUri('');
        setMeetingCode('');
        setActiveSessionId(null);
        setActiveSession(null);
        if (!isMasterUser) {
          setSessionEndedNotice('🔴 Sari Sensei telah mengakhiri sesi belajar virtual. Peserta otomatis keluar dari sesi.');
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
          setSessionEndedNotice('🔴 Sari Sensei telah mengakhiri sesi belajar virtual. Peserta otomatis keluar dari sesi.');
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

  // Chat synchronization (Firestore)
  useEffect(() => {
    const unsubscribe = firebaseService.subscribeToChatMessages((newMessages) => {
      // Filter by sessionId if needed
      if (activeSessionId) {
        setMessages(newMessages.filter(m => m.sessionId === activeSessionId));
      } else {
        setMessages(newMessages);
      }
    });
    return () => unsubscribe();
  }, [activeSessionId]);

  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = inputText.trim();
    if (!trimmed) return;
    
    await firebaseService.sendChatMessage({
      sessionId: activeSessionId || 'general',
      senderName: isMasterUser ? 'Sari Sensei' : currentUser?.fullName || currentUser?.nickname || currentUser?.email?.split('@')[0] || 'Murid',
      senderEmail: currentUser?.email || 'anonymous@murid.com',
      isMaster: isMasterUser,
      message: trimmed,
      isReaction: false,
      timestamp: Date.now(),
      timeFormatted: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
    });
    setInputText('');
  };

  const handleSendReaction = async (emoji: string, label: string) => {
    await firebaseService.sendChatMessage({
      sessionId: activeSessionId || 'general',
      senderName: isMasterUser ? 'Sari Sensei' : currentUser?.fullName || currentUser?.nickname || currentUser?.email?.split('@')[0] || 'Murid',
      senderEmail: currentUser?.email || 'anonymous@murid.com',
      isMaster: isMasterUser,
      message: label,
      isReaction: true,
      reactionEmoji: emoji,
      timestamp: Date.now(),
      timeFormatted: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
    });
  };

  const handleClearChat = () => {
    storageService.clearMeetChat(activeSessionId || undefined);
  };

  /**
   * Master memulai sesi belajar virtual:
   * Menggunakan kode/tautan asli (Zoom atau Google Meet) yang dimiliki Sensei,
   * sehingga murid tidak mengalami error "Tidak ada rapat di Google".
   */
  const handleStartMeetSession = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorMsg(null);
    setSessionEndedNotice(null);

    const rawInput = meetingCodeOrLinkInput.trim();
    if (!rawInput) {
      setErrorMsg(
        platformChoice === 'zoom'
          ? 'Silakan masukkan Tautan atau ID Rapat Zoom Anda terlebih dahulu agar murid bisa bergabung!'
          : 'Silakan masukkan Tautan atau Kode Google Meet resmi Anda (atau klik tombol "Buat Rapat Baru di meet.google.com/new" di bawah) agar tidak muncul "Tidak ada rapat"!'
      );
      return;
    }

    const parsed = parseMeetingInput(rawInput, platformChoice);

    const masterUser: User = currentUser || {
      email: 'dioalifap24@gmail.com',
      fullName: 'GLOSTER GLADIATOR',
      nickname: 'skywalker',
      name: 'GLOSTER GLADIATOR',
      registeredAt: '2026-09-01 08:00',
      isMaster: true,
      role: 'master',
    };

    const platformLabel = parsed.platform === 'zoom' ? 'Zoom' : 'Google Meet';
    const finalTitle = sessionTitleInput.trim() || `Sesi Belajar Langsung ${platformLabel} (Sari Sensei)`;

    const newSession = storageService.createVirtualSession(
      finalTitle,
      parsed.uri,
      parsed.code,
      masterUser,
      parsed.platform
    );

    setActiveSession(newSession);
    setActiveSessionId(newSession.id);
    setMeetUri(parsed.uri);
    setMeetingCode(parsed.code);
    storageService.recordMeetAttendance(newSession.id, masterUser);

    setSuccessMsg(
      `🎉 Sesi ${platformLabel} Berhasil Dimulai! Tautan resmi telah disebarkan ke Dashboard murid secara langsung.`
    );
    setTimeout(() => setSuccessMsg(null), 6000);
  };

  const handleEndMeetSession = () => {
    if (activeSessionId) {
      storageService.endVirtualSession(activeSessionId);
    }
    setActiveSession(null);
    setActiveSessionId(null);
    setMeetUri('');
    setMeetingCode('');
    setSuccessMsg('🔴 Sesi belajar virtual telah resmi diakhiri. Seluruh murid otomatis keluar dari sesi.');
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
    const raw = studentJoinInput.trim();
    if (!raw) return;
    const parsed = parseMeetingInput(raw, 'google_meet');
    if (activeSessionId && currentUser) {
      storageService.recordMeetAttendance(activeSessionId, currentUser);
    }
    window.open(parsed.uri, '_blank', 'noopener,noreferrer');
  };

  const isCurrentZoom = activeSession?.platform === 'zoom' || meetUri.includes('zoom.us');

  return (
    <div className="bg-[#fffdfa] border-2 border-[#ebdccb] rounded-3xl p-6 sm:p-8 shadow-xl max-w-2xl mx-auto my-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-md ${
          isCurrentZoom ? 'bg-gradient-to-tr from-sky-600 to-blue-500' : 'bg-gradient-to-tr from-rose-600 to-pink-500'
        }`}>
          <Video className="w-6 h-6" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-bold text-[#881337]">
              Sesi Belajar Virtual (Google Meet / Zoom)
            </h2>
            {meetUri ? (
              <span className={`inline-flex items-center gap-1 text-[11px] px-2.5 py-0.5 rounded-full font-bold border animate-pulse ${
                isCurrentZoom
                  ? 'bg-blue-100 text-blue-900 border-blue-300'
                  : 'bg-emerald-100 text-emerald-800 border-emerald-300'
              }`}>
                <span className={`w-2 h-2 rounded-full animate-ping ${isCurrentZoom ? 'bg-blue-600' : 'bg-emerald-500'}`} />
                {isCurrentZoom ? 'LIVE ZOOM' : 'LIVE MEET'}
              </span>
            ) : (
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-stone-100 text-stone-700 font-semibold border border-stone-200">
                Standby
              </span>
            )}
          </div>
          <p className="text-sm text-[#8c6b4b] mt-0.5">
            {isMasterUser
              ? 'Panel Master: Masukkan tautan atau kode Zoom / Google Meet aktif Anda, lalu bagikan ke semua murid.'
              : 'Ruang tatap muka virtual bersama Sari Sensei & sesama murid (Mendukung Google Meet & Zoom).'}
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

      {/* Error Notification */}
      {errorMsg && (
        <div className="mb-6 p-4 rounded-2xl bg-rose-50 border-2 border-rose-300 text-rose-950 text-xs sm:text-sm font-bold flex items-center gap-3 shadow-xs animate-fade-in">
          <AlertCircle className="w-5 h-5 text-rose-700 shrink-0" />
          <span>{errorMsg}</span>
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
          <div className={`p-6 rounded-2xl border-2 text-center space-y-3.5 shadow-xs ${
            isCurrentZoom
              ? 'bg-gradient-to-br from-sky-50 to-blue-50 border-sky-300'
              : 'bg-gradient-to-br from-[#fcf3e8] to-[#fbebe0] border-[#ebdccb]'
          }`}>
            <div className={`inline-flex items-center gap-2 text-xs font-black uppercase tracking-wider px-3.5 py-1 rounded-full border ${
              isCurrentZoom
                ? 'bg-blue-100 text-blue-900 border-blue-300'
                : 'bg-rose-100 text-[#881337] border-rose-300'
            }`}>
              <span className={`w-2 h-2 rounded-full animate-ping ${isCurrentZoom ? 'bg-blue-600' : 'bg-rose-600'}`} />
              <span>Sesi {isCurrentZoom ? 'Zoom' : 'Google Meet'} Sedang Berlangsung</span>
            </div>

            <h3 className="text-lg sm:text-xl font-extrabold text-[#881337] font-japanese">
              {activeSession?.title || 'Sesi Belajar Langsung Virtual (Sari Sensei)'}
            </h3>

            <div className="font-mono text-base sm:text-lg font-bold text-[#654d38] break-all bg-white p-3.5 rounded-xl border-2 border-[#ebdccb] shadow-inner">
              {meetUri}
            </div>

            {meetingCode && (
              <p className="text-xs text-[#8c6b4b] font-semibold">
                Kode / ID Rapat: <span className="font-mono font-bold text-[#881337] bg-white px-2 py-0.5 rounded border border-[#ebdccb]">{meetingCode}</span>
                {activeSession?.createdByName && (
                  <span> • Host: <strong>{activeSession.createdByName}</strong></span>
                )}
              </p>
            )}

            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={handleOpenMeetInNewTab}
                className={`px-6 py-3 rounded-xl text-white font-black text-sm shadow-md flex items-center gap-2 transition-all transform hover:scale-105 active:scale-95 cursor-pointer border ${
                  isCurrentZoom
                    ? 'bg-gradient-to-r from-blue-600 to-sky-600 hover:from-blue-700 hover:to-sky-700 border-blue-500'
                    : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 border-emerald-500'
                }`}
              >
                <ExternalLink className="w-4 h-4" />
                <span>Buka {isCurrentZoom ? 'Zoom Meeting' : 'Google Meet'}</span>
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

          {/* Master Controls: Akhiri Sesi */}
          {isMasterUser && (
            <div className="p-4 rounded-2xl bg-rose-50 border-2 border-rose-200 text-center space-y-2">
              <div className="text-xs font-bold text-rose-900">
                Kontrol Master: Akhiri Sesi Belajar
              </div>
              <p className="text-[11px] text-rose-700">
                Ketika Anda mengakhiri sesi, seluruh murid otomatis langsung keluar dari sesi tatap muka dan rapor kehadiran mereka tersinkronisasi.
              </p>
              <button
                type="button"
                onClick={handleEndMeetSession}
                className="px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-black text-xs shadow-md flex items-center gap-2 mx-auto transition-all transform hover:scale-105 cursor-pointer"
              >
                <span>🔴 Akhiri Sesi Belajar Sekarang (Keluarkan Semua Murid)</span>
              </button>
            </div>
          )}
        </div>
      ) : (
        /* Standby View: Master membuat ruang dengan kode/link miliknya */
        <div className="space-y-6">
          {isMasterUser ? (
            <div className="py-6 px-4 sm:px-6 bg-[#fcf3e8] rounded-2xl border-2 border-[#ebdccb] space-y-5 text-left">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto rounded-full bg-rose-100 flex items-center justify-center text-[#881337] text-3xl shadow-inner mb-3">
                  👩‍🏫
                </div>
                <h3 className="text-lg sm:text-xl font-black text-[#881337]">
                  Mulai Sesi Belajar Virtual (Master)
                </h3>
                <p className="text-xs sm:text-sm text-[#8c6b4b] max-w-lg mx-auto mt-1">
                  Pilih platform rapat (Google Meet atau Zoom) dan masukkan tautan/kode rapat aktif Anda agar murid dapat langsung bergabung tanpa masalah <em>"Tidak ada rapat di Google"</em>.
                </p>
              </div>

              {/* Platform Selector Tabs */}
              <div className="flex items-center justify-center gap-2 p-1.5 bg-white border-2 border-[#ebdccb] rounded-2xl max-w-sm mx-auto shadow-xs">
                <button
                  type="button"
                  onClick={() => setPlatformChoice('google_meet')}
                  className={`flex-1 py-2 px-3 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    platformChoice === 'google_meet'
                      ? 'bg-[#881337] text-white shadow-xs'
                      : 'text-stone-700 hover:text-black hover:bg-stone-50'
                  }`}
                >
                  <span>🎥</span>
                  <span>Google Meet</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPlatformChoice('zoom')}
                  className={`flex-1 py-2 px-3 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    platformChoice === 'zoom'
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-stone-700 hover:text-black hover:bg-stone-50'
                  }`}
                >
                  <span>📹</span>
                  <span>Zoom Meeting</span>
                </button>
              </div>

              {/* Form Input */}
              <form onSubmit={handleStartMeetSession} className="space-y-4 max-w-lg mx-auto">
                {/* Meeting Code / URL Input */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-black text-stone-900 flex items-center gap-1">
                      <span>{platformChoice === 'zoom' ? 'ID Rapat atau Link Zoom:' : 'Kode atau Tautan Google Meet:'}</span>
                      <span className="text-red-500">*</span>
                    </label>

                    {/* Quick Button to generate real room in new tab if Master doesn't have one yet */}
                    {platformChoice === 'google_meet' ? (
                      <a
                        href="https://meet.google.com/new"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[11px] font-black text-[#881337] hover:underline flex items-center gap-1 bg-white px-2 py-0.5 rounded border border-[#ebdccb]"
                        title="Buka Google Meet untuk membuat ruang rapat baru resmi, lalu salin kodenya ke sini"
                      >
                        <span>🌐 Buat di meet.google.com/new ↗</span>
                      </a>
                    ) : (
                      <a
                        href="https://zoom.us/start/videomeeting"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[11px] font-black text-blue-700 hover:underline flex items-center gap-1 bg-white px-2 py-0.5 rounded border border-[#ebdccb]"
                        title="Buka Zoom untuk memulai rapat instan"
                      >
                        <span>🌐 Buka Zoom ↗</span>
                      </a>
                    )}
                  </div>

                  <input
                    type="text"
                    value={meetingCodeOrLinkInput}
                    onChange={(e) => {
                      const val = e.target.value;
                      setMeetingCodeOrLinkInput(val);
                      // Auto-detect platform jika input jelas-jelas Zoom atau Meet
                      if (val.toLowerCase().includes('zoom.us') || (val.replace(/[^0-9]/g, '').length >= 9 && !val.includes('meet.google'))) {
                        setPlatformChoice('zoom');
                      } else if (val.toLowerCase().includes('meet.google') || /[a-z]{3}-[a-z]{4}-[a-z]{3}/.test(val)) {
                        setPlatformChoice('google_meet');
                      }
                    }}
                    placeholder={
                      platformChoice === 'zoom'
                        ? 'Contoh: 839 1234 5678 atau https://zoom.us/j/83912345678'
                        : 'Contoh: abc-defg-hij atau https://meet.google.com/abc-defg-hij'
                    }
                    className="w-full px-4 py-3 bg-white border-2 border-stone-950 rounded-xl text-sm font-mono font-bold text-stone-900 shadow-[2px_2px_0px_#1c1917] focus:outline-none focus:ring-2 focus:ring-[#881337]"
                  />
                  <span className="text-[11px] text-stone-600 block mt-1">
                    {platformChoice === 'zoom'
                      ? '💡 Masukkan 9–11 digit nomor ID Rapat Zoom Anda, atau tempel tautan undangan Zoom lengkap.'
                      : '💡 Masukkan kode 10 huruf Google Meet Anda (misal: "abc-defg-hij") atau tempel link meet lengkap.'}
                  </span>
                </div>

                {/* Session Title Input */}
                <div>
                  <label className="text-xs font-black text-stone-900 mb-1 block">
                    Judul Sesi (Opsional):
                  </label>
                  <input
                    type="text"
                    value={sessionTitleInput}
                    onChange={(e) => setSessionTitleInput(e.target.value)}
                    placeholder="Contoh: Sesi Belajar Langsung Bersama Sari Sensei"
                    className="w-full px-3.5 py-2.5 bg-white border-2 border-stone-950 rounded-xl text-xs font-bold text-stone-900 shadow-[2px_2px_0px_#1c1917] focus:outline-none focus:ring-2 focus:ring-[#881337]"
                  />
                </div>

                {/* Submit Start Button */}
                <div className="pt-2">
                  <button
                    type="submit"
                    className={`w-full py-3.5 px-6 rounded-xl text-white font-black text-sm shadow-[3px_3px_0px_#1c1917] border-2 border-stone-950 transition-all transform hover:scale-[1.02] active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2 ${
                      platformChoice === 'zoom'
                        ? 'bg-gradient-to-r from-blue-600 to-sky-600 hover:from-blue-700 hover:to-sky-700'
                        : 'bg-gradient-to-r from-rose-700 via-[#881337] to-amber-700 hover:from-rose-800 hover:to-amber-800'
                    }`}
                  >
                    <span>🚀 Mulai Sesi Belajar & Bagikan ke Seluruh Murid</span>
                  </button>
                  <p className="text-[11px] text-center text-stone-500 mt-2 font-medium">
                    ✓ Link otomatis tersinkron ke dashboard murid • Pop-up notifikasi instan • Kehadiran tercatat otomatis
                  </p>
                </div>
              </form>
            </div>
          ) : (
            /* Student: Menunggu Sensei Memulai Sesi */
            <div className="text-center py-6 px-4 bg-[#fcf3e8] rounded-2xl border-2 border-[#ebdccb] space-y-4">
              <div className="w-16 h-16 mx-auto rounded-full bg-rose-100 flex items-center justify-center text-[#881337] text-3xl shadow-inner">
                🎓
              </div>
              <div>
                <h3 className="text-lg font-bold text-[#881337]">
                  Ruang Belajar Virtual Sari Sensei
                </h3>
                <p className="text-xs sm:text-sm text-[#8c6b4b] max-w-md mx-auto mt-1">
                  Saat Sari Sensei memulai sesi tatap muka (Google Meet / Zoom), notifikasi beserta tombol gabung akan langsung muncul seketika di layar Anda.
                </p>
              </div>

              {/* Manual join fallback */}
              <form onSubmit={handleStudentJoinManual} className="max-w-sm mx-auto flex items-center gap-2 pt-2">
                <input
                  type="text"
                  value={studentJoinInput}
                  onChange={(e) => setStudentJoinInput(e.target.value)}
                  placeholder="Kode rapat atau link Zoom/Meet..."
                  className="flex-1 px-4 py-2.5 rounded-xl border border-[#ebdccb] bg-white text-xs text-[#654d38] focus:outline-none focus:ring-2 focus:ring-rose-400"
                />
                <button
                  type="submit"
                  disabled={!studentJoinInput.trim()}
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
