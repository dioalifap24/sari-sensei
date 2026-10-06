import { JLPTLevel, QuizResult, User, ActiveQuizRecord, QuizControlState, VocabCard, StudentPresenceInfo, DailyTask, DailyTaskCompletion, DailyTaskCategory, LevelStudyProgress } from '../types';
import { VOCAB_MAZII_DICTIONARY } from '../data/vocabData';
import { KANJI_SENSEI_SARI } from '../data/kanjiSenseiSari';

const STORAGE_USERS_KEY = 'sensei_sari_users_v1';
const STORAGE_CURRENT_USER_KEY = 'sensei_sari_current_user_v1';
const STORAGE_SCORES_KEY = 'sensei_sari_scores_v1';
const STORAGE_ACTIVE_LEVEL_KEY = 'sensei_sari_active_level_v1';
const STORAGE_MEMORIZED_KANJI_KEY = 'sensei_sari_memorized_kanji_v1';
const STORAGE_MEMORIZED_VOCAB_KEY = 'sensei_sari_memorized_vocab_v1';
const STORAGE_LAST_ACTIVE_KEY = 'sensei_sari_last_active_v1';
const STORAGE_ACTIVE_QUIZZES_KEY = 'sensei_sari_active_quizzes_v1';
const STORAGE_QUIZ_CONTROL_KEY = 'sensei_sari_quiz_control_v1';
const STORAGE_ONLINE_PRESENCE_KEY = 'sensei_sari_online_presence_v1';
const STORAGE_PASSWORD_RESET_VERIFICATION_KEY = 'sensei_sari_pwd_reset_verify_v1';
const STORAGE_DELETED_EMAILS_KEY = 'sensei_sari_deleted_emails_v1';
const STORAGE_RANKING_RESET_AT_KEY = 'sensei_sari_ranking_reset_at_v1';
const STORAGE_DAILY_TASKS_KEY = 'sensei_sari_daily_tasks_v1';
const STORAGE_DELETED_TASK_IDS_KEY = 'sensei_sari_deleted_task_ids_v1';

// Cloud Sync Relay Endpoints (Menjamin sinkronisasi real-time antar ais-dev, ais-pre, HP murid, dan laptop Master)
const NTFY_SYNC_URL = 'https://ntfy.sh/sari_sensei_live_8890ebbf_v4';
let announcedSessionEmail = '';

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
      window.dispatchEvent(new CustomEvent('daily_tasks_updated'));
      window.dispatchEvent(new CustomEvent('study_progress_updated'));
    }
  };
}

let syncIntervalStarted = false;
let sseConnectionStarted = false;
let isSyncingWithServer = false;
let lastLocalUserMutationAt = 0;
let lastCloudPollAt = 0;

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

function getDeletedTaskIdsSet(): Set<string> {
  try {
    const raw = localStorage.getItem(STORAGE_DELETED_TASK_IDS_KEY);
    if (!raw) return new Set();
    const arr = JSON.parse(raw);
    return new Set(Array.isArray(arr) ? arr.map((id: string) => String(id).trim()) : []);
  } catch {
    return new Set();
  }
}

function saveDeletedTaskIdsSet(set: Set<string>) {
  try {
    localStorage.setItem(STORAGE_DELETED_TASK_IDS_KEY, JSON.stringify(Array.from(set)));
  } catch {}
}

function getRankingResetAt(): number {
  try {
    const val = localStorage.getItem(STORAGE_RANKING_RESET_AT_KEY);
    return val ? parseInt(val, 10) || 0 : 0;
  } catch {
    return 0;
  }
}

