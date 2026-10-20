import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  BookOpen,
  FileText,
  Clock,
  Sparkles,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  GraduationCap,
  Pencil,
  BookMarked,
  CheckCircle2,
  CalendarDays,
  Search,
  Layers,
} from "lucide-react";
import { translations } from "../lib/translations";
import { N4Lesson1View } from "./N4Lesson1View";
import { N4Lesson2View } from "./N4Lesson2View";

interface CourseDashboardProps {
  onBackToHome: () => void;
  lang: "vi" | "en";
}

export const CourseDashboard: React.FC<CourseDashboardProps> = ({
  onBackToHome,
  lang,
}) => {
  const t = translations[lang];
  const [selectedLevel, setSelectedLevel] = useState<string | null>(null);
  const [hoveredLevel, setHoveredLevel] = useState<string | null>(null);
  const [selectedSession, setSelectedSession] = useState<number | null>(null);
  const [activeSessionTab, setActiveSessionTab] = useState<"lesson" | "vocab" | "homework">("lesson");
  const [sessionRangeFilter, setSessionRangeFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const bookImages: Record<string, string> = {
    N5: "https://i.postimg.cc/LXrWwWdK/sukurinshotto-2026-07-01-154855-removebg-preview.png",
    N4: "https://i.postimg.cc/05L55JNy/sách_n4.png",
    N3: "https://i.postimg.cc/CLLBD8gD/sach-n3.png",
    N2: "https://i.postimg.cc/Nff9TXcX/sach-n2.png",
    N1: "https://i.postimg.cc/sDDQSWr7/Sach-n1.png",
  };

  const baseScales: Record<string, number> = {
    N5: 1.05,
    N4: 1.1,
    N3: 1.05,
    N2: 1.05,
    N1: 1.05,
  };

  // Generate 42 sessions for N4
  const n4TotalSessions = 42;
  const sessions = Array.from({ length: n4TotalSessions }, (_, i) => i + 1);

  // Filtered sessions for N4
  const filteredSessions = sessions.filter((sessionNum) => {
    // Range filter
    if (sessionRangeFilter === "1-10" && (sessionNum < 1 || sessionNum > 10)) return false;
    if (sessionRangeFilter === "11-20" && (sessionNum < 11 || sessionNum > 20)) return false;
    if (sessionRangeFilter === "21-30" && (sessionNum < 21 || sessionNum > 30)) return false;
    if (sessionRangeFilter === "31-42" && (sessionNum < 31 || sessionNum > 42)) return false;

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const sessionLabel = `${t.session.toLowerCase()} ${sessionNum}`;
      const numOnly = sessionNum.toString();
      if (!sessionLabel.includes(q) && !numOnly.includes(q)) {
        return false;
      }
    }

    return true;
  });

  const renderBookButton = (lvl: string, isMobileSize: boolean) => {
    const isHovered = hoveredLevel === lvl;
    const baseScale = isMobileSize ? 1.05 : baseScales[lvl];
    const scaleVal = isHovered ? baseScale * 1.15 : baseScale;

    let translateY = "0%";
    if (isMobileSize) {
      if (lvl === "N5") {
        translateY = "-5%";
      }
    } else {
      if (lvl === "N4") {
        translateY = "6%";
      }
    }

    return (
      <div key={lvl} className="flex flex-col items-center">
        <button
          onClick={() => {
            setSelectedLevel(lvl);
            setSelectedSession(null);
          }}
          onMouseEnter={() => setHoveredLevel(lvl)}
          onMouseLeave={() => setHoveredLevel(null)}
          className={`relative transition-all duration-300 ease-out cursor-pointer outline-none focus:outline-none select-none border-0 bg-transparent opacity-95 hover:opacity-100 hover:z-10 filter drop-shadow-xl ${
            isMobileSize
              ? "w-[95px] h-[128px]"
              : "w-[90px] h-[121px] md:w-[120px] md:h-[162px] lg:w-[130px] lg:h-[175px]"
          }`}
          style={{
            backgroundImage: `url('${bookImages[lvl]}')`,
            backgroundSize: "contain",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            transform: `scale(${scaleVal}) translateY(${translateY})`,
          }}
          title={lang === "vi" ? `Khóa học ${lvl}` : `${lvl} Course`}
        />
        <span className="mt-1 text-xs font-bold text-[#8a5b61] bg-white/60 backdrop-blur-md px-2.5 py-0.5 rounded-full border border-pink-200/50 shadow-2xs">
          {lvl}
        </span>
      </div>
    );
  };

  return (
    <div className="w-full">
      {selectedLevel === null ? (
        /* ================= Phase 1: Level Selection for Courses ================= */
        <div className="max-w-4xl mx-auto px-4 py-4 md:py-8">
          {/* Back button to Home */}
          <div className="flex items-center justify-start mb-6">
            <button
              onClick={onBackToHome}
              className="text-xs font-sans font-bold text-[#8a5b61] bg-white/40 hover:bg-white/60 backdrop-blur-2xl border border-pink-200/50 px-4 py-2 rounded-full transition-all cursor-pointer shadow-sm flex items-center gap-1.5 active:scale-95"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>{t.backToHome}</span>
            </button>
          </div>

          {/* Title and subtitle */}
          <div className="text-center mb-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#8a5b61]/10 border border-[#8a5b61]/20 text-[#8a5b61] text-xs font-bold mb-2">
              <GraduationCap className="w-4 h-4 text-[#8a5b61]" />
              <span>{lang === "vi" ? "HỆ THỐNG KHÓA HỌC EMICHAN" : "EMICHAN COURSE SYSTEM"}</span>
            </div>
            <h2 className="font-serif text-2xl md:text-3xl font-black text-[#8a5b61] tracking-wide mb-1.5">
              {t.coursesSelectLevelTitle}
            </h2>
            <p className="text-xs text-gray-600 font-sans max-w-md mx-auto">
              {t.coursesSelectLevelSubtitle}
            </p>
          </div>

          {/* Book displays (identically styled to JLPT, but NO learning guide box) */}
          <div className="flex flex-col items-center justify-center select-none overflow-visible py-4 sm:py-8 md:py-10">
            {/* Mobile view: N5 & N4 on top, N3, N2, N1 below */}
            <div className="flex sm:hidden flex-col items-center gap-5 w-full">
              <div className="flex justify-center gap-8 w-full">
                {["N5", "N4"].map((lvl) => renderBookButton(lvl, true))}
              </div>
              <div className="flex justify-center gap-4 w-full">
                {["N3", "N2", "N1"].map((lvl) => renderBookButton(lvl, true))}
              </div>
            </div>

            {/* Desktop view: single responsive row */}
            <div className="hidden sm:flex items-center justify-center gap-5 md:gap-8 overflow-visible min-h-[160px] sm:min-h-[210px] w-full">
              {["N5", "N4", "N3", "N2", "N1"].map((lvl) => renderBookButton(lvl, false))}
            </div>
          </div>

          {/* Subtle info note */}
          <div className="text-center mt-3">
            <span className="inline-flex items-center gap-1.5 text-xs text-gray-500 bg-white/40 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-pink-100">
              <Sparkles className="w-3.5 h-3.5 text-[#8a5b61]" />
              {lang === "vi"
                ? "Chọn một quyển sách cấp độ để bắt đầu học tập"
                : "Select a level book to start learning"}
            </span>
          </div>
        </div>
      ) : selectedLevel === "N4" ? (
        /* ================= Phase 2: N4 Course (42 Sessions) ================= */
        <div className="max-w-5xl mx-auto px-4 py-4 md:py-6">
          {/* Top navigation bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
            <button
              onClick={() => {
                if (selectedSession !== null) {
                  setSelectedSession(null);
                } else {
                  setSelectedLevel(null);
                }
              }}
              className="text-xs font-sans font-bold text-[#8a5b61] bg-white/60 hover:bg-white/80 backdrop-blur-2xl border border-pink-200/50 px-4 py-2 rounded-full transition-all cursor-pointer shadow-sm flex items-center gap-1.5 active:scale-95"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>{selectedSession !== null ? t.backToSessionList : t.backToLevelSelect}</span>
            </button>

            {/* Quick level switcher */}
            <div className="flex items-center bg-white/50 backdrop-blur-md p-1 rounded-full border border-pink-200/50 shadow-2xs gap-1">
              {["N5", "N4", "N3", "N2", "N1"].map((lvl) => (
                <button
                  key={lvl}
                  onClick={() => {
                    setSelectedLevel(lvl);
                    setSelectedSession(null);
                  }}
                  className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                    selectedLevel === lvl
                      ? "bg-[#8a5b61] text-white shadow-xs"
                      : "text-[#8a5b61] hover:bg-white/50"
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>
          </div>

          {selectedSession === null ? (
            /* ===== Sub-view A: Grid of 42 Sessions for N4 ===== */
            <div>
              {/* N4 Header Banner */}
              <div className="bg-gradient-to-r from-white/90 via-white/80 to-pink-50/80 backdrop-blur-xl rounded-3xl p-5 md:p-6 border border-[#8a5b61]/15 shadow-sm mb-6 flex flex-col sm:flex-row items-center gap-5">
                <div className="w-20 h-28 md:w-24 md:h-32 shrink-0 flex items-center justify-center filter drop-shadow-md">
                  <img
                    src={bookImages.N4}
                    alt="Sách N4"
                    className="max-h-full max-w-full object-contain"
                  />
                </div>

                <div className="flex-1 text-center sm:text-left space-y-2">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#8a5b61]/10 border border-[#8a5b61]/20 text-[#8a5b61] text-xs font-bold">
                    <GraduationCap className="w-3.5 h-3.5 text-[#8a5b61]" />
                    <span>{lang === "vi" ? "Khóa học tiếng Nhật N4" : "N4 Japanese Course"}</span>
                    <span className="w-1 h-1 rounded-full bg-[#8a5b61]" />
                    <span>{lang === "vi" ? "42 Buổi học" : "42 Sessions"}</span>
                  </div>
                  <h1 className="font-serif text-2xl md:text-3xl font-black text-[#8a5b61] tracking-wide">
                    {lang === "vi" ? "LỘ TRÌNH 42 BUỔI HỌC N4" : "N4 42-SESSION LEARNING CURRICULUM"}
                  </h1>
                  <p className="text-xs md:text-sm text-gray-600 font-sans leading-relaxed max-w-2xl">
                    {lang === "vi"
                      ? "Chọn từng buổi học bên dưới để truy cập Nội dung bài học và Bài tập về nhà tương ứng."
                      : "Select any session below to view its Lesson Content and Homework assignments."}
                  </p>
                </div>
              </div>

              {/* Filter and Search Bar */}
              <div className="bg-white/60 backdrop-blur-md rounded-2xl p-3 border border-pink-100 shadow-2xs mb-5 flex flex-col sm:flex-row items-center justify-between gap-3">
                {/* Range Filter buttons */}
                <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
                  <button
                    onClick={() => setSessionRangeFilter("all")}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold font-sans transition-all cursor-pointer ${
                      sessionRangeFilter === "all"
                        ? "bg-[#8a5b61] text-white shadow-xs"
                        : "bg-white/70 text-[#8a5b61] hover:bg-white"
                    }`}
                  >
                    {t.allSessions}
                  </button>
                  <button
                    onClick={() => setSessionRangeFilter("1-10")}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold font-sans transition-all cursor-pointer ${
                      sessionRangeFilter === "1-10"
                        ? "bg-[#8a5b61] text-white shadow-xs"
                        : "bg-white/70 text-[#8a5b61] hover:bg-white"
                    }`}
                  >
                    {lang === "vi" ? "Buổi 1 - 10" : "Sessions 1 - 10"}
                  </button>
                  <button
                    onClick={() => setSessionRangeFilter("11-20")}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold font-sans transition-all cursor-pointer ${
                      sessionRangeFilter === "11-20"
                        ? "bg-[#8a5b61] text-white shadow-xs"
                        : "bg-white/70 text-[#8a5b61] hover:bg-white"
                    }`}
                  >
                    {lang === "vi" ? "Buổi 11 - 20" : "Sessions 11 - 20"}
                  </button>
                  <button
                    onClick={() => setSessionRangeFilter("21-30")}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold font-sans transition-all cursor-pointer ${
                      sessionRangeFilter === "21-30"
                        ? "bg-[#8a5b61] text-white shadow-xs"
                        : "bg-white/70 text-[#8a5b61] hover:bg-white"
                    }`}
                  >
                    {lang === "vi" ? "Buổi 21 - 30" : "Sessions 21 - 30"}
                  </button>
                  <button
                    onClick={() => setSessionRangeFilter("31-42")}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold font-sans transition-all cursor-pointer ${
                      sessionRangeFilter === "31-42"
                        ? "bg-[#8a5b61] text-white shadow-xs"
                        : "bg-white/70 text-[#8a5b61] hover:bg-white"
                    }`}
                  >
                    {lang === "vi" ? "Buổi 31 - 42" : "Sessions 31 - 42"}
                  </button>
                </div>

                {/* Quick search input */}
                <div className="relative w-full sm:w-48">
                  <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={lang === "vi" ? "Tìm buổi... (VD: 1, 12)" : "Search session..."}
                    className="w-full pl-8 pr-3 py-1.5 rounded-xl text-xs font-sans bg-white border border-pink-100 text-[#8a5b61] placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#8a5b61]"
                  />
                </div>
              </div>

              {/* 42 Sessions Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                {filteredSessions.map((sessionNum) => (
                  <motion.button
                    key={sessionNum}
                    whileHover={{ scale: 1.03, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      setSelectedSession(sessionNum);
                      setActiveSessionTab(sessionNum === 2 ? "vocab" : "both");
                    }}
                    className="group bg-white/80 hover:bg-white backdrop-blur-md rounded-2xl p-3 border border-pink-100/90 hover:border-[#8a5b61]/40 shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col items-center justify-center text-center relative overflow-hidden"
                  >
                    {/* Ô hiển thị chữ 'Buổi X' trực tiếp (không còn số tách riêng bị trùng lặp) */}
                    <div className={`w-full py-2 px-2.5 rounded-xl flex items-center justify-center font-sans font-bold text-sm mb-2 group-hover:bg-[#8a5b61] group-hover:text-white transition-colors shadow-2xs relative ${
                      sessionNum === 1 || sessionNum === 2
                        ? "bg-[#8a5b61]/15 text-[#8a5b61] ring-1 ring-[#8a5b61]/30 font-black"
                        : "bg-[#8a5b61]/10 text-[#8a5b61]"
                    }`}>
                      <span>{lang === "vi" ? `Buổi ${sessionNum}` : `Session ${sessionNum}`}</span>
                      {(sessionNum === 1 || sessionNum === 2) && (
                        <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                        </span>
                      )}
                    </div>

                    {/* Sub indicators */}
                    <div className="flex items-center gap-1.5 text-[10px] text-gray-500 font-medium">
                      <span className="inline-flex items-center gap-0.5">
                        <BookOpen className="w-2.5 h-2.5 text-[#8a5b61]" />
                        <span>{lang === "vi" ? "Nội dung" : "Content"}</span>
                      </span>
                      <span>•</span>
                      <span className="inline-flex items-center gap-0.5">
                        <Pencil className="w-2.5 h-2.5 text-amber-600" />
                        <span>{lang === "vi" ? "Bài tập" : "HW"}</span>
                      </span>
                    </div>

                    {/* Bottom subtle accent line */}
                    <div className="w-6 h-0.5 bg-[#8a5b61]/20 rounded-full mt-2 group-hover:w-10 group-hover:bg-[#8a5b61] transition-all duration-300" />
                  </motion.button>
                ))}
              </div>

              {filteredSessions.length === 0 && (
                <div className="text-center py-12 bg-white/60 backdrop-blur-md rounded-2xl border border-pink-100">
                  <p className="text-xs text-gray-500 font-sans">
                    {lang === "vi" ? "Không tìm thấy buổi học phù hợp." : "No matching sessions found."}
                  </p>
                </div>
              )}
            </div>
          ) : (
            /* ===== Sub-view B: Single Session Details (Nội dung bài học & Bài tập về nhà) ===== */
            <div>
              {/* Session Header Card with Next/Prev navigation */}
              <div className="bg-gradient-to-r from-white/95 via-white/90 to-pink-50/90 backdrop-blur-xl rounded-3xl p-5 md:p-6 border border-[#8a5b61]/15 shadow-sm mb-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#8a5b61]/10 border border-[#8a5b61]/20 text-[#8a5b61] text-xs font-bold mb-2">
                      <BookMarked className="w-3.5 h-3.5 text-[#8a5b61]" />
                      <span>{lang === "vi" ? "Khóa học N4" : "N4 Course"}</span>
                      <span className="w-1 h-1 rounded-full bg-[#8a5b61]" />
                      <span>{lang === "vi" ? `Tiến độ: ${selectedSession}/42 buổi` : `Progress: ${selectedSession}/42 sessions`}</span>
                    </div>

                    <h1 className="font-serif text-2xl md:text-3xl font-black text-[#8a5b61] tracking-wide flex items-center gap-3">
                      <span>{lang === "vi" ? `Buổi ${selectedSession}` : `Session ${selectedSession}`}</span>
                      {selectedSession === 1 || selectedSession === 2 ? (
                        <span className="text-xs font-sans font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-800 border border-emerald-500/30 flex items-center gap-1 shadow-2xs">
                          <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                          <span>{lang === "vi" ? "Đã sẵn sàng học" : "Ready to study"}</span>
                        </span>
                      ) : (
                        <span className="text-xs font-sans font-bold px-2.5 py-0.5 rounded-full bg-amber-500/15 text-amber-800 border border-amber-500/30">
                          {t.coursesUpdating}
                        </span>
                      )}
                    </h1>
                  </div>

                  {/* Previous / Next buttons */}
                  <div className="flex items-center gap-2 self-stretch sm:self-auto justify-between sm:justify-end">
                    <button
                      disabled={selectedSession <= 1}
                      onClick={() => setSelectedSession((prev) => (prev ? Math.max(1, prev - 1) : 1))}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold font-sans flex items-center gap-1 transition-all ${
                        selectedSession <= 1
                          ? "opacity-40 cursor-not-allowed bg-gray-100 text-gray-400"
                          : "bg-white/80 hover:bg-white text-[#8a5b61] border border-pink-200/60 shadow-2xs cursor-pointer active:scale-95"
                      }`}
                    >
                      <ChevronLeft className="w-3.5 h-3.5" />
                      <span>{t.prevSession}</span>
                    </button>

                    <button
                      disabled={selectedSession >= n4TotalSessions}
                      onClick={() => setSelectedSession((prev) => (prev ? Math.min(n4TotalSessions, prev + 1) : n4TotalSessions))}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold font-sans flex items-center gap-1 transition-all ${
                        selectedSession >= n4TotalSessions
                          ? "opacity-40 cursor-not-allowed bg-gray-100 text-gray-400"
                          : "bg-[#8a5b61] hover:bg-[#744b50] text-white shadow-2xs cursor-pointer active:scale-95"
                      }`}
                    >
                      <span>{t.nextSession}</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Filter tabs: Nội dung bài học, Từ vựng, Bài tập về nhà */}
                <div className="flex items-center gap-2 mt-5 pt-4 border-t border-gray-100">
                  <button
                    onClick={() => setActiveSessionTab("lesson")}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold font-sans transition-all cursor-pointer flex items-center gap-1.5 ${
                      activeSessionTab === "lesson"
                        ? "bg-[#8a5b61] text-white shadow-xs"
                        : "bg-white/70 text-[#8a5b61] hover:bg-white border border-pink-100"
                    }`}
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>{t.lessonContent}</span>
                    {selectedSession === 2 && (
                      <span className="text-[10px] bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded-full font-medium ml-0.5">
                        Chờ mai cập nhật
                      </span>
                    )}
                  </button>

                  <button
                    onClick={() => setActiveSessionTab("vocab")}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold font-sans transition-all cursor-pointer flex items-center gap-1.5 ${
                      activeSessionTab === "vocab"
                        ? "bg-[#8a5b61] text-white shadow-xs"
                        : "bg-white/70 text-[#8a5b61] hover:bg-white border border-pink-100"
                    }`}
                  >
                    <Layers className="w-3.5 h-3.5" />
                    <span>
                      {lang === "vi"
                        ? selectedSession === 1
                          ? "Từ vựng (143 từ)"
                          : selectedSession === 2
                          ? "Từ vựng (129 từ)"
                          : "Từ vựng"
                        : "Vocabulary"}
                    </span>
                  </button>

                  <button
                    onClick={() => setActiveSessionTab("homework")}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold font-sans transition-all cursor-pointer flex items-center gap-1.5 ${
                      activeSessionTab === "homework"
                        ? "bg-[#8a5b61] text-white shadow-xs"
                        : "bg-white/70 text-[#8a5b61] hover:bg-white border border-pink-100"
                    }`}
                  >
                    <Pencil className="w-3.5 h-3.5" />
                    <span>{t.homework}</span>
                  </button>
                </div>
              </div>

              {/* Sections Container */}
              {selectedSession === 1 ? (
                <N4Lesson1View lang={lang} activeTab={activeSessionTab} />
              ) : selectedSession === 2 ? (
                <N4Lesson2View lang={lang} activeTab={activeSessionTab} />
              ) : (
                <div className="space-y-6">
                  {/* 1. MỤC: NỘI DUNG BÀI HỌC */}
                  {(activeSessionTab === "both" || activeSessionTab === "lesson") && (
                    <div className="bg-white/85 backdrop-blur-md rounded-3xl p-5 md:p-7 border border-pink-100 shadow-sm transition-all">
                      {/* Header of Section */}
                      <div className="flex flex-wrap items-center justify-between gap-2 pb-4 mb-4 border-b border-pink-100/70">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-2xl bg-[#8a5b61]/10 text-[#8a5b61] flex items-center justify-center font-bold">
                            <BookOpen className="w-5 h-5 text-[#8a5b61]" />
                          </div>
                          <div>
                            <h2 className="font-serif font-bold text-lg md:text-xl text-[#8a5b61]">
                              {t.lessonContent}
                            </h2>
                            <p className="text-xs text-gray-500 font-sans">
                              {lang === "vi"
                                ? `Giáo trình, video bài giảng và kiến thức trọng điểm của Buổi ${selectedSession}`
                                : `Textbook, lecture videos, and core focus for Session ${selectedSession}`}
                            </p>
                          </div>
                        </div>

                        <span className="text-[11px] font-bold font-sans px-3 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200 flex items-center gap-1.5 shadow-2xs">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                          {t.coursesUpdating}
                        </span>
                      </div>

                      {/* Content Placeholder Box */}
                      <div className="bg-gradient-to-br from-amber-50/50 via-white to-pink-50/30 rounded-2xl p-6 border border-amber-200/50 text-center relative overflow-hidden">
                        <div className="w-12 h-12 mx-auto mb-3 rounded-2xl bg-amber-100/60 text-amber-700 flex items-center justify-center shadow-inner">
                          <Clock className="w-6 h-6 animate-pulse" />
                        </div>

                        <h3 className="font-serif font-black text-base text-[#8a5b61] mb-1.5">
                          {lang === "vi"
                            ? `Nội dung Buổi ${selectedSession} đang được cập nhật`
                            : `Session ${selectedSession} Content Coming Soon`}
                        </h3>
                        <p className="text-xs text-gray-600 font-sans max-w-lg mx-auto mb-5 leading-relaxed">
                          {t.sessionContentUpdatingNotice}
                        </p>

                        {/* Editorial Outline Structure */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 max-w-3xl mx-auto text-left">
                          <div className="bg-white/80 p-3 rounded-xl border border-pink-100 text-xs shadow-2xs">
                            <div className="font-bold text-[#8a5b61] mb-1 flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#8a5b61]" />
                              {lang === "vi" ? "1. Ngữ pháp & Mẫu câu" : "1. Grammar Patterns"}
                            </div>
                            <span className="text-gray-400 text-[11px]">{t.coursesUpdating}</span>
                          </div>

                          <div className="bg-white/80 p-3 rounded-xl border border-pink-100 text-xs shadow-2xs">
                            <div className="font-bold text-[#8a5b61] mb-1 flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#8a5b61]" />
                              {lang === "vi" ? "2. Từ vựng & Kanji" : "2. Vocab & Kanji"}
                            </div>
                            <span className="text-gray-400 text-[11px]">{t.coursesUpdating}</span>
                          </div>

                          <div className="bg-white/80 p-3 rounded-xl border border-pink-100 text-xs shadow-2xs">
                            <div className="font-bold text-[#8a5b61] mb-1 flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#8a5b61]" />
                              {lang === "vi" ? "3. Video bài giảng" : "3. Lecture Video"}
                            </div>
                            <span className="text-gray-400 text-[11px]">{t.coursesUpdating}</span>
                          </div>

                          <div className="bg-white/80 p-3 rounded-xl border border-pink-100 text-xs shadow-2xs">
                            <div className="font-bold text-[#8a5b61] mb-1 flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#8a5b61]" />
                              {lang === "vi" ? "4. Hội thoại & Audio" : "4. Kaiwa & Audio"}
                            </div>
                            <span className="text-gray-400 text-[11px]">{t.coursesUpdating}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* 2. MỤC: BÀI TẬP VỀ NHÀ */}
                  {(activeSessionTab === "both" || activeSessionTab === "homework") && (
                    <div className="bg-white/85 backdrop-blur-md rounded-3xl p-5 md:p-7 border border-pink-100 shadow-sm transition-all">
                      {/* Header of Section */}
                      <div className="flex flex-wrap items-center justify-between gap-2 pb-4 mb-4 border-b border-pink-100/70">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-2xl bg-[#c99fa5]/20 text-[#8a5b61] flex items-center justify-center font-bold">
                            <Pencil className="w-5 h-5 text-[#8a5b61]" />
                          </div>
                          <div>
                            <h2 className="font-serif font-bold text-lg md:text-xl text-[#8a5b61]">
                              {t.homework}
                            </h2>
                            <p className="text-xs text-gray-500 font-sans">
                              {lang === "vi"
                                ? `Phiếu bài tập củng cố, trắc nghiệm và luyện dịch cho Buổi ${selectedSession}`
                                : `Practice assignments, quizzes, and exercises for Session ${selectedSession}`}
                            </p>
                          </div>
                        </div>

                        <span className="text-[11px] font-bold font-sans px-3 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200 flex items-center gap-1.5 shadow-2xs">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                          {t.coursesUpdating}
                        </span>
                      </div>

                      {/* Content Placeholder Box */}
                      <div className="bg-gradient-to-br from-pink-50/40 via-white to-amber-50/40 rounded-2xl p-6 border border-pink-200/50 text-center relative overflow-hidden">
                        <div className="w-12 h-12 mx-auto mb-3 rounded-2xl bg-[#8a5b61]/10 text-[#8a5b61] flex items-center justify-center shadow-inner">
                          <FileText className="w-6 h-6 animate-pulse" />
                        </div>

                        <h3 className="font-serif font-black text-base text-[#8a5b61] mb-1.5">
                          {lang === "vi"
                            ? `Bài tập về nhà Buổi ${selectedSession} đang được cập nhật`
                            : `Session ${selectedSession} Homework Coming Soon`}
                        </h3>
                        <p className="text-xs text-gray-600 font-sans max-w-lg mx-auto mb-5 leading-relaxed">
                          {t.homeworkUpdatingNotice}
                        </p>

                        {/* Homework Tasks Breakdown */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-2xl mx-auto text-left">
                          <div className="bg-white/80 p-3.5 rounded-xl border border-pink-100 text-xs shadow-2xs">
                            <div className="font-bold text-[#8a5b61] mb-1 flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#8a5b61]" />
                              {lang === "vi" ? "Trắc nghiệm ôn tập" : "Review Quizzes"}
                            </div>
                            <p className="text-gray-500 text-[11px] mb-1">
                              {lang === "vi" ? "15 câu trắc nghiệm ngữ pháp & từ vựng" : "15 questions"}
                            </p>
                            <span className="text-amber-700 font-medium text-[10px]">{t.coursesUpdating}</span>
                          </div>

                          <div className="bg-white/80 p-3.5 rounded-xl border border-pink-100 text-xs shadow-2xs">
                            <div className="font-bold text-[#8a5b61] mb-1 flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#8a5b61]" />
                              {lang === "vi" ? "Bài tập dịch câu" : "Translation Drill"}
                            </div>
                            <p className="text-gray-500 text-[11px] mb-1">
                              {lang === "vi" ? "Luyện dịch Việt - Nhật & Nhật - Việt" : "Sentence practice"}
                            </p>
                            <span className="text-amber-700 font-medium text-[10px]">{t.coursesUpdating}</span>
                          </div>

                          <div className="bg-white/80 p-3.5 rounded-xl border border-pink-100 text-xs shadow-2xs">
                            <div className="font-bold text-[#8a5b61] mb-1 flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#8a5b61]" />
                              {lang === "vi" ? "Đáp án & Lời giải" : "Detailed Solutions"}
                            </div>
                            <p className="text-gray-500 text-[11px] mb-1">
                              {lang === "vi" ? "Giải thích chi tiết từng câu" : "Step-by-step notes"}
                            </p>
                            <span className="text-amber-700 font-medium text-[10px]">{t.coursesUpdating}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      ) : (
        /* ================= Phase 3: Other Levels (N5, N3, N2, N1 - Đang cập nhật) ================= */
        <div className="max-w-4xl mx-auto px-4 py-4 md:py-8">
          {/* Top navigation */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
            <button
              onClick={() => setSelectedLevel(null)}
              className="text-xs font-sans font-bold text-[#8a5b61] bg-white/60 hover:bg-white/80 backdrop-blur-2xl border border-pink-200/50 px-4 py-2 rounded-full transition-all cursor-pointer shadow-sm flex items-center gap-1.5 active:scale-95"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>{t.backToLevelSelect}</span>
            </button>

            {/* Quick level switcher */}
            <div className="flex items-center bg-white/50 backdrop-blur-md p-1 rounded-full border border-pink-200/50 shadow-2xs gap-1">
              {["N5", "N4", "N3", "N2", "N1"].map((lvl) => (
                <button
                  key={lvl}
                  onClick={() => {
                    setSelectedLevel(lvl);
                    setSelectedSession(null);
                  }}
                  className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                    selectedLevel === lvl
                      ? "bg-[#8a5b61] text-white shadow-xs"
                      : "text-[#8a5b61] hover:bg-white/50"
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>
          </div>

          {/* Level Header with Under Development Card */}
          <div className="bg-white/85 backdrop-blur-xl rounded-3xl p-6 md:p-10 border border-pink-100 shadow-sm text-center relative overflow-hidden">
            <div className="w-24 h-32 mx-auto mb-4 flex items-center justify-center filter drop-shadow-md">
              <img
                src={bookImages[selectedLevel]}
                alt={`Sách ${selectedLevel}`}
                className="max-h-full max-w-full object-contain"
              />
            </div>

            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-800 text-xs font-bold mb-3">
              <Clock className="w-3.5 h-3.5 text-amber-600 animate-pulse" />
              <span>{t.coursesUpdating}</span>
            </div>

            <h1 className="font-serif text-2xl md:text-3xl font-black text-[#8a5b61] tracking-wide mb-2">
              {lang === "vi" ? `KHÓA HỌC TIẾNG NHẬT ${selectedLevel}` : `${selectedLevel} JAPANESE COURSE`}
            </h1>

            <p className="text-xs md:text-sm text-gray-600 font-sans leading-relaxed max-w-md mx-auto mb-6">
              {t.levelUnderDevelopmentNotice}
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={() => {
                  setSelectedLevel("N4");
                  setSelectedSession(null);
                }}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#8a5b61] hover:bg-[#744b50] text-white font-sans font-bold text-xs shadow-md transition-all cursor-pointer active:scale-95 flex items-center justify-center gap-1.5"
              >
                <GraduationCap className="w-4 h-4" />
                <span>{t.switchToN4}</span>
              </button>

              <button
                onClick={() => setSelectedLevel(null)}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-white hover:bg-white/90 text-[#8a5b61] border border-pink-200 font-sans font-bold text-xs shadow-xs transition-all cursor-pointer active:scale-95"
              >
                {t.backToLevelSelect}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
