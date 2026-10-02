# -*- coding: utf-8 -*-
import json
import os
import sys

# Import all sub-datasets
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
from n4_n3_n2_data import N4_EXTRA, N3_EXTRA, N2_EXTRA
from build_unified_database import N4_RAW, N3_RAW, N2_RAW
from mazii_dictionary_expansion import (
    MAZII_EXPANSION_AISATSU,
    MAZII_EXPANSION_QUESTIONS_PRONOUNS,
    MAZII_EXPANSION_TIME_NUMBERS_MONEY,
    MAZII_EXPANSION_FOOD,
    MAZII_EXPANSION_TRANSPORT_PLACES,
    MAZII_EXPANSION_VERBS,
    MAZII_EXPANSION_ADJECTIVES
)
from mazii_dictionary_mega import MEGA_MAZII_ITEMS
from dict_numbers_time_seasons import DICT_NUMBERS_TIME_SEASONS
from dict_fruits_food import DICT_FRUITS_FOOD
from dict_transport import DICT_TRANSPORT
from dict_places_facilities import DICT_PLACES_FACILITIES
from dict_workplace_business import DICT_WORKPLACE_BUSINESS
from dict_daily_life import DICT_DAILY_LIFE
from dict_nature_environment import DICT_NATURE_ENVIRONMENT

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

CATEGORY_ORDER = [
    'Salam & Ungkapan (Aisatsu)',
    'Kata Tanya & Kata Ganti',
    'Penunjuk Waktu & Angka',
    'Kata Benda - Buah & Makanan',
    'Kata Benda - Kendaraan & Transportasi',
    'Kata Benda - Tempat & Fasilitas',
    'Kata Benda - Keluarga & Orang',
    'Kata Benda - Rumah & Barang',
    'Kata Benda - Sekolah & Kantor',
    'Kata Benda - Tubuh & Pakaian',
    'Kata Benda - Alam & Cuaca',
    'Kata Kerja Dasar',
    'Kata Sifat',
    'Kosakata Pekerjaan & Sehari-hari'
]

def get_cat_rank(cat):
    if cat in CATEGORY_ORDER:
        return CATEGORY_ORDER.index(cat)
    return 99

# Additional rich Japanese Dictionary terms to ensure exceeding 3,000+ unique entries
def generate_dictionary_corpus():
    items = []
    
    # Base lists
    items.extend(N5_AISATSU)
    items.extend(N5_PRONOUNS_QUESTIONS)
    items.extend(N5_TIME_NUMBERS_MONEY)
    items.extend(N5_NOUNS_FOOD_FRUIT)
    items.extend(N5_NOUNS_TRANSPORT)
    items.extend(N5_NOUNS_PLACES)
    items.extend(N5_NOUNS_FAMILY_PEOPLE)
    items.extend(N5_NOUNS_HOME_ITEMS)
    items.extend(N5_NOUNS_SCHOOL_OFFICE)
    items.extend(N5_NOUNS_BODY_CLOTHING)
    items.extend(N5_NOUNS_NATURE_WEATHER)
    items.extend(N5_VERBS_BASIC)
    items.extend(N5_ADJECTIVES)
    items.extend(N5_WORK_DAILY)
    items.extend(MNN_ADDITIONS)
    items.extend(N5_MNN_ADDITIONS_2)
    items.extend(N4_RAW)
    items.extend(N4_EXTRA)
    items.extend(N3_RAW)
    items.extend(N3_EXTRA)
    items.extend(N2_RAW)
    items.extend(N2_EXTRA)
    items.extend(MAZII_EXPANSION_AISATSU)
    items.extend(MAZII_EXPANSION_QUESTIONS_PRONOUNS)
    items.extend(MAZII_EXPANSION_TIME_NUMBERS_MONEY)
    items.extend(MAZII_EXPANSION_FOOD)
    items.extend(MAZII_EXPANSION_TRANSPORT_PLACES)
    items.extend(MAZII_EXPANSION_VERBS)
    items.extend(MAZII_EXPANSION_ADJECTIVES)
    items.extend(MEGA_MAZII_ITEMS)
    items.extend(DICT_NUMBERS_TIME_SEASONS)
    items.extend(DICT_FRUITS_FOOD)
    items.extend(DICT_TRANSPORT)
    items.extend(DICT_PLACES_FACILITIES)
    items.extend(DICT_WORKPLACE_BUSINESS)
    items.extend(DICT_DAILY_LIFE)
    items.extend(DICT_NATURE_ENVIRONMENT)
    
    return items

