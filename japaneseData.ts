import {
  VocabularyItem,
  KanjiItem,
  QuizQuestion,
  MatchingPair,
  KeigoVerb,
  EmailTemplate,
  EtiquetteScenario
} from '../types';

export const JLPT_VOCABULARY: Record<string, VocabularyItem[]> = {
  N5: [
    {
      id: 'n5-v1',
      word: '友達',
      furigana: 'ともだち',
      romaji: 'tomodachi',
      meaning: 'Bạn bè / Friends',
      example: '私は友達と日本語を勉強します。',
      exampleMeaning: 'Tôi học tiếng Nhật cùng với bạn bè. / I study Japanese with my friends.'
    },
    {
      id: 'n5-v2',
      word: '美味しい',
      furigana: 'おいしい',
      romaji: 'oishii',
      meaning: 'Ngon / Delicious',
      example: 'この寿司はとても美味しいです。',
      exampleMeaning: 'Món sushi này rất ngon. / This sushi is very delicious.'
    },
    {
      id: 'n5-v3',
      word: '食べる',
      furigana: 'たべる',
      romaji: 'taberu',
      meaning: 'Ăn / To eat',
      example: '毎日、朝ご飯を食べます。',
      exampleMeaning: 'Mỗi ngày tôi đều ăn sáng. / I eat breakfast every day.'
    },
    {
      id: 'n5-v4',
      word: '図書館',
      furigana: 'としょかん',
      romaji: 'toshokan',
      meaning: 'Thư viện / Library',
      example: '図書館で本を借りました。',
      exampleMeaning: 'Tôi đã mượn sách ở thư viện. / I borrowed a book from the library.'
    },
    {
      id: 'n5-v5',
      word: '先生',
      furigana: 'せんせい',
      romaji: 'sensei',
      meaning: 'Thầy cô giáo / Teacher',
      example: '田中先生はとても親切です。',
      exampleMeaning: 'Thầy Tanaka rất là tốt bụng. / Mr. Tanaka is very kind.'
    }
  ],
  N4: [
    {
      id: 'n4-v1',
      word: '準備',
      furigana: 'じゅんび',
      romaji: 'junbi',
      meaning: 'Chuẩn bị / Prepare',
      example: '旅行の準備はもう終わりました。',
      exampleMeaning: 'Việc chuẩn bị cho chuyến du lịch đã xong rồi. / The preparation for the trip is done.'
    },
    {
      id: 'n4-v2',
      word: '難しい',
      furigana: 'むずかしい',
      romaji: 'muzukashii',
      meaning: 'Khó / Difficult',
      example: '今日の試験は難しかったです。',
      exampleMeaning: 'Kì thi hôm nay khó quá. / Today\'s exam was so difficult.'
    },
    {
      id: 'n4-v3',
      word: '約束',
      furigana: 'やくそく',
      romaji: 'yakosoku',
      meaning: 'Hứa hẹn, hẹn gặp / Promise, Appointment',
      example: '友達と遊ぶ約束があります。',
      exampleMeaning: 'Tôi có hẹn đi chơi với bạn. / I have an appointment to play with my friend.'
    },
    {
      id: 'n4-v4',
      word: '一生懸命',
      furigana: 'いっしょうけんめい',
      romaji: 'isshoukenmei',
      meaning: 'Hết sức mình, chăm chỉ / With all one\'s effort, Hard-working',
      example: '日本語を一生懸命に勉強します。',
      exampleMeaning: 'Tôi sẽ học tiếng Nhật hết sức mình. / I will study Japanese with all my effort.'
    }
  ],
  N3: [
    {
      id: 'n3-v1',
      word: '解決',
      furigana: 'かいけつ',
      romaji: 'kaiketsu',
      meaning: 'Giải quyết / Resolve',
      example: 'この問題はすぐに解決するでしょう。',
      exampleMeaning: 'Vấn đề này chắc sẽ sớm được giải quyết thôi. / This issue will probably be resolved soon.'
    },
    {
      id: 'n3-v2',
      word: '複雑',
      furigana: 'ふくざつ',
      romaji: 'fukuzatsu',
      meaning: 'Phức tạp / Complex',
      example: '日本語の文法は複雑ですが面白いです。',
      exampleMeaning: 'Ngữ pháp tiếng Nhật tuy phức tạp nhưng rất thú vị. / Japanese grammar is complex but interesting.'
    },
    {
      id: 'n3-v3',
      word: '絶好',
      furigana: 'ぜっこう',
      romaji: 'zekkou',
      meaning: 'Tuyệt hảo, tuyệt vời / Perfect, Wonderful',
      example: '今日はハイキングに絶好の天気です。',
      exampleMeaning: 'Thời tiết hôm nay tuyệt vời để đi leo núi. / Today\'s weather is perfect for hiking.'
    }
  ],
  N2: [
    {
      id: 'n2-v1',
      word: '貢献',
      furigana: 'こうけん',
      romaji: 'kouken',
      meaning: 'Cống hiến, đóng góp / Contribution, Dedication',
      example: '社会に貢献する job がしたいです。',
      exampleMeaning: 'Tôi muốn làm công việc có thể cống hiến cho xã hội. / I want to do a job that can contribute to society.'
    },
    {
      id: 'n2-v2',
      word: '慎重',
      furigana: 'しんちょう',
      romaji: 'shinchou',
      meaning: 'Thận trọng / Careful, Cautious',
      example: '新しいビジネスは慎重に進めるべきだ。',
      exampleMeaning: 'Kế hoạch kinh doanh mới nên được tiến hành một cách thận trọng. / The new business plan should be proceeded with caution.'
    }
  ],
  N1: [
    {
      id: 'n1-v1',
      word: '画期的',
      furigana: 'かっきてき',
      romaji: 'kakkiteki',
      meaning: 'Mang tính bước ngoặt, đột phá / Groundbreaking, Epoch-making',
      example: 'これは画期的な新技術です。',
      exampleMeaning: 'Đây là một công nghệ mới mang tính đột phá. / This is a groundbreaking new technology.'
    },
    {
      id: 'n1-v2',
      word: '核心',
      furigana: 'かくしん',
      romaji: 'kakushin',
      meaning: 'Trọng tâm, cốt lõi / Core, Heart (of an issue)',
      example: '議論はついに核心に入った。',
      exampleMeaning: 'Cuộc tranh luận cuối cùng đã đi vào trọng tâm. / The debate finally got to the core.'
    }
  ]
};

