import express from 'express';
import fs from 'fs';
import path from 'path';
import { createServer as createViteServer } from 'vite';

const PORT = 3000;
const DATA_DIR = path.resolve(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'sensei_sari_db.json');

// Cloud Sync Relay Endpoints (Menjembatani sinkronisasi real-time antara ais-dev, ais-pre, dan lintas perangkat)
const NTFY_SYNC_URL = 'https://ntfy.sh/sari_sensei_live_8890ebbf_v4';

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

interface PresenceEntry {
  email: string;
  name: string;
  nickname?: string;
  lastSeen: number;
  currentTab?: string;
  currentActivity?: string;
  activeLevel?: string;
  quizProgress?: string;
  lastActionAt?: string;
  screenshotAttempts?: number;
  aiTranslateAttempts?: number;
}

const DEFAULT_LEMBAR_1_QUESTIONS: string[] = [
  'Saya adalah Bagas',
  'Dia (perempuan) adalah selvia tri haryani',
  'Rianti adalah seorang dokter',
  'Bagas bukan orang china',
  'Jimmy adalah orang jerman',
  'Dia (laki-laki) bukan seorang peneliti',
  'Rizki adalah seorang pelajar, Rani juga seorang pelajar',
  'Ini adalah majalah sepeda',
  'Disini adalah ruang kelas amakusa',
  '89.901',
  '9.087',
  '673.567',
  'Mobil ini adalah mobil buatan Jerman',
  'Hasan membaca majalah bola',
  'Saya tadi pagi minum kopi',
  'Kemarin malam Arin membeli kamera di toko kamera',
  'Saya bermain bola, setelah itu minum jus',
  'Guputa tidak makan daging sapi dan daging babi',
  'Sekarang jam 04.47 pagi',
  'Besok saya pergi ke selolah jam 05.58 pagi',
  'Setiap hari Putra istirahat siang dari jam 12.00 sampai jam 14.00',
  'Setiap malam Saya menonton film dari jam 19.39 sampai jam 20.57',
  'Kemarin adik laki-laki tidak makan apapun',
  'Bima pergi ke Jepang tanggal 19 Oktober 2026',
  '2 hari lalu Saya dan Rama belajar bahasa jerman di perpustakaan',
];

const DEFAULT_WORKSHEET_TASK = {
  id: 'task-lembar-1-sensei',
  title: 'Lembar 1: Tabel Latihan Soal Terjemahan & Kalimat Bahasa Jepang (25 Soal)',
  description:
    'Isi kolom 名前 (Nama) di atas tabel, lalu ketik terjemahan bahasa Jepang pada kolom tabel kosong di sebelah kanan setiap pertanyaan (Nomor 1 sampai 25). Klik Kumpulkan & Tandai Selesai setelah selesai.',
  level: 'N5',
  category: 'materi',
  dueDate: '2026-10-05',
  dueTime: '23:59',
  durationMinutes: 60,
  timerStatus: 'idle',
  createdAt: '2026-10-05 08:00',
  createdAtTimestamp: 1000,
  createdBy: 'skywalker',
  isActive: true,
  worksheetQuestions: DEFAULT_LEMBAR_1_QUESTIONS,
  completions: [],
  updatedAt: 1000,
};

function normalizeTaskTimestamp(ts?: number): number {
  if (!ts || typeof ts !== 'number') return 0;
  if (ts === 1791187200000) return 1000;
  return ts;
}

interface ServerDatabase {
  users: { user: any; password: string }[];
  scores: any[];
  activeQuizzes: any[];
  quizControl: { isActive: boolean; startedAt?: string; startedBy?: string; updatedAt?: number };
  onlinePresence: Record<string, PresenceEntry>;
  dailyTasks: any[];
  deletedTaskIds: string[];
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
      const filteredPresence: Record<string, PresenceEntry> = {};
      for (const [k, v] of Object.entries(rawPresence)) {
        if (!SAMPLE_EMAILS.has(k.toLowerCase())) {
          filteredPresence[k.toLowerCase()] = v as PresenceEntry;
        }
      }
      const deletedSet = new Set<string>([
        ...(Array.isArray(parsed.deletedEmails) ? parsed.deletedEmails : []),
        ...Array.from(SAMPLE_EMAILS),
      ]);
      const deletedTasksSet = new Set<string>(
        Array.isArray(parsed.deletedTaskIds) ? parsed.deletedTaskIds.map((id: any) => String(id)) : []
      );
      const rawTasks = Array.isArray(parsed.dailyTasks) ? parsed.dailyTasks : [];
      const filteredTasks = rawTasks
        .filter((t: any) => t?.id && !deletedTasksSet.has(String(t.id)))
        .map((t: any) => ({
          ...t,
          createdAtTimestamp: normalizeTaskTimestamp(t.createdAtTimestamp) || 1000,
          updatedAt: normalizeTaskTimestamp(t.updatedAt) || 1000,
        }));
      if (
        !deletedTasksSet.has(DEFAULT_WORKSHEET_TASK.id) &&
        !filteredTasks.some((t: any) => String(t?.id) === DEFAULT_WORKSHEET_TASK.id)
      ) {
        filteredTasks.unshift({ ...DEFAULT_WORKSHEET_TASK });
      }

