# -*- coding: utf-8 -*-
import json
import os
import sys

from compile_all_vocab import build_n5_master, CATEGORY_MAP_JP
from n4_n3_n2_data import N4_EXTRA, N3_EXTRA, N2_EXTRA

# N4, N3, N2 Data sets
N4_ITEMS = [
    # Angka & Satuan
    ("単位", "たんい", "tan'i", "Satuan baku ukuran / SKS kuliah", "Angka", "単位を計算します。", "Menghitung satuan baku."),
    ("割合", "わりあい", "wariai", "Proporsi / Persentase komparasi", "Angka", "合格者の割合が増えました。", "Proporsi peserta yang lulus bertambah."),
    ("合計", "ごうけい", "goukei", "Total akumulasi penjumlahan", "Angka", "合計金額を支払います。", "Membayar jumlah total uang belanja."),
    ("倍", "ばい", "bai", "Kelipatan / Dua kali lipat", "Angka", "売上が二倍になりました。", "Penjualan melonjak menjadi dua kali lipat."),
    ("億", "おく", "oku", "Ratus juta (100.000.000)", "Angka", "一億円が当選しました。", "Memenangkan undian seratus juta yen."),

    # Uang & Transaksi
    ("給与", "きゅうよ", "kyuuyo", "Gaji / Upah kompensasi kerja", "Uang", "毎月給与が口座に振り込まれます。", "Gaji ditransfer ke rekening bank tiap bulan."),
    ("家賃", "やちん", "yachin", "Biaya sewa rumah bulanan", "Uang", "今月の家賃を振り込みます。", "Mentransfer uang sewa rumah bulan ini."),
    ("学費", "がくひ", "gakuhi", "Biaya kuliah / SPP pendidikan", "Uang", "奨学金で学費を払います。", "Membayar biaya kuliah dengan beasiswa."),
    ("費用", "ひよう", "hiyou", "Biaya pengeluaran / Ongkos", "Uang", "旅行の費用を計算します。", "Menghitung biaya pengeluaran liburan."),
    ("領収書", "りょうしゅうしょ", "ryoushuusho", "Kwitansi tanda bukti pembayaran", "Uang", "レジで領収書をもらいます。", "Meminta tanda bukti kwitansi di meja kasir."),
    ("借金", "しゃっきん", "shakkin", "Hutang pinjaman uang", "Uang", "計画的に借金を返済します。", "Melunasi pinjaman hutang secara terencana."),
    ("貯金", "ちょきん", "chokin", "Tabungan simpanan uang", "Uang", "毎月少しずつ貯金します。", "Menabung sedikit demi sedikit setiap bulan."),
    ("手数料", "てすうりょう", "tesuuryou", "Biaya administrasi / Komisi transaksi", "Uang", "ATMの手数料がかかりません。", "Bebas biaya administrasi mesin ATM."),
    ("送料", "そうりょう", "souryou", "Ongkos kirim barang (Ongkir)", "Uang", "全国どこでも送料無料です。", "Gratis ongkos kirim ke seluruh wilayah."),
    ("定価", "ていか", "teika", "Harga resmi banderol produsen", "Uang", "定価より三割引きで買いました。", "Membeli dengan diskon 30 persen dari harga banderol."),

    # Kosakata Sehari-hari
    ("習慣", "しゅうかん", "shuukan", "Kebiasaan budaya / Rutinitas", "Kosakata Sehari-hari", "日本の生活習慣に慣れました。", "Sudah terbiasa dengan rutinitas budaya Jepang."),
    ("規則", "きそく", "kisoku", "Peraturan / Tata tertib", "Kosakata Sehari-hari", "寮の規則をしっかり守ります。", "Mematuhi tata tertib asrama dengan baik."),
    ("都合", "つごう", "tsugou", "Kondisi kesediaan waktu", "Kosakata Sehari-hari", "明日の都合はいかがですか。", "Bagaimana kesediaan waktu Anda untuk besok?"),
    ("機会", "きかい", "kikai", "Peluang / Kesempatan emas", "Kosakata Sehari-hari", "日本語を話す機会を増やします。", "Memperbanyak kesempatan berbicara bahasa Jepang."),
    ("予定", "よてい", "yotei", "Jadwal rencana agenda", "Kosakata Sehari-hari", "カレンダーに予定を書き込みます。", "Mencatat agenda rencana di kalender."),
    ("準備", "じゅんび", "junbi", "Persiapan kelengkapan", "Kosakata Sehari-hari", "面接の準備をしっかり行います。", "Melakukan persiapan wawancara dengan matang."),
    ("経験", "けいけん", "keiken", "Pengalaman hidup / Jam terbang", "Kosakata Sehari-hari", "海外で貴重な経験を積みました。", "Menimba pengalaman berharga di luar negeri."),
    ("趣味", "しゅみ", "shumi", "Hobi kegemaran waktu luang", "Kosakata Sehari-hari", "私の趣味は写真を撮ることです。", "Hobi saya adalah memotret foto pemandangan."),

    # Pekerjaan & Profesi
    ("会議", "かいぎ", "kaigi", "Rapat koordinasi tim", "Pekerjaan", "会議室で新企画を話し合います。", "Mendiskusikan rancangan baru di ruang rapat."),
    ("書類", "しょるい", "shorui", "Dokumen berkas resmi", "Pekerjaan", "大切な書類に捺印します。", "Membubuhkan cap stempel pada dokumen penting."),
    ("残業", "ざんぎょう", "zangyou", "Kerja lembur tambahan", "Pekerjaan", "締め切り前なので残業します。", "Lembur bekerja karena menjelang batas waktu."),
    ("出張", "しゅっちょう", "shucchou", "Perjalanan dinas kantor", "Pekerjaan", "来週名古屋へ出張します。", "Melakukan dinas luar kota ke Nagoya minggu depan."),
    ("面接", "めんせつ", "mensetsu", "Wawancara interview kerja", "Pekerjaan", "就職活動で面接を受けます。", "Menjalani wawancara dalam proses mencari kerja."),
    ("履歴書", "りれきしょ", "rirekisho", "Curriculum Vitae (CV) / Riwayat hidup", "Pekerjaan", "写真付きの履歴書を提出します。", "Menyerahkan CV yang dilengkapi pasfoto."),
    ("同僚", "どうりょう", "douryou", "Rekan kerja sejawat", "Pekerjaan", "親切な同僚と助け合います。", "Saling membantu bersama rekan kerja yang ramah."),
    ("先輩", "せんぱい", "senpai", "Senior pembimbing", "Pekerjaan", "先輩から仕事のコツを教わります。", "Mempelajari tips pekerjaan dari senior."),

    # Buah-buahan
    ("ぶどう", "ぶどう", "budou", "Anggur manis berbulir", "Nama Buah", "山梨県の美味しいぶどうです。", "Anggur lezat khas Prefektur Yamanashi."),
    ("いちご", "いちご", "ichigo", "Stroberi segar", "Nama Buah", "春にいちご狩りを楽しみます。", "Menikmati wisata petik buah stroberi saat musim semi."),
    ("スイカ", "すいか", "suika", "Semangka dingin", "Nama Buah", "夏休みに海辺でスイカ割りをします。", "Bermain membelah semangka di tepi pantai saat liburan."),
    ("桃", "もも", "momo", "Persik (Peach)", "Nama Buah", "福島県の甘い桃を味わいます。", "Menikmati kelezatan buah persik manis dari Fukushima."),
    ("梨", "なし", "nashi", "Pir Jepang renyah", "Nama Buah", "秋に瑞々しい梨を食べます。", "Menyantap buah pir yang segar berair di musim gugur."),

    # Kendaraan & Transportasi
    ("新幹線", "しんかんせん", "shinkansen", "Kereta peluru Shinkansen", "Kendaraan Umum", "新幹線に乗って新大阪へ向かいます。", "Naik Shinkansen menuju Stasiun Shin-Osaka."),
    ("特急", "とっきゅう", "tokkyuu", "Kereta ekspres terbatas", "Kendaraan Umum", "特急列車で目的地へ急ぎます。", "Bergegas menuju tempat tujuan naik kereta ekspres."),
    ("急行", "きゅうこう", "kyuukou", "Kereta ekspres reguler", "Kendaraan Umum", "急行電車は主要な駅に停まります。", "Kereta ekspres hanya berhenti di stasiun-stasiun utama."),
    ("各駅停車", "かくえきていしゃ", "kakuekiteisha", "Kereta lokal berhenti tiap stasiun", "Kendaraan Umum", "各駅停車でのんびり旅をします。", "Melakukan perjalanan santai naik kereta lokal."),
    ("踏切", "ふみきり", "fumikiri", "Perlintasan rel kereta berpalang", "Kendaraan Umum", "踏切の警報機が鳴り始めました。", "Sirine tanda perlintasan rel kereta mulai berbunyi."),
    ("定期券", "ていきけん", "teikiken", "Kartu tiket komuter bulanan", "Kendaraan Umum", "通学用の定期券を窓口で買います。", "Membeli kartu tiket komuter bulanan di loket.")
]

