const fs = require('fs');

const CATEGORY_MAP_JP = {
  'Angka': '数字',
  'Uang': 'お金',
  'Kosakata Sehari-hari': '日常生活',
  'Pekerjaan': '仕事',
  'Nama Buah': '果物',
  'Kendaraan Umum': '乗り物',
  'Sapaan': '挨拶',
  'Waktu': '時間'
};

// ==========================================
// LEVEL N5 (110 KARTU LENGKAP TERURUT RESMI)
// ==========================================
const N5_RAW = [
  // 1. ANGKA (数字)
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
  ['一日', 'ついたち', 'tsuitachi', 'Tanggal satu (awal bulan)', 'Angka', '五月一日は祝日です。', 'Tanggal satu Mei adalah hari libur.'],
  ['二日', 'ふつか', 'futsuka', 'Tanggal dua / Dua hari', 'Angka', '二日間休みます。', 'Beristirahat selama dua hari.'],
  ['三日', 'みっか', 'mikka', 'Tanggal tiga / Tiga hari', 'Angka', '三日後に会いましょう。', 'Mari bertemu tiga hari lagi.'],
  ['何', 'なに', 'nani', 'Apa / Berapa', 'Angka', 'これは何ですか。', 'Ini apa?'],
  ['いくつ', 'いくつ', 'ikutsu', 'Berapa buah / Berapa usia', 'Angka', 'ミカンはいくつありますか。', 'Ada berapa buah jeruk?'],

  // 2. UANG (お金)
  ['お金', 'おかね', 'okane', 'Uang', 'Uang', 'お金を財布に入れます。', 'Memasukkan uang ke dalam dompet.'],
  ['円', 'えん', 'en', 'Yen (mata uang resmi Jepang)', 'Uang', 'この本は千円です。', 'Buku ini harganya seribu yen.'],
  ['百円', 'ひゃくえん', 'hyakuen', '100 Yen', 'Uang', '百円ショップで買いました。', 'Membeli di toko seratus yen.'],
  ['千円', 'せんえん', 'sen\'en', '1.000 Yen', 'Uang', '千円かかりました。', 'Menghabiskan seribu yen.'],
  ['一万円', 'いちまんえん', 'ichiman\'en', '10.000 Yen', 'Uang', '一万円を両替します。', 'Menukar uang sepuluh ribu yen.'],
  ['いくら', 'いくら', 'ikura', 'Berapa harganya', 'Uang', 'この時計はいくらですか。', 'Berapa harga jam ini?'],
  ['財布', 'さいふ', 'saifu', 'Dompet uang', 'Uang', '新しい財布を買いました。', 'Membeli dompet baru.'],
  ['買い物', 'かいもの', 'kaimono', 'Belanja / Berbelanja', 'Uang', 'デパートで買い物をします。', 'Berbelanja di departement store.'],
  ['店', 'みせ', 'mise', 'Toko / Kedai', 'Uang', 'あの店はとても安いです。', 'Toko itu sangat murah.'],
  ['高い', 'たかい', 'takai', 'Mahal harganya / Tinggi', 'Uang', 'この靴は高すぎます。', 'Sepatu ini terlalu mahal.'],
  ['安い', 'やすい', 'yasui', 'Murah harganya', 'Uang', '安くて美味しい料理です。', 'Masakan yang murah dan lezat.'],
  ['払う', 'はらう', 'harau', 'Membayar uang', 'Uang', 'レジでお金を払います。', 'Membayar uang di kasir.'],
  ['お釣り', 'おつり', 'otsuri', 'Uang kembalian belanja', 'Uang', 'お釣りを忘れないでください。', 'Jangan lupa uang kembalian Anda.'],
  ['小銭', 'こぜに', 'kozeni', 'Uang receh / Koin', 'Uang', '小銭がたくさんあります。', 'Ada banyak uang koin.'],
  ['売る', 'うる', 'uru', 'Menjual barang dagangan', 'Uang', '古い本を店で売りました。', 'Menjual buku lama di toko.'],

  // 3. KOSAKATA SEHARI-HARI (日常生活)
  ['朝', 'あさ', 'asa', 'Pagi hari', 'Kosakata Sehari-hari', '毎朝六時にジョギングします。', 'Setiap pagi joging jam enam.'],
  ['昼', 'ひる', 'hiru', 'Siang hari', 'Kosakata Sehari-hari', 'お昼ご飯を一緒に食べましょう。', 'Ayo makan siang bersama.'],
  ['夜', 'よる', 'yoru', 'Malam hari', 'Kosakata Sehari-hari', '夜は早く寝ます。', 'Di malam hari tidur lebih awal.'],
  ['今日', 'きょう', 'kyou', 'Hari ini', 'Kosakata Sehari-hari', '今日はいい天気ですね。', 'Hari ini cuacanya bagus ya.'],
  ['明日', 'あした', 'ashita', 'Besok', 'Kosakata Sehari-hari', '明日は休みです。', 'Besok libur.'],
  ['昨日', 'きのう', 'kinou', 'Kemarin', 'Kosakata Sehari-hari', '昨日は図書館へ行きました。', 'Kemarin pergi ke perpustakaan.'],
  ['毎日', 'まいにち', 'mainichi', 'Setiap hari', 'Kosakata Sehari-hari', '毎日漢字を勉強します。', 'Setiap hari belajar kanji.'],
  ['今', 'いま', 'ima', 'Sekarang / Saat ini', 'Kosakata Sehari-hari', '今何時ですか。', 'Sekarang jam berapa?'],
  ['家', 'いえ', 'ie', 'Rumah tempat tinggal', 'Kosakata Sehari-hari', '友達の家に遊びに行きます。', 'Pergi main ke rumah teman.'],
  ['部屋', 'へや', 'heya', 'Kamar / Ruangan', 'Kosakata Sehari-hari', '自分の部屋を掃除します。', 'Membersihkan kamar sendiri.'],
  ['ご飯', 'ごはん', 'gohan', 'Nasi putih / Makanan hidangan', 'Kosakata Sehari-hari', 'ご飯を食べましたか。', 'Sudah makan nasi?'],
  ['水', 'みず', 'mizu', 'Air putih dingin segar', 'Kosakata Sehari-hari', '冷たい水を一杯飲みます。', 'Minum segelas air dingin.'],
  ['お茶', 'おちゃ', 'ocha', 'Teh hijau khas Jepang', 'Kosakata Sehari-hari', '温かいお茶をどうぞ。', 'Silakan teh hangat.'],
  ['パン', 'ぱん', 'pan', 'Roti gandum', 'Kosakata Sehari-hari', '朝はパンを食べます。', 'Pagi hari makan roti.'],
  ['肉', 'にく', 'niku', 'Daging', 'Kosakata Sehari-hari', '牛肉と豚肉を買いました。', 'Membeli daging sapi dan babi.'],
  ['魚', 'さかな', 'sakana', 'Ikan segar', 'Kosakata Sehari-hari', '新鮮な魚を焼きます。', 'Memanggang ikan segar.'],
  ['野菜', 'やさい', 'yasai', 'Sayuran segar', 'Kosakata Sehari-hari', '野菜をたくさん食べます。', 'Makan banyak sayuran.'],
  ['卵', 'たまご', 'tamago', 'Telur ayam', 'Kosakata Sehari-hari', '卵焼きを作りました。', 'Membuat telur gulung.'],
  ['牛乳', 'ぎゅうにゅう', 'gyuunyuu', 'Susu murni sapi', 'Kosakata Sehari-hari', '毎朝牛乳を飲みます。', 'Setiap pagi minum susu sapi.'],
  ['食べる', 'たべる', 'taberu', 'Makan hidangan', 'Kosakata Sehari-hari', 'ラーメンを食べたいです。', 'Ingin makan ramen.'],
  ['飲む', 'のむ', 'nomu', 'Minum cairan', 'Kosakata Sehari-hari', 'コーヒーを飲みます。', 'Minum kopi.'],
  ['起きる', 'おきる', 'okiru', 'Bangun tidur', 'Kosakata Sehari-hari', '毎朝早く起きます。', 'Setiap pagi bangun pagi.'],
  ['寝る', 'ねる', 'neru', 'Tidur terlelap', 'Kosakata Sehari-hari', '十一時に寝ます。', 'Tidur jam sebelas.'],
  ['行く', 'いく', 'iku', 'Pergi ke tempat', 'Kosakata Sehari-hari', '学校へ行きます。', 'Pergi ke sekolah.'],
  ['来る', 'くる', 'kuru', 'Datang kemari', 'Kosakata Sehari-hari', '先生が教室に来ました。', 'Guru datang ke ruang kelas.'],
  ['帰る', 'かえる', 'kaeru', 'Pulang ke rumah', 'Kosakata Sehari-hari', 'うちに帰ります。', 'Pulang ke rumah.'],
  ['見る', 'みる', 'miru', 'Melihat / Menonton acara', 'Kosakata Sehari-hari', '映画を見ました。', 'Menonton film.'],
  ['聞く', 'きく', 'kiku', 'Mendengar suara / Bertanya', 'Kosakata Sehari-hari', '音楽を聞きます。', 'Mendengarkan musik.'],
  ['読む', 'よむ', 'yomu', 'Membaca tulisan', 'Kosakata Sehari-hari', '本を読みます。', 'Membaca buku.'],
  ['書く', 'かく', 'kaku', 'Menulis huruf/pesan', 'Kosakata Sehari-hari', '手紙を書きました。', 'Menulis surat.'],
  ['話す', 'はなす', 'hanasu', 'Berbicara menyampaikan kata', 'Kosakata Sehari-hari', '日本語で話します。', 'Berbicara dengan bahasa Jepang.'],
  ['買う', 'かう', 'kau', 'Membeli barang', 'Kosakata Sehari-hari', '新しい靴を買いました。', 'Membeli sepatu baru.'],
  ['勉強する', 'べんきょうする', 'benkyousuru', 'Belajar menuntut ilmu', 'Kosakata Sehari-hari', '日本語を一生懸命勉強します。', 'Belajar bahasa Jepang dengan sungguh-sungguh.'],
  ['友達', 'ともだち', 'tomodachi', 'Teman / Kawan akrab', 'Kosakata Sehari-hari', '友達と公園で遊びます。', 'Bermain di taman bersama kawan.'],
  ['家族', 'かぞく', 'kazoku', 'Keluarga inti', 'Kosakata Sehari-hari', '家族と一緒に住んでいます。', 'Tinggal bersama keluarga.'],

  // 4. KOSAKATA DI PEKERJAAN (仕事)
  ['仕事', 'しごと', 'shigoto', 'Pekerjaan / Bekerja', 'Pekerjaan', '今日の仕事が終わりました。', 'Pekerjaan hari ini sudah selesai.'],
  ['会社', 'かいしゃ', 'kaisha', 'Perusahaan / Kantor', 'Pekerjaan', '九時に会社へ行きます。', 'Pergi ke kantor jam sembilan.'],
  ['会社員', 'かいしゃいん', 'kaishain', 'Pegawai kantor / Karyawan', 'Pekerjaan', '兄は会社員です。', 'Kakak saya adalah pegawai kantor.'],
  ['働く', 'はたらく', 'hataraku', 'Bekerja mencari nafkah', 'Pekerjaan', '日本で働きたいです。', 'Saya ingin bekerja di Jepang.'],
  ['事務所', 'じむしょ', 'jimusho', 'Kantor ruangan kerja', 'Pekerjaan', '事務所で書類を書きます。', 'Menulis dokumen di kantor.'],
  ['先生', 'せんせい', 'sensei', 'Guru / Dokter pengajar', 'Pekerjaan', '日本語の先生に質問します。', 'Bertanya kepada guru bahasa Jepang.'],
  ['学生', 'がくせい', 'gakusei', 'Murid / Pelajar sekolah', 'Pekerjaan', '大学の学生です。', 'Mahasiswa di universitas.'],
  ['医者', 'いしゃ', 'isha', 'Dokter medis', 'Pekerjaan', '病院で医者に診てもらいます。', 'Diperiksa oleh dokter di rumah sakit.'],
  ['看護師', 'かんごし', 'kangoshi', 'Perawat rumah sakit', 'Pekerjaan', '親切な看護師さんです。', 'Perawat yang ramah.'],
  ['警察官', 'けいさつかん', 'keisatsukan', 'Petugas polisi', 'Pekerjaan', '交番の警察官に道を聞きました。', 'Bertanya arah ke polisi di pos.'],
  ['銀行', 'ぎんこう', 'ginkou', 'Bank tempat simpan pinjam', 'Pekerjaan', '銀行でお金を下ろします。', 'Menarik uang di bank.'],
  ['銀行員', 'ぎんこういん', 'ginkouin', 'Pegawai bank', 'Pekerjaan', '母は銀行員でした。', 'Ibu dulu pegawai bank.'],
  ['店員', 'てんいん', 'ten\'in', 'Pelayan toko / Pramuniaga', 'Pekerjaan', '店員にいらっしゃいませと言われました。', 'Disapa selamat datang oleh pelayan.'],
  ['工場', 'こうじょう', 'koujou', 'Pabrik industri produksi', 'Pekerjaan', '自動車の工場で見学します。', 'Berkunjung melihat pabrik mobil.'],

  // 5. NAMA BUAH (果物)
  ['果物', 'くだもの', 'kudamono', 'Buah-buahan', 'Nama Buah', '果物が大好きです。', 'Sangat suka buah-buahan.'],
  ['林檎', 'りんご', 'ringo', 'Apel manis', 'Nama Buah', '赤い林檎を食べました。', 'Makan apel merah.'],
  ['蜜柑', 'みかん', 'mikan', 'Jeruk keprok manis', 'Nama Buah', '冬に蜜柑を食べます。', 'Makan jeruk di musim dingin.'],
  ['バナナ', 'ばなな', 'banana', 'Pisang manis', 'Nama Buah', '朝ご飯にバナナを食べます。', 'Makan pisang untuk sarapan.'],
  ['西瓜', 'すいか', 'suika', 'Semangka segar', 'Nama Buah', '夏休みに西瓜を食べました。', 'Makan semangka di liburan musim panas.'],
  ['苺', 'いちご', 'ichigo', 'Stroberi manis', 'Nama Buah', '甘くて美味しい苺です。', 'Stroberi yang manis dan enak.'],
  ['葡萄', 'ぶどう', 'budou', 'Anggur manis', 'Nama Buah', '紫の葡萄を買いました。', 'Membeli anggur ungu.'],
  ['桃', 'もも', 'momo', 'Persik / Peach lembut', 'Nama Buah', '桃はとても柔らかいです。', 'Buah persik sangat lembut.'],
  ['レモン', 'れもん', 'remon', 'Lemon segar asam', 'Nama Buah', 'レモンはとても酸っぱいです。', 'Lemon rasanya sangat asam.'],
  ['メロン', 'めろん', 'meron', 'Melon manis harum', 'Nama Buah', '高級なメロンをもらいました。', 'Mendapatkan melon kualitas tinggi.'],

  // 6. KENDARAAN UMUM & TRANSPORTASI (乗り物)
  ['電車', 'でんしゃ', 'densha', 'Kereta api listrik', 'Kendaraan Umum', '電車で学校へ通います。', 'Pergi ke sekolah naik kereta listrik.'],
  ['地下鉄', 'ちかてつ', 'chikatetsu', 'Kereta bawah tanah (MRT)', 'Kendaraan Umum', '地下鉄はとても便利です。', 'Kereta bawah tanah sangat praktis.'],
  ['新幹線', 'しんかんせん', 'shinkansen', 'Kereta peluru Shinkansen', 'Kendaraan Umum', '新幹線で京都へ行きます。', 'Pergi ke Kyoto naik Shinkansen.'],
  ['バス', 'ばす', 'basu', 'Bus kota umum', 'Kendaraan Umum', 'バスで駅まで行きます。', 'Pergi sampai stasiun naik bus.'],
  ['タクシー', 'たくしー', 'takushii', 'Taksi penumpang', 'Kendaraan Umum', '雨なのでタクシーに乗ります。', 'Karena hujan, naik taksi.'],
  ['飛行機', 'ひこうき', 'hikouki', 'Pesawat terbang udara', 'Kendaraan Umum', '飛行機で日本へ行きました。', 'Pergi ke Jepang naik pesawat.'],
  ['船', 'ふね', 'fune', 'Kapal laut pelayaran', 'Kendaraan Umum', '大きな船が見えます。', 'Terlihat kapal laut yang besar.'],
  ['自転車', 'じてんしゃ', 'jitensha', 'Sepeda gowes', 'Kendaraan Umum', '自転車でスーパーへ行きます。', 'Pergi ke supermarket naik sepeda.'],
  ['車', 'くるま', 'kuruma', 'Mobil roda empat', 'Kendaraan Umum', '父の車に乗りました。', 'Naik mobil ayah.'],
  ['駅', 'えき', 'eki', 'Stasiun kereta api', 'Kendaraan Umum', '駅の前で待ち合わせします。', 'Bertemu janji di depan stasiun.'],
  ['バス停', 'ばすてい', 'basutei', 'Halte pemberhentian bus', 'Kendaraan Umum', 'バス停で並びます。', 'Mengantre di halte bus.'],
  ['切符', 'きっぷ', 'kippu', 'Tiket karcis perjalanan', 'Kendaraan Umum', '切符売り場で買いました。', 'Membeli di loket tiket.'],
  ['乗り場', 'のりば', 'noriba', 'Tempat menaiki kendaraan', 'Kendaraan Umum', 'タクシーの乗り場はあそこです。', 'Tempat naik taksi ada di sana.'],
  ['乗る', 'のる', 'noru', 'Naik ke kendaraan', 'Kendaraan Umum', '七時の電車に乗ります。', 'Naik kereta jam tujuh.'],
  ['降りる', 'おりる', 'oriru', 'Turun dari kendaraan', 'Kendaraan Umum', '次の駅で降ります。', 'Turun di stasiun berikutnya.'],

  // 7. SAPAAN RESMI (挨拶)
  ['おはようございます', 'おはようございます', 'ohayou gozaimasu', 'Selamat pagi (sopan)', 'Sapaan', '先生、おはようございます。', 'Selamat pagi, Pak/Bu Guru.'],
  ['こんにちは', 'こんにちは', 'konnichiwa', 'Selamat siang / Halo', 'Sapaan', '皆さん、こんにちは。', 'Halo semuanya, selamat siang.'],
  ['こんばんは', 'こんばんは', 'konbanwa', 'Selamat malam santai', 'Sapaan', 'こんばんは、お元気ですか。', 'Selamat malam, apa kabar?'],
  ['さようなら', 'さようなら', 'sayounara', 'Selamat tinggal perpisahan', 'Sapaan', '先生、さようなら。', 'Selamat tinggal, Guru.'],
  ['ありがとうございます', 'ありがとうございます', 'arigatou gozaimasu', 'Terima kasih banyak (sopan)', 'Sapaan', '親切にありがとうございます。', 'Terima kasih banyak atas kebaikannya.'],
  ['すみません', 'すみません', 'sumimasen', 'Permisi / Maaf memohon maaf', 'Sapaan', 'すみません、駅はどこですか。', 'Permisi, stasiun ada di mana?'],
  ['はじめまして', 'はじめまして', 'hajimemashite', 'Senang berkenalan (awal)', 'Sapaan', 'はじめまして、アリと申します。', 'Senang bertemu Anda, saya dipanggil Ari.'],
  ['どうぞよろしく', 'どうぞよろしく', 'douzo yoroshiku', 'Mohon bimbingan dan kerja samanya', 'Sapaan', 'これからどうぞよろしくお願いします。', 'Mulai sekarang mohon kerja samanya.'],
  ['お願いします', 'おねがいします', 'onegaishimasu', 'Tolong / Mohon bantuannya', 'Sapaan', 'お水を一杯お願いします。', 'Tolong segelas air.'],
  ['いただきます', 'いただきます', 'itadakimasu', 'Selamat makan (ungkapan syukur)', 'Sapaan', '手を合わせていただきますと言います。', 'Menangkupkan tangan dan mengucap selamat makan.']
];

