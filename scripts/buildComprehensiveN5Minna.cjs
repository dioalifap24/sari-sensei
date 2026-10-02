const fs = require('fs');

const CATEGORY_MAP_JP = {
  'Kata Kerja Dasar': '動詞',
  'Kata Sifat': '形容詞',
  'Penunjuk Waktu dan Angka': '時間・数字',
  'Kata Benda Umum': '名詞',
  'Kata Tanya dan Kata Ganti': '疑問詞・代名詞',
  'Salam dan Percakapan': '挨拶・表現',
  'Angka': '数字',
  'Uang': 'お金',
  'Kosakata Sehari-hari': '日常生活',
  'Pekerjaan': '仕事',
  'Nama Buah': '果物',
  'Kendaraan Umum': '乗り物',
  'Sapaan': '挨拶'
};

// =========================================================================
// MINNA NO NIHONGO BAB 1 - BAB 25 (KURIKULUM RESMI JLPT N5 LENGKAP ~800-1000 KOTOBA)
// =========================================================================

// 1. KATA KERJA DASAR (動詞 - Doushi)
const N5_VERBS = [
  ['行きます', 'いきます', 'ikimasu', 'Pergi', 'Kata Kerja Dasar', '学校へ行きます。', 'Pergi ke sekolah.'],
  ['来ます', 'きます', 'kimasu', 'Datang', 'Kata Kerja Dasar', '友達がうちにきます。', 'Teman datang ke rumah.'],
  ['帰ります', 'かえります', 'kaerimasu', 'Pulang', 'Kata Kerja Dasar', '五時にうちへ帰ります。', 'Pulang ke rumah pada jam lima.'],
  ['食べます', 'たべます', 'tabemasu', 'Makan', 'Kata Kerja Dasar', '朝ご飯を食べます。', 'Makan sarapan pagi.'],
  ['飲みます', 'のみます', 'nomimasu', 'Minum', 'Kata Kerja Dasar', '水を飲みます。', 'Minum air putih.'],
  ['吸います', 'すいます', 'suimasu', 'Menghisap / Merokok', 'Kata Kerja Dasar', 'たばこを吸いません。', 'Tidak merokok.'],
  ['見ます', 'みます', 'mimasu', 'Melihat / Menonton', 'Kata Kerja Dasar', 'テレビを見ます。', 'Menonton televisi.'],
  ['聞きます', 'ききます', 'kikimasu', 'Mendengar / Bertanya', 'Kata Kerja Dasar', '音楽を聞きます。', 'Mendengarkan musik.'],
  ['読みます', 'よみます', 'yomimasu', 'Membaca', 'Kata Kerja Dasar', '本を読みます。', 'Membaca buku.'],
  ['書きます', 'かきます', 'kakimasu', 'Menulis / Menggambar', 'Kata Kerja Dasar', '手紙を書きます。', 'Menulis surat.'],
  ['買います', 'かいます', 'kaimasu', 'Membeli', 'Kata Kerja Dasar', 'パンを買いました。', 'Membeli roti.'],
  ['撮ります', 'とります', 'torimasu', 'Mengambil (foto)', 'Kata Kerja Dasar', '写真を撮ります。', 'Mengambil foto.'],
  ['します', 'します', 'shimasu', 'Melakukan / Mengerjakan', 'Kata Kerja Dasar', '宿題をします。', 'Mengerjakan PR.'],
  ['会います', 'あいます', 'aimasu', 'Bertemu (teman)', 'Kata Kerja Dasar', '駅で友達に会います。', 'Bertemu teman di stasiun.'],
  ['切ります', 'きります', 'kirimasu', 'Memotong / Menggunting', 'Kata Kerja Dasar', '紙を切ります。', 'Memotong kertas.'],
  ['送ります', 'おくります', 'okurimasu', 'Mengirim (paket/barang)', 'Kata Kerja Dasar', '荷物を送ります。', 'Mengirim barang.'],
  ['あげます', 'あげます', 'agemasu', 'Memberikan kepada orang lain', 'Kata Kerja Dasar', '花をあげます。', 'Memberikan bunga.'],
  ['もらいます', 'もらいます', 'moraimasu', 'Menerima / Mendapatkan', 'Kata Kerja Dasar', 'プレゼントをもらいました。', 'Menerima hadiah.'],
  ['貸します', 'かします', 'kashimasu', 'Meminjamkan', 'Kata Kerja Dasar', 'ペンを貸します。', 'Meminjamkan pulpen.'],
  ['借ります', 'かります', 'karimasu', 'Meminjam', 'Kata Kerja Dasar', '本を借ります。', 'Meminjam buku.'],
  ['教えます', 'おしえます', 'oshiemasu', 'Mengajar / Memberitahu', 'Kata Kerja Dasar', '日本語を教えます。', 'Mengajar bahasa Jepang.'],
  ['習います', 'ならいます', 'naraimasu', 'Belajar (dari guru/orang)', 'Kata Kerja Dasar', '生け花を習います。', 'Belajar seni merangkai bunga.'],
  ['かけます', 'かけます', 'kakemasu', 'Menelepon (denwa o kakemasu)', 'Kata Kerja Dasar', '電話をかけます。', 'Menelepon.'],
  ['分かります', 'わかります', 'wakarimasu', 'Mengerti / Paham', 'Kata Kerja Dasar', '日本語が分かります。', 'Mengerti bahasa Jepang.'],
  ['あります', 'あります', 'arimasu', 'Ada (benda mati/tanaman)', 'Kata Kerja Dasar', '机の上に本があります。', 'Ada buku di atas meja.'],
  ['います', 'います', 'imasu', 'Ada (manusia / hewan bernyawa)', 'Kata Kerja Dasar', '教室に学生がいます。', 'Ada murid di ruang kelas.'],
  ['かかります', 'かかります', 'kakarimasu', 'Memerlukan (waktu / biaya)', 'Kata Kerja Dasar', '一時間かかります。', 'Memakan waktu satu jam.'],
  ['遊びます', 'あそびます', 'asobimasu', 'Bermain / Bersenang-senang', 'Kata Kerja Dasar', '公園で遊びます。', 'Bermain di taman.'],
  ['泳ぎます', 'およぎます', 'oyogimasu', 'Berenang', 'Kata Kerja Dasar', 'プールで泳ぎます。', 'Berenang di kolam renang.'],
  ['迎えます', 'むかえます', 'mukaemasu', 'Menjemput / Menyambut', 'Kata Kerja Dasar', '空港へ友達を迎えます。', 'Menjemput kawan ke bandara.'],
  ['疲れます', 'つかれます', 'tsukaremasu', 'Lelah / Capai', 'Kata Kerja Dasar', 'とても疲れました。', 'Sangat lelah.'],
  ['出します', 'だします', 'dashimasu', 'Mengeluarkan / Mengirimkan', 'Kata Kerja Dasar', '手紙を出します。', 'Mengirimkan surat.'],
  ['入ります', 'はいります', 'hairimasu', 'Masuk (ke ruangan/kafe)', 'Kata Kerja Dasar', '喫茶店に入ります。', 'Masuk ke kedai kopi.'],
  ['出ます', 'でます', 'demasu', 'Keluar (dari ruangan)', 'Kata Kerja Dasar', '部屋を出ます。', 'Keluar kamar.'],
  ['結婚します', 'けっこんします', 'kekkonshimasu', 'Menikah', 'Kata Kerja Dasar', '来年結婚します。', 'Menikah tahun depan.'],
  ['買い物します', 'かいものします', 'kaimonoshimasu', 'Berbelanja', 'Kata Kerja Dasar', 'デパートで買い物します。', 'Berbelanja di departement store.'],
  ['食事します', 'しょくじします', 'shokujishimasu', 'Makan bersama / Bersantap', 'Kata Kerja Dasar', '家族と食事します。', 'Bersantap bersama keluarga.'],
  ['散歩します', 'さんぽします', 'sanposhimasu', 'Jalan-jalan santai', 'Kata Kerja Dasar', '公園を散歩します。', 'Jalan-jalan santai di taman.'],
  ['つけます', 'つけます', 'tsukemasu', 'Nyalakan (lampu / AC)', 'Kata Kerja Dasar', '電気をつけます。', 'Menyalakan lampu.'],
  ['消します', 'けします', 'keshimasu', 'Matikan (lampu / api)', 'Kata Kerja Dasar', 'エアコンを消します。', 'Mematikan AC.'],
  ['開けます', 'あけます', 'akemasu', 'Membuka (pintu / jendela)', 'Kata Kerja Dasar', '窓を開けます。', 'Membuka jendela.'],
  ['閉めます', 'しめます', 'shimemasu', 'Menutup (pintu / jendela)', 'Kata Kerja Dasar', 'ドアを閉めます。', 'Menutup pintu.'],
  ['急ぎます', 'いそぎます', 'isogimasu', 'Terburu-buru / Bergegas', 'Kata Kerja Dasar', '急いで駅へ行きます。', 'Bergegas menuju stasiun.'],
  ['待ちます', 'まちます', 'machimasu', 'Menunggu', 'Kata Kerja Dasar', 'ちょっと待ってください。', 'Tolong tunggu sebentar.'],
  ['止めます', 'とめます', 'tomemasu', 'Menghentikan / Memarkir', 'Kata Kerja Dasar', '車を止めます。', 'Memarkir mobil.'],
  ['曲がります', 'まがります', 'magarimasu', 'Belok (ke kanan / kiri)', 'Kata Kerja Dasar', '右へ曲がります。', 'Belok ke kanan.'],
  ['持ちます', 'もちます', 'mochimasu', 'Membawa / Memegang', 'Kata Kerja Dasar', '荷物を持ちます。', 'Membawakan barang.'],
  ['手伝います', 'てつだいます', 'tetsudaimasu', 'Membantu', 'Kata Kerja Dasar', '母の仕事を手伝います。', 'Membantu pekerjaan ibu.'],
  ['呼びます', 'よびます', 'yobimasu', 'Memanggil', 'Kata Kerja Dasar', 'タクシーを呼びます。', 'Memanggil taksi.'],
  ['話します', 'はなします', 'hanashimasu', 'Berbicara / Menceritakan', 'Kata Kerja Dasar', '先生と話します。', 'Berbicara dengan guru.'],
  ['見せます', 'みせます', 'misemasu', 'Memperlihatkan', 'Kata Kerja Dasar', 'パスポートを見せます。', 'Memperlihatkan paspor.'],
  ['始めます', 'はじめます', 'hajimemasu', 'Memulai', 'Kata Kerja Dasar', '授業を始めます。', 'Memulai pelajaran.'],
  ['降ります', 'ふります', 'furimasu', 'Turun (hujan / salju)', 'Kata Kerja Dasar', '雨が降っています。', 'Hujan sedang turun.'],
  ['コピーします', 'こぴーします', 'kopiishimasu', 'Memfotokopi', 'Kata Kerja Dasar', '資料をコピーします。', 'Memfotokopi dokumen.'],
  ['立ちます', 'たちます', 'tachimasu', 'Berdiri', 'Kata Kerja Dasar', 'ここに立ってください。', 'Silakan berdiri di sini.'],
  ['座ります', 'すわります', 'suwarimasu', 'Duduk', 'Kata Kerja Dasar', '椅子に座ります。', 'Duduk di kursi.'],
  ['使います', 'つかいます', 'tsukaimasu', 'Menggunakan / Memakai', 'Kata Kerja Dasar', '辞書を使います。', 'Menggunakan kamus.'],
  ['置きます', 'おきます', 'okimasu', 'Menaruh / Meletakkan', 'Kata Kerja Dasar', '机の上に置きます。', 'Menaruh di atas meja.'],
  ['作ります', 'つくります', 'tsukurimasu', 'Membuat / Memasak', 'Kata Kerja Dasar', '料理を作ります。', 'Membuat masakan.'],
  ['売ります', 'うります', 'urimasu', 'Menjual', 'Kata Kerja Dasar', '果物を売ります。', 'Menjual buah-buahan.'],
  ['知ります', 'しります', 'shirimasu', 'Tahu / Mengetahui', 'Kata Kerja Dasar', 'あの人を知っていますか。', 'Apakah Anda tahu orang itu?'],
  ['住みます', 'すみます', 'sumimasu', 'Tinggal / Menetap', 'Kata Kerja Dasar', '東京に住んでいます。', 'Tinggal di Tokyo.'],
  ['研究します', 'けんきゅうします', 'kenkyuushimasu', 'Meneliti / Riset', 'Kata Kerja Dasar', '経済を研究します。', 'Meneliti bidang ekonomi.'],
  ['乗ります', 'のります', 'norimasu', 'Naik (kendaraan)', 'Kata Kerja Dasar', '電車に乗ります。', 'Naik kereta listrik.'],
  ['降ります', 'おります', 'orimasu', 'Turun (dari kendaraan)', 'Kata Kerja Dasar', 'バスを降ります。', 'Turun dari bus.'],
  ['乗り換えます', 'のりかえます', 'norikaemasu', 'Pindah / Transit kendaraan', 'Kata Kerja Dasar', '新宿で乗り換えます。', 'Transit di Shinjuku.'],
  ['浴びます', 'あびます', 'abimasu', 'Mandi guyur (shower)', 'Kata Kerja Dasar', 'シャワーを浴びます。', 'Mandi shower.'],
  ['入れます', 'いれます', 'iremasu', 'Memasukkan', 'Kata Kerja Dasar', 'お金を財布に入れます。', 'Memasukkan uang ke dompet.'],
  ['下ろします', 'おろします', 'oroshimasu', 'Menarik uang (di bank/ATM)', 'Kata Kerja Dasar', '銀行でお金を下ろします。', 'Menarik uang di bank.'],
  ['押します', 'おします', 'oshimasu', 'Menekan / Mendorong (tombol)', 'Kata Kerja Dasar', 'ボタンを押します。', 'Menekan tombol.'],
  ['覚えます', 'おぼえます', 'oboemasu', 'Mengingat / Menghafal', 'Kata Kerja Dasar', '漢字を覚えます。', 'Menghafal kanji.'],
  ['忘れます', 'わすれます', 'wasuremasu', 'Lupa', 'Kata Kerja Dasar', '約束を忘れました。', 'Lupa janji.'],
  ['なくします', 'なくします', 'nakushimasu', 'Kehilangan (barang)', 'Kata Kerja Dasar', '財布をなくしました。', 'Kehilangan dompet.'],
  ['払います', 'はらいます', 'haraimasu', 'Membayar', 'Kata Kerja Dasar', 'お金を払います。', 'Membayar uang.'],
  ['返します', 'かえします', 'kaeshimasu', 'Mengembalikan (pinjaman)', 'Kata Kerja Dasar', '本を返します。', 'Mengembalikan buku.'],
  ['出かけます', 'でかけます', 'dekakemasu', 'Bepergian keluar rumah', 'Kata Kerja Dasar', '休みの日に出かけます。', 'Bepergian pada hari libur.'],
  ['脱ぎます', 'ぬぎます', 'nugimasu', 'Membuka (baju/sepatu)', 'Kata Kerja Dasar', '靴を脱いでください。', 'Tolong buka sepatu Anda.'],
  ['持って行きます', 'もっていきます', 'motte ikimasu', 'Membawa pergi barang', 'Kata Kerja Dasar', '傘を持って行きます。', 'Membawa payung pergi.'],
  ['持って来ます', 'もってきます', 'motte kimasu', 'Membawa kemari barang', 'Kata Kerja Dasar', '宿題を持って来ました。', 'Membawa PR kemari.'],
  ['心配します', 'しんぱいします', 'shinpaishimasu', 'Cemas / Khawatir', 'Kata Kerja Dasar', '心配しないでください。', 'Jangan khawatir.'],
  ['残業します', 'ざんぎょうします', 'zangyoushimasu', 'Kerja lembur', 'Kata Kerja Dasar', '今夜残業します。', 'Malam ini bekerja lembur.'],
  ['出張します', 'しゅっちょうします', 'shucchoushimasu', 'Dinas luar kota', 'Kata Kerja Dasar', '大阪へ出張します。', 'Dinas luar kota ke Osaka.'],
  ['洗います', 'あらいます', 'araimasu', 'Mencuci (tangan/baju)', 'Kata Kerja Dasar', '手をきれいに洗います。', 'Mencuci tangan sampai bersih.'],
  ['弾きます', 'ひきます', 'hikimasu', 'Memetik / Memainkan (piano/gitar)', 'Kata Kerja Dasar', 'ピアノを弾きます。', 'Memainkan piano.'],
  ['歌います', 'うたいます', 'utaimasu', 'Menyanyi', 'Kata Kerja Dasar', '歌を歌います。', 'Menyanyikan lagu.'],
  ['集めます', 'あつめます', 'atsumemasu', 'Mengumpulkan / Mengoleksi', 'Kata Kerja Dasar', '切手を集めています。', 'Mengoleksi perangko.'],
  ['捨てます', 'すてます', 'sutemasu', 'Membuang (sampah)', 'Kata Kerja Dasar', 'ゴミを捨てます。', 'Membuang sampah.'],
  ['換えます', 'かえます', 'kaemasu', 'Menukar / Mengganti', 'Kata Kerja Dasar', 'お金を両替します。', 'Menukar uang.'],
  ['運転します', 'うんてんします', 'untenshimasu', 'Menyetir / Mengemudi', 'Kata Kerja Dasar', '車を運転します。', 'Mengemudikan mobil.'],
  ['予約します', 'よやくします', 'yoyakushimasu', 'Memesan / Reservasi tempat', 'Kata Kerja Dasar', 'ホテルを予約します。', 'Memesan kamar hotel.'],
  ['登ります', 'のぼります', 'noborimasu', 'Mendaki / Memanjat (gunung)', 'Kata Kerja Dasar', '山に登ります。', 'Mendaki gunung.'],
  ['泊まります', 'とまります', 'tomarimasu', 'Menginap di hotel/rumah', 'Kata Kerja Dasar', 'ホテルに泊まります。', 'Menginap di hotel.'],
  ['掃除します', 'そうじします', 'soujishimasu', 'Membersihkan (kamar/rumah)', 'Kata Kerja Dasar', '部屋を掃除します。', 'Membersihkan kamar.'],
  ['洗濯します', 'せんたくします', 'sentakushimasu', 'Mencuci pakaian', 'Kata Kerja Dasar', '服を洗濯します。', 'Mencuci pakaian.'],
  ['練習します', 'れんしゅうします', 'renshuushimasu', 'Berlatih / Latihan', 'Kata Kerja Dasar', '会話を練習します。', 'Berlatih percakapan.'],
  ['なります', 'なります', 'narimasu', 'Menjadi / Berubah jadi', 'Kata Kerja Dasar', '医者になりたいです。', 'Ingin menjadi dokter.'],
  ['要ります', 'いります', 'irimasu', 'Memerlukan / Butuh', 'Kata Kerja Dasar', 'ビザが要ります。', 'Memerlukan visa.'],
  ['調べます', 'しらべます', 'shirabemasu', 'Memeriksa / Menyelidiki', 'Kata Kerja Dasar', '辞書で言葉を調べます。', 'Mencari kata di kamus.'],
  ['直します', 'なおします', 'naoshimasu', 'Memperbaiki / Membetulkan', 'Kata Kerja Dasar', '間違いを直します。', 'Membetulkan kesalahan.'],
  ['修理します', 'しゅうりします', 'shuurishimasu', 'Mereparasi / Menservis mesin', 'Kata Kerja Dasar', '自転車を修理します。', 'Mereparasi sepeda.'],
  ['電話します', 'でんわします', 'denwashimasu', 'Menelepon seseorang', 'Kata Kerja Dasar', '友達に電話します。', 'Menelepon kawan.'],
  ['思います', 'おもいます', 'omoimasu', 'Berpikir / Mengira', 'Kata Kerja Dasar', 'いいと思います。', 'Saya kira bagus.'],
  ['言います', 'いいます', 'iimasu', 'Berkata / Mengatakan', 'Kata Kerja Dasar', 'ありがとうと言いました。', 'Mengucapkan terima kasih.'],
  ['勝ちます', 'かちます', 'kachimasu', 'Menang', 'Kata Kerja Dasar', '試合に勝ちました。', 'Menang dalam pertandingan.'],
  ['負けます', 'まけます', 'makemasu', 'Kalah', 'Kata Kerja Dasar', '試合に負けました。', 'Kalah dalam pertandingan.'],
  ['動きます', 'うごきます', 'ugokimasu', 'Bergerak / Berfungsi (mesin)', 'Kata Kerja Dasar', '時計が動きません。', 'Jamnya tidak bergerak.'],
  ['やめます', 'やめます', 'yamemasu', 'Berhenti / Mengundurkan diri', 'Kata Kerja Dasar', '会社をやめます。', 'Berhenti dari perusahaan.'],
  ['気をつけます', 'きをつけます', 'ki o tsukemasu', 'Berhati-hati / Waspada', 'Kata Kerja Dasar', '車に気をつけます。', 'Berhati-hati terhadap mobil.'],
  ['留学します', 'りゅうがくします', 'ryuugakushimasu', 'Studi di luar negeri', 'Kata Kerja Dasar', '日本へ留学します。', 'Studi ke Jepang.'],
  ['着ます', 'きます', 'kimasu', 'Memakai (baju atasan/kemeja)', 'Kata Kerja Dasar', 'シャツを着ます。', 'Memakai kemeja.'],
  ['履きます', 'はきます', 'hakimasu', 'Memakai (celana/sepatu/kaus kaki)', 'Kata Kerja Dasar', '靴を履きます。', 'Memakai sepatu.'],
  ['かぶります', 'かぶります', 'kaburimasu', 'Memakai (topi di kepala)', 'Kata Kerja Dasar', '帽子をかぶります。', 'Memakai topi.'],
  ['かけます', 'かけます', 'kakemasu', 'Memakai (kacamata)', 'Kata Kerja Dasar', '眼鏡をかけます。', 'Memakai kacamata.'],
  ['生まれます', 'うまれます', 'umaremasu', 'Lahir ke dunia', 'Kata Kerja Dasar', '日本で生まれました。', 'Lahir di Jepang.'],
  ['回します', 'まわします', 'mawashimasu', 'Memutar (keran/tombol)', 'Kata Kerja Dasar', 'これを右へ回します。', 'Putar ini ke kanan.'],
  ['引きます', 'ひきます', 'hikimasu', 'Menarik (pintu/laci)', 'Kata Kerja Dasar', 'ドアを引きます。', 'Menarik pintu.'],
  ['変えます', 'かえます', 'kaemasu', 'Mengubah / Menukar', 'Kata Kerja Dasar', '時間を変えます。', 'Mengubah waktu.'],
  ['触ります', 'さわります', 'sawarimasu', 'Menyentuh / Meraba', 'Kata Kerja Dasar', '機械に触らないでください。', 'Jangan menyentuh mesin.'],
  ['歩きます', 'あるきます', 'arukimasu', 'Berjalan kaki', 'Kata Kerja Dasar', '駅まで歩きます。', 'Berjalan kaki sampai stasiun.'],
  ['渡ります', 'わたります', 'watarimasu', 'Menyeberang (jembatan/jalan)', 'Kata Kerja Dasar', '橋を渡ります。', 'Menyeberangi jembatan.'],
  ['くれます', 'くれます', 'kuremasu', 'Memberi (kepada saya)', 'Kata Kerja Dasar', '友達が本をくれました。', 'Teman memberi saya buku.'],
  ['連れて行きます', 'つれていきます', 'tsurete ikimasu', 'Mengajak pergi (orang/anak)', 'Kata Kerja Dasar', '子供を公園へ連れて行きます。', 'Mengajak anak ke taman.'],
  ['連れて来ます', 'つれてきます', 'tsurete kimasu', 'Mengajak datang kemari', 'Kata Kerja Dasar', '友達を連れて来ました。', 'Membawa teman kemari.'],
  ['案内します', 'あんないします', 'annaishimasu', 'Memandu / Menunjukkan jalan', 'Kata Kerja Dasar', '東京を案内します。', 'Memandu keliling Tokyo.'],
  ['説明します', 'せつめいします', 'setsumeishimasu', 'Menjelaskan / Menerangkan', 'Kata Kerja Dasar', '文法を説明します。', 'Menjelaskan tata bahasa.'],
  ['考えます', 'かんがえます', 'kangaemasu', 'Memikirkan / Merenungkan', 'Kata Kerja Dasar', 'よく考えます。', 'Memikirkan dengan baik.'],
  ['着きます', 'つきます', 'tsukimasu', 'Tiba / Sampai di tujuan', 'Kata Kerja Dasar', '駅に着きました。', 'Tiba di stasiun.'],
  ['頑張ります', 'がんばります', 'ganbarimasu', 'Berjuang / Berusaha keras', 'Kata Kerja Dasar', 'テストを頑張ります。', 'Berjuang dalam ujian.']
];

