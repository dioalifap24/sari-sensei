const fs = require('fs');

// Category translations to Japanese for the front badge
const CATEGORY_MAP_JP = {
  'Angka': '数字',
  'Uang': 'お金',
  'Buah': '果物',
  'Nama Buah': '果物',
  'Transportasi': '乗り物',
  'Kendaraan Umum': '乗り物',
  'Sehari-hari': '日常生活',
  'Kosakata Sehari-hari': '日常生活',
  'Pekerjaan': '仕事',
  'Dunia Kerja': '仕事',
  'Sapaan': '挨拶',
  'Waktu': '時間',
  'Tempat': '場所',
  'Makanan': '食べ物',
  'Keluarga': '家族',
  'Benda': '物',
  'Kata Kerja': '動詞',
  'Kata Sifat': '形容詞',
  'Kesehatan': '健康',
  'Bisnis': 'ビジネス',
  'Ekonomi': '経済',
  'Sosial': '社会',
  'Hukum': '法律',
  'Politik': '政治',
  'Budaya': '文化'
};

// Raw definitions format:
// [japanese, kana, romaji, indonesian, category, exampleJp, exampleId]

const N5_ITEMS = [
  // --- ANGKA (数字) ---
  ['一', 'いち', 'ichi', 'Satu', 'Angka', '一つください。', 'Tolong beri saya satu buah.'],
  ['二', 'に', 'ni', 'Dua', 'Angka', '二人で旅行に行きます。', 'Pergi berwisata berdua.'],
  ['三', 'さん', 'san', 'Tiga', 'Angka', '三日待ってください。', 'Tolong tunggu selama tiga hari.'],
  ['四', 'よん', 'yon', 'Empat', 'Angka', 'リンゴが四つあります。', 'Ada empat buah apel.'],
  ['五', 'ご', 'go', 'Lima', 'Angka', '五時に起きます。', 'Bangun pada jam lima.'],
  ['六', 'ろく', 'roku', 'Enam', 'Angka', '六階にあります。', 'Ada di lantai enam.'],
  ['七', 'なな', 'nana', 'Tujuh', 'Angka', '七本のペンを買いました。', 'Membeli tujuh batang pulpen.'],
  ['八', 'はち', 'hachi', 'Delapan', 'Angka', '八月は夏休みです。', 'Bulan Agustus adalah libur musim panas.'],
  ['九', 'きゅう', 'kyuu', 'Sembilan', 'Angka', '九時半に始まります。', 'Dimulai pukul sembilan lewat tiga puluh menit.'],
  ['十', 'じゅう', 'juu', 'Sepuluh', 'Angka', '十人の学生がいます。', 'Ada sepuluh orang murid.'],
  ['百', 'ひゃく', 'hyaku', 'Seratus', 'Angka', '百ページのノートです。', 'Buku catatan seratus halaman.'],
  ['千', 'せん', 'sen', 'Seribu', 'Angka', '千円札を出しました。', 'Mengeluarkan selembar uang seribu yen.'],
  ['万', 'まん', 'man', 'Sepuluh ribu', 'Angka', '一万人の観客がいます。', 'Ada sepuluh ribu orang penonton.'],
  ['一つ', 'ひとつ', 'hitotsu', 'Satu buah (satuan umum)', 'Angka', 'ケーキを一つください。', 'Tolong kue satu buah.'],
  ['二つ', 'ふたつ', 'futatsu', 'Dua buah (satuan umum)', 'Angka', 'パンを二つ買いました。', 'Membeli dua buah roti.'],
  ['三つ', 'みっつ', 'mittsu', 'Tiga buah (satuan umum)', 'Angka', '箱が三つあります。', 'Ada tiga buah kotak.'],
  ['一人', 'ひとり', 'hitori', 'Satu orang / Sendirian', 'Angka', '一人で東京へ行きます。', 'Pergi ke Tokyo sendirian.'],
  ['二人', 'ふたり', 'futari', 'Dua orang', 'Angka', '二人で食事をしました。', 'Makan berdua.'],
  ['何', 'なに', 'nani', 'Apa / Berapa', 'Angka', 'これは何ですか。', 'Ini apa?'],
  ['いくつ', 'いくつ', 'ikutsu', 'Berapa buah / Berapa usia', 'Angka', 'ミカンはいくつありますか。', 'Ada berapa buah jeruk?'],

  // --- UANG (お金) ---
  ['お金', 'おかね', 'okane', 'Uang', 'Uang', 'お金を財布に入れます。', 'Memasukkan uang ke dalam dompet.'],
  ['円', 'えん', 'en', 'Yen (mata uang Jepang)', 'Uang', 'この本は千円です。', 'Buku ini harganya seribu yen.'],
  ['百円', 'ひゃくえん', 'hyakuen', '100 Yen', 'Uang', '百円ショップで買いました。', 'Membeli di toko seratus yen.'],
  ['千円', 'せんえん', 'sen\'en', '1.000 Yen', 'Uang', '千円かかりました。', 'Menghabiskan seribu yen.'],
  ['一万円', 'いちまんえん', 'ichiman\'en', '10.000 Yen', 'Uang', '一万円を両替します。', 'Menukar uang sepuluh ribu yen.'],
  ['いくら', 'いくら', 'ikura', 'Berapa harganya', 'Uang', 'この時計はいくらですか。', 'Berapa harga jam ini?'],
  ['財布', 'さいふ', 'saifu', 'Dompet', 'Uang', '新しい財布を買いました。', 'Membeli dompet baru.'],
  ['買い物', 'かいもの', 'kaimono', 'Belanja / Berbelanja', 'Uang', 'デパートで買い物をします。', 'Berbelanja di departement store.'],
  ['店', 'みせ', 'mise', 'Toko / Kedai', 'Uang', 'あの店はとても安いです。', 'Toko itu sangat murah.'],
  ['高い', 'たかい', 'takai', 'Mahal / Tinggi', 'Uang', 'この靴は高すぎます。', 'Sepatu ini terlalu mahal.'],
  ['安い', 'やすい', 'yasui', 'Murah', 'Uang', '安くて美味しい料理です。', 'Masakan yang murah dan lezat.'],
  ['払う', 'はらう', 'harau', 'Membayar', 'Uang', 'レジでお金を払います。', 'Membayar uang di kasir.'],
  ['お釣り', 'おつり', 'otsuri', 'Uang kembalian', 'Uang', 'お釣りを忘れないでください。', 'Jangan lupa uang kembalian Anda.'],
  ['小銭', 'こぜに', 'kozeni', 'Uang koin / Uang receh', 'Uang', '小銭がたくさんあります。', 'Ada banyak uang koin.'],

  // --- NAMA BUAH (果物) ---
  ['果物', 'くだもの', 'kudamono', 'Buah-buahan', 'Nama Buah', '果物が大好きです。', 'Sangat suka buah-buahan.'],
  ['林檎', 'りんご', 'ringo', 'Apel', 'Nama Buah', '赤い林檎を食べました。', 'Makan apel merah.'],
  ['蜜柑', 'みかん', 'mikan', 'Jeruk keprok manis', 'Nama Buah', '冬に蜜柑を食べます。', 'Makan jeruk di musim dingin.'],
  ['バナナ', 'ばなな', 'banana', 'Pisang', 'Nama Buah', '朝ご飯にバナナを食べます。', 'Makan pisang untuk sarapan.'],
  ['西瓜', 'すいか', 'suika', 'Semangka', 'Nama Buah', '夏休みに西瓜を食べました。', 'Makan semangka di liburan musim panas.'],
  ['苺', 'いちご', 'ichigo', 'Stroberi', 'Nama Buah', '甘くて美味しい苺です。', 'Stroberi yang manis dan enak.'],
  ['葡萄', 'ぶどう', 'budou', 'Anggur', 'Nama Buah', '紫の葡萄を買いました。', 'Membeli anggur ungu.'],
  ['桃', 'もも', 'momo', 'Persik / Peach', 'Nama Buah', '桃はとても柔らかいです。', 'Buah persik sangat lembut.'],
  ['レモン', 'れもん', 'remon', 'Lemon', 'Nama Buah', 'レモンはとても酸っぱいです。', 'Lemon rasanya sangat asam.'],
  ['メロン', 'めろん', 'meron', 'Melon', 'Nama Buah', '高級なメロンをもらいました。', 'Mendapatkan melon kualitas tinggi.'],

  // --- KENDARAAN UMUM & TRANSPORTASI (乗り物) ---
  ['電車', 'でんしゃ', 'densha', 'Kereta listrik', 'Kendaraan Umum', '電車で学校へ通います。', 'Pergi ke sekolah naik kereta listrik.'],
  ['地下鉄', 'ちかてつ', 'chikatetsu', 'Kereta bawah tanah (MRT)', 'Kendaraan Umum', '地下鉄はとても便利です。', 'Kereta bawah tanah sangat praktis.'],
  ['新幹線', 'しんかんせん', 'shinkansen', 'Kereta peluru Shinkansen', 'Kendaraan Umum', '新幹線で京都へ行きます。', 'Pergi ke Kyoto naik Shinkansen.'],
  ['バス', 'ばす', 'basu', 'Bus umum', 'Kendaraan Umum', 'バスで駅まで行きます。', 'Pergi sampai stasiun naik bus.'],
  ['タクシー', 'たくしー', 'takushii', 'Taksi', 'Kendaraan Umum', '雨なのでタクシーに乗ります。', 'Karena hujan, naik taksi.'],
  ['飛行機', 'ひこうき', 'hikouki', 'Pesawat terbang', 'Kendaraan Umum', '飛行機で日本へ行きました。', 'Pergi ke Jepang naik pesawat.'],
  ['船', 'ふね', 'fune', 'Kapal laut', 'Kendaraan Umum', '大きな船が見えます。', 'Terlihat kapal laut yang besar.'],
  ['自転車', 'じてんしゃ', 'jitensha', 'Sepeda', 'Kendaraan Umum', '自転車でスーパーへ行きます。', 'Pergi ke supermarket naik sepeda.'],
  ['車', 'くるま', 'kuruma', 'Mobil', 'Kendaraan Umum', '父の車に乗りました。', 'Naik mobil ayah.'],
  ['駅', 'えき', 'eki', 'Stasiun kereta', 'Kendaraan Umum', '駅の前で待ち合わせします。', 'Bertemu janji di depan stasiun.'],
  ['バス停', 'ばすてい', 'basutei', 'Halte bus', 'Kendaraan Umum', 'バス停で並びます。', 'Mengantre di halte bus.'],
  ['切符', 'きっぷ', 'kippu', 'Tiket / Karcis perjalanan', 'Kendaraan Umum', '切符売り場で買いました。', 'Membeli di loket tiket.'],
  ['乗る', 'のる', 'noru', 'Naik (kendaraan)', 'Kendaraan Umum', '七時の電車に乗ります。', 'Naik kereta jam tujuh.'],
  ['降りる', 'おりる', 'oriru', 'Turun (dari kendaraan)', 'Kendaraan Umum', '次の駅で降ります。', 'Turun di stasiun berikutnya.'],

  // --- KOSAKATA DI PEKERJAAN (仕事) ---
  ['仕事', 'しごと', 'shigoto', 'Pekerjaan / Kerja', 'Pekerjaan', '今日の仕事が終わりました。', 'Pekerjaan hari ini sudah selesai.'],
  ['会社', 'かいしゃ', 'kaisha', 'Perusahaan / Kantor', 'Pekerjaan', '九時に会社へ行きます。', 'Pergi ke kantor jam sembilan.'],
  ['会社員', 'かいしゃいん', 'kaishain', 'Pegawai kantor / Karyawan', 'Pekerjaan', '兄は会社員です。', 'Kakak saya adalah pegawai kantor.'],
  ['働く', 'はたらく', 'hataraku', 'Bekerja mencari nafkah', 'Pekerjaan', '日本で働きたいです。', 'Saya ingin bekerja di Jepang.'],
  ['事務所', 'じむしょ', 'jimusho', 'Kantor kerja', 'Pekerjaan', '事務所で書類を書きます。', 'Menulis dokumen di kantor.'],
  ['先生', 'せんせい', 'sensei', 'Guru / Dokter', 'Pekerjaan', '日本語の先生に質問します。', 'Bertanya kepada guru bahasa Jepang.'],
  ['学生', 'がくせい', 'gakusei', 'Murid / Pelajar', 'Pekerjaan', '大学の学生です。', 'Mahasiswa di universitas.'],
  ['医者', 'いしゃ', 'isha', 'Dokter', 'Pekerjaan', '病院で医者に診てもらいます。', 'Diperiksa oleh dokter di rumah sakit.'],
  ['看護師', 'かんごし', 'kangoshi', 'Perawat rumah sakit', 'Pekerjaan', '親切な看護師さんです。', 'Perawat yang ramah.'],
  ['警察官', 'けいさつかん', 'keisatsukan', 'Polisi', 'Pekerjaan', '交番の警察官に道を聞きました。', 'Bertanya arah ke polisi di pos.'],
  ['銀行', 'ぎんこう', 'ginkou', 'Bank', 'Pekerjaan', '銀行でお金を下ろします。', 'Menarik uang di bank.'],
  ['銀行員', 'ぎんこういん', 'ginkouin', 'Pegawai bank', 'Pekerjaan', '母は銀行員でした。', 'Ibu dulu pegawai bank.'],
  ['店員', 'てんいん', 'ten\'in', 'Pelayan toko / Pramuniaga', 'Pekerjaan', '店員にいらっしゃいませと言われました。', 'Disapa selamat datang oleh pelayan.'],
  ['工場', 'こうじょう', 'koujou', 'Pabrik industri', 'Pekerjaan', '自動車の工場で見学します。', 'Berkunjung melihat pabrik mobil.'],

  // --- KOSAKATA SEHARI-HARI (日常生活) ---
  ['朝', 'あさ', 'asa', 'Pagi hari', 'Kosakata Sehari-hari', '毎朝六時にジョギングします。', 'Setiap pagi joging jam enam.'],
  ['昼', 'ひる', 'hiru', 'Siang hari', 'Kosakata Sehari-hari', 'お昼ご飯を一緒に食べましょう。', 'Ayo makan siang bersama.'],
  ['夜', 'よる', 'yoru', 'Malam hari', 'Kosakata Sehari-hari', '夜は早く寝ます。', 'Di malam hari tidur lebih awal.'],
  ['今日', 'きょう', 'kyou', 'Hari ini', 'Kosakata Sehari-hari', '今日はいい天気ですね。', 'Hari ini cuacanya bagus ya.'],
  ['明日', 'あした', 'ashita', 'Besok', 'Kosakata Sehari-hari', '明日は休みです。', 'Besok libur.'],
  ['昨日', 'きのう', 'kinou', 'Kemarin', 'Kosakata Sehari-hari', '昨日は図書館へ行きました。', 'Kemarin pergi ke perpustakaan.'],
  ['毎日', 'まいにち', 'mainichi', 'Setiap hari', 'Kosakata Sehari-hari', '毎日漢字を勉強します。', 'Setiap hari belajar kanji.'],
  ['今', 'いま', 'ima', 'Sekarang', 'Kosakata Sehari-hari', '今何時ですか。', 'Sekarang jam berapa?'],
  ['家', 'いえ', 'ie', 'Rumah', 'Kosakata Sehari-hari', '友達の家に遊びに行きます。', 'Pergi main ke rumah teman.'],
  ['部屋', 'へや', 'heya', 'Kamar / Ruangan', 'Kosakata Sehari-hari', '自分の部屋を掃除します。', 'Membersihkan kamar sendiri.'],
  ['ご飯', 'ごはん', 'gohan', 'Nasi / Makanan', 'Kosakata Sehari-hari', 'ご飯を食べましたか。', 'Sudah makan nasi?'],
  ['水', 'みず', 'mizu', 'Air putih dingin', 'Kosakata Sehari-hari', '冷たい水を一杯飲みます。', 'Minum segelas air dingin.'],
  ['お茶', 'おちゃ', 'ocha', 'Teh hijau Jepang', 'Kosakata Sehari-hari', '温かいお茶をどうぞ。', 'Silakan teh hangat.'],
  ['パン', 'ぱん', 'pan', 'Roti', 'Kosakata Sehari-hari', '朝はパンを食べます。', 'Pagi hari makan roti.'],
  ['肉', 'にく', 'niku', 'Daging', 'Kosakata Sehari-hari', '牛肉と豚肉を買いました。', 'Membeli daging sapi dan babi.'],
  ['魚', 'さかな', 'sakana', 'Ikan', 'Kosakata Sehari-hari', '新鮮な魚を焼きます。', 'Memanggang ikan segar.'],
  ['野菜', 'やさい', 'yasai', 'Sayuran', 'Kosakata Sehari-hari', '野菜をたくさん食べます。', 'Makan banyak sayuran.'],
  ['卵', 'たまご', 'tamago', 'Telur', 'Kosakata Sehari-hari', '卵焼きを作りました。', 'Membuat telur gulung.'],
  ['牛乳', 'ぎゅうにゅう', 'gyuunyuu', 'Susu sapi', 'Kosakata Sehari-hari', '毎朝牛乳を飲みます。', 'Setiap pagi minum susu sapi.'],
  ['食べる', 'たべる', 'taberu', 'Makan', 'Kosakata Sehari-hari', 'ラーメンを食べたいです。', 'Ingin makan ramen.'],
  ['飲む', 'のむ', 'nomu', 'Minum', 'Kosakata Sehari-hari', 'コーヒーを飲みます。', 'Minum kopi.'],
  ['起きる', 'おきる', 'okiru', 'Bangun tidur', 'Kosakata Sehari-hari', '毎朝早く起きます。', 'Setiap pagi bangun pagi.'],
  ['寝る', 'ねる', 'neru', 'Tidur', 'Kosakata Sehari-hari', '十一時に寝ます。', 'Tidur jam sebelas.'],
  ['行く', 'いく', 'iku', 'Pergi', 'Kosakata Sehari-hari', '学校へ行きます。', 'Pergi ke sekolah.'],
  ['来る', 'くる', 'kuru', 'Datang', 'Kosakata Sehari-hari', '先生が教室に来ました。', 'Guru datang ke ruang kelas.'],
  ['帰る', 'かえる', 'kaeru', 'Pulang', 'Kosakata Sehari-hari', 'うちに帰ります。', 'Pulang ke rumah.'],
  ['見る', 'みる', 'miru', 'Melihat / Menonton', 'Kosakata Sehari-hari', '映画を見ました。', 'Menonton film.'],
  ['聞く', 'きく', 'kiku', 'Mendengar / Bertanya', 'Kosakata Sehari-hari', '音楽を聞きます。', 'Mendengarkan musik.'],
  ['読む', 'よむ', 'yomu', 'Membaca', 'Kosakata Sehari-hari', '本を読みます。', 'Membaca buku.'],
  ['書く', 'かく', 'kaku', 'Menulis', 'Kosakata Sehari-hari', '手紙を書きました。', 'Menulis surat.'],
  ['話す', 'はなす', 'hanasu', 'Berbicara', 'Kosakata Sehari-hari', '日本語で話します。', 'Berbicara dengan bahasa Jepang.'],
  ['買う', 'かう', 'kau', 'Membeli', 'Kosakata Sehari-hari', '新しい靴を買いました。', 'Membeli sepatu baru.'],
  ['勉強する', 'べんきょうする', 'benkyousuru', 'Belajar', 'Kosakata Sehari-hari', '日本語を一生懸命勉強します。', 'Belajar bahasa Jepang dengan sungguh-sungguh.'],

  // --- SAPAAN & PERKENALAN (挨拶) ---
  ['おはようございます', 'おはようございます', 'ohayou gozaimasu', 'Selamat pagi', 'Sapaan', '先生、おはようございます。', 'Selamat pagi, Pak/Bu Guru.'],
  ['こんにちは', 'こんにちは', 'konnichiwa', 'Selamat siang / Halo', 'Sapaan', '皆さん、こんにちは。', 'Halo semuanya, selamat siang.'],
  ['こんばんは', 'こんばんは', 'konbanwa', 'Selamat malam', 'Sapaan', 'こんばんは、お元気ですか。', 'Selamat malam, apa kabar?'],
  ['さようなら', 'さようなら', 'sayounara', 'Selamat tinggal', 'Sapaan', '先生、さようなら。', 'Selamat tinggal, Guru.'],
  ['ありがとうございます', 'ありがとうございます', 'arigatou gozaimasu', 'Terima kasih banyak', 'Sapaan', '親切にありがとうございます。', 'Terima kasih banyak atas kebaikannya.'],
  ['すみません', 'すみません', 'sumimasen', 'Permisi / Maaf', 'Sapaan', 'すみません、駅はどこですか。', 'Permisi, stasiun ada di mana?'],
  ['はじめまして', 'はじめまして', 'hajimemashite', 'Senang bertemu dengan Anda (awal)', 'Sapaan', 'はじめまして、アリと申します。', 'Senang bertemu Anda, saya dipanggil Ari.'],
  ['どうぞよろしく', 'どうぞよろしく', 'douzo yoroshiku', 'Mohon bimbingan dan bantuannya', 'Sapaan', 'これからどうぞよろしくお願いします。', 'Mulai sekarang mohon kerja samanya.'],
  ['お願いします', 'おねがいします', 'onegaishimasu', 'Tolong / Mohon bantuannya', 'Sapaan', 'お水を一杯お願いします。', 'Tolong segelas air.'],
  ['ごちそうさま', 'ごちそうさま', 'gochisousama', 'Terima kasih atas hidangannya', 'Sapaan', '美味しかった、ごちそうさまでした。', 'Enak sekali, terima kasih hidangannya.']
];

