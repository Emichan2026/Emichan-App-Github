export interface VocabularyItem {
  id: string;
  word: string;
  furigana: string;
  romaji: string;
  meaning: string;
  example: string;
  exampleMeaning: string;
  sino?: string;
  note?: string;
  category?: string;
}

export interface KanjiItem {
  id: string;
  kanji: string;
  meaning: string;
  onyomi: string;
  kunyomi: string;
  strokes: number;
  examples: Array<{ word: string; reading: string; meaning: string }>;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  category?: string;
}

export interface MatchingPair {
  id: string;
  left: string;  // Japanese word/Kanji
  right: string; // Meaning/Reading
}

export interface KeigoVerb {
  id: string;
  dictionary: string;
  sonkeigo: string;
  kenjougo: string;
  teineigo: string;
  meaning: string;
}

export interface EmailTemplate {
  id: string;
  title: string;
  description: string;
  subject: string;
  body: string; // with placeholders like [Tên đối tác]
  translation: string;
  keyPhrases: Array<{ phrase: string; meaning: string }>;
}

export interface EtiquetteScenario {
  id: string;
  title: string;
  description: string;
  image?: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}
