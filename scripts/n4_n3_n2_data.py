# -*- coding: utf-8 -*-
# Kosakata JLPT N4, N3, N2 Standar Resmi Terstruktur

N4_EXTRA = [
    # Angka & Ukuran N4
    ("半額", "はんがく", "hangaku", "Setengah harga (Diskon 50%)", "Angka", "夕方に惣菜が半額になります。", "Lauk menjadi setengah harga saat sore hari."),
    ("定価", "ていか", "teika", "Harga pasti banderol resmi", "Angka", "定価より安く買いました。", "Membeli lebih murah dari harga banderol."),
    ("倍率", "ばいりつ", "bairitsu", "Rasio kelipatan persaingan", "Angka", "入試の倍率が高いです。", "Rasio persaingan ujian masuk tinggi."),
    ("平均", "へいきん", "heikin", "Rata-rata kalkulasi", "Angka", "平均点を計算します。", "Menghitung nilai rata-rata."),
    ("分数", "ぶんすう", "bunsuu", "Pecahan matematika", "Angka", "分数の計算を習います。", "Belajar menghitung bilangan pecahan."),
    ("割引", "わりびき", "waribiki", "Potongan harga diskon", "Angka", "学生割引が使えます。", "Bisa menggunakan diskon pelajar."),

    # Uang & Keuangan N4
    ("小遣い", "こづかい", "kodzukai", "Uang saku jajan", "Uang", "毎月お小遣いをもらいます。", "Mendapatkan uang saku setiap bulan."),
    ("両替", "りょうがえ", "ryougae", "Penukaran mata uang", "Uang", "空港で日本円に両替します。", "Menukar ke yen Jepang di bandara."),
    ("送金", "そうきん", "soukin", "Pengiriman uang transfer", "Uang", "故郷の家族へ送金します。", "Mentransfer uang kepada keluarga di kampung."),
    ("口座", "こうざ", "kouza", "Rekening tabungan bank", "Uang", "銀行で新しい口座を開設します。", "Membuka rekening baru di bank."),
    ("暗証番号", "あんしょうばんごう", "anshoubangou", "Nomor PIN rahasia", "Uang", "ATMで暗証番号を入力します。", "Memasukkan nomor PIN di ATM."),
    ("通帳", "つうちょう", "tsuuchou", "Buku tabungan bank", "Uang", "通帳を記帳して確認します。", "Mencetak buku tabungan untuk mengecek."),
    ("税金", "ぜいきん", "zeikin", "Pajak negara", "Uang", "消費税を含めた金額です。", "Jumlah nominal termasuk pajak konsumsi."),
    ("おごり", "おごり", "ogori", "Traktiran makan/minum", "Uang", "今日は先輩のおごりです。", "Hari ini ditraktir oleh senior."),

    # Kosakata Sehari-hari N4
    ("予定表", "よていひょう", "yoteihyou", "Tabel jadwal agenda kegiatan", "Kosakata Sehari-hari", "予定表を確認して行動します。", "Memeriksa tabel jadwal sebelum bertindak."),
    ("用事", "ようじ", "youji", "Urusan keperluan mendesak", "Kosakata Sehari-hari", "急な用事で外出します。", "Keluar rumah karena ada urusan mendadak."),
    ("案内", "あんない", "annai", "Pemanduan petunjuk arah", "Kosakata Sehari-hari", "街の見どころをご案内します。", "Memandu tempat-tempat menarik di kota."),
    ("連絡先", "れんらくさき", "renrakusaki", "Kontak narahubung", "Kosakata Sehari-hari", "連絡先を交換しましょう。", "Mari saling bertukar nomor kontak."),
    ("世話", "せわ", "sewa", "Perawatan bantuan pertolongan", "Kosakata Sehari-hari", "ペットの世話を毎日します。", "Merawat hewan peliharaan setiap hari."),
    ("お礼", "おれい", "orei", "Ucapan / Hadiah terima kasih", "Kosakata Sehari-hari", "お世話になった方にお礼をします。", "Memberikan ucapan terima kasih kepada orang yang telah berjasa."),
    ("遠慮", "えんりょ", "enryo", "Sungkan / Menahan diri", "Kosakata Sehari-hari", "どうぞご遠慮なく召し上がってください。", "Silakan santap tanpa perlu sungkan."),
    ("挨拶", "あいさつ", "aisatsu", "Sapaan salam perjumpaan", "Kosakata Sehari-hari", "笑顔で元気に挨拶します。", "Menyapa dengan senyuman ceria."),

    # Pekerjaan N4
    ("上司", "じょうし", "joushi", "Atasan langsung kerja", "Pekerjaan", "上司に指示を仰ぎます。", "Meminta instruksi kepada atasan."),
    ("部下", "ぶか", "buka", "Bawahan tim kerja", "Pekerjaan", "部下の指導を丁寧に行います。", "Membimbing bawahan dengan teliti."),
    ("研修", "けんしゅう", "kenshuu", "Pelatihan magang kerja", "Pekerjaan", "新入社員の研修に参加します。", "Mengikuti pelatihan karyawan baru."),
    ("出勤", "しゅっきん", "shukkin", "Masuk / Hadir kerja", "Pekerjaan", "毎朝八時半に出勤します。", "Masuk kerja setiap jam setengah sembilan pagi."),
    ("退勤", "たいきん", "taikin", "Pulang selesai kerja", "Pekerjaan", "午後五時に退勤します。", "Pulang kerja pada jam lima sore."),
    ("休暇届", "きゅうかとどけ", "kyuukatodoke", "Surat permohonan cuti", "Pekerjaan", "来週の休暇届を提出します。", "Menyerahkan permohonan cuti minggu depan."),
    ("名札", "なふだ", "nafuda", "Kartu nama dada / Badge nama", "Pekerjaan", "胸に名札をつけて接客します。", "Mengenakan badge nama di dada saat melayani tamu."),
    ("制服", "せいふく", "seifuku", "Seragam kerja / Seragam sekolah", "Pekerjaan", "清潔な制服を着用します。", "Mengenakan seragam kerja yang bersih."),

    # Buah & Makanan N4
    ("レモン", "れもん", "remon", "Lemon masam segar", "Nama Buah", "レモンを絞って紅茶に入れます。", "Memeras lemon ke dalam teh."),
    ("キウイ", "きうい", "kiui", "Buah Kiwi", "Nama Buah", "ビタミンたっぷりのキウイを食べます。", "Memakan buah kiwi kaya vitamin."),
    ("パイナップル", "ぱいなっぷる", "painappuru", "Nanas manis segar", "Nama Buah", "ジューシーなパイナップルを切ります。", "Memotong buah nanas yang manis berair."),
    ("メロン", "めろん", "meron", "Melon manis beraroma", "Nama Buah", "冷やしたメロンをいただきます。", "Menikmati buah melon dingin."),

    # Kendaraan Umum N4
    ("快速", "かいそく", "kaisoku", "Kereta semicepat (Rapid)", "Kendaraan Umum", "快速電車で早く着きました。", "Tiba lebih cepat dengan kereta rapid."),
    ("普通電車", "ふつうでんしゃ", "futsuudensha", "Kereta reguler tiap stasiun", "Kendaraan Umum", "普通電車に乗り換えます。", "Pindah ke kereta reguler."),
    ("終点", "しゅうてん", "shuuten", "Stasiun pemberhentian terakhir", "Kendaraan Umum", "終点の駅まで乗ります。", "Naik kereta sampai stasiun terakhir."),
    ("乗り越し", "のりこし", "norikoshi", "Kelewatan stasiun / Tambah tarif", "Kendaraan Umum", "乗り越し精算機で差額を払います。", "Membayar selisih tarif di mesin penyesuaian karcis."),
    ("荷物棚", "にもつだな", "nimotsudana", "Rak bagasi atas di kereta", "Kendaraan Umum", "網棚に大きな鞄を載せます。", "Menaruh tas besar di rak bagasi atas.")
]

