import React, { useState, useEffect, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  BookOpen,
  Volume2,
  ChevronLeft,
  ChevronRight,
  Shuffle,
  RotateCcw,
  Sparkles,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Award,
  Layers,
  Search,
  Filter,
  Check,
  Play,
  Pause,
  BrainCircuit,
  List,
  Eye,
  EyeOff,
  Flame,
  ArrowRight,
  Headphones,
} from "lucide-react";
import { N4_LESSON_1_VOCAB, N4VocabItem, toTTSPhoneticReading } from "../data/n4Lesson1VocabData";

interface N4Lesson1VocabViewProps {
  lang: "vi" | "en";
}

type VocabSubTab = "flashcard" | "list" | "quiz";
type QuizType = "all" | "kanji_reading" | "kanji_meaning" | "audio_meaning" | "meaning_japanese";

interface QuizQuestion {
  id: string;
  originalVocabId: number;
  type: "kanji_reading" | "kanji_meaning" | "audio_meaning" | "meaning_japanese";
  prompt: string;
  subPrompt?: string;
  audioText?: string;
  displayWord?: string;
  displayFurigana?: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
  item: N4VocabItem;
}

export const N4Lesson1VocabView: React.FC<N4Lesson1VocabViewProps> = ({ lang }) => {
  const isEn = lang === "en";

  // Navigation state within Vocabulary section
  const [subTab, setSubTab] = useState<VocabSubTab>("flashcard");

  // Filter batches
  // 1: 1-36 (Trang 1), 2: 37-73 (Trang 2), 3: 74-110 (Trang 3), 4: 111-143 (Trang 4), all: Tất cả 143 từ
  const [selectedBatch, setSelectedBatch] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Filtered vocabulary list
  const filteredVocab = useMemo(() => {
    let list = N4_LESSON_1_VOCAB;
    if (selectedBatch === "p1") {
      list = list.filter((v) => v.id >= 1 && v.id <= 36);
    } else if (selectedBatch === "p2") {
      list = list.filter((v) => v.id >= 37 && v.id <= 73);
    } else if (selectedBatch === "p3") {
      list = list.filter((v) => v.id >= 74 && v.id <= 110);
    } else if (selectedBatch === "p4") {
      list = list.filter((v) => v.id >= 111 && v.id <= 143);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (v) =>
          v.word.toLowerCase().includes(q) ||
          v.reading.toLowerCase().includes(q) ||
          v.meaning.toLowerCase().includes(q) ||
          v.hanViet.toLowerCase().includes(q)
      );
    }
    return list;
  }, [selectedBatch, searchQuery]);

  // Flashcard State
  const [currentCardIndex, setCurrentCardIndex] = useState<number>(0);
  const [isFlipped, setIsFlipped] = useState<boolean>(false);
  const [autoPlayVoice, setAutoPlayVoice] = useState<boolean>(true);

  // Speech synthesis state (Đọc tức thì, bỏ chờ 1s, phát đủ chữ đủ âm chuẩn xác)
  const [activeSpeakingWord, setActiveSpeakingWord] = useState<string | null>(null);
  const jaVoiceRef = useRef<SpeechSynthesisVoice | null>(null);

  // Preload and cache optimal Japanese announcer voice
  useEffect(() => {
    if (!("speechSynthesis" in window)) return;

    const updateVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      const jaVoices = voices.filter(
        (v) => v.lang === "ja-JP" || v.lang.startsWith("ja")
      );

      const sorted = [...jaVoices].sort((a, b) => {
        const score = (name: string) => {
          const l = name.toLowerCase();
          if (l.includes("kyoko")) return 100;
          if (l.includes("nanami")) return 90;
          if (l.includes("ayumi")) return 80;
          if (l.includes("google 日本語")) return 75;
          if (l.includes("google")) return 70;
          if (l.includes("haruka")) return 65;
          if (l.includes("sayaka")) return 60;
          if (l.includes("otoya")) return 50;
          return 10;
        };
        return score(b.name) - score(a.name);
      });

      if (sorted.length > 0) {
        jaVoiceRef.current = sorted[0];
      }
    };

    updateVoices();
    window.speechSynthesis.onvoiceschanged = updateVoices;

    return () => {
      if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Reset index when filter changes
  useEffect(() => {
    setCurrentCardIndex(0);
    setIsFlipped(false);
  }, [selectedBatch, searchQuery]);

  // Safe current item
  const currentCard = filteredVocab[currentCardIndex] || filteredVocab[0];

  // Speech synthesis: Đọc ngay lập tức (bỏ 1s chờ), phát âm đủ chữ đủ âm tất cả các ký tự
  const speakJapanese = (
    itemOrText: N4VocabItem | string,
    rate: number = 0.88
  ) => {
    if (!("speechSynthesis" in window)) return;

    // Convert to exact phonetic Hiragana (with elongated Katakana vowels & Kanji Hiragana overrides)
    const phoneticText = toTTSPhoneticReading(itemOrText);
    const identifier = typeof itemOrText === "string" ? itemOrText : itemOrText.word;

    // Waking system audio pipeline synchronously with Web Audio API to prevent sound truncation
    try {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        const ctx = new AudioCtx();
        if (ctx.state === "suspended") {
          ctx.resume();
        }
      }
    } catch {
      // ignore
    }

    // Cancel any previous speech
    window.speechSynthesis.cancel();
    setActiveSpeakingWord(identifier);

    try {
      // Prepend soft pause '、' to give browser audio engine a natural lead-in so the first syllable is never clipped
      const utterance = new SpeechSynthesisUtterance("、" + phoneticText);
      utterance.lang = "ja-JP";
      utterance.rate = rate; // 0.88 speed for articulate, distinct, clear mora pronunciation
      utterance.pitch = 1.0; // standard natural pitch

      if (jaVoiceRef.current) {
        utterance.voice = jaVoiceRef.current;
      } else {
        const voices = window.speechSynthesis.getVoices();
        const fallbackJa = voices.find((v) => v.lang.startsWith("ja"));
        if (fallbackJa) utterance.voice = fallbackJa;
      }

      utterance.onend = () => {
        setActiveSpeakingWord(null);
      };
      utterance.onerror = () => {
        setActiveSpeakingWord(null);
      };

      window.speechSynthesis.speak(utterance);
    } catch (err) {
      console.warn("Speech synthesis error:", err);
      setActiveSpeakingWord(null);
    }
  };

  // Play audio when card changes if autoPlay is on (ngay lập tức)
  useEffect(() => {
    if (subTab === "flashcard" && autoPlayVoice && currentCard && !isFlipped) {
      speakJapanese(currentCard, 0.88);
    }
  }, [currentCardIndex, subTab, autoPlayVoice]);

  // Shuffle flashcards
  const handleShuffleCards = () => {
    setIsFlipped(false);
    const randomIndex = Math.floor(Math.random() * filteredVocab.length);
    setCurrentCardIndex(randomIndex);
  };

  // Web Audio chime for quiz feedback
  const playChime = (isCorrect: boolean) => {
    try {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      if (isCorrect) {
        osc.frequency.setValueAtTime(523.25, now); // C5
        osc.frequency.setValueAtTime(659.25, now + 0.1); // E5
        osc.frequency.setValueAtTime(783.99, now + 0.2); // G5
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
        osc.start(now);
        osc.stop(now + 0.5);
      } else {
        osc.frequency.setValueAtTime(261.63, now); // C4
        osc.frequency.setValueAtTime(233.08, now + 0.15); // Bb3
        gain.gain.setValueAtTime(0.25, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);
        osc.start(now);
        osc.stop(now + 0.45);
      }
    } catch {
      // ignore
    }
  };

  // =========================================================================
  // QUIZ STATE & ADAPTIVE QUEUE LOGIC (100% CORRECT TO COMPLETE)
  // =========================================================================
  const [quizFilterType, setQuizFilterType] = useState<QuizType>("all");
  const [quizBatchSize, setQuizBatchSize] = useState<number>(20); // 20 questions or all
  const [quizQueue, setQuizQueue] = useState<QuizQuestion[]>([]);
  const [currentQuizIndex, setCurrentQuizIndex] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState<boolean>(false);
  const [quizFeedback, setQuizFeedback] = useState<{ isCorrect: boolean; msg: string } | null>(null);
  const [initialQuestionCount, setInitialQuestionCount] = useState<number>(0);
  const [completedCount, setCompletedCount] = useState<number>(0);
  const [wrongAttemptCount, setWrongAttemptCount] = useState<number>(0);
  const [isQuizCompleted, setIsQuizCompleted] = useState<boolean>(false);

  // Helper to generate multiple choice options
  const generateOptions = (
    correctText: string,
    allCandidates: string[],
    count: number = 4
  ): { options: string[]; correctIndex: number } => {
    const distractors = allCandidates.filter((c) => c !== correctText);
    // Shuffle distractors
    const shuffledDistractors = [...distractors].sort(() => 0.5 - Math.random());
    const selectedDistractors = shuffledDistractors.slice(0, count - 1);
    const combined = [...selectedDistractors, correctText].sort(() => 0.5 - Math.random());
    const correctIndex = combined.indexOf(correctText);
    return { options: combined, correctIndex };
  };

  // Build question for an item
  const buildQuestion = (
    item: N4VocabItem,
    preferredType?: "kanji_reading" | "kanji_meaning" | "audio_meaning" | "meaning_japanese"
  ): QuizQuestion => {
    // Available types
    const types: ("kanji_reading" | "kanji_meaning" | "audio_meaning" | "meaning_japanese")[] = [
      "kanji_reading",
      "kanji_meaning",
      "audio_meaning",
      "meaning_japanese",
    ];

    let chosenType = preferredType;
    if (!chosenType || chosenType === ("all" as any)) {
      // If item has no Kanji (e.g. katakana or hiragana only), skip kanji_reading
      const hasKanji = /[\u4e00-\u9faf]/.test(item.word);
      const eligibleTypes = hasKanji ? types : types.filter((t) => t !== "kanji_reading");
      chosenType = eligibleTypes[Math.floor(Math.random() * eligibleTypes.length)];
    }

    const allReadings = N4_LESSON_1_VOCAB.map((v) => v.reading);
    const allMeanings = N4_LESSON_1_VOCAB.map((v) => v.meaning);
    const allWords = N4_LESSON_1_VOCAB.map((v) => v.word);

    if (chosenType === "kanji_reading") {
      const { options, correctIndex } = generateOptions(item.reading, allReadings);
      return {
        id: `q_${item.id}_kr_${Date.now()}_${Math.random()}`,
        originalVocabId: item.id,
        type: "kanji_reading",
        prompt: isEn
          ? `What is the correct reading of the Kanji 「${item.word}」?`
          : `Chữ Hán 「${item.word}」 có cách đọc đúng là gì?`,
        subPrompt: item.hanViet ? `Âm Hán Việt: ${item.hanViet}` : undefined,
        displayWord: item.word,
        options,
        correctAnswerIndex: correctIndex,
        explanation: `「${item.word}」 đọc là 「${item.reading}」. Nghĩa: ${item.meaning}. ${item.hanViet ? `(Hán Việt: ${item.hanViet})` : ""}`,
        item,
      };
    } else if (chosenType === "kanji_meaning") {
      const { options, correctIndex } = generateOptions(item.meaning, allMeanings);
      return {
        id: `q_${item.id}_km_${Date.now()}_${Math.random()}`,
        originalVocabId: item.id,
        type: "kanji_meaning",
        prompt: isEn
          ? `What is the Vietnamese meaning of 「${item.word}」?`
          : `Từ 「${item.word}」 (${item.reading}) có nghĩa tiếng Việt là gì?`,
        subPrompt: item.hanViet ? `Hán Việt: ${item.hanViet}` : undefined,
        displayWord: item.word,
        displayFurigana: item.reading,
        options,
        correctAnswerIndex: correctIndex,
        explanation: `「${item.word}」 (${item.reading}) nghĩa là: "${item.meaning}". Ví dụ: ${item.example} (${item.exampleMeaning})`,
        item,
      };
    } else if (chosenType === "audio_meaning") {
      const { options, correctIndex } = generateOptions(item.meaning, allMeanings);
      const phoneticAudio = toTTSPhoneticReading(item);
      return {
        id: `q_${item.id}_am_${Date.now()}_${Math.random()}`,
        originalVocabId: item.id,
        type: "audio_meaning",
        prompt: isEn
          ? `Listen to the audio pronunciation and choose the correct meaning:`
          : `🔊 Hãy nghe phát âm và chọn nghĩa tiếng Việt đúng:`,
        audioText: phoneticAudio,
        options,
        correctAnswerIndex: correctIndex,
        explanation: `Phát âm: 「${item.reading}」 (Chữ: ${item.word}). Nghĩa: "${item.meaning}".`,
        item,
      };
    } else {
      // meaning_japanese
      const { options, correctIndex } = generateOptions(item.word, allWords);
      return {
        id: `q_${item.id}_mj_${Date.now()}_${Math.random()}`,
        originalVocabId: item.id,
        type: "meaning_japanese",
        prompt: isEn
          ? `Which Japanese word means "${item.meaning}"?`
          : `Từ tiếng Việt "${item.meaning}" trong tiếng Nhật là gì?`,
        subPrompt: item.hanViet ? `Gợi ý Hán Việt: ${item.hanViet}` : undefined,
        options,
        correctAnswerIndex: correctIndex,
        explanation: `"${item.meaning}" trong tiếng Nhật là 「${item.word}」 (Đọc là: ${item.reading}).`,
        item,
      };
    }
  };

  // Initialize Quiz Queue
  const startQuiz = () => {
    let sourcePool = [...filteredVocab];
    if (sourcePool.length === 0) sourcePool = [...N4_LESSON_1_VOCAB];

    // Shuffle pool
    sourcePool = sourcePool.sort(() => 0.5 - Math.random());

    // Select count
    const targetCount = quizBatchSize === -1 ? sourcePool.length : Math.min(quizBatchSize, sourcePool.length);
    const selectedItems = sourcePool.slice(0, targetCount);

    const questions: QuizQuestion[] = selectedItems.map((item) => {
      const prefType = quizFilterType === "all" ? undefined : quizFilterType;
      return buildQuestion(item, prefType as any);
    });

    setQuizQueue(questions);
    setCurrentQuizIndex(0);
    setSelectedOption(null);
    setIsAnswerSubmitted(false);
    setQuizFeedback(null);
    setInitialQuestionCount(questions.length);
    setCompletedCount(0);
    setWrongAttemptCount(0);
    setIsQuizCompleted(false);

    // If first question is audio, play it immediately
    if (questions[0] && questions[0].type === "audio_meaning") {
      speakJapanese(questions[0].item, 0.88);
    }
  };

  // Auto start quiz when entering quiz tab if queue is empty
  useEffect(() => {
    if (subTab === "quiz" && quizQueue.length === 0 && !isQuizCompleted) {
      startQuiz();
    }
  }, [subTab]);

  const currentQuestion = quizQueue[currentQuizIndex];

  // Auto play voice when moving to an audio question (ngay lập tức)
  useEffect(() => {
    if (currentQuestion && currentQuestion.type === "audio_meaning" && !isAnswerSubmitted) {
      speakJapanese(currentQuestion.item, 0.88);
    }
  }, [currentQuizIndex, currentQuestion?.id]);

  // Handle quiz answer selection
  const handleSelectOption = (idx: number) => {
    if (isAnswerSubmitted) return;
    setSelectedOption(idx);
  };

  // Submit Answer with 100% Adaptive Queue Logic
  const handleSubmitQuizAnswer = () => {
    if (selectedOption === null || isAnswerSubmitted || !currentQuestion) return;

    const isCorrect = selectedOption === currentQuestion.correctAnswerIndex;
    setIsAnswerSubmitted(true);
    playChime(isCorrect);

    if (isCorrect) {
      setQuizFeedback({
        isCorrect: true,
        msg: isEn ? "Correct! Excellent job! 🎉" : "Chính xác! Xuất sắc lắm! 🎉",
      });
      setCompletedCount((prev) => prev + 1);
    } else {
      setWrongAttemptCount((prev) => prev + 1);
      setQuizFeedback({
        isCorrect: false,
        msg: isEn
          ? "Not quite! This question will appear again later until you master it 100%."
          : "Chưa chính xác! Câu này sẽ tự động xuất hiện lại sau 2 câu cho tới khi bạn trả lời đúng 100% nhé.",
      });

      // Adaptive repeat: Insert a fresh variation of this question 2 positions ahead (or at the end)
      const updatedQueue = [...quizQueue];
      // Generate a new variation question for the same item to reinforce learning
      const retryQuestion = buildQuestion(currentQuestion.item);
      const insertIndex = Math.min(currentQuizIndex + 3, updatedQueue.length);
      updatedQueue.splice(insertIndex, 0, retryQuestion);
      setQuizQueue(updatedQueue);
    }
  };

  // Advance to Next Question
  const handleNextQuizQuestion = () => {
    if (currentQuizIndex + 1 < quizQueue.length) {
      setCurrentQuizIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswerSubmitted(false);
      setQuizFeedback(null);
    } else {
      // Finished all items with 100% accuracy!
      setIsQuizCompleted(true);
      playChime(true);
    }
  };

  return (
    <div className="space-y-6">
      {/* ======================================================== */}
      {/* HEADER SECTION: TỪ VỰNG N4 BUỔI 1 */}
      {/* ======================================================== */}
      <div className="bg-white/90 backdrop-blur-xl rounded-3xl p-5 md:p-7 border border-pink-100 shadow-sm transition-all">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-5 mb-5 border-b border-pink-100">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#8a5b61] to-[#6d4348] text-white flex items-center justify-center font-bold shadow-md shadow-[#8a5b61]/20">
              <Layers className="w-6 h-6 text-pink-200" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-[#8a5b61] bg-pink-100/70 px-2.5 py-0.5 rounded-full border border-pink-200/60">
                  {isEn ? "143 Core Vocabulary Words" : "Bộ 143 từ vựng trọng tâm"}
                </span>
                <span className="text-xs font-medium text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  {isEn ? "Full Audio & Examples" : "Kèm Hán tự, Audio & Ví dụ"}
                </span>
              </div>
              <h2 className="font-serif font-black text-xl md:text-2xl text-[#8a5b61] mt-0.5">
                {isEn ? "N4 Vocabulary: Session 1" : "Từ vựng: Buổi 1 N4"}
              </h2>
            </div>
          </div>

          {/* Sub-tabs: Flashcard vs Danh sách vs Luyện tập */}
          <div className="flex items-center gap-1.5 bg-pink-50/70 p-1 rounded-2xl border border-pink-200/80">
            <button
              onClick={() => setSubTab("flashcard")}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold font-sans transition-all cursor-pointer flex items-center gap-1.5 ${
                subTab === "flashcard"
                  ? "bg-[#8a5b61] text-white shadow-xs"
                  : "text-[#8a5b61] hover:bg-white/80"
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>{isEn ? "Flashcard" : "Thẻ Flashcard"}</span>
            </button>

            <button
              onClick={() => setSubTab("list")}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold font-sans transition-all cursor-pointer flex items-center gap-1.5 ${
                subTab === "list"
                  ? "bg-[#8a5b61] text-white shadow-xs"
                  : "text-[#8a5b61] hover:bg-white/80"
              }`}
            >
              <List className="w-3.5 h-3.5" />
              <span>{isEn ? "Word List" : "Bảng tra cứu"}</span>
            </button>

            <button
              onClick={() => {
                setSubTab("quiz");
                if (quizQueue.length === 0) startQuiz();
              }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold font-sans transition-all cursor-pointer flex items-center gap-1.5 ${
                subTab === "quiz"
                  ? "bg-[#8a5b61] text-white shadow-xs"
                  : "text-[#8a5b61] hover:bg-white/80"
              }`}
            >
              <BrainCircuit className="w-3.5 h-3.5" />
              <span>{isEn ? "Adaptive Quiz" : "Bài tập (Đúng 100%)"}</span>
            </button>
          </div>
        </div>

        {/* Filter Toolbar: Batch & Search */}
        <div className="flex flex-wrap items-center justify-between gap-3 bg-white/70 p-3 rounded-2xl border border-pink-100">
          {/* Batch Selector */}
          <div className="flex items-center gap-1.5 overflow-x-auto py-1 text-xs">
            <span className="text-gray-500 font-bold shrink-0 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5 text-[#8a5b61]" />
              {isEn ? "Batch:" : "Phân đoạn:"}
            </span>
            {[
              { id: "all", label: `Tất cả (${N4_LESSON_1_VOCAB.length})` },
              { id: "p1", label: "Phần 1: 1-36 (Cơ sở & Đồ dùng)" },
              { id: "p2", label: "Phần 2: 37-73 (Giao thông & Vật dụng)" },
              { id: "p3", label: "Phần 3: 74-110 (Trang phục & Đồ điện)" },
              { id: "p4", label: "Phần 4: 111-143 (Vị trí & Tính từ な)" },
            ].map((b) => (
              <button
                key={b.id}
                onClick={() => setSelectedBatch(b.id)}
                className={`px-3 py-1 rounded-full font-bold whitespace-nowrap transition-all cursor-pointer text-[11px] ${
                  selectedBatch === b.id
                    ? "bg-[#8a5b61] text-white shadow-xs"
                    : "bg-white text-gray-700 hover:bg-pink-50 border border-gray-200"
                }`}
              >
                {b.label}
              </button>
            ))}
          </div>

          {/* Search box */}
          <div className="relative min-w-[200px] w-full sm:w-auto">
            <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={isEn ? "Search Kanji, meaning, reading..." : "Tìm Kanji, cách đọc, nghĩa..."}
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-white rounded-xl border border-gray-200 focus:outline-none focus:border-[#8a5b61] focus:ring-1 focus:ring-[#8a5b61] transition-all font-sans"
            />
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* SUB-TAB 1: FLASHCARD INTERACTIVE 3D VIEW */}
      {/* ======================================================== */}
      {subTab === "flashcard" && (
        <div className="bg-white/90 backdrop-blur-xl rounded-3xl p-5 md:p-8 border border-pink-100 shadow-sm transition-all flex flex-col items-center">
          {filteredVocab.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <p>{isEn ? "No vocabulary found for this filter." : "Không tìm thấy từ vựng nào khớp với bộ lọc."}</p>
            </div>
          ) : (
            <>
              {/* Flashcard Header Controls */}
              <div className="w-full max-w-lg flex items-center justify-between mb-4 text-xs font-sans">
                <span className="font-bold text-[#8a5b61] bg-pink-50 px-3 py-1 rounded-full border border-pink-200">
                  Thẻ số {currentCardIndex + 1} / {filteredVocab.length}
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setAutoPlayVoice(!autoPlayVoice)}
                    className={`px-2.5 py-1 rounded-full font-bold flex items-center gap-1 border transition-all cursor-pointer text-[11px] ${
                      autoPlayVoice
                        ? "bg-pink-100 text-[#8a5b61] border-pink-300"
                        : "bg-gray-100 text-gray-500 border-gray-200"
                    }`}
                    title="Tự động phát âm thanh khi đổi thẻ"
                  >
                    <Volume2 className="w-3 h-3" />
                    <span>Auto voice: {autoPlayVoice ? "Bật" : "Tắt"}</span>
                  </button>

                  <button
                    onClick={handleShuffleCards}
                    className="p-1.5 rounded-full bg-white text-gray-600 hover:text-[#8a5b61] hover:bg-pink-50 border border-gray-200 transition-all cursor-pointer shadow-2xs"
                    title="Xáo trộn thẻ ngẫu nhiên"
                  >
                    <Shuffle className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* 3D Flippable Flashcard */}
              <div
                className="w-full max-w-lg h-[340px] cursor-pointer relative select-none"
                style={{ perspective: "1000px" }}
                onClick={() => setIsFlipped(!isFlipped)}
              >
                <motion.div
                  className="w-full h-full relative duration-500 rounded-3xl shadow-lg border border-pink-200"
                  style={{
                    transformStyle: "preserve-3d",
                    transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
                  }}
                >
                  {/* FRONT OF CARD */}
                  <div
                    className="absolute inset-0 w-full h-full bg-gradient-to-br from-white via-pink-50/30 to-amber-50/20 rounded-3xl flex flex-col items-center justify-between p-6 sm:p-7 backface-hidden"
                    style={{ backfaceVisibility: "hidden" }}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className="text-[11px] bg-[#8a5b61]/10 text-[#8a5b61] px-3 py-0.5 rounded-full font-sans font-bold uppercase tracking-wider">
                        {currentCard.category || "Từ vựng N4"} • #{currentCard.id}
                      </span>
                      {currentCard.hanViet && (
                        <span className="text-xs font-mono font-bold text-amber-800 bg-amber-100/80 px-2.5 py-0.5 rounded-full border border-amber-300/60">
                          {currentCard.hanViet}
                        </span>
                      )}
                    </div>

                    {/* Word display */}
                    <div className="flex flex-col items-center justify-center my-auto text-center">
                      <div className="flex items-center gap-3">
                        <h3 className="text-4xl sm:text-5xl font-extrabold text-gray-900 font-jp tracking-tight">
                          {currentCard.word}
                        </h3>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            speakJapanese(currentCard, 0.88);
                          }}
                          className={`w-11 h-11 rounded-full flex items-center justify-center transition-all active:scale-95 cursor-pointer shadow-xs ${
                            activeSpeakingWord === currentCard.word
                              ? "bg-pink-200 text-[#8a5b61] ring-2 ring-pink-400"
                              : "bg-[#8a5b61]/10 hover:bg-[#8a5b61]/20 text-[#8a5b61]"
                          }`}
                          title="Nghe phát âm chuẩn (rõ từng âm tiết)"
                        >
                          <Volume2 className={`w-6 h-6 ${activeSpeakingWord === currentCard.word ? "animate-pulse" : ""}`} />
                        </button>
                      </div>

                      {/* Hiragana reading */}
                      <p className="font-jp text-lg sm:text-xl text-rose-700 font-bold mt-2 tracking-wide">
                        {currentCard.reading}
                      </p>
                    </div>

                    <div className="flex items-center gap-1.5 text-xs text-gray-400 font-sans">
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>{isEn ? "Tap to flip and see meaning & example" : "Chạm thẻ để lật xem nghĩa & câu ví dụ"} ↺</span>
                    </div>
                  </div>

                  {/* BACK OF CARD */}
                  <div
                    className="absolute inset-0 w-full h-full bg-gradient-to-br from-[#fcf9fa] via-white to-pink-50/40 rounded-3xl flex flex-col justify-between p-6 sm:p-7 backface-hidden overflow-y-auto"
                    style={{
                      backfaceVisibility: "hidden",
                      transform: "rotateY(180deg)",
                    }}
                  >
                    <div>
                      <div className="flex items-center justify-between border-b border-pink-100 pb-2 mb-3">
                        <span className="font-serif font-black text-lg text-gray-900">
                          {currentCard.word}{" "}
                          <span className="text-sm font-sans font-normal text-gray-500">({currentCard.reading})</span>
                        </span>
                        {currentCard.hanViet && (
                          <span className="text-[11px] font-bold text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded-full border border-amber-300">
                            {currentCard.hanViet}
                          </span>
                        )}
                      </div>

                      {/* Vietnamese Meaning */}
                      <div className="bg-pink-50/80 rounded-2xl p-3 border border-pink-200/80 mb-3">
                        <span className="text-[10px] font-bold text-pink-700 uppercase block mb-0.5 tracking-wider">
                          Nghĩa tiếng Việt
                        </span>
                        <p className="text-base font-bold text-gray-800 font-sans">
                          {currentCard.meaning}
                        </p>
                      </div>

                      {/* 1 Example Sentence in Japanese with Vietnamese translation */}
                      <div className="bg-white rounded-2xl p-3 border border-gray-200 shadow-2xs space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold text-[#8a5b61] uppercase tracking-wider flex items-center gap-1">
                            <Sparkles className="w-3 h-3 text-amber-500" />
                            Câu ví dụ ứng dụng
                          </span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              speakJapanese(currentCard.example, 0.88);
                            }}
                            className="text-xs text-[#8a5b61] hover:text-pink-700 flex items-center gap-1 font-bold cursor-pointer"
                            title="Nghe câu ví dụ"
                          >
                            <Volume2 className="w-3.5 h-3.5" />
                            <span>Nghe</span>
                          </button>
                        </div>

                        <p className="font-jp text-sm font-bold text-gray-900 leading-relaxed">
                          {currentCard.example}
                        </p>
                        <p className="text-xs text-gray-600 font-sans italic">
                          → {currentCard.exampleMeaning}
                        </p>
                      </div>
                    </div>

                    <div className="text-center text-[11px] text-gray-400 font-sans pt-2 border-t border-pink-100/60">
                      Chạm lại thẻ để quay lại mặt trước ↺
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Flashcard Navigation Controls */}
              <div className="flex items-center gap-4 mt-6">
                <button
                  onClick={() => {
                    setIsFlipped(false);
                    setTimeout(() => {
                      setCurrentCardIndex((prev) => (prev - 1 + filteredVocab.length) % filteredVocab.length);
                    }, 120);
                  }}
                  className="bg-white hover:bg-pink-50 text-[#8a5b61] w-11 h-11 rounded-full border border-pink-200 flex items-center justify-center shadow-sm hover:scale-105 active:scale-95 transition-all cursor-pointer font-bold"
                  title="Thẻ trước"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>

                <div className="text-xs font-bold text-gray-600 font-sans">
                  {currentCardIndex + 1} / {filteredVocab.length}
                </div>

                <button
                  onClick={() => {
                    setIsFlipped(false);
                    setTimeout(() => {
                      setCurrentCardIndex((prev) => (prev + 1) % filteredVocab.length);
                    }, 120);
                  }}
                  className="bg-[#8a5b61] hover:bg-[#724a4f] text-white w-11 h-11 rounded-full shadow-md hover:scale-105 active:scale-95 transition-all cursor-pointer flex items-center justify-center"
                  title="Thẻ kế tiếp"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </div>
            </>
          )}
        </div>
      )}

      {/* ======================================================== */}
      {/* SUB-TAB 2: LIST / TABLE LOOKUP VIEW */}
      {/* ======================================================== */}
      {subTab === "list" && (
        <div className="bg-white/90 backdrop-blur-xl rounded-3xl p-5 md:p-7 border border-pink-100 shadow-sm transition-all space-y-4">
          <div className="flex items-center justify-between text-xs text-gray-500 font-sans pb-2 border-b border-pink-100">
            <span>Hiển thị <b>{filteredVocab.length}</b> từ vựng</span>
            <span>Bấm vào biểu tượng loa để nghe phát âm</span>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-pink-100 shadow-2xs">
            <table className="w-full text-left text-xs font-sans">
              <thead className="bg-[#8a5b61] text-white font-bold text-[11px] uppercase tracking-wider">
                <tr>
                  <th className="p-3 text-center w-12">STT</th>
                  <th className="p-3">Tiếng Nhật</th>
                  <th className="p-3">Âm Hán Việt</th>
                  <th className="p-3">Cách đọc</th>
                  <th className="p-3">Nghĩa Tiếng Việt</th>
                  <th className="p-3">Câu ví dụ ứng dụng</th>
                  <th className="p-3 text-center w-16">Nghe</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-pink-100 bg-white">
                {filteredVocab.map((item, idx) => (
                  <tr key={item.id} className="hover:bg-pink-50/50 transition-colors">
                    <td className="p-3 text-center font-bold text-gray-400">
                      {item.id}
                    </td>
                    <td className="p-3 font-jp font-bold text-base text-gray-900 whitespace-nowrap">
                      {item.word}
                    </td>
                    <td className="p-3 font-mono font-bold text-[#8a5b61] whitespace-nowrap">
                      {item.hanViet || "-"}
                    </td>
                    <td className="p-3 font-jp font-medium text-rose-700 whitespace-nowrap">
                      {item.reading}
                    </td>
                    <td className="p-3 font-bold text-gray-800">
                      {item.meaning}
                    </td>
                    <td className="p-3 space-y-0.5 min-w-[240px]">
                      <p className="font-jp text-xs text-gray-800 font-medium">
                        {item.example}
                      </p>
                      <p className="text-[11px] text-gray-500 italic">
                        {item.exampleMeaning}
                      </p>
                    </td>
                    <td className="p-3 text-center">
                      <button
                        onClick={() => speakJapanese(item, 0.88)}
                        className={`w-8 h-8 rounded-full flex items-center justify-center transition-transform active:scale-90 cursor-pointer shadow-2xs mx-auto ${
                          activeSpeakingWord === item.word
                            ? "bg-pink-200 text-[#8a5b61] ring-2 ring-pink-400"
                            : "bg-pink-50 hover:bg-pink-100 text-[#8a5b61]"
                        }`}
                        title="Nghe phát âm chuẩn (rõ từng âm tiết)"
                      >
                        <Volume2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* SUB-TAB 3: ADAPTIVE PRACTICE (4 QUESTION TYPES - 100% CORRECT) */}
      {/* ======================================================== */}
      {subTab === "quiz" && (
        <div className="bg-white/90 backdrop-blur-xl rounded-3xl p-5 md:p-8 border border-pink-100 shadow-sm transition-all">
          {isQuizCompleted ? (
            /* VICTORY 100% COMPLETION SCREEN */
            <div className="text-center py-10 space-y-5 max-w-md mx-auto">
              <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner animate-bounce">
                <Check className="w-10 h-10 stroke-[3]" />
              </div>

              <div className="space-y-2">
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                  🎉 Hoàn thành chính xác 100%
                </span>
                <h3 className="font-serif font-black text-2xl text-[#8a5b61]">
                  Xuất sắc! Bạn đã làm chủ toàn bộ từ vựng!
                </h3>
                <p className="text-xs text-gray-600 font-sans leading-relaxed">
                  Tất cả các câu hỏi trắc nghiệm (bao gồm cả các câu bạn đã làm sai trước đó và được lặp lại) đều đã được bạn trả lời đúng hoàn toàn!
                </p>
              </div>

              <div className="bg-pink-50/70 p-4 rounded-2xl border border-pink-200 grid grid-cols-2 gap-3 text-center font-sans text-xs">
                <div className="bg-white p-2.5 rounded-xl border border-pink-100">
                  <span className="text-gray-500 block">Số từ đã thành thạo</span>
                  <span className="font-serif font-bold text-xl text-emerald-600">{initialQuestionCount}</span>
                </div>
                <div className="bg-white p-2.5 rounded-xl border border-pink-100">
                  <span className="text-gray-500 block">Lần sửa sai thành công</span>
                  <span className="font-serif font-bold text-xl text-amber-600">{wrongAttemptCount}</span>
                </div>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  onClick={startQuiz}
                  className="w-full sm:w-auto px-6 py-2.5 bg-[#8a5b61] hover:bg-[#724a4f] text-white font-bold rounded-2xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Luyện tập lại vòng mới</span>
                </button>
                <button
                  onClick={() => setSubTab("flashcard")}
                  className="w-full sm:w-auto px-6 py-2.5 bg-white hover:bg-pink-50 text-[#8a5b61] font-bold rounded-2xl border border-pink-200 transition-all cursor-pointer"
                >
                  Xem lại Flashcard
                </button>
              </div>
            </div>
          ) : (
            /* ACTIVE QUIZ SCREEN */
            <div className="max-w-xl mx-auto space-y-6">
              {/* Quiz Configuration Toolbar */}
              <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-pink-100">
                <div className="flex items-center gap-2 text-xs">
                  <span className="font-bold text-gray-500">Loại câu hỏi:</span>
                  <select
                    value={quizFilterType}
                    onChange={(e) => {
                      setQuizFilterType(e.target.value as any);
                    }}
                    className="bg-white border border-pink-200 text-[#8a5b61] font-bold rounded-xl px-2.5 py-1 text-xs focus:outline-none cursor-pointer"
                  >
                    <option value="all">4 Loại ngẫu nhiên kết hợp</option>
                    <option value="kanji_reading">1. Hiện chữ Hán chọn cách đọc</option>
                    <option value="kanji_meaning">2. Hiện chữ Hán chọn nghĩa tiếng Việt</option>
                    <option value="audio_meaning">3. Nghe voice chọn nghĩa tiếng Việt</option>
                    <option value="meaning_japanese">4. Hiện tiếng Việt chọn tiếng Nhật</option>
                  </select>
                </div>

                <button
                  onClick={startQuiz}
                  className="text-xs text-[#8a5b61] hover:text-pink-700 flex items-center gap-1 font-bold cursor-pointer"
                  title="Bắt đầu lại bộ câu hỏi"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Khởi động lại</span>
                </button>
              </div>

              {/* Progress Bar & Counter */}
              <div className="space-y-1.5 font-sans">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-gray-700">
                    Câu hỏi số {currentQuizIndex + 1} / {quizQueue.length}
                  </span>
                  <span className="font-bold text-[#8a5b61]">
                    Đúng {completedCount} câu • Còn {quizQueue.length - currentQuizIndex} câu trong hàng đợi
                  </span>
                </div>
                <div className="w-full bg-pink-100 h-2.5 rounded-full overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-pink-500 to-[#8a5b61] h-full transition-all duration-300"
                    style={{
                      width: `${Math.min(100, Math.round(((currentQuizIndex) / quizQueue.length) * 100))}%`,
                    }}
                  />
                </div>
              </div>

              {/* Question Card */}
              {currentQuestion && (
                <div className="bg-gradient-to-br from-pink-50/40 via-white to-amber-50/30 rounded-3xl p-5 md:p-7 border border-pink-200 shadow-sm space-y-5">
                  {/* Badge & Type indicator */}
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-[#8a5b61] bg-[#8a5b61]/10 px-3 py-0.5 rounded-full uppercase tracking-wider">
                      {currentQuestion.type === "kanji_reading" && "Loại 1: Chữ Hán → Cách đọc"}
                      {currentQuestion.type === "kanji_meaning" && "Loại 2: Chữ Hán → Nghĩa tiếng Việt"}
                      {currentQuestion.type === "audio_meaning" && "Loại 3: Nghe Voice → Nghĩa tiếng Việt"}
                      {currentQuestion.type === "meaning_japanese" && "Loại 4: Tiếng Việt → Tiếng Nhật"}
                    </span>

                    {currentQuestion.subPrompt && (
                      <span className="text-xs font-mono font-bold text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded-full">
                        {currentQuestion.subPrompt}
                      </span>
                    )}
                  </div>

                  {/* Question Prompt */}
                  <div className="text-center py-2 space-y-3">
                    <h4 className="font-sans font-bold text-base md:text-lg text-gray-900 leading-snug">
                      {currentQuestion.prompt}
                    </h4>

                    {/* Big Display for Kanji or Audio Button */}
                    {currentQuestion.displayWord && (
                      <div className="py-2">
                        <span className="font-jp font-black text-3xl sm:text-4xl text-gray-900 inline-block px-4 py-2 bg-white rounded-2xl shadow-xs border border-pink-100">
                          {currentQuestion.displayWord}
                        </span>
                      </div>
                    )}

                    {/* Audio Button for Type 3 */}
                    {currentQuestion.type === "audio_meaning" && (
                      <div className="py-2">
                        <button
                          onClick={() => speakJapanese(currentQuestion.item, 0.88)}
                          className="px-5 py-3 rounded-2xl bg-[#8a5b61] hover:bg-[#724a4f] text-white font-bold flex items-center justify-center gap-2.5 mx-auto shadow-md transition-all active:scale-95 cursor-pointer"
                        >
                          <Volume2 className={`w-6 h-6 ${activeSpeakingWord === currentQuestion.item.word ? "animate-pulse" : ""}`} />
                          <span>Bấm để nghe phát âm 🔊</span>
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Multiple Choice Options */}
                  <div className="space-y-2.5 pt-2">
                    {currentQuestion.options.map((opt, optIdx) => {
                      const isSelected = selectedOption === optIdx;
                      const isCorrect = optIdx === currentQuestion.correctAnswerIndex;

                      let btnStyle = "bg-white hover:bg-pink-50 text-gray-800 border-gray-200";
                      if (isSelected) {
                        btnStyle = "bg-pink-100 text-[#8a5b61] border-[#8a5b61] ring-2 ring-[#8a5b61]/30 font-bold";
                      }
                      if (isAnswerSubmitted) {
                        if (isCorrect) {
                          btnStyle = "bg-emerald-50 text-emerald-800 border-emerald-400 font-bold ring-2 ring-emerald-300";
                        } else if (isSelected && !isCorrect) {
                          btnStyle = "bg-rose-50 text-rose-800 border-rose-300 line-through opacity-80";
                        }
                      }

                      return (
                        <button
                          key={optIdx}
                          disabled={isAnswerSubmitted}
                          onClick={() => handleSelectOption(optIdx)}
                          className={`w-full p-3.5 rounded-2xl border text-left font-sans text-sm md:text-base flex items-center justify-between transition-all cursor-pointer shadow-2xs ${btnStyle}`}
                        >
                          <div className="flex items-center gap-3">
                            <span className="w-6 h-6 rounded-full bg-gray-100 text-gray-600 font-mono text-xs font-bold flex items-center justify-center shrink-0">
                              {String.fromCharCode(65 + optIdx)}
                            </span>
                            <span className="font-medium">{opt}</span>
                          </div>

                          {isAnswerSubmitted && isCorrect && (
                            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                          )}
                          {isAnswerSubmitted && isSelected && !isCorrect && (
                            <XCircle className="w-5 h-5 text-rose-600 shrink-0" />
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {/* Feedback Explanation */}
                  {isAnswerSubmitted && quizFeedback && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`p-4 rounded-2xl border text-xs leading-relaxed space-y-1 ${
                        quizFeedback.isCorrect
                          ? "bg-emerald-50/90 text-emerald-900 border-emerald-200"
                          : "bg-rose-50/90 text-rose-900 border-rose-200"
                      }`}
                    >
                      <div className="font-bold text-sm flex items-center gap-1.5">
                        {quizFeedback.isCorrect ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        ) : (
                          <XCircle className="w-4 h-4 text-rose-600" />
                        )}
                        <span>{quizFeedback.msg}</span>
                      </div>
                      <p className="font-sans text-gray-800 pt-1">
                        <b>Giải thích:</b> {currentQuestion.explanation}
                      </p>
                    </motion.div>
                  )}

                  {/* Action Buttons: Submit / Next */}
                  <div className="pt-2 flex justify-end">
                    {!isAnswerSubmitted ? (
                      <button
                        disabled={selectedOption === null}
                        onClick={handleSubmitQuizAnswer}
                        className={`px-6 py-2.5 rounded-2xl font-bold font-sans text-xs md:text-sm flex items-center gap-2 transition-all cursor-pointer ${
                          selectedOption === null
                            ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                            : "bg-[#8a5b61] hover:bg-[#724a4f] text-white shadow-md hover:scale-102 active:scale-98"
                        }`}
                      >
                        <span>Kiểm tra đáp án</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    ) : (
                      <button
                        onClick={handleNextQuizQuestion}
                        className="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-[#8a5b61] to-[#724a4f] text-white font-bold font-sans text-xs md:text-sm flex items-center gap-2 shadow-md hover:scale-102 active:scale-98 transition-all cursor-pointer"
                      >
                        <span>Câu kế tiếp</span>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
