import n5Data from './jepangOrgData/n5.json';
import n4Data from './jepangOrgData/n4.json';
import n3Data from './jepangOrgData/n3.json';
import n2Data from './jepangOrgData/n2.json';
import { VocabItem } from './officialMateriData';

/**
 * 100% DATA RESMI DARI 4 TAUTAN JEPANG.ORG
 * N5: Tepat 669 kosakata
 * N4: Tepat 582 kosakata
 * N3: Tepat 1.802 kosakata
 * N2: Tepat 1.792 kosakata
 * Format: 【KANA】 → KANJI → EJAAN → ARTI
 */
export const JEPANG_ORG_N5_VOCAB: VocabItem[] = n5Data as VocabItem[];
export const JEPANG_ORG_N4_VOCAB: VocabItem[] = n4Data as VocabItem[];
export const JEPANG_ORG_N3_VOCAB: VocabItem[] = n3Data as VocabItem[];
export const JEPANG_ORG_N2_VOCAB: VocabItem[] = n2Data as VocabItem[];
