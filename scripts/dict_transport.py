# -*- coding: utf-8 -*-
# Kosakata Lengkap Transportasi Umum, Angkutan Darat, Laut, Udara & Infrastruktur Kendaraan

DICT_TRANSPORT = [
    # Moda Angkutan Darat & Kereta Api
    ("路面電車", "ろめんでんしゃ", "romendensha", "Trem jalan raya listrik (Streetcar)", "Kata Benda - Kendaraan & Transportasi", "広島の街中を路面電車が走っています。", "Trem listrik jalan raya beroperasi di tengah kota Hiroshima."),
    ("リニアモーターカー", "りにあもーたーかー", "riniamootaakaa", "Kereta Maglev magnetik kecepatan super", "Kata Benda - Kendaraan & Transportasi", "時速五百キロで走行するリニアです。", "Kereta Maglev magnetik melaju dengan kecepatan 500 km/jam."),
    ("新交通システム", "しんこうつうしすてむ", "shinkoutsuushisutemu", "Sistem Automated Guideway Transit (AGT / Yurikamome)", "Kata Benda - Kendaraan & Transportasi", "お台場へゆりかもめの新交通システムで行きます。", "Pergi ke Odaiba menaiki moda transportasi AGT Yurikamome."),
    ("リムジンバス", "りむじんばす", "rimujinbasu", "Bus bandara eksekutif (Airport Limousine Bus)", "Kata Benda - Kendaraan & Transportasi", "羽田空港からホテル直行のリムジンバスに乗ります。", "Naik bus bandara limousine langsung menuju hotel dari Bandara Haneda."),
    ("深夜急行バス", "しんやきゅうこうばす", "shinyakyuukoubasu", "Bus ekspres tengah malam", "Kata Benda - Kendaraan & Transportasi", "終電を逃した後に深夜急行バスを利用します。", "Menggunakan bus ekspres tengah malam setelah ketinggalan kereta terakhir."),
    ("コミュニティバス", "こみゅにてぃばす", "komyunitibasu", "Bus mikro lingkungan permukiman (Feeder)", "Kata Benda - Kendaraan & Transportasi", "住宅地と病院を結ぶコミュニティバスです。", "Bus pengumpan komunitas yang menghubungkan perumahan dengan rumah sakit."),
    ("電動アシスト自転車", "でんどうあしすとじてんしゃ", "dendou asisuto jitensha", "Sepeda listrik tenaga pedal bantu", "Kata Benda - Kendaraan & Transportasi", "坂道も電動アシスト自転車なら楽に登れます。", "Jalan menanjak terasa ringan dilalui dengan sepeda listrik bantuan."),
    ("原動機付自転車", "げんどうきつきじてんしゃ", "gendoukitsuki jitensha", "Sepeda motor bebek kecil 50cc (Gentsuki)", "Kata Benda - Kendaraan & Transportasi", "郵便配達員が原付バイクに乗っています。", "Petugas kurir pos mengendarai motor bebek kecil gentsuki."),
    ("大型自動二輪車", "おおがたじどうにりんしゃ", "oogata jidounirinsha", "Motor gede kubikasi besar (Moge)", "Kata Benda - Kendaraan & Transportasi", "大型バイクでツーリングに出かけます。", "Pergi turing berkendara dengan motor gede."),
    ("サイドカー", "さいどかー", "saidokaa", "Motor gandeng samping (Sidecar)", "Kata Benda - Kendaraan & Transportasi", "クラシックなサイドカー付きバイクです。", "Sepeda motor antik dilengkapi sespan gandeng samping."),
    ("人力車", "じんりきしゃ", "jinrikisha", "Becak tarik tradisional Jepang (Jinrikisha)", "Kata Benda - Kendaraan & Transportasi", "京都や浅草で観光用の人力車に乗ります。", "Menaiki becak tarik wisata jinrikisha di Kyoto dan Asakusa."),

    # Moda Angkutan Darat Khusus & Darurat
    ("救急車", "きゅうきゅうしゃ", "kyuukyuusha", "Mobil ambulans darurat medis", "Kata Benda - Kendaraan & Transportasi", "サイレンを鳴らして救急車が急行します。", "Ambulans melaju cepat membunyikan sirine darurat."),
    ("消防車", "しょうぼうしゃ", "shoubousha", "Mobil pemadam kebakaran", "Kata Benda - Kendaraan & Transportasi", "火災現場に赤い消防車が到着しました。", "Mobil pemadam kebakaran merah tiba di lokasi kebakaran."),
    ("パトロールカー", "ぱとろーるかー", "patoroorukaa", "Mobil patroli polisi (Patcar)", "Kata Benda - Kendaraan & Transportasi", "パトカーが夜間の街を巡回しています。", "Mobil patroli kepolisian berpatroli mengelilingi kota di malam hari."),
    ("白バイ", "しろばい", "shirobai", "Motor patroli polisi putih", "Kata Benda - Kendaraan & Transportasi", "交通違反を取り締まる白バイ隊員です。", "Petugas polisi bermotor putih menertibkan pelanggaran lalu lintas."),
    ("清掃車", "せいそうしゃ", "seisousha", "Truk pengangkut sampah lingkungan", "Kata Benda - Kendaraan & Transportasi", "朝の決まった時間にゴミ収集車が来ます。", "Truk pengangkut sampah tiba pada jam yang ditentukan tiap pagi."),
    ("レッカー車", "れっかーしゃ", "rekkaasha", "Mobil derek penarik kendaraan mogok", "Kata Benda - Kendaraan & Transportasi", "故障車をレッカー車で修理工場へ運びます。", "Menderek mobil mogok ke bengkel dengan mobil derek."),
    ("ダンプカー", "だんぷかー", "danpukaa", "Truk jungkit proyek (Dump Truck)", "Kata Benda - Kendaraan & Transportasi", "工事現場でダンプカーが土砂を運びます。", "Truk jungkit mengangkut tanah galian di area proyek."),

    # Moda Angkutan Laut & Udara
    ("客船", "きゃくせん", "kyakusen", "Kapal penumpang kapal pesiar (Cruise Ship)", "Kata Benda - Kendaraan & Transportasi", "豪華客船で世界一周クルーズに出発します。", "Berangkat berlayar keliling dunia dengan kapal pesiar mewah."),
    ("水中翼船", "すいちゅうよくせん", "suichuuyokusen", "Kapal hydrofoil cepat (Jetfoil)", "Kata Benda - Kendaraan & Transportasi", "ジェットフォイルで離島へ一時間で渡ります。", "Menyeberang ke pulau terpencil dalam satu jam naik jetfoil."),
    ("貨物船", "かもつせん", "kamotsusen", "Kapal kargo barang kontainer", "Kata Benda - Kendaraan & Transportasi", "港に大型のコンテナ貨物船が入港しました。", "Kapal kargo pengangkut kontainer besar merapat ke pelabuhan."),
    ("タンカー", "たんかー", "tankaa", "Kapal tanker minyak", "Kata Benda - Kendaraan & Transportasi", "巨大タンカーが原油を安全に輸送します。", "Kapal tanker raksasa mengangkut minyak mentah dengan aman."),
    ("ヘリコプター", "へりこぷたー", "herikoputaa", "Helikopter baling-baling putar", "Kata Benda - Kendaraan & Transportasi", "ドクターヘリが急患を大病院へ搬送します。", "Helikopter ambulans darurat mengangkut pasien kritis ke RS besar."),
    ("熱気球", "ねつききゅう", "netsukikyuu", "Balon udara panas wisata", "Kata Benda - Kendaraan & Transportasi", "朝焼けの空にカラフルな熱気球が浮かびます。", "Balon udara warna-warni melayang di langit fajar menyingsing."),
    ("飛行船", "ひこうせん", "hikousen", "Kapal udara zeppelin (Airship)", "Kata Benda - Kendaraan & Transportasi", "大空を巨大な飛行船がゆっくり飛行します。", "Kapal udara raksasa terbang perlahan melintasi angkasa luas."),

    # Komponen Kendaraan & Bagian Fisik
    ("ハンドル", "はんどる", "handoru", "Roda kemudi setir (Steering Wheel)", "Kata Benda - Kendaraan & Transportasi", "しっかりと両手でハンドルを握ります。", "Memegang roda kemudi setir dengan kuat menggunakan kedua belah tangan."),
    ("ブレーキ", "ぶれーき", "bureeki", "Pedal rem penghenti laju", "Kata Benda - Kendaraan & Transportasi", "赤信号の手前で静かにブレーキを踏みます。", "Menginjak pedal rem perlahan di depan lampu merah."),
    ("アクセル", "あくせる", "akuseru", "Pedal gas pemacu laju", "Kata Benda - Kendaraan & Transportasi", "発進時にアクセルをゆっくり踏み込みます。", "Menginjak pedal gas secara perlahan saat mulai melaju."),
    ("クラッチ", "くらっち", "kuracchi", "Pedal kopling transmisi manual", "Kata Benda - Kendaraan & Transportasi", "ギアを変えるときにクラッチを踏みます。", "Menginjak pedal kopling saat memindahkan gigi transmisi."),
    ("エンジン", "えんじん", "enjin", "Mesin motor penggerak", "Kata Benda - Kendaraan & Transportasi", "静かで燃費の良いハイブリッドエンジンです。", "Mesin hybrid yang senyap bersuara dan hemat bahan bakar."),
    ("タイヤ", "たいや", "taiya", "Ban roda karet", "Kata Benda - Kendaraan & Transportasi", "冬になる前にスタッドレスタイヤに交換します。", "Mengganti ke ban salju studless sebelum musim dingin tiba."),
    ("パンク", "ぱんく", "panku", "Ban bocor / Kempes", "Kata Benda - Kendaraan & Transportasi", "自転車のタイヤがパンクして修理しました。", "Ban sepeda kempes bocor dan telah diperbaiki."),
    ("フロントガラス", "ふろんとがらす", "furontogarasu", "Kaca depan pelindung angin (Windshield)", "Kata Benda - Kendaraan & Transportasi", "雨の日にワイパーでフロントガラスを拭きます。", "Wiper membersihkan kaca depan mobil saat hari hujan."),
    ("ワイパー", "わいぱー", "waipaa", "Penghapus kaca mobil (Wiper)", "Kata Benda - Kendaraan & Transportasi", "大雨でワイパーを一番速く動かします。", "Menyalakan wiper pada kecepatan tertinggi saat hujan deras."),
    ("ヘッドライト", "へっどらいと", "heddoraito", "Lampu sorot depan kendaraan (Headlight)", "Kata Benda - Kendaraan & Transportasi", "夕暮れ時に早めにヘッドライトを点灯します。", "Menyalakan lampu sorot depan lebih awal saat senja tiba.")
]

print(f"Loaded {len(DICT_TRANSPORT)} transport items.")