def build_3000_master():
    raw_corpus = generate_dictionary_corpus()
    
    # We will expand systematic numbers (e.g. counters 1-30, dates, minutes 1-60, money amounts, etc.)
    # and extensive Mazii verbs, adjectives, nouns to reach > 3,000 unique verified items.
    
    # 1. Expanded Minute series 1 - 60 minutes
    minute_patterns = [
        ("一分", "いっぷん", "ippun", "Satu menit (1 menit)", "Penunjuk Waktu & Angka", "一分間目を閉じます。", "Memejamkan mata selama satu menit."),
        ("二分", "にふん", "nifun", "Dua menit (2 menit)", "Penunjuk Waktu & Angka", "あと二分で到着します。", "Tiba dalam dua menit lagi."),
        ("三分", "さんぷん", "sanpun", "Tiga menit (3 menit)", "Penunjuk Waktu & Angka", "カップラーメンにお湯を入れて三分待ちます。", "Menunggu tiga menit setelah menuang air panas ke mie instan."),
        ("四分", "よんぷん", "yonpun", "Empat menit (4 menit)", "Penunjuk Waktu & Angka", "四分間のスピーチです。", "Pidato berdurasi empat menit."),
        ("五分", "ごふん", "gofun", "Lima menit (5 menit)", "Penunjuk Waktu & Angka", "五分前行動を心がけます。", "Membiasakan hadir lima menit sebelum waktu dimulai."),
        ("六分", "ろっぷん", "roppun", "Enam menit (6 menit)", "Penunjuk Waktu & Angka", "六分間走ります。", "Berlari selama enam menit."),
        ("七分", "ななふん", "nanafun", "Tujuh menit (7 menit)", "Penunjuk Waktu & Angka", "七分間茹でます。", "Merebus selama tujuh menit."),
        ("八分", "はちふん / はっぷん", "hachifun / happun", "Delapan menit (8 menit)", "Penunjuk Waktu & Angka", "八分目に控えます。", "Makan hingga delapan puluh persen kenyang."),
        ("九分", "きゅうふん", "kyuufun", "Sembilan menit (9 menit)", "Penunjuk Waktu & Angka", "九分九厘成功します。", "Peluang berhasil mencapai sembilan puluh sembilan persen."),
        ("十分", "じゅっぷん / じっぽん", "juppun", "Sepuluh menit (10 menit)", "Penunjuk Waktu & Angka", "駅から徒歩十分です。", "Sepuluh menit berjalan kaki dari stasiun."),
        ("十五分", "じゅうごふん", "juugofun", "Lima belas menit (15 menit)", "Penunjuk Waktu & Angka", "十五分間の休憩です。", "Istirahat selama lima belas menit."),
        ("二十分", "にじゅっぷん", "nijuppun", "Dua puluh menit (20 menit)", "Penunjuk Waktu & Angka", "二十分間煮込みます。", "Merebus perlahan selama dua puluh menit."),
        ("二十五分", "にじゅうごふん", "nijuugofun", "Dua puluh lima menit (25 menit)", "Penunjuk Waktu & Angka", "授業開始まであと二十五分です。", "Tinggal 25 menit lagi sebelum kelas dimulai."),
        ("三十分", "さんじゅっぷん", "sanjuppun", "Tiga puluh menit (Setengah jam)", "Penunjuk Waktu & Angka", "毎日三十分間ウォーキングをします。", "Jalan kaki selama 30 menit setiap hari."),
        ("四十分", "よんじゅっぷん", "yonjuppun", "Empat puluh menit (40 menit)", "Penunjuk Waktu & Angka", "四十分間の講義です。", "Kuliah ceramah selama empat puluh menit."),
        ("四十五分", "よんじゅうごふん", "yonjuugofun", "Empat puluh lima menit (45 menit)", "Penunjuk Waktu & Angka", "サッカーの前半四十五分です。", "Babak pertama sepak bola selama 45 menit."),
        ("五十分", "ごじゅっぷん", "gojuppun", "Lima puluh menit (50 menit)", "Penunjuk Waktu & Angka", "五十分間のテストです。", "Ujian tes berdurasi lima puluh menit.")
    ]
    raw_corpus.extend(minute_patterns)

    # 2. Expanded Tanggal Kalender 1 - 31 hari
    date_patterns = [
        ("十一日", "じゅういちにち", "juuichinichi", "Tanggal Sebelas / 11 Hari", "Penunjuk Waktu & Angka", "十一日に荷物が届きます。", "Paket tiba pada tanggal sebelas."),
        ("十二日", "じゅうににち", "juuninichi", "Tanggal Dua Belas / 12 Hari", "Penunjuk Waktu & Angka", "十二日に出発します。", "Berangkat pada tanggal dua belas."),
        ("十三日", "じゅうさんにち", "juusannichi", "Tanggal Tiga Belas / 13 Hari", "Penunjuk Waktu & Angka", "十三日の金曜日です。", "Jumat tanggal tiga belas."),
        ("十五日", "じゅうごにち", "juugonichi", "Tanggal Lima Belas / 15 Hari", "Penunjuk Waktu & Angka", "毎月十五日は給料日です。", "Setiap tanggal 15 adalah hari gajian."),
        ("十六日", "じゅうろくにち", "juurokunichi", "Tanggal Enam Belas / 16 Hari", "Penunjuk Waktu & Angka", "十六日に戻ります。", "Kembali pada tanggal enam belas."),
        ("十七日", "じゅうしちにち / じゅうななにち", "juushichinichi", "Tanggal Tujuh Belas / 17 Hari", "Penunjuk Waktu & Angka", "十七日に予約を入れました。", "Mereservasi tempat pada tanggal 17."),
        ("十八日", "じゅうはちにち", "juuhachinichi", "Tanggal Delapan Belas / 18 Hari", "Penunjuk Waktu & Angka", "十八日に会議を開きます。", "Mengadakan rapat pada tanggal 18."),
        ("十九日", "じゅうくにち", "juukunichi", "Tanggal Sembilan Belas / 19 Hari", "Penunjuk Waktu & Angka", "十九日に締め切られます。", "Batas waktu pengumpulan tanggal 19."),
        ("二十一日", "にじゅういちにち", "nijuuichinichi", "Tanggal Dua Puluh Satu / 21 Hari", "Penunjuk Waktu & Angka", "二十一世紀を生きる若者です。", "Pemuda yang hidup di abad kedua puluh satu."),
        ("二十二日", "にじゅうににち", "nijuuninichi", "Tanggal Dua Puluh Dua / 22 Hari", "Penunjuk Waktu & Angka", "二十二日に発表します。", "Mengumumkan hasil pada tanggal 22."),
        ("二十三日", "にじゅうさんにち", "nijuusannichi", "Tanggal Dua Puluh Tiga / 23 Hari", "Penunjuk Waktu & Angka", "二十三日は祝日です。", "Tanggal 23 adalah hari libur nasional."),
        ("二十五日", "にじゅうごにち", "nijuugonichi", "Tanggal Dua Puluh Lima / 25 Hari", "Penunjuk Waktu & Angka", "十二月二十五日はクリスマスです。", "Tanggal 25 Desember adalah hari Natal."),
        ("二十六日", "にじゅうろくにち", "nijuurokunichi", "Tanggal Dua Puluh Enam / 26 Hari", "Penunjuk Waktu & Angka", "二十六日に帰国します。", "Pulang ke tanah air pada tanggal 26."),
        ("二十七日", "にじゅうななにち / にじゅうしちにち", "nijuunananichi", "Tanggal Dua Puluh Tujuh / 27 Hari", "Penunjuk Waktu & Angka", "二十七日にテストがあります。", "Ada ujian pada tanggal dua puluh tujuh."),
        ("二十八日", "にじゅうはちにち", "nijuuhachinichi", "Tanggal Dua Puluh Delapan / 28 Hari", "Penunjuk Waktu & Angka", "二月は二十八日まであります。", "Bulan Februari ada sampai tanggal 28."),
        ("二十九日", "にじゅうくにち", "nijuukunichi", "Tanggal Dua Puluh Sembilan / 29 Hari", "Penunjuk Waktu & Angka", "うるう年は二十九日あります。", "Tahun kabisat memiliki 29 hari di bulan Februari."),
        ("三十日", "さんじゅうにち", "sanjuunichi", "Tanggal Tiga Puluh / 30 Hari", "Penunjuk Waktu & Angka", "一か月は三十日または三十一日です。", "Satu bulan terdiri dari 30 atau 31 hari."),
        ("三十一日", "さんじゅういちにち", "sanjuuichinichi", "Tanggal Tiga Puluh Satu (Akhir Bulan)", "Penunjuk Waktu & Angka", "大晦日は十二月三十一日です。", "Malam tahun baru adalah tanggal 31 Desember.")
    ]
    raw_corpus.extend(date_patterns)

    # De-duplicate strictly by Japanese kanji/kana key
    master_seen = set()
    cleaned_items = []
    
    for item in raw_corpus:
        jp, kana, romaji, id_trans, cat, ex, ex_id = item
        key = jp.strip()
        if key not in master_seen:
            master_seen.add(key)
            cleaned_items.append(item)
            
    # Sort systematically by Category Rank
    cleaned_items.sort(key=lambda x: get_cat_rank(x[4]))
    
    # Build complete card objects
    deck_all = []
    id_counter = 1
    for item in cleaned_items:
        jp, kana, romaji, id_trans, cat, ex, ex_id = item
        cat_jp = CATEGORY_MAP_JP.get(cat, '日本語')
        deck_all.append({
            'id': id_counter,
            'level': 'N5', # Universal generic compatibility
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
        
    print(f"Total deduplicated Mazii Dictionary words compiled: {len(deck_all)}")
    
    out_lines = [
        "import { JLPTLevel, VocabCard } from '../types';",
        "",
        "/**",
        " * DATA KOSAKATA LENGKAP KAMUS BAHASA JEPANG MAZII DICTIONARY & MINNA NO NIHONGO",
        " * - Kartu Hafalan Terpadu Tanpa Pembagian Level",
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
        
    print(f"Successfully generated {target_path} with {len(deck_all)} dictionary flashcards!")

if __name__ == '__main__':
    build_3000_master()
