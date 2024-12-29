"use client";

import { useSetAtom } from "jotai";
import { useEffect } from "react";

import { setCountThemeAtom, setCountTimeAtom } from "@/store/setting";

type Props = {
  theme_count: number;
  time_limit: string;
};

export function InitializeSettings({ theme_count, time_limit }: Props) {
  const setCount = useSetAtom(setCountThemeAtom);
  const setTime = useSetAtom(setCountTimeAtom);

  useEffect(() => {
    setCount(theme_count);
    setTime(time_limit);
  }, [theme_count, time_limit, setCount, setTime]);

  return null;
}
