import React, { useState } from "react";
import { BJT_KEIGO_VERBS, BJT_EMAILS, BJT_ETIQUETTE_SCENARIOS } from "../data/japaneseData";
import { motion, AnimatePresence } from "motion/react";
import { translations, getLocalizedText } from "../lib/translations";
import {
  Briefcase,
  Mail,
  Users,
  Eye,
  EyeOff,
  Copy,
  Check,
  Award,
  Compass,
  ArrowRight,
  UserCheck,
  CheckCircle2,
  HelpCircle
} from "lucide-react";

interface BJTDashboardProps {
  lang?: "vi" | "en";
}

export const BJTDashboard: React.FC<BJTDashboardProps> = ({ lang = "vi" }) => {
  const t = translations[lang];
  const [activeTab, setActiveTab] = useState<"keigo" | "emails" | "etiquette">("keigo");

  // Keigo Study active recall toggle
  const [hideSonkeigo, setHideSonkeigo] = useState(false);
  const [hideKenjougo, setHideKenjougo] = useState(false);
  const [revealedVerbs, setRevealedVerbs] = useState<Record<string, boolean>>({});

  // Email state
  const [selectedEmailIdx, setSelectedEmailIdx] = useState(0);
  const [copied, setCopied] = useState(false);
  const [emailLanguageTab, setEmailLanguageTab] = useState<"jp" | "vn">("jp");

  // Etiquette state
  const [quizAnswers, setQuizAnswers] = useState<Record<string, number>>({});
  const [submittedQuizzes, setSubmittedQuizzes] = useState<Record<string, boolean>>({});

  // Copy email action
  const handleCopyEmail = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const toggleRevealVerb = (verbId: string, type: "sonkeigo" | "kenjougo") => {
    const key = `${verbId}-${type}`;
    setRevealedVerbs((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleQuizAnswer = (scenarioId: string, optionIdx: number) => {
    if (submittedQuizzes[scenarioId]) return;
    setQuizAnswers((prev) => ({ ...prev, [scenarioId]: optionIdx }));
  };

  const handleQuizSubmit = (scenarioId: string) => {
    setSubmittedQuizzes((prev) => ({ ...prev, [scenarioId]: true }));
  };

  const handleResetQuiz = (scenarioId: string) => {
    setQuizAnswers((prev) => {
      const copy = { ...prev };
      delete copy[scenarioId];
      return copy;
    });
    setSubmittedQuizzes((prev) => {
      const copy = { ...prev };
      delete copy[scenarioId];
      return copy;
    });
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-6 md:py-8">
      {/* Sub tabs */}
      <div className="flex justify-center gap-1.5 md:gap-3 mb-6 flex-wrap">
        <button
          onClick={() => setActiveTab("keigo")}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm md:text-base transition-all duration-200 shadow-sm cursor-pointer ${
            activeTab === "keigo"
              ? "bg-gradient-to-r from-amber-400 to-[#bfa87a] text-white ring-2 ring-amber-200/50"
              : "bg-white/10 hover:bg-white/25 border border-amber-100/20 backdrop-blur-xl text-[#7a5a3a]"
          }`}
        >
          <Briefcase className="w-4 h-4" />
          <span>{lang === "vi" ? "Kính ngữ BJT (Keigo)" : "BJT Honorifics (Keigo)"}</span>
        </button>

        <button
          onClick={() => setActiveTab("emails")}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm md:text-base transition-all duration-200 shadow-sm cursor-pointer ${
            activeTab === "emails"
              ? "bg-gradient-to-r from-amber-400 to-[#bfa87a] text-white ring-2 ring-amber-200/50"
              : "bg-white/10 hover:bg-white/25 border border-amber-100/20 backdrop-blur-xl text-[#7a5a3a]"
          }`}
        >
          <Mail className="w-4 h-4" />
          <span>{lang === "vi" ? "Email Thương mại" : "Business Emails"}</span>
        </button>

        <button
          onClick={() => setActiveTab("etiquette")}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm md:text-base transition-all duration-200 shadow-sm cursor-pointer ${
            activeTab === "etiquette"
              ? "bg-gradient-to-r from-amber-400 to-[#bfa87a] text-white ring-2 ring-amber-200/50"
              : "bg-white/10 hover:bg-white/25 border border-amber-100/20 backdrop-blur-xl text-[#7a5a3a]"
          }`}
        >
          <Users className="w-4 h-4" />
          <span>{lang === "vi" ? "Nghi thức công sở Nhật" : "Japanese Business Etiquette"}</span>
        </button>
      </div>

      <AnimatePresence mode="wait">
        {/* 1. KEIGO TAB */}
        {activeTab === "keigo" && (
          <motion.div
            key="keigo"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            {/* Keigo Active Recall banner */}
            <div className="bg-white/10 backdrop-blur-2xl rounded-2xl p-4 md:p-6 border border-amber-100/20 shadow-sm">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-4">
                <div>
                  <h3 className="text-lg font-serif font-bold text-[#7a5a3a] flex items-center gap-1.5">
                    {lang === "vi" ? "Bảng Tra Kính Ngữ Công Sở Thường Gặp" : "Common Business Honorifics Reference Table"}
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">
                    {lang === "vi"
                      ? "Bật chế độ ẩn để tự luyện nhớ và phản xạ nhanh các thì tôn kính/khiêm nhường!"
                      : "Turn on hidden mode to self-practice and quickly recall respectful/humble forms!"}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2.5">
                  <button
                    onClick={() => setHideSonkeigo(!hideSonkeigo)}
                    className={`flex items-center gap-1 text-xs px-3.5 py-1.5 rounded-full border transition-all cursor-pointer ${
                      hideSonkeigo
                        ? "bg-amber-600 text-white border-amber-600 font-bold"
                        : "bg-white text-gray-600 hover:bg-amber-50/30 border-amber-200/40"
                    }`}
                  >
                    {hideSonkeigo ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    <span>{hideSonkeigo ? t.showSonkeigo : t.hideSonkeigo}</span>
                  </button>

                  <button
                    onClick={() => setHideKenjougo(!hideKenjougo)}
                    className={`flex items-center gap-1 text-xs px-3.5 py-1.5 rounded-full border transition-all cursor-pointer ${
                      hideKenjougo
                        ? "bg-amber-600 text-white border-amber-600 font-bold"
                        : "bg-white text-gray-600 hover:bg-amber-50/30 border-amber-200/40"
                    }`}
                  >
                    {hideKenjougo ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    <span>{hideKenjougo ? t.showKenjougo : t.hideKenjougo}</span>
                  </button>
                </div>
              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm border-collapse min-w-[600px]">
                  <thead>
                    <tr className="border-b border-amber-200/20 text-[#7a5a3a] font-semibold text-xs bg-amber-100/10">
                      <th className="py-3 px-3 w-[20%]">{t.verbCol}</th>
                      <th className="py-3 px-3 w-[25%]">{t.sonkeigoCol}</th>
                      <th className="py-3 px-3 w-[25%]">{t.kenjougoCol}</th>
                      <th className="py-3 px-3 w-[15%]">{t.teineigoCol}</th>
                      <th className="py-3 px-3 w-[15%]">{t.meaningCol}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {BJT_KEIGO_VERBS.map((verb) => {
                      const isSonkeigoHidden = hideSonkeigo && !revealedVerbs[`${verb.id}-sonkeigo`];
                      const isKenjougoHidden = hideKenjougo && !revealedVerbs[`${verb.id}-kenjougo`];

                      return (
                        <tr key={verb.id} className="border-b border-gray-100/50 hover:bg-amber-55/10 transition-colors">
                          <td className="py-3.5 px-3 font-bold font-sans text-gray-900">{getLocalizedText(verb.dictionary, lang)}</td>

                          {/* Sonkeigo cell */}
                          <td className="py-3.5 px-3">
                            {isSonkeigoHidden ? (
                              <button
                                onClick={() => toggleRevealVerb(verb.id, "sonkeigo")}
                                className="bg-amber-100/60 hover:bg-amber-200/60 text-[#7a5a3a] px-2.5 py-1 rounded text-[11px] font-bold border border-amber-200/30 flex items-center gap-1 transition-all cursor-pointer"
                              >
                                <Eye className="w-3 h-3" /> {getLocalizedText(t.clickToReveal, lang)}
                              </button>
                            ) : (
                              <div className="flex items-center justify-between gap-1.5">
                                <span className="text-amber-750 font-bold font-sans">{verb.sonkeigo}</span>
                                {hideSonkeigo && (
                                  <button
                                    onClick={() => toggleRevealVerb(verb.id, "sonkeigo")}
                                    className="text-gray-400 hover:text-gray-600 text-[10px] underline cursor-pointer"
                                  >
                                    {lang === "vi" ? "Ẩn" : "Hide"}
                                  </button>
                                )}
                              </div>
                            )}
                          </td>

                          {/* Kenjougo cell */}
                          <td className="py-3.5 px-3">
                            {isKenjougoHidden ? (
                              <button
                                onClick={() => toggleRevealVerb(verb.id, "kenjougo")}
                                className="bg-amber-100/60 hover:bg-amber-200/60 text-[#7a5a3a] px-2.5 py-1 rounded text-[11px] font-bold border border-amber-200/30 flex items-center gap-1 transition-all cursor-pointer"
                              >
                                <Eye className="w-3 h-3" /> {getLocalizedText(t.clickToReveal, lang)}
                              </button>
                            ) : (
                              <div className="flex items-center justify-between gap-1.5">
                                <span className="text-emerald-700 font-bold font-sans">{verb.kenjougo}</span>
                                {hideKenjougo && (
                                  <button
                                    onClick={() => toggleRevealVerb(verb.id, "kenjougo")}
                                    className="text-gray-400 hover:text-gray-600 text-[10px] underline cursor-pointer"
                                  >
                                    {lang === "vi" ? "Ẩn" : "Hide"}
                                  </button>
                                )}
                              </div>
                            )}
                          </td>

                          <td className="py-3.5 px-3 text-gray-700 font-sans">{verb.teineigo}</td>
                          <td className="py-3.5 px-3 text-xs text-gray-500 font-serif leading-tight">{getLocalizedText(verb.meaning, lang)}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Quick Grammar Lesson card */}
            <div className="bg-amber-50/10 border border-amber-200/20 rounded-2xl p-4 md:p-5 flex flex-col md:flex-row items-start gap-4">
              <div className="w-12 h-12 bg-amber-100/40 rounded-xl flex items-center justify-center shrink-0">
                <Compass className="w-6 h-6 text-amber-600" />
              </div>
              <div className="space-y-1.5 flex-1">
                <h4 className="font-serif font-bold text-[#7a5a3a] text-sm md:text-base">
                  {lang === "vi" ? "Mẹo phân biệt nhanh trong đề thi BJT:" : "Quick distinction tips in the BJT exam:"}
                </h4>
                <div className="text-xs text-gray-600 leading-relaxed space-y-1">
                  <p>
                    📌 <strong>{lang === "vi" ? "Tôn kính ngữ (尊敬語 - Sonkeigo):" : "Respectful language (尊敬語 - Sonkeigo):"}</strong> {lang === "vi" ? "Dùng khi nói về hành động của đối tác, khách hàng hoặc cấp trên nhằm tôn vinh họ lên." : "Used when talking about the actions of partners, clients, or superiors to honor them."}
                  </p>
                  <p>
                    📌 <strong>{lang === "vi" ? "Khiêm nhường ngữ (謙譲語 - Kenjougo):" : "Humble language (謙譲語 - Kenjougo):"}</strong> {lang === "vi" ? "Dùng khi nói về hành động của chính mình hoặc người thuộc công ty mình (Emichan) để hạ mình xuống trước đối tác." : "Used when talking about the actions of yourself or people in your company (Emichan) to humble yourself in front of partners."}
                  </p>
                  <p>
                    📌 {lang === "vi" ? "Trong kỳ thi BJT, việc nhầm lẫn chủ ngữ của hành động là lỗi mất điểm lớn nhất! Hãy luôn hỏi: \"Hành động này là AI làm?\" trước khi khoanh đáp án nhé." : "In the BJT exam, confusing the subject of the action is the biggest point-losing mistake! Always ask: \"WHO performs this action?\" before selecting your answer."}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* 2. EMAILS TAB */}
        {activeTab === "emails" && (
          <motion.div
            key="emails"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {/* Email list index */}
            <div className="md:col-span-1 bg-white/10 backdrop-blur-2xl rounded-2xl p-3 border border-amber-100/20 shadow-sm space-y-1.5 h-fit">
              <h4 className="text-xs text-[#7a5a3a] font-bold px-3 py-1.5 uppercase tracking-wide border-b border-amber-50/20 mb-2">
                {lang === "vi" ? "Mẫu Email Văn Phòng Thường Dùng" : "Common Office Email Templates"}
              </h4>
              {BJT_EMAILS.map((mail, idx) => {
                const isSelected = selectedEmailIdx === idx;
                return (
                  <button
                    key={mail.id}
                    onClick={() => {
                      setSelectedEmailIdx(idx);
                      setEmailLanguageTab("jp");
                    }}
                    className={`w-full text-left px-3.5 py-3 rounded-xl transition-all cursor-pointer ${
                      isSelected
                        ? "bg-amber-100/30 text-[#7a5a3a] font-bold border border-amber-200/20"
                        : "hover:bg-amber-50/10 text-gray-700"
                    }`}
                  >
                    <p className="text-xs sm:text-sm font-semibold">{getLocalizedText(mail.title, lang)}</p>
                    <p className="text-[10px] text-gray-400 mt-1 line-clamp-1 font-serif">
                      {getLocalizedText(mail.description, lang)}
                    </p>
                  </button>
                );
              })}
            </div>

            {/* Email workspace display */}
            <div className="md:col-span-2 space-y-4">
              <div className="bg-white/10 backdrop-blur-2xl rounded-2xl border border-amber-100/20 shadow-sm overflow-hidden">
                {/* Title and Copy bar */}
                <div className="bg-amber-50/10 border-b border-amber-200/20 px-4 py-3 flex items-center justify-between gap-3">
                  <div>
                    <h3 className="font-serif font-bold text-sm md:text-base text-[#7a5a3a]">
                      {getLocalizedText(BJT_EMAILS[selectedEmailIdx].title, lang)}
                    </h3>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Language Switch */}
                    <div className="bg-white border border-amber-100 rounded-full p-0.5 flex gap-1 shadow-sm">
                      <button
                        onClick={() => setEmailLanguageTab("jp")}
                        className={`text-[10px] font-bold px-2.5 py-1 rounded-full transition-all cursor-pointer ${
                          emailLanguageTab === "jp"
                            ? "bg-amber-500 text-white shadow-sm"
                            : "text-gray-500 hover:text-amber-650"
                        }`}
                      >
                        {lang === "vi" ? "Tiếng Nhật" : "Japanese"}
                      </button>
                      <button
                        onClick={() => setEmailLanguageTab("vn")}
                        className={`text-[10px] font-bold px-2.5 py-1 rounded-full transition-all cursor-pointer ${
                          emailLanguageTab === "vn"
                            ? "bg-amber-500 text-white shadow-sm"
                            : "text-gray-500 hover:text-amber-650"
                        }`}
                      >
                        {lang === "vi" ? "Bản Dịch" : "Translation"}
                      </button>
                    </div>

                    {/* Copy Button */}
                    <button
                      onClick={() => handleCopyEmail(BJT_EMAILS[selectedEmailIdx].body)}
                      className="flex items-center gap-1 bg-[#c2ae84] hover:bg-[#b5a176] active:scale-95 text-white text-[10px] px-3 py-1.5 rounded-full font-bold shadow-sm cursor-pointer transition-transform"
                      title={lang === "vi" ? "Sao chép toàn bộ email" : "Copy entire email"}
                    >
                      {copied ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          {lang === "vi" ? "Đã chép" : "Copied"}
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          {lang === "vi" ? "Chép mẫu" : "Copy"}
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Email Body details */}
                <div className="p-4 md:p-6 bg-[#fcfaf4]/30">
                  <div className="border border-amber-100/10 bg-white rounded-xl p-4 md:p-5 shadow-inner">
                    {/* Header fields */}
                    <div className="space-y-1 text-xs border-b border-gray-100 pb-3 mb-4 text-gray-500">
                      <p>
                        <span className="font-semibold text-gray-400 font-mono">{t.bjtEmailSubject}</span>{" "}
                        <span className="text-gray-800 font-medium">
                          {BJT_EMAILS[selectedEmailIdx].subject}
                        </span>
                      </p>
                    </div>

                    {/* Content body */}
                    <div className="whitespace-pre-line text-xs sm:text-sm text-gray-800 font-sans leading-relaxed">
                      {emailLanguageTab === "jp"
                        ? BJT_EMAILS[selectedEmailIdx].body
                        : getLocalizedText(BJT_EMAILS[selectedEmailIdx].translation, lang)}
                    </div>
                  </div>
                </div>
              </div>

              {/* Key phrases explanations card */}
              <div className="bg-white/10 backdrop-blur-2xl rounded-2xl p-4 border border-amber-100/20 shadow-sm">
                <h4 className="text-xs text-[#7a5a3a] font-bold uppercase tracking-wider mb-3 flex items-center gap-1">
                  <UserCheck className="w-4 h-4 text-amber-600" />
                  {t.bjtEmailKeyPhrases}
                </h4>
                <div className="space-y-3">
                  {BJT_EMAILS[selectedEmailIdx].keyPhrases.map((kp, idx) => (
                    <div key={idx} className="bg-amber-50/10 p-2.5 rounded-xl border border-amber-100/20 text-xs">
                      <p className="font-sans font-bold text-amber-700">{kp.phrase}</p>
                      <p className="text-gray-600 mt-1 font-serif leading-relaxed">{getLocalizedText(kp.meaning, lang)}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* 3. ETIQUETTE TAB */}
        {activeTab === "etiquette" && (
          <motion.div
            key="etiquette"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            {/* Bowing Angle Graphic panel */}
            <div className="bg-white/10 backdrop-blur-2xl rounded-2xl p-4 md:p-6 border border-amber-100/20 shadow-sm">
              <h3 className="text-base font-serif font-bold text-[#7a5a3a] mb-2 flex items-center gap-1.5">
                {lang === "vi" ? "Quy Tắc Cúi Chào Doanh Nghiệp (お辞儀 - Ojigi)" : "Business Bowing Etiquette (お辞儀 - Ojigi)"}
              </h3>
              <p className="text-xs text-gray-500 mb-5">
                {lang === "vi"
                  ? "Ojigi thể hiện sự tôn trọng, hối lỗi hoặc cảm kích sâu sắc. Có 3 kiểu cúi đầu phổ biến tại Nhật Bản:"
                  : "Ojigi expresses respect, apology, or deep appreciation. There are 3 common bowing styles in Japan:"}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-amber-50/10 hover:bg-amber-100/10 border border-amber-100/20 rounded-2xl p-4 text-center space-y-2.5 transition-all">
                  <div className="w-12 h-12 bg-amber-100/40 rounded-full flex items-center justify-center font-bold text-amber-700 text-lg mx-auto">
                    15°
                  </div>
                  <h4 className="text-sm font-sans font-bold text-[#7a5a3a]">
                    {lang === "vi" ? "会釈 (Eshaku - Khinh lễ)" : "会釈 (Eshaku - Greeting)"}
                  </h4>
                  <p className="text-xs text-gray-600 font-serif leading-relaxed">
                    {lang === "vi"
                      ? "Chào hỏi xã giao nhẹ nhàng khi lướt qua nhau tại sảnh tòa nhà, hành lang công ty, hoặc chào đồng nghiệp cùng cấp."
                      : "Light social greeting when passing each other in the building lobby, company hallways, or greeting peers."}
                  </p>
                </div>

                <div className="bg-amber-50/10 hover:bg-amber-100/10 border border-amber-100/20 rounded-2xl p-4 text-center space-y-2.5 transition-all">
                  <div className="w-12 h-12 bg-amber-100/40 rounded-full flex items-center justify-center font-bold text-amber-700 text-lg mx-auto">
                    30°
                  </div>
                  <h4 className="text-sm font-sans font-bold text-[#7a5a3a]">
                    {lang === "vi" ? "敬礼 (Keirei - Kính lễ)" : "敬礼 (Keirei - Respectful Bow)"}
                  </h4>
                  <p className="text-xs text-gray-600 font-serif leading-relaxed">
                    {lang === "vi"
                      ? "Kiểu chào phổ biến nhất khi tiếp đón khách hàng, chào đối tác kinh doanh hoặc khi bắt đầu một cuộc họp chính thức."
                      : "Most common bow when receiving clients, greeting business partners, or starting an official meeting."}
                  </p>
                </div>

                <div className="bg-amber-50/10 hover:bg-amber-100/10 border border-amber-100/20 rounded-2xl p-4 text-center space-y-2.5 transition-all">
                  <div className="w-12 h-12 bg-amber-100/40 rounded-full flex items-center justify-center font-bold text-amber-700 text-lg mx-auto">
                    45°
                  </div>
                  <h4 className="text-sm font-sans font-bold text-[#7a5a3a]">
                    {lang === "vi" ? "最敬礼 (Saikeirei - Tối kính lễ)" : "最敬礼 (Saikeirei - Deepest Bow)"}
                  </h4>
                  <p className="text-xs text-gray-600 font-serif leading-relaxed">
                    {lang === "vi"
                      ? "Chào vô cùng kính cẩn khi cảm ơn ân nhân lớn, diện kiến nguyên thủ quốc gia, hoặc khi chân thành tạ lỗi (Apologize) vì gây ra lỗi lầm nghiêm trọng."
                      : "Extremely respectful bow when thanking a major benefactor, meeting state leaders, or sincerely apologizing for a serious mistake."}
                  </p>
                </div>
              </div>
            </div>

            {/* Quizzes list */}
            <div className="space-y-6">
              <h4 className="text-sm text-[#7a5a3a] font-bold px-1 uppercase tracking-wide">
                {lang === "vi" ? "Trắc Nghiệm Tình Huống Ứng Xử BJT" : "BJT Business Etiquette Practice Quiz"}
              </h4>
              
              {BJT_ETIQUETTE_SCENARIOS.map((scene, sIdx) => {
                const selectedAns = quizAnswers[scene.id];
                const isSubmitted = submittedQuizzes[scene.id];
                const isCorrect = selectedAns === scene.correctAnswer;

                return (
                  <div
                    key={scene.id}
                    className="bg-white/10 backdrop-blur-2xl rounded-2xl p-4 md:p-6 border border-amber-100/20 shadow-sm"
                  >
                    <div className="flex gap-3">
                      <span className="w-6 h-6 bg-amber-100 text-amber-700 flex items-center justify-center rounded-full font-bold text-xs shrink-0 mt-1">
                        {sIdx + 1}
                      </span>
                      <div className="flex-1">
                        <span className="text-[10px] bg-amber-50/30 text-amber-650 font-sans font-bold px-2 py-0.5 rounded-full">
                          {getLocalizedText(scene.title, lang)}
                        </span>
                        <h4 className="text-sm sm:text-base font-sans font-semibold text-gray-800 leading-relaxed mt-2">
                          {getLocalizedText(scene.question, lang)}
                        </h4>
                        <p className="text-xs text-gray-400 mt-1 italic font-serif">
                          {getLocalizedText(scene.description, lang)}
                        </p>
                      </div>
                    </div>

                    {/* Options list */}
                    <div className="grid grid-cols-1 gap-2 mt-4 ml-0 sm:ml-9">
                      {scene.options.map((opt, oIdx) => {
                        const isThisSelected = selectedAns === oIdx;
                        let optStyle = "border-gray-200 bg-white hover:bg-amber-50/10 text-gray-700";

                        if (isSubmitted) {
                          if (oIdx === scene.correctAnswer) {
                            optStyle = "border-emerald-500 bg-emerald-50 text-emerald-800 font-bold ring-2 ring-emerald-200";
                          } else if (isThisSelected) {
                            optStyle = "border-rose-400 bg-rose-50 text-rose-800 ring-2 ring-rose-200";
                          } else {
                            optStyle = "border-gray-100 bg-gray-50/50 text-gray-400";
                          }
                        } else if (isThisSelected) {
                          optStyle = "border-amber-400 bg-amber-50/40 text-[#7a5a3a] font-bold ring-2 ring-amber-200/50";
                        }

                        return (
                          <button
                            key={oIdx}
                            onClick={() => handleQuizAnswer(scene.id, oIdx)}
                            disabled={isSubmitted}
                            className={`p-3 text-left rounded-xl border text-xs sm:text-sm cursor-pointer transition-all ${optStyle}`}
                          >
                            {getLocalizedText(opt, lang)}
                          </button>
                        );
                      })}
                    </div>

                    {/* Result and Submit Actions */}
                    <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-3 ml-0 sm:ml-9 border-t border-gray-100/50 pt-4">
                      <div>
                        {isSubmitted && (
                          <span
                            className={`text-xs font-bold px-3 py-1 rounded-full ${
                              isCorrect
                                ? "bg-emerald-100 text-emerald-700"
                                : "bg-rose-100 text-rose-700"
                            }`}
                          >
                            {isCorrect
                              ? (lang === "vi" ? "Đúng chuẩn quý tộc! 🎩" : "Perfect Etiquette! 🎩")
                              : (lang === "vi" ? "Thất lễ mất rồi! 😢" : "A bit impolite! 😢")}
                          </span>
                        )}
                      </div>

                      <div className="flex gap-2">
                        {!isSubmitted ? (
                          <button
                            onClick={() => handleQuizSubmit(scene.id)}
                            disabled={selectedAns === undefined}
                            className="bg-[#c2ae84] hover:bg-[#b5a176] active:scale-95 text-white font-bold text-xs px-5 py-2 rounded-full shadow-sm transition-all disabled:opacity-50 cursor-pointer"
                          >
                            {getLocalizedText(t.bjtCheckAnswer, lang)}
                          </button>
                        ) : (
                          <button
                            onClick={() => handleResetQuiz(scene.id)}
                            className="flex items-center gap-1 bg-gray-100 hover:bg-gray-200 text-gray-600 text-xs px-4 py-2 rounded-full font-bold transition-all cursor-pointer"
                          >
                            {getLocalizedText(t.bjtRetry, lang)}
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Feedback Explanation */}
                    {isSubmitted && (
                      <div className="mt-4 ml-0 sm:ml-9 bg-amber-50/10 border border-amber-200/20 rounded-xl p-4 text-xs text-[#7a5a3a] flex gap-2">
                        <HelpCircle className="w-4.5 h-4.5 text-amber-600 shrink-0 mt-0.5" />
                        <div>
                          <p className="font-bold mb-1">
                            {lang === "vi" ? "Quy tắc ứng xử công sở:" : "Business Etiquette Rule:"}
                          </p>
                          <p className="text-gray-600 leading-relaxed font-serif">
                            {getLocalizedText(scene.explanation, lang)}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
