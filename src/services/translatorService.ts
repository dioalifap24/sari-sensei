import { VOCAB_MAZII_DICTIONARY } from '../data/vocabData';
import { KANJI_SENSEI_SARI } from '../data/kanjiSenseiSari';

export interface TranslationResult {
  sourceText: string;
  japanese: string;
  romaji: string;
  furigana?: string;
  indonesian: string;
  politeness?: string;
  breakdown?: {
    word: string;
    reading: string;
    meaning: string;
  }[];
  tips?: string;
  isOffline?: boolean;
}

// Kamus percakapan sehari-hari bahasa Indonesia - Jepang yang akurat dengan Kanji & Romaji (Ejaan)
const COMMON_CONVERSATIONS: {
  patterns: string[];
  japanese: string;
  romaji: string;
  furigana: string;
  indonesian: string;
  politeness: string;
  breakdown?: { word: string; reading: string; meaning: string }[];
}[] = [
  {
    patterns: ['selamat pagi', 'pagi'],
    japanese: 'おはようございます',
    romaji: 'Ohayou gozaimasu',
    furigana: 'おはよう ございます',
    indonesian: 'Selamat pagi (sopan)',
    politeness: 'Sopan / Formal',
    breakdown: [
      { word: 'おはよう', reading: 'ohayou', meaning: 'pagi' },
      { word: 'ございます', reading: 'gozaimasu', meaning: 'bentuk sopan' },
    ],
  },
  {
    patterns: ['selamat siang', 'halo', 'hai', 'selamat sore'],
    japanese: 'こんにちは',
    romaji: 'Konnichiwa',
    furigana: 'こんにちは',
    indonesian: 'Halo / Selamat siang / Selamat sore',
    politeness: 'Standar / Sopan',
    breakdown: [{ word: 'こんにちは', reading: 'konnichiwa', meaning: 'salam siang/sore' }],
  },
  {
    patterns: ['selamat malam'],
    japanese: 'こんばんは',
    romaji: 'Konbanwa',
    furigana: 'こんばんは',
    indonesian: 'Selamat malam (salam jumpa)',
    politeness: 'Standar / Sopan',
    breakdown: [{ word: 'こんばんは', reading: 'konbanwa', meaning: 'selamat malam' }],
  },
  {
    patterns: ['selamat tidur', 'selamat istirahat'],
    japanese: 'おやすみなさい',
    romaji: 'Oyasuminasai',
    furigana: 'おやすみなさい',
    indonesian: 'Selamat tidur / Selamat istirahat',
    politeness: 'Sopan',
    breakdown: [{ word: 'おやすみ', reading: 'oyasumi', meaning: 'istirahat/tidur' }],
  },
  {
    patterns: ['terima kasih', 'makasih', 'terima kasih banyak'],
    japanese: 'ありがとうございます',
    romaji: 'Arigatou gozaimasu',
    furigana: 'ありがとう ございます',
    indonesian: 'Terima kasih banyak',
    politeness: 'Sopan / Formal',
    breakdown: [
      { word: 'ありがとう', reading: 'arigatou', meaning: 'terima kasih' },
      { word: 'ございます', reading: 'gozaimasu', meaning: 'bentuk sopan' },
    ],
  },
  {
    patterns: ['sama-sama', 'sama sama', 'kembali'],
    japanese: 'どういたしまして',
    romaji: 'Dou itashimashite',
    furigana: 'どういたしまして',
    indonesian: 'Sama-sama / Kembali',
    politeness: 'Standar / Sopan',
    breakdown: [{ word: 'どういたしまして', reading: 'dou itashimashite', meaning: 'sama-sama' }],
  },
  {
    patterns: ['apa kabar', 'bagaimana kabarmu', 'apakah sehat'],
    japanese: 'お元気ですか',
    romaji: 'Ogenki desu ka',
    furigana: 'おげんき です か',
    indonesian: 'Apakah Anda sehat? / Apa kabar?',
    politeness: 'Sopan (Desu/Masu)',
    breakdown: [
      { word: 'お元気', reading: 'ogenki', meaning: 'sehat / kabar baik' },
      { word: 'ですか', reading: 'desu ka', meaning: 'apakah (partikel tanya)' },
    ],
  },
  {
    patterns: ['saya sehat', 'kabar baik', 'sehat'],
    japanese: 'はい、元気です',
    romaji: 'Hai, genki desu',
    furigana: 'はい、げんき です',
    indonesian: 'Ya, saya sehat / kabar baik',
    politeness: 'Sopan',
    breakdown: [
      { word: 'はい', reading: 'hai', meaning: 'ya' },
      { word: '元気です', reading: 'genki desu', meaning: 'sehat/baik' },
    ],
  },
  {
    patterns: ['saya sedang belajar bahasa jepang', 'belajar bahasa jepang'],
    japanese: '私は日本語を勉強しています',
    romaji: 'Watashi wa nihongo o benkyou shite imasu',
    furigana: 'わたし は にほんご を べんきょう して います',
    indonesian: 'Saya sedang belajar bahasa Jepang',
    politeness: 'Sopan (Formal)',
    breakdown: [
      { word: '私', reading: 'watashi', meaning: 'saya' },
      { word: '日本語', reading: 'nihongo', meaning: 'bahasa jepang' },
      { word: '勉強しています', reading: 'benkyou shite imasu', meaning: 'sedang belajar' },
    ],
  },
  {
    patterns: ['semangat', 'semangat ya', 'berjuanglah', 'ayo semangat'],
    japanese: '頑張ってください',
    romaji: 'Ganbatte kudasai',
    furigana: 'がんばって ください',
    indonesian: 'Semangat ya! / Berjuanglah!',
    politeness: 'Sopan / Menyemangati',
    breakdown: [
      { word: '頑張って', reading: 'ganbatte', meaning: 'berjuang/semangat' },
      { word: 'ください', reading: 'kudasai', meaning: 'tolong/silakan' },
    ],
  },
  {
    patterns: ['maaf', 'permisi', 'mohon maaf'],
    japanese: 'すみません',
    romaji: 'Sumimasen',
    furigana: 'すみません',
    indonesian: 'Permisi / Mohon maaf',
    politeness: 'Sopan',
    breakdown: [{ word: 'すみません', reading: 'sumimasen', meaning: 'permisi / maaf' }],
  },
  {
    patterns: ['minta maaf', 'saya minta maaf'],
    japanese: 'ごめんなさい',
    romaji: 'Gomennasai',
    furigana: 'ごめんなさい',
    indonesian: 'Saya minta maaf',
    politeness: 'Akrab / Sopan',
    breakdown: [{ word: 'ごめんなさい', reading: 'gomennasai', meaning: 'minta maaf' }],
  },
  {
    patterns: ['senang bertemu denganmu', 'salam kenal'],
    japanese: 'はじめまして、よろしくお願いします',
    romaji: 'Hajimemashite, yoroshiku onegaishimasu',
    furigana: 'はじめまして、よろしく おねがいします',
    indonesian: 'Salam kenal, mohon bantuannya / senang bertemu dengan Anda',
    politeness: 'Sangat Sopan / Perkenalan',
    breakdown: [
      { word: 'はじめまして', reading: 'hajimemashite', meaning: 'salam kenal' },
      { word: 'よろしく', reading: 'yoroshiku', meaning: 'dengan baik' },
      { word: 'お願いします', reading: 'onegaishimasu', meaning: 'mohon bantuannya' },
    ],
  },
  {
    patterns: ['sampai jumpa', 'selamat tinggal', 'dadah'],
    japanese: 'さようなら',
    romaji: 'Sayounara',
    furigana: 'さようなら',
    indonesian: 'Selamat tinggal / Sampai jumpa',
    politeness: 'Standar',
    breakdown: [{ word: 'さようなら', reading: 'sayounara', meaning: 'selamat tinggal' }],
  },
  {
    patterns: ['sampai jumpa besok', 'sampai ketemu besok'],
    japanese: 'また明日',
    romaji: 'Mata ashita',
    furigana: 'また あした',
    indonesian: 'Sampai jumpa besok',
    politeness: 'Kasual / Sehari-hari',
    breakdown: [
      { word: 'また', reading: 'mata', meaning: 'lagi / sampai' },
      { word: '明日', reading: 'ashita', meaning: 'besok' },
    ],
  },
  {
    patterns: ['berapa harganya', 'ini berapa harganya', 'berapa harganya ini'],
    japanese: 'これはいくらですか',
    romaji: 'Kore wa ikura desu ka',
    furigana: 'これ は いくら です か',
    indonesian: 'Berapa harganya ini?',
    politeness: 'Sopan (Tanya Harga)',
    breakdown: [
      { word: 'これ', reading: 'kore', meaning: 'ini' },
      { word: 'いくら', reading: 'ikura', meaning: 'berapa harganya' },
      { word: 'ですか', reading: 'desu ka', meaning: 'apakah' },
    ],
  },
  {
    patterns: ['di mana toilet', 'toilet di mana', 'kamar mandi di mana'],
    japanese: 'トイレはどこですか',
    romaji: 'Toire wa doko desu ka',
    furigana: 'トイレ は どこ です か',
    indonesian: 'Toilet di mana ya?',
    politeness: 'Sopan',
    breakdown: [
      { word: 'トイレ', reading: 'toire', meaning: 'toilet' },
      { word: 'どこ', reading: 'doko', meaning: 'di mana' },
      { word: 'ですか', reading: 'desu ka', meaning: 'apakah' },
    ],
  },
  {
    patterns: ['di mana stasiun', 'stasiun di mana'],
    japanese: '駅はどこですか',
    romaji: 'Eki wa doko desu ka',
    furigana: 'えき は どこ です か',
    indonesian: 'Stasiun berada di mana?',
    politeness: 'Sopan',
    breakdown: [
      { word: '駅', reading: 'eki', meaning: 'stasiun' },
      { word: 'どこ', reading: 'doko', meaning: 'di mana' },
    ],
  },
  {
    patterns: ['enak sekali', 'sangat enak', 'enak'],
    japanese: 'とても美味しいです',
    romaji: 'Totemo oishii desu',
    furigana: 'とても おいしい です',
    indonesian: 'Sangat enak sekali',
    politeness: 'Sopan',
    breakdown: [
      { word: 'とても', reading: 'totemo', meaning: 'sangat' },
      { word: '美味しい', reading: 'oishii', meaning: 'enak / lezat' },
    ],
  },
  {
    patterns: ['selamat makan'],
    japanese: 'いただきます',
    romaji: 'Itadakimasu',
    furigana: 'いただきます',
    indonesian: 'Selamat makan (ungkapan rasa syukur sebelum makan)',
    politeness: 'Budaya Jepang',
    breakdown: [{ word: 'いただきます', reading: 'itadakimasu', meaning: 'saya menerima rezeki ini' }],
  },
  {
    patterns: ['terima kasih atas makanannya', 'sudah selesai makan'],
    japanese: 'ごちそうさまでした',
    romaji: 'Gochisousama deshita',
    furigana: 'ごちそうさま でした',
    indonesian: 'Terima kasih atas hidangannya (setelah makan)',
    politeness: 'Budaya Jepang',
    breakdown: [{ word: 'ごちそうさま', reading: 'gochisousama', meaning: 'hidangan yang lezat' }],
  },
  {
    patterns: ['tolong bantu saya', 'bisa tolong saya', 'tolong'],
    japanese: '手伝ってください',
    romaji: 'Tetsudatte kudasai',
    furigana: 'てつだって ください',
    indonesian: 'Tolong bantu saya / Mohon bantuannya',
    politeness: 'Sopan',
    breakdown: [
      { word: '手伝って', reading: 'tetsudatte', meaning: 'membantu' },
      { word: 'ください', reading: 'kudasai', meaning: 'tolong / silakan' },
    ],
  },
  {
    patterns: ['siapa namamu', 'siapa nama anda'],
    japanese: 'お名前は何ですか',
    romaji: 'Onamae wa nan desu ka',
    furigana: 'おなまえ は なん です か',
    indonesian: 'Siapa nama Anda?',
    politeness: 'Sopan',
    breakdown: [
      { word: 'お名前', reading: 'onamae', meaning: 'nama Anda' },
      { word: '何', reading: 'nan', meaning: 'apa' },
    ],
  },
  {
    patterns: ['nama saya', 'nama saya adalah'],
    japanese: '私の名前は...',
    romaji: 'Watashi no namae wa...',
    furigana: 'わたし の なまえ は...',
    indonesian: 'Nama saya adalah...',
    politeness: 'Sopan',
    breakdown: [
      { word: '私', reading: 'watashi', meaning: 'saya' },
      { word: '名前', reading: 'namae', meaning: 'nama' },
    ],
  },
  {
    patterns: ['saya mengerti', 'paham', 'mengerti'],
    japanese: '分かりました',
    romaji: 'Wakarimashita',
    furigana: 'わかりました',
    indonesian: 'Saya mengerti / paham',
    politeness: 'Sopan',
    breakdown: [{ word: '分かりました', reading: 'wakarimashita', meaning: 'sudah mengerti' }],
  },
  {
    patterns: ['saya tidak mengerti', 'tidak paham', 'belum mengerti'],
    japanese: '分かりません',
    romaji: 'Wakarimasen',
    furigana: 'わかりません',
    indonesian: 'Saya tidak mengerti / belum paham',
    politeness: 'Sopan',
    breakdown: [{ word: '分かりません', reading: 'wakarimasen', meaning: 'tidak mengerti' }],
  },
  {
    patterns: ['saya cinta kamu', 'aku cinta kamu', 'aku sayang kamu'],
    japanese: '愛しています',
    romaji: 'Aishite imasu',
    furigana: 'あいして います',
    indonesian: 'Aku mencintaimu / Aku sayang kamu',
    politeness: 'Romantis / Mendalam',
    breakdown: [{ word: '愛しています', reading: 'aishite imasu', meaning: 'mencintai' }],
  },
  {
    patterns: ['saya suka kamu', 'aku suka kamu'],
    japanese: 'あなたがすきです',
    romaji: 'Anata ga suki desu',
    furigana: 'あなた が すき です',
    indonesian: 'Aku menyukaimu',
    politeness: 'Sopan / Akrab',
    breakdown: [
      { word: 'あなた', reading: 'anata', meaning: 'kamu' },
      { word: '好きです', reading: 'suki desu', meaning: 'suka' },
    ],
  },
];

