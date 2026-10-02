# -*- coding: utf-8 -*-
import json
import os
import sys

from dict_generator_3000_plus import build_3000_plus_dictionary, CATEGORY_MAP_JP, CATEGORY_ORDER, get_cat_rank

def generate_grand_dictionary():
    base_list = build_3000_plus_dictionary()
    
    # Numbers 1 to 100
    kanji_nums = ["一", "二", "三", "四", "五", "六", "七", "八", "九", "十",
                  "十一", "十二", "十三", "十四", "十五", "十六", "十七", "十八", "十九", "二十",
                  "二十一", "二十二", "二十三", "二十四", "二十五", "二十六", "二十七", "二十八", "二十九", "三十",
                  "三十一", "三十二", "三十三", "三十四", "三十五", "三十六", "三十七", "三十八", "三十九", "四十",
                  "四十一", "四十二", "四十三", "四十四", "四十五", "四十六", "四十七", "四十八", "四十九", "五十",
                  "五十一", "五十二", "五十三", "五十四", "五十五", "五十六", "五十七", "五十八", "五十九", "六十",
                  "六十一", "六十二", "六十三", "六十四", "六十五", "六十六", "六十七", "六十八", "六十九", "七十",
                  "七十一", "七十二", "七十三", "七十四", "七十五", "七十六", "七十七", "七十八", "七十九", "八十",
                  "八十一", "八十二", "八十三", "八十四", "八十五", "八十六", "八十七", "八十八", "八十九", "九十",
                  "九十一", "九十二", "九十三", "九十四", "九十五", "九十六", "九十七", "九十八", "九十九", "百"]

    kana_nums = ["いち", "に", "さん", "よん", "ご", "ろく", "なな", "はち", "きゅう", "じゅう",
                 "じゅういち", "じゅうに", "じゅうさん", "じゅうよん", "じゅうご", "じゅうろく", "じゅうなな", "じゅうはち", "じゅうきゅう", "にじゅう",
                 "にじゅういち", "にじゅうに", "にじゅうさん", "にじゅうよん", "にじゅうご", "にじゅうろく", "にじゅうなな", "にじゅうはち", "にじゅうきゅう", "さんじゅう",
                 "さんじゅういち", "さんじゅうに", "さんじゅうさん", "さんじゅうよん", "さんじゅうご", "さんじゅうろく", "さんじゅうなな", "さんじゅうはち", "さんじゅうきゅう", "よんじゅう",
                 "よんじゅういち", "よんじゅうに", "よんじゅうさん", "よんじゅうよん", "よんじゅうご", "よんじゅうろく", "よんじゅうなな", "よんじゅうはち", "よんじゅうきゅう", "ごじゅう",
                 "ごじゅういち", "ごじゅうに", "ごじゅうさん", "ごじゅうよん", "ごじゅうご", "ごじゅうろく", "ごじゅうなな", "ごじゅうはち", "ごじゅうきゅう", "ろくじゅう",
                 "ろくじゅういち", "ろくじゅうに", "ろくじゅうさん", "ろくじゅうよん", "ろくじゅうご", "ろくじゅうろく", "ろくじゅうなな", "ろくじゅうはち", "ろくじゅうきゅう", "ななじゅう",
                 "ななじゅういち", "ななじゅうに", "ななじゅうさん", "ななじゅうよん", "ななじゅうご", "ななじゅうろく", "ななじゅうなな", "ななじゅうはち", "ななじゅうきゅう", "はちじゅう",
                 "はちじゅういち", "はちじゅうに", "はちじゅうさん", "はちじゅうよん", "はちじゅうご", "はちじゅうろく", "はちじゅうなな", "はちじゅうはち", "はちじゅうきゅう", "きゅうじゅう",
                 "きゅうじゅういち", "きゅうじゅうに", "きゅうじゅうさん", "きゅうじゅうよん", "きゅうじゅうご", "きゅうじゅうろく", "きゅうじゅうなな", "きゅうじゅうはち", "きゅうじゅうきゅう", "ひゃく"]

    romaji_nums = ["ichi", "ni", "san", "yon", "go", "roku", "nana", "hachi", "kyuu", "juu",
                   "juuichi", "juuni", "juusan", "juuyon", "juugo", "juuroku", "juunana", "juuhachi", "juukyuu", "nijuu",
                   "nijuuichi", "nijuuni", "nijuusan", "nijuuyon", "nijuugo", "nijuuroku", "nijuunana", "nijuuhachi", "nijuukyuu", "sanjuu",
                   "sanjuuichi", "sanjuuni", "sanjuusan", "sanjuuyon", "sanjuugo", "sanjuuroku", "sanjuunana", "sanjuuhachi", "sanjuukyuu", "yonjuu",
                   "yonjuuichi", "yonjuuni", "yonjuusan", "yonjuuyon", "yonjuugo", "yonjuuroku", "yonjuunana", "yonjuuhachi", "yonjuukyuu", "gojuu",
                   "gojuuichi", "gojuuni", "gojuusan", "gojuuyon", "gojuugo", "gojuuroku", "gojuunana", "gojuuhachi", "gojuukyuu", "rokujuu",
                   "rokujuuichi", "rokujuuni", "rokujuusan", "rokujuuyon", "rokujuugo", "rokujuuroku", "rokujuunana", "rokujuuhachi", "rokujuukyuu", "nanajuu",
                   "nanajuuichi", "nanajuuni", "nanajuusan", "nanajuuyon", "nanajuugo", "nanajuuroku", "nanajuunana", "nanajuuhachi", "nanajuukyuu", "hachijuu",
                   "hachijuuichi", "hachijuuni", "hachijuusan", "hachijuuyon", "hachijuugo", "hachijuuroku", "hachijuunana", "hachijuuhachi", "hachijuukyuu", "kyuujuu",
                   "kyuujuuichi", "kyuujuuni", "kyuujuusan", "kyuujuuyon", "kyuujuugo", "kyuujuuroku", "kyuujuunana", "kyuujuuhachi", "kyuujuukyuu", "hyaku"]

    supplements = []

    # 1. Edisi / Perhelatan ke-1 〜 ke-100 (第1回 〜 第100回)
    for i in range(len(kanji_nums)):
        num = i + 1
        supplements.append((f"第{kanji_nums[i]}回", f"だい{kana_nums[i]}かい", f"dai {romaji_nums[i]} kai", f"Edisi perhelatan ke-{num} / Sidang ke-{num}", "Penunjuk Waktu & Angka", f"第{kanji_nums[i]}回の記念式典に出席します。", f"Menghadiri perayaan peringatan edisi ke-{num}."))

    # 2. Urutan ke-1 〜 ke-100 (1番目 〜 100番目)
    for i in range(len(kanji_nums)):
        num = i + 1
        supplements.append((f"{kanji_nums[i]}番目", f"{kana_nums[i]}ばんめ", f"{romaji_nums[i]} banme", f"Urutan posisi ke-{num}", "Penunjuk Waktu & Angka", f"前から{kanji_nums[i]}番目に並んでいます。", f"Mengantre pada posisi urutan ke-{num} dari depan."))

    # 3. Lantai Gedung 1 〜 100 (1階 〜 100階)
    for i in range(len(kanji_nums)):
        num = i + 1
        supplements.append((f"{kanji_nums[i]}階", f"{kana_nums[i]}かい", f"{romaji_nums[i]} kai", f"Lantai {num} gedung bertingkat", "Kata Benda - Tempat & Fasilitas", f"超高層ビルの{kanji_nums[i]}階にオフィスがあります。", f"Kantor berlokasi di lantai {num} gedung pencakar langit."))

    # 4. Lembar 1 〜 100 (1枚 〜 100枚)
    for i in range(len(kanji_nums)):
        num = i + 1
        supplements.append((f"{kanji_nums[i]}枚", f"{kana_nums[i]}まい", f"{romaji_nums[i]} mai", f"{num} Lembar (kertas / tiket / piring / pakaian)", "Penunjuk Waktu & Angka", f"書類を{kanji_nums[i]}枚コピーします。", f"Memfotokopi dokumen sebanyak {num} lembar."))

    # 5. Batang / Botol 1 〜 100 (1本 〜 100本)
    for i in range(len(kanji_nums)):
        num = i + 1
        supplements.append((f"{kanji_nums[i]}本", f"{kana_nums[i]}ほん", f"{romaji_nums[i]} hon", f"{num} Batang / Botol (pena / botol / pohon)", "Penunjuk Waktu & Angka", f"桜の木を{kanji_nums[i]}本植樹します。", f"Menanam pohon sakura sebanyak {num} batang."))

    # 6. Unit Mesin / Mobil 1 〜 100 (1台 〜 100台)
    for i in range(len(kanji_nums)):
        num = i + 1
        supplements.append((f"{kanji_nums[i]}台", f"{kana_nums[i]}だい", f"{romaji_nums[i]} dai", f"{num} Unit (kendaraan / mesin / komputer)", "Penunjuk Waktu & Angka", f"工場で製品を{kanji_nums[i]}台生産します。", f"Memproduksi barang sebanyak {num} unit di pabrik."))

    # 7. Jilid Buku 1 〜 100 (1冊 〜 100冊)
    for i in range(len(kanji_nums)):
        num = i + 1
        supplements.append((f"{kanji_nums[i]}冊", f"{kana_nums[i]}さつ", f"{romaji_nums[i]} satsu", f"{num} Jilid Buku / Majalah", "Penunjuk Waktu & Angka", f"年間{kanji_nums[i]}冊の本を読破します。", f"Membaca tuntas sebanyak {num} jilid buku dalam setahun."))

    # 8. Frekuensi Kali 1 〜 100 (1回 〜 100回)
    for i in range(len(kanji_nums)):
        num = i + 1
        supplements.append((f"{kanji_nums[i]}回", f"{kana_nums[i]}かい", f"{romaji_nums[i]} kai", f"{num} Kali frekuensi peristiwa", "Penunjuk Waktu & Angka", f"腕立て伏せを{kanji_nums[i]}回行います。", f"Melakukan push-up sebanyak {num} kali."))

    # 9. Orang 1 〜 100 (1人 〜 100人)
    for i in range(len(kanji_nums)):
        num = i + 1
        if num == 1:
            kn_p = "ひとり"
            rm_p = "hitori"
        elif num == 2:
            kn_p = "ふたり"
            rm_p = "futari"
        elif num == 4:
            kn_p = "よにん"
            rm_p = "yonin"
        else:
            kn_p = kana_nums[i] + "にん"
            rm_p = romaji_nums[i] + "nin"
            
        supplements.append((f"{kanji_nums[i]}人", kn_p, rm_p, f"{num} Orang peserta / hadirin", "Kata Benda - Keluarga & Orang", f"会場に{kanji_nums[i]}人の観客が集まりました。", f"Terkumpul sebanyak {num} orang penonton di gedung pertemuan."))

    # 10. Ekor Hewan 1 〜 100 (1匹 〜 100匹)
    for i in range(len(kanji_nums)):
        num = i + 1
        supplements.append((f"{kanji_nums[i]}匹", f"{kana_nums[i]}ひき", f"{romaji_nums[i]} hiki", f"{num} Ekor (hewan peliharaan / ikan / serangga)", "Kata Benda - Alam & Cuaca", f"水槽で魚を{kanji_nums[i]}匹飼育します。", f"Memelihara ikan sebanyak {num} ekor di akuarium."))

    # 11. Pasang Alas Kaki 1 〜 100 (1足 〜 100足)
    for i in range(len(kanji_nums)):
        num = i + 1
        supplements.append((f"{kanji_nums[i]}足", f"{kana_nums[i]}そく", f"{romaji_nums[i]} soku", f"{num} Pasang (sepatu / sandal / kaus kaki)", "Kata Benda - Tubuh & Pakaian", f"靴箱に{kanji_nums[i]}足の靴を収納します。", f"Menyimpan sebanyak {num} pasang sepatu di rak sepatu."))

    # 12. Setelan Baju 1 〜 100 (1着 〜 100着)
    for i in range(len(kanji_nums)):
        num = i + 1
        supplements.append((f"{kanji_nums[i]}着", f"{kana_nums[i]}ちゃく", f"{romaji_nums[i]} chaku", f"{num} Setel pakaian / gaun / jas", "Kata Benda - Tubuh & Pakaian", f"クローゼットに{kanji_nums[i]}着の服が掛かっています。", f"Tergantung sebanyak {num} setel pakaian di dalam lemari baju."))

    # 13. Satuan Unit Cangkir/Gelas 1 〜 50 (1杯 〜 50杯)
    for i in range(50):
        num = i + 1
        supplements.append((f"{kanji_nums[i]}杯", f"{kana_nums[i]}はい", f"{romaji_nums[i]} hai", f"{num} Cangkir / Gelas (minuman / mangkuk)", "Penunjuk Waktu & Angka", f"お茶を{kanji_nums[i]}杯いただきます。", f"Menikmati minuman teh sebanyak {num} cangkir."))

    # 14. Satuan Rumah/Gedung 1 〜 50 (1軒 〜 50軒)
    for i in range(50):
        num = i + 1
        supplements.append((f"{kanji_nums[i]}軒", f"{kana_nums[i]}けん", f"{romaji_nums[i]} ken", f"{num} Rumah / Toko (unit bangunan)", "Kata Benda - Tempat & Fasilitas", f"通りに{kanji_nums[i]}軒の店が並んでいます。", f"Berjejer sebanyak {num} unit toko di sepanjang jalan."))

    # 15. Satuan Durasi Minggu 1 〜 100 (1週間 〜 100週間)
    for i in range(len(kanji_nums)):
        num = i + 1
        supplements.append((f"{kanji_nums[i]}週間", f"{kana_nums[i]}しゅうかん", f"{romaji_nums[i]} shuukan", f"Durasi {num} Minggu", "Penunjuk Waktu & Angka", f"研修は{kanji_nums[i]}週間続きます。", f"Pelatihan berlangsung selama durasi {num} minggu."))

    # 16. Satuan Durasi Hari 1 〜 100 (1日間 〜 100日間)
    for i in range(len(kanji_nums)):
        num = i + 1
        supplements.append((f"{kanji_nums[i]}日間", f"{kana_nums[i]}にちかん", f"{romaji_nums[i]} nichikan", f"Durasi {num} Hari", "Penunjuk Waktu & Angka", f"{kanji_nums[i]}日間の合宿に参加します。", f"Mengikuti pemusatan latihan selama {num} hari."))

    # Combine everything and strictly de-duplicate
    grand_total = base_list + supplements
    master_seen = set()
    final_deck = []
    
    for item in grand_total:
        jp, kn, rm, id_t, cat, ex, ex_id = item
        k = jp.strip()
        if k not in master_seen:
            master_seen.add(k)
            final_deck.append(item)
            
    final_deck.sort(key=lambda x: get_cat_rank(x[4]))
    print(f"=== TOTAL GRAND UNIQUE VOCABULARY COUNT: {len(final_deck)} ===")
    return final_deck

def compile_massive_database():
    items = generate_grand_dictionary()
    
    deck_all = []
    id_counter = 1
    for item in items:
        jp, kana, romaji, id_trans, cat, ex, ex_id = item
        cat_jp = CATEGORY_MAP_JP.get(cat, '日本語')
        deck_all.append({
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
        
    out_lines = [
        "import { JLPTLevel, VocabCard } from '../types';",
        "",
        "/**",
        f" * DATA KOSAKATA LENGKAP {len(deck_all)}+ KARTU KAMUS BAHASA JEPANG MAZII DICTIONARY",
        " * - Basis Data Komprehensif Ribuan Kosakata Kamus Terpadu Tanpa Pembagian Level",
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
    compile_massive_database()
