export interface KanaStrokeInfo {
  char: string;
  romaji: string;
  strokes: number;
  steps: string[];
  formula?: string; // Ví dụ: て + ” ＝ で (DE)
  mnemonic: string; // Mẹo nhớ mặt chữ và cách viết
}

export const KANA_STROKE_DATA: Record<string, KanaStrokeInfo> = {
  あ: {
    char: "あ",
    romaji: "a",
    strokes: 3,
    steps: [
      "Nét 1: Ngang ngắn từ trái sang phải",
      "Nét 2: Dọc hơi cong xéo qua giữa nét 1",
      "Nét 3: Vòng tròn xoắn từ trái uốn cong sang phải"
    ],
    mnemonic: "Mặt chữ giống quả táo (Apple) có cuống nét ngang và thân tròn trĩnh. Viết 3 nét: Ngang → Dọc cong → Vòng tròn uốn cong."
  },
  い: {
    char: "い",
    romaji: "i",
    strokes: 2,
    steps: [
      "Nét 1: Dọc cong bên trái hất nhẹ lên",
      "Nét 2: Dọc ngắn hơi cong bên phải"
    ],
    mnemonic: "Giống 2 con lươn (Eel) bơi song song. Nét trái dài hơn hất nhẹ lên, nét phải ngắn cong."
  },
  う: {
    char: "う",
    romaji: "u",
    strokes: 2,
    steps: [
      "Nét 1: Chấm phẩy nghiêng trên đỉnh",
      "Nét 2: Vòng cung cong như vành tai"
    ],
    mnemonic: "Giống người đang cúi gập lưng kêu U-u. Nét 1 phẩy ngắn trên, nét 2 uốn cong lưng."
  },
  え: {
    char: "え",
    romaji: "e",
    strokes: 2,
    steps: [
      "Nét 1: Chấm nghiêng nhỏ phía trên",
      "Nét 2: Zic-zac ngang-chéo-ngang rồi uốn cong đáy"
    ],
    mnemonic: "Giống người đang chạy bộ thể dục (Exercise). Nét 1 phẩy nghiêng, nét 2 vẽ zic-zac kéo dài."
  },
  お: {
    char: "お",
    romaji: "o",
    strokes: 3,
    steps: [
      "Nét 1: Nét ngang ngắn",
      "Nét 2: Dọc xuống lượn vòng tròn sang phải",
      "Nét 3: Dấu chấm nhỏ góc trên bên phải"
    ],
    mnemonic: "Giống người ngạc nhiên kêu 'Ồ!' khi thấy quả bóng lăn qua. Nét 1 ngang, nét 2 dọc lượn tròn, nét 3 dấu chấm."
  },
  か: {
    char: "か",
    romaji: "ka",
    strokes: 3,
    steps: [
      "Nét 1: Ngang gập móc cong",
      "Nét 2: Xiên chéo cắt qua nét 1",
      "Nét 3: Dấu phẩy nhỏ bên phải"
    ],
    mnemonic: "Giống võ sĩ Karate vung chân đá bóng. Nét 1 móc cong, nét 2 chém dọc, nét 3 dấu phẩy."
  },
  が: {
    char: "が",
    romaji: "ga",
    strokes: 5,
    formula: "か + ” ＝ が (GA)",
    steps: [
      "Nét 1-3: Viết chữ か hoàn chỉnh",
      "Nét 4-5: Thêm 2 dấu phẩy góc trên bên phải"
    ],
    mnemonic: "dấu \" biến âm: か + ” ＝ が (GA). Thêm dấu ゛ làm âm gió K rung thành âm G."
  },
  き: {
    char: "き",
    romaji: "ki",
    strokes: 4,
    steps: [
      "Nét 1: Ngang ngắn trên",
      "Nét 2: Ngang dưới dài hơn",
      "Nét 3: Xiên chéo qua 2 nét ngang",
      "Nét 4: Nét cong tách rời phía đáy"
    ],
    mnemonic: "Giống chiếc chìa khóa (Key). Viết 2 nét ngang, 1 nét dọc xéo, nét 4 cong tách rời dưới."
  },
  ぎ: {
    char: "ぎ",
    romaji: "gi",
    strokes: 6,
    formula: "き + ” ＝ ぎ (GI)",
    steps: [
      "Nét 1-4: Viết chữ き hoàn chỉnh",
      "Nét 5-6: Thêm 2 dấu phẩy góc trên bên phải"
    ],
    mnemonic: "dấu \" biến âm: き + ” ＝ ぎ (GI). Thêm dấu ゛ vào góc trên phải."
  },
  く: {
    char: "く",
    romaji: "ku",
    strokes: 1,
    steps: [
      "Nét 1: Kéo 1 nét gập nhọn từ trên xuống"
    ],
    mnemonic: "Giống mỏ chim mở kêu Cúc cu hoặc dấu <. Viết liền mạch 1 nét gập nhọn."
  },
  ぐ: {
    char: "ぐ",
    romaji: "gu",
    strokes: 3,
    formula: "く + ” ＝ ぐ (GU)",
    steps: [
      "Nét 1: Viết chữ く (1 nét gập)",
      "Nét 2-3: Thêm 2 dấu phẩy góc trên bên phải"
    ],
    mnemonic: "dấu \" biến âm: く + ” ＝ ぐ (GU). Mỏ chim kêu Cúc cu thêm 2 nét rung."
  },
  け: {
    char: "け",
    romaji: "ke",
    strokes: 3,
    steps: [
      "Nét 1: Dọc trái hơi cong hất nhẹ",
      "Nét 2: Ngang ngắn giữa",
      "Nét 3: Dọc phải lượn cong xuống"
    ],
    mnemonic: "Giống thân cây tre (nét dọc trái) bên cạnh thùng bia Keg. Nét 1 dọc hất nhẹ, nét 2 ngang, nét 3 dọc lượn."
  },
  げ: {
    char: "げ",
    romaji: "ge",
    strokes: 5,
    formula: "け + ” ＝ げ (GE)",
    steps: [
      "Nét 1-3: Viết chữ け hoàn chỉnh",
      "Nét 4-5: Thêm 2 dấu phẩy góc trên bên phải"
    ],
    mnemonic: "dấu \" biến âm: け + ” ＝ げ (GE). Thêm dấu ゛ biến âm KE thành GE."
  },
  こ: {
    char: "こ",
    romaji: "ko",
    strokes: 2,
    steps: [
      "Nét 1: Ngang trên có móc nhẹ",
      "Nét 2: Ngang dưới uốn cong lòng chảo"
    ],
    mnemonic: "Giống 2 con cá chép Koi bơi song song hoặc hai dấu ngoặc. Nét 1 ngang móc nhẹ, nét 2 ngang cong đáy."
  },
  ご: {
    char: "ご",
    romaji: "go",
    strokes: 4,
    formula: "こ + ” ＝ ご (GO)",
    steps: [
      "Nét 1-2: Viết chữ こ hoàn chỉnh",
      "Nét 3-4: Thêm 2 dấu phẩy góc trên bên phải"
    ],
    mnemonic: "dấu \" biến âm: こ + ” ＝ ご (GO). Thêm dấu ゛ biến KO thành GO."
  },
  さ: {
    char: "さ",
    romaji: "sa",
    strokes: 3,
    steps: [
      "Nét 1: Ngang ngắn chếch lên",
      "Nét 2: Xiên chéo cắt qua nét 1",
      "Nét 3: Nét cong tách rời phía dưới"
    ],
    mnemonic: "Giống thanh kiếm Samurai cắm chéo. Nét 1 ngang chếch lên, nét 2 chéo xuống, nét 3 cong tách rời."
  },
  ざ: {
    char: "ざ",
    romaji: "za",
    strokes: 5,
    formula: "さ + ” ＝ ざ (ZA)",
    steps: [
      "Nét 1-3: Viết chữ さ hoàn chỉnh",
      "Nét 4-5: Thêm 2 dấu phẩy góc trên bên phải"
    ],
    mnemonic: "dấu \" biến âm: さ + ” ＝ ざ (ZA). Thêm 2 dấu phẩy (S ➔ Z)."
  },
  し: {
    char: "し",
    romaji: "shi",
    strokes: 1,
    steps: [
      "Nét 1: Kéo thẳng từ trên xuống rồi uốn cong móc ngược lên"
    ],
    mnemonic: "Giống lưỡi câu cá (Fishhook) uốn ngược lên. Viết duy nhất 1 nét từ trên kéo xuống rồi cong nhẹ."
  },
  じ: {
    char: "じ",
    romaji: "ji",
    strokes: 3,
    formula: "し + ” ＝ じ (JI)",
    steps: [
      "Nét 1: Viết chữ し (1 nét móc)",
      "Nét 2-3: Thêm 2 dấu phẩy góc trên bên phải"
    ],
    mnemonic: "dấu \" biến âm: し + ” ＝ じ (JI). Lưỡi câu thêm dấu ゛ đọc là JI."
  },
  す: {
    char: "す",
    romaji: "su",
    strokes: 2,
    steps: [
      "Nét 1: Ngang thẳng",
      "Nét 2: Dọc xuống, thắt vòng tròn sang trái rồi kéo đuôi"
    ],
    mnemonic: "Giống người đu xà / vòng xoắn sợi mì. Nét 1 ngang, nét 2 dọc thắt vòng tròn rồi kéo đuôi thẳng."
  },
  ず: {
    char: "ず",
    romaji: "zu",
    strokes: 4,
    formula: "す + ” ＝ ず (ZU)",
    steps: [
      "Nét 1-2: Viết chữ す hoàn chỉnh",
      "Nét 3-4: Thêm 2 dấu phẩy góc trên bên phải"
    ],
    mnemonic: "dấu \" biến âm: す + ” ＝ ず (ZU). Thêm dấu ゛ biến âm SU thành ZU."
  },
  せ: {
    char: "せ",
    romaji: "se",
    strokes: 3,
    steps: [
      "Nét 1: Ngang dài",
      "Nét 2: Dọc bên phải có móc nhỏ",
      "Nét 3: Dọc bên trái lượn sang nối nét"
    ],
    mnemonic: "Giống người đang ngồi ghế trò chuyện. Nét 1 ngang dài, nét 2 dọc móc, nét 3 dọc cong."
  },
  ぜ: {
    char: "ぜ",
    romaji: "ze",
    strokes: 5,
    formula: "せ + ” ＝ ぜ (ZE)",
    steps: [
      "Nét 1-3: Viết chữ せ hoàn chỉnh",
      "Nét 4-5: Thêm 2 dấu phẩy góc trên bên phải"
    ],
    mnemonic: "dấu \" biến âm: せ + ” ＝ ぜ (ZE). Thêm dấu ゛ biến âm SE thành ZE."
  },
  そ: {
    char: "そ",
    romaji: "so",
    strokes: 1,
    steps: [
      "Nét 1: Viết 1 nét liền zic-zac: ngang, chéo xuống, ngang, uốn cong đáy"
    ],
    mnemonic: "Giống đường kim may vá uốn lượn (Sewing). Viết 1 nét zic-zac hình chữ Z uốn cong đáy."
  },
  ぞ: {
    char: "ぞ",
    romaji: "zo",
    strokes: 3,
    formula: "そ + ” ＝ ぞ (ZO)",
    steps: [
      "Nét 1: Viết chữ そ (1 nét zic-zac)",
      "Nét 2-3: Thêm 2 dấu phẩy góc trên bên phải"
    ],
    mnemonic: "dấu \" biến âm: そ + ” ＝ ぞ (ZO). Thêm 2 dấu phẩy biến SO thành ZO."
  },
  た: {
    char: "た",
    romaji: "ta",
    strokes: 4,
    steps: [
      "Nét 1: Ngang ngắn",
      "Nét 2: Xiên chéo cắt qua nét 1",
      "Nét 3: Ngang nhỏ trên bên phải",
      "Nét 4: Cong nhỏ dưới bên phải"
    ],
    mnemonic: "Mặt chữ giống chữ 't' và 'a' ghép lại (ta). Nét 1 ngang, nét 2 xéo chéo, nét 3 & 4 nhỏ bên phải."
  },
  だ: {
    char: "だ",
    romaji: "da",
    strokes: 6,
    formula: "た + ” ＝ だ (DA)",
    steps: [
      "Nét 1-4: Viết chữ た hoàn chỉnh",
      "Nét 5-6: Thêm 2 dấu phẩy góc trên bên phải"
    ],
    mnemonic: "dấu \" biến âm: た + ” ＝ だ (DA). Thêm 2 dấu phẩy (T ➔ D)."
  },
  ち: {
    char: "ち",
    romaji: "chi",
    strokes: 2,
    steps: [
      "Nét 1: Ngang ngắn chếch lên",
      "Nét 2: Xiên chéo rồi lượn vòng cung to như số 5"
    ],
    mnemonic: "Giống người cổ vũ (Cheerleader) hoặc số 5 ngược. Nét 1 ngang chếch lên, nét 2 dọc rồi vòng to."
  },
  ぢ: {
    char: "ぢ",
    romaji: "ji",
    strokes: 4,
    formula: "ち + ” ＝ ぢ (JI / DZI)",
    steps: [
      "Nét 1-2: Viết chữ ち hoàn chỉnh",
      "Nét 3-4: Thêm 2 dấu phẩy góc trên bên phải"
    ],
    mnemonic: "dấu \" biến âm: ち + ” ＝ ぢ (JI). Ngoại lệ: đọc là JI (đồng âm với じ)."
  },
  つ: {
    char: "つ",
    romaji: "tsu",
    strokes: 1,
    steps: [
      "Nét 1: Kéo 1 nét ngang nhẹ rồi uốn cong hình lưỡi liềm sang phải"
    ],
    mnemonic: "Giống ngọn sóng thần dâng trào (Tsunami). Viết 1 nét cong lớn từ trái uốn sang phải."
  },
  づ: {
    char: "づ",
    romaji: "zu",
    strokes: 3,
    formula: "つ + ” ＝ づ (ZU / DZU)",
    steps: [
      "Nét 1: Viết chữ つ (1 nét cong)",
      "Nét 2-3: Thêm 2 dấu phẩy góc trên bên phải"
    ],
    mnemonic: "dấu \" biến âm: つ + ” ＝ づ (ZU). Cực quan trọng: Đọc là ZU (không đọc là TSU!)."
  },
  て: {
    char: "て",
    romaji: "te",
    strokes: 1,
    steps: [
      "Nét 1: Ngang ngắn rồi uốn cong vòng cung lớn sang trái"
    ],
    mnemonic: "Giống bàn tay vươn ra (Ten). Viết 1 nét: gạch ngang ngắn rồi lượn vòng cung sang trái."
  },
  で: {
    char: "で",
    romaji: "de",
    strokes: 3,
    formula: "て + ” ＝ で (DE)",
    steps: [
      "Nét 1: Viết chữ て (1 nét cánh tay)",
      "Nét 2-3: Thêm 2 dấu phẩy góc trên bên phải"
    ],
    mnemonic: "dấu \" biến âm: て + ” ＝ で (DE). Cánh tay て thêm 2 dấu rung thành で."
  },
  と: {
    char: "と",
    romaji: "to",
    strokes: 2,
    steps: [
      "Nét 1: Phẩy xiên từ trên xuống",
      "Nét 2: Vòng cung chữ C lớn ôm phía dưới"
    ],
    mnemonic: "Giống ngón chân bị gai đâm (Toe). Nét 1 phẩy xéo từ trên, nét 2 vòng cung chữ C đỡ dưới."
  },
  ど: {
    char: "ど",
    romaji: "do",
    strokes: 4,
    formula: "と + ” ＝ ど (DO)",
    steps: [
      "Nét 1-2: Viết chữ と hoàn chỉnh",
      "Nét 3-4: Thêm 2 dấu phẩy góc trên bên phải"
    ],
    mnemonic: "dấu \" biến âm: と + ” ＝ ど (DO). Ngón chân と thêm 2 dấu rung thành ど."
  },
  な: {
    char: "な",
    romaji: "na",
    strokes: 4,
    steps: [
      "Nét 1: Ngang ngắn",
      "Nét 2: Xiên chéo cắt qua nét 1",
      "Nét 3: Phẩy nhỏ bên phải",
      "Nét 4: Dọc lượn thắt nút xoắn tròn"
    ],
    mnemonic: "Giống người quỳ cầu nguyện trước thánh giá. Nét 1 ngang ngắn, nét 2 chéo, nét 3 phẩy, nét 4 xoắn tròn."
  },
  に: {
    char: "に",
    romaji: "ni",
    strokes: 3,
    steps: [
      "Nét 1: Dọc trái hơi cong có móc nhẹ",
      "Nét 2: Ngang nhỏ trên bên phải",
      "Nét 3: Ngang nhỏ dưới bên phải"
    ],
    mnemonic: "Giống cây kim và sợi chỉ (Needle). Nét 1 dọc trái có móc nhẹ, nét 2 & 3 là 2 gạch ngang nhỏ."
  },
  ぬ: {
    char: "ぬ",
    romaji: "nu",
    strokes: 2,
    steps: [
      "Nét 1: Xiên chéo từ trái sang phải",
      "Nét 2: Uốn cong từ trên xuống rồi thắt nút xoắn đuôi"
    ],
    mnemonic: "Giống đĩa mì sợi rối uốn vòng (Noodles). Nét 1 xiên trái, nét 2 uốn vòng tròn thắt nút đuôi."
  },
  ね: {
    char: "ね",
    romaji: "ne",
    strokes: 2,
    steps: [
      "Nét 1: Dọc thẳng đứng",
      "Nét 2: Nét zic-zac kéo sang phải rồi thắt nút đuôi tròn"
    ],
    mnemonic: "Giống chú mèo cuộn tròn đuôi (Neko). Nét 1 dọc thẳng, nét 2 zic-zac kéo vòng thắt nút đuôi."
  },
  の: {
    char: "の",
    romaji: "no",
    strokes: 1,
    steps: [
      "Nét 1: Viết 1 nét xoắn tròn từ tâm lượn vòng ra ngoài"
    ],
    mnemonic: "Giống biển báo cấm hình tròn gạch chéo (NO). Viết 1 nét xoắn tròn từ trong lượn ra ngoài."
  }
};