// ==========================================
// LEVEL N4 (110 KARTU LENGKAP TERURUT RESMI)
// ==========================================
const N4_RAW = [
  // 1. ANGKA & PENGHITUNGAN (数字・計算)
  ['億', 'おく', 'oku', 'Ratusan juta (100.000.000)', 'Angka', '日本の人口は一億人以上です。', 'Populasi Jepang lebih dari 100 juta jiwa.'],
  ['半分', 'はんぶん', 'hanbun', 'Setengah bagian / Separuh', 'Angka', 'リンゴを半分に切ります。', 'Memotong apel menjadi dua bagian.'],
  ['全部', 'ぜんぶ', 'zenbu', 'Semuanya / Seluruh bagian', 'Angka', '宿題を全部終わらせました。', 'Telah menyelesaikan semua PR.'],
  ['一番', 'いちばん', 'ichiban', 'Nomor satu / Paling utama', 'Angka', '日本語が一番好きです。', 'Bahasa Jepang adalah yang paling saya sukai.'],
  ['台', 'だい', 'dai', 'Satuan mesin / perangkat / kendaraan', 'Angka', '車を二台持っています。', 'Memiliki dua unit mobil.'],
  ['枚', 'まい', 'mai', 'Satuan lembar / kertas / baju tipis', 'Angka', 'シャツを三枚買いました。', 'Membeli tiga lembar kemeja.'],
  ['冊', 'さつ', 'satsu', 'Satuan jilid buku / majalah', 'Angka', '本を五冊借りました。', 'Meminjam lima jilid buku.'],
  ['匹', 'ひき', 'hiki', 'Satuan ekor hewan kecil / ikan', 'Angka', '猫が二匹います。', 'Ada dua ekor kucing.'],
  ['本', 'ほん', 'hon', 'Satuan batang / botol silinder', 'Angka', 'ジュースを二本買いました。', 'Membeli dua botol jus.'],
  ['倍', 'ばい', 'bai', 'Kali lipat perbandingan', 'Angka', '売り上げが二倍になりました。', 'Omzet penjualan menjadi dua kali lipat.'],
  ['割引き', 'わりびき', 'waribiki', 'Diskon / Potongan harga', 'Angka', '二割引で買いました。', 'Membeli dengan diskon 20%.'],
  ['半額', 'はんがく', 'hangaku', 'Setengah harga (diskon 50%)', 'Angka', '夕方になるとお弁当が半額になります。', 'Saat sore, bento menjadi setengah harga.'],
  ['単位', 'たんい', 'tan\'i', 'Satuan baku ukuran / SKS kuliah', 'Angka', '単位を計算します。', 'Menghitung satuan.'],
  ['順番', 'じゅんばん', 'junban', 'Urutan giliran antrean', 'Angka', '順番を待ってください。', 'Tolong tunggu giliran.'],
  ['番号', 'ばんごう', 'bangou', 'Nomor urut registrasi', 'Angka', '電話番号を教えてください。', 'Beri tahu nomor telepon Anda.'],
  ['回数', 'かいすう', 'kaisuu', 'Frekuensi kali kejadian', 'Angka', '利用回数を記録します。', 'Mencatat frekuensi penggunaan.'],
  ['点数', 'てんすう', 'tensuu', 'Poin nilai skor ujian', 'Angka', 'テストの点数が上がりました。', 'Nilai ujian meningkat.'],

  // 2. UANG & TRANSAKSI (お金・会計)
  ['現金', 'げんきん', 'genkin', 'Uang tunai / Cash nyata', 'Uang', '現金でお支払いします。', 'Saya membayar dengan uang tunai.'],
  ['値段', 'ねだん', 'nedan', 'Harga banderol suatu barang', 'Uang', '値段札を確認します。', 'Memeriksa label harga.'],
  ['定価', 'ていか', 'teika', 'Harga resmi pas pabrik', 'Uang', '定価より安く買えます。', 'Bisa membeli lebih murah dari harga pas.'],
  ['消費税', 'しょうひぜい', 'shouhizei', 'Pajak konsumsi (PPN belanja)', 'Uang', '消費税込みの値段です。', 'Harga sudah termasuk pajak konsumsi.'],
  ['レシート', 'れしーと', 'reshiito', 'Struk belanja kasir minimarket', 'Uang', 'レシートをもらいました。', 'Mendapatkan struk belanja.'],
  ['領収書', 'りょうしゅうしょ', 'ryoushuusho', 'Kuitansi bukti pembayaran resmi', 'Uang', '会社の領収書をお願いします。', 'Tolong buatkan kuitansi atas nama kantor.'],
  ['貯金', 'ちょきん', 'chokin', 'Tabungan simpanan uang pribadi', 'Uang', '毎月二万円貯金しています。', 'Setiap bulan menabung dua puluh ribu yen.'],
  ['給料', 'きゅうりょう', 'kyuuryou', 'Gaji / Upah bulanan kerja', 'Uang', '二十五日は給料日です。', 'Tanggal 25 adalah hari gajian.'],
  ['会計', 'かいけい', 'kaikei', 'Pembayaran kasir / Tagihan bon', 'Uang', 'お会計をお願いします。', 'Tolong hitung tagihan kasirnya.'],
  ['無料', 'むりょう', 'muryou', 'Gratis tanpa dipungut biaya', 'Uang', '入場料は無料です。', 'Biaya masuk gratis.'],
  ['有料', 'ゆうりょう', 'yuuryou', 'Berbayar / Dikenakan biaya sewa', 'Uang', 'この駐車場は有料です。', 'Tempat parkir ini berbayar.'],
  ['料金', 'りょうきん', 'ryoukin', 'Tarif ongkos / Biaya pemakaian', 'Uang', '利用料金を調べます。', 'Mencari tahu tarif penggunaan.'],
  ['割引券', 'わりびきけん', 'waribikiken', 'Kupon voucher diskon belanja', 'Uang', '割引券を使いました。', 'Menggunakan kupon diskon.'],
  ['硬貨', 'こうか', 'kouka', 'Koin logam uang kembalian', 'Uang', '硬貨を自動販売機に入れます。', 'Memasukkan uang koin ke mesin penjual.'],
  ['お札', 'おさつ', 'osatsu', 'Uang kertas lembaran bank', 'Uang', '千円札が三枚あります。', 'Ada tiga lembar uang seribu yen.'],
  ['支出', 'ししゅつ', 'shishutsu', 'Pengeluaran pos belanja', 'Uang', '毎月の支出を抑えます。', 'Menekan pos pengeluaran bulanan.'],
  ['収入', 'しゅうにゅう', 'shuunyuu', 'Pemasukan uang penghasilan', 'Uang', 'アルバイトの収入です。', 'Pemasukan dari kerja paruh waktu.'],

  // 3. KOSAKATA SEHARI-HARI (日常生活・家事)
  ['アパート', 'あぱーと', 'apaato', 'Apartemen sewa bulanan', 'Kosakata Sehari-hari', '駅から近いアパートに住んでいます。', 'Tinggal di apartemen dekat stasiun.'],
  ['マンション', 'まんしょん', 'manshon', 'Kondominium apartemen beton', 'Kosakata Sehari-hari', '高層マンションに引っ越しました。', 'Pindah ke kondominium lantai tinggi.'],
  ['掃除', 'そうじ', 'souji', 'Bersih-bersih sapu pel kamar', 'Kosakata Sehari-hari', '休みの日に部屋を掃除します。', 'Membersihkan kamar pada hari libur.'],
  ['洗濯', 'せんたく', 'sentaku', 'Mencuci baju pakaian kotor', 'Kosakata Sehari-hari', '天気がいいので洗濯します。', 'Karena cuaca bagus, mencuci pakaian.'],
  ['料理', 'りょうり', 'ryouri', 'Masakan / Memasak hidangan dapur', 'Kosakata Sehari-hari', '日本料理を作るのが好きです。', 'Saya suka memasak masakan Jepang.'],
  ['ゴミ', 'ごみ', 'gomi', 'Sampah buangan limbah rumah', 'Kosakata Sehari-hari', 'ゴミの分別を守りましょう。', 'Mari patuhi aturan pemilahan sampah.'],
  ['水道', 'すいどう', 'suidou', 'Saluran air pipa ledeng', 'Kosakata Sehari-hari', '水道の蛇口を閉めます。', 'Menutup keran air ledeng.'],
  ['電気', 'でんき', 'denki', 'Listrik daya penerangan lampu', 'Kosakata Sehari-hari', '部屋の電気を消して出かけます。', 'Memadamkan lampu kamar lalu berangkat.'],
  ['ガス', 'がす', 'gasu', 'Saluran gas memasak kompor', 'Kosakata Sehari-hari', 'ガスの元栓を確認します。', 'Memeriksa katup utama tabung gas.'],
  ['お風呂', 'おふろ', 'ofuro', 'Bak mandi rendaman air hangat', 'Kosakata Sehari-hari', '温かいお風呂に入ります。', 'Berendam di bak mandi air hangat.'],
  ['薬', 'くすり', 'kusuri', 'Obat medis penyembuh', 'Kosakata Sehari-hari', '食後に薬を飲みます。', 'Minum obat medis setelah makan.'],
  ['風邪', 'かぜ', 'kaze', 'Masuk angin / Flu batuk pilek', 'Kosakata Sehari-hari', '風邪を引いて学校を休みました。', 'Masuk angin sehingga tidak masuk sekolah.'],
  ['熱', 'ねつ', 'netsu', 'Demam suhu badan panas tinggi', 'Kosakata Sehari-hari', '熱を測ったら三十八度ありました。', 'Saat diukur suhu tubuh demam 38 derajat.'],
  ['引っ越し', 'ひっこし', 'hikkoshi', 'Pindah tempat hunian tinggal', 'Kosakata Sehari-hari', '来週新しい町へ引っ越します。', 'Minggu depan pindah ke kota baru.'],
  ['約束', 'やくそく', 'yakusoku', 'Janji pertemuan / Komitmen', 'Kosakata Sehari-hari', '友達との約束の時間を守ります。', 'Menepati waktu janji temu bersama kawan.'],
  ['宅配便', 'たくはいびん', 'takukaibin', 'Layanan kurir kilat antar paket', 'Kosakata Sehari-hari', '宅配便でプレゼントを送りました。', 'Mengirim kado lewat kurir kilat.'],
  ['切手', 'きって', 'kitte', 'Perangko pos tempel surat', 'Kosakata Sehari-hari', '手紙に切手を貼ります。', 'Menempelkan perangko pada surat.'],
  ['封筒', 'ふうとう', 'fuutou', 'Amplop pembungkus surat', 'Kosakata Sehari-hari', '書類を白い封筒に入れます。', 'Memasukkan berkas ke dalam amplop putih.'],
  ['布団', 'ふとん', 'futon', 'Kasur lipat matras tidur Jepang', 'Kosakata Sehari-hari', '天気のいい日に布団を干します。', 'Menjemur kasur futon di hari cerah.'],
  ['毛布', 'もうふ', 'moufu', 'Selimut kain hangat tebal', 'Kosakata Sehari-hari', '寒いので毛布をもう一枚掛けます。', 'Karena dingin, memakai selimut tebal tambahan.'],

  // 4. KOSAKATA DI PEKERJAAN (仕事・職場)
  ['アルバイト', 'あるばいと', 'arubaito', 'Kerja paruh waktu (part-time)', 'Pekerjaan', 'コンビニでアルバイトをしています。', 'Bekerja part-time di minimarket.'],
  ['残業', 'ざんぎょう', 'zangyou', 'Kerja lembur lewat jam kerja', 'Pekerjaan', '今日は二時間残業しました。', 'Hari ini bekerja lembur dua jam.'],
  ['会議', 'かいぎ', 'kaigi', 'Rapat / Musyawarah kerja tim', 'Pekerjaan', '十時から重要な会議があります。', 'Mulai jam sepuluh ada rapat penting.'],
  ['社長', 'しゃちょう', 'shachou', 'Direktur utama perusahaan kantor', 'Pekerjaan', '社長が朝礼で挨拶しました。', 'Presiden direktur memberi sambutan di apel pagi.'],
  ['部長', 'ぶちょう', 'buchou', 'Kepala divisi / Manajer umum', 'Pekerjaan', '部長に報告書を提出しました。', 'Menyerahkan laporan ke kepala divisi.'],
  ['課長', 'かちょう', 'kachou', 'Kepala seksi / Supervisor tim', 'Pekerjaan', '課長に相談に乗ってもらいました。', 'Berkonsultasi dengan kepala seksi.'],
  ['同僚', 'どうりょう', 'douryou', 'Rekan kerja sekantor sebaya', 'Pekerjaan', '同僚とランチを食べました。', 'Makan siang bersama rekan kerja.'],
  ['先輩', 'せんぱい', 'senpai', 'Senior pembimbing tempat kerja', 'Pekerjaan', '先輩から仕事を教わります。', 'Diajari pekerjaan oleh senior.'],
  ['後輩', 'こうはい', 'kouhai', 'Junior staf baru di kantor', 'Pekerjaan', '新しい後輩が入社しました。', 'Ada karyawan baru junior masuk kantor.'],
  ['面接', 'めんせつ', 'mensetsu', 'Wawancara seleksi lamaran kerja', 'Pekerjaan', '明日は採用面接です。', 'Besok adalah wawancara penerimaan kerja.'],
  ['履歴書', 'りれきしょ', 'rirekisho', 'Curriculum Vitae / Riwayat hidup', 'Pekerjaan', '写真付きの履歴書を送ります。', 'Mengirimkan CV berfoto.'],
  ['連絡', 'れんらく', 'renraku', 'Menghubungi / Mengabari pesan', 'Pekerjaan', 'メールで連絡してください。', 'Tolong hubungi melalui surel/email.'],
  ['相談', 'そうだん', 'soudan', 'Berkonsultasi meminta masukan', 'Pekerjaan', '困ったときはすぐ相談します。', 'Saat kesulitan segera berdiskusi.'],
  ['報告', 'ほうこく', 'houkoku', 'Melaporkan hasil tugas atasan', 'Pekerjaan', '業務の結果を報告します。', 'Melaporkan hasil pelaksanaan tugas.'],
  ['準備', 'じゅんび', 'junbi', 'Persiapan perlengkapan kerja', 'Pekerjaan', '会議の資料を準備します。', 'Mempersiapkan materi presentasi rapat.'],
  ['営業', 'えいぎょう', 'eigyou', 'Operasional bisnis / Penjualan sales', 'Pekerjaan', '営業活動で顧客を訪問します。', 'Mengunjungi klien untuk aktivitas penjualan.'],
  ['欠勤', 'けっきん', 'kekkin', 'Absen tidak masuk kerja', 'Pekerjaan', '病気のため一日欠勤しました。', 'Tidak masuk kerja sehari karena sakit.'],
  ['遅刻', 'ちこく', 'chikoku', 'Terlambat datang masuk kerja/kelas', 'Pekerjaan', '遅刻しないように早めに出ます。', 'Berangkat lebih awal agar tidak terlambat.'],
  ['早退', 'そうたい', 'soutai', 'Pulang lebih awal izin kerja', 'Pekerjaan', '体調不良で早退しました。', 'Pulang kerja lebih awal karena kurang enak badan.'],
  ['提出', 'ていしゅつ', 'teishutsu', 'Pengumpulan berkas / Serah tugas', 'Pekerjaan', 'レポートを先生に提出しました。', 'Mengumpulkan laporan kepada guru.'],
  ['受付', 'うけつけ', 'uketsuke', 'Meja resepsionis penerima tamu', 'Pekerjaan', '受付で名前を記入してください。', 'Silakan tulis nama di resepsionis.'],
  ['出勤', 'しゅっきん', 'shukkin', 'Berangkat menuju tempat kerja', 'Pekerjaan', '毎朝八時に出勤します。', 'Masuk kantor jam delapan setiap pagi.'],

  // 5. NAMA BUAH (果物・農産)
  ['梨', 'なし', 'nashi', 'Pir Jepang manis renyah air', 'Nama Buah', '秋の梨はみずみずしいです。', 'Buah pir musim gugur sangat berair dan segar.'],
  ['パイナップル', 'ぱいなっぷる', 'painappuru', 'Nanas buah tropis segar', 'Nama Buah', '甘酸っぱいパイナップルです。', 'Nanas yang manis asam menyegarkan.'],
  ['マンゴー', 'まんごー', 'mangoo', 'Mangga harum manis', 'Nama Buah', '沖縄のマンゴーは絶品です。', 'Mangga Okinawa sangat istimewa.'],
  ['さくらんぼ', 'さくらんぼ', 'sakuranbo', 'Buah ceri merah mungil', 'Nama Buah', '山形のさくらんぼを食べました。', 'Makan buah ceri dari Yamagata.'],
  ['柿', 'かき', 'kaki', 'Buah kesemek manis legit', 'Nama Buah', '庭の木に柿が実りました。', 'Pohon di kebun berbuah kesemek.'],
  ['栗', 'くり', 'kuri', 'Kacang kastanye gurih manis', 'Nama Buah', '栗ご飯を作りました。', 'Membuat nasi kastanye gurih.'],
  ['グレープフルーツ', 'ぐれーぷふるーつ', 'gureepufuruutsu', 'Jeruk bali merah asam segar', 'Nama Buah', '朝にグレープフルーツジュースを飲みます。', 'Pagi hari minum jus jeruk bali merah.'],
  ['パパイヤ', 'ぱぱいや', 'papaiya', 'Pepaya oranye tropis', 'Nama Buah', '熟したパパイヤを切ります。', 'Memotong buah pepaya yang matang.'],
  ['アボカド', 'あぼかど', 'abokado', 'Alpukat lembut kaya gizi', 'Nama Buah', 'アボカドサラダを作ります。', 'Membuat salad alpukat.'],
  ['キウイ', 'きうい', 'kiui', 'Buah kiwi kaya vitamin C', 'Nama Buah', 'ビタミンたっぷりのキウイです。', 'Kiwi yang kaya akan vitamin.'],
  ['いちじく', 'いちじく', 'ichijiku', 'Buah ara / Tin manis lembut', 'Nama Buah', '甘いいちじくを収穫しました。', 'Memanen buah tin yang manis.'],
  ['ゆず', 'ゆず', 'yuzu', 'Jeruk yuzu wangi khas Jepang', 'Nama Buah', 'ゆずの香りがとても爽やかです。', 'Aroma jeruk yuzu sangat menyegarkan.'],

  // 6. KENDARAAN UMUM & TRANSPORTASI (乗り物・交通)
  ['特急', 'とっきゅう', 'tokkyuu', 'Kereta ekspres terbatas cepat', 'Kendaraan Umum', '特急券を買って乗りました。', 'Membeli tiket ekspres dan naik kereta.'],
  ['急行', 'きゅうこう', 'kyuukou', 'Kereta cepat antar-kota', 'Kendaraan Umum', '急行電車は速いです。', 'Kereta cepat sangat laju.'],
  ['快速', 'かいそく', 'kaisoku', 'Kereta semi-cepat komuter', 'Kendaraan Umum', '快速に乗れば早く着きます。', 'Jika naik kereta semi-cepat akan tiba lebih cepat.'],
  ['普通電車', 'ふつうでんしゃ', 'futsuudensha', 'Kereta lokal biasa tiap stasiun', 'Kendaraan Umum', '普通電車は各駅に止まります。', 'Kereta lokal berhenti di setiap stasiun.'],
  ['定期券', 'ていきけん', 'teikiken', 'Tiket langganan komuter bulanan', 'Kendaraan Umum', '駅の窓口で定期券を更新します。', 'Memperpanjang tiket komuter di loket.'],
  ['運賃', 'うんちん', 'unchin', 'Tarif ongkos karcis perjalanan', 'Kendaraan Umum', 'バスの運賃を払います。', 'Membayar tarif ongkos bus.'],
  ['乗り換え', 'のりかえ', 'norikae', 'Transit pindah gerbong/armada', 'Kendaraan Umum', '新宿駅で乗り換えます。', 'Pindah kereta di Stasiun Shinjuku.'],
  ['終電', 'しゅうでん', 'shuuden', 'Kereta keberangkatan malam terakhir', 'Kendaraan Umum', '終電に間に合いました。', 'Sempat mengejar kereta terakhir.'],
  ['始発', 'しはつ', 'shihatsu', 'Kereta keberangkatan pertama fajar', 'Kendaraan Umum', '始発電車で出発しました。', 'Berangkat dengan kereta paling pagi.'],
  ['空港', 'くうこう', 'kuukou', 'Bandar udara internasional', 'Kendaraan Umum', '成田空港へ電車で向かいます。', 'Menuju Bandara Narita naik kereta.'],
  ['便', 'びん', 'bin', 'Jadwal armada penerbangan kapal', 'Kendaraan Umum', '次の便を予約しました。', 'Memesan penerbangan berikutnya.'],
  ['出発', 'しゅっぱつ', 'shuppatsu', 'Keberangkatan memulai rute', 'Kendaraan Umum', '予定通りに出発します。', 'Berangkat sesuai jadwal yang direncanakan.'],
  ['到着', 'とうちゃく', 'touchaku', 'Kedatangan menginjakkan kaki tujuan', 'Kendaraan Umum', '羽田に無事到着しました。', 'Tiba dengan selamat di Haneda.'],
  ['踏切', 'ふみきり', 'fumikiri', 'Perlintasan palang rel kereta api', 'Kendaraan Umum', '踏切の前で一時停止します。', 'Berhenti sejenak di depan palang perlintasan.'],
  ['渋滞', 'じゅうたい', 'juutai', 'Kemacetan antrean lalu lintas', 'Kendaraan Umum', '高速道路が渋滞しています。', 'Jalan tol sedang macet parah.'],
  ['各駅停車', 'かくえきていしゃ', 'kakuekiteisha', 'Kereta berhenti di setiap stasiun', 'Kendaraan Umum', '各駅停車でのんびり行きます。', 'Pergi santai naik kereta lokal tiap stasiun.'],
  ['優先席', 'ゆうせんせき', 'yuusenseki', 'Kursi prioritas lansia dan ibu hamil', 'Kendaraan Umum', 'お年寄りに優先席を譲ります。', 'Memberikan kursi prioritas kepada lansia.'],
  ['乗り遅れる', 'のりおくれる', 'noriokureru', 'Ketinggalan jadwal kereta / bus', 'Kendaraan Umum', '電車に乗り遅れてしまいました。', 'Ketinggalan kereta listrik.'],
  ['乗り過ごす', 'のりすごす', 'norisugosu', 'Kebablasan stasiun tujuan karena tidur', 'Kendaraan Umum', '寝てしまって駅を乗り過ごしました。', 'Tertidur dan kebablasan stasiun.'],
  ['歩道', 'ほどう', 'hodou', 'Trotoar khusus pejalan kaki', 'Kendaraan Umum', '歩道を安全に歩きます。', 'Berjalan dengan aman di trotoar.'],
  ['車道', 'しゃどう', 'shadou', 'Jalur badan jalan kendaraan mobil', 'Kendaraan Umum', '車道を車がスピードを出して走ります。', 'Mobil melaju kencang di badan jalan.']
];

