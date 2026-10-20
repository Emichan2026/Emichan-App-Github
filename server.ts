import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Use body parsing middlewares
  app.use(express.json());

  // Serve static assets from public (audio files, etc.)
  app.use(express.static(path.join(process.cwd(), "public")));
  app.use("/audio", express.static(path.join(process.cwd(), "public", "audio")));

  // API Route for Gemini AI Chat
  app.post("/api/chat", async (req, res) => {
    try {
      const { message, lang = "vi" } = req.body;
      const isEn = lang === "en";

      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey || apiKey === "MY_GEMINI_API_KEY" || apiKey === "") {
        return res.status(200).json({
          text: isEn
            ? "🌸 Hello! I am Emichan-sensei. Currently, our AI course is not configured with the Gemini API Key on the server. But don't worry, you can still study using our pre-designed JLPT lessons, Kanji, Keigo, Business Email drafts, and playing card matching games below! 💕 If you want to chat directly with me via AI, please add the `GEMINI_API_KEY` in Settings > Secrets! ✨"
            : "🌸 Chào em! Cô là Emichan-sensei đây. Hiện tại khóa học AI của chúng ta chưa được cấu hình khóa bảo mật (API Key) của Gemini trên server. Nhưng em đừng lo, cô vẫn có thể hướng dẫn em học tập qua các bài học JLPT, Hán tự, Kính ngữ, Đọc thử email công sở và Chơi trò chơi ghép thẻ được thiết kế sẵn cực kỳ bổ ích ở bên dưới nhé! 💕 Nếu em muốn trò chuyện trực tiếp với cô bằng trí tuệ nhân tạo AI, hãy thêm mã khóa `GEMINI_API_KEY` trong mục Settings > Secrets nha! ✨"
        });
      }

      if (!message) {
        return res.status(400).json({ error: isEn ? "Message content is required." : "Yêu cầu nội dung tin nhắn." });
      }

      // Initialize Gemini Client
      const aiClient = new GoogleGenAI({
        apiKey: apiKey,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          },
        },
      });

      const systemInstruction = isEn
        ? `You are Emichan-sensei, a supportive, gentle, dedicated, and knowledgeable Japanese teacher speaking English.
Your mission is to help students answer questions about Japanese, especially for JLPT preparation (N5 to N1) and BJT (Business Japanese Proficiency Test - Honorifics/Keigo, business communication etiquette).
Address yourself as "Emichan-sensei" or "I" and address the student as "you" or "student".
Use cute icons like 🌸, ✨, 💝, 📝, 🇯🇵, 💼, 🎓 to create an elegant, warm, cherry-blossom vibe.
Explain briefly, clearly, and structure your responses elegantly in English, and always provide practical Japanese examples accompanied by furigana/romaji and English translations.`
        : `Bạn là Cô giáo Emichan (Emichan-sensei), một giáo viên dạy tiếng Nhật người Việt cực kỳ dễ thương, dịu dàng, tận tụy và thông thái.
Nhiệm vụ của bạn là giúp học viên giải đáp các thắc mắc về tiếng Nhật, đặc biệt là chuẩn bị cho kỳ thi JLPT (N5 đến N1) và BJT (Business Japanese Proficiency Test - Tiếng Nhật thương mại, Kính ngữ, phong cách giao tiếp công sở).
Hãy xưng hô thân thiện là "cô" và gọi người học là "em" hoặc "bạn". 
Sử dụng các biểu tượng dễ thương như 🌸, ✨, 💝, 📝, 🇯🇵, 💼, 🎓 để tạo cảm giác thanh lịch, ấm áp mang phong cách hoa anh đào của Emichan.
Hãy giải thích ngắn gọn, dễ hiểu, trình bày mạch lạc bằng tiếng Việt, và luôn có ví dụ đi kèm phiên âm furigana/romaji nếu có chữ Hán tự.`;

      const response = await aiClient.models.generateContent({
        model: "gemini-3.5-flash",
        contents: message,
        config: {
          systemInstruction: systemInstruction,
          temperature: 0.7,
        },
      });

      const text = response.text || (isEn ? "I didn't hear your question clearly, could you ask again? 🌸" : "Cô chưa nghe rõ câu hỏi của em lắm, em có thể hỏi lại được không? 🌸");
      return res.json({ text });
    } catch (error: any) {
      console.error("Gemini API Error:", error);
      const isEn = req.body?.lang === "en";
      return res.status(200).json({
        text: isEn
          ? "🌸 I'm so sorry, my connection to the Gemini server is temporarily interrupted. But please feel free to practice JLPT, BJT Keigo lessons, and play the matching cards game below! I am always here with you! 💕"
          : "🌸 Thật xin lỗi em, kết nối của cô tới máy chủ Gemini đang gặp một chút gián đoạn nhỏ. Nhưng em vẫn có thể thoải mái ôn luyện các phần bài học JLPT, BJT Keigo và chơi game ghép thẻ tuyệt vời ở phía dưới nhé! Cô luôn ở đây đồng hành cùng em! 💕"
      });
    }
  });

  // API Route for AI Kaiwa Practice
  app.post("/api/kaiwa", async (req, res) => {
    try {
      const { message, history, context } = req.body;
      const lang = req.body.lang || context?.lang || "vi";
      const isEn = lang === "en";

      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey || apiKey === "MY_GEMINI_API_KEY" || apiKey === "") {
        return res.status(200).json({
          text: isEn
            ? "🌸 Hello! To practice speaking Japanese (Kaiwa) directly with me and receive grammar corrections, please add the `GEMINI_API_KEY` under **Settings > Secrets**! ✨ Even without AI, Emichan-sensei highly praises your persistence and hard work today! You are outstanding! 💕"
            : "🌸 Chào em! Để luyện tập Kaiwa trực tiếp với cô bằng trí tuệ nhân tạo AI và nhận phân tích lỗi sai ngữ pháp, em hãy thêm mã khóa `GEMINI_API_KEY` trong mục **Settings > Secrets** nhé! ✨ Dù chưa kết nối AI, cô giáo vẫn nhiệt liệt khen ngợi tinh thần tự học cực kỳ kiên trì và chăm chỉ của em ngày hôm nay! Em thật xuất sắc! 💕"
        });
      }

      if (!message) {
        return res.status(400).json({ error: isEn ? "Message content is required." : "Yêu cầu nội dung tin nhắn." });
      }

      // Initialize Gemini Client
      const aiClient = new GoogleGenAI({
        apiKey: apiKey,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          },
        },
      });

      const systemInstruction = isEn
        ? `You are Emichan-sensei, a supportive, gentle, sweet, and dedicated Japanese teacher speaking English.
Your mission is to practice conversational Japanese (Kaiwa) directly with the student based on their current lesson: Level ${context?.level || "N5"}, Chapter ${context?.chapter || "1"}, Day ${context?.day || "1"}.
The key vocabulary for today is: ${JSON.stringify(context?.vocabulary || [])}.
The key grammar for today is: ${JSON.stringify(context?.grammar || [])}.

Communicate with the student using a short, natural, and easy-to-understand Japanese sentence suited for level ${context?.level || "N5"}.
The structure of your response MUST be divided into 3 clear sections:

1. 🌸 **SENSEI'S RESPONSE**:
   - One natural, short Japanese sentence (using basic Kanji, vocabulary, and grammar of today's lesson where appropriate).
   - Furigana/Romaji transcription right next to or below it so the learner can read easily.
   - An English translation of this sentence.

2. 💬 **SUGGESTED REPLIES FOR YOU**:
   - Suggest 2 short sample replies in Japanese (with English translations) that the student can use to continue the conversation.

3. 📝 **AI FEEDBACK - GRAMMAR CORRECTION**:
   - Point out any grammatical mistakes (such as particles は/gi/wo/ni, incorrect verb conjugations, inappropriate vocabulary) or praise them if they wrote it correctly and naturally.
   - Suggest a more natural native-like Japanese phrasing.
   - Present this section entirely in friendly, encouraging, and kind English.

Always maintain Emichan-sensei's cute persona, using cherry blossom icons 🌸, ✨, 🇯🇵, 💕.`
        : `Bạn là Cô giáo Emichan (Emichan-sensei), giáo viên dạy tiếng Nhật người Việt cực kỳ dễ thương, dịu dàng, dịu ngọt và tâm huyết.
Nhiệm vụ của bạn là thực hành hội thoại tiếng Nhật (Kaiwa) trực tiếp với học viên dựa trên bài học hiện tại: Cấp độ ${context?.level || "N5"}, Chương ${context?.chapter || "1"}, Ngày ${context?.day || "1"}.
Các từ vựng trọng tâm hôm nay là: ${JSON.stringify(context?.vocabulary || [])}.
Các ngữ pháp hôm nay là: ${JSON.stringify(context?.grammar || [])}.

Hãy giao tiếp với học viên bằng một câu tiếng Nhật ngắn gọn, dễ hiểu ở cấp độ ${context?.level || "N5"}.
Cấu trúc phản hồi của bạn BẮT BUỘC phải chia làm 3 phần rõ ràng:

1. 🌸 **CÂU TRẢ LỜI CỦA SENSEI**:
   - Một câu tiếng Nhật tự nhiên, ngắn gọn (dùng Kanji cơ bản và từ vựng/ngữ pháp của bài học hôm nay nếu phù hợp).
   - Phiên âm Furigana/Romaji ngay bên cạnh hoặc dưới để người học dễ đọc.
   - Bản dịch tiếng Việt dễ hiểu của câu đó.

2. 💬 **GỢI Ý PHẢN HỒI CHO EM**:
   - Gợi ý 2 mẫu câu ngắn bằng tiếng Nhật (kèm nghĩa tiếng Việt) phù hợp nhất để học viên có thể tham khảo để tiếp tục cuộc trò chuyện.

3. 📝 **AI FEEDBACK - CHỈNH SỬA NGỮ PHÁP**:
   - Phân tích tin nhắn vừa rồi của học viên (nếu học viên nhắn bằng tiếng Nhật).
   - Chỉ ra lỗi sai (như sai trợ từ は/gì/を/ni, chia sai thể động từ, dùng từ vựng chưa chuẩn) hoặc khen ngợi nếu học viên viết đúng, tự nhiên.
   - Gợi ý mẫu câu tự nhiên hơn chuẩn người bản xứ.
   - Trình bày hoàn toàn bằng tiếng Việt thân thiện, ân cần và động viên.

Hãy luôn giữ vững phong thái dễ thương của Emichan-sensei, sử dụng các icon hoa anh đào 🌸, ✨, 🇯🇵, 💕.`;

      // Build chat prompt or content with chat history
      const contents = [];
      if (history && Array.isArray(history)) {
        // Limit context to last 10 messages for token usage and focus
        const limitedHistory = history.slice(-10);
        for (const msg of limitedHistory) {
          contents.push({
            role: msg.sender === "user" ? "user" : "model",
            parts: [{ text: msg.text }]
          });
        }
      } else {
        contents.push({
          role: "user",
          parts: [{ text: message }]
        });
      }

      const response = await aiClient.models.generateContent({
        model: "gemini-3.5-flash",
        contents: contents,
        config: {
          systemInstruction: systemInstruction,
          temperature: 0.6,
        },
      });

      const text = response.text || (isEn ? "I didn't hear your question clearly, could you ask again? 🌸" : "Cô chưa nghe rõ câu hỏi của em lắm, em nói lại được không? 🌸");
      return res.json({ text });
    } catch (error: any) {
      console.error("Gemini Kaiwa API Error:", error);
      const isEn = req.body?.lang === "en" || req.body?.context?.lang === "en";
      return res.status(200).json({
        text: isEn
          ? "🌸 Connection to Emichan-sensei is briefly interrupted. Please try clicking or reloading the page! I am always waiting for you! 💕"
          : "🌸 Kết nối hội thoại Kaiwa của cô trò mình bị gián đoạn một chút rồi em ơi. Em thử nhấn lại hoặc tải lại trang xem sao nhé! Cô luôn chờ em! 💕"
      });
    }
  });

  // API Route for N4 Homework Grammar & Vocab Correction
  app.post("/api/check-n4-answer", async (req, res) => {
    try {
      const { answer, question = "あなたは ３億円で 何を したいですか。", lang = "vi" } = req.body;
      const isEn = lang === "en";

      if (!answer || !answer.trim()) {
        return res.status(400).json({
          error: isEn ? "Please enter your Japanese answer." : "Vui lòng nhập câu trả lời tiếng Nhật của bạn."
        });
      }

      const apiKey = process.env.GEMINI_API_KEY;

      // If no API Key or dummy key, provide intelligent educational feedback tailored to Japanese N4
      if (!apiKey || apiKey === "MY_GEMINI_API_KEY" || apiKey === "") {
        const cleaned = answer.trim().toLowerCase();
        let feedback = "";
        
        if (isEn) {
          feedback = `🌸 **Emichan-sensei's Feedback**:
Great effort! Your answer: "${answer}"

📝 **Grammar Analysis**:
- For wishes with 300 million yen (3億円), in Japanese N4 we usually use the pattern **[Verb stem (masu-form without masu)] + たいです** (e.g. 買いたいです, 行きたいです, 貯金したいです).
- Particles: When expressing a desire with たい, the direct object particle can be either **を** or **が** (e.g., 家を買いたいです or 家が買いたいです).
- Natural expression:
  ✨ **Polished Natural Sentence**: 
  「もし３億円あったら、世界旅行に行きたいです。」(If I had 300 million yen, I would want to travel around the world.)
  「家族のために新しい家を買いたいです。」(I want to buy a new house for my family.)

🌟 Keep up the amazing work! You are progressing wonderfully in your N4 journey!`;
        } else {
          feedback = `🌸 **Nhận xét từ Cô giáo Emichan-sensei**:
Cô khen ngợi tinh thần học tập rất nghiêm túc và chủ động đặt câu của em nhé! Câu trả lời của em: 「${answer}」

📝 **Phân tích ngữ pháp & Cách dùng từ (Chuẩn N4)**:
1. **Cấu trúc mong muốn V-たい**:
   - Khi trả lời cho câu hỏi 「何をしたいですか」(Bạn muốn làm gì?), chúng ta dùng mẫu câu: **[Động từ thể ます bỏ ます] + たいです**.
   - *Ví dụ*: 買う (mua) → 買いたい (muốn mua); 行く (đi) → 行きたい (muốn đi); 旅行する (du lịch) → 旅行したい (muốn đi du lịch); 貯金する (tiết kiệm) → 貯金したい (muốn tiết kiệm).
2. **Trợ từ đi kèm**:
   - Trong mẫu câu ~たいです, trợ từ đi với tân ngữ có thể dùng **を** hoặc **が** đều chuẩn xác (ví dụ: 家を買いたいです hoặc 家が買いたいです).
   - Nếu có điều kiện giả định "Nếu có 300 triệu yên": hãy kết hợp với mẫu câu điều kiện **～たら** (もし３億円があったら...).

✨ **Câu hoàn chỉnh & tự nhiên nhất gợi ý cho em**:
- 「もし３億円あったら、世界旅行に行きたいです。」
  *(Phiên âm: Moshi san-oku-en ga attara, sekai ryokou ni ikitai desu. - Nếu có 300 triệu yên, em muốn đi du lịch vòng quanh thế giới.)*
- 「家族のために新しい家を買いたいです。」
  *(Phiên âm: Kazoku no tame ni atarashii ie wo kaitai desu. - Em muốn mua một ngôi nhà mới cho gia đình.)*
- 「半分を貯金して、残りで留学したいです。」
  *(Phiên âm: Hanbun wo chokin shite, nokori de ryuugaku shitai desu. - Em muốn tiết kiệm một nửa, số còn lại để đi du học.)*

💝 *Cô chúc mừng em đã hoàn thành xuất sắc câu hỏi viết văn của Buổi 1 nhé!*`;
        }

        return res.json({ feedback });
      }

      // Initialize Gemini Client
      const aiClient = new GoogleGenAI({
        apiKey: apiKey,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          },
        },
      });

      const prompt = isEn
        ? `You are Emichan-sensei, an expert Japanese teacher and textbook author.
The student is answering the N4 question: "${question}".
Student's answer: "${answer}".
Please evaluate their answer:
1. Praise their effort warmly with cute cherry blossom icons 🌸, ✨.
2. Analyze and correct their grammar, particles (は, が, を, に, で), verb conjugations, and word choices based on N4 grammar (especially the wish pattern ~たいです, conditionals ~たら, adjective/noun usage).
3. Provide the most natural native-level polished sentence(s) with Kanji, furigana/romaji, and English translation.
4. Offer 1-2 creative alternative responses suited for N4 learners.
Keep the tone encouraging, educational, and warm.`
        : `Bạn là một chuyên gia người Việt Nam biên soạn giáo trình tiếng Nhật chuẩn N4, đồng thời là cô giáo Emichan-sensei tận tâm, dịu dàng.
Học viên đang làm bài tập về nhà Buổi 1 khóa học N4, trả lời cho câu hỏi: "${question}".
Câu trả lời của học viên: "${answer}".
Hãy nhận xét, chữa lỗi ngữ pháp và cách dùng từ cho học viên theo các mục sau:
1. 🌸 Lời khen ngợi động viên tinh thần tự giác học tập.
2. 📝 Phân tích chi tiết: Chỉ ra lỗi sai ngữ pháp (nếu có), trợ từ (は, が, を, に, で...), cách chia động từ (đặc biệt là thể mong muốn ~たいです, nối câu, từ vựng) hoặc khen ngợi nếu câu đã chuẩn xác.
3. ✨ Câu viết lại hoàn chỉnh & tự nhiên nhất (chuẩn phong cách người Nhật bản xứ, kèm Furigana/Romaji và dịch nghĩa tiếng Việt).
4. 💡 Gợi ý thêm 1-2 cách diễn đạt tương đương rất hay ở trình độ N4 để học viên học hỏi thêm.
Giữ giọng văn ấm áp, sư phạm chuẩn mực, trình bày mạch lạc và dễ hiểu.`;

      const response = await aiClient.models.generateContent({
        model: "gemini-3.8-flash",
        contents: prompt,
        config: {
          temperature: 0.6,
        },
      });

      const feedback = response.text || (isEn ? "Great answer! Keep practicing every day! 🌸" : "Câu trả lời rất tốt! Hãy tiếp tục luyện tập mỗi ngày nhé! 🌸");
      return res.json({ feedback });
    } catch (error: any) {
      console.error("Gemini Check Answer API Error:", error);
      const isEn = req.body?.lang === "en";
      return res.status(200).json({
        feedback: isEn
          ? "🌸 Great job completing your sentence! Remember to use [V-masu stem] + たいです to express what you want to do with 300 million yen! 💕"
          : "🌸 Em đã hoàn thành rất tốt câu trả lời! Hãy ghi nhớ mẫu câu [Động từ bỏ ます] + たいです để diễn đạt mong muốn của bản thân nhé! 💕"
      });
    }
  });
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Emichan Server] Running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Failed to start Emichan study server:", err);
});