// Tabel konversi Hiragana / Katakana ke Romaji sederhana
const KANA_TO_ROMAJI: Record<string, string> = {
  あ: 'a', い: 'i', う: 'u', え: 'e', お: 'o',
  か: 'ka', き: 'ki', く: 'ku', け: 'ke', こ: 'ko',
  さ: 'sa', し: 'shi', す: 'su', せ: 'se', そ: 'so',
  た: 'ta', ち: 'chi', つ: 'tsu', て: 'te', と: 'to',
  な: 'na', に: 'ni', ぬ: 'nu', ね: 'ne', の: 'no',
  は: 'ha', ひ: 'hi', ふ: 'fu', へ: 'he', ほ: 'ho',
  ま: 'ma', み: 'mi', む: 'mu', め: 'me', も: 'mo',
  や: 'ya', ゆ: 'yu', よ: 'yo',
  ら: 'ra', り: 'ri', る: 'ru', れ: 're', ろ: 'ro',
  わ: 'wa', を: 'wo', ん: 'n',
  が: 'ga', ぎ: 'gi', ぐ: 'gu', げ: 'ge', ご: 'go',
  ざ: 'za', じ: 'ji', ず: 'zu', ぜ: 'ze', ぞ: 'zo',
  だ: 'da', ぢ: 'ji', づ: 'zu', で: 'de', ど: 'do',
  ば: 'ba', び: 'bi', ぶ: 'bu', べ: 'be', ぼ: 'bo',
  ぱ: 'pa', ぴ: 'pi', ぷ: 'pu', ぺ: 'pe', ぽ: 'po',
  きゃ: 'kya', きゅ: 'kyu', きょ: 'kyo',
  しゃ: 'sha', しゅ: 'shu', しょ: 'sho',
  ちゃ: 'cha', ちゅ: 'chu', ちょ: 'cho',
  にゃ: 'nya', にゅ: 'nyu', にょ: 'nyo',
  ひゃ: 'hya', ひゅ: 'hyu', ひょ: 'hyo',
  みゃ: 'mya', みゅ: 'myu', みょ: 'myo',
  りゃ: 'rya', りゅ: 'ryu', りょ: 'ryo',
  ぎゃ: 'gya', ぎゅ: 'gyu', ぎょ: 'gyo',
  じゃ: 'ja', じゅ: 'ju', じょ: 'jo',
  びゃ: 'bya', びゅ: 'byu', びょ: 'byo',
  ぴゃ: 'pya', ぴゅ: 'pyu', ぴょ: 'pyo',
  ア: 'a', イ: 'i', ウ: 'u', エ: 'e', オ: 'o',
  カ: 'ka', キ: 'ki', ク: 'ku', ケ: 'ke', コ: 'ko',
  サ: 'sa', シ: 'shi', ス: 'su', セ: 'se', ソ: 'so',
  タ: 'ta', チ: 'chi', ツ: 'tsu', テ: 'te', ト: 'to',
  ナ: 'na', ニ: 'ni', ヌ: 'nu', ネ: 'ne', ノ: 'no',
  ハ: 'ha', ヒ: 'hi', フ: 'fu', ヘ: 'he', ホ: 'ho',
  マ: 'ma', ミ: 'mi', ム: 'mu', メ: 'me', モ: 'mo',
  ヤ: 'ya', ユ: 'yu', ヨ: 'yo',
  ラ: 'ra', リ: 'ri', ル: 'ru', レ: 're', ロ: 'ro',
  ワ: 'wa', ヲ: 'wo', ン: 'n',
  ガ: 'ga', ギ: 'gi', グ: 'gu', ゲ: 'ge', ゴ: 'go',
  ザ: 'za', ジ: 'ji', ズ: 'zu', ゼ: 'ze', ゾ: 'zo',
  ダ: 'da', ヂ: 'ji', ヅ: 'zu', デ: 'de', ド: 'do',
  バ: 'ba', ビ: 'bi', ブ: 'bu', ベ: 'be', ボ: 'bo',
  パ: 'pa', ピ: 'pi', プ: 'pu', ペ: 'pe', ポ: 'po',
};