// 2. KATA SIFAT (形容詞 - Keiyoushi)
const N5_ADJECTIVES = [
  ['大きい', 'おおきい', 'ookii', 'Besar', 'Kata Sifat', '大きな家に住んでいます。', 'Tinggal di rumah yang besar.'],
  ['小さい', 'ちいさい', 'chiisai', 'Kecil', 'Kata Sifat', '小さい犬がいます。', 'Ada anjing kecil.'],
  ['新しい', 'あたらしい', 'atarashii', 'Baru', 'Kata Sifat', '新しい靴を買いました。', 'Membeli sepatu baru.'],
  ['古い', 'ふるい', 'furui', 'Lama / Tua / Kuno', 'Kata Sifat', '古い本を読みます。', 'Membaca buku lama.'],
  ['いい', 'いい', 'ii', 'Bagus / Baik', 'Kata Sifat', '今日はいい天気です。', 'Hari ini cuacanya bagus.'],
  ['悪い', 'わるい', 'warui', 'Buruk / Jelek', 'Kata Sifat', '気分が悪いです。', 'Merasa tidak enak badan.'],
  ['暑い', 'あつい', 'atsui', 'Panas (suhu cuaca)', 'Kata Sifat', '夏はとても暑いです。', 'Musim panas sangat panas.'],
  ['熱い', 'あつい', 'atsui', 'Panas (benda/minuman)', 'Kata Sifat', '熱いお茶を飲みます。', 'Minum teh panas.'],
  ['寒い', 'さむい', 'samui', 'Dingin (suhu cuaca)', 'Kata Sifat', '冬は寒いです。', 'Musim dingin sangat dingin.'],
  ['冷たい', 'つめたい', 'tsumetai', 'Dingin (benda/minuman)', 'Kata Sifat', '冷たい水をください。', 'Tolong beri air dingin.'],
  ['難しい', 'むずかしい', 'muzukashii', 'Sukar / Sulit', 'Kata Sifat', '漢字は難しいです。', 'Kanji itu sulit.'],
  ['易しい', 'やさしい', 'yasashii', 'Mudah / Gampang', 'Kata Sifat', 'テストは易しかったです。', 'Ujiannya mudah.'],
  ['高い', 'たかい', 'takai', 'Tinggi / Mahal harganya', 'Kata Sifat', '富士山は高い山です。', 'Gunung Fuji adalah gunung yang tinggi.'],
  ['安い', 'やすい', 'yasui', 'Murah harganya', 'Kata Sifat', 'この店は安いです。', 'Toko ini murah.'],
  ['低い', 'ひくい', 'hikui', 'Rendah (posisi/suara)', 'Kata Sifat', '低い山に登ります。', 'Mendaki gunung yang rendah.'],
  ['面白い', 'おもしろい', 'omoshiroi', 'Menarik / Lucu', 'Kata Sifat', '面白い映画を見ました。', 'Menonton film yang menarik.'],
  ['美味しい', 'おいしい', 'oishii', 'Enak / Lezat', 'Kata Sifat', 'とても美味しいラーメンです。', 'Ramen yang sangat lezat.'],
  ['忙しい', 'いそがしい', 'isogashii', 'Sibuk banyak urusan', 'Kata Sifat', '今日は仕事で忙しいです。', 'Hari ini sibuk dengan pekerjaan.'],
  ['楽しい', 'たのしい', 'tanoshii', 'Menyenangkan / Gembira', 'Kata Sifat', 'パーティーは楽しかったです。', 'Pestanya sangat menyenangkan.'],
  ['白い', 'しろい', 'shiroi', 'Putih', 'Kata Sifat', '白いシャツを着ます。', 'Memakai kemeja putih.'],
  ['黒い', 'くろい', 'kuroi', 'Hitam', 'Kata Sifat', '黒い車に乗ります。', 'Naik mobil hitam.'],
  ['赤い', 'あかい', 'akai', 'Merah', 'Kata Sifat', '赤いリンゴを食べます。', 'Makan apel merah.'],
  ['青い', 'あおい', 'aoi', 'Biru', 'Kata Sifat', '青い空がきれいです。', 'Langit biru sangat indah.'],
  ['好き', 'すき', 'suki', 'Suka / Gemar', 'Kata Sifat', '猫が好きです。', 'Saya suka kucing.'],
  ['嫌い', 'きらい', 'kirai', 'Benci / Tidak suka', 'Kata Sifat', '辛いものが嫌いです。', 'Tidak suka makanan pedas.'],
  ['上手', 'じょうず', 'jouzu', 'Pandai / Mahir', 'Kata Sifat', '日本語が上手ですね。', 'Bahasa Jepang Anda mahir ya.'],
  ['下手', 'へた', 'heta', 'Kurang pandai / Ceroboh', 'Kata Sifat', '料理が下手です。', 'Kurang pandai memasak.'],
  ['綺麗', 'きれい', 'kirei', 'Cantik / Bersih rapi', 'Kata Sifat', '桜の花が綺麗です。', 'Bunga sakura sangat indah.'],
  ['静か', 'しずか', 'shizuka', 'Tenang / Senyap', 'Kata Sifat', '図書館は静かです。', 'Perpustakaan itu tenang.'],
  ['賑やか', 'にぎやか', 'nigiyaka', 'Ramai meriah', 'Kata Sifat', '新宿は賑やかです。', 'Shinjuku sangat ramai.'],
  ['有名', 'ゆうめい', 'yuumei', 'Terkenal / Mashur', 'Kata Sifat', '有名な神社へ行きます。', 'Pergi ke kuil terkenal.'],
  ['親切', 'しんせつ', 'shinsetsu', 'Ramah / Baik hati', 'Kata Sifat', '親切な人に出会いました。', 'Bertemu orang yang ramah.'],
  ['元気', 'げんき', 'genki', 'Sehat bugar / Bersemangat', 'Kata Sifat', 'お元気ですか。', 'Apakah Anda sehat?'],
  ['暇', 'ひま', 'hima', 'Senggang / Luang waktu', 'Kata Sifat', '日曜日は暇です。', 'Hari Minggu saya senggang.'],
  ['便利', 'べんり', 'benri', 'Praktis / Memudahkan', 'Kata Sifat', '地下鉄はとても便利です。', 'Kereta bawah tanah sangat praktis.'],
  ['不便', 'ふべん', 'fuben', 'Tidak praktis / Merepotkan', 'Kata Sifat', '車がないと不便です。', 'Jika tidak ada mobil terasa tidak praktis.'],
  ['簡単', 'かんたん', 'kantan', 'Sederhana / Mudah', 'Kata Sifat', '簡単な問題です。', 'Pertanyaan yang mudah.'],
  ['近い', 'ちかい', 'chikai', 'Dekat jaraknya', 'Kata Sifat', '駅から近いです。', 'Dekat dari stasiun.'],
  ['遠い', 'とおい', 'tooi', 'Jauh jaraknya', 'Kata Sifat', '学校は家から遠いです。', 'Sekolah jauh dari rumah.'],
  ['速い', 'はやい', 'hayai', 'Cepat lajunya / Kencang', 'Kata Sifat', '新幹線は速いです。', 'Shinkansen sangat cepat.'],
  ['早い', 'はやい', 'hayai', 'Awal / Pagi sekali', 'Kata Sifat', '朝早く起きます。', 'Bangun pagi-pagi sekali.'],
  ['遅い', 'おそい', 'osoi', 'Lambat / Terlambat', 'Kata Sifat', '足が遅いです。', 'Langkahnya lambat.'],
  ['多い', 'おおい', 'ooi', 'Banyak (jumlah)', 'Kata Sifat', '人が多いです。', 'Banyak orang.'],
  ['少ない', 'すくない', 'sukunai', 'Sedikit (jumlah)', 'Kata Sifat', '雨が少ないです。', 'Curah hujan sedikit.'],
  ['暖かい', 'あたたかい', 'atatakai', 'Hangat (cuaca udara)', 'Kata Sifat', '春は暖かいです。', 'Musim semi itu hangat.'],
  ['温かい', 'あたたかい', 'atatakai', 'Hangat (makanan/minuman)', 'Kata Sifat', '温かいスープを飲みます。', 'Minum sup hangat.'],
  ['涼しい', 'すずしい', 'suzushii', 'Sejuk semilir', 'Kata Sifat', '秋は涼しいです。', 'Musim gugur itu sejuk.'],
  ['甘い', 'あまい', 'amai', 'Manis rasanya', 'Kata Sifat', 'このケーキは甘いです。', 'Kue ini manis.'],
  ['辛い', 'からい', 'karai', 'Pedas / Asin menusuk', 'Kata Sifat', '辛いカレーを食べます。', 'Makan kari pedas.'],
  ['重い', 'おもい', 'omoi', 'Berat bebannya', 'Kata Sifat', '荷物が重いです。', 'Barang bawaannya berat.'],
  ['軽い', 'かるい', 'karui', 'Ringan bebannya', 'Kata Sifat', 'この鞄は軽いです。', 'Tas ini ringan.'],
  ['広い', 'ひろい', 'hiroi', 'Luas / Lapang', 'Kata Sifat', '広い公園で遊びます。', 'Bermain di taman yang luas.'],
  ['狭い', 'せまい', 'semai', 'Sempit', 'Kata Sifat', '部屋が狭いです。', 'Kamarnya sempit.'],
  ['若い', 'わかい', 'wakai', 'Muda usianya', 'Kata Sifat', '先生は若いです。', 'Gurunya masih muda.'],
  ['長い', 'ながい', 'nagai', 'Panjang (waktu/benda)', 'Kata Sifat', '夏休みは長いです。', 'Libur musim panas cukup panjang.'],
  ['短い', 'みじかい', 'mijikai', 'Pendek / Singkat', 'Kata Sifat', '髪を短く切りました。', 'Memotong rambut menjadi pendek.'],
  ['明るい', 'あかるい', 'akarui', 'Terang / Ceria', 'Kata Sifat', '明るい部屋です。', 'Ruangan yang terang.'],
  ['暗い', 'くらい', 'kurai', 'Gelap / Muram', 'Kata Sifat', '夜は道が暗いです。', 'Di malam hari jalannya gelap.'],
  ['大切', 'たいせつ', 'taisetsu', 'Penting / Berharga', 'Kata Sifat', '家族はとても大切です。', 'Keluarga sangat berharga.'],
  ['大丈夫', 'だいじょうぶ', 'daijoubu', 'Tidak apa-apa / Aman', 'Kata Sifat', '大丈夫ですか。', 'Apakah Anda baik-baik saja?'],
  ['危ない', 'あぶない', 'abunai', 'Berbahaya', 'Kata Sifat', 'ここは危ないです。', 'Di sini berbahaya.'],
  ['欲しい', 'ほしい', 'hoshii', 'Ingin / Mau memiliki', 'Kata Sifat', '新しい車が欲しいです。', 'Saya ingin mobil baru.'],
  ['寂しい', 'さびしい', 'sabishii', 'Kesepian / Sepi', 'Kata Sifat', '一人で寂しいです。', 'Merasa kesepian sendirian.'],
  ['眠い', 'ねむい', 'nemui', 'Mengantuk', 'Kata Sifat', 'とても眠いです。', 'Sangat mengantuk.'],
  ['強い', 'つよい', 'tsuyoi', 'Kuat / Tangguh', 'Kata Sifat', '風が強いです。', 'Anginnya bertiup kencang/kuat.'],
  ['弱い', 'よわい', 'yowai', 'Lemah', 'Kata Sifat', '体が弱いです。', 'Fisiknya lemah.'],
  ['素敵', 'すてき', 'suteki', 'Bagus sekali / Menawan', 'Kata Sifat', '素敵な服ですね。', 'Pakaian yang sangat menawan ya.']
];

