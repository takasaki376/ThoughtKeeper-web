import { atom } from "jotai";

import { theme } from "@/mock/theme";

export const countTheme = atom(10);
export const countTime = atom("60");
export const initialText = atom("");
export const themeAtom = atom(theme);
