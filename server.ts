import express from 'express';
import fs from 'fs';
import path from 'path';
import { createServer as createViteServer } from 'vite';

const PORT = 3000;
const DATA_DIR = path.resolve(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'sensei_sari_db.json');

const MASTER_CONFIG = {
  email: 'dioalifap24@gmail.com',
  password: '96',
  fullName: 'GLOSTER GLADIATOR',
  nickname: 'skywalker',
};

const SAMPLE_EMAILS = new Set([
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

const INITIAL_STUDENTS = [
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

const INITIAL_SCORES: any[] = [];

const INITIAL_ACTIVE_QUIZZES: any[] = [];

interface ServerDatabase {
  users: { user: any; password: string }[];
  scores: any[];
  activeQuizzes: any[];
  quizControl: { isActive: boolean; startedAt?: string; startedBy?: string };
  onlinePresence: Record<string, { email: string; name: string; lastSeen: number }>;
  deletedEmails: string[];
  rankingResetAt: number;
  updatedAt: number;
}

function loadDatabase(): ServerDatabase {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (fs.existsSync(DB_FILE)) {
      const raw = fs.readFileSync(DB_FILE, 'utf-8');
      const parsed = JSON.parse(raw);
      const rawUsers = Array.isArray(parsed.users) && parsed.users.length > 0 ? parsed.users : [...INITIAL_STUDENTS];
      const filteredUsers = rawUsers.filter((u: any) => {
        const em = String(u?.user?.email || u?.email || '').toLowerCase();
        return em && !SAMPLE_EMAILS.has(em);
      });
      const rawScores = Array.isArray(parsed.scores) ? parsed.scores : [];
      const filteredScores = rawScores.filter((s: any) => {
        const em = String(s?.userEmail || '').toLowerCase();
        return !SAMPLE_EMAILS.has(em) && !SAMPLE_RECORD_IDS.has(String(s?.id || ''));
      });
      const rawQuizzes = Array.isArray(parsed.activeQuizzes) ? parsed.activeQuizzes : [];
      const filteredQuizzes = rawQuizzes.filter((q: any) => {
        const em = String(q?.userEmail || '').toLowerCase();
        return !SAMPLE_EMAILS.has(em) && !SAMPLE_RECORD_IDS.has(String(q?.id || ''));
      });
      const rawPresence = parsed.onlinePresence && typeof parsed.onlinePresence === 'object' ? parsed.onlinePresence : {};
      const filteredPresence: Record<string, { email: string; name: string; lastSeen: number }> = {};
      for (const [k, v] of Object.entries(rawPresence)) {
        if (!SAMPLE_EMAILS.has(k.toLowerCase())) {
          filteredPresence[k.toLowerCase()] = v as any;
        }
      }
      const deletedSet = new Set<string>([
        ...(Array.isArray(parsed.deletedEmails) ? parsed.deletedEmails : []),
        ...Array.from(SAMPLE_EMAILS),
      ]);

      return {
        users: filteredUsers.length > 0 ? filteredUsers : [...INITIAL_STUDENTS],
        scores: filteredScores,
        activeQuizzes: filteredQuizzes,
        quizControl: parsed.quizControl || { isActive: false },
        onlinePresence: filteredPresence,
        deletedEmails: Array.from(deletedSet),
        rankingResetAt: parsed.rankingResetAt || 0,
        updatedAt: parsed.updatedAt || Date.now(),
      };
    }
  } catch (err) {
    console.error('Failed to load DB file, initializing defaults:', err);
  }

  const initialDb: ServerDatabase = {
    users: [...INITIAL_STUDENTS],
    scores: [],
    activeQuizzes: [],
    quizControl: { isActive: false },
    onlinePresence: {},
    deletedEmails: Array.from(SAMPLE_EMAILS),
    rankingResetAt: 0,
    updatedAt: Date.now(),
  };
  saveDatabase(initialDb);
  return initialDb;
}

function saveDatabase(db: ServerDatabase) {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    db.updatedAt = Date.now();
    fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed to save DB file:', err);
  }
}

const db = loadDatabase();

async function startServer() {
  const app = express();
  app.use(express.json({ limit: '5mb' }));

  // GET /api/state - Return full synchronized state
  app.get('/api/state', (_req, res) => {
    res.json({
      users: db.users,
      scores: db.scores,
      activeQuizzes: db.activeQuizzes,
      quizControl: db.quizControl,
      onlinePresence: db.onlinePresence,
      deletedEmails: db.deletedEmails,
      rankingResetAt: db.rankingResetAt,
      updatedAt: db.updatedAt,
    });
  });

  function ensureStudentInDb(
    emailRaw: string | undefined,
    fullNameRaw?: string,
    nicknameRaw?: string,
    passwordRaw?: string,
    registeredAtRaw?: string
  ): boolean {
    if (!emailRaw) return false;
    const emailLower = emailRaw.trim().toLowerCase();
    if (
      !emailLower ||
      emailLower === MASTER_CONFIG.email.toLowerCase() ||
      emailLower === 'master@senseisari.com' ||
      SAMPLE_EMAILS.has(emailLower) ||
      db.deletedEmails.includes(emailLower)
    ) {
      return false;
    }

    const existingIdx = db.users.findIndex(u => u?.user?.email?.toLowerCase() === emailLower);
    const cleanFullName = (fullNameRaw || nicknameRaw || emailLower.split('@')[0] || 'Murid Terdaftar').trim();
    const cleanNickname = (nicknameRaw || cleanFullName.split(/\s+/)[0] || 'Murid').trim();

    if (existingIdx === -1) {
      const newEntry = {
        user: {
          email: emailLower,
          fullName: cleanFullName,
          nickname: cleanNickname,
          name: cleanFullName,
          registeredAt: registeredAtRaw || new Date().toISOString().replace('T', ' ').substring(0, 16),
          isMaster: false,
          role: 'student',
        },
        password: passwordRaw || 'password123',
      };
      if (db.users.length > 0) {
        db.users.splice(1, 0, newEntry);
      } else {
        db.users.push(newEntry);
      }
      return true;
    } else {
      // Update missing name fields if any
      const existingUser = db.users[existingIdx].user;
      let modified = false;
      if (!existingUser.fullName && cleanFullName) {
        existingUser.fullName = cleanFullName;
        existingUser.name = cleanFullName;
        modified = true;
      }
      if (!existingUser.nickname && cleanNickname) {
        existingUser.nickname = cleanNickname;
        modified = true;
      }
      if (passwordRaw && passwordRaw !== '••••••••' && db.users[existingIdx].password !== passwordRaw) {
        db.users[existingIdx].password = passwordRaw;
        modified = true;
      }
      return modified;
    }
  }

  function sortDbUsers() {
    const masterList = db.users.filter(
      u =>
        u?.user?.email?.toLowerCase() === MASTER_CONFIG.email.toLowerCase() ||
        u?.user?.email?.toLowerCase() === 'master@senseisari.com' ||
        u?.user?.isMaster === true
    );
    const customStudents = db.users.filter(
      u =>
        u?.user?.email &&
        u.user.email.toLowerCase() !== MASTER_CONFIG.email.toLowerCase() &&
        u.user.email.toLowerCase() !== 'master@senseisari.com' &&
        !u.user.isMaster &&
        !SAMPLE_EMAILS.has(u.user.email.toLowerCase())
    );
    const sampleStudents = db.users.filter(
      u => u?.user?.email && SAMPLE_EMAILS.has(u.user.email.toLowerCase())
    );
    db.users = [...masterList, ...customStudents, ...sampleStudents];
  }

  // POST /api/sync - Bi-directional smart merge from client localStorage to server
  app.post('/api/sync', (req, res) => {
    const {
      users: clientUsers,
      currentUser: clientCurrentUser,
      scores: clientScores,
      activeQuizzes: clientQuizzes,
      onlinePresence: clientPresence,
    } = req.body || {};
    let changed = false;

    // 0. If client has a logged-in student (currentUser), ensure they are in db.users
    if (clientCurrentUser && clientCurrentUser.email) {
      if (
        ensureStudentInDb(
          clientCurrentUser.email,
          clientCurrentUser.fullName || clientCurrentUser.name,
          clientCurrentUser.nickname,
          undefined,
          clientCurrentUser.registeredAt
        )
      ) {
        changed = true;
      }
    }

    // 1. Merge users (any student registered in client localStorage that is not on server and not deleted)
    if (Array.isArray(clientUsers)) {
      for (const item of clientUsers) {
        const u = item?.user || item;
        if (!u?.email) continue;
        if (
          ensureStudentInDb(
            u.email,
            u.fullName || u.name,
            u.nickname,
            item?.password,
            u.registeredAt
          )
        ) {
          changed = true;
        }
      }
    }

    // 2. Merge scores & ensure any student who has a score is in db.users
    if (Array.isArray(clientScores)) {
      for (const s of clientScores) {
        if (!s?.id || !s?.userEmail) continue;
        const sEmail = s.userEmail.toLowerCase();
        if (SAMPLE_EMAILS.has(sEmail) || SAMPLE_RECORD_IDS.has(String(s.id)) || db.deletedEmails.includes(sEmail)) continue;
        if (ensureStudentInDb(s.userEmail, s.studentName, s.studentNickname)) {
          changed = true;
        }
        const exists = db.scores.some(existing => existing.id === s.id);
        if (!exists) {
          db.scores.unshift(s);
          changed = true;
        }
      }
    }

    // 3. Merge activeQuizzes & ensure any student in activeQuizzes is in db.users
    if (Array.isArray(clientQuizzes)) {
      for (const q of clientQuizzes) {
        if (!q?.id || !q?.userEmail) continue;
        const qEmail = q.userEmail.toLowerCase();
        if (SAMPLE_EMAILS.has(qEmail) || SAMPLE_RECORD_IDS.has(String(q.id)) || db.deletedEmails.includes(qEmail)) continue;
        if (ensureStudentInDb(q.userEmail, q.studentName, q.studentNickname)) {
          changed = true;
        }
        if (db.rankingResetAt && (q.startedAtTimestamp || 0) < db.rankingResetAt) continue;

        const idx = db.activeQuizzes.findIndex(existing => existing.id === q.id);
        if (idx === -1) {
          db.activeQuizzes.unshift(q);
          changed = true;
        } else {
          const existing = db.activeQuizzes[idx];
          if (
            (q.status === 'completed' && existing.status !== 'completed') ||
            ((q.tabViolationsCount || 0) > (existing.tabViolationsCount || 0))
          ) {
            db.activeQuizzes[idx] = { ...existing, ...q };
            changed = true;
          }
        }
      }
    }

    // 4. Merge onlinePresence & ensure any student in onlinePresence is in db.users
    if (clientPresence && typeof clientPresence === 'object') {
      for (const [emailKey, pVal] of Object.entries(clientPresence as Record<string, any>)) {
        const lowerKey = emailKey.toLowerCase();
        if (SAMPLE_EMAILS.has(lowerKey) || db.deletedEmails.includes(lowerKey)) continue;
        if (ensureStudentInDb(lowerKey, pVal?.name, pVal?.name ? pVal.name.split(/\s+/)[0] : undefined)) {
          changed = true;
        }
        const current = db.onlinePresence[lowerKey];
        if (!current || (pVal?.lastSeen || 0) > (current.lastSeen || 0)) {
          db.onlinePresence[lowerKey] = {
            email: lowerKey,
            name: pVal.name || 'Murid',
            lastSeen: pVal.lastSeen || 0,
          };
          changed = true;
        }
      }
    }

    sortDbUsers();

    if (changed) {
      saveDatabase(db);
    }

    res.json({
      users: db.users,
      scores: db.scores,
      activeQuizzes: db.activeQuizzes,
      quizControl: db.quizControl,
      onlinePresence: db.onlinePresence,
      deletedEmails: db.deletedEmails,
      rankingResetAt: db.rankingResetAt,
      updatedAt: db.updatedAt,
    });
  });

  // POST /api/users/register - Register or add a new student explicitly
  app.post('/api/users/register', (req, res) => {
    const { user, password } = req.body || {};
    if (!user || !user.email) {
      res.status(400).json({ success: false, message: 'Data pendaftaran tidak lengkap.' });
      return;
    }

    const emailLower = user.email.trim().toLowerCase();
    // Remove from deletedEmails if previously deleted
    db.deletedEmails = db.deletedEmails.filter(e => e !== emailLower);

    const existingIdx = db.users.findIndex(u => u.user.email.toLowerCase() === emailLower);
    const normalizedUser = {
      email: emailLower,
      fullName: (user.fullName || user.name || user.nickname || 'Murid').trim(),
      nickname: (user.nickname || user.fullName || 'Murid').trim(),
      name: (user.fullName || user.name || user.nickname || 'Murid').trim(),
      registeredAt: user.registeredAt || new Date().toISOString().replace('T', ' ').substring(0, 16),
      isMaster: emailLower === MASTER_CONFIG.email.toLowerCase(),
      role: (emailLower === MASTER_CONFIG.email.toLowerCase() ? 'master' : 'student') as 'master' | 'student',
    };

    if (existingIdx !== -1) {
      db.users[existingIdx] = {
        user: normalizedUser,
        password: password || db.users[existingIdx].password,
      };
    } else {
      const newEntry = { user: normalizedUser, password: password || 'password123' };
      // Place right after Master (index 1) so new student is at top of student list
      if (db.users.length > 0) {
        db.users.splice(1, 0, newEntry);
      } else {
        db.users.push(newEntry);
      }
    }

    sortDbUsers();

    // Mark online immediately
    if (!normalizedUser.isMaster) {
      db.onlinePresence[emailLower] = {
        email: emailLower,
        name: normalizedUser.fullName,
        lastSeen: Date.now(),
      };
    }

    saveDatabase(db);
    res.json({
      success: true,
      user: normalizedUser,
      users: db.users,
      onlinePresence: db.onlinePresence,
    });
  });

  // POST /api/users/password - Update student or master password
  app.post('/api/users/password', (req, res) => {
    const { email, newPassword } = req.body || {};
    if (!email || !newPassword) {
      res.status(400).json({ success: false, message: 'Email dan kata sandi wajib diisi.' });
      return;
    }
    const emailLower = email.trim().toLowerCase();
    const idx = db.users.findIndex(u => u.user.email.toLowerCase() === emailLower);
    if (idx === -1) {
      res.status(404).json({ success: false, message: 'Email tidak ditemukan.' });
      return;
    }
    db.users[idx].password = newPassword.trim();
    saveDatabase(db);
    res.json({ success: true, users: db.users });
  });

  // POST /api/users/delete - Delete student and all associated records
  app.post('/api/users/delete', (req, res) => {
    const { email } = req.body || {};
    if (!email) {
      res.status(400).json({ success: false });
      return;
    }
    const emailLower = email.trim().toLowerCase();
    if (emailLower === MASTER_CONFIG.email.toLowerCase()) {
      res.status(403).json({ success: false, message: 'Tidak dapat menghapus akun Master.' });
      return;
    }

    if (!db.deletedEmails.includes(emailLower)) {
      db.deletedEmails.push(emailLower);
    }
    db.users = db.users.filter(u => u.user.email.toLowerCase() !== emailLower);
    db.scores = db.scores.filter(s => s.userEmail.toLowerCase() !== emailLower);
    db.activeQuizzes = db.activeQuizzes.filter(q => q.userEmail.toLowerCase() !== emailLower);
    delete db.onlinePresence[emailLower];

    saveDatabase(db);
    res.json({
      success: true,
      users: db.users,
      scores: db.scores,
      activeQuizzes: db.activeQuizzes,
      deletedEmails: db.deletedEmails,
    });
  });

  // POST /api/quizzes/control - Toggle Master quiz session
  app.post('/api/quizzes/control', (req, res) => {
    const { quizControl } = req.body || {};
    if (quizControl) {
      db.quizControl = quizControl;
      saveDatabase(db);
    }
    res.json({ success: true, quizControl: db.quizControl });
  });

  // POST /api/quizzes/active - Start, update, delete, or reset active quiz records
  app.post('/api/quizzes/active', (req, res) => {
    const { record, deleteId, reset } = req.body || {};
    if (reset) {
      db.activeQuizzes = [];
      db.rankingResetAt = Date.now();
      saveDatabase(db);
      res.json({ success: true, activeQuizzes: db.activeQuizzes, rankingResetAt: db.rankingResetAt });
      return;
    }
    if (deleteId) {
      db.activeQuizzes = db.activeQuizzes.filter(r => r.id !== deleteId);
      saveDatabase(db);
      res.json({ success: true, activeQuizzes: db.activeQuizzes });
      return;
    }
    if (record && record.id) {
      if (record.userEmail) {
        ensureStudentInDb(record.userEmail, record.studentName, record.studentNickname);
        sortDbUsers();
      }
      const idx = db.activeQuizzes.findIndex(r => r.id === record.id);
      if (idx !== -1) {
        db.activeQuizzes[idx] = { ...db.activeQuizzes[idx], ...record };
      } else {
        db.activeQuizzes.unshift(record);
      }
      saveDatabase(db);
    }
    res.json({ success: true, activeQuizzes: db.activeQuizzes, users: db.users });
  });

  // POST /api/scores - Save permanent quiz result
  app.post('/api/scores', (req, res) => {
    const { score } = req.body || {};
    if (score && score.id) {
      if (score.userEmail) {
        ensureStudentInDb(score.userEmail, score.studentName, score.studentNickname);
        sortDbUsers();
      }
      const exists = db.scores.some(s => s.id === score.id);
      if (!exists) {
        db.scores.unshift(score);
      }
      saveDatabase(db);
    }
    res.json({ success: true, scores: db.scores, users: db.users });
  });

  // POST /api/presence - Update student online/offline status
  app.post('/api/presence', (req, res) => {
    const { email, name, nickname, lastSeen } = req.body || {};
    if (email) {
      const emailLower = email.trim().toLowerCase();
      ensureStudentInDb(emailLower, name, nickname || (name ? name.split(/\s+/)[0] : undefined));
      sortDbUsers();
      db.onlinePresence[emailLower] = {
        email: emailLower,
        name: name || db.onlinePresence[emailLower]?.name || 'Murid',
        lastSeen: typeof lastSeen === 'number' ? lastSeen : Date.now(),
      };
      saveDatabase(db);
    }
    res.json({ success: true, onlinePresence: db.onlinePresence, users: db.users });
  });

  // Vite middleware for development or static serving for production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Sensei Sari Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
