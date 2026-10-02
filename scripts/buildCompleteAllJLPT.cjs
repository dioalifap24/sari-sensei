const fs = require('fs');
const path = require('path');

console.log('Generating comprehensive vocabulary dataset...');

// Category translations to Japanese for the front card badge
const CATEGORY_MAP_JP = {
  'Salam & Ungkapan (Aisatsu)': '挨拶・日常会話',
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
  'Kosakata Pekerjaan & Sehari-hari': '仕事・生活',
  'Angka': '数字',
  'Uang': 'お金',
  'Nama Buah': '果物',
  'Kendaraan Umum': '乗り物',
  'Kosakata Sehari-hari': '日常生活',
  'Pekerjaan': '仕事',
  'Sapaan': '挨拶'
};
