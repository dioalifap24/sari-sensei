# -*- coding: utf-8 -*-
import json
import os
import sys

# Import base modules
from build_3000_database import generate_dictionary_corpus, CATEGORY_MAP_JP, CATEGORY_ORDER, get_cat_rank

def generate_super_corpus():
    base_items = generate_dictionary_corpus()
    
    # We will expand with additional dictionary categories
    extra_items = []
    
    # 1. Complete Numbers: 1 to 100 explicit items
    kanji_digits = ["零", "一", "二", "三", "四", "五", "六", "七", "八", "九", "十"]
    kana_digits = ["ゼロ", "いち", "に", "さん", "よん", "ご", "ろく", "なな", "はち", "きゅう", "じゅう"]
    romaji_digits = ["zero", "ichi", "ni", "san", "yon", "go", "roku", "nana", "hachi", "kyuu", "juu"]
    indo_digits = ["Nol", "Satu", "Dua", "Tiga", "Empat", "Lima", "Enam", "Tujuh", "Delapan", "Sembilan", "Sepuluh"]
    
    for i in range(1, 101):
        if i <= 10:
            continue # already in base
        
        # Construct compound Japanese representation
        tens = i // 10
        ones = i % 10
        
        if tens == 1:
            jp_ten = "十"
            kn_ten = "じゅう"
            rm_ten = "juu"
        else:
            jp_ten = kanji_digits[tens] + "十"
            kn_ten = kana_digits[tens] + "じゅう"
            rm_ten = romaji_digits[tens] + "juu"
            
        if ones == 0:
            jp = jp_ten
            kn = kn_ten
            rm = rm_ten
            id_trans = f"Angka {i}"
        else:
            jp = jp_ten + kanji_digits[ones]
            kn = kn_ten + kana_digits[ones]
            rm = rm_ten + romaji_digits[ones]
            id_trans = f"Angka {i}"
            
        extra_items.append((
            jp,
            kn,
            rm,
            id_trans,
            "Penunjuk Waktu & Angka",
            f"番号は{jp}です。",
            f"Nomor urutnya adalah {i}."
        ))

    # 2. Complete Ratusan, Ribuan, Puluhan Ribu, Ratusan Ribu, Jutaan, Miliaran
    scales = [
        ("百", "ひゃく", "hyaku", "Angka Seratus (100)"),
        ("二百", "にひゃく", "nihyaku", "Angka Dua Ratus (200)"),
        ("三百", "さんびゃく", "sanbyaku", "Angka Tiga Ratus (300)"),
        ("四百", "よんひゃく", "yonhyaku", "Angka Empat Ratus (400)"),
        ("五百", "ごひゃく", "gohyaku", "Angka Lima Ratus (500)"),
        ("六百", "ろっぴゃく", "roppyaku", "Angka Enam Ratus (600)"),
        ("七百", "ななひゃく", "nanahyaku", "Angka Tujuh Ratus (700)"),
        ("八百", "はっぴゃく", "happyaku", "Angka Delapan Ratus (800)"),
        ("九百", "きゅうひゃく", "kyuuhyaku", "Angka Sembilan Ratus (900)"),
        ("千", "せん", "sen", "Angka Seribu (1.000)"),
        ("二千", "にせん", "nisen", "Angka Dua Ribu (2.000)"),
        ("三千", "さんぜん", "sanzen", "Angka Tiga Ribu (3.000)"),
        ("四千", "よんせん", "yonsen", "Angka Empat Ribu (4.000)"),
        ("五千", "ごせん", "gosen", "Angka Lima Ribu (5.000)"),
        ("六千", "ろくせん", "rokusen", "Angka Enam Ribu (6.000)"),
        ("七千", "ななせん", "nanasen", "Angka Tujuh Ribu (7.000)"),
        ("八千", "はっせん", "hassen", "Angka Delapan Ribu (8.000)"),
        ("九千", "きゅうせん", "kyuusen", "Angka Sembilan Ribu (9.000)"),
        ("一万", "いちまん", "ichiman", "Angka Sepuluh Ribu (10.000)"),
        ("二万", "にまん", "niman", "Angka Dua Puluh Ribu (20.000)"),
        ("三万", "さんまん", "sanman", "Angka Tiga Puluh Ribu (30.000)"),
        ("四万", "よんまん", "yonman", "Angka Empat Puluh Ribu (40.000)"),
        ("五万", "ごまん", "goman", "Angka Lima Puluh Ribu (50.000)"),
        ("六万", "ろくまん", "rokuman", "Angka Enam Puluh Ribu (60.000)"),
        ("七万", "ななまん", "nanaman", "Angka Tujuh Puluh Ribu (70.000)"),
        ("八万", "はちまん", "hachiman", "Angka Delapan Puluh Ribu (80.000)"),
        ("九万", "きゅうまん", "kyuuman", "Angka Sembilan Puluh Ribu (90.000)"),
        ("十万", "じゅうまん", "juuman", "Angka Seratus Ribu (100.000)"),
        ("二十万", "にじゅうまん", "nijuuman", "Angka Dua Ratus Ribu (200.000)"),
        ("五十万", "ごじゅうまん", "gojuuman", "Angka Lima Ratus Ribu (500.000)"),
        ("百万", "ひゃくまん", "hyakuman", "Angka Satu Juta (1.000.000)"),
        ("二百万", "にひゃくまん", "nihyakuman", "Angka Dua Juta (2.000.000)"),
        ("五百万", "ごひゃくまん", "gohyakuman", "Angka Lima Juta (5.000.000)"),
        ("一千万", "いっせんまん", "issenman", "Angka Sepuluh Juta (10.000.000)"),
        ("五千万", "ごせんまん", "gosenman", "Angka Lima Puluh Juta (50.000.000)"),
        ("一億", "いちおく", "ichioku", "Angka Seratus Juta (100.000.000)"),
        ("十億", "じゅうおく", "juuoku", "Angka Satu Miliar (1.000.000.000)"),
        ("百億", "ひゃくおく", "hyakuoku", "Angka Sepuluh Miliar (10.000.000.000)"),
        ("千億", "せんおく", "sen'oku", "Angka Seratus Miliar (100.000.000.000)"),
        ("一兆", "いっちょう", "icchou", "Angka Satu Triliun (1.000.000.000.000)"),
        ("十兆", "じゅっちょう", "jucchou", "Angka Sepuluh Triliun (10.000.000.000.000)")
    ]
    for sc in scales:
        jp, kn, rm, id_t = sc
        extra_items.append((jp, kn, rm, id_t, "Penunjuk Waktu & Angka", f"金額は{jp}円です。", f"Jumlah nominalnya adalah {jp} yen."))

    # 3. Rich Dictionary Vocabulary Expansions across all Categories
    # We will generate comprehensive high-frequency dictionary entries
    DICT_MEGA_EXTENSIONS = [
        # Buah & Makanan
        ("カカオ", "かかお", "kakao", "Biji Kakao / Cokelat murni", "Kata Benda - Buah & Makanan", "上質なカカオからチョコレートを作ります。", "Membuat cokelat dari biji kakao bermutu tinggi."),
        ("カシューの実", "かしゅーのみ", "kashuu no mi", "Buah Mede / Jambu Monyet", "Kata Benda - Buah & Makanan", "熱帯でカシューの実を収穫します。", "Memanen buah jambu monyet mede di daerah tropis."),
        ("グーズベリー", "ぐーずべりー", "guuzuberii", "Buah Gooseberry asam segar", "Kata Benda - Buah & Makanan", "甘酸っぱいグーズベリーのタルトです。", "Kue tart buah gooseberry yang manis asam segar."),
        ("ドライフルーツ", "どらいふるーつ", "doraifuruutsu", "Aneka Buah Kering (Dried Fruits)", "Kata Benda - Buah & Makanan", "栄養価の高いドライフルーツをおやつにします。", "Makan buah kering bernutrisi tinggi untuk camilan."),
        ("フルーツポンチ", "ふるーつぽんち", "furuutsuponchi", "Es Koktail Buah Campur (Fruit Punch)", "Kata Benda - Buah & Makanan", "パーティーでフルーツポンチを振る舞います。", "Menyajikan es buah koktail saat pesta."),
        ("シャーベット", "しゃーべっと", "shaabetto", "Es Serut Buah (Sherbet / Sorbet)", "Kata Benda - Buah & Makanan", "レモンシャーベットで口をさっぱりさせます。", "Menyegarkan mulut dengan es serut sorbet lemon."),
        ("コンポート", "こんぽーと", "konpooto", "Kompot buah rebusan sirup manis", "Kata Benda - Buah & Makanan", "リンゴのコンポートを作ります。", "Membuat hidangan kompot apel rebus sirup."),
        ("ジャム", "じゃむ", "jamu", "Selai buah manis (Jam)", "Kata Benda - Buah & Makanan", "トーストにイチゴジャムを塗ります。", "Mengoleskan selai stroberi pada roti bakar."),
        ("マーマレード", "まーまれーど", "maamareedo", "Selai jeruk berbulir kulit (Marmalade)", "Kata Benda - Buah & Makanan", "ほろ苦いマーマレードが好きです。", "Suka selai marmalade jeruk yang legit beraroma."),
        ("果汁", "かじゅう", "kajuu", "Sari buah / Air perasan buah murni", "Kata Benda - Buah & Makanan", "果汁百パーセントのオレンジジュースです。", "Jus jeruk dengan sari buah murni seratus persen."),

        # Transportasi
        ("特急列車", "とっきゅうれっしゃ", "tokkyuu ressha", "Rangkaian kereta ekspres terbatas", "Kata Benda - Kendaraan & Transportasi", "快適な特急列車で信州へ向かいます。", "Menuju Shinshu naik kereta ekspres yang nyaman."),
        ("寝台特急", "しんだいとっきゅう", "shindai tokkyuu", "Kereta malam berfasilitas tempat tidur", "Kata Benda - Kendaraan & Transportasi", "憧れの寝台特急サンライズ出雲に乗ります。", "Menaiki kereta malam bertempat tidur Sunrise Izumo impian."),
        ("観光列車", "かんこうれっしゃ", "kankou ressha", "Kereta wisata bertema khusus (Scenic Train)", "Kata Benda - Kendaraan & Transportasi", "車窓の美しい観光列車に乗車します。", "Menaiki kereta wisata dengan panorama jendela yang indah."),
        ("トロッコ列車", "とろっこれっしゃ", "torokko ressha", "Kereta lori terbuka lembah wisata (Torokko)", "Kata Benda - Kendaraan & Transportasi", "渓谷沿いを走るトロッコ列車です。", "Kereta lori terbuka yang melintasi sepanjang lembah sungai."),
        ("自動運転バス", "じどううんてんばす", "jidou unten basu", "Bus swakemudi tanpa sopir otomatis", "Kata Benda - Kendaraan & Transportasi", "最新の自動運転バスの実証実験が行われます。", "Uji coba bus otomatis tanpa sopir sedang dilaksanakan."),
        ("ハイブリッドカー", "はいぶりっどかー", "haiburiddokaa", "Mobil bermesin hibrida hemat bahan bakar", "Kata Benda - Kendaraan & Transportasi", "環境に優しいハイブリッドカーを購入します。", "Membeli mobil hybrid ramah lingkungan."),
        ("電気自動車", "でんきじどうしゃ", "denki jidousha", "Mobil listrik baterai (EV)", "Kata Benda - Kendaraan & Transportasi", "充電スタンドで電気自動車を充電します。", "Mengisi daya mobil listrik di stasiun pengisian baterai."),
        ("燃料電池車", "ねんりょうでんちしゃ", "nenryou denchisha", "Mobil berbahan bakar hidrogen (FCV)", "Kata Benda - Kendaraan & Transportasi", "水素で走る燃料電池車です。", "Mobil canggih bertenaga sel hidrogen."),

        # Fasilitas Tempat & Bangunan
        ("総合病院", "そうごうびょういん", "sougou byouin", "Rumah sakit umum pusat (General Hospital)", "Kata Benda - Tempat & Fasilitas", "設備の整った総合病院で精密検査を受けます。", "Menjalani pemeriksaan menyeluruh di rumah sakit umum pusat."),
        ("大学病院", "だいがくびょういん", "daigaku byouin", "Rumah sakit pendidikan universitas", "Kata Benda - Tempat & Fasilitas", "大学病院の専門医に診察してもらいます。", "Diperiksa oleh dokter spesialis di rumah sakit universitas."),
        ("老人ホーム", "ろうじんほーむ", "roujin hoomu", "Panti wreda / Griya lansia", "Kata Benda - Tempat & Fasilitas", "バリアフリーの老人ホームを見学します。", "Mengunjungi panti wreda yang ramah lansia."),
        ("児童館", "じどうかん", "jidoukan", "Pusat rekreasi dan bermain anak (Children Hall)", "Kata Benda - Tempat & Fasilitas", "放課後に児童館で遊具で遊びます。", "Bermain dengan mainan di balai anak seusai jam sekolah."),
        ("保育園", "ほいくえん", "hoikuen", "Tempat penitipan anak balita (Daycare)", "Kata Benda - Tempat & Fasilitas", "朝八時に保育園へ子供を預けます。", "Menitipkan anak di tempat penitipan balita pada jam 8 pagi."),
        ("幼稚園", "ようちえん", "youchien", "Taman Kanak-Kanak (TK / Kindergarten)", "Kata Benda - Tempat & Fasilitas", "幼稚園の入園式に参加します。", "Menghadiri upacara penerimaan murid baru di TK."),
        ("専門学校", "せんもんがっこう", "senmon gakkou", "Sekolah tinggi vokasi kejuruan", "Kata Benda - Tempat & Fasilitas", "デザインの専門学校でスキルを磨きます。", "Mengasah keahlian di sekolah tinggi vokasi desain."),
        ("大学院", "だいがくいん", "daigakuin", "Program pascasarjana magister / doktoral", "Kata Benda - Tempat & Fasilitas", "大学院で修士論文を執筆します。", "Menulis tesis magister di program pascasarjana."),
        ("研究所", "けんきゅうじょ", "kenkyuujo", "Lembaga laboratorium riset sains", "Kata Benda - Tempat & Fasilitas", "先端技術を開発する研究所です。", "Laboratorium riset yang mengembangkan teknologi mutakhir."),

        # Dunia Kerja & Bisnis
        ("求人票", "きゅうじんひょう", "kyuujinhyou", "Lembar informasi lowongan kerja resmi", "Kosakata Pekerjaan & Sehari-hari", "求人票の応募条件を詳しく確認します。", "Memeriksa syarat lamaran di lembar lowongan kerja."),
        ("志望動機", "しぼうどうき", "shibou douki", "Alasan motivasi melamar pekerjaan", "Kosakata Pekerjaan & Sehari-hari", "面接で説得力のある志望動機を話します。", "Menyampaikan motivasi melamar kerja yang meyakinkan saat wawancara."),
        ("自己PR", "じこぴーあーる", "jiko piiaaru", "Promosi keunggulan diri sendiri", "Kosakata Pekerjaan & Sehari-hari", "エントリーシートに自己PRを書きます。", "Menuliskan keunggulan diri pada formulir aplikasi pendaftaran."),
        ("適性検査", "てきせいけんさ", "tekisei kensa", "Tes uji bakat & psikotes seleksi kerja", "Kosakata Pekerjaan & Sehari-hari", "Webで適性検査を受検します。", "Mengerjakan tes psikotes bakat secara daring."),
        ("内定", "ないてい", "naitei", "Pemberitahuan resmi diterima bekerja (Job Offer)", "Kosakata Pekerjaan & Sehari-hari", "第一志望の会社から内定をいただきました。", "Menerima tawaran resmi diterima kerja dari perusahaan impian."),
        ("入社式", "にゅうしゃしき", "nyuushashiki", "Upacara penyambutan karyawan baru", "Kosakata Pekerjaan & Sehari-hari", "四月一日の入社式に出席します。", "Menghadiri upacara penyambutan karyawan baru pada tanggal 1 April."),
        ("試用期間", "しようきかん", "shiyou kikan", "Masa percobaan kerja (Probation)", "Kosakata Pekerjaan & Sehari-hari", "三か月の試用期間を経て本採用となります。", "Diangkat resmi sebagai karyawan setelah 3 bulan masa percobaan."),
        ("基本給", "きほんきゅう", "kihonkyuu", "Gaji pokok dasar", "Kosakata Pekerjaan & Sehari-hari", "基本給に各種手当が加算されます。", "Gaji pokok ditambah dengan berbagai aneka tunjangan."),
        ("役職手当", "やくしょくてあて", "yakushoku teate", "Tunjangan jabatan struktural", "Kosakata Pekerjaan & Sehari-hari", "課長に昇進して役職手当がつきます。", "Mendapatkan tunjangan jabatan setelah promosi jadi kepala seksi."),
        ("住宅手当", "じゅうたくてあて", "juutaku teate", "Tunjangan bantuan tempat tinggal / sewa rumah", "Kosakata Pekerjaan & Sehari-hari", "会社から毎月住宅手当が支給されます。", "Perusahaan memberikan tunjangan sewa rumah setiap bulan."),
        ("通勤手当", "つうきんてあて", "tsuukin teate", "Tunjangan penggantian ongkos transportasi kerja", "Kosakata Pekerjaan & Sehari-hari", "全額通勤手当が実費支給されます。", "Tunjangan transportasi kerja diganti penuh sesuai pengeluaran nyata."),
        ("有給休暇", "ゆうきゅうきゅうか", "yuukyuu kyuuka", "Hak cuti tahunan berbayar (Annual Leave)", "Kosakata Pekerjaan & Sehari-hari", "有給休暇を取得してリフレッシュします。", "Mengambil hak cuti tahunan untuk menyegarkan pikiran."),
        ("産休", "さんきゅう", "sankyuu", "Cuti melahirkan (Maternity Leave)", "Kosakata Pekerjaan & Sehari-hari", "出産に向けて産休に入ります。", "Mengambil cuti melahirkan menjelang proses persalinan."),
        ("育休", "いくきゅう", "ikukyuu", "Cuti mengasuh dan merawat anak (Childcare Leave)", "Kosakata Pekerjaan & Sehari-hari", "夫婦で育休を取得して子育てをします。", "Suami istri mengambil cuti pengasuhan anak bersama.")
    ]
    extra_items.extend(DICT_MEGA_EXTENSIONS)
    
    # Merge everything
    all_combined = base_items + extra_items
    
    # Deduplicate strictly
    master_seen = set()
    cleaned = []
    for item in all_combined:
        jp, kn, rm, id_t, cat, ex, ex_id = item
        key = jp.strip()
        if key not in master_seen:
            master_seen.add(key)
            cleaned.append(item)
            
    # Sort systematically by Category Rank
    cleaned.sort(key=lambda x: get_cat_rank(x[4]))
    return cleaned

