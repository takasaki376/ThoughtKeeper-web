import "@mantine/dates/styles.css";

import { Button } from "@mantine/core";
import { DatePicker } from "@mantine/dates";
import { useState } from "react";

import type { Memo } from "@/types/database";

interface DatePickerProps {
  onDateChange: (date: Date | null) => void;
  memos: Memo[];
}

const DatePickerComponent: React.FC<DatePickerProps> = ({ onDateChange, memos }) => {
  const [filterDate, setFilterDate] = useState<Date | null>(null);

  // メモがある日付のリストを作成
  const memoDates = memos.map((memo) => {
    const createdAt = new Date(memo.created_at);
    // 日付のみを比較するために時間を0時に設定（ローカルタイムゾーン）
    return new Date(
      createdAt.getFullYear(),
      createdAt.getMonth(),
      createdAt.getDate(),
      0,
      0,
      0,
      0
    );
  });

  const handleDateChange = (date: Date | null) => {
    setFilterDate(date);
    onDateChange(date);
  };

  const handleClear = () => {
    setFilterDate(null);
    onDateChange(null);
  };

  return (
    <div className="mb-5 flex flex-col items-center gap-2">
      <DatePicker
        value={filterDate}
        onChange={handleDateChange}
        size="md"
        excludeDate={(date) => {
          // 比較する日付の時間も0時に設定（ローカルタイムゾーン）
          const currentDate = new Date(
            date.getFullYear(),
            date.getMonth(),
            date.getDate(),
            0,
            0,
            0,
            0
          );
          // メモがある日付は選択可能（falseを返す）、メモがない日付は選択不可（trueを返す）
          const hasMemo = memoDates.some((memoDate) => {
            return memoDate.getTime() === currentDate.getTime();
          });
          return !hasMemo;
        }}
      />
      {filterDate && (
        <Button size="xs" variant="subtle" onClick={handleClear}>
          クリア
        </Button>
      )}
    </div>
  );
};

export default DatePickerComponent;
