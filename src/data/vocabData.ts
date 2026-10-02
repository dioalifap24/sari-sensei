import { JLPTLevel, VocabCard } from '../types';
import {
  JEPANG_ORG_N5_VOCAB,
  JEPANG_ORG_N4_VOCAB,
  JEPANG_ORG_N3_VOCAB,
  JEPANG_ORG_N2_VOCAB
} from './jepangOrgVocab';
import { VocabItem } from './officialMateriData';

/**
 * BASIS DATA KARTU HAFALAN KOSAKATA 100% SINKRON DENGAN HALAMAN MATERI
 * Total: 4.845 Kosakata Resmi JLPT (N5: 669, N4: 582, N3: 1.802, N2: 1.792)
 * Format: 【KANA】 → KANJI → EJAAN → ARTI
 */
const mapToVocabCard = (item: VocabItem, level: JLPTLevel, id: number): VocabCard => {
  const hasKanji = Boolean(item.kanji && item.kanji !== '—');
  return {
    id,
    level,
    japanese: hasKanji ? item.kanji : item.kana,
    kana: item.kana,
    romaji: item.ejaan,
    reading: item.ejaan,
    indonesian: item.arti,
    category: `JLPT ${level}`,
    categoryJp: `JLPT ${level} 公式語彙`,
    example: `${hasKanji ? item.kanji : item.kana}を使う。`,
    exampleIndonesian: `Menggunakan ${item.arti.split(',')[0]}.`
  };
};

let counter = 1;
export const VOCAB_N5: VocabCard[] = JEPANG_ORG_N5_VOCAB.map(item => mapToVocabCard(item, 'N5', counter++));
export const VOCAB_N4: VocabCard[] = JEPANG_ORG_N4_VOCAB.map(item => mapToVocabCard(item, 'N4', counter++));
export const VOCAB_N3: VocabCard[] = JEPANG_ORG_N3_VOCAB.map(item => mapToVocabCard(item, 'N3', counter++));
export const VOCAB_N2: VocabCard[] = JEPANG_ORG_N2_VOCAB.map(item => mapToVocabCard(item, 'N2', counter++));

export const VOCAB_MAZII_DICTIONARY: VocabCard[] = [
  ...VOCAB_N5,
  ...VOCAB_N4,
  ...VOCAB_N3,
  ...VOCAB_N2
];

export const VOCAB_ALL_LEVELS: VocabCard[] = VOCAB_MAZII_DICTIONARY;

export const ALL_VOCAB: Record<JLPTLevel, VocabCard[]> = {
  N5: VOCAB_N5,
  N4: VOCAB_N4,
  N3: VOCAB_N3,
  N2: VOCAB_N2
};
