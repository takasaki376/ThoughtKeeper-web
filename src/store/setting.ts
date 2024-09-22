import { atom } from "jotai";

import { getThemes } from "@/pages/api/themes";

export const countTheme = atom(10);
export const countTime = atom("60");
export const initialText = atom("");

export const themeAtom = atom(async () => {
  const themes = await getThemes();
  return themes;
});