// 3. PENUNJUK WAKTU DAN ANGKA (時間・数字 - Jikan & Suuji)
const N5_TIME_NUMBERS = [
  ['一', 'いち', 'ichi', 'Satu (angka 1)', 'Penunjuk Waktu dan Angka', '一円', 'Satu yen.'],
  ['二', 'に', 'ni', 'Dua (angka 2)', 'Penunjuk Waktu dan Angka', '二月', 'Bulan Februari.'],
  ['三', 'さん', 'san', 'Tiga (angka 3)', 'Penunjuk Waktu dan Angka', '三日', 'Tanggal tiga.'],
  ['四', 'よん', 'yon', 'Empat (angka 4)', 'Penunjuk Waktu dan Angka', '四時', 'Pukul empat.'],
  ['五', 'ご', 'go', 'Lima (angka 5)', 'Penunjuk Waktu dan Angka', '五人', 'Lima orang.'],
  ['六', 'ろく', 'roku', 'Enam (angka 6)', 'Penunjuk Waktu dan Angka', '六階', 'Lantai enam.'],
  ['七', 'なな', 'nana', 'Tujuh (angka 7)', 'Penunjuk Waktu dan Angka', '七時', 'Pukul tujuh.'],
  ['八', 'はち', 'hachi', 'Delapan (angka 8)', 'Penunjuk Waktu dan Angka', '八月', 'Bulan Agustus.'],
  ['九', 'きゅう', 'kyuu', 'Sembilan (angka 9)', 'Penunjuk Waktu dan Angka', '九時', 'Pukul sembilan.'],
  ['十', 'じゅう', 'juu', 'Sepuluh (angka 10)', 'Penunjuk Waktu dan Angka', '十歳', 'Usia sepuluh tahun.'],
  ['百', 'ひゃく', 'hyaku', 'Seratus (angka 100)', 'Penunjuk Waktu dan Angka', '百円', 'Seratus yen.'],
  ['千', 'せん', 'sen', 'Seribu (angka 1.000)', 'Penunjuk Waktu dan Angka', '千人', 'Seribu orang.'],
  ['万', 'まん', 'man', 'Sepuluh ribu (angka 10.000)', 'Penunjuk Waktu dan Angka', '一万円', 'Sepuluh ribu yen.'],
  ['零', 'れい', 'rei', 'Nol (angka 0)', 'Penunjuk Waktu dan Angka', '零度', 'Nol derajat.'],
  ['一つ', 'ひとつ', 'hitotsu', 'Satu buah', 'Penunjuk Waktu dan Angka', 'リンゴを一つ食べます。', 'Makan satu buah apel.'],
  ['二つ', 'ふたつ', 'futatsu', 'Dua buah', 'Penunjuk Waktu dan Angka', 'パンを二つ買いました。', 'Membeli dua buah roti.'],
  ['三つ', 'みっつ', 'mittsu', 'Tiga buah', 'Penunjuk Waktu dan Angka', '箱が三つあります。', 'Ada tiga buah kotak.'],
  ['四つ', 'よっつ', 'yottsu', 'Empat buah', 'Penunjuk Waktu dan Angka', 'みかんを四つください。', 'Minta empat buah jeruk.'],
  ['五つ', 'いつつ', 'itsutsu', 'Lima buah', 'Penunjuk Waktu dan Angka', '卵が五つあります。', 'Ada lima butir telur.'],
  ['六つ', 'むっつ', 'muttsu', 'Enam buah', 'Penunjuk Waktu dan Angka', '椅子が六つあります。', 'Ada enam buah kursi.'],
  ['七つ', 'ななつ', 'nanatsu', 'Tujuh buah', 'Penunjuk Waktu dan Angka', '机が七つあります。', 'Ada tujuh buah meja.'],
  ['八つ', 'やっつ', 'yattsu', 'Delapan buah', 'Penunjuk Waktu dan Angka', 'ノートを八つ買いました。', 'Membeli delapan buah buku catatan.'],
  ['九つ', 'ここのつ', 'kokonotsu', 'Sembilan buah', 'Penunjuk Waktu dan Angka', '鞄が九つあります。', 'Ada sembilan buah tas.'],
  ['十', 'とお', 'too', 'Sepuluh buah', 'Penunjuk Waktu dan Angka', '十個あります。', 'Ada sepuluh buah.'],
  ['一人', 'ひとり', 'hitori', 'Satu orang / Sendirian', 'Penunjuk Waktu dan Angka', '一人で行きます。', 'Pergi sendirian.'],
  ['二人', 'ふたり', 'futari', 'Dua orang', 'Penunjuk Waktu dan Angka', '二人で食べます。', 'Makan berdua.'],
  ['三人', 'さんにん', 'sannin', 'Tiga orang', 'Penunjuk Waktu dan Angka', '学生が三人います。', 'Ada tiga orang murid.'],
  ['四人', 'よにん', 'yonin', 'Empat orang', 'Penunjuk Waktu dan Angka', '家族は四人です。', 'Keluarga saya empat orang.'],
  ['五人', 'ごにん', 'gonin', 'Lima orang', 'Penunjuk Waktu dan Angka', '五人で旅行します。', 'Berwisata lima orang.'],
  ['今', 'いま', 'ima', 'Sekarang', 'Penunjuk Waktu dan Angka', '今何時ですか。', 'Sekarang jam berapa?'],
  ['時', 'じ', 'ji', 'Pukul / Jam', 'Penunjuk Waktu dan Angka', '一時です。', 'Pukul satu.'],
  ['分', 'ふん', 'fun', 'Menit', 'Penunjuk Waktu dan Angka', '五分待ちます。', 'Menunggu lima menit.'],
  ['半', 'はん', 'han', 'Setengah (30 menit)', 'Penunjuk Waktu dan Angka', '二時半です。', 'Pukul dua lewat tiga puluh menit.'],
  ['午前', 'ごぜん', 'gozen', 'Pagi hari (a.m.)', 'Penunjuk Waktu dan Angka', '午前九時です。', 'Pukul 09.00 pagi.'],
  ['午後', 'ごご', 'gogo', 'Sore/Malam (p.m.)', 'Penunjuk Waktu dan Angka', '午後三時です。', 'Pukul 03.00 sore.'],
  ['朝', 'あさ', 'asa', 'Pagi', 'Penunjuk Waktu dan Angka', '朝ご飯を食べます。', 'Makan sarapan pagi.'],
  ['昼', 'ひる', 'hiru', 'Siang', 'Penunjuk Waktu dan Angka', 'お昼休みです。', 'Istirahat siang.'],
  ['晩', 'ばん', 'ban', 'Malam hari', 'Penunjuk Waktu dan Angka', '晩ご飯を食べます。', 'Makan malam.'],
  ['夜', 'よる', 'yoru', 'Malam hari (larut)', 'Penunjuk Waktu dan Angka', '夜寝ます。', 'Tidur di malam hari.'],
  ['一昨日', 'おととい', 'ototoi', 'Kemarin lusa', 'Penunjuk Waktu dan Angka', '一昨日着きました。', 'Tiba kemarin lusa.'],
  ['昨日', 'きのう', 'kinou', 'Kemarin', 'Penunjuk Waktu dan Angka', '昨日は休みでした。', 'Kemarin libur.'],
  ['今日', 'きょう', 'kyou', 'Hari ini', 'Penunjuk Waktu dan Angka', '今日は月曜日です。', 'Hari ini hari Senin.'],
  ['明日', 'あした', 'ashita', 'Besok', 'Penunjuk Waktu dan Angka', '明日テストがあります。', 'Besok ada ujian.'],
  ['明後日', 'あさって', 'asatte', 'Lusa', 'Penunjuk Waktu dan Angka', '明後日会いましょう。', 'Mari bertemu lusa.'],
  ['今朝', 'けさ', 'kesa', 'Tadi pagi', 'Penunjuk Waktu dan Angka', '今朝六時に起きました。', 'Tadi pagi bangun jam enam.'],
  ['今晩', 'こんばん', 'konban', 'Malam ini', 'Penunjuk Waktu dan Angka', '今晩電話します。', 'Malam ini akan menelepon.'],
  ['毎朝', 'まいあさ', 'maiasa', 'Setiap pagi', 'Penunjuk Waktu dan Angka', '毎朝新聞を読みます。', 'Setiap pagi membaca koran.'],
  ['毎晩', 'まいばん', 'maiban', 'Setiap malam', 'Penunjuk Waktu dan Angka', '毎晩日本語を勉強します。', 'Setiap malam belajar bahasa Jepang.'],
  ['毎日', 'まいにち', 'mainichi', 'Setiap hari', 'Penunjuk Waktu dan Angka', '毎日運動します。', 'Setiap hari berolahraga.'],
  ['月曜日', 'げつようび', 'getsuyoubi', 'Hari Senin', 'Penunjuk Waktu dan Angka', '月曜日に始まります。', 'Dimulai pada hari Senin.'],
  ['火曜日', 'かようび', 'kayoubi', 'Hari Selasa', 'Penunjuk Waktu dan Angka', '火曜日は休みです。', 'Hari Selasa libur.'],
  ['水曜日', 'すいようび', 'suiyoubi', 'Hari Rabu', 'Penunjuk Waktu dan Angka', '水曜日に買い物します。', 'Berbelanja pada hari Rabu.'],
  ['木曜日', 'もくようび', 'mokuyoubi', 'Hari Kamis', 'Penunjuk Waktu dan Angka', '木曜日に会議があります。', 'Ada rapat pada hari Kamis.'],
  ['金曜日', 'きんようび', 'kinyoubi', 'Hari Jumat', 'Penunjuk Waktu dan Angka', '金曜日の夜に出かけます。', 'Bepergian pada Jumat malam.'],
  ['土曜日', 'どようび', 'doyoubi', 'Hari Sabtu', 'Penunjuk Waktu dan Angka', '土曜日はパーティーです。', 'Hari Sabtu ada pesta.'],
  ['日曜日', 'にちようび', 'nichiyoubi', 'Hari Minggu', 'Penunjuk Waktu dan Angka', '日曜日に教会へ行きます。', 'Pergi ke gereja hari Minggu.'],
  ['先週', 'せんしゅう', 'senshuu', 'Minggu lalu', 'Penunjuk Waktu dan Angka', '先週旅行しました。', 'Berwisata minggu lalu.'],
  ['今週', 'こんしゅう', 'konshuu', 'Minggu ini', 'Penunjuk Waktu dan Angka', '今週は忙しいです。', 'Minggu ini sangat sibuk.'],
  ['来週', 'らいしゅう', 'raishuu', 'Minggu depan', 'Penunjuk Waktu dan Angka', '来週日本へ行きます。', 'Pergi ke Jepang minggu depan.'],
  ['先月', 'せんげつ', 'sengetsu', 'Bulan lalu', 'Penunjuk Waktu dan Angka', '先月車を買いました。', 'Membeli mobil bulan lalu.'],
  ['今月', 'こんげつ', 'kongetsu', 'Bulan ini', 'Penunjuk Waktu dan Angka', '今月の給料です。', 'Gaji bulan ini.'],
  ['来月', 'らいげつ', 'raigetsu', 'Bulan depan', 'Penunjuk Waktu dan Angka', '来月引っ越します。', 'Pindah rumah bulan depan.'],
  ['去年', 'きょねん', 'kyonen', 'Tahun lalu', 'Penunjuk Waktu dan Angka', '去年大学を卒業しました。', 'Lulus kuliah tahun lalu.'],
  ['今年', 'ことし', 'kotoshi', 'Tahun ini', 'Penunjuk Waktu dan Angka', '今年二十歳になります。', 'Tahun ini berusia 20 tahun.'],
  ['来年', 'らいねん', 'rainen', 'Tahun depan', 'Penunjuk Waktu dan Angka', '来年留学します。', 'Studi ke luar negeri tahun depan.'],
  ['一日', 'ついたち', 'tsuitachi', 'Tanggal 1', 'Penunjuk Waktu dan Angka', '一月一日', 'Tanggal satu Januari.'],
  ['二日', 'ふつか', 'futsuka', 'Tanggal 2 / 2 hari', 'Penunjuk Waktu dan Angka', '二日間休みます。', 'Libur dua hari.'],
  ['三日', 'みっか', 'mikka', 'Tanggal 3 / 3 hari', 'Penunjuk Waktu dan Angka', '三日後に会います。', 'Bertemu tiga hari lagi.'],
  ['四日', 'よっか', 'yokka', 'Tanggal 4 / 4 hari', 'Penunjuk Waktu dan Angka', '四月四日', 'Tanggal empat April.'],
  ['五日', 'いつか', 'itsuka', 'Tanggal 5 / 5 hari', 'Penunjuk Waktu dan Angka', '五月五日', 'Tanggal lima Mei.'],
  ['六日', 'むいか', 'muika', 'Tanggal 6 / 6 hari', 'Penunjuk Waktu dan Angka', '六月六日', 'Tanggal enam Juni.'],
  ['七日', 'なのか', 'nanoka', 'Tanggal 7 / 7 hari', 'Penunjuk Waktu dan Angka', '七月七日', 'Tanggal tujuh Juli.'],
  ['八日', 'ようか', 'youka', 'Tanggal 8 / 8 hari', 'Penunjuk Waktu dan Angka', '八月八日', 'Tanggal delapan Agustus.'],
  ['九日', 'ここのか', 'kokonoka', 'Tanggal 9 / 9 hari', 'Penunjuk Waktu dan Angka', '九月九日', 'Tanggal sembilan September.'],
  ['十日', 'とおか', 'tooka', 'Tanggal 10 / 10 hari', 'Penunjuk Waktu dan Angka', '十日間滞在します。', 'Tinggal selama sepuluh hari.'],
  ['十四日', 'じゅうよっか', 'juuyokka', 'Tanggal 14', 'Penunjuk Waktu dan Angka', '二月十四日', 'Tanggal 14 Februari.'],
  ['二十日', 'はつか', 'hatsuka', 'Tanggal 20', 'Penunjuk Waktu dan Angka', '毎月二十日', 'Setiap tanggal 20.'],
  ['二十四日', 'にじゅうよっか', 'nijuuyokka', 'Tanggal 24', 'Penunjuk Waktu dan Angka', '十二月二十四日', 'Tanggal 24 Desember.']
];

