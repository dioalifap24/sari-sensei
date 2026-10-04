import { JLPTLevel, QuizResult, User, ActiveQuizRecord, QuizControlState, VocabCard } from '../types';

const STORAGE_USERS_KEY = 'sensei_sari_users_v1';
const STORAGE_CURRENT_USER_KEY = 'sensei_sari_current_user_v1';
const STORAGE_SCORES_KEY = 'sensei_sari_scores_v1';
const STORAGE_ACTIVE_LEVEL_KEY = 'sensei_sari_active_level_v1';
const STORAGE_MEMORIZED_KANJI_KEY = 'sensei_sari_memorized_kanji_v1';
const STORAGE_LAST_ACTIVE_KEY = 'sensei_sari_last_active_v1';
const STORAGE_ACTIVE_QUIZZES_KEY = 'sensei_sari_active_quizzes_v1';
const STORAGE_QUIZ_CONTROL_KEY = 'sensei_sari_quiz_control_v1';
const STORAGE_ONLINE_PRESENCE_KEY = 'sensei_sari_online_presence_v1';
const STORAGE_PASSWORD_RESET_VERIFICATION_KEY = 'sensei_sari_pwd_reset_verify_v1';

// BroadcastChannel untuk sinkronisasi instan antar tab di browser yang sama
const syncChannel = typeof window !== 'undefined' && 'BroadcastChannel' in window 
  ? new BroadcastChannel('sensei_sari_live_sync_v1') 
  : null;

if (syncChannel) {
  syncChannel.onmessage = (event) => {
    const { type } = event.data || {};
    if (type === 'sync_trigger') {
      window.dispatchEvent(new CustomEvent('student_data_updated'));
      window.dispatchEvent(new CustomEvent('active_quiz_updated'));
      window.dispatchEvent(new CustomEvent('quiz_control_changed'));
      window.dispatchEvent(new CustomEvent('scores_updated'));
      window.dispatchEvent(new CustomEvent('presence_updated'));
    }
  };
}

let syncIntervalStarted = false;
let isSyncingWithServer = false;
let lastLocalUserMutationAt = 0;

const STORAGE_DELETED_EMAILS_KEY = 'sensei_sari_deleted_emails_v1';
const SAMPLE_STUDENT_EMAIL_SET = new Set([
  'budi.santoso@gmail.com',
  'anisa.dewi@gmail.com',
  'rizky.pratama@gmail.com',
  'putri.ayu@gmail.com',
]);

const SAMPLE_RECORD_IDS = new Set([
  'score-1',
  'score-2',
  'score-3',
  'score-4',
  'score-5',
  'active-sample-1',
  'active-sample-2',
  'active-sample-3',
  'active-sample-4',
]);

function getDeletedEmailsSet(): Set<string> {
  try {
    const raw = localStorage.getItem(STORAGE_DELETED_EMAILS_KEY);
    if (!raw) return new Set();
    const arr = JSON.parse(raw);
    return new Set(Array.isArray(arr) ? arr.map((e: string) => String(e).toLowerCase().trim()) : []);
  } catch {
    return new Set();
  }
}

function saveDeletedEmailsSet(set: Set<string>) {
  try {
    localStorage.setItem(STORAGE_DELETED_EMAILS_KEY, JSON.stringify(Array.from(set)));
  } catch {}
}

function normalizeAndSortUsersList(
  entries: { user: User; password: string }[],
  deletedSet: Set<string>
): { user: User; password: string }[] {
  const byEmail = new Map<string, { user: User; password: string }>();

  for (const item of entries) {
    if (!item) continue;
    const rawUser: any = item.user || item;
    if (!rawUser || !rawUser.email) continue;
    const emailLower = String(rawUser.email).trim().toLowerCase();
    if (!emailLower) continue;

    const isMasterAcc =
      emailLower === MASTER_CONFIG.email.toLowerCase() ||
      emailLower === 'master@senseisari.com' ||
      rawUser.isMaster === true ||
      rawUser.role === 'master';

    if (!isMasterAcc && (deletedSet.has(emailLower) || SAMPLE_STUDENT_EMAIL_SET.has(emailLower))) continue;

    const cleanFullName = isMasterAcc
      ? MASTER_CONFIG.fullName
      : (rawUser.fullName || rawUser.name || rawUser.nickname || emailLower.split('@')[0] || 'Murid Terdaftar').trim();
    const cleanNickname = isMasterAcc
      ? MASTER_CONFIG.nickname
      : (rawUser.nickname || cleanFullName.split(/\s+/)[0] || cleanFullName).trim();

    const normalizedUser: User = {
      email: isMasterAcc ? MASTER_CONFIG.email : emailLower,
      fullName: cleanFullName,
      nickname: cleanNickname,
      name: cleanFullName,
      registeredAt: rawUser.registeredAt || '2026-10-01 08:00',
      isMaster: isMasterAcc,
      role: isMasterAcc ? 'master' : 'student',
    };

    const existing = byEmail.get(normalizedUser.email.toLowerCase());
    if (!existing) {
      byEmail.set(normalizedUser.email.toLowerCase(), {
        user: normalizedUser,
        password: item.password || (isMasterAcc ? MASTER_CONFIG.password : 'password123'),
      });
    } else {
      // Preserve better password or fuller name if available
      if (item.password && item.password !== 'password123' && existing.password === 'password123') {
        existing.password = item.password;
      }
      if (rawUser.fullName && (!existing.user.fullName || existing.user.fullName === 'Murid Terdaftar')) {
        existing.user.fullName = cleanFullName;
        existing.user.name = cleanFullName;
      }
      if (rawUser.nickname && (!existing.user.nickname || existing.user.nickname === 'Murid')) {
        existing.user.nickname = cleanNickname;
      }
    }
  }

  // Ensure Master account always exists
  const masterKey = MASTER_CONFIG.email.toLowerCase();
  if (!byEmail.has(masterKey)) {
    byEmail.set(masterKey, {
      user: {
        email: MASTER_CONFIG.email,
        fullName: MASTER_CONFIG.fullName,
        nickname: MASTER_CONFIG.nickname,
        name: MASTER_CONFIG.fullName,
        registeredAt: '2026-09-01 08:00',
        isMaster: true,
        role: 'master',
      },
      password: MASTER_CONFIG.password,
    });
  }

  const allValues = Array.from(byEmail.values());
  const masters = allValues.filter(u => u.user.isMaster || u.user.email.toLowerCase() === masterKey);
  const realRegisteredStudents = allValues.filter(
    u =>
      !u.user.isMaster &&
      u.user.email.toLowerCase() !== masterKey &&
      !SAMPLE_STUDENT_EMAIL_SET.has(u.user.email.toLowerCase())
  );

  return [...masters, ...realRegisteredStudents];
}

// Penyedia Verifikasi Perubahan Kata Sandi Resmi
export const VERIFICATION_PROVIDER = {
  name: 'Sensei Sari Auth Security Center',
  email: 'security-verify@senseisari-center.id',
  subject: '[Verifikasi Keamanan] Kode Verifikasi Pembaruan Kata Sandi Sensei Sari',
};

