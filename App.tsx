import { useState, useEffect } from "react";
import { Header } from "./components/Header";
import { JLPTDashboard } from "./components/JLPTDashboard";
import { BJTDashboard } from "./components/BJTDashboard";
import { CourseDashboard } from "./components/CourseDashboard";
import { motion, AnimatePresence } from "motion/react";
import { GraduationCap, ArrowRight, Heart, ShieldAlert, BookOpen } from "lucide-react";
import { translations } from "./lib/translations";

// ==========================================
// TÍNH NĂNG BẢO VỆ BẢN QUYỀN (EMICHAN COPYRIGHT PROTECTION)
// ==========================================
// Bao gồm: Chặn copy (Ctrl+C), chặn bôi đen, chặn in ấn/xuất PDF, chặn chuột phải, chặn phím tắt DevTools, và đóng dấu Watermark khi chụp màn hình.
// Đặt thành "true" để kích hoạt toàn bộ bảo vệ, "false" để tạm thời tắt đi giúp dễ dàng thao tác trong quá trình xây dựng web.
const ENABLE_COPY_PROTECTION = false;

export default function App() {
  const [lang, setLang] = useState<"vi" | "en">(() => {
    if (typeof window !== "undefined") {
      return (localStorage.getItem("emichan_lang") as "vi" | "en") || "vi";
    }
    return "vi";
  });
  const [currentScreen, setCurrentScreen] = useState<"home" | "jlpt" | "bjt" | "courses">("home");
  const [isMobileOrTablet, setIsMobileOrTablet] = useState(false);
  const [selectedLevel, setSelectedLevel] = useState<string | null>(null);
  const [hoveredLevel, setHoveredLevel] = useState<string | null>(null);
  const [isWatermarkActive, setIsWatermarkActive] = useState(false);
  const [securityToast, setSecurityToast] = useState<string | null>(null);

  const handleLangChange = (newLang: "vi" | "en") => {
    setLang(newLang);
    localStorage.setItem("emichan_lang", newLang);
  };

  const t = translations[lang];

  // Set up class copy-protection-active cho body để đồng bộ với cấu hình
  useEffect(() => {
    if (ENABLE_COPY_PROTECTION) {
      document.documentElement.classList.add("copy-protection-active");
      document.body.classList.add("copy-protection-active");
    } else {
      document.documentElement.classList.remove("copy-protection-active");
      document.body.classList.remove("copy-protection-active");
    }
  }, []);

  // Set up security & anti-copy / anti-screenshot protections
  useEffect(() => {
    if (!ENABLE_COPY_PROTECTION) return;

    // 1. Block right click
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      setSecurityToast(
        lang === "vi"
          ? "Hệ thống Emichan đã chặn chuột phải để bảo vệ bản quyền!"
          : "Emichan system has blocked right-click to protect copyright!"
      );
    };

    // 2. Block shortcut keys: Ctrl+C, Ctrl+U, F12, developer utilities
    const handleKeyDown = (e: KeyboardEvent) => {
      const isMac = typeof window !== "undefined" && navigator.platform.toUpperCase().indexOf("MAC") >= 0;
      const cmdOrCtrl = isMac ? e.metaKey : e.ctrlKey;

      // Ctrl + C / Cmd + C (Copy)
      if (cmdOrCtrl && (e.key === "c" || e.key === "C")) {
        e.preventDefault();
        setSecurityToast(
          lang === "vi"
            ? "Tính năng sao chép nội dung đã được khóa để bảo vệ bản quyền!"
            : "Content copying has been disabled to protect copyright!"
        );
        return;
      }

      // Ctrl + U / Cmd + U (View Source)
      if (cmdOrCtrl && (e.key === "u" || e.key === "U")) {
        e.preventDefault();
        setSecurityToast(
          lang === "vi"
            ? "Tính năng xem mã nguồn trang đã bị khóa!"
            : "Viewing page source code has been disabled!"
        );
        return;
      }

      // F12 (Developer tools)
      if (e.key === "F12") {
        e.preventDefault();
        setSecurityToast(
          lang === "vi"
            ? "Tính năng kiểm tra mã nguồn (DevTools) đã bị khóa!"
            : "DevTools inspection has been disabled!"
        );
        return;
      }

      // Ctrl+Shift+I / Ctrl+Shift+C / Ctrl+Shift+J
      if (cmdOrCtrl && e.shiftKey && (e.key === "i" || e.key === "I" || e.key === "c" || e.key === "C" || e.key === "j" || e.key === "J")) {
        e.preventDefault();
        setSecurityToast(
          lang === "vi"
            ? "Phím tắt nhà phát triển đã bị khóa!"
            : "Developer shortcuts have been disabled!"
        );
        return;
      }

      // PrintScreen key
      if (e.key === "PrintScreen") {
        e.preventDefault();
        setIsWatermarkActive(true);
        setSecurityToast(
          lang === "vi"
            ? "Phát hiện phím PrintScreen! Watermark bản quyền đã được kích hoạt."
            : "PrintScreen detected! Copyright watermark has been activated."
        );
        return;
      }
    };

    // 3. Detect screenshot utilities via browser blur/focus
    const handleBlur = () => {
      // Show protective watermark when window loses focus (triggers screenshot utility, snipping tool, or tab switch)
      setIsWatermarkActive(true);
    };

    const handleFocus = () => {
      // Leave watermark visible for a brief moment to ensure screenshot outputs capture the watermark, then fade it out
      const timer = setTimeout(() => {
        setIsWatermarkActive(false);
      }, 2500);
      return () => clearTimeout(timer);
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        setIsWatermarkActive(true);
      }
    };

    window.addEventListener("contextmenu", handleContextMenu);
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("blur", handleBlur);
    window.addEventListener("focus", handleFocus);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.removeEventListener("contextmenu", handleContextMenu);
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("blur", handleBlur);
      window.removeEventListener("focus", handleFocus);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  // Clear security warning toast automatically
  useEffect(() => {
    if (securityToast) {
      const timer = setTimeout(() => {
        setSecurityToast(null);
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, [securityToast]);

  // Monitor screen size to apply responsive backgrounds & scale the girl image
  useEffect(() => {
    const handleResize = () => {
      setIsMobileOrTablet(window.innerWidth <= 1024);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Background URL based on device width & active screen
  const backgroundUrl = currentScreen === "bjt"
    ? "https://i.postimg.cc/ryR5sxMB/nền_BJT.png"
    : (isMobileOrTablet
      ? "https://i.postimg.cc/tgk5zvpg/Gemini-Generated-Image-htkzychtkzychtkz.png"
      : "https://i.postimg.cc/N0HNQjkR/anh-nen-man-hinh-may-tinh.png");

  const handleHomeClick = () => {
    setCurrentScreen("home");
  };

  return (
    <div
      className="min-h-screen flex flex-col relative transition-all duration-500 bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: `url('${backgroundUrl}')`,
        backgroundAttachment: isMobileOrTablet ? "scroll" : "fixed",
      }}
    >
      {/* Decorative overlay for better content readability on top of watercolor background */}
      <div className="absolute inset-0 bg-white/20 pointer-events-none" />

      {/* Elegant Header */}
      <Header onHomeClick={handleHomeClick} currentScreen={currentScreen} lang={lang} onLangChange={handleLangChange} />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col items-center justify-center relative z-10 pb-20">
        <AnimatePresence mode="wait">
          {currentScreen === "home" && (
            <motion.div
              key="home"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col items-center justify-center gap-6 p-4 text-center mt-12 md:mt-16 w-full max-w-md"
            >
              {/* Stacked Selection Buttons exactly matching the user's design image */}
              <div className="flex flex-col gap-5 w-full px-4">
                {/* JLPT Button */}
                <button
                  onClick={() => setCurrentScreen("jlpt")}
                  className="w-full h-24 md:h-28 bg-[#c99fa5] hover:bg-[#b88c92] text-white font-sans font-bold text-3xl md:text-4xl shadow-md transition-all duration-300 rounded-lg flex items-center justify-center hover:scale-102 active:scale-98 relative group overflow-hidden border border-pink-200 cursor-pointer"
                >
                  <span className="tracking-wider group-hover:tracking-widest transition-all">
                    JLPT
                  </span>
                  {/* Subtle hover icon */}
                  <div className="absolute right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <GraduationCap className="w-6 h-6 text-white/40" />
                  </div>
                </button>

                {/* BJT Button */}
                <button
                  onClick={() => setCurrentScreen("bjt")}
                  className="w-full h-24 md:h-28 bg-[#c99fa5] hover:bg-[#b88c92] text-white font-sans font-bold text-3xl md:text-4xl shadow-md transition-all duration-300 rounded-lg flex items-center justify-center hover:scale-102 active:scale-98 relative group overflow-hidden border border-pink-200 cursor-pointer"
                >
                  <span className="tracking-wider group-hover:tracking-widest transition-all">
                    BJT
                  </span>
                  {/* Subtle hover icon */}
                  <div className="absolute right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <ArrowRight className="w-6 h-6 text-white/40" />
                  </div>
                </button>

                {/* Khóa học Button */}
                <button
                  onClick={() => setCurrentScreen("courses")}
                  className="w-full h-24 md:h-28 bg-[#c99fa5] hover:bg-[#b88c92] text-white font-sans font-bold text-3xl md:text-4xl shadow-md transition-all duration-300 rounded-lg flex items-center justify-center hover:scale-102 active:scale-98 relative group overflow-hidden border border-pink-200 cursor-pointer"
                >
                  <span className="tracking-wider group-hover:tracking-widest transition-all">
                    {lang === "vi" ? "Khóa học" : "Courses"}
                  </span>
                  {/* Subtle hover icon */}
                  <div className="absolute right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <BookOpen className="w-6 h-6 text-white/40" />
                  </div>
                </button>
              </div>
            </motion.div>
          )}

          {currentScreen === "jlpt" && (
            <motion.div
              key="jlpt"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="w-full overflow-visible"
            >
              {selectedLevel === null ? (
                /* Phase 1: Level Selection Screen */
                <div className="max-w-4xl mx-auto px-4 py-4 md:py-8">
                  {/* Back button to Home */}
                  <div className="flex items-center justify-start mb-6">
                    <button
                      onClick={handleHomeClick}
                      className="text-xs font-sans font-bold text-[#8a5b61] bg-white/40 hover:bg-white/60 backdrop-blur-2xl border border-pink-200/50 px-4 py-2 rounded-full transition-all cursor-pointer shadow-sm flex items-center gap-1.5"
                    >
                      ← <span>{t.backToHome}</span>
                    </button>
                  </div>

                  {/* Prominent centered books display */}
                  <div className="text-center mb-1">
                    <h2 className="font-serif text-2xl md:text-3xl font-black text-[#8a5b61] tracking-wide mb-1">
                      {t.selectLevelTitle}
                    </h2>
                    <p className="text-xs text-gray-500 font-sans">
                      {t.selectLevelSubtitle}
                    </p>
                  </div>

                  {/* Centered Book display, beautifully responsive */}
                  {(() => {
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

                    const renderBookButton = (lvl: string, isMobileSize: boolean) => {
                      const isHovered = hoveredLevel === lvl;
                      const baseScale = isMobileSize ? 1.05 : baseScales[lvl];
                      const scaleVal = isHovered ? baseScale * 1.15 : baseScale;
                      
                      // Keep rows beautifully aligned on mobile, use subtle floating on desktop
                      let translateY = "0%";
                      if (isMobileSize) {
                        if (lvl === "N5") {
                          translateY = "-5%"; // Gently shift N5 up to align perfectly with N4
                        }
                      } else {
                        if (lvl === "N4") {
                          translateY = "6%";
                        }
                      }

                      return (
                        <button
                          key={lvl}
                          onClick={() => setSelectedLevel(lvl)}
                          onMouseEnter={() => setHoveredLevel(lvl)}
                          onMouseLeave={() => setHoveredLevel(null)}
                          className={`relative transition-all duration-300 ease-out cursor-pointer outline-none focus:outline-none select-none border-0 bg-transparent opacity-95 hover:opacity-100 hover:z-10 filter drop-shadow-xl ${
                            isMobileSize
                              ? "w-[95px] h-[128px]" // Gorgeous, big size on mobile!
                              : "w-[90px] h-[121px] md:w-[120px] md:h-[162px] lg:w-[130px] lg:h-[175px]"
                          }`}
                          style={{
                            backgroundImage: `url('${bookImages[lvl]}')`,
                            backgroundSize: "contain",
                            backgroundPosition: "center",
                            backgroundRepeat: "no-repeat",
                            transform: `scale(${scaleVal}) translateY(${translateY})`,
                          }}
                          title={`Cấp độ ${lvl}`}
                        />
                      );
                    };

                    return (
                      <div className="flex flex-col items-center justify-center select-none overflow-visible py-3 sm:py-6 md:py-8">
                        {/* Mobile view: N5 & N4 on top, N3, N2, N1 below */}
                        <div className="flex sm:hidden flex-col items-center gap-3 w-full">
                          <div className="flex justify-center gap-6 w-full">
                            {["N5", "N4"].map((lvl) => renderBookButton(lvl, true))}
                          </div>
                          <div className="flex justify-center gap-4 w-full">
                            {["N3", "N2", "N1"].map((lvl) => renderBookButton(lvl, true))}
                          </div>
                        </div>

                        {/* Desktop view: single responsive row */}
                        <div className="hidden sm:flex items-center justify-center gap-5 md:gap-8 overflow-visible min-h-[140px] sm:min-h-[200px] w-full">
                          {["N5", "N4", "N3", "N2", "N1"].map((lvl) => renderBookButton(lvl, false))}
                        </div>
                      </div>
                    );
                  })()}

                  {/* Brief, elegant explanation of curriculum, learning method, and unlocking */}
                  <div className="bg-white/45 backdrop-blur-3xl rounded-2xl p-4 md:p-6 border border-pink-100/45 shadow-sm max-w-2xl mx-auto mt-2.5">
                    <h3 className="font-sans font-bold text-xs text-[#8a5b61] uppercase tracking-wider mb-4 border-b border-pink-200/20 pb-2 text-center">
                      {t.guideTitle}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-left">
                      <div className="space-y-1">
                        <div className="text-xs font-bold text-pink-700 flex items-center gap-1.5">
                          <span>{t.route12Ch}</span>
                        </div>
                        <p className="text-[11px] text-gray-600 font-sans leading-relaxed">
                          {t.route12ChDesc}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <div className="text-xs font-bold text-pink-700 flex items-center gap-1.5">
                          <span>{t.scientificMethod}</span>
                        </div>
                        <p className="text-[11px] text-gray-600 font-sans leading-relaxed">
                          {t.scientificMethodDesc}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <div className="text-xs font-bold text-pink-700 flex items-center gap-1.5">
                          <span>{t.unlockCondition}</span>
                        </div>
                        <p className="text-[11px] text-gray-600 font-sans leading-relaxed">
                          {t.unlockConditionDesc}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                /* Phase 2: Selected Level Dashboard with 12 Chapters list and details screen */
                <div>
                  <JLPTDashboard 
                    selectedLevel={selectedLevel} 
                    setSelectedLevel={setSelectedLevel} 
                    onBackToLevels={() => setSelectedLevel(null)} 
                    lang={lang}
                  />
                </div>
              )}
            </motion.div>
          )}

          {currentScreen === "bjt" && (
            <motion.div
              key="bjt"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="w-full"
            >
              <div className="max-w-5xl mx-auto pt-4 px-4 mb-2 flex items-center justify-between">
                <button
                  onClick={handleHomeClick}
                  className="text-xs font-sans font-bold text-[#8a5b61] bg-white/15 hover:bg-white/35 backdrop-blur-2xl border border-pink-200/30 px-4 py-1.5 rounded-full transition-all cursor-pointer shadow-sm"
                >
                  ← {t.back}
                </button>
              </div>
              <BJTDashboard lang={lang} />
            </motion.div>
          )}

          {currentScreen === "courses" && (
            <motion.div
              key="courses"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="w-full overflow-visible"
            >
              <CourseDashboard onBackToHome={handleHomeClick} lang={lang} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer copyright claims */}
      <footer className="w-full py-4 text-center mt-auto relative z-30 select-none">
        <p className="text-[11px] font-sans font-bold text-[#8a5b61]/70 tracking-wide">
          © 1/7/2026 Emichan. All rights reserved.
        </p>
      </footer>

      {/* FIXED GIRL IMAGE AT BOTTOM-LEFT */}
      {/* Clinically styled and responsive so she scales down perfectly on mobile/tablet without covering content */}
      <div className="fixed bottom-0 left-0 z-40 pointer-events-none select-none max-w-[240px] md:max-w-[340px] w-[20%] min-w-[85px] transition-all duration-300">
        <img
          src={
            currentScreen === "bjt"
              ? "https://i.postimg.cc/SR99PFgX/cô_gái_BJT.png"
              : "https://i.postimg.cc/YCnG2CLc/ảnh_cô_gái_cố_định_bên_trái_góc_dưới.png"
          }
          alt="Cô gái học tập"
          className="w-full h-auto object-contain filter drop-shadow-md animate-fade-in"
          referrerPolicy="no-referrer"
        />
      </div>

      {/* Permanent background watermark for Logo 1 */}
      {ENABLE_COPY_PROTECTION && (
        <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-0 overflow-hidden select-none opacity-[0.03]">
          <img
            src="https://i.postimg.cc/ZKLvgcJ1/logo1.png"
            alt="Emichan Watermark background"
            className="w-80 h-auto object-contain scale-150 rotate-[-12deg]"
            referrerPolicy="no-referrer"
          />
        </div>
      )}

      {/* Screen-capture suspected Watermark overlay */}
      <AnimatePresence>
        {ENABLE_COPY_PROTECTION && isWatermarkActive && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 bg-[#fbf8f8]/80 backdrop-blur-md z-[9999] pointer-events-none flex flex-col items-center justify-center p-4 text-center select-none"
          >
            <div className="max-w-md p-6 bg-white border border-[#8a5b61]/20 rounded-2xl shadow-xl flex flex-col items-center justify-center gap-4 relative overflow-hidden">
              {/* Center Watermark Logo */}
              <img
                src="https://i.postimg.cc/ZKLvgcJ1/logo1.png"
                alt="Emichan Watermark"
                className="w-40 h-auto object-contain opacity-50 select-none animate-pulse"
                referrerPolicy="no-referrer"
              />
              <div className="space-y-1.5">
                <h3 className="font-serif text-[#8a5b61] font-black text-lg tracking-wide uppercase">
                  {lang === "vi" ? "Bảo vệ bản quyền Emichan" : "Emichan Copyright Protection"}
                </h3>
                <p className="text-[11px] text-gray-500 font-sans leading-relaxed">
                  {lang === "vi"
                    ? "Giáo trình tiếng Nhật Emichan đã kích hoạt đóng dấu bảo mật chống sao chép và ghi hình trái phép. Vui lòng tắt các ứng dụng chụp ảnh màn hình để tiếp tục học tập."
                    : "The Emichan Japanese curriculum has activated security watermarks to protect against unauthorized copying and recording. Please close screenshot tools to continue learning."}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Custom elegant toast notifications for blocked actions */}
      <AnimatePresence>
        {securityToast && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 350, damping: 25 }}
            className="fixed bottom-6 right-6 z-[10000] max-w-sm w-full bg-white border-l-4 border-[#8a5b61] shadow-2xl rounded-r-xl p-4 flex items-start gap-3 pointer-events-auto select-none"
          >
            <div className="bg-[#8a5b61]/10 p-2 rounded-lg text-[#8a5b61] shrink-0">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-sans font-bold text-xs text-gray-900">
                {lang === "vi" ? "Thông báo bảo mật" : "Security Notification"}
              </h4>
              <p className="text-[11px] text-gray-500 font-sans mt-0.5 leading-snug">{securityToast}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
