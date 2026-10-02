import { KanaCharacter, GrammarItem, JLPTLevel } from '../types';
import { COMPREHENSIVE_GRAMMAR_100_LIST } from './grammarDatabase100';

export interface LevelTargetInfo {
  level: JLPTLevel;
  title: string;
  subtitle: string;
  studyHours: string;
  grammarTarget: string;
  grammarCount: number;
  kanjiTarget: string;
  kanjiCount: number;
  vocabTarget: string;
  vocabCount: number;
  description: string;
  targetCapability: string;
  recommendedBooks: string[];
}

export const JLPT_LEVEL_TARGETS: Record<JLPTLevel, LevelTargetInfo> = {
  N5: {
    level: 'N5',
    title: 'Level N5 (Dasar Pemula)',
    subtitle: 'Fondasi Huruf Kana, Tata Bahasa Pokok & Komunikasi Sehari-Hari',
    studyHours: '150–180 jam belajar',
    grammarTarget: '100+ Pola Tata Bahasa & Latihan',
    grammarCount: 100,
    kanjiTarget: '100 Kanji Target',
    kanjiCount: 100,
    vocabTarget: '800 Kosakata Target',
    vocabCount: 800,
    description: 'Memahami kalimat dan ungkapan dasar sehari-hari yang ditulis dalam Hiragana, Katakana, dan Kanji dasar sederhana. Mampu memahami instruksi di ruang kelas dan situasi harian.',
    targetCapability: 'Menyapa, memperkenalkan diri, berbelanja sederhana, menanyakan waktu dan arah, serta memahami pola kalimat dasar.',
    recommendedBooks: [
      'Minna no Nihongo Shokyu I (Bab 1–25)',
      'Shin Kanzen Master N5 Bunpou & Kanji',
      'TRY! Japanese Language Proficiency Test N5',
      'Nihongo So-Matome N5',
      'Mimi Kara Oboeru N5 Bunpou & Chokkai'
    ]
  },
  N4: {
    level: 'N4',
    title: 'Level N4 (Pekerja / Pemula Lanjut)',
    subtitle: 'Standar Kerja Magang / SSW Tokutei Ginou & Komunikasi Terstruktur',
    studyHours: '300 jam belajar',
    grammarTarget: '100+ Pola Tata Bahasa & Latihan',
    grammarCount: 100,
    kanjiTarget: '300 Kanji Target',
    kanjiCount: 300,
    vocabTarget: '1.500 Kosakata Target',
    vocabCount: 1500,
    description: 'Mampu memahami percakapan sehari-hari yang diucapkan dengan kecepatan wajar-sedang serta membaca teks tentang topik kehidupan sehari-hari dengan kanji dan kosakata terstruktur.',
    targetCapability: 'Memahami instruksi kerja pabrik/kantor, membuat janji temu, meminta izin, menjelaskan alasan kondisi sakit, dan membaca pengumuman publik.',
    recommendedBooks: [
      'Minna no Nihongo Shokyu II (Bab 26–50)',
      'Shin Kanzen Master N4 Bunpou & Dokkai',
      'TRY! Japanese Language Proficiency Test N4',
      'Nihongo So-Matome N4',
      'Mimi Kara Oboeru N4 Bunpou & Goi'
    ]
  },
  N3: {
    level: 'N3',
    title: 'Level N3 (Menengah / Jembatan Profesional)',
    subtitle: 'Transisi Menuju Kemandirian Komunikasi & Kehidupan Nyata di Jepang',
    studyHours: '450 jam belajar',
    grammarTarget: '100+ Pola Tata Bahasa & Latihan',
    grammarCount: 100,
    kanjiTarget: '650 Kanji Target',
    kanjiCount: 650,
    vocabTarget: '3.700 Kosakata Target',
    vocabCount: 3700,
    description: 'Mampu memahami bahasa Jepang yang digunakan dalam situasi sehari-hari sampai tingkat tertentu, memahami intisari tajuk koran/majalah serta pembicaraan dengan kecepatan wajar alami.',
    targetCapability: 'Mampu berdiskusi ringan, membaca artikel umum, memahami nuansa kalimat bertingkat, dan menyampaikan opini dengan alasan yang runtut.',
    recommendedBooks: [
      'Shin Kanzen Master N3 Bunpou, Dokkai, Choukai & Goi',
      'Nihongo So-Matome N3 (Kurikulum 6 Minggu)',
      'TRY! Japanese Language Proficiency Test N3',
      'Mimi Kara Oboeru N3 Bunpou & Goi',
      'Minna no Nihongo Chukyu I & Chukyu e Ikou'
    ]
  },
  N2: {
    level: 'N2',
    title: 'Level N2 (Menengah Atas / Standar Kerja & Kuliah)',
    subtitle: 'Syarat Mutlak Bekerja Formal di Perusahaan Jepang & Studi Universitas',
    studyHours: 'Sekitar 600 jam belajar',
    grammarTarget: '100+ Pola Tata Bahasa & Latihan',
    grammarCount: 100,
    kanjiTarget: '1.000 Kanji Target',
    kanjiCount: 1000,
    vocabTarget: '6.000 Kosakata Target',
    vocabCount: 6000,
    description: 'Mampu memahami bahasa Jepang dalam berbagai situasi kehidupan sehari-hari dan profesional, membaca artikel bertopik luas dengan pemahaman mendalam, serta mengikuti percakapan wajar.',
    targetCapability: 'Korespondensi bisnis resmi (Keigo), membaca dokumen kontrak perdata, mengikuti rapat bisnis, menulis laporan kerja formal, dan memahami siaran berita televisi.',
    recommendedBooks: [
      'Shin Kanzen Master N2 Bunpou (Analisis Nuansa & Kalimat Formal)',
      'Shin Kanzen Master N2 Dokkai, Choukai & Kanji',
      'Nihongo So-Matome N2 Bunpou & Dokkai',
      'TRY! Japanese Language Proficiency Test N2',
      'Mimi Kara Oboeru N2 Bunpou Training'
    ]
  }
};

