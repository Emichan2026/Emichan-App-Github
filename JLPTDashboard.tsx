import React, { useState, useEffect, useMemo } from "react";
import { getChapterData, Chapter, Lesson, ChapterPractice, GrammarExplanation, ReadingQuestion, ListeningQuestion, AdaptiveQuizQuestion } from "../data/curriculumData";
import { MemoryGame } from "./MemoryGame";
import { AITutor } from "./AITutor";
import { AIKaiwa } from "./AIKaiwa";
import { motion, AnimatePresence } from "motion/react";
import { translations, getLocalizedText } from "../lib/translations";
import { 
  BookOpen, 
  Award, 
  CheckCircle2, 
  RefreshCw, 
  Layers, 
  Gamepad2, 
  BrainCircuit, 
  HelpCircle, 
  Lock, 
  Unlock, 
  Play, 
  Pause, 
  Volume2, 
  Calendar, 
  Check, 
  ChevronRight, 
  ChevronLeft, 
  Star, 
  Sparkles,
  BookOpenCheck,
  ChevronDown,
  Info,
  PenTool
} from "lucide-react";
import { KanaWritingCanvas } from "./KanaWritingCanvas";
import { LessonGoalModal } from "./LessonGoalModal";
import { KANA_STROKE_DATA } from "../data/kanaStrokeData";
import { HIRAGANA_LESSON_1 } from "../data/kanaLesson1Data";

const renderMixedText = (text: string) => {
  if (!text) return null;
  const jpRegex = /([\u3000-\u303F\u3040-\u309F\u30A0-\u30FF\uFF00-\uFFEF\u4E00-\u9FAF]+)/g;
  const parts = text.split(jpRegex);
  return (
    <>
      {parts.map((part, i) => {
        const isJp = jpRegex.test(part);
        return (
          <span key={i} className={isJp ? "font-jp" : "font-sans"}>
            {part}
          </span>
        );
      })}
    </>
  );
};

const renderExplanation = (text: string) => {
  if (!text) return null;
  const lines = text.split('\n');
  return (
    <div className="space-y-1.5">
      {lines.map((line, idx) => {
        const trimmed = line.trim();
        if (!trimmed) return <div key={idx} className="h-1" />;

        // Check if the line is surrounded by asterisks for emphasis, e.g. *Mẹo phân biệt...*
        if (trimmed.startsWith('*') && trimmed.endsWith('*')) {
          const content = trimmed.substring(1, trimmed.length - 1).trim();
          return (
            <p key={idx} className="text-xs text-[#8a5b61] font-semibold italic mt-2 mb-1">
              {renderMixedText(content)}
            </p>
          );
        }

        // Check if line contains asterisk inside for italicized portions
        if (trimmed.includes('*')) {
          const parts = trimmed.split('*');
          return (
            <p key={idx} className="text-xs text-gray-700 leading-relaxed font-sans">
              {parts.map((part, pIdx) => {
                const isItalic = pIdx % 2 === 1;
                return (
                  <span key={pIdx} className={isItalic ? "italic font-semibold text-[#8a5b61]" : ""}>
                    {renderMixedText(part)}
                  </span>
                );
              })}
            </p>
          );
        }

        const isListItem = trimmed.startsWith('- ') || trimmed.startsWith('• ');
        const displayContent = isListItem ? trimmed.substring(2).trim() : trimmed;

        return (
          <p
            key={idx}
            className={`text-xs text-gray-700 leading-relaxed font-sans ${isListItem ? "pl-3 flex items-start gap-1" : ""}`}
          >
            {isListItem && <span className="text-[#8a5b61] flex-shrink-0">•</span>}
            <span>{renderMixedText(displayContent)}</span>
          </p>
        );
      })}
    </div>
  );
};

const formatFormulaInline = (formulaText: string) => {
  if (!formulaText) return "";
  const lines = formulaText.split('\n');
  if (lines.length > 1) {
    // For multi-line formulas, return empty string so it doesn't render in the small inline badge
    return "";
  } else {
    return formulaText.replace(/Danh từ/g, 'N').replace(/Danh từ/g, 'N').replace(/của/g, 'の').replace(/của/g, 'の');
  }
};



const SINO_VIETNAMESE_MAP: Record<string, string> = {
  "私": "TƯ",
  "友": "HỮU",
  "本": "BẢN",
  "準": "CHUẨN",
  "備": "BỊ",
  "行": "HÀNH",
  "食": "THỰC",
  "飲": "ẨM",
  "美": "MỸ",
  "水": "THỦY",
  "学": "HỌC",
  "手": "THỦ",
  "案": "ÁN",
  "調": "ĐIỀU",
  "紹": "THIỆU",
  "意": "Ý",
  "解": "GIẢI",
  "複": "PHỨC",
  "発": "PHÁT",
  "緊": "KHẨN",
  "貢": "CỐNG",
  "慎": "THẬN",
  "分": "PHÂN",
  "推": "SUY",
  "画": "HỌA",
  "核": "HẠCH",
  "擁": "ỦNG",
  "契": "KHẾ",
  "国": "QUỐC",
  "銀": "NGÂN",
  "堂": "ĐƯỜNG",
  "店": "TIẾM",
  "人": "NHÂN",
  "道": "ĐẠO",
  "生": "SINH",
  "伝": "TRUYỀN",
  "上": "THƯỢNG",
  "提": "ĐỀ",
  "体": "THỂ",
  "己": "KỶ",
  "注": "CHÚ",
  "決": "QUYẾT",
  "理": "LÝ",
  "雑": "TẠP",
  "数": "SỐ",
  "展": "TRIỂN",
  "出": "XUẤT",
  "張": "TRƯƠNG",
  "急": "CẤP",
  "物": "VẬT",
  "析": "TÍCH",
  "自": "TỰ",
  "測": "TRẮC",
  "進": "TIẾN",
  "期": "KỲ",
  "的": "ĐÍCH",
  "心": "TÂM",
  "原": "NGUYÊN",
  "護": "HỘ",
  "立": "LẬP",
  "機": "CƠ",
  "約": "ƯỚC",
  
  // New N3 / N4 / N5 characters
  "値": "TRỊ",
  "段": "ĐOẠN",
  "健": "KIỆN",
  "康": "KHANG",
  "真": "CHÂN",
  "剣": "KIẾM",
  "危": "NGUY",
  "険": "HIỂM",
  "過": "QUÁ",
  "別": "BIỆT",
  "験": "NGHIỆM",
  "経": "KINH",
  "貯": "TRỮ",
  "金": "KIM",
  "節": "TIẾT",
  "文": "VĂN",
  "帰": "QUY",
  "省": "TỈNH",
  "宅": "TRẠCH",
  "検": "KIỂM",
  "索": "SÁCH",
  "査": "TRA",
  "連": "LIÊN",
  "絡": "LẠC",
  "束": "THÚC",
  "話": "THOẠI",
  "会": "HỘI",
  "社": "XÃ",
  "员": "VIÊN",
  "員": "VIÊN",
  "先": "TIÊN",
  "日": "NHẬT",
  "達": "ĐẠT",
  "誰": "THÙY",
  "昨": "TẠC",
  "姉": "TỶ",
  "一": "NHẤT",
  "緒": "TỰ",
  "件": "KIỆN",
  "将": "TƯƠNG",
  "来": "LAI",
  "重": "TRỌNG",
  "要": "YẾU",
  "何": "HÀ",
  "作": "TÁC",
  "校": "HIỆU",
  "味": "VỊ",
  "内": "NỘI",
  "言": "NGÔN",
  "葉": "DIỆP",
  "思": "TƯ",
  "考": "KHẢO",
  "問": "VẤN",
  "答": "ĐÁP",
  "強": "CƯỜNG",
  "持": "TRÌ",
  "用": "DỤNG",
  "方": "PHƯƠNG",
  "勉": "MIỄN",
  "合": "HỢP",
  "格": "CÁCH",
  "新": "TÂN",
  "聞": "VĂN",
  "常": "THƯỜNG",
  "語": "NGỮ",
  "正": "CHÍNH",
  "確": "XÁC",
  "介": "GIỚI",
  "見": "KIẾN",
  "献": "HIẾN"
};

const getSinoVietnameseOfWord = (word: string): string => {
  if (!word) return "";
  const kanjiRegex = /[\u4e00-\u9FAF]/g;
  const kanjiChars = word.match(kanjiRegex);
  if (!kanjiChars) return "";

  const sinoParts = kanjiChars.map(char => SINO_VIETNAMESE_MAP[char] || "").filter(Boolean);
  if (sinoParts.length === 0) return "";
  return sinoParts.join(" ");
};

const KANJI_DEFS: Record<string, { sino: string; meaning: string; onyomi: string; kunyomi: string; strokes: number }> = {
  "私": { sino: "TƯ", meaning: "tôi, cá nhân", onyomi: "シ", kunyomi: "わたし", strokes: 7 },
  "友": { sino: "HỮU", meaning: "bạn bè, bằng hữu", onyomi: "ユウ", kunyomi: "tomo", strokes: 4 },
  "本": { sino: "BẢN", meaning: "sách, gốc rễ, nguồn cội", onyomi: "ホン", kunyomi: "もと", strokes: 5 },
  "準": { sino: "CHUẨN", meaning: "tiêu chuẩn, chuẩn bị", onyomi: "ジュン", kunyomi: "-", strokes: 13 },
  "備": { sino: "BỊ", meaning: "trang bị, chuẩn bị", onyomi: "ビ", kunyomi: "そな.える", strokes: 12 },
  "行": { sino: "HÀNH", meaning: "đi, thực hiện, tiến hành", onyomi: "コウ / ギョウ", kunyomi: "い.く / おこな.う", strokes: 6 },
  "食": { sino: "THỰC", meaning: "ăn, thực phẩm, ẩm thực", onyomi: "ショク", kunyomi: "た.べる", strokes: 9 },
  "飲": { sino: "ẨM", meaning: "uống, ẩm thực", onyomi: "イン", kunyomi: "の.む", strokes: 12 },
  "美": { sino: "MỸ", meaning: "đẹp, mỹ lệ, hoàn mỹ", onyomi: "ビ", kunyomi: "うつく.しい", strokes: 9 },
  "水": { sino: "THỦY", meaning: "nước, thủy phân", onyomi: "スイ", kunyomi: "mizu", strokes: 4 },
  "学": { sino: "HỌC", meaning: "học tập, trường học, học giả", onyomi: "ガク", kunyomi: "まな.ぶ", strokes: 8 },
  "手": { sino: "THỦ", meaning: "tay, thủ thuật", onyomi: "シュ", kunyomi: "て", strokes: 4 },
  "案": { sino: "ÁN", meaning: "đề án, hướng dẫn, phương án", onyomi: "アン", kunyomi: "-", strokes: 10 },
  "調": { sino: "ĐIỀU", meaning: "điều tra, tra cứu, điều hòa", onyomi: "チョウ", kunyomi: "しら.べる", strokes: 15 },
  "紹": { sino: "THIỆU", meaning: "giới thiệu", onyomi: "ショウ", kunyomi: "-", strokes: 11 },
  "意": { sino: "Ý", meaning: "ý kiến, ý chí, ý nghĩa", onyomi: "イ", kunyomi: "-", strokes: 13 },
  "解": { sino: "GIẢI", meaning: "giải quyết, giải thích, phân giải", onyomi: "カイ", kunyomi: "と.く", strokes: 13 },
  "複": { sino: "PHỨC", meaning: "phức tạp, trùng lặp", onyomi: "フク", kunyomi: "-", strokes: 12 },
  "発": { sino: "PHÁT", meaning: "phát triển, phát sinh, xuất phát", onyomi: "ハツ", kunyomi: "-", strokes: 9 },
  "緊": { sino: "KHẨN", meaning: "căng thẳng, khẩn trương", onyomi: "キン", kunyomi: "-", strokes: 15 },
  "分": { sino: "PHÂN", meaning: "phân chia, phân tích, phút", onyomi: "ブン", kunyomi: "わ.かる", strokes: 4 },
  "推": { sino: "SUY", meaning: "suy đoán, đẩy đi, đề xuất", onyomi: "スイ", kunyomi: "お.す", strokes: 11 },
  "画": { sino: "HỌA", meaning: "bức tranh, kế hoạch, họa sĩ", onyomi: "ガ", kunyomi: "-", strokes: 8 },
  "核": { sino: "HẠCH", meaning: "hạt nhân, cốt lõi", onyomi: "カク", kunyomi: "-", strokes: 10 },
  "擁": { sino: "ỦNG", meaning: "bảo vệ, ủng hộ", onyomi: "ヨウ", kunyomi: "-", strokes: 16 },
  "契": { sino: "KHẾ", meaning: "hợp đồng, khế ước, thời cơ", onyomi: "ケイ", kunyomi: "-", strokes: 9 }
};

interface Stroke {
  path: string;
  labelX: number;
  labelY: number;
  label: string;
}

const KANJI_STROKE_DATA: Record<string, Stroke[]> = {
  "行": [
    { path: "M35,18 C28,28 20,40 10,48", labelX: 30, labelY: 14, label: "1" },
    { path: "M42,35 C35,46 28,58 18,68", labelX: 42, labelY: 30, label: "2" },
    { path: "M26,52 L26,90", labelX: 18, labelY: 55, label: "3" },
    { path: "M45,28 L85,28", labelX: 48, labelY: 24, label: "4" },
    { path: "M45,48 L80,48", labelX: 48, labelY: 44, label: "5" },
    { path: "M62,48 L62,80 C62,86 58,88 50,88", labelX: 70, labelY: 65, label: "6" }
  ],
  "私": [
    { path: "M38,15 C32,20 26,24 16,28", labelX: 38, labelY: 10, label: "1" },
    { path: "M15,40 L55,40", labelX: 15, labelY: 35, label: "2" },
    { path: "M34,28 L34,85", labelX: 28, labelY: 28, label: "3" },
    { path: "M34,40 C28,50 20,62 10,70", labelX: 20, labelY: 52, label: "4" },
    { path: "M34,40 C38,46 44,53 52,60", labelX: 44, labelY: 50, label: "5" },
    { path: "M68,22 C64,30 60,38 52,48", labelX: 70, labelY: 18, label: "6" },
    { path: "M60,48 L88,48", labelX: 60, labelY: 44, label: "7" },
    { path: "M62,48 L78,85", labelX: 72, labelY: 65, label: "8" }
  ],
  "友": [
    { path: "M20,28 L80,28", labelX: 20, labelY: 24, label: "1" },
    { path: "M48,12 C38,32 28,52 12,75", labelX: 45, labelY: 10, label: "2" },
    { path: "M28,45 C38,45 68,52 85,80", labelX: 28, labelY: 40, label: "3" },
    { path: "M35,55 L65,55", labelX: 35, labelY: 50, label: "4" }
  ],
  "本": [
    { path: "M15,35 L85,35", labelX: 15, labelY: 30, label: "1" },
    { path: "M50,12 L50,85", labelX: 45, labelY: 10, label: "2" },
    { path: "M50,35 C40,50 25,68 12,80", labelX: 30, labelY: 50, label: "3" },
    { path: "M50,35 C60,50 75,68 88,80", labelX: 70, labelY: 50, label: "4" },
    { path: "M30,62 L70,62", labelX: 30, labelY: 58, label: "5" }
  ],
  "水": [
    { path: "M50,15 L50,80 C50,88 45,90 40,90", labelX: 45, labelY: 12, label: "1" },
    { path: "M20,38 L45,38", labelX: 18, labelY: 34, label: "2" },
    { path: "M15,70 C22,65 30,55 40,45", labelX: 15, labelY: 65, label: "3" },
    { path: "M80,35 L55,50", labelX: 80, labelY: 30, label: "4" },
    { path: "M55,50 L85,85", labelX: 70, labelY: 60, label: "5" }
  ],
  "学": [
    { path: "M30,15 C30,22 28,28 25,32", labelX: 30, labelY: 10, label: "1" },
    { path: "M50,12 C50,18 48,22 45,26", labelX: 50, labelY: 8, label: "2" },
    { path: "M72,15 C68,22 62,30 58,35", labelX: 75, labelY: 10, label: "3" },
    { path: "M15,38 L85,38 L85,45", labelX: 15, labelY: 34, label: "4" },
    { path: "M35,48 L65,48", labelX: 35, labelY: 44, label: "5" },
    { path: "M50,38 L50,70", labelX: 45, labelY: 52, label: "6" },
    { path: "M25,72 L75,72", labelX: 25, labelY: 68, label: "7" }
  ],
  "食": [
    { path: "M50,12 C40,22 28,35 15,45", labelX: 45, labelY: 8, label: "1" },
    { path: "M50,12 C60,22 72,35 85,45", labelX: 55, labelY: 8, label: "2" },
    { path: "M35,35 L65,35", labelX: 35, labelY: 30, label: "3" },
    { path: "M30,48 L70,48", labelX: 30, labelY: 44, label: "4" },
    { path: "M50,48 L50,75", labelX: 45, labelY: 58, label: "5" },
    { path: "M35,62 L35,82", labelX: 30, labelY: 68, label: "6" },
    { path: "M35,62 L65,62 L65,82", labelX: 55, labelY: 58, label: "7" },
    { path: "M35,82 L65,82", labelX: 45, labelY: 88, label: "8" }
  ],
  "分": [
    { path: "M45,15 C38,25 28,35 15,45", labelX: 42, labelY: 10, label: "1" },
    { path: "M55,15 C62,25 72,35 85,45", labelX: 58, labelY: 10, label: "2" },
    { path: "M20,55 L80,55", labelX: 20, labelY: 50, label: "3" },
    { path: "M50,40 L50,85 C50,92 45,95 38,95", labelX: 45, labelY: 65, label: "4" }
  ],
  "手": [
    { path: "M75,18 C65,22 50,25 25,28", labelX: 70, labelY: 14, label: "1" },
    { path: "M20,45 L80,45", labelX: 20, labelY: 40, label: "2" },
    { path: "M15,62 L85,62", labelX: 15, labelY: 57, label: "3" },
    { path: "M50,28 L50,82 C50,90 44,92 38,92", labelX: 45, labelY: 34, label: "4" }
  ],
  "美": [
    { path: "M35,15 L45,22", labelX: 30, labelY: 12, label: "1" },
    { path: "M65,12 L55,20", labelX: 68, labelY: 10, label: "2" },
    { path: "M20,32 L80,32", labelX: 20, labelY: 28, label: "3" },
    { path: "M30,48 L70,48", labelX: 30, labelY: 44, label: "4" },
    { path: "M15,65 L85,65", labelX: 15, labelY: 60, label: "5" },
    { path: "M50,22 L50,82", labelX: 45, labelY: 26, label: "6" },
    { path: "M35,78 L65,78", labelX: 35, labelY: 74, label: "7" },
    { path: "M30,90 L70,90", labelX: 30, labelY: 86, label: "8" },
    { path: "M50,78 L85,95", labelX: 60, labelY: 84, label: "9" }
  ],
  "飲": [
    { path: "M30,15 C25,22 20,30 12,38", labelX: 28, labelY: 10, label: "1" },
    { path: "M32,25 L48,25", labelX: 32, labelY: 20, label: "2" },
    { path: "M32,38 L48,38", labelX: 32, labelY: 34, label: "3" },
    { path: "M20,50 L45,50", labelX: 20, labelY: 46, label: "4" },
    { path: "M30,50 L30,85", labelX: 25, labelY: 58, label: "5" },
    { path: "M12,85 L48,85", labelX: 12, labelY: 80, label: "6" },
    { path: "M65,15 L65,45", labelX: 60, labelY: 12, label: "7" },
    { path: "M52,30 C62,30 78,35 85,55", labelX: 52, labelY: 26, label: "8" },
    { path: "M55,58 L85,58", labelX: 55, labelY: 54, label: "9" },
    { path: "M70,58 L70,88", labelX: 65, labelY: 66, label: "10" }
  ]
};