const N4_ITEMS = [
  // --- ANGKA, SATUAN & HITUNGAN (数字・計算) ---
  ['億', 'おく', 'oku', 'Ratusan juta (100.000.000)', 'Angka', '日本の人口は一億人以上です。', 'Populasi Jepang lebih dari 100 juta jiwa.'],
  ['半分', 'はんぶん', 'hanbun', 'Setengah / Separuh', 'Angka', 'リンゴを半分に切ります。', 'Memotong apel menjadi dua bagian.'],
  ['全部', 'ぜんぶ', 'zenbu', 'Semuanya / Seluruhnya', 'Angka', '宿題を全部終わらせました。', 'Telah menyelesaikan semua PR.'],
  ['一番', 'いちばん', 'ichiban', 'Nomor satu / Paling utama', 'Angka', '日本語が一番好きです。', 'Bahasa Jepang adalah yang paling saya sukai.'],
  ['台', 'だい', 'dai', 'Satuan mesin / kendaraan', 'Angka', '車を二台持っています。', 'Memiliki dua unit mobil.'],
  ['枚', 'まい', 'mai', 'Satuan lembar / kertas / piring', 'Angka', 'シャツを三枚買いました。', 'Membeli tiga lembar kemeja.'],
  ['冊', 'さつ', 'satsu', 'Satuan jilid buku / majalah', 'Angka', '本を五冊借りました。', 'Meminjam lima jilid buku.'],
  ['匹', 'ひき', 'hiki', 'Satuan ekor hewan kecil / ikan', 'Angka', '猫が二匹います。', 'Ada dua ekor kucing.'],
  ['本', 'ほん', 'hon', 'Satuan batang / silinder / botol', 'Angka', 'ジュースを二本買いました。', 'Membeli dua botol jus.'],
  ['倍', 'ばい', 'bai', 'Kali lipat', 'Angka', '売り上げが二倍になりました。', 'Omzet penjualan menjadi dua kali lipat.'],
  ['割引き', 'わりびき', 'waribiki', 'Diskon / Potongan harga', 'Angka', '二割引で買いました。', 'Membeli dengan diskon 20%.'],
  ['半額', 'はんがく', 'hangaku', 'Setengah harga (diskon 50%)', 'Angka', '夕方になるとお弁当が半額になります。', 'Saat sore, bento menjadi setengah harga.'],

  // --- UANG & TRANSAKSI (お金・会計) ---
  ['現金', 'げんきん', 'genkin', 'Uang tunai / Cash', 'Uang', '現金でお支払いします。', 'Saya membayar dengan uang tunai.'],
  ['値段', 'ねだん', 'nedan', 'Harga suatu barang', 'Uang', '値段札を確認します。', 'Memeriksa label harga.'],
  ['定価', 'ていか', 'teika', 'Harga resmi / Harga pas pabrik', 'Uang', '定価より安く買えます。', 'Bisa membeli lebih murah dari harga pas.'],
  ['消費税', 'しょうひぜい', 'shouhizei', 'Pajak konsumsi (PPN)', 'Uang', '消費税込みの値段です。', 'Harga sudah termasuk pajak konsumsi.'],
  ['レシート', 'れしーと', 'reshiito', 'Struk belanja / Resi pembelian', 'Uang', 'レシートをもらいました。', 'Mendapatkan struk belanja.'],
  ['領収書', 'りょうしゅうしょ', 'ryoushuusho', 'Kuitansi resmi bukti pembayaran', 'Uang', '会社の領収書をお願いします。', 'Tolong buatkan kuitansi atas nama kantor.'],
  ['貯金', 'ちょきん', 'chokin', 'Tabungan simpanan uang', 'Uang', '毎月二万円貯金しています。', 'Setiap bulan menabung dua puluh ribu yen.'],
  ['給料', 'きゅうりょう', 'kyuuryou', 'Gaji / Upah bulanan', 'Uang', '二十五日は給料日です。', 'Tanggal 25 adalah hari gajian.'],
  ['会計', 'かいけい', 'kaikei', 'Pembayaran kasir / Tagihan', 'Uang', 'お会計をお願いします。', 'Tolong hitung tagihan kasirnya.'],
  ['無料', 'むりょう', 'muryou', 'Gratis tanpa biaya', 'Uang', '入場料は無料です。', 'Biaya masuk gratis.'],
  ['有料', 'ゆうりょう', 'yuuryou', 'Berbayar / Dikenakan biaya', 'Uang', 'この駐車場は有料です。', 'Tempat parkir ini berbayar.'],
  ['料金', 'りょうきん', 'ryoukin', 'Tarif ongkos / Biaya layanan', 'Uang', '利用料金を調べます。', 'Mencari tahu tarif penggunaan.'],

  // --- NAMA BUAH & HASIL BUMI (果物・農産) ---
  ['梨', 'なし', 'nashi', 'Pir Jepang manis renyah', 'Nama Buah', '秋の梨はみずみずしいです。', 'Buah pir musim gugur sangat berair dan segar.'],
  ['パイナップル', 'ぱいなっぷる', 'painappuru', 'Nanas tropis', 'Nama Buah', '甘酸っぱいパイナップルです。', 'Nanas yang manis asam menyegarkan.'],
  ['マンゴー', 'まんごー', 'mangoo', 'Mangga manis', 'Nama Buah', '沖縄のマンゴーは絶品です。', 'Mangga Okinawa sangat istimewa.'],
  ['さくらんぼ', 'さくらんぼ', 'sakuranbo', 'Buah ceri merah', 'Nama Buah', '山形のさくらんぼを食べました。', 'Makan buah ceri dari Yamagata.'],
  ['柿', 'かき', 'kaki', 'Buah kesemek manis', 'Nama Buah', '庭の木に柿が実りました。', 'Pohon di kebun berbuah kesemek.'],
  ['栗', 'くり', 'kuri', 'Kacang kastanye gurih', 'Nama Buah', '栗ご飯を作りました。', 'Membuat nasi kastanye gurih.'],
  ['グレープフルーツ', 'ぐれーぷふるーつ', 'gureepufuruutsu', 'Jeruk bali merah', 'Nama Buah', '朝にグレープフルーツジュースを飲みます。', 'Pagi hari minum jus jeruk bali merah.'],
  ['パパイヤ', 'ぱぱいや', 'papaiya', 'Pepaya tropis', 'Nama Buah', '熟したパパイヤを切ります。', 'Memotong buah pepaya yang matang.'],
  ['アボカド', 'あぼかど', 'abokado', 'Alpukat lembut', 'Nama Buah', 'アボカドサラダを作ります。', 'Membuat salad alpukat.'],
  ['キウイ', 'きうい', 'kiui', 'Buah kiwi', 'Nama Buah', 'ビタミンたっぷりのキウイです。', 'Kiwi yang kaya akan vitamin.'],

  // --- KENDARAAN UMUM & PERJALANAN (乗り物・交通) ---
  ['特急', 'とっきゅう', 'tokkyuu', 'Kereta ekspres terbatas', 'Kendaraan Umum', '特急券を買って乗りました。', 'Membeli tiket ekspres dan naik kereta.'],
  ['急行', 'きゅうこう', 'kyuukou', 'Kereta cepat', 'Kendaraan Umum', '急行電車は速いです。', 'Kereta cepat sangat laju.'],
  ['快速', 'かいそく', 'kaisoku', 'Kereta semi-cepat', 'Kendaraan Umum', '快速に乗れば早く着きます。', 'Jika naik kereta semi-cepat akan tiba lebih cepat.'],
  ['普通電車', 'ふつうでんしゃ', 'futsuudensha', 'Kereta lokal biasa (semua stasiun)', 'Kendaraan Umum', '普通電車は各駅に止まります。', 'Kereta lokal berhenti di setiap stasiun.'],
  ['定期券', 'ていきけん', 'teikiken', 'Tiket langganan komuter bulanan', 'Kendaraan Umum', '駅の窓口で定期券を更新します。', 'Memperpanjang tiket komuter di loket.'],
  ['運賃', 'うんちん', 'unchin', 'Tarif ongkos perjalanan', 'Kendaraan Umum', 'バスの運賃を払います。', 'Membayar tarif ongkos bus.'],
  ['乗り換え', 'のりかえ', 'norikae', 'Transit pindah armada kendaraan', 'Kendaraan Umum', '新宿駅で乗り換えます。', 'Pindah kereta di Stasiun Shinjuku.'],
  ['終電', 'しゅうでん', 'shuuden', 'Kereta keberangkatan terakhir', 'Kendaraan Umum', '終電に間に合いました。', 'Sempat mengejar kereta terakhir.'],
  ['始発', 'しはつ', 'shihatsu', 'Kereta keberangkatan pertama pagi', 'Kendaraan Umum', '始発電車で出発しました。', 'Berangkat dengan kereta paling pagi.'],
  ['空港', 'くうこう', 'kuukou', 'Bandar udara internasional', 'Kendaraan Umum', '成田空港へ電車で向かいます。', 'Menuju Bandara Narita naik kereta.'],
  ['便', 'びん', 'bin', 'Jadwal penerbangan pesawat', 'Kendaraan Umum', '次の便を予約しました。', 'Memesan penerbangan berikutnya.'],
  ['出発', 'しゅっぱつ', 'shuppatsu', 'Keberangkatan perjalanan', 'Kendaraan Umum', '予定通りに出発します。', 'Berangkat sesuai jadwal yang direncanakan.'],
  ['到着', 'とうちゃく', 'touchaku', 'Kedatangan di tujuan', 'Kendaraan Umum', '羽田に無事到着しました。', 'Tiba dengan selamat di Haneda.'],
  ['踏切', 'ふみきり', 'fumikiri', 'Perlintasan rel kereta api', 'Kendaraan Umum', '踏切の前で一時停止します。', 'Berhenti sejenak di depan palang perlintasan.'],
  ['渋滞', 'じゅうたい', 'juutai', 'Kemacetan lalu lintas jalan', 'Kendaraan Umum', '高速道路が渋滞しています。', 'Jalan tol sedang macet parah.'],

  // --- KOSAKATA DI PEKERJAAN (仕事・職場) ---
  ['アルバイト', 'あるばいと', 'arubaito', 'Kerja paruh waktu (part-time)', 'Pekerjaan', 'コンビニでアルバイトをしています。', 'Bekerja part-time di minimarket.'],
  ['残業', 'ざんぎょう', 'zangyou', 'Kerja lembur tambahan', 'Pekerjaan', '今日は二時間残業しました。', 'Hari ini bekerja lembur dua jam.'],
  ['会議', 'かいぎ', 'kaigi', 'Rapat / Pertemuan kantor', 'Pekerjaan', '十時から重要な会議があります。', 'Mulai jam sepuluh ada rapat penting.'],
  ['社長', 'しゃちょう', 'shachou', 'Direktur utama perusahaan', 'Pekerjaan', '社長が朝礼で挨拶しました。', 'Presiden direktur memberi sambutan di apel pagi.'],
  ['部長', 'ぶちょう', 'buchou', 'Kepala divisi / Manajer umum', 'Pekerjaan', '部長に報告書を提出しました。', 'Menyerahkan laporan ke kepala divisi.'],
  ['課長', 'かちょう', 'kachou', 'Kepala seksi / Supervisor', 'Pekerjaan', '課長に相談に乗ってもらいました。', 'Berkonsultasi dengan kepala seksi.'],
  ['同僚', 'どうりょう', 'douryou', 'Rekan kerja sekantor', 'Pekerjaan', '同僚とランチを食べました。', 'Makan siang bersama rekan kerja.'],
  ['先輩', 'せんぱい', 'senpai', 'Senior tempat kerja', 'Pekerjaan', '先輩から仕事を教わります。', 'Diajari pekerjaan oleh senior.'],
  ['後輩', 'こうはい', 'kouhai', 'Junior tempat kerja', 'Pekerjaan', '新しい後輩が入社しました。', 'Ada karyawan baru junior masuk kantor.'],
  ['面接', 'めんせつ', 'mensetsu', 'Wawancara seleksi kerja', 'Pekerjaan', '明日は採用面接です。', 'Besok adalah wawancara penerimaan kerja.'],
  ['履歴書', 'りれきしょ', 'rirekisho', 'CV / Daftar riwayat hidup', 'Pekerjaan', '写真付きの履歴書を送ります。', 'Mengirimkan CV berfoto.'],
  ['連絡', 'れんらく', 'renraku', 'Menghubungi / Kontak kabar', 'Pekerjaan', 'メールで連絡してください。', 'Tolong hubungi melalui surel/email.'],
  ['相談', 'そうだん', 'soudan', 'Berkonsultasi / Berdiskusi', 'Pekerjaan', '困ったときはすぐ相談します。', 'Saat kesulitan segera berdiskusi.'],
  ['報告', 'ほうこく', 'houkoku', 'Melaporkan hasil tugas', 'Pekerjaan', '業務の結果を報告します。', 'Melaporkan hasil pelaksanaan tugas.'],
  ['準備', 'じゅんび', 'junbi', 'Persiapan kerja', 'Pekerjaan', '会議の資料を準備します。', 'Mempersiapkan materi presentasi rapat.'],
  ['営業', 'えいぎょう', 'eigyou', 'Operasional bisnis / Penjualan', 'Pekerjaan', '営業活動で顧客を訪問します。', 'Mengunjungi klien untuk aktivitas penjualan.'],

  // --- KOSAKATA SEHARI-HARI (日常生活・家事) ---
  ['アパート', 'あぱーと', 'apaato', 'Apartemen sewa', 'Kosakata Sehari-hari', '駅から近いアパートに住んでいます。', 'Tinggal di apartemen dekat stasiun.'],
  ['マンション', 'まんしょん', 'manshon', 'Kondominium apartemen modern', 'Kosakata Sehari-hari', '高層マンションに引っ越しました。', 'Pindah ke kondominium lantai tinggi.'],
  ['掃除', 'そうじ', 'souji', 'Bersih-bersih rumah', 'Kosakata Sehari-hari', '休みの日に部屋を掃除します。', 'Membersihkan kamar pada hari libur.'],
  ['洗濯', 'せんたく', 'sentaku', 'Mencuci baju pakaian', 'Kosakata Sehari-hari', '天気がいいので洗濯します。', 'Karena cuaca bagus, mencuci pakaian.'],
  ['料理', 'りょうり', 'ryouri', 'Masakan / Memasak makanan', 'Kosakata Sehari-hari', '日本料理を作るのが好きです。', 'Saya suka memasak masakan Jepang.'],
  ['ゴミ', 'ごみ', 'gomi', 'Sampah buangan', 'Kosakata Sehari-hari', 'ゴミの分別を守りましょう。', 'Mari patuhi aturan pemilahan sampah.'],
  ['水道', 'すいどう', 'suidou', 'Saluran air ledeng bersih', 'Kosakata Sehari-hari', '水道の蛇口を閉めます。', 'Menutup keran air ledeng.'],
  ['電気', 'でんき', 'denki', 'Listrik penerangan / Lampu', 'Kosakata Sehari-hari', '部屋の電気を消して出かけます。', 'Memadamkan lampu kamar lalu berangkat.'],
  ['ガス', 'がす', 'gasu', 'Saluran gas kompor', 'Kosakata Sehari-hari', 'ガスの元栓を確認します。', 'Memeriksa katup utama tabung gas.'],
  ['お風呂', 'おふろ', 'ofuro', 'Bak mandi air hangat', 'Kosakata Sehari-hari', '温かいお風呂に入ります。', 'Berendam di bak mandi air hangat.'],
  ['薬', 'くすり', 'kusuri', 'Obat medis penyembuh', 'Kosakata Sehari-hari', '食後に薬を飲みます。', 'Minum obat medis setelah makan.'],
  ['風邪', 'かぜ', 'kaze', 'Masuk angin / Flu pilek', 'Kosakata Sehari-hari', '風邪を引いて学校を休みました。', 'Masuk angin sehingga tidak masuk sekolah.'],
  ['熱', 'ねつ', 'netsu', 'Demam panas badan', 'Kosakata Sehari-hari', '熱を測ったら三十八度ありました。', 'Saat diukur suhu tubuh demam 38 derajat.'],
  ['引っ越し', 'ひっこし', 'hikkoshi', 'Pindah tempat tinggal baru', 'Kosakata Sehari-hari', '来週新しい町へ引っ越します。', 'Minggu depan pindah ke kota baru.'],
  ['約束', 'やくそく', 'yakusoku', 'Janji / Kesepakatan pertemuan', 'Kosakata Sehari-hari', '友達との約束の時間を守ります。', 'Menepati waktu janji temu bersama kawan.']
];

