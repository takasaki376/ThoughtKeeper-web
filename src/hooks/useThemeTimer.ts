// src/hooks/useThemeTimer.ts
import { useRouter } from "next/navigation";
import { useCallback, useRef, useState } from "react";

export const useThemeTimer = (
  initialTime: number,
  themeCount: number,
  currentIndex: number,
  onSave: () => Promise<void>,
  onThemeChange: (nextIndex: number) => void
) => {
  const [remainingTime, setRemainingTime] = useState(initialTime);
  const router = useRouter();
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const isSavingRef = useRef(false);

  const startTimer = useCallback(() => {
    // すでにタイマーが動いている場合は新しいタイマーを作成しない
    if (timerRef.current) {
      return () => {
        if (timerRef.current) {
          clearInterval(timerRef.current);
          timerRef.current = null;
        }
      };
    }

    timerRef.current = setInterval(async () => {
      setRemainingTime((prevTime) => {
        if (prevTime === 1 && !isSavingRef.current) {
          isSavingRef.current = true;
          
          const nextIndex = (currentIndex + 1) % themeCount;

          // 非同期で保存処理を実行
          Promise.resolve()
            .then(() => onSave())
            .then(() => {
              // 保存完了後にテーマを切り替え
              onThemeChange(nextIndex);
              
              // 全テーマを一巡したらページ遷移
              if (nextIndex === 0) {
                router.push("/MemoList");
              }
              
              isSavingRef.current = false;
            })
            .catch((error) => {
              console.error("保存処理でエラーが発生しました:", error);
              isSavingRef.current = false;
            });

          return initialTime;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [currentIndex, initialTime, themeCount, onSave, onThemeChange, router]);

  return {
    remainingTime,
    startTimer,
  };
};