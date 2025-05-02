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

          // IMEの変換を確定させる処理
          // 現在フォーカスされている要素（入力フィールド）を取得
          const activeElement = document.activeElement as HTMLElement;
          if (activeElement) {
            // フォーカスを外してIMEの変換を確定させる
            // これにより、未確定の日本語入力が確定される
            activeElement.blur();

            // IMEの変換が確定するのを待つため、少し待機してから保存処理を実行
            // 100msの待機時間は、IMEの変換確定に必要な時間を考慮した値
            setTimeout(async () => {
              try {
                // 保存処理を実行
                await onSave();

                // 保存完了後の処理
                if (currentIndex + 1 < themeCount) {
                  // 次のテーマが存在する場合
                  // テーマを切り替え、タイマーをリセット
                  onThemeChange(currentIndex + 1);
                  setRemainingTime(initialTime);
                } else {
                  // 最後のテーマの場合
                  // 保存処理が確実に完了するのを待ってからページ遷移
                  setTimeout(() => {
                    router.push("/MemoList");
                  }, 100);
                }
              } catch (error) {
                console.error("保存処理でエラーが発生しました:", error);
              } finally {
                // 保存処理の完了後、保存中フラグをリセット
                isSavingRef.current = false;
              }
            }, 100);
          } else {
            // アクティブな要素がない場合（フォーカスされていない場合）の処理
            // 通常の保存処理を実行
            Promise.resolve()
              .then(() => onSave())
              .then(() => {
                if (currentIndex + 1 < themeCount) {
                  onThemeChange(currentIndex + 1);
                  setRemainingTime(initialTime);
                } else {
                  setTimeout(() => {
                    router.push("/MemoList");
                  }, 100);
                }
                isSavingRef.current = false;
              })
              .catch((error) => {
                console.error("保存処理でエラーが発生しました:", error);
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
