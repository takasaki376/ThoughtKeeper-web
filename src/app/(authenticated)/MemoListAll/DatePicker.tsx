import "@mantine/dates/styles.css";

import { Button, Indicator } from "@mantine/core";
import { DatePicker } from "@mantine/dates";
import { useAtomValue } from "jotai";
import { useState } from "react";

import { memoListAtom } from "@/store";

interface DatePickerProps {
  onDateChange: (date: Date | null) => void;
}

const DatePickerComponent: React.FC<DatePickerProps> = ({ onDateChange }) => {
  const memoList = useAtomValue(memoListAtom);
  const [filterDate, setFilterDate] = useState<Date | null>(null);

  // メモがある日付のリストを作成
  const memoDates = memoList.map((memo) => {
    const createdAt = new Date(memo.created_at);

    // 日本時間に変換
    createdAt.setHours(createdAt.getHours() + 9);
    return new Date(
      createdAt.getFullYear(),
      createdAt.getMonth(),
      createdAt.getDate()
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
    <div className="flex flex-col gap-2">
      <DatePicker
        value={filterDate}
        onChange={handleDateChange}
        size="xs"
        renderDay={(date) => {
          const day = date.getDate();
          const currentDate = new Date(
            date.getFullYear(),
            date.getMonth(),
            date.getDate()
          );
          const hasMemo = memoDates.some((memoDate) => {
            return (
              memoDate.getFullYear() === currentDate.getFullYear() &&
              memoDate.getMonth() === currentDate.getMonth() &&
              memoDate.getDate() === currentDate.getDate()
            );
          });
          return (
            <Indicator size={6} color="blue" offset={-2} disabled={!hasMemo}>
              <div>{day}</div>
            </Indicator>
          );
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
