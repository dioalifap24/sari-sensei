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
    'Kosakata Pekerjaan & Sehari-hari': '仕事・生活',
    'Angka': '数字',
    'Uang': 'お金',
    'Nama Buah': '果物',
    'Kendaraan Umum': '乗り物',
    'Kosakata Sehari-hari': '日常生活',
    'Pekerjaan': '仕事',
    'Sapaan': '挨拶'
}

# Additional authentic Minna no Nihongo Bab 1-25 kotoba to guarantee reaching 800 - 1000 items
MNN_ADDITIONS = [
    # Bab 1 - 5 Tambahan
    ("初め", "はじめ", "hajime", "Awal permulaan", "Kosakata Pekerjaan & Sehari-hari", "初めの一歩を踏み出します。", "Mengambil langkah permulaan."),
    ("終わり", "おわり", "owari", "Akhir / Penutup", "Kosakata Pekerjaan & Sehari-hari", "授業の終わりを告げます。", "Memberitahukan akhir pelajaran."),
    ("外国", "がいこく", "gaikoku", "Negara luar / Mancanegara", "Kata Benda - Tempat & Fasilitas", "外国からのお客様を迎えます。", "Menyambut tamu dari luar negeri."),
    ("外国人", "がいこくじん", "gaikokujin", "Warga negara asing", "Kata Benda - Keluarga & Orang", "多くの外国人が働いています。", "Banyak warga negara asing bekerja."),
    ("何語", "なんご", "nango", "Bahasa apa?", "Kata Tanya & Kata Ganti", "何語を話すことができますか。", "Bahasa apa yang bisa Anda ucapkan?"),
    ("英語", "えいご", "eigo", "Bahasa Inggris", "Kosakata Pekerjaan & Sehari-hari", "英語でメールを書きます。", "Menulis email dalam bahasa Inggris."),
    ("日本語", "にほんご", "nihongo", "Bahasa Jepang", "Kosakata Pekerjaan & Sehari-hari", "毎日日本語を練習します。", "Berlatih bahasa Jepang setiap hari."),
    ("インドネシア語", "いんどねしあご", "indoneshiago", "Bahasa Indonesia", "Kosakata Pekerjaan & Sehari-hari", "インドネシア語を教えます。", "Mengajar bahasa Indonesia."),
    ("歳", "さい", "sai", "Tahun usia / Umur", "Penunjuk Waktu & Angka", "今年二十歳になります。", "Tahun ini genap berusia 20 tahun."),
    ("名前", "なまえ", "namae", "Nama sebutan", "Kata Tanya & Kata Ganti", "ここにお名前を書いてください。", "Silakan tulis nama Anda di sini."),
    ("お名前", "おなまえ", "onamae", "Nama Anda (sopan)", "Kata Tanya & Kata Ganti", "お名前は何ですか。", "Siapakah nama Anda?"),
    ("国籍", "こくせき", "kokuseki", "Kewarganegaraan", "Kata Tanya & Kata Ganti", "国籍を記入します。", "Mengisi kolom kewarganegaraan."),

    # Bab 6 - 10 Tambahan (Makanan, Tempat, Eksistensi Benda)
    ("朝食", "ちょうしょく", "choushoku", "Makan pagi (sarapan formal)", "Kata Benda - Buah & Makanan", "ホテルの朝食を食べます。", "Menyantap sarapan pagi di hotel."),
    ("昼食", "ちゅうしょく", "chuushoku", "Makan siang formal", "Kata Benda - Buah & Makanan", "同僚と昼食をとります。", "Makan siang bersama rekan kerja."),
    ("夕食", "ゆうしょく", "yuushoku", "Makan malam formal", "Kata Benda - Buah & Makanan", "家族そろって夕食を食べます。", "Menyantap makan malam bersama keluarga."),
    ("喫茶店", "きっさてん", "kissaten", "Kedai kopi tradisional (Cafe)", "Kata Benda - Tempat & Fasilitas", "静かな喫茶店で読書します。", "Membaca buku di kedai kopi yang hening."),
    ("映画", "えいが", "eiga", "Film bioskop", "Kosakata Pekerjaan & Sehari-hari", "週末に新作映画を見ます。", "Menonton film karya terbaru di akhir pekan."),
    ("音楽", "おんがく", "ongaku", "Musik alunan", "Kosakata Pekerjaan & Sehari-hari", "好きな音楽を聴きながら走ります。", "Berlari sambil mendengarkan musik kegemaran."),
    ("手紙", "てがみ", "tegami", "Surat kabar pos", "Kata Benda - Rumah & Barang", "感謝の手紙を送ります。", "Mengirimkan surat ucapan terima kasih."),
    ("切手", "きって", "kitte", "Perangko tempel pos", "Kata Benda - Sekolah & Kantor", "封筒に八十四円の切手を貼ります。", "Menempelkan perangko 84 yen pada amplop."),
    ("葉書", "はがき", "hagaki", "Kartu pos", "Kata Benda - Sekolah & Kantor", "旅先から絵葉書を送ります。", "Mengirim kartu pos bergambar dari tempat wisata."),
    ("封筒", "ふうとう", "fuutou", "Amplop surat", "Kata Benda - Sekolah & Kantor", "書類を白い封筒に入れます。", "Memasukkan dokumen ke dalam amplop putih."),
    ("箱", "はこ", "hako", "Kotak kardus", "Kata Benda - Rumah & Barang", "ダンボールの箱を開けます。", "Membuka kotak kardus."),
    ("棚", "たな", "tana", "Rak susun lemari", "Kata Benda - Rumah & Barang", "本棚に辞書を並べます。", "Menata kamus di rak buku."),
    ("上", "うえ", "ue", "Atas posisi", "Kata Tanya & Kata Ganti", "机の上にノートがあります。", "Ada buku catatan di atas meja."),
    ("下", "した", "shita", "Bawah posisi", "Kata Tanya & Kata Ganti", "椅子の下に猫がいます。", "Ada kucing di bawah kursi."),
    ("前", "まえ", "mae", "Depan posisi / Waktu lampau", "Kata Tanya & Kata Ganti", "駅の前で待ち合わせます。", "Janji temu di depan stasiun."),
    ("後ろ", "うしろ", "ushiro", "Belakang posisi", "Kata Tanya & Kata Ganti", "木の後ろに隠れます。", "Bersembunyi di belakang pohon."),
    ("右", "みぎ", "migi", "Kanan arah", "Kata Tanya & Kata Ganti", "右に曲がってください。", "Silakan belok kanan."),
    ("左", "ひだり", "hidari", "Kiri arah", "Kata Tanya & Kata Ganti", "左側にポストがあります。", "Ada kotak pos di sebelah kiri."),
    ("中", "なか", "naka", "Dalam bagian", "Kata Tanya & Kata Ganti", "かばんの中に財布があります。", "Ada dompet di dalam tas."),
    ("外", "そと", "soto", "Luar bagian", "Kata Tanya & Kata Ganti", "外で子供が遊んでいます。", "Anak-anak bermain di luar."),
    ("隣", "となり", "tonari", "Sebelah berdampingan", "Kata Tanya & Kata Ganti", "銀行の隣に郵便局があります。", "Ada kantor pos di sebelah bank."),
    ("近く", "ちかく", "chikaku", "Dekat area sekitar", "Kata Tanya & Kata Ganti", "駅の近くに住んでいます。", "Tinggal di dekat area stasiun."),
    ("間", "あいだ", "aida", "Antara celah / Waktu jeda", "Kata Tanya & Kata Ganti", "本とペンの間にメモがあります。", "Ada catatan di antara buku dan pena."),

    # Bab 11 - 15 Tambahan (Satuan Hitung, Izin, Rutinitas)
    ("一枚", "いちまい", "ichimai", "Satu lembar (kertas/baju/piring)", "Penunjuk Waktu & Angka", "紙を一枚ください。", "Tolong minta selembar kertas."),
    ("二枚", "にまい", "nimai", "Dua lembar", "Penunjuk Waktu & Angka", "シャツを二枚買います。", "Membeli dua lembar kemeja."),
    ("一本", "いっぽん", "ippon", "Satu batang (pena/pohon/botol)", "Penunjuk Waktu & Angka", "ペンを一本貸してください。", "Tolong pinjamkan satu batang pena."),
    ("二本", "にほん", "nihon", "Dua batang", "Penunjuk Waktu & Angka", "ジュースを二本買いました。", "Membeli dua botol jus."),
    ("三本", "さんぼん", "sanbon", "Tiga batang", "Penunjuk Waktu & Angka", "木が三本立っています。", "Ada tiga batang pohon berdiri."),
    ("一台", "いちだい", "ichidai", "Satu unit (mesin/mobil/komputer)", "Penunjuk Waktu & Angka", "パソコンを一台買いました。", "Membeli satu unit komputer."),
    ("二台", "にだい", "nidai", "Dua unit", "Penunjuk Waktu & Angka", "車が二台停まっています。", "Ada dua unit mobil terparkir."),
    ("一冊", "いっさつ", "issatsu", "Satu jilid (buku/majalah)", "Penunjuk Waktu & Angka", "本を一冊読み終えました。", "Selesai membaca satu jilid buku."),
    ("二冊", "にさつ", "nisatsu", "Dua jilid", "Penunjuk Waktu & Angka", "ノートを二冊使います。", "Menggunakan dua jilid buku catatan."),
    ("一着", "いっちゃく", "icchaku", "Satu stel (setelan baju/jas)", "Penunjuk Waktu & Angka", "スーツを一着仕立てます。", "Menjahit satu stel setelan jas."),
    ("一足", "いっそく", "issoku", "Satu pasang (sepatu/kaus kaki)", "Penunjuk Waktu & Angka", "靴を一足買いました。", "Membeli satu pasang sepatu."),
    ("一杯", "いっぱい", "ippai", "Satu cangkir / Penuh kenyang", "Penunjuk Waktu & Angka", "お茶を一杯いただきます。", "Menikmati satu cangkir teh."),
    ("二杯", "にはい", "nihai", "Dua cangkir", "Penunjuk Waktu & Angka", "コーヒーを二杯飲みました。", "Minum dua cangkir kopi."),
    ("三杯", "さんばい", "sanbai", "Tiga cangkir", "Penunjuk Waktu & Angka", "お冷を三杯おかわりします。", "Menambah tiga gelas air dingin."),
    ("一回", "いっかい", "ikkai", "Satu kali frekuensi", "Penunjuk Waktu & Angka", "一日に一回薬を飲みます。", "Minum obat satu kali sehari."),
    ("二回", "にかい", "nikai", "Dua kali frekuensi", "Penunjuk Waktu & Angka", "週に二回スポーツをします。", "Berolahraga dua kali seminggu."),
    ("何回", "なんかい", "nankai", "Berapa kali?", "Kata Tanya & Kata Ganti", "日本へ何回来ましたか。", "Sudah berapa kali datang ke Jepang?"),
    ("一階", "いっかい", "ikkai", "Lantai satu", "Kata Benda - Tempat & Fasilitas", "受付は一階にあります。", "Resepsionis ada di lantai satu."),
    ("二階", "にかい", "nikai", "Lantai dua", "Kata Benda - Tempat & Fasilitas", "私の部屋は二階です。", "Kamar saya ada di lantai dua."),
    ("地下", "ちか", "chika", "Bawah tanah (Basement)", "Kata Benda - Tempat & Fasilitas", "地下に食品売り場があります。", "Ada area makanan di lantai bawah tanah."),
    ("地下二階", "ちかにかい", "chikanikai", "Lantai basement 2 (B2)", "Kata Benda - Tempat & Fasilitas", "地下二階に駐車場があります。", "Tempat parkir ada di lantai B2."),

    # Bab 16 - 20 Tambahan (Verba Gerak, Kebiasaan, Aturan)
    ("渡ります", "わたります", "watarimasu", "Menyeberang jalan/jembatan", "Kata Kerja Dasar", "横断歩道を渡ります。", "Menyeberang di jalur penyeberangan zebra cross."),
    ("曲がります", "まがります", "magarimasu", "Belok arah tikungan", "Kata Kerja Dasar", "次の信号を右に曲がります。", "Belok kanan di lampu merah berikutnya."),
    ("通ります", "とおります", "toorimasu", "Melintasi / Melewati jalan", "Kata Kerja Dasar", "商店街を通って帰ります。", "Pulang melewati area pertokoan."),
    ("歩きます", "あるきます", "arukimasu", "Berjalan kaki", "Kata Kerja Dasar", "駅まで十五分歩きます。", "Berjalan kaki 15 menit ke stasiun."),
    ("走ります", "はしります", "hashirimasu", "Berlari kencang", "Kata Kerja Dasar", "公園で元気に走ります。", "Berlari dengan penuh semangat di taman."),
    ("立ち止まります", "たちどまります", "tachidomarimasu", "Berhenti melangkah sesaat", "Kata Kerja Dasar", "赤信号で立ち止まります。", "Berhenti melangkah saat lampu merah."),
    ("置きます", "おきます", "okimasu", "Menaruh / Meletakkan barang", "Kata Kerja Dasar", "机の上に鍵を置きます。", "Meletakkan kunci di atas meja."),
    ("取ります", "とります", "torimasu", "Mengambil benda / Garam", "Kata Kerja Dasar", "お塩を取ってください。", "Tolong ambilkan garam."),
    ("手に入れます", "てにいれます", "teniiremasu", "Mendapatkan / Memperoleh", "Kata Kerja Dasar", "限定チケットを手に入れます。", "Mendapatkan tiket edisi terbatas."),
    ("着ます", "きます", "kimasu", "Mengenakan baju atasan/jas", "Kata Kerja Dasar", "ジャケットを着ます。", "Mengenakan jaket blazer."),
    ("履きます", "はきます", "hakimasu", "Mengenakan celana/rok/sepatu", "Kata Kerja Dasar", "新しいスニーカーを履きます。", "Mengenakan sepatu kets baru."),
    ("被ります", "かぶります", "kaburimasu", "Mengenakan topi di kepala", "Kata Kerja Dasar", "帽子を被って出かけます。", "Mengenakan topi lalu bepergian."),
    ("掛けます", "かけます", "kakemasu", "Mengenakan kacamata", "Kata Kerja Dasar", "眼鏡を掛けて字を読みます。", "Mengenakan kacamata untuk membaca tulisan."),
    ("外します", "はずします", "hazushimasu", "Melepaskan aksesori/kacamata", "Kata Kerja Dasar", "寝る前に眼鏡を外します。", "Melepaskan kacamata sebelum tidur."),
    ("生まれます", "うまれます", "umaremasu", "Lahir ke dunia", "Kata Kerja Dasar", "東京で生まれました。", "Saya lahir di Tokyo."),
    ("死にます", "しにます", "shinimasu", "Meninggal dunia", "Kata Kerja Dasar", "祖父は九十歳で安らかに亡くなりました。", "Kakek wafat dengan tenang di usia 90 tahun."),

    # Bab 21 - 25 Tambahan (Pendapat, Kondisi, Hubungan Sosial)
    ("動きます", "うごきます", "ugokimasu", "Bergerak / Mesin beroperasi", "Kata Kerja Dasar", "機械が正常に動きます。", "Mesin beroperasi dengan normal."),
    ("止まります", "とまります", "tomarimasu", "Berhenti (kendaraan/mesin)", "Kata Kerja Dasar", "電車が駅で止まります。", "Kereta berhenti di stasiun."),
    ("故障します", "こしょうします", "koshoushimasu", "Mengalami kerusakan teknis", "Kata Kerja Dasar", "エアコンが故障しました。", "Pendingin ruangan mengalami kerusakan teknis."),
    ("修理します", "しゅうりします", "shuurishimasu", "Memperbaiki / Servis alat", "Kata Kerja Dasar", "時計屋で修理してもらいます。", "Minta diservis di toko jam."),
    ("間に合います", "まにあいます", "maniaimasu", "Tepat waktu / Keburu jadwal", "Kata Kerja Dasar", "新幹線の時間に間に合いました。", "Tepat waktu mengejar jadwal Shinkansen."),
    ("遅れます", "おくれます", "okuremasu", "Terlambat dari waktu yang ditentukan", "Kata Kerja Dasar", "事故でバスが遅れます。", "Bus terlambat karena kecelakaan."),
    ("勝ちます", "かちます", "kachimasu", "Menang kompetisi", "Kata Kerja Dasar", "サッカーの試合に勝ちました。", "Menang dalam pertandingan sepak bola."),
    ("負けます", "まけます", "makemasu", "Kalah pertandingan", "Kata Kerja Dasar", "決勝戦で惜しくも負けました。", "Kalah tipis di babak final."),
    ("見つけます", "みつけます", "mitsukemasu", "Menemukan benda yang dicari", "Kata Kerja Dasar", "落とした財布を見つけました。", "Menemukan dompet yang terjatuh."),
    ("拾います", "ひろいます", "hiroimasu", "Memungut barang di jalan", "Kata Kerja Dasar", "道で小銭を拾いました。", "Memungut uang koin di jalan."),
    ("連絡します", "れんらくします", "renrakushimasu", "Menghubungi / Memberi kabar", "Kata Kerja Dasar", "着いたらすぐ連絡します。", "Begitu tiba akan segera memberi kabar."),
    ("相談します", "そうだんします", "soudanshimasu", "Berkonsultasi mencari solusi", "Kata Kerja Dasar", "進路について先生に相談します。", "Berkonsultasi tentang jurusan kepada guru."),
    ("片付けます", "かたづけます", "katazukemasu", "Merapikan / Membereskan barang", "Kata Kerja Dasar", "食後の食器を片付けます。", "Membereskan piring setelah makan."),
    ("並べます", "ならべます", "narabemasu", "Menata berjejer rapi", "Kata Kerja Dasar", "机の上に書類を並べます。", "Menata dokumen berjejer di atas meja."),
    ("貼ります", "はります", "harimasu", "Menempelkan stiker/pengumuman", "Kata Kerja Dasar", "壁にポスターを貼ります。", "Menempelkan poster di dinding."),
    ("掛けます", "かけます", "kakemasu", "Menggantungkan baju/lukisan", "Kata Kerja Dasar", "ハンガーにコートを掛けます。", "Menggantung mantel pada gantungan."),
    ("飾ります", "かざります", "kazarimasu", "Menghias / Memajang dekorasi", "Kata Kerja Dasar", "部屋に季節の花を飾ります。", "Menghias kamar dengan bunga musiman."),
    ("植えます", "うえます", "uemasu", "Menanam tanaman/pohon", "Kata Kerja Dasar", "庭にチューリップを植えます。", "Menanam bunga tulip di kebun."),
    ("戻します", "もどします", "modoshimasu", "Mengembalikan benda ke tempat semula", "Kata Kerja Dasar", "本を元の位置に戻します。", "Mengembalikan buku ke tempat semula."),
    ("まとめます", "まとめます", "matomemasu", "Merangkum / Mengumpulkan ide", "Kata Kerja Dasar", "意見を分かりやすくまとめます。", "Merangkum pendapat agar mudah dipahami."),
    ("しまいます", "しまいます", "shimaimasu", "Menyimpan ke dalam lemari", "Kata Kerja Dasar", "冬服をタンスにしまいます。", "Menyimpan baju musim dingin ke lemari."),
    ("決めます", "きめます", "kimemasu", "Menetapkan / Memutuskan rencana", "Kata Kerja Dasar", "次の旅行先を決めます。", "Memutuskan destinasi liburan berikutnya."),
    ("知らせます", "しらせます", "shirasemasu", "Memberitahukan pengumuman", "Kata Kerja Dasar", "合格の結果を家族に知らせます。", "Memberitahukan kabar kelulusan ke keluarga."),
    ("予習します", "よしゅうします", "yoshuushimasu", "Mempersiapkan pelajaran sebelum kelas", "Kata Kerja Dasar", "明日の文法を予習します。", "Mempersiapkan tata bahasa untuk besok."),
    ("復習します", "ふくしゅうします", "fukushuushimasu", "Mengulang kembali materi pelajaran", "Kata Kerja Dasar", "今日習った漢字を復習します。", "Mengulang kanji yang dipelajari hari ini."),
    ("そのままにします", "そのままにします", "sonomamani shimasu", "Membiarkan apa adanya", "Kata Kerja Dasar", "資料はそのままにしておいてください。", "Tolong biarkan materi itu apa adanya."),

    # Ekstra N5 Benda & Ungkapan Komunikasi
    ("お祭り", "おまつり", "omatsuri", "Pesta festival kebudayaan", "Kosakata Pekerjaan & Sehari-hari", "浴衣を着てお祭りに行きます。", "Mengenakan yukata lalu pergi ke festival."),
    ("花火", "はなび", "hanabi", "Kembang api malam", "Kosakata Pekerjaan & Sehari-hari", "夏の夜空に花火が打ち上がります。", "Kembang api meluncur di langit malam musim panas."),
    ("花見", "はなみ", "hanami", "Piknik melihat sakura", "Kosakata Pekerjaan & Sehari-hari", "春に公園でお花見をします。", "Melakukan hanami melihat sakura di taman saat musim semi."),
    ("約束", "やくそく", "yakusoku", "Janji komitmen waktu", "Kosakata Pekerjaan & Sehari-hari", "約束の時間に遅れないようにします。", "Berusaha tidak terlambat dari waktu janji temu."),
    ("時間割", "じかんわり", "jikanwari", "Jadwal mata pelajaran kelas", "Kata Benda - Sekolah & Kantor", "明日の時間割を確認します。", "Memeriksa jadwal pelajaran besok."),
    ("予定", "よてい", "yotei", "Jadwal acara / Rencana agenda", "Kosakata Pekerjaan & Sehari-hari", "来週の予定を手帳に書き込みます。", "Mencatat agenda minggu depan di buku harian."),
    ("手帳", "てちょう", "techou", "Buku agenda saku", "Kata Benda - Sekolah & Kantor", "スケジュールを手帳で管理します。", "Mengelola jadwal kegiatan dengan buku agenda."),
    ("ごみ", "ごみ", "gomi", "Sampah buangan", "Kata Benda - Rumah & Barang", "燃えるゴミを分別して捨てます。", "Memilah dan membuang sampah organik yang mudah terbakar."),
    ("ごみ箱", "ごみばこ", "gomibako", "Tempat sampah tong", "Kata Benda - Rumah & Barang", "ゴミ箱に捨ててください。", "Tolong buang ke dalam tempat sampah."),
    ("案内", "あんない", "annai", "Pemanduan / Informasi petunjuk", "Kosakata Pekerjaan & Sehari-hari", "観光地を案内してもらいました。", "Dipandu berkeliling di tempat wisata."),
    ("説明", "せつめい", "setsumei", "Penjelasan keterangan", "Kosakata Pekerjaan & Sehari-hari", "使い方の説明を詳しく聞きます。", "Mendengarkan penjelasan cara pakai secara rinci."),
    ("案内書", "あんないしょ", "annaisho", "Brosur panduan wisata/fasilitas", "Kata Benda - Sekolah & Kantor", "案内書を読んで道を確認します。", "Membaca brosur panduan untuk mengecek jalan.")
]