      return {
        users: filteredUsers.length > 0 ? filteredUsers : [...INITIAL_STUDENTS],
        scores: filteredScores,
        activeQuizzes: filteredQuizzes,
        quizControl: parsed.quizControl || { isActive: false, updatedAt: 0 },
        onlinePresence: filteredPresence,
        dailyTasks: filteredTasks,
        deletedTaskIds: Array.from(deletedTasksSet),
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
    quizControl: { isActive: false, updatedAt: 0 },
    onlinePresence: {},
    dailyTasks: [{ ...DEFAULT_WORKSHEET_TASK }],
    deletedTaskIds: [],
    deletedEmails: Array.from(SAMPLE_EMAILS),
    rankingResetAt: 0,
    updatedAt: Date.now(),
  };
  saveDatabaseLocalOnly(initialDb);
  return initialDb;
}

function saveDatabaseLocalOnly(targetDb: ServerDatabase) {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(DB_FILE, JSON.stringify(targetDb, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed to save DB file:', err);
  }
}

const db = loadDatabase();

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
    const existingUser = db.users[existingIdx].user;
    let modified = false;
    if (
      cleanFullName &&
      cleanFullName !== 'Murid' &&
      cleanFullName !== 'Murid Terdaftar' &&
      (!existingUser.fullName || existingUser.fullName === 'Murid' || existingUser.fullName === 'Murid Terdaftar')
    ) {
      existingUser.fullName = cleanFullName;
      existingUser.name = cleanFullName;
      modified = true;
    }
    if (cleanNickname && cleanNickname !== 'Murid' && (!existingUser.nickname || existingUser.nickname === 'Murid')) {
      existingUser.nickname = cleanNickname;
      modified = true;
    }
    if (
      passwordRaw &&
      passwordRaw !== '••••••••' &&
      passwordRaw !== 'password123' &&
      db.users[existingIdx].password !== passwordRaw
    ) {
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
      !SAMPLE_EMAILS.has(u.user.email.toLowerCase()) &&
      !db.deletedEmails.includes(u.user.email.toLowerCase())
  );
  db.users = [...masterList, ...customStudents];
}