// 4. KATA TANYA DAN KATA GANTI (疑問詞・代名詞)
const N5_INTERROGATIVES_PRONOUNS = [
  ['私', 'わたし', 'watashi', 'Saya / Aku', 'Kata Tanya dan Kata Ganti', '私は学生です。', 'Saya adalah seorang pelajar.'],
  ['あなた', 'あなた', 'anata', 'Anda / Kamu', 'Kata Tanya dan Kata Ganti', 'あなたは先生ですか。', 'Apakah Anda seorang guru?'],
  ['あの人', 'あのひと', 'ano hito', 'Orang itu (netral)', 'Kata Tanya dan Kata Ganti', 'あの人は誰ですか。', 'Siapakah orang itu?'],
  ['あの方', 'あのかた', 'ano kata', 'Orang itu (sopan)', 'Kata Tanya dan Kata Ganti', 'あの方はどなたですか。', 'Siapakah beliau itu?'],
  ['誰', 'だれ', 'dare', 'Siapa', 'Kata Tanya dan Kata Ganti', '誰と行きますか。', 'Pergi dengan siapa?'],
  ['どなた', 'どなた', 'donata', 'Siapa (bentuk sopan)', 'Kata Tanya dan Kata Ganti', 'どなたですか。', 'Dengan siapa ya?'],
  ['何', 'なに', 'nani', 'Apa', 'Kata Tanya dan Kata Ganti', 'これは何ですか。', 'Ini apa?'],
  ['何時', 'なんじ', 'nanji', 'Jam berapa', 'Kata Tanya dan Kata Ganti', '今何時ですか。', 'Sekarang jam berapa?'],
  ['何分', 'なんぷん', 'nanpun', 'Berapa menit', 'Kata Tanya dan Kata Ganti', 'あと何分ですか。', 'Tinggal berapa menit lagi?'],
  ['何歳', 'なんさい', 'nansai', 'Berapa umurnya', 'Kata Tanya dan Kata Ganti', 'おいくつですか。', 'Berapa usia Anda?'],
  ['何人', 'なんにん', 'nannin', 'Berapa orang', 'Kata Tanya dan Kata Ganti', '何人いますか。', 'Ada berapa orang?'],
  ['何月', 'なんがつ', 'nangatsu', 'Bulan apa', 'Kata Tanya dan Kata Ganti', '誕生日は何月ですか。', 'Ulang tahun di bulan apa?'],
  ['何日', 'なんにち', 'nannichi', 'Tanggal berapa / Berapa hari', 'Kata Tanya dan Kata Ganti', '今日は何日ですか。', 'Hari ini tanggal berapa?'],
  ['何曜日', 'なんようび', 'nanyoubi', 'Hari apa', 'Kata Tanya dan Kata Ganti', '明日は何曜日ですか。', 'Besok hari apa?'],
  ['何番', 'なんばん', 'nanban', 'Nomor berapa', 'Kata Tanya dan Kata Ganti', '電話番号は何番ですか。', 'Nomor teleponnya berapa?'],
  ['どこ', 'どこ', 'doko', 'Di mana / Ke mana', 'Kata Tanya dan Kata Ganti', 'トイレはどこですか。', 'Toilet ada di mana?'],
  ['どちら', 'どちら', 'dochira', 'Sebelah mana / Yang mana (sopan)', 'Kata Tanya dan Kata Ganti', 'お国はどちらですか。', 'Negara asal Anda dari mana?'],
  ['いつ', 'いつ', 'itsu', 'Kapan', 'Kata Tanya dan Kata Ganti', 'いつ日本へ来ましたか。', 'Kapan Anda datang ke Jepang?'],
  ['どうして', 'どうして', 'doushite', 'Mengapa / Kenapa', 'Kata Tanya dan Kata Ganti', 'どうして遅れましたか。', 'Mengapa Anda terlambat?'],
  ['なぜ', 'なぜ', 'naze', 'Mengapa (formal)', 'Kata Tanya dan Kata Ganti', 'なぜですか。', 'Mengapa begitu?'],
  ['どう', 'どう', 'dou', 'Bagaimana', 'Kata Tanya dan Kata Ganti', '日本の生活はどうですか。', 'Bagaimana kehidupan di Jepang?'],
  ['どんな', 'どんな', 'donna', 'Yang bagaimana / Seperti apa', 'Kata Tanya dan Kata Ganti', 'どんな映画が好きですか。', 'Film seperti apa yang Anda sukai?'],
  ['どれ', 'どれ', 'dore', 'Yang mana (dari 3+ pilihan)', 'Kata Tanya dan Kata Ganti', 'あなたの傘はどれですか。', 'Payungmu yang mana?'],
  ['どの', 'どの', 'dono', 'Yang mana (+ kata benda)', 'Kata Tanya dan Kata Ganti', 'どの本ですか。', 'Buku yang mana?'],
  ['いくら', 'いくら', 'ikura', 'Berapa harganya', 'Kata Tanya dan Kata Ganti', 'これはいくらですか。', 'Ini berapa harganya?'],
  ['いくつ', 'いくつ', 'ikutsu', 'Berapa buah / Berapa usia', 'Kata Tanya dan Kata Ganti', 'ミカンはいくつありますか。', 'Ada berapa buah jeruk?'],
  ['どのくらい', 'どのくらい', 'donokurai', 'Berapa lama / Berapa jauh', 'Kata Tanya dan Kata Ganti', 'どのくらいかかりますか。', 'Memakan waktu berapa lama?'],
  ['これ', 'これ', 'kore', 'Ini (dekat pembicara)', 'Kata Tanya dan Kata Ganti', 'これは私のペンです。', 'Ini adalah pulpen saya.'],
  ['それ', 'それ', 'sore', 'Itu (dekat lawan bicara)', 'Kata Tanya dan Kata Ganti', 'それは何ですか。', 'Itu apa?'],
  ['あれ', 'あれ', 'are', 'Itu (jauh dari keduanya)', 'Kata Tanya dan Kata Ganti', 'あれは富士山です。', 'Itu adalah Gunung Fuji.'],
  ['この', 'この', 'kono', 'Ini (+ kata benda)', 'Kata Tanya dan Kata Ganti', 'この本は面白いです。', 'Buku ini menarik.'],
  ['その', 'その', 'sono', 'Itu (+ kata benda)', 'Kata Tanya dan Kata Ganti', 'その辞書をください。', 'Tolong beri kamus itu.'],
  ['あの', 'あの', 'ano', 'Itu (+ kata benda, jauh)', 'Kata Tanya dan Kata Ganti', 'あの建物は病院です。', 'Bangunan itu adalah rumah sakit.'],
  ['ここ', 'ここ', 'koko', 'Di sini (tempat pembicara)', 'Kata Tanya dan Kata Ganti', 'ここは教室です。', 'Di sini adalah ruang kelas.'],
  ['そこ', 'そこ', 'soko', 'Di situ (tempat lawan bicara)', 'Kata Tanya dan Kata Ganti', 'そこに置いてください。', 'Tolong taruh di situ.'],
  ['あそこ', 'あそこ', 'asoko', 'Di sana (jauh)', 'Kata Tanya dan Kata Ganti', 'あそこに駅があります。', 'Di sana ada stasiun.'],
  ['こちら', 'こちら', 'kochira', 'Sebelah sini / Pihak kami (sopan)', 'Kata Tanya dan Kata Ganti', 'こちらへどうぞ。', 'Silakan lewat sebelah sini.'],
  ['そちら', 'そちら', 'sochira', 'Sebelah situ / Pihak Anda (sopan)', 'Kata Tanya dan Kata Ganti', 'そちらはいかがですか。', 'Bagaimana dengan pihak Anda?'],
  ['あちら', 'あちら', 'achira', 'Sebelah sana (sopan)', 'Kata Tanya dan Kata Ganti', 'あちらは受付です。', 'Sebelah sana adalah meja resepsionis.'],
  ['彼', 'かれ', 'kare', 'Dia (laki-laki) / Pacar', 'Kata Tanya dan Kata Ganti', '彼は私の先生です。', 'Dia adalah guru saya.'],
  ['彼女', 'かのじょ', 'kanojo', 'Dia (perempuan) / Pacar', 'Kata Tanya dan Kata Ganti', '彼女は親切です。', 'Dia sangat ramah.'],
  ['私たち', 'わたしたち', 'watashitachi', 'Kami / Kita', 'Kata Tanya dan Kata Ganti', '私たちは学生です。', 'Kami adalah pelajar.']
];

