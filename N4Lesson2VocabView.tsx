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
  Check,
  Play,
  BrainCircuit,
  List,
  Eye,
  EyeOff,
  Flame,
  ArrowRight,
  Headphones,
} from "lucide-react";
import {
  N4_LESSON_2_VOCAB,
  N4VocabItem,
  toTTSPhoneticReadingLesson2,
} from "../data/n4Lesson2VocabData";

interface N4Lesson2VocabViewProps {
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

export const N4Lesson2VocabView: React.FC<N4Lesson2VocabViewProps> = ({ lang }) => {
  const isEn = lang === "en";

  // Navigation state within Vocabulary section
  const [subTab, setSubTab] = useState<VocabSubTab>("flashcard");


  // Filter batches
  // p1: 1-36 (Trang 1), p2: 37-73 (Trang 2), p3: 74-110 (Trang 3), p4: 111-129 (Trang 4), all: Tất cả 129 từ
  const [selectedBatch, setSelectedBatch] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Filtered vocabulary list
  const filteredVocab = useMemo(() => {
    let list = N4_LESSON_2_VOCAB;
    if (selectedBatch === "p1") {
      list = list.filter((v) => v.id >= 1 && v.id <= 36);
    } else if (selectedBatch === "p2") {
      list = list.filter((v) => v.id >= 37 && v.id <= 73);
    } else if (selectedBatch === "p3") {
      list = list.filter((v) => v.id >= 74 && v.id <= 110);
    } else if (selectedBatch === "p4") {
      list = list.filter((v) => v.id >= 111 && v.id <= 129);
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

  // Speech synthesis state (Đọc tức thì, không delay 1s, phát đủ chữ đủ âm chuẩn xác)
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

  // Speech synthesis: Đọc ngay lập tức (không chờ 1s), phát âm đủ chữ đủ âm tất cả các ký tự
  const speakJapanese = (
    itemOrText: N4VocabItem | string,
    rate: number = 0.88
  ) => {
    if (!("speechSynthesis" in window)) return;

    const phoneticText = toTTSPhoneticReadingLesson2(itemOrText);
    const identifier = typeof itemOrText === "string" ? itemOrText : itemOrText.word;

    // Wake audio pipeline synchronously
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

    window.speechSynthesis.cancel();
    setActiveSpeakingWord(identifier);

    try {
      // Prepend '、' so browser audio engine has natural lead-in and never clips the first sound
      const utterance = new SpeechSynthesisUtterance("、" + phoneticText);
      utterance.lang = "ja-JP";
      utterance.rate = rate; // 0.88 for articulate, distinct, clear mora pronunciation
      utterance.pitch = 1.0;

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
  // ==========================================
  const [quizFilterType, setQuizFilterType] = useState<QuizType>("all");
  const [quizBatchSize, setQuizBatchSize] = useState<number>(20);
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
    const types: ("kanji_reading" | "kanji_meaning" | "audio_meaning" | "meaning_japanese")[] = [
      "kanji_reading",
      "kanji_meaning",
      "audio_meaning",
      "meaning_japanese",
    ];

    let chosenType = preferredType;
    if (!chosenType || chosenType === ("all" as any)) {
      const hasKanji = /[\u4e00-\u9faf]/.test(item.word);
      const eligibleTypes = hasKanji ? types : types.filter((t) => t !== "kanji_reading");
      chosenType = eligibleTypes[Math.floor(Math.random() * eligibleTypes.length)];
    }

    const allReadings = N4_LESSON_2_VOCAB.map((v) => v.reading);
    const allMeanings = N4_LESSON_2_VOCAB.map((v) => v.meaning);
    const allWords = N4_LESSON_2_VOCAB.map((v) => v.word);

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
        explanation: `${item.word} (${item.reading}): ${item.meaning}`,
        item,
      };
    } else if (chosenType === "kanji_meaning") {
      const { options, correctIndex } = generateOptions(item.meaning, allMeanings);
      return {
        id: `q_${item.id}_km_${Date.now()}_${Math.random()}`,
        originalVocabId: item.id,
        type: "kanji_meaning",
        prompt: isEn
          ? `What is the correct meaning of 「${item.word}」?`
          : `Từ 「${item.word}」 có nghĩa tiếng Việt là gì?`,
        subPrompt: item.hanViet ? `Âm Hán Việt: ${item.hanViet} | Cách đọc: ${item.reading}` : `Cách đọc: ${item.reading}`,
        displayWord: item.word,
        options,
        correctAnswerIndex: correctIndex,
        explanation: `${item.word} [${item.reading}] nghĩa là: ${item.meaning}`,
        item,
      };
    } else if (chosenType === "audio_meaning") {
      const { options, correctIndex } = generateOptions(item.meaning, allMeanings);
      return {
        id: `q_${item.id}_am_${Date.now()}_${Math.random()}`,
        originalVocabId: item.id,
        type: "audio_meaning",
        prompt: isEn
          ? "Listen to the audio and choose the correct meaning:"
          : "Nghe voice phát âm và chọn nghĩa tiếng Việt chính xác:",
        audioText: item.word,
        options,
        correctAnswerIndex: correctIndex,
        explanation: `Phát âm: ${item.reading} (${item.word}) ➔ Nghĩa: ${item.meaning}`,
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
          ? `Which Japanese word matches: "${item.meaning}"?`
          : `Từ tiếng Nhật nào có nghĩa là: "${item.meaning}"?`,
        subPrompt: item.hanViet ? `Gợi ý Hán Việt: ${item.hanViet}` : undefined,
        options,
        correctAnswerIndex: correctIndex,
        explanation: `${item.meaning} ➔ ${item.word} (${item.reading})`,
        item,
      };
    }
  };

  // Initialize Quiz Queue
  const startQuiz = () => {
    let sourcePool = [...filteredVocab];
    if (sourcePool.length === 0) sourcePool = [...N4_LESSON_2_VOCAB];

    sourcePool = sourcePool.sort(() => 0.5 - Math.random());
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
        msg: isEn ? "Correct! Excellent job! 🎉" : "Chính xác! Làm rất tốt! 🎉",
      });
      setCompletedCount((prev) => prev + 1);
    } else {
      setWrongAttemptCount((prev) => prev + 1);
      setQuizFeedback({
        isCorrect: false,
        msg: isEn
          ? `Incorrect! Correct answer: ${currentQuestion.options[currentQuestion.correctAnswerIndex]}`
          : `Chưa đúng! Đáp án đúng là: ${currentQuestion.options[currentQuestion.correctAnswerIndex]}`,
      });

      // ADAPTIVE QUEUE: Re-queue question with fresh randomized options so learner must get 100%
      const clonedItem = currentQuestion.item;
      const reQueuedQuestion = buildQuestion(clonedItem, currentQuestion.type);
      setQuizQueue((prev) => [...prev, reQueuedQuestion]);
    }
  };

