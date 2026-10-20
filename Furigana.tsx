import React, { useMemo } from "react";
import { parseWordFurigana, parseSentenceFurigana, FuriganaSegment } from "../lib/furiganaHelper";

export interface FuriganaProps {
  /** Toàn bộ câu văn hoặc cụm từ tiếng Nhật */
  text?: string;
  /** Từ vựng riêng lẻ */
  word?: string;
  /** Cách đọc Hiragana của từ vựng riêng lẻ */
  reading?: string;
  /** Trạng thái hiển thị Furigana (mặc định: true) */
  showFurigana?: boolean;
  /** Vị trí hiển thị: 'top' (phía trên chữ Hán - chuẩn giáo trình) hoặc 'bottom' (phía dưới) */
  position?: "top" | "bottom";
  /** CSS class cho wrapper ngoài */
  className?: string;
  /** CSS class cho thẻ ruby */
  rubyClassName?: string;
  /** CSS class cho thẻ rt (chữ Furigana nhỏ) */
  rtClassName?: string;
}

export const Furigana: React.FC<FuriganaProps> = ({
  text,
  word,
  reading,
  showFurigana = true,
  position = "top",
  className = "",
  rubyClassName = "",
  rtClassName = "",
}) => {
  const segments: FuriganaSegment[] = useMemo(() => {
    if (word) {
      return parseWordFurigana(word, reading);
    }
    if (text) {
      return parseSentenceFurigana(text);
    }
    return [];
  }, [text, word, reading]);

  if (!segments.length) {
    return <span className={className}>{word || text || ""}</span>;
  }

  // Nếu người dùng tắt hiển thị Furigana
  if (!showFurigana) {
    return <span className={className}>{segments.map((s) => s.text).join("")}</span>;
  }

  return (
    <span className={`inline font-jp ${className}`}>
      {segments.map((seg, idx) => {
        if (!seg.furigana) {
          return <React.Fragment key={idx}>{seg.text}</React.Fragment>;
        }

        return (
          <ruby
            key={idx}
            className={`inline-ruby align-baseline ${rubyClassName}`}
            style={{
              rubyAlign: "center",
              rubyPosition: position === "bottom" ? "under" : "over",
            }}
          >
            {seg.text}
            <rt
              className={`text-[0.52em] font-medium tracking-tight text-[#8a5b61] text-center select-none font-jp leading-none ${rtClassName}`}
              style={{
                rubyPosition: position === "bottom" ? "under" : "over",
              }}
            >
              {seg.furigana}
            </rt>
          </ruby>
        );
      })}
    </span>
  );
};
