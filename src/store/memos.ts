import { atom } from "jotai";


export const memoListAtom = atom<{ content: string; created_at:string; date: string; theme: string;time: string }[]>([]);
