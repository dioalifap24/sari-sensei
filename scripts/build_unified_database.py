# -*- coding: utf-8 -*-
import json
import os
import sys

from n5_data import N5_AISATSU, N5_PRONOUNS_QUESTIONS
from n5_numbers_time import N5_TIME_NUMBERS_MONEY
from n5_nouns import (
    N5_NOUNS_FOOD_FRUIT,
    N5_NOUNS_TRANSPORT,
    N5_NOUNS_PLACES,
    N5_NOUNS_FAMILY_PEOPLE,
    N5_NOUNS_HOME_ITEMS,
    N5_NOUNS_SCHOOL_OFFICE,
    N5_NOUNS_BODY_CLOTHING,
    N5_NOUNS_NATURE_WEATHER
)
from n5_verbs import N5_VERBS_BASIC
from n5_adjectives_work import N5_ADJECTIVES, N5_WORK_DAILY
from n5_extra_mnn import N5_MNN_ADDITIONS_2
from compile_all_vocab import MNN_ADDITIONS

# Unified Category Mapping to Japanese
CATEGORY_MAP_JP = {
    'Salam & Ungkapan (Aisatsu)': '挨拶・会話',
    'Kata Tanya & Kata Ganti': '疑問詞・代名詞',
    'Penunjuk Waktu & Angka': '時間・数字・お金',
    'Kata Benda - Buah & Makanan': '果物・食べ物',
    'Kata Benda - Kendaraan & Transportasi': '乗り物・交通',
    'Kata Benda - Tempat & Fasilitas': '場所・施設',
    'Kata Benda - Keluarga & Orang': '家族・人々',
    'Kata Benda - Rumah & Barang': '家・日用品',
    'Kata Benda - Sekolah & Kantor': '学校・文具',
    'Kata Benda - Tubuh & Pakaian': '身体・衣服',
    'Kata Benda - Alam & Cuaca': '自然・天気',
    'Kata Kerja Dasar': '基本動詞',
    'Kata Sifat': '形容詞',
    'Kosakata Pekerjaan & Sehari-hari': '仕事・生活'
}