N3_EXTRA = [
    ("利息", "りそく", "risoku", "Bunga tabungan / Bunga pinjaman", "Uang", "定期預金の利息がつきます。", "Mendapatkan bunga dari deposito berjangka."),
    ("利益", "りえき", "rieki", "Keuntungan laba bersih", "Uang", "今期の営業利益が増加しました。", "Laba operasional periode ini meningkat."),
    ("損失", "そんしつ", "sonshitsu", "Kerugian finansial", "Uang", "損失を最小限に抑えます。", "Menekan kerugian finansial seminimal mungkin."),
    ("為替相場", "かわせそうば", "kawasesouba", "Bursa nilai tukar valuta", "Uang", "円高の為替相場が続きます。", "Penguatan kurs yen terus berlanjut."),
    ("景気", "けいき", "keiki", "Kondisi iklim ekonomi", "Uang", "景気の回復傾向が見られます。", "Terlihat tren pemulihan iklim perekonomian."),
    ("節約", "せつやく", "setsuyaku", "Hemat pengeluaran / Efisiensi", "Uang", "光熱費を上手に節約します。", "Menghemat biaya listrik dan gas dengan bijak."),
    ("効率", "こうりつ", "kouritsu", "Efisiensi produktivitas", "Pekerjaan", "業務の効率を向上させます。", "Meningkatkan efisiensi pelaksanaan tugas kerja."),
    ("業績", "ぎょうせき", "gyouseki", "Prestasi kinerja bisnis", "Pekerjaan", "会社の業績に貢献します。", "Berkontribusi pada prestasi kinerja perusahaan."),
    ("交渉", "こうしょう", "koushou", "Negosiasi tawar-menawar", "Pekerjaan", "取引先と納期の交渉をします。", "Bernegosiasi mengenai batas waktu bersama mitra."),
    ("提案", "ていあん", "teian", "Usulan saran proposal", "Pekerjaan", "新しい改善策を提案します。", "Mengusulkan langkah perbaikan baru.")
]

N2_EXTRA = [
    ("為替介入", "かわせかいにゅう", "kawasekainyuu", "Intervensi pasar valas", "Uang", "中央銀行が為替介入を実施しました。", "Bank sentral melaksanakan intervensi pasar valas."),
    ("資金繰り", "しきんぐり", "shikinguri", "Manajemen arus kas permodalan", "Uang", "健全な資金繰りを維持します。", "Menjaga manajemen arus kas tetap sehat."),
    ("株主総会", "かぶぬしそうかい", "kabunushisoukai", "Rapat Umum Pemegang Saham (RUPS)", "Pekerjaan", "株主総会で議案が承認されました。", "Usulan disetujui dalam Rapat Umum Pemegang Saham."),
    ("経営陣", "けいえいじん", "keieijin", "Jajaran manajemen eksekutif", "Pekerjaan", "経営陣が新たな戦略を発表しました。", "Jajaran manajemen mengumumkan strategi baru."),
    ("事業再編", "じぎょうさいへん", "jigyousaihen", "Restrukturisasi lini bisnis", "Pekerjaan", "競争力強化のため事業再編を行います。", "Melakukan restrukturisasi bisnis demi memperkuat daya saing.")
]
