import { Lesson, ChapterPractice, AdaptiveQuizQuestion } from './curriculumData';
import { HIRAGANA_LESSON_1 } from './kanaLesson1Data';
import { VocabularyItem } from '../types';

// ==========================================
// BÀI 1: TỰ ĐỘNG TẠO DỮ LIỆU TỪ HIRAGANA_LESSON_1 (FORM CHUẨN)
// ==========================================
const lesson1Vocabulary: VocabularyItem[] = [];
HIRAGANA_LESSON_1.rows.forEach(row => {
  // 1. Chữ cái & biến âm
  row.characters.forEach(char => {
    lesson1Vocabulary.push({
      id: `n5-c1-l1-char-${char.char}`,
      word: char.char,
      furigana: char.char,
      romaji: char.romaji,
      meaning: char.back_note ? `dấu " biến âm: ${char.back_note}` : `Âm ${char.romaji.toUpperCase()} (${char.stroke_count} nét)`,
      example: "",
      exampleMeaning: "",
      category: "alphabet",
      note: char.mnemonic_concept
        ? `Mẹo nhớ: ${char.mnemonic_concept}. Cách viết: ${char.stroke_hint}`
        : `Mẹo nhớ cách viết: ${char.stroke_hint}`
    });
  });

  // 2. Luyện từ ghép theo hàng (Word Drill)
  row.word_drill.forEach(drill => {
    lesson1Vocabulary.push({
      id: `n5-c1-l1-drill-${drill.word}`,
      word: drill.word,
      furigana: drill.word,
      romaji: drill.romaji,
      meaning: drill.meaning,
      example: `${drill.word}です。`,
      exampleMeaning: `Đó là ${drill.meaning.toLowerCase()}.`,
      category: "vocab",
      note: `Mẹo nhớ: Hàng ${row.row_label} - ${drill.word} (${drill.romaji}) = ${drill.meaning}`
    });
  });
});

const lesson1PracticeQuiz: AdaptiveQuizQuestion[] = HIRAGANA_LESSON_1.quiz.map((q, idx) => ({
  id: `n5-c1-l1-pq-${idx + 1}`,
  category: "reading" as const,
  categoryLabel: q.type === "kana_to_romaji" ? "Kana ➔ Romaji" : "Romaji ➔ Kana",
  question: q.type === "kana_to_romaji" ? `Chữ Kana 「${q.question}」 có cách đọc Romaji là gì?` : `Âm đọc "${q.question}" viết bằng chữ Hiragana nào?`,
  options: q.options,
  correctAnswer: q.options.indexOf(q.answer),
  explanation: `Đáp án chính xác là: ${q.answer}`,
  variations: []
}));

