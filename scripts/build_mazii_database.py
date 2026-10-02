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

# Thematic order sorting priority
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

def compile_mazii_dictionary():
    all_raw_items = []
    
    # Base sets
    all_raw_items.extend(N5_AISATSU)
    all_raw_items.extend(N5_PRONOUNS_QUESTIONS)
    all_raw_items.extend(N5_TIME_NUMBERS_MONEY)
    all_raw_items.extend(N5_NOUNS_FOOD_FRUIT)
    all_raw_items.extend(N5_NOUNS_TRANSPORT)
    all_raw_items.extend(N5_NOUNS_PLACES)
    all_raw_items.extend(N5_NOUNS_FAMILY_PEOPLE)
    all_raw_items.extend(N5_NOUNS_HOME_ITEMS)
    all_raw_items.extend(N5_NOUNS_SCHOOL_OFFICE)
    all_raw_items.extend(N5_NOUNS_BODY_CLOTHING)
    all_raw_items.extend(N5_NOUNS_NATURE_WEATHER)
    all_raw_items.extend(N5_VERBS_BASIC)
    all_raw_items.extend(N5_ADJECTIVES)
    all_raw_items.extend(N5_WORK_DAILY)
    all_raw_items.extend(MNN_ADDITIONS)
    all_raw_items.extend(N5_MNN_ADDITIONS_2)
    
    # N4, N3, N2 sets
    all_raw_items.extend(N4_RAW)
    all_raw_items.extend(N4_EXTRA)
    all_raw_items.extend(N3_RAW)
    all_raw_items.extend(N3_EXTRA)
    all_raw_items.extend(N2_RAW)
    all_raw_items.extend(N2_EXTRA)
    
    # Mazii Dictionary Expansion sets
    all_raw_items.extend(MAZII_EXPANSION_AISATSU)
    all_raw_items.extend(MAZII_EXPANSION_QUESTIONS_PRONOUNS)
    all_raw_items.extend(MAZII_EXPANSION_TIME_NUMBERS_MONEY)
    all_raw_items.extend(MAZII_EXPANSION_FOOD)
    all_raw_items.extend(MAZII_EXPANSION_TRANSPORT_PLACES)
    all_raw_items.extend(MAZII_EXPANSION_VERBS)
    all_raw_items.extend(MAZII_EXPANSION_ADJECTIVES)
    all_raw_items.extend(MEGA_MAZII_ITEMS)
    
    # De-duplicate strictly by Japanese kanji/kana key
    master_seen = set()
    cleaned_items = []
    
    for item in all_raw_items:
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
            'level': 'N5', # Generic compatibility
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
    
    # Build TypeScript export file
    out_lines = [
        "import { JLPTLevel, VocabCard } from '../types';",
        "",
        "/**",
        " * DATA KOSAKATA LENGKAP KAMUS JEPANG MAZII DICTIONARY & MINNA NO NIHONGO",
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
        "// Untuk kompatibilitas backward view yang membutuhkan ALL_VOCAB dan VOCAB_ALL_LEVELS",
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
    compile_mazii_dictionary()
