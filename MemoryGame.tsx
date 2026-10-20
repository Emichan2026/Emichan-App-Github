import React, { useState, useEffect } from "react";
import { MatchingPair } from "../types";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles, RotateCcw, HelpCircle, Trophy } from "lucide-react";

interface MemoryGameProps {
  pairs: MatchingPair[];
}

interface CardState {
  id: string; // unique card instance id (e.g., "left-1" or "right-1")
  pairId: string; // the matching id
  content: string;
  type: "japanese" | "meaning";
  isMatched: boolean;
}

export const MemoryGame: React.FC<MemoryGameProps> = ({ pairs }) => {
  const [cards, setCards] = useState<CardState[]>([]);
  const [selectedCards, setSelectedCards] = useState<string[]>([]);
  const [moves, setMoves] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [showGuide, setShowGuide] = useState(true);

  // Initialize and shuffle cards
  const initializeGame = () => {
    if (!pairs || pairs.length === 0) return;

    // Create cards: one for 'left' (Japanese) and one for 'right' (meaning)
    const gameCards: CardState[] = [];
    pairs.forEach((pair) => {
      gameCards.push({
        id: `left-${pair.id}`,
        pairId: pair.id,
        content: pair.left,
        type: "japanese",
        isMatched: false,
      });
      gameCards.push({
        id: `right-${pair.id}`,
        pairId: pair.id,
        content: pair.right,
        type: "meaning",
        isMatched: false,
      });
    });

    // Fisher-Yates shuffle
    const shuffled = [...gameCards];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    setCards(shuffled);
    setSelectedCards([]);
    setMoves(0);
    setCompleted(false);
  };

  useEffect(() => {
    initializeGame();
  }, [pairs]);

  const handleCardClick = (cardId: string) => {
    const clickedCard = cards.find((c) => c.id === cardId);
    if (!clickedCard || clickedCard.isMatched || selectedCards.includes(cardId)) {
      return;
    }

    // Max 2 selections at once
    if (selectedCards.length >= 2) return;

    const newSelections = [...selectedCards, cardId];
    setSelectedCards(newSelections);

    if (newSelections.length === 2) {
      setMoves((m) => m + 1);
      const firstCard = cards.find((c) => c.id === newSelections[0])!;
      const secondCard = cards.find((c) => c.id === newSelections[1])!;

      // Check if they are a match (same pairId, but different card types)
      if (firstCard.pairId === secondCard.pairId && firstCard.type !== secondCard.type) {
        // Success match!
        setTimeout(() => {
          setCards((prev) =>
            prev.map((c) =>
              c.pairId === firstCard.pairId ? { ...c, isMatched: true } : c
            )
          );
          setSelectedCards([]);
        }, 400);
      } else {
        // Failed match, turn red briefly and flip back
        setTimeout(() => {
          setSelectedCards([]);
        }, 1200);
      }
    }
  };

  // Check win condition
  useEffect(() => {
    if (cards.length > 0 && cards.every((c) => c.isMatched)) {
      setCompleted(true);
    }
  }, [cards]);

  return (
    <div className="w-full bg-white/10 backdrop-blur-2xl rounded-2xl p-4 md:p-6 shadow-md border border-pink-100/20">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
        <div>
          <h3 className="text-xl font-serif font-bold text-[#8a5b61] flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-pink-500 animate-pulse" />
            Trò Chơi Ghép Thẻ Trí Nhớ
          </h3>
          <p className="text-xs text-gray-500 mt-1">
            Ghép từ tiếng Nhật với nghĩa tiếng Việt tương ứng thật nhanh nhé!
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-pink-50 px-3 py-1.5 rounded-full border border-pink-100 text-xs text-[#8a5b61] font-medium">
            Lượt đi: <span className="font-bold text-pink-600 text-sm">{moves}</span>
          </div>
          <button
            onClick={initializeGame}
            className="flex items-center gap-1 bg-pink-100 hover:bg-pink-200 active:bg-pink-300 text-[#8a5b61] px-3 py-1.5 rounded-full text-xs font-semibold transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Làm mới
          </button>
        </div>
      </div>

      {showGuide && (
        <div className="bg-pink-50/50 border border-pink-100 rounded-xl p-3 mb-6 flex items-start gap-2.5 text-xs text-[#8a5b61]">
          <HelpCircle className="w-4 h-4 text-pink-500 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold">Cách chơi cực kỳ đơn giản:</p>
            <p className="text-gray-600 mt-0.5">
              1. Chọn một thẻ tiếng Nhật (chữ Kanji/Hiragana) hoặc thẻ nghĩa tiếng Việt.<br />
              2. Tìm thẻ đối ứng còn lại để ghép đôi. Nếu chọn đúng, thẻ sẽ biến mất (hoặc chuyển thành màu xanh lá).<br />
              3. Cố gắng hoàn thành tất cả thẻ với số lượt đi ít nhất nhé!
            </p>
          </div>
        </div>
      )}

      {completed ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-10 px-4 bg-pink-50 rounded-2xl border-2 border-dashed border-pink-200 flex flex-col items-center justify-center gap-3"
        >
          <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center text-pink-500 mb-2">
            <Trophy className="w-10 h-10 animate-bounce" />
          </div>
          <h4 className="text-2xl font-serif font-bold text-[#8a5b61]">
            Omedetou Gozaimasu! 🎉
          </h4>
          <p className="text-sm text-gray-600 max-w-sm">
            Chúc mừng em đã hoàn thành xuất sắc trò chơi ghép đôi với chỉ{" "}
            <span className="font-bold text-pink-600 text-base">{moves}</span> lượt đi!
          </p>
          <button
            onClick={initializeGame}
            className="mt-4 bg-gradient-to-r from-pink-400 to-[#c99fa5] text-white font-semibold px-6 py-2.5 rounded-full shadow-md hover:brightness-105 active:scale-95 transition-transform duration-150 cursor-pointer"
          >
            Chơi lại ngay
          </button>
        </motion.div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          <AnimatePresence>
            {cards.map((card) => {
              const isSelected = selectedCards.includes(card.id);
              const isFirstSelected = selectedCards[0] === card.id;
              const isSecondSelected = selectedCards[1] === card.id;
              const hasTwoSelected = selectedCards.length === 2;

              // Determine visual feedback when matched, selected, or mismatched
              let cardBg = "bg-white/60 hover:bg-white/80 backdrop-blur-sm hover:border-pink-300 border-gray-200/60 text-gray-800";
              if (card.isMatched) {
                cardBg = "bg-emerald-50 border-emerald-200 text-emerald-800 opacity-60 pointer-events-none";
              } else if (isSelected) {
                if (hasTwoSelected) {
                  // If there are two selected, we need to check if they match.
                  // If they don't, we show red for fail.
                  const first = cards.find((c) => c.id === selectedCards[0])!;
                  const second = cards.find((c) => c.id === selectedCards[1])!;
                  const isMatch = first.pairId === second.pairId && first.type !== second.type;
                  
                  if (isMatch) {
                    cardBg = "bg-emerald-100 border-emerald-400 text-emerald-800 ring-2 ring-emerald-300";
                  } else {
                    cardBg = "bg-rose-100 border-rose-400 text-rose-800 ring-2 ring-rose-300 animate-shake";
                  }
                } else {
                  cardBg = "bg-pink-100 border-pink-400 text-[#8a5b61] ring-2 ring-pink-200";
                }
              }

              return (
                <motion.div
                  key={card.id}
                  layout
                  onClick={() => handleCardClick(card.id)}
                  className={`h-24 p-3 flex items-center justify-center rounded-xl border text-center font-medium shadow-sm transition-all duration-200 cursor-pointer text-sm select-none relative overflow-hidden ${cardBg}`}
                  whileHover={{ scale: card.isMatched ? 1 : 1.02 }}
                  whileTap={{ scale: card.isMatched ? 1 : 0.98 }}
                >
                  <span className={`${card.type === "japanese" ? "text-base font-bold font-sans" : "text-xs font-serif text-gray-700"}`}>
                    {card.content}
                  </span>

                  {card.isMatched && (
                    <div className="absolute top-1 right-1 text-emerald-500 font-bold text-xs">
                      ✓
                    </div>
                  )}
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};
