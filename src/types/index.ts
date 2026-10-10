export type JLPTLevel = 'N5' | 'N4' | 'N3' | 'N2';

export interface User {
  email: string;
  fullName: string;
  nickname: string;
  name?: string;
  registeredAt: string;
  lastOnlineAt?: string;
  lastOnlineTimestamp?: number;
  isMaster?: boolean;
  role?: 'student' | 'master';
}

export interface QuizResult {
  id: string;
  userEmail: string;
  studentName?: string;
  studentNickname?: string;
  level: JLPTLevel;
  score: number;
  totalQuestions: number;
  correctCount: number;
  durationUsedSeconds: number;
  durationSelectedMinutes: number;
  completedAt: string;
  date?: string;
  startedAtTime?: string;
  completedAtTime?: string;
  tabViolationsCount?: number;
}

export interface ActiveQuizRecord {
  id: string;
  userEmail: string;
  studentName: string;
  studentNickname: string;
  level: JLPTLevel;
  date: string; // YYYY-MM-DD
  startedAtTime: string; // HH:MM:SS
  completedAtTime?: string | null; // HH:MM:SS or null
  status: 'in_progress' | 'completed';
  score?: number | null;
  totalQuestions: number;
  correctCount?: number | null;
  answeredCount?: number;
  currentQuestion?: number;
  startedAtTimestamp: number;
  completedAtTimestamp?: number | null;
  tabViolationsCount?: number;
}

export interface QuizControlState {
  isActive: boolean;
  startedAt?: string;
  startedBy?: string;
  updatedAt?: number;
}

export interface StudentPresenceInfo {
  email: string;
  name: string;
  nickname?: string;
  lastSeen: number;
  lastOnlineTimestamp?: number;
  lastOnlineAt?: string;
  updatedAt?: number;
  currentTab?: string;
  currentActivity?: string;
  activeLevel?: JLPTLevel;
  quizProgress?: string;
  lastActionAt?: string;
  screenshotAttempts?: number;
  aiTranslateAttempts?: number;
}

export interface DailyTaskCompletion {
  studentEmail: string;
  studentName: string;
  studentNickname: string;
  completedAt: string;
  completedAtTimestamp: number;
  isCompleted?: boolean;
  autoSubmittedByTimer?: boolean;
  note?: string;
  studentNameField?: string;
  worksheetAnswers?: Record<number, string>;
  answeredCount?: number;
  teacherComment?: string;
  screenshotAttempts?: number;
  aiTranslateAttempts?: number;
  securityViolationLogs?: string[];
}

export type DailyTaskCategory = 'materi' | 'vocab' | 'kanji' | 'kuis' | 'umum';

export type DailyTaskDurationMinutes = 30 | 45 | 60 | 90 | 120;

export interface DailyTask {
  id: string;
  title: string;
  description: string;
  level: JLPTLevel | 'ALL';
  category: DailyTaskCategory;
  dueDate: string;
  dueTime?: string;
  deadlineTimestamp?: number;
  durationMinutes?: number;
  timerStatus?: 'idle' | 'running' | 'ended';
  timerStartedAt?: number;
  timerEndTimestamp?: number;
  createdAt: string;
  createdAtTimestamp: number;
  createdBy: string;
  isActive: boolean;
  worksheetQuestions?: string[];
  completions: DailyTaskCompletion[];
  updatedAt: number;
}

export interface LevelStudyProgress {
  level: JLPTLevel;
  vocabLearned: number;
  vocabTotal: number;
  vocabPercent: number;
  kanjiLearned: number;
  kanjiTotal: number;
  kanjiPercent: number;
  totalLearned: number;
  totalItems: number;
  totalPercent: number;
}

export interface QuizQuestion {
  id: number;
  level: JLPTLevel;
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
  topic?: string;
}

export interface VocabCard {
  id: number;
  level: JLPTLevel;
  japanese: string;
  kana?: string;
  romaji?: string;
  reading: string;
  indonesian: string;
  category: string;
  categoryJp?: string;
  example?: string;
  exampleIndonesian?: string;
}

export interface KanjiCard {
  id: number;
  level: JLPTLevel;
  kanji: string;
  onKun: string;
  bacaanOn?: string;
  bacaanKun?: string;
  ejaan?: string;
  romaji: string;
  arti: string;
  contoh: string;
  category: string;
}

export interface KanaCharacter {
  char: string;
  romaji: string;
  type?: 'seion' | 'dakuon' | 'handakuon' | 'yoon' | string;
  category?: string;
}

export interface GrammarItem {
  id: string | number;
  level?: JLPTLevel;
  title: string;
  pattern?: string;
  formula?: string;
  meaning?: string;
  explanation: string;
  bookReference?: string;
  targetBook?: string;
  examples: { jp?: string; japanese?: string; romaji: string; id?: string; indonesian?: string }[];
}