export const JLPT_KANJI: Record<string, KanjiItem[]> = {
  N5: [
    {
      id: 'n5-k1',
      kanji: '日',
      meaning: 'Mặt trời, Ngày / Sun, Day',
      onyomi: 'ニチ, ジツ',
      kunyomi: 'ひ, -び, -か',
      strokes: 4,
      examples: [
        { word: '日本', reading: 'にほん', meaning: 'Nhật Bản / Japan' },
        { word: '毎日', reading: 'まいにち', meaning: 'Mỗi ngày / Every day' }
      ]
    },
    {
      id: 'n5-k2',
      kanji: '本',
      meaning: 'Sách, Gốc rễ / Book, Origin',
      onyomi: 'ホン',
      kunyomi: 'moto',
      strokes: 5,
      examples: [
        { word: '日本語', reading: 'にほんご', meaning: 'Tiếng Nhật / Japanese Language' },
        { word: '本屋', reading: 'ほんや', meaning: 'Tiệm sách / Bookstore' }
      ]
    },
    {
      id: 'n5-k3',
      kanji: '学',
      meaning: 'Học / Study, Learn',
      onyomi: 'ガク',
      kunyomi: 'mana-bu',
      strokes: 8,
      examples: [
        { word: '学生', reading: 'がくせい', meaning: 'Học sinh, sinh viên / Student' },
        { word: '学校', reading: 'がっこう', meaning: 'Trường học / School' }
      ]
    }
  ],
  N4: [
    {
      id: 'n4-k1',
      kanji: '病',
      meaning: 'Bệnh tật / Illness, Sickness',
      onyomi: 'ビョウ',
      kunyomi: 'ya-mu',
      strokes: 10,
      examples: [
        { word: '病院', reading: 'びょういん', meaning: 'Bệnh viện / Hospital' },
        { word: '病気', reading: 'びょうき', meaning: 'Bị ốm, bệnh / Sick, Illness' }
      ]
    },
    {
      id: 'n4-k2',
      kanji: '駅',
      meaning: 'Nhà ga / Station',
      onyomi: 'エキ',
      kunyomi: '-',
      strokes: 14,
      examples: [
        { word: '東京駅', reading: 'とうきょうえき', meaning: 'Ga Tokyo / Tokyo Station' },
        { word: '駅員', reading: 'えきいん', meaning: 'Nhân viên nhà ga / Station staff' }
      ]
    }
  ],
  N3: [
    {
      id: 'n3-k1',
      kanji: '政',
      meaning: 'Chính trị / Politics, Government',
      onyomi: 'セイ, ショウ',
      kunyomi: 'matsurigoto',
      strokes: 9,
      examples: [
        { word: '政治', reading: 'せいじ', meaning: 'Chính trị / Politics' },
        { word: '政府', reading: 'せいふ', meaning: 'Chính phủ / Government' }
      ]
    },
    {
      id: 'n3-k2',
      kanji: '連',
      meaning: 'Liên lạc, kết nối / Connect, Contact',
      onyomi: 'レン',
      kunyomi: 'tsu-reru',
      strokes: 10,
      examples: [
        { word: '連絡', reading: 'れんらく', meaning: 'Liên lạc / Contact, Communication' },
        { word: '関連', reading: 'かんれん', meaning: 'Liên quan / Relation, Connection' }
      ]
    }
  ],
  N2: [
    {
      id: 'n2-k1',
      kanji: '際',
      meaning: 'Ranh giới, dịp, quốc tế / Occasion, Side, International',
      onyomi: 'サイ',
      kunyomi: 'kiwa',
      strokes: 14,
      examples: [
        { word: '国際', reading: 'こくさい', meaning: 'Quốc tế / International' },
        { word: '際立つ', reading: 'きわだつ', meaning: 'Nổi bật / Stand out' }
      ]
    }
  ],
  N1: [
    {
      id: 'n1-k1',
      kanji: '擁',
      meaning: 'Bảo vệ, ủng hộ / Protect, Advocate',
      onyomi: 'ヨウ',
      kunyomi: '-',
      strokes: 16,
      examples: [
        { word: '擁護', reading: 'ようご', meaning: 'Ủng hộ, bảo vệ / Support, Advocate, Defend' },
        { word: '擁立', reading: 'ようりつ', meaning: 'Hậu thuẫn để ứng cử / Back a candidate, Support for election' }
      ]
    }
  ]
};

