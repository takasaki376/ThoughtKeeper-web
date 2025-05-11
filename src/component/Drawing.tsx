"use client";
import { useEffect, useRef, useState } from "react";

interface DrawingProps {
  onChange: (value: string) => void;
  value: string;
}

export const Drawing: React.FC<DrawingProps> = ({ onChange, value }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [context, setContext] = useState<CanvasRenderingContext2D | null>(null);
  const [canvasWidth, setCanvasWidth] = useState(800);

  useEffect(() => {
    // 画面幅の70%を計算
    const width = window.innerWidth * 0.7;
    setCanvasWidth(width);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle = "#000000";
    setContext(ctx);

    // 保存された画像がある場合は表示
    if (value) {
      const img = new Image();
      img.onload = () => {
        ctx.drawImage(img, 0, 0);
      };
      img.src = value;
    }
  }, [value]);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!context) return;
    const { offsetX, offsetY } = e.nativeEvent;
    context.beginPath();
    context.moveTo(offsetX, offsetY);
    setIsDrawing(true);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !context) return;
    const { offsetX, offsetY } = e.nativeEvent;
    context.lineTo(offsetX, offsetY);
    context.stroke();
  };

  const stopDrawing = () => {
    if (!context) return;
    context.closePath();
    setIsDrawing(false);

    // 描画内容をBase64形式で保存
    const canvas = canvasRef.current;
    if (canvas) {
      const dataUrl = canvas.toDataURL("image/png");
      onChange(dataUrl);
    }
  };

  const clearCanvas = () => {
    if (!context || !canvasRef.current) return;
    context.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    onChange("");
  };

  return (
    <div className="m-4 bg-lightGray p-4">
      <canvas
        ref={canvasRef}
        width={canvasWidth}
        height={400}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
        className="cursor-crosshair rounded border border-lightGray"
      />
      <button
        type="button"
        onClick={clearCanvas}
        className="mt-2 rounded bg-white px-4 py-2 hover:bg-gray"
      >
        クリア
      </button>
    </div>
  );
};
