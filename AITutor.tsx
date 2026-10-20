import React, { useState, useRef, useEffect } from "react";
import { Send, Sparkles, MessageCircle, ArrowRight, BookOpen, Bot } from "lucide-react";

interface Message {
  id: string;
  sender: "user" | "bot";
  text: string;
  timestamp: Date;
}

interface AITutorProps {
  lang?: "vi" | "en";
}

const SUGGESTED_QUESTIONS_VI = [
  "Phân biệt kính ngữ Sonkeigo và Kenjougo? 📝",
  "Sự khác biệt trợ từ 'wa' (は) và 'ga' (が)? 📝",
  "Quy tắc trao danh thiếp Meishi Koukan trong công ty? 💼",
  "Nên thi JLPT hay BJT để đi làm văn phòng? 🇯🇵",
];

const SUGGESTED_QUESTIONS_EN = [
  "Difference between Sonkeigo and Kenjougo? 📝",
  "Difference between particles 'wa' (は) and 'ga' (が)? 📝",
  "Meishi Koukan business card exchange rules? 💼",
  "Should I take JLPT or BJT for office work? 🇯🇵",
];

export const AITutor: React.FC<AITutorProps> = ({ lang = "vi" }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const suggestedQuestions = lang === "vi" ? SUGGESTED_QUESTIONS_VI : SUGGESTED_QUESTIONS_EN;

  useEffect(() => {
    setMessages([
      {
        id: "welcome",
        sender: "bot",
        text: lang === "vi"
          ? "Konnichiwa! Chào em! Cô là Cô giáo Nhật Ngữ AI, trợ lý học tập tiếng Nhật của em đây. Cô có thể giải đáp mọi thắc mắc về ngữ pháp JLPT, từ vựng, chữ Hán tự hay các quy tắc ứng xử, kính ngữ trong kì thi BJT công sở. Em muốn hỏi cô điều gì hôm nay thế? 💕"
          : "Konnichiwa! Hello! I am your Virtual AI Japanese Teacher. I can help you answer any questions about JLPT grammar, vocabulary, Kanji, or BJT business etiquette and honorifics. What would you like to ask me today? 💕",
        timestamp: new Date(),
      }
    ]);
  }, [lang]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const sendMessage = async (textToSend: string) => {
    if (!textToSend.trim()) return;

    const userMsg: Message = {
      id: Math.random().toString(),
      sender: "user",
      text: textToSend,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: textToSend, lang }),
      });

      const data = await response.json();
      
      const botMsg: Message = {
        id: Math.random().toString(),
        sender: "bot",
        text: data.text || (lang === "vi" ? "Cô chưa chuẩn bị kịp câu trả lời, em hỏi lại nhé!" : "I couldn't prepare the answer in time, please ask again!"),
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (error) {
      console.error("Failed to fetch reply from server:", error);
      const botErrorMsg: Message = {
        id: Math.random().toString(),
        sender: "bot",
        text: lang === "vi"
          ? "Có vẻ như đường truyền của chúng ta bị gián đoạn một chút. Em có thể kiểm tra lại kết nối mạng hoặc hỏi lại cô sau nhé! Cô luôn chờ em. 💝"
          : "It seems our connection was briefly interrupted. Please check your network or ask me again later! I am always waiting for you. 💝",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botErrorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  return (
    <div className="w-full bg-white/10 backdrop-blur-2xl rounded-2xl overflow-hidden border border-pink-100/20 shadow-md flex flex-col h-[550px]">
      {/* Tutor Banner */}
      <div className="bg-[#f3d5d9] px-4 py-3 flex items-center gap-3 border-b border-pink-200">
        <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-[#8a5b61] font-bold shadow-sm border border-pink-100">
          <Bot className="w-5 h-5 text-pink-500" />
        </div>
        <div>
          <h3 className="font-serif font-bold text-[#8a5b61] flex items-center gap-1.5 text-sm md:text-base">
            {lang === "vi" ? "Hỏi Đáp AI: Cô giáo Nhật Ngữ" : "AI Q&A: Japanese Teacher"}
            <span className="text-[10px] bg-white/70 px-2 py-0.5 rounded-full text-pink-600 font-sans font-medium">
              Tutor 24/7
            </span>
          </h3>
          <p className="text-[11px] text-[#9c6a71] font-medium">
            {lang === "vi" ? "Giải đáp thông minh mọi câu hỏi JLPT & BJT" : "Smart answers to all JLPT & BJT questions"}
          </p>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#fff9f9]/40">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[85%] rounded-2xl p-3 text-sm shadow-sm leading-relaxed ${
                msg.sender === "user"
                  ? "bg-gradient-to-r from-pink-400 to-[#c99fa5] text-white rounded-br-none"
                  : "bg-white text-gray-800 border border-pink-50 rounded-bl-none"
              }`}
            >
              <div className="whitespace-pre-line">{msg.text}</div>
              <span
                className={`text-[9px] block mt-1.5 text-right ${
                  msg.sender === "user" ? "text-pink-100" : "text-gray-400"
                }`}
              >
                {msg.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </span>
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="bg-white text-gray-800 border border-pink-50 rounded-2xl rounded-bl-none p-3 text-sm shadow-sm flex items-center gap-2 max-w-[85%]">
              <span className="w-1.5 h-1.5 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></span>
              <span className="w-1.5 h-1.5 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></span>
              <span className="w-1.5 h-1.5 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></span>
              <span className="text-xs text-gray-400 font-medium ml-1">
                {lang === "vi" ? "Cô giáo đang suy nghĩ..." : "Teacher is thinking..."}
              </span>
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Suggestion tags */}
      {messages.length === 1 && (
        <div className="px-4 py-2 border-t border-pink-50 bg-pink-50/20">
          <p className="text-[10px] text-pink-600 font-semibold mb-1.5 flex items-center gap-1">
            <Sparkles className="w-3 h-3" /> {lang === "vi" ? "Gợi ý câu hỏi cho cô:" : "Suggested questions:"}
          </p>
          <div className="flex flex-wrap gap-1.5">
            {suggestedQuestions.map((q, i) => (
              <button
                key={i}
                onClick={() => sendMessage(q)}
                className="text-[11px] bg-white border border-pink-100 rounded-full px-3 py-1 text-gray-700 hover:bg-pink-50 hover:border-pink-300 transition-colors text-left font-medium cursor-pointer"
              >
                {q}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input Form */}
      <form onSubmit={handleSend} className="p-3 bg-white border-t border-pink-100 flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={lang === "vi" ? "Nhập câu hỏi tiếng Nhật của em gửi cô..." : "Ask your Japanese teacher a question..."}
          className="flex-1 border border-pink-100 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-transparent placeholder-gray-400"
          disabled={loading}
        />
        <button
          type="submit"
          className="bg-gradient-to-r from-pink-400 to-[#c99fa5] text-white p-2 rounded-full transition-transform hover:scale-105 active:scale-95 disabled:opacity-50 cursor-pointer shadow-sm flex items-center justify-center w-9 h-9 shrink-0"
          disabled={!input.trim() || loading}
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