export const N5_CHAPTER_DATA: Record<number, Record<number, Partial<Lesson>>> = {
  // =========================================================================
  // CHƯƠNG 1: NHẬP MÔN
  // =========================================================================
  1: {
    // BÀI 1: Bảng chữ cái Hiragana (1)
    1: {
      title: "Bài 1: Bảng chữ cái Hiragana (1) / Lesson 1: Hiragana Alphabet (1)",
      vocabulary: lesson1Vocabulary,
      kanji: [
        {
          id: "n5-c1-l1-k1",
          kanji: "一",
          meaning: "Nhất (Số 1)",
          onyomi: "イチ, イツ",
          kunyomi: "ひと, ひと.つ",
          strokes: 1,
          examples: [
            { word: "一つ", reading: "ひとつ", meaning: "Một cái (đồ vật)" },
            { word: "一人", reading: "ひとり", meaning: "Một người" }
          ]
        },
        {
          id: "n5-c1-l1-k2",
          kanji: "二",
          meaning: "Nhị (Số 2)",
          onyomi: "ニ",
          kunyomi: "ふた, ふた.つ",
          strokes: 2,
          examples: [
            { word: "二つ", reading: "ふたつ", meaning: "Hai cái (đồ vật)" },
            { word: "二人", reading: "ふたり", meaning: "Hai người" }
          ]
        },
        {
          id: "n5-c1-l1-k3",
          kanji: "三",
          meaning: "Tam (Số 3)",
          onyomi: "サン",
          kunyomi: "み, み.つ, みっ.つ",
          strokes: 3,
          examples: [
            { word: "三つ", reading: "みっつ", meaning: "Ba cái" },
            { word: "三人", reading: "さんにん", meaning: "Ba người" }
          ]
        }
      ],
      practiceQuiz: lesson1PracticeQuiz,
      grammar: [
        {
          id: "n5-c1-l1-g1",
          pattern: "Cách dạy biến âm: Dấu Dakuten ゛ (Âm gió → Âm rung)",
          meaning: "Dấu ゛ (2 nét nhỏ) ở góc trên bên phải: か→が, さ→ざ, た→だ",
          formula: "Chữ gốc + ゛ = Âm đục (Dakuten: K→G, S→Z, T→D)",
          explanation: "Không giải thích quy tắc dài dòng! Học viên luyện theo cặp flashcard gốc → biến âm liên tục (か→が, さ→ざ...), lặp lại nhiều lần sẽ tự khắc ghi nhớ theo phản xạ tự nhiên. Dấu ゛ (2 nét nhỏ) thêm vào góc trên bên phải chữ làm âm gió → âm rung.",
          examples: [
            {
              japanese: "か (KA) → が (GA) [だいがく: daigaku - trường đại học]",
              vietnamese: "Hàng Ka biến thành âm G (hữu thanh rung cổ họng)."
            },
            {
              japanese: "さ (SA) → ざ (ZA) [ちず: chizu - bản đồ, かぞく: kazoku - gia đình]",
              vietnamese: "Hàng Sa biến thành âm Z (lưu ý し shi → じ ji, す su → ず zu)."
            }
          ]
        },
        {
          id: "n5-c1-l1-g2",
          pattern: "Hai biến âm đặc biệt cần nhớ ở hàng た: ち→ぢ (JI) và つ→づ (ZU)",
          meaning: "Lưu ý ngoại lệ phát âm cực kỳ quan trọng",
          formula: "ち + ゛ = ぢ (đọc là JI) | つ + ゛ = づ (đọc là ZU / DZU, không đọc là TSU!)",
          explanation: "Hàng た thông thường biến âm thành D (た→だ, て→で, と→ど). Tuy nhiên hai âm giữa có quy ước phát âm đặc biệt: 「ち」 biến âm thành 「ぢ」 phát âm là 'JI' (gần giống じ); 「つ」 biến âm thành 「づ」 phát âm là 'ZU' (gần giống ず, không phải TSU).",
          examples: [
            {
              japanese: "つ (tsu) → づ (zu)",
              vietnamese: "Ví dụ: つづく (tsuzuku - tiếp tục). Phát âm là ZU, không được đọc là TSU."
            },
            {
              japanese: "ち (chi) → ぢ (ji)",
              vietnamese: "Ví dụ: はなぢ (hanaji - chảy máu cam). Phát âm là JI."
            }
          ]
        },
        {
          id: "n5-c1-l1-g3",
          pattern: "Lưu ý lộ trình: Hàng は (は→ば→ぱ) dồn hết sang Bài 2",
          meaning: "Hàng は là hàng duy nhất có cả 2 loại biến âm (゛ và ゜)",
          formula: "Bài 1: あ・か・さ・た・な | Bài 2: は→ば→ぱ + ま・や・ら・わ・ん",
          explanation: "Vì hàng は có cả biến âm đục Dakuten (は→ば) và bán đục Handakuten (は→ぱ), nên toàn bộ hàng này sẽ được dồn sang Bài 2 để học viên làm chủ trọn vẹn mà không bị quá tải.",
          examples: [
            {
              japanese: "Bài 1: 5 hàng cơ bản あ・か・さ・た・な (39 flashcard)",
              vietnamese: "Nhớ mặt chữ 25 chữ gốc và phản xạ chuẩn 14 chữ biến âm Dakuten."
            }
          ]
        }
      ],
      grammarQuiz: [
        {
          id: "n5-c1-l1-gq1",
          category: "grammar",
          categoryLabel: "Nhận diện biến âm Dakuten",
          question: "Khi thêm dấu 「゛」 vào chữ 「か」 và 「さ」, ta thu được các chữ nào?",
          options: ["が (GA) và ざ (ZA)", "ば (BA) và ぱ (PA)", "だ (DA) và ざ (ZA)", "が (GA) và ぱ (PA)"],
          correctAnswer: 0,
          explanation: "か thêm dấu ゛ thành が (GA), さ thêm dấu ゛ thành ざ (ZA). Dấu ゛ biến âm gió thành âm rung.",
          variations: []
        },
        {
          id: "n5-c1-l1-gq2",
          category: "grammar",
          categoryLabel: "Phát âm ngoại lệ",
          question: "Phát biểu nào sau đây là ĐÚNG khi nói về chữ 「づ」?",
          options: ["Chữ 「づ」 phát âm là ZU (hoặc DZU), không phát âm là TSU", "Chữ 「づ」 phát âm là TSU", "Chữ 「づ」 phát âm là DU", "Chữ 「づ」 phát âm là TU"],
          correctAnswer: 0,
          explanation: "Chữ 「づ」 (biến âm của つ) phát âm là 'ZU' (gần giống ず), học viên cần đặc biệt ghi nhớ không đọc là TSU.",
          variations: []
        },
        {
          id: "n5-c1-l1-gq3",
          category: "grammar",
          categoryLabel: "Từ vựng biến âm",
          question: "Trong từ 「ちず」 (bản đồ), chữ 「ず」 là biến âm Dakuten của chữ nào?",
          options: ["す (SU)", "さ (SA)", "し (SHI)", "そ (SO)"],
          correctAnswer: 0,
          explanation: "ず (ZU) chính là biến âm khi thêm dấu ゛ vào chữ す (SU).",
          variations: []
        }
      ],
      reading: [
        {
          id: "n5-c1-l1-r1",
          passage: "わたしはいぬとねこがいます。あさ、かさをさして、だいがくへいきます。だいがくですしをたべます。ともだちとちずをみて、くつをかいます。",
          translation: "Tôi có nuôi một chú chó và một chú mèo. Buổi sáng, tôi che ô đi đến trường đại học. Ở trường đại học tôi ăn sushi. Tôi cùng bạn bè xem bản đồ và mua giày.",
          question: "Tác giả đi đến đâu vào buổi sáng và ăn món gì?",
          options: ["Đi đến trường đại học (だいがく) và ăn sushi (すし)", "Đi đến nhà ga và ăn cá (さかな)", "Ở nhà chơi với chó mèo", "Đi mua giày ở Osaka"],
          correctAnswer: 0,
          explanation: "Trong bài đọc có các từ vựng cốt lõi: 「だいがくへいきます」(đi đến trường đại học) và 「すしをたべます」(ăn sushi)."
        }
      ],
      listening: [
        {
          id: "n5-c1-l1-li1",
          scenario: "Lắng nghe hai người bạn nói về thú cưng và chiếc ô đi mưa.",
          transcript: "A: かわいいいぬとねこですね。\nB: はい、わたしのたいせつなかぞくです。\nA: あ、あめですね。かさがありますか。\nB: はい、かさをもっています。",
          translation: "A: Chú chó và chú mèo đáng yêu quá nhỉ.\nB: Vâng, đó là gia đình quý giá của tôi đấy.\nA: A, trời mưa rồi nhỉ. Bạn có ô không?\nB: Vâng, tôi có mang ô đây.",
          question: "Người nói B có mang theo đồ vật gì khi trời mưa?",
          options: ["Cái ô (かさ)", "Đôi giày (くつ)", "Bản đồ (ちず)", "Con bạch tuộc (たこ)"],
          correctAnswer: 0,
          explanation: "Người nói hỏi: 「かさがありますか」 và B trả lời: 「はい、かさをもっています」 (Tôi có mang ô)."
        }
      ],
      writingPractice: [
        {
          id: "n5-c1-l1-w1",
          prompt: "Viết từ 'con chó' bằng chữ Hiragana",
          reference: "いぬ"
        },
        {
          id: "n5-c1-l1-w2",
          prompt: "Viết từ 'con mèo' bằng chữ Hiragana",
          reference: "ねこ"
        },
        {
          id: "n5-c1-l1-w3",
          prompt: "Viết từ 'trường đại học' bằng chữ Hiragana (chú ý 2 chữ biến âm)",
          reference: "だいがく"
        }
      ]
    },

    // BÀI 2: Bảng chữ cái Hiragana (2)
    2: {
      title: "Bài 2: Bảng chữ cái Hiragana (2) / Lesson 2: Hiragana Alphabet (2)",
      vocabulary: [
        {
          id: "n5-c1-l2-v1",
          word: "ほん",
          furigana: "ほん",
          romaji: "hon",
          meaning: "Quyển sách / Book",
          example: "にほんごのほんです。",
          exampleMeaning: "Đây là sách tiếng Nhật. / It is a Japanese book."
        },
        {
          id: "n5-c1-l2-v2",
          word: "やま",
          furigana: "やま",
          romaji: "yama",
          meaning: "Ngọn núi / Mountain",
          example: "ふじさんはたかいやまです。",
          exampleMeaning: "Núi Phú Sĩ là ngọn núi cao. / Mt. Fuji is a tall mountain."
        },
        {
          id: "n5-c1-l2-v3",
          word: "さくら",
          furigana: "さくら",
          romaji: "sakura",
          meaning: "Hoa anh đào / Cherry blossom",
          example: "さくらのはながきれいです。",
          exampleMeaning: "Hoa anh đào rất đẹp. / Cherry blossoms are beautiful."
        },
        {
          id: "n5-c1-l2-v4",
          word: "わたし",
          furigana: "わたし",
          romaji: "watashi",
          meaning: "Tôi / I, me",
          example: "わたしはベトナムじんです。",
          exampleMeaning: "Tôi là người Việt Nam. / I am Vietnamese."
        },
        {
          id: "n5-c1-l2-v5",
          word: "がくせい",
          furigana: "がくせい",
          romaji: "gakusei",
          meaning: "Học sinh, sinh viên / Student",
          example: "だいがくのがくせいです。",
          exampleMeaning: "Tôi là sinh viên đại học. / I am a college student."
        },
        {
          id: "n5-c1-l2-v6",
          word: "きって",
          furigana: "きって",
          romaji: "kitte",
          meaning: "Con tem thư (âm ngắt) / Stamp",
          example: "きってをかいます。",
          exampleMeaning: "Tôi mua tem thư. / Buy a stamp."
        },
        {
          id: "n5-c1-l2-v7",
          word: "おかあさん",
          furigana: "おかあさん",
          romaji: "okaasan",
          meaning: "Mẹ (người khác hoặc gọi mẹ mình lịch sự, có trường âm) / Mother",
          example: "おかあさんはやさしいです。",
          exampleMeaning: "Mẹ rất hiền từ. / Mother is kind."
        },
        {
          id: "n5-c1-l2-v8",
          word: "おちゃ",
          furigana: "おちゃ",
          romaji: "ocha",
          meaning: "Trà xanh (ảo âm) / Green tea",
          example: "おちゃをのみます。",
          exampleMeaning: "Uống trà xanh. / Drink green tea."
        },
        {
          id: "n5-c1-l2-v9",
          word: "しんぶん",
          furigana: "しんぶん",
          romaji: "shinbun",
          meaning: "Tờ báo, báo chí / Newspaper",
          example: "まいあさ、しんぶんをよみます。",
          exampleMeaning: "Mỗi sáng tôi đều đọc báo. / I read newspaper every morning."
        },
        {
          id: "n5-c1-l2-v10",
          word: "にほん",
          furigana: "にほん",
          romaji: "nihon",
          meaning: "Nước Nhật, Nhật Bản / Japan",
          example: "にほんへいきます。",
          exampleMeaning: "Tôi đi đến Nhật Bản. / Go to Japan."
        }
      ],
      kanji: [
        {
          id: "n5-c1-l2-k1",
          kanji: "四",
          meaning: "Tứ (Số 4)",
          onyomi: "シ",
          kunyomi: "よ, よ.つ, よっ.つ, よん",
          strokes: 5,
          examples: [
            { word: "四つ", reading: "よっつ", meaning: "Bốn cái" },
            { word: "四月", reading: "しがつ", meaning: "Tháng Tư" }
          ]
        },
        {
          id: "n5-c1-l2-k2",
          kanji: "五",
          meaning: "Ngũ (Số 5)",
          onyomi: "ゴ",
          kunyomi: "いつ, いつ.つ",
          strokes: 4,
          examples: [
            { word: "五つ", reading: "いつつ", meaning: "Năm cái" },
            { word: "五人", reading: "ごにん", meaning: "Năm người" }
          ]
        },
        {
          id: "n5-c1-l2-k3",
          kanji: "六",
          meaning: "Lục (Số 6)",
          onyomi: "ロク",
          kunyomi: "む, む.つ, むっ.つ",
          strokes: 4,
          examples: [
            { word: "六つ", reading: "むっつ", meaning: "Sáu cái" },
            { word: "六月", reading: "ろくがつ", meaning: "Tháng Sáu" }
          ]
        }
      ],
      practiceQuiz: [
        {
          id: "n5-c1-l2-pq1",
          category: "reading",
          categoryLabel: "Phát hiện âm ngắt (促音)",
          question: "Từ 「きって」 có chứa chữ cái nào được phát âm ngắt một phách?",
          options: ["っ (tsu nhỏ)", "き (ki)", "て (te)", "không có âm ngắt"],
          correctAnswer: 0,
          explanation: "Chữ 「っ」 viết nhỏ gọi là âm ngắt (Sokuon), làm ngừng hơi 1 nhịp và nhân đôi phụ âm sau (kitte).",
          variations: []
        },
        {
          id: "n5-c1-l2-pq2",
          category: "reading",
          categoryLabel: "Trường âm Hiragana",
          question: "Từ 「おかあさん」 có chứa trường âm ở chữ cái nào?",
          options: ["あ (kéo dài âm 'ka' thành 'kaa')", "お", "さ", "ん"],
          correctAnswer: 0,
          explanation: "Chữ 「あ」 đứng sau 「か」 tạo thành trường âm dài 2 phách: kaa.",
          variations: []
        },
        {
          id: "n5-c1-l2-pq3",
          category: "kanji",
          categoryLabel: "Chữ Hán cơ bản",
          question: "Chữ Hán 「五」 có nghĩa là gì?",
          options: ["Số 5 (Ngũ)", "Số 4 (Tứ)", "Số 6 (Lục)", "Số 7 (Thất)"],
          correctAnswer: 0,
          explanation: "Chữ Hán 「五」 là chữ Ngũ, nghĩa là số 5.",
          variations: []
        }
      ],
      grammar: [
        {
          id: "n5-c1-l2-g1",
          pattern: "Âm đục (濁音 - Dakuon) và Âm bán đục (半濁音 - Handakuon)",
          meaning: "Biến đổi phụ âm với dấu Tenten 「゛」 và dấu Maru 「゜」",
          formula: "K -> G, S -> Z, T -> D, H -> B, H -> P",
          explanation: "Thêm 2 dấu phẩy nhỏ 「゛」 biến hàng Ka thành Ga (が ぎ ぐ げ ご), Sa thành Za (ざ じ ず ぜ ぞ), Ta thành Da (だ ぢ づ で ど), Ha thành Ba (ば び ぶ べ ぼ). Thêm vòng tròn nhỏ 「゜」 biến Ha thành Pa (ぱ ぴ ぷ ぺ ぽ).",
          examples: [
            {
              japanese: "がくせい (gakusei)",
              vietnamese: "Học sinh (hàng Ka biến thành Ga)"
            },
            {
              japanese: "しんぶん (shinbun)",
              vietnamese: "Tờ báo (chữ bu có dấu tenten)"
            }
          ]
        },
        {
          id: "n5-c1-l2-g2",
          pattern: "Âm ngắt (促音 - Sokuon: っ) và Trường âm (長音 - Chouon)",
          meaning: "Nguyên tắc kéo dài phách và ngừng nghỉ hơi chuẩn xác",
          formula: "Âm ngắt = っ (nhân đôi phụ âm sau), Trường âm = kéo dài 2 phách",
          explanation: "Âm ngắt chiếm 1 phách tĩnh lặng (きって kitte). Trường âm kéo dài nguyên âm đứng trước gấp đôi thời lượng phát âm thông thường.",
          examples: [
            {
              japanese: "きって (kitte)",
              vietnamese: "Con tem (có âm ngắt っ)"
            },
            {
              japanese: "おかあさん (okaasan)",
              vietnamese: "Mẹ (âm ka kéo dài 2 phách)"
            }
          ]
        },
        {
          id: "n5-c1-l2-g3",
          pattern: "Ảo âm / Âm ghép (拗音 - Yoon)",
          meaning: "Ghép cột i (ki, shi, chi, ni...) với ya, yu, yo nhỏ (ゃ, ゅ, ょ)",
          formula: "Cột [i] + ゃ / ゅ / ょ = 1 âm tiết duy nhất",
          explanation: "Khi phát âm ảo âm, ta phát âm gộp liền mạch thành 1 phách, không đọc tách rời thành 2 từ.",
          examples: [
            {
              japanese: "おちゃ (ocha)",
              vietnamese: "Nước trà (ghép chi + ya nhỏ thành cha)"
            },
            {
              japanese: "きょう (kyou)",
              vietnamese: "Hôm nay (ki + yo nhỏ + u = kyou)"
            }
          ]
        }
      ],
      grammarQuiz: [
        {
          id: "n5-c1-l2-gq1",
          category: "grammar",
          categoryLabel: "Biến âm Tenten",
          question: "Khi thêm dấu 「゛」 vào chữ 「は」, chữ cái này sẽ biến thành âm gì?",
          options: ["ば (ba)", "ぱ (pa)", "だ (da)", "ざ (za)"],
          correctAnswer: 0,
          explanation: "Thêm 「゛」 vào hàng Ha sẽ biến thành hàng Ba (は -> ば).",
          variations: []
        },
        {
          id: "n5-c1-l2-gq2",
          category: "grammar",
          categoryLabel: "Biến âm Maru",
          question: "Dấu tròn nhỏ 「゜」 biến chữ 「へ」 thành âm gì?",
          options: ["ぺ (pe)", "べ (be)", "げ (ge)", "ぜ (ze)"],
          correctAnswer: 0,
          explanation: "Dấu tròn nhỏ 「゜」 (Maru) tạo thành âm bán đục hàng P (へ -> ぺ).",
          variations: []
        }
      ],
      reading: [
        {
          id: "n5-c1-l2-r1",
          passage: "わたしはにほんのがくせいです。まいあさおちゃをのみます。そして、にほんごのほんとしんぶんをよみます。",
          translation: "Tôi là một học sinh tại Nhật Bản. Mỗi sáng tôi đều uống trà xanh. Và tôi đọc sách cũng như báo tiếng Nhật.",
          question: "Mỗi sáng người này thường uống gì?",
          options: ["Trà xanh (おちゃ)", "Nước ngọt", "Cà phê", "Sữa tươi"],
          correctAnswer: 0,
          explanation: "Trong bài có câu: 「まいあさおちゃをのみます」 (Mỗi sáng uống trà xanh)."
        }
      ],
      listening: [
        {
          id: "n5-c1-l2-li1",
          scenario: "Nghe hai người bạn nói chuyện về việc mua sách và tem thư.",
          transcript: "A: どこへいきますか。\nB: ゆうびんきょくへいきます。きってをかいます。ほんもかいます。\nA: そうですか。いってらっしゃい。",
          translation: "A: Bạn đang đi đâu thế?\nB: Mình đi bưu điện. Mình mua tem thư, và cũng mua cả sách nữa.\nA: Thế à. Đi cẩn thận nhé!",
          question: "Người B đi mua những món đồ nào?",
          options: ["Tem thư và sách (きって、ほん)", "Chỉ mua hoa anh đào", "Báo chí và trà", "Chó và mèo"],
          correctAnswer: 0,
          explanation: "Người B nói: 「きってをかいます。ほんもかいます」 (Mua tem thư và sách)."
        }
      ],
      writingPractice: [
        {
          id: "n5-c1-l2-w1",
          prompt: "Viết từ 'nước Nhật Bản' bằng chữ Hiragana",
          reference: "にほん"
        },
        {
          id: "n5-c1-l2-w2",
          prompt: "Viết từ 'học sinh' bằng chữ Hiragana",
          reference: "がくせい"
        }
      ]
    },

    // BÀI 3: Bảng chữ cái Katakana (1)
    3: {
      title: "Bài 3: Bảng chữ cái Katakana (1) / Lesson 3: Katakana Alphabet (1)",
      vocabulary: [
        {
          id: "n5-c1-l3-v1",
          word: "アイス",
          furigana: "アイス",
          romaji: "aisu",
          meaning: "Kem (món kem) / Ice cream",
          example: "つめたいアイスをたべます。",
          exampleMeaning: "Tôi ăn món kem mát lạnh. / Eat cold ice cream."
        },
        {
          id: "n5-c1-l3-v2",
          word: "ケーキ",
          furigana: "ケーキ",
          romaji: "keeki",
          meaning: "Bánh ngọt / Cake",
          example: "たんじょうびのケーキです。",
          exampleMeaning: "Bánh ngọt sinh nhật. / Birthday cake."
        },
        {
          id: "n5-c1-l3-v3",
          word: "テスト",
          furigana: "テスト",
          romaji: "tesuto",
          meaning: "Bài kiểm tra, thi cử / Test, exam",
          example: "あした、にほんごのテストがあります。",
          exampleMeaning: "Ngày mai có bài kiểm tra tiếng Nhật. / Tomorrow there is a Japanese test."
        },
        {
          id: "n5-c1-l3-v4",
          word: "タクシー",
          furigana: "タクシー",
          romaji: "takushii",
          meaning: "Xe tắc-xi / Taxi",
          example: "タクシーでいきます。",
          exampleMeaning: "Tôi đi bằng xe taxi. / Go by taxi."
        },
        {
          id: "n5-c1-l3-v5",
          word: "スキー",
          furigana: "スキー",
          romaji: "sukii",
          meaning: "Môn trượt tuyết / Skiing",
          example: "ふゆにスキーをします。",
          exampleMeaning: "Tôi trượt tuyết vào mùa đông. / Go skiing in winter."
        },
        {
          id: "n5-c1-l3-v6",
          word: "ナイフ",
          furigana: "ナイフ",
          romaji: "naifu",
          meaning: "Con dao / Knife",
          example: "ナイフで切ります。",
          exampleMeaning: "Cắt bằng dao. / Cut with a knife."
        },
        {
          id: "n5-c1-l3-v7",
          word: "ネクタイ",
          furigana: "ネクタイ",
          romaji: "nekutai",
          meaning: "Cà vạt / Necktie",
          example: "あおいネクタイをしめます。",
          exampleMeaning: "Thắt chiếc cà vạt màu xanh. / Wear a blue tie."
        },
        {
          id: "n5-c1-l3-v8",
          word: "クラス",
          furigana: "クラス",
          romaji: "kurasu",
          meaning: "Lớp học / Class",
          example: "わたしのクラスはたのしいです。",
          exampleMeaning: "Lớp học của tôi rất vui. / My class is fun."
        },
        {
          id: "n5-c1-l3-v9",
          word: "カレー",
          furigana: "カレー",
          romaji: "karee",
          meaning: "Món cơm cà ri / Curry",
          example: "おいしいカレーをたべます。",
          exampleMeaning: "Ăn món cà ri ngon miệng. / Eat delicious curry."
        },
        {
          id: "n5-c1-l3-v10",
          word: "スープ",
          furigana: "スープ",
          romaji: "suupu",
          meaning: "Món súp, canh / Soup",
          example: "あたたかいスープです。",
          exampleMeaning: "Món súp ấm nóng. / Warm soup."
        }
      ],
      kanji: [
        {
          id: "n5-c1-l3-k1",
          kanji: "七",
          meaning: "Thất (Số 7)",
          onyomi: "シチ",
          kunyomi: "なな, なな.つ, なの",
          strokes: 2,
          examples: [
            { word: "七つ", reading: "ななつ", meaning: "Bảy cái" },
            { word: "七月", reading: "しちがつ", meaning: "Tháng Bảy" }
          ]
        },
        {
          id: "n5-c1-l3-k2",
          kanji: "八",
          meaning: "Bát (Số 8)",
          onyomi: "ハチ",
          kunyomi: "や, や.つ, やっ.つ, よう",
          strokes: 2,
          examples: [
            { word: "八つ", reading: "やっつ", meaning: "Tám cái" },
            { word: "八月", reading: "はちがつ", meaning: "Tháng Tám" }
          ]
        },
        {
          id: "n5-c1-l3-k3",
          kanji: "九",
          meaning: "Cửu (Số 9)",
          onyomi: "キュウ, ク",
          kunyomi: "ここの, ここの.つ",
          strokes: 2,
          examples: [
            { word: "九つ", reading: "ここのつ", meaning: "Chín cái" },
            { word: "九月", reading: "くがつ", meaning: "Tháng Chín" }
          ]
        },
        {
          id: "n5-c1-l3-k4",
          kanji: "十",
          meaning: "Thập (Số 10)",
          onyomi: "ジュウ, ジッ",
          kunyomi: "とお, と",
          strokes: 2,
          examples: [
            { word: "十", reading: "とお", meaning: "Mười cái" },
            { word: "十月", reading: "じゅうがつ", meaning: "Tháng Mười" }
          ]
        }
      ],
      practiceQuiz: [
        {
          id: "n5-c1-l3-pq1",
          category: "reading",
          categoryLabel: "Nhận diện chữ Katakana",
          question: "Dấu gạch ngang 「ー」 trong từ 「ケーキ」 (keeki) biểu thị điều gì?",
          options: ["Trường âm (kéo dài âm 'ke')", "Dấu cách từ", "Dấu gạch nối", "Dấu kết thúc câu"],
          correctAnswer: 0,
          explanation: "Trong bảng Katakana, dấu gạch ngang 「ー」 được dùng đặc thù để kéo dài âm (trường âm).",
          variations: []
        },
        {
          id: "n5-c1-l3-pq2",
          category: "reading",
          categoryLabel: "Từ mượn Katakana",
          question: "Từ Katakana 「テスト」 xuất phát từ từ vựng tiếng Anh nào?",
          options: ["Test (bài thi)", "Text (văn bản)", "Taste (hương vị)", "Toast (bánh mì nướng)"],
          correctAnswer: 0,
          explanation: "「テスト」 bắt nguồn từ từ 'Test' trong tiếng Anh.",
          variations: []
        },
        {
          id: "n5-c1-l3-pq3",
          category: "kanji",
          categoryLabel: "Chữ Hán cơ bản",
          question: "Chữ Hán 「十」 có mấy nét viết và mang ý nghĩa gì?",
          options: ["2 nét, nghĩa là số 10", "1 nét, nghĩa là số 1", "3 nét, nghĩa là số 3", "4 nét, nghĩa là số 4"],
          correctAnswer: 0,
          explanation: "Chữ 「十」 có 2 nét (nét ngang trước, nét dọc sau), nghĩa là số 10 (Thập).",
          variations: []
        }
      ],
      grammar: [
        {
          id: "n5-c1-l3-g1",
          pattern: "Vai trò của Katakana trong tiếng Nhật hiện đại",
          meaning: "Dùng để biểu thị từ mượn tiếng nước ngoài, tên riêng quốc tế và từ nhấn mạnh",
          formula: "Từ ngoại lai + Tên nước ngoài + Thuật ngữ kỹ thuật = Chữ Katakana",
          explanation: "Katakana có nét thẳng, góc cạnh, dứt khoát. Người Nhật dùng Katakana để phiên âm tiếng Anh, tiếng Pháp, tên quốc gia (như ベトナム Vietnam) và tên người nước ngoài.",
          examples: [
            {
              japanese: "タクシー (takushii)",
              vietnamese: "Xe taxi (từ mượn tiếng Anh)"
            },
            {
              japanese: "クラス (kurasu)",
              vietnamese: "Lớp học (từ 'class')"
            }
          ]
        },
        {
          id: "n5-c1-l3-g2",
          pattern: "Quy tắc trường âm trong Katakana: Dấu gạch nối 「ー」",
          meaning: "Bất kể nguyên âm nào, kéo dài đều dùng ký hiệu 「ー」",
          formula: "Chữ Katakana + ー = Kéo dài 2 phách",
          explanation: "Khác với Hiragana phải dùng thêm nguyên âm (あ, い, う, え, お), bảng Katakana chỉ cần thêm dấu gạch dài nằm ngang 「ー」 để biểu thị trường âm.",
          examples: [
            {
              japanese: "ケーキ (keeki)",
              vietnamese: "Bánh ngọt (ke kéo dài thành kee)"
            },
            {
              japanese: "スキー (sukii)",
              vietnamese: "Trượt tuyết (ki kéo dài thành kii)"
            }
          ]
        }
      ],
      grammarQuiz: [
        {
          id: "n5-c1-l3-gq1",
          category: "grammar",
          categoryLabel: "Sử dụng Katakana",
          question: "Tên người nước ngoài và từ mượn ngoại lai trong tiếng Nhật thường được viết bằng bảng chữ nào?",
          options: ["Katakana", "Hiragana", "Chữ Hán Kanji", "Chữ Romaji"],
          correctAnswer: 0,
          explanation: "Bảng chữ cái Katakana được chuyên dùng cho từ ngoại lai và tên riêng nước ngoài.",
          variations: []
        }
      ],
      reading: [
        {
          id: "n5-c1-l3-r1",
          passage: "きょうはクラスのともだちのたんじょうびです。みんなでケーキとアイスをたべます。カレーもおいしいです。",
          translation: "Hôm nay là sinh nhật của bạn cùng lớp. Mọi người cùng nhau ăn bánh ngọt và kem. Món cơm cà ri cũng rất ngon.",
          question: "Mọi người cùng nhau ăn những món gì trong tiệc sinh nhật?",
          options: ["Bánh ngọt, kem và cà ri (ケーキ、アイス、カレー)", "Chỉ ăn sushi", "Uống trà xanh và ăn bánh mì", "Đi taxi về nhà"],
          correctAnswer: 0,
          explanation: "Trong bài đọc có nhắc đến: ケーキ (bánh ngọt), アイス (kem) và カレー (cà ri)."
        }
      ],
      listening: [
        {
          id: "n5-c1-l3-li1",
          scenario: "Nghe hai người bạn bàn luận về bài kiểm tra ngày mai.",
          transcript: "A: あしたはテストがありますか。\nB: はい、にほんごのテストがありますよ。\nA: がんばりましょう！",
          translation: "A: Ngày mai có bài kiểm tra không vậy?\nB: Có đấy, có bài kiểm tra tiếng Nhật đấy.\nA: Cùng cố gắng nhé!",
          question: "Ngày mai hai bạn có việc gì?",
          options: ["Bài kiểm tra tiếng Nhật (テスト)", "Đi trượt tuyết", "Đi ăn kem", "Mua cà vạt"],
          correctAnswer: 0,
          explanation: "Nhân vật nhắc đến: 「にほんごのテストがありますよ」 (Có bài kiểm tra tiếng Nhật)."
        }
      ],
      writingPractice: [
        {
          id: "n5-c1-l3-w1",
          prompt: "Viết từ 'bánh ngọt' bằng chữ Katakana",
          reference: "ケーキ"
        },
        {
          id: "n5-c1-l3-w2",
          prompt: "Viết từ 'bài kiểm tra' bằng chữ Katakana",
          reference: "テスト"
        }
      ]
    },

    // BÀI 4: Bảng chữ cái Katakana (2)
    4: {
      title: "Bài 4: Bảng chữ cái Katakana (2) / Lesson 4: Katakana Alphabet (2)",
      vocabulary: [
        {
          id: "n5-c1-l4-v1",
          word: "ホテル",
          furigana: "ホテル",
          romaji: "hoteru",
          meaning: "Khách sạn / Hotel",
          example: "ホテルにとまります。",
          exampleMeaning: "Trọ lại tại khách sạn. / Stay at a hotel."
        },
        {
          id: "n5-c1-l4-v2",
          word: "パン",
          furigana: "パン",
          romaji: "pan",
          meaning: "Bánh mì / Bread",
          example: "あさ、パンをたべます。",
          exampleMeaning: "Buổi sáng tôi ăn bánh mì. / Eat bread in the morning."
        },
        {
          id: "n5-c1-l4-v3",
          word: "コーヒー",
          furigana: "コーヒー",
          romaji: "koohii",
          meaning: "Cà phê / Coffee",
          example: "あたたかいコーヒーをのみます。",
          exampleMeaning: "Uống cà phê nóng. / Drink hot coffee."
        },
        {
          id: "n5-c1-l4-v4",
          word: "カメラ",
          furigana: "カメラ",
          romaji: "kamera",
          meaning: "Máy ảnh, máy chụp hình / Camera",
          example: "あたらしいカメラをかいました。",
          exampleMeaning: "Tôi đã mua máy ảnh mới. / Bought a new camera."
        },
        {
          id: "n5-c1-l4-v5",
          word: "テレビ",
          furigana: "テレビ",
          romaji: "terebi",
          meaning: "Chiếc tivi / Television",
          example: "テレビをみます。",
          exampleMeaning: "Xem truyền hình tivi. / Watch television."
        },
        {
          id: "n5-c1-l4-v6",
          word: "レストラン",
          furigana: "レストラン",
          romaji: "resutoran",
          meaning: "Nhà hàng ăn uống / Restaurant",
          example: "レストランでごはんをたべます。",
          exampleMeaning: "Ăn cơm ở nhà hàng. / Eat at a restaurant."
        },
        {
          id: "n5-c1-l4-v7",
          word: "ベトナム",
          furigana: "ベトナム",
          romaji: "betonamu",
          meaning: "Nước Việt Nam / Vietnam",
          example: "わたしはベトナムからきました。",
          exampleMeaning: "Tôi đến từ Việt Nam. / I come from Vietnam."
        },
        {
          id: "n5-c1-l4-v8",
          word: "トイレ",
          furigana: "トイレ",
          romaji: "toire",
          meaning: "Nhà vệ sinh, phòng vệ sinh / Toilet, restroom",
          example: "トイレはどこですか。",
          exampleMeaning: "Nhà vệ sinh ở đâu ạ? / Where is the restroom?"
        },
        {
          id: "n5-c1-l4-v9",
          word: "スマホ",
          furigana: "スマホ",
          romaji: "sumaho",
          meaning: "Điện thoại thông minh (từ viết tắt của スマートフォン) / Smartphone",
          example: "スマホでしゃしんをとります。",
          exampleMeaning: "Chụp ảnh bằng điện thoại thông minh. / Take photos with smartphone."
        },
        {
          id: "n5-c1-l4-v10",
          word: "パソコン",
          furigana: "パソコン",
          romaji: "pasokon",
          meaning: "Máy tính cá nhân (từ viết tắt của パーソナルコンピューター) / PC, Laptop",
          example: "パソコンでべんきょうします。",
          exampleMeaning: "Học tập bằng máy tính cá nhân. / Study using a PC."
        }
      ],
      kanji: [
        {
          id: "n5-c1-l4-k1",
          kanji: "日",
          meaning: "Nhật (Ngày, mặt trời)",
          onyomi: "ニチ, ジツ",
          kunyomi: "ひ, -び, -か",
          strokes: 4,
          examples: [
            { word: "日本", reading: "にほん", meaning: "Nhật Bản" },
            { word: "日曜日", reading: "にちようび", meaning: "Chủ Nhật" }
          ]
        },
        {
          id: "n5-c1-l4-k2",
          kanji: "月",
          meaning: "Nguyệt (Tháng, mặt trăng)",
          onyomi: "ゲツ, ガツ",
          kunyomi: "つき",
          strokes: 4,
          examples: [
            { word: "月曜日", reading: "げつようび", meaning: "Thứ Hai" },
            { word: "一月", reading: "いちがつ", meaning: "Tháng Một" }
          ]
        },
        {
          id: "n5-c1-l4-k3",
          kanji: "木",
          meaning: "Mộc (Cây cối, gỗ)",
          onyomi: "ボク, モク",
          kunyomi: "き, こ-",
          strokes: 4,
          examples: [
            { word: "木曜日", reading: "もくようび", meaning: "Thứ Năm" },
            { word: "木", reading: "き", meaning: "Cây xanh" }
          ]
        }
      ],
      practiceQuiz: [
        {
          id: "n5-c1-l4-pq1",
          category: "reading",
          categoryLabel: "Phân biệt chữ Katakana dễ lẫn",
          question: "Chữ Katakana 「シ」 (shi) và 「ツ」 (tsu) khác nhau ở điểm cốt lõi nào?",
          options: [
            "シ nét chính vuốt chéo từ dưới lên, ツ nét chính vuốt chéo từ trên xuống",
            "シ có 2 nét, ツ có 4 nét",
            "Hai chữ này hoàn toàn giống nhau",
            "シ dùng cho Hiragana, ツ dùng cho Katakana"
          ],
          correctAnswer: 0,
          explanation: "Chữ シ (shi) có nét dài vuốt ngược từ dưới lên; còn ツ (tsu) nét dài chém từ trên xuống dưới.",
          variations: []
        },
        {
          id: "n5-c1-l4-pq2",
          category: "reading",
          categoryLabel: "Phân biệt ソ (so) và ン (n)",
          question: "Chữ 「ン」 (âm n) có hướng đi của nét cuối như thế nào?",
          options: [
            "Vuốt từ dưới lên trên",
            "Vuốt từ trên xuống dưới",
            "Kéo thẳng từ trái sang phải",
            "Vẽ thành một vòng tròn"
          ],
          correctAnswer: 0,
          explanation: "Chữ ン (n) nét sau đánh từ dưới vát chếch lên trên, ngược lại chữ ソ (so) nét sau chém từ trên dốc xuống.",
          variations: []
        }
      ],
      grammar: [
        {
          id: "n5-c1-l4-g1",
          pattern: "Mẹo phân biệt các cặp chữ Katakana dễ gây nhầm lẫn nhất",
          meaning: "シ (shi) vs ツ (tsu) và ソ (so) vs ン (n)",
          formula: "シ và ン: Vuốt từ DƯỚI LÊN; ツ và ソ: Đánh từ TRÊN XUỐNG",
          explanation: "Hãy tưởng tượng chữ シ như mắt đang mở to ngước nhìn lên trên, còn chữ ツ như mắt cụp xuống. Ghi nhớ hướng bút sẽ giúp bạn không bao giờ đọc sai khi thi JLPT.",
          examples: [
            {
              japanese: "シャツ (shatsu)",
              vietnamese: "Áo sơ mi (gồm sha + tsu nhỏ + tsu lớn)"
            },
            {
              japanese: "パン (pan)",
              vietnamese: "Bánh mì (chữ pa + chữ n vuốt từ dưới lên)"
            }
          ]
        },
        {
          id: "n5-c1-l4-g2",
          pattern: "Quy tắc phiên âm tên người và tên địa danh sang Katakana",
          meaning: "Dùng các âm tiết tương đồng gần nhất để biểu đạt",
          formula: "Tên Việt Nam -> Bảng âm Katakana",
          explanation: "Ví dụ: 'Việt Nam' được phiên âm là ベトナム (Betonamu), tên 'Nam' là ナム (Namu), tên 'Linh' là リン (Rin).",
          examples: [
            {
              japanese: "ベトナム (Betonamu)",
              vietnamese: "Việt Nam"
            },
            {
              japanese: "ハノイ (Hanoi)",
              vietnamese: "Hà Nội"
            }
          ]
        }
      ],
      grammarQuiz: [
        {
          id: "n5-c1-l4-gq1",
          category: "grammar",
          categoryLabel: "Chữ viết tắt Katakana",
          question: "Từ 「パソコン」 trong tiếng Nhật là cách gọi viết tắt của từ gì?",
          options: [
            "Personal Computer (Máy tính cá nhân)",
            "Passcode (Mã bảo mật)",
            "Package Contact (Gói liên hệ)",
            "Pasta Cooking (Nấu mì Ý)"
          ],
          correctAnswer: 0,
          explanation: "「パソコン」 là từ viết tắt của 'Personal Computer' (パーソナルコンピューター).",
          variations: []
        }
      ],
      reading: [
        {
          id: "n5-c1-l4-r1",
          passage: "わたしはベトナムじんです。にほんのホテルでしごとをします。まいにちパソコンとスマホをよくつかいます。やすみのひはレストランでコーヒーをのみます。",
          translation: "Tôi là người Việt Nam. Tôi làm việc tại một khách sạn ở Nhật Bản. Hàng ngày tôi dùng máy tính và điện thoại thông minh rất nhiều. Vào ngày nghỉ, tôi đến nhà hàng uống cà phê.",
          question: "Người này làm việc ở đâu?",
          options: ["Khách sạn ở Nhật (ホテル)", "Bệnh viện", "Trường học", "Sân bay"],
          correctAnswer: 0,
          explanation: "Trong câu: 「にほんのホテルでしごとをします」 (Làm việc tại khách sạn ở Nhật)."
        }
      ],
      listening: [
        {
          id: "n5-c1-l4-li1",
          scenario: "Một vị khách hỏi vị trí nhà vệ sinh ở nhà hàng.",
          transcript: "Khách: すみません、トイレはどこですか。\nNhân viên: あちらでございます。カメラのとなりにあります。\nKhách: ありがとうございます。",
          translation: "Khách: Xin lỗi, nhà vệ sinh ở đâu vậy ạ?\nNhân viên: Ở phía đằng kia ạ. Ở bên cạnh quầy máy ảnh.\nKhách: Cảm ơn bạn.",
          question: "Vị khách đang muốn tìm nơi nào?",
          options: ["Nhà vệ sinh (トイレ)", "Cửa hàng bánh mì", "Quán cà phê", "Khách sạn"],
          correctAnswer: 0,
          explanation: "Khách hỏi: 「すみません、トイレはどこですか」 (Xin hỏi nhà vệ sinh ở đâu)."
        }
      ],
      writingPractice: [
        {
          id: "n5-c1-l4-w1",
          prompt: "Viết từ 'Việt Nam' bằng chữ Katakana",
          reference: "ベトナム"
        },
        {
          id: "n5-c1-l4-w2",
          prompt: "Viết từ 'cà phê' bằng chữ Katakana",
          reference: "コーヒー"
        }
      ]
    },

    // BÀI 5: Số đếm (1)
    5: {
      title: "Bài 5: Số đếm (1) / Lesson 5: Numbers & Counting (1)",
      vocabulary: [
        {
          id: "n5-c1-l5-v1",
          word: "ぜろ / れい",
          furigana: "ぜろ / れい",
          romaji: "zero / rei",
          meaning: "Số 0 / Zero",
          example: "ぜろから１０までかぞえます。",
          exampleMeaning: "Đếm từ 0 đến 10. / Count from 0 to 10."
        },
        {
          id: "n5-c1-l5-v2",
          word: "いち",
          furigana: "いち",
          romaji: "ichi",
          meaning: "Số 1 / One",
          example: "１ばんです。",
          exampleMeaning: "Là số 1 / hạng nhất. / Number 1."
        },
        {
          id: "n5-c1-l5-v3",
          word: "に",
          furigana: "に",
          romaji: "ni",
          meaning: "Số 2 / Two",
          example: "２がつです。",
          exampleMeaning: "Là tháng 2. / It is February."
        },
        {
          id: "n5-c1-l5-v4",
          word: "さん",
          furigana: "さん",
          romaji: "san",
          meaning: "Số 3 / Three",
          example: "３じです。",
          exampleMeaning: "Bây giờ là 3 giờ. / It is 3 o'clock."
        },
        {
          id: "n5-c1-l5-v5",
          word: "よん / し",
          furigana: "よん / し",
          romaji: "yon / shi",
          meaning: "Số 4 (thường đọc là 'yon') / Four",
          example: "４さいです。",
          exampleMeaning: "4 tuổi. / Four years old."
        },
        {
          id: "n5-c1-l5-v6",
          word: "ご",
          furigana: "ご",
          romaji: "go",
          meaning: "Số 5 / Five",
          example: "５がつ５にち。",
          exampleMeaning: "Ngày 5 tháng 5. / May 5th."
        },
        {
          id: "n5-c1-l5-v7",
          word: "ろく",
          furigana: "ろく",
          romaji: "roku",
          meaning: "Số 6 / Six",
          example: "６じかんべんきょうします。",
          exampleMeaning: "Tôi học 6 tiếng đồng hồ. / Study for 6 hours."
        },
        {
          id: "n5-c1-l5-v8",
          word: "なな / しち",
          furigana: "なな / しち",
          romaji: "nana / shichi",
          meaning: "Số 7 / Seven",
          example: "７がつはあついです。",
          exampleMeaning: "Tháng 7 trời rất nóng. / July is hot."
        },
        {
          id: "n5-c1-l5-v9",
          word: "はち",
          furigana: "はち",
          romaji: "hachi",
          meaning: "Số 8 / Eight",
          example: "８がつにしけんがあります。",
          exampleMeaning: "Tháng 8 có kỳ thi. / Exam in August."
        },
        {
          id: "n5-c1-l5-v10",
          word: "きゅう / く",
          furigana: "きゅう / く",
          romaji: "kyuu / ku",
          meaning: "Số 9 / Nine",
          example: "９じにはじまります。",
          exampleMeaning: "Bắt đầu lúc 9 giờ. / Starts at 9."
        },
        {
          id: "n5-c1-l5-v11",
          word: "じゅう",
          furigana: "じゅう",
          romaji: "juu",
          meaning: "Số 10 / Ten",
          example: "１０にんいます。",
          exampleMeaning: "Có 10 người. / There are 10 people."
        },
        {
          id: "n5-c1-l5-v12",
          word: "でんわばんごう",
          furigana: "でんわばんごう",
          romaji: "denwabangou",
          meaning: "Số điện thoại / Phone number",
          example: "でんわばんごうはおいくつですか。",
          exampleMeaning: "Số điện thoại của bạn là số mấy? / What is your phone number?"
        },
        {
          id: "n5-c1-l5-v13",
          word: "〜さい",
          furigana: "〜さい",
          romaji: "~sai",
          meaning: "〜 tuổi (hậu tố đếm tuổi tác) / ~ years old",
          example: "わたしは２０さいです。",
          exampleMeaning: "Tôi 20 tuổi. / I am 20 years old."
        },
        {
          id: "n5-c1-l5-v14",
          word: "なんさい / おいくつ",
          furigana: "なんさい / おいくつ",
          romaji: "nansai / oikutsu",
          meaning: "Bao nhiêu tuổi (oikutsu lịch sự hơn) / How old",
          example: "おいくつですか。",
          exampleMeaning: "Bạn bao nhiêu tuổi ạ? / How old are you?"
        }
      ],
      kanji: [
        {
          id: "n5-c1-l5-k1",
          kanji: "年",
          meaning: "Niên (Năm, tuổi)",
          onyomi: "ネン",
          kunyomi: "とし",
          strokes: 6,
          examples: [
            { word: "今年", reading: "ことし", meaning: "Năm nay" },
            { word: "来年", reading: "らいねん", meaning: "Năm sau" }
          ]
        },
        {
          id: "n5-c1-l5-k2",
          kanji: "人",
          meaning: "Nhân (Người)",
          onyomi: "ジン, ニン",
          kunyomi: "ひと",
          strokes: 2,
          examples: [
            { word: "日本人", reading: "にほんじん", meaning: "Người Nhật Bản" },
            { word: "ベトナム人", reading: "ベトナムじん", meaning: "Người Việt Nam" }
          ]
        },
        {
          id: "n5-c1-l5-k3",
          kanji: "名",
          meaning: "Danh (Tên, danh tiếng)",
          onyomi: "メイ, ミョウ",
          kunyomi: "な",
          strokes: 6,
          examples: [
            { word: "名前", reading: "なまえ", meaning: "Tên họ" },
            { word: "有名", reading: "ゆうめい", meaning: "Nổi tiếng" }
          ]
        }
      ],
      practiceQuiz: [
        {
          id: "n5-c1-l5-pq1",
          category: "reading",
          categoryLabel: "Số đếm tiếng Nhật",
          question: "Số 25 trong tiếng Nhật được đọc chuẩn xác là gì?",
          options: ["にじゅうご (nijyuugo)", "にじゅうよん (nijyuuyon)", "さんじゅうご (sanjyuugo)", "いちじゅうご (ichijyuugo)"],
          correctAnswer: 0,
          explanation: "Số 25 gồm: に (2) + じゅう (10) + ご (5) = にじゅうご.",
          variations: []
        },
        {
          id: "n5-c1-l5-pq2",
          category: "grammar",
          categoryLabel: "Cách đọc tuổi đặc biệt",
          question: "Trong tiếng Nhật, '20 tuổi' có cách gọi đặc biệt nào sau đây?",
          options: ["はたち (hatachi)", "にじゅっさい (nijussai)", "にじゅうさい (nijuusai)", "にさい (nisai)"],
          correctAnswer: 0,
          explanation: "20 tuổi là cột mốc trưởng thành tại Nhật, có cách gọi đặc biệt riêng là 「はたち」 (không cần thêm chữ さい).",
          variations: []
        }
      ],
      grammar: [
        {
          id: "n5-c1-l5-g1",
          pattern: "Hệ thống số đếm từ 0 đến 99 trong tiếng Nhật",
          meaning: "Quy tắc ghép số thập phân cực kỳ logic và đồng nhất",
          formula: "[Số hàng chục] + じゅう + [Số hàng đơn vị]",
          explanation: "Muốn nói số hàng chục chỉ cần ghép số đơn vị với じゅう (10). Ví dụ: 30 = さんじゅう, 74 = ななじゅうよん, 99 = きゅうじゅうきゅう.",
          examples: [
            {
              japanese: "１５: じゅうご",
              vietnamese: "Số 15 (10 + 5)"
            },
            {
              japanese: "４８: よんじゅうはち",
              vietnamese: "Số 48 (40 + 8)"
            }
          ]
        },
        {
          id: "n5-c1-l5-g2",
          pattern: "Mẫu câu hỏi và trả lời số điện thoại",
          meaning: "Hỏi và đọc chuỗi số điện thoại, dấu gạch ngang nối đọc là 「の」",
          formula: "〜の電話番号は何番ですか。 -> [Dãy số] - の - [Dãy số] です。",
          explanation: "Khi đọc số điện thoại, dấu gạch nối giữa các khối số được phát âm là trợ từ 「の」 (no).",
          examples: [
            {
              japanese: "でんわばんごうは 090 の 1234 の 5678 です。",
              vietnamese: "Số điện thoại là: 090 - 1234 - 5678."
            }
          ]
        },
        {
          id: "n5-c1-l5-g3",
          pattern: "Mẫu câu hỏi và đếm tuổi tác (〜歳)",
          meaning: "Hỏi tuổi: 何歳（おいくつ）ですか。 Chú ý biến âm 1, 8, 10, 20 tuổi",
          formula: "[Số tuổi] + さい です。",
          explanation: "Các trường hợp biến âm bắt buộc: 1 tuổi = いっさい (issai), 8 tuổi = はっさい (hassai), 10 tuổi = じゅっさい (jussai), 20 tuổi = はたち (hatachi).",
          examples: [
            {
              japanese: "わたしは 18さい (じゅうはっさい) です。",
              vietnamese: "Tôi 18 tuổi."
            },
            {
              japanese: "たなかさんは はたち (20さい) です。",
              vietnamese: "Bạn Tanaka tròn 20 tuổi."
            }
          ]
        }
      ],
      grammarQuiz: [
        {
          id: "n5-c1-l5-gq1",
          category: "grammar",
          categoryLabel: "Đọc số điện thoại",
          question: "Dấu gạch nối '-' trong số điện thoại (ví dụ: 090-1234-5678) được người Nhật đọc là gì?",
          options: ["の (no)", "と (to)", "へ (e)", "から (kara)"],
          correctAnswer: 0,
          explanation: "Người Nhật luôn đọc dấu gạch nối '-' trong số điện thoại là trợ từ 「の」.",
          variations: []
        },
        {
          id: "n5-c1-l5-gq2",
          category: "grammar",
          categoryLabel: "Biến âm đếm tuổi",
          question: "'1 tuổi' và '8 tuổi' được phát âm có âm ngắt là gì?",
          options: ["いっさい (1 tuổi), はっさい (8 tuổi)", "いちさい, はちさい", "ひとつさい, やつさい", "いっさい, はちさい"],
          correctAnswer: 0,
          explanation: "1 tuổi biến âm thành 「いっさい」, 8 tuổi biến âm thành 「はっさい」.",
          variations: []
        }
      ],
      reading: [
        {
          id: "n5-c1-l5-r1",
          passage: "はじめまして。わたしはナムです。ベトナムからきました。ことし２１さいです。でんわばんごうは ０９０の３４５６の７８９０です。どうぞよろしくおねがいします。",
          translation: "Rất vui được làm quen. Tôi là Nam. Tôi đến từ Việt Nam. Năm nay tôi 21 tuổi. Số điện thoại của tôi là 090-3456-7890. Rất mong nhận được sự giúp đỡ của bạn.",
          question: "Bạn Nam năm nay bao nhiêu tuổi?",
          options: ["21 tuổi (にじゅういっさい)", "20 tuổi (はたち)", "18 tuổi (じゅうはっさい)", "30 tuổi (さんじゅっさい)"],
          correctAnswer: 0,
          explanation: "Trong bài đọc Nam giới thiệu: 「ことし２１さいです」 (Năm nay tôi 21 tuổi)."
        }
      ],
      listening: [
        {
          id: "n5-c1-l5-li1",
          scenario: "Hai người đang trao đổi số điện thoại liên lạc.",
          transcript: "A: すみません、でんわばんごうはなんばんですか。\nB: ０８０の１２３４の５６７８です。\nA: ０８０の１２３４の５６７８ですね。ありがとうございます。",
          translation: "A: Xin lỗi, số điện thoại của bạn là số mấy vậy?\nB: Là số 080-1234-5678.\nA: Là số 080-1234-5678 đúng không ạ. Cảm ơn bạn nhé.",
          question: "Bốn chữ số cuối cùng trong số điện thoại của người B là số mấy?",
          options: ["５６７８ (năm sáu bảy tám)", "１２３４ (một hai ba bốn)", "０８０ (không tám không)", "９９９９ (chín chín chín chín)"],
          correctAnswer: 0,
          explanation: "Bốn chữ số cuối được đọc rõ: 「５６７８」 (ご、ろく、なな、はち)."
        }
      ],
      writingPractice: [
        {
          id: "n5-c1-l5-w1",
          prompt: "Viết cách đọc số '10' bằng chữ Hiragana",
          reference: "じゅう"
        },
        {
          id: "n5-c1-l5-w2",
          prompt: "Viết cách gọi '20 tuổi' bằng chữ Hiragana",
          reference: "はたち"
        }
      ]
    },

    // BÀI 6: Số đếm (2)
    6: {
      title: "Bài 6: Số đếm (2) / Lesson 6: Numbers & Counting (2)",
      vocabulary: [
        {
          id: "n5-c1-l6-v1",
          word: "ひゃく",
          furigana: "ひゃく",
          romaji: "hyaku",
          meaning: "Số 100 (Một trăm) / Hundred",
          example: "１００えんです。",
          exampleMeaning: "Giá 100 Yên. / 100 Yen."
        },
        {
          id: "n5-c1-l6-v2",
          word: "せん",
          furigana: "せん",
          romaji: "sen",
          meaning: "Số 1.000 (Một nghìn) / Thousand",
          example: "１０００えんさつです。",
          exampleMeaning: "Tờ tiền 1.000 Yên. / 1,000 Yen bill."
        },
        {
          id: "n5-c1-l6-v3",
          word: "いちまん",
          furigana: "いちまん",
          romaji: "ichiman",
          meaning: "Số 10.000 (Một vạn) / Ten thousand",
          example: "１まんえんのくつです。",
          exampleMeaning: "Đôi giày trị giá 1 vạn Yên (10.000 Yên). / 10,000 Yen shoes."
        },
        {
          id: "n5-c1-l6-v4",
          word: "えん",
          furigana: "えん",
          romaji: "en",
          meaning: "Đồng Yên (tiền tệ Nhật Bản) / Yen",
          example: "これは５００えんです。",
          exampleMeaning: "Cái này có giá 500 Yên. / This is 500 Yen."
        },
        {
          id: "n5-c1-l6-v5",
          word: "いくら",
          furigana: "いくら",
          romaji: "ikura",
          meaning: "Bao nhiêu tiền / How much",
          example: "これはいくらですか。",
          exampleMeaning: "Cái này giá bao nhiêu tiền vậy ạ? / How much is this?"
        },
        {
          id: "n5-c1-l6-v6",
          word: "ひとつ",
          furigana: "ひとつ",
          romaji: "hitotsu",
          meaning: "1 cái (đếm đồ vật thuần Nhật) / One (item)",
          example: "りんごをひとつください。",
          exampleMeaning: "Xin cho tôi một quả táo. / One apple, please."
        },
        {
          id: "n5-c1-l6-v7",
          word: "ふたつ",
          furigana: "ふたつ",
          romaji: "futatsu",
          meaning: "2 cái (đếm đồ vật thuần Nhật) / Two (items)",
          example: "パンをふたつかいます。",
          exampleMeaning: "Tôi mua 2 cái bánh mì. / Buy two breads."
        },
        {
          id: "n5-c1-l6-v8",
          word: "みっつ",
          furigana: "みっつ",
          romaji: "mittsu",
          meaning: "3 cái / Three (items)",
          example: "みっつあります。",
          exampleMeaning: "Có 3 cái. / There are three."
        },
        {
          id: "n5-c1-l6-v9",
          word: "よっつ",
          furigana: "よっつ",
          romaji: "yottsu",
          meaning: "4 cái / Four (items)",
          example: "ケーキをよっつください。",
          exampleMeaning: "Xin cho tôi 4 cái bánh ngọt. / Four cakes, please."
        },
        {
          id: "n5-c1-l6-v10",
          word: "いつつ",
          furigana: "いつつ",
          romaji: "itsutsu",
          meaning: "5 cái / Five (items)",
          example: "いつつかいました。",
          exampleMeaning: "Tôi đã mua 5 cái. / Bought five."
        },
        {
          id: "n5-c1-l6-v11",
          word: "ひとり",
          furigana: "ひとり",
          romaji: "hitori",
          meaning: "1 người / One person",
          example: "ひとりでいきます。",
          exampleMeaning: "Tôi đi một mình. / Go alone."
        },
        {
          id: "n5-c1-l6-v12",
          word: "ふたり",
          furigana: "ふたり",
          romaji: "futari",
          meaning: "2 người / Two people",
          example: "ふたりでたべます。",
          exampleMeaning: "Hai người cùng ăn. / Two people eat together."
        },
        {
          id: "n5-c1-l6-v13",
          word: "さんにん",
          furigana: "さんにん",
          romaji: "sannin",
          meaning: "3 người / Three people",
          example: "ともだちがさんにんいます。",
          exampleMeaning: "Có 3 người bạn. / There are three friends."
        }
      ],
      kanji: [
        {
          id: "n5-c1-l6-k1",
          kanji: "百",
          meaning: "Bách (Trăm - 100)",
          onyomi: "ヒャク, ビャク, ピャク",
          kunyomi: "もも",
          strokes: 6,
          examples: [
            { word: "三百", reading: "さんびゃく", meaning: "300" },
            { word: "六百", reading: "ろっぴゃく", meaning: "600" },
            { word: "八百", reading: "はっぴゃく", meaning: "800" }
          ]
        },
        {
          id: "n5-c1-l6-k2",
          kanji: "千",
          meaning: "Thiên (Nghìn - 1.000)",
          onyomi: "セン, ゼン",
          kunyomi: "ち",
          strokes: 3,
          examples: [
            { word: "三千", reading: "さんぜん", meaning: "3.000" },
            { word: "八千", reading: "はっせん", meaning: "8.000" }
          ]
        },
        {
          id: "n5-c1-l6-k3",
          kanji: "万",
          meaning: "Vạn (Mười nghìn - 10.000)",
          onyomi: "マン, バン",
          kunyomi: "よろず",
          strokes: 3,
          examples: [
            { word: "一万", reading: "いちまん", meaning: "10.000 (1 vạn)" },
            { word: "十万", reading: "じゅうまん", meaning: "100.000 (10 vạn)" }
          ]
        },
        {
          id: "n5-c1-l6-k4",
          kanji: "円",
          meaning: "Yên (Đồng tiền Nhật Bản, hình tròn)",
          onyomi: "エン",
          kunyomi: "まる.い",
          strokes: 4,
          examples: [
            { word: "千円", reading: "せんえん", meaning: "1.000 Yên" },
            { word: "一万円", reading: "いちまんえん", meaning: "10.000 Yên" }
          ]
        }
      ],
      practiceQuiz: [
        {
          id: "n5-c1-l6-pq1",
          category: "reading",
          categoryLabel: "Biến âm hàng trăm",
          question: "Số '300' và '600' trong tiếng Nhật bị biến âm như thế nào?",
          options: [
            "300 là さんびゃく (sanbyaku), 600 là ろっぴゃく (roppyaku)",
            "300 là さんひゃく, 600 là ろくひゃく",
            "300 là さんぴゃく, 600 là ろっびゃく",
            "Không bị biến âm"
          ],
          correctAnswer: 0,
          explanation: "300 biến âm thành さんびゃく (dấu tenten), 600 biến âm ngắt thành ろっぴゃく (dấu maru).",
          variations: []
        },
        {
          id: "n5-c1-l6-pq2",
          category: "reading",
          categoryLabel: "Đơn vị Vạn (万)",
          question: "Số 50.000 Yên được người Nhật đếm theo đơn vị Vạn là gì?",
          options: ["ごまんえん (5 vạn Yên)", "ごじゅうせんえん", "ごひゃくえん", "ごまんじゅうえん"],
          correctAnswer: 0,
          explanation: "Người Nhật gom cụm 4 chữ số 0 thành đơn vị Vạn (万: まん). 50.000 Yên = 5 Vạn Yên = ごまんえん.",
          variations: []
        },
        {
          id: "n5-c1-l6-pq3",
          category: "grammar",
          categoryLabel: "Lượng từ thuần Nhật",
          question: "'Một cái bánh mì' và 'Hai cái bánh mì' dùng lượng từ thuần Nhật nào?",
          options: [
            "ひとつ (1 cái), ふたつ (2 cái)",
            "ひとり (1 người), ふたり (2 người)",
            "いちこ, にこ",
            "いっさい, にさい"
          ],
          correctAnswer: 0,
          explanation: "Lượng từ thuần Nhật đếm đồ vật thông dụng là: ひとつ (1 cái), ふたつ (2 cái), みっつ (3 cái)...",
          variations: []
        }
      ],
      grammar: [
        {
          id: "n5-c1-l6-g1",
          pattern: "Các trường hợp biến âm đặc biệt của Hàng Trăm (百) và Hàng Nghìn (千)",
          meaning: "Quy tắc ngữ âm bắt buộc phải thuộc lòng khi thi JLPT",
          formula: "300: さんびゃく, 600: ろっぴゃく, 800: はっぴゃく / 3000: さんぜん, 8000: はっせん",
          explanation: "Khi đọc số tiền và giá cả, biến âm này xuất hiện rất nhiều trong đời sống và các bài thi Nghe hiểu N5.",
          examples: [
            {
              japanese: "この本は 800円 (はっぴゃくえん) です。",
              vietnamese: "Quyển sách này có giá 800 Yên."
            },
            {
              japanese: "このカバンは 3000円 (さんぜんえん) です。",
              vietnamese: "Chiếc cặp này có giá 3.000 Yên."
            }
          ]
        },
        {
          id: "n5-c1-l6-g2",
          pattern: "Mẫu câu hỏi giá tiền: これ / それ / あれ はいくらですか。",
          meaning: "Hỏi giá của một món đồ và trả lời giá tiền bằng Yên (円)",
          formula: "[Đồ vật] は いくらですか。 -> [Số tiền] 円 です。",
          explanation: "Mẫu câu sinh hoạt giao tiếp cơ bản nhất khi đi siêu thị, cửa hàng tiện lợi tại Nhật Bản.",
          examples: [
            {
              japanese: "すみません、このパンはいくらですか。 - 150円 (ひゃくごじゅうえん) です。",
              vietnamese: "Xin lỗi, cái bánh mì này bao nhiêu tiền ạ? - Giá 150 Yên ạ."
            }
          ]
        },
        {
          id: "n5-c1-l6-g3",
          pattern: "Lượng từ đếm người đặc biệt: 1 người (ひとり) & 2 người (ふたり)",
          meaning: "Từ 3 người trở lên ghép số + にん (人)",
          formula: "1 người = ひとり, 2 người = ふたり, 3 người = さんにん, 4 người = よにん",
          explanation: "Lưu ý 4 người đọc là よにん (yonin), không đọc là yonnin hay shinin.",
          examples: [
            {
              japanese: "ふたりで レストランへ いきます。",
              vietnamese: "Hai người cùng nhau đi đến nhà hàng."
            }
          ]
        }
      ],
      grammarQuiz: [
        {
          id: "n5-c1-l6-gq1",
          category: "grammar",
          categoryLabel: "Đếm người",
          question: "'4 người' trong tiếng Nhật được phát âm đúng là gì?",
          options: ["よにん (yonin)", "よんにん", "しにん", "よっつにん"],
          correctAnswer: 0,
          explanation: "4 người có cách đọc chuẩn là 「よにん」 (yonin).",
          variations: []
        },
        {
          id: "n5-c1-l6-gq2",
          category: "grammar",
          categoryLabel: "Gọi món với lượng từ",
          question: "Khi muốn mua '2 cái bánh mì', câu nói tự nhiên và chính xác là gì?",
          options: [
            "パンをふたつください。",
            "パンをふたりください。",
            "パンをにさいください。",
            "パンをにえんください。"
          ],
          correctAnswer: 0,
          explanation: "Dùng lượng từ đồ vật 「ふたつ」: パンをふたつください (Xin cho tôi 2 cái bánh mì).",
          variations: []
        }
      ],
      reading: [
        {
          id: "n5-c1-l6-r1",
          passage: "わたしはきょう、スーパーへいきました。りんごをみっつと、パンをふたつかいました。ぜんぶで８００えんでした。とてもやすかったです。",
          translation: "Hôm nay tôi đã đi siêu thị. Tôi đã mua 3 quả táo và 2 cái bánh mì. Tổng cộng hết 800 Yên. Rất là rẻ.",
          question: "Người này đã mua bao nhiêu quả táo?",
          options: ["3 quả (みっつ)", "2 quả (ふたつ)", "1 quả (ひとつ)", "8 quả (やっつ)"],
          correctAnswer: 0,
          explanation: "Trong câu: 「りんごをみっつ...かいました」 (Đã mua 3 quả táo)."
        }
      ],
      listening: [
        {
          id: "n5-c1-l6-li1",
          scenario: "Khách hàng đang thanh toán tại quầy thu ngân cửa hàng tiện lợi.",
          transcript: "Thu ngân: いらっしゃいませ！\nKhách: コーヒーをひとつと、パンをふたつください。\nThu ngân: はい、コーヒーひとつとパンふたつですね。ぜんぶで５００えんでございます。\nKhách: はい、５００えんです。",
          translation: "Thu ngân: Xin kính chào quý khách!\nKhách: Xin cho tôi một ly cà phê và hai chiếc bánh mì.\nThu ngân: Vâng, 1 ly cà phê và 2 bánh mì. Tổng cộng hết 500 Yên ạ.\nKhách: Vâng, gửi bạn 500 Yên.",
          question: "Số tiền người khách phải trả tổng cộng là bao nhiêu?",
          options: ["500 Yên (ごひゃくえん)", "800 Yên (はっぴゃくえん)", "1000 Yên (せんえん)", "300 Yên (さんびゃくえん)"],
          correctAnswer: 0,
          explanation: "Thu ngân thông báo: 「ぜんぶで５００えんでございます」 (Tổng cộng là 500 Yên)."
        }
      ],
      writingPractice: [
        {
          id: "n5-c1-l6-w1",
          prompt: "Viết số tiền '300 Yên' bằng Hiragana (có biến âm)",
          reference: "さんびゃくえん"
        },
        {
          id: "n5-c1-l6-w2",
          prompt: "Viết lượng từ '1 người' bằng Hiragana",
          reference: "ひとり"
        }
      ]
    }
  },

  // =========================================================================
  // CHƯƠNG 2: GIỚI THIỆU BẢN THÂN
  // =========================================================================
  2: {
    1: {
      title: "Bài 1: Chào hỏi & Làm quen cơ bản / Lesson 1: Basic Greetings & Introductions",
      vocabulary: [
        {
          id: "n5-c2-l1-v1",
          word: "わたし",
          furigana: "わたし",
          romaji: "watashi",
          meaning: "Tôi / I, me",
          example: "わたしは学生です。",
          exampleMeaning: "Tôi là học sinh sinh viên. / I am a student."
        },
        {
          id: "n5-c2-l1-v2",
          word: "あなた",
          furigana: "あなた",
          romaji: "anata",
          meaning: "Bạn, anh, chị (ngôi thứ hai) / You",
          example: "あなたは先生ですか。",
          exampleMeaning: "Bạn có phải là giáo viên không? / Are you a teacher?"
        },
        {
          id: "n5-c2-l1-v3",
          word: "あのひと",
          furigana: "あのひと",
          romaji: "anohito",
          meaning: "Người kia, người đó / That person",
          example: "あのひとはだれですか。",
          exampleMeaning: "Người kia là ai thế ạ? / Who is that person?"
        },
        {
          id: "n5-c2-l1-v4",
          word: "〜さん",
          furigana: "〜さん",
          romaji: "~san",
          meaning: "Anh, chị, ông, bà (gọi lịch sự) / Mr., Ms.",
          example: "田中さん、こんにちは。",
          exampleMeaning: "Chào anh Tanaka. / Hello, Mr. Tanaka."
        },
        {
          id: "n5-c2-l1-v5",
          word: "せんせい",
          furigana: "せんせい",
          romaji: "sensei",
          meaning: "Thầy cô giáo, bác sĩ / Teacher, doctor",
          example: "日本語の先生です。",
          exampleMeaning: "Là giáo viên dạy tiếng Nhật. / Japanese teacher."
        },
        {
          id: "n5-c2-l1-v6",
          word: "がくせい",
          furigana: "がくせい",
          romaji: "gakusei",
          meaning: "Học sinh, sinh viên / Student",
          example: "わたしはベトナムの学生です。",
          exampleMeaning: "Tôi là sinh viên Việt Nam. / I am a Vietnamese student."
        },
        {
          id: "n5-c2-l1-v7",
          word: "かいしゃいん",
          furigana: "かいしゃいん",
          romaji: "kaishain",
          meaning: "Nhân viên công ty / Company employee",
          example: "父は会社員です。",
          exampleMeaning: "Bố tôi là nhân viên công ty. / My father is a company employee."
        },
        {
          id: "n5-c2-l1-v8",
          word: "はじめまして",
          furigana: "はじめまして",
          romaji: "hajimemashite",
          meaning: "Rất vui được lần đầu gặp bạn / Nice to meet you",
          example: "はじめまして、ナムです。",
          exampleMeaning: "Rất vui được gặp bạn, tôi là Nam. / Nice to meet you, I'm Nam."
        },
        {
          id: "n5-c2-l1-v9",
          word: "どうぞよろしく",
          furigana: "どうぞよろしく",
          romaji: "douzo yoroshiku",
          meaning: "Rất mong nhận được sự giúp đỡ của bạn / Pleased to meet you",
          example: "どうぞよろしくお願いします。",
          exampleMeaning: "Rất mong được anh/chị chiếu cố và giúp đỡ. / Please treat me favorably."
        }
      ],
      kanji: [
        {
          id: "n5-c2-l1-k1",
          kanji: "私",
          meaning: "Tư (Tôi, cá nhân)",
          onyomi: "シ",
          kunyomi: "わたし, わたくし",
          strokes: 7,
          examples: [
            { word: "私", reading: "わたし", meaning: "Tôi" }
          ]
        },
        {
          id: "n5-c2-l1-k2",
          kanji: "学",
          meaning: "Học (Học tập)",
          onyomi: "ガク",
          kunyomi: "まな.ぶ",
          strokes: 8,
          examples: [
            { word: "学生", reading: "がくせい", meaning: "Học sinh, sinh viên" },
            { word: "大学", reading: "だいがく", meaning: "Trường đại học" }
          ]
        },
        {
          id: "n5-c2-l1-k3",
          kanji: "生",
          meaning: "Sinh (Sinh sống, sinh ra)",
          onyomi: "セイ, ショウ",
          kunyomi: "い.きる, う.まれる",
          strokes: 5,
          examples: [
            { word: "先生", reading: "せんせい", meaning: "Thầy cô giáo" },
            { word: "学生", reading: "がくせい", meaning: "Học sinh" }
          ]
        }
      ],
      practiceQuiz: [
        {
          id: "n5-c2-l1-pq1",
          category: "reading",
          categoryLabel: "Cách chào hỏi",
          question: "Khi lần đầu tiên gặp mặt một người mới, câu chào nhập môn trang trọng là gì?",
          options: ["はじめまして (Hajimemashite)", "さようなら (Sayounara)", "ありがとう (Arigatou)", "おやすみ (Oyasumi)"],
          correctAnswer: 0,
          explanation: "「はじめまして」 có gốc từ 'hajimeru' (bắt đầu), nghĩa là 'Chào mừng lần đầu gặp mặt'.",
          variations: []
        }
      ],
      grammar: [
        {
          id: "n5-c1-l1-g1",
          pattern: "N1 は N2 です",
          meaning: "N1 là N2 (Câu khẳng định danh từ cơ bản)",
          formula: "Chủ ngữ N1 + は (đọc là wa) + Vị ngữ N2 + です",
          explanation: "Trợ từ 「は」 đóng vai trò đánh dấu chủ đề của câu. Chú ý: viết bằng chữ 'ha' nhưng phát âm là 'wa'.",
          examples: [
            {
              japanese: "わたしは ナム です。",
              vietnamese: "Tôi là Nam."
            },
            {
              japanese: "わたしは ベトナム人 です。",
              vietnamese: "Tôi là người Việt Nam."
            }
          ]
        },
        {
          id: "n5-c2-l1-g2",
          pattern: "N1 は N2 ではありません / じゃありません",
          meaning: "N1 không phải là N2 (Câu phủ định)",
          formula: "N1 + は + N2 + ではありません / じゃありません",
          explanation: "「ではありません」 trang trọng, dùng nhiều trong văn viết và phát biểu; 「じゃありません」 thân mật hơn trong khẩu ngữ.",
          examples: [
            {
              japanese: "わたしは 先生ではありません。学生です。",
              vietnamese: "Tôi không phải là giáo viên. Tôi là sinh viên."
            }
          ]
        }
      ],
      grammarQuiz: [
        {
          id: "n5-c2-l1-gq1",
          category: "grammar",
          categoryLabel: "Trợ từ chỉ chủ đề",
          question: "Điền trợ từ phù hợp: 「わたし ___ 学生です。」",
          options: ["は (đọc là wa)", "が", "を", "に"],
          correctAnswer: 0,
          explanation: "Trợ từ 「は」 đánh dấu chủ đề chủ ngữ trong mẫu câu khẳng định 「A は B です」.",
          variations: []
        }
      ],
      reading: [
        {
          id: "n5-c2-l1-r1",
          passage: "はじめまして。わたしはマイです。ベトナムからきました。２０さいです。ハノイだいがくのがくせいです。どうぞよろしくお願いします。",
          translation: "Rất vui được gặp các bạn. Tôi là Mai. Tôi đến từ Việt Nam. Tôi 20 tuổi. Tôi là sinh viên Đại học Hà Nội. Rất mong được mọi người giúp đỡ.",
          question: "Bạn Mai là ai và đang làm nghề gì?",
          options: ["Sinh viên Đại học Hà Nội", "Giáo viên tiếng Nhật", "Nhân viên công ty", "Bác sĩ"],
          correctAnswer: 0,
          explanation: "Trong câu có: 「ハノイだいがくのがくせいです」 nghĩa là sinh viên Đại học Hà Nội."
        }
      ],
      listening: [
        {
          id: "n5-c2-l1-li1",
          scenario: "Hai người bạn mới quen chào hỏi và giới thiệu bản thân.",
          transcript: "A: はじめまして。タインです。ベトナム人です。\nB: はじめまして。田中です。日本人です。よろしくお願いします。\nA: こちらこそ、よろしくお願いします。",
          translation: "A: Chào bạn. Tôi là Thanh. Tôi là người Việt Nam.\nB: Chào bạn. Tôi là Tanaka. Tôi là người Nhật. Rất vui được quen biết bạn.\nA: Tôi cũng vậy, rất mong nhận được sự giúp đỡ.",
          question: "Bạn Tanaka là người nước nào?",
          options: ["Người Nhật Bản (日本人)", "Người Việt Nam", "Người Mỹ", "Người Hàn Quốc"],
          correctAnswer: 0,
          explanation: "Tanaka tự giới thiệu: 「田中です。日本人です」 (Tôi là Tanaka, người Nhật Bản)."
        }
      ],
      writingPractice: [
        {
          id: "n5-c2-l1-w1",
          prompt: "Viết câu 'Tôi là học sinh' bằng tiếng Nhật",
          reference: "わたしはがくせいです。"
        }
      ]
    }
  }
};

