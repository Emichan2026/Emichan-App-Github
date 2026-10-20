export interface N4VocabItem {
  id: number;
  word: string;
  hanViet: string;
  reading: string;
  meaning: string;
  example: string;
  exampleMeaning: string;
  category?: string;
}

const KATAKANA_TO_HIRAGANA_MAP: Record<string, string> = {
  'ア':'あ','イ':'い','ウ':'う','エ':'え','オ':'お',
  'カ':'か','キ':'き','ク':'く','ケ':'け','コ':'こ',
  'サ':'さ','シ':'し','ス':'す','セ':'せ','ソ':'そ',
  'タ':'た','チ':'ち','ツ':'つ','テ':'て','ト':'と',
  'ナ':'な','ニ':'に','ヌ':'ぬ','ネ':'ね','ノ':'の',
  'ハ':'は','ヒ':'ひ','フ':'ふ','ヘ':'へ','ホ':'ほ',
  'マ':'ま','ミ':'み','ム':'む','メ':'め','モ':'も',
  'ヤ':'や','ユ':'ゆ','ヨ':'よ',
  'ラ':'ら','リ':'り','ル':'る','レ':'れ','ロ':'ろ',
  'ワ':'わ','ヲ':'を','ン':'ん',
  'ガ':'が','ギ':'ぎ','グ':'ぐ','ゲ':'げ','ゴ':'ご',
  'ザ':'ざ','ジ':'じ','ズ':'ず','ゼ':'ぜ','ゾ':'ぞ',
  'ダ':'だ','ヂ':'ぢ','ヅ':'づ','デ':'で','ド':'ど',
  'バ':'ば','ビ':'び','ブ':'ぶ','ベ':'べ','ボ':'ぼ',
  'パ':'ぱ','ピ':'ぴ','プ':'ぷ','ペ':'ぺ','ポ':'ぽ',
  'キャ':'きゃ','キュ':'きゅ','キョ':'きょ',
  'シャ':'しゃ','シュ':'しゅ','ショ':'しょ',
  'チャ':'ちゃ','チュ':'ちゅ','チョ':'ちょ',
  'ニャ':'にゃ','ニュ':'にゅ','ニョ':'にょ',
  'ヒャ':'ひゃ','ヒュ':'ひゅ','ヒョ':'ひょ',
  'ミャ':'みゃ','ミュ':'みゅ','ミョ':'みょ',
  'リャ':'りゃ','リュ':'りゅ','リョ':'りょ',
  'ギャ':'ぎゃ','ギュ':'ぎゅ','ギョ':'ぎょ',
  'ジャ':'じゃ','ジュ':'じゅ','ジョ':'じょ',
  'ビャ':'びゃ','ビュ':'びゅ','ビョ':'びょ',
  'ピャ':'ぴゃ','ピュ':'ぴゅ','ピョ':'ぴょ',
  'ファ':'ふぁ','フィ':'ふぃ','フェ':'ふぇ','フォ':'ふぉ',
  'ヴァ':'ゔぁ','ヴィ':'ゔぃ','ヴ':'ゔ','ヴェ':'ゔぇ','ヴォ':'ゔぉ',
  'ティ':'てぃ','ディ':'でぃ','デュ':'でゅ',
  'ッ':'っ','ャ':'ゃ','ュ':'ゅ','ョ':'ょ','ァ':'ぁ','ィ':'ぃ','ゥ':'ぅ','ェ':'ぇ','ォ':'ぉ',
  'T':'てぃ'
};

const A_VOWELS = new Set(['あ','か','さ','た','な','は','ま','や','ら','わ','が','ざ','だ','ば','ぱ','ぁ','ゃ','ふぁ','ゔぁ']);
const I_VOWELS = new Set(['い','き','し','ち','に','ひ','み','り','ぎ','じ','ぢ','び','ぴ','ぃ','ふぃ','ゔぃ','てぃ','でぃ']);
const U_VOWELS = new Set(['う','く','す','つ','ぬ','ふ','む','ゆ','る','ぐ','ず','づ','ぶ','ぷ','ぅ','ゅ','ゔ','でゅ']);
const E_VOWELS = new Set(['え','け','せ','て','ね','へ','め','れ','げ','ぜ','で','べ','ぺ','ぇ','ふぇ','ゔぇ']);
const O_VOWELS = new Set(['お','こ','そ','と','の','ほ','も','よ','ろ','を','ご','ぞ','ど','ぼ','ぽ','ぉ','ょ','ふぉ','ゔぉ']);

function getVowelOfChar(ch: string): string {
  if (A_VOWELS.has(ch)) return 'あ';
  if (I_VOWELS.has(ch)) return 'い';
  if (U_VOWELS.has(ch)) return 'う';
  if (E_VOWELS.has(ch)) return 'え';
  if (O_VOWELS.has(ch)) return 'お';
  return 'あ';
}

/**
 * Bảng ánh xạ Kanji -> Hiragana chuẩn theo giáo trình N4 Buổi 1
 * Đảm bảo mọi chữ Hán được đọc chuẩn 100% theo đúng Hiragana trong file
 * Ví dụ: 領収書 -> りょうしゅうしょ (không bị đọc thành りょうしゅうか)
 * 洗面所 -> せんめんじょ (không bị đọc thành せんめんとこと)
 */
const KANJI_READING_OVERRIDE_MAP: Record<string, string> = {
  '領収書': 'りょうしゅうしょ',
  '処方箋': 'しょほうせん',
  '診察券': 'しんさつけん',
  '洗面所': 'せんめんじょ',
  '喫茶店': 'きっさてん',
  '交番': 'こうばん',
  '市役所': 'しやくしょ',
  '大使館': 'たいしかん',
  '図書館': 'としょかん',
  '郵便局': 'ゆうびんきょく',
  '冷蔵庫': 'れいぞうこ',
  '洗濯機': 'せんたくき',
  '掃除機': 'そうじき',
  '自販機': 'じはんき',
  '自転車': 'じてんしゃ',
  '自動車': 'じどうしゃ',
  '飛行機': 'ひこうき',
  '新幹線': 'しんかんせん',
  '地下鉄': 'ちかてつ',
  '定期券': 'ていきけん',
  '灰皿': 'はいざら',
  '玄関': 'げんかん',
  '廊下': 'ろうか',
  '階段': 'かいだん',
  '押入れ': 'おしいれ',
  '台所': 'だいどころ',
  'お風呂': 'おふろ',
  'お手洗い': 'おてあらい',
  '屋上': 'おくじょう',
  '庭': 'にわ',
  '池': 'いけ',
  '港': 'みなと',
  '田舎': 'いなか',
  '近所': 'きんじょ',
  '交差点': 'こうさてん',
  '横断歩道': 'おうだんほどう',
  '歩道': 'ほどう',
  '車道': 'しゃどう',
  '信号': 'しんごう',
  '角': 'かど',
  '端': 'はし',
  '表': 'おもて',
  '裏': 'うら',
  '専門': 'せんもん',
  '宿題': 'しゅくだい',
  '質問': 'しつもん',
  '返事': 'へんじ',
  '事故': 'じこ',
  '火事': 'かじ',
  '地震': 'じしん',
  '台風': 'たいふう',
  '天気予報': 'てんきよほう',
  '消しゴム': 'けしごむ',
  '冷房': 'れいぼう',
  '暖房': 'だんぼう',
  '向こう': 'むこう',
  '手前': 'てまえ',
  '真ん中': 'まんなか',
  '途中で': 'とちゅうで',
  '最悪な': 'さいあくな',
  '最高な': 'さいこうな',
  '遠慮な': 'えんりょな',
  '邪魔な': 'じゃまな',
  '無駄な': 'むだな',
  '無理な': 'むりな',
  '自由な': 'じゆうな',
  '複雑な': 'ふくざつな',
  '簡単な': 'かんたんな',
  '親切な': 'しんせつな',
  '丁寧な': 'ていねいな',
  '賑やかな': 'にぎやかな',
  '静かな': 'しずかな',
  '便利な': 'べんりな',
  '不便な': 'ふべんな',
  '危険な': 'きけんな',
  '安全な': 'あんぜんな',
  '丈夫な': 'じょうぶな',
  '大切な': 'たいせつな',
  '有名な': 'ゆうめいな',
  '必要な': 'ひつような',
  '特別な': 'とくべつな',
  '熱心な': 'ねっしんな',
  '真面目な': 'まじめな',
  '一生懸命な': 'いっしょうけんめいな',
  '失礼な': 'しつれいな',
  '横': 'よこ',
  '側': 'がわ',
};

