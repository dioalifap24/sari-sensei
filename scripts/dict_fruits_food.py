# -*- coding: utf-8 -*-
# Nama-Nama Buah Lengkap di Dunia, Makanan, Minuman, Sayuran & Bumbu Dapur

DICT_FRUITS_FOOD = [
    # Nama Buah Lengkap (果物)
    ("パッションフルーツ", "ぱっしょんふるーつ", "passhonfuruutsu", "Buah Markisa", "Kata Benda - Buah & Makanan", "甘酸っぱいパッションフルーツの香りです。", "Aroma harum buah markisa yang manis asam."),
    ("ザクロ", "ざくろ", "zakuro", "Buah Delima (Pomegranate)", "Kata Benda - Buah & Makanan", "ルビーのように赤いザクロの実です。", "Butiran biji buah delima merah berkilau bagai batu rubi."),
    ("グアバ", "ぐあば", "guaba", "Buah Jambu Biji (Guava)", "Kata Benda - Buah & Makanan", "ピンク色のグアバジュースを飲みます。", "Meminum jus jambu biji berwarna merah muda."),
    ("スターフルーツ", "すたーふるーつ", "sutaafuruutsu", "Buah Belimbing (Starfruit)", "Kata Benda - Buah & Makanan", "輪切りにすると星形になるスターフルーツです。", "Buah belimbing yang berbentuk bintang saat dipotong melintang."),
    ("ジャックフルーツ", "じゃっくふるーつ", "jakkufuruutsu", "Buah Nangka (Jackfruit)", "Kata Benda - Buah & Makanan", "甘くて濃厚なジャックフルーツを食べます。", "Memakan buah nangka yang manis dan legit."),
    ("パンノキ", "ぱんのき", "pannoki", "Buah Sukun (Breadfruit)", "Kata Benda - Buah & Makanan", "揚げたパンノキの実はホクホクしています。", "Buah sukun goreng terasa gurih dan empuk."),
    ("サポジラ", "さぽじら", "sapojira", "Buah Sawo (Sapodilla)", "Kata Benda - Buah & Makanan", "黒糖のような甘さのサポジラです。", "Buah sawo dengan rasa manis legit seperti gula merah."),
    ("タマリンド", "たまりんど", "tamarindo", "Asam Jawa (Tamarind)", "Kata Benda - Buah & Makanan", "料理の酸味づけにタマリンドを使います。", "Menggunakan asam jawa untuk memberi rasa asam pada masakan."),
    ("クワの実", "くわのみ", "kuwanomi", "Buah Murbei (Mulberry)", "Kata Benda - Buah & Makanan", "黒く熟したクワの実を摘みます。", "Memetik buah murbei yang telah matang kehitaman."),
    ("ラズベリー", "らずべりー", "razuberii", "Raspberry / Frambos", "Kata Benda - Buah & Makanan", "タルトの上にラズベリーを飾ります。", "Menghias kue tart dengan buah raspberry."),
    ("ブラックベリー", "ぶらっくべりー", "burakkuberii", "Blackberry", "Kata Benda - Buah & Makanan", "完熟ブラックベリーでジャムを作ります。", "Membuat selai dari buah blackberry yang matang sempurna."),
    ("カシス", "かしす", "kashisu", "Blackcurrant / Casis", "Kata Benda - Buah & Makanan", "カシスオレンジのカクテルを注文します。", "Memesan minuman koktail cassis orange."),
    ("金柑", "きんかん", "kinkan", "Jeruk Kinkat / Kumquat (bisa dimakan beserta kulit)", "Kata Benda - Buah & Makanan", "皮ごと甘露煮にした金柑を食べます。", "Memakan jeruk kinkan yang direbus manis bersama kulitnya."),
    ("カボス", "かぼす", "kabosu", "Jeruk Kabosu khas Oita", "Kata Benda - Buah & Makanan", "大分県名物のカボスを絞ります。", "Memeras jeruk kabosu khas Prefektur Oita."),
    ("シークヮーサー", "しーくゎーさー", "shiikuwaasaa", "Jeruk Shikuwasa khas Okinawa", "Kata Benda - Buah & Makanan", "沖縄のシークヮーサージュースは爽やかです。", "Jus jeruk shikuwasa khas Okinawa sangat menyegarkan."),
    ("日向夏", "ひゅうがなつ", "hyuuganatsu", "Jeruk Hyuganatsu khas Miyazaki", "Kata Benda - Buah & Makanan", "宮崎県特産の日向夏をデザートにいただきます。", "Menyantap jeruk hyuganatsu khas Miyazaki untuk pencuci mulut."),
    ("ポメロ", "ぽめろ", "pomero", "Jeruk Bali Besar (Pomelo)", "Kata Benda - Buah & Makanan", "果肉がぎっしり詰まったポメロです。", "Jeruk bali dengan bulir daging buah yang padat."),
    ("プルーン", "ぷるーん", "puruun", "Buah Plum Kering (Prune)", "Kata Benda - Buah & Makanan", "毎朝プルーンを二粒食べます。", "Makan dua butir buah plum kering tiap pagi."),
    ("デーツ", "でーつ", "deetsu", "Kurma kering manis", "Kata Benda - Buah & Makanan", "断食明けに甘いデーツを食べます。", "Menyantap buah kurma manis saat berbuka puasa."),
    ("レーズン", "れーずん", "reezun", "Kismis anggur kering", "Kata Benda - Buah & Makanan", "レーズン入りの食パンをトーストします。", "Memanggang roti tawar isi kismis anggur."),

    # Aneka Sayuran & Jamur (野菜・きのこ)
    ("大根", "だいこん", "daikon", "Lobak putih Jepang", "Kata Benda - Buah & Makanan", "大根おろしを焼き魚に添えます。", "Menyajikan parutan lobak putih bersama ikan bakar."),
    ("白菜", "はくさい", "hakusai", "Sawi putih (Napa Cabbage)", "Kata Benda - Buah & Makanan", "鍋料理にたっぷりの白菜を入れます。", "Memasukkan banyak sawi putih ke dalam masakan hotpot."),
    ("ほうれん草", "ほうれんそう", "hourensou", "Bayam hijau Jepang (Spinach)", "Kata Benda - Buah & Makanan", "ほうれん草のおひたしを作ります。", "Membuat hidangan bayam rebus ohitashi."),
    ("小松菜", "こまつな", "komatsuna", "Sawi hijau Komatsuna", "Kata Benda - Buah & Makanan", "小松菜と油揚げの煮浸しです。", "Sayur sawi komatsuna rebus bersama tahu goreng aburaage."),
    ("長ねぎ", "ながねぎ", "naganegi", "Daun bawang besar Jepang (Leek)", "Kata Benda - Buah & Makanan", "長ねぎを斜め切りにしてスープに入れます。", "Mengiris daun bawang leek miring ke dalam sup."),
    ("ブロッコリー", "ぶろっこりー", "burokkorii", "Brokoli hijau", "Kata Benda - Buah & Makanan", "茹でたブロッコリーにマヨネーズをつけます。", "Mencolek brokoli rebus dengan mayones."),
    ("アスパラガス", "あすぱらがす", "asuparagasu", "Asparagus", "Kata Benda - Buah & Makanan", "アスパラガスのベーコン巻きを作ります。", "Membuat gulungan asparagus berbalut daging asap bacon."),
    ("きゅうり", "きゅうり", "kyuuri", "Timun segar", "Kata Benda - Buah & Makanan", "冷やしたきゅうりに味噌をつけて食べます。", "Makan timun dingin dicelupkan ke saus pasta miso."),
    ("茄子", "なす", "nasu", "Terong ungu", "Kata Benda - Buah & Makanan", "揚げ茄子の生姜醤油がけです。", "Terong goreng siram kecap jahe segar."),
    ("ピーマン", "ぴーまん", "piiman", "Paprika hijau Jepang (Piman)", "Kata Benda - Buah & Makanan", "ピーマンの肉詰めを焼きます。", "Memanggang paprika hijau isi daging cincang."),
    ("パプリカ", "ぱぷりか", "papurika", "Paprika merah / kuning manis", "Kata Benda - Buah & Makanan", "色鮮やかなパプリカを炒めます。", "Menumis paprika aneka warna yang cerah."),
    ("かぼちゃ", "かぼちゃ", "kabocha", "Labu kuning Jepang (Kabocha)", "Kata Benda - Buah & Makanan", "甘いかぼちゃの煮物を作ります。", "Membuat hidangan labu kabocha rebus manis gurih."),
    ("蓮根", "れんこん", "renkon", "Akar teratai berlubang (Lotus Root)", "Kata Benda - Buah & Makanan", "シャキシャキした蓮根のきんぴらです。", "Tumisan akar teratai renkon yang renyah gurih."),
    ("ごぼう", "ごぼう", "gobou", "Akar Burdock (Gobo)", "Kata Benda - Buah & Makanan", "食物繊維が豊富なごぼうを食べます。", "Memakan akar gobo yang kaya serat pangan."),
    ("椎茸", "しいたけ", "shiitake", "Jamur Shiitake", "Kata Benda - Buah & Makanan", "香りの良い干し椎茸で出汁をとります。", "Membuat kaldu dashi dari jamur shiitake kering yang harum."),
    ("しめじ", "しめじ", "shimeji", "Jamur Shimeji", "Kata Benda - Buah & Makanan", "しめじとバターで炒め物を作ります。", "Membuat tumisan jamur shimeji dengan mentega butter."),
    ("えのき", "えのき", "enoki", "Jamur Enoki putih ramping", "Kata Benda - Buah & Makanan", "お味噌汁にえのきを入れます。", "Memasukkan jamur enoki ke dalam sup miso."),
    ("エリンギ", "えりんぎ", "eringi", "Jamur Tiram Raja (King Oyster)", "Kata Benda - Buah & Makanan", "エリンギを薄切りにしてグリルします。", "Mengiris jamur eringi tipis lalu memanggangnya."),
    ("舞茸", "まいたけ", "maitake", "Jamur Maitake", "Kata Benda - Buah & Makanan", "サクサクの舞茸の天ぷらを揚げます。", "Menggoreng tempura jamur maitake yang renyah."),
    ("松茸", "まつたけ", "matsutake", "Jamur Matsutake mewah khas musim gugur", "Kata Benda - Buah & Makanan", "秋の味覚である最高級の松茸ご飯を炊きます。", "Menanak nasi campur jamur matsutake kualitas terbaik."),

    # Aneka Olahan, Makanan Laut & Daging
    ("鮭", "さけ / しゃけ", "sake / shake", "Ikan Salmon", "Kata Benda - Buah & Makanan", "朝食に塩鮭を焼きます。", "Memanggang ikan salmon asin untuk sarapan."),
    ("鮪", "まぐろ", "maguro", "Ikan Tuna", "Kata Benda - Buah & Makanan", "新鮮な本マグロの赤身です。", "Daging tuna segar tanpa lemak (Akami)."),
    ("鯛", "たい", "tai", "Ikan Kakap Merah (Sea Bream)", "Kata Benda - Buah & Makanan", "お祝いの席に鯛の塩焼きを用意します。", "Menyiapkan kakap merah panggang garam untuk pesta perayaan."),
    ("秋刀魚", "さんま", "sanma", "Ikan Sanma khas musim gugur", "Kata Benda - Buah & Makanan", "秋に脂がのった秋刀魚をすだちで食べます。", "Menyantap ikan sanma gurih berlemak dengan perasan sudachi."),
    ("鰻", "うなぎ", "unagi", "Belut air tawar panggang Unagi", "Kata Benda - Buah & Makanan", "土用の丑の日に香ばしい鰻の蒲焼きを食べます。", "Menyantap unagi kabayaki panggang manis pada hari Doyo no Ushi."),
    ("海老", "えび", "ebi", "Udang laut", "Kata Benda - Buah & Makanan", "大きな海老フライを揚げます。", "Menggoreng udang balut tepung ebi furai besar."),
    ("蟹", "かに", "kani", "Kepiting laut", "Kata Benda - Buah & Makanan", "冬の北海道で甘いズワイガニを食べます。", "Menyantap kepiting snow crab yang manis di Hokkaido."),
    ("烏賊", "いか", "ika", "Cumi-cumi", "Kata Benda - Buah & Makanan", "新鮮なイカの刺身は透き通っています。", "Sashimi cumi-cumi segar terlihat bening transparan."),
    ("蛸", "たこ", "tako", "Gurita", "Kata Benda - Buah & Makanan", "茹でたタコを酢の物に合えます。", "Mencampurkan potongan gurita rebus ke dalam hidangan cuka."),
    ("牡蠣", "かき", "kaki", "Tiram laut (Oyster)", "Kata Benda - Buah & Makanan", "広島名物のジューシーなカキフライです。", "Gorengan tiram laut berbalut tepung renyah khas Hiroshima."),
    ("帆立", "ほたて", "hotate", "Kerang Simping (Scallop)", "Kata Benda - Buah & Makanan", "バター醤油で香ばしく焼いたホタテです。", "Kerang simping yang dipanggang harum dengan mentega dan kecap asin."),
    ("ミンチ", "みんち", "minchi", "Daging cincang giling (Mince)", "Kata Benda - Buah & Makanan", "合い挽きミンチでハンバーグをこねます。", "Mengaduk daging cincang campuran sapi-babi untuk membuat hamburg.")
]

print(f"Loaded {len(DICT_FRUITS_FOOD)} comprehensive Fruits & Food items.")