# =========================================================================
# N4 DATASET: MINNA NO NIHONGO SHOKYU II (Bab 26 - 50) & JLPT N4
# Kategori disesuaikan persis seperti N5
# =========================================================================
N4_RAW = [
    # Salam & Ungkapan (Aisatsu)
    ("お世話になりました", "おせわになりました", "osewa ni narimashita", "Terima kasih banyak atas segala bantuannya", "Salam & Ungkapan (Aisatsu)", "大変お世話になりました。", "Terima kasih banyak atas segala bantuan Anda."),
    ("どうぞお入りください", "どうぞおはいりください", "douzo ohairi kudasai", "Silakan masuk ke dalam", "Salam & Ungkapan (Aisatsu)", "どうぞお入りください、お茶をどうぞ。", "Silakan masuk, silakan minum teh."),
    ("ご無沙汰しております", "ごぶさたしております", "gobusata shite orimasu", "Lama tidak menyapa / bertegur sapa (sopan)", "Salam & Ungkapan (Aisatsu)", "先生、大変ご無沙汰しております。", "Guru, sudah lama sekali saya tidak menyapa Anda."),
    ("お待たせいたしました", "おまたせいたしました", "omatase itashimashita", "Mohon maaf telah membuat Anda menunggu lama", "Salam & Ungkapan (Aisatsu)", "大変お待たせいたしました、こちらへどうぞ。", "Mohon maaf telah membuat Anda menunggu, silakan lewat sini."),
    ("お構いなく", "おかまいなく", "okamainaku", "Jangan repot-repot / Tidak perlu sungkan", "Salam & Ungkapan (Aisatsu)", "どうぞおかまいなく。", "Tolong jangan repot-repot melayani saya."),

    # Kata Tanya & Kata Ganti N4
    ("どちら様", "どちらさま", "dochirasama", "Dengan siapakah ini? (sopan formal di telepon)", "Kata Tanya & Kata Ganti", "失礼ですがどちら様でしょうか。", "Mohon maaf, dengan siapakah saya berbicara?"),
    ("どなたか", "どなたか", "donataka", "Seseorang / Ada siapakah (sopan)", "Kata Tanya & Kata Ganti", "どなたかいらっしゃいますか。", "Apakah ada seseorang di dalam?"),
    ("どちらでも", "どちらでも", "dochirademo", "Yang mana pun boleh (dari 2 hal)", "Kata Tanya & Kata Ganti", "お茶とコーヒー、どちらでも結構です。", "Teh atau kopi, yang mana pun boleh bagi saya."),
    ("どれでも", "どれでも", "doredemo", "Yang mana pun boleh (dari banyak hal)", "Kata Tanya & Kata Ganti", "好きなものをどれでも選んでください。", "Silakan pilih yang mana saja yang kamu suka."),
    ("何でも", "なんでも", "nandemo", "Apa pun itu", "Kata Tanya & Kata Ganti", "何でも質問してください。", "Silakan tanyakan apa saja."),
    ("いつでも", "いつでも", "itsudemo", "Kapan pun bisa", "Kata Tanya & Kata Ganti", "いつでも遊びに来てください。", "Silakan datang bermain kapan saja."),
    ("どこでも", "どこでも", "dokedemo", "Di mana pun / Ke mana pun", "Kata Tanya & Kata Ganti", "どこでも好きな場所に座ってください。", "Duduklah di mana saja yang kamu suka."),
    ("誰でも", "だれでも", "daredemo", "Siapa pun juga", "Kata Tanya & Kata Ganti", "誰でも参加できます。", "Siapa pun dapat ikut berpartisipasi."),

    # Penunjuk Waktu & Angka N4
    ("単位", "たんい", "tan'i", "Satuan baku ukuran / SKS perkuliahan", "Penunjuk Waktu & Angka", "卒業に必要な単位を取得します。", "Mengambil SKS yang dibutuhkan untuk kelulusan."),
    ("割合", "わりあい", "wariai", "Proporsi persentase komparasi", "Penunjuk Waktu & Angka", "合格者の割合が増加しました。", "Proporsi peserta yang lulus bertambah."),
    ("合計", "ごうけい", "goukei", "Total akumulasi penjumlahan", "Penunjuk Waktu & Angka", "お会計の合計は三千円です。", "Jumlah total tagihan belanja adalah tiga ribu yen."),
    ("倍", "ばい", "bai", "Kelipatan ganda", "Penunjuk Waktu & Angka", "売上が前年の二倍になりました。", "Penjualan melonjak dua kali lipat dibanding tahun lalu."),
    ("億", "おく", "oku", "Ratus juta (100.000.000)", "Penunjuk Waktu & Angka", "宝くじで一億円が当たりました。", "Memenangkan undian senilai seratus juta yen."),
    ("給与", "きゅうよ", "kyuuyo", "Gaji / Upah kompensasi kerja bulanan", "Penunjuk Waktu & Angka", "基本給与の明細を確認します。", "Memeriksa rincian slip gaji pokok."),
    ("家賃", "やちん", "yachin", "Biaya sewa rumah bulanan", "Penunjuk Waktu & Angka", "毎月月末に家賃を振り込みます。", "Mentransfer uang sewa rumah di setiap akhir bulan."),
    ("学費", "がくひ", "gakuhi", "Biaya SPP / Uang kuliah", "Penunjuk Waktu & Angka", "奨学金を学費に充てます。", "Mengalokasikan beasiswa untuk membayar uang kuliah."),
    ("費用", "ひよう", "hiyou", "Biaya pengeluaran / Ongkos anggaran", "Penunjuk Waktu & Angka", "研修にかかる費用を会社が負担します。", "Perusahaan menanggung biaya pengeluaran pelatihan."),
    ("領収書", "りょうしゅうしょ", "ryoushuusho", "Kwitansi tanda bukti pembayaran resmi", "Penunjuk Waktu & Angka", "レジで宛名入りの領収書をもらいます。", "Meminta tanda bukti kwitansi resmi di meja kasir."),
    ("借金", "しゃっきん", "shakkin", "Hutang pinjaman dana", "Penunjuk Waktu & Angka", "計画的に借金を返済します。", "Melunasi hutang pinjaman secara disiplin terencana."),
    ("貯金", "ちょきん", "chokin", "Tabungan simpanan uang", "Penunjuk Waktu & Angka", "毎月給料の一部を貯金します。", "Menabung sebagian dari gaji setiap bulan."),
    ("手数料", "てすうりょう", "tesuuryou", "Biaya administrasi / Komisi transaksi", "Penunjuk Waktu & Angka", "振込手数料が無料になります。", "Bebas biaya administrasi transfer bank."),
    ("送料", "そうりょう", "souryou", "Ongkos kirim paket (Ongkir)", "Penunjuk Waktu & Angka", "五千円以上のお買い上げで送料無料です。", "Bebas ongkos kirim untuk pembelian di atas 5.000 yen."),

    # Kata Benda - Buah & Makanan N4
    ("キウイ", "きうい", "kiui", "Buah Kiwi", "Kata Benda - Buah & Makanan", "ビタミンが豊富なキウイを食べます。", "Memakan buah kiwi yang kaya vitamin."),
    ("グレープフルーツ", "ぐれーぷふるーつ", "gureepufuruutsu", "Jeruk Bali / Grapefruit", "Kata Benda - Buah & Makanan", "朝食にグレープフルーツを半分食べます。", "Makan setengah buah grapefruit saat sarapan."),
    ("刺身定食", "さしみていしょく", "sashimiteishoku", "Paket menu set sashimi lengkap", "Kata Benda - Buah & Makanan", "昼食に刺身定食を注文します。", "Memesan paket menu sashimi untuk makan siang."),
    ("天丼", "てんどん", "tendon", "Mangkuk nasi tempura gurih", "Kata Benda - Buah & Makanan", "揚げたての天丼を味わいます。", "Menikmati semangkuk tendon yang baru digoreng hangat."),
    ("焼肉", "やきにく", "yakiniku", "Daging panggang Yakiniku", "Kata Benda - Buah & Makanan", "週末に家族で焼肉を食べに行きます。", "Pergi makan yakiniku bersama keluarga di akhir pekan."),

    # Kata Benda - Kendaraan & Transportasi N4
    ("快速", "かいそく", "kaisoku", "Kereta semicepat (Rapid)", "Kata Benda - Kendaraan & Transportasi", "快速電車に乗ると十分早く着きます。", "Naik kereta rapid akan tiba sepuluh menit lebih cepat."),
    ("急行", "きゅうこう", "kyuukou", "Kereta ekspres reguler", "Kata Benda - Kendaraan & Transportasi", "急行は途中の主要駅に停まります。", "Kereta ekspres berhenti di stasiun utama sepanjang rute."),
    ("特急", "とっきゅう", "tokkyuu", "Kereta ekspres terbatas (Limited Express)", "Kata Benda - Kendaraan & Transportasi", "特急券を買って指定席に座ります。", "Membeli tiket limited express dan duduk di kursi reservasi."),
    ("各駅停車", "かくえきていしゃ", "kakuekiteisha", "Kereta lokal berhenti di setiap stasiun", "Kata Benda - Kendaraan & Transportasi", "各駅停車でのんびり景色を眺めます。", "Menikmati pemandangan santai naik kereta lokal."),
    ("踏切", "ふみきり", "fumikiri", "Perlintasan rel kereta api", "Kata Benda - Kendaraan & Transportasi", "踏切の前で一時停止します。", "Berhenti sesaat di depan perlintasan rel kereta."),
    ("歩道", "ほどう", "hodou", "Trotoar pejalan kaki", "Kata Benda - Kendaraan & Transportasi", "安全な歩道を歩きます。", "Berjalan di trotoar pejalan kaki yang aman."),
    ("車道", "しゃどう", "shadou", "Jalan raya jalur kendaraan bermotor", "Kata Benda - Kendaraan & Transportasi", "車道を横断してはいけません。", "Dilarang menyeberang di tengah jalan raya kendaraan."),

    # Kata Benda - Tempat & Fasilitas N4
    ("市役所", "しやくしょ", "shiyakusho", "Kantor balai kota / Dukcapil", "Kata Benda - Tempat & Fasilitas", "市役所で住民登録の手続きをします。", "Mengurus pendaftaran kependudukan di kantor balai kota."),
    ("警察署", "けいさつしょ", "keisatsusho", "Kantor kantor polisi resort", "Kata Benda - Tempat & Fasilitas", "警察署で免許証の更新をします。", "Memperpanjang SIM di kantor kepolisian."),
    ("消防署", "しょうぼうしょ", "shoubousho", "Kantor pemadam kebakaran", "Kata Benda - Tempat & Fasilitas", "消防署の前に消防車が並んでいます。", "Mobil pemadam berjejer di depan kantor dinas pemadam."),
    ("大使館", "たいしかん", "taishikan", "Kedutaan besar negara (Embassy)", "Kata Benda - Tempat & Fasilitas", "日本大使館でビザの申請をします。", "Mengajukan permohonan visa di Kedutaan Besar Jepang."),
    ("寮", "りょう", "ryou", "Asrama mahasiswa / Karyawan", "Kata Benda - Tempat & Fasilitas", "学生寮で友達と共同生活を送ります。", "Menjalani kehidupan bersama teman di asrama mahasiswa."),

    # Kata Benda - Rumah, Keluarga & Tubuh N4
    ("祖父", "そふ", "sofu", "Kakek kandung saya", "Kata Benda - Keluarga & Orang", "私の祖父は八十歳で元気です。", "Kakek saya berusia 80 tahun dan sehat bugar."),
    ("祖母", "そぼ", "sobo", "Nenek kandung saya", "Kata Benda - Keluarga & Orang", "祖母の昔話を聞くのが好きです。", "Suka mendengarkan cerita masa lalu dari nenek."),
    ("おじいさん", "おじいさん", "ojiisan", "Kakek orang lain / Panggilan kakek", "Kata Benda - Keluarga & Orang", "親切なおじいさんに道を教えてもらいました。", "Diberi petunjuk jalan oleh seorang kakek yang ramah."),
    ("おばあさん", "おばあさん", "obaasan", "Nenek orang lain / Panggilan nenek", "Kata Benda - Keluarga & Orang", "おばあさんに席を譲ります。", "Memberikan kursi tempat duduk kepada seorang nenek."),
    ("孫", "まご", "mago", "Cucu", "Kata Benda - Keluarga & Orang", "孫の成長を楽しみにしています。", "Menantikan perkembangan dan pertumbuhan cucu tercinta."),
    ("給湯器", "きゅうとうき", "kyuutouki", "Mesin pemanas air mandi (Water Heater)", "Kata Benda - Rumah & Barang", "給湯器のスイッチを入れてお風呂を沸かします。", "Menyalakan tombol pemanas air untuk mengisi bak mandi."),
    ("押し入れ", "おしいれ", "oshiire", "Lemari dinding khas Jepang (Oshiire)", "Kata Benda - Rumah & Barang", "押し入れに布団をしまいます。", "Menyimpan kasur futon ke dalam lemari dinding."),

    # Kata Kerja Dasar N4 (Minna no Nihongo Bab 26 - 50)
    ("選びます", "えらびます", "erabimasu", "Memilih / Menyeleksi opsi", "Kata Kerja Dasar", "メニューから好きな料理を選びます。", "Memilih masakan yang disukai dari daftar menu."),
    ("通います", "かよいます", "kayoimasu", "Rutin bepergian bolak-balik (kuliah/kerja)", "Kata Kerja Dasar", "電車で大学に通っています。", "Rutin pergi pulang ke kampus naik kereta."),
    ("売れます", "うれます", "uremasu", "Laku keras terjual", "Kata Kerja Dasar", "新商品が飛ぶように売れました。", "Produk baru laku keras terjual kilat."),
    ("踊ります", "おどります", "odorimasu", "Menari tarian tradisional/modern", "Kata Kerja Dasar", "盆踊りをみんなで楽しく踊ります。", "Menari tarian Bon Odori bersama-sama dengan riang."),
    ("噛みます", "かみます", "kamimasu", "Mengunyah makanan / Menggigit", "Kata Kerja Dasar", "ご飯をよく噛んで食べます。", "Mengunyah nasi dengan baik saat makan."),
    ("咲きます", "さきます", "sakimasu", "Mekar (bunga)", "Kata Kerja Dasar", "庭に綺麗な桜の花が咲きました。", "Bunga sakura yang indah telah mekar di pekarangan."),
    ("変わります", "かわります", "kawarimasu", "Berubah keadaan / Bergeser", "Kata Kerja Dasar", "信号が青に変わりました。", "Lampu lalu lintas telah berubah menjadi hijau."),
    ("困ります", "こまります", "komarimasu", "Menemui kesulitan / Kerepotan", "Kata Kerja Dasar", "道に迷って困りました。", "Kerepotan karena tersesat di jalan."),
    ("付けます", "つけます", "tsukemasu", "Membubuhkan tanda / Menghidupkan", "Kata Kerja Dasar", "丸の印を付けます。", "Membubuhkan tanda lingkaran."),
    ("拾います", "ひろいます", "hiroimasu", "Memungut barang jatuh", "Kata Kerja Dasar", "落とした切符を拾いました。", "Memungut karcis tiket yang terjatuh."),
    ("届きます", "とどきます", "todokimasu", "Paket tiba sampai tujuan", "Kata Kerja Dasar", "注文した荷物が届きました。", "Barang pesanan telah tiba sampai di tujuan."),
    ("知らせます", "しらせます", "shirasemasu", "Memberitahukan kabar pengumuman", "Kata Kerja Dasar", "合格のニュースを両親に知らせます。", "Memberitahukan kabar kelulusan kepada orang tua."),
    ("片付きます", "かたづきます", "katazukimasu", "Menjadi beres rapi bersih", "Kata Kerja Dasar", "大掃除で部屋がすっかり片付きました。", "Kamar telah menjadi rapi beres setelah pembersihan total."),
    ("燃えます", "もえます", "moemasu", "Terbakar / Api menyala", "Kata Kerja Dasar", "落ち葉がよく燃えています。", "Daun-daun kering terbakar dengan baik."),
    ("消えます", "きえます", "kiemasu", "Padam mati (lampu/api)", "Kata Kerja Dasar", "電気が突然消えました。", "Lampu listrik tiba-tiba padam."),
    ("壊れます", "こわれます", "kowaremasu", "Menjadi rusak (barang)", "Kata Kerja Dasar", "時計が壊れて動かなくなりました。", "Jam tangan rusak dan tidak lagi berputar."),
    ("割れます", "われます", "waremasu", "Pecah terbelah (gelas/kaca)", "Kata Kerja Dasar", "コップが床に落ちて割れました。", "Gelas jatuh ke lantai dan pecah."),
    ("折れます", "おれます", "oremasu", "Patah (ranting/pohon/tulang)", "Kata Kerja Dasar", "強い風で木の枝が折れました。", "Ranting pohon patah akibat angin kencang."),
    ("破れます", "やぶれます", "yaburemasu", "Robek sobek (kertas/baju)", "Kata Kerja Dasar", "紙袋が破れて荷物が落ちました。", "Kantong kertas sobek dan muatannya terjatuh."),
    ("汚れます", "よごれます", "yogoremasu", "Menjadi kotor bernoda", "Kata Kerja Dasar", "泥で靴がひどく汚れました。", "Sepatu menjadi sangat kotor terkena lumpur."),
    ("外れます", "はずれます", "hazuremasu", "Terlepas tanggal (kancing/komponen)", "Kata Kerja Dasar", "シャツのボタンが外れました。", "Kancing kemeja terlepas tanggal."),
    ("間違えます", "まちがえます", "machigaemasu", "Melakukan kekeliruan / Salah pilih", "Kata Kerja Dasar", "電車の乗り場を間違えました。", "Salah memilih peron tempat naik kereta."),
    ("落とします", "おとします", "otoshimasu", "Menjatuhkan barang", "Kata Kerja Dasar", "階段でスマホを落としました。", "Menjatuhkan smartphone di tangga."),
    ("掛かります", "かかります", "kakarimasu", "Terkunci (kagi ga kakarimasu)", "Kata Kerja Dasar", "ドアにしっかりと鍵が掛かっています。", "Pintu telah terkunci dengan rapat."),

    # Kata Sifat N4
    ("素晴らしい", "すばらしい", "subarashii", "Luar biasa mengagumkan / Hebat", "Kata Sifat", "富士山からの素晴らしい景色です。", "Pemandangan yang luar biasa mengagumkan dari Gunung Fuji."),
    ("酷い", "ひどい", "hidoi", "Parah / Buruk sekali / Tega", "Kata Sifat", "昨日は酷い雨風でした。", "Kemarin terjadi angin dan hujan yang sangat parah."),
    ("珍しい", "めずらしい", "mezurashii", "Langka / Jarang ditemui", "Kata Sifat", "珍しい鳥を観察しました。", "Mengamati burung langka yang jarang terlihat."),
    ("眠い", "ねむい", "nemui", "Mengantuk ingin tidur", "Kata Sifat", "夜遅くまで起きていたので眠いです。", "Merasa mengantuk karena begadang sampai larut malam."),
    ("寂しい", "さびしい", "sabishii", "Sepi sendiri / Merasa kesepian", "Kata Sifat", "一人暮らしは時々寂しいです。", "Tinggal sendiri terkadang terasa sepi."),
    ("恥ずかしい", "はずかしい", "hazukashii", "Malu / Canggung tersipu", "Kata Sifat", "大勢の前で話すのは恥ずかしいです。", "Malu berbicara di depan banyak orang."),
    ("嬉しい", "うれしい", "ureshii", "Senang gembira bahagia", "Kata Sifat", "試験に合格してとても嬉しいです。", "Sangat gembira karena lulus ujian."),
    ("悲しい", "かなしい", "kanashii", "Sedih berduka cita", "Kata Sifat", "映画の結末が悲しかったです。", "Akhir cerita film tersebut sangat menyedihkan."),
    ("優しい", "やさしい", "yasashii", "Lembut hati / Ramah penyayang", "Kata Sifat", "先輩がいつも優しく教えてくれます。", "Senior selalu mengajari dengan ramah dan penuh kelembutan."),
    ("厳しい", "きびしい", "kibishii", "Tegas / Ketat disiplin", "Kata Sifat", "先生の指導は厳しいですが力になります。", "Bimbingan guru sangat tegas namun sangat bermanfaat."),
    ("複雑", "ふくざつ", "fukuzatsu", "Rumit pelik berbelit-belit", "Kata Sifat", "この機械の構造はとても複雑です。", "Struktur mesin ini sangat rumit."),
    ("邪魔", "じゃま", "jama", "Mengganggu / Menghalangi jalan", "Kata Sifat", "通路に荷物を置くと邪魔になります。", "Barang bawaan akan menghalangi jika ditaruh di lorong jalan."),
    ("適当", "てきとう", "tekitou", "Tepat pas / Sesuai porsi", "Kata Sifat", "適当な大きさの箱を選びます。", "Memilih kotak kardus dengan ukuran yang sesuai."),
    ("特別", "とくべつ", "tokubetsu", "Istimewa khusus / Spesial", "Kata Sifat", "今日は特別な記念日です。", "Hari ini adalah hari peringatan istimewa."),

    # Kosakata Pekerjaan & Sehari-hari N4
    ("習慣", "しゅうかん", "shuukan", "Kebiasaan budaya / Rutinitas", "Kosakata Pekerjaan & Sehari-hari", "日本の生活習慣に慣れました。", "Sudah terbiasa dengan rutinitas budaya Jepang."),
    ("規則", "きそく", "kisoku", "Peraturan tata tertib resmi", "Kosakata Pekerjaan & Sehari-hari", "寮の規則をしっかり守ります。", "Mematuhi tata tertib asrama dengan baik."),
    ("都合", "つごう", "tsugou", "Kondisi kesediaan waktu", "Kosakata Pekerjaan & Sehari-hari", "明日のご都合はいかがでしょうか。", "Bagaimana kesediaan waktu Anda untuk besok?"),
    ("機会", "きかい", "kikai", "Peluang kesempatan emas", "Kosakata Pekerjaan & Sehari-hari", "日本語を話す機会を増やします。", "Memperbanyak kesempatan untuk berbicara bahasa Jepang."),
    ("準備", "じゅんび", "junbi", "Persiapan kelengkapan", "Kosakata Pekerjaan & Sehari-hari", "会議の準備を前日までに済ませます。", "Menyelesaikan persiapan rapat sebelum hari H."),
    ("経験", "けいけん", "keiken", "Pengalaman jam terbang hidup", "Kosakata Pekerjaan & Sehari-hari", "日本での仕事経験を将来に活かします。", "Memanfaatkan pengalaman kerja di Jepang untuk masa depan."),
    ("同僚", "どうりょう", "douryou", "Rekan kerja sejawat", "Kosakata Pekerjaan & Sehari-hari", "親切な同僚と助け合って仕事をします。", "Saling membantu bekerja bersama rekan kerja yang ramah."),
    ("先輩", "せんぱい", "senpai", "Senior pembimbing", "Kosakata Pekerjaan & Sehari-hari", "先輩から業務の手順を教わります。", "Mempelajari alur tata cara kerja dari senior."),
    ("後輩", "こうはい", "kouhai", "Junior rekan kerja baru", "Kosakata Pekerjaan & Sehari-hari", "入社したばかりの後輩をサポートします。", "Memberikan dukungan kepada rekan junior yang baru masuk.")
]

