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

// Penyedia Verifikasi Perubahan Kata Sandi Resmi
export const VERIFICATION_PROVIDER = {
  name: 'Sensei Sari Auth Security Center',
  email: 'security-verify@senseisari-center.id',
  subject: '[Verifikasi Keamanan] Kode Verifikasi Pembaruan Kata Sandi Murid Sensei Sari',
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

// Seed sample online presence so Master sees realistic presence on load
const INITIAL_PRESENCE: Record<string, { email: string; name: string; lastSeen: number }> = {
  'budi.santoso@gmail.com': {
    email: 'budi.santoso@gmail.com',
    name: 'Budi Santoso',
    lastSeen: Date.now() - 5000, // 5 detik lalu (Online)
  },
  'anisa.dewi@gmail.com': {
    email: 'anisa.dewi@gmail.com',
    name: 'Anisa Dewi Lestari',
    lastSeen: Date.now() - 12000, // 12 detik lalu (Online)
  },
  'rizky.pratama@gmail.com': {
    email: 'rizky.pratama@gmail.com',
    name: 'Rizky Pratama Putra',
    lastSeen: Date.now() - 3600000, // 1 jam lalu (Offline)
  },
  'putri.ayu@gmail.com': {
    email: 'putri.ayu@gmail.com',
    name: 'Putri Ayu Wandira',
    lastSeen: Date.now() - 7200000, // 2 jam lalu (Offline)
  },
};

// Seed sample students and quiz scores if empty, including Master Account
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
      email: 'budi.santoso@gmail.com', 
      fullName: 'Budi Santoso', 
      nickname: 'Budi', 
      name: 'Budi Santoso', 
      registeredAt: '2026-09-12 10:15',
      isMaster: false,
      role: 'student',
    },
    password: 'password123',
  },
  {
    user: { 
      email: 'anisa.dewi@gmail.com', 
      fullName: 'Anisa Dewi Lestari', 
      nickname: 'Anisa', 
      name: 'Anisa Dewi Lestari', 
      registeredAt: '2026-09-15 14:20',
      isMaster: false,
      role: 'student',
    },
    password: 'password123',
  },
  {
    user: { 
      email: 'rizky.pratama@gmail.com', 
      fullName: 'Rizky Pratama Putra', 
      nickname: 'Rizky', 
      name: 'Rizky Pratama Putra', 
      registeredAt: '2026-09-20 09:40',
      isMaster: false,
      role: 'student',
    },
    password: 'password123',
  },
  {
    user: { 
      email: 'putri.ayu@gmail.com', 
      fullName: 'Putri Ayu Wandira', 
      nickname: 'Putri', 
      name: 'Putri Ayu Wandira', 
      registeredAt: '2026-09-25 16:30',
      isMaster: false,
      role: 'student',
    },
    password: 'password123',
  },
];

const INITIAL_SCORES: QuizResult[] = [
  {
    id: 'score-1',
    userEmail: 'anisa.dewi@gmail.com',
    studentName: 'Anisa Dewi Lestari',
    studentNickname: 'Anisa',
    level: 'N5',
    score: 96,
    totalQuestions: 50,
    correctCount: 48,
    durationUsedSeconds: 1650,
    durationSelectedMinutes: 45,
    completedAt: '2026-09-28 14:10',
    date: '2026-09-28',
    startedAtTime: '13:42:30',
    completedAtTime: '14:10:00',
  },
  {
    id: 'score-2',
    userEmail: 'budi.santoso@gmail.com',
    studentName: 'Budi Santoso',
    studentNickname: 'Budi',
    level: 'N5',
    score: 68, // merah
    totalQuestions: 50,
    correctCount: 34,
    durationUsedSeconds: 2100,
    durationSelectedMinutes: 45,
    completedAt: '2026-09-28 16:45',
    date: '2026-09-28',
    startedAtTime: '16:10:00',
    completedAtTime: '16:45:00',
  },
  {
    id: 'score-3',
    userEmail: 'rizky.pratama@gmail.com',
    studentName: 'Rizky Pratama Putra',
    studentNickname: 'Rizky',
    level: 'N4',
    score: 48, // hitam
    totalQuestions: 50,
    correctCount: 24,
    durationUsedSeconds: 2400,
    durationSelectedMinutes: 45,
    completedAt: '2026-09-29 11:20',
    date: '2026-09-29',
    startedAtTime: '10:40:00',
    completedAtTime: '11:20:00',
  },
  {
    id: 'score-4',
    userEmail: 'putri.ayu@gmail.com',
    studentName: 'Putri Ayu Wandira',
    studentNickname: 'Putri',
    level: 'N3',
    score: 86, // hijau
    totalQuestions: 50,
    correctCount: 43,
    durationUsedSeconds: 3120,
    durationSelectedMinutes: 60,
    completedAt: '2026-09-29 17:05',
    date: '2026-09-29',
    startedAtTime: '16:13:00',
    completedAtTime: '17:05:00',
  },
];

