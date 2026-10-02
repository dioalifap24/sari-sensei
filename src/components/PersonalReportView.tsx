import React from 'react';
import { User, QuizResult } from '../types';
import { storageService } from '../services/storageService';
import { Award, Clock, Calendar, CheckCircle2, User as UserIcon, BookOpen } from 'lucide-react';
import { UchihaClanLogo } from './UchihaClanLogo';

interface PersonalReportViewProps {
  currentUser: User | null;
  onOpenAuth: () => void;
  onStartQuiz: () => void;
}

export const PersonalReportView: React.FC<PersonalReportViewProps> = ({
  currentUser,
  onOpenAuth,
  onStartQuiz,
}) => {
  const scores: QuizResult[] = currentUser
    ? storageService.getUserScores(currentUser.email)
    : [];

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

        {/* 3 Summary Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
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
        </div>

        {/* Personal Quiz Records Table */}
        {scores.length === 0 ? (
          <div className="p-8 text-center bg-[#fdfbf7] rounded-2xl border border-dashed border-[#ebdccb]">
            <div className="text-3xl mb-2">🌸</div>
            <p className="text-sm font-semibold text-[#553b26] mb-1">
              Belum ada riwayat kuis
            </p>
            <p className="text-xs text-[#735338] mb-4">
              Mulai kuis 40 soal sekarang untuk mencatatkan nilai pertama Anda!
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
      </div>
    </div>
  );
};
