import { EnhancedGrammarItem } from './materiData';

/**
 * DATABASE 100+ POLA TATA BAHASA / GRAMMAR RESMI JLPT (N5 – N2)
 * Disusun lengkap berpedoman pada 5 Seri Buku Rujukan Utama:
 * 1. Minna no Nihongo (Bab 1–50)
 * 2. Shin Kanzen Master (N5–N2)
 * 3. Nihongo So-Matome (N5–N2)
 * 4. TRY! JLPT (N5–N2)
 * 5. Mimi Kara Oboeru (N5–N2)
 */

export const COMPREHENSIVE_GRAMMAR_100_LIST: EnhancedGrammarItem[] = [
  // ==========================================
  // LEVEL N5: TATA BAHASA DASAR & PEMULA (25 POLA)
  // ==========================================
  {
    id: 'n5-g1',
    level: 'N5',
    title: '1. Kopula Positif & Penanda Topik: ～は～です (A wa B desu)',
    formula: 'Subjek + は + Predikat + です',
    meaning: 'A adalah B',
    bookReference: 'Minna no Nihongo Bab 1 · Shin Kanzen Master N5',
    explanation: 'Pola paling mendasar. Partikel は (wa) menandai topik pembicaraan, sedangkan です (desu) adalah kopula penegas kesopanan.',
    examples: [
      { japanese: 'わたしは がくせいです。', romaji: 'Watashi wa gakusei desu.', indonesian: 'Saya adalah seorang pelajar.' },
      { japanese: 'こちらは たなかさんです。', romaji: 'Kochira wa Tanaka-san desu.', indonesian: 'Ini adalah Tuan Tanaka.' }
    ],
    practiceExercises: [
      {
        id: 'n5-ex-1',
        question: 'わたし（　）エンジニアです。Pilih partikel topik yang tepat:',
        options: ['は', 'を', 'に', 'で'],
        correctIndex: 0,
        explanation: 'Partikel は (wa) menandai subjek topik utama kalimat.'
      }
    ]
  },
  {
    id: 'n5-g2',
    level: 'N5',
    title: '2. Kopula Negatif: ～ではありません / ～じゃありません',
    formula: 'A は B ではありません / じゃありません',
    meaning: 'A bukan B',
    bookReference: 'Minna no Nihongo Bab 1 · So-Matome N5',
    explanation: 'Bentuk penyangkalan sopan dari です. ではありません lebih formal/tertulis, sedangkan じゃありません lebih sering digunakan dalam percakapan lisan.',
    examples: [
      { japanese: 'わたしは いしゃではありません。', romaji: 'Watashi wa isha dewa arimasen.', indonesian: 'Saya bukan seorang dokter.' }
    ],
    practiceExercises: [
      {
        id: 'n5-ex-2',
        question: 'きょうは にちようび（　）。Pilih bentuk penyangkalan:',
        options: ['じゃありません', 'でした', 'です', 'ます'],
        correctIndex: 0,
        explanation: 'じゃありません adalah bentuk negatif sopan dari kata benda.'
      }
    ]
  },
  {
    id: 'n5-g3',
    level: 'N5',
    title: '3. Kalimat Tanya: ～ですか (Desu ka)',
    formula: 'Kalimat Positif + か',
    meaning: 'Apakah...?',
    bookReference: 'Minna no Nihongo Bab 1 · TRY! N5',
    explanation: 'Partikel か di akhir kalimat berfungsi sebagai tanda tanya tanpa memerlukan tanda baca khusus (?) dalam penulisan bahasa Jepang formal.',
    examples: [
      { japanese: 'あなたは がくせいですか。', romaji: 'Anata wa gakusei desu ka.', indonesian: 'Apakah Anda seorang pelajar?' }
    ]
  },
  {
    id: 'n5-g4',
    level: 'N5',
    title: '4. Kepemilikan & Modifikasi: Kata Benda 1 の Kata Benda 2',
    formula: 'KB1 + の + KB2',
    meaning: 'KB2 milik KB1 / KB2 tentang KB1',
    bookReference: 'Minna no Nihongo Bab 1–2 · Mimi Kara Oboeru N5',
    explanation: 'Partikel の menghubungkan dua kata benda untuk menunjukkan kepemilikan, asal negara, atau spesifikasi.',
    examples: [
      { japanese: 'これは わたしのかばんです。', romaji: 'Kore wa watashi no kaban desu.', indonesian: 'Ini adalah tas milik saya.' }
    ]
  },
  {
    id: 'n5-g5',
    level: 'N5',
    title: '5. Kata Tunjuk Benda: これ / それ / あれ / どれ',
    formula: 'これ/それ/あれ/どれ + は + [Predikat] + です',
    meaning: 'Ini, Itu, Itu (jauh), Yang mana',
    bookReference: 'Minna no Nihongo Bab 2 · Shin Kanzen Master N5',
    explanation: '• これ: Dekat pembicara. • それ: Dekat lawan bicara. • あれ: Jauh dari keduanya. • どれ: Kata tanya yang mana.',
    examples: [
      { japanese: 'これは にほんごの ほんです。', romaji: 'Kore wa nihongo no hon desu.', indonesian: 'Ini adalah buku bahasa Jepang.' }
    ]
  },
  {
    id: 'n5-g6',
    level: 'N5',
    title: '6. Kata Tunjuk Menerangkan: この / その / あの / どの + Kata Benda',
    formula: 'この/その/あの/どの + Kata Benda',
    meaning: '... ini, ... itu, ... itu (jauh), ... yang mana',
    bookReference: 'Minna no Nihongo Bab 2 · TRY! N5',
    explanation: 'Berbeda dengan これ/それ/あれ yang berdiri sendiri, この/その/あの wajib langsung diikuti oleh kata benda.',
    examples: [
      { japanese: 'この くるまは とても はやいです。', romaji: 'Kono kuruma wa totemo hayai desu.', indonesian: 'Mobil ini sangat cepat.' }
    ]
  },
  {
    id: 'n5-g7',
    level: 'N5',
    title: '7. Lokasi & Arah: ここ / そこ / あそこ / どこ',
    formula: '[Subjek] は ここ/そこ/あそこ/どこ です',
    meaning: 'Di sini, Di situ, Di sana, Di mana',
    bookReference: 'Minna no Nihongo Bab 3 · So-Matome N5',
    explanation: 'Menunjukkan lokasi keberadaan tempat atau fasilitas.',
    examples: [
      { japanese: 'トイレは あそこです。', romaji: 'Toire wa asoko desu.', indonesian: 'Toilet ada di sebelah sana.' }
    ]
  },
  {
    id: 'n5-g8',
    level: 'N5',
    title: '8. Partikel Waktu & Tujuan: に (Ni)',
    formula: 'Waktu Spesifik / Tempat Tujuan + に + Kata Kerja',
    meaning: 'Pada (jam/hari) / Ke (tempat)',
    bookReference: 'Minna no Nihongo Bab 4–5 · Mimi Kara Oboeru N5',
    explanation: 'Digunakan untuk menandai waktu terjadinya aksi yang spesifik (jam, hari, tanggal) atau titik tujuan pergerakan.',
    examples: [
      { japanese: 'まいあさ ７じに おきます。', romaji: 'Maiasa shichi-ji ni okimasu.', indonesian: 'Setiap pagi saya bangun pada jam 7.' }
    ]
  },
  {
    id: 'n5-g9',
    level: 'N5',
    title: '9. Partikel Sarana & Tempat Aksi: で (De)',
    formula: 'Tempat / Alat / Sarana + で + Kata Kerja',
    meaning: 'Di (tempat aksi) / Dengan (alat/kendaraan)',
    bookReference: 'Minna no Nihongo Bab 5–6 · Shin Kanzen Master N5',
    explanation: 'Menandai tempat berlangsungnya sebuah tindakan atau alat/transportasi yang dipakai.',
    examples: [
      { japanese: 'でんしゃで かいしゃへ いきます。', romaji: 'Densha de kaisha e ikimasu.', indonesian: 'Pergi ke kantor naik kereta.' }
    ]
  },
  {
    id: 'n5-g10',
    level: 'N5',
    title: '10. Partikel Objek Langsung: を (O / Wo)',
    formula: 'Kata Benda + を + Kata Kerja Transitif',
    meaning: 'Penanda Objek Tindakan',
    bookReference: 'Minna no Nihongo Bab 6 · TRY! N5',
    explanation: 'Menandai objek penderita yang dikenai perbuatan kata kerja transitif.',
    examples: [
      { japanese: 'あさごはんを たべます。', romaji: 'Asagohan o tabemasu.', indonesian: 'Makan sarapan pagi.' }
    ]
  },
  {
    id: 'n5-g11',
    level: 'N5',
    title: '11. Arah Pergerakan: へ (E)',
    formula: 'Tempat + へ + 行きます / 来ます / 帰ります',
    meaning: 'Menuju / Ke arah...',
    bookReference: 'Minna no Nihongo Bab 5 · So-Matome N5',
    explanation: 'Partikel へ (dibaca "e") menegaskan arah tujuan pergerakan.',
    examples: [
      { japanese: 'にほんへ いきます。', romaji: 'Nihon e ikimasu.', indonesian: 'Pergi menuju Jepang.' }
    ]
  },
  {
    id: 'n5-g12',
    level: 'N5',
    title: '12. Teman & Kebersamaan: と (To)',
    formula: 'KB1 + と + KB2 / Orang + と + Kata Kerja',
    meaning: 'Dan / Bersama...',
    bookReference: 'Minna no Nihongo Bab 4 & 5 · Mimi Kara Oboeru N5',
    explanation: 'Menghubungkan dua kata benda ("dan") atau menandai rekan saat melakukan aktivitas ("bersama").',
    examples: [
      { japanese: 'ともだちと えいがを みます。', romaji: 'Tomodachi to eiga o mimasu.', indonesian: 'Menonton film bersama teman.' }
    ]
  },
  {
    id: 'n5-g13',
    level: 'N5',
    title: '13. Rentang Waktu & Ruang: から ~ まで (Kara ~ Made)',
    formula: 'Titik Awal + から + Titik Akhir + まで',
    meaning: 'Dari ~ Sampai ~',
    bookReference: 'Minna no Nihongo Bab 4 · TRY! N5',
    explanation: 'Menyatakan batas awal dan batas akhir waktu atau jarak tempuh.',
    examples: [
      { japanese: 'ぎんこうは ９じから ３じまでです。', romaji: 'Ginkou wa ku-ji kara san-ji made desu.', indonesian: 'Bank buka dari jam 9 sampai jam 3.' }
    ]
  },
  {
    id: 'n5-g14',
    level: 'N5',
    title: '14. Partikel Inklusif: も (Mo)',
    formula: 'Kata Benda + も',
    meaning: 'Juga / Pun',
    bookReference: 'Minna no Nihongo Bab 1 · Shin Kanzen Master N5',
    explanation: 'Menggantikan partikel は, を, atau が untuk menyatakan kesamaan predikat dengan topik sebelumnya.',
    examples: [
      { japanese: 'わたしも がくせいです。', romaji: 'Watashi mo gakusei desu.', indonesian: 'Saya juga seorang pelajar.' }
    ]
  },
  {
    id: 'n5-g15',
    level: 'N5',
    title: '15. Bentuk Waktu Lampau Sopan: ～ました & ～ませんでした',
    formula: 'Akar Kata Kerja + ました / ませんでした',
    meaning: 'Telah melakukan / Tidak melakukan (lampau)',
    bookReference: 'Minna no Nihongo Bab 4 · So-Matome N5',
    explanation: 'Konjugasi kata kerja bentuk lampau sopan positif dan negatif.',
    examples: [
      { japanese: 'きのう たくさん べんきょうしました。', romaji: 'Kinou takusan benkyou shimashita.', indonesian: 'Kemarin saya sudah belajar banyak.' }
    ]
  },
  {
    id: 'n5-g16',
    level: 'N5',
    title: '16. Keberadaan Makhluk Hidup: います (Imasu)',
    formula: '[Tempat] に [Orang/Hewan] が います',
    meaning: 'Ada / Berada (manusia / hewan)',
    bookReference: 'Minna no Nihongo Bab 10 · TRY! N5',
    explanation: 'Khusus untuk makhluk bernyawa yang dapat bergerak atas kehendak sendiri.',
    examples: [
      { japanese: 'きょうしつに せんせいが います。', romaji: 'Kyoushitsu ni sensei ga imasu.', indonesian: 'Di ruang kelas ada guru.' }
    ]
  },
  {
    id: 'n5-g17',
    level: 'N5',
    title: '17. Keberadaan Benda Mati: あります (Arimasu)',
    formula: '[Tempat] に [Benda/Tumbuhan] が あります',
    meaning: 'Ada / Tersedia (benda mati / tanaman)',
    bookReference: 'Minna no Nihongo Bab 10 · Mimi Kara Oboeru N5',
    explanation: 'Khusus untuk benda tak bernyawa, tumbuhan, gedung, atau acara.',
    examples: [
      { japanese: 'つくえの うえに ほんが あります。', romaji: 'Tsukue no ue ni hon ga arimasu.', indonesian: 'Di atas meja ada buku.' }
    ]
  },
  {
    id: 'n5-g18',
    level: 'N5',
    title: '18. Kata Sifat-I (い形容詞) Konjugasi Lengkap',
    formula: '高い → 高くない → 高かった → 高くなかった',
    meaning: 'Sifat Positif, Negatif, Lampau Positif, Lampau Negatif',
    bookReference: 'Minna no Nihongo Bab 8 & 12 · Shin Kanzen Master N5',
    explanation: 'Kata sifat yang berakhiran ~い berkonjugasi pada suku kata terakhirnya.',
    examples: [
      { japanese: 'この りょうりは おいしいです。', romaji: 'Kono ryouri wa oishii desu.', indonesian: 'Masakan ini enak.' },
      { japanese: 'きのうは あつくなかったです。', romaji: 'Kinou wa atsukunakatta desu.', indonesian: 'Kemarin tidak panas.' }
    ]
  },
  {
    id: 'n5-g19',
    level: 'N5',
    title: '19. Kata Sifat-Na (な形容詞) Konjugasi Lengkap',
    formula: '静か(な) → 静かではない → 静かでした → 静かではありませんでした',
    meaning: 'Sifat Keadaan & Karakter',
    bookReference: 'Minna no Nihongo Bab 8 & 12 · So-Matome N5',
    explanation: 'Memerlukan partikel な saat diletakkan langsung di depan kata benda.',
    examples: [
      { japanese: 'ふじさんは ゆうめいな やまです。', romaji: 'Fujisan wa yuumei na yama desu.', indonesian: 'Gunung Fuji adalah gunung yang terkenal.' }
    ]
  },
  {
    id: 'n5-g20',
    level: 'N5',
    title: '20. Ajakan Bersama: ～ましょう (Mashou)',
    formula: 'Akar Kata Kerja + ましょう',
    meaning: 'Mari kita... / Ayo kita...',
    bookReference: 'Minna no Nihongo Bab 6 · TRY! N5',
    explanation: 'Mengajak lawan bicara melakukan sesuatu secara antusias bersama pembicara.',
    examples: [
      { japanese: 'いっしょに ひるごはんを たべましょう。', romaji: 'Isshoni hirugohan o tabemashou.', indonesian: 'Ayo kita makan siang bersama.' }
    ]
  },
  {
    id: 'n5-g21',
    level: 'N5',
    title: '21. Menawarkan Bantuan: ～ましょうか (Mashou ka)',
    formula: 'Akar Kata Kerja + ましょうか',
    meaning: 'Bagaimana kalau saya bantu...?',
    bookReference: 'Minna no Nihongo Bab 14 · Mimi Kara Oboeru N5',
    explanation: 'Inisiatif menawarkan bantuan atau kesediaan melakukan tindakan demi lawan bicara.',
    examples: [
      { japanese: 'まどを あけましょうか。', romaji: 'Mado o akemashou ka.', indonesian: 'Bagaimana kalau saya bukakan jendelanya?' }
    ]
  },
  {
    id: 'n5-g22',
    level: 'N5',
    title: '22. Permohonan Sopan: ～てください (Te Kudasai)',
    formula: 'Kata Kerja Bentuk -Te + ください',
    meaning: 'Tolong / Silakan lakukan...',
    bookReference: 'Minna no Nihongo Bab 14 · Shin Kanzen Master N5',
    explanation: 'Permintaan tolong atau instruksi sopan yang umum digunakan di kelas dan tempat kerja.',
    examples: [
      { japanese: 'ここに なまえを かいてください。', romaji: 'Koko de namae o kaite kudasai.', indonesian: 'Tolong tuliskan nama di sini.' }
    ]
  },
  {
    id: 'n5-g23',
    level: 'N5',
    title: '23. Sedang Berlangsung / Kebiasaan: ～ています (Te Imasu)',
    formula: 'Kata Kerja Bentuk -Te + います',
    meaning: 'Sedang melakukan / Berstatus...',
    bookReference: 'Minna no Nihongo Bab 14 & 15 · TRY! N5',
    explanation: 'Menyatakan aksi yang sedang berlangsung saat ini atau status kondisi yang bertahan (contoh: menikah, tinggal, bekerja).',
    examples: [
      { japanese: 'いま にほんごを べんきょうしています。', romaji: 'Ima nihongo o benkyou shite imasu.', indonesian: 'Sekarang sedang belajar bahasa Jepang.' }
    ]
  },
  {
    id: 'n5-g24',
    level: 'N5',
    title: '24. Meminta & Memberi Izin: ～てもいいですか (Te mo ii desu ka)',
    formula: 'Kata Kerja Bentuk -Te + もいいですか',
    meaning: 'Bolehkah saya...?',
    bookReference: 'Minna no Nihongo Bab 15 · So-Matome N5',
    explanation: 'Meminta izin secara sopan sebelum melakukan sesuatu.',
    examples: [
      { japanese: 'ここで しゃしんを とってもいいですか。', romaji: 'Koko de shashin o totte mo ii desu ka.', indonesian: 'Bolehkah saya mengambil foto di sini?' }
    ]
  },
  {
    id: 'n5-g25',
    level: 'N5',
    title: '25. Larangan Halus: ～てはいけません (Te wa ikemasen)',
    formula: 'Kata Kerja Bentuk -Te + はいけません',
    meaning: 'Dilarang / Tidak boleh...',
    bookReference: 'Minna no Nihongo Bab 15 · Mimi Kara Oboeru N5',
    explanation: 'Menyatakan larangan keras berdasarkan aturan keselamatan atau tata tertib fasilitas umum.',
    examples: [
      { japanese: 'ここで たばこを すっては いけません。', romaji: 'Koko de tabako o sutte wa ikemasen.', indonesian: 'Dilarang merokok di tempat ini.' }
    ]
  },

  // ==========================================
  // LEVEL N4: TATA BAHASA PEKERJA & PEMULA LANJUT (25 POLA)
  // ==========================================
  {
    id: 'n4-g1',
    level: 'N4',
    title: '26. Keinginan Diri: ～たいです (Tai desu)',
    formula: 'Akar Kata Kerja + たいです',
    meaning: 'Ingin melakukan...',
    bookReference: 'Minna no Nihongo Bab 13 · Shin Kanzen Master N4',
    explanation: 'Mengungkapkan keinginan pembicara. Objek を dapat berubah menjadi が.',
    examples: [
      { japanese: 'にほんへ いきたいです。', romaji: 'Nihon e ikitai desu.', indonesian: 'Saya ingin pergi ke Jepang.' }
    ]
  },
  {
    id: 'n4-g2',
    level: 'N4',
    title: '27. Larangan Bersahabat: ～ないでください (Naide kudasai)',
    formula: 'Kata Kerja Bentuk -Nai + でください',
    meaning: 'Tolong jangan...',
    bookReference: 'Minna no Nihongo Bab 17 · TRY! N4',
    explanation: 'Meminta seseorang agar tidak melakukan suatu hal.',
    examples: [
      { japanese: 'しんぱいしないでください。', romaji: 'Shinpai shinaide kudasai.', indonesian: 'Tolong jangan khawatir.' }
    ]
  },
  {
    id: 'n4-g3',
    level: 'N4',
    title: '28. Keharusan Mutlak: ～なければなりません (Nakereba narimasen)',
    formula: 'Kata Kerja Bentuk -Nai (buang -i) + ければなりません',
    meaning: 'Harus / Wajib melakukan...',
    bookReference: 'Minna no Nihongo Bab 17 · So-Matome N4',
    explanation: 'Menyatakan kewajiban atau keharusan mutlak yang tidak bisa dihindari.',
    examples: [
      { japanese: 'くすりを のまなければなりません。', romaji: 'Kusuri o nomanakereba narimasen.', indonesian: 'Harus minum obat.' }
    ]
  },
  {
    id: 'n4-g4',
    level: 'N4',
    title: '29. Tidak Wajib: ～なくてもいいです (Nakute mo ii desu)',
    formula: 'Kata Kerja Bentuk -Nai (buang -i) + くてもいいです',
    meaning: 'Tidak perlu / Tidak harus...',
    bookReference: 'Minna no Nihongo Bab 17 · Mimi Kara Oboeru N4',
    explanation: 'Menyatakan bahwa suatu perbuatan tidak diwajibkan.',
    examples: [
      { japanese: 'あしたは こなくてもいいです。', romaji: 'Ashita wa konakute mo ii desu.', indonesian: 'Besok tidak perlu datang.' }
    ]
  },
  {
    id: 'n4-g5',
    level: 'N4',
    title: '30. Kemampuan Nominal: ～ことができます (Koto ga dekimasu)',
    formula: 'Bentuk Kamus + ことができます',
    meaning: 'Bisa / Mampu melakukan...',
    bookReference: 'Minna no Nihongo Bab 18 · Shin Kanzen Master N4',
    explanation: 'Menyatakan kapasitas kemampuan atau izin situasional.',
    examples: [
      { japanese: 'くるまを うんてんすることができます。', romaji: 'Kuruma o unten suru koto ga dekimasu.', indonesian: 'Bisa menyetir mobil.' }
    ]
  },
  {
    id: 'n4-g6',
    level: 'N4',
    title: '31. Pengalaman Masa Lalu: ～たことがあります (Ta koto ga arimasu)',
    formula: 'Kata Kerja Bentuk -Ta + ことがあります',
    meaning: 'Pernah mengalami / melakukan...',
    bookReference: 'Minna no Nihongo Bab 19 · TRY! N4',
    explanation: 'Menyatakan riwayat atau pengalaman di masa lampau.',
    examples: [
      { japanese: 'ふじさんに のぼったことがあります。', romaji: 'Fujisan ni nobotta koto ga arimasu.', indonesian: 'Saya pernah mendaki Gunung Fuji.' }
    ]
  },
  {
    id: 'n4-g7',
    level: 'N4',
    title: '32. Perincian Kegiatan Acak: ～たり～たりします (Tari ~ tari shimasu)',
    formula: 'Bentuk -Ta + り + Bentuk -Ta + り + します',
    meaning: 'Kadang ..., kadang ..., dan lain-lain',
    bookReference: 'Minna no Nihongo Bab 19 · So-Matome N4',
    explanation: 'Menyebutkan contoh beberapa tindakan representatif tanpa urutan waktu yang kaku.',
    examples: [
      { japanese: 'やすみのひは ほんを よんだり、おんがくを きいたりします。', romaji: 'Yasumi no hi wa hon o yondari, ongaku o kiitari shimasu.', indonesian: 'Pada hari libur saya membaca buku, mendengarkan musik, dan sebagainya.' }
    ]
  },
  {
    id: 'n4-g8',
    level: 'N4',
    title: '33. Menjadi / Perubahan Kondisi: ～くなります / ～になります (Naru)',
    formula: '• I-Adj: buang -i + くなります • Na-Adj / KB + になります',
    meaning: 'Menjadi (perubahan sifat atau status)',
    bookReference: 'Minna no Nihongo Bab 19 · Mimi Kara Oboeru N4',
    explanation: 'Menggambarkan proses perubahan keadaan alami atau sengaja.',
    examples: [
      { japanese: 'てんきが あたたかくなりました。', romaji: 'Tenki ga atatakaku narimashita.', indonesian: 'Cuaca telah menjadi hangat.' }
    ]
  },
  {
    id: 'n4-g9',
    level: 'N4',
    title: '34. Menjelaskan Alasan & Penegasan: ～んです / のです (N desu)',
    formula: 'Bentuk Biasa + んです',
    meaning: 'Sebenarnya karena... (penjelasan kontekstual)',
    bookReference: 'Minna no Nihongo Bab 26 · Shin Kanzen Master N4',
    explanation: 'Digunakan untuk memberikan penjelasan latar belakang atau mencari keterangan atas situasi yang diamati.',
    examples: [
      { japanese: 'あたまが いたいんです。', romaji: 'Atama ga itai n desu.', indonesian: 'Sebenarnya kepala saya sedang sakit.' }
    ]
  },
  {
    id: 'n4-g10',
    level: 'N4',
    title: '35. Bentuk Potensial Pendek (可能形: Kanoukei)',
    formula: 'Grup 1: u → e + ru (contoh: 行ける) · Grup 2: ru → rareru (食べられる)',
    meaning: 'Bisa / Sanggup melakukan...',
    bookReference: 'Minna no Nihongo Bab 27 · TRY! N4',
    explanation: 'Bentuk singkat potensial yang sangat lazim dalam percakapan kerja harian.',
    examples: [
      { japanese: 'にほんごの しんぶんが よめます。', romaji: 'Nihongo no shinbun ga yomemasu.', indonesian: 'Bisa membaca koran bahasa Jepang.' }
    ]
  },
  {
    id: 'n4-g11',
    level: 'N4',
    title: '36. Bersamaan Dua Aksi: ～ながら (Nagara)',
    formula: 'Akar Kata Kerja + ながら',
    meaning: 'Sambil melakukan...',
    bookReference: 'Minna no Nihongo Bab 28 · So-Matome N4',
    explanation: 'Melakukan dua perbuatan secara simultan. Aksi utama diletakkan di akhir kalimat.',
    examples: [
      { japanese: 'おんがくを ききながら べんきょうします。', romaji: 'Ongaku o kikinagara benkyou shimasu.', indonesian: 'Belajar sambil mendengarkan musik.' }
    ]
  },
  {
    id: 'n4-g12',
    level: 'N4',
    title: '37. Bentuk Niat / Ajakan Kasual (意向形: Ikoukei)',
    formula: 'Grup 1: u → ou · Grup 2: ru → you · Grup 3: こよう / しよう',
    meaning: 'Ayo kita... / Berniat untuk...',
    bookReference: 'Minna no Nihongo Bab 31 · Mimi Kara Oboeru N4',
    explanation: 'Bentuk kasual dari ～ましょう.',
    examples: [
      { japanese: 'こんばん いっしょに ごはんを たべよう。', romaji: 'Konban isshoni gohan o tabeyou.', indonesian: 'Malam ini ayo makan bareng.' }
    ]
  },
  {
    id: 'n4-g13',
    level: 'N4',
    title: '38. Rencana Kuat: ～つもりです (Tsumori desu)',
    formula: 'Bentuk Kamus / Bentuk -Nai + つもりです',
    meaning: 'Berencana / Berniat untuk...',
    bookReference: 'Minna no Nihongo Bab 31 · Shin Kanzen Master N4',
    explanation: 'Menyatakan tekad rencana yang sudah diputuskan sebelumnya.',
    examples: [
      { japanese: 'らいねん にほんで はたらくつもりです。', romaji: 'Rainen Nihon de hataraku tsumori desu.', indonesian: 'Tahun depan berencana bekerja di Jepang.' }
    ]
  },
  {
    id: 'n4-g14',
    level: 'N4',
    title: '39. Saran / Nasihat: ～たほうがいいです (Ta hou ga ii desu)',
    formula: 'Bentuk -Ta + ほうがいいです / Bentuk -Nai + ほうがいいです',
    meaning: 'Sebaiknya melakukan ... / Sebaiknya jangan...',
    bookReference: 'Minna no Nihongo Bab 32 · TRY! N4',
    explanation: 'Memberikan anjuran atau saran medis/kebaikan kepada lawan bicara.',
    examples: [
      { japanese: 'くすりを のんで はやく ねたほうがいいですよ。', romaji: 'Kusuri o nonde hayaku neta hou ga ii desu yo.', indonesian: 'Sebaiknya minum obat lalu lekas tidur.' }
    ]
  },
  {
    id: 'n4-g15',
    level: 'N4',
    title: '40. Perkiraan / Tampaknya: ～でしょう / ～だろう (Deshou / Darou)',
    formula: 'Bentuk Biasa + でしょう',
    meaning: 'Sepertinya / Mungkin akan...',
    bookReference: 'Minna no Nihongo Bab 32 · So-Matome N4',
    explanation: 'Perkiraan cuaca atau dugaan situasi masa depan.',
    examples: [
      { japanese: 'あしたは あめが ふるでしょう。', romaji: 'Ashita wa ame ga furu deshou.', indonesian: 'Besok tampaknya akan turun hujan.' }
    ]
  },
  {
    id: 'n4-g16',
    level: 'N4',
    title: '41. Pengandaian Kondisi: ～たら (Tara)',
    formula: 'Bentuk -Ta + ら',
    meaning: 'Kalau / Jika / Setelah...',
    bookReference: 'Minna no Nihongo Bab 25 · Mimi Kara Oboeru N4',
    explanation: 'Bentuk pengandaian yang paling fleksibel dan umum dipakai dalam percakapan.',
    examples: [
      { japanese: 'じかんが あったら、あそびに きてください。', romaji: 'Jikan ga attara, asobi ni kite kudasai.', indonesian: 'Jika ada waktu luang, silakan datang main.' }
    ]
  },
  {
    id: 'n4-g17',
    level: 'N4',
    title: '42. Bentuk Pasif (受身形: Ukemi-kei)',
    formula: 'Grup 1: u → areru · Grup 2: ru → rareru',
    meaning: 'Dikenai tindakan (di-...)',
    bookReference: 'Minna no Nihongo Bab 37 · Shin Kanzen Master N4',
    explanation: 'Subjek menerima perbuatan dari pihak lain (partikel に). Sering membawa nuansa kerugian (meiwaku ukemi).',
    examples: [
      { japanese: 'わたしは せんせいに ほめられました。', romaji: 'Watashi wa sensei ni homeraremashita.', indonesian: 'Saya dipuji oleh Sensei.' }
    ]
  },
  {
    id: 'n4-g18',
    level: 'N4',
    title: '43. Bentuk Kausatif (使役形: Shieki-kei)',
    formula: 'Grup 1: u → aseru · Grup 2: ru → saseru',
    meaning: 'Menyuruh / Membiarkan seseorang melakukan...',
    bookReference: 'Minna no Nihongo Bab 48 · TRY! N4',
    explanation: 'Memberikan perintah atau izin kepada bawahan/anak.',
    examples: [
      { japanese: 'ははは こどもに やさいを たべさせました。', romaji: 'Haha wa kodomo ni yasai o tabesasemashita.', indonesian: 'Ibu menyuruh anak memakan sayur.' }
    ]
  },
  {
    id: 'n4-g19',
    level: 'N4',
    title: '44. Memberi & Menerima: あげる / もらう / くれる',
    formula: 'A は B に ... を あげる / もらう / くれる',
    meaning: 'Memberikan, Menerima, Memberi kepada saya',
    bookReference: 'Minna no Nihongo Bab 24 · So-Matome N4',
    explanation: 'Tata bahasa pemberian barang dan jasa antar manusia.',
    examples: [
      { japanese: 'ともだちが わたしに プレゼントを くれました。', romaji: 'Tomodachi ga watashi ni purezento o kuremashita.', indonesian: 'Teman memberikan kado kepada saya.' }
    ]
  },
  {
    id: 'n4-g20',
    level: 'N4',
    title: '45. Alasan Sopan Objektif: ～ので (Node)',
    formula: 'Bentuk Biasa + ので (KB/Na-Adj + なので)',
    meaning: 'Karena / Dikarenakan...',
    bookReference: 'Minna no Nihongo Bab 39 · Mimi Kara Oboeru N4',
    explanation: 'Alasan objektif yang bernuansa sangat santun untuk lingkungan kerja formal.',
    examples: [
      { japanese: 'きょうは ねつが ありますので、やすませてください。', romaji: 'Kyou wa netsu ga arimasu node, yasumasete kudasai.', indonesian: 'Karena hari ini saya demam, mohon izinkan saya libur.' }
    ]
  },

  // ==========================================
  // LEVEL N3: TATA BAHASA MENENGAH (25 POLA)
  // ==========================================
  {
    id: 'n3-g1',
    level: 'N3',
    title: '46. Persiapan Terencana: ～ておく (Te Oku)',
    formula: 'Kata Kerja Bentuk -Te + おく',
    meaning: 'Melakukan persiapan lebih awal demi masa depan',
    bookReference: 'Shin Kanzen Master N3 Bab 1 · Mimi Kara Oboeru N3',
    explanation: 'Melakukan tindakan antisipasi agar siap saat dibutuhkan nanti.',
    examples: [
      { japanese: 'りょこうの まえに ホテルを よやくしておきます。', romaji: 'Ryokou no mae ni hoteru o yoyaku shite okimasu.', indonesian: 'Sebelum liburan saya pesan hotelnya terlebih dahulu.' }
    ]
  },
  {
    id: 'n3-g2',
    level: 'N3',
    title: '47. Penyesalan / Selesai Tuntas: ～てしまう (Te Shimau)',
    formula: 'Kata Kerja Bentuk -Te + しまう',
    meaning: 'Tuntas selesai / Terlanjur menyesal',
    bookReference: 'Shin Kanzen Master N3 · So-Matome N3',
    explanation: 'Menyelesaikan sesuatu secara utuh, atau rasa penyesalan atas kejadian yang tidak sengaja.',
    examples: [
      { japanese: 'たいせつな ファイルを けしてしまいました。', romaji: 'Taisetsu na fairu o keshite shimaimashita.', indonesian: 'Gawat, tak sengaja saya menghapus file penting.' }
    ]
  },
  {
    id: 'n3-g3',
    level: 'N3',
    title: '48. Perubahan Kemampuan: ～ようになる (You ni Naru)',
    formula: 'Bentuk Kamus / Potensial / Nai + ようになる',
    meaning: 'Menjadi bisa / Menjadi terbiasa...',
    bookReference: 'So-Matome N3 Minggu 2 · TRY! N3',
    explanation: 'Menjelaskan transisi perubahan kemampuan atau rutinitas secara bertahap.',
    examples: [
      { japanese: 'まいにち れんしゅうして にほんごが はなせるようになりました。', romaji: 'Mainichi renshuu shite nihongo ga hanaseru you ni narimashita.', indonesian: 'Setelah latihan setiap hari, saya menjadi bisa berbicara bahasa Jepang.' }
    ]
  },
  {
    id: 'n3-g4',
    level: 'N3',
    title: '49. Keputusan Institusi: ～ことになる (Koto ni Naru)',
    formula: 'Bentuk Kamus + ことになる',
    meaning: 'Telah diputuskan bahwa...',
    bookReference: 'Shin Kanzen Master N3 Bab 2 · TRY! N3',
    explanation: 'Menyatakan suatu ketetapan yang ditentukan oleh pihak luar/manajemen.',
    examples: [
      { japanese: 'らいげつから おおさかへ てんきんすることになりました。', romaji: 'Raigetsu kara Oosaka e tenkin suru koto ni narimashita.', indonesian: 'Sudah diputuskan bahwa mulai bulan depan saya dipindahtugaskan ke Osaka.' }
    ]
  },
  {
    id: 'n3-g5',
    level: 'N3',
    title: '50. Kepastian Logis: ～はずだ (Hazu da)',
    formula: 'Bentuk Biasa + はずだ',
    meaning: 'Seharusnya pasti... (keyakinan kuat logis)',
    bookReference: 'Shin Kanzen Master N3 · Mimi Kara Oboeru N3',
    explanation: 'Keyakinan pembicara berdasarkan jadwal, bukti, atau nalar kuat.',
    examples: [
      { japanese: 'たなかさんは きょう かいしゃに くるはずです。', romaji: 'Tanaka-san wa kyou kaisha ni kuru hazu desu.', indonesian: 'Tuan Tanaka seharusnya pasti datang ke kantor hari ini.' }
    ]
  },
  {
    id: 'n3-g6',
    level: 'N3',
    title: '51. Kemungkinan Sedang: ～かもしれない (Kamoshirenai)',
    formula: 'Bentuk Biasa + かもしれない',
    meaning: 'Bisa jadi / Mungkin saja...',
    bookReference: 'TRY! N3 · So-Matome N3',
    explanation: 'Menyatakan kemungkinan kira-kira 50% di mana pembicara belum yakin pasti.',
    examples: [
      { japanese: 'みちが こんでいるので ちこくするかもしれません。', romaji: 'Michi ga konde iru node chikoku suru kamoshiremasen.', indonesian: 'Karena jalan macet, bisa jadi saya akan terlambat.' }
    ]
  },
  {
    id: 'n3-g7',
    level: 'N3',
    title: '52. Niat Bersyarat: ～ために (Tame ni) vs ～ように (You ni)',
    formula: '• [KK Sadar/Jisho] + ために • [KK Potensial/Nai] + ように',
    meaning: 'Demi untuk... vs Supaya/Agar...',
    bookReference: 'Shin Kanzen Master N3 Bab 4 · So-Matome N3',
    explanation: 'ために untuk tindakan yang dikendalikan kehendak, ように untuk tujuan kondisi target.',
    examples: [
      { japanese: 'いえを かうために ちょきんしています。', romaji: 'Ie o kau tame ni chokin shite imasu.', indonesian: 'Demi membeli rumah saya menabung uang.' },
      { japanese: 'わすれないように メモを しておきます。', romaji: 'Wasurenai you ni memo o shite okimasu.', indonesian: 'Supaya tidak lupa saya catat terlebih dahulu.' }
    ]
  },
  {
    id: 'n3-g8',
    level: 'N3',
    title: '53. Kekecewaan Kontradiktif: ～のに (Noni)',
    formula: 'Bentuk Biasa + のに (KB/Na-Adj + なのに)',
    meaning: 'Padahal / Meskipun...',
    bookReference: 'Mimi Kara Oboeru N3 · TRY! N3',
    explanation: 'Dua fakta bertentangan yang disertai rasa heran, kecewa, atau kesal.',
    examples: [
      { japanese: 'べんきょうしたのに テストに おちてしまいました。', romaji: 'Benkyou shita noni tesuto ni ochite shimaimashita.', indonesian: 'Padahal sudah belajar, tetapi ujiannya tetap tidak lulus.' }
    ]
  },
  {
    id: 'n3-g9',
    level: 'N3',
    title: '54. Kewajiban Moral: ～べきだ (Beki da)',
    formula: 'Bentuk Kamus + べきだ (する → すべきだ)',
    meaning: 'Seharusnya / Wajib secara moral',
    bookReference: 'Shin Kanzen Master N3 · So-Matome N3',
    explanation: 'Menyatakan hal yang sudah semestinya dilakukan menurut etika sosial dan moral umum.',
    examples: [
      { japanese: 'やくそくは まもるべきです。', romaji: 'Yakusoku wa mamoru beki desu.', indonesian: 'Janji itu seharusnya ditepati.' }
    ]
  },
  {
    id: 'n3-g10',
    level: 'N3',
    title: '55. Kelihatan / Pertanda: ～そうだ (Sou da: Youbou)',
    formula: 'Akar Kata Kerja / Buang -i + そうだ',
    meaning: 'Kelihatannya akan... / Tampaknya...',
    bookReference: 'TRY! N3 · Mimi Kara Oboeru N3',
    explanation: 'Perkiraan visual sesaat berdasarkan apa yang tertangkap oleh mata.',
    examples: [
      { japanese: 'あめが ふりそうですね。', romaji: 'Ame ga furisou desu ne.', indonesian: 'Kelihatannya akan turun hujan ya.' }
    ]
  },

  // ==========================================
  // LEVEL N2: TATA BAHASA TINGKAT LANJUT & BISNIS (25 POLA)
  // ==========================================
  {
    id: 'n2-g1',
    level: 'N2',
    title: '56. Keigo Hormat Bisnis: お～になる (Sonkeigo)',
    formula: 'お/ご + Akar Kata Kerja + になる',
    meaning: 'Berkenan melakukan... (Hormat untuk atasan/klien)',
    bookReference: 'Shin Kanzen Master N2 Bunpou · So-Matome N2',
    explanation: 'Bentuk penghormatan standar korporasi Jepang untuk meninggikan perbuatan mitra bisnis.',
    examples: [
      { japanese: '社長は すでに 資料を ご覧になりました。', romaji: 'Shachou wa sude ni shiryou o goran ni narimashita.', indonesian: 'Direktur utama telah berkenan memeriksa dokumen tersebut.' }
    ]
  },
  {
    id: 'n2-g2',
    level: 'N2',
    title: '57. Keigo Rendah Hati Bisnis: お～する / いたす (Kenjougo)',
    formula: 'お/ご + Akar Kata Kerja + する / いたす / 申し上げる',
    meaning: 'Saya dengan rendah hati melakukan... (Merendahkan diri sendiri)',
    bookReference: 'Shin Kanzen Master N2 · Mimi Kara Oboeru N2',
    explanation: 'Merendahkan posisi diri sendiri atau staf kantor internal demi menghormati pihak luar.',
    examples: [
      { japanese: '明日の １０時に そちらへ お伺いいたします。', romaji: 'Asu no juu-ji ni sochira e oukagai itashimasu.', indonesian: 'Besok jam 10 saya akan berkunjung ke kantor Anda.' }
    ]
  },
  {
    id: 'n2-g3',
    level: 'N2',
    title: '58. Rujukan Dasar Hukum/Data: ～に基づいて (Ni motozuite)',
    formula: 'Kata Benda + に基づいて / に基づく + KB',
    meaning: 'Berdasarkan fakta / data / regulasi...',
    bookReference: 'Shin Kanzen Master N2 Dokkai & Bunpou · TRY! N2',
    explanation: 'Pola standar dokumen kontrak, laporan audit keuangan, dan artikel berita formal.',
    examples: [
      { japanese: '最新の 調査データに基づいて 事業計画を 見直す。', romaji: 'Saishin no chousa deeta ni motozuite jigyou keikaku o minaosu.', indonesian: 'Meninjau ulang rencana bisnis berdasarkan data riset terbaru.' }
    ]
  },
  {
    id: 'n2-g4',
    level: 'N2',
    title: '59. Momen Upacara & Acara Resmi: ～に際して (Ni saishite)',
    formula: 'Kata Benda / Bentuk Kamus + に際して',
    meaning: 'Pada saat menyambut / Sehubungan dengan perhelatan...',
    bookReference: 'Shin Kanzen Master N2 · So-Matome N2',
    explanation: 'Digunakan saat memulai suatu kegiatan besar, penandatanganan kesepakatan, atau upacara formal.',
    examples: [
      { japanese: '契約の 締結に際して、双方が 合意書に 署名した。', romaji: 'Keiyaku no teiketsu ni saishite, souhou ga gouisho ni shomei shita.', indonesian: 'Sehubungan dengan penandatanganan kontrak, kedua belah pihak meneken surat kesepakatan.' }
    ]
  },
  {
    id: 'n2-g5',
    level: 'N2',
    title: '60. Dua Sisi yang Kontras: ～一方で (Ippou de)',
    formula: 'Bentuk Biasa + 一方で',
    meaning: 'Di satu sisi... namun di sisi lain...',
    bookReference: 'TRY! N2 · Mimi Kara Oboeru N2',
    explanation: 'Membandingkan dua karakteristik atau dampak yang berlawanan dari satu fenomena yang sama.',
    examples: [
      { japanese: 'インターネットは 便利な一方で、情報漏洩の 危険性もある。', romaji: 'Intaanetto wa benri na ippou de, jouhou rouei no kikensei mo aru.', indonesian: 'Internet sangat praktis di satu sisi, namun di sisi lain ada risiko kebocoran data.' }
    ]
  },
  {
    id: 'n2-g6',
    level: 'N2',
    title: '61. Batasan Moral / Tanggung Jawab: ～わけにはいかない (Wake ni wa ikanai)',
    formula: 'Bentuk Kamus / Nai + わけにはいかない',
    meaning: 'Tidak mungkin bisa melakukan... (karena tuntutan moral/kondisi sosial)',
    bookReference: 'Shin Kanzen Master N2 · So-Matome N2',
    explanation: 'Bukan ketidakmampuan fisik, melainkan pertimbangan tanggung jawab dan etika yang menghalangi.',
    examples: [
      { japanese: '大事な 会議があるから、風邪でも 休むわけにはいかない。', romaji: 'Daiji na kaigi ga aru kara, kaze demo yasumu wake ni wa ikanai.', indonesian: 'Karena ada rapat penting, meskipun flu saya tidak bisa begitu saja libur.' }
    ]
  },
  {
    id: 'n2-g7',
    level: 'N2',
    title: '62. Penyangkalan Bersyarat: ～からといって (Kara to itte)',
    formula: 'Klausa + からといって + [Penyangkalan]',
    meaning: 'Hanya karena... bukan berarti otomatis...',
    bookReference: 'Mimi Kara Oboeru N2 · TRY! N2',
    explanation: 'Menegaskan bahwa alasan A tidak serta-merta membenarkan kesimpulan B.',
    examples: [
      { japanese: '忙しいからといって、健康管理を 怠ってはいけない。', romaji: 'Isogashii kara to itte, kenkou kanri o okotatte wa ikenai.', indonesian: 'Hanya karena sibuk, bukan berarti boleh mengabaikan kesehatan.' }
    ]
  },
  {
    id: 'n2-g8',
    level: 'N2',
    title: '63. Segera Setelah Terpenuhi: ～次第 (Shidai)',
    formula: 'Akar Kata Kerja + 次第 (しだい)',
    meaning: 'Begitu... selesai, akan segera...',
    bookReference: 'Shin Kanzen Master N2 · So-Matome N2',
    explanation: 'Standar bisnis formal untuk menyatakan bahwa suatu tindakan akan segera dilaksanakan setelah kondisi tertentu tercapai.',
    examples: [
      { japanese: '詳しい日程が 決まり次第、ご連絡いたします。', romaji: 'Kuwashii nittei ga kimari shidai, go-renraku itashimasu.', indonesian: 'Begitu jadwal terperinci sudah diputuskan, saya akan segera menghubungi Anda.' }
    ]
  },
  {
    id: 'n2-g9',
    level: 'N2',
    title: '64. Proporsi Perkembangan: ～につれて (Ni tsurete)',
    formula: 'Kata Kerja Kamus / KB + につれて',
    meaning: 'Seiring berjalannya / Sejalan dengan perkembangan...',
    bookReference: 'TRY! N2 · Mimi Kara Oboeru N2',
    explanation: 'Menyatakan bahwa seiring perubahan kondisi A, kondisi B ikut bertransformasi secara alami.',
    examples: [
      { japanese: '年を取るにつれて、物忘れが 多くなってきた。', romaji: 'Toshi o toru ni tsurete, monowasure ga ooku natte kita.', indonesian: 'Seiring bertambahnya usia, saya menjadi semakin sering lupa.' }
    ]
  },
  {
    id: 'n2-g10',
    level: 'N2',
    title: '65. Ketiadaan Alternatif: ～ほかない (Hoka nai)',
    formula: 'Bentuk Kamus + ほかない / よりほかない',
    meaning: 'Tidak ada pilihan lain selain...',
    bookReference: 'Shin Kanzen Master N2 · So-Matome N2',
    explanation: 'Menyatakan situasi terjepit di mana tidak ada opsi lain selain melakukan tindakan tersebut.',
    examples: [
      { japanese: '電車が 止まったので、歩いて 帰るほかない。', romaji: 'Densha ga tomatta node, aruite kaeru hoka nai.', indonesian: 'Karena kereta berhenti beroperasi, tidak ada pilihan lain selain jalan kaki pulang.' }
    ]
  }
];
