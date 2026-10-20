import React from "react";

interface HeaderProps {
  onHomeClick: () => void;
  currentScreen?: "home" | "jlpt" | "bjt" | "courses";
  lang: "vi" | "en";
  onLangChange: (lang: "vi" | "en") => void;
}

export const Header: React.FC<HeaderProps> = ({ onHomeClick, currentScreen, lang, onLangChange }) => {
  const isBJT = currentScreen === "bjt";
  const headerBg = isBJT ? "bg-[#e2d2ae]" : "bg-[#f3d5d9]";
  const headerBorder = isBJT ? "border-amber-200/40" : "border-pink-200";

  return (
    <header className={`w-full h-16 ${headerBg} px-4 md:px-8 flex items-center justify-between shadow-sm z-50 sticky top-0 border-b ${headerBorder} transition-colors duration-300`}>
      {/* Brand Logos */}
      <div className="flex items-center gap-0 cursor-pointer" onClick={onHomeClick}>
        <img
          src="https://i.postimg.cc/ZKLvgcJ1/logo1.png"
          alt="Emichan Logo 1"
          className="h-16 object-contain"
          referrerPolicy="no-referrer"
        />
        <img
          src="https://i.postimg.cc/7YNJcVqd/logo2.png"
          alt="Emichan Logo 2"
          className="h-11 object-contain"
          referrerPolicy="no-referrer"
        />
      </div>

      {/* Elegant Language Switcher & Home Button with optional Screen label */}
      <div className="flex items-center gap-2 sm:gap-4">
        {currentScreen && currentScreen !== "home" && (
          <span className="font-sans font-black text-lg md:text-2xl text-white tracking-wider uppercase select-none drop-shadow-sm mr-1">
            {currentScreen === "courses" ? (lang === "vi" ? "Khóa học" : "Courses") : currentScreen}
          </span>
        )}

        {/* Elegant Pill Segmented Language Switcher */}
        <div className="flex items-center bg-white/50 backdrop-blur-md p-0.5 sm:p-1 rounded-full border border-white/40 shadow-sm text-[10px] sm:text-xs font-bold font-sans">
          <button
            onClick={() => onLangChange("vi")}
            className={`px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full transition-all cursor-pointer ${
              lang === "vi"
                ? "bg-[#8a5b61] text-white shadow-sm"
                : "text-[#8a5b61] hover:bg-white/35"
            }`}
          >
            VI
          </button>
          <button
            onClick={() => onLangChange("en")}
            className={`px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full transition-all cursor-pointer ${
              lang === "en"
                ? "bg-[#8a5b61] text-white shadow-sm"
                : "text-[#8a5b61] hover:bg-white/35"
            }`}
          >
            EN
          </button>
        </div>

        <button
          onClick={onHomeClick}
          className="transition-transform duration-200 hover:scale-105 active:scale-95 focus:outline-none"
          title={lang === "vi" ? "Trang chủ" : "Home"}
        >
          <img
            src="https://i.postimg.cc/tgk5zvy5/Nut-home.png"
            alt="Home Button"
            className="w-9 h-9 md:w-11 md:h-11 object-contain filter drop-shadow-sm hover:brightness-95"
            referrerPolicy="no-referrer"
          />
        </button>
      </div>
    </header>
  );
};
