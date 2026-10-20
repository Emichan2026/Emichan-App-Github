import React, { useRef, useState, useEffect } from "react";
import { RotateCcw, Eye, EyeOff, Volume2, Check } from "lucide-react";
import { KANA_STROKE_DATA } from "../data/kanaStrokeData";

interface KanaWritingCanvasProps {
  char: string;
  romaji?: string;
  onSpeak?: (char: string) => void;
  onNext?: () => void;
}

export const KanaWritingCanvas: React.FC<KanaWritingCanvasProps> = ({
  char,
  romaji,
  onSpeak,
  onNext
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [showGuide, setShowGuide] = useState(true);
  const [hasDrawn, setHasDrawn] = useState(false);

  const strokeInfo = KANA_STROKE_DATA[char];

  // Draw grid & watermark guide on canvas
  const drawBackground = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    // Clear whole canvas
    ctx.clearRect(0, 0, width, height);

    // Background color
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, width, height);

    // Draw Japanese manuscript grid (dashed cross lines)
    ctx.save();
    ctx.strokeStyle = "#e5e7eb";
    ctx.lineWidth = 1.5;
    ctx.setLineDash([4, 4]);

    // Horizontal center line
    ctx.beginPath();
    ctx.moveTo(0, height / 2);
    ctx.lineTo(width, height / 2);
    ctx.stroke();

    // Vertical center line
    ctx.beginPath();
    ctx.moveTo(width / 2, 0);
    ctx.lineTo(width / 2, height);
    ctx.stroke();

    // Diagonal guidelines (subtle)
    ctx.strokeStyle = "#f3f4f6";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(width, height);
    ctx.moveTo(width, 0);
    ctx.lineTo(0, height);
    ctx.stroke();

    ctx.restore();

    // Draw watermark kana guide if enabled
    if (showGuide && char) {
      ctx.save();
      ctx.font = `bold ${Math.floor(width * 0.65)}px "Noto Sans JP", sans-serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillStyle = "rgba(138, 91, 97, 0.18)";
      ctx.fillText(char, width / 2, height / 2 + 5);
      ctx.restore();
    }
  };

  // Reset or re-draw canvas when char or showGuide changes
  useEffect(() => {
    drawBackground();
    setHasDrawn(false);
  }, [char, showGuide]);

  // Coordinate helper handling responsive scaling
  const getCoordinates = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    if ("touches" in e) {
      const touch = e.touches[0];
      return {
        x: (touch.clientX - rect.left) * scaleX,
        y: (touch.clientY - rect.top) * scaleY
      };
    } else {
      return {
        x: (e.clientX - rect.left) * scaleX,
        y: (e.clientY - rect.top) * scaleY
      };
    }
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if ("touches" in e) {
      // Prevent scrolling when drawing on touch screens
      e.stopPropagation();
    }
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const { x, y } = getCoordinates(e);
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.strokeStyle = "#8a5b61";
    ctx.lineWidth = 8;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    setIsDrawing(true);
    setHasDrawn(true);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    if ("touches" in e) {
      e.preventDefault();
      e.stopPropagation();
    }
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const { x, y } = getCoordinates(e);
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const handleClear = () => {
    drawBackground();
    setHasDrawn(false);
  };

  return (
    <div className="w-full flex flex-col items-center bg-white/90 backdrop-blur-md rounded-2xl p-4 border border-[#8a5b61]/20 shadow-xs">
      <div className="flex items-center justify-between w-full max-w-[280px] mb-2 px-1">
        <div className="flex items-center gap-1.5">
          <span className="text-xs font-bold text-gray-800">Tập viết chữ:</span>
          <span className="font-jp font-black text-lg text-[#8a5b61]">{char}</span>
          {romaji && (
            <span className="font-mono text-xs text-gray-500 font-bold bg-gray-100 px-1.5 py-0.5 rounded">
              {romaji}
            </span>
          )}
        </div>
        {strokeInfo && (
          <span className="text-[11px] font-bold text-[#8a5b61] bg-[#8a5b61]/10 px-2 py-0.5 rounded-full">
            {strokeInfo.strokes} nét
          </span>
        )}
      </div>

      {/* Canvas Frame */}
      <div className="relative rounded-2xl overflow-hidden shadow-xs border-2 border-[#8a5b61]/30 bg-white">
        <canvas
          ref={canvasRef}
          width={260}
          height={260}
          className="touch-none cursor-crosshair block"
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
        />
      </div>

      {/* Control Buttons */}
      <div className="flex items-center justify-between w-full max-w-[260px] mt-3 gap-2">
        <button
          onClick={handleClear}
          className="flex-1 py-1.5 px-2.5 rounded-xl border border-gray-200 hover:bg-gray-50 text-gray-700 text-xs font-bold flex items-center justify-center gap-1 shadow-2xs active:scale-95 transition-all cursor-pointer"
          title="Xóa viết lại"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Xóa</span>
        </button>

        <button
          onClick={() => setShowGuide(!showGuide)}
          className={`py-1.5 px-2.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-1 shadow-2xs active:scale-95 transition-all cursor-pointer ${
            showGuide
              ? "bg-[#8a5b61]/10 border-[#8a5b61]/30 text-[#8a5b61]"
              : "border-gray-200 text-gray-500 hover:bg-gray-50"
          }`}
          title="Bật / tắt nét mờ"
        >
          {showGuide ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
          <span>Nét mờ</span>
        </button>

        {onSpeak && (
          <button
            onClick={() => onSpeak(char)}
            className="w-9 h-8 rounded-xl bg-[#8a5b61]/10 hover:bg-[#8a5b61]/20 text-[#8a5b61] flex items-center justify-center shadow-2xs active:scale-95 transition-all cursor-pointer"
            title="Nghe phát âm"
          >
            <Volume2 className="w-4 h-4" />
          </button>
        )}

        {onNext && (
          <button
            onClick={onNext}
            className="py-1.5 px-3 rounded-xl bg-[#8a5b61] hover:bg-[#724a4f] text-white text-xs font-bold flex items-center justify-center gap-1 shadow-2xs active:scale-95 transition-all cursor-pointer"
            title="Chữ tiếp theo"
          >
            <Check className="w-3.5 h-3.5" />
            <span>Xong</span>
          </button>
        )}
      </div>

      {/* Step by step stroke order guide */}
      {strokeInfo && strokeInfo.steps && strokeInfo.steps.length > 0 && (
        <div className="w-full max-w-[280px] mt-2.5 pt-2 border-t border-gray-100 text-[11px] text-gray-600 space-y-1 text-left">
          <div className="font-bold text-gray-800 text-[11px] flex items-center justify-between">
            <span>Thứ tự nét viết:</span>
            {strokeInfo.formula && (
              <span className="text-[#8a5b61] font-bold text-[10px] bg-[#8a5b61]/10 px-1.5 py-0.5 rounded">
                {strokeInfo.formula}
              </span>
            )}
          </div>
          <ol className="list-none space-y-0.5 pl-0.5">
            {strokeInfo.steps.map((step, idx) => (
              <li key={idx} className="leading-snug flex items-start gap-1">
                <span className="w-3.5 h-3.5 rounded-full bg-gray-100 text-gray-500 font-mono text-[9px] flex items-center justify-center shrink-0 mt-0.5">
                  {idx + 1}
                </span>
                <span className="text-gray-700">{step.replace(/^\d+\.\s*/, "")}</span>
              </li>
            ))}
          </ol>
        </div>
      )}
    </div>
  );
};
