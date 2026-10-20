export interface KanaCharacter {
  char: string;
  romaji: string;
  back_note: string;
  mnemonic_concept: string;
  stroke_count: number;
  stroke_hint: string;
}

export interface WordDrillItem {
  word: string;
  romaji: string;
  meaning: string;
}

export interface KanaRow {
  row_id: string;
  row_label: string;
  has_dakuten: boolean;
  characters: KanaCharacter[];
  word_drill: WordDrillItem[];
}

export interface GoalItem {
  title: string;
  desc: string;
}

export interface IntroScreen {
  goals: GoalItem[];
  cta_button: string;
}

export interface QuizItem {
  type: "kana_to_romaji" | "romaji_to_kana";
  question: string;
  options: string[];
  answer: string;
}

export interface KanaLessonData {
  lesson_id: number;
  level: string;
  chapter: number;
  title: string;
  intro_screen: IntroScreen;
  rows: KanaRow[];
  quiz: QuizItem[];
}

export const HIRAGANA_LESSON_1: KanaLessonData = {
  lesson_id: 1,
  level: "N5",
  chapter: 1,
  title: "Bảng chữ cái Hiragana (1)",

  intro_screen: {
    goals: [
      {
        "title": "Nhớ được 25/46 chữ cái gốc (Hiragana)",
        "desc": "Ghi nhớ mặt chữ & âm đọc 5 hàng đầu: あ・か・さ・た・な"
      },
      {
        "title": "Biến âm Dakuten (゛)",
        "desc": "Khi thêm dấu này âm sẽ đổi: K→G, S→Z, T→D"
      }
    ],
    cta_button: "Bắt đầu ngay"
  },

  rows: [
    {
      row_id: "a",
      row_label: "あ",
      has_dakuten: false,
      characters: [
        { char: "あ", romaji: "a", back_note: "", mnemonic_concept: "Hình cô gái xõa tóc, dáng chữ あ", stroke_count: 3, stroke_hint: "Nét ngang → nét sổ cong → nét móc nhỏ bên phải" },
        { char: "い", romaji: "i", back_note: "", mnemonic_concept: "Hai que mì (I và i) đứng cạnh nhau", stroke_count: 2, stroke_hint: "Hai nét sổ cong song song, trái ngắn phải dài" },
        { char: "う", romaji: "u", back_note: "", mnemonic_concept: "Cái móc câu úp, hoặc mặt cười nhìn nghiêng", stroke_count: 2, stroke_hint: "Nét chấm nhỏ phía trên, sau đó một nét cong lớn" },
        { char: "え", romaji: "e", back_note: "", mnemonic_concept: "Con chim đang dang cánh lượn", stroke_count: 2, stroke_hint: "Nét ngang ngắn, nối nét cong lượn xuống" },
        { char: "お", romaji: "o", back_note: "", mnemonic_concept: "Người chơi golf đánh bóng (bóng là dấu chấm)", stroke_count: 3, stroke_hint: "Giống chữ あ, thêm một nét móc nhỏ phía trên bên phải" }
      ],
      word_drill: [
        { word: "あい", romaji: "ai", meaning: "Tình yêu" },
        { word: "あお", romaji: "ao", meaning: "Màu xanh (dương)" },
        { word: "いえ", romaji: "ie", meaning: "Ngôi nhà" },
        { word: "いいえ", romaji: "iie", meaning: "Không (phủ định)" },
        { word: "うえ", romaji: "ue", meaning: "Phía trên" }
      ]
    },

    {
      row_id: "ka",
      row_label: "か",
      has_dakuten: true,
      characters: [
        { char: "か", romaji: "ka", back_note: "", mnemonic_concept: "Lưỡi câu cá thêm hạt mồi nhỏ", stroke_count: 3, stroke_hint: "Nét sổ, nét ngang, nét móc cong" },
        { char: "が", romaji: "ga", back_note: "か+゛=が (GA)", mnemonic_concept: "Chữ か thêm 2 vệt âm rung Dakuten", stroke_count: 3, stroke_hint: "Giống か, thêm dấu ゛ góc trên phải" },
        { char: "き", romaji: "ki", back_note: "", mnemonic_concept: "Hình chìa khóa (key)", stroke_count: 4, stroke_hint: "Hai nét ngang, một nét sổ, một nét móc nhỏ" },
        { char: "ぎ", romaji: "gi", back_note: "き+゛=ぎ (GI)", mnemonic_concept: "Chữ き thêm 2 vệt âm rung Dakuten", stroke_count: 4, stroke_hint: "Giống き, thêm dấu ゛ góc trên phải" },
        { char: "く", romaji: "ku", back_note: "", mnemonic_concept: "Dấu ngoặc nhọn <", stroke_count: 1, stroke_hint: "Một nét gấp khúc duy nhất" },
        { char: "ぐ", romaji: "gu", back_note: "く+゛=ぐ (GU)", mnemonic_concept: "Chữ く thêm 2 vệt âm rung Dakuten", stroke_count: 1, stroke_hint: "Giống く, thêm dấu ゛ góc trên phải" },
        { char: "け", romaji: "ke", back_note: "", mnemonic_concept: "Thùng gỗ keg rượu", stroke_count: 3, stroke_hint: "Nét sổ, nét ngang ngắn, nét sổ cong" },
        { char: "げ", romaji: "ge", back_note: "け+゛=げ (GE)", mnemonic_concept: "Chữ け thêm 2 vệt âm rung Dakuten", stroke_count: 3, stroke_hint: "Giống け, thêm dấu ゛ góc trên phải" },
        { char: "こ", romaji: "ko", back_note: "", mnemonic_concept: "Hai nét ngang song song", stroke_count: 2, stroke_hint: "Hai nét ngang, nét dưới hơi cong lên" },
        { char: "ご", romaji: "go", back_note: "こ+゛=ご (GO)", mnemonic_concept: "Chữ こ thêm 2 vệt âm rung Dakuten", stroke_count: 2, stroke_hint: "Giống こ, thêm dấu ゛ góc trên phải" }
      ],
      word_drill: [
        { word: "あか", romaji: "aka", meaning: "Màu đỏ" },
        { word: "かお", romaji: "kao", meaning: "Khuôn mặt" },
        { word: "こえ", romaji: "koe", meaning: "Giọng nói" },
        { word: "あき", romaji: "aki", meaning: "Mùa thu" },
        { word: "いか", romaji: "ika", meaning: "Con mực" },
        { word: "かぎ", romaji: "kagi", meaning: "Chìa khóa" },
        { word: "えき", romaji: "eki", meaning: "Nhà ga" },
        { word: "くうき", romaji: "kuuki", meaning: "Không khí" }
      ]
    },

    {
      row_id: "sa",
      row_label: "さ",
      has_dakuten: true,
      characters: [
        { char: "さ", romaji: "sa", back_note: "", mnemonic_concept: "Giống cái kéo cắt", stroke_count: 3, stroke_hint: "Nét ngang, nét sổ, nét móc cong dưới" },
        { char: "ざ", romaji: "za", back_note: "さ+゛=ざ (ZA)", mnemonic_concept: "Chữ さ thêm 2 vệt âm rung Dakuten", stroke_count: 3, stroke_hint: "Giống さ, thêm dấu ゛" },
        { char: "し", romaji: "shi", back_note: "", mnemonic_concept: "Lưỡi câu cá", stroke_count: 1, stroke_hint: "Một nét móc câu duy nhất, từ trên xuống" },
        { char: "じ", romaji: "ji", back_note: "し+゛=じ (JI)", mnemonic_concept: "Chữ し thêm 2 vệt âm rung Dakuten", stroke_count: 1, stroke_hint: "Giống し, thêm dấu ゛" },
        { char: "す", romaji: "su", back_note: "", mnemonic_concept: "Hình xoắn ốc nhỏ", stroke_count: 2, stroke_hint: "Nét cong, sau đó nét xoắn nhỏ ở cuối" },
        { char: "ず", romaji: "zu", back_note: "す+゛=ず (ZU)", mnemonic_concept: "Chữ す thêm 2 vệt âm rung Dakuten", stroke_count: 2, stroke_hint: "Giống す, thêm dấu ゛" },
        { char: "せ", romaji: "se", back_note: "", mnemonic_concept: "Người đang ngồi ngắm hoàng hôn", stroke_count: 3, stroke_hint: "Nét ngang, nét sổ, nét móc ngang nhỏ" },
        { char: "ぜ", romaji: "ze", back_note: "せ+゛=ぜ (ZE)", mnemonic_concept: "Chữ せ thêm 2 vệt âm rung Dakuten", stroke_count: 3, stroke_hint: "Giống せ, thêm dấu ゛" },
        { char: "そ", romaji: "so", back_note: "", mnemonic_concept: "Một nét zíc-zắc liền mạch", stroke_count: 1, stroke_hint: "Một nét gấp khúc liên tục từ trên xuống" },
        { char: "ぞ", romaji: "zo", back_note: "そ+゛=ぞ (ZO)", mnemonic_concept: "Chữ そ thêm 2 vệt âm rung Dakuten", stroke_count: 1, stroke_hint: "Giống そ, thêm dấu ゛" }
      ],
      word_drill: [
        { word: "さけ", romaji: "sake", meaning: "Rượu sake" },
        { word: "いす", romaji: "isu", meaning: "Cái ghế" },
        { word: "あさ", romaji: "asa", meaning: "Buổi sáng" },
        { word: "かさ", romaji: "kasa", meaning: "Cái ô, cái dù" },
        { word: "せかい", romaji: "sekai", meaning: "Thế giới" },
        { word: "すいか", romaji: "suika", meaning: "Dưa hấu" },
        { word: "しお", romaji: "shio", meaning: "Muối" },
        { word: "かぞく", romaji: "kazoku", meaning: "Gia đình" }
      ]
    },

    {
      row_id: "ta",
      row_label: "た",
      has_dakuten: true,
      characters: [
        { char: "た", romaji: "ta", back_note: "", mnemonic_concept: "Chữ 'ta' kết hợp t và a", stroke_count: 4, stroke_hint: "Nét sổ, nét ngang, nét sổ nhỏ, nét móc" },
        { char: "だ", romaji: "da", back_note: "た+゛=だ (DA)", mnemonic_concept: "Chữ た thêm 2 vệt âm rung Dakuten", stroke_count: 4, stroke_hint: "Giống た, thêm dấu ゛" },
        { char: "ち", romaji: "chi", back_note: "", mnemonic_concept: "Dấu hỏi (?) không chấm", stroke_count: 2, stroke_hint: "Nét ngang ngắn, nối nét cong lớn" },
        { char: "ぢ", romaji: "ji", back_note: "ち+゛=ぢ (JI — ít gặp, thường thay bằng じ)", mnemonic_concept: "Chữ ち thêm 2 vệt âm rung Dakuten", stroke_count: 2, stroke_hint: "Giống ち, thêm dấu ゛" },
        { char: "つ", romaji: "tsu", back_note: "", mnemonic_concept: "Nụ cười cong ⌣", stroke_count: 1, stroke_hint: "Một nét cong duy nhất, giống dấu ngoặc nằm ngang" },
        { char: "づ", romaji: "zu", back_note: "つ+゛=づ (ZU — ít gặp, thường thay bằng ず)", mnemonic_concept: "Chữ つ thêm 2 vệt âm rung Dakuten", stroke_count: 1, stroke_hint: "Giống つ, thêm dấu ゛" },
        { char: "て", romaji: "te", back_note: "", mnemonic_concept: "Cần câu cá", stroke_count: 1, stroke_hint: "Một nét móc câu duy nhất" },
        { char: "で", romaji: "de", back_note: "て+゛=で (DE)", mnemonic_concept: "Chữ て thêm 2 vệt âm rung Dakuten", stroke_count: 1, stroke_hint: "Giống て, thêm dấu ゛" },
        { char: "と", romaji: "to", back_note: "", mnemonic_concept: "Ngón chân cái và móng chân (toe)", stroke_count: 2, stroke_hint: "Nét sổ ngắn, nối nét cong móc" },
        { char: "ど", romaji: "do", back_note: "と+゛=ど (DO)", mnemonic_concept: "Chữ と thêm 2 vệt âm rung Dakuten", stroke_count: 2, stroke_hint: "Giống と, thêm dấu ゛" }
      ],
      word_drill: [
        { word: "くつ", romaji: "kutsu", meaning: "Giày" },
        { word: "とけい", romaji: "tokei", meaning: "Đồng hồ" },
        { word: "ちず", romaji: "chizu", meaning: "Bản đồ" },
        { word: "した", romaji: "shita", meaning: "Phía dưới" },
        { word: "だいがく", romaji: "daigaku", meaning: "Trường đại học" },
        { word: "てがき", romaji: "tegaki", meaning: "Viết tay" },
        { word: "つくえ", romaji: "tsukue", meaning: "Cái bàn" },
        { word: "どこ", romaji: "doko", meaning: "Ở đâu" }
      ]
    },

    {
      row_id: "na",
      row_label: "な",
      has_dakuten: false,
      characters: [
        { char: "な", romaji: "na", back_note: "", mnemonic_concept: "Bà xơ đang quỳ cầu nguyện", stroke_count: 4, stroke_hint: "Nét sổ, nét ngang, nét cong, nét móc nhỏ" },
        { char: "に", romaji: "ni", back_note: "", mnemonic_concept: "Số 12 viết liền", stroke_count: 3, stroke_hint: "Hai nét ngang ngắn, một nét sổ cong" },
        { char: "ぬ", romaji: "nu", back_note: "", mnemonic_concept: "Sợi mì ramen quấn đũa", stroke_count: 2, stroke_hint: "Nét cong lớn, thêm vòng xoắn nhỏ ở cuối" },
        { char: "ね", romaji: "ne", back_note: "", mnemonic_concept: "Con mèo cuộn đuôi (ねこ = mèo)", stroke_count: 2, stroke_hint: "Nét cong dài, thêm vòng xoắn nhỏ ở cuối" },
        { char: "の", romaji: "no", back_note: "", mnemonic_concept: "Vòng xoắn tròn — giống ký hiệu の trên biển hiệu Nhật", stroke_count: 1, stroke_hint: "Một nét xoắn tròn duy nhất" }
      ],
      word_drill: [
        { word: "ねこ", romaji: "neko", meaning: "Con mèo" },
        { word: "いぬ", romaji: "inu", meaning: "Con chó" },
        { word: "なつ", romaji: "natsu", meaning: "Mùa hè" },
        { word: "あなた", romaji: "anata", meaning: "Bạn (ngôi thứ 2)" },
        { word: "おかね", romaji: "okane", meaning: "Tiền" },
        { word: "にく", romaji: "niku", meaning: "Thịt" },
        { word: "のど", romaji: "nodo", meaning: "Cổ họng" },
        { word: "さかな", romaji: "sakana", meaning: "Con cá" }
      ]
    }
  ],

  quiz: [
    { type: "kana_to_romaji", question: "あ", options: ["a", "i", "u", "e"], answer: "a" },
    { type: "kana_to_romaji", question: "き", options: ["ki", "shi", "chi", "ni"], answer: "ki" },
    { type: "kana_to_romaji", question: "が", options: ["ka", "ga", "za", "da"], answer: "ga" },
    { type: "kana_to_romaji", question: "す", options: ["su", "tsu", "zu", "nu"], answer: "su" },
    { type: "kana_to_romaji", question: "づ", options: ["zu", "tsu", "do", "de"], answer: "zu" },
    { type: "kana_to_romaji", question: "て", options: ["te", "de", "to", "de"], answer: "te" },
    { type: "kana_to_romaji", question: "ぬ", options: ["nu", "me", "ne", "no"], answer: "nu" },
    { type: "romaji_to_kana", question: "ka", options: ["か", "が", "さ", "た"], answer: "か" },
    { type: "romaji_to_kana", question: "ji", options: ["じ", "し", "ち", "に"], answer: "じ" },
    { type: "romaji_to_kana", question: "zo", options: ["ぞ", "そ", "ど", "ご"], answer: "ぞ" },
    { type: "romaji_to_kana", question: "do", options: ["ど", "と", "の", "だ"], answer: "ど" },
    { type: "romaji_to_kana", question: "ne", options: ["ね", "れ", "め", "の"], answer: "ね" }
  ]
};