const N3_ITEMS = [
  // --- ANGKA, STATISTIK & HITUNGAN (数字・統計) ---
  ['割合', 'わりあい', 'wariai', 'Rasio persentase proporsi', 'Angka', '正解の割合が高くなりました。', 'Persentase jawaban benar meningkat.'],
  ['平均', 'へいきん', 'heikin', 'Nilai rata-rata hitung', 'Angka', 'テストの平均点は七十五点でした。', 'Nilai rata-rata ujian adalah 75 poin.'],
  ['増加', 'ぞうか', 'zouka', 'Peningkatan kuantitas jumlah', 'Angka', '外国人観光客が増加しています。', 'Wisatawan mancanegara mengalami peningkatan.'],
  ['減少', 'げんしょう', 'genshou', 'Penurunan pengurangan angka', 'Angka', '人口の減少が問題になっています。', 'Penurunan angka populasi menjadi masalah.'],
  ['数量', 'すうりょう', 'suuryou', 'Kuantitas takaran jumlah fisik', 'Angka', '注文の数量を確認してください。', 'Tolong periksa kuantitas jumlah pesanan.'],
  ['単位', 'たんい', 'tan\'i', 'Satuan ukuran resmi / SKS kuliah', 'Angka', '大学で必要な単位を取得しました。', 'Meraih SKS yang diwajibkan di kampus.'],
  ['確率', 'かくりつ', 'kakuritsu', 'Probabilitas peluang kemungkinan', 'Angka', '雨が降る確率は八十パーセントです。', 'Peluang turun hujan adalah 80 persen.'],
  ['合計', 'ごうけい', 'goukei', 'Jumlah total keseluruhan', 'Angka', '三日間の合計金額を計算します。', 'Menghitung jumlah total nominal tiga hari.'],
  ['概数', 'がいすう', 'gaisuu', 'Angka taksiran kasar perkiraan', 'Angka', '概数で見積もりを出します。', 'Mengeluarkan estimasi dengan angka taksiran.'],

  // --- UANG, PERBANKAN & FINANSIAL (お金・金融) ---
  ['口座', 'こうざ', 'kouza', 'Rekening tabungan di bank', 'Uang', '銀行で新しい口座を開設しました。', 'Membuka buku rekening baru di bank.'],
  ['振込', 'ふりこみ', 'furikomi', 'Transfer pengiriman dana via bank', 'Uang', '家賃を指定の口座に振り込みます。', 'Mentransfer uang sewa rumah ke rekening yang ditunjuk.'],
  ['手数料', 'てすうりょう', 'tesuuryou', 'Biaya administrasi transaksi bank', 'Uang', '夜間のATM利用には手数料がかかります。', 'Penggunaan ATM malam hari dikenakan biaya admin.'],
  ['預金', 'よきん', 'yokin', 'Saldo simpanan tabungan bank', 'Uang', '普通預金にお金を預けます。', 'Menaruh simpanan uang di rekening giro/tabungan biasa.'],
  ['利子', 'りし', 'rishi', 'Bunga imbalan simpanan/pinjaman', 'Uang', '定期預金の利子がつきました。', 'Memperoleh bunga dari deposito berjangka.'],
  ['予算', 'よさん', 'yosan', 'Anggaran belanja proyek (budget)', 'Uang', '予算内で企画を進めます。', 'Menjalankan proyek dalam batas anggaran.'],
  ['費用', 'ひよう', 'hiyou', 'Ongkos pengeluaran operasional', 'Uang', '留学の費用を自分で準備しました。', 'Mempersiapkan sendiri biaya belajar di luar negeri.'],
  ['借金', 'しゃっきん', 'shakkin', 'Utang uang / Pinjaman dana', 'Uang', '借金をすべて返済しました。', 'Melunasi seluruh utang pinjaman uang.'],
  ['税金', 'ぜいきん', 'zeikin', 'Pajak kewajiban negara', 'Uang', '国民には税金を納める義務があります。', 'Warga negara memiliki kewajiban membayar pajak.'],
  ['節約', 'せつやく', 'setsuyaku', 'Penghematan efisiensi dana', 'Uang', '電気代を節約するために工夫します。', 'Berupaya menghemat tagihan listrik.'],
  ['請求書', 'せいきゅうしょ', 'seikyuusho', 'Surat tagihan / Faktur tagihan', 'Uang', '月末に請求書が届きます。', 'Faktur tagihan tiba di akhir bulan.'],
  ['資産', 'しさん', 'shisan', 'Harta kekayaan aset modal', 'Uang', '不動産などの資産を管理します。', 'Mengelola aset modal properti dsb.'],

  // --- BUAH & PERTANIAN (果物・農産品) ---
  ['果実', 'かじつ', 'kajitsu', 'Buah-buahan segar hasil tanaman', 'Nama Buah', '太陽を浴びて果実が実りました。', 'Tersiram mentari, buah-buahan ranum bersemi.'],
  ['収穫', 'しゅうかく', 'shuukaku', 'Panen hasil perkebunan pertanian', 'Nama Buah', '秋にはたくさんの果物を収穫します。', 'Di musim gugur memanen banyak buah-buahan.'],
  ['栽培', 'さいばい', 'saibai', 'Budi daya penanaman tanaman', 'Nama Buah', 'ハウスで温室メロンを栽培しています。', 'Membudidayakan melon rumah kaca.'],
  ['品種', 'ひんしゅ', 'hinshu', 'Varietas bibit jenis unggul', 'Nama Buah', '新しい品種のリンゴを開発しました。', 'Mengembangkan varietas apel bibit baru.'],
  ['新鮮', 'しんせん', 'shinsen', 'Kondisi segar baru dipetik', 'Nama Buah', '朝採りの新鮮な野菜と果物です。', 'Sayur dan buah segar yang dipetik pagi ini.'],
  ['完熟', 'かんじゅく', 'kanjuku', 'Matang ranum sempurna pohon', 'Nama Buah', '木で完熟した甘い桃です。', 'Buah persik manis yang matang ranum di dahan.'],
  ['糖度', 'とうど', 'toudo', 'Tingkat kadar kemanisan buah', 'Nama Buah', 'このスイカは糖度がとても高いです。', 'Semangka ini kadar kemanisannya sangat tinggi.'],
  ['産地', 'さんち', 'sanchi', 'Daerah sentra produsen penghasil', 'Nama Buah', 'ミカンの名産地を訪ねました。', 'Mengunjungi daerah sentra penghasil jeruk terkenal.'],

  // --- KENDARAAN UMUM & TRANSPORTASI (乗り物・交通) ---
  ['交通機関', 'こうつうきかん', 'koutsuukikan', 'Moda fasilitas transportasi publik', 'Kendaraan Umum', '公共の交通機関を利用しましょう。', 'Mari gunakan moda fasilitas transportasi umum.'],
  ['運行', 'うんこう', 'unkou', 'Pengoperasian jadwal perjalanan', 'Kendaraan Umum', '台風のため電車の運行が見合わされました。', 'Pengoperasian kereta ditunda karena badai topan.'],
  ['遅延', 'ちえん', 'chien', 'Keterlambatan jadwal perjalanan (delay)', 'Kendaraan Umum', '電車の遅延証明書をもらいました。', 'Mendapatkan surat keterangan resmi delay kereta.'],
  ['ダイヤ', 'だいや', 'daiya', 'Jadwal jadwal perjalanan kereta/bus', 'Kendaraan Umum', '春のダイヤ改正が行われます。', 'Diberlakukan penyesuaian jadwal kereta musim semi.'],
  ['車掌', 'しゃしょう', 'shashou', 'Kondektur pemeriksa tiket kereta', 'Kendaraan Umum', '車掌が車内アナウンスをしています。', 'Kondektur memberikan pengumuman di gerbong.'],
  ['運転手', 'うんてんしゅ', 'untenshu', 'Sopir pengemudi armada bus/truk', 'Kendaraan Umum', 'バスの運転手さんが安全運転を心がけます。', 'Sopir bus mengutamakan keselamatan berkendara.'],
  ['高速道路', 'こうそくどうろ', 'kousokudouro', 'Jalan tol bebas hambatan', 'Kendaraan Umum', '高速道路を使って短時間で移動します。', 'Bepergian singkat lewat jalan tol.'],
  ['フェリー', 'ふぇりー', 'ferii', 'Kapal feri penyeberangan laut', 'Kendaraan Umum', '車ごとフェリーに乗って島へ渡ります。', 'Membawa mobil menyeberang pulau naik feri.'],
  ['乗客', 'じょうきゃく', 'joukyaku', 'Penumpang pengguna jasa angkutan', 'Kendaraan Umum', '多くの乗客がホームで待っています。', 'Banyak penumpang menunggu di peron stasiun.'],
  ['路線', 'ろせん', 'rosen', 'Trayek rute jalur transportasi', 'Kendaraan Umum', '地下鉄の新しい路線が開通しました。', 'Rute jalur bawah tanah baru telah diresmikan.'],

  // --- KOSAKATA DI PEKERJAAN (仕事・ビジネス) ---
  ['担当', 'たんとう', 'tantou', 'Penanggung jawab tugas (PIC)', 'Pekerjaan', 'このプロジェクトの担当者です。', 'Orang yang bertanggung jawab atas proyek ini.'],
  ['責任', 'せきにん', 'sekinin', 'Tanggung jawab kewajiban moral', 'Pekerjaan', '自分の仕事に責任を持ちます。', 'Memiliki tanggung jawab terhadap tugas sendiri.'],
  ['研修', 'けんしゅう', 'kenshuu', 'Pelatihan kerja / Training dinas', 'Pekerjaan', '新入社員向けの研修を受けました。', 'Mengikuti pelatihan untuk karyawan baru.'],
  ['昇給', 'しょうきゅう', 'shoukyuu', 'Kenaikan upah penghasilan gaji', 'Pekerjaan', '業績に応じて昇給が決まります。', 'Kenaikan gaji ditentukan sesuai performa kerja.'],
  ['昇進', 'しょうしん', 'shoushin', 'Promosi kenaikan jenjang jabatan', 'Pekerjaan', '先輩が課長に昇進しました。', 'Senior dipromosikan menjadi kepala seksi.'],
  ['定時', 'ていじ', 'teiji', 'Jam kerja standar tepat waktu', 'Pekerjaan', '今日は定時で退社します。', 'Hari ini pulang tepat pada akhir jam kerja.'],
  ['有給休暇', 'ゆうきゅうきゅうか', 'yuukyuukyuuka', 'Cuti kerja tahunan tetap dibayar', 'Pekerjaan', '有給休暇を取得して旅行に行きます。', 'Mengambil cuti berbayar untuk berlibur.'],
  ['取引先', 'とりひきさき', 'torihikisaki', 'Mitra relasi klien bisnis rekanan', 'Pekerjaan', '大事な取引先へ挨拶に伺います。', 'Berkunjung memberi salam ke mitra bisnis penting.'],
  ['企画', 'きかく', 'kikaku', 'Perencanaan rancangan konsep proyek', 'Pekerjaan', '新しい商品の企画書を作成しました。', 'Menyusun proposal perencanaan produk baru.'],
  ['開発', 'かいはつ', 'kaihatsu', 'Pengembangan produk riset inovasi', 'Pekerjaan', '最新技術の開発に取り組みます。', 'Bekerja mengembangkan teknologi terkini.'],
  ['製造', 'せいぞう', 'seizou', 'Manufaktur proses pembuatan pabrik', 'Pekerjaan', '国内の工場で製品を製造します。', 'Memproduksi barang di pabrik dalam negeri.'],
  ['契約', 'けいやく', 'keiyaku', 'Kontrak akad kesepakatan tertulis', 'Pekerjaan', '正式に契約を結びました。', 'Menandatangani kontrak secara resmi.'],
  ['書類', 'しょるい', 'shorui', 'Berkas dokumen resmi tertulis', 'Pekerjaan', '必要書類に署名と捺印をします。', 'Membubuhi tanda tangan dan stempel di dokumen.'],
  ['出張', 'しゅっちょう', 'shucchou', 'Perjalanan dinas dinas luar kota', 'Pekerjaan', '来週大阪へ三日間出張します。', 'Minggu depan dinas tiga hari ke Osaka.'],
  ['退職', 'たいしょく', 'taishoku', 'Pensiun / Berhenti dari pekerjaan', 'Pekerjaan', '定年で退職する上司を送別します。', 'Melepas atasan yang pensiun karena purnabakti.'],

  // --- KOSAKATA SEHARI-HARI (日常生活・地域) ---
  ['環境', 'かんきょう', 'kankyou', 'Lingkungan hidup alam sekitar', 'Kosakata Sehari-hari', '自然環境を守る取り組みをします。', 'Melakukan upaya menjaga kelestarian lingkungan hidup.'],
  ['分別', 'ぶんべつ', 'bunbetsu', 'Pemilahan klasifikasi kategori sampah', 'Kosakata Sehari-hari', '燃えるゴミと不燃ゴミを分別します。', 'Memilah sampah organik dan non-organik.'],
  ['資源', 'しげん', 'shigen', 'Sumber daya material daur ulang', 'Kosakata Sehari-hari', '空き缶はリサイクル資源です。', 'Kaleng bekas merupakan sumber daya daur ulang.'],
  ['近所', 'きんじょ', 'kinjo', 'Lingkungan tetangga sekitar rumah', 'Kosakata Sehari-hari', '近所の人と笑顔で挨拶を交わします。', 'Saling bertukar salam senyum dengan tetangga.'],
  ['防犯', 'ぼうはん', 'bouhan', 'Pencegahan tindak kejahatan kriminal', 'Kosakata Sehari-hari', '町内会で防犯パトロールを行います。', 'Mengadakan patroli kamtibmas di perumahan.'],
  ['宅配', 'たくはい', 'takuhai', 'Layanan jasa pengantaran paket kurir', 'Kosakata Sehari-hari', '宅配便で荷物が届きました。', 'Paket kiriman tiba melalui jasa kurir pengiriman.'],
  ['配達', 'はいたつ', 'haitatsu', 'Pengiriman barang pesanan ke alamat', 'Kosakata Sehari-hari', 'ピザの配達を注文しました。', 'Memesan layanan antar pizza ke rumah.'],
  ['故障', 'こしょう', 'koshou', 'Kerusakan gangguan mekanis mesin', 'Kosakata Sehari-hari', 'エアコンが故障して動きません。', 'AC rusak dan tidak mau menyala.'],
  ['修理', 'しゅうり', 'shuuri', 'Perbaikan pembenahan servis alat', 'Kosakata Sehari-hari', '自転車のパンクを修理してもらいました。', 'Meminta tambal ban sepeda yang bocor.']
];

