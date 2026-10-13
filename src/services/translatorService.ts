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
  engine?: 'gemini' | 'google-translate' | 'offline';
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
  {
    patterns: ['itadakimashu', 'itadakimasu', 'selamat makan'],
    japanese: 'いただきます',
    romaji: 'Itadakimasu',
    furigana: 'いただきます',
    indonesian: 'Selamat makan / Terima kasih atas makanannya (Ungkapan rasa syukur)',
    politeness: 'Ungkapan Tradisional Sehari-hari',
    breakdown: [{ word: 'いただきます', reading: 'itadakimasu', meaning: 'saya menerima makanan ini' }],
  },
  {
    patterns: ['kawaii', 'kawai', 'imut', 'lucu', 'gemesin', 'menggemaskan'],
    japanese: 'かわいい',
    romaji: 'Kawaii',
    furigana: 'かわいい',
    indonesian: 'Imut / Lucu / Menggemaskan (Kata gaul & sehari-hari populer)',
    politeness: 'Kasual / Imut / Gaul',
    breakdown: [{ word: '可愛い', reading: 'kawaii', meaning: 'imut / lucu' }],
  },
  {
    patterns: ['sugoi', 'sugee', 'keren', 'hebat', 'luar biasa'],
    japanese: 'すごい',
    romaji: 'Sugoi',
    furigana: 'すごい',
    indonesian: 'Hebat! / Keren banget! / Luar biasa!',
    politeness: 'Kasual / Antusias / Gaul',
    breakdown: [{ word: '凄い', reading: 'sugoi', meaning: 'hebat / luar biasa' }],
  },
  {
    patterns: ['yabai', 'gawat', 'parah', 'gila', 'keren banget parah'],
    japanese: 'やばい',
    romaji: 'Yabai',
    furigana: 'やばい',
    indonesian: 'Gawat! / Wah parah! / Keren banget! (Bergantung konteks situasi)',
    politeness: 'Bahasa Gaul Sehari-hari (Slang)',
    breakdown: [{ word: 'ヤバイ', reading: 'yabai', meaning: 'gawat / luar biasa' }],
  },
  {
    patterns: ['baka', 'bodoh', 'konyol'],
    japanese: 'ばか',
    romaji: 'Baka',
    furigana: 'ばか',
    indonesian: 'Bodoh / Konyol (Sering dipakai bercanda atau kesal gemesin)',
    politeness: 'Kasual / Akrab',
    breakdown: [{ word: '馬鹿', reading: 'baka', meaning: 'bodoh' }],
  },
  {
    patterns: ['chotto', 'sebentar', 'tunggu', 'tunggu sebentar'],
    japanese: 'ちょっと',
    romaji: 'Chotto',
    furigana: 'ちょっと',
    indonesian: 'Sebentar / Tunggu dulu / Agak...',
    politeness: 'Kasual / Sehari-hari',
    breakdown: [{ word: 'ちょっと', reading: 'chotto', meaning: 'sebentar' }],
  },
  {
    patterns: ['hontou', 'honto', 'beneran', 'sungguh', 'serius'],
    japanese: '本当',
    romaji: 'Hontou',
    furigana: 'ほんとう',
    indonesian: 'Beneran? / Sungguhkah? / Betul?',
    politeness: 'Kasual / Sehari-hari',
    breakdown: [{ word: '本当', reading: 'hontou', meaning: 'sungguh / benar' }],
  },
  {
    patterns: ['maji', 'majide', 'seriusan', 'beneran banget'],
    japanese: 'マジで',
    romaji: 'Majide',
    furigana: 'まじで',
    indonesian: 'Seriusan? / Beneran? (Bahasa gaul anak muda)',
    politeness: 'Slang / Gaul Sehari-hari',
    breakdown: [{ word: 'マジ', reading: 'maji', meaning: 'serius / sungguh' }],
  },
  {
    patterns: ['yatta', 'hore', 'berhasil', 'yey'],
    japanese: 'やった',
    romaji: 'Yatta',
    furigana: 'やった',
    indonesian: 'Hore! / Berhasil! / Asyik!',
    politeness: 'Ungkapan Kegembiraan',
    breakdown: [{ word: 'やった', reading: 'yatta', meaning: 'berhasil / hore' }],
  },
  {
    patterns: ['yoshi', 'ayo', 'baiklah', 'siap'],
    japanese: 'よし',
    romaji: 'Yoshi',
    furigana: 'よし',
    indonesian: 'Baiklah! / Ayo! / Siap! (Menyemangati diri sendiri)',
    politeness: 'Kasual / Penyemangat',
    breakdown: [{ word: 'よし', reading: 'yoshi', meaning: 'baiklah / ayo' }],
  },
  {
    patterns: ['gomen', 'gomennasai', 'maaf', 'maafin'],
    japanese: 'ごめんなさい',
    romaji: 'Gomennasai',
    furigana: 'ごめんなさい',
    indonesian: 'Maaf ya / Mohon maaf',
    politeness: 'Kasual / Akrab',
    breakdown: [{ word: 'ごめん', reading: 'gomen', meaning: 'maaf' }],
  },
  {
    patterns: ['arigato', 'arigatou', 'makasih', 'terima kasih'],
    japanese: 'ありがとう',
    romaji: 'Arigatou',
    furigana: 'ありがとう',
    indonesian: 'Makasih / Terima kasih (Kasual)',
    politeness: 'Kasual / Akrab',
    breakdown: [{ word: 'ありがとう', reading: 'arigatou', meaning: 'terima kasih' }],
  },
  {
    patterns: ['oishii', 'oishi', 'enak', 'lezat'],
    japanese: '美味しい',
    romaji: 'Oishii',
    furigana: 'おいしい',
    indonesian: 'Enak banget / Lezat',
    politeness: 'Sehari-hari / Antusias',
    breakdown: [{ word: '美味しい', reading: 'oishii', meaning: 'enak / lezat' }],
  },
  {
    patterns: ['suki', 'suka'],
    japanese: '好き',
    romaji: 'Suki',
    furigana: 'すき',
    indonesian: 'Suka',
    politeness: 'Kasual',
    breakdown: [{ word: '好き', reading: 'suki', meaning: 'suka' }],
  },
  {
    patterns: ['daisuki', 'suka banget', 'cinta banget'],
    japanese: '大好き',
    romaji: 'Daisuki',
    furigana: 'だいすき',
    indonesian: 'Suka banget / Cinta banget!',
    politeness: 'Antusias / Kasual',
    breakdown: [{ word: '大好き', reading: 'daisuki', meaning: 'sangat suka' }],
  },
  {
    patterns: ['muri', 'tidak sanggup', 'gak sanggup', 'mustahil'],
    japanese: '無理',
    romaji: 'Muri',
    furigana: 'むり',
    indonesian: 'Gak sanggup / Mustahil / Tidak mungkin',
    politeness: 'Kasual / Slang',
    breakdown: [{ word: '無理', reading: 'muri', meaning: 'mustahil / tidak sanggup' }],
  },
  {
    patterns: ['kusa', 'ngakak', 'wkwk', 'lucu bgt'],
    japanese: '草',
    romaji: 'Kusa',
    furigana: 'くさ',
    indonesian: 'Ngakak / Wkwk / Tertawa (Slang netizen Jepang)',
    politeness: 'Slang Internet',
    breakdown: [{ word: '草', reading: 'kusa', meaning: 'tertawa / rumput' }],
  },
  {
    patterns: ['oshi', 'idola', 'bias', 'favorit'],
    japanese: '推し',
    romaji: 'Oshi',
    furigana: 'おし',
    indonesian: 'Idola / Karakter favorit / Bias (Slang anime & pop kultur)',
    politeness: 'Slang Pop Kultur',
    breakdown: [{ word: '推し', reading: 'oshi', meaning: 'idola / yang didukung' }],
  },
  {
    patterns: ['doki doki', 'dokidoki', 'deg degan', 'berdebar'],
    japanese: 'ドキドキ',
    romaji: 'Doki doki',
    furigana: 'どきどき',
    indonesian: 'Berdebar-debar / Deg-degan (Onomatope manga/anime)',
    politeness: 'Onomatope Manga',
    breakdown: [{ word: 'ドキドキ', reading: 'doki doki', meaning: 'berdebar-debar' }],
  },
  {
    patterns: ['waku waku', 'wakuwaku', 'antusias', 'bersemangat'],
    japanese: 'ワクワク',
    romaji: 'Waku waku',
    furigana: 'わくわく',
    indonesian: 'Sangat antusias / Bersemangat / Tak sabar (Onomatope manga/anime)',
    politeness: 'Onomatope Manga',
    breakdown: [{ word: 'ワクワク', reading: 'waku waku', meaning: 'bersemangat / antusias' }],
  },
  {
    patterns: ['yareyare', 'yare yare', 'aduh', 'hadeeh', 'ampun'],
    japanese: 'やれやれ',
    romaji: 'Yare yare',
    furigana: 'やれやれ',
    indonesian: 'Aduh ampun / Hadeeh / Wah ampun deh (Keluh kesah kasual)',
    politeness: 'Slang Ekspresi Kasual',
    breakdown: [{ word: 'やれやれ', reading: 'yare yare', meaning: 'aduh / ampun' }],
  },
  {
    patterns: ['zettai', 'pasti', 'wajib', 'mutlak'],
    japanese: '絶対',
    romaji: 'Zettai',
    furigana: 'ぜったい',
    indonesian: 'Pasti! / Wajib! / Mutlak / Absolut!',
    politeness: 'Penegas Tegas',
    breakdown: [{ word: '絶対', reading: 'zettai', meaning: 'pasti / absolut' }],
  },
  {
    patterns: ['sugee', 'suggee', 'keren banget', 'hebat parah'],
    japanese: 'すげえ',
    romaji: 'Sugee',
    furigana: 'すげえ',
    indonesian: 'Keren banget! / Hebat parah! (Bahasa gaul cowok Jepang)',
    politeness: 'Slang Gaul Kasual',
    breakdown: [{ word: '凄い', reading: 'sugee', meaning: 'keren banget' }],
  },
  {
    patterns: ['yabee', 'yabeeee', 'gawat parah', 'keren gila'],
    japanese: 'やべえ',
    romaji: 'Yabee',
    furigana: 'やべえ',
    indonesian: 'Gawat parah! / Keren gila! / Wah gila sih!',
    politeness: 'Slang Gaul Ekstrem',
    breakdown: [{ word: 'やべえ', reading: 'yabee', meaning: 'gawat / luar biasa' }],
  },
  {
    patterns: ['chou', 'choo', 'super', 'sangat', 'banget'],
    japanese: '超',
    romaji: 'Chou',
    furigana: 'ちょう',
    indonesian: 'Super / Banget / Amat sangat (Contoh: chou kawaii = super imut)',
    politeness: 'Slang Awalan Populer',
    breakdown: [{ word: '超', reading: 'chou', meaning: 'super / sangat' }],
  },
  {
    patterns: ['tsundere', 'sok jual mahal'],
    japanese: 'ツンデレ',
    romaji: 'Tsundere',
    furigana: 'つんでれ',
    indonesian: 'Tsundere (Sok ketus/jual mahal padahal aslinya peduli & sayang)',
    politeness: 'Istilah Anime / Manga',
    breakdown: [{ word: 'ツンデレ', reading: 'tsundere', meaning: 'tsundere' }],
  },
  {
    patterns: ['yandere', 'terobsesi'],
    japanese: 'ヤンデレ',
    romaji: 'Yandere',
    furigana: 'やんでれ',
    indonesian: 'Yandere (Sangat cinta dan terobsesi hingga ekstrem)',
    politeness: 'Istilah Anime / Manga',
    breakdown: [{ word: 'ヤンデレ', reading: 'yandere', meaning: 'yandere' }],
  },
  {
    patterns: ['moshimoshi', 'halo telpon'],
    japanese: 'もしもし',
    romaji: 'Moshimoshi',
    furigana: 'もしもし',
    indonesian: 'Halo? (Saat mengangkat telepon)',
    politeness: 'Percakapan Telepon',
    breakdown: [{ word: 'もしもし', reading: 'moshimoshi', meaning: 'halo' }],
  },
  {
    patterns: ['tadaima', 'aku pulang'],
    japanese: 'ただいま',
    romaji: 'Tadaima',
    furigana: 'ただいま',
    indonesian: 'Aku pulang!',
    politeness: 'Ungkapan Rumah Sehari-hari',
    breakdown: [{ word: 'ただいま', reading: 'tadaima', meaning: 'aku pulang' }],
  },
  {
    patterns: ['okaeri', 'selamat datang kembali'],
    japanese: 'おかえり',
    romaji: 'Okaeri',
    furigana: 'おかえり',
    indonesian: 'Selamat datang kembali!',
    politeness: 'Ungkapan Rumah Sehari-hari',
    breakdown: [{ word: 'おかえり', reading: 'okaeri', meaning: 'selamat datang kembali' }],
  },
  {
    patterns: ['ittekimasu', 'aku berangkat'],
    japanese: '行ってきます',
    romaji: 'Ittekimasu',
    furigana: 'いってきます',
    indonesian: 'Aku berangkat ya!',
    politeness: 'Ungkapan Keberangkatan',
    breakdown: [{ word: '行ってきます', reading: 'ittekimasu', meaning: 'aku berangkat' }],
  },
  {
    patterns: ['itterasshai', 'hati-hati'],
    japanese: '行ってらっしゃい',
    romaji: 'Itterasshai',
    furigana: 'いってらっしゃい',
    indonesian: 'Hati-hati di jalan ya!',
    politeness: 'Ungkapan Pelepasan',
    breakdown: [{ word: '行ってらっしゃい', reading: 'itterasshai', meaning: 'hati-hati' }],
  },
  {
    patterns: ['otsukaresama', 'kerja bagus', 'terima kasih kerja kerasnya'],
    japanese: 'お疲れ様',
    romaji: 'Otsukaresama',
    furigana: 'おつかれさま',
    indonesian: 'Terima kasih atas kerja kerasnya / Kerja bagus!',
    politeness: 'Ungkapan Sopan Kerja/Belajar',
    breakdown: [{ word: 'お疲れ様', reading: 'otsukaresama', meaning: 'kerja bagus' }],
  },
];