# =========================================================================
# N3 DATASET: MINNA NO NIHONGO CHUKYU I & JLPT N3
# =========================================================================
N3_RAW = [
    # Salam & Ungkapan
    ("お世話様でした", "おせわさまでした", "osewasamadeshita", "Terima kasih atas pelayanannya", "Salam & Ungkapan (Aisatsu)", "配達員にお世話様でしたと言います。", "Mengucapkan terima kasih atas layanan kepada kurir pengantar."),
    ("恐れ入りますが", "おそれいりますが", "osoreirimasuga", "Mohon maaf sebelumnya / Permisi (sopan sekali)", "Salam & Ungkapan (Aisatsu)", "恐れ入りますがお名前をもう一度いただけますか。", "Mohon maaf sebelumnya, bisakah sebutkan kembali nama Anda?"),
    
    # Penunjuk Waktu, Angka & Uang N3
    ("比率", "ひりつ", "hiritsu", "Rasio komparasi perbandingan angka", "Penunjuk Waktu & Angka", "男女の構成比率を調査します。", "Meneliti rasio komposisi perbandingan pria dan wanita."),
    ("統計", "とうけい", "toukei", "Statistik data berkala resmi", "Penunjuk Waktu & Angka", "国勢調査の統計データを確認します。", "Memeriksa data statistik sensus penduduk."),
    ("概算", "がいさん", "gaisan", "Estimasi perkiraan kasar kalkulasi", "Penunjuk Waktu & Angka", "プロジェクトの総費用を概算します。", "Membuat perkiraan estimasi kasar total biaya proyek."),
    ("為替", "かわせ", "kawase", "Kurs valuta asing / Valas", "Penunjuk Waktu & Angka", "外国為替相場の変動をチェックします。", "Mengecek pergerakan fluktuasi kurs valuta asing."),
    ("物価", "ぶっか", "bukka", "Tingkat harga komoditas pokok umum", "Penunjuk Waktu & Angka", "物価の上昇に対応して家計を見直します。", "Menata ulang anggaran belanja mengantisipasi kenaikan harga pokok."),
    ("投資", "とうし", "toushi", "Investasi penanaman modal", "Penunjuk Waktu & Angka", "将来の成長産業へ資金を投資します。", "Menginvestasikan dana pada sektor industri yang berkembang."),
    ("残高", "ざんだか", "zandaka", "Saldo sisa rekening bank", "Penunjuk Waktu & Angka", "通帳記入で普通預金の残高を確認します。", "Mengecek sisa saldo rekening tabungan lewat cetak buku bank."),
    ("利息", "りそく", "risoku", "Bunga tabungan atau pinjaman", "Penunjuk Waktu & Angka", "定期預金に利息が加算されました。", "Bunga simpanan telah ditambahkan pada deposito berjangka."),
    ("利益", "りえき", "rieki", "Laba keuntungan bersih bisnis", "Penunjuk Waktu & Angka", "今期の営業利益が過去最高を記録しました。", "Laba operasional periode ini mencatat rekor tertinggi."),
    ("損失", "そんしつ", "sonshitsu", "Kerugian finansial", "Penunjuk Waktu & Angka", "リスク管理を徹底して損失を防ぎます。", "Mencegah kerugian finansial dengan manajemen risiko yang ketat."),

    # Transportasi, Tempat, Benda N3
    ("直通", "ちょくつう", "chokutsuu", "Jalur langsung tanpa berganti kereta", "Kata Benda - Kendaraan & Transportasi", "空港まで直通の特急電車に乗ります。", "Naik kereta ekspres langsung tanpa transit menuju bandara."),
    ("運賃", "うんちん", "unchin", "Tarif ongkos angkutan umum", "Kata Benda - Kendaraan & Transportasi", "乗車区間に応じた運賃を精算します。", "Menyesuaikan pembayaran tarif angkutan sesuai jarak rute."),
    ("施設", "しせつ", "shisetsu", "Fasilitas sarana prasarana", "Kata Benda - Tempat & Fasilitas", "最新のスポーツ施設を利用します。", "Memanfaatkan fasilitas sarana olahraga termutakhir."),
    ("器具", "きぐ", "kigu", "Peralatan perkakas kerja", "Kata Benda - Rumah & Barang", "実験用の精密な器具を点検します。", "Memeriksa perkakas instrumen presisi untuk eksperimen."),

    # Verba N3
    ("工夫します", "くふうします", "kufuushimasu", "Melakukan inovasi / Mengakali cara cerdas", "Kata Kerja Dasar", "限られた時間で成果を出す工夫をします。", "Mengakali strategi cerdas agar berprestasi dalam waktu terbatas."),
    ("担当します", "たんとうします", "tantoushimasu", "Bertanggung jawab memegang tugas (PIC)", "Kata Kerja Dasar", "東南アジア地域の営業を担当します。", "Menjadi penanggung jawab pemasaran wilayah Asia Tenggara."),
    ("営業します", "えいぎょうします", "eigyoushimasu", "Melakukan aktivitas penjualan bisnis", "Kata Kerja Dasar", "新規顧客の獲得に向けて営業します。", "Melakukan aktivitas penjualan untuk meraih klien baru."),
    ("契約します", "けいやくします", "keiyakushimasu", "Menandatangani kontrak kerja sama resmi", "Kata Kerja Dasar", "取引先と基本合意に達して契約します。", "Mencapai kesepakatan dasar lalu menandatangani kontrak."),
    ("交渉します", "こうしょうします", "koushoushimasu", "Bernegosiasi tawar-menawar syarat", "Kata Kerja Dasar", "納期と納入価格について粘り強く交渉します。", "Bernegosiasi secara ulet mengenai tenggat waktu dan harga pasokan."),
    ("提案します", "ていあんします", "teianshimasu", "Mengajukan usulan proposal inovasi", "Kata Kerja Dasar", "業務の効率化プランを上司に提案します。", "Mengajukan proposal efisiensi kerja kepada atasan."),

    # Sifat & Pekerjaan N3
    ("効率的", "こうりつてき", "kouritsuteki", "Efisien dan berdaya guna", "Kata Sifat", "効率的な学習スケジュールを組み立てます。", "Menyusun jadwal belajar yang terstruktur dan efisien."),
    ("積極的", "せっきょくてき", "sekkyokuteki", "Proaktif berinisiatif tinggi", "Kata Sifat", "会議で積極的に自分の意見を発表します。", "Menyampaikan pendapat secara proaktif dalam rapat.")
]

