"use client";

import { useAtomValue, useSetAtom } from "jotai";
import { useEffect } from "react";

import {
  countTheme,
  countTime,
  setCountThemeAtom,
  setCountTimeAtom,
} from "@/store/setting";

type Props = {
  theme_count: number;
  time_limit: string;
};

export function InitializeSettings({ theme_count, time_limit }: Props) {
  const setCount = useSetAtom(setCountThemeAtom);
  const setTime = useSetAtom(setCountTimeAtom);
  const currentCount = useAtomValue(countTheme);
  const currentTime = useAtomValue(countTime);

  useEffect(() => {
    if (currentCount !== theme_count) {
      setCount(theme_count);
    }
    if (currentTime !== time_limit) {
      setTime(time_limit);
    }
  }, [theme_count, time_limit, currentCount, currentTime, setCount, setTime]);

  return null;
}
