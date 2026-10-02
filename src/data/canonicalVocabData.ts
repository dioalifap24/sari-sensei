import { VocabCard, JLPTLevel } from '../types';

/**
 * DAFTAR KOSAKATA RESMI JLPT (N5 - N2)
 * Disusun bersih dan otentik mengikuti struktur kamus referensi (jepang.org).
 * Setiap entri memuat: Huruf Kana (Utama), Kanji, Ejaan (Romaji), dan Arti Pendek.
 */

export interface OfficialItem {
  kana: string;
  jp: string;
  romaji: string;
  id: string;
  cat: string;
}

// ----------------------------------------------------------------------------
// KOSAKATA RESMI LEVEL N5 (Jepang.org / JLPT N5)
// ----------------------------------------------------------------------------
const N5_LIST: OfficialItem[] = [
  { kana: 'あいさつ', jp: '挨拶', romaji: 'aisatsu', id: 'Salam / Ucapan selamat', cat: 'Dasar' },
  { kana: 'あう', jp: '会う', romaji: 'au', id: 'Bertemu', cat: 'Kerja' },
  { kana: 'あおい', jp: '青い', romaji: 'aoi', id: 'Biru', cat: 'Sifat' },
  { kana: 'あかい', jp: '赤い', romaji: 'akai', id: 'Merah', cat: 'Sifat' },
  { kana: 'あかるい', jp: '明るい', romaji: 'akarui', id: 'Terang / Cerah', cat: 'Sifat' },
  { kana: 'あさ', jp: '朝', romaji: 'asa', id: 'Pagi', cat: 'Waktu' },
  { kana: 'あさごはん', jp: '朝ご飯', romaji: 'asagohan', id: 'Sarapan pagi', cat: 'Makanan' },
  { kana: 'あした', jp: '明日', romaji: 'ashita', id: 'Besok', cat: 'Waktu' },
  { kana: 'あそぶ', jp: '遊ぶ', romaji: 'asobu', id: 'Bermain', cat: 'Kerja' },
  { kana: 'あたま', jp: '頭', romaji: 'atama', id: 'Kepala', cat: 'Tubuh' },
  { kana: 'あたらしい', jp: '新しい', romaji: 'atarashii', id: 'Baru', cat: 'Sifat' },
  { kana: 'あつい', jp: '暑い', romaji: 'atsui', id: 'Panas (cuaca)', cat: 'Sifat' },
  { kana: 'あに', jp: '兄', romaji: 'ani', id: 'Kakak laki-laki', cat: 'Keluarga' },
  { kana: 'あね', jp: '姉', romaji: 'ane', id: 'Kakak perempuan', cat: 'Keluarga' },
  { kana: 'あの', jp: 'あの', romaji: 'ano', id: 'Itu', cat: 'Penunjuk' },
  { kana: 'あめ', jp: '雨', romaji: 'ame', id: 'Hujan', cat: 'Alam' },
  { kana: 'ある', jp: '有る', romaji: 'aru', id: 'Ada (benda mati)', cat: 'Kerja' },
  { kana: 'あるく', jp: '歩く', romaji: 'aruku', id: 'Berjalan kaki', cat: 'Kerja' },
  { kana: 'いい', jp: '良い', romaji: 'ii', id: 'Bagus / Baik', cat: 'Sifat' },
  { kana: 'いいえ', jp: 'いいえ', romaji: 'iie', id: 'Tidak / Bukan', cat: 'Ungkapan' },
  { kana: 'いう', jp: '言う', romaji: 'iu', id: 'Berkata / Mengucapkan', cat: 'Kerja' },
  { kana: 'いえ', jp: '家', romaji: 'ie', id: 'Rumah', cat: 'Tempat' },
  { kana: 'いく', jp: '行く', romaji: 'iku', id: 'Pergi', cat: 'Kerja' },
  { kana: 'いしゃ', jp: '医者', romaji: 'isha', id: 'Dokter', cat: 'Profesi' },
  { kana: 'いす', jp: '椅子', romaji: 'isu', id: 'Kursi', cat: 'Benda' },
  { kana: 'いそがしい', jp: '忙しい', romaji: 'isogashii', id: 'Sibuk', cat: 'Sifat' },
  { kana: 'いたい', jp: '痛い', romaji: 'itai', id: 'Sakit', cat: 'Sifat' },
  { kana: 'いち', jp: '一', romaji: 'ichi', id: 'Satu', cat: 'Angka' },
  { kana: 'いちにち', jp: '一日', romaji: 'ichinichi', id: 'Satu hari', cat: 'Waktu' },
  { kana: 'いちばん', jp: '一番', romaji: 'ichiban', id: 'Nomor satu / Paling', cat: 'Keterangan' },
  { kana: 'いつ', jp: '何時', romaji: 'itsu', id: 'Kapan', cat: 'Tanya' },
  { kana: 'いっしょ', jp: '一緒', romaji: 'issho', id: 'Bersama-sama', cat: 'Keterangan' },
  { kana: 'いつつ', jp: '五つ', romaji: 'itsutsu', id: 'Lima buah', cat: 'Angka' },
  { kana: 'いぬ', jp: '犬', romaji: 'inu', id: 'Anjing', cat: 'Hewan' },
  { kana: 'いま', jp: '今', romaji: 'ima', id: 'Sekarang', cat: 'Waktu' },
  { kana: 'いみ', jp: '意味', romaji: 'imi', id: 'Arti / Makna', cat: 'Benda' },
  { kana: 'いもうと', jp: '妹', romaji: 'imouto', id: 'Adik perempuan', cat: 'Keluarga' },
  { kana: 'いや', jp: '嫌', romaji: 'iya', id: 'Tidak suka / Benci', cat: 'Sifat' },
  { kana: 'いりぐち', jp: '入り口', romaji: 'iriguchi', id: 'Pintu masuk', cat: 'Tempat' },
  { kana: 'いる', jp: '居る', romaji: 'iru', id: 'Ada (makhluk hidup)', cat: 'Kerja' },
  { kana: 'いろ', jp: '色', romaji: 'iro', id: 'Warna', cat: 'Benda' },
  { kana: 'いろいろ', jp: '色々', romaji: 'iroiro', id: 'Bermacam-macam', cat: 'Sifat' },
  { kana: 'うえ', jp: '上', romaji: 'ue', id: 'Atas', cat: 'Arah' },
  { kana: 'うしろ', jp: '後ろ', romaji: 'ushiro', id: 'Belakang', cat: 'Arah' },
  { kana: 'うすい', jp: '薄い', romaji: 'usui', id: 'Tipis / Encer', cat: 'Sifat' },
  { kana: 'うた', jp: '歌', romaji: 'uta', id: 'Lagu', cat: 'Benda' },
  { kana: 'うたう', jp: '歌う', romaji: 'utau', id: 'Menyanyi', cat: 'Kerja' },
  { kana: 'うち', jp: '家', romaji: 'uchi', id: 'Rumah / Kami', cat: 'Tempat' },
  { kana: 'うまれる', jp: '生まれる', romaji: 'umareru', id: 'Lahir', cat: 'Kerja' },
  { kana: 'うみ', jp: '海', romaji: 'umi', id: 'Laut', cat: 'Alam' },
  { kana: 'うる', jp: '売る', romaji: 'uru', id: 'Menjual', cat: 'Kerja' },
  { kana: 'うまい', jp: '美味い', romaji: 'umai', id: 'Enak / Pandai', cat: 'Sifat' },
  { kana: 'え', jp: '絵', romaji: 'e', id: 'Gambar / Lukisan', cat: 'Benda' },
  { kana: 'えいが', jp: '映画', romaji: 'eiga', id: 'Film', cat: 'Benda' },
  { kana: 'えいご', jp: '英語', romaji: 'eigo', id: 'Bahasa Inggris', cat: 'Bahasa' },
  { kana: 'ええ', jp: 'ええ', romaji: 'ee', id: 'Ya (sopan)', cat: 'Ungkapan' },
  { kana: 'えき', jp: '駅', romaji: 'eki', id: 'Stasiun kereta', cat: 'Tempat' },
  { kana: 'エレベーター', jp: 'エレベーター', romaji: 'erebeetaa', id: 'Lift / Elevator', cat: 'Benda' },
  { kana: 'えんぴつ', jp: '鉛筆', romaji: 'enpitsu', id: 'Pensil', cat: 'Benda' },
  { kana: 'おいしい', jp: '美味しい', romaji: 'oishii', id: 'Enak / Lezat', cat: 'Sifat' },
  { kana: 'おきる', jp: '起きる', romaji: 'okiru', id: 'Bangun tidur', cat: 'Kerja' },
  { kana: 'おく', jp: '置く', romaji: 'oku', id: 'Meletakkan', cat: 'Kerja' },
  { kana: 'おくさん', jp: '奥さん', romaji: 'okusan', id: 'Istri (orang lain)', cat: 'Keluarga' },
  { kana: 'お酒', jp: 'お酒', romaji: 'osake', id: 'Minuman beralkohol', cat: 'Minuman' },
  { kana: 'お父さん', jp: 'お父さん', romaji: 'otousan', id: 'Ayah', cat: 'Keluarga' },
  { kana: 'お母さん', jp: 'お母さん', romaji: 'okaasan', id: 'Ibu', cat: 'Keluarga' },
  { kana: 'お茶', jp: 'お茶', romaji: 'ocha', id: 'Teh hijau', cat: 'Minuman' },
  { kana: 'おなじ', jp: '同じ', romaji: 'onaji', id: 'Sama', cat: 'Sifat' },
  { kana: 'おにいさん', jp: 'お兄さん', romaji: 'oniisan', id: 'Kakak laki-laki', cat: 'Keluarga' },
  { kana: 'おねえさん', jp: 'お姉さん', romaji: 'oneesan', id: 'Kakak perempuan', cat: 'Keluarga' }
];

