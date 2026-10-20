import React, { useState, useRef, useEffect } from "react";
import { Send, Sparkles, MessageSquare, Volume2, Award, CheckCircle } from "lucide-react";

interface Message {
  id: string;
  sender: "user" | "bot";
  text: string;
  timestamp: Date;
}

interface AIKaiwaProps {
  level: string;
  chapter: number;
  day: number;
  vocabulary: Array<{ word: string; meaning: string; furigana: string }>;
  grammar: Array<{ pattern: string; meaning: string }>;
  onComplete: () => void;
  lang?: "vi" | "en";
}

export const AIKaiwa: React.FC<AIKaiwaProps> = ({
  level,
  chapter,
  day,
  vocabulary,
  grammar,
  onComplete,
  lang = "vi",
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Initialize conversation with a friendly prompt from Emichan-sensei
  useEffect(() => {
    const vocabList = vocabulary.slice(0, 3).map(v => `${v.word} (${v.meaning})`).join(", ");
    const grammarList = grammar.slice(0, 2).map(g => g.pattern).join(", ");
    
    setMessages([
      {
        id: "welcome",
        sender: "bot",
        text: lang === "vi"
          ? `Konnichiwa! Chào em! Hôm nay chúng ta cùng thực hành Kaiwa (giao tiếp tiếng Nhật) nhé!\n\nChủ đề hôm nay xoay quanh các từ vựng (${vocabList}) và ngữ pháp (${grammarList}) của Chương ${chapter} Bài ${day}.\n\nCô bắt đầu trước nhé: Chào em, hôm nay em có khỏe không? Có điều gì vui muốn chia sẻ với cô không? 😊\n👉 (こんにちは！お元気ですか？何か楽しいことはありましたか？)`
          : `Konnichiwa! Hello! Today let's practice conversational Japanese (Kaiwa) together!\n\nOur topic is based on the vocabulary (${vocabList}) and grammar (${grammarList}) of Chapter ${chapter} Day ${day}.\n\nI will start first: Hello, how are you today? Is there anything fun you'd like to share with me? 😊\n👉 (こんにちは！お元気ですか？何か楽しいことはありましたか？)`,
        timestamp: new Date(),
      },
    ]);
  }, [level, chapter, day, lang]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const speakText = (text: string) => {
    if (!text || !("speechSynthesis" in window)) return;
    try {
      window.speechSynthesis.cancel();
      
      // Clean up text to speak only Japanese parts if possible (e.g. text in parentheses or before translation)
      let jaText = text;
      const parenthesisMatch = text.match(/\(([^)]+)\)/);
      if (parenthesisMatch && parenthesisMatch[1]) {
        jaText = parenthesisMatch[1];
      } else {
        // Just extract Japanese characters and punctuation if there's Vietnamese/English in the text
        const jaRegex = /[\u3000-\u303F\u3040-\u309F\u30A0-\u30FF\uFF00-\uFFEF\u4E00-\u9FAF]+/g;
        const matches = text.match(jaRegex);
        if (matches) {
          jaText = matches.join(" ");
        }
      }

      const utterance = new SpeechSynthesisUtterance(jaText);
      utterance.lang = "ja-JP";
      utterance.pitch = 1.0; // Clear pitch
      utterance.rate = 0.85; // Natural speed for practicing listening

      const voices = window.speechSynthesis.getVoices();
      const jaVoice = voices.find(v => v.lang.startsWith("ja") || v.lang === "ja-JP");
      if (jaVoice) utterance.voice = jaVoice;

      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.error("Speech error", e);
    }
  };

  const handleSend = async (textToSend: string) => {
    if (!textToSend.trim() || loading) return;

    const userMsg: Message = {
      id: Math.random().toString(),
      sender: "user",
      text: textToSend,
      timestamp: new Date(),
    };

    const currentHistory = [...messages, userMsg];
    setMessages(currentHistory);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("/api/kaiwa", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: textToSend,
          history: currentHistory,
          lang,
          context: {
            level,
            chapter,
            day,
            lang,
            vocabulary: vocabulary.map(v => ({ word: v.word, meaning: v.meaning })),
            grammar: grammar.map(g => ({ pattern: g.pattern, meaning: g.meaning })),
          },
        }),
      });

      const data = await response.json();

      const botMsg: Message = {
        id: Math.random().toString(),
        sender: "bot",
        text: data.text || (lang === "vi" ? "Cô chưa nghe rõ câu trả lời của em lắm, em nói lại được không?" : "I didn't hear your response clearly, could you say it again?"),
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (error) {
      console.error("Failed to fetch kaiwa response:", error);
      const botErrorMsg: Message = {
        id: Math.random().toString(),
        sender: "bot",
        text: lang === "vi"
          ? "Có vẻ như sóng truyền hơi yếu một chút rồi. Em thử lại lần nữa nhé, cô vẫn đang lắng nghe em đây! 💕"
          : "The connection seems a bit weak right now. Please try again, I am listening to you! 💕",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botErrorMsg]);
    } finally {
      setLoading(false);
    }
  };

  // Helper to extract suggestions or text blocks cleanly
  const renderMessageContent = (text: string) => {
    return text.split("\n").map((line, idx) => {
      if (line.trim().startsWith("---") || line.trim().startsWith("***")) {
        return <hr key={idx} className="my-2 border-pink-100" />;
      }
      return <p key={idx} className="leading-relaxed mb-1">{line}</p>;
    });
  };

  return (
    <div className="bg-white/40 backdrop-blur-xl rounded-3xl p-4 md:p-5 border border-[#8a5b61]/20 shadow-sm space-y-4">
      <div className="flex items-center justify-between border-b border-[#8a5b61]/20 pb-3">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-[#8a5b61] animate-pulse" />
          <h4 className="font-serif font-bold text-base text-[#8a5b61]">
            {lang === "vi" ? "Bước 7: Luyện nói Kaiwa cùng AI" : "Step 7: Speak Japanese Conversation (Kaiwa) with AI"}
          </h4>
        </div>
        <div className="text-xs font-sans font-bold text-gray-400">
          {lang === "vi" ? `Chủ đề: Bài ${day}` : `Topic: Day ${day}`}
        </div>
      </div>

      <div className="bg-gradient-to-r from-[#8a5b61]/10 to-pink-500/10 p-3.5 rounded-2xl border border-[#8a5b61]/12 text-xs text-[#8a5b61] space-y-1">
        <p className="font-extrabold flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5 text-pink-600 animate-spin" />
          {lang === "vi" ? "HƯỚNG DẪN LUYỆN KAIWA:" : "KAIWA PRACTICE GUIDE:"}
        </p>
        <p className="text-gray-600 leading-relaxed">
          {lang === "vi"
            ? "Hãy nhập câu trả lời tiếng Nhật của em vào ô trò chuyện dưới đây. Emichan-sensei sẽ phản hồi, gợi ý câu tiếp theo và chỉ ra cụ thể các lỗi sai ngữ pháp, trợ từ để giúp em nâng cấp phản xạ nhanh chóng nhé!"
            : "Please type your Japanese response in the chat box below. Emichan-sensei will reply, suggest follow-up questions, and analyze any grammar or particle mistakes to help you build fast reflex skills!"}
        </p>
      </div>

      {/* Conversation Chatbox */}
      <div className="border border-pink-100/50 rounded-2xl bg-[#fffcfd]/50 overflow-hidden flex flex-col h-[400px]">
        {/* Messages Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[88%] rounded-2xl p-3.5 text-xs sm:text-sm shadow-xs ${
                  msg.sender === "user"
                    ? "bg-[#8a5b61] text-white rounded-br-none"
                    : "bg-white text-gray-800 border border-pink-50 rounded-bl-none"
                }`}
              >
                <div className="space-y-1 whitespace-pre-wrap">{renderMessageContent(msg.text)}</div>
                
                <div className="flex items-center justify-between mt-2.5 pt-1.5 border-t border-dotted border-gray-100">
                  <span className={`text-[9px] ${msg.sender === "user" ? "text-pink-100" : "text-gray-400"}`}>
                    {msg.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </span>
                  
                  {msg.sender === "bot" && (
                    <button
                      onClick={() => speakText(msg.text)}
                      className="text-[#8a5b61] hover:text-[#724a4f] flex items-center gap-1 font-semibold text-[10px] cursor-pointer"
                      title={lang === "vi" ? "Nghe phát âm câu tiếng Nhật" : "Listen to Japanese pronunciation"}
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                      <span>{lang === "vi" ? "Nghe" : "Listen"}</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex justify-start">
              <div className="bg-white text-gray-800 border border-pink-50 rounded-2xl rounded-bl-none p-3.5 text-xs sm:text-sm shadow-xs flex items-center gap-2 max-w-[85%]">
                <span className="w-1.5 h-1.5 bg-[#8a5b61] rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></span>
                <span className="w-1.5 h-1.5 bg-[#8a5b61] rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></span>
                <span className="w-1.5 h-1.5 bg-[#8a5b61] rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></span>
                <span className="text-[11px] text-gray-400 font-medium ml-1">
                  {lang === "vi" ? "Emichan-sensei đang phân tích câu..." : "Emichan-sensei is analyzing your sentence..."}
                </span>
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Form Inputs */}
        <div className="p-3 bg-white border-t border-pink-100 flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={lang === "vi" ? "Viết câu trả lời của em bằng tiếng Nhật..." : "Type your response in Japanese..."}
            className="flex-1 border border-pink-100 rounded-full px-4 py-2 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#8a5b61] focus:border-transparent placeholder-gray-400"
            disabled={loading}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSend(input);
              }
            }}
          />
          <button
            onClick={() => handleSend(input)}
            className="bg-[#8a5b61] hover:bg-[#724a4f] text-white p-2.5 rounded-full transition-all active:scale-95 disabled:opacity-50 cursor-pointer shadow-xs flex items-center justify-center w-9 h-9 shrink-0"
            disabled={!input.trim() || loading}
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Lesson Complete Card inside Kaiwa step to mark lesson done */}
      <div className="bg-gradient-to-r from-[#8a5b61] to-[#724a4f] text-white p-5 rounded-3xl text-center space-y-3 shadow-sm">
        <Award className="w-10 h-10 text-amber-300 fill-amber-200 mx-auto animate-bounce" />
        <h3 className="text-base sm:text-lg font-serif font-extrabold">
          {lang === "vi" ? "Hoàn thành khóa học ngày hôm nay!" : "Today's Lessons Completed!"}
        </h3>
        <p className="text-[11px] text-pink-50/90 max-w-md mx-auto leading-relaxed">
          {lang === "vi"
            ? "Tuyệt vời! Em đã hoàn thành trọn vẹn tất cả 7 bước học tập từ vựng, chữ hán, ngữ pháp, bài tập trắc nghiệm, đọc hiểu, nghe hiểu và thực hành nói Kaiwa với AI thành công!"
            : "Fantastic! You have successfully completed all 7 study steps: vocabulary, kanji, grammar, quizzes, reading comprehension, listening comprehension, and speaking practice with our AI!"}
        </p>
        <button
          onClick={onComplete}
          className="bg-white text-[#8a5b61] hover:bg-pink-50 font-black text-xs px-6 py-2.5 rounded-full shadow-md hover:scale-105 active:scale-95 transition-all cursor-pointer inline-flex items-center gap-1"
        >
          <CheckCircle className="w-4 h-4 text-[#8a5b61]" />
          <span>{lang === "vi" ? "Hoàn thành bài & Tiến sang ngày mới" : "Complete & Proceed to the Next Day"}</span>
        </button>
      </div>
    </div>
  );
};