// ==========================================
// LEVEL N3 (110 KARTU LENGKAP TERURUT RESMI)
// ==========================================
const N3_RAW = [
  // 1. ANGKA & STATISTIK (数字・統計)
  ['割合', 'わりあい', 'wariai', 'Rasio persentase proporsi bagian', 'Angka', '正解の割合が高くなりました。', 'Persentase jawaban benar meningkat.'],
  ['平均', 'へいきん', 'heikin', 'Nilai rata-rata hitungan data', 'Angka', 'テストの平均点は七十五点でした。', 'Nilai rata-rata ujian adalah 75 poin.'],
  ['増加', 'ぞうか', 'zouka', 'Peningkatan lonjakan kuantitas jumlah', 'Angka', '外国人観光客が増加しています。', 'Wisatawan mancanegara mengalami peningkatan.'],
  ['減少', 'げんしょう', 'genshou', 'Penurunan pengurangan angka grafik', 'Angka', '人口の減少が問題になっています。', 'Penurunan angka populasi menjadi masalah.'],
  ['数量', 'すうりょう', 'suuryou', 'Kuantitas takaran jumlah barang', 'Angka', '注文の数量を確認してください。', 'Tolong periksa kuantitas jumlah pesanan.'],
  ['確率', 'かくりつ', 'kakuritsu', 'Probabilitas peluang kemungkinan terjadi', 'Angka', '雨が降る確率は八十パーセントです。', 'Peluang turun hujan adalah 80 persen.'],
  ['合計', 'ごうけい', 'goukei', 'Jumlah total akumulasi keseluruhan', 'Angka', '三日間の合計金額を計算します。', 'Menghitung jumlah total nominal tiga hari.'],
  ['概数', 'がいすう', 'gaisuu', 'Angka taksiran kasar pembulatan', 'Angka', '概数で見積もりを出します。', 'Mengeluarkan estimasi dengan angka taksiran.'],
  ['比率', 'ひりつ', 'hiritsu', 'Rasio komparasi angka', 'Angka', '男女の比率を調査します。', 'Meneliti rasio pria dan wanita.'],
  ['多数', 'たすう', 'tasuu', 'Mayoritas jumlah banyak', 'Angka', '多数決で意見を決めます。', 'Menentukan keputusan lewat suara terbanyak.'],
  ['少数', 'しょうすう', 'shousuu', 'Minoritas kuantitas sedikit', 'Angka', '少数の意見も尊重します。', 'Menghormati pendapat minoritas.'],
  ['最多', 'さいた', 'saita', 'Jumlah terbanyak rekor', 'Angka', '過去最多の来場者数です。', 'Jumlah pengunjung terbanyak dalam sejarah.'],
  ['最少', 'さいしょう', 'saishou', 'Jumlah paling sedikit rekor', 'Angka', '事故の件数が最少になりました。', 'Jumlah kecelakaan menjadi paling sedikit.'],

  // 2. UANG & PERBANKAN (お金・金融)
  ['口座', 'こうざ', 'kouza', 'Buku rekening tabungan bank', 'Uang', '銀行で新しい口座を開設しました。', 'Membuka buku rekening baru di bank.'],
  ['振込', 'ふりこみ', 'furikomi', 'Transfer pengiriman dana via ATM/bank', 'Uang', '家賃を指定の口座に振り込みます。', 'Mentransfer uang sewa rumah ke rekening yang ditunjuk.'],
  ['手数料', 'てすうりょう', 'tesuuryou', 'Biaya administrasi jasa transaksi', 'Uang', '夜間のATM利用には手数料がかかります。', 'Penggunaan ATM malam hari dikenakan biaya admin.'],
  ['預金', 'よきん', 'yokin', 'Saldo simpanan tabungan perbankan', 'Uang', '普通預金にお金を預けます。', 'Menaruh simpanan uang di rekening giro/tabungan biasa.'],
  ['利子', 'りし', 'rishi', 'Bunga imbalan simpanan perbankan', 'Uang', '定期預金の利子がつきました。', 'Memperoleh bunga dari deposito berjangka.'],
  ['予算', 'よさん', 'yosan', 'Anggaran belanja alokasi dana (budget)', 'Uang', '予算内で企画を進めます。', 'Menjalankan proyek dalam batas anggaran.'],
  ['費用', 'ひよう', 'hiyou', 'Ongkos pengeluaran operasional kegiatan', 'Uang', '留学の費用を自分で準備しました。', 'Mempersiapkan sendiri biaya belajar di luar negeri.'],
  ['借金', 'しゃっきん', 'shakkin', 'Utang uang / Pinjaman dana berbunga', 'Uang', '借金をすべて返済しました。', 'Melunasi seluruh utang pinjaman uang.'],
  ['税金', 'ぜいきん', 'zeikin', 'Pajak kewajiban penerimaan negara', 'Uang', '国民には税金を納める義務があります。', 'Warga negara memiliki kewajiban membayar pajak.'],
  ['節約', 'せつやく', 'setsuyaku', 'Penghematan efisiensi pengeluaran dana', 'Uang', '電気代を節約するために工夫します。', 'Berupaya menghemat tagihan listrik.'],
  ['請求書', 'せいきゅうしょ', 'seikyuusho', 'Surat tagihan / Lembar invoice', 'Uang', '月末に請求書が届きます。', 'Faktur tagihan tiba di akhir bulan.'],
  ['資産', 'しさん', 'shisan', 'Harta kekayaan aset modal portofolio', 'Uang', '不動産などの資産を管理します。', 'Mengelola aset modal properti dsb.'],
  ['残高', 'ざんだか', 'zandaka', 'Sisa saldo rekening tabungan', 'Uang', '口座の残高を確認します。', 'Memeriksa sisa saldo rekening.'],
  ['経費', 'けいひ', 'keihi', 'Beban biaya operasional kantor', 'Uang', '出張の経費を精算します。', 'Mengganti biaya pengeluaran dinas luar.'],
  ['金利', 'きんり', 'kinri', 'Suku bunga perbankan komersial', 'Uang', '住宅ローンの金利を比較します。', 'Membandingkan suku bunga KPR perumahan.'],
  ['借入', 'かりいれ', 'kariire', 'Peminjaman modal dana bank', 'Uang', '銀行から運転資金を借入します。', 'Meminjam dana operasional dari bank.'],

  // 3. KOSAKATA SEHARI-HARI (日常生活・環境)
  ['環境', 'かんきょう', 'kankyou', 'Lingkungan hidup ekosistem alam', 'Kosakata Sehari-hari', '自然環境を守る取り組みをします。', 'Melakukan upaya menjaga kelestarian lingkungan hidup.'],
  ['分別', 'ぶんべつ', 'bunbetsu', 'Pemilahan klasifikasi kategori sampah', 'Kosakata Sehari-hari', '燃えるゴミと不燃ゴミを分別します。', 'Memilah sampah organik dan non-organik.'],
  ['資源', 'しげん', 'shigen', 'Sumber daya material daur ulang bernilai', 'Kosakata Sehari-hari', '空き缶はリサイクル資源です。', 'Kaleng bekas merupakan sumber daya daur ulang.'],
  ['近所', 'きんじょ', 'kinjo', 'Lingkungan tetangga sekitar kediaman', 'Kosakata Sehari-hari', '近所の人と笑顔で挨拶を交わします。', 'Saling bertukar salam senyum dengan tetangga.'],
  ['防犯', 'ぼうはん', 'bouhan', 'Pencegahan tindak kejahatan keamanan', 'Kosakata Sehari-hari', '町内会で防犯パトロールを行います。', 'Mengadakan patroli kamtibmas di perumahan.'],
  ['宅配', 'たくはい', 'takuhai', 'Layanan jasa kurir pengantaran barang', 'Kosakata Sehari-hari', '宅配便で荷物が届きました。', 'Paket kiriman tiba melalui jasa kurir pengiriman.'],
  ['配達', 'はいたつ', 'haitatsu', 'Pengiriman barang pesanan paket', 'Kosakata Sehari-hari', 'ピザの配達を注文しました。', 'Memesan layanan antar pizza ke rumah.'],
  ['故障', 'こしょう', 'koshou', 'Kerusakan gangguan teknis mekanis', 'Kosakata Sehari-hari', 'エアコンが故障して動きません。', 'AC rusak dan tidak mau menyala.'],
  ['修理', 'しゅうり', 'shuuri', 'Perbaikan pembenahan servis alat mekanik', 'Kosakata Sehari-hari', '自転車のパンクを修理してもらいました。', 'Meminta tambal ban sepeda yang bocor.'],
  ['停電', 'ていでん', 'teiden', 'Pemadaman listrik padam darurat', 'Kosakata Sehari-hari', '落雷で一時的に停電しました。', 'Padam listrik sejenak akibat sambaran petir.'],
  ['断水', 'だんすい', 'dansui', 'Penghentian aliran pasokan air ledeng', 'Kosakata Sehari-hari', '水道管工事のため午後断水します。', 'Aliran air mati siang ini karena perbaikan pipa.'],
  ['点検', 'てんけん', 'tenken', 'Inspeksi pemeriksaan berkala rutin', 'Kosakata Sehari-hari', 'エレベーターの定期点検を行います。', 'Mengadakan inspeksi rutin lift gedung.'],
  ['非常食', 'ひじょうしょく', 'hijoushoku', 'Ransum makanan bekal kondisi darurat', 'Kosakata Sehari-hari', '非常食として缶詰を備蓄します。', 'Menimbun makanan kaleng sebagai ransum darurat.'],
  ['避難所', 'ひなんじょ', 'hinanjo', 'Tempat posko pengungsian bencana', 'Kosakata Sehari-hari', '小学校が避難所に指定されています。', 'SD ditunjuk sebagai posko pengungsian warga.'],

  // 4. KOSAKATA DI PEKERJAAN (仕事・ビジネス)
  ['担当', 'たんとう', 'tantou', 'Penanggung jawab penugasan (PIC)', 'Pekerjaan', 'このプロジェクトの担当者です。', 'Orang yang bertanggung jawab atas proyek ini.'],
  ['責任', 'せきにん', 'sekinin', 'Tanggung jawab amanah kewajiban kerja', 'Pekerjaan', '自分の仕事に責任を持ちます。', 'Memiliki tanggung jawab terhadap tugas sendiri.'],
  ['研修', 'けんしゅう', 'kenshuu', 'Pelatihan kerja dinas / Magang pembekalan', 'Pekerjaan', '新入社員向けの研修を受けました。', 'Mengikuti pelatihan untuk karyawan baru.'],
  ['昇給', 'しょうきゅう', 'shoukyuu', 'Kenaikan upah penghasilan gaji pokok', 'Pekerjaan', '業績に応じて昇給が決まります。', 'Kenaikan gaji ditentukan sesuai performa kerja.'],
  ['昇進', 'しょうしん', 'shoushin', 'Promosi jenjang jabatan struktural', 'Pekerjaan', '先輩が課長に昇進しました。', 'Senior dipromosikan menjadi kepala seksi.'],
  ['定時', 'ていじ', 'teiji', 'Jam kerja standar berakhir tepat waktu', 'Pekerjaan', '今日は定時で退社します。', 'Hari ini pulang tepat pada akhir jam kerja.'],
  ['有給休暇', 'ゆうきゅうきゅうか', 'yuukyuukyuuka', 'Cuti kerja tahunan berbayar penuh', 'Pekerjaan', '有給休暇を取得して旅行に行きます。', 'Mengambil cuti berbayar untuk berlibur.'],
  ['取引先', 'とりひきさき', 'torihikisaki', 'Mitra relasi klien bisnis rekanan', 'Pekerjaan', '大事な取引先へ挨拶に伺います。', 'Berkunjung memberi salam ke mitra bisnis penting.'],
  ['企画', 'きかく', 'kikaku', 'Perencanaan rancangan konsep gagasan', 'Pekerjaan', '新しい商品の企画書を作成しました。', 'Menyusun proposal perencanaan produk baru.'],
  ['開発', 'かいはつ', 'kaihatsu', 'Pengembangan produk riset inovatif', 'Pekerjaan', '最新技術の開発に取り組みます。', 'Bekerja mengembangkan teknologi terkini.'],
  ['製造', 'せいぞう', 'seizou', 'Manufaktur proses pembuatan pabrikan', 'Pekerjaan', '国内の工場で製品を製造します。', 'Memproduksi barang di pabrik dalam negeri.'],
  ['契約', 'けいやく', 'keiyaku', 'Kontrak akad kesepakatan tertulis', 'Pekerjaan', '正式に契約を結びました。', 'Menandatangani kontrak secara resmi.'],
  ['書類', 'しょるい', 'shorui', 'Berkas dokumen resmi administrasi kantor', 'Pekerjaan', '必要書類に署名と捺印をします。', 'Membubuhi tanda tangan dan stempel di dokumen.'],
  ['出張', 'しゅっちょう', 'shucchou', 'Perjalanan dinas dinas tugas luar kota', 'Pekerjaan', '来週大阪へ三日間出張します。', 'Minggu depan dinas tiga hari ke Osaka.'],
  ['退職', 'たいしょく', 'taishoku', 'Pensiun purnabakti / Mundur dari kerja', 'Pekerjaan', '定年で退職する上司を送別します。', 'Melepas atasan yang pensiun karena purnabakti.'],
  ['納期', 'のうき', 'nouki', 'Batas tenggat waktu penyerahan order', 'Pekerjaan', '納期に間に合わせるよう急ぎます。', 'Bergegas agar sempat sebelum tenggat pengiriman.'],
  ['顧客', 'こきゃく', 'kokyaku', 'Pelanggan setia klien pengguna jasa', 'Pekerjaan', '顧客の要望に応えるサービスです。', 'Layanan yang menjawab kebutuhan para pelanggan.'],
  ['競合', 'きょうごう', 'kyougou', 'Persaingan kompetitor bisnis usaha', 'Pekerjaan', '競合他社の動向を調査します。', 'Meneliti pergerakan kompetitor usaha lain.'],
  ['納品', 'のうひん', 'nouhin', 'Pengiriman serah terima pesanan barang', 'Pekerjaan', '注文された製品を無事納品しました。', 'Telah menyerahkan pesanan produk pesanan dengan selamat.'],

  // 5. NAMA BUAH & AGRIKULTUR (果物・農産)
  ['果実', 'かじつ', 'kajitsu', 'Buah-buahan segar hasil tanaman', 'Nama Buah', '太陽を浴びて果実が実りました。', 'Tersiram mentari, buah-buahan ranum bersemi.'],
  ['収穫', 'しゅうかく', 'shuukaku', 'Panen pemetikan hasil perkebunan', 'Nama Buah', '秋にはたくさんの果物を収穫します。', 'Di musim gugur memanen banyak buah-buahan.'],
  ['栽培', 'さいばい', 'saibai', 'Budi daya penanaman hortikultura', 'Nama Buah', 'ハウスで温室メロンを栽培しています。', 'Membudidayakan melon rumah kaca.'],
  ['品種', 'ひんしゅ', 'hinshu', 'Varietas bibit tanaman unggul', 'Nama Buah', '新しい品種のリンゴを開発しました。', 'Mengembangkan varietas apel bibit baru.'],
  ['新鮮', 'しんせん', 'shinsen', 'Kondisi segar bugar baru dipanen', 'Nama Buah', '朝採りの新鮮な野菜と果物です。', 'Sayur dan buah segar yang dipetik pagi ini.'],
  ['完熟', 'かんじゅく', 'kanjuku', 'Matang ranum sempurna di dahan', 'Nama Buah', '木で完熟した甘い桃です。', 'Buah persik manis yang matang ranum di dahan.'],
  ['糖度', 'とうど', 'toudo', 'Tingkat kadar manis sukrosa buah', 'Nama Buah', 'このスイカは糖度がとても高いです。', 'Semangka ini kadar kemanisannya sangat tinggi.'],
  ['産地', 'さんち', 'sanchi', 'Daerah sentra produsen penghasil', 'Nama Buah', 'ミカンの名産地を訪ねました。', 'Mengunjungi daerah sentra penghasil jeruk terkenal.'],
  ['旬', 'しゅん', 'shun', 'Musim puncak cita rasa terbaik', 'Nama Buah', '今が一番旬のイチゴです。', 'Ini adalah stroberi yang sedang di puncak musimnya.'],
  ['豊作', 'ほうさく', 'housaku', 'Panen raya berlimpah ruah', 'Nama Buah', '今年はミカンが豊作でした。', 'Tahun ini panen jeruk sangat berlimpah.'],
  ['不作', 'ふさく', 'fusaku', 'Gagal panen hasil bumi merosot', 'Nama Buah', '冷夏の影響でリンゴが不作です。', 'Karena musim panas dingin, apel gagal panen.'],
  ['糖分', 'とうぶん', 'toubun', 'Kandungan kadar zat gula buah', 'Nama Buah', '果物に含まれる自然な糖分です。', 'Kadar gula alami yang terkandung dalam buah.'],

  // 6. KENDARAAN UMUM & TRANSPORTASI (乗り物・交通)
  ['交通機関', 'こうつうきかん', 'koutsuukikan', 'Moda sarana transportasi fasilitas publik', 'Kendaraan Umum', '公共の交通機関を利用しましょう。', 'Mari gunakan moda fasilitas transportasi umum.'],
  ['運行', 'うんこう', 'unkou', 'Pengoperasian jadwal armada jalan', 'Kendaraan Umum', '台風のため電車の運行が見合わされました。', 'Pengoperasian kereta ditunda karena badai topan.'],
  ['遅延', 'ちえん', 'chien', 'Keterlambatan jadwal perjalanan (delay)', 'Kendaraan Umum', '電車の遅延証明書をもらいました。', 'Mendapatkan surat keterangan resmi delay kereta.'],
  ['ダイヤ', 'だいや', 'daiya', 'Jadwal keberangkatan resmi armada kereta', 'Kendaraan Umum', '春のダイヤ改正が行われます。', 'Diberlakukan penyesuaian jadwal kereta musim semi.'],
  ['車掌', 'しゃしょう', 'shashou', 'Kondektur pemandu tiket gerbong kereta', 'Kendaraan Umum', '車掌が車内アナウンスをしています。', 'Kondektur memberikan pengumuman di gerbong.'],
  ['運転手', 'うんてんしゅ', 'untenshu', 'Sopir pengemudi armada bus/truk jalan', 'Kendaraan Umum', 'バスの運転手さんが安全運転を心がけます。', 'Sopir bus mengutamakan keselamatan berkendara.'],
  ['高速道路', 'こうそくどうろ', 'kousokudouro', 'Jalan tol bebas hambatan antar-kota', 'Kendaraan Umum', '高速道路を使って短時間で移動します。', 'Bepergian singkat lewat jalan tol.'],
  ['フェリー', 'ふぇりー', 'ferii', 'Kapal feri penyeberangan selat pulau', 'Kendaraan Umum', '車ごとフェリーに乗って島へ渡ります。', 'Membawa mobil menyeberang pulau naik feri.'],
  ['乗客', 'じょうきゃく', 'joukyaku', 'Penumpang pengguna jasa angkutan umum', 'Kendaraan Umum', '多くの乗客がホームで待っています。', 'Banyak penumpang menunggu di peron stasiun.'],
  ['路線', 'ろせん', 'rosen', 'Trayek rute lintasan transportasi', 'Kendaraan Umum', '地下鉄の新しい路線が開通しました。', 'Rute jalur bawah tanah baru telah diresmikan.'],
  ['終点', 'しゅうてん', 'shuuten', 'Stasiun terminal pemberhentian akhir', 'Kendaraan Umum', '電車はこの駅が終点です。', 'Kereta ini pemberhentian terakhirnya stasiun ini.'],
  ['始発駅', 'しはつえき', 'shihatsueki', 'Stasiun awal mula keberangkatan', 'Kendaraan Umum', '始発駅から座って通勤します。', 'Duduk naik kereta dari stasiun awal keberangkatan.'],
  ['乗降', 'じょうこう', 'joukou', 'Aktivitas naik dan turun penumpang', 'Kendaraan Umum', '乗降客が多いターミナル駅です。', 'Stasiun terminal dengan volume penumpang naik turun tinggi.'],
  ['運休', 'うんきゅう', 'unkyuu', 'Pembatalan pengoperasian perjalanan', 'Kendaraan Umum', '大雪のため終日運休となります。', 'Dibatalkan operasinya seharian karena salju lebat.'],
  ['満員', 'まんいん', 'man\'in', 'Kapasitas penuh sesak sesak orang', 'Kendaraan Umum', '朝の満員電車に乗るのは大変です。', 'Sangat berat naik kereta komuter yang penuh sesak pagi hari.'],
  ['車両', 'しゃりょう', 'sharyou', 'Rangkaian gerbong armada kereta', 'Kendaraan Umum', '女性専用車両が導入されています。', 'Diberlakukan gerbong khusus wanita.']
];