const KanjiStrokeGuide: React.FC<{ kanji: string }> = ({ kanji }) => {
  const [activeTab, setActiveTab] = React.useState<"stroke" | "practice">("stroke");
  const [key, setKey] = React.useState<number>(0);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [paths, setPaths] = React.useState<{ d: string; id: string }[]>([]);
  const [numbers, setNumbers] = React.useState<{ text: string; transform: string }[]>([]);
  const [viewBox, setViewBox] = React.useState<string>("0 0 109 109");

  // Animation & Control states
  const [isPlaying, setIsPlaying] = React.useState<boolean>(true);
  const [speed, setSpeed] = React.useState<"slow" | "normal" | "fast">("normal");
  const [showNumbers, setShowNumbers] = React.useState<boolean>(true);
  const [currentStep, setCurrentStep] = React.useState<number>(-1); // -1: Autoplay, >=0: step-by-step mode

  // Canvas drawing state
  const canvasRef = React.useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = React.useState<boolean>(false);
  const [showGuide, setShowGuide] = React.useState<boolean>(true);

  // Fetch KanjiVG SVG data dynamically
  React.useEffect(() => {
    let active = true;
    setLoading(true);

    const codePoint = kanji.charCodeAt(0).toString(16).padStart(5, '0');
    const url = `https://cdn.jsdelivr.net/gh/kanjivg/kanjivg@master/kanji/${codePoint}.svg`;

    fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error("Could not load KanjiVG");
        return res.text();
      })
      .then((svgText) => {
        if (!active) return;
        try {
          const parser = new DOMParser();
          const doc = parser.parseFromString(svgText, "image/svg+xml");
          const svgEl = doc.querySelector("svg");
          const parsedViewBox = svgEl?.getAttribute("viewBox") || "0 0 109 109";

          const strokePathsGroup = doc.querySelector('[id^="kvg:StrokePaths_"]');
          const pElements = strokePathsGroup
            ? Array.from(strokePathsGroup.querySelectorAll("path"))
            : Array.from(doc.querySelectorAll("path"));

          const parsedPaths = pElements
            .map((p, idx) => ({
              d: p.getAttribute("d") || "",
              id: p.getAttribute("id") || `stroke-${idx}`,
            }))
            .filter((p) => p.d);

          const numbersGroup = doc.querySelector('[id^="kvg:StrokeNumbers_"]');
          const nElements = numbersGroup
            ? Array.from(numbersGroup.querySelectorAll("text"))
            : Array.from(doc.querySelectorAll("text"));

          const parsedNumbers = nElements
            .map((t) => ({
              text: t.textContent || "",
              transform: t.getAttribute("transform") || "",
            }))
            .filter((n) => n.text);

          setPaths(parsedPaths);
          setNumbers(parsedNumbers);
          setViewBox(parsedViewBox);
          setLoading(false);
        } catch (err) {
          console.error("Error parsing Kanji SVG:", err);
          useFallback();
        }
      })
      .catch((err) => {
        console.warn("Could not fetch KanjiVG SVG, using fallback:", err);
        if (active) {
          useFallback();
        }
      });

    function useFallback() {
      const localStrokes = KANJI_STROKE_DATA[kanji];
      if (localStrokes && localStrokes.length > 0) {
        setPaths(localStrokes.map((s, idx) => ({ d: s.path, id: `local-${idx}` })));
        setNumbers(
          localStrokes.map((s) => ({
            text: s.label,
            transform: `matrix(1 0 0 1 ${s.labelX} ${s.labelY})`,
          }))
        );
        setViewBox("0 0 100 100");
      } else {
        // Safe standard fallback
        setPaths([
          { d: "M15,20 L85,20", id: "f1" },
          { d: "M50,15 L50,85", id: "f2" },
          { d: "M15,50 L85,50", id: "f3" },
          { d: "M25,80 Q50,60 75,80", id: "f4" },
        ]);
        setNumbers([
          { text: "1", transform: "matrix(1 0 0 1 18 16)" },
          { text: "2", transform: "matrix(1 0 0 1 45 12)" },
          { text: "3", transform: "matrix(1 0 0 1 18 46)" },
          { text: "4", transform: "matrix(1 0 0 1 23 76)" },
        ]);
        setViewBox("0 0 100 100");
      }
      setLoading(false);
    }

    // Reset controls
    setIsPlaying(true);
    setCurrentStep(-1);

    return () => {
      active = false;
    };
  }, [kanji]);

  // Clean canvas when kanji changes or tab changes
  React.useEffect(() => {
    if (activeTab === "practice" && canvasRef.current) {
      clearCanvas();
    }
  }, [kanji, activeTab]);

  // Canvas drawing handlers with precise scaling coordinates
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    setIsDrawing(true);
    ctx.beginPath();

    const rect = canvas.getBoundingClientRect();
    let clientX, clientY;

    if ("touches" in e) {
      if (e.touches.length === 0) return;
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    const x = ((clientX - rect.left) / rect.width) * canvas.width;
    const y = ((clientY - rect.top) / rect.height) * canvas.height;

    ctx.moveTo(x, y);
    ctx.lineWidth = 4;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle = "#8a5b61";
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    let clientX, clientY;

    if ("touches" in e) {
      if (e.touches.length === 0) return;
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    const x = ((clientX - rect.left) / rect.width) * canvas.width;
    const y = ((clientY - rect.top) / rect.height) * canvas.height;

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  // Determine stroke speed durations
  const getStrokeStyle = (index: number) => {
    if (currentStep >= 0) {
      // STEP-BY-STEP MODE
      if (index < currentStep) {
        return {
          strokeDasharray: "300",
          strokeDashoffset: "0",
          stroke: "#4b5563", // Done stroke: solid slate grey
          strokeWidth: "3.5",
          opacity: 0.9,
          transition: "all 0.25s ease",
        };
      } else if (index === currentStep) {
        return {
          strokeDasharray: "300",
          strokeDashoffset: "0",
          stroke: "#ef4444", // Active stroke: bold bright red (like Mazii)
          strokeWidth: "5.5", // Thicker for focus
          opacity: 1,
          animation: "pulseStroke 1s infinite alternate",
          transition: "all 0.2s ease",
        };
      } else {
        return {
          strokeDasharray: "300",
          strokeDashoffset: "0",
          stroke: "#8a5b61",
          strokeWidth: "2",
          opacity: 0.08, // Future stroke: faint trace guideline skeleton
          transition: "all 0.25s ease",
        };
      }
    } else {
      // AUTOPLAY SEQUENTIAL MODE
      const interval = speed === "slow" ? 0.95 : speed === "normal" ? 0.55 : 0.28;
      const duration = speed === "slow" ? 0.9 : speed === "normal" ? 0.5 : 0.24;

      return {
        strokeDasharray: "300",
        strokeDashoffset: "300",
        animation: isPlaying ? `drawStroke ${duration}s ease-out forwards` : "none",
        animationDelay: isPlaying ? `${index * interval}s` : "0s",
        stroke: "#8a5b61",
        strokeWidth: "3.5",
        opacity: isPlaying ? 1 : 0.95,
      };
    }
  };

  return (
    <div className="flex flex-col items-center w-[170px] select-none shrink-0 bg-[#8a5b61]/5 p-2 rounded-2xl border border-[#8a5b61]/15 shadow-2xs">
      {/* Tab Selectors */}
      <div className="flex w-full border border-[#8a5b61]/20 rounded-lg overflow-hidden mb-2 bg-white/80 backdrop-blur-xs">
        <button
          onClick={() => setActiveTab("stroke")}
          className={`flex-1 text-[10px] py-1 font-extrabold text-center transition-all cursor-pointer ${
            activeTab === "stroke"
              ? "bg-[#8a5b61] text-white"
              : "text-[#8a5b61] hover:bg-[#8a5b61]/5"
          }`}
        >
          Nét viết
        </button>
        <button
          onClick={() => setActiveTab("practice")}
          className={`flex-1 text-[10px] py-1 font-extrabold text-center transition-all cursor-pointer ${
            activeTab === "practice"
              ? "bg-[#8a5b61] text-white"
              : "text-[#8a5b61] hover:bg-[#8a5b61]/5"
          }`}
        >
          Tập viết
        </button>
      </div>

      {/* TAB 1: STROKE GUIDE ANATOMY */}
      {activeTab === "stroke" && (
        <div className="flex flex-col items-center w-full space-y-2">
          {/* Calligraphy Square Grid Box */}
          <div className="relative w-[130px] h-[130px] bg-white rounded-xl border-2 border-dashed border-[#8a5b61]/25 flex items-center justify-center overflow-hidden shadow-2xs">
            {/* Grid Coordinates (Dashed lines dividing the box in 4 quadrants) */}
            <div className="absolute inset-y-0 left-1/2 w-[1px] border-l border-dashed border-[#8a5b61]/15"></div>
            <div className="absolute inset-x-0 top-1/2 h-[1px] border-t border-dashed border-[#8a5b61]/15"></div>

            {loading ? (
              <span className="text-xs text-gray-400 font-sans italic animate-pulse">Đang tải nét...</span>
            ) : (
              <>
                {/* BACKGROUND: Faint outline character underlay */}
                <span className="absolute text-[80px] font-jp text-[#8a5b61]/10 pointer-events-none select-none">
                  {kanji}
                </span>

                {/* ANIMATION OVERLAY: Vector path strokes */}
                <svg
                  key={`${key}-${currentStep}-${speed}`}
                  className="absolute inset-0 w-full h-full pointer-events-none z-10"
                  viewBox={viewBox}
                >
                  {paths.map((stroke, index) => (
                    <path
                      key={stroke.id}
                      d={stroke.d}
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      style={getStrokeStyle(index) as React.CSSProperties}
                    />
                  ))}

                  {/* Sequential numbers for directions */}
                  {showNumbers &&
                    numbers.map((n, idx) => {
                      // Hide numbers that haven't been reached yet in step mode
                      if (currentStep >= 0 && idx > currentStep) return null;
                      return (
                        <text
                          key={idx}
                          transform={n.transform}
                          className="font-mono font-black text-[10px]"
                          fill={currentStep === idx ? "#ef4444" : "#8a5b61"}
                          style={{
                            opacity: 0.7,
                            textShadow: "1px 1px 0px white, -1px -1px 0px white",
                          }}
                        >
                          {n.text}
                        </text>
                      );
                    })}
                </svg>
              </>
            )}

            {/* Custom SVG Keyframes injected */}
            <style
              dangerouslySetInnerHTML={{
                __html: `
              @keyframes drawStroke {
                to {
                  stroke-dashoffset: 0;
                }
              }
              @keyframes pulseStroke {
                from { stroke-width: 5.5; stroke: #ef4444; }
                to { stroke-width: 6.8; stroke: #b91c1c; }
              }
            `,
              }}
            />
          </div>

          {/* Interactive controls (Autoplay / Step selector) */}
          <div className="flex flex-col w-full space-y-1">
            {/* Mode 1: Auto Play controls */}
            {currentStep === -1 ? (
              <div className="flex gap-1 justify-center w-full">
                <button
                  onClick={() => setKey((p) => p + 1)}
                  className="text-[9px] font-bold text-[#8a5b61] bg-white hover:bg-[#8a5b61]/5 active:scale-95 border border-[#8a5b61]/25 rounded-lg px-2 py-1 transition-all flex items-center gap-0.5 cursor-pointer flex-1 justify-center"
                  title="Vẽ lại toàn bộ"
                >
                  <span>↺ Viết lại</span>
                </button>
                <button
                  onClick={() => {
                    // Turn on Step mode starting at 0
                    setCurrentStep(0);
                    setIsPlaying(false);
                  }}
                  className="text-[9px] font-bold text-gray-500 bg-white hover:bg-gray-50 active:scale-95 border border-gray-200 rounded-lg px-2 py-1 transition-all cursor-pointer flex-1 text-center justify-center"
                >
                  Từng nét
                </button>
              </div>
            ) : (
              /* Mode 2: Step-by-Step Navigation controls */
              <div className="flex flex-col space-y-1 w-full">
                <div className="flex gap-1 justify-center items-center w-full bg-white/60 p-1 rounded-lg border border-[#8a5b61]/10">
                  <button
                    disabled={currentStep === 0}
                    onClick={() => setCurrentStep((s) => s - 1)}
                    className="text-[9px] font-bold text-[#8a5b61] disabled:text-gray-300 disabled:pointer-events-none hover:bg-[#8a5b61]/5 p-0.5 px-1.5 rounded-md cursor-pointer transition-all"
                  >
                    ← Trước
                  </button>
                  <span className="text-[9px] font-mono font-black text-gray-600 px-1">
                    Nét {currentStep + 1}/{paths.length}
                  </span>
                  <button
                    disabled={currentStep >= paths.length - 1}
                    onClick={() => setCurrentStep((s) => s + 1)}
                    className="text-[9px] font-bold text-[#8a5b61] disabled:text-gray-300 disabled:pointer-events-none hover:bg-[#8a5b61]/5 p-0.5 px-1.5 rounded-md cursor-pointer transition-all"
                  >
                    Sau →
                  </button>
                </div>
                <button
                  onClick={() => {
                    setCurrentStep(-1);
                    setIsPlaying(true);
                    setKey((p) => p + 1);
                  }}
                  className="text-[9px] font-bold text-[#8a5b61] bg-white hover:bg-[#8a5b61]/5 border border-[#8a5b61]/25 rounded-md py-0.5 text-center cursor-pointer"
                >
                  Chạy tự động ⏯
                </button>
              </div>
            )}

            {/* General display switches */}
            {currentStep === -1 && (
              <div className="flex items-center justify-between pt-1 border-t border-[#8a5b61]/10">
                <span className="text-[8px] text-gray-400 uppercase font-extrabold tracking-wider">Tốc độ:</span>
                <div className="flex gap-0.5">
                  {(["slow", "normal", "fast"] as const).map((s) => (
                    <button
                      key={s}
                      onClick={() => setSpeed(s)}
                      className={`text-[8px] font-extrabold px-1.5 py-0.5 rounded-md capitalize cursor-pointer transition-all ${
                        speed === s
                          ? "bg-[#8a5b61] text-white"
                          : "bg-white text-gray-500 hover:bg-gray-100 border border-gray-200"
                      }`}
                    >
                      {s === "slow" ? "Chậm" : s === "normal" ? "Vừa" : "Nhanh"}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Toggle Show Numbers Checkbox */}
            <div className="flex items-center justify-between pt-1">
              <span className="text-[8px] text-gray-400 uppercase font-extrabold tracking-wider">Số thứ tự:</span>
              <button
                onClick={() => setShowNumbers((n) => !n)}
                className={`text-[8px] font-extrabold px-2 py-0.5 rounded-md cursor-pointer transition-all ${
                  showNumbers
                    ? "bg-[#8a5b61]/10 text-[#8a5b61] border border-[#8a5b61]/20"
                    : "bg-white text-gray-400 border border-gray-100"
                }`}
              >
                {showNumbers ? "Hiện" : "Ẩn"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: INTERACTIVE PRACTICE DRAWING PAD */}
      {activeTab === "practice" && (
        <div className="flex flex-col items-center w-full space-y-2">
          {/* Practice Canvas with Guideline Background */}
          <div className="relative w-[130px] h-[130px] bg-white rounded-xl border-2 border-dashed border-[#8a5b61]/35 flex items-center justify-center overflow-hidden shadow-2xs touch-none">
            {/* Calligraphy square coordinates */}
            <div className="absolute inset-y-0 left-1/2 w-[1px] border-l border-dashed border-[#8a5b61]/15 pointer-events-none"></div>
            <div className="absolute inset-x-0 top-1/2 h-[1px] border-t border-dashed border-[#8a5b61]/15 pointer-events-none"></div>

            {/* GUIDELINE BACKDROP MODEL */}
            {showGuide && (
              <svg className="absolute inset-0 w-full h-full opacity-15 pointer-events-none" viewBox={viewBox}>
                {paths.map((p, idx) => (
                  <path
                    key={idx}
                    d={p.d}
                    fill="none"
                    stroke="#8a5b61"
                    strokeWidth="4.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                ))}
              </svg>
            )}

            {/* Interactive Drawing Layer Canvas */}
            <canvas
              ref={canvasRef}
              width={130}
              height={130}
              className="absolute inset-0 z-10 cursor-crosshair touch-none"
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
              onTouchStart={(e) => {
                e.preventDefault();
                startDrawing(e);
              }}
              onTouchMove={(e) => {
                e.preventDefault();
                draw(e);
              }}
              onTouchEnd={stopDrawing}
            />
          </div>

          {/* Practice Pad Clear/Toggle actions */}
          <div className="flex gap-1 w-full">
            <button
              onClick={clearCanvas}
              className="text-[9px] font-extrabold text-[#8a5b61] bg-white hover:bg-[#8a5b61]/5 border border-[#8a5b61]/25 rounded-lg px-2 py-1 cursor-pointer flex-1 transition-all text-center justify-center flex items-center gap-0.5"
            >
              <span>Xóa nháp</span>
            </button>
            <button
              onClick={() => setShowGuide((g) => !g)}
              className={`text-[9px] font-extrabold rounded-lg px-2 py-1 border cursor-pointer flex-1 transition-all text-center justify-center ${
                showGuide
                  ? "bg-[#8a5b61]/10 border-[#8a5b61]/40 text-[#8a5b61]"
                  : "bg-white text-gray-500 border-gray-200 hover:bg-gray-100"
              }`}
            >
              {showGuide ? "Ẩn mẫu" : "Hiện mẫu"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

interface JLPTDashboardProps {
  selectedLevel: string;
  setSelectedLevel: (lvl: string) => void;
  onBackToLevels: () => void;
  lang?: "vi" | "en";
}

export const JLPTDashboard: React.FC<JLPTDashboardProps> = ({ selectedLevel, setSelectedLevel, onBackToLevels, lang = "vi" }) => {
  const t = translations[lang];

  // Curriculum progress states
  const [activeChapterNum, setActiveChapterNum] = useState<number>(1);
  const [activeDay, setActiveDay] = useState<number>(1); // 1 to 7
  const [isStudying, setIsStudying] = useState<boolean>(false);
  const [expandedChapter, setExpandedChapter] = useState<number | null>(1);

  // local states for interactive sentence writing with AI validation
  const [writingAnswers, setWritingAnswers] = useState<Record<string, string>>({});
  const [writingFeedbacks, setWritingFeedbacks] = useState<Record<string, string>>({});
  const [writingLoading, setWritingLoading] = useState<Record<string, boolean>>({});

  const checkWritingSentence = async (promptId: string, promptText: string, userText: string) => {
    if (!userText.trim()) return;

    setWritingLoading(prev => ({ ...prev, [promptId]: true }));
    setWritingFeedbacks(prev => ({ ...prev, [promptId]: "" }));

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: `Hãy đóng vai cô giáo Nhật ngữ chấm bài đặt câu cực kỳ ngắn gọn của học sinh.
Đề bài dịch câu: "${promptText}"
Câu học sinh viết bằng tiếng Nhật: "${userText}"

Yêu cầu nhận xét cực kỳ ngắn gọn, súc tích và tự nhiên theo đúng định dạng sau:
1. Nếu ngữ pháp và cách dùng từ đúng (hoặc gần như đúng hoàn toàn):
   - Chỉ hiện dấu tích ✔ ở đầu câu và thêm lời cổ vũ cực ngắn như "✔ Quá đỉnh!", "✔ Xời, quá dễ phải không?", "✔ Làm tiếp câu sau nhé!". Sau đó ghi câu tiếng Nhật chuẩn để tham khảo nếu cần. Không giải thích dông dài.

2. Nếu có lỗi sai:
   - Ghi ngắn gọn bắt đầu bằng dấu ✘: "✘ Đã rất ổn rồi nhưng chỗ này em nên sửa thành [phần sửa] nha! Câu tự nhiên hơn sẽ là: [câu chuẩn]"
   - Chỉ ra lỗi sai trực tiếp trong 1-2 câu cực ngắn, tuyệt đối không viết bài giải thích dài dòng học thuật.`
        })
      });

      const data = await response.json();
      setWritingFeedbacks(prev => ({ ...prev, [promptId]: data.text || "Cô chưa chuẩn bị kịp câu trả lời, em hỏi lại nhé!" }));
    } catch (error) {
      console.error("Failed to check sentence:", error);
      setWritingFeedbacks(prev => ({
        ...prev,
        [promptId]: "Có vẻ đường truyền bị gián đoạn một chút. Nhưng em đừng nản chí nhé, em làm rất tốt rồi! Hãy bấm gửi lại câu trả lời để cô nhận xét nha! 💕"
      }));
    } finally {
      setWritingLoading(prev => ({ ...prev, [promptId]: false }));
    }
  };

  // Helper to dynamically get the main content summary of a lesson
  const getLessonMainContentLine = (chNum: number, dNum: number) => {
    try {
      const chData = getChapterData(selectedLevel, chNum);
      if (dNum === 7) {
        return lang === "vi" 
          ? "Trắc nghiệm ôn tập tổng hợp toàn bộ từ vựng, hán tự & ngữ pháp của Chương " + chNum
          : "Comprehensive review quiz of vocabulary, kanji & grammar of Chapter " + chNum;
      }
      const lesson = chData.lessons.find(l => l.day === dNum);
      if (!lesson) return lang === "vi" ? "Học ngữ pháp Ngày " + dNum : "Study grammar Day " + dNum;
      
      const grammars = lesson.grammar.map(g => g.pattern).join(", ");
      return grammars ? `${grammars}` : (lang === "vi" ? `Học kiến thức trọng tâm Ngày ${dNum}` : `Study core grammar Day ${dNum}`);
    } catch (e) {
      return lang === "vi" ? `Học ngữ pháp trọng tâm Ngày ${dNum}` : `Study core grammar Day ${dNum}`;
    }
  };

  // Load chapter data
  const chapterData: Chapter = getChapterData(selectedLevel, activeChapterNum);
  const activeLesson: Lesson | undefined = chapterData.lessons.find(l => l.day === activeDay);
  const activePractice: ChapterPractice | undefined = chapterData.practice.day === activeDay ? chapterData.practice : undefined;

  // Active step in regular lessons: 
  // 1: Vocab & Kanji, 2: Practice Quiz, 3: Grammar, 4: Grammar Quiz, 5: Reading & Listening
  const [activeStep, setActiveStep] = useState<number>(1);

  // Lesson locks persisted in localStorage to make the game real!
  const [unlockedProgress, setUnlockedProgress] = useState<Record<string, {
    quizDone: boolean;
    grammarQuizDone: boolean;
    lessonDone: boolean;
    vocabDone?: boolean;
    kanjiDone?: boolean;
    grammarDone?: boolean;
    readingDone?: boolean;
    kaiwaDone?: boolean;
  }>>({});

  // Loaded from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(`jlpt_progress_${selectedLevel}`);
    if (saved) {
      try {
        setUnlockedProgress(JSON.parse(saved));
      } catch (e) {
        console.error("Error loading progress", e);
      }
    } else {
      // Set default initial progress
      setUnlockedProgress({});
    }
  }, [selectedLevel]);

  // Helper to update progress
  const updateProgress = (
    chapter: number,
    day: number,
    key: 'quizDone' | 'grammarQuizDone' | 'lessonDone' | 'vocabDone' | 'kanjiDone' | 'grammarDone' | 'readingDone' | 'kaiwaDone',
    value: boolean
  ) => {
    const progressId = `${chapter}-${day}`;
    const updated = {
      ...unlockedProgress,
      [progressId]: {
        ...unlockedProgress[progressId],
        [key]: value
      }
    };
    setUnlockedProgress(updated);
    localStorage.setItem(`jlpt_progress_${selectedLevel}`, JSON.stringify(updated));
  };

  const getCompletedDaysCount = () => {
    let count = 0;
    for (let chNum = 1; chNum <= 12; chNum++) {
      for (let dNum = 1; dNum <= 7; dNum++) {
        const progressId = `${chNum}-${dNum}`;
        const dayProgress = unlockedProgress[progressId];
        const isCompleted = dayProgress?.lessonDone || (dNum < 7 && dayProgress?.quizDone && dayProgress?.grammarQuizDone);
        if (isCompleted) {
          count++;
        }
      }
    }
    return count;
  };

  const isQuizUnlocked = (chapter: number, day: number) => true; // Vocabulary practice is always open when the lesson starts
  const isGrammarUnlocked = (chapter: number, day: number) => {
    const progressId = `${chapter}-${day}`;
    return unlockedProgress[progressId]?.quizDone || false;
  };
  const isGrammarQuizUnlocked = (chapter: number, day: number) => {
    return isGrammarUnlocked(chapter, day);
  };
  const isReadingListeningUnlocked = (chapter: number, day: number) => {
    const progressId = `${chapter}-${day}`;
    return unlockedProgress[progressId]?.grammarQuizDone || false;
  };

  // Reset steps and sub-states when level, chapter, or day changes
  useEffect(() => {
    setActiveStep(1);
    setVocabIndex(0);
    setIsVocabFlipped(false);
    setVocabCategoryFilter('all');
    // Reset quiz queues
    initPracticeQuiz();
    initGrammarQuiz();
    initChapterPracticeQuiz();
    // Reset writing practice
    setWritingAnswers({});
    setWritingFeedbacks({});
    setWritingLoading({});
  }, [selectedLevel, activeChapterNum, activeDay]);

  // Vocabulary Flashcards local state
  const [vocabIndex, setVocabIndex] = useState(0);
  const [isVocabFlipped, setIsVocabFlipped] = useState(false);
  const [vocabCategoryFilter, setVocabCategoryFilter] = useState<'all' | 'alphabet' | 'vocab'>('all');
  const [revealedReviewItems, setRevealedReviewItems] = useState<Record<string, boolean>>({});
  const [showGoalModal, setShowGoalModal] = useState<boolean>(false);
  const [vocabCardMode, setVocabCardMode] = useState<'card' | 'write'>('card');
  const [selectedKanaRow, setSelectedKanaRow] = useState<string>('all');

  // Check if current lesson is early alphabet lesson (Chapter 1, Days 1-4) where Romaji should be visible
  const isEarlyAlphabetLesson = selectedLevel === "N5" && activeChapterNum === 1 && activeDay <= 4;

  // Filtered vocabulary list according to category and row filter
  const currentVocabularyList = useMemo(() => {
    if (!activeLesson?.vocabulary) return [];

    // Special handling for Lesson 1 with Row-based structure
    if (activeChapterNum === 1 && activeDay === 1 && selectedKanaRow !== 'all') {
      if (selectedKanaRow === 'drill') {
        return activeLesson.vocabulary.filter(v => v.category === 'vocab');
      }
      const targetRow = HIRAGANA_LESSON_1.rows.find(r => r.row_id === selectedKanaRow);
      if (targetRow) {
        const charSet = new Set(targetRow.characters.map(c => c.char));
        return activeLesson.vocabulary.filter(v => charSet.has(v.word));
      }
    }

    if (vocabCategoryFilter === 'all') return activeLesson.vocabulary;
    const filtered = activeLesson.vocabulary.filter(v => v.category === vocabCategoryFilter);
    return filtered.length > 0 ? filtered : activeLesson.vocabulary;
  }, [activeLesson?.vocabulary, vocabCategoryFilter, selectedKanaRow, activeChapterNum, activeDay]);

  // Text-To-Speech function for Japanese words with asynchronous voice loading
  const speakWord = (word: string) => {
    if (!word || !('speechSynthesis' in window)) return;
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(word);
      utterance.lang = "ja-JP";
      
      const playWithVoice = () => {
        const voices = window.speechSynthesis.getVoices();
        const jaVoices = voices.filter(v => v.lang === "ja-JP" || v.lang.startsWith("ja"));
        
        // Sort Japanese voices to find the most professional "announcer" tone (like JLPT test audio)
        // macOS "Kyoko" or Windows "Nanami" or "Ayumi" are standard polite announcer voices
        const sortedJaVoices = [...jaVoices].sort((a, b) => {
          const getNameScore = (name: string) => {
            const lower = name.toLowerCase();
            if (lower.includes("kyoko")) return 100; // macOS professional clear female
            if (lower.includes("nanami")) return 90;  // Windows standard polite female
            if (lower.includes("ayumi")) return 80;   // Microsoft polite female
            if (lower.includes("google")) return 70;  // Google Standard Japanese
            if (lower.includes("haruka")) return 60;
            if (lower.includes("sayaka")) return 50;
            if (lower.includes("otoya")) return 40;   // macOS standard male
            if (lower.includes("ichiro")) return 30;
            if (lower.includes("tokyo")) return 20;
            return 0;
          };
          return getNameScore(b.name) - getNameScore(a.name);
        });

        const jaVoice = sortedJaVoices[0];
        if (jaVoice) {
          utterance.voice = jaVoice;
        }
        utterance.pitch = 1.0; // Clear pitch
        utterance.rate = 0.5; // Slowed down to 0.5 speed for perfect pitch-accent and accent tracking
        window.speechSynthesis.speak(utterance);
      };

      const voices = window.speechSynthesis.getVoices();
      if (voices.length === 0) {
        // Wait for voices to load if not ready
        window.speechSynthesis.onvoiceschanged = () => {
          playWithVoice();
          window.speechSynthesis.onvoiceschanged = null;
        };
      } else {
        playWithVoice();
      }
    } catch (e) {
      console.error("Error in speakWord text-to-speech:", e);
    }
  };

  // Auto-play audio pronunciation whenever studying starts, step becomes vocabulary, or a new word card is selected
  useEffect(() => {
    if (isStudying && activeStep === 1 && activeLesson && activeLesson.vocabulary && activeLesson.vocabulary[vocabIndex]) {
      const currentWord = activeLesson.vocabulary[vocabIndex].word;
      const playTimer = setTimeout(() => {
        speakWord(currentWord);
      }, 350); // slight delay for smooth transition animations
      return () => clearTimeout(playTimer);
    }
  }, [vocabIndex, activeStep, isStudying, activeDay, activeChapterNum, selectedLevel]);

  // --- ADAPTIVE RETRY QUIZ STATE MACHINE (VOCAB & KANJI) ---
  const [practiceQueue, setPracticeQueue] = useState<AdaptiveQuizQuestion[]>([]);
  const [practiceCurrentIndex, setPracticeCurrentIndex] = useState<number>(0);
  const [practiceSelectedAns, setPracticeSelectedAns] = useState<number | null>(null);
  const [practiceIsSubmitted, setPracticeIsSubmitted] = useState<boolean>(false);
  const [practiceFeedbackMsg, setPracticeFeedbackMsg] = useState<string>("");
  const [practiceOriginalCount, setPracticeOriginalCount] = useState<number>(0);
  const [practiceCorrectCount, setPracticeCorrectCount] = useState<number>(0);
  const [showPracticeVictory, setShowPracticeVictory] = useState<boolean>(false);

  const initPracticeQuiz = () => {
    if (!activeLesson) return;
    const questions = activeLesson.practiceQuiz;
    setPracticeQueue([...questions]);
    setPracticeCurrentIndex(0);
    setPracticeSelectedAns(null);
    setPracticeIsSubmitted(false);
    setPracticeFeedbackMsg("");
    setPracticeOriginalCount(questions.length);
    setPracticeCorrectCount(0);
    setShowPracticeVictory(false);
  };

  const handlePracticeAnswerClick = (optIdx: number) => {
    if (practiceIsSubmitted) return;
    setPracticeSelectedAns(optIdx);
  };

  const handlePracticeSubmit = () => {
    if (practiceSelectedAns === null || !activeLesson) return;
    const currentQuestion = practiceQueue[practiceCurrentIndex];
    const isCorrect = practiceSelectedAns === currentQuestion.correctAnswer;
    
    setPracticeIsSubmitted(true);
    
    if (isCorrect) {
      setPracticeCorrectCount(prev => prev + 1);
      setPracticeFeedbackMsg(lang === "vi" ? "Chính xác! Bạn làm rất tốt. 🎉" : "Correct! Excellent job. 🎉");
    } else {
      setPracticeFeedbackMsg(lang === "vi" ? "Chưa đúng! Cấu trúc ngữ pháp tương tự sẽ xuất hiện lại sau 2 câu." : "Incorrect! A similar pattern will appear again in 2 questions.");
      
      // Inject clone/variation 2-3 questions later
      // We look for variations in the question. If we have any, we grab one.
      const updatedQueue = [...practiceQueue];
      let retryQuestion: AdaptiveQuizQuestion;

      if (currentQuestion.variations && currentQuestion.variations.length > 0) {
        // Choose a random variation
        const variation = currentQuestion.variations[Math.floor(Math.random() * currentQuestion.variations.length)];
        retryQuestion = {
          ...currentQuestion,
          question: variation.question,
          options: variation.options,
          correctAnswer: variation.correctAnswer,
          explanation: variation.explanation,
          variations: [] // avoid infinite nested variations
        };
      } else {
        // Fallback to original question but slightly reshuffled or same
        retryQuestion = { ...currentQuestion };
      }

      // Insert at currentIndex + 3 (or at the end if queue is shorter)
      const insertIndex = Math.min(practiceCurrentIndex + 3, updatedQueue.length);
      updatedQueue.splice(insertIndex, 0, retryQuestion);
      setPracticeQueue(updatedQueue);
    }
  };

  const handlePracticeNext = () => {
    if (practiceCurrentIndex + 1 < practiceQueue.length) {
      setPracticeCurrentIndex(prev => prev + 1);
      setPracticeSelectedAns(null);
      setPracticeIsSubmitted(false);
      setPracticeFeedbackMsg("");
    } else {
      // Completed with 100% correctness (since all incorrect items were pushed back and answered again)
      setShowPracticeVictory(true);
      updateProgress(activeChapterNum, activeDay, "quizDone", true);
    }
  };

  // --- ADAPTIVE RETRY QUIZ STATE MACHINE (GRAMMAR) ---
  const [grammarQueue, setGrammarQueue] = useState<AdaptiveQuizQuestion[]>([]);
  const [grammarCurrentIndex, setGrammarCurrentIndex] = useState<number>(0);
  const [grammarSelectedAns, setGrammarSelectedAns] = useState<number | null>(null);
  const [grammarIsSubmitted, setGrammarIsSubmitted] = useState<boolean>(false);
  const [grammarFeedbackMsg, setGrammarFeedbackMsg] = useState<string>("");
  const [grammarOriginalCount, setGrammarOriginalCount] = useState<number>(0);
  const [grammarCorrectCount, setGrammarCorrectCount] = useState<number>(0);
  const [showGrammarVictory, setShowGrammarVictory] = useState<boolean>(false);

  const initGrammarQuiz = () => {
    if (!activeLesson) return;
    const questions = activeLesson.grammarQuiz;
    setGrammarQueue([...questions]);
    setGrammarCurrentIndex(0);
    setGrammarSelectedAns(null);
    setGrammarIsSubmitted(false);
    setGrammarFeedbackMsg("");
    setGrammarOriginalCount(questions.length);
    setGrammarCorrectCount(0);
    setShowGrammarVictory(false);
  };

  const handleGrammarAnswerClick = (optIdx: number) => {
    if (grammarIsSubmitted) return;
    setGrammarSelectedAns(optIdx);
  };

  const handleGrammarSubmit = () => {
    if (grammarSelectedAns === null || !activeLesson) return;
    const currentQuestion = grammarQueue[grammarCurrentIndex];
    const isCorrect = grammarSelectedAns === currentQuestion.correctAnswer;
    
    setGrammarIsSubmitted(true);
    
    if (isCorrect) {
      setGrammarCorrectCount(prev => prev + 1);
      setGrammarFeedbackMsg(lang === "vi" ? "Chính xác! Thật tuyệt vời." : "Correct! That's wonderful.");
    } else {
      setGrammarFeedbackMsg(lang === "vi" ? "Chưa đúng! Đừng lo, câu hỏi tương tự sẽ xuất hiện lại sau 2 câu." : "Incorrect! Don't worry, a similar question will appear again in 2 questions.");
      
      const updatedQueue = [...grammarQueue];
      let retryQuestion: AdaptiveQuizQuestion;

      if (currentQuestion.variations && currentQuestion.variations.length > 0) {
        const variation = currentQuestion.variations[Math.floor(Math.random() * currentQuestion.variations.length)];
        retryQuestion = {
          ...currentQuestion,
          question: variation.question,
          options: variation.options,
          correctAnswer: variation.correctAnswer,
          explanation: variation.explanation,
          variations: []
        };
      } else {
        retryQuestion = { ...currentQuestion };
      }

      const insertIndex = Math.min(grammarCurrentIndex + 3, updatedQueue.length);
      updatedQueue.splice(insertIndex, 0, retryQuestion);
      setGrammarQueue(updatedQueue);
    }
  };

  const handleGrammarNext = () => {
    if (grammarCurrentIndex + 1 < grammarQueue.length) {
      setGrammarCurrentIndex(prev => prev + 1);
      setGrammarSelectedAns(null);
      setGrammarIsSubmitted(false);
      setGrammarFeedbackMsg("");
    } else {
      setShowGrammarVictory(true);
      updateProgress(activeChapterNum, activeDay, "grammarQuizDone", true);
      updateProgress(activeChapterNum, activeDay, "lessonDone", true);
    }
  };


  // --- DAY 7: CHAPTER PRACTICE QUIZ ---
  const [chapPracticeAnswers, setChapPracticeAnswers] = useState<Record<string, number>>({});
  const [chapPracticeSubmitted, setChapPracticeSubmitted] = useState<boolean>(false);
  const [chapPracticeScore, setChapPracticeScore] = useState<number>(0);

  const initChapterPracticeQuiz = () => {
    setChapPracticeAnswers({});
    setChapPracticeSubmitted(false);
    setChapPracticeScore(0);
  };

  const handleChapPracticeAnswer = (qId: string, optIdx: number) => {
    if (chapPracticeSubmitted) return;
    setChapPracticeAnswers(prev => ({ ...prev, [qId]: optIdx }));
  };

  const handleChapPracticeSubmit = () => {
    if (!activePractice) return;
    let score = 0;
    activePractice.quiz.forEach(q => {
      if (chapPracticeAnswers[q.id] === q.correctAnswer) {
        score++;
      }
    });
    setChapPracticeScore(score);
    setChapPracticeSubmitted(true);
    // Mark chapter day as fully completed!
    updateProgress(activeChapterNum, 7, "lessonDone", true);
  };


  // Simulated listening audio controls
  const [isListeningPlaying, setIsListeningPlaying] = useState<boolean>(false);
  const [listeningSpeed, setListeningSpeed] = useState<number>(1); // 0.8, 1, 1.2
  const [showListeningTranscript, setShowListeningTranscript] = useState<boolean>(false);
  const [listeningSelectedAns, setListeningSelectedAns] = useState<Record<string, number>>({});
  const [listeningSubmitted, setListeningSubmitted] = useState<Record<string, boolean>>({});

  // Reading Comprehension state
  const [readingSelectedAns, setReadingSelectedAns] = useState<Record<string, number>>({});
  const [readingSubmitted, setReadingSubmitted] = useState<Record<string, boolean>>({});

  // Streak simulation (daily study tracking)
  const [studyStreak, setStudyStreak] = useState<number>(5);
  useEffect(() => {
    // Add randomness or load
    const savedStreak = localStorage.getItem("study_streak");
    if (savedStreak) {
      setStudyStreak(parseInt(savedStreak));
    } else {
      localStorage.setItem("study_streak", "5");
    }
  }, []);

  const currentDayProgress = unlockedProgress[`${activeChapterNum}-${activeDay}`] || {};

  if (!isStudying) {
    return (
      <div className="w-full max-w-4xl mx-auto px-4 py-3 md:py-4 space-y-4">
        {/* Header of Lộ trình học */}
        <div className="bg-white/40 backdrop-blur-3xl rounded-2xl p-3.5 md:p-4 border border-pink-100/30 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
          <div className="flex flex-col items-start gap-2.5 w-full md:w-auto">
            <button
              onClick={onBackToLevels}
              className="text-xs font-sans font-bold text-[#8a5b61] bg-white/55 hover:bg-white/80 border border-pink-200/40 px-3.5 py-1.5 rounded-full transition-all cursor-pointer shadow-sm flex items-center gap-1 shrink-0"
            >
              ← <span>{lang === "vi" ? `Đổi cấp độ (${selectedLevel})` : `Change Level (${selectedLevel})`}</span>
            </button>
            <div className="space-y-0.5">
              <h2 className="font-sans font-black text-lg text-[#8a5b61] leading-tight">
                {lang === "vi" ? `Lộ trình học ${selectedLevel}` : `${selectedLevel} Study Curriculum`}
              </h2>
              <p className="text-[10px] md:text-[11px] text-gray-500 font-sans leading-normal">
                {lang === "vi" 
                  ? "12 Chương • 84 ngày học liên tục tự động mở khóa theo lộ trình" 
                  : "12 Chapters • 84 study days automatically unlocked consecutively"}
              </p>
            </div>
          </div>

          {/* Quick Stats in Header */}
          <div className="flex items-center gap-2 bg-white/50 px-3 py-1.5 rounded-xl border border-pink-100/30 shrink-0 self-start md:self-center">
            <Sparkles className="w-4 h-4 text-amber-500 fill-amber-400" />
            <div className="text-left">
              <span className="text-[9px] text-gray-400 font-semibold leading-none block">
                {lang === "vi" ? "ĐÃ HOÀN THÀNH" : "COMPLETED"}
              </span>
              <span className="text-xs font-sans font-bold text-[#8a5b61]">
                {getCompletedDaysCount()} / 84 {lang === "vi" ? "ngày" : "days"}
              </span>
            </div>
          </div>
        </div>

        {/* 12 Chapters Accordion List */}
        <div className="space-y-2">
          {Array.from({ length: 12 }).map((_, idx) => {
            const chNum = idx + 1;
            const isExpanded = expandedChapter === chNum;
            
            // Get chapter metadata safely
            let chTitle = lang === "vi" ? `Chương ${chNum}` : `Chapter ${chNum}`;
            try {
              const chData = getChapterData(selectedLevel, chNum);
              if (chData && chData.title) {
                chTitle = getLocalizedText(chData.title, lang);
              }
            } catch (e) {
              console.error(e);
            }

            // Count completed lessons in this chapter
            const completedCount = Array.from({ length: 7 }).filter((_, dIdx) => {
              const dNum = dIdx + 1;
              const progressId = `${chNum}-${dNum}`;
              const dayProgress = unlockedProgress[progressId];
              return dayProgress?.lessonDone || (dNum < 7 && dayProgress?.quizDone && dayProgress?.grammarQuizDone);
            }).length;

            return (
              <div 
                key={chNum}
                className="bg-white/40 backdrop-blur-2xl rounded-xl border border-pink-100/30 shadow-sm overflow-hidden transition-all duration-200"
              >
                {/* Chapter Header row (Click to expand) */}
                <button
                  onClick={() => setExpandedChapter(isExpanded ? null : chNum)}
                  className="w-full flex items-center justify-between py-2.5 px-3.5 text-left hover:bg-[#8a5b61]/5 active:bg-[#8a5b61]/10 transition-colors focus:outline-none cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 font-sans font-black text-xs ${
                      completedCount === 7 
                        ? "bg-emerald-500 text-white" 
                        : "bg-[#8a5b61]/10 text-[#8a5b61]"
                    }`}>
                      {chNum}
                    </div>
                    <div>
                      <h3 className="font-sans font-extrabold text-xs md:text-sm text-[#4a2e31] tracking-wide leading-snug">
                        {chTitle}
                      </h3>
                      <p className="text-[9px] text-gray-400 font-sans mt-0.5">
                        {lang === "vi" 
                          ? `Tiến độ: ${completedCount} / 7 bài hoàn thành` 
                          : `Progress: ${completedCount} / 7 lessons completed`}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {completedCount === 7 && (
                      <span className="text-[9px] bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-bold">
                        {lang === "vi" ? "Đã xong" : "Completed"}
                      </span>
                    )}
                    <ChevronDown className={`w-3.5 h-3.5 text-[#8a5b61] transition-transform duration-200 ${
                      isExpanded ? "rotate-180" : ""
                    }`} />
                  </div>
                </button>

                {/* Expanded Lesson list */}
                {isExpanded && (
                  <div className="border-t border-pink-100/25 bg-white/20 divide-y divide-[#8a5b61]/10">
                    {Array.from({ length: 7 }).map((_, dIdx) => {
                      const dayNum = dIdx + 1;
                      const progressId = `${chNum}-${dayNum}`;
                      const dayProgress = unlockedProgress[progressId];
                      const isCompleted = dayProgress?.lessonDone || (dayNum < 7 && dayProgress?.quizDone && dayProgress?.grammarQuizDone);
                      
                      const chData = getChapterData(selectedLevel, chNum);
                      const lesson = chData.lessons.find(l => l.day === dayNum);
                      
                      let lessonTitleText = "";
                      if (dayNum === 7) {
                        const practice = chData.practice;
                        if (practice && practice.title && !practice.title.includes("Nhấp để nhập tiêu đề")) {
                          lessonTitleText = getLocalizedText(practice.title, lang);
                        } else {
                          lessonTitleText = lang === "vi" ? `Bài 7: Ôn tập tổng hợp` : `Lesson 7: Comprehensive Review`;
                        }
                      } else if (lesson && lesson.title && !lesson.title.includes("Nhấp để nhập tiêu đề")) {
                        lessonTitleText = getLocalizedText(lesson.title, lang);
                      } else {
                        const mainLine = getLessonMainContentLine(chNum, dayNum);
                        const localizedMain = getLocalizedText(mainLine, lang);
                        lessonTitleText = lang === "vi" 
                          ? `Bài ${dayNum}: ${localizedMain || "Kiến thức trọng tâm"}` 
                          : `Lesson ${dayNum}: ${localizedMain || "Key Knowledge"}`;
                      }

                      return (
                        <div
                          key={dayNum}
                          onClick={() => {
                            setActiveChapterNum(chNum);
                            setActiveDay(dayNum);
                            setIsStudying(true);
                            if (chNum === 1 && dayNum === 1) {
                              setShowGoalModal(true);
                            }
                          }}
                          className="flex items-center justify-between py-2 px-3.5 hover:bg-[#8a5b61]/10 active:bg-[#8a5b61]/20 transition-all cursor-pointer group select-none"
                        >
                          <div className="flex items-center gap-3.5 flex-1 pr-4">
                            {/* Checkbox status circle */}
                            <div className="shrink-0">
                              {isCompleted ? (
                                <div className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-sm">
                                  <Check className="w-3.5 h-3.5 stroke-[3.5]" />
                                </div>
                              ) : (
                                <div className="w-5 h-5 rounded-full border border-[#8a5b61]/30 bg-white/60 group-hover:border-[#8a5b61]/80 transition-colors" />
                              )}
                            </div>
                            
                            {/* Single Line Title with combined grammar list */}
                            <div className="py-0.5">
                              <h4 className="font-sans font-bold text-xs text-[#8a5b61]/90 group-hover:text-[#8a5b61] transition-colors">
                                {lessonTitleText}
                              </h4>
                            </div>
                          </div>

                          <div className="shrink-0 flex items-center gap-1.5">
                            <span className="text-[9px] font-sans font-bold text-[#8a5b61] uppercase opacity-0 group-hover:opacity-100 transition-opacity">
                              {lang === "vi" ? "Vào học" : "Study"}
                            </span>
                            <ChevronRight className="w-3.5 h-3.5 text-[#8a5b61]/50 group-hover:translate-x-1 group-hover:text-[#8a5b61] transition-all" />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-2 md:py-3 overflow-visible">
      {/* CHAPTER & DAY SELECTION BOARD */}
      <div className="bg-white/40 backdrop-blur-3xl rounded-xl p-2.5 px-3 border border-[#8a5b61]/12 shadow-sm mb-3">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          
          {/* Left: back button */}
          <div className="w-full sm:w-28 flex justify-start shrink-0">
            <button
              onClick={() => setIsStudying(false)}
              className="text-xs font-sans font-extrabold text-[#8a5b61] hover:text-[#724a4f] transition-colors inline-flex items-center gap-1 cursor-pointer bg-white/50 hover:bg-white/80 px-2.5 py-1.5 rounded-lg border border-[#8a5b61]/10 shadow-xs"
            >
              ← <span>{t.back}</span>
            </button>
          </div>

          {/* Center: Cấp độ N5 • Chương 1 • Bài 1 */}
          <div className="text-center flex-grow">
            <div className="flex items-center justify-center gap-2">
              <span className="inline-block text-[11px] md:text-xs font-sans font-black text-[#8a5b61] tracking-wider uppercase bg-[#8a5b61]/8 px-3 py-1 rounded-lg border border-[#8a5b61]/12">
                {lang === "vi" ? "CẤP ĐỘ" : "LEVEL"} {selectedLevel} • {lang === "vi" ? "CHƯƠNG" : "CHAPTER"} {activeChapterNum} • {lang === "vi" ? "BÀI" : "LESSON"} {activeDay}
              </span>
              <button
                onClick={() => setShowGoalModal(true)}
                className="text-[10px] sm:text-[11px] font-bold text-[#8a5b61] bg-white/70 hover:bg-white border border-[#8a5b61]/20 px-2 py-0.5 rounded-lg shadow-2xs cursor-pointer transition-all active:scale-95"
                title="Mục tiêu bài học"
              >
                🎯 Mục tiêu
              </button>
            </div>
            <h3 className="text-xs sm:text-sm font-serif font-bold text-gray-800 mt-0.5 max-w-md mx-auto truncate">
              {activeDay === 7
                ? (activePractice?.title ? getLocalizedText(activePractice.title, lang) : (lang === "vi" ? "Bài 7: Ôn tập tổng hợp" : "Lesson 7: Comprehensive Review"))
                : (activeLesson?.title && !activeLesson.title.includes("Nhấp để nhập tiêu đề") 
                    ? getLocalizedText(activeLesson.title, lang) 
                    : (lang === "vi" ? `Bài ${activeDay}: Kiến thức trọng tâm` : `Lesson ${activeDay}: Core Knowledge`))}
            </h3>
          </div>

          {/* Right: Habit Streak Display */}
          <div className="w-full sm:w-auto flex justify-end shrink-0">
            <div className="flex items-center gap-3 bg-white/50 backdrop-blur-md rounded-xl px-2.5 py-1 border border-[#8a5b61]/10 shrink-0">
              <div className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-amber-400 animate-pulse" />
                <div>
                  <div className="text-[8px] text-gray-500 leading-none">{lang === "vi" ? "Chuỗi học tập" : "Study Streak"}</div>
                  <div className="text-xs font-sans font-extrabold text-amber-600">{studyStreak} {lang === "vi" ? "ngày liên tiếp" : "days streak"}</div>
                </div>
              </div>
              <div className="h-4 w-px bg-gray-200" />
              <div>
                <div className="text-[8px] text-gray-500 leading-none">{lang === "vi" ? "Hoàn thành" : "Completed"}</div>
                <div className="text-xs font-sans font-bold text-[#8a5b61]">
                  {getCompletedDaysCount()} / 84 {lang === "vi" ? "ngày" : "days"}
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* 7-DAY TIMELINE PROGRESS STRIP (WEEKLY PROGRAM) */}
        <div className="mt-2 border-t border-[#8a5b61]/8 pt-2">
          
          <div className="grid grid-cols-7 gap-1.5 sm:gap-2 text-center">
            {Array.from({ length: 7 }).map((_, idx) => {
              const dayNum = idx + 1;
              const isSelected = activeDay === dayNum;
              const isLast = dayNum === 7;
              
              const progressId = `${activeChapterNum}-${dayNum}`;
              const dayProgress = unlockedProgress[progressId];
              const isCompleted = dayProgress?.lessonDone || (dayNum < 7 && dayProgress?.quizDone && dayProgress?.grammarQuizDone);

              return (
                <button
                  key={dayNum}
                  onClick={() => {
                    setActiveDay(dayNum);
                  }}
                  className={`relative p-2 rounded-xl border transition-all flex flex-col items-center justify-center gap-1.5 min-h-[56px] group cursor-pointer ${
                    isSelected
                      ? "bg-gradient-to-b from-[#8a5b61] to-[#a3757c] text-white border-[#8a5b61] shadow-sm scale-102 z-10"
                      : "bg-white/50 hover:bg-white border-pink-100/30 hover:border-[#8a5b61]/40 hover:scale-101 text-gray-700"
                  }`}
                >
                  <span className={`text-[10px] font-sans font-bold uppercase tracking-wider ${isSelected ? "text-pink-100" : "text-[#8a5b61]"}`}>
                    {isLast ? t.review : `${t.day} ${dayNum}`}
                  </span>
                  
                  {/* Status Visuals (Only Check if completed, no book icon) */}
                  {isCompleted && (
                    <div className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 ${isSelected ? "bg-white text-[#8a5b61]" : "bg-[#8a5b61] text-white"}`}>
                      <Check className="w-2.5 h-2.5 stroke-[4]" />
                    </div>
                  )}

                  <span className="text-[10px] font-sans font-bold leading-none hidden sm:inline">
                    {isLast ? "Full Test" : `${t.lesson} ${dayNum}`}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* DETAILED CONTENT AREA */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start overflow-visible">
        
        {/* LEFT MENU (Regular Lesson Steps or Chapter Practice) */}
        <div className="lg:col-span-1 select-none">
          {activeDay < 7 ? (
            <>
              {/* MOBILE SELECT DROPDOWN */}
              <div className="lg:hidden w-full bg-white/40 backdrop-blur-md rounded-2xl p-3 border border-[#8a5b61]/15 shadow-sm flex flex-col gap-2 mb-4">
                <div className="flex items-center justify-between text-xs font-bold text-[#8a5b61] px-1">
                  <span className="flex items-center gap-1.5">
                    <BookOpenCheck className="w-4 h-4" />
                    {t.stepOfToday}
                  </span>
                  <span className="text-[10px] text-gray-400 font-mono">
                    {activeStep}/7
                  </span>
                </div>
                <div className="relative w-full">
                  <select
                    value={activeStep}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      setActiveStep(val);
                      if (val === 3) initPracticeQuiz();
                      if (val === 5) initGrammarQuiz();
                    }}
                    className="w-full bg-white border-2 border-[#8a5b61]/30 text-gray-800 font-bold px-3 py-2.5 pr-10 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#8a5b61]/20 focus:border-[#8a5b61] appearance-none cursor-pointer shadow-sm"
                  >
                    <option value={1}>{currentDayProgress.vocabDone ? "✔" : "🔓"} {t.stepVocab}</option>
                    <option value={2}>{currentDayProgress.kanjiDone ? "✔" : "🔓"} {t.stepKanji}</option>
                    <option value={3}>{currentDayProgress.quizDone ? "✔" : "🔓"} {t.stepQuiz}</option>
                    <option value={4} disabled={!isGrammarUnlocked(activeChapterNum, activeDay)}>
                      {currentDayProgress.grammarDone ? `✔ ${t.stepGrammar}` : isGrammarUnlocked(activeChapterNum, activeDay) ? `🔓 ${t.stepGrammar}` : `🔒 ${t.stepGrammar} (${lang === "vi" ? "Chưa mở khóa" : "Locked"})`}
                    </option>
                    <option value={5} disabled={!isGrammarQuizUnlocked(activeChapterNum, activeDay)}>
                      {currentDayProgress.grammarQuizDone ? `✔ ${t.stepGrammarQuiz}` : isGrammarQuizUnlocked(activeChapterNum, activeDay) ? `🔓 ${t.stepGrammarQuiz}` : `🔒 ${t.stepGrammarQuiz} (${lang === "vi" ? "Chưa mở khóa" : "Locked"})`}
                    </option>
                    <option value={6} disabled={!isReadingListeningUnlocked(activeChapterNum, activeDay)}>
                      {currentDayProgress.readingDone ? `✔ ${t.stepReading}` : isReadingListeningUnlocked(activeChapterNum, activeDay) ? `🔓 ${t.stepReading}` : `🔒 ${t.stepReading} (${lang === "vi" ? "Chưa mở khóa" : "Locked"})`}
                    </option>
                    <option value={7} disabled={!currentDayProgress.readingDone}>
                      {currentDayProgress.kaiwaDone ? `✔ ${t.stepKaiwa}` : currentDayProgress.readingDone ? `🔓 ${t.stepKaiwa}` : `🔒 ${t.stepKaiwa} (${lang === "vi" ? "Chưa mở khóa" : "Locked"})`}
                    </option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-[#8a5b61]">
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </div>
              </div>

              {/* DESKTOP SIDEBAR MENU */}
              <div className="hidden lg:flex lg:flex-col bg-white/20 backdrop-blur-2xl rounded-2xl p-2.5 border border-[#8a5b61]/10 shadow-md gap-1">
                <div className="text-[10px] uppercase font-bold tracking-widest text-[#8a5b61] mb-1.5 px-2.5">
                  {t.routeDay}
                </div>

                {/* Step 1: Vocab */}
                <button
                  onClick={() => setActiveStep(1)}
                  className={`w-full flex items-center justify-between gap-2 px-2.5 py-2 rounded-xl text-xs font-semibold transition-all shrink-0 cursor-pointer ${
                    activeStep === 1
                      ? "bg-[#8a5b61] text-white font-bold shadow-md shadow-[#8a5b61]/20"
                      : "hover:bg-[#8a5b61]/10 text-gray-700"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className={`font-black text-sm shrink-0 w-4 text-center ${activeStep === 1 ? "text-white" : "text-[#8a5b61]"}`}>あ</span>
                    <span>{t.stepVocab}</span>
                  </div>
                  {currentDayProgress.vocabDone ? (
                    <Check className={`w-3.5 h-3.5 ${activeStep === 1 ? "text-white" : "text-[#8a5b61]"}`} />
                  ) : (
                    <Unlock className={`w-3 h-3 ${activeStep === 1 ? "text-pink-100" : "text-[#8a5b61]/80"}`} />
                  )}
                </button>

                {/* Step 2: Kanji */}
                <button
                  onClick={() => setActiveStep(2)}
                  className={`w-full flex items-center justify-between gap-2 px-2.5 py-2 rounded-xl text-xs font-semibold transition-all shrink-0 cursor-pointer ${
                    activeStep === 2
                      ? "bg-[#8a5b61] text-white font-bold shadow-md shadow-[#8a5b61]/20"
                      : "hover:bg-[#8a5b61]/10 text-gray-700"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className={`font-black text-sm shrink-0 w-4 text-center ${activeStep === 2 ? "text-white" : "text-[#8a5b61]"}`}>字</span>
                    <span>{t.stepKanji}</span>
                  </div>
                  {currentDayProgress.kanjiDone ? (
                    <Check className={`w-3.5 h-3.5 ${activeStep === 2 ? "text-white" : "text-[#8a5b61]"}`} />
                  ) : (
                    <Unlock className={`w-3 h-3 ${activeStep === 2 ? "text-pink-100" : "text-[#8a5b61]/80"}`} />
                  )}
                </button>

                {/* Step 3: Combined Practice Quiz */}
                <button
                  onClick={() => {
                    setActiveStep(3);
                    initPracticeQuiz();
                  }}
                  className={`w-full flex items-center justify-between gap-2 px-2.5 py-2 rounded-xl text-xs font-semibold transition-all shrink-0 cursor-pointer ${
                    activeStep === 3
                      ? "bg-[#8a5b61] text-white font-bold shadow-md shadow-[#8a5b61]/20"
                      : "hover:bg-[#8a5b61]/10 text-gray-700"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${activeStep === 3 ? "border-white text-white" : "border-[#8a5b61] text-[#8a5b61]"} text-[10px] font-extrabold`}>✔</div>
                    <span>{t.stepQuiz}</span>
                  </div>
                  {currentDayProgress.quizDone ? (
                    <Check className={`w-3.5 h-3.5 ${activeStep === 3 ? "text-white" : "text-[#8a5b61]"}`} />
                  ) : (
                    <Unlock className={`w-3 h-3 ${activeStep === 3 ? "text-pink-100" : "text-[#8a5b61]/80"}`} />
                  )}
                </button>

                {/* Step 4: Grammar Explanation */}
                <button
                  onClick={() => {
                    if (isGrammarUnlocked(activeChapterNum, activeDay)) {
                      setActiveStep(4);
                    }
                  }}
                  disabled={!isGrammarUnlocked(activeChapterNum, activeDay)}
                  className={`w-full flex items-center justify-between gap-2 px-2.5 py-2 rounded-xl text-xs font-semibold transition-all shrink-0 disabled:opacity-50 ${
                    activeStep === 4
                      ? "bg-[#8a5b61] text-white font-bold shadow-md shadow-[#8a5b61]/20 cursor-pointer"
                      : isGrammarUnlocked(activeChapterNum, activeDay)
                        ? "hover:bg-[#8a5b61]/10 text-gray-700 cursor-pointer"
                        : "text-gray-400 cursor-not-allowed"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className={`font-black text-sm shrink-0 w-4 text-center ${activeStep === 4 ? "text-white" : "text-[#8a5b61]"}`}>文</span>
                    <span>{t.stepGrammar}</span>
                  </div>
                  {currentDayProgress.grammarDone ? (
                    <Check className={`w-3.5 h-3.5 ${activeStep === 4 ? "text-white" : "text-[#8a5b61]"}`} />
                  ) : isGrammarUnlocked(activeChapterNum, activeDay) ? (
                    <Unlock className={`w-3 h-3 ${activeStep === 4 ? "text-pink-100" : "text-[#8a5b61]/80"}`} />
                  ) : (
                    <Lock className="w-3 h-3 text-gray-400" />
                  )}
                </button>

                {/* Step 5: Grammar Quiz */}
                <button
                  onClick={() => {
                    if (isGrammarQuizUnlocked(activeChapterNum, activeDay)) {
                      setActiveStep(5);
                      initGrammarQuiz();
                    }
                  }}
                  disabled={!isGrammarQuizUnlocked(activeChapterNum, activeDay)}
                  className={`w-full flex items-center justify-between gap-2 px-2.5 py-2 rounded-xl text-xs font-semibold transition-all shrink-0 disabled:opacity-50 ${
                    activeStep === 5
                      ? "bg-[#8a5b61] text-white font-bold shadow-md shadow-[#8a5b61]/20 cursor-pointer"
                      : isGrammarQuizUnlocked(activeChapterNum, activeDay)
                        ? "hover:bg-[#8a5b61]/10 text-gray-700 cursor-pointer"
                        : "text-gray-400 cursor-not-allowed"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${activeStep === 5 ? "border-white text-white" : "border-[#8a5b61] text-[#8a5b61]"} text-[10px] font-extrabold`}>✔</div>
                    <span>{t.stepGrammarQuiz}</span>
                  </div>
                  {currentDayProgress.grammarQuizDone ? (
                    <Check className={`w-3.5 h-3.5 ${activeStep === 5 ? "text-white" : "text-[#8a5b61]"}`} />
                  ) : isGrammarQuizUnlocked(activeChapterNum, activeDay) ? (
                    <Unlock className={`w-3 h-3 ${activeStep === 5 ? "text-pink-100" : "text-[#8a5b61]/80"}`} />
                  ) : (
                    <Lock className="w-3 h-3 text-gray-400" />
                  )}
                </button>

                {/* Step 6: Reading & Listening */}
                <button
                  onClick={() => {
                    if (isReadingListeningUnlocked(activeChapterNum, activeDay)) {
                      setActiveStep(6);
                    }
                  }}
                  disabled={!isReadingListeningUnlocked(activeChapterNum, activeDay)}
                  className={`w-full flex items-center justify-between gap-2 px-2.5 py-2 rounded-xl text-xs font-semibold transition-all shrink-0 disabled:opacity-50 ${
                    activeStep === 6
                      ? "bg-[#8a5b61] text-white font-bold shadow-md shadow-[#8a5b61]/20 cursor-pointer"
                      : isReadingListeningUnlocked(activeChapterNum, activeDay)
                        ? "hover:bg-[#8a5b61]/10 text-gray-700 cursor-pointer"
                        : "text-gray-400 cursor-not-allowed"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className={`font-black text-sm shrink-0 w-4 text-center ${activeStep === 6 ? "text-white" : "text-[#8a5b61]"}`}>読</span>
                    <span>{t.stepReading}</span>
                  </div>
                  {currentDayProgress.readingDone ? (
                    <Check className={`w-3.5 h-3.5 ${activeStep === 6 ? "text-white" : "text-[#8a5b61]"}`} />
                  ) : isReadingListeningUnlocked(activeChapterNum, activeDay) ? (
                    <Unlock className={`w-3 h-3 ${activeStep === 6 ? "text-pink-100" : "text-[#8a5b61]/80"}`} />
                  ) : (
                    <Lock className="w-3 h-3 text-gray-400" />
                  )}
                </button>

                {/* Step 7: AI Kaiwa */}
                <button
                  onClick={() => {
                    if (currentDayProgress.readingDone) {
                      setActiveStep(7);
                    }
                  }}
                  disabled={!currentDayProgress.readingDone}
                  className={`w-full flex items-center justify-between gap-2 px-2.5 py-2 rounded-xl text-xs font-semibold transition-all shrink-0 disabled:opacity-50 ${
                    activeStep === 7
                      ? "bg-[#8a5b61] text-white font-bold shadow-md shadow-[#8a5b61]/20 cursor-pointer"
                      : currentDayProgress.readingDone
                        ? "hover:bg-[#8a5b61]/10 text-gray-700 cursor-pointer"
                        : "text-gray-400 cursor-not-allowed"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className={`w-4 h-4 shrink-0 ${activeStep === 7 ? "text-white" : "text-[#8a5b61]"}`}
                    >
                      <path d="M14 9a3 3 0 0 1-3 3H6l-3 3V6a3 3 0 0 1 3-3h5a3 3 0 0 1 3 3v3z" strokeLinejoin="round" />
                      <path d="M18 10h1a2 2 0 0 1 2 2v4l-2-2h-3a2 2 0 0 1-2-2v-1" strokeLinejoin="round" />
                    </svg>
                    <span>{t.stepKaiwa}</span>
                  </div>
                  {currentDayProgress.kaiwaDone ? (
                    <Check className={`w-3.5 h-3.5 ${activeStep === 7 ? "text-white" : "text-[#8a5b61]"}`} />
                  ) : currentDayProgress.readingDone ? (
                    <Unlock className={`w-3 h-3 ${activeStep === 7 ? "text-pink-100" : "text-[#8a5b61]/80"}`} />
                  ) : (
                    <Lock className="w-3 h-3 text-gray-400" />
                  )}
                </button>
              </div>
            </>
          ) : (
            <div className="w-full text-center py-2 lg:py-6 px-2 bg-white/20 backdrop-blur-2xl rounded-2xl border border-[#8a5b61]/10 shadow-md">
              <Award className="w-10 h-10 text-amber-500 mx-auto mb-2" />
              <div className="text-xs font-bold text-gray-700">{t.comprehensivePractice}</div>
              <div className="text-[10px] text-gray-400 mt-1">{t.completeFullTestOfChapter} {activeChapterNum}</div>
            </div>
          )}
        </div>

        {/* RIGHT DISPLAY PANEL */}
        <div className="lg:col-span-3">
          <AnimatePresence mode="wait">
            
            {/* REGULAR LESSONS DISPLAY COMPONENT */}
            {activeDay < 7 && activeLesson && (
              <motion.div
                key={`${activeChapterNum}-${activeDay}-${activeStep}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-4"
              >
                {/* Task completion instruction */}
                <div className="text-center mb-1">
                  <span className="inline-block text-[11px] font-black text-[#8a5b61] tracking-wider uppercase bg-white/60 backdrop-blur-md border border-[#8a5b61]/15 px-3.5 py-1 rounded-xl shadow-xs">
                    {t.completeTaskToUnlock}
                  </span>
                </div>
                
                {/* STEP 1: VOCABULARY */}
                {activeStep === 1 && (
                  <div className="space-y-4">
                    {activeLesson.vocabulary.length === 0 ? (
                      <div className="bg-white/40 backdrop-blur-xl rounded-2xl p-8 border border-[#8a5b61]/20 shadow-sm text-center">
                        <BookOpen className="w-12 h-12 text-[#8a5b61] mx-auto opacity-40 mb-3" />
                        <h4 className="text-sm font-serif font-black text-[#8a5b61]">Chưa có dữ liệu Từ vựng</h4>
                        <p className="text-xs text-gray-500 mt-2 max-w-md mx-auto leading-relaxed">
                          Bài học này hiện chưa được nhập dữ liệu từ vựng. Bạn có thể tự tay thêm dữ liệu từ vựng vào hằng số <code className="bg-gray-100 px-1 py-0.5 rounded font-mono font-bold text-pink-600">USER_CURRICULUM_DATA</code> trong file <code className="bg-gray-100 px-1 py-0.5 rounded font-mono font-bold">src/data/curriculumData.ts</code> bất cứ lúc nào!
                        </p>
                        <div className="flex justify-center mt-5">
                          <button
                            onClick={() => {
                              updateProgress(activeChapterNum, activeDay, "vocabDone", true);
                              setActiveStep(2);
                            }}
                            className="bg-[#8a5b61] hover:bg-[#724a4f] active:scale-95 text-white font-bold text-xs px-6 py-2.5 rounded-full shadow-sm transition-all cursor-pointer"
                          >
                            Tiếp tục qua bước tiếp theo →
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        {/* Category Filter Tabs (Phần 1: Chữ cái & Biến âm vs Phần 2: Từ vựng cơ bản) */}
                        {activeLesson.vocabulary.some(v => v.category === 'alphabet') && activeLesson.vocabulary.some(v => v.category === 'vocab') && (
                          <div className="space-y-2">
                            <div className="flex flex-wrap items-center justify-between gap-2 bg-white/60 backdrop-blur-md p-1.5 rounded-2xl border border-[#8a5b61]/15">
                              <div className="flex items-center gap-1.5">
                                <button
                                  onClick={() => {
                                    setVocabCategoryFilter('all');
                                    setSelectedKanaRow('all');
                                    setVocabIndex(0);
                                    setIsVocabFlipped(false);
                                    setVocabCardMode('card');
                                  }}
                                  className={`text-xs font-bold px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                                    vocabCategoryFilter === 'all' && selectedKanaRow === 'all'
                                      ? 'bg-[#8a5b61] text-white shadow-xs'
                                      : 'text-gray-600 hover:bg-[#8a5b61]/10'
                                  }`}
                                >
                                  Tất cả ({activeLesson.vocabulary.length})
                                </button>
                                <button
                                  onClick={() => {
                                    setVocabCategoryFilter('alphabet');
                                    setSelectedKanaRow('all');
                                    setVocabIndex(0);
                                    setIsVocabFlipped(false);
                                    setVocabCardMode('card');
                                  }}
                                  className={`text-xs font-bold px-3 py-1.5 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
                                    vocabCategoryFilter === 'alphabet' && selectedKanaRow === 'all'
                                      ? 'bg-[#8a5b61] text-white shadow-xs'
                                      : 'text-gray-600 hover:bg-[#8a5b61]/10'
                                  }`}
                                >
                                  <span>Chữ cái & Biến âm</span>
                                  <span className="text-[10px] bg-white/20 px-1.5 py-0.2 rounded-full">
                                    {activeLesson.vocabulary.filter(v => v.category === 'alphabet').length}
                                  </span>
                                </button>
                                <button
                                  onClick={() => {
                                    setVocabCategoryFilter('vocab');
                                    setSelectedKanaRow('all');
                                    setVocabIndex(0);
                                    setIsVocabFlipped(false);
                                    setVocabCardMode('card');
                                  }}
                                  className={`text-xs font-bold px-3 py-1.5 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
                                    vocabCategoryFilter === 'vocab' || selectedKanaRow === 'drill'
                                      ? 'bg-[#8a5b61] text-white shadow-xs'
                                      : 'text-gray-600 hover:bg-[#8a5b61]/10'
                                  }`}
                                >
                                  <span>Từ vựng ứng dụng</span>
                                  <span className="text-[10px] bg-white/20 px-1.5 py-0.2 rounded-full">
                                    {activeLesson.vocabulary.filter(v => v.category === 'vocab').length}
                                  </span>
                                </button>
                              </div>
                              <span className="text-[11px] text-gray-500 font-sans hidden sm:inline-block pr-2">
                                Phản xạ gốc → biến âm & Tập viết chữ
                              </span>
                            </div>

                            {/* Row Selector for Hiragana Lesson 1 */}
                            {activeChapterNum === 1 && activeDay === 1 && (
                              <div className="flex items-center gap-1.5 overflow-x-auto py-1 px-0.5 no-scrollbar">
                                <span className="text-[10px] font-bold text-gray-500 shrink-0 uppercase tracking-wider pl-1">Hàng:</span>
                                {[
                                  { id: 'all', label: 'Tất cả' },
                                  { id: 'a', label: 'Hàng あ (5)' },
                                  { id: 'ka', label: 'Hàng か (10)' },
                                  { id: 'sa', label: 'Hàng さ (10)' },
                                  { id: 'ta', label: 'Hàng た (10)' },
                                  { id: 'na', label: 'Hàng な (5)' },
                                  { id: 'drill', label: 'Luyện từ ghép (37)' },
                                ].map((r) => (
                                  <button
                                    key={r.id}
                                    onClick={() => {
                                      setSelectedKanaRow(r.id);
                                      setVocabIndex(0);
                                      setIsVocabFlipped(false);
                                      setVocabCardMode('card');
                                    }}
                                    className={`text-[11px] font-bold px-2.5 py-1 rounded-full whitespace-nowrap transition-all cursor-pointer ${
                                      selectedKanaRow === r.id
                                        ? 'bg-[#8a5b61] text-white shadow-2xs'
                                        : 'bg-white/80 text-gray-600 hover:bg-[#8a5b61]/10 border border-[#8a5b61]/15'
                                    }`}
                                  >
                                    {r.label}
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>
                        )}

                        {/* Flashcards & Writing Practice component */}
                        {(() => {
                          const safeIndex = Math.min(vocabIndex, Math.max(0, currentVocabularyList.length - 1));
                          const currentVocab = currentVocabularyList[safeIndex];
                          if (!currentVocab) return null;

                          const strokeInfo = KANA_STROKE_DATA[currentVocab.word];
                          const isAlphabetChar = currentVocab.category === 'alphabet';

                          // If in writing mode for alphabet character
                          if (vocabCardMode === 'write' && isAlphabetChar) {
                            return (
                              <div className="flex flex-col items-center">
                                <div className="w-full max-w-[280px] flex items-center justify-between mb-2">
                                  <button
                                    onClick={() => setVocabCardMode('card')}
                                    className="text-xs font-bold text-[#8a5b61] bg-white hover:bg-gray-50 border border-[#8a5b61]/20 px-3 py-1 rounded-full flex items-center gap-1 shadow-2xs cursor-pointer active:scale-95 transition-all"
                                  >
                                    ← <span>Xem thẻ</span>
                                  </button>
                                  <span className="text-xs font-bold text-gray-500 font-sans">
                                    {safeIndex + 1} / {currentVocabularyList.length}
                                  </span>
                                </div>
                                <KanaWritingCanvas
                                  char={currentVocab.word}
                                  romaji={currentVocab.romaji}
                                  onSpeak={(c) => speakWord(c)}
                                  onNext={() => {
                                    setVocabCardMode('card');
                                    setIsVocabFlipped(false);
                                    setVocabIndex((prev) => (prev + 1) % currentVocabularyList.length);
                                  }}
                                />
                              </div>
                            );
                          }

                          return (
                            <div className="flex flex-col items-center">
                              <div
                                className="w-full max-w-md h-[270px] cursor-pointer relative select-none"
                                style={{ perspective: "1000px" }}
                                onClick={() => setIsVocabFlipped(!isVocabFlipped)}
                              >
                                <motion.div
                                  className="w-full h-full relative duration-500 rounded-2xl shadow-md border border-[#8a5b61]/20"
                                  style={{
                                    transformStyle: "preserve-3d",
                                    transform: isVocabFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
                                  }}
                                >
                                  {/* Front Card */}
                                  <div
                                    className="absolute inset-0 w-full h-full bg-white/95 backdrop-blur-md rounded-2xl flex flex-col items-center justify-center p-4 sm:p-5 backface-hidden"
                                    style={{ backfaceVisibility: "hidden" }}
                                  >
                                    <div className="flex items-center justify-between w-full mb-2">
                                      <span className="text-[10px] bg-[#8a5b61]/10 text-[#8a5b61] px-3 py-0.5 rounded-full font-sans font-bold uppercase tracking-wider">
                                        {isAlphabetChar ? 'Chữ cái' : 'Từ vựng'} • {safeIndex + 1} / {currentVocabularyList.length}
                                      </span>

                                      {isAlphabetChar && (
                                        <button
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            setVocabCardMode('write');
                                          }}
                                          className="text-[11px] font-bold text-[#8a5b61] hover:bg-[#8a5b61]/10 border border-[#8a5b61]/20 px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow-2xs active:scale-95 transition-all cursor-pointer"
                                        >
                                          <PenTool className="w-3 h-3" />
                                          <span>Tập viết</span>
                                        </button>
                                      )}
                                    </div>

                                    <div className="flex items-center gap-3 my-1">
                                      <h3 className="text-5xl sm:text-6xl font-extrabold text-gray-900 font-jp tracking-tight">
                                        {currentVocab.word}
                                      </h3>
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          speakWord(currentVocab.word);
                                        }}
                                        className="w-10 h-10 rounded-full bg-[#8a5b61]/10 hover:bg-[#8a5b61]/20 flex items-center justify-center text-[#8a5b61] transition-transform active:scale-95 cursor-pointer shadow-2xs"
                                        title="Nghe phát âm chuẩn"
                                      >
                                        <Volume2 className="w-5 h-5" />
                                      </button>
                                    </div>

                                    {/* Romaji for early alphabet lessons */}
                                    {isEarlyAlphabetLesson && currentVocab.romaji && (
                                      <div className="inline-flex items-center gap-1 mt-1 px-3 py-0.5 bg-gray-100/90 rounded-full border border-gray-200">
                                        <span className="text-sm font-mono font-bold text-[#8a5b61] tracking-wider">
                                          {currentVocab.romaji}
                                        </span>
                                      </div>
                                    )}

                                    <p className="text-[10px] text-gray-400 mt-3">
                                      Chạm để lật thẻ xem Mẹo nhớ & Nét viết ↺
                                    </p>
                                  </div>

                                  {/* Back Card */}
                                  <div
                                    className="absolute inset-0 w-full h-full bg-[#fcf9fa] rounded-2xl flex flex-col items-center justify-center p-4 sm:p-5 backface-hidden overflow-y-auto"
                                    style={{
                                      backfaceVisibility: "hidden",
                                      transform: "rotateY(180deg)",
                                    }}
                                  >
                                    {/* Biến âm Formula (nếu là biến âm) */}
                                    {strokeInfo?.formula && (
                                      <div className="bg-amber-100/90 text-amber-950 font-bold px-3 py-1 rounded-xl text-xs sm:text-sm border border-amber-300/80 mb-2 tracking-wide font-mono">
                                        dấu " biến âm: {strokeInfo.formula}
                                      </div>
                                    )}

                                    {/* Mẹo nhớ mặt chữ và cách viết */}
                                    <div className="bg-amber-50/90 border border-amber-200/80 rounded-xl p-2.5 text-amber-950 text-xs text-left mb-2 w-full max-w-sm">
                                      <div className="font-bold text-[10px] text-amber-800 uppercase mb-0.5 flex items-center gap-1">
                                        <Sparkles className="w-3 h-3 text-amber-600" />
                                        Mẹo nhớ:
                                      </div>
                                      <div className="leading-snug text-gray-800 font-medium text-[11px] sm:text-xs">
                                        {strokeInfo?.mnemonic || currentVocab.note?.replace(/^Mẹo nhớ:\s*/, "")}
                                      </div>
                                    </div>

                                    {/* Thứ tự nét viết */}
                                    {strokeInfo && strokeInfo.steps && (
                                      <div className="w-full max-w-sm bg-white/90 rounded-xl p-2 border border-gray-200 text-left mb-2">
                                        <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1 flex items-center justify-between">
                                          <span>Cách viết ({strokeInfo.strokes} nét):</span>
                                        </div>
                                        <div className="space-y-0.5 text-[11px] text-gray-700">
                                          {strokeInfo.steps.map((step, sIdx) => (
                                            <div key={sIdx} className="flex items-start gap-1.5 leading-snug">
                                              <span className="w-3.5 h-3.5 rounded-full bg-[#8a5b61]/10 text-[#8a5b61] font-mono text-[9px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                                                {sIdx + 1}
                                              </span>
                                              <span>{step.replace(/^\d+\.\s*/, "")}</span>
                                            </div>
                                          ))}
                                        </div>
                                      </div>
                                    )}

                                    {/* Action button: Luyện viết ngay */}
                                    {isAlphabetChar ? (
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          setVocabCardMode('write');
                                        }}
                                        className="w-full max-w-sm py-1.5 px-3 bg-[#8a5b61] hover:bg-[#724a4f] text-white text-xs font-bold rounded-xl shadow-xs flex items-center justify-center gap-1.5 active:scale-95 transition-all cursor-pointer mt-1"
                                      >
                                        <PenTool className="w-3.5 h-3.5" />
                                        <span>✍️ Luyện viết chữ 「{currentVocab.word}」 ngay</span>
                                      </button>
                                    ) : (
                                      <div className="w-full text-center border-t border-[#8a5b61]/10 pt-1.5">
                                        <p className="text-xs sm:text-sm font-sans font-bold text-gray-800 leading-snug">
                                          {currentVocab.example}
                                        </p>
                                        <p className="text-[11px] text-[#8a5b61] font-semibold mt-0.5">
                                          {currentVocab.exampleMeaning}
                                        </p>
                                      </div>
                                    )}
                                  </div>
                                </motion.div>
                              </div>

                              {/* Flashcard Controls */}
                              <div className="flex items-center gap-3 mt-4">
                                <button
                                  onClick={() => {
                                    setIsVocabFlipped(false);
                                    setTimeout(() => {
                                      setVocabIndex((prev) => (prev - 1 + currentVocabularyList.length) % currentVocabularyList.length);
                                    }, 150);
                                  }}
                                  className="bg-white hover:bg-[#8a5b61]/10 text-gray-700 w-9 h-9 rounded-full border border-[#8a5b61]/20 flex items-center justify-center shadow-sm hover:scale-105 active:scale-95 transition-all cursor-pointer font-bold text-sm"
                                  title="Thẻ trước"
                                >
                                  ←
                                </button>
                                <span className="text-xs font-bold text-gray-600 font-sans">
                                  {safeIndex + 1} / {currentVocabularyList.length}
                                </span>
                                <button
                                  onClick={() => {
                                    setIsVocabFlipped(false);
                                    setTimeout(() => {
                                      setVocabIndex((prev) => (prev + 1) % currentVocabularyList.length);
                                    }, 150);
                                  }}
                                  className="bg-white hover:bg-[#8a5b61]/10 text-gray-700 w-9 h-9 rounded-full border border-[#8a5b61]/20 flex items-center justify-center shadow-sm hover:scale-105 active:scale-95 transition-all cursor-pointer font-bold text-sm"
                                  title="Thẻ kế tiếp"
                                >
                                  →
                                </button>

                                {isAlphabetChar && (
                                  <button
                                    onClick={() => setVocabCardMode('write')}
                                    className="bg-[#8a5b61] hover:bg-[#724a4f] text-white px-3.5 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-2xs active:scale-95 transition-all cursor-pointer ml-2"
                                  >
                                    <PenTool className="w-3.5 h-3.5" />
                                    <span>Tập viết chữ này</span>
                                  </button>
                                )}
                              </div>

                              {/* Word Drill section for selected row */}
                              {activeChapterNum === 1 && activeDay === 1 && selectedKanaRow !== 'all' && selectedKanaRow !== 'drill' && (() => {
                                const targetRow = HIRAGANA_LESSON_1.rows.find(r => r.row_id === selectedKanaRow);
                                if (!targetRow || targetRow.word_drill.length === 0) return null;
                                return (
                                  <div className="w-full max-w-md mt-4 bg-white/85 backdrop-blur-md rounded-2xl p-3.5 border border-[#8a5b61]/20 shadow-xs">
                                    <div className="flex items-center justify-between mb-2">
                                      <span className="text-xs font-bold text-[#8a5b61] flex items-center gap-1.5">
                                        <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                                        Luyện từ ghép ứng dụng {targetRow.row_label} ({targetRow.word_drill.length} từ)
                                      </span>
                                      <span className="text-[10px] text-gray-400">Chạm để nghe đọc</span>
                                    </div>
                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                                      {targetRow.word_drill.map((drill, dIdx) => (
                                        <button
                                          key={dIdx}
                                          onClick={() => speakWord(drill.word)}
                                          className="flex flex-col items-center justify-center p-2 rounded-xl bg-white hover:bg-[#8a5b61]/5 active:scale-95 border border-[#8a5b61]/10 transition-all cursor-pointer shadow-2xs text-center group"
                                        >
                                          <span className="font-jp font-extrabold text-sm text-gray-900 group-hover:text-[#8a5b61] transition-colors">{drill.word}</span>
                                          <span className="text-[10px] font-mono font-semibold text-gray-500">{drill.romaji}</span>
                                          <span className="text-[10px] font-medium text-gray-600 line-clamp-1">{drill.meaning}</span>
                                        </button>
                                      ))}
                                    </div>
                                  </div>
                                );
                              })()}
                            </div>
                          );
                        })()}

                        {/* Word List Table */}
                        <div className="bg-white/40 backdrop-blur-xl rounded-2xl p-4 md:p-5 border border-[#8a5b61]/20 shadow-sm">
                          <div className="flex items-center justify-between mb-4">
                            <h4 className="text-sm font-serif font-bold text-[#8a5b61] flex items-center gap-1.5">
                              <CheckCircle2 className="w-4.5 h-4.5 text-[#8a5b61]" />
                              Danh sách toàn bộ ký tự & từ vựng ({activeLesson.vocabulary.length} mục)
                            </h4>
                          </div>
                          <div className="overflow-x-auto">
                            <table className="w-full text-left text-xs border-collapse">
                              <thead>
                                <tr className="border-b border-[#8a5b61]/20 text-[#8a5b61] font-bold bg-[#8a5b61]/5">
                                  <th className="py-2.5 px-2">Ký tự / Từ</th>
                                  {isEarlyAlphabetLesson && <th className="py-2.5 px-2">Romaji</th>}
                                  <th className="py-2.5 px-2">Cách đọc</th>
                                  {vocabCategoryFilter !== 'alphabet' && <th className="py-2.5 px-2">Ý nghĩa</th>}
                                  <th className="py-2.5 px-2">Mẹo nhớ</th>
                                  {vocabCategoryFilter !== 'alphabet' && <th className="py-2.5 px-2">Ví dụ ứng dụng</th>}
                                </tr>
                              </thead>
                              <tbody>
                                {activeLesson.vocabulary
                                  .filter(v => vocabCategoryFilter === 'all' || v.category === vocabCategoryFilter)
                                  .map((vocab) => {
                                    const stroke = KANA_STROKE_DATA[vocab.word];
                                    return (
                                      <tr key={vocab.id} className="border-b border-gray-100 hover:bg-[#8a5b61]/5 transition-colors">
                                        <td className="py-2.5 px-2">
                                          <button
                                            onClick={() => speakWord(vocab.word)}
                                            className="font-jp font-extrabold text-gray-900 text-base hover:text-[#8a5b61] active:scale-95 transition-all cursor-pointer text-left group flex items-center gap-1.5"
                                            title="Bấm để nghe phát âm chuẩn"
                                          >
                                            <span className="border-b border-dashed border-gray-400 group-hover:border-[#8a5b61] transition-colors">{vocab.word}</span>
                                            <Volume2 className="w-3 h-3 text-[#8a5b61] opacity-60 group-hover:opacity-100" />
                                          </button>
                                        </td>
                                        {isEarlyAlphabetLesson && (
                                          <td className="py-2.5 px-2">
                                            <span className="font-mono font-bold text-gray-500 bg-gray-100/80 px-2 py-0.5 rounded text-[11px]">
                                              {vocab.romaji || "-"}
                                            </span>
                                          </td>
                                        )}
                                        <td className="py-2.5 px-2">
                                          <div className="text-[#8a5b61] font-jp font-bold text-xs">{vocab.furigana}</div>
                                        </td>
                                        {vocabCategoryFilter !== 'alphabet' && (
                                          <td className="py-2.5 px-2 font-semibold text-gray-700">
                                            {vocab.category === 'alphabet' ? "-" : vocab.meaning}
                                          </td>
                                        )}
                                        <td className="py-2.5 px-2 max-w-[240px] text-[11px] text-amber-900">
                                          <div className="bg-amber-50/80 border border-amber-200/60 rounded-md p-1.5 leading-snug">
                                            {stroke?.mnemonic || vocab.note || "-"}
                                          </div>
                                        </td>
                                        {vocabCategoryFilter !== 'alphabet' && (
                                          <td className="py-2.5 px-2 max-w-xs text-[11px]">
                                            {vocab.category === 'vocab' ? (
                                              <>
                                                <div className="font-jp font-medium text-gray-800 leading-snug text-xs sm:text-sm">{vocab.example}</div>
                                                <div className="text-[#8a5b61] font-semibold mt-0.5">{vocab.exampleMeaning}</div>
                                              </>
                                            ) : (
                                              <span className="text-gray-400">-</span>
                                            )}
                                          </td>
                                        )}
                                      </tr>
                                    );
                                  })}
                              </tbody>
                            </table>
                          </div>
                        </div>

                        {/* Interactive Phần 3: Ôn tập nhanh cuối bài (Dành riêng cho Bài 1) */}
                        {selectedLevel === "N5" && activeChapterNum === 1 && activeDay === 1 && (
                          <div className="bg-white/60 backdrop-blur-xl rounded-2xl p-5 border border-[#8a5b61]/25 shadow-sm space-y-5">
                            <div className="flex items-center justify-between border-b border-[#8a5b61]/15 pb-3">
                              <div>
                                <h4 className="text-base font-serif font-extrabold text-[#8a5b61] flex items-center gap-2">
                                  <Sparkles className="w-5 h-5 text-amber-500" />
                                  Phần 3: Ôn tập nhanh cuối bài (Phản xạ & Nhận diện lỗi)
                                </h4>
                                <p className="text-xs text-gray-500 mt-0.5">
                                  Luyện phản xạ tốc độ 3 giây, ghép cặp biến âm và phòng tránh các lỗi sai phát âm phổ biến
                                </p>
                              </div>
                              <span className="text-xs font-bold text-amber-700 bg-amber-100 px-3 py-1 rounded-full">
                                Phản xạ tự nhiên
                              </span>
                            </div>

                            {/* Mục A: Đọc nhanh phản xạ 3 giây */}
                            <div className="space-y-2">
                              <div className="flex items-center justify-between">
                                <span className="text-xs font-bold text-gray-800 flex items-center gap-1.5">
                                  <span className="w-5 h-5 rounded-full bg-[#8a5b61] text-white flex items-center justify-center text-[10px] font-mono">A</span>
                                  Đọc nhanh (Phản xạ 3 giây/chữ - Bấm để nghe âm chuẩn):
                                </span>
                                <span className="text-[11px] text-gray-400">Bấm từng chữ để nghe</span>
                              </div>
                              <div className="flex flex-wrap gap-2">
                                {["あ", "か", "さ", "た", "な", "が", "ざ", "だ", "ぞ", "ぢ"].map((char) => (
                                  <button
                                    key={char}
                                    onClick={() => speakWord(char)}
                                    className="w-11 h-11 rounded-xl bg-white border border-[#8a5b61]/20 hover:border-[#8a5b61] hover:bg-[#8a5b61]/10 text-gray-900 font-jp font-black text-xl flex items-center justify-center shadow-xs transition-all hover:scale-105 active:scale-95 cursor-pointer group"
                                    title={`Nghe chữ ${char}`}
                                  >
                                    <span className="group-hover:text-[#8a5b61]">{char}</span>
                                  </button>
                                ))}
                              </div>
                            </div>

                            {/* Mục B: Ghép cặp gốc - biến âm */}
                            <div className="space-y-2">
                              <span className="text-xs font-bold text-gray-800 flex items-center gap-1.5">
                                <span className="w-5 h-5 rounded-full bg-[#8a5b61] text-white flex items-center justify-center text-[10px] font-mono">B</span>
                                Ghép cặp gốc – biến âm (Bấm để lật xem đáp án):
                              </span>
                              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                                {[
                                  { root: "さ (SA)", daku: "ざ (ZA)", id: "pair-1" },
                                  { root: "た (TA)", daku: "だ (DA)", id: "pair-2" },
                                  { root: "く (KU)", daku: "ぐ (GU)", id: "pair-3" },
                                  { root: "せ (SE)", daku: "ぜ (ZE)", id: "pair-4" }
                                ].map((item) => {
                                  const isRevealed = revealedReviewItems[item.id];
                                  return (
                                    <button
                                      key={item.id}
                                      onClick={() => setRevealedReviewItems(prev => ({ ...prev, [item.id]: !prev[item.id] }))}
                                      className="p-3 bg-white rounded-xl border border-gray-200 hover:border-[#8a5b61] text-left transition-all shadow-xs cursor-pointer"
                                    >
                                      <div className="text-xs text-gray-500 font-bold">{item.root} ↔ ?</div>
                                      <div className="mt-1 font-jp font-black text-sm">
                                        {isRevealed ? (
                                          <span className="text-emerald-700 font-bold">➔ {item.daku}</span>
                                        ) : (
                                          <span className="text-gray-400 text-xs italic">Bấm để lật đáp án</span>
                                        )}
                                      </div>
                                    </button>
                                  );
                                })}
                              </div>
                            </div>

                            {/* Mục C: Đọc từ vựng to */}
                            <div className="space-y-2">
                              <span className="text-xs font-bold text-gray-800 flex items-center gap-1.5">
                                <span className="w-5 h-5 rounded-full bg-[#8a5b61] text-white flex items-center justify-center text-[10px] font-mono">C</span>
                                Đọc từ vựng to (Phát âm chuẩn kèm nghĩa):
                              </span>
                              <div className="flex flex-wrap gap-2">
                                {[
                                  { word: "いぬ", romaji: "inu", meaning: "con chó" },
                                  { word: "ねこ", romaji: "neko", meaning: "con mèo" },
                                  { word: "かさ", romaji: "kasa", meaning: "cái ô" },
                                  { word: "すし", romaji: "sushi", meaning: "món sushi" },
                                  { word: "たこ", romaji: "tako", meaning: "bạch tuộc" },
                                  { word: "さかな", romaji: "sakana", meaning: "con cá" }
                                ].map((vocab) => (
                                  <button
                                    key={vocab.word}
                                    onClick={() => speakWord(vocab.word)}
                                    className="px-3 py-1.5 rounded-xl bg-white border border-gray-200 hover:border-[#8a5b61] hover:bg-[#8a5b61]/5 flex items-center gap-2 shadow-2xs transition-all cursor-pointer group"
                                  >
                                    <span className="font-jp font-bold text-sm text-gray-900 group-hover:text-[#8a5b61]">{vocab.word}</span>
                                    <span className="text-[10px] font-mono text-gray-400">[{vocab.romaji}]</span>
                                    <span className="text-[11px] text-gray-600 font-medium">({vocab.meaning})</span>
                                    <Volume2 className="w-3 h-3 text-[#8a5b61] opacity-60" />
                                  </button>
                                ))}
                              </div>
                            </div>

                            {/* Mục D: Nhận diện lỗi sai */}
                            <div className="bg-rose-50/80 border border-rose-200/80 rounded-xl p-3.5 space-y-2">
                              <div className="flex items-center justify-between">
                                <span className="text-xs font-bold text-rose-950 flex items-center gap-1.5">
                                  <span className="w-5 h-5 rounded-full bg-rose-600 text-white flex items-center justify-center text-[10px] font-mono">D</span>
                                  Nhận diện lỗi sai: Chữ 「づ」 đọc là gì? (không phải "TSU"!)
                                </span>
                                <button
                                  onClick={() => setRevealedReviewItems(prev => ({ ...prev, "error-d": !prev["error-d"] }))}
                                  className="text-[11px] font-bold text-rose-700 hover:text-rose-900 underline cursor-pointer"
                                >
                                  {revealedReviewItems["error-d"] ? "Thu gọn giải thích" : "Xem quy tắc cốt lõi"}
                                </button>
                              </div>
                              {revealedReviewItems["error-d"] ? (
                                <div className="text-xs text-rose-900 leading-relaxed bg-white/80 p-2.5 rounded-lg border border-rose-200">
                                  <p className="font-bold text-rose-950">✅ Phát âm chuẩn: <strong>"ZU"</strong> (hoặc DZU - gần như đồng âm với ず).</p>
                                  <p className="mt-1 text-gray-700">Tuyệt đối <strong>KHÔNG</strong> đọc là "TSU". Ví dụ: trong từ <em>つづく (tsuzuku - tiếp tục)</em>, chữ đầu là TSU nhưng chữ sau có dấu ゛ biến âm thành ZU.</p>
                                </div>
                              ) : (
                                <p className="text-[11px] text-rose-800 italic">
                                  Bấm vào "Xem quy tắc cốt lõi" để ghi nhớ quy tắc phát âm ngoại lệ của chữ づ.
                                </p>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Navigation button to go to step 2 (Kanji) */}
                        <div className="flex justify-end mt-4">
                          <button
                            onClick={() => {
                              updateProgress(activeChapterNum, activeDay, "vocabDone", true);
                              setActiveStep(2);
                            }}
                            className="bg-[#8a5b61] hover:bg-[#724a4f] active:scale-95 text-white font-bold text-xs px-6 py-3 rounded-full shadow-sm transition-all cursor-pointer flex items-center gap-1.5"
                          >
                            Tiếp theo: Học Chữ Hán →
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                )}

                {/* STEP 2: KANJI */}
                {activeStep === 2 && (
                  <div className="space-y-4">
                    {/* Kanji Section */}
                    {activeLesson.kanji.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {activeLesson.kanji.map((item) => {
                          const kanjiDetail = KANJI_DEFS[item.kanji];
                          const sino = kanjiDetail?.sino || SINO_VIETNAMESE_MAP[item.kanji] || "HÁN";
                          const meaning = kanjiDetail?.meaning || item.meaning.replace("Đại diện cho từ ", "");
                          return (
                            <div
                              key={item.id}
                              className="bg-white/40 backdrop-blur-xl rounded-2xl p-4 border border-[#8a5b61]/20 shadow-sm"
                            >
                              <div className="flex flex-col sm:flex-row gap-4 items-center sm:items-start">
                                {/* Kanji Stroke Tracing & Guide overlay */}
                                <KanjiStrokeGuide kanji={item.kanji} />
                                
                                <div className="w-full flex-1 space-y-1">
                                  <h4 className="text-sm font-serif font-black text-[#8a5b61]">
                                    {sino} - {meaning}
                                  </h4>
                                  <p className="text-[10px] text-gray-400">Số nét vẽ: {kanjiDetail?.strokes || item.strokes} nét</p>
                                </div>
                              </div>
                              
                              <div className="grid grid-cols-2 gap-2 bg-[#8a5b61]/5 rounded-xl p-2.5 mt-3 text-[11px] border border-[#8a5b61]/10">
                                <div>
                                  <span className="text-[9px] text-[#8a5b61] font-bold block mb-0.5">Onyomi (Âm Hán):</span>
                                  <span className="font-bold text-gray-800">{kanjiDetail?.onyomi || item.onyomi}</span>
                                </div>
                                <div>
                                  <span className="text-[9px] text-[#8a5b61] font-bold block mb-0.5">Kunyomi (Âm Thuần):</span>
                                  <span className="font-bold text-gray-800">{kanjiDetail?.kunyomi || item.kunyomi}</span>
                                </div>
                              </div>
                              
                              {item.examples && item.examples.length > 0 && (
                                <div className="mt-3 pt-2.5 border-t border-gray-100/60">
                                  <p className="text-[10px] text-[#8a5b61] font-extrabold uppercase mb-2 tracking-wider">Từ ghép thực tế (4 cột):</p>
                                  <div className="overflow-x-auto">
                                    <table className="w-full text-left text-[11px] border-collapse">
                                      <thead>
                                        <tr className="border-b border-[#8a5b61]/15 text-[#8a5b61] font-black">
                                          <th className="py-1 px-1 font-bold">Từ ghép</th>
                                          <th className="py-1 px-1 font-bold">Âm Hán</th>
                                          <th className="py-1 px-1 font-bold">Cách đọc</th>
                                          <th className="py-1 px-1 font-bold">Nghĩa</th>
                                        </tr>
                                      </thead>
                                      <tbody className="divide-y divide-[#8a5b61]/5">
                                        {item.examples.map((ex, idx) => {
                                          const chars = ex.word.split("");
                                          const wordSino = chars
                                            .map((char) => SINO_VIETNAMESE_MAP[char] || "")
                                            .filter(Boolean)
                                            .join(" ");
                                          return (
                                            <tr key={idx} className="hover:bg-[#8a5b61]/5 transition-colors">
                                              <td className="py-1.5 px-1 font-jp font-bold text-[#8a5b61] text-xs sm:text-sm">{ex.word}</td>
                                              <td className="py-1.5 px-1 font-mono text-[10px] text-gray-500 font-bold uppercase">{wordSino || sino}</td>
                                              <td className="py-1.5 px-1 font-jp text-gray-600 font-medium text-xs sm:text-sm">{ex.reading}</td>
                                              <td className="py-1.5 px-1 text-gray-700 font-semibold">{ex.meaning}</td>
                                            </tr>
                                          );
                                        })}
                                      </tbody>
                                    </table>
                                  </div>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="bg-white/40 backdrop-blur-xl rounded-2xl p-8 text-center border border-[#8a5b61]/20 shadow-sm">
                        <p className="text-xs text-gray-500 font-sans">Bài học hôm nay không có Chữ Hán mới. Hãy tiếp tục sang phần Trắc nghiệm!</p>
                      </div>
                    )}

                    {/* Navigation button to go to next step (Practice Quiz) */}
                    <div className="flex justify-end mt-4">
                      <button
                        onClick={() => {
                          updateProgress(activeChapterNum, activeDay, "kanjiDone", true);
                          setActiveStep(3);
                          initPracticeQuiz();
                        }}
                        className="bg-[#8a5b61] hover:bg-[#724a4f] active:scale-95 text-white font-bold text-xs px-6 py-3 rounded-full shadow-sm transition-all cursor-pointer flex items-center gap-1.5"
                      >
                        Tiếp theo: Luyện tập trắc nghiệm →
                      </button>
                    </div>
                  </div>
                )}

                {/* STEP 3: PRACTICE QUIZ (WITH ADAPTIVE RETRY ENGINE) */}
                {activeStep === 3 && (
                  <div className="space-y-4">
                    <div className="bg-white/40 backdrop-blur-xl rounded-2xl p-4 border border-[#8a5b61]/20 shadow-sm">
                      {practiceQueue.length === 0 ? (
                        <div className="text-center py-8 space-y-4">
                          <HelpCircle className="w-12 h-12 text-[#8a5b61] mx-auto opacity-40" />
                          <h4 className="text-sm font-serif font-black text-[#8a5b61]">Chưa có câu hỏi Trắc nghiệm</h4>
                          <p className="text-xs text-gray-500 max-w-sm mx-auto leading-relaxed">
                            Mục này chưa được nhập câu hỏi luyện tập trắc nghiệm. Bạn hãy nhập các câu hỏi trắc nghiệm vào hằng số <code className="bg-gray-100 px-1 py-0.5 rounded font-mono font-bold text-pink-600">USER_CURRICULUM_DATA</code> trong file <code className="bg-gray-100 px-1 py-0.5 rounded font-mono font-bold">src/data/curriculumData.ts</code> nhé!
                          </p>
                          <button
                            onClick={() => {
                              updateProgress(activeChapterNum, activeDay, "quizDone", true);
                              setActiveStep(4);
                            }}
                            className="bg-[#8a5b61] hover:bg-[#724a4f] text-white font-bold text-xs px-6 py-2.5 rounded-full shadow-md transition-all cursor-pointer"
                          >
                            Tiếp tục qua học Ngữ pháp →
                          </button>
                        </div>
                      ) : (
                        <>
                          <div className="flex items-center justify-between border-b border-[#8a5b61]/20 pb-3 mb-4">
                            <div className="flex items-center gap-2">
                              <RefreshCw className="w-5 h-5 text-[#8a5b61] animate-spin-slow" />
                            </div>
                            <div className="text-xs font-sans font-bold text-gray-500">
                              {practiceCurrentIndex + 1} / {practiceQueue.length} câu
                            </div>
                          </div>

                          {!showPracticeVictory ? (
                            <div>
                              {/* Progress bar showing original and remaining */}
                              <div className="w-full bg-[#8a5b61]/10 h-2.5 rounded-full overflow-hidden mb-5">
                                <div 
                                  className="bg-[#8a5b61] h-full transition-all duration-300"
                                  style={{ width: `${((practiceCurrentIndex) / practiceQueue.length) * 100}%` }}
                                />
                              </div>

                              <div className="flex items-start gap-3 bg-[#8a5b61]/5 p-3.5 rounded-2xl border border-[#8a5b61]/10 mb-5">
                                <span className="bg-[#8a5b61] text-white font-bold text-xs px-2.5 py-1 rounded-full shrink-0">
                                  CHỦ ĐỀ
                                </span>
                                <span className="text-xs font-bold text-[#8a5b61] uppercase tracking-wider mt-0.5">
                                  {practiceQueue[practiceCurrentIndex]?.categoryLabel}
                                </span>
                              </div>

                              <h3 className="text-lg font-sans font-bold text-gray-800 mb-6 leading-relaxed">
                                {practiceQueue[practiceCurrentIndex]?.question}
                              </h3>

                              {/* Options stack */}
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                                {practiceQueue[practiceCurrentIndex]?.options.map((opt, oIdx) => {
                                  const isThisSelected = practiceSelectedAns === oIdx;
                                  let style = "border-gray-200 bg-white/70 hover:bg-[#8a5b61]/5 text-gray-700";
                                  
                                  if (practiceIsSubmitted) {
                                    if (oIdx === practiceQueue[practiceCurrentIndex].correctAnswer) {
                                      style = "border-emerald-500 bg-emerald-50 text-emerald-800 font-bold ring-2 ring-emerald-200";
                                    } else if (isThisSelected) {
                                      style = "border-rose-400 bg-rose-50 text-rose-800 font-bold ring-2 ring-rose-200";
                                    } else {
                                      style = "border-gray-100 bg-gray-50/50 text-gray-400";
                                    }
                                  } else if (isThisSelected) {
                                    style = "border-[#8a5b61] bg-[#8a5b61]/10 text-[#8a5b61] font-bold ring-2 ring-[#8a5b61]/20";
                                  }

                                  return (
                                    <button
                                      key={oIdx}
                                      onClick={() => handlePracticeAnswerClick(oIdx)}
                                      disabled={practiceIsSubmitted}
                                      className={`p-4 text-left rounded-2xl border text-xs sm:text-sm transition-all cursor-pointer ${style}`}
                                    >
                                      {opt}
                                    </button>
                                  );
                                })}
                              </div>

                              {/* Submission & Feedback panel */}
                              {practiceIsSubmitted && (
                                <div className="bg-[#8a5b61]/5 border border-[#8a5b61]/10 rounded-2xl p-4 mb-6">
                                  <p className={`text-xs font-bold ${practiceSelectedAns === practiceQueue[practiceCurrentIndex].correctAnswer ? "text-emerald-700" : "text-rose-700"} mb-1`}>
                                    {practiceFeedbackMsg}
                                  </p>
                                  <div className="flex gap-1.5 mt-2">
                                    <Info className="w-4 h-4 text-[#8a5b61] shrink-0 mt-0.5" />
                                    <p className="text-[11px] text-[#8a5b61] leading-relaxed">
                                      <span className="font-bold">Giải thích: </span>{practiceQueue[practiceCurrentIndex]?.explanation}
                                    </p>
                                  </div>
                                </div>
                              )}

                              <div className="flex justify-end gap-3">
                                {!practiceIsSubmitted ? (
                                  <button
                                    onClick={handlePracticeSubmit}
                                    disabled={practiceSelectedAns === null}
                                    className="bg-[#8a5b61] hover:bg-[#724a4f] active:scale-95 text-white font-bold text-xs px-6 py-3 rounded-full shadow-md transition-all disabled:opacity-50 cursor-pointer"
                                  >
                                    Nộp câu trả lời
                                  </button>
                                ) : (
                                  <button
                                    onClick={handlePracticeNext}
                                    className="bg-[#8a5b61] hover:bg-[#724a4f] active:scale-95 text-white font-bold text-xs px-6 py-3 rounded-full shadow-md transition-all cursor-pointer"
                                  >
                                    {practiceCurrentIndex + 1 < practiceQueue.length ? "Câu tiếp theo" : "Hoàn thành bước này"}
                                  </button>
                                )}
                              </div>
                            </div>
                          ) : (
                            <div className="text-center py-8 space-y-4">
                              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto shadow-inner text-emerald-600">
                                <Check className="w-8 h-8 stroke-[3]" />
                              </div>
                              <h3 className="text-xl font-serif font-extrabold text-[#8a5b61]">Mở khóa thành công!</h3>
                              <p className="text-xs text-gray-600 max-w-sm mx-auto leading-relaxed">
                                Bạn đã hoàn thành chính xác 100% tất cả các câu hỏi trắc nghiệm! Mục giải thích Ngữ pháp chi tiết hiện đã sẵn sàng mở khóa cho bạn học tập.
                              </p>
                              <button
                                onClick={() => {
                                  setActiveStep(4);
                                }}
                                className="bg-[#8a5b61] hover:bg-[#724a4f] text-white font-bold text-xs px-6 py-3 rounded-full shadow-md transition-all cursor-pointer"
                              >
                                Học Ngữ pháp mới ngay →
                              </button>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                )}

                {/* STEP 4: GRAMMAR EXPLANATIONS */}
                {activeStep === 4 && (
                  <div className="space-y-2.5">
                    {activeLesson.grammar.length === 0 ? (
                      <div className="bg-white/40 backdrop-blur-xl rounded-2xl p-8 border border-[#8a5b61]/20 shadow-sm text-center">
                        <BookOpen className="w-12 h-12 text-[#8a5b61] mx-auto opacity-40 mb-3" />
                        <h4 className="text-sm font-serif font-black text-[#8a5b61]">Chưa có dữ liệu Ngữ pháp</h4>
                        <p className="text-xs text-gray-500 mt-2 max-w-md mx-auto leading-relaxed">
                          Bài học này hiện chưa có mẫu ngữ pháp nào được thêm. Bạn hãy nhập dữ liệu ngữ pháp vào hằng số <code className="bg-gray-100 px-1 py-0.5 rounded font-mono font-bold text-pink-600">USER_CURRICULUM_DATA</code> trong file <code className="bg-gray-100 px-1 py-0.5 rounded font-mono font-bold">src/data/curriculumData.ts</code> nhé!
                        </p>
                      </div>
                    ) : (
                      <>
                        {activeLesson.grammar.map((gram) => (
                          <div key={gram.id} className="bg-white/40 backdrop-blur-xl rounded-xl p-3 border border-[#8a5b61]/15 shadow-xs space-y-2">
                            <div className="border-b border-gray-100/50 pb-2">
                              <div className="flex flex-wrap items-center gap-2">
                                {/* Cấu trúc + Công thức cấu thành trong cùng một ô */}
                                <div className="bg-[#8a5b61]/10 text-[#8a5b61] px-3 py-1.5 rounded-lg border border-[#8a5b61]/20 shadow-xs flex flex-col items-start">
                                  <span className="text-xs sm:text-sm font-extrabold font-sans">
                                    Cấu trúc: {renderMixedText(gram.pattern)}
                                  </span>
                                  {gram.formula && formatFormulaInline(gram.formula) && (
                                    <span className="text-[10px] sm:text-[11px] text-[#8a5b61]/85 italic font-medium mt-0.5 font-sans">
                                      ({renderMixedText(formatFormulaInline(gram.formula))})
                                    </span>
                                  )}
                                </div>

                                {/* Ý nghĩa sát bên cạnh ô cấu trúc, to và đậm. Không có chữ "Ý nghĩa:" nữa */}
                                <div className="text-xs sm:text-sm font-extrabold py-0.5 px-1">
                                  <span className="text-[#8a5b61] font-black text-sm sm:text-base">{gram.meaning}</span>
                                </div>
                              </div>
                            </div>

                            <div>
                              <p className="text-[9px] text-[#8a5b61] font-bold uppercase mb-0.5">Giải thích chi tiết:</p>
                              {renderExplanation(gram.explanation)}
                            </div>

                            {gram.examples && gram.examples.length > 0 && (
                              <div>
                                <p className="text-[9px] text-gray-400 font-bold uppercase mb-1">Ví dụ mẫu:</p>
                                <div className="space-y-1.5">
                                  {gram.examples.map((ex, idx) => (
                                    <div key={idx} className="bg-white/50 p-2 rounded-lg border border-gray-100 text-xs">
                                      <p className="font-jp font-bold text-gray-900 mb-0.5 text-xs sm:text-sm">{ex.japanese}</p>
                                      <p className="text-[#8a5b61] font-medium text-xs">{ex.vietnamese}</p>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        ))}

                        {/* INTERACTIVE SENTENCE WRITING WITH AI CHECK */}
                        {activeLesson.writingPractice && activeLesson.writingPractice.length > 0 && (
                          <div className="bg-white/50 backdrop-blur-xl rounded-xl p-3 border border-[#8a5b61]/15 shadow-xs space-y-2.5">
                            <div className="flex items-center gap-1.5 border-b border-[#8a5b61]/15 pb-1.5">
                              <Sparkles className="w-4 h-4 text-[#8a5b61]" />
                              <h4 className="font-serif font-extrabold text-[#8a5b61] text-xs sm:text-sm">
                                Đặt câu
                              </h4>
                            </div>

                            <div className="space-y-2.5 pt-0.5">
                              {activeLesson.writingPractice.map((wp, wIdx) => {
                                const userAns = writingAnswers[wp.id] || "";
                                const feedback = writingFeedbacks[wp.id] || "";
                                const loading = writingLoading[wp.id] || false;

                                return (
                                  <div key={wp.id} className="bg-white/80 p-3 rounded-lg border border-[#8a5b61]/10 space-y-2">
                                    <div className="flex items-center gap-2">
                                      <span className="w-5 h-5 rounded-full bg-[#8a5b61]/10 text-[#8a5b61] flex items-center justify-center font-bold text-xs shrink-0 font-sans">
                                        {wIdx + 1}
                                      </span>
                                      <p className="text-xs sm:text-sm font-bold text-gray-800 font-sans leading-snug">{wp.prompt}</p>
                                    </div>

                                    <div className="space-y-1.5 pl-7">
                                      <textarea
                                        value={userAns}
                                        onChange={(e) => setWritingAnswers(prev => ({ ...prev, [wp.id]: e.target.value }))}
                                        placeholder="Nhập câu tiếng Nhật của em tại đây (gõ chữ Nhật: Hiragana, Kanji...)..."
                                        className="w-full text-xs border border-[#8a5b61]/25 rounded-lg p-2 focus:outline-none focus:ring-1 focus:ring-[#8a5b61]/50 focus:border-transparent placeholder-gray-400 font-jp bg-white min-h-[55px]"
                                        disabled={loading}
                                      />

                                      <div className="flex items-center justify-end">
                                        <button
                                          onClick={() => checkWritingSentence(wp.id, wp.prompt, userAns)}
                                          disabled={!userAns.trim() || loading}
                                          className="bg-[#8a5b61] hover:bg-[#724a4f] active:scale-95 text-white font-bold text-[11px] px-4 py-1.5 rounded-lg shadow-xs transition-all cursor-pointer flex items-center gap-1 disabled:opacity-50"
                                        >
                                          {loading ? (
                                            <>
                                              <span className="w-1.5 h-1.5 bg-white rounded-full animate-ping"></span>
                                              <span>Đang kiểm tra...</span>
                                            </>
                                          ) : (
                                            <>
                                              <Sparkles className="w-3 h-3" />
                                              <span>Check</span>
                                            </>
                                          )}
                                        </button>
                                      </div>

                                      {feedback && (
                                        <div className="mt-2 bg-[#8a5b61]/5 p-2.5 rounded-lg border border-[#8a5b61]/15 text-xs text-gray-700 leading-snug font-sans space-y-1 relative overflow-hidden">
                                          <div className="absolute top-0 right-0 p-1">
                                            <Sparkles className="w-3.5 h-3.5 text-[#8a5b61]/20 opacity-60 animate-pulse" />
                                          </div>
                                          <p className="font-bold text-[#8a5b61] flex items-center gap-1">
                                            <span>Lời phê của Emichan-sensei:</span>
                                          </p>
                                          <div className="whitespace-pre-line text-gray-700 leading-snug text-xs pl-1 font-jp">{feedback}</div>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </>
                    )}

                    <div className="flex justify-end">
                      <button
                        onClick={() => {
                          updateProgress(activeChapterNum, activeDay, "grammarDone", true);
                          setActiveStep(5);
                          initGrammarQuiz();
                        }}
                        className="bg-[#8a5b61] hover:bg-[#724a4f] active:scale-95 text-white font-bold text-xs px-6 py-3 rounded-full shadow-sm transition-all cursor-pointer flex items-center gap-1.5"
                      >
                        Tiếp theo: Luyện tập ngữ pháp →
                      </button>
                    </div>
                  </div>
                )}

                {/* STEP 5: GRAMMAR PRACTICE (ADAPTIVE RETRY ENGINE) */}
                {activeStep === 5 && (
                  <div className="space-y-6">
                    <div className="bg-white/40 backdrop-blur-xl rounded-3xl p-5 border border-[#8a5b61]/20 shadow-sm">
                      {grammarQueue.length === 0 ? (
                        <div className="text-center py-8 space-y-4">
                          <HelpCircle className="w-12 h-12 text-[#8a5b61] mx-auto opacity-40" />
                          <h4 className="text-sm font-serif font-black text-[#8a5b61]">Chưa có đề luyện tập Ngữ pháp</h4>
                          <p className="text-xs text-gray-500 max-w-sm mx-auto leading-relaxed">
                            Mục này hiện chưa có câu hỏi luyện tập ngữ pháp. Bạn hãy nhập câu hỏi vào <code className="bg-gray-100 px-1 py-0.5 rounded font-mono font-bold text-pink-600">grammarQuiz</code> trong file <code className="bg-gray-100 px-1 py-0.5 rounded font-mono font-bold">src/data/curriculumData.ts</code> để làm bài tập trắc nghiệm ngữ pháp nhé!
                          </p>
                          <button
                            onClick={() => {
                              updateProgress(activeChapterNum, activeDay, "grammarQuizDone", true);
                              setActiveStep(6);
                            }}
                            className="bg-[#8a5b61] hover:bg-[#724a4f] text-white font-bold text-xs px-6 py-2.5 rounded-full shadow-md transition-all cursor-pointer"
                          >
                            Tiếp tục qua Đọc hiểu & Nghe hiểu →
                          </button>
                        </div>
                      ) : (
                        <>
                          <div className="flex items-center justify-between border-b border-[#8a5b61]/20 pb-3 mb-4">
                            <div className="flex items-center gap-2">
                              <Gamepad2 className="w-5 h-5 text-[#8a5b61] animate-pulse" />
                            </div>
                            <div className="text-xs font-sans font-bold text-gray-500">
                              {grammarCurrentIndex + 1} / {grammarQueue.length} câu
                            </div>
                          </div>

                          {!showGrammarVictory ? (
                            <div>
                              <div className="w-full bg-[#8a5b61]/10 h-2.5 rounded-full overflow-hidden mb-5">
                                <div 
                                  className="bg-[#8a5b61] h-full transition-all duration-300"
                                  style={{ width: `${((grammarCurrentIndex) / grammarQueue.length) * 100}%` }}
                                />
                              </div>

                              <div className="flex items-start gap-3 bg-[#8a5b61]/5 p-3.5 rounded-2xl border border-[#8a5b61]/10 mb-5">
                                <span className="bg-[#8a5b61] text-white font-bold text-xs px-2.5 py-1 rounded-full shrink-0">
                                  Câu {grammarCurrentIndex + 1}
                                </span>
                                <span className="text-xs font-bold text-[#8a5b61] uppercase tracking-wider mt-0.5">
                                  Chọn đáp án phù hợp
                                </span>
                              </div>

                              <h3 className="text-lg font-sans font-bold text-gray-800 mb-6 leading-relaxed">
                                {grammarQueue[grammarCurrentIndex]?.question}
                              </h3>

                              {/* Options */}
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                                {grammarQueue[grammarCurrentIndex]?.options.map((opt, oIdx) => {
                                  const isThisSelected = grammarSelectedAns === oIdx;
                                  let style = "border-gray-200 bg-white/70 hover:bg-[#8a5b61]/5 text-gray-700";
                                  
                                  if (grammarIsSubmitted) {
                                    if (oIdx === grammarQueue[grammarCurrentIndex].correctAnswer) {
                                      style = "border-emerald-500 bg-emerald-50 text-emerald-800 font-bold ring-2 ring-emerald-200";
                                    } else if (isThisSelected) {
                                      style = "border-rose-400 bg-rose-50 text-rose-800 font-bold ring-2 ring-rose-200";
                                    } else {
                                      style = "border-gray-100 bg-gray-50/50 text-gray-400";
                                    }
                                  } else if (isThisSelected) {
                                    style = "border-[#8a5b61] bg-[#8a5b61]/10 text-[#8a5b61] font-bold ring-2 ring-[#8a5b61]/20";
                                  }

                                  return (
                                    <button
                                      key={oIdx}
                                      onClick={() => handleGrammarAnswerClick(oIdx)}
                                      disabled={grammarIsSubmitted}
                                      className={`p-4 text-left rounded-2xl border text-xs sm:text-sm transition-all cursor-pointer ${style}`}
                                    >
                                      {opt}
                                    </button>
                                  );
                                })}
                              </div>

                              {/* Submission Feedback */}
                              {grammarIsSubmitted && (
                                <div className="bg-[#8a5b61]/5 border border-[#8a5b61]/10 rounded-2xl p-4 mb-6">
                                  <p className={`text-xs font-bold ${grammarSelectedAns === grammarQueue[grammarCurrentIndex].correctAnswer ? "text-emerald-700" : "text-rose-700"} mb-1`}>
                                    {grammarFeedbackMsg}
                                  </p>
                                  <div className="flex gap-1.5 mt-2">
                                    <Info className="w-4 h-4 text-[#8a5b61] shrink-0 mt-0.5" />
                                    <p className="text-[11px] text-[#8a5b61] leading-relaxed">
                                      <span className="font-bold">Giải thích: </span>{grammarQueue[grammarCurrentIndex]?.explanation}
                                    </p>
                                  </div>
                                </div>
                              )}

                              <div className="flex justify-end gap-3">
                                {!grammarIsSubmitted ? (
                                  <button
                                    onClick={handleGrammarSubmit}
                                    disabled={grammarSelectedAns === null}
                                    className="bg-[#8a5b61] hover:bg-[#724a4f] active:scale-95 text-white font-bold text-xs px-6 py-3 rounded-full shadow-md transition-all disabled:opacity-50 cursor-pointer"
                                  >
                                    Nộp câu trả lời
                                  </button>
                                ) : (
                                  <button
                                    onClick={handleGrammarNext}
                                    className="bg-[#8a5b61] hover:bg-[#724a4f] active:scale-95 text-white font-bold text-xs px-6 py-3 rounded-full shadow-md transition-all cursor-pointer"
                                  >
                                    {grammarCurrentIndex + 1 < grammarQueue.length ? (lang === "vi" ? "Câu tiếp theo" : "Next Question") : (lang === "vi" ? "Hoàn thành bước này" : "Finish this step")}
                                  </button>
                                )}
                              </div>
                            </div>
                          ) : (
                            <div className="text-center py-8 space-y-4">
                              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto shadow-inner text-emerald-600">
                                <Check className="w-8 h-8 stroke-[3]" />
                              </div>
                              <h3 className="text-xl font-serif font-extrabold text-[#8a5b61]">
                                {lang === "vi" ? "Tuyệt vời! Hoàn thành 100%" : "Excellent! 100% Completed"}
                              </h3>
                              <p className="text-xs text-gray-600 max-w-sm mx-auto leading-relaxed">
                                {lang === "vi" 
                                  ? "Bạn đã chứng minh hiểu cực rõ kiến thức ngữ pháp ngày hôm nay! Phần Đọc hiểu và Nghe hiểu của bài học giờ đây đã được mở khóa hoàn toàn." 
                                  : "You have mastered today's grammar! Reading and Listening comprehension are now fully unlocked."}
                              </p>
                              <button
                                onClick={() => {
                                  setActiveStep(6);
                                }}
                                className="bg-[#8a5b61] hover:bg-[#724a4f] text-white font-bold text-xs px-6 py-3 rounded-full shadow-md transition-all cursor-pointer"
                              >
                                {lang === "vi" ? "Đọc hiểu & Nghe hiểu ngay →" : "Study Reading & Listening Now →"}
                              </button>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                )}

                {/* STEP 6: READING & LISTENING */}
                {activeStep === 6 && (
                  <div className="space-y-6">
                    {activeLesson.reading.length === 0 && activeLesson.listening.length === 0 ? (
                      <div className="bg-white/40 backdrop-blur-xl rounded-2xl p-8 border border-[#8a5b61]/20 shadow-sm text-center space-y-4">
                        <BookOpenCheck className="w-12 h-12 text-[#8a5b61] mx-auto opacity-40" />
                        <h4 className="text-sm font-serif font-black text-[#8a5b61]">Chưa có dữ liệu Đọc hiểu & Nghe hiểu</h4>
                        <p className="text-xs text-gray-500 max-w-md mx-auto leading-relaxed">
                          Bài học này hiện chưa được nhập tài liệu Đọc hiểu hoặc Nghe hiểu. Bạn hãy nhập dữ liệu vào hằng số <code className="bg-gray-100 px-1 py-0.5 rounded font-mono font-bold text-pink-600">USER_CURRICULUM_DATA</code> trong file <code className="bg-gray-100 px-1 py-0.5 rounded font-mono font-bold">src/data/curriculumData.ts</code> nhé!
                        </p>
                        <button
                          onClick={() => {
                            updateProgress(activeChapterNum, activeDay, "readingDone", true);
                            setActiveStep(7);
                          }}
                          className="bg-[#8a5b61] hover:bg-[#724a4f] text-white font-bold text-xs px-6 py-2.5 rounded-full shadow-md transition-all cursor-pointer"
                        >
                          Tiếp tục: Luyện Kaiwa với AI →
                        </button>
                      </div>
                    ) : (
                      <>
                        {/* READING TAB */}
                        {activeLesson.reading.length > 0 && (
                          <div className="bg-white/40 backdrop-blur-xl rounded-3xl p-5 border border-[#8a5b61]/20 shadow-sm space-y-5">
                            <div className="flex items-center gap-2 border-b border-[#8a5b61]/20 pb-3">
                              <BookOpenCheck className="w-5 h-5 text-[#8a5b61]" />
                            </div>

                            {activeLesson.reading.map((read) => {
                              const ans = readingSelectedAns[read.id];
                              const sub = readingSubmitted[read.id];
                              const isCorrect = ans === read.correctAnswer;

                              return (
                                <div key={read.id} className="space-y-4 bg-white/50 p-4 rounded-2xl border border-gray-100/60">
                                  <div>
                                    <span className="text-[10px] bg-[#8a5b61]/10 text-[#8a5b61] px-2.5 py-0.5 rounded-full font-bold">ĐOẠN VĂN</span>
                                    <div className="bg-white p-4 rounded-xl border border-[#8a5b61]/10 font-sans text-sm sm:text-base leading-relaxed text-gray-800 mt-2">
                                      {read.passage}
                                    </div>
                                  </div>

                                  <details className="text-xs text-gray-500 cursor-pointer">
                                    <summary className="font-semibold text-[#8a5b61] hover:underline">Xem bản dịch tiếng Việt</summary>
                                    <div className="p-3 bg-[#8a5b61]/5 rounded-xl mt-1.5 border border-[#8a5b61]/10 italic">
                                      {read.translation}
                                    </div>
                                  </details>

                                  <div className="border-t border-gray-100 pt-3">
                                    <p className="text-sm font-sans font-bold text-gray-800 leading-relaxed">
                                      {read.question}
                                    </p>
                                    
                                    <div className="grid grid-cols-1 gap-2.5 mt-3">
                                      {read.options.map((opt, oIdx) => {
                                        let style = "border-gray-200 bg-white hover:bg-[#8a5b61]/5 text-gray-700";
                                        if (sub) {
                                          if (oIdx === read.correctAnswer) {
                                            style = "border-emerald-500 bg-emerald-50 text-emerald-800 font-bold ring-2 ring-emerald-200";
                                          } else if (ans === oIdx) {
                                            style = "border-rose-400 bg-rose-50 text-rose-800 font-bold ring-2 ring-rose-200";
                                          } else {
                                            style = "border-gray-100 bg-gray-50/50 text-gray-400";
                                          }
                                        } else if (ans === oIdx) {
                                          style = "border-[#8a5b61] bg-[#8a5b61]/10 text-[#8a5b61] font-bold ring-2 ring-[#8a5b61]/20";
                                        }

                                        return (
                                          <button
                                            key={oIdx}
                                            onClick={() => {
                                              if (sub) return;
                                              setReadingSelectedAns(prev => ({ ...prev, [read.id]: oIdx }));
                                            }}
                                            disabled={sub}
                                            className={`p-3 text-left rounded-xl border text-xs sm:text-sm transition-all cursor-pointer ${style}`}
                                          >
                                            {opt}
                                          </button>
                                        );
                                      })}
                                    </div>
                                  </div>

                                  {sub && (
                                    <div className="bg-[#8a5b61]/5 p-3 rounded-xl border border-[#8a5b61]/10 text-xs text-[#8a5b61] space-y-1">
                                      <p className="font-bold">{isCorrect ? "Chúc mừng! Đúng rồi 🎉" : "Chưa chính xác 😢"}</p>
                                      <p className="text-gray-600 leading-relaxed">{read.explanation}</p>
                                    </div>
                                  )}

                                  {!sub && (
                                    <div className="flex justify-end">
                                      <button
                                        onClick={() => {
                                          setReadingSubmitted(prev => ({ ...prev, [read.id]: true }));
                                        }}
                                        disabled={ans === undefined}
                                        className="bg-[#8a5b61] hover:bg-[#724a4f] active:scale-95 text-white font-bold text-xs px-5 py-2 rounded-full transition-all disabled:opacity-50 cursor-pointer"
                                      >
                                        Xác nhận đáp án
                                      </button>
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        )}

                        {/* LISTENING COMPONENT (PREMIUM AUDIO PLAYER SIMULATOR) */}
                        {activeLesson.listening.length > 0 && (
                          <div className="bg-white/40 backdrop-blur-xl rounded-3xl p-5 border border-[#8a5b61]/20 shadow-sm space-y-5">
                            <div className="flex items-center gap-2 border-b border-[#8a5b61]/20 pb-3">
                              <Volume2 className="w-5 h-5 text-[#8a5b61]" />
                            </div>

                            {activeLesson.listening.map((list) => {
                              const ans = listeningSelectedAns[list.id];
                              const sub = listeningSubmitted[list.id];
                              const isCorrect = ans === list.correctAnswer;

                              return (
                                <div key={list.id} className="space-y-4 bg-white/50 p-4 rounded-2xl border border-gray-100/60">
                                  
                                  {/* Premium Simulated Audio Player Card */}
                                  <div className="bg-gradient-to-r from-[#2c1d1e] to-[#422e30] rounded-2xl p-4 text-white shadow-md">
                                    <div className="flex items-center justify-between mb-3">
                                      <span className="text-[9px] bg-[#8a5b61]/20 text-pink-300 border border-[#8a5b61]/30 px-2 py-0.5 rounded-full font-mono uppercase tracking-wider">
                                        {lang === "vi" ? "BÀI NGHE THỰC TẾ" : "PRACTICAL LISTENING"}
                                      </span>
                                      <span className="text-xs text-gray-300 font-mono">01:42</span>
                                    </div>

                                    <div className="flex items-center gap-4">
                                      <button
                                        onClick={() => setIsListeningPlaying(!isListeningPlaying)}
                                        className="w-12 h-12 rounded-full bg-[#8a5b61] hover:bg-[#724a4f] flex items-center justify-center text-white cursor-pointer active:scale-95 transition-transform shrink-0 shadow-md"
                                      >
                                        {isListeningPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-1" />}
                                      </button>
                                      
                                      <div className="flex-1">
                                        <div className="text-xs font-bold truncate">
                                          {lang === "vi" ? "Tình huống: " : "Scenario: "}{getLocalizedText(list.scenario, lang)}
                                        </div>
                                        
                                        {/* Waveform graphic simulator */}
                                        <div className="flex items-end gap-0.5 h-6 mt-2">
                                          {Array.from({ length: 32 }).map((_, i) => {
                                            const h = isListeningPlaying ? Math.random() * 20 + 4 : 4;
                                            return (
                                              <div 
                                                key={i} 
                                                className="flex-1 bg-pink-400 rounded-full transition-all duration-150" 
                                                style={{ height: `${h}px` }}
                                              />
                                            );
                                          })}
                                        </div>
                                      </div>
                                    </div>

                                    {/* Speed controls */}
                                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/10 text-xs">
                                      <div className="flex items-center gap-1">
                                        <span className="text-gray-400">{lang === "vi" ? "Tốc độ:" : "Speed:"}</span>
                                        {[0.8, 1.0, 1.2].map((s) => (
                                          <button
                                            key={s}
                                            onClick={() => setListeningSpeed(s)}
                                            className={`px-2 py-0.5 rounded ${listeningSpeed === s ? "bg-[#8a5b61] text-white font-bold" : "text-gray-300 hover:bg-white/10"}`}
                                          >
                                            {s}x
                                          </button>
                                        ))}
                                      </div>
                                      <button
                                        onClick={() => setShowListeningTranscript(!showListeningTranscript)}
                                        className="text-pink-300 hover:underline font-bold text-[11px]"
                                      >
                                        {showListeningTranscript 
                                          ? (lang === "vi" ? "Ẩn văn bản transcript" : "Hide transcript") 
                                          : (lang === "vi" ? "Hiện văn bản transcript" : "Show transcript")}
                                      </button>
                                    </div>
                                  </div>

                                  {/* Transcript panel */}
                                  {showListeningTranscript && (
                                    <div className="bg-[#8a5b61]/5 p-3 rounded-xl border border-[#8a5b61]/10 space-y-2 text-xs">
                                      <div>
                                        <span className="font-extrabold text-[#8a5b61] block mb-1">
                                          {lang === "vi" ? "TRANSCRIPT TIẾNG NHẬT:" : "JAPANESE TRANSCRIPT:"}
                                        </span>
                                        <p className="font-sans font-semibold text-gray-800 leading-relaxed whitespace-pre-line">{list.transcript}</p>
                                      </div>
                                      <div className="border-t border-[#8a5b61]/10 pt-2">
                                        <span className="font-extrabold text-[#8a5b61] block mb-1">
                                          {lang === "vi" ? "BẢN DỊCH TIẾNG VIỆT:" : "TRANSLATION:"}
                                        </span>
                                        <p className="font-serif italic text-gray-600 leading-relaxed whitespace-pre-line">{getLocalizedText(list.translation, lang)}</p>
                                      </div>
                                    </div>
                                  )}

                                  {/* Question and choices */}
                                  <div className="pt-2 border-t border-gray-100">
                                    <p className="text-sm font-sans font-bold text-gray-800 leading-relaxed">
                                      {getLocalizedText(list.question, lang)}
                                    </p>
                                    
                                    <div className="grid grid-cols-1 gap-2.5 mt-3">
                                      {list.options.map((opt, oIdx) => {
                                        let style = "border-gray-200 bg-white hover:bg-[#8a5b61]/5 text-gray-700";
                                        if (sub) {
                                          if (oIdx === list.correctAnswer) {
                                            style = "border-emerald-500 bg-emerald-50 text-emerald-800 font-bold ring-2 ring-emerald-200";
                                          } else if (ans === oIdx) {
                                            style = "border-rose-400 bg-rose-50 text-rose-800 font-bold ring-2 ring-rose-200";
                                          } else {
                                            style = "border-gray-100 bg-gray-50/50 text-gray-400";
                                          }
                                        } else if (ans === oIdx) {
                                          style = "border-[#8a5b61] bg-[#8a5b61]/10 text-[#8a5b61] font-bold ring-2 ring-[#8a5b61]/20";
                                        }

                                        return (
                                          <button
                                            key={oIdx}
                                            onClick={() => {
                                              if (sub) return;
                                              setListeningSelectedAns(prev => ({ ...prev, [list.id]: oIdx }));
                                            }}
                                            disabled={sub}
                                            className={`p-3 text-left rounded-xl border text-xs sm:text-sm transition-all cursor-pointer ${style}`}
                                          >
                                            {getLocalizedText(opt, lang)}
                                          </button>
                                        );
                                      })}
                                    </div>
                                  </div>

                                  {sub && (
                                    <div className="bg-[#8a5b61]/5 p-3 rounded-xl border border-[#8a5b61]/10 text-xs text-[#8a5b61] space-y-1">
                                      <p className="font-bold">
                                        {isCorrect 
                                          ? (lang === "vi" ? "Đúng rồi! Cực đỉnh 🎉" : "Correct! Outstanding 🎉") 
                                          : (lang === "vi" ? "Chưa chính xác 😢" : "Incorrect 😢")}
                                      </p>
                                      <p className="text-gray-600 leading-relaxed">{getLocalizedText(list.explanation, lang)}</p>
                                    </div>
                                  )}

                                  {!sub && (
                                    <div className="flex justify-end">
                                      <button
                                        onClick={() => {
                                          setListeningSubmitted(prev => ({ ...prev, [list.id]: true }));
                                        }}
                                        disabled={ans === undefined}
                                        className="bg-[#8a5b61] hover:bg-[#724a4f] active:scale-95 text-white font-bold text-xs px-5 py-2 rounded-full transition-all disabled:opacity-50 cursor-pointer"
                                      >
                                        {lang === "vi" ? "Xác nhận đáp án" : "Confirm Answer"}
                                      </button>
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        )}

                        {/* Lesson Completion Card */}
                        <div className="bg-gradient-to-r from-[#8a5b61] to-[#724a4f] text-white p-6 rounded-3xl text-center space-y-3 shadow-md">
                          <Award className="w-12 h-12 text-yellow-300 fill-yellow-200 mx-auto animate-bounce" />
                          <h3 className="text-xl font-serif font-extrabold">Chúc mừng bạn đã hoàn thành Ngày {activeDay}!</h3>
                          <p className="text-xs text-pink-50 max-w-md mx-auto leading-relaxed">
                            Bạn đã kiên trì học tập xuất sắc tất cả các phần Từ vựng, Chữ Hán, Ngữ pháp, Đọc hiểu và Nghe hiểu của bài hôm nay! Hãy cùng tham gia luyện hội thoại giao tiếp trực tiếp với Cô giáo AI ngay nào.
                          </p>
                          <button
                            onClick={() => {
                              updateProgress(activeChapterNum, activeDay, "readingDone", true);
                              setActiveStep(7);
                            }}
                            className="bg-white text-[#8a5b61] hover:bg-pink-50 font-bold text-xs px-6 py-2.5 rounded-full shadow hover:scale-105 active:scale-95 transition-transform cursor-pointer"
                          >
                            Tiếp tục: Luyện Kaiwa với AI →
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                )}

                {/* STEP 7: AI KAIWA PRACTICE */}
                {activeStep === 7 && (
                  <AIKaiwa
                    level={selectedLevel}
                    chapter={activeChapterNum}
                    day={activeDay}
                    vocabulary={activeLesson.vocabulary}
                    grammar={activeLesson.grammar}
                    lang={lang}
                    onComplete={() => {
                      // Save full lesson day completion
                      updateProgress(activeChapterNum, activeDay, "kaiwaDone", true);
                      updateProgress(activeChapterNum, activeDay, "lessonDone", true);
                      // Progress to next day
                      if (activeDay < 7) {
                        setActiveDay(prev => prev + 1);
                        setActiveStep(1);
                      }
                    }}
                  />
                )}

              </motion.div>
            )}

            {/* DAY 7: CHAPTER PRACTICE / MOCK TEST VIEW */}
            {activeDay === 7 && activePractice && (
              <motion.div
                key={`chap-practice-${activeChapterNum}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                <div className="bg-gradient-to-r from-[#2c1d1e] to-[#422e30] text-white p-5 rounded-3xl shadow-md">
                  <div className="flex items-center gap-2">
                    <Award className="w-6 h-6 text-amber-400 shrink-0" />
                    <h3 className="font-serif font-extrabold text-base md:text-lg">
                      {lang === "vi" ? `Đề kiểm tra tổng hợp Chương ${activeChapterNum}` : `Comprehensive Review Test Chapter ${activeChapterNum}`}
                    </h3>
                  </div>
                  <p className="text-xs text-gray-300 mt-1 leading-relaxed font-sans">
                    {lang === "vi" 
                      ? "Chào mừng bạn đến với thử thách cuối tuần! Đề thi này bao gồm toàn bộ hệ thống từ vựng, hán tự và ngữ pháp bạn đã học suốt 6 ngày qua. Hãy làm thật nghiêm túc nhé!" 
                      : "Welcome to the weekend challenge! This exam covers all vocabulary, kanji, and grammar you have studied for the past 6 days. Please take it seriously!"}
                  </p>
                </div>

                {activePractice.quiz.length === 0 ? (
                  <div className="bg-white/40 backdrop-blur-xl rounded-2xl p-8 border border-[#8a5b61]/20 shadow-sm text-center space-y-4">
                    <HelpCircle className="w-12 h-12 text-[#8a5b61] mx-auto opacity-40" />
                    <h4 className="text-sm font-serif font-black text-[#8a5b61]">
                      {lang === "vi" ? "Chưa có đề Kiểm tra tổng hợp" : "No Comprehensive Practice Test Available"}
                    </h4>
                    <p className="text-xs text-gray-500 max-w-sm mx-auto leading-relaxed">
                      {lang === "vi" 
                        ? "Chương này hiện chưa có câu hỏi kiểm tra tổng hợp nào được thêm. Bạn hãy nhập các câu hỏi ôn tập tổng hợp vào hằng số USER_PRACTICE_DATA trong file src/data/curriculumData.ts nhé!" 
                        : "No comprehensive practice test questions have been added for this chapter yet. Please configure them in USER_PRACTICE_DATA inside src/data/curriculumData.ts!"}
                    </p>
                  </div>
                ) : (
                  <>
                    <div className="space-y-5">
                      {activePractice.quiz.map((q, idx) => {
                        const ans = chapPracticeAnswers[q.id];
                        const isCorrect = ans === q.correctAnswer;

                        return (
                          <div key={q.id} className="bg-white/40 backdrop-blur-xl rounded-2xl p-4 md:p-5 border border-pink-100/30 shadow-sm space-y-4">
                            <div className="flex items-start gap-3">
                              <span className="w-6 h-6 rounded-full bg-pink-100 text-pink-700 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                                {idx + 1}
                              </span>
                              <p className="text-sm sm:text-base font-sans font-bold text-gray-800 leading-relaxed">
                                {q.question}
                              </p>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 ml-0 sm:ml-9">
                              {q.options.map((opt, oIdx) => {
                                let style = "border-gray-200 bg-white hover:bg-pink-50/10 text-gray-700";
                                if (chapPracticeSubmitted) {
                                  if (oIdx === q.correctAnswer) {
                                    style = "border-emerald-500 bg-emerald-50 text-emerald-800 font-bold ring-2 ring-emerald-200";
                                  } else if (ans === oIdx) {
                                    style = "border-rose-400 bg-rose-50 text-rose-800 font-bold ring-2 ring-rose-200";
                                  } else {
                                    style = "border-gray-100 bg-gray-50/50 text-gray-400";
                                  }
                                } else if (ans === oIdx) {
                                  style = "border-pink-400 bg-pink-50 text-[#8a5b61] font-bold ring-2 ring-pink-200";
                                }

                                return (
                                  <button
                                    key={oIdx}
                                    onClick={() => handleChapPracticeAnswer(q.id, oIdx)}
                                    disabled={chapPracticeSubmitted}
                                    className={`p-3 text-left rounded-xl border text-xs sm:text-sm transition-all cursor-pointer ${style}`}
                                  >
                                    {opt}
                                  </button>
                                );
                              })}
                            </div>

                            {chapPracticeSubmitted && (
                              <div className="bg-pink-50/40 p-3 rounded-xl border border-pink-50 text-xs text-[#8a5b61] space-y-1 ml-0 sm:ml-9">
                                <p className="font-bold">
                                  {isCorrect 
                                    ? (lang === "vi" ? "Đúng rồi! 🎉" : "Correct! 🎉") 
                                    : (lang === "vi" ? "Chưa chính xác 😢" : "Incorrect 😢")}
                                </p>
                                <p className="text-gray-600 leading-relaxed">{q.explanation}</p>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    {/* Submit action */}
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white/40 backdrop-blur-xl rounded-2xl p-4 border border-pink-100/30 shadow-sm">
                      <div>
                        {chapPracticeSubmitted ? (
                          <div className="text-sm font-sans font-extrabold text-pink-700">
                            {lang === "vi" 
                              ? `Kết quả: ${chapPracticeScore} / ${activePractice.quiz.length} câu chính xác!` 
                              : `Result: ${chapPracticeScore} / ${activePractice.quiz.length} correct answers!`}
                          </div>
                        ) : (
                          <div className="text-xs text-gray-500 font-semibold">
                            {lang === "vi" 
                              ? "Vui lòng làm hết các câu hỏi trước khi nộp bài thi." 
                              : "Please answer all questions before submitting your exam."}
                          </div>
                        )}
                      </div>
                      
                      <div className="flex gap-3">
                        {!chapPracticeSubmitted ? (
                          <button
                            onClick={handleChapPracticeSubmit}
                            disabled={Object.keys(chapPracticeAnswers).length < activePractice.quiz.length}
                            className="bg-pink-500 hover:bg-pink-600 active:scale-95 text-white font-bold text-xs px-6 py-2.5 rounded-full transition-all disabled:opacity-50 cursor-pointer shadow-md"
                          >
                            {lang === "vi" ? "Nộp bài thi tổng hợp" : "Submit Practice Exam"}
                          </button>
                        ) : (
                          <button
                            onClick={initChapterPracticeQuiz}
                            className="bg-white hover:bg-pink-50 text-[#8a5b61] font-bold text-xs px-5 py-2.5 rounded-full border border-pink-100/30 transition-all cursor-pointer shadow-sm flex items-center gap-1.5"
                          >
                            <RefreshCw className="w-3.5 h-3.5" />
                            {lang === "vi" ? "Làm lại đề này" : "Retry this exam"}
                          </button>
                        )}
                      </div>
                    </div>
                  </>
                )}

              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </div>

      {/* FOOTER GAME & AI TOGGLES */}
      <div className="mt-8 border-t border-[#8a5b61]/15 pt-6">
        <h4 className="text-xs uppercase font-extrabold tracking-widest text-[#8a5b61] mb-4 text-center">
          {lang === "vi" ? "Công cụ hỗ trợ học tập bổ sung" : "Supplementary Learning Tools"}
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          
          {/* Game card */}
          <div className="bg-white/40 backdrop-blur-xl rounded-2xl p-4 border border-[#8a5b61]/15 shadow-sm flex items-start gap-4 hover:border-[#8a5b61]/40 transition-all">
            <div className="w-10 h-10 rounded-xl bg-[#8a5b61]/10 text-[#8a5b61] flex items-center justify-center shrink-0">
              <Gamepad2 className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <h5 className="font-serif font-black text-sm text-[#8a5b61]">
                {lang === "vi" ? "Trò chơi Ghép thẻ Nhật Việt" : "Japanese Card Matching Game"}
              </h5>
              <p className="text-[11px] text-gray-500 leading-relaxed">
                {lang === "vi" 
                  ? "Giải trí và rèn luyện trí nhớ nhanh chóng bằng cách ghép đôi từ vựng với nghĩa tương ứng." 
                  : "Have fun and train your quick memory by pairing vocabulary with its corresponding meaning."}
              </p>
              <details className="cursor-pointer pt-1">
                <summary className="text-[11px] text-[#8a5b61] font-extrabold hover:underline">
                  {lang === "vi" ? "Chơi ngay" : "Play now"}
                </summary>
                <div className="pt-3">
                  <MemoryGame pairs={[
                    { id: "m1", left: "私 (わたし)", right: lang === "vi" ? "Tôi" : "I / Me" },
                    { id: "m2", left: "友達 (ともだち)", right: lang === "vi" ? "Bạn bè" : "Friend" },
                    { id: "m3", left: "先生 (せんせい)", right: lang === "vi" ? "Thầy cô" : "Teacher" },
                    { id: "m4", left: "本 (ほん)", right: lang === "vi" ? "Sách" : "Book" },
                    { id: "m5", left: "辞書 (じしょ)", right: lang === "vi" ? "Từ điển" : "Dictionary" }
                  ]} />
                </div>
              </details>
            </div>
          </div>

          {/* AI Teacher card */}
          <div className="bg-white/40 backdrop-blur-xl rounded-2xl p-4 border border-[#8a5b61]/15 shadow-sm flex items-start gap-4 hover:border-[#8a5b61]/40 transition-all">
            <div className="w-10 h-10 rounded-xl bg-[#8a5b61]/10 text-[#8a5b61] flex items-center justify-center shrink-0">
              <BrainCircuit className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <h5 className="font-serif font-black text-sm text-[#8a5b61]">
                {lang === "vi" ? "Cô giáo Trợ lý ảo AI" : "AI Virtual Assistant Teacher"}
              </h5>
              <p className="text-[11px] text-gray-500 leading-relaxed">
                {lang === "vi" 
                  ? "Bạn gặp khó khăn về bất cứ ngữ pháp hay từ vựng nào? Hỏi ngay cô giáo để nhận giải đáp tức thì." 
                  : "Struggling with any grammar or vocabulary? Ask the teacher now for an instant explanation."}
              </p>
              <details className="cursor-pointer pt-1">
                <summary className="text-[11px] text-[#8a5b61] font-extrabold hover:underline">
                  {lang === "vi" ? "Nhắn tin ngay" : "Chat now"}
                </summary>
                <div className="pt-3">
                  <AITutor lang={lang} />
                </div>
              </details>
            </div>
          </div>

        </div>
      </div>

      {/* Dedicated Lesson Goal Modal */}
      <LessonGoalModal
        isOpen={showGoalModal}
        onClose={() => setShowGoalModal(false)}
        lessonTitle={
          activeDay === 7
            ? (activePractice?.title ? getLocalizedText(activePractice.title, lang) : "Bài 7: Ôn tập tổng hợp")
            : (activeLesson?.title ? getLocalizedText(activeLesson.title, lang) : `Bài ${activeDay}`)
        }
        chapterNum={activeChapterNum}
        dayNum={activeDay}
      />

    </div>
  );
};