export function convertKanaToRomaji(kanaText: string): string {
  let result = '';
  let i = 0;
  while (i < kanaText.length) {
    const twoChars = kanaText.slice(i, i + 2);
    if (KANA_TO_ROMAJI[twoChars]) {
      result += KANA_TO_ROMAJI[twoChars];
      i += 2;
      continue;
    }
    const oneChar = kanaText[i];
    if (oneChar === 'っ' || oneChar === 'ッ') {
      const nextOne = kanaText.slice(i + 1, i + 2);
      const nextRom = KANA_TO_ROMAJI[nextOne] || '';
      if (nextRom) {
        result += nextRom[0];
      }
      i += 1;
      continue;
    }
    if (KANA_TO_ROMAJI[oneChar]) {
      result += KANA_TO_ROMAJI[oneChar];
    } else {
      result += oneChar;
    }
    i += 1;
  }
  return result;
}

const REMOTE_SERVER_ORIGIN = 'https://ais-pre-3tf33r2hbiuxyzlcjj7wbn-272271852625.asia-southeast1.run.app';

function resolveApiUrl(apiPath: string): string {
  if (typeof window !== 'undefined') {
    const isCapacitorOrFileApk =
      window.location.protocol === 'capacitor:' ||
      window.location.protocol === 'file:' ||
      (window.location.hostname === 'localhost' && !window.location.port);
    if (isCapacitorOrFileApk) {
      return `${REMOTE_SERVER_ORIGIN}${apiPath}`;
    }
  }
  return apiPath;
}

