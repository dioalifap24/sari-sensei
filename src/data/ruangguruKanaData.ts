export interface KanaRow {
  group: string;
  items: { kana: string; romaji: string; note?: string }[];
}

export const RUANGGURU_HIRAGANA: KanaRow[] = [
  {
    group: 'A Baris',
    items: [
      { kana: 'あ', romaji: 'a', note: 'dibaca "a" seperti "apa"' },
      { kana: 'い', romaji: 'i', note: 'dibaca "i" seperti "isi"' },
      { kana: 'う', romaji: 'u', note: 'dibaca "u" seperti "buku"' },
      { kana: 'え', romaji: 'e', note: 'dibaca "e" seperti "emas"' },
      { kana: 'お', romaji: 'o', note: 'dibaca "o" seperti "obat"' }
    ]
  },
  {
    group: 'Ka Baris',
    items: [
      { kana: 'か', romaji: 'ka' },
      { kana: 'き', romaji: 'ki' },
      { kana: 'く', romaji: 'ku' },
      { kana: 'け', romaji: 'ke' },
      { kana: 'こ', romaji: 'ko' }
    ]
  },
  {
    group: 'Sa Baris',
    items: [
      { kana: 'さ', romaji: 'sa' },
      { kana: 'し', romaji: 'shi' },
      { kana: 'す', romaji: 'su' },
      { kana: 'せ', romaji: 'se' },
      { kana: 'そ', romaji: 'so' }
    ]
  },
  {
    group: 'Ta Baris',
    items: [
      { kana: 'た', romaji: 'ta' },
      { kana: 'ち', romaji: 'chi' },
      { kana: 'つ', romaji: 'tsu' },
      { kana: 'て', romaji: 'te' },
      { kana: 'と', romaji: 'to' }
    ]
  },
  {
    group: 'Na Baris',
    items: [
      { kana: 'な', romaji: 'na' },
      { kana: 'に', romaji: 'ni' },
      { kana: 'ぬ', romaji: 'nu' },
      { kana: 'ね', romaji: 'ne' },
      { kana: 'の', romaji: 'no' }
    ]
  },
  {
    group: 'Ha Baris',
    items: [
      { kana: 'は', romaji: 'ha' },
      { kana: 'ひ', romaji: 'hi' },
      { kana: 'ふ', romaji: 'fu' },
      { kana: 'へ', romaji: 'he' },
      { kana: 'ほ', romaji: 'ho' }
    ]
  },
  {
    group: 'Ma Baris',
    items: [
      { kana: 'ま', romaji: 'ma' },
      { kana: 'み', romaji: 'mi' },
      { kana: 'む', romaji: 'mu' },
      { kana: 'め', romaji: 'me' },
      { kana: 'も', romaji: 'mo' }
    ]
  },
  {
    group: 'Ya Baris',
    items: [
      { kana: 'や', romaji: 'ya' },
      { kana: 'ゆ', romaji: 'yu' },
      { kana: 'よ', romaji: 'yo' }
    ]
  },
  {
    group: 'Ra Baris',
    items: [
      { kana: 'ら', romaji: 'ra' },
      { kana: 'り', romaji: 'ri' },
      { kana: 'る', romaji: 'ru' },
      { kana: 'れ', romaji: 're' },
      { kana: 'ろ', romaji: 'ro' }
    ]
  },
  {
    group: 'Wa / N Baris',
    items: [
      { kana: 'わ', romaji: 'wa' },
      { kana: 'を', romaji: 'o' },
      { kana: 'ん', romaji: 'n' }
    ]
  },
  {
    group: 'Dakuon (Tanda dua garis)',
    items: [
      { kana: 'が', romaji: 'ga' }, { kana: 'ぎ', romaji: 'gi' }, { kana: 'ぐ', romaji: 'gu' }, { kana: 'げ', romaji: 'ge' }, { kana: 'ご', romaji: 'go' },
      { kana: 'ざ', romaji: 'za' }, { kana: 'じ', romaji: 'ji' }, { kana: 'ず', romaji: 'zu' }, { kana: 'ぜ', romaji: 'ze' }, { kana: 'ぞ', romaji: 'zo' },
      { kana: 'だ', romaji: 'da' }, { kana: 'ぢ', romaji: 'ji' }, { kana: 'づ', romaji: 'zu' }, { kana: 'で', romaji: 'de' }, { kana: 'ど', romaji: 'do' },
      { kana: 'ば', romaji: 'ba' }, { kana: 'び', romaji: 'bi' }, { kana: 'ぶ', romaji: 'bu' }, { kana: 'べ', romaji: 'be' }, { kana: 'ぼ', romaji: 'bo' }
    ]
  },
  {
    group: 'Handakuon (Lingkaran)',
    items: [
      { kana: 'ぱ', romaji: 'pa' }, { kana: 'ぴ', romaji: 'pi' }, { kana: 'ぷ', romaji: 'pu' }, { kana: 'ぺ', romaji: 'pe' }, { kana: 'ぽ', romaji: 'po' }
    ]
  },
  {
    group: 'Youon (Huruf kecil ya/yu/yo)',
    items: [
      { kana: 'きゃ', romaji: 'kya' }, { kana: 'きゅ', romaji: 'kyu' }, { kana: 'きょ', romaji: 'kyo' },
      { kana: 'しゃ', romaji: 'sha' }, { kana: 'しゅ', romaji: 'shu' }, { kana: 'しょ', romaji: 'sho' },
      { kana: 'ちゃ', romaji: 'cha' }, { kana: 'ちゅ', romaji: 'chu' }, { kana: 'ちょ', romaji: 'cho' },
      { kana: 'にゃ', romaji: 'nya' }, { kana: 'にゅ', romaji: 'nyu' }, { kana: 'にょ', romaji: 'nyo' },
      { kana: 'ひゃ', romaji: 'hya' }, { kana: 'ひゅ', romaji: 'hyu' }, { kana: 'ひょ', romaji: 'hyo' },
      { kana: 'みゃ', romaji: 'mya' }, { kana: 'みゅ', romaji: 'myu' }, { kana: 'みょ', romaji: 'myo' },
      { kana: 'りゃ', romaji: 'rya' }, { kana: 'りゅ', romaji: 'ryu' }, { kana: 'りょ', romaji: 'ryo' },
      { kana: 'ぎゃ', romaji: 'gya' }, { kana: 'ぎゅ', romaji: 'gyu' }, { kana: 'ぎょ', romaji: 'gyo' },
      { kana: 'じゃ', romaji: 'ja' }, { kana: 'じゅ', romaji: 'ju' }, { kana: 'じょ', romaji: 'jo' },
      { kana: 'びゃ', romaji: 'bya' }, { kana: 'びゅ', romaji: 'byu' }, { kana: 'びょ', romaji: 'byo' },
      { kana: 'ぴゃ', romaji: 'pya' }, { kana: 'ぴゅ', romaji: 'pyu' }, { kana: 'ぴょ', romaji: 'pyo' }
    ]
  }
];