export interface ReferenceBookInfo {
  id: string;
  name: string;
  japaneseName: string;
  publisher: string;
  focusRole: string;
  badgeColor: string;
  description: string;
  syllabusHighlights: string[];
}

export const MAIN_REFERENCE_BOOKS: ReferenceBookInfo[] = [
  {
    id: 'minna',
    name: '1. Minna no Nihongo',
    japaneseName: 'みんなの日本語',
    publisher: '3A Corporation',
    focusRole: 'Fondasi Pola Kalimat & Partikel Dasar (Bab 1–50)',
    badgeColor: 'bg-amber-100 text-amber-900 border-amber-300',
    description: 'Standar kurikulum internasional terpopuler untuk memahami pola kalimat dasar secara berurutan dan terstruktur.',
    syllabusHighlights: [
      'Shokyu I (Bab 1–25): Partikel dasar, kopula です/ではありません, kata kerja -masu, bentuk -te, -nai, -ta, jishokei, perbandingan.',
      'Shokyu II (Bab 26–50): Bentuk ~んです, kanoukei (potensial), shieki (kausatif), ukemi (pasif), keigo dasar, pengandaian tara/ba.'
    ]
  },
  {
    id: 'shinkanzen',
    name: '2. Shin Kanzen Master',
    japaneseName: '新完全マスター',
    publisher: '3A Corporation',
    focusRole: 'Analisis Perbedaan Nuansa Mendalam & Standar Resmi JLPT',
    badgeColor: 'bg-rose-100 text-rose-900 border-rose-300',
    description: 'Buku rujukan nomor satu dalam membedah perbedaan nuansa tipis antar pola tata bahasa sinonim untuk mencapai skor maksimal pada ujian JLPT.',
    syllabusHighlights: [
      'N3 Bunpou: Pembeda nuansa kamoshirenai vs hazu da, you ni naru vs koto ni naru, ba vs tara vs nara.',
      'N2 Bunpou: Keigo bisnis lengkap, pola penulisan formal akademik (~である, ~に際して, ~に基づいて), kausalitas bersyarat, pembatasan (~わけにはいかない, ~一方).'
    ]
  },
  {
    id: 'somatome',
    name: '3. Nihongo So-Matome',
    japaneseName: '日本語総まとめ',
    publisher: 'ASK Publishing',
    focusRole: 'Rangkuman Tematik Mingguan & Visualisasi Situasi',
    badgeColor: 'bg-emerald-100 text-emerald-900 border-emerald-300',
    description: 'Format ringkas berbasis silabus 6–8 minggu yang mengelompokkan pola tata bahasa berdasarkan fungsi tematik dan situasi komunikasi nyata.',
    syllabusHighlights: [
      'Minggu 1–2: Hubungan sebab akibat & pengandaian situasional.',
      'Minggu 3–4: Ungkapan emosi, dugaan, harapan, dan perubahan kondisi.',
      'Minggu 5–6: Pola pertentangan, pembatasan, dan tata bahasa formal surat/dokumen.'
    ]
  },
  {
    id: 'try',
    name: '4. TRY! JLPT Series',
    japaneseName: 'TRY! 日本語能力試験',
    publisher: 'ASK Publishing / ABK',
    focusRole: 'Tata Bahasa Kontekstual Percakapan & Aplikasi Praktis Kerja',
    badgeColor: 'bg-blue-100 text-blue-900 border-blue-300',
    description: 'Menghubungkan setiap pola tata bahasa ke dalam teks bacaan percakapan realistis di lingkungan kerja, kampus, dan pergaulan Jepang sehari-hari.',
    syllabusHighlights: [
      'Setiap bab diawali dengan artikel/percakapan otentik.',
      'Menjelaskan fungsi komunikatif kalimat secara langsung untuk mendengar dan berbicara.',
      'Latihan soal format resmi JLPT di setiap akhir tema.'
    ]
  },
  {
    id: 'mimikara',
    name: '5. Mimi Kara Oboeru',
    japaneseName: '耳から覚える日本語能力試験',
    publisher: 'ALC Press',
    focusRole: 'Pendengaran Aktif, Kolokasi Alami & Ritme Kalimat Penutur Asli',
    badgeColor: 'bg-purple-100 text-purple-900 border-purple-300',
    description: 'Metode penguasaan tata bahasa berbasis ritme pendengaran berulang sehingga pola kalimat dan kolokasi kata terucap secara spontan dan alami.',
    syllabusHighlights: [
      'Menghafal kalimat contoh utuh melalui audio imersif.',
      'Penguasaan pasangan kata (kolokasi) yang sering muncul bersamaan di ujian.',
      'Latihan dikte kalimat dan pemahaman pendengaran (choukai).'
    ]
  }
];

