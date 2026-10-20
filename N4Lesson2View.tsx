import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  BookOpen,
  Pencil,
  Sparkles,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Volume2,
  Info,
  ChevronRight,
  Send,
  Loader2,
  RefreshCw,
  Award,
  Layers,
  Heart,
  MessageCircle,
} from "lucide-react";

import { N4Lesson2VocabView } from "./N4Lesson2VocabView";
import { Furigana } from "./Furigana";

interface N4Lesson2ViewProps {
  lang: "vi" | "en";
  activeTab: "both" | "lesson" | "vocab" | "homework";
}

export const N4Lesson2View: React.FC<N4Lesson2ViewProps> = ({
  lang,
  activeTab,
}) => {
  // Furigana toggle state for Homework / Exercises
  const [showFurigana, setShowFurigana] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("emichan_furigana") !== "false";
    }
    return true;
  });

  const toggleFurigana = () => {
    setShowFurigana((prev) => {
      const next = !prev;
      localStorage.setItem("emichan_furigana", String(next));
      return next;
    });
  };

  // Speech synthesis for Japanese audio (ngay lập tức, không delay)
  const playJapaneseAudio = (text: string) => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance("、" + text);
      utterance.lang = "ja-JP";
      utterance.rate = 0.88;
      const voices = window.speechSynthesis.getVoices();
      const jaVoice = voices.find((v) => v.lang.startsWith("ja"));
      if (jaVoice) utterance.voice = jaVoice;
      window.speechSynthesis.speak(utterance);
    }
  };

  // State for Bài 1: Điền phó từ hoặc trợ từ vào trong ngoặc (10 câu)
  const [bai1Inputs, setBai1Inputs] = useState<Record<number, string>>({
    1: "",
    2: "",
    3: "",
    4: "",
    5: "",
    6: "",
    7: "",
    8: "",
    9: "",
    10: "",
  });

  const bai1Keys = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  const bai1Answers: Record<number, string[]> = {
    1: ["だんだん", "徐々に"],
    2: ["やっと", "ようやく"],
    3: ["ぜひ", "是非"],
    4: ["ぜんぜん", "全然", "ちっとも"],
    5: ["きっと"],
    6: ["を"],
    7: ["を"],
    8: ["に"],
    9: ["に"],
    10: ["で"],
  };

  const bai1Explanations: Record<number, string> = {
    1: "春になって、（だんだん）暖かくなってきました: Dần dần trở nên ấm áp.",
    2: "長い間勉強して、（やっと）合格できました: Cuối cùng cũng thi đỗ sau nhiều nỗ lực.",
    3: "日本へ来たら、（ぜひ）遊びに来てください: Nhất định, rất mong bạn ghé chơi.",
    4: "昨日は疲れていたので、（ぜんぜん）勉強しませんでした: Đi với phủ định -> Hoàn toàn không học.",
    5: "一生懸命頑張れば、（きっと）合格できます: Chắc chắn (kỳ vọng tích cực).",
    6: "次の角（を）右に曲がってください: Điểm rẽ/ngoặt dùng trợ từ を (曲がる).",
    7: "信号が青になったら横断歩道（を）渡りましょう: Không gian chuyển động xuyên qua (渡る) dùng trợ từ を.",
    8: "電車で日本語学校（に）通っています: Đi lại thường xuyên đến địa điểm (通う) dùng trợ từ に.",
    9: "日本での一人暮らしの生活（に）慣れました: Quen thuộc với việc gì (慣れる) dùng trợ từ に.",
    10: "駅前の交差点（で）友達を車から降ろしました: Địa điểm diễn ra hành động bốc dỡ/cho xuống xe dùng trợ từ で.",
  };

  const bai1Items = [
    { num: 1, prefix: "春になって、（ ", suffix: " ）暖かくなってきました。" },
    { num: 2, prefix: "長い間勉強して、（ ", suffix: " ）合格できました。" },
    { num: 3, prefix: "日本へ来たら、（ ", suffix: " ）遊びに来てください。" },
    { num: 4, prefix: "昨日は疲れていたので、（ ", suffix: " ）勉強しませんでした。" },
    { num: 5, prefix: "一生懸命頑張れば、（ ", suffix: " ）合格できます。" },
    { num: 6, prefix: "次の角（ ", suffix: " ）右に曲がってください。" },
    { num: 7, prefix: "信号が青になったら横断歩道（ ", suffix: " ）渡りましょう。" },
    { num: 8, prefix: "電車で日本語学校（ ", suffix: " ）通っています。" },
    { num: 9, prefix: "日本での一人暮らしの生活（ ", suffix: " ）慣れました。" },
    { num: 10, prefix: "駅前の交差点（ ", suffix: " ）友達を車から降ろしました。" },
  ];

  // State for Bài 2: Chia thể đúng của động từ (10 questions)
  const [bai2Inputs, setBai2Inputs] = useState<Record<number, string>>({
    1: "",
    2: "",
    3: "",
    4: "",
    5: "",
    6: "",
    7: "",
    8: "",
    9: "",
    10: "",
  });

  const bai2Questions = [
    {
      id: 1,
      prefix: "部屋の空気を換えるために窓を（開ける）",
      suffix: "。",
      target: "開ける",
      correctAnswers: ["開けました", "あけました", "開けた", "あけた"],
      explanation: "Mở cửa sổ (hành động đã làm xong) -> Chia quá khứ 開けました / 開けた.",
    },
    {
      id: 2,
      prefix: "雨が（降る）",
      suffix: "ので、傘を差して出かけます。",
      target: "降る",
      correctAnswers: ["降っている", "ふっている", "降っています", "ふっています", "降った", "ふった"],
      explanation: "Trời đang mưa (nguyên nhân) -> 降っている / 降っています.",
    },
    {
      id: 3,
      prefix: "美術館の展示物には手で（触る）",
      suffix: "ください。",
      target: "触る",
      correctAnswers: ["触らないで", "さわらないで"],
      explanation: "Mẫu câu yêu cầu không làm gì: V-ないで + ください -> 触らないで.",
    },
    {
      id: 4,
      prefix: "日本の家に入る時は玄関で靴を（脱ぐ）",
      suffix: "ければなりません。",
      target: "脱ぐ",
      correctAnswers: ["脱がな", "ぬがな"],
      explanation: "Mẫu câu phải làm gì: V-なければなりません -> 脱ぐ đổi thành 脱がなければなりません.",
    },
    {
      id: 5,
      prefix: "エアコンが（壊れる）",
      suffix: "ので、修理を頼みました。",
      target: "壊れる",
      correctAnswers: ["壊れた", "こわれた", "壊れました", "こわれました"],
      explanation: "Tự động từ: エアコンが壊れた (Máy lạnh bị hỏng).",
    },
    {
      id: 6,
      prefix: "道に落ちていた財布を（拾う）",
      suffix: "交番に届けました。",
      target: "拾う",
      correctAnswers: ["拾って", "ひろって"],
      explanation: "Nối hai hành động liên tiếp bằng thể て: 拾って (nhặt lên rồi mang nộp).",
    },
    {
      id: 7,
      prefix: "分からない言葉の意味は辞書で（調べる）",
      suffix: "ほうがいいですよ。",
      target: "調べる",
      correctAnswers: ["調べた", "しらべた"],
      explanation: "Khuyên bảo: V-たほうがいい -> 調べたほうがいい (Nên tra từ điển).",
    },
    {
      id: 8,
      prefix: "食事の前には石鹸で手をきれいに（洗う）",
      suffix: "ましょう。",
      target: "洗う",
      correctAnswers: ["洗い", "あらい"],
      explanation: "Rủ rê cùng làm: V-ましょう -> 洗いましょう.",
    },
    {
      id: 9,
      prefix: "新宿駅で地下鉄からJR線に（乗り換える）",
      suffix: "ことができます。",
      target: "乗り換える",
      correctAnswers: ["乗り換える", "のりかえる"],
      explanation: "Khả năng: V-る (辞書形) + ことができる -> 乗り換えることができる.",
    },
    {
      id: 10,
      prefix: "来週の日曜日に友達と遊ぶ（約束する）",
      suffix: "。",
      target: "約束する",
      correctAnswers: ["約束をしました", "約束しました", "やくそくしました", "やくそくをした", "約束した"],
      explanation: "Đã hẹn trước với bạn bè -> 約束をしました / 約束しました.",
    },
  ];

  // State for Bài 3: Trắc nghiệm hoàn thành câu (10 câu)
  const [bai3Selections, setBai3Selections] = useState<Record<number, number>>({});
  const bai3Questions = [
    {
      id: 1,
      q: "天気がいいので、遠くの山が（　　）見えます。",
      options: ["はっきり", "すっかり", "ちっとも", "ぜんぜん"],
      correct: 0,
      explanation: "Nhìn thấy rõ ràng, rành rọt dùng はっきり.",
    },
    {
      id: 2,
      q: "この靴は私の足のサイズに（　　）合っています。",
      options: ["ぴったり", "びっくり", "たまに", "だんだん"],
      correct: 0,
      explanation: "Vừa vặn, chính xác dùng ぴったり.",
    },
    {
      id: 3,
      q: "時間はもう17時ですから、（　　）帰りましょう。",
      options: ["そろそろ", "ちっとも", "ずっと", "あまり"],
      correct: 0,
      explanation: "Đã đến lúc, chuẩn bị đến giờ dùng そろそろ.",
    },
    {
      id: 4,
      q: "休みの日は家で（　　）テレビを見て過ごします。",
      options: ["のんびり", "はっきり", "ぴったり", "かならず"],
      correct: 0,
      explanation: "Thong thả, thong dong nghỉ ngơi dùng のんびり.",
    },
    {
      id: 5,
      q: "先生、黒板の字が見えにくいので、（　　）を掛けます。",
      options: ["眼鏡（めがね）", "帽子（ぼうし）", "傘（かさ）", "靴（くつ）"],
      correct: 0,
      explanation: "Đeo kính dùng động từ 掛ける (眼鏡を掛ける).",
    },
    {
      id: 6,
      q: "日差しが強いので、（　　）を被って散歩に行きます。",
      options: ["帽子（ぼうし）", "眼鏡（めがね）", "ズボン", "時計"],
      correct: 0,
      explanation: "Đội mũ, nón dùng động từ 被る (帽子を被る).",
    },
    {
      id: 7,
      q: "人気のあるレストランなので、事前に席を（　　）しておきました。",
      options: ["予約（よやく）", "散歩（さんぽ）", "紹介（しょうかい）", "禁止（きんし）"],
      correct: 0,
      explanation: "Đặt bàn trước tại nhà hàng dùng 予約（する）.",
    },
    {
      id: 8,
      q: "雪が降った道は（　　）やすいので気をつけて歩いてください。",
      options: ["滑り（すべり）", "笑い（わらい）", "泣き（なき）", "泳ぎ（およぎ）"],
      correct: 0,
      explanation: "Đường trơn trượt dùng 滑る (滑りやすい).",
    },
    {
      id: 9,
      q: "強い台風の風で、公園の大きな木が（　　）しまいました。",
      options: ["倒れて（たおれて）", "並んで（ならんで）", "咲いて（さいて）", "渡って（わたって）"],
      correct: 0,
      explanation: "Cây bị gió bão ngã đổ, sụp đổ dùng 倒れる.",
    },
    {
      id: 10,
      q: "この池で魚を釣ることは法律で（　　）されています。",
      options: ["禁止（きんし）", "準備（じゅんび）", "安心（あんしん）", "経験（けいけん）"],
      correct: 0,
      explanation: "Bị pháp luật nghiêm cấm dùng 禁止（する）.",
    },
  ];

  // Grading State
  const [isGraded, setIsGraded] = useState<boolean>(false);
  const [totalScore, setTotalScore] = useState<number>(0);
  const [showCelebrationModal, setShowCelebrationModal] = useState<boolean>(false);
  const [isPlayingCelebration, setIsPlayingCelebration] = useState<boolean>(false);

  // Check answers
  const handleGrade = () => {
    let score = 0;

    // Grade Bài 1
    bai1Keys.forEach((k) => {
      const val = (bai1Inputs[k] || "").trim().toLowerCase();
      const validAnswers = bai1Answers[k].map((a) => a.toLowerCase());
      if (validAnswers.includes(val)) score += 1;
    });

    // Grade Bài 2
    bai2Questions.forEach((q) => {
      const val = (bai2Inputs[q.id] || "").trim().toLowerCase();
      const validAnswers = q.correctAnswers.map((a) => a.toLowerCase());
      if (validAnswers.includes(val)) score += 1;
    });

    // Grade Bài 3
    bai3Questions.forEach((q) => {
      if (bai3Selections[q.id] === q.correct) score += 1;
    });

    setTotalScore(score);
    setIsGraded(true);

    if (score >= 20) {
      setShowCelebrationModal(true);
      playCelebrationVoice();
    }
  };

  const playCelebrationVoice = () => {
    try {
      setIsPlayingCelebration(true);
      const audio = new Audio("/audio/otsukaresama.mp4");
      audio.onended = () => setIsPlayingCelebration(false);
      audio.onerror = () => {
        const fallback = new Audio("/audio/otsukaresama.mp3");
        fallback.onended = () => setIsPlayingCelebration(false);
        fallback.onerror = () => {
          setIsPlayingCelebration(false);
          playJapaneseAudio("お疲れ様でした！大変よくできました！");
        };
        fallback.play().catch(() => setIsPlayingCelebration(false));
      };
      audio.play().catch(() => {
        setIsPlayingCelebration(false);
      });
    } catch {
      setIsPlayingCelebration(false);
    }
  };

  const resetAll = () => {
    setBai1Inputs({ 1: "", 2: "", 3: "", 4: "", 5: "", 6: "", 7: "", 8: "", 9: "", 10: "" });
    setBai2Inputs({ 1: "", 2: "", 3: "", 4: "", 5: "", 6: "", 7: "", 8: "", 9: "", 10: "" });
    setBai3Selections({});
    setIsGraded(false);
    setTotalScore(0);
    setShowCelebrationModal(false);
  };

  return (
    <div className="space-y-8">
      {/* ======================================================== */}
      {/* 1. MỤC: NỘI DUNG BÀI HỌC BUỔI 2 (CHỜ CẬP NHẬT VÀO NGÀY MAI) */}
      {/* ======================================================== */}
      {activeTab === "lesson" && (
        <section className="bg-white/95 backdrop-blur-xl rounded-3xl p-8 md:p-12 border border-pink-100 shadow-sm transition-all text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-amber-100/70 text-amber-700 flex items-center justify-center font-bold mx-auto border border-amber-200 shadow-inner">
            <BookOpen className="w-8 h-8" />
          </div>
          <div className="space-y-2 max-w-lg mx-auto">
            <span className="text-xs font-bold text-amber-800 bg-amber-100 px-3.5 py-1 rounded-full border border-amber-200 inline-block">
              ⏳ Đang chuẩn bị nội dung
            </span>
            <h2 className="font-serif font-black text-xl md:text-2xl text-[#8a5b61]">
              Nội dung bài học Buổi 2 sẽ được cập nhật vào ngày mai
            </h2>
            <p className="text-xs md:text-sm text-gray-600 font-sans leading-relaxed">
              Phần bài giảng lý thuyết Buổi 2 sẽ được cập nhật sớm vào ngày mai. Hiện tại bạn có thể chuyển sang mục <strong>"Từ vựng (129 từ)"</strong> để học thẻ Flashcard và làm bài tập luyện tập trước nhé!
            </p>
          </div>
        </section>
      )}

      {/* ======================================================== */}
      {/* 2. MỤC: TỪ VỰNG BUỔI 2 (129 TỪ VỰNG - FLASHCARD & 4 DẠNG BÀI TẬP) */}
      {/* ======================================================== */}
      {(activeTab === "both" || activeTab === "vocab") && (
        <N4Lesson2VocabView lang={lang} />
      )}

      {/* ======================================================== */}
      {/* 3. MỤC: BÀI TẬP VỀ NHÀ BUỔI 2 */}
      {/* ======================================================== */}
      {(activeTab === "both" || activeTab === "homework") && (
        <section className="bg-white/90 backdrop-blur-xl rounded-3xl p-5 md:p-8 border border-pink-100 shadow-sm transition-all space-y-8">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-5 border-b border-pink-100">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-[#c99fa5] text-white flex items-center justify-center font-bold shadow-md">
                <Pencil className="w-6 h-6" />
              </div>
              <div>
                <h2 className="font-serif font-black text-xl md:text-2xl text-[#8a5b61]">
                  BÀI TẬP VỀ NHÀ: BUỔI 2
                </h2>
                <p className="text-xs text-gray-500 font-sans mt-0.5">
                  Gồm 3 bài tập: Điền từ, chia thể động từ và trắc nghiệm củng cố (Tổng: 30 câu / 30 điểm)
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {isGraded && (
                <span className="text-xs font-bold text-[#8a5b61] bg-pink-100 px-3 py-1 rounded-full border border-pink-200">
                  Điểm số: {totalScore} / 30
                </span>
              )}

              {/* Nút Bật/Tắt Furigana chuẩn giáo trình */}
              <button
                onClick={toggleFurigana}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold font-sans transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs border ${
                  showFurigana
                    ? "bg-rose-50 text-rose-800 border-rose-300 ring-1 ring-rose-200"
                    : "bg-gray-100 text-gray-500 border-gray-200 hover:bg-gray-200"
                }`}
                title="Bật/Tắt hiển thị Furigana (chữ Hiragana nhỏ trên đầu chữ Hán)"
              >
                <span className="font-jp text-[12px] font-bold">ふりがな</span>
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase transition-all ${
                    showFurigana ? "bg-[#8a5b61] text-white shadow-2xs" : "bg-gray-300 text-gray-700"
                  }`}
                >
                  {showFurigana ? "Bật" : "Tắt"}
                </span>
              </button>
            </div>
          </div>

          {/* BÀI 1: ĐIỀN TỪ VÀ TRỢ TỪ THÍCH HỢP */}
          <div className="space-y-4">
            <h3 className="font-serif font-bold text-base text-[#8a5b61] flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-[#8a5b61] text-white flex items-center justify-center text-xs">
                1
              </span>
              <span>Bài 1: Điền phó từ hoặc trợ từ thích hợp vào chỗ trống (10 câu)</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {bai1Items.map((item) => {
                const num = item.num;
                const val = (bai1Inputs[num] || "").trim().toLowerCase();
                const isCorrect = bai1Answers[num].map((a) => a.toLowerCase()).includes(val);

                return (
                  <div
                    key={num}
                    className={`p-4 rounded-2xl border transition-all ${
                      isGraded
                        ? isCorrect
                          ? "bg-emerald-50/60 border-emerald-300"
                          : "bg-rose-50/60 border-rose-300"
                        : "bg-white border-pink-100 shadow-2xs"
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs mb-2">
                      <span className="font-bold text-[#8a5b61]">Câu {num}</span>
                      {isGraded && (
                        <span>
                          {isCorrect ? (
                            <span className="text-emerald-700 font-bold flex items-center gap-1">
                              <CheckCircle2 className="w-4 h-4" /> Chính xác
                            </span>
                          ) : (
                            <span className="text-rose-700 font-bold flex items-center gap-1">
                              <XCircle className="w-4 h-4" /> Đ/A: {bai1Answers[num][0]}
                            </span>
                          )}
                        </span>
                      )}
                    </div>

                    {/* Câu tiếng Nhật có Furigana phía trên chữ Hán */}
                    <div className="font-jp text-sm text-gray-900 leading-relaxed mb-3">
                      <Furigana text={item.prefix} showFurigana={showFurigana} />
                      <span className="font-bold text-[#8a5b61] bg-pink-100/70 px-1.5 py-0.5 rounded text-xs mx-0.5 inline-block">
                        ( {num} )
                      </span>
                      <Furigana text={item.suffix} showFurigana={showFurigana} />
                    </div>

                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={bai1Inputs[num] || ""}
                        onChange={(e) =>
                          setBai1Inputs((prev) => ({ ...prev, [num]: e.target.value }))
                        }
                        placeholder={`Điền vào chỗ trống (${num})...`}
                        className="flex-1 px-3 py-1.5 rounded-xl text-xs font-jp bg-white border border-pink-200 text-gray-800 focus:outline-none focus:ring-1 focus:ring-[#8a5b61]"
                      />
                    </div>

                    {isGraded && (
                      <p className="text-[11px] text-gray-600 mt-2 italic bg-pink-50/40 p-2 rounded-xl border border-pink-100/70">
                        💡 <Furigana text={bai1Explanations[num]} showFurigana={showFurigana} />
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* BÀI 2: CHIA THỂ ĐỘNG TỪ */}
          <div className="space-y-4 pt-4 border-t border-pink-100">
            <h3 className="font-serif font-bold text-base text-[#8a5b61] flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-[#8a5b61] text-white flex items-center justify-center text-xs">
                2
              </span>
              <span>Bài 2: Chia dạng đúng của động từ trong ngoặc (10 câu)</span>
            </h3>

            <div className="space-y-3">
              {bai2Questions.map((q) => {
                const val = (bai2Inputs[q.id] || "").trim().toLowerCase();
                const isCorrect = q.correctAnswers.map((a) => a.toLowerCase()).includes(val);

                return (
                  <div
                    key={q.id}
                    className={`p-3.5 rounded-2xl border transition-all ${
                      isGraded
                        ? isCorrect
                          ? "bg-emerald-50/60 border-emerald-300"
                          : "bg-rose-50/60 border-rose-300"
                        : "bg-white border-pink-100 shadow-2xs"
                    }`}
                  >
                    <div className="flex flex-wrap items-center justify-between text-xs mb-1.5">
                      <span className="font-bold text-[#8a5b61]">Câu {q.id}</span>
                      {isGraded && (
                        <span>
                          {isCorrect ? (
                            <span className="text-emerald-700 font-bold flex items-center gap-1">
                              <CheckCircle2 className="w-4 h-4" /> Chính xác
                            </span>
                          ) : (
                            <span className="text-rose-700 font-bold flex items-center gap-1">
                              <XCircle className="w-4 h-4" /> Đáp án: {q.correctAnswers[0]}
                            </span>
                          )}
                        </span>
                      )}
                    </div>

                    <p className="font-jp text-sm sm:text-base text-gray-900 leading-relaxed mb-2">
                      <Furigana text={q.prefix} showFurigana={showFurigana} />
                      <span className="underline decoration-pink-400 font-bold px-1 text-[#8a5b61]">
                        【 <Furigana text={q.target} showFurigana={showFurigana} /> 】
                      </span>
                      <Furigana text={q.suffix} showFurigana={showFurigana} />
                    </p>

                    <input
                      type="text"
                      value={bai2Inputs[q.id] || ""}
                      onChange={(e) =>
                        setBai2Inputs((prev) => ({ ...prev, [q.id]: e.target.value }))
                      }
                      placeholder={`Chia thể cho 「${q.target}」...`}
                      className="w-full sm:w-72 px-3 py-1.5 rounded-xl text-xs font-jp bg-white border border-pink-200 text-gray-800 focus:outline-none focus:ring-1 focus:ring-[#8a5b61]"
                    />

                    {isGraded && (
                      <p className="text-[11px] text-gray-600 mt-2 italic bg-pink-50/40 p-2 rounded-xl border border-pink-100/70">
                        💡 <Furigana text={q.explanation} showFurigana={showFurigana} />
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* BÀI 3: TRẮC NGHIỆM CỦNG CỐ */}
          <div className="space-y-4 pt-4 border-t border-pink-100">
            <h3 className="font-serif font-bold text-base text-[#8a5b61] flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-[#8a5b61] text-white flex items-center justify-center text-xs">
                3
              </span>
              <span>Bài 3: Trắc nghiệm hoàn thành câu giao tiếp thực tế (10 câu)</span>
            </h3>

            <div className="space-y-3">
              {bai3Questions.map((q) => {
                const selected = bai3Selections[q.id];
                const isCorrect = selected === q.correct;

                return (
                  <div
                    key={q.id}
                    className={`p-4 rounded-2xl border transition-all ${
                      isGraded
                        ? isCorrect
                          ? "bg-emerald-50/60 border-emerald-300"
                          : "bg-rose-50/60 border-rose-300"
                        : "bg-white border-pink-100 shadow-2xs"
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs mb-2">
                      <span className="font-bold text-[#8a5b61]">Câu {q.id}</span>
                      {isGraded && (
                        <span>
                          {isCorrect ? (
                            <span className="text-emerald-700 font-bold flex items-center gap-1">
                              <CheckCircle2 className="w-4 h-4" /> Đúng
                            </span>
                          ) : (
                            <span className="text-rose-700 font-bold flex items-center gap-1">
                              <XCircle className="w-4 h-4" /> Sai
                            </span>
                          )}
                        </span>
                      )}
                    </div>

                    <p className="font-jp text-sm sm:text-base text-gray-900 leading-relaxed mb-3">
                      <Furigana text={q.q} showFurigana={showFurigana} />
                    </p>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {q.options.map((opt, idx) => {
                        const isChosen = selected === idx;
                        let btnStyle = "bg-pink-50/50 hover:bg-pink-100 text-gray-800 border-pink-100";
                        if (isChosen) {
                          btnStyle = "bg-[#8a5b61] text-white font-bold border-[#8a5b61]";
                        }
                        if (isGraded) {
                          if (idx === q.correct) {
                            btnStyle = "bg-emerald-600 text-white font-bold border-emerald-600";
                          } else if (isChosen && !isCorrect) {
                            btnStyle = "bg-rose-600 text-white font-bold border-rose-600";
                          }
                        }

                        return (
                          <button
                            key={idx}
                            onClick={() =>
                              setBai3Selections((prev) => ({ ...prev, [q.id]: idx }))
                            }
                            className={`p-2.5 rounded-xl text-xs font-jp text-center border transition-all cursor-pointer ${btnStyle}`}
                          >
                            <Furigana text={opt} showFurigana={showFurigana} />
                          </button>
                        );
                      })}
                    </div>

                    {isGraded && (
                      <p className="text-[11px] text-gray-600 mt-2 italic bg-pink-50/40 p-2 rounded-xl border border-pink-100/70">
                        💡 <Furigana text={q.explanation} showFurigana={showFurigana} />
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Bottom Action Bar */}
          <div className="pt-6 border-t border-pink-100 flex flex-wrap items-center justify-between gap-4">
            <button
              onClick={resetAll}
              className="px-4 py-2 rounded-2xl bg-white hover:bg-pink-50 border border-pink-200 text-[#8a5b61] text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Làm lại từ đầu</span>
            </button>

            <button
              onClick={handleGrade}
              className="px-8 py-3 rounded-2xl bg-[#8a5b61] hover:bg-[#724a4f] text-white font-bold text-sm shadow-md transition-all active:scale-95 cursor-pointer flex items-center gap-2"
            >
              <Award className="w-5 h-5 text-amber-300" />
              <span>Nộp bài & Hoàn thành (完成)</span>
            </button>
          </div>
        </section>
      )}

      {/* ======================================================== */}
      {/* COMPLETION MODAL: CELEBRATION WITH VOICE & APPLAUSE */}
      {/* ======================================================== */}
      <AnimatePresence>
        {showCelebrationModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white rounded-3xl p-6 md:p-8 max-w-lg w-full shadow-2xl border-2 border-pink-200 text-center space-y-5 relative overflow-hidden"
            >
              <div className="flex items-center justify-between border-b border-pink-100 pb-3">
                <span className="text-xs font-bold text-[#8a5b61] uppercase tracking-wider">
                  N4 Buổi 2: Xuất sắc hoàn thành
                </span>
                <button
                  onClick={playCelebrationVoice}
                  className="p-1.5 rounded-full bg-pink-100 text-[#8a5b61] hover:bg-pink-200 cursor-pointer"
                  title="Nghe lại lời khen"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
              </div>

              <div className="w-32 h-32 mx-auto rounded-3xl overflow-hidden shadow-md border-2 border-pink-100">
                <img
                  src="https://images.unsplash.com/photo-1544717305-2782549b5136?w=400&auto=format&fit=crop&q=80"
                  alt="Chúc mừng hoàn thành"
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="space-y-1.5">
                <h3 className="font-serif text-2xl font-black text-gray-900">
                  お疲れ様でした！ XUẤT SẮC!
                </h3>
                <p className="text-xs text-gray-600 font-sans">
                  Bạn đã hoàn thành tốt các bài tập của Buổi 2 N4 với điểm số {totalScore}/30!
                </p>
              </div>

              <button
                onClick={() => setShowCelebrationModal(false)}
                className="w-full py-3 rounded-2xl bg-[#8a5b61] hover:bg-[#724a4f] text-white font-bold text-sm shadow-md transition-all active:scale-95 cursor-pointer"
              >
                Đóng & Xem lại bài tập
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