const INITIAL_ACTIVE_QUIZZES: ActiveQuizRecord[] = [
  {
    id: 'active-sample-1',
    userEmail: 'budi.santoso@gmail.com',
    studentName: 'Budi Santoso',
    studentNickname: 'Budi',
    level: 'N4',
    date: new Date().toISOString().split('T')[0],
    startedAtTime: '14:20:00',
    completedAtTime: null,
    status: 'in_progress',
    score: null,
    totalQuestions: 50,
    correctCount: null,
    startedAtTimestamp: Date.now() - 15 * 60 * 1000,
  },
  {
    id: 'active-sample-2',
    userEmail: 'anisa.dewi@gmail.com',
    studentName: 'Anisa Dewi Lestari',
    studentNickname: 'Anisa',
    level: 'N5',
    date: '2026-09-28',
    startedAtTime: '13:42:30',
    completedAtTime: '14:10:00',
    status: 'completed',
    score: 96,
    totalQuestions: 50,
    correctCount: 48,
    startedAtTimestamp: Date.now() - 86400000,
    completedAtTimestamp: Date.now() - 86400000 + 1650000,
  },
  {
    id: 'active-sample-3',
    userEmail: 'budi.santoso@gmail.com',
    studentName: 'Budi Santoso',
    studentNickname: 'Budi',
    level: 'N5',
    date: '2026-09-28',
    startedAtTime: '16:10:00',
    completedAtTime: '16:45:00',
    status: 'completed',
    score: 68,
    totalQuestions: 50,
    correctCount: 34,
    startedAtTimestamp: Date.now() - 86400000,
    completedAtTimestamp: Date.now() - 86400000 + 2100000,
  },
  {
    id: 'active-sample-4',
    userEmail: 'rizky.pratama@gmail.com',
    studentName: 'Rizky Pratama Putra',
    studentNickname: 'Rizky',
    level: 'N4',
    date: '2026-09-29',
    startedAtTime: '10:40:00',
    completedAtTime: '11:20:00',
    status: 'completed',
    score: 48,
    totalQuestions: 50,
    correctCount: 24,
    startedAtTimestamp: Date.now() - 43200000,
    completedAtTimestamp: Date.now() - 43200000 + 2400000,
  },
];