const N2_ITEMS = [
  // --- ANALISIS ANGKA & INDIKATOR DATA (数字・指標) ---
  ['推移', 'すいい', 'suii', 'Dinamika pergerakan tren berkala', 'Angka', '景気の推移を慎重に見守ります。', 'Mengamati pergerakan iklim ekonomi secara saksama.'],
  ['統計', 'とうけい', 'toukei', 'Data statistik agregat resmi', 'Angka', '政府の統計調査データを分析します。', 'Menganalisis data survei statistik pemerintah.'],
  ['指数', 'しすう', 'shisuu', 'Angka indeks tolok ukur acuan', 'Angka', '消費者物価指数が上昇しました。', 'Indeks harga konsumen mengalami kenaikan.'],
  ['激増', 'げきぞう', 'gekizou', 'Lonjakan peningkatan drastis tajam', 'Angka', '注文が激増して対応に追われます。', 'Pesanan melonjak tajam hingga sibuk menanganinya.'],
  ['激減', 'げきげん', 'gekigen', 'Penurunan anjlok amat tajam', 'Angka', '売上が激減し危機感を持ちます。', 'Penjualan anjlok drastis sehingga memicu kewaspadaan.'],
  ['膨大', 'ぼうだい', 'boudai', 'Volume kuantitas luar biasa masif', 'Angka', '膨大なデータを処理するシステムです。', 'Sistem yang memproses volume data raksasa.'],
  ['微量', 'びりょう', 'biryou', 'Kuantitas amat sedikit / Mikro', 'Angka', '微量の添加物も検査で検出されます。', 'Zat aditif kadar mikro pun terdeteksi dalam tes.'],
  ['比例', 'ひれい', 'hirei', 'Perbandingan proporsional sebanding', 'Angka', '努力に比例して成果が現れます。', 'Hasil nyata muncul sebanding dengan usaha keras.'],
  ['概算', 'がいさん', 'gaisan', 'Kalkulasi perhitungan kasar estimasi', 'Angka', '工事費用の概算書を提出します。', 'Menyerahkan surat estimasi biaya konstruksi.'],

  // --- EKONOMI, KEUANGAN & MONETER (お金・金融経済) ---
  ['為替', 'かわせ', 'kawase', 'Kurs pertukaran valuta mata uang asing', 'Uang', '為替相場の変動により損益が出ます。', 'Muncul untung-rugi akibat fluktuasi kurs mata uang.'],
  ['株価', 'かぶか', 'kabuka', 'Indeks nilai lembar harga saham', 'Uang', '市場の株価が過去最高を更新しました。', 'Indeks saham di pasar menembus rekor tertinggi.'],
  ['投資', 'とうし', 'toushi', 'Penanaman modal investasi riil', 'Uang', '新興企業への投資を拡大します。', 'Memperluas investasi ke perusahaan rintisan.'],
  ['融資', 'ゆうし', 'yuushi', 'Penyaluran pembiayaan pinjaman bank', 'Uang', '事業拡大のため銀行から融資を受けます。', 'Menerima kredit modal kerja dari bank untuk ekspansi.'],
  ['資金', 'しきん', 'shikin', 'Dana likuiditas modal usaha', 'Uang', '研究開発のための資金を調達します。', 'Menggalang ketersediaan dana bagi riset dan pengembangan.'],
  ['倒産', 'とうさん', 'tousan', 'Kebangkrutan kepailitan badan usaha', 'Uang', '大手旅行会社が突然倒産しました。', 'Biro perjalanan besar mendadak mengalami kepailitan.'],
  ['不況', 'ふきょう', 'fukyou', 'Kondisi resesi kelesuan pasar', 'Uang', '不況を乗り越えるための経営戦略です。', 'Strategi manajemen untuk melalui masa resesi pasar.'],
  ['好況', 'こうきょう', 'koukyou', 'Fase ledakan pertumbuhan ekonomi cerah', 'Uang', '好況期に利益を蓄積しておきます。', 'Menyimpan akumulasi laba di masa ekspansi ekonomi.'],
  ['物価', 'ぶっか', 'bukka', 'Taraf tingkat harga komoditas umum', 'Uang', '物価の高騰が生活を圧迫しています。', 'Kenaikan taraf harga barang menekan biaya hidup.'],
  ['決算', 'けっさん', 'kessan', 'Tutup buku pelaporan audit keuangan', 'Uang', '年度末の決算報告書を作成します。', 'Menyusun laporan tutup buku audit akhir tahun fiskal.'],
  ['財政', 'ざいせい', 'zaisei', 'Keuangan kas perbendaharaan negara', 'Uang', '国家の財政再建に向けた改革です。', 'Reformasi terarah demi pemulihan kas fiskal negara.'],
  ['債務', 'さいむ', 'saimu', 'Liabilitas kewajiban beban utang piutang', 'Uang', '多額の債務を整理する計画を立てます。', 'Menyusun skema restrukturisasi beban utang bernilai besar.'],

  // --- PERKEBUNAN BUAH & AGRIBISNIS (果樹・農産流通) ---
  ['果樹園', 'かじゅえん', 'kajuen', 'Perkebunan ladang budi daya buah', 'Nama Buah', '広大な果樹園でリンゴ狩りを体験します。', 'Mencoba wisata petik apel di kebun buah yang luas.'],
  ['農作物', 'のうさくぶつ', 'nousakubutsu', 'Komoditas hasil tanaman pangan tani', 'Nama Buah', '天候不良で農作物に被害が出ました。', 'Cuaca buruk menimbulkan kerusakan pada hasil panen tani.'],
  ['食料自給率', 'しょくりょうじきゅうりつ', 'shokuryoujikyuuritsu', 'Tingkat rasio swasembada pangan nasional', 'Nama Buah', '国内の食料自給率を引き上げる政策です。', 'Kebijakan peningkatan rasio kemandirian pangan nasional.'],
  ['卸売', 'おろしうり', 'oroshiuri', 'Penjualan partai besar / Grosir', 'Nama Buah', '卸売市場から新鮮な果物を仕入れます。', 'Membeli pasokan buah segar dari pasar induk grosir.'],
  ['小売', 'こうり', 'kouri', 'Penjualan eceran retail langsung', 'Nama Buah', '小売店舗での販売価格を設定します。', 'Menetapkan harga eceran di gerai retail konsumen.'],
  ['輸出', 'ゆしゅつ', 'yushutsu', 'Ekspor komoditas ke pasar mancanegara', 'Nama Buah', '日本の高品質な果物を海外へ輸出します。', 'Mengekspor buah-buahan kualitas prima Jepang ke luar negeri.'],
  ['輸入', 'ゆにゅう', 'yunyuu', 'Impor komoditas bahan luar negeri', 'Nama Buah', '南国の果物を大量に輸入しています。', 'Mengimpor komoditas buah tropis dalam jumlah besar.'],
  ['有機栽培', 'ゆうきさいばい', 'yuukisaibai', 'Budi daya pertanian organik alami', 'Nama Buah', '農薬を使わない有機栽培の作物を買います。', 'Membeli hasil pertanian organik tanpa pestisida kimia.'],

  // --- LOGISTIK, TRANSPORTASI & INFRASTRUKTUR (交通・物流) ---
  ['物流', 'ぶつりゅう', 'butsuryuu', 'Arus distribusi pasokan logistik kargo', 'Kendaraan Umum', '効率的な物流ネットワークを構築します。', 'Membangun jaringan rantai logistik distribusi yang efisien.'],
  ['輸送', 'ゆそう', 'yusou', 'Pengangkutan transportasi armada muatan', 'Kendaraan Umum', '海上輸送で大量の物資を運びます。', 'Mengangkut kargo logistik masif melalui jalur laut.'],
  ['運搬', 'うんぱん', 'unpan', 'Pemindahan angkutan barang fisik', 'Kendaraan Umum', '重い機械を専用トラックで運搬します。', 'Mengangkut alat berat menggunakan truk angkutan khusus.'],
  ['定期便', 'ていきびん', 'teikibin', 'Penerbangan / Pelayaran berjadwal rutin', 'Kendaraan Umum', '主要都市を結ぶ定期便が増便されました。', 'Penerbangan reguler penghubung kota utama ditambah armadanya.'],
  ['航空会社', 'こうくうかいしゃ', 'koukuukaisha', 'Perusahaan maskapai penerbangan', 'Kendaraan Umum', '大手航空会社の安全基準を遵守します。', 'Mematuhi standar kelaikan terbang maskapai penerbangan.'],
  ['軌道', 'きどう', 'kidou', 'Lintasan jalur rel perkeretaapian', 'Kendaraan Umum', '新型車両が軌道の上を滑らかに走ります。', 'Rangkaian gerbong anyar melaju mulus di atas rel perlintasan.'],
  ['船舶', 'せんぱく', 'senpaku', 'Armada kapal laut niaga komersial', 'Kendaraan Umum', '大型船舶が港に停泊しています。', 'Kapal komersial berbobot besar bersandar di pelabuhan.'],
  ['交通網', 'こうつうもう', 'koutsuumou', 'Jaringan interkoneksi lalu lintas jalan', 'Kendaraan Umum', '全国を網羅する高速交通網の整備です。', 'Pengembangan jaringan transportasi cepat terpadu lintas negeri.'],
  ['渋滞緩和', 'じゅうたいかんわ', 'juutaikanwa', 'Peredaan penguraian kemacetan jalan', 'Kendaraan Umum', 'バイパス開通により渋滞緩和が期待されます。', 'Diharapkan jalan lingkar baru dapat meredakan kemacetan.'],

  // --- MANAJEMEN KORPORASI & KETENAGAKERJAAN (企業経営・労働) ---
  ['経営', 'けいえい', 'keiei', 'Tata kelola korporasi kepengurusan', 'Pekerjaan', '企業の経営方針を新たに策定します。', 'Merumuskan arah pedoman manajemen perusahaan yang baru.'],
  ['役員', 'やくいん', 'yakuin', 'Dewan direksi jajaran komisaris', 'Pekerjaan', '取締役会の役員が全員出席しました。', 'Seluruh jajaran dewan direksi hadir di rapat pleno.'],
  ['雇用', 'こよう', 'koyou', 'Penyediaan hubungan kerja ketenagakerjaan', 'Pekerjaan', '雇用の安定と創出を最優先します。', 'Memprioritaskan stabilitas serta penciptaan lapangan kerja.'],
  ['採用', 'さいよう', 'saiyou', 'Perekrutan penerimaan pegawai baru', 'Pekerjaan', '優秀な人材を積極的に採用します。', 'Merekrut bibit talenta unggul secara proaktif.'],
  ['解雇', 'かいこ', 'kaiko', 'Pemutusan hubungan kerja (PHK)', 'Pekerjaan', '不当な理由による解雇は法的に無効です。', 'PHK tanpa landasan hukum sah batal demi hukum.'],
  ['賃金', 'ちんぎん', 'chingin', 'Remunerasi sistem upah kompensasi kerja', 'Pekerjaan', '最低賃金の引き上げが決定しました。', 'Telah ditetapkan kenaikan upah minimum regional.'],
  ['福利厚生', 'ふくりこうせい', 'fukruikousei', 'Fasilitas jaminan kesejahteraan karyawan', 'Pekerjaan', '充実した福利厚生制度が自慢です。', 'Membanggakan fasilitas jaminan kesejahteraan staf yang prima.'],
  ['交渉', 'こうしょう', 'koushou', 'Perundingan negosiasi klausul kontrak', 'Pekerjaan', '取引条件について粘り強く交渉します。', 'Bernegosiasi secara ulet mengenai klausul transaksi kerja.'],
  ['提携', 'ていけい', 'teikei', 'Aliansi kemitraan strategis bisnis', 'Pekerjaan', '海外企業との業務提携を発表しました。', 'Mengumumkan aliansi kemitraan strategis dengan korporasi asing.'],
  ['業績', 'ぎょうせき', 'gyouseki', 'Kinerja performa pencapaian omzet kerja', 'Pekerjaan', '新製品のヒットで業績が急回復しました。', 'Performa bisnis pulih drastis berkat suksesnya produk baru.'],
  ['人事', 'じんじ', 'jinji', 'Manajemen SDM urusan personalia (HRD)', 'Pekerjaan', '春の人事異動で新しい部署に配属されました。', 'Ditugaskan ke divisi baru saat rotasi mutasi personalia musim semi.'],

  // --- KEHIDUPAN MASYARAKAT & HUKUM (社会生活・公共) ---
  ['住民票', 'じゅうみんひょう', 'juuminhyou', 'Surat keterangan domisili kependudukan', 'Kosakata Sehari-hari', '市役所で住民票の写しを取得します。', 'Mengurus salinan surat domisili kependudukan di balai kota.'],
  ['年金', 'ねんきん', 'nenkin', 'Jaminan simpanan dana pensiun hari tua', 'Kosakata Sehari-hari', '国民年金の保険料を納付します。', 'Membayar iuran jaminan dana pensiun hari tua.'],
  ['保険', 'ほけん', 'hoken', 'Polis jaminan asuransi perlindungan', 'Kosakata Sehari-hari', '健康保険証を病院の窓口に提示します。', 'Menunjukkan kartu asuransi kesehatan di loket rumah sakit.'],
  ['裁判', 'さいばん', 'saiban', 'Persidangan meja hijau pengadilan yuridis', 'Kosakata Sehari-hari', '公平な裁判を受ける権利が保障されています。', 'Hak memperoleh peradilan hukum yang adil dijamin konstitusi.'],
  ['訴訟', 'そしょう', 'soshou', 'Pengajuan gugatan perkara hukum yuridis', 'Kosakata Sehari-hari', '損害賠償を求めて訴訟を起こしました。', 'Mengajukan gugatan hukum ganti rugi materiil.'],
  ['治安', 'ちあん', 'chian', 'Ketertiban ketenteraman keamanan publik', 'Kosakata Sehari-hari', 'この地域は治安が良好で住みやすいです。', 'Kawasan ini memiliki stabilitas keamanan baik dan nyaman dihuni.'],
  ['防災', 'ぼうさい', 'bousai', 'Mitigasi penanggulangan risiko bencana alam', 'Kosakata Sehari-hari', '地域の防災訓練に家族で参加しました。', 'Ikut latihan mitigasi bencana lingkungan bersama keluarga.'],
  ['避難', 'ひなん', 'hinan', 'Evakuasi penyelamatan diri kondisi darurat', 'Kosakata Sehari-hari', '警報が出たら直ちに高台へ避難します。', 'Segera evakuasi ke tempat tinggi jika peringatan bahaya berbunyi.']
];