  // Move to next question or complete quiz
  const handleNextQuizQuestion = () => {
    setSelectedOption(null);
    setIsAnswerSubmitted(false);
    setQuizFeedback(null);

    if (currentQuizIndex + 1 < quizQueue.length) {
      setCurrentQuizIndex((prev) => prev + 1);
    } else {
      setIsQuizCompleted(true);
    }
  };

  // Restart Quiz
  const handleRestartQuiz = () => {
    startQuiz();
  };

  return (
    <div className="space-y-6">
      {/* ======================================================== */}
      {/* TOP HEADER: BUỔI 2 TỪ VỰNG & PHÂN ĐOẠN 3 TÍNH NĂNG */}
      {/* ======================================================== */}
      <div className="bg-gradient-to-r from-white/95 via-pink-50/70 to-rose-50/80 backdrop-blur-xl rounded-3xl p-5 md:p-6 border border-[#8a5b61]/20 shadow-sm">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#8a5b61]/10 text-[#8a5b61] text-xs font-bold mb-2">
              <Layers className="w-3.5 h-3.5 text-[#8a5b61]" />
              <span>N4 Buổi 2: Phó từ & Động từ trọng tâm</span>
              <span className="w-1 h-1 rounded-full bg-[#8a5b61]" />
              <span>129 từ vựng</span>
            </div>
            <h2 className="font-serif text-2xl md:text-3xl font-black text-[#8a5b61] tracking-wide">
              {isEn ? "N4 Session 2 Vocabulary" : "TỪ VỰNG N4 - BUỔI 2"}
            </h2>
            <p className="text-xs md:text-sm text-gray-600 font-sans mt-1">
              {isEn
                ? "Full 129 vocabulary items with flashcards, example sentences, audio pronunciation, and 4-mode adaptive quiz."
                : "Học trọn bộ 129 từ vựng với Flashcard thông minh, 1 câu ví dụ thực tế, voice đọc ngay lập tức và bài tập 4 dạng đạt 100%."}
            </p>
          </div>

          {/* 3 Main Sub-Tabs & Furigana Toggle */}
          <div className="flex flex-wrap items-center gap-2 self-stretch md:self-auto justify-center">
            <div className="flex items-center bg-white/80 p-1.5 rounded-2xl border border-pink-200/80 shadow-2xs gap-1.5">
              <button
                onClick={() => setSubTab("flashcard")}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold font-sans transition-all cursor-pointer flex items-center gap-1.5 ${
                  subTab === "flashcard"
                    ? "bg-[#8a5b61] text-white shadow-xs"
                    : "text-[#8a5b61] hover:bg-pink-50"
                }`}
              >
                <Sparkles className="w-4 h-4" />
                <span>{isEn ? "Flashcard" : "Thẻ ghi nhớ"}</span>
              </button>

              <button
                onClick={() => setSubTab("list")}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold font-sans transition-all cursor-pointer flex items-center gap-1.5 ${
                  subTab === "list"
                    ? "bg-[#8a5b61] text-white shadow-xs"
                    : "text-[#8a5b61] hover:bg-pink-50"
                }`}
              >
                <List className="w-4 h-4" />
                <span>{isEn ? "Vocabulary List" : "Danh sách (129 từ)"}</span>
              </button>

