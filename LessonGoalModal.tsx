import React from "react";
import { ArrowRight, X } from "lucide-react";
import { motion } from "motion/react";
import { IntroScreen } from "../data/kanaLesson1Data";

interface LessonGoalModalProps {
  isOpen: boolean;
  onClose: () => void;
  lessonTitle: string;
  chapterNum: number;
  dayNum: number;
  introScreen?: IntroScreen;
}

export const LessonGoalModal: React.FC<LessonGoalModalProps> = ({
  isOpen,
  onClose,
  lessonTitle,
  chapterNum,
  dayNum,
  introScreen
}) => {
  if (!isOpen) return null;

  const defaultGoals = [
    {
      title: "Nhớ được 25/46 chữ cái gốc (Hiragana)",
      desc: "Ghi nhớ mặt chữ & âm đọc 5 hàng đầu: あ・か・さ・た・な"
    },
    {
      title: "Biến âm Dakuten (゛)",
      desc: "Khi thêm dấu này âm sẽ đổi: K→G, S→Z, T→D"
    }
  ];

  const goals = introScreen?.goals || defaultGoals;
  const ctaText = introScreen?.cta_button || "Bắt đầu ngay";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        className="w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl border border-[#8a5b61]/20 relative overflow-hidden"
      >
        {/* Subtle decorative background circle */}
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#8a5b61]/5 rounded-full blur-xl pointer-events-none" />

        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 p-1.5 rounded-full hover:bg-gray-100 transition-all cursor-pointer"
          title="Đóng"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 mb-3">
          <span className="text-[10px] bg-[#8a5b61]/10 text-[#8a5b61] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
            Chương {chapterNum} • Bài {dayNum}
          </span>
        </div>

        <h3 className="text-xl font-serif font-black text-gray-900 mb-1 leading-snug">
          Mục tiêu bài học
        </h3>
        <p className="text-xs text-gray-500 mb-5 font-sans">
          {lessonTitle.split("/")[0]}
        </p>

        {/* Goals Checklist */}
        <div className="space-y-3 mb-6">
          {goals.map((g, idx) => (
            <div
              key={idx}
              className={`flex items-start gap-3 p-3 rounded-2xl border ${
                idx === 0
                  ? "bg-rose-50/60 border-rose-100/60"
                  : "bg-amber-50/60 border-amber-100/60"
              }`}
            >
              <div
                className={`w-6 h-6 rounded-full text-white flex items-center justify-center shrink-0 mt-0.5 shadow-2xs text-xs font-bold ${
                  idx === 0 ? "bg-[#8a5b61]" : "bg-amber-600"
                }`}
              >
                {idx + 1}
              </div>
              <div>
                <h4 className="text-xs font-bold text-gray-900">{g.title}</h4>
                <p className="text-[11px] text-gray-600 leading-snug mt-0.5">
                  {g.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Start button */}
        <button
          onClick={onClose}
          className="w-full py-3.5 px-5 bg-[#8a5b61] hover:bg-[#724a4f] text-white font-bold text-sm rounded-2xl shadow-md transition-all active:scale-98 flex items-center justify-center gap-2 cursor-pointer"
        >
          <span>{ctaText}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </motion.div>
    </div>
  );
};
