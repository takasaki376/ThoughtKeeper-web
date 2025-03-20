import { atom } from "jotai";

export const memoListAtom = atom<{ content: string; date: string; theme: string; time: string }[]>([]);
export const initialText = atom("");