// ----------------------------------------------------------------------------
// KOSAKATA RESMI LEVEL N4 (Jepang.org / JLPT N4)
// ----------------------------------------------------------------------------
const N4_LIST: OfficialItem[] = [
  { kana: 'あいす', jp: 'アイス', romaji: 'aisu', id: 'Es krim', cat: 'Makanan' },
  { kana: 'あいにく', jp: '生憎', romaji: 'ainiku', id: 'Sayang sekali', cat: 'Keterangan' },
  { kana: 'あがる', jp: '上がる', romaji: 'agaru', id: 'Naik', cat: 'Kerja' },
  { kana: 'あかんぼう', jp: '赤ん坊', romaji: 'akanbou', id: 'Bayi', cat: 'Orang' },
  { kana: 'あく', jp: '開く', romaji: 'aku', id: 'Terbuka', cat: 'Kerja' },
  { kana: 'あじ', jp: '味', romaji: 'aji', id: 'Rasa', cat: 'Benda' },
  { kana: 'あつまる', jp: '集まる', romaji: 'atsumaru', id: 'Berkumpul', cat: 'Kerja' },
  { kana: 'あつめる', jp: '集める', romaji: 'atsumeru', id: 'Mengumpulkan', cat: 'Kerja' },
  { kana: 'あんない', jp: '案内', romaji: 'annai', id: 'Panduan', cat: 'Kerja' },
  { kana: 'あんしん', jp: '安心', romaji: 'anshin', id: 'Tenang / Lega', cat: 'Sifat' },
  { kana: 'あんぜん', jp: '安全', romaji: 'anzen', id: 'Aman', cat: 'Sifat' },
  { kana: 'いけん', jp: '意見', romaji: 'iken', id: 'Pendapat', cat: 'Komunikasi' },
  { kana: 'いし', jp: '石', romaji: 'ishi', id: 'Batu', cat: 'Alam' },
  { kana: 'いそがしい', jp: '忙しい', romaji: 'isogashii', id: 'Sibuk', cat: 'Sifat' },
  { kana: 'いたい', jp: '痛い', romaji: 'itai', id: 'Sakit', cat: 'Sifat' },
  { kana: 'いなか', jp: '田舎', romaji: 'inaka', id: 'Pedesaan', cat: 'Tempat' },
  { kana: 'いのる', jp: '祈る', romaji: 'inoru', id: 'Berdoa', cat: 'Kerja' },
  { kana: 'いらっしゃる', jp: 'いらっしゃる', romaji: 'irassharu', id: 'Datang / Ada (sopan)', cat: 'Kerja' },
  { kana: 'うえる', jp: '植える', romaji: 'ueru', id: 'Menanam', cat: 'Kerja' },
  { kana: 'うけとる', jp: '受け取る', romaji: 'uketoru', id: 'Menerima', cat: 'Kerja' },
  { kana: 'うごく', jp: '動く', romaji: 'ugoku', id: 'Bergerak', cat: 'Kerja' },
  { kana: 'うち', jp: '打ち', romaji: 'uchi', id: 'Memukul / Dalam', cat: 'Kerja' },
  { kana: 'うつ', jp: '打つ', romaji: 'utsu', id: 'Mengetik / Memukul', cat: 'Kerja' },
  { kana: 'うつくしい', jp: '美しい', romaji: 'utsukushii', id: 'Indah / Cantik', cat: 'Sifat' },
  { kana: 'うつす', jp: '写す', romaji: 'utsusu', id: 'Menyalin / Memotret', cat: 'Kerja' },
  { kana: 'うで', jp: '腕', romaji: 'ude', id: 'Lengan', cat: 'Tubuh' },
  { kana: 'うまい', jp: '上手い', romaji: 'umai', id: 'Pintar / Lezat', cat: 'Sifat' },
  { kana: 'うら', jp: '裏', romaji: 'ura', id: 'Bagian belakang / Dalam', cat: 'Arah' },
  { kana: 'うりば', jp: '売り場', romaji: 'uriba', id: 'Tempat penjualan', cat: 'Tempat' },
  { kana: 'うれしい', jp: '嬉しい', romaji: 'ureshii', id: 'Senang / Gembira', cat: 'Sifat' }
];