export const translatorService = {
  /**
   * Terjemahan dwiarah (ID -> JP atau JP -> ID)
   */
  translate: async (
    text: string,
    direction: 'id-to-ja' | 'ja-to-id' = 'id-to-ja'
  ): Promise<TranslationResult> => {
    const cleanText = text.trim();
    if (!cleanText) {
      return {
        sourceText: '',
        japanese: '',
        romaji: '',
        indonesian: '',
      };
    }

    const lower = cleanText.toLowerCase();
    const isJaToId = direction === 'ja-to-id';

    // 1. Coba panggil server backend /api/translate (didukung model cerdas Gemini)
    try {
      const response = await fetch(resolveApiUrl('/api/translate'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: cleanText, direction }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data && data.success && data.japanese) {
          return {
            sourceText: cleanText,
            japanese: data.japanese,
            romaji: data.romaji || convertKanaToRomaji(data.furigana || data.japanese),
            furigana: data.furigana,
            indonesian: data.indonesian || cleanText,
            politeness: data.politeness || (isJaToId ? 'Terjemahan Akurat' : 'Standar (Sopan)'),
            breakdown: data.breakdown,
            tips: data.tips,
            isOffline: false,
          };
        }
      }
    } catch {
      // Lanjut ke pencarian kamus offline jika server sedang tidak merespons
    }

    // 2. Pencarian Kamus Luring (Offline)
    if (isJaToId) {
      // ==== JEPANG KE INDONESIA ====
      // a. Frasa & percakapan sehari-hari
      for (const item of COMMON_CONVERSATIONS) {
        const jpLower = item.japanese.toLowerCase();
        const romLower = item.romaji.toLowerCase();
        const furiLower = (item.furigana || '').toLowerCase();
        if (
          lower === jpLower ||
          lower === romLower ||
          lower.includes(jpLower) ||
          jpLower.includes(lower) ||
          lower.includes(romLower) ||
          furiLower.includes(lower)
        ) {
          return {
            sourceText: cleanText,
            japanese: item.japanese,
            romaji: item.romaji,
            furigana: item.furigana,
            indonesian: item.indonesian,
            politeness: item.politeness,
            breakdown: item.breakdown,
            isOffline: true,
          };
        }
      }

      // b. Kosakata Kamus Resmi Sensei Sari (4.845 Kosakata)
      const matchedVocab = VOCAB_MAZII_DICTIONARY.filter(v => {
        const vJp = v.japanese.toLowerCase();
        const vKana = (v.kana || '').toLowerCase();
        const vRom = (v.romaji || v.reading || '').toLowerCase();
        return (
          vJp === lower ||
          vKana === lower ||
          vRom === lower ||
          vJp.includes(lower) ||
          lower.includes(vJp) ||
          vRom.includes(lower)
        );
      });

      if (matchedVocab.length > 0) {
        const best = matchedVocab[0];
        const romajiStr = best.romaji || best.reading || convertKanaToRomaji(best.kana || best.japanese);
        return {
          sourceText: cleanText,
          japanese: best.japanese,
          romaji: romajiStr,
          furigana: best.kana || best.japanese,
          indonesian: best.indonesian,
          politeness: `Kategori: ${best.category}`,
          breakdown: matchedVocab.slice(0, 3).map(m => ({
            word: m.japanese,
            reading: m.romaji || m.reading || m.kana || '',
            meaning: m.indonesian,
          })),
          isOffline: true,
        };
      }

      // c. Kanji Resmi Sensei Sari (900 Kanji)
      const matchedKanji = KANJI_SENSEI_SARI.filter(k => {
        const kJp = k.kanji.toLowerCase();
        const kRom = (k.romaji || k.ejaan || '').toLowerCase();
        const kOn = (k.bacaanOn || '').toLowerCase();
        const kKun = (k.bacaanKun || '').toLowerCase();
        return (
          kJp === lower ||
          kRom === lower ||
          kJp.includes(lower) ||
          kOn.includes(lower) ||
          kKun.includes(lower)
        );
      });

      if (matchedKanji.length > 0) {
        const bestK = matchedKanji[0];
        const kanjiRomaji = bestK.romaji || bestK.ejaan || '';
        return {
          sourceText: cleanText,
          japanese: bestK.kanji,
          romaji: kanjiRomaji,
          furigana: `${bestK.bacaanOn || ''} / ${bestK.bacaanKun || ''}`.trim(),
          indonesian: bestK.arti,
          politeness: `Kanji JLPT ${bestK.level}`,
          breakdown: [{ word: bestK.kanji, reading: kanjiRomaji, meaning: bestK.arti }],
          isOffline: true,
        };
      }

      // d. Fallback jika teks bahasa Jepang beraksara Kana murni (konversi ejaan Romaji)
      const romajiAttempt = convertKanaToRomaji(cleanText);
      return {
        sourceText: cleanText,
        japanese: cleanText,
        romaji: romajiAttempt || cleanText,
        indonesian: `Terjemahan luring untuk "${cleanText}" belum tersedia di memori perangkat. Aktifkan internet untuk terjemahan lengkap.`,
        politeness: 'Pencarian Kamus Luring',
        tips: 'Gunakan frasa bahasa Jepang umum atau pastikan koneksi tersambung untuk terjemahan berbasis kecerdasan AI.',
        isOffline: true,
      };
    } else {
      // ==== INDONESIA KE JEPANG ====
      // a. Frasa & percakapan sehari-hari
      for (const item of COMMON_CONVERSATIONS) {
        for (const pat of item.patterns) {
          if (lower === pat || lower.includes(pat) || pat.includes(lower)) {
            return {
              sourceText: cleanText,
              japanese: item.japanese,
              romaji: item.romaji,
              furigana: item.furigana,
              indonesian: item.indonesian,
              politeness: item.politeness,
              breakdown: item.breakdown,
              isOffline: true,
            };
          }
        }
      }

      // b. Kosakata Resmi Sensei Sari (4.845 Kosakata)
      const matchedVocab = VOCAB_MAZII_DICTIONARY.filter(v => {
        const arti = v.indonesian.toLowerCase();
        return arti === lower || arti.includes(lower) || lower.includes(arti.split(/[,;/]/)[0].trim());
      });

      if (matchedVocab.length > 0) {
        const best = matchedVocab[0];
        return {
          sourceText: cleanText,
          japanese: best.japanese,
          romaji: best.romaji || best.reading || convertKanaToRomaji(best.kana || ''),
          furigana: best.kana,
          indonesian: best.indonesian,
          politeness: `Kategori: ${best.category}`,
          breakdown: matchedVocab.slice(0, 3).map(m => ({
            word: m.japanese,
            reading: m.romaji || m.reading || m.kana || '',
            meaning: m.indonesian,
          })),
          isOffline: true,
        };
      }

      // c. Kanji Resmi (900 Kanji)
      const matchedKanji = KANJI_SENSEI_SARI.filter(k => {
        const arti = (k.arti || '').toLowerCase();
        return arti === lower || arti.includes(lower);
      });

      if (matchedKanji.length > 0) {
        const bestK = matchedKanji[0];
        const kanjiRomaji = bestK.romaji || bestK.ejaan || '';
        return {
          sourceText: cleanText,
          japanese: bestK.kanji,
          romaji: kanjiRomaji,
          furigana: `${bestK.bacaanOn || ''} / ${bestK.bacaanKun || ''}`.trim(),
          indonesian: bestK.arti,
          politeness: `Kanji JLPT ${bestK.level}`,
          breakdown: [
            { word: bestK.kanji, reading: kanjiRomaji, meaning: bestK.arti },
          ],
          isOffline: true,
        };
      }

      // d. Fallback translasi kata per kata dari kamus jika kalimat terdiri dari beberapa kata
      const words = cleanText.split(/\s+/);
      if (words.length > 1) {
        const translatedParts: { jp: string; rom: string; word: string }[] = [];
        for (const w of words) {
          const wLower = w.toLowerCase();
          const found = VOCAB_MAZII_DICTIONARY.find(v => v.indonesian.toLowerCase().includes(wLower));
          if (found) {
            translatedParts.push({
              jp: found.japanese,
              rom: found.romaji || found.reading || found.kana || '',
              word: w,
            });
          }
        }

        if (translatedParts.length > 0) {
          const jpCombined = translatedParts.map(p => p.jp).join(' ');
          const romCombined = translatedParts.map(p => p.rom).join(' ');
          return {
            sourceText: cleanText,
            japanese: jpCombined,
            romaji: romCombined,
            indonesian: cleanText,
            politeness: 'Terjemahan Kata Kunci',
            breakdown: translatedParts.map(p => ({
              word: p.jp,
              reading: p.rom,
              meaning: p.word,
            })),
            isOffline: true,
          };
        }
      }

      // e. Default Fallback ramah jika kata belum ada di kamus dasar
      return {
        sourceText: cleanText,
        japanese: `「${cleanText}」`,
        romaji: cleanText,
        indonesian: cleanText,
        politeness: 'Belum ditemukan di basis data luring',
        tips: 'Coba gunakan frasa sehari-hari, kata benda, kata kerja, atau aktifkan koneksi untuk terjemahan lengkap.',
        isOffline: true,
      };
    }
  },

  /**
   * Terjemahkan teks Bahasa Indonesia ke Bahasa Jepang
   */
  translateIndoToJapanese: async (text: string): Promise<TranslationResult> => {
    return translatorService.translate(text, 'id-to-ja');
  },

  /**
   * Terjemahkan teks Bahasa Jepang ke Bahasa Indonesia
   */
  translateJapaneseToIndo: async (text: string): Promise<TranslationResult> => {
    return translatorService.translate(text, 'ja-to-id');
  },
};
