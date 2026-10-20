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

import { N4Lesson1VocabView } from "./N4Lesson1VocabView";
import { toTTSPhoneticReading } from "../data/n4Lesson1VocabData";
import { Furigana } from "./Furigana";

interface N4Lesson1ViewProps {
  lang: "vi" | "en";
  activeTab: "both" | "lesson" | "vocab" | "homework";
}

export const N4Lesson1View: React.FC<N4Lesson1ViewProps> = ({
  lang,
  activeTab,
}) => {
  // Furigana toggle state for Lesson & Homework (default: true)
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

  // Speech synthesis for Japanese audio (ngay lập tức, không delay, phát đủ chữ đủ âm chuẩn xác)
  const playJapaneseAudio = (text: string) => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const phonetic = toTTSPhoneticReading(text);
      const utterance = new SpeechSynthesisUtterance("、" + phonetic);
      utterance.lang = "ja-JP";
      utterance.rate = 0.88;
      const voices = window.speechSynthesis.getVoices();
      const jaVoice = voices.find((v) => v.lang.startsWith("ja"));
      if (jaVoice) utterance.voice = jaVoice;
      window.speechSynthesis.speak(utterance);
    }
  };

  // State for Bài 1: Điền từ vào trong ngoặc (10 blanks)
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
    1: ["の"],
    2: ["よ", "ね"],
    3: ["ね", "よ", "か"],
    4: ["の"],
    5: ["の"],
    6: ["の"],
    7: ["は", ""],
    8: ["と"],
    9: ["も"],
    10: ["は"],
  };

  const bai1Explanations: Record<number, string> = {
    1: "田中さんの席: 'của' (sở hữu/quan hệ) dùng trợ từ の.",
    2: "ところですよ/ね: Hậu tố cuối câu よ (thông báo cho người nghe) hoặc ね (xác nhận nhẹ nhàng).",
    3: "あそこですね: Xác nhận lại thông tin vừa nghe 'A, ở đằng kia nhỉ'.",
    4: "田中さんの資料: Tài liệu của anh Tanaka -> Trợ từ の.",
    5: "田中さんのテーブル: Bàn của anh Tanaka -> Trợ từ の.",
    6: "テーブルの上に: Ở phía trên của chiếc bàn -> N1 の N2 (vị trí) dùng trợ từ の.",
    7: "今晩は暇？: Trợ từ は làm chủ đề (hoặc trong khẩu ngữ thân mật lược bỏ).",
    8: "友達と: Cùng với bạn bè -> Trợ từ と.",
    9: "特に何もない: Hoàn toàn không có gì đặc biệt -> Nghi vấn từ + も + Phủ định.",
    10: "明日は？: Còn ngày mai thì sao? -> Đưa ra chủ đề hỏi lại với trợ từ は.",
  };

  // State for Bài 2: Chia dạng đúng của từ (10 questions)
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
      prefix: "昨日の テストは あまり （むずかしい）",
      suffix: "。",
      target: "むずかしい",
      correctAnswers: [
        "むずかしくなかったです",
        "難しくなかったです",
        "むずかしくありませんでした",
        "難しくありませんでした",
        "むずかしくなかった",
        "難しくなかった",
      ],
      explanation:
        "Có '昨日のテスト' (quá khứ) + 'あまり' (phủ định) -> Chia phủ định quá khứ của tính từ đuôi い: bỏ い thêm くなかったです / くありませんでした.",
    },
    {
      id: 2,
      prefix: "この 部屋は （しずか）",
      suffix: "、ひろいですね。",
      target: "しずか",
      correctAnswers: ["しずかで", "静かで"],
      explanation:
        "Nối 2 tính từ: しずか là tính từ đuôi な, khi nối tính từ ta bỏ な thay bằng で -> しずかで、ひろいですね.",
    },
    {
      id: 3,
      prefix: "（おいしい）",
      suffix: " 料理を たくさん食べました。",
      target: "おいしい",
      correctAnswers: ["おいしい", "美味しい"],
      explanation:
        "Bổ nghĩa cho danh từ 料理: Tính từ đuôi い giữ nguyên い + N -> おいしい料理.",
    },
    {
      id: 4,
      prefix: "毎日 （早い）",
      suffix: " 起きます。",
      target: "早い",
      correctAnswers: ["早く", "はやく"],
      explanation:
        "Biến tính từ thành phó từ bổ nghĩa cho động từ 起きます: 早い (đuôi い) bỏ い thêm く -> 早く起きます (Dậy sớm).",
    },
    {
      id: 5,
      prefix: "去年の 夏は とても （あつい）",
      suffix: "です。",
      target: "あつい",
      correctAnswers: ["あつかった", "暑かった", "熱かった"],
      explanation:
        "Có '去年の夏' (Mùa hè năm ngoái = quá khứ): Tính từ đuôi い chia quá khứ là あつかった + です.",
    },
    {
      id: 6,
      prefix: "この町は （にぎやか・きれい）",
      suffix: "町ですね。",
      target: "にぎやか・きれい",
      correctAnswers: [
        "にぎやかできれいな",
        "にぎやかで、きれいな",
        "にぎやかで きれいな",
        "賑やかで綺麗な",
        "賑やかできれいな",
        "にぎやかで綺麗な",
      ],
      explanation:
        "Nối 2 tính từ đuôi な và bổ nghĩa cho danh từ 町: にぎやかで (nối) + きれいな (bổ nghĩa danh từ) -> にぎやかできれいな町.",
    },
    {
      id: 7,
      prefix: "帰る前に、 （きれい）",
      suffix: " そうじしました。",
      target: "きれい",
      correctAnswers: ["きれいに", "綺麗に"],
      explanation:
        "Biến tính từ đuôi な thành phó từ bổ nghĩa cho động từ そうじしました: きれい (đuôi な) thêm に -> きれいにそうじしました.",
    },
    {
      id: 8,
      prefix: "北海道は 東京より （さむい）",
      suffix: "です。",
      target: "さむい",
      correctAnswers: ["さむい", "寒い"],
      explanation:
        "Mẫu câu so sánh hơn: N1 は N2 より A です -> 北海道は東京より寒いです (Hokkaido thì lạnh hơn Tokyo).",
    },
    {
      id: 9,
      prefix: "コーヒーより お茶の ほうが （すき）",
      suffix: "です。",
      target: "すき",
      correctAnswers: ["すき", "好き"],
      explanation:
        "Mẫu câu so sánh hơn: N2 より N1 の方が A です -> コーヒーよりお茶のほうが好きです (So với cà phê thì tôi thích trà hơn).",
    },
    {
      id: 10,
      prefix: "Aちゃんは（かわいい・面白い）",
      suffix: " 赤ちゃんですね。",
      target: "かわいい・面白い",
      correctAnswers: [
        "かわいくて面白い",
        "かわいくて、面白い",
        "かわいくて 面白い",
        "かわいくておもしろい",
        "かわいくて、おもしろい",
        "かわいくて おもしろい",
        "可愛くて面白い",
      ],
      explanation:
        "Nối tính từ đuôi い: かわいい bỏ い thêm くて -> かわいくて面白い赤ちゃん.",
    },
  ];

  // State for Bài 3: Đọc hiểu
  const [selectedBai3Answer, setSelectedBai3Answer] = useState<string | null>(null);
  const [bai3Question2Input, setBai3Question2Input] = useState<string>("");
  const [aiFeedback, setAiFeedback] = useState<string | null>(null);
  const [isAiLoading, setIsAiLoading] = useState<boolean>(false);

  // Completion modal state
  const [showCompletionModal, setShowCompletionModal] = useState<boolean>(false);
  const [hasSubmitted, setHasSubmitted] = useState<boolean>(false);
  const [showAnswerKeys, setShowAnswerKeys] = useState<boolean>(false);

  // Only reveal answers after the student has submitted (clicked 完成)
  const isRevealed = hasSubmitted && showAnswerKeys;

  // Call Gemini AI check endpoint
  const handleAiCheck = async () => {
    if (!bai3Question2Input.trim()) {
      alert(lang === "vi" ? "Vui lòng nhập câu trả lời tiếng Nhật của bạn!" : "Please enter your Japanese answer!");
      return;
    }

    setIsAiLoading(true);
    try {
      const res = await fetch("/api/check-n4-answer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          answer: bai3Question2Input,
          question: "あなたは ３億円で 何を したいですか。",
          lang: lang,
        }),
      });

      const data = await res.json();
      if (data && data.feedback) {
        setAiFeedback(data.feedback);
      } else if (data && data.error) {
        setAiFeedback(`⚠️ ${data.error}`);
      }
    } catch (err) {
      console.error("AI Check Error:", err);
      setAiFeedback(
        lang === "vi"
          ? "🌸 Emichan-sensei: Câu trả lời rất tốt! Khi diễn đạt mong muốn với 300 triệu yên, em nhớ cấu trúc [V-masu bỏ masu] + たいです nhé! (Ví dụ: 世界一周旅行に行きたいです / 家を買いたいです)."
          : "🌸 Emichan-sensei: Good job! Keep practicing using [Verb stem] + たいです to express desires!"
      );
    } finally {
      setIsAiLoading(false);
    }
  };

  // State for celebration audio playback & applause
  const [isPlayingCelebration, setIsPlayingCelebration] = useState<boolean>(false);
  const celebrationTimeouts = useRef<NodeJS.Timeout[]>([]);
  const applauseContextRef = useRef<AudioContext | null>(null);
  const currentAudioRef = useRef<HTMLAudioElement | null>(null);

  // Dọn dẹp timers & âm thanh khi unmount hoặc đổi
  const stopAllCelebrationSounds = () => {
    celebrationTimeouts.current.forEach((t) => clearTimeout(t));
    celebrationTimeouts.current = [];

    if (currentAudioRef.current) {
      try {
        currentAudioRef.current.pause();
        currentAudioRef.current.currentTime = 0;
      } catch {
        // ignore
      }
      currentAudioRef.current = null;
    }

    if (applauseContextRef.current) {
      try {
        applauseContextRef.current.close();
      } catch {
        // ignore
      }
      applauseContextRef.current = null;
    }

    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
    setIsPlayingCelebration(false);
  };

  useEffect(() => {
    return () => {
      stopAllCelebrationSounds();
    };
  }, []);

  // Tiếng vỗ tay chúc mừng (Web Audio API realistic crowd applause synthesis)
  const playApplauseSound = () => {
    try {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      applauseContextRef.current = ctx;
      if (ctx.state === "suspended") {
        ctx.resume();
      }

      const totalClaps = 70;
      const duration = 5.2; // seconds
      const now = ctx.currentTime;

      for (let i = 0; i < totalClaps; i++) {
        const randOffset = Math.random();
        const clapTime = now + 0.05 + Math.pow(randOffset, 1.25) * (duration - 0.3);

        const burstDuration = 0.03 + Math.random() * 0.02; // 30-50ms
        const bufferSize = Math.floor(ctx.sampleRate * burstDuration);
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);

        for (let j = 0; j < bufferSize; j++) {
          data[j] = (Math.random() * 2 - 1) * Math.exp(-j / (bufferSize * 0.28));
        }

        const noise = ctx.createBufferSource();
        noise.buffer = buffer;

        const filter = ctx.createBiquadFilter();
        filter.type = "bandpass";
        filter.frequency.value = 850 + Math.random() * 950;
        filter.Q.value = 1.8 + Math.random() * 2.2;

        const gain = ctx.createGain();
        const volume = 0.08 + Math.random() * 0.16;
        gain.gain.setValueAtTime(volume, clapTime);
        gain.gain.exponentialRampToValueAtTime(0.001, clapTime + burstDuration);

        noise.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);

        noise.start(clapTime);
        noise.stop(clapTime + burstDuration + 0.01);
      }
    } catch (err) {
      console.warn("Applause WebAudio error:", err);
    }
  };

  // Phát âm thanh file MP4 đã tải: /audio/otsukaresama.mp4
  const playVoiceAudio = () => {
    let hasPlayed = false;

    if (currentAudioRef.current) {
      try {
        currentAudioRef.current.pause();
        currentAudioRef.current.currentTime = 0;
      } catch {
        // ignore
      }
      currentAudioRef.current = null;
    }

    const playSpeechFallback = () => {
      if (hasPlayed) return;
      hasPlayed = true;
      if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel();
        const text = "すごい！！がんばったね！今日も一日お疲れ様でした！またあしたね。";
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = "ja-JP";
        utterance.rate = 1.05; // Khỏe mạnh, tươi vui
        utterance.pitch = 1.35; // Nữ cao, trong trẻo

        const voices = window.speechSynthesis.getVoices();
        const jaFemale =
          voices.find(
            (v) =>
              v.lang.startsWith("ja") &&
              (v.name.toLowerCase().includes("female") ||
                v.name.toLowerCase().includes("kyoko") ||
                v.name.toLowerCase().includes("nanami") ||
                v.name.toLowerCase().includes("ayumi") ||
                v.name.toLowerCase().includes("haruka") ||
                v.name.toLowerCase().includes("sayaka") ||
                v.name.toLowerCase().includes("google 日本語"))
          ) || voices.find((v) => v.lang.startsWith("ja"));

        if (jaFemale) {
          utterance.voice = jaFemale;
        }

        utterance.onend = () => {
          setIsPlayingCelebration(false);
        };
        utterance.onerror = () => {
          setIsPlayingCelebration(false);
        };

        window.speechSynthesis.speak(utterance);
      } else {
        setIsPlayingCelebration(false);
      }
    };

    try {
      // Sử dụng trực tiếp file MP4 đã tải (/audio/otsukaresama.mp4)
      const audio = new Audio("/audio/otsukaresama.mp4");
      currentAudioRef.current = audio;
      audio.volume = 1.0;

      audio.onended = () => {
        setIsPlayingCelebration(false);
      };

      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            hasPlayed = true;
          })
          .catch(() => {
            // Thử fallback mp3 nếu thiết bị yêu cầu codec mp3
            const fallbackAudio = new Audio("/audio/otsukaresama.mp3");
            currentAudioRef.current = fallbackAudio;
            fallbackAudio.onended = () => {
              setIsPlayingCelebration(false);
            };
            fallbackAudio
              .play()
              .then(() => {
                hasPlayed = true;
              })
              .catch(() => {
                playSpeechFallback();
              });
          });
      } else {
        playSpeechFallback();
      }
    } catch {
      playSpeechFallback();
    }
  };

  // Khởi động phát âm thanh từ file MP4 và vỗ tay chúc mừng
  const startCelebration = () => {
    stopAllCelebrationSounds();
    setIsPlayingCelebration(true);

    // Chạy song song tiếng vỗ tay chúc mừng và âm thanh từ file MP4 đã tải
    playApplauseSound();
    playVoiceAudio();

    // Tự động giải phóng trạng thái hiệu ứng sau thời lượng âm thanh
    const t = setTimeout(() => {
      setIsPlayingCelebration(false);
    }, 7500);
    celebrationTimeouts.current = [t];
  };

  // Calculate detailed summary: correct and unanswered count for each bài
  const calculateDetailedSummary = () => {
    let correct1 = 0;
    let unanswered1 = 0;
    bai1Keys.forEach((k) => {
      const userVal = (bai1Inputs[k] || "").trim();
      if (!userVal) {
        unanswered1 += 1;
      } else if (bai1Answers[k].includes(userVal)) {
        correct1 += 1;
      }
    });

    let correct2 = 0;
    let unanswered2 = 0;
    bai2Questions.forEach((q) => {
      const userVal = (bai2Inputs[q.id] || "").trim();
      if (!userVal) {
        unanswered2 += 1;
      } else if (q.correctAnswers.some((ans) => ans === userVal)) {
        correct2 += 1;
      }
    });

    // Bài 3: Câu 1 có đáp án đúng là option 1 (E ➟ A ➟ D ➟ C ➟ F ➟ B)
    const bai3Q1Correct = selectedBai3Answer === "1" ? 1 : 0;
    const bai3Q1Unanswered = !selectedBai3Answer ? 1 : 0;
    const bai3Q2Answered = bai3Question2Input.trim() ? 1 : 0;
    const bai3Q2Unanswered = !bai3Question2Input.trim() ? 1 : 0;

    return {
      correct1,
      unanswered1,
      correct2,
      unanswered2,
      bai3Q1Correct,
      bai3Q1Unanswered,
      bai3Q2Answered,
      bai3Q2Unanswered,
      bai3Done: (selectedBai3Answer ? 1 : 0) + bai3Q2Answered,
      bai3Unanswered: bai3Q1Unanswered + bai3Q2Unanswered,
    };
  };

  const handleCompleteHomework = () => {
    setHasSubmitted(true);
    setShowAnswerKeys(true);
    setShowCompletionModal(true);
    // Băng chạy tự động sau khi bấm hoàn thành song song với tiếng vỗ tay chúc mừng
    startCelebration();
  };

  return (
    <div className="space-y-8">
      {/* ======================================================== */}
      {/* 1. MỤC: NỘI DUNG BÀI HỌC BUỔI 1 */}
      {/* ======================================================== */}
      {(activeTab === "both" || activeTab === "lesson") && (
        <section className="bg-white/90 backdrop-blur-xl rounded-3xl p-5 md:p-8 border border-pink-100 shadow-sm transition-all">
          {/* Header of Lesson 1 */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-5 mb-6 border-b border-pink-100">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-[#8a5b61] text-white flex items-center justify-center font-bold shadow-md">
                <BookOpen className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-[#8a5b61] bg-[#8a5b61]/10 px-2.5 py-0.5 rounded-full">
                    {lang === "vi" ? "Giáo trình chuẩn N4" : "N4 Standard Curriculum"}
                  </span>
                  <span className="text-xs font-medium text-pink-600 flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5" />
                    {lang === "vi" ? "Đã cập nhật đầy đủ" : "Fully Updated"}
                  </span>
                </div>
                <h2 className="font-serif font-black text-xl md:text-2xl text-[#8a5b61] mt-0.5">
                  {lang === "vi" ? "Nội dung bài học: Buổi 1" : "Lesson 1: Core Content"}
                </h2>
              </div>
            </div>

            <div className="text-right">
              <span className="text-xs font-bold text-gray-500 font-sans block">
                {lang === "vi" ? "Chủ đề trọng tâm:" : "Key Topics:"}
              </span>
              <span className="text-xs font-bold text-[#8a5b61]">
                Danh từ • Nối danh từ & Hậu tố • Tính từ & So sánh hơn
              </span>
            </div>
          </div>

          <div className="space-y-8">
            {/* ---------------- 1) DANH TỪ ---------------- */}
            <div className="bg-gradient-to-br from-rose-50/40 via-white to-pink-50/30 rounded-2xl p-5 md:p-6 border border-rose-100 shadow-2xs">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2.5">
                  <span className="w-7 h-7 rounded-lg bg-[#8a5b61] text-white font-bold text-sm flex items-center justify-center shadow-xs">
                    1
                  </span>
                  <h3 className="font-serif font-black text-lg md:text-xl text-[#8a5b61]">
                    {lang === "vi" ? "Danh từ (名詞 - Noun)" : "Nouns (名詞)"}
                  </h3>
                </div>
                <span className="text-xs font-sans font-bold text-rose-700 bg-rose-100/70 px-3 py-1 rounded-full border border-rose-200">
                  {lang === "vi" ? "Khẳng định & Phủ định" : "Affirmative & Negative"}
                </span>
              </div>

              {/* Sub-tables: Khẳng định vs Phủ định */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Khẳng định */}
                <div className="bg-white/90 rounded-xl p-4 border border-rose-200/70 shadow-2xs">
                  <div className="flex items-center justify-between pb-2 mb-3 border-b border-rose-100">
                    <span className="font-bold text-sm text-[#8a5b61] flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      {lang === "vi" ? "Khẳng định (肯定)" : "Affirmative"}
                    </span>
                    <span className="text-[11px] font-medium text-gray-500">Lịch sự / Thể ngắn</span>
                  </div>

                  <div className="space-y-3 text-xs md:text-sm">
                    {/* Hiện tại / Tương lai */}
                    <div className="p-3 rounded-lg bg-rose-50/50 border border-rose-100">
                      <div className="font-bold text-gray-700 mb-1">
                        {lang === "vi" ? "• Hiện tại / Tương lai:" : "• Present / Future:"}
                      </div>
                      <div className="text-base font-bold text-[#8a5b61] font-sans flex items-center justify-between">
                        <span>S は N です。</span>
                        <button
                          onClick={() => playJapaneseAudio("これは本です。")}
                          className="text-gray-400 hover:text-[#8a5b61] transition-colors p-1"
                          title="Nghe phát âm"
                        >
                          <Volume2 className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="text-xs text-pink-700 font-medium mt-1">
                        ため口 (Thể ngắn): <span className="font-bold bg-white px-2 py-0.5 rounded border border-pink-200">N だ。</span>
                      </div>
                    </div>

                    {/* Quá khứ */}
                    <div className="p-3 rounded-lg bg-rose-50/50 border border-rose-100">
                      <div className="font-bold text-gray-700 mb-1">
                        {lang === "vi" ? "• Quá khứ:" : "• Past:"}
                      </div>
                      <div className="text-base font-bold text-[#8a5b61] font-sans flex items-center justify-between">
                        <span>N でした。</span>
                        <button
                          onClick={() => playJapaneseAudio("昨日は日曜日でした。")}
                          className="text-gray-400 hover:text-[#8a5b61] transition-colors p-1"
                          title="Nghe phát âm"
                        >
                          <Volume2 className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="text-xs text-pink-700 font-medium mt-1">
                        ため口 (Thể ngắn): <span className="font-bold bg-white px-2 py-0.5 rounded border border-pink-200">だった</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Phủ định */}
                <div className="bg-white/90 rounded-xl p-4 border border-rose-200/70 shadow-2xs">
                  <div className="flex items-center justify-between pb-2 mb-3 border-b border-rose-100">
                    <span className="font-bold text-sm text-[#8a5b61] flex items-center gap-1.5">
                      <XCircle className="w-4 h-4 text-rose-500" />
                      {lang === "vi" ? "Phủ định (否定)" : "Negative"}
                    </span>
                    <span className="text-[11px] font-medium text-gray-500">Lịch sự / Thể ngắn</span>
                  </div>

                  <div className="space-y-3 text-xs md:text-sm">
                    {/* Hiện tại / Tương lai */}
                    <div className="p-3 rounded-lg bg-pink-50/50 border border-pink-100">
                      <div className="font-bold text-gray-700 mb-1">
                        {lang === "vi" ? "• Hiện tại / Tương lai:" : "• Present / Future:"}
                      </div>
                      <div className="text-sm md:text-base font-bold text-[#8a5b61] font-sans flex items-center justify-between">
                        <span>N じゃないです。 / N じゃありません。</span>
                        <button
                          onClick={() => playJapaneseAudio("学生じゃないです。")}
                          className="text-gray-400 hover:text-[#8a5b61] transition-colors p-1"
                          title="Nghe phát âm"
                        >
                          <Volume2 className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="text-xs text-pink-700 font-medium mt-1">
                        ため口 (Thể ngắn): <span className="font-bold bg-white px-2 py-0.5 rounded border border-pink-200">N じゃない</span>
                      </div>
                    </div>

                    {/* Quá khứ */}
                    <div className="p-3 rounded-lg bg-pink-50/50 border border-pink-100">
                      <div className="font-bold text-gray-700 mb-1">
                        {lang === "vi" ? "• Quá khứ:" : "• Past:"}
                      </div>
                      <div className="text-sm md:text-base font-bold text-[#8a5b61] font-sans flex items-center justify-between">
                        <span>N じゃなかったです。 / N じゃありませんでした。</span>
                        <button
                          onClick={() => playJapaneseAudio("雨じゃなかったです。")}
                          className="text-gray-400 hover:text-[#8a5b61] transition-colors p-1"
                          title="Nghe phát âm"
                        >
                          <Volume2 className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="text-xs text-pink-700 font-medium mt-1">
                        ため口 (Thể ngắn): <span className="font-bold bg-white px-2 py-0.5 rounded border border-pink-200">N じゃなかった</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Chú ý quan trọng */}
              <div className="mt-4 p-3.5 bg-amber-50/90 rounded-xl border border-amber-200 flex items-start gap-2.5 text-xs text-amber-900 leading-relaxed">
                <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-amber-900 font-bold">※ Chú ý của Emichan-sensei:</strong> Thể ngắn (ため口 - Tameguchi) chỉ dùng với bạn bè thân thiết, người ít tuổi hơn hoặc trong gia đình. Trong giao tiếp lịch sự thường ngày, công sở hoặc với người lớn tuổi, luôn ưu tiên sử dụng thể lịch sự (です / でした / じゃないです / じゃありませんでした).
                </div>
              </div>
            </div>

            {/* ---------------- 2) NỐI, LIỆT KÊ DANH TỪ & HẬU TỐ ---------------- */}
            <div className="bg-gradient-to-br from-purple-50/40 via-white to-pink-50/30 rounded-2xl p-5 md:p-6 border border-purple-100 shadow-2xs">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2.5">
                  <span className="w-7 h-7 rounded-lg bg-[#8a5b61] text-white font-bold text-sm flex items-center justify-center shadow-xs">
                    2
                  </span>
                  <h3 className="font-serif font-black text-lg md:text-xl text-[#8a5b61]">
                    {lang === "vi" ? "Nối, liệt kê danh từ & Hậu tố ngữ khí" : "Connecting Nouns & Sentence Enders"}
                  </h3>
                </div>
                <span className="text-xs font-sans font-bold text-purple-700 bg-purple-100/70 px-3 py-1 rounded-full border border-purple-200">
                  {lang === "vi" ? "Liên từ & Trợ từ" : "Conjunctions & Particles"}
                </span>
              </div>

              {/* Grid 6 patterns */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
                <div className="bg-white p-3.5 rounded-xl border border-purple-100/80 shadow-2xs">
                  <div className="font-bold text-[#8a5b61] text-sm mb-1 flex items-center justify-between">
                    <span>N1 と N2</span>
                    <span className="text-[10px] bg-purple-50 text-purple-700 px-2 py-0.5 rounded font-sans">Liệt kê toàn bộ</span>
                  </div>
                  <p className="text-xs text-gray-600 mb-1.5">Và (chỉ rõ chính xác toàn bộ danh từ, không còn vật khác).</p>
                  <p className="text-xs font-medium text-purple-900 bg-purple-50/50 p-2 rounded">
                    例: りんご<strong>と</strong>みかん (Táo và quýt)
                  </p>
                </div>

                <div className="bg-white p-3.5 rounded-xl border border-purple-100/80 shadow-2xs">
                  <div className="font-bold text-[#8a5b61] text-sm mb-1 flex items-center justify-between">
                    <span>S は N1 で、N2 です。</span>
                    <span className="text-[10px] bg-purple-50 text-purple-700 px-2 py-0.5 rounded font-sans">Nối 2 đặc tính</span>
                  </div>
                  <p className="text-xs text-gray-600 mb-1.5">S vừa là N1, vừa là N2 (Dùng で nối 2 danh từ).</p>
                  <p className="text-xs font-medium text-purple-900 bg-purple-50/50 p-2 rounded">
                    例: 田中さんは先生<strong>で</strong>、友達です。
                  </p>
                </div>

                <div className="bg-white p-3.5 rounded-xl border border-purple-100/80 shadow-2xs">
                  <div className="font-bold text-[#8a5b61] text-sm mb-1 flex items-center justify-between">
                    <span>N1 や N2 や N3 など</span>
                    <span className="text-[10px] bg-purple-50 text-purple-700 px-2 py-0.5 rounded font-sans">Liệt kê tiêu biểu</span>
                  </div>
                  <p className="text-xs text-gray-600 mb-1.5">Như là N1, N2... vân vân (còn nhiều thứ khác).</p>
                  <p className="text-xs font-medium text-purple-900 bg-purple-50/50 p-2 rounded">
                    例: 机の上に本<strong>や</strong>ペン<strong>など</strong>があります。
                  </p>
                </div>

                <div className="bg-white p-3.5 rounded-xl border border-purple-100/80 shadow-2xs">
                  <div className="font-bold text-[#8a5b61] text-sm mb-1 flex items-center justify-between">
                    <span>N1 とか N2 とか</span>
                    <span className="text-[10px] bg-purple-50 text-purple-700 px-2 py-0.5 rounded font-sans">Văn nói thân mật</span>
                  </div>
                  <p className="text-xs text-gray-600 mb-1.5">Nào là N1, nào là N2 (thường dùng trong hội thoại).</p>
                  <p className="text-xs font-medium text-purple-900 bg-purple-50/50 p-2 rounded">
                    例: 映画<strong>とか</strong>買い物<strong>とか</strong>に行きました。
                  </p>
                </div>

                <div className="bg-white p-3.5 rounded-xl border border-purple-100/80 shadow-2xs">
                  <div className="font-bold text-[#8a5b61] text-sm mb-1 flex items-center justify-between">
                    <span>N も</span>
                    <span className="text-[10px] bg-purple-50 text-purple-700 px-2 py-0.5 rounded font-sans">Cũng là N</span>
                  </div>
                  <p className="text-xs text-gray-600 mb-1.5">Đồng nhất, thay thế cho trợ từ は/が/を.</p>
                  <p className="text-xs font-medium text-purple-900 bg-purple-50/50 p-2 rounded">
                    例: 私<strong>も</strong>ベトナム人です。(Tôi cũng là người VN)
                  </p>
                </div>

                <div className="bg-white p-3.5 rounded-xl border border-purple-100/80 shadow-2xs">
                  <div className="font-bold text-[#8a5b61] text-sm mb-1 flex items-center justify-between">
                    <span>N1 の N2</span>
                    <span className="text-[10px] bg-purple-50 text-purple-700 px-2 py-0.5 rounded font-sans">Ý nghĩa phong phú</span>
                  </div>
                  <p className="text-xs text-gray-600 mb-1.5">Nối 2 danh từ với 4 mối quan hệ cốt lõi:</p>
                  <div className="text-[11px] space-y-0.5 text-gray-700">
                    <div>• <em>Xuất xứ:</em> 日本<strong>の</strong>車 (Xe Nhật)</div>
                    <div>• <em>Nội dung:</em> 日本語<strong>の</strong>本 (Sách tiếng Nhật)</div>
                    <div>• <em>Sở hữu:</em> 私<strong>の</strong>傘 (Ô của tôi)</div>
                    <div>• <em>Nguyên liệu:</em> 木<strong>の</strong>机 (Bàn gỗ)</div>
                  </div>
                </div>
              </div>

              {/* Hậu tố cuối câu (終助詞) */}
              <div className="mt-5 pt-4 border-t border-purple-100">
                <h4 className="text-xs md:text-sm font-bold text-[#8a5b61] mb-2.5 flex items-center gap-2">
                  <MessageCircle className="w-4 h-4 text-purple-600" />
                  <span>Hậu tố cuối câu (終助詞 - Trợ từ tình thái ngữ khí):</span>
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 text-center text-xs">
                  <div className="bg-white p-2.5 rounded-xl border border-purple-100">
                    <span className="font-black text-purple-800 text-sm block">ね</span>
                    <span className="text-[11px] text-gray-600">Đồng tình, xác nhận ("nhỉ", "nhé")</span>
                  </div>
                  <div className="bg-white p-2.5 rounded-xl border border-purple-100">
                    <span className="font-black text-purple-800 text-sm block">よ</span>
                    <span className="text-[11px] text-gray-600">Thông báo mới, nhấn mạnh ("đấy", "đó")</span>
                  </div>
                  <div className="bg-white p-2.5 rounded-xl border border-purple-100">
                    <span className="font-black text-purple-800 text-sm block">よね</span>
                    <span className="text-[11px] text-gray-600">Đồng thuận cả hai cùng biết ("nhỉ, đúng chứ")</span>
                  </div>
                  <div className="bg-white p-2.5 rounded-xl border border-purple-100">
                    <span className="font-black text-purple-800 text-sm block">かね</span>
                    <span className="text-[11px] text-gray-600">Tự hỏi, băn khoăn nhẹ ("liệu có... không nhỉ?")</span>
                  </div>
                  <div className="bg-white p-2.5 rounded-xl border border-purple-100">
                    <span className="font-black text-purple-800 text-sm block">さ</span>
                    <span className="text-[11px] text-gray-600">Văn nói thân mật ("thì là...", "này nhé")</span>
                  </div>
                  <div className="bg-white p-2.5 rounded-xl border border-purple-100">
                    <span className="font-black text-purple-800 text-sm block">わ</span>
                    <span className="text-[11px] text-gray-600">Làm mềm câu (thường dùng giọng nữ / Kansai)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* ---------------- 3) TÍNH TỪ & MẪU CÂU SO SÁNH HƠN ---------------- */}
            <div className="bg-gradient-to-br from-emerald-50/40 via-white to-pink-50/30 rounded-2xl p-5 md:p-6 border border-emerald-100 shadow-2xs">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2.5">
                  <span className="w-7 h-7 rounded-lg bg-[#8a5b61] text-white font-bold text-sm flex items-center justify-center shadow-xs">
                    3
                  </span>
                  <h3 className="font-serif font-black text-lg md:text-xl text-[#8a5b61]">
                    {lang === "vi" ? "Tính từ (形容詞) & Mẫu câu so sánh hơn" : "Adjectives & Comparatives"}
                  </h3>
                </div>
                <span className="text-xs font-sans font-bold text-emerald-800 bg-emerald-100/70 px-3 py-1 rounded-full border border-emerald-200">
                  {lang === "vi" ? "Đuôi い & Đuôi な" : "-i & -na Adjectives"}
                </span>
              </div>

              {/* Comprehensive Adjectives Conjugation Table */}
              <div className="overflow-x-auto rounded-xl border border-emerald-200 shadow-2xs mb-6">
                <table className="w-full text-xs text-left bg-white">
                  <thead className="bg-[#8a5b61] text-white font-bold text-[11px] uppercase tracking-wider">
                    <tr>
                      <th className="p-3">Dạng chia</th>
                      <th className="p-3">Tính từ đuôi い (い形容詞)</th>
                      <th className="p-3">Tính từ đuôi な (な形容詞)</th>
                      <th className="p-3 bg-[#744b50]">Bất quy tắc いい (Tốt)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 font-sans">
                    <tr className="hover:bg-pink-50/30">
                      <td className="p-3 font-bold text-gray-700 bg-gray-50/60">
                        Khẳng định hiện tại / tương lai
                      </td>
                      <td className="p-3">
                        <span className="font-bold text-[#8a5b61]">Aい です</span>{" "}
                        <span className="text-gray-500">(ため口: Aい)</span>
                        <div className="text-[11px] text-gray-500">例: 暑いです / 暑い</div>
                      </td>
                      <td className="p-3">
                        <span className="font-bold text-[#8a5b61]">A です</span>{" "}
                        <span className="text-gray-500">(ため口: Aだ)</span>
                        <div className="text-[11px] text-gray-500">例: 静かです / 静かだ</div>
                      </td>
                      <td className="p-3 font-medium text-emerald-800 bg-emerald-50/30">
                        いいです (ため口: いい)
                      </td>
                    </tr>
                    <tr className="hover:bg-pink-50/30">
                      <td className="p-3 font-bold text-gray-700 bg-gray-50/60">
                        Phủ định hiện tại / tương lai
                      </td>
                      <td className="p-3">
                        <span className="font-bold text-rose-600">A bỏ い + くないです</span>
                        <div className="text-[11px] text-gray-500">ため口: Aくない (暑くない)</div>
                      </td>
                      <td className="p-3">
                        <span className="font-bold text-rose-600">A bỏ な + じゃないです</span>
                        <div className="text-[11px] text-gray-500">ため口: Aじゃない (静かじゃない)</div>
                      </td>
                      <td className="p-3 font-medium text-emerald-800 bg-emerald-50/30">
                        よくないです (ため口: よくない)
                      </td>
                    </tr>
                    <tr className="hover:bg-pink-50/30">
                      <td className="p-3 font-bold text-gray-700 bg-gray-50/60">
                        Khẳng định quá khứ
                      </td>
                      <td className="p-3">
                        <span className="font-bold text-[#8a5b61]">A bỏ い + かったです</span>
                        <div className="text-[11px] text-gray-500">ため口: Aかった (暑かった)</div>
                      </td>
                      <td className="p-3">
                        <span className="font-bold text-[#8a5b61]">A bỏ な + でした</span>
                        <div className="text-[11px] text-gray-500">ため口: Aだった (静かだった)</div>
                      </td>
                      <td className="p-3 font-medium text-emerald-800 bg-emerald-50/30">
                        よかったです (ため口: よかった)
                      </td>
                    </tr>
                    <tr className="hover:bg-pink-50/30">
                      <td className="p-3 font-bold text-gray-700 bg-gray-50/60">
                        Phủ định quá khứ
                      </td>
                      <td className="p-3">
                        <span className="font-bold text-rose-600">A bỏ い + くなかったです</span>
                        <div className="text-[11px] text-gray-500">ため口: Aくなかった (暑くなかった)</div>
                      </td>
                      <td className="p-3">
                        <span className="font-bold text-rose-600">A bỏ な + じゃなかったです</span>
                        <div className="text-[11px] text-gray-500">ため口: Aじゃなかった (静かじゃなかった)</div>
                      </td>
                      <td className="p-3 font-medium text-emerald-800 bg-emerald-50/30">
                        よくなかったです (よくなかった)
                      </td>
                    </tr>
                    <tr className="hover:bg-pink-50/30">
                      <td className="p-3 font-bold text-gray-700 bg-gray-50/60">
                        Nối 2 tính từ
                      </td>
                      <td className="p-3">
                        <span className="font-bold text-indigo-700">A bỏ い + くて、A2</span>
                        <div className="text-[11px] text-gray-500">例: かわいくて、面白い</div>
                      </td>
                      <td className="p-3">
                        <span className="font-bold text-indigo-700">A bỏ な + で、A2</span>
                        <div className="text-[11px] text-gray-500">例: 静かで、広い</div>
                      </td>
                      <td className="p-3 font-medium text-emerald-800 bg-emerald-50/30">
                        よくて、...
                      </td>
                    </tr>
                    <tr className="hover:bg-pink-50/30">
                      <td className="p-3 font-bold text-gray-700 bg-gray-50/60">
                        Bổ nghĩa Danh từ (N)
                      </td>
                      <td className="p-3">
                        <span className="font-bold text-teal-700">Aい + N</span>
                        <div className="text-[11px] text-gray-500">例: おいしい料理 (Món ngon)</div>
                      </td>
                      <td className="p-3">
                        <span className="font-bold text-teal-700">Aな + N</span>
                        <div className="text-[11px] text-gray-500">例: きれいな町 (Thị trấn đẹp)</div>
                      </td>
                      <td className="p-3 font-medium text-emerald-800 bg-emerald-50/30">
                        いい + N (いい人)
                      </td>
                    </tr>
                    <tr className="hover:bg-pink-50/30">
                      <td className="p-3 font-bold text-gray-700 bg-gray-50/60">
                        Biến thành phó từ (bổ nghĩa V)
                      </td>
                      <td className="p-3">
                        <span className="font-bold text-amber-700">A bỏ い + く + V</span>
                        <div className="text-[11px] text-gray-500">例: 早く起きます (Dậy sớm)</div>
                      </td>
                      <td className="p-3">
                        <span className="font-bold text-amber-700">A bỏ な + に + V</span>
                        <div className="text-[11px] text-gray-500">例: きれいに掃除しました (Dọn sạch)</div>
                      </td>
                      <td className="p-3 font-medium text-emerald-800 bg-emerald-50/30">
                        よく + V (よく勉強します)
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Mẫu câu so sánh hơn */}
              <div className="bg-white rounded-xl p-4 md:p-5 border border-emerald-200">
                <h4 className="font-bold text-sm md:text-base text-[#8a5b61] mb-3 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-emerald-600" />
                  <span>Mẫu câu so sánh hơn (比較の文型):</span>
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs md:text-sm">
                  <div className="p-3 rounded-xl bg-emerald-50/50 border border-emerald-100">
                    <div className="font-black text-[#8a5b61] mb-1">
                      1. N1 は N2 より A です。
                    </div>
                    <p className="text-gray-600 text-xs mb-1">Ý nghĩa: N1 thì A hơn N2.</p>
                    <p className="text-emerald-900 font-medium bg-white/80 p-2 rounded border border-emerald-100">
                      例: 北海道は 東京<strong>より</strong> 寒いです。(Hokkaido thì lạnh hơn Tokyo.)
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-emerald-50/50 border border-emerald-100">
                    <div className="font-black text-[#8a5b61] mb-1">
                      2. N1 は より A です。
                    </div>
                    <p className="text-gray-600 text-xs mb-1">Ý nghĩa: N1 thì càng A hơn (khi N2 đã rõ qua ngữ cảnh).</p>
                    <p className="text-emerald-900 font-medium bg-white/80 p-2 rounded border border-emerald-100">
                      例: この靴は <strong>より</strong> 軽いです。(Đôi giày này thì nhẹ hơn.)
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-emerald-50/50 border border-emerald-100">
                    <div className="font-black text-[#8a5b61] mb-1">
                      3. N2 より N1 の方が A です。
                    </div>
                    <p className="text-gray-600 text-xs mb-1">Ý nghĩa: So với N2 thì phía N1 có phần A hơn.</p>
                    <p className="text-emerald-900 font-medium bg-white/80 p-2 rounded border border-emerald-100">
                      例: コーヒーより お茶<strong>のほうが</strong> 好きです。(So với cà phê thì tôi thích trà hơn.)
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-emerald-50/50 border border-emerald-100">
                    <div className="font-black text-[#8a5b61] mb-1">
                      4. N1 の方が A です。
                    </div>
                    <p className="text-gray-600 text-xs mb-1">Ý nghĩa: N1 thì A hơn (thường dùng đáp lại câu hỏi lựa chọn).</p>
                    <p className="text-emerald-900 font-medium bg-white/80 p-2 rounded border border-emerald-100">
                      例: 「どちらがいいですか」→「大きい<strong>のほうが</strong> いいです。」(Cái to hơn thì tốt hơn.)
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ======================================================== */}
      {/* 2. MỤC: TỪ VỰNG BUỔI 1 (FLASHCARD, DANH SÁCH & BÀI TẬP 4 DẠNG 100%) */}
      {/* ======================================================== */}
      {(activeTab === "both" || activeTab === "vocab") && (
        <N4Lesson1VocabView lang={lang} />
      )}

      {/* ======================================================== */}
      {/* 3. MỤC: BÀI TẬP VỀ NHÀ BUỔI 1 */}
      {/* ======================================================== */}
      {(activeTab === "both" || activeTab === "homework") && (
        <section className="bg-white/90 backdrop-blur-xl rounded-3xl p-5 md:p-8 border border-pink-100 shadow-sm transition-all">
          {/* Header of Homework */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-5 mb-6 border-b border-pink-100">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-[#c99fa5] text-white flex items-center justify-center font-bold shadow-md">
                <Pencil className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-[#8a5b61] bg-[#8a5b61]/10 px-2.5 py-0.5 rounded-full">
                    {lang === "vi" ? "Bài tập củng cố N4" : "N4 Reinforcement Homework"}
                  </span>
                  <span className="text-xs font-medium text-emerald-600 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    {lang === "vi" ? "Có chấm điểm & Lời giải AI" : "Scoring & AI Feedback"}
                  </span>
                </div>
                <h2 className="font-serif font-black text-xl md:text-2xl text-[#8a5b61] mt-0.5">
                  {lang === "vi" ? "Bài tập về nhà: Buổi 1" : "Session 1 Homework"}
                </h2>
              </div>
            </div>

            {hasSubmitted ? (
              <button
                onClick={() => setShowAnswerKeys(!showAnswerKeys)}
                className="px-3.5 py-1.5 rounded-xl text-xs font-bold font-sans bg-pink-50 hover:bg-pink-100 text-[#8a5b61] border border-pink-200 transition-all cursor-pointer flex items-center gap-1.5 shadow-xs"
              >
                <HelpCircle className="w-3.5 h-3.5" />
                <span>
                  {showAnswerKeys
                    ? lang === "vi"
                      ? "Ẩn gợi ý đáp án"
                      : "Hide Hints"
                    : lang === "vi"
                    ? "Hiện gợi ý đáp án"
                    : "Show Hints"}
                </span>
              </button>
            ) : (
              <div className="text-[11px] font-sans font-medium text-gray-500 bg-gray-100/80 px-3 py-1.5 rounded-xl flex items-center gap-1.5 border border-gray-200">
                <Info className="w-3.5 h-3.5 text-[#8a5b61]" />
                <span>
                  {lang === "vi"
                    ? "Gợi ý đáp án sẽ mở sau khi nộp bài (bấm 完成)"
                    : "Answers unlock after submitting (click 完成)"}
                </span>
              </div>
            )}
          </div>

          <div className="space-y-8">
            {/* ---------------- BÀI 1: ĐIỀN TỪ VÀO TRONG NGOẶC ---------------- */}
            <div className="bg-gradient-to-br from-pink-50/50 via-white to-amber-50/30 rounded-2xl p-5 md:p-6 border border-pink-200 shadow-2xs">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-serif font-black text-base md:text-lg text-[#8a5b61] flex items-center gap-2">
                  <span className="w-6 h-6 rounded-md bg-[#8a5b61] text-white text-xs font-bold flex items-center justify-center">
                    I
                  </span>
                  <span>Bài 1: Điền từ vào trong ngoặc</span>
                </h3>
                <span className="text-xs text-gray-500 font-sans">10 vị trí điền</span>
              </div>
              <p className="text-xs text-gray-600 mb-4 font-sans">
                Hãy đọc kỹ ngữ cảnh hai đoạn hội thoại dưới đây và điền trợ từ hoặc hậu tố ngữ khí phù hợp nhất vào từng ô trống.
              </p>

              {/* Dialogue 1 */}
              <div className="bg-white/95 rounded-xl p-4 border border-pink-100 mb-4 shadow-2xs">
                <div className="font-bold text-xs text-[#8a5b61] mb-2 uppercase tracking-wide">
                  Đoạn hội thoại 1 (Hỏi vị trí và đặt tài liệu):
                </div>
                <div className="space-y-2 text-xs md:text-sm text-gray-800 leading-relaxed font-sans">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="font-bold text-[#8a5b61]">A:</span>
                    <span>すみません、田中さん (</span>
                    <input
                      type="text"
                      maxLength={3}
                      placeholder=" 1 "
                      value={bai1Inputs[1]}
                      onChange={(e) => setBai1Inputs({ ...bai1Inputs, 1: e.target.value })}
                      className={`w-12 text-center font-bold px-1.5 py-1 text-xs rounded-lg border focus:outline-none transition-all ${
                        isRevealed
                          ? bai1Answers[1].includes(bai1Inputs[1].trim())
                            ? "bg-emerald-50 border-emerald-400 text-emerald-800"
                            : "bg-rose-50 border-rose-300 text-rose-700"
                          : "bg-gray-50 border-gray-300 focus:border-[#8a5b61]"
                      }`}
                    />
                    <span>) 席はどこですか。</span>
                    {isRevealed && (
                      <span className="text-[11px] text-emerald-700 font-bold ml-1">
                        [Đ/A: の]
                      </span>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="font-bold text-teal-700">B:</span>
                    <span>あそこです。あの黒くて大きいかばんがあるところです (</span>
                    <input
                      type="text"
                      maxLength={3}
                      placeholder=" 2 "
                      value={bai1Inputs[2]}
                      onChange={(e) => setBai1Inputs({ ...bai1Inputs, 2: e.target.value })}
                      className={`w-12 text-center font-bold px-1.5 py-1 text-xs rounded-lg border focus:outline-none transition-all ${
                        isRevealed
                          ? bai1Answers[2].includes(bai1Inputs[2].trim())
                            ? "bg-emerald-50 border-emerald-400 text-emerald-800"
                            : "bg-rose-50 border-rose-300 text-rose-700"
                          : "bg-gray-50 border-gray-300 focus:border-[#8a5b61]"
                      }`}
                    />
                    <span>)。</span>
                    {isRevealed && (
                      <span className="text-[11px] text-emerald-700 font-bold ml-1">
                        [Đ/A: よ / ね]
                      </span>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="font-bold text-[#8a5b61]">A:</span>
                    <span>ああ、あそこです (</span>
                    <input
                      type="text"
                      maxLength={3}
                      placeholder=" 3 "
                      value={bai1Inputs[3]}
                      onChange={(e) => setBai1Inputs({ ...bai1Inputs, 3: e.target.value })}
                      className={`w-12 text-center font-bold px-1.5 py-1 text-xs rounded-lg border focus:outline-none transition-all ${
                        isRevealed
                          ? bai1Answers[3].includes(bai1Inputs[3].trim())
                            ? "bg-emerald-50 border-emerald-400 text-emerald-800"
                            : "bg-rose-50 border-rose-300 text-rose-700"
                          : "bg-gray-50 border-gray-300 focus:border-[#8a5b61]"
                      }`}
                    />
                    <span>)。ありがとうございました。</span>
                    {isRevealed && (
                      <span className="text-[11px] text-emerald-700 font-bold ml-1">
                        [Đ/A: ね]
                      </span>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="font-bold text-teal-700">B:</span>
                    <span>田中さん (</span>
                    <input
                      type="text"
                      maxLength={3}
                      placeholder=" 4 "
                      value={bai1Inputs[4]}
                      onChange={(e) => setBai1Inputs({ ...bai1Inputs, 4: e.target.value })}
                      className={`w-12 text-center font-bold px-1.5 py-1 text-xs rounded-lg border focus:outline-none transition-all ${
                        isRevealed
                          ? bai1Answers[4].includes(bai1Inputs[4].trim())
                            ? "bg-emerald-50 border-emerald-400 text-emerald-800"
                            : "bg-rose-50 border-rose-300 text-rose-700"
                          : "bg-gray-50 border-gray-300 focus:border-[#8a5b61]"
                      }`}
                    />
                    <span>) 資料ですか。</span>
                    {isRevealed && (
                      <span className="text-[11px] text-emerald-700 font-bold ml-1">
                        [Đ/A: の]
                      </span>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="font-bold text-[#8a5b61]">A:</span>
                    <span>はい、そうです。田中さん (</span>
                    <input
                      type="text"
                      maxLength={3}
                      placeholder=" 5 "
                      value={bai1Inputs[5]}
                      onChange={(e) => setBai1Inputs({ ...bai1Inputs, 5: e.target.value })}
                      className={`w-12 text-center font-bold px-1.5 py-1 text-xs rounded-lg border focus:outline-none transition-all ${
                        isRevealed
                          ? bai1Answers[5].includes(bai1Inputs[5].trim())
                            ? "bg-emerald-50 border-emerald-400 text-emerald-800"
                            : "bg-rose-50 border-rose-300 text-rose-700"
                          : "bg-gray-50 border-gray-300 focus:border-[#8a5b61]"
                      }`}
                    />
                    <span>) テーブル (</span>
                    <input
                      type="text"
                      maxLength={3}
                      placeholder=" 6 "
                      value={bai1Inputs[6]}
                      onChange={(e) => setBai1Inputs({ ...bai1Inputs, 6: e.target.value })}
                      className={`w-12 text-center font-bold px-1.5 py-1 text-xs rounded-lg border focus:outline-none transition-all ${
                        isRevealed
                          ? bai1Answers[6].includes(bai1Inputs[6].trim())
                            ? "bg-emerald-50 border-emerald-400 text-emerald-800"
                            : "bg-rose-50 border-rose-300 text-rose-700"
                          : "bg-gray-50 border-gray-300 focus:border-[#8a5b61]"
                      }`}
                    />
                    <span>) 上に置きますね。</span>
                    {isRevealed && (
                      <span className="text-[11px] text-emerald-700 font-bold ml-1">
                        [Đ/A: (5) の, (6) の]
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Dialogue 2 */}
              <div className="bg-white/95 rounded-xl p-4 border border-pink-100 shadow-2xs">
                <div className="font-bold text-xs text-[#8a5b61] mb-2 uppercase tracking-wide">
                  Đoạn hội thoại 2 (Rủ bạn bè đi ăn tối - Khẩu ngữ thân mật ため口):
                </div>
                <div className="space-y-2 text-xs md:text-sm text-gray-800 leading-relaxed font-sans">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="font-bold text-[#8a5b61]">A:</span>
                    <span>今晩 (</span>
                    <input
                      type="text"
                      maxLength={3}
                      placeholder=" 7 "
                      value={bai1Inputs[7]}
                      onChange={(e) => setBai1Inputs({ ...bai1Inputs, 7: e.target.value })}
                      className={`w-12 text-center font-bold px-1.5 py-1 text-xs rounded-lg border focus:outline-none transition-all ${
                        isRevealed
                          ? bai1Answers[7].includes(bai1Inputs[7].trim())
                            ? "bg-emerald-50 border-emerald-400 text-emerald-800"
                            : "bg-rose-50 border-rose-300 text-rose-700"
                          : "bg-gray-50 border-gray-300 focus:border-[#8a5b61]"
                      }`}
                    />
                    <span>) 暇？</span>
                    {isRevealed && (
                      <span className="text-[11px] text-emerald-700 font-bold ml-1">
                        [Đ/A: は (hoặc lược bỏ trong văn nói)]
                      </span>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="font-bold text-indigo-700">B:</span>
                    <span>ごめん、友達 (</span>
                    <input
                      type="text"
                      maxLength={3}
                      placeholder=" 8 "
                      value={bai1Inputs[8]}
                      onChange={(e) => setBai1Inputs({ ...bai1Inputs, 8: e.target.value })}
                      className={`w-12 text-center font-bold px-1.5 py-1 text-xs rounded-lg border focus:outline-none transition-all ${
                        isRevealed
                          ? bai1Answers[8].includes(bai1Inputs[8].trim())
                            ? "bg-emerald-50 border-emerald-400 text-emerald-800"
                            : "bg-rose-50 border-rose-300 text-rose-700"
                          : "bg-gray-50 border-gray-300 focus:border-[#8a5b61]"
                      }`}
                    />
                    <span>) 遊びに行く予定がある。なんかある？</span>
                    {isRevealed && (
                      <span className="text-[11px] text-emerald-700 font-bold ml-1">
                        [Đ/A: と]
                      </span>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="font-bold text-[#8a5b61]">A:</span>
                    <span>ううん、特に何 (</span>
                    <input
                      type="text"
                      maxLength={3}
                      placeholder=" 9 "
                      value={bai1Inputs[9]}
                      onChange={(e) => setBai1Inputs({ ...bai1Inputs, 9: e.target.value })}
                      className={`w-12 text-center font-bold px-1.5 py-1 text-xs rounded-lg border focus:outline-none transition-all ${
                        isRevealed
                          ? bai1Answers[9].includes(bai1Inputs[9].trim())
                            ? "bg-emerald-50 border-emerald-400 text-emerald-800"
                            : "bg-rose-50 border-rose-300 text-rose-700"
                          : "bg-gray-50 border-gray-300 focus:border-[#8a5b61]"
                      }`}
                    />
                    <span>) ない。時間があったら、一緒に食事をしたいなと思った。</span>
                    {isRevealed && (
                      <span className="text-[11px] text-emerald-700 font-bold ml-1">
                        [Đ/A: も]
                      </span>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="font-bold text-indigo-700">B:</span>
                    <span>へえ～、そうなんだ。明日 (</span>
                    <input
                      type="text"
                      maxLength={3}
                      placeholder=" 10 "
                      value={bai1Inputs[10]}
                      onChange={(e) => setBai1Inputs({ ...bai1Inputs, 10: e.target.value })}
                      className={`w-12 text-center font-bold px-1.5 py-1 text-xs rounded-lg border focus:outline-none transition-all ${
                        isRevealed
                          ? bai1Answers[10].includes(bai1Inputs[10].trim())
                            ? "bg-emerald-50 border-emerald-400 text-emerald-800"
                            : "bg-rose-50 border-rose-300 text-rose-700"
                          : "bg-gray-50 border-gray-300 focus:border-[#8a5b61]"
                      }`}
                    />
                    <span>)？</span>
                    {isRevealed && (
                      <span className="text-[11px] text-emerald-700 font-bold ml-1">
                        [Đ/A: は]
                      </span>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="font-bold text-[#8a5b61]">A:</span>
                    <span>うん、明日でもいいね。また明日ね。</span>
                  </div>
                </div>
              </div>
            </div>

            {/* ---------------- BÀI 2: CHIA DẠNG ĐÚNG CỦA TỪ TRONG NGOẶC ---------------- */}
            <div className="bg-gradient-to-br from-indigo-50/50 via-white to-pink-50/30 rounded-2xl p-5 md:p-6 border border-indigo-100 shadow-2xs">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-serif font-black text-base md:text-lg text-[#8a5b61] flex items-center gap-2">
                  <span className="w-6 h-6 rounded-md bg-[#8a5b61] text-white text-xs font-bold flex items-center justify-center">
                    II
                  </span>
                  <span>Bài 2: Chia dạng đúng của từ trong ngoặc</span>
                </h3>
                <span className="text-xs text-gray-500 font-sans">10 câu luyện tập</span>
              </div>
              <p className="text-xs text-gray-600 mb-4 font-sans">
                Dựa trên quy tắc chia thì thể tính từ đuôi い, đuôi な, cách nối tính từ và cấu trúc so sánh hơn, hãy chia từ trong ngoặc về dạng chuẩn xác nhất.
              </p>

              <div className="space-y-3 font-sans">
                {bai2Questions.map((q) => {
                  const userVal = (bai2Inputs[q.id] || "").trim();
                  const isCorrect = q.correctAnswers.some((ans) => ans === userVal);

                  return (
                    <div
                      key={q.id}
                      className="bg-white p-3.5 rounded-xl border border-indigo-100 shadow-2xs transition-all hover:border-pink-200"
                    >
                      <div className="flex flex-wrap items-center gap-2 text-xs md:text-sm text-gray-800">
                        <span className="w-6 h-6 rounded-full bg-indigo-50 text-indigo-700 font-bold text-xs flex items-center justify-center shrink-0">
                          {q.id}
                        </span>
                        <span>{q.prefix}</span>
                        <input
                          type="text"
                          placeholder="Nhập dạng đúng..."
                          value={bai2Inputs[q.id]}
                          onChange={(e) => setBai2Inputs({ ...bai2Inputs, [q.id]: e.target.value })}
                          className={`min-w-[140px] md:min-w-[200px] px-3 py-1 font-medium text-xs rounded-lg border focus:outline-none transition-all ${
                            isRevealed
                              ? isCorrect
                                ? "bg-emerald-50 border-emerald-400 text-emerald-800"
                                : "bg-rose-50 border-rose-300 text-rose-700"
                              : "bg-gray-50 border-gray-300 focus:border-[#8a5b61]"
                          }`}
                        />
                        <span>{q.suffix}</span>

                        {isRevealed && (
                          <div className="w-full mt-1.5 pl-8 text-xs">
                            <span className="font-bold text-emerald-700">
                              ✓ Đáp án: {q.correctAnswers[0]}
                            </span>
                            <span className="text-gray-500 ml-2">({q.explanation})</span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* ---------------- BÀI 3: ĐỌC HIỂU ---------------- */}
            <div className="bg-gradient-to-br from-emerald-50/50 via-white to-pink-50/30 rounded-2xl p-5 md:p-6 border border-emerald-100 shadow-2xs">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-serif font-black text-base md:text-lg text-[#8a5b61] flex items-center gap-2">
                  <span className="w-6 h-6 rounded-md bg-[#8a5b61] text-white text-xs font-bold flex items-center justify-center">
                    III
                  </span>
                  <span>Bài 3: Đọc hiểu (読解 - Reading Comprehension)</span>
                </h3>
                <span className="text-xs font-sans font-bold text-emerald-800 bg-emerald-100/70 px-3 py-1 rounded-full border border-emerald-200">
                  3億円の夢
                </span>
              </div>

              {/* Reading Passage Image */}
              <div className="bg-white rounded-2xl p-4 md:p-6 border border-emerald-200 mb-6 shadow-2xs">
                <div className="mb-3">
                  <span className="text-xs font-bold text-[#8a5b61] uppercase tracking-wide flex items-center gap-1.5">
                    <BookOpen className="w-4 h-4 text-[#8a5b61]" />
                    Đoạn văn đọc hiểu
                  </span>
                </div>

                {/* Display Passage Image - Large and Clear */}
                <div className="rounded-2xl overflow-hidden border border-emerald-200 bg-white p-2 md:p-4 shadow-sm flex items-center justify-center">
                  <img
                    src="https://i.postimg.cc/YStNDTgz/btvn_doc_hieu_1.png"
                    alt="Đoạn văn đọc hiểu bài tập về nhà Buổi 1"
                    className="w-full max-w-3xl h-auto object-contain rounded-xl shadow-xs"
                  />
                </div>
              </div>

              {/* Sub-question 1: Câu 1 */}
              <div className="bg-white rounded-2xl p-4 md:p-6 border border-emerald-200 mb-6 shadow-2xs">
                <div className="mb-3">
                  <h4 className="font-bold text-sm md:text-base text-[#8a5b61] flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center justify-center shrink-0">
                      1
                    </span>
                    <span>Câu 1: Sắp xếp các tranh theo đúng thứ tự trong bài đọc</span>
                  </h4>
                </div>

                {/* Question 1 Image - Large and Clear */}
                <div className="rounded-2xl overflow-hidden border border-emerald-200 bg-white p-2 md:p-4 shadow-sm flex items-center justify-center mb-4">
                  <img
                    src="https://i.postimg.cc/GmFJQbB7/btvn_doc_hieu_1-1.png"
                    alt="Sắp xếp các tranh theo đúng thứ tự trong bài đọc"
                    className="w-full max-w-3xl h-auto object-contain rounded-xl shadow-xs"
                  />
                </div>

                {/* Interactive choice for Question 1 */}
                <div className="space-y-3 font-sans text-xs">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="font-bold text-gray-700">
                      Chọn phương án sắp xếp thứ tự tranh đúng nhất theo bài đọc:
                    </p>
                    {isRevealed && (
                      <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                        Đáp án đúng: E ➟ A ➟ D ➟ C ➟ F ➟ B
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {[
                      {
                        id: "1",
                        seq: "E ➟ A ➟ D ➟ C ➟ F ➟ B",
                        isCorrect: true,
                      },
                      {
                        id: "2",
                        seq: "E ➟ D ➟ A ➟ C ➟ B ➟ F",
                        isCorrect: false,
                      },
                      {
                        id: "3",
                        seq: "E ➟ A ➟ C ➟ D ➟ F ➟ B",
                        isCorrect: false,
                      },
                      {
                        id: "4",
                        seq: "E ➟ D ➟ C ➟ F ➟ A ➟ B",
                        isCorrect: false,
                      },
                    ].map((opt) => {
                      const isSelected = selectedBai3Answer === opt.id;
                      let cardStyle =
                        "bg-gray-50 hover:bg-gray-100 text-gray-700 border-gray-200";

                      if (isRevealed) {
                        if (opt.isCorrect) {
                          cardStyle =
                            "bg-emerald-50 border-emerald-400 text-emerald-950 font-bold ring-2 ring-emerald-300 shadow-2xs";
                        } else if (isSelected) {
                          cardStyle =
                            "bg-rose-50 border-rose-300 text-rose-800 line-through opacity-85";
                        }
                      } else if (isSelected) {
                        cardStyle =
                          "bg-[#8a5b61] text-white border-[#8a5b61] shadow-2xs font-bold";
                      }

                      return (
                        <button
                          key={opt.id}
                          onClick={() => setSelectedBai3Answer(opt.id)}
                          className={`p-3 md:p-3.5 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between gap-2.5 ${cardStyle}`}
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <span
                              className={`w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center shrink-0 ${
                                isRevealed && opt.isCorrect
                                  ? "bg-emerald-600 text-white"
                                  : isSelected && !isRevealed
                                  ? "bg-white text-[#8a5b61]"
                                  : "bg-gray-200 text-gray-700"
                              }`}
                            >
                              {opt.id}
                            </span>
                            <span className="font-mono text-xs md:text-sm tracking-wide truncate">
                              {opt.seq}
                            </span>
                          </div>

                          {isRevealed && opt.isCorrect && (
                            <span className="text-emerald-700 font-bold text-[11px] flex items-center gap-1 shrink-0">
                              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                              Đúng ✓
                            </span>
                          )}
                          {isRevealed && isSelected && !opt.isCorrect && (
                            <span className="text-rose-600 font-bold text-[11px] flex items-center gap-1 shrink-0">
                              <XCircle className="w-4 h-4 text-rose-500" />
                              Sai
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {isRevealed && (
                    <div className="mt-3 p-3.5 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-950 space-y-2">
                      <div className="font-bold text-emerald-800 flex items-center gap-1.5 text-sm">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>Đáp án đúng: E ➟ A ➟ D ➟ C ➟ F ➟ B</span>
                      </div>
                      <div className="text-gray-700 leading-relaxed text-[11px] md:text-xs space-y-1">
                        <p className="font-semibold text-emerald-900">
                          Thứ tự các sự việc trong bài đọc:
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-1.5 pt-0.5">
                          <div>• <strong>E:</strong> Mua vé số ước mơ (宝くじを買う)</div>
                          <div>• <strong>A:</strong> Bất ngờ trúng giải 300 triệu yên (３億円が当たる)</div>
                          <div>• <strong>D:</strong> Vui mừng khôn xiết và báo tin vui (大喜びする)</div>
                          <div>• <strong>C:</strong> Lên kế hoạch đi du lịch vòng quanh thế giới (世界一周旅行)</div>
                          <div>• <strong>F:</strong> Mua ngôi nhà to đẹp và sắm xe mới (大きな家や車を買う)</div>
                          <div>• <strong>B:</strong> Tận hưởng trọn vẹn cuộc sống hạnh phúc (幸せな生活を送る)</div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Sub-question 2: Câu 2 with AI Grammar and Word-Usage Correction */}
              <div className="bg-white rounded-2xl p-4 md:p-6 border border-pink-200 shadow-2xs">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-bold text-sm md:text-base text-[#8a5b61] flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-pink-100 text-pink-800 text-xs font-bold flex items-center justify-center shrink-0">
                      2
                    </span>
                    <span>Câu 2: あなたは ３億円で 何を したいですか。</span>
                  </h4>
                  <span className="text-[11px] font-bold text-pink-700 bg-pink-50 px-2.5 py-1 rounded-full border border-pink-200 flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5" />
                    AI Giáo viên chữa bài
                  </span>
                </div>

                {/* Input Textarea */}
                <div className="relative mb-3">
                  <textarea
                    rows={3}
                    value={bai3Question2Input}
                    onChange={(e) => setBai3Question2Input(e.target.value)}
                    placeholder="Nhập câu trả lời bằng tiếng Nhật của bạn ở đây..."
                    className="w-full p-3.5 text-xs md:text-sm font-sans bg-pink-50/30 rounded-xl border border-pink-200 focus:border-[#8a5b61] focus:outline-none focus:bg-white transition-all resize-none"
                  />
                  {bai3Question2Input.trim() && (
                    <button
                      onClick={() => playJapaneseAudio(bai3Question2Input)}
                      className="absolute right-3 bottom-3 text-gray-400 hover:text-[#8a5b61] p-1 bg-white rounded-lg border border-pink-200 shadow-2xs"
                      title="Nghe câu bạn vừa viết"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {/* Action Button: AI Check */}
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <button
                    disabled={isAiLoading || !bai3Question2Input.trim()}
                    onClick={handleAiCheck}
                    className={`px-4 py-2 rounded-xl text-xs font-bold font-sans flex items-center gap-2 transition-all cursor-pointer shadow-sm ${
                      isAiLoading || !bai3Question2Input.trim()
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200"
                        : "bg-[#8a5b61] hover:bg-[#744b50] text-white active:scale-95"
                    }`}
                  >
                    {isAiLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Đang nhờ Emichan-sensei chữa bài...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" />
                        <span>Chữa ngữ pháp & Cách dùng từ (AI)</span>
                      </>
                    )}
                  </button>

                  <span className="text-[11px] text-gray-400 font-sans">
                    * AI sẽ phân tích trợ từ, dạng chia động từ và đưa ra câu tự nhiên nhất.
                  </span>
                </div>

                {/* AI Feedback display box */}
                {aiFeedback && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4 p-4 md:p-5 rounded-2xl bg-gradient-to-br from-pink-50/90 via-white to-rose-50/80 border border-pink-200 text-xs md:text-sm text-gray-800 font-sans leading-relaxed shadow-sm space-y-3"
                  >
                    <div className="flex items-center gap-2 font-bold text-[#8a5b61] border-b border-pink-200 pb-2">
                      <Sparkles className="w-4 h-4 text-pink-600" />
                      <span>Kết quả phân tích từ Giáo viên Emichan:</span>
                    </div>
                    <div className="whitespace-pre-line text-xs md:text-sm text-gray-700 leading-relaxed font-sans">
                      {aiFeedback}
                    </div>
                  </motion.div>
                )}
              </div>
            </div>

            {/* ---------------- BIG COMPLETION BUTTON: "完成" ---------------- */}
            <div className="pt-6 border-t border-pink-100 text-center">
              <p className="text-xs text-gray-500 font-sans mb-3">
                Sau khi làm xong tất cả các bài tập trên, hãy bấm nút hoàn thành bên dưới để gửi bài và nhận lời chúc từ cô giáo nhé!
              </p>

              <button
                onClick={handleCompleteHomework}
                className="px-10 py-3.5 rounded-2xl bg-gradient-to-r from-[#8a5b61] via-[#a86b73] to-[#8a5b61] hover:from-[#744b50] hover:to-[#744b50] text-white font-serif font-black text-lg md:text-xl shadow-lg hover:shadow-xl hover:scale-103 active:scale-97 transition-all cursor-pointer flex items-center justify-center gap-2.5 mx-auto"
              >
                <Award className="w-6 h-6 text-yellow-300" />
                <span>完成 (Hoàn thành)</span>
                <Sparkles className="w-5 h-5 text-yellow-200 animate-pulse" />
              </button>
            </div>
          </div>
        </section>
      )}

      {/* ======================================================== */}
      {/* 3. MODAL CHÚC MỪNG: ẢNH CÔ GÁI NÓI "今日も一日 お疲れ様でした。" */}
      {/* ======================================================== */}
      <AnimatePresence>
        {showCompletionModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.85, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.85, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="bg-white/95 backdrop-blur-2xl rounded-3xl max-w-lg w-full overflow-hidden border border-pink-200 shadow-2xl relative"
            >
              {/* Top celebration banner */}
              <div className="bg-gradient-to-r from-pink-500 via-rose-500 to-amber-500 p-4 text-white text-center relative overflow-hidden">
                {/* Nút nghe lại gắn góc phía trên bên phải: CHỈ GẮN HÌNH LOA CHỨ KHÔNG VIẾT CHỮ */}
                <button
                  onClick={startCelebration}
                  className="absolute top-3 right-3 md:top-3.5 md:right-3.5 w-9 h-9 rounded-full bg-white/25 hover:bg-white/40 active:scale-90 text-white flex items-center justify-center border border-white/40 backdrop-blur-md shadow-md transition-all cursor-pointer z-30"
                  title="Nghe lại âm thanh"
                  aria-label="Nghe lại"
                >
                  <Volume2 className={`w-5 h-5 ${isPlayingCelebration ? "animate-pulse text-yellow-200" : "text-white"}`} />
                </button>

                <div className="flex items-center justify-center gap-2 font-serif font-black text-lg tracking-wide pr-8">
                  <Sparkles className="w-5 h-5 text-yellow-200 animate-bounce" />
                  <span>XUẤT SẮC HOÀN THÀNH BUỔI 1!</span>
                  <Sparkles className="w-5 h-5 text-yellow-200 animate-bounce" />
                </div>
                <p className="text-xs text-pink-100 font-sans mt-0.5">
                  Bạn đã hoàn tất toàn bộ lý thuyết và bài tập củng cố của Buổi 1 N4!
                </p>
              </div>

              {/* Main Illustration: Cô gái chúc mừng (không khung viền hồng) */}
              <div className="p-5 md:p-6 text-center space-y-4 max-h-[82vh] overflow-y-auto">
                <div className="max-w-[190px] md:max-w-[230px] mx-auto flex items-center justify-center">
                  <img
                    src="https://i.postimg.cc/pTxY9rPy/otukare.png"
                    alt="Hoàn thành bài tập"
                    className="w-full h-auto max-h-56 md:max-h-60 object-contain drop-shadow-sm"
                  />
                </div>

                {/* Score Summary */}
                {(() => {
                  const {
                    correct1,
                    unanswered1,
                    correct2,
                    unanswered2,
                    bai3Q1Correct,
                    bai3Unanswered,
                  } = calculateDetailedSummary();
                  return (
                    <div className="bg-pink-50/70 rounded-2xl p-3.5 border border-pink-200 text-xs text-gray-700 space-y-2">
                      <div className="font-bold text-emerald-700 text-sm flex items-center justify-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>Đã nộp bài ✓</span>
                      </div>

                      <div className="grid grid-cols-3 gap-2 pt-1 text-center font-sans">
                        {/* Bài 1 */}
                        <div className="bg-white/80 p-2.5 rounded-xl border border-pink-100 shadow-2xs">
                          <span className="block text-gray-700 font-bold text-xs mb-1">
                            Bài 1
                          </span>
                          <div className="text-xs">
                            <span className="text-emerald-700 font-black">
                              Đúng: {correct1}/10
                            </span>
                          </div>
                          <div className="text-[11px] text-gray-500 mt-0.5">
                            Chưa điền:{" "}
                            <span
                              className={
                                unanswered1 > 0
                                  ? "font-bold text-rose-600"
                                  : "font-bold text-gray-700"
                              }
                            >
                              {unanswered1}
                            </span>
                          </div>
                        </div>

                        {/* Bài 2 */}
                        <div className="bg-white/80 p-2.5 rounded-xl border border-pink-100 shadow-2xs">
                          <span className="block text-gray-700 font-bold text-xs mb-1">
                            Bài 2
                          </span>
                          <div className="text-xs">
                            <span className="text-emerald-700 font-black">
                              Đúng: {correct2}/10
                            </span>
                          </div>
                          <div className="text-[11px] text-gray-500 mt-0.5">
                            Chưa điền:{" "}
                            <span
                              className={
                                unanswered2 > 0
                                  ? "font-bold text-rose-600"
                                  : "font-bold text-gray-700"
                              }
                            >
                              {unanswered2}
                            </span>
                          </div>
                        </div>

                        {/* Bài 3 */}
                        <div className="bg-white/80 p-2.5 rounded-xl border border-pink-100 shadow-2xs">
                          <span className="block text-gray-700 font-bold text-xs mb-1">
                            Bài 3
                          </span>
                          <div className="text-xs">
                            <span className="text-emerald-700 font-black">
                              Đúng: {bai3Q1Correct}/1
                            </span>
                          </div>
                          <div className="text-[11px] text-gray-500 mt-0.5">
                            Chưa điền:{" "}
                            <span
                              className={
                                bai3Unanswered > 0
                                  ? "font-bold text-rose-600"
                                  : "font-bold text-gray-700"
                              }
                            >
                              {bai3Unanswered}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })()}

                <p className="text-xs text-gray-600 font-sans italic leading-relaxed">
                  "Học tiếng Nhật là một hành trình bền bỉ mỗi ngày. Hãy nghỉ ngơi thật tốt hôm nay và sẵn sàng cho những kiến thức thú vị tiếp theo của Buổi 2 nhé!"
                </p>

                {/* Buttons */}
                <div className="flex items-center justify-center gap-3 pt-1">
                  <button
                    onClick={() => {
                      stopAllCelebrationSounds();
                      setShowCompletionModal(false);
                    }}
                    className="w-full px-5 py-2.5 rounded-xl bg-[#8a5b61] hover:bg-[#744b50] text-white font-sans font-bold text-xs shadow-md transition-all cursor-pointer active:scale-95"
                  >
                    Xem lại đáp án & lời giải chi tiết
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