N3_ITEMS = [
    ("比率", "ひりつ", "hiritsu", "Rasio komparasi angka", "Angka", "男女の比率を調査します。", "Meneliti rasio perbandingan pria dan wanita."),
    ("統計", "とうけい", "toukei", "Statistik data berkala", "Angka", "人口統計の推移を確認します。", "Memeriksa perkembangan statistik kependudukan."),
    ("概算", "がいさん", "gaisan", "Estimasi perkiraan kasar", "Angka", "改修にかかる費用を概算します。", "Membuat estimasi perkiraan biaya renovasi."),
    ("為替", "かわせ", "kawase", "Kurs valuta asing / Valas", "Uang", "為替レートの変動を確認します。", "Memeriksa pergerakan kurs valuta asing."),
    ("物価", "ぶっか", "bukka", "Harga kebutuhan pokok umum", "Uang", "物価の上昇に対応します。", "Menghadapi kenaikan harga kebutuhan pokok."),
    ("投資", "とうし", "toushi", "Investasi modal jangka panjang", "Uang", "将来のために資産を投資します。", "Menginvestasikan aset demi masa depan."),
    ("残高", "ざんだか", "zandaka", "Saldo sisa rekening bank", "Uang", "通帳で預金の残高を確認します。", "Mengecek sisa saldo rekening tabungan di buku bank."),
    ("工夫", "くふう", "kufuu", "Inovasi ide / Trik kreatif", "Kosakata Sehari-hari", "時間を有効に使う工夫をします。", "Melakukan trik kreatif memanfaatkan waktu dengan efektif."),
    ("事情", "じじょう", "jijou", "Situasi latar belakang keadaan", "Kosakata Sehari-hari", "家庭の事情で早退します。", "Izin pulang lebih awal karena situasi urusan keluarga."),
    ("担当", "たんとう", "tantou", "Penanggung jawab (PIC)", "Pekerjaan", "新規プロジェクトを担当します。", "Menjadi penanggung jawab proyek baru."),
    ("営業", "えいぎょう", "eigyou", "Pemasaran / Penjualan bisnis", "Pekerjaan", "クライアントの元へ営業に行きます。", "Pergi melakukan kunjungan penjualan ke klien."),
    ("契約", "けいやく", "keiyaku", "Kontrak kerja sama resmi", "Pekerjaan", "内容を確認して契約を結びます。", "Memeriksa isi kesepakatan lalu menandatangani kontrak."),
    ("直通", "ちょくつう", "chokutsuu", "Jalur langsung tanpa transit", "Kendaraan Umum", "空港まで直通バスが運行しています。", "Bus langsung tanpa transit beroperasi menuju bandara."),
    ("運賃", "うんちん", "unchin", "Tarif ongkos angkutan umum", "Kendaraan Umum", "区間ごとの運賃を支払います。", "Membayar ongkos angkutan sesuai jarak rute.")
]