export const N5_PRACTICE_DATA: Record<number, Partial<ChapterPractice>> = {
  1: {
    title: "Bài 7: Ôn tập tổng hợp / Lesson 7: Comprehensive Review",
    description: "Đề thi kiểm tra tổng hợp toàn bộ kiến thức Chương 1 (Nhập môn): Bảng chữ cái Hiragana, Katakana, âm đục, âm ngắt, trường âm và hệ thống số đếm tiếng Nhật.",
    quiz: [
      {
        id: "n5-c1-p-q1",
        category: "Hiragana cơ bản",
        question: "Từ 「さかな」 được ghép từ các chữ cái nào và có nghĩa là gì?",
        options: [
          "sa - ka - na (Con cá)",
          "sa - ta - na (Quả táo)",
          "so - ka - na (Con mèo)",
          "su - shi - na (Món ăn)"
        ],
        correctAnswer: 0,
        explanation: "「さかな」 gồm さ (sa), か (ka), な (na), nghĩa là 'con cá'."
      },
      {
        id: "n5-c1-p-q2",
        category: "Âm đục và âm bán đục",
        question: "Hai dấu phẩy 「゛」 (Tenten) và dấu tròn 「゜」 (Maru) khi thêm vào hàng 'Ha' sẽ tạo thành các hàng âm nào?",
        options: [
          "Tenten biến thành hàng Ba (ば), Maru biến thành hàng Pa (ぱ)",
          "Tenten biến thành hàng Ga, Maru biến thành hàng Da",
          "Tenten biến thành hàng Za, Maru biến thành hàng Ka",
          "Cả hai đều biến thành hàng Ma"
        ],
        correctAnswer: 0,
        explanation: "Hàng Ha thêm tenten thành Ba (ば び ぶ べ ぼ), thêm maru thành Pa (ぱ ぴ ぷ ぺ ぽ)."
      },
      {
        id: "n5-c1-p-q3",
        category: "Âm ngắt Hiragana",
        question: "Trong từ con tem 「きって」 (kitte), chữ 「っ」 nhỏ có vai trò gì?",
        options: [
          "Tạo âm ngắt 1 phách và gấp đôi phụ âm 't' phía sau",
          "Đọc là tsu bình thường",
          "Kéo dài nguyên âm i",
          "Làm biến đổi thanh điệu"
        ],
        correctAnswer: 0,
        explanation: "Chữ 「っ」 nhỏ là âm ngắt (Sokuon), tạo khoảng ngắt 1 nhịp và nhân đôi phụ âm đứng ngay sau."
      },
      {
        id: "n5-c1-p-q4",
        category: "Katakana trường âm",
        question: "Dấu gạch ngang 「ー」 trong từ Katakana 「コーヒー」 (cà phê) có tác dụng gì?",
        options: [
          "Kéo dài trường âm cho âm 'ko' và âm 'hi'",
          "Biểu thị dấu gạch nối giữa hai từ",
          "Dùng làm dấu trừ trong phép tính",
          "Dấu ngắt nhịp thở"
        ],
        correctAnswer: 0,
        explanation: "Dấu 「ー」 trong Katakana là ký hiệu trường âm, kéo dài độ ngân của âm tiết trước thêm 1 phách."
      },
      {
        id: "n5-c1-p-q5",
        category: "Phân biệt chữ Katakana",
        question: "Cặp chữ Katakana nào sau đây có nét vuốt từ DƯỚI LÊN?",
        options: [
          "シ (shi) và ン (n)",
          "ツ (tsu) và ソ (so)",
          "ア (a) và マ (ma)",
          "カ (ka) và 力 (chikara)"
        ],
        correctAnswer: 0,
        explanation: "Chữ シ (shi) và chữ ン (n) đều có nét dài cuối cùng được vuốt dốc từ dưới lên trên."
      },
      {
        id: "n5-c1-p-q6",
        category: "Từ mượn Katakana",
        question: "Từ Katakana 「パソコン」 là cách gọi tắt của thiết bị điện tử nào?",
        options: [
          "Personal Computer (Máy vi tính cá nhân)",
          "Smartphone (Điện thoại thông minh)",
          "Television (Tivi truyền hình)",
          "Camera (Máy chụp hình)"
        ],
        correctAnswer: 0,
        explanation: "「パソコン」 là cách người Nhật viết tắt từ 'Personal Computer' (máy tính cá nhân)."
      },
      {
        id: "n5-c1-p-q7",
        category: "Số đếm tiếng Nhật",
        question: "Số 84 trong tiếng Nhật được đọc chuẩn xác là gì?",
        options: [
          "はちじゅうよん (hachijuuyon)",
          "はちじゅうし (hachijuushi)",
          "ななじゅうよん (nanajuuyon)",
          "きゅうじゅうよん (kyuujuuyon)"
        ],
        correctAnswer: 0,
        explanation: "80 (はちじゅう) + 4 (よん) = はちじゅうよん (hachijuuyon)."
      },
      {
        id: "n5-c1-p-q8",
        category: "Tuổi tác đặc biệt",
        question: "Một người tròn '20 tuổi' trong tiếng Nhật có cách gọi đặc biệt là gì?",
        options: [
          "はたち (hatachi)",
          "にじゅっさい",
          "にじゅうさい",
          "にさい"
        ],
        correctAnswer: 0,
        explanation: "20 tuổi là tuổi lễ thành nhân (Seijin shiki), có từ vựng riêng là 「はたち」."
      },
      {
        id: "n5-c1-p-q9",
        category: "Biến âm hàng trăm & nghìn",
        question: "'300 Yên' và '3.000 Yên' bị biến âm chuẩn xác như thế nào?",
        options: [
          "300 Yên là さんびゃくえん, 3.000 Yên là さんぜんえん",
          "300 Yên là さんひゃくえん, 3.000 Yên là さんせんえん",
          "300 Yên là さんぴゃくえん, 3.000 Yên là さんぜんえん",
          "300 Yên là ろっぴゃくえん, 3.000 Yên là はっせんえん"
        ],
        correctAnswer: 0,
        explanation: "300 biến âm thành さんびゃく (dakuon), 3.000 biến âm thành さんぜん (dakuon)."
      },
      {
        id: "n5-c1-p-q10",
        category: "Lượng từ đếm đồ vật",
        question: "Khi bạn muốn nói 'Xin cho tôi 3 quả táo' tại cửa hàng, câu nào chuẩn nhất?",
        options: [
          "りんごをみっつください。",
          "りんごをさんにんください。",
          "りんごをさんさいください。",
          "りんごをみっつえんください。"
        ],
        correctAnswer: 0,
        explanation: "Lượng từ đếm đồ vật thuần Nhật cho 3 cái là 「みっつ」: りんごをみっつください."
      }
    ]
  }
};