import * as wanakana from 'wanakana';

function containsKanji(text: string): boolean {
  return /[\u4e00-\u9faf\u3400-\u4dbf]/.test(text);
}

// Basis data pencocokan kanji berfrekuensi tinggi & konjugasi kata kerja baku
const HIGH_FREQ_KANJI_MAP: { kanji: string; kana: string }[] = [
  // Salam & ungkapan sehari-hari
  { kanji: '有難うございます', kana: 'ありがとう ございます' },
  { kanji: '有難う', kana: 'ありがとう' },
  { kanji: '御馳走様でした', kana: 'ごちそうさま でした' },
  { kanji: '御馳走様', kana: 'ごちそうさま' },
  { kanji: 'お早うございます', kana: 'おはよう ございます' },
  { kanji: 'お早う', kana: 'おはよう' },
  { kanji: 'お元気ですか', kana: 'おげんき ですか' },
  { kanji: 'お元気', kana: 'おげんき' },
  { kanji: '元気', kana: 'げんき' },
  { kanji: '初めまして', kana: 'はじめまして' },
  { kanji: '始めまして', kana: 'はじめまして' },

  // Subjek & orang
  { kanji: '私', kana: 'わたし' },
  { kanji: '僕', kana: 'ぼく' },
  { kanji: '俺', kana: 'おれ' },
  { kanji: '貴方', kana: 'あなた' },
  { kanji: '先生', kana: 'せんせい' },
  { kanji: '学生', kana: 'がくせい' },
  { kanji: '友達', kana: 'ともだち' },
  { kanji: '家族', kana: 'かぞく' },

  // Negara & Bahasa
  { kanji: '日本', kana: 'にほん' },
  { kanji: '日本語', kana: 'にほんご' },
  { kanji: '日本人', kana: 'にほんじん' },
  { kanji: '英語', kana: 'えいご' },

  // Tempat & Lingkungan
  { kanji: '学校', kana: 'がっこう' },
  { kanji: '大学', kana: 'だいがく' },
  { kanji: '病院', kana: 'びょういん' },
  { kanji: '会社', kana: 'かいしゃ' },
  { kanji: '駅', kana: 'えき' },
  { kanji: '部屋', kana: 'へや' },
  { kanji: '家', kana: 'いえ' },
  { kanji: '店', kana: 'みせ' },

  // Makanan & Benda
  { kanji: '朝ご飯', kana: 'あさごはん' },
  { kanji: '昼ご飯', kana: 'ひるごはん' },
  { kanji: '晩ご飯', kana: 'ばんごはん' },
  { kanji: 'ご飯', kana: 'ごはん' },
  { kanji: 'お水', kana: 'おみず' },
  { kanji: '水', kana: 'みず' },
  { kanji: 'お茶', kana: 'おちゃ' },
  { kanji: '魚', kana: 'さかな' },
  { kanji: '肉', kana: 'にく' },
  { kanji: '野菜', kana: 'やさい' },
  { kanji: '料理', kana: 'ryouri' },
  { kanji: '本', kana: 'ほん' },
  { kanji: '車', kana: 'くるま' },
  { kanji: '電車', kana: 'でんしゃ' },
  { kanji: 'お名前', kana: 'おなまえ' },
  { kanji: '名前', kana: 'なまえ' },
  { kanji: 'お金', kana: 'おかね' },

  // Waktu
  { kanji: '今日', kana: 'きょう' },
  { kanji: '明日', kana: 'あした' },
  { kanji: '昨日', kana: 'きのう' },
  { kanji: '毎日', kana: 'まいにち' },
  { kanji: '今', kana: 'いま' },

  // Kata Sifat
  { kanji: '美味しいです', kana: 'おいしい です' },
  { kanji: '美味しい', kana: 'おいしい' },
  { kanji: '大きいです', kana: 'おおきい です' },
  { kanji: '大きい', kana: 'おおきい' },
  { kanji: '小さい', kana: 'ちいさい' },
  { kanji: '好きです', kana: 'すき です' },
  { kanji: '好き', kana: 'すき' },
  { kanji: '大好き', kana: 'だいすき' },

  // Kata Kerja & Konjugasi
  { kanji: '食べたいです', kana: 'たべたい です' },
  { kanji: '食べたい', kana: 'たべたい' },
  { kanji: '食べます', kana: 'たべます' },
  { kanji: '食べました', kana: 'たべました' },
  { kanji: '食べています', kana: 'たべて います' },
  { kanji: '食べて', kana: 'たべて' },
  { kanji: '食べた', kana: 'たべた' },
  { kanji: '食べる', kana: 'たべる' },

  { kanji: '飲みたいです', kana: 'のみたい です' },
  { kanji: '飲みたい', kana: 'のみたい' },
  { kanji: '飲みます', kana: 'のみます' },
  { kanji: '飲みました', kana: 'のみました' },
  { kanji: '飲んで', kana: 'のんで' },
  { kanji: '飲んだ', kana: 'のんだ' },
  { kanji: '飲む', kana: 'のむ' },

  { kanji: '行きたいです', kana: 'いきたい です' },
  { kanji: '行きたい', kana: 'いきたい' },
  { kanji: '行きます', kana: 'いきます' },
  { kanji: '行きました', kana: 'いきました' },
  { kanji: '行って', kana: 'いって' },
  { kanji: '行った', kana: 'いった' },
  { kanji: '行く', kana: 'いく' },

  { kanji: '来ます', kana: 'きます' },
  { kanji: '来ました', kana: 'きました' },
  { kanji: '来て', kana: 'きて' },
  { kanji: '来る', kana: 'くる' },

  { kanji: '勉強しています', kana: 'べんきょう して います' },
  { kanji: '勉強します', kana: 'べんきょう します' },
  { kanji: '勉強しました', kana: 'べんきょう しました' },
  { kanji: '勉強して', kana: 'べんきょう して' },
  { kanji: '勉強する', kana: 'べんきょう する' },
  { kanji: '勉強', kana: 'べんきょう' },

  { kanji: '見たい', kana: 'みたい' },
  { kanji: '見ます', kana: 'みます' },
  { kanji: '見て', kana: 'みて' },
  { kanji: '見た', kana: 'みた' },
  { kanji: '見る', kana: 'みる' },

  { kanji: '買いたい', kana: 'かいたい' },
  { kanji: '買います', kana: 'かいます' },
  { kanji: '買う', kana: 'かう' },

  { kanji: '分かりました', kana: 'わかりました' },
  { kanji: '分かりません', kana: 'わかりません' },
  { kanji: '分かる', kana: 'わかる' },

  { kanji: '手伝ってください', kana: 'てつだって ください' },
  { kanji: '手伝って', kana: 'てつだって' },
  { kanji: '手伝います', kana: 'てつだいます' },

  { kanji: '頑張ってください', kana: 'がんばって ください' },
  { kanji: '頑張って', kana: 'がんばって' },
  { kanji: '頑張ります', kana: 'がんばります' },
  { kanji: '頑張る', kana: 'がんばる' },

  { kanji: '愛しています', kana: 'あいして います' },
  { kanji: '住んでいます', kana: 'すんで います' },
  { kanji: '知っています', kana: 'しって います' },
  { kanji: '知りません', kana: 'しりません' },
];