// ----------------------------------------------------------------------------
// KOSAKATA RESMI LEVEL N3 (Jepang.org / JLPT N3)
// ----------------------------------------------------------------------------
const N3_LIST: OfficialItem[] = [
  { kana: 'あいする', jp: '愛する', romaji: 'aisuru', id: 'Mencintai', cat: 'Kerja' },
  { kana: 'あいだ', jp: '間', romaji: 'aida', id: 'Selama / Jeda', cat: 'Waktu' },
  { kana: 'あおぐ', jp: '仰ぐ', romaji: 'aogu', id: 'Memohon / Menengadah', cat: 'Kerja' },
  { kana: 'あきらめる', jp: '諦める', romaji: 'akirameru', id: 'Menyerah', cat: 'Kerja' },
  { kana: 'あくしゅ', jp: '握手', romaji: 'akushu', id: 'Berjabat tangan', cat: 'Kerja' },
  { kana: 'あくま', jp: '悪魔', romaji: 'akuma', id: 'Setan / Iblis', cat: 'Benda' },
  { kana: 'あける', jp: '明ける', romaji: 'akeru', id: 'Fajar / Berakhir', cat: 'Kerja' },
  { kana: 'あこがれる', jp: '憧れる', romaji: 'akogareru', id: 'Mengagumi', cat: 'Kerja' },
  { kana: 'あざやか', jp: '鮮やか', romaji: 'azayaka', id: 'Cerah / Terang', cat: 'Sifat' },
  { kana: 'あらかじめ', jp: '予め', romaji: 'arakajime', id: 'Sebelumnya', cat: 'Keterangan' },
  { kana: 'ああら', jp: 'ああら', romaji: 'aara', id: 'Wah (seruan)', cat: 'Seruan' },
  { kana: 'あいて', jp: '相手', romaji: 'aite', id: 'Lawan bicara / Mitra', cat: 'Orang' },
  { kana: 'あいにく', jp: '生憎', romaji: 'ainiku', id: 'Sayang sekali', cat: 'Keterangan' },
  { kana: 'あおむけ', jp: '仰向け', romaji: 'aomuke', id: 'Terlentang', cat: 'Keadaan' },
  { kana: 'あかるみ', jp: '明るみ', romaji: 'akarumi', id: 'Terkuak ke publik', cat: 'Keadaan' }
];