export const storageService = {
  // Initialize default data if needed
  init: () => {
    try {
      if (!localStorage.getItem(STORAGE_USERS_KEY)) {
        localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(INITIAL_STUDENTS));
      } else {
        // Ensure master account in storage always has the updated full name and nickname
        const users: { user: User; password: string }[] = JSON.parse(localStorage.getItem(STORAGE_USERS_KEY) || '[]');
        let updated = false;
        const masterIdx = users.findIndex(u => u.user.email.toLowerCase() === MASTER_CONFIG.email.toLowerCase());
        if (masterIdx !== -1) {
          // Jika kata sandi masih menggunakan default lama '1234567890', perbarui otomatis ke '96'
          if (users[masterIdx].password === '1234567890') {
            users[masterIdx].password = MASTER_CONFIG.password;
            updated = true;
          }
          if (users[masterIdx].user.fullName !== MASTER_CONFIG.fullName || users[masterIdx].user.nickname !== MASTER_CONFIG.nickname) {
            users[masterIdx].user.fullName = MASTER_CONFIG.fullName;
            users[masterIdx].user.nickname = MASTER_CONFIG.nickname;
            users[masterIdx].user.name = MASTER_CONFIG.fullName;
            users[masterIdx].user.isMaster = true;
            users[masterIdx].user.role = 'master';
            updated = true;
          }
        } else {
          users.unshift({
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
          updated = true;
        }
        if (updated) {
          localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(users));
        }
      }

      if (!localStorage.getItem(STORAGE_SCORES_KEY)) {
        localStorage.setItem(STORAGE_SCORES_KEY, JSON.stringify(INITIAL_SCORES));
      }

      if (!localStorage.getItem(STORAGE_ACTIVE_QUIZZES_KEY)) {
        localStorage.setItem(STORAGE_ACTIVE_QUIZZES_KEY, JSON.stringify(INITIAL_ACTIVE_QUIZZES));
      }

      if (!localStorage.getItem(STORAGE_QUIZ_CONTROL_KEY)) {
        localStorage.setItem(STORAGE_QUIZ_CONTROL_KEY, JSON.stringify({ isActive: false }));
      }
    } catch (e) {
      console.error('Storage initialization failed', e);
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

  // Auth & Users
  getUsers: (): { user: User; password: string }[] => {
    try {
      const data = localStorage.getItem(STORAGE_USERS_KEY);
      return data ? JSON.parse(data) : INITIAL_STUDENTS;
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
      if (cleanPass.length < 8) {
        return { success: false, message: 'Kata sandi murid wajib minimal 8 karakter.' };
      }
    }

    const users = storageService.getUsers();
    const idx = users.findIndex(u => u.user.email.toLowerCase() === trimmedEmail);
    if (idx === -1) {
      return { success: false, message: 'Alamat email tidak ditemukan dalam sistem.' };
    }
    users[idx].password = cleanPass;
    localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(users));
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

    if (cleanPass.length < 8) {
      return { success: false, message: 'Kata sandi baru murid wajib minimal 8 karakter.' };
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

      // 4. Trigger live event
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
    const trimmedNickname = nickname.trim();
    const trimmedEmail = email.trim().toLowerCase();

    // 1. Validasi Nama Lengkap
    if (!trimmedFullName || trimmedFullName.length < 3) {
      return { valid: false, message: 'Nama lengkap wajib diisi (minimal 3 karakter).' };
    }

    if (!/[a-zA-Z]/.test(trimmedFullName)) {
      return { valid: false, message: 'Nama lengkap harus menggunakan huruf alfabet yang sah.' };
    }

    // Blacklist kata kunci nama anonim
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
      'unknown',
      'guest',
      'tamu',
      'pengguna',
      'user',
      'test',
      'tester',
      'testing',
      'dummy',
      'admin',
      'administrator',
      'asdf',
      'qwerty',
      'sample',
      'contoh',
      'fake',
      'palsu',
      'siapa saja',
      'tidak ada',
      'null',
      'undefined',
      'xxx',
      'abc',
      '123',
    ];

    const lowerFullName = trimmedFullName.toLowerCase();
    const lowerWords = lowerFullName.split(/[\s,.-]+/);
    for (const kw of ANONYMOUS_NAME_KEYWORDS) {
      if (lowerFullName === kw || lowerWords.includes(kw)) {
        return { 
          valid: false, 
          message: `Pendaftaran ditolak: Dilarang menggunakan nama anonim/samaran ("${trimmedFullName}"). Wajib menggunakan nama lengkap asli.` 
        };
      }
    }

    // Memastikan nama lengkap memiliki setidaknya 2 kata (contoh: "Budi Santoso", "Siti Rahmawati")
    const nameParts = trimmedFullName.split(/\s+/).filter(w => w.length > 0);
    if (nameParts.length < 2) {
      return { 
        valid: false, 
        message: 'Harap masukkan nama lengkap Anda (minimal 2 kata, contoh: Budi Santoso) demi ketertiban rapor murid Sensei Sari.' 
      };
    }

    if (nameParts.some(p => p.length < 2)) {
      return { 
        valid: false, 
        message: 'Setiap bagian nama harus minimal 2 karakter (bukan inisial satu huruf).' 
      };
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

    // Blacklist username email anonim
    const ANONYMOUS_EMAIL_PREFIXES = [
      'anon',
      'anonim',
      'anonymous',
      'tanpanama',
      'hambaallah',
      'nobody',
      'dummy',
      'fake',
      'junk',
      'temp',
      'throwaway',
      'disposable',
      'tester',
      'test',
      'noname',
      'no.name',
      'asdf',
      'qwerty',
      'user123',
    ];

    for (const prefix of ANONYMOUS_EMAIL_PREFIXES) {
      if (username === prefix || username.startsWith(prefix + '.') || username.startsWith(prefix + '_') || username.startsWith(prefix + '1')) {
        return { 
          valid: false, 
          message: `Pendaftaran ditolak: Dilarang menggunakan alamat email anonim/dummy ("${trimmedEmail}"). Harap gunakan email pribadi asli Anda.` 
        };
      }
    }

    // Blacklist domain disposable / temp mail
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
      'getairmail.com',
      'mytemp.email',
      'generator.email',
      'burnermail.io',
      'crazymailing.com',
      'mohmal.com',
      'inboxkitten.com',
      'anonymouse.org',
      'anonaddy.me',
      'anonaddy.com',
      'simplelogin.co',
      'simplelogin.io',
      'relay.firefox.com',
      'duck.com',
      'zillamail.com',
      'fakemailgenerator.com',
      'emailondeck.com',
      'dropmail.me',
      'mytempmail.com',
      'luxusmail.com',
      'maildrop.cc',
      'harakirimail.com',
      'getnada.com',
      'nada.ltd',
      'abhy.com',
      'boun.cr',
      'armyspy.com',
      'cuvox.de',
      'dayrep.com',
      'einrot.com',
      'fleckens.hu',
      'gustr.com',
      'jourrapide.com',
      'rhyta.com',
      'superrito.com',
      'teleworm.us',
      'test.com',
      'example.com',
      'sample.com',
      'mail.com',
      'inbox.test',
      'dummy.com',
    ];

    if (DISPOSABLE_EMAIL_DOMAINS.includes(domain)) {
      return { 
        valid: false, 
        message: `Pendaftaran ditolak: Layanan email sementara ("${domain}") dilarang. Harap gunakan penyedia email resmi (Gmail, Yahoo, Outlook, atau email institusi).` 
      };
    }

    const suspiciousKeywords = ['temp', 'fake', 'dispos', 'throw', 'trash', 'junk', 'guerrilla', 'anon', '10min', 'burner', 'dropmail'];
    if (suspiciousKeywords.some(kw => domain.includes(kw))) {
      return { 
        valid: false, 
        message: `Pendaftaran ditolak: Domain email "${domain}" terdeteksi sebagai email sementara/anonim. Harap gunakan email pribadi asli Anda.` 
      };
    }

    // 4. Validasi Kata Sandi Murid (Minimal 8 Karakter)
    if (!password || password.length < 8) {
      return { valid: false, message: 'Kata sandi murid wajib minimal 8 karakter demi keamanan akun Anda.' };
    }

    return { valid: true, message: 'Valid' };
  },

  register: (
    email: string, 
    password: string, 
    fullName: string, 
    nickname: string
  ): { success: boolean; message: string; user?: User } => {
    // Validasi pencegahan akun anonim
    const validation = storageService.validateStudentRegistration(fullName, nickname, email, password);
    if (!validation.valid) {
      return { success: false, message: validation.message };
    }

    const trimmedEmail = email.trim().toLowerCase();
    const trimmedFullName = fullName.trim();
    const trimmedNickname = nickname.trim();

    const users = storageService.getUsers();
    const existing = users.find(u => u.user.email.toLowerCase() === trimmedEmail);
    if (existing) {
      return { success: false, message: 'Email ini sudah terdaftar. Silakan masuk.' };
    }

    const newUser: User = {
      email: trimmedEmail,
      fullName: trimmedFullName,
      nickname: trimmedNickname,
      name: trimmedFullName,
      registeredAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      isMaster: false,
      role: 'student',
    };

    users.push({ user: newUser, password });
    localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(users));
    storageService.setCurrentUser(newUser);

    window.dispatchEvent(new CustomEvent('student_data_updated'));

    return { success: true, message: `Pendaftaran berhasil! Selamat datang, ${trimmedNickname}! 🌸`, user: newUser };
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
      return data ? JSON.parse(data) : INITIAL_PRESENCE;
    } catch {
      return INITIAL_PRESENCE;
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
      window.dispatchEvent(new CustomEvent('quiz_control_changed', { detail: state }));
    } catch (e) {
      console.error('Failed to update quiz control state', e);
    }
  },

  // Live Quiz Tracking ("Nilai Murid" Live Progress & Activity)
  getActiveQuizRecords: (): ActiveQuizRecord[] => {
    try {
      const data = localStorage.getItem(STORAGE_ACTIVE_QUIZZES_KEY);
      const records: ActiveQuizRecord[] = data ? JSON.parse(data) : INITIAL_ACTIVE_QUIZZES;
      // Sort newest start time first
      return records.sort((a, b) => b.startedAtTimestamp - a.startedAtTimestamp);
    } catch {
      return INITIAL_ACTIVE_QUIZZES;
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
      return data ? JSON.parse(data) : INITIAL_SCORES;
    } catch {
      return INITIAL_SCORES;
    }
  },

  saveScore: (result: QuizResult) => {
    const scores = storageService.getScores();
    scores.unshift(result);
    localStorage.setItem(STORAGE_SCORES_KEY, JSON.stringify(scores));
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
