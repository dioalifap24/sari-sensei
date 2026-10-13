import React, { useState } from 'react';
import { Video, Plus, ExternalLink, Copy, Check, Shield, Sparkles, Users, Calendar } from 'lucide-react';
import { initializeApp, getApps } from 'firebase/app';
import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import firebaseConfig from '../../firebase-applet-config.json';
import { storageService } from '../services/storageService';
import { User } from '../types';

interface GoogleMeetRoomProps {
  isMasterUser?: boolean;
  currentUser?: User | null;
}

export const GoogleMeetRoom: React.FC<GoogleMeetRoomProps> = ({ isMasterUser = false, currentUser }) => {
  const [meetUri, setMeetUri] = useState<string>('');
  const [meetingCode, setMeetingCode] = useState<string>('');
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [copied, setCopied] = useState<boolean>(false);
  const [customCodeInput, setCustomCodeInput] = useState<string>('');

  const handleCreateMeetSpace = async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
      const auth = getAuth(app);
      const provider = new GoogleAuthProvider();
      provider.addScope('https://www.googleapis.com/auth/meetings.space.created');
      provider.addScope('https://www.googleapis.com/auth/meetings.space.readonly');
      provider.addScope('https://www.googleapis.com/auth/meetings.space.settings');

      const result = await signInWithPopup(auth, provider);
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const accessToken = credential?.accessToken;

      if (!accessToken) {
        throw new Error('Gagal mendapatkan OAuth Access Token dari Google Sign-In.');
      }

      // Call Google Meet API v2 spaces endpoint
      const response = await fetch('https://meet.googleapis.com/v2/spaces', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({}),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error?.message || `Gagal membuat ruang Meet (HTTP ${response.status})`);
      }

      const data = await response.json();
      if (data.meetingUri) {
        setMeetUri(data.meetingUri);
        const code = data.meetingCode || data.name?.replace('spaces/', '') || '';
        setMeetingCode(code);
        const userObj = currentUser || { email: 'master@sarisensei.com', fullName: 'Sari Sensei', nickname: 'Sensei', registeredAt: '-' };
        const newSes = storageService.createVirtualSession('Sesi Belajar Langsung Google Meet', data.meetingUri, code, userObj as User);
        setActiveSessionId(newSes.id);
        storageService.recordMeetAttendance(newSes.id, userObj as User);
      } else {
        throw new Error('Respons API Google Meet tidak mengembalikan URI rapat.');
      }
    } catch (err: any) {
      console.error('Error creating Google Meet space:', err);
      setErrorMsg(err.message || 'Terjadi kesalahan saat menghubungkan ke Google Meet.');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenMeet = () => {
    if (!meetUri) return;
    const sessions = storageService.getVirtualSessions();
    const ses = sessions.find(s => s.meetingUri === meetUri) || sessions[0];
    if (ses && currentUser) {
      storageService.recordMeetAttendance(ses.id, currentUser);
    }
    window.open(meetUri, '_blank', 'noopener,noreferrer');
  };

  const handleJoinWithCode = () => {
    const trimmed = customCodeInput.trim();
    if (!trimmed) return;
    let url = trimmed;
    if (!trimmed.startsWith('http')) {
      const cleanCode = trimmed.replace(/[^a-zA-Z0-9-]/g, '');
      url = `https://meet.google.com/${cleanCode}`;
    }
    const sessions = storageService.getVirtualSessions();
    const ses = sessions.find(s => s.meetingUri.includes(trimmed) || s.meetingCode.includes(trimmed)) || sessions[0];
    if (ses && currentUser) {
      storageService.recordMeetAttendance(ses.id, currentUser);
    }
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleEndMeet = () => {
    if (activeSessionId) {
      storageService.endVirtualSession(activeSessionId);
    }
    setMeetUri('');
    setMeetingCode('');
    setActiveSessionId(null);
  };

  const handleCopyLink = () => {
    if (!meetUri) return;
    navigator.clipboard.writeText(meetUri);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <div className="bg-[#fffdfa] border-2 border-[#ebdccb] rounded-3xl p-6 sm:p-8 shadow-xl max-w-2xl mx-auto my-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-rose-600 to-pink-500 flex items-center justify-center text-white shadow-md">
          <Video className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#881337] flex items-center gap-2">
            <span>Sesi Belajar Langsung Google Meet</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-800 font-semibold">Live Video</span>
          </h2>
          <p className="text-sm text-[#8c6b4b]">
            {isMasterUser 
              ? 'Mulai ruang konferensi Google Meet resmi untuk mengajar murid secara langsung (Sari Sensei).'
              : 'Gabung ke ruang video Google Meet bersama Sensei dan sesama murid.'}
          </p>
        </div>
      </div>

      {errorMsg && (
        <div className="mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-sm flex items-center gap-3">
          <span className="text-lg">⚠️</span>
          <span>{errorMsg}</span>
        </div>
      )}

      {meetUri ? (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="p-5 rounded-2xl bg-[#fcf3e8] border border-[#ebdccb] text-center space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-[#881337] bg-rose-100 px-3 py-1 rounded-full">
              Ruang Meet Siap Digunakan!
            </span>
            <div className="font-mono text-base sm:text-lg font-bold text-[#654d38] break-all bg-white p-3 rounded-xl border border-[#ebdccb]">
              {meetUri}
            </div>
            {meetingCode && (
              <p className="text-xs text-[#8c6b4b]">
                Kode Rapat: <span className="font-bold text-[#881337]">{meetingCode}</span>
              </p>
            )}

            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={handleOpenMeet}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold shadow-md flex items-center gap-2 transition-all transform hover:scale-105 cursor-pointer"
              >
                <ExternalLink className="w-5 h-5" />
                <span>Buka Google Meet</span>
              </button>

              <button
                type="button"
                onClick={handleCopyLink}
                className="px-5 py-3 rounded-xl bg-white border-2 border-[#ebdccb] hover:bg-[#f8ede0] text-[#654d38] font-bold shadow-xs flex items-center gap-2 transition-all"
              >
                {copied ? <Check className="w-5 h-5 text-emerald-600" /> : <Copy className="w-5 h-5" />}
                <span>{copied ? 'Tautan Disalin!' : 'Salin Tautan'}</span>
              </button>
            </div>
          </div>

          {isMasterUser && (
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 border-t border-[#ebdccb]">
              <button
                type="button"
                onClick={handleEndMeet}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-700 hover:to-rose-800 text-white font-bold shadow-lg flex items-center gap-2 transition-all transform hover:scale-105 cursor-pointer"
              >
                <span>🔴 Akhiri Sesi Google Meet</span>
              </button>
              <button
                type="button"
                onClick={handleEndMeet}
                className="text-xs text-[#8c6b4b] hover:text-[#881337] underline font-medium"
              >
                Buat Ruang Meet Baru Lainnya
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-6">
          {isMasterUser ? (
            <div className="text-center py-6 px-4 bg-[#fcf3e8] rounded-2xl border border-[#ebdccb] space-y-4">
              <div className="w-16 h-16 mx-auto rounded-full bg-rose-100 flex items-center justify-center text-[#881337] text-2xl shadow-inner">
                👩‍🏫
              </div>
              <h3 className="text-lg font-bold text-[#881337]">Buka Kelas Tatap Muka Google Meet</h3>
              <p className="text-xs sm:text-sm text-[#8c6b4b] max-w-md mx-auto">
                Sebagai Master (Sari Sensei), Anda dapat membuat ruang Google Meet baru secara instan dengan integrasi resmi Google Workspace.
              </p>
              <button
                type="button"
                onClick={handleCreateMeetSpace}
                disabled={loading}
                className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700 text-white font-bold shadow-lg flex items-center gap-2 mx-auto transition-all transform hover:scale-105 disabled:opacity-50"
              >
                {loading ? (
                  <span className="animate-spin text-lg">⏳</span>
                ) : (
                  <Plus className="w-5 h-5" />
                )}
                <span>{loading ? 'Membuat Ruang Meet...' : 'Buat Ruang Google Meet Baru'}</span>
              </button>
            </div>
          ) : (
            <div className="text-center py-6 px-4 bg-[#fcf3e8] rounded-2xl border border-[#ebdccb] space-y-4">
              <div className="w-16 h-16 mx-auto rounded-full bg-rose-100 flex items-center justify-center text-[#881337] text-2xl shadow-inner">
                🎓
              </div>
              <h3 className="text-lg font-bold text-[#881337]">Gabung ke Ruang Belajar Google Meet</h3>
              <p className="text-xs sm:text-sm text-[#8c6b4b] max-w-md mx-auto">
                Masukkan kode rapat atau tautan Google Meet yang dibagikan oleh Sari Sensei untuk bergabung ke kelas online.
              </p>
              <div className="flex items-center gap-2 max-w-sm mx-auto">
                <input
                  type="text"
                  value={customCodeInput}
                  onChange={(e) => setCustomCodeInput(e.target.value)}
                  placeholder="Contoh: abc-defg-hij atau link meet"
                  className="flex-1 px-4 py-3 rounded-xl border border-[#ebdccb] bg-white text-sm text-[#654d38] focus:outline-none focus:ring-2 focus:ring-rose-400"
                />
                <button
                  type="button"
                  onClick={handleJoinWithCode}
                  className="px-5 py-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-sm shadow-md transition-all"
                >
                  Gabung
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