              <button
                onClick={() => setSubTab("quiz")}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold font-sans transition-all cursor-pointer flex items-center gap-1.5 ${
                  subTab === "quiz"
                    ? "bg-[#8a5b61] text-white shadow-xs"
                    : "text-[#8a5b61] hover:bg-pink-50"
                }`}
              >
                <BrainCircuit className="w-4 h-4 text-amber-300" />
                <span>{isEn ? "100% Quiz" : "Bài tập 100%"}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Batch filters for Flashcard and List: 4 pages in PDF */}
        {subTab !== "quiz" && (
          <div className="flex flex-wrap items-center justify-between gap-3 mt-4 pt-4 border-t border-pink-200/50">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-xs font-bold text-gray-500 mr-1 flex items-center gap-1">
                <span>Trang PDF:</span>
              </span>
              <button
                onClick={() => setSelectedBatch("all")}
                className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  selectedBatch === "all"
                    ? "bg-[#8a5b61] text-white shadow-2xs"
                    : "bg-white/80 text-gray-700 hover:bg-white border border-pink-100"
                }`}
              >
                Tất cả (129 từ)
              </button>
              <button
                onClick={() => setSelectedBatch("p1")}
                className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  selectedBatch === "p1"
                    ? "bg-[#8a5b61] text-white shadow-2xs"
                    : "bg-white/80 text-gray-700 hover:bg-white border border-pink-100"
                }`}
              >
                Trang 1 (1 - 36)
              </button>
              <button
                onClick={() => setSelectedBatch("p2")}
                className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  selectedBatch === "p2"
                    ? "bg-[#8a5b61] text-white shadow-2xs"
                    : "bg-white/80 text-gray-700 hover:bg-white border border-pink-100"
                }`}
              >
                Trang 2 (37 - 73)
              </button>
              <button
                onClick={() => setSelectedBatch("p3")}
                className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  selectedBatch === "p3"
                    ? "bg-[#8a5b61] text-white shadow-2xs"
                    : "bg-white/80 text-gray-700 hover:bg-white border border-pink-100"
                }`}
              >
                Trang 3 (74 - 110)
              </button>
              <button
                onClick={() => setSelectedBatch("p4")}
                className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  selectedBatch === "p4"
                    ? "bg-[#8a5b61] text-white shadow-2xs"
                    : "bg-white/80 text-gray-700 hover:bg-white border border-pink-100"
                }`}
              >
                Trang 4 (111 - 129)
              </button>
            </div>

            {/* Quick search input */}
            <div className="relative w-full sm:w-64">
              <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm từ vựng, hán tự, nghĩa..."
                className="w-full pl-8 pr-3 py-1.5 rounded-xl text-xs font-sans bg-white border border-pink-200/80 text-[#8a5b61] placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#8a5b61]"
              />
            </div>
          </div>
        )}
      </div>

      {/* ======================================================== */}
      {/* SUB-TAB 1: FLASHCARD VIEW */}
      {/* ======================================================== */}
      {subTab === "flashcard" && currentCard && (
        <div className="max-w-2xl mx-auto space-y-4">
          {/* Controls Bar */}
          <div className="flex items-center justify-between text-xs text-gray-600 bg-white/70 backdrop-blur-md px-4 py-2 rounded-2xl border border-pink-100 shadow-2xs">
            <div className="flex items-center gap-2">
              <span className="font-bold text-[#8a5b61]">
                {currentCardIndex + 1} / {filteredVocab.length}
              </span>
              {currentCard.category && (
                <span className="bg-pink-100/70 text-pink-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                  {currentCard.category}
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setAutoPlayVoice(!autoPlayVoice)}
                className={`px-2.5 py-1 rounded-xl text-[11px] font-bold flex items-center gap-1 transition-all cursor-pointer ${
                  autoPlayVoice
                    ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                    : "bg-gray-100 text-gray-500"
                }`}
                title="Tự động phát âm thanh khi chuyển thẻ"
              >
                <Volume2 className="w-3.5 h-3.5" />
                <span>{autoPlayVoice ? "Tự động đọc: Bật" : "Tự động đọc: Tắt"}</span>
              </button>

              <button
                onClick={handleShuffleCards}
                className="p-1.5 rounded-xl bg-pink-50 hover:bg-pink-100 text-[#8a5b61] transition-all cursor-pointer"
                title="Xáo trộn ngẫu nhiên"
              >
                <Shuffle className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* 3D Flip Card Container */}
          <div
            className="w-full h-[360px] sm:h-[400px] cursor-pointer"
            onClick={() => setIsFlipped(!isFlipped)}
            style={{ perspective: "1000px" }}
          >
            <motion.div
              animate={{ rotateY: isFlipped ? 180 : 0 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="w-full h-full relative"
              style={{ transformStyle: "preserve-3d" }}
            >
              {/* Mặt trước của thẻ (Front: Chữ Nhật, Loa, Hiragana) */}
              <div
                className="absolute inset-0 w-full h-full bg-white/95 backdrop-blur-xl rounded-3xl p-6 md:p-8 border-2 border-pink-200/80 shadow-md flex flex-col justify-between"
                style={{ backfaceVisibility: "hidden" }}
              >
                <div className="flex items-center justify-between text-xs text-gray-400">
                  <span className="font-bold text-[#8a5b61] bg-pink-50 px-2.5 py-1 rounded-full border border-pink-100">
                    Mặt trước: Chữ Nhật & Phát âm
                  </span>
                  {currentCard.hanViet && (
                    <span className="font-bold text-gray-600 bg-gray-50 px-2.5 py-1 rounded-full border border-gray-100">
                      Hán Việt: {currentCard.hanViet}
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

              {/* Mặt sau của thẻ (Back: Nghĩa tiếng Việt, Hán Việt, 1 Câu ví dụ có voice) */}
              <div
                className="absolute inset-0 w-full h-full bg-gradient-to-br from-white via-rose-50/40 to-pink-50/60 backdrop-blur-xl rounded-3xl p-6 md:p-8 border-2 border-[#8a5b61]/30 shadow-md flex flex-col justify-between"
                style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
              >
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span className="font-bold text-[#8a5b61] bg-pink-100/70 px-2.5 py-1 rounded-full">
                    Mặt sau: Nghĩa & Câu ví dụ
                  </span>
                  <span className="font-jp font-bold text-gray-700 text-sm">
                    {currentCard.word} [{currentCard.reading}]
                  </span>
                </div>

                <div className="my-auto space-y-3">
                  {/* Hán Việt */}
                  <div className="flex items-center justify-center gap-2">
                    {currentCard.hanViet && (
                      <span className="bg-amber-100/70 text-amber-900 font-bold text-xs px-3 py-1 rounded-full border border-amber-200/80">
                        Âm Hán: {currentCard.hanViet}
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

                    <p className="font-jp text-sm sm:text-base font-bold text-gray-900 leading-relaxed pt-1">
                      {currentCard.example}
                    </p>
                    <p className="text-xs text-gray-600 font-sans italic">
                      → {currentCard.exampleMeaning}
                    </p>
                  </div>
                </div>

                <div className="text-center text-[11px] text-gray-400 font-sans pt-2 border-t border-pink-100/60">
                  {isEn ? "Tap to flip back" : "Chạm thẻ để lật lại mặt trước"} ↺
                </div>
              </div>
            </motion.div>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center justify-between gap-3 pt-2">
            <button
              onClick={() => {
                setIsFlipped(false);
                setCurrentCardIndex((prev) => (prev > 0 ? prev - 1 : filteredVocab.length - 1));
              }}
              className="flex-1 py-3 px-4 rounded-2xl bg-white hover:bg-pink-50 border border-pink-200 text-[#8a5b61] font-bold text-sm shadow-2xs flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>{isEn ? "Previous Word" : "Từ trước đó"}</span>
            </button>

            <button
              onClick={() => setIsFlipped(!isFlipped)}
              className="py-3 px-5 rounded-2xl bg-[#8a5b61]/10 hover:bg-[#8a5b61]/20 text-[#8a5b61] font-bold text-sm shadow-2xs flex items-center justify-center gap-1.5 transition-all active:scale-95 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>{isFlipped ? "Xem mặt trước" : "Lật xem nghĩa"}</span>
            </button>

            <button
              onClick={() => {
                setIsFlipped(false);
                setCurrentCardIndex((prev) => (prev < filteredVocab.length - 1 ? prev + 1 : 0));
              }}
              className="flex-1 py-3 px-4 rounded-2xl bg-[#8a5b61] hover:bg-[#744b50] text-white font-bold text-sm shadow-md flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer"
            >
              <span>{isEn ? "Next Word" : "Từ tiếp theo"}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* SUB-TAB 2: VOCABULARY LIST VIEW */}
      {/* ======================================================== */}
      {subTab === "list" && (
        <div className="bg-white/90 backdrop-blur-xl rounded-3xl p-5 md:p-6 border border-pink-100 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-500">
              Hiển thị {filteredVocab.length} từ vựng
            </span>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-pink-100">
            <table className="w-full text-left text-xs font-sans">
              <thead className="bg-[#8a5b61]/10 text-[#8a5b61] font-bold border-b border-pink-100">
                <tr>
                  <th className="p-3 w-12 text-center">STT</th>
                  <th className="p-3">Từ vựng (Tiếng Nhật)</th>
                  <th className="p-3">Âm Hán Việt</th>
                  <th className="p-3">Cách đọc</th>
                  <th className="p-3">Nghĩa Tiếng Việt</th>
                  <th className="p-3">Câu ví dụ ứng dụng</th>
                  <th className="p-3 text-center w-16">Phát âm</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-pink-50">
                {filteredVocab.map((item) => (
                  <tr key={item.id} className="hover:bg-pink-50/50 transition-colors">
                    <td className="p-3 text-center font-bold text-gray-400">
                      {item.id}
                    </td>
                    <td className="p-3 font-jp font-bold text-base text-gray-900">
                      {item.word}
                    </td>
                    <td className="p-3 text-gray-600 font-medium">
                      {item.hanViet || "—"}
                    </td>
                    <td className="p-3 font-jp font-bold text-rose-700">
                      {item.reading}
                    </td>
                    <td className="p-3 font-bold text-gray-800">
                      {item.meaning}
                    </td>
                    <td className="p-3 space-y-0.5 min-w-[240px]">
                      <p className="font-jp text-xs text-gray-800 font-medium leading-relaxed">
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
        <div className="max-w-3xl mx-auto space-y-5">
          {/* Quiz Top Toolbar */}
          <div className="bg-white/80 backdrop-blur-md rounded-2xl p-3.5 border border-pink-100 shadow-2xs flex flex-wrap items-center justify-between gap-3">
            {/* Filter by question type */}
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-xs font-bold text-gray-500 mr-1">Dạng bài:</span>
              <button
                onClick={() => {
                  setQuizFilterType("all");
                  setTimeout(startQuiz, 50);
                }}
                className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  quizFilterType === "all"
                    ? "bg-[#8a5b61] text-white"
                    : "bg-white text-[#8a5b61] hover:bg-pink-50 border border-pink-100"
                }`}
              >
                Tất cả 4 dạng
              </button>
              <button
                onClick={() => {
                  setQuizFilterType("kanji_reading");
                  setTimeout(startQuiz, 50);
                }}
                className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  quizFilterType === "kanji_reading"
                    ? "bg-[#8a5b61] text-white"
                    : "bg-white text-[#8a5b61] hover:bg-pink-50 border border-pink-100"
                }`}
              >
                1. Chọn cách đọc
              </button>
              <button
                onClick={() => {
                  setQuizFilterType("kanji_meaning");
                  setTimeout(startQuiz, 50);
                }}
                className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  quizFilterType === "kanji_meaning"
                    ? "bg-[#8a5b61] text-white"
                    : "bg-white text-[#8a5b61] hover:bg-pink-50 border border-pink-100"
                }`}
              >
                2. Chọn nghĩa Việt
              </button>
              <button
                onClick={() => {
                  setQuizFilterType("audio_meaning");
                  setTimeout(startQuiz, 50);
                }}
                className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  quizFilterType === "audio_meaning"
                    ? "bg-[#8a5b61] text-white"
                    : "bg-white text-[#8a5b61] hover:bg-pink-50 border border-pink-100"
                }`}
              >
                3. Nghe Voice
              </button>
              <button
                onClick={() => {
                  setQuizFilterType("meaning_japanese");
                  setTimeout(startQuiz, 50);
                }}
                className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  quizFilterType === "meaning_japanese"
                    ? "bg-[#8a5b61] text-white"
                    : "bg-white text-[#8a5b61] hover:bg-pink-50 border border-pink-100"
                }`}
              >
                4. Chọn tiếng Nhật
              </button>
            </div>

            {/* Restart button */}
            <button
              onClick={handleRestartQuiz}
              className="px-3 py-1 rounded-xl text-xs font-bold text-[#8a5b61] bg-pink-50 hover:bg-pink-100 border border-pink-200 transition-all cursor-pointer flex items-center gap-1 active:scale-95"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Làm lại từ đầu</span>
            </button>
          </div>

          {/* Active Quiz Card or Completion Screen */}
          {!isQuizCompleted && currentQuestion ? (
            <div className="bg-white/95 backdrop-blur-xl rounded-3xl p-6 md:p-8 border-2 border-pink-200 shadow-md space-y-6">
              {/* Question Progress Header with 100% Adaptive indicator */}
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-pink-100 pb-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold bg-[#8a5b61]/10 text-[#8a5b61] px-3 py-1 rounded-full">
                    Câu {currentQuizIndex + 1} / {quizQueue.length}
                  </span>
                  <span className="text-xs text-gray-500 font-sans">
                    Đã hoàn thành đúng: <strong className="text-emerald-700">{completedCount}</strong> / {quizQueue.length}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 text-[11px] font-bold text-amber-800 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
                  <Flame className="w-3.5 h-3.5 text-amber-500" />
                  <span>Quy tắc: Đúng 100% mới hoàn thành</span>
                </div>
              </div>

              {/* Question Prompt */}
              <div className="text-center space-y-3 py-2">
                <span className="inline-block text-[11px] font-bold uppercase tracking-wider text-[#8a5b61] bg-pink-50 px-3 py-0.5 rounded-full border border-pink-100">
                  {currentQuestion.type === "kanji_reading" && "Dạng 1: Hiện chữ Hán chọn cách đọc đúng"}
                  {currentQuestion.type === "kanji_meaning" && "Dạng 2: Hiện chữ Hán chọn nghĩa tiếng Việt đúng"}
                  {currentQuestion.type === "audio_meaning" && "Dạng 3: Nghe voice phát âm chọn nghĩa tiếng Việt đúng"}
                  {currentQuestion.type === "meaning_japanese" && "Dạng 4: Hiện từ tiếng Việt chọn tiếng Nhật đúng"}
                </span>

                <h3 className="text-lg sm:text-xl font-bold text-gray-900 leading-snug">
                  {currentQuestion.prompt}
                </h3>

                {currentQuestion.subPrompt && (
                  <p className="text-xs font-medium text-gray-500 font-sans">
                    {currentQuestion.subPrompt}
                  </p>
                )}

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
                      btnStyle = "bg-emerald-100 text-emerald-900 border-emerald-500 font-bold ring-2 ring-emerald-400";
                    } else if (isSelected && !isCorrect) {
                      btnStyle = "bg-rose-100 text-rose-900 border-rose-400 ring-2 ring-rose-300";
                    } else {
                      btnStyle = "bg-gray-50 text-gray-400 border-gray-200 opacity-60";
                    }
                  }

                  return (
                    <button
                      key={optIdx}
                      disabled={isAnswerSubmitted}
                      onClick={() => handleSelectOption(optIdx)}
                      className={`w-full p-4 rounded-2xl border text-left font-sans text-sm sm:text-base transition-all flex items-center justify-between shadow-2xs ${btnStyle} cursor-pointer active:scale-98`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-7 h-7 rounded-full bg-black/5 flex items-center justify-center text-xs font-bold shrink-0">
                          {String.fromCharCode(65 + optIdx)}
                        </span>
                        <span className="font-jp font-medium">{opt}</span>
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

              {/* Feedback and Continue Button */}
              {isAnswerSubmitted && quizFeedback && (
                <div
                  className={`p-4 rounded-2xl border text-sm space-y-2 ${
                    quizFeedback.isCorrect
                      ? "bg-emerald-50 border-emerald-300 text-emerald-900"
                      : "bg-rose-50 border-rose-300 text-rose-900"
                  }`}
                >
                  <div className="flex items-center gap-2 font-bold">
                    {quizFeedback.isCorrect ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    ) : (
                      <XCircle className="w-5 h-5 text-rose-600" />
                    )}
                    <span>{quizFeedback.msg}</span>
                  </div>
                  <p className="text-xs text-gray-700 font-sans italic leading-relaxed">
                    💡 Giải thích: {currentQuestion.explanation}
                  </p>
                  {!quizFeedback.isCorrect && (
                    <p className="text-[11px] text-rose-700 font-sans font-semibold">
                      (Từ này sẽ được xếp vào cuối hàng đợi để bạn làm lại cho tới khi chính xác 100%)
                    </p>
                  )}
                </div>
              )}

              {/* Action Buttons */}
              <div className="pt-2 flex items-center justify-end">
                {!isAnswerSubmitted ? (
                  <button
                    disabled={selectedOption === null}
                    onClick={handleSubmitQuizAnswer}
                    className={`px-6 py-3 rounded-2xl font-bold text-sm shadow-md transition-all ${
                      selectedOption === null
                        ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                        : "bg-[#8a5b61] hover:bg-[#724a4f] text-white active:scale-95 cursor-pointer"
                    }`}
                  >
                    Kiểm tra đáp án
                  </button>
                ) : (
                  <button
                    onClick={handleNextQuizQuestion}
                    className="px-6 py-3 rounded-2xl bg-[#8a5b61] hover:bg-[#724a4f] text-white font-bold text-sm shadow-md transition-all active:scale-95 cursor-pointer flex items-center gap-1.5"
                  >
                    <span>{currentQuizIndex + 1 < quizQueue.length ? "Câu tiếp theo" : "Xem kết quả"}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ) : (
            /* COMPLETION CARD (100% ACHIEVED) */
            <div className="bg-gradient-to-br from-emerald-50/90 via-white to-pink-50/90 backdrop-blur-xl rounded-3xl p-8 border-2 border-emerald-300 shadow-xl text-center space-y-5">
              <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center shadow-inner">
                <Award className="w-10 h-10" />
              </div>

              <div className="space-y-2">
                <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider bg-emerald-100 px-3 py-1 rounded-full border border-emerald-200">
                  Hoàn thành xuất sắc 100%
                </span>
                <h3 className="font-serif text-2xl md:text-3xl font-black text-gray-900">
                  CHÚC MỪNG BẠN ĐÃ LÀM ĐÚNG 100% TỪ VỰNG BUỔI 2!
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 font-sans max-w-md mx-auto">
                  Bạn đã vượt qua toàn bộ các câu hỏi trắc nghiệm của Buổi 2 mà không bỏ sót bất kỳ từ nào!
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 max-w-sm mx-auto text-left">
                <div className="bg-white p-3 rounded-2xl border border-gray-100 shadow-2xs">
                  <span className="text-[10px] text-gray-400 block font-sans">Tổng số câu đúng</span>
                  <span className="text-xl font-black text-emerald-600">{completedCount} câu</span>
                </div>
                <div className="bg-white p-3 rounded-2xl border border-gray-100 shadow-2xs">
                  <span className="text-[10px] text-gray-400 block font-sans">Số lần thử lại</span>
                  <span className="text-xl font-black text-amber-600">{wrongAttemptCount} lần</span>
                </div>
              </div>

              <div className="pt-3 flex flex-wrap items-center justify-center gap-3">
                <button
                  onClick={handleRestartQuiz}
                  className="px-6 py-3 rounded-2xl bg-[#8a5b61] hover:bg-[#724a4f] text-white font-bold text-sm shadow-md transition-all active:scale-95 cursor-pointer flex items-center gap-2"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Luyện tập lại lần nữa</span>
                </button>

                <button
                  onClick={() => setSubTab("flashcard")}
                  className="px-6 py-3 rounded-2xl bg-white hover:bg-pink-50 border border-pink-200 text-[#8a5b61] font-bold text-sm shadow-2xs transition-all active:scale-95 cursor-pointer"
                >
                  Xem lại Flashcard
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