# =========================================================================
# N2 DATASET: MINNA NO NIHONGO CHUKYU II & JLPT N2
# =========================================================================
N2_RAW = [
    # Penunjuk Waktu, Angka & Uang N2
    ("推移", "すいい", "suii", "Dinamika pergerakan tren berkala data", "Penunjuk Waktu & Angka", "過去十年間の売上推移を詳細に分析します。", "Menganalisis secara mendalam dinamika tren penjualan 10 tahun terakhir."),
    ("乖離", "かいり", "kairi", "Kesenjangan disparitas selisih data", "Penunjuk Waktu & Angka", "市場の予測値と実績値に大幅な乖離が生じました。", "Terjadi kesenjangan tajam antara angka prediksi pasar dan realisasi nyata."),
    ("均衡", "きんこう", "kinkou", "Keseimbangan ekuilibrium neraca", "Penunjuk Waktu & Angka", "需要と供給の均衡を保つよう生産を調整します。", "Menyesuaikan produksi demi menjaga keseimbangan supply dan demand."),
    ("融資", "ゆうし", "yuushi", "Pembiayaan kredit permodalan institusi", "Penunjuk Waktu & Angka", "新規設備投資に向けて銀行から巨額の融資を受けます。", "Mendapatkan kucuran kredit modal dari bank untuk investasi fasilitas baru."),
    ("相場", "そうば", "souba", "Fluktuasi harga pasar bursa", "Penunjuk Waktu & Angka", "外国為替相場や原油価格の急激な変動を警戒します。", "Mewaspadai gejolak tajam bursa valuta asing dan harga minyak mentah."),
    ("負債", "ふさい", "fusai", "Liabilitas beban kewajiban hutang korporasi", "Penunjuk Waktu & Angka", "有利子負債を圧縮して強固な財務体質を構築します。", "Memangkas beban hutang berbunga demi membangun struktur finansial kokoh."),

    # Pekerjaan & Manajemen N2
    ("待遇", "たいぐう", "taiguu", "Kompensasi remunerasi dan tunjangan karyawan", "Kosakata Pekerjaan & Sehari-hari", "優秀な人材を確保するため社員の労働待遇を改善します。", "Memperbaiki sistem kompensasi demi merekrut talenta terbaik."),
    ("折衝", "せっしょう", "sesshou", "Negosiasi diplomatis alot multi pihak", "Kosakata Pekerjaan & Sehari-hari", "複数企業との間で契約条件についてタフに折衝します。", "Bernegosiasi alot mengenai klausul kontrak bersama berbagai pihak."),
    ("株主総会", "かぶぬしそうかい", "kabunushisoukai", "Rapat Umum Pemegang Saham (RUPS)", "Kosakata Pekerjaan & Sehari-hari", "定時株主総会で新たな経営方針が全会一致で可決されました。", "Arah kebijakan manajemen disahkan dengan suara bulat di RUPS tahunan."),
    ("経営陣", "けいえいじん", "keieijin", "Jajaran dewan direksi eksekutif", "Kosakata Pekerjaan & Sehari-hari", "経営陣が長期的なグローバル戦略を発表しました。", "Dewan direksi manajemen merilis strategi jangka panjang global."),
    ("事業再編", "じぎょうさいへん", "jigyousaihen", "Restrukturisasi divisi lini bisnis", "Kosakata Pekerjaan & Sehari-hari", "収益力向上を目指して抜本的な事業再編を断行します。", "Melakukan restrukturisasi bisnis menyeluruh demi meningkatkan profitabilitas."),
    ("運航", "うんこう", "unkou", "Operasional perjalanan armada laut dan udara", "Kata Benda - Kendaraan & Transportasi", "台風の接近に伴い旅客フェリーの全便運航を停止します。", "Menghentikan seluruh operasional pelayaran ferry penumpang karena angin taifun."),
    ("輸送", "ゆそう", "yusou", "Logistik distribusi pengangkutan masal", "Kata Benda - Kendaraan & Transportasi", "鉄道貨物ネットワークを活用した大量輸送を推進します。", "Mendorong pengangkutan muatan masal lewat jaringan kargo kereta api.")
]