export const JLPT_QUIZZES: Record<string, QuizQuestion[]> = {
  N5: [
    {
      id: 'n5-q1',
      question: 'きのうは　いいお天気＿＿＿＿＿。',
      options: ['でした', 'です', 'あります', 'ありました'],
      correctAnswer: 0,
      explanation: 'Vì có trạng từ "きのう" (hôm qua) chỉ quá khứ, đi với danh từ/tính từ đuôi na nên dùng dạng quá khứ lịch sự là "でした". / Since there is the adverb "きのう" (yesterday) indicating past tense, which goes with nouns/na-adjectives, we use the polite past form "でした".'
    },
    {
      id: 'n5-q2',
      question: 'つくえの上に　本＿＿＿　ペンがあります。',
      options: ['に', 'や', 'を', 'は'],
      correctAnswer: 1,
      explanation: 'Trợ từ "や" dùng để liệt kê các danh từ tiêu biểu (và vân vân...). "本やペンがあります" nghĩa là có sách và bút (ngoài ra có thể có thứ khác). / The particle "や" is used to list representative nouns (and so on...). "本やペンがあります" means there are books and pens (there may also be other things).'
    },
    {
      id: 'n5-q3',
      question: 'このりんごは　３つで　いくら＿＿＿＿。',
      options: ['ですか', 'ですかね', 'は', 'でしょ'],
      correctAnswer: 0,
      explanation: 'Cấu trúc hỏi giá tiền cơ bản: [Danh từ] + は いくらですか (Cái này giá bao nhiêu?). "３つで いくらですか" nghĩa là 3 quả giá bao nhiêu? / Basic price query structure: [Noun] + は いくらですか (How much is this?). "３つで いくらですか" means how much for 3?'
    }
  ],
  N4: [
    {
      id: 'n4-q1',
      question: 'あそこで　しゃしんを　＿＿＿＿　いけません。',
      options: ['とって', 'とっては', 'とる', 'とるの'],
      correctAnswer: 1,
      explanation: 'Cấu trúc cấm đoán lịch sự: 〜てはいけません (Không được làm gì...). Do đó động từ とります chia sang thể Te là とって + は + いけません. / Polite prohibition structure: 〜てはいけません (Must not do...). Therefore, the verb とります is conjugated into Te-form as とって + は + いけません.'
    },
    {
      id: 'n4-q2',
      question: '日本語が　上手に　＿＿＿＿たいです。',
      options: ['なる', 'なって', 'なり', 'なろう'],
      correctAnswer: 2,
      explanation: 'Muốn trở nên giỏi tiếng Nhật. Thể mong muốn 〜たい đi với động từ thể ます bỏ ます. Động từ "なる" -> "なります" bỏ "ます" thành "なりたい". / To want to become good at Japanese. Desiderative form 〜たい goes with verb ます-stem. The verb "なる" -> "なります" drop "ます" to become "なりたい".'
    }
  ],
  N3: [
    {
      id: 'n3-q1',
      question: '先生のアドバイスを＿＿＿＿、論文を書き直しました。',
      options: ['もとにして', 'おいて', 'めぐって', 'つれて'],
      correctAnswer: 0,
      explanation: 'Cấu trúc 〜を基（もと）にして nghĩa là "dựa trên/lấy cái gì làm nền tảng". Câu này có nghĩa là "Dựa trên lời khuyên của thầy giáo, tôi đã viết lại luận văn". / The structure 〜を基にして means "based on/using something as a foundation". This sentence means "Based on the teacher\'s advice, I rewrote my thesis".'
    },
    {
      id: 'n3-q2',
      question: '彼は英語を話す＿＿＿＿、日本語も話せる。',
      options: ['ばかりか', 'からに', 'ものか', 'せいで'],
      correctAnswer: 0,
      explanation: 'Cấu trúc 〜ばかりか nghĩa là "Không chỉ... mà còn...". Câu này nghĩa là "Anh ấy không chỉ nói được tiếng Anh, mà còn nói được cả tiếng Nhật". / The structure 〜ばかりか means "not only... but also...". This sentence means "He can speak not only English but also Japanese".'
    }
  ],
  N2: [
    {
      id: 'n2-q1',
      question: 'あのレストランは、味＿＿＿＿サービスも一流だ。',
      options: ['をはじめ', 'はもとより', 'のみならず', 'からすると'],
      correctAnswer: 1,
      explanation: 'Cấu trúc "AはもとよりB" nghĩa là "A là đương nhiên/không cần bàn cãi, mà ngay cả B cũng...". Vị ngon là đương nhiên, dịch vụ cũng thuộc hàng đỉnh cao. / The structure "AはもとよりB" means "A goes without saying, and even B...". Delicious taste goes without saying, and the service is top-notch too.'
    }
  ],
  N1: [
    {
      id: 'n1-q1',
      question: '彼に信頼されていることを＿＿＿＿に、全力で任務を果たした。',
      options: ['意気に感じて', 'もって', 'ものとして', 'よそに'],
      correctAnswer: 0,
      explanation: 'Cụm từ "意気に感じる" nghĩa là "cảm kích trước lòng tốt/sự tin tưởng và lấy đó làm động lực". Ở đây là "Cảm kích trước lòng tin của anh ấy, tôi đã dốc toàn lực hoàn thành nhiệm vụ". / The phrase "意気に感じる" means "to be inspired/motivated by someone\'s trust or kindness". Here it means "Grateful for his trust, I did my best to complete the mission".'
    }
  ]
};