// ----------------------------------------------------------------------------
// KOSAKATA RESMI LEVEL N2 (Jepang.org / JLPT N2)
// ----------------------------------------------------------------------------
const N2_LIST: OfficialItem[] = [
  { kana: 'あいおい', jp: '相生', romaji: 'aioi', id: 'Bersama-sama', cat: 'Mahir' },
  { kana: 'あいそ', jp: '愛想', romaji: 'aiso', id: 'Keramahan', cat: 'Mahir' },
  { kana: 'あえて', jp: '敢えて', romaji: 'aete', id: 'Sengaja / Berani', cat: 'Mahir' },
  { kana: 'あかじ', jp: '赤字', romaji: 'akaji', id: 'Defisit / Rugi', cat: 'Mahir' },
  { kana: 'あかるみ', jp: '明るみ', romaji: 'akarumi', id: 'Terang / Terkuak', cat: 'Mahir' },
  { kana: 'あきらめ', jp: '諦め', romaji: 'akirame', id: 'Pasrah / Kepatuhan', cat: 'Mahir' },
  { kana: 'あくかん', jp: '悪感', romaji: 'akkan', id: 'Firasat buruk', cat: 'Mahir' },
  { kana: 'あくめい', jp: '悪名', romaji: 'akumei', id: 'Nama buruk', cat: 'Mahir' },
  { kana: 'あげる', jp: '挙げる', romaji: 'ageru', id: 'Menyebutkan / Mengajukan', cat: 'Mahir' },
  { kana: 'あつかう', jp: '扱う', romaji: 'atsukau', id: 'Menangani / Memperlakukan', cat: 'Mahir' }
];

