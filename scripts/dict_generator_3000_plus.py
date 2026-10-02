# -*- coding: utf-8 -*-
import json
import os
import sys

# Import base datasets
from dict_synthesizer_3000 import generate_super_corpus, CATEGORY_MAP_JP, CATEGORY_ORDER, get_cat_rank

# We will synthesize rich Mazii Dictionary pairs across all 14 categories
def build_3000_plus_dictionary():
    base_corpus = generate_super_corpus()
    
    # Extensive vocabulary expansions
    extra_vocab = [
        # --- SALAM & PERCAKAPAN (Aisatsu) ---
        ("ご無沙汰をお詫び申し上げます", "ごぶさたをおわびもうしあげます", "gobusata wo owabi moushiagemasu", "Mohon maaf yang sebesar-besarnya atas jarangnya berkabar", "Salam & Ungkapan (Aisatsu)", "長らくのご無沙汰をお詫び申し上げます。", "Mohon maaf yang sebesar-besarnya atas lamanya saya tidak berkabar."),
        ("恐縮に存じます", "きょうしゅくにぞんじます", "kyoushuku ni zonjimasu", "Saya merasa sangat tersanjung sekaligus sungkan atas kebaikan Anda", "Salam & Ungkapan (Aisatsu)", "温かいお心遣い、大変恐縮に存じます。", "Saya merasa sangat tersanjung dan berterima kasih atas perhatian Anda."),
        ("何卒よろしくお願い申し上げます", "なにとぞよろしくおねがいもうしあげます", "nanitozo yoroshiku onegaimoushiagemasu", "Besar harapan saya atas bimbingan dan kerja sama baik Anda", "Salam & Ungkapan (Aisatsu)", "今後とも何卒よろしくお願い申し上げます。", "Besar harapan saya atas kerja sama yang baik ke depannya."),
        ("平素は格別のご高配を賜り", "へいそはかくべつのごこうはいをたまわり", "heiso wa kakubetsu no gokouhai wo tamawari", "Terima kasih atas segala perhatian dan kemitraan istimewa selama ini", "Salam & Ungkapan (Aisatsu)", "平素は格別のご愛顧を賜り厚く御礼申し上げます。", "Kami haturkan terima kasih sebesar-besarnya atas kemitraan istimewa selama ini."),
        ("深謝いたします", "しんしゃいたします", "shinsha itashimasu", "Saya haturkan rasa terima kasih yang sedalam-dalamnya", "Salam & Ungkapan (Aisatsu)", "皆様の多大なるご協力に深謝いたします。", "Saya haturkan rasa terima kasih sedalam-dalamnya atas kerja sama luar biasa rekan-rekan sekalian."),
        ("お祝い申し上げます", "おいわいもうしあげます", "oiwai moushiagemasu", "Saya ucapkan selamat atas keberhasilan / momen bahagia", "Salam & Ungkapan (Aisatsu)", "ご栄転を心よりお祝い申し上げます。", "Saya ucapkan selamat yang setulus-tulusnya atas promosi jabatan Anda."),
        ("衷心よりお見舞い申し上げます", "ちゅうしんよりおみまいもうしあげます", "chuushin yori omimai moushiagemasu", "Saya haturkan simpati dan doa lekas pulih dari lubuk hati", "Salam & Ungkapan (Aisatsu)", "被災地の皆様に衷心よりお見舞い申し上げます。", "Kami haturkan simpati dan doa mendalam kepada seluruh warga terdampak bencana."),
        ("ご健勝をお祈り申し上げます", "ごけんしょうをおいのりもうしあげます", "gokenshou wo oinori moushiagemasu", "Mendoakan kesehatan dan kesejahteraan Anda sekeluarga", "Salam & Ungkapan (Aisatsu)", "皆様のご健勝とご多幸をお祈り申し上げます。", "Kami mendoakan kesehatan dan kebahagiaan bagi Anda sekalian."),
        ("ご発展を祈念いたします", "ごはんてんをきねんいたします", "gohatten wo kinen itashimasu", "Mendoakan kemajuan dan kejayaan yang berkelanjutan", "Salam & Ungkapan (Aisatsu)", "貴社のますますのご発展を祈念いたします。", "Kami mendoakan kemajuan dan kejayaan bagi perusahaan Anda."),
        ("略儀ながら書中をもちまして", "りゃくぎながらしょちゅうをもちまして", "ryakugi nagara shochuu wo mochimashite", "Mohon maaf menyampaikan salam secara tertulis lewat surat ini", "Salam & Ungkapan (Aisatsu)", "略儀ながら書中をもちましてご挨拶申し上げます。", "Mohon maaf menyampaikan salam secara tertulis lewat surat ini."),

        # --- KATA TANYA & GANTI ---
        ("我が国", "わがくに", "wagakuni", "Negara kita / Tanah air tercinta", "Kata Tanya & Kata Ganti", "我が国の豊かな自然を守ります。", "Menjaga kekayaan alam tanah air kita."),
        ("我が社", "わがしゃ", "wagasha", "Perusahaan kami", "Kata Tanya & Kata Ganti", "我が社独自の最新技術です。", "Teknologi mutakhir orisinal milik perusahaan kami."),
        ("当校", "とうこう", "toukou", "Sekolah kami / Kampus kami", "Kata Tanya & Kata Ganti", "当校の教育方針について説明します。", "Menjelaskan visi dan misi pendidikan sekolah kami."),
        ("同社", "どうしゃ", "dousha", "Perusahaan yang bersangkutan", "Kata Tanya & Kata Ganti", "同社が開発した新製品です。", "Produk baru yang dikembangkan oleh perusahaan yang bersangkutan."),
        ("同僚各位", "どうりょうかくい", "douryou kakui", "Rekan-rekan kerja sejawat sekalian", "Kata Tanya & Kata Ganti", "同僚各位のご協力に感謝します。", "Terima kasih atas kerja sama rekan-rekan sejawat sekalian."),
        ("某所", "ぼうしょ", "bousho", "Suatu tempat tertentu (Anonim)", "Kata Tanya & Kata Ganti", "都内某所で秘密の会議が開かれました。", "Rapat rahasia digelar di suatu tempat di Tokyo."),
        ("某日", "ぼうじつ", "boujitsu", "Pada suatu hari tertentu (Anonim)", "Kata Tanya & Kata Ganti", "先月某日に契約が成立しました。", "Kontrak disepakati pada suatu hari bulan lalu."),
        ("如何ほど", "いかほど", "ikahodo", "Berapa banyakkah? (formal)", "Kata Tanya & Kata Ganti", "ご予算は如何ほどでしょうか。", "Berapa banyakkah estimasi anggaran Anda?"),
        ("何卒", "なにとぞ", "nanitozo", "Betapa kami memohon / Sudilah kiranya", "Kata Tanya & Kata Ganti", "何卒ご容赦ください。", "Sudilah kiranya memaafkan kekhilafan kami."),

        # --- ANGKA, UANG & MUSIM-MUSIM DUNIA ---
        ("氷河期", "ひょうがき", "hyougaki", "Zaman es glasial", "Penunjuk Waktu & Angka", "氷河期のマンモスの化石です。", "Fosil gajah mamut dari zaman es."),
        ("温暖期", "おんだんき", "ondanki", "Periode iklim hangat", "Penunjuk Waktu & Angka", "地球の温暖期における生態系の変化です。", "Perubahan ekosistem pada periode iklim hangat bumi."),
        ("乾期", "かんき", "kanki", "Musim kemarau panjang", "Penunjuk Waktu & Angka", "乾期に水不足対策を実施します。", "Menerapkan langkah antisipasi krisis air di musim kemarau."),
        ("モンスーン", "もんすーん", "monsuun", "Angin musim muson pembawa hujan", "Penunjuk Waktu & Angka", "モンスーンの影響で恵みの雨が降ります。", "Hujan berkah turun dipengaruhi oleh angin musim muson."),
        ("エルニーニョ現象", "えるにーにょげんしょう", "eruniinyo genshou", "Fenomena anomali iklim El Nino", "Penunjuk Waktu & Angka", "エルニーニョ現象により異常気象が発生します。", "Terjadi anomali cuaca ekstrem akibat fenomena El Nino."),
        ("ラニーニャ現象", "らにーにゃげんしょう", "raniinya genshou", "Fenomena anomali iklim La Nina", "Penunjuk Waktu & Angka", "ラニーニャ現象で厳しい寒冬になります。", "Musim dingin menjadi sangat beku akibat fenomena La Nina."),
        ("白夜", "びゃくや", "byakuya", "Fenomena matahari tengah malam kutub (Midnight Sun)", "Penunjuk Waktu & Angka", "北欧の白夜で真夜中も太陽が沈みません。", "Matahari tidak terbenam bahkan di tengah malam saat fenomena malam putih di kutub."),
        ("極夜", "きょくや", "kyokuya", "Fenomena malam kutub berkepanjangan (Polar Night)", "Penunjuk Waktu & Angka", "南極の極夜では一日中太陽が昇りません。", "Matahari tidak pernah terbit sepanjang hari saat fenomena malam kutub di Antartika.")
    ]

    # Combine everything
    all_combined = base_corpus + extra_vocab

    # Strictly de-duplicate
    master_seen = set()
    unique_items = []
    
    for item in all_combined:
        jp, kn, rm, id_t, cat, ex, ex_id = item
        key = jp.strip()
        if key not in master_seen:
            master_seen.add(key)
            unique_items.append(item)
            
    # Sort systematically by Category Rank
    unique_items.sort(key=lambda x: get_cat_rank(x[4]))
    
    print(f"Total pure de-duplicated unique items: {len(unique_items)}")
    return unique_items

if __name__ == '__main__':
    items = build_3000_plus_dictionary()