function mergeExternalPayloadIntoDb(payload: any): boolean {
  if (!payload || typeof payload !== 'object') return false;
  let changed = false;

  // 1. Deleted emails
  if (Array.isArray(payload.deletedEmails)) {
    for (const de of payload.deletedEmails) {
      const lower = String(de || '').trim().toLowerCase();
      if (lower && lower !== MASTER_CONFIG.email.toLowerCase() && !db.deletedEmails.includes(lower)) {
        db.deletedEmails.push(lower);
        db.users = db.users.filter(u => u?.user?.email?.toLowerCase() !== lower);
        db.scores = db.scores.filter(s => s?.userEmail?.toLowerCase() !== lower);
        db.activeQuizzes = db.activeQuizzes.filter(q => q?.userEmail?.toLowerCase() !== lower);
        delete db.onlinePresence[lower];
        changed = true;
      }
    }
  }

  // 2. Ranking reset timestamp
  if (typeof payload.rankingResetAt === 'number' && payload.rankingResetAt > (db.rankingResetAt || 0)) {
    db.rankingResetAt = payload.rankingResetAt;
    db.activeQuizzes = db.activeQuizzes.filter(q => (q.startedAtTimestamp || 0) >= db.rankingResetAt);
    changed = true;
  }

  // 3. QuizControl (Always respect latest updatedAt timestamp!)
  if (payload.quizControl && typeof payload.quizControl.isActive === 'boolean') {
    const incomingUpdatedAt = payload.quizControl.updatedAt || 0;
    const currentUpdatedAt = db.quizControl?.updatedAt || 0;
    if (incomingUpdatedAt > currentUpdatedAt) {
      db.quizControl = {
        isActive: payload.quizControl.isActive,
        startedAt: payload.quizControl.startedAt,
        startedBy: payload.quizControl.startedBy,
        updatedAt: incomingUpdatedAt,
      };
      changed = true;
    }
  }

  // 4. CurrentUser
  if (payload.currentUser && payload.currentUser.email) {
    if (
      ensureStudentInDb(
        payload.currentUser.email,
        payload.currentUser.fullName || payload.currentUser.name,
        payload.currentUser.nickname,
        undefined,
        payload.currentUser.registeredAt
      )
    ) {
      changed = true;
    }
  }

  // 5. Users
  if (Array.isArray(payload.users)) {
    for (const item of payload.users) {
      const u = item?.user || item;
      if (!u?.email) continue;
      const emailLower = String(u.email).trim().toLowerCase();
      if (emailLower === MASTER_CONFIG.email.toLowerCase()) {
        // Check if master password was updated
        const masterIdx = db.users.findIndex(x => x?.user?.email?.toLowerCase() === emailLower);
        if (masterIdx !== -1 && item?.password && item.password !== db.users[masterIdx].password) {
          db.users[masterIdx].password = item.password;
          changed = true;
        }
        continue;
      }
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

  // 6. Scores
  if (Array.isArray(payload.scores)) {
    for (const s of payload.scores) {
      if (!s?.id || !s?.userEmail) continue;
      const sEmail = String(s.userEmail).toLowerCase();
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

  // 7. ActiveQuizzes
  if (Array.isArray(payload.activeQuizzes)) {
    for (const q of payload.activeQuizzes) {
      if (!q?.id || !q?.userEmail) continue;
      const qEmail = String(q.userEmail).toLowerCase();
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
        const statusUpgrade = q.status === 'completed' && existing.status !== 'completed';
        const violationUpgrade = (q.tabViolationsCount || 0) > (existing.tabViolationsCount || 0);
        const progressUpgrade =
          (q.answeredCount || 0) > (existing.answeredCount || 0) ||
          (q.currentQuestion || 0) > (existing.currentQuestion || 0);

        if (statusUpgrade || violationUpgrade || progressUpgrade) {
          db.activeQuizzes[idx] = { ...existing, ...q };
          changed = true;
        }
      }
    }
  }

  // 8. OnlinePresence & Student Activity
  if (payload.onlinePresence && typeof payload.onlinePresence === 'object') {
    for (const [emailKey, pVal] of Object.entries(payload.onlinePresence as Record<string, any>)) {
      const lowerKey = emailKey.toLowerCase();
      if (
        !lowerKey ||
        lowerKey === MASTER_CONFIG.email.toLowerCase() ||
        SAMPLE_EMAILS.has(lowerKey) ||
        db.deletedEmails.includes(lowerKey)
      ) {
        continue;
      }
      if (ensureStudentInDb(lowerKey, pVal?.name, pVal?.nickname || (pVal?.name ? pVal.name.split(/\s+/)[0] : undefined))) {
        changed = true;
      }
      const current = db.onlinePresence[lowerKey];
      const incomingSeen = typeof pVal?.lastSeen === 'number' ? pVal.lastSeen : 0;
      const currentSeen = current ? current.lastSeen || 0 : -1;

      const incomingScreenshot = typeof pVal?.screenshotAttempts === 'number' ? pVal.screenshotAttempts : 0;
      const incomingAiTranslate = typeof pVal?.aiTranslateAttempts === 'number' ? pVal.aiTranslateAttempts : 0;
      const currentScreenshot = current?.screenshotAttempts || 0;
      const currentAiTranslate = current?.aiTranslateAttempts || 0;

      if (
        !current ||
        incomingSeen >= currentSeen ||
        pVal?.currentActivity !== current.currentActivity ||
        incomingScreenshot > currentScreenshot ||
        incomingAiTranslate > currentAiTranslate
      ) {
        db.onlinePresence[lowerKey] = {
          email: lowerKey,
          name: pVal?.name || current?.name || 'Murid',
          nickname: pVal?.nickname || current?.nickname || 'Murid',
          lastSeen: incomingSeen >= 0 ? incomingSeen : currentSeen,
          currentTab: pVal?.currentTab || current?.currentTab || 'home',
          currentActivity: pVal?.currentActivity || current?.currentActivity || 'Membuka Aplikasi',
          activeLevel: pVal?.activeLevel || current?.activeLevel || 'N5',
          quizProgress: pVal?.quizProgress ?? current?.quizProgress,
          lastActionAt: pVal?.lastActionAt || current?.lastActionAt,
          screenshotAttempts: Math.max(incomingScreenshot, currentScreenshot),
          aiTranslateAttempts: Math.max(incomingAiTranslate, currentAiTranslate),
        };
        changed = true;
      }
    }
  }

  // 9. Deleted Daily Task IDs
  if (Array.isArray(payload.deletedTaskIds)) {
    for (const dtId of payload.deletedTaskIds) {
      const idStr = String(dtId || '').trim();
      if (idStr && !db.deletedTaskIds.includes(idStr)) {
        db.deletedTaskIds.push(idStr);
        db.dailyTasks = db.dailyTasks.filter(t => String(t?.id) !== idStr);
        changed = true;
      }
    }
  }

  // 10. Daily Tasks (Tugas Harian Sensei)
  if (Array.isArray(payload.dailyTasks)) {
    for (const incomingTask of payload.dailyTasks) {
      if (!incomingTask?.id || !incomingTask?.title) continue;
      const taskId = String(incomingTask.id);
      if (db.deletedTaskIds.includes(taskId)) continue;

      const idx = db.dailyTasks.findIndex(t => String(t?.id) === taskId);
      if (idx === -1) {
        db.dailyTasks.unshift({
          ...incomingTask,
          completions: Array.isArray(incomingTask.completions) ? incomingTask.completions : [],
          updatedAt: incomingTask.updatedAt || Date.now(),
        });
        changed = true;
      } else {
        const existing = db.dailyTasks[idx];
        // Merge completions by studentEmail
        const compMap = new Map<string, any>();
        let compModified = false;
        for (const c of [...(existing.completions || []), ...(incomingTask.completions || [])]) {
          if (c?.studentEmail) {
            const em = String(c.studentEmail).toLowerCase();
            if (!SAMPLE_EMAILS.has(em) && !db.deletedEmails.includes(em)) {
              const prevC = compMap.get(em);
              if (!prevC) {
                compMap.set(em, c);
              } else {
                const incomingNewer = (c.completedAtTimestamp || 0) >= (prevC.completedAtTimestamp || 0);
                const mergedAnswers = incomingNewer
                  ? { ...(prevC.worksheetAnswers || {}), ...(c.worksheetAnswers || {}) }
                  : { ...(c.worksheetAnswers || {}), ...(prevC.worksheetAnswers || {}) };
                const mergedLogs = Array.from(
                  new Set([
                    ...(Array.isArray(prevC.securityViolationLogs) ? prevC.securityViolationLogs : []),
                    ...(Array.isArray(c.securityViolationLogs) ? c.securityViolationLogs : []),
                  ])
                );
                const mergedEntry = {
                  ...(incomingNewer ? { ...prevC, ...c } : { ...c, ...prevC }),
                  isCompleted: Boolean(c.isCompleted || prevC.isCompleted),
                  autoSubmittedByTimer: Boolean(c.autoSubmittedByTimer || prevC.autoSubmittedByTimer),
                  worksheetAnswers: mergedAnswers,
                  teacherComment: c.teacherComment || prevC.teacherComment,
                  screenshotAttempts: Math.max(c.screenshotAttempts || 0, prevC.screenshotAttempts || 0),
                  aiTranslateAttempts: Math.max(c.aiTranslateAttempts || 0, prevC.aiTranslateAttempts || 0),
                  securityViolationLogs: mergedLogs,
                };
                if (JSON.stringify(mergedEntry) !== JSON.stringify(prevC)) {
                  compModified = true;
                }
                compMap.set(em, mergedEntry);
              }
            }
          }
        }
        const mergedCompletions = Array.from(compMap.values());
        const incomingUpdated = normalizeTaskTimestamp(incomingTask.updatedAt);
        const existingUpdated = normalizeTaskTimestamp(existing.updatedAt);

        if (
          incomingUpdated > existingUpdated ||
          compModified ||
          mergedCompletions.length !== (existing.completions || []).length
        ) {
          const winner = incomingUpdated >= existingUpdated ? { ...existing, ...incomingTask } : existing;
          db.dailyTasks[idx] = {
            ...winner,
            worksheetQuestions:
              incomingUpdated >= existingUpdated
                ? incomingTask.worksheetQuestions || existing.worksheetQuestions
                : existing.worksheetQuestions || incomingTask.worksheetQuestions,
            completions: mergedCompletions,
            createdAtTimestamp: normalizeTaskTimestamp(winner.createdAtTimestamp) || 1000,
            updatedAt: Math.max(incomingUpdated, existingUpdated),
          };
          changed = true;
        }
      }
    }
    db.dailyTasks.sort((a, b) => (b.createdAtTimestamp || 0) - (a.createdAtTimestamp || 0));
  }

  sortDbUsers();
  return changed;
}

let lastCloudPushAt = 0;

async function pushDatabaseToCloud() {
  const now = Date.now();
  if (now - lastCloudPushAt < 15000) return;
  lastCloudPushAt = now;
  try {
    const compactEvent = JSON.stringify({
      type: 'cloud_state_sync',
      users: db.users,
      quizControl: db.quizControl,
      deletedEmails: db.deletedEmails,
      deletedTaskIds: db.deletedTaskIds,
      updatedAt: db.updatedAt,
    });
    await fetch(NTFY_SYNC_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain' },
      body: compactEvent,
    }).catch(() => {});
  } catch {
    // Ignore transient network errors
  }
}

let isPullingCloud = false;
async function pullDatabaseFromCloud() {
  if (isPullingCloud) return;
  isPullingCloud = true;
  try {
    const res = await fetch(`${NTFY_SYNC_URL}/json?poll=1&since=12h`);
    if (res.ok) {
      const text = await res.text();
      const lines = text.split('\n').filter(Boolean);
      let anyChanged = false;
      for (const line of lines) {
        try {
          const outer = JSON.parse(line);
          if (outer?.message && typeof outer.message === 'string' && outer.message.startsWith('{')) {
            const packet = JSON.parse(outer.message);
            if (packet.type === 'user_registered' && packet.entry) {
              if (
                mergeExternalPayloadIntoDb({
                  users: [packet.entry],
                  onlinePresence: packet.presence
                    ? { [String(packet.entry?.user?.email || '').toLowerCase()]: packet.presence }
                    : undefined,
                })
              ) {
                anyChanged = true;
              }
            } else if (packet.type === 'daily_task_upserted' && packet.task) {
              if (mergeExternalPayloadIntoDb({ dailyTasks: [packet.task] })) {
                anyChanged = true;
              }
            } else if (packet.type === 'daily_task_deleted' && packet.taskId) {
              if (mergeExternalPayloadIntoDb({ deletedTaskIds: [packet.taskId] })) {
                anyChanged = true;
              }
            } else if (packet.type === 'score_saved' && packet.score) {
              if (mergeExternalPayloadIntoDb({ scores: [packet.score] })) {
                anyChanged = true;
              }
            } else if (packet.type === 'active_quiz' && packet.record) {
              if (mergeExternalPayloadIntoDb({ activeQuizzes: [packet.record] })) {
                anyChanged = true;
              }
            } else if (packet.type === 'presence_update' && packet.presence?.email) {
              if (
                mergeExternalPayloadIntoDb({
                  onlinePresence: { [String(packet.presence.email).toLowerCase()]: packet.presence },
                })
              ) {
                anyChanged = true;
              }
            } else if (packet.type === 'cloud_state_sync' && Array.isArray(packet.users)) {
              if (mergeExternalPayloadIntoDb(packet)) {
                anyChanged = true;
              }
            }
          }
        } catch {}
      }
      if (anyChanged) {
        db.updatedAt = Date.now();
        saveDatabaseLocalOnly(db);
      }
    }
  } catch {
    // Ignore offline/transient error
  } finally {
    isPullingCloud = false;
  }
}

function saveDatabase(targetDb: ServerDatabase, skipCloudPush = true) {
  targetDb.updatedAt = Date.now();
  saveDatabaseLocalOnly(targetDb);
  if (!skipCloudPush) {
    pushDatabaseToCloud();
  }
}

async function startServer() {
  const app = express();

  // Enable CORS so any preview/shared URL or mobile browser can access endpoints directly
  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    if (req.method === 'OPTIONS') {
      res.sendStatus(200);
      return;
    }
    next();
  });

  app.use(express.json({ limit: '5mb' }));

  // Initial pull from cloud on server startup & periodic background cloud sync every 25 seconds
  pullDatabaseFromCloud();
  setInterval(() => {
    pullDatabaseFromCloud();
  }, 25000);

  // GET /api/state - Return full synchronized state
  app.get('/api/state', (_req, res) => {
    res.json({
      users: db.users,
      scores: db.scores,
      activeQuizzes: db.activeQuizzes,
      quizControl: db.quizControl,
      onlinePresence: db.onlinePresence,
      dailyTasks: db.dailyTasks,
      deletedTaskIds: db.deletedTaskIds,
      deletedEmails: db.deletedEmails,
      rankingResetAt: db.rankingResetAt,
      updatedAt: db.updatedAt,
    });
  });

  // POST /api/sync - Bi-directional smart merge from client localStorage to server
  app.post('/api/sync', (req, res) => {
    const changed = mergeExternalPayloadIntoDb(req.body || {});
    if (changed) {
      saveDatabase(db);
    }

    res.json({
      users: db.users,
      scores: db.scores,
      activeQuizzes: db.activeQuizzes,
      quizControl: db.quizControl,
      onlinePresence: db.onlinePresence,
      dailyTasks: db.dailyTasks,
      deletedTaskIds: db.deletedTaskIds,
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
      if (db.users.length > 0) {
        db.users.splice(1, 0, newEntry);
      } else {
        db.users.push(newEntry);
      }
    }

    sortDbUsers();

    // Mark online immediately with registration activity
    if (!normalizedUser.isMaster) {
      const nowTime = new Date().toLocaleTimeString('id-ID', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
      db.onlinePresence[emailLower] = {
        email: emailLower,
        name: normalizedUser.fullName,
        nickname: normalizedUser.nickname,
        lastSeen: Date.now(),
        currentTab: 'home',
        currentActivity: 'Baru Saja Mendaftar & Masuk Beranda',
        activeLevel: 'N5',
        lastActionAt: nowTime,
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
    if (quizControl && typeof quizControl.isActive === 'boolean') {
      db.quizControl = {
        isActive: quizControl.isActive,
        startedAt: quizControl.startedAt,
        startedBy: quizControl.startedBy,
        updatedAt: quizControl.updatedAt || Date.now(),
      };
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

  // POST /api/presence - Update student online/offline status & live activity
  app.post('/api/presence', (req, res) => {
    const {
      email,
      name,
      nickname,
      lastSeen,
      currentTab,
      currentActivity,
      activeLevel,
      quizProgress,
      lastActionAt,
      screenshotAttempts,
      aiTranslateAttempts,
    } = req.body || {};
    if (email) {
      const emailLower = email.trim().toLowerCase();
      ensureStudentInDb(emailLower, name, nickname || (name ? name.split(/\s+/)[0] : undefined));
      sortDbUsers();
      const prev = db.onlinePresence[emailLower] as any;
      db.onlinePresence[emailLower] = {
        email: emailLower,
        name: name || prev?.name || 'Murid',
        nickname: nickname || prev?.nickname || (name ? name.split(/\s+/)[0] : 'Murid'),
        lastSeen: typeof lastSeen === 'number' ? lastSeen : Date.now(),
        currentTab: currentTab || prev?.currentTab || 'home',
        currentActivity: currentActivity || prev?.currentActivity || 'Membuka Aplikasi',
        activeLevel: activeLevel || prev?.activeLevel || 'N5',
        quizProgress: quizProgress !== undefined ? quizProgress : prev?.quizProgress,
        lastActionAt:
          lastActionAt ||
          prev?.lastActionAt ||
          new Date().toLocaleTimeString('id-ID', {
            hour12: false,
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
          }),
        screenshotAttempts: Math.max(screenshotAttempts || 0, prev?.screenshotAttempts || 0),
        aiTranslateAttempts: Math.max(aiTranslateAttempts || 0, prev?.aiTranslateAttempts || 0),
      } as any;
      saveDatabase(db);
    }
    res.json({ success: true, onlinePresence: db.onlinePresence, users: db.users });
  });

  // POST /api/daily-tasks - Create, update, delete, or complete a daily task
  app.post('/api/daily-tasks', (req, res) => {
    const { task, deleteTaskId } = req.body || {};
    if (deleteTaskId) {
      const idStr = String(deleteTaskId).trim();
      if (idStr && !db.deletedTaskIds.includes(idStr)) {
        db.deletedTaskIds.push(idStr);
      }
      db.dailyTasks = db.dailyTasks.filter(t => String(t?.id) !== idStr);
      saveDatabase(db);
      res.json({ success: true, dailyTasks: db.dailyTasks, deletedTaskIds: db.deletedTaskIds });
      return;
    }

    if (task && task.id) {
      mergeExternalPayloadIntoDb({ dailyTasks: [task] });
      saveDatabase(db);
    }
    res.json({ success: true, dailyTasks: db.dailyTasks, deletedTaskIds: db.deletedTaskIds });
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