export const HIRAGANA_BASIC: KanaCharacter[] = [
  { char: 'あ', romaji: 'a', category: 'vowel' },
  { char: 'い', romaji: 'i', category: 'vowel' },
  { char: 'う', romaji: 'u', category: 'vowel' },
  { char: 'え', romaji: 'e', category: 'vowel' },
  { char: 'お', romaji: 'o', category: 'vowel' },
  { char: 'か', romaji: 'ka', category: 'k' },
  { char: 'き', romaji: 'ki', category: 'k' },
  { char: 'く', romaji: 'ku', category: 'k' },
  { char: 'け', romaji: 'ke', category: 'k' },
  { char: 'こ', romaji: 'ko', category: 'k' },
  { char: 'さ', romaji: 'sa', category: 's' },
  { char: 'し', romaji: 'shi', category: 's' },
  { char: 'す', romaji: 'su', category: 's' },
  { char: 'せ', romaji: 'se', category: 's' },
  { char: 'そ', romaji: 'so', category: 's' },
  { char: 'た', romaji: 'ta', category: 't' },
  { char: 'ち', romaji: 'chi', category: 't' },
  { char: 'つ', romaji: 'tsu', category: 't' },
  { char: 'て', romaji: 'te', category: 't' },
  { char: 'と', romaji: 'to', category: 't' },
  { char: 'な', romaji: 'na', category: 'n' },
  { char: 'に', romaji: 'ni', category: 'n' },
  { char: 'ぬ', romaji: 'nu', category: 'n' },
  { char: 'ね', romaji: 'ne', category: 'n' },
  { char: 'の', romaji: 'no', category: 'n' },
  { char: 'は', romaji: 'ha', category: 'h' },
  { char: 'ひ', romaji: 'hi', category: 'h' },
  { char: 'ふ', romaji: 'fu', category: 'h' },
  { char: 'へ', romaji: 'he', category: 'h' },
  { char: 'ほ', romaji: 'ho', category: 'h' },
  { char: 'ま', romaji: 'ma', category: 'm' },
  { char: 'み', romaji: 'mi', category: 'm' },
  { char: 'む', romaji: 'mu', category: 'm' },
  { char: 'め', romaji: 'me', category: 'm' },
  { char: 'も', romaji: 'mo', category: 'm' },
  { char: 'や', romaji: 'ya', category: 'y' },
  { char: 'ゆ', romaji: 'yu', category: 'y' },
  { char: 'よ', romaji: 'yo', category: 'y' },
  { char: 'ら', romaji: 'ra', category: 'r' },
  { char: 'り', romaji: 'ri', category: 'r' },
  { char: 'る', romaji: 'ru', category: 'r' },
  { char: 'れ', romaji: 're', category: 'r' },
  { char: 'ろ', romaji: 'ro', category: 'r' },
  { char: 'わ', romaji: 'wa', category: 'w' },
  { char: 'を', romaji: 'wo', category: 'w' },
  { char: 'ん', romaji: 'n', category: 'n' },
];