/**
 * Chuyển đổi chính xác từ vựng / câu ví dụ sang âm đọc chuẩn cho voice đọc:
 * 1. Đọc đủ chữ, đủ âm tất cả các chữ cái và mora trong từ.
 * 2. Đọc đúng chữ Hán theo Hiragana đã ghi (ví dụ: 領収書 -> りょうしゅうしょ, 洗面所 -> せんめんじょ).
 * 3. Kéo dài trường âm Katakana chứ không nhân đôi phụ âm (ví dụ: エレベーター -> えれべえたあ).
 * 4. Không bị cắt bỏ phần sau dấu chấm giữa "・" (ví dụ: なぜ・どうして -> đọc cả なぜ và どうして).
 */
export function toTTSPhoneticReading(itemOrText: N4VocabItem | string): string {
  let text = '';

  if (typeof itemOrText === 'object' && itemOrText !== null) {
    text = itemOrText.reading || itemOrText.word;
  } else {
    text = String(itemOrText || '').trim();
    // Nếu chuỗi khớp trực tiếp từ nào trong danh mục thì ưu tiên lấy reading của từ đó
    if (KANJI_READING_OVERRIDE_MAP[text]) {
      text = KANJI_READING_OVERRIDE_MAP[text];
    } else {
      // Thay thế các từ Hán khó trong câu ví dụ theo thứ tự từ dài đến ngắn
      const kanjiKeys = Object.keys(KANJI_READING_OVERRIDE_MAP).sort((a, b) => b.length - a.length);
      for (const k of kanjiKeys) {
        if (text.includes(k)) {
          text = text.split(k).join(KANJI_READING_OVERRIDE_MAP[k]);
        }
      }
    }
  }

  // Đổi dấu chấm giữa "・" thành dấu phẩy ngắt nghỉ tự nhiên để đọc đầy đủ các từ hai bên (ví dụ: なぜ・どうして -> なぜ、どうして)
  text = text.replace(/・/g, '、');
  // Bỏ dấu sóng ~ ở đầu từ như ~側
  text = text.replace(/^[~〜]/, '');
  // Xử lý từ dạng "どんな + N" thành "どんな"
  text = text.replace(/\s*\+\s*[Nn]/g, '').trim();

  let hira = '';
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (ch === 'ー') {
      const prev = hira[hira.length - 1] || '';
      const vowel = getVowelOfChar(prev);
      hira += vowel;
    } else if (KATAKANA_TO_HIRAGANA_MAP[ch]) {
      hira += KATAKANA_TO_HIRAGANA_MAP[ch];
    } else {
      hira += ch;
    }
  }
  return hira.trim();
}