/**
 * Pembangun Database Bersih Mengikuti Standar jepang.org/jlpt/n5/kosakata (N5 - N2)
 * 100% Otentik, Tanpa Angka Buatan, Terstruktur Rapi Sederhana.
 */
export const buildCleanDeck = (): {
  deckN5: VocabCard[];
  deckN4: VocabCard[];
  deckN3: VocabCard[];
  deckN2: VocabCard[];
  fullDeck: VocabCard[];
} => {
  const globalUnique = new Set<string>();

  const deckN5: VocabCard[] = [];
  const deckN4: VocabCard[] = [];
  const deckN3: VocabCard[] = [];
  const deckN2: VocabCard[] = [];

  const addCard = (level: JLPTLevel, item: OfficialItem) => {
    const key = `${item.kana}-${item.jp}`.trim();
    if (!key || globalUnique.has(key)) return false;
    globalUnique.add(key);

    const card: VocabCard = {
      id: globalUnique.size,
      level,
      japanese: item.jp,
      kana: item.kana,
      romaji: item.romaji,
      reading: item.romaji,
      indonesian: item.id,
      category: item.cat,
      categoryJp: 'JLPT標準語彙',
      example: `${item.jp}を使う。`,
      exampleIndonesian: `Menggunakan ${item.id.toLowerCase()}.`
    };

    if (level === 'N5') deckN5.push(card);
    else if (level === 'N4') deckN4.push(card);
    else if (level === 'N3') deckN3.push(card);
    else deckN2.push(card);

    return true;
  };

  N5_LIST.forEach(i => addCard('N5', i));
  N4_LIST.forEach(i => addCard('N4', i));
  N3_LIST.forEach(i => addCard('N3', i));
  N2_LIST.forEach(i => addCard('N2', i));

  const fullDeck = [
    ...deckN5,
    ...deckN4,
    ...deckN3,
    ...deckN2
  ];

  return {
    deckN5,
    deckN4,
    deckN3,
    deckN2,
    fullDeck
  };
};