// Masukkan ribuan kosakata resmi yang BENAR-BENAR mengandung Kanji
for (const v of VOCAB_MAZII_DICTIONARY) {
  if (v.japanese && v.kana && containsKanji(v.japanese)) {
    let cleanKana = v.kana.replace(/\(.*?\)/g, '').split('/')[0].trim();
    if (cleanKana.includes('·')) cleanKana = cleanKana.split('·')[1] || cleanKana.split('·')[0];
    if (cleanKana && cleanKana.length > 0) {
      HIGH_FREQ_KANJI_MAP.push({ kanji: v.japanese, kana: cleanKana });
    }
  }
}

// Masukkan 900 kanji tunggal Sensei Sari dengan bacaan bersih
for (const k of KANJI_SENSEI_SARI) {
  if (k.kanji && containsKanji(k.kanji)) {
    let kun = (k.bacaanKun || '').replace(/\(.*?\)/g, '').replace(/[\-.]/g, '').split(/[,/ ]/)[0].trim();
    let on = (k.bacaanOn || '').replace(/\(.*?\)/g, '').replace(/[\-.]/g, '').split(/[,/ ]/)[0].trim();
    const kana = kun || on;
    if (kana) {
      HIGH_FREQ_KANJI_MAP.push({ kanji: k.kanji, kana });
    }
  }
}