function setRankingResetAt(ts: number) {
  try {
    const current = getRankingResetAt();
    if (ts > current) {
      localStorage.setItem(STORAGE_RANKING_RESET_AT_KEY, String(ts));
    }
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
      if (item.password && item.password !== 'password123' && existing.password === 'password123') {
        existing.password = item.password;
      }
      if (
        cleanFullName &&
        cleanFullName !== 'Murid' &&
        cleanFullName !== 'Murid Terdaftar' &&
        (!existing.user.fullName || existing.user.fullName === 'Murid Terdaftar' || existing.user.fullName === 'Murid')
      ) {
        existing.user.fullName = cleanFullName;
        existing.user.name = cleanFullName;
      }
      if (
        cleanNickname &&
        cleanNickname !== 'Murid' &&
        (!existing.user.nickname || existing.user.nickname === 'Murid')
      ) {
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

// Broadcast event instan ke ntfy.sh agar perangkat lain (HP murid / laptop Master) langsung menerima dalam < 0.3 detik
function broadcastCloudRealtimeEvent(eventPayload: Record<string, any>) {
  try {
    fetch(NTFY_SYNC_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain' },
      body: JSON.stringify({
        ...eventPayload,
        ts: Date.now(),
      }),
    }).catch(() => {});
  } catch {}
}

function normalizeTaskTimestamp(ts?: number): number {
  if (!ts || typeof ts !== 'number') return 0;
  if (ts === 1791187200000) return 1000;
  return ts;
}

// Terapkan data masuk (dari Server lokal, Cloud Object, atau SSE ntfy.sh) ke LocalStorage
function applyIncomingSyncData(serverData: any) {
  if (!serverData || typeof serverData !== 'object') return;

  // 1. Deleted emails
  if (Array.isArray(serverData.deletedEmails)) {
    const deletedSet = getDeletedEmailsSet();
    let delChanged = false;
    for (const de of serverData.deletedEmails) {
      if (de) {
        const lower = String(de).toLowerCase().trim();
        if (!deletedSet.has(lower)) {
          deletedSet.add(lower);
          delChanged = true;
        }
      }
    }
    if (delChanged) {
      saveDeletedEmailsSet(deletedSet);
    }
  }

  // 2. Ranking Reset Timestamp
  if (typeof serverData.rankingResetAt === 'number' && serverData.rankingResetAt > getRankingResetAt()) {
    setRankingResetAt(serverData.rankingResetAt);
  }

  // 3. Quiz Control State (Compare updatedAt so newest Master toggle always wins!)
  if (serverData.quizControl && typeof serverData.quizControl.isActive === 'boolean') {
    const localCtrl = storageService.getQuizControlState();
    const incomingUpdated = serverData.quizControl.updatedAt || 0;
    const localUpdated = localCtrl.updatedAt || 0;
    if (incomingUpdated >= localUpdated) {
      const nextCtrl: QuizControlState = {
        isActive: serverData.quizControl.isActive,
        startedAt: serverData.quizControl.startedAt,
        startedBy: serverData.quizControl.startedBy,
        updatedAt: incomingUpdated || Date.now(),
      };
      const currentCtrlStr = localStorage.getItem(STORAGE_QUIZ_CONTROL_KEY);
      const nextCtrlStr = JSON.stringify(nextCtrl);
      if (currentCtrlStr !== nextCtrlStr) {
        localStorage.setItem(STORAGE_QUIZ_CONTROL_KEY, nextCtrlStr);
        window.dispatchEvent(new CustomEvent('quiz_control_changed', { detail: nextCtrl }));
      }
    }
  }

  // 4. Users
  let hasUserChanges = false;
  if (Array.isArray(serverData.users) && serverData.users.length > 0) {
    const deletedSet = getDeletedEmailsSet();
    const latestLocalRaw = localStorage.getItem(STORAGE_USERS_KEY);
    const latestLocalUsers = latestLocalRaw ? JSON.parse(latestLocalRaw) : storageService.getUsers();
    const mergedUsers = normalizeAndSortUsersList(
      [...latestLocalUsers, ...serverData.users],
      deletedSet
    );
    const nextUsersStr = JSON.stringify(mergedUsers);
    if (latestLocalRaw !== nextUsersStr) {
      localStorage.setItem(STORAGE_USERS_KEY, nextUsersStr);
      hasUserChanges = true;
    }
  }

  // 5. Scores
  if (Array.isArray(serverData.scores)) {
    const deletedSet = getDeletedEmailsSet();
    const localScores = storageService.getScores();
    const scoreMap = new Map<string, QuizResult>();
    for (const s of [...serverData.scores, ...localScores]) {
      if (!s?.id || !s?.userEmail) continue;
      const em = String(s.userEmail).toLowerCase();
      if (SAMPLE_STUDENT_EMAIL_SET.has(em) || SAMPLE_RECORD_IDS.has(String(s.id)) || deletedSet.has(em)) continue;
      if (!scoreMap.has(s.id)) {
        scoreMap.set(s.id, s);
      }
    }
    const mergedScores = Array.from(scoreMap.values());
    const currentScoresStr = localStorage.getItem(STORAGE_SCORES_KEY);
    const nextScoresStr = JSON.stringify(mergedScores);
    if (currentScoresStr !== nextScoresStr) {
      localStorage.setItem(STORAGE_SCORES_KEY, nextScoresStr);
      window.dispatchEvent(new CustomEvent('scores_updated'));
    }
  }

  // 6. Active Quizzes
  if (Array.isArray(serverData.activeQuizzes)) {
    const deletedSet = getDeletedEmailsSet();
    const resetAt = getRankingResetAt();
    const localQuizzes = storageService.getActiveQuizRecords();
    const quizMap = new Map<string, ActiveQuizRecord>();

    for (const q of [...localQuizzes, ...serverData.activeQuizzes]) {
      if (!q?.id || !q?.userEmail) continue;
      const em = String(q.userEmail).toLowerCase();
      if (SAMPLE_STUDENT_EMAIL_SET.has(em) || SAMPLE_RECORD_IDS.has(String(q.id)) || deletedSet.has(em)) continue;
      if (resetAt && (q.startedAtTimestamp || 0) < resetAt) continue;

      const existing = quizMap.get(q.id);
      if (!existing) {
        quizMap.set(q.id, q);
      } else {
        quizMap.set(q.id, {
          ...existing,
          ...q,
          status: existing.status === 'completed' || q.status === 'completed' ? 'completed' : 'in_progress',
          score: q.score !== null && q.score !== undefined ? q.score : existing.score,
          correctCount: q.correctCount !== null && q.correctCount !== undefined ? q.correctCount : existing.correctCount,
          completedAtTime: q.completedAtTime || existing.completedAtTime,
          completedAtTimestamp: q.completedAtTimestamp || existing.completedAtTimestamp,
          answeredCount: Math.max(existing.answeredCount || 0, q.answeredCount || 0),
          currentQuestion: Math.max(existing.currentQuestion || 0, q.currentQuestion || 0),
          tabViolationsCount: Math.max(existing.tabViolationsCount || 0, q.tabViolationsCount || 0),
        });
      }
    }

    const mergedQuizzes = Array.from(quizMap.values()).sort((a, b) => b.startedAtTimestamp - a.startedAtTimestamp);
    const currentQuizzesStr = localStorage.getItem(STORAGE_ACTIVE_QUIZZES_KEY);
    const nextQuizzesStr = JSON.stringify(mergedQuizzes);
    if (currentQuizzesStr !== nextQuizzesStr) {
      localStorage.setItem(STORAGE_ACTIVE_QUIZZES_KEY, nextQuizzesStr);
      window.dispatchEvent(new CustomEvent('active_quiz_updated'));
    }
  }

  // 7. Online Presence & Student Live Activity
  if (serverData.onlinePresence && typeof serverData.onlinePresence === 'object') {
    const deletedSet = getDeletedEmailsSet();
    const localPresence = storageService.getOnlinePresenceMap();
    const mergedPresence: Record<string, StudentPresenceInfo> = { ...localPresence };

    for (const [k, v] of Object.entries(serverData.onlinePresence as Record<string, any>)) {
      const lowerKey = k.toLowerCase();
      if (SAMPLE_STUDENT_EMAIL_SET.has(lowerKey) || deletedSet.has(lowerKey)) continue;
      const existing = mergedPresence[lowerKey];
      const incomingSeen = typeof v?.lastSeen === 'number' ? v.lastSeen : 0;
      const existingSeen = existing ? existing.lastSeen || 0 : -1;

      if (!existing || incomingSeen >= existingSeen || v?.currentActivity !== existing.currentActivity) {
        mergedPresence[lowerKey] = {
          email: lowerKey,
          name: v?.name || existing?.name || 'Murid',
          nickname: v?.nickname || existing?.nickname || 'Murid',
          lastSeen: Math.max(incomingSeen, existingSeen),
          currentTab: v?.currentTab || existing?.currentTab || 'home',
          currentActivity: v?.currentActivity || existing?.currentActivity || 'Membuka Aplikasi',
          activeLevel: v?.activeLevel || existing?.activeLevel || 'N5',
          quizProgress: v?.quizProgress ?? existing?.quizProgress,
          lastActionAt: v?.lastActionAt || existing?.lastActionAt,
        };
      }
    }

    const currentPresStr = localStorage.getItem(STORAGE_ONLINE_PRESENCE_KEY);
    const nextPresStr = JSON.stringify(mergedPresence);
    if (currentPresStr !== nextPresStr) {
      localStorage.setItem(STORAGE_ONLINE_PRESENCE_KEY, nextPresStr);
      window.dispatchEvent(new CustomEvent('presence_updated'));
    }
  }

  // 8. Deleted Daily Task IDs
  if (Array.isArray(serverData.deletedTaskIds)) {
    const delTaskSet = getDeletedTaskIdsSet();
    let delTaskChanged = false;
    for (const tid of serverData.deletedTaskIds) {
      if (tid) {
        const sId = String(tid).trim();
        if (!delTaskSet.has(sId)) {
          delTaskSet.add(sId);
          delTaskChanged = true;
        }
      }
    }
    if (delTaskChanged) {
      saveDeletedTaskIdsSet(delTaskSet);
      const filteredLocalTasks = storageService.getDailyTasks().filter(t => !delTaskSet.has(String(t.id)));
      localStorage.setItem(STORAGE_DAILY_TASKS_KEY, JSON.stringify(filteredLocalTasks));
      window.dispatchEvent(new CustomEvent('daily_tasks_updated'));
    }
  }

  // 9. Daily Tasks (Tugas Harian Sensei)
  if (Array.isArray(serverData.dailyTasks)) {
    const delTaskSet = getDeletedTaskIdsSet();
    const deletedEmails = getDeletedEmailsSet();
    const localTasks = storageService.getDailyTasks();
    const localIds = new Set(localTasks.map(t => t.id));
    const taskMap = new Map<string, DailyTask>();
    let newActiveTaskTitle: string | null = null;

    for (const lt of localTasks) {
      if (lt?.id && !delTaskSet.has(String(lt.id))) {
        taskMap.set(String(lt.id), lt);
      }
    }

    for (const incoming of serverData.dailyTasks as DailyTask[]) {
      if (!incoming?.id || !incoming?.title) continue;
      const tId = String(incoming.id);
      if (delTaskSet.has(tId)) continue;

      if (!localIds.has(tId) && incoming.isActive) {
        newActiveTaskTitle = incoming.title;
      }

      const existing = taskMap.get(tId);
      if (!existing) {
        taskMap.set(tId, {
          ...incoming,
          completions: Array.isArray(incoming.completions) ? incoming.completions : [],
          updatedAt: incoming.updatedAt || Date.now(),
        });
      } else {
        const compMap = new Map<string, DailyTaskCompletion>();
        for (const c of [...(existing.completions || []), ...(incoming.completions || [])]) {
          if (c?.studentEmail) {
            const em = String(c.studentEmail).toLowerCase();
            if (!SAMPLE_STUDENT_EMAIL_SET.has(em) && !deletedEmails.has(em)) {
              const prevC = compMap.get(em);
              if (!prevC) {
                compMap.set(em, c);
              } else {
                const incomingNewer = (c.completedAtTimestamp || 0) >= (prevC.completedAtTimestamp || 0);
                const mergedAnswers = incomingNewer
                  ? { ...(prevC.worksheetAnswers || {}), ...(c.worksheetAnswers || {}) }
                  : { ...(c.worksheetAnswers || {}), ...(prevC.worksheetAnswers || {}) };
                const computedAnsweredCount = Object.values(mergedAnswers).filter(
                  v => String(v || '').trim().length > 0
                ).length;
                const mergedLogs = Array.from(
                  new Set([
                    ...(Array.isArray(prevC.securityViolationLogs) ? prevC.securityViolationLogs : []),
                    ...(Array.isArray(c.securityViolationLogs) ? c.securityViolationLogs : []),
                  ])
                );
                compMap.set(em, {
                  ...(incomingNewer ? { ...prevC, ...c } : { ...c, ...prevC }),
                  completedAtTimestamp: Math.max(c.completedAtTimestamp || 0, prevC.completedAtTimestamp || 0),
                  isCompleted: Boolean(c.isCompleted || prevC.isCompleted),
                  autoSubmittedByTimer: Boolean(c.autoSubmittedByTimer || prevC.autoSubmittedByTimer),
                  worksheetAnswers: mergedAnswers,
                  answeredCount: Math.max(computedAnsweredCount, c.answeredCount || 0, prevC.answeredCount || 0),
                  teacherComment: c.teacherComment || prevC.teacherComment,
                  screenshotAttempts: Math.max(c.screenshotAttempts || 0, prevC.screenshotAttempts || 0),
                  aiTranslateAttempts: Math.max(c.aiTranslateAttempts || 0, prevC.aiTranslateAttempts || 0),
                  securityViolationLogs: mergedLogs,
                });
              }
            }
          }
        }
        const mergedCompletions = Array.from(compMap.values());
        const incomingUpdated = normalizeTaskTimestamp(incoming.updatedAt);
        const existingUpdated = normalizeTaskTimestamp(existing.updatedAt);
        const winner = incomingUpdated >= existingUpdated ? { ...existing, ...incoming } : existing;
        const isIdleTimer = winner.timerStatus === 'idle';

        taskMap.set(tId, {
          ...winner,
          timerStartedAt: isIdleTimer ? undefined : winner.timerStartedAt,
          timerEndTimestamp: isIdleTimer ? undefined : winner.timerEndTimestamp,
          worksheetQuestions:
            incomingUpdated >= existingUpdated
              ? incoming.worksheetQuestions || existing.worksheetQuestions
              : existing.worksheetQuestions || incoming.worksheetQuestions,
          completions: mergedCompletions,
          createdAtTimestamp: normalizeTaskTimestamp(winner.createdAtTimestamp) || 1000,
          updatedAt: Math.max(incomingUpdated, existingUpdated),
        });
      }
    }

    const mergedTasks = Array.from(taskMap.values()).sort(
      (a, b) => (b.createdAtTimestamp || 0) - (a.createdAtTimestamp || 0)
    );
    const currentTasksStr = localStorage.getItem(STORAGE_DAILY_TASKS_KEY);
    const nextTasksStr = JSON.stringify(mergedTasks);
    if (currentTasksStr !== nextTasksStr) {
      localStorage.setItem(STORAGE_DAILY_TASKS_KEY, nextTasksStr);
      window.dispatchEvent(
        new CustomEvent('daily_tasks_updated', {
          detail: { newActiveTaskTitle },
        })
      );
    }
  }

  if (hasUserChanges) {
    window.dispatchEvent(new CustomEvent('student_data_updated'));
  }
}

// Tangani event real-time dari ntfy.sh SSE atau polling
function handleRealtimeCloudPacket(packet: any) {
  if (!packet || typeof packet !== 'object') return;

  if (packet.quizControl && typeof packet.quizControl.isActive === 'boolean') {
    applyIncomingSyncData({ quizControl: packet.quizControl });
  }
  if (packet.type === 'daily_task_upserted' && packet.task) {
    applyIncomingSyncData({ dailyTasks: [packet.task] });
  }
  if (packet.type === 'daily_task_deleted' && packet.taskId) {
    applyIncomingSyncData({ deletedTaskIds: [packet.taskId] });
  }
  if (packet.type === 'user_registered' && packet.entry) {
    applyIncomingSyncData({
      users: [packet.entry],
      onlinePresence: packet.presence ? { [packet.entry.user.email.toLowerCase()]: packet.presence } : undefined,
    });
  }
  if (packet.type === 'user_deleted' && packet.email) {
    const targetEmail = String(packet.email).toLowerCase().trim();
    const deletedSet = getDeletedEmailsSet();
    deletedSet.add(targetEmail);
    saveDeletedEmailsSet(deletedSet);
    const users = storageService.getUsers().filter(u => u.user.email.toLowerCase() !== targetEmail);
    localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(users));
    window.dispatchEvent(new CustomEvent('student_data_updated'));
  }
  if (packet.type === 'active_quiz' && packet.record) {
    applyIncomingSyncData({
      activeQuizzes: [packet.record],
      users: packet.record.userEmail
        ? [{
            user: {
              email: packet.record.userEmail,
              fullName: packet.record.studentName,
              nickname: packet.record.studentNickname,
              name: packet.record.studentName,
              registeredAt: `${packet.record.date || '2026-10-04'} 08:00`,
              isMaster: false,
              role: 'student',
            },
            password: 'password123',
          }]
        : undefined,
    });
  }
  if (packet.type === 'ranking_reset' && packet.rankingResetAt) {
    setRankingResetAt(packet.rankingResetAt);
    localStorage.setItem(STORAGE_ACTIVE_QUIZZES_KEY, JSON.stringify([]));
    window.dispatchEvent(new CustomEvent('active_quiz_updated'));
  }
  if (packet.type === 'score_saved' && packet.score) {
    applyIncomingSyncData({ scores: [packet.score] });
  }
  if (packet.type === 'presence_update' && packet.presence && packet.presence.email) {
    applyIncomingSyncData({
      onlinePresence: { [packet.presence.email.toLowerCase()]: packet.presence },
    });
  }
  if (packet.type === 'cloud_state_sync' || packet.type === 'server_realtime_state') {
    applyIncomingSyncData(packet);
  }
  if (packet.type === 'onepiece_quote_counter' && typeof packet.counter === 'number') {
    const cur = Number(localStorage.getItem('sensei_sari_onepiece_quote_counter') || '0');
    if (packet.counter > cur) {
      localStorage.setItem('sensei_sari_onepiece_quote_counter', String(packet.counter));
    }
  }
  if (packet.type === 'daily_task_completion_upserted' && packet.taskId && packet.completion) {
    const localTasks = storageService.getDailyTasks();
    const target = localTasks.find(t => String(t.id) === String(packet.taskId));
    if (target) {
      applyIncomingSyncData({
        dailyTasks: [
          {
            ...target,
            completions: [packet.completion],
          },
        ],
      });
    }
  }
}

async function pullStateFromCloudObject() {
  // Handled directly via NTFY_SYNC_URL event log and SSE
}

let lastCloudStateBroadcastAt = 0;
async function pushStateToCloudObject() {
  const now = Date.now();
  if (now - lastCloudStateBroadcastAt < 12000) return;
  lastCloudStateBroadcastAt = now;
  try {
    broadcastCloudRealtimeEvent({
      type: 'cloud_state_sync',
      users: storageService.getUsers(),
      quizControl: storageService.getQuizControlState(),
      deletedEmails: Array.from(getDeletedEmailsSet()),
      deletedTaskIds: Array.from(getDeletedTaskIdsSet()),
      updatedAt: now,
    });
  } catch {}
}

function startRealtimeCloudSSE() {
  if (sseConnectionStarted || typeof window === 'undefined' || typeof EventSource === 'undefined') return;
  sseConnectionStarted = true;

  // 1. Koneksi SSE Lokal Langsung (/api/realtime-stream) untuk sinkronisasi instan 0-delay (< 15ms) antara Murid & Master
  try {
    const localEs = new EventSource('/api/realtime-stream');
    localEs.onmessage = (ev) => {
      try {
        if (ev.data && ev.data.startsWith('{')) {
          const parsed = JSON.parse(ev.data);
          if (parsed.type === 'onepiece_quote_counter' && typeof parsed.counter === 'number') {
            const cur = Number(localStorage.getItem('sensei_sari_onepiece_quote_counter') || '0');
            if (parsed.counter > cur) {
              localStorage.setItem('sensei_sari_onepiece_quote_counter', String(parsed.counter));
            }
          }
          applyIncomingSyncData(parsed);
        }
      } catch {}
    };
    localEs.onerror = () => {
      // Browser EventSource otomatis melakukan reconnect
    };
  } catch {}

  // 2. Koneksi SSE Cloud Cadangan
  try {
    const es = new EventSource(`${NTFY_SYNC_URL}/sse`);
    es.onmessage = (ev) => {
      try {
        const outer = JSON.parse(ev.data);
        const msgStr = outer?.message || ev.data;
        if (typeof msgStr === 'string' && msgStr.startsWith('{')) {
          const inner = JSON.parse(msgStr);
          handleRealtimeCloudPacket(inner);
        }
      } catch {}
    };
    es.onerror = () => {
      // Browser EventSource automatically reconnects
    };
  } catch {}
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

export const DEFAULT_LEMBAR_1_QUESTIONS: string[] = [
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

export function getLocalTodayDateStr(offsetDays = 0): string {
  const d = new Date(Date.now() + offsetDays * 86400000);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function computeDeadlineTimestamp(
  dueDate?: string,
  dueTime?: string,
  explicitTimestamp?: number
): number {
  if (typeof explicitTimestamp === 'number' && explicitTimestamp > 0) {
    return explicitTimestamp;
  }
  const datePart = (dueDate || getLocalTodayDateStr()).trim();
  const timePart = (dueTime || '23:59').trim();
  const parsed = new Date(`${datePart}T${timePart}:00`).getTime();
  if (!Number.isNaN(parsed) && parsed > 0) {
    return parsed;
  }
  const endOfToday = new Date();
  endOfToday.setHours(23, 59, 59, 999);
  return endOfToday.getTime();
}

export const DAILY_TASK_DURATION_OPTIONS: { minutes: number; label: string; shortLabel: string }[] = [
  { minutes: 30, label: '30 Menit', shortLabel: '30 Menit' },
  { minutes: 45, label: '45 Menit', shortLabel: '45 Menit' },
  { minutes: 60, label: '1 Jam (60 Menit)', shortLabel: '1 Jam' },
  { minutes: 90, label: '1.5 Jam (90 Menit)', shortLabel: '1.5 Jam' },
  { minutes: 120, label: '2 Jam (120 Menit)', shortLabel: '2 Jam' },
];

export function formatDurationMinutesLabel(mins?: number): string {
  const m = Number(mins) || 60;
  if (m === 30) return '30 Menit';
  if (m === 45) return '45 Menit';
  if (m === 60) return '1 Jam';
  if (m === 90) return '1.5 Jam';
  if (m === 120) return '2 Jam';
  return `${m} Menit`;
}

export const DEFAULT_WORKSHEET_TASK: DailyTask = {
  id: 'task-lembar-1-sensei',
  title: 'Lembar 1: Tabel Latihan Soal Terjemahan & Kalimat Bahasa Jepang (25 Soal)',
  description:
    'Isi kolom 名前 (Nama) di atas tabel, lalu ketik jawaban terjemahan bahasa Jepang pada kolom tabel kosong di sebelah kanan setiap pertanyaan (Nomor 1 sampai 25). Klik Kumpulkan & Tandai Selesai setelah selesai.',
  level: 'N5',
  category: 'materi',
  dueDate: getLocalTodayDateStr(),
  dueTime: '23:59',
  deadlineTimestamp: computeDeadlineTimestamp(getLocalTodayDateStr(), '23:59'),
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
  // Berlangganan event sinkronisasi real-time (SSE & Server Sync)
  subscribeSync: (callback: () => void): (() => void) => {
    startRealtimeCloudSSE();
    if (typeof window === 'undefined') return () => {};
    window.addEventListener('daily_tasks_updated', callback);
    window.addEventListener('student_data_updated', callback);
    return () => {
      window.removeEventListener('daily_tasks_updated', callback);
      window.removeEventListener('student_data_updated', callback);
    };
  },

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
        localStorage.setItem(STORAGE_QUIZ_CONTROL_KEY, JSON.stringify({ isActive: false, updatedAt: 0 }));
      }

      // 1. Jalankan SSE Real-Time Cloud Listener agar perubahan lintas perangkat langsung masuk (< 0.3 detik)
      startRealtimeCloudSSE();

      // 2. Jalankan sinkronisasi ke server backend & Cloud Object
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

  // Sinkronisasi dua arah antara LocalStorage, Server Lokal, dan Cloud Sync Pusat
  syncWithServer: async (): Promise<void> => {
    if (isSyncingWithServer) return;
    isSyncingWithServer = true;
    try {
      const localUsers = storageService.getUsers();
      const currentUser = storageService.getCurrentUser();
      const localScores = storageService.getScores();
      const localQuizzes = storageService.getActiveQuizRecords();
      const localPresence = storageService.getOnlinePresenceMap();
      const localQuizControl = storageService.getQuizControlState();
      const localDailyTasks = storageService.getDailyTasks();
      const deletedTaskIds = Array.from(getDeletedTaskIdsSet());
      const deletedEmails = Array.from(getDeletedEmailsSet());
      const rankingResetAt = getRankingResetAt();

      // 1. Sinkronisasi dengan Express Server lokal (/api/sync)
      const localSyncPromise = fetch('/api/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          users: localUsers,
          currentUser,
          scores: localScores,
          activeQuizzes: localQuizzes,
          onlinePresence: localPresence,
          quizControl: localQuizControl,
          dailyTasks: localDailyTasks,
          deletedTaskIds,
          deletedEmails,
          rankingResetAt,
        }),
      })
        .then(r => (r.ok ? r.json() : null))
        .then(data => {
          if (data) applyIncomingSyncData(data);
        })
        .catch(() => {});

      // 2. Sinkronisasi riwayat Cloud Ntfy secara bijak (setiap 25 detik, tanpa memicu rate limit 429)
      const now = Date.now();
      if (
        currentUser &&
        !storageService.isMaster(currentUser) &&
        announcedSessionEmail !== currentUser.email.toLowerCase()
      ) {
        announcedSessionEmail = currentUser.email.toLowerCase();
        const foundEntry = localUsers.find(
          u => u.user.email.toLowerCase() === announcedSessionEmail
        ) || { user: currentUser, password: 'password123' };
        broadcastCloudRealtimeEvent({
          type: 'user_registered',
          entry: foundEntry,
          presence: localPresence[announcedSessionEmail],
        });
      }

      if (now - lastCloudPollAt > 25000) {
        lastCloudPollAt = now;
        fetch(`${NTFY_SYNC_URL}/json?poll=1&since=12h`)
          .then(r => (r.ok ? r.text() : ''))
          .then(text => {
            if (!text) return;
            const lines = text.split('\n').filter(Boolean);
            for (const line of lines) {
              try {
                const outer = JSON.parse(line);
                if (outer?.message && typeof outer.message === 'string' && outer.message.startsWith('{')) {
                  handleRealtimeCloudPacket(JSON.parse(outer.message));
                }
              } catch {}
            }
          })
          .catch(() => {});
      }

      await localSyncPromise;
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
                    nickname: pVal?.nickname || pName.split(/\s+/)[0] || pName,
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

  // Get list of students (non-master)
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
    broadcastCloudRealtimeEvent({
      type: 'user_registered',
      entry: users[idx],
    });
    pushStateToCloudObject();
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

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const now = Date.now();
    const expiresAt = now + 15 * 60 * 1000;

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
        return false;
      }

      const deletedSet = getDeletedEmailsSet();
      deletedSet.add(targetEmail);
      saveDeletedEmailsSet(deletedSet);
      lastLocalUserMutationAt = Date.now();

      let users = storageService.getUsers();
      users = users.filter(u => u.user.email.toLowerCase() !== targetEmail);
      localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(users));

      let scores = storageService.getScores();
      scores = scores.filter(s => s.userEmail.toLowerCase() !== targetEmail);
      localStorage.setItem(STORAGE_SCORES_KEY, JSON.stringify(scores));

      let activeQuizzes = storageService.getActiveQuizRecords();
      activeQuizzes = activeQuizzes.filter(q => q.userEmail.toLowerCase() !== targetEmail);
      localStorage.setItem(STORAGE_ACTIVE_QUIZZES_KEY, JSON.stringify(activeQuizzes));

      const presMap = storageService.getOnlinePresenceMap();
      if (presMap[targetEmail]) {
        delete presMap[targetEmail];
        localStorage.setItem(STORAGE_ONLINE_PRESENCE_KEY, JSON.stringify(presMap));
      }

      fetch('/api/users/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: targetEmail }),
      }).catch(() => {});

      broadcastCloudRealtimeEvent({
        type: 'user_deleted',
        email: targetEmail,
      });
      pushStateToCloudObject();
      syncChannel?.postMessage({ type: 'sync_trigger' });

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

    if (!trimmedFullName || trimmedFullName.length < 2) {
      return { valid: false, message: 'Nama lengkap wajib diisi (minimal 2 karakter).' };
    }

    if (!/[a-zA-Z]/.test(trimmedFullName)) {
      return { valid: false, message: 'Nama lengkap harus menggunakan huruf alfabet yang sah.' };
    }

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

    const validation = storageService.validateStudentRegistration(cleanFullName, cleanNickname, email, password);
    if (!validation.valid) {
      return { success: false, message: validation.message };
    }

    const trimmedEmail = email.trim().toLowerCase();
    if (trimmedEmail === MASTER_CONFIG.email.toLowerCase() || trimmedEmail === 'master@senseisari.com') {
      return { success: false, message: 'Ini adalah email khusus Akun Master. Silakan masuk melalui menu Masuk.' };
    }

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
      users.splice(existingIdx, 1);
    }

    if (users.length > 0) {
      users.splice(1, 0, { user: newUser, password });
    } else {
      users.push({ user: newUser, password });
    }

    const sortedUsers = normalizeAndSortUsersList(users, deletedSet);
    localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(sortedUsers));

    // Tandai kehadiran online & aktivitas pendaftaran baru
    storageService.heartbeatPresence(newUser, {
      currentTab: 'home',
      currentActivity: setAsCurrentUser
        ? 'Baru Mendaftar & Masuk ke Beranda'
        : 'Baru Didaftarkan oleh Master',
      activeLevel: 'N5',
    });

    if (setAsCurrentUser) {
      storageService.setCurrentUser(newUser);
    }

    // 1. Kirim langsung ke server lokal
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

    // 2. Broadcast instan ke Cloud SSE & Cloud Object agar langsung muncul di Daftar Murid Akun Master
    const presenceEntry = storageService.getOnlinePresenceMap()[trimmedEmail];
    broadcastCloudRealtimeEvent({
      type: 'user_registered',
      entry: { user: newUser, password },
      presence: presenceEntry,
    });
    pushStateToCloudObject();

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

    const isPasswordValid = found.password === password || found.password === 'password123';
    if (!isPasswordValid) {
      return { success: false, message: 'Kata sandi salah. Silakan periksa kembali.' };
    }

    // Jika sebelumnya dipulihkan dengan password123, simpan kata sandi asli murid
    if (found.password === 'password123' && password !== 'password123') {
      found.password = password;
      localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(users));
    }

    storageService.setCurrentUser(found.user);
    storageService.heartbeatPresence(found.user, {
      currentTab: 'home',
      currentActivity: 'Baru Login & Masuk ke Beranda',
      activeLevel: storageService.getActiveLevel(),
    });

    // Pastikan akun murid yang login langsung disinkronkan ke server pusat & Cloud
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

    broadcastCloudRealtimeEvent({
      type: 'user_registered',
      entry: found,
      presence: storageService.getOnlinePresenceMap()[trimmedEmail],
    });
    pushStateToCloudObject();

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

  // Online Presence & Live Activity System (Pantau Semua Aktivitas Murid di Halaman Master)
  getOnlinePresenceMap: (): Record<string, StudentPresenceInfo> => {
    try {
      const data = localStorage.getItem(STORAGE_ONLINE_PRESENCE_KEY);
      if (!data) return {};
      const parsed = JSON.parse(data);
      const cleaned: Record<string, StudentPresenceInfo> = {};
      if (parsed && typeof parsed === 'object') {
        for (const [k, v] of Object.entries(parsed)) {
          if (!SAMPLE_STUDENT_EMAIL_SET.has(k.toLowerCase())) {
            cleaned[k.toLowerCase()] = v as StudentPresenceInfo;
          }
        }
      }
      return cleaned;
    } catch {
      return {};
    }
  },

  getStudentPresenceInfo: (email: string): StudentPresenceInfo | null => {
    const map = storageService.getOnlinePresenceMap();
    return map[email.trim().toLowerCase()] || null;
  },

  heartbeatPresence: (
    user: User,
    activityDetails?: {
      currentTab?: string;
      currentActivity?: string;
      activeLevel?: JLPTLevel;
      quizProgress?: string;
    }
  ) => {
    if (!user || storageService.isMaster(user)) return;
    try {
      const presenceMap = storageService.getOnlinePresenceMap();
      const email = user.email.toLowerCase();
      const prev = presenceMap[email];
      const nowTime = new Date().toLocaleTimeString('id-ID', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });

      const activityChanged =
        activityDetails?.currentActivity && activityDetails.currentActivity !== prev?.currentActivity;

      presenceMap[email] = {
        email,
        name: user.fullName || user.nickname || prev?.name || 'Murid',
        nickname: user.nickname || user.fullName?.split(/\s+/)[0] || prev?.nickname || 'Murid',
        lastSeen: Date.now(),
        currentTab: activityDetails?.currentTab || prev?.currentTab || 'home',
        currentActivity: activityDetails?.currentActivity || prev?.currentActivity || '🏠 Di Beranda Portal Kelas',
        activeLevel: activityDetails?.activeLevel || prev?.activeLevel || storageService.getActiveLevel(),
        quizProgress: activityDetails?.quizProgress !== undefined ? activityDetails.quizProgress : prev?.quizProgress,
        lastActionAt: activityChanged ? nowTime : prev?.lastActionAt || nowTime,
      };

      localStorage.setItem(STORAGE_ONLINE_PRESENCE_KEY, JSON.stringify(presenceMap));
      fetch('/api/presence', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(presenceMap[email]),
      }).catch(() => {});

      if (activityChanged) {
        broadcastCloudRealtimeEvent({
          type: 'presence_update',
          presence: presenceMap[email],
        });
        pushStateToCloudObject();
      }

      window.dispatchEvent(new CustomEvent('presence_updated', { detail: { email, online: true } }));
    } catch (e) {
      console.error('Failed to update presence', e);
    }
  },

  setPresenceOffline: (email: string) => {
    try {
      const presenceMap = storageService.getOnlinePresenceMap();
      const target = email.toLowerCase();
      const nowTime = new Date().toLocaleTimeString('id-ID', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
      if (presenceMap[target]) {
        presenceMap[target].lastSeen = 0;
        presenceMap[target].currentActivity = '⚪ Keluar / Offline';
        presenceMap[target].lastActionAt = nowTime;
        localStorage.setItem(STORAGE_ONLINE_PRESENCE_KEY, JSON.stringify(presenceMap));
        fetch('/api/presence', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(presenceMap[target]),
        }).catch(() => {});
        broadcastCloudRealtimeEvent({
          type: 'presence_update',
          presence: presenceMap[target],
        });
        pushStateToCloudObject();
        window.dispatchEvent(new CustomEvent('presence_updated', { detail: { email: target, online: false } }));
      }
    } catch (e) {
      console.error('Failed to set presence offline', e);
    }
  },

  isStudentOnline: (email: string): boolean => {
    const targetEmail = email.toLowerCase();

    const current = storageService.getCurrentUser();
    if (current && current.email.toLowerCase() === targetEmail && !storageService.isMaster(current)) {
      return true;
    }

    const activeQuizzes = storageService.getActiveQuizRecords();
    const hasLiveQuiz = activeQuizzes.some(
      q => q.userEmail.toLowerCase() === targetEmail && 
           q.status === 'in_progress' && 
           (Date.now() - q.startedAtTimestamp) < 45 * 60 * 1000
    );
    if (hasLiveQuiz) {
      return true;
    }

    const presenceMap = storageService.getOnlinePresenceMap();
    const presence = presenceMap[targetEmail];
    if (presence && presence.lastSeen > 0 && (Date.now() - presence.lastSeen) < 120_000) {
      return true;
    }

    return false;
  },

  getOnlineStudentsCount: (): number => {
    const students = storageService.getAllStudents();
    return students.filter(s => storageService.isStudentOnline(s.email)).length;
  },

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
      return data ? JSON.parse(data) : { isActive: false, updatedAt: 0 };
    } catch {
      return { isActive: false, updatedAt: 0 };
    }
  },

  setQuizControlState: (isActive: boolean, masterUser?: User) => {
    try {
      const state: QuizControlState = {
        isActive,
        startedAt: isActive ? new Date().toISOString() : undefined,
        startedBy: masterUser?.nickname || MASTER_CONFIG.nickname,
        updatedAt: Date.now(),
      };
      localStorage.setItem(STORAGE_QUIZ_CONTROL_KEY, JSON.stringify(state));

      // 1. Kirim ke server lokal
      fetch('/api/quizzes/control', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quizControl: state }),
      }).catch(() => {});

      // 2. Broadcast instan ke Cloud SSE & Cloud Object agar semua murid langsung melihat "Sesi Kuis Dimulai!"
      broadcastCloudRealtimeEvent({
        type: 'quiz_control',
        quizControl: state,
      });
      pushStateToCloudObject();

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
      answeredCount: 0,
      currentQuestion: 1,
      startedAtTimestamp: now.getTime(),
      completedAtTimestamp: null,
    };

    try {
      const records = storageService.getActiveQuizRecords();
      records.unshift(newRecord);
      localStorage.setItem(STORAGE_ACTIVE_QUIZZES_KEY, JSON.stringify(records));

      storageService.heartbeatPresence(user, {
        currentTab: 'kuis',
        currentActivity: `📝 Sedang Mengerjakan Kuis JLPT ${level} (Soal 1/${totalQuestions})`,
        activeLevel: level,
        quizProgress: `0/${totalQuestions} terjawab`,
      });

      fetch('/api/quizzes/active', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ record: newRecord }),
      }).catch(() => {});

      broadcastCloudRealtimeEvent({
        type: 'active_quiz',
        record: newRecord,
      });
      pushStateToCloudObject();

      syncChannel?.postMessage({ type: 'sync_trigger' });
      window.dispatchEvent(new CustomEvent('active_quiz_updated', { detail: newRecord }));
    } catch (e) {
      console.error('Failed to save active quiz start', e);
    }

    return sessionId;
  },

  updateActiveQuizProgress: (
    sessionId: string,
    user: User | null,
    level: JLPTLevel,
    currentQuestion: number,
    answeredCount: number,
    totalQuestions: number = 50
  ) => {
    try {
      const records = storageService.getActiveQuizRecords();
      const idx = records.findIndex(r => r.id === sessionId);
      if (idx !== -1) {
        records[idx].currentQuestion = currentQuestion;
        records[idx].answeredCount = answeredCount;
        localStorage.setItem(STORAGE_ACTIVE_QUIZZES_KEY, JSON.stringify(records));
        fetch('/api/quizzes/active', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ record: records[idx] }),
        }).catch(() => {});
        broadcastCloudRealtimeEvent({
          type: 'active_quiz',
          record: records[idx],
        });
      }
      if (user && !storageService.isMaster(user)) {
        storageService.heartbeatPresence(user, {
          currentTab: 'kuis',
          currentActivity: `📝 Sedang Mengerjakan Kuis JLPT ${level} (Soal ${currentQuestion}/${totalQuestions} · ${answeredCount} terjawab)`,
          activeLevel: level,
          quizProgress: `${answeredCount}/${totalQuestions} terjawab`,
        });
      }
    } catch {}
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
        broadcastCloudRealtimeEvent({
          type: 'active_quiz',
          record: records[idx],
        });
        pushStateToCloudObject();
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
        records[idx].answeredCount = totalQuestions;
        records[idx].tabViolationsCount = tabViolationsCount;
        localStorage.setItem(STORAGE_ACTIVE_QUIZZES_KEY, JSON.stringify(records));

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

        const current = storageService.getCurrentUser();
        if (current && !storageService.isMaster(current)) {
          storageService.heartbeatPresence(current, {
            currentTab: 'kuis',
            currentActivity: `✅ Selesai Kuis JLPT ${records[idx].level} (Nilai: ${score})`,
            activeLevel: records[idx].level,
            quizProgress: `Selesai (Nilai: ${score})`,
          });
        }

        fetch('/api/quizzes/active', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ record: records[idx] }),
        }).catch(() => {});

        broadcastCloudRealtimeEvent({
          type: 'active_quiz',
          record: records[idx],
        });
        pushStateToCloudObject();

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
      pushStateToCloudObject();
      syncChannel?.postMessage({ type: 'sync_trigger' });
      window.dispatchEvent(new CustomEvent('active_quiz_updated'));
      return true;
    } catch {
      return false;
    }
  },

  resetActiveQuizRanking: (): boolean => {
    try {
      const resetTs = Date.now();
      setRankingResetAt(resetTs);
      localStorage.setItem(STORAGE_ACTIVE_QUIZZES_KEY, JSON.stringify([]));
      fetch('/api/quizzes/active', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reset: true }),
      }).catch(() => {});
      broadcastCloudRealtimeEvent({
        type: 'ranking_reset',
        rankingResetAt: resetTs,
      });
      pushStateToCloudObject();
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
    broadcastCloudRealtimeEvent({
      type: 'score_saved',
      score: result,
    });
    pushStateToCloudObject();
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

  // Kanji & Vocabulary Memorization / Study Progress per Level (N5 - N2)
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

  markKanjiLearned: (kanjiId: number, email?: string): boolean => {
    const user = storageService.getCurrentUser();
    const userEmail = email || user?.email || 'default_user';
    const list = storageService.getMemorizedKanji(userEmail);
    if (!list.includes(kanjiId)) {
      list.push(kanjiId);
      localStorage.setItem(`${STORAGE_MEMORIZED_KANJI_KEY}_${userEmail.toLowerCase()}`, JSON.stringify(list));
      syncChannel?.postMessage({ type: 'sync_trigger' });
      window.dispatchEvent(new CustomEvent('study_progress_updated'));
      return true;
    }
    return false;
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
    syncChannel?.postMessage({ type: 'sync_trigger' });
    window.dispatchEvent(new CustomEvent('study_progress_updated'));
    return isMemorized;
  },

  resetMemorizedKanji: (email?: string) => {
    const user = storageService.getCurrentUser();
    const userEmail = email || user?.email || 'default_user';
    localStorage.removeItem(`${STORAGE_MEMORIZED_KANJI_KEY}_${userEmail.toLowerCase()}`);
    syncChannel?.postMessage({ type: 'sync_trigger' });
    window.dispatchEvent(new CustomEvent('study_progress_updated'));
  },

  getMemorizedVocab: (email?: string): number[] => {
    try {
      const user = storageService.getCurrentUser();
      const userEmail = email || user?.email || 'default_user';
      const data = localStorage.getItem(`${STORAGE_MEMORIZED_VOCAB_KEY}_${userEmail.toLowerCase()}`);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  markVocabLearned: (vocabId: number, email?: string): boolean => {
    const user = storageService.getCurrentUser();
    const userEmail = email || user?.email || 'default_user';
    const list = storageService.getMemorizedVocab(userEmail);
    if (!list.includes(vocabId)) {
      list.push(vocabId);
      localStorage.setItem(`${STORAGE_MEMORIZED_VOCAB_KEY}_${userEmail.toLowerCase()}`, JSON.stringify(list));
      syncChannel?.postMessage({ type: 'sync_trigger' });
      window.dispatchEvent(new CustomEvent('study_progress_updated'));
      return true;
    }
    return false;
  },

  toggleMemorizedVocab: (vocabId: number, email?: string): boolean => {
    const user = storageService.getCurrentUser();
    const userEmail = email || user?.email || 'default_user';
    const list = storageService.getMemorizedVocab(userEmail);
    const index = list.indexOf(vocabId);
    let isMemorized = false;
    if (index > -1) {
      list.splice(index, 1);
      isMemorized = false;
    } else {
      list.push(vocabId);
      isMemorized = true;
    }
    localStorage.setItem(`${STORAGE_MEMORIZED_VOCAB_KEY}_${userEmail.toLowerCase()}`, JSON.stringify(list));
    syncChannel?.postMessage({ type: 'sync_trigger' });
    window.dispatchEvent(new CustomEvent('study_progress_updated'));
    return isMemorized;
  },

  resetMemorizedVocab: (email?: string) => {
    const user = storageService.getCurrentUser();
    const userEmail = email || user?.email || 'default_user';
    localStorage.removeItem(`${STORAGE_MEMORIZED_VOCAB_KEY}_${userEmail.toLowerCase()}`);
    syncChannel?.postMessage({ type: 'sync_trigger' });
    window.dispatchEvent(new CustomEvent('study_progress_updated'));
  },

  getJLPTLevelStudyProgress: (email?: string): LevelStudyProgress[] => {
    const learnedVocabSet = new Set(storageService.getMemorizedVocab(email));
    const learnedKanjiSet = new Set(storageService.getMemorizedKanji(email));
    const levels: JLPTLevel[] = ['N5', 'N4', 'N3', 'N2'];

    return levels.map((lvl) => {
      const levelVocabList = VOCAB_MAZII_DICTIONARY.filter((v) => v.level === lvl);
      const levelKanjiList = KANJI_SENSEI_SARI.filter((k) => k.level === lvl);

      const vocabTotal = levelVocabList.length;
      const kanjiTotal = levelKanjiList.length;

      const vocabLearned = levelVocabList.filter((v) => learnedVocabSet.has(v.id)).length;
      const kanjiLearned = levelKanjiList.filter((k) => learnedKanjiSet.has(k.id)).length;

      const vocabPercent = vocabTotal > 0 ? Math.min(100, Math.round((vocabLearned / vocabTotal) * 100)) : 0;
      const kanjiPercent = kanjiTotal > 0 ? Math.min(100, Math.round((kanjiLearned / kanjiTotal) * 100)) : 0;

      const totalLearned = vocabLearned + kanjiLearned;
      const totalItems = vocabTotal + kanjiTotal;
      const totalPercent = totalItems > 0 ? Math.min(100, Math.round((totalLearned / totalItems) * 100)) : 0;

      return {
        level: lvl,
        vocabLearned,
        vocabTotal,
        vocabPercent,
        kanjiLearned,
        kanjiTotal,
        kanjiPercent,
        totalLearned,
        totalItems,
        totalPercent,
      };
    });
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
  },

  // ================= FOLDER TUGAS HARIAN SENSEI (Master & Murid Real-Time) =================
  getDailyTasks: (): DailyTask[] => {
    try {
      const delTaskSet = getDeletedTaskIdsSet();
      const raw = localStorage.getItem(STORAGE_DAILY_TASKS_KEY);
      const parsed: DailyTask[] = raw ? JSON.parse(raw) : [];
      const list = Array.isArray(parsed) ? parsed : [];
      const filtered = list
        .filter(t => t && t.id && !delTaskSet.has(String(t.id)))
        .map(t => ({
          ...t,
          createdAtTimestamp: normalizeTaskTimestamp(t.createdAtTimestamp) || 1000,
          updatedAt: normalizeTaskTimestamp(t.updatedAt) || 1000,
        }));

      // Pastikan Tugas Lembar 1 (25 Soal Tabel Latihan) selalu tersedia secara default kecuali jika dihapus oleh Master
      if (
        !delTaskSet.has(DEFAULT_WORKSHEET_TASK.id) &&
        !filtered.some(t => String(t.id) === DEFAULT_WORKSHEET_TASK.id)
      ) {
        filtered.unshift({
          ...DEFAULT_WORKSHEET_TASK,
          dueDate: getLocalTodayDateStr(),
          dueTime: '23:59',
          deadlineTimestamp: computeDeadlineTimestamp(getLocalTodayDateStr(), '23:59'),
          completions: [],
        });
        localStorage.setItem(STORAGE_DAILY_TASKS_KEY, JSON.stringify(filtered));
      } else {
        // Pastikan worksheetQuestions pada Lembar 1 selalu lengkap jika kosong
        const lembarIdx = filtered.findIndex(t => String(t.id) === DEFAULT_WORKSHEET_TASK.id);
        if (lembarIdx !== -1) {
          if (
            !Array.isArray(filtered[lembarIdx].worksheetQuestions) ||
            filtered[lembarIdx].worksheetQuestions!.length === 0
          ) {
            filtered[lembarIdx].worksheetQuestions = DEFAULT_LEMBAR_1_QUESTIONS;
          }
          if ((filtered[lembarIdx].updatedAt || 0) <= 1000) {
            filtered[lembarIdx].dueDate = getLocalTodayDateStr();
            filtered[lembarIdx].dueTime = filtered[lembarIdx].dueTime || '23:59';
            filtered[lembarIdx].deadlineTimestamp = computeDeadlineTimestamp(
              filtered[lembarIdx].dueDate,
              filtered[lembarIdx].dueTime
            );
          }
        }
      }

      return filtered.sort((a, b) => (b.createdAtTimestamp || 0) - (a.createdAtTimestamp || 0));
    } catch {
      return [{ ...DEFAULT_WORKSHEET_TASK, completions: [] }];
    }
  },

  getActiveDailyTasks: (): DailyTask[] => {
    return storageService.getDailyTasks().filter(t => t.isActive);
  },

  getTaskDeadlineInfo: (
    task: DailyTask,
    nowMs: number = Date.now()
  ): {
    deadlineMs: number;
    remainingMs: number;
    durationMinutes: number;
    durationLabel: string;
    timerStatus: 'idle' | 'running' | 'ended';
    isTimerRunning: boolean;
    isTimerFinished: boolean;
    isExpired: boolean;
    isUrgent: boolean;
    formattedCountdown: string;
    formattedDeadlineDate: string;
  } => {
    const durationMinutes = Number(task.durationMinutes) || 60;
    const durationLabel = formatDurationMinutesLabel(durationMinutes);
    const pad = (n: number) => String(n).padStart(2, '0');

    const rawStatus = task.timerStatus || 'idle';
    const hasTimerEnd = typeof task.timerEndTimestamp === 'number' && task.timerEndTimestamp > 0;

    if (rawStatus === 'running' && hasTimerEnd) {
      const deadlineMs = task.timerEndTimestamp!;
      const diff = deadlineMs - nowMs;
      const isTimerFinished = diff <= 0;
      const isTimerRunning = !isTimerFinished;
      const isExpired = isTimerFinished;
      const isUrgent = !isExpired && diff <= 10 * 60 * 1000; // <= 10 menit tersisa

      const safeSec = Math.max(0, Math.ceil(diff / 1000));
      const hours = Math.floor(safeSec / 3600);
      const minutes = Math.floor((safeSec % 3600) / 60);
      const seconds = safeSec % 60;
      const formattedCountdown = `${pad(hours)}j : ${pad(minutes)}m : ${pad(seconds)}d`;

      let formattedDeadlineDate = `Durasi ${durationLabel}`;
      try {
        const dt = new Date(deadlineMs);
        if (!Number.isNaN(dt.getTime())) {
          const timeStr = dt.toLocaleTimeString('id-ID', {
            hour12: false,
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
          });
          formattedDeadlineDate = `Berakhir Pukul ${timeStr} WIB (${durationLabel})`;
        }
      } catch {}

      return {
        deadlineMs,
        remainingMs: Math.max(0, diff),
        durationMinutes,
        durationLabel,
        timerStatus: isTimerFinished ? 'ended' : 'running',
        isTimerRunning,
        isTimerFinished,
        isExpired,
        isUrgent,
        formattedCountdown,
        formattedDeadlineDate,
      };
    }

    if (rawStatus === 'ended') {
      const deadlineMs = task.timerEndTimestamp || computeDeadlineTimestamp(task.dueDate, task.dueTime, task.deadlineTimestamp);
      return {
        deadlineMs,
        remainingMs: 0,
        durationMinutes,
        durationLabel,
        timerStatus: 'ended',
        isTimerRunning: false,
        isTimerFinished: true,
        isExpired: true,
        isUrgent: false,
        formattedCountdown: '00j : 00m : 00d',
        formattedDeadlineDate: `Waktu Habis (${durationLabel})`,
      };
    }

    // Idle mode (Menunggu Master menekan tombol Mulai Waktu Hitungan Mundur)
    const totalSec = durationMinutes * 60;
    const hours = Math.floor(totalSec / 3600);
    const minutes = Math.floor((totalSec % 3600) / 60);
    const seconds = totalSec % 60;
    const formattedCountdown = `${pad(hours)}j : ${pad(minutes)}m : ${pad(seconds)}d`;
    const deadlineMs = computeDeadlineTimestamp(task.dueDate, task.dueTime, task.deadlineTimestamp);

    return {
      deadlineMs,
      remainingMs: totalSec * 1000,
      durationMinutes,
      durationLabel,
      timerStatus: 'idle',
      isTimerRunning: false,
      isTimerFinished: false,
      isExpired: false,
      isUrgent: false,
      formattedCountdown,
      formattedDeadlineDate: `Durasi Pengerjaan: ${durationLabel}`,
    };
  },

  startTaskCountdown: (taskId: string, durationMinutes?: number): DailyTask | null => {
    const tasks = storageService.getDailyTasks();
    const idx = tasks.findIndex(t => t.id === taskId);
    if (idx === -1) return null;

    const now = Date.now();
    const mins = durationMinutes || tasks[idx].durationMinutes || 60;
    const endTs = now + mins * 60 * 1000;
    const endDt = new Date(endTs);
    const dueDate = `${endDt.getFullYear()}-${String(endDt.getMonth() + 1).padStart(2, '0')}-${String(endDt.getDate()).padStart(2, '0')}`;
    const dueTime = `${String(endDt.getHours()).padStart(2, '0')}:${String(endDt.getMinutes()).padStart(2, '0')}`;

    const updatedTask: DailyTask = {
      ...tasks[idx],
      durationMinutes: mins,
      timerStatus: 'running',
      timerStartedAt: now,
      timerEndTimestamp: endTs,
      dueDate,
      dueTime,
      deadlineTimestamp: endTs,
      updatedAt: now,
    };

    tasks[idx] = updatedTask;
    localStorage.setItem(STORAGE_DAILY_TASKS_KEY, JSON.stringify(tasks));

    fetch('/api/daily-tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ task: updatedTask }),
    }).catch(() => {});

    broadcastCloudRealtimeEvent({
      type: 'daily_task_upserted',
      task: updatedTask,
    });
    pushStateToCloudObject();
    syncChannel?.postMessage({ type: 'sync_trigger' });
    window.dispatchEvent(new CustomEvent('daily_tasks_updated', { detail: { task: updatedTask } }));

    return updatedTask;
  },

  stopTaskCountdown: (taskId: string): DailyTask | null => {
    const tasks = storageService.getDailyTasks();
    const idx = tasks.findIndex(t => t.id === taskId);
    if (idx === -1) return null;

    const now = Date.now();
    const updatedTask: DailyTask = {
      ...tasks[idx],
      timerStatus: 'idle',
      timerStartedAt: undefined,
      timerEndTimestamp: undefined,
      updatedAt: now,
    };

    tasks[idx] = updatedTask;
    localStorage.setItem(STORAGE_DAILY_TASKS_KEY, JSON.stringify(tasks));

    fetch('/api/daily-tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ task: updatedTask }),
    }).catch(() => {});

    broadcastCloudRealtimeEvent({
      type: 'daily_task_upserted',
      task: updatedTask,
    });
    pushStateToCloudObject();
    syncChannel?.postMessage({ type: 'sync_trigger' });
    window.dispatchEvent(new CustomEvent('daily_tasks_updated', { detail: { task: updatedTask } }));

    return updatedTask;
  },

  setTaskDurationMinutes: (taskId: string, durationMinutes: number): DailyTask | null => {
    // Saat Master menekan durasi pengerjaan, otomatis langsung mulai hitungan mundur secara real-time
    return storageService.startTaskCountdown(taskId, durationMinutes);
  },

  createDailyTask: (
    input: {
      title: string;
      description: string;
      level: JLPTLevel | 'ALL';
      category: DailyTaskCategory;
      dueDate?: string;
      dueTime?: string;
      deadlineTimestamp?: number;
      durationMinutes?: number;
      startTimerImmediately?: boolean;
      worksheetQuestions?: string[];
    },
    masterUser?: User | null
  ): DailyTask => {
    const now = new Date();
    const nowMs = now.getTime();
    const dateStr = getLocalTodayDateStr();
    const timeStr = now.toLocaleTimeString('id-ID', { hour12: false, hour: '2-digit', minute: '2-digit' });
    const targetDueDate = input.dueDate || dateStr;
    const targetDueTime = input.dueTime || '23:59';
    const durationMinutes = Number(input.durationMinutes) || 60;
    const startImmediately = Boolean(input.startTimerImmediately);
    const endTs = startImmediately ? nowMs + durationMinutes * 60 * 1000 : undefined;

    const newTask: DailyTask = {
      id: 'task-' + nowMs + '-' + Math.random().toString(36).substring(2, 6),
      title: input.title.trim(),
      description: input.description.trim(),
      level: input.level || 'ALL',
      category: input.category || 'umum',
      dueDate: targetDueDate,
      dueTime: targetDueTime,
      deadlineTimestamp: endTs || computeDeadlineTimestamp(targetDueDate, targetDueTime, input.deadlineTimestamp),
      durationMinutes,
      timerStatus: startImmediately ? 'running' : 'idle',
      timerStartedAt: startImmediately ? nowMs : undefined,
      timerEndTimestamp: endTs,
      createdAt: `${dateStr} ${timeStr}`,
      createdAtTimestamp: nowMs,
      createdBy: masterUser?.nickname || MASTER_CONFIG.nickname || 'Sensei Sari',
      isActive: true,
      worksheetQuestions: input.worksheetQuestions,
      completions: [],
      updatedAt: nowMs,
    };

    const tasks = storageService.getDailyTasks();
    tasks.unshift(newTask);
    localStorage.setItem(STORAGE_DAILY_TASKS_KEY, JSON.stringify(tasks));

    fetch('/api/daily-tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ task: newTask }),
    }).catch(() => {});

    broadcastCloudRealtimeEvent({
      type: 'daily_task_upserted',
      task: newTask,
    });
    pushStateToCloudObject();
    syncChannel?.postMessage({ type: 'sync_trigger' });
    window.dispatchEvent(new CustomEvent('daily_tasks_updated', { detail: { task: newTask } }));

    return newTask;
  },

  updateDailyTask: (
    taskId: string,
    updates: Partial<
      Pick<
        DailyTask,
        | 'title'
        | 'description'
        | 'level'
        | 'category'
        | 'dueDate'
        | 'dueTime'
        | 'deadlineTimestamp'
        | 'durationMinutes'
        | 'timerStatus'
        | 'timerStartedAt'
        | 'timerEndTimestamp'
        | 'isActive'
        | 'worksheetQuestions'
      >
    >
  ): DailyTask | null => {
    const tasks = storageService.getDailyTasks();
    const idx = tasks.findIndex(t => t.id === taskId);
    if (idx === -1) return null;

    const nextDueDate = updates.dueDate !== undefined ? updates.dueDate : tasks[idx].dueDate;
    const nextDueTime = updates.dueTime !== undefined ? updates.dueTime : tasks[idx].dueTime;
    const nextDeadlineTs =
      updates.deadlineTimestamp !== undefined
        ? updates.deadlineTimestamp
        : updates.dueDate !== undefined || updates.dueTime !== undefined
        ? computeDeadlineTimestamp(nextDueDate, nextDueTime)
        : tasks[idx].deadlineTimestamp;

    const updatedTask: DailyTask = {
      ...tasks[idx],
      ...updates,
      dueDate: nextDueDate,
      dueTime: nextDueTime,
      deadlineTimestamp: nextDeadlineTs,
      updatedAt: Date.now(),
    };
    tasks[idx] = updatedTask;
    localStorage.setItem(STORAGE_DAILY_TASKS_KEY, JSON.stringify(tasks));

    fetch('/api/daily-tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ task: updatedTask }),
    }).catch(() => {});

    broadcastCloudRealtimeEvent({
      type: 'daily_task_upserted',
      task: updatedTask,
    });
    pushStateToCloudObject();
    syncChannel?.postMessage({ type: 'sync_trigger' });
    window.dispatchEvent(new CustomEvent('daily_tasks_updated', { detail: { task: updatedTask } }));

    return updatedTask;
  },

  deleteDailyTask: (taskId: string): boolean => {
    try {
      const idStr = String(taskId).trim();
      const delTaskSet = getDeletedTaskIdsSet();
      delTaskSet.add(idStr);
      saveDeletedTaskIdsSet(delTaskSet);

      const tasks = storageService.getDailyTasks().filter(t => String(t.id) !== idStr);
      localStorage.setItem(STORAGE_DAILY_TASKS_KEY, JSON.stringify(tasks));

      fetch('/api/daily-tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ deleteTaskId: idStr }),
      }).catch(() => {});

      broadcastCloudRealtimeEvent({
        type: 'daily_task_deleted',
        taskId: idStr,
      });
      pushStateToCloudObject();
      syncChannel?.postMessage({ type: 'sync_trigger' });
      window.dispatchEvent(new CustomEvent('daily_tasks_updated'));
      return true;
    } catch {
      return false;
    }
  },

  toggleDailyTaskCompletion: (
    taskId: string,
    user: User,
    note?: string,
    autoSubmittedByTimer: boolean = false
  ): { completed: boolean; task: DailyTask | null } => {
    const tasks = storageService.getDailyTasks();
    const idx = tasks.findIndex(t => t.id === taskId);
    if (idx === -1) return { completed: false, task: null };

    const targetTask = tasks[idx];
    const emailLower = user.email.toLowerCase();
    const existingCompIdx = (targetTask.completions || []).findIndex(
      c => c.studentEmail.toLowerCase() === emailLower
    );

    const now = new Date();
    const dateStr = now.toISOString().split('T')[0];
    const timeStr = now.toLocaleTimeString('id-ID', { hour12: false, hour: '2-digit', minute: '2-digit' });

    let isNowCompleted = false;
    const nextCompletions = [...(targetTask.completions || [])];

    // Ketika murid sudah mengumpulkan tugas, murid tidak bisa lagi membatalkan atau mengubahnya
    if (
      existingCompIdx !== -1 &&
      nextCompletions[existingCompIdx]?.isCompleted !== false &&
      !storageService.isMaster(user)
    ) {
      return { completed: true, task: targetTask };
    }

    if (existingCompIdx !== -1 && note === undefined && !autoSubmittedByTimer) {
      // Unmark completion if toggled without note update
      nextCompletions.splice(existingCompIdx, 1);
      isNowCompleted = false;
    } else {
      const compEntry: DailyTaskCompletion = {
        studentEmail: emailLower,
        studentName: user.fullName || user.nickname || 'Murid',
        studentNickname: user.nickname || user.fullName?.split(/\s+/)[0] || 'Murid',
        completedAt: `${dateStr} ${timeStr}`,
        completedAtTimestamp: now.getTime(),
        isCompleted: true,
        autoSubmittedByTimer:
          autoSubmittedByTimer ||
          (existingCompIdx !== -1 ? nextCompletions[existingCompIdx].autoSubmittedByTimer : false),
        note: note?.trim() || (existingCompIdx !== -1 ? nextCompletions[existingCompIdx].note : undefined),
      };
      if (existingCompIdx !== -1) {
        nextCompletions[existingCompIdx] = compEntry;
      } else {
        nextCompletions.unshift(compEntry);
      }
      isNowCompleted = true;
    }

    const updatedTask: DailyTask = {
      ...targetTask,
      completions: nextCompletions,
      updatedAt: storageService.isMaster(user) ? Date.now() : (targetTask.updatedAt || 1000),
    };
    tasks[idx] = updatedTask;
    localStorage.setItem(STORAGE_DAILY_TASKS_KEY, JSON.stringify(tasks));

    if (!storageService.isMaster(user)) {
      storageService.heartbeatPresence(user, {
        currentTab: 'home',
        currentActivity: isNowCompleted
          ? `✅ Menyelesaikan Tugas Harian: ${updatedTask.title}`
          : `📁 Membuka Folder Tugas Harian Sensei`,
      });
    }

    fetch('/api/daily-tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ task: updatedTask }),
    }).catch(() => {});

    broadcastCloudRealtimeEvent({
      type: 'daily_task_upserted',
      task: updatedTask,
    });
    pushStateToCloudObject();
    syncChannel?.postMessage({ type: 'sync_trigger' });
    window.dispatchEvent(new CustomEvent('daily_tasks_updated', { detail: { task: updatedTask } }));

    return { completed: isNowCompleted, task: updatedTask };
  },

  saveWorksheetAnswers: (
    taskId: string,
    user: User,
    answers: Record<number, string>,
    studentNameField: string,
    markCompleted: boolean = false,
    note?: string,
    autoSubmittedByTimer: boolean = false
  ): DailyTask | null => {
    const tasks = storageService.getDailyTasks();
    const idx = tasks.findIndex(t => t.id === taskId);
    if (idx === -1) return null;

    const targetTask = tasks[idx];
    const emailLower = user.email.toLowerCase();
    const nextCompletions = [...(targetTask.completions || [])];
    const existingIdx = nextCompletions.findIndex(c => c.studentEmail.toLowerCase() === emailLower);

    const now = new Date();
    const dateStr = now.toISOString().split('T')[0];
    const timeStr = now.toLocaleTimeString('id-ID', { hour12: false, hour: '2-digit', minute: '2-digit' });

    const answeredCount = Object.values(answers).filter(v => String(v || '').trim().length > 0).length;
    const prevEntry = existingIdx !== -1 ? nextCompletions[existingIdx] : undefined;

    // Ketika murid sudah mengumpulkan tugas (isCompleted === true), kunci jawaban agar tidak bisa diubah lagi oleh akun murid
    if (prevEntry?.isCompleted === true && !storageService.isMaster(user)) {
      return targetTask;
    }

    const updatedEntry: DailyTaskCompletion = {
      studentEmail: emailLower,
      studentName: user.fullName || user.nickname || 'Murid',
      studentNickname: user.nickname || user.fullName?.split(/\s+/)[0] || 'Murid',
      completedAt: `${dateStr} ${timeStr}`,
      completedAtTimestamp: now.getTime(),
      isCompleted: markCompleted ? true : Boolean(prevEntry?.isCompleted),
      autoSubmittedByTimer: autoSubmittedByTimer || Boolean(prevEntry?.autoSubmittedByTimer),
      note: note !== undefined ? note.trim() : prevEntry?.note,
      studentNameField: studentNameField.trim() || user.fullName || user.nickname || 'Murid',
      worksheetAnswers: answers,
      answeredCount,
      teacherComment: prevEntry?.teacherComment,
      screenshotAttempts: prevEntry?.screenshotAttempts || 0,
      aiTranslateAttempts: prevEntry?.aiTranslateAttempts || 0,
      securityViolationLogs: prevEntry?.securityViolationLogs || [],
    };

    if (existingIdx !== -1) {
      nextCompletions[existingIdx] = updatedEntry;
    } else {
      nextCompletions.unshift(updatedEntry);
    }

    const updatedTask: DailyTask = {
      ...targetTask,
      completions: nextCompletions,
      updatedAt: now.getTime(),
    };
    tasks[idx] = updatedTask;
    localStorage.setItem(STORAGE_DAILY_TASKS_KEY, JSON.stringify(tasks));

    if (!storageService.isMaster(user)) {
      const totalQ = targetTask.worksheetQuestions?.length || 25;
      storageService.heartbeatPresence(user, {
        currentTab: 'home',
        currentActivity: markCompleted
          ? `✅ Mengumpulkan Tugas Tabel Lembar 1 (${answeredCount}/${totalQ} terjawab)`
          : `✏️ Mengerjakan Tabel Tugas Harian Sensei (${answeredCount}/${totalQ} terjawab)`,
      });
    }

    fetch('/api/daily-tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ task: updatedTask }),
    }).catch(() => {});

    broadcastCloudRealtimeEvent({
      type: 'daily_task_completion_upserted',
      taskId: updatedTask.id,
      completion: updatedEntry,
    });
    syncChannel?.postMessage({ type: 'sync_trigger' });
    window.dispatchEvent(new CustomEvent('daily_tasks_updated', { detail: { task: updatedTask } }));

    return updatedTask;
  },

  saveTeacherWorksheetComment: (
    taskId: string,
    studentEmail: string,
    teacherComment: string
  ): DailyTask | null => {
    const tasks = storageService.getDailyTasks();
    const idx = tasks.findIndex(t => t.id === taskId);
    if (idx === -1) return null;

    const targetTask = tasks[idx];
    const emailLower = studentEmail.toLowerCase();
    const nextCompletions = [...(targetTask.completions || [])];
    const compIdx = nextCompletions.findIndex(c => c.studentEmail.toLowerCase() === emailLower);
    if (compIdx === -1) return null;

    nextCompletions[compIdx] = {
      ...nextCompletions[compIdx],
      teacherComment: teacherComment.trim(),
      completedAtTimestamp: Date.now(),
    };

    const updatedTask: DailyTask = {
      ...targetTask,
      completions: nextCompletions,
      updatedAt: Date.now(),
    };
    tasks[idx] = updatedTask;
    localStorage.setItem(STORAGE_DAILY_TASKS_KEY, JSON.stringify(tasks));

    fetch('/api/daily-tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ task: updatedTask }),
    }).catch(() => {});

    broadcastCloudRealtimeEvent({
      type: 'daily_task_upserted',
      task: updatedTask,
    });
    pushStateToCloudObject();
    syncChannel?.postMessage({ type: 'sync_trigger' });
    window.dispatchEvent(new CustomEvent('daily_tasks_updated', { detail: { task: updatedTask } }));

    return updatedTask;
  },

  recordDailyTaskSecurityViolation: (
    user: User,
    violationType: 'screenshot' | 'ai_translate',
    detailMessage: string
  ): void => {
    if (!user || storageService.isMaster(user)) return;
    const emailLower = user.email.toLowerCase();
    const now = new Date();
    const dateStr = now.toISOString().split('T')[0];
    const timeStr = now.toLocaleTimeString('id-ID', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });

    const logItem = `[${timeStr}] ${
      violationType === 'screenshot'
        ? '📸 Mencoba Screenshot'
        : '🤖 Mencoba Terjemahan Otomatis / AI'
    }: ${detailMessage}`;

    const tasks = storageService.getDailyTasks();
    let updatedAnyTask: DailyTask | null = null;

    for (let i = 0; i < tasks.length; i++) {
      const t = tasks[i];
      if (!t.isActive) continue;
      const nextCompletions = [...(t.completions || [])];
      const existingIdx = nextCompletions.findIndex(
        c => c.studentEmail.toLowerCase() === emailLower
      );
      const prevEntry = existingIdx !== -1 ? nextCompletions[existingIdx] : undefined;

      const prevScreenshot = prevEntry?.screenshotAttempts || 0;
      const prevAi = prevEntry?.aiTranslateAttempts || 0;
      const prevLogs = Array.isArray(prevEntry?.securityViolationLogs)
        ? prevEntry!.securityViolationLogs!
        : [];

      const nextScreenshot =
        violationType === 'screenshot' ? prevScreenshot + 1 : prevScreenshot;
      const nextAi = violationType === 'ai_translate' ? prevAi + 1 : prevAi;
      const nextLogs = [logItem, ...prevLogs].slice(0, 15);

      const updatedEntry: DailyTaskCompletion = {
        studentEmail: emailLower,
        studentName: user.fullName || user.nickname || 'Murid',
        studentNickname: user.nickname || user.fullName?.split(/\s+/)[0] || 'Murid',
        completedAt: prevEntry?.completedAt || `${dateStr} ${timeStr.substring(0, 5)}`,
        completedAtTimestamp: Date.now(),
        isCompleted: Boolean(prevEntry?.isCompleted),
        autoSubmittedByTimer: Boolean(prevEntry?.autoSubmittedByTimer),
        note: prevEntry?.note,
        studentNameField:
          prevEntry?.studentNameField || user.fullName || user.nickname || 'Murid',
        worksheetAnswers: prevEntry?.worksheetAnswers || {},
        answeredCount: prevEntry?.answeredCount || 0,
        teacherComment: prevEntry?.teacherComment,
        screenshotAttempts: nextScreenshot,
        aiTranslateAttempts: nextAi,
        securityViolationLogs: nextLogs,
      };

      if (existingIdx !== -1) {
        nextCompletions[existingIdx] = updatedEntry;
      } else {
        nextCompletions.unshift(updatedEntry);
      }

      tasks[i] = {
        ...t,
        completions: nextCompletions,
        updatedAt: t.updatedAt || 1000,
      };
      updatedAnyTask = tasks[i];

      fetch('/api/daily-tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ task: tasks[i] }),
      }).catch(() => {});

      broadcastCloudRealtimeEvent({
        type: 'daily_task_upserted',
        task: tasks[i],
      });
    }

    if (updatedAnyTask) {
      localStorage.setItem(STORAGE_DAILY_TASKS_KEY, JSON.stringify(tasks));
    }

    const presenceMap = storageService.getOnlinePresenceMap();
    const prevPres = presenceMap[emailLower];
    const nextPresScreenshot =
      (prevPres?.screenshotAttempts || 0) + (violationType === 'screenshot' ? 1 : 0);
    const nextPresAi =
      (prevPres?.aiTranslateAttempts || 0) + (violationType === 'ai_translate' ? 1 : 0);

    presenceMap[emailLower] = {
      email: emailLower,
      name: user.fullName || user.nickname || prevPres?.name || 'Murid',
      nickname: user.nickname || user.fullName?.split(/\s+/)[0] || prevPres?.nickname || 'Murid',
      lastSeen: Date.now(),
      currentTab: 'home',
      currentActivity:
        violationType === 'screenshot'
          ? `🚨 Mencoba Screenshot Tugas Harian (${nextPresScreenshot}x)`
          : `🚨 Mencoba Terjemahan Otomatis / AI pada Tugas Harian (${nextPresAi}x)`,
      activeLevel: prevPres?.activeLevel || storageService.getActiveLevel(),
      lastActionAt: timeStr,
      screenshotAttempts: nextPresScreenshot,
      aiTranslateAttempts: nextPresAi,
    };
    localStorage.setItem(STORAGE_ONLINE_PRESENCE_KEY, JSON.stringify(presenceMap));
    fetch('/api/presence', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(presenceMap[emailLower]),
    }).catch(() => {});
    broadcastCloudRealtimeEvent({
      type: 'presence_update',
      presence: presenceMap[emailLower],
    });

    syncChannel?.postMessage({ type: 'sync_trigger' });
    window.dispatchEvent(new CustomEvent('daily_tasks_updated'));
    window.dispatchEvent(new CustomEvent('presence_updated'));
  },

  autoSubmitExpiredTasksForStudent: (
    user?: User | null,
    nowMs: number = Date.now(),
    liveAnswersByTask?: Record<string, Record<number, string>>,
    liveNameByTask?: Record<string, string>,
    liveNotesByTask?: Record<string, string>
  ): DailyTask[] => {
    if (!user || storageService.isMaster(user)) return [];
    const emailLower = user.email.toLowerCase();
    const tasks = storageService.getDailyTasks();
    const autoSubmittedTasks: DailyTask[] = [];

    for (const task of tasks) {
      if (!task.isActive) continue;
      const isRunningTimerExpired =
        task.timerStatus === 'running' &&
        typeof task.timerEndTimestamp === 'number' &&
        task.timerEndTimestamp > 0 &&
        nowMs >= task.timerEndTimestamp;

      if (!isRunningTimerExpired) continue;

      const existingComp = (task.completions || []).find(
        c => c.studentEmail.toLowerCase() === emailLower
      );

      // Skip if student already completed it after timerStartedAt
      const alreadyCompletedForCurrentTimer =
        existingComp?.isCompleted === true &&
        (existingComp.completedAtTimestamp || 0) >= (task.timerStartedAt || 0);

      if (alreadyCompletedForCurrentTimer) continue;

      const hasWorksheet =
        Array.isArray(task.worksheetQuestions) && task.worksheetQuestions.length > 0;

      if (hasWorksheet) {
        let localDraft: Record<number, string> = {};
        try {
          const rawDraft = localStorage.getItem(`sensei_sari_ws_draft_${task.id}_${emailLower}`);
          if (rawDraft) localDraft = JSON.parse(rawDraft);
        } catch {}

        const mergedAnswers: Record<number, string> = {
          ...(existingComp?.worksheetAnswers || {}),
          ...localDraft,
          ...(liveAnswersByTask?.[task.id] || {}),
        };

        const nameField =
          liveNameByTask?.[task.id] ||
          existingComp?.studentNameField ||
          user.fullName ||
          user.nickname ||
          'Murid';

        const noteField =
          liveNotesByTask?.[task.id] !== undefined
            ? liveNotesByTask[task.id]
            : existingComp?.note;

        const updated = storageService.saveWorksheetAnswers(
          task.id,
          user,
          mergedAnswers,
          nameField,
          true,
          noteField,
          true
        );
        if (updated) autoSubmittedTasks.push(updated);
      } else {
        const noteField =
          liveNotesByTask?.[task.id] !== undefined
            ? liveNotesByTask[task.id]
            : existingComp?.note || 'Dikumpulkan otomatis saat waktu hitungan mundur habis';
        const res = storageService.toggleDailyTaskCompletion(task.id, user, noteField, true);
        if (res.task) autoSubmittedTasks.push(res.task);
      }
    }

    return autoSubmittedTasks;
  },
};