export const HIRAGANA_DAKUON: KanaCharacter[] = [
  { char: 'が', romaji: 'ga', type: 'dakuon' },
  { char: 'ぎ', romaji: 'gi', type: 'dakuon' },
  { char: 'ぐ', romaji: 'gu', type: 'dakuon' },
  { char: 'げ', romaji: 'ge', type: 'dakuon' },
  { char: 'ご', romaji: 'go', type: 'dakuon' },
  { char: 'ざ', romaji: 'za', type: 'dakuon' },
  { char: 'じ', romaji: 'ji', type: 'dakuon' },
  { char: 'ず', romaji: 'zu', type: 'dakuon' },
  { char: 'ぜ', romaji: 'ze', type: 'dakuon' },
  { char: 'ぞ', romaji: 'zo', type: 'dakuon' },
  { char: 'だ', romaji: 'da', type: 'dakuon' },
  { char: 'ぢ', romaji: 'ji', type: 'dakuon' },
  { char: 'づ', romaji: 'zu', type: 'dakuon' },
  { char: 'で', romaji: 'de', type: 'dakuon' },
  { char: 'ど', romaji: 'do', type: 'dakuon' },
  { char: 'ば', romaji: 'ba', type: 'dakuon' },
  { char: 'び', romaji: 'bi', type: 'dakuon' },
  { char: 'ぶ', romaji: 'bu', type: 'dakuon' },
  { char: 'べ', romaji: 'be', type: 'dakuon' },
  { char: 'ぼ', romaji: 'bo', type: 'dakuon' },
  { char: 'ぱ', romaji: 'pa', type: 'handakuon' },
  { char: 'ぴ', romaji: 'pi', type: 'handakuon' },
  { char: 'ぷ', romaji: 'pu', type: 'handakuon' },
  { char: 'ぺ', romaji: 'pe', type: 'handakuon' },
  { char: 'ぽ', romaji: 'po', type: 'handakuon' },
];

export const HIRAGANA_YOON: KanaCharacter[] = [
  { char: 'きゃ', romaji: 'kya', type: 'yoon' },
  { char: 'きゅ', romaji: 'kyu', type: 'yoon' },
  { char: 'きょ', romaji: 'kyo', type: 'yoon' },
  { char: 'しゃ', romaji: 'sha', type: 'yoon' },
  { char: 'しゅ', romaji: 'shu', type: 'yoon' },
  { char: 'しょ', romaji: 'sho', type: 'yoon' },
  { char: 'ちゃ', romaji: 'cha', type: 'yoon' },
  { char: 'ちゅ', romaji: 'chu', type: 'yoon' },
  { char: 'ちょ', romaji: 'cho', type: 'yoon' },
  { char: 'にゃ', romaji: 'nya', type: 'yoon' },
  { char: 'にゅ', romaji: 'nyu', type: 'yoon' },
  { char: 'にょ', romaji: 'nyo', type: 'yoon' },
  { char: 'ひゃ', romaji: 'hya', type: 'yoon' },
  { char: 'ひゅ', romaji: 'hyu', type: 'yoon' },
  { char: 'ひょ', romaji: 'hyo', type: 'yoon' },
  { char: 'みゃ', romaji: 'mya', type: 'yoon' },
  { char: 'みゅ', romaji: 'myu', type: 'yoon' },
  { char: 'みょ', romaji: 'myo', type: 'yoon' },
  { char: 'りゃ', romaji: 'rya', type: 'yoon' },
  { char: 'りゅ', romaji: 'ryu', type: 'yoon' },
  { char: 'りょ', romaji: 'ryo', type: 'yoon' },
  { char: 'ぎゃ', romaji: 'gya', type: 'yoon' },
  { char: 'ぎゅ', romaji: 'gyu', type: 'yoon' },
  { char: 'ぎょ', romaji: 'gyo', type: 'yoon' },
  { char: 'じゃ', romaji: 'ja', type: 'yoon' },
  { char: 'じゅ', romaji: 'ju', type: 'yoon' },
  { char: 'じょ', romaji: 'jo', type: 'yoon' },
  { char: 'びゃ', romaji: 'bya', type: 'yoon' },
  { char: 'びゅ', romaji: 'byu', type: 'yoon' },
  { char: 'びょ', romaji: 'byo', type: 'yoon' },
  { char: 'ぴゃ', romaji: 'pya', type: 'yoon' },
  { char: 'ぴゅ', romaji: 'pyu', type: 'yoon' },
  { char: 'ぴょ', romaji: 'pyo', type: 'yoon' },
];

