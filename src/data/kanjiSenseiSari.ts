import kanjiDataJson from './kanjiSenseiSari.json';
import { KanjiCard } from '../types';

export interface SenseiSariKanji extends KanjiCard {
  bacaanOn: string;
  bacaanKun: string;
  ejaan: string;
}

/**
 * DATABASE KANJI LENGKAP — SENSEI SARI (TEPAT 900 KARAKTER)
 * N5: Nomor 1–100 (100 Kanji Dasar)
 * N4: Nomor 101–250 (150 Kanji Tambahan)
 * N3: Nomor 251–550 (300 Kanji Menengah)
 * N2: Nomor 551–900 (350 Kanji Menengah Atas)
 */
export const KANJI_SENSEI_SARI: SenseiSariKanji[] = kanjiDataJson as SenseiSariKanji[];

export const KANJI_N5_SENSEI = KANJI_SENSEI_SARI.filter(k => k.level === 'N5');
export const KANJI_N4_SENSEI = KANJI_SENSEI_SARI.filter(k => k.level === 'N4');
export const KANJI_N3_SENSEI = KANJI_SENSEI_SARI.filter(k => k.level === 'N3');
export const KANJI_N2_SENSEI = KANJI_SENSEI_SARI.filter(k => k.level === 'N2');