export const JLPT_MATCHING: Record<string, MatchingPair[]> = {
  N5: [
    { id: 'n5-m1', left: '先生 (せんせい)', right: 'Thầy cô giáo / Teacher' },
    { id: 'n5-m2', left: '友達 (ともだち)', right: 'Bạn bè / Friends' },
    { id: 'n5-m3', left: '美味しい (おいしい)', right: 'Ngon / Delicious' },
    { id: 'n5-m4', left: '食べる (たべる)', right: 'Ăn / To eat' },
    { id: 'n5-m5', left: '図書館 (としょかん)', right: 'Thư viện / Library' }
  ],
  N4: [
    { id: 'n4-m1', left: '準備 (じゅんび)', right: 'Chuẩn bị / Prepare' },
    { id: 'n4-m2', left: '難しい (むずかしい)', right: 'Khó / Difficult' },
    { id: 'n4-m3', left: '約束 (やくそく)', right: 'Lời hứa, cuộc hẹn / Promise, Appointment' },
    { id: 'n4-m4', left: '一生懸命', right: 'Nỗ lực hết mình / With all effort' }
  ]
};

export const BJT_KEIGO_VERBS: KeigoVerb[] = [
  {
    id: 'k-v1',
    dictionary: '行く (Đi) / 来る (Đến) / 行く (Go) / 来る (Come)',
    sonkeigo: 'いらっしゃる / おいでになる',
    kenjougo: '参る (まいる) / 伺う (うかがう)',
    teineigo: '行きます / 来ます',
    meaning: 'Hành động di chuyển đi/đến. / Action of moving to go/come.'
  },
  {
    id: 'k-v2',
    dictionary: '言う (Nói) / 言う (Say)',
    sonkeigo: 'おっしゃる',
    kenjougo: '申す (もうす) / 申し上げる',
    teineigo: '言います',
    meaning: 'Nói hoặc trình bày ý kiến. / Speaking or presenting opinions.'
  },
  {
    id: 'k-v3',
    dictionary: '食べる (Ăn) / 飲む (Uống) / 食べる (Eat) / 飲む (Drink)',
    sonkeigo: '召し上がる (めしあがる)',
    kenjougo: 'いただく',
    teineigo: '食べます / 飲みます',
    meaning: 'Ăn uống lịch sự. / Polite eating and drinking.'
  },
  {
    id: 'k-v4',
    dictionary: 'する (Làm) / する (Do)',
    sonkeigo: 'なさる',
    kenjougo: 'いたす',
    teineigo: 'します',
    meaning: 'Thực hiện một hành động nào đó. / Performing a certain action.'
  },
  {
    id: 'k-v5',
    dictionary: '見る (Xem, nhìn) / 見る (See, Watch)',
    sonkeigo: 'ご覧になる (ごらんになる)',
    kenjougo: '拝見する (はいけんする)',
    teineigo: '見ます',
    meaning: 'Quan sát hoặc theo dõi tài liệu. / Observing or reviewing documents.'
  },
  {
    id: 'k-v6',
    dictionary: '知る (Biết) / 知る (Know)',
    sonkeigo: 'ご存じだ (ごぞんじだ)',
    kenjougo: '存じる (ぞんじる) / 存じ上げる',
    teineigo: '知っています',
    meaning: 'Biết thông tin hoặc quen biết ai. / Knowing information or knowing someone.'
  }
];