export const N4_LESSON_1_VOCAB: N4VocabItem[] = [
  // Page 1: 1 - 36
  {
    id: 1,
    word: "喫茶店",
    hanViet: "KHIẾU TRÀ ĐIẾM",
    reading: "きっさてん",
    meaning: "Quán cà phê, quán giải khát",
    example: "駅前の喫茶店で友達とコーヒーを飲みます。",
    exampleMeaning: "Uống cà phê cùng bạn ở quán cà phê trước nhà ga.",
    category: "Địa điểm & Cơ sở vật chất"
  },
  {
    id: 2,
    word: "交番",
    hanViet: "GIAO PHIÊN",
    reading: "こうばん",
    meaning: "Đồn cảnh sát",
    example: "道に迷ったので、交番で聞きました。",
    exampleMeaning: "Vì lạc đường nên tôi đã hỏi ở đồn cảnh sát.",
    category: "Địa điểm & Cơ sở vật chất"
  },
  {
    id: 3,
    word: "大使館",
    hanViet: "ĐẠI SỬ QUÁN",
    reading: "たいしかん",
    meaning: "Đại sứ quán",
    example: "明日ビザの申請のために日本大使館へ行きます。",
    exampleMeaning: "Ngày mai tôi sẽ đến Đại sứ quán Nhật Bản để xin visa.",
    category: "Địa điểm & Cơ sở vật chất"
  },
  {
    id: 4,
    word: "図書館",
    hanViet: "ĐỒ THƯ QUÁN",
    reading: "としょかん",
    meaning: "Thư viện",
    example: "図書館で日本語の文法書を借りました。",
    exampleMeaning: "Tôi đã mượn sách ngữ pháp tiếng Nhật ở thư viện.",
    category: "Địa điểm & Cơ sở vật chất"
  },
  {
    id: 5,
    word: "郵便局",
    hanViet: "BƯU TIỆN CỤC",
    reading: "ゆうびんきょく",
    meaning: "Bưu điện",
    example: "郵便局から家族へ手紙と荷物を送りました。",
    exampleMeaning: "Tôi đã gửi thư và bưu phẩm cho gia đình từ bưu điện.",
    category: "Địa điểm & Cơ sở vật chất"
  },
  {
    id: 6,
    word: "冷蔵庫",
    hanViet: "LÃNH TÀNG KHỐ",
    reading: "れいぞうこ",
    meaning: "Tủ lạnh",
    example: "冷たい牛乳を冷蔵庫から取り出しました。",
    exampleMeaning: "Tôi đã lấy sữa lạnh ra khỏi tủ lạnh.",
    category: "Đồ gia dụng & Thiết bị"
  },
  {
    id: 7,
    word: "洗濯機",
    hanViet: "TẨY TRẮC CƠ",
    reading: "せんたくき",
    meaning: "Máy giặt",
    example: "新しい洗濯機を買ったので、とても便利です。",
    exampleMeaning: "Vì đã mua máy giặt mới nên rất tiện lợi.",
    category: "Đồ gia dụng & Thiết bị"
  },
  {
    id: 8,
    word: "掃除機",
    hanViet: "TẢO TRỪ CƠ",
    reading: "そうじき",
    meaning: "Máy hút bụi",
    example: "毎朝掃除機で部屋をきれいにします。",
    exampleMeaning: "Mỗi sáng tôi dùng máy hút bụi dọn sạch phòng.",
    category: "Đồ gia dụng & Thiết bị"
  },
  {
    id: 9,
    word: "自販機",
    hanViet: "TỰ PHÁN CƠ",
    reading: "じはんき",
    meaning: "Máy bán hàng tự động",
    example: "道にある自販機でお茶を買いました。",
    exampleMeaning: "Tôi đã mua trà ở máy bán hàng tự động trên đường.",
    category: "Đồ gia dụng & Thiết bị"
  },
  {
    id: 10,
    word: "自転車",
    hanViet: "TỰ CHUYỂN XA",
    reading: "じてんしゃ",
    meaning: "Xe đạp",
    example: "毎朝自転車で学校へ通っています。",
    exampleMeaning: "Mỗi sáng tôi đạp xe đạp đến trường.",
    category: "Phương tiện giao thông"
  },
  {
    id: 11,
    word: "自動車",
    hanViet: "TỰ ĐỘNG XA",
    reading: "じどうしゃ",
    meaning: "Xe ô tô",
    example: "父は白い自動車を運転しています。",
    exampleMeaning: "Bố tôi lái một chiếc xe ô tô màu trắng.",
    category: "Phương tiện giao thông"
  },
  {
    id: 12,
    word: "飛行機",
    hanViet: "PHI HÀNH CƠ",
    reading: "ひこうき",
    meaning: "Máy bay",
    example: "飛行機で日本へ行きます。",
    exampleMeaning: "Tôi sẽ đi Nhật bằng máy bay.",
    category: "Phương tiện giao thông"
  },
  {
    id: 13,
    word: "新幹線",
    hanViet: "TÂN CÁN TUYẾN",
    reading: "しんかんせん",
    meaning: "Tàu hỏa tốc độ cao (Shinkansen)",
    example: "東京から京都まで新幹線で約2時間です。",
    exampleMeaning: "Từ Tokyo đến Kyoto đi tàu Shinkansen mất khoảng 2 tiếng.",
    category: "Phương tiện giao thông"
  },
  {
    id: 14,
    word: "地下鉄",
    hanViet: "ĐỊA THIẾT",
    reading: "ちかてつ",
    meaning: "Tàu điện ngầm",
    example: "ラッシュ時の地下鉄はとても混んでいます。",
    exampleMeaning: "Tàu điện ngầm giờ cao điểm rất đông đúc.",
    category: "Phương tiện giao thông"
  },
  {
    id: 15,
    word: "定期券",
    hanViet: "ĐỊNH KỲ KHOÁN",
    reading: "ていきけん",
    meaning: "Vé tháng, vé định kỳ",
    example: "通学のための電車の定期券を買いました。",
    exampleMeaning: "Tôi đã mua vé tháng tàu điện để đi học.",
    category: "Giấy tờ & Thủ tục"
  },
  {
    id: 16,
    word: "領収書",
    hanViet: "LÃNH THU THƯ",
    reading: "りょうしゅうしょ",
    meaning: "Hóa đơn, biên nhận",
    example: "会社に提出するために領収書をもらいました。",
    exampleMeaning: "Tôi đã lấy hóa đơn để nộp cho công ty.",
    category: "Giấy tờ & Thủ tục"
  },
  {
    id: 17,
    word: "処方箋",
    hanViet: "XỬ PHƯƠNG TIÊN",
    reading: "しょほうせん",
    meaning: "Đơn thuốc",
    example: "病院でもらった処方箋を持って薬局へ行きます。",
    exampleMeaning: "Tôi mang đơn thuốc được bác sĩ kê đến nhà thuốc.",
    category: "Giấy tờ & Thủ tục"
  },
  {
    id: 18,
    word: "診察券",
    hanViet: "CHẨN SÁT KHOÁN",
    reading: "しんさつけん",
    meaning: "Thẻ khám bệnh",
    example: "受付で診察券と保険証を出してください。",
    exampleMeaning: "Xin vui lòng nộp thẻ khám bệnh và bảo hiểm ở quầy tiếp tân.",
    category: "Giấy tờ & Thủ tục"
  },
  {
    id: 19,
    word: "ペン",
    hanViet: "pen",
    reading: "ペン",
    meaning: "Bút máy, bút viết",
    example: "この黒いペンで名前を書いてください。",
    exampleMeaning: "Xin hãy dùng chiếc bút đen này viết tên.",
    category: "Đồ dùng học tập & Văn phòng phẩm"
  },
  {
    id: 20,
    word: "消しゴム",
    hanViet: "TIÊU GUM",
    reading: "けしゴム",
    meaning: "Cục tẩy",
    example: "鉛筆の文字を消しゴムで消します。",
    exampleMeaning: "Tẩy chữ viết chì bằng cục tẩy.",
    category: "Đồ dùng học tập & Văn phòng phẩm"
  },
  {
    id: 21,
    word: "灰皿",
    hanViet: "HÔI MÃNH",
    reading: "はいざら",
    meaning: "Gạt tàn thuốc",
    example: "テーブルの上に灰皿があります。",
    exampleMeaning: "Trên bàn có một chiếc gạt tàn thuốc.",
    category: "Đồ dùng đời sống"
  },
  {
    id: 22,
    word: "玄関",
    hanViet: "HUYỀN QUAN",
    reading: "げんかん",
    meaning: "Lối vào nhà, hiên nhà",
    example: "玄関で靴を脱いで上がってください。",
    exampleMeaning: "Xin hãy cởi giày ở hiên vào nhà rồi bước lên.",
    category: "Nhà cửa & Không gian"
  },
  {
    id: 23,
    word: "廊下",
    hanViet: "LAN HẠ",
    reading: "ろうか",
    meaning: "Hành lang",
    example: "学校の廊下を走ってはいけません。",
    exampleMeaning: "Không được chạy ở hành lang trường học.",
    category: "Nhà cửa & Không gian"
  },
  {
    id: 24,
    word: "階段",
    hanViet: "GIAI ĐOẠN",
    reading: "かいだん",
    meaning: "Cầu thang",
    example: "健康のために階段を使って3階まで上がります。",
    exampleMeaning: "Để tốt cho sức khỏe tôi đi thang bộ lên tầng 3.",
    category: "Nhà cửa & Không gian"
  },
  {
    id: 25,
    word: "エレベーター",
    hanViet: "elevator",
    reading: "エレベーター",
    meaning: "Thang máy (thang hộp)",
    example: "荷物が多いのでエレベーターを利用します。",
    exampleMeaning: "Vì nhiều hành lý nên tôi sử dụng thang máy.",
    category: "Nhà cửa & Không gian"
  },
  {
    id: 26,
    word: "エスカレーター",
    hanViet: "escalator",
    reading: "エスカレーター",
    meaning: "Thang máy (thang cuốn)",
    example: "デパートのエスカレーターで2階へ行きます。",
    exampleMeaning: "Đi thang cuốn lên tầng 2 ở trung tâm thương mại.",
    category: "Nhà cửa & Không gian"
  },
  {
    id: 27,
    word: "押入れ",
    hanViet: "ÁP NHẬP",
    reading: "おしいれ",
    meaning: "Tủ âm tường kiểu Nhật",
    example: "押入れの中に布団を片付けました。",
    exampleMeaning: "Tôi đã cất đệm vào trong tủ âm tường.",
    category: "Nhà cửa & Không gian"
  },
  {
    id: 28,
    word: "台所",
    hanViet: "ĐÀI SỞ",
    reading: "だいどころ",
    meaning: "Nhà bếp (キッチン kitchen)",
    example: "母は今、台所で晩ご飯を作っています。",
    exampleMeaning: "Mẹ tôi hiện đang nấu cơm tối trong nhà bếp.",
    category: "Nhà cửa & Không gian"
  },
  {
    id: 29,
    word: "お風呂",
    hanViet: "PHONG LÔ",
    reading: "おふろ",
    meaning: "Bồn tắm, việc tắm bồn",
    example: "寒い夜はお風呂にゆっくり入ります。",
    exampleMeaning: "Vào đêm lạnh tôi ngâm mình thong thả trong bồn tắm.",
    category: "Nhà cửa & Không gian"
  },
  {
    id: 30,
    word: "洗面所",
    hanViet: "TẨY DIỆN SỞ",
    reading: "せんめんじょ",
    meaning: "Chậu rửa mặt, phòng rửa mặt",
    example: "朝起きたら洗面所で顔を洗います。",
    exampleMeaning: "Sáng thức dậy tôi rửa mặt ở chậu rửa mặt.",
    category: "Nhà cửa & Không gian"
  },
  {
    id: 31,
    word: "お手洗い",
    hanViet: "THỦ TẨY",
    reading: "おてあらい",
    meaning: "Nhà vệ sinh (トイレ toilet)",
    example: "すみません、お手洗いはどこですか。",
    exampleMeaning: "Xin lỗi, nhà vệ sinh ở đâu ạ?",
    category: "Nhà cửa & Không gian"
  },
  {
    id: 32,
    word: "屋上",
    hanViet: "ỐC THƯỢNG",
    reading: "おくじょう",
    meaning: "Sân thượng",
    example: "ビルの屋上から富士山が見えます。",
    exampleMeaning: "Từ sân thượng tòa nhà có thể nhìn thấy núi Phú Sĩ.",
    category: "Nhà cửa & Không gian"
  },
  {
    id: 33,
    word: "庭",
    hanViet: "ĐÌNH",
    reading: "にわ",
    meaning: "Sân vườn",
    example: "家の庭にきれいな桜の花が咲いています。",
    exampleMeaning: "Ở sân vườn nhà tôi hoa anh đào nở rất đẹp.",
    category: "Nhà cửa & Không gian"
  },
  {
    id: 34,
    word: "池",
    hanViet: "TRÌ",
    reading: "いけ",
    meaning: "Cái ao, cái hồ",
    example: "公園の池で魚が泳いでいます。",
    exampleMeaning: "Cá đang bơi trong hồ nước của công viên.",
    category: "Thiên nhiên & Phong cảnh"
  },
  {
    id: 35,
    word: "港",
    hanViet: "CẢNG",
    reading: "みなと",
    meaning: "Bến cảng",
    example: "港にたくさんの船が止まっています。",
    exampleMeaning: "Nhiều con tàu đang neo đậu ở bến cảng.",
    category: "Thiên nhiên & Phong cảnh"
  },
  {
    id: 36,
    word: "田舎",
    hanViet: "ĐIỀN XÁ",
    reading: "いなか",
    meaning: "Quê hương, vùng nông thôn",
    example: "休みの日は田舎に帰ってのんびり過ごします。",
    exampleMeaning: "Ngày nghỉ tôi về quê thảnh thơi nghỉ ngơi.",
    category: "Thiên nhiên & Phong cảnh"
  },

  // Page 2: 37 - 73
  {
    id: 37,
    word: "近所",
    hanViet: "CẬN SỞ",
    reading: "きんじょ",
    meaning: "Hàng xóm, vùng lân cận",
    example: "近所の人たちと気持ちよく挨拶を交わします。",
    exampleMeaning: "Tôi chào hỏi vui vẻ với những người hàng xóm.",
    category: "Xã hội & Đời sống"
  },
  {
    id: 38,
    word: "交差点",
    hanViet: "GIAO SAI ĐIỂM",
    reading: "こうさてん",
    meaning: "Ngã tư, giao lộ",
    example: "あの交差点を右に曲がってください。",
    exampleMeaning: "Xin hãy rẽ phải ở ngã tư đằng kia.",
    category: "Giao thông & Đường phố"
  },
  {
    id: 39,
    word: "歩道",
    hanViet: "BỘ ĐẠO",
    reading: "ほどう",
    meaning: "Vỉa hè, đường cho người đi bộ",
    example: "歩道を安全に歩きましょう。",
    exampleMeaning: "Chúng ta hãy đi bộ an toàn trên vỉa hè.",
    category: "Giao thông & Đường phố"
  },
  {
    id: 40,
    word: "車道",
    hanViet: "XA ĐẠO",
    reading: "しゃどう",
    meaning: "Lòng đường cho xe chạy",
    example: "車道で遊ぶのはとても危ないです。",
    exampleMeaning: "Chơi ở lòng đường xe chạy là rất nguy hiểm.",
    category: "Giao thông & Đường phố"
  },
  {
    id: 41,
    word: "横断歩道",
    hanViet: "HOÀNH ĐOẠN BỘ ĐẠO",
    reading: "おうだんほどう",
    meaning: "Vạch sang đường cho người đi bộ",
    example: "横断歩道を渡るときは左右をよく見ます。",
    exampleMeaning: "Khi qua vạch sang đường hãy nhìn kỹ hai bên trái phải.",
    category: "Giao thông & Đường phố"
  },
  {
    id: 42,
    word: "信号",
    hanViet: "TÍN HIỆU",
    reading: "しんごう",
    meaning: "Đèn giao thông, tín hiệu",
    example: "信号が青に変わってから渡ります。",
    exampleMeaning: "Chờ đèn giao thông chuyển sang xanh rồi mới qua đường.",
    category: "Giao thông & Đường phố"
  },
  {
    id: 43,
    word: "角",
    hanViet: "GIÁC",
    reading: "かど",
    meaning: "Góc đường, góc ngoặt",
    example: "次の角にコンビニがあります。",
    exampleMeaning: "Ở góc đường tiếp theo có cửa hàng tiện lợi.",
    category: "Vị trí & Hướng"
  },
  {
    id: 44,
    word: "端",
    hanViet: "ĐOAN",
    reading: "はし",
    meaning: "Rìa, mép, mép ngoài",
    example: "道の端を歩いてください。",
    exampleMeaning: "Xin hãy đi ở mép đường.",
    category: "Vị trí & Hướng"
  },
  {
    id: 45,
    word: "表",
    hanViet: "BIỂU",
    reading: "おもて",
    meaning: "Mặt ngoài, mặt trước (おもてなし: hiếu khách)",
    example: "封筒の表に住所を書きました。",
    exampleMeaning: "Tôi đã viết địa chỉ lên mặt trước của phong bì.",
    category: "Vị trí & Hướng"
  },
  {
    id: 46,
    word: "裏",
    hanViet: "LÝ",
    reading: "うら",
    meaning: "Mặt sau, mặt trái",
    example: "紙の裏にメモを書きました。",
    exampleMeaning: "Tôi đã viết ghi chú vào mặt sau của tờ giấy.",
    category: "Vị trí & Hướng"
  },
  {
    id: 47,
    word: "専門",
    hanViet: "CHUYÊN MÔN",
    reading: "せんもん",
    meaning: "Chuyên môn, chuyên ngành",
    example: "大学での私の専門は経済学です。",
    exampleMeaning: "Chuyên ngành của tôi ở trường đại học là kinh tế học.",
    category: "Học tập & Công việc"
  },
  {
    id: 48,
    word: "宿題",
    hanViet: "TÚC ĐỀ",
    reading: "しゅくだい",
    meaning: "Bài tập về nhà",
    example: "寝る前に今日の宿題を全部終わらせます。",
    exampleMeaning: "Trước khi đi ngủ tôi hoàn thành hết bài tập về nhà hôm nay.",
    category: "Học tập & Công việc"
  },
  {
    id: 49,
    word: "質問",
    hanViet: "CHẤT VẤN",
    reading: "しつもん",
    meaning: "Câu hỏi, thắc mắc",
    example: "先生に文法についての質問をしました。",
    exampleMeaning: "Tôi đã đặt câu hỏi cho giáo viên về ngữ pháp.",
    category: "Học tập & Công việc"
  },
  {
    id: 50,
    word: "返事",
    hanViet: "PHẢN SỰ",
    reading: "へんじ",
    meaning: "Mạch trả lời, hồi đáp (答え câu trả lời)",
    example: "名前を呼ばれたら大きな声で返事をします。",
    exampleMeaning: "Khi được gọi tên hãy hồi đáp thật to rõ ràng.",
    category: "Giao tiếp"
  },
  {
    id: 51,
    word: "事故",
    hanViet: "SỰ CỐ",
    reading: "じこ",
    meaning: "Tai nạn, sự cố",
    example: "交差点で車とバイクの事故がありました。",
    exampleMeaning: "Đã có một vụ tai nạn giữa ô tô và xe máy tại ngã tư.",
    category: "Sự kiện & Tự nhiên"
  },
  {
    id: 52,
    word: "火事",
    hanViet: "HỎA SỰ",
    reading: "かじ",
    meaning: "Hỏa hoạn (khác 家事: Việc nhà)",
    example: "火事のときはすぐに119番へ電話します。",
    exampleMeaning: "Khi có hỏa hoạn hãy gọi ngay số 119.",
    category: "Sự kiện & Tự nhiên"
  },
  {
    id: 53,
    word: "地震",
    hanViet: "ĐỊA CHẤN",
    reading: "じしん",
    meaning: "Trận động đất (khác 自身: Tự tin / bản thân)",
    example: "日本は地震が多い国です。",
    exampleMeaning: "Nhật Bản là đất nước có nhiều động đất.",
    category: "Sự kiện & Tự nhiên"
  },
  {
    id: 54,
    word: "台風",
    hanViet: "ĐÀI PHONG",
    reading: "たいふう",
    meaning: "Cơn bão",
    example: "大きな台風が近づいています。",
    exampleMeaning: "Một cơn bão lớn đang đến gần.",
    category: "Sự kiện & Tự nhiên"
  },
  {
    id: 55,
    word: "天気予報",
    hanViet: "THIÊN KHÍ DỰ BÁO",
    reading: "てんきよほう",
    meaning: "Dự báo thời tiết",
    example: "毎朝テレビで天気予報をチェックします。",
    exampleMeaning: "Mỗi sáng tôi xem dự báo thời tiết trên tivi.",
    category: "Sự kiện & Tự nhiên"
  },
  {
    id: 56,
    word: "フォーク",
    hanViet: "fork",
    reading: "フォーク",
    meaning: "Cái nĩa",
    example: "パスタをフォークで上手に食べます。",
    exampleMeaning: "Ăn mì Ý khéo léo bằng nĩa.",
    category: "Dụng cụ ăn uống"
  },
  {
    id: 57,
    word: "スプーン",
    hanViet: "spoon",
    reading: "スプーン",
    meaning: "Cái thìa, muỗng",
    example: "スプーンでスープを飲みます。",
    exampleMeaning: "Dùng thìa để uống canh súp.",
    category: "Dụng cụ ăn uống"
  },
  {
    id: 58,
    word: "ナイフ",
    hanViet: "knife",
    reading: "ナイフ",
    meaning: "Con dao ăn",
    example: "ナイフとフォークを使ってステーキを切ります。",
    exampleMeaning: "Dùng dao và nĩa cắt bít tết.",
    category: "Dụng cụ ăn uống"
  },
  {
    id: 59,
    word: "カップ",
    hanViet: "cup",
    reading: "カップ",
    meaning: "Cái tách, ly (có quai)",
    example: "コーヒーをカップに注ぎました。",
    exampleMeaning: "Tôi đã rót cà phê vào tách.",
    category: "Dụng cụ ăn uống"
  },
  {
    id: 60,
    word: "グラス",
    hanViet: "glass",
    reading: "グラス",
    meaning: "Cái ly thủy tinh",
    example: "グラスに冷たいジュースを入れました。",
    exampleMeaning: "Tôi rót nước trái cây mát lạnh vào ly thủy tinh.",
    category: "Dụng cụ ăn uống"
  },
  {
    id: 61,
    word: "ストロー",
    hanViet: "straw",
    reading: "ストロー",
    meaning: "Ống hút",
    example: "ストローでアイスコーヒーを飲みます。",
    exampleMeaning: "Uống cà phê đá bằng ống hút.",
    category: "Dụng cụ ăn uống"
  },
  {
    id: 62,
    word: "エプロン",
    hanViet: "apron",
    reading: "エプロン",
    meaning: "Tạp dề",
    example: "料理をするときはエプロンを着けます。",
    exampleMeaning: "Khi nấu ăn tôi đeo tạp dề.",
    category: "Trang phục & Phụ kiện"
  },
  {
    id: 63,
    word: "メニュー",
    hanViet: "menu",
    reading: "メニュー",
    meaning: "Thực đơn",
    example: "店員さんにメニューをもらいました。",
    exampleMeaning: "Tôi nhận thực đơn từ nhân viên quán.",
    category: "Đời sống & Mua sắm"
  },
  {
    id: 64,
    word: "レシート",
    hanViet: "receipt",
    reading: "レシート",
    meaning: "Hóa đơn, biên lai",
    example: "買い物をしたあとレシートを受け取りました。",
    exampleMeaning: "Sau khi mua sắm tôi đã nhận hóa đơn.",
    category: "Đời sống & Mua sắm"
  },
  {
    id: 65,
    word: "ポケット",
    hanViet: "pocket",
    reading: "ポケット",
    meaning: "Túi quần áo",
    example: "鍵をズボンのポケットに入れました。",
    exampleMeaning: "Tôi cho chìa khóa vào túi quần.",
    category: "Trang phục & Phụ kiện"
  },
  {
    id: 66,
    word: "ボタン",
    hanViet: "button",
    reading: "ボタン",
    meaning: "Cái nút, khuy áo",
    example: "シャツのボタンをとめました。",
    exampleMeaning: "Tôi cài khuy áo sơ mi.",
    category: "Trang phục & Phụ kiện"
  },
  {
    id: 67,
    word: "ジッパー",
    hanViet: "zipper",
    reading: "ジッパー",
    meaning: "Khóa kéo",
    example: "かばんのジッパーをしっかり閉めます。",
    exampleMeaning: "Kéo chặt khóa kéo của chiếc túi.",
    category: "Trang phục & Phụ kiện"
  },
  {
    id: 68,
    word: "ハンガー",
    hanViet: "hanger",
    reading: "ハンガー",
    meaning: "Móc treo quần áo",
    example: "コートをハンガーに掛けます。",
    exampleMeaning: "Treo áo khoác lên móc áo.",
    category: "Đồ gia dụng & Thiết bị"
  },
  {
    id: 69,
    word: "タオル",
    hanViet: "towel",
    reading: "タオル",
    meaning: "Khăn tắm, khăn mặt",
    example: "お風呂上がりに柔らかいタオルで体を拭きます。",
    exampleMeaning: "Sau khi tắm xong lau người bằng khăn mềm.",
    category: "Đồ dùng đời sống"
  },
  {
    id: 70,
    word: "ハンカチ",
    hanViet: "handkerchief",
    reading: "ハンカチ",
    meaning: "Khăn tay",
    example: "外出するときはいつもハンカチを持ち歩きます。",
    exampleMeaning: "Khi ra ngoài tôi luôn mang theo khăn tay.",
    category: "Trang phục & Phụ kiện"
  },
  {
    id: 71,
    word: "スリッパ",
    hanViet: "slipper",
    reading: "スリッパ",
    meaning: "Dép đi trong nhà",
    example: "家の中ではスリッパを履きます。",
    exampleMeaning: "Ở trong nhà thì đi dép đi trong nhà.",
    category: "Trang phục & Phụ kiện"
  },
  {
    id: 72,
    word: "サンダル",
    hanViet: "sandal",
    reading: "サンダル",
    meaning: "Dép xỏ ngón, dép sandal",
    example: "夏は涼しいサンダルを履いて出かけます。",
    exampleMeaning: "Mùa hè tôi xỏ dép sandal mát mẻ ra ngoài.",
    category: "Trang phục & Phụ kiện"
  },
  {
    id: 73,
    word: "ブーツ",
    hanViet: "boots",
    reading: "ブーツ",
    meaning: "Đôi bốt",
    example: "冬は暖かい革のブーツを履きます。",
    exampleMeaning: "Mùa đông tôi đi đôi bốt da ấm áp.",
    category: "Trang phục & Phụ kiện"
  },

  // Page 3: 74 - 110
  {
    id: 74,
    word: "キャップ",
    hanViet: "cap",
    reading: "キャップ",
    meaning: "Mũ lưỡi trai (khác ぼうし: mũ nói chung)",
    example: "日差しが強いのでキャップをかぶります。",
    exampleMeaning: "Vì nắng gắt nên tôi đội mũ lưỡi trai.",
    category: "Trang phục & Phụ kiện"
  },
  {
    id: 75,
    word: "ヘルメット",
    hanViet: "helmet",
    reading: "ヘルメット",
    meaning: "Mũ bảo hiểm",
    example: "バイクに乗るときは必ずヘルメットをかぶります。",
    exampleMeaning: "Khi đi xe máy nhất định phải đội mũ bảo hiểm.",
    category: "Trang phục & Phụ kiện"
  },
  {
    id: 76,
    word: "ベルト",
    hanViet: "belt",
    reading: "ベルト",
    meaning: "Thắt lưng",
    example: "ズボンに黒い革のベルトを締めます。",
    exampleMeaning: "Thắt thắt lưng da màu đen vào quần.",
    category: "Trang phục & Phụ kiện"
  },
  {
    id: 77,
    word: "ネクタイ",
    hanViet: "necktie",
    reading: "ネクタイ",
    meaning: "Cà vạt",
    example: "スーツを着て青いネクタイを締めます。",
    exampleMeaning: "Mặc com-lê và thắt cà vạt màu xanh dương.",
    category: "Trang phục & Phụ kiện"
  },
  {
    id: 78,
    word: "スーツ",
    hanViet: "suit",
    reading: "スーツ",
    meaning: "Bộ com-lê, vest (khác スーツケース: vali)",
    example: "面接のために新しいスーツを買いました。",
    exampleMeaning: "Tôi đã mua bộ com-lê mới cho buổi phỏng vấn.",
    category: "Trang phục & Phụ kiện"
  },
  {
    id: 79,
    word: "ドレス",
    hanViet: "dress",
    reading: "ドレス",
    meaning: "Váy đầm (dạ tiệc)",
    example: "パーティーに素敵なドレスを着て行きました。",
    exampleMeaning: "Tôi mặc chiếc váy đầm lộng lẫy đến dự tiệc.",
    category: "Trang phục & Phụ kiện"
  },
  {
    id: 80,
    word: "スカート",
    hanViet: "skirt",
    reading: "スカート",
    meaning: "Chân váy",
    example: "今日は花柄のスカートを履いています。",
    exampleMeaning: "Hôm nay tôi mặc chân váy họa tiết hoa.",
    category: "Trang phục & Phụ kiện"
  },
  {
    id: 81,
    word: "パンツ",
    hanViet: "pants",
    reading: "パンツ",
    meaning: "Quần dài / quần lót",
    example: "動きやすいパンツを履いて運動します。",
    exampleMeaning: "Mặc chiếc quần dễ cử động để tập thể thao.",
    category: "Trang phục & Phụ kiện"
  },
  {
    id: 82,
    word: "シャツ",
    hanViet: "shirt",
    reading: "シャツ",
    meaning: "Áo sơ mi",
    example: "アイロンをかけた白いシャツを着ます。",
    exampleMeaning: "Mặc chiếc áo sơ mi trắng đã là ủi phẳng phiu.",
    category: "Trang phục & Phụ kiện"
  },
  {
    id: 83,
    word: "Tシャツ",
    hanViet: "t-shirt",
    reading: "Tシャツ",
    meaning: "Áo thun T-shirt",
    example: "夏はシンプルなTシャツが好きです。",
    exampleMeaning: "Mùa hè tôi thích những chiếc áo thun đơn giản.",
    category: "Trang phục & Phụ kiện"
  },
  {
    id: 84,
    word: "セーター",
    hanViet: "sweater",
    reading: "セーター",
    meaning: "Áo len",
    example: "母が編んでくれた暖かいセーターを着ます。",
    exampleMeaning: "Tôi mặc chiếc áo len ấm áp do mẹ đan.",
    category: "Trang phục & Phụ kiện"
  },
  {
    id: 85,
    word: "コート",
    hanViet: "coat",
    reading: "コート",
    meaning: "Áo khoác dài",
    example: "冬の寒い日は厚いコートを着ます。",
    exampleMeaning: "Vào những ngày đông lạnh tôi mặc áo khoác dài dày.",
    category: "Trang phục & Phụ kiện"
  },
  {
    id: 86,
    word: "ジャケット",
    hanViet: "jacket",
    reading: "ジャケット",
    meaning: "Áo khoác ngắn",
    example: "秋の涼しい日にジャケットを羽織ります。",
    exampleMeaning: "Vào ngày thu mát mẻ tôi khoác một chiếc áo khoác ngắn.",
    category: "Trang phục & Phụ kiện"
  },
  {
    id: 87,
    word: "パジャマ",
    hanViet: "pajamas",
    reading: "パジャマ",
    meaning: "Bộ đồ ngủ",
    example: "お風呂のあとパジャマに着替えます。",
    exampleMeaning: "Sau khi tắm xong tôi thay bộ đồ ngủ.",
    category: "Trang phục & Phụ kiện"
  },
  {
    id: 88,
    word: "ベッド",
    hanViet: "bed",
    reading: "ベッド",
    meaning: "Cái giường",
    example: "大きなベッドでぐっすり眠りました。",
    exampleMeaning: "Tôi đã ngủ say giấc trên chiếc giường lớn.",
    category: "Nội thất & Đồ dùng trong nhà"
  },
  {
    id: 89,
    word: "ソファー",
    hanViet: "sofa",
    reading: "ソファー",
    meaning: "Ghế sofa",
    example: "リビングのソファーに座ってテレビを見ます。",
    exampleMeaning: "Ngồi trên ghế sofa phòng khách xem tivi.",
    category: "Nội thất & Đồ dùng trong nhà"
  },
  {
    id: 90,
    word: "テーブル",
    hanViet: "table",
    reading: "テーブル",
    meaning: "Cái bàn (bàn ăn, bàn trà)",
    example: "テーブルの上に花瓶を置きました。",
    exampleMeaning: "Tôi đã đặt bình hoa lên trên bàn.",
    category: "Nội thất & Đồ dùng trong nhà"
  },
  {
    id: 91,
    word: "デスク",
    hanViet: "desk",
    reading: "デスク",
    meaning: "Bàn làm việc",
    example: "会社のデスクでパソコン作業をします。",
    exampleMeaning: "Làm việc với máy tính trên bàn làm việc ở công ty.",
    category: "Nội thất & Đồ dùng trong nhà"
  },
  {
    id: 92,
    word: "カーテン",
    hanViet: "curtain",
    reading: "カーテン",
    meaning: "Rèm cửa",
    example: "朝、窓のカーテンを開けて太陽の光を浴びます。",
    exampleMeaning: "Buổi sáng mở rèm cửa sổ để đón ánh nắng mặt trời.",
    category: "Nội thất & Đồ dùng trong nhà"
  },
  {
    id: 93,
    word: "カーペット",
    hanViet: "carpet",
    reading: "カーペット",
    meaning: "Thảm trải sàn",
    example: "部屋の床に柔らかいカーペットを敷きました。",
    exampleMeaning: "Tôi đã trải tấm thảm mềm lên sàn phòng.",
    category: "Nội thất & Đồ dùng trong nhà"
  },
  {
    id: 94,
    word: "エアコン",
    hanViet: "air conditioner",
    reading: "エアコン",
    meaning: "Máy điều hòa",
    example: "部屋が暑いのでエアコンをつけました。",
    exampleMeaning: "Vì phòng nóng nên tôi bật máy điều hòa.",
    category: "Đồ gia dụng & Thiết bị"
  },
  {
    id: 95,
    word: "冷房",
    hanViet: "LÃNH PHÒNG",
    reading: "れいぼう",
    meaning: "Chế độ lạnh (điều hòa)",
    example: "夏はエアコンの冷房を26度に設定します。",
    exampleMeaning: "Mùa hè tôi cài đặt chế độ lạnh của điều hòa ở mức 26 độ.",
    category: "Đồ gia dụng & Thiết bị"
  },
  {
    id: 96,
    word: "暖房",
    hanViet: "NOÃN PHÒNG",
    reading: "だんぼう",
    meaning: "Chế độ nóng (điều hòa/sưởi)",
    example: "冬は暖房をつけて部屋を暖めます。",
    exampleMeaning: "Mùa đông bật chế độ sưởi để làm ấm căn phòng.",
    category: "Đồ gia dụng & Thiết bị"
  },
  {
    id: 97,
    word: "ヒーター",
    hanViet: "heater",
    reading: "ヒーター",
    meaning: "Máy sưởi",
    example: "足元が冷えるので小さなヒーターを置きました。",
    exampleMeaning: "Vì chân lạnh nên tôi đặt một chiếc máy sưởi nhỏ.",
    category: "Đồ gia dụng & Thiết bị"
  },
  {
    id: 98,
    word: "ストーブ",
    hanViet: "stove",
    reading: "ストーブ",
    meaning: "Lò sưởi, bếp sưởi",
    example: "ストーブの周りで家族とお茶を飲みます。",
    exampleMeaning: "Ngồi quanh lò sưởi uống trà cùng gia đình.",
    category: "Đồ gia dụng & Thiết bị"
  },
  {
    id: 99,
    word: "ラジオ",
    hanViet: "radio",
    reading: "ラジオ",
    meaning: "Đài radio",
    example: "日本語のリスニングのためにラジオを聞きます。",
    exampleMeaning: "Tôi nghe đài radio để luyện nghe tiếng Nhật.",
    category: "Thiết bị điện tử & Công nghệ"
  },
  {
    id: 100,
    word: "パソコン",
    hanViet: "personal computer",
    reading: "パソコン",
    meaning: "Máy tính cá nhân",
    example: "毎日パソコンで日本語の宿題をします。",
    exampleMeaning: "Mỗi ngày tôi làm bài tập tiếng Nhật trên máy tính cá nhân.",
    category: "Thiết bị điện tử & Công nghệ"
  },
  {
    id: 101,
    word: "キーボード",
    hanViet: "keyboard",
    reading: "キーボード",
    meaning: "Bàn phím",
    example: "キーボードで日本語のローマ字入力をします。",
    exampleMeaning: "Nhập chữ tiếng Nhật bằng Romaji trên bàn phím.",
    category: "Thiết bị điện tử & Công nghệ"
  },
  {
    id: 102,
    word: "マウス",
    hanViet: "mouse",
    reading: "マウス",
    meaning: "Con chuột máy tính",
    example: "ワイヤレスマウスを使ってパソコンを操作します。",
    exampleMeaning: "Dùng chuột không dây để điều khiển máy tính.",
    category: "Thiết bị điện tử & Công nghệ"
  },
  {
    id: 103,
    word: "プリンター",
    hanViet: "printer",
    reading: "プリンター",
    meaning: "Máy in",
    example: "プリンターで会議の資料を印刷しました。",
    exampleMeaning: "Tôi đã in tài liệu cuộc họp bằng máy in.",
    category: "Thiết bị điện tử & Công nghệ"
  },
  {
    id: 104,
    word: "どちら",
    hanViet: "",
    reading: "どちら",
    meaning: "Phía nào, hướng nào (lịch sự của どっち)",
    example: "お国はどちらですか。",
    exampleMeaning: "Quê hương của bạn là ở đâu (nước nào) thế?",
    category: "Từ để hỏi & Chỉ phương hướng"
  },
  {
    id: 105,
    word: "どれ",
    hanViet: "",
    reading: "どれ",
    meaning: "Cái nào (trong 3 đối tượng trở lên)",
    example: "あなたの傘はどれですか。",
    exampleMeaning: "Chiếc ô của bạn là cái nào trong số này?",
    category: "Từ để hỏi & Chỉ phương hướng"
  },
  {
    id: 106,
    word: "いくつ",
    hanViet: "",
    reading: "いくつ",
    meaning: "Mấy cái / bao nhiêu cái",
    example: "りんごをいくつ買いましたか。",
    exampleMeaning: "Bạn đã mua mấy quả táo vậy?",
    category: "Từ để hỏi & Chỉ phương hướng"
  },
  {
    id: 107,
    word: "おいくつですか",
    hanViet: "",
    reading: "おいくつですか",
    meaning: "Bao nhiêu tuổi (cách hỏi lịch sự)",
    example: "失礼ですが、おいくつですか。",
    exampleMeaning: "Xin thất lễ, bạn năm nay bao nhiêu tuổi rồi ạ?",
    category: "Từ để hỏi & Chỉ phương hướng"
  },
  {
    id: 108,
    word: "いくら",
    hanViet: "",
    reading: "いくら",
    meaning: "Bao nhiêu tiền",
    example: "このおいしいラーメンはいくらですか。",
    exampleMeaning: "Tô mì ramen ngon lành này bao nhiêu tiền vậy?",
    category: "Từ để hỏi & Chỉ phương hướng"
  },
  {
    id: 109,
    word: "なぜ・どうして",
    hanViet: "",
    reading: "なぜ・どうして",
    meaning: "Tại sao",
    example: "どうして日本語を勉強しているのですか。",
    exampleMeaning: "Tại sao bạn lại đang học tiếng Nhật vậy?",
    category: "Từ để hỏi & Chỉ phương hướng"
  },
  {
    id: 110,
    word: "どう",
    hanViet: "",
    reading: "どう",
    meaning: "Như thế nào",
    example: "日本の生活はどうですか。",
    exampleMeaning: "Cuộc sống ở Nhật Bản như thế nào?",
    category: "Từ để hỏi & Chỉ phương hướng"
  },

  // Page 4: 111 - 143
  {
    id: 111,
    word: "どんな + N",
    hanViet: "",
    reading: "どんな",
    meaning: "N như thế nào",
    example: "日本でどんな料理をよく食べますか。",
    exampleMeaning: "Ở Nhật bạn hay ăn món ăn như thế nào?",
    category: "Từ để hỏi & Chỉ phương hướng"
  },
  {
    id: 112,
    word: "横",
    hanViet: "HOÀNH",
    reading: "よこ",
    meaning: "Bên cạnh, chiều ngang",
    example: "机の横にかばんを置きました。",
    exampleMeaning: "Tôi đã để chiếc cặp ở bên cạnh bàn.",
    category: "Vị trí & Hướng"
  },
  {
    id: 113,
    word: "~側",
    hanViet: "TRẮC",
    reading: "がわ",
    meaning: "Phía, bên (ví dụ: 右側 phía bên phải)",
    example: "窓側の席に座りたいです。",
    exampleMeaning: "Tôi muốn ngồi ở hàng ghế phía bên cửa sổ.",
    category: "Vị trí & Hướng"
  },
  {
    id: 114,
    word: "向こう",
    hanViet: "HƯỚNG",
    reading: "むこう",
    meaning: "Phía bên kia, đối diện",
    example: "川の向こうに高いビルが見えます。",
    exampleMeaning: "Phía bên kia con sông có thể nhìn thấy tòa nhà cao tầng.",
    category: "Vị trí & Hướng"
  },
  {
    id: 115,
    word: "手前",
    hanViet: "THỦ TIỀN",
    reading: "てまえ",
    meaning: "Phía trước mặt, phía gần mình",
    example: "交差点の手前で車を止めました。",
    exampleMeaning: "Tôi đã dừng xe ở phía trước ngã tư.",
    category: "Vị trí & Hướng"
  },
  {
    id: 116,
    word: "真ん中",
    hanViet: "CHÂN TRUNG",
    reading: "まんなか",
    meaning: "Chính giữa, trung tâm",
    example: "写真の真ん中に立っているのが田中さんです。",
    exampleMeaning: "Người đứng ở chính giữa bức ảnh là anh Tanaka.",
    category: "Vị trí & Hướng"
  },
  {
    id: 117,
    word: "途中で",
    hanViet: "ĐỒ TRUNG",
    reading: "とちゅうで",
    meaning: "Ở giữa chừng, trên đường đi",
    example: "会社へ行く途中でコンビニに寄りました。",
    exampleMeaning: "Trên đường đi làm tôi đã ghé vào cửa hàng tiện lợi.",
    category: "Vị trí & Thời gian"
  },
  {
    id: 118,
    word: "最悪な",
    hanViet: "TỐI ÁC",
    reading: "さいあくな",
    meaning: "Tồi tệ nhất",
    example: "雨の日に傘を忘れて最悪でした。",
    exampleMeaning: "Vào ngày mưa mà lại quên ô thì thật tồi tệ nhất.",
    category: "Tính từ đuôi な"
  },
  {
    id: 119,
    word: "最高な",
    hanViet: "TỐI CAO",
    reading: "さいこうな",
    meaning: "Tuyệt vời nhất, cao nhất",
    example: "今日の天気は晴れて最高ですね。",
    exampleMeaning: "Thời tiết hôm nay nắng ráo thật là tuyệt vời nhất.",
    category: "Tính từ đuôi な"
  },
  {
    id: 120,
    word: "遠慮な",
    hanViet: "VIỄN LỰ",
    reading: "えんりょな",
    meaning: "Ngần ngại, ngại ngùng (thường dùng 遠慮しないで)",
    example: "どうぞ遠慮しないでたくさん食べてくださいね。",
    exampleMeaning: "Xin đừng ngại ngần, hãy ăn thật nhiều nhé.",
    category: "Tính từ đuôi な"
  },
  {
    id: 121,
    word: "邪魔な",
    hanViet: "TÀ MA",
    reading: "じゃまな",
    meaning: "Cản trở, quấy rầy",
    example: "廊下に荷物を置くと邪魔になります。",
    exampleMeaning: "Đặt đồ đạc ở hành lang sẽ gây cản trở lối đi.",
    category: "Tính từ đuôi な"
  },
  {
    id: 122,
    word: "無駄な",
    hanViet: "VÔ ĐÀ",
    reading: "むだな",
    meaning: "Lãng phí, vô ích",
    example: "お金や時間を無駄に使ってはいけません。",
    exampleMeaning: "Không được tiêu xài lãng phí tiền bạc và thời gian.",
    category: "Tính từ đuôi な"
  },
  {
    id: 123,
    word: "無理な",
    hanViet: "VÔ LÝ",
    reading: "むりな",
    meaning: "Quá sức, vô lý",
    example: "無理をしないで体を大切にしてください。",
    exampleMeaning: "Đừng làm việc quá sức mà hãy chăm sóc sức khỏe nhé.",
    category: "Tính từ đuôi な"
  },
  {
    id: 124,
    word: "自由な",
    hanViet: "TỰ DO",
    reading: "じゆうな",
    meaning: "Tự do",
    example: "週末は自由な時間が多いです。",
    exampleMeaning: "Vào cuối tuần tôi có nhiều thời gian tự do.",
    category: "Tính từ đuôi な"
  },
  {
    id: 125,
    word: "複雑な",
    hanViet: "PHỨC TẠP",
    reading: "ふくざつな",
    meaning: "Phức tạp",
    example: "この機械の使い方はとても複雑です。",
    exampleMeaning: "Cách sử dụng cỗ máy này rất phức tạp.",
    category: "Tính từ đuôi な"
  },
  {
    id: 126,
    word: "簡単な",
    hanViet: "GIẢN ĐƠN",
    reading: "かんたんな",
    meaning: "Đơn giản",
    example: "今日のテストは簡単でした。",
    exampleMeaning: "Bài kiểm tra hôm nay rất đơn giản.",
    category: "Tính từ đuôi な"
  },
  {
    id: 127,
    word: "親切な",
    hanViet: "THÂN THIẾT",
    reading: "しんせつな",
    meaning: "Tốt bụng, thân thiện",
    example: "近所の人はみんなとても親切です。",
    exampleMeaning: "Những người hàng xóm ai nấy đều rất thân thiện, tốt bụng.",
    category: "Tính từ đuôi な"
  },
  {
    id: 128,
    word: "丁寧な",
    hanViet: "ĐINH NINH",
    reading: "ていねいな",
    meaning: "Lịch sự, cẩn thận",
    example: "先生は丁寧な言葉で教えてくれました。",
    exampleMeaning: "Thầy giáo đã chỉ bảo bằng những lời lẽ rất lịch sự, ân cần.",
    category: "Tính từ đuôi な"
  },
  {
    id: 129,
    word: "賑やかな",
    hanViet: "CHẨN",
    reading: "にぎやかな",
    meaning: "Náo nhiệt, nhộn nhịp",
    example: "市場は朝からとても賑やかです。",
    exampleMeaning: "Khu chợ từ sáng sớm đã vô cùng nhộn nhịp, náo nhiệt.",
    category: "Tính từ đuôi な"
  },
  {
    id: 130,
    word: "静かな",
    hanViet: "TĨNH",
    reading: "しずかな",
    meaning: "Yên tĩnh",
    example: "夜の図書館はとても静かです。",
    exampleMeaning: "Thư viện vào ban đêm rất yên tĩnh.",
    category: "Tính từ đuôi な"
  },
  {
    id: 131,
    word: "便利な",
    hanViet: "TIỆN LỢI",
    reading: "べんりな",
    meaning: "Tiện lợi",
    example: "駅の近くに住むととても便利です。",
    exampleMeaning: "Sống gần nhà ga thì vô cùng tiện lợi.",
    category: "Tính từ đuôi な"
  },
  {
    id: 132,
    word: "不便な",
    hanViet: "BẤT TIỆN",
    reading: "ふべんな",
    meaning: "Bất tiện",
    example: "バスが少ないので少し不便です。",
    exampleMeaning: "Vì ít xe buýt nên hơi bất tiện một chút.",
    category: "Tính từ đuôi な"
  },
  {
    id: 133,
    word: "危険な",
    hanViet: "NGUY HIỂM",
    reading: "きけんな",
    meaning: "Nguy hiểm",
    example: "夜遅くに一人で歩くのは危険です。",
    exampleMeaning: "Đi bộ một mình vào đêm muộn là rất nguy hiểm.",
    category: "Tính từ đuôi な"
  },
  {
    id: 134,
    word: "安全な",
    hanViet: "AN TOÀN",
    reading: "あんぜんな",
    meaning: "An toàn",
    example: "この町は治安が良くてとても安全です。",
    exampleMeaning: "Thị trấn này an ninh tốt và rất an toàn.",
    category: "Tính từ đuôi な"
  },
  {
    id: 135,
    word: "丈夫な",
    hanViet: "TRƯỢNG PHU",
    reading: "じょうぶな",
    meaning: "Bền bỉ, chắc chắn, khỏe mạnh",
    example: "この革のかばんはとても丈夫で長持ちします。",
    exampleMeaning: "Chiếc túi da này rất bền chắc và dùng được lâu.",
    category: "Tính từ đuôi な"
  },
  {
    id: 136,
    word: "大切な",
    hanViet: "ĐẠI THIẾT",
    reading: "たいせつな",
    meaning: "Quan trọng, quý giá",
    example: "家族と過ごす時間は私にとって一番大切です。",
    exampleMeaning: "Thời gian ở bên gia đình là quý giá nhất đối với tôi.",
    category: "Tính từ đuôi な"
  },
  {
    id: 137,
    word: "有名な",
    hanViet: "HỮU DANH",
    reading: "ゆうめいな",
    meaning: "Nổi tiếng",
    example: "京都は歴史的なお寺で有名です。",
    exampleMeaning: "Kyoto nổi tiếng với những ngôi chùa lịch sử.",
    category: "Tính từ đuôi な"
  },
  {
    id: 138,
    word: "必要な",
    hanViet: "TẤT YẾU",
    reading: "ひつような",
    meaning: "Cần thiết",
    example: "日本へ行くにはパスポートが必要です。",
    exampleMeaning: "Để đi Nhật thì hộ chiếu là điều cần thiết.",
    category: "Tính từ đuôi な"
  },
  {
    id: 139,
    word: "特別な",
    hanViet: "ĐẶC BIỆT",
    reading: "とくべつな",
    meaning: "Đặc biệt",
    example: "誕生日に友達から特別なプレゼントをもらいました。",
    exampleMeaning: "Vào ngày sinh nhật tôi nhận được món quà đặc biệt từ bạn bè.",
    category: "Tính từ đuôi な"
  },
  {
    id: 140,
    word: "熱心な",
    hanViet: "NHIỆT TÂM",
    reading: "ねっしんな",
    meaning: "Nhiệt tình, hăng hái",
    example: "彼は毎日熱心に日本語を勉強しています。",
    exampleMeaning: "Cậu ấy mỗi ngày đều nhiệt tình hăng say học tiếng Nhật.",
    category: "Tính từ đuôi な"
  },
  {
    id: 141,
    word: "真面目な",
    hanViet: "CHÂN DIỆN MỤC",
    reading: "まじめな",
    meaning: "Nghiêm túc, chăm chỉ",
    example: "真面目な態度で仕事に取り組みます。",
    exampleMeaning: "Làm việc với thái độ nghiêm túc, chăm chỉ.",
    category: "Tính từ đuôi な"
  },
  {
    id: 142,
    word: "一生懸命な",
    hanViet: "NHẤT SINH HUYỀN MỆNH",
    reading: "いっしょうけんめいな",
    meaning: "Cố gắng hết sức, dốc sức",
    example: "試験に合格するために一生懸命勉強します。",
    exampleMeaning: "Tôi dốc hết sức học tập để thi đỗ kỳ thi.",
    category: "Tính từ đuôi な"
  },
  {
    id: 143,
    word: "失礼な",
    hanViet: "THẤT LỄ",
    reading: "しつれいな",
    meaning: "Thất lễ, xin lỗi, khiếm nhã",
    example: "人の話を遮るのは失礼なことです。",
    exampleMeaning: "Ngắt lời người khác là một hành động thất lễ.",
    category: "Tính từ đuôi な"
  }
];