export const RUANGGURU_KATAKANA: KanaRow[] = [
  {
    group: 'A Baris',
    items: [
      { kana: 'ア', romaji: 'a' },
      { kana: 'イ', romaji: 'i' },
      { kana: 'ウ', romaji: 'u' },
      { kana: 'エ', romaji: 'e' },
      { kana: 'オ', romaji: 'o' }
    ]
  },
  {
    group: 'Ka Baris',
    items: [
      { kana: 'カ', romaji: 'ka' },
      { kana: 'キ', romaji: 'ki' },
      { kana: 'ク', romaji: 'ku' },
      { kana: 'ケ', romaji: 'ke' },
      { kana: 'コ', romaji: 'ko' }
    ]
  },
  {
    group: 'Sa Baris',
    items: [
      { kana: 'サ', romaji: 'sa' },
      { kana: 'シ', romaji: 'shi' },
      { kana: 'ス', romaji: 'su' },
      { kana: 'セ', romaji: 'se' },
      { kana: 'ソ', romaji: 'so' }
    ]
  },
  {
    group: 'Ta Baris',
    items: [
      { kana: 'タ', romaji: 'ta' },
      { kana: 'チ', romaji: 'chi' },
      { kana: 'ツ', romaji: 'tsu' },
      { kana: 'テ', romaji: 'te' },
      { kana: 'ト', romaji: 'to' }
    ]
  },
  {
    group: 'Na Baris',
    items: [
      { kana: 'ナ', romaji: 'na' },
      { kana: 'ニ', romaji: 'ni' },
      { kana: 'ヌ', romaji: 'nu' },
      { kana: 'ネ', romaji: 'ne' },
      { kana: 'ノ', romaji: 'no' }
    ]
  },
  {
    group: 'Ha Baris',
    items: [
      { kana: 'ハ', romaji: 'ha' },
      { kana: 'ヒ', romaji: 'hi' },
      { kana: 'フ', romaji: 'fu' },
      { kana: 'ヘ', romaji: 'he' },
      { kana: 'ホ', romaji: 'ho' }
    ]
  },
  {
    group: 'Ma Baris',
    items: [
      { kana: 'マ', romaji: 'ma' },
      { kana: 'ミ', romaji: 'mi' },
      { kana: 'ム', romaji: 'mu' },
      { kana: 'メ', romaji: 'me' },
      { kana: 'モ', romaji: 'mo' }
    ]
  },
  {
    group: 'Ya Baris',
    items: [
      { kana: 'ヤ', romaji: 'ya' },
      { kana: 'ユ', romaji: 'yu' },
      { kana: 'ヨ', romaji: 'yo' }
    ]
  },
  {
    group: 'Ra Baris',
    items: [
      { kana: 'ラ', romaji: 'ra' },
      { kana: 'リ', romaji: 'ri' },
      { kana: 'ル', romaji: 'ru' },
      { kana: 'レ', romaji: 're' },
      { kana: 'ロ', romaji: 'ro' }
    ]
  },
  {
    group: 'Wa / N Baris',
    items: [
      { kana: 'ワ', romaji: 'wa' },
      { kana: 'ヲ', romaji: 'o' },
      { kana: 'ン', romaji: 'n' }
    ]
  },
  {
    group: 'Dakuon',
    items: [
      { kana: 'ガ', romaji: 'ga' }, { kana: 'ギ', romaji: 'gi' }, { kana: 'グ', romaji: 'gu' }, { kana: 'ゲ', romaji: 'ge' }, { kana: 'ゴ', romaji: 'go' },
      { kana: 'ザ', romaji: 'za' }, { kana: 'ジ', romaji: 'ji' }, { kana: 'ズ', romaji: 'zu' }, { kana: 'ゼ', romaji: 'ze' }, { kana: 'ゾ', romaji: 'zo' },
      { kana: 'ダ', romaji: 'da' }, { kana: 'ヂ', romaji: 'ji' }, { kana: 'ヅ', romaji: 'zu' }, { kana: 'デ', romaji: 'de' }, { kana: 'ド', romaji: 'do' },
      { kana: 'バ', romaji: 'ba' }, { kana: 'ビ', romaji: 'bi' }, { kana: 'ブ', romaji: 'bu' }, { kana: 'ベ', romaji: 'be' }, { kana: 'ボ', romaji: 'bo' }
    ]
  },
  {
    group: 'Handakuon',
    items: [
      { kana: 'パ', romaji: 'pa' }, { kana: 'ピ', romaji: 'pi' }, { kana: 'プ', romaji: 'pu' }, { kana: 'ペ', romaji: 'pe' }, { kana: 'ポ', romaji: 'po' }
    ]
  },
  {
    group: 'Youon',
    items: [
      { kana: 'キャ', romaji: 'kya' }, { kana: 'キュ', romaji: 'kyu' }, { kana: 'キョ', romaji: 'kyo' },
      { kana: 'シャ', romaji: 'sha' }, { kana: 'シュ', romaji: 'shu' }, { kana: 'ショ', romaji: 'sho' },
      { kana: 'チャ', romaji: 'cha' }, { kana: 'チュ', romaji: 'chu' }, { kana: 'チョ', romaji: 'cho' },
      { kana: 'ニャ', romaji: 'nya' }, { kana: 'ニュ', romaji: 'nyu' }, { kana: 'ニョ', romaji: 'nyo' },
      { kana: 'ヒャ', romaji: 'hya' }, { kana: 'ヒュ', romaji: 'hyu' }, { kana: 'ヒョ', romaji: 'hyo' },
      { kana: 'ミャ', romaji: 'mya' }, { kana: 'ミュ', romaji: 'myu' }, { kana: 'ミョ', romaji: 'myo' },
      { kana: 'リャ', romaji: 'rya' }, { kana: 'リュ', romaji: 'ryu' }, { kana: 'リョ', romaji: 'ryo' },
      { kana: 'ギャ', romaji: 'gya' }, { kana: 'ギュ', romaji: 'gyu' }, { kana: 'ギョ', romaji: 'gyo' },
      { kana: 'ジャ', romaji: 'ja' }, { kana: 'ジュ', romaji: 'ju' }, { kana: 'ジョ', romaji: 'jo' },
      { kana: 'ビャ', romaji: 'bya' }, { kana: 'ビュ', romaji: 'byu' }, { kana: 'ビョ', romaji: 'byo' },
      { kana: 'ピャ', romaji: 'pya' }, { kana: 'ピュ', romaji: 'pyu' }, { kana: 'ピョ', romaji: 'pyo' }
    ]
  }
];