// ==========================================
// LEVEL N2 (100 KARTU LENGKAP TERURUT RESMI)
// ==========================================
const N2_RAW = [
  // 1. ANALISIS ANGKA & INDIKATOR DATA (数字・指標)
  ['推移', 'すいい', 'suii', 'Dinamika pergerakan tren berkala waktu', 'Angka', '景気の推移を慎重に見守ります。', 'Mengamati pergerakan iklim ekonomi secara saksama.'],
  ['統計', 'とうけい', 'toukei', 'Data statistik agregat resmi pemerintah', 'Angka', '政府の統計調査データを分析します。', 'Menganalisis data survei statistik pemerintah.'],
  ['指数', 'しすう', 'shisuu', 'Angka indeks tolok ukur acuan pasar', 'Angka', '消費者物価指数が上昇しました。', 'Indeks harga konsumen mengalami kenaikan.'],
  ['激増', 'げきぞう', 'gekizou', 'Lonjakan peningkatan drastis tajam', 'Angka', '注文が激増して対応に追われます。', 'Pesanan melonjak tajam hingga sibuk menanganinya.'],
  ['激減', 'げきげん', 'gekigen', 'Penurunan anjlok amat drastis tajam', 'Angka', '売上が激減し危機感を持ちます。', 'Penjualan anjlok drastis sehingga memicu kewaspadaan.'],
  ['膨大', 'ぼうだい', 'boudai', 'Volume kuantitas luar biasa masif raksasa', 'Angka', '膨大なデータを処理するシステムです。', 'Sistem yang memproses volume data raksasa.'],
  ['微量', 'びりょう', 'biryou', 'Kuantitas amat sedikit / Skala mikro', 'Angka', '微量の添加物も検査で検出されます。', 'Zat aditif kadar mikro pun terdeteksi dalam tes.'],
  ['比例', 'ひれい', 'hirei', 'Perbandingan proporsional seimbang sejalan', 'Angka', '努力に比例して成果が現れます。', 'Hasil nyata muncul sebanding dengan usaha keras.'],
  ['概算', 'がいさん', 'gaisan', 'Kalkulasi perhitungan taksiran kasar anggaran', 'Angka', '工事費用の概算書を提出します。', 'Menyerahkan surat estimasi biaya konstruksi.'],
  ['微増', 'びぞう', 'bizou', 'Peningkatan tipis sedikit', 'Angka', '売上が前年比で微増しました。', 'Penjualan meningkat tipis dibanding tahun lalu.'],
  ['微減', 'びげん', 'bigen', 'Penurunan tipis sedikit', 'Angka', '支出が微減傾向にあります。', 'Pengeluaran cenderung menurun tipis.'],
  ['横ばい', 'よこばい', 'yokobai', 'Kondisi mendatar stabil stagnan', 'Angka', '物価の推移は横ばいが続いています。', 'Pergerakan tingkat harga terus mendatar stabil.'],
  ['分布', 'ぶんぷ', 'bunpu', 'Persebaran distribusi frekuensi data', 'Angka', '年齢層の分布をグラフで表します。', 'Menampilkan persebaran kelompok usia dalam grafik.'],
  ['相関', 'そうかん', 'soukan', 'Korelasi hubungan timbal balik variabel', 'Angka', '二つのデータの相関関係を調べます。', 'Meneliti hubungan korelasi kedua data.'],

  // 2. EKONOMI, KEUANGAN & MONETER (お金・金融経済)
  ['為替', 'かわせ', 'kawase', 'Kurs pertukaran valuta mata uang asing', 'Uang', '為替相場の変動により損益が出ます。', 'Muncul untung-rugi akibat fluktuasi kurs mata uang.'],
  ['株価', 'かぶか', 'kabuka', 'Indeks nilai lembar harga saham bursa', 'Uang', '市場の株価が過去最高を更新しました。', 'Indeks saham di pasar menembus rekor tertinggi.'],
  ['投資', 'とうし', 'toushi', 'Penanaman modal investasi riil portofolio', 'Uang', '新興企業への投資を拡大します。', 'Memperluas investasi ke perusahaan rintisan.'],
  ['融資', 'ゆうし', 'yuushi', 'Penyaluran pembiayaan kredit bank komersial', 'Uang', '事業拡大のため銀行から融資を受けます。', 'Menerima kredit modal kerja dari bank untuk ekspansi.'],
  ['資金', 'しきん', 'shikin', 'Dana likuiditas modal operasional kerja', 'Uang', '研究開発のための資金を調達します。', 'Menggalang ketersediaan dana bagi riset dan pengembangan.'],
  ['倒産', 'とうさん', 'tousan', 'Kebangkrutan kepailitan badan usaha korporasi', 'Uang', '大手旅行会社が突然倒産しました。', 'Biro perjalanan besar mendadak mengalami kepailitan.'],
  ['不況', 'ふきょう', 'fukyou', 'Kondisi resesi kelesuan pasar ekonomi', 'Uang', '不況を乗り越えるための経営戦略です。', 'Strategi manajemen untuk melalui masa resesi pasar.'],
  ['好況', 'こうきょう', 'koukyou', 'Fase lonjakan ledakan ekspansi ekonomi cerah', 'Uang', '好況期に利益を蓄積しておきます。', 'Menyimpan akumulasi laba di masa ekspansi ekonomi.'],
  ['物価', 'ぶっか', 'bukka', 'Taraf tingkat harga komoditas kebutuhan umum', 'Uang', '物価の高騰が生活を圧迫しています。', 'Kenaikan taraf harga barang menekan biaya hidup.'],
  ['決算', 'けっさん', 'kessan', 'Tutup buku pelaporan audit keuangan tahunan', 'Uang', '年度末の決算報告書を作成します。', 'Menyusun laporan tutup buku audit akhir tahun fiskal.'],
  ['財政', 'ざいせい', 'zaisei', 'Keuangan kas perbendaharaan fiskal negara', 'Uang', '国家の財政再建に向けた改革です。', 'Reformasi terarah demi pemulihan kas fiskal negara.'],
  ['債務', 'さいむ', 'saimu', 'Liabilitas kewajiban beban utang piutang', 'Uang', '多額の債務を整理する計画を立てます。', 'Menyusun skema restrukturisasi beban utang bernilai besar.'],
  ['配当', 'はいとう', 'haitou', 'Dividen bagi hasil keuntungan saham', 'Uang', '株主への利益配当を実施します。', 'Membagikan dividen keuntungan kepada pemegang saham.'],
  ['監査', 'かんさ', 'kansa', 'Audit pemeriksaan pembukuan akuntansi', 'Uang', '公認会計士による会計監査を受けます。', 'Menjalani audit keuangan oleh akuntan publik.'],
  ['赤字', 'あかじ', 'akaji', 'Defisit neraca kerugian finansial', 'Uang', '今期は大幅な赤字を計上しました。', 'Mencatat defisit keuangan besar pada kuartal ini.'],
  ['黒字', 'くろじ', 'kuroji', 'Surplus laba keuntungan bersih kas', 'Uang', '三年ぶりに貿易黒字に転じました。', 'Berbalik mencatat surplus perdagangan setelah 3 tahun.'],
  ['資本', 'しほん', 'shihon', 'Modal pokok ekuitas perusahaan', 'Uang', '事業拡大のため資本金を増強します。', 'Memperkuat modal disetor untuk ekspansi usaha.'],

  // 3. KEHIDUPAN MASYARAKAT & HUKUM (社会生活・公共)
  ['住民票', 'じゅうみんひょう', 'juuminhyou', 'Surat keterangan domisili kependudukan sipil', 'Kosakata Sehari-hari', '市役所で住民票の写しを取得します。', 'Mengurus salinan surat domisili kependudukan di balai kota.'],
  ['年金', 'ねんきん', 'nenkin', 'Jaminan simpanan dana pensiun hari tua', 'Kosakata Sehari-hari', '国民年金の保険料を納付します。', 'Membayar iuran jaminan dana pensiun hari tua.'],
  ['保険', 'ほけん', 'hoken', 'Polis jaminan asuransi perlindungan jiwa/kesehatan', 'Kosakata Sehari-hari', '健康保険証を病院の窓口に提示します。', 'Menunjukkan kartu asuransi kesehatan di loket rumah sakit.'],
  ['裁判', 'さいばん', 'saiban', 'Persidangan meja hijau pengadilan yuridis formal', 'Kosakata Sehari-hari', '公平な裁判を受ける権利が保障されています。', 'Hak memperoleh peradilan hukum yang adil dijamin konstitusi.'],
  ['訴訟', 'そしょう', 'soshou', 'Pengajuan gugatan perkara hukum yuridis ke hakim', 'Kosakata Sehari-hari', '損害賠償を求めて訴訟を起こしました。', 'Mengajukan gugatan hukum ganti rugi materiil.'],
  ['治安', 'ちあん', 'chian', 'Ketertiban ketenteraman stabilitas keamanan publik', 'Kosakata Sehari-hari', 'この地域は治安が良好で住みやすいです。', 'Kawasan ini memiliki stabilitas keamanan baik dan nyaman dihuni.'],
  ['防災', 'ぼうさい', 'bousai', 'Mitigasi penanggulangan risiko bencana alam darurat', 'Kosakata Sehari-hari', '地域の防災訓練に家族で参加しました。', 'Ikut latihan mitigasi bencana lingkungan bersama keluarga.'],
  ['避難', 'ひなん', 'hinan', 'Evakuasi penyelamatan diri kondisi darurat bencana', 'Kosakata Sehari-hari', '警報が出たら直ちに高台へ避難します。', 'Segera evakuasi ke tempat tinggi jika peringatan bahaya berbunyi.'],
  ['社会保障', 'しゃかいほしょう', 'shakaihoshou', 'Sistem jaminan perlindungan sosial negara', 'Kosakata Sehari-hari', '持続可能な社会保障制度を構築します。', 'Membangun sistem jaminan sosial yang berkelanjutan.'],
  ['減災', 'げんさい', 'gensai', 'Mitigasi pereduksi risiko dampak bencana', 'Kosakata Sehari-hari', '地域全体で減災意識を高めます。', 'Meningkatkan kesadaran mitigasi bencana di seluruh warga.'],

  // 4. MANAJEMEN KORPORASI & PEKERJAAN (企業経営・労働)
  ['経営', 'けいえい', 'keiei', 'Tata kelola korporasi kepengurusan manajerial', 'Pekerjaan', '企業の経営方針を新たに策定します。', 'Merumuskan arah pedoman manajemen perusahaan yang baru.'],
  ['役員', 'やくいん', 'yakuin', 'Dewan direksi jajaran komisaris eksekutif', 'Pekerjaan', '取締役会の役員が全員出席しました。', 'Seluruh jajaran dewan direksi hadir di rapat pleno.'],
  ['雇用', 'こよう', 'koyou', 'Penyediaan hubungan kerja penyerapan tenaga', 'Pekerjaan', '雇用の安定と創出を最優先します。', 'Memprioritaskan stabilitas serta penciptaan lapangan kerja.'],
  ['採用', 'さいよう', 'saiyou', 'Perekrutan penerimaan pegawai karyawan baru', 'Pekerjaan', '優秀な人材を積極的に採用します。', 'Merekrut bibit talenta unggul secara proaktif.'],
  ['解雇', 'かいこ', 'kaiko', 'Pemutusan hubungan kerja (PHK ketenagakerjaan)', 'Pekerjaan', '不当な理由による解雇は法的に無効です。', 'PHK tanpa landasan hukum sah batal demi hukum.'],
  ['賃金', 'ちんぎん', 'chingin', 'Remunerasi sistem upah kompensasi kerja buruh', 'Pekerjaan', '最低賃金の引き上げが決定しました。', 'Telah ditetapkan kenaikan upah minimum regional.'],
  ['福利厚生', 'ふくりこうせい', 'fukruikousei', 'Fasilitas jaminan kesejahteraan karyawan staf', 'Pekerjaan', '充実した福利厚生制度が自慢です。', 'Membanggakan fasilitas jaminan kesejahteraan staf yang prima.'],
  ['交渉', 'こうしょう', 'koushou', 'Perundingan negosiasi klausul kontrak perikatan', 'Pekerjaan', '取引条件について粘り強く交渉します。', 'Bernegosiasi secara ulet mengenai klausul transaksi kerja.'],
  ['提携', 'ていけい', 'teikei', 'Aliansi kemitraan strategis korporasi bisnis', 'Pekerjaan', '海外企業との業務提携を発表しました。', 'Mengumumkan aliansi kemitraan strategis dengan korporasi asing.'],
  ['業績', 'ぎょうせき', 'gyouseki', 'Kinerja performa pencapaian omzet bisnis', 'Pekerjaan', '新製品のヒットで業績が急回復しました。', 'Performa bisnis pulih drastis berkat suksesnya produk baru.'],
  ['人事', 'じんじ', 'jinji', 'Manajemen SDM urusan personalia kantor (HRD)', 'Pekerjaan', '春の人事異動で新しい部署に配属されました。', 'Ditugaskan ke divisi baru saat rotasi mutasi personalia musim semi.'],
  ['就業規則', 'しゅうぎょうきそく', 'shuugyoukisoku', 'Peraturan tata tertib kerja perusahaan', 'Pekerjaan', '全社員に就業規則を周知徹底します。', 'Menyosialisasikan peraturan kerja kepada seluruh staf.'],
  ['定年退職', 'ていねんたいしょく', 'teinentaishoku', 'Pensiun purnabakti usia purna tugas', 'Pekerjaan', '父が今年六十歳で定年退職します。', 'Ayah akan pensiun purnabakti di usia 60 tahun ini.'],
  ['試用期間', 'しようきかん', 'shiyoukikan', 'Masa percobaan evaluasi kerja probasi', 'Pekerjaan', '三ヶ月の試用期間を経て正社員になります。', 'Menjadi karyawan tetap setelah masa percobaan tiga bulan.'],
  ['職務経歴', 'しょくむけいれき', 'shokumukeireki', 'Rekam jejak portofolio riwayat karier', 'Pekerjaan', '職務経歴書を面接官に提出します。', 'Menyerahkan riwayat pengalaman karier ke pewawancara.'],

  // 5. PERKEBUNAN BUAH & AGRIBISNIS (果樹・農産流通)
  ['果樹園', 'かじゅえん', 'kajuen', 'Perkebunan ladang budi daya tanaman buah', 'Nama Buah', '広大な果樹園でリンゴ狩りを体験します。', 'Mencoba wisata petik apel di kebun buah yang luas.'],
  ['農作物', 'のうさくぶつ', 'nousakubutsu', 'Komoditas hasil tanaman pangan pertanian', 'Nama Buah', '天候不良で農作物に被害が出ました。', 'Cuaca buruk menimbulkan kerusakan pada hasil panen tani.'],
  ['食料自給率', 'しょくりょうじきゅうりつ', 'shokuryoujikyuuritsu', 'Tingkat rasio swasembada pangan nasional', 'Nama Buah', '国内の食料自給率を引き上げる政策です。', 'Kebijakan peningkatan rasio kemandirian pangan nasional.'],
  ['卸売', 'おろしうり', 'oroshiuri', 'Penjualan partai besar / Grosir pasar induk', 'Nama Buah', '卸売市場から新鮮な果物を仕入れます。', 'Membeli pasokan buah segar dari pasar induk grosir.'],
  ['小売', 'こうり', 'kouri', 'Penjualan eceran retail langsung konsumen', 'Nama Buah', '小売店舗での販売価格を設定します。', 'Menetapkan harga eceran di gerai retail konsumen.'],
  ['輸出', 'ゆしゅつ', 'yushutsu', 'Ekspor komoditas ke pasar mancanegara', 'Nama Buah', '日本の高品質な果物を海外へ輸出します。', 'Mengekspor buah-buahan kualitas prima Jepang ke luar negeri.'],
  ['輸入', 'ゆにゅう', 'yunyuu', 'Impor komoditas bahan luar negeri asing', 'Nama Buah', '南国の果物を大量に輸入しています。', 'Mengimpor komoditas buah tropis dalam jumlah besar.'],
  ['有機栽培', 'ゆうきさいばい', 'yuukisaibai', 'Budi daya pertanian organik alami', 'Nama Buah', '農薬を使わない有機栽培の作物を買います。', 'Membeli hasil pertanian organik tanpa pestisida kimia.'],
  ['産地直送', 'さんちちょくそう', 'sanchichokusou', 'Pengiriman segar langsung dari kebun', 'Nama Buah', '産地直送の新鮮な果物を味わいます。', 'Menikmati buah segar kiriman langsung dari kebun.'],
  ['品種改良', 'ひんしゅかいりょう', 'hinshukairyou', 'Pemuliaan rekayasa bibit varietas unggul', 'Nama Buah', '品種改良を重ねて甘いブドウを作りました。', 'Menghasilkan anggur manis lewat pemuliaan varietas berulang.'],
  ['減農薬', 'げんのうやく', 'gennouyaku', 'Pengurangan kadar pestisida kimiawi', 'Nama Buah', '安心な減農薬栽培の果物を選びます。', 'Memilih buah hasil budi daya minim pestisida kimiawi.'],
  ['地産地消', 'ちさんちしょう', 'chisanchishou', 'Konsumsi hasil produksi lokal daerah', 'Nama Buah', '地産地消を推進して地域を活性化します。', 'Menggalakkan konsumsi produk lokal demi memajukan daerah.'],

  // 6. LOGISTIK, TRANSPORTASI & INFRASTRUKTUR (交通・物流)
  ['物流', 'ぶつりゅう', 'butsuryuu', 'Arus distribusi pasokan logistik kargo', 'Kendaraan Umum', '効率的な物流ネットワークを構築します。', 'Membangun jaringan rantai logistik distribusi yang efisien.'],
  ['輸送', 'ゆそう', 'yusou', 'Pengangkutan transportasi armada muatan kargo', 'Kendaraan Umum', '海上輸送で大量の物資を運びます。', 'Mengangkut kargo logistik masif melalui jalur laut.'],
  ['運搬', 'うんぱん', 'unpan', 'Pemindahan angkutan fisik barang beban', 'Kendaraan Umum', '重い機械を専用トラックで運搬します。', 'Mengangkut alat berat menggunakan truk angkutan khusus.'],
  ['定期便', 'ていきびん', 'teikibin', 'Penerbangan / Pelayaran berjadwal rutin', 'Kendaraan Umum', '主要都市を結ぶ定期便が増便されました。', 'Penerbangan reguler penghubung kota utama ditambah armadanya.'],
  ['航空会社', 'こうくうかいしゃ', 'koukuukaisha', 'Perusahaan maskapai penerbangan komersial', 'Kendaraan Umum', '大手航空会社の安全基準を遵守します。', 'Mematuhi standar kelaikan terbang maskapai penerbangan.'],
  ['軌道', 'きどう', 'kidou', 'Lintasan jalur rel perkeretaapian transit', 'Kendaraan Umum', '新型車両が軌道の上を滑らかに走ります。', 'Rangkaian gerbong anyar melaju mulus di atas rel perlintasan.'],
  ['船舶', 'せんぱく', 'senpaku', 'Armada kapal laut niaga niaga komersial', 'Kendaraan Umum', '大型船舶が港に停泊しています。', 'Kapal komersial berbobot besar bersandar di pelabuhan.'],
  ['交通網', 'こうつうもう', 'koutsuumou', 'Jaringan interkoneksi lalu lintas jalan raya', 'Kendaraan Umum', '全国を網羅する高速交通網の整備です。', 'Pengembangan jaringan transportasi cepat terpadu lintas negeri.'],
  ['渋滞緩和', 'じゅうたいかんわ', 'juutaikanwa', 'Peredaan penguraian kemacetan jalan arteri', 'Kendaraan Umum', 'バイパス開通により渋滞緩和が期待されます。', 'Diharapkan jalan lingkar baru dapat meredakan kemacetan.'],
  ['積載', 'せきさい', 'sekisai', 'Kapasitas daya muat muatan armada', 'Kendaraan Umum', 'トラックの最大積載量を厳守します。', 'Mematuhi secara ketat batas muatan maksimal truk.'],
  ['荷役', 'にやく', 'niyaku', 'Bongkar muat kargo pelabuhan logistik', 'Kendaraan Umum', '港湾で効率的に荷役作業を行います。', 'Melakukan pekerjaan bongkar muat secara efisien di dermaga.'],
  ['混雑率', 'こんざつりつ', 'konzatsuritsu', 'Tingkat rasio kepadatan penumpang gerbong', 'Kendaraan Umum', 'ラッシュ時の混雑率を緩和します。', 'Meredakan rasio kepadatan di jam-jam sibuk.'],
  ['航路', 'こうろ', 'kourou', 'Alur rute koridor pelayaran kapal', 'Kendaraan Umum', '国際定期航路を開設しました。', 'Membuka rute pelayaran laut terjadwal internasional.'],
  ['空路', 'くうろ', 'kuuro', 'Koridor rute perjalanan jalur udara', 'Kendaraan Umum', '空路で欧州主要都市へ直行します。', 'Terbang langsung ke kota utama Eropa melalui jalur udara.'],
  ['貨物', 'かもつ', 'kamotsu', 'Kargo muatan barang dagang logistik', 'Kendaraan Umum', '貨物列車の運行本数を増やします。', 'Menambah frekuensi perjalanan kereta api kargo barang.']
];