// Urutkan dari kanji terpanjang ke terpendek agar frasa majemuk dicocokkan terlebih dahulu
HIGH_FREQ_KANJI_MAP.sort((a, b) => b.kanji.length - a.kanji.length);

/**
 * Konversi teks bahasa Jepang (Kanji & Kana) menjadi Furigana (Kana) dan Romaji (Ejaan Latin) yang bersih dan persis pelafalannya
 */
export function generateFuriganaAndRomaji(jpText: string): {
  furigana: string;
  romaji: string;
} {
  if (!jpText || !jpText.trim()) {
    return { furigana: '', romaji: '' };
  }

  let furigana = jpText.trim();
  for (const item of HIGH_FREQ_KANJI_MAP) {
    if (furigana.includes(item.kanji)) {
      furigana = furigana.split(item.kanji).join(' ' + item.kana + ' ');
    }
  }

  // Pisahkan partikel dengan rapi sesuai kaidah baca
  furigana = furigana.replace(/([ァ-ヴーa-zA-Z0-9])([をはがにへでとも])(?=[^\s]|$)/g, '$1 $2 ');
  furigana = furigana.replace(/\s+/g, ' ').trim();

  // Konversi aksara Kana ke Romaji secara langsung dan konsisten
  const rawRomaji = wanakana.toRomaji(furigana);
  let cleaned = rawRomaji
    .replace(/\bkonnichiha\b/gi, 'konnichiwa')
    .replace(/\bkonbanha\b/gi, 'konbanwa');

  const words = cleaned.split(/\s+/).map((w, idx) => {
    if (w === 'ha') return 'wa';
    if (w === 'wo') return 'o';
    if (w === 'he' && idx > 0) return 'e';
    return w;
  });

  let romaji = words.join(' ').trim();
  if (romaji.length > 0) {
    romaji = romaji.charAt(0).toUpperCase() + romaji.slice(1);
  }

  return { furigana, romaji };
}

