import React from "react";

/* ============================================================
   Ký hiệu furigana trong chuỗi:  漢字[かんじ]  ->  <ruby>漢字<rt>かんじ</rt></ruby>
   Ô trống bài tập:               {1} {2} ...
   ============================================================ */

export function parseRuby(str) {
  const re = /([\u4E00-\u9FFF\u3005]+)\[([^\]]+)\]/g;
  const out = [];
  let last = 0, m, k = 0;
  while ((m = re.exec(str))) {
    if (m.index > last) out.push(str.slice(last, m.index));
    out.push(
      <ruby key={k++}>
        {m[1]}
        <rp>(</rp>
        <rt>{m[2]}</rt>
        <rp>)</rp>
      </ruby>
    );
    last = re.lastIndex;
  }
  if (last < str.length) out.push(str.slice(last));
  return out;
}

export const Ruby = ({ text }) => <>{parseRuby(text)}</>;

/* ============================================================
   DỮ LIỆU BÀI 1
   level: "teinei" (lịch sự) | "casual" (ため口, chỉ dùng với bạn thân)
   ============================================================ */

export const lesson01 = {
  id: "lesson-01",
  title: "Danh từ, liệt kê, trợ từ cuối câu, so sánh hơn",
  grammar: [
    {
      id: "g1",
      title: "Câu danh từ: N は N です",
      patterns: [
        { label: "Khẳng định (hiện tại/tương lai)", teinei: "N です", casual: "N だ" },
        { label: "Khẳng định (quá khứ)", teinei: "N でした", casual: "N だった" },
        { label: "Phủ định (hiện tại/tương lai)", teinei: "N じゃないです / N じゃありません", casual: "N じゃない" },
        { label: "Phủ định (quá khứ)", teinei: "N じゃなかったです / N じゃありませんでした", casual: "N じゃなかった" },
      ],
      note: "Thể ngắn (ため口) chỉ dùng với bạn thân. Với cấp trên, đối tác, người mới gặp: dùng thể です/ます.",
      examples: [
        {
          jp: "私[わたし]は学生[がくせい]です。",
          vi: "Tôi là sinh viên.",
          level: "teinei",
          tip: "Câu giới thiệu bản thân chuẩn mực.",
        },
        {
          jp: "昨日[きのう]は休[やす]みでした。",
          vi: "Hôm qua là ngày nghỉ.",
          level: "teinei",
          tip: "Quá khứ của です là でした.",
        },
        {
          jp: "これは私[わたし]のかばんじゃありません。",
          vi: "Đây không phải cặp của tôi.",
          level: "teinei",
          tip: "Trang trọng hơn じゃないです.",
        },
        {
          jp: "今日[きょう]は雨[あめ]じゃない。",
          vi: "Hôm nay không mưa.",
          level: "casual",
          tip: "Chỉ nói với bạn bè, người thân.",
        },
      ],
    },
    {
      id: "g2",
      title: "Nối, liệt kê danh từ và trợ từ cuối câu",
      patterns: [
        { label: "N1 と N2", teinei: "N1 và N2 (liệt kê đầy đủ)" },
        { label: "S は N1 で、N2 です", teinei: "Nối hai danh từ cùng chủ ngữ" },
        { label: "N1 や N2 や N3 など", teinei: "Liệt kê ví dụ (còn nữa)" },
        { label: "N1 とか N2 とか", teinei: "Liệt kê ví dụ (khẩu ngữ)" },
        { label: "N も", teinei: "Cũng là N" },
        { label: "N1 の N2", teinei: "Sở hữu / xuất xứ / nội dung / nguyên liệu" },
        { label: "Hậu tố: ね、よ、よね、かね、さ、わ", teinei: "Trợ từ cuối câu (sắc thái khác nhau)" },
      ],
      examples: [
        {
          jp: "机[つくえ]の上[うえ]に本[ほん]とノートがあります。",
          vi: "Trên bàn có sách và vở.",
          level: "teinei",
          tip: "と liệt kê đầy đủ, không còn thứ khác.",
        },
        {
          jp: "田中[たなか]さんは先生[せんせい]で、山田[やまだ]さんは医者[いしゃ]です。",
          vi: "Anh Tanaka là giáo viên, còn anh Yamada là bác sĩ.",
          level: "teinei",
          tip: "で nối hai danh từ/mệnh đề trong một câu.",
        },
        {
          jp: "果物[くだもの]はりんごやバナナなどが好[す]きです。",
          vi: "Về trái cây, tôi thích táo, chuối, v.v.",
          level: "teinei",
          tip: "や…など: liệt kê vài ví dụ tiêu biểu.",
        },
        {
          jp: "趣味[しゅみ]は映画[えいが]とか音楽[おんがく]とかです。",
          vi: "Sở thích của tôi là xem phim, nghe nhạc, mấy thứ đại loại vậy.",
          level: "casual",
          tip: "とか mang sắc thái khẩu ngữ, thân mật.",
        },
        {
          jp: "私[わたし]も学生[がくせい]です。",
          vi: "Tôi cũng là sinh viên.",
          level: "teinei",
          tip: "も thay cho は/が khi “cũng”.",
        },
        {
          jp: "これは日本[にほん]の車[くるま]です。",
          vi: "Đây là xe của Nhật.",
          level: "teinei",
          tip: "の chỉ xuất xứ. Cũng dùng cho sở hữu: 私の車.",
        },
        {
          jp: "いい天気[てんき]ですね。",
          vi: "Thời tiết đẹp nhỉ.",
          level: "teinei",
          tip: "ね: tìm sự đồng tình, mở đầu hội thoại xã giao.",
        },
        {
          jp: "あの人[ひと]は先生[せんせい]ですよ。",
          vi: "Người kia là giáo viên đấy.",
          level: "teinei",
          tip: "よ: báo thông tin mới cho người nghe. Dùng nhiều quá nghe hơi áp đặt.",
        },
        {
          jp: "明日[あした]は休[やす]みですよね。",
          vi: "Ngày mai là ngày nghỉ, đúng không nhỉ.",
          level: "teinei",
          tip: "よね: xác nhận điều mình đã biết/đoán.",
        },
      ],
    },
    {
      id: "g3",
      title: "Tính từ (bản nháp: chờ ảnh đính kèm)",
      patterns: [
        { label: "Tính từ い: bỏ い + くなかったです / かったです", teinei: "むずかしい → むずかしくなかったです" },
        { label: "Tính từ い + N: giữ nguyên", teinei: "おいしい料理" },
        { label: "Tính từ い nối câu: bỏ い + くて", teinei: "かわいくて面白い" },
        { label: "Tính từ い làm trạng từ: bỏ い + く", teinei: "早く起きます" },
        { label: "Tính từ な + N: + な", teinei: "きれいな町" },
        { label: "Tính từ な nối câu: + で", teinei: "静かで、広い" },
        { label: "Tính từ な làm trạng từ: + に", teinei: "きれいに掃除する" },
      ],
      examples: [],
    },
    {
      id: "g4",
      title: "So sánh hơn",
      patterns: [
        { label: "N1 は N2 より A です", teinei: "N1 hơn N2" },
        { label: "N1 は より A です", teinei: "(N2 đã rõ trong ngữ cảnh)" },
        { label: "N2 より N1 の方[ほう]が A です", teinei: "Nhấn mạnh N1 hơn" },
        { label: "N1 の方[ほう]が A です", teinei: "(lược N2)" },
      ],
      examples: [
        {
          jp: "東京[とうきょう]は大阪[おおさか]より人[ひと]が多[おお]いです。",
          vi: "Tokyo đông người hơn Osaka.",
          level: "teinei",
          tip: "Mẫu cơ bản N1 は N2 より A.",
        },
        {
          jp: "電車[でんしゃ]よりバスの方[ほう]が安[やす]いです。",
          vi: "Xe buýt rẻ hơn tàu điện.",
          level: "teinei",
          tip: "Khi hỏi “cái nào hơn”, trả lời bằng mẫu này rất tự nhiên.",
        },
        {
          jp: "私[わたし]の方[ほう]が背[せ]が高[たか]いです。",
          vi: "Tôi cao hơn.",
          level: "teinei",
          tip: "Lược N2 khi người nghe đã biết đang so với ai.",
        },
      ],
    },
  ],

  /* Bài 1: điền trợ từ / hậu tố. Ô trống: {n}. answers[n] = đáp án đúng. */
  exercise1: [
    {
      id: "e1-1",
      level: "teinei",
      lines: [
        { who: "A", text: "すみません、田中[たなか]さん{1}席[せき]はどこですか。" },
        { who: "B", text: "あそこです。あの黒[くろ]くて大[おお]きいかばんがあるところです{2}。" },
        { who: "A", text: "ああ、あそこです{3}。ありがとうございました。" },
        { who: "B", text: "田中[たなか]さん{4}資料[しりょう]ですか。" },
        { who: "A", text: "はい、そうです。田中[たなか]さん{5}テーブル{6}上[うえ]に置[お]きますね。" },
      ],
      answers: { 1: "の", 2: "よ", 3: "ね", 4: "の", 5: "の", 6: "の" },
      explain: {
        1: "Sở hữu: 田中さんの席 (chỗ của anh Tanaka).",
        2: "よ: báo cho người kia biết chỗ đó ở đâu.",
        3: "ね: xác nhận lại điều vừa nghe, “ra chỗ đó nhỉ”.",
        4: "の: sở hữu/nội dung, 田中さんの資料.",
        5: "の: sở hữu, 田中さんのテーブル.",
        6: "の: テーブルの上 (phía trên cái bàn).",
      },
    },
    {
      id: "e1-2",
      level: "casual",
      lines: [
        { who: "A", text: "今晩[こんばん]{7}暇[ひま]？" },
        { who: "B", text: "ごめん、友達[ともだち]{8}遊[あそ]びに行[い]く予定[よてい]がある。なんかある？" },
        { who: "A", text: "ううん、特[とく]に何[なに]{9}ない。時間[じかん]があったら、一緒[いっしょ]に食事[しょくじ]をしたいなと思[おも]った。" },
        { who: "B", text: "へえ～、そうなんだ。明日[あした]{10}？" },
        { who: "A", text: "うん、明日[あした]でもいいね。また明日[あした]ね。" },
      ],
      answers: { 7: "は", 8: "と", 9: "も", 10: "は" },
      explain: {
        7: "は: nêu chủ đề “tối nay thì sao”.",
        8: "と: đi chơi cùng bạn.",
        9: "も: 何も + phủ định = không gì cả.",
        10: "は: “còn ngày mai thì sao?”.",
      },
      culture: "Cả đoạn là ため口 giữa bạn bè. Không dùng với cấp trên.",
    },
  ],

  /* Bài 2: chia dạng từ. Ô trống: {n}. */
  exercise2: [
    { id: "e2-1", text: "昨日[きのう]のテストはあまり{1}。", base: "むずかしい", answers: ["むずかしくなかったです", "難[むずか]しくなかったです"], explain: "あまり + phủ định, quá khứ của tính từ い: ～くなかったです." },
    { id: "e2-2", text: "この部屋[へや]は{1}、ひろいですね。", base: "しずか", answers: ["しずかで", "静[しず]かで"], explain: "Tính từ な nối câu: + で." },
    { id: "e2-3", text: "{1}料理[りょうり]をたくさん食[た]べました。", base: "おいしい", answers: ["おいしい", "美味[おい]しい"], explain: "Tính từ い bổ nghĩa danh từ: giữ nguyên." },
    { id: "e2-4", text: "毎日[まいにち]{1}起[お]きます。", base: "早い", answers: ["はやく", "早[はや]く"], explain: "Tính từ い làm trạng từ: bỏ い + く." },
    { id: "e2-5", text: "去年[きょねん]の夏[なつ]はとても{1}です。", base: "あつい", answers: ["あつかった", "暑[あつ]かった"], explain: "Quá khứ: bỏ い + かった. Ghép với です: 暑かったです." },
    { id: "e2-6", text: "この町[まち]は{1}町[まち]ですね。", base: "にぎやか・きれい", answers: ["にぎやかできれいな", "賑[にぎ]やかできれいな"], explain: "Tính từ な + で nối, tính từ な cuối + な bổ nghĩa danh từ." },
    { id: "e2-7", text: "帰[かえ]る前[まえ]に、{1}そうじしました。", base: "きれい", answers: ["きれいに"], explain: "Tính từ な làm trạng từ: + に." },
    { id: "e2-8", text: "北海道[ほっかいどう]は東京[とうきょう]より{1}です。", base: "さむい", answers: ["さむい", "寒[さむ]い"], explain: "So sánh hơn ở hiện tại: tính từ い giữ nguyên + です." },
    { id: "e2-9", text: "コーヒーよりお茶[ちゃ]のほうが{1}です。", base: "すき", answers: ["すき", "好[す]き"], explain: "Tính từ な + です, không thêm な." },
    { id: "e2-10", text: "Aちゃんは{1}赤[あか]ちゃんですね。", base: "かわいい・面白い", answers: ["かわいくておもしろい", "かわいくて面白[おもしろ]い"], explain: "Tính từ い nối câu: bỏ い + くて; tính từ cuối giữ nguyên." },
  ],
};

/* ============================================================
   Component hiển thị mẫu (có thể bỏ, chỉ để kiểm tra dữ liệu)
   ============================================================ */

export default function Lesson01Preview() {
  return (
    <div style={{ maxWidth: 640, margin: "0 auto", padding: 16, fontSize: 18, lineHeight: 2.2 }}>
      <h2>{lesson01.title}</h2>
      {lesson01.grammar.map((g) => (
        <section key={g.id}>
          <h3>{g.title}</h3>
          {g.examples.map((ex, i) => (
            <div key={i}>
              <div><Ruby text={ex.jp} /> {ex.level === "casual" && <small>(ため口)</small>}</div>
              <small>{ex.vi}. {ex.tip}</small>
            </div>
          ))}
        </section>
      ))}
    </div>
  );
}
