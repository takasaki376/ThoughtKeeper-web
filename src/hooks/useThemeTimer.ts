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
        if (prevTime <= 1 && !isSavingRef.current) {
          isSavingRef.current = true;
          if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
          }

          // IMEの変換を確定させる処理
          // 現在フォーカスされている要素（入力フィールド）を取得
          const activeElement = document.activeElement;
          if (activeElement instanceof HTMLElement) {
            // フォーカスを外してIMEの変換を確定
            activeElement.blur();
            // 100ms待ってから保存処理を実行
            setTimeout(async () => {
              try {
                await onSave();
                if (currentIndex + 1 < themeCount) {
                  onThemeChange(currentIndex + 1);
                  setRemainingTime(initialTime);
                  // 新しいタイマーを開始
                  startTimer();
                } else {
                  router.push("/MemoList");
                }
              } catch (error) {
                console.error("保存処理でエラーが発生しました:", error);
                // エラー時もタイマーを再開
                setRemainingTime(initialTime);
                startTimer();
              } finally {
                isSavingRef.current = false;
              }
            }, 100);
          } else {
            // フォーカスされている要素がない場合は即座に保存処理を実行
            onSave()
              .then(() => {
                if (currentIndex + 1 < themeCount) {
                  onThemeChange(currentIndex + 1);
                  setRemainingTime(initialTime);
                  startTimer();
                } else {
                  router.push("/MemoList");
                }
              })
              .catch((error) => {
                console.error("保存処理でエラーが発生しました:", error);
                setRemainingTime(initialTime);
                startTimer();
              })
              .finally(() => {
                isSavingRef.current = false;
              });
          }

          return 0;
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
  }, [currentIndex, themeCount, onSave, onThemeChange, router, initialTime]);

  return {
    remainingTime,
    startTimer,
  };
};