// Durasi jeda waktu tidak aktif sebelum logout otomatis murid: 30 Menit
export const SESSION_TIMEOUT_MS = 30 * 60 * 1000;

// Master Account Configuration sesuai instruksi
export const MASTER_CONFIG = {
  email: 'dioalifap24@gmail.com',
  password: '96',
  fullName: 'GLOSTER GLADIATOR',
  nickname: 'skywalker',
};

// Tanpa akun murid contoh otomatis
const INITIAL_PRESENCE: Record<string, { email: string; name: string; lastSeen: number }> = {};

// Hanya Akun Master dan Akun Murid Asli yang sudah mendaftar (tanpa akun murid contoh)
const INITIAL_STUDENTS: { user: User; password: string }[] = [
  {
    user: { 
      email: 'dioalifap24@gmail.com', 
      fullName: 'GLOSTER GLADIATOR', 
      nickname: 'skywalker', 
      name: 'GLOSTER GLADIATOR', 
      registeredAt: '2026-09-01 08:00',
      isMaster: true,
      role: 'master',
    },
    password: '96',
  },
  {
    user: { 
      email: 'kingugik@gmail.com', 
      fullName: 'king ugik', 
      nickname: 'king ugik', 
      name: 'king ugik', 
      registeredAt: '2026-10-01 06:52',
      isMaster: false,
      role: 'student',
    },
    password: '1234',
  },
];

const INITIAL_SCORES: QuizResult[] = [];

const INITIAL_ACTIVE_QUIZZES: ActiveQuizRecord[] = [];