function buildDeck(items, level, startId) {
  let idCounter = startId;
  const seen = new Set();
  const deck = [];

  for (const item of items) {
    const [japanese, kana, romaji, indonesian, category, exampleJp, exampleId] = item;
    if (seen.has(japanese)) {
      console.warn(`Duplicate found in ${level}: ${japanese}`);
      continue;
    }
    seen.add(japanese);

    deck.push({
      id: idCounter++,
      level: level,
      japanese: japanese,
      kana: kana,
      romaji: romaji,
      reading: romaji,
      indonesian: indonesian,
      category: category,
      categoryJp: CATEGORY_MAP_JP[category] || '単語',
      example: exampleJp,
      exampleIndonesian: exampleId
    });
  }

  return deck;
}

const deckN5 = buildDeck(N5_RAW, 'N5', 1);
const deckN4 = buildDeck(N4_RAW, 'N4', 201);
const deckN3 = buildDeck(N3_RAW, 'N3', 401);
const deckN2 = buildDeck(N2_RAW, 'N2', 701);

console.log(`Generated: N5=${deckN5.length}, N4=${deckN4.length}, N3=${deckN3.length}, N2=${deckN2.length}, Total=${deckN5.length + deckN4.length + deckN3.length + deckN2.length}`);

const fileHeader = `import { VocabCard, JLPTLevel } from '../types';

/**
 * =======================================================================
 * DATA KOSAKATA / KOTOBA RESMI STANDAR JLPT (N5 - N2)
 * Disusun terurut dan lengkap tanpa duplikat:
 * 1. Angka (数字)
 * 2. Uang & Transaksi (お金)
 * 3. Kosakata Sehari-hari (日常生活)
 * 4. Kosakata di Pekerjaan (仕事・ビジネス)
 * 5. Nama Buah (果物)
 * 6. Kendaraan Umum & Transportasi (乗り物・交通)
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
console.log('Successfully written src/data/vocabData.ts');