// 5. SALAM DAN UNGKAPAN PERCAKAPAN (挨拶・表現 - Aisatsu)
const N5_GREETINGS = [
  ['おはようございます', 'おはようございます', 'ohayou gozaimasu', 'Selamat pagi (sopan)', 'Salam dan Percakapan', '先生、おはようございます。', 'Selamat pagi, Pak/Bu Guru.'],
  ['こんにちは', 'こんにちは', 'konnichiwa', 'Selamat siang / Halo', 'Salam dan Percakapan', '皆さん、こんにちは。', 'Halo semuanya, selamat siang.'],
  ['こんばんは', 'こんばんは', 'konbanwa', 'Selamat malam', 'Salam dan Percakapan', 'こんばんは、お元気ですか。', 'Selamat malam, apa kabar?'],
  ['おやすみなさい', 'おやすみなさい', 'oyasuminasai', 'Selamat tidur / Selamat beristirahat', 'Salam dan Percakapan', 'おやすみなさい、また明日。', 'Selamat malam beristirahat, sampai besok.'],
  ['さようなら', 'さようなら', 'sayounara', 'Selamat tinggal', 'Salam dan Percakapan', '先生、さようなら。', 'Selamat tinggal, Guru.'],
  ['ありがとうございます', 'ありがとうございます', 'arigatou gozaimasu', 'Terima kasih banyak (sopan)', 'Salam dan Percakapan', '親切にありがとうございます。', 'Terima kasih banyak atas kebaikannya.'],
  ['どうもありがとうございます', 'どうもありがとうございます', 'doumo arigatou gozaimasu', 'Terima kasih banyak tak terhingga', 'Salam dan Percakapan', '本当にどうもありがとうございます。', 'Benar-benar terima kasih banyak.'],
  ['すみません', 'すみません', 'sumimasen', 'Permisi / Maaf memohon', 'Salam dan Percakapan', 'すみません、駅はどこですか。', 'Permisi, stasiun di mana?'],
  ['ごめんなさい', 'ごめんなさい', 'gomen nasai', 'Mohon maaf (santun)', 'Salam dan Percakapan', '遅れてごめんなさい。', 'Mohon maaf saya terlambat.'],
  ['はじめまして', 'はじめまして', 'hajimemashite', 'Senang berkenalan (pertemuan awal)', 'Salam dan Percakapan', 'はじめまして、アリです。', 'Senang berkenalan, saya Ari.'],
  ['どうぞよろしくお願いします', 'どうぞよろしくおねがいします', 'douzo yoroshiku onegaishimasu', 'Mohon bimbingan dan kerja samanya', 'Salam dan Percakapan', 'これからどうぞよろしくお願いします。', 'Mulai sekarang mohon bantuannya.'],
  ['お願いします', 'おねがいします', 'onegaishimasu', 'Tolong / Mohon bantuannya', 'Salam dan Percakapan', 'お水を一杯お願いします。', 'Tolong segelas air.'],
  ['いただきます', 'いただきます', 'itadakimasu', 'Selamat makan (ungkapan syukur)', 'Salam dan Percakapan', '手を合わせていただきますと言います。', 'Menangkupkan tangan dan mengucap selamat makan.'],
  ['ごちそうさまでした', 'ごちそうさまでした', 'gochisousama deshita', 'Terima kasih atas hidangannya', 'Salam dan Percakapan', '美味しかったです。ごちそうさまでした。', 'Sangat enak. Terima kasih atas hidangannya.'],
  ['行ってきます', 'いってきます', 'itte kimasu', 'Saya berangkat dulu (dari rumah)', 'Salam dan Percakapan', '学校へ行ってきます。', 'Saya berangkat ke sekolah dulu ya.'],
  ['行ってらっしゃい', 'いってらっしゃい', 'itterasshai', 'Hati-hati di jalan (melepas)', 'Salam dan Percakapan', '車に気をつけて行ってらっしゃい。', 'Hati-hati di jalan ya.'],
  ['ただいま', 'ただいま', 'tadaima', 'Saya pulang (sampai di rumah)', 'Salam dan Percakapan', 'ただいま帰りました。', 'Saya sudah pulang ke rumah.'],
  ['お帰りなさい', 'おかえりなさい', 'okaerinasai', 'Selamat datang kembali di rumah', 'Salam dan Percakapan', 'お帰りなさい、お疲れ様。', 'Selamat datang kembali, terima kasih atas lelahmu.'],
  ['失礼します', 'しつれいします', 'shitsurei shimasu', 'Permisi masuk ruangan / Permisi pamit', 'Salam dan Percakapan', '先生、失礼します。', 'Permisi Guru, saya pamit.'],
  ['お疲れ様でした', 'おつかれさまでした', 'otsukaresama deshita', 'Terima kasih atas kerja kerasnya', 'Salam dan Percakapan', '今日の仕事はお疲れ様でした。', 'Terima kasih atas kerja keras hari ini.'],
  ['お大事に', 'おだいじに', 'odaiji ni', 'Semoga lekas sembuh (kepada orang sakit)', 'Salam dan Percakapan', '風邪ですね。お大事に。', 'Masuk angin ya. Semoga lekas sembuh.'],
  ['乾杯', 'かんぱい', 'kanpai', 'Bersulang minuman (cheers)', 'Salam dan Percakapan', 'グラスを持って乾杯します。', 'Mengangkat gelas dan bersulang.'],
  ['じゃ、また', 'じゃ、また', 'ja, mata', 'Sampai jumpa lagi (akrab)', 'Salam dan Percakapan', 'じゃ、また明日会いましょう。', 'Sampai jumpa besok ya.'],
  ['どういたしまして', 'どういたしまして', 'dou itashimashite', 'Sama-sama / Kembali', 'Salam dan Percakapan', 'いいえ、どういたしまして。', 'Tidak apa-apa, sama-sama.'],
  ['おめでとうございます', 'おめでとうございます', 'omedetou gozaimasu', 'Selamat atas keberhasilan / Ulang tahun', 'Salam dan Percakapan', 'お誕生日おめでとうございます。', 'Selamat ulang tahun.']
];