export const BJT_EMAILS: EmailTemplate[] = [
  {
    id: 'email-1',
    title: 'Gửi tài liệu báo cáo (資料送付) / Sending Report Documents (資料送付)',
    description: 'Mẫu email dùng khi gửi các tài liệu báo cáo công việc hoặc bảng báo giá cho đối tác. / Email template used when sending work report documents or quotation sheets to partners.',
    subject: '【資料送付のご案内】株式会社Emichan',
    body: `〇〇株式会社\n役職　〇〇様\n\nいつも大変お世話になっております。\n株式会社Emichanの山田でございます。\n\n先ほどお電話にてお約束いたしました、\n新サービスの資料を送付いたします。\n\n添付ファイル：\n・service_presentation.pdf\n\nご査収のほど、よろしくお願い申し上げます。\nご不明な点がございましたら、いつでもご連絡ください。`,
    translation: `Kính gửi Ông/Bà [Tên đối tác], [Chức vụ] - Công ty [Tên công ty đối tác]\n\nRất cảm ơn sự giúp đỡ quý báu của ông/bà trong suốt thời gian qua.\nTôi là Yamada thuộc Công ty Cổ phần Emichan.\n\nTôi xin gửi tài liệu về dịch vụ mới như đã hứa qua điện thoại khi nãy.\n\nTài liệu đính kèm:\n- service_presentation.pdf\n\nKính mong ông/bà kiểm tra nhận cho.\nNếu có bất kì điểm nào chưa rõ, xin vui lòng liên hệ với tôi bất cứ lúc nào.\n\n/ Dear Mr./Ms. [Partner Name], [Title] - [Partner Company Name],\n\nThank you very much for your continued valuable support.\nI am Yamada from Emichan Corporation.\n\nAs promised earlier on the phone, I am sending the documents regarding our new service.\n\nAttached files:\n- service_presentation.pdf\n\nPlease check and accept these files.\nIf you have any questions, please feel free to contact me at any time.`,
    keyPhrases: [
      {
        phrase: 'いつも大変お世話になっております',
        meaning: 'Cảm ơn ông/bà đã luôn giúp đỡ tôi/công ty chúng tôi (Mở đầu email kinh điển). / Thank you for your continued support (Classic email opening).'
      },
      {
        phrase: 'ご査収のほど、よろしくお願い申し上げます',
        meaning: 'Kính mong ông/bà kiểm tra và nhận tài liệu (Dùng khi đính kèm file). / Please check and accept the documents (Used when attaching files).'
      }
    ]
  },
  {
    id: 'email-2',
    title: 'Thư xin lỗi vì gửi trễ (遅延のお詫び) / Apology letter for delay (遅延のお詫び)',
    description: 'Mẫu email dùng để xin lỗi đối tác một cách chân thành nhất khi nộp tài liệu hoặc phản hồi trễ hẹn. / Email template to sincerely apologize to partners for late document submission or delayed response.',
    subject: '【お詫び】資料送付 of 遅延につきまして',
    body: `〇〇株式会社\n役職　〇〇様\n\nいつも大変お世話になっております。\n株式会社Emichanの山田でございます。\n\n本日中にお送りする予定でございました資料につきまして、\n確認作業にお時間を要しており、送付が遅れております。\n\n多大なご迷惑をおかけし、深くお詫び申し上げます。\n明日の午前10時までには必ずお送りいたします。\n\n何卒ご容赦いただけますようお願い申し上げます。`,
    translation: `Kính gửi Ông/Bà [Tên đối tác], [Chức vụ] - Công ty [Tên công ty đối tác]\n\nRất cảm ơn sự giúp đỡ quý báu của ông/bà trong suốt thời gian qua.\nTôi là Yamada thuộc Công ty Cổ phần Emichan.\n\nVề tài liệu dự kiến gửi trong ngày hôm nay, do việc xác nhận mất nhiều thời gian nên việc gửi đang bị trễ.\n\nTôi xin gửi lời xin lỗi sâu sắc vì đã gây ra phiền toái lớn cho ông/bà.\nTôi chắc chắn sẽ gửi trước 10 giờ sáng ngày mai.\n\nRất mong nhận được sự lượng thứ của ông/bà.\n\n/ Dear Mr./Ms. [Partner Name], [Title] - [Partner Company Name],\n\nThank you very much for your continued support.\nI am Yamada from Emichan Corporation.\n\nRegarding the documents that were scheduled to be sent today, the sending is delayed because the verification work took a lot of time.\n\nI deeply apologize for causing great inconvenience to you.\nI will certainly send them by 10:00 AM tomorrow.\n\nI highly appreciate your kind forgiveness and understanding.`,
    keyPhrases: [
      {
        phrase: '多大なご迷惑をおかけし、深くお詫び申し上げます',
        meaning: 'Gây ra phiền toái to lớn, tôi xin thành thật xin lỗi sâu sắc. / Causing great inconvenience, I deeply apologize.'
      },
      {
        phrase: '何卒ご容赦いただけますようお願い申し上げます',
        meaning: 'Rất mong nhận được sự lượng thứ/bỏ qua từ ông/bà. / I highly appreciate your kind understanding and forgiveness.'
      }
    ]
  }
];