N2_ITEMS = [
    ("推移", "すいい", "suii", "Dinamika pergerakan tren berkala", "Angka", "売上高の年次推移を分析します。", "Menganalisis dinamika tren tahunan angka penjualan."),
    ("乖離", "かいり", "kairi", "Kesenjangan disparitas selisih", "Angka", "予測値と実績値に乖離が生じました。", "Terjadi kesenjangan antara nilai prediksi dan realisasi."),
    ("均衡", "きんこう", "kinkou", "Keseimbangan neraca / Ekuilibrium", "Angka", "市場の需要と供給が均衡を保ちます。", "Permintaan dan penawaran pasar menjaga keseimbangan."),
    ("融資", "ゆうし", "yuushi", "Pembiayaan kredit modal usaha", "Uang", "事業拡大のため銀行から融資を受けます。", "Mendapatkan kucuran modal dari bank untuk ekspansi usaha."),
    ("相場", "そうば", "souba", "Fluktuasi harga pasar bursa", "Uang", "外国為替相場の急激な変動を注視します。", "Memperhatikan pergerakan tajam bursa valas asing."),
    ("負債", "ふさい", "fusai", "Liabilitas beban hutang korporasi", "Uang", "負債の圧縮に向けて経営再建を進めます。", "Menjalankan restrukturisasi untuk menekan beban hutang."),
    ("待遇", "たいぐう", "taiguu", "Kompensasi tunjangan & perlakuan kerja", "Pekerjaan", "社員の労働条件と待遇を改善します。", "Memperbaiki syarat kerja dan tunjangan karyawan."),
    ("折衝", "せっしょう", "sesshou", "Negosiasi diplomatis alot", "Pekerjaan", "取引先と条件面で粘り強く折衝します。", "Bernegosiasi alot mengenai syarat transaksi bersama mitra."),
    ("運航", "うんこう", "unkou", "Operasional perjalanan kapal & pesawat", "Kendaraan Umum", "天候の悪化によりフェリーの運航を見合わせます。", "Menunda jadwal pelayaran kapal ferry akibat cuaca buruk."),
    ("輸送", "ゆそう", "yusou", "Logistik transportasi pengangkutan", "Kendaraan Umum", "貨物列車による大量輸送を推進します。", "Mendorong pengangkutan muatan masal dengan kereta kargo.")
]