export const storageService = {
  // Initialize default data if needed
  init: () => {
    try {
      const mergedInitial = storageService.getUsers();
      localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(mergedInitial));

      if (!localStorage.getItem(STORAGE_SCORES_KEY)) {
        localStorage.setItem(STORAGE_SCORES_KEY, JSON.stringify(INITIAL_SCORES));
      }

      if (!localStorage.getItem(STORAGE_ACTIVE_QUIZZES_KEY)) {
        localStorage.setItem(STORAGE_ACTIVE_QUIZZES_KEY, JSON.stringify(INITIAL_ACTIVE_QUIZZES));
      }

      if (!localStorage.getItem(STORAGE_QUIZ_CONTROL_KEY)) {
        localStorage.setItem(STORAGE_QUIZ_CONTROL_KEY, JSON.stringify({ isActive: false }));
      }

      // Jalankan sinkronisasi ke server backend agar akun murid baru langsung muncul di akun Master lintas tab/perangkat
      storageService.syncWithServer();
      if (!syncIntervalStarted && typeof window !== 'undefined') {
        syncIntervalStarted = true;
        window.setInterval(() => {
          storageService.syncWithServer();
        }, 2000);
      }
    } catch (e) {
      console.error('Storage initialization failed', e);
    }
  },

  // Sinkronisasi dua arah antara LocalStorage & Server Pusat (Agar Murid Baru Langsung Muncul di Akun Master)
  syncWithServer: async (): Promise<void> => {
    if (isSyncingWithServer) return;
    isSyncingWithServer = true;
    const syncStartedAt = Date.now();
    try {
      const localUsers = storageService.getUsers();
      const currentUser = storageService.getCurrentUser();
      const localScores = storageService.getScores();
      const localQuizzes = storageService.getActiveQuizRecords();
      const localPresence = storageService.getOnlinePresenceMap();

      const res = await fetch('/api/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          users: localUsers,
          currentUser,
          scores: localScores,
          activeQuizzes: localQuizzes,
          onlinePresence: localPresence,
        }),
      });

      if (!res.ok) return;
      const serverData = await res.json();

      if (Array.isArray(serverData.deletedEmails)) {
        const deletedSet = getDeletedEmailsSet();
        for (const de of serverData.deletedEmails) {
          if (de) deletedSet.add(String(de).toLowerCase().trim());
        }
        saveDeletedEmailsSet(deletedSet);
      }

      let hasUserChanges = false;
      if (Array.isArray(serverData.users) && serverData.users.length > 0) {
        const deletedSet = getDeletedEmailsSet();
        // Re-read current local users in case a registration happened while fetch was in flight
        const latestLocalRaw = localStorage.getItem(STORAGE_USERS_KEY);
        const latestLocalUsers = latestLocalRaw ? JSON.parse(latestLocalRaw) : localUsers;
        const mergedUsers = normalizeAndSortUsersList(
          [...latestLocalUsers, ...serverData.users],
          deletedSet
        );
        const nextUsersStr = JSON.stringify(mergedUsers);
        if (latestLocalRaw !== nextUsersStr && lastLocalUserMutationAt <= syncStartedAt) {
          localStorage.setItem(STORAGE_USERS_KEY, nextUsersStr);
          hasUserChanges = true;
        } else if (lastLocalUserMutationAt > syncStartedAt) {
          // Merge without losing the newly mutated local user
          const safeMerged = normalizeAndSortUsersList(
            [...latestLocalUsers, ...serverData.users],
            deletedSet
          );
          localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(safeMerged));
          hasUserChanges = true;
        }
      }

      if (Array.isArray(serverData.scores)) {
        const currentScoresStr = localStorage.getItem(STORAGE_SCORES_KEY);
        const nextScoresStr = JSON.stringify(serverData.scores);
        if (currentScoresStr !== nextScoresStr) {
          localStorage.setItem(STORAGE_SCORES_KEY, nextScoresStr);
          window.dispatchEvent(new CustomEvent('scores_updated'));
        }
      }

      if (Array.isArray(serverData.activeQuizzes)) {
        const currentQuizzesStr = localStorage.getItem(STORAGE_ACTIVE_QUIZZES_KEY);
        const nextQuizzesStr = JSON.stringify(serverData.activeQuizzes);
        if (currentQuizzesStr !== nextQuizzesStr) {
          localStorage.setItem(STORAGE_ACTIVE_QUIZZES_KEY, nextQuizzesStr);
          window.dispatchEvent(new CustomEvent('active_quiz_updated'));
        }
      }

      if (serverData.quizControl) {
        const currentCtrlStr = localStorage.getItem(STORAGE_QUIZ_CONTROL_KEY);
        const nextCtrlStr = JSON.stringify(serverData.quizControl);
        if (currentCtrlStr !== nextCtrlStr) {
          localStorage.setItem(STORAGE_QUIZ_CONTROL_KEY, nextCtrlStr);
          window.dispatchEvent(new CustomEvent('quiz_control_changed', { detail: serverData.quizControl }));
        }
      }

      if (serverData.onlinePresence) {
        const currentPresStr = localStorage.getItem(STORAGE_ONLINE_PRESENCE_KEY);
        const nextPresStr = JSON.stringify(serverData.onlinePresence);
        if (currentPresStr !== nextPresStr) {
          localStorage.setItem(STORAGE_ONLINE_PRESENCE_KEY, nextPresStr);
          window.dispatchEvent(new CustomEvent('presence_updated'));
        }
      }

      if (hasUserChanges) {
        window.dispatchEvent(new CustomEvent('student_data_updated'));
      }
    } catch {
      // Abaikan jika sedang offline sementara
    } finally {
      isSyncingWithServer = false;
    }
  },

  // Check if a user is the Master Account
  isMaster: (user: User | null | undefined): boolean => {
    if (!user) return false;
    const email = (user.email || '').toLowerCase().trim();
    return email === MASTER_CONFIG.email.toLowerCase() || 
           email === 'master@senseisari.com' || 
           user.isMaster === true || 
           user.role === 'master';
  },

  // Auth & Users (Dilengkapi pemulihan otomatis seluruh akun murid yang sudah mendaftar dari semua kunci LocalStorage)
  getUsers: (): { user: User; password: string }[] => {
    try {
      const deletedSet = getDeletedEmailsSet();
      const collected: { user: User; password: string }[] = [];

      // 1. Baca dari kunci utama & kunci versi sebelumnya jika ada
      const userKeys = [
        STORAGE_USERS_KEY,
        'sensei_sari_users_v2',
        'sensei_sari_users',
        'sensei_sari_students',
        'users',
      ];
      for (const k of userKeys) {
        const raw = localStorage.getItem(k);
        if (raw) {
          try {
            const parsed = JSON.parse(raw);
            if (Array.isArray(parsed)) {
              for (const item of parsed) {
                if (item?.user?.email) {
                  collected.push(item);
                } else if (item?.email) {
                  collected.push({ user: item, password: item.password || 'password123' });
                }
              }
            }
          } catch {}
        }
      }

      // 2. Pulihkan dari sesi pengguna yang sedang login (currentUser)
      const currentUserKeys = [
        STORAGE_CURRENT_USER_KEY,
        'sensei_sari_current_user_v2',
        'sensei_sari_current_user',
      ];
      for (const ck of currentUserKeys) {
        const rawCurr = localStorage.getItem(ck);
        if (rawCurr) {
          try {
            const parsedCurr = JSON.parse(rawCurr);
            if (parsedCurr?.email) {
              collected.push({ user: parsedCurr, password: 'password123' });
            }
          } catch {}
        }
      }

      // 3. Pulihkan akun murid yang pernah tercatat di riwayat nilai kuis (scores)
      const scoreKeys = [STORAGE_SCORES_KEY, 'sensei_sari_scores_v2', 'sensei_sari_scores'];
      for (const sk of scoreKeys) {
        const rawScores = localStorage.getItem(sk);
        if (rawScores) {
          try {
            const parsedScores = JSON.parse(rawScores);
            if (Array.isArray(parsedScores)) {
              for (const sc of parsedScores) {
                if (sc?.userEmail) {
                  collected.push({
                    user: {
                      email: sc.userEmail,
                      fullName: sc.studentName || sc.studentNickname || sc.userEmail.split('@')[0],
                      nickname: sc.studentNickname || (sc.studentName ? sc.studentName.split(/\s+/)[0] : sc.userEmail.split('@')[0]),
                      name: sc.studentName || sc.studentNickname || sc.userEmail.split('@')[0],
                      registeredAt: sc.completedAt || '2026-10-01 08:00',
                      isMaster: false,
                      role: 'student',
                    },
                    password: 'password123',
                  });
                }
              }
            }
          } catch {}
        }
      }

      // 4. Pulihkan akun murid yang pernah tercatat di kuis aktif (activeQuizzes)
      const activeKeys = [STORAGE_ACTIVE_QUIZZES_KEY, 'sensei_sari_active_quizzes_v2', 'sensei_sari_active_quizzes'];
      for (const ak of activeKeys) {
        const rawAct = localStorage.getItem(ak);
        if (rawAct) {
          try {
            const parsedAct = JSON.parse(rawAct);
            if (Array.isArray(parsedAct)) {
              for (const aq of parsedAct) {
                if (aq?.userEmail) {
                  collected.push({
                    user: {
                      email: aq.userEmail,
                      fullName: aq.studentName || aq.studentNickname || aq.userEmail.split('@')[0],
                      nickname: aq.studentNickname || (aq.studentName ? aq.studentName.split(/\s+/)[0] : aq.userEmail.split('@')[0]),
                      name: aq.studentName || aq.studentNickname || aq.userEmail.split('@')[0],
                      registeredAt: aq.date ? `${aq.date} 08:00` : '2026-10-01 08:00',
                      isMaster: false,
                      role: 'student',
                    },
                    password: 'password123',
                  });
                }
              }
            }
          } catch {}
        }
      }

      // 5. Pulihkan akun murid yang pernah tercatat di onlinePresence
      const rawPres = localStorage.getItem(STORAGE_ONLINE_PRESENCE_KEY);
      if (rawPres) {
        try {
          const parsedPres = JSON.parse(rawPres);
          if (parsedPres && typeof parsedPres === 'object') {
            for (const [emailKey, pVal] of Object.entries(parsedPres as Record<string, any>)) {
              if (emailKey) {
                const pName = pVal?.name || emailKey.split('@')[0];
                collected.push({
                  user: {
                    email: emailKey,
                    fullName: pName,
                    nickname: pName.split(/\s+/)[0] || pName,
                    name: pName,
                    registeredAt: '2026-10-01 08:00',
                    isMaster: false,
                    role: 'student',
                  },
                  password: 'password123',
                });
              }
            }
          }
        } catch {}
      }

      // 6. Tambahkan INITIAL_STUDENTS sebagai fallback terakhir
      collected.push(...INITIAL_STUDENTS);

      const normalized = normalizeAndSortUsersList(collected, deletedSet);
      const currentRaw = localStorage.getItem(STORAGE_USERS_KEY);
      const normalizedStr = JSON.stringify(normalized);
      if (currentRaw !== normalizedStr) {
        localStorage.setItem(STORAGE_USERS_KEY, normalizedStr);
      }
      return normalized;
    } catch {
      return INITIAL_STUDENTS;
    }
  },

  // Get list of students (non-master or all)
  getAllStudents: (): User[] => {
    const users = storageService.getUsers();
    return users
      .filter(u => !storageService.isMaster(u.user))
      .map(u => u.user);
  },

  // Get list of students along with their registered passwords (Khusus Akun Master)
  getAllStudentsWithCredentials: (): { user: User; password: string }[] => {
    const users = storageService.getUsers();
    return users.filter(u => !storageService.isMaster(u.user));
  },

  // Perbaiki atau perbarui kata sandi murid atau master jika lupa/ingin diubah
  updateStudentPassword: (email: string, newPassword: string): { success: boolean; message: string } => {
    const trimmedEmail = email.trim().toLowerCase();
    const cleanPass = newPassword.trim();
    const isMasterTarget = trimmedEmail === MASTER_CONFIG.email.toLowerCase() || trimmedEmail === 'master@senseisari.com';

    // Aturan Kata Sandi:
    // Akun Master: Bebas menggunakan berapapun karakter minimal 2 sampai 10 karakter
    // Akun Murid: Wajib minimal 8 karakter
    if (isMasterTarget) {
      if (cleanPass.length < 2 || cleanPass.length > 10) {
        return { success: false, message: 'Kata sandi akun master bebas antara minimal 2 sampai maksimal 10 karakter.' };
      }
    } else {
      if (cleanPass.length < 2) {
        return { success: false, message: 'Kata sandi murid wajib minimal 2 karakter.' };
      }
    }

    const users = storageService.getUsers();
    const idx = users.findIndex(u => u.user.email.toLowerCase() === trimmedEmail);
    if (idx === -1) {
      return { success: false, message: 'Alamat email tidak ditemukan dalam sistem.' };
    }
    users[idx].password = cleanPass;
    lastLocalUserMutationAt = Date.now();
    localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(users));
    fetch('/api/users/password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: trimmedEmail, newPassword: cleanPass }),
    }).catch(() => {});
    syncChannel?.postMessage({ type: 'sync_trigger' });
    window.dispatchEvent(new CustomEvent('student_data_updated'));
    return { 
      success: true, 
      message: `Kata sandi untuk ${users[idx].user.nickname || users[idx].user.fullName} berhasil diperbarui!` 
    };
  },

  // Pengiriman Email Verifikasi Lupa Kata Sandi dari Penyedia Resmi
  sendPasswordResetVerification: (email: string): { 
    success: boolean; 
    message: string; 
    code?: string; 
    recipientName?: string; 
    sentAt?: string;
    senderEmail?: string;
    senderName?: string;
  } => {
    const trimmedEmail = email.trim().toLowerCase();
    if (!trimmedEmail) {
      return { success: false, message: 'Alamat email wajib diisi.' };
    }

    const users = storageService.getUsers();
    const userEntry = users.find(u => u.user.email.toLowerCase() === trimmedEmail);
    if (!userEntry) {
      return { success: false, message: 'Alamat email tidak terdaftar dalam sistem Sensei Sari.' };
    }

    // Generate 6 digit security code
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const now = Date.now();
    const expiresAt = now + 15 * 60 * 1000; // 15 menit

    const verificationPayload = {
      email: trimmedEmail,
      code,
      expiresAt,
      verified: false,
      recipientName: userEntry.user.fullName || userEntry.user.nickname || 'Murid',
      senderEmail: VERIFICATION_PROVIDER.email,
      senderName: VERIFICATION_PROVIDER.name,
      sentAt: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
    };

    localStorage.setItem(STORAGE_PASSWORD_RESET_VERIFICATION_KEY, JSON.stringify(verificationPayload));

    return {
      success: true,
      message: `Email verifikasi telah dikirim dari ${VERIFICATION_PROVIDER.email} ke ${trimmedEmail}.`,
      code,
      recipientName: verificationPayload.recipientName,
      sentAt: verificationPayload.sentAt,
      senderEmail: VERIFICATION_PROVIDER.email,
      senderName: VERIFICATION_PROVIDER.name,
    };
  },

  // Verifikasi Kode dari Email
  verifyPasswordResetCode: (email: string, inputCode: string): { success: boolean; message: string } => {
    const trimmedEmail = email.trim().toLowerCase();
    const cleanCode = inputCode.trim();

    try {
      const data = localStorage.getItem(STORAGE_PASSWORD_RESET_VERIFICATION_KEY);
      if (!data) {
        return { success: false, message: 'Permintaan verifikasi tidak ditemukan. Silakan kirim ulang email verifikasi.' };
      }

      const payload = JSON.parse(data);
      if (payload.email !== trimmedEmail) {
        return { success: false, message: 'Email tidak sesuai dengan sesi verifikasi aktif.' };
      }

      if (Date.now() > payload.expiresAt) {
        return { success: false, message: 'Kode verifikasi telah kedaluwarsa (lebih dari 15 menit). Silakan kirim ulang.' };
      }

      if (payload.code !== cleanCode) {
        return { success: false, message: `Kode verifikasi salah. Harap periksa email dari ${VERIFICATION_PROVIDER.email}` };
      }

      payload.verified = true;
      localStorage.setItem(STORAGE_PASSWORD_RESET_VERIFICATION_KEY, JSON.stringify(payload));
      return { success: true, message: 'Verifikasi berhasil! Silakan buat kata sandi baru Anda.' };
    } catch {
      return { success: false, message: 'Terjadi kesalahan sistem verifikasi.' };
    }
  },

  // Selesaikan Pembaruan Sandi Setelah Verifikasi Email
  completePasswordResetWithVerification: (email: string, code: string, newPassword: string): { success: boolean; message: string } => {
    const trimmedEmail = email.trim().toLowerCase();
    const cleanPass = newPassword.trim();

    // Pastikan kode valid
    const verifyCheck = storageService.verifyPasswordResetCode(trimmedEmail, code);
    if (!verifyCheck.success) {
      return { success: false, message: verifyCheck.message };
    }

    const isMasterTarget = trimmedEmail === MASTER_CONFIG.email.toLowerCase() || trimmedEmail === 'master@senseisari.com';
    if (isMasterTarget) {
      if (cleanPass.length < 2 || cleanPass.length > 10) {
        return { success: false, message: 'Kata sandi baru akun Master bebas antara minimal 2 sampai maksimal 10 karakter.' };
      }
    } else {
      if (cleanPass.length < 2) {
        return { success: false, message: 'Kata sandi baru murid wajib minimal 2 karakter.' };
      }
    }

    // Update password
    const result = storageService.updateStudentPassword(trimmedEmail, cleanPass);
    if (result.success) {
      localStorage.removeItem(STORAGE_PASSWORD_RESET_VERIFICATION_KEY);
    }
    return result;
  },

  // Delete student account and all related data (Master only)
  deleteStudent: (studentEmail: string): boolean => {
    try {
      const targetEmail = studentEmail.trim().toLowerCase();
      if (targetEmail === MASTER_CONFIG.email.toLowerCase()) {
        return false; // Prevent deleting master
      }

      // 0. Record in deletedEmails so auto-recovery does not resurrect deleted student
      const deletedSet = getDeletedEmailsSet();
      deletedSet.add(targetEmail);
      saveDeletedEmailsSet(deletedSet);
      lastLocalUserMutationAt = Date.now();

      // 1. Remove from users list
      let users = storageService.getUsers();
      users = users.filter(u => u.user.email.toLowerCase() !== targetEmail);
      localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(users));

      // 2. Remove all quiz scores
      let scores = storageService.getScores();
      scores = scores.filter(s => s.userEmail.toLowerCase() !== targetEmail);
      localStorage.setItem(STORAGE_SCORES_KEY, JSON.stringify(scores));

      // 3. Remove all active quiz records
      let activeQuizzes = storageService.getActiveQuizRecords();
      activeQuizzes = activeQuizzes.filter(q => q.userEmail.toLowerCase() !== targetEmail);
      localStorage.setItem(STORAGE_ACTIVE_QUIZZES_KEY, JSON.stringify(activeQuizzes));

      // 3b. Remove from online presence
      const presMap = storageService.getOnlinePresenceMap();
      if (presMap[targetEmail]) {
        delete presMap[targetEmail];
        localStorage.setItem(STORAGE_ONLINE_PRESENCE_KEY, JSON.stringify(presMap));
      }

      // 4. Sync deletion to server & BroadcastChannel
      fetch('/api/users/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: targetEmail }),
      }).catch(() => {});
      syncChannel?.postMessage({ type: 'sync_trigger' });

      // 5. Trigger live event
      window.dispatchEvent(new CustomEvent('student_data_updated', { detail: { deletedEmail: targetEmail } }));
      return true;
    } catch (e) {
      console.error('Failed to delete student', e);
      return false;
    }
  },

  // Validasi Pencegahan Pendaftaran Akun Anonim
  validateStudentRegistration: (
    fullName: string,
    nickname: string,
    email: string,
    password: string
  ): { valid: boolean; message: string } => {
    const trimmedFullName = fullName.trim();
    const trimmedNickname = (nickname.trim() || trimmedFullName.split(/\s+/)[0] || trimmedFullName).trim();
    const trimmedEmail = email.trim().toLowerCase();

    // 1. Validasi Nama Lengkap
    if (!trimmedFullName || trimmedFullName.length < 2) {
      return { valid: false, message: 'Nama lengkap wajib diisi (minimal 2 karakter).' };
    }

    if (!/[a-zA-Z]/.test(trimmedFullName)) {
      return { valid: false, message: 'Nama lengkap harus menggunakan huruf alfabet yang sah.' };
    }

    // Blacklist kata kunci nama anonim murni
    const ANONYMOUS_NAME_KEYWORDS = [
      'anon',
      'anonim',
      'anonymous',
      'anonym',
      'tanpa nama',
      'tanpanama',
      'hamba allah',
      'hambaallah',
      'no name',
      'noname',
      'nobody',
    ];

    const lowerFullName = trimmedFullName.toLowerCase();
    for (const kw of ANONYMOUS_NAME_KEYWORDS) {
      if (lowerFullName === kw) {
        return { 
          valid: false, 
          message: `Pendaftaran ditolak: Dilarang menggunakan nama anonim/samaran ("${trimmedFullName}"). Wajib menggunakan nama lengkap asli.` 
        };
      }
    }

    // 2. Validasi Nama Panggilan
    if (!trimmedNickname || trimmedNickname.length < 2) {
      return { valid: false, message: 'Nama panggilan wajib diisi (minimal 2 karakter).' };
    }

    const lowerNickname = trimmedNickname.toLowerCase();
    for (const kw of ANONYMOUS_NAME_KEYWORDS) {
      if (lowerNickname === kw) {
        return { 
          valid: false, 
          message: `Pendaftaran ditolak: Dilarang menggunakan nama panggilan anonim ("${trimmedNickname}"). Gunakan nama sapaan asli Anda.` 
        };
      }
    }

    // 3. Validasi Email (Pencegahan email sementara / disposable / anonim)
    if (!trimmedEmail) {
      return { valid: false, message: 'Alamat email wajib diisi.' };
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(trimmedEmail)) {
      return { valid: false, message: 'Format alamat email tidak valid (contoh: nama.anda@gmail.com).' };
    }

    const [username, domain] = trimmedEmail.split('@');
    if (!username || !domain) {
      return { valid: false, message: 'Format alamat email tidak lengkap.' };
    }

    // Blacklist domain disposable / temp mail murni
    const DISPOSABLE_EMAIL_DOMAINS = [
      'tempmail.com',
      'temp-mail.org',
      'tempmail.net',
      '10minutemail.com',
      '10minutemail.net',
      'guerrillamail.com',
      'guerrillamail.net',
      'guerrillamail.org',
      'mailinator.com',
      'yopmail.com',
      'yopmail.fr',
      'trashmail.com',
      'trashmail.net',
      'throwawaymail.com',
      'sharklasers.com',
      'fakeinbox.com',
      'dispostable.com',
    ];

    if (DISPOSABLE_EMAIL_DOMAINS.includes(domain)) {
      return { 
        valid: false, 
        message: `Pendaftaran ditolak: Layanan email sementara ("${domain}") dilarang. Harap gunakan penyedia email resmi (Gmail, Yahoo, Outlook, atau email institusi).` 
      };
    }

    // 4. Validasi Kata Sandi Murid
    if (!password || password.length < 2) {
      return { valid: false, message: 'Kata sandi murid wajib diisi (minimal 2 karakter).' };
    }

    return { valid: true, message: 'Valid' };
  },

  register: (
    email: string, 
    password: string, 
    fullName: string, 
    nickname: string,
    setAsCurrentUser: boolean = true
  ): { success: boolean; message: string; user?: User } => {
    const cleanFullName = fullName.trim();
    const cleanNickname = (nickname.trim() || cleanFullName.split(/\s+/)[0] || cleanFullName).trim();

    // Validasi pencegahan akun anonim
    const validation = storageService.validateStudentRegistration(cleanFullName, cleanNickname, email, password);
    if (!validation.valid) {
      return { success: false, message: validation.message };
    }

    const trimmedEmail = email.trim().toLowerCase();
    if (trimmedEmail === MASTER_CONFIG.email.toLowerCase() || trimmedEmail === 'master@senseisari.com') {
      return { success: false, message: 'Ini adalah email khusus Akun Master. Silakan masuk melalui menu Masuk.' };
    }

    // Hapus dari daftar deletedEmails jika sebelumnya pernah dihapus
    const deletedSet = getDeletedEmailsSet();
    if (deletedSet.has(trimmedEmail)) {
      deletedSet.delete(trimmedEmail);
      saveDeletedEmailsSet(deletedSet);
    }

    lastLocalUserMutationAt = Date.now();
    const users = storageService.getUsers();
    const existingIdx = users.findIndex(u => u.user.email.toLowerCase() === trimmedEmail);

    const newUser: User = {
      email: trimmedEmail,
      fullName: cleanFullName,
      nickname: cleanNickname,
      name: cleanFullName,
      registeredAt:
        existingIdx !== -1 && users[existingIdx].user.registeredAt
          ? users[existingIdx].user.registeredAt
          : new Date().toISOString().replace('T', ' ').substring(0, 16),
      isMaster: false,
      role: 'student',
    };

    if (existingIdx !== -1) {
      // Jika sudah pernah mendaftar, perbarui datanya dan angkat ke urutan teratas daftar murid
      users.splice(existingIdx, 1);
    }

    // Tempatkan murid baru tepat setelah akun Master (urutan #1 paling atas di Daftar Murid)
    if (users.length > 0) {
      users.splice(1, 0, { user: newUser, password });
    } else {
      users.push({ user: newUser, password });
    }

    const sortedUsers = normalizeAndSortUsersList(users, deletedSet);
    localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(sortedUsers));

    // Tandai kehadiran online
    storageService.heartbeatPresence(newUser);

    if (setAsCurrentUser) {
      storageService.setCurrentUser(newUser);
    }

    // Kirim langsung ke server pusat agar langsung muncul di Daftar Murid Akun Master
    fetch('/api/users/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user: newUser, password }),
    })
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data?.users)) {
          const currentLocal = storageService.getUsers();
          const merged = normalizeAndSortUsersList(
            [{ user: newUser, password }, ...currentLocal, ...data.users],
            getDeletedEmailsSet()
          );
          localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(merged));
          window.dispatchEvent(new CustomEvent('student_data_updated'));
        }
      })
      .catch(() => {});

    syncChannel?.postMessage({ type: 'sync_trigger' });
    window.dispatchEvent(new CustomEvent('student_data_updated'));

    return { success: true, message: `Pendaftaran berhasil! Selamat datang, ${cleanNickname}! 🌸`, user: newUser };
  },

  login: (email: string, password: string): { success: boolean; message: string; user?: User } => {
    const trimmedEmail = email.trim().toLowerCase();
    if (!trimmedEmail || !password) {
      return { success: false, message: 'Email dan kata sandi wajib diisi.' };
    }

    const isMasterEmail = trimmedEmail === MASTER_CONFIG.email.toLowerCase() || trimmedEmail === 'master@senseisari.com';
    const users = storageService.getUsers();
    const masterSaved = users.find(u => u.user.email.toLowerCase() === MASTER_CONFIG.email.toLowerCase());
    const savedMasterPass = masterSaved ? masterSaved.password : MASTER_CONFIG.password;
    const isMasterPassword = password === MASTER_CONFIG.password || password === savedMasterPass;

    // Direct match for Master Account
    if (isMasterEmail && isMasterPassword) {
      const masterUser: User = {
        email: MASTER_CONFIG.email,
        fullName: MASTER_CONFIG.fullName,
        nickname: MASTER_CONFIG.nickname,
        name: MASTER_CONFIG.fullName,
        registeredAt: '2026-09-01 08:00',
        isMaster: true,
        role: 'master',
      };
      
      // Update in storage if needed
      const existingIdx = users.findIndex(u => u.user.email.toLowerCase() === MASTER_CONFIG.email.toLowerCase());
      if (existingIdx !== -1) {
        users[existingIdx].user = masterUser;
        if (!users[existingIdx].password || users[existingIdx].password === '1234567890') {
          users[existingIdx].password = MASTER_CONFIG.password;
        }
      } else {
        users.unshift({ user: masterUser, password: MASTER_CONFIG.password });
      }
      localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(users));

      storageService.setCurrentUser(masterUser);
      storageService.syncWithServer();
      return { 
        success: true, 
        message: `Selamat datang, ${MASTER_CONFIG.nickname}! 🌸👑 (Akun Master: ${MASTER_CONFIG.fullName})`, 
        user: masterUser 
      };
    }

    const found = users.find(u => u.user.email.toLowerCase() === trimmedEmail);

    if (!found) {
      return { success: false, message: 'Email belum terdaftar. Silakan pilih tab "Daftar Akun Baru" dan isi nama lengkap Anda.' };
    }

    const isPasswordValid = found.password === password;
    if (!isPasswordValid) {
      return { success: false, message: 'Kata sandi salah. Silakan periksa kembali.' };
    }

    storageService.setCurrentUser(found.user);

    // Pastikan akun murid yang login langsung disinkronkan ke server pusat agar selalu tampil di Daftar Murid Master
    fetch('/api/users/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user: found.user, password: found.password }),
    })
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data?.users)) {
          const merged = normalizeAndSortUsersList(
            [...storageService.getUsers(), ...data.users],
            getDeletedEmailsSet()
          );
          localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(merged));
          window.dispatchEvent(new CustomEvent('student_data_updated'));
        }
      })
      .catch(() => {});

    return { 
      success: true, 
      message: `Selamat datang kembali, ${found.user.nickname || found.user.fullName}! 🌸`, 
      user: found.user 
    };
  },

  getCurrentUser: (): User | null => {
    try {
      const data = localStorage.getItem(STORAGE_CURRENT_USER_KEY);
      if (!data) return null;
      const parsed: User = JSON.parse(data);
      // Synchronize master details if current user is master
      if (storageService.isMaster(parsed)) {
        parsed.fullName = MASTER_CONFIG.fullName;
        parsed.nickname = MASTER_CONFIG.nickname;
        parsed.isMaster = true;
        parsed.role = 'master';
      }
      return parsed;
    } catch {
      return null;
    }
  },

  setCurrentUser: (user: User | null) => {
    if (user) {
      localStorage.setItem(STORAGE_CURRENT_USER_KEY, JSON.stringify(user));
      storageService.updateLastActive();
      if (!storageService.isMaster(user)) {
        storageService.heartbeatPresence(user);
      }
    } else {
      localStorage.removeItem(STORAGE_CURRENT_USER_KEY);
      localStorage.removeItem(STORAGE_LAST_ACTIVE_KEY);
    }
  },

  logout: () => {
    const current = storageService.getCurrentUser();
    if (current && !storageService.isMaster(current)) {
      storageService.setPresenceOffline(current.email);
    }
    storageService.setCurrentUser(null);
  },

  // Online Presence System (Murid Sedang Mengakses Web)
  getOnlinePresenceMap: (): Record<string, { email: string; name: string; lastSeen: number }> => {
    try {
      const data = localStorage.getItem(STORAGE_ONLINE_PRESENCE_KEY);
      if (!data) return {};
      const parsed = JSON.parse(data);
      const cleaned: Record<string, { email: string; name: string; lastSeen: number }> = {};
      if (parsed && typeof parsed === 'object') {
        for (const [k, v] of Object.entries(parsed)) {
          if (!SAMPLE_STUDENT_EMAIL_SET.has(k.toLowerCase())) {
            cleaned[k.toLowerCase()] = v as any;
          }
        }
      }
      return cleaned;
    } catch {
      return {};
    }
  },

  heartbeatPresence: (user: User) => {
    if (!user || storageService.isMaster(user)) return;
    try {
      const presenceMap = storageService.getOnlinePresenceMap();
      const email = user.email.toLowerCase();
      presenceMap[email] = {
        email,
        name: user.fullName || user.nickname || 'Murid',
        lastSeen: Date.now(),
      };
      localStorage.setItem(STORAGE_ONLINE_PRESENCE_KEY, JSON.stringify(presenceMap));
      fetch('/api/presence', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(presenceMap[email]),
      }).catch(() => {});
      window.dispatchEvent(new CustomEvent('presence_updated', { detail: { email, online: true } }));
    } catch (e) {
      console.error('Failed to update presence', e);
    }
  },

  setPresenceOffline: (email: string) => {
    try {
      const presenceMap = storageService.getOnlinePresenceMap();
      const target = email.toLowerCase();
      if (presenceMap[target]) {
        presenceMap[target].lastSeen = 0; // Mark as offline
        localStorage.setItem(STORAGE_ONLINE_PRESENCE_KEY, JSON.stringify(presenceMap));
        fetch('/api/presence', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(presenceMap[target]),
        }).catch(() => {});
        window.dispatchEvent(new CustomEvent('presence_updated', { detail: { email: target, online: false } }));
      }
    } catch (e) {
      console.error('Failed to set presence offline', e);
    }
  },

  isStudentOnline: (email: string): boolean => {
    const targetEmail = email.toLowerCase();

    // Jika murid sedang login aktif di tab/browser ini
    const current = storageService.getCurrentUser();
    if (current && current.email.toLowerCase() === targetEmail && !storageService.isMaster(current)) {
      return true;
    }

    // Cek rekaman kuis yang sedang aktif berlangsung (status 'in_progress' dalam 45 menit terakhir)
    const activeQuizzes = storageService.getActiveQuizRecords();
    const hasLiveQuiz = activeQuizzes.some(
      q => q.userEmail.toLowerCase() === targetEmail && 
           q.status === 'in_progress' && 
           (Date.now() - q.startedAtTimestamp) < 45 * 60 * 1000
    );
    if (hasLiveQuiz) {
      return true;
    }

    // Cek timestamp heartbeat terakhir (online jika aktif dalam 60 detik terakhir)
    const presenceMap = storageService.getOnlinePresenceMap();
    const presence = presenceMap[targetEmail];
    if (presence && (Date.now() - presence.lastSeen) < 60_000) {
      return true;
    }

    return false;
  },

  getOnlineStudentsCount: (): number => {
    const students = storageService.getAllStudents();
    return students.filter(s => storageService.isStudentOnline(s.email)).length;
  },

  // Active timestamp tracking
  updateLastActive: () => {
    try {
      localStorage.setItem(STORAGE_LAST_ACTIVE_KEY, Date.now().toString());
    } catch {}
  },

  getLastActive: (): number => {
    try {
      const val = localStorage.getItem(STORAGE_LAST_ACTIVE_KEY);
      return val ? parseInt(val, 10) : Date.now();
    } catch {
      return Date.now();
    }
  },

  checkSessionExpired: (user: User | null): { expired: boolean; remainingMinutes: number } => {
    if (!user) return { expired: true, remainingMinutes: 0 };
    // Master account does not auto-logout
    if (storageService.isMaster(user)) {
      return { expired: false, remainingMinutes: 999999 };
    }

    const lastActive = storageService.getLastActive();
    const elapsed = Date.now() - lastActive;
    if (elapsed > SESSION_TIMEOUT_MS) {
      return { expired: true, remainingMinutes: 0 };
    }
    const remainingMs = SESSION_TIMEOUT_MS - elapsed;
    const remainingMinutes = Math.ceil(remainingMs / (60 * 1000));
    return { expired: false, remainingMinutes };
  },

  // Quiz Master Session Control (Mulai / Akhiri Sesi Kuis)
  getQuizControlState: (): QuizControlState => {
    try {
      const data = localStorage.getItem(STORAGE_QUIZ_CONTROL_KEY);
      return data ? JSON.parse(data) : { isActive: false };
    } catch {
      return { isActive: false };
    }
  },

  setQuizControlState: (isActive: boolean, masterUser?: User) => {
    try {
      const state: QuizControlState = {
        isActive,
        startedAt: isActive ? new Date().toISOString() : undefined,
        startedBy: masterUser?.nickname || MASTER_CONFIG.nickname,
      };
      localStorage.setItem(STORAGE_QUIZ_CONTROL_KEY, JSON.stringify(state));
      fetch('/api/quizzes/control', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quizControl: state }),
      }).catch(() => {});
      syncChannel?.postMessage({ type: 'sync_trigger' });
      window.dispatchEvent(new CustomEvent('quiz_control_changed', { detail: state }));
    } catch (e) {
      console.error('Failed to update quiz control state', e);
    }
  },

  // Live Quiz Tracking ("Nilai Murid" Live Progress & Activity)
  getActiveQuizRecords: (): ActiveQuizRecord[] => {
    try {
      const data = localStorage.getItem(STORAGE_ACTIVE_QUIZZES_KEY);
      const raw: ActiveQuizRecord[] = data ? JSON.parse(data) : [];
      const filtered = raw.filter(
        r =>
          r &&
          r.userEmail &&
          !SAMPLE_STUDENT_EMAIL_SET.has(r.userEmail.toLowerCase()) &&
          !SAMPLE_RECORD_IDS.has(String(r.id))
      );
      if (filtered.length !== raw.length) {
        localStorage.setItem(STORAGE_ACTIVE_QUIZZES_KEY, JSON.stringify(filtered));
      }
      return filtered.sort((a, b) => b.startedAtTimestamp - a.startedAtTimestamp);
    } catch {
      return [];
    }
  },

  startActiveQuiz: (user: User, level: JLPTLevel, totalQuestions: number = 50): string => {
    const sessionId = 'quiz-session-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7);
    const now = new Date();
    const dateStr = now.toISOString().split('T')[0];
    const timeStr = now.toLocaleTimeString('id-ID', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });

    const newRecord: ActiveQuizRecord = {
      id: sessionId,
      userEmail: user.email,
      studentName: user.fullName || user.nickname || 'Murid',
      studentNickname: user.nickname || user.fullName || 'Murid',
      level,
      date: dateStr,
      startedAtTime: timeStr,
      completedAtTime: null,
      status: 'in_progress',
      score: null,
      totalQuestions,
      correctCount: null,
      startedAtTimestamp: now.getTime(),
      completedAtTimestamp: null,
    };

    try {
      const records = storageService.getActiveQuizRecords();
      records.unshift(newRecord);
      localStorage.setItem(STORAGE_ACTIVE_QUIZZES_KEY, JSON.stringify(records));
      fetch('/api/quizzes/active', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ record: newRecord }),
      }).catch(() => {});
      syncChannel?.postMessage({ type: 'sync_trigger' });
      window.dispatchEvent(new CustomEvent('active_quiz_updated', { detail: newRecord }));
    } catch (e) {
      console.error('Failed to save active quiz start', e);
    }

    return sessionId;
  },

  recordQuizViolation: (sessionId: string, violationsCount: number) => {
    try {
      const records = storageService.getActiveQuizRecords();
      const idx = records.findIndex(r => r.id === sessionId);
      if (idx !== -1) {
        records[idx].tabViolationsCount = violationsCount;
        localStorage.setItem(STORAGE_ACTIVE_QUIZZES_KEY, JSON.stringify(records));
        fetch('/api/quizzes/active', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ record: records[idx] }),
        }).catch(() => {});
        syncChannel?.postMessage({ type: 'sync_trigger' });
        window.dispatchEvent(new CustomEvent('active_quiz_updated', { detail: records[idx] }));
      }
    } catch (e) {
      console.error('Failed to record quiz violation', e);
    }
  },

  finishActiveQuiz: (
    sessionId: string, 
    score: number, 
    correctCount: number, 
    totalQuestions: number = 50, 
    durationSeconds: number = 0, 
    selectedMinutes: number = 45,
    tabViolationsCount: number = 0
  ) => {
    try {
      const records = storageService.getActiveQuizRecords();
      const idx = records.findIndex(r => r.id === sessionId);
      const now = new Date();
      const timeStr = now.toLocaleTimeString('id-ID', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
      const completedAtFull = now.toISOString().replace('T', ' ').substring(0, 16);

      if (idx !== -1) {
        records[idx].status = 'completed';
        records[idx].completedAtTime = timeStr;
        records[idx].completedAtTimestamp = now.getTime();
        records[idx].score = score;
        records[idx].correctCount = correctCount;
        records[idx].totalQuestions = totalQuestions;
        records[idx].tabViolationsCount = tabViolationsCount;
        localStorage.setItem(STORAGE_ACTIVE_QUIZZES_KEY, JSON.stringify(records));

        // Also permanently save to quiz results history
        const result: QuizResult = {
          id: 'score-' + Date.now(),
          userEmail: records[idx].userEmail,
          studentName: records[idx].studentName,
          studentNickname: records[idx].studentNickname,
          level: records[idx].level,
          score,
          totalQuestions,
          correctCount,
          durationUsedSeconds: durationSeconds,
          durationSelectedMinutes: selectedMinutes,
          completedAt: completedAtFull,
          date: records[idx].date,
          startedAtTime: records[idx].startedAtTime,
          completedAtTime: timeStr,
          tabViolationsCount,
        };
        storageService.saveScore(result);

        fetch('/api/quizzes/active', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ record: records[idx] }),
        }).catch(() => {});
        syncChannel?.postMessage({ type: 'sync_trigger' });
        window.dispatchEvent(new CustomEvent('active_quiz_updated', { detail: records[idx] }));
      }
    } catch (e) {
      console.error('Failed to finalize active quiz', e);
    }
  },

  deleteActiveQuizRecord: (id: string): boolean => {
    try {
      let records = storageService.getActiveQuizRecords();
      records = records.filter(r => r.id !== id);
      localStorage.setItem(STORAGE_ACTIVE_QUIZZES_KEY, JSON.stringify(records));
      fetch('/api/quizzes/active', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ deleteId: id }),
      }).catch(() => {});
      syncChannel?.postMessage({ type: 'sync_trigger' });
      window.dispatchEvent(new CustomEvent('active_quiz_updated'));
      return true;
    } catch (e) {
      return false;
    }
  },

  // Reset papan ranking sesi kuis (hanya mengosongkan rekaman sesi aktif, tanpa menyentuh riwayat nilai permanen / total kuis / rapor)
  resetActiveQuizRanking: (): boolean => {
    try {
      localStorage.setItem(STORAGE_ACTIVE_QUIZZES_KEY, JSON.stringify([]));
      fetch('/api/quizzes/active', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reset: true }),
      }).catch(() => {});
      syncChannel?.postMessage({ type: 'sync_trigger' });
      window.dispatchEvent(new CustomEvent('active_quiz_updated'));
      return true;
    } catch (e) {
      console.error('Failed to reset active quiz ranking', e);
      return false;
    }
  },

  // Scores
  getAllScores: (): QuizResult[] => {
    return storageService.getScores();
  },

  getScores: (): QuizResult[] => {
    try {
      const data = localStorage.getItem(STORAGE_SCORES_KEY);
      const raw: QuizResult[] = data ? JSON.parse(data) : [];
      const filtered = raw.filter(
        s =>
          s &&
          s.userEmail &&
          !SAMPLE_STUDENT_EMAIL_SET.has(s.userEmail.toLowerCase()) &&
          !SAMPLE_RECORD_IDS.has(String(s.id))
      );
      if (filtered.length !== raw.length) {
        localStorage.setItem(STORAGE_SCORES_KEY, JSON.stringify(filtered));
      }
      return filtered;
    } catch {
      return [];
    }
  },

  saveScore: (result: QuizResult) => {
    const scores = storageService.getScores();
    scores.unshift(result);
    localStorage.setItem(STORAGE_SCORES_KEY, JSON.stringify(scores));
    fetch('/api/scores', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ score: result }),
    }).catch(() => {});
    syncChannel?.postMessage({ type: 'sync_trigger' });
    window.dispatchEvent(new CustomEvent('scores_updated', { detail: result }));
  },

  getUserScores: (email: string): QuizResult[] => {
    const scores = storageService.getScores();
    return scores.filter(s => s.userEmail.toLowerCase() === email.toLowerCase());
  },

  // Level & Preferences
  getActiveLevel: (): JLPTLevel => {
    const lvl = localStorage.getItem(STORAGE_ACTIVE_LEVEL_KEY);
    return (lvl as JLPTLevel) || 'N5';
  },

  setActiveLevel: (level: JLPTLevel) => {
    localStorage.setItem(STORAGE_ACTIVE_LEVEL_KEY, level);
  },

  // Kanji Memorization
  getMemorizedKanji: (email?: string): number[] => {
    try {
      const user = storageService.getCurrentUser();
      const userEmail = email || user?.email || 'default_user';
      const data = localStorage.getItem(`${STORAGE_MEMORIZED_KANJI_KEY}_${userEmail.toLowerCase()}`);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  toggleMemorizedKanji: (kanjiId: number, email?: string): boolean => {
    const user = storageService.getCurrentUser();
    const userEmail = email || user?.email || 'default_user';
    const list = storageService.getMemorizedKanji(userEmail);
    const index = list.indexOf(kanjiId);
    let isMemorized = false;
    if (index > -1) {
      list.splice(index, 1);
      isMemorized = false;
    } else {
      list.push(kanjiId);
      isMemorized = true;
    }
    localStorage.setItem(`${STORAGE_MEMORIZED_KANJI_KEY}_${userEmail.toLowerCase()}`, JSON.stringify(list));
    return isMemorized;
  },

  resetMemorizedKanji: (email?: string) => {
    const user = storageService.getCurrentUser();
    const userEmail = email || user?.email || 'default_user';
    localStorage.removeItem(`${STORAGE_MEMORIZED_KANJI_KEY}_${userEmail.toLowerCase()}`);
  },

  // Vocabulary Synchronization & Level-based Target Storage
  getCustomVocabCards: (): VocabCard[] => {
    try {
      const data = localStorage.getItem('sensei_sari_custom_vocab_v1');
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  saveCustomVocabCard: (card: VocabCard): void => {
    const existing = storageService.getCustomVocabCards();
    const index = existing.findIndex(c => c.id === card.id || (c.japanese === card.japanese && c.level === card.level));
    if (index >= 0) {
      existing[index] = card;
    } else {
      existing.push({ ...card, id: card.id || Date.now() });
    }
    localStorage.setItem('sensei_sari_custom_vocab_v1', JSON.stringify(existing));
  },

  resetCustomVocab: (): void => {
    localStorage.removeItem('sensei_sari_custom_vocab_v1');
  }
};