export const BJT_ETIQUETTE_SCENARIOS: EtiquetteScenario[] = [
  {
    id: 'eti-1',
    title: 'Cúi chào xã giao (Bowing - お辞儀) / Bowing etiquette (お辞儀)',
    description: 'Trong văn hóa doanh nghiệp Nhật Bản, góc độ cúi đầu chào mang nhiều ý nghĩa khác nhau. / In Japanese corporate culture, bowing angles carry different meanings.',
    question: 'Khi chào khách hàng hoặc đối tác quan trọng khi họ đến hoặc về, góc cúi đầu chuẩn chỉnh nhất là bao nhiêu độ? / When greeting important clients or partners upon arrival/departure, what is the most appropriate bowing angle?',
    options: [
      '15 độ (Eshaku - 会釈) - Chào xã giao nhanh / 15 degrees (Eshaku) - Casual greeting',
      '30 độ (Keirei - 敬礼) - Chào kính trọng khách hàng/đối tác / 30 degrees (Keirei) - Respectful greeting for clients/partners',
      '45 độ (Saikeirei - 最敬礼) - Chào vô cùng tôn kính, tạ lỗi sâu sắc / 45 degrees (Saikeirei) - Deeply respectful bowing, deep apologies',
      '90 độ (Chokku) - Chào vuông góc / 90 degrees - Straight angle'
    ],
    correctAnswer: 1,
    explanation: 'Cúi chào 30 độ (Keirei - 敬礼) là chuẩn mực xã giao doanh nghiệp khi tiếp đón khách hàng hoặc đối tác. Góc 15 độ dành cho chào hỏi đồng nghiệp trong hành lang. Góc 45 độ dành cho tạ lỗi nghiêm trọng hoặc khách VIP đặc biệt. / Bowing 30 degrees (Keirei) is the corporate standard when receiving clients or partners. The 15-degree angle is for greeting colleagues in the hallway. The 45-degree angle is reserved for severe apologies or special VIP guests.'
  },
  {
    id: 'eti-2',
    title: 'Trao danh thiếp (Meishi Koukan - 名刺交換) / Business card exchange (名刺交換)',
    description: 'Trao danh thiếp là khởi đầu cho mọi mối quan hệ kinh doanh tại Nhật Bản. / Exchanging business cards is the beginning of all business relations in Japan.',
    question: 'Khi trao đổi danh thiếp, cách ứng xử nào dưới đây là ĐÚNG? / When exchanging business cards, which of the following behaviors is CORRECT?',
    options: [
      'Người có địa vị thấp hơn hoặc bên bán phải trao danh thiếp trước. / The person of lower status or the selling party must present their business card first.',
      'Dùng một tay đưa danh thiếp thật nhanh cho đối phương. / Use one hand to quickly hand over the business card.',
      'Cầm đè ngón tay lên phần logo hoặc tên của đối tác trên danh thiếp của họ. / Hold your fingers over the logo or name on the partner\'s business card.',
      'Sau khi nhận danh thiếp, cất ngay vào túi quần hoặc ví cá nhân để tránh thất lạc. / After receiving, tuck it immediately into your pocket or personal wallet.'
    ],
    correctAnswer: 0,
    explanation: 'Theo quy tắc lịch sự, người có địa vị thấp hơn hoặc bên bán (cung cấp dịch vụ) phải chủ động dâng danh thiếp trước. Khi đưa phải dùng hai tay (hoặc đưa một tay đỡ góc dưới), không được đè ngón tay lên logo/tên của đối tác, và tuyệt đối không được cất ngay mà phải đặt trang trọng trên bàn họp. / Politely, the lower status or seller must present their card first. Use two hands, don\'t cover the partner\'s logo/name, and never tuck it away immediately; display it respectfully on the meeting table.'
  },
  {
    id: 'eti-3',
    title: 'Vị trí ghế ngồi tôn kính (Kamiza/Shimoza - 上座・下座) / Seating hierarchy (Kamiza/Shimoza)',
    description: 'Vị trí ngồi trong phòng họp hoặc trên xe thể hiện sự tôn trọng tuyệt đối cho cấp trên hoặc khách hàng. / Seating positions in meeting rooms or cars represent absolute respect for superiors or clients.',
    question: 'Trong một phòng họp có cửa ra vào ở một góc, vị trí ngồi nào được coi là tôn quý nhất (Kamiza - Thượng toạ) dành cho khách quý? / In a meeting room with an entrance door at one corner, which seating position is considered the most honorable (Kamiza) for guests?',
    options: [
      'Ghế gần cửa ra vào nhất để tiện đi lại. / The seat closest to the door for easy movement.',
      'Ghế ở giữa phòng sát bàn trà. / The seat in the middle of the room next to the tea table.',
      'Ghế ở sâu trong cùng của phòng, cách xa cửa ra vào nhất. / The seat deepest inside the room, furthest from the entrance.',
      'Vị trí tuỳ ý ai đến trước ngồi trước. / First come first served, any random seat.'
    ],
    correctAnswer: 2,
    explanation: 'Vị trí "Kamiza" (Thượng toạ) là vị trí ở sâu nhất trong phòng họp, cách xa cửa ra vào nhất (an toàn, yên tĩnh, danh giá nhất). Ngược lại, ghế gần cửa ra vào nhất là "Shimoza" (Hạ toạ), dành cho người có vị trí thấp nhất để dễ chạy ra ngoài phục vụ trà nước hoặc đón tiếp. / The "Kamiza" (honorary seat) is deepest in the room, furthest from the door (quiet, safe, most prestigious). Conversely, the seat closest to the door is "Shimoza" (lower seat), for the lowest-ranked person to easily serve tea or welcome guests.'
  }
];