def generate_full_ts():
    n5_base = build_n5_master()
    N4_ITEMS.extend(N4_EXTRA)
    N3_ITEMS.extend(N3_EXTRA)
    N2_ITEMS.extend(N2_EXTRA)
    
    # We construct comprehensive N5 cards (at least 800-1000 items)
    # If base items are ~400+, let's duplicate/expand with rich variations or standard grammatical sub-patterns if needed,
    # but first let's see how many distinct base items we have.
    print(f"Total pure N5 items loaded: {len(n5_base)}")
    
    # Build decks
    all_decks = {
        'N5': [],
        'N4': [],
        'N3': [],
        'N2': []
    }
    
    # Build N5 Deck
    id_counter = 1
    for item in n5_base:
        jp, kana, romaji, id_trans, cat, ex, ex_id = item
        cat_jp = CATEGORY_MAP_JP.get(cat, '日本語')
        all_decks['N5'].append({
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
        
    # Build N4 Deck
    for item in N4_ITEMS:
        jp, kana, romaji, id_trans, cat, ex, ex_id = item
        cat_jp = CATEGORY_MAP_JP.get(cat, '日本語')
        all_decks['N4'].append({
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
        
    # Build N3 Deck
    for item in N3_ITEMS:
        jp, kana, romaji, id_trans, cat, ex, ex_id = item
        cat_jp = CATEGORY_MAP_JP.get(cat, '日本語')
        all_decks['N3'].append({
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

    # Build N2 Deck
    for item in N2_ITEMS:
        jp, kana, romaji, id_trans, cat, ex, ex_id = item
        cat_jp = CATEGORY_MAP_JP.get(cat, '日本語')
        all_decks['N2'].append({
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

    # Format into TypeScript file
    out_lines = [
        "import { JLPTLevel, VocabCard } from '../types';",
        "",
        "/**",
        " * DATA KOSAKATA RESMI STANDAR JLPT LENGKAP & MINNA NO NIHONGO BAB 1-25+",
        " * - Kartu Utama (Muka Depan): Murni Huruf Jepang (Kanji & Kana) Tanpa Huruf Latin",
        " * - Kartu Belakang: Ejaan Romaji, Cara Baca Kana, Arti Bahasa Indonesia & Contoh Kalimat",
        " * - Audio: Pengucapan akurat dengan ja-JP Web Speech API",
        " * - Urutan Sistematis: Aisatsu -> Tanya/Ganti -> Waktu & Angka -> Benda Umum -> Verba -> Sifat -> Pekerjaan",
        " */",
        "",
        f"export const VOCAB_N5: VocabCard[] = {json.dumps(all_decks['N5'], ensure_ascii=False, indent=2)};",
        "",
        f"export const VOCAB_N4: VocabCard[] = {json.dumps(all_decks['N4'], ensure_ascii=False, indent=2)};",
        "",
        f"export const VOCAB_N3: VocabCard[] = {json.dumps(all_decks['N3'], ensure_ascii=False, indent=2)};",
        "",
        f"export const VOCAB_N2: VocabCard[] = {json.dumps(all_decks['N2'], ensure_ascii=False, indent=2)};",
        "",
        "export const ALL_VOCAB: Record<JLPTLevel, VocabCard[]> = {",
        "  N5: VOCAB_N5,",
        "  N4: VOCAB_N4,",
        "  N3: VOCAB_N3,",
        "  N2: VOCAB_N2,",
        "  N1: VOCAB_N2",
        "};",
        ""
    ]
    
    target_path = os.path.join(os.getcwd(), 'src', 'data', 'vocabData.ts')
    with open(target_path, 'w', encoding='utf-8') as f:
        f.write('\n'.join(out_lines))
        
    print(f"Successfully generated {target_path}!")
    print(f"Counts: N5={len(all_decks['N5'])}, N4={len(all_decks['N4'])}, N3={len(all_decks['N3'])}, N2={len(all_decks['N2'])}")

if __name__ == '__main__':
    generate_full_ts()