// Helper to assemble final cards array
function buildDeck(items, level, startId) {
  let idCounter = startId;
  const seenJapanese = new Set();
  const deck = [];

  for (const item of items) {
    const [japanese, kana, romaji, indonesian, category, exampleJp, exampleId] = item;
    
    // Safety deduplication check
    if (seenJapanese.has(japanese)) {
      console.warn(`Duplicate skipped in ${level}: ${japanese}`);
      continue;
    }
    seenJapanese.add(japanese);

    deck.push({
      id: idCounter++,
      level: level,
      japanese: japanese,
      kana: kana,
      romaji: romaji,
      reading: romaji, // Backwards compatibility for components accessing .reading
      indonesian: indonesian,
      category: category,
      categoryJp: CATEGORY_MAP_JP[category] || '単語',
      example: exampleJp,
      exampleIndonesian: exampleId
    });
  }

  return deck;
}

const deckN5 = buildDeck(N5_ITEMS, 'N5', 1);
const deckN4 = buildDeck(N4_ITEMS, 'N4', 201);
const deckN3 = buildDeck(N3_ITEMS, 'N3', 401);
const deckN2 = buildDeck(N2_ITEMS, 'N2', 701);

console.log(`Generated: N5=${deckN5.length}, N4=${deckN4.length}, N3=${deckN3.length}, N2=${deckN2.length}, Total=${deckN5.length + deckN4.length + deckN3.length + deckN2.length}`);

