import { VocabularyItem, KanjiItem, QuizQuestion } from '../types';
import { N5_CHAPTER_DATA, N5_PRACTICE_DATA } from './n5Curriculum';

export interface GrammarExplanation {
  id: string;
  pattern: string;
  meaning: string;
  formula: string;
  explanation: string;
  examples: Array<{
    japanese: string;
    vietnamese: string;
    explanation?: string;
  }>;
}

export interface ReadingQuestion {
  id: string;
  passage: string;
  translation: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface ListeningQuestion {
  id: string;
  audioUrl?: string;
  audioDuration?: string;
  scenario: string; // Context description in Vietnamese
  transcript: string; // Japanese dialog
  translation: string; // Vietnamese translation of the dialog
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface AdaptiveQuizQuestion {
  id: string;
  category: "reading" | "kanji" | "grammar" | "context" | "paraphrase" | "vocabulary";
  categoryLabel: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  variations: Array<{
    question: string;
    options: string[];
    correctAnswer: number;
    explanation: string;
  }>;
}

export interface Lesson {
  id: string;
  title: string; // e.g., "Bài 1: Giao tiếp cơ bản"
  type: "lesson";
  day: number; // 1 to 6
  vocabulary: VocabularyItem[];
  kanji: KanjiItem[];
  practiceQuiz: AdaptiveQuizQuestion[]; // Vocabulary & Kanji practice, unlocks grammar when 100% correct
  grammar: GrammarExplanation[];
  grammarQuiz: AdaptiveQuizQuestion[]; // Grammar practice, unlocks reading/listening when 100% correct
  reading: ReadingQuestion[];
  listening: ListeningQuestion[];
  writingPractice?: Array<{ id: string; prompt: string; reference?: string }>;
}

export interface ChapterPractice {
  id: string;
  title: string; // e.g., "Bài 7: Luyện tập tổng hợp Chương 1"
  type: "practice";
  day: number; // 7
  description: string;
  quiz: QuizQuestion[]; // Full mock test of the chapter
}

export interface Chapter {
  id: string;
  chapterNumber: number; // 1 to 12
  title: string; // e.g., "Chương 1: Khởi đầu mới"
  lessons: Lesson[]; // 6 lessons (days 1-6)
  practice: ChapterPractice; // 1 practice (day 7)
}

// ==========================================
// HƯỚNG DẪN NHẬP DỮ LIỆU THỦ CÔNG (TỪ VỰNG, CHỮ HÁN, NGỮ PHÁP, ĐỀ KIỂM TRA):
// Bạn có thể nhập dữ liệu chi tiết cho từng bài học vào hằng số `USER_CURRICULUM_DATA` bên dưới.
// Định dạng: USER_CURRICULUM_DATA[cấp_độ][chương][ngày]
// Ví dụ: USER_CURRICULUM_DATA["N5"][1][1] cho Ngày 1, Chương 1, Cấp độ N5.
// ==========================================
export const USER_CURRICULUM_DATA: Record<string, Record<number, Record<number, Partial<Lesson>>>> = {
  N5: N5_CHAPTER_DATA,
  N4: {},
  N3: {
    1: {
      1: {
        title: "Bài 1: Tôn kính ngữ (尊敬語) / Lesson 1: Respectful Language (Sonkeigo)",
        vocabulary: [
          {
            id: "n3-c1-l1-v1",
            word: "いらっしゃいます",
            furigana: "いらっしゃいます",
            romaji: "irasshaimasu",
            meaning: "Đi, đến, ở (Tôn kính ngữ của 行きます, 来ます, います) / Go, come, be (Respectful form of 行きます, 来ます, います)",
            example: "先生は研究室にいらっしゃいます。",
            exampleMeaning: "Thầy giáo đang ở trong phòng nghiên cứu. / The teacher is in the research lab."
          },
          {
            id: "n3-c1-l1-v2",
            word: "おいでになります",
            furigana: "おいでになります",
            romaji: "oideninarimasu",
            meaning: "Đi, đến, ở (Tôn kính ngữ của 行きます, 来ます, います) / Go, come, be (Respectful form of 行きます, 来ます, います)",
            example: "どちらへおいでになりますか。",
            exampleMeaning: "Ngài đang đi đâu thế ạ? / Where are you going, sir/madam?"
          },
          {
            id: "n3-c1-l1-v3",
            word: "くださいます",
            furigana: "くださいます",
            romaji: "kudasaimasu",
            meaning: "Cho, tặng (Tôn kính ngữ của くれます) / Give (Respectful form of くれます)",
            example: "先生が本をくださいました。",
            exampleMeaning: "Thầy giáo đã tặng sách cho tôi. / The teacher gave a book to me."
          },
          {
            id: "n3-c1-l1-v4",
            word: "なさいます",
            furigana: "なさいます",
            romaji: "nasaimasu",
            meaning: "Làm (Tôn kính ngữ của します) / Do, make (Respectful form of します)",
            example: "何になさいますか。",
            exampleMeaning: "Ngài dùng gì thế ạ? / What would you like to have/do?"
          },
          {
            id: "n3-c1-l1-v5",
            word: "ご存知ですか",
            furigana: "ごぞんじですか",
            romaji: "gozonjidesuka",
            meaning: "Biết (Tôn kính ngữ của 知っていますか) / Know (Respectful form of 知っていますか)",
            example: "田中先生をご存知ですか。",
            exampleMeaning: "Ngài có biết thầy Tanaka không ạ? / Do you know Professor Tanaka?"
          },
          {
            id: "n3-c1-l1-v6",
            word: "召し上がります",
            furigana: "めしあがります",
            romaji: "meshiagarimasu",
            meaning: "Ăn, uống (Tôn kính ngữ của 食べます, 飲みます) / Eat, drink (Respectful form of 食べます, 飲みます)",
            example: "どうぞお召し上がりください。",
            exampleMeaning: "Xin mời ngài dùng bữa / uống nước. / Please help yourself / enjoy your meal."
          },
          {
            id: "n3-c1-l1-v7",
            word: "ご覧になります",
            furigana: "ごらんになります",
            romaji: "goranninarimasu",
            meaning: "Xem, nhìn (Tôn kính ngữ của 見ます) / Look, watch, see (Respectful form of 見ます)",
            example: "こちらの資料をご覧になりますか。",
            exampleMeaning: "Ngài có xem tài liệu này không ạ? / Would you like to look at these documents?"
          },
          {
            id: "n3-c1-l1-v8",
            word: "おっしゃいます",
            furigana: "おっしゃいます",
            romaji: "osshaimasu",
            meaning: "Nói (Tôn kính ngữ của 言います) / Say, speak (Respectful form of 言います)",
            example: "田中部長がおっしゃいました。",
            exampleMeaning: "Trưởng phòng Tanaka đã nói. / General Manager Tanaka said so."
          },
          {
            id: "n3-c1-l1-v9",
            word: "申し訳ございません",
            furigana: "もうしわけございません",
            romaji: "moushiwakegozaimasen",
            meaning: "Xin lỗi (Cách nói vô cùng trang trọng) / I am extremely sorry (Very polite/formal)",
            example: "遅れて申し訳ございません。",
            exampleMeaning: "Tôi rất xin lỗi vì đã đến muộn. / I am terribly sorry for being late."
          },
          {
            id: "n3-c1-l1-v10",
            word: "貴社",
            furigana: "きしゃ",
            romaji: "kisha",
            meaning: "Quý công ty (Dùng trong văn viết, thư từ, mail) / Your company (Used in writing/emails)",
            example: "貴社のホームページを拝見しました。",
            exampleMeaning: "Tôi đã xem trang chủ của quý công ty. / I visited your company's website."
          },
          {
            id: "n3-c1-l1-v11",
            word: "御社",
            furigana: "おんしゃ",
            romaji: "onsha",
            meaning: "Quý công ty (Dùng trong văn nói, khi phỏng vấn, trao đổi trực tiếp) / Your company (Used in speaking/interviews)",
            example: "御社のご発展をお祈り申し上げます。",
            exampleMeaning: "Tôi kính chúc quý công ty ngày càng phát triển. / I pray for your company's continued prosperity."
          },
          {
            id: "n3-c1-l1-v12",
            word: "弊社",
            furigana: "へいしゃ",
            romaji: "heisha",
            meaning: "Công ty chúng tôi (Khiêm nhường ngữ khi nói về công ty mình) / Our company (Humble form)",
            example: "こちらは弊社の新製品です。",
            exampleMeaning: "Đây là sản phẩm mới của công ty chúng tôi. / This is our company's new product."
          },
          {
            id: "n3-c1-l1-v13",
            word: "褒める",
            furigana: "ほめる",
            romaji: "homeru",
            meaning: "Khen ngợi, khen / To praise, compliment",
            example: "社長gá私の提案を褒めてくださいました。",
            exampleMeaning: "Giám đốc đã khen ngợi đề xuất của tôi. / The President praised my proposal."
          },
          {
            id: "n3-c1-l1-v14",
            word: "尊敬する",
            furigana: "そんけいする",
            romaji: "sonkeisuru",
            meaning: "Tôn kính, kính trọng / To respect, look up to",
            example: "素晴らしい先輩を尊敬しています。",
            exampleMeaning: "Tôi rất kính trọng người tiền bối tuyệt vời của mình. / I highly respect my wonderful senior."
          },
          {
            id: "n3-c1-l1-v15",
            word: "自社",
            furigana: "じしゃ",
            romaji: "jisha",
            meaning: "Công ty mình, công ty chúng tôi / One's own company, our company",
            example: "自社の製品に誇りを持っています。",
            exampleMeaning: "Tôi tự hào về sản phẩm của công ty mình. / I am proud of our company's products."
          }
        ],
        kanji: [
          {
            id: "n3-c1-l1-k1",
            kanji: "貴",
            meaning: "Quý (Quý báu, quý trọng)",
            onyomi: "キ",
            kunyomi: "たっと.い / とうto.い",
            strokes: 12,
            examples: [
              { word: "貴社", reading: "きしゃ", meaning: "Quý công ty (văn viết)" },
              { word: "貴重", reading: "きちょう", meaning: "Quý giá, quý báu" }
            ]
          },
          {
            id: "n3-c1-l1-k2",
            kanji: "御",
            meaning: "Ngự (Kính ngữ)",
            onyomi: "ゴ / ギョ",
            kunyomi: "おん / お / み",
            strokes: 12,
            examples: [
              { word: "御社", reading: "おんしゃ", meaning: "Quý công ty (văn nói)" },
              { word: "丁寧", reading: "ていねい", meaning: "Lịch sự" }
            ]
          },
          {
            id: "n3-c1-l1-k3",
            kanji: "弊",
            meaning: "Tệ (Tệ hại, nhún nhường)",
            onyomi: "ヘイ",
            kunyomi: "つか.れる",
            strokes: 15,
            examples: [
              { word: "弊社", reading: "へいしゃ", meaning: "Công ty chúng tôi" },
              { word: "弊害", reading: "へいがい", meaning: "Tác hại, tệ nạn" }
            ]
          },
        ],
        practiceQuiz: [
          {
            id: "n3-c1-l1-pq1",
            category: "kanji",
            categoryLabel: "Cách đọc chữ Hán",
            question: "Chữ Hán 「貴社」 có cách đọc đúng là gì?",
            options: ["きしゃ", "きじゃ", "おんしゃ", "へいしゃ"],
            correctAnswer: 0,
            explanation: "Chữ Hán 「貴社」 (Quý Xã) đọc là 「きしゃ」, chỉ công ty của đối phương dùng trong văn viết.",
            variations: []
          },
          {
            id: "n3-c1-l1-pq2",
            category: "reading",
            categoryLabel: "Cách đọc từ vựng",
            question: "Từ vựng 「召し上がります」 có nghĩa là gì?",
            options: ["Nói", "Biết", "Ăn, uống (Kính ngữ)", "Đi, đến (Kính ngữ)"],
            correctAnswer: 2,
            explanation: "「召し上がります」 (Triệu Thượng) là tôn kính ngữ của 食べます (ăn) và 飲みます (uống).",
            variations: []
          },
          {
            id: "n3-c1-l1-pq3",
            category: "kanji",
            categoryLabel: "Chọn chữ Hán thích hợp",
            question: "Chọn chữ Hán thích hợp cho từ 「へいしゃ」 (Công ty chúng tôi):",
            options: ["御社", "貴社", "弊社", "自社"],
            correctAnswer: 2,
            explanation: "「へいしゃ」 viết là 「弊社」 (Tệ Xã), là khiêm nhường ngữ chỉ công ty mình khi nói chuyện với đối tác.",
            variations: []
          },
          {
            id: "n3-c1-l1-pq4",
            category: "reading",
            categoryLabel: "Chọn nghĩa từ vựng",
            question: "Khi nói chuyện trực tiếp với khách hàng, chúng ta gọi công ty của khách là gì?",
            options: ["弊社", "御社", "貴社", "当社"],
            correctAnswer: 1,
            explanation: "「御社」 (Ngự Xã) đọc là 「おんしゃ」 dùng trong giao tiếp nói để tôn xưng công ty khách hàng.",
            variations: []
          },
          {
            id: "n3-c1-l1-pq5",
            category: "reading",
            categoryLabel: "Ý nghĩa từ vựng",
            question: "Đâu là tôn kính ngữ của động từ 「言います」 (nói)?",
            options: ["申します", "おっしゃいます", "なさいます", "ご覧になります"],
            correctAnswer: 1,
            explanation: "「おっしゃいます」 (Thuyết) là tôn kính ngữ của 言います (nói). Còn 申します (申し上げる) là khiêm nhường ngữ.",
            variations: []
          },
          {
            id: "n3-c1-l1-pq6",
            category: "reading",
            categoryLabel: "Ý nghĩa từ vựng",
            question: "Đâu là tôn kính ngữ của động từ 「見ます」 (nhìn, xem)?",
            options: ["拝見します", "ご覧になります", "見せます", "いらっしゃいます"],
            correctAnswer: 1,
            explanation: "「ご覧になります」 (Lãm) là tôn kính ngữ của 見ます (nhìn, xem). Còn 拝見します là khiêm nhường ngữ.",
            variations: []
          },
          {
            id: "n3-c1-l1-pq7",
            category: "reading",
            categoryLabel: "Ý nghĩa từ vựng",
            question: "Từ vựng nào dưới đây là tôn kính ngữ của động từ 「します」 (làm)?",
            options: ["なさいます", "いたします", "くださいます", "召し上がります"],
            correctAnswer: 0,
            explanation: "「なさいます」 là tôn kính ngữ của します (làm). Còn いたします là khiêm nhường ngữ.",
            variations: []
          },
          {
            id: "n3-c1-l1-pq8",
            category: "reading",
            categoryLabel: "Cách dùng từ vựng",
            question: "Điền từ thích hợp vào chỗ trống: 「先生、お茶を (    ) か。」 (Thầy ơi, thầy có uống trà không ạ?)",
            options: ["いらっしゃいます", "召し上がります", "おっしゃいます", "くださいます"],
            correctAnswer: 1,
            explanation: "Để hỏi thầy giáo uống trà, ta dùng tôn kính ngữ của 飲みます là 「召し上がります」.",
            variations: []
          },
          {
            id: "n3-c1-l1-pq9",
            category: "reading",
            categoryLabel: "Ý nghĩa từ vựng",
            question: "Động từ 「くださいます」 là tôn kính ngữ của động từ nào dưới đây?",
            options: ["あげます", "もらいます", "くれます", "いただきます"],
            correctAnswer: 2,
            explanation: "「くださいます」 là tôn kính ngữ của くれます (ai đó cho/tặng tôi hoặc người thân của tôi).",
            variations: []
          },
          {
            id: "n3-c1-l1-pq10",
            category: "reading",
            categoryLabel: "Ý nghĩa từ vựng",
            question: "Động từ 「いらっしゃいます」 KHÔNG phải là tôn kính ngữ của động từ nào?",
            options: ["行きます", "来ます", "います", "知っています"],
            correctAnswer: 3,
            explanation: "「いらっしゃいます」 là tôn kính ngữ chung cho 行きます (đi), 来ます (đến) và います (ở, có mặt). Tôn kính ngữ của 知っています là ご存知です.",
            variations: []
          }
        ],
        grammar: [
          {
            id: "n3-c1-l1-g0",
            pattern: "Tôn kính ngữ (尊敬語) - Tổng quan",
            meaning: "Dùng cho cấp trên, đối tác, khách hàng",
            formula: "",
            explanation: "Mẫu câu tôn kính ngữ dùng để nói về các hành động mà đối phương (cấp trên, khách hàng) là người thực hiện. Tuyệt đối KHÔNG dùng tôn kính ngữ cho bản thân hoặc phía mình (dù là nói về sếp mình với người ngoài).",
            examples: []
          },
          {
            id: "n3-c1-l1-g1",
            pattern: "お / ご + V_ます (bỏ ます) + になります",
            meaning: "Cách chia các động từ có quy tắc ①",
            formula: "お + Động từ nhóm 1 & 2 (thể ます bỏ ます) + になります\nご + Động từ nhóm 3 (Danh từ ghép) + になります",
            explanation: "Mẫu câu tôn kính ngữ có quy tắc dùng để nói về các hành động mà đối phương thực hiện.",
            examples: [
              {
                japanese: "社長はお帰りになりました。",
                vietnamese: "Giám đốc đã về rồi."
              },
              {
                japanese: "先生、もうその本をお読みになりましたか。",
                vietnamese: "Thầy ơi, thầy đã đọc quyển sách đó chưa ạ?"
              }
            ]
          },
          {
            id: "n3-c1-l1-g2",
            pattern: "お / ご + V_ます (bỏ ます) + ください",
            meaning: "Cách chia các động từ có quy tắc ② - đưa ra yêu cầu",
            formula: "お + Động từ nhóm 1 & 2 (thể ます bỏ ます) + ください\nご + Động từ nhóm 3 (Danh từ ghép) + ください",
            explanation: "Đưa ra yêu cầu, đề nghị một cách lịch sự, kính cẩn đối với đối phương.",
            examples: [
              {
                japanese: "どうぞお掛けください。",
                vietnamese: "Xin mời ngồi (đối với động từ 掛ける)."
              },
              {
                japanese: "どうぞお召し上がりください。",
                vietnamese: "Xin mời ngài dùng bữa / uống nước."
              }
            ]
          },
          {
            id: "n3-c1-l1-g3",
            pattern: "Chia thể bị động (V-れる / られる)",
            meaning: "Cách chia các động từ có quy tắc ③ - mang lại cảm giác gần gũi",
            formula: "Động từ nhóm 1: V_i -> V_are + れる\nĐộng từ nhóm 2: V_ます -> V + られる\nĐộng từ nhóm 3: する -> される、来る -> 来られる",
            explanation: "Thể bị động cũng có thể được dùng làm tôn kính ngữ, mang lại cảm giác gần gũi, nhẹ nhàng hơn.\n* Mẹo phân biệt với thể bị động thông thường*\n- Có xuất hiện 【Người + に】 -> Thường là bị động.\n- Chủ ngữ thực hiện hành động là 私 hoặc vật thể -> Bị động.\n- Động từ KHÔNG mang nghĩa tác động (行きます、来ます、います など) -> Chắc chắn là tôn kính ngữ.",
            examples: [
              {
                japanese: "先生はベトナムに行かれました。",
                vietnamese: "Giáo viên đã đi Việt Nam rồi ạ."
              },
              {
                japanese: "社長は（私を）褒められました。",
                vietnamese: "Giám đốc đã khen tôi. (Hành động khen là của Giám đốc -> Tôn kính ngữ)."
              },
              {
                japanese: "私は社長に褒められました。",
                vietnamese: "Tôi được giám đốc khen. (Thể bị động thông thường vì có '社長に' và người nhận hành động là 'Tôi')."
              },
              {
                japanese: "課長、今朝の新聞を読まれましたか。",
                vietnamese: "Trưởng nhóm, anh có đọc báo ngày hôm nay chưa ạ?"
              }
            ]
          }
        ],
        grammarQuiz: [
          {
            id: "n3-c1-l1-gq1",
            category: "grammar",
            categoryLabel: "Trắc nghiệm ngữ pháp",
            question: "Chọn câu viết đúng tôn kính ngữ của 「帰る」 khi nói về Giám đốc:",
            options: ["社長はすぐお帰りします。", "社長はすぐお帰りになります。", "社長はすぐ帰りになります。", "社長はすぐご帰りになります。"],
            correctAnswer: 1,
            explanation: "Để thể hiện sự kính trọng đối với hành động của Giám đốc (đối phương), chúng ta dùng cấu trúc tôn kính ngữ có quy tắc: お + V_ます (bỏ ます) + になります. Động từ 帰る (về) bỏ ます thành 帰り, kết hợp thành お帰りになります. / To show respect for the President's action, we use the regular honorific structure: お + V_ます (stem) + になります. '帰る' becomes 'お帰りになります'.",
            variations: []
          }
        ],
        reading: [],
        listening: [],
        writingPractice: []
      },
      2: {
        title: "Bài 2: Khiêm nhường ngữ (謙譲語) / Lesson 2: Humble Language (Kenjougo)",
        vocabulary: [
          // Nhóm 1: Các động từ khiêm nhường ngữ đặc biệt (Irregular humble verbs)
          {
            id: "n3-c1-l2-v14",
            word: "申す / 申し上げる",
            furigana: "もうす / もうしあげる",
            romaji: "mousu / moushiageru",
            meaning: "Nói, phát biểu (Khiêm nhường của 言います) / To say, speak (Humble of 言います)",
            example: "私はベトナムから参りましたグエンと申します。",
            exampleMeaning: "Tôi tên là Nguyen, đến từ Việt Nam. / My name is Nguyen, I come from Vietnam."
          },
          {
            id: "n3-c1-l2-v8",
            word: "伺う",
            furigana: "うかがう",
            romaji: "ukagau",
            meaning: "Hỏi, nghe, đến thăm (Khiêm nhường của 聞きます, 行きます, 来ます) / To ask, hear, visit (Humble of 聞きます, 行きます, 来ます)",
            example: "明日、オフィスへ伺います。",
            exampleMeaning: "Ngày mai, tôi xin phép được đến văn phòng của ngài. / Tomorrow, I will visit your office."
          },
          {
            id: "n3-c1-l2-v9",
            word: "参る",
            furigana: "まいる",
            romaji: "mairu",
            meaning: "Đi, đến (Khiêm nhường của 行きます, 来ます) / To go, come (Humble of 行きます, 来ます)",
            example: "ただいま参りますので、少々お待ちください。",
            exampleMeaning: "Tôi sẽ đến ngay bây giờ, xin vui lòng chờ một lát. / I will be there right away, please wait a moment."
          },
          {
            id: "n3-c1-l2-v12",
            word: "おる",
            furigana: "おる",
            romaji: "oru",
            meaning: "Ở, có (Khiêm nhường của います) / To be, exist (Humble of います)",
            example: "ただいま別の者が対応しております。",
            exampleMeaning: "Hiện tại người khác (phía chúng tôi) đang xử lý ạ. / Currently, another staff member on our side is handling it."
          },
          {
            id: "n3-c1-l2-v13",
            word: "いただく",
            furigana: "いただく",
            romaji: "itadaku",
            meaning: "Ăn, uống, nhận (Khiêm nhường của 食べます, 飲みます, もらいます) / To eat, drink, receive (Humble of 食べます, 飲みます, もらいます)",
            example: "お土産を美味しくいただきます。",
            exampleMeaning: "Tôi xin phép thưởng thức món quà lưu niệm thật ngon lành. / I will happily receive and enjoy this souvenir."
          },
          {
            id: "n3-c1-l2-v16",
            word: "拝見する",
            furigana: "はいけんする",
            romaji: "haikensuru",
            meaning: "Xem, nhìn, đọc (Khiêm nhường của 見ます, 読みます) / To see, look at, read (Humble of 見ます, 読みます)",
            example: "資料を拝見しました。",
            exampleMeaning: "Tôi đã xem qua tài liệu rồi ạ. / I have looked over the documents."
          },
          {
            id: "n3-c1-l2-v17",
            word: "存じている / 存じております",
            furigana: "ぞんじている",
            romaji: "zonjiteiru",
            meaning: "Biết (Khiêm nhường của 知っています) / To know, be aware of (Humble of 知っています)",
            example: "そのお名前はよく存じております。",
            exampleMeaning: "Tôi biết rất rõ về cái tên đó. / I know that name very well."
          },
          {
            id: "n3-c1-l2-v18",
            word: "お目にかかる",
            furigana: "おめにかかる",
            romaji: "omenikakaru",
            meaning: "Gặp gỡ (Khiêm nhường của 会います) / To meet (Humble of 会います)",
            example: "先生にお目にかかれて光栄です。",
            exampleMeaning: "Thật vinh hạnh khi được gặp mặt thầy ạ. / It is an honor to meet you, teacher."
          },
          {
            id: "n3-c1-l2-v15",
            word: "いたす",
            furigana: "いたす",
            romaji: "itasu",
            meaning: "Làm (Khiêm nhường của します) / To do (Humble of します)",
            example: "よろしくお願いいたします。",
            exampleMeaning: "Rất mong nhận được sự giúp đỡ của ngài. / I look forward to working with you."
          },
          
          // Nhóm 2: Các động từ ghép gốc Hán dùng trong giao dịch (Sino-Japanese humble action verbs)
          {
            id: "n3-c1-l2-v1",
            word: "謙譲する",
            furigana: "けんじょうする",
            romaji: "kenjousuru",
            meaning: "Khiêm nhường, khiêm tốn / Humble, modesty",
            example: "謙譲の美徳は日本の大切な文化です。",
            exampleMeaning: "Mỹ đức khiêm nhường là một nét văn hóa quan trọng của Nhật Bản. / The virtue of humility is an important part of Japanese culture."
          },
          {
            id: "n3-c1-l2-v2",
            word: "添付する",
            furigana: "てんぷする",
            romaji: "tenpusuru",
            meaning: "Đính kèm (file) / To attach (files)",
            example: "メールにPDFファイルを添付いたします。",
            exampleMeaning: "Tôi xin phép đính kèm file PDF vào thư điện tử. / I would like to attach the PDF file to the email."
          },
          {
            id: "n3-c1-l2-v3",
            word: "送信する",
            furigana: "そうしんする",
            romaji: "soushinsuru",
            meaning: "Gửi đi (tin nhắn, email) / To send (messages, emails)",
            example: "詳細が分かり次第、送信いたします。",
            exampleMeaning: "Ngay khi biết chi tiết, tôi xin phép được gửi đi. / As soon as details are known, I will send them to you."
          },
          {
            id: "n3-c1-l2-v4",
            word: "記入する",
            furigana: "きにゅうする",
            romaji: "kinyuusuru",
            meaning: "Điền vào, viết vào / To fill in, write down",
            example: "こちらの申込書にご記入ください。",
            exampleMeaning: "Xin vui lòng điền vào tờ đơn đăng ký này. / Please fill out this application form."
          },
          {
            id: "n3-c1-l2-v10",
            word: "承知する",
            furigana: "しょうちする",
            romaji: "shouchisuru",
            meaning: "Hiểu rõ, đồng ý (Lịch sự/khiêm nhường của 分かります) / To consent, understand, agree (Polite/humble of 分かります)",
            example: "はい、承知いたしました。",
            exampleMeaning: "Vâng, tôi đã hiểu rõ rồi ạ. / Yes, I understand perfectly."
          },
          {
            id: "n3-c1-l2-v11",
            word: "了解する",
            furigana: "りょうかいする",
            romaji: "ryoukaisuru",
            meaning: "Hiểu rõ, nhận lệnh (Thường dùng giữa đồng nghiệp/cấp dưới) / To understand, acknowledge (Mainly used among colleagues/subordinates)",
            example: "件の件、了解しました。",
            exampleMeaning: "Về việc đó, tôi đã nắm được rồi. / Regarding that matter, acknowledged."
          },

          // Nhóm 3: Các trạng từ và hình thái lịch sự phụ trợ (Polite adverbs & auxiliary polite forms)
          {
            id: "n3-c1-l2-v19",
            word: "でございます",
            furigana: "degozaimasu",
            romaji: "degozaimasu",
            meaning: "Là (Lịch sự kính trọng của です) / To be (Polite/honorific of です)",
            example: "こちらgあ新しい資料でございます。",
            exampleMeaning: "Đây là tài liệu mới ạ. / Here is the new document."
          },
          {
            id: "n3-c1-l2-v5",
            word: "後ほど",
            furigana: "のちほど",
            romaji: "nochihodo",
            meaning: "Sau đây, lát nữa (Lịch sự của あとで) / Later, afterwards (Polite form of あとで)",
            example: "詳細が決まりましたら、後ほどお電話いたします。",
            exampleMeaning: "Khi chi tiết được quyết định, tôi sẽ điện thoại lại sau. / Once details are decided, I will call you later."
          },
          {
            id: "n3-c1-l2-v6",
            word: "詳細",
            furigana: "しょうさい",
            romaji: "shousai",
            meaning: "Chi tiết / Details",
            example: "詳細は添付ファイルをご覧ください。",
            exampleMeaning: "Về chi tiết xin vui lòng xem file đính kèm. / Please see the attached file for details."
          },
          {
            id: "n3-c1-l2-v7",
            word: "少々",
            furigana: "しょうしょう",
            romaji: "shoushou",
            meaning: "Một chút, một lát (Lịch sự của ちょっと) / A little, a moment (Polite form of ちょっと)",
            example: "少々お待ちください。",
            exampleMeaning: "Xin vui lòng chờ trong giây lát. / Please wait a moment."
          }
        ],
        kanji: [
          {
            id: "n3-c1-l2-k1",
            kanji: "謙譲",
            meaning: "Khiêm nhường, khiêm tốn / Humble, modesty",
            onyomi: "ケンジョウ",
            kunyomi: "",
            strokes: 37,
            examples: [
              { word: "謙譲語", reading: "けんじょうご", meaning: "Khiêm nhường ngữ / Humble language" }
            ]
          },
          {
            id: "n3-c1-l2-k2",
            kanji: "添付",
            meaning: "Đính kèm / To attach",
            onyomi: "テンプ",
            kunyomi: "",
            strokes: 13,
            examples: [
              { word: "添付ファイル", reading: "てんぷファイル", meaning: "Tập tin đính kèm / Attached file" }
            ]
          }
        ],
        practiceQuiz: [
          {
            id: "n3-c1-l2-pq1",
            category: "kanji",
            categoryLabel: "Cách viết chữ Hán / Kanji Writing",
            question: "Chữ Hán của từ 「てんぷ」 trong 'đính kèm tài liệu' là gì? / What is the Kanji for 'tenpu' meaning 'attach document'?",
            options: ["添付", "送信", "記入", "詳細"],
            correctAnswer: 0,
            explanation: "Chữ Hán của 「てんぷ」 là 「添付」 (Thiêm Phó). / The Kanji for 'tenpu' is '添付'.",
            variations: []
          },
          {
            id: "n3-c1-l2-pq2",
            category: "reading",
            categoryLabel: "Cách đọc chữ Hán / Kanji Reading",
            question: "Cách đọc đúng của từ 「詳細」 (Chi tiết) là gì? / What is the correct reading of '詳細' (details)?",
            options: ["しょうさい", "じょうさい", "しょうせい", "じゅうさい"],
            correctAnswer: 0,
            explanation: "Chữ Hán 「詳細」 (Tường Tế) có cách đọc đúng là 「しょうさい」. / The Kanji '詳細' is correctly read as 'しょうさい'.",
            variations: []
          },
          {
            id: "n3-c1-l2-pq3",
            category: "reading",
            categoryLabel: "Ý nghĩa từ vựng / Vocab Meaning",
            question: "Từ vựng 「後ほど」 (nochihodo) mang ý nghĩa gì? / What does the vocabulary '後ほど' (nochihodo) mean?",
            options: ["Một chút, một lát", "Lát nữa, sau đây (Lịch sự của あとで)", "Trước đây", "Ngay lập tức"],
            correctAnswer: 1,
            explanation: "「後ほど」 mang ý nghĩa là 'lát nữa, sau đây', là cách nói lịch sự hơn của 「あとで」. / '後ほど' means 'later, afterwards', which is a more polite expression than 'あとで'.",
            variations: []
          },
          {
            id: "n3-c1-l2-pq4",
            category: "reading",
            categoryLabel: "Ý nghĩa từ vựng / Vocab Meaning",
            question: "Đâu là khiêm nhường ngữ của động từ 「行きます」 (đi) và 「来ます」 (đến)? / What is the humble (kenjougo) form of '行きます' (to go) and '来ます' (to come)?",
            options: ["いらっしゃいます", "参ります", "おっしゃいます", "なさいます"],
            correctAnswer: 1,
            explanation: "「参ります」 (mại/tham) là khiêm nhường ngữ của 行きます và 来ます. Còn いらっしゃいます là tôn kính ngữ. / '参ります' is the humble form of '行きます' and '来ます'. 'いらっしゃいます' is the honorific (sonkeigo) form.",
            variations: []
          },
          {
            id: "n3-c1-l2-pq5",
            category: "reading",
            categoryLabel: "Ý nghĩa từ vựng / Vocab Meaning",
            question: "Động từ 「拝見します」 là khiêm nhường ngữ của hành động nào? / Which action is '拝見します' the humble (kenjougo) form of?",
            options: ["Đọc, xem, nhìn (見ます)", "Nói (言います)", "Làm (します)", "Gặp (会います)"],
            correctAnswer: 0,
            explanation: "「拝見します」 (Bái Kiến) là khiêm nhường ngữ của 見ます (nhìn, xem, đọc). / '拝見します' is the humble form of '見ます' (to look, see, read).",
            variations: []
          },
          {
            id: "n3-c1-l2-pq6",
            category: "reading",
            categoryLabel: "Cách dùng từ vựng / Word Usage",
            question: "Khi muốn nói 'Tôi đã hiểu/biết việc đó rồi' với đối tác hoặc cấp trên, cụm từ nào lịch sự nhất? / When telling a partner or superior 'I have understood/known that matter', which phrase is the most polite?",
            options: ["了解しました", "分かりました", "承知いたしました", "知っています"],
            correctAnswer: 2,
            explanation: "「承知いたしました」 (hoặc 承知しました) thể hiện sự kính cẩn nhất với cấp trên/đối tác. Tránh dùng 「了解しました」 với khách hàng vì mang tính đồng cấp. / '承知いたしました' (or 承知しました) shows the utmost politeness to superiors/partners. Avoid using '了解しました' with clients as it is used among equals.",
            variations: []
          },
          {
            id: "n3-c1-l2-pq7",
            category: "reading",
            categoryLabel: "Điền từ vào câu / Fill in Blank",
            question: "Điền từ thích hợp: メールに企画書のPDFファイルを (       ) いたします。 / Fill in the blank: Email ni kikakusho no PDF fairu wo ( ) itashimasu.",
            options: ["送信", "添付", "記入", "少々"],
            correctAnswer: 1,
            explanation: "Đính kèm tập tin PDF ta dùng từ 「添付」 (てんぷ) ghép thành 「添付いたします」. / To attach a PDF file, we use '添付' (tenpu) combined to form '添付いたします'.",
            variations: []
          },
          {
            id: "n3-c1-l2-pq8",
            category: "reading",
            categoryLabel: "Cách đọc chữ Hán / Kanji Reading",
            question: "Cách đọc đúng của từ 「自社」 (công ty chúng tôi) là gì? / What is the correct reading of the word '自社' (our company)?",
            options: ["じしゃ", "おんしゃ", "へいしゃ", "ごしゃ"],
            correctAnswer: 0,
            explanation: "Chữ Hán 「自社」 đọc là 「じしゃ」 (Tự Xã), nghĩa là công ty của chính mình. / The Kanji '自社' is read as 'じしゃ', meaning one's own company.",
            variations: []
          },
          {
            id: "n3-c1-l2-pq9",
            category: "reading",
            categoryLabel: "Ý nghĩa từ vựng / Vocab Meaning",
            question: "Đâu là khiêm nhường ngữ của động từ 「会います」 (gặp gỡ)? / What is the humble (kenjougo) form of '会います' (to meet)?",
            options: ["お目にかかります", "ご覧になります", "拝見します", "伺います"],
            correctAnswer: 0,
            explanation: "「お目にかかります」 là khiêm nhường ngữ đặc biệt của 会います (gặp gỡ). / 'お目にかかります' is the special humble form of '会います'.",
            variations: []
          },
          {
            id: "n3-c1-l2-pq10",
            category: "reading",
            categoryLabel: "Ý nghĩa từ vựng / Vocab Meaning",
            question: "Từ 「少々」 (shoushou) dùng để diễn tả ý nghĩa gì? / What does the word '少々' (shoushou) express?",
            options: ["Nhiều một chút", "Một lát, một chút (Lịch sự)", "Rất nhiều", "Hoàn toàn không"],
            correctAnswer: 1,
            explanation: "「少々」 (Thiểu/Thiếu) là cách nói lịch sự của ちょっと (một chút, một lát). / '少々' is the polite expression of 'ちょっと' (a little, a moment).",
            variations: []
          }
        ],
        grammar: [
          {
            id: "n3-c1-l2-g0",
            pattern: "Khiêm nhường ngữ (謙譲語) - Tổng quan / Humble Language (Kenjougo) - Overview",
            meaning: "Dùng cho bản thân khi giao tiếp với cấp trên, đối tác, khách hàng / Used for oneself when communicating with superiors, partners, clients",
            formula: "",
            explanation: "Dùng để nói với cấp trên và khách hàng - nói về các hành động mà mình hoặc người phía mình (đồng nghiệp, sếp của mình) là người thực hiện.\n\n* Chú ý đặc biệt:\n- Tuyệt đối KHÔNG dùng khiêm nhường ngữ khi nói về hành động của đối phương.\n- Khi nói chuyện với khách hàng, tất cả những gì liên quan tới công ty của bản thân (dù là nói về sếp của mình) cũng đều phải sử dụng khiêm nhường ngữ.\n\n/ Used to speak to superiors and clients - talks about actions performed by oneself or someone on one's side (colleagues, one's boss).\n\n* Special Notes:\n- Absolutely DO NOT use humble language for actions performed by the other party.\n- When speaking to clients, anything related to one's own company (even when talking about one's boss) must use humble language.",
            examples: []
          },
          {
            id: "n3-c1-l2-g1",
            pattern: "お / ご + V / N + します / いたします",
            meaning: "Cách chia khiêm nhường ngữ có quy tắc / Standard rules for forming humble language",
            formula: "お + Động từ nhóm 1 & 2 (thể ます bỏ ます) + します / いたします\nご + Động từ nhóm 3 (Danh từ ghép bỏ する) + します / いたします\n\n/ お + Group 1 & 2 Verbs (ます-stem) + します / いたします\nご + Group 3 Verbs (Noun-stem) + します / いたします",
            explanation: "Đây là mẫu câu khiêm nhường ngữ có quy tắc phổ biến nhất.\n\n* Lưu ý:\n- Không thêm お / ご khi V/N là hành động mang tính thao tác tự thân (như 添付, 作成, 勉強, 出席, 送信, 記入, 入力...).\n- Thay vào đó, ta dùng trực tiếp danh từ ghép đi với いたします / します (Ví dụ: 添付いたします, 送信いたします, 記入いたします).\n\n/ This is the most common regular humble form pattern.\n\n* Note:\n- Do not add お / ご when the action is a personal technical operation (such as 添付, 作成, 勉強, 出席, 送信, 記入, 入力...).\n- Instead, directly use the compound noun with いたします / します (e.g., 添付いたします, 送信いたします).",
            examples: [
              {
                japanese: "資料を拝見しました。",
                vietnamese: "Tôi đã xem qua tài liệu rồi ạ. / I have looked over the documents."
              },
              {
                japanese: "詳細が決まりましたら、後ほどお電話いたします。",
                vietnamese: "Khi chi tiết được quyết định, tôi sẽ điện thoại lại sau ạ. / Once details are decided, I will call you later."
              },
              {
                japanese: "メールにPDFファイルを添付いたします。",
                vietnamese: "Tôi xin phép đính kèm file PDF vào thư điện tử ạ. / I would like to attach the PDF file to the email."
              },
              {
                japanese: "お待ちしております。",
                vietnamese: "Tôi đang đợi ngài ạ. / I am waiting for you."
              }
            ]
          },
          {
            id: "n3-c1-l2-g2",
            pattern: "Quy tắc thêm お hoặc ご trước danh từ/động từ / Rules for adding お or ご",
            meaning: "Phân biệt cách kết hợp tiền tố kính ngữ お và ご / How to distinguish between honorific prefixes お and ご",
            formula: "お + Từ thuần Nhật (đọc âm Kunyomi)\nご + Từ gốc Hán (đọc âm Onyomi)\n\n/ お + Kunyomi (Native Japanese words)\nご + Onyomi (Sino-Japanese words)",
            explanation: "Để thể hiện sự trang trọng, chúng ta thêm お hoặc ご trước danh từ/động từ/tính từ liên quan đến đối phương hoặc hành động hướng đến đối phương.\n\n* Quy tắc cụ thể:\n【お】 Đi với Từ thuần Nhật (thường là từ có 1 chữ Hán, đọc theo âm Kunyomi) và các tính từ.\n【ご】 Đi với Từ gốc Hán (thường là từ ghép 2 chữ Hán trở lên, đọc theo âm Onyomi).\n\n* Ngoại lệ những từ gần gũi, thường dùng trong cuộc sống sẽ dùng 【お】:\n- お時間、お電話、お食事 など\n\n◎ Thêm お・ご khi V/N là thuộc của đối phương:\n- お名前、お国、ご意見 など\n\n◎ Thêm お・ご khi V/N là Hành động phải hướng tới đối phương và đem lại lợi ích/giá trị cho họ:\n- 案内、連絡、報告、説明 など -> お手紙、ご連絡、ご報告、ご説明\n\n✘ KHÔNG thêm お・ご khi V/N là thuộc về cá nhân mình.\n✘ KHÔNG thêm お・ご khi đó là hành động mang tính thao tác, tự thân (添付、作成、勉強、出席、送信、記入、入力 など).\n\n/ To show respect, we add お or ご before nouns, verbs, or adjectives related to the other party.\n\n* Specific rules:\n【お】 Goes with native Japanese words (usually single Kanji, Kunyomi) and adjectives.\n【ご】 Goes with Sino-Japanese words (usually compounds of 2 or more Kanji, Onyomi).\n\n* Exceptions (common words using お):\n- お時間, お電話, お食事, etc.\n\n◎ Add お/ご when V/N belongs to the other party:\n- お名前, お国, ご意見, etc.\n\n◎ Add お/ご when V/N is an action directed towards the other party:\n- 案内, 連絡, 報告, 説明 -> お手紙, ご連絡, ご報告, ご説明\n\n✘ DO NOT add お/ご when V/N belongs to oneself.\n✘ DO NOT add お/ご when it is a personal technical operation (添付, 作成, 勉強, 出席, 送信, 記入, 入力, etc.).",
            examples: [
              {
                japanese: "ご意見をいただき、ありがとうございます。",
                vietnamese: "Cảm ơn ngài vì đã cho ý kiến ạ. / Thank you for your opinion."
              },
              {
                japanese: "会場をご案内いたします。",
                vietnamese: "Tôi xin phép được hướng dẫn ngài đi tham quan hội trường. / Let me guide you to the venue."
              }
            ]
          }
        ],
        grammarQuiz: [
          {
            id: "n3-c1-l2-gq1",
            category: "grammar",
            categoryLabel: "Trắc nghiệm ngữ pháp / Grammar Test",
            question: "Điền từ thích hợp: 「詳細が決まりましたら、後ほどお電話 (       ) 。」 / Fill in the blank: '詳細が決まりましたら、後ほどお電話 ( ) 。'",
            options: [
              "になります / ni narimasu",
              "いたします / itashimasu",
              "ください / kudasai",
              "なさいます / nasaimasu"
            ],
            correctAnswer: 1,
            explanation: "Để biểu thị hành động của chính mình một cách khiêm nhường đối với hành động gọi điện thoại (お電話), ta dùng 「いたします」. / To express our own action humbly regarding calling (お電話), we use 'いたします'.",
            variations: []
          },
          {
            id: "n3-c1-l2-gq2",
            category: "grammar",
            categoryLabel: "Trắc nghiệm ngữ pháp / Grammar Test",
            question: "Động từ nào sau đây KHÔNG thêm tiền tố お hoặc ご khi chuyển sang khiêm nhường ngữ vì là hành động mang tính thao tác tự thân? / Which of the following verbs DOES NOT add お or ご in its humble form because it is a personal technical operation?",
            options: [
              "案内 (hướng dẫn) / Guide",
              "送信 (gửi đi) / Send",
              "連絡 (liên lạc) / Contact",
              "報告 (báo cáo) / Report"
            ],
            correctAnswer: 1,
            explanation: "Các động từ mang tính thao tác cá nhân, tự thân như 送信, 添付, 記入... KHÔNG thêm お/ご mà kết hợp trực tiếp với いたします. / Verbs that are personal technical operations like 送信, 添付, 記入... do not add お or ご but directly combine with 'いたします'.",
            variations: []
          },
          {
            id: "n3-c1-l2-gq3",
            category: "grammar",
            categoryLabel: "Trắc nghiệm ngữ pháp / Grammar Test",
            question: "Từ nào dưới đây đi với tiền tố kính ngữ 「ご」? / Which of the following words goes with the honorific prefix 'ご'?",
            options: [
              "名前 (Tên) / Name",
              "時間 (Thời gian) / Time",
              "意見 (Ý kiến) / Opinion",
              "食事 (Bữa ăn) / Meal"
            ],
            correctAnswer: 2,
            explanation: "意見 (Ý kiến) là từ gốc Hán gồm 2 chữ Hán đọc theo âm Onyomi nên đi với 「ご」 thành 「ご意見」. Các từ khác là ngoại lệ hoặc từ thuần Nhật đi với 「お」. / '意見' (opinion) is a Sino-Japanese word of 2 Kanji read in Onyomi, so it goes with 'ご' to become 'ご意見'. Others are native Japanese words or exceptions that go with 'お'.",
            variations: []
          },
          {
            id: "n3-c1-l2-gq4",
            category: "grammar",
            categoryLabel: "Trắc nghiệm ngữ pháp / Grammar Test",
            question: "Chọn câu dùng khiêm nhường ngữ đúng khi báo cho khách hàng biết mình đang chờ họ: / Choose the correct humble sentence to tell a client that you are waiting for them:",
            options: [
              "お待ちになっております。 / Omachi ni natte orimasu.",
              "お待ちしております。 / Omachi shite orimasu.",
              "お待ちになっています。 / Omachi ni natte imasu.",
              "お待ちにいたします。 / Omachi ni itashimasu."
            ],
            correctAnswer: 1,
            explanation: "Mẫu câu khiêm nhường ngữ khiêm tốn của '待っています' là 'お待ちしております'. / The humble form of '待っています' is 'お待ちしております'.",
            variations: []
          },
          {
            id: "n3-c1-l2-gq5",
            category: "grammar",
            categoryLabel: "Trắc nghiệm ngữ pháp / Grammar Test",
            question: "Khi nói chuyện với khách hàng về Giám đốc của công ty mình, ta dùng động từ nào khi nói 'Giám đốc của công ty chúng tôi có nói rằng...'? / When talking to a client about your company's President, which verb do you use for 'Our President said...'?",
            options: [
              "うちの社長がおっしゃいました / uchi no shachou ga osshaimashita",
              "うちの社長が話しました / uchi no shachou ga hanashimashita",
              "うちの社長が申しました / uchi no shachou ga mōshimashita",
              "うちの社長がご覧になりました / uchi no shachou ga goran ni narimashita"
            ],
            correctAnswer: 2,
            explanation: "Khi giao tiếp với đối tác/khách hàng bên ngoài, tất cả thành viên trong công ty mình (kể cả Giám đốc) đều được coi là thuộc phía mình và phải dùng khiêm nhường ngữ (申します) để hạ thấp, thể hiện sự kính trọng đối phương. / When communicating with external clients/partners, all members of one's own company (including the President) are treated as on our side, and must use humble language ('申します') to show respect to the other party.",
            variations: []
          }
        ],
        reading: [
          {
            id: "n3-c1-l2-r1",
            passage: "ビジネスメールでは、正しい「謙譲語」の使い方が欠かせません。例えば、メールを送る際に「PDFファイルを添付いたします」や「後ほど詳細をご連絡いたします」と書きます。ここで「添付」は自分自身が行うパソコンの操作なので「ご添付いたします」とするのは誤りです。一方、「連絡」は相手に対する行動なので「ご連絡いたします」と「ご」を付けます。また、上司から何かを教えてもらった、または物をもらった際は「いただきます」や「承知いたしました」を使い、相手に失礼のないようにします。自社の状況について顧客に伝える場合、「社長の鈴木がそのように申しております」のように、社長の行動であっても謙譲語を使うのが、日本のビジネス社会における共通のルールです。",
            translation: "Trong thư điện tử công việc, cách sử dụng chính xác 'Khiêm nhường ngữ' là không thể thiếu. Ví dụ, khi gửi email, chúng ta viết 'Tôi xin đính kèm file PDF (添付いたします)' hay 'Lát nữa tôi sẽ liên lạc lại chi tiết (ご連絡いたします)'. Ở đây, 'đính kèm (添付)' là thao tác máy tính tự thân do chính mình thực hiện nên việc viết thành 'ご添付' là sai. Trái lại, 'liên lạc (連絡)' là hành động hướng tới đối phương nên ta thêm 'ご' thành 'ご連絡いたします'. Hơn nữa, khi được cấp trên chỉ bảo hay nhận đồ từ họ, chúng ta dùng 'いただきます' hoặc '承知いたしました' để không thất lễ. Khi truyền đạt cho khách hàng về tình hình của công ty mình, việc sử dụng khiêm nhường ngữ ngay cả cho hành động của Giám đốc như 'Giám đốc Suzuki của chúng tôi có nói như vậy' là quy tắc chung trong xã hội kinh doanh Nhật Bản.\n\n/ In business emails, the correct use of 'Humble Language' (Kenjougo) is indispensable. For example, when sending an email, we write 'I attach the PDF file (添付いたします)' or 'I will contact you later with details (ご連絡いたします)'. Here, 'attaching' (添付) is a personal computer operation, so writing 'ご添付いたします' is incorrect. On the other hand, 'contacting' (連絡) is an action directed at the other party, so we add 'ご' to make it 'ご連絡いたします'. Furthermore, when receiving instructions or items from a superior, we use 'いただきます' or '承知いたしました' to avoid being impolite. When informing a client about our company's situation, it is a common rule in Japanese business society to use humble language even for the actions of the President, such as 'Our President Suzuki says so' (社長の鈴木がそのように申しております).",
            question: "Tại sao lại không dùng 「ご添付いたします」 mà chỉ dùng 「添付いたします」? / Why do we not use 'ご添付いたします' but only '添付いたします'?",
            options: [
              "Vì 'đính kèm' là hành động của khách hàng chứ không phải của mình. / Because attaching is the client's action, not ours.",
              "Vì 'đính kèm' là hành động thao tác tự thân của cá nhân, không hướng tới đối phương hay đem lại lợi ích trực tiếp như liên lạc, giải thích. / Because attaching is a personal technical operation that doesn't directly target the other party like contacting or explaining.",
              "Vì từ '添付' đi với tiền tố 'お' chứ không phải 'ご'. / Because '添付' goes with prefix 'お' instead of 'ご'.",
              "Vì đây là từ thuần Nhật nên không thể đi với 'ご'. / Because it is a native Japanese word and cannot go with 'ご'."
            ],
            correctAnswer: 1,
            explanation: "Theo quy tắc của bài học, các hành động mang tính thao tác tự thân (như 添付, 作成, 勉強, 送信...) không thêm お hay ご mà dùng trực tiếp danh từ ghép đi với いたします. / According to the lesson rules, actions that are personal technical operations (such as 添付, 作成, 勉強, 送信...) do not add お or ご, but directly combine with 'いたします'.",
          }
        ],
        listening: [
          {
            id: "n3-c1-l2-li1",
            scenario: "Hội thoại trao đổi email và điện thoại giữa nhân viên Suzuki và khách hàng Yamada về việc đính kèm tài liệu chi tiết. / Email and phone conversation between staff Suzuki and client Yamada regarding attaching detailed files.",
            transcript: "社員：お電話ありがとうございます。ABC商事のスズキでございます。\nお客様：もしもし、いつもお世話になっております。昨日お願いした資料の件ですが、詳細がわかりましたか。\n社員：はい、山田様。資料の詳細が確認できましたので、ただいまメールにてPDFファイルを添付いたしました。後ほどご確認ください。\nお客様：承知いたしました. すぐに拝見します。",
            translation: "Nhân viên: Cảm ơn ngài đã gọi điện. Tôi là Suzuki thuộc công ty ABC thương mại ạ.\nKhách hàng: Alo, tôi luôn nhận được sự giúp đỡ của các bạn. Về việc tài liệu tôi nhờ hôm qua, các bạn đã biết chi tiết chưa?\nNhân viên: Vâng, thưa ngài Yamada. Chi tiết tài liệu đã được xác nhận xong, tôi vừa mới đính kèm file PDF gửi qua email rồi ạ. Lát nữa xin ngài vui lòng xác nhận.\nKhách hàng: Tôi hiểu rồi. Tôi sẽ xem ngay.\n\n/ Staff: Thank you for calling. This is Suzuki from ABC Trading Company.\nClient: Hello, thank you for your ongoing support. Regarding the documents I requested yesterday, did you find out the details?\nStaff: Yes, Mr. Yamada. Since the details of the document have been confirmed, I have attached a PDF file via email. Please check it later.\nClient: Understood. I will check it immediately.",
            question: "Nhân viên Suzuki đã dùng cách diễn đạt lịch sự nào để giới thiệu bản thân và công ty của mình? / Which polite expression did Suzuki use to introduce himself and his company?",
            options: [
              "ABC商事のスズキでございます",
              "ABC商事のスズキと申します",
              "ABC商事のスズキであります",
              "ABC商事のスズキになります"
            ],
            correctAnswer: 0,
            explanation: "Nhân viên Suzuki tự giới thiệu bằng cách sử dụng cấu trúc lịch sự cao 「ABC商事のスズキでございます」 (dEございます là thể lịch sự tôn trọng của です). / Staff Suzuki introduced himself using the highly polite structure 'ABC商事のスズキでございます' ('でございます' is the polite/respectful form of 'etc.').",
          }
        ],
        writingPractice: [
          {
            id: "n3-c1-l2-w1",
            prompt: "Hãy viết câu sau sang tiếng Nhật sử dụng Khiêm nhường ngữ: 'Tôi đã xem qua tài liệu rồi.' (Sử dụng 拝見します)\n/ Write the following sentence in Japanese using Humble Language: 'I have looked over the documents.' (Use 拝見します)",
            reference: "資料を拝見しました。"
          },
          {
            id: "n3-c1-l2-w2",
            prompt: "Hãy viết câu sau sang tiếng Nhật: 'Khi chi tiết được quyết định, tôi sẽ gọi điện thoại lại sau.'\n/ Write the following sentence in Japanese: 'Once details are decided, I will call you later.'",
            reference: "詳細が決まりましたら、後ほどお電話いたします。"
          }
        ]
      }
    }
  },
  N2: {},
  N1: {}
};

// ==========================================
// HƯỚNG DẪN NHẬP ĐỀ THI TỔNG HỢP (NGÀY 7):
// Bạn có thể nhập đề thi ngày 7 của chương vào `USER_PRACTICE_DATA` dưới đây.
// ==========================================
export const USER_PRACTICE_DATA: Record<string, Record<number, Partial<ChapterPractice>>> = {
  N5: N5_PRACTICE_DATA,
  N4: {},
  N3: {},
  N2: {},
  N1: {}
};

// Hàm lấy dữ liệu Chương: Tự động trả về cấu trúc khung rỗng chuẩn hóa
export const getChapterData = (level: string, chapterNum: number): Chapter => {
  const levelKey = level.toUpperCase();
  
  // Danh sách các tiêu đề chương mặc định (có thể chỉnh sửa hoặc bổ sung)
  const defaultChapterTitles: Record<string, string[]> = {
    N5: [
      "Nhập môn / Introductory",
      "Giới thiệu bản thân / Self-Introduction",
      "Trường học & Gia đình / School & Family",
      "Thức ăn & Mua sắm / Food & Shopping",
      "Thời gian & Thời tiết / Time & Weather",
      "Sở thích & Ngày nghỉ / Hobbies & Holidays",
      "Giao thông & Đi lại / Transportation & Commute",
      "Cơ thể & Sức khỏe / Body & Health",
      "Lễ hội & Văn hóa / Festivals & Culture",
      "Du lịch ngắn ngày / Short Trips",
      "Nhà cửa & Đồ đạc / Housing & Furniture",
      "Tổng kết & Luyện thi N5 / Final Review & N5 Practice"
    ],
    N4: [
      "Công việc & Kế hoạch / Work & Plans",
      "Xin lỗi & Cảm ơn / Apologizing & Thanking",
      "Lời khuyên & Đề nghị / Advice & Suggestions",
      "Kính ngữ cơ bản / Basic Keigo",
      "Cuộc sống ở Nhật / Life in Japan",
      "Tin tức & Báo chí / News & Newspapers",
      "Gia đình & Xã hội / Family & Society",
      "Môi trường xung quanh / Surrounding Environment",
      "Mơ ước & Dự định / Dreams & Intentions",
      "Sức khỏe & Thể thao / Health & Sports",
      "Mua sắm thông minh / Smart Shopping",
      "Tổng ôn kiến thức / Comprehensive Knowledge Review"
    ],
    N3: [
      "Tôn kính ngữ - Khiêm nhường ngữ / Respectful & Humble Keigo",
      "Quan hệ đồng nghiệp / Colleague Relations",
      "Sự cố & Cách xử lý / Incidents & Handling",
      "Xu hướng thời trang / Fashion Trends",
      "Công nghệ số / Digital Technology",
      "Tìm kiếm việc làm / Job Hunting",
      "Vấn đề xã hội / Social Issues",
      "Kinh tế vi mô / Microeconomics",
      "Văn hóa truyền thống / Traditional Culture",
      "Du lịch khám phá / Exploration Travel",
      "Ngôn ngữ kinh doanh / Business Language",
      "Chiến lược thi đỗ / Exam Strategies"
    ],
    N2: [
      "Bình luận xã hội / Social Commentary",
      "Văn hóa công sở / Office Culture",
      "Chính sách môi trường / Environmental Policies",
      "Khoa học công nghệ / Science & Technology",
      "Tâm lý học hành vi / Behavioral Psychology",
      "Y học & Đời sống / Medicine & Life",
      "Kinh tế quốc tế / International Economics",
      "Truyền thông đại chúng / Mass Media",
      "Lịch sử phát triển / History of Development",
      "Bản sắc dân tộc / National Identity",
      "Tư duy phản biện / Critical Thinking",
      "Luyện đề đỉnh cao / Advanced Mock Exams"
    ],
    N1: [
      "Tư duy triết học / Philosophical Thinking",
      "Biến động kinh tế / Economic Fluctuations",
      "Cơ chế chính trị / Political Mechanisms",
      "Khoa học vũ trụ / Space Science",
      "Văn học cổ điển / Classical Literature",
      "Toàn cầu hóa / Globalization",
      "Ngôn ngữ học / Linguistics",
      "Nghệ thuật & Kiến trúc / Art & Architecture",
      "Tài chính ngân hàng / Finance & Banking",
      "Biến đổi khí hậu / Climate Change",
      "Ngoại giao quốc tế / International Diplomacy",
      "Bí quyết đỗ N1 / Secrets to Passing N1"
    ]
  };

  const titles = defaultChapterTitles[levelKey] || defaultChapterTitles["N5"];
  const rawChapterTitle = titles[chapterNum - 1] || `Chương ${chapterNum}`;
  const parts = rawChapterTitle.split(" / ");
  const viTitle = `Chương ${chapterNum}: ${parts[0]}`;
  const enTitle = parts[1] ? `Chapter ${chapterNum}: ${parts[1]}` : `Chapter ${chapterNum}: ${parts[0]}`;
  const finalTitle = `${viTitle} / ${enTitle}`;

  // Tạo 6 ngày học lý thuyết rỗng
  const lessons: Lesson[] = Array.from({ length: 6 }).map((_, i) => {
    const dayNum = i + 1;
    
    // Kiểm tra xem người dùng đã nhập dữ liệu thủ công hay chưa
    const userLesson = USER_CURRICULUM_DATA[levelKey]?.[chapterNum]?.[dayNum] || {};

    return {
      id: `${levelKey.toLowerCase()}-c${chapterNum}-l${dayNum}`,
      title: userLesson.title || `Bài ${dayNum}: (Nhấp để nhập tiêu đề ngày ${dayNum}) / Lesson ${dayNum}: (Click to input title for day ${dayNum})`,
      type: "lesson",
      day: dayNum,
      vocabulary: userLesson.vocabulary || [],
      kanji: userLesson.kanji || [],
      practiceQuiz: userLesson.practiceQuiz || [],
      grammar: userLesson.grammar || [],
      grammarQuiz: userLesson.grammarQuiz || [],
      reading: userLesson.reading || [],
      listening: userLesson.listening || [],
      writingPractice: userLesson.writingPractice || []
    };
  });

  // Tạo đề thi thử ngày thứ 7 rỗng
  const userPractice = USER_PRACTICE_DATA[levelKey]?.[chapterNum] || {};
  const practice: ChapterPractice = {
    id: `${levelKey.toLowerCase()}-c${chapterNum}-p`,
    title: userPractice.title || `Bài 7: Luyện tập tổng hợp Chương ${chapterNum} / Lesson 7: Comprehensive Practice Chapter ${chapterNum}`,
    type: "practice",
    day: 7,
    description: userPractice.description || "Hãy nhập đề luyện tập tổng hợp giúp hệ thống lại kiến thức của Chương này. / Please enter a comprehensive practice exam to help synthesize the knowledge of this Chapter.",
    quiz: userPractice.quiz || []
  };

  return {
    id: `${levelKey.toLowerCase()}-c${chapterNum}`,
    chapterNumber: chapterNum,
    title: finalTitle,
    lessons,
    practice
  };
};