export const KATAKANA_BASIC: KanaCharacter[] = [
  { char: 'ア', romaji: 'a', category: 'vowel' },
  { char: 'イ', romaji: 'i', category: 'vowel' },
  { char: 'ウ', romaji: 'u', category: 'vowel' },
  { char: 'エ', romaji: 'e', category: 'vowel' },
  { char: 'オ', romaji: 'o', category: 'vowel' },
  { char: 'カ', romaji: 'ka', category: 'k' },
  { char: 'キ', romaji: 'ki', category: 'k' },
  { char: 'ク', romaji: 'ku', category: 'k' },
  { char: 'ケ', romaji: 'ke', category: 'k' },
  { char: 'コ', romaji: 'ko', category: 'k' },
  { char: 'サ', romaji: 'sa', category: 's' },
  { char: 'シ', romaji: 'shi', category: 's' },
  { char: 'ス', romaji: 'su', category: 's' },
  { char: 'セ', romaji: 'se', category: 's' },
  { char: 'ソ', romaji: 'so', category: 's' },
  { char: 'タ', romaji: 'ta', category: 't' },
  { char: 'チ', romaji: 'chi', category: 't' },
  { char: 'ツ', romaji: 'tsu', category: 't' },
  { char: 'テ', romaji: 'te', category: 't' },
  { char: 'ト', romaji: 'to', category: 't' },
  { char: 'ナ', romaji: 'na', category: 'n' },
  { char: 'ニ', romaji: 'ni', category: 'n' },
  { char: 'ヌ', romaji: 'nu', category: 'n' },
  { char: 'ネ', romaji: 'ne', category: 'n' },
  { char: 'ノ', romaji: 'no', category: 'n' },
  { char: 'ハ', romaji: 'ha', category: 'h' },
  { char: 'ヒ', romaji: 'hi', category: 'h' },
  { char: 'フ', romaji: 'fu', category: 'h' },
  { char: 'ヘ', romaji: 'he', category: 'h' },
  { char: 'ホ', romaji: 'ho', category: 'h' },
  { char: 'マ', romaji: 'ma', category: 'm' },
  { char: 'ミ', romaji: 'mi', category: 'm' },
  { char: 'ム', romaji: 'mu', category: 'm' },
  { char: 'メ', romaji: 'me', category: 'm' },
  { char: 'モ', romaji: 'mo', category: 'm' },
  { char: 'ヤ', romaji: 'ya', category: 'y' },
  { char: 'ユ', romaji: 'yu', category: 'y' },
  { char: 'ヨ', romaji: 'yo', category: 'y' },
  { char: 'ラ', romaji: 'ra', category: 'r' },
  { char: 'リ', romaji: 'ri', category: 'r' },
  { char: 'ル', romaji: 'ru', category: 'r' },
  { char: 'レ', romaji: 're', category: 'r' },
  { char: 'ロ', romaji: 'ro', category: 'r' },
  { char: 'ワ', romaji: 'wa', category: 'w' },
  { char: 'ヲ', romaji: 'wo', category: 'w' },
  { char: 'ン', romaji: 'n', category: 'n' },
];

export interface GrammarExercise {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface EnhancedGrammarItem extends GrammarItem {
  practiceExercises?: GrammarExercise[];
}

export const GRAMMAR_N5: EnhancedGrammarItem[] = COMPREHENSIVE_GRAMMAR_100_LIST.filter(g => g.level === 'N5');
export const GRAMMAR_N4: EnhancedGrammarItem[] = COMPREHENSIVE_GRAMMAR_100_LIST.filter(g => g.level === 'N4');
export const GRAMMAR_N3: EnhancedGrammarItem[] = COMPREHENSIVE_GRAMMAR_100_LIST.filter(g => g.level === 'N3');
export const GRAMMAR_N2: EnhancedGrammarItem[] = COMPREHENSIVE_GRAMMAR_100_LIST.filter(g => g.level === 'N2');
export const ALL_GRAMMAR: EnhancedGrammarItem[] = COMPREHENSIVE_GRAMMAR_100_LIST;