def build_all_curriculum():
    # Build complete N5 base
    n5_base_raw = []
    n5_base_raw.extend(N5_AISATSU)
    n5_base_raw.extend(N5_PRONOUNS_QUESTIONS)
    n5_base_raw.extend(N5_TIME_NUMBERS_MONEY)
    n5_base_raw.extend(N5_NOUNS_FOOD_FRUIT)
    n5_base_raw.extend(N5_NOUNS_TRANSPORT)
    n5_base_raw.extend(N5_NOUNS_PLACES)
    n5_base_raw.extend(N5_NOUNS_FAMILY_PEOPLE)
    n5_base_raw.extend(N5_NOUNS_HOME_ITEMS)
    n5_base_raw.extend(N5_NOUNS_SCHOOL_OFFICE)
    n5_base_raw.extend(N5_NOUNS_BODY_CLOTHING)
    n5_base_raw.extend(N5_NOUNS_NATURE_WEATHER)
    n5_base_raw.extend(N5_VERBS_BASIC)
    n5_base_raw.extend(N5_ADJECTIVES)
    n5_base_raw.extend(N5_WORK_DAILY)
    n5_base_raw.extend(MNN_ADDITIONS)
    n5_base_raw.extend(N5_MNN_ADDITIONS_2)

    # Master tracking set to prevent ANY duplicate kotoba across or within levels
    master_seen = set()

    decks = {
        'N5': [],
        'N4': [],
        'N3': [],
        'N2': []
    }
    id_counter = 1

    # Populate N5
    for item in n5_base_raw:
        jp, kana, romaji, id_trans, cat, ex, ex_id = item
        key = jp.strip()
        if key not in master_seen:
            master_seen.add(key)
            cat_jp = CATEGORY_MAP_JP.get(cat, '日本語')
            decks['N5'].append({
                'id': id_counter,
                'level': 'N5',
                'japanese': jp,
                'kana': kana,
                'romaji': romaji,
                'reading': romaji,
                'indonesian': id_trans,
                'category': cat,
                'categoryJp': cat_jp,
                'example': ex,
                'exampleIndonesian': ex_id
            })
            id_counter += 1

    # Populate N4
    for item in N4_RAW:
        jp, kana, romaji, id_trans, cat, ex, ex_id = item
        key = jp.strip()
        if key not in master_seen:
            master_seen.add(key)
            cat_jp = CATEGORY_MAP_JP.get(cat, '日本語')
            decks['N4'].append({
                'id': id_counter,
                'level': 'N4',
                'japanese': jp,
                'kana': kana,
                'romaji': romaji,
                'reading': romaji,
                'indonesian': id_trans,
                'category': cat,
                'categoryJp': cat_jp,
                'example': ex,
                'exampleIndonesian': ex_id
            })
            id_counter += 1

    # Populate N3
    for item in N3_RAW:
        jp, kana, romaji, id_trans, cat, ex, ex_id = item
        key = jp.strip()
        if key not in master_seen:
            master_seen.add(key)
            cat_jp = CATEGORY_MAP_JP.get(cat, '日本語')
            decks['N3'].append({
                'id': id_counter,
                'level': 'N3',
                'japanese': jp,
                'kana': kana,
                'romaji': romaji,
                'reading': romaji,
                'indonesian': id_trans,
                'category': cat,
                'categoryJp': cat_jp,
                'example': ex,
                'exampleIndonesian': ex_id
            })
            id_counter += 1

    # Populate N2
    for item in N2_RAW:
        jp, kana, romaji, id_trans, cat, ex, ex_id = item
        key = jp.strip()
        if key not in master_seen:
            master_seen.add(key)
            cat_jp = CATEGORY_MAP_JP.get(cat, '日本語')
            decks['N2'].append({
                'id': id_counter,
                'level': 'N2',
                'japanese': jp,
                'kana': kana,
                'romaji': romaji,
                'reading': romaji,
                'indonesian': id_trans,
                'category': cat,
                'categoryJp': cat_jp,
                'example': ex,
                'exampleIndonesian': ex_id
            })
            id_counter += 1

    # Output TypeScript
    out_lines = [
        "import { JLPTLevel, VocabCard } from '../types';",
        "",
        "/**",
        " * DATA KOSAKATA RESMI STANDAR JLPT LENGKAP & MINNA NO NIHONGO (N5–N2)",
        " * - Muka Depan Kartu: Menggunakan Huruf Kana (Hiragana/Katakana murni) untuk kemudahan hafalan murid;",
        " * - Sisi Belakang Kartu: Memuat Penulisan Kanji Asli, Cara Baca Kana, Ejaan Romaji, Arti Indonesia & Contoh Kalimat",
        " * - Audio: Pengucapan akurat dengan ja-JP Web Speech API",
        " * - Bebas Duplikasi (Zero Duplicates)",
        " */",
        "",
        f"export const VOCAB_N5: VocabCard[] = {json.dumps(decks['N5'], ensure_ascii=False, indent=2)};",
        "",
        f"export const VOCAB_N4: VocabCard[] = {json.dumps(decks['N4'], ensure_ascii=False, indent=2)};",
        "",
        f"export const VOCAB_N3: VocabCard[] = {json.dumps(decks['N3'], ensure_ascii=False, indent=2)};",
        "",
        f"export const VOCAB_N2: VocabCard[] = {json.dumps(decks['N2'], ensure_ascii=False, indent=2)};",
        "",
        "// Gabungan Seluruh Kosakata N5–N2 Terurut Sistematis",
        f"export const VOCAB_ALL_LEVELS: VocabCard[] = [...VOCAB_N5, ...VOCAB_N4, ...VOCAB_N3, ...VOCAB_N2];",
        "",
        "export const ALL_VOCAB: Record<JLPTLevel, VocabCard[]> = {",
        "  N5: VOCAB_N5,",
        "  N4: VOCAB_N4,",
        "  N3: VOCAB_N3,",
        "  N2: VOCAB_N2",
        "};",
        ""
    ]

    target_path = os.path.join(os.getcwd(), 'src', 'data', 'vocabData.ts')
    with open(target_path, 'w', encoding='utf-8') as f:
        f.write('\n'.join(out_lines))

    print(f"Master curriculum generated at: {target_path}")
    print(f"Counts: N5={len(decks['N5'])}, N4={len(decks['N4'])}, N3={len(decks['N3'])}, N2={len(decks['N2'])}, Total={len(master_seen)}")

if __name__ == '__main__':
    build_all_curriculum()