/**
 * Konversi langsung aksara Kana ke Romaji yang baku
 */
export function convertKanaToRomaji(kanaText: string): string {
  if (!kanaText) return '';
  return generateFuriganaAndRomaji(kanaText).romaji;
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

const clientTranslationCache = new Map<string, TranslationResult>();

export function extractRomajiAndBreakdown(jpText: string): {
  romaji: string;
  furigana: string;
  breakdown: { word: string; reading: string; meaning: string }[];
} {
  const { furigana, romaji } = generateFuriganaAndRomaji(jpText);
  const breakdown: { word: string; reading: string; meaning: string }[] = [];

  // Cari kecocokan kata dari kamus resmi Mazii Sensei Sari
  for (const v of VOCAB_MAZII_DICTIONARY) {
    if (v.japanese && v.japanese.length > 1 && jpText.includes(v.japanese)) {
      if (!breakdown.some(b => b.word === v.japanese)) {
        breakdown.push({
          word: v.japanese,
          reading: v.romaji || v.reading || v.kana || '',
          meaning: v.indonesian,
        });
      }
    }
    if (breakdown.length >= 4) break;
  }

  // Tambahkan komponen Kanji jika masih kurang
  if (breakdown.length < 3) {
    for (const k of KANJI_SENSEI_SARI) {
      if (jpText.includes(k.kanji)) {
        if (!breakdown.some(b => b.word === k.kanji)) {
          breakdown.push({
            word: k.kanji,
            reading: k.romaji || k.ejaan || `${k.bacaanOn} / ${k.bacaanKun}`,
            meaning: k.arti,
          });
        }
      }
      if (breakdown.length >= 4) break;
    }
  }

  return { romaji, furigana, breakdown };
}

export const translatorService = {
  /**
   * Terjemahan dwiarah (ID -> JP atau JP -> ID) dengan dukungan Google Terjemahan otomatis
   * Terjemahan dwiarah (ID -> JP atau JP -> ID) langsung tersambung ke Google Terjemahan
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
    const cacheKey = `${direction}:${lower}`;

    // 1. Cek cache lokal client terlebih dahulu (instan 0ms)
    if (clientTranslationCache.has(cacheKey)) {
      return clientTranslationCache.get(cacheKey)!;
    }

    // 2. Pencocokan Cepat Frasa & Percakapan Sehari-hari (instan tanpa membebani kuota API)
    if (isJaToId) {
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
            const res: TranslationResult = {
              sourceText: cleanText,
              japanese: item.japanese,
              romaji: item.romaji,
              furigana: item.furigana,
              indonesian: item.indonesian,
              politeness: item.politeness,
              breakdown: item.breakdown,
              engine: 'offline',
              isOffline: true,
            };
            clientTranslationCache.set(cacheKey, res);
            return res;
          }
        }
      } else {
        for (const item of COMMON_CONVERSATIONS) {
          for (const pat of item.patterns) {
            if (lower === pat || lower.includes(pat) || pat.includes(lower)) {
              const res: TranslationResult = {
                sourceText: cleanText,
                japanese: item.japanese,
                romaji: item.romaji,
                furigana: item.furigana,
                indonesian: item.indonesian,
                politeness: item.politeness,
                breakdown: item.breakdown,
                engine: 'offline',
                isOffline: true,
              };
              clientTranslationCache.set(cacheKey, res);
              return res;
            }
          }
        }
      }

    // 3. Panggil server backend /api/translate (didukung Gemini & Mesin Google Terjemahan)
    try {
      const response = await fetch(resolveApiUrl('/api/translate'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: cleanText, direction }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data && data.success && (data.japanese || data.indonesian)) {
          const isGoogle = data.engine === 'google-translate';
          const jpText = data.japanese || cleanText;
          const { romaji: derivedRomaji, breakdown: derivedBreakdown } =
            isGoogle ? extractRomajiAndBreakdown(jpText) : { romaji: '', breakdown: [] };

          const res: TranslationResult = {
            sourceText: cleanText,
            japanese: jpText,
            romaji: data.romaji || derivedRomaji || convertKanaToRomaji(data.furigana || jpText),
            furigana: data.furigana,
            indonesian: data.indonesian || cleanText,
            politeness:
              data.politeness ||
              (isGoogle ? 'Google Terjemahan (Otomatis & Bebas Kuota)' : isJaToId ? 'Terjemahan Akurat' : 'Standar (Sopan)'),
            breakdown: data.breakdown && data.breakdown.length > 0 ? data.breakdown : derivedBreakdown,
            tips: data.tips,
            engine: isGoogle ? 'google-translate' : 'gemini',
            isOffline: false,
          };
          clientTranslationCache.set(cacheKey, res);
          return res;
        }
      }
    } catch {
      // Jika server offline / gagal dihubungi, coba langsung sambungan Google Terjemahan dari sisi browser pengguna
    }

    // 4. Cadangan Langsung Google Terjemahan (Client-Side Direct Fetch)
    try {
      const sl = isJaToId ? 'ja' : 'id';
      const tl = isJaToId ? 'id' : 'ja';
      const googleUrl = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(cleanText)}&langpair=${sl}|${tl}`;
      const gResp = await fetch(googleUrl);
      if (gResp.ok) {
        const gData = await gResp.json();
        const rawTranslated = gData?.responseData?.translatedText?.trim();
        if (rawTranslated && !rawTranslated.startsWith('MYMEMORY WARNING:')) {
          const cleanedResult = rawTranslated.replace(/^[-–—]\s*/, '').trim();
          const finalJp = isJaToId ? cleanText : cleanedResult;
          const finalId = isJaToId ? cleanedResult : cleanText;
          const { romaji: directRomaji, breakdown: directBreakdown } = extractRomajiAndBreakdown(finalJp);

          const res: TranslationResult = {
            sourceText: cleanText,
            japanese: finalJp,
            romaji: directRomaji || convertKanaToRomaji(finalJp),
            indonesian: finalId,
            politeness: 'Google Terjemahan (Langsung Klien)',
            tips: 'Tersambung langsung ke jaringan mesin Google Terjemahan tanpa membebani API Gemini.',
            breakdown: directBreakdown,
            engine: 'google-translate',
            isOffline: false,
          };
          clientTranslationCache.set(cacheKey, res);
          return res;
        }
      }
    } catch {
      // Lanjut ke kamus luring lokal
    }

    // 5. Pencarian Kamus Luring (Offline) Lanjutan jika server & internet offline
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