def build_n5_master():
    raw_list = []
    raw_list.extend(N5_AISATSU)
    raw_list.extend(N5_PRONOUNS_QUESTIONS)
    raw_list.extend(N5_TIME_NUMBERS_MONEY)
    raw_list.extend(N5_NOUNS_FOOD_FRUIT)
    raw_list.extend(N5_NOUNS_TRANSPORT)
    raw_list.extend(N5_NOUNS_PLACES)
    raw_list.extend(N5_NOUNS_FAMILY_PEOPLE)
    raw_list.extend(N5_NOUNS_HOME_ITEMS)
    raw_list.extend(N5_NOUNS_SCHOOL_OFFICE)
    raw_list.extend(N5_NOUNS_BODY_CLOTHING)
    raw_list.extend(N5_NOUNS_NATURE_WEATHER)
    raw_list.extend(N5_VERBS_BASIC)
    raw_list.extend(N5_ADJECTIVES)
    raw_list.extend(N5_WORK_DAILY)
    raw_list.extend(MNN_ADDITIONS)
    raw_list.extend(N5_MNN_ADDITIONS_2)
    
    # Filter duplicates while maintaining strict order
    seen = set()
    unique_list = []
    for item in raw_list:
        key = item[0]
        if key not in seen:
            seen.add(key)
            unique_list.append(item)
            
    print(f"Base unique N5 items count: {len(unique_list)}")
    return unique_list

print("Master N5 builder module ready.")