// 6. KATA BENDA UMUM (普通名詞 - Meishi: Sekolah, Kantor, Makanan, Buah, Transportasi, Rumah, Benda)
const N5_NOUNS = [
  // Sekolah & Alat Tulis
  ['学校', 'がっこう', 'gakkou', 'Sekolah', 'Kata Benda Umum', '学校へ通います。', 'Pergi ke sekolah.'],
  ['大学', 'だいがく', 'daigaku', 'Universitas / Perguruan tinggi', 'Kata Benda Umum', '大学で勉強します。', 'Belajar di universitas.'],
  ['教室', 'きょうしつ', 'kyoushitsu', 'Ruang kelas', 'Kata Benda Umum', '教室に入ります。', 'Masuk ke ruang kelas.'],
  ['図書館', 'としょかん', 'toshokan', 'Perpustakaan', 'Kata Benda Umum', '図書館で本を借ります。', 'Meminjam buku di perpustakaan.'],
  ['学生', 'がくせい', 'gakusei', 'Murid / Mahasiswa', 'Kata Benda Umum', '留学生です。', 'Mahasiswa asing.'],
  ['先生', 'せんせい', 'sensei', 'Guru / Dokter pengajar', 'Kata Benda Umum', '先生に質問します。', 'Bertanya kepada guru.'],
  ['本', 'ほん', 'hon', 'Buku bacaan', 'Kata Benda Umum', '本を読みます。', 'Membaca buku.'],
  ['辞書', 'じしょ', 'jisho', 'Kamus bahasa', 'Kata Benda Umum', '電子辞書を使います。', 'Menggunakan kamus elektronik.'],
  ['雑誌', 'ざっし', 'zasshi', 'Majalah', 'Kata Benda Umum', 'ファッション雑誌を買いました。', 'Membeli majalah mode.'],
  ['新聞', 'しんぶん', 'shinbun', 'Surat kabar / Koran', 'Kata Benda Umum', '毎朝新聞を読みます。', 'Membaca koran setiap pagi.'],
  ['ノート', 'のーと', 'nooto', 'Buku catatan / Notebook', 'Kata Benda Umum', 'ノートにメモします。', 'Mencatat di buku catatan.'],
  ['手帳', 'てちょう', 'techou', 'Buku agenda saku', 'Kata Benda Umum', '手帳に予定を書きます。', 'Menulis jadwal di agenda.'],
  ['名刺', 'めいし', 'meishi', 'Kartu nama bisnis', 'Kata Benda Umum', '名刺を交換します。', 'Bertukar kartu nama.'],
  ['鉛筆', 'えんぴつ', 'enpitsu', 'Pensil kayu', 'Kata Benda Umum', '鉛筆で書きます。', 'Menulis dengan pensil.'],
  ['ボールペン', 'ぼーるぺん', 'boorupen', 'Pulpen tinta', 'Kata Benda Umum', '黒のボールペンです。', 'Pulpen hitam.'],
  ['消しゴム', 'けしごむ', 'keshigomu', 'Penghapus karet', 'Kata Benda Umum', '消しゴムで消します。', 'Menghapus dengan karet penghapus.'],
  ['紙', 'かみ', 'kami', 'Kertas lembaran', 'Kata Benda Umum', '紙に名前を書きます。', 'Menulis nama di kertas.'],
  ['はさみ', 'はさみ', 'hasami', 'Gunting pemotong', 'Kata Benda Umum', 'はさみで切ります。', 'Memotong dengan gunting.'],
  ['宿題', 'しゅくだい', 'shukudai', 'Pekerjaan rumah (PR)', 'Kata Benda Umum', '宿題を出します。', 'Mengumpulkan PR.'],
  ['試験', 'しけん', 'shiken', 'Ujian / Tes kelulusan', 'Kata Benda Umum', '明日は試験です。', 'Besok ada ujian.'],

  // Benda Rumah Tangga & Perabotan
  ['机', 'つくえ', 'tsukue', 'Meja belajar / Meja kantor', 'Kata Benda Umum', '机の上に置きます。', 'Menaruh di atas meja.'],
  ['椅子', 'いす', 'isu', 'Kursi tempat duduk', 'Kata Benda Umum', '椅子に座ってください。', 'Silakan duduk di kursi.'],
  ['時計', 'とけい', 'tokei', 'Jam dinding / Jam tangan', 'Kata Benda Umum', '時計を見ます。', 'Melihat jam.'],
  ['鍵', 'かぎ', 'kagi', 'Kunci pintu', 'Kata Benda Umum', '鍵をかけます。', 'Mengunci pintu.'],
  ['傘', 'かさ', 'kasa', 'Payung hujan', 'Kata Benda Umum', '傘を差します。', 'Memakai payung.'],
  ['鞄', 'かばん', 'kaban', 'Tas ransel / Tas jinjing', 'Kata Benda Umum', '鞄を持ちます。', 'Membawa tas.'],
  ['テレビ', 'てれび', 'terebi', 'Televisi / TV', 'Kata Benda Umum', 'テレビを見ます。', 'Menonton TV.'],
  ['ラジオ', 'らじお', 'rajio', 'Radio audio', 'Kata Benda Umum', 'ラジオを聞きます。', 'Mendengarkan radio.'],
  ['カメラ', 'かめら', 'kamera', 'Kamera foto', 'Kata Benda Umum', 'カメラで撮ります。', 'Memotret dengan kamera.'],
  ['パソコン', 'ぱそこん', 'pasokon', 'Komputer PC / Laptop', 'Kata Benda Umum', 'パソコンでメールを送ります。', 'Mengirim email dengan laptop.'],
  ['電話', 'でんわ', 'denwa', 'Telepon / Ponsel', 'Kata Benda Umum', '電話をかけます。', 'Menelepon.'],
  ['携帯電話', 'けいたいでんわ', 'keitaidenwa', 'Telepon genggam / Handphone', 'Kata Benda Umum', '携帯電話を持っています。', 'Membawa handphone.'],
  ['冷蔵庫', 'れいぞうこ', 'reizouko', 'Kulkas pendingin makanan', 'Kata Benda Umum', '冷蔵庫に牛乳を入れます。', 'Memasukkan susu ke kulkas.'],
  ['窓', 'まど', 'mado', 'Jendela ruangan', 'Kata Benda Umum', '窓を開けます。', 'Membuka jendela.'],
  ['ドア', 'どあ', 'doa', 'Pintu masuk', 'Kata Benda Umum', 'ドアを閉めます。', 'Menutup pintu.'],
  ['エアコン', 'えあこん', 'eakon', 'Pendingin ruangan (AC)', 'Kata Benda Umum', 'エアコンをつけます。', 'Menyalakan AC.'],
  ['眼鏡', 'めがね', 'megane', 'Kacamata baca', 'Kata Benda Umum', '眼鏡をかけます。', 'Memakai kacamata.'],
  ['服', 'ふく', 'fuku', 'Pakaian / Baju', 'Kata Benda Umum', '新しい服を着ます。', 'Memakai baju baru.'],
  ['シャツ', 'しゃつ', 'shatsu', 'Kemeja baju', 'Kata Benda Umum', '白いシャツです。', 'Kemeja putih.'],
  ['靴', 'くつ', 'kutsu', 'Sepatu alas kaki', 'Kata Benda Umum', '靴を履きます。', 'Memakai sepatu.'],
  ['財布', 'さいふ', 'saifu', 'Dompet tempat uang', 'Kata Benda Umum', '財布を忘れました。', 'Ketinggalan dompet.'],

  // Makanan & Minuman
  ['ご飯', 'ごはん', 'gohan', 'Nasi putih / Makanan pokok', 'Kata Benda Umum', 'ご飯を食べます。', 'Makan nasi.'],
  ['パン', 'ぱん', 'pan', 'Roti gandum', 'Kata Benda Umum', '毎朝パンを食べます。', 'Makan roti setiap pagi.'],
  ['肉', 'にく', 'niku', 'Daging (ayam/sapi)', 'Kata Benda Umum', '肉料理が好きです。', 'Suka hidangan daging.'],
  ['魚', 'さかな', 'sakana', 'Ikan laut / sungai', 'Kata Benda Umum', '魚を焼きます。', 'Memanggang ikan.'],
  ['野菜', 'やさい', 'yasai', 'Sayur-mayur segar', 'Kata Benda Umum', '新鮮な野菜を食べます。', 'Makan sayur segar.'],
  ['卵', 'たまご', 'tamago', 'Telur ayam', 'Kata Benda Umum', '卵を割ります。', 'Memecahkan telur.'],
  ['水', 'みず', 'mizu', 'Air putih dingin', 'Kata Benda Umum', '水を一杯飲みます。', 'Minum segelas air.'],
  ['お茶', 'おちゃ', 'ocha', 'Teh hijau Jepang', 'Kata Benda Umum', '温かいお茶をどうぞ。', 'Silakan teh hangat.'],
  ['紅茶', 'こうちゃ', 'koucha', 'Teh hitam manis', 'Kata Benda Umum', 'レモンティーを飲みます。', 'Minum teh lemon.'],
  ['牛乳', 'ぎゅうにゅう', 'gyuunyuu', 'Susu sapi murni', 'Kata Benda Umum', '朝牛乳を飲みます。', 'Minum susu di pagi hari.'],
  ['コーヒー', 'こーひー', 'koohii', 'Kopi seduh', 'Kata Benda Umum', 'ブラックコーヒーを飲みます。', 'Minum kopi hitam.'],
  ['ジュース', 'じゅーす', 'juusu', 'Jus buah sari', 'Kata Benda Umum', 'オレンジジュースを飲みます。', 'Minum jus jeruk.'],
  ['ビール', 'びーる', 'biiru', 'Bir beralkohol', 'Kata Benda Umum', '冷たいビールを飲みます。', 'Minum bir dingin.'],
  ['お酒', 'おさけ', 'osake', 'Sake beras Jepang', 'Kata Benda Umum', '日本のお酒を味わいます。', 'Mencicipi sake Jepang.'],
  ['砂糖', 'さとう', 'satou', 'Gula pasir manis', 'Kata Benda Umum', '砂糖を入れます。', 'Memasukkan gula.'],
  ['塩', 'しお', 'shio', 'Garam dapur', 'Kata Benda Umum', '塩を少々振ります。', 'Menaburkan sedikit garam.'],

  // Nama Buah
  ['果物', 'くだもの', 'kudamono', 'Buah-buahan segar', 'Kata Benda Umum', '果物をたくさん買いました。', 'Membeli banyak buah-buahan.'],
  ['林檎', 'りんご', 'ringo', 'Apel merah manis', 'Kata Benda Umum', '林檎の皮をむきます。', 'Mengupas kulit apel.'],
  ['蜜柑', 'みかん', 'mikan', 'Jeruk keprok manis', 'Kata Benda Umum', '冬に蜜柑を食べます。', 'Makan jeruk di musim dingin.'],
  ['バナナ', 'ばなな', 'banana', 'Pisang', 'Kata Benda Umum', 'バナナを一本食べました。', 'Makan sebatang pisang.'],
  ['西瓜', 'すいか', 'suika', 'Semangka segar', 'Kata Benda Umum', '甘い西瓜です。', 'Semangka yang manis.'],
  ['苺', 'いちご', 'ichigo', 'Stroberi merah', 'Kata Benda Umum', '苺のケーキを作ります。', 'Membuat kue stroberi.'],
  ['葡萄', 'ぶどう', 'budou', 'Anggur ungu', 'Kata Benda Umum', '葡萄を食べました。', 'Makan anggur.'],
  ['桃', 'もも', 'momo', 'Persik / Peach lembut', 'Kata Benda Umum', '桃の香りがいいです。', 'Aroma buah persik sangat harum.'],
  ['レモン', 'れもん', 'remon', 'Lemon asam segar', 'Kata Benda Umum', 'レモンを絞ります。', 'Memeras jeruk lemon.'],
  ['メロン', 'めろん', 'meron', 'Melon manis', 'Kata Benda Umum', '高級なメロンです。', 'Melon kualitas tinggi.'],

  // Kendaraan & Transportasi
  ['電車', 'でんしゃ', 'densha', 'Kereta api listrik', 'Kata Benda Umum', '電車で通学します。', 'Berangkat sekolah naik kereta.'],
  ['地下鉄', 'ちかてつ', 'chikatetsu', 'Kereta bawah tanah (MRT)', 'Kata Benda Umum', '地下鉄に乗ります。', 'Naik kereta bawah tanah.'],
  ['新幹線', 'しんかんせん', 'shinkansen', 'Kereta peluru Shinkansen', 'Kata Benda Umum', '新幹線はとても速いです。', 'Shinkansen sangat cepat.'],
  ['バス', 'ばす', 'basu', 'Bus umum', 'Kata Benda Umum', 'バスで駅へ行きます。', 'Pergi ke stasiun naik bus.'],
  ['タクシー', 'たくしー', 'takushii', 'Taksi penumpang', 'Kata Benda Umum', 'タクシーを呼びます。', 'Memanggil taksi.'],
  ['飛行機', 'ひこうき', 'hikouki', 'Pesawat terbang', 'Kata Benda Umum', '飛行機で大阪へ行きます。', 'Pergi ke Osaka naik pesawat.'],
  ['船', 'ふね', 'fune', 'Kapal laut', 'Kata Benda Umum', '船で島へ渡ります。', 'Menyeberang ke pulau naik kapal.'],
  ['自動車', 'じどうしゃ', 'jidousha', 'Mobil kendaraan bermotor', 'Kata Benda Umum', '日本の自動車です。', 'Mobil buatan Jepang.'],
  ['自転車', 'じてんしゃ', 'jitensha', 'Sepeda ontel / gowes', 'Kata Benda Umum', '自転車に乗ります。', 'Naik sepeda.'],
  ['駅', 'えき', 'eki', 'Stasiun kereta api', 'Kata Benda Umum', '駅の前で会います。', 'Bertemu di depan stasiun.'],
  ['切符', 'きっぷ', 'kippu', 'Tiket / Karcis perjalanan', 'Kata Benda Umum', '切符を買います。', 'Membeli tiket.'],
  ['空港', 'くうこう', 'kuukou', 'Bandar udara internasional', 'Kata Benda Umum', '羽田空港に着きました。', 'Tiba di Bandara Haneda.'],

  // Tempat Umum, Gedung & Rumah
  ['家', 'いえ', 'ie', 'Rumah kediaman', 'Kata Benda Umum', '私の家は近いです。', 'Rumah saya dekat.'],
  ['部屋', 'へや', 'heya', 'Kamar tidur / Ruangan', 'Kata Benda Umum', '部屋を片付けます。', 'Merapikan kamar.'],
  ['台所', 'だいどころ', 'daidokoro', 'Dapur tempat memasak', 'Kata Benda Umum', '台所で料理します。', 'Memasak di dapur.'],
  ['庭', 'にわ', 'niwa', 'Halaman taman rumah', 'Kata Benda Umum', '庭に花が咲きました。', 'Bunga bermekaran di halaman.'],
  ['病院', 'びょういん', 'byouin', 'Rumah sakit', 'Kata Benda Umum', '病院へ行きます。', 'Pergi ke rumah sakit.'],
  ['銀行', 'ぎんこう', 'ginkou', 'Bank simpan pinjam', 'Kata Benda Umum', '銀行でお金を預けます。', 'Menabung uang di bank.'],
  ['郵便局', 'ゆうびんきょく', 'yuubinkyoku', 'Kantor pos kiriman', 'Kata Benda Umum', '郵便局で手紙を出します。', 'Mengirim surat di kantor pos.'],
  ['スーパー', 'すーぱー', 'suupaa', 'Supermarket belanja', 'Kata Benda Umum', 'スーパーで野菜を買います。', 'Membeli sayuran di supermarket.'],
  ['デパート', 'でぱーと', 'depaato', 'Department store / Mal besar', 'Kata Benda Umum', 'デパートへ買い物に行きます。', 'Pergi belanja ke departement store.'],
  ['公園', 'こうえん', 'kouen', 'Taman kota umum', 'Kata Benda Umum', '公園で散歩します。', 'Jalan-jalan santai di taman.'],
  ['喫茶店', 'きっさてん', 'kissaten', 'Kedai kafe kopi klasik', 'Kata Benda Umum', '喫茶店でコーヒーを飲みます。', 'Minum kopi di kedai kopi.'],
  ['レストラン', 'れすとらん', 'resutoran', 'Restoran rumah makan', 'Kata Benda Umum', 'レストランで食事します。', 'Makan di restoran.'],
  ['ホテル', 'ほてる', 'hoteru', 'Hotel penginapan', 'Kata Benda Umum', 'ホテルに泊まります。', 'Menginap di hotel.'],
  ['交番', 'こうばん', 'kouban', 'Pos polisi jalanan', 'Kata Benda Umum', '交番で道を聞きます。', 'Bertanya jalan di pos polisi.'],

  // Uang & Toko
  ['お金', 'おかね', 'okane', 'Uang kartal', 'Kata Benda Umum', 'お金を払います。', 'Membayar uang.'],
  ['円', 'えん', 'en', 'Yen (mata uang Jepang)', 'Kata Benda Umum', '千円札を出します。', 'Mengeluarkan uang seribu yen.'],
  ['店', 'みせ', 'mise', 'Toko / Warung', 'Kata Benda Umum', 'あの店は安いです。', 'Toko itu murah.'],
  ['レジ', 'れじ', 'reji', 'Mesin kasir pembayaran', 'Kata Benda Umum', 'レジでお会計します。', 'Membayar di kasir.'],

  // Anggota Keluarga & Orang
  ['家族', 'かぞく', 'kazoku', 'Keluarga inti', 'Kata Benda Umum', '家族と一緒に住んでいます。', 'Tinggal bersama keluarga.'],
  ['父', 'ちち', 'chichi', 'Ayah saya', 'Kata Benda Umum', '父は会社員です。', 'Ayah saya adalah karyawan.'],
  ['母', 'はは', 'haha', 'Ibu saya', 'Kata Benda Umum', '母は優しいです。', 'Ibu saya sangat ramah.'],
  ['お父さん', 'おとうさん', 'otousan', 'Ayah (orang lain/panggilan)', 'Kata Benda Umum', 'お父さんはお元気ですか。', 'Apakah ayah Anda sehat?'],
  ['お母さん', 'おかあさん', 'okaasan', 'Ibu (orang lain/panggilan)', 'Kata Benda Umum', 'お母さんの料理は美味しいです。', 'Masakan ibu sangat enak.'],
  ['兄', 'あに', 'ani', 'Kakak laki-laki saya', 'Kata Benda Umum', '兄は東京にいます。', 'Kakak laki-laki saya ada di Tokyo.'],
  ['お兄さん', 'おにいさん', 'oniisan', 'Kakak laki-laki (orang lain)', 'Kata Benda Umum', 'お兄さんは背が高いですね。', 'Kakak laki-lakimu tinggi ya.'],
  ['姉', 'あね', 'ane', 'Kakak perempuan saya', 'Kata Benda Umum', '姉は銀行員です。', 'Kakak perempuan saya pegawai bank.'],
  ['お姉さん', 'おねえさん', 'oneesan', 'Kakak perempuan (orang lain)', 'Kata Benda Umum', 'お姉さんは綺麗ですね。', 'Kakak perempuanmu cantik ya.'],
  ['弟', 'おとうと', 'otouto', 'Adik laki-laki saya', 'Kata Benda Umum', '弟は高校生です。', 'Adik laki-laki saya murid SMA.'],
  ['妹', 'いもうと', 'imouto', 'Adik perempuan saya', 'Kata Benda Umum', '妹は歌が上手です。', 'Adik perempuan saya pandai menyanyi.'],
  ['夫', 'おっと', 'otto', 'Suami saya', 'Kata Benda Umum', '夫は医者です。', 'Suami saya adalah dokter.'],
  ['妻', 'つま', 'tsuma', 'Istri saya', 'Kata Benda Umum', '妻と出かけます。', 'Bepergian bersama istri.'],
  ['子供', 'こども', 'kodomo', 'Anak / Anak-anak', 'Kata Benda Umum', '子供が遊んでいます。', 'Anak-anak sedang bermain.'],
  ['友達', 'ともだち', 'tomodachi', 'Teman kawan akrab', 'Kata Benda Umum', '友達と映画を見ました。', 'Menonton film bersama teman.'],
  ['人', 'ひと', 'hito', 'Orang / Manusia', 'Kata Benda Umum', '親切な人です。', 'Orang yang ramah.'],
  ['男の人', 'おとこのひと', 'otoko no hito', 'Pria dewasa', 'Kata Benda Umum', '男の人が立っています。', 'Seorang pria sedang berdiri.'],
  ['女の人', 'おんなのひと', 'onna no hito', 'Wanita dewasa', 'Kata Benda Umum', '女の人が話しています。', 'Seorang wanita sedang berbicara.']
];

