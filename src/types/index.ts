export type JLPTLevel = 'N5' | 'N4' | 'N3' | 'N2';

export interface User {
  email: string;
  fullName: string;
  nickname: string;
  name?: string;
  registeredAt: string;
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
  startedAtTimestamp: number;
  completedAtTimestamp?: number | null;
  tabViolationsCount?: number;
}

export interface QuizControlState {
  isActive: boolean;
  startedAt?: string;
  startedBy?: string;
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
