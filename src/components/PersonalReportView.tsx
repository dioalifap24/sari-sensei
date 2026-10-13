import React from 'react';
import { User, QuizResult, JLPTLevel, VirtualSession } from '../types';
import { storageService } from '../services/storageService';
import { Award, Clock, Calendar, CheckCircle2, User as UserIcon, BookOpen, ExternalLink, Users } from 'lucide-react';
import { UchihaClanLogo } from './UchihaClanLogo';
import { JLPTStudyProgressSection } from './JLPTStudyProgressSection';

interface PersonalReportViewProps {
  currentUser: User | null;
  onOpenAuth: () => void;
  onStartQuiz: () => void;
  activeLevel?: JLPTLevel;
  onSelectLevelAndNavigate?: (level: JLPTLevel, tab: 'vocab' | 'kanji') => void;
}

export const PersonalReportView: React.FC<PersonalReportViewProps> = ({
  currentUser,
  onOpenAuth,
  onStartQuiz,
  activeLevel,
  onSelectLevelAndNavigate,
}) => {
  const [scores, setScores] = React.useState<QuizResult[]>(() =>
    currentUser ? storageService.getUserScores(currentUser.email) : []
  );
  const [virtualSessions, setVirtualSessions] = React.useState<VirtualSession[]>(() => storageService.getVirtualSessions());

  React.useEffect(() => {
    const refreshScores = () => {
      if (currentUser) {
        setScores(storageService.getUserScores(currentUser.email));
      } else {
        setScores([]);
      }
    };
    const refreshSessions = () => {
      setVirtualSessions(storageService.getVirtualSessions());
    };
    refreshScores();
    refreshSessions();
    storageService.syncWithServer().then(() => {
      refreshScores();
      refreshSessions();
    });

    window.addEventListener('scores_updated', refreshScores);
    window.addEventListener('storage', refreshScores);
    window.addEventListener('virtual_sessions_updated', refreshSessions);
    return () => {
      window.removeEventListener('scores_updated', refreshScores);
      window.removeEventListener('storage', refreshScores);
      window.removeEventListener('virtual_sessions_updated', refreshSessions);
    };
  }, [currentUser]);

  const formatDurationUsed = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}m ${s}s`;
  };

  if (!currentUser) {
    return (
      <div className="max-w-xl mx-auto px-4 py-12 text-center">
        <div className="bg-[#fffdfa] border border-[#ebdccb] rounded-3xl p-8 shadow-xs">
          <div className="w-16 h-16 bg-[#fae8eb] text-[#881337] rounded-2xl flex items-center justify-center mx-auto mb-4">
            <UserIcon className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-[#881337] font-japanese mb-2">
            Laporan Pribadi Murid
          </h2>
          <p className="text-xs sm:text-sm text-[#6e533d] mb-6 leading-relaxed">
            Masuk atau daftar terlebih dahulu untuk melihat grafik perkembangan nilai, tanggal kuis, dan riwayat belajar pribadi Anda.
          </p>
          <button
            onClick={onOpenAuth}
            className="py-3 px-6 bg-[#881337] hover:bg-[#70102d] text-white font-bold text-xs sm:text-sm rounded-xl transition-all shadow-xs"
          >
            Masuk / Daftar Akun
          </button>
        </div>
      </div>
    );
  }

  // Calculate statistics
  const totalQuizzes = scores.length;
  const averageScore = totalQuizzes > 0
    ? Math.round(scores.reduce((acc, s) => acc + s.score, 0) / totalQuizzes)
    : 0;
  const highestScore = totalQuizzes > 0
    ? Math.max(...scores.map((s) => s.score))
    : 0;
  const userEmailLower = (currentUser?.email || '').toLowerCase();
  const attendedVirtualSessionsCount = virtualSessions.filter(s =>
    (s.attendees || []).some(a => a.email.toLowerCase() === userEmailLower)
  ).length;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="bg-[#fffdfa] border border-[#ebdccb] rounded-3xl p-6 sm:p-8 shadow-xs mb-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#881337] mb-1">
              <span>📊</span>
              <span>RAPOR KEMAJUAN BELAJAR</span>
            </div>
            <h2 className="text-2xl font-bold text-[#881337] font-japanese">
              Laporan Pribadi: {currentUser.fullName || currentUser.name || currentUser.email.split('@')[0]}
            </h2>
            <div className="text-xs text-[#735338] flex items-center gap-1.5 flex-wrap mt-1">
              <span>Nama Panggilan:</span>
              {storageService.isMaster(currentUser) ? (
                <span className="inline-flex items-center gap-1 font-bold text-[#881337] bg-[#fbf0e6] px-2 py-0.5 rounded-lg border border-[#e4ccb5]">
                  <UchihaClanLogo className="w-4 h-4" />
                  <span>{currentUser.nickname || 'skywalker'}</span>
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 font-semibold text-[#881337] bg-[#fbf0e6] px-2 py-0.5 rounded-lg border border-[#e4ccb5]">
                  <span className="w-4 h-4 rounded-full bg-[#881337] text-white flex items-center justify-center text-[9px] font-bold">
                    {(currentUser.nickname || currentUser.fullName || 'M').charAt(0).toUpperCase()}
                  </span>
                  <span>{currentUser.nickname || currentUser.email.split('@')[0]}</span>
                </span>
              )}
              {!storageService.isMaster(currentUser) ? (
                <span>· Email: <span className="font-mono text-[#553b26]">{currentUser.email}</span></span>
              ) : (
                <span className="px-2 py-0.5 bg-amber-100 text-amber-900 border border-amber-300 rounded-md font-bold text-[10px]">
                  Akun Master Sensei Sari
                </span>
              )}
            </div>
          </div>

          <button
            onClick={onStartQuiz}
            className="py-2.5 px-4 bg-[#881337] hover:bg-[#70102d] text-white text-xs font-bold rounded-xl transition-colors shadow-xs whitespace-nowrap"
          >
            + Ambil Kuis Baru
          </button>
        </div>

        {/* 4 Summary Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
          <div className="p-4 bg-[#fdf5ea] rounded-2xl border border-[#ebdccb]">
            <div className="text-xs font-bold text-[#8c6b4b] uppercase tracking-wider mb-1">
              Total Kuis Dikerjakan
            </div>
            <div className="text-2xl font-extrabold text-[#881337] font-mono">
              {totalQuizzes} <span className="text-xs font-normal text-[#553b26]">kali</span>
            </div>
          </div>

          <div className="p-4 bg-[#fdf5ea] rounded-2xl border border-[#ebdccb]">
            <div className="text-xs font-bold text-[#8c6b4b] uppercase tracking-wider mb-1">
              Rata-Rata Nilai
            </div>
            <div className="text-2xl font-extrabold text-[#881337] font-mono">
              {averageScore} <span className="text-xs font-normal text-[#553b26]">/ 100</span>
            </div>
          </div>

          <div className="p-4 bg-[#fdf5ea] rounded-2xl border border-[#ebdccb]">
            <div className="text-xs font-bold text-[#8c6b4b] uppercase tracking-wider mb-1">
              Nilai Tertinggi
            </div>
            <div className="text-2xl font-extrabold text-[#d4af37] font-mono">
              {highestScore} <span className="text-xs font-normal text-[#553b26]">poin</span>
            </div>
          </div>

          <div className="p-4 bg-[#fdf5ea] rounded-2xl border border-[#ebdccb]">
            <div className="text-xs font-bold text-[#8c6b4b] uppercase tracking-wider mb-1 flex items-center gap-1">
              <span>📹</span>
              <span>Sesi Virtual Meet</span>
            </div>
            <div className="text-2xl font-extrabold text-emerald-700 font-mono">
              {attendedVirtualSessionsCount} <span className="text-xs font-normal text-[#553b26]">/ {virtualSessions.length} sesi</span>
            </div>
          </div>
        </div>

        {/* Visualisasi Bar Kemajuan Belajar JLPT (N5 - N2) Berdasarkan Kosakata & Kanji */}
        <JLPTStudyProgressSection
          currentUser={currentUser}
          activeLevel={activeLevel || storageService.getActiveLevel()}
          onSelectLevelAndNavigate={onSelectLevelAndNavigate}
        />

        {/* Personal Quiz Records Table */}
        {scores.length === 0 ? (
          <div className="p-8 text-center bg-[#fdfbf7] rounded-2xl border border-dashed border-[#ebdccb]">
            <div className="text-3xl mb-2">🌸</div>
            <p className="text-sm font-semibold text-[#553b26] mb-1">
              Belum ada riwayat kuis
            </p>
            <p className="text-xs text-[#735338] mb-4">
              Mulai kuis 50 soal sekarang untuk mencatatkan nilai pertama Anda!
            </p>
            <button
              onClick={onStartQuiz}
              className="py-2 px-4 bg-[#881337] text-white text-xs font-bold rounded-xl hover:bg-[#70102d] transition-colors"
            >
              Mulai Kuis Sekarang
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-[#ebdccb]">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-[#f5ede1] text-[#624734] font-bold uppercase text-[11px] tracking-wider border-b border-[#ebdccb]">
                <tr>
                  <th className="py-3 px-4">Tanggal</th>
                  <th className="py-3 px-4">Level</th>
                  <th className="py-3 px-4">Nilai</th>
                  <th className="py-3 px-4">Waktu Dipakai</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#ebdccb] bg-white">
                {scores.map((record) => (
                  <tr key={record.id} className="hover:bg-[#fff9f3] transition-colors">
                    <td className="py-3.5 px-4 font-mono text-[#553b26] whitespace-nowrap">
                      {record.completedAt}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2.5 py-1 bg-[#fae8eb] text-[#881337] font-bold rounded-md text-xs">
                        {record.level}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-bold text-base">
                      <span
                        className={
                          record.score >= 90
                            ? 'text-emerald-700'
                            : record.score >= 70
                            ? 'text-[#881337]'
                            : 'text-amber-700'
                        }
                      >
                        {record.score}
                      </span>
                      <span className="text-xs font-normal text-[#a88a70]"> / 100</span>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-[#735338] whitespace-nowrap">
                      {formatDurationUsed(record.durationUsedSeconds)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Riwayat Sesi Virtual & Kehadiran Google Meet */}
        <div className="mt-10 pt-8 border-t-2 border-[#ebdccb]">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-xl bg-rose-100 text-[#881337] flex items-center justify-center font-bold">
              📹
            </div>
            <div>
              <h3 className="text-lg font-bold text-[#881337] font-japanese">
                Riwayat Sesi Virtual & Kehadiran Google Meet
              </h3>
              <p className="text-xs text-[#735338]">
                {storageService.isMaster(currentUser)
                  ? 'Daftar semua sesi belajar Google Meet dan kehadiran murid yang telah berlangsung.'
                  : 'Riwayat kehadiran Anda pada sesi belajar virtual bersama Sari Sensei.'}
              </p>
            </div>
          </div>

          {virtualSessions.length === 0 ? (
            <div className="p-6 text-center bg-[#fdfbf7] rounded-2xl border border-dashed border-[#ebdccb]">
              <div className="text-2xl mb-2">🎥</div>
              <p className="text-sm font-semibold text-[#553b26] mb-1">
                Belum ada sesi virtual Google Meet yang tercatat
              </p>
              <p className="text-xs text-[#735338]">
                Sari Sensei atau murid dapat memulai sesi belajar live dari Halaman Beranda.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {virtualSessions.map((session) => {
                const isUserAttended = (session.attendees || []).some(
                  a => a.email.toLowerCase() === userEmailLower
                );
                return (
                <div key={session.id} className="p-5 bg-white rounded-2xl border border-[#ebdccb] shadow-xs space-y-3">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-[#f5ede1] pb-3">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="px-2 py-0.5 bg-rose-100 text-[#881337] text-[10px] font-bold rounded">
                          Live Meet
                        </span>
                        {isUserAttended ? (
                          <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-extrabold rounded-full flex items-center gap-1 border border-emerald-300">
                            <span>🟢</span> Hadir & Aktif
                          </span>
                        ) : (
                          <span className="px-2.5 py-0.5 bg-amber-50 text-amber-800 text-[10px] font-medium rounded-full border border-amber-200">
                            ⚪ Belum Hadir
                          </span>
                        )}
                        <h4 className="font-bold text-sm text-[#881337]">{session.title}</h4>
                      </div>
                      <p className="text-xs text-[#735338] mt-0.5">
                        Dibuat oleh: <span className="font-bold">{session.createdByName}</span> · {session.createdAt}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {session.meetingCode && (
                        <span className="font-mono text-xs bg-[#fbf0e6] px-2 py-1 rounded border border-[#ebdccb]">
                          Kode: {session.meetingCode}
                        </span>
                      )}
                      <a
                        href={session.meetingUri}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => storageService.recordMeetAttendance(session.id, currentUser)}
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg flex items-center gap-1 transition-colors"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>Buka Meet</span>
                      </a>
                    </div>
                  </div>

                  <div>
                    <div className="text-xs font-bold text-[#624734] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-[#881337]" />
                      <span>Kehadiran Murid ({session.attendees.length} orang bergabung):</span>
                    </div>

                    {session.attendees.length === 0 ? (
                      <p className="text-xs text-[#a88a70] italic">Belum ada murid yang mencatatkan kehadiran di sesi ini.</p>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                        {session.attendees.map((att, idx) => (
                          <div key={idx} className="p-2.5 bg-[#fdf5ea] rounded-xl border border-[#ebdccb] text-xs flex items-center justify-between gap-2">
                            <div>
                              <div className="font-bold text-[#553b26]">{att.name}</div>
                              <div className="text-[10px] text-[#8c6b4b] font-mono">{att.email}</div>
                            </div>
                            <div className="text-right">
                              <span className="inline-block px-1.5 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded">
                                Hadir
                              </span>
                              <div className="text-[9px] text-[#a88a70] mt-0.5">{att.joinedAt}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
