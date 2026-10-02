import { KanjiCard } from '../types';
import { KANJI_SENSEI_SARI } from './kanjiSenseiSari';

/**
 * DATABASE RESMI KANJI JLPT (SENSEI SARI · TEPAT 900 KANJI)
 * N5: 1–100 (100 Kanji)
 * N4: 101–250 (150 Kanji)
 * N3: 251–550 (300 Kanji)
 * N2: 551–900 (350 Kanji)
 */
export const KANJI_DATABASE: KanjiCard[] = KANJI_SENSEI_SARI;
export default KANJI_DATABASE;