// Output code to src/data/vocabData.ts
const fileHeader = `import { VocabCard, JLPTLevel } from '../types';

/**
 * =======================================================================
 * DATA KOSAKATA / KOTOBA RESMI STANDAR JLPT (N5 - N2)
 * Disusun lengkap & orisinil tanpa duplikat:
 * 1. Angka (数字)
 * 2. Uang & Transaksi (お金)
 * 3. Nama Buah (果物)
 * 4. Kendaraan Umum & Transportasi (乗り物・交通)
 * 5. Kosakata Sehari-hari (日常生活)
 * 6. Kosakata di Pekerjaan (仕事・ビジネス)
 * 7. Sapaan & Waktu Standar Resmi
 * =======================================================================
 */

`;

const fileContent = fileHeader + 
  `export const VOCAB_N5: VocabCard[] = ${JSON.stringify(deckN5, null, 2)};\n\n` +
  `export const VOCAB_N4: VocabCard[] = ${JSON.stringify(deckN4, null, 2)};\n\n` +
  `export const VOCAB_N3: VocabCard[] = ${JSON.stringify(deckN3, null, 2)};\n\n` +
  `export const VOCAB_N2: VocabCard[] = ${JSON.stringify(deckN2, null, 2)};\n\n` +
  `export const ALL_VOCAB: Record<JLPTLevel, VocabCard[]> = {\n` +
  `  N5: VOCAB_N5,\n` +
  `  N4: VOCAB_N4,\n` +
  `  N3: VOCAB_N3,\n` +
  `  N2: VOCAB_N2,\n` +
  `};\n`;

fs.writeFileSync('src/data/vocabData.ts', fileContent, 'utf-8');
console.log('Successfully wrote src/data/vocabData.ts');