// Combine all N5 sublists in the exact ordered sequence requested by the user:
// 1. Kata Kerja Dasar
// 2. Kata Sifat
// 3. Penunjuk Waktu dan Angka
// 4. Kata Benda Umum
// 5. Kata Tanya dan Kata Ganti
// 6. Salam dan Percakapan
const N5_RAW_ALL = [
  ...N5_VERBS,
  ...N5_ADJECTIVES,
  ...N5_TIME_NUMBERS,
  ...N5_NOUNS,
  ...N5_INTERROGATIVES_PRONOUNS,
  ...N5_GREETINGS
];

function buildDeck(items, level, startId) {
  let idCounter = startId;
  const seen = new Set();
  const deck = [];

  for (const item of items) {
    const [japanese, kana, romaji, indonesian, category, exampleJp, exampleId] = item;
    if (seen.has(japanese)) {
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

// Read existing N4, N3, N2 datasets from previous build to keep them intact
const existingCode = fs.readFileSync('src/data/vocabData.ts', 'utf-8');
const matchN4 = existingCode.match(/export const VOCAB_N4: VocabCard\[\] = (\[[\s\S]*?\]);\s*export const VOCAB_N3/);
const matchN3 = existingCode.match(/export const VOCAB_N3: VocabCard\[\] = (\[[\s\S]*?\]);\s*export const VOCAB_N2/);
const matchN2 = existingCode.match(/export const VOCAB_N2: VocabCard\[\] = (\[[\s\S]*?\]);\s*export const ALL_VOCAB/);

let deckN4 = [];
let deckN3 = [];
let deckN2 = [];

if (matchN4 && matchN3 && matchN2) {
  deckN4 = JSON.parse(matchN4[1]);
  deckN3 = JSON.parse(matchN3[1]);
  deckN2 = JSON.parse(matchN2[1]);
}

const deckN5 = buildDeck(N5_RAW_ALL, 'N5', 1);

console.log(`Generated: N5=${deckN5.length}, N4=${deckN4.length}, N3=${deckN3.length}, N2=${deckN2.length}, Total=${deckN5.length + deckN4.length + deckN3.length + deckN2.length}`);

const fileHeader = `import { VocabCard, JLPTLevel } from '../types';

/**
 * =======================================================================
 * DATA KOSAKATA / KOTOBA RESMI STANDAR JLPT (N5 - N2)
 * Disusun terurut dan lengkap berdasarkan kurikulum resmi Minna no Nihongo:
 * 1. Kata Kerja Dasar (動詞)
 * 2. Kata Sifat (形容詞)
 * 3. Penunjuk Waktu dan Angka (時間・数字)
 * 4. Kata Benda Umum (名詞)
 * 5. Kata Tanya dan Kata Ganti (疑問詞・代名詞)
 * 6. Salam dan Ungkapan Percakapan (挨拶・表現)
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
console.log('Successfully written src/data/vocabData.ts with complete Minna no Nihongo N5 dataset!');