def compile_mega_database():
    items = generate_super_corpus()
    
    # Build complete card objects
    deck_all = []
    id_counter = 1
    for item in items:
        jp, kana, romaji, id_trans, cat, ex, ex_id = item
        cat_jp = CATEGORY_MAP_JP.get(cat, '日本語')
        deck_all.append({
            'id': id_counter,
            'level': 'N5', # Universal compatibility
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
        
    print(f"Total deduplicated Dictionary entries: {len(deck_all)}")
    
    out_lines = [
        "import { JLPTLevel, VocabCard } from '../types';",
        "",
        "/**",
        " * DATA KOSAKATA LENGKAP KAMUS BAHASA JEPANG MAZII DICTIONARY & MINNA NO NIHONGO",
        " * - Basis Data Komprehensif Ribuan Kosakata Kamus Tanpa Sekat Level",
        " * - Sisi Depan Kartu: Menggunakan Huruf Kana (Hiragana/Katakana murni) untuk kemudahan membaca",
        " * - Sisi Belakang Kartu: Memuat Penulisan Kanji Asli, Cara Baca Kana, Ejaan Romaji, Arti Indonesia & Contoh Kalimat",
        " * - Terurut Sistematis berdasarkan 14 Kategori Tematik Standar",
        " * - Audio: Pengucapan akurat dengan ja-JP Web Speech API",
        " * - Bebas Duplikasi (Zero Duplicates)",
        " */",
        "",
        f"export const VOCAB_MAZII_DICTIONARY: VocabCard[] = {json.dumps(deck_all, ensure_ascii=False, indent=2)};",
        "",
        "export const VOCAB_ALL_LEVELS: VocabCard[] = VOCAB_MAZII_DICTIONARY;",
        "export const VOCAB_N5: VocabCard[] = VOCAB_MAZII_DICTIONARY;",
        "export const VOCAB_N4: VocabCard[] = VOCAB_MAZII_DICTIONARY;",
        "export const VOCAB_N3: VocabCard[] = VOCAB_MAZII_DICTIONARY;",
        "export const VOCAB_N2: VocabCard[] = VOCAB_MAZII_DICTIONARY;",
        "",
        "export const ALL_VOCAB: Record<JLPTLevel, VocabCard[]> = {",
        "  N5: VOCAB_MAZII_DICTIONARY,",
        "  N4: VOCAB_MAZII_DICTIONARY,",
        "  N3: VOCAB_MAZII_DICTIONARY,",
        "  N2: VOCAB_MAZII_DICTIONARY",
        "};",
        ""
    ]
    
    target_path = os.path.join(os.getcwd(), 'src', 'data', 'vocabData.ts')
    with open(target_path, 'w', encoding='utf-8') as f:
        f.write('\n'.join(out_lines))
        
    print(f"Successfully generated {target_path} with {len(deck_all)} dictionary cards!")

if __name__ == '__main__':
    compile_mega_database()
